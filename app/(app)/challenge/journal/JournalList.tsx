"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const navy   = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const mid    = "oklch(52% 0.008 260)";

type Entry = {
  day_number: number;
  answer_1: string | null;
  answer_2: string | null;
};

type Module = {
  day_number: number;
  title: string;
  personal_reflection_q1: string | null;
  personal_reflection_q2: string | null;
};

export default function JournalList({ entries, moduleMap }: { entries: Entry[]; moduleMap: Record<number, Module> }) {
  const { t } = useLanguage();
  const c = t.challenge;
  const validEntries = entries.filter(e => e.answer_1?.trim() || e.answer_2?.trim());
  const [openDays, setOpenDays] = useState<Set<number>>(new Set(validEntries.length > 0 ? [validEntries[0].day_number] : []));

  function toggle(day: number) {
    setOpenDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  if (validEntries.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {validEntries.map(entry => {
        const mod = moduleMap[entry.day_number];
        const isOpen = openDays.has(entry.day_number);

        return (
          <div
            key={entry.day_number}
            style={{
              background: "white",
              border: "1px solid oklch(88% 0.006 80)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Clickable header */}
            <button
              onClick={() => toggle(entry.day_number)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "1rem 1.5rem",
                borderBottom: isOpen ? "1px solid oklch(92% 0.006 80)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                textAlign: "left",
              }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.2rem" }}>
                  {c.journalDayLabel} {String(entry.day_number).padStart(2, "0")}
                </p>
                {mod && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: navy, margin: 0 }}>
                    {mod.title}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                <Link
                  href={`/challenge/day/${entry.day_number}`}
                  onClick={e => e.stopPropagation()}
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 600, color: mid, textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  {c.journalViewSession}
                </Link>
                <span style={{ color: mid, fontSize: "0.85rem", lineHeight: 1, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "block" }}>
                  ▾
                </span>
              </div>
            </button>

            {/* Collapsible content */}
            {isOpen && (
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {entry.answer_1?.trim() && (
                  <div>
                    {mod?.personal_reflection_q1 && (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: navy, marginBottom: "0.375rem", lineHeight: 1.5 }}>
                        1. {mod.personal_reflection_q1}
                      </p>
                    )}
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(35% 0.008 260)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
                      {entry.answer_1}
                    </p>
                  </div>
                )}
                {entry.answer_2?.trim() && (
                  <div>
                    {mod?.personal_reflection_q2 && (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: navy, marginBottom: "0.375rem", lineHeight: 1.5 }}>
                        2. {mod.personal_reflection_q2}
                      </p>
                    )}
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(35% 0.008 260)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
                      {entry.answer_2}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
