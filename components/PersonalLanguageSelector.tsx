"use client";

import { useState, useTransition } from "react";
import { setPersonalLanguage } from "@/app/(app)/dashboard/actions";

const LANGS = [
  { code: "en", label: "EN", full: "English" },
  { code: "id", label: "ID", full: "Indonesian" },
] as const;

type Lang = "en" | "id";

export default function PersonalLanguageSelector({ currentLanguage, compact = false }: { currentLanguage: Lang; compact?: boolean }) {
  const [optimisticLang, setOptimisticLang] = useState<Lang>(currentLanguage);
  const [isPending, startTransition] = useTransition();

  function handleChange(lang: Lang) {
    if (lang === optimisticLang || isPending) return;
    setOptimisticLang(lang);
    const formData = new FormData();
    formData.set("language", lang);
    startTransition(() => setPersonalLanguage(formData));
  }

  return (
    <div>
      {!compact && (
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "oklch(52% 0.008 260)",
          marginBottom: "0.5rem",
        }}>
          Content Language
        </p>
      )}
      <div style={{ display: "inline-flex", background: "oklch(18% 0.09 260)", borderRadius: 999, padding: "4px", gap: "2px", boxShadow: "inset 0 1px 3px oklch(10% 0.05 260 / 0.4)", opacity: isPending ? 0.7 : 1, transition: "opacity 0.15s" }}>
        {LANGS.map(({ code, label, full }) => {
          const isActive = optimisticLang === code;
          return (
            <button
              key={code}
              onClick={() => handleChange(code)}
              disabled={isPending}
              title={full}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "0.375rem 0.75rem",
                border: "none",
                borderRadius: 999,
                background: isActive ? "oklch(65% 0.15 45)" : "transparent",
                color: isActive ? "oklch(97% 0.005 80)" : "oklch(62% 0.06 260)",
                cursor: isPending ? "default" : isActive ? "default" : "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
