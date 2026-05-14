import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SessionTypeSelector from "./SessionTypeSelector";
import SessionNotebook from "./SessionNotebook";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "WayPoint — AI Coaching",
};

const TRIAL_LIMIT_SECONDS = 7200; // 120 minutes

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

  // Redirect to setup if onboarding not complete
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
    .select("is_admin")
    .eq("user_id", user.id)
    .single();
  const isAdmin = membership?.is_admin === true;

  const { count: leaderCount } = await supabase
    .from("wp_leader_assignments")
    .select("*", { count: "exact", head: true })
    .eq("leader_user_id", user.id);
  const isLeader = (leaderCount ?? 0) > 0;

  // Trial calculation — all completed sessions
  const { data: trialData } = await supabase
    .from("wp_sessions")
    .select("duration_seconds")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const totalUsedSeconds = (trialData ?? []).reduce(
    (sum, s) => sum + ((s.duration_seconds as number | null) ?? 0),
    0
  );
  const trialUsedMinutes = Math.round(totalUsedSeconds / 60);
  const trialRemainingMinutes = Math.max(0, 120 - trialUsedMinutes);
  const trialExhausted = totalUsedSeconds >= TRIAL_LIMIT_SECONDS || trialExhaustedParam;
  const trialPct = Math.min(100, Math.round((totalUsedSeconds / TRIAL_LIMIT_SECONDS) * 100));

  const { data: sessions } = await supabase
    .from("wp_sessions")
    .select("id, status, session_number, started_at, completed_at, duration_seconds, wp_whiteboards(focus_today, key_insights, values_named, action_steps, carrying_forward)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("started_at", { ascending: false })
    .limit(10);

  const completedSessions = sessions ?? [];
  const sessionCount = completedSessions.length;

  return (
    <div style={{ background: "oklch(96% 0.004 80)", minHeight: "calc(100dvh - 80px)" }}>

      {/* Header */}
      <div style={{
        background: "oklch(18% 0.08 260)",
        paddingBlock: "0",
      }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBlock: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.3rem", fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1 }}>
              WayPoint
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(62% 0.008 260)", marginTop: "0.1rem" }}>
                AI Coaching
              </span>
              <span style={{ background: "oklch(65% 0.15 45)", color: "white", fontFamily: "var(--font-montserrat)", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.1em", padding: "0.15rem 0.45rem", borderRadius: "2px", marginLeft: "0.5rem", verticalAlign: "middle" }}>
                BETA
              </span>
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            {isLeader && <Link href="/coach/leader" style={headerLink}>Leader view</Link>}
            {isAdmin && <Link href="/coach/admin" style={headerLink}>Admin</Link>}
            <Link href="/dashboard" style={headerLink}>← Crispy Leaders</Link>
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {/* Coach card + Start session */}
          <div style={{
            background: "oklch(18% 0.08 260)",
            padding: "2.5rem",
            marginBottom: "2.5rem",
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}>
            <div style={{
              width: "120px", height: "120px", borderRadius: "50%",
              overflow: "hidden", flexShrink: 0,
              border: "3px solid oklch(45% 0.10 260)",
            }}>
              <Image src={coachImage} alt={coachName} width={120} height={120} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(55% 0.08 150)", marginBottom: "0.3rem" }}>
                Your coach
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontStyle: "italic", color: "white", marginBottom: "0.5rem", lineHeight: 1.2 }}>
                {coachName}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(65% 0.008 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                {sessionCount === 0
                  ? "Ready for your first session. Speak naturally — your notes build themselves as you talk."
                  : `Session ${sessionCount + 1} ready. ${coachName} remembers your previous sessions.`}
              </p>

              {/* Trial meter */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: trialExhausted ? "oklch(65% 0.15 30)" : "oklch(65% 0.008 260)" }}>
                    Free trial
                  </span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: trialExhausted ? "oklch(65% 0.15 30)" : "oklch(65% 0.15 45)" }}>
                    {trialExhausted ? "Trial complete" : `${trialRemainingMinutes} min remaining`}
                  </span>
                </div>
                <div style={{ height: "4px", background: "oklch(30% 0.06 260)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${trialPct}%`,
                    background: trialExhausted ? "oklch(55% 0.15 30)" : "oklch(65% 0.15 45)",
                    transition: "width 0.3s ease",
                    borderRadius: "2px",
                  }} />
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(50% 0.008 260)", marginTop: "0.3rem" }}>
                  {trialUsedMinutes} of 120 minutes used
                </p>
              </div>

              <SessionTypeSelector
                trialExhausted={trialExhausted}
                trialRemainingMinutes={trialRemainingMinutes}
              />

              <Link href="/coach/setup" style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
                color: "oklch(55% 0.008 260)", textDecoration: "none",
                letterSpacing: "0.06em",
              }}>
                Coaching preferences
              </Link>
            </div>
          </div>

          {/* Past sessions — notebook */}
          {completedSessions.length > 0 && (
            <SessionNotebook sessions={completedSessions} />
          )}

        </div>
      </div>
    </div>
  );
}


const headerLink: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  color: "oklch(62% 0.008 260)",
  textDecoration: "none",
};
