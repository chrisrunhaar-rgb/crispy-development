"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveDISCTeamResult } from "./actions";

// ── QUIZ DATA (same questions as personal DISC) ───────────────────────────────

const SHUFFLE_ORDERS: number[][] = [
  [2,0,3,1],[0,2,1,3],[3,1,0,2],[1,3,2,0],[2,1,0,3],
  [0,3,1,2],[3,0,2,1],[1,2,3,0],[2,3,1,0],[0,1,3,2],
  [3,2,0,1],[1,0,2,3],[2,0,1,3],[0,3,2,1],[3,1,2,0],
  [1,2,0,3],[0,1,2,3],[2,3,0,1],[3,0,1,2],[1,3,0,2],
  [0,2,3,1],[2,1,3,0],[3,2,1,0],[1,0,3,2],
];

type ScoreKey = "D" | "I" | "S" | "C";

interface QOption { en: string; t: ScoreKey; }
interface Q { en: string; options: QOption[]; }

const QS: Q[] = [
  { en: "When starting a new project, your first priority is:", options: [
    { en: "Define the goal and get moving immediately.", t: "D" },
    { en: "Build energy and excitement with the team.", t: "I" },
    { en: "Ensure everyone understands their role and feels included.", t: "S" },
    { en: "Gather all relevant information and create a thorough plan.", t: "C" },
  ]},
  { en: "In a team meeting that's running off track, you tend to:", options: [
    { en: "Redirect the conversation directly and push for a decision.", t: "D" },
    { en: "Re-energise the group and lighten the atmosphere.", t: "I" },
    { en: "Support whoever tries to get things back on track.", t: "S" },
    { en: "Identify the root cause and propose a structured agenda.", t: "C" },
  ]},
  { en: "When giving feedback to a colleague, you tend to:", options: [
    { en: "Be direct and get straight to the point.", t: "D" },
    { en: "Frame it positively and focus on encouragement.", t: "I" },
    { en: "Find a private moment and deliver it gently.", t: "S" },
    { en: "Prepare thoroughly and give specific, evidence-based input.", t: "C" },
  ]},
  { en: "Under pressure, others would most likely describe you as:", options: [
    { en: "Decisive and assertive.", t: "D" },
    { en: "Energetic and optimistic.", t: "I" },
    { en: "Calm and steady.", t: "S" },
    { en: "Careful and detail-focused.", t: "C" },
  ]},
  { en: "You are most motivated by:", options: [
    { en: "Winning, achieving results, and overcoming challenges.", t: "D" },
    { en: "Connecting with others, recognition, and creative freedom.", t: "I" },
    { en: "Harmony, security, and genuinely helping those around you.", t: "S" },
    { en: "Accuracy, quality, and doing things the right way.", t: "C" },
  ]},
  { en: "When you disagree with a leadership decision, you:", options: [
    { en: "Speak up immediately and challenge it directly.", t: "D" },
    { en: "Talk to others about it and try to build consensus.", t: "I" },
    { en: "Quietly follow through while hoping things improve.", t: "S" },
    { en: "Document your concerns and present your reasoning carefully.", t: "C" },
  ]},
  { en: "In a cross-cultural team, your natural contribution is:", options: [
    { en: "Setting a clear direction and making fast decisions.", t: "D" },
    { en: "Creating connection and breaking down social barriers.", t: "I" },
    { en: "Creating a safe environment where everyone feels included.", t: "S" },
    { en: "Ensuring quality and attention to important cultural details.", t: "C" },
  ]},
  { en: "When a plan changes unexpectedly, you:", options: [
    { en: "Adapt quickly and find a new path forward.", t: "D" },
    { en: "Look for the positive angle and keep the team's spirits up.", t: "I" },
    { en: "Need time to process the change before fully committing.", t: "S" },
    { en: "Want to understand fully why it changed before accepting it.", t: "C" },
  ]},
  { en: "You are most frustrated when:", options: [
    { en: "Decisions drag on and things move too slowly.", t: "D" },
    { en: "The atmosphere is cold and people don't engage.", t: "I" },
    { en: "There is constant conflict or instability in the team.", t: "S" },
    { en: "Work is done carelessly or without attention to quality.", t: "C" },
  ]},
  { en: "When presenting ideas, you prefer to:", options: [
    { en: "Be brief, direct, and confident.", t: "D" },
    { en: "Be engaging, enthusiastic, and use stories.", t: "I" },
    { en: "Check with others first and present collaboratively.", t: "S" },
    { en: "Prepare thoroughly with data and a clear structure.", t: "C" },
  ]},
  { en: "Others come to you most often for:", options: [
    { en: "Quick decisions and solving problems.", t: "D" },
    { en: "Energy, ideas, and encouragement.", t: "I" },
    { en: "Support, stability, and a listening ear.", t: "S" },
    { en: "Accuracy, analysis, and careful thinking.", t: "C" },
  ]},
  { en: "In a new team, your role naturally becomes:", options: [
    { en: "The one who sets the pace and direction.", t: "D" },
    { en: "The one who creates connections and builds energy.", t: "I" },
    { en: "The one who ensures no one is left behind.", t: "S" },
    { en: "The one who catches errors and ensures quality.", t: "C" },
  ]},
  { en: "When someone on your team makes a mistake, you:", options: [
    { en: "Address it quickly and directly.", t: "D" },
    { en: "Turn it into a learning moment with a positive framing.", t: "I" },
    { en: "Handle it privately and protect their dignity.", t: "S" },
    { en: "Analyse what went wrong to prevent it happening again.", t: "C" },
  ]},
  { en: "Your preferred working pace is:", options: [
    { en: "Fast and decisive.", t: "D" },
    { en: "Dynamic and collaborative.", t: "I" },
    { en: "Steady and predictable.", t: "S" },
    { en: "Methodical and thorough.", t: "C" },
  ]},
  { en: "When dealing with conflict, you:", options: [
    { en: "Address it head-on and resolve it immediately.", t: "D" },
    { en: "Try to smooth things over and restore the relationship.", t: "I" },
    { en: "Avoid it if possible and hope it resolves naturally.", t: "S" },
    { en: "Gather all the facts first, then address it logically.", t: "C" },
  ]},
  { en: "When faced with a long to-do list, you:", options: [
    { en: "Prioritise ruthlessly and power through the most important items.", t: "D" },
    { en: "Work best when others are around to keep the energy up.", t: "I" },
    { en: "Work through it steadily, one task at a time.", t: "S" },
    { en: "Create a structured system and track everything carefully.", t: "C" },
  ]},
  { en: "When learning something new, you prefer:", options: [
    { en: "A brief overview, then diving straight in hands-on.", t: "D" },
    { en: "Interactive group sessions with discussion and shared energy.", t: "I" },
    { en: "Step-by-step guidance with plenty of time to practice.", t: "S" },
    { en: "Thorough documentation and deep understanding before starting.", t: "C" },
  ]},
  { en: "When someone disagrees with your idea, you:", options: [
    { en: "Stand your ground unless they give compelling evidence.", t: "D" },
    { en: "Try to win them over through enthusiasm and persuasion.", t: "I" },
    { en: "Listen carefully and often adapt your position.", t: "S" },
    { en: "Welcome specific objections and adjust your thinking accordingly.", t: "C" },
  ]},
  { en: "Your leadership style is best described as:", options: [
    { en: "Driving toward results with clear expectations.", t: "D" },
    { en: "Inspiring and motivating through energy and vision.", t: "I" },
    { en: "Supporting and developing people with patience.", t: "S" },
    { en: "Leading through expertise, precision, and high standards.", t: "C" },
  ]},
  { en: "In a crisis, your instinct is to:", options: [
    { en: "Take immediate control and start making decisions.", t: "D" },
    { en: "Rally people together and maintain positive energy.", t: "I" },
    { en: "Stay calm and provide stability to those around you.", t: "S" },
    { en: "Assess the situation carefully and systematically before acting.", t: "C" },
  ]},
  { en: "You feel a task is complete when:", options: [
    { en: "The goal is achieved — results matter most.", t: "D" },
    { en: "The process was engaging and the team feels good about it.", t: "I" },
    { en: "Everyone involved feels good about how it went.", t: "S" },
    { en: "Every detail has been checked and the quality is right.", t: "C" },
  ]},
  { en: "Others sometimes see you as:", options: [
    { en: "Too blunt or impatient.", t: "D" },
    { en: "Too talkative or disorganised.", t: "I" },
    { en: "Too slow to take initiative or overly accommodating.", t: "S" },
    { en: "Too critical or overly cautious.", t: "C" },
  ]},
  { en: "You feel most alive in your work when:", options: [
    { en: "You're winning and seeing measurable results.", t: "D" },
    { en: "You're inspiring people and creating real momentum.", t: "I" },
    { en: "You're making a genuine difference in someone's life.", t: "S" },
    { en: "You've solved a complex problem with care and precision.", t: "C" },
  ]},
  { en: "When closing out a project, you focus most on:", options: [
    { en: "Did we hit the target?", t: "D" },
    { en: "Did the team enjoy the process and celebrate the win?", t: "I" },
    { en: "Is everyone OK? Does anyone need additional support?", t: "S" },
    { en: "Were all quality standards met? What can we improve next time?", t: "C" },
  ]},
];

