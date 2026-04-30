"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { save16PersonalitiesTeamResult } from "./actions";

// ── QUESTIONS (same as personal 16P, 5-point scale) ───────────────────────────

const QUESTIONS: { text: string; d: string; dir: "A" | "B" }[] = [
  // E/I — Energy Direction
  { text: "I feel energised after spending time with a large group of people.", d: "EI", dir: "A" },
  { text: "I find it easy to introduce myself to strangers at social events.", d: "EI", dir: "A" },
  { text: "I think better when talking things through with others.", d: "EI", dir: "A" },
  { text: "I enjoy being the centre of attention in social situations.", d: "EI", dir: "A" },
  { text: "I prefer to process my thoughts by talking rather than reflecting in silence.", d: "EI", dir: "A" },
  { text: "After a long week, being around friends and people replenishes my energy.", d: "EI", dir: "A" },
  { text: "I am talkative and expressive — people say they always know what I'm thinking.", d: "EI", dir: "A" },
  { text: "After social interaction, I need quiet time alone to recharge.", d: "EI", dir: "B" },
  { text: "I prefer deep one-on-one conversations over large group discussions.", d: "EI", dir: "B" },
  { text: "I think carefully before I speak and often prefer to express myself in writing.", d: "EI", dir: "B" },
  { text: "I feel drained after prolonged social interaction, even when it went well.", d: "EI", dir: "B" },
  { text: "I prefer to work through ideas in my own head before discussing them.", d: "EI", dir: "B" },
  { text: "I have a small circle of close friends rather than a large network.", d: "EI", dir: "B" },
  { text: "I need significant alone time to feel at my best.", d: "EI", dir: "B" },
  { text: "I observe situations carefully before stepping in.", d: "EI", dir: "B" },
  // S/N — Information Processing
  { text: "I prefer concrete facts and practical details over abstract theories.", d: "SN", dir: "A" },
  { text: "I trust what I can observe, experience, and verify in the real world.", d: "SN", dir: "A" },
  { text: "I prefer to learn through hands-on experience rather than theoretical concepts.", d: "SN", dir: "A" },
  { text: "I focus on what is — the current reality — more than what could be.", d: "SN", dir: "A" },
  { text: "I am good at noticing practical details others often miss.", d: "SN", dir: "A" },
  { text: "I prefer clear, step-by-step instructions over general principles.", d: "SN", dir: "A" },
  { text: "I tend to build on what already works rather than reinventing from scratch.", d: "SN", dir: "A" },
  { text: "I am drawn to exploring patterns, possibilities, and future potential.", d: "SN", dir: "B" },
  { text: "I enjoy thinking about abstract ideas and hypothetical scenarios.", d: "SN", dir: "B" },
  { text: "I often have hunches or insights I can't fully explain logically.", d: "SN", dir: "B" },
  { text: "I find routine and repetition draining — I need novelty and new challenges.", d: "SN", dir: "B" },
  { text: "I am more excited by future possibilities than present realities.", d: "SN", dir: "B" },
  { text: "I enjoy reading between the lines and seeing deeper meaning in things.", d: "SN", dir: "B" },
  { text: "I am energised by big-picture thinking and visionary discussions.", d: "SN", dir: "B" },
  { text: "I often trust my instincts over hard data when making decisions.", d: "SN", dir: "B" },
  // T/F — Decision Making
  { text: "When making a decision, I prioritise logic and consistency over personal feelings.", d: "TF", dir: "A" },
  { text: "I believe it is more important to be honest than tactful.", d: "TF", dir: "A" },
  { text: "I am comfortable challenging someone's reasoning even if it creates conflict.", d: "TF", dir: "A" },
  { text: "I make decisions based primarily on objective analysis rather than gut feeling.", d: "TF", dir: "A" },
  { text: "I value competence and effectiveness above harmony in a working environment.", d: "TF", dir: "A" },
  { text: "I am not easily swayed by emotion when I believe the facts point in a clear direction.", d: "TF", dir: "A" },
  { text: "I prefer to critique an idea directly rather than soften my feedback.", d: "TF", dir: "A" },
  { text: "When making decisions, I am strongly influenced by how they will affect the people involved.", d: "TF", dir: "B" },
  { text: "I naturally sense the emotional atmosphere in a room and respond to it.", d: "TF", dir: "B" },
  { text: "I find it difficult to make decisions that I know will hurt someone I care about.", d: "TF", dir: "B" },
  { text: "I am more concerned with maintaining harmony than winning an argument.", d: "TF", dir: "B" },
  { text: "I give significant weight to personal values and convictions when deciding.", d: "TF", dir: "B" },
  { text: "I often deliver feedback in a way that first considers the other person's feelings.", d: "TF", dir: "B" },
  { text: "A decision that is logically correct but deeply harms someone feels wrong to me.", d: "TF", dir: "B" },
  { text: "I find meaning through interpersonal connection more than through intellectual clarity.", d: "TF", dir: "B" },
  // J/P — Lifestyle Orientation
  { text: "I prefer to have a clear plan and feel unsettled when things are up in the air.", d: "JP", dir: "A" },
  { text: "I like to make decisions and move forward rather than keeping options open.", d: "JP", dir: "A" },
  { text: "I find it satisfying to complete tasks and check things off my list.", d: "JP", dir: "A" },
  { text: "I organise my time carefully and dislike being late or unprepared.", d: "JP", dir: "A" },
  { text: "Deadlines give me structure; I feel uncomfortable leaving things to the last minute.", d: "JP", dir: "A" },
  { text: "I prefer a structured, organised environment over a flexible, spontaneous one.", d: "JP", dir: "A" },
  { text: "I like to settle important matters and move on rather than leave them open-ended.", d: "JP", dir: "A" },
  { text: "I prefer to keep my options open rather than commit to a fixed plan too early.", d: "JP", dir: "B" },
  { text: "I work well under pressure and often produce my best work close to a deadline.", d: "JP", dir: "B" },
  { text: "I find rigid plans and structures constraining — I prefer to stay flexible.", d: "JP", dir: "B" },
  { text: "I enjoy spontaneity and am comfortable adapting as I go.", d: "JP", dir: "B" },
  { text: "I prefer to gather more information before committing to a decision.", d: "JP", dir: "B" },
  { text: "I am comfortable with ambiguity and see it as full of possibility.", d: "JP", dir: "B" },
  { text: "I tend to start multiple projects simultaneously and enjoy the variety.", d: "JP", dir: "B" },
  { text: "I resist being boxed in — I like to respond to what emerges rather than pre-plan everything.", d: "JP", dir: "B" },
];

