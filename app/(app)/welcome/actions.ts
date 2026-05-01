"use server";

import { createClient } from "@/lib/supabase/server";

export async function markOnboardingComplete(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { onboarding_complete: true } });
}

export async function setWelcomeLanguage(lang: "en" | "id" | "nl"): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { language_preference: lang } });
}
