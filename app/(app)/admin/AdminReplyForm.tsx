"use client";

import { useState, useTransition, useRef } from "react";
import { replyToCoachMessage } from "./actions";

export default function AdminReplyForm({
  messageId,
  existingReply,
  repliedAt,
}: {
  messageId: string;
  existingReply?: string | null;
  repliedAt?: string | null;
}) {
  const [editing, setEditing] = useState(!existingReply);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(!!existingReply);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await replyToCoachMessage(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSent(true);
        setEditing(false);
      }
    });
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "oklch(52% 0.008 260)",
    marginBottom: "0.375rem",
    display: "block",
  };

  if (sent && !editing) {
    return (
      <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
        <p style={labelStyle}>Your Reply</p>
        <div style={{ background: "oklch(94% 0.04 145 / 0.5)", padding: "0.875rem 1rem", marginBottom: "0.625rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(30% 0.10 145)", margin: 0, whiteSpace: "pre-wrap" }}>{existingReply}</p>
        </div>
        {repliedAt && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(58% 0.008 260)" }}>
            Sent {new Date(repliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        <button
          onClick={() => setEditing(true)}
          style={{ marginTop: "0.5rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: "oklch(42% 0.008 260)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Edit reply
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid oklch(88% 0.008 80)" }}>
      <form ref={formRef} action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <input type="hidden" name="messageId" value={messageId} />
        <label htmlFor={`reply-${messageId}`} style={labelStyle}>
          Reply from Dashboard
        </label>
        <textarea
          id={`reply-${messageId}`}
          name="reply"
          required
          rows={3}
          defaultValue={existingReply ?? ""}
          placeholder="Type your reply — this will appear in the user's dashboard…"
          style={{
            width: "100%",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            color: "oklch(22% 0.005 260)",
            background: "oklch(99% 0.002 80)",
            border: "1px solid oklch(82% 0.008 80)",
            padding: "0.625rem 0.875rem",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        />
        {error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(45% 0.18 25)", margin: 0 }}>{error}</p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "white",
              background: isPending ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)",
              border: "none",
              padding: "0.625rem 1.25rem",
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? "Sending…" : "Send Reply"}
          </button>
          {editing && existingReply && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "none", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
