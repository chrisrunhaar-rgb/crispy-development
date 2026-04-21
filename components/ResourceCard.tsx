"use client";

import { useState } from "react";
import Link from "next/link";
import { removeResourceFromDashboard, saveResourceNote, saveResourceRating, markResourceRead } from "@/app/(marketing)/resources/actions";

export default function ResourceCard({
  slug,
  title,
  format,
  time,
  path,
  initialNote = "",
  initialRating = 0,
  initialRead = false,
}: {
  slug: string;
  title: string;
  format: string;
  time: string;
  path: string;
  initialNote?: string;
  initialRating?: number;
  initialRead?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState(initialNote);
  const [rating, setRating] = useState(initialRating);
  const [isRead, setIsRead] = useState(initialRead);
  const [noteSaved, setNoteSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Progress: 100% when content is read/completed
  const progressPct = isRead ? 100 : 0;

  async function handleMarkRead() {
    setIsRead(true);
    await markResourceRead(slug);
  }

  async function handleNoteBlur() {
    await saveResourceNote(slug, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
  }

  async function handleRating(stars: number) {
    setRating(stars);
    await saveResourceRating(slug, stars);
  }

  async function handleShare() {
    const url = `https://crispyleaders.com/resources/${slug}`;
    const text = `I'm part of a leadership development journey with Crispy Development. This resource is worth your time: "${title}"`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled — do nothing
      }
    } else {
      await navigator.clipboard.writeText(`${text} → ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  return (
    <div style={{ borderTop: "1px solid oklch(88% 0.008 80)" }}>
      {/* Header row — click to expand */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingBlock: "1.125rem", cursor: "pointer" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", color: "oklch(22% 0.005 260)", marginBottom: "0.2rem" }}>
            {title}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(58% 0.008 260)" }}>
            {format} · {time}
          </p>
        </div>
        <Link
          href={path}
          onClick={e => e.stopPropagation()}
          style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "oklch(30% 0.12 260)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
        >
          Read →
        </Link>
        <form action={removeResourceFromDashboard.bind(null, slug)} onClick={e => e.stopPropagation()}>
          <button type="submit" title="Remove" style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: "oklch(70% 0.008 260)", fontSize: "0.8rem", lineHeight: 1, flexShrink: 0 }}>
            ×
          </button>
        </form>
        <span style={{ color: "oklch(68% 0.008 260)", fontSize: "0.6rem", flexShrink: 0, transition: "transform 0.15s", transform: expanded ? "rotate(180deg)" : "none" }}>▼</span>
      </div>

      {/* Green progress bar */}
      <div style={{ height: "3px", background: "oklch(92% 0.005 80)", marginBottom: expanded ? "0" : "0" }}>
        <div style={{
          height: "100%",
          width: `${progressPct}%`,
          background: "oklch(55% 0.15 145)",
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Expandable detail section */}
      {expanded && (
        <div style={{ paddingBlock: "1.25rem", paddingLeft: "0", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Mark as read */}
          <div>
            {isRead ? (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(55% 0.15 145)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                ✓ Marked as read
              </p>
            ) : (
              <button
                type="button"
                onClick={handleMarkRead}
                style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  border: "1px solid oklch(55% 0.15 145 / 0.4)", background: "transparent",
                  color: "oklch(42% 0.14 145)", padding: "0.4rem 0.875rem", cursor: "pointer",
                }}
              >
                Mark as read ✓
              </button>
            )}
          </div>

          {/* Notes */}
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.5rem" }}>
              My Notes
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              onBlur={handleNoteBlur}
              placeholder="Jot down key takeaways, reflections, or action steps..."
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box",
                fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", lineHeight: 1.6,
                color: "oklch(28% 0.008 260)", background: "oklch(97% 0.003 80)",
                border: "1px solid oklch(88% 0.008 80)", padding: "0.75rem",
                resize: "vertical", outline: "none",
              }}
            />
            {noteSaved && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(55% 0.15 145)", marginTop: "0.25rem" }}>
                Saved ✓
              </p>
            )}
          </div>

          {/* Impact rating */}
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.5rem" }}>
              Impact Rating
            </p>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleRating(s)}
                  title={`${s} star${s !== 1 ? "s" : ""}`}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: "0.125rem",
                    fontSize: "1.25rem", lineHeight: 1,
                    color: s <= rating ? "oklch(65% 0.15 45)" : "oklch(82% 0.008 80)",
                    transition: "color 0.1s",
                  }}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(52% 0.008 260)", alignSelf: "center", marginLeft: "0.375rem" }}>
                  {["", "Not helpful", "Somewhat useful", "Good", "Very impactful", "Life-changing"][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Share */}
          <div>
            <button
              type="button"
              onClick={handleShare}
              style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                border: "1px solid oklch(88% 0.008 80)", background: "transparent",
                color: copied ? "oklch(55% 0.15 145)" : "oklch(52% 0.008 260)",
                padding: "0.4rem 0.875rem", cursor: "pointer", transition: "color 0.2s",
              }}
            >
              {copied ? "Copied to clipboard ✓" : "Share with a friend"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
