import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SessionClient from "./SessionClient";

export const metadata = {
  title: "Coaching Session — WayPoint",
};

export default async function CoachSessionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach/session");

  // Redirect to setup if no profile yet
  const { data: profile } = await supabase
    .from("wp_worker_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/coach/setup");

  const admin = createAdminClient();

  // Create a new session server-side
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

  // Create blank whiteboard
  await admin.from("wp_whiteboards").insert({
    session_id: session.id,
    user_id: user.id,
    key_insights: [],
    values_named: [],
    action_steps: [],
  });

  return <SessionClient sessionId={session.id} />;
}