// Round-robin: EI1, SN1, TF1, JP1, EI2, SN2, ...
const QUESTION_ORDER: number[] = [];
const byDichotomy: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] };
QUESTIONS.forEach((q, i) => byDichotomy[q.d].push(i));
for (let r = 0; r < 15; r++) {
  for (const d of ["EI", "SN", "TF", "JP"]) {
    const idx = byDichotomy[d][r];
    if (idx !== undefined) QUESTION_ORDER.push(idx);
  }
}

const SCALE_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

const TYPE_DATA: Record<string, {
  name: string; subtitle: string; temperament: string;
  color: string; colorLight: string; bg: string;
  teamContribution: string; teamStrengths: string[]; teamCaution: string;
}> = {
  INTJ: {
    name: "INTJ", subtitle: "The Architect", temperament: "Analyst",
    color: "oklch(48% 0.20 260)", colorLight: "oklch(62% 0.14 260)", bg: "oklch(16% 0.16 260)",
    teamContribution: "Strategic clarity. INTJs see the system behind the problem and bring long-range vision to team planning.",
    teamStrengths: ["Long-range strategic thinking", "Independent and decisive", "Holds team to high intellectual standards", "Sees systemic patterns others miss"],
    teamCaution: "Can be perceived as cold or dismissive. Needs to invest in relational trust alongside strategic output.",
  },
  INTP: {
    name: "INTP", subtitle: "The Logician", temperament: "Analyst",
    color: "oklch(48% 0.18 240)", colorLight: "oklch(62% 0.13 240)", bg: "oklch(16% 0.14 240)",
    teamContribution: "Analytical depth. INTPs solve the complex problems others give up on, and they do it with unusual originality.",
    teamStrengths: ["Deep analytical problem-solving", "Original and creative thinking", "Sees complexity and nuance", "Objective and unbiased"],
    teamCaution: "May struggle with follow-through and communication. Needs a delivery partner.",
  },
  ENTJ: {
    name: "ENTJ", subtitle: "The Commander", temperament: "Analyst",
    color: "oklch(50% 0.22 25)", colorLight: "oklch(63% 0.17 25)", bg: "oklch(17% 0.16 25)",
    teamContribution: "Executive force. ENTJs drive teams toward ambitious goals with decisive leadership and clear expectations.",
    teamStrengths: ["Decisive and action-oriented", "Exceptional strategic planning", "Energises teams with vision", "Builds systems that deliver results"],
    teamCaution: "Can dominate and push too hard. Needs to slow down for relational and cross-cultural dynamics.",
  },
  ENTP: {
    name: "ENTP", subtitle: "The Debater", temperament: "Analyst",
    color: "oklch(58% 0.20 45)", colorLight: "oklch(70% 0.15 45)", bg: "oklch(17% 0.14 45)",
    teamContribution: "Creative challenger. ENTPs keep teams honest and generative — they will challenge every assumption.",
    teamStrengths: ["Highly creative and generative", "Comfortable challenging the status quo", "Quick, adaptive thinker", "Thrives in complex environments"],
    teamCaution: "More interested in starting than finishing. Can argue for its own sake. Needs a delivery partner.",
  },
  INFJ: {
    name: "INFJ", subtitle: "The Advocate", temperament: "Diplomat",
    color: "oklch(48% 0.22 295)", colorLight: "oklch(62% 0.17 295)", bg: "oklch(15% 0.18 295)",
    teamContribution: "Quiet visionary. INFJs read people and situations with unusual depth and hold the team to its purpose.",
    teamStrengths: ["Deep insight into people and dynamics", "Long-range visionary thinking", "Strong values and integrity", "Deeply empathetic"],
    teamCaution: "Can absorb too much emotional weight. Needs permission to lead with clarity and confidence.",
  },
  INFP: {
    name: "INFP", subtitle: "The Mediator", temperament: "Diplomat",
    color: "oklch(52% 0.18 10)", colorLight: "oklch(65% 0.13 10)", bg: "oklch(16% 0.14 10)",
    teamContribution: "Values anchor. INFPs name it when the team drifts from what matters and bring deep authenticity to everything.",
    teamStrengths: ["Deep empathy and emotional attunement", "Strong personal values and integrity", "Creative and original", "Loyal to people and causes"],
    teamCaution: "Can struggle with assertiveness. Needs safety to speak clearly and permission to hold their ground.",
  },
  ENFJ: {
    name: "ENFJ", subtitle: "The Protagonist", temperament: "Diplomat",
    color: "oklch(52% 0.18 155)", colorLight: "oklch(65% 0.13 155)", bg: "oklch(16% 0.12 155)",
    teamContribution: "People developer. ENFJs invest deeply in everyone around them and build the kind of loyalty that sustains a team.",
    teamStrengths: ["Naturally inspiring and motivating", "Invests in others' growth", "Warm, clear communicator", "Builds genuine community"],
    teamCaution: "Can over-extend. May avoid necessary conflict. Needs to hold convictions under relational pressure.",
  },
  ENFP: {
    name: "ENFP", subtitle: "The Campaigner", temperament: "Diplomat",
    color: "oklch(60% 0.18 65)", colorLight: "oklch(72% 0.13 65)", bg: "oklch(17% 0.12 65)",
    teamContribution: "Energy source. ENFPs bring contagious enthusiasm, creative ideas, and genuine belief in the team's potential.",
    teamStrengths: ["Genuinely creative and visionary", "Highly enthusiastic and inspiring", "Deeply empathetic", "Sees possibilities others miss"],
    teamCaution: "Can start more than they finish. Needs structure and a delivery partner to make vision real.",
  },
  ISTJ: {
    name: "ISTJ", subtitle: "The Logistician", temperament: "Sentinel",
    color: "oklch(45% 0.14 215)", colorLight: "oklch(60% 0.10 215)", bg: "oklch(15% 0.11 215)",
    teamContribution: "Reliable anchor. ISTJs do what they say, prepare thoroughly, and build the trust others stand on.",
    teamStrengths: ["Exceptionally reliable and consistent", "Thorough and well-prepared", "Strong sense of duty", "Calm and steady under pressure"],
    teamCaution: "Can resist change. May be perceived as inflexible. Needs to develop comfort with ambiguity.",
  },
  ISFJ: {
    name: "ISFJ", subtitle: "The Protector", temperament: "Sentinel",
    color: "oklch(50% 0.16 185)", colorLight: "oklch(63% 0.12 185)", bg: "oklch(15% 0.12 185)",
    teamContribution: "Quiet backbone. ISFJs hold the team together behind the scenes — serving, noticing, and never asking for credit.",
    teamStrengths: ["Deeply caring and attentive", "Highly reliable and consistent", "Meticulous and detailed", "Builds genuine belonging"],
    teamCaution: "May go unrecognised. Can suppress their own perspective. Needs explicit invitation to share their voice.",
  },
  ESTJ: {
    name: "ESTJ", subtitle: "The Executive", temperament: "Sentinel",
    color: "oklch(48% 0.18 195)", colorLight: "oklch(62% 0.13 195)", bg: "oklch(15% 0.14 195)",
    teamContribution: "Order builder. ESTJs create structure, clarity, and consistency — teams know what to expect and can count on them.",
    teamStrengths: ["Exceptional organiser", "Clear, direct communication", "Highly dependable", "Creates order from complexity"],
    teamCaution: "Can be inflexible. May undervalue relational needs. Needs to build space for genuine input.",
  },
  ESFJ: {
    name: "ESFJ", subtitle: "The Consul", temperament: "Sentinel",
    color: "oklch(55% 0.18 35)", colorLight: "oklch(67% 0.13 35)", bg: "oklch(16% 0.13 35)",
    teamContribution: "Community builder. ESFJs make sure everyone feels included, valued, and cared for.",
    teamStrengths: ["Warm and genuinely caring", "Highly organised and reliable", "Builds community and belonging", "Responsive to others' needs"],
    teamCaution: "Can prioritise harmony over necessary truth. May struggle with productive conflict.",
  },
  ISTP: {
    name: "ISTP", subtitle: "The Virtuoso", temperament: "Explorer",
    color: "oklch(50% 0.15 145)", colorLight: "oklch(63% 0.11 145)", bg: "oklch(15% 0.11 145)",
    teamContribution: "Practical solver. ISTPs fix what is broken and stay calm when things go wrong.",
    teamStrengths: ["Exceptional practical problem-solving", "Calm and decisive under pressure", "Highly observant", "Efficient and direct"],
    teamCaution: "Can appear emotionally remote. Needs to communicate investment in people through words, not just action.",
  },
  ISFP: {
    name: "ISFP", subtitle: "The Adventurer", temperament: "Explorer",
    color: "oklch(55% 0.18 150)", colorLight: "oklch(67% 0.13 150)", bg: "oklch(16% 0.13 150)",
    teamContribution: "Authentic presence. ISFPs create safety and trust through genuine care and non-performative being.",
    teamStrengths: ["Deep empathy and attentiveness", "Creative and aesthetically sensitive", "Authentic and non-performative", "Loyal and present"],
    teamCaution: "Can be overlooked. Needs encouragement to claim their voice and assert their perspective.",
  },
  ESTP: {
    name: "ESTP", subtitle: "The Entrepreneur", temperament: "Explorer",
    color: "oklch(58% 0.20 55)", colorLight: "oklch(70% 0.15 55)", bg: "oklch(17% 0.14 55)",
    teamContribution: "Tactical driver. ESTPs move teams from analysis to action with speed and perceptive clarity.",
    teamStrengths: ["Fast, action-oriented decision-making", "Energetic and charismatic", "Excellent under pressure", "Highly perceptive in real-time"],
    teamCaution: "Can prioritise speed over depth. Needs to develop strategic patience and relational sensitivity.",
  },
  ESFP: {
    name: "ESFP", subtitle: "The Entertainer", temperament: "Explorer",
    color: "oklch(62% 0.20 48)", colorLight: "oklch(73% 0.15 48)", bg: "oklch(17% 0.14 48)",
    teamContribution: "Joy bringer. ESFPs make people want to show up and create cultures where everyone feels genuinely welcomed.",
    teamStrengths: ["Warm, generous, and genuinely caring", "Brings energy and joy to team culture", "Spontaneous and highly adaptable", "Makes people feel valued"],
    teamCaution: "Can avoid difficult decisions. Needs structure and follow-through discipline.",
  },
};

