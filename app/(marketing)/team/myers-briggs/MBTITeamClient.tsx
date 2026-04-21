"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveMBTITeamResult } from "./actions";

// ── QUIZ DATA (same questions & scoring as personal MBTI) ─────────────────────

const QUESTIONS: { d: string; a: string; b: string }[] = [
  // E / I
  { d: "EI", a: "You feel energised after a lively social gathering.", b: "You feel drained after a lively social gathering, even a good one." },
  { d: "EI", a: "You tend to think out loud — talking helps you work things out.", b: "You prefer to think privately first, then share once you've processed." },
  { d: "EI", a: "You prefer to have several projects and social commitments running simultaneously.", b: "You prefer fewer commitments with room for depth and solitude." },
  { d: "EI", a: "In meetings, you speak up early and often.", b: "In meetings, you listen carefully and speak when you have something well-formed to say." },
  { d: "EI", a: "You meet new people with ease and enjoy the experience.", b: "Meeting many new people in a short time is draining for you." },
  { d: "EI", a: "You feel most alive when surrounded by activity and people.", b: "You feel most alive in quiet moments of reflection or deep one-on-one connection." },
  { d: "EI", a: "You would rather discuss a problem with others than think through it alone.", b: "You would rather think through a problem alone and then consult others." },
  { d: "EI", a: "You recharge by going out and being with people.", b: "You recharge by spending time at home or alone." },
  { d: "EI", a: "You have a wide circle of friends and enjoy maintaining many relationships.", b: "You have a small number of deep friendships you invest in fully." },
  { d: "EI", a: "Action and engagement feel more natural than reflection and observation.", b: "Observation and reflection feel more natural than immediate action." },
  // S / N
  { d: "SN", a: "You prefer dealing with concrete facts and practical details.", b: "You prefer exploring patterns, meanings, and future possibilities." },
  { d: "SN", a: "You trust experience and what you can directly observe more than theory.", b: "You trust intuition and insight even when you can't fully explain your reasoning." },
  { d: "SN", a: "You focus on what is — the present situation as it actually exists.", b: "You focus on what could be — future possibilities and scenarios." },
  { d: "SN", a: "You prefer step-by-step instructions and clear, tested methods.", b: "You prefer to understand principles and find your own way to apply them." },
  { d: "SN", a: "You notice precise details and remember them accurately.", b: "You notice patterns and connections across multiple situations." },
  { d: "SN", a: "You are energised by working with established systems and improving what already works.", b: "You are energised by reimagining how things could work if you started from scratch." },
  { d: "SN", a: "You prefer familiar approaches over untested innovations.", b: "You are drawn to new ideas, experiments, and unexplored territory." },
  { d: "SN", a: "When solving a problem, you work methodically through the known facts.", b: "When solving a problem, you quickly generate multiple possibilities and explore them." },
  { d: "SN", a: "You prefer a world of concrete reality to one of imagination and abstraction.", b: "Your imagination is rich and you often think in metaphors, symbols, and ideas." },
  { d: "SN", a: "You trust what has worked before more than what might work in theory.", b: "You trust creative vision and inspiration even when it hasn't been proven yet." },
  // T / F
  { d: "TF", a: "You prioritise logical consistency when making decisions.", b: "You prioritise harmony and the impact on people when making decisions." },
  { d: "TF", a: "You believe objective truth is more important than subjective feelings.", b: "You believe how people feel about a decision matters as much as whether it is correct." },
  { d: "TF", a: "You are comfortable delivering criticism when it is logically justified.", b: "You think carefully about how to deliver criticism so it lands with care." },
  { d: "TF", a: "You make decisions by analysing the problem and applying consistent principles.", b: "You make decisions by considering what feels right and what serves the people involved." },
  { d: "TF", a: "You find it easier to remain objective and detached when someone is emotionally upset.", b: "You find yourself naturally empathising and emotionally joining people in what they're experiencing." },
  { d: "TF", a: "Being right matters more to you than being liked in most professional situations.", b: "Maintaining positive relationships matters as much as being correct in most professional situations." },
  { d: "TF", a: "You tend to be sceptical and challenge ideas before accepting them.", b: "You tend to appreciate others' perspectives and look for merit before critiquing." },
  { d: "TF", a: "You are uncomfortable when decisions are made on the basis of emotions rather than facts.", b: "You are uncomfortable when decisions are made without considering their human impact." },
  { d: "TF", a: "You value competence and effectiveness above sensitivity in a team setting.", b: "You value genuine care and relational health as much as effectiveness in a team setting." },
  { d: "TF", a: "When someone comes to you with a problem, your instinct is to analyse and solve it.", b: "When someone comes to you with a problem, your instinct is to understand and empathise." },
  // J / P
  { d: "JP", a: "You like having a plan and feel unsettled when things are undefined.", b: "You like keeping your options open and find firm plans premature." },
  { d: "JP", a: "You feel best when you have completed your work and can rest.", b: "You feel best when you have options and room to adapt." },
  { d: "JP", a: "You organise your time, workspace, and commitments carefully.", b: "You are comfortable with a more fluid approach to time and space." },
  { d: "JP", a: "Deadlines are clear guides that help you structure your work.", b: "Deadlines are external pressure; you often produce your best work right before them." },
  { d: "JP", a: "You prefer to resolve open questions and move forward rather than stay in a state of uncertainty.", b: "You prefer to gather more information before committing to a decision." },
  { d: "JP", a: "You find it satisfying to complete tasks fully before moving to new ones.", b: "You enjoy starting new tasks and find strict completion before starting another constraining." },
  { d: "JP", a: "You like your life to be organised, structured, and predictable.", b: "You like your life to be flexible, spontaneous, and open to new possibilities." },
  { d: "JP", a: "When faced with a choice, you like to decide and move on.", b: "When faced with a choice, you like to keep exploring before deciding." },
  { d: "JP", a: "You plan ahead and dislike being caught unprepared.", b: "You adapt as you go and find over-planning unnecessary and constraining." },
  { d: "JP", a: "You feel most productive when following a clear structure.", b: "You feel most productive when you have freedom to respond to what emerges." },
];

