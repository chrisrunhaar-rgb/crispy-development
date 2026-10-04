"use client";

import { useLanguage } from "@/lib/LanguageContext";
import TeamPreviewDashboard from "@/app/(app)/dashboard/TeamPreviewDashboard";
import type { Currency } from "@/lib/pricing";

export default function TeamContent({ ctaHref = "/pricing", currency }: { ctaHref?: string; currency: Currency }) {
  const { lang } = useLanguage();
  return (
    <div className="container-wide" style={{ paddingBlock: "clamp(3rem, 7vw, 5.5rem)" }}>
      <TeamPreviewDashboard language={lang} ctaHref={ctaHref} currency={currency} asPage />
    </div>
  );
}
