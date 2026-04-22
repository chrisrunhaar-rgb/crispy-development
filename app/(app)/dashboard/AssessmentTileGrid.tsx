"use client";

import { useState } from "react";
import Link from "next/link";

// ── Brand tokens ─────────────────────────────────────────────────────────────
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";

// ── DISC ─────────────────────────────────────────────────────────────────────
const DISC_SLICES = [
  { key: "D", label: "Dominance",        fill: "#C44A2A" },
  { key: "I", label: "Influence",         fill: "#C48A1A" },
  { key: "S", label: "Steadiness",        fill: "#2E7A40" },
  { key: "C", label: "Conscientiousness", fill: "#2B5FAC" },
] as const;

const DISC_RESULT_TEXT: Record<string, string> = {
  D:  "You lead with boldness and results. Your greatest strength is driving action and cutting through indecision. Growth edge: slow down enough to bring people with you — not just past them.",
  I:  "You lead with energy and relationships. Your greatest strength is inspiring others and creating momentum. Growth edge: follow through on commitments and develop your eye for detail.",
  S:  "You lead with patience and loyalty. Your greatest strength is creating environments where people feel safe and valued. Growth edge: practise taking initiative and speaking your concerns earlier.",
  C:  "You lead with precision and expertise. Your greatest strength is bringing rigour and quality to everything. Growth edge: learn to act with less-than-perfect information and share your insights more openly.",
  DI: "You combine boldness with people-energy — driving results while keeping others inspired. A powerful combination in leading diverse teams.",
  DS: "You balance directness with steadiness — goal-focused yet able to create stable, loyal teams. You lead with both force and consistency.",
  DC: "You combine drive with precision — results-oriented and quality-obsessed. Your challenge: don't let perfectionism slow momentum.",
  IS: "You blend enthusiasm with warmth — inspiring people while genuinely caring for them. A gift in relational and cross-cultural contexts.",
  IC: "You combine persuasion with precision — engaging communicator and careful thinker. Balance spontaneity with follow-through.",
  SC: "You bring steadiness and rigour together — reliable, patient, and quality-driven. A trusted anchor for any team.",
};

const DISC_NAMES: Record<string, string> = {
  D: "Dominant", I: "Influential", S: "Steady", C: "Conscientious",
};

function discPolarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function discSlicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const span = endDeg - startDeg;
  if (span >= 359.9) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  const s = discPolarXY(cx, cy, r, startDeg);
  const e = discPolarXY(cx, cy, r, endDeg);
  const large = span > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

function DiscPieSVG({ scores, size, showCenter = true }: {
  scores: { D: number; I: number; S: number; C: number };
  size: number;
  result: string;
  showCenter?: boolean;
}) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 2, gap = 1.2;
  let angle = 0;
  const slices = DISC_SLICES.map(s => {
    const pct = scores[s.key as keyof typeof scores];
    const span = (pct / 100) * 360;
    const start = angle + gap / 2;
    const end = angle + span - gap / 2;
    angle += span;
    return { ...s, pct, start, end };
  });
  const innerR = size * 0.22;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map(s => (
        <path key={s.key} d={discSlicePath(cx, cy, r, s.start, s.end)} fill={s.fill} />
      ))}
      {showCenter && <circle cx={cx} cy={cy} r={innerR} fill="white" />}
    </svg>
  );
}

// ── Wheel of Life ─────────────────────────────────────────────────────────────
const WHEEL_SEGMENTS = [
  { key: "family",     label: "Family",      color: "#3b5fa0" },
  { key: "finance",    label: "Finance",     color: "#c4762a" },
  { key: "relaxation", label: "Relaxation",  color: "#2a8f8f" },
  { key: "ministry",   label: "Ministry",    color: "#b83820" },
  { key: "spiritual",  label: "Spiritual",   color: "#8a6415" },
  { key: "community",  label: "Community",   color: "#2a8a64" },
  { key: "learning",   label: "Learning",    color: "#6a3a9e" },
  { key: "health",     label: "Health",      color: "#2e8a40" },
];

