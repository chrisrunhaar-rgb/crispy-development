"use client";
import { useState } from "react";

function formatSavedAt(iso: string, lang: "en" | "id"): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate();
    const months_en = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const months_id = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const month = lang === "id" ? months_id[d.getMonth()] : months_en[d.getMonth()];
    return `${day} ${month} ${d.getFullYear()}`;
  } catch {
    return "";
  }
}

type RaftPlan = { R: string; A: string; F: string; T: string; lang: string; saved_at: string };

const LABELS = {
  en: { R: "Reconciliation", A: "Affirmation", F: "Farewells", T: "Think Ahead" },
  id: { R: "Rekonsiliasi", A: "Peneguhan", F: "Perpisahan", T: "Persiapkan Masa Depan" },
};

const LETTER_COLORS: Record<string, string> = {
  R: "oklch(65% 0.15 45)",
  A: "oklch(55% 0.12 260)",
  F: "oklch(48% 0.10 180)",
  T: "oklch(52% 0.10 300)",
};

export default function RaftPlanTile({ plan, lang = "en" }: { plan: RaftPlan; lang: "en" | "id" }) {
  const [open, setOpen] = useState(false);
  const planLang = (plan.lang === "id" ? "id" : "en") as "en" | "id";
  const labels = LABELS[planLang];
  const acronym = planLang === "id" ? "RPPP" : "RAFT";
  const title = lang === "id" ? `Rencana ${acronym} Saya` : `My ${acronym} Plan`;
  const steps = ["R", "A", "F", "T"] as const;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: "100%",
          padding: "0.875rem 1rem",
          background: "oklch(96% 0.005 80)",
          border: "1px solid oklch(88% 0.008 80)",
          cursor: "pointer",
          textAlign: "left",
          marginTop: "0.75rem",
          transition: "border-color 0.15s ease",
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          background: "oklch(22% 0.10 260)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h8M2 12h5" stroke="oklch(96% 0.005 80)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "oklch(22% 0.10 260)",
            margin: 0,
            lineHeight: 1.3,
          }}>
            {title}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.7rem",
            color: "oklch(55% 0.008 260)",
            margin: "0.2rem 0 0",
            lineHeight: 1.3,
          }}>
            {lang === "id" ? "Ketuk untuk melihat jawaban Anda" : "Tap to view your answers"}
          </p>
        </div>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.7rem",
          color: "oklch(65% 0.15 45)",
          flexShrink: 0,
        }}>
          {lang === "id" ? "Buka →" : "Open →"}
        </span>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.05 260 / 0.6)",
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "oklch(100% 0 0)",
              width: "100%",
              maxWidth: 520,
              maxHeight: "90dvh",
              overflowY: "auto",
              padding: "2rem 1.75rem",
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", gap: "1rem" }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "oklch(65% 0.15 45)",
                  margin: "0 0 0.375rem",
                }}>
                  {lang === "id" ? "Rencana Transisi Saya" : "My Transition Plan"}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "1.125rem",
                  color: "oklch(22% 0.10 260)",
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  {title}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                  color: "oklch(55% 0.008 260)",
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {steps.map(key => (
                <div key={key} style={{ borderLeft: `3px solid ${LETTER_COLORS[key]}`, paddingLeft: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: LETTER_COLORS[key],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        color: "white",
                        lineHeight: 1,
                      }}>
                        {planLang === "id"
                          ? (key === "R" ? "R" : key === "A" ? "P" : key === "F" ? "P" : "P")
                          : key}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      color: "oklch(28% 0.10 260)",
                      margin: 0,
                    }}>
                      {labels[key]}
                    </p>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.85rem",
                    lineHeight: 1.65,
                    color: "oklch(38% 0.05 260)",
                    margin: 0,
                    fontStyle: "italic",
                  }}>
                    &ldquo;{plan[key]}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid oklch(88% 0.008 80)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.68rem",
                color: "oklch(62% 0.008 260)",
                margin: 0,
              }}>
                {lang === "id"
                  ? `Disimpan ${formatSavedAt(plan.saved_at, "id")} dari modul Transisi yang Sehat`
                  : `Saved ${formatSavedAt(plan.saved_at, "en")} from Healthy Transitions module`}
              </p>
              <button
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: "oklch(30% 0.12 260)",
                  background: "none",
                  border: "1px solid oklch(30% 0.12 260)",
                  padding: "0.45rem 1rem",
                  cursor: "pointer",
                }}
              >
                {lang === "id" ? "Tutup" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
