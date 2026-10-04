import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRICES, formatPrice, toStripeAmount, type Currency, type MinutePackId } from "@/lib/pricing";
import { resolveCurrency } from "@/lib/pricing-server";

type Plan = "personal" | "team";
type BillingPeriod = "monthly" | "annual";
// A team is 2 to 10 people, leader included. Bigger teams go through "contact us".
const MIN_TEAM_SIZE = 2;
const MAX_TEAM_SIZE = 10;
type AdminClient = ReturnType<typeof createAdminClient>;
type SupabaseUser = { id: string; email?: string | null };

// Live Stripe Price IDs — Crispy Development Ltd, acct_1UGD0fEHeFAKCmjl.
// Not secrets (Price IDs are safe to expose), so kept inline rather than as
// env vars. See agents/memory/reference_stripe_live.md for the catalog log.
const PRICE_IDS: Record<Plan, Record<"monthly" | "annual", string>> = {
  personal: {
    monthly: "price_1UGWboEHeFAKCmjlQE6vXUys",
    annual: "price_1UGWbqEHeFAKCmjlwxphUPXY",
  },
  team: {
    monthly: "price_1UGWbsEHeFAKCmjlpjQ76Uhz",
    annual: "price_1UGWbuEHeFAKCmjl6utBoomK",
  },
};

// One-time purchases are charged with price_data on the existing Stripe
// Products, in the buyer's currency, with amounts from lib/pricing.ts (prices
// set by Chris 2026-10-04). The server picks the currency (locked currency >
// IP country > USD), so the browser can't choose a cheaper one.
// Product IDs are not secrets. Their old USD Prices are no longer used here.
const PRODUCTS = {
  personal: "prod_VJSQGIYlS50ZwZ", // Personal, permanent access
  seat: "prod_VKxGwmNAxaj8GO", // Team seat (also seat top-ups + Personal->Team upgrade)
} as const;

// One-off coaching-minute packs.
const MINUTE_PACKS: Record<MinutePackId, { productId: string; minutes: number }> = {
  "1hr": { productId: "prod_VHAEGbmRpsWReQ", minutes: 60 },
  "3hr": { productId: "prod_VHAEDrKGamJ1cp", minutes: 180 },
  "5hr": { productId: "prod_VHAEEefJ5TovIn", minutes: 300 },
};

function priceData(currency: Currency, product: string, amount: number) {
  return { currency, product, unit_amount: toStripeAmount(amount) };
}

