"use client";

import { useActionState, useRef } from "react";
import { submitCoachMessage } from "@/app/auth/actions";

type CoachMessage = {
  id: string;
  message: string;
  subject: string | null;
  created_at: string;
  reply: string | null;
  replied_at: string | null;
  status: string;
};

type State = { error?: string; success?: boolean } | null;

export default function ContactCoach({
  messages = [],
  messageType = "leader",
}: {
  messages?: CoachMessage[];
  messageType?: "leader" | "peer";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await submitCoachMessage(formData);
      if (result?.success) {
        formRef.current?.reset();
      }
      return result ?? null;
    },
    null,
  );

  const label = messageType === "peer" ? "Peer Group Support" : "Ask the Coach";
  const description = messageType === "peer"
    ? "Questions about running your peer group? Send a message directly — Chris will respond personally."
    : "Have a question about your team or cross-cultural leadership? Send a message directly — Chris will respond personally.";
  const placeholder = messageType === "peer"
    ? "e.g. How do I structure our first peer group meeting?"
    : "e.g. Navigating conflict in a multicultural team";

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div style={{ background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem", marginBottom: "0.5rem" }}>
          Direct Access
        </p>
        <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", marginBottom: "0.5rem" }}>
          {label}
        </h3>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6 }}>
          {description}
        </p>
      </div>

      {/* Conversation history */}
      {messages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {/* User message */}
              <div style={{ background: "oklch(93% 0.006 260)", padding: "0.875rem 1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                  {msg.subject && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(30% 0.12 260)", margin: 0 }}>
                      {msg.subject}
                    </p>
                  )}
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(58% 0.008 260)", marginLeft: "auto" }}>
                    {fmtDate(msg.created_at)}
                  </p>
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(28% 0.008 260)", margin: 0, whiteSpace: "pre-wrap" }}>
                  {msg.message}
                </p>
              </div>

              {/* Chris's reply */}
              {msg.reply ? (
                <div style={{ background: "oklch(94% 0.04 145 / 0.5)", padding: "0.875rem 1rem", marginLeft: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(42% 0.10 145)", marginBottom: "0.375rem" }}>
                    Reply from Chris
                    {msg.replied_at && (
                      <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: "0.5rem", color: "oklch(55% 0.06 145)" }}>
                        · {fmtDate(msg.replied_at)}
                      </span>
                    )}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(28% 0.08 145)", margin: 0, whiteSpace: "pre-wrap" }}>
                    {msg.reply}
                  </p>
                </div>
              ) : (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.008 260)", marginLeft: "1.5rem" }}>
                  Waiting for reply…
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Success state */}
      {state?.success && (
        <div style={{ background: "oklch(94% 0.04 145)", padding: "0.875rem 1.25rem", marginBottom: "1.25rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem", color: "oklch(32% 0.10 145)" }}>
            Message sent. ✓
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(42% 0.08 145)", marginTop: "0.25rem" }}>
            Chris will be in touch. Refresh to see your conversation.
          </p>
        </div>
      )}

      {/* New message form */}
      <form ref={formRef} action={action} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input type="hidden" name="message_type" value={messageType} />
        <div>
          <label
            htmlFor="coach-subject"
            style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.375rem" }}
          >
            Subject <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            id="coach-subject"
            name="subject"
            type="text"
            maxLength={120}
            placeholder={placeholder}
            style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(22% 0.005 260)", background: "oklch(99% 0.002 80)", border: "1px solid oklch(82% 0.008 80)", padding: "0.625rem 0.875rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label
            htmlFor="coach-message"
            style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.375rem" }}
          >
            {messages.length > 0 ? "New Message" : "Your Message"}
          </label>
          <textarea
            id="coach-message"
            name="message"
            required
            rows={4}
            maxLength={2000}
            placeholder="Share what's on your mind…"
            style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(22% 0.005 260)", background: "oklch(99% 0.002 80)", border: "1px solid oklch(82% 0.008 80)", padding: "0.625rem 0.875rem", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
          />
        </div>

        {state?.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(45% 0.18 25)" }}>
            {state.error}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={pending}
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(97% 0.005 80)", background: pending ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.75rem 1.75rem", cursor: pending ? "not-allowed" : "pointer", transition: "background 0.15s ease" }}
          >
            {pending ? "Sending…" : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
