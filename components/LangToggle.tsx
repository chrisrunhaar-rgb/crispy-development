"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

type SupportedLang = "en" | "id" | "nl";

const BACK_LABEL: Record<SupportedLang, string> = {
  en: "All Resources",
  id: "Semua Sumber Daya",
  nl: "Alle Bronnen",
};

interface LangToggleProps {
  langs?: SupportedLang[];
}

export default function LangToggle({ langs = ["en", "id", "nl"] }: LangToggleProps) {
  const { lang: ctxLang, setLang } = useLanguage();
  const lang = (langs.includes(ctxLang as SupportedLang) ? ctxLang : langs[0]) as SupportedLang;

  return (
    <div style={{
      background: "oklch(22% 0.10 260)",
      padding: "12px 24px",
    }}>
      <div style={{
        maxWidth: 820,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Link
          href="/resources"
          style={{
            fontSize: 12,
            color: "oklch(65% 0.06 260)",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          ← {BACK_LABEL[lang]}
        </Link>
        {langs.length > 1 && (
          <div style={{ display: "flex", gap: 8 }}>
            {langs.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 6,
                  border: "1px solid",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  background: lang === l ? "oklch(65% 0.15 45)" : "transparent",
                  color: lang === l ? "oklch(15% 0.05 45)" : "oklch(65% 0.06 260)",
                  borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(42% 0.08 260)",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
