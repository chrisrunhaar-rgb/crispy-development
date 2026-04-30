"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "id" | "nl";

export const GIFT_CATEGORIES = [
  {
    key: "serving" as const,
    gifts: ["melayani", "murah_hati", "keramahan", "memberi"],
    maxScore: 48,
    color: "oklch(62% 0.18 12)",
    trackColor: "oklch(93% 0.05 12)",
    label: { en: "Serving", id: "Melayani", nl: "Dienst" },
    startDeg: -88,
    endDeg: -2,
  },
  {
    key: "speaking" as const,
    gifts: ["mengajar", "menguatkan", "hikmat", "pengetahuan"],
    maxScore: 48,
    color: "oklch(38% 0.18 255)",
    trackColor: "oklch(90% 0.05 255)",
    label: { en: "Speaking", id: "Berbicara", nl: "Spreken" },
    startDeg: 2,
    endDeg: 88,
  },
  {
    key: "manifestation" as const,
    gifts: ["bahasa_roh", "menyembuhkan", "mukjizat", "bernubuat", "tafsir_bahasa_roh", "iman"],
    maxScore: 72,
    color: "oklch(68% 0.17 78)",
    trackColor: "oklch(94% 0.05 78)",
    label: { en: "Manifestation", id: "Manifestasi", nl: "Manifestatie" },
    startDeg: 92,
    endDeg: 178,
  },
  {
    key: "leading" as const,
    gifts: ["kerasulan", "penginjilan", "gembala", "memimpin", "administrasi"],
    maxScore: 60,
    color: "oklch(42% 0.22 305)",
    trackColor: "oklch(91% 0.05 305)",
    label: { en: "Leading", id: "Memimpin", nl: "Leidinggeven" },
    startDeg: 182,
    endDeg: 268,
  },
] as const;

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  if (Math.abs(endDeg - startDeg) < 0.5) return "";
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

interface KaruniaRingProps {
  scores?: Record<string, number>;
  illustrative?: boolean;
  lang?: Lang;
  size?: number;
  showLegend?: boolean;
}

export function KaruniaRing({
  scores,
  illustrative = false,
  lang = "en",
  size = 240,
  showLegend = true,
}: KaruniaRingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = Math.max(size * 0.115, 10);
  const r = cx - strokeWidth / 2 - 2;

  const categoryData = GIFT_CATEGORIES.map(cat => {
    const pct = illustrative
      ? 1.0
      : scores
      ? Math.min(1, cat.gifts.reduce((sum, g) => sum + (scores[g] ?? 0), 0) / cat.maxScore)
      : 0;
    const spanDeg = cat.endDeg - cat.startDeg;
    const fillEnd = cat.startDeg + pct * spanDeg;
    return { ...cat, pct, fillEnd };
  });

  const topCat = illustrative
    ? null
    : [...categoryData].sort((a, b) => b.pct - a.pct)[0];

  const centerFontSize = size * 0.088;
  const subFontSize = size * 0.052;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.875rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "scale(0.95)",
        transition: "opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={
          lang === "id"
            ? "Distribusi karunia rohani berdasarkan kategori"
            : lang === "nl"
            ? "Verdeling geestelijke gaven per categorie"
            : "Spiritual gifts distribution by category"
        }
      >
        {/* Track arcs */}
        {categoryData.map(cat => (
          <path
            key={`track-${cat.key}`}
            d={arcPath(cx, cy, r, cat.startDeg, cat.endDeg)}
            fill="none"
            stroke={cat.trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}

        {/* Fill arcs */}
        {categoryData.map(cat => {
          if (cat.pct < 0.015) return null;
          return (
            <path
              key={`fill-${cat.key}`}
              d={arcPath(cx, cy, r, cat.startDeg, cat.fillEnd)}
              fill="none"
              stroke={cat.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })}

        {/* Illustrative center: simple cross */}
        {illustrative && (
          <g opacity={0.45}>
            <line
              x1={cx - size * 0.055}
              y1={cy}
              x2={cx + size * 0.055}
              y2={cy}
              stroke="oklch(30% 0.12 260)"
              strokeWidth={size * 0.018}
              strokeLinecap="round"
            />
            <line
              x1={cx}
              y1={cy - size * 0.065}
              x2={cx}
              y2={cy + size * 0.065}
              stroke="oklch(30% 0.12 260)"
              strokeWidth={size * 0.018}
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Data center: top category name */}
        {!illustrative && topCat && topCat.pct > 0 && (
          <>
            <text
              x={cx}
              y={cy - subFontSize * 0.2}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
                fontSize: `${centerFontSize}px`,
                fontWeight: 800,
                fill: topCat.color,
              }}
            >
              {topCat.label[lang]}
            </text>
            <text
              x={cx}
              y={cy + centerFontSize * 0.72}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
                fontSize: `${subFontSize}px`,
                fontWeight: 600,
                fill: "oklch(58% 0.008 260)",
                letterSpacing: "0.07em",
              }}
            >
              {lang === "id" ? "TERKUAT" : lang === "nl" ? "STERKST" : "STRONGEST"}
            </text>
          </>
        )}
      </svg>

      {showLegend && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem 0.875rem",
            justifyContent: "center",
            maxWidth: `${size + 40}px`,
          }}
        >
          {categoryData.map(cat => (
            <div key={cat.key} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: cat.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "oklch(38% 0.008 260)",
                }}
              >
                {cat.label[lang]}
              </span>
              {!illustrative && (
                <span
                  style={{
                    fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
                    fontSize: "0.62rem",
                    color: "oklch(60% 0.008 260)",
                  }}
                >
                  {Math.round(cat.pct * 100)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
