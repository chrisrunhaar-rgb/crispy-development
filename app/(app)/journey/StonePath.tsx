"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { computeLayout, scatterDecor, type Decor, type Layout } from "./parkLayout";

const navy   = "oklch(30% 0.12 260)";
const orange = "oklch(65% 0.15 45)";

export type PathStep = { n: number; title: string; chapter: string | null; chapterStart: boolean };

// Small deterministic PRNG so every stone keeps the same shape on every visit
function seeded(seed: number) {
  let t = seed * 9973 + 12345;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function stonePath(n: number, w: number, h: number) {
  const rand = seeded(n);
  const points = 9 + Math.floor(rand() * 3);
  const cx = w / 2, cy = h / 2;
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2 + (rand() - 0.5) * 0.35;
    const r = 0.8 + rand() * 0.2;
    pts.push([cx + Math.cos(a) * (w / 2 - 3) * r, cy + Math.sin(a) * (h / 2 - 3) * r]);
  }
  // Rounded corners: curve through midpoints
  const mid = (p: [number, number], q: [number, number]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const start = mid(pts[pts.length - 1], pts[0]);
  let d = `M${start[0].toFixed(1)},${start[1].toFixed(1)}`;
  pts.forEach((p, i) => {
    const m = mid(p, pts[(i + 1) % pts.length]);
    d += ` Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
  });
  return d + "Z";
}

function polyline(pts: { x: number; y: number }[], every = 3) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = every; i < pts.length; i += every) d += ` L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  const last = pts[pts.length - 1];
  return d + ` L${last.x.toFixed(1)},${last.y.toFixed(1)}`;
}

const C = {
  meadow: "oklch(91% 0.05 135)",
  patch: "oklch(88% 0.065 138)",
  trailEdge: "oklch(78% 0.045 70)",
  trail: "oklch(87% 0.035 80)",
  water: "oklch(73% 0.08 230)",
  waterLight: "oklch(86% 0.05 225)",
  leaf: "oklch(62% 0.12 145)",
  leafDark: "oklch(50% 0.11 150)",
  pine: "oklch(46% 0.09 160)",
  trunk: "oklch(45% 0.06 55)",
  wood: "oklch(58% 0.07 60)",
  woodDark: "oklch(44% 0.06 55)",
  rock: "oklch(72% 0.015 80)",
  mountain: "oklch(66% 0.03 55)",
  mountainShade: "oklch(58% 0.035 55)",
  snow: "oklch(98% 0.005 250)",
};

function DecorItem({ d }: { d: Decor }) {
  const { x, y, s, v } = d;
  switch (d.kind) {
    case "tree":
      return (
        <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)})`}>
          <ellipse cx={0} cy={2} rx={14} ry={4} fill="oklch(40% 0.05 140 / 0.18)" />
          <rect x={-2.5} y={-10} width={5} height={12} rx={1.5} fill={C.trunk} />
          <circle cx={0} cy={-20} r={14} fill={v > 0.5 ? C.leaf : C.leafDark} />
          <circle cx={-8} cy={-14} r={9} fill={v > 0.5 ? C.leafDark : C.leaf} />
          <circle cx={5} cy={-25} r={6} fill="white" opacity={0.12} />
        </g>
      );
    case "pine":
      return (
        <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)})`}>
          <ellipse cx={0} cy={2} rx={12} ry={3.5} fill="oklch(40% 0.05 140 / 0.18)" />
          <rect x={-2} y={-8} width={4} height={10} fill={C.trunk} />
          <path d="M0,-44 L13,-18 L6,-18 L16,-6 L-16,-6 L-6,-18 L-13,-18 Z" fill={v > 0.5 ? C.pine : "oklch(52% 0.10 155)"} />
        </g>
      );
    case "bush":
      return (
        <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)})`}>
          <circle cx={-7} cy={-5} r={7} fill={C.leafDark} />
          <circle cx={6} cy={-5} r={7} fill={C.leafDark} />
          <circle cx={0} cy={-9} r={8} fill={C.leaf} />
          {v > 0.6 && <><circle cx={-4} cy={-10} r={1.6} fill="oklch(60% 0.2 25)" /><circle cx={5} cy={-7} r={1.6} fill="oklch(60% 0.2 25)" /></>}
        </g>
      );
    case "flower": {
      const petal = v < 0.33 ? "oklch(92% 0.02 90)" : v < 0.66 ? "oklch(80% 0.13 350)" : "oklch(85% 0.15 90)";
      return (
        <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
          <line x1={0} y1={0} x2={0} y2={-5} stroke={C.leafDark} strokeWidth={1} />
          <circle cx={-2} cy={-6} r={2} fill={petal} /><circle cx={2} cy={-6} r={2} fill={petal} />
          <circle cx={0} cy={-8} r={2} fill={petal} /><circle cx={0} cy={-4} r={2} fill={petal} />
          <circle cx={0} cy={-6} r={1.3} fill="oklch(75% 0.15 75)" />
        </g>
      );
    }
    case "tuft":
      return (
        <path d={`M${x - 4},${y} q2,-6 2,-8 M${x},${y} q0,-7 1,-10 M${x + 4},${y} q-1,-5 -3,-7`}
          fill="none" stroke="oklch(60% 0.10 140)" strokeWidth={1.3} strokeLinecap="round" />
      );
    case "rock":
      return <ellipse cx={x} cy={y} rx={6 * s} ry={4 * s} fill={C.rock} stroke="oklch(62% 0.015 80)" strokeWidth={1} />;
  }
}

function Scenery({ L, W, decor }: { L: Layout; W: number; decor: Decor[] }) {
  const { pond, river, bridge, mountain, camp } = L.scene;
  const d = L.dims;
  const H = L.height;

  // Soft lighter patches of grass
  const rand = seeded(W + 3);
  const patches = Array.from({ length: Math.round(H / 260) }, () => ({
    x: rand() * W, y: rand() * H, rx: 60 + rand() * 120, ry: 30 + rand() * 50,
  }));

  // River banks with a gentle wave
  const wave = (off: number, amp: number, phase: number) => {
    const pts: string[] = [];
    for (let x = -20; x <= W + 20; x += 20) pts.push(`${x},${(river.y + off + Math.sin(x / 55 + phase) * amp).toFixed(1)}`);
    return pts;
  };
  const top = wave(-river.half, 4, 0), bottom = wave(river.half, 4, 1.3);
  const riverPath = `M${top.join(" L")} L${bottom.reverse().join(" L")} Z`;

  // Mountain
  const { peak, baseY, leftX, rightX } = mountain;
  const mh = baseY - peak.y;
  const mountainPath = [
    `M${leftX - 30},${baseY + 30}`,
    `L${leftX + (peak.x - leftX) * 0.4},${peak.y + mh * 0.55}`,
    `L${leftX + (peak.x - leftX) * 0.55},${peak.y + mh * 0.5}`,
    `L${peak.x - 20},${peak.y + 22}`,
    `L${peak.x},${peak.y}`,
    `L${peak.x + 24},${peak.y + 28}`,
    `L${peak.x + (rightX - peak.x) * 0.5},${peak.y + mh * 0.45}`,
    `L${peak.x + (rightX - peak.x) * 0.62},${peak.y + mh * 0.52}`,
    `L${rightX + 30},${baseY + 30} Z`,
  ].join(" ");
  const shadePath = `M${peak.x},${peak.y} L${peak.x + 24},${peak.y + 28} L${peak.x + (rightX - peak.x) * 0.5},${peak.y + mh * 0.45} L${peak.x + (rightX - peak.x) * 0.62},${peak.y + mh * 0.52} L${rightX + 30},${baseY + 30} L${peak.x + 10},${baseY + 30} Z`;
  const capH = Math.min(46, mh * 0.22);
  const capW = capH * 1.15;
  const snowPath = `M${peak.x},${peak.y} L${peak.x + capW},${peak.y + capH} L${peak.x + capW * 0.5},${peak.y + capH * 0.75} L${peak.x + capW * 0.15},${peak.y + capH * 1.05} L${peak.x - capW * 0.3},${peak.y + capH * 0.7} L${peak.x - capW * 0.75},${peak.y + capH * 0.95} Z`;

  // A distant hill behind the mountain for depth
  const hillPath = `M${leftX - 60},${baseY + 30} Q${(leftX + peak.x) / 2 - 40},${peak.y + mh * 0.25} ${peak.x - 40},${peak.y + mh * 0.6} T${rightX + 60},${baseY + 30} Z`;

  const summitFlag = { x: peak.x + d.sw / 2 + 6, y: peak.y + d.sh / 2 + 18 };
  const last = L.stones[L.stones.length - 1];
  const finishX = last ? Math.min(W - 24, last.x + d.sw / 2 + 12) : W / 2;
  const finishY = last ? last.y + 10 : 0;

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
      <rect x={0} y={0} width={W} height={H} fill={C.meadow} />
      {patches.map((p, i) => <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill={C.patch} />)}

      {/* Mountain */}
      <path d={hillPath} fill="oklch(80% 0.04 150)" />
      <path d={mountainPath} fill={C.mountain} />
      <path d={shadePath} fill={C.mountainShade} />
      <path d={snowPath} fill={C.snow} />

      {/* River */}
      <path d={riverPath} fill={C.water} />
      <path d={`M${wave(-river.half * 0.2, 3, 2).join(" L")}`} fill="none" stroke={C.waterLight} strokeWidth={2} strokeDasharray="14 22" strokeLinecap="round" className="park-water" />
      <path d={`M${wave(river.half * 0.45, 3, 4).join(" L")}`} fill="none" stroke={C.waterLight} strokeWidth={1.5} strokeDasharray="8 30" strokeLinecap="round" opacity={0.7} className="park-water" />

      {/* Pond with reeds, lily pads and ducks */}
      <ellipse cx={pond.cx} cy={pond.cy + 3} rx={pond.rx + 6} ry={pond.ry + 6} fill="oklch(80% 0.06 140)" />
      <ellipse cx={pond.cx} cy={pond.cy} rx={pond.rx} ry={pond.ry} fill={C.water} />
      <ellipse cx={pond.cx - pond.rx * 0.25} cy={pond.cy - pond.ry * 0.35} rx={pond.rx * 0.45} ry={pond.ry * 0.22} fill={C.waterLight} opacity={0.6} />
      <g fill="oklch(62% 0.13 145)">
        <path d={`M${pond.cx + pond.rx * 0.35},${pond.cy + pond.ry * 0.4} a9,6 0 1,0 0.1,0 Z`} />
        <path d={`M${pond.cx - pond.rx * 0.5},${pond.cy + pond.ry * 0.2} a7,5 0 1,0 0.1,0 Z`} />
      </g>
      <circle cx={pond.cx + pond.rx * 0.35 + 3} cy={pond.cy + pond.ry * 0.4 - 4} r={2.5} fill="oklch(85% 0.1 350)" />
      {[0, 1].map(k => {
        const dx = pond.cx + (k ? -pond.rx * 0.1 : pond.rx * 0.2), dy = pond.cy + (k ? pond.ry * 0.05 : -pond.ry * 0.15);
        return (
          <g key={k} className="park-duck" style={{ animationDelay: `${k * 1.4}s` }}>
            <g transform={`translate(${dx},${dy}) scale(${k ? -1 : 1},1)`}>
              <ellipse cx={0} cy={0} rx={9} ry={5.5} fill="white" />
              <circle cx={7} cy={-6} r={4} fill={k ? "white" : "oklch(50% 0.12 150)"} />
              <path d="M10,-6 l5,1.5 l-5,1.5 Z" fill={orange} />
              <circle cx={8} cy={-7} r={0.9} fill={navy} />
            </g>
          </g>
        );
      })}
      {Array.from({ length: 7 }, (_, i) => {
        const a = Math.PI * (0.62 + i * 0.07);
        const rx = pond.cx + Math.cos(a) * pond.rx, ry = pond.cy + Math.sin(a) * pond.ry;
        return (
          <g key={i}>
            <line x1={rx} y1={ry} x2={rx + (i % 2 ? 2 : -2)} y2={ry - 16 - (i % 3) * 5} stroke="oklch(55% 0.10 140)" strokeWidth={1.6} strokeLinecap="round" />
            {i % 2 === 0 && <rect x={rx + (i % 2 ? 1 : -3) - 1.5} y={ry - 20 - (i % 3) * 5} width={3} height={7} rx={1.5} fill={C.woodDark} />}
          </g>
        );
      })}

      {/* Trail */}
      <path d={polyline(L.trail)} fill="none" stroke={C.trailEdge} strokeWidth={d.mobile ? 30 : 34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={polyline(L.trail)} fill="none" stroke={C.trail} strokeWidth={d.mobile ? 24 : 28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={polyline(L.trail)} fill="none" stroke="oklch(78% 0.04 70)" strokeWidth={1.5} strokeDasharray="1 11" strokeLinecap="round" />

      {/* Bridge */}
      <g transform={`translate(${bridge.x.toFixed(1)},${bridge.y.toFixed(1)}) rotate(${bridge.angle.toFixed(1)})`}>
        <rect x={-bridge.len / 2} y={-19} width={bridge.len} height={38} rx={4} fill={C.wood} stroke={C.woodDark} strokeWidth={1.5} />
        {Array.from({ length: Math.floor(bridge.len / 9) }, (_, i) => (
          <line key={i} x1={-bridge.len / 2 + 6 + i * 9} y1={-17} x2={-bridge.len / 2 + 6 + i * 9} y2={17} stroke={C.woodDark} strokeWidth={1} opacity={0.6} />
        ))}
        <rect x={-bridge.len / 2 - 2} y={-23} width={bridge.len + 4} height={5} rx={2.5} fill={C.woodDark} />
        <rect x={-bridge.len / 2 - 2} y={18} width={bridge.len + 4} height={5} rx={2.5} fill={C.woodDark} />
        {[-0.5, 0, 0.5].map(f => (
          <g key={f}>
            <rect x={f * bridge.len - 3} y={-26} width={6} height={9} rx={1.5} fill={C.trunk} />
            <rect x={f * bridge.len - 3} y={17} width={6} height={9} rx={1.5} fill={C.trunk} />
          </g>
        ))}
      </g>

      {/* Trees, bushes, flowers */}
      {decor.map((dd, i) => <DecorItem key={i} d={dd} />)}

      {/* Campfire and tent */}
      <g transform={`translate(${camp.x.toFixed(1)},${camp.y.toFixed(1)})`}>
        <path d="M18,6 L42,-30 L66,6 Z" fill={orange} />
        <path d="M42,-30 L66,6 L52,6 Z" fill="oklch(56% 0.14 45)" />
        <path d="M42,-30 L36,6 L48,6 Z" fill={navy} />
        <line x1={42} y1={-30} x2={42} y2={-36} stroke={C.woodDark} strokeWidth={2} />
        <circle cx={-8} cy={2} r={14} fill="oklch(70% 0.02 70)" opacity={0.5} />
        <line x1={-18} y1={4} x2={2} y2={-2} stroke={C.woodDark} strokeWidth={4} strokeLinecap="round" />
        <line x1={-18} y1={-2} x2={2} y2={4} stroke={C.trunk} strokeWidth={4} strokeLinecap="round" />
        <g className="park-fire">
          <path d="M-8,-2 C-16,-10 -10,-18 -8,-26 C-6,-18 2,-12 -8,-2 Z" fill="oklch(70% 0.18 50)" />
          <path d="M-8,-3 C-12,-8 -9,-13 -8,-17 C-6,-12 -4,-8 -8,-3 Z" fill="oklch(88% 0.15 90)" />
        </g>
        <circle cx={-26} cy={4} r={4} fill={C.rock} />
        <circle cx={8} cy={8} r={3.5} fill={C.rock} />
      </g>

      {/* Summit flag */}
      <g transform={`translate(${summitFlag.x.toFixed(1)},${summitFlag.y.toFixed(1)})`}>
        <line x1={0} y1={0} x2={0} y2={-40} stroke={C.woodDark} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M1,-40 L24,-33 L1,-26 Z" fill={orange} className="park-flag" />
      </g>

      {/* Finish flag */}
      {last && (
        <g transform={`translate(${finishX.toFixed(1)},${finishY.toFixed(1)})`}>
          <line x1={0} y1={0} x2={0} y2={-46} stroke={navy} strokeWidth={2.5} strokeLinecap="round" />
          <g className="park-flag">
            <rect x={1} y={-46} width={24} height={16} fill="white" stroke={navy} strokeWidth={1} />
            {[0, 1, 2, 3].map(c => [0, 1].map(r => (c + r) % 2 === 0 && (
              <rect key={`${c}${r}`} x={1 + c * 6} y={-46 + r * 8} width={6} height={8} fill={navy} />
            )))}
          </g>
        </g>
      )}

      {/* A few birds */}
      {[{ x: W * 0.72, y: 60 }, { x: W * 0.8, y: 80 }, { x: W * 0.25, y: mountain.peak.y - 40 }].map((b, i) => (
        <g key={i} className="park-bird" style={{ animationDelay: `${i * 0.9}s` }}>
          <path d={`M${b.x - 7},${b.y} q4,-5 7,0 q3,-5 7,0`} fill="none" stroke="oklch(35% 0.03 260)" strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ))}

    </svg>
  );
}

export default function StonePath({
  steps,
  completed,
  nextStep,
  lang,
}: {
  steps: PathStep[];
  completed: number[];
  nextStep: number | null;
  lang: "en" | "id";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const startsKey = steps.map(s => (s.chapterStart ? 1 : 0)).join("");
  const layout = useMemo(
    () => (width === null ? null : computeLayout(width, startsKey.split("").map(c => c === "1"))),
    [width, startsKey],
  );
  const decor = useMemo(() => (layout && width !== null ? scatterDecor(layout, width) : []), [layout, width]);

  const done = new Set(completed);
  const isId = lang === "id";

  return (
    <div ref={ref} style={{
      position: "relative", width: "100%",
      height: layout ? layout.height : 800,
      borderRadius: 2, overflow: "hidden",
      background: C.meadow,
    }}>
      <style>{`
        @keyframes stoneGlow { 0%,100% { filter: drop-shadow(0 0 6px oklch(65% 0.15 45 / 0.55)); } 50% { filter: drop-shadow(0 0 16px oklch(65% 0.15 45 / 0.9)); } }
        @keyframes parkBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes parkDrift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(18px,-6px); } }
        @keyframes parkFlicker { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.85); } }
        @keyframes parkWave { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -72; } }
        @keyframes parkFlap { 0%,100% { transform: skewY(0deg); } 50% { transform: skewY(-6deg); } }
        .park-duck { animation: parkBob 3s ease-in-out infinite; }
        .park-bird { animation: parkDrift 7s ease-in-out infinite; }
        .park-fire { animation: parkFlicker 0.9s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom; }
        .park-water { animation: parkWave 6s linear infinite; }
        .park-flag { animation: parkFlap 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: left; }
        .journey-stone { transition: transform 160ms ease-out; }
        .journey-stone:hover, .journey-stone:focus-visible { transform: translate(-50%, -50%) translateY(-3px) !important; }
        .journey-stone:focus-visible { outline: 2px solid ${orange}; outline-offset: 4px; border-radius: 40%; }
        @media (prefers-reduced-motion: reduce) {
          .journey-stone-next svg, .park-duck, .park-bird, .park-fire, .park-water, .park-flag { animation: none !important; }
        }
      `}</style>

      {layout && width !== null && (
        <>
          <Scenery L={layout} W={width} decor={decor} />

          {steps.map((s, i) => {
            const p = layout.stones[i];
            if (!p) return null;
            const { sw, sh, lw, signW, mobile } = layout.dims;
            const sign = layout.signs[i];
            const isDone = done.has(s.n);
            const isNext = s.n === nextStep;
            const rand = seeded(s.n + 900);
            const light = 68 + rand() * 8;
            const hue = 55 + rand() * 25;
            const rot = (seeded(s.n + 500)() - 0.5) * 22;
            const fill = isDone
              ? `oklch(${58 + rand() * 6}% 0.12 150)`
              : `oklch(${light}% ${0.018 + rand() * 0.015} ${hue})`;
            const edge = isDone ? "oklch(42% 0.10 150)" : `oklch(${light - 18}% 0.025 ${hue})`;
            const gradId = `sg${s.n}`;
            const label = `${isId ? "Langkah" : "Step"} ${s.n}: ${s.title}${isDone ? (isId ? " (selesai)" : " (done)") : isNext ? (isId ? " (berikutnya)" : " (next)") : ""}`;

            return (
              <div key={s.n}>
                {sign && s.chapter && (
                  <div aria-hidden style={{
                    position: "absolute",
                    left: sign.x,
                    top: sign.y,
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}>
                    <div style={{
                      background: "oklch(46% 0.06 55)",
                      color: "oklch(97% 0.01 80)",
                      fontFamily: "var(--font-montserrat)", fontWeight: 700,
                      fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "0.3rem 0.55rem",
                      borderRadius: "3px",
                      maxWidth: signW,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      boxShadow: "0 2px 0 oklch(36% 0.05 55)",
                      transform: `rotate(${(rand() - 0.5) * 5}deg)`,
                    }}>
                      {s.chapter}
                    </div>
                    <div style={{ width: 4, height: 16, background: "oklch(40% 0.05 55)", marginLeft: 14 }} />
                  </div>
                )}

                <Link
                  href={`/journey/step/${s.n}`}
                  aria-label={label}
                  title={label}
                  className={`journey-stone${isNext ? " journey-stone-next" : ""}`}
                  style={{
                    position: "absolute",
                    left: p.x, top: p.y,
                    width: sw, height: sh,
                    transform: "translate(-50%, -50%)",
                    textDecoration: "none",
                    zIndex: isNext ? 3 : 2,
                  }}
                >
                  <svg
                    width={sw} height={sh}
                    viewBox={`0 0 ${sw} ${sh}`}
                    style={{
                      position: "absolute", inset: 0, overflow: "visible",
                      transform: `rotate(${rot}deg)`,
                      animation: isNext ? "stoneGlow 2.4s ease-in-out infinite" : undefined,
                      filter: isNext ? undefined : "drop-shadow(0 3px 2px oklch(40% 0.03 60 / 0.35))",
                    }}
                  >
                    <defs>
                      <radialGradient id={gradId} cx="35%" cy="30%" r="80%">
                        <stop offset="0%" stopColor="white" stopOpacity={0.28} />
                        <stop offset="60%" stopColor="white" stopOpacity={0} />
                        <stop offset="100%" stopColor="black" stopOpacity={0.12} />
                      </radialGradient>
                    </defs>
                    <path d={stonePath(s.n, sw, sh)} fill={fill} stroke={isNext ? orange : edge} strokeWidth={isNext ? 3 : 1.5} />
                    <path d={stonePath(s.n, sw, sh)} fill={`url(#${gradId})`} />
                  </svg>

                  <span style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-montserrat)", fontWeight: 800,
                    fontSize: mobile ? "1.3rem" : "1.25rem",
                    color: isDone ? "white" : navy,
                    textShadow: isDone ? "0 1px 2px oklch(30% 0.08 150 / 0.6)" : "0 1px 0 oklch(90% 0.01 70 / 0.6)",
                  }}>
                    {isDone ? `${s.n} ✓` : s.n}
                  </span>

                  <span style={{
                    position: "absolute",
                    top: sh + 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: lw,
                    display: "flex", justifyContent: "center",
                  }}>
                    <span style={{
                      textAlign: "center",
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: isNext ? 700 : 600,
                      fontSize: "0.68rem",
                      lineHeight: 1.3,
                      color: isNext ? navy : "oklch(35% 0.02 260)",
                      background: "oklch(97% 0.005 80 / 0.85)",
                      borderRadius: 6,
                      padding: "1px 6px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {s.title}
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
