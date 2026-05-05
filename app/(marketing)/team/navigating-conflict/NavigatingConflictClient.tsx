"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { saveConflictStyle } from "../actions";

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────

type QuizOption = { text: string; type: "A" | "C" | "M" };
type QuizQuestion = { q: string; options: QuizOption[] };

const QUESTIONS: QuizQuestion[] = [
  {
    q: "When tension rises in a team meeting, you usually:",
    options: [
      { text: "Hope it resolves itself — maybe it's not that serious", type: "A" },
      { text: "Name it directly — silence makes it worse", type: "C" },
      { text: "Acknowledge the tension and suggest the team take a moment", type: "M" },
    ],
  },
  {
    q: "A colleague's behaviour is causing problems. You:",
    options: [
      { text: "Give it more time — maybe they'll realise on their own", type: "A" },
      { text: "Have a direct conversation with them as soon as possible", type: "C" },
      { text: "Prepare carefully and choose the right moment and tone", type: "M" },
    ],
  },
  {
    q: "In a conflict between two team members, you:",
    options: [
      { text: "Stay out of it — it's between them", type: "A" },
      { text: "Step in and help them work it out now", type: "C" },
      { text: "Listen to both privately before bringing them together", type: "M" },
    ],
  },
  {
    q: "When someone criticises your work publicly, you:",
    options: [
      { text: "Let it go — it's not worth a scene", type: "A" },
      { text: "Respond clearly and calmly in the moment", type: "C" },
      { text: "Address it privately afterwards", type: "M" },
    ],
  },
  {
    q: "After a difficult team meeting, you:",
    options: [
      { text: "Hope next week goes better", type: "A" },
      { text: "Send a follow-up message naming what happened", type: "C" },
      { text: "Check in with the people most affected", type: "M" },
    ],
  },
  {
    q: "Your philosophy on conflict is:",
    options: [
      { text: "Most tension resolves on its own if you're patient", type: "A" },
      { text: "Better to address it immediately than let it fester", type: "C" },
      { text: "Every conflict needs a process — rushing makes it worse", type: "M" },
    ],
  },
  {
    q: "When you're in a conflict, your biggest fear is:",
    options: [
      { text: "That addressing it will make things worse", type: "A" },
      { text: "That saying nothing will signal weakness", type: "C" },
      { text: "That the process will get messy or emotional", type: "M" },
    ],
  },
  {
    q: "Your team is stuck in a recurring conflict. You:",
    options: [
      { text: "Wonder if this team is just not compatible", type: "A" },
      { text: "Push for a frank conversation with the whole team", type: "C" },
      { text: "Look for the root issue and design a process to address it", type: "M" },
    ],
  },
  {
    q: "Someone comes to you venting about a colleague. You:",
    options: [
      { text: "Listen and try to help them feel better", type: "A" },
      { text: "Ask if they've spoken to the person directly", type: "C" },
      { text: "Help them think through what they want to say and how", type: "M" },
    ],
  },
  {
    q: "After a conflict is resolved, you:",
    options: [
      { text: "Feel relieved it's over — now let's move on", type: "A" },
      { text: "Feel good when things were named clearly and honestly", type: "C" },
      { text: "Want to debrief and make sure the repair is real", type: "M" },
    ],
  },
];

type StyleKey = "A" | "C" | "M";

