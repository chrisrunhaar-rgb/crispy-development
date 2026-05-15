import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
export const metadata = {
  title: "Session — WayPoint",
};

export default async function PastSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach");

  const { data: session } = await supabase
    .from("wp_sessions")
    .select("*, wp_whiteboards(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!session) notFound();

  const wb =Array.isArray(session.wp_whiteboards)
    ? session.wp_whiteboards[0]
    : session.wp_whiteboards;

  const mins = session.duration_seconds ? Math.round(session.duration_seconds / 60) : null;
  const dateStr = new Date(session.started_at).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      {/* Header */}
      <div style={{ background: "oklch(30% 0.12 260)", paddingBlock: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>WayPoint · Session {session.session_number ?? "—"}</p>
            <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400, fontSize: "2rem", color: "oklch(97% 0.005 80)" }}>
              {dateStr}
            </h1>
            {mins && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(65% 0.008 260)", marginTop: "0.375rem" }}>
                {mins} minutes
              </p>
            )}
          </div>
          <Link href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(88% 0.008 80)", textDecoration: "none" }}>
            ← All Sessions
          </Link>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {!wb ? (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.008 260)" }}>
              No notes from this session yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {wb.focus_today && (
                <WhiteboardCard label="My Focus">
                  <p style={bodyText}>{wb.focus_today}</p>
                </WhiteboardCard>
              )}

              {wb.key_insights && wb.key_insights.length > 0 && (
                <WhiteboardCard label="Key Insights">
                  {(wb.key_insights as string[]).map((ins: string, i: number) => (
                    <BulletRow key={i} text={ins} dot="oklch(65% 0.15 45)" />
                  ))}
                </WhiteboardCard>
              )}

              {wb.values_named && wb.values_named.length > 0 && (
                <WhiteboardCard label="Values I Named">
                  {(wb.values_named as string[]).map((v: string, i: number) => (
                    <BulletRow key={i} text={v} dot="oklch(55% 0.12 260)" />
                  ))}
                </WhiteboardCard>
              )}

              {wb.action_steps && wb.action_steps.length > 0 && (
                <WhiteboardCard label="My Action Steps">
                  {(wb.action_steps as string[]).map((step: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", paddingBlock: "0.75rem", borderBottom: i < wb.action_steps.length - 1 ? "1px solid oklch(93% 0.004 80)" : "none" }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", color: "oklch(65% 0.15 45)", minWidth: "20px", paddingTop: "0.1rem" }}>
                        {i + 1}.
                      </span>
                      <p style={bodyText}>{step}</p>
                    </div>
                  ))}
                </WhiteboardCard>
              )}

              {wb.carrying_forward && (
                <WhiteboardCard label="What I Carried Forward">
                  <p style={{ ...bodyText, fontStyle: "italic", fontSize: "1.0625rem", color: "oklch(28% 0.08 260)", lineHeight: 1.7 }}>
                    &ldquo;{wb.carrying_forward}&rdquo;
                  </p>
                </WhiteboardCard>
              )}
            </div>
          )}

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
            <Link
              href="/coach"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8rem",
                color: "oklch(55% 0.008 260)",
                textDecoration: "none",
              }}
            >
              ← Back to WayPoint
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhiteboardCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", borderLeft: "3px solid oklch(65% 0.15 45)", padding: "2rem", paddingLeft: "1.75rem" }}>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function BulletRow({ text, dot }: { text: string; dot: string }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.625rem" }}>
      <span style={{ color: dot, fontSize: "0.8rem", marginTop: "0.15rem" }}>•</span>
      <p style={bodyText}>{text}</p>
    </div>
  );
}

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9375rem",
  color: "oklch(28% 0.008 260)",
  lineHeight: 1.7,
  margin: 0,
};
