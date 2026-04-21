"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveCommStyleResult } from "../actions";

// ── STYLE DATA ────────────────────────────────────────────────────────────────

type StyleKey = "A" | "D" | "C" | "N";

interface CommStyle {
  key: StyleKey;
  name: string;
  subtitle: string;
  accentColor: string;
  accentLight: string;
  cardBg: string;
  icon: string;
  strengths: string[];
  watchOuts: string[];
  description: string;
  teamTip: string;
}

const STYLES: Record<StyleKey, CommStyle> = {
  A: {
    key: "A",
    name: "The Architect",
    subtitle: "Direct + Task-Focused",
    accentColor: "oklch(55% 0.18 250)",
    accentLight: "oklch(78% 0.12 250)",
    cardBg: "oklch(20% 0.14 250)",
    icon: "◈",
    strengths: ["Gets to the point quickly", "Brings clarity to confusion", "Efficient in meetings", "Decisive under pressure"],
    watchOuts: ["Can come across as blunt or uncaring", "May undervalue relationship-building", "Feels frustrated by indirect communication"],
    description: "You communicate with clarity and directness. You value efficiency and dislike ambiguity. Your greatest strength is cutting through noise and naming what needs to happen. Your growth edge: slow down enough to make room for others who process differently.",
    teamTip: "When working with an Architect: be direct and prepared. Get to the point. If you disagree, say so clearly with reasons — they respect honesty far more than diplomacy.",
  },
  D: {
    key: "D",
    name: "The Diplomat",
    subtitle: "Indirect + Relationship-Focused",
    accentColor: "oklch(52% 0.16 145)",
    accentLight: "oklch(72% 0.12 145)",
    cardBg: "oklch(18% 0.10 145)",
    icon: "◇",
    strengths: ["Navigates tension gracefully", "Preserves relationships under pressure", "Reads the room naturally", "Builds consensus and trust"],
    watchOuts: ["Can come across as evasive or non-committal", "May avoid necessary hard conversations", "Feels pressured by demands for bluntness"],
    description: "You communicate with care and nuance. Relationships and harmony matter to you. You read unspoken dynamics and navigate conflict with grace. Your growth edge: learn to name hard truths directly — the kindest thing is sometimes the clearest thing.",
    teamTip: "When working with a Diplomat: take time to build the relationship before the task. Ask for their honest opinion explicitly — and create safety for them to share it. Don't mistake their care for weakness.",
  },
  C: {
    key: "C",
    name: "The Connector",
    subtitle: "Expressive + Relationship-Focused",
    accentColor: "oklch(62% 0.16 45)",
    accentLight: "oklch(78% 0.12 45)",
    cardBg: "oklch(20% 0.10 45)",
    icon: "◎",
    strengths: ["Brings warmth and energy to teams", "Builds morale and belonging", "Communicates with story and heart", "Notices when people are struggling"],
    watchOuts: ["Can come across as off-topic or emotional", "May over-invest in atmosphere at the cost of outcomes", "Feels unseen in purely task-focused meetings"],
    description: "You communicate with warmth, stories, and emotional attunement. People feel seen in your presence. Your greatest strength is building connection and morale. Your growth edge: learn to anchor your expressiveness in clear outcomes so your voice carries in structured contexts.",
    teamTip: "When working with a Connector: invest in the relationship genuinely — don't just get to business. Acknowledge their contribution emotionally, not just practically. Give them space to connect the task to the bigger story.",
  },
  N: {
    key: "N",
    name: "The Analyst",
    subtitle: "Precise + Task-Focused",
    accentColor: "oklch(55% 0.14 300)",
    accentLight: "oklch(74% 0.10 300)",
    cardBg: "oklch(20% 0.12 300)",
    icon: "◐",
    strengths: ["Thorough and reliable", "Catches what others miss", "Structures thinking clearly", "Builds confidence through detail"],
    watchOuts: ["Can come across as slow or pedantic", "May struggle with ambiguity or quick decisions", "Feels anxious in underprepared discussions"],
    description: "You communicate with precision and depth. Detail and accuracy matter to you. Your greatest strength is rigour — you build trust through thoroughness. Your growth edge: learn to act on incomplete information when the moment requires it, and communicate conclusions without every step of the process.",
    teamTip: "When working with an Analyst: give them time to prepare. Share information in advance. Don't mistake their thoroughness for hesitation — they're building the foundation others will stand on.",
  },
};

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────

