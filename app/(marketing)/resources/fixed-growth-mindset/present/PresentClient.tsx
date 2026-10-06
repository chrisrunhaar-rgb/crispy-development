"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { PHONE_PORTRAIT_QUERY, PresentRotateNotice, enterPresentFullscreen, usePresentPhone } from "@/components/PresentPhone";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResume, takeResume } from "@/lib/present-resume";

// ── Types ──────────────────────────────────────────────────────────────────
type Lang = "en" | "id";
type Pair = { en: string; id: string };
type Slide = { key: string; dark?: boolean; steps?: number; render: (lang: Lang, step: number) => React.ReactNode };

// ── Brand tokens ───────────────────────────────────────────────────────────
const NAVY = "oklch(22% 0.10 260)";
const INK = "oklch(14% 0.05 260)";
const OFF_WHITE = "oklch(96% 0.005 80)";
const ORANGE = "oklch(65% 0.15 45)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const MUTED = "oklch(48% 0.04 260)";
const ON_NAVY = "oklch(82% 0.025 80)";
const GROWTH = "oklch(40% 0.14 145)";
const FIXED = "oklch(42% 0.16 25)";
const SERIF = "var(--font-cormorant)";
const SANS = "var(--font-montserrat)";

const W = 1600;
const H = 900;
const IDLE_MS = 2500;
const MIN_WIDTH = 768;

const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

const MODULE_HREF = "/resources/fixed-growth-mindset";
const IMG = "/images/resources/fixed-growth-mindset/hero.jpg";
const ICON_GROWTH = "/images/resources/fixed-growth-mindset/icon-growth.svg";
const ICON_FIXED = "/images/resources/fixed-growth-mindset/icon-fixed.svg";
const MODULE_TITLE: Pair = { en: "Fixed vs Growth Mindset", id: "Pola Pikir Tetap vs. Bertumbuh" };

// ── Content, lifted from the module itself ────────────────────────────────

const DIMENSIONS: { label: Pair; meaning: Pair; growth: Pair; fixed: Pair }[] = [
  {
    label: { en: "Challenges", id: "Tantangan" },
    meaning: { en: "How you respond when something new or hard is asked of you.", id: "Cara Anda merespons ketika diminta melakukan sesuatu yang baru atau sulit." },
    growth: { en: "Takes on challenges to keep growing and keeps learning from them.", id: "Menerima tantangan untuk terus bertumbuh dan terus belajar darinya." },
    fixed: { en: "Avoids challenges so they never look like a failure.", id: "Menghindari tantangan agar tidak pernah terlihat gagal." },
  },
  {
    label: { en: "Skills", id: "Keterampilan" },
    meaning: { en: "What you believe about where ability comes from, and whether it can grow.", id: "Apa yang Anda yakini tentang asal kemampuan, dan apakah kemampuan itu bisa bertumbuh." },
    growth: { en: "Believes skills grow with practice, so keeps practising.", id: "Percaya keterampilan tumbuh lewat latihan, jadi terus berlatih." },
    fixed: { en: "Believes you either have the talent or you don't.", id: "Percaya bahwa bakat itu ada atau tidak ada." },
  },
  {
    label: { en: "Obstacles", id: "Hambatan" },
    meaning: { en: "What you do when the road gets blocked or the plan falls apart.", id: "Apa yang Anda lakukan ketika jalan terhalang atau rencana berantakan." },
    growth: { en: "Treats obstacles as part of the road and looks for a way through.", id: "Melihat hambatan sebagai bagian dari perjalanan dan mencari jalan keluarnya." },
    fixed: { en: "Stops at the first obstacle.", id: "Berhenti di hambatan pertama." },
  },
  {
    label: { en: "Success of Others", id: "Keberhasilan Orang Lain" },
    meaning: { en: "How you feel and react when people around you do well.", id: "Apa yang Anda rasakan dan lakukan ketika orang di sekitar Anda berhasil." },
    growth: { en: "Is inspired by others' success and asks what they can learn from it.", id: "Terinspirasi oleh keberhasilan orang lain dan bertanya apa yang bisa dipelajari darinya." },
    fixed: { en: "Feels threatened when others succeed.", id: "Merasa terancam saat orang lain berhasil." },
  },
  {
    label: { en: "Effort", id: "Usaha" },
    meaning: { en: "What hard work means to you while results are still out of sight.", id: "Arti kerja keras bagi Anda ketika hasilnya belum terlihat." },
    growth: { en: "Sees effort as the path to mastery, even when results come slowly.", id: "Melihat usaha sebagai jalan menuju keahlian, meski hasilnya datang perlahan." },
    fixed: { en: "Sees effort as proof they're not good enough.", id: "Melihat usaha sebagai bukti bahwa dirinya tidak cukup baik." },
  },
];

