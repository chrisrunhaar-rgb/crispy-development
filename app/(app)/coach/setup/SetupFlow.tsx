"use client";

import { useState } from "react";
import OnboardingIntro from "./OnboardingIntro";
import ProfileForm from "./ProfileForm";

type Props = {
  userId: string;
  isFirstTime: boolean;
  existing: {
    name?: string | null;
    organisation?: string | null;
    location?: string | null;
    home_culture?: string | null;
    host_culture?: string | null;
    months_in_context?: number | null;
    role?: string | null;
    notes?: string | null;
    selected_coach?: string | null;
  } | null;
  showIntroFirst: boolean;
};

export default function SetupFlow({ userId, isFirstTime, existing, showIntroFirst }: Props) {
  const [introComplete, setIntroComplete] = useState(!showIntroFirst);

  if (!introComplete) {
    return (
      <OnboardingIntro
        userId={userId}
        onComplete={() => setIntroComplete(true)}
      />
    );
  }

  // showIntroFirst=true means we just finished the intro — provide full-page wrapper
  // showIntroFirst=false means setup/page.tsx provides the wrapper already
  if (showIntroFirst) {
    return (
      <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>
        <div className="container-wide" style={{ paddingBlock: "3rem" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <ProfileForm userId={userId} isFirstTime={isFirstTime} existing={existing} />
          </div>
        </div>
      </div>
    );
  }

  return <ProfileForm userId={userId} isFirstTime={isFirstTime} existing={existing} />;
}
