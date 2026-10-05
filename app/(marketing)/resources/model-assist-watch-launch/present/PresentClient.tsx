"use client";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { PHONE_PORTRAIT_QUERY, PresentRotateNotice, enterPresentFullscreen, usePresentPhone } from "@/components/PresentPhone";
import { useLanguage } from "@/lib/LanguageContext";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const navy = "oklch(22% 0.10 260)";
const ink = "oklch(14% 0.05 260)";
const offWhite = "oklch(96% 0.005 80)";
const orange = "oklch(65% 0.15 45)";
const lightGray = "oklch(88% 0.008 80)";
const muted = "oklch(48% 0.04 260)";

const SLUG = "model-assist-watch-launch";
const IMG = `/images/resources/${SLUG}`;
const serif = "var(--font-cormorant)";
const sans = "var(--font-montserrat)";

// Slides are designed on a fixed 16:9 canvas and scaled to fit the screen,
// so they look the same on a laptop, a projector or a TV.
const W = 1600;
const H = 900;
const MIN_WIDTH = 768;
const IDLE_MS = 2500;

type PhaseKey = "model" | "assist" | "watch" | "launch";
const PHASES: { k: PhaseKey; en: string; id: string; mottoEn: string; mottoId: string; w: number; h: number; altEn: string; altId: string; you: number; them: number }[] = [
  { k: "model", en: "Model", id: "Teladani", mottoEn: "I do, you watch", mottoId: "Saya melakukan, Anda mengamati", w: 752, h: 564,
    altEn: "A learner watches the leader ride a scooter.", altId: "Seorang pelajar mengamati pemimpin mengendarai skuter.", you: 95, them: 10 },
  { k: "assist", en: "Assist", id: "Bantu", mottoEn: "You do, I help", mottoId: "Anda melakukan, saya membantu", w: 602, h: 452,
    altEn: "The leader walks beside the learner on a scooter.", altId: "Pemimpin berjalan di samping pelajar di atas skuter.", you: 70, them: 40 },
  { k: "watch", en: "Watch", id: "Amati", mottoEn: "You do, I watch", mottoId: "Anda melakukan, saya mengamati", w: 624, h: 468,
    altEn: "The leader stands with arms folded as the learner rides past.", altId: "Pemimpin berdiri dengan tangan terlipat saat pelajar melaju.", you: 35, them: 75 },
  { k: "launch", en: "Launch", id: "Mandirikan", mottoEn: "You do, I pray", mottoId: "Anda melakukan, saya berdoa", w: 656, h: 492,
    altEn: "The learner rides away on a big motorbike while the leader waves.", altId: "Pelajar melaju dengan motor besar sementara pemimpin melambaikan tangan.", you: 5, them: 100 },
];

const RIDERS = [
  { src: "cut-you", w: 334, h: 400, scale: 0.72, en: "You", id: "Anda", subEn: "Paul", subId: "Paulus" },
  { src: "cut-scooter", w: 282, h: 334, scale: 0.84, en: "Ana", id: "Ana", subEn: "Timothy", subId: "Timotius" },
  { src: "cut-bigbike", w: 436, h: 418, scale: 1, en: "Joel", id: "Joel", subEn: "Reliable people", subId: "Orang yang dapat dipercaya" },
];

const phaseLabel = (k: PhaseKey, lang: Lang) => {
  const ph = PHASES.find(x => x.k === k)!;
  return t(ph.en, ph.id, lang);
};
const phaseTone = (k: PhaseKey) => {
  const i = PHASES.findIndex(x => x.k === k);
  return i === 3 ? orange : `oklch(${22 + i * 12}% 0.10 260)`;
};

// ─── Slide building blocks (fixed px on the 1600×900 canvas) ─────────────────
const bigTitle: React.CSSProperties = {
  fontFamily: serif, fontWeight: 600, color: navy, lineHeight: 1.04, margin: 0, fontSize: 116, textAlign: "center",
};
const midTitle: React.CSSProperties = { ...bigTitle, fontSize: 76 };
const kicker: React.CSSProperties = {
  fontFamily: sans, fontSize: 20, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, margin: 0, textAlign: "center",
};
// Drawings with a white background use mixBlendMode "multiply" so the white takes on the slide colour
const fit = (maxW: number, maxH: number): React.CSSProperties => ({
  display: "block", maxWidth: maxW, maxHeight: maxH, width: "auto", height: "auto", objectFit: "contain",
});

function RiderRow({ lang, labels, height }: { lang: Lang; labels: boolean; height: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 72 }}>
      {RIDERS.map(r => (
        <div key={r.src} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={`${IMG}/${r.src}.webp`} alt="" aria-hidden="true" width={r.w} height={r.h}
            style={{ height: height * r.scale, width: "auto", display: "block" }} />
          {labels && (
            <>
              <p style={{ fontFamily: sans, fontSize: 30, fontWeight: 700, color: navy, margin: "18px 0 4px" }}>{t(r.en, r.id, lang)}</p>
              <p style={{ fontFamily: sans, fontSize: 20, color: muted, margin: 0 }}>{t(r.subEn, r.subId, lang)}</p>
            </>
          )}
        </div>
      ))}
      {labels && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
            {[0.5, 0.62, 0.74, 0.62].map((s, i) => (
              <img key={i} src={`${IMG}/cut-bigbike.webp`} alt="" width={436} height={418}
                style={{ height: height * s, width: "auto", display: "block", opacity: 0.5 + i * 0.12 }} />
            ))}
          </div>
          <p style={{ fontFamily: sans, fontSize: 30, fontWeight: 700, color: navy, margin: "18px 0 4px" }}>{t("And beyond", "Dan seterusnya", lang)}</p>
          <p style={{ fontFamily: sans, fontSize: 20, color: muted, margin: 0 }}>{t("Others", "Orang lain", lang)}</p>
        </div>
      )}
    </div>
  );
}

