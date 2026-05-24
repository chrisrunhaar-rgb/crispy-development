"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { switchCoach } from "./actions";
import SessionTypeSelector from "./SessionTypeSelector";
import type { NotebookSession } from "./SessionNotebook";

// ── Panel index constants (real panels) ─────────────────────────
const PANEL_BG = 0;
const PANEL_NOTES = 1;
const PANEL_COACH = 2;
const PANEL_MINUTES = 3;

// DOM order: [Clone-Min | BG | Notes | Coach | Minutes | Clone-BG]
const DOM_CLONE_BEFORE = 0;
const DOM_BG = 1;
const DOM_NOTES = 2;
const DOM_COACH = 3;
const DOM_MINUTES = 4;
const DOM_CLONE_AFTER = 5;

// ── Colors ───────────────────────────────────────────────────────
const NAVY = "oklch(14% 0.08 260)";
const NAVY_CARD = "oklch(18% 0.09 260)";
const NAVY_SUBTLE = "oklch(22% 0.08 260)";
const ORANGE = "oklch(65% 0.15 45)";
const MUTED = "oklch(55% 0.008 260)";
const LIGHT = "oklch(78% 0.008 260)";
const WHITE = "oklch(97% 0.005 80)";

// ── Coach + package data ─────────────────────────────────────────
const COACHES = [
  { name: "Tara", image: "/images/coaches/tara-portrait.jpg", descriptor: "Warm · Reflective · Clarity-focused" },
  { name: "Ethan", image: "/images/coaches/ethan-portrait.jpg", descriptor: "Direct · Strategic · Action-oriented" },
];

const ADDONS = [
  { label: "Starter Pack", minutes: 60, price: "$49" },
  { label: "Growth Pack", minutes: 120, price: "$99" },
  { label: "Deep Work Pack", minutes: 300, price: "$179" },
];

// ── SVG ring constants ───────────────────────────────────────────
const RING_R = 85;
const RING_C = 2 * Math.PI * RING_R;
const MINI_R = 22;
const MINI_C = 2 * Math.PI * MINI_R;

// ── Types ────────────────────────────────────────────────────────
type WB = {
  focus_today?: string | null;
  key_insights?: string[] | null;
  values_named?: string[] | null;
  action_steps?: string[] | null;
  carrying_forward?: string | null;
} | null;

type ProfileData = {
  name?: string | null;
  role?: string | null;
  organisation?: string | null;
  location?: string | null;
  home_culture?: string | null;
  host_culture?: string | null;
  months_in_context?: number | null;
  notes?: string | null;
};

export type CoachCarouselProps = {
  coachName: string;
  coachImage: string;
  sessionCount: number;
  trialExhausted: boolean;
  trialRemainingMinutes: number;
  trialUsedMinutes: number;
  grantedMinutes: number;
  trialPct: number;
  sessions: NotebookSession[];
  profile: ProfileData;
};

// ── Helpers ──────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function fmtDur(secs: number | null) {
  if (!secs) return null;
  return `${Math.round(secs / 60)} min`;
}

