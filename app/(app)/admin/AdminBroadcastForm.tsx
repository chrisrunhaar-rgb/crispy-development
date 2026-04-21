"use client";

import { useState } from "react";

type Member = { id: string; name: string; email: string };

export default function AdminBroadcastForm({ members = [] }: { members?: Member[] }) {
  const [mode, setMode]       = useState<"all" | "specific">("all");
  const [targetId, setTarget] = useState("");
  const [title, setTitle]     = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl]         = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult]   = useState<{ sent?: number; total?: number; error?: string } | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    if (mode === "specific" && !targetId) return;
    setSending(true);
    setResult(null);
    try {
      const endpoint = mode === "all" ? "/api/push/broadcast" : "/api/push/targeted";
      const body = mode === "all"
        ? { title: title.trim(), message: message.trim(), url: url.trim() || "/resources" }
        : { targetUserId: targetId, title: title.trim(), message: message.trim(), url: url.trim() || "/resources" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) {
        setResult({ error: data.error });
      } else {
        setResult({ sent: data.sent, total: data.total });
        setTitle(""); setMessage(""); setUrl("");
        if (mode === "specific") setTarget("");
      }
    } catch {
      setResult({ error: "Failed to send. Please try again." });
    } finally {
      setSending(false);
    }
  }

  const navy   = "oklch(30% 0.12 260)";
  const orange = "oklch(65% 0.15 45)";

  return (
    <div style={{ background: "oklch(99% 0.002 80)", border: "1px solid oklch(88% 0.008 80)", padding: "1.75rem 2rem", maxWidth: 600 }}>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["all", "specific"] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.375rem 0.875rem",
              borderRadius: 100,
              border: "1px solid oklch(84% 0.008 80)",
              background: mode === m ? navy : "white",
              color: mode === m ? "white" : "oklch(52% 0.008 260)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {m === "all" ? "All Members" : "Specific Member"}
          </button>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "1.25rem" }}>
        {mode === "all" ? "Broadcast to All Members" : "Send to One Member"}
      </p>

      <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* Target member selector */}
        {mode === "specific" && (
          <div className="form-field">
            <label className="form-label" htmlFor="bc-target">Select Member</label>
            <select
              className="form-input"
              id="bc-target"
              value={targetId}
              onChange={e => setTarget(e.target.value)}
              required
              style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }}
            >
              <option value="">— choose a member —</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name || m.email} ({m.email})</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-field">
          <label className="form-label" htmlFor="bc-title">Notification title</label>
          <input className="form-input" id="bc-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New Resource: Cultural Intelligence" maxLength={60} required />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="bc-message">Message</label>
          <textarea className="form-input" id="bc-message" value={message} onChange={e => setMessage(e.target.value)} placeholder="e.g. A new resource on Cultural Intelligence is now available." rows={3} maxLength={200} required style={{ resize: "vertical", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }} />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="bc-url">Link (optional)</label>
          <input className="form-input" id="bc-url" type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="/resources/cultural-intelligence" />
        </div>

        {result?.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.15 25)" }}>{result.error}</p>
        )}
        {result?.sent !== undefined && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(42% 0.12 150)" }}>
            ✓ Sent to {result.sent} of {result.total} device{(result.total ?? 0) !== 1 ? "s" : ""}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={sending || !title.trim() || !message.trim() || (mode === "specific" && !targetId)}
            style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em",
              background: orange, color: "white", border: "none", padding: "0.6rem 1.25rem",
              cursor: "pointer", opacity: (sending || !title.trim() || !message.trim() || (mode === "specific" && !targetId)) ? 0.55 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {sending ? "Sending…" : mode === "all" ? "Broadcast to All →" : "Send to Member →"}
          </button>
        </div>
      </form>
    </div>
  );
}
