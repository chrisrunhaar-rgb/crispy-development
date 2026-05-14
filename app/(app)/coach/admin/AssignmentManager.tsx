"use client";

import { useState } from "react";

type Profile = { user_id: string; name: string | null; organisation: string | null };
type Assignment = { id: string; leader_user_id: string; worker_user_id: string; assigned_at: string };
type UserRecord = { id: string; email: string; name: string };

export default function AssignmentManager({
  profiles,
  assignments: initialAssignments,
  allUsers,
}: {
  profiles: Profile[];
  assignments: Assignment[];
  allUsers: UserRecord[];
}) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [leaderId, setLeaderId] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const workerIds = new Set(profiles.map(p => p.user_id));
  const workerUsers = allUsers.filter(u => workerIds.has(u.id));

  async function assign() {
    if (!leaderId || !workerId) return;
    setSaving(true);
    const res = await fetch("/api/coach/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leader_user_id: leaderId, worker_user_id: workerId }),
    });
    if (res.ok) {
      const { assignment } = await res.json();
      setAssignments(a => [...a, assignment]);
      setLeaderId("");
      setWorkerId("");
    }
    setSaving(false);
  }

  async function remove(id: string) {
    setRemoving(id);
    await fetch(`/api/coach/admin/assign?id=${id}`, { method: "DELETE" });
    setAssignments(a => a.filter(x => x.id !== id));
    setRemoving(null);
  }

  const getName = (id: string) => allUsers.find(u => u.id === id)?.name ?? id;

  return (
    <div style={{ maxWidth: "720px" }}>

      {/* New assignment */}
      <div style={{ background: "white", border: "1px solid oklch(88% 0.008 80)", padding: "2rem", marginBottom: "2.5rem" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "1.5rem" }}>
          Assign Worker to Leader
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={labelStyle}>Leader</label>
            <select style={selectStyle} value={leaderId} onChange={e => setLeaderId(e.target.value)}>
              <option value="">Select leader…</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Worker</label>
            <select style={selectStyle} value={workerId} onChange={e => setWorkerId(e.target.value)}>
              <option value="">Select worker…</option>
              {workerUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={assign}
          disabled={!leaderId || !workerId || saving}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0.75rem 1.5rem",
            background: (!leaderId || !workerId) ? "oklch(88% 0.008 80)" : "oklch(30% 0.12 260)",
            color: (!leaderId || !workerId) ? "oklch(60% 0.008 260)" : "oklch(97% 0.005 80)",
            border: "none",
            cursor: (!leaderId || !workerId) ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Assigning…" : "Assign"}
        </button>
      </div>

      {/* Existing assignments */}
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "1rem" }}>
        Current Assignments ({assignments.length})
      </p>

      {assignments.length === 0 ? (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(62% 0.008 260)", fontStyle: "italic" }}>
          No assignments yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
          {assignments.map(a => (
            <div key={a.id} style={{ background: "white", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.008 260)", fontWeight: 600 }}>
                  {getName(a.worker_user_id)}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(60% 0.008 260)", marginTop: "0.1rem" }}>
                  Leader: {getName(a.leader_user_id)}
                </p>
              </div>
              <button
                onClick={() => remove(a.id)}
                disabled={removing === a.id}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "oklch(55% 0.15 25)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                }}
              >
                {removing === a.id ? "…" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 600,
  fontSize: "0.75rem",
  color: "oklch(42% 0.008 260)",
  marginBottom: "0.375rem",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.875rem",
  color: "oklch(22% 0.008 260)",
  background: "white",
  border: "1px solid oklch(82% 0.008 80)",
  padding: "0.625rem 0.875rem",
  outline: "none",
};
