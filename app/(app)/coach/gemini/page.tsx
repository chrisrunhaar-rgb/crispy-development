import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import GeminiSessionClient from "./GeminiSessionClient";

export const metadata = {
  title: "Coaching Session (Gemini) — WayPoint",
};

export default async function GeminiCoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach/gemini");

  const { data: profile } = await supabase
    .from("wp_worker_profiles")
    .select("onboarding_complete, selected_coach")
    .eq("user_id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/coach/setup");

  const admin = createAdminClient();

  // Mark stale in_progress sessions (older than 3 hours) as abandoned
  await admin
    .from("wp_sessions")
    .update({ status: "abandoned" })
    .eq("user_id", user.id)
    .eq("status", "in_progress")
    .lt("started_at", new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString());

  const { count } = await admin
    .from("wp_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const sessionNumber = (count ?? 0) + 1;

  const { data: session, error } = await admin
    .from("wp_sessions")
    .insert({ user_id: user.id, session_number: sessionNumber, phase: "LAND" })
    .select()
    .single();

  if (error || !session) redirect("/coach");

  await admin.from("wp_whiteboards").insert({
    session_id: session.id,
    user_id: user.id,
    key_insights: [],
    values_named: [],
    action_steps: [],
  });

  const COACH_VOICES: Record<string, string> = { Tara: "Kore", Ethan: "Charon" };
  const coachName = profile.selected_coach ?? "Tara";
  const coachVoice = COACH_VOICES[coachName] ?? "Kore";

  return <GeminiSessionClient sessionId={session.id} coachName={coachName} coachVoice={coachVoice} />;
}
