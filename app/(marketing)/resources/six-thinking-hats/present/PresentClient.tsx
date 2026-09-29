"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
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
const onNavy = "oklch(82% 0.025 80)";

const SLUG = "six-thinking-hats";
const serif = "var(--font-cormorant)";
const sans = "var(--font-montserrat)";

// Slides are designed on a fixed 16:9 canvas and scaled to fit the screen,
// so they look the same on a laptop, a projector or a TV.
const W = 1600;
const H = 900;
const MIN_WIDTH = 768;
const IDLE_MS = 2500;

type Hat = {
  key: string;
  en: string; id: string;
  focusEn: string; focusId: string;
  jobEn: string; jobId: string;
  askEn: string; askId: string;
  fill: string; bg: string; txt: string;
};

const HATS: Hat[] = [
  { key: "white", en: "White Hat", id: "Topi Putih", focusEn: "Facts", focusId: "Fakta",
    jobEn: "Only the facts. What we know, and what we don't.", jobId: "Hanya fakta. Apa yang kita tahu, dan apa yang belum.",
    askEn: "What do we know? What do we need to find out?", askId: "Apa yang kita tahu? Apa yang perlu kita cari tahu?",
    fill: "oklch(99% 0 0)", bg: "oklch(91% 0.01 260)", txt: "oklch(35% 0.03 260)" },
  { key: "red", en: "Red Hat", id: "Topi Merah", focusEn: "Feelings", focusId: "Perasaan",
    jobEn: "Gut reactions. No reasons needed.", jobId: "Reaksi naluri. Tidak perlu alasan.",
    askEn: "How do I feel about this?", askId: "Apa perasaan saya tentang ini?",
    fill: "oklch(55% 0.20 25)", bg: "oklch(93% 0.05 25)", txt: "oklch(48% 0.19 25)" },
  { key: "black", en: "Black Hat", id: "Topi Hitam", focusEn: "Risks", focusId: "Risiko",
    jobEn: "Risks and weak points. Careful, not negative.", jobId: "Risiko dan titik lemah. Hati-hati, bukan negatif.",
    askEn: "What could go wrong?", askId: "Apa yang bisa salah?",
    fill: "oklch(20% 0.01 260)", bg: "oklch(90% 0.01 260)", txt: "oklch(20% 0.02 260)" },
  { key: "yellow", en: "Yellow Hat", id: "Topi Kuning", focusEn: "Benefits", focusId: "Manfaat",
    jobEn: "Benefits and value, with reasons.", jobId: "Manfaat dan nilai, dengan alasan.",
    askEn: "Why could this work?", askId: "Mengapa ini bisa berhasil?",
    fill: "oklch(82% 0.16 90)", bg: "oklch(95% 0.06 90)", txt: "oklch(52% 0.13 80)" },
  { key: "green", en: "Green Hat", id: "Topi Hijau", focusEn: "New ideas", focusId: "Ide baru",
    jobEn: "Fresh ideas. No judging yet.", jobId: "Ide segar. Belum menilai.",
    askEn: "What else could we try?", askId: "Apa lagi yang bisa kita coba?",
    fill: "oklch(58% 0.15 145)", bg: "oklch(93% 0.05 145)", txt: "oklch(45% 0.14 145)" },
  { key: "blue", en: "Blue Hat", id: "Topi Biru", focusEn: "Process", focusId: "Proses",
    jobEn: "Runs the meeting. Opens it and closes it.", jobId: "Mengatur pertemuan. Membuka dan menutupnya.",
    askEn: "What is our goal, and which hat is next?", askId: "Apa tujuan kita, dan topi apa berikutnya?",
    fill: "oklch(50% 0.18 250)", bg: "oklch(92% 0.04 250)", txt: "oklch(45% 0.17 250)" },
];
const HAT = Object.fromEntries(HATS.map(h => [h.key, h])) as Record<string, Hat>;
const hatName = (k: string, lang: Lang) => t(HAT[k].en, HAT[k].id, lang);

const SEQUENCES = [
  { en: "Solving a problem", id: "Memecahkan masalah", order: ["green", "black", "blue"] },
  { en: "Making a decision", id: "Mengambil keputusan", order: ["white", "black", "yellow"] },
];

