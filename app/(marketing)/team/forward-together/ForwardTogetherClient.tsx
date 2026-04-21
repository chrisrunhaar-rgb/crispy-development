"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

type Props = { user: User | null };

const JOURNEY_MODULES = [
  {
    num: "01",
    title: "Team Foundations",
    summary: "A team that knows why it's different from a group",
  },
  {
    num: "02",
    title: "Purpose & Vision",
    summary: "A shared why that goes deeper than your task",
  },
  {
    num: "03",
    title: "Know Each Other",
    summary: "Opened up to each other — and experienced what real knowing feels like",
  },
  {
    num: "04",
    title: "Communication Culture",
    summary: "Set a communication culture and named the norms that make it work",
  },
  {
    num: "05",
    title: "Trust & Psychological Safety",
    summary: "Measured your trust and took honest steps toward deeper safety",
  },
  {
    num: "06",
    title: "Roles & Contribution",
    summary: "Named your contributions and honoured the gifts each person carries",
  },
  {
    num: "07",
    title: "Navigating Conflict",
    summary: "Faced conflict and built a framework for moving through it together",
  },
  {
    num: "08",
    title: "Decision-Making",
    summary: "Clarified how you decide — no more guessing who has the call",
  },
  {
    num: "09",
    title: "Accountability & Follow-Through",
    summary: "Made commitments and built a culture that keeps its word",
  },
  {
    num: "10",
    title: "Forward Together",
    summary: "Here. Deeper, stronger, more honest than when you started.",
    isCurrent: true,
  },
];

const DECLARATION_STEPS = [
  {
    id: "exist",
    step: 1,
    stem: "We exist to",
    placeholder: "serve, equip, and unite...",
  },
  {
    id: "treat",
    step: 2,
    stem: "We commit to treating each other with",
    placeholder: "honesty, patience, and genuine care...",
  },
  {
    id: "believe",
    step: 3,
    stem: "We believe that across our differences, God has placed us together to",
    placeholder: "reflect his Kingdom and build something we couldn't build alone...",
  },
  {
    id: "forward",
    step: 4,
    stem: "As we move forward, our one shared commitment is",
    placeholder: "to keep choosing each other, and keep doing the work...",
  },
];

