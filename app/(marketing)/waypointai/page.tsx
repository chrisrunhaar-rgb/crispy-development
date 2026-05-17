import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "WayPoint for Organisations — AI Coaching for Field Workers | Crispy Development",
  description:
    "WayPoint gives your cross-cultural workers a private coaching space — 24/7, any timezone. Built for mission agencies and church sending teams. Now in BETA.",
};

// ─── colour tokens (WayPoint brand) ────────────────────────────────────────
const wp = {
  navy:        "oklch(22% 0.10 260)",
  navyMid:     "oklch(26% 0.105 260)",
  navyTint:    "oklch(92% 0.025 260)",
  orange:      "oklch(65% 0.15 45)",
  orangeTint:  "oklch(95% 0.025 45)",
  offWhite:    "oklch(97% 0.005 80)",
  lightGray:   "oklch(88% 0.008 80)",
  bodyText:    "oklch(38% 0.007 260)",
  mutedText:   "oklch(52% 0.006 260)",
  white85:     "oklch(97% 0.005 80 / 0.85)",
  white70:     "oklch(97% 0.005 80 / 0.70)",
  white50:     "oklch(97% 0.005 80 / 0.50)",
  white07:     "oklch(97% 0.005 80 / 0.07)",
} as const;

// ─── SVG icons (inline, no external deps) ─────────────────────────────────
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={wp.offWhite} aria-hidden="true">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={wp.offWhite} aria-hidden="true">
      <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V8z"/>
    </svg>
  );
}
function IconLock() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={wp.offWhite} aria-hidden="true">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  );
}
function IconMic() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={wp.offWhite} aria-hidden="true">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  );
}
function IconBadge() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={wp.offWhite} aria-hidden="true">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={wp.offWhite} aria-hidden="true">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );
}

// ─── SECTION LABEL ─────────────────────────────────────────────────────────
function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p style={{
      fontFamily: "var(--font-montserrat)",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: light ? wp.white85 : wp.orange,
      marginBottom: "0.75rem",
    }}>
      {children}
    </p>
  );
}

// ─── SARAH INTERSTITIAL ────────────────────────────────────────────────────
function SarahPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: wp.navyMid,
      padding: "clamp(2rem, 5vw, 3rem) 0",
    }}>
      <div className="container-wide">
        <div style={{ maxWidth: "760px" }}>
          <span style={{
            display: "inline-block",
            background: wp.orange,
            color: wp.offWhite,
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "0.25rem 0.75rem",
            marginBottom: "1.25rem",
          }}>
            {label}
          </span>
          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.2rem, 2vw + 0.5rem, 1.65rem)",
            color: wp.white85,
            lineHeight: 1.7,
            margin: 0,
          }}>
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SESSION NOTE ROW ──────────────────────────────────────────────────────
function NoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 9rem) 1fr",
      gap: "0.75rem",
      paddingBlock: "0.6rem",
      borderBottom: `1px solid ${wp.lightGray}`,
    }}>
      <span style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.65rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: wp.mutedText,
        paddingTop: "0.1rem",
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.875rem",
        color: wp.bodyText,
        fontStyle: "italic",
        lineHeight: 1.6,
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── SPEC ITEM ─────────────────────────────────────────────────────────────
function SpecItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2.5rem 1fr",
      gap: "1rem",
      alignItems: "flex-start",
      padding: "1.25rem",
      background: wp.offWhite,
      border: `1px solid ${wp.lightGray}`,
    }}>
      <div style={{
        width: "2.5rem",
        height: "2.5rem",
        background: wp.orange,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <strong style={{
          display: "block",
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: wp.navy,
          marginBottom: "0.375rem",
          lineHeight: 1.3,
        }}>
          {title}
        </strong>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.875rem",
          color: wp.bodyText,
          lineHeight: 1.65,
        }}>
          {children}
        </span>
      </div>
    </div>
  );
}

