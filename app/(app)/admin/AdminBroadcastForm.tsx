"use client";

import { useState } from "react";

export default function AdminBroadcastForm() {
  const [title, setTitle]     = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl]         = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult]   = useState<{ sent?: number; total?: number; error?: string } | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/push/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          url: url.trim() || "/resources",
        }),
      });
      const data = await res.json();
      if (data.error) {
        setResult({ error: data.error });
      } else {
        setResult({ sent: data.sent, total: data.total });
        setTitle("");
        setMessage("");
        setUrl("");
      }
    } catch {
      setResult({ error: "Failed to send. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{
      background: "oklch(99% 0.002 80)",
      border: "1px solid oklch(88% 0.008 80)",
      padding: "1.75rem 2rem",
      maxWidth: 560,
    }}>
      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "oklch(52% 0.008 260)",
        marginBottom: "1.25rem",
      }}>
        Broadcast to All Members
      </p>
      <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="form-field">
          <label className="form-label" htmlFor="bc-title">Notification title</label>
          <input
            className="form-input"
            id="bc-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New Resource: Cultural Intelligence"
            maxLength={60}
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bc-message">Message</label>
          <textarea
            className="form-input"
            id="bc-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. A new resource on Cultural Intelligence is now available in your library."
            rows={3}
            maxLength={200}
            required
            style={{ resize: "vertical", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem" }}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bc-url">Resource link</label>
          <input
            className="form-input"
            id="bc-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/resources/cultural-intelligence"
          />
        </div>

        {result?.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.15 25)" }}>
            {result.error}
          </p>
        )}
        {result?.sent !== undefined && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(42% 0.12 150)" }}>
            ✓ Sent to {result.sent} of {result.total} subscriber{result.total !== 1 ? "s" : ""}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={sending || !title.trim() || !message.trim()}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              background: "oklch(30% 0.12 260)",
              color: "oklch(97% 0.005 80)",
              border: "none",
              padding: "0.6rem 1.25rem",
              cursor: (sending || !title.trim() || !message.trim()) ? "not-allowed" : "pointer",
              opacity: (sending || !title.trim() || !message.trim()) ? 0.6 : 1,
            }}
          >
            {sending ? "Sending…" : "Broadcast to All Members →"}
          </button>
        </div>
      </form>
    </div>
  );
}
