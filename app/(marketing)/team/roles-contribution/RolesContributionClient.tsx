"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveContributionZone } from "../actions";

type ZoneKey = "P" | "B" | "C" | "D";

const ZONES: Record<ZoneKey, {
  label: string;
  tagline: string;
  description: string;
  contribution: string;
  growthEdge: string;
  color: string;
  bgLight: string;
  teamTip: string;
}> = {
  P: {
    label: "Pioneer",
    tagline: "Drives new ideas, opens doors, takes first steps.",
    description: "You bring momentum and courage. You make things begin. Pioneers thrive in ambiguity and change — where others hesitate, you move.",
    contribution: "Innovation, momentum, vision",
    growthEdge: "Learning to hand off well — and trust others to carry what you started.",
    color: "oklch(52% 0.18 20)",
    bgLight: "oklch(97% 0.005 20)",
    teamTip: "Your team needs you to launch — and then consciously make space for Builders to implement. The greatest gift you can give after starting something is a clean handoff.",
  },
  B: {
    label: "Builder",
    tagline: "Takes what's been started and makes it real.",
    description: "You turn vision into systems and chaos into structure. Where others dream, you deliver. Builders are the reason things actually work.",
    contribution: "Implementation, processes, reliability",
    growthEdge: "Staying open to change — even when the system you built still feels improvable.",
    color: "oklch(48% 0.18 230)",
    bgLight: "oklch(97% 0.005 230)",
    teamTip: "Your team depends on your ability to bring things to completion. Be explicit about the systems you build — others may not see them, but they feel the difference when they're gone.",
  },
  C: {
    label: "Connector",
    tagline: "Holds the relational fabric of the team together.",
    description: "You build bridges between people, cultures, and ideas. Where others focus on tasks, you see people. Connectors are often the invisible reason a team holds together.",
    contribution: "Unity, communication, collaboration",
    growthEdge: "Learning to speak hard truths — not just hold space for them.",
    color: "oklch(48% 0.18 145)",
    bgLight: "oklch(97% 0.005 145)",
    teamTip: "Your gift is often invisible until it's missing. Name it clearly so others can appreciate and protect it. And give yourself permission to raise the hard thing — your credibility with the team makes your honesty land better than most.",
  },
  D: {
    label: "Deepener",
    tagline: "Brings wisdom, depth, and quality to everything.",
    description: "You raise the standard and ask the questions that matter. Deepeners slow things down in the best possible way — by making sure the team thinks before it acts.",
    contribution: "Excellence, reflection, learning",
    growthEdge: "Learning to trust before everything is perfect — and launch before you're fully ready.",
    color: "oklch(50% 0.16 290)",
    bgLight: "oklch(97% 0.005 290)",
    teamTip: "Your gift is depth — but depth without momentum becomes stagnation. Pair your reflection with a decision point: 'I need to think about this until Tuesday, and then I'll give you my answer.'",
  },
};

