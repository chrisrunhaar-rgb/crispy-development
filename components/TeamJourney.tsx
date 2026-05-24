"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { unlockNextTeamStep, lockTeamStep, finalizeTeamStep } from "@/app/(app)/dashboard/team-actions";
import StepFeedback, { type FeedbackEntry } from "@/components/StepFeedback";
import type { TeamMemberResult } from "@/components/TeamResultsGrid";
import { TEAM_UI, type TeamLang } from "@/lib/team-i18n";

const DISC_SLICES = [
  { key: "D", fill: "#C44A2A" },
  { key: "I", fill: "#C48A1A" },
  { key: "S", fill: "#2E7A40" },
  { key: "C", fill: "#2B5FAC" },
] as const;

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

function DiscPieSVG({ scores, size = 72 }: { scores: { D: number; I: number; S: number; C: number }; size?: number }) {
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
      <circle cx={cx} cy={cy} r={innerR} fill="white" />
    </svg>
  );
}

// ── Wheel of Life spider ──────────────────────────────────────────────────────
const WHEEL_SEGMENTS = [
  { key: "family" },     { key: "finance" },    { key: "relaxation" },
  { key: "ministry" },   { key: "spiritual" },  { key: "community" },
  { key: "learning" },   { key: "health" },
];
const WHEEL_LABELS: Record<string, string> = {
  family: "FAMILY", finance: "FINANCE", relaxation: "REST",
  ministry: "MINISTRY", spiritual: "SPIRITUAL", community: "COMMUNITY",
  learning: "LEARNING", health: "HEALTH",
};
function WheelSpiderSVG({ scores, size = 72 }: { scores: Record<string, number>; size?: number }) {
  const cx = size / 2, cy = size / 2, maxR = size / 2 - 5, N = WHEEL_SEGMENTS.length;
  function getPoint(i: number, score: number): [number, number] {
    const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    const dist = (score / 10) * maxR;
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  }
  const scorePoints = WHEEL_SEGMENTS.map((seg, i) => getPoint(i, scores[seg.key] ?? 0));
  const scorePoly = scorePoints.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const rings = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((f, ri) => {
        const pts = WHEEL_SEGMENTS.map((_, i): [number, number] => {
          const a = (i / N) * 2 * Math.PI - Math.PI / 2;
          return [cx + maxR * f * Math.cos(a), cy + maxR * f * Math.sin(a)];
        });
        return <polygon key={ri} points={pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")} fill="none" stroke="oklch(85% 0.006 260)" strokeWidth="0.75" />;
      })}
      {WHEEL_SEGMENTS.map((_, i) => {
        const a = (i / N) * 2 * Math.PI - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={(cx + maxR * Math.cos(a)).toFixed(2)} y2={(cy + maxR * Math.sin(a)).toFixed(2)} stroke="oklch(85% 0.006 260)" strokeWidth="0.75" />;
      })}
      <polygon points={scorePoly} fill="oklch(42% 0.14 145 / 0.18)" stroke="oklch(42% 0.14 145)" strokeWidth={1.5} />
    </svg>
  );
}

// ── Wheel of Life — large labeled template (no data) ─────────────────────────
function WheelTemplateLabeledSVG() {
  const S = 320, cx = 160, cy = 160, maxR = 95, labelDist = 124, N = WHEEL_SEGMENTS.length;
  const rings = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: "visible" }}>
      {rings.map((f, ri) => {
        const pts = WHEEL_SEGMENTS.map((_, i): [number, number] => {
          const a = (i / N) * 2 * Math.PI - Math.PI / 2;
          return [cx + maxR * f * Math.cos(a), cy + maxR * f * Math.sin(a)];
        });
        return <polygon key={ri} points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} fill="none" stroke="oklch(84% 0.008 260)" strokeWidth="1" />;
      })}
      {WHEEL_SEGMENTS.map((_, i) => {
        const a = (i / N) * 2 * Math.PI - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={(cx + maxR * Math.cos(a)).toFixed(1)} y2={(cy + maxR * Math.sin(a)).toFixed(1)} stroke="oklch(84% 0.008 260)" strokeWidth="1" />;
      })}
      {WHEEL_SEGMENTS.map((seg, i) => {
        const a = (i / N) * 2 * Math.PI - Math.PI / 2;
        const lx = cx + labelDist * Math.cos(a);
        const ly = cy + labelDist * Math.sin(a);
        const cosA = Math.cos(a);
        const textAnchor = cosA < -0.12 ? "end" : cosA > 0.12 ? "start" : "middle";
        return (
          <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)}
            textAnchor={textAnchor} dominantBaseline="middle"
            fill="oklch(38% 0.008 260)" fontFamily="var(--font-montserrat)"
            fontSize="9" fontWeight="700" letterSpacing="0.08em"
          >
            {WHEEL_LABELS[seg.key] ?? seg.key.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

// ── Big Five OCEAN radar ──────────────────────────────────────────────────────
function OceanRadarSVG({ scores, size = 72 }: { scores: Record<string, number>; size?: number }) {
  function calcPct(raw: number) { return Math.round(((raw - 10) / 40) * 100); }
  const pcts = { O: calcPct(scores.O ?? 30), C: calcPct(scores.C ?? 30), E: calcPct(scores.E ?? 30), A: calcPct(scores.A ?? 30), ES: 100 - calcPct(scores.N ?? 30) };
  const ORDER = ["O", "C", "E", "A", "ES"] as const;
  const COLORS: Record<string, string> = { O: "oklch(52% 0.22 280)", C: "oklch(50% 0.18 215)", E: "oklch(60% 0.20 52)", A: "oklch(52% 0.18 155)", ES: "oklch(50% 0.20 310)" };
  const cx = size / 2, cy = size / 2, r = (size / 2) * 0.70;
  function ang(i: number) { return -Math.PI / 2 + (i * 2 * Math.PI) / 5; }
  function pt(i: number, pct: number): [number, number] { const d = (pct / 100) * r; return [cx + d * Math.cos(ang(i)), cy + d * Math.sin(ang(i))]; }
  const userPts = ORDER.map((t, i) => pt(i, pcts[t]));
  const userPoly = userPts.map(p => p.join(",")).join(" ");
  function gridPoly(pct: number) { return ORDER.map((_, i) => pt(i, pct).join(",")).join(" "); }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25, 50, 75, 100].map(p => <polygon key={p} points={gridPoly(p)} fill="none" stroke="oklch(88% 0.006 260)" strokeWidth={0.75} />)}
      {ORDER.map((_, i) => { const [x2, y2] = pt(i, 100); return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="oklch(88% 0.006 260)" strokeWidth={0.75} />; })}
      <polygon points={userPoly} fill="oklch(52% 0.22 280 / 0.14)" stroke="oklch(52% 0.22 280)" strokeWidth={1.5} />
      {userPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={COLORS[ORDER[i]]} />)}
    </svg>
  );
}

// ── Shared constants ──────────────────────────────────────────────────────────
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";