// Round-robin order
const QUESTION_ORDER: number[] = [];
const byDichotomy: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] };
QUESTIONS.forEach((q, i) => byDichotomy[q.d].push(i));
for (let r = 0; r < 10; r++) {
  for (const d of ["EI", "SN", "TF", "JP"]) {
    const idx = byDichotomy[d][r];
    if (idx !== undefined) QUESTION_ORDER.push(idx);
  }
}

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

const MBTI_TYPES: Record<string, {
  subtitle: string; color: string; bg: string;
  teamRole: string; teamStrengths: string[]; teamCaution: string;
}> = {
  INTJ: {
    subtitle: "The Mastermind",
    color: "oklch(48% 0.20 260)", bg: "oklch(16% 0.18 260)",
    teamRole: "Strategic architect. INTJs bring long-range thinking and high standards. They see the system behind the problem.",
    teamStrengths: ["Long-range planning and system thinking", "Independent decision-making under uncertainty", "Cuts through noise to core issues", "Holds the team to high intellectual standards"],
    teamCaution: "Can work in isolation. May seem cold or dismissive. Needs to build relational trust to lead effectively.",
  },
  INTP: {
    subtitle: "The Architect",
    color: "oklch(48% 0.18 240)", bg: "oklch(16% 0.16 240)",
    teamRole: "Deep analyst. INTPs solve the problems others give up on. They thrive when given complexity and autonomy.",
    teamStrengths: ["Rigorous analytical thinking", "Original and creative problem-solving", "Objective and unbiased reasoning", "Sees complexity and nuance"],
    teamCaution: "May struggle to complete or communicate. Needs support translating ideas into action.",
  },
  ENTJ: {
    subtitle: "The Commander",
    color: "oklch(50% 0.22 25)", bg: "oklch(17% 0.16 25)",
    teamRole: "Natural executive. ENTJs drive the team forward with vision, pace, and decisive leadership.",
    teamStrengths: ["Decisive, action-oriented leadership", "Strategic planning and execution", "Builds structures that deliver results", "Energises teams with direction"],
    teamCaution: "Can drive too hard. May bulldoze quieter voices. Needs to slow down for relational dimensions.",
  },
  ENTP: {
    subtitle: "The Visionary",
    color: "oklch(58% 0.20 45)", bg: "oklch(18% 0.14 45)",
    teamRole: "Idea generator. ENTPs challenge every assumption and keep the team creative and honest.",
    teamStrengths: ["Generative and creative thinking", "Comfortable challenging the status quo", "Quick, agile problem-solving", "Thrives in complex, ambiguous situations"],
    teamCaution: "More interested in starting than finishing. Can debate for its own sake. Needs a finisher.",
  },
  INFJ: {
    subtitle: "The Counsellor",
    color: "oklch(48% 0.22 295)", bg: "oklch(16% 0.18 295)",
    teamRole: "Quiet visionary. INFJs read people and situations with unusual depth and keep the team anchored in purpose.",
    teamStrengths: ["Deep insight into people and dynamics", "Holds long-range vision", "Strong values and integrity", "Deeply empathetic — reads the room"],
    teamCaution: "Can absorb too much. May struggle to express vision forcefully. Needs permission to lead clearly.",
  },
  INFP: {
    subtitle: "The Healer",
    color: "oklch(52% 0.18 10)", bg: "oklch(17% 0.14 10)",
    teamRole: "Values anchor. INFPs bring authenticity and care, and will name it when the team drifts from what matters.",
    teamStrengths: ["Deep personal integrity", "Highly empathetic and emotionally attuned", "Creative and original", "Loyal to people and causes"],
    teamCaution: "Can struggle with assertiveness. May be paralysed when values conflict. Needs safety to speak clearly.",
  },
  ENFJ: {
    subtitle: "The Teacher",
    color: "oklch(52% 0.18 155)", bg: "oklch(17% 0.13 155)",
    teamRole: "People developer. ENFJs invest in everyone around them and build teams where people genuinely grow.",
    teamStrengths: ["Deeply inspiring and motivating", "Invests in others' growth", "Clear, warm communicator", "Builds genuine community"],
    teamCaution: "Can over-extend. May avoid necessary conflict. Needs to hold their own convictions under relational pressure.",
  },
  ENFP: {
    subtitle: "The Champion",
    color: "oklch(60% 0.18 65)", bg: "oklch(18% 0.12 65)",
    teamRole: "Energy source. ENFPs bring enthusiasm, creativity, and contagious belief in the team's potential.",
    teamStrengths: ["Genuinely creative and visionary", "Warm, energetic, and inspiring", "Deeply empathetic", "Sees possibilities others miss"],
    teamCaution: "Can start more than they finish. Needs structure and a delivery partner to make vision real.",
  },
  ISTJ: {
    subtitle: "The Inspector",
    color: "oklch(45% 0.14 215)", bg: "oklch(16% 0.12 215)",
    teamRole: "Reliable anchor. ISTJs do what they say, prepare thoroughly, and build the trust that lets others take risks.",
    teamStrengths: ["Exceptionally reliable and consistent", "Thorough and well-prepared", "Strong sense of duty", "Calm and steady under pressure"],
    teamCaution: "Can resist change. May be perceived as inflexible. Needs to develop comfort with ambiguity.",
  },
  ISFJ: {
    subtitle: "The Nurturer",
    color: "oklch(50% 0.16 185)", bg: "oklch(16% 0.12 185)",
    teamRole: "Quiet backbone. ISFJs hold the team together behind the scenes — serving, noticing, and never asking for credit.",
    teamStrengths: ["Deeply caring and attentive", "Highly reliable and detailed", "Builds genuine belonging", "Loyal and consistent"],
    teamCaution: "May go unrecognised. Can suppress their own perspective. Needs explicit invitation to share their voice.",
  },
  ESTJ: {
    subtitle: "The Supervisor",
    color: "oklch(48% 0.18 195)", bg: "oklch(16% 0.14 195)",
    teamRole: "Order builder. ESTJs create structure, clarity, and consistency — teams know what to expect and can count on them.",
    teamStrengths: ["Exceptional organiser and administrator", "Clear, direct communication", "Highly reliable and consistent", "Creates order from complexity"],
    teamCaution: "Can be rigid. May undervalue relational needs. Needs to build space for genuine input.",
  },
  ESFJ: {
    subtitle: "The Provider",
    color: "oklch(55% 0.18 35)", bg: "oklch(17% 0.12 35)",
    teamRole: "Community builder. ESFJs make sure everyone feels included, valued, and part of something real.",
    teamStrengths: ["Warm and genuinely caring", "Highly organised and reliable", "Builds community and belonging", "Responsive to others' needs"],
    teamCaution: "Can prioritise harmony over necessary truth. May struggle with productive conflict.",
  },
  ISTP: {
    subtitle: "The Craftsman",
    color: "oklch(50% 0.15 145)", bg: "oklch(16% 0.11 145)",
    teamRole: "Practical solver. ISTPs fix what's broken, stay calm when things go wrong, and cut to what actually works.",
    teamStrengths: ["Exceptional practical problem-solving", "Calm and decisive under pressure", "Highly observant", "Efficient — cuts through to what matters"],
    teamCaution: "Can appear remote. May resist structure or oversight. Needs to communicate investment in people.",
  },
  ISFP: {
    subtitle: "The Composer",
    color: "oklch(55% 0.18 150)", bg: "oklch(17% 0.13 150)",
    teamRole: "Authentic presence. ISFPs create safety through their genuine care and non-performative way of being.",
    teamStrengths: ["Deep empathy and attentiveness", "Creative and aesthetically sensitive", "Authentic and non-performative", "Loyal and present"],
    teamCaution: "Can be overlooked. May avoid asserting their perspective. Needs encouragement to claim their voice.",
  },
  ESTP: {
    subtitle: "The Promoter",
    color: "oklch(58% 0.20 55)", bg: "oklch(18% 0.13 55)",
    teamRole: "Tactical driver. ESTPs read real situations quickly and move the team from analysis to action.",
    teamStrengths: ["Fast, accurate real-world perception", "Action-oriented and decisive", "Energetic and charismatic", "Resilient and adaptable under pressure"],
    teamCaution: "Can prioritise speed over depth. Needs to develop strategic patience and relational sensitivity.",
  },
  ESFP: {
    subtitle: "The Performer",
    color: "oklch(62% 0.20 48)", bg: "oklch(18% 0.13 48)",
    teamRole: "Joy bringer. ESFPs make people want to show up. They read the room and create cultures of genuine belonging.",
    teamStrengths: ["Warm, generous, and genuinely caring", "Brings energy and joy to team culture", "Spontaneous and highly adaptable", "Makes people feel genuinely welcomed"],
    teamCaution: "Can avoid difficult decisions. Needs structure and a delivery partner. Growth edge: discipline.",
  },
};

