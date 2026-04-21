"use client";

import { useState, useTransition } from "react";
import { submitStepFeedback } from "@/app/(app)/dashboard/team-actions";

export type FeedbackEntry = {
  user_id: string;
  user_name: string;
  comment: string;
  rating: number | null;
  updated_at: string;
  is_current_user: boolean;
};

export default function StepFeedback({
  teamId,
  stepNumber,
  entries,
}: {
  teamId: string;
  stepNumber: number;
  entries: FeedbackEntry[];
}) {
  const existing = entries.find(e => e.is_current_user);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [editing, setEditing] = useState(!existing);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitStepFeedback(teamId, stepNumber, comment, rating);
      if (result.error) {
        setError(result.error);
      } else {
        setEditing(false);
      }
    });
  }

  return (
    <div>
      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.58rem",
        fontWeight: 700,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "oklch(54% 0.008 260)",
        marginBottom: "0.875rem",
      }}>
        Team Reflections
      </p>

      {/* Existing feedback from all team members */}
      {entries.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
          {entries.map(entry => (
            <div key={entry.user_id} style={{
              padding: "0.875rem 1rem",
              background: entry.is_current_user ? "oklch(65% 0.15 45 / 0.06)" : "oklch(98% 0.003 80)",
              border: `1px solid ${entry.is_current_user ? "oklch(65% 0.15 45 / 0.2)" : "oklch(90% 0.004 80)"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.375rem", gap: "0.5rem" }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: entry.is_current_user ? "oklch(42% 0.12 260)" : "oklch(38% 0.008 260)",
                }}>
                  {entry.user_name}{entry.is_current_user ? " (you)" : ""}
                </span>
                {entry.rating !== null && (
                  <div style={{ display: "flex", gap: "1px", flexShrink: 0 }}>
                    {[1,2,3,4,5].map(n => (
                      <span key={n} style={{
                        fontSize: "0.65rem",
                        color: n <= entry.rating! ? "oklch(65% 0.15 45)" : "oklch(82% 0.006 80)",
                      }}>★</span>
                    ))}
                  </div>
                )}
              </div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8rem",
                color: "oklch(42% 0.008 260)",
                lineHeight: 1.6,
                margin: 0,
              }}>
                {entry.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* My comment form */}
      {editing ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.62rem",
              fontWeight: 700,
              color: "oklch(52% 0.008 260)",
              marginBottom: "0.375rem",
              letterSpacing: "0.05em",
            }}>
              {existing ? "Edit your reflection" : "Share your reflection"}
            </p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="What did you learn or experience in this step?"
              required
              rows={3}
              style={{
                width: "100%",
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                color: "oklch(22% 0.005 260)",
                border: "1px solid oklch(82% 0.008 80)",
                padding: "0.625rem 0.75rem",
                resize: "vertical",
                outline: "none",
                lineHeight: 1.6,
                background: "white",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.62rem",
              fontWeight: 700,
              color: "oklch(52% 0.008 260)",
              marginBottom: "0.375rem",
              letterSpacing: "0.05em",
            }}>
              Rating (optional)
            </p>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(rating === n ? null : n)}
                  style={{
                    fontSize: "1.25rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 2px",
                    color: rating !== null && n <= rating ? "oklch(65% 0.15 45)" : "oklch(82% 0.006 80)",
                    transition: "color 0.1s",
                    lineHeight: 1,
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(50% 0.18 20)" }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              type="submit"
              disabled={isPending || !comment.trim()}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                background: "oklch(30% 0.12 260)",
                color: "white",
                border: "none",
                padding: "0.55rem 1.25rem",
                cursor: isPending || !comment.trim() ? "default" : "pointer",
                opacity: isPending || !comment.trim() ? 0.5 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {isPending ? "Saving…" : "Post Reflection"}
            </button>
            {existing && (
              <button
                type="button"
                onClick={() => { setComment(existing.comment); setRating(existing.rating); setEditing(false); }}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.68rem",
                  color: "oklch(52% 0.008 260)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            background: "transparent",
            color: "oklch(42% 0.08 260)",
            border: "1px solid oklch(82% 0.008 80)",
            padding: "0.45rem 1rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {existing ? "Edit reflection" : "Add reflection +"}
        </button>
      )}
    </div>
  );
}