// ── DISC TYPE DATA ────────────────────────────────────────────────────────────

const DISC_TYPES = [
  {
    key: "D" as ScoreKey,
    label: "Dominance",
    tagline: "Direct. Bold. Results-driven.",
    color: "oklch(52% 0.20 25)",
    colorLight: "oklch(65% 0.16 25)",
    bg: "oklch(18% 0.15 25)",
    teamRole: "The D on your team drives momentum. They cut through indecision, set direction fast, and push for results. Without a D, teams can drift. With one, they need to ensure the pace doesn't leave people behind.",
    teamTension: "D and S styles often clash. The D wants speed; the S needs to process. The D sees the S as slow; the S sees the D as careless. Name this tension — it's not personality conflict, it's wiring.",
    teamGift: "In a crisis, the D stabilises through action. They don't freeze. That's irreplaceable when the team needs direction fast.",
  },
  {
    key: "I" as ScoreKey,
    label: "Influence",
    tagline: "Enthusiastic. Persuasive. People-first.",
    color: "oklch(52% 0.18 80)",
    colorLight: "oklch(65% 0.14 80)",
    bg: "oklch(18% 0.12 80)",
    teamRole: "The I on your team is the culture-builder. They create energy, draw people in, and turn strangers into a team. In cross-cultural contexts, their warmth is particularly gifted at bridging distance.",
    teamTension: "I and C styles can frustrate each other. The I moves on enthusiasm; the C needs data. The I sees the C as a brake; the C sees the I as unserious. Both are wrong — and both are needed.",
    teamGift: "When the team is discouraged, the I reminds them why it matters. That's not fluff — it's oxygen for long-term commitment.",
  },
  {
    key: "S" as ScoreKey,
    label: "Steadiness",
    tagline: "Patient. Loyal. Consistently supportive.",
    color: "oklch(48% 0.18 145)",
    colorLight: "oklch(62% 0.14 145)",
    bg: "oklch(18% 0.10 145)",
    teamRole: "The S on your team is the relational glue. They remember people's names, notice when someone's struggling, and hold the relational fabric together when things get hard. Don't underestimate this.",
    teamTension: "S and D styles have the highest friction potential in cross-cultural settings. The D's directness can feel like aggression to the S; the S's indirectness can feel like evasion to the D.",
    teamGift: "In a team crisis or conflict, the S is often the bridge. They genuinely care about both sides, which makes them uniquely positioned to restore trust.",
  },
  {
    key: "C" as ScoreKey,
    label: "Conscientiousness",
    tagline: "Precise. Analytical. Excellence-driven.",
    color: "oklch(48% 0.18 250)",
    colorLight: "oklch(62% 0.14 250)",
    bg: "oklch(20% 0.14 250)",
    teamRole: "The C on your team catches what everyone else misses. They slow the team down at the right moments — before a mistake is made, not after. Every team needs a C; not every team honours one.",
    teamTension: "C and I styles often misread each other. The C interprets the I's energy as lack of rigour; the I interprets the C's caution as negativity. Both are reading the surface, not the strength.",
    teamGift: "The C's standards protect the team's reputation. Their thoroughness is a form of care — care for the work, for the people affected by it, and for the team's credibility.",
  },
];