function ShiftBars({ lang }: { lang: Lang }) {
  const barH = 340;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 220px)", gap: 48, alignItems: "end", justifyContent: "center" }}>
        {PHASES.map(ph => (
          <div key={ph.k} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: barH }}>
              <div style={{ width: 64, height: `${ph.you}%`, minHeight: 8, background: navy, borderRadius: "10px 10px 0 0" }} />
              <div style={{ width: 64, height: `${ph.them}%`, minHeight: 8, background: orange, borderRadius: "10px 10px 0 0" }} />
            </div>
            <div style={{ width: "100%", height: 2, background: lightGray }} />
            <p style={{ fontFamily: sans, fontSize: 26, fontWeight: 700, color: navy, margin: "18px 0 0" }}>{t(ph.en, ph.id, lang)}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 36 }}>
        {[{ c: navy, en: "You", id: "Anda" }, { c: orange, en: "Them", id: "Mereka" }].map(l => (
          <span key={l.en} style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: sans, fontSize: 22, fontWeight: 600, color: muted }}>
            <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 6, background: l.c }} />
            {t(l.en, l.id, lang)}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Multiplication through generations (2 Timothy 2:1-2) ────────────────────
// Shown as five slides: the verse and question, then one more generation
// highlighted on each click.
type Seg = [string, number]; // text, generation (0 = plain)
const VERSE: Record<Lang, Seg[]> = {
  en: [
    ["\u201cYou then, ", 0], ["my son", 2], [", be strong in the grace that is in Christ Jesus. And the things you have heard ", 0],
    ["me", 1], [" say in the presence of many witnesses entrust to ", 0], ["reliable people", 3],
    [" who will also be qualified to teach ", 0], ["others", 4], [".\u201d", 0],
  ],
  id: [
    ["\u201cSebab itu, ", 0], ["hai anakku", 2], [", jadilah kuat oleh kasih karunia dalam Kristus Yesus. Apa yang telah engkau dengar ", 0],
    ["dari padaku", 1], [" di depan banyak saksi, percayakanlah itu kepada ", 0], ["orang-orang yang dapat dipercayai", 3],
    [", yang juga cakap mengajar ", 0], ["orang lain", 4], [".\u201d", 0],
  ],
};
const GENS = [
  { en: "Paul", id: "Paulus" },
  { en: "Timothy", id: "Timotius" },
  { en: "Reliable people", id: "Orang yang dapat dipercaya" },
  { en: "Others", id: "Orang lain" },
];

