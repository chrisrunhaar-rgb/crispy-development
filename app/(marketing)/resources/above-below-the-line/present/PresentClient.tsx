"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { PHONE_PORTRAIT_QUERY, PresentRotateNotice, enterPresentFullscreen, usePresentPhone } from "@/components/PresentPhone";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResume, takeResume } from "@/lib/present-resume";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const navy = "oklch(22% 0.10 260)";
const ink = "oklch(14% 0.05 260)";
const offWhite = "oklch(96% 0.005 80)";
const orange = "oklch(65% 0.15 45)";
const lightGray = "oklch(88% 0.008 80)";
const muted = "oklch(48% 0.04 260)";
const onNavy = "oklch(82% 0.025 80)";

const SLUG = "above-below-the-line";
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

// Slides are designed on a fixed 16:9 canvas and scaled to fit the screen,
// so they look the same on a laptop, a projector or a TV.
const W = 1600;
const H = 900;
const MIN_WIDTH = 768;
const IDLE_MS = 2500;


// ─── Content ──────────────────────────────────────────────────────────────────
// Short slide versions of the Above and Below the Line module: one sentence per line.
type Pair = { en: string; id: string };

const ROPE = "/images/abl-rope-header.jpg";

const ABOVE: Pair[] = [
  { en: "Ownership", id: "Rasa tanggung jawab" }, { en: "Accountable", id: "Bertanggung jawab" },
  { en: "Seek solutions", id: "Cari solusi" }, { en: "Take action", id: "Ambil tindakan" },
  { en: "Hope", id: "Harapan" }, { en: "Find better ways", id: "Temukan cara lebih baik" },
  { en: "Own it", id: "Pegang tanggung jawab" }, { en: "Solve", id: "Selesaikan" },
  { en: "Make choices", id: "Buat pilihan" }, { en: "Take responsibility", id: "Ambil tanggung jawab" },
  { en: "Learn", id: "Belajar" }, { en: "Act", id: "Bertindak" },
];
const BELOW: Pair[] = [
  { en: "See failure", id: "Lihat kegagalan" }, { en: "Ignore", id: "Abaikan" },
  { en: "No control", id: "Tidak ada kendali" }, { en: "Wait for others", id: "Tunggu orang lain" },
  { en: "Deny", id: "Sangkal" }, { en: "Excuses", id: "Alasan" },
  { en: "Obstacles", id: "Hambatan" }, { en: "Stay stuck", id: "Tetap terjebak" },
  { en: "Block", id: "Blokir" }, { en: "Find fault", id: "Cari kesalahan" },
  { en: "Do nothing", id: "Tidak bertindak" }, { en: "Blame", id: "Menyalahkan" },
];

// Same positions and timing as the module's animated line, scaled for the slide canvas.
// left is kept between 4% and 76% so long words never run off the slide.
type PhraseConfig = { left: number; top: number; delay: number; dur: number; size: number };
const ABOVE_CONFIGS: PhraseConfig[] = [
  { left: 7, top: 16, delay: 0, dur: 9, size: 13 }, { left: 27, top: 58, delay: 1.2, dur: 11, size: 11 },
  { left: 48, top: 22, delay: 2.5, dur: 8.5, size: 15 }, { left: 66, top: 64, delay: 0.6, dur: 10, size: 12 },
  { left: 81, top: 28, delay: 1.9, dur: 12, size: 14 }, { left: 14, top: 74, delay: 3.5, dur: 9, size: 11 },
  { left: 54, top: 46, delay: 2.1, dur: 10.5, size: 13 }, { left: 88, top: 68, delay: 3, dur: 8, size: 12 },
  { left: 37, top: 82, delay: 1, dur: 11, size: 11 }, { left: 73, top: 12, delay: 4.2, dur: 9.5, size: 14 },
  { left: 58, top: 34, delay: 5, dur: 10, size: 12 }, { left: 21, top: 40, delay: 5.7, dur: 9, size: 13 },
];
const BELOW_CONFIGS: PhraseConfig[] = [
  { left: 6, top: 18, delay: 0, dur: 10, size: 12 }, { left: 22, top: 56, delay: 0.8, dur: 8.5, size: 11 },
  { left: 40, top: 14, delay: 1.5, dur: 11, size: 13 }, { left: 58, top: 66, delay: 0.4, dur: 9, size: 11 },
  { left: 76, top: 24, delay: 2.2, dur: 10.5, size: 14 }, { left: 89, top: 72, delay: 1.1, dur: 8, size: 12 },
  { left: 12, top: 82, delay: 3, dur: 12, size: 11 }, { left: 50, top: 42, delay: 2.5, dur: 9.5, size: 13 },
  { left: 32, top: 76, delay: 3.5, dur: 10, size: 11 }, { left: 67, top: 50, delay: 0.5, dur: 11.5, size: 12 },
  { left: 83, top: 14, delay: 4, dur: 9, size: 14 }, { left: 17, top: 34, delay: 1.8, dur: 10, size: 12 },
];

