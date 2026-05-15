import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "WayPoint — AI Voice Coaching for Cross-Cultural Leaders | Crispy Development",
  description:
    "A 40-minute private voice coaching session. Built on the COACH model. Designed for Christian workers navigating cross-cultural complexity, transition, and spiritual isolation.",
  openGraph: {
    title: "WayPoint — Voice Coaching for Cross-Cultural Leaders",
    description:
      "A private, structured coaching session — voice-based, faith-aware, built on proven coaching theory.",
  },
};

export default async function WayPointPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ctaHref = user ? "/coach" : "/login";
  const ctaLabel = user ? "Start a session →" : "Sign in to get started →";

  return (
    <>
      {/* ─────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────── */}
      <section
        style={{
          background: "oklch(18% 0.08 260)",
          paddingTop: "clamp(5rem, 10vw, 10rem)",
          paddingBottom: "clamp(5rem, 10vw, 10rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top orange rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "oklch(65% 0.15 45)",
          }}
        />

        {/* Dot grid texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, oklch(97% 0.005 80 / 0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Concentric arc — bottom-right decorative element */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-220px",
            right: "-220px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            border: "1px solid oklch(97% 0.005 80 / 0.04)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "80px",
              left: "80px",
              right: "80px",
              bottom: "80px",
              borderRadius: "50%",
              border: "1px solid oklch(97% 0.005 80 / 0.04)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "80px",
                left: "80px",
                right: "80px",
                bottom: "80px",
                borderRadius: "50%",
                border: "1px solid oklch(65% 0.15 45 / 0.12)",
              }}
            />
          </div>
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "680px" }}>
            {/* Label row with BETA badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                marginBottom: "1.75rem",
                flexWrap: "wrap",
              }}
            >
              <p
                className="t-label"
                style={{ color: "oklch(65% 0.15 45)", margin: 0 }}
              >
                Crispy Development
              </p>
              <span
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  background: "oklch(65% 0.15 45 / 0.2)",
                  border: "1px solid oklch(65% 0.15 45 / 0.5)",
                  color: "oklch(65% 0.15 45)",
                  padding: "0.25rem 0.6rem",
                  lineHeight: 1,
                }}
              >
                Beta
              </span>
            </div>

            {/* Main heading — Cormorant italic for elegance */}
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "clamp(3.2rem, 7vw + 1rem, 7rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                color: "oklch(97% 0.005 80)",
                marginBottom: "0.5rem",
              }}
            >
              WayPoint
            </h1>

            {/* Sub-headline — Montserrat for contrast */}
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "clamp(1rem, 2vw + 0.2rem, 1.4rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                marginBottom: "2rem",
              }}
            >
              AI Voice Coaching
            </p>

            <p
              className="t-tagline"
              style={{
                color: "oklch(76% 0.04 260)",
                marginBottom: "2.75rem",
                maxWidth: "54ch",
              }}
            >
              A private 40-minute coaching session — voice-based, built on the
              COACH model, designed for leaders who carry the weight of
              cross-cultural work.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href={ctaHref} className="btn-primary">
                {ctaLabel}
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.775rem",
                  color: "oklch(52% 0.008 260)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Available to Crispy Leaders members
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          WHAT A SESSION LOOKS LIKE — 5 phases
      ───────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(4.5rem, 8vw, 8rem)",
          background: "oklch(97% 0.005 80)",
        }}
      >
        <div className="container-wide">
          <div style={{ marginBottom: "3.5rem", maxWidth: "600px" }}>
            <p
              className="t-label"
              style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}
            >
              The Session
            </p>
            <h2 className="t-section" style={{ marginBottom: "1rem" }}>
              What a WayPoint session
              <br />
              looks like
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                color: "oklch(42% 0.008 260)",
              }}
            >
              Every session follows the same five-phase arc — grounded in Keith
              Webb's COACH model, refined for cross-cultural workers. About 40
              minutes. No preparation needed.
            </p>
          </div>

          {/* Phase timeline */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: "oklch(88% 0.008 80)",
            }}
          >
            {[
              {
                phase: "01",
                code: "LAND",
                title: "Arrive & Connect",
                duration: "~4 min",
                body: "You arrive. WayPoint creates space. No agenda yet — just a grounded start that settles you into the session.",
                accent: false,
              },
              {
                phase: "02",
                code: "SEEK",
                title: "Find Your Focus",
                duration: "~6 min",
                body: "The FIRE process helps surface what actually matters right now — not the first thing that comes to mind, but the real focus underneath it.",
                accent: false,
              },
              {
                phase: "03",
                code: "EXPLORE",
                title: "Go Deep",
                duration: "~18 min",
                body: "Q360 questioning opens up the topic from every angle. WayPoint listens, asks, and helps you discover what you already know but haven't yet said.",
                accent: true,
              },
              {
                phase: "04",
                code: "COMMIT",
                title: "Name Your Steps",
                duration: "~6 min",
                body: "Two or three concrete action steps — chosen by you, not prescribed. Specific enough to act on. Yours to own.",
                accent: false,
              },
              {
                phase: "05",
                code: "CARRY",
                title: "Close & Reflect",
                duration: "~5 min",
                body: "The session closes with reflection, a summary of what emerged, and — if you want it — a moment of prayer.",
                accent: false,
              },
            ].map(({ phase, code, title, duration, body, accent }) => (
              <div
                key={phase}
                style={{
                  background: accent
                    ? "oklch(22% 0.10 260)"
                    : "oklch(97% 0.005 80)",
                  padding: "clamp(1.5rem, 3vw, 2.25rem)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                  borderTop: accent
                    ? "3px solid oklch(65% 0.15 45)"
                    : "3px solid transparent",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "0.62rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: accent
                        ? "oklch(65% 0.15 45)"
                        : "oklch(72% 0.008 260)",
                    }}
                  >
                    {phase}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      color: accent
                        ? "oklch(52% 0.008 260)"
                        : "oklch(68% 0.006 80)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {duration}
                  </span>
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "oklch(65% 0.15 45)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {code}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "clamp(1rem, 1.5vw + 0.3rem, 1.2rem)",
                      color: accent
                        ? "oklch(97% 0.005 80)"
                        : "oklch(22% 0.005 260)",
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {title}
                  </h3>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8375rem",
                    lineHeight: 1.7,
                    color: accent
                      ? "oklch(68% 0.04 260)"
                      : "oklch(42% 0.008 260)",
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          ORANGE DIVIDER
      ───────────────────────────────────────────── */}
      <div style={{ height: "3px", background: "oklch(65% 0.15 45)" }} />

      {/* ─────────────────────────────────────────────
          WHAT IT IS vs WHAT IT ISN'T
      ───────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(4.5rem, 8vw, 8rem)",
          background: "oklch(22% 0.10 260)",
        }}
      >
        <div className="container-wide">
          <div style={{ marginBottom: "3.5rem", maxWidth: "600px" }}>
            <p
              className="t-label"
              style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}
            >
              Clarity
            </p>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)" }}>
              What WayPoint is —
              <br />
              and isn&apos;t
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1px",
              background: "oklch(38% 0.06 260)",
            }}
          >
            {/* IS column */}
            <div
              style={{
                background: "oklch(28% 0.11 260)",
                padding: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "oklch(65% 0.15 45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      color: "white",
                    }}
                  >
                    ✓
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "oklch(97% 0.005 80)",
                    margin: 0,
                  }}
                >
                  What it is
                </h3>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {[
                  {
                    title: "A structured coaching conversation",
                    body: "Grounded in the COACH model — a globally respected framework for non-directive, transformational coaching.",
                  },
                  {
                    title: "A space where you do the thinking",
                    body: "WayPoint asks. You discover. The coach creates space — the Holy Spirit teaches. That's the design.",
                  },
                  {
                    title: "Completely private",
                    body: "Your conversation belongs to you. The transcript is never shared. The whiteboard is yours to keep.",
                  },
                  {
                    title: "Available when you need it",
                    body: "No scheduling. No waiting list. When you have 40 minutes, a session is there.",
                  },
                  {
                    title: "Faith-aware, not prescriptive",
                    body: "WayPoint holds space for faith naturally — without pushing an agenda or quoting verses at you.",
                  },
                ].map(({ title, body }) => (
                  <li
                    key={title}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "oklch(65% 0.15 45)",
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: "0.15em",
                        fontSize: "0.8rem",
                      }}
                    >
                      ✓
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "oklch(97% 0.005 80)",
                          margin: "0 0 0.2rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8125rem",
                          lineHeight: 1.65,
                          color: "oklch(62% 0.008 260)",
                          margin: 0,
                        }}
                      >
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ISN'T column */}
            <div
              style={{
                background: "oklch(24% 0.09 260)",
                padding: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "oklch(38% 0.06 260)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      color: "oklch(62% 0.008 260)",
                    }}
                  >
                    ✕
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "oklch(72% 0.04 260)",
                    margin: 0,
                  }}
                >
                  What it isn&apos;t
                </h3>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {[
                  {
                    title: "Not therapy or counselling",
                    body: "WayPoint is coaching — forward-focused, action-oriented. It does not treat trauma, mental health conditions, or crisis situations.",
                  },
                  {
                    title: "Not an advice machine",
                    body: "WayPoint does not tell you what to do. It creates space for you to figure that out yourself — because that's what real coaching does.",
                  },
                  {
                    title: "Not a Bible teacher",
                    body: "WayPoint is faith-aware but not prescriptive. It won't quote verses at you or tell you what God is saying.",
                  },
                  {
                    title: "Not a replacement for human community",
                    body: "WayPoint is a tool — not a relationship. It doesn't replace pastoral support, peer groups, or professional care.",
                  },
                  {
                    title: "Not watching or monitoring you",
                    body: "There is no surveillance. No one reviews your conversations. Your transcript is always private.",
                  },
                ].map(({ title, body }) => (
                  <li
                    key={title}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "oklch(52% 0.008 260)",
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: "0.15em",
                        fontSize: "0.8rem",
                      }}
                    >
                      ✕
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "oklch(78% 0.04 260)",
                          margin: "0 0 0.2rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8125rem",
                          lineHeight: 1.65,
                          color: "oklch(52% 0.008 260)",
                          margin: 0,
                        }}
                      >
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Faith note */}
          <div
            style={{
              marginTop: "2.5rem",
              padding: "1.5rem 2rem",
              borderLeft: "3px solid oklch(65% 0.15 45)",
              background: "oklch(65% 0.15 45 / 0.06)",
            }}
          >
            <p
              className="t-tagline"
              style={{
                color: "oklch(76% 0.04 260)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;The coach creates space. The Holy Spirit teaches.&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.775rem",
                color: "oklch(52% 0.008 260)",
                marginTop: "0.5rem",
                margin: "0.5rem 0 0",
              }}
            >
              This is the philosophy behind every WayPoint session. Keith Webb&apos;s
              COACH model was designed for exactly this kind of work.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          THE LIVE WHITEBOARD
      ───────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(4.5rem, 8vw, 8rem)",
          background: "oklch(97% 0.005 80)",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(3rem, 6vw, 6rem)",
              alignItems: "start",
            }}
          >
            {/* Left: explanation */}
            <div>
              <p
                className="t-label"
                style={{
                  color: "oklch(65% 0.15 45)",
                  marginBottom: "0.875rem",
                }}
              >
                Live Whiteboard
              </p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>
                Your thinking,
                <br />
                made visible
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.75,
                  color: "oklch(42% 0.008 260)",
                  marginBottom: "1.5rem",
                }}
              >
                As you talk, WayPoint builds a whiteboard alongside you. Not a
                transcript — a distillation. Five fields that capture what
                actually emerged from the conversation.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.75,
                  color: "oklch(42% 0.008 260)",
                  marginBottom: "1.5rem",
                }}
              >
                The whiteboard belongs to you. Previous sessions stay in your
                history. No one else can see them.
              </p>
              <p
                className="t-tagline"
                style={{
                  color: "oklch(52% 0.008 260)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                A record of your thinking — not a log of your words.
              </p>
            </div>

            {/* Right: whiteboard mock */}
            <div>
              <div
                style={{
                  background: "oklch(18% 0.08 260)",
                  border: "1px solid oklch(38% 0.06 260)",
                  overflow: "hidden",
                  boxShadow:
                    "0 24px 56px oklch(10% 0.08 260 / 0.35), 0 0 0 1px oklch(38% 0.06 260)",
                }}
              >
                {/* Whiteboard header bar */}
                <div
                  style={{
                    background: "oklch(22% 0.10 260)",
                    padding: "0.875rem 1.25rem",
                    borderBottom: "1px solid oklch(32% 0.08 260)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.52rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "oklch(65% 0.15 45)",
                        margin: "0 0 0.2rem",
                      }}
                    >
                      WayPoint
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "oklch(97% 0.005 80)",
                        margin: 0,
                      }}
                    >
                      Session whiteboard
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "oklch(65% 0.15 45)",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.55rem",
                        fontWeight: 600,
                        color: "oklch(65% 0.15 45)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Live
                    </span>
                  </div>
                </div>

                {/* Whiteboard fields */}
                <div
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {[
                    {
                      label: "Focus",
                      value: "Feeling stretched across three teams with no clear priority framework",
                      filled: true,
                    },
                    {
                      label: "Key Insights",
                      value: "The tension isn't workload — it's unclear ownership. I keep absorbing what others haven't been equipped to carry.",
                      filled: true,
                    },
                    {
                      label: "Values Named",
                      value: "Faithfulness · Clarity · Empowering others",
                      filled: true,
                    },
                    {
                      label: "Action Steps",
                      value: "1. Clarify ownership with team leads by Friday\n2. Block one protected hour daily this week",
                      filled: true,
                    },
                    {
                      label: "Carrying Forward",
                      value: "Trust that equipping others is not a detour — it is the work.",
                      filled: true,
                    },
                  ].map(({ label, value, filled }) => (
                    <div
                      key={label}
                      style={{
                        background: filled
                          ? "oklch(24% 0.09 260)"
                          : "oklch(20% 0.08 260)",
                        border: `1px solid ${filled ? "oklch(38% 0.06 260)" : "oklch(30% 0.06 260)"}`,
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.5rem",
                          fontWeight: 700,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "oklch(65% 0.15 45)",
                          margin: "0 0 0.35rem",
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.68rem",
                          lineHeight: 1.6,
                          color: filled
                            ? "oklch(80% 0.04 260)"
                            : "oklch(42% 0.006 260)",
                          margin: 0,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  color: "oklch(62% 0.006 80)",
                  marginTop: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                Example only — your whiteboard reflects your conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          FOR CROSS-CULTURAL WORKERS
      ───────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(4.5rem, 8vw, 8rem)",
          background: "oklch(30% 0.12 260)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            pointerEvents: "none",
          }}
        />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ marginBottom: "3.5rem", maxWidth: "600px" }}>
            <p
              className="t-label"
              style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}
            >
              Who it&apos;s for
            </p>
            <h2
              className="t-section"
              style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem" }}
            >
              Built for those who
              <br />
              carry the most
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                color: "oklch(72% 0.04 260)",
                maxWidth: "52ch",
              }}
            >
              WayPoint was designed specifically for cross-cultural Christian
              workers — the people least likely to have access to professional
              coaching, and most likely to need it.
            </p>
          </div>

          {/* Pressure cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1px",
              background: "oklch(42% 0.06 260)",
              marginBottom: "3rem",
            }}
          >
            {[
              {
                num: "01",
                title: "Identity under pressure",
                body: "When every cultural signal tells you something different about who you should be — and the real you gets harder to find.",
              },
              {
                num: "02",
                title: "Spiritual isolation",
                body: "You serve others spiritually. But who holds space for you? WayPoint is one small answer to a large and often unspoken need.",
              },
              {
                num: "03",
                title: "No access to coaching",
                body: "Professional coaching costs $150–300 per hour. Most cross-cultural workers don't have that. WayPoint changes the equation.",
              },
              {
                num: "04",
                title: "Fruitless years that cost you",
                body: "Years of effort that felt invisible. WayPoint creates space to name what's really happening — and decide what comes next.",
              },
              {
                num: "05",
                title: "Leadership without a map",
                body: "Navigating complexity across cultures with no clear framework. WayPoint helps you find your own clarity.",
              },
              {
                num: "06",
                title: "Transition and re-entry",
                body: "Coming home from the field — or preparing for the next step. WayPoint is a structured space to think it through.",
              },
            ].map(({ num, title, body }) => (
              <div
                key={num}
                style={{
                  background: "oklch(26% 0.11 260)",
                  padding: "clamp(1.5rem, 3vw, 2rem)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    color: "oklch(65% 0.15 45)",
                  }}
                >
                  {num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "oklch(97% 0.005 80)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8375rem",
                    lineHeight: 1.7,
                    color: "oklch(62% 0.008 260)",
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Audience callout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: "oklch(42% 0.06 260)",
            }}
          >
            {[
              "Field workers & cross-cultural workers",
              "Expat professionals navigating complexity",
              "Multicultural team managers",
              "Leaders in transition or re-entry",
              "Anyone without access to professional coaching",
            ].map((group) => (
              <div
                key={group}
                style={{
                  background: "oklch(22% 0.10 260)",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    color: "oklch(65% 0.15 45)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    color: "oklch(80% 0.04 260)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {group}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          PRIVACY
      ───────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: "oklch(97% 0.005 80)",
          borderTop: "1px solid oklch(88% 0.008 80)",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(2rem, 5vw, 5rem)",
              alignItems: "center",
            }}
          >
            <div>
              <p
                className="t-label"
                style={{
                  color: "oklch(65% 0.15 45)",
                  marginBottom: "0.875rem",
                }}
              >
                Privacy
              </p>
              <h2
                className="t-section"
                style={{ marginBottom: "1.25rem", maxWidth: "420px" }}
              >
                Your session is yours.
                <br />
                Full stop.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.75,
                  color: "oklch(42% 0.008 260)",
                  maxWidth: "48ch",
                }}
              >
                Coaching only works when the space is safe. WayPoint was built
                around that principle from the ground up.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {[
                {
                  title: "Full conversation is always private",
                  body: "No one at Crispy Development can access your session transcript. No one.",
                },
                {
                  title: "The whiteboard belongs to you",
                  body: "Your distilled insights stay in your account, accessible only to you.",
                },
                {
                  title: "No automatic sharing",
                  body: "Nothing leaves your account without your explicit action. You are always in control.",
                },
                {
                  title: "No surveillance, no monitoring",
                  body: "WayPoint is not watching you. The only record is the one you choose to keep.",
                },
              ].map(({ title, body }, i) => (
                <div
                  key={title}
                  style={{
                    paddingBlock: "1.5rem",
                    borderTop:
                      i === 0 ? "none" : "1px solid oklch(88% 0.008 80)",
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "oklch(88% 0.008 80)",
                      lineHeight: 1,
                      flexShrink: 0,
                      minWidth: "2rem",
                      marginTop: "0.1em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: "oklch(22% 0.005 260)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.8375rem",
                        lineHeight: 1.65,
                        color: "oklch(52% 0.008 260)",
                        margin: 0,
                      }}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          BETA CTA
      ───────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(5rem, 10vw, 10rem)",
          background: "oklch(18% 0.08 260)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bottom orange rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "oklch(65% 0.15 45)",
          }}
        />

        {/* Dot grid */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Concentric arc — top-left */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-200px",
            left: "-200px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            border: "1px solid oklch(97% 0.005 80 / 0.04)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "70px",
              left: "70px",
              right: "70px",
              bottom: "70px",
              borderRadius: "50%",
              border: "1px solid oklch(65% 0.15 45 / 0.1)",
            }}
          />
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ maxWidth: "600px" }}>
            {/* Beta badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "oklch(65% 0.15 45 / 0.15)",
                border: "1px solid oklch(65% 0.15 45 / 0.4)",
                padding: "0.375rem 0.875rem",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                }}
              >
                Beta — now available
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "clamp(2.4rem, 5vw + 0.5rem, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "oklch(97% 0.005 80)",
                marginBottom: "1.5rem",
              }}
            >
              Ready to think
              <br />
              out loud?
            </h2>

            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                color: "oklch(72% 0.04 260)",
                maxWidth: "50ch",
                marginBottom: "0.5rem",
              }}
            >
              WayPoint is in beta and available to Crispy Leaders members.
              Sessions are limited during this phase — coaching minutes are
              allocated per account.
            </p>

            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                color: "oklch(62% 0.008 260)",
                maxWidth: "50ch",
                marginBottom: "2.75rem",
              }}
            >
              Powered by Google Gemini Live. Built on the COACH model.
              Designed for people like you.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link href={ctaHref} className="btn-primary">
                {ctaLabel}
              </Link>
              {!user && (
                <Link href="/membership" className="btn-ghost">
                  Apply for membership →
                </Link>
              )}
            </div>

            {!user && (
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.775rem",
                  color: "oklch(45% 0.006 260)",
                  marginTop: "1.25rem",
                  lineHeight: 1.6,
                }}
              >
                Not a member yet? Apply for the Crispy Leaders platform.
                <br />
                Membership is reviewed personally.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
