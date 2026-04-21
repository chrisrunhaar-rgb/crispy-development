"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const STAGES = [
  {
    id: 1,
    label: "WHY",
    title: "Why Do We Exist?",
    tagline: "The conviction behind the work",
    inputPlaceholder: "In one sentence, write what you believe is the deepest reason your team exists.",
    inputLabel: "Your answer",
  },
  {
    id: 2,
    label: "WHAT",
    title: "What Are We Building Together?",
    tagline: "The picture of shared success",
    inputPlaceholder: "Describe what your team's impact will look like in 3 years if you succeed together.",
    inputLabel: "Your answer",
  },
  {
    id: 3,
    label: "HOW",
    title: "How Will We Work Together?",
    tagline: "The values that define our behaviour",
    inputPlaceholder: "Name 3 values that you believe should define how your team works together. Why these?",
    inputLabel: "Your answer",
  },
  {
    id: 4,
    label: "TOGETHER",
    title: "Putting It Together",
    tagline: "Your team's purpose statement",
    inputPlaceholder: 'e.g. "Our team exists to [why] by [how] so that [what impact]."',
    inputLabel: "Your draft purpose statement",
  },
];

function Stage1Content() {
  return (
    <div>
      <p style={bodyStyle}>
        Simon Sinek's Golden Circle asks organisations to start with <em>why</em> — the conviction that drives everything else. But for cross-cultural teams, this question has a layer of complexity that generic leadership frameworks often miss.
      </p>
      <p style={bodyStyle}>
        "Why" isn't about the task. It's about the conviction behind it — the reason your team exists that goes beyond deliverables, targets, or job descriptions. For Kingdom-aligned teams, purpose often connects to something eternal: people being transformed, justice being served, the next generation being raised up, communities being restored.
      </p>
      <p style={bodyStyle}>
        Here's the cross-cultural challenge: people on your team may have deeply different "whys" — shaped by their backgrounds, their faith journeys, their cultures, and their personal histories. A team member from a community development background may be driven by systemic change. Another from a pastoral tradition may be moved by individual encounter. Neither is wrong. But if these different whys are never surfaced and connected, the team will silently pull in different directions.
      </p>
      <div style={calloutStyle}>
        <p style={{ ...calloutBodyStyle, fontWeight: 700, marginBottom: "0.5rem" }}>
          The goal of this stage:
        </p>
        <p style={{ ...calloutBodyStyle, margin: 0 }}>
          Surface your own deepest conviction about why your team exists. Don't write the "official" answer. Write the honest one — the one that gets you out of bed on hard days.
        </p>
      </div>
    </div>
  );
}

function Stage2Content() {
  return (
    <div>
      <p style={bodyStyle}>
        Vision is the picture of what success looks like 2–5 years from now. Not a mission statement — a picture. Something concrete enough to orient your decisions, and ambitious enough to require all of you to achieve it.
      </p>
      <p style={bodyStyle}>
        Good team vision has three qualities:
      </p>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem", margin: "1.25rem 0 1.5rem" }}>
        {[
          { label: "Concrete enough to be motivating", body: "You should be able to close your eyes and see it. Vague vision produces vague action." },
          { label: "Open enough to require all of us", body: "If one person could achieve it alone, it's not a team vision — it's a personal goal with an audience." },
          { label: "Rooted in something beyond any individual's ego", body: "Vision that serves the leader's legacy doesn't outlast the leader. Vision rooted in something eternal draws people beyond themselves." },
        ].map((item, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "2.5rem 1fr",
            gap: "0.875rem",
            alignItems: "start",
            background: "oklch(95% 0.005 80)",
            padding: "1.25rem 1.25rem 1.25rem 1rem",
          }}>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "oklch(88% 0.008 80)",
              lineHeight: 1,
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: "oklch(22% 0.08 260)", marginBottom: "0.3rem" }}>{item.label}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(42% 0.008 260)", margin: 0 }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p style={bodyStyle}>
        Cross-cultural nuance: research on motivation across cultures shows that in more collectivist contexts, vision tends to be people-centred — about the flourishing of the group, the community, the relationship. In more individualist contexts, vision tends to be outcome-centred — focused on achievement and impact. Neither is superior. A powerful shared vision finds a way to honour both: it names the impact <em>and</em> the people who will experience it.
      </p>
    </div>
  );
}