const QUESTIONS: {
  text: string;
  options: { label: string; zone: ZoneKey }[];
}[] = [
  {
    text: "When a new project starts, you naturally:",
    options: [
      { label: "Push to get started — you can figure out the details later", zone: "P" },
      { label: "Plan the steps and figure out what needs to happen when", zone: "B" },
      { label: "Make sure everyone's on board and excited", zone: "C" },
      { label: "Ask whether this is the right direction before committing", zone: "D" },
    ],
  },
  {
    text: "When things are moving too slowly, you feel:",
    options: [
      { label: "Frustrated — you'd rather move fast and course-correct", zone: "P" },
      { label: "Concerned — are the right processes in place?", zone: "B" },
      { label: "Worried about what this is doing to team morale", zone: "C" },
      { label: "Thoughtful — slowness might signal something worth examining", zone: "D" },
    ],
  },
  {
    text: "Your greatest satisfaction at work comes from:",
    options: [
      { label: "Starting something that didn't exist before", zone: "P" },
      { label: "Completing a complex project from start to finish", zone: "B" },
      { label: "Seeing the team work together with genuine unity", zone: "C" },
      { label: "Doing something really well, with craft and care", zone: "D" },
    ],
  },
  {
    text: "When the team is in conflict, you tend to:",
    options: [
      { label: "Push for a decision — conflict is a sign of energy, not dysfunction", zone: "P" },
      { label: "Look for the systemic root cause and fix the process", zone: "B" },
      { label: "Step in to restore harmony and help people hear each other", zone: "C" },
      { label: "Slow down and ask: what is this conflict really about?", zone: "D" },
    ],
  },
  {
    text: "What role do you usually play in a creative brainstorm?",
    options: [
      { label: "Generate the wildest ideas and push the boundaries", zone: "P" },
      { label: "Evaluate which ideas are actually feasible", zone: "B" },
      { label: "Make sure everyone's ideas are heard and valued", zone: "C" },
      { label: "Push for depth — 'have we thought about what this really means?'", zone: "D" },
    ],
  },
  {
    text: "In a crisis, people usually come to you because:",
    options: [
      { label: "You're decisive and willing to try something bold", zone: "P" },
      { label: "You have a plan and you stay calm under pressure", zone: "B" },
      { label: "You hold people together and keep the team from fragmenting", zone: "C" },
      { label: "You ask the right questions and keep people from making rushed decisions", zone: "D" },
    ],
  },
  {
    text: "When you finish a project, you feel:",
    options: [
      { label: "Ready to start the next one", zone: "P" },
      { label: "Proud of the system you built that will outlast the project", zone: "B" },
      { label: "Most satisfied if the relationships were strengthened", zone: "C" },
      { label: "Still wondering if it could have been better", zone: "D" },
    ],
  },
  {
    text: "What frustrates you most in a team?",
    options: [
      { label: "Too much planning, too little action", zone: "P" },
      { label: "Projects that launch before they're properly set up", zone: "B" },
      { label: "People who prioritise tasks over people", zone: "C" },
      { label: "Rushing through important things without thinking them through", zone: "D" },
    ],
  },
  {
    text: "People would describe your work style as:",
    options: [
      { label: "Bold, fast, idea-generating", zone: "P" },
      { label: "Systematic, reliable, thorough", zone: "B" },
      { label: "Warm, collaborative, empathetic", zone: "C" },
      { label: "Thoughtful, precise, quality-driven", zone: "D" },
    ],
  },
  {
    text: "What does your best contribution to this team look like?",
    options: [
      { label: "Opening new doors no one else would have knocked on", zone: "P" },
      { label: "Building something solid that still works in five years", zone: "B" },
      { label: "Being the person who keeps the team together when things get hard", zone: "C" },
      { label: "Raising the standard of everything the team produces", zone: "D" },
    ],
  },
];

function shuffleOptions<T>(arr: T[]): T[] {
  // Deterministic shuffle for SSR safety — keep original order
  return arr;
}