interface Question {
  question: string;
  options: { text: string; style: StyleKey }[];
}

const QUESTIONS: Question[] = [
  {
    question: "In a team meeting, a colleague raises a concern. You most likely:",
    options: [
      { text: "Address it immediately with a clear position", style: "A" },
      { text: "Listen carefully and suggest a process to explore it", style: "D" },
      { text: "Share how it's affecting team morale", style: "C" },
      { text: "Ask for the data and evidence behind the concern", style: "N" },
    ],
  },
  {
    question: "When you have feedback for a team member, you:",
    options: [
      { text: "Say it directly, even if uncomfortable", style: "A" },
      { text: "Find a private moment and frame it carefully", style: "D" },
      { text: "Check in emotionally first, then share", style: "C" },
      { text: "Document your observations and present them clearly", style: "N" },
    ],
  },
  {
    question: "Your team is behind on a deadline. Your instinct is to:",
    options: [
      { text: "Identify the problem and assign clear responsibilities", style: "A" },
      { text: "Have a calm team conversation to restore alignment", style: "D" },
      { text: "Rally the team — remind them of the shared goal", style: "C" },
      { text: "Analyse what caused the delay before deciding next steps", style: "N" },
    ],
  },
  {
    question: "In a conflict, you tend to:",
    options: [
      { text: "Name the issue and work toward resolution", style: "A" },
      { text: "Find a compromise that preserves relationships", style: "D" },
      { text: "Focus on how the conflict is affecting the team atmosphere", style: "C" },
      { text: "Gather all perspectives before drawing any conclusions", style: "N" },
    ],
  },
  {
    question: "You receive an email with no clear action item. You:",
    options: [
      { text: "Reply asking: what do you need from me?", style: "A" },
      { text: "Read between the lines to understand the real concern", style: "D" },
      { text: "Pick up the phone — this needs a real conversation", style: "C" },
      { text: "Re-read carefully looking for what you might have missed", style: "N" },
    ],
  },
  {
    question: "When making a team decision, you prefer:",
    options: [
      { text: "A clear vote or final call from the leader", style: "A" },
      { text: "Building consensus slowly until everyone is on board", style: "D" },
      { text: "Whatever keeps the team united and energised", style: "C" },
      { text: "Waiting for more data before committing", style: "N" },
    ],
  },
  {
    question: "Your ideal team meeting is:",
    options: [
      { text: "Tight agenda, clear decisions, no overruns", style: "A" },
      { text: "Open discussion with space for everyone to be heard", style: "D" },
      { text: "A mix of work and connection — you enjoy the whole team together", style: "C" },
      { text: "Well-prepared, with pre-reading and structured discussion", style: "N" },
    ],
  },
  {
    question: "When you disagree, you usually:",
    options: [
      { text: "Say so clearly and explain why", style: "A" },
      { text: "Express reservations indirectly and suggest alternatives", style: "D" },
      { text: "Share how you're feeling about the direction", style: "C" },
      { text: "Present a counterargument with evidence", style: "N" },
    ],
  },
  {
    question: "You feel most productive when:",
    options: [
      { text: "The path forward is clear and unambiguous", style: "A" },
      { text: "The team is aligned and relationships are healthy", style: "D" },
      { text: "There's energy and connection in the room", style: "C" },
      { text: "You have time to think and prepare carefully", style: "N" },
    ],
  },
  {
    question: "A new team member joins. You:",
    options: [
      { text: "Give them a clear briefing on roles and expectations", style: "A" },
      { text: "Take time to understand their background and how they work", style: "D" },
      { text: "Welcome them warmly and help them feel part of the group quickly", style: "C" },
      { text: "Share the team documentation and processes so they can orient themselves", style: "N" },
    ],
  },
  {
    question: "When a plan changes at the last minute, you:",
    options: [
      { text: "Adapt quickly — what needs to happen now?", style: "A" },
      { text: "Communicate carefully to manage how team members receive the news", style: "D" },
      { text: "Reassure the team — change isn't the end of the world", style: "C" },
      { text: "Feel uncomfortable — you need time to re-plan", style: "N" },
    ],
  },
  {
    question: "What bothers you most in team communication?",
    options: [
      { text: "People who beat around the bush", style: "A" },
      { text: "People who are blunt without reading the room", style: "D" },
      { text: "Meetings that feel cold and purely transactional", style: "C" },
      { text: "People who jump to conclusions without enough information", style: "N" },
    ],
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function getDominantStyle(scores: Record<StyleKey, number>): StyleKey {
  let max: StyleKey = "A";
  (Object.keys(scores) as StyleKey[]).forEach(k => {
    if (scores[k] > scores[max]) max = k;
  });
  return max;
}

export default function CommunicationCultureClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<StyleKey, number>>({ A: 0, D: 0, C: 0, N: 0 });
  const [resultStyle, setResultStyle] = useState<StyleKey | null>(null);
  const [resultSaved, setResultSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function startQuiz() {
    setCurrentQ(0);
    setScores({ A: 0, D: 0, C: 0, N: 0 });
    setResultStyle(null);
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
      setCurrentQ(prev => prev + 1);
    } else {
      setScores(newScores);
      setResultStyle(getDominantStyle(newScores));
      setQuizState("done");
    }
  }

  function retake() {
    setQuizState("idle");
    setCurrentQ(0);
    setScores({ A: 0, D: 0, C: 0, N: 0 });
    setResultStyle(null);
    setResultSaved(false);
    setSaveError(null);
  }

  function handleSaveResult() {
    if (!resultStyle) return;
    startTransition(async () => {
      const total = scores.A + scores.D + scores.C + scores.N;
      const pct: Record<string, number> = {
        A: total > 0 ? Math.round((scores.A / total) * 100) : 0,
        D: total > 0 ? Math.round((scores.D / total) * 100) : 0,
        C: total > 0 ? Math.round((scores.C / total) * 100) : 0,
        N: total > 0 ? Math.round((scores.N / total) * 100) : 0,
      };
      const result = await saveCommStyleResult(resultStyle, pct);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setResultSaved(true);
      }
    });
  }

  const progress = quizState === "active"
    ? Math.round(((currentQ) / QUESTIONS.length) * 100)
    : quizState === "done" ? 100 : 0;

  const dominantStyle = resultStyle ? STYLES[resultStyle] : null;

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.08 260)",
        paddingTop: "clamp(2.5rem, 5vw, 5rem)",
        paddingBottom: "clamp(2.5rem, 5vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 50%, oklch(30% 0.12 260 / 0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link href="/team" style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem",
          }}>
            ← Team Pathway
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.18em",
              textTransform: "uppercase", color: "oklch(65% 0.15 45)",
              border: "1.5px solid oklch(65% 0.15 45)", padding: "0.3rem 0.7rem",
            }}>
              Module 04
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.14em",
              textTransform: "uppercase", color: "oklch(72% 0.04 260)",
            }}>
              15–20 min
            </span>
          </div>

          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "16ch" }}>
            Communication<br />
            <span style={{ color: "oklch(65% 0.15 45)" }}>Culture</span>
          </h1>

          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
            Your team communicates every day — and misunderstands each other almost as often. Not because people are unclear, but because communication is more cultural than we think.
          </p>

          <button onClick={startQuiz} className="btn-primary">
            Discover Your Communication Style →
          </button>
        </div>
      </section>

      {/* ── SECTION 1: Communication Is Cultural ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Section 1
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              Communication Is Cultural
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.25rem",
            }}>
              Edward Hall&rsquo;s research gave us a useful framework: <strong>high-context vs. low-context communication</strong>. In low-context cultures (Germany, Netherlands, USA), meaning is in the words. In high-context cultures (Japan, Indonesia, much of Africa and the Middle East), meaning is in the context, relationship, and what&rsquo;s left unsaid.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.25rem",
            }}>
              Neither is better. Both are real.
            </p>
            <div style={{
              background: "oklch(22% 0.08 260)", padding: "1.5rem 2rem",
              borderLeft: "3px solid oklch(65% 0.15 45)", marginTop: "1.5rem",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                color: "oklch(88% 0.006 80)", margin: 0, fontStyle: "italic",
              }}>
                When a Dutch leader says &ldquo;that won&rsquo;t work&rdquo; and an Indonesian colleague says &ldquo;perhaps we could consider this further,&rdquo; they may be saying the same thing — but hearing completely different things.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 2: The Four Communication Styles ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
          }}>
            Section 2
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
            color: "oklch(22% 0.08 260)", marginBottom: "0.75rem",
          }}>
            The Four Communication Styles
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
            color: "oklch(48% 0.008 260)", maxWidth: "60ch", marginBottom: "3rem",
          }}>
            How people tend to communicate in team contexts — shaped by culture, personality, and context.
          </p>

          {/* Style Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}>
            {(Object.values(STYLES) as CommStyle[]).map(style => (
              <div key={style.key} style={{
                background: style.cardBg,
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  background: style.accentColor,
                }} />
                {/* Icon + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "1.5rem",
                    color: style.accentLight, lineHeight: 1,
                  }}>
                    {style.icon}
                  </span>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 800,
                      fontSize: "1rem", color: "oklch(97% 0.005 80)", margin: 0, lineHeight: 1.2,
                    }}>
                      {style.name}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
                      fontWeight: 600, letterSpacing: "0.1em",
                      color: style.accentLight, margin: 0, textTransform: "uppercase",
                    }}>
                      {style.subtitle}
                    </p>
                  </div>
                </div>

                {/* Strengths */}
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: style.accentLight, marginBottom: "0.5rem",
                  }}>
                    Strengths
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {style.strengths.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                        <span style={{ color: style.accentColor, fontSize: "0.7rem", marginTop: "0.2rem", flexShrink: 0 }}>+</span>
                        <p style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.5,
                          color: "oklch(80% 0.04 260)", margin: 0,
                        }}>
                          {s}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Watch-outs */}
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "oklch(65% 0.04 260)", marginBottom: "0.5rem",
                  }}>
                    Watch-outs
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {style.watchOuts.map((w, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                        <span style={{ color: "oklch(55% 0.04 260)", fontSize: "0.7rem", marginTop: "0.2rem", flexShrink: 0 }}>–</span>
                        <p style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.5,
                          color: "oklch(62% 0.04 260)", margin: 0,
                        }}>
                          {w}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Building a Communication Culture ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(30% 0.12 260)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Section 3
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(97% 0.005 80)", marginBottom: "1.5rem",
            }}>
              Building a Communication Culture
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.25rem",
            }}>
              A team&rsquo;s communication culture is the sum of its members&rsquo; default styles — shaped by culture, personality, and context. Healthy teams don&rsquo;t have one style; they have norms that honour all styles.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.5rem",
            }}>
              This means:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Make the implicit explicit", body: "Name your team's communication norms out loud — \"We always say hard things directly here\" or \"We always signal concerns gently before naming them.\" Unspoken norms create exclusion." },
                { label: "Create feedback rhythms every style can use", body: "Not everyone gives feedback the same way. Build in multiple channels — written, 1-on-1, in group — so no style is disadvantaged." },
                { label: "Slow down when miscommunication happens", body: "The instinct is to speed up and clarify harder. The better instinct is to slow down and ask: what did you hear? What were you trying to say?" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "oklch(22% 0.10 260)", padding: "1.25rem 1.5rem",
                  borderLeft: "3px solid oklch(65% 0.15 45)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
                    color: "oklch(97% 0.005 80)", marginBottom: "0.5rem",
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(72% 0.04 260)", margin: 0,
                  }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Cross-Cultural Communication Tips ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(22% 0.08 260)" }}>
        <div className="container-wide">
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
          }}>
            Section 4
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
            color: "oklch(97% 0.005 80)", marginBottom: "2.5rem",
          }}>
            Cross-Cultural Communication Tips
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1px",
            background: "oklch(30% 0.10 260 / 0.5)",
          }}>
            {[
              {
                num: "01",
                tip: "Assume good intent",
                body: "Ask clarifying questions before interpreting meaning. Most misunderstanding is not bad intent — it's different wiring.",
              },
              {
                num: "02",
                tip: "Watch for silence",
                body: "In some cultures silence means disagreement. In others it means deep respect. Know the difference before you fill it.",
              },
              {
                num: "03",
                tip: "Notice what's NOT said",
                body: "High-context communicators often signal through absence. The absence of enthusiasm may be the loudest message in the room.",
              },
              {
                num: "04",
                tip: "Don't confuse style with competence",
                body: "An indirect communicator is not less clear — they're differently clear. Precision and directness are not the same thing.",
              },
              {
                num: "05",
                tip: "Build translation moments",
                body: "End important exchanges with: \"What I'm hearing is... did I get that right?\" It's not a sign of confusion — it's a sign of care.",
              },
            ].map((item) => (
              <div key={item.num} style={{
                background: "oklch(26% 0.10 260)",
                padding: "2rem 1.75rem",
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem",
                  color: "oklch(35% 0.10 260)", lineHeight: 1, marginBottom: "0.875rem",
                }}>
                  {item.num}
                </p>
                <h3 style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem",
                  color: "oklch(97% 0.005 80)", marginBottom: "0.5rem",
                }}>
                  {item.tip}
                </h3>
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                  color: "oklch(72% 0.04 260)", margin: 0,
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section id="quiz-section" style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(97% 0.005 80)",
      }}>
        <div className="container-wide">
          {/* Quiz header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Assessment
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(22% 0.08 260)", marginBottom: "0.875rem",
            }}>
              Communication Style Assessment
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
              color: "oklch(48% 0.008 260)", maxWidth: "56ch",
            }}>
              12 questions. Choose the answer that most reflects how you actually behave — not how you think you should.
            </p>
          </div>

          {/* IDLE STATE */}
          {quizState === "idle" && (
            <div style={{
              background: "oklch(22% 0.08 260)", padding: "3rem 2.5rem",
              maxWidth: "600px",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.75,
                color: "oklch(80% 0.04 260)", marginBottom: "2rem",
              }}>
                There are no right or wrong answers. The goal is self-awareness — and the insight to communicate more effectively with people who are wired differently.
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
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "0.625rem",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "oklch(65% 0.15 45)", margin: 0,
                  }}>
                    Question {currentQ + 1} of {QUESTIONS.length}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem",
                    color: "oklch(55% 0.008 260)", margin: 0,
                  }}>
                    {progress}%
                  </p>
                </div>
                <div style={{
                  height: "4px", background: "oklch(90% 0.006 80)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${progress}%`,
                    background: "oklch(65% 0.15 45)",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>

              {/* Question */}
              <div style={{
                background: "oklch(22% 0.08 260)", padding: "2rem 2rem 0.5rem",
                marginBottom: "0",
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700,
                  fontSize: "clamp(1rem, 2vw, 1.125rem)", lineHeight: 1.5,
                  color: "oklch(97% 0.005 80)", margin: 0,
                }}>
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
                      fontFamily: "var(--font-montserrat)", fontWeight: 600,
                      fontSize: "0.9375rem", lineHeight: 1.5, textAlign: "left",
                      padding: "1.25rem 2rem",
                      background: "oklch(28% 0.10 260)",
                      color: "oklch(88% 0.006 80)",
                      border: "none", cursor: "pointer",
                      transition: "background 0.15s ease, color 0.15s ease",
                      display: "flex", gap: "1rem", alignItems: "flex-start",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "oklch(35% 0.12 260)";
                      (e.currentTarget as HTMLButtonElement).style.color = "oklch(97% 0.005 80)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "oklch(28% 0.10 260)";
                      (e.currentTarget as HTMLButtonElement).style.color = "oklch(88% 0.006 80)";
                    }}
                  >
                    <span style={{
                      fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em",
                      color: "oklch(55% 0.08 260)", flexShrink: 0, marginTop: "0.2rem",
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DONE STATE */}
          {quizState === "done" && dominantStyle && (
            <div style={{ maxWidth: "680px" }}>
              <div style={{
                background: dominantStyle.cardBg,
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
                marginBottom: "1.5rem",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                  background: dominantStyle.accentColor,
                }} />

                <p style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: dominantStyle.accentLight, marginBottom: "0.75rem",
                }}>
                  Your Communication Style
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "2.5rem", color: dominantStyle.accentLight, lineHeight: 1 }}>
                    {dominantStyle.icon}
                  </span>
                  <div>
                    <h3 style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 800,
                      fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
                      color: "oklch(97% 0.005 80)", margin: 0, lineHeight: 1.2,
                    }}>
                      {dominantStyle.name}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.75rem",
                      fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                      color: dominantStyle.accentLight, margin: 0,
                    }}>
                      {dominantStyle.subtitle}
                    </p>
                  </div>
                </div>

                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                  color: "oklch(82% 0.04 260)", marginBottom: "1.5rem",
                }}>
                  {dominantStyle.description}
                </p>

                {/* Score breakdown */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "oklch(55% 0.04 260)", marginBottom: "0.875rem",
                  }}>
                    Your blend
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {(Object.values(STYLES) as CommStyle[]).map(s => {
                      const total = scores.A + scores.D + scores.C + scores.N;
                      const pct = total > 0 ? Math.round((scores[s.key] / total) * 100) : 0;
                      return (
                        <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{
                            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem",
                            color: s.accentLight, width: "6rem", flexShrink: 0,
                          }}>
                            {s.name.replace("The ", "")}
                          </span>
                          <div style={{
                            flex: 1, height: "6px", background: "oklch(15% 0.06 260)",
                            position: "relative", overflow: "hidden",
                          }}>
                            <div style={{
                              position: "absolute", left: 0, top: 0, bottom: 0,
                              width: `${pct}%`,
                              background: s.accentColor,
                              transition: "width 0.4s ease",
                            }} />
                          </div>
                          <span style={{
                            fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
                            fontWeight: 700, color: "oklch(60% 0.04 260)", width: "2.5rem",
                            textAlign: "right", flexShrink: 0,
                          }}>
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team tip */}
                <div style={{
                  background: "oklch(14% 0.06 260 / 0.6)", padding: "1.25rem 1.5rem",
                  borderLeft: `3px solid ${dominantStyle.accentColor}`,
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: dominantStyle.accentLight, marginBottom: "0.5rem",
                  }}>
                    Team Tip
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(75% 0.04 260)", margin: 0,
                  }}>
                    {dominantStyle.teamTip}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  onClick={retake}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "0.7rem 1.5rem",
                    background: "transparent", color: "oklch(48% 0.008 260)",
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
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                      letterSpacing: "0.06em",
                      padding: "0.7rem 1.5rem",
                      background: isPending ? "oklch(40% 0.10 260)" : "oklch(22% 0.08 260)",
                      color: "oklch(97% 0.005 80)",
                      border: "none", cursor: isPending ? "wait" : "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    {isPending ? "Saving…" : "Save to Dashboard →"}
                  </button>
                )}

                {user && resultSaved && (
                  <Link href="/dashboard?tab=team" style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                    letterSpacing: "0.06em", textDecoration: "none",
                    color: "oklch(72% 0.14 145)",
                    display: "inline-flex", alignItems: "center", gap: "0.375rem",
                  }}>
                    ✓ Saved to Dashboard
                  </Link>
                )}

                {saveError && (
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.8rem",
                    color: "oklch(65% 0.20 30)", margin: 0,
                  }}>
                    {saveError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(30% 0.12 260)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)",
          top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)",
          width: "3px", background: "oklch(65% 0.15 45)",
        }} />
        <div className="container-wide" style={{ paddingLeft: "2.5rem" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
          }}>
            Continue
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
            color: "oklch(97% 0.005 80)", marginBottom: "1rem",
          }}>
            You&rsquo;re building something real.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
            color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem",
          }}>
            Understanding how you communicate is step one. The next step is applying it — with your team, in your next meeting, in your next hard conversation.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/team" style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
              letterSpacing: "0.06em", textDecoration: "none",
              padding: "0.75rem 1.75rem",
              background: "oklch(65% 0.15 45)", color: "oklch(14% 0.08 260)",
            }}>
              Back to Team Pathway →
            </Link>
            {!user && (
              <Link href="/signup" style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
                letterSpacing: "0.06em", textDecoration: "none",
                padding: "0.75rem 1.75rem",
                background: "transparent", color: "oklch(78% 0.04 260)",
                border: "1.5px solid oklch(42% 0.008 260)",
              }}>
                Save Your Results →
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