const VICTOR: Pair[] = [
  { en: "Takes ownership", id: "Mengambil tanggung jawab" },
  { en: "Chooses the response", id: "Memilih responsnya" },
  { en: "Looks for solutions", id: "Mencari solusi" },
];
const VICTIM: Pair[] = [
  { en: "Blames others", id: "Menyalahkan orang lain" },
  { en: "Feels powerless", id: "Merasa tidak berdaya" },
  { en: "Waits to be rescued", id: "Menunggu diselamatkan" },
];

const DICTIONARY: { word: Pair; text: Pair }[] = [
  { word: { en: "Help", id: "Membantu" }, text: { en: "We help each other see where we are.", id: "Kita saling membantu melihat posisi kita." } },
  { word: { en: "Remind", id: "Mengingatkan" }, text: { en: "We remind each other of what we agreed.", id: "Kita saling mengingatkan apa yang sudah kita sepakati." } },
  { word: { en: "Encourage", id: "Menyemangati" }, text: { en: "We encourage each other to step up.", id: "Kita saling menyemangati untuk naik ke atas garis." } },
];

// ─── Slide building blocks (fixed px on the 1600×900 canvas) ─────────────────
const bigTitle: React.CSSProperties = {
  fontFamily: serif, fontWeight: 600, color: navy, lineHeight: 1.06, margin: 0, fontSize: 104, textAlign: "center",
};
const midTitle: React.CSSProperties = { ...bigTitle, fontSize: 72 };
const kicker: React.CSSProperties = {
  fontFamily: sans, fontSize: 20, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, margin: 0, textAlign: "center",
};
const body: React.CSSProperties = { fontFamily: sans, fontSize: 28, lineHeight: 1.5, color: muted, margin: 0, textAlign: "center" };
const rule = (w = 96) => <div aria-hidden="true" style={{ width: w, height: 4, background: orange, borderRadius: 2 }} />;

// Build-up reveal: hidden parts keep their space so the slide never jumps
const show = (on: boolean): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(14px)",
  transition: "opacity 0.5s ease, transform 0.5s ease",
});

// Larger serif statement line, used for one-sentence-per-line builds
const line = (size = 48, color = navy): React.CSSProperties => ({
  fontFamily: serif, fontSize: size, fontWeight: 600, color, margin: 0, lineHeight: 1.2, textAlign: "center",
});
const numDot = (bg: string, size = 56): React.CSSProperties => ({
  flexShrink: 0, width: size, height: size, borderRadius: 999, background: bg, color: offWhite, fontFamily: serif,
  fontSize: Math.round(size * 0.6), fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center",
});
const stack = (gap: number): React.CSSProperties => ({ display: "flex", flexDirection: "column", alignItems: "center", gap });

const green = { deep: "oklch(17% 0.13 145)", label: "oklch(62% 0.20 145)", word: "oklch(86% 0.14 145)", glow: "oklch(48% 0.24 145 / 0.7)" };
const red = { deep: "oklch(17% 0.14 25)", label: "oklch(62% 0.20 25)", word: "oklch(84% 0.12 25)", glow: "oklch(48% 0.24 25 / 0.7)" };

function Phrases({ words, configs, color, glow, lang }: { words: Pair[]; configs: PhraseConfig[]; color: string; glow: string; lang: Lang }) {
  return (
    <>
      {words.map((w, n) => {
        const c = configs[n % configs.length];
        return (
          <span key={w.en} className="ab-phrase" aria-hidden="true" style={{
            position: "absolute", left: `${4 + c.left * 0.8}%`, top: `${c.top}%`, fontSize: Math.round(c.size * 2.6), fontWeight: 600,
            fontFamily: sans, color, opacity: 0, letterSpacing: "0.03em", whiteSpace: "nowrap", textShadow: `0 0 28px ${glow}`,
            animation: `ab-phrase ${c.dur}s ${c.delay}s ease-in-out infinite`,
          }}>
            {t(w.en, w.id, lang)}
          </span>
        );
      })}
    </>
  );
}

