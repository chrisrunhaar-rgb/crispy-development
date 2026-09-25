"use client";

import { useLanguage } from "@/lib/LanguageContext";
import TeamPreviewDashboard from "@/app/(app)/dashboard/TeamPreviewDashboard";

export default function TeamContent() {
  const { lang } = useLanguage();
  return (
    <div className="container-wide" style={{ paddingBlock: "clamp(3rem, 7vw, 5.5rem)" }}>
      <TeamPreviewDashboard language={lang} asPage />
    </div>
  );
}
