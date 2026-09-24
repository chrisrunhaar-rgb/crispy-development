import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Plan = "personal" | "team";
type Currency = "usd" | "idr";
type BillingPeriod = "monthly" | "annual";
type MinutePackId = "1hr" | "3hr" | "5hr";
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

// One-off coaching-minute packs — mode: "payment", not "subscription".
// Pricing confirmed by Chris via Telegram msg 15604, 2026-09-17.
const MINUTE_PACKS: Record<MinutePackId, { priceId: string; minutes: number }> = {
  "1hr": { priceId: "price_1UGbuLEHeFAKCmjlj2wQNnue", minutes: 60 },
  "3hr": { priceId: "price_1UGbuNEHeFAKCmjlOjwyDrEd", minutes: 180 },
  "5hr": { priceId: "price_1UGbuOEHeFAKCmjl8FjtI5AZ", minutes: 300 },
};

// One-time lifetime-access purchases — mode: "payment", replaces the
// recurring Personal/Team subscription on the pricing page. USD-only, no
// IDR equivalent exists for these prices. Confirmed live/active via Stripe
// MCP before wiring, per Chris's approved spec, 2026-09-24.
const LIFETIME_PRICE_IDS: Record<Plan, string> = {
  personal: "price_1UIpVjEHeFAKCmjlRYPEMscj",
  team: "price_1UIpVnEHeFAKCmjl5v9NUu4G",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { plan, currency, billingPeriod, type, packId } = (body ?? {}) as {
    plan?: Plan;
    currency?: Currency;
    billingPeriod?: BillingPeriod;
    type?: "subscription" | "minute_pack" | "lifetime";
    packId?: MinutePackId;
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

  if (type === "minute_pack") {
    if (!packId || !(packId in MINUTE_PACKS)) {
      return NextResponse.json({ error: "invalid_pack", checkoutUrl: null }, { status: 400 });
    }
    const { priceId, minutes } = MINUTE_PACKS[packId];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
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
    const priceId = LIFETIME_PRICE_IDS[plan];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      billing_address_collection: "required",
      // Same Managed Payments workaround as the subscription/minute_pack
      // flows above — our Products don't carry a tax_code, so it 400s
      // otherwise.
      managed_payments: { enabled: false },
      invoice_creation: { enabled: true },
      success_url: `${siteUrl}/account/subscription?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      metadata: { user_id: user.id, lifetime: "true", plan },
    });

    return NextResponse.json({ ready: true, checkoutUrl: session.url });
  }

  if (!plan || !["personal", "team"].includes(plan)) {
    return NextResponse.json({ error: "invalid_plan", checkoutUrl: null }, { status: 400 });
  }
  if (!billingPeriod || !["monthly", "annual"].includes(billingPeriod)) {
    return NextResponse.json({ error: "invalid_billing_period", checkoutUrl: null }, { status: 400 });
  }

  // Indonesia/IDR checkout is explicitly parked (step 8) — not built yet.
  if (currency === "idr") {
    return NextResponse.json({ error: "not_available", checkoutUrl: null }, { status: 400 });
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