// detail2, when present, sits on its own line under detail
const SHIFT_STEPS: { step: string; title: Pair; point: Pair; detail: Pair; detail2?: Pair }[] = [
  {
    step: "01",
    title: { en: "Name It", id: "Beri Nama" },
    point: { en: "Write down your current belief honestly.", id: "Tuliskan keyakinan Anda saat ini dengan jujur." },
    detail: { en: "What do you actually think, not what you know you should think?", id: "Apa yang sebenarnya Anda pikirkan, bukan apa yang Anda tahu seharusnya Anda pikirkan?" },
  },
  {
    step: "02",
    title: { en: "Spot the Pattern", id: "Kenali Polanya" },
    point: { en: "Is this a fixed or growth belief? Do not judge, just notice.", id: "Apakah ini keyakinan pola pikir tetap atau bertumbuh? Jangan menghakimi, cukup perhatikan." },
    detail: { en: "Fixed sounds like: always, never, too late.", id: "Pola pikir tetap terdengar seperti: selalu, tidak pernah, terlambat." },
    detail2: { en: "Growth sounds like: not yet, still figuring this out.", id: "Pola pikir bertumbuh terdengar seperti: belum, masih mencari tahu." },
  },
  {
    step: "03",
    title: { en: "Reframe It", id: "Ubah Sudut Pandang" },
    point: { en: "A reframe is not positive thinking. It is a more complete statement of reality.", id: "Mengubah sudut pandang bukan sekadar berpikir positif. Ini pernyataan yang lebih lengkap tentang realitas." },
    detail: { en: "“I failed at this” becomes “I haven't succeeded here yet.”", id: "“Saya gagal dalam hal ini” menjadi “Saya belum berhasil di sini.”" },
  },
];

// Phrases shown in bold orange on the takeaways slide.
const TAKEAWAY_HIGHLIGHTS: (Pair | undefined)[] = [
  { en: "Recognizing them is the work.", id: "Tugas Anda adalah mengenalinya." },
  undefined,
  { en: "faithfulness with what you have been given", id: "kesetiaan dengan apa yang telah diberikan kepada Anda" },
  undefined,
];

const TAKEAWAYS: Pair[] = [
  { en: "Fixed mindset patterns do not make you a poor leader. They make you a human one. Recognizing them is the work.", id: "Pola pikir tetap tidak membuat Anda pemimpin yang buruk. Itu tanda Anda manusia. Tugas Anda adalah mengenalinya." },
  { en: "Across cultures, failing in public can mean something different. Not knowing how others will see it makes us afraid. That fear is learned. It is not who you are.", id: "Di berbagai budaya, gagal di depan umum bisa punya arti yang berbeda. Tidak tahu bagaimana orang lain akan melihatnya membuat kita takut. Rasa takut itu dipelajari. Itu bukan diri Anda yang sebenarnya." },
  { en: "Growth mindset is not about ambition. It is about faithfulness with what you have been given, where you have been placed.", id: "Pola pikir bertumbuh bukan tentang ambisi. Ini tentang kesetiaan dengan apa yang telah diberikan kepada Anda, di tempat Anda ditempatkan." },
  { en: "The goal is not a perfect score. It is the honest question: where am I protecting myself when I could be growing?", id: "Tujuannya bukan skor sempurna. Ini adalah pertanyaan jujur: di mana saya melindungi diri saya sendiri ketika saya bisa bertumbuh?" },
];

const QUESTION: Pair = { en: "Where do you show a growth mindset, and where do you go fixed?", id: "Di mana Anda menunjukkan pola pikir bertumbuh, dan di mana Anda jatuh ke pola pikir tetap?" };