export default function ForwardTogetherClient({ user }: Props) {
  const [teamName, setTeamName] = useState("Our Team");
  const [inputs, setInputs] = useState<Record<string, string>>({
    exist: "",
    treat: "",
    believe: "",
    forward: "",
  });
  const [copied, setCopied] = useState(false);

  const allFilled = DECLARATION_STEPS.every((s) => inputs[s.id].trim().length > 0);
  const declarationText = allFilled
    ? `${teamName} — Our Declaration\n\nWe exist to ${inputs.exist}.\nWe commit to treating each other with ${inputs.treat}.\nWe believe that across our differences, God has placed us together to ${inputs.believe}.\nAs we move forward, our one shared commitment is ${inputs.forward}.\n\nThis is who we are. This is how we move. Forward together.`
    : "";

  const handleCopy = useCallback(() => {
    if (!declarationText) return;
    navigator.clipboard.writeText(declarationText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [declarationText]);

  // Warm color palette — different from the standard navy
  const warmDeep = "oklch(28% 0.09 38)"; // deep warm brown-navy
  const warmMid = "oklch(36% 0.10 38)"; // mid warm
  const warmAccent = "oklch(65% 0.15 45)"; // same orange
  const cream = "oklch(97% 0.008 80)";
  const creamMid = "oklch(93% 0.012 70)";
  const creamDark = "oklch(88% 0.018 65)";
  const navy = "oklch(22% 0.08 260)";
  const navyMid = "oklch(30% 0.12 260)";
  const bodyText = "oklch(35% 0.06 50)"; // warm body text
  const muted = "oklch(55% 0.06 50)";
  const border = "oklch(85% 0.015 65)";

  return (
    <div
      style={{
        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        background: cream,
        minHeight: "100vh",
      }}
    >
      {/* ── HERO — special warm treatment ── */}
      <section
        style={{
          background: warmDeep,
          padding:
            "clamp(5rem, 10vw, 9rem) 24px clamp(4rem, 8vw, 7rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Warm glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 30% 60%, oklch(45% 0.12 45 / 0.18), transparent 55%), radial-gradient(ellipse at 85% 20%, oklch(36% 0.10 38 / 0.5), transparent 50%)",
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
            background: `linear-gradient(90deg, ${warmAccent}, oklch(72% 0.18 55))`,
          }}
        />
        <div
          className="container-wide"
          style={{
            position: "relative",
            maxWidth: 860,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "oklch(97% 0.008 80 / 0.1)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              10
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: warmAccent,
                  border: `1px solid ${warmAccent}`,
                  padding: "4px 10px",
                  borderRadius: 3,
                }}
              >
                Team Pathway · Module 10
              </span>
              <span
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "oklch(72% 0.06 45)",
                  padding: "4px 10px",
                }}
              >
                The Final Module
              </span>
            </div>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              color: cream,
              lineHeight: 1.08,
              marginBottom: "1.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            Forward Together
          </h1>
          <p
            style={{
              fontFamily: "Georgia, Cormorant Garamond, serif",
              fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
              color: "oklch(85% 0.04 65)",
              maxWidth: "52ch",
              margin: "0 auto 2.5rem",
              lineHeight: 1.65,
              fontStyle: "italic",
            }}
          >
            You've done the work. Now look at where you are.
          </p>
          <div
            style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/team"
              style={{
                padding: "11px 24px",
                borderRadius: 5,
                border: `1px solid oklch(45% 0.06 38)`,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "oklch(85% 0.04 65)",
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
                  background: warmAccent,
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: cream,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Dashboard →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ── */}
      <section
        style={{
          background: creamMid,
          padding: "clamp(3rem, 6vw, 5rem) 24px",
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: warmAccent,
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            Your Journey
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: warmDeep,
              lineHeight: 1.2,
              marginBottom: "2.5rem",
              textAlign: "center",
            }}
          >
            What You've Built Together
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1px",
              background: border,
            }}
          >
            {JOURNEY_MODULES.map((mod) => (
              <div
                key={mod.num}
                style={{
                  background: mod.isCurrent ? warmDeep : cream,
                  padding: "1.5rem 1.375rem",
                  position: "relative",
                }}
              >
                {mod.isCurrent && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: warmAccent,
                    }}
                  />
                )}
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    color: mod.isCurrent ? warmAccent : "oklch(72% 0.04 260)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {mod.num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: mod.isCurrent ? cream : warmDeep,
                    marginBottom: "0.375rem",
                  }}
                >
                  {mod.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: "0.8125rem",
                    color: mod.isCurrent
                      ? "oklch(75% 0.04 38)"
                      : muted,
                    lineHeight: 1.6,
                  }}
                >
                  {mod.summary}
                </p>
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: "Georgia, Cormorant Garamond, serif",
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              color: warmMid,
              lineHeight: 1.75,
              fontStyle: "italic",
              textAlign: "center",
              maxWidth: "56ch",
              margin: "2.5rem auto 0",
            }}
          >
            Not finished. Never finished. But deeper, stronger, more honest
            than when you started.
          </p>
        </div>
      </section>

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
              color: warmDeep,
              marginBottom: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            The Power of Naming Progress
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.25rem",
            }}
          >
            Teams that celebrate growth are teams that sustain it. But in the
            pressure of cross-cultural work, celebration gets skipped. There's
            always another challenge, another problem, another season of
            transition.
          </p>
          <p style={{ fontSize: "1rem", color: bodyText, lineHeight: 1.8 }}>
            This module is a deliberate pause — to name what's been built,
            what's been learned, and who you've become together.
          </p>
        </section>

        {/* Section 2 — Biblical */}
        <section
          style={{
            background: warmDeep,
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
              background: warmAccent,
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: warmAccent,
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
                color: cream,
                lineHeight: 1.65,
                fontStyle: "italic",
                marginBottom: "0.5rem",
              }}
            >
              "He who began a good work in you will carry it on to completion
              until the day of Christ Jesus."
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.8rem",
                color: warmAccent,
                fontWeight: 600,
                marginBottom: "0.875rem",
              }}
            >
              Philippians 1:6
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.9rem",
                color: "oklch(72% 0.04 38)",
                lineHeight: 1.75,
              }}
            >
              The team you are building is not your project — it's God's. You
              are stewards of one of the most powerful structures in the
              Kingdom: a community of people who are genuinely learning to love
              and serve one another across every kind of difference.
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "Georgia, Cormorant Garamond, serif",
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                color: cream,
                lineHeight: 1.65,
                fontStyle: "italic",
                marginBottom: "0.5rem",
              }}
            >
              "Let us run with perseverance the race marked out for us, fixing
              our eyes on Jesus."
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.8rem",
                color: warmAccent,
                fontWeight: 600,
                marginBottom: "0.875rem",
              }}
            >
              Hebrews 12:1–2
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.9rem",
                color: "oklch(72% 0.04 38)",
                lineHeight: 1.75,
              }}
            >
              Forward together is always toward him.
            </p>
          </div>
        </section>

        {/* Section 3 — What comes next */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
              color: warmDeep,
              marginBottom: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            What Comes Next
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: bodyText,
              lineHeight: 1.8,
              marginBottom: "1.5rem",
            }}
          >
            A healthy team never stops growing. The journey doesn't end here —
            it begins again. Some questions to hold as you move forward:
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
              "What areas of our team life still need the most attention?",
              "What has this journey revealed about our individual and collective growth edges?",
              "What do we want to be different a year from now?",
              "Who do we need to bring into this journey — new members, new leaders, new voices?",
            ].map((q, i) => (
              <div
                key={i}
                style={{
                  background: cream,
                  padding: "1.25rem 1.5rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "1.125rem",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "1rem",
                    color: warmAccent,
                    fontStyle: "italic",
                    paddingTop: "1px",
                  }}
                >
                  {["I", "II", "III", "IV"][i]}.
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: "0.9375rem",
                    color: bodyText,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {q}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Cross-cultural endurance — special callout */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${warmMid}, oklch(32% 0.08 50))`,
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
                  "radial-gradient(ellipse at 90% 10%, oklch(55% 0.12 45 / 0.15), transparent 50%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "3px",
                background: warmAccent,
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
                  color: warmAccent,
                  marginBottom: "1rem",
                }}
              >
                A Word About Cross-Cultural Endurance
              </p>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: "0.9375rem",
                  color: "oklch(88% 0.015 65)",
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                Cross-cultural teams carry a specific exhaustion. The labour of
                translation — not just language, but culture, value, assumption
                — is real. It requires more patience, more humility, more grace
                than mono-cultural work.
              </p>
              <p
                style={{
                  fontFamily: "Georgia, Cormorant Garamond, serif",
                  fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                  color: cream,
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                And it produces something nothing else can: a team whose unity
                is not accidental, but chosen. A team that says: "We are
                different. We choose each other anyway. Because the Kingdom is
                worth it."
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── DECLARATION BUILDER ── */}
      <section
        style={{
          background: creamMid,
          padding: "clamp(3.5rem, 7vw, 6rem) 24px",
          borderTop: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: warmAccent,
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
                color: warmDeep,
                lineHeight: 1.15,
                marginBottom: "0.875rem",
              }}
            >
              Team Declaration Builder
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.9375rem",
                color: muted,
                maxWidth: "56ch",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Complete each sentence together as a team. When all four are
              filled, your declaration will appear — ready to share, print, and
              carry forward.
            </p>
          </div>

          {/* Team name */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: warmDeep,
                display: "block",
                marginBottom: "0.625rem",
              }}
            >
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Our Team"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `2px solid ${border}`,
                background: cream,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: warmDeep,
                borderRadius: 4,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Steps */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            {DECLARATION_STEPS.map((step) => {
              const isFilled = inputs[step.id].trim().length > 0;
              return (
                <div
                  key={step.id}
                  style={{
                    background: cream,
                    border: `2px solid ${isFilled ? warmAccent : border}`,
                    padding: "1.75rem",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontWeight: 800,
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        color: isFilled ? warmAccent : "oklch(72% 0.04 260)",
                        border: `1px solid ${isFilled ? warmAccent : border}`,
                        padding: "3px 8px",
                        borderRadius: 2,
                      }}
                    >
                      Step {step.step}
                    </span>
                    {isFilled && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: warmAccent,
                          display: "inline-block",
                        }}
                      />
                    )}
                  </div>
                  <label
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: warmDeep,
                      display: "block",
                      marginBottom: "0.75rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.stem}…
                  </label>
                  <textarea
                    value={inputs[step.id]}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        [step.id]: e.target.value,
                      }))
                    }
                    placeholder={step.placeholder}
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: `1px solid ${border}`,
                      background: "oklch(98% 0.006 75)",
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: "0.9375rem",
                      color: warmDeep,
                      lineHeight: 1.6,
                      borderRadius: 4,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Declaration Card */}
          {allFilled ? (
            <div
              style={{
                background: warmDeep,
                padding: "clamp(2.5rem, 5vw, 3.5rem)",
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
                    "radial-gradient(ellipse at 80% 20%, oklch(40% 0.10 45 / 0.3), transparent 55%)",
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
                  background: `linear-gradient(90deg, ${warmAccent}, oklch(72% 0.18 55))`,
                }}
              />
              <div style={{ position: "relative" }}>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: warmAccent,
                    marginBottom: "1.5rem",
                  }}
                >
                  {teamName} — Our Declaration
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.125rem",
                    marginBottom: "2rem",
                  }}
                >
                  {[
                    `We exist to ${inputs.exist}.`,
                    `We commit to treating each other with ${inputs.treat}.`,
                    `We believe that across our differences, God has placed us together to ${inputs.believe}.`,
                    `As we move forward, our one shared commitment is ${inputs.forward}.`,
                  ].map((line, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "Georgia, Cormorant Garamond, serif",
                        fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                        color: "oklch(90% 0.01 70)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div
                  style={{
                    borderTop: "1px solid oklch(97% 0.005 80 / 0.15)",
                    paddingTop: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Georgia, Cormorant Garamond, serif",
                      fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                      color: cream,
                      lineHeight: 1.65,
                      fontStyle: "italic",
                      fontWeight: 600,
                    }}
                  >
                    This is who we are. This is how we move. Forward together.
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: "11px 24px",
                    background: copied ? "oklch(52% 0.1 155)" : warmAccent,
                    border: "none",
                    color: cream,
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    borderRadius: 4,
                    transition: "background 0.2s",
                    letterSpacing: "0.02em",
                  }}
                >
                  {copied ? "Copied!" : "Copy Declaration"}
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                border: `2px dashed ${border}`,
                color: muted,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "0.875rem",
                lineHeight: 1.6,
              }}
            >
              Complete all four steps above to see your Team Declaration
              <br />
              <span style={{ color: warmAccent, fontWeight: 600 }}>
                {DECLARATION_STEPS.filter((s) => inputs[s.id].trim()).length}{" "}
                of 4 steps completed
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{
          background: warmDeep,
          padding: "clamp(4rem, 8vw, 7rem) 24px",
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
              "radial-gradient(ellipse at 20% 80%, oklch(40% 0.10 45 / 0.25), transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "clamp(1.5rem, 5vw, 4rem)",
            top: "clamp(3rem, 6vw, 5rem)",
            bottom: "clamp(3rem, 6vw, 5rem)",
            width: "3px",
            background: warmAccent,
          }}
        />
        <div
          className="container-wide"
          style={{
            maxWidth: 760,
            margin: "0 auto",
            paddingLeft: "3rem",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: warmAccent,
              marginBottom: "1.25rem",
            }}
          >
            You've completed the Team Pathway
          </p>
          <p
            style={{
              fontFamily: "Georgia, Cormorant Garamond, serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
              color: "oklch(82% 0.04 65)",
              lineHeight: 1.65,
              fontStyle: "italic",
              maxWidth: "48ch",
              marginBottom: "1.5rem",
            }}
          >
            "He who began a good work in you will carry it on to completion."
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              color: cream,
              lineHeight: 1.12,
              marginBottom: "1.25rem",
              maxWidth: "18ch",
            }}
          >
            Keep going.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "0.9375rem",
              color: "oklch(72% 0.04 38)",
              lineHeight: 1.75,
              maxWidth: "48ch",
              marginBottom: "2.5rem",
            }}
          >
            This is not the end of the journey — it is the beginning of doing
            it again, more deeply. Return to the dashboard to review your team's
            work, revisit modules, and keep building.
          </p>
          <div
            style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}
          >
            {user ? (
              <Link
                href="/app/dashboard"
                style={{
                  padding: "13px 30px",
                  background: warmAccent,
                  color: cream,
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  borderRadius: 5,
                  display: "inline-block",
                  letterSpacing: "0.02em",
                }}
              >
                Back to Dashboard →
              </Link>
            ) : (
              <Link
                href="/signup?pathway=team"
                style={{
                  padding: "13px 30px",
                  background: warmAccent,
                  color: cream,
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  borderRadius: 5,
                  display: "inline-block",
                }}
              >
                Join the Team Pathway →
              </Link>
            )}
            <Link
              href="/team"
              style={{
                padding: "13px 30px",
                border: `1px solid oklch(45% 0.06 38)`,
                color: "oklch(78% 0.04 38)",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                textDecoration: "none",
                borderRadius: 5,
                display: "inline-block",
              }}
            >
              Team Pathway Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
