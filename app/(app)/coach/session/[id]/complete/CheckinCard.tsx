"use client";

import { useState } from "react";
import { useT, type CoachLang } from "../../../i18n";

// Post-session check-in (item 2/7) — 1-tap clarity slider (1-5) + optional one-line
// skippable note. Shown before the person leaves this page for the dashboard.
// Persists via the same PATCH route sessions already use (clarity_score/checkin_note
// columns on wp_sessions).
export default function CheckinCard({ sessionId, lang }: { sessionId: string; lang: CoachLang }) {
  const s = useT(lang);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (skip: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (!skip && score !== null) {
        await fetch("/api/coach/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, clarity_score: score, checkin_note: note.trim() || null }),
        });
      }
    } catch {
      // fire-and-forget — never blocks the person leaving the page
    }
    setDone(true);
  };

  if (done) return null;

  return (
    <div style={{
      marginBottom: "2.5rem",
      padding: "1.5rem 1.5rem 1.25rem",
      background: "white",
      borderRadius: "6px",
      border: "1px solid oklch(90% 0.005 80)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
    }}>
      <p style={{
        fontFamily: "var(--font-cormorant)",
        fontStyle: "italic",
        fontSize: "1.15rem",
        color: "oklch(22% 0.008 260)",
        margin: "0 0 1rem",
      }}>
        {s.checkinHeading}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setScore(n)}
            aria-label={String(n)}
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem",
              border: score === n ? "2px solid oklch(65% 0.15 45)" : "1px solid oklch(85% 0.008 80)",
              background: score === n ? "oklch(65% 0.15 45)" : "white",
              color: score === n ? "white" : "oklch(40% 0.008 260)",
              cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(55% 0.008 260)" }}>{s.checkinNotClear}</span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(55% 0.008 260)" }}>{s.checkinVeryClear}</span>
      </div>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={s.checkinNotePlaceholder}
        maxLength={280}
        style={{
          width: "100%", boxSizing: "border-box",
          fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem",
          padding: "0.6rem 0.75rem",
          border: "1px solid oklch(88% 0.008 80)", borderRadius: "4px",
          marginBottom: "1rem",
        }}
      />

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={() => submit(false)}
          disabled={score === null || submitting}
          style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
            color: "white", background: score === null ? "oklch(80% 0.02 45)" : "oklch(65% 0.15 45)",
            border: "none", borderRadius: "4px", padding: "0.6rem 1.1rem",
            cursor: score === null ? "default" : "pointer",
          }}
        >
          {s.checkinSubmit}
        </button>
        <button
          onClick={() => submit(true)}
          disabled={submitting}
          style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.75rem",
            color: "oklch(55% 0.008 260)", background: "none",
            border: "none", cursor: "pointer", textDecoration: "underline",
          }}
        >
          {s.checkinSkip}
        </button>
      </div>
    </div>
  );
}