// ── Accordion notes (all sessions visible at a glance) ───────────
function AccordionNotes({ sessions }: { sessions: NotebookSession[] }) {
  const [openIdx, setOpenIdx] = useState(0);

  if (sessions.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "2rem" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: MUTED, textAlign: "center", lineHeight: 1.7, maxWidth: "260px" }}>
          Your session notes will appear here after your first coaching session.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {sessions.map((s, i) => {
        const wb: WB = Array.isArray(s.wp_whiteboards) ? (s.wp_whiteboards[0] ?? null) : s.wp_whiteboards;
        const isOpen = openIdx === i;
        const dur = fmtDur(s.duration_seconds);
        const sessionNum = s.session_number ?? sessions.length - i;

        return (
          <div key={s.id}>
            {/* Header row */}
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.875rem 1rem",
                background: isOpen ? NAVY_CARD : NAVY_SUBTLE,
                border: `1px solid ${isOpen ? "oklch(30% 0.08 260)" : "oklch(26% 0.07 260)"}`,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
              }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: isOpen ? ORANGE : LIGHT, marginBottom: "0.15rem" }}>
                  Session {sessionNum}{dur ? ` · ${dur}` : ""}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: MUTED }}>
                  {formatDate(s.started_at)}
                </p>
              </div>
              <span style={{ color: MUTED, fontSize: "0.7rem", marginLeft: "0.75rem", flexShrink: 0 }}>
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {/* Expanded content */}
            {isOpen && wb && (
              <div style={{ background: "oklch(16% 0.085 260)", padding: "1rem 1.125rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {wb.focus_today && (
                  <NoteSection label="Focus">
                    <p style={noteText}>{wb.focus_today}</p>
                  </NoteSection>
                )}
                {(wb.key_insights?.length ?? 0) > 0 && (
                  <NoteSection label="Key insights">
                    {wb.key_insights!.map((ins, j) => <p key={j} style={noteText}>• {ins}</p>)}
                  </NoteSection>
                )}
                {(wb.values_named?.length ?? 0) > 0 && (
                  <NoteSection label="Values">
                    {wb.values_named!.map((v, j) => <p key={j} style={noteText}>• {v}</p>)}
                  </NoteSection>
                )}
                {(wb.action_steps?.length ?? 0) > 0 && (
                  <NoteSection label="Actions">
                    {wb.action_steps!.map((step, j) => <p key={j} style={noteText}>{j + 1}. {step}</p>)}
                  </NoteSection>
                )}
                {wb.carrying_forward && (
                  <NoteSection label="Carrying forward">
                    <p style={{ ...noteText, fontStyle: "italic" }}>&ldquo;{wb.carrying_forward}&rdquo;</p>
                  </NoteSection>
                )}
                <Link href={`/coach/session/${s.id}`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 600, color: ORANGE, textDecoration: "none", letterSpacing: "0.04em", marginTop: "0.25rem" }}>
                  View full session →
                </Link>
              </div>
            )}
            {isOpen && !wb && (
              <div style={{ background: "oklch(16% 0.085 260)", padding: "1rem 1.125rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: MUTED, fontStyle: "italic" }}>No notes from this session.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const noteText: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.78rem",
  color: LIGHT,
  lineHeight: 1.65,
  margin: 0,
};

function NoteSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(58% 0.12 150)", marginBottom: "0.3rem" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ── Panel: Coach ─────────────────────────────────────────────────
function CoachPanel({
  coachName, coachImage, sessionCount,
  trialExhausted, trialRemainingMinutes,
  onSwitchOpen,
}: {
  coachName: string; coachImage: string; sessionCount: number;
  trialExhausted: boolean; trialRemainingMinutes: number;
  onSwitchOpen: () => void;
}) {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem", gap: "1.25rem",
      overflowY: "auto",
    }}>
      <button
        onClick={onSwitchOpen}
        style={{
          width: "160px", height: "160px", borderRadius: "50%",
          overflow: "hidden", border: "3px solid oklch(38% 0.10 260)",
          cursor: "pointer", padding: 0, background: "none", flexShrink: 0,
        }}
        aria-label="Switch coach"
      >
        <Image src={coachImage} alt={coachName} width={160} height={160}
          style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      </button>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.25rem" }}>
          Your AI Coach
        </p>
        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontStyle: "italic", color: WHITE, lineHeight: 1.1 }}>
          {coachName}
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: MUTED, marginTop: "0.25rem", lineHeight: 1.5 }}>
          {sessionCount === 0
            ? "Ready for your first session"
            : `Session ${sessionCount + 1} ready — ${coachName} remembers your sessions`}
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "340px" }}>
        <SessionTypeSelector trialExhausted={trialExhausted} trialRemainingMinutes={trialRemainingMinutes} />
      </div>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <button onClick={onSwitchOpen} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>
          Change coach
        </button>
        <Link href="/coach/setup" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, textDecoration: "none", letterSpacing: "0.06em" }}>
          Settings
        </Link>
      </div>
    </div>
  );
}