// ─── PROGRAM CARD ──────────────────────────────────────────────────────────
function ProgramCard({
  title,
  sessions,
  description,
  items,
  accent = false,
}: {
  title: string;
  sessions: string;
  description: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div style={{
      border: `1px solid ${wp.lightGray}`,
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        background: accent ? wp.orange : wp.navy,
        color: wp.offWhite,
        padding: "0.875rem 1.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <h4 style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.9375rem",
          fontWeight: 700,
          margin: 0,
        }}>
          {title}
        </h4>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          opacity: 0.75,
          whiteSpace: "nowrap",
          marginLeft: "1rem",
        }}>
          {sessions}
        </span>
      </div>
      <div style={{ padding: "1.25rem", flex: 1 }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.875rem",
          color: wp.bodyText,
          marginBottom: "1rem",
          lineHeight: 1.6,
        }}>
          {description}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li key={item} style={{
              display: "flex",
              gap: "0.625rem",
              alignItems: "baseline",
              paddingBlock: "0.375rem",
              borderBottom: `1px solid oklch(93% 0.006 80)`,
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              color: wp.bodyText,
              lineHeight: 1.5,
            }}>
              <span style={{
                color: wp.orange,
                fontWeight: 700,
                fontSize: "0.875rem",
                lineHeight: 1,
                marginTop: "0.125rem",
                flexShrink: 0,
              }} aria-hidden="true">›</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── PRICE CARD ────────────────────────────────────────────────────────────
