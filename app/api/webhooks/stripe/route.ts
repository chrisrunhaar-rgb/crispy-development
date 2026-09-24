import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Webhook endpoint for the live Crispy Development Ltd Stripe account.
// Handles subscription lifecycle events for both Personal and Team plans.
// Idempotency: every event id is inserted into `stripe_events` before
// processing; a unique-violation (23505) on that insert means we've already
// handled this event, so we ack (200) and skip re-processing.

const restrictedKey = process.env.STRIPE_RESTRICTED_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!restrictedKey || !webhookSecret) {
    // Misconfigured — ack nothing, let Stripe retry once env vars are set.
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
  }

  const stripe = new Stripe(restrictedKey, { apiVersion: "2026-08-26.dahlia" });
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("missing signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency gate — insert-first, unique violation means "already seen."
  const { error: insertError } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });
  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("stripe_events insert failed:", insertError);
    // Don't silently drop the event on an unrelated DB error — let Stripe retry.
    return NextResponse.json({ error: "idempotency_check_failed" }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(admin, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionRevoked(admin, event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.status === "unpaid" || sub.status === "canceled" || sub.status === "incomplete_expired") {
          await handleSubscriptionRevoked(admin, sub);
        }
        break;
      }
      default:
        // No-op for anything else we haven't been asked to handle.
        break;
    }
  } catch (err) {
    console.error(`Error handling Stripe webhook event ${event.type} (${event.id}):`, err);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

type AdminClient = ReturnType<typeof createAdminClient>;

async function handleCheckoutCompleted(admin: AdminClient, session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id ?? session.metadata?.user_id;

  // One-off coaching-minute pack purchase — separate from the subscription
  // flow below. Must ADD to coach_minutes_granted, never overwrite it, or a
  // later subscription-renewal event would wipe out a purchased top-up.
  if (session.mode === "payment" && session.metadata?.minute_pack === "true") {
    const minutes = Number(session.metadata?.minutes ?? 0);
    if (!userId || !minutes) {
      console.error("checkout.session.completed minute_pack missing user_id/minutes metadata", session.id);
      return;
    }
    const { error } = await admin.rpc("increment_coach_minutes", {
      p_user_id: userId,
      p_minutes: minutes,
    });
    if (error) {
      console.error("increment_coach_minutes failed", session.id, error);
      throw error; // let Stripe retry rather than silently dropping the purchase
    }
    return;
  }

  // One-off lifetime-access purchase (Personal/Team) — replaces the
  // recurring subscription flow below for these plans. Grants permanent
  // access with no coach minutes (WayPoint AI coaching is intentionally
  // excluded from this tier). NOTE: a lifetime purchase has no Stripe
  // subscription to auto-cancel on refund, so revoking access after a
  // refund is a manual step — flip subscription_active to false on the row.
  if (session.mode === "payment" && session.metadata?.lifetime === "true") {
    const lifetimePlan = session.metadata?.plan;
    if (!userId || !lifetimePlan) {
      console.error("checkout.session.completed lifetime missing user_id/plan metadata", session.id);
      return;
    }
    const lifetimeCustomerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

    if (lifetimePlan === "team") {
      const { data: existingTeam } = await admin
        .from("teams")
        .select("id")
        .eq("leader_user_id", userId)
        .maybeSingle();

      const teamPatch: Record<string, unknown> = {
        subscription_active: true,
        stripe_customer_id: lifetimeCustomerId,
      };

      if (existingTeam) {
        await admin.from("teams").update(teamPatch).eq("id", existingTeam.id);
      } else {
        const { data: existingUser } = await admin.auth.admin.getUserById(userId);
        const firstName = existingUser?.user?.user_metadata?.first_name as string | undefined;
        const name = firstName ? `${firstName}'s Team` : "My Team";
        await admin.from("teams").insert({
          leader_user_id: userId,
          name,
          language: "en",
          max_seats: 8,
          ...teamPatch,
        });
      }

      const { data: existingUser } = await admin.auth.admin.getUserById(userId);
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: { ...existingUser?.user?.user_metadata, pathway: "team", is_leader: true },
      });
    } else {
      const membershipPatch: Record<string, unknown> = {
        user_id: userId,
        subscription_active: true,
        stripe_customer_id: lifetimeCustomerId,
      };
      await admin.from("memberships").upsert(membershipPatch, { onConflict: "user_id" });

      const { data: existingUser } = await admin.auth.admin.getUserById(userId);
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: { ...existingUser?.user?.user_metadata, pathway: "personal" },
      });
    }
    return;
  }

  const plan = session.metadata?.plan;
  const billingPeriod = session.metadata?.billing_period;

  if (!userId || !plan) {
    console.error("checkout.session.completed missing user_id/plan metadata", session.id);
    return;
  }

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  // UK VAT threshold tracking (step 7) — country only, no gating/charging logic.
  const billingCountry = session.customer_details?.address?.country ?? null;

  if (plan === "team") {
    const { data: existingTeam } = await admin
      .from("teams")
      .select("id")
      .eq("leader_user_id", userId)
      .maybeSingle();

    const teamPatch: Record<string, unknown> = {
      subscription_active: true,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      billing_country: billingCountry,
      billing_period: billingPeriod ?? null,
    };

    if (existingTeam) {
      await admin.from("teams").update(teamPatch).eq("id", existingTeam.id);
    } else {
      const { data: existingUser } = await admin.auth.admin.getUserById(userId);
      const firstName = existingUser?.user?.user_metadata?.first_name as string | undefined;
      const name = firstName ? `${firstName}'s Team` : "My Team";
      await admin.from("teams").insert({
        leader_user_id: userId,
        name,
        language: "en",
        max_seats: 8,
        ...teamPatch,
      });
    }

    // Coach minutes live per-user on `memberships`, not pooled on `teams` — the
    // leader needs their own row same as any member. Team Annual grants 30 min
    // to the leader at subscription time; Team Monthly grants none. Minutes are
    // ADDED via increment_coach_minutes, never set with a plain upsert — a flat
    // upsert would overwrite (wipe out) any minutes the leader separately
    // bought via a one-off pack. Bug found + fixed 2026-09-17 (Chris, Telegram).
    const leaderMembershipPatch: Record<string, unknown> = {
      user_id: userId,
      coach_access: billingPeriod === "annual",
    };
    await admin.from("memberships").upsert(leaderMembershipPatch, { onConflict: "user_id" });
    if (billingPeriod === "annual") {
      const { error: leaderMinutesError } = await admin.rpc("increment_coach_minutes", {
        p_user_id: userId,
        p_minutes: 30,
      });
      if (leaderMinutesError) {
        console.error("increment_coach_minutes failed (team leader annual)", userId, leaderMinutesError);
        throw leaderMinutesError;
      }
    }

    // Mirror updateMemberSubscription()'s metadata convention so the team
    // leader is recognized as a leader across the rest of the app.
    const { data: existingUser } = await admin.auth.admin.getUserById(userId);
    await admin.auth.admin.updateUserById(userId, {
      user_metadata: { ...existingUser?.user?.user_metadata, pathway: "team", is_leader: true },
    });
  } else {
    // Personal plan. Mirrors acceptMemberInvite()'s upsert shape.
    // Personal Monthly = 0 coaching minutes, Personal Annual = 60, per pricing copy.
    // Minutes are ADDED via increment_coach_minutes, never set with a plain
    // upsert — a flat upsert would overwrite (wipe out) any minutes the user
    // separately bought via a one-off pack. Bug found + fixed 2026-09-17
    // (Chris, Telegram): his $10/60-min pack purchase was at risk of being
    // erased by a subsequent subscription checkout under the old logic.
    const membershipPatch: Record<string, unknown> = {
      user_id: userId,
      subscription_active: true,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      billing_country: billingCountry,
      coach_access: billingPeriod === "annual",
    };
    await admin.from("memberships").upsert(membershipPatch, { onConflict: "user_id" });
    if (billingPeriod === "annual") {
      const { error: minutesError } = await admin.rpc("increment_coach_minutes", {
        p_user_id: userId,
        p_minutes: 60,
      });
      if (minutesError) {
        console.error("increment_coach_minutes failed (personal annual)", userId, minutesError);
        throw minutesError;
      }
    }

    const { data: existingUser } = await admin.auth.admin.getUserById(userId);
    await admin.auth.admin.updateUserById(userId, {
      user_metadata: { ...existingUser?.user?.user_metadata, pathway: "personal" },
    });
  }
}

async function handleSubscriptionRevoked(admin: AdminClient, subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  const { data: membership } = await admin
    .from("memberships")
    .select("user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  if (membership) {
    await admin
      .from("memberships")
      .update({ subscription_active: false, coach_access: false })
      .eq("stripe_subscription_id", subscriptionId);
    return;
  }

  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  if (team) {
    await admin.from("teams").update({ subscription_active: false }).eq("stripe_subscription_id", subscriptionId);
  }
}
