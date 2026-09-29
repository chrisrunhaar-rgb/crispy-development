"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

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
const HAND = "var(--font-kalam)";

const W = 1600;
const H = 900;
const IDLE_MS = 2500;

const MODULE_HREF = "/resources/fixed-growth-mindset";
const IMG = "/images/resources/fixed-growth-mindset/hero.jpg";
const MODULE_TITLE: Pair = { en: "Fixed vs Growth Mindset", id: "Mindset Tetap vs. Pertumbuhan" };

// ── Content, lifted from the module itself ────────────────────────────────

const DIMENSIONS: { label: Pair; example: Pair; growth: Pair; fixed: Pair }[] = [
  {
    label: { en: "Challenges", id: "Tantangan" },
    example: { en: "Saying yes to leading the meeting in a language you are still learning.", id: "Bersedia memimpin rapat dalam bahasa yang masih Anda pelajari." },
    growth: { en: "Embraces challenges.", id: "Merangkul tantangan." },
    fixed: { en: "Defaults to familiar paths to protect against visible failure.", id: "Memilih jalur yang sudah dikenal untuk melindungi diri dari kegagalan yang terlihat." },
  },
  {
    label: { en: "Skills", id: "Keterampilan" },
    example: { en: "Practising the hard conversation instead of avoiding it.", id: "Berlatih percakapan yang sulit, bukan menghindarinya." },
    growth: { en: "Focuses on getting gradually better.", id: "Fokus pada perbaikan bertahap." },
    fixed: { en: "Believes you're either good at something or not.", id: "Percaya bahwa Anda berbakat dalam sesuatu atau tidak." },
  },
  {
    label: { en: "Obstacles", id: "Hambatan" },
    example: { en: "The visa is delayed again. You adjust the plan and keep going.", id: "Visa tertunda lagi. Anda menyesuaikan rencana dan terus berjalan." },
    growth: { en: "Sees obstacles as an inevitable part of the process.", id: "Melihat hambatan sebagai bagian yang tak terhindarkan dari proses." },
    fixed: { en: "Gives up in the face of an obstacle.", id: "Menyerah ketika menghadapi hambatan." },
  },
  {
    label: { en: "Success of Others", id: "Kesuksesan Orang Lain" },
    example: { en: "A colleague learns the language faster. You ask how they did it.", id: "Rekan kerja lebih cepat menguasai bahasa. Anda bertanya bagaimana caranya." },
    growth: { en: "Is inspired by the success of others.", id: "Terinspirasi oleh kesuksesan orang lain." },
    fixed: { en: "Sees others' advancement as a comment on their own worth.", id: "Melihat kemajuan orang lain sebagai komentar tentang nilai diri sendiri." },
  },
  {
    label: { en: "Effort", id: "Usaha" },
    example: { en: "Presenting again the week after a presentation went badly.", id: "Tampil presentasi lagi seminggu setelah presentasi yang buruk." },
    growth: { en: "Sees consistent effort as fruitful, even when results are slow.", id: "Melihat usaha yang konsisten sebagai hal yang bermanfaat, bahkan ketika hasilnya lambat." },
    fixed: { en: "Does not feel motivated to put in the extra effort.", id: "Tidak merasa termotivasi untuk memberikan upaya ekstra." },
  },
];

const SHIFT_STEPS: { step: string; title: Pair; point: Pair; detail: Pair }[] = [
  {
    step: "01",
    title: { en: "Name It", id: "Beri Nama" },
    point: { en: "Write down your current belief honestly.", id: "Tuliskan keyakinan Anda saat ini dengan jujur." },
    detail: { en: "What do you actually think, not what you know you should think?", id: "Apa yang sebenarnya Anda pikirkan, bukan apa yang Anda tahu seharusnya Anda pikirkan?" },
  },
  {
    step: "02",
    title: { en: "Spot the Pattern", id: "Kenali Polanya" },
    point: { en: "Is this a fixed or growth belief? Do not judge, just notice.", id: "Apakah ini keyakinan tetap atau pertumbuhan? Jangan menghakimi, cukup perhatikan." },
    detail: { en: "Fixed sounds like: always, never, too late. Growth sounds like: not yet, still figuring this out.", id: "Tetap terdengar seperti: selalu, tidak pernah, terlambat. Pertumbuhan terdengar seperti: belum, masih mencari tahu." },
  },
  {
    step: "03",
    title: { en: "Reframe It", id: "Ubah Bingkainya" },
    point: { en: "A reframe is not positive thinking. It is a more complete statement of reality.", id: "Pembingkaian ulang bukan pemikiran positif. Ini pernyataan yang lebih lengkap tentang realitas." },
    detail: { en: "“I failed at this” becomes “I haven't succeeded here yet.”", id: "“Saya gagal dalam hal ini” menjadi “Saya belum berhasil di sini.”" },
  },
];

