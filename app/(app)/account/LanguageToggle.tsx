"use client";

import { useLanguage } from "@/lib/LanguageContext";

const navy = "oklch(30% 0.12 260)";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  const options: { value: "en" | "id"; label: string }[] = [
    { value: "en", label: "English" },
    { value: "id", label: "Bahasa Indonesia" },
  ];

  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      {options.map(({ value, label }) => {
        const isActive = lang === value;
        return (
          <button
            key={value}
            onClick={() => setLang(value)}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              fontWeight: 700,
              padding: "0.625rem 1.25rem",
              border: isActive ? "none" : `2px solid ${navy}`,
              background: isActive ? navy : "white",
              color: isActive ? "white" : navy,
              cursor: isActive ? "default" : "pointer",
              transition: "background 0.15s ease, color 0.15s ease",
              outline: "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
