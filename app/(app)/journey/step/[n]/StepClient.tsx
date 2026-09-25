"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { completeStep, getStepAiQuestion, saveStepJournal } from "@/app/journey/actions";

const navy     = "oklch(30% 0.12 260)";
const rule     = "oklch(84% 0.01 80)";
const band     = "oklch(90.5% 0.012 80)";
const text     = "oklch(32% 0.06 260)";
const orangeDeep = "oklch(58% 0.16 45)";
const orange   = "oklch(65% 0.15 45)";
const green    = "oklch(55% 0.14 150)";
const offWhite = "oklch(97% 0.005 80)";
const mid      = "oklch(48% 0.04 260)";

type Step = {
  title: string;
  chapter_title: string | null;
  core_idea: string | null;
  content: string | null;
  biblical_foundation: string | null;
  implementation_challenge: string | null;
  q1: string | null;
  q2: string | null;
};

type Journal = { answer1: string; answer2: string; aiQuestion: string | null; aiAnswer: string };

function parseScripture(raw: string): { passage: string; ref: string | null } {
  const parts = raw.split(/\s*—\s*(?=[A-Z1])/);
  if (parts.length >= 2) {
    return {
      passage: parts.slice(0, -1).join("—").replace(/^[""]|[""]$/g, "").trim(),
      ref: parts[parts.length - 1].trim(),
    };
  }
  return { passage: raw.replace(/^[""]|[""]$/g, "").trim(), ref: null };
}

const textareaStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.9rem",
  color: navy,
  background: offWhite,
  border: "1px solid oklch(84% 0.01 80)",
  padding: "0.75rem",
  resize: "vertical",
  lineHeight: 1.65,
  boxSizing: "border-box",
};

