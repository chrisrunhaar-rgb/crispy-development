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

const SLUG = "model-assist-watch-launch";
const IMG = `/images/resources/${SLUG}`;
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

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

const SKILLS: { en: string; id: string; k: PhaseKey }[] = [
  { en: "Starting the engine", id: "Menyalakan mesin", k: "launch" },
  { en: "Braking", id: "Mengerem", k: "watch" },
  { en: "Steering through traffic", id: "Mengarahkan di tengah lalu lintas", k: "watch" },
  { en: "Steep hills", id: "Tanjakan curam", k: "assist" },
  { en: "Road rules in a busy city", id: "Aturan jalan di kota yang ramai", k: "model" },
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

// ─── The slides ───────────────────────────────────────────────────────────────
type Slide = { key: string; render: (lang: Lang) => React.ReactNode };

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
  {
    key: "after-you",
    render: lang => (
      <>
        <img src={`${IMG}/cut-you.webp`} alt="" aria-hidden="true" width={334} height={400} style={fit(600, 440)} />
        <h2 style={midTitle}>{t("Who will do this after you?", "Siapa yang akan melakukan ini setelah Anda?", lang)}</h2>
      </>
    ),
  },
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
          style={{ ...fit(680, 560), justifySelf: "center", width: "100%" }} />
      </div>
    ),
  })),
  {
    key: "cycle",
    render: lang => (
      <img src={`${IMG}/cycle-${lang}.webp`} width={1280} height={lang === "id" ? 984 : 986}
        alt={t("The cycle: Model, Assist, Watch, Launch, and then the new leader starts again with someone else.",
          "Siklusnya: Teladani, Bantu, Amati, Mandirikan, lalu pemimpin baru memulai lagi dengan orang lain.", lang)}
        style={fit(1100, 740)} />
    ),
  },
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
    key: "skills",
    render: lang => (
      <>
        <h2 style={midTitle}>{t("Skill by skill", "Keterampilan demi keterampilan", lang)}</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, width: 900, display: "flex", flexDirection: "column", gap: 16 }}>
          {SKILLS.map(s => (
            <li key={s.en} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "20px 32px", background: "white", borderRadius: 16, boxShadow: "0 1px 2px oklch(22% 0.10 260 / 0.06), 0 8px 24px oklch(22% 0.10 260 / 0.06)" }}>
              <span style={{ fontFamily: sans, fontSize: 30, fontWeight: 600, color: navy }}>{t(s.en, s.id, lang)}</span>
              <span style={{ fontFamily: sans, fontSize: 20, fontWeight: 700, color: "white", background: phaseTone(s.k), padding: "8px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>
                {phaseLabel(s.k, lang)}
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    key: "multiply",
    render: lang => (
      <>
        <h2 style={midTitle}>{t("Multiply", "Lipat gandakan", lang)}</h2>
        <RiderRow lang={lang} labels height={260} />
        <p style={kicker}>{t("2 Timothy 2:2", "2 Timotius 2:2", lang)}</p>
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
        style={{ position: "absolute", inset: isFull ? 0 : 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div aria-live="polite" aria-roledescription="slide" aria-label={`${i + 1} / ${SLIDES.length}`}
          style={{ width: W * scale, height: H * scale, position: "relative", boxShadow: isFull ? "none" : "0 30px 80px oklch(0% 0 0 / 0.45)", borderRadius: isFull ? 0 : 6, overflow: "hidden" }}>
          <div key={`${i}-${lang}`} className="mawl-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="mawl-ui" style={{ position: "absolute", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14 }}>
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
