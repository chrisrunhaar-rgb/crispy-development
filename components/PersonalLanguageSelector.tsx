"use client";

import { useState, useTransition } from "react";
import { setPersonalLanguage } from "@/app/(app)/dashboard/actions";

const LANGS = [
  { code: "en", label: "EN", full: "English" },
  { code: "id", label: "ID", full: "Indonesian" },
  { code: "nl", label: "NL", full: "Dutch" },
] as const;

type Lang = "en" | "id" | "nl";

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
      <div style={{ display: "flex", gap: "2px" }}>
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
                border: "1px solid",
                borderColor: isActive ? "oklch(65% 0.15 45)" : "oklch(82% 0.008 80)",
                background: isActive ? "oklch(65% 0.15 45)" : "transparent",
                color: isActive ? "oklch(97% 0.005 80)" : "oklch(48% 0.008 260)",
                cursor: isPending ? "default" : isActive ? "default" : "pointer",
                opacity: isPending ? 0.6 : 1,
                transition: "all 0.15s",
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
