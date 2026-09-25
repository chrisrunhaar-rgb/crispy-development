"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  // Re-read on every navigation: the dashboard toggle (a server action) and
  // AuthLanguageSync change the cookie without going through setLang, so a
  // one-time read on mount left client pages in the old language.
  useEffect(() => {
    // Cookie takes precedence over localStorage
    const fromCookie = getCookieLang();
    if (fromCookie) {
      setLangState(fromCookie);
      return;
    }
    const stored = localStorage.getItem("crispy-lang") as Lang | null;
    if (stored && VALID_LANGS.includes(stored)) setLangState(stored);
  }, [pathname]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("crispy-lang", l);
    setCookieLang(l);
    // Persist to Supabase user metadata, then re-render server pages so they
    // pick up the new language (they read user_metadata, not client state)
    fetch("/api/set-language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: l }),
    })
      .catch(() => {
        // Logged out or offline: cookie + localStorage already set client-side
      })
      .finally(() => router.refresh());
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
