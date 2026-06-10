import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Subscription — Crispy Development" };

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const pathway = (user.user_metadata?.pathway as string) ?? "free";
  const pathwayLabel = pathway === "team" ? "Team" : pathway === "personal" ? "Personal" : "Free";

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

        {/* Current plan */}
        <div style={{ background: "oklch(100% 0 0)", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.75rem" }}>
            Current Plan
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy }}>
              {pathwayLabel}
            </span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.2rem 0.6rem", background: pathway === "free" ? "oklch(88% 0.008 80)" : "oklch(65% 0.15 45 / 0.12)", color: pathway === "free" ? "oklch(52% 0.008 260)" : orange, border: `1px solid ${pathway === "free" ? "oklch(80% 0.008 80)" : "oklch(65% 0.15 45 / 0.3)"}` }}>
              {pathway === "free" ? "Free" : "Active"}
            </span>
          </div>
          {pathway === "free" && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              You have access to free resources and the Influential Leadership challenge.
            </p>
          )}
        </div>

        {/* Payment coming soon */}
        <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem", borderLeft: "3px solid oklch(65% 0.15 45)" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
            Coming Soon
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)", lineHeight: 1.7, margin: 0 }}>
            Subscription management and billing details will be available here once payment options are live.
          </p>
        </div>

      </div>
    </div>
  );
}
