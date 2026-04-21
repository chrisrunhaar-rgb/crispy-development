"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveThinkingStyleTeamResult } from "./actions";

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────

type StyleKey = "C" | "H" | "I";

interface Question {
  question: string;
  options: { text: string; style: StyleKey }[];
}

const QUESTIONS: Question[] = [
  {
    question: "Your team presents a new project idea. Your first instinct is to:",
    options: [
      { text: "Ask for a clear outline of the steps and expected outcomes.", style: "C" },
      { text: "Ask how it will affect everyone involved and the bigger picture.", style: "H" },
      { text: "Pause and notice whether something about it feels right or off.", style: "I" },
    ],
  },
  {
    question: "When conflict arises in your team, you tend to:",
    options: [
      { text: "Identify the facts and define clearly what went wrong.", style: "C" },
      { text: "Focus on restoring harmony and keeping everyone together.", style: "H" },
      { text: "Sense the emotional undercurrents and address what's really going on.", style: "I" },
    ],
  },
  {
    question: "You're making a major decision. You feel most confident when:",
    options: [
      { text: "You have enough data and logical reasoning to support your choice.", style: "C" },
      { text: "You've considered how it will affect all the people involved.", style: "H" },
      { text: "You have an inner sense it's the right move, even if you can't fully explain it.", style: "I" },
    ],
  },
  {
    question: "A colleague gives you a long, story-filled update. You most likely:",
    options: [
      { text: "Get impatient waiting for the main point.", style: "C" },
      { text: "Enjoy hearing about the context and all the connections.", style: "H" },
      { text: "Pay close attention to the tone and what's left unsaid.", style: "I" },
    ],
  },
  {
    question: "In a meeting, you are most likely to say:",
    options: [
      { text: '"Let\'s define the problem clearly before we discuss solutions."', style: "C" },
      { text: '"How will this affect the team long-term?"', style: "H" },
      { text: '"Something doesn\'t feel right about this direction."', style: "I" },
    ],
  },
  {
    question: "When reading or studying new material, you:",
    options: [
      { text: "Look for the structure, key points, and logical flow.", style: "C" },
      { text: "Connect it to other areas of life and consider broader implications.", style: "H" },
      { text: "Pay attention to how it resonates with your gut and lived experience.", style: "I" },
    ],
  },
  {
    question: "If a plan seems contradictory, you:",
    options: [
      { text: "Need the contradiction resolved before you can move forward.", style: "C" },
      { text: "Accept that tension can coexist and focus on the overall outcome.", style: "H" },
      { text: "Trust your intuition about which direction is right, even without full clarity.", style: "I" },
    ],
  },
  {
    question: "Your leadership strength is most often:",
    options: [
      { text: "Bringing clarity, structure, and direction.", style: "C" },
      { text: "Building unity and helping people see the bigger picture.", style: "H" },
      { text: "Sensing what's really happening beneath the surface.", style: "I" },
    ],
  },
  {
    question: "When communicating important information, you prefer:",
    options: [
      { text: "Clear, structured points in a logical sequence.", style: "C" },
      { text: "Stories and examples that show how things connect.", style: "H" },
      { text: "Reflective language that captures the atmosphere and deeper meaning.", style: "I" },
    ],
  },
  {
    question: 'When someone says "I just sense this is the right thing to do," you:',
    options: [
      { text: "Ask them to give you evidence or reasoning.", style: "C" },
      { text: "Consider how that feeling fits into the bigger relational context.", style: "H" },
      { text: "Respect it — you know that intuition is a valid form of knowing.", style: "I" },
    ],
  },
  {
    question: "On a new team, you naturally:",
    options: [
      { text: "Try to establish clear roles, processes, and expectations.", style: "C" },
      { text: "Focus on building relationships and understanding group dynamics.", style: "H" },
      { text: "Read the room and tune into the unspoken atmosphere.", style: "I" },
    ],
  },
  {
    question: "When evaluating whether something is true, you primarily ask:",
    options: [
      { text: "Is it consistent and principled?", style: "C" },
      { text: "Does it fit the full context and relationships involved?", style: "H" },
      { text: "Does it ring true from lived experience or inner conviction?", style: "I" },
    ],
  },
  {
    question: "A team member is struggling. Your first response is to:",
    options: [
      { text: "Identify what's causing the problem and suggest a clear plan.", style: "C" },
      { text: "Make sure they feel supported and explore how it's affecting everyone.", style: "H" },
      { text: "Sit with them and tune into what's really going on beneath the surface.", style: "I" },
    ],
  },
  {
    question: "When planning, you feel most at home with:",
    options: [
      { text: "Detailed steps and measurable outcomes.", style: "C" },
      { text: "Flexible plans that consider people and relationships.", style: "H" },
      { text: "A general sense of direction guided by discernment.", style: "I" },
    ],
  },
  {
    question: "Your biggest frustration in a team is when:",
    options: [
      { text: "Things are disorganized or undefined.", style: "C" },
      { text: "People ignore relational dynamics and focus only on tasks.", style: "H" },
      { text: "The atmosphere feels wrong but no one acknowledges it.", style: "I" },
    ],
  },
  {
    question: "You tend to make decisions based on:",
    options: [
      { text: "Facts, analysis, and objective criteria.", style: "C" },
      { text: "The impact on people and the whole system.", style: "H" },
      { text: "Inner conviction and a sense of what the moment calls for.", style: "I" },
    ],
  },
  {
    question: "When two ideas seem to contradict each other, your instinct is:",
    options: [
      { text: "Figure out which one is right.", style: "C" },
      { text: "See how both might contribute to a fuller picture.", style: "H" },
      { text: "Sit with the tension — sometimes truth holds paradox.", style: "I" },
    ],
  },
  {
    question: "In a group discussion, you are most likely to:",
    options: [
      { text: "Push for clarity and specific answers.", style: "C" },
      { text: "Make sure all voices are heard and perspectives are included.", style: "H" },
      { text: "Notice what's not being said and name it carefully.", style: "I" },
    ],
  },
  {
    question: "You describe your ideal working environment as:",
    options: [
      { text: "Structured, clear expectations, logical flow.", style: "C" },
      { text: "Collaborative, relational, team-focused.", style: "H" },
      { text: "Reflective, meaningful, with room for depth.", style: "I" },
    ],
  },
  {
    question: "After a long leadership day, you feel most drained by:",
    options: [
      { text: "Endless ambiguity and lack of clarity.", style: "C" },
      { text: "Broken relationships or unresolved group tension.", style: "H" },
      { text: "Shallow conversations that never get to what really matters.", style: "I" },
    ],
  },
];

