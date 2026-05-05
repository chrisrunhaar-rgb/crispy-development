"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveEnneagramTeamResult } from "./actions";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 45 statements (5 per type). Field `t` = Enneagram type number (1–9).
// Rated 1–5: 1 = Not like me → 5 = Very much like me.

const QUESTIONS = [
  // Type 1
  { text: "I hold myself and others to high standards and feel responsible for doing things the right way.", t: 1 },
  { text: "I notice flaws and imperfections quickly — in myself, others, or situations.", t: 1 },
  { text: "There is a persistent inner critic in my mind that holds me accountable.", t: 1 },
  { text: "I feel a strong sense of purpose tied to making things better or more just.", t: 1 },
  { text: "When people around me cut corners or ignore ethical standards, I feel frustrated and responsible to address it.", t: 1 },
  // Type 2
  { text: "I naturally sense what others need and feel pulled to provide it.", t: 2 },
  { text: "My sense of worth is closely tied to being needed and appreciated by others.", t: 2 },
  { text: "I find it easier to give than to receive — asking for help feels uncomfortable.", t: 2 },
  { text: "I adapt my behaviour to what will make the people I care about feel good.", t: 2 },
  { text: "People often come to me for emotional support, and I rarely turn them away.", t: 2 },
  // Type 3
  { text: "Accomplishing goals and being seen as successful is very important to me.", t: 3 },
  { text: "I can adapt my style and presentation depending on what the situation or audience requires.", t: 3 },
  { text: "I feel most alive when I am making progress, completing tasks, and being productive.", t: 3 },
  { text: "I am aware of how others perceive me and work to maintain a positive, competent image.", t: 3 },
  { text: "I tend to measure my value by what I achieve and struggle to slow down without feeling guilty.", t: 3 },
  // Type 4
  { text: "I often feel that something is missing — a sense of incompleteness or deep longing.", t: 4 },
  { text: "I have deep and intense emotions that others don't always understand.", t: 4 },
  { text: "I value authenticity and originality highly — being ordinary or typical feels suffocating.", t: 4 },
  { text: "I am drawn to what is meaningful, beautiful, and emotionally significant.", t: 4 },
  { text: "I can experience mood swings and sometimes feel fundamentally different from those around me.", t: 4 },
  // Type 5
  { text: "I prefer to observe and think deeply before joining a conversation or making a decision.", t: 5 },
  { text: "I protect my energy and time carefully and need significant alone time to recharge.", t: 5 },
  { text: "I feel most confident when I have built deep knowledge and expertise in an area.", t: 5 },
  { text: "Emotionally intense situations feel draining — I prefer engaging with ideas over strong feelings.", t: 5 },
  { text: "I tend to minimise my needs so I don't feel dependent on or overwhelmed by others.", t: 5 },
  // Type 6
  { text: "I tend to anticipate problems and mentally prepare for what could go wrong.", t: 6 },
  { text: "Trust must be earned — I can be skeptical of authority or new people until I feel certain.", t: 6 },
  { text: "I feel most secure within trusted relationships, clear structures, and reliable expectations.", t: 6 },
  { text: "Once I commit to a person or cause, I am deeply loyal and show up consistently.", t: 6 },
  { text: "I experience underlying anxiety about security and sometimes struggle to fully trust my own judgment.", t: 6 },
  // Type 7
  { text: "I am energised by new ideas, possibilities, and experiences — life feels most alive when things are fresh.", t: 7 },
  { text: "I find it hard to stay with discomfort or boredom for long — I tend to reframe or move on.", t: 7 },
  { text: "I have many interests and ideas, and I sometimes start more things than I finish.", t: 7 },
  { text: "I prefer to keep my options open and find restrictions or firm commitments uncomfortable.", t: 7 },
  { text: "I naturally see the positive in situations and become restless when life feels too routine.", t: 7 },
  // Type 8
  { text: "I take charge naturally and am comfortable confronting situations or people that feel unjust.", t: 8 },
  { text: "Vulnerability feels uncomfortable — I prefer to project strength and stay in control.", t: 8 },
  { text: "I can be intense and others sometimes experience me as too direct, too forceful, or too much.", t: 8 },
  { text: "I feel called to protect people who are vulnerable and to fight for what is right.", t: 8 },
  { text: "I go all-in on what I believe in — half-measures and timidity frustrate me deeply.", t: 8 },
  // Type 9
  { text: "I find conflict deeply uncomfortable and naturally try to mediate or smooth things over.", t: 9 },
  { text: "I can lose sight of my own priorities when I am busy supporting others.", t: 9 },
  { text: "I see all sides of an issue and can find it hard to take a strong personal stance.", t: 9 },
  { text: "People find me easy to be around — I have a calming, reassuring presence.", t: 9 },
  { text: "I can procrastinate on things that matter to me personally while remaining productive for others.", t: 9 },
];