// ── Panel: Minutes ───────────────────────────────────────────────
function MinutesPanel({
  trialPct, trialExhausted, trialRemainingMinutes, trialUsedMinutes, grantedMinutes,
}: {
  trialPct: number; trialExhausted: boolean; trialRemainingMinutes: number;
  trialUsedMinutes: number; grantedMinutes: number;
}) {
  const used = RING_C * (trialPct / 100);
  const ringColor = trialExhausted ? "oklch(55% 0.15 30)" : ORANGE;
  const size = RING_R * 2 + 20;

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem", gap: "1.5rem",
      overflowY: "auto",
    }}>
      {/* Ring */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={RING_R + 10} cy={RING_R + 10} r={RING_R} fill="none" stroke="oklch(28% 0.07 260)" strokeWidth="10" />
          <circle
            cx={RING_R + 10} cy={RING_R + 10} r={RING_R}
            fill="none" stroke={ringColor} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C - used}
            transform={`rotate(-90 ${RING_R + 10} ${RING_R + 10})`}
          />
        </svg>
        <div style={{ position: "absolute", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "4rem", fontStyle: "italic", color: WHITE, lineHeight: 1 }}>
            {trialExhausted ? "0" : trialRemainingMinutes}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED }}>
            min left
          </p>
        </div>
      </div>

      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: MUTED, textAlign: "center" }}>
        {trialUsedMinutes} of {grantedMinutes} minutes used
      </p>

      {/* Add-on packages */}
      <div style={{ width: "100%", maxWidth: "340px" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.875rem", textAlign: "center" }}>
          Add Coaching Time
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {ADDONS.map(pkg => (
            <div key={pkg.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.875rem 1rem",
              background: NAVY_SUBTLE,
              border: "1px solid oklch(28% 0.07 260)",
            }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: LIGHT, marginBottom: "0.15rem" }}>
                  {pkg.label}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED }}>
                  {pkg.minutes} minutes
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontStyle: "italic", color: WHITE }}>
                  {pkg.price}
                </span>
                <button disabled style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.06em",
                  padding: "0.4rem 0.75rem", background: "oklch(28% 0.06 260)", color: MUTED, border: "none", cursor: "not-allowed",
                }}>
                  Soon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Panel: Notes ─────────────────────────────────────────────────
function NotesPanel({ sessions }: { sessions: NotebookSession[] }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE }}>
          Session Notes
        </p>
        {sessions.length > 0 && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, marginTop: "0.2rem" }}>
            {sessions.length} session{sessions.length > 1 ? "s" : ""} — tap to expand
          </p>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1.25rem 1.25rem" }}>
        <AccordionNotes sessions={sessions} />
      </div>
    </div>
  );
}

