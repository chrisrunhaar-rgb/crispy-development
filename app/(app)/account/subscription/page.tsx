import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPortalSession, submitSubscriptionQuestion } from "./actions";

export const metadata = { title: "Plan & Billing — Crispy Development" };

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
  let stripeCustomerId: string | null = null;

  if (leaderTeam) {
    pathwayLabel = "Team (Leader)";
    isActive = leaderTeam.subscription_active === true;
    canManage = !!leaderTeam.stripe_customer_id;
    subscriptionId = leaderTeam.stripe_subscription_id ?? null;
    stripeCustomerId = leaderTeam.stripe_customer_id ?? null;
  } else if (memberOfTeam) {
    pathwayLabel = "Team (Member)";
    isActive = memberOfTeam.subscription_active === true;
    managedByLeaderNote = true;
  } else if (membership) {
    pathwayLabel = "Personal";
    isActive = membership.subscription_active === true;
    canManage = !!membership.stripe_customer_id;
    subscriptionId = membership.stripe_subscription_id ?? null;
    stripeCustomerId = membership.stripe_customer_id ?? null;
  }

  // A lifetime purchase creates a Stripe customer (for the invoice) but never
  // a subscription — that's the one reliable way to tell it apart here from
  // a legacy Monthly/Annual subscriber, who still has a stripe_subscription_id.
  const isLifetime = isActive && !!stripeCustomerId && !subscriptionId;

  // Stripe portal cancellations only take effect at period end — status stays
  // "active" and our webhook has no handler for that transition, so the only
  // way to know a cancellation is pending is to ask Stripe directly here.
  let cancelAtPeriodEnd = false;
  let periodEndLabel: string | null = null;
  const restrictedKey = process.env.STRIPE_RESTRICTED_KEY;
  const stripe = restrictedKey ? new Stripe(restrictedKey, { apiVersion: "2026-08-26.dahlia" }) : null;

  if (isActive && subscriptionId && stripe) {
    try {
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

  // Lifetime purchases have no subscription to manage, but `invoice_creation`
  // was enabled at checkout, so the receipt lives on a Stripe invoice tied to
  // the customer — fetch it to show directly on the page instead of sending
  // the user into the (subscription-oriented) Billing Portal.
  let invoice: { hostedUrl: string | null; pdfUrl: string | null; date: string | null; amount: string | null } | null = null;
  if (isLifetime && stripeCustomerId && stripe) {
    try {
      const invoices = await stripe.invoices.list({ customer: stripeCustomerId, limit: 1 });
      const inv = invoices.data[0];
      if (inv) {
        invoice = {
          hostedUrl: inv.hosted_invoice_url ?? null,
          pdfUrl: inv.invoice_pdf ?? null,
          date: inv.created
            ? new Date(inv.created * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
            : null,
          amount: inv.total != null ? `${(inv.total / 100).toFixed(2)} ${inv.currency?.toUpperCase() ?? ""}`.trim() : null,
        };
      }
    } catch (err) {
      console.error("Failed to fetch lifetime purchase invoice:", err);
    }
  }

  const portalUnavailable = params?.portal === "unavailable";
  const checkoutSuccess = params?.checkout === "success";
  const questionSent = params?.question === "sent";
  const questionEmpty = params?.question === "empty";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 140px)", paddingBlock: "clamp(2rem, 4vw, 4rem)" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 1.5rem" }}>


        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
          {isLifetime ? "My Purchase" : "My Subscription"}
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, marginBottom: "2rem", lineHeight: 1.2 }}>
          Plan & Billing
        </h1>

        {checkoutSuccess && (
          <div style={{ background: "oklch(65% 0.15 45 / 0.1)", border: "1px solid oklch(65% 0.15 45 / 0.3)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: navy, margin: 0 }}>
              {isLifetime
                ? "Thanks — your purchase is complete. You have permanent access."
                : "Thanks — your purchase is being set up. This page will reflect it shortly."}
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

        {/* Purchase receipt (lifetime) / manage-and-cancel (legacy subscription) */}
        {isLifetime ? (
          <div style={{ background: "oklch(100% 0 0)", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.75rem" }}>
              Your Invoice
            </p>
            {invoice ? (
              <>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: navy, margin: 0 }}>
                  {invoice.amount ? `${invoice.amount} — one-time purchase` : "One-time purchase"}
                  {invoice.date ? `, ${invoice.date}` : ""}
                </p>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                  <a
                    href={invoice.hostedUrl ?? invoice.pdfUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", color: "#fff", background: navy, padding: "0.9rem 1.5rem", textDecoration: "none" }}
                  >
                    View invoice
                  </a>
                  {invoice.pdfUrl && (
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", color: navy, background: "#fff", border: `1px solid ${navy}`, padding: "0.9rem 1.5rem", textDecoration: "none" }}
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", margin: 0, lineHeight: 1.6 }}>
                Your invoice will appear here shortly. If it doesn&apos;t show up within a day, ask us below.
              </p>
            )}
          </div>
        ) : canManage ? (
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
            {isLifetime ? "Questions about your purchase?" : "Questions about your subscription?"}
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
