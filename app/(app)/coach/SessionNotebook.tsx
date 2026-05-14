"use client";

import { useState } from "react";
import Link from "next/link";

type WB = {
  focus_today?: string | null;
  key_insights?: string[] | null;
  values_named?: string[] | null;
  action_steps?: string[] | null;
  carrying_forward?: string | null;
} | null;

export type NotebookSession = {
  id: string;
  session_number: number | null;
  started_at: string;
  duration_seconds: number | null;
  wp_whiteboards: WB | WB[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatDur(seconds: number | null) {
  if (!seconds) return null;
  return `${Math.round(seconds / 60)} min`;
}

export default function SessionNotebook({ sessions }: { sessions: NotebookSession[] }) {
  const [idx, setIdx] = useState(0);
  const session = sessions[idx];
  const wb: WB = Array.isArray(session.wp_whiteboards)
    ? (session.wp_whiteboards[0] ?? null)
    : session.wp_whiteboards;
  const dur = formatDur(session.duration_seconds);
  const hasContent =
    wb &&
    (wb.focus_today ||
      (wb.key_insights?.length ?? 0) > 0 ||
      (wb.values_named?.length ?? 0) > 0 ||
      (wb.action_steps?.length ?? 0) > 0 ||
      wb.carrying_forward);

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      borderRadius: "2px 2px 4px 4px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)",
      overflow: "hidden",
      minHeight: "380px",
    }}>

      {/* Left spine */}
      <div style={{
        width: "44px",
        flexShrink: 0,
        background: "linear-gradient(to right, #090909, #181818 40%, #111)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBlock: "16px",
        gap: "7px",
      }}>
        <Ring /><Ring /><Ring />

        <div style={{ flex: 1 }} />

        {/* Session number tabs — newest first */}
        {sessions.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: i === idx ? "oklch(65% 0.15 45)" : "transparent",
              border: i === idx ? "none" : "1px solid rgba(255,255,255,0.18)",
              color: i === idx ? "white" : "rgba(255,255,255,0.38)",
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.58rem",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            {s.session_number ?? sessions.length - i}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <Ring /><Ring /><Ring />
      </div>

      {/* Paper area */}
      <div style={{ flex: 1, background: "white", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Notebook label */}
        <div style={{
          padding: "0.875rem 1.25rem 0.625rem",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(80,72,60,0.45)",
            margin: 0,
          }}>
            Session Notes
          </p>
        </div>

        {/* Session meta */}
        <div style={{ padding: "0.875rem 1.25rem 0.625rem", borderBottom: "1px solid rgba(0,0,0,0.04)", flexShrink: 0 }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "oklch(55% 0.08 260)", margin: 0,
          }}>
            Session {session.session_number ?? "—"}{dur ? ` · ${dur}` : ""}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.7rem",
            color: "oklch(55% 0.008 260)", marginTop: "0.2rem",
          }}>
            {formatDate(session.started_at)}
          </p>
        </div>

        {/* Content — lined paper */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem 1.25rem",
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, rgba(180, 205, 235, 0.45) 27px, rgba(180, 205, 235, 0.45) 28px)",
          backgroundSize: "100% 28px",
          lineHeight: "28px",
          fontSize: "0.8125rem",
          fontFamily: "var(--font-montserrat)",
        }}>
          {!hasContent ? (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "rgba(100,90,80,0.38)", fontStyle: "italic", marginTop: "0.5rem" }}>
              No notes from this session.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {wb?.focus_today && (
                <NoteBlock label="Focus">
                  <NoteRow value={wb.focus_today} />
                </NoteBlock>
              )}
              {(wb?.key_insights?.length ?? 0) > 0 && (
                <NoteBlock label="Key insights">
                  {wb!.key_insights!.map((ins, i) => <NoteRow key={i} value={`• ${ins}`} indent />)}
                </NoteBlock>
              )}
              {(wb?.values_named?.length ?? 0) > 0 && (
                <NoteBlock label="Values">
                  {wb!.values_named!.map((v, i) => <NoteRow key={i} value={`• ${v}`} indent />)}
                </NoteBlock>
              )}
              {(wb?.action_steps?.length ?? 0) > 0 && (
                <NoteBlock label="Actions">
                  {wb!.action_steps!.map((step, i) => <NoteRow key={i} value={`${i + 1}. ${step}`} indent />)}
                </NoteBlock>
              )}
              {wb?.carrying_forward && (
                <NoteBlock label="Carrying forward">
                  <NoteRow value={`"${wb.carrying_forward}"`} italic />
                </NoteBlock>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "0.625rem 1.25rem",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}>
          <Link
            href={`/coach/session/${session.id}`}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "oklch(65% 0.15 45)",
              textDecoration: "none",
            }}
          >
            View full session →
          </Link>
        </div>

      </div>
    </div>
  );
}

function Ring() {
  return (
    <div style={{
      width: "22px", height: "22px",
      borderRadius: "50%",
      background: "radial-gradient(circle at 40% 35%, #d4d4d4, #888 45%, #444 75%, #222)",
      border: "2px solid #333",
      boxShadow: "0 2px 5px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.15)",
      position: "relative",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "9px", height: "9px", borderRadius: "50%",
        background: "#050505",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9)",
      }} />
    </div>
  );
}

function NoteBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{
        fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "rgba(60,110,70,0.7)", margin: "0.5rem 0 0.2rem 0",
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function NoteRow({ value, indent, italic }: { value: string; indent?: boolean; italic?: boolean }) {
  return (
    <p style={{
      fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem",
      color: "rgba(40,35,28,0.82)", lineHeight: 1.65,
      paddingLeft: indent ? "0.5rem" : 0,
      fontStyle: italic ? "italic" : "normal",
      margin: 0,
    }}>
      {value}
    </p>
  );
}