// Round-robin order: interleaves all 9 types
const QUESTION_ORDER = [
  0, 5, 10, 15, 20, 25, 30, 35, 40,
  1, 6, 11, 16, 21, 26, 31, 36, 41,
  2, 7, 12, 17, 22, 27, 32, 37, 42,
  3, 8, 13, 18, 23, 28, 33, 38, 43,
  4, 9, 14, 19, 24, 29, 34, 39, 44,
];

const SCALE_LABELS = [
  "Not like me",
  "Slightly like me",
  "Somewhat like me",
  "Mostly like me",
  "Very much like me",
];

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

interface EnneagramType {
  number: number;
  name: string;
  tagline: string;
  color: string;
  colorLight: string;
  colorVeryLight: string;
  bg: string;
  teamStrengths: string[];
  stressBehaviour: string;
  workingWith: string;
}

const TYPES: EnneagramType[] = [
  {
    number: 1,
    name: "The Reformer",
    tagline: "Principled. Purposeful. Committed to what's right.",
    color: "oklch(52% 0.18 250)",
    colorLight: "oklch(65% 0.14 250)",
    colorVeryLight: "oklch(94% 0.03 250)",
    bg: "oklch(18% 0.14 250)",
    teamStrengths: ["Sets and upholds clear standards", "Brings ethical clarity to complex decisions", "Consistent follow-through — you can count on them"],
    stressBehaviour: "Becomes critical, rigid, and perfectionistic. May nitpick others or feel resentful when standards are not met.",
    workingWith: "Acknowledge their effort and intentions before giving feedback. Avoid asking them to cut corners — it conflicts with their identity.",
  },
  {
    number: 2,
    name: "The Helper",
    tagline: "Generous. Warm. Relationally attentive.",
    color: "oklch(52% 0.18 10)",
    colorLight: "oklch(65% 0.14 10)",
    colorVeryLight: "oklch(94% 0.04 10)",
    bg: "oklch(18% 0.14 10)",
    teamStrengths: ["The emotional glue — makes people feel seen", "Builds loyalty through genuine care", "Anticipates what teammates need before they ask"],
    stressBehaviour: "Becomes indirect, manipulative, or emotionally volatile when feeling unappreciated. May exhaust themselves and then resent it.",
    workingWith: "Express genuine gratitude. Be warm and personal — not just transactional. Create safety for them to say no.",
  },
  {
    number: 3,
    name: "The Achiever",
    tagline: "Driven. Adaptable. Naturally effective.",
    color: "oklch(55% 0.18 65)",
    colorLight: "oklch(68% 0.14 65)",
    colorVeryLight: "oklch(94% 0.04 65)",
    bg: "oklch(18% 0.12 65)",
    teamStrengths: ["Sets the pace through visible achievement", "Adapts to any audience or context", "Brings energy and momentum to stalled teams"],
    stressBehaviour: "Becomes image-obsessed, shortcuts relationships for results, or loses touch with genuine emotions. May push the team too hard.",
    workingWith: "Acknowledge achievements specifically. Show the path to success. Avoid making them feel like they're underperforming.",
  },
  {
    number: 4,
    name: "The Individualist",
    tagline: "Expressive. Authentic. Emotionally deep.",
    color: "oklch(48% 0.22 295)",
    colorLight: "oklch(62% 0.17 295)",
    colorVeryLight: "oklch(94% 0.04 295)",
    bg: "oklch(16% 0.18 295)",
    teamStrengths: ["Brings depth and emotional intelligence to the team", "Creative voice that helps teams explore the deeper 'why'", "Connects at a soul level — especially with people who are hurting"],
    stressBehaviour: "Withdraws, becomes dramatic, or absorbed in their own emotional landscape. Mood fluctuations affect team consistency.",
    workingWith: "Acknowledge their uniqueness. Don't rush them past emotion. Create space for genuine expression — they can sense inauthenticity immediately.",
  },
  {
    number: 5,
    name: "The Investigator",
    tagline: "Analytical. Perceptive. Expert.",
    color: "oklch(50% 0.16 195)",
    colorLight: "oklch(64% 0.12 195)",
    colorVeryLight: "oklch(94% 0.03 195)",
    bg: "oklch(18% 0.12 195)",
    teamStrengths: ["Deep preparation and rigorous analysis", "Calm under pressure — not reactive or impulsive", "The most prepared person in the room"],
    stressBehaviour: "Withdraws, hoards information, becomes emotionally distant. Analysis paralysis can slow decisions past the point of usefulness.",
    workingWith: "Give them space to think. Share information in advance. Respect boundaries around time and energy — they are being careful, not cold.",
  },
  {
    number: 6,
    name: "The Loyalist",
    tagline: "Loyal. Responsible. Trustworthy.",
    color: "oklch(48% 0.18 240)",
    colorLight: "oklch(62% 0.13 240)",
    colorVeryLight: "oklch(94% 0.03 240)",
    bg: "oklch(17% 0.15 240)",
    teamStrengths: ["Identifies risks before others see them", "Deeply loyal — consistently shows up", "Builds trust through reliability and follow-through"],
    stressBehaviour: "Chronic anxiety, overthinking, testing others' loyalty unnecessarily. Can become compliant or rebellious with authority.",
    workingWith: "Be consistent and transparent. Explain your reasoning. Sudden changes without explanation shake them deeply. Follow through on what you say.",
  },
  {
    number: 7,
    name: "The Enthusiast",
    tagline: "Visionary. Energetic. Possibility-focused.",
    color: "oklch(60% 0.18 52)",
    colorLight: "oklch(72% 0.14 52)",
    colorVeryLight: "oklch(94% 0.04 52)",
    bg: "oklch(18% 0.12 52)",
    teamStrengths: ["Generates ideas and forward momentum", "Makes the future feel exciting and achievable", "Bounces back from setbacks — resilient and optimistic"],
    stressBehaviour: "Over-commits, starts without finishing, uses optimism to avoid depth. May be present in body but absent in sustained attention.",
    workingWith: "Engage with their enthusiasm first. Keep things dynamic. Give them creative ownership — they lose energy in over-structured environments.",
  },
  {
    number: 8,
    name: "The Challenger",
    tagline: "Powerful. Decisive. Protective.",
    color: "oklch(50% 0.22 25)",
    colorLight: "oklch(63% 0.17 25)",
    colorVeryLight: "oklch(94% 0.04 25)",
    bg: "oklch(17% 0.16 25)",
    teamStrengths: ["Takes charge in ambiguous or high-stakes situations", "Protects and advocates fiercely for the team", "Willing to have the hard conversation no one else will"],
    stressBehaviour: "Domineering, bulldozing others' input, unaware of their intensity. Trust, once broken, is rarely restored.",
    workingWith: "Be direct and confident. Don't be passive or vague. Earn their respect through substance — they don't respond to compliance.",
  },
  {
    number: 9,
    name: "The Peacemaker",
    tagline: "Peaceful. Inclusive. A steady presence.",
    color: "oklch(50% 0.15 145)",
    colorLight: "oklch(63% 0.12 145)",
    colorVeryLight: "oklch(94% 0.03 145)",
    bg: "oklch(17% 0.10 145)",
    teamStrengths: ["Holds diverse teams together with grace", "Sees all sides — the natural mediator", "Calm, non-anxious presence under pressure"],
    stressBehaviour: "Passive, disengaged, goes along to avoid disruption even when they deeply disagree. Procrastinates on their own priorities.",
    workingWith: "Create space for them to share — they won't always volunteer. Give them time to respond. Ask what they want, then actually wait for a real answer.",
  },
];

