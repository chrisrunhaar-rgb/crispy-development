import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Session Complete — WayPoint",
};

export default async function SessionCompletePage({
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

  if (!session) redirect("/coach");

  const wb = Array.isArray(session.wp_whiteboards)
    ? session.wp_whiteboards[0]
    : session.wp_whiteboards;

  const hasWhiteboardContent =
    wb &&
    (wb.focus_today ||
      (wb.key_insights && wb.key_insights.length > 0) ||
      (wb.values_named && wb.values_named.length > 0) ||
      (wb.action_steps && wb.action_steps.length > 0) ||
      wb.carrying_forward);

  const dateStr = new Date(session.started_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mins = session.duration_seconds
    ? Math.round(session.duration_seconds / 60)
    : null;

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>

      {/* Header */}
      <div style={{
        background: "oklch(18% 0.08 260)",
        paddingBlock: "2.5rem",
        borderBottom: "1px solid oklch(14% 0.06 260)",
      }}>
        <div className="container-wide">
          <Image src="/images/waypoint/waypoint-banner-blue.png" alt="WayPoint" height={28} width={0} style={{ width: "auto", height: "28px", marginBottom: "0.75rem" }} />
          <h1 style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "2.25rem",
            color: "white",
            lineHeight: 1.2,
            marginBottom: "0.5rem",
          }}>
            Session {session.session_number ?? "—"} complete.
          </h1>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8rem",
            color: "oklch(62% 0.008 260)",
          }}>
            {dateStr}{mins ? ` · ${mins} min` : ""}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {!hasWhiteboardContent ? (
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "1.25rem",
              color: "oklch(55% 0.008 260)",
              lineHeight: 1.6,
            }}>
              Your notes will appear here as they are saved.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {wb.focus_today && (
                <NoteSection label="Focus">
                  <p style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    fontSize: "1.375rem",
                    color: "oklch(22% 0.008 260)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    {wb.focus_today}
                  </p>
                </NoteSection>
              )}

              {wb.key_insights && (wb.key_insights as string[]).length > 0 && (
                <NoteSection label="Insights">
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {(wb.key_insights as string[]).map((ins: string, i: number) => (
                      <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        <span style={{ color: "oklch(65% 0.15 45)", fontSize: "0.85rem", marginTop: "0.15rem", flexShrink: 0 }}>•</span>
                        <p style={noteBodyText}>{ins}</p>
                      </li>
                    ))}
                  </ul>
                </NoteSection>
              )}

              {wb.values_named && (wb.values_named as string[]).length > 0 && (
                <NoteSection label="Values">
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {(wb.values_named as string[]).map((v: string, i: number) => (
                      <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        <span style={{ color: "oklch(55% 0.12 260)", fontSize: "0.85rem", marginTop: "0.15rem", flexShrink: 0 }}>•</span>
                        <p style={noteBodyText}>{v}</p>
                      </li>
                    ))}
                  </ul>
                </NoteSection>
              )}

              {wb.action_steps && (wb.action_steps as string[]).length > 0 && (
                <NoteSection label="Action Steps">
                  <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {(wb.action_steps as string[]).map((step: string, i: number) => (
                      <li key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          color: "oklch(65% 0.15 45)",
                          minWidth: "20px",
                          paddingTop: "0.15rem",
                          flexShrink: 0,
                        }}>
                          {i + 1}.
                        </span>
                        <p style={noteBodyText}>{step}</p>
                      </li>
                    ))}
                  </ol>
                </NoteSection>
              )}

              {wb.carrying_forward && (
                <NoteSection label="Carrying Forward">
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontStyle: "italic",
                    fontSize: "0.9375rem",
                    color: "oklch(28% 0.008 260)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}>
                    &ldquo;{wb.carrying_forward}&rdquo;
                  </p>
                </NoteSection>
              )}

            </div>
          )}

          {/* CTAs */}
          <div style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid oklch(88% 0.008 80)",
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            alignItems: "flex-start",
          }}>
            <Link
              href={`/coach/session/${id}`}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
                color: "oklch(65% 0.15 45)",
                textDecoration: "none",
              }}
            >
              Review full session →
            </Link>
            <Link
              href="/coach"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8rem",
                color: "oklch(55% 0.008 260)",
                textDecoration: "none",
              }}
            >
              Back to WayPoint
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

function NoteSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "oklch(65% 0.15 45)",
        marginBottom: "0.875rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid oklch(90% 0.005 80)",
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}

const noteBodyText: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9375rem",
  color: "oklch(28% 0.008 260)",
  lineHeight: 1.7,
  margin: 0,
};