// ─── Slide building blocks (fixed px on the 1600×900 canvas) ─────────────────
const bigTitle: React.CSSProperties = {
  fontFamily: serif, fontWeight: 600, color: navy, lineHeight: 1.04, margin: 0, fontSize: 116, textAlign: "center",
};
const midTitle: React.CSSProperties = { ...bigTitle, fontSize: 84 };
const kicker: React.CSSProperties = {
  fontFamily: sans, fontSize: 22, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: orange, margin: 0, textAlign: "center",
};
const line: React.CSSProperties = { fontFamily: sans, fontSize: 40, fontWeight: 600, color: navy, margin: 0, lineHeight: 1.3, textAlign: "center" };
const rule = <div aria-hidden="true" style={{ width: 120, height: 4, background: orange, borderRadius: 2 }} />;

// A top hat: brim, tapered crown, band. The outline keeps the white hat visible.
function HatIcon({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 200 150" aria-hidden="true" focusable="false" style={{ display: "block", overflow: "visible" }}>
      <ellipse cx="100" cy="130" rx="94" ry="17" fill={fill} stroke="oklch(20% 0.02 260 / 0.35)" strokeWidth="2.5" />
      <path d="M50 128 L58 28 Q100 16 142 28 L150 128 Q100 140 50 128 Z" fill={fill} stroke="oklch(20% 0.02 260 / 0.35)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M53 98 Q100 108 147 98 L148.6 114 Q100 124 51.4 114 Z" fill="oklch(10% 0.02 260 / 0.28)" />
      <ellipse cx="100" cy="28" rx="42" ry="9" fill="oklch(100% 0 0 / 0.25)" />
    </svg>
  );
}