// Phrases shown in bold orange on the takeaways slide.
const TAKEAWAY_HIGHLIGHTS: (Pair | undefined)[] = [
  { en: "Recognizing them is the work.", id: "Mengenali mereka adalah pekerjaan itu." },
  undefined,
  { en: "faithfulness with what you have been given", id: "kesetiaan dengan apa yang telah diberikan kepada Anda" },
  undefined,
];

const TAKEAWAYS: Pair[] = [
  { en: "Fixed mindset patterns do not make you a poor leader. They make you a human one. Recognizing them is the work.", id: "Pola mindset tetap tidak membuat Anda pemimpin yang buruk. Mereka membuat Anda manusiawi. Mengenali mereka adalah pekerjaan itu." },
  { en: "In cross-cultural settings, fear of visible failure is often a learned response to real social stakes, not a character flaw.", id: "Dalam lingkungan lintas budaya, ketakutan akan kegagalan yang terlihat sering kali respons yang dipelajari terhadap taruhan sosial nyata, bukan cacat karakter." },
  { en: "Growth mindset is not about ambition. It is about faithfulness with what you have been given, where you have been placed.", id: "Mindset pertumbuhan bukan tentang ambisi. Ini tentang kesetiaan dengan apa yang telah diberikan kepada Anda, di tempat Anda ditempatkan." },
  { en: "The goal is not a perfect score. It is the honest question: where am I protecting myself when I could be growing?", id: "Tujuannya bukan skor sempurna. Ini pertanyaan jujur: di mana saya melindungi diri saya sendiri ketika saya bisa bertumbuh?" },
];