// ── TEMPERAMENT GROUPS ────────────────────────────────────────────────────────

const TEMPERAMENTS = [
  {
    name: "Analysts",
    types: ["INTJ", "INTP", "ENTJ", "ENTP"],
    color: "oklch(52% 0.22 260)",
    bg: "oklch(17% 0.14 260)",
    description: "Strategy, logic, and systems thinking. Analysts ask: is this logically sound, and will it work at scale? They are the team's intellectual engine — and their growth edge is ensuring the humans in the system remain central.",
    teamGift: "They ensure the team's thinking is rigorous and the plan will actually hold under pressure.",
  },
  {
    name: "Diplomats",
    types: ["INFJ", "INFP", "ENFJ", "ENFP"],
    color: "oklch(52% 0.20 145)",
    bg: "oklch(16% 0.12 145)",
    description: "Vision, empathy, and meaning. Diplomats ask: are we living our values, and are people genuinely flourishing? They are the team's moral and relational compass — and their growth edge is holding their convictions with enough conviction to act on them.",
    teamGift: "They ensure the team's purpose remains alive, and that people are seen as people, not just roles.",
  },
  {
    name: "Sentinels",
    types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    color: "oklch(50% 0.18 195)",
    bg: "oklch(16% 0.12 195)",
    description: "Reliability, structure, and community. Sentinels ask: are we prepared, are people cared for, and does the system work? They are the team's stability and backbone — and their growth edge is flexibility and comfort with necessary disruption.",
    teamGift: "They ensure the team actually delivers, that standards are maintained, and that no one is left behind.",
  },
  {
    name: "Explorers",
    types: ["ISTP", "ISFP", "ESTP", "ESFP"],
    color: "oklch(58% 0.18 45)",
    bg: "oklch(17% 0.12 45)",
    description: "Adaptability, practicality, and present-moment skill. Explorers ask: what is actually happening, and what can we do right now? They are the team's tactical and adaptive force — and their growth edge is strategic patience and long-range commitment.",
    teamGift: "They keep the team grounded in reality, respond brilliantly when things change, and bring energy that no other temperament matches.",
  },
];