// ── SCORING ───────────────────────────────────────────────────────────────────

function computeType(scores: Record<string, number>): { type: string; pcts: Record<string, number> } {
  const ePct = Math.round((scores.EI_E ?? 0) / ((scores.EI_E ?? 0) + (scores.EI_I ?? 1)) * 100) || 50;
  const sPct = Math.round((scores.SN_S ?? 0) / ((scores.SN_S ?? 0) + (scores.SN_N ?? 1)) * 100) || 50;
  const tPct = Math.round((scores.TF_T ?? 0) / ((scores.TF_T ?? 0) + (scores.TF_F ?? 1)) * 100) || 50;
  const jPct = Math.round((scores.JP_J ?? 0) / ((scores.JP_J ?? 0) + (scores.JP_P ?? 1)) * 100) || 50;
  const type = [ePct >= 50 ? "E" : "I", sPct >= 50 ? "S" : "N", tPct >= 50 ? "T" : "F", jPct >= 50 ? "J" : "P"].join("");
  return { type, pcts: { E: ePct, I: 100 - ePct, S: sPct, N: 100 - sPct, T: tPct, F: 100 - tPct, J: jPct, P: 100 - jPct } };
}

const DIMENSION_META = [
  { d: "EI", label: "Energy Direction", poleA: "E", labelA: "Extraversion", poleB: "I", labelB: "Introversion", color: "oklch(60% 0.18 52)" },
  { d: "SN", label: "Information Processing", poleA: "S", labelA: "Sensing", poleB: "N", labelB: "Intuition", color: "oklch(52% 0.22 280)" },
  { d: "TF", label: "Decision-Making", poleA: "T", labelA: "Thinking", poleB: "F", labelB: "Feeling", color: "oklch(50% 0.18 215)" },
  { d: "JP", label: "Structure & Pace", poleA: "J", labelA: "Judging", poleB: "P", labelB: "Perceiving", color: "oklch(50% 0.20 25)" },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

export default function MBTITeamClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    { EI_E: 0, EI_I: 0, SN_S: 0, SN_N: 0, TF_T: 0, TF_F: 0, JP_J: 0, JP_P: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; key: string }[]>([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ EI_E: 0, EI_I: 0, SN_S: 0, SN_N: 0, TF_T: 0, TF_F: 0, JP_J: 0, JP_P: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
    setSaveError(null);
    setQuizState("active");
    setTimeout(() => {
      document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleAnswer(pole: "A" | "B") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const poleMap: Record<string, Record<"A" | "B", string>> = {
      EI: { A: "EI_E", B: "EI_I" },
      SN: { A: "SN_S", B: "SN_N" },
      TF: { A: "TF_T", B: "TF_F" },
      JP: { A: "JP_J", B: "JP_P" },
    };
    const key = poleMap[q.d][pole];
    setAnswerHistory(prev => [...prev, { qIdx, key }]);
    setScores(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
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
    setScores(prev => ({ ...prev, [last.key]: Math.max(0, (prev[last.key] ?? 0) - 1) }));
    setAnswerHistory(prev => prev.slice(0, -1));
    setCurrentIdx(prev => prev - 1);
  }

  function handleSaveResult() {
    startTransition(async () => {
      const { type } = computeType(scores);
      const result = await saveMBTITeamResult(type, scores);
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

  // ── HERO + CONTENT (always visible) ─────────────────────────────────────────
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
              Team Assessment · Myers-Briggs
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.14em",
              textTransform: "uppercase", color: "oklch(72% 0.04 260)",
            }}>
              8–10 min
            </span>
          </div>

          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "18ch" }}>
            Myers-Briggs<br />
            <span style={{ color: "oklch(65% 0.15 45)" }}>for Your Team</span>
          </h1>

          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "58ch", marginBottom: "2.5rem" }}>
            MBTI types reveal how your teammates recharge, process information, make decisions, and structure their work. A team with shared types can move fast — but might miss what it can&rsquo;t see.
          </p>

          <button onClick={startQuiz} className="btn-primary">
            Take the Assessment →
          </button>
        </div>
      </section>

      {/* ── SECTION 1: The Four Dimensions in Team Context ── */}
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
            The Four Dimensions in Team Context
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
            color: "oklch(48% 0.008 260)", maxWidth: "60ch", marginBottom: "3rem",
          }}>
            Each MBTI dimension shapes how people show up on a team — not just as individuals, but as contributors to a shared dynamic.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                label: "E / I — Team Energy",
                color: "oklch(60% 0.18 52)",
                cardBg: "oklch(18% 0.10 52)",
                body: "Extraverts energise team meetings and drive momentum. Introverts bring depth and notice what others miss. Teams dominated by one type often either burn through ideas without landing them, or think carefully without ever deciding.",
                tip: "Mixed E/I teams need meeting designs that work for both: pre-reads for introverts, open discussion time for extraverts.",
              },
              {
                label: "S / N — How Teams Gather Information",
                color: "oklch(52% 0.22 280)",
                cardBg: "oklch(16% 0.14 280)",
                body: "Sensing types ground the team in what is real, tested, and proven. Intuitive types push the team toward what could be. Sensor-heavy teams can get stuck in the present; intuitive-heavy teams can get lost in the future.",
                tip: "The best team decisions happen when both types are heard: a realistic picture of where you are, and an honest vision of where you could go.",
              },
              {
                label: "T / F — How Teams Decide",
                color: "oklch(50% 0.18 215)",
                cardBg: "oklch(16% 0.12 215)",
                body: "Thinking types hold teams to logical consistency and push through uncomfortable decisions. Feeling types ensure those decisions don't break people. Thinker-heavy teams can be efficient but brutal; feeler-heavy teams can be caring but indecisive.",
                tip: "The healthiest decisions consider both: what is logically sound and what is humanly right.",
              },
              {
                label: "J / P — How Teams Work",
                color: "oklch(50% 0.20 25)",
                cardBg: "oklch(17% 0.14 25)",
                body: "Judging types want structure, plans, and closure. Perceiving types want flexibility and room to adapt. J-heavy teams over-plan; P-heavy teams under-deliver. The tension between them, when held well, produces excellent work.",
                tip: "Give J types clear milestones. Give P types space within those milestones. Don't mistake one for laziness or the other for rigidity.",
              },
            ].map(item => (
              <div key={item.label} style={{
                background: item.cardBg,
                padding: "1.75rem",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: item.color }} />
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.875rem",
                  color: item.color, marginBottom: "0.875rem", letterSpacing: "0.04em",
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7,
                  color: "oklch(80% 0.04 260)", marginBottom: "1rem",
                }}>
                  {item.body}
                </p>
                <div style={{
                  borderTop: `1px solid ${item.color}40`,
                  paddingTop: "0.875rem",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", lineHeight: 1.6,
                    color: "oklch(65% 0.06 260)", margin: 0, fontStyle: "italic",
                  }}>
                    {item.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 2: Common Team Type Combinations ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "72ch" }}>
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
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              What Common Team Combinations Create
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  combo: "NT-heavy teams",
                  creates: "Strategic, rigorous, fast-moving. Excellent at analysis and decision-making. Risk: can undervalue relational dynamics and lose people who need more warmth and process.",
                },
                {
                  combo: "SF-heavy teams",
                  creates: "Warm, stable, community-oriented. Excellent at care and consistency. Risk: may avoid necessary conflict and stay too close to what has always worked.",
                },
                {
                  combo: "NF-heavy teams",
                  creates: "Vision-driven, empathetic, creative. Excellent at meaning and inspiration. Risk: may struggle with execution, structure, and hard logistical decisions.",
                },
                {
                  combo: "ST-heavy teams",
                  creates: "Practical, reliable, efficient. Excellent at delivery and accountability. Risk: may resist innovation, undervalue relationships, and struggle to inspire.",
                },
                {
                  combo: "Balanced J/P teams",
                  creates: "The most adaptable. Structure enough to deliver, flexibility enough to adapt. Requires explicit negotiation about how the team works — but the outcomes are often best.",
                },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "oklch(22% 0.08 260)", padding: "1.25rem 1.5rem",
                  borderLeft: "3px solid oklch(65% 0.15 45)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
                    color: "oklch(65% 0.15 45)", marginBottom: "0.4rem",
                  }}>
                    {item.combo}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65,
                    color: "oklch(72% 0.04 260)", margin: 0,
                  }}>
                    {item.creates}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: What to Do When Types Are Missing ── */}
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
              When Key Types Are Missing
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.5rem",
            }}>
              No team has every type — and that&rsquo;s fine. What matters is knowing what you&rsquo;re missing, and compensating intentionally.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { missing: "No N types", fix: "Bring in an outside voice. Hire a consultant, engage a mentor, or build explicit future-scanning into your planning rhythms." },
                { missing: "No S types", fix: "Slow down before launching. Add a practical review step: who has done this before, what are the concrete requirements, what could go wrong." },
                { missing: "No F types", fix: "Build explicit check-ins for team health. Survey morale. Ask how people are doing before asking what they've done." },
                { missing: "No T types", fix: "Invite challenge. Create a devil's advocate role in key decisions. Ask: what would someone critical of this say?" },
                { missing: "No J types", fix: "Add structure artificially. Assign someone the role of time-keeper and decision-closer. Use deadlines actively, not just as a formality." },
                { missing: "No P types", fix: "Build in review points. Create space to ask: are we still on the right track, or are we executing the wrong plan well?" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "oklch(22% 0.10 260)", padding: "1.25rem 1.5rem",
                  display: "flex", gap: "1rem", alignItems: "flex-start",
                }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem",
                    color: "oklch(55% 0.12 260)", letterSpacing: "0.1em",
                    flexShrink: 0, marginTop: "0.2rem",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem",
                      color: "oklch(97% 0.005 80)", marginBottom: "0.3rem",
                    }}>
                      {item.missing}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6,
                      color: "oklch(72% 0.04 260)", margin: 0,
                    }}>
                      {item.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Cross-Cultural Caution ── */}
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
            color: "oklch(97% 0.005 80)", marginBottom: "2rem",
          }}>
            Cross-Cultural Caution
          </h2>
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(80% 0.04 260)", marginBottom: "1.25rem",
            }}>
              The MBTI was developed in a Western, largely individualist context. It does not map cleanly onto all cultures — and using it without cultural awareness can create more misunderstanding, not less.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                "In many Asian and African cultures, the E/I distinction looks different. Silence is not always introversion — it can be respect, attentiveness, or deference to authority.",
                "The T/F dimension is shaped by cultural values around harmony and directness. A high-context communicator may score F not from personality, but from cultural training.",
                "The J/P distinction can be influenced by how a culture relates to time — linear vs. cyclical, monochronic vs. polychronic.",
              ].map((point, i) => (
                <div key={i} style={{
                  display: "flex", gap: "0.875rem", alignItems: "flex-start",
                }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontSize: "0.7rem", marginTop: "0.35rem", flexShrink: 0 }}>▸</span>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
                    color: "oklch(75% 0.04 260)", margin: 0,
                  }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
            <div style={{
              background: "oklch(30% 0.12 260)", padding: "1.5rem 2rem",
              borderLeft: "3px solid oklch(65% 0.15 45)",
            }}>
              <p style={{
                fontFamily: "var(--font-cormorant)", fontStyle: "italic",
                fontSize: "1.125rem", lineHeight: 1.7,
                color: "oklch(88% 0.006 80)", marginBottom: "0.75rem",
              }}>
                &ldquo;In an abundance of counsellors there is victory.&rdquo;
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.75rem",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "oklch(62% 0.08 45)", margin: 0,
              }}>
                Proverbs 11:14
              </p>
            </div>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
              color: "oklch(72% 0.04 260)", marginTop: "1.25rem",
            }}>
              Use MBTI as a language for curiosity, not a framework for categorisation. The goal is not to type your teammates — it&rsquo;s to understand them better, with more grace than you had before.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Biblical Integration ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 6rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ maxWidth: "68ch" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(65% 0.15 45)", marginBottom: "0.875rem",
            }}>
              Section 5
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15,
              color: "oklch(22% 0.08 260)", marginBottom: "1.5rem",
            }}>
              Wired Differently — Purposefully
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.25rem",
            }}>
              If people were all wired the same, teams would be faster — and weaker. The MBTI diversity you find in a cross-cultural team is not an obstacle to manage. It is a resource to draw on.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.8,
              color: "oklch(30% 0.008 260)", marginBottom: "1.5rem",
            }}>
              The most effective teams we work with are not teams where everyone is the same type — they are teams where different types understand each other well enough to work together.
            </p>
            <div style={{
              background: "oklch(22% 0.08 260)", padding: "1.5rem 2rem",
              borderLeft: "3px solid oklch(65% 0.15 45)",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                color: "oklch(88% 0.006 80)", margin: 0,
              }}>
                Your type belongs to your team. The most effective teams have diverse types working from mutual understanding — not trying to be the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section id="quiz-section" style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(30% 0.12 260)",
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
              Myers-Briggs Type Indicator
            </h2>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
              color: "oklch(72% 0.04 260)", maxWidth: "56ch",
            }}>
              40 questions. For each pair, choose the option that feels most naturally like you — not your ideal, your actual self.
            </p>
          </div>

          {/* IDLE */}
          {quizState === "idle" && (
            <div style={{
              background: "oklch(22% 0.08 260)", padding: "3rem 2.5rem",
              maxWidth: "600px",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.75,
                color: "oklch(80% 0.04 260)", marginBottom: "2rem",
              }}>
                There are no right or wrong types. Every type brings something a team needs. Be honest — the more accurately you answer, the more useful your result will be to your team.
              </p>
              <button onClick={startQuiz} className="btn-primary">
                Start Assessment →
              </button>
            </div>
          )}

          {/* ACTIVE */}
          {quizState === "active" && (
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
                <div style={{ height: "4px", background: "oklch(20% 0.08 260)", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${progress}%`,
                    background: "oklch(65% 0.15 45)",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>

              {/* Dimension label */}
              {(() => {
                const qIdx = QUESTION_ORDER[currentIdx];
                const q = QUESTIONS[qIdx];
                const meta = DIMENSION_META.find(m => m.d === q.d);
                return meta ? (
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.65rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: meta.color, marginBottom: "1rem",
                  }}>
                    {meta.label}: {meta.labelA} vs {meta.labelB}
                  </p>
                ) : null;
              })()}

              {/* Prompt */}
              <p style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "oklch(62% 0.04 260)", marginBottom: "0.75rem",
              }}>
                Which feels more like you?
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {[
                  { label: "A", text: QUESTIONS[QUESTION_ORDER[currentIdx]].a, pole: "A" as const },
                  { label: "B", text: QUESTIONS[QUESTION_ORDER[currentIdx]].b, pole: "B" as const },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.pole)}
                    style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 600,
                      fontSize: "0.9375rem", lineHeight: 1.5, textAlign: "left",
                      padding: "1.25rem 2rem",
                      background: "oklch(28% 0.10 260)",
                      color: "oklch(88% 0.006 80)",
                      border: "none", cursor: "pointer",
                      transition: "background 0.15s ease",
                      display: "flex", gap: "1rem", alignItems: "flex-start",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "oklch(35% 0.12 260)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "oklch(28% 0.10 260)";
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.1em", color: "oklch(55% 0.08 260)", flexShrink: 0, marginTop: "0.2rem" }}>
                      {opt.label}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>

              <button
                onClick={handleBack}
                style={{
                  marginTop: "1.25rem",
                  background: "transparent", border: "none",
                  fontFamily: "var(--font-montserrat)", fontSize: "0.8rem",
                  color: "oklch(55% 0.04 260)", cursor: "pointer", padding: "0.5rem 0",
                }}
              >
                ← Back
              </button>
            </div>
          )}

          {/* DONE */}
          {quizState === "done" && (() => {
            const { type, pcts } = computeType(scores);
            const typeData = MBTI_TYPES[type] ?? MBTI_TYPES.ENFP;
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
                    Your Myers-Briggs Type
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontWeight: 800,
                      fontSize: "clamp(3rem, 8vw, 4.5rem)", color: typeData.color, lineHeight: 1,
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
                    </div>
                  </div>

                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                    color: "oklch(82% 0.04 260)", marginBottom: "1.5rem",
                  }}>
                    {typeData.teamRole}
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
                <div style={{ background: "oklch(22% 0.08 260)", padding: "1.75rem", marginBottom: "1.5rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "oklch(55% 0.04 260)", marginBottom: "1rem",
                  }}>
                    Preference Profile
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {DIMENSION_META.map(d => {
                      const pctA = pcts[d.poleA] ?? 50;
                      const pctB = 100 - pctA;
                      return (
                        <div key={d.d}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 600, color: d.color }}>{d.labelA} {pctA}%</span>
                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(50% 0.04 260)" }}>{d.labelB} {pctB}%</span>
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
                <div style={{ background: "oklch(22% 0.08 260)", padding: "1.5rem 2rem", marginBottom: "1.5rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75,
                    color: "oklch(82% 0.04 260)", margin: 0,
                  }}>
                    Your type belongs to your team. The most effective teams have diverse types working from mutual understanding — not trying to be the same.
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
        background: "oklch(22% 0.08 260)",
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
            Understanding is the beginning.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7,
            color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem",
          }}>
            Have your whole team take this assessment and compare types in your next team session. Diversity of type, held with mutual respect, is one of the most powerful tools a cross-cultural team has.
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
            <Link href="/team/16-personalities" style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem",
              letterSpacing: "0.06em", textDecoration: "none",
              padding: "0.75rem 1.75rem",
              background: "transparent", color: "oklch(78% 0.04 260)",
              border: "1.5px solid oklch(42% 0.008 260)",
            }}>
              Try 16 Personalities →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