// The animated line: red words first, green words join on the next click
function LineSlide({ lang, step }: { lang: Lang; step: number }) {
  const zoneLabel: React.CSSProperties = {
    position: "absolute", left: "50%", transform: "translateX(-50%)", fontFamily: sans, fontSize: 22, fontWeight: 700,
    letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap", zIndex: 2, transition: "opacity 0.6s ease",
  };
  return (
    <div style={{ position: "absolute", inset: 0, background: ink }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%", overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 80%, oklch(30% 0.20 145) 0%, oklch(17% 0.13 145) 50%, oklch(10% 0.07 145) 100%)",
        opacity: step >= 1 ? 1 : 0.18, transition: "opacity 0.9s ease" }}>
        <p style={{ ...zoneLabel, top: 34, color: green.label, opacity: step >= 1 ? 1 : 0 }}>{t("Above the Line", "Di Atas Garis", lang)}</p>
        {step >= 1 && <Phrases words={ABOVE} configs={ABOVE_CONFIGS} color={green.word} glow={green.glow} lang={lang} />}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "50%", overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 20%, oklch(32% 0.22 25) 0%, oklch(17% 0.14 25) 50%, oklch(10% 0.07 25) 100%)" }}>
        <p style={{ ...zoneLabel, bottom: 34, color: red.label }}>{t("Below the Line", "Di Bawah Garis", lang)}</p>
        <Phrases words={BELOW} configs={BELOW_CONFIGS} color={red.word} glow={red.glow} lang={lang} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 3, transform: "translateY(-50%)", zIndex: 3,
        background: "linear-gradient(90deg, transparent, oklch(100% 0 0 / 0.9) 20%, oklch(100% 0 0 / 0.9) 80%, transparent)" }} />
      <p style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 4, margin: 0, padding: "10px 34px",
        background: ink, borderRadius: 999, fontFamily: serif, fontSize: 40, fontWeight: 600, color: offWhite, whiteSpace: "nowrap" }}>
        {t("Above & Below the Line", "Di Atas & Di Bawah Garis", lang)}
      </p>
    </div>
  );
}

// One half of the Victor / Victim slide
function Band({ title, sub, items, tone, on, lang }: { title: Pair; sub: Pair; items: Pair[]; tone: typeof green; on: boolean; lang: Lang }) {
  return (
    <div style={{ ...show(on), width: "100%", borderRadius: 20, padding: "30px 44px", background: tone.deep, display: "flex", alignItems: "center", gap: 48 }}>
      <div style={{ width: 380, flexShrink: 0 }}>
        <p style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: tone.label, margin: "0 0 6px" }}>{t(sub.en, sub.id, lang)}</p>
        <h3 style={{ fontFamily: serif, fontSize: 76, fontWeight: 600, color: offWhite, margin: 0, lineHeight: 1 }}>{t(title.en, title.id, lang)}</h3>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(it => (
          <li key={it.en} style={{ fontFamily: sans, fontSize: 30, fontWeight: 600, color: tone.word, display: "flex", alignItems: "center", gap: 16 }}>
            <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 999, background: tone.label, flexShrink: 0 }} />
            {t(it.en, it.id, lang)}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Photo slides: the rope runs across the middle, text sits above and below it
function RopeSlide({ top, bottom }: { top: React.ReactNode; bottom: React.ReactNode }) {
  return (
    <>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: H - 372, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>{top}</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 548, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>{bottom}</div>
    </>
  );
}

// ─── The slides ───────────────────────────────────────────────────────────────
// `steps` is how many clicks a slide has: each click reveals the next part.
// `bleed` slides fill the whole canvas (no padding, no footer).
// `photo` slides sit on the rope photo, with the logo instead of a footer.
type Slide = { key: string; dark?: boolean; bleed?: boolean; photo?: boolean; steps?: number; render: (lang: Lang, step: number) => React.ReactNode };

const bleedBg = ink;

