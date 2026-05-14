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

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>
      <div style={{ background: "oklch(18% 0.08 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(14% 0.06 260)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.375rem" }}>
            WayPoint
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "white" }}>
            Set up your profile
          </h1>
        </div>
      </div>
      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <ProfileForm
            userId={userId}
            isFirstTime={isFirstTime}
            existing={existing}
          />
        </div>
      </div>
    </div>
  );
}