function PriceCard({
  tier,
  size,
  fullPrice,
  betaPrice,
  perSession,
  features,
}: {
  tier: string;
  size: string;
  fullPrice: string;
  betaPrice: string;
  perSession: string;
  features: string[];
}) {
  return (
    <div style={{
      border: `1.5px solid ${wp.navy}`,
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        background: wp.navy,
        color: wp.offWhite,
        padding: "1rem 1.25rem",
      }}>
        <div style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "1rem",
          fontWeight: 700,
        }}>
          {tier}
        </div>
        <div style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          opacity: 0.6,
          marginTop: "0.25rem",
        }}>
          {size}
        </div>
      </div>
      <div style={{
        padding: "1.25rem",
        background: wp.offWhite,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.8rem",
          textDecoration: "line-through",
          color: wp.mutedText,
        }}>
          {fullPrice}
        </div>
        <div style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "2rem",
          fontWeight: 700,
          color: wp.orange,
          lineHeight: 1.1,
          marginTop: "0.25rem",
        }}>
          {betaPrice}
          <span style={{ fontSize: "0.875rem", fontWeight: 400, color: wp.mutedText }}>/month</span>
        </div>
        <div style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: wp.orange,
          marginTop: "0.375rem",
          marginBottom: "0.75rem",
        }}>
          {perSession}
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${wp.lightGray}`, margin: "0.75rem 0" }} />
        <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
          {features.map((f) => (
            <li key={f} style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8rem",
              color: wp.bodyText,
              paddingBlock: "0.3rem",
              lineHeight: 1.5,
            }}>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function WayPointAIPage() {
  return (
    <>
      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section style={{
        background: wp.navy,
        paddingTop: "clamp(3.5rem, 7vw, 6rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 6rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Orange rule at very bottom of hero */}
        <div aria-hidden="true" style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: wp.orange,
        }} />

        {/* Subtle dot grid texture */}
        <div aria-hidden="true" style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${wp.white07} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Top bar: logo + beta badge */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}>
            <Image
              src="/wp-banner-blue.png"
              alt="WayPoint"
              width={200}
              height={48}
              style={{ height: "clamp(28px, 4vw, 44px)", width: "auto" }}
              priority
            />
            <span style={{
              background: wp.orange,
              color: wp.offWhite,
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.375rem 1rem",
              borderRadius: "2rem",
              whiteSpace: "nowrap",
            }}>
              Beta Programme
            </span>
          </div>

          {/* Headline block */}
          <div style={{ maxWidth: "640px" }}>
            <h1 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 5vw + 0.5rem, 4.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: wp.offWhite,
              marginBottom: "1.5rem",
            }}>
              Your field workers need opportunity to talk.{" "}
              <em style={{ fontStyle: "normal", color: wp.orange }}>
                Any time. Anywhere.
              </em>
            </h1>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1rem, 1.5vw + 0.25rem, 1.125rem)",
              lineHeight: 1.7,
              color: wp.white70,
              maxWidth: "52ch",
              marginBottom: "2.5rem",
            }}>
              WayPoint is a specifically trained voice AI coaching companion for cross-cultural Christian workers. Always available.
            </p>
            <a
              href="mailto:chris@waypointai.coach"
              className="btn-primary"
              style={{ borderRadius: 0, fontSize: "0.875rem" }}
            >
              Book a conversation
            </a>
          </div>
        </div>
      </section>

      {/* ══ 2. SARAH INTRO ═══════════════════════════════════════════════════ */}
      <SarahPanel label="Sarah's Story">
        Sarah has served in Central Asia for three years. She leads a women&apos;s programme in a remote community four hours from the nearest city. Tonight, a team meeting went wrong — a conflict she cannot explain in a WhatsApp message, too layered for a quick call. It is 11pm. Her organisation&apos;s leadership team is asleep in a different timezone. Sarah opens the WayPoint app.
      </SarahPanel>

      {/* ══ 3. THE CHALLENGE ═════════════════════════════════════════════════ */}
      <section id="challenge" style={{
        background: wp.offWhite,
        paddingBlock: "clamp(3.5rem, 7vw, 6rem)",
      }}>
        <div className="container-wide">
          <SectionLabel>The Challenge</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: wp.navy,
            maxWidth: "560px",
            marginBottom: "1.25rem",
          }}>
            Being available to everyone, always, is simply not possible.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: wp.bodyText,
            maxWidth: "65ch",
            marginBottom: "0.75rem",
          }}>
            No matter how much your team cares, human availability has limits. Being present for every worker, at every difficult hour, across every timezone — it is just not possible. Something always gets missed. Not because the care is not there, but because people have limits.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: wp.bodyText,
            maxWidth: "65ch",
            marginBottom: "2.5rem",
          }}>
            WayPoint closes that gap. Not a replacement for the human care your workers need — but what makes that care sustainable.
          </p>

          {/* Provides / Does Not grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {/* Provides */}
            <div style={{
              background: wp.navyTint,
              padding: "1.75rem",
              border: `1px solid oklch(82% 0.04 260)`,
            }}>
              <h4 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: wp.navy,
                marginBottom: "1rem",
              }}>
                WayPoint provides
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  "AI Coaching — available 24/7",
                  "A private space to process challenges out loud",
                  "Context-aware conversations — knows the worker's situation, culture, and history",
                  "Session notes capturing insights, values, and next steps",
                  "Welfare visibility for your leadership team (with worker consent)",
                  "Specialist programs for key life transitions",
                ].map((item) => (
                  <li key={item} style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    color: wp.bodyText,
                    lineHeight: 1.55,
                    paddingBottom: "0.625rem",
                    borderBottom: `1px solid oklch(86% 0.03 260)`,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Does Not */}
            <div style={{
              background: wp.orangeTint,
              padding: "1.75rem",
              border: `1px solid oklch(88% 0.04 45)`,
            }}>
              <h4 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: wp.orange,
                marginBottom: "1rem",
              }}>
                WayPoint does not
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  "Diagnose, treat, or prescribe anything",
                  "Replace therapy, counselling, or crisis support",
                  "Share anything with your organisation without worker consent",
                  "Give advice or tell workers what to do",
                  "Use coaching jargon, Christian clichés, or empty affirmations",
                  "Pretend to be human",
                ].map((item) => (
                  <li key={item} style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    color: wp.bodyText,
                    lineHeight: 1.55,
                    paddingBottom: "0.625rem",
                    borderBottom: `1px solid oklch(91% 0.03 45)`,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA after challenge */}
          <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px solid ${wp.lightGray}` }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              color: wp.bodyText,
              marginBottom: "1.25rem",
            }}>
              Sounds like what your team needs?
            </p>
            <a
              href="mailto:chris@waypointai.coach"
              className="btn-primary"
              style={{ borderRadius: 0, fontSize: "0.875rem" }}
            >
              Book a conversation
            </a>
          </div>
        </div>
      </section>

      {/* ══ 4. HOW IT WORKS ══════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{
        background: "oklch(96% 0.006 80)",
        paddingBlock: "clamp(3.5rem, 7vw, 6rem)",
        borderTop: `1px solid ${wp.lightGray}`,
      }}>
        <div className="container-wide">
          <SectionLabel>How It Works</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: wp.navy,
            marginBottom: "2.5rem",
          }}>
            A real conversation. A clear structure.
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}>
            {/* Left col: coaching arc */}
            <div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                color: wp.bodyText,
                marginBottom: "1rem",
              }}>
                Every WayPoint session follows a coaching arc developed specifically for cross-cultural workers. Workers can choose a male or female coach, start when they are ready, and end when they feel complete. Sessions are typically 20 to 40 minutes.
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                color: wp.bodyText,
                marginBottom: "2rem",
              }}>
                The coach does not give advice. It asks questions, holds space, and helps the worker find what they already carry inside.
              </p>

              {/* Phases */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {[
                  { phase: "LAND", sub: "What is present?" },
                  { phase: "SEEK", sub: "What matters most?" },
                  { phase: "EXPLORE", sub: "Go deeper" },
                  { phase: "COMMIT", sub: "One next step" },
                  { phase: "CARRY", sub: "Close with care" },
                ].map(({ phase, sub }) => (
                  <div key={phase} style={{
                    background: wp.navyTint,
                    border: `1px solid oklch(82% 0.04 260)`,
                    padding: "0.5rem 0.875rem",
                    minWidth: "7rem",
                    textAlign: "center",
                  }}>
                    <span style={{
                      display: "block",
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: wp.navy,
                    }}>
                      {phase}
                    </span>
                    <span style={{
                      display: "block",
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.65rem",
                      color: wp.mutedText,
                      marginTop: "0.125rem",
                    }}>
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col: session notes card */}
            <div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: wp.orange,
                marginBottom: "0.75rem",
              }}>
                Sample session notes
              </p>
              <div style={{
                background: wp.offWhite,
                border: `1px solid ${wp.lightGray}`,
                borderTop: `3px solid ${wp.navy}`,
              }}>
                <div style={{
                  padding: "0.875rem 1.25rem",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: wp.navy,
                  borderBottom: `1px solid ${wp.lightGray}`,
                }}>
                  Session 12 — Sarah T. &nbsp;|&nbsp; 38 min
                </div>
                <div style={{ padding: "0 1.25rem" }}>
                  <NoteRow label="Focus area" value="Team conflict. A relationship under strain after a difficult meeting." />
                  <NoteRow label="Insights surfaced" value="Was protecting the idea, not the team. Saw her part in it." />
                  <NoteRow label="Values in tension" value="Conviction vs. belonging" />
                  <NoteRow label="Action committed" value="Return to the team tomorrow. Say the honest thing first." />
                  <NoteRow label="Carrying forward" value='"I was protecting my idea, not my team."' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sarah — continued */}
      <SarahPanel label="Sarah's Story — continued">
        After 38 minutes with her coach, Sarah closes her laptop. The conflict is not resolved. But she sees her part in it. That was her own insight — the coach never told her. She found it herself. Tomorrow, she will go back.
      </SarahPanel>

      {/* ══ 5. MEMBERS WELFARE DASHBOARD ═════════════════════════════════════ */}
      <section id="dashboard" style={{
        background: wp.offWhite,
        paddingBlock: "clamp(3.5rem, 7vw, 6rem)",
        borderTop: `1px solid ${wp.lightGray}`,
      }}>
        <div className="container-wide">
          <SectionLabel>Members Welfare Dashboard</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: wp.navy,
            maxWidth: "560px",
            marginBottom: "1.25rem",
          }}>
            Your leadership team sees what they need. No more. No less.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: wp.bodyText,
            maxWidth: "65ch",
            marginBottom: "2.5rem",
          }}>
            Every organisation chooses their confidentiality model when they set up WayPoint. Workers are clearly informed — at registration and after every session — what is shared and what is not.
          </p>

          {/* Mode cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}>
            {/* Mode A */}
            <div style={{
              background: "oklch(98% 0.008 260)",
              border: `1px solid oklch(82% 0.04 260)`,
              padding: "1.75rem",
            }}>
              <div style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(52% 0.07 260)",
                marginBottom: "0.375rem",
              }}>
                Mode A
              </div>
              <h3 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.125rem",
                fontWeight: 700,
                color: wp.navy,
                marginBottom: "0.75rem",
              }}>
                Fully Confidential
              </h3>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: wp.bodyText,
                lineHeight: 1.65,
                marginBottom: "1.25rem",
              }}>
                Session content is never visible to your leadership team. The worker&apos;s coaching space is entirely their own.
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "oklch(52% 0.07 260)",
                marginBottom: "0.625rem",
              }}>
                What you see on the admin dashboard:
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  "Active workers and last session date",
                  "Total coaching time per worker",
                  "Session frequency trends",
                  "Inactivity alerts — workers who have gone quiet",
                  "Package usage and remaining minutes",
                  "Org-wide engagement over time",
                ].map((item) => (
                  <li key={item} style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8125rem",
                    color: wp.bodyText,
                    lineHeight: 1.5,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                fontStyle: "italic",
                color: wp.mutedText,
                lineHeight: 1.55,
                margin: 0,
              }}>
                Your leadership team knows who might need a check-in, without knowing why.
              </p>
            </div>

            {/* Mode B */}
            <div style={{
              background: "oklch(98% 0.01 45)",
              border: `1px solid oklch(88% 0.04 45)`,
              padding: "1.75rem",
            }}>
              <div style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(52% 0.1 45)",
                marginBottom: "0.375rem",
              }}>
                Mode B
              </div>
              <h3 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.125rem",
                fontWeight: 700,
                color: wp.orange,
                marginBottom: "0.75rem",
              }}>
                Welfare Monitoring
              </h3>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: wp.bodyText,
                lineHeight: 1.65,
                marginBottom: "1.25rem",
              }}>
                Workers consent once at registration to share their coaching notes to the org dashboard. You configure which topics are flagged.
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "oklch(52% 0.1 45)",
                marginBottom: "0.625rem",
              }}>
                Everything in Mode A, plus:
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  "Coaching notes visible per session",
                  "Welfare flag alerts sent to care providers",
                  "Your team sees the flag — they decide what to do",
                  "Your leadership team's time goes to the workers who need them most",
                  "Post-session AI scan reviews notes overnight",
                  "20 configurable welfare flag topics",
                ].map((item) => (
                  <li key={item} style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8125rem",
                    color: wp.bodyText,
                    lineHeight: 1.5,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                fontStyle: "italic",
                color: wp.mutedText,
                lineHeight: 1.55,
                margin: 0,
              }}>
                Mode B requires worker consent at registration and is available as an add-on on all plans.
              </p>
            </div>
          </div>

          {/* Welfare flags table */}
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: wp.navy,
            marginBottom: "1rem",
          }}>
            Mode B welfare flags — you choose which are active:
          </p>

          <div className="wp-flags-grid">
            {[
              {
                header: "Always On",
                items: [
                  "Suicidal ideation",
                  "Abuse",
                  "Safety threat",
                  "Mental health crisis",
                ],
              },
              {
                header: "Default On",
                items: [
                  "Burnout",
                  "Moral injury",
                  "Trauma indicators",
                  "Relationship crisis",
                  "Intent to leave field",
                  "Spiritual crisis",
                ],
              },
              {
                header: "Optional",
                items: [
                  "Team conflict",
                  "Financial stress",
                  "Cultural overwhelm",
                  "Grief and loss",
                  "Re-entry stress",
                  "Isolation",
                  "Physical health concerns",
                  "Boundary violations",
                  "Language burnout",
                  "Authority conflict",
                ],
              },
            ].map((col, ci) => (
              <div key={col.header} style={{
                borderRight: ci < 2 ? `1px solid ${wp.lightGray}` : undefined,
              }}>
                <div style={{
                  padding: "0.625rem 1rem",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: wp.navy,
                  background: "oklch(95% 0.006 80)",
                  borderBottom: `1px solid ${wp.lightGray}`,
                }}>
                  {col.header}
                </div>
                {col.items.map((item) => (
                  <div key={item} style={{
                    padding: "0.45rem 1rem",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8125rem",
                    color: wp.bodyText,
                    borderBottom: `1px solid oklch(93% 0.005 80)`,
                    lineHeight: 1.45,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sarah — morning after */}
      <SarahPanel label="Sarah's Story — the morning after">
        Sarah&apos;s team leader opens the WayPoint dashboard before her first meeting. A flag: &ldquo;Team conflict — Session 12.&rdquo; She does not need to read the notes. The flag is enough. She sends Sarah a voice message: &ldquo;I&apos;ve been thinking about you and the team situation. Let&apos;s talk this week.&rdquo; Sarah cries — not because things are hard, but because someone in the same organisation is close enough to notice.
      </SarahPanel>

      {/* ══ 6. SPECIALIST PROGRAMS ═══════════════════════════════════════════ */}
      <section id="programs" style={{
        background: wp.offWhite,
        paddingBlock: "clamp(3.5rem, 7vw, 6rem)",
        borderTop: `1px solid ${wp.lightGray}`,
      }}>
        <div className="container-wide">
          <SectionLabel>Specialist Programs</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: wp.navy,
            marginBottom: "1.25rem",
          }}>
            Structured coaching for specific transitions.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: wp.bodyText,
            maxWidth: "65ch",
            marginBottom: "2.5rem",
          }}>
            Standard coaching lets workers bring whatever is most present. Specialist programs are structured programs for workers facing a defined transition. Your leadership team assigns a worker to a program. WayPoint does the rest.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}>
            <ProgramCard
              title="Cultural Integration"
              sessions="6 sessions"
              description="For workers in their first months in a new context. From disorientation to belonging."
              items={[
                "Processing culture shock and first impressions",
                "Understanding the host culture's values and logic",
                "Language learning and cultural humility",
                "Building authentic relationships in a new setting",
                "Finding community and belonging",
                "Clarifying calling in this specific context",
              ]}
            />
            <ProgramCard
              title="Conflict Resolution"
              sessions="4 sessions"
              description="For workers navigating team tension or a relationship breakdown. Personal coaching — not mediation."
              items={[
                "Telling the full story of what happened",
                "Understanding cross-cultural conflict styles",
                "Identifying your own role and patterns",
                "Processing emotions and clearing reactivity",
                "Clarifying what you actually need from this",
                "How to re-engage and move forward",
              ]}
            />
            <ProgramCard
              title="Burnout Recovery"
              sessions="6 sessions"
              description="For workers showing signs of depletion. Slower pace. Rest. Rebuilding from the inside out."
              items={[
                "Naming where your energy has gone",
                "Understanding what the field has cost you",
                "Reconnecting with what you love about this work",
                "Rest as a spiritual and practical practice",
                "Boundaries that protect you going forward",
                "Rediscovering identity beyond performance",
              ]}
            />
            <ProgramCard
              title="Re-Entry"
              sessions="8 sessions"
              description="For workers returning home after field assignment. Reverse culture shock, grief, and finding a new rhythm."
              items={[
                "Processing the shock of reverse culture",
                "Grieving what was left behind",
                "Redefining identity in a home context",
                "What the worker carried home without knowing it",
                "Rebuilding family and friendship relationships",
                "Finding calling again on this side of the field",
              ]}
              accent
            />
          </div>
        </div>
      </section>

      {/* Sarah — seven years later */}
      <SarahPanel label="Sarah's Story — seven years later">
        Sarah is coming home from Central Asia for good. Seven years in the field. Her leadership team enrols her in the Re-Entry Program. In session three, her coach asks: &ldquo;When you imagine being fully here — not there — does that feel like loss, or arrival?&rdquo; Sarah pauses a long time. &ldquo;Both,&rdquo; she says. By session eight, she keeps returning to one phrase: integration, not resolution. She is not back to normal. She has found something better.
      </SarahPanel>

      {/* ══ 7. TECHNICAL SPECIFICATIONS ══════════════════════════════════════ */}
      <section id="tech-specs" style={{
        background: "oklch(96% 0.006 80)",
        paddingBlock: "clamp(3.5rem, 7vw, 6rem)",
        borderTop: `1px solid ${wp.lightGray}`,
      }}>
        <div className="container-wide">
          <SectionLabel>Technical Specifications</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: wp.navy,
            marginBottom: "2.5rem",
          }}>
            Accessible anywhere. Feels like a native app.
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}>
            <SpecItem icon={<IconPhone />} title="Installable on any device — the WayPoint App">
              Workers install WayPoint directly from their browser — one tap, no app store. It sits on their home screen, sends coaching reminders and session notifications, and works exactly like a native app.
            </SpecItem>
            <SpecItem icon={<IconClock />} title="Available 24/7, every timezone">
              No waiting for office hours. No scheduling in advance. Whether it is 6am in Nairobi or 11pm in Central Asia, WayPoint is ready for a session the moment your worker needs one.
            </SpecItem>
            <SpecItem icon={<IconLock />} title="Private and encrypted">
              All conversations are encrypted in transit and at rest. Your workers&apos; sessions are never used to train AI models and are never visible to anyone outside the settings your organisation chooses.
            </SpecItem>
            <SpecItem icon={<IconMic />} title="Voice conversations that actually work">
              Powered by Google&apos;s real-time voice AI — instant response, natural rhythm, no lag, no breakdown. A coaching session that sounds like a real conversation, wherever your workers are in the world.
            </SpecItem>
            <SpecItem icon={<IconBadge />} title="Your brand. Your subdomain.">
              Workers see your organisation&apos;s name, logo, and colours — not ours. Accessed at{" "}
              <span style={{
                display: "inline-block",
                background: wp.navy,
                color: wp.offWhite,
                fontFamily: "monospace",
                fontSize: "0.8rem",
                padding: "0.1rem 0.5rem",
                marginTop: "0.25rem",
              }}>
                <span style={{ color: wp.orange, fontWeight: 700 }}>[your org]</span>.WayPointAI.coach
              </span>
            </SpecItem>
            <SpecItem icon={<IconCheck />} title="Live within 48 hours">
              We configure your branding, coach persona, and dashboard settings. Your team add workers to the platform. From that moment, every worker has immediate access — no waiting, no setup on their end.
            </SpecItem>
          </div>
        </div>
      </section>

      {/* ══ 8. PRICING ═══════════════════════════════════════════════════════ */}
      <section id="pricing" style={{
        background: wp.offWhite,
        paddingBlock: "clamp(3.5rem, 7vw, 6rem)",
        borderTop: `1px solid ${wp.lightGray}`,
      }}>
        <div className="container-wide">
          <SectionLabel>Pricing</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: wp.navy,
            marginBottom: "1.25rem",
          }}>
            Priced by team size. Predictable every month.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: wp.bodyText,
            maxWidth: "65ch",
            marginBottom: "1.5rem",
          }}>
            Each plan covers one session per worker per week on average — that is what the average field worker uses. Buffer is built in so workers who need more can have more. Your org dashboard shows real-time usage so you are never surprised.
          </p>

          {/* BETA note */}
          <div style={{
            background: wp.orangeTint,
            border: `1px solid oklch(88% 0.04 45)`,
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: wp.bodyText,
              lineHeight: 1.6,
              margin: 0,
            }}>
              <strong style={{ color: wp.orange }}>All prices shown in orange are BETA rates.</strong>{" "}
              BETA partners pay the orange price — already 50% below standard — locked in for their first 6 months.
            </p>
          </div>

          {/* Pricing cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}>
            <PriceCard
              tier="Sending"
              size="Up to 25 workers"
              fullPrice="$349/month"
              betaPrice="$175"
              perSession="Only $1.40 per coaching session"
              features={[
                "1 session per worker per week on average",
                "5,000 minutes of coaching included",
                "Branded subdomain + custom coach",
                "Mode A dashboard included",
                "Worker usage limits via dashboard",
                "Mode B available as add-on",
                "Full onboarding free of charge",
                "Overage: $0.10/min",
              ]}
            />
            <PriceCard
              tier="Mission"
              size="Up to 75 workers"
              fullPrice="$999/month"
              betaPrice="$500"
              perSession="Only $1.33 per coaching session"
              features={[
                "1 session per worker per week on average",
                "15,000 minutes of coaching included",
                "Branded subdomain + custom coach",
                "Mode A dashboard included",
                "Priority support",
                "Mode B available as add-on",
                "Full onboarding free of charge",
                "Overage: $0.10/min",
              ]}
            />
            <PriceCard
              tier="Alliance"
              size="Up to 200 workers"
              fullPrice="$2,499/month"
              betaPrice="$1,250"
              perSession="Only $1.25 per coaching session"
              features={[
                "1 session per worker per week on average",
                "40,000 minutes of coaching included",
                "Branded subdomain + custom coach",
                "Mode A dashboard included",
                "Custom flag configuration",
                "Mode B available as add-on",
                "Full onboarding free of charge",
                "Overage: $0.10/min",
                "Above 200 workers: contact us",
              ]}
            />
          </div>

          {/* Mode B add-on */}
          <div style={{
            background: "oklch(96% 0.006 80)",
            border: `1px solid ${wp.lightGray}`,
            padding: "1.5rem 1.75rem",
            marginBottom: "1.25rem",
          }}>
            <h4 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: wp.navy,
              marginBottom: "1rem",
            }}>
              Mode B Welfare Dashboard — add-on, available on all plans
            </h4>
            {[
              { label: "Sending + Mode B", full: "$89/month", beta: "$45/month" },
              { label: "Mission + Mode B",  full: "$199/month", beta: "$100/month" },
              { label: "Alliance + Mode B", full: "$399/month", beta: "$200/month" },
            ].map((row) => (
              <div key={row.label} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: `1px solid ${wp.lightGray}`,
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: wp.bodyText,
              }}>
                <span>{row.label}</span>
                <span style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <span style={{ textDecoration: "line-through", color: wp.mutedText, fontSize: "0.8rem" }}>{row.full}</span>
                  <span style={{ fontWeight: 700, color: wp.orange }}>{row.beta}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Specialist pricing */}
          <div style={{
            background: "oklch(96% 0.006 80)",
            border: `1px solid ${wp.lightGray}`,
            padding: "1.5rem 1.75rem",
          }}>
            <h4 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: wp.navy,
              marginBottom: "1rem",
            }}>
              Specialist Programs &nbsp;|&nbsp; Per worker enrolled
            </h4>
            {[
              { label: "Cultural Integration — 6 sessions", full: "$119", beta: "$50" },
              { label: "Conflict Resolution — 4 sessions",  full: "$79",  beta: "$50" },
              { label: "Burnout Recovery — 6 sessions",     full: "$119", beta: "$50" },
              { label: "Re-Entry — 8 sessions",             full: "$149", beta: "$50" },
            ].map((row) => (
              <div key={row.label} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: `1px solid ${wp.lightGray}`,
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: wp.bodyText,
              }}>
                <span>{row.label}</span>
                <span style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <span style={{ textDecoration: "line-through", color: wp.mutedText, fontSize: "0.8rem" }}>{row.full}</span>
                  <span style={{ fontWeight: 700, color: wp.orange }}>{row.beta}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. BETA BANNER ═══════════════════════════════════════════════════ */}
      <section id="beta" style={{
        background: wp.orange,
        paddingBlock: "clamp(3rem, 6vw, 5rem)",
        textAlign: "center",
      }}>
        <div className="container-wide">
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <h3 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw + 0.25rem, 2.25rem)",
              letterSpacing: "-0.02em",
              color: wp.offWhite,
              marginBottom: "1rem",
            }}>
              Join the WayPoint BETA Programme
            </h3>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "oklch(97% 0.005 80 / 0.90)",
              marginBottom: "2rem",
              maxWidth: "58ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              All orange prices in this document are BETA rates — already 50% below our standard pricing. As a BETA partner, you lock those rates in for your first 6 months. In return, we ask for honest feedback and a conversation about what your workers actually need. You help shape the product. We serve your team at the BETA price.
            </p>
            <a
              href="mailto:chris@waypointai.coach"
              className="btn-primary"
              style={{ borderRadius: 0, background: wp.navy, fontSize: "0.875rem" }}
            >
              Book a conversation
            </a>
          </div>
        </div>
      </section>

      {/* ══ 10. FOUNDER ═════════════════════════════════════════════════════ */}
      <section style={{
        background: "oklch(96% 0.006 80)",
        paddingBlock: "clamp(3rem, 6vw, 5rem)",
        borderTop: `1px solid ${wp.lightGray}`,
      }}>
        <div className="container-wide">
          <div style={{ maxWidth: "640px" }}>
            <SectionLabel>About the founder</SectionLabel>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.2rem, 2vw + 0.25rem, 1.5rem)",
              color: wp.navy,
              lineHeight: 1.65,
              marginBottom: "1.25rem",
            }}>
              WayPoint was not built in a tech lab. It was built from nearly two decades of working alongside cross-cultural workers.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              color: wp.bodyText,
              lineHeight: 1.75,
              marginBottom: "1.5rem",
            }}>
              Chris Runhaar has spent nearly two decades working with and alongside cross-cultural teams across Southeast Asia and beyond — in community development, NGO leadership, and cross-cultural ministry. He has seen firsthand what workers carry, what organisations miss at 11pm in the wrong timezone, and what a difference it makes when someone is close enough to notice.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              color: wp.bodyText,
              lineHeight: 1.75,
              marginBottom: "1.75rem",
            }}>
              WayPoint is not a tech product that happened to find a mission sector use case. It is a pastoral care response, built by someone who believes your workers deserve more than a voicemail.
            </p>
            <a
              href="mailto:chris@waypointai.coach"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: wp.orange,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              chris@waypointai.coach
            </a>
          </div>
        </div>
      </section>

      {/* ══ 11. FOOTER ═══════════════════════════════════════════════════════ */}
      <footer style={{
        background: wp.navy,
        paddingBlock: "clamp(2rem, 4vw, 3rem)",
      }}>
        <div className="container-wide">
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: wp.white85,
                marginBottom: "0.375rem",
              }}>
                <strong>WayPoint</strong>{" "}
                <span style={{ color: wp.white50 }}>|</span>{" "}
                <span style={{ color: wp.white70 }}>A product of Crispy Development</span>
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                color: wp.white70,
                margin: 0,
              }}>
                <a
                  href="mailto:chris@waypointai.coach"
                  style={{ color: wp.white85, textDecoration: "none" }}
                >
                  chris@waypointai.coach
                </a>
                {" "}<span style={{ color: wp.white50 }}>|</span>{" "}
                WayPointAI.coach
              </p>
            </div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.75rem",
              color: wp.white50,
              margin: 0,
              textAlign: "right",
            }}>
              Voice AI coaching for cross-cultural Christian workers
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