const AREAS: Pair[] = [
  { en: "Learning a new language or culture", id: "Belajar bahasa atau budaya baru" },
  { en: "Receiving feedback", id: "Menerima umpan balik" },
  { en: "Leading people who are different from you", id: "Memimpin orang yang berbeda dari Anda" },
  { en: "When a plan fails", id: "Ketika rencana gagal" },
  { en: "When a colleague does better than you", id: "Ketika rekan kerja lebih berhasil dari Anda" },
];

// ── Small helpers ──────────────────────────────────────────────────────────

// Name It = notebook + pen, Spot the Pattern = magnifying glass, Reframe It = turning arrows.
const STEP_ICON_PATHS: Record<string, string[]> = {
  "01": ["M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4", "M2 6h4", "M2 10h4", "M2 14h4", "M2 18h4", "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"],
  "02": ["M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16z", "M21 21l-4.3-4.3", "M8 11h6"],
  "03": ["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", "M8 16H3v5"],
};

function StepIcon({ step, size }: { step: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {STEP_ICON_PATHS[step].map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

// Growth / fixed mindset icons (navy circle, orange arrow, transparent background)
function MindsetIcon({ kind, size }: { kind: "growth" | "fixed"; size: number }) {
  return <img src={kind === "growth" ? ICON_GROWTH : ICON_FIXED} alt="" aria-hidden="true" width={size} height={size} style={{ display: "block" }} />;
}

// Small orange arrow linking the circles on the practice slide
function StepArrow({ on }: { on: boolean }) {
  return (
    <svg width="56" height="24" viewBox="0 0 56 24" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ ...show(on), flexShrink: 0 }}>
      <path d="M4 12h44" />
      <path d="M40 4l8 8-8 8" />
    </svg>
  );
}

// Renders `text` with the `hl` phrase in bold orange.
function Highlight({ text, hl }: { text: string; hl?: string }) {
  const at = hl ? text.indexOf(hl) : -1;
  if (!hl || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <strong style={{ fontWeight: 700, color: ORANGE }}>{hl}</strong>
      {text.slice(at + hl.length)}
    </>
  );
}

function show(on: boolean): React.CSSProperties {
  return { opacity: on ? 1 : 0, transform: on ? "none" : "translateY(14px)", transition: "opacity 0.5s ease, transform 0.5s ease" };
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color, margin: "0 0 18px" }}>
      {children}
    </p>
  );
}

function H2({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 56, lineHeight: 1.1, color: dark ? OFF_WHITE : NAVY, margin: "0 0 36px", maxWidth: 1180 }}>
      {children}
    </h2>
  );
}

function Point({ on, dark, children }: { on: boolean; dark?: boolean; children: React.ReactNode }) {
  return (
    <p style={{ ...show(on), fontFamily: SANS, fontSize: 30, lineHeight: 1.5, color: dark ? ON_NAVY : "oklch(30% 0.05 260)", margin: "0 0 22px", maxWidth: 1180 }}>
      {children}
    </p>
  );
}

// ── Slide deck ─────────────────────────────────────────────────────────────