const SLIDES: Slide[] = [
  {
    key: "title",
    dark: true,
    photo: true,
    render: lang => (
      <RopeSlide
        top={<>
          <p style={kicker}>{t("A thinking concept", "Sebuah konsep berpikir", lang)}</p>
          <h1 style={{ ...bigTitle, fontSize: 116, color: offWhite }}>{t("Above and Below the Line", "Di Atas dan Di Bawah Garis", lang)}</h1>
        </>}
        bottom={<p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 44, color: onNavy, margin: 0, textAlign: "center" }}>
          {t("Creating a team dictionary", "Membuat Kamus Bahasa Tim", lang)}
        </p>}
      />
    ),
  },
  {
    key: "situations",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <>
        <h2 style={{ ...midTitle, color: offWhite, maxWidth: 1250 }}>{t("We all face hard situations.", "Kita semua menghadapi situasi sulit.", lang)}</h2>
        {rule()}
        <p style={{ ...show(step >= 1), ...line(46, offWhite), fontWeight: 500 }}>{t("Nobody is exempt.", "Tidak ada yang terkecuali.", lang)}</p>
        <p style={{ ...show(step >= 2), ...line(52, orange), fontStyle: "italic", maxWidth: 1250 }}>
          {t("What sets good leaders apart is how they respond.", "Yang membedakan pemimpin yang baik adalah cara mereka merespons.", lang)}
        </p>
      </>
    ),
  },
  { key: "line", bleed: true, steps: 2, render: (lang, step) => <LineSlide lang={lang} step={step} /> },
  {
    key: "victor-victim",
    steps: 2,
    render: (lang, step) => (
      <>
        <h2 style={{ ...midTitle, fontSize: 60 }}>{t("Victor or Victim?", "Pemenang atau Korban?", lang)}</h2>
        <div style={{ ...stack(22), width: "100%" }}>
          <Band title={{ en: "Victor", id: "Pemenang" }} sub={{ en: "Above the line", id: "Di atas garis" }} items={VICTOR} tone={green} on lang={lang} />
          <Band title={{ en: "Victim", id: "Korban" }} sub={{ en: "Below the line", id: "Di bawah garis" }} items={VICTIM} tone={red} on={step >= 1} lang={lang} />
        </div>
      </>
    ),
  },
  {
    key: "dictionary",
    steps: 3,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("A team dictionary", "Kamus bahasa tim", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Shared words. Shared understanding.", "Kata yang sama. Pemahaman yang sama.", lang)}</h2>
          <p style={{ ...body, maxWidth: 1150 }}>{t("When the whole team uses the same words, everyone knows what we mean.", "Ketika seluruh tim memakai kata yang sama, semua orang tahu apa maksud kita.", lang)}</p>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, width: "100%" }}>
          {DICTIONARY.map((d, n) => (
            <li key={d.word.en} style={{ ...show(step >= n), background: lightGray, borderRadius: 18, padding: "30px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
              <span style={numDot(orange, 52)}>{n + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 46, fontWeight: 600, color: navy, lineHeight: 1 }}>{t(d.word.en, d.word.id, lang)}</span>
              <span style={{ fontFamily: sans, fontSize: 24, fontWeight: 500, lineHeight: 1.45, color: navy }}>{t(d.text.en, d.text.id, lang)}</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    key: "question",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("The one question", "Satu pertanyaan", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite, maxWidth: 1300 }}>{t("Is this response above or below the line?", "Apakah respons ini di atas atau di bawah garis?", lang)}</h2>
        {rule()}
        <p style={{ ...show(step >= 1), ...line(44, offWhite), fontWeight: 500 }}>{t("We never say: you are below the line.", "Kita tidak pernah berkata: kamu di bawah garis.", lang)}</p>
        <p style={{ ...show(step >= 2), ...line(48, orange), fontStyle: "italic", maxWidth: 1250 }}>
          {t("We ask the question. The person reflects and decides.", "Kita mengajukan pertanyaan. Orang itu merenung dan memutuskan sendiri.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "reflect",
    steps: 2,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Reflect", "Renungkan", lang)}</p>
        {rule()}
        <p style={{ ...line(54), maxWidth: 1250 }}>
          {t("Think of a hard situation you faced this week. Was your response above or below the line?",
            "Pikirkan satu situasi sulit yang Anda hadapi minggu ini. Apakah respons Anda di atas atau di bawah garis?", lang)}
        </p>
        <p style={{ ...show(step >= 1), ...line(54, orange), fontStyle: "italic", maxWidth: 1250 }}>
          {t("What would one step above the line look like?", "Seperti apa satu langkah di atas garis?", lang)}
        </p>
      </>
    ),
  },
  {
    key: "close",
    dark: true,
    photo: true,
    render: lang => (
      <RopeSlide
        top={<h2 style={{ ...bigTitle, fontSize: 100, color: offWhite }}>{t("Choose your response.", "Pilih respons Anda.", lang)}</h2>}
        bottom={<p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 48, color: orange, margin: 0, textAlign: "center" }}>
          {t("Together, above the line.", "Bersama, di atas garis.", lang)}
        </p>}
      />
    ),
  },
];

const stepsOf = (index: number) => SLIDES[index].steps ?? 1;

