"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const navy   = "oklch(22% 0.10 260)";
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

function trailPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
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

  const done = new Set(completed);
  const isId = lang === "id";

  const mobile = (width ?? 1000) < 640;
  const cols = mobile ? 2 : (width ?? 1000) < 900 ? 4 : 5;
  const stoneW = mobile ? 116 : 104;
  const stoneH = mobile ? 86 : 78;
  const rowH = mobile ? 178 : 184;
  const topPad = 70;

  const positions = steps.map((s, i) => {
    const rand = seeded(s.n + 500);
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
    const W = width ?? 1000;
    const colW = W / cols;
    const wander = Math.sin(row * 1.7 + colInRow * 0.6) * colW * 0.12;
    let x = colW * (col + 0.5) + (rand() - 0.5) * colW * 0.28 + wander;
    x = Math.max(stoneW / 2 + 6, Math.min(W - stoneW / 2 - 6, x));
    const y = topPad + row * rowH + stoneH / 2 + (rand() - 0.5) * 22 + Math.sin(i * 0.9) * 10;
    const rot = (rand() - 0.5) * 22;
    return { x, y, rot };
  });

  const rows = Math.ceil(steps.length / cols);
  const height = topPad + rows * rowH + 20;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: width === null ? 800 : height }}>
      <style>{`
        @keyframes stoneGlow { 0%,100% { filter: drop-shadow(0 0 6px oklch(65% 0.15 45 / 0.55)); } 50% { filter: drop-shadow(0 0 16px oklch(65% 0.15 45 / 0.9)); } }
        .journey-stone { transition: transform 160ms ease-out; }
        .journey-stone:hover, .journey-stone:focus-visible { transform: translate(-50%, -50%) translateY(-3px) !important; }
        .journey-stone:focus-visible { outline: 2px solid ${orange}; outline-offset: 4px; border-radius: 40%; }
        @media (prefers-reduced-motion: reduce) { .journey-stone-next svg { animation: none !important; } }
      `}</style>

      {width !== null && (
        <>
          {/* The trail the stones sit on */}
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
            <path d={trailPath(positions)} fill="none" stroke="oklch(80% 0.03 70)" strokeWidth={mobile ? 26 : 30} strokeLinecap="round" opacity={0.35} />
            <path d={trailPath(positions)} fill="none" stroke="oklch(72% 0.03 70)" strokeWidth={1.5} strokeDasharray="2 7" strokeLinecap="round" />
          </svg>

          {steps.map((s, i) => {
            const p = positions[i];
            const isDone = done.has(s.n);
            const isNext = s.n === nextStep;
            const rand = seeded(s.n + 900);
            const light = 68 + rand() * 8;
            const hue = 55 + rand() * 25;
            const fill = isDone
              ? `oklch(${58 + rand() * 6}% 0.12 150)`
              : `oklch(${light}% ${0.018 + rand() * 0.015} ${hue})`;
            const edge = isDone ? "oklch(42% 0.10 150)" : `oklch(${light - 18}% 0.025 ${hue})`;
            const gradId = `sg${s.n}`;
            const label = `${isId ? "Langkah" : "Step"} ${s.n}: ${s.title}${isDone ? (isId ? " (selesai)" : " (done)") : isNext ? (isId ? " (berikutnya)" : " (next)") : ""}`;

            return (
              <div key={s.n}>
                {s.chapterStart && s.chapter && (
                  <div aria-hidden style={{
                    position: "absolute",
                    left: Math.max(4, Math.min(width - (mobile ? 150 : 170) - 4, p.x - stoneW / 2 - 10)),
                    top: p.y - stoneH / 2 - 52,
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    pointerEvents: "none",
                  }}>
                    <div style={{
                      background: "oklch(46% 0.06 55)",
                      color: "oklch(97% 0.01 80)",
                      fontFamily: "var(--font-montserrat)", fontWeight: 700,
                      fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "0.3rem 0.55rem",
                      borderRadius: "3px",
                      maxWidth: mobile ? 150 : 170,
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
                    width: stoneW, height: stoneH,
                    transform: "translate(-50%, -50%)",
                    textDecoration: "none",
                    zIndex: isNext ? 3 : 2,
                  }}
                >
                  <svg
                    width={stoneW} height={stoneH}
                    viewBox={`0 0 ${stoneW} ${stoneH}`}
                    style={{
                      position: "absolute", inset: 0, overflow: "visible",
                      transform: `rotate(${p.rot}deg)`,
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
                    <path d={stonePath(s.n, stoneW, stoneH)} fill={fill} stroke={isNext ? orange : edge} strokeWidth={isNext ? 3 : 1.5} />
                    <path d={stonePath(s.n, stoneW, stoneH)} fill={`url(#${gradId})`} />
                  </svg>

                  <span style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-montserrat)", fontWeight: 800,
                    fontSize: mobile ? "1.35rem" : "1.25rem",
                    color: isDone ? "white" : navy,
                    textShadow: isDone ? "0 1px 2px oklch(30% 0.08 150 / 0.6)" : "0 1px 0 oklch(90% 0.01 70 / 0.6)",
                  }}>
                    {isDone ? `${s.n} ✓` : s.n}
                  </span>

                  <span style={{
                    position: "absolute",
                    top: stoneH + 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: mobile ? 150 : 150,
                    textAlign: "center",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: isNext ? 700 : 600,
                    fontSize: "0.68rem",
                    lineHeight: 1.3,
                    color: isNext ? navy : "oklch(40% 0.02 260)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {s.title}
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
