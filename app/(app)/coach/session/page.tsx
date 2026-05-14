import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import GeminiSessionClient from "../gemini/GeminiSessionClient";

export const metadata = {
  title: "Coaching Session — WayPoint",
};

const COACH_VOICES: Record<string, string> = {
  Tara: "Kore",
  Ethan: "Charon",
};

const TRIAL_LIMIT_SECONDS = 7200; // 120 minutes

export default async function CoachSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const sessionType = params.type === "quick" ? "quick" : "deep";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach/session");

  const { data: profile } = await supabase
    .from("wp_worker_profiles")
    .select("selected_coach, onboarding_complete")
    .eq("user_id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/coach/setup");

  const admin = createAdminClient();

  // Trial check — sum all completed session durations
  const { data: completedForTrial } = await admin
    .from("wp_sessions")
    .select("duration_seconds")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const totalUsedSeconds = (completedForTrial ?? []).reduce(
    (sum, s) => sum + ((s.duration_seconds as number | null) ?? 0),
    0
  );

  if (totalUsedSeconds >= TRIAL_LIMIT_SECONDS) redirect("/coach?trial=exhausted");

  const coachName = profile.selected_coach ?? "Tara";
  const coachVoice = COACH_VOICES[coachName] ?? "Kore";

  const { count } = await admin
    .from("wp_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const sessionNumber = (count ?? 0) + 1;

  const { data: session, error } = await admin
    .from("wp_sessions")
    .insert({ user_id: user.id, session_number: sessionNumber, phase: "LAND", session_type: sessionType })
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

  return <GeminiSessionClient sessionId={session.id} coachName={coachName} coachVoice={coachVoice} sessionType={sessionType} />;
}