const QUESTIONS: Pair[] = [
  { en: "Think of a moment in cross-cultural work when you felt you were not cut out for this. Was that a fixed-mindset moment, a legitimate limit, or something your context imposed on you?", id: "Pikirkan momen dalam pekerjaan lintas budaya ketika Anda merasa tidak cocok untuk ini. Apakah itu momen mindset tetap, batasan yang sah, atau sesuatu yang dipaksakan konteks Anda?" },
  { en: "Where in your leadership role are you most likely to go fixed: under pressure, in ambiguous situations, in front of people whose respect you need?", id: "Di mana dalam peran kepemimpinan Anda, Anda paling mungkin menjadi tetap: di bawah tekanan, dalam situasi ambigu, di depan orang yang rasa hormatnya Anda butuhkan?" },
  { en: "If the people you lead could see your fixed-mindset moments clearly, what do you want them to learn from how you handle them?", id: "Jika orang yang Anda pimpin dapat melihat momen mindset tetap Anda dengan jelas, apa yang ingin Anda ajarkan dari cara Anda menanganinya?" },
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
          {lang === "id" ? "Mindset Tetap vs. Pertumbuhan" : "Fixed vs. Growth Mindset"}
        </h1>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: "oklch(72% 0.05 260)", maxWidth: 900, lineHeight: 1.5 }}>
          {lang === "id"
            ? "Berdasarkan kerangka kerja Carol Dweck, mengungkapkan di mana mindset Anda tetap dan di mana ia berkembang, dalam lima dimensi utama."
            : "Drawing on Carol Dweck's framework, revealing where your mindset is fixed and where it's growing, across five key dimensions."}
        </p>
      </div>
    ),
  },
  {
    key: "two-mindsets",
    steps: 2,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Penelitian" : "The Research"}</Eyebrow>
        <H2>{lang === "id" ? "Dua Cara Melihat Kemampuan" : "Two Ways of Seeing Ability"}</H2>
        <div style={{ display: "flex", gap: 32, marginTop: 20 }}>
          <div style={{ ...show(step >= 0), flex: 1, background: "oklch(46% 0.16 145 / 0.08)", borderRadius: 16, padding: "36px 32px" }}>
            <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: GROWTH, marginBottom: 14 }}>
              {lang === "id" ? "Mindset Pertumbuhan" : "Growth Mindset"}
            </div>
            <p style={{ fontFamily: SANS, fontSize: 24, lineHeight: 1.5, color: "oklch(30% 0.08 145)", margin: 0 }}>
              {lang === "id" ? "Mendefinisikan keberhasilan sebagai perbaikan dan pertumbuhan bertahap." : "Defines success as gradual improvement and growth."}
            </p>
          </div>
          <div style={{ ...show(step >= 1), flex: 1, background: "oklch(48% 0.18 25 / 0.08)", borderRadius: 16, padding: "36px 32px" }}>
            <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: FIXED, marginBottom: 14 }}>
              {lang === "id" ? "Mindset Tetap" : "Fixed Mindset"}
            </div>
            <p style={{ fontFamily: SANS, fontSize: 24, lineHeight: 1.5, color: "oklch(32% 0.10 25)", margin: 0 }}>
              {lang === "id" ? "Mendefinisikan keberhasilan sebagai benar dan tidak gagal." : "Defines success as being right and not failing."}
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "dimensions-preview",
    steps: 10,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Lima Dimensi" : "Five Dimensions"}</Eyebrow>
        <H2>{lang === "id" ? "Di Mana Mindset Muncul" : "Where Mindset Shows Up"}</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {DIMENSIONS.map((d, n) => (
            <div key={d.label.en} style={{ ...show(step >= n * 2), display: "flex", alignItems: "baseline", gap: 20, padding: "14px 0", borderBottom: n < 4 ? `1px solid ${LIGHT_GRAY}` : "none" }}>
              <span style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: ORANGE, minWidth: 48 }}>{String(n + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: SANS, fontSize: 30, fontWeight: 600, color: NAVY, minWidth: 380 }}>{d.label[lang]}</span>
              <span style={{ ...show(step >= n * 2 + 1), fontFamily: HAND, fontSize: 28, lineHeight: 1.3, color: "oklch(38% 0.07 260)" }}>{d.example[lang]}</span>
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
        <H2>{lang === "id" ? "Pertumbuhan vs Tetap, Dimensi demi Dimensi" : "Growth vs Fixed, Dimension by Dimension"}</H2>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", gap: 0, marginTop: 8 }}>
          <div />
          <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GROWTH, padding: "0 20px 14px" }}>
            {lang === "id" ? "Pertumbuhan" : "Growth"}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: FIXED, padding: "0 0 14px 16px" }}>
            {lang === "id" ? "Tetap" : "Fixed"}
          </div>
          {DIMENSIONS.map((d, n) => (
            <Fragment key={d.label.en}>
              <div style={{ padding: "16px 20px 16px 0", fontFamily: SANS, fontSize: 20, fontWeight: 700, color: NAVY, borderTop: `1px solid ${LIGHT_GRAY}` }}>
                {d.label[lang]}
              </div>
              <div style={{ padding: "16px 20px", background: "oklch(46% 0.16 145 / 0.06)", borderTop: `1px solid ${LIGHT_GRAY}` }}>
                <p style={{ ...show(step > n), margin: 0, fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: "oklch(30% 0.08 145)" }}>{d.growth[lang]}</p>
              </div>
              <div style={{ padding: "16px 20px", background: "oklch(48% 0.18 25 / 0.06)", borderTop: `1px solid ${LIGHT_GRAY}` }}>
                <p style={{ ...show(step > n), margin: 0, fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: "oklch(32% 0.10 25)" }}>{d.fixed[lang]}</p>
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
        <H2 dark>{lang === "id" ? "Cara Mengubah Mindset Anda" : "How to Shift Your Mindset"}</H2>
        <Point on={true} dark>
          {lang === "id" ? "Perubahan mindset bukan keputusan sekali jalan. Ini adalah latihan." : "Mindset change is not a one-time decision. It is a practice."}
        </Point>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 20 }}>
          {SHIFT_STEPS.map((s, n) => (
            <div key={s.step} style={{ ...show(step >= n), background: "oklch(30% 0.08 260)", borderRadius: 16, padding: "36px 32px" }}>
              <StepIcon step={s.step} size={64} />
              <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: ON_NAVY, margin: "22px 0 8px" }}>
                {lang === "id" ? `LANGKAH ${s.step}` : `STEP ${s.step}`}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 600, color: OFF_WHITE, lineHeight: 1.1 }}>{s.title[lang]}</div>
            </div>
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
          <Point on={step >= 1}>{s.detail[lang]}</Point>
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
    key: "discussion",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Diskusi" : "Discussion"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Pertanyaan yang Layak Direnungkan" : "Questions Worth Sitting With"}</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {QUESTIONS.map((q, n) => (
            <div key={n} style={{ ...show(step >= n), display: "flex", gap: 24, alignItems: "flex-start", padding: "12px 0" }}>
              <span style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: ORANGE, lineHeight: 1, minWidth: 40 }}>{n + 1}</span>
              <p style={{ fontFamily: SANS, fontSize: 24, lineHeight: 1.5, color: ON_NAVY, margin: 0 }}>{q[lang]}</p>
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
        <Eyebrow color={ORANGE}>{lang === "id" ? "Langkah Selanjutnya" : "Next Steps"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Mindset Anda Tidak Tetap" : "Your Mindset Is Not Fixed"}</H2>
        <Point on={true} dark>
          {lang === "id"
            ? "Perubahan dimulai dengan menyadari. Di mana Anda bermain aman padahal Anda bisa belajar?"
            : "Change starts with noticing. Where are you playing it safe when you could be learning?"}
        </Point>
      </div>
    ),
  },
];