const SLIDES: Slide[] = [
  {
    key: "title",
    dark: true,
    steps: 1,
    render: (lang) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Pengembangan Pribadi" : "Personal Development"}</Eyebrow>
        <h1 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 96, lineHeight: 1.05, color: OFF_WHITE, margin: "0 0 28px" }}>
          {lang === "id" ? "Pola Pikir Tetap vs. Bertumbuh" : "Fixed vs. Growth Mindset"}
        </h1>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: "oklch(72% 0.05 260)", maxWidth: 900, lineHeight: 1.5 }}>
          {lang === "id"
            ? "Berdasarkan kerangka kerja Carol Dweck, menunjukkan di mana pola pikir Anda tetap dan di mana pola pikir Anda bertumbuh, dalam lima dimensi utama."
            : "Drawing on Carol Dweck's framework, revealing where your mindset is fixed and where it's growing, across five key dimensions."}
        </p>
      </div>
    ),
  },
  {
    key: "two-mindsets",
    steps: 2,
    render: (lang, step) => (
      <div style={{ textAlign: "center" }}>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Penelitian" : "The Research"}</Eyebrow>
        <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 72, lineHeight: 1.05, color: NAVY, margin: "0 0 16px" }}>
          {lang === "id" ? "Dua Cara Melihat Kemampuan" : "Two Ways of Seeing Ability"}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 23, lineHeight: 1.5, color: MUTED, margin: "0 auto 34px", maxWidth: 1100 }}>
          {lang === "id"
            ? "Carol Dweck menemukan bahwa orang memegang salah satu dari dua keyakinan tentang kemampuan. Keyakinan itu membentuk cara mereka belajar, memimpin, dan menghadapi kegagalan."
            : "Carol Dweck found that people hold one of two beliefs about ability. That belief shapes how they learn, lead and handle failure."}
        </p>
        <div style={{ display: "flex", gap: 32 }}>
          {([
            { k: "fixed" as const, on: step >= 0, bg: "oklch(48% 0.18 25 / 0.08)", head: FIXED, ink: "oklch(32% 0.10 25)",
              name: { en: "Fixed Mindset", id: "Pola Pikir Tetap" },
              text: { en: "Believes ability is set from the start: you have it or you don't. Defines success as being right and not failing.", id: "Percaya kemampuan sudah ditetapkan sejak awal: Anda punya atau tidak. Menganggap berhasil berarti selalu benar dan tidak pernah gagal." } },
            { k: "growth" as const, on: step >= 1, bg: "oklch(46% 0.16 145 / 0.08)", head: GROWTH, ink: "oklch(30% 0.08 145)",
              name: { en: "Growth Mindset", id: "Pola Pikir Bertumbuh" },
              text: { en: "Believes ability can grow through effort, learning and good help. Defines success as gradual improvement.", id: "Percaya kemampuan bisa bertumbuh lewat usaha, belajar, dan bantuan yang tepat. Menganggap berhasil berarti terus membaik sedikit demi sedikit." } },
          ]).map((c) => (
            <div key={c.k} style={{ ...show(c.on), flex: 1, background: c.bg, borderRadius: 16, padding: "28px 40px 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 600, color: c.head }}>{c.name[lang]}</div>
              <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.5, color: c.ink, margin: "12px 0 0", maxWidth: 580 }}>{c.text[lang]}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 20 }}>
          {([{ k: "fixed" as const, on: step >= 0 }, { k: "growth" as const, on: step >= 1 }]).map((c) => (
            <div key={c.k} style={{ ...show(c.on), flex: 1, display: "flex", justifyContent: "center" }}>
              <MindsetIcon kind={c.k} size={200} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "dimensions-preview",
    steps: 5,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Lima Dimensi" : "Five Dimensions"}</Eyebrow>
        <H2>{lang === "id" ? "Di Mana Pola Pikir Muncul" : "Where Mindset Shows Up"}</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {DIMENSIONS.map((d, n) => (
            <div key={d.label.en} style={{ ...show(step >= n), display: "flex", alignItems: "baseline", gap: 20, padding: "14px 0", borderBottom: n < 4 ? `1px solid ${LIGHT_GRAY}` : "none" }}>
              <span style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: ORANGE, minWidth: 48 }}>{String(n + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: SANS, fontSize: 28, fontWeight: 600, color: NAVY, width: 400, flexShrink: 0 }}>{d.label[lang]}</span>
              <span style={{ fontFamily: SANS, fontSize: 24, lineHeight: 1.4, color: MUTED }}>{d.meaning[lang]}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "contrast",
    steps: 6,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Perbandingan" : "The Contrast"}</Eyebrow>
        <H2>{lang === "id" ? "Tetap vs Bertumbuh, Dimensi demi Dimensi" : "Fixed vs Growth, Dimension by Dimension"}</H2>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", gap: 0, marginTop: 8 }}>
          <div />
          <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: FIXED, padding: "0 20px 14px" }}>
            {lang === "id" ? "Tetap" : "Fixed"}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GROWTH, padding: "0 20px 14px" }}>
            {lang === "id" ? "Bertumbuh" : "Growth"}
          </div>
          {DIMENSIONS.map((d, n) => (
            <Fragment key={d.label.en}>
              <div style={{ padding: "16px 20px 16px 0", fontFamily: SANS, fontSize: 20, fontWeight: 700, color: NAVY, borderTop: `1px solid ${LIGHT_GRAY}` }}>
                {d.label[lang]}
              </div>
              <div style={{ padding: "16px 20px", background: "oklch(48% 0.18 25 / 0.06)", borderTop: `1px solid ${LIGHT_GRAY}` }}>
                <p style={{ ...show(step > n), margin: 0, fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: "oklch(32% 0.10 25)" }}>{d.fixed[lang]}</p>
              </div>
              <div style={{ padding: "16px 20px", background: "oklch(46% 0.16 145 / 0.06)", borderTop: `1px solid ${LIGHT_GRAY}` }}>
                <p style={{ ...show(step > n), margin: 0, fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: "oklch(30% 0.08 145)" }}>{d.growth[lang]}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "shift-intro",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Latihan" : "Practice"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Cara Mengubah Pola Pikir Anda" : "How to Shift Your Mindset"}</H2>
        <Point on={true} dark>
          {lang === "id" ? "Mengubah pola pikir bukan keputusan sekali jalan. Ini adalah latihan." : "Mindset change is not a one-time decision. It is a practice."}
        </Point>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginTop: 4 }}>
          {SHIFT_STEPS.map((s, n) => (
            <Fragment key={s.step}>
              {n > 0 && <StepArrow on={step >= n} />}
              <div style={{ ...show(step >= n), width: 320, height: 320, flexShrink: 0, borderRadius: "50%", background: "oklch(30% 0.08 260)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <StepIcon step={s.step} size={56} />
                <div style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, letterSpacing: "0.12em", color: ON_NAVY, margin: "18px 0 8px" }}>
                  {lang === "id" ? `LANGKAH ${s.step}` : `STEP ${s.step}`}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 600, color: OFF_WHITE, lineHeight: 1.1, maxWidth: 230 }}>{s.title[lang]}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    ),
  },
  ...SHIFT_STEPS.map((s): Slide => ({
    key: `shift-${s.step}`,
    steps: 2,
    render: (lang, step) => (
      <div style={{ display: "flex", gap: 72, alignItems: "center", height: "100%", paddingBottom: 40, boxSizing: "border-box" }}>
        <div style={{ flex: 1 }}>
          <Eyebrow color={ORANGE}>{lang === "id" ? `Langkah ${s.step}` : `Step ${s.step}`}</Eyebrow>
          <H2>{s.title[lang]}</H2>
          <Point on={step >= 0}>{s.point[lang]}</Point>
          <Point on={step >= 1}>
            {s.detail[lang]}
            {s.detail2 && <><br />{s.detail2[lang]}</>}
          </Point>
        </div>
        <div style={{ flexShrink: 0, width: 280, height: 280, borderRadius: "50%", background: "oklch(65% 0.15 45 / 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <StepIcon step={s.step} size={140} />
        </div>
      </div>
    ),
  })),
  {
    key: "takeaways",
    steps: 4,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Poin Utama" : "Key Takeaways"}</Eyebrow>
        <H2>{lang === "id" ? "Yang Perlu Dibawa" : "What to Carry Forward"}</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAKEAWAYS.map((t, n) => (
            <div key={n} style={{ ...show(step >= n), display: "flex", gap: 28, alignItems: "flex-start", padding: "12px 0" }}>
              <span style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: ORANGE, lineHeight: 1, minWidth: 56 }}>{String(n + 1).padStart(2, "0")}</span>
              <p style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.45, color: "oklch(30% 0.05 260)", margin: 0 }}>
                <Highlight text={t[lang]} hl={TAKEAWAY_HIGHLIGHTS[n]?.[lang]} />
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "reflection",
    dark: true,
    steps: 2,
    render: (lang, step) => (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Refleksi" : "Reflection"}</Eyebrow>
        <H2 dark>{QUESTION[lang]}</H2>
        <p style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ON_NAVY, margin: "-8px 0 10px" }}>
          {lang === "id" ? "Pikirkan area-area ini:" : "Think about these areas:"}
        </p>
        <div style={{ ...show(step >= 1), flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {AREAS.map((a) => (
            <div key={a.en} style={{ width: 250, height: 250, borderRadius: "50%", border: `3px solid ${ORANGE}`, background: "oklch(100% 0 0 / 0.06)", display: "flex", alignItems: "center", justifyContent: "center", padding: 30, boxSizing: "border-box" }}>
              <p style={{ fontFamily: SANS, fontSize: 24, fontWeight: 600, lineHeight: 1.3, color: OFF_WHITE, margin: 0, textAlign: "center" }}>{a[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "closing",
    dark: true,
    steps: 1,
    render: (lang) => (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 120, lineHeight: 1.02, color: ORANGE, margin: "0 0 44px", maxWidth: 1300 }}>
          {lang === "id" ? "Pola Pikir Anda Tidak Tetap" : "Your Mindset Is Not Fixed"}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 40, fontWeight: 600, color: OFF_WHITE, margin: "0 0 24px" }}>
          {lang === "id" ? "Beri nama. Kenali polanya. Ubah sudut pandang." : "Name it. Spot it. Reframe it."}
        </p>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: ON_NAVY, margin: 0 }}>
          {lang === "id" ? "Pertumbuhan dimulai dari langkah Anda berikutnya." : "Growth starts with your next step."}
        </p>
      </div>
    ),
  },
];