// ── STYLE DATA ─────────────────────────────────────────────────────────────────

interface StyleData {
  key: StyleKey;
  name: string;
  tagline: string;
  accentColor: string;
  accentLight: string;
  cardBg: string;
  icon: string;
  teamContribution: string;
  watchOut: string;
}

const STYLES: Record<StyleKey, StyleData> = {
  C: {
    key: "C",
    name: "Conceptual",
    tagline: "Clarity · Structure · Logic",
    accentColor: "oklch(52% 0.18 250)",
    accentLight: "oklch(65% 0.14 250)",
    cardBg: "oklch(20% 0.14 250)",
    icon: "◈",
    teamContribution: "Brings clarity and structure when teams are lost in complexity. Defines problems precisely, builds logical frameworks, and ensures decisions rest on solid reasoning.",
    watchOut: "May push for resolution too quickly, dismissing relational nuance or intuitive signals the team needs to hear.",
  },
  H: {
    key: "H",
    name: "Holistic",
    tagline: "Relationships · Context · Wholeness",
    accentColor: "oklch(48% 0.18 145)",
    accentLight: "oklch(62% 0.14 145)",
    cardBg: "oklch(18% 0.10 145)",
    icon: "◎",
    teamContribution: "Holds the whole together. Notices how decisions affect people and systems, builds consensus across differences, and keeps the team connected to the bigger purpose.",
    watchOut: "May resist necessary decisions to preserve harmony, or lose momentum in pursuit of full buy-in.",
  },
  I: {
    key: "I",
    name: "Intuitional",
    tagline: "Depth · Discernment · Presence",
    accentColor: "oklch(55% 0.18 45)",
    accentLight: "oklch(68% 0.14 45)",
    cardBg: "oklch(20% 0.12 45)",
    icon: "◐",
    teamContribution: "Senses what others miss. Picks up on unspoken dynamics, reads the atmosphere in a room, and names what is really going on beneath the surface.",
    watchOut: "May struggle to articulate insights in ways others can act on, or be dismissed when evidence is demanded.",
  },
};