// ── SCORING ───────────────────────────────────────────────────────────────────

function computeType(scores: Record<string, number>): { type: string; pcts: Record<string, number> } {
  const total = 15 * 5;
  const ePct = Math.round((scores.EI_A ?? 0) / total * 100);
  const sPct = Math.round((scores.SN_A ?? 0) / total * 100);
  const tPct = Math.round((scores.TF_A ?? 0) / total * 100);
  const jPct = Math.round((scores.JP_A ?? 0) / total * 100);
  const type = [
    ePct >= 50 ? "E" : "I",
    sPct >= 50 ? "S" : "N",
    tPct >= 50 ? "T" : "F",
    jPct >= 50 ? "J" : "P",
  ].join("");
  return {
    type,
    pcts: { E: ePct, I: 100 - ePct, S: sPct, N: 100 - sPct, T: tPct, F: 100 - tPct, J: jPct, P: 100 - jPct },
  };
}

const DICHOTOMY_LABELS = [
  { keyA: "E", keyB: "I", label: "Energy", descA: "Extraversion", descB: "Introversion", color: "oklch(60% 0.18 52)" },
  { keyA: "S", keyB: "N", label: "Information", descA: "Sensing", descB: "Intuition", color: "oklch(52% 0.22 280)" },
  { keyA: "T", keyB: "F", label: "Decisions", descA: "Thinking", descB: "Feeling", color: "oklch(50% 0.18 215)" },
  { keyA: "J", keyB: "P", label: "Structure", descA: "Judging", descB: "Perceiving", color: "oklch(50% 0.20 25)" },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

export default function Personalities16TeamClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    { EI_A: 0, EI_B: 0, SN_A: 0, SN_B: 0, TF_A: 0, TF_B: 0, JP_A: 0, JP_B: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; value: number; key: string }[]>([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ EI_A: 0, EI_B: 0, SN_A: 0, SN_B: 0, TF_A: 0, TF_B: 0, JP_A: 0, JP_B: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
    setSaveError(null);
    setQuizState("active");
    setTimeout(() => {
      document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleAnswer(value: number) {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const scoreKey = `${q.d}_${q.dir}`;
    setAnswerHistory(prev => [...prev, { qIdx, value, key: scoreKey }]);
    setScores(prev => ({ ...prev, [scoreKey]: (prev[scoreKey] ?? 0) + value }));
    if (currentIdx + 1 < QUESTION_ORDER.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizState("done");
      setTimeout(() => {
        document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }

  function handleBack() {
    if (currentIdx === 0) { setQuizState("idle"); return; }
    const last = answerHistory[answerHistory.length - 1];
    if (!last) return;
    setScores(prev => ({ ...prev, [last.key]: (prev[last.key] ?? 0) - last.value }));
    setAnswerHistory(prev => prev.slice(0, -1));
    setCurrentIdx(prev => prev - 1);
  }

  function handleSaveResult() {
    startTransition(async () => {
      const { type } = computeType(scores);
      const result = await save16PersonalitiesTeamResult(type, scores);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setResultSaved(true);
      }
    });
  }

  const progress = quizState === "active"
    ? Math.round((currentIdx / QUESTION_ORDER.length) * 100)
    : quizState === "done" ? 100 : 0;

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
              Team Assessment · 16 Personalities
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.14em",
              textTransform: "uppercase", color: "oklch(72% 0.04 260)",
            }}>
              10–12 min
            </span>
          </div>

          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "18ch" }}>
            16 Personalities<br />
            <span style={{ color: "oklch(65% 0.15 45)" }}>for Your Team</span>
          </h1>

          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "58ch", marginBottom: "2.5rem" }}>
            16 Personalities goes deeper than MBTI — it adds a fifth dimension (Identity: Assertive vs. Turbulent) that significantly shapes how people respond to pressure and feedback on a team.
          </p>

          <button onClick={startQuiz} className="btn-primary">
            Take the Assessment →
          </button>
        </div>
      </section>

      {/* ── SECTION 1: The Four Temperaments ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
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
            color: "oklch(22% 0.08 260)", marginBottom: "0.75rem",
          }}>
            The Four Temperaments
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
            color: "oklch(48% 0.008 260)", maxWidth: "60ch", marginBottom: "3rem",
          }}>
            The 16 types cluster into four temperament groups — each with a distinct contribution to team culture.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {TEMPERAMENTS.map(temp => (
              <div key={temp.name} style={{
                background: temp.bg,
                padding: "1.75rem",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: temp.color }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1rem",
                    color: temp.color, margin: 0,
                  }}>
                    {temp.name}
                  </p>
                  <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {temp.types.map(t => (
                      <span key={t} style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                        letterSpacing: "0.08em",
                        color: temp.color,
                        border: `1px solid ${temp.color}60`,
                        padding: "0.15rem 0.4rem",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7,
                  color: "oklch(80% 0.04 260)", marginBottom: "1rem",
                }}>
                  {temp.description}
                </p>
                <div style={{
                  borderTop: `1px solid ${temp.color}40`,
                  paddingTop: "0.875rem",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: temp.color, marginBottom: "0.375rem",
                  }}>
                    Team Gift
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6,
                    color: "oklch(65% 0.06 260)", margin: 0,
                  }}>
                    {temp.teamGift}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 2: The Assertive/Turbulent Dimension ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(22% 0.08 260)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
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
              color: "oklch(97% 0.005 80)", marginBottom: "1.5rem",
            }}>
              The Assertive / Turbulent Dimension
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.25rem",
            }}>
              This is the dimension that most affects how teammates respond to stress, criticism, and failure — and yet it is the one most often overlooked in team conversations.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                {
                  label: "Assertive (-A)",
                  color: "oklch(52% 0.18 155)",
                  points: [
                    "Calm under pressure — less reactive to criticism",
                    "Resilient after setbacks — moves on quickly",
                    "Confident in their abilities — less prone to self-doubt",
                    "Risk: may underestimate problems or miss signals",
                  ],
                },
                {
                  label: "Turbulent (-T)",
                  color: "oklch(58% 0.20 45)",
                  points: [
                    "High standards — driven by the desire to improve",
                    "More sensitive to feedback — takes criticism seriously",
                    "More attuned to risk — less likely to miss what's going wrong",
                    "Risk: may over-respond to criticism or carry stress longer",
                  ],
                },
              ].map(item => (
                <div key={item.label} style={{
                  background: "oklch(28% 0.10 260)", padding: "1.25rem",
                  borderTop: `3px solid ${item.color}`,
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
                    color: item.color, marginBottom: "0.75rem",
                  }}>
                    {item.label}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {item.points.map((pt, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                        <span style={{ color: item.color, fontSize: "0.65rem", marginTop: "0.25rem", flexShrink: 0 }}>▸</span>
                        <p style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.55,
                          color: "oklch(72% 0.04 260)", margin: 0,
                        }}>
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "oklch(30% 0.12 260)", padding: "1.5rem 2rem",
              borderLeft: "3px solid oklch(65% 0.15 45)",
              marginBottom: "1.25rem",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                color: "oklch(80% 0.04 260)", margin: 0,
              }}>
                On a cross-cultural team, the Assertive/Turbulent dimension intersects with cultural norms around face, harmony, and hierarchy. A Turbulent type from a high-context culture may carry criticism internally for much longer than their Assertive counterpart — and never name it. Leaders need to read both the type and the culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Building Teams That Draw on All Temperaments ── */}
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
              Building Teams That Draw on All Temperaments
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.5rem",
            }}>
              Most teams are temperament-homogeneous — not by design, but by gravity. Leaders hire people who think like them. Teams attract people who fit their culture. The result is a team that is fast, confident, and blind in the same direction.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  title: "Make your temperament mix visible",
                  body: "Have each team member share their type. Map the temperaments. What's over-represented? What's missing? This conversation alone generates insight.",
                },
                {
                  title: "Design your meetings for your mix",
                  body: "Analyst-heavy teams need structure and logic. Diplomat-heavy teams need purpose and people-connection. Sentinel-heavy teams need preparation time. Explorer-heavy teams need energy and action.",
                },
                {
                  title: "Name the missing voice",
                  body: "When a temperament is absent, create space for it. Ask: who is thinking about people here? Who is thinking about what's actually practical? Who is thinking about what could go wrong?",
                },
                {
                  title: "Watch for temperament clash",
                  body: "Analysts and Diplomats can frustrate each other. Sentinels and Explorers can frustrate each other. Name the tension — don't pathologise it. The teams that hold this tension produce the best work.",
                },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "oklch(22% 0.10 260)", padding: "1.25rem 1.5rem",
                  borderLeft: "3px solid oklch(65% 0.15 45)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
                    color: "oklch(97% 0.005 80)", marginBottom: "0.5rem",
                  }}>
                    {item.title}
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

      {/* ── SECTION 4: Cross-Cultural Caution + Biblical ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
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
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              Different Gifts — One Body
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.25rem",
            }}>
              Personality frameworks are lenses, not cages. They reveal preferences — not destiny. The goal of understanding your team&rsquo;s 16 Personalities profile is not to sort people into boxes, but to create the conditions where different ways of thinking can contribute fully.
            </p>
            <div style={{
              background: "oklch(22% 0.08 260)", padding: "1.5rem 2rem",
              borderLeft: "3px solid oklch(65% 0.15 45)",
              marginBottom: "1.5rem",
            }}>
              <p style={{
                fontFamily: "var(--font-cormorant)", fontStyle: "italic",
                fontSize: "1.125rem", lineHeight: 1.7,
                color: "oklch(88% 0.006 80)", marginBottom: "0.75rem",
              }}>
                &ldquo;We have different gifts, according to the grace given to each of us.&rdquo;
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.75rem",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "oklch(62% 0.08 45)", margin: 0,
              }}>
                Romans 12:6
              </p>
            </div>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)",
            }}>
              The most effective teams we work with are not temperament-homogeneous. They are teams that have learned to hold their differences as a resource — knowing that the Analyst&rsquo;s rigour, the Diplomat&rsquo;s care, the Sentinel&rsquo;s reliability, and the Explorer&rsquo;s adaptability are all needed in the work.
            </p>
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section id="quiz-section" style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(22% 0.08 260)",
      }}>
        <div className="container-wide">
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Team Assessment
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(97% 0.005 80)", marginBottom: "0.875rem",
            }}>
              16 Personalities Assessment
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
              color: "oklch(72% 0.04 260)", maxWidth: "56ch",
            }}>
              60 questions. Rate each statement from 1 (strongly disagree) to 5 (strongly agree). Answer based on how you naturally are — not how you think you should be.
            </p>
          </div>

          {/* IDLE */}
          {quizState === "idle" && (
            <div style={{ background: "oklch(28% 0.10 260)", padding: "3rem 2.5rem", maxWidth: "600px" }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.75,
                color: "oklch(80% 0.04 260)", marginBottom: "2rem",
              }}>
                There are no right or wrong types. Every type contributes something unique to a team. The more honest your answers, the more useful your result will be to yourself and to your team.
              </p>
              <button onClick={startQuiz} className="btn-primary">
                Start Assessment →
              </button>
            </div>
          )}

          {/* ACTIVE */}
          {quizState === "active" && (() => {
            const qIdx = QUESTION_ORDER[currentIdx];
            const q = QUESTIONS[qIdx];
            const dichotomy = DICHOTOMY_LABELS.find(d =>
              d.label === (q.d === "EI" ? "Energy" : q.d === "SN" ? "Information" : q.d === "TF" ? "Decisions" : "Structure")
            ) ?? DICHOTOMY_LABELS[0];

            return (
              <div style={{ maxWidth: "640px" }}>
                {/* Progress */}
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
                      Question {currentIdx + 1} of {QUESTION_ORDER.length}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.04 260)", margin: 0 }}>
                      {progress}%
                    </p>
                  </div>
                  <div style={{ height: "4px", background: "oklch(15% 0.06 260)", position: "relative", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: `${progress}%`,
                      background: dichotomy.color,
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>

                <p style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.65rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: dichotomy.color, marginBottom: "1.25rem",
                }}>
                  {dichotomy.label}: {dichotomy.descA} vs {dichotomy.descB}
                </p>

                {/* Statement */}
                <div style={{
                  background: "oklch(28% 0.10 260)", padding: "2rem",
                  marginBottom: "1rem",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 600,
                    fontSize: "clamp(1rem, 2vw, 1.125rem)", lineHeight: 1.55,
                    color: "oklch(97% 0.005 80)", margin: 0,
                  }}>
                    {q.text}
                  </p>
                </div>

                {/* Scale buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "4px", marginBottom: "1.25rem" }}>
                  {SCALE_LABELS.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i + 1)}
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        padding: "0.875rem 0.25rem",
                        background: "oklch(28% 0.10 260)",
                        color: "oklch(88% 0.006 80)",
                        border: "none", cursor: "pointer",
                        textAlign: "center",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "0.4rem",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = `${dichotomy.color}30`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "oklch(28% 0.10 260)";
                      }}
                    >
                      <span style={{ fontWeight: 800, fontSize: "1.25rem", color: dichotomy.color, lineHeight: 1 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.04em", color: "oklch(55% 0.04 260)", lineHeight: 1.3 }}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleBack}
                  style={{
                    background: "transparent", border: "none",
                    fontFamily: "var(--font-montserrat)", fontSize: "0.8rem",
                    color: "oklch(55% 0.04 260)", cursor: "pointer", padding: "0.5rem 0",
                  }}
                >
                  ← Back
                </button>
              </div>
            );
          })()}

          {/* DONE */}
          {quizState === "done" && (() => {
            const { type, pcts } = computeType(scores);
            const typeData = TYPE_DATA[type] ?? TYPE_DATA.ENFP;
            const tempData = TEMPERAMENTS.find(t => t.types.includes(type));

            return (
              <div style={{ maxWidth: "680px" }}>
                {/* Result card */}
                <div style={{
                  background: typeData.bg,
                  padding: "2.5rem",
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: "1.5rem",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: typeData.color }} />

                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: typeData.color, marginBottom: "0.75rem",
                  }}>
                    Your 16 Personalities Type
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 800,
                      fontSize: "clamp(3rem, 8vw, 4.5rem)", color: typeData.colorLight, lineHeight: 1,
                    }}>
                      {type}
                    </span>
                    <div>
                      <p style={{
                        fontFamily: "var(--font-montserrat)", fontWeight: 800,
                        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                        color: "oklch(97% 0.005 80)", margin: 0, lineHeight: 1.2,
                      }}>
                        {typeData.subtitle}
                      </p>
                      {tempData && (
                        <p style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.75rem",
                          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                          color: typeData.colorLight, margin: 0, marginTop: "0.25rem",
                        }}>
                          {tempData.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                    color: "oklch(82% 0.04 260)", marginBottom: "1.5rem",
                  }}>
                    {typeData.teamContribution}
                  </p>

                  {/* Team strengths */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: typeData.color, marginBottom: "0.625rem",
                    }}>
                      Team Strengths
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {typeData.teamStrengths.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                          <span style={{ color: typeData.color, fontSize: "0.7rem", marginTop: "0.2rem", flexShrink: 0 }}>+</span>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.5, color: "oklch(80% 0.04 260)", margin: 0 }}>
                            {s}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Caution */}
                  <div style={{
                    background: "oklch(14% 0.06 260 / 0.5)", padding: "1rem 1.25rem",
                    borderLeft: `3px solid ${typeData.color}`,
                  }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "oklch(65% 0.04 260)", marginBottom: "0.4rem",
                    }}>
                      Team Caution
                    </p>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6,
                      color: "oklch(65% 0.04 260)", margin: 0,
                    }}>
                      {typeData.teamCaution}
                    </p>
                  </div>
                </div>

                {/* Dimension bars */}
                <div style={{ background: "oklch(28% 0.10 260)", padding: "1.75rem", marginBottom: "1.5rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "oklch(55% 0.04 260)", marginBottom: "1rem",
                  }}>
                    Dimension Profile
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {DICHOTOMY_LABELS.map(d => {
                      const pctA = pcts[d.keyA] ?? 50;
                      const pctB = 100 - pctA;
                      return (
                        <div key={d.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 600, color: d.color }}>
                              {d.descA} {pctA}%
                            </span>
                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(50% 0.04 260)" }}>
                              {d.descB} {pctB}%
                            </span>
                          </div>
                          <div style={{ height: "6px", background: "oklch(15% 0.06 260)", position: "relative", overflow: "hidden" }}>
                            <div style={{
                              position: "absolute", left: 0, top: 0, bottom: 0,
                              width: `${pctA}%`,
                              background: d.color,
                              transition: "width 0.4s ease",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team message */}
                <div style={{ background: "oklch(28% 0.10 260)", padding: "1.5rem 2rem", marginBottom: "1.5rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                    color: "oklch(82% 0.04 260)", margin: 0,
                  }}>
                    Your full personality profile — not just type, but identity — is now part of your team&rsquo;s picture. Use it to understand, not to box in.
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={startQuiz}
                    style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      padding: "0.7rem 1.5rem",
                      background: "transparent", color: "oklch(62% 0.04 260)",
                      border: "1.5px solid oklch(38% 0.06 260)",
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
                        background: isPending ? "oklch(40% 0.10 260)" : typeData.color,
                        color: "oklch(97% 0.005 80)",
                        border: "none", cursor: isPending ? "wait" : "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      {isPending ? "Saving…" : "Save to Team Dashboard →"}
                    </button>
                  )}

                  {user && resultSaved && (
                    <Link href="/dashboard?tab=team" style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                      letterSpacing: "0.06em", textDecoration: "none",
                      color: "oklch(72% 0.14 145)",
                      display: "inline-flex", alignItems: "center", gap: "0.375rem",
                    }}>
                      ✓ Saved to Team Dashboard
                    </Link>
                  )}

                  {!user && (
                    <Link href="/signup" style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                      letterSpacing: "0.06em", textDecoration: "none",
                      padding: "0.7rem 1.5rem",
                      background: "transparent", color: "oklch(78% 0.04 260)",
                      border: "1.5px solid oklch(42% 0.008 260)",
                    }}>
                      Sign In to Save →
                    </Link>
                  )}

                  {saveError && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(65% 0.20 30)", margin: 0 }}>
                      {saveError}
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
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
            Your team is more complex than any framework.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
            color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem",
          }}>
            Have your whole team take this assessment. Map your temperament mix. Use it to name the tensions — and draw on what each type brings. This is not a tool for sorting people. It&rsquo;s a tool for seeing them more clearly.
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
          </div>
        </div>
      </section>
    </>
  );
}
