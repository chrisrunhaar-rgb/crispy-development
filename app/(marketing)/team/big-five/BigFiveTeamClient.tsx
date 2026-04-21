"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveBigFiveTeamResult } from "./actions";

// ── QUESTIONS (same as personal version, round-robin order) ───────────────────

const QUESTIONS_RAW = [
  { text: "I enjoy exploring new ideas and engaging with complex, abstract concepts.", t: "O" },
  { text: "I have a vivid imagination and an active inner world.", t: "O" },
  { text: "I am genuinely moved by art, music, poetry, or literature.", t: "O" },
  { text: "I am curious about many subjects and enjoy learning for its own sake.", t: "O" },
  { text: "I prefer variety and novelty to routine and predictability.", t: "O" },
  { text: "I enjoy experimenting with new approaches rather than sticking to what works.", t: "O" },
  { text: "I find it easy to think creatively and generate original ideas.", t: "O" },
  { text: "I question conventional wisdom and enjoy challenging assumptions.", t: "O" },
  { text: "I am drawn to cultures, perspectives, and ways of life different from my own.", t: "O" },
  { text: "I notice beauty and meaning in everyday experiences others might overlook.", t: "O" },
  { text: "I am organised and keep my work, space, and commitments in order.", t: "C" },
  { text: "I complete tasks thoroughly and reliably on time.", t: "C" },
  { text: "I set ambitious goals for myself and work persistently toward them.", t: "C" },
  { text: "I pay close attention to detail and rarely make careless mistakes.", t: "C" },
  { text: "I am disciplined — I follow through even when motivation fades.", t: "C" },
  { text: "I think carefully and plan ahead before taking action.", t: "C" },
  { text: "People can count on me to keep my word and follow through.", t: "C" },
  { text: "I work hard on tasks even when they are tedious or difficult.", t: "C" },
  { text: "I hold myself to high standards and am not satisfied with mediocrity.", t: "C" },
  { text: "I tend to finish what I start, even when it is no longer exciting.", t: "C" },
  { text: "I feel energised by being around other people.", t: "E" },
  { text: "I am talkative and find it easy to start conversations with new people.", t: "E" },
  { text: "I bring energy and enthusiasm to social and group settings.", t: "E" },
  { text: "I am assertive and comfortable taking charge in groups.", t: "E" },
  { text: "I actively seek out social gatherings and enjoy meeting new people.", t: "E" },
  { text: "I express my emotions openly and come across as warm and positive.", t: "E" },
  { text: "I prefer working with others over working alone.", t: "E" },
  { text: "I feel confident and at ease in most social situations.", t: "E" },
  { text: "I enjoy being the centre of attention in the right setting.", t: "E" },
  { text: "I find that conversation and collaboration sharpen my thinking.", t: "E" },
  { text: "I genuinely care about others' wellbeing and try to help when I can.", t: "A" },
  { text: "I trust others and generally assume they have good intentions.", t: "A" },
  { text: "I find it relatively easy to forgive people who have hurt me.", t: "A" },
  { text: "I prefer to find common ground rather than win an argument.", t: "A" },
  { text: "I am flexible and willing to adjust my position to accommodate others.", t: "A" },
  { text: "I work cooperatively and rarely let competition get in the way of relationships.", t: "A" },
  { text: "I feel genuine empathy for people who are struggling.", t: "A" },
  { text: "I communicate gently and avoid being harsh, blunt, or critical.", t: "A" },
  { text: "I am considerate of others' feelings when deciding how to say something.", t: "A" },
  { text: "I am generous with my time, energy, and resources.", t: "A" },
  { text: "I experience significant stress or anxiety in challenging situations.", t: "N" },
  { text: "My mood changes frequently depending on what is happening around me.", t: "N" },
  { text: "I tend to worry about things, even when they are likely to turn out fine.", t: "N" },
  { text: "Once I become upset, it takes me a while to calm down.", t: "N" },
  { text: "I feel self-conscious or embarrassed more easily than most people.", t: "N" },
  { text: "I experience strong emotional reactions when I receive criticism or face setbacks.", t: "N" },
  { text: "I sometimes feel overwhelmed by demands placed on me.", t: "N" },
  { text: "I find it difficult to stay calm and composed under pressure.", t: "N" },
  { text: "I notice and feel negative emotions — worry, sadness, frustration — quite intensely.", t: "N" },
  { text: "I find it challenging to maintain emotional equilibrium in conflict.", t: "N" },
];

