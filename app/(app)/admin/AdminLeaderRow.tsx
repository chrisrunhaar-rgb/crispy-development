"use client";

import { useState } from "react";
import AdminReplyForm from "./AdminReplyForm";
import { markMessageRead } from "./actions";

type CoachMsg = {
  id: string;
  message: string;
  subject: string | null;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
  status: string;
};

type TeamMember = {
  name: string;
  email: string;
  completed: number;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminLeaderRow({
  leader,
  teamName,
  teamMembers,
  messages,
}: {
  leader: {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    user_email: string;
    organisation: string;
    team_size: string;
    work_type: string;
    reason: string;
    reviewed_at: string;
  };
  teamName: string | null;
  teamMembers: TeamMember[];
  messages: CoachMsg[];
}) {
  const [open, setOpen] = useState(false);
  const newMsgCount = messages.filter(m => m.status === "new").length;

  const nameStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontWeight: 700,
    fontSize: "0.9375rem",
    color: "oklch(22% 0.005 260)",
  };

  const metaStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.8rem",
    color: "oklch(55% 0.008 260)",
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "oklch(55% 0.008 260)",
    marginBottom: "0.25rem",
  };

  return (
    <div style={{ background: "oklch(99% 0.002 80)", borderBottom: "1px solid oklch(88% 0.008 80)" }}>
      {/* Row header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.125rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
            <p style={nameStyle}>{leader.first_name} {leader.last_name}</p>
            {teamName && (
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "0.2rem 0.5rem",
                background: "oklch(30% 0.12 260 / 0.08)",
                color: "oklch(30% 0.12 260)",
              }}>
                {teamName}
              </span>
            )}
            {newMsgCount > 0 && (
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.58rem",
                fontWeight: 800,
                padding: "0.15rem 0.45rem",
                background: "oklch(65% 0.15 45)",
                color: "white",
              }}>
                {newMsgCount} new
              </span>
            )}
          </div>
          <p style={{ ...metaStyle, marginTop: "0.2rem" }}>
            {leader.user_email} · {leader.organisation} · {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""} · Approved {formatDate(leader.reviewed_at)}
          </p>
        </div>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(52% 0.008 260)", flexShrink: 0 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div style={{ borderTop: "1px solid oklch(90% 0.006 80)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Application details */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Organisation", value: leader.organisation },
              { label: "Team size (stated)", value: leader.team_size },
              { label: "Work type", value: leader.work_type },
            ].map(f => (
              <div key={f.label}>
                <p style={fieldLabelStyle}>{f.label}</p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.008 260)" }}>{f.value || "—"}</p>
              </div>
            ))}
          </div>

          {leader.reason && (
            <div>
              <p style={fieldLabelStyle}>Why they applied</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(32% 0.008 260)", lineHeight: 1.6 }}>{leader.reason}</p>
            </div>
          )}

          {/* Team members */}
          {teamMembers.length > 0 && (
            <div>
              <p style={fieldLabelStyle}>Team Members ({teamMembers.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                {teamMembers.map(member => (
                  <div key={member.email} style={{ background: "oklch(97.5% 0.003 80)", padding: "0.625rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 600, color: "oklch(22% 0.005 260)" }}>{member.name}</p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(58% 0.008 260)" }}>{member.email}</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.008 260)", whiteSpace: "nowrap" }}>
                      {member.completed > 0 ? `${member.completed} module${member.completed !== 1 ? "s" : ""}` : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communications */}
          <div>
            <p style={fieldLabelStyle}>
              Communications ({messages.length})
              {newMsgCount > 0 && <span style={{ marginLeft: "0.5rem", color: "oklch(65% 0.15 45)" }}> · {newMsgCount} new</span>}
            </p>
            {messages.length === 0 ? (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(62% 0.008 260)" }}>No messages yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ background: "oklch(99% 0.002 80)", padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(58% 0.008 260)" }}>
                        {formatDate(msg.created_at)}
                      </p>
                      {msg.status === "new" && (
                        <form action={markMessageRead} style={{ display: "inline" }}>
                          <input type="hidden" name="messageId" value={msg.id} />
                          <button type="submit" style={{ background: "oklch(65% 0.15 45)", border: "none", fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "white", padding: "0.2rem 0.5rem", cursor: "pointer" }}>
                            New — Mark read
                          </button>
                        </form>
                      )}
                      {msg.status === "replied" && (
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(45% 0.14 145)", fontWeight: 700 }}>✓ Replied</span>
                      )}
                    </div>
                    {msg.subject && (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem", color: "oklch(30% 0.12 260)", marginBottom: "0.375rem" }}>{msg.subject}</p>
                    )}
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.6, color: "oklch(32% 0.008 260)" }}>{msg.message}</p>
                    <AdminReplyForm
                      messageId={msg.id}
                      existingReply={msg.reply}
                      repliedAt={msg.replied_at}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
