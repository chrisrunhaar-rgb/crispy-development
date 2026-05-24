"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

type SupportedLang = "en" | "id";

const BACK_LABEL: Record<SupportedLang, string> = {
  en: "All Resources",
  id: "Semua Sumber Daya",
};

interface LangToggleProps {
  langs?: SupportedLang[];
}

export default function LangToggle({ langs = ["en", "id"] }: LangToggleProps) {
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
          <div style={{ display: "inline-flex", background: "oklch(18% 0.09 260)", borderRadius: 999, padding: "4px", gap: "2px", boxShadow: "inset 0 1px 3px oklch(10% 0.05 260 / 0.4)" }}>
            {langs.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  background: lang === l ? "oklch(65% 0.15 45)" : "transparent",
                  color: lang === l ? "oklch(97% 0.005 80)" : "oklch(62% 0.06 260)",
                  transition: "background 0.15s, color 0.15s",
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
