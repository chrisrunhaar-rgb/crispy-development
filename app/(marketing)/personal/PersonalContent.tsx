"use client";

import { useLanguage } from "@/lib/LanguageContext";
import PersonalPreview from "./PersonalPreview";

export default function PersonalContent({ ctaHref = "/pricing" }: { ctaHref?: string }) {
  const { lang } = useLanguage();
  return (
    <div className="container-wide" style={{ paddingBlock: "clamp(3rem, 7vw, 5.5rem)" }}>
      <PersonalPreview language={lang} ctaHref={ctaHref} />
    </div>
  );
}
