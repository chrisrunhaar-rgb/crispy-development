"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { switchCoach } from "./actions";
import SessionTypeSelector from "./SessionTypeSelector";
import type { NotebookSession } from "./SessionNotebook";
import { useT, type CoachLang } from "./i18n";

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
  { label: "1 Hour", minutes: 60, idr: "Rp 150,000", usd: "$10", bestValue: false },
  { label: "3 Hours", minutes: 180, idr: "Rp 399,000", usd: "$25", bestValue: false },
  { label: "5 Hours", minutes: 300, idr: "Rp 599,000", usd: "$37", bestValue: true },
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
  currency: "idr" | "usd";
  lang: CoachLang;
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
function AccordionNotes({ sessions, lang }: { sessions: NotebookSession[]; lang: CoachLang }) {
  const s = useT(lang);
  const [openIdx, setOpenIdx] = useState(0);

  if (sessions.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "2rem" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: MUTED, textAlign: "center", lineHeight: 1.7, maxWidth: "260px" }}>
          {s.noNotesEmpty}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {sessions.map((sess, i) => {
        const wb: WB = Array.isArray(sess.wp_whiteboards) ? (sess.wp_whiteboards[0] ?? null) : sess.wp_whiteboards;
        const isOpen = openIdx === i;
        const dur = fmtDur(sess.duration_seconds);
        const sessionNum = sess.session_number ?? sessions.length - i;

        return (
          <div key={sess.id}>
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
                  {lang === "id" ? "Sesi" : "Session"} {sessionNum}{dur ? ` · ${dur}` : ""}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: MUTED }}>
                  {formatDate(sess.started_at)}
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
                  <NoteSection label={s.focus}>
                    <p style={noteText}>{wb.focus_today}</p>
                  </NoteSection>
                )}
                {(wb.key_insights?.length ?? 0) > 0 && (
                  <NoteSection label={s.keyInsights}>
                    {wb.key_insights!.map((ins, j) => <p key={j} style={noteText}>• {ins}</p>)}
                  </NoteSection>
                )}
                {(wb.values_named?.length ?? 0) > 0 && (
                  <NoteSection label={s.values}>
                    {wb.values_named!.map((v, j) => <p key={j} style={noteText}>• {v}</p>)}
                  </NoteSection>
                )}
                {(wb.action_steps?.length ?? 0) > 0 && (
                  <NoteSection label={s.actions}>
                    {wb.action_steps!.map((step, j) => <p key={j} style={noteText}>{j + 1}. {step}</p>)}
                  </NoteSection>
                )}
                {wb.carrying_forward && (
                  <NoteSection label={s.carryingForward}>
                    <p style={{ ...noteText, fontStyle: "italic" }}>&ldquo;{wb.carrying_forward}&rdquo;</p>
                  </NoteSection>
                )}
                <Link href={`/coach/session/${sess.id}`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 600, color: ORANGE, textDecoration: "none", letterSpacing: "0.04em", marginTop: "0.25rem" }}>
                  {s.viewFullSession}
                </Link>
              </div>
            )}
            {isOpen && !wb && (
              <div style={{ background: "oklch(16% 0.085 260)", padding: "1rem 1.125rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: MUTED, fontStyle: "italic" }}>{s.noNotesThisSession}</p>
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
  onSwitchOpen, lang,
}: {
  coachName: string; coachImage: string; sessionCount: number;
  trialExhausted: boolean; trialRemainingMinutes: number;
  onSwitchOpen: () => void; lang: CoachLang;
}) {
  const s = useT(lang);
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem", gap: "1.25rem",
      overflowY: "auto",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
        <button
          onClick={onSwitchOpen}
          style={{
            width: "200px", height: "200px", borderRadius: "50%",
            overflow: "hidden", border: "3px solid oklch(38% 0.10 260)",
            cursor: "pointer", padding: 0, background: "none",
          }}
          aria-label="Switch coach"
        >
          <Image src={coachImage} alt={coachName} width={200} height={200}
            style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </button>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", color: MUTED, letterSpacing: "0.06em" }}>
          {s.tapToChange}
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.25rem" }}>
          {s.yourAiCoach}
        </p>
        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontStyle: "italic", color: WHITE, lineHeight: 1.1 }}>
          {coachName}
        </p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: MUTED, marginTop: "0.25rem", lineHeight: 1.5 }}>
          {sessionCount === 0 ? s.firstSessionReady : s.sessionReady(sessionCount + 1, coachName)}
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "340px" }}>
        <SessionTypeSelector trialExhausted={trialExhausted} trialRemainingMinutes={trialRemainingMinutes} lang={lang} />
      </div>
    </div>
  );
}

