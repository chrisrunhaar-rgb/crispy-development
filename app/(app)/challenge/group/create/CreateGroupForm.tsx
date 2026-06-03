"use client";

import { useActionState, useState, useMemo } from "react";
import Link from "next/link";
import { createGroup } from "@/app/challenge/group-actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";

const DAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

const SESSIONS = 62;

function calcEndDate(startDateStr: string, daysPerWeek: number): string {
  if (!startDateStr || daysPerWeek === 0) return "";
  const start = new Date(startDateStr + "T00:00:00");
  const weeksNeeded = Math.ceil(SESSIONS / daysPerWeek);
  const end = new Date(start);
  end.setDate(end.getDate() + weeksNeeded * 7 - 1);
  return end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const initialState = { error: "" };

export default function CreateGroupForm() {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isPublic, setIsPublic]         = useState(false);
  const [hasMeetings, setHasMeetings]   = useState(false);
  const [startDate, setStartDate]       = useState("");

  const endDateDisplay = useMemo(
    () => calcEndDate(startDate, selectedDays.length),
    [startDate, selectedDays.length]
  );

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      selectedDays.forEach(d => formData.append("schedule_days", String(d)));
      formData.set("is_public", String(isPublic));
      formData.set("has_meetings", String(hasMeetings));
      const result = await createGroup(formData);
      return result ?? initialState;
    },
    initialState,
  );

  function toggleDay(day: number) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div style={{ width: "100%", maxWidth: "520px" }}>
      <Link href="/challenge/solo" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: mid, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
        ← Back
      </Link>

      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
        Facilitator path
      </p>
      <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, lineHeight: 1.15, marginBottom: "0.5rem" }}>
        Create your group
      </h1>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.6, marginBottom: "2rem" }}>
        You&apos;ll get an invite link to share. Members read together on the same schedule.
      </p>

      <form action={formAction}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Group name</label>
            <input name="name" type="text" required placeholder="e.g. Leadership Team 2025" style={inputStyle} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description <span style={{ fontWeight: 400, color: mid }}>(optional)</span></label>
            <textarea name="description" rows={3} placeholder="What's this group about? Who's it for?" style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Reading days */}
          <div>
            <label style={labelStyle}>Reading days</label>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: mid, marginBottom: "0.75rem" }}>
              Which days do members read? Members can read any day, but these are the scheduled nudge days.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {DAYS.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                    padding: "0.5rem 0.875rem", borderRadius: "8px", border: "1px solid",
                    cursor: "pointer",
                    background: selectedDays.includes(d.value) ? navy : "white",
                    color: selectedDays.includes(d.value) ? offWhite : mid,
                    borderColor: selectedDays.includes(d.value) ? navy : "oklch(82% 0.006 260)",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start date + end date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Start date</label>
              <input
                name="start_date"
                type="date"
                min={todayStr}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Estimated end date</label>
              <div style={{ ...inputStyle, color: endDateDisplay ? navy : "oklch(70% 0.006 260)", background: "oklch(94% 0.004 80)", display: "flex", alignItems: "center" }}>
                {endDateDisplay || (selectedDays.length === 0 ? "Pick reading days" : "Pick a start date")}
              </div>
            </div>
          </div>

          {/* Online meetings toggle */}
          <div style={{ background: "white", border: `1px solid ${hasMeetings ? orange.replace(")", " / 0.4)") : "oklch(88% 0.006 80)"}`, borderRadius: "12px", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.25rem" }}>
                  Online meetings
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, lineHeight: 1.55 }}>
                  Highly recommended. Each topic has a guided discussion script for the facilitator — making it easy to lead the group conversation online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHasMeetings(p => !p)}
                style={{
                  width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: hasMeetings ? orange : "oklch(82% 0.006 260)",
                  position: "relative", flexShrink: 0, transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: "2px", left: hasMeetings ? "22px" : "2px",
                  width: "20px", height: "20px", borderRadius: "50%", background: "white",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>

            {hasMeetings && (
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid oklch(90% 0.006 80)" }}>
                <label style={labelStyle}>Your Zoom / Teams meeting link <span style={{ fontWeight: 400, color: mid }}>(optional)</span></label>
                <input
                  name="meeting_link"
                  type="url"
                  placeholder="https://zoom.us/j/... or https://teams.microsoft.com/..."
                  style={inputStyle}
                />
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: mid, marginTop: "0.375rem" }}>
                  Members will see this link on each daily session page.
                </p>
              </div>
            )}
          </div>

          {/* Open group toggle */}
          <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: navy, marginBottom: "0.25rem" }}>Open group</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, lineHeight: 1.5 }}>
                Anyone can discover and apply to join. You approve each member.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(p => !p)}
              style={{
                width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                background: isPublic ? orange : "oklch(82% 0.006 260)",
                position: "relative", flexShrink: 0, transition: "background 0.2s",
              }}
            >
              <span style={{
                position: "absolute", top: "2px", left: isPublic ? "22px" : "2px",
                width: "20px", height: "20px", borderRadius: "50%", background: "white",
                transition: "left 0.2s",
              }} />
            </button>
          </div>

        </div>

        {state.error && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(50% 0.22 15)", marginTop: "1rem" }}>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || selectedDays.length === 0}
          style={{ width: "100%", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.9375rem", cursor: pending ? "not-allowed" : "pointer", opacity: pending || selectedDays.length === 0 ? 0.7 : 1, marginTop: "1.5rem" }}
        >
          {pending ? "Creating group..." : "Create group →"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700,
  color: "oklch(42% 0.008 260)", display: "block", marginBottom: "0.375rem",
  letterSpacing: "0.04em", textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%", fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem",
  color: "oklch(22% 0.10 260)", background: "white",
  border: "1px solid oklch(82% 0.006 260)", borderRadius: "8px",
  padding: "0.75rem 1rem", outline: "none", boxSizing: "border-box",
};
