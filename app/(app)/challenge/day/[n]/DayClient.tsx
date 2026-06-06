"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveJournalEntry, advanceToNextDay, saveTeamAnswer } from "@/app/challenge/actions";

const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(52% 0.008 260)";

type Module = {
  day_number: number;
  title: string;
  chapter_title: string | null;
  core_idea: string | null;
  content: string | null;
  biblical_foundation: string | null;
  personal_reflection_q1: string | null;
  personal_reflection_q2: string | null;
  peer_question: string | null;
  implementation_challenge: string | null;
};

function parseScripture(raw: string): { passage: string; ref: string | null } {
  // Split on em dash surrounded by whitespace, followed by uppercase (scripture ref)
  const parts = raw.split(/\s*—\s*(?=[A-Z1])/);
  if (parts.length >= 2) {
    return {
      passage: parts.slice(0, -1).join("—").replace(/^[""]|[""]$/g, "").trim(),
      ref: parts[parts.length - 1].trim(),
    };
  }
  return { passage: raw.replace(/^[""]|[""]$/g, "").trim(), ref: null };
}

export default function DayClient({
  module,
  dayNumber,
  currentDay,
  isLocked,
  initialJournal,
  firstName,
  hasGroup,
}: {
  module: Module;
  dayNumber: number;
  currentDay: number;
  isLocked: boolean;
  initialJournal: { answer1: string; answer2: string; peerAnswer: string } | null;
  firstName: string;
  hasGroup: boolean;
}) {
  const [answer1, setAnswer1] = useState(initialJournal?.answer1 ?? "");
  const [answer2, setAnswer2] = useState(initialJournal?.answer2 ?? "");
  const [peerAnswer, setPeerAnswer] = useState(initialJournal?.peerAnswer ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [peerSaveStatus, setPeerSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [advancing, startAdvance] = useTransition();

  if (isLocked) {
    return (
      <div style={{ minHeight: "calc(100dvh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
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
  const dayPad = dayNumber.toString().padStart(2, "0");

  // Build content paragraphs with scripture interwoven at ~1/4, 1/2, 3/4 positions
  const contentElements = (() => {
    if (!module.content) return null;
    const paras = module.content.split("\n\n");
    const verses = module.biblical_foundation ? module.biblical_foundation.split("\n\n") : [];
    const step = verses.length > 0 ? Math.floor(paras.length / (verses.length + 1)) : 0;
    const insertAfter = new Map(verses.map((v, i) => [(i + 1) * step - 1, v]));
    const els: React.ReactNode[] = [];
    paras.forEach((para, i) => {
      els.push(
        <p key={`p${i}`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(30% 0.008 260)", lineHeight: 1.75, margin: 0 }}>
          {para}
        </p>
      );
      const verse = insertAfter.get(i);
      if (verse) {
        const { passage, ref } = parseScripture(verse);
        els.push(
          <div key={`v${i}`} style={{ paddingLeft: "1.25rem", borderLeft: "2px solid oklch(65% 0.15 45 / 0.35)", margin: "0.5rem 0" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.3rem, 3vw, 1.6rem)", color: "oklch(28% 0.06 260)", lineHeight: 1.65, margin: 0 }}>
              {passage}
            </p>
            {ref && (
              <span style={{ display: "block", marginTop: "0.375rem", fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: orange }}>
                {ref}
              </span>
            )}
          </div>
        );
      }
    });
    return els;
  })();

  async function handleSave() {
    setSaveStatus("saving");
    const result = await saveJournalEntry(dayNumber, answer1, answer2);
    setSaveStatus(result.error ? "error" : "saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  }

  async function handlePeerSave() {
    setPeerSaveStatus("saving");
    const result = await saveTeamAnswer(dayNumber, peerAnswer);
    setPeerSaveStatus(result?.error ? "error" : "saved");
    setTimeout(() => setPeerSaveStatus("idle"), 3000);
  }

  function handleAdvance() {
    startAdvance(async () => {
      await advanceToNextDay(dayNumber);
      if (dayNumber === 62) {
        window.location.href = "/challenge/complete";
      } else if (hasGroup) {
        window.location.href = "/challenge/team";
      } else {
        window.location.href = "/dashboard";
      }
    });
  }

  const teamAnswerRequired = !!module.peer_question;
  const canAdvance = !teamAnswerRequired || peerAnswer.trim().length > 0;

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: offWhite }}>

      {/* ── Top bar ── */}
      <div style={{ background: navy, position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{
        maxWidth: "1020px",
        margin: "0 auto",
        padding: "1rem clamp(1rem, 4vw, 2rem)",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "1rem",
      }}>
        <Link href="/dashboard" style={{
          color: "oklch(65% 0.04 260)",
          textDecoration: "none",
          fontSize: "0.75rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}>
          ← Dashboard
        </Link>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "clamp(0.7rem, 2vw, 0.95rem)",
            color: offWhite,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Influential Leadership
          </span>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            color: orange,
            letterSpacing: "0.05em",
          }}>
            {dayPad} / 62
          </span>
          <div style={{ width: "80px", height: "3px", background: "oklch(35% 0.08 260)", borderRadius: "2px" }}>
            <div style={{ width: `${(dayNumber / 62) * 100}%`, height: "100%", background: orange, borderRadius: "2px" }} />
          </div>
        </div>

        <div />
      </div>
      </div>

      {/* ── Hero image + overlays ── */}
      <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
      <div style={{ position: "relative", width: "100%", height: "clamp(460px, 70vw, 600px)", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/iceberg-full.jpg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
        />

        {/* Top-left: Title / Day / Chapter — no background box */}
        <div style={{
          position: "absolute",
          top: "1.5rem",
          left: "clamp(1rem, 3vw, 2rem)",
          maxWidth: "520px",
        }}>
          <h1 style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 600,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.05,
            color: navy,
            margin: 0,
            marginBottom: "0.5rem",
            textShadow: "0 1px 8px oklch(97% 0.005 80 / 0.8)",
          }}>
            {module.title}
          </h1>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "clamp(0.65rem, 1.1vw, 0.85rem)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: orange,
            margin: 0,
            marginBottom: "0.25rem",
            textShadow: "0 1px 4px oklch(97% 0.005 80 / 0.6)",
          }}>
            Day {dayPad}{isCompleted ? " \xb7 Completed" : ""}
          </p>
          {module.chapter_title && (
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              fontSize: "clamp(0.65rem, 1.1vw, 0.85rem)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: orange,
              opacity: 0.85,
              margin: 0,
              textShadow: "0 1px 4px oklch(97% 0.005 80 / 0.6)",
            }}>
              {module.chapter_title}
            </p>
          )}
        </div>

        {/* Bottom: quote box */}
        {module.core_idea && (
          <div style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - clamp(2rem, 10vw, 6rem))",
            maxWidth: "560px",
            background: "oklch(22% 0.10 260 / 0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid oklch(100% 0 0 / 0.12)",
            borderRadius: "10px",
            padding: "1.125rem 1.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: offWhite,
              lineHeight: 1.55,
              margin: 0,
              textAlign: "center",
            }}>
              {module.core_idea.replace(/^[""]|[""]$/g, "")}
            </p>
          </div>
        )}
      </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "2.5rem clamp(1rem, 4vw, 2rem) clamp(2rem, 5vw, 3rem)" }}>

        {/* Content with scripture woven in */}
        {contentElements && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2.5rem" }}>
            {contentElements}
          </div>
        )}

        {/* Today's Challenge */}
        {module.implementation_challenge && (
          <div style={{
            position: "relative",
            background: navy,
            borderRadius: "14px",
            padding: "1.75rem 2rem 1.75rem 2.5rem",
            marginBottom: "2rem",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              left: 0, top: 0, bottom: 0,
              width: "5px",
              background: orange,
              borderRadius: "14px 0 0 14px",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: orange,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: "white", fontSize: "10px", fontWeight: 800 }}>→</span>
              </div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "0.625rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: orange,
                margin: 0,
              }}>
                Today&apos;s Challenge
              </p>
            </div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 500,
              fontSize: "1rem",
              color: offWhite,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {module.implementation_challenge}
            </p>
          </div>
        )}

        {/* Personal Journal */}
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

        {/* Team Sharing */}
        {module.peer_question && (
          <div style={{
            background: "oklch(22% 0.10 260 / 0.06)",
            border: "1px solid oklch(22% 0.10 260 / 0.18)",
            borderRadius: "14px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
              <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: navy }} />
                <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: orange, marginLeft: "-4px" }} />
              </div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: navy, margin: 0 }}>
                Team Sharing
              </p>
            </div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6875rem", color: mid, marginBottom: "1rem" }}>
              Your answer is visible to everyone in your group.
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9375rem", color: navy, lineHeight: 1.55, marginBottom: "0.875rem" }}>
              {module.peer_question}
            </p>
            <textarea
              value={peerAnswer}
              onChange={e => { setPeerAnswer(e.target.value); setPeerSaveStatus("idle"); }}
              placeholder="Share your response with your team..."
              rows={3}
              style={textareaStyle}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
              <button
                onClick={handlePeerSave}
                disabled={peerSaveStatus === "saving"}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: offWhite, background: navy, border: "none", borderRadius: "8px", padding: "0.625rem 1.25rem", cursor: peerSaveStatus === "saving" ? "not-allowed" : "pointer", opacity: peerSaveStatus === "saving" ? 0.7 : 1 }}
              >
                {peerSaveStatus === "saving" ? "Saving..." : peerSaveStatus === "saved" ? "Shared ✓" : "Share with team"}
              </button>
              {peerSaveStatus === "error" && (
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(50% 0.22 15)" }}>
                  Save failed — try again
                </span>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          {dayNumber > 1 ? (
            <Link
              href={`/challenge/day/${dayNumber - 1}`}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8125rem", color: mid, border: "1px solid oklch(82% 0.006 260)", padding: "0.625rem 1.25rem", borderRadius: "8px", textDecoration: "none" }}
            >
              ← Day {dayNumber - 1}
            </Link>
          ) : <div />}

          {isToday && dayNumber < 62 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
              {teamAnswerRequired && !peerAnswer.trim() && (
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: mid }}>
                  Share with your team first to mark complete
                </span>
              )}
              <button
                onClick={handleAdvance}
                disabled={advancing || !canAdvance}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: orange, border: "none", borderRadius: "8px", padding: "0.75rem 1.75rem", cursor: (advancing || !canAdvance) ? "not-allowed" : "pointer", opacity: (advancing || !canAdvance) ? 0.45 : 1 }}
              >
                {advancing ? "Saving..." : "Mark complete →"}
              </button>
            </div>
          )}

          {isToday && dayNumber === 62 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
              {teamAnswerRequired && !peerAnswer.trim() && (
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: mid }}>
                  Share with your team first to mark complete
                </span>
              )}
              <button
                onClick={handleAdvance}
                disabled={advancing || !canAdvance}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: orange, border: "none", borderRadius: "8px", padding: "0.75rem 1.75rem", cursor: (advancing || !canAdvance) ? "not-allowed" : "pointer", opacity: (advancing || !canAdvance) ? 0.45 : 1 }}
              >
                {advancing ? "Finishing..." : "Complete the challenge →"}
              </button>
            </div>
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
