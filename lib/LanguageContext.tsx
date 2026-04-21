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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const VALID_LANGS: Lang[] = ["en", "id", "nl", "es", "fr", "pt"];

  useEffect(() => {
    const stored = localStorage.getItem("crispy-lang") as Lang | null;
    if (stored && VALID_LANGS.includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("crispy-lang", l);
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
