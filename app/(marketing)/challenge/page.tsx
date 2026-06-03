import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Influential Leadership Challenge — Crispy Development",
  description: "A free 60-day leadership challenge based on Deep Influence by T.J. Addington. Daily readings, journaling, and peer conversations for cross-cultural leaders.",
};

export default async function ChallengeLandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const alreadyEnrolled = user?.user_metadata?.challenge_enrolled === true;

  const navy     = "oklch(22% 0.10 260)";
  const orange   = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";

  return (
    <div style={{ background: offWhite, minHeight: "100dvh" }}>

      {/* ── Hero ── */}
      <div style={{ background: navy, padding: "clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid oklch(97% 0.005 80 / 0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: orange }} />

        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${orange.replace(")", " / 0.15")}`, border: `1px solid ${orange.replace(")", " / 0.4")}`, padding: "0.25rem 0.875rem", marginBottom: "1.5rem", borderRadius: "4px" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange }}>
              Free — 60 Days
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", marginBottom: "1.75rem" }}>
            <IcebergIcon size={56} />
            <div>
              <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: offWhite, lineHeight: 1.15, marginBottom: "0.75rem" }}>
                The Influential Leadership Challenge
              </h1>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "oklch(75% 0.04 260)", lineHeight: 1.7, maxWidth: "48ch" }}>
                62 daily sessions based on <em>Deep Influence</em> by T.J. Addington. 10 minutes a day. Built for cross-cultural leaders who lead from the inside out.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {alreadyEnrolled ? (
              <Link
                href="/challenge/day/1"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: navy, background: offWhite, padding: "0.875rem 2rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
              >
                Continue challenge →
              </Link>
            ) : (
              <>
                <Link
                  href="/challenge/solo"
                  style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: navy, background: offWhite, padding: "0.875rem 2rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
                >
                  Start for free →
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/challenge/solo"
                    style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", color: offWhite, border: "1px solid oklch(55% 0.008 260)", padding: "0.875rem 2rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
                  >
                    Join as existing member
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── What you get ── */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 4rem)" }}>

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.75rem" }}>
          What&apos;s included
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.25rem, 3vw, 1.75rem)", color: navy, marginBottom: "2rem", lineHeight: 1.2 }}>
          Deep leadership formation, one day at a time
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {[
            { icon: "📖", title: "Daily reading", desc: "Core insight + content from each chapter of Deep Influence. 10–15 minutes." },
            { icon: "✍️", title: "Personal journal", desc: "Two reflection questions. Your answers are private and saved securely." },
            { icon: "📖", title: "Biblical foundation", desc: "Scripture anchors each day's leadership principle in God's Word." },
            { icon: "🎯", title: "Implementation challenge", desc: "One specific action to take this week. Not theory — practice." },
          ].map(item => (
            <div key={item.title} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.625rem" }}>{item.icon}</div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.375rem" }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(48% 0.008 260)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── 3 Paths ── */}
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.75rem" }}>
          Three ways to join
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: navy, marginBottom: "1.5rem" }}>
          Do it alone, or bring your team
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "3rem" }}>
          <PathCard
            badge="Available now"
            badgeColor={orange}
            title="Solo"
            desc="Work through the challenge at your own pace. Daily content, private journal, and personal reflection."
            href="/challenge/solo"
            cta="Start solo →"
            navy={navy}
          />
          <PathCard
            badge="Coming soon"
            badgeColor="oklch(58% 0.008 260)"
            title="Facilitator"
            desc="Lead a small group of 4–12 people through the challenge together. Set your own schedule, invite by email or link."
            href="#"
            cta="Coming soon"
            navy={navy}
            disabled
          />
          <PathCard
            badge="Coming soon"
            badgeColor="oklch(58% 0.008 260)"
            title="Join an open group"
            desc="Browse public groups and apply to join one that fits your context and schedule."
            href="#"
            cta="Coming soon"
            navy={navy}
            disabled
          />
        </div>

        {/* ── CTA ── */}
        <div style={{ background: navy, borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
          <IcebergIcon size={40} style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: offWhite, marginBottom: "0.5rem" }}>
            Ready to go deeper?
          </h3>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(72% 0.04 260)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Free. No credit card. Start today.
          </p>
          <Link
            href={alreadyEnrolled ? "/challenge/day/1" : "/challenge/solo"}
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: navy, background: offWhite, padding: "0.875rem 2.5rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
          >
            {alreadyEnrolled ? "Continue challenge →" : "Join free →"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function IcebergIcon({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) {
  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <polygon points="20,4 28,18 12,18" fill={offWhiteHex} stroke={orange} strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="12,20 28,20 32,32 8,32" fill={orange} opacity="0.25" />
      <line x1="8" y1="19" x2="32" y2="19" stroke={navy} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  );
}

const offWhiteHex = "#f9f8f6";

function PathCard({ badge, badgeColor, title, desc, href, cta, navy, disabled = false }: {
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  navy: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ background: "white", border: `1px solid oklch(88% 0.006 80)`, borderRadius: "12px", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", opacity: disabled ? 0.65 : 1 }}>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{ display: "inline-block", background: `${badgeColor.replace(")", " / 0.12)")}`, border: `1px solid ${badgeColor.replace(")", " / 0.3)")}`, padding: "0.15rem 0.625rem", borderRadius: "4px", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: badgeColor }}>{badge}</span>
        </div>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1rem", color: navy, marginBottom: "0.375rem" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(48% 0.008 260)", lineHeight: 1.6, maxWidth: "44ch" }}>{desc}</p>
      </div>
      {!disabled ? (
        <Link
          href={href}
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: "oklch(97% 0.005 80)", background: navy, padding: "0.625rem 1.25rem", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
        >
          {cta}
        </Link>
      ) : (
        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.75rem", color: "oklch(58% 0.008 260)", whiteSpace: "nowrap", flexShrink: 0 }}>{cta}</span>
      )}
    </div>
  );
}