const RESULTS: Record<StyleKey, { title: string; subtitle: string; description: string; tip: string; color: string }> = {
  A: {
    title: "The Protector",
    subtitle: "Conflict Style: Avoid",
    description: "Your instinct is to protect — the relationship, the atmosphere, the peace. This is a gift when used wisely. You read the room well and know when to let small tensions pass. Your growth edge: conflict avoided is rarely conflict resolved. Practice naming tension early, before it becomes a wound.",
    tip: "Team tip: Your team may need you to speak up before they will. Your silence can be read as agreement — even when you're deeply uncomfortable.",
    color: "oklch(55% 0.14 200)",
  },
  C: {
    title: "The Confronter",
    subtitle: "Conflict Style: Confront",
    description: "Your instinct is to address — directly, honestly, now. This is a gift when the team needs courage. You create a culture where things can be named and nothing festers underground. Your growth edge: directness without attunement can feel like attack. Pair truth-telling with genuine curiosity about the other person's experience.",
    tip: "Team tip: Not everyone has the same threshold for directness. Slow down before you speak — sometimes the right message delivered the wrong way closes the door.",
    color: "oklch(55% 0.18 45)",
  },
  M: {
    title: "The Mediator",
    subtitle: "Conflict Style: Mediate",
    description: "Your instinct is to facilitate — to find the right process, the right moment, the right bridge. This is a gift every team needs. You keep people in the conversation when others want to flee or fight. Your growth edge: sometimes people don't need a process, they need someone to just speak the truth plainly. Learn when to be direct.",
    tip: "Team tip: Your strength is in designing pathways for others. Don't let that gift become a way to avoid your own voice in the conflict.",
    color: "oklch(55% 0.15 260)",
  },
};

