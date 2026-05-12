"use client";

import { useState } from "react";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  order_index: number;
};

type Props = {
  questions: QuizQuestion[];
};

export default function ChapterQuiz({ questions }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions.length) return null;

  const q = questions[current];
  const total = questions.length;
  const isCorrect = selected === q.correct_answer;

  function handleSelect(option: string) {
    if (selected !== null) return; // already answered
    setSelected(option);
    if (option === q.correct_answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  const scoreMsg =
    score === total
      ? "Perfect score — excellent work!"
      : score >= total * 0.67
      ? "Good job — keep it up!"
      : "Keep going — review the chapter and try again.";

  return (
    <section style={{
      borderTop: "4px solid oklch(65% 0.15 45)",
      background: "oklch(99% 0.003 80)",
      padding: "2rem 0 2.5rem",
      marginTop: "2rem",
    }}>
      <div style={{ maxWidth: "740px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-cormorant)", fontWeight: 600,
            fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", lineHeight: 1.1,
            color: "oklch(22% 0.10 260)", margin: 0,
          }}>
            Chapter Quiz
          </h2>
          {!done && (
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.65rem",
              fontWeight: 700, letterSpacing: "0.12em",
              color: "oklch(55% 0.008 260)", textTransform: "uppercase",
            }}>
              {current + 1} of {total}
            </span>
          )}
        </div>

        {done ? (
          /* ── Results ── */
          <div>
            <div style={{
              background: score === total ? "oklch(94% 0.04 155)" : score >= total * 0.67 ? "oklch(96% 0.04 50)" : "oklch(97% 0.02 20)",
              border: `2px solid ${score === total ? "oklch(52% 0.14 155)" : score >= total * 0.67 ? "oklch(65% 0.15 45)" : "oklch(55% 0.18 25)"}`,
              padding: "1.5rem",
              marginBottom: "1.25rem",
              display: "flex", alignItems: "center", gap: "1.5rem",
            }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{
                  fontFamily: "var(--font-cormorant)", fontWeight: 600,
                  fontSize: "2.75rem", lineHeight: 1,
                  color: "oklch(22% 0.10 260)",
                }}>
                  {score}/{total}
                </div>
                <div style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.65rem",
                  fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "oklch(52% 0.008 260)", marginTop: "0.25rem",
                }}>
                  Score
                </div>
              </div>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.9rem",
                lineHeight: 1.6, color: "oklch(28% 0.007 260)", margin: 0,
              }}>
                {scoreMsg}
              </p>
            </div>

            <button
              onClick={handleRetry}
              style={{
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: "oklch(22% 0.10 260)", color: "oklch(97% 0.005 80)",
                border: "none", padding: "0.625rem 1.25rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        ) : (
          /* ── Question ── */
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 600,
              fontSize: "0.9375rem", lineHeight: 1.65,
              color: "oklch(22% 0.10 260)", marginBottom: "1.25rem",
            }}>
              {q.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {q.options.map((opt) => {
                let bg = "oklch(97% 0.003 80)";
                let border = "1px solid oklch(88% 0.008 80)";
                let color = "oklch(28% 0.007 260)";

                if (selected !== null) {
                  if (opt === q.correct_answer) {
                    bg = "oklch(94% 0.04 155)";
                    border = "2px solid oklch(52% 0.14 155)";
                    color = "oklch(22% 0.10 260)";
                  } else if (opt === selected && !isCorrect) {
                    bg = "oklch(96% 0.025 20)";
                    border = "2px solid oklch(55% 0.18 25)";
                    color = "oklch(38% 0.10 25)";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={selected !== null}
                    style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.875rem",
                      lineHeight: 1.5, textAlign: "left",
                      background: bg, border, color,
                      padding: "0.75rem 1rem",
                      cursor: selected !== null ? "default" : "pointer",
                      transition: "background 0.1s, border 0.1s",
                      display: "flex", alignItems: "center", gap: "0.625rem",
                    }}
                  >
                    {selected !== null && opt === q.correct_answer && (
                      <span style={{ color: "oklch(52% 0.14 155)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    )}
                    {selected !== null && opt === selected && !isCorrect && (
                      <span style={{ color: "oklch(55% 0.18 25)", fontWeight: 700, flexShrink: 0 }}>✗</span>
                    )}
                    {(selected === null || (opt !== q.correct_answer && opt !== selected)) && (
                      <span style={{ flexShrink: 0, width: "1rem" }} />
                    )}
                    {opt}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <button
                onClick={handleNext}
                style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "oklch(65% 0.15 45)", color: "oklch(97% 0.005 80)",
                  border: "none", padding: "0.625rem 1.25rem",
                  cursor: "pointer",
                }}
              >
                {current + 1 < total ? "Next question →" : "See results →"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
