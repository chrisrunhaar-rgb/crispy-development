import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CoachCarousel from "./CoachCarousel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "WayPoint — AI Coaching",
};

const COACH_IMAGES: Record<string, string> = {
  Tara: "/images/coaches/tara-portrait.jpg",
  Ethan: "/images/coaches/ethan-portrait.jpg",
};

export default async function CoachPage({
  searchParams,
}: {
  searchParams: Promise<{ trial?: string }>;
}) {
  const params = await searchParams;
  const trialExhaustedParam = params.trial === "exhausted";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach");

  const { data: profile } = await supabase
    .from("wp_worker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/coach/setup");

  const coachName = profile.selected_coach ?? "Tara";
  const coachImage = COACH_IMAGES[coachName] ?? COACH_IMAGES.Tara;

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("memberships")
    .select("coach_minutes_granted, currency")
    .eq("user_id", user.id)
    .maybeSingle();

  const coachLimitSeconds = membership ? (membership.coach_minutes_granted ?? 0) * 60 : 0;

  const { data: trialData } = await supabase
    .from("wp_sessions")
    .select("duration_seconds")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const totalUsedSeconds = (trialData ?? []).reduce(
    (sum, s) => sum + ((s.duration_seconds as number | null) ?? 0),
    0
  );
  const grantedMinutes = membership ? (membership.coach_minutes_granted ?? 0) : 0;
  const trialUsedMinutes = Math.round(totalUsedSeconds / 60);
  const trialRemainingMinutes = Math.max(0, grantedMinutes - trialUsedMinutes);
  const trialExhausted = totalUsedSeconds >= coachLimitSeconds || trialExhaustedParam;
  const trialPct = Math.min(100, Math.round((totalUsedSeconds / coachLimitSeconds) * 100));

  const { data: sessions } = await supabase
    .from("wp_sessions")
    .select("id, status, session_number, started_at, completed_at, duration_seconds, wp_whiteboards(focus_today, key_insights, values_named, action_steps, carrying_forward)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("started_at", { ascending: false })
    .limit(10);

  const completedSessions = sessions ?? [];
  const currency: "idr" | "usd" =
    membership?.currency === "idr" ? "idr" : "usd";
  const lang: "en" | "id" =
    user.user_metadata?.language_preference === "id" ? "id" : "en";

  return (
    <CoachCarousel
      coachName={coachName}
      coachImage={coachImage}
      sessionCount={completedSessions.length}
      trialExhausted={trialExhausted}
      trialRemainingMinutes={trialRemainingMinutes}
      trialUsedMinutes={trialUsedMinutes}
      grantedMinutes={grantedMinutes}
      trialPct={trialPct}
      sessions={completedSessions}
      currency={currency}
      lang={lang}
      coachingStyle={profile.coaching_style === "direct" ? "direct" : "relational"}
      coachingIntensity={profile.coaching_intensity === "firm" ? "firm" : "gentle"}
      profile={{
        name: profile.name,
        role: profile.role,
        organisation: profile.organisation,
        location: profile.location,
        home_culture: profile.home_culture,
        host_culture: profile.host_culture,
        months_in_context: profile.months_in_context,
        notes: profile.notes,
      }}
    />
  );
}
