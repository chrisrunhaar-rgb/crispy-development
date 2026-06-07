"use client";
import { useLayoutEffect } from "react";

export function AuthLanguageSync({ lang }: { lang: "en" | "id" }) {
  useLayoutEffect(() => {
    document.cookie = `crispy-lang=${lang}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem("crispy-lang", lang);
  }, [lang]);
  return null;
}
