"use client";

import { useState, useTransition } from "react";
import { markStepCompleteByContentKey } from "@/app/(app)/dashboard/team-actions";
import { TEAM_UI, type TeamLang } from "@/lib/team-i18n";

export default function TeamStepCompleteButton({ contentUrl, lang = "en" }: { contentUrl: string; lang?: TeamLang }) {
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ui = TEAM_UI[lang];

  function handleClick() {
    startTransition(async () => {
      const { error } = await markStepCompleteByContentKey(contentUrl);
      if (!error) setDone(true);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={done || isPending}
      style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        background: done ? "oklch(52% 0.14 145 / 0.1)" : "oklch(65% 0.15 45)",
        color: done ? "oklch(38% 0.13 145)" : "white",
        border: `1.5px solid ${done ? "oklch(52% 0.14 145 / 0.4)" : "oklch(65% 0.15 45)"}`,
        padding: "0.625rem 1.375rem",
        cursor: done || isPending ? "default" : "pointer",
        opacity: isPending ? 0.6 : 1,
        transition: "all 0.15s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {done ? (
        <>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: "10px", height: "10px" }}>
            <path d="M1.5 6l3 3 6-6" />
          </svg>
          {ui.markedComplete}
        </>
      ) : isPending ? ui.saving : ui.markComplete}
    </button>
  );
}