function GenerationsSlide({ lang, step }: { lang: Lang; step: number }) {
  return (
    <div style={{ width: 1320, display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
      <p style={kicker}>{t("Multiplication through generations", "Pelipatgandaan lintas generasi", lang)}</p>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: serif, fontSize: 50, fontStyle: "italic", lineHeight: 1.45, color: navy, margin: "0 0 18px" }}>
          {VERSE[lang].map(([text, g], i) => {
            const on = g > 0 && g <= step;
            return (
              <span key={i} style={on ? {
                background: g === step ? orange : "oklch(90% 0.06 55)", color: g === step ? "white" : navy,
                borderRadius: 10, padding: "0 10px", fontStyle: "normal", fontWeight: 600,
                boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone",
              } : undefined}>{text}</span>
            );
          })}
        </p>
        <p style={{ fontFamily: sans, fontSize: 22, fontWeight: 700, color: orange, margin: 0 }}>{t("2 Timothy 2:1-2 (NIV)", "2 Timotius 2:1-2 (TB)", lang)}</p>
      </div>
      {step === 0 ? (
        <p style={{ fontFamily: sans, fontSize: 40, fontWeight: 700, color: navy, margin: 0, textAlign: "center" }}>
          {t("Can you identify four generations?", "Dapatkah Anda menemukan empat generasi?", lang)}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 280px)", gap: 24 }}>
          {GENS.map((g, i) => {
            const n = i + 1, shown = n <= step, current = n === step;
            return (
              <div key={g.en} style={{
                height: 118, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: current ? orange : shown ? "white" : "transparent",
                border: `2px ${shown ? "solid" : "dashed"} ${current ? orange : shown ? lightGray : "oklch(80% 0.01 260)"}`,
              }}>
                {shown && (
                  <>
                    <span style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: current ? "white" : orange }}>
                      {t(`Generation ${n}`, `Generasi ${n}`, lang)}
                    </span>
                    <span style={{ fontFamily: sans, fontSize: 23, fontWeight: 700, lineHeight: 1.2, textAlign: "center", padding: "0 14px", color: current ? "white" : navy, marginTop: 6 }}>{t(g.en, g.id, lang)}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Multiplication counter ───────────────────────────────────────────────────
// Addition (you train one leader a year) against multiplication (every leader
// trains one a year). A live slider, same numbers as the module. Clicks, taps and
// arrow keys on the slider stay on the slider and don't change slides.
function CounterSlide({ lang }: { lang: Lang }) {
  const [years, setYears] = useState(3);
  const add = years + 1;
  const mult = Math.pow(2, years);
  const fmt = (n: number) => n.toLocaleString(lang === "id" ? "id-ID" : "en-US");
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const row = (n: number, color: string, label: string) => (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontFamily: sans, fontSize: 28, fontWeight: 700, color: navy }}>{label}</span>
        <span style={{ fontFamily: serif, fontSize: 104, fontWeight: 600, color, lineHeight: 0.9 }}>{fmt(n)}</span>
      </div>
      <div style={{ height: 32, background: lightGray, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(1.5, (n / 1024) * 100)}%`, height: "100%", background: color, borderRadius: 16, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
  return (
    <div style={{ width: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      <style>{`
        .mawl-yrs { -webkit-appearance: none; appearance: none; width: 100%; height: 14px; border-radius: 7px; background: ${lightGray}; outline: none; cursor: pointer; margin: 0; }
        .mawl-yrs::-webkit-slider-thumb { -webkit-appearance: none; width: 52px; height: 52px; border-radius: 50%; background: ${orange}; border: 6px solid white; box-shadow: 0 2px 10px oklch(0% 0 0 / 0.25); }
        .mawl-yrs::-moz-range-thumb { width: 40px; height: 40px; border-radius: 50%; background: ${orange}; border: 6px solid white; box-shadow: 0 2px 10px oklch(0% 0 0 / 0.25); }
        .mawl-yrs:focus-visible { outline: 3px solid ${orange}; outline-offset: 10px; }
      `}</style>
      <p style={kicker}>{t("The multiplication counter", "Penghitung pelipatgandaan", lang)}</p>
      <div onClick={stop} onTouchStart={stop} onTouchEnd={stop} style={{ width: "100%", padding: "8px 0" }}>
        <label htmlFor="mawl-present-years" style={{ display: "block", textAlign: "center", fontFamily: serif, fontSize: 64, fontWeight: 600, color: navy, marginBottom: 22 }}>
          {t("After ", "Setelah ", lang)}<span style={{ color: orange }}>{years}</span>{t(years === 1 ? " year" : " years", " tahun", lang)}
        </label>
        <input id="mawl-present-years" type="range" min={1} max={10} step={1} value={years} className="mawl-yrs"
          onChange={e => setYears(Number(e.target.value))}
          aria-valuetext={t(`${years} years`, `${years} tahun`, lang)} />
      </div>
      {row(add, navy, t("Addition: you train one leader a year", "Penambahan: Anda melatih satu pemimpin setiap tahun", lang))}
      {row(mult, orange, t("Multiplication: every leader trains one a year", "Pelipatgandaan: setiap pemimpin melatih satu orang setiap tahun", lang))}
    </div>
  );
}

// ─── The slides ───────────────────────────────────────────────────────────────
// ─── Where the cycle breaks: the healthy cycle first, then on the next click it turns into the broken one
type BreakKey = "skip-assist" | "stuck-assist" | "stuck-watch" | "missing-piece" | "one-generation";
const BREAKS: { k: BreakKey; en: string; id: string; lineEn: string[]; lineId: string[]; whyEn: string; whyId: string }[] = [
  { k: "skip-assist", en: "Skipping Assist", id: "Melewatkan tahap Bantu",
    lineEn: ["Straight from showing to watching.", "No practice with you beside them."],
    lineId: ["Langsung dari memberi teladan ke mengamati.", "Tanpa latihan dengan Anda di samping mereka."],
    whyEn: "It feels efficient. You assume they understood because they nodded.",
    whyId: "Rasanya efisien. Anda mengira mereka sudah paham karena mereka mengangguk." },
  { k: "stuck-assist", en: "Staying in Assist too long", id: "Terlalu lama di tahap Bantu",
    lineEn: ["You keep helping.", "They never get to try alone."],
    lineId: ["Anda terus membantu.", "Mereka tidak pernah mencoba sendiri."],
    whyEn: "Stepping back feels risky, and fixing it yourself is faster.",
    whyId: "Mundur terasa berisiko, dan memperbaikinya sendiri lebih cepat." },
  { k: "stuck-watch", en: "Never leaving Watch", id: "Tidak pernah keluar dari tahap Amati",
    lineEn: ["You keep checking.", "The day they lead alone never comes."],
    lineId: ["Anda terus memeriksa.", "Hari mereka memimpin sendiri tidak pernah tiba."],
    whyEn: "Being needed feels good.",
    whyId: "Dibutuhkan itu terasa menyenangkan." },
  { k: "missing-piece", en: "Launching without the whole skill set", id: "Memandirikan tanpa seluruh keterampilan",
    lineEn: ["They lead on their own.", "But one piece of the skill is missing."],
    lineId: ["Mereka memimpin sendiri.", "Tetapi satu bagian keterampilan belum ada."],
    whyEn: "You checked the skills you could see and missed the ones that only appear under pressure.",
    whyId: "Anda memeriksa keterampilan yang terlihat dan melewatkan yang baru muncul saat ada tekanan." },
  { k: "one-generation", en: "Stopping at one generation", id: "Berhenti di satu generasi",
    lineEn: ["They can lead.", "They never start the cycle with someone else."],
    lineId: ["Mereka mampu memimpin.", "Mereka tidak pernah memulai siklus dengan orang lain."],
    whyEn: "Passing on the cycle was never part of the goal.",
    whyId: "Meneruskan siklus ini memang tidak pernah menjadi bagian dari tujuan." },
];
const NODE_POS: Record<PhaseKey, { x: number; y: number }> = {
  model: { x: 200, y: 70 }, assist: { x: 330, y: 200 }, watch: { x: 200, y: 330 }, launch: { x: 70, y: 200 },
};
const NODE_STROKE: Record<PhaseKey, { dash?: string; opacity: number }> = {
  model: { opacity: 1 }, assist: { opacity: 0.85 }, watch: { dash: "8 6", opacity: 0.6 }, launch: { dash: "3 7", opacity: 0.45 },
};
const FADE = 0.18;
const MORPH = "opacity 0.7s ease, transform 0.7s ease";
// Point on a circle, angle in degrees (0 = right, 90 = down)
const pt = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
};
// A ring-shaped slice between two radii and two angles: the "missing piece"
const ringSlice = (cx: number, cy: number, r1: number, r2: number, a1: number, a2: number) =>
  `M ${pt(cx, cy, r1, a1)} L ${pt(cx, cy, r2, a1)} A ${r2} ${r2} 0 0 1 ${pt(cx, cy, r2, a2)} L ${pt(cx, cy, r1, a2)} A ${r1} ${r1} 0 0 0 ${pt(cx, cy, r1, a1)} Z`;

function BreakCycle({ variant, broken, lang }: { variant: BreakKey; broken: boolean; lang: Lang }) {
  const mk = `mawl-brk-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const arrow = `url(#${mk})`;
  const v = broken ? variant : null;
  // Arcs and circles the learner never reaches fade out
  const fadeArc = {
    ma: v === "skip-assist" ? FADE : 1,
    aw: v === "skip-assist" || v === "stuck-assist" ? FADE : 1,
    wl: v === "stuck-assist" ? FADE : 1,
    nc: v === "stuck-assist" || v === "stuck-watch" ? FADE : 1,
  };
  const fadeNode: Record<PhaseKey, number> = {
    model: 1,
    assist: v === "skip-assist" ? 0.25 : 1,
    watch: v === "stuck-assist" ? 0.25 : 1,
    launch: v === "stuck-assist" || v === "stuck-watch" ? 0.25 : 1,
  };
  const on = (k: BreakKey) => ({ opacity: v === k ? 1 : 0, transition: MORPH });
  const L = NODE_POS.launch;
  return (
    <svg viewBox="-20 -20 440 440" width={640} height={640} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <defs>
        <marker id={mk} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={orange} />
        </marker>
      </defs>

      <path d="M 257 83.2 A 130 130 0 0 1 316.8 143" fill="none" stroke={orange} strokeWidth={3} markerEnd={arrow} style={{ opacity: fadeArc.ma, transition: MORPH }} />
      <path d="M 316.8 257 A 130 130 0 0 1 257 316.8" fill="none" stroke={orange} strokeWidth={3} markerEnd={arrow} style={{ opacity: fadeArc.aw, transition: MORPH }} />
      {/* Watch to Launch: whole arrow, or stopped short at a barrier */}
      <path d="M 143 316.8 A 130 130 0 0 1 83.2 257" fill="none" stroke={orange} strokeWidth={3} markerEnd={arrow}
        style={{ opacity: v === "stuck-watch" ? 0 : fadeArc.wl, transition: MORPH }} />
      <g style={on("stuck-watch")}>
        <path d="M 143 316.8 A 130 130 0 0 1 116.4 299.6" fill="none" stroke={orange} strokeWidth={3} />
        <path d={`M ${pt(200, 200, 106, 138)} L ${pt(200, 200, 154, 138)}`} stroke={navy} strokeWidth={8} strokeLinecap="round" />
        <path d="M 108 290 A 130 130 0 0 1 83.2 257" fill="none" stroke={orange} strokeWidth={3} opacity={FADE} />
      </g>
      {/* Launch back to Model: whole arrow, or cut off */}
      <path d="M 83.2 143 A 130 130 0 0 1 143 83.2" fill="none" stroke={orange} strokeWidth={3} strokeDasharray="6 5" markerEnd={arrow}
        style={{ opacity: v === "one-generation" ? 0 : fadeArc.nc, transition: MORPH }} />
      <g style={on("one-generation")}>
        <path d="M 83.2 143 A 130 130 0 0 1 100.9 115.6" fill="none" stroke={orange} strokeWidth={3} strokeDasharray="6 5" />
        <path d={`M ${pt(200, 200, 116, 220)} L ${pt(200, 200, 146, 226)}`} stroke={navy} strokeWidth={4} strokeLinecap="round" />
        <path d={`M ${pt(200, 200, 116, 226)} L ${pt(200, 200, 146, 232)}`} stroke={navy} strokeWidth={4} strokeLinecap="round" />
        <path d="M 122.8 95.4 A 130 130 0 0 1 143 83.2" fill="none" stroke={orange} strokeWidth={3} strokeDasharray="6 5" markerEnd={arrow} opacity={FADE} />
      </g>

      {/* Skipping Assist: one big jump from Model to Watch */}
      <path d="M 200 124 L 200 272" fill="none" stroke={orange} strokeWidth={9} strokeLinecap="round" markerEnd={arrow} style={on("skip-assist")} />
      {/* Stuck: the arrow keeps looping round the same circle */}
      <path d={`M ${pt(330, 200, 68, -150)} A 68 68 0 1 1 ${pt(330, 200, 68, 150)}`} fill="none" stroke={orange} strokeWidth={6} markerEnd={arrow} style={on("stuck-assist")} />
      <path d={`M ${pt(200, 330, 68, -60)} A 68 68 0 1 1 ${pt(200, 330, 68, -120)}`} fill="none" stroke={orange} strokeWidth={6} markerEnd={arrow} style={on("stuck-watch")} />

      {PHASES.map((ph, i) => {
        const { x, y } = NODE_POS[ph.k];
        const st = NODE_STROKE[ph.k];
        return (
          <g key={ph.k} style={{ opacity: fadeNode[ph.k], transition: MORPH }}>
            <circle cx={x} cy={y} r={48} fill="white" />
            <circle cx={x} cy={y} r={48} fill="none" stroke={navy} strokeWidth={3} strokeDasharray={st.dash} strokeOpacity={st.opacity} />
            <text x={x} y={y - 6} textAnchor="middle" fontSize={15} fontWeight={700} fill={muted}>{i + 1}</text>
            <text x={x} y={y + 15} textAnchor="middle" fontSize={15} fontWeight={700} fill={navy}>{t(ph.en, ph.id, lang)}</text>
          </g>
        );
      })}

      {/* Launching without the whole skill set: a piece of Launch falls out */}
      <g style={on("missing-piece")}>
        <path d={ringSlice(L.x, L.y, 26, 51, 200, 250)} fill={offWhite} stroke={navy} strokeWidth={1.5} strokeDasharray="4 4" />
      </g>
      <g style={{ ...on("missing-piece"), transform: v === "missing-piece" ? "translate(-30px, -32px)" : "translate(0px, 0px)" }}>
        <path d={ringSlice(L.x, L.y, 26, 51, 200, 250)} fill={orange} />
      </g>
    </svg>
  );
}

// Two ways to lead: img and text are the click step at which each part appears
const LEADS = [
  { k: "positional", en: "Positional leadership", id: "Kepemimpinan posisional",
    subEn: "The team works for the leader's goals.", subId: "Tim bekerja untuk tujuan pemimpin.", img: 0, text: 1 },
  { k: "influential", en: "Influential leadership", id: "Kepemimpinan yang berpengaruh",
    subEn: "The leader supports the team to reach shared goals.", subId: "Pemimpin menopang tim untuk mencapai tujuan bersama.", img: 2, text: 3 },
];
// Slides sharing a group stay mounted between clicks, so they can morph instead of fading
type Slide = { key: string; group?: string; render: (lang: Lang) => React.ReactNode };

// The full cycle image, shown once after the phases and again after the breaks
const cycleSlide = (key: string): Slide => ({
  key,
  render: lang => (
    <img src={`${IMG}/cycle-${lang}.webp`} width={1280} height={lang === "id" ? 984 : 986}
      alt={t("The cycle: Model, Assist, Watch, Launch, and then the new leader starts again with someone else.",
        "Siklusnya: Teladani, Bantu, Amati, Mandirikan, lalu pemimpin baru memulai lagi dengan orang lain.", lang)}
      style={{ ...fit(1100, 740), mixBlendMode: "multiply" }} />
  ),
});

const SLIDES: Slide[] = [
  {
    key: "title",
    render: lang => (
      <>
        <RiderRow lang={lang} labels={false} height={330} />
        <div style={{ width: 120, height: 4, background: orange, borderRadius: 2 }} />
        <h1 style={{ ...bigTitle, fontSize: 132 }}>{t("Multiplying leaders", "Melipatgandakan pemimpin", lang)}</h1>
        <p style={kicker}>{t("Model, Assist, Watch, Launch", "Teladani, Bantu, Amati, Mandirikan", lang)}</p>
      </>
    ),
  },
  // The word alone first, then the dictionary entry on the next click
  ...[0, 1].map((step): Slide => ({
    key: `empowerment-${step}`,
    group: "empowerment",
    render: lang => (
      <div style={{ width: 1100 }}>
        <h2 style={{ ...bigTitle, textAlign: "left", fontSize: 150, margin: 0 }}>{t("Empowerment", "Pemberdayaan", lang)}</h2>
        <div style={{ opacity: step, transition: "opacity 0.7s ease" }}>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 36, color: muted, margin: "6px 0 40px" }}>
            {t("em·pow·er·ment, noun", "pem·ber·da·ya·an, nomina", lang)}
          </p>
          <div style={{ width: 96, height: 4, background: orange, borderRadius: 2, marginBottom: 36 }} />
          {(lang === "id"
            ? ["1. Proses, cara, perbuatan memberdayakan.", "2. Dari kata berdaya: berkekuatan, berkemampuan, bertenaga."]
            : ["1. Giving someone the power or authority to do something.", "2. Giving someone more control over their own life."]
          ).map(d => (
            <p key={d} style={{ fontFamily: sans, fontSize: 36, fontWeight: 500, color: navy, margin: "0 0 20px", lineHeight: 1.35 }}>{d}</p>
          ))}
        </div>
      </div>
    ),
  })),
  {
    key: "definition",
    render: lang => (
      <div style={{ width: 1180 }}>
        <p style={{ ...kicker, textAlign: "left" }}>{t("Our definition", "Definisi kami", lang)}</p>
        <div style={{ width: 96, height: 4, background: orange, borderRadius: 2, margin: "28px 0 36px" }} />
        <p style={{ fontFamily: serif, fontWeight: 600, fontSize: 62, color: navy, margin: 0, lineHeight: 1.18 }}>
          {t("Empowerment is handing over real power, the skill, the confidence and the authority, step by step, until someone can continue without you and empower others too.",
            "Pemberdayaan adalah menyerahkan kuasa yang nyata, yaitu keterampilan, rasa percaya diri, dan wewenang, selangkah demi selangkah, sampai seseorang mampu melanjutkan tanpa Anda dan memberdayakan orang lain juga.", lang)}
        </p>
      </div>
    ),
  },
  // Both ways side by side, built up over four clicks: left image, left words, right image, right words
  ...[0, 1, 2, 3].map((step): Slide => ({
    key: `lead-${step}`,
    group: "lead",
    render: lang => (
      <>
        <p style={kicker}>{t("Two ways to lead", "Dua cara memimpin", lang)}</p>
        {/* One grid row each for images, titles and subtitles, so the two sides line up even when a title wraps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 80, rowGap: 14, width: "100%", justifyItems: "center" }}>
          {LEADS.map(d => (
            <img key={d.k} src={`${IMG}/lead-${d.k}.webp`} alt="" aria-hidden="true" width={1100} height={760}
              style={{ ...fit(640, 440), alignSelf: "center", marginBottom: 4, opacity: step >= d.img ? 1 : 0, transition: "opacity 0.7s ease" }} />
          ))}
          {LEADS.map(d => (
            <h2 key={d.k} style={{ ...midTitle, fontSize: 60, margin: 0, alignSelf: "end", opacity: step >= d.text ? 1 : 0, transition: "opacity 0.7s ease" }}>{t(d.en, d.id, lang)}</h2>
          ))}
          {LEADS.map(d => (
            <p key={d.k} style={{ fontFamily: sans, fontSize: 30, color: muted, margin: 0, textAlign: "center", alignSelf: "start", opacity: step >= d.text ? 1 : 0, transition: "opacity 0.7s ease" }}>{t(d.subEn, d.subId, lang)}</p>
          ))}
        </div>
      </>
    ),
  })),
  ...PHASES.map((ph, i): Slide => ({
    key: ph.k,
    render: lang => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 80, width: "100%" }}>
        <div>
          <p style={{ ...kicker, textAlign: "left" }}>{t(`Phase ${i + 1}`, `Tahap ${i + 1}`, lang)}</p>
          <h2 style={{ ...bigTitle, textAlign: "left", fontSize: t(ph.en, ph.id, lang).length > 7 ? 150 : 190, color: phaseTone(ph.k), margin: "8px 0 28px" }}>
            {t(ph.en, ph.id, lang)}
          </h2>
          <div style={{ width: 96, height: 4, background: orange, borderRadius: 2, marginBottom: 28 }} />
          <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 54, color: navy, margin: 0, lineHeight: 1.15 }}>
            {t(ph.mottoEn, ph.mottoId, lang)}
          </p>
        </div>
        <img src={`${IMG}/phase-${ph.k}.webp`} alt={t(ph.altEn, ph.altId, lang)} width={ph.w} height={ph.h}
          style={{ ...fit(680, 560), justifySelf: "center", width: "100%", mixBlendMode: "multiply" }} />
      </div>
    ),
  })),
  cycleSlide("cycle"),
  {
    key: "shift",
    render: lang => (
      <>
        <h2 style={midTitle}>{t("Less of you, more of them", "Makin sedikit Anda, makin banyak mereka", lang)}</h2>
        <ShiftBars lang={lang} />
      </>
    ),
  },
  {
    key: "spotlight",
    render: lang => (
      <>
        <img src={`${IMG}/spotlight.webp`} width={1400} height={760}
          alt={t("The learner rides a big motorbike under a spotlight while the leader stands in the shadows.",
            "Pelajar mengendarai motor besar di bawah sorotan sementara pemimpin berdiri dalam bayang-bayang.", lang)}
          style={{ ...fit(1100, 560), borderRadius: 24, boxShadow: "0 24px 60px oklch(14% 0.05 260 / 0.25)" }} />
        <h2 style={midTitle}>{t("Put them in the spotlight", "Tempatkan mereka di bawah sorotan", lang)}</h2>
      </>
    ),
  },
  // Two clicks per break: healthy cycle first, then it turns into the broken one with the reason.
  // The full cycle image comes back just before the last break.
  ...BREAKS.flatMap((b): Slide[] => [...(b.k === "one-generation" ? [cycleSlide("cycle-again")] : []), ...[0, 1].map((step): Slide => ({
    key: `break-${b.k}-${step}`,
    group: `break-${b.k}`,
    render: (lang: Lang) => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 640px", alignItems: "center", gap: 60, width: "100%" }}>
        <div>
          <p style={{ ...kicker, textAlign: "left" }}>{t("Where the cycle breaks", "Di mana siklus ini macet", lang)}</p>
          <h2 style={{ ...midTitle, textAlign: "left", fontSize: 72, margin: "14px 0 28px" }}>{t(b.en, b.id, lang)}</h2>
          <div style={{ width: 96, height: 4, background: orange, borderRadius: 2, marginBottom: 28 }} />
          {(lang === "id" ? b.lineId : b.lineEn).map(line => (
            <p key={line} style={{ fontFamily: sans, fontSize: 32, fontWeight: 500, color: navy, margin: "0 0 12px", lineHeight: 1.3 }}>{line}</p>
          ))}
          <div style={{ marginTop: 36, paddingLeft: 24, borderLeft: `4px solid ${orange}`, opacity: step ? 1 : 0, transition: "opacity 0.7s ease 0.3s" }}>
            <p style={{ ...kicker, textAlign: "left", margin: "0 0 8px" }}>{t("Why it happens", "Mengapa terjadi", lang)}</p>
            <p style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, color: navy, margin: 0, lineHeight: 1.25 }}>{t(b.whyEn, b.whyId, lang)}</p>
          </div>
        </div>
        <BreakCycle variant={b.k} broken={step === 1} lang={lang} />
      </div>
    ),
  }))]),
  ...[0, 1, 2, 3, 4].map(step => ({
    key: `generations-${step}`,
    render: (lang: Lang) => <GenerationsSlide lang={lang} step={step} />,
  })),
  { key: "counter", render: lang => <CounterSlide lang={lang} /> },
  {
    key: "start",
    render: lang => (
      <>
        <img src={`${IMG}/cut-scooter.webp`} alt="" aria-hidden="true" width={282} height={334} style={fit(500, 420)} />
        <h2 style={{ ...bigTitle, fontSize: 96 }}>{t("Who will you start with?", "Dengan siapa Anda akan mulai?", lang)}</h2>
      </>
    ),
  },
];

// One slide on the 1600×900 canvas, with a quiet footer
function SlideFrame({ index, lang }: { index: number; lang: Lang }) {
  const s = SLIDES[index];
  const isTitle = index === 0;
  return (
    <div style={{ width: W, height: H, position: "relative", background: offWhite, overflow: "hidden", fontFamily: sans }}>
      {isTitle && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 38%, oklch(99% 0.01 60) 0%, transparent 60%)" }} />
      )}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: orange }} />
      <div style={{ position: "absolute", inset: "64px 120px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {s.render(lang)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: muted, letterSpacing: "0.04em" }}>
            <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
            {t("Model, Assist, Watch, Launch", "Teladani, Bantu, Amati, Mandirikan", lang)}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: muted }}>{index + 1} / {SLIDES.length}</span>
        </div>
      )}
      {isTitle && (
        <img src="/logo-icon.png" alt="Crispy Development" width={40} height={40} style={{ position: "absolute", right: 56, bottom: 44, display: "block" }} />
      )}
    </div>
  );
}

// ─── Player ───────────────────────────────────────────────────────────────────
export default function PresentClient() {
  const { lang: ctxLang, setLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;
  const [i, setI] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const phone = usePresentPhone(setIsFull);
  const [uiVisible, setUiVisible] = useState(true);
  const [overview, setOverview] = useState(false);
  const [blank, setBlank] = useState(false);
  const [started, setStarted] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const [scale, setScale] = useState(0.5);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);
  const last = SLIDES.length - 1;

  const go = useCallback((n: number) => { setBlank(false); setI(Math.max(0, Math.min(last, n))); }, [last]);
  const next = useCallback(() => { setBlank(false); setI(n => Math.min(last, n + 1)); }, [last]);
  const prev = useCallback(() => { setBlank(false); setI(n => Math.max(0, n - 1)); }, []);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else enterPresentFullscreen(rootRef.current);
  }, []);

  const wake = useCallback(() => {
    setUiVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
  }, []);

  // Fit the 16:9 canvas into whatever space the screen gives us
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tooSmall]);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_PORTRAIT_QUERY);
    const upd = () => setTooSmall(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      // Let a focused button handle its own Space press
      if (k === " " && (e.target as HTMLElement)?.closest?.("button, a")) return;
      // Arrow keys on the counter slider move the slider, not the slides
      if ((e.target as HTMLElement)?.matches?.("input[type=range]") && k.startsWith("Arrow")) return;
      if (overview) {
        if (k === "Escape" || k === "g" || k === "G") { e.preventDefault(); setOverview(false); }
        return;
      }
      setStarted(true);
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "n", "N"].includes(k)) { e.preventDefault(); next(); }
      else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace", "p", "P"].includes(k)) { e.preventDefault(); prev(); }
      else if (k === "Home") { e.preventDefault(); go(0); }
      else if (k === "End") { e.preventDefault(); go(last); }
      else if (k === "f" || k === "F") { e.preventDefault(); toggleFull(); }
      else if (k === "g" || k === "G") { e.preventDefault(); setOverview(true); }
      else if (k === "b" || k === "B" || k === ".") { e.preventDefault(); setBlank(b => !b); }
      else if (k === "l" || k === "L") { e.preventDefault(); setLang(lang === "en" ? "id" : "en"); }
      else if (k === "Escape") setBlank(false);
      wake();
    };
    const onFull = () => setIsFull(!!document.fullscreenElement);
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFull);
    };
  }, [overview, next, prev, go, last, toggleFull, wake, lang, setLang]);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [wake]);

  // Preload every slide image so clicking through never waits
  useEffect(() => {
    ["cut-you", "cut-scooter", "cut-bigbike", "spotlight", `cycle-${lang}`, ...PHASES.map(p => `phase-${p.k}`)]
      .forEach(s => { const im = new Image(); im.src = `${IMG}/${s}.webp`; });
  }, [lang]);

  // Stop the page behind from scrolling while presenting
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const moduleHref = `/resources/${SLUG}`;
  const showUi = uiVisible || !started || overview;

  if (tooSmall) return <PresentRotateNotice lang={lang} moduleHref={moduleHref} />;

  const pill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 44, height: 44, padding: "0 12px",
    background: "transparent", border: "none", borderRadius: 10, color: offWhite, cursor: "pointer", fontFamily: sans, fontWeight: 700, fontSize: 13,
  };
  const sep = <span aria-hidden="true" style={{ width: 1, height: 24, background: "oklch(100% 0 0 / 0.18)", margin: "0 4px" }} />;

  return (
    <div ref={rootRef} onMouseMove={wake}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; wake(); }}
      onTouchEnd={e => {
        if (touchX.current === null || overview) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) { setStarted(true); if (dx < 0) next(); else prev(); }
        touchX.current = null;
      }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: ink, fontFamily: sans, cursor: showUi ? "default" : "none", userSelect: "none" }}>
      <style>{`
        .mawl-fade { animation: mawlFade 0.45s ease; }
        @keyframes mawlFade { from { opacity: 0; } to { opacity: 1; } }
        .mawl-ui { transition: opacity 0.4s ease, transform 0.4s ease; }
        .mawl-pill:hover { background: oklch(100% 0 0 / 0.12) !important; }
        .mawl-pill:focus-visible, .mawl-thumb:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .mawl-thumb { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .mawl-thumb:hover { transform: translateY(-3px); }
        @media (prefers-reduced-motion: reduce) { .mawl-fade { animation: none; } .mawl-ui, .mawl-thumb { transition: none; } }
      `}</style>

      {/* Stage: the scaled slide, click right side for next, left side for back */}
      <div ref={stageRef}
        onClick={e => {
          if (overview) return;
          setStarted(true);
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          if (e.clientX - r.left < r.width * 0.3) prev(); else next();
        }}
        style={{ position: "absolute", inset: isFull || phone ? 0 : 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-live="polite" aria-roledescription="slide" aria-label={`${i + 1} / ${SLIDES.length}`}
          style={{ width: W * scale, height: H * scale, position: "relative", boxShadow: isFull ? "none" : "0 30px 80px oklch(0% 0 0 / 0.45)", borderRadius: isFull ? 0 : 6, overflow: "hidden" }}>
          <div key={`${SLIDES[i].group ?? i}-${lang}`} className="mawl-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="mawl-ui" style={{ position: "absolute", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
          {!isFull && (
            <button type="button" onClick={() => { setStarted(true); toggleFull(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 24px", borderRadius: 999, border: "none", background: orange, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px oklch(0% 0 0 / 0.35)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              {t("Start full screen", "Mulai layar penuh", lang)}
            </button>
          )}
          <span style={{ fontSize: 13, color: "oklch(85% 0.02 80)", background: "oklch(15% 0.04 260 / 0.88)", padding: "8px 14px", borderRadius: 999 }}>
            {(phone ? t("Swipe or tap the sides to move.", "Geser atau ketuk sisi layar untuk pindah.", lang) : t("Arrow keys or clicker to move. F full screen. G all slides.", "Tombol panah atau clicker untuk pindah. F layar penuh. G semua slide.", lang))}
          </span>
        </div>
      )}

      {/* Control bar */}
      <div className="mawl-ui" role="toolbar" aria-label={t("Presentation controls", "Kontrol presentasi", lang)}
        style={{ position: "absolute", left: "50%", bottom: 28, transform: `translateX(-50%) translateY(${showUi ? 0 : 16}px)`, opacity: showUi ? 1 : 0, pointerEvents: showUi ? "auto" : "none",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="mawl-pill" style={{ ...pill, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => { setStarted(true); prev(); }}
          aria-label={t("Previous slide", "Slide sebelumnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: offWhite, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {SLIDES.length}</span>
        <button type="button" className="mawl-pill" style={{ ...pill, opacity: i === last ? 0.35 : 1 }} disabled={i === last} onClick={() => { setStarted(true); next(); }}
          aria-label={t("Next slide", "Slide berikutnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {sep}
        <button type="button" className="mawl-pill" style={pill} onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={t("All slides", "Semua slide", lang)} title={t("All slides (G)", "Semua slide (G)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={t("Language", "Bahasa", lang)} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="mawl-pill" aria-pressed={lang === l} onClick={() => setLang(l)}
              style={{ ...pill, height: 40, minWidth: 44, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="mawl-pill" style={pill} onClick={toggleFull}
          aria-label={isFull ? t("Exit full screen", "Keluar dari layar penuh", lang) : t("Full screen", "Layar penuh", lang)}
          title={isFull ? t("Exit full screen (F)", "Keluar dari layar penuh (F)", lang) : t("Full screen (F)", "Layar penuh (F)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        {sep}
        <Link href={moduleHref} className="mawl-pill" style={{ ...pill, textDecoration: "none", gap: 6 }} aria-label={t("Close presentation", "Tutup presentasi", lang)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          {t("Close", "Tutup", lang)}
        </Link>
      </div>

      {/* Progress line */}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "oklch(100% 0 0 / 0.06)" }}>
        <div style={{ height: "100%", width: `${((i + 1) / SLIDES.length) * 100}%`, background: orange, transition: "width 0.4s ease" }} />
      </div>

      {/* Overview: every slide as a thumbnail, click to jump */}
      {overview && (
        <div role="dialog" aria-label={t("All slides", "Semua slide", lang)}
          style={{ position: "absolute", inset: 0, background: "oklch(12% 0.04 260 / 0.97)", overflowY: "auto", padding: "56px 48px 120px" }}>
          <p style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: offWhite, textAlign: "center", margin: "0 0 32px" }}>
            {t("All slides", "Semua slide", lang)}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, maxWidth: 1280, margin: "0 auto" }}>
            {SLIDES.map((s, n) => (
              <button key={s.key} type="button" className="mawl-thumb" onClick={() => { go(n); setOverview(false); setStarted(true); }}
                aria-label={`${n + 1}`} aria-current={n === i}
                style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                <Thumb index={n} lang={lang} active={n === i} />
                <span style={{ display: "block", marginTop: 8, fontSize: 13, fontWeight: 700, color: n === i ? orange : "oklch(80% 0.02 80)" }}>{n + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Thumb({ index, lang, active }: { index: number; lang: Lang; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.17);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setS(el.clientWidth / W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: "100%", aspectRatio: "16 / 9", position: "relative", overflow: "hidden", borderRadius: 8,
      outline: active ? `3px solid ${orange}` : "1px solid oklch(100% 0 0 / 0.12)", outlineOffset: active ? 2 : 0 }}>
      <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "top left", pointerEvents: "none" }}>
        <SlideFrame index={index} lang={lang} />
      </div>
    </div>
  );
}
