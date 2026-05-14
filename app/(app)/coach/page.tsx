import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "WayPoint — AI Coaching",
};

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach");

  const firstName = user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "there";

  // Check admin status
  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("memberships")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();
  const isAdmin = membership?.is_admin === true;

  // Check if leader
  const { count: leaderCount } = await supabase
    .from("wp_leader_assignments")
    .select("*", { count: "exact", head: true })
    .eq("leader_user_id", user.id);
  const isLeader = (leaderCount ?? 0) > 0;

  // Load past sessions
  const { data: sessions } = await supabase
    .from("wp_sessions")
    .select("id, status, session_number, started_at, completed_at, duration_seconds")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(10);

  const completedSessions = (sessions ?? []).filter(s => s.status === "completed");
  const sessionCount = completedSessions.length;

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      {/* Header */}
      <div style={{
        background: "oklch(30% 0.12 260)",
        paddingBlock: "2rem",
        borderBottom: "1px solid oklch(22% 0.10 260)",
      }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>WayPoint</p>
            <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
              AI Coaching
            </h1>
          </div>
          <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>

          {/* Start session card */}
          <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "2.5rem", marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontStyle: "italic", color: "oklch(32% 0.008 260)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
              Ready to reflect, {firstName}?
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(52% 0.008 260)", lineHeight: 1.7, marginBottom: "2rem" }}>
              WayPoint is your AI coaching companion. A 40-minute voice conversation — ask questions, explore what you&rsquo;re carrying, and leave with a clear whiteboard of insights and next steps.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              {[
                { label: "40 min", sub: "full session" },
                { label: "Voice", sub: "speak naturally" },
                { label: sessionCount > 0 ? `Session ${sessionCount + 1}` : "Session 1", sub: "your journey" },
              ].map(({ label, sub }) => (
                <div key={label} style={{ flex: 1, minWidth: "120px", background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1rem", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(30% 0.12 260)" }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(60% 0.008 260)", marginTop: "0.25rem" }}>{sub}</p>
                </div>
              ))}
            </div>

            <Link
              href="/coach/session"
              style={{
                display: "block",
                width: "100%",
                background: "oklch(30% 0.12 260)",
                color: "oklch(97% 0.005 80)",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              Start Session
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <Link href="/coach/setup" style={quickLink}>Edit Profile</Link>
            {isLeader && <Link href="/coach/leader" style={quickLink}>Leader View</Link>}
            {isAdmin && <Link href="/coach/admin" style={quickLink}>Assign Workers</Link>}
            <Link href="/coach/privacy" style={quickLink}>Confidentiality</Link>
          </div>

          {/* Past sessions */}
          {completedSessions.length > 0 && (
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "1rem" }}>
                Past Sessions
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                {completedSessions.map(session => {
                  const mins = session.duration_seconds ? Math.round(session.duration_seconds / 60) : null;
                  return (
                    <Link
                      key={session.id}
                      href={`/coach/session/${session.id}`}
                      style={{
                        background: "white",
                        padding: "1.125rem 1.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem", color: "oklch(30% 0.12 260)" }}>
                          Session {session.session_number ?? "—"}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(60% 0.008 260)", marginTop: "0.2rem" }}>
                          {new Date(session.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          {mins && ` · ${mins} min`}
                        </p>
                      </div>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(65% 0.15 45)", fontWeight: 600 }}>
                        View →
                      </span>
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

const quickLink: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  color: "oklch(42% 0.008 260)",
  textDecoration: "none",
  padding: "0.5rem 0.875rem",
  border: "1px solid oklch(82% 0.008 80)",
  background: "white",
};
