import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPortalSession } from "./actions";

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
    admin.from("memberships").select("subscription_active, stripe_customer_id").eq("user_id", user.id).maybeSingle(),
    admin.from("teams").select("subscription_active, stripe_customer_id, name").eq("leader_user_id", user.id).maybeSingle(),
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

  if (leaderTeam) {
    pathwayLabel = "Team (Leader)";
    isActive = leaderTeam.subscription_active === true;
    canManage = !!leaderTeam.stripe_customer_id;
  } else if (memberOfTeam) {
    pathwayLabel = "Team (Member)";
    isActive = memberOfTeam.subscription_active === true;
    managedByLeaderNote = true;
  } else if (membership) {
    pathwayLabel = "Personal";
    isActive = membership.subscription_active === true;
    canManage = !!membership.stripe_customer_id;
  }

  const portalUnavailable = params?.portal === "unavailable";
  const checkoutSuccess = params?.checkout === "success";

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
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.2rem 0.6rem", background: isActive ? "oklch(65% 0.15 45 / 0.12)" : "oklch(88% 0.008 80)", color: isActive ? orange : "oklch(52% 0.008 260)", border: `1px solid ${isActive ? "oklch(65% 0.15 45 / 0.3)" : "oklch(80% 0.008 80)"}` }}>
              {isActive ? "Active" : "Free"}
            </span>
          </div>
          {pathwayLabel === "Free" && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              You have access to free resources and the Influential Leadership challenge.
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

      </div>
    </div>
  );
}
