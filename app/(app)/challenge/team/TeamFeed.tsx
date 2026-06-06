"use client";

import { useState } from "react";

const navy   = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const mid    = "oklch(52% 0.008 260)";

type PeerEntry = { user_id: string; name: string; answer: string };
type ModuleInfo = { day_number: number; title: string; core_idea: string | null; peer_question: string | null };
type MemberInfo = { user_id: string; name: string; current_day: number; role: string; is_me: boolean };

export default function TeamFeed({
  days,
  answersByDay,
  moduleMap,
  currentUserId,
  members,
}: {
  days: number[];
  answersByDay: Record<string, PeerEntry[]>;
  moduleMap: Record<string, ModuleInfo>;
  currentUserId: string;
  members: MemberInfo[];
}) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set(days.length > 0 ? [days[0]] : []));

  function toggle(day: number) {
    setOpenDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {days.map(day => {
        const isOpen = openDays.has(day);
        const mod = moduleMap[String(day)];
        const answers = answersByDay[String(day)] ?? [];
        const noResponseMembers = members.filter(m => !answers.find(a => a.user_id === m.user_id));

        return (
          <div key={day} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", overflow: "hidden" }}>
            <button
              onClick={() => toggle(day)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1rem 1.5rem", borderBottom: isOpen ? "1px solid oklch(92% 0.006 80)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", textAlign: "left" }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.2rem" }}>
                  Day {String(day).padStart(2, "0")}
                </p>
                {mod && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: navy, margin: 0 }}>
                    {mod.title}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: mid }}>
                  {answers.length} response{answers.length !== 1 ? "s" : ""}
                </span>
                <span style={{ color: mid, fontSize: "0.85rem", lineHeight: 1, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "block" }}>
                  ▾
                </span>
              </div>
            </button>

            {isOpen && (
              <div style={{ padding: "1.25rem 1.5rem" }}>
                {mod?.peer_question && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(42% 0.10 260)", marginBottom: "1rem", lineHeight: 1.5 }}>
                    {mod.peer_question}
                  </p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {answers.map((a, i) => (
                    <div key={i} style={{ borderLeft: `3px solid ${a.user_id === currentUserId ? orange : "oklch(82% 0.06 260)"}`, paddingLeft: "0.875rem" }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: a.user_id === currentUserId ? orange : mid, marginBottom: "0.3rem" }}>
                        {a.user_id === currentUserId ? "You" : a.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.008 260)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                        {a.answer}
                      </p>
                    </div>
                  ))}
                  {noResponseMembers.map(m => (
                    <div key={m.user_id} style={{ borderLeft: "3px solid oklch(88% 0.006 80)", paddingLeft: "0.875rem" }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(72% 0.006 260)", marginBottom: "0.2rem" }}>
                        {m.is_me ? "You" : m.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", color: "oklch(68% 0.006 260)", fontStyle: "italic", margin: 0 }}>
                        No response yet
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