// ── Panel: Minutes ───────────────────────────────────────────────
function MinutesPanel({
  trialPct, trialExhausted, trialRemainingMinutes, trialUsedMinutes, grantedMinutes, currency, lang,
}: {
  trialPct: number; trialExhausted: boolean; trialRemainingMinutes: number;
  trialUsedMinutes: number; grantedMinutes: number; currency: "idr" | "usd"; lang: CoachLang;
}) {
  const s = useT(lang);
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
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "5.5rem", fontStyle: "italic", color: WHITE, lineHeight: 1 }}>
            {trialExhausted ? "0" : trialRemainingMinutes}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED }}>
            {s.minLeft}
          </p>
        </div>
      </div>

      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: MUTED, textAlign: "center" }}>
        {grantedMinutes === 0 ? s.noCredit : s.minutesUsed(trialUsedMinutes, grantedMinutes)}
      </p>

      {/* Add-on packages */}
      <div style={{ width: "100%", maxWidth: "340px" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.875rem", textAlign: "center" }}>
          {s.addCoachingTime}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {ADDONS.map(pkg => (
            <div key={pkg.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.875rem 1rem",
              background: pkg.bestValue ? "oklch(20% 0.10 260)" : NAVY_SUBTLE,
              border: `1px solid ${pkg.bestValue ? "oklch(36% 0.12 260)" : "oklch(28% 0.07 260)"}`,
              position: "relative",
            }}>
              {/* Best Value badge */}
              {pkg.bestValue && (
                <span style={{
                  position: "absolute", top: "-1px", right: "0.75rem",
                  background: ORANGE, color: "white",
                  fontFamily: "var(--font-montserrat)", fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.1em",
                  padding: "0.15rem 0.5rem",
                  textTransform: "uppercase",
                }}>
                  {s.bestValue}
                </span>
              )}
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: LIGHT, marginBottom: "0.15rem", marginTop: pkg.bestValue ? "0.4rem" : 0 }}>
                  {lang === "id"
                    ? pkg.minutes === 60 ? "1 Jam" : pkg.minutes === 180 ? "3 Jam" : "5 Jam"
                    : pkg.label}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED }}>
                  {pkg.minutes} {lang === "id" ? "menit" : "minutes"}
                </p>
              </div>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontStyle: "italic", color: WHITE }}>
                {currency === "idr" ? pkg.idr : pkg.usd}
              </p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: MUTED, textAlign: "center", marginTop: "0.25rem" }}>
          {s.purchasesSoon}
        </p>
      </div>
    </div>
  );
}

// ── Panel: Notes ─────────────────────────────────────────────────
function NotesPanel({ sessions, lang }: { sessions: NotebookSession[]; lang: CoachLang }) {
  const s = useT(lang);
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE }}>
          {s.sessionNotes}
        </p>
        {sessions.length > 0 && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, marginTop: "0.2rem" }}>
            {s.sessionCount(sessions.length)}
          </p>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1.25rem 1.25rem" }}>
        <AccordionNotes sessions={sessions} lang={lang} />
      </div>
    </div>
  );
}

