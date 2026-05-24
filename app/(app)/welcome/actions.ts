"use server";

import { createClient } from "@/lib/supabase/server";

export async function markOnboardingComplete(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { onboarding_complete: true } });
}

export async function setWelcomeLanguage(lang: "en" | "id"): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { language_preference: lang } });
}

export async function markGdprConsent(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.updateUser({
    data: {
      gdpr_consent_at: new Date().toISOString(),
      terms_version: "2026-05",
    },
  });
}