// One slide on the 1600×900 canvas, with a quiet footer
function SlideFrame({ index, lang, step }: { index: number; lang: Lang; step: number }) {
  const s = SLIDES[index];
  const dark = !!s.dark;
  if (s.bleed) {
    return (
      <div style={{ width: W, height: H, position: "relative", background: bleedBg, overflow: "hidden", fontFamily: sans }}>
        {s.render(lang, step)}
      </div>
    );
  }
  if (s.photo) {
    return (
      <div style={{ width: W, height: H, position: "relative", background: ink, overflow: "hidden", fontFamily: sans }}>
        <img src={ROPE} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        {s.render(lang, step)}
        <img src="/logo-icon.png" alt="Crispy Development" width={40} height={40} style={{ position: "absolute", right: 56, bottom: 44, display: "block" }} />
      </div>
    );
  }
  return (
    <div style={{ width: W, height: H, position: "relative", background: dark ? navy : offWhite, overflow: "hidden", fontFamily: sans }}>
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: orange }} />
      <div style={{ position: "absolute", inset: "64px 120px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {s.render(lang, step)}
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: dark ? onNavy : muted, letterSpacing: "0.04em" }}>
          <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
          {t("Above and Below the Line", "Di Atas dan Di Bawah Garis", lang)}
        </span>
        <span style={{ fontSize: 17, fontWeight: 700, color: dark ? onNavy : muted }}>{index + 1} / {SLIDES.length}</span>
      </div>
    </div>
  );
}

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

  // Preload the rope photo so the last slide never waits
  useEffect(() => {
    const im = new Image(); im.src = ROPE;
  }, []);

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
        .hc-fade { animation: hcFade 0.45s ease; }
        @keyframes hcFade { from { opacity: 0; } to { opacity: 1; } }
        .hc-ui { transition: opacity 0.4s ease, transform 0.4s ease; }
        .hc-pill:hover { background: oklch(100% 0 0 / 0.12) !important; }
        .hc-pill:focus-visible, .hc-thumb:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .hc-thumb { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hc-thumb:hover { transform: translateY(-3px); }
        .hc-step { opacity: 0; animation: hcRise 0.6s ease forwards; }
        @keyframes hcRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .hc-bar { transform-origin: left; animation: hcGrow 0.9s ease both 0.2s; }
        @keyframes hcGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes ab-phrase { 0% { opacity: 0; transform: translateY(10px); } 12% { opacity: 1; } 80% { opacity: 1; transform: translateY(-6px); } 92% { opacity: 0; } 100% { opacity: 0; transform: translateY(-10px); } }
        @media (prefers-reduced-motion: reduce) { .hc-fade, .hc-step, .hc-bar { animation: none; opacity: 1; } .ab-phrase { animation: none !important; opacity: 1 !important; } .hc-ui, .hc-thumb { transition: none; } }
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
          <div key={`${i}-${lang}`} className="hc-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} step={step} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="hc-ui" style={{ position: "absolute", left: "50%", bottom: phone ? 52 : 88, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
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
      <div className="hc-ui" role="toolbar" aria-label={t("Presentation controls", "Kontrol presentasi", lang)}
        style={{ position: "absolute", left: "50%", bottom: phone ? 8 : 20, transform: `translateX(-50%) scale(${phone ? 0.6 : 0.82})`, transformOrigin: "bottom center",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="hc-pill" style={{ ...pill, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => { setStarted(true); prev(); }}
          aria-label={t("Previous slide", "Slide sebelumnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: offWhite, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {SLIDES.length}</span>
        <button type="button" className="hc-pill" style={{ ...pill, opacity: atEnd ? 0.35 : 1 }} disabled={atEnd} onClick={() => { setStarted(true); next(); }}
          aria-label={t("Next slide", "Slide berikutnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {sep}
        <button type="button" className="hc-pill" style={pill} onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={t("All slides", "Semua slide", lang)} title={t("All slides (G)", "Semua slide (G)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={t("Language", "Bahasa", lang)} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="hc-pill" aria-pressed={lang === l} onClick={() => switchLang(l)}
              style={{ ...pill, height: 40, minWidth: 44, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="hc-pill" style={pill} onClick={toggleFull}
          aria-label={isFull ? t("Exit full screen", "Keluar dari layar penuh", lang) : t("Full screen", "Layar penuh", lang)}
          title={isFull ? t("Exit full screen (F)", "Keluar dari layar penuh (F)", lang) : t("Full screen (F)", "Layar penuh (F)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        {sep}
        <Link href={moduleHref} className="hc-pill" style={{ ...pill, textDecoration: "none", gap: 6 }} aria-label={t("Close presentation", "Tutup presentasi", lang)}>
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
              <button key={s.key} type="button" className="hc-thumb" onClick={() => { go(n); setOverview(false); setStarted(true); }}
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
        <SlideFrame index={index} lang={lang} step={stepsOf(index) - 1} />
      </div>
    </div>
  );
}
