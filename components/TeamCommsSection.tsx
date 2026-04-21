"use client";

import { useState, useRef, useTransition } from "react";
import { useActionState } from "react";
import { submitCoachMessage } from "@/app/auth/actions";
import { sendTeamBroadcast } from "@/app/(app)/dashboard/team-actions";

type CoachMessage = {
  id: string;
  message: string;
  subject: string | null;
  created_at: string;
  reply: string | null;
  replied_at: string | null;
  status: string;
};

type Broadcast = {
  id: string;
  message: string;
  sent_at: string;
};

type CoachState = { error?: string; success?: boolean } | null;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function TeamCommsSection({
  teamId,
  coachMessages,
  broadcasts,
}: {
  teamId: string;
  coachMessages: CoachMessage[];
  broadcasts: Broadcast[];
}) {
  // ── Team Broadcast state ──
  const [teamMsg, setTeamMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sentList, setSentList] = useState<Broadcast[]>(broadcasts);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);
  const [teamHistoryOpen, setTeamHistoryOpen] = useState(false);

  // ── Coach form state ──
  const coachRef = useRef<HTMLFormElement>(null);
  const [coachHistoryOpen, setCoachHistoryOpen] = useState(false);
  const [coachState, coachAction, coachPending] = useActionState(
    async (_prev: CoachState, formData: FormData): Promise<CoachState> => {
      const result = await submitCoachMessage(formData);
      if (result?.success) coachRef.current?.reset();
      return result ?? null;
    },
    null,
  );

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!teamMsg.trim()) return;
    setSending(true);
    setBroadcastResult(null);
    const result = await sendTeamBroadcast(teamId, teamMsg.trim());
    if (result.error) {
      setBroadcastResult(`Error: ${result.error}`);
    } else {
      const newEntry: Broadcast = { id: Date.now().toString(), message: teamMsg.trim(), sent_at: new Date().toISOString() };
      setSentList(prev => [newEntry, ...prev]);
      setTeamMsg("");
      setBroadcastResult("Sent ✓");
      setTimeout(() => setBroadcastResult(null), 2500);
    }
    setSending(false);
  }

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.825rem",
    color: "oklch(22% 0.005 260)",
    background: "oklch(99% 0.002 80)",
    border: "1px solid oklch(84% 0.008 80)",
    padding: "0.625rem 0.75rem",
    resize: "vertical" as const,
    lineHeight: 1.6,
  };

  const historyToggleStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "oklch(55% 0.008 260)",
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(86% 0.008 80)" }}>

      {/* ── Message Your Team ── */}
      <div style={{ background: "oklch(99% 0.002 80)", overflow: "hidden" }}>
        {/* Column header — orange */}
        <div style={{
          background: "oklch(65% 0.15 45)",
          padding: "1.375rem 1.5rem 1.25rem",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.55rem",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "oklch(97% 0.003 50 / 0.7)",
            marginBottom: "0.5rem",
          }}>
            Team Message
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "1rem",
            color: "white",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}>
            Message Your Team
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
          <form onSubmit={handleBroadcast} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <textarea
              value={teamMsg}
              onChange={e => setTeamMsg(e.target.value)}
              placeholder="Send a message to your whole team…"
              rows={3}
              maxLength={300}
              className="dashboard-textarea"
              style={textareaStyle}
              required
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setTeamHistoryOpen(o => !o)}
                style={historyToggleStyle}
              >
                {sentList.length > 0 ? `${sentList.length} sent` : "No messages yet"}
                <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>{teamHistoryOpen ? "▲" : "▼"}</span>
              </button>
              <button
                type="submit"
                disabled={sending || !teamMsg.trim()}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  background: (sending || !teamMsg.trim()) ? "oklch(78% 0.08 45)" : "oklch(65% 0.15 45)",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1.125rem",
                  cursor: (sending || !teamMsg.trim()) ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {sending ? "Sending…" : "Send to all Members →"}
              </button>
            </div>
            {broadcastResult && (
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                color: broadcastResult.startsWith("Error") ? "oklch(45% 0.18 25)" : "oklch(40% 0.14 145)",
                fontWeight: 500,
              }}>
                {broadcastResult}
              </p>
            )}
          </form>

          {/* Broadcast history */}
          {teamHistoryOpen && sentList.length > 0 && (
            <div style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              background: "oklch(88% 0.008 80)",
              border: "1px solid oklch(88% 0.008 80)",
            }}>
              {sentList.slice(0, 8).map(b => (
                <div key={b.id} style={{ background: "oklch(97.5% 0.003 80)", padding: "0.625rem 0.875rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(58% 0.008 260)", marginBottom: "0.2rem" }}>
                    {fmtDate(b.sent_at)}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(32% 0.008 260)", lineHeight: 1.5 }}>
                    {b.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Talk to the Coach ── */}
      <div style={{ background: "oklch(99% 0.002 80)", overflow: "hidden" }}>
        {/* Column header — navy */}
        <div style={{
          background: "oklch(30% 0.12 260)",
          padding: "1.375rem 1.5rem 1.25rem",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.55rem",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "oklch(80% 0.06 60)",
            marginBottom: "0.5rem",
            opacity: 0.85,
          }}>
            Direct Line
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "1rem",
            color: "white",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}>
            Talk to the Coach
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
          <form ref={coachRef} action={coachAction} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <input type="hidden" name="message_type" value="leader" />
            <textarea
              name="message"
              required
              rows={3}
              maxLength={2000}
              placeholder="Ask the coach a question about your team or leadership…"
              className="dashboard-textarea"
              style={textareaStyle}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setCoachHistoryOpen(o => !o)}
                style={historyToggleStyle}
              >
                {coachMessages.length > 0 ? `${coachMessages.length} message${coachMessages.length !== 1 ? "s" : ""}` : "No messages yet"}
                <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>{coachHistoryOpen ? "▲" : "▼"}</span>
              </button>
              <button
                type="submit"
                disabled={coachPending}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  background: coachPending ? "oklch(45% 0.10 260)" : "oklch(30% 0.12 260)",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1.125rem",
                  cursor: coachPending ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {coachPending ? "Sending…" : "Send to Coach →"}
              </button>
            </div>
            {coachState?.success && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(40% 0.14 145)", fontWeight: 500 }}>Sent ✓</p>
            )}
            {coachState?.error && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(45% 0.18 25)" }}>{coachState.error}</p>
            )}
          </form>

          {/* Coach conversation history */}
          {coachHistoryOpen && coachMessages.length > 0 && (
            <div style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              background: "oklch(88% 0.008 80)",
              border: "1px solid oklch(88% 0.008 80)",
            }}>
              {coachMessages.slice(0, 6).map(msg => (
                <div key={msg.id} style={{ background: "oklch(97.5% 0.003 80)", padding: "0.625rem 0.875rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(58% 0.008 260)", marginBottom: "0.2rem" }}>
                    {fmtDate(msg.created_at)}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(32% 0.008 260)", lineHeight: 1.5 }}>
                    {msg.message}
                  </p>
                  {msg.reply && (
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      color: "oklch(35% 0.10 145)",
                      marginTop: "0.375rem",
                      paddingTop: "0.375rem",
                      borderTop: "1px solid oklch(88% 0.008 80)",
                    }}>
                      ↳ {msg.reply}
                    </p>
                  )}
                  {!msg.reply && (
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.65rem",
                      color: "oklch(62% 0.008 260)",
                      marginTop: "0.2rem",
                      fontStyle: "italic",
                    }}>
                      Awaiting reply
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
