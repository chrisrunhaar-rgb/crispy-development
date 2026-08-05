"use server";

import { createClient } from "@/lib/supabase/server";

export async function switchCoach(coach: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await supabase
    .from("wp_worker_profiles")
    .update({ selected_coach: coach })
    .eq("user_id", user.id);
}

// Coaching style toggle (item 4/7) — direct vs relational baseline, set in the same
// modal as coach persona selection.
export async function setCoachingStyle(style: "direct" | "relational") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await supabase
    .from("wp_worker_profiles")
    .update({ coaching_style: style })
    .eq("user_id", user.id);
}

// Coaching intensity toggle — firm vs gentle, a second and independent axis alongside
// coaching style (direct/relational). Set in the same modal as coach persona selection.
export async function setCoachingIntensity(intensity: "firm" | "gentle") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await supabase
    .from("wp_worker_profiles")
    .update({ coaching_intensity: intensity })
    .eq("user_id", user.id);
}