const stepsOf = (i: number) => SLIDES[i]?.steps ?? 1;

// ── Slide canvas ───────────────────────────────────────────────────────────

// One slide on the 1600×900 canvas, with a quiet footer
function SlideFrame({ index, lang, step }: { index: number; lang: Lang; step: number }) {
  const slide = SLIDES[index];
  const dark = !!slide.dark;
  const isTitle = index === 0;
  return (
    <div style={{ width: W, height: H, position: "relative", background: dark ? NAVY : OFF_WHITE, overflow: "hidden", fontFamily: SANS }}>
      {isTitle && (
        <>
          <img src={IMG} alt="" aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, mixBlendMode: "luminosity" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: NAVY, opacity: 0.35 }} />
        </>
      )}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: ORANGE }} />
      <div style={{ position: "relative", zIndex: 1, padding: "90px 110px", height: "100%", boxSizing: "border-box" }}>
        {slide.render(lang, step)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: dark ? ON_NAVY : MUTED, letterSpacing: "0.04em" }}>
            <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
            {MODULE_TITLE[lang]}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: dark ? ON_NAVY : MUTED }}>{index + 1} / {SLIDES.length}</span>
        </div>
      )}
      {isTitle && (
        <img src="/logo-icon.png" alt="Crispy Development" width={40} height={40} style={{ position: "absolute", right: 56, bottom: 44, display: "block", zIndex: 1 }} />
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function PresentClient() {
  const { lang: ctxLang, setLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;
  // Position = slide index plus how many builds of that slide are showing
  const [pos, setPos] = useState({ i: 0, s: 0 });
  const { i, s: step } = pos;
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

  // Remember the slide across a language switch, in case the page reloads
  const here = useRef({ i: 0, s: 0 });
  here.current = { i: pos.i, s: pos.s };
  const switchLang = (l: Lang) => { saveResume(here.current.i, here.current.s); setLang(l); };
  useEffect(() => {
    const r = takeResume(last);
    if (r) { setPos(r); setStarted(true); }
  }, [last]);

  const atEnd = i === last && step === stepsOf(last) - 1;
  const go = useCallback((n: number) => { setBlank(false); setPos({ i: Math.max(0, Math.min(last, n)), s: 0 }); }, [last]);
  const next = useCallback(() => {
    setBlank(false);
    setPos(p => p.s < stepsOf(p.i) - 1 ? { i: p.i, s: p.s + 1 } : p.i < last ? { i: p.i + 1, s: 0 } : p);
  }, [last]);
  const prev = useCallback(() => {
    setBlank(false);
    setPos(p => p.s > 0 ? { i: p.i, s: p.s - 1 } : p.i > 0 ? { i: p.i - 1, s: stepsOf(p.i - 1) - 1 } : p);
  }, []);

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
      else if (k === "l" || k === "L") { e.preventDefault(); switchLang(lang === "en" ? "id" : "en"); }
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

  // Preload the title image so the first slide never waits
  useEffect(() => {
    const im = new Image();
    im.src = IMG;
  }, []);

  // Stop the page behind from scrolling while presenting
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const showUi = uiVisible || !started || overview;

  if (tooSmall) return <PresentRotateNotice lang={lang} moduleHref={MODULE_HREF} />;

  const pill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 44, height: 44, padding: "0 12px",
    background: "transparent", border: "none", borderRadius: 10, color: OFF_WHITE, cursor: "pointer", fontFamily: SANS, fontWeight: 700, fontSize: 13,
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
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: INK, fontFamily: SANS, cursor: showUi ? "default" : "none", userSelect: "none" }}>
      <style>{`
        .fgm-fade { animation: fgmFade 0.45s ease; }
        @keyframes fgmFade { from { opacity: 0; } to { opacity: 1; } }
        .fgm-ui { transition: opacity 0.4s ease, transform 0.4s ease; }
        .fgm-pill:hover { background: oklch(100% 0 0 / 0.12) !important; }
        .fgm-pill:focus-visible, .fgm-thumb:focus-visible { outline: 2px solid ${ORANGE}; outline-offset: 2px; }
        .fgm-thumb { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fgm-thumb:hover { transform: translateY(-3px); }
        @media (prefers-reduced-motion: reduce) { .fgm-fade { animation: none; } .fgm-ui, .fgm-thumb { transition: none; } }
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
          <div key={`${i}-${lang}`} className="fgm-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} step={step} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="fgm-ui" style={{ position: "absolute", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
          {!isFull && (
            <button type="button" onClick={() => { setStarted(true); toggleFull(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 24px", borderRadius: 999, border: "none", background: ORANGE, color: "white", fontFamily: SANS, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px oklch(0% 0 0 / 0.35)" }}>
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
      <div className="fgm-ui" role="toolbar" aria-label={t("Presentation controls", "Kontrol presentasi", lang)}
        style={{ position: "absolute", left: "50%", bottom: 28, transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="fgm-pill" style={{ ...pill, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => { setStarted(true); prev(); }}
          aria-label={t("Previous slide", "Slide sebelumnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: OFF_WHITE, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {SLIDES.length}</span>
        <button type="button" className="fgm-pill" style={{ ...pill, opacity: atEnd ? 0.35 : 1 }} disabled={atEnd} onClick={() => { setStarted(true); next(); }}
          aria-label={t("Next slide", "Slide berikutnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {sep}
        <button type="button" className="fgm-pill" style={pill} onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={t("All slides", "Semua slide", lang)} title={t("All slides (G)", "Semua slide (G)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={t("Language", "Bahasa", lang)} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="fgm-pill" aria-pressed={lang === l} onClick={() => switchLang(l)}
              style={{ ...pill, height: 40, minWidth: 44, background: lang === l ? ORANGE : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="fgm-pill" style={pill} onClick={toggleFull}
          aria-label={isFull ? t("Exit full screen", "Keluar dari layar penuh", lang) : t("Full screen", "Layar penuh", lang)}
          title={isFull ? t("Exit full screen (F)", "Keluar dari layar penuh (F)", lang) : t("Full screen (F)", "Layar penuh (F)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        {sep}
        <Link href={MODULE_HREF} className="fgm-pill" style={{ ...pill, textDecoration: "none", gap: 6 }} aria-label={t("Close presentation", "Tutup presentasi", lang)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          {t("Close", "Tutup", lang)}
        </Link>
      </div>

      {/* Progress line */}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "oklch(100% 0 0 / 0.06)" }}>
        <div style={{ height: "100%", width: `${((i + 1) / SLIDES.length) * 100}%`, background: ORANGE, transition: "width 0.4s ease" }} />
      </div>

      {/* Overview: every slide as a thumbnail, click to jump */}
      {overview && (
        <div role="dialog" aria-label={t("All slides", "Semua slide", lang)}
          style={{ position: "absolute", inset: 0, background: "oklch(12% 0.04 260 / 0.97)", overflowY: "auto", padding: "56px 48px 120px" }}>
          <p style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, color: OFF_WHITE, textAlign: "center", margin: "0 0 32px" }}>
            {t("All slides", "Semua slide", lang)}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, maxWidth: 1280, margin: "0 auto" }}>
            {SLIDES.map((s, n) => (
              <button key={s.key} type="button" className="fgm-thumb" onClick={() => { go(n); setOverview(false); setStarted(true); }}
                aria-label={`${n + 1}`} aria-current={n === i}
                style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                <Thumb index={n} lang={lang} active={n === i} />
                <span style={{ display: "block", marginTop: 8, fontSize: 13, fontWeight: 700, color: n === i ? ORANGE : "oklch(80% 0.02 80)" }}>{n + 1}</span>
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
      outline: active ? `3px solid ${ORANGE}` : "1px solid oklch(100% 0 0 / 0.12)", outlineOffset: active ? 2 : 0 }}>
      <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "top left", pointerEvents: "none" }}>
        <SlideFrame index={index} lang={lang} step={stepsOf(index) - 1} />
      </div>
    </div>
  );
}