type ResultKey = "C" | "H" | "I" | "CH" | "CI" | "HI" | "CHI";

const RESULT_TEXT: Record<ResultKey, string> = {
  C: "Your team has a strong Conceptual voice — bringing structure and clarity when it matters. Watch for whether Holistic and Intuitional perspectives are being heard. Every team benefits from all three.",
  H: "Your team leads with relationships and the bigger picture. This is a gift — and a reminder to also make space for analytical rigour and intuitive discernment.",
  I: "Your team has a strong Intuitional presence — attuned to depth and what lies beneath. Pair this with structured thinking to translate insight into clear, shared action.",
  CH: "Your team blends structure with relational awareness. You bring both clarity and care — a powerful combination. The growth edge: making intentional room for intuitive voices.",
  CI: "Your team holds logic and intuition together. You can analyse and still trust what you sense — a rare and effective combination for navigating complex decisions.",
  HI: "Your team holds relationship and depth together — sensitive to people and to what lies beneath. Make sure structured thinking has a seat at the table too.",
  CHI: "Your team draws on all three styles. The real strength here is knowing which mode to lead with — and when to switch.",
};

function getResultKey(c: number, h: number, i: number): ResultKey {
  const mx = Math.max(c, h, i);
  const th = mx * 0.75;
  const d = [c >= th ? "C" : "", h >= th ? "H" : "", i >= th ? "I" : ""]
    .filter(Boolean)
    .join("");
  return (d as ResultKey) || "CHI";
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

export default function ThinkingStylesTeamClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<StyleKey, number>>({ C: 0, H: 0, I: 0 });
  const [resultKey, setResultKey] = useState<ResultKey | null>(null);
  const [resultSaved, setResultSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function startQuiz() {
    setCurrentQ(0);
    setScores({ C: 0, H: 0, I: 0 });
    setResultKey(null);
    setResultSaved(false);
    setSaveError(null);
    setQuizState("active");
    setTimeout(() => {
      document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleAnswer(style: StyleKey) {
    const newScores = { ...scores, [style]: scores[style] + 1 };
    if (currentQ < QUESTIONS.length - 1) {
      setScores(newScores);
      setCurrentQ((prev) => prev + 1);
    } else {
      setScores(newScores);
      setResultKey(getResultKey(newScores.C, newScores.H, newScores.I));
      setQuizState("done");
    }
  }

  function retake() {
    setQuizState("idle");
    setCurrentQ(0);
    setScores({ C: 0, H: 0, I: 0 });
    setResultKey(null);
    setResultSaved(false);
    setSaveError(null);
  }

  function handleSaveResult() {
    if (!resultKey) return;
    startTransition(async () => {
      const total = scores.C + scores.H + scores.I;
      const pct: { C: number; H: number; I: number } = {
        C: total > 0 ? Math.round((scores.C / total) * 100) : 0,
        H: total > 0 ? Math.round((scores.H / total) * 100) : 0,
        I: total > 0 ? Math.round((scores.I / total) * 100) : 0,
      };
      const result = await saveThinkingStyleTeamResult(resultKey, pct);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setResultSaved(true);
      }
    });
  }

  const progress =
    quizState === "active"
      ? Math.round((currentQ / QUESTIONS.length) * 100)
      : quizState === "done"
        ? 100
        : 0;

  const dominantKey =
    resultKey && resultKey.length === 1 ? (resultKey as StyleKey) : null;
  const dominantStyle = dominantKey ? STYLES[dominantKey] : null;

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          background: "oklch(22% 0.08 260)",
          paddingTop: "clamp(2.5rem, 5vw, 5rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 5rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 70% 50%, oklch(30% 0.12 260 / 0.4) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "clamp(1.5rem, 6vw, 6rem)",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            fontSize: "clamp(5rem, 16vw, 14rem)",
            color: "oklch(30% 0.10 260 / 0.3)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          3
        </div>
        <div className="container-wide" style={{ position: "relative" }}>
          <Link
            href="/team"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              color: "oklch(62% 0.04 260)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              marginBottom: "1.5rem",
            }}
          >
            ← Team Pathway
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                border: "1.5px solid oklch(65% 0.15 45)",
                padding: "0.3rem 0.7rem",
              }}
            >
              Team Assessment · Thinking Styles
            </span>
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(72% 0.04 260)",
              }}
            >
              10–15 min
            </span>
          </div>

          <h1
            className="t-hero"
            style={{
              color: "oklch(97% 0.005 80)",
              marginBottom: "1.25rem",
              maxWidth: "16ch",
            }}
          >
            Three Thinking
            <br />
            <span style={{ color: "oklch(65% 0.15 45)" }}>Styles</span>
          </h1>

          <p
            className="t-tagline"
            style={{
              color: "oklch(72% 0.04 260)",
              maxWidth: "52ch",
              marginBottom: "2.5rem",
            }}
          >
            Every team has a mix of Conceptual, Holistic, and Intuitional thinkers.
            When you know which styles are present — and which are missing — you can
            make smarter decisions together.
          </p>

          <button onClick={startQuiz} className="btn-primary">
            Discover Your Thinking Style →
          </button>
        </div>
      </section>

      {/* ── SECTION 1: How the Three Styles Show Up ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: "oklch(97% 0.005 80)",
        }}
      >
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                marginBottom: "0.875rem",
              }}
            >
              Section 1
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "oklch(22% 0.08 260)",
                marginBottom: "1.5rem",
              }}
            >
              How the Three Styles Show Up in Your Team
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(30% 0.008 260)",
                marginBottom: "1.25rem",
              }}
            >
              In every team meeting, three kinds of thinking are competing for
              airtime. The <strong>Conceptual thinker</strong> wants a clear agenda
              and logical conclusions. The <strong>Holistic thinker</strong> wants to
              understand how the decision affects everyone involved. The{" "}
              <strong>Intuitional thinker</strong> is reading the room — picking up on
              what's not being said.
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(30% 0.008 260)",
                marginBottom: "1.25rem",
              }}
            >
              None of these is more intelligent than the others. They are different
              modes of knowing — each valid, each incomplete alone.
            </p>
            <div
              style={{
                background: "oklch(22% 0.08 260)",
                padding: "1.5rem 2rem",
                borderLeft: "3px solid oklch(65% 0.15 45)",
                marginTop: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.75,
                  color: "oklch(88% 0.006 80)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                When the Conceptual thinker finally gets the decision framed
                correctly, the Holistic thinker says &ldquo;but what about the people
                affected?&rdquo; and the Intuitional thinker says &ldquo;I don&rsquo;t
                know — something doesn&rsquo;t feel right.&rdquo; This is not
                dysfunction. This is a team thinking well.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 2: What Each Style Contributes ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: "oklch(97% 0.005 80)",
        }}
      >
        <div className="container-wide">
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.875rem",
            }}
          >
            Section 2
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: 1.15,
              color: "oklch(22% 0.08 260)",
              marginBottom: "0.75rem",
            }}
          >
            What Each Style Brings to Problem-Solving
          </h2>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "oklch(48% 0.008 260)",
              maxWidth: "60ch",
              marginBottom: "3rem",
            }}
          >
            Healthy teams don&rsquo;t have one style. They have all three — and the
            wisdom to know which to lean on when.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {(Object.values(STYLES) as StyleData[]).map((style) => (
              <div
                key={style.key}
                style={{
                  background: style.cardBg,
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: style.accentColor,
                  }}
                />
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
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "1.5rem",
                      color: style.accentLight,
                      lineHeight: 1,
                    }}
                  >
                    {style.icon}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "oklch(97% 0.005 80)",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {style.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: style.accentLight,
                        margin: 0,
                        textTransform: "uppercase",
                      }}
                    >
                      {style.tagline}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "oklch(80% 0.04 260)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {style.teamContribution}
                </p>

                <div
                  style={{
                    background: "oklch(14% 0.06 260 / 0.6)",
                    padding: "1rem 1.25rem",
                    borderLeft: `3px solid ${style.accentColor}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "oklch(55% 0.04 260)",
                      marginBottom: "0.375rem",
                    }}
                  >
                    Watch-out
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.8125rem",
                      lineHeight: 1.5,
                      color: "oklch(65% 0.04 260)",
                      margin: 0,
                    }}
                  >
                    {style.watchOut}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: When a Team Is All One Style ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: "oklch(30% 0.12 260)",
        }}
      >
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                marginBottom: "0.875rem",
              }}
            >
              Section 3
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "oklch(97% 0.005 80)",
                marginBottom: "1.5rem",
              }}
            >
              What Happens When a Team Is All One Style
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(80% 0.04 260)",
                marginBottom: "1.5rem",
              }}
            >
              A team dominated by Conceptual thinkers makes precise decisions — but
              can leave people behind. A team dominated by Holistic thinkers builds
              strong relationships — but can avoid hard truths. A team dominated by
              Intuitional thinkers senses things deeply — but can struggle to act.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {[
                {
                  label: "All Conceptual",
                  body: "Efficient, analytical, and structured — but emotionally flat. Decisions may be logically correct and relationally costly.",
                },
                {
                  label: "All Holistic",
                  body: "Warm, connected, and context-aware — but prone to slow decisions and conflict avoidance. Hard truths can get buried under consensus.",
                },
                {
                  label: "All Intuitional",
                  body: "Deeply perceptive and atmospherically attuned — but may struggle to translate insight into clear, shared action that others can follow.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "oklch(22% 0.10 260)",
                    padding: "1.25rem 1.5rem",
                    borderLeft: "3px solid oklch(65% 0.15 45)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "oklch(97% 0.005 80)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "oklch(72% 0.04 260)",
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Honouring Thinking Styles in Cross-Cultural Teams ── */}
      <section
        style={{
          paddingBlock: "clamp(3.5rem, 6vw, 6rem)",
          background: "oklch(22% 0.08 260)",
        }}
      >
        <div className="container-wide">
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.875rem",
            }}
          >
            Section 4
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: 1.15,
              color: "oklch(97% 0.005 80)",
              marginBottom: "2.5rem",
            }}
          >
            Honouring Different Thinking Styles in Cross-Cultural Teams
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1px",
              background: "oklch(30% 0.10 260 / 0.5)",
            }}
          >
            {[
              {
                num: "01",
                tip: "Name the style, not the person",
                body: "When a team member seems off-track, ask: are they using a different thinking mode? Conceptual impatience with Holistic reasoning isn't a personality flaw — it's a style gap.",
              },
              {
                num: "02",
                tip: "Build multi-modal agendas",
                body: "Structure your meetings to honour all three: time for analysis (C), time for relational check-in (H), and space for unspoken concerns to surface (I).",
              },
              {
                num: "03",
                tip: "Cross-cultural note: Holistic thinking is often dominant",
                body: "In many Asian, African, and Latin American cultures, Holistic thinking is the default. Western-trained leaders who lead with Conceptual thinking can feel cold and transactional to their teams.",
              },
              {
                num: "04",
                tip: "The Intuitional voice is easily silenced",
                body: "In data-driven or task-focused cultures, Intuitional insights get dismissed as 'feelings'. Create deliberate space for the question: what are we not naming yet?",
              },
              {
                num: "05",
                tip: "Invite the missing style in",
                body: "If your team tends toward one mode, you don't need to change who you are — just ask different questions. \"What does our data say?\" \"How does this affect everyone?\" \"What feels off?\"",
              },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  background: "oklch(26% 0.10 260)",
                  padding: "2rem 1.75rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "oklch(35% 0.10 260)",
                    lineHeight: 1,
                    marginBottom: "0.875rem",
                  }}
                >
                  {item.num}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "oklch(97% 0.005 80)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.tip}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "oklch(72% 0.04 260)",
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIBLICAL ANCHOR ── */}
      <section
        style={{
          paddingBlock: "clamp(3rem, 5vw, 5rem)",
          background: "oklch(97% 0.005 80)",
        }}
      >
        <div className="container-wide">
          <div
            style={{
              maxWidth: "56ch",
              borderLeft: "3px solid oklch(65% 0.15 45)",
              paddingLeft: "2rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                lineHeight: 1.55,
                color: "oklch(22% 0.08 260)",
                marginBottom: "1rem",
              }}
            >
              &ldquo;If the whole body were an eye, where would be the sense of
              hearing? If the whole body were an ear, where would be the sense of
              smell?&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
              }}
            >
              1 Corinthians 12:17
            </p>
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section
        id="quiz-section"
        style={{
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
          background: "oklch(97% 0.005 80)",
        }}
      >
        <div className="container-wide">
          {/* Quiz header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                marginBottom: "0.875rem",
              }}
            >
              Assessment
            </p>
            <h2
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "oklch(22% 0.08 260)",
                marginBottom: "0.875rem",
              }}
            >
              Thinking Style Assessment
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "oklch(48% 0.008 260)",
                maxWidth: "56ch",
              }}
            >
              20 questions. Choose the answer that most reflects how you actually
              think and lead — not how you think you should.
            </p>
          </div>

          {/* IDLE STATE */}
          {quizState === "idle" && (
            <div
              style={{
                background: "oklch(22% 0.08 260)",
                padding: "3rem 2.5rem",
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "oklch(80% 0.04 260)",
                  marginBottom: "2rem",
                }}
              >
                There are no right or wrong answers. The goal is insight — both for
                yourself and for your team. Your result belongs to the team. Look at
                what the team has collectively, and what it might be missing.
              </p>
              <button onClick={startQuiz} className="btn-primary">
                Start Assessment →
              </button>
            </div>
          )}

          {/* ACTIVE STATE */}
          {quizState === "active" && (
            <div style={{ maxWidth: "640px" }}>
              {/* Progress bar */}
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.625rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "oklch(65% 0.15 45)",
                      margin: 0,
                    }}
                  >
                    Question {currentQ + 1} of {QUESTIONS.length}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.72rem",
                      color: "oklch(55% 0.008 260)",
                      margin: 0,
                    }}
                  >
                    {progress}%
                  </p>
                </div>
                <div
                  style={{
                    height: "4px",
                    background: "oklch(90% 0.006 80)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${progress}%`,
                      background: "oklch(65% 0.15 45)",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <div
                style={{
                  background: "oklch(22% 0.08 260)",
                  padding: "2rem 2rem 0.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "clamp(1rem, 2vw, 1.125rem)",
                    lineHeight: 1.5,
                    color: "oklch(97% 0.005 80)",
                    margin: 0,
                  }}
                >
                  {QUESTIONS[currentQ].question}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.style)}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      lineHeight: 1.5,
                      textAlign: "left",
                      padding: "1.25rem 2rem",
                      background: "oklch(28% 0.10 260)",
                      color: "oklch(88% 0.006 80)",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.15s ease, color 0.15s ease",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "oklch(35% 0.12 260)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "oklch(97% 0.005 80)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "oklch(28% 0.10 260)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "oklch(88% 0.006 80)";
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "oklch(55% 0.08 260)",
                        flexShrink: 0,
                        marginTop: "0.2rem",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DONE STATE */}
          {quizState === "done" && resultKey && (
            <div style={{ maxWidth: "680px" }}>
              <div
                style={{
                  background: dominantStyle ? dominantStyle.cardBg : "oklch(22% 0.08 260)",
                  padding: "2.5rem",
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: dominantStyle
                      ? dominantStyle.accentColor
                      : "oklch(65% 0.15 45)",
                  }}
                />

                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: dominantStyle
                      ? dominantStyle.accentLight
                      : "oklch(65% 0.15 45)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Your Thinking Style
                </p>

                <h3
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
                    color: "oklch(97% 0.005 80)",
                    marginBottom: "1.25rem",
                    lineHeight: 1.2,
                  }}
                >
                  {dominantStyle
                    ? dominantStyle.name
                    : resultKey
                        .split("")
                        .map((k) => STYLES[k as StyleKey].name)
                        .join(" + ")}
                </h3>

                {/* Score breakdown */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "oklch(55% 0.04 260)",
                      marginBottom: "0.875rem",
                    }}
                  >
                    Your blend
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {(Object.values(STYLES) as StyleData[]).map((s) => {
                      const total = scores.C + scores.H + scores.I;
                      const pct =
                        total > 0
                          ? Math.round((scores[s.key] / total) * 100)
                          : 0;
                      return (
                        <div
                          key={s.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              color: s.accentLight,
                              width: "7rem",
                              flexShrink: 0,
                            }}
                          >
                            {s.name}
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "6px",
                              background: "oklch(15% 0.06 260)",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: `${pct}%`,
                                background: s.accentColor,
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: "oklch(60% 0.04 260)",
                              width: "2.5rem",
                              textAlign: "right",
                              flexShrink: 0,
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team framing */}
                <div
                  style={{
                    background: "oklch(14% 0.06 260 / 0.6)",
                    padding: "1.25rem 1.5rem",
                    borderLeft: `3px solid ${
                      dominantStyle
                        ? dominantStyle.accentColor
                        : "oklch(65% 0.15 45)"
                    }`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: dominantStyle
                        ? dominantStyle.accentLight
                        : "oklch(65% 0.15 45)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    For Your Team
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "oklch(75% 0.04 260)",
                      margin: 0,
                    }}
                  >
                    {RESULT_TEXT[resultKey]}
                  </p>
                </div>

                {/* Closing framing */}
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "oklch(65% 0.04 260)",
                    marginTop: "1.25rem",
                    fontStyle: "italic",
                  }}
                >
                  Your style belongs to your team. Look at what the team has
                  collectively — and what it might be missing.
                </p>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={retake}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "0.7rem 1.5rem",
                    background: "transparent",
                    color: "oklch(48% 0.008 260)",
                    border: "1.5px solid oklch(82% 0.008 260)",
                    cursor: "pointer",
                  }}
                >
                  Retake
                </button>

                {user && !resultSaved && (
                  <button
                    onClick={handleSaveResult}
                    disabled={isPending}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.06em",
                      padding: "0.7rem 1.5rem",
                      background: isPending
                        ? "oklch(40% 0.10 260)"
                        : "oklch(22% 0.08 260)",
                      color: "oklch(97% 0.005 80)",
                      border: "none",
                      cursor: isPending ? "wait" : "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    {isPending ? "Saving…" : "Save to Team Dashboard →"}
                  </button>
                )}

                {user && resultSaved && (
                  <Link
                    href="/dashboard"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.06em",
                      textDecoration: "none",
                      color: "oklch(72% 0.14 145)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    ✓ Saved to Dashboard
                  </Link>
                )}

                {!user && (
                  <Link
                    href="/signup"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.06em",
                      textDecoration: "none",
                      padding: "0.7rem 1.5rem",
                      background: "oklch(22% 0.08 260)",
                      color: "oklch(97% 0.005 80)",
                      border: "none",
                    }}
                  >
                    Sign in to Save →
                  </Link>
                )}

                {saveError && (
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.8rem",
                      color: "oklch(65% 0.20 30)",
                      margin: 0,
                    }}
                  >
                    {saveError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
          background: "oklch(30% 0.12 260)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "clamp(1.5rem, 5vw, 4rem)",
            top: "clamp(4rem, 7vw, 7rem)",
            bottom: "clamp(4rem, 7vw, 7rem)",
            width: "3px",
            background: "oklch(65% 0.15 45)",
          }}
        />
        <div className="container-wide" style={{ paddingLeft: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.875rem",
            }}
          >
            Continue
          </p>
          <h2
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: 1.15,
              color: "oklch(97% 0.005 80)",
              marginBottom: "1rem",
            }}
          >
            Every style has something your team needs.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "oklch(72% 0.04 260)",
              maxWidth: "52ch",
              marginBottom: "2rem",
            }}
          >
            The goal isn&rsquo;t to identify your style and stay there. It&rsquo;s to
            understand how you think — and how your team thinks differently — so you
            can lead together more wisely.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/team"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.06em",
                textDecoration: "none",
                padding: "0.75rem 1.75rem",
                background: "oklch(65% 0.15 45)",
                color: "oklch(14% 0.08 260)",
              }}
            >
              Back to Team Pathway →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