const PAUSE_STEPS = [
  {
    letter: "P",
    word: "Pray / Pause",
    body: "Before reacting, create space. Emotion makes conflict worse. Pause gives perspective. Even thirty seconds of silence can shift everything.",
  },
  {
    letter: "A",
    word: "Acknowledge",
    body: "Name what you observe, without judgment. \"I noticed tension in the last meeting.\" Naming it is not escalating it — it's the beginning of repair.",
  },
  {
    letter: "U",
    word: "Understand",
    body: "Seek to understand before being understood. Ask: \"What are you experiencing? Help me see this from your side.\" Real listening changes the room.",
  },
  {
    letter: "S",
    word: "Speak",
    body: "Now share your perspective — clearly, calmly, without accusation. Use \"I\" language. Speak from your experience, not from your verdict about theirs.",
  },
  {
    letter: "E",
    word: "Explore",
    body: "Look for a path forward together. What does repair look like? What do we need to commit to? The goal is not winning — it's restoration.",
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function NavigatingConflictClient({ user }: { user: User | null }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(StyleKey | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<StyleKey | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Shuffle options once per mount so they don't always appear in A/C/M order
  const [shuffledOptions] = useState(() =>
    QUESTIONS.map(q => [...q.options].sort(() => Math.random() - 0.5))
  );

  function handleAnswer(type: StyleKey) {
    const updated = [...answers];
    updated[currentQ] = type;
    setAnswers(updated);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const scores = { A: 0, C: 0, M: 0 };
      updated.forEach(a => { if (a) scores[a]++; });
      const winner = (Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]) as StyleKey;
      setResult(winner);
      setQuizComplete(true);
    }
  }

  function handleSave() {
    if (!result) return;
    const scores = { A: 0, C: 0, M: 0 };
    answers.forEach(a => { if (a) scores[a]++; });
    startTransition(async () => {
      const { error } = await saveConflictStyle(result, scores);
      if (error) {
        setSaveError(error);
      } else {
        setSaved(true);
      }
    });
  }

  const progressPct = quizComplete ? 100 : Math.round((currentQ / QUESTIONS.length) * 100);

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
          07
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
              Module 07
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
            Navigating Conflict
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: 0,
          }}>
            Every team that does real work has conflict. The teams that grow are not the ones that avoid it — they're the ones that have learned to move through it.
          </p>
        </div>
      </section>

      {/* ── SECTION 1: Conflict Is Not the Problem ── */}
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
            Conflict Is Not the Problem
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Conflict is information. It signals that people care enough to disagree. The absence of conflict is often more dangerous than its presence — it can mean people have stopped caring, or that someone has silenced everyone else.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "2rem",
          }}>
            The question is never "how do we prevent conflict?" — it's "how do we handle it in a way that builds trust rather than erodes it?" Teams that have never had conflict haven't built trust. They've built avoidance. And avoidance is one of the most expensive habits a team can have.
          </p>

          <div style={{
            background: "oklch(22% 0.08 260)",
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
              <strong style={{ color: "oklch(97% 0.005 80)", fontWeight: 700 }}>The right question: </strong>
              Not "do we have conflict?" but "do we have the tools to move through it together?"
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Types of Conflict ── */}
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
            Section 2
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}>
            Three Types of Conflict Worth Naming
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(78% 0.03 260)",
            marginBottom: "2rem",
          }}>
            Leaders who can identify which type of conflict they're in will respond far more effectively. Not all conflict is the same — and treating it as if it is will make things worse.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(22% 0.08 260 / 0.4)" }}>
            {[
              {
                label: "Task Conflict",
                body: "Disagreement about what we should do. Often healthy — it forces the team to think harder. Becomes unhealthy when it turns personal. The goal is not to eliminate task conflict, but to keep it focused on ideas, not people.",
                accent: "oklch(65% 0.15 45)",
              },
              {
                label: "Relationship Conflict",
                body: "Tension between people. Almost always destructive unless addressed early and honestly. Relationship conflict that isn't named tends to spread — it infects trust, colours decisions, and makes the team fragile.",
                accent: "oklch(55% 0.18 15)",
              },
              {
                label: "Process Conflict",
                body: "Disagreement about how we work. Can be healthy (improving systems) or toxic (power struggles). Watch for process conflict that is really about control — it rarely gets resolved by changing the process.",
                accent: "oklch(55% 0.15 260)",
              },
            ].map(item => (
              <div key={item.label} style={{
                background: "oklch(26% 0.10 260)",
                padding: "1.75rem 2rem",
                borderLeft: `3px solid ${item.accent}`,
              }}>
                <h3 style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: item.accent,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem",
                }}>
                  {item.label}
                </h3>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.75,
                  color: "oklch(78% 0.03 260)",
                  margin: 0,
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Cross-Cultural Dynamics ── */}
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
            Cross-Cultural Conflict Dynamics
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            Conflict is highly cultural — and cross-cultural teams are especially vulnerable to misreading it. The same behaviour will mean completely different things depending on where it happens.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
            {[
              {
                heading: "Low-context, low-power-distance cultures",
                body: "Direct confrontation is expected and respected. Naming tension openly signals health and courage. Staying silent reads as passive or dishonest.",
              },
              {
                heading: "High-context, high-power-distance cultures",
                body: "Direct confrontation is shameful and dangerous — especially across rank. Protecting relationship and face is the priority. Silence can be an act of respect.",
              },
            ].map(item => (
              <div key={item.heading} style={{
                background: "oklch(94% 0.007 80)",
                padding: "1.5rem",
                borderTop: "3px solid oklch(65% 0.15 45)",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "oklch(22% 0.08 260)",
                  marginBottom: "0.75rem",
                  lineHeight: 1.4,
                }}>
                  {item.heading}
                </h3>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  color: "oklch(42% 0.008 260)",
                  margin: 0,
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: "oklch(22% 0.08 260)",
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
              What looks like "avoiding conflict" in one culture is "protecting relationship" in another. What looks like "being direct" in one culture sounds like "being aggressive" in another. Leaders must build a team conflict norm that doesn't default to one culture's approach — and must create pathways for every team member to address tension safely.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Biblical Grounding ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(22% 0.08 260)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "2rem",
          }}>
            Biblical Grounding
          </p>

          <div style={{
            borderLeft: "3px solid oklch(65% 0.15 45)",
            paddingLeft: "2rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.65,
              color: "oklch(88% 0.04 260)",
              marginBottom: "0.75rem",
            }}>
              "If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over."
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              margin: 0,
            }}>
              Matthew 18:15
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            Jesus gives a clear conflict resolution framework: go directly, then bring witnesses, then bring the community. The principle is consistent: start small, go first, go privately. Conflict is not meant to be ignored or escalated — it's meant to be addressed at the lowest appropriate level. This is not just wisdom. It is grace.
          </p>

          <div style={{
            borderLeft: "3px solid oklch(65% 0.15 45)",
            paddingLeft: "2rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.65,
              color: "oklch(88% 0.04 260)",
              marginBottom: "0.75rem",
            }}>
              "Speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ."
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              margin: 0,
            }}>
              Ephesians 4:15
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(72% 0.04 260)",
            marginTop: "1.75rem",
            marginBottom: 0,
          }}>
            Truth without love is brutality. Love without truth is sentimentality. The goal of Kingdom conflict resolution is both — simultaneously. This is the most difficult thing in leadership, and it is also what makes teams extraordinary.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: PAUSE Framework ── */}
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
            marginBottom: "0.75rem",
          }}>
            The PAUSE Framework
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            A practical five-step process for moving through conflict with courage and care.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(22% 0.08 260 / 0.3)" }}>
            {PAUSE_STEPS.map((step, i) => (
              <div key={step.letter} style={{
                background: "oklch(26% 0.10 260)",
                padding: "1.5rem 2rem",
                display: "grid",
                gridTemplateColumns: "3rem 1fr",
                gap: "1.5rem",
                alignItems: "start",
              }}>
                <div style={{
                  width: "3rem",
                  height: "3rem",
                  background: "oklch(65% 0.15 45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 900,
                    fontSize: "1.25rem",
                    color: "oklch(97% 0.005 80)",
                    lineHeight: 1,
                  }}>
                    {step.letter}
                  </span>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "oklch(97% 0.005 80)",
                    marginBottom: "0.5rem",
                  }}>
                    {step.word}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9rem",
                    lineHeight: 1.75,
                    color: "oklch(72% 0.04 260)",
                    margin: 0,
                  }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "680px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            Conflict Style Assessment
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
          }}>
            What Is Your Conflict Style?
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "oklch(42% 0.008 260)",
            marginBottom: "2.5rem",
          }}>
            10 questions. Choose the response that feels most natural to you — not the one you think you should choose.
          </p>

          {!quizComplete ? (
            <div>
              {/* Progress bar */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "oklch(55% 0.008 260)",
                  }}>
                    Question {currentQ + 1} of {QUESTIONS.length}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "oklch(65% 0.15 45)",
                  }}>
                    {progressPct}%
                  </span>
                </div>
                <div style={{ height: "4px", background: "oklch(88% 0.008 80)", position: "relative" }}>
                  <div style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "oklch(65% 0.15 45)",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>

              {/* Question card */}
              <div style={{
                background: "oklch(22% 0.08 260)",
                padding: "2rem 2rem 1.75rem",
                marginBottom: "1.5rem",
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
                  lineHeight: 1.6,
                  color: "oklch(97% 0.005 80)",
                  margin: 0,
                }}>
                  {QUESTIONS[currentQ].q}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {shuffledOptions[currentQ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.type)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "1.25rem 1.5rem",
                      background: "oklch(94% 0.007 80)",
                      border: "1px solid oklch(88% 0.008 80)",
                      cursor: "pointer",
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.6,
                      color: "oklch(30% 0.08 260)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "oklch(22% 0.08 260)";
                      (e.currentTarget as HTMLButtonElement).style.color = "oklch(97% 0.005 80)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(65% 0.15 45)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "oklch(94% 0.007 80)";
                      (e.currentTarget as HTMLButtonElement).style.color = "oklch(30% 0.08 260)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(88% 0.008 80)";
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(currentQ - 1)}
                  style={{
                    marginTop: "1.25rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "oklch(55% 0.008 260)",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  ← Back
                </button>
              )}
            </div>
          ) : result ? (
            /* ── RESULT PANEL ── */
            <div>
              <div style={{
                background: "oklch(22% 0.08 260)",
                padding: "2.5rem",
                marginBottom: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}>
                <div aria-hidden="true" style={{
                  position: "absolute",
                  right: "-1rem",
                  bottom: "-1.5rem",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 900,
                  fontSize: "8rem",
                  color: "oklch(97% 0.005 80 / 0.04)",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}>
                  {result}
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1.25rem",
                  }}>
                    <div style={{
                      width: "10px",
                      height: "10px",
                      background: RESULTS[result].color,
                      borderRadius: "50%",
                    }} />
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: RESULTS[result].color,
                    }}>
                      {RESULTS[result].subtitle}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                    color: "oklch(97% 0.005 80)",
                    letterSpacing: "-0.02em",
                    marginBottom: "1.25rem",
                    lineHeight: 1.15,
                  }}>
                    {RESULTS[result].title}
                  </h3>

                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.8,
                    color: "oklch(78% 0.03 260)",
                    marginBottom: "1.75rem",
                  }}>
                    {RESULTS[result].description}
                  </p>

                  <div style={{
                    background: "oklch(30% 0.12 260)",
                    borderLeft: `3px solid ${RESULTS[result].color}`,
                    padding: "1.25rem 1.5rem",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "oklch(72% 0.04 260)",
                      margin: 0,
                    }}>
                      {RESULTS[result].tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save / auth CTA */}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  {!saved ? (
                    <button
                      onClick={handleSave}
                      disabled={isPending}
                      style={{
                        padding: "0.85rem 2rem",
                        background: "oklch(65% 0.15 45)",
                        color: "oklch(97% 0.005 80)",
                        border: "none",
                        cursor: isPending ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        letterSpacing: "0.04em",
                        opacity: isPending ? 0.7 : 1,
                      }}
                    >
                      {isPending ? "Saving…" : "Save to My Dashboard →"}
                    </button>
                  ) : (
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "oklch(50% 0.18 145)",
                    }}>
                      ✓ Saved to your dashboard
                    </p>
                  )}
                  {saveError && (
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.8rem",
                      color: "oklch(55% 0.18 15)",
                    }}>
                      {saveError}
                    </p>
                  )}
                  <button
                    onClick={() => { setCurrentQ(0); setAnswers(new Array(QUESTIONS.length).fill(null)); setQuizComplete(false); setResult(null); setSaved(false); setSaveError(null); }}
                    style={{
                      padding: "0.85rem 1.5rem",
                      background: "none",
                      color: "oklch(42% 0.008 260)",
                      border: "1px solid oklch(78% 0.008 260)",
                      cursor: "pointer",
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    Retake Quiz
                  </button>
                </div>
              ) : (
                <div style={{
                  background: "oklch(94% 0.007 80)",
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.9rem",
                    color: "oklch(38% 0.008 260)",
                    margin: 0,
                  }}>
                    Create a free account to save your conflict style to your dashboard.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <Link
                      href="/membership"
                      style={{
                        padding: "0.7rem 1.5rem",
                        background: "oklch(65% 0.15 45)",
                        color: "oklch(97% 0.005 80)",
                        textDecoration: "none",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        letterSpacing: "0.04em",
                        display: "inline-flex",
                      }}
                    >
                      Sign Up Free →
                    </Link>
                    <button
                      onClick={() => { setCurrentQ(0); setAnswers(new Array(QUESTIONS.length).fill(null)); setQuizComplete(false); setResult(null); }}
                      style={{
                        padding: "0.7rem 1.5rem",
                        background: "none",
                        color: "oklch(42% 0.008 260)",
                        border: "1px solid oklch(78% 0.008 260)",
                        cursor: "pointer",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      Retake
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 6rem)", background: "oklch(22% 0.08 260)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 6rem)", bottom: "clamp(4rem, 7vw, 6rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ paddingLeft: "3rem" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1rem)",
            fontStyle: "italic",
            lineHeight: 1.7,
            color: "oklch(65% 0.15 45)",
            marginBottom: "1.25rem",
            maxWidth: "48ch",
          }}>
            "The goal is not a team without conflict. The goal is a team that moves through conflict and comes out stronger."
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "oklch(97% 0.005 80)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}>
            Continue the Team Pathway
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/team/decision-making"
              style={{
                padding: "0.9rem 2rem",
                background: "oklch(65% 0.15 45)",
                color: "oklch(97% 0.005 80)",
                textDecoration: "none",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
                display: "inline-flex",
              }}
            >
              Module 08: Decision Making →
            </Link>
            <Link
              href="/team"
              style={{
                padding: "0.9rem 1.75rem",
                background: "none",
                color: "oklch(72% 0.04 260)",
                border: "1px solid oklch(42% 0.008 260)",
                textDecoration: "none",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "inline-flex",
              }}
            >
              View All Modules
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