// ── Panel: Background ────────────────────────────────────────────
function BgPanel({ profile }: { profile: ProfileData }) {
  const fields = [
    { label: "Name", value: profile.name },
    { label: "Role", value: profile.role },
    { label: "Organisation", value: profile.organisation },
    { label: "Location", value: profile.location },
    { label: "Home culture", value: profile.home_culture },
    { label: "Host culture", value: profile.host_culture },
    { label: "Months in context", value: profile.months_in_context != null ? String(profile.months_in_context) : null },
    { label: "Notes", value: profile.notes },
  ].filter(f => f.value);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE }}>
          About You
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {fields.length === 0 ? (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: MUTED, lineHeight: 1.7 }}>
            No background info yet.
          </p>
        ) : (
          fields.map(f => (
            <div key={f.label} style={{ paddingBottom: "0.75rem", borderBottom: "1px solid oklch(24% 0.07 260)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: "0.25rem" }}>
                {f.label}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: LIGHT, lineHeight: 1.5 }}>
                {f.value}
              </p>
            </div>
          ))
        )}
        <Link href="/coach/setup" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: ORANGE, textDecoration: "none", letterSpacing: "0.04em", marginTop: "0.25rem" }}>
          Edit background info →
        </Link>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function CoachCarousel({
  coachName: initialCoachName,
  coachImage: initialCoachImage,
  sessionCount,
  trialExhausted,
  trialRemainingMinutes,
  trialUsedMinutes,
  grantedMinutes,
  trialPct,
  sessions,
  profile,
}: CoachCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(PANEL_COACH);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [coachName, setCoachName] = useState(initialCoachName);
  const [coachImage, setCoachImage] = useState(initialCoachImage);
  const [switching, setSwitching] = useState(false);
  const teleportRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = DOM_COACH * el.clientWidth;
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || teleportRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const w = el.clientWidth;
      const domIdx = Math.round(el.scrollLeft / w);

      if (domIdx >= DOM_BG && domIdx <= DOM_MINUTES) {
        setActivePanel(domIdx - 1);
      }

      if (domIdx === DOM_CLONE_BEFORE) {
        teleportRef.current = true;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = DOM_MINUTES * w;
        setActivePanel(PANEL_MINUTES);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.style.scrollBehavior = "";
          teleportRef.current = false;
        }));
      } else if (domIdx === DOM_CLONE_AFTER) {
        teleportRef.current = true;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = DOM_BG * w;
        setActivePanel(PANEL_BG);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.style.scrollBehavior = "";
          teleportRef.current = false;
        }));
      }
    }, 60);
  }, []);

  async function handleCoachSwitch(c: typeof COACHES[0]) {
    if (c.name === coachName) { setShowSwitcher(false); return; }
    setSwitching(true);
    setCoachName(c.name);
    setCoachImage(c.image);
    setShowSwitcher(false);
    try { await switchCoach(c.name); } finally { setSwitching(false); }
  }

  const minutesProps = { trialPct, trialExhausted, trialRemainingMinutes, trialUsedMinutes, grantedMinutes };
  const ringColor = trialExhausted ? "oklch(55% 0.15 30)" : ORANGE;
  const miniUsed = MINI_C * (trialPct / 100);

  return (
    <>
      <style>{`
        .wpc-outer {
          background: ${NAVY};
          height: calc(100dvh - 80px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .wpc-header {
          background: oklch(16% 0.09 260);
          flex-shrink: 0;
          padding: 0.875rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid oklch(22% 0.08 260);
        }
        .wpc-mobile {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        .wpc-scroll {
          display: flex;
          width: 100%;
          height: 100%;
          overflow-x: scroll;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .wpc-scroll::-webkit-scrollbar { display: none; }
        .wpc-panel {
          flex-shrink: 0;
          width: 100%;
          height: 100%;
          scroll-snap-align: start;
          overflow: hidden;
        }
        .wpc-dots {
          position: absolute;
          bottom: 1.125rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          align-items: center;
          z-index: 10;
          pointer-events: none;
        }
        .wpc-desktop { display: none; }
        @media (min-width: 1024px) {
          .wpc-mobile { display: none; }
          .wpc-desktop {
            flex: 1;
            display: flex;
            overflow: hidden;
          }
          .wpc-desktop-left {
            width: 380px;
            flex-shrink: 0;
            background: oklch(16% 0.09 260);
            border-right: 1px solid oklch(22% 0.08 260);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2.5rem 2rem;
            gap: 1.5rem;
            overflow-y: auto;
          }
          .wpc-desktop-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .wpc-minutes-bar {
            background: ${NAVY_CARD};
            border-bottom: 1px solid oklch(22% 0.08 260);
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            flex-shrink: 0;
            flex-wrap: wrap;
          }
          .wpc-notes-area {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem 2rem;
          }
        }
      `}</style>

      <div className="wpc-outer">

        {/* Header — transparent logo, larger */}
        <div className="wpc-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/waypoint/waypoint-banner-transp.png" alt="WayPoint" style={{ height: "52px", width: "auto" }} />
            <span style={{ background: ORANGE, color: "white", fontFamily: "var(--font-montserrat)", fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.1em", padding: "0.1rem 0.4rem" }}>
              BETA
            </span>
          </div>
          <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.05em", color: MUTED, textDecoration: "none" }}>
            ← Crispy Leaders
          </Link>
        </div>

        {/* ── Mobile carousel ── */}
        <div className="wpc-mobile">
          <div ref={scrollRef} className="wpc-scroll" onScroll={handleScroll}>
            {/* DOM 0: Clone of Minutes */}
            <div className="wpc-panel"><MinutesPanel {...minutesProps} /></div>
            {/* DOM 1: Background */}
            <div className="wpc-panel"><BgPanel profile={profile} /></div>
            {/* DOM 2: Notes */}
            <div className="wpc-panel"><NotesPanel sessions={sessions} /></div>
            {/* DOM 3: Coach — default */}
            <div className="wpc-panel">
              <CoachPanel
                coachName={coachName} coachImage={coachImage}
                sessionCount={sessionCount}
                trialExhausted={trialExhausted} trialRemainingMinutes={trialRemainingMinutes}
                onSwitchOpen={() => setShowSwitcher(true)}
              />
            </div>
            {/* DOM 4: Minutes */}
            <div className="wpc-panel"><MinutesPanel {...minutesProps} /></div>
            {/* DOM 5: Clone of Background */}
            <div className="wpc-panel"><BgPanel profile={profile} /></div>
          </div>

          {/* Nav dots */}
          <div className="wpc-dots">
            {[PANEL_BG, PANEL_NOTES, PANEL_COACH, PANEL_MINUTES].map(i => (
              <div key={i} style={{
                height: "6px",
                width: i === activePanel ? "20px" : "6px",
                borderRadius: "3px",
                background: i === activePanel ? ORANGE : "oklch(38% 0.07 260)",
                transition: "width 0.25s ease, background 0.25s ease",
              }} />
            ))}
          </div>
        </div>

        {/* ── Desktop 2-column ── */}
        <div className="wpc-desktop">

          {/* Left: Coach panel */}
          <div className="wpc-desktop-left">
            <button onClick={() => setShowSwitcher(true)} style={{
              width: "140px", height: "140px", borderRadius: "50%",
              overflow: "hidden", border: "3px solid oklch(38% 0.10 260)",
              cursor: "pointer", padding: 0, background: "none", flexShrink: 0,
            }} aria-label="Switch coach">
              <Image src={coachImage} alt={coachName} width={140} height={140}
                style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </button>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.25rem" }}>
                Your AI Coach
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontStyle: "italic", color: WHITE, lineHeight: 1.1 }}>
                {coachName}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: MUTED, marginTop: "0.25rem" }}>
                {sessionCount === 0 ? "Ready for your first session" : `Session ${sessionCount + 1} ready`}
              </p>
            </div>

            <div style={{ width: "100%" }}>
              <SessionTypeSelector trialExhausted={trialExhausted} trialRemainingMinutes={trialRemainingMinutes} />
            </div>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              <button onClick={() => setShowSwitcher(true)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>
                Change coach
              </button>
              <Link href="/coach/setup" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, textDecoration: "none", letterSpacing: "0.06em" }}>
                Settings
              </Link>
            </div>
          </div>

          {/* Right: Minutes bar + Notes */}
          <div className="wpc-desktop-right">
            <div className="wpc-minutes-bar">
              <svg width="56" height="56" viewBox="0 0 56 56" style={{ flexShrink: 0 }}>
                <circle cx="28" cy="28" r={MINI_R} fill="none" stroke="oklch(28% 0.07 260)" strokeWidth="6" />
                <circle cx="28" cy="28" r={MINI_R} fill="none"
                  stroke={ringColor} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={MINI_C}
                  strokeDashoffset={MINI_C - miniUsed}
                  transform="rotate(-90 28 28)"
                />
              </svg>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: "0.15rem" }}>
                  Free trial
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, color: trialExhausted ? "oklch(55% 0.15 30)" : WHITE }}>
                  {trialExhausted ? "Trial complete" : `${trialRemainingMinutes} min remaining`}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED }}>
                  {trialUsedMinutes} of {grantedMinutes} min used
                </p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {ADDONS.map(pkg => (
                  <button key={pkg.label} disabled style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.05em",
                    padding: "0.5rem 0.75rem",
                    background: "oklch(24% 0.07 260)", color: MUTED,
                    border: "1px solid oklch(28% 0.07 260)", cursor: "not-allowed",
                    whiteSpace: "nowrap",
                  }}>
                    +{pkg.minutes}m {pkg.price} <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>SOON</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="wpc-notes-area">
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.75rem" }}>
                Session Notes
              </p>
              {sessions.length > 0 && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, marginBottom: "1rem" }}>
                  {sessions.length} session{sessions.length > 1 ? "s" : ""} — tap to expand
                </p>
              )}
              <AccordionNotes sessions={sessions} />
            </div>
          </div>
        </div>

        {/* ── Coach switcher modal (centered) ── */}
        {showSwitcher && (
          <>
            <div onClick={() => setShowSwitcher(false)} style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 50,
            }} />
            <div style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "oklch(17% 0.09 260)",
              padding: "2rem 1.75rem 2rem",
              zIndex: 51,
              borderRadius: "12px",
              width: "min(92vw, 440px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE }}>
                  Choose Your Coach
                </p>
                <button onClick={() => setShowSwitcher(false)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: MUTED, fontSize: "1.25rem", lineHeight: 1, padding: "0.25rem",
                }}>
                  ✕
                </button>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                {COACHES.map(c => (
                  <button key={c.name} onClick={() => handleCoachSwitch(c)} disabled={switching} style={{
                    flex: 1, padding: "1.25rem 1rem",
                    background: c.name === coachName ? "oklch(25% 0.10 260)" : NAVY_SUBTLE,
                    border: `2px solid ${c.name === coachName ? ORANGE : "oklch(28% 0.07 260)"}`,
                    cursor: switching ? "wait" : "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
                    borderRadius: "6px",
                  }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${c.name === coachName ? ORANGE : "oklch(32% 0.08 260)"}` }}>
                      <Image src={c.image} alt={c.name} width={80} height={80} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.75rem", fontStyle: "italic", color: WHITE }}>
                        {c.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: MUTED, lineHeight: 1.4 }}>
                        {c.descriptor}
                      </p>
                    </div>
                    {c.name === coachName && (
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE }}>
                        Current
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
