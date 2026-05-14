"use client";

import { useState } from "react";

export default function ShareToggle({
  sessionId,
  initialShared,
  hasLeader,
}: {
  sessionId: string;
  initialShared: boolean;
  hasLeader: boolean;
}) {
  const [shared, setShared] = useState(initialShared);
  const [loading, setLoading] = useState(false);

  if (!hasLeader) return null;

  async function toggle() {
    setLoading(true);
    await fetch("/api/coach/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, shared_with_leader: !shared }),
    });
    setShared(s => !s);
    setLoading(false);
  }

  return (
    <div style={{
      background: "white",
      border: "1px solid oklch(88% 0.008 80)",
      padding: "1.25rem 1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1.5rem",
      flexWrap: "wrap",
    }}>
      <div>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "oklch(28% 0.008 260)",
          marginBottom: "0.2rem",
        }}>
          Share with leader
        </p>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.75rem",
          color: "oklch(58% 0.008 260)",
          lineHeight: 1.5,
        }}>
          {shared
            ? "Your leader can see this whiteboard summary. Transcripts are never shared."
            : "Your leader cannot see this session. You choose what to share."}
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.75rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "0.625rem 1.25rem",
          background: shared ? "oklch(30% 0.12 260)" : "white",
          color: shared ? "oklch(97% 0.005 80)" : "oklch(42% 0.008 260)",
          border: shared ? "none" : "1px solid oklch(82% 0.008 80)",
          cursor: loading ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "…" : shared ? "Shared ✓" : "Share"}
      </button>
    </div>
  );
}
