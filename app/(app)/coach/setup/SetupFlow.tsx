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
    <ProfileForm
      userId={userId}
      isFirstTime={isFirstTime}
      existing={existing}
    />
  );
}