const QUESTION_ORDER = [
  0, 10, 20, 30, 40,
  1, 11, 21, 31, 41,
  2, 12, 22, 32, 42,
  3, 13, 23, 33, 43,
  4, 14, 24, 34, 44,
  5, 15, 25, 35, 45,
  6, 16, 26, 36, 46,
  7, 17, 27, 37, 47,
  8, 18, 28, 38, 48,
  9, 19, 29, 39, 49,
];

const SCALE_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

// ── TRAIT DATA ────────────────────────────────────────────────────────────────

interface Trait {
  key: string;
  name: string;
  subtitle: string;
  color: string;
  colorLight: string;
  bg: string;
  teamContext: string;
  teamHigh: string;
  teamLow: string;
}

const TRAITS: Trait[] = [
  {
    key: "O",
    name: "Openness",
    subtitle: "Curiosity, creativity & imagination",
    color: "oklch(52% 0.22 280)",
    colorLight: "oklch(65% 0.17 280)",
    bg: "oklch(16% 0.18 280)",
    teamContext:
      "Openness on a team separates those who drive creative exploration from those who anchor reliable execution. High-O members challenge assumptions, love ambiguity, and push toward innovation. Low-O members value proven processes, consistency, and practical delivery.",
    teamHigh:
      "High-O team members are your creative engines — they'll see possibilities others miss and reframe problems productively. Watch that their appetite for novelty doesn't abandon what's working.",
    teamLow:
      "Low-O members provide essential stability. They're the ones who ask 'has this actually been tested?' and keep the team grounded in what works. Don't confuse their pragmatism with closed-mindedness.",
  },
  {
    key: "C",
    name: "Conscientiousness",
    subtitle: "Discipline, reliability & organisation",
    color: "oklch(50% 0.18 215)",
    colorLight: "oklch(64% 0.14 215)",
    bg: "oklch(17% 0.14 215)",
    teamContext:
      "Conscientiousness reveals who tracks deadlines vs. who explores freely. High-C members are your reliability anchors — meticulous, structured, and dependable. Low-C members are more spontaneous and adaptive, thriving in environments where plans must flex.",
    teamHigh:
      "High-C team members make commitments stick. They maintain quality under pressure and notice details that others miss. Their growth edge: extending grace to teammates who work more organically.",
    teamLow:
      "Low-C members adapt quickly and rarely get paralysed by imperfect conditions. They're valuable in fast-moving, high-ambiguity contexts. Their growth edge: building enough follow-through that colleagues can depend on them.",
  },
  {
    key: "E",
    name: "Extraversion",
    subtitle: "Energy, sociability & assertiveness",
    color: "oklch(60% 0.20 52)",
    colorLight: "oklch(72% 0.15 52)",
    bg: "oklch(18% 0.13 52)",
    teamContext:
      "Extraversion shapes how meetings feel — who brings energy to a room, who needs to think before they speak, and whose contributions can get drowned out. Teams skewed heavily extroverted often move fast but miss depth; heavily introverted teams think deeply but can struggle with momentum.",
    teamHigh:
      "High-E team members drive conversation and visibility. They process aloud, build energy, and keep things moving. Leaders: build in space for quieter members — not everyone processes best in real time.",
    teamLow:
      "Low-E members are often the most insightful voices in the room — if the room makes space for them. Their written and one-on-one contributions can be richer than their public ones. Design team communication structures that don't disadvantage them.",
  },
  {
    key: "A",
    name: "Agreeableness",
    subtitle: "Cooperation, trust & empathy",
    color: "oklch(52% 0.18 155)",
    colorLight: "oklch(65% 0.14 155)",
    bg: "oklch(17% 0.12 155)",
    teamContext:
      "Agreeableness is the harmony-friction dial. High-A teams have warm relational culture but can avoid necessary conflict. Low-A teams speak directly but can create friction that erodes trust. Healthy teams need both: real warmth and real honesty.",
    teamHigh:
      "High-A members build the relational fabric that holds teams together under stress. They remember birthdays, check on struggling colleagues, and smooth tensions before they escalate. Their challenge: saying the hard thing when harmony is at stake.",
    teamLow:
      "Low-A members will name what others are thinking but afraid to say. They hold high standards and don't dodge difficult conversations. Their challenge: ensuring directness doesn't land as dismissiveness.",
  },
  {
    key: "N",
    name: "Emotional Stability",
    subtitle: "Calm under pressure & resilience",
    color: "oklch(50% 0.20 310)",
    colorLight: "oklch(63% 0.15 310)",
    bg: "oklch(16% 0.17 310)",
    teamContext:
      "Emotional Stability (the inverse of Neuroticism) determines how your team handles stress, criticism, and uncertainty. High-stability members are the calm centre in a storm. High-sensitivity members feel pressure more intensely — and that sensitivity, well-managed, can be a source of real attunement to team dynamics.",
    teamHigh:
      "High-stability (low-N) members regulate the team's emotional temperature in hard moments. They absorb pressure without broadcasting it. Watch that their calm doesn't make them dismissive of how others are genuinely struggling.",
    teamLow:
      "High-sensitivity (high-N) members are often the first to notice when something's wrong in the team culture. Their emotional radar is a gift. Teams that create psychological safety allow this sensitivity to inform leadership rather than become a liability.",
  },
];

