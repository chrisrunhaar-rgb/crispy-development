"use client";

import { useLanguage } from "@/lib/LanguageContext";

const HEADING = {
  en: {
    heading: "Apply to join",
    subheading: "This platform is for Christian leaders navigating life and leadership across cultures. We review every application personally — not everyone will be accepted.",
  },
  id: {
    heading: "Daftar untuk bergabung",
    subheading: "Platform ini untuk pemimpin Kristen yang menavigasi kehidupan dan kepemimpinan lintas budaya. Kami meninjau setiap lamaran secara pribadi — tidak semua orang akan diterima.",
  },
};

export default function MembershipHeading() {
  const { lang } = useLanguage();
  const c = lang === "id" ? HEADING.id : HEADING.en;

  return (
    <>
      <h1 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "520px" }}>
        {c.heading}
      </h1>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)", maxWidth: "50ch" }}>
        {c.subheading}
      </p>
    </>
  );
}