// ── SCORE CALCULATION ─────────────────────────────────────────────────────────

type ResultKey = "D" | "I" | "S" | "C" | "DI" | "DS" | "DC" | "IS" | "IC" | "SC";

function getResultKey(scores: Record<ScoreKey, number>): ResultKey {
  const entries = Object.entries(scores) as [ScoreKey, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  const second = entries[1];
  const threshold = top[1] * 0.75;
  if (second[1] >= threshold) {
    const combo = [top[0], second[0]].sort().join("") as ResultKey;
    return combo;
  }
  return top[0] as ResultKey;
}

const RESULT_INSIGHTS: Record<ResultKey, string> = {
  D: "Your team sees you as the driver. You set direction and expect movement. The gift is clarity; the risk is pace. The D style that learns to wait for the S will build a team that's faster in the long run.",
  I: "Your team sees you as the connector. You build the relational chemistry that makes collaboration possible. The gift is belonging; the risk is depth. The I style that develops follow-through becomes indispensable.",
  S: "Your team sees you as the anchor. You hold the relational fabric together. The gift is safety; the risk is passivity. The S style that learns to initiate becomes a leader who is both trusted and bold.",
  C: "Your team sees you as the standard-bearer. You hold the bar high. The gift is excellence; the risk is isolation. The C style that shares its thinking openly builds trust alongside quality.",
  DI: "You drive results and bring people with you — a rare and powerful combination. The risk is moving too fast for both the goal and the people. Slow down intentionally.",
  DS: "You set direction and provide stability — a team can follow you through anything. Watch that your directness doesn't override the relational care you're capable of.",
  DC: "You pursue results with precision — nothing gets past you. Your risk is perfectionism. Sometimes done and good enough beats perfect and late.",
  IS: "You inspire and care — people both follow you and feel valued by you. In cross-cultural teams, this is extraordinarily gifted. Your risk is avoiding hard decisions.",
  IC: "You communicate well and think carefully — a rare combination. Your risk is overthinking. Trust your read on people; it's usually right.",
  SC: "You are steady, thorough, and deeply trustworthy. Teams depend on you without fully realising it. Your risk is invisibility. Speak up — your insight is exactly what the team needs.",
};

type QuizState = "idle" | "active" | "done";

function getShuffledOptions(qIndex: number): QOption[] {
  const order = SHUFFLE_ORDERS[qIndex] ?? [0, 1, 2, 3];
  return order.map((i) => QS[qIndex].options[i]);
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DiscTeamClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<ScoreKey, number>>({ D: 0, I: 0, S: 0, C: 0 });
  const [answerHistory, setAnswerHistory] = useState<ScoreKey[]>([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const total = scores.D + scores.I + scores.S + scores.C;
  const resultKey = total > 0 ? getResultKey(scores) : "D" as ResultKey;

  const pD = total > 0 ? Math.round((scores.D / total) * 100) : 0;
  const pI = total > 0 ? Math.round((scores.I / total) * 100) : 0;
  const pS = total > 0 ? Math.round((scores.S / total) * 100) : 0;
  const pC = total > 0 ? 100 - pD - pI - pS : 0;

  const primaryType = DISC_TYPES.find(t => t.key === resultKey[0]) ?? DISC_TYPES[0];

  function startQuiz() {
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
    setSaveError(null);
    setQuizState("active");
    setTimeout(() => {
      document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleAnswer(t: ScoreKey) {
    const newScores = { ...scores, [t]: scores[t] + 1 };
    const newHistory = [...answerHistory, t];
    if (currentQ < QS.length - 1) {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setCurrentQ(currentQ + 1);
    } else {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setQuizState("done");
    }
  }

  function handleBack() {
    if (currentQ === 0) return;
    const prevType = answerHistory[answerHistory.length - 1];
    setAnswerHistory(answerHistory.slice(0, -1));
    setScores({ ...scores, [prevType]: scores[prevType] - 1 });
    setCurrentQ(currentQ - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
    setSaveError(null);
  }

  function handleSaveResult() {
    if (!user || resultKey === "D" && total === 0) return;
    startTransition(async () => {
      const result = await saveDISCTeamResult(resultKey, { D: pD, I: pI, S: pS, C: pC });
      if (result.error) {
        setSaveError(result.error);
      } else {
        setResultSaved(true);
      }
    });
  }

  const progress = quizState === "active"
    ? Math.round((currentQ / QS.length) * 100)
    : quizState === "done" ? 100 : 0;

  return (
    <div style={{ fontFamily: "var(--font-montserrat)", background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.08 260)",
        paddingTop: "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(3.5rem, 7vw, 6rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Watermark DISC letters */}
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "-0.5rem",
          bottom: "-1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          opacity: 0.03,
          pointerEvents: "none",
          userSelect: "none",
        }}>
          {["D","I","S","C"].map((letter) => (
            <span key={letter} style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(6rem, 16vw, 18rem)",
              fontWeight: 900,
              color: "oklch(97% 0.005 80)",
              lineHeight: 1,
            }}>
              {letter}
            </span>
          ))}
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          <Link
            href="/team"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(72% 0.04 260)",
              textDecoration: "none",
              marginBottom: "2.5rem",
            }}
          >
            ← Team Pathway
          </Link>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              background: "oklch(65% 0.15 45 / 0.12)",
              padding: "5px 12px",
              border: "1px solid oklch(65% 0.15 45 / 0.3)",
            }}>
              Team Assessment · DISC
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(72% 0.04 260)",
              background: "oklch(38% 0.10 260 / 0.15)",
              padding: "5px 12px",
            }}>
              Assessment · 10–15 min
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "oklch(97% 0.005 80)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            marginBottom: "1.25rem",
            maxWidth: "20ch",
          }}>
            Team DISC Profile
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: "2.5rem",
          }}>
            Understanding your DISC profile is one thing. Understanding how your D shows up next to someone else&rsquo;s S — that&rsquo;s where teams either click or clash.
          </p>

          <button onClick={startQuiz} className="btn-primary">
            Discover Your Team Style →
          </button>
        </div>
      </section>

      {/* ── SECTION 1: How DISC Styles Interact on Teams ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 1
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            When Styles Meet: The Team Dynamic
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Most team conflict is not about bad intentions. It&rsquo;s about different wiring. A D-style leader pushes for speed; the S-style team member needs time to process. Neither is wrong — both are experiencing the same moment through entirely different lenses.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            DISC becomes most powerful not when you know your own profile — but when the whole team knows each other&rsquo;s. When a D finally understands why their C colleague keeps asking for more data, the frustration lifts. When an S understands that their I teammate&rsquo;s enthusiasm is not a lack of seriousness, the dynamic shifts.
          </p>

          <div style={{
            background: "oklch(95% 0.005 80)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.7,
              color: "oklch(38% 0.008 260)",
              margin: 0,
            }}>
              <strong style={{ color: "oklch(22% 0.08 260)", fontWeight: 700 }}>The insight for your team: </strong>
              The friction you&rsquo;ve been feeling has a name. And it&rsquo;s not someone&rsquo;s fault — it&rsquo;s the natural result of different styles working without a shared language to describe them.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: What Each Style Brings to the Team ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(30% 0.12 260)" }}>
        <div className="container-wide">
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 2
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2.5rem",
          }}>
            What Each Style Brings to the Team
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1px",
            background: "oklch(22% 0.10 260 / 0.5)",
          }}>
            {DISC_TYPES.map(type => (
              <div key={type.key} style={{
                background: type.bg,
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  background: type.color,
                }} />

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    border: `2px solid ${type.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 900,
                      fontSize: "1.375rem",
                      color: type.colorLight,
                      lineHeight: 1,
                    }}>
                      {type.key}
                    </span>
                  </div>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "0.9375rem",
                      color: "oklch(97% 0.005 80)",
                      margin: 0,
                      lineHeight: 1.2,
                    }}>
                      {type.label}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: type.colorLight,
                      margin: 0,
                    }}>
                      {type.tagline}
                    </p>
                  </div>
                </div>

                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "oklch(80% 0.04 260)",
                  marginBottom: "1rem",
                }}>
                  {type.teamRole}
                </p>

                <div style={{
                  background: "oklch(97% 0.005 80 / 0.05)",
                  borderLeft: `2px solid ${type.color}`,
                  padding: "0.875rem 1rem",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: type.colorLight,
                    marginBottom: "0.375rem",
                  }}>
                    Team Gift
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8125rem",
                    lineHeight: 1.6,
                    color: "oklch(72% 0.04 260)",
                    margin: 0,
                  }}>
                    {type.teamGift}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Where Styles Create Tension ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 3
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Where Styles Create Tension
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "2rem",
          }}>
            Tension between styles is predictable — which means it&rsquo;s manageable. Once your team can map the friction, it stops being personal.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {DISC_TYPES.map(type => (
              <div key={type.key} style={{
                background: "oklch(95% 0.005 80)",
                padding: "1.5rem 1.75rem",
                display: "grid",
                gridTemplateColumns: "3rem 1fr",
                gap: "1.25rem",
                alignItems: "start",
              }}>
                <div style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  border: `2px solid ${type.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 900,
                    fontSize: "1rem",
                    color: type.color,
                    lineHeight: 1,
                  }}>
                    {type.key}
                  </span>
                </div>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "oklch(42% 0.008 260)",
                  margin: 0,
                }}>
                  {type.teamTension}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Biblical Angle ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(22% 0.08 260)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 4
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Different Gifts, One Body
          </h2>

          <blockquote style={{
            borderLeft: "3px solid oklch(65% 0.15 45)",
            paddingLeft: "2rem",
            marginLeft: 0,
            marginBottom: "2rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.125rem, 2.5vw, 1.4rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "oklch(92% 0.005 80)",
              lineHeight: 1.6,
              marginBottom: "0.75rem",
            }}>
              &ldquo;Just as each of us has one body with many members, and these members do not all have the same function, so in Christ we, though many, form one body, and each member belongs to all the others. We have different gifts, according to the grace given to each of us.&rdquo;
            </p>
            <cite style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              fontStyle: "normal",
            }}>
              Romans 12:4–6
            </cite>
          </blockquote>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            The body metaphor is not just poetic. It&rsquo;s a design principle. The eye doesn&rsquo;t resent the hand for being different — it needs the hand. The D doesn&rsquo;t need to become an S; the S doesn&rsquo;t need to become a D. They need each other, and they need to know it.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
          }}>
            The most dangerous team is one where everyone is wired the same. Speed without steadiness loses people. Enthusiasm without precision produces beautiful chaos. Harmony without drive produces comfortable stagnation. Every style is a strength. Every gap is a risk. A complete team has all four — and knows how to work the tension.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: Cross-Cultural Note ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Section 5
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Cross-Cultural Note: When DISC Meets Culture
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            DISC describes behavioural preferences. Culture shapes how those preferences get expressed — or suppressed. A D-style leader from a consensus culture may hold their directness back in group settings, not because they&rsquo;ve lost their D, but because their cultural context rewards a different expression of it.
          </p>

          <div style={{
            background: "oklch(95% 0.005 80)",
            borderLeft: "3px solid oklch(22% 0.08 260)",
            padding: "1.5rem 1.75rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "oklch(22% 0.08 260)",
              marginBottom: "0.5rem",
            }}>
              For cross-cultural teams, this matters:
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "oklch(38% 0.008 260)",
              margin: 0,
            }}>
              A high-D leadership style that works in a low-context, direct culture may feel aggressive or disrespectful in a high-context, honour-based culture. The behaviour is the same — the reception is completely different. When you know your team&rsquo;s DISC profiles and their cultural backgrounds, you can start to decode what&rsquo;s really happening in the room.
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            Don&rsquo;t assume someone&rsquo;s silence is S-style caution — it might be cultural deference. Don&rsquo;t assume someone&rsquo;s pushback is D-style assertiveness — it might be I-style persuasion in a more direct cultural wrapper. Read both the DISC and the culture before you interpret the behaviour.
          </p>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section id="quiz-section" style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(22% 0.10 260)",
        position: "relative",
      }}>
        <div className="container-wide">
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.875rem",
          }}>
            Closing Activity
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            lineHeight: 1.15,
            color: "oklch(97% 0.005 80)",
            marginBottom: "0.875rem",
          }}>
            Discover Your Team DISC Style
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(65% 0.04 260)",
            marginBottom: "3rem",
            maxWidth: "56ch",
          }}>
            24 questions. Choose what feels most natural — not what you think you should do. Your result saves to your team dashboard.
          </p>

          <div style={{ maxWidth: "680px", background: "oklch(30% 0.12 260)", overflow: "hidden" }}>
            <div style={{ height: "3px", background: "linear-gradient(90deg, oklch(52% 0.20 25), oklch(52% 0.18 80), oklch(48% 0.18 145), oklch(48% 0.18 250))" }} />
            <div style={{ padding: "clamp(2rem, 4vw, 3.5rem)" }}>

              {/* IDLE */}
              {quizState === "idle" && (
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9375rem",
                    color: "oklch(65% 0.04 260)",
                    lineHeight: 1.75,
                    marginBottom: "2.5rem",
                  }}>
                    Each scenario has four options. There are no right or wrong answers. Choose the response that feels most like you — not what you think you should do.
                  </p>
                  <button onClick={startQuiz} className="btn-primary">
                    Begin the Quiz →
                  </button>
                </div>
              )}

              {/* ACTIVE */}
              {quizState === "active" && (
                <div>
                  <div style={{ marginBottom: "2rem" }}>
                    <div style={{ height: "2px", background: "oklch(97% 0.005 80 / 0.08)", marginBottom: "0.625rem" }}>
                      <div style={{ height: "100%", background: "oklch(65% 0.15 45)", width: `${((currentQ + 1) / QS.length) * 100}%`, transition: "width 0.4s ease" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.008 260)" }}>
                      Question {currentQ + 1} of {QS.length}
                    </p>
                  </div>

                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    fontSize: "1.0625rem",
                    color: "oklch(97% 0.005 80)",
                    lineHeight: 1.5,
                    marginBottom: "1.75rem",
                  }}>
                    {QS[currentQ].en}
                  </p>

                  <style>{`
                    .disc-team-opt { background: oklch(97% 0.005 80 / 0.04); border: 1px solid oklch(97% 0.005 80 / 0.1); color: oklch(78% 0.04 260); }
                    @media (hover: hover) { .disc-team-opt:hover { background: oklch(97% 0.005 80 / 0.08) !important; border-color: oklch(97% 0.005 80 / 0.2) !important; color: oklch(97% 0.005 80) !important; } }
                    .disc-team-opt:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 2px; }
                  `}</style>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {getShuffledOptions(currentQ).map((opt, i) => (
                      <button
                        key={i}
                        className="disc-team-opt"
                        onClick={() => handleAnswer(opt.t)}
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                          padding: "1rem 1.25rem",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "background 0.15s, border-color 0.15s, color 0.15s",
                          display: "flex",
                          gap: "1rem",
                          alignItems: "flex-start",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "oklch(55% 0.008 260)",
                          flexShrink: 0,
                          marginTop: "0.15rem",
                        }}>
                          {["A","B","C","D"][i]}
                        </span>
                        {opt.en}
                      </button>
                    ))}
                  </div>

                  {currentQ > 0 && (
                    <button
                      onClick={handleBack}
                      style={{
                        marginTop: "1.25rem",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "oklch(55% 0.008 260)",
                        background: "none",
                        border: "1px solid oklch(42% 0.008 260 / 0.5)",
                        padding: "0.625rem 1.25rem",
                        cursor: "pointer",
                      }}
                    >
                      ← Go Back
                    </button>
                  )}
                </div>
              )}

              {/* DONE */}
              {quizState === "done" && (
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: primaryType.colorLight,
                    marginBottom: "1.25rem",
                  }}>
                    Your Team DISC Profile
                  </p>

                  <div style={{
                    borderLeft: `3px solid ${primaryType.color}`,
                    paddingLeft: "1.25rem",
                    marginBottom: "2rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                      <div style={{
                        width: "3rem",
                        height: "3rem",
                        flexShrink: 0,
                        background: `${primaryType.color}18`,
                        border: `2px solid ${primaryType.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 900,
                          fontSize: "1.5rem",
                          color: primaryType.colorLight,
                          lineHeight: 1,
                        }}>
                          {resultKey[0]}
                        </span>
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 800,
                          fontSize: "1.25rem",
                          color: "oklch(97% 0.005 80)",
                          lineHeight: 1.15,
                          marginBottom: "0.2rem",
                        }}>
                          {primaryType.label}
                          {resultKey.length === 2 && (
                            <span style={{ color: primaryType.colorLight, fontSize: "0.9rem", fontWeight: 600, marginLeft: "0.5rem", opacity: 0.8 }}>
                              / {DISC_TYPES.find(t => t.key === resultKey[1])?.label}
                            </span>
                          )}
                        </p>
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8rem",
                          color: primaryType.colorLight,
                          fontWeight: 600,
                        }}>
                          {primaryType.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Score bars */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {[
                        { key: "D" as ScoreKey, pct: pD, color: "oklch(52% 0.20 25)", light: "oklch(65% 0.16 25)" },
                        { key: "I" as ScoreKey, pct: pI, color: "oklch(52% 0.18 80)",  light: "oklch(65% 0.14 80)" },
                        { key: "S" as ScoreKey, pct: pS, color: "oklch(48% 0.18 145)", light: "oklch(62% 0.14 145)" },
                        { key: "C" as ScoreKey, pct: pC, color: "oklch(48% 0.18 250)", light: "oklch(62% 0.14 250)" },
                      ].map(bar => {
                        const isPrimary = bar.key === resultKey[0];
                        return (
                          <div key={bar.key} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 900,
                              fontSize: "0.65rem",
                              color: isPrimary ? bar.light : bar.color,
                              width: "0.75rem",
                              flexShrink: 0,
                              textAlign: "center",
                              opacity: isPrimary ? 1 : 0.7,
                            }}>
                              {bar.key}
                            </span>
                            <div style={{ flex: 1, height: isPrimary ? "7px" : "4px", background: "oklch(97% 0.005 80 / 0.07)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${bar.pct}%`, background: isPrimary ? bar.light : bar.color, opacity: isPrimary ? 1 : 0.55, transition: "width 1s ease" }} />
                            </div>
                            <span style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: isPrimary ? "0.85rem" : "0.75rem",
                              fontWeight: isPrimary ? 800 : 600,
                              color: isPrimary ? "oklch(92% 0.005 80)" : "oklch(58% 0.04 260)",
                              width: "2.5rem",
                              textAlign: "right",
                              flexShrink: 0,
                            }}>
                              {bar.pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Team insight */}
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "oklch(82% 0.03 260)",
                    marginBottom: "1.5rem",
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid oklch(97% 0.005 80 / 0.07)",
                  }}>
                    {RESULT_INSIGHTS[resultKey]}
                  </p>

                  {/* Closing message */}
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: "oklch(65% 0.15 45)",
                    fontStyle: "italic",
                    marginBottom: "2rem",
                  }}>
                    &ldquo;Your result belongs to your team. Share it. The best team conversations happen when a D and an S finally name what they&rsquo;ve been experiencing.&rdquo;
                  </p>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
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
                        border: "1.5px solid oklch(42% 0.008 260)",
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
                          background: isPending ? "oklch(40% 0.10 260)" : "oklch(65% 0.15 45)",
                          color: isPending ? "oklch(97% 0.005 80)" : "oklch(14% 0.08 260)",
                          border: "none",
                          cursor: isPending ? "wait" : "pointer",
                          transition: "background 0.15s",
                        }}
                      >
                        {isPending ? "Saving…" : "Save to Team Dashboard →"}
                      </button>
                    )}

                    {user && resultSaved && (
                      <Link href="/dashboard?tab=team" style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        letterSpacing: "0.06em",
                        textDecoration: "none",
                        color: "oklch(72% 0.14 145)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                      }}>
                        ✓ Saved to Team Dashboard
                      </Link>
                    )}

                    {!user && (
                      <Link href="/membership" style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        letterSpacing: "0.06em",
                        textDecoration: "none",
                        padding: "0.7rem 1.5rem",
                        background: "oklch(65% 0.15 45)",
                        color: "oklch(14% 0.08 260)",
                      }}>
                        Sign In to Save →
                      </Link>
                    )}
                  </div>

                  {saveError && (
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.8rem",
                      color: "oklch(65% 0.20 30)",
                      margin: 0,
                    }}>
                      {saveError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(30% 0.12 260)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 4rem)",
          top: "clamp(4rem, 7vw, 7rem)",
          bottom: "clamp(4rem, 7vw, 7rem)",
          width: "3px",
          background: "oklch(65% 0.15 45)",
        }} />
        <div className="container-wide" style={{ paddingLeft: "2.5rem" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.875rem",
          }}>
            Continue
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            lineHeight: 1.15,
            color: "oklch(97% 0.005 80)",
            marginBottom: "1rem",
          }}>
            Every style has a gift. Every team needs all four.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(72% 0.04 260)",
            maxWidth: "52ch",
            marginBottom: "2rem",
          }}>
            See how your team&rsquo;s communication culture is shaped by all these styles together.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/team" style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
              padding: "0.75rem 1.75rem",
              background: "oklch(65% 0.15 45)",
              color: "oklch(14% 0.08 260)",
            }}>
              Back to Team Pathway →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