// ── Panel: Background ────────────────────────────────────────────
function BgPanel({ profile, lang }: { profile: ProfileData; lang: CoachLang }) {
  const s = useT(lang);
  const fl = lang === "id" ? {
    name: "Nama", role: "Peran", organisation: "Lembaga",
    location: "Lokasi", homeCulture: "Budaya asal", hostCulture: "Budaya setempat",
    monthsInContext: "Bulan di konteks", notes: "Catatan",
  } : {
    name: "Name", role: "Role", organisation: "Organisation",
    location: "Location", homeCulture: "Home culture", hostCulture: "Host culture",
    monthsInContext: "Months in context", notes: "Notes",
  };
  const fields = [
    { label: fl.name, value: profile.name },
    { label: fl.role, value: profile.role },
    { label: fl.organisation, value: profile.organisation },
    { label: fl.location, value: profile.location },
    { label: fl.homeCulture, value: profile.home_culture },
    { label: fl.hostCulture, value: profile.host_culture },
    { label: fl.monthsInContext, value: profile.months_in_context != null ? String(profile.months_in_context) : null },
    { label: fl.notes, value: profile.notes },
  ].filter(f => f.value);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE }}>
          {s.aboutYou}
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {fields.length === 0 ? (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: MUTED, lineHeight: 1.7 }}>
            {s.noBackgroundInfo}
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
          {s.editBackgroundInfo}
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
  currency,
  lang,
}: CoachCarouselProps) {
  const s = useT(lang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(PANEL_COACH);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [coachName, setCoachName] = useState(initialCoachName);
  const [coachImage, setCoachImage] = useState(initialCoachImage);
  const [switching, setSwitching] = useState(false);
  const teleportRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Snap to Coach panel + lock body/main scroll + set navy background on main
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = DOM_COACH * el.clientWidth;

    const main = document.querySelector("main") as HTMLElement | null;
    const prevBg = main?.style.background ?? "";
    const prevOverflow = main?.style.overflow ?? "";
    if (main) {
      main.style.background = NAVY;
      main.style.overflow = "hidden";
    }
    document.documentElement.style.overflow = "hidden";

    return () => {
      if (main) {
        main.style.background = prevBg;
        main.style.overflow = prevOverflow;
      }
      document.documentElement.style.overflow = "";
    };
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

  const [rightTab, setRightTab] = useState<"notes" | "background">("notes");

  const minutesProps = { trialPct, trialExhausted, trialRemainingMinutes, trialUsedMinutes, grantedMinutes, currency, lang };
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
            {s.backToCrispy}
          </Link>
        </div>

        {/* ── Mobile carousel ── */}
        <div className="wpc-mobile">
          <div ref={scrollRef} className="wpc-scroll" onScroll={handleScroll}>
            {/* DOM 0: Clone of Minutes */}
            <div className="wpc-panel"><MinutesPanel {...minutesProps} /></div>
            {/* DOM 1: Background */}
            <div className="wpc-panel"><BgPanel profile={profile} lang={lang} /></div>
            {/* DOM 2: Notes */}
            <div className="wpc-panel"><NotesPanel sessions={sessions} lang={lang} /></div>
            {/* DOM 3: Coach — default */}
            <div className="wpc-panel">
              <CoachPanel
                coachName={coachName} coachImage={coachImage}
                sessionCount={sessionCount}
                trialExhausted={trialExhausted} trialRemainingMinutes={trialRemainingMinutes}
                onSwitchOpen={() => setShowSwitcher(true)} lang={lang}
              />
            </div>
            {/* DOM 4: Minutes */}
            <div className="wpc-panel"><MinutesPanel {...minutesProps} /></div>
            {/* DOM 5: Clone of Background */}
            <div className="wpc-panel"><BgPanel profile={profile} lang={lang} /></div>
          </div>

          {/* Carousel indicator — neighbour labels + dots */}
          {(() => {
            const PANEL_NAMES = s.panelNames;
            const leftLabel = PANEL_NAMES[(activePanel - 1 + 4) % 4];
            const rightLabel = PANEL_NAMES[(activePanel + 1) % 4];
            return (
              <div style={{
                position: "absolute", bottom: "1.125rem", left: "50%",
                transform: "translateX(-50%)",
                display: "flex", alignItems: "center",
                gap: "0.625rem", zIndex: 20, pointerEvents: "none",
                background: "oklch(10% 0.06 260 / 0.7)",
                padding: "0.35rem 0.875rem",
                borderRadius: "100px",
                backdropFilter: "blur(4px)",
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(62% 0.007 260)" }}>
                  ← {leftLabel}
                </span>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {[PANEL_BG, PANEL_NOTES, PANEL_COACH, PANEL_MINUTES].map(i => (
                    <div key={i} style={{
                      height: "6px",
                      width: i === activePanel ? "22px" : "6px",
                      borderRadius: "3px",
                      background: i === activePanel ? ORANGE : "oklch(52% 0.06 260)",
                      transition: "width 0.25s ease, background 0.25s ease",
                    }} />
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(62% 0.007 260)" }}>
                  {rightLabel} →
                </span>
              </div>
            );
          })()}
        </div>

        {/* ── Desktop 2-column ── */}
        <div className="wpc-desktop">

          {/* Left: Coach panel */}
          <div className="wpc-desktop-left">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
              <button onClick={() => setShowSwitcher(true)} style={{
                width: "140px", height: "140px", borderRadius: "50%",
                overflow: "hidden", border: "3px solid oklch(38% 0.10 260)",
                cursor: "pointer", padding: 0, background: "none",
              }} aria-label="Switch coach">
                <Image src={coachImage} alt={coachName} width={140} height={140}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </button>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", color: MUTED, letterSpacing: "0.06em" }}>
                {s.clickToChange}
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.25rem" }}>
                {s.yourAiCoach}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontStyle: "italic", color: WHITE, lineHeight: 1.1 }}>
                {coachName}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: MUTED, marginTop: "0.25rem" }}>
                {sessionCount === 0 ? s.firstSessionReady : s.sessionReady(sessionCount + 1, coachName)}
              </p>
            </div>

            <div style={{ width: "100%" }}>
              <SessionTypeSelector trialExhausted={trialExhausted} trialRemainingMinutes={trialRemainingMinutes} lang={lang} />
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
                  {grantedMinutes === 0 ? "" : s.freeTrial}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, color: (trialExhausted || grantedMinutes === 0) ? "oklch(55% 0.15 30)" : WHITE }}>
                  {grantedMinutes === 0 ? s.noCredit : trialExhausted ? s.trialComplete : s.minRemaining(trialRemainingMinutes)}
                </p>
                {grantedMinutes > 0 && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED }}>
                    {s.minutesUsed(trialUsedMinutes, grantedMinutes)}
                  </p>
                )}
              </div>
              <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {ADDONS.map(pkg => (
                    <div key={pkg.label} style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.05em",
                      padding: "0.5rem 0.75rem",
                      background: pkg.bestValue ? "oklch(20% 0.10 260)" : "oklch(24% 0.07 260)", color: MUTED,
                      border: `1px solid ${pkg.bestValue ? ORANGE : "oklch(28% 0.07 260)"}`,
                      whiteSpace: "nowrap", position: "relative",
                    }}>
                      {pkg.bestValue && <span style={{ color: ORANGE, marginRight: "0.3rem" }}>★</span>}
                      {lang === "id"
                        ? pkg.minutes === 60 ? "1 Jam" : pkg.minutes === 180 ? "3 Jam" : "5 Jam"
                        : pkg.label} {currency === "idr" ? pkg.idr : pkg.usd}
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", color: "oklch(40% 0.007 260)", letterSpacing: "0.04em" }}>
                  {s.purchasesSoon}
                </p>
              </div>
            </div>

            {/* Tab strip */}
            <div style={{ display: "flex", borderBottom: "1px solid oklch(22% 0.08 260)", flexShrink: 0 }}>
              {(["notes", "background"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "0.75rem 1.5rem",
                    background: "none", border: "none",
                    borderBottom: `2px solid ${rightTab === tab ? ORANGE : "transparent"}`,
                    color: rightTab === tab ? ORANGE : MUTED,
                    cursor: "pointer",
                    transition: "color 0.15s, border-color 0.15s",
                    marginBottom: "-1px",
                  }}
                >
                  {tab === "notes" ? s.sessionNotes : (lang === "id" ? "Latar Belakang" : "Background")}
                </button>
              ))}
            </div>

            <div className="wpc-notes-area">
              {rightTab === "notes" ? (
                <>
                  {sessions.length > 0 && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: MUTED, marginBottom: "1rem" }}>
                      {s.sessionCount(sessions.length)}
                    </p>
                  )}
                  <AccordionNotes sessions={sessions} lang={lang} />
                </>
              ) : (() => {
                const fl = lang === "id" ? {
                  name: "Nama", role: "Peran", organisation: "Lembaga",
                  location: "Lokasi", homeCulture: "Budaya asal", hostCulture: "Budaya setempat",
                  monthsInContext: "Bulan di konteks", notes: "Catatan",
                } : {
                  name: "Name", role: "Role", organisation: "Organisation",
                  location: "Location", homeCulture: "Home culture", hostCulture: "Host culture",
                  monthsInContext: "Months in context", notes: "Notes",
                };
                const fields = [
                  { label: fl.name, value: profile.name },
                  { label: fl.role, value: profile.role },
                  { label: fl.organisation, value: profile.organisation },
                  { label: fl.location, value: profile.location },
                  { label: fl.homeCulture, value: profile.home_culture },
                  { label: fl.hostCulture, value: profile.host_culture },
                  { label: fl.monthsInContext, value: profile.months_in_context != null ? String(profile.months_in_context) : null },
                  { label: fl.notes, value: profile.notes },
                ].filter(f => f.value);
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {fields.length === 0 ? (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: MUTED, lineHeight: 1.7 }}>
                        {s.noBackgroundInfo}
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
                    <Link href="/coach/setup" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: ORANGE, textDecoration: "none", letterSpacing: "0.04em" }}>
                      {s.editBackgroundInfo}
                    </Link>
                  </div>
                );
              })()}
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
                  {s.chooseCoach}
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
                        {s.current}
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
