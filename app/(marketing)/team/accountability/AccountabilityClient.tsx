"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

type Props = { user: User | null };

const COMMITMENT_CARDS = [
  {
    id: "specific",
    number: "01",
    title: "I will be specific.",
    statement:
      "I commit to naming clear commitments: what I will do, by when, and to whom. No vague intentions dressed up as promises.",
    implication:
      "Before I leave any meeting, I will name one clear, specific commitment I'm making.",
  },
  {
    id: "flag-early",
    number: "02",
    title: "I will flag early.",
    statement:
      "When I'm not going to deliver as promised, I will say so before it's due — not after. I will not let silence become deception.",
    implication:
      "If something is at risk, I'll name it to the person it affects before the deadline, not after.",
  },
  {
    id: "hold-gently",
    number: "03",
    title: "I will hold gently and firmly.",
    statement:
      "When a teammate doesn't follow through, I will raise it — kindly, directly, and without letting it build into resentment. I will do for them what I'd want them to do for me.",
    implication:
      "I won't ignore non-delivery and I won't make it personal. I'll ask: 'What happened? How can I help?'",
  },
];

const TEAM_DECLARATION =
  "As a team, we commit to naming our commitments clearly, flagging early when we can't deliver, and holding each other gently but firmly accountable. We believe that a team that keeps its word is a team worth trusting.";