// ── CONTENT DATA ──────────────────────────────────────────────────────────────

const TENSIONS = [
  {
    combo: "High-O + Low-C",
    label: "Creative Chaos",
    body: "High-Openness, Low-Conscientiousness combinations generate ideas faster than they can be executed. Lots of creative energy, chronic under-delivery. The fix isn't to suppress creativity — it's to pair with high-C members who can turn ideas into timetables.",
  },
  {
    combo: "High-C + Low-O",
    label: "Reliable but Rigid",
    body: "This combination executes brilliantly within known frameworks but can struggle when the environment demands reinvention. When the world changes faster than the plan, this pairing needs access to high-O thinking to remain relevant.",
  },
  {
    combo: "High-E + Low-E",
    label: "Meeting Energy Mismatch",
    body: "In a team with both extroverts and introverts, unstructured meetings will consistently advantage extroverts. High-E members feel the meeting is going well; low-E members often leave feeling unheard. Design meetings that give both time to contribute.",
  },
  {
    combo: "High-A + Low-A",
    label: "Harmony vs. Honesty",
    body: "High-A members protect relational warmth; low-A members protect honest challenge. Without intentional design, high-A members enable poor performance by avoiding feedback, while low-A members alienate colleagues with bluntness. The team needs both — in balance.",
  },
  {
    combo: "High-N + Low-N",
    label: "Sensitivity Gradient",
    body: "When a team has both highly stable and highly sensitive members, stress lands very differently. What feels manageable to a low-N member can feel overwhelming to a high-N member. Psychological safety norms must be calibrated to the most sensitive, not the most resilient.",
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function calcPct(raw: number): number {
  return Math.round(((raw - 10) / 40) * 100);
}

export default function BigFiveTeamClient({ user }: { user: User | null }) {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    O: 0, C: 0, E: 0, A: 0, N: 0,
  });
  const [answerHistory, setAnswerHistory] = useState<
    { qIdx: number; value: number; trait: string }[]
  >([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ O: 0, C: 0, E: 0, A: 0, N: 0 });
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
    const q = QUESTIONS_RAW[qIdx];
    setAnswerHistory((prev) => [...prev, { qIdx, value, trait: q.t }]);
    setScores((prev) => ({ ...prev, [q.t]: (prev[q.t] ?? 0) + value }));
    if (currentIdx + 1 < QUESTION_ORDER.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizState("done");
      setTimeout(() => {
        document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }

  function handleBack() {
    if (currentIdx === 0) {
      setQuizState("idle");
      return;
    }
    const last = answerHistory[answerHistory.length - 1];
    if (!last) return;
    setScores((prev) => ({
      ...prev,
      [last.trait]: (prev[last.trait] ?? 0) - last.value,
    }));
    setAnswerHistory((prev) => prev.slice(0, -1));
    setCurrentIdx((prev) => prev - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentIdx(0);
    setScores({ O: 0, C: 0, E: 0, A: 0, N: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
    setSaveError(null);
  }

  function handleSaveResult() {
    startTransition(async () => {
      const pcts: Record<string, number> = {};
      TRAITS.forEach((t) => {
        const raw = scores[t.key] ?? 10;
        pcts[t.key] = t.key === "N" ? 100 - calcPct(raw) : calcPct(raw);
      });
      const result = await saveBigFiveTeamResult(pcts);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setResultSaved(true);
      }
    });
  }

  const progress =
    quizState === "active"
      ? Math.round((currentIdx / QUESTION_ORDER.length) * 100)
      : quizState === "done"
      ? 100
      : 0;

  // ── RESULT DATA ──────────────────────────────────────────────────────────────
  const pcts: Record<string, number> = {};
  TRAITS.forEach((t) => {
    const raw = scores[t.key] ?? 10;
    pcts[t.key] = calcPct(raw);
  });
  const stabilityPct = 100 - pcts.N;

  function pctLabel(pct: number): string {
    if (pct >= 75) return "High";
    if (pct >= 55) return "Moderately High";
    if (pct >= 45) return "Moderate";
    if (pct >= 25) return "Moderately Low";
    return "Low";
  }

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
            background: "oklch(52% 0.22 280)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 70% 50%, oklch(30% 0.16 280 / 0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-4rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            fontSize: "clamp(8rem, 20vw, 18rem)",
            color: "oklch(30% 0.12 280 / 0.2)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          OCEAN
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
                color: "oklch(65% 0.17 280)",
                border: "1.5px solid oklch(65% 0.17 280)",
                padding: "0.3rem 0.7rem",
              }}
            >
              Team Assessment · Big Five (OCEAN)
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
              8–10 min
            </span>
          </div>

          <h1
            className="t-hero"
            style={{
              color: "oklch(97% 0.005 80)",
              marginBottom: "1.25rem",
              maxWidth: "18ch",
            }}
          >
            Team{" "}
            <span style={{ color: "oklch(65% 0.17 280)" }}>Big Five</span>
          </h1>

          <p
            className="t-tagline"
            style={{
              color: "oklch(72% 0.04 260)",
              maxWidth: "56ch",
              marginBottom: "2.5rem",
            }}
          >
            The Big Five is the most research-backed personality framework in the
            world. On a team, your OCEAN scores explain friction, collaboration
            patterns, and how people respond to change and challenge.
          </p>

          <button onClick={startQuiz} className="btn-primary">
            Start Team Assessment →
          </button>
        </div>
      </section>

      {/* ── SECTION 1: The Five Traits in Team Context ── */}
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
              color: "oklch(52% 0.22 280)",
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
            The Five Traits in Team Context
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
            Each OCEAN dimension plays out differently in a team than it does in
            individual assessment. Here is what to look for.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {TRAITS.map((trait) => (
              <div
                key={trait.key}
                style={{
                  background: trait.bg,
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
                    background: trait.color,
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
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      background: trait.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 900,
                      fontSize: "1.125rem",
                      color: "oklch(97% 0.005 80)",
                    }}
                  >
                    {trait.key}
                  </div>
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
                      {trait.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: trait.colorLight,
                        margin: 0,
                        textTransform: "uppercase",
                      }}
                    >
                      {trait.subtitle}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    color: "oklch(78% 0.04 260)",
                    marginBottom: "1rem",
                  }}
                >
                  {trait.teamContext}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  {[
                    { label: "High", body: trait.teamHigh },
                    { label: "Low", body: trait.teamLow },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        background: "oklch(14% 0.06 260 / 0.5)",
                        padding: "0.75rem 1rem",
                        borderLeft: `2px solid ${trait.colorLight}`,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: trait.colorLight,
                          marginBottom: "0.3rem",
                        }}
                      >
                        {item.label} {trait.key}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8rem",
                          lineHeight: 1.6,
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
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "oklch(90% 0.006 80)" }} />

      {/* ── SECTION 2: What a Balanced Team Looks Like ── */}
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
                color: "oklch(65% 0.17 280)",
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
              What a Balanced Team Looks Like
            </h2>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(80% 0.04 260)",
                marginBottom: "1.25rem",
              }}
            >
              Balance across OCEAN doesn&rsquo;t mean everyone scores at the
              midpoint. It means the team has a range — and knows how to use it.
              A team of all high-O members generates brilliant ideas and executes
              none of them. A team of all high-C members delivers reliably but
              stagnates when the environment demands reinvention.
            </p>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(80% 0.04 260)",
                marginBottom: "1.5rem",
              }}
            >
              Healthy OCEAN balance looks like:
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
                  label: "Creative tension",
                  body: "High-O members challenge assumptions; low-O members test those challenges against reality. Both are essential.",
                },
                {
                  label: "Reliability and adaptability",
                  body: "High-C members ensure commitments are kept; low-C members keep the team from becoming too rigid. Each needs the other.",
                },
                {
                  label: "Visible and quiet contributors",
                  body: "Teams that draw on both extroverted energy and introverted depth make better decisions than teams dominated by either.",
                },
                {
                  label: "Harmony and healthy friction",
                  body: "High-A members build the relational trust that makes hard conversations possible. Low-A members have those hard conversations. Remove either and the team suffers.",
                },
                {
                  label: "Stability and sensitivity",
                  body: "Emotionally stable members anchor the team in crisis; emotionally sensitive members notice what the stable ones miss. Psychological safety requires both.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "oklch(22% 0.10 260)",
                    padding: "1.25rem 1.5rem",
                    borderLeft: "3px solid oklch(52% 0.22 280)",
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

      {/* ── SECTION 3: Common Team Tensions ── */}
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
              color: "oklch(65% 0.17 280)",
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
              marginBottom: "2.5rem",
            }}
          >
            OCEAN Combinations That Create Predictable Tensions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1px",
              background: "oklch(30% 0.10 260 / 0.5)",
            }}
          >
            {TENSIONS.map((t) => (
              <div
                key={t.combo}
                style={{
                  background: "oklch(26% 0.10 260)",
                  padding: "2rem 1.75rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(52% 0.22 280)",
                    marginBottom: "0.375rem",
                  }}
                >
                  {t.combo}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "oklch(97% 0.005 80)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {t.label}
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
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Cross-Cultural Note ── */}
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
                color: "oklch(52% 0.22 280)",
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
              A Cross-Cultural Caution
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
              The Big Five has been validated across dozens of cultures, but some
              OCEAN traits are more culturally influenced than others. Before
              drawing conclusions from team scores, consider:
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[
                {
                  trait: "Agreeableness",
                  note: "High agreeableness may reflect cultural norms around face-saving, deference, or relational harmony — not an absence of directness. In collectivist cultures, an individual may score high-A without being conflict-avoidant at the relational level they're actually operating in.",
                },
                {
                  trait: "Extraversion",
                  note: "In cultures where verbal restraint is a sign of wisdom, low extraversion scores may not capture actual social confidence or relational depth. A low-E score from a high-context culture may reflect cultural communication norms more than introversion.",
                },
                {
                  trait: "Conscientiousness",
                  note: "In polychronic cultures where time is relational rather than sequential, lower conscientiousness may reflect a different — equally valid — way of honouring commitments. Don't read it as unreliability.",
                },
              ].map((item) => (
                <div
                  key={item.trait}
                  style={{
                    background: "oklch(22% 0.08 260)",
                    padding: "1.5rem",
                    borderLeft: "3px solid oklch(52% 0.22 280)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "oklch(65% 0.17 280)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.trait}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "oklch(78% 0.04 260)",
                      margin: 0,
                    }}
                  >
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Biblical anchor */}
            <div
              style={{
                background: "oklch(30% 0.12 260)",
                padding: "1.5rem 2rem",
                marginTop: "2.5rem",
                borderLeft: "3px solid oklch(65% 0.15 45)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.125rem",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  color: "oklch(90% 0.006 80)",
                  marginBottom: "0.5rem",
                }}
              >
                &ldquo;Each of you should use whatever gift you have received to
                serve others, as faithful stewards of God&rsquo;s grace in its
                various forms.&rdquo;
              </p>
              <p
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                  margin: 0,
                }}
              >
                1 Peter 4:10
              </p>
            </div>
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
          <div style={{ marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(52% 0.22 280)",
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
              Big Five Team Assessment
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
              50 statements. Rate each 1–5 based on how accurately it describes
              you. Be honest — this is for your team&rsquo;s benefit.
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
                50 statements rated on a 5-point scale. Describe how you
                actually are — not how you&rsquo;d like to be. The more honest
                your answers, the more useful your team&rsquo;s collective
                picture.
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
                      color: "oklch(52% 0.22 280)",
                      margin: 0,
                    }}
                  >
                    Question {currentIdx + 1} of {QUESTION_ORDER.length}
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
                      background: "oklch(52% 0.22 280)",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <div
                style={{
                  background: "oklch(22% 0.08 260)",
                  padding: "2rem 2rem 1.5rem",
                  marginBottom: "0",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "clamp(1rem, 2vw, 1.125rem)",
                    lineHeight: 1.55,
                    color: "oklch(97% 0.005 80)",
                    margin: 0,
                  }}
                >
                  {QUESTIONS_RAW[QUESTION_ORDER[currentIdx]].text}
                </p>
              </div>

              {/* Scale buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "2px",
                  marginBottom: "1.5rem",
                }}
              >
                {SCALE_LABELS.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i + 1)}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "1rem 0.5rem",
                      background: "oklch(28% 0.10 260)",
                      color: "oklch(88% 0.006 80)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.375rem",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "oklch(35% 0.14 280)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "oklch(28% 0.10 260)";
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 900,
                        fontSize: "1.25rem",
                        color: "oklch(65% 0.17 280)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        lineHeight: 1.3,
                        color: "oklch(62% 0.04 260)",
                      }}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleBack}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "oklch(55% 0.008 260)",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  padding: "0.5rem 0",
                }}
              >
                ← Back
              </button>
            </div>
          )}

          {/* DONE STATE */}
          {quizState === "done" && (
            <div style={{ maxWidth: "700px" }}>
              {/* Score bars */}
              <div
                style={{
                  background: "oklch(22% 0.08 260)",
                  padding: "2.5rem",
                  marginBottom: "1.5rem",
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
                    height: "4px",
                    background: "oklch(52% 0.22 280)",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "oklch(65% 0.17 280)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Your OCEAN Profile
                </p>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  {TRAITS.map((trait) => {
                    const displayPct =
                      trait.key === "N" ? stabilityPct : pcts[trait.key];
                    const label =
                      trait.key === "N" ? "Emotional Stability" : trait.name;
                    return (
                      <div key={trait.key}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.625rem",
                            }}
                          >
                            <div
                              style={{
                                width: "2rem",
                                height: "2rem",
                                background: trait.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "var(--font-montserrat)",
                                fontWeight: 900,
                                fontSize: "0.875rem",
                                color: "oklch(97% 0.005 80)",
                                flexShrink: 0,
                              }}
                            >
                              {trait.key}
                            </div>
                            <span
                              style={{
                                fontFamily: "var(--font-montserrat)",
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                color: "oklch(90% 0.006 80)",
                              }}
                            >
                              {label}
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span
                              style={{
                                fontFamily: "var(--font-montserrat)",
                                fontWeight: 800,
                                fontSize: "1.125rem",
                                color: trait.colorLight,
                              }}
                            >
                              {displayPct}%
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.68rem",
                                color: "oklch(55% 0.04 260)",
                                marginLeft: "0.5rem",
                              }}
                            >
                              {pctLabel(displayPct)}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
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
                              width: `${displayPct}%`,
                              background: trait.color,
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Closing insight */}
                <div
                  style={{
                    background: "oklch(16% 0.08 260 / 0.6)",
                    padding: "1.25rem 1.5rem",
                    borderLeft: "3px solid oklch(65% 0.15 45)",
                    marginTop: "2rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.0625rem",
                      fontStyle: "italic",
                      lineHeight: 1.7,
                      color: "oklch(88% 0.006 80)",
                      margin: 0,
                    }}
                  >
                    Five scores. One honest picture of how you&rsquo;re wired.
                    Your team now has this — use it to understand, not to judge.
                  </p>
                </div>
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
                    href="/dashboard?tab=team"
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
                    ✓ Saved to Team Dashboard
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
                      display: "inline-block",
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
            background: "oklch(52% 0.22 280)",
          }}
        />
        <div
          className="container-wide"
          style={{ paddingLeft: "2.5rem" }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.17 280)",
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
            Five scores. One honest picture.
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
            Share your results with your team. The conversation that follows is
            more valuable than the scores themselves.
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
                background: "oklch(52% 0.22 280)",
                color: "oklch(97% 0.005 80)",
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
