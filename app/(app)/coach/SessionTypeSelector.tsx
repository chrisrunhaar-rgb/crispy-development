"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT, type CoachLang } from "./i18n";

type Props = {
  trialExhausted: boolean;
  trialRemainingMinutes: number;
  lang?: CoachLang;
};

export default function SessionTypeSelector({ trialExhausted, trialRemainingMinutes, lang = "en" }: Props) {
  const [selected, setSelected] = useState<"deep" | "quick">("deep");
  const [starting, setStarting] = useState(false);
  const router = useRouter();
  const s = useT(lang);

  function handleStart() {
    setStarting(true);
    router.push(`/coach/session?type=${selected}`);
  }

  if (trialExhausted) {
    return (
      <div style={{
        background: "oklch(22% 0.06 260)",
        border: "1px solid oklch(35% 0.06 260)",
        padding: "1rem 1.25rem",
        marginBottom: "1rem",
        borderRadius: 8,
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.775rem",
          color: "oklch(72% 0.008 260)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          {s.trialExhaustedMsg}
        </p>
      </div>
    );
  }

  const canStart = trialRemainingMinutes >= (selected === "deep" ? 5 : 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {/* Selection tiles */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {(["deep", "quick"] as const).map(type => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelected(type)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                padding: "1rem 0.75rem",
                background: isSelected ? "oklch(28% 0.10 260)" : "oklch(22% 0.06 260)",
                border: `2px solid ${isSelected ? "oklch(65% 0.15 45)" : "oklch(32% 0.06 260)"}`,
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: isSelected ? "oklch(65% 0.15 45)" : "oklch(72% 0.008 260)",
              }}>
                {type === "deep" ? s.deep : s.quick}
              </span>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.65rem",
                color: "oklch(60% 0.008 260)",
                lineHeight: 1.3,
              }}>
                {type === "deep" ? s.deepType : s.quickType}
              </span>
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.62rem",
                color: "oklch(50% 0.008 260)",
                lineHeight: 1.3,
              }}>
                {type === "deep" ? s.deepTime : s.quickTime}
              </span>
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <button
        type="button"
        disabled={starting || !canStart}
        onClick={handleStart}
        style={{
          width: "100%",
          background: starting || !canStart ? "oklch(40% 0.06 260)" : "oklch(65% 0.15 45)",
          color: "white",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "0.9rem",
          border: "none",
          borderRadius: 999,
          cursor: starting || !canStart ? "not-allowed" : "pointer",
          transition: "background 0.15s ease",
        }}
      >
        {starting ? s.starting : s.startSession(selected === "deep" ? s.deep.toLowerCase() : s.quick.toLowerCase())}
      </button>

    </div>
  );
}