const stepsOf = (i: number) => SLIDES[i]?.steps ?? 1;

// ── Slide canvas ───────────────────────────────────────────────────────────

function SlideFrame({ slide, lang, step, index, total }: { slide: Slide; lang: Lang; step: number; index: number; total: number }) {
  const dark = !!slide.dark;
  const isTitle = slide.key === "title";
  return (
    <div style={{ position: "relative", width: W, height: H, background: dark ? NAVY : OFF_WHITE, overflow: "hidden", fontFamily: SANS }}>
      {isTitle && (
        <>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18, mixBlendMode: "luminosity" }} />
          <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: 0.35 }} />
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.2" style={{ position: "absolute", right: 60, bottom: 50, opacity: 0.5 }} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12l2.5 2.5L16 9" />
          </svg>
        </>
      )}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: ORANGE }} />
      <div style={{ position: "relative", zIndex: 1, padding: "90px 110px", height: "100%", boxSizing: "border-box" }}>
        {slide.render(lang, step)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 110, right: 110, bottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: SANS, fontSize: 16, color: dark ? "oklch(60% 0.03 260)" : MUTED, letterSpacing: "0.04em" }}>
          <span>{MODULE_TITLE[lang]}</span>
          <span>{index + 1} / {total}</span>
        </div>
      )}
    </div>
  );
}

