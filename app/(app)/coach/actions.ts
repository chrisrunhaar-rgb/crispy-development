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