function Stage3Content() {
  return (
    <div>
      <p style={bodyStyle}>
        Values aren't aspirations — they're commitments. There's a critical difference. An aspiration is what you'd like to be true. A value is what you will actually do, especially when it costs you something.
      </p>
      <p style={bodyStyle}>
        A team's real values are revealed in three places: in conflict, in crisis, and in the moments no one's watching. When someone is under pressure, cutting corners, or tempted to protect themselves — what do they do? That's their actual value system in action. The question is whether that system is the one you've chosen together, or one that just emerged by default.
      </p>
      <p style={bodyStyle}>
        For multicultural teams, naming values explicitly is not optional — it's essential. Every person on your team comes with a set of deeply embedded cultural values that shape what "right" behaviour looks like. What counts as respectful communication. What signals trustworthiness. How disagreement should be handled. What a good leader does.
      </p>
      <div style={calloutStyle}>
        <p style={{ ...calloutBodyStyle, fontWeight: 700, color: "oklch(22% 0.08 260)", marginBottom: "0.5rem" }}>
          Without explicit conversation about values:
        </p>
        <ul style={{ margin: 0, padding: "0 0 0 1.25rem" }}>
          {[
            "One culture's norms quietly become the team's unspoken standard",
            "People violate each other's values without knowing it",
            "Trust erodes through misread signals and misunderstood behaviour",
          ].map((item, i) => (
            <li key={i} style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "oklch(38% 0.008 260)",
              marginBottom: "0.375rem",
            }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p style={{ ...bodyStyle, marginTop: "1.5rem" }}>
        The goal here isn't to produce a corporate-sounding list. It's to name the 3 values that your team actually needs — the ones that, if lived consistently, would make your team the kind of team you want to be.
      </p>
    </div>
  );
}

function Stage4Content({ answers }: { answers: string[] }) {
  return (
    <div>
      <p style={bodyStyle}>
        A purpose statement doesn't need to be perfect — it needs to be honest and shared. It's not a tagline for your website. It's a north star for your team's decision-making: something you can return to when priorities conflict, when the work gets hard, or when someone new joins and asks "what are we actually doing here?"
      </p>
      <p style={bodyStyle}>
        Here's a simple framework that holds everything together:
      </p>

      {/* Framework visual */}
      <div style={{
        background: "oklch(22% 0.08 260)",
        padding: "1.75rem 2rem",
        marginBottom: "2rem",
        border: "1px solid oklch(65% 0.15 45 / 0.25)",
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "oklch(65% 0.15 45)",
          marginBottom: "1.125rem",
        }}>
          The Framework
        </p>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
          color: "oklch(92% 0.005 80)",
          lineHeight: 1.7,
          margin: 0,
        }}>
          <span style={{ color: "oklch(72% 0.04 260)" }}>[Team name]</span>
          {" "}exists to{" "}
          <span style={{ color: "oklch(65% 0.15 45)", fontStyle: "italic" }}>[why]</span>
          {" "}by{" "}
          <span style={{ color: "oklch(65% 0.15 45)", fontStyle: "italic" }}>[how]</span>
          {" "}so that{" "}
          <span style={{ color: "oklch(65% 0.15 45)", fontStyle: "italic" }}>[what impact]</span>
          .
        </p>
      </div>

      {/* Previous answers summary — only show if they have content */}
      {answers.some(a => a.trim().length > 0) && (
        <div style={{ marginBottom: "2rem" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(48% 0.008 260)",
            marginBottom: "1rem",
          }}>
            Your reflections so far
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
            {[
              { label: "Your Why", value: answers[0] },
              { label: "Your What (3-year vision)", value: answers[1] },
              { label: "Your How (values)", value: answers[2] },
            ].map((item, i) => item.value.trim() ? (
              <div key={i} style={{
                background: "oklch(95% 0.005 80)",
                padding: "1rem 1.25rem",
                borderLeft: "3px solid oklch(65% 0.15 45 / 0.5)",
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                  marginBottom: "0.4rem",
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.9rem",
                  lineHeight: 1.65,
                  color: "oklch(32% 0.008 260)",
                  margin: 0,
                  fontStyle: "italic",
                }}>
                  "{item.value}"
                </p>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      <p style={bodyStyle}>
        Use the framework and your reflections above to draft a purpose statement in the box below. Don't overthink it — a rough, honest draft is more useful than a polished sentence you don't believe in. You'll refine this with your team.
      </p>
    </div>
  );
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "1rem",
  lineHeight: 1.8,
  color: "oklch(38% 0.008 260)",
  marginBottom: "1.5rem",
};

const calloutStyle: React.CSSProperties = {
  background: "oklch(95% 0.005 80)",
  borderLeft: "3px solid oklch(22% 0.08 260)",
  padding: "1.375rem 1.625rem",
  marginBottom: "1.5rem",
};

const calloutBodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "oklch(38% 0.008 260)",
};

export default function TeamPurposeVisionClient({ user }: { user: User | null }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);

  function updateAnswer(index: number, value: string) {
    setAnswers(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const stage = STAGES[currentStage - 1];
  const isLastStage = currentStage === STAGES.length;
  const isFirstStage = currentStage === 1;
  const finalAnswer = answers[3];

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
          02
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
              Module 02
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
              Workshop · 15–20 min
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
            maxWidth: "18ch",
          }}>
            Team Purpose &amp; Vision
          </h1>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "oklch(72% 0.04 260)",
            lineHeight: 1.7,
            maxWidth: "52ch",
            marginBottom: "0.75rem",
          }}>
            Define your why before your what.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            color: "oklch(60% 0.04 260)",
            lineHeight: 1.65,
            maxWidth: "52ch",
          }}>
            A guided 4-stage workshop to help you articulate a shared purpose and vision — the north star your team will return to when everything else gets complicated.
          </p>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 4.5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
            fontWeight: 600,
            lineHeight: 1.75,
            color: "oklch(22% 0.08 260)",
            marginBottom: "1.5rem",
          }}>
            A team without vision doesn't drift — it fragments. Every person quietly pursues their own definition of success, and the team slowly becomes a collection of individuals.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "1.5rem",
          }}>
            This isn't a failure of motivation or character. It's a structural problem: when purpose is unclear, individuals fill the gap with their own. Their personal values, assumptions, and priorities quietly become the team's operating system — and because none of it has been named, no one can see it or correct it.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "oklch(38% 0.008 260)",
            marginBottom: "2.5rem",
          }}>
            This workshop takes you through four stages — Why, What, How, and Together — to help you develop a clear, honest, cross-culturally grounded purpose statement. Your answers in this session are local to your browser — they won't be saved automatically. We'll suggest you copy them into a shared document with your team at the end.
          </p>

          {/* How this works */}
          <div style={{
            background: "oklch(95% 0.005 80)",
            padding: "1.75rem",
            borderTop: "3px solid oklch(65% 0.15 45)",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1rem",
            }}>
              How This Workshop Works
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              {STAGES.map(s => (
                <div key={s.id} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "white",
                    background: "oklch(22% 0.08 260)",
                    padding: "3px 8px",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}>
                    {s.label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "oklch(32% 0.008 260)",
                    lineHeight: 1.4,
                  }}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKSHOP STEPPER ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 4.5rem)", background: "oklch(30% 0.12 260)" }}>
        <div className="container-wide">

          {/* Progress bar */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                margin: 0,
              }}>
                Stage {currentStage} of {STAGES.length}
              </p>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.72rem",
                color: "oklch(55% 0.04 260)",
                margin: 0,
              }}>
                {stage.label} — {stage.tagline}
              </p>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {STAGES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStage(s.id)}
                  title={s.title}
                  style={{
                    width: s.id === currentStage ? "2.5rem" : "0.5rem",
                    height: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    background: s.id === currentStage
                      ? "oklch(65% 0.15 45)"
                      : s.id < currentStage
                      ? "oklch(65% 0.15 45 / 0.5)"
                      : "oklch(40% 0.08 260)",
                    transition: "all 0.25s ease",
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Stage content */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}>
            {/* Left: content */}
            <div style={{
              background: "oklch(97% 0.005 80)",
              padding: "2rem 2rem",
            }}>
              {/* Stage header */}
              <div style={{ marginBottom: "1.75rem", paddingBottom: "1.5rem", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "white",
                    background: "oklch(65% 0.15 45)",
                    padding: "4px 10px",
                  }}>
                    {stage.label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.72rem",
                    color: "oklch(55% 0.008 260)",
                  }}>
                    Stage {stage.id}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  color: "oklch(22% 0.08 260)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  margin: 0,
                }}>
                  {stage.title}
                </h2>
              </div>

              {/* Dynamic content per stage */}
              {currentStage === 1 && <Stage1Content />}
              {currentStage === 2 && <Stage2Content />}
              {currentStage === 3 && <Stage3Content />}
              {currentStage === 4 && <Stage4Content answers={answers} />}
            </div>

            {/* Right: reflection input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{
                background: "oklch(26% 0.11 260)",
                padding: "2rem",
              }}>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                  marginBottom: "0.75rem",
                }}>
                  {stage.inputLabel}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "oklch(72% 0.04 260)",
                  marginBottom: "1.25rem",
                }}>
                  {stage.inputPlaceholder}
                </p>
                <textarea
                  value={answers[currentStage - 1]}
                  onChange={e => updateAnswer(currentStage - 1, e.target.value)}
                  rows={6}
                  placeholder="Write your answer here…"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    width: "100%",
                    background: "oklch(22% 0.08 260)",
                    color: "oklch(92% 0.005 80)",
                    border: "1px solid oklch(38% 0.08 260)",
                    padding: "1rem",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  color: "oklch(50% 0.04 260)",
                  marginTop: "0.625rem",
                  fontStyle: "italic",
                }}>
                  Your answers are saved in your browser only — they won't be stored to any server.
                </p>
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentStage(s => Math.max(1, s - 1))}
                  disabled={isFirstStage}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: "transparent",
                    color: isFirstStage ? "oklch(40% 0.06 260)" : "oklch(72% 0.04 260)",
                    border: `1px solid ${isFirstStage ? "oklch(35% 0.06 260)" : "oklch(48% 0.06 260)"}`,
                    padding: "0.75rem 1.25rem",
                    cursor: isFirstStage ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  ← Previous
                </button>
                {!isLastStage ? (
                  <button
                    onClick={() => setCurrentStage(s => Math.min(STAGES.length, s + 1))}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      background: "oklch(65% 0.15 45)",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      cursor: "pointer",
                    }}
                  >
                    Next Stage →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const el = document.getElementById("purpose-result");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      background: "oklch(65% 0.15 45)",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      cursor: "pointer",
                    }}
                  >
                    See Your Draft →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL DRAFT RESULT ── */}
      <section id="purpose-result" style={{ paddingBlock: "clamp(3.5rem, 6vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ maxWidth: "760px" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(65% 0.15 45)",
            marginBottom: "0.875rem",
          }}>
            Your Draft
          </p>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "oklch(22% 0.08 260)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}>
            Your Team's Purpose Statement
          </h2>

          {finalAnswer.trim() ? (
            <div style={{
              background: "oklch(22% 0.08 260)",
              padding: "2.5rem 2.5rem 2.5rem 3rem",
              borderLeft: "4px solid oklch(65% 0.15 45)",
              marginBottom: "2rem",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                color: "oklch(92% 0.005 80)",
                lineHeight: 1.75,
                fontStyle: "italic",
                margin: 0,
              }}>
                "{finalAnswer}"
              </p>
            </div>
          ) : (
            <div style={{
              background: "oklch(94% 0.005 80)",
              border: "1px dashed oklch(78% 0.008 80)",
              padding: "2.5rem",
              textAlign: "center",
              marginBottom: "2rem",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9rem",
                color: "oklch(55% 0.008 260)",
                lineHeight: 1.65,
                margin: 0,
              }}>
                Complete Stage 4 of the workshop above to see your draft purpose statement here.
              </p>
            </div>
          )}

          {/* Summary of all answers */}
          {answers.some(a => a.trim().length > 0) && (
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(48% 0.008 260)",
                marginBottom: "1rem",
              }}>
                All Your Reflections
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {STAGES.map((s, i) => answers[i].trim() ? (
                  <div key={s.id} style={{
                    background: "oklch(95% 0.005 80)",
                    padding: "1rem 1.25rem",
                    display: "grid",
                    gridTemplateColumns: "4.5rem 1fr",
                    gap: "1rem",
                    alignItems: "start",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "white",
                      background: "oklch(65% 0.15 45)",
                      padding: "3px 8px",
                      display: "inline-block",
                      marginTop: "2px",
                    }}>
                      {s.label}
                    </span>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                      color: "oklch(32% 0.008 260)",
                      margin: 0,
                      fontStyle: "italic",
                    }}>
                      "{answers[i]}"
                    </p>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {/* Next step prompt */}
          <div style={{
            background: "oklch(95% 0.005 80)",
            borderTop: "3px solid oklch(65% 0.15 45)",
            padding: "1.75rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "oklch(22% 0.08 260)",
              marginBottom: "0.625rem",
            }}>
              Discuss these answers with your team at your next meeting.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "oklch(42% 0.008 260)",
              marginBottom: "1.25rem",
            }}>
              Copy your answers into a shared document and use them as the starting point for a team conversation. A purpose statement built together is one that everyone will own — and defend when the pressure is on.
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8rem",
              lineHeight: 1.65,
              color: "oklch(55% 0.008 260)",
            }}>
              Tip: Share all four answers — not just the final statement. The <em>why</em> and <em>how</em> reflections often produce the richest team discussion.
            </p>
          </div>
        </div>
      </section>

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
            Continue the Journey
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
            Purpose is the foundation. Now it's time to build.
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: "oklch(72% 0.04 260)",
            marginBottom: "2.5rem",
          }}>
            Continue your team journey on the dashboard — or go back and revisit what you built in Module 1.
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
              Back to Team Dashboard →
            </Link>
            <Link
              href="/team/team-foundations"
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
              ← Module 01: Team Foundations
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