function WheelSpiderSVG({ scores, size, showLabels = false }: {
  scores: Record<string, number>;
  size: number;
  showLabels?: boolean;
}) {
  const cx = size / 2, cy = size / 2;
  const maxR = size / 2 - (showLabels ? 26 : 5);
  const N = WHEEL_SEGMENTS.length;

  const getPoint = (i: number, score: number): [number, number] => {
    const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    const dist = (score / 10) * maxR;
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  };

  const axisEndPoints = WHEEL_SEGMENTS.map((_, i): [number, number] => {
    const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    return [cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle)];
  });

  const scorePoints = WHEEL_SEGMENTS.map((seg, i) => getPoint(i, scores[seg.key] ?? 0));
  const scorePolygon = scorePoints.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {rings.map((fraction, ri) => {
        const pts = WHEEL_SEGMENTS.map((_, i): [number, number] => {
          const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
          return [cx + maxR * fraction * Math.cos(angle), cy + maxR * fraction * Math.sin(angle)];
        });
        return (
          <polygon
            key={ri}
            points={pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")}
            fill="none"
            stroke="oklch(85% 0.006 260)"
            strokeWidth="0.75"
          />
        );
      })}

      {/* Axis lines */}
      {axisEndPoints.map(([ax, ay], i) => (
        <line key={i} x1={cx.toFixed(2)} y1={cy.toFixed(2)} x2={ax.toFixed(2)} y2={ay.toFixed(2)}
          stroke="oklch(85% 0.006 260)" strokeWidth="0.75" />
      ))}

      {/* Score polygon */}
      <polygon
        points={scorePolygon}
        fill={`${orange}2e`}
        stroke={orange}
        strokeWidth={showLabels ? 1.5 : 1}
      />

      {/* Score dots */}
      {scorePoints.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={showLabels ? 3 : 2}
          fill={WHEEL_SEGMENTS[i].color} />
      ))}

      {/* Labels (expanded only) */}
      {showLabels && axisEndPoints.map(([ax, ay], i) => {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
        const lx = cx + (maxR + 16) * Math.cos(angle);
        const ly = cy + (maxR + 16) * Math.sin(angle);
        return (
          <text key={i} x={lx.toFixed(2)} y={(ly + 4).toFixed(2)} textAnchor="middle"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fill: WHEEL_SEGMENTS[i].color, fontWeight: 600 }}>
            {WHEEL_SEGMENTS[i].label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Thinking Styles bar SVG ───────────────────────────────────────────────────
function ThinkingBarsSVG({ scores, size }: { scores: { C: number; H: number; I: number }; size: number }) {
  const bars = [
    { key: "C" as const, label: "C", color: "oklch(48% 0.18 250)" },
    { key: "H" as const, label: "H", color: "oklch(48% 0.18 145)" },
    { key: "I" as const, label: "I", color: "oklch(48% 0.18 300)" },
  ];
  const barH = (size - 16) / 3 - 4;
  return (
    <svg width={size} height={size * 0.55} viewBox={`0 0 ${size} ${size * 0.55}`}>
      {bars.map((b, i) => {
        const y = i * (barH + 6);
        const w = (scores[b.key] / 100) * (size - 4);
        return (
          <g key={b.key}>
            <rect x={0} y={y} width={size - 4} height={barH} rx={2} fill="oklch(92% 0.004 260)" />
            <rect x={0} y={y} width={w} height={barH} rx={2} fill={b.color} />
          </g>
        );
      })}
    </svg>
  );
}

// ── Spiritual Gifts mini visual ───────────────────────────────────────────────
const KARUNIA_LABELS_ID: Record<string, string> = {
  melayani: "Melayani", murah_hati: "Murah Hati", keramahan: "Keramahan",
  bahasa_roh: "Bahasa Roh", menyembuhkan: "Menyembuhkan", menguatkan: "Menguatkan",
  memberi: "Memberi", hikmat: "Hikmat", pengetahuan: "Pengetahuan",
  iman: "Iman", kerasulan: "Kerasulan", penginjilan: "Penginjilan",
  bernubuat: "Bernubuat", mengajar: "Mengajar", gembala: "Gembala",
  memimpin: "Memimpin", administrasi: "Administrasi", mukjizat: "Mukjizat",
  tafsir_bahasa_roh: "Tafsir",
};
const KARUNIA_LABELS_EN: Record<string, string> = {
  melayani: "Serving", murah_hati: "Mercy", keramahan: "Hospitality",
  bahasa_roh: "Tongues", menyembuhkan: "Healing", menguatkan: "Exhortation",
  memberi: "Giving", hikmat: "Wisdom", pengetahuan: "Knowledge",
  iman: "Faith", kerasulan: "Apostleship", penginjilan: "Evangelism",
  bernubuat: "Prophecy", mengajar: "Teaching", gembala: "Shepherding",
  memimpin: "Leadership", administrasi: "Administration", mukjizat: "Miracles",
  tafsir_bahasa_roh: "Interpretation",
};
const KARUNIA_LABELS_NL: Record<string, string> = {
  melayani: "Dienstbetoon", murah_hati: "Barmhartigheid", keramahan: "Gastvrijheid",
  bahasa_roh: "Tongen", menyembuhkan: "Genezing", menguatkan: "Bemoediging",
  memberi: "Vrijgevigheid", hikmat: "Wijsheid", pengetahuan: "Kennis",
  iman: "Geloof", kerasulan: "Apostelschap", penginjilan: "Evangelisatie",
  bernubuat: "Profetie", mengajar: "Onderwijs", gembala: "Herderschap",
  memimpin: "Leiderschap", administrasi: "Bestuur", mukjizat: "Wonderen",
  tafsir_bahasa_roh: "Uitleg",
};
function karuniaLabel(key: string, lang: string): string {
  if (lang === "id") return KARUNIA_LABELS_ID[key] ?? key;
  if (lang === "nl") return KARUNIA_LABELS_NL[key] ?? key;
  return KARUNIA_LABELS_EN[key] ?? key;
}

// ── Modal overlay ─────────────────────────────────────────────────────────────
type ModalData =
  | { type: "disc"; result: string; scores: { D: number; I: number; S: number; C: number } }
  | { type: "wheel"; scores: Record<string, number> }
  | { type: "thinking"; result: string; scores: { C: number; H: number; I: number } }
  | { type: "karunia"; topGifts: string[]; scores: Record<string, number>; lang: "en" | "id" | "nl" }
  | { type: "enneagram"; type_num: number; scores: Record<string, number> }
  | { type: "mbti"; mbtiType: string; scores: Record<string, number> }
  | { type: "bigfive"; scores: Record<string, number> }
  | { type: "16personalities"; personalityType: string; scores: Record<string, number> };

function AssessmentModal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "oklch(10% 0.05 260 / 0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "1.5rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: offWhite, borderRadius: 16,
          padding: "2rem 2rem 1.75rem",
          maxWidth: 480, width: "100%",
          maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 24px 64px oklch(10% 0.1 260 / 0.35)",
        }}
      >
        {data.type === "disc" && <DiscModal data={data} onClose={onClose} />}
        {data.type === "wheel" && <WheelModal data={data} onClose={onClose} />}
        {data.type === "thinking" && <ThinkingModal data={data} onClose={onClose} />}
        {data.type === "karunia" && <KaruniaModal data={data} onClose={onClose} />}
        {data.type === "enneagram" && <EnneagramModal data={data} onClose={onClose} />}
        {data.type === "mbti" && <MBTIModal data={data} onClose={onClose} />}
        {data.type === "bigfive" && <BigFiveModal data={data} onClose={onClose} />}
        {data.type === "16personalities" && <PersonalitiesModal data={data} onClose={onClose} />}
      </div>
    </div>
  );
}