// ── WING CALCULATION ──────────────────────────────────────────────────────────

interface WingData {
  [key: string]: string;
}

const WING_DESCRIPTIONS: WingData = {
  "1w9": "1w9 — The Idealist: More introverted and philosophical. Convictions run deep but held quietly — principle with patience.",
  "1w2": "1w2 — The Advocate: More outwardly oriented. Applies high standards in service of others — warmth with conviction.",
  "2w1": "2w1 — The Servant: More principled and mission-driven. Gives because it's the right thing to do.",
  "2w3": "2w3 — The Host: More image-conscious and outgoing. Warmth meets ambition in how they serve.",
  "3w2": "3w2 — The Charmer: Achieves through connection. Success means winning people as much as results.",
  "3w4": "3w4 — The Professional: Combines ambition with the desire to express something meaningful and true.",
  "4w3": "4w3 — The Aristocrat: Depth with ambition. Wants uniqueness not just felt but seen and recognised.",
  "4w5": "4w5 — The Bohemian: Emotional depth with a need to understand. Rich, complex inner world.",
  "5w4": "5w4 — The Iconoclast: Analytical depth with aesthetic sensibility. Visionary and original.",
  "5w6": "5w6 — The Problem Solver: Deep expertise with a focus on reliability and practical problem-solving.",
  "6w5": "6w5 — The Defender: Loyalty with independent thinking. Tests authority through careful analysis.",
  "6w7": "6w7 — The Buddy: Loyalty with warmth and humour. Manages anxiety through connection and optimism.",
  "7w6": "7w6 — The Entertainer: Enthusiasm with commitment to community. Fun, warm, and grounding.",
  "7w8": "7w8 — The Realist: Enthusiasm with force. Goes big and follows through with intensity.",
  "8w7": "8w7 — The Maverick: Strength with enthusiasm and vision — charismatic, bold, future-facing.",
  "8w9": "8w9 — The Bear: Power held in reserve. Deeply protective and surprisingly gentle.",
  "9w8": "9w8 — The Referee: Peacefulness with strength. Can step into conflict when harmony demands it.",
  "9w1": "9w1 — The Dreamer: Peace with quiet conviction. Visionary in a gentle, long-term way.",
};

