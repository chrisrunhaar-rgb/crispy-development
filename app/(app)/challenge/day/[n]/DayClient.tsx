"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveJournalEntry, advanceToNextDay } from "@/app/challenge/actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";

type Module = {
  day_number: number;
  title: string;
  core_idea: string | null;
  content: string | null;
  biblical_foundation: string | null;
  personal_reflection_q1: string | null;
  personal_reflection_q2: string | null;
  peer_question: string | null;
  implementation_challenge: string | null;
};

export default function DayClient({
  module,
  dayNumber,
  currentDay,
  isLocked,
  initialJournal,
  firstName,
}: {
  module: Module;
  dayNumber: number;
  currentDay: number;
  isLocked: boolean;
  initialJournal: { answer1: string; answer2: string } | null;
  firstName: string;
}) {
  const [answer1, setAnswer1] = useState(initialJournal?.answer1 ?? "");
  const [answer2, setAnswer2] = useState(initialJournal?.answer2 ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [advancing, startAdvance] = useTransition();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ content: true });

  if (isLocked) {
    return (
      <div style={{ minHeight: "calc(100dvh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <IcebergIcon size={48} style={{ margin: "0 auto 1.5rem" }} />
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: navy, marginBottom: "0.75rem" }}>
            Day {dayNumber} isn&apos;t ready yet
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.65, marginBottom: "1.5rem" }}>
            Complete Day {currentDay} first to unlock the next session.
          </p>
          <Link
            href={`/challenge/day/${currentDay}`}
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: navy, padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
          >
            Go to Day {currentDay}
          </Link>
        </div>
      </div>
    );
  }

  const isToday = dayNumber === currentDay;
  const isCompleted = dayNumber < currentDay;

  async function handleSave() {
    setSaveStatus("saving");
    const result = await saveJournalEntry(dayNumber, answer1, answer2);
    setSaveStatus(result.error ? "error" : "saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  }

  function handleAdvance() {
    startAdvance(async () => {
      await advanceToNextDay(dayNumber);
      if (dayNumber < 62) {
        window.location.href = `/challenge/day/${dayNumber + 1}`;
      } else {
        window.location.href = "/challenge/complete";
      }
    });
  }

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: offWhite }}>
      {/* ── Top bar ── */}
      <div style={{ background: navy, padding: "0.875rem clamp(1rem, 4vw, 2rem)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <Link href="/dashboard" style={{ color: "oklch(72% 0.04 260)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            ← Dashboard
          </Link>
          <IcebergIcon size={24} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: offWhite, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Influential Leadership
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(65% 0.04 260)" }}>
            {dayNumber} / 62
          </div>
          <div style={{ width: "80px", height: "4px", background: "oklch(35% 0.08 260)", borderRadius: "2px" }}>
            <div style={{ width: `${(dayNumber / 62) * 100}%`, height: "100%", background: orange, borderRadius: "2px" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)" }}>

        {/* ── Day header ── */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.375rem" }}>
            Day {dayNumber.toString().padStart(2, "0")} {isCompleted ? "· Completed" : isToday ? "· Today" : ""}
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "clamp(1.5rem, 3.5vw, 2rem)", color: navy, lineHeight: 1.2, marginBottom: "0.5rem" }}>
            {module.title}
          </h1>
        </div>

        {/* ── Core Idea ── */}
        {module.core_idea && (
          <blockquote style={{ borderLeft: `3px solid ${orange}`, paddingLeft: "1.25rem", margin: "0 0 2rem", padding: "0.875rem 1.25rem", background: "white", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontStyle: "italic", color: navy, lineHeight: 1.6, margin: 0 }}>
              {module.core_idea.replace(/^"|"$/g, "")}
            </p>
          </blockquote>
        )}

        {/* ── Content ── */}
        {module.content && (
          <Section
            title="Content"
            expanded={expanded.content}
            onToggle={() => setExpanded(e => ({ ...e, content: !e.content }))}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {module.content.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(30% 0.008 260)", lineHeight: 1.75, margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>
          </Section>
        )}

        {/* ── Biblical Foundation ── */}
        {module.biblical_foundation && (
          <Section
            title="Biblical Foundation"
            expanded={expanded.biblical ?? false}
            onToggle={() => setExpanded(e => ({ ...e, biblical: !e.biblical }))}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {module.biblical_foundation.split("\n\n").map((verse, i) => (
                <p key={i} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(35% 0.008 260)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                  {verse}
                </p>
              ))}
            </div>
          </Section>
        )}

        {/* ── Implementation Challenge ── */}
        {module.implementation_challenge && (
          <div style={{ background: `${orange.replace(")", " / 0.08)")}`, border: `1px solid ${orange.replace(")", " / 0.25)")}`, borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
              This Week&apos;s Challenge
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: navy, lineHeight: 1.65, margin: 0 }}>
              {module.implementation_challenge}
            </p>
          </div>
        )}

        {/* ── Personal Journal ── */}
        <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: mid, marginBottom: "1rem" }}>
            Personal Journal — private, only you can see this
          </p>

          {module.personal_reflection_q1 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 600, color: navy, marginBottom: "0.5rem", lineHeight: 1.5 }}>
                1. {module.personal_reflection_q1}
              </p>
              <textarea
                value={answer1}
                onChange={e => { setAnswer1(e.target.value); setSaveStatus("idle"); }}
                placeholder="Write your reflection here..."
                rows={4}
                style={textareaStyle}
              />
            </div>
          )}

          {module.personal_reflection_q2 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 600, color: navy, marginBottom: "0.5rem", lineHeight: 1.5 }}>
                2. {module.personal_reflection_q2}
              </p>
              <textarea
                value={answer2}
                onChange={e => { setAnswer2(e.target.value); setSaveStatus("idle"); }}
                placeholder="Write your reflection here..."
                rows={4}
                style={textareaStyle}
              />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.625rem 1.25rem", cursor: saveStatus === "saving" ? "not-allowed" : "pointer", opacity: saveStatus === "saving" ? 0.7 : 1 }}
            >
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved ✓" : "Save journal"}
            </button>
            {saveStatus === "error" && (
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(50% 0.22 15)" }}>
                Save failed — try again
              </span>
            )}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {dayNumber > 1 ? (
            <Link
              href={`/challenge/day/${dayNumber - 1}`}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem", color: mid, border: "1px solid oklch(82% 0.006 260)", padding: "0.625rem 1.25rem", borderRadius: "8px", textDecoration: "none" }}
            >
              ← Day {dayNumber - 1}
            </Link>
          ) : <div />}

          {isToday && dayNumber < 62 && (
            <button
              onClick={handleAdvance}
              disabled={advancing}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: orange, border: "none", borderRadius: "8px", padding: "0.75rem 1.75rem", cursor: advancing ? "not-allowed" : "pointer", opacity: advancing ? 0.7 : 1 }}
            >
              {advancing ? "Advancing..." : `Mark complete & go to Day ${dayNumber + 1} →`}
            </button>
          )}

          {isToday && dayNumber === 62 && (
            <button
              onClick={handleAdvance}
              disabled={advancing}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: orange, border: "none", borderRadius: "8px", padding: "0.75rem 1.75rem", cursor: advancing ? "not-allowed" : "pointer", opacity: advancing ? 0.7 : 1 }}
            >
              {advancing ? "Finishing..." : "Complete the challenge →"}
            </button>
          )}

          {isCompleted && dayNumber < 62 && (
            <Link
              href={`/challenge/day/${dayNumber + 1}`}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: offWhite, background: navy, padding: "0.625rem 1.25rem", borderRadius: "8px", textDecoration: "none" }}
            >
              Day {dayNumber + 1} →
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}

function Section({ title, expanded, onToggle, children }: { title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", marginBottom: "1rem", overflow: "hidden" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer" }}
      >
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: mid }}>
          {title}
        </span>
        <span style={{ color: mid, fontSize: "0.75rem", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {expanded && (
        <div style={{ padding: "0.25rem 1.25rem 1.25rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function IcebergIcon({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <polygon points="20,4 28,18 12,18" fill="#f9f8f6" stroke="oklch(65% 0.15 45)" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="12,20 28,20 32,32 8,32" fill="oklch(65% 0.15 45)" opacity="0.25" />
      <line x1="8" y1="19" x2="32" y2="19" stroke="oklch(22% 0.10 260)" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  );
}

const textareaStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9rem",
  color: "oklch(22% 0.10 260)",
  background: "oklch(97% 0.005 80)",
  border: "1px solid oklch(85% 0.006 80)",
  borderRadius: "8px",
  padding: "0.75rem",
  resize: "vertical",
  outline: "none",
  lineHeight: 1.65,
  boxSizing: "border-box",
};
