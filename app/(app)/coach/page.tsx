import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SessionTypeSelector from "./SessionTypeSelector";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "WayPoint — AI Coaching",
};

const TRIAL_LIMIT_SECONDS = 7200; // 120 minutes

const COACH_IMAGES: Record<string, string> = {
  Tara: "/images/coaches/tara-portrait.jpg",
  Ethan: "/images/coaches/ethan-portrait.jpg",
};

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.round(seconds / 60);
  return `${m} min`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

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

          {/* Past sessions — notation paper cards */}
          {completedSessions.length > 0 && (
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(50% 0.008 260)", marginBottom: "1.5rem" }}>
                Previous sessions
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {completedSessions.map(session => {
                  const wb = Array.isArray(session.wp_whiteboards) ? session.wp_whiteboards[0] : session.wp_whiteboards;
                  return (
                    <Link key={session.id} href={`/coach/session/${session.id}`} style={{ textDecoration: "none" }}>
                      <NotationCard session={session} wb={wb} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

type WB = {
  focus_today?: string | null;
  key_insights?: string[] | null;
  values_named?: string[] | null;
  action_steps?: string[] | null;
  carrying_forward?: string | null;
} | null;

type Session = {
  id: string;
  session_number: number | null;
  started_at: string;
  duration_seconds: number | null;
  wp_whiteboards: WB | WB[];
};

function NotationCard({ session, wb }: { session: Session; wb: WB }) {
  const dur = formatDuration(session.duration_seconds);
  const hasContent = wb && (wb.focus_today || (wb.key_insights?.length ?? 0) > 0 || (wb.action_steps?.length ?? 0) > 0 || wb.carrying_forward);

  return (
    <div style={{
      position: "relative",
      background: "oklch(99% 0.003 80)",
      border: "1px solid oklch(85% 0.008 80)",
      boxShadow: "0 2px 8px oklch(0% 0 0 / 0.06), 0 1px 2px oklch(0% 0 0 / 0.04)",
    }}>
      {/* Paperclip */}
      <div style={{
        position: "absolute", top: "-14px", left: "32px",
        width: "28px", height: "28px",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1,
      }}>
        <PaperclipIcon />
      </div>

      {/* Lined paper effect — horizontal rules */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: `${52 + i * 28}px`,
            height: "1px",
            background: "oklch(88% 0.008 220 / 0.5)",
          }} />
        ))}
        {/* Left margin line */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "56px",
          width: "1px", background: "oklch(80% 0.06 15 / 0.25)",
        }} />
      </div>

      <div style={{ padding: "2rem 1.75rem 1.75rem 4rem", position: "relative" }}>
        {/* Date stamp */}
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(55% 0.008 260)" }}>
            Session {session.session_number ?? "—"}{dur ? ` · ${dur}` : ""}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.008 260)", marginTop: "0.15rem" }}>
            {formatDate(session.started_at)} · {formatTime(session.started_at)}
          </p>
        </div>

        {hasContent ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {wb?.focus_today && (
              <NoteSection label="Focus">
                <p style={noteText}>{wb.focus_today}</p>
              </NoteSection>
            )}
            {(wb?.key_insights?.length ?? 0) > 0 && (
              <NoteSection label="Key insights">
                {wb!.key_insights!.map((ins, i) => <p key={i} style={noteText}>• {ins}</p>)}
              </NoteSection>
            )}
            {(wb?.action_steps?.length ?? 0) > 0 && (
              <NoteSection label="Action steps">
                {wb!.action_steps!.map((step, i) => <p key={i} style={noteText}>{i + 1}. {step}</p>)}
              </NoteSection>
            )}
            {wb?.carrying_forward && (
              <NoteSection label="Carried forward">
                <p style={{ ...noteText, fontStyle: "italic" }}>&ldquo;{wb.carrying_forward}&rdquo;</p>
              </NoteSection>
            )}
          </div>
        ) : (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(65% 0.008 260)", fontStyle: "italic" }}>
            No notes from this session yet.
          </p>
        )}

        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(65% 0.15 45)", fontWeight: 600, marginTop: "1.25rem", letterSpacing: "0.06em" }}>
          View full session →
        </p>
      </div>
    </div>
  );
}

function NoteSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(60% 0.12 150)", marginBottom: "0.3rem" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8L12 16C10.9 17.1 10.9 18.9 12 20C13.1 21.1 14.9 21.1 16 20L22 14C24.2 11.8 24.2 8.2 22 6C19.8 3.8 16.2 3.8 14 6L6 14C2.7 17.3 2.7 22.7 6 26C9.3 29.3 14.7 29.3 18 26L24 20" stroke="oklch(55% 0.06 260)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const noteText: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.8125rem",
  color: "oklch(28% 0.008 260)",
  lineHeight: 1.65,
  margin: 0,
};

const headerLink: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  color: "oklch(62% 0.008 260)",
  textDecoration: "none",
};
