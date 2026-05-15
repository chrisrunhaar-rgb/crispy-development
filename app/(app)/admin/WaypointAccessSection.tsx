"use client";

import { useState, useTransition } from "react";
import { updateMemberCoachAccess } from "./actions";

const navy = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

interface MemberCoachRow {
  id: string;
  email: string;
  name: string;
  coach_access: boolean;
  coach_minutes_granted: number;
}

function CoachRow({ member }: { member: MemberCoachRow }) {
  const [access, setAccess] = useState(member.coach_access);
  const [minutes, setMinutes] = useState(member.coach_minutes_granted);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  const isDirty = access !== member.coach_access || minutes !== member.coach_minutes_granted;

  function handleSave() {
    startTransition(async () => {
      await updateMemberCoachAccess(member.id, access, minutes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div style={{
      background: "white",
      padding: "0.875rem 1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      flexWrap: "wrap",
      borderLeft: `3px solid ${access ? "oklch(52% 0.14 150)" : "oklch(82% 0.008 80)"}`,
    }}>
      <div style={{ flex: 1, minWidth: "160px" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: navy, margin: 0 }}>
          {member.name || member.email}
        </p>
        {member.name && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(55% 0.008 260)", margin: "0.1rem 0 0" }}>
            {member.email}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
        {([true, false] as const).map(val => (
          <button
            key={String(val)}
            type="button"
            onClick={() => setAccess(val)}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.68rem",
              fontWeight: 700,
              padding: "0.3rem 0.75rem",
              border: `1px solid ${access === val ? (val ? "oklch(52% 0.14 150)" : "oklch(58% 0.008 260)") : "oklch(82% 0.008 80)"}`,
              background: access === val ? (val ? "oklch(52% 0.14 150)" : "oklch(55% 0.008 260)") : "transparent",
              color: access === val ? "white" : "oklch(55% 0.008 260)",
              cursor: "pointer",
            }}
          >
            {val ? "ON" : "OFF"}
          </button>
        ))}
      </div>

      {access && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
          <input
            type="number"
            min={1}
            max={9999}
            value={minutes}
            onChange={e => setMinutes(Math.max(1, parseInt(e.target.value) || 120))}
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8rem",
              width: "72px",
              border: "1px solid oklch(82% 0.008 80)",
              padding: "0.3rem 0.5rem",
              background: "white",
              color: navy,
            }}
          />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(55% 0.008 260)" }}>min</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!isDirty && !saved}
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.68rem",
          fontWeight: 700,
          padding: "0.35rem 0.875rem",
          border: "none",
          background: saved ? "oklch(52% 0.14 150)" : isDirty ? navy : "oklch(88% 0.008 80)",
          color: isDirty || saved ? "white" : "oklch(62% 0.008 260)",
          cursor: isDirty ? "pointer" : "default",
          flexShrink: 0,
          minWidth: "60px",
        }}
      >
        {saved ? "✓ Saved" : "Save"}
      </button>
    </div>
  );
}

export default function WaypointAccessSection({
  members,
}: {
  members: MemberCoachRow[];
}) {
  const withAccess = members.filter(m => m.coach_access);
  const withoutAccess = members.filter(m => !m.coach_access);

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "oklch(52% 0.008 260)",
    marginBottom: "1rem",
  };

  return (
    <section>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
        <h2 style={{ ...labelStyle, margin: 0 }}>WayPoint Access</h2>
        {withAccess.length > 0 && (
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "white", background: "oklch(52% 0.14 150)", padding: "0.15rem 0.5rem", borderRadius: 3 }}>
            {withAccess.length} active
          </span>
        )}
      </div>

      {members.length === 0 && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(62% 0.008 260)" }}>No members yet.</p>
      )}

      {withAccess.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)", marginBottom: "1rem" }}>
          {withAccess.map(m => <CoachRow key={m.id} member={m} />)}
        </div>
      )}

      {withoutAccess.length > 0 && (
        <details>
          <summary style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: "oklch(52% 0.008 260)", cursor: "pointer", marginBottom: "0.75rem" }}>
            No access ({withoutAccess.length})
          </summary>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {withoutAccess.map(m => <CoachRow key={m.id} member={m} />)}
          </div>
        </details>
      )}
    </section>
  );
}
