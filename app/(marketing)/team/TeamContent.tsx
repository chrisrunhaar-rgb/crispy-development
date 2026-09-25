"use client";

import { useLanguage } from "@/lib/LanguageContext";
import TeamPreviewDashboard from "@/app/(app)/dashboard/TeamPreviewDashboard";

export default function TeamContent({ ctaHref = "/pricing" }: { ctaHref?: string }) {
  const { lang } = useLanguage();
  return (
    <div className="container-wide" style={{ paddingBlock: "clamp(3rem, 7vw, 5.5rem)" }}>
      <TeamPreviewDashboard language={lang} ctaHref={ctaHref} asPage />
    </div>
  );
}