function getAdjacentTypes(t: number): [number, number] {
  if (t === 1) return [9, 2];
  if (t === 9) return [8, 1];
  return [t - 1, t + 1] as [number, number];
}

function getWingDescription(
  primaryType: number,
  scores: Record<string, number>
): string | null {
  const [a, b] = getAdjacentTypes(primaryType);
  const scoreA = scores[String(a)] ?? 0;
  const scoreB = scores[String(b)] ?? 0;
  const wingType = scoreA >= scoreB ? a : b;
  const key = `${primaryType}w${wingType}`;
  return WING_DESCRIPTIONS[key] ?? null;
}

// ── TEAM DYNAMICS ─────────────────────────────────────────────────────────────

const TYPE_DYNAMICS: { pair: string; dynamic: string }[] = [
  { pair: "1 + 9", dynamic: "Complementary: the 1 brings direction, the 9 brings calm. Watch for 1's frustration with 9's pace." },
  { pair: "2 + 8", dynamic: "Powerful pairing: care meets decisiveness. Friction when the 8 is too direct for the 2's relational style." },
  { pair: "3 + 7", dynamic: "High-energy, forward-moving. Risk: both avoid depth and difficulty — important tasks can get overlooked." },
  { pair: "4 + 5", dynamic: "Deep and introspective together. Can be isolated from the rest of the team if not intentionally connected." },
  { pair: "6 + 3", dynamic: "Efficiency meets caution. The 6 asks 'what could go wrong?' while the 3 wants to move. Productive if respected." },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

export default function EnneagramTeamClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
    "6": 0, "7": 0, "8": 0, "9": 0,
  });
  const [answerHistory, setAnswerHistory] = useState<
    { questionIdx: number; value: number; type: number }[]
  >([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [expandedType, setExpandedType] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setResultSaved(false);
    setSaveError(null);
    setQuizState("active");
    setTimeout(() => {
      document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleAnswer(value: number) {
    const questionIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[questionIdx];
    const newScores = {
      ...scores,
      [String(q.t)]: (scores[String(q.t)] ?? 0) + value,
    };
    const newHistory = [
      ...answerHistory,
      { questionIdx, value, type: q.t },
    ];
    if (currentIdx < QUESTION_ORDER.length - 1) {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setCurrentIdx(currentIdx + 1);
    } else {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setQuizState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (currentIdx === 0) return;
    const last = answerHistory[answerHistory.length - 1];
    const newScores = {
      ...scores,
      [String(last.type)]: (scores[String(last.type)] ?? 0) - last.value,
    };
    setScores(newScores);
    setAnswerHistory(answerHistory.slice(0, -1));
    setCurrentIdx(currentIdx - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setResultSaved(false);
    setSaveError(null);
  }

  function handleSaveResult() {
    startTransition(async () => {
      const result = await saveEnneagramTeamResult(primaryType.number, scores);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setResultSaved(true);
      }
    });
  }

  const sortedTypes = TYPES.slice().sort(
    (a, b) => (scores[String(b.number)] ?? 0) - (scores[String(a.number)] ?? 0)
  );
  const primaryType = sortedTypes[0];
  const wingDesc =
    quizState === "done"
      ? getWingDescription(primaryType.number, scores)
      : null;
  const maxPossible = 25;

  const currentQuestion =
    quizState === "active" ? QUESTIONS[QUESTION_ORDER[currentIdx]] : null;
  const progressPct = Math.round((currentIdx / QUESTION_ORDER.length) * 100);

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          background:
            quizState === "done" ? primaryType.bg : "oklch(22% 0.08 260)",
          paddingTop: "clamp(2.5rem, 5vw, 5rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 5rem)",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.6s ease",
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
          9
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
              Team Assessment · Enneagram
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
              8–12 min
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
            {quizState === "done"
              ? `Type ${primaryType.number} — ${primaryType.name}`
              : <>
                  Team<br />
                  <span style={{ color: "oklch(65% 0.15 45)" }}>Enneagram</span>
                </>}
          </h1>

          <p
            className="t-tagline"
            style={{
              color: "oklch(72% 0.04 260)",
              maxWidth: "52ch",
              marginBottom: "2.5rem",
            }}
          >
            {quizState === "done"
              ? primaryType.tagline
              : "The Enneagram reveals not just what you do, but why. On a team, understanding each other's core motivations changes how you give feedback, resolve conflict, and lead."}
          </p>

          {quizState === "idle" && (
            <button onClick={startQuiz} className="btn-primary">
              Discover Your Type →
            </button>
          )}

          {quizState === "done" && (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              {!resultSaved && (
                <button
                  onClick={handleSaveResult}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "0.75rem 1.75rem",
                    background: "oklch(65% 0.15 45)",
                    color: "oklch(14% 0.08 260)",
                    border: "none",
                    cursor: isPending ? "wait" : "pointer",
                    opacity: isPending ? 0.7 : 1,
                  }}
                >
                  {isPending ? "Saving…" : "Save to Team Dashboard →"}
                </button>
              )}
              {resultSaved && (
                <Link
                  href="/dashboard?tab=team"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    color: "oklch(72% 0.14 145)",
                  }}
                >
                  ✓ Saved to Dashboard
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
              <button
                onClick={retake}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: "oklch(55% 0.04 260)",
                  border: "1px solid oklch(35% 0.04 260)",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                }}
              >
                Retake
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── RESULTS (when done) ── */}
      {quizState === "done" && (
        <div
          className="container-wide"
          style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)" }}
        >
          {/* Primary type overview */}
          <div
            style={{
              background: primaryType.colorVeryLight,
              padding: "2rem",
              marginBottom: "2.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: primaryType.color,
                marginBottom: "0.75rem",
              }}
            >
              Your Type
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(48% 0.14 145)",
                    marginBottom: "0.625rem",
                  }}
                >
                  Team Strengths
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {primaryType.teamStrengths.map((s, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "0.625rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: "oklch(52% 0.14 145)",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: "0.1rem",
                        }}
                      >
                        ✓
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.875rem",
                          color: "oklch(28% 0.006 260)",
                          lineHeight: 1.5,
                        }}
                      >
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(52% 0.18 25)",
                    marginBottom: "0.625rem",
                  }}
                >
                  Under Stress
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    color: "oklch(28% 0.006 260)",
                    lineHeight: 1.65,
                  }}
                >
                  {primaryType.stressBehaviour}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: primaryType.color,
                    marginTop: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Working with This Type
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    color: "oklch(28% 0.006 260)",
                    lineHeight: 1.65,
                  }}
                >
                  {primaryType.workingWith}
                </p>
              </div>
            </div>

            {wingDesc && (
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.82rem",
                  color: "oklch(40% 0.008 260)",
                  lineHeight: 1.65,
                  maxWidth: "60ch",
                }}
              >
                <strong
                  style={{ fontWeight: 700, color: primaryType.color }}
                >
                  Wing —{" "}
                </strong>
                {wingDesc}
              </p>
            )}

            {/* Team message */}
            <div
              style={{
                background: "oklch(22% 0.08 260)",
                padding: "1.25rem 1.5rem",
                borderLeft: `3px solid ${primaryType.color}`,
                marginTop: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "oklch(80% 0.04 260)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Knowing your type is step one. Knowing your teammate&rsquo;s type is step two. Using that knowledge with grace is the whole point.
              </p>
            </div>
          </div>

          {/* Score profile */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(52% 0.008 260)",
                marginBottom: "1.25rem",
              }}
            >
              Your Score Profile
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
            >
              {sortedTypes.map((t) => {
                const score = scores[String(t.number)] ?? 0;
                const pct = Math.round((score / maxPossible) * 100);
                const isPrimary = t.number === primaryType.number;
                return (
                  <div
                    key={t.number}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        flexShrink: 0,
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        fontWeight: isPrimary ? 800 : 500,
                        color: isPrimary ? t.color : "oklch(52% 0.008 260)",
                        textAlign: "right",
                      }}
                    >
                      {t.number}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "oklch(90% 0.005 80)",
                        height: "6px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          right: `${100 - pct}%`,
                          background: isPrimary
                            ? t.color
                            : "oklch(72% 0.008 260)",
                          transition:
                            "right 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: "80px",
                        flexShrink: 0,
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.68rem",
                        fontWeight: isPrimary ? 700 : 400,
                        color: isPrimary ? t.color : "oklch(55% 0.008 260)",
                      }}
                    >
                      {t.name.replace("The ", "")}
                    </div>
                    <div
                      style={{
                        width: "32px",
                        flexShrink: 0,
                        textAlign: "right",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.68rem",
                        fontWeight: isPrimary ? 700 : 400,
                        color: isPrimary ? t.color : "oklch(58% 0.008 260)",
                      }}
                    >
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save prompt for non-auth */}
          {!user && (
            <div
              style={{
                background: "oklch(97% 0.005 80)",
                padding: "1.5rem 2rem",
                outline: "1px solid oklch(88% 0.006 80)",
                marginBottom: "2.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9rem",
                  color: "oklch(30% 0.008 260)",
                  marginBottom: "1rem",
                  lineHeight: 1.65,
                }}
              >
                Sign in to save your Enneagram type to your team dashboard.
              </p>
              <Link
                href="/membership"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  padding: "0.7rem 1.5rem",
                  background: "oklch(22% 0.08 260)",
                  color: "oklch(97% 0.005 80)",
                  display: "inline-block",
                }}
              >
                Sign in to Save →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── CONTENT SECTIONS (idle / active) ── */}
      {quizState !== "done" && (
        <>
          {/* ── SECTION 1: The 9 Types and What They Bring ── */}
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
                Section 1
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
                The 9 Types and What They Bring to Teams
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
                Every type has something essential to offer. The most effective teams
                aren&rsquo;t homogeneous — they have diversity of motivation, not just
                diversity of background.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {TYPES.map((t) => (
                  <div
                    key={t.number}
                    style={{
                      background: t.colorVeryLight,
                      padding: "1.25rem",
                      display: "flex",
                      gap: "0.875rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: t.color,
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: "white",
                      }}
                    >
                      {t.number}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "oklch(22% 0.005 260)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.75rem",
                          color: "oklch(44% 0.008 260)",
                          lineHeight: 1.5,
                        }}
                      >
                        {t.tagline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 2: Type Dynamics ── */}
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
                  Section 2
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
                  Type Dynamics — Who Works Well Together, Who Creates Friction
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
                  Understanding type dynamics doesn&rsquo;t mean predetermining
                  relationships. It means knowing where to expect friction — and
                  approaching it with curiosity rather than judgment.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  {TYPE_DYNAMICS.map((d, i) => (
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
                          fontSize: "0.78rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "oklch(65% 0.15 45)",
                          marginBottom: "0.375rem",
                        }}
                      >
                        Types {d.pair}
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
                        {d.dynamic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: Stress Behaviours ── */}
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
                Section 3
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  lineHeight: 1.15,
                  color: "oklch(97% 0.005 80)",
                  marginBottom: "0.75rem",
                }}
              >
                Stress Behaviours — What Each Type Looks Like Under Pressure
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  color: "oklch(62% 0.04 260)",
                  maxWidth: "60ch",
                  marginBottom: "3rem",
                }}
              >
                Cross-cultural teams often experience stress behaviour without knowing
                that&rsquo;s what it is. When you understand your teammate&rsquo;s
                stress pattern, you stop taking it personally and start responding
                with grace.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1px",
                  background: "oklch(30% 0.10 260 / 0.5)",
                }}
              >
                {TYPES.map((t) => (
                  <div
                    key={t.number}
                    style={{
                      background: "oklch(26% 0.10 260)",
                      padding: "1.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "0.875rem",
                      }}
                    >
                      <span
                        style={{
                          width: "26px",
                          height: "26px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: t.color,
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          color: "white",
                        }}
                      >
                        {t.number}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "oklch(97% 0.005 80)",
                          margin: 0,
                        }}
                      >
                        {t.name}
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.8125rem",
                        lineHeight: 1.65,
                        color: "oklch(70% 0.04 260)",
                        margin: 0,
                      }}
                    >
                      {t.stressBehaviour}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 4: Using Enneagram Without Weaponising It ── */}
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
                  Section 4
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
                  How to Use the Enneagram Without Weaponising It
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
                  The Enneagram is a tool for compassion, not a label for dismissal.
                  &ldquo;You&rsquo;re just being a typical 8&rdquo; is not insight —
                  it&rsquo;s reduction. The point is to understand, not to explain away.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {[
                    {
                      rule: "Use it for yourself first",
                      body: "Before applying the Enneagram to others, use it to understand your own defaults. What do you do when you're stressed? What does your best self look like?",
                    },
                    {
                      rule: "Never use type to excuse behaviour",
                      body: "\"I can't help it — I'm a 1\" is a misuse. Type describes a pattern, not a permission. Growth is always possible.",
                    },
                    {
                      rule: "Use it to generate questions, not conclusions",
                      body: "\"I wonder if they're feeling unappreciated right now\" is helpful. \"They're a 2 so that's why they're being passive-aggressive\" is not.",
                    },
                    {
                      rule: "Introduce it voluntarily, not mandatorily",
                      body: "In many cultures, typing yourself publicly feels deeply vulnerable. Create safety before asking people to share their type in a group context.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: "oklch(22% 0.08 260)",
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
                        {item.rule}
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

          {/* ── BIBLICAL ANCHOR ── */}
          <section
            style={{
              paddingBlock: "clamp(3rem, 5vw, 5rem)",
              background: "oklch(30% 0.12 260)",
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
                    color: "oklch(88% 0.006 80)",
                    marginBottom: "1rem",
                  }}
                >
                  &ldquo;I praise you because I am fearfully and wonderfully made;
                  your works are wonderful, I know that full well.&rdquo;
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
                  Psalm 139:14
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── QUIZ ── */}
      <section
        id="quiz-section"
        style={{
          paddingBlock: "clamp(4rem, 7vw, 7rem)",
          background: "oklch(97% 0.005 80)",
        }}
      >
        <div className="container-wide">
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
              Enneagram Assessment
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
              45 statements — about 8–10 minutes. Rate each on how much it describes
              you. Answer as you actually are, not as you want to be.
            </p>
          </div>

          {/* IDLE */}
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
                There are no right or wrong answers. The goal is self-awareness — and
                the insight to understand your teammates more deeply. Your result will
                be added to your team dashboard.
              </p>
              <button onClick={startQuiz} className="btn-primary">
                Start Assessment →
              </button>
            </div>
          )}

          {/* ACTIVE */}
          {quizState === "active" && currentQuestion && (
            <div style={{ maxWidth: "640px" }}>
              {/* Progress */}
              <div style={{ marginBottom: "2.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.625rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "oklch(52% 0.008 260)",
                    }}
                  >
                    Question {currentIdx + 1} of {QUESTION_ORDER.length}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "oklch(65% 0.15 45)",
                    }}
                  >
                    {progressPct}%
                  </span>
                </div>
                <div
                  style={{ height: "3px", background: "oklch(88% 0.006 80)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPct}%`,
                      background: "oklch(65% 0.15 45)",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>

              {/* Statement */}
              <div style={{ marginBottom: "2.5rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "oklch(65% 0.15 45)",
                    marginBottom: "1rem",
                  }}
                >
                  How much does this describe you?
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 500,
                    fontSize: "1.0625rem",
                    color: "oklch(18% 0.005 260)",
                    lineHeight: 1.65,
                  }}
                >
                  &ldquo;{currentQuestion.text}&rdquo;
                </p>
              </div>

              {/* Likert scale */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                  marginBottom: "2rem",
                }}
              >
                {SCALE_LABELS.map((label, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleAnswer(value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.875rem 1.25rem",
                        background: "white",
                        border: "1.5px solid oklch(86% 0.006 80)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color 0.15s ease, background 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "oklch(65% 0.15 45)";
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "oklch(99% 0.015 50)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "oklch(86% 0.006 80)";
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "white";
                      }}
                    >
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "oklch(93% 0.005 80)",
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "oklch(45% 0.008 260)",
                        }}
                      >
                        {value}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.9rem",
                          fontWeight: 400,
                          color: "oklch(25% 0.006 260)",
                        }}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Back */}
              {currentIdx > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    background: "none",
                    border: "none",
                    color: "oklch(55% 0.008 260)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  ← Back
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      {quizState !== "active" && (
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
              Understanding is just the beginning.
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
              The Enneagram gives you a language for the invisible things that drive
              your team. Use it to build bridges — not to box people in.
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
      )}
    </>
  );
}