function Thumb({ index, lang, active }: { index: number; lang: Lang; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const slide = SLIDES[index];
  const finalStep = stepsOf(index) - 1;

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        aspectRatio: `${W} / ${H}`,
        width: "100%",
        borderRadius: 8,
        overflow: "hidden",
        outline: active ? `3px solid ${ORANGE}` : `1px solid ${LIGHT_GRAY}`,
        cursor: "pointer",
        background: slide.dark ? NAVY : OFF_WHITE,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <SlideFrame slide={slide} lang={lang} step={finalStep} index={index} total={SLIDES.length} />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function PresentClient() {
  const [lang, setLang] = useState<Lang>("en");
  const [pos, setPos] = useState({ i: 0, s: 0 });
  const [isFull, setIsFull] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [overview, setOverview] = useState(false);
  const [blank, setBlank] = useState(false);
  const [started, setStarted] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = SLIDES.length;
  const atEnd = pos.i === total - 1 && pos.s === stepsOf(pos.i) - 1;
  const atStart = pos.i === 0 && pos.s === 0;

  const go = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    setPos({ i: clamped, s: 0 });
  }, [total]);

  const next = useCallback(() => {
    setPos((p) => {
      const max = stepsOf(p.i) - 1;
      if (p.s < max) return { i: p.i, s: p.s + 1 };
      if (p.i < total - 1) return { i: p.i + 1, s: 0 };
      return p;
    });
  }, [total]);

  const prev = useCallback(() => {
    setPos((p) => {
      if (p.s > 0) return { i: p.i, s: p.s - 1 };
      if (p.i > 0) return { i: p.i - 1, s: stepsOf(p.i - 1) - 1 };
      return p;
    });
  }, []);

  const toggleFull = useCallback(() => {
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const wake = useCallback(() => {
    setUiVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
  }, []);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(el.clientWidth / W, el.clientHeight / H);
      setScale(s > 0 ? s : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setTooSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS);
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [wake]);

  useEffect(() => {
    const img = new Image();
    img.src = IMG;
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "n", "N"].includes(e.key)) { e.preventDefault(); setStarted(true); next(); }
      else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace", "p", "P"].includes(e.key)) { e.preventDefault(); setStarted(true); prev(); }
      else if (e.key === "Home") { setStarted(true); go(0); }
      else if (e.key === "End") { setStarted(true); go(total - 1); }
      else if (e.key === "f" || e.key === "F") { toggleFull(); }
      else if (e.key === "g" || e.key === "G") { setOverview((o) => !o); }
      else if (e.key === "b" || e.key === "B" || e.key === ".") { setBlank((b) => !b); }
      else if (e.key === "l" || e.key === "L") { setLang((l) => (l === "en" ? "id" : "en")); }
      else if (e.key === "Escape") { if (blank) setBlank(false); else if (overview) setOverview(false); }
      wake();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, toggleFull, total, blank, overview, wake]);

  if (tooSmall) {
    return (
      <div style={{ position: "fixed", inset: 0, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: SANS, textAlign: "center" }}>
        <div>
          <p style={{ fontFamily: SERIF, fontSize: 30, color: OFF_WHITE, marginBottom: 14 }}>Presenting needs a bigger screen</p>
          <p style={{ color: ON_NAVY, marginBottom: 24, fontSize: 15 }}>Open this on a tablet or computer to run the slideshow.</p>
          <Link href={MODULE_HREF} style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>
            Back to the module
          </Link>
        </div>
      </div>
    );
  }

  const slide = SLIDES[pos.i];
  const progressPct = ((pos.i + (pos.s + 1) / stepsOf(pos.i)) / total) * 100;

  return (
    <div
      ref={rootRef}
      onMouseMove={wake}
      onTouchStart={wake}
      style={{ position: "fixed", inset: 0, background: INK, overflow: "hidden" }}
    >
      <style>{`
        @keyframes fgm-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .fgm-fade { animation: fgm-fade 0.45s ease; }
        .fgm-ui { transition: opacity 0.4s ease; }
        .fgm-pill { transition: background 0.15s ease, transform 0.1s ease; }
        .fgm-pill:hover { background: oklch(100% 0 0 / 0.14) !important; }
        .fgm-thumb:hover { transform: translateY(-3px); }
        .fgm-progress { transition: width 0.35s ease; }
        @media (prefers-reduced-motion: reduce) {
          .fgm-fade { animation: none; }
          .fgm-ui, .fgm-pill, .fgm-thumb, .fgm-progress { transition: none; }
        }
      `}</style>

      <div ref={stageRef} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: W * scale, height: H * scale, position: "relative", cursor: blank ? "default" : "pointer" }}>
          {!blank && (
            <div key={pos.i} className="fgm-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <SlideFrame slide={slide} lang={lang} step={pos.s} index={pos.i} total={total} />
            </div>
          )}
          {blank && <div style={{ width: "100%", height: "100%", background: INK }} />}
          <div style={{ position: "absolute", inset: 0, display: "flex" }}>
            <div style={{ width: "30%" }} onClick={() => { setStarted(true); prev(); }} />
            <div style={{ width: "70%" }} onClick={() => { setStarted(true); next(); }} />
          </div>
        </div>
      </div>

      {!started && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "oklch(14% 0.05 260 / 0.55)", flexDirection: "column", gap: 18 }}>
          <button
            onClick={() => { setStarted(true); toggleFull(); }}
            style={{ background: ORANGE, color: "oklch(15% 0.05 45)", padding: "16px 36px", borderRadius: 14, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", fontFamily: SANS }}
          >
            {lang === "id" ? "Mulai layar penuh" : "Start full screen"}
          </button>
          <p style={{ color: ON_NAVY, fontFamily: SANS, fontSize: 14 }}>
            {lang === "id" ? "Gunakan panah atau klik untuk lanjut" : "Use the arrow keys or click to advance"}
          </p>
        </div>
      )}

      <div className="fgm-ui" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "oklch(100% 0 0 / 0.08)", opacity: uiVisible ? 1 : 0 }}>
        <div className="fgm-progress" style={{ height: "100%", width: `${progressPct}%`, background: ORANGE }} />
      </div>

      <div
        className="fgm-ui"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          opacity: uiVisible ? 1 : 0, pointerEvents: uiVisible ? "auto" : "none",
          background: "linear-gradient(to top, oklch(0% 0 0 / 0.55), transparent)",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="fgm-pill" disabled={atStart} onClick={prev} style={pillStyle(atStart)}>
            {"←"}
          </button>
          <button className="fgm-pill" disabled={atEnd} onClick={next} style={pillStyle(atEnd)}>
            {"→"}
          </button>
          <span style={{ color: ON_NAVY, fontFamily: SANS, fontSize: 13, marginLeft: 8 }}>{pos.i + 1} / {total}</span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="fgm-pill" onClick={() => setOverview((o) => !o)} style={pillStyle(false)}>
            {lang === "id" ? "Ringkasan" : "Overview"}
          </button>
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid oklch(100% 0 0 / 0.2)" }}>
            <button onClick={() => setLang("en")} style={langBtnStyle(lang === "en")}>EN</button>
            <button onClick={() => setLang("id")} style={langBtnStyle(lang === "id")}>ID</button>
          </div>
          <button className="fgm-pill" onClick={toggleFull} style={pillStyle(false)}>
            {isFull ? (lang === "id" ? "Keluar" : "Exit") : (lang === "id" ? "Layar penuh" : "Fullscreen")}
          </button>
          <Link href={MODULE_HREF} className="fgm-pill" style={{ ...pillStyle(false), textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            {lang === "id" ? "Tutup" : "Close"}
          </Link>
        </div>
      </div>

      {overview && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOverview(false)}
          style={{ position: "absolute", inset: 0, background: "oklch(10% 0.02 260 / 0.9)", zIndex: 10, padding: 40, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, maxWidth: 1400, margin: "0 auto" }}
          >
            {SLIDES.map((s, i) => (
              <div key={s.key} className="fgm-thumb" onClick={() => { go(i); setOverview(false); setStarted(true); }}>
                <Thumb index={i} lang={lang} active={i === pos.i} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function pillStyle(disabled: boolean): React.CSSProperties {
  return {
    background: "oklch(100% 0 0 / 0.08)",
    color: disabled ? "oklch(50% 0.02 260)" : ON_NAVY,
    border: "1px solid oklch(100% 0 0 / 0.16)",
    borderRadius: 10,
    padding: "9px 16px",
    fontFamily: SANS,
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
  };
}

function langBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? ORANGE : "transparent",
    color: active ? "oklch(15% 0.05 45)" : ON_NAVY,
    border: "none",
    padding: "9px 14px",
    fontFamily: SANS,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  };
}