export default function RolesContributionClient({ user }: { user: User | null }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(ZoneKey | null)[]>(Array(10).fill(null));
  const [quizComplete, setQuizComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  function handleAnswer(zone: ZoneKey) {
    const updated = [...answers];
    updated[currentQ] = zone;
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(i => i + 1), 200);
    } else {
      setQuizComplete(true);
    }
  }

  function getScores(): Record<ZoneKey, number> {
    const scores: Record<ZoneKey, number> = { P: 0, B: 0, C: 0, D: 0 };
    answers.forEach(a => { if (a) scores[a]++; });
    return scores;
  }

  function getPrimaryZone(): ZoneKey {
    const scores = getScores();
    return (Object.keys(scores) as ZoneKey[]).reduce((a, b) => scores[a] >= scores[b] ? a : b);
  }

  function handleSave() {
    const primaryZone = getPrimaryZone();
    const scores = getScores();
    startSaving(async () => {
      const result = await saveContributionZone(ZONES[primaryZone].label, scores as Record<string, number>);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setSaved(true);
      }
    });
  }

  const scores = quizComplete ? getScores() : null;
  const primaryZone = quizComplete ? getPrimaryZone() : null;
  const primaryZoneData = primaryZone ? ZONES[primaryZone] : null;
  const answeredCount = answers.filter(Boolean).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

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
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "-0.5rem",
          bottom: "-2rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 900,
          fontSize: "clamp(10rem, 28vw, 22rem)",
          color: "oklch(97% 0.005 80 / 0.03)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.06em",
        }}>
          06
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
              Module 06
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
              Article + Quiz · 15–20 min
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
            maxWidth: "16ch",
          }}>
            Roles & Contribution
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: 0,
          }}>
            Every person on your team is carrying a gift they may not have named yet. And every team has gaps it may not have mapped yet.
          </p>
        </div>
      </section>

      {/* ── HOOK ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
            fontWeight: 600,
            lineHeight: 1.75,
            color: "oklch(22% 0.08 260)",
            marginBottom: "1.5rem",
          }}>
            The best teams aren&apos;t built by hiring the most talented people. They&apos;re built by understanding what kind of contribution each person is uniquely wired to make — and creating conditions where that contribution can actually happen.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            This module introduces the four Contribution Zones — not personality types, but role orientations that describe how people naturally add value. You&apos;ll learn what each zone looks like in practice, what healthy team composition requires, and how to create space for every kind of contribution to be seen and honoured.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            The quiz at the end will help you identify your primary zone — and give you a language for talking with your team about theirs.
          </p>
        </div>
      </section>

      {/* ── SECTION 1: The Problem With Job Descriptions ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(30% 0.12 260)" }}>
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
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            The Problem With Job Descriptions
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Job descriptions define what someone is hired to do. They rarely capture what someone is uniquely gifted to do. Most organisations have people in roles that technically fit their CV — but don&apos;t map to the kind of contribution that actually energises them. The result is competent performance that doesn&apos;t quite come alive.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Great teams are built by recognising the difference between what someone was hired to do and what they were made to do. When people work inside their contribution zone — the intersection of skill, passion, and team need — something shifts. They don&apos;t just perform better. They sustain. They grow. They give more than was asked.
          </p>

          <div style={{
            background: "oklch(22% 0.08 260 / 0.5)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.7,
              color: "oklch(82% 0.04 260)",
              margin: 0,
            }}>
              <strong style={{ color: "oklch(97% 0.005 80)", fontWeight: 700 }}>The leader&apos;s question: </strong>
              Do you know the difference between what each person on your team does and what they were made to do? If you don&apos;t know the answer, they may not either — and that&apos;s an invitation.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOUR CONTRIBUTION ZONES CARDS ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.875rem",
          }}>
            Section 2
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.875rem",
          }}>
            The Four Contribution Zones
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(48% 0.008 260)",
            marginBottom: "3rem",
            maxWidth: "56ch",
          }}>
            These are not personality types. They are role orientations — describing the kind of value each person is wired to add. Most people have a primary and a secondary zone.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}>
            {(Object.keys(ZONES) as ZoneKey[]).map(key => {
              const zone = ZONES[key];
              return (
                <div key={key} style={{
                  background: "oklch(95% 0.005 80)",
                  border: "1px solid oklch(88% 0.008 80)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  borderTop: `3px solid ${zone.color}`,
                }}>
                  <div>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: zone.color,
                    }}>
                      {key} Zone
                    </span>
                    <h3 style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 800,
                      fontSize: "1.375rem",
                      color: "oklch(22% 0.08 260)",
                      margin: "0.375rem 0 0",
                      letterSpacing: "-0.02em",
                    }}>
                      {zone.label}
                    </h3>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "oklch(42% 0.008 260)",
                    margin: 0,
                  }}>
                    {zone.tagline}
                  </p>
                  <div style={{ borderTop: "1px solid oklch(88% 0.008 80)", paddingTop: "1rem" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: zone.color, marginBottom: "0.375rem" }}>
                      Contribution
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(42% 0.008 260)", margin: 0 }}>
                      {zone.contribution}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Healthy Composition ── */}
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
            Section 3
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
            What Healthy Contribution Looks Like
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Most people have a primary zone and a secondary zone. Neither is better than the other. Each is necessary. But most teams are imbalanced — and understanding your team&apos;s composition is the first step to doing something about it.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "oklch(22% 0.10 260 / 0.5)", marginBottom: "2rem" }}>
            {[
              { label: "Too many Pioneers", result: "Nothing gets finished. The team launches ten things and completes none." },
              { label: "Too many Builders", result: "Nothing new gets started. The team perfects existing systems while the world moves on." },
              { label: "Too many Connectors", result: "No one challenges the status quo. Harmony becomes more important than honesty." },
              { label: "Too many Deepeners", result: "The team stalls in reflection. Every decision takes twice as long as it should." },
            ].map(item => (
              <div key={item.label} style={{ background: "oklch(26% 0.11 260)", padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(97% 0.005 80)", marginBottom: "0.625rem" }}>
                  {item.label}
                </h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", margin: 0 }}>
                  {item.result}
                </p>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
          }}>
            The leader&apos;s job is not to hire people just like themselves. It&apos;s to understand the team&apos;s current composition, identify the gaps, and fill them — through deliberate delegation, targeted hiring, or intentional personal development.
          </p>
        </div>
      </section>

      {/* ── SECTION 4: Biblical Grounding ── */}
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
            Section 4
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
            Biblical Grounding: The Body Needs All Its Parts
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            The most profound team framework in Scripture isn&apos;t a leadership model or a strategy — it&apos;s a body. Paul&apos;s argument in 1 Corinthians 12 is not organisational theory. It&apos;s theology. Every gift is from the same Spirit. Every gift is different. Every gift is necessary.
          </p>

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
              color: "oklch(22% 0.08 260)",
              lineHeight: 1.6,
              marginBottom: "0.75rem",
            }}>
              &ldquo;The eye cannot say to the hand, &lsquo;I don&apos;t need you.&rsquo;&rdquo;
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
              1 Corinthians 12:21
            </cite>
          </blockquote>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Pioneers can&apos;t say to Builders: &ldquo;You&apos;re too slow.&rdquo; Deepeners can&apos;t say to Connectors: &ldquo;You&apos;re too soft.&rdquo; The eye cannot say to the hand it doesn&apos;t need it. The team that honours every contribution — not just the visible or prestigious ones — reflects the nature of the Body of Christ.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
          }}>
            Paul goes further: &ldquo;The parts that seem to be weaker are indispensable.&rdquo; The contributions that are hardest to quantify — the Connector who holds relationships together, the Deepener who asks the uncomfortable question — are often the ones the team cannot afford to lose. Naming them matters.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: Cross-Cultural Contribution ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(30% 0.12 260)" }}>
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
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Cross-Cultural Contribution
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            Contribution often looks different across cultures — and this difference is one of the most significant blind spots in multicultural team leadership.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "1.5rem",
          }}>
            In collectivist cultures, naming one&apos;s individual contribution can feel like self-promotion — people may hide their gifts to protect group harmony. In hierarchical cultures, only the leader&apos;s contribution is expected to be visible; others wait to be invited. In some cultures, the Deepener&apos;s questioning is experienced as loyalty; in others, it reads as disrespect.
          </p>

          <div style={{
            background: "oklch(22% 0.08 260 / 0.5)",
            borderLeft: "3px solid oklch(65% 0.15 45)",
            padding: "1.5rem 1.75rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.7,
              color: "oklch(82% 0.04 260)",
              margin: 0,
            }}>
              <strong style={{ color: "oklch(97% 0.005 80)", fontWeight: 700 }}>The leader&apos;s responsibility: </strong>
              Create active space for every team member&apos;s contribution to be named and valued — especially those who would never claim it themselves. Ask directly. Attribute contributions clearly. Never assume that silence means absence of contribution.
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
          }}>
            The most powerful thing a cross-cultural leader can do is give the gift of a name. &ldquo;What you did in that meeting — the way you held the room together — that&apos;s a gift. We need it.&rdquo; For someone who has spent years making themselves invisible to protect the group, that sentence can be transformative.
          </p>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(22% 0.08 260)" }}>
        <div className="container-wide" style={{ maxWidth: "700px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
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
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.875rem",
          }}>
            Contribution Zone Finder
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
            maxWidth: "52ch",
          }}>
            10 questions. Choose the response that is most true for you — not the one you think sounds best. Be honest; the result will be more useful.
          </p>

          {!quizComplete ? (
            <div>
              {/* Progress bar */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(55% 0.04 260)" }}>
                    Question {currentQ + 1} of {QUESTIONS.length}
                  </span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(65% 0.15 45)" }}>
                    {answeredCount}/{QUESTIONS.length}
                  </span>
                </div>
                <div style={{ height: "3px", background: "oklch(30% 0.12 260)", borderRadius: "2px" }}>
                  <div style={{
                    height: "3px",
                    width: `${progress}%`,
                    background: "oklch(65% 0.15 45)",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>

              {/* Question */}
              <div style={{ marginBottom: "2rem" }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                  color: "oklch(97% 0.005 80)",
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {QUESTIONS[currentQ].text}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {shuffleOptions(QUESTIONS[currentQ].options).map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.zone)}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      lineHeight: 1.55,
                      color: answers[currentQ] === opt.zone ? "white" : "oklch(82% 0.04 260)",
                      background: answers[currentQ] === opt.zone ? "oklch(65% 0.15 45)" : "oklch(30% 0.12 260)",
                      border: "1px solid",
                      borderColor: answers[currentQ] === opt.zone ? "oklch(65% 0.15 45)" : "oklch(38% 0.10 260)",
                      padding: "1rem 1.25rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      width: "100%",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                {currentQ > 0 && (
                  <button
                    onClick={() => setCurrentQ(i => i - 1)}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      letterSpacing: "0.06em",
                      background: "transparent",
                      color: "oklch(55% 0.04 260)",
                      border: "1px solid oklch(38% 0.10 260)",
                      padding: "0.75rem 1.25rem",
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                )}
                {answers[currentQ] !== null && currentQ < QUESTIONS.length - 1 && (
                  <button
                    onClick={() => setCurrentQ(i => i + 1)}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: "oklch(65% 0.15 45)",
                      color: "white",
                      border: "none",
                      padding: "0.875rem 1.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Next →
                  </button>
                )}
                {answers[currentQ] !== null && currentQ === QUESTIONS.length - 1 && (
                  <button
                    onClick={() => setQuizComplete(true)}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: "oklch(65% 0.15 45)",
                      color: "white",
                      border: "none",
                      padding: "0.875rem 1.75rem",
                      cursor: "pointer",
                    }}
                  >
                    See My Zone →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                marginBottom: "1.5rem",
              }}>
                Quiz complete — here are your results
              </p>

              {/* Score summary */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                {(Object.keys(ZONES) as ZoneKey[]).map(key => {
                  const zone = ZONES[key];
                  const count = scores?.[key] ?? 0;
                  const isPrimary = key === primaryZone;
                  return (
                    <div key={key} style={{
                      background: isPrimary ? "oklch(30% 0.12 260)" : "oklch(26% 0.10 260)",
                      border: isPrimary ? `2px solid ${zone.color}` : "2px solid transparent",
                      padding: "1rem 1.25rem",
                      minWidth: "80px",
                      textAlign: "center",
                    }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2rem", color: zone.color, lineHeight: 1, margin: "0 0 0.25rem" }}>
                        {count}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: isPrimary ? "oklch(88% 0.04 260)" : "oklch(55% 0.04 260)", margin: 0 }}>
                        {zone.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── RESULT PANEL ── */}
      {quizComplete && primaryZoneData && primaryZone && (
        <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(30% 0.12 260)" }}>
          <div className="container-wide" style={{ maxWidth: "760px" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: primaryZoneData.color,
                background: `${primaryZoneData.color}20`,
                padding: "4px 10px",
                display: "inline-block",
                marginBottom: "1rem",
              }}>
                Your Primary Zone
              </span>
              <h2 style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "oklch(97% 0.005 80)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}>
                {primaryZoneData.label}
              </h2>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "oklch(82% 0.04 260)",
                maxWidth: "56ch",
                margin: "0 0 2rem",
              }}>
                {primaryZoneData.description}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(22% 0.10 260 / 0.5)", marginBottom: "2.5rem" }}>
              {[
                { label: "Greatest Gift", text: primaryZoneData.contribution },
                { label: "Growth Edge", text: primaryZoneData.growthEdge },
              ].map(item => (
                <div key={item.label} style={{ background: "oklch(26% 0.11 260)", padding: "1.75rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: primaryZoneData.color, marginBottom: "0.5rem" }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.65, color: "oklch(82% 0.04 260)", margin: 0 }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Team Tip */}
            <div style={{
              borderLeft: "3px solid oklch(65% 0.15 45)",
              paddingLeft: "1.5rem",
              marginBottom: "2.5rem",
            }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.625rem" }}>
                Team Tip
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(82% 0.04 260)", margin: 0 }}>
                {primaryZoneData.teamTip}
              </p>
            </div>

            {/* Save button */}
            {user && !saved && (
              <div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "oklch(65% 0.15 45)",
                    color: "white",
                    border: "none",
                    padding: "0.875rem 1.75rem",
                    cursor: isSaving ? "wait" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving ? "Saving…" : "Save to Dashboard →"}
                </button>
                {saveError && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(58% 0.18 20)", marginTop: "0.75rem" }}>
                    {saveError}
                  </p>
                )}
              </div>
            )}

            {saved && (
              <div style={{ color: "oklch(55% 0.18 145)" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem" }}>
                  ✓ Saved to your dashboard
                </span>
              </div>
            )}

            {!user && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(62% 0.04 260)", marginTop: "1rem" }}>
                <Link href="/signup" style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, textDecoration: "none" }}>
                  Sign up
                </Link>
                {" "}to save your contribution zone and return to it later.
              </p>
            )}

            {/* Retake option */}
            <button
              onClick={() => {
                setAnswers(Array(10).fill(null));
                setCurrentQ(0);
                setQuizComplete(false);
                setSaved(false);
              }}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                letterSpacing: "0.06em",
                background: "transparent",
                color: "oklch(55% 0.04 260)",
                border: "none",
                padding: "0.875rem 0",
                cursor: "pointer",
                display: "block",
                marginTop: "1rem",
                textDecoration: "underline",
              }}
            >
              Retake the quiz
            </button>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5.5rem)", background: "oklch(22% 0.08 260)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(3.5rem, 6vw, 5.5rem)", bottom: "clamp(3.5rem, 6vw, 5.5rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ paddingLeft: "2.5rem", maxWidth: "680px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            What&apos;s Next
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.375rem, 3vw, 2rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "1rem",
          }}>
            You know your zone. Now bring the whole team together.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            The most powerful use of this quiz is not individual — it&apos;s communal. Run it with your whole team, map your collective zones, and have an honest conversation about the gaps. Continue building on the Team Pathway.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/team"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.8125rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "oklch(65% 0.15 45)",
                color: "white",
                textDecoration: "none",
                padding: "0.875rem 1.75rem",
                display: "inline-block",
              }}
            >
              Back to Team Pathway →
            </Link>
            <Link
              href="/team/trust-psychological-safety"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                letterSpacing: "0.06em",
                color: "oklch(72% 0.04 260)",
                textDecoration: "none",
                padding: "0.875rem 0",
              }}
            >
              ← Module 05: Trust & Psychological Safety
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
