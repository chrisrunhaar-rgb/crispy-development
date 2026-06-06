"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations } from "./i18n";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

const VALID_LANGS: Lang[] = ["en", "id", "es", "fr", "pt"];

function getCookieLang(): Lang | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith("crispy-lang="));
  if (!match) return null;
  const value = match.split("=")[1] as Lang;
  return VALID_LANGS.includes(value) ? value : null;
}

function setCookieLang(l: Lang) {
  if (typeof document === "undefined") return;
  document.cookie = `crispy-lang=${l}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    // Cookie takes precedence over localStorage
    const fromCookie = getCookieLang();
    if (fromCookie) {
      setLangState(fromCookie);
      return;
    }
    const stored = localStorage.getItem("crispy-lang") as Lang | null;
    if (stored && VALID_LANGS.includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("crispy-lang", l);
    setCookieLang(l);
    // Fire-and-forget: persist to Supabase user metadata + set httpOnly-safe cookie via server
    fetch("/api/set-language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: l }),
    }).catch(() => {
      // Non-blocking — cookie + localStorage already set client-side
    });
  };

  // Fall back to English for languages without full translations yet
  const activeTranslations = (translations as unknown as Record<string, typeof translations.en>)[lang] ?? translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: activeTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
