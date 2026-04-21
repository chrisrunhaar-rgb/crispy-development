"use client";

import { useState, useRef, useEffect } from "react";
import type { VerseEntry } from "@/lib/verses";

interface Props {
  verse: VerseEntry;
  lang?: "en" | "id" | "nl";
  variant?: "chip" | "tile";
  // chip: small inline orange link → popover
  // tile: full card that flips and dims the page
}

export default function VerseChip({ verse, lang = "en", variant = "chip" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const ref_label = lang === "id" ? verse.refId : verse.ref;
  const body = lang === "id" ? verse.textId : verse.text;

  // Close on outside click (chip/popover mode)
  useEffect(() => {
    if (variant !== "chip" || !open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, variant]);

  // Close on Esc (tile mode)
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (variant === "tile") {
    return (
      <>
        {/* Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "oklch(10% 0.05 260 / 0.72)",
              zIndex: 40,
              backdropFilter: "blur(2px)",
            }}
          />
        )}

        {/* Card */}
        <div
          ref={ref}
          onClick={() => setOpen(o => !o)}
          style={{
            position: "relative",
            zIndex: open ? 50 : "auto",
            cursor: "pointer",
            perspective: "900px",
            minHeight: "120px",
          }}
        >
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: "inherit",
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: open ? "rotateY(180deg)" : "rotateY(0deg)",
          }}>
            {/* Front */}
            <div style={{
              position: open ? "absolute" : "relative",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: "oklch(97% 0.005 80)",
              border: "1px solid oklch(88% 0.008 80)",
              padding: "1rem 1.125rem",
            }}>
              <p style={{ fontWeight: 800, fontSize: "0.8125rem", color: "oklch(65% 0.15 45)", margin: "0 0 0.25rem", fontFamily: "var(--font-montserrat)" }}>
                {ref_label}
              </p>
              <p style={{ fontSize: "0.78rem", color: "oklch(45% 0.008 260)", lineHeight: 1.55, margin: "0 0 0.625rem", fontFamily: "var(--font-montserrat)" }}>
                {lang === "id" ? verse.textId.split("\n")[0].slice(0, 80) + "…" : verse.text.split("\n")[0].slice(0, 80) + "…"}
              </p>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", margin: 0, fontFamily: "var(--font-montserrat)" }}>
                {lang === "id" ? "Ketuk untuk baca →" : "Tap to read →"}
              </p>
            </div>

            {/* Back */}
            <div style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "oklch(22% 0.10 260)",
              border: "1px solid oklch(65% 0.15 45 / 0.4)",
              padding: "1rem 1.125rem",
              overflowY: "auto",
            }}>
              <p style={{ fontWeight: 800, fontSize: "0.75rem", color: "oklch(65% 0.15 45)", margin: "0 0 0.625rem", fontFamily: "var(--font-montserrat)" }}>
                {ref_label}
                {verse.isChapter && (
                  <span style={{ fontWeight: 500, color: "oklch(52% 0.008 260)", marginLeft: "0.5rem", fontSize: "0.65rem" }}>
                    {lang === "id" ? "(ayat kunci)" : "(key verses)"}
                  </span>
                )}
              </p>
              <p style={{ fontSize: "0.8rem", color: "oklch(85% 0.008 80)", lineHeight: 1.75, margin: 0, fontFamily: "var(--font-montserrat)", whiteSpace: "pre-line" }}>
                {body}
              </p>
              <p style={{ fontSize: "0.65rem", marginTop: "0.75rem", color: "oklch(52% 0.008 260)", fontFamily: "var(--font-montserrat)" }}>
                {lang === "id" ? "Ketuk di luar untuk menutup" : "Tap outside to close"}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // chip / inline popover
  return (
    <span ref={ref} style={{ position: "relative", display: "inline" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: 700,
          color: "oklch(65% 0.15 45)",
          background: "none",
          border: "none",
          borderBottom: "1px dotted oklch(65% 0.15 45)",
          cursor: "pointer",
          padding: 0,
          lineHeight: "inherit",
        }}
      >
        {ref_label}
      </button>
      {open && (
        <span style={{
          position: "absolute",
          bottom: "calc(100% + 0.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "oklch(22% 0.10 260)",
          border: "1px solid oklch(65% 0.15 45 / 0.4)",
          padding: "0.875rem 1rem",
          width: "min(320px, 90vw)",
          boxShadow: "0 8px 24px oklch(10% 0.05 260 / 0.4)",
          zIndex: 60,
          display: "block",
        }}>
          <span style={{ display: "block", fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.75rem", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>
            {ref_label}
            {verse.isChapter && (
              <span style={{ fontWeight: 500, color: "oklch(52% 0.008 260)", marginLeft: "0.5rem", fontSize: "0.65rem" }}>
                {lang === "id" ? "(ayat kunci)" : "(key verses)"}
              </span>
            )}
          </span>
          <span style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(85% 0.008 80)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
            {body}
          </span>
        </span>
      )}
    </span>
  );
}