// Non-USD sessions are already in the buyer's own currency, so Stripe's
// Adaptive Pricing (live-rate conversion to a local currency) stays off for
// them. USD sessions keep the account default.
function adaptive(currency: Currency) {
  return currency === "usd" ? {} : { adaptive_pricing: { enabled: false } };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { plan, billingPeriod, type, packId, quantity } = (body ?? {}) as {
    plan?: Plan;
    billingPeriod?: BillingPeriod;
    type?: "subscription" | "minute_pack" | "lifetime" | "seat";
    packId?: MinutePackId;
    quantity?: number;
  };

  const restrictedKey = process.env.STRIPE_RESTRICTED_KEY;
  if (!restrictedKey) {
    return NextResponse.json({ ready: false, checkoutUrl: null });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "auth_required", checkoutUrl: null }, { status: 401 });
  }

  const stripe = new Stripe(restrictedKey, { apiVersion: "2026-08-26.dahlia" });
  const admin = createAdminClient();
  const customerId = await getOrCreateCustomer(stripe, admin, user);
  const cur = await resolveCurrency(user.id);
  const prices = PRICES[cur];

  if (type === "minute_pack") {
    if (!packId || !(packId in MINUTE_PACKS)) {
      return NextResponse.json({ error: "invalid_pack", checkoutUrl: null }, { status: 400 });
    }
    const { productId, minutes } = MINUTE_PACKS[packId];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price_data: priceData(cur, productId, prices.minutes[packId]), quantity: 1 }],
      ...adaptive(cur),
      billing_address_collection: "required",
      managed_payments: { enabled: false },
      // Generates a real Stripe Invoice for this one-off purchase (not just a
      // charge receipt), so it shows up in the Stripe Customer Portal's
      // "Invoice History" alongside subscription invoices — same list, same
      // format. Chris requested this 2026-09-17 (Telegram msg 15620).
      invoice_creation: { enabled: true },
      success_url: `${siteUrl}/coach?checkout=success`,
      cancel_url: `${siteUrl}/coach?checkout=cancelled`,
      metadata: { user_id: user.id, minute_pack: "true", pack_id: packId, minutes: String(minutes) },
    });

    return NextResponse.json({ ready: true, checkoutUrl: session.url });
  }

  if (type === "lifetime") {
    if (!plan || !["personal", "team"].includes(plan)) {
      return NextResponse.json({ error: "invalid_plan", checkoutUrl: null }, { status: 400 });
    }
    const teamSize = Number(quantity);
    if (plan === "team" && (!Number.isInteger(teamSize) || teamSize < MIN_TEAM_SIZE || teamSize > MAX_TEAM_SIZE)) {
      return NextResponse.json({ error: "invalid_quantity", checkoutUrl: null }, { status: 400 });
    }
    const upgrade = plan === "team" && (await hasPaidPersonal(stripe, admin, user.id, customerId));
    // Personal -> Team upgrade: someone who already paid for Personal pays
    // only the difference for their own seat; every other person pays the
    // full seat price. Same currency both times thanks to the currency lock.
    // Chris requested 2026-10-02 (Telegram msg 17577).
    const seatItem = (qty: number) => ({ price_data: priceData(cur, PRODUCTS.seat, prices.seat), quantity: qty });
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = plan !== "team"
      ? [{ price_data: priceData(cur, PRODUCTS.personal, prices.personal), quantity: 1 }]
      : upgrade
        ? [
            { price_data: priceData(cur, PRODUCTS.seat, prices.seat - prices.personal), quantity: 1 },
            seatItem(teamSize - 1),
          ]
        : [seatItem(teamSize)];
    const fmt = (n: number) => formatPrice(cur, n);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: lineItems,
      ...(upgrade
        ? {
            custom_text: {
              submit: {
                message: `You already own Personal, so your own seat is ${fmt(prices.seat - prices.personal)} (the ${fmt(prices.personal)} you paid counts). Each other person is ${fmt(prices.seat)}.`,
              },
            },
          }
        : {}),
      ...adaptive(cur),
      billing_address_collection: "required",
      // Same Managed Payments workaround as the subscription/minute_pack
      // flows above — our Products don't carry a tax_code, so it 400s
      // otherwise.
      managed_payments: { enabled: false },
      invoice_creation: { enabled: true },
      success_url: `${siteUrl}/account/subscription?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      metadata: {
        user_id: user.id,
        lifetime: "true",
        plan,
        ...(plan === "team" ? { team_size: String(teamSize) } : {}),
        ...(upgrade ? { personal_upgrade: "true" } : {}),
      },
    });

    return NextResponse.json({ ready: true, checkoutUrl: session.url });
  }

  if (type === "seat") {
    const seatCount = Number(quantity);
    if (!Number.isInteger(seatCount) || seatCount < 1) {
      return NextResponse.json({ error: "invalid_quantity", checkoutUrl: null }, { status: 400 });
    }

    // Only that team's actual leader can buy seats for it.
    const { data: teamRow } = await admin
      .from("teams")
      .select("id, max_seats")
      .eq("leader_user_id", user.id)
      .maybeSingle();
    if (!teamRow) {
      return NextResponse.json({ error: "not_team_leader", checkoutUrl: null }, { status: 403 });
    }

    // Keep the team at 10 people or fewer, leader included. max_seats counts
    // member seats only, so the leader is the +1.
    const peopleNow = 1 + (teamRow.max_seats ?? 0);
    if (peopleNow + seatCount > MAX_TEAM_SIZE) {
      return NextResponse.json({ error: "team_full", checkoutUrl: null }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price_data: priceData(cur, PRODUCTS.seat, prices.seat), quantity: seatCount }],
      ...adaptive(cur),
      billing_address_collection: "required",
      managed_payments: { enabled: false },
      invoice_creation: { enabled: true },
      success_url: `${siteUrl}/dashboard/team-settings?checkout=success#members`,
      cancel_url: `${siteUrl}/dashboard/team-settings#members`,
      metadata: {
        user_id: user.id,
        seat_purchase: "true",
        team_id: teamRow.id,
        quantity: String(seatCount),
      },
    });

    return NextResponse.json({ ready: true, checkoutUrl: session.url });
  }

  if (!plan || !["personal", "team"].includes(plan)) {
    return NextResponse.json({ error: "invalid_plan", checkoutUrl: null }, { status: 400 });
  }
  if (!billingPeriod || !["monthly", "annual"].includes(billingPeriod)) {
    return NextResponse.json({ error: "invalid_billing_period", checkoutUrl: null }, { status: 400 });
  }

  const priceId = PRICE_IDS[plan][billingPeriod];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    billing_address_collection: "required", // needed for UK VAT country tagging (step 7)
    // Managed Payments is on by default for this account and requires every
    // Product to carry a Stripe tax_code — ours don't, so it 400s on every
    // session create. Disable it per-session rather than editing the catalog.
    managed_payments: { enabled: false },
    success_url: `${siteUrl}/account/subscription?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
    metadata: { user_id: user.id, plan, billing_period: billingPeriod },
    subscription_data: {
      metadata: { user_id: user.id, plan, billing_period: billingPeriod },
    },
  });

  return NextResponse.json({ ready: true, checkoutUrl: session.url });
}

// True only for someone who actually paid for lifetime Personal: a completed,
// paid Stripe checkout tagged lifetime/personal on their customer. Free/comped
// accounts have no such checkout and pay full price. Someone who already leads
// a paid team doesn't get the credit again (they add people via seat top-ups).
async function hasPaidPersonal(stripe: Stripe, admin: AdminClient, userId: string, customerId: string) {
  const { data: teamRow } = await admin
    .from("teams")
    .select("subscription_active")
    .eq("leader_user_id", userId)
    .maybeSingle();
  if (teamRow?.subscription_active) return false;

  const sessions = await stripe.checkout.sessions.list({ customer: customerId, status: "complete", limit: 100 });
  return sessions.data.some(
    (s) =>
      s.payment_status === "paid" &&
      s.metadata?.lifetime === "true" &&
      s.metadata?.plan === "personal" &&
      s.metadata?.user_id === userId,
  );
}

// Reuse an existing Stripe Customer for this user if one exists (from a
// prior checkout — personal membership row or team-leader row), otherwise
// create one now so the Billing Portal has something to attach to.
async function getOrCreateCustomer(stripe: Stripe, admin: AdminClient, user: SupabaseUser) {
  const [{ data: membershipRow }, { data: teamRow }] = await Promise.all([
    admin.from("memberships").select("stripe_customer_id").eq("user_id", user.id).maybeSingle(),
    admin.from("teams").select("stripe_customer_id").eq("leader_user_id", user.id).maybeSingle(),
  ]);

  const existingId = membershipRow?.stripe_customer_id ?? teamRow?.stripe_customer_id ?? null;
  if (existingId) return existingId;

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    metadata: { user_id: user.id },
  });
  // Save immediately so a retry/abandoned checkout doesn't create duplicate
  // Stripe Customers for the same user. Cheapest place: the personal
  // membership row, upserted regardless of which plan they're buying.
  await admin
    .from("memberships")
    .upsert({ user_id: user.id, stripe_customer_id: customer.id }, { onConflict: "user_id" });

  return customer.id;
}