function DiscModal({ data, onClose }: { data: Extract<ModalData, { type: "disc" }>; onClose: () => void }) {
  const { result, scores } = data;
  const resultLabel = result.split("").map(k => DISC_NAMES[k] ?? k).join(" · ");
  const description = DISC_RESULT_TEXT[result] ?? null;

  let angle = 0;
  const slicesWithPct = DISC_SLICES.map(s => {
    const pct = scores[s.key as keyof typeof scores];
    const span = (pct / 100) * 360;
    const start = angle + 1;
    const end = angle + span - 1;
    angle += span;
    return { ...s, pct, start, end };
  });

  const cx = 80, cy = 80, r = 72;

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        DISC Personality Profile
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        {resultLabel}
      </h3>

      {/* Large pie + legend */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
          {slicesWithPct.map(s => (
            <path key={s.key} d={discSlicePath(cx, cy, r, s.start, s.end)} fill={s.fill} />
          ))}
          <circle cx={cx} cy={cy} r={30} fill={offWhite} />
          <text x={cx} y={cy - 5} textAnchor="middle"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "18px", fill: navy }}>
            {result}
          </text>
          <text x={cx} y={cy + 11} textAnchor="middle"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", fill: "oklch(55% 0.008 260)", letterSpacing: "0.06em" }}>
            DISC
          </text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
          {slicesWithPct.map(s => (
            <div key={s.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 9, height: 9, background: s.fill, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(42% 0.008 260)" }}>{s.label}</span>
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: navy }}>{s.pct}%</span>
              </div>
              <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.fill, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {description && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", marginBottom: "1.5rem", padding: "1rem", background: "oklch(94% 0.006 260)", borderRadius: 8 }}>
          {description}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/disc" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          Retake quiz →
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

function WheelModal({ data, onClose }: { data: Extract<ModalData, { type: "wheel" }>; onClose: () => void }) {
  const { scores } = data;
  const values = Object.values(scores);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const sorted = WHEEL_SEGMENTS.slice().sort((a, b) => (scores[a.key] ?? 0) - (scores[b.key] ?? 0));
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Life Balance Assessment
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "0.375rem" }}>
        Wheel of Life
      </h3>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(50% 0.008 260)", marginBottom: "1.25rem" }}>
        Average score: <strong style={{ color: navy }}>{avg} / 10</strong>
      </p>

      {/* Spider web */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <WheelSpiderSVG scores={scores} size={220} showLabels />
      </div>

      {/* Score bars */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem 1rem", marginBottom: "1.5rem" }}>
        {WHEEL_SEGMENTS.map(seg => (
          <div key={seg.key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: seg.color, fontWeight: 600 }}>{seg.label}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, color: navy }}>{scores[seg.key] ?? 0}</span>
            </div>
            <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${((scores[seg.key] ?? 0) / 10) * 100}%`, background: seg.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Insight chips */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ padding: "0.5rem 0.875rem", background: `${lowest.color}18`, borderRadius: 20, display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: lowest.color, fontWeight: 700 }}>Focus area</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: lowest.color }}>{lowest.label} ({scores[lowest.key]})</span>
        </div>
        <div style={{ padding: "0.5rem 0.875rem", background: `${highest.color}18`, borderRadius: 20, display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: highest.color, fontWeight: 700 }}>Strongest</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: highest.color }}>{highest.label} ({scores[highest.key]})</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/wheel-of-life" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          Update scores →
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

const THINKING_STYLE_LABELS: Record<string, string> = {
  C:  "Conceptual", H: "Holistic", I: "Intuitional",
  CH: "Conceptual-Holistic", CI: "Conceptual-Intuitional", HI: "Holistic-Intuitional",
  CHI: "Balanced",
};

const THINKING_STYLE_DESCRIPTIONS: Record<string, string> = {
  C:  "You lead with structure and analytical thinking. You see patterns, build frameworks, and solve problems systematically.",
  H:  "You lead with big-picture vision. You connect ideas across contexts and see how everything fits together.",
  I:  "You lead with instinct and insight. You read people and situations quickly, often knowing before you can explain why.",
  CH: "You blend structured thinking with broad vision — analytical yet able to see beyond the immediate.",
  CI: "You combine logical precision with sharp intuition — rigorous in your analysis but also attuned to what data can't capture.",
  HI: "You hold the big picture while staying tuned into people — visionary and relationally perceptive.",
  CHI: "You draw on all three dimensions. Your challenge is choosing which lens to lead with in each context.",
};

const THINKING_STYLE_COLORS: Record<string, string> = {
  C: "oklch(48% 0.18 250)",
  H: "oklch(48% 0.18 145)",
  I: "oklch(48% 0.18 300)",
};

function ThinkingModal({ data, onClose }: { data: Extract<ModalData, { type: "thinking" }>; onClose: () => void }) {
  const { result, scores } = data;
  const bars = (["C", "H", "I"] as const).map(k => ({
    key: k,
    label: k === "C" ? "Conceptual" : k === "H" ? "Holistic" : "Intuitional",
    color: THINKING_STYLE_COLORS[k],
    pct: scores[k],
  }));

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Leadership Thinking Style
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        {THINKING_STYLE_LABELS[result] ?? result}
      </h3>

      {/* Three bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem" }}>
        {bars.map(b => (
          <div key={b.key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: b.color }}>{b.label}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 800, color: navy }}>{b.pct}%</span>
            </div>
            <div style={{ height: 8, background: "oklch(90% 0.004 260)", borderRadius: 4 }}>
              <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {(THINKING_STYLE_DESCRIPTIONS[result]) && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", marginBottom: "1.5rem", padding: "1rem", background: "oklch(94% 0.006 260)", borderRadius: 8 }}>
          {THINKING_STYLE_DESCRIPTIONS[result]}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/three-thinking-styles" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          Retake quiz →
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

function KaruniaModal({ data, onClose }: { data: Extract<ModalData, { type: "karunia" }>; onClose: () => void }) {
  const { topGifts, scores, lang } = data;
  const title = lang === "id" ? "Karunia Rohani" : lang === "nl" ? "Geestelijke Gaven" : "Spiritual Gifts";
  const retakeLabel = lang === "id" ? "Ulangi tes →" : lang === "nl" ? "Opnieuw →" : "Retake quiz →";

  const sortedGifts = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Spiritual Assessment
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: "oklch(52% 0.008 260)", marginBottom: "1.5rem" }}>
        Top gifts identified
      </p>

      {/* Top 3 highlight */}
      <div style={{ display: "flex", gap: "0.625rem", marginBottom: "1.25rem" }}>
        {topGifts.slice(0, 3).map((gift, i) => (
          <div key={gift} style={{
            flex: 1, padding: "0.75rem 0.5rem", background: i === 0 ? navy : "oklch(94% 0.006 260)",
            borderRadius: 10, textAlign: "center",
          }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.1rem", fontWeight: 800, color: i === 0 ? orange : navy, marginBottom: "0.25rem" }}>{i + 1}</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 600, color: i === 0 ? "oklch(85% 0.01 80)" : "oklch(42% 0.008 260)", lineHeight: 1.3 }}>
              {karuniaLabel(gift, lang)}
            </p>
          </div>
        ))}
      </div>

      {/* Score bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {sortedGifts.map(([key, score], i) => {
          const maxScore = sortedGifts[0][1] || 1;
          return (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: i < 3 ? navy : "oklch(52% 0.008 260)", fontWeight: i < 3 ? 700 : 400 }}>
                  {karuniaLabel(key, lang)}
                </span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, color: navy }}>{score}</span>
              </div>
              <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(score / maxScore) * 100}%`, background: i < 3 ? orange : "oklch(70% 0.08 45)", borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/karunia-rohani" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          {retakeLabel}
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

function EnneagramModal({ data, onClose }: { data: Extract<ModalData, { type: "enneagram" }>; onClose: () => void }) {
  const { type_num, scores } = data;
  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Personality Assessment
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        Enneagram Type {type_num}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 5).map(([key, score]) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(42% 0.008 260)" }}>Type {key}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: navy }}>{score.toFixed(1)}</span>
            </div>
            <div style={{ height: 6, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${(score / 100) * 100}%`, background: orange, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/enneagram" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          Retake quiz →
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

function MBTIModal({ data, onClose }: { data: Extract<ModalData, { type: "mbti" }>; onClose: () => void }) {
  const { mbtiType, scores } = data;
  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Personality Type
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        {mbtiType}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {Object.entries(scores).map(([key, score]) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(42% 0.008 260)" }}>{key}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: navy }}>{score.toFixed(1)}</span>
            </div>
            <div style={{ height: 6, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${(score / 100) * 100}%`, background: orange, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/myers-briggs" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          Retake quiz →
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

function BigFiveModal({ data, onClose }: { data: Extract<ModalData, { type: "bigfive" }>; onClose: () => void }) {
  const { scores } = data;
  const OCEAN_LABELS = { O: "Openness", C: "Conscientiousness", E: "Extraversion", A: "Agreeableness", N: "Neuroticism" };
  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        The Big Five
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        OCEAN Profile
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {Object.entries(OCEAN_LABELS).map(([key, label]) => {
          const score = scores[key] ?? 0;
          return (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(42% 0.008 260)" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: navy }}>{score.toFixed(1)}</span>
              </div>
              <div style={{ height: 6, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${(score / 100) * 100}%`, background: orange, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/big-five" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          Retake quiz →
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

function PersonalitiesModal({ data, onClose }: { data: Extract<ModalData, { type: "16personalities" }>; onClose: () => void }) {
  const { personalityType, scores } = data;
  return (
    <>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)", marginBottom: "0.5rem" }}>
        Personality Type
      </p>
      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: navy, marginBottom: "1.5rem" }}>
        {personalityType}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {Object.entries(scores).map(([key, score]) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(42% 0.008 260)" }}>{key}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: navy }}>{score.toFixed(1)}</span>
            </div>
            <div style={{ height: 6, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${(score / 100) * 100}%`, background: orange, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/resources/16-personalities" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: offWhite, background: navy, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none" }}>
          Retake quiz →
        </Link>
        <button onClick={onClose} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: "oklch(52% 0.008 260)", background: "none", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1.25rem", borderRadius: 6, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

// ── Assessment title translations ──────────────────────────────────────────

const ASSESSMENT_TITLES: Record<string, Record<"en" | "id" | "nl", string>> = {
  disc: { en: "DISC Profile", id: "Profil DISC", nl: "DISC-profiel" },
  wheel: { en: "Wheel of Life", id: "Roda Kehidupan", nl: "Levensrad" },
  thinking: { en: "Thinking Styles", id: "Gaya Berpikir", nl: "Denkstijlen" },
  enneagram: { en: "Enneagram", id: "Enneagram", nl: "Enneagram" },
  mbti: { en: "Myers-Briggs", id: "Myers-Briggs", nl: "Myers-Briggs" },
  "16personalities": { en: "16 Personalities", id: "16 Kepribadian", nl: "16 Persoonlijkheden" },
  bigfive: { en: "Big Five", id: "Big Five", nl: "Big Five" },
};

function getTitle(key: string, lang: "en" | "id" | "nl"): string {
  return ASSESSMENT_TITLES[key]?.[lang] || ASSESSMENT_TITLES[key]?.en || key;
}

// ── Tile components ───────────────────────────────────────────────────────────

function CompactTile({
  title,
  visual,
  done,
  href,
  onClick,
}: {
  title: string;
  visual: React.ReactNode;
  done: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    background: done ? "white" : offWhite,
    border: `1px solid oklch(${done ? "88%" : "91%"} 0.006 80)`,
    borderRadius: 12,
    padding: "0.875rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    minHeight: 150,
    cursor: done ? "pointer" : "default",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    boxShadow: done && hovered
      ? "0 8px 24px oklch(22% 0.10 260 / 0.12)"
      : "0 1px 4px oklch(0% 0 0 / 0.04)",
    transform: done && hovered ? "translateY(-2px)" : "none",
    position: "relative",
    overflow: "hidden",
  };

  const content = (
    <div
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={done ? onClick : undefined}
    >
      {/* Subtle orange accent when done + hovered */}
      {done && hovered && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: orange, borderRadius: "12px 12px 0 0",
        }} />
      )}

      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: done ? navy : "oklch(58% 0.008 260)",
        textAlign: "center",
        lineHeight: 1.3,
        alignSelf: "flex-start",
        width: "100%",
      }}>
        {title}
      </p>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {visual}
      </div>

      {!done && href && (
        <Link
          href={href}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.62rem",
            fontWeight: 700,
            color: "oklch(42% 0.08 260)",
            textDecoration: "none",
            alignSelf: "flex-end",
          }}
          onClick={e => e.stopPropagation()}
        >
          Take test →
        </Link>
      )}
    </div>
  );

  return content;
}

function EmptyTileVisual() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="oklch(91% 0.005 260)" />
      <circle cx="24" cy="24" r="20" fill="none" stroke="oklch(84% 0.008 260)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="24" y="28" textAnchor="middle"
        style={{ fontFamily: "var(--font-montserrat)", fontSize: "16px", fill: "oklch(72% 0.008 260)" }}>
        ?
      </text>
    </svg>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function AssessmentTileGrid({
  discResult = null,
  discScores = null,
  wheelOfLifeScores = null,
  thinkingStyleResult = null,
  thinkingStyleScores = null,
  karuniaTopGifts = null,
  karuniaScores = null,
  enneagramType = null,
  enneagramScores = null,
  bigFiveScores = null,
  mbtiType = null,
  mbtiScores = null,
  personalities16Type = null,
  personalities16Scores = null,
  languagePreference = "en",
}: {
  discResult?: string | null;
  discScores?: { D: number; I: number; S: number; C: number } | null;
  wheelOfLifeScores?: Record<string, number> | null;
  thinkingStyleResult?: string | null;
  thinkingStyleScores?: { C: number; H: number; I: number } | null;
  karuniaTopGifts?: string[] | null;
  karuniaScores?: Record<string, number> | null;
  enneagramType?: number | null;
  enneagramScores?: Record<string, number> | null;
  bigFiveScores?: Record<string, number> | null;
  mbtiType?: string | null;
  mbtiScores?: Record<string, number> | null;
  personalities16Type?: string | null;
  personalities16Scores?: Record<string, number> | null;
  languagePreference?: "en" | "id" | "nl";
}) {
  const [modal, setModal] = useState<ModalData | null>(null);
  const lang = languagePreference;

  const karuniaTitle = lang === "id" ? "Karunia Rohani" : lang === "nl" ? "Geestelijke Gaven" : "Spiritual Gifts";

  // ── Compact visuals ──────────────────────────────────────────────────────────

  const discVisual = discScores ? (
    <DiscPieSVG scores={discScores} size={80} result={discResult ?? ""} />
  ) : <EmptyTileVisual />;

  const wheelVisual = wheelOfLifeScores ? (
    <WheelSpiderSVG scores={wheelOfLifeScores} size={72} showLabels={false} />
  ) : <EmptyTileVisual />;

  const thinkingVisual = thinkingStyleScores ? (
    <div style={{ width: "100%", paddingInline: "0.25rem" }}>
      {(["C", "H", "I"] as const).map(k => (
        <div key={k} style={{ marginBottom: "0.35rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", color: THINKING_STYLE_COLORS[k], fontWeight: 700 }}>
              {k === "C" ? "Conceptual" : k === "H" ? "Holistic" : "Intuitional"}
            </span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 800, color: navy }}>{thinkingStyleScores[k]}%</span>
          </div>
          <div style={{ height: 5, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
            <div style={{ height: "100%", width: `${thinkingStyleScores[k]}%`, background: THINKING_STYLE_COLORS[k], borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  ) : <EmptyTileVisual />;

  const karuniaVisual = karuniaTopGifts && karuniaTopGifts.length > 0 ? (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.2rem", fontWeight: 800, color: orange, lineHeight: 1, marginBottom: "0.2rem" }}>
        {karuniaLabel(karuniaTopGifts[0], lang)}
      </p>
      {karuniaTopGifts[1] && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(50% 0.008 260)" }}>
          + {karuniaLabel(karuniaTopGifts[1], lang)}
        </p>
      )}
    </div>
  ) : <EmptyTileVisual />;

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .assessment-modal-card { animation: modal-in 0.18s ease-out both; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>

        {/* 1. DISC */}
        <CompactTile
          title={getTitle("disc", lang)}
          visual={discVisual}
          done={!!(discResult && discScores)}
          href="/resources/disc"
          onClick={discResult && discScores ? () => setModal({ type: "disc", result: discResult, scores: discScores }) : undefined}
        />

        {/* 2. Wheel of Life */}
        <CompactTile
          title={getTitle("wheel", lang)}
          visual={wheelVisual}
          done={!!wheelOfLifeScores}
          href="/resources/wheel-of-life"
          onClick={wheelOfLifeScores ? () => setModal({ type: "wheel", scores: wheelOfLifeScores }) : undefined}
        />

        {/* 3. Three Thinking Styles */}
        <CompactTile
          title={getTitle("thinking", lang)}
          visual={thinkingVisual}
          done={!!(thinkingStyleResult && thinkingStyleScores)}
          href="/resources/three-thinking-styles"
          onClick={thinkingStyleResult && thinkingStyleScores ? () => setModal({ type: "thinking", result: thinkingStyleResult, scores: thinkingStyleScores }) : undefined}
        />

        {/* 4. Spiritual Gifts / Karunia Rohani */}
        <CompactTile
          title={karuniaTitle}
          visual={karuniaVisual}
          done={!!(karuniaTopGifts && karuniaTopGifts.length > 0)}
          href="/resources/karunia-rohani"
          onClick={karuniaTopGifts && karuniaScores && karuniaTopGifts.length > 0
            ? () => setModal({ type: "karunia", topGifts: karuniaTopGifts, scores: karuniaScores!, lang })
            : undefined}
        />

        {/* 5. Enneagram */}
        <CompactTile
          title={getTitle("enneagram", lang)}
          visual={enneagramScores ? <div style={{ textAlign: "center" }}><p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.4rem", fontWeight: 800, color: navy }}>Type {enneagramType}</p></div> : <EmptyTileVisual />}
          done={!!(enneagramType && enneagramScores)}
          href="/resources/enneagram"
          onClick={enneagramType && enneagramScores ? () => setModal({ type: "enneagram", type_num: enneagramType, scores: enneagramScores }) : undefined}
        />

        {/* 6. Myers-Briggs */}
        <CompactTile
          title={getTitle("mbti", lang)}
          visual={mbtiScores ? <div style={{ textAlign: "center" }}><p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.2rem", fontWeight: 800, color: navy }}>{mbtiType}</p></div> : <EmptyTileVisual />}
          done={!!(mbtiType && mbtiScores)}
          href="/resources/myers-briggs"
          onClick={mbtiType && mbtiScores ? () => setModal({ type: "mbti", mbtiType, scores: mbtiScores }) : undefined}
        />

        {/* 7. 16 Personalities */}
        <CompactTile
          title={getTitle("16personalities", lang)}
          visual={personalities16Scores ? <div style={{ textAlign: "center" }}><p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 800, color: navy }}>{personalities16Type}</p></div> : <EmptyTileVisual />}
          done={!!(personalities16Type && personalities16Scores)}
          href="/resources/16-personalities"
          onClick={personalities16Type && personalities16Scores ? () => setModal({ type: "16personalities", personalityType: personalities16Type, scores: personalities16Scores }) : undefined}
        />

        {/* 8. Big Five */}
        <CompactTile
          title={getTitle("bigfive", lang)}
          visual={bigFiveScores ? <div style={{ textAlign: "center" }}><p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700, color: navy, lineHeight: 1.2 }}>Results saved</p></div> : <EmptyTileVisual />}
          done={!!bigFiveScores}
          href="/resources/big-five"
          onClick={bigFiveScores ? () => setModal({ type: "bigfive", scores: bigFiveScores }) : undefined}
        />

      </div>

      {/* Modal overlay */}
      {modal && (
        <AssessmentModal data={modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}
