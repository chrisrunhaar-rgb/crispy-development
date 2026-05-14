"use client";

import { useEffect, useState } from "react";

type WorkerSummary = {
  user_id: string;
  name: string;
  organisation: string | null;
  location: string | null;
  total_sessions: number;
  last_session_at: string | null;
  days_since_last_session: number | null;
  recent_themes: string[];
  alert: string | null;
};

export default function LeaderDashboardClient() {
  const [workers, setWorkers] = useState<WorkerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coach/leader/workers")
      .then(r => r.json())
      .then(d => {
        setWorkers(d.workers ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(60% 0.008 260)" }}>
        Loading users…
      </p>
    );
  }

  if (workers.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(60% 0.008 260)" }}>
        No users loaded.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
      {workers.map(w => (
        <WorkerCard key={w.user_id} worker={w} />
      ))}
    </div>
  );
}

function WorkerCard({ worker: w }: { worker: WorkerSummary }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: "white" }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: "100%",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          textAlign: "left",
        }}
      >
        {/* Alert indicator */}
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          flexShrink: 0,
          background: w.alert ? "oklch(65% 0.18 25)" : "oklch(65% 0.15 150)",
        }} />

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.008 260)", marginBottom: "0.2rem" }}>
            {w.name}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(60% 0.008 260)" }}>
            {[w.organisation, w.location].filter(Boolean).join(" · ")}
          </p>
        </div>

        {/* Session stats */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "oklch(30% 0.12 260)" }}>
            {w.total_sessions} {w.total_sessions === 1 ? "session" : "sessions"}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: w.alert ? "oklch(55% 0.15 25)" : "oklch(62% 0.008 260)", fontWeight: w.alert ? 600 : 400 }}>
            {w.alert
              ? w.alert
              : w.days_since_last_session !== null
              ? w.days_since_last_session === 0
                ? "Session today"
                : w.days_since_last_session === 1
                ? "Yesterday"
                : `${w.days_since_last_session}d ago`
              : "No sessions"}
          </p>
        </div>

        <span style={{ color: "oklch(70% 0.008 260)", fontSize: "0.8rem", flexShrink: 0 }}>
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded: recent themes */}
      {expanded && (
        <div style={{ padding: "0 1.5rem 1.5rem 3rem", borderTop: "1px solid oklch(95% 0.003 80)" }}>
          {w.recent_themes.length > 0 ? (
            <>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem", marginTop: "1rem" }}>
                Recent Focus Areas
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {w.recent_themes.map((theme, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(65% 0.15 45)", fontSize: "0.7rem", marginTop: "0.1rem" }}>•</span>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(35% 0.008 260)", lineHeight: 1.6 }}>
                      {theme}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(65% 0.008 260)", fontStyle: "italic", marginTop: "1rem" }}>
              No session themes yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
