"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

// Shown to logged-out visitors on free modules (e.g. paid reel traffic).
const COPY = {
  en: {
    text: "Enjoying this module? Create a free account for your personal dashboard and many more modules on Christian cross-cultural leadership.",
    button: "Sign up free",
  },
  id: {
    text: "Suka dengan modul ini? Buat akun gratis untuk dasbor pribadi Anda dan banyak modul lain tentang kepemimpinan Kristen lintas budaya.",
    button: "Daftar gratis",
  },
};

export default function SignupBanner({ redirectTo }: { redirectTo: string }) {
  const { lang } = useLanguage();
  const c = COPY[lang === "id" ? "id" : "en"];

  return (
    <div style={{ background: "oklch(22% 0.10 260)" }} className="py-4">
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-3">
        <p
          className="text-white text-sm sm:text-base text-center sm:text-left m-0"
          style={{ fontFamily: "var(--font-montserrat)", lineHeight: 1.5 }}
        >
          {c.text}
        </p>
        <Link
          href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="shrink-0 rounded-md px-5 py-2.5 text-sm font-bold no-underline"
          style={{
            background: "oklch(65% 0.15 45)",
            color: "oklch(22% 0.10 260)",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          {c.button}
        </Link>
      </div>
    </div>
  );
}
