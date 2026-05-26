import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Team Pathway — Crispy Development" };

export default async function TeamPathwayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: "oklch(97% 0.005 80)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>

        {/* Coming soon badge */}
        <span style={{
          display: "inline-block",
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.58rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "oklch(65% 0.15 45)",
          background: "oklch(65% 0.15 45 / 0.1)",
          border: "1px solid oklch(65% 0.15 45 / 0.25)",
          padding: "0.35rem 0.875rem",
          marginBottom: "1.5rem",
        }}>
          Coming Soon
        </span>

        <h1 style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "2.5rem",
          color: "oklch(22% 0.10 260)",
          lineHeight: 1.2,
          marginBottom: "1rem",
        }}>
          Team Pathway
        </h1>

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9rem",
          color: "oklch(48% 0.008 260)",
          lineHeight: 1.75,
          marginBottom: "2rem",
        }}>
          Bring your whole team into the journey. Set up your team, invite members, run shared assessments, and see every result side by side — guided step by step.
        </p>

        {/* What's included */}
        <div style={{ textAlign: "left", background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "1.5rem 1.75rem", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
            What&apos;s included
          </p>
          {[
            "Up to 8 team members",
            "Full 18-step team journey",
            "Shared assessments with side-by-side results",
            "Modules that unpack each assessment for your team",
            "Direct line to your Crispy Coach",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: i < 4 ? "0.625rem" : 0 }}>
              <span style={{ color: "oklch(65% 0.15 45)", fontSize: "0.8rem", marginTop: "0.1rem", flexShrink: 0 }}>✓</span>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(35% 0.008 260)", lineHeight: 1.5, margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6, marginBottom: "2rem" }}>
          Team Pathway pricing is coming soon. Get in touch if you&apos;d like early access.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="mailto:chris@crispydevelopment.com"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "white",
              background: "oklch(30% 0.12 260)",
              padding: "0.75rem 1.5rem",
              textDecoration: "none",
            }}
          >
            Get Early Access
          </a>
          <Link
            href="/dashboard?tab=team"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "oklch(48% 0.008 260)",
              background: "none",
              border: "1px solid oklch(80% 0.008 260)",
              padding: "0.75rem 1.5rem",
              textDecoration: "none",
            }}
          >
            Back to Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