const THINKING_STYLE_COLORS: Record<string, string> = {
  C: "oklch(48% 0.18 250)", H: "oklch(48% 0.18 145)", I: "oklch(48% 0.18 300)",
};
const P16_COLORS: Record<string, string> = {
  INTJ: "oklch(48% 0.20 260)", INTP: "oklch(48% 0.18 240)", ENTJ: "oklch(50% 0.22 25)",  ENTP: "oklch(58% 0.20 45)",
  INFJ: "oklch(48% 0.22 295)", INFP: "oklch(52% 0.18 10)",  ENFJ: "oklch(52% 0.18 155)", ENFP: "oklch(60% 0.18 65)",
  ISTJ: "oklch(45% 0.14 215)", ISFJ: "oklch(50% 0.16 185)", ESTJ: "oklch(48% 0.18 195)", ESFJ: "oklch(55% 0.18 35)",
  ISTP: "oklch(50% 0.15 145)", ISFP: "oklch(55% 0.18 150)", ESTP: "oklch(58% 0.20 55)",  ESFP: "oklch(62% 0.20 48)",
};
const ENNEAGRAM_DATA: Record<number, { color: string; name: string }> = {
  1: { color: "oklch(55% 0.12 260)", name: "Reformer" },
  2: { color: "oklch(65% 0.20 25)",  name: "Helper" },
  3: { color: "oklch(65% 0.25 40)",  name: "Achiever" },
  4: { color: "oklch(55% 0.20 310)", name: "Individualist" },
  5: { color: "oklch(50% 0.15 260)", name: "Investigator" },
  6: { color: "oklch(55% 0.18 45)",  name: "Loyalist" },
  7: { color: "oklch(70% 0.20 80)",  name: "Enthusiast" },
  8: { color: "oklch(50% 0.25 10)",  name: "Challenger" },
  9: { color: "oklch(55% 0.12 140)", name: "Peacemaker" },
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
const FIVELA_COLORS: Record<string, string> = {
  A: "oklch(72% 0.18 85)", B: "oklch(62% 0.14 235)", C: "oklch(52% 0.14 150)", D: "oklch(68% 0.15 10)", E: "oklch(70% 0.16 65)",
};
const FIVELA_NAMES: Record<string, string> = {
  A: "Words", B: "Quality Time", C: "Service", D: "Gifts", E: "Touch",
};

function getAssessmentVisual(resultType: string, resultKey: string, scores: Record<string, number>): React.ReactNode {
  switch (resultType) {
    case "disc": {
      const ds = scores as { D: number; I: number; S: number; C: number };
      return <DiscPieSVG scores={ds} size={72} />;
    }
    case "wheel_of_life":
      return <WheelSpiderSVG scores={scores} size={72} />;
    case "big_five":
      return <OceanRadarSVG scores={scores} size={72} />;
    case "thinking_style":
      return (
        <div style={{ width: "100%", paddingInline: "0.25rem" }}>
          {(["C", "H", "I"] as const).map(k => (
            <div key={k} style={{ marginBottom: "0.3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.1rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.5rem", color: THINKING_STYLE_COLORS[k], fontWeight: 700 }}>
                  {k === "C" ? "Conceptual" : k === "H" ? "Holistic" : "Intuitional"}
                </span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.5rem", fontWeight: 800, color: navy }}>{scores[k] ?? 0}%</span>
              </div>
              <div style={{ height: 5, background: "oklch(90% 0.004 260)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${scores[k] ?? 0}%`, background: THINKING_STYLE_COLORS[k], borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      );
    case "personalities16": {
      const typeColor = P16_COLORS[resultKey] ?? navy;
      return (
        <div style={{ width: "100%" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 900, color: typeColor, textAlign: "center", marginBottom: "0.35rem", lineHeight: 1 }}>
            {resultKey}
          </p>
          {(["EI", "SN", "TF", "JP"] as const).map(d => {
            const scoreA = scores[`${d}_A`] ?? 0;
            const scoreB = scores[`${d}_B`] ?? 0;
            const total = scoreA + scoreB || 1;
            const pctA = Math.round((scoreA / total) * 100);
            const dominant = pctA >= 50 ? d[0] : d[1];
            const dominantPct = pctA >= 50 ? pctA : 100 - pctA;
            return (
              <div key={d} style={{ marginBottom: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.08rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.48rem", color: typeColor, fontWeight: 700 }}>{dominant}</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.48rem", fontWeight: 800, color: navy }}>{dominantPct}%</span>
                </div>
                <div style={{ height: 4, background: "oklch(90% 0.004 260)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${dominantPct}%`, background: typeColor, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    case "enneagram": {
      const typeNum = parseInt(resultKey);
      const data = ENNEAGRAM_DATA[typeNum];
      return (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "2.2rem", fontWeight: 900, color: data?.color ?? navy, lineHeight: 1 }}>
            {typeNum}
          </p>
          {data && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", color: data.color, fontWeight: 600, marginTop: "0.2rem" }}>
              {data.name}
            </p>
          )}
        </div>
      );
    }
    case "karunia":
      return (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.1rem", fontWeight: 800, color: orange, lineHeight: 1.1, marginBottom: "0.15rem" }}>
            {KARUNIA_LABELS_EN[resultKey] ?? resultKey}
          </p>
        </div>
      );
    case "5languages": {
      const primary = resultKey.split("|")[0];
      return (
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: FIVELA_COLORS[primary] ?? navy, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", fontWeight: 700, color: navy, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {FIVELA_NAMES[primary] ?? primary}
            </span>
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            {(["A", "B", "C", "D", "E"] as const).map(key => {
              const val = scores[key] ?? 0;
              return (
                <div key={key} style={{ flex: 1, height: 18, background: "oklch(90% 0.004 260)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${Math.min(val, 100)}%`, background: FIVELA_COLORS[key], opacity: key === primary ? 1 : 0.45 }} />
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    case "comm_style": {
      const COMM_COLORS: Record<string, string> = { A: "oklch(55% 0.18 250)", D: "oklch(52% 0.16 145)", C: "oklch(62% 0.16 45)", N: "oklch(55% 0.14 300)" };
      const COMM_NAMES: Record<string, string> = { A: "Architect", D: "Diplomat", C: "Connector", N: "Analyst" };
      const commColor = COMM_COLORS[resultKey] ?? navy;
      const maxCommVal = Math.max(...(["A", "D", "C", "N"] as const).map(k => scores[k] ?? 0), 1);
      return (
        <div style={{ width: "100%" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 800, color: commColor, textAlign: "center", marginBottom: "0.4rem", lineHeight: 1 }}>
            {COMM_NAMES[resultKey] ?? resultKey}
          </p>
          <div style={{ display: "flex", gap: "3px" }}>
            {(["A", "D", "C", "N"] as const).map(key => (
              <div key={key} style={{ flex: 1 }}>
                <div style={{ height: 22, background: "oklch(90% 0.004 260)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${((scores[key] ?? 0) / maxCommVal) * 100}%`, background: COMM_COLORS[key], opacity: key === resultKey ? 1 : 0.3 }} />
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.38rem", fontWeight: 700, color: COMM_COLORS[key], textAlign: "center", marginTop: "0.1rem" }}>{key}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "trust": {
      const trustScore = parseFloat(resultKey);
      const trustColor = trustScore >= 4.5 ? "oklch(48% 0.18 145)" : trustScore >= 3.5 ? "oklch(55% 0.16 80)" : trustScore >= 2.5 ? "oklch(55% 0.16 45)" : "oklch(52% 0.18 20)";
      const trustDims = ["voice", "failure", "difference", "vulnerability", "conflict", "cultural"];
      return (
        <div style={{ width: "100%" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.6rem", fontWeight: 900, color: trustColor, textAlign: "center", lineHeight: 1, marginBottom: "0.3rem" }}>
            {isNaN(trustScore) ? resultKey : trustScore.toFixed(1)}
            <span style={{ fontSize: "0.55rem", fontWeight: 600, color: "oklch(62% 0.008 260)" }}>/5</span>
          </p>
          <div style={{ display: "flex", gap: "2px" }}>
            {trustDims.map(key => (
              <div key={key} style={{ flex: 1, height: 16, background: "oklch(90% 0.004 260)", borderRadius: 1, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${((scores[key] ?? 0) / 5) * 100}%`, background: trustColor }} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "contribution_zone": {
      const ZONE_COLORS: Record<string, string> = { P: "oklch(52% 0.18 20)", B: "oklch(48% 0.18 230)", C: "oklch(48% 0.18 145)", D: "oklch(50% 0.16 290)" };
      const ZONE_NAMES: Record<string, string> = { P: "Pioneer", B: "Builder", C: "Connector", D: "Deepener" };
      const zoneColor = ZONE_COLORS[resultKey] ?? navy;
      const maxZoneVal = Math.max(...(["P", "B", "C", "D"] as const).map(k => scores[k] ?? 0), 1);
      return (
        <div style={{ width: "100%" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", fontWeight: 800, color: zoneColor, textAlign: "center", marginBottom: "0.4rem", lineHeight: 1 }}>
            {ZONE_NAMES[resultKey] ?? resultKey}
          </p>
          <div style={{ display: "flex", gap: "3px" }}>
            {(["P", "B", "C", "D"] as const).map(key => (
              <div key={key} style={{ flex: 1 }}>
                <div style={{ height: 22, background: "oklch(90% 0.004 260)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${((scores[key] ?? 0) / maxZoneVal) * 100}%`, background: ZONE_COLORS[key], opacity: key === resultKey ? 1 : 0.3 }} />
                </div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.38rem", fontWeight: 700, color: ZONE_COLORS[key], textAlign: "center", marginTop: "0.1rem" }}>{key}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "conflict_style": {
      const CONFLICT_COLORS: Record<string, string> = { A: "oklch(55% 0.14 200)", C: "oklch(55% 0.18 45)", M: "oklch(55% 0.15 260)" };
      const CONFLICT_NAMES: Record<string, string> = { A: "Protector", C: "Confronter", M: "Mediator" };
      const CONFLICT_SUBS: Record<string, string> = { A: "Avoids conflict", C: "Confronts directly", M: "Mediates between" };
      const conflictColor = CONFLICT_COLORS[resultKey] ?? navy;
      return (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 800, color: conflictColor, lineHeight: 1, marginBottom: "0.25rem" }}>
            {CONFLICT_NAMES[resultKey] ?? resultKey}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.48rem", color: conflictColor, fontWeight: 600, opacity: 0.8 }}>
            {CONFLICT_SUBS[resultKey] ?? ""}
          </p>
        </div>
      );
    }
    case "purpose_vision": {
      const text = resultKey;
      return (
        <div style={{ textAlign: "center", padding: "0.25rem" }}>
          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "0.72rem",
            color: "oklch(38% 0.008 260)",
            lineHeight: 1.5,
            margin: 0,
            overflow: "hidden",
            maxHeight: "4.5em",
          }}>
            &ldquo;{text}&rdquo;
          </p>
        </div>
      );
    }
    default:
      return null;
  }
}

export type StepCompletion = {
  user_id: string;
  step_number: number;
  completed_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
};

type Step = {
  number: number;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  type: "article" | "assessment" | "workshop";
  icon: string;
  collectsData: boolean;
  dataLabel: string | null;
  dataLabel_id?: string;
  comingSoon?: boolean;
  contentUrl?: string;
  resultType?: string;
};

const BASE_JOURNEY_STEPS: Step[] = [
  {
    number: 1,
    title: "Team Foundations",
    title_id: "Fondasi Tim",
    description: "Establish your team's identity, values, and shared expectations for the journey ahead. What kind of team do we want to be?",
    description_id: "Tetapkan identitas, nilai, dan ekspektasi bersama untuk perjalanan ke depan. Tim seperti apa yang ingin kita bangun?",
    type: "article",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/team-foundations",
  },
  {
    number: 2,
    title: "Team Purpose & Vision",
    title_id: "Tujuan & Visi Tim",
    description: "Clarify why your team exists and where you're heading together. A shared vision is the foundation of everything that follows.",
    description_id: "Perjelas mengapa tim Anda ada dan ke mana kalian melangkah bersama. Visi bersama adalah fondasi segalanya.",
    type: "workshop",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    collectsData: true,
    dataLabel: "Purpose Statement",
    dataLabel_id: "Pernyataan Tujuan",
    contentUrl: "/team/team-purpose-vision",
    resultType: "purpose_vision",
  },
  {
    number: 3,
    title: "Getting to Know Each Other",
    title_id: "Saling Mengenal",
    description: "Every person on your team carries a unique story, background, and context. Make space to truly see one another.",
    description_id: "Setiap anggota tim membawa cerita, latar belakang, dan konteks yang unik. Beri ruang untuk sungguh-sungguh mengenal satu sama lain.",
    type: "workshop",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/know-each-other",
  },
  {
    number: 4,
    title: "Communication Culture",
    title_id: "Budaya Komunikasi",
    description: "How does your team talk, listen, and disagree? Establish shared norms for healthy, cross-cultural communication.",
    description_id: "Bagaimana tim Anda berbicara, mendengarkan, dan berselisih? Bangun norma bersama untuk komunikasi lintas budaya yang sehat.",
    type: "article",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    collectsData: true,
    dataLabel: "Comm Style",
    dataLabel_id: "Gaya Komunikasi",
    contentUrl: "/team/communication-culture",
    resultType: "comm_style",
  },
  {
    number: 5,
    title: "Trust & Psychological Safety",
    title_id: "Kepercayaan & Keamanan Psikologis",
    description: "Build the foundation that makes everything else possible. Teams that feel safe take risks, speak up, and grow together.",
    description_id: "Bangun fondasi yang membuat segalanya menjadi mungkin. Tim yang merasa aman berani mengambil risiko, berbicara jujur, dan bertumbuh bersama.",
    type: "workshop",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    collectsData: true,
    dataLabel: "Trust Score",
    dataLabel_id: "Skor Kepercayaan",
    contentUrl: "/team/trust-psychological-safety",
    resultType: "trust",
  },
  {
    number: 6,
    title: "Roles & Contribution",
    title_id: "Peran & Kontribusi",
    description: "Clarify who does what, why, and how. When roles are clear and gifts are recognised, teams unlock their full potential.",
    description_id: "Perjelas siapa melakukan apa, mengapa, dan bagaimana. Ketika peran jelas dan karunia diakui, tim mengungkap potensi penuhnya.",
    type: "article",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    collectsData: true,
    dataLabel: "Contribution Zone",
    dataLabel_id: "Zona Kontribusi",
    contentUrl: "/team/roles-contribution",
    resultType: "contribution_zone",
  },
  {
    number: 7,
    title: "Navigating Conflict",
    title_id: "Menghadapi Konflik",
    description: "Conflict is inevitable — how you handle it defines your culture. Learn to turn tension into growth rather than fracture.",
    description_id: "Konflik tidak bisa dihindari — cara Anda menghadapinya mendefinisikan budaya tim. Belajar mengubah ketegangan menjadi pertumbuhan, bukan perpecahan.",
    type: "workshop",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    collectsData: true,
    dataLabel: "Conflict Style",
    dataLabel_id: "Gaya Konflik",
    contentUrl: "/team/navigating-conflict",
    resultType: "conflict_style",
  },
  {
    number: 8,
    title: "Decision Making Together",
    title_id: "Mengambil Keputusan Bersama",
    description: "Who decides, and how? Build a shared decision-making culture that honours everyone while keeping the team moving forward.",
    description_id: "Siapa yang memutuskan, dan bagaimana caranya? Bangun budaya pengambilan keputusan yang menghormati semua orang sambil terus bergerak maju.",
    type: "article",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/decision-making",
  },
  {
    number: 9,
    title: "Accountability & Follow-Through",
    title_id: "Akuntabilitas & Tindak Lanjut",
    description: "Commitments made, commitments kept. Build a culture where people own their responsibilities and support each other to deliver.",
    description_id: "Janji dibuat, janji ditepati. Bangun budaya di mana setiap orang memiliki tanggung jawabnya dan saling mendukung untuk menuntaskan.",
    type: "workshop",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/accountability",
  },
  {
    number: 10,
    title: "Forward Together",
    title_id: "Melangkah Bersama",
    description: "Celebrate how far you've come and set your next horizon. A healthy team never stops growing — this is where you begin again.",
    description_id: "Rayakan perjalanan yang telah ditempuh dan tetapkan cakrawala berikutnya. Tim yang sehat tidak berhenti bertumbuh — di sinilah kalian memulai kembali.",
    type: "workshop",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/forward-together",
  },
];

// Assessment add-on steps — each has an insertAfter position (base step number after which it slots in)
// order controls the sequence within a group (lower = earlier)
type AssessmentDef = Omit<Step, "number"> & { insertAfter: number; order?: number };

const ASSESSMENT_STEP_DEFS: Record<string, AssessmentDef> = {
  // After step 3 "Getting to Know Each Other" — personal insights that deepen first impressions
  "wheel-of-life": {
    title: "Wheel of Life",
    title_id: "Roda Kehidupan",
    description: "See where each team member is thriving and where they need support. Leaders who truly know their people lead them better.",
    description_id: "Lihat di mana setiap anggota tim sedang berkembang dan di mana mereka membutuhkan dukungan. Pemimpin yang benar-benar mengenal timnya memimpin dengan lebih baik.",
    type: "assessment",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    collectsData: true,
    dataLabel: "Life Balance",
    dataLabel_id: "Keseimbangan Hidup",
    contentUrl: "/team/wheel-of-life",
    resultType: "wheel_of_life",
    insertAfter: 3,
    order: 2,
  },
  "enneagram": {
    title: "Enneagram",
    description: "Understand the core motivations and growth paths of each team member. The Enneagram reveals what drives people at the deepest level.",
    description_id: "Pahami motivasi inti dan jalur pertumbuhan setiap anggota tim. Enneagram mengungkap apa yang mendorong seseorang di tingkat yang paling dalam.",
    type: "assessment",
    icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    collectsData: true,
    dataLabel: "Enneagram Type",
    dataLabel_id: "Tipe Enneagram",
    contentUrl: "/team/enneagram",
    resultType: "enneagram",
    insertAfter: 3,
    order: 3,
  },
  // After step 3 "Getting to Know Each Other" — knowing how people feel valued is core to truly knowing them
  "5languages": {
    title: "5 Languages of Appreciation",
    title_id: "5 Bahasa Penghargaan",
    description: "Discover how each team member feels genuinely valued — and how to express appreciation in ways that actually land.",
    description_id: "Temukan bagaimana setiap anggota tim merasa sungguh-sungguh dihargai — dan cara mengungkapkan penghargaan yang benar-benar sampai ke hati.",
    type: "assessment",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    collectsData: true,
    dataLabel: "Appreciation Language",
    dataLabel_id: "Bahasa Penghargaan",
    contentUrl: "/team/5languages",
    resultType: "5languages",
    insertAfter: 3,
    order: 1,
  },
  // After step 4 "Communication Culture" — behavioural & personality styles shape how teams communicate
  "disc": {
    title: "DISC Profiles",
    title_id: "Profil DISC",
    description: "Map your team's behavioural styles — who drives, who influences, who supports, who analyses. Use your differences as strengths.",
    description_id: "Petakan gaya perilaku tim Anda — siapa yang mendorong, siapa yang mempengaruhi, siapa yang mendukung, siapa yang menganalisis. Jadikan perbedaan sebagai kekuatan.",
    type: "assessment",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    collectsData: true,
    dataLabel: "DISC Type",
    contentUrl: "/team/disc",
    resultType: "disc",
    insertAfter: 4,
    order: 1,
  },
  "three-thinking-styles": {
    title: "Three Thinking Styles",
    title_id: "Tiga Gaya Berpikir",
    description: "Understand how each person processes information and makes decisions — and how your styles complement each other.",
    description_id: "Pahami bagaimana setiap orang memproses informasi dan mengambil keputusan — dan bagaimana gaya berpikir Anda saling melengkapi.",
    type: "assessment",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    collectsData: true,
    dataLabel: "Thinking Style",
    dataLabel_id: "Gaya Berpikir",
    contentUrl: "/team/three-thinking-styles",
    resultType: "thinking_style",
    insertAfter: 4,
    order: 2,
  },
  "16-personalities": {
    title: "16 Personalities",
    description: "In-depth personality profiles that reveal how your team members think, feel, and interact in work and relationships.",
    description_id: "Profil kepribadian mendalam yang mengungkap cara anggota tim berpikir, merasakan, dan berinteraksi dalam pekerjaan maupun hubungan.",
    type: "assessment",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    collectsData: true,
    dataLabel: "Personality",
    dataLabel_id: "Kepribadian",
    contentUrl: "/team/16-personalities",
    resultType: "personalities16",
    insertAfter: 4,
    order: 3,
  },
  "big-five": {
    title: "Big Five (OCEAN)",
    description: "The gold standard in personality research — measure Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism across your team.",
    description_id: "Standar emas dalam riset kepribadian — ukur Keterbukaan, Kehati-hatian, Ekstraversi, Keramahan, dan Neurotisme di seluruh tim Anda.",
    type: "assessment",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    collectsData: true,
    dataLabel: "OCEAN Profile",
    dataLabel_id: "Profil OCEAN",
    contentUrl: "/team/big-five",
    resultType: "big_five",
    insertAfter: 4,
    order: 4,
  },
  // After step 5 "Trust & Psychological Safety" — spiritual gifts are shared most freely in a safe team
  "karunia-rohani": {
    title: "Karunia Rohani",
    description: "Discover each team member's spiritual gifts and how they're uniquely wired to serve and contribute within the team.",
    description_id: "Temukan karunia rohani setiap anggota tim dan bagaimana mereka secara unik diperlengkapi untuk melayani dan berkontribusi dalam tim.",
    type: "assessment",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    collectsData: true,
    dataLabel: "Gift Profile",
    dataLabel_id: "Profil Karunia",
    contentUrl: "/team/karunia-rohani",
    resultType: "karunia",
    insertAfter: 5,
    order: 1,
  },
};

function buildJourneySteps(selectedAssessments: string[]): Step[] {
  const steps: Omit<Step, "number">[] = [];

  for (const baseStep of BASE_JOURNEY_STEPS) {
    steps.push(baseStep);
    // Insert selected assessments after this base step, sorted by defined order
    selectedAssessments
      .filter(id => ASSESSMENT_STEP_DEFS[id]?.insertAfter === baseStep.number)
      .sort((a, b) => (ASSESSMENT_STEP_DEFS[a].order ?? 99) - (ASSESSMENT_STEP_DEFS[b].order ?? 99))
      .forEach(id => steps.push(ASSESSMENT_STEP_DEFS[id]));
  }

  // Renumber sequentially after insertions
  return steps.map((s, i) => ({ ...s, number: i + 1 } as Step));
}

function getTypeLabel(type: string, lang: TeamLang): string {
  if (lang === "id") {
    const id: Record<string, string> = { article: "Artikel", assessment: "Asesmen", workshop: "Lokakarya" };
    return id[type] ?? type;
  }
  const en: Record<string, string> = { article: "Article", assessment: "Assessment", workshop: "Workshop" };
  return en[type] ?? type;
}

// Type badge colors — subdued, brand-safe
const TYPE_BADGE: Record<string, { color: string; bg: string }> = {
  article:    { color: "oklch(38% 0.10 260)", bg: "oklch(38% 0.10 260 / 0.08)" },
  assessment: { color: "oklch(40% 0.10 290)", bg: "oklch(40% 0.10 290 / 0.08)" },
  workshop:   { color: "oklch(38% 0.12 145)", bg: "oklch(38% 0.12 145 / 0.08)" },
};

function getResultDisplay(resultType: string, resultKey: string, lang: TeamLang = "en"): { label: string; color: string } {
  const ui = TEAM_UI[lang];
  switch (resultType) {
    case "disc": {
      const colors: Record<string, string> = { D: "oklch(48% 0.18 20)", I: "oklch(48% 0.14 85)", S: "oklch(42% 0.14 145)", C: "oklch(42% 0.18 250)" };
      return { label: resultKey, color: colors[resultKey[0]] ?? "oklch(42% 0.008 260)" };
    }
    case "wheel_of_life":
      return { label: `${parseFloat(resultKey).toFixed(1)}/5`, color: "oklch(42% 0.14 145)" };
    case "thinking_style": {
      const en: Record<string, string> = { C: "Conceptual", H: "Holistic", I: "Intuitional", CH: "C·H", CI: "C·I", HI: "H·I", CHI: "Balanced" };
      const id: Record<string, string> = { C: ui.conceptual as string, H: ui.holistic as string, I: ui.intuitional as string, CH: "C·H", CI: "C·I", HI: "H·I", CHI: ui.balanced as string };
      const labels = lang === "id" ? id : en;
      return { label: labels[resultKey] ?? resultKey, color: "oklch(42% 0.008 260)" };
    }
    case "enneagram":
      return { label: `Type ${resultKey}`, color: "oklch(42% 0.14 260)" };
    case "personalities16":
      return { label: resultKey, color: "oklch(42% 0.14 200)" };
    case "big_five":
      return { label: resultKey, color: "oklch(42% 0.008 260)" };
    case "karunia": {
      const labels: Record<string, string> = { melayani: "Melayani", murah_hati: "Murah Hati", keramahan: "Keramahan", memberi: "Memberi", hikmat: "Hikmat", iman: "Iman", memimpin: "Memimpin", mengajar: "Mengajar", gembala: "Gembala", bernubuat: "Bernubuat" };
      return { label: labels[resultKey] ?? resultKey, color: "oklch(42% 0.14 145)" };
    }
    case "5languages": {
      const labels: Record<string, string> = { A: "Words", B: "Quality Time", C: "Acts of Service", D: "Tangible Gifts", E: "Physical Touch" };
      const [recv] = resultKey.split("|");
      return { label: labels[recv] ?? recv, color: "oklch(42% 0.14 45)" };
    }
    case "comm_style": {
      const colors: Record<string, string> = { A: "oklch(55% 0.18 250)", D: "oklch(52% 0.16 145)", C: "oklch(62% 0.16 45)", N: "oklch(55% 0.14 300)" };
      const names: Record<string, string> = { A: "Architect", D: "Diplomat", C: "Connector", N: "Analyst" };
      return { label: names[resultKey] ?? resultKey, color: colors[resultKey] ?? "oklch(42% 0.008 260)" };
    }
    case "trust":
      return { label: `${parseFloat(resultKey).toFixed(1)}/5`, color: "oklch(48% 0.18 145)" };
    case "contribution_zone": {
      const colors: Record<string, string> = { P: "oklch(52% 0.18 20)", B: "oklch(48% 0.18 230)", C: "oklch(48% 0.18 145)", D: "oklch(50% 0.16 290)" };
      const en: Record<string, string> = { P: "Pioneer", B: "Builder", C: "Connector", D: "Deepener" };
      const id: Record<string, string> = { P: ui.pioneer as string, B: ui.builder as string, C: ui.connector as string, D: ui.deepener as string };
      const names = lang === "id" ? id : en;
      return { label: names[resultKey] ?? resultKey, color: colors[resultKey] ?? "oklch(42% 0.008 260)" };
    }
    case "conflict_style": {
      const colors: Record<string, string> = { A: "oklch(55% 0.14 200)", C: "oklch(55% 0.18 45)", M: "oklch(55% 0.15 260)" };
      const en: Record<string, string> = { A: "Protector", C: "Confronter", M: "Mediator" };
      const id: Record<string, string> = { A: ui.protector as string, C: ui.confronter as string, M: ui.mediator as string };
      const names = lang === "id" ? id : en;
      return { label: names[resultKey] ?? resultKey, color: colors[resultKey] ?? "oklch(42% 0.008 260)" };
    }
    case "purpose_vision":
      return { label: resultKey.slice(0, 40) + (resultKey.length > 40 ? "…" : ""), color: "oklch(42% 0.14 145)" };
    default:
      return { label: resultKey, color: "oklch(42% 0.008 260)" };
  }
}

export default function TeamJourney({
  teamId,
  teamName,
  leaderName,
  leaderUserId,
  currentUserId,
  currentStep,
  teamMembers,
  stepCompletions,
  isLeader,
  finalizedSteps = [],
  selectedAssessments = [],
  stepFeedback = {},
  teamResults = [],
  language = "en",
}: {
  teamId: string;
  teamName: string;
  leaderName?: string;
  leaderUserId?: string;
  currentUserId?: string;
  currentStep: number;
  teamMembers: TeamMember[];
  stepCompletions: StepCompletion[];
  isLeader: boolean;
  finalizedSteps?: number[];
  selectedAssessments?: string[];
  stepFeedback?: Record<number, FeedbackEntry[]>;
  teamResults?: TeamMemberResult[];
  language?: TeamLang;
}) {
  const ui = TEAM_UI[language];
  const JOURNEY_STEPS = buildJourneySteps(selectedAssessments);

  const [expandedStep, setExpandedStep] = useState<number>(currentStep);
  const [localCurrentStep, setLocalCurrentStep] = useState(currentStep);
  const [isPending, startTransition] = useTransition();
  const [isLockPending, startLockTransition] = useTransition();
  const [isFinalizePending, startFinalizeTransition] = useTransition();
  const [localFinalizedSteps, setLocalFinalizedSteps] = useState<number[]>(finalizedSteps);
  // Build combined display list: leader first, then members
  const displayMembers: (TeamMember & { isLeader?: boolean })[] = [
    ...(leaderUserId && leaderName ? [{ id: leaderUserId, name: leaderName, email: "", isLeader: true }] : []),
    ...teamMembers,
  ];

  // Build a completion map: step_number → Set of user_ids who completed
  const completionMap = new Map<number, Set<string>>();
  for (const sc of stepCompletions) {
    if (!completionMap.has(sc.step_number)) {
      completionMap.set(sc.step_number, new Set());
    }
    completionMap.get(sc.step_number)!.add(sc.user_id);
  }

  // Overall journey progress (based on all participants: leader + members)
  const allParticipantCount = Math.max(displayMembers.length, 1);
  const unlockedSteps = JOURNEY_STEPS.filter(s => s.number <= localCurrentStep);
  const totalCompletions = unlockedSteps.reduce((sum, s) => {
    const completedCount = completionMap.get(s.number)?.size ?? 0;
    return sum + completedCount;
  }, 0);
  const maxCompletions = unlockedSteps.length * allParticipantCount;
  const overallPct = maxCompletions > 0 ? Math.round((totalCompletions / maxCompletions) * 100) : 0;

  function handleUnlock() {
    const next = localCurrentStep + 1;
    startTransition(async () => {
      const result = await unlockNextTeamStep(teamId, next);
      if (!result.error) {
        setLocalCurrentStep(next);
        setExpandedStep(next);
      }
    });
  }

  function handleLock() {
    const prev = localCurrentStep - 1;
    startLockTransition(async () => {
      const result = await lockTeamStep(teamId, prev);
      if (!result.error) {
        setLocalCurrentStep(prev);
        setExpandedStep(prev);
      }
    });
  }

  function handleFinalize(stepNumber: number, currentlyFinalized: boolean) {
    startFinalizeTransition(async () => {
      const result = await finalizeTeamStep(teamId, stepNumber, !currentlyFinalized);
      if (!result.error) {
        setLocalFinalizedSteps(prev =>
          currentlyFinalized ? prev.filter(n => n !== stepNumber) : [...prev, stepNumber]
        );
      }
    });
  }

  return (
    <div style={{ borderRadius: "8px", overflow: "hidden" }}>

      {/* ── Journey header — navy ── */}
      <div style={{
        background: "oklch(30% 0.12 260)",
        padding: "2rem 1.75rem 1.75rem",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.625rem",
            }}>
              {ui.journeyLabel}
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.75rem",
              color: "oklch(97% 0.005 80)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}>
              {teamName}
            </h2>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "0.975rem",
              color: "oklch(66% 0.04 260)",
              lineHeight: 1.5,
            }}>
              {leaderName && <span>{ui.ledBy} {leaderName} · </span>}
              {teamMembers.length} {teamMembers.length === 1 ? ui.member : ui.members} · {language === "id" ? `Langkah ${localCurrentStep} dari ${JOURNEY_STEPS.length}` : `Step ${localCurrentStep} of ${JOURNEY_STEPS.length}`}{selectedAssessments.length > 0 ? ` · ${selectedAssessments.length} ${selectedAssessments.length !== 1 ? ui.assessmentsAdded : ui.assessmentAdded}` : ""}
            </p>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0, paddingTop: "0.125rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "3rem",
              color: "oklch(97% 0.005 80)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}>
              {overallPct}<span style={{ fontSize: "1.25rem", fontWeight: 300, color: "oklch(55% 0.04 260)" }}>%</span>
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.52rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "oklch(50% 0.04 260)",
              marginTop: "0.25rem",
            }}>{ui.teamProgress}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: "3px",
          background: "oklch(22% 0.10 260)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "oklch(65% 0.15 45)",
            transform: `scaleX(${overallPct / 100})`,
            transformOrigin: "left center",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }} />
        </div>
      </div>

      {/* ── Journey steps — cinematic path ── */}
      <div style={{ border: "1px solid oklch(86% 0.008 80)", borderTop: "none", background: "white" }}>

        {JOURNEY_STEPS.map((step, idx) => {
          const isUnlocked = step.number <= localCurrentStep;
          const isActive = step.number === localCurrentStep;
          const completedUsers = completionMap.get(step.number) ?? new Set<string>();
          const completedCount = completedUsers.size;
          const totalMembers = displayMembers.length;
          const allDone = totalMembers > 0 && completedCount >= totalMembers;
          const isExpanded = expandedStep === step.number;

          const stepStatus: "completed" | "active" | "locked" =
            allDone && step.number < localCurrentStep ? "completed"
            : isUnlocked ? "active"
            : "locked";

          // Path segment flow conditions (for CSS animation)
          const topFlow    = idx > 0 && step.number <= localCurrentStep;
          const bottomFlow = idx < JOURNEY_STEPS.length - 1 && step.number < localCurrentStep;

          const isAssessmentStep = step.type === "assessment";

          return (
            <div key={step.number}>
            <div
              className="journey-step-enter"
              style={{
                animationDelay: `${idx * 38}ms`,
                borderTop: idx === 0 ? "none" : "1px solid oklch(91% 0.005 80)",
                background: isAssessmentStep ? "oklch(99% 0.018 45 / 0.4)" : undefined,
              }}
            >
              {/* ── Step header row ── */}
              <div
                onClick={() => isUnlocked && setExpandedStep(isExpanded ? -1 : step.number)}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  cursor: isUnlocked ? "pointer" : "default",
                  opacity: stepStatus === "locked" ? 0.28 : 1,
                  background: "white",
                  transition: "opacity 0.2s ease",
                  minHeight: isActive ? "68px" : "54px",
                }}
              >

                {/* ── Cinematic path column ── */}
                <div style={{
                  width: "54px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                }}>

                  {/* Top line */}
                  <div
                    className={topFlow ? "journey-path-flow" : undefined}
                    style={{
                      flex: 1,
                      width: "1.5px",
                      minHeight: "10px",
                      background: idx === 0 ? "transparent"
                        : topFlow ? "oklch(65% 0.15 45)"
                        : "oklch(88% 0.006 80)",
                    }}
                  />

                  {/* Node */}
                  {(() => {
                    const isFinalized = localFinalizedSteps.includes(step.number);
                    const showGreen = isFinalized || stepStatus === "completed";
                    return (
                      <div
                        className={isActive && !showGreen ? "journey-node-pulse" : undefined}
                        style={{
                          width: "17px",
                          height: "17px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: showGreen
                            ? "oklch(52% 0.14 145)"
                            : isActive
                            ? "oklch(65% 0.15 45)"
                            : "transparent",
                          border: `1.5px solid ${
                            showGreen ? "oklch(52% 0.14 145)"
                            : isActive ? "oklch(65% 0.15 45)"
                            : "oklch(82% 0.005 80)"
                          }`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background 0.3s ease, border-color 0.3s ease",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        {showGreen && (
                          <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth={2.5}
                            strokeLinecap="round" strokeLinejoin="round"
                            style={{ width: "7px", height: "7px" }}>
                            <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                          </svg>
                        )}
                        {isActive && !showGreen && (
                          <div style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "white",
                          }} />
                        )}
                      </div>
                    );
                  })()}

                  {/* Bottom line */}
                  <div
                    className={bottomFlow ? "journey-path-flow" : undefined}
                    style={{
                      flex: 1,
                      width: "1.5px",
                      minHeight: "10px",
                      background: idx === JOURNEY_STEPS.length - 1 ? "transparent"
                        : bottomFlow ? "oklch(65% 0.15 45)"
                        : "oklch(88% 0.006 80)",
                    }}
                  />
                </div>

                {/* Step number — editorial */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  paddingRight: "0.875rem",
                  paddingLeft: isActive ? "0.25rem" : "0",
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 900,
                    fontSize: isActive ? "1.375rem" : "1.125rem",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: isActive
                      ? "oklch(65% 0.15 45)"
                      : localFinalizedSteps.includes(step.number) ? "oklch(52% 0.14 145)"
                      : stepStatus === "completed" ? "oklch(52% 0.14 145)"
                      : "oklch(82% 0.005 80)",
                    textShadow: isActive ? "0 0 8px oklch(65% 0.15 45 / 0.4)" : "none",
                    transition: "all 0.25s ease",
                  }}>
                    {String(step.number).padStart(2, "0")}
                  </span>
                </div>

                {/* Title + badges + member pills */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "0.75rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: isActive ? 700 : stepStatus === "completed" ? 600 : 500,
                    fontSize: isActive ? "1.0625rem" : "0.9375rem",
                    color: isActive ? "oklch(22% 0.005 260)"
                      : localFinalizedSteps.includes(step.number) ? "oklch(28% 0.005 260)"
                      : stepStatus === "completed" ? "oklch(28% 0.005 260)"
                      : isUnlocked ? "oklch(25% 0.005 260)"
                      : "oklch(55% 0.008 260)",
                    lineHeight: 1.25,
                    letterSpacing: isActive ? "-0.01em" : "0",
                    marginBottom: "0.3rem",
                    transition: "all 0.25s ease",
                  }}>
                    {language === "id" ? (step.title_id ?? step.title) : step.title}
                  </p>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: TYPE_BADGE[step.type].color,
                      background: TYPE_BADGE[step.type].bg,
                      padding: "2px 7px",
                      flexShrink: 0,
                    }}>
                      {getTypeLabel(step.type, language)}
                    </span>

                    {step.comingSoon && isUnlocked && (
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "oklch(58% 0.10 45)",
                        background: "oklch(58% 0.10 45 / 0.1)",
                        padding: "2px 7px",
                        flexShrink: 0,
                      }}>
                        {ui.contentSoon}
                      </span>
                    )}

                    {isUnlocked && totalMembers > 0 && (
                      <div style={{ display: "flex", gap: "3px", alignItems: "center", marginLeft: "0.25rem" }}>
                        {displayMembers.map(m => (
                          <div
                            key={m.id}
                            title={`${m.name}: ${completedUsers.has(m.id) ? ui.completed : ui.pending}`}
                            style={{
                              width: "26px",
                              height: "4px",
                              background: completedUsers.has(m.id)
                                ? "oklch(52% 0.14 145)"
                                : "oklch(86% 0.006 80)",
                              transition: "background 0.25s ease",
                            }}
                          />
                        ))}
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.6rem",
                          color: "oklch(56% 0.008 260)",
                          marginLeft: "0.375rem",
                          fontWeight: 500,
                        }}>
                          {completedCount}/{totalMembers}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: status icon + chevron */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0, paddingRight: "1.375rem" }}>
                  {stepStatus === "completed" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="oklch(52% 0.14 145)" strokeWidth={2.5}
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ width: "16px", height: "16px", flexShrink: 0 }}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {stepStatus === "locked" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="oklch(72% 0.005 260)" strokeWidth={1.5}
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ width: "14px", height: "14px", flexShrink: 0 }}>
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {isUnlocked && (
                    <svg viewBox="0 0 16 16" fill="none"
                      stroke="oklch(60% 0.006 260)"
                      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                      style={{
                        width: "13px", height: "13px",
                        transition: "transform 0.2s ease",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  )}
                </div>
              </div>

              {/* ── Expanded detail panel ── */}
              {isExpanded && isUnlocked && (
                <div
                  className="edit-panel-reveal"
                  style={{
                    borderTop: "1px solid oklch(90% 0.006 80)",
                    background: isActive ? "oklch(99% 0.01 50)" : "oklch(98.5% 0.002 80)",
                    padding: "1.75rem 1.75rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.75rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Watermark step number — cinematic depth */}
                  {isActive && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        bottom: "-1.75rem",
                        right: "1rem",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 900,
                        fontSize: "clamp(6rem, 18vw, 10rem)",
                        color: "oklch(30% 0.12 260 / 0.06)",
                        lineHeight: 1,
                        userSelect: "none",
                        pointerEvents: "none",
                        letterSpacing: "-0.06em",
                      }}
                    >
                      {String(step.number).padStart(2, "0")}
                    </div>
                  )}

                  {/* Description + content button row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "oklch(35% 0.008 260)",
                      lineHeight: 1.7,
                      maxWidth: "56ch",
                      flex: 1,
                      minWidth: "200px",
                    }}>
                      {language === "id" ? (step.description_id ?? step.description) : step.description}
                    </p>
                    {step.contentUrl && (
                      <Link
                        href={step.contentUrl}
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          background: "oklch(65% 0.15 45)",
                          color: "white",
                          textDecoration: "none",
                          padding: "0.55rem 1.125rem",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      >
                        {ui.openContent}
                      </Link>
                    )}
                  </div>

                  {/* Member results: tiles for assessment steps, list for other steps */}
                  {displayMembers.length > 0 && (
                    step.resultType === "5languages" ? (
                      // ── 5 Languages: dual grids (Receiving + Giving) ──
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {(["recv", "giving"] as const).map((mode, modeIdx) => (
                          <div key={mode}>
                            <p style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.58rem",
                              fontWeight: 700,
                              letterSpacing: "0.13em",
                              textTransform: "uppercase",
                              color: "oklch(54% 0.008 260)",
                              marginBottom: "0.75rem",
                            }}>
                              {mode === "recv" ? (ui.recvLanguage as string) : (ui.givingLanguage as string)}
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.625rem" }}>
                              {displayMembers.map(member => {
                                const result = teamResults.find(r => r.user_id === member.id && r.result_type === "5languages");
                                const hasResult = result?.result_key != null;
                                const parts = result?.result_key?.split("|") ?? [];
                                const langKey = parts[modeIdx] ?? parts[0] ?? "";
                                const tileColor = langKey ? (FIVELA_COLORS[langKey] ?? navy) : "";
                                const tileName = langKey ? (FIVELA_NAMES[langKey] ?? langKey) : "";
                                return (
                                  <div key={member.id} style={{
                                    background: hasResult ? "white" : "oklch(97% 0.004 80)",
                                    border: `1px solid ${hasResult && tileColor ? `color-mix(in oklch, ${tileColor} 20%, oklch(88% 0.006 80))` : "oklch(91% 0.006 80)"}`,
                                    borderRadius: 12,
                                    padding: "0.875rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    minHeight: 130,
                                  }}>
                                    <div style={{ width: "100%" }}>
                                      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.72rem", color: "oklch(28% 0.005 260)", lineHeight: 1.25 }}>
                                        {member.name}
                                      </p>
                                    </div>
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                                      {hasResult && langKey ? (
                                        <div style={{ width: "100%" }}>
                                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: tileColor, flexShrink: 0 }} />
                                            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.52rem", fontWeight: 700, color: navy, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                              {tileName}
                                            </span>
                                          </div>
                                          <div style={{ display: "flex", gap: "2px" }}>
                                            {(["A", "B", "C", "D", "E"] as const).map(k => (
                                              <div key={k} style={{ flex: 1, height: 16, background: "oklch(90% 0.004 260)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                                                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${Math.min(result?.scores?.[k] ?? 0, 100)}%`, background: FIVELA_COLORS[k], opacity: k === langKey ? 1 : 0.4 }} />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "oklch(68% 0.006 260)", fontStyle: "italic" }}>
                                          {ui.notDoneYet}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : step.resultType ? (
                      <div>
                        {/* Wheel of Life: show labeled reference diagram above tiles */}
                        {step.resultType === "wheel_of_life" && (
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", padding: "0.5rem 0" }}>
                            <WheelTemplateLabeledSVG />
                          </div>
                        )}
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.13em",
                          textTransform: "uppercase",
                          color: "oklch(54% 0.008 260)",
                          marginBottom: "0.75rem",
                        }}>
                          {ui.teamResults}
                        </p>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                          gap: "0.625rem",
                        }}>
                          {displayMembers.map(member => {
                            const result = teamResults.find(
                              r => r.user_id === member.id && r.result_type === step.resultType
                            );
                            const hasResult = result?.result_key != null;
                            const { label, color } = hasResult
                              ? getResultDisplay(step.resultType!, result!.result_key!, language)
                              : { label: "", color: "" };
                            const visual = (hasResult && result?.scores)
                              ? getAssessmentVisual(step.resultType!, result.result_key!, result.scores)
                              : null;
                            return (
                              <div key={member.id} style={{
                                background: hasResult ? "white" : "oklch(97% 0.004 80)",
                                border: `1px solid ${hasResult ? `color-mix(in oklch, ${color} 20%, oklch(88% 0.006 80))` : "oklch(91% 0.006 80)"}`,
                                borderRadius: 12,
                                padding: "0.875rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "0.5rem",
                                minHeight: 150,
                              }}>
                                <div style={{ width: "100%" }}>
                                  <p style={{
                                    fontFamily: "var(--font-montserrat)",
                                    fontWeight: 700,
                                    fontSize: "0.72rem",
                                    color: "oklch(28% 0.005 260)",
                                    lineHeight: 1.25,
                                  }}>
                                    {member.name}
                                  </p>
                                </div>
                                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                                  {hasResult && visual ? (
                                    visual
                                  ) : hasResult ? (
                                    <span style={{
                                      fontFamily: "var(--font-montserrat)",
                                      fontSize: "0.72rem",
                                      fontWeight: 700,
                                      color,
                                      background: `color-mix(in oklch, ${color} 12%, white)`,
                                      padding: "4px 10px",
                                      borderRadius: 4,
                                    }}>
                                      {label}
                                    </span>
                                  ) : (
                                    <span style={{
                                      fontFamily: "var(--font-montserrat)",
                                      fontSize: "0.62rem",
                                      color: "oklch(68% 0.006 260)",
                                      fontStyle: "italic",
                                    }}>
                                      {ui.notDoneYet}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.13em",
                          textTransform: "uppercase",
                          color: "oklch(54% 0.008 260)",
                          marginBottom: "0.625rem",
                        }}>
                          {ui.teamProgressSection}
                        </p>

                        <div style={{
                          background: "oklch(98.5% 0.003 80)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1px",
                          outline: "1px solid oklch(88% 0.006 80)",
                        }}>
                          {displayMembers.map(member => {
                            const done = completedUsers.has(member.id);
                            const initial = member.name[0]?.toUpperCase() ?? "?";
                            return (
                              <div
                                key={member.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.875rem",
                                  padding: "0.625rem 0.875rem",
                                  background: done
                                    ? "oklch(52% 0.14 145 / 0.07)"
                                    : "oklch(98.5% 0.003 80)",
                                  transition: "background 0.2s ease",
                                }}
                              >
                                <div style={{
                                  width: "30px",
                                  height: "30px",
                                  flexShrink: 0,
                                  background: done ? "oklch(52% 0.14 145)" : "oklch(86% 0.006 80)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition: "background 0.2s ease",
                                }}>
                                  {done ? (
                                    <svg viewBox="0 0 24 24" fill="none"
                                      stroke="white" strokeWidth={2.5}
                                      strokeLinecap="round" strokeLinejoin="round"
                                      style={{ width: "14px", height: "14px" }}>
                                      <path d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <span style={{
                                      fontFamily: "var(--font-montserrat)",
                                      fontSize: "0.72rem",
                                      fontWeight: 700,
                                      color: "oklch(52% 0.008 260)",
                                    }}>
                                      {initial}
                                    </span>
                                  )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{
                                    fontFamily: "var(--font-montserrat)",
                                    fontWeight: 600,
                                    fontSize: "0.85rem",
                                    color: done ? "oklch(28% 0.005 260)" : "oklch(38% 0.008 260)",
                                    transition: "color 0.15s ease",
                                  }}>
                                    {member.name}
                                  </p>
                                </div>

                                <span style={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontSize: "0.58rem",
                                  fontWeight: 700,
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  color: done ? "oklch(42% 0.13 145)" : "oklch(62% 0.008 260)",
                                  transition: "color 0.15s ease",
                                }}>
                                  {done ? ui.completed : ui.pending}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}

                  {/* Step reflections — all team members */}
                  <StepFeedback
                    teamId={teamId}
                    stepNumber={step.number}
                    entries={stepFeedback[step.number] ?? []}
                  />

                  {/* Leader unlock controls */}
                  {isLeader && isActive && localCurrentStep < JOURNEY_STEPS.length && (
                    <div>
                      <div style={{ height: "1px", background: "oklch(88% 0.008 80)", marginBottom: "1.25rem" }} />
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        color: "oklch(52% 0.008 260)",
                        marginBottom: "0.875rem",
                        lineHeight: 1.5,
                      }}>
                        {ui.unlockNotice}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={handleUnlock}
                          disabled={isPending}
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            background: allDone ? "oklch(65% 0.15 45)" : "transparent",
                            color: allDone ? "white" : "oklch(30% 0.12 260)",
                            border: `1.5px solid ${allDone ? "oklch(65% 0.15 45)" : "oklch(30% 0.12 260)"}`,
                            padding: "0.575rem 1.375rem",
                            cursor: isPending ? "wait" : "pointer",
                            opacity: isPending ? 0.55 : 1,
                            transition: "all 0.15s ease",
                          }}
                        >
                          {isPending ? ui.unlocking : (ui.unlockStep as (n: number) => string)(localCurrentStep + 1)}
                        </button>

                        {!allDone && teamMembers.length > 0 && (
                          <p style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.72rem",
                            color: "oklch(58% 0.008 260)",
                            lineHeight: 1.5,
                          }}>
                            {(ui.membersDoneEarly as (done: number, total: number) => string)(completedCount, teamMembers.length)}
                          </p>
                        )}
                      </div>

                      {/* Finalize step — leader only */}
                      {isLeader && isUnlocked && (
                        <div style={{ marginTop: "0.875rem" }}>
                          <button
                            type="button"
                            onClick={() => handleFinalize(step.number, localFinalizedSteps.includes(step.number))}
                            disabled={isFinalizePending}
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.07em",
                              textTransform: "uppercase",
                              background: localFinalizedSteps.includes(step.number)
                                ? "oklch(52% 0.14 145 / 0.1)"
                                : "transparent",
                              color: localFinalizedSteps.includes(step.number)
                                ? "oklch(42% 0.13 145)"
                                : "oklch(50% 0.008 260)",
                              border: `1.5px solid ${localFinalizedSteps.includes(step.number) ? "oklch(52% 0.14 145 / 0.4)" : "oklch(82% 0.006 80)"}`,
                              padding: "0.45rem 1rem",
                              cursor: isFinalizePending ? "wait" : "pointer",
                              opacity: isFinalizePending ? 0.55 : 1,
                              transition: "all 0.15s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.375rem",
                            }}
                          >
                            {localFinalizedSteps.includes(step.number) ? (
                              <>
                                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: "10px", height: "10px" }}>
                                  <path d="M1.5 6l3 3 6-6" />
                                </svg>
                                {ui.stepFinalized}
                              </>
                            ) : isFinalizePending ? ui.finalizing : ui.finalizeStep}
                          </button>
                        </div>
                      )}

                      {/* Lock step back — leader only */}
                      {localCurrentStep > 1 && (
                        <div style={{ marginTop: "0.875rem" }}>
                          <button
                            type="button"
                            onClick={handleLock}
                            disabled={isLockPending}
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.62rem",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              background: "transparent",
                              color: "oklch(56% 0.008 260)",
                              border: "none",
                              padding: 0,
                              cursor: isLockPending ? "wait" : "pointer",
                              opacity: isLockPending ? 0.5 : 1,
                              textDecoration: "underline",
                              textDecorationColor: "currentColor",
                              textUnderlineOffset: "3px",
                            }}
                          >
                            {isLockPending ? ui.locking : (ui.lockAgain as (n: number) => string)(localCurrentStep)}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Journey complete message */}
                  {isLeader && localCurrentStep === JOURNEY_STEPS.length && step.number === JOURNEY_STEPS.length && (
                    <div style={{ borderTop: "1px solid oklch(88% 0.008 80)", paddingTop: "1.25rem" }}>
                      <p style={{
                        fontFamily: "var(--font-cormorant)",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                        color: "oklch(42% 0.12 145)",
                        lineHeight: 1.5,
                      }}>
                        {ui.journeyComplete}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
