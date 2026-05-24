"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { switchCoach } from "./actions";
import SessionNotebook from "./SessionNotebook";
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
const RING_R = 65;
const RING_C = 2 * Math.PI * RING_R;
const MINI_R = 22;
const MINI_C = 2 * Math.PI * MINI_R;

// ── Types ────────────────────────────────────────────────────────
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
      overflow: "hidden",
    }}>
      <button
        onClick={onSwitchOpen}
        style={{
          width: "120px", height: "120px", borderRadius: "50%",
          overflow: "hidden", border: "3px solid oklch(38% 0.10 260)",
          cursor: "pointer", padding: 0, background: "none", flexShrink: 0,
        }}
        aria-label="Switch coach"
      >
        <Image src={coachImage} alt={coachName} width={120} height={120}
          style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      </button>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.25rem" }}>
          Your AI Coach
        </p>
        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.25rem", fontStyle: "italic", color: WHITE, lineHeight: 1.1 }}>
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

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem", gap: "1.75rem",
      overflowY: "auto",
    }}>
      {/* Ring */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={RING_R * 2 + 20} height={RING_R * 2 + 20} viewBox={`0 0 ${RING_R * 2 + 20} ${RING_R * 2 + 20}`}>
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
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontStyle: "italic", color: WHITE, lineHeight: 1 }}>
            {trialExhausted ? "0" : trialRemainingMinutes}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>
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
      padding: "1.5rem",
      overflow: "hidden",
    }}>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "1rem", flexShrink: 0 }}>
        Session Notes
      </p>
      {sessions.length === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: MUTED, textAlign: "center", lineHeight: 1.7, maxWidth: "260px" }}>
            Your session notes will appear here after your first coaching session.
          </p>
        </div>
      ) : (
        <div style={{ flex: 1, overflow: "auto" }}>
          <SessionNotebook sessions={sessions} />
        </div>
      )}
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
      padding: "1.5rem",
      overflow: "hidden",
    }}>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "1.25rem", flexShrink: 0 }}>
        About You
      </p>
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
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

  // Snap to Coach panel on mount (DOM index 3)
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

      // Update active dot indicator
      if (domIdx >= DOM_BG && domIdx <= DOM_MINUTES) {
        setActivePanel(domIdx - 1);
      }

      // Circular teleport: clone → real
      if (domIdx === DOM_CLONE_BEFORE) {
        teleportRef.current = true;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = DOM_MINUTES * w;
        setActivePanel(PANEL_MINUTES);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.scrollBehavior = "";
            teleportRef.current = false;
          });
        });
      } else if (domIdx === DOM_CLONE_AFTER) {
        teleportRef.current = true;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = DOM_BG * w;
        setActivePanel(PANEL_BG);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.scrollBehavior = "";
            teleportRef.current = false;
          });
        });
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
          padding: 0.75rem 1.25rem;
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

        {/* Header */}
        <div className="wpc-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/waypoint/waypoint-banner-blue.png" alt="WayPoint" style={{ height: "40px", width: "auto" }} />
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
            {/* DOM 0: Clone of Minutes (wrap from BG going left) */}
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
            {/* DOM 5: Clone of Background (wrap from Minutes going right) */}
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
              width: "110px", height: "110px", borderRadius: "50%",
              overflow: "hidden", border: "3px solid oklch(38% 0.10 260)",
              cursor: "pointer", padding: 0, background: "none", flexShrink: 0,
            }} aria-label="Switch coach">
              <Image src={coachImage} alt={coachName} width={110} height={110}
                style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </button>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.25rem" }}>
                Your AI Coach
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.25rem", fontStyle: "italic", color: WHITE, lineHeight: 1.1 }}>
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
              {/* Mini ring */}
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
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "1rem" }}>
                Session Notes
              </p>
              {sessions.length === 0 ? (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: MUTED, lineHeight: 1.7 }}>
                  Your session notes will appear here after your first coaching session.
                </p>
              ) : (
                <SessionNotebook sessions={sessions} />
              )}
            </div>
          </div>
        </div>

        {/* ── Coach switcher bottom sheet ── */}
        {showSwitcher && (
          <>
            <div onClick={() => setShowSwitcher(false)} style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 50,
            }} />
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: "oklch(17% 0.09 260)",
              padding: "1.75rem 1.5rem 2.5rem",
              zIndex: 51,
              borderRadius: "12px 12px 0 0",
            }}>
              <div style={{ width: "40px", height: "4px", background: "oklch(32% 0.07 260)", borderRadius: "2px", margin: "0 auto 1.5rem" }} />
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "1rem" }}>
                Choose Your Coach
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                {COACHES.map(c => (
                  <button key={c.name} onClick={() => handleCoachSwitch(c)} disabled={switching} style={{
                    flex: 1, padding: "1.25rem 1rem",
                    background: c.name === coachName ? "oklch(25% 0.10 260)" : NAVY_SUBTLE,
                    border: `2px solid ${c.name === coachName ? ORANGE : "oklch(28% 0.07 260)"}`,
                    cursor: switching ? "wait" : "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
                  }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${c.name === coachName ? ORANGE : "transparent"}` }}>
                      <Image src={c.image} alt={c.name} width={72} height={72} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontStyle: "italic", color: WHITE }}>
                        {c.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", color: MUTED, lineHeight: 1.4 }}>
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
