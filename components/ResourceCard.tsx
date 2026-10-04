"use client";

import { useId, useRef, useState, useTransition, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { removeResourceFromDashboard, saveResourceNote, saveResourceRating, markResourceRead } from "@/app/(marketing)/resources/actions";
import { PresentSmallScreenNotice } from "@/components/PresentLauncher";
import { SLIDESHOW_SLUGS } from "@/lib/slideshow-slugs";

const FORMAT_ID: Record<string, string> = {
  "Guide": "Panduan",
  "Assessment": "Penilaian",
  "Module": "Modul",
  "Workshop": "Workshop",
  "Exercise": "Latihan",
  "Tool": "Alat",
  "Framework": "Kerangka",
  "Article": "Artikel",
  "Worksheet": "Lembar Kerja",
};

// One icon grammar for the whole set: 24 viewBox, stroke 2, round caps/joins,
// rounded-rect geometry taken from the PresentLauncher icon.
function Icon({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}
const ReadIcon = () => <Icon><path d="M3 5h5a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H3z" /><path d="M21 5h-5a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h6z" /></Icon>;
const PresentIcon = () => <Icon><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M12 16v4M8 20h8" /></Icon>;
const ShareIcon = ({ size }: { size?: number }) => <Icon size={size}><path d="M8.5 10H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.5" /><path d="M12 14V3.5M8.5 7 12 3.5 15.5 7" /></Icon>;
const CheckIcon = ({ size }: { size?: number }) => <Icon size={size}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>;

const CSS = `
.rc-card { border: 1px solid oklch(88% 0.008 80); border-radius: 8px; background: oklch(99.5% 0.002 80); overflow: hidden; }
.rc-card + .rc-card { margin-top: 0.75rem; }
.rc-head { padding-inline: 1rem;
  position: relative; display: flex; flex-wrap: wrap; align-items: center; column-gap: 1rem; row-gap: 0.25rem; padding-block: 0.875rem; }
.rc-main { flex: 1 1 13.5rem; min-width: 0; display: flex; flex-direction: column; gap: 0.2rem; text-decoration: none; color: inherit; }
.rc-main::after { content: ""; position: absolute; inset: 0; }
.rc-main:focus-visible { outline: none; }
.rc-main:focus-visible::after { outline: 2px solid oklch(30% 0.12 260); outline-offset: 2px; border-radius: 4px; }
.rc-title { font-family: var(--font-montserrat), Montserrat, sans-serif; font-weight: 600; font-size: 0.9rem; line-height: 1.4; color: oklch(22% 0.005 260); overflow-wrap: anywhere; text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px; text-decoration-thickness: 1px; transition: color 0.2s ease, text-decoration-color 0.2s ease; }
.rc-main:hover .rc-title { color: oklch(30% 0.12 260); text-decoration-color: oklch(30% 0.12 260 / 0.35); }
.rc-meta { font-family: var(--font-montserrat), Montserrat, sans-serif; font-size: 0.775rem; color: oklch(58% 0.008 260); }

.rc-actions { position: relative; z-index: 1; display: flex; align-items: center; margin-left: auto; pointer-events: none; }
.rc-actions > * { pointer-events: auto; }
.rc-act { width: var(--rc-slot); min-height: 52px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 6px 0 5px; border: none; border-radius: 8px; background: transparent; color: oklch(30% 0.12 260); text-decoration: none; cursor: pointer; font: inherit; transition: background-color 0.2s ease, color 0.2s ease, transform 0.12s ease; -webkit-tap-highlight-color: transparent; }
.rc-act:hover { background: oklch(94% 0.014 260); color: oklch(22% 0.10 260); }
.rc-act:active { transform: translateY(1px); }
.rc-act:focus-visible { outline: 2px solid oklch(30% 0.12 260); outline-offset: 0; }
.rc-act-empty { pointer-events: none; cursor: default; }
.rc-act-done { color: oklch(42% 0.14 145); }
.rc-lbl { font-family: var(--font-montserrat), Montserrat, sans-serif; font-size: 0.5625rem; font-weight: 700; letter-spacing: 0.08em; line-height: 1; text-transform: uppercase; color: oklch(45% 0.03 260); white-space: nowrap; }
.rc-act:hover .rc-lbl { color: oklch(30% 0.06 260); }
.rc-act-done .rc-lbl { color: oklch(42% 0.14 145); }

.rc-sep { width: 1px; height: 28px; margin-inline: 4px; background: oklch(88% 0.008 80); }
.rc-chev { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 999px; background: transparent; color: oklch(48% 0.04 260); cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease; -webkit-tap-highlight-color: transparent; }
.rc-chev:hover { background: oklch(94% 0.014 260); color: oklch(22% 0.10 260); }
.rc-chev:focus-visible { outline: 2px solid oklch(30% 0.12 260); outline-offset: 0; }
.rc-chev-rot { display: inline-flex; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.rc-chev[aria-expanded="true"] .rc-chev-rot { transform: rotate(180deg); }

.rc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1); }
.rc-panel[data-open="true"] { grid-template-rows: 1fr; }
.rc-panel-inner { min-height: 0; overflow: hidden; padding-inline: 1rem; }

.rc-btn { min-height: 44px; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0 0.875rem; font-family: var(--font-montserrat), Montserrat, sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: transparent; cursor: pointer; transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease; }
.rc-btn:focus-visible { outline: 2px solid oklch(30% 0.12 260); outline-offset: 2px; }
.rc-btn:disabled { cursor: default; opacity: 0.6; }
.rc-share { border: 1px solid oklch(88% 0.008 80); color: oklch(45% 0.03 260); }
.rc-share:hover { color: oklch(30% 0.12 260); border-color: oklch(30% 0.12 260 / 0.35); }
.rc-share.rc-act-done { color: oklch(42% 0.14 145); }
.rc-remove { border: 1px solid transparent; color: oklch(48% 0.02 260); padding-inline: 0.5rem; text-decoration: underline; text-decoration-color: oklch(48% 0.02 260 / 0.3); text-underline-offset: 3px; }
.rc-remove:hover { color: oklch(46% 0.16 25); text-decoration-color: currentColor; }
.rc-confirm { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 0.75rem; }
.rc-confirm-q { font-family: var(--font-montserrat), Montserrat, sans-serif; font-size: 0.8rem; font-weight: 600; color: oklch(22% 0.005 260); }
.rc-yes { border: 1px solid oklch(46% 0.16 25); background: oklch(46% 0.16 25); color: oklch(99% 0.003 80); }
.rc-yes:hover:not(:disabled) { background: oklch(40% 0.15 25); border-color: oklch(40% 0.15 25); }
.rc-cancel { border: 1px solid oklch(88% 0.008 80); color: oklch(30% 0.12 260); }
.rc-cancel:hover { border-color: oklch(30% 0.12 260 / 0.35); }

.rc-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

@media (prefers-reduced-motion: reduce) {
  .rc-panel, .rc-chev-rot, .rc-act, .rc-title { transition: none; }
  .rc-act:active { transform: none; }
}
`;

export default function ResourceCard({
  slug,
  title,
  format,
  time,
  path,
  initialNote = "",
  initialRating = 0,
  initialRead = false,
  lang = "en",
}: {
  slug: string;
  title: string;
  format: string;
  time: string;
  path: string;
  initialNote?: string;
  initialRating?: number;
  initialRead?: boolean;
  lang?: "en" | "id";
}) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState(initialNote);
  const [rating, setRating] = useState(initialRating);
  const [isRead, setIsRead] = useState(initialRead);
  const [noteSaved, setNoteSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [removing, startRemove] = useTransition();
  const panelId = useId();
  const removeRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const id = lang === "id";
  const hasSlideshow = SLIDESHOW_SLUGS.has(slug);
  const presentHref = `/resources/${slug}/present`;
  // Every tile in a list shares one language, so one slot width keeps the
  // icons aligned in columns down the dashboard. ID labels run longer.
  const slot = id ? "4.25rem" : "3.5rem";

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
        // User cancelled, do nothing
      }
    } else {
      await navigator.clipboard.writeText(`${text} → ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  function openConfirm() {
    setConfirmRemove(true);
    requestAnimationFrame(() => cancelRef.current?.focus());
  }

  function closeConfirm() {
    setConfirmRemove(false);
    requestAnimationFrame(() => removeRef.current?.focus());
  }

  function handleRemove() {
    startRemove(async () => {
      await removeResourceFromDashboard(slug);
    });
  }

  return (
    <div className="rc-card">
      <style href="resource-card" precedence="default">{CSS}</style>

      {/* Green progress bar: sits on the top edge so it reads as part of this card */}
      <div style={{ height: "3px", background: "oklch(92% 0.005 80)" }}>
        <div style={{
          height: "100%",
          width: `${progressPct}%`,
          background: "oklch(55% 0.15 145)",
          transition: "width 0.4s ease",
        }} />
      </div>


      {/* Header: the title link is stretched over the whole row, the actions sit above it */}
      <div className="rc-head" style={{ "--rc-slot": slot } as CSSProperties}>
        <Link href={path} className="rc-main">
          <span className="rc-title">{title}</span>
          <span className="rc-meta">
            {id ? (FORMAT_ID[format] ?? format) : format} · {id ? time.replace(" min", " mnt") : time}
          </span>
        </Link>

        <div className="rc-actions">
          {hasSlideshow ? (
            <Link
              href={presentHref}
              className="rc-act"
              aria-label={id ? `Presentasikan ${title} sebagai slideshow` : `Present ${title} as a slideshow`}
              onClick={e => { if (window.innerWidth < 768) { e.preventDefault(); setSmallScreen(true); } }}
            >
              <PresentIcon />
              <span className="rc-lbl" aria-hidden="true">{id ? "Presentasi" : "Present"}</span>
            </Link>
          ) : (
            <span className="rc-act rc-act-empty" aria-hidden="true" />
          )}

          <Link href={path} className="rc-act" aria-label={id ? `Baca ${title}` : `Read ${title}`}>
            <ReadIcon />
            <span className="rc-lbl" aria-hidden="true">{id ? "Baca" : "Read"}</span>
          </Link>

          <button
            type="button"
            className={`rc-act${copied ? " rc-act-done" : ""}`}
            onClick={handleShare}
            aria-label={id ? `Bagikan ${title}` : `Share ${title}`}
          >
            {copied ? <CheckIcon /> : <ShareIcon />}
            <span className="rc-lbl" aria-hidden="true">{copied ? (id ? "Disalin" : "Copied") : (id ? "Bagikan" : "Share")}</span>
          </button>

          <span className="rc-sep" aria-hidden="true" />

          <button
            type="button"
            className="rc-chev"
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={expanded
              ? (id ? `Sembunyikan detail ${title}` : `Hide details for ${title}`)
              : (id ? `Tampilkan detail ${title}` : `Show details for ${title}`)}
            onClick={() => { setExpanded(v => !v); setConfirmRemove(false); }}
          >
            <span className="rc-chev-rot"><Icon size={22}><path d="M6 9l6 6 6-6" /></Icon></span>
          </button>
        </div>

        <span className="rc-sr" aria-live="polite">{copied ? (id ? "Tautan disalin" : "Link copied") : ""}</span>
      </div>

      {/* Expandable detail section */}
      <div id={panelId} className="rc-panel" data-open={expanded} inert={!expanded}>
        <div className="rc-panel-inner">
          <div style={{ paddingBlock: "1.25rem", borderTop: "1px solid oklch(92% 0.005 80)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Mark as read */}
            <div>
              {isRead ? (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(55% 0.15 145)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  {id ? "✓ Sudah dibaca" : "✓ Marked as read"}
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
                  {id ? "Tandai sudah dibaca ✓" : "Mark as read ✓"}
                </button>
              )}
            </div>

            {/* Notes */}
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.5rem" }}>
                {id ? "Catatan Saya" : "My Notes"}
              </p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                onBlur={handleNoteBlur}
                placeholder={id ? "Catat poin penting, refleksi, atau langkah tindakan..." : "Jot down key takeaways, reflections, or action steps..."}
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
                  {id ? "Tersimpan ✓" : "Saved ✓"}
                </p>
              )}
            </div>

            {/* Impact rating */}
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", marginBottom: "0.5rem" }}>
                {id ? "Penilaian Dampak" : "Impact Rating"}
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
                    {id
                      ? (["", "Tidak membantu", "Cukup berguna", "Bagus", "Sangat berdampak", "Mengubah hidup"][rating])
                      : (["", "Not helpful", "Somewhat useful", "Good", "Very impactful", "Life-changing"][rating])}
                  </span>
                )}
              </div>
            </div>

            {/* Share + remove */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid oklch(92% 0.005 80)" }}>
              <button
                type="button"
                onClick={handleShare}
                className={`rc-btn rc-share${copied ? " rc-act-done" : ""}`}
              >
                {copied ? <CheckIcon size={16} /> : <ShareIcon size={16} />}
                {copied
                  ? (id ? "Disalin ✓" : "Copied to clipboard ✓")
                  : (id ? "Bagikan ke teman" : "Share with a friend")}
              </button>

              {confirmRemove ? (
                <div className="rc-confirm" role="group" aria-label={id ? "Konfirmasi hapus" : "Confirm removal"}>
                  <span className="rc-confirm-q">{id ? "Hapus dari dasbor?" : "Remove from dashboard?"}</span>
                  <button type="button" className="rc-btn rc-yes" onClick={handleRemove} disabled={removing}>
                    {removing ? (id ? "Menghapus..." : "Removing...") : (id ? "Ya, hapus" : "Yes, remove")}
                  </button>
                  <button type="button" ref={cancelRef} className="rc-btn rc-cancel" onClick={closeConfirm} disabled={removing}>
                    {id ? "Batal" : "Cancel"}
                  </button>
                </div>
              ) : (
                <button type="button" ref={removeRef} className="rc-btn rc-remove" onClick={openConfirm}>
                  {id ? "Hapus dari dasbor" : "Remove from dashboard"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {smallScreen && <PresentSmallScreenNotice lang={lang} onClose={() => setSmallScreen(false)} />}
    </div>
  );
}