export default function AccountabilityClient({ user }: Props) {
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const allAccepted = accepted.size === COMMITMENT_CARDS.length;

  function toggle(id: string) {
    setAccepted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const navy = "oklch(22% 0.08 260)";
  const navyMid = "oklch(30% 0.12 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";
  const muted = "oklch(52% 0.06 260)";
  const lightGray = "oklch(95% 0.008 80)";
  const border = "oklch(88% 0.008 80)";

  return (
    <div
      style={{
        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        background: offWhite,
        minHeight: "100vh",
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          background: navy,
          padding: "clamp(4rem, 8vw, 7rem) 24px clamp(3.5rem, 6vw, 6rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, oklch(30% 0.12 260 / 0.6), transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: orange,
          }}
        />
        <div
          className="container-wide"
          style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "oklch(97% 0.005 80 / 0.12)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              09
            </span>
            <span
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: orange,
                border: `1px solid ${orange}`,
                padding: "4px 10px",
                borderRadius: 3,
              }}
            >
              Team Pathway · Module 9
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 800,
              color: offWhite,
              lineHeight: 1.12,
              marginBottom: "1.25rem",
              maxWidth: "18ch",
            }}
          >
            Accountability &amp; Follow-Through
          </h1>
          <p
            style={{
              fontFamily: "Georgia, Cormorant Garamond, serif",
              fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
              color: "oklch(82% 0.03 80)",
              maxWidth: "56ch",
              lineHeight: 1.65,
              fontStyle: "italic",
              marginBottom: "2.5rem",
            }}
          >
            "The gap between what a team commits to and what it actually does is
            where trust either builds or breaks."
          </p>
          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <Link
              href="/team"
              style={{
                padding: "11px 24px",
                borderRadius: 5,
                border: `1px solid oklch(50% 0.05 260)`,
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: offWhite,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              ← Back to Team Pathway
            </Link>
            {user && (
              <Link
                href="/app/dashboard"
                style={{
                  padding: "11px 24px",
                  borderRadius: 5,
                  background: orange,
                  border: "none",
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: offWhite,
                  textDecoration: "none",
                  display: "inline-block",
                  cursor: "pointer",
                }}
              >
                Dashboard →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── READING TIME BAR ── */}
      <div
        style={{
          background: navyMid,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div className="container-wide" style={{ maxWidth: 860, margin: "0 auto", width: "100%", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {[
            { label: "Reading time", value: "15–20 min" },
            { label: "Format", value: "Content + Activity" },
            { label: "Activity", value: "Commitment Cards" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
              <span
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "oklch(72% 0.04 260)",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: offWhite,
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "clamp(3rem, 6vw, 5rem) 24px",
        }}
      >
        {/* Section 1 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
              color: navy,
              marginBottom: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            Why Accountability Fails
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.25rem",
            }}
          >
            Most teams fail not because they don't care about accountability —
            but because they've never built a structure for it. Accountability
            requires:
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            {[
              "Clear commitments (not vague intentions)",
              "Shared expectations about follow-through",
              "A safe way to raise when something isn't happening",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.875rem",
                  padding: "0.875rem 1.125rem",
                  background: lightGray,
                  borderLeft: `3px solid ${orange}`,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: orange,
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: "0.9375rem",
                    color: bodyText,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "1rem", color: bodyText, lineHeight: 1.8 }}>
            Without these, accountability becomes reactive — only applied when
            something goes badly wrong — and therefore feels punitive rather
            than supportive.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
              color: navy,
              marginBottom: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            The Anatomy of a Commitment
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.5rem",
            }}
          >
            A real commitment has three parts:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: border,
              marginBottom: "1.5rem",
            }}
          >
            {[
              {
                num: "1",
                label: "What",
                desc: "Specifically what will happen. Not 'I'll think about it' — but 'I'll send the draft by Thursday.'",
              },
              {
                num: "2",
                label: "When",
                desc: "A clear time, not a vague timeframe. 'By Friday at noon' not 'soon.'",
              },
              {
                num: "3",
                label: "To Whom",
                desc: "Accountability named before the fact, not searched for after.",
              },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  background: offWhite,
                  padding: "1.75rem 1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 800,
                    fontSize: "2.5rem",
                    color: "oklch(92% 0.005 260)",
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: navy,
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: "0.875rem",
                    color: muted,
                    lineHeight: 1.65,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "1rem", color: bodyText, lineHeight: 1.8 }}>
            Most team commitments fail at one of these three. "I'll get to it
            soon" is not a commitment. "I'll have the report to Sarah by Friday
            at noon" is.
          </p>
        </section>

        {/* Section 3 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
              color: navy,
              marginBottom: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            The Role of the Leader
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.25rem",
            }}
          >
            The leader sets the accountability culture — not by holding others
            accountable, but by being the most accountable person on the team.
            Patrick Lencioni: teams that build accountability start with a
            leader who models it.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.25rem",
            }}
          >
            When the leader shows up prepared, follows through on promises, and
            names their own failures honestly — they give the whole team
            permission to do the same.
          </p>
          <div
            style={{
              borderLeft: `4px solid orange`,
              borderLeftColor: orange,
              padding: "1.25rem 1.5rem",
              background: lightGray,
              marginBottom: "1.25rem",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, Cormorant Garamond, serif",
                fontSize: "1.05rem",
                color: navy,
                lineHeight: 1.7,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Leaders who hold others accountable but not themselves create a
              compliance culture, not a commitment culture.
            </p>
          </div>
        </section>

        {/* Section 4 — Biblical */}
        <section
          style={{
            background: navy,
            padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)",
            marginBottom: "3.5rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "1.5rem",
              bottom: "1.5rem",
              width: "3px",
              background: orange,
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: "1.25rem",
            }}
          >
            Biblical Grounding
          </p>
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontFamily: "Georgia, Cormorant Garamond, serif",
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                color: offWhite,
                lineHeight: 1.65,
                fontStyle: "italic",
                marginBottom: "0.5rem",
              }}
            >
              "Let your yes be yes and your no be no."
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.8rem",
                color: orange,
                fontWeight: 600,
                marginBottom: "0.875rem",
              }}
            >
              Matthew 5:37
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.9rem",
                color: "oklch(72% 0.04 260)",
                lineHeight: 1.75,
              }}
            >
              The simplest accountability framework in Scripture. In
              cross-cultural contexts, over-commitment is a serious challenge —
              saying yes to preserve harmony, then quietly not delivering. This
              is not a cultural preference to accommodate — it is a character
              issue that leaders must gently but consistently address, across
              all cultures including their own.
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "Georgia, Cormorant Garamond, serif",
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                color: offWhite,
                lineHeight: 1.65,
                fontStyle: "italic",
                marginBottom: "0.5rem",
              }}
            >
              "Let us consider how we may spur one another on toward love and
              good deeds, not giving up meeting together."
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.8rem",
                color: orange,
                fontWeight: 600,
                marginBottom: "0.875rem",
              }}
            >
              Hebrews 10:24–25
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.9rem",
                color: "oklch(72% 0.04 260)",
                lineHeight: 1.75,
              }}
            >
              Accountability is not policing — it's spurring. It's calling out
              the best in one another.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
              color: navy,
              marginBottom: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            Cross-Cultural Accountability
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.25rem",
            }}
          >
            In hierarchical cultures, accountability flows up — not across.
            Peers don't hold each other accountable; only leaders do. This
            makes lateral accountability (among team members) feel intrusive or
            disrespectful.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.25rem",
            }}
          >
            In shame cultures, admitting non-delivery is deeply costly. Leaders
            must understand this dynamic and create structures that make honest
            reporting possible without triggering shame.
          </p>
          <div
            style={{
              padding: "1.5rem",
              background: lightGray,
              borderTop: `3px solid ${navy}`,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: navy,
                marginBottom: "0.5rem",
              }}
            >
              The goal is not a system that catches failure.
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.875rem",
                color: bodyText,
                lineHeight: 1.7,
              }}
            >
              It's a culture that makes commitment visible and honourable.
            </p>
          </div>
        </section>

        {/* Section 6 — Practices */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
              color: navy,
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            Practical Accountability Rhythms
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: muted,
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            Three simple practices that work across cultures:
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              background: border,
            }}
          >
            {[
              {
                num: "01",
                title: "The Weekly Check-In",
                body: "At the start of each team gathering, each person names one commitment from last week and one for this week. 5 minutes. Consistent.",
              },
              {
                num: "02",
                title: "The Honest Update",
                body: "When something isn't going to happen as committed, the person flags it before it's due — not after. This is modelled and rewarded, not punished.",
              },
              {
                num: "03",
                title: "The End-of-Quarter Review",
                body: "Once a quarter, the team asks: 'Which commitments did we keep? Which did we miss? What does that tell us about ourselves?'",
              },
            ].map((practice) => (
              <div
                key={practice.num}
                style={{
                  background: offWhite,
                  padding: "1.5rem 1.75rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "1.25rem",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: orange,
                    paddingTop: "3px",
                  }}
                >
                  {practice.num}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: navy,
                      marginBottom: "0.375rem",
                    }}
                  >
                    {practice.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: "0.875rem",
                      color: muted,
                      lineHeight: 1.7,
                    }}
                  >
                    {practice.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── COMMITMENT CARDS ── */}
      <section
        style={{
          background: lightGray,
          padding: "clamp(3rem, 6vw, 5rem) 24px",
          borderTop: `1px solid ${border}`,
        }}
      >
        <div
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: orange,
                marginBottom: "0.75rem",
              }}
            >
              Activity
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: navy,
                lineHeight: 1.15,
                marginBottom: "0.875rem",
              }}
            >
              Commitment Cards
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.9375rem",
                color: muted,
                maxWidth: "52ch",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Read each commitment principle. When you're ready to own it,
              accept it. When all three are accepted, your Team Commitment card
              will appear.
            </p>
          </div>

          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            {COMMITMENT_CARDS.map((card) => {
              const isAccepted = accepted.has(card.id);
              return (
                <div
                  key={card.id}
                  style={{
                    background: isAccepted ? navy : offWhite,
                    border: `2px solid ${isAccepted ? navy : border}`,
                    padding: "2rem 1.75rem",
                    transition: "background 0.25s, border-color 0.25s",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
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
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontWeight: 800,
                        fontSize: "0.7rem",
                        letterSpacing: "0.14em",
                        color: isAccepted ? orange : "oklch(72% 0.04 260)",
                      }}
                    >
                      {card.number}
                    </span>
                    {isAccepted && (
                      <span
                        style={{
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: orange,
                          border: `1px solid ${orange}`,
                          padding: "3px 8px",
                          borderRadius: 2,
                        }}
                      >
                        Accepted
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.125rem",
                      color: isAccepted ? offWhite : navy,
                      lineHeight: 1.25,
                      margin: 0,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: "0.875rem",
                      color: isAccepted
                        ? "oklch(82% 0.03 80)"
                        : bodyText,
                      lineHeight: 1.7,
                    }}
                  >
                    {card.statement}
                  </p>
                  <div
                    style={{
                      borderTop: `1px solid ${isAccepted ? "oklch(97% 0.005 80 / 0.12)" : border}`,
                      paddingTop: "0.875rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: isAccepted ? orange : muted,
                        marginBottom: "0.375rem",
                      }}
                    >
                      Personal Implication
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontSize: "0.8125rem",
                        color: isAccepted
                          ? "oklch(75% 0.04 260)"
                          : muted,
                        lineHeight: 1.65,
                        fontStyle: "italic",
                      }}
                    >
                      {card.implication}
                    </p>
                  </div>
                  <button
                    onClick={() => toggle(card.id)}
                    style={{
                      marginTop: "auto",
                      padding: "10px 20px",
                      border: isAccepted
                        ? `1px solid oklch(50% 0.05 260)`
                        : `2px solid ${navy}`,
                      background: isAccepted ? "transparent" : navy,
                      color: isAccepted
                        ? "oklch(72% 0.04 260)"
                        : offWhite,
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      borderRadius: 4,
                      transition: "all 0.2s",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {isAccepted ? "Undo" : "I commit to this"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Team Commitment Card — shown when all 3 accepted */}
          {allAccepted && (
            <div
              style={{
                background: navy,
                padding: "clamp(2rem, 4vw, 3rem)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "radial-gradient(ellipse at 80% 20%, oklch(30% 0.12 260 / 0.7), transparent 60%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: orange,
                }}
              />
              <div style={{ position: "relative" }}>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: orange,
                    marginBottom: "1.25rem",
                  }}
                >
                  Team Commitment
                </p>
                <p
                  style={{
                    fontFamily: "Georgia, Cormorant Garamond, serif",
                    fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                    color: offWhite,
                    lineHeight: 1.75,
                    fontStyle: "italic",
                    maxWidth: "64ch",
                  }}
                >
                  "{TEAM_DECLARATION}"
                </p>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {!allAccepted && (
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                color: muted,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.875rem",
              }}
            >
              {accepted.size} of 3 commitments accepted
              {accepted.size > 0 && accepted.size < 3 && (
                <span style={{ color: orange, marginLeft: "0.5rem" }}>
                  · Keep going
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: navyMid,
          padding: "clamp(3rem, 6vw, 5rem) 24px",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
            }}
          >
            Next Module
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.35rem, 2.5vw, 1.875rem)",
              color: offWhite,
              lineHeight: 1.2,
              maxWidth: "28ch",
            }}
          >
            Module 10: Forward Together
          </h2>
          <p
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "0.9375rem",
              color: "oklch(72% 0.04 260)",
              lineHeight: 1.7,
              maxWidth: "52ch",
            }}
          >
            You've done the work. The final module is a celebration, a
            reflection, and a declaration — of who your team has become and
            where you're going together.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.875rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            <Link
              href="/team/forward-together"
              style={{
                padding: "12px 28px",
                background: orange,
                color: offWhite,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                borderRadius: 5,
                display: "inline-block",
              }}
            >
              Module 10: Forward Together →
            </Link>
            <Link
              href="/team"
              style={{
                padding: "12px 28px",
                border: `1px solid oklch(45% 0.06 260)`,
                color: "oklch(78% 0.04 260)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                borderRadius: 5,
                display: "inline-block",
              }}
            >
              Back to Team Pathway
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
