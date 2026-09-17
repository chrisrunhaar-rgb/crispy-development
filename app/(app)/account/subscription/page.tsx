import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPortalSession, submitSubscriptionQuestion } from "./actions";

export const metadata = { title: "Subscription — Crispy Development" };

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [{ data: membership }, { data: leaderTeam }, { data: memberRow }] = await Promise.all([
    admin.from("memberships").select("subscription_active, stripe_customer_id, stripe_subscription_id").eq("user_id", user.id).maybeSingle(),
    admin.from("teams").select("subscription_active, stripe_customer_id, stripe_subscription_id, name").eq("leader_user_id", user.id).maybeSingle(),
    admin.from("team_members").select("team_id").eq("user_id", user.id).maybeSingle(),
  ]);

  let memberOfTeam: { subscription_active: boolean; name: string } | null = null;
  if (!leaderTeam && memberRow?.team_id) {
    const { data } = await admin
      .from("teams")
      .select("subscription_active, name")
      .eq("id", memberRow.team_id)
      .maybeSingle();
    memberOfTeam = data;
  }

  let pathwayLabel = "Free";
  let isActive = false;
  let canManage = false;
  let managedByLeaderNote = false;
  let subscriptionId: string | null = null;

  if (leaderTeam) {
    pathwayLabel = "Team (Leader)";
    isActive = leaderTeam.subscription_active === true;
    canManage = !!leaderTeam.stripe_customer_id;
    subscriptionId = leaderTeam.stripe_subscription_id ?? null;
  } else if (memberOfTeam) {
    pathwayLabel = "Team (Member)";
    isActive = memberOfTeam.subscription_active === true;
    managedByLeaderNote = true;
  } else if (membership) {
    pathwayLabel = "Personal";
    isActive = membership.subscription_active === true;
    canManage = !!membership.stripe_customer_id;
    subscriptionId = membership.stripe_subscription_id ?? null;
  }

  // Stripe portal cancellations only take effect at period end — status stays
  // "active" and our webhook has no handler for that transition, so the only
  // way to know a cancellation is pending is to ask Stripe directly here.
  let cancelAtPeriodEnd = false;
  let periodEndLabel: string | null = null;
  const restrictedKey = process.env.STRIPE_RESTRICTED_KEY;
  if (isActive && subscriptionId && restrictedKey) {
    try {
      const stripe = new Stripe(restrictedKey, { apiVersion: "2026-08-26.dahlia" });
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      // Stripe sets EITHER cancel_at_period_end (boolean) OR cancel_at (a specific
      // timestamp) depending on how the cancellation was requested — the billing
      // portal used here sets cancel_at, so both must be checked.
      cancelAtPeriodEnd = sub.cancel_at_period_end === true || sub.cancel_at != null;
      const periodEnd = sub.cancel_at ?? sub.items.data[0]?.current_period_end;
      if (cancelAtPeriodEnd && periodEnd) {
        periodEndLabel = new Date(periodEnd * 1000).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (err) {
      console.error("Failed to fetch live Stripe subscription status:", err);
    }
  }

  const portalUnavailable = params?.portal === "unavailable";
  const checkoutSuccess = params?.checkout === "success";
  const questionSent = params?.question === "sent";
  const questionEmpty = params?.question === "empty";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 140px)", paddingBlock: "clamp(2rem, 4vw, 4rem)" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 1.5rem" }}>

        <Link
          href="/dashboard"
          style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "2rem" }}
        >
          ← Dashboard
        </Link>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
          My Subscription
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, marginBottom: "2rem", lineHeight: 1.2 }}>
          Plan & Billing
        </h1>

        {checkoutSuccess && (
          <div style={{ background: "oklch(65% 0.15 45 / 0.1)", border: "1px solid oklch(65% 0.15 45 / 0.3)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: navy, margin: 0 }}>
              Thanks — your subscription is being set up. This page will reflect it shortly.
            </p>
          </div>
        )}

        {questionSent && (
          <div style={{ background: "oklch(65% 0.15 45 / 0.1)", border: "1px solid oklch(65% 0.15 45 / 0.3)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: navy, margin: 0 }}>
              Thanks — your question has been sent. We&apos;ll get back to you by email shortly.
            </p>
          </div>
        )}

        {questionEmpty && (
          <div style={{ background: "oklch(60% 0.18 25 / 0.08)", border: "1px solid oklch(60% 0.18 25 / 0.3)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(40% 0.18 25)", margin: 0 }}>
              Please enter your question before sending.
            </p>
          </div>
        )}

        {portalUnavailable && (
          <div style={{ background: "oklch(60% 0.18 25 / 0.08)", border: "1px solid oklch(60% 0.18 25 / 0.3)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(40% 0.18 25)", margin: 0 }}>
              Billing management isn&apos;t available for this account yet. If you believe this is a mistake, contact support.
            </p>
          </div>
        )}

        {/* Current plan */}
        <div style={{ background: "oklch(100% 0 0)", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.75rem" }}>
            Current Plan
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy }}>
              {pathwayLabel}
            </span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.2rem 0.6rem", background: !isActive ? "oklch(88% 0.008 80)" : cancelAtPeriodEnd ? "oklch(65% 0.15 45 / 0.12)" : "oklch(60% 0.15 150 / 0.12)", color: !isActive ? "oklch(52% 0.008 260)" : cancelAtPeriodEnd ? "oklch(50% 0.15 45)" : "oklch(45% 0.15 150)", border: `1px solid ${!isActive ? "oklch(80% 0.008 80)" : cancelAtPeriodEnd ? "oklch(65% 0.15 45 / 0.35)" : "oklch(60% 0.15 150 / 0.3)"}` }}>
              {isActive ? (cancelAtPeriodEnd && periodEndLabel ? `Active until ${periodEndLabel}` : "Active") : "Free"}
            </span>
          </div>
          {pathwayLabel === "Free" && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              You have access to free resources and the Influential Leadership challenge.
            </p>
          )}
          {cancelAtPeriodEnd && periodEndLabel && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Your subscription is cancelled and will not renew. You&apos;ll keep full access until {periodEndLabel}.
            </p>
          )}
          {managedByLeaderNote && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Your seat is part of a Team plan. Billing is managed by your team leader.
            </p>
          )}
        </div>

        {/* Manage / cancel */}
        {canManage ? (
          <form action={createPortalSession}>
            <button
              type="submit"
              style={{
                width: "100%",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.02em",
                color: "#fff",
                background: navy,
                border: "none",
                padding: "0.9rem 1.5rem",
                cursor: "pointer",
              }}
            >
              Manage subscription
            </button>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)", marginTop: "0.6rem", textAlign: "center" }}>
              Update payment details, view invoices, or cancel any time — no cancellation fees.
            </p>
          </form>
        ) : !managedByLeaderNote && pathwayLabel === "Free" ? (
          <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem", borderLeft: "3px solid oklch(65% 0.15 45)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)", lineHeight: 1.7, margin: 0 }}>
              You&apos;re on the free plan.{" "}
              <Link href="/pricing" style={{ color: orange, fontWeight: 700 }}>
                See plans
              </Link>{" "}
              to unlock Personal or Team access.
            </p>
          </div>
        ) : null}

        {/* Ask a question */}
        <div style={{ background: "oklch(100% 0 0)", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem", marginTop: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.75rem" }}>
            Questions about your subscription?
          </p>
          <form action={submitSubscriptionQuestion}>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Ask us anything about your plan, billing, or invoices..."
              style={{
                width: "100%",
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.85rem",
                color: navy,
                border: "1px solid oklch(85% 0.008 80)",
                padding: "0.75rem",
                resize: "vertical",
                marginBottom: "0.75rem",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.02em",
                color: navy,
                background: "#fff",
                border: `1px solid ${navy}`,
                padding: "0.8rem 1.5rem",
                cursor: "pointer",
              }}
            >
              Send question
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