export default function StepClient({
  stepNumber,
  chapterCode,
  lang,
  doneCount,
  initiallyCompleted,
  step,
  initialJournal,
}: {
  stepNumber: number;
  chapterCode: string;
  lang: "en" | "id";
  doneCount: number;
  initiallyCompleted: boolean;
  step: Step;
  initialJournal: Journal;
}) {
  const isId = lang === "id";
  const t = isId
    ? {
        back: "← Perjalanan",
        label: "Perjalanan Kepemimpinan",
        stepOf: `Bab ${chapterCode}`,
        stepEyebrow: `Bab ${chapterCode}`,
        challenge: "Tantangan bab ini",
        complete: "Selesaikan bab ini",
        completing: "Menyimpan...",
        completed: "Selesai ✓",
        openJournal: "Buka jurnal",
        prev: "← Bab sebelumnya",
        next: "Bab berikutnya →",
        journalEyebrow: "Jurnal",
        journalTitle: "Luangkan waktu sejenak untuk merenung",
        journalHint: "Jawabanmu hanya untukmu. Kamu bisa melewatinya dan kembali nanti.",
        coachLabel: "Pertanyaan untukmu",
        thinking: "Sedang menyiapkan pertanyaan untukmu...",
        placeholder: "Tulis jawabanmu di sini...",
        save: "Simpan jurnal",
        saving: "Menyimpan...",
        skip: "Lewati untuk sekarang",
        error: "Gagal menyimpan. Coba lagi.",
        doneMsg: "Bab ditandai selesai.",
      }
    : {
        back: "← Journey",
        label: "Leadership Journey",
        stepOf: `Chapter ${chapterCode}`,
        stepEyebrow: `Chapter ${chapterCode}`,
        challenge: "This chapter's challenge",
        complete: "Complete this chapter",
        completing: "Saving...",
        completed: "Completed ✓",
        openJournal: "Open journal",
        prev: "← Previous chapter",
        next: "Next chapter →",
        journalEyebrow: "Journal",
        journalTitle: "Take a moment to reflect",
        journalHint: "Your answers are just for you. You can skip this and come back later.",
        coachLabel: "A question for you",
        thinking: "Thinking of a question for you...",
        placeholder: "Write your answer here...",
        save: "Save journal",
        saving: "Saving...",
        skip: "Skip for now",
        error: "Could not save. Please try again.",
        doneMsg: "Chapter marked as done.",
      };

  const [completed, setCompleted] = useState(initiallyCompleted);
  const [modalOpen, setModalOpen] = useState(false);
  const [completing, startComplete] = useTransition();
  const [completeError, setCompleteError] = useState(false);

  const [answer1, setAnswer1] = useState(initialJournal.answer1);
  const [answer2, setAnswer2] = useState(initialJournal.answer2);
  const [aiQuestion, setAiQuestion] = useState<string | null>(initialJournal.aiQuestion);
  const [aiAnswer, setAiAnswer] = useState(initialJournal.aiAnswer);
  const [aiLoading, setAiLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error">("idle");

  const progress = Math.min(((doneCount + (completed && !initiallyCompleted ? 1 : 0)) / 60) * 100, 100);

  function openJournal() {
    setModalOpen(true);
    if (!aiQuestion && !aiLoading) {
      setAiLoading(true);
      getStepAiQuestion(stepNumber)
        .then(q => { if (q) setAiQuestion(q); })
        .finally(() => setAiLoading(false));
    }
  }

  function handleComplete() {
    setCompleteError(false);
    startComplete(async () => {
      const res = await completeStep(stepNumber);
      if (res.error) { setCompleteError(true); return; }
      setCompleted(true);
      openJournal();
    });
  }

  async function handleSave() {
    setSaveState("saving");
    const res = await saveStepJournal(stepNumber, answer1, answer2, aiQuestion, aiAnswer);
    if (res.error) { setSaveState("error"); return; }
    window.location.href = "/journey/iceberg";
  }

  function handleSkip() {
    window.location.href = "/journey/iceberg";
  }

  // Close on Escape, lock page scroll while the journal is open
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [modalOpen]);

  const contentElements = (() => {
    if (!step.content) return null;
    const paras = step.content.split("\n\n");
    const verses = step.biblical_foundation ? step.biblical_foundation.split("\n\n") : [];
    const every = verses.length > 0 ? Math.floor(paras.length / (verses.length + 1)) : 0;
    const insertAfter = new Map(verses.map((v, i) => [(i + 1) * every - 1, v]));
    const els: React.ReactNode[] = [];
    paras.forEach((para, i) => {
      els.push(
        <p key={`p${i}`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: text, lineHeight: 1.75, margin: 0 }}>
          {para}
        </p>
      );
      const verse = insertAfter.get(i);
      if (verse) {
        const { passage, ref } = parseScripture(verse);
        els.push(
          <div key={`v${i}`} style={{ padding: "0.25rem 0 0.25rem 1.25rem", borderLeft: `2px solid ${orange}`, margin: "0.75rem 0" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.3rem, 3vw, 1.6rem)", color: navy, lineHeight: 1.5, margin: 0 }}>
              {passage}
            </p>
            {ref && (
              <span style={{ display: "block", marginTop: "0.375rem", fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: orangeDeep }}>
                {ref}
              </span>
            )}
          </div>
        );
      }
    });
    return els;
  })();

  const linkBtn: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
    color: navy, textDecoration: "none", padding: "0.6rem 0",
  };

  return (
    <div className="jrn" style={{ minHeight: "calc(100dvh - 80px)", background: offWhite }}>
      <style>{`.jrn a:focus-visible, .jrn button:focus-visible, .jrn summary:focus-visible, .jrn textarea:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { .jrn *, .jrn *::before, .jrn *::after { transition: none !important; animation: none !important; } }`}</style>

      {/* Top bar */}
      <div style={{ background: offWhite, borderBottom: `1px solid ${rule}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "1rem clamp(1rem, 4vw, 2rem)", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "1rem" }}>
          <Link href="/journey/iceberg" style={{ color: mid, textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)", fontWeight: 600, letterSpacing: "0.04em" }}>
            {t.back}
          </Link>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "clamp(0.6rem, 1.8vw, 0.72rem)", color: mid, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {t.label}
            </span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "clamp(1rem, 3vw, 1.35rem)", color: navy, letterSpacing: "0.05em" }}>
              {t.stepOf}
            </span>
            <div style={{ width: "80px", height: "3px", background: rule }}>
              <div style={{ width: `${progress}%`, height: "100%", background: green }} />
            </div>
          </div>
          <div />
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
        <div style={{ position: "relative", width: "100%", height: "clamp(460px, 70vw, 600px)", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/iceberg-full.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
          <div style={{ position: "absolute", top: "1.5rem", left: "clamp(1rem, 3vw, 2rem)", maxWidth: "520px" }}>
            <h1 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05, color: navy, margin: "0 0 0.5rem", textShadow: "0 1px 8px oklch(97% 0.005 80 / 0.8)" }}>
              {step.title}
            </h1>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "clamp(0.65rem, 1.1vw, 0.85rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: orange, margin: "0 0 0.25rem", textShadow: "0 1px 4px oklch(97% 0.005 80 / 0.6)" }}>
              {t.stepEyebrow}{completed ? ` · ${t.completed}` : ""}
            </p>
            {step.chapter_title && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "clamp(0.65rem, 1.1vw, 0.85rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: orange, opacity: 0.85, margin: 0, textShadow: "0 1px 4px oklch(97% 0.005 80 / 0.6)" }}>
                {step.chapter_title}
              </p>
            )}
          </div>
          {step.core_idea && (
            <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", width: "calc(100% - clamp(2rem, 10vw, 6rem))", maxWidth: "560px", background: "oklch(97% 0.005 80 / 0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderTop: `2px solid ${orange}`, padding: "1.125rem 1.5rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)", color: navy, lineHeight: 1.55, margin: 0, textAlign: "center" }}>
                {step.core_idea.replace(/^[""]|[""]$/g, "")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "2.5rem clamp(1rem, 4vw, 2rem) clamp(2rem, 5vw, 3rem)" }}>
        {contentElements && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2.5rem" }}>
            {contentElements}
          </div>
        )}

        {step.implementation_challenge && (
          <div style={{ background: band, borderTop: `2px solid ${orange}`, padding: "1.75rem clamp(1.25rem, 4vw, 2rem)", marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "0 0 0.875rem" }}>
              {t.challenge}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "1rem", color: navy, lineHeight: 1.7, margin: 0 }}>
              {step.implementation_challenge}
            </p>
          </div>
        )}

        {/* Complete / journal action */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {completed ? (
            <>
              <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: "white", background: green, padding: "0.85rem 1.5rem" }}>
                {t.completed}
              </span>
              <button onClick={openJournal} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", color: navy, background: "transparent", border: `1px solid ${navy}`, padding: "0.85rem 1.5rem", cursor: "pointer" }}>
                {t.openJournal}
              </button>
            </>
          ) : (
            <button onClick={handleComplete} disabled={completing} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.95rem", color: offWhite, background: navy, border: "none", padding: "0.95rem 1.75rem", cursor: completing ? "wait" : "pointer", opacity: completing ? 0.7 : 1 }}>
              {completing ? t.completing : t.complete}
            </button>
          )}
          {completeError && (
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.18 25)" }}>{t.error}</span>
          )}
        </div>

        {/* Prev / next */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${rule}`, paddingTop: "1.25rem" }}>
          {stepNumber > 1 ? <Link href={`/journey/step/${stepNumber - 1}`} style={linkBtn}>{t.prev}</Link> : <span />}
          {stepNumber < 60 ? <Link href={`/journey/step/${stepNumber + 1}`} style={linkBtn}>{t.next}</Link> : <span />}
        </div>
      </div>

      {/* Journal popup */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="journal-title"
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "oklch(25% 0.06 260 / 0.45)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(0.75rem, 4vh, 3rem) 1rem", overflowY: "auto" }}
        >
          <div style={{ background: offWhite, borderTop: `2px solid ${orange}`, width: "100%", maxWidth: "620px", padding: "clamp(1.25rem, 4vw, 2rem)", boxShadow: "0 24px 60px oklch(25% 0.06 260 / 0.2)" }}>
            {completed && (
              <p style={{ display: "inline-block", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", color: "oklch(40% 0.12 150)", background: "oklch(95% 0.04 150)", border: "1px solid oklch(85% 0.07 150)", borderRadius: "999px", padding: "0.25rem 0.7rem", margin: "0 0 1rem" }}>
                ✓ {t.doneMsg}
              </p>
            )}
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "0 0 0.35rem" }}>
              {t.journalEyebrow} · {t.stepEyebrow}
            </p>
            <h2 id="journal-title" style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.6rem, 4vw, 2rem)", color: navy, margin: "0 0 0.35rem", lineHeight: 1.15 }}>
              {t.journalTitle}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: mid, lineHeight: 1.6, margin: "0 0 1.5rem" }}>
              {t.journalHint}
            </p>

            {step.q1 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 600, color: navy, marginBottom: "0.5rem", lineHeight: 1.5 }}>
                  1. {step.q1}
                  <textarea value={answer1} onChange={e => setAnswer1(e.target.value)} placeholder={t.placeholder} rows={3} style={{ ...textareaStyle, marginTop: "0.5rem", fontWeight: 400 }} />
                </label>
              </div>
            )}
            {step.q2 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 600, color: navy, marginBottom: "0.5rem", lineHeight: 1.5 }}>
                  2. {step.q2}
                  <textarea value={answer2} onChange={e => setAnswer2(e.target.value)} placeholder={t.placeholder} rows={3} style={{ ...textareaStyle, marginTop: "0.5rem", fontWeight: 400 }} />
                </label>
              </div>
            )}

            {(aiLoading || aiQuestion) && (
              <div style={{ background: band, borderTop: `2px solid ${orange}`, padding: "1rem", marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: orangeDeep, margin: "0 0 0.4rem" }}>
                  {t.coachLabel}
                </p>
                {aiLoading && !aiQuestion ? (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", fontStyle: "italic", color: mid, margin: 0 }}>{t.thinking}</p>
                ) : (
                  <label style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 600, color: navy, lineHeight: 1.5 }}>
                    {aiQuestion}
                    <textarea value={aiAnswer} onChange={e => setAiAnswer(e.target.value)} placeholder={t.placeholder} rows={3} style={{ ...textareaStyle, marginTop: "0.6rem", fontWeight: 400, background: "white" }} />
                  </label>
                )}
              </div>
            )}

            {saveState === "error" && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.18 25)", margin: "0 0 0.75rem" }}>{t.error}</p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <button onClick={handleSave} disabled={saveState === "saving"} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: navy, border: "none", padding: "0.8rem 1.5rem", cursor: "pointer", opacity: saveState === "saving" ? 0.7 : 1 }}>
                {saveState === "saving" ? t.saving : t.save}
              </button>
              <button onClick={handleSkip} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.85rem", color: mid, background: "none", border: "none", padding: "0.8rem 0.5rem", cursor: "pointer", textDecoration: "underline" }}>
                {t.skip}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
