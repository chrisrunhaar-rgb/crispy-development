"use client";

import { useState } from "react";
import { useT, type CoachLang } from "../../../i18n";

// Post-session check-in — 3-question modal (clarity, felt understood, session value),
// each 1-5, plus optional note. Shown as a pop-up over the session notes on page load;
// notes reveal once answered, skipped, or closed. Persists via the same PATCH route
// sessions already use (clarity_score/alliance_score/value_score/checkin_note columns
// on wp_sessions).
export default function CheckinGate({
  sessionId,
  lang,
  children,
}: {
  sessionId: string;
  lang: CoachLang;
  children: React.ReactNode;
}) {
  const s = useT(lang);
  const [open, setOpen] = useState(true);
  const [clarity, setClarity] = useState<number | null>(null);
  const [alliance, setAlliance] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const anyAnswered = clarity !== null || alliance !== null || value !== null;

  const dismiss = async (skip: boolean) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (!skip && anyAnswered) {
        await fetch("/api/coach/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            clarity_score: clarity,
            alliance_score: alliance,
            value_score: value,
            checkin_note: note.trim() || null,
          }),
        });
      }
    } catch {
      // fire-and-forget — never blocks the person seeing their notes
    }
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20, 20, 25, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
        >
          <div style={{
            width: "100%",
            maxWidth: "460px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            padding: "1.75rem 1.75rem 1.5rem",
            position: "relative",
          }}>
            <button
              onClick={() => dismiss(true)}
              disabled={submitting}
              aria-label={s.checkinClose}
              style={{
                position: "absolute", top: "1rem", right: "1rem",
                width: "28px", height: "28px", borderRadius: "50%",
                border: "none", background: "oklch(95% 0.005 80)",
                color: "oklch(50% 0.008 260)", cursor: "pointer",
                fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1,
              }}
            >
              ×
            </button>

            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "1.3rem",
              color: "oklch(22% 0.008 260)",
              margin: "0 0 1.375rem",
              paddingRight: "1.5rem",
            }}>
              {s.checkinHeading}
            </p>

            <ScaleQuestion label={s.checkinQ1} value={clarity} onChange={setClarity} lowLabel={s.checkinLow} highLabel={s.checkinHigh} />
            <ScaleQuestion label={s.checkinQ2} value={alliance} onChange={setAlliance} lowLabel={s.checkinLow} highLabel={s.checkinHigh} />
            <ScaleQuestion label={s.checkinQ3} value={value} onChange={setValue} lowLabel={s.checkinLow} highLabel={s.checkinHigh} />

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
                marginBottom: "1.25rem",
              }}
            />

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button
                onClick={() => dismiss(false)}
                disabled={!anyAnswered || submitting}
                style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                  color: "white", background: !anyAnswered ? "oklch(80% 0.02 45)" : "oklch(65% 0.15 45)",
                  border: "none", borderRadius: "4px", padding: "0.65rem 1.1rem",
                  cursor: !anyAnswered ? "default" : "pointer",
                }}
              >
                {s.checkinSubmit}
              </button>
              <button
                onClick={() => dismiss(true)}
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
        </div>
      )}

      {!open && children}
    </>
  );
}

function ScaleQuestion({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number | null;
  onChange: (n: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p style={{
        fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem",
        color: "oklch(28% 0.008 260)", margin: "0 0 0.5rem",
      }}>
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={String(n)}
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
              border: value === n ? "2px solid oklch(65% 0.15 45)" : "1px solid oklch(85% 0.008 80)",
              background: value === n ? "oklch(65% 0.15 45)" : "white",
              color: value === n ? "white" : "oklch(40% 0.008 260)",
              cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(55% 0.008 260)" }}>{lowLabel}</span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(55% 0.008 260)" }}>{highLabel}</span>
      </div>
    </div>
  );
}