function HatRow({ size, gap, lang, labels }: { size: number; gap: number; lang: Lang; labels?: boolean }) {
  return (
    <div style={{ display: "flex", gap, alignItems: "flex-end", justifyContent: "center" }}>
      {HATS.map(h => (
        <div key={h.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <HatIcon fill={h.fill} size={size} />
          {labels && <span style={{ fontFamily: sans, fontSize: 24, fontWeight: 700, color: h.txt }}>{t(h.focusEn, h.focusId, lang)}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── The slides ───────────────────────────────────────────────────────────────
type Slide = { key: string; dark?: boolean; render: (lang: Lang) => React.ReactNode };

const SLIDES: Slide[] = [
  {
    key: "title",
    render: lang => (
      <>
        <HatRow size={170} gap={36} lang={lang} />
        {rule}
        <h1 style={{ ...bigTitle, fontSize: 140 }}>{t("Six Thinking Hats", "Enam Topi Berpikir", lang)}</h1>
        <p style={kicker}>{t("Think together, one hat at a time", "Berpikir bersama, satu topi pada satu waktu", lang)}</p>
      </>
    ),
  },
  {
    key: "problem",
    render: lang => (
      <>
        <p style={kicker}>{t("The problem", "Masalahnya", lang)}</p>
        <h2 style={{ ...bigTitle, fontSize: 104 }}>{t("Most meetings turn into a debate.", "Banyak rapat berubah jadi perdebatan.", lang)}</h2>
        {rule}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p style={line}>{t("One side defends.", "Satu pihak membela.", lang)}</p>
          <p style={line}>{t("The other side attacks.", "Pihak lain menyerang.", lang)}</p>
          <p style={{ ...line, color: orange }}>{t("The loudest voice wins.", "Suara paling keras yang menang.", lang)}</p>
        </div>
      </>
    ),
  },
  {
    key: "idea",
    render: lang => (
      <>
        <p style={kicker}>{t("The idea", "Gagasannya", lang)}</p>
        <div style={{ display: "flex", gap: 40 }}>
          {[0, 1, 2, 3, 4].map(n => <HatIcon key={n} fill={HAT.green.fill} size={170} />)}
        </div>
        <h2 style={{ ...bigTitle, fontSize: 96 }}>{t("Everyone wears the same hat,", "Semua memakai topi yang sama,", lang)}<br />{t("at the same time.", "pada waktu yang sama.", lang)}</h2>
        <p style={{ ...line, color: muted, fontWeight: 500 }}>{t("Not for or against. Side by side.", "Bukan pro atau kontra. Berdampingan.", lang)}</p>
      </>
    ),
  },
  {
    key: "overview",
    render: lang => (
      <>
        <h2 style={midTitle}>{t("Six hats. Six ways to think.", "Enam topi. Enam cara berpikir.", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "44px 120px", marginTop: 12 }}>
          {HATS.map(h => (
            <div key={h.key} style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <HatIcon fill={h.fill} size={150} />
              <div>
                <p style={{ fontFamily: sans, fontSize: 22, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: h.txt, margin: 0 }}>{t(h.en, h.id, lang)}</p>
                <p style={{ fontFamily: serif, fontSize: 52, fontWeight: 600, color: navy, margin: 0, lineHeight: 1.05 }}>{t(h.focusEn, h.focusId, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  ...HATS.map((h, i): Slide => ({
    key: h.key,
    render: lang => (
      <div style={{ display: "grid", gridTemplateColumns: "560px 1fr", alignItems: "center", gap: 90, width: "100%" }}>
        <div style={{ width: 560, height: 560, borderRadius: "50%", background: h.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HatIcon fill={h.fill} size={400} />
        </div>
        <div>
          <p style={{ ...kicker, textAlign: "left" }}>{t(`Hat ${i + 1} of 6 · ${h.focusEn}`, `Topi ${i + 1} dari 6 · ${h.focusId}`, lang)}</p>
          <h2 style={{ ...bigTitle, textAlign: "left", fontSize: 130, color: h.txt, margin: "10px 0 20px" }}>{t(h.en, h.id, lang)}</h2>
          <p style={{ ...line, textAlign: "left", fontSize: 38 }}>{t(h.jobEn, h.jobId, lang)}</p>
          <div style={{ width: 96, height: 4, background: orange, borderRadius: 2, margin: "40px 0 28px" }} />
          <p style={{ fontFamily: sans, fontSize: 20, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: muted, margin: "0 0 8px" }}>{t("Ask", "Tanyakan", lang)}</p>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 56, color: navy, margin: 0, lineHeight: 1.12 }}>{t(h.askEn, h.askId, lang)}</p>
        </div>
      </div>
    ),
  })),
  {
    key: "name-it",
    render: lang => (
      <div style={{ display: "grid", gridTemplateColumns: "460px 1fr", alignItems: "center", gap: 80, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <div style={{ position: "relative", background: "white", borderRadius: 28, padding: "28px 34px", boxShadow: "0 16px 40px oklch(14% 0.05 260 / 0.12)" }}>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600, fontSize: 44, color: navy, margin: 0, lineHeight: 1.15, textAlign: "center" }}>
              {t("“Let me put on the Black Hat.”", "“Saya pakai Topi Hitam dulu.”", lang)}
            </p>
            <span aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%) rotate(45deg)", width: 36, height: 36, background: "white" }} />
          </div>
          <HatIcon fill={HAT.black.fill} size={320} />
        </div>
        <div>
          <p style={{ ...kicker, textAlign: "left" }}>{t("The key habit", "Kebiasaan kunci", lang)}</p>
          <h2 style={{ ...bigTitle, textAlign: "left", fontSize: 104, margin: "12px 0 36px" }}>{t("Name the hat out loud.", "Sebutkan topinya dengan jelas.", lang)}</h2>
          <p style={{ ...line, textAlign: "left" }}>{t("The concern belongs to the hat.", "Kekhawatiran itu milik topi.", lang)}</p>
          <p style={{ ...line, textAlign: "left", color: orange }}>{t("Not to the person.", "Bukan milik orangnya.", lang)}</p>
        </div>
      </div>
    ),
  },
  {
    key: "cultures",
    render: lang => (
      <>
        <p style={kicker}>{t("Why it works across cultures", "Mengapa ini berhasil lintas budaya", lang)}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 44, marginTop: 12 }}>
          {[
            { k: "blue", en: "Everyone gets a turn.", id: "Setiap orang dapat giliran." },
            { k: "black", en: "Disagreeing becomes safe.", id: "Tidak setuju jadi aman." },
            { k: "red", en: "No one loses face.", id: "Tidak ada yang kehilangan muka." },
          ].map(r => (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 48 }}>
              <HatIcon fill={HAT[r.k].fill} size={150} />
              <p style={{ fontFamily: serif, fontSize: 76, fontWeight: 600, color: navy, margin: 0, lineHeight: 1 }}>{t(r.en, r.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "sequence",
    render: lang => (
      <>
        <h2 style={midTitle}>{t("Pick the order before you start.", "Tentukan urutannya sebelum mulai.", lang)}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 56, marginTop: 8 }}>
          {SEQUENCES.map(s => (
            <div key={s.en} style={{ display: "grid", gridTemplateColumns: "400px 1fr", alignItems: "center", gap: 40 }}>
              <p style={{ fontFamily: sans, fontSize: 36, fontWeight: 700, color: navy, margin: 0, lineHeight: 1.2 }}>{t(s.en, s.id, lang)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                {s.order.map((k, n) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 28 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 200 }}>
                      <HatIcon fill={HAT[k].fill} size={150} />
                      <span style={{ fontFamily: sans, fontSize: 24, fontWeight: 700, color: HAT[k].txt }}>{hatName(k, lang)}</span>
                    </div>
                    {n < s.order.length - 1 && (
                      <svg width="56" height="32" viewBox="0 0 56 32" aria-hidden="true"><path d="M2 16h46M36 4l14 12-14 12" fill="none" stroke={orange} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...kicker, marginTop: 8 }}>{t("The Blue Hat decides the order", "Topi Biru menentukan urutannya", lang)}</p>
      </>
    ),
  },
  {
    key: "faith",
    render: lang => (
      <div style={{ width: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <p style={kicker}>{t("Faith anchor", "Jangkar iman", lang)}</p>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 80, color: navy, margin: 0, lineHeight: 1.15, textAlign: "center" }}>
          {t("“Plans fail for lack of counsel, but with many advisers they succeed.”",
            "“Rancangan gagal kalau tidak ada pertimbangan, tetapi terlaksana kalau penasihat banyak.”", lang)}
        </p>
        <p style={{ fontFamily: sans, fontSize: 26, fontWeight: 700, color: orange, margin: 0 }}>{t("Proverbs 15:22 (NIV)", "Amsal 15:22 (TB)", lang)}</p>
        {rule}
        <p style={{ ...line, color: muted, fontWeight: 500 }}>{t("Six hats give every adviser a voice.", "Enam topi memberi suara kepada setiap penasihat.", lang)}</p>
      </div>
    ),
  },
  {
    key: "try",
    render: lang => (
      <>
        <h2 style={midTitle}>{t("Try it this week", "Coba minggu ini", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, width: "100%", marginTop: 12 }}>
          {[
            { en: "Pick one real decision.", id: "Pilih satu keputusan nyata." },
            { en: "Choose three hats.", id: "Pilih tiga topi." },
            { en: "Wear each hat together.", id: "Pakai setiap topi bersama-sama." },
          ].map((s, n) => (
            <div key={s.en} style={{ background: "white", borderRadius: 24, padding: "48px 40px", minHeight: 340, display: "flex", flexDirection: "column", gap: 24, boxShadow: "0 12px 34px oklch(14% 0.05 260 / 0.08)" }}>
              <span style={{ fontFamily: serif, fontSize: 130, fontWeight: 600, color: orange, lineHeight: 0.8 }}>{n + 1}</span>
              <p style={{ fontFamily: sans, fontSize: 40, fontWeight: 700, color: navy, margin: 0, lineHeight: 1.2 }}>{t(s.en, s.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "close",
    dark: true,
    render: lang => (
      <>
        <HatRow size={130} gap={32} lang={lang} />
        <h2 style={{ ...bigTitle, color: offWhite, fontSize: 104 }}>{t("Which hat does your team forget to wear?", "Topi mana yang sering dilupakan tim Anda?", lang)}</h2>
      </>
    ),
  },
];

// One slide on the 1600×900 canvas, with a quiet footer
function SlideFrame({ index, lang }: { index: number; lang: Lang }) {
  const s = SLIDES[index];
  const isTitle = index === 0;
  return (
    <div style={{ width: W, height: H, position: "relative", background: s.dark ? navy : offWhite, overflow: "hidden", fontFamily: sans }}>
      {isTitle && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 38%, oklch(99% 0.01 60) 0%, transparent 60%)" }} />
      )}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: orange }} />
      <div style={{ position: "absolute", inset: "64px 120px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {s.render(lang)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: s.dark ? onNavy : muted, letterSpacing: "0.04em" }}>
            <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
            {t("Six Thinking Hats", "Enam Topi Berpikir", lang)}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: s.dark ? onNavy : muted }}>{index + 1} / {SLIDES.length}</span>
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
    else rootRef.current?.requestFullscreen?.().catch(() => {});
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
    const mq = window.matchMedia(`(max-width: ${MIN_WIDTH - 1}px)`);
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

  // Stop the page behind from scrolling while presenting
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const moduleHref = `/resources/${SLUG}`;
  const showUi = uiVisible || !started || overview;

  if (tooSmall) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: navy, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: sans }}>
        <div style={{ maxWidth: 360, textAlign: "center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ margin: "0 auto 20px", display: "block" }}>
            <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M12 16v4M8 20h8" />
          </svg>
          <p style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: offWhite, margin: "0 0 12px", lineHeight: 1.2 }}>
            {t("Presenting needs a bigger screen", "Presentasi butuh layar yang lebih besar", lang)}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "oklch(82% 0.03 80)", margin: "0 0 28px" }}>
            {t("Open this module on a tablet or computer to show the slides to your team.",
              "Buka modul ini di tablet atau komputer untuk menampilkan slide kepada tim Anda.", lang)}
          </p>
          <Link href={moduleHref} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "0 22px", borderRadius: 8, background: orange, color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            {t("Back to the module", "Kembali ke modul", lang)}
          </Link>
        </div>
      </div>
    );
  }

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
        .sth-fade { animation: sthFade 0.45s ease; }
        @keyframes sthFade { from { opacity: 0; } to { opacity: 1; } }
        .sth-ui { transition: opacity 0.4s ease, transform 0.4s ease; }
        .sth-pill:hover { background: oklch(100% 0 0 / 0.12) !important; }
        .sth-pill:focus-visible, .sth-thumb:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .sth-thumb { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .sth-thumb:hover { transform: translateY(-3px); }
        @media (prefers-reduced-motion: reduce) { .sth-fade { animation: none; } .sth-ui, .sth-thumb { transition: none; } }
      `}</style>

      {/* Stage: the scaled slide, click right side for next, left side for back */}
      <div ref={stageRef}
        onClick={e => {
          if (overview) return;
          setStarted(true);
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          if (e.clientX - r.left < r.width * 0.3) prev(); else next();
        }}
        style={{ position: "absolute", inset: isFull ? 0 : 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-live="polite" aria-roledescription="slide" aria-label={`${i + 1} / ${SLIDES.length}`}
          style={{ width: W * scale, height: H * scale, position: "relative", boxShadow: isFull ? "none" : "0 30px 80px oklch(0% 0 0 / 0.45)", borderRadius: isFull ? 0 : 6, overflow: "hidden" }}>
          <div key={`${i}-${lang}`} className="sth-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="sth-ui" style={{ position: "absolute", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14 }}>
          {!isFull && (
            <button type="button" onClick={() => { setStarted(true); toggleFull(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 24px", borderRadius: 999, border: "none", background: orange, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px oklch(0% 0 0 / 0.35)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              {t("Start full screen", "Mulai layar penuh", lang)}
            </button>
          )}
          <span style={{ fontSize: 13, color: "oklch(85% 0.02 80)", background: "oklch(0% 0 0 / 0.45)", padding: "8px 14px", borderRadius: 999 }}>
            {t("Arrow keys or clicker to move. F full screen. G all slides.", "Tombol panah atau clicker untuk pindah. F layar penuh. G semua slide.", lang)}
          </span>
        </div>
      )}

      {/* Control bar */}
      <div className="sth-ui" role="toolbar" aria-label={t("Presentation controls", "Kontrol presentasi", lang)}
        style={{ position: "absolute", left: "50%", bottom: 28, transform: `translateX(-50%) translateY(${showUi ? 0 : 16}px)`, opacity: showUi ? 1 : 0, pointerEvents: showUi ? "auto" : "none",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="sth-pill" style={{ ...pill, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => { setStarted(true); prev(); }}
          aria-label={t("Previous slide", "Slide sebelumnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: offWhite, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {SLIDES.length}</span>
        <button type="button" className="sth-pill" style={{ ...pill, opacity: i === last ? 0.35 : 1 }} disabled={i === last} onClick={() => { setStarted(true); next(); }}
          aria-label={t("Next slide", "Slide berikutnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {sep}
        <button type="button" className="sth-pill" style={pill} onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={t("All slides", "Semua slide", lang)} title={t("All slides (G)", "Semua slide (G)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={t("Language", "Bahasa", lang)} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="sth-pill" aria-pressed={lang === l} onClick={() => setLang(l)}
              style={{ ...pill, height: 40, minWidth: 44, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="sth-pill" style={pill} onClick={toggleFull}
          aria-label={isFull ? t("Exit full screen", "Keluar dari layar penuh", lang) : t("Full screen", "Layar penuh", lang)}
          title={isFull ? t("Exit full screen (F)", "Keluar dari layar penuh (F)", lang) : t("Full screen (F)", "Layar penuh (F)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        {sep}
        <Link href={moduleHref} className="sth-pill" style={{ ...pill, textDecoration: "none", gap: 6 }} aria-label={t("Close presentation", "Tutup presentasi", lang)}>
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
              <button key={s.key} type="button" className="sth-thumb" onClick={() => { go(n); setOverview(false); setStarted(true); }}
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
