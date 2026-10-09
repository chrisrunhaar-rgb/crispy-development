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

const SLUG = "four-stages-competence";
const IMG = `/images/resources/${SLUG}`;
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

// Slides are designed on a fixed 16:9 canvas and scaled to fit the screen,
// so they look the same on a laptop, a projector or a TV.
const W = 1600;
const H = 900;
const MIN_WIDTH = 768;
const IDLE_MS = 2500;

// ─── Content ──────────────────────────────────────────────────────────────────
type Pair = { en: string; id: string };

type StageData = {
  number: number;
  label: Pair;
  subtitle: Pair;
  desc: Pair;
  extraLabel?: Pair;
  extra?: Pair;
  growth: Pair;
};

const STAGES: StageData[] = [
  {
    number: 1,
    label: { en: "Unconscious Incompetence", id: "Ketidakmampuan Tidak Sadar" },
    subtitle: { en: "You don't know what you don't know", id: "Anda tidak tahu apa yang tidak Anda ketahui" },
    desc: { en: "You lack a skill, and you don't realise it. The gap between what you think you can do and what you actually can is widest here.",
      id: "Anda tidak memiliki keterampilan itu, dan Anda bahkan tidak menyadarinya. Celah antara apa yang Anda pikir bisa Anda lakukan dan apa yang sebenarnya bisa Anda lakukan paling lebar di sini." },
    growth: { en: "Seek feedback from someone further along. The gap can only be crossed once you can see it, often through someone else's eyes.",
      id: "Carilah umpan balik dari orang yang lebih maju. Celah itu hanya bisa dilintasi setelah Anda bisa melihatnya, sering melalui mata orang lain." },
  },
  {
    number: 2,
    label: { en: "Conscious Incompetence", id: "Ketidakmampuan yang Disadari" },
    subtitle: { en: "You know what you don't know", id: "Anda tahu apa yang tidak Anda ketahui" },
    desc: { en: "Something revealed your gap: a failure, feedback, or watching someone else do it well. This is the most important transition in learning.",
      id: "Sesuatu telah mengungkapkan celah Anda: kegagalan, umpan balik, atau melihat orang lain melakukannya dengan baik. Ini transisi paling penting dalam belajar." },
    extraLabel: { en: "A cross-cultural note", id: "Catatan lintas budaya" },
    extra: { en: "In high-context cultures, feedback rarely arrives directly. Crossing into Stage 2 here often depends on a trusted cultural interpreter.",
      id: "Dalam budaya high-context, umpan balik jarang datang secara langsung. Perpindahan ke Tahap 2 di sini sering bergantung pada seorang penerjemah budaya yang dipercaya." },
    growth: { en: "The discomfort is not a warning sign. It is the sensation of a gap being measured for the first time.",
      id: "Ketidaknyamanan ini bukan tanda peringatan. Itu adalah sensasi dari sebuah celah yang untuk pertama kalinya diukur." },
  },
  {
    number: 3,
    label: { en: "Conscious Competence", id: "Kompetensi yang Disadari" },
    subtitle: { en: "You can do it, but it takes effort", id: "Anda bisa melakukannya, tapi membutuhkan usaha" },
    desc: { en: "You can perform the skill reliably, but it requires concentration and deliberate effort. This is where most sustained practice happens.",
      id: "Anda dapat melakukannya dengan andal, tetapi memerlukan konsentrasi dan upaya yang disengaja. Di sinilah sebagian besar latihan berkelanjutan terjadi." },
    growth: { en: "Repetition here is not redundant. It turns a fragile skill into a reliable one, especially under pressure.",
      id: "Pengulangan di sini tidak berlebihan. Itu mengubah keahlian yang rapuh menjadi keahlian yang dapat diandalkan, terutama di bawah tekanan." },
  },
  {
    number: 4,
    label: { en: "Unconscious Competence", id: "Kompetensi Tidak Sadar" },
    subtitle: { en: "Mastery, it becomes second nature", id: "Penguasaan, menjadi kebiasaan yang mengalir alami" },
    desc: { en: "The skill has become automatic. Deep practice has moved it from conscious control into intuition.",
      id: "Keterampilan itu telah menjadi otomatis. Latihan mendalam telah memindahkannya dari kontrol sadar ke intuisi." },
    extraLabel: { en: "A leadership note", id: "Catatan kepemimpinan" },
    extra: { en: "This creates a teaching challenge. When a skill becomes automatic, you lose access to the memory of not knowing it.",
      id: "Ini menciptakan tantangan mengajar. Ketika sebuah keahlian menjadi otomatis, Anda kehilangan akses pada ingatan tentang saat tidak mengetahuinya." },
    growth: { en: "Mastery in one area reveals how far you still have to go in another. A new context returns you to Stage 1. That is not regression.",
      id: "Penguasaan di satu area mengungkapkan seberapa jauh yang masih harus Anda tempuh di area lain. Konteks baru membawa Anda kembali ke Tahap 1. Itu bukan kemunduran." },
  },
];

const KEY_TAKEAWAYS: { lead: Pair; rest: Pair }[] = [
  { lead: { en: "Awareness of incompetence is the beginning of growth.", id: "Kesadaran akan ketidakmampuan adalah awal dari pertumbuhan." },
    rest: { en: "Stage 1, not Stage 2, is the most dangerous: you don't know what you don't know.", id: "Tahap 1, bukan Tahap 2, yang paling berbahaya: Anda tidak tahu apa yang Anda tidak tahu." } },
  { lead: { en: "Discomfort in Stage 2 is a signal, not a warning.", id: "Ketidaknyamanan di Tahap 2 adalah sinyal, bukan peringatan." },
    rest: { en: "It means learning has begun, not that something has gone wrong.", id: "Itu berarti pembelajaran telah dimulai, bukan bahwa ada yang salah." } },
  { lead: { en: "Stage 4 mastery creates a teaching challenge.", id: "Penguasaan Tahap 4 menciptakan tantangan mengajar." },
    rest: { en: "You must learn to unpack what you have stopped noticing.", id: "Anda harus belajar menguraikan apa yang telah Anda berhenti perhatikan." } },
  { lead: { en: "The stages repeat.", id: "Tahap-tahap ini berulang." },
    rest: { en: "Every new skill and every new culture returns a leader to Stage 1.", id: "Setiap keahlian baru dan setiap budaya baru membawa seorang pemimpin kembali ke Tahap 1." } },
];

const THIS_WEEK: Pair[] = [
  { en: "Pick one skill you are trying to grow. Name honestly which stage you are in.", id: "Pilih satu keterampilan yang sedang Anda kembangkan. Sebutkan dengan jujur di tahap mana Anda berada." },
  { en: "Find one person in Stage 1. Create a moment, not a lecture, that lets them see the gap themselves.", id: "Temukan satu orang di Tahap 1. Ciptakan sebuah momen, bukan ceramah, yang membuat mereka melihat celah itu sendiri." },
  { en: "Notice a skill that has become automatic for you. Practice putting it into words someone at Stage 2 could use.", id: "Perhatikan satu keahlian yang sudah otomatis bagi Anda. Latih mengungkapkannya dengan kata-kata yang bisa dipakai orang di Tahap 2." },
];

const QUESTIONS: Pair[] = [
  { en: "Which of the four stages are you in right now, with the skill that matters most to your leadership?", id: "Di tahap mana Anda berada sekarang, dengan keterampilan yang paling penting bagi kepemimpinan Anda?" },
  { en: "Think of someone you lead who is stuck in Stage 1. What single experience could help them see the gap?", id: "Pikirkan seseorang yang Anda pimpin yang terjebak di Tahap 1. Pengalaman seperti apa yang bisa membantu mereka melihat celah itu?" },
  { en: "Where might your own mastery be making it harder for you to teach someone at Stage 2?", id: "Di mana penguasaan Anda sendiri mungkin membuat Anda lebih sulit mengajar seseorang di Tahap 2?" },
];

// The two pairs of words the four stages are built from
const WORD_PAIRS: { heading: Pair; words: { word: Pair; meaning: Pair; strong: boolean }[] }[] = [
  {
    heading: { en: "Awareness", id: "Kesadaran" },
    words: [
      { word: { en: "Unconscious", id: "Tidak sadar" }, strong: false,
        meaning: { en: "You are not aware of it. It happens without you noticing.", id: "Anda tidak menyadarinya. Semuanya terjadi tanpa Anda perhatikan." } },
      { word: { en: "Conscious", id: "Sadar" }, strong: true,
        meaning: { en: "You are aware of it. You notice what you can and cannot do.", id: "Anda menyadarinya. Anda tahu apa yang bisa dan belum bisa Anda lakukan." } },
    ],
  },
  {
    heading: { en: "Ability", id: "Kemampuan" },
    words: [
      { word: { en: "Incompetence", id: "Ketidakmampuan" }, strong: false,
        meaning: { en: "You cannot do it yet. The skill is not there.", id: "Anda belum bisa melakukannya. Keterampilannya belum ada." } },
      { word: { en: "Competence", id: "Kompetensi" }, strong: true,
        meaning: { en: "You can do it. The skill is there and it works.", id: "Anda bisa melakukannya. Keterampilannya ada dan berjalan." } },
    ],
  },
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
const card: React.CSSProperties = {
  background: "white", borderRadius: 18, boxShadow: "0 1px 2px oklch(22% 0.10 260 / 0.06), 0 8px 24px oklch(22% 0.10 260 / 0.06)",
};
const rule = (w = 96) => <div aria-hidden="true" style={{ width: w, height: 4, background: orange, borderRadius: 2 }} />;

// Build-up reveal: hidden parts keep their space so the slide never jumps
const show = (on: boolean): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(14px)",
  transition: "opacity 0.5s ease, transform 0.5s ease",
});

// The staircase overview, built up one stage at a time.
// Stages before `upTo` are done, `upTo` is the one about to be unpacked.
function StaircaseSlide({ upTo, lang }: { upTo: number; lang: Lang }) {
  return (
    <>
      <p style={kicker}>{t("The path to mastery", "Jalan menuju penguasaan", lang)}</p>
      <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Four stages, one staircase", "Empat tahap, satu tangga", lang)}</h2>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 20, width: 1200, height: 420 }}>
        {STAGES.map((st, n) => {
          const current = n === upTo;
          const future = n > upTo;
          const stepHeight = 110 + n * 75;
          return (
            <div key={st.number} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 14 }}>
              <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 999, background: current ? orange : "transparent",
                boxShadow: current ? "0 0 0 6px oklch(65% 0.15 45 / 0.25)" : "none", visibility: current ? "visible" : "hidden" }} />
              <div style={{
                width: "100%", height: stepHeight, borderRadius: "10px 10px 0 0",
                background: future ? "transparent" : current ? orange : navy,
                border: future ? `2px dashed ${lightGray}` : "none",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
                paddingTop: 20, gap: 8,
              }}>
                <span style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, color: future ? lightGray : "white" }}>{st.number}</span>
                <span style={{ fontFamily: sans, fontSize: 16, fontWeight: 700, color: future ? lightGray : "white", textAlign: "center", padding: "0 10px",
                  visibility: future ? "hidden" : "visible", lineHeight: 1.3 }}>
                  {t(st.label.en, st.label.id, lang)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function StageDetailSlide({ n, lang, step }: { n: number; lang: Lang; step: number }) {
  const s = STAGES[n];
  const hasExtra = !!s.extra && !!s.extraLabel;
  const extraStep = 1;
  const growthStep = hasExtra ? 2 : 1;
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <span style={{ flexShrink: 0, width: 110, height: 110, borderRadius: 999, background: navy, color: offWhite, fontFamily: serif, fontSize: 60, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{s.number}</span>
        <div>
          <p style={{ ...kicker, textAlign: "left", marginBottom: 8 }}>{t(`Stage ${s.number} of 4`, `Tahap ${s.number} dari 4`, lang)}</p>
          <h2 style={{ ...midTitle, textAlign: "left", fontSize: 54 }}>{t(s.label.en, s.label.id, lang)}</h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 27, color: muted, margin: "6px 0 0" }}>{t(s.subtitle.en, s.subtitle.id, lang)}</p>
        </div>
      </div>
      <p style={{ ...body, textAlign: "left", maxWidth: 1180, fontSize: 25 }}>{t(s.desc.en, s.desc.id, lang)}</p>
      {hasExtra && (
        <div style={{ ...card, ...show(step >= extraStep), borderLeft: `8px solid ${orange}`, padding: "24px 34px" }}>
          <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: muted, margin: "0 0 10px" }}>
            {t(s.extraLabel!.en, s.extraLabel!.id, lang)}
          </p>
          <p style={{ fontFamily: sans, fontSize: 22, lineHeight: 1.45, color: navy, margin: 0 }}>{t(s.extra!.en, s.extra!.id, lang)}</p>
        </div>
      )}
      <div style={{ ...card, ...show(step >= growthStep), borderLeft: `8px solid ${navy}`, padding: "24px 34px" }}>
        <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: muted, margin: "0 0 10px" }}>
          {t("Growth", "Pertumbuhan", lang)}
        </p>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: navy, margin: 0 }}>{t(s.growth.en, s.growth.id, lang)}</p>
      </div>
    </div>
  );
}

// ─── The slides ───────────────────────────────────────────────────────────────
// `steps` is how many clicks a slide has: each click reveals the next part.
type Slide = { key: string; dark?: boolean; steps?: number; render: (lang: Lang, step: number) => React.ReactNode };

const SLIDES: Slide[] = [
  {
    key: "title",
    dark: true,
    render: lang => (
      <>
        <p style={kicker}>{t("A model for growth", "Model untuk bertumbuh", lang)}</p>
        <h1 style={{ ...bigTitle, fontSize: 120, color: offWhite, maxWidth: 1250 }}>{t("Four Stages of Competence", "Empat Tahap Kompetensi", lang)}</h1>
        {rule(120)}
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 40, lineHeight: 1.35, color: onNavy, margin: 0, textAlign: "center", maxWidth: 1100 }}>
          {t("Growth begins the moment you realise how much you don't know.",
            "Pertumbuhan dimulai pada saat Anda menyadari betapa banyak yang tidak Anda ketahui.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "intro",
    steps: 2,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("The model", "Model ini", lang)}</p>
        <h2 style={midTitle}>{t("How we actually learn", "Bagaimana kita sebenarnya belajar", lang)}</h2>
        <p style={{ ...body, maxWidth: 1200 }}>
          {t("The Four Stages of Competence maps how we actually learn. It is one of the most widely used models for skill acquisition and personal development.",
            "Empat Tahap Kompetensi memetakan bagaimana kita sebenarnya belajar. Ini salah satu model yang paling banyak digunakan untuk perolehan keterampilan dan pengembangan pribadi.", lang)}
        </p>
        <p style={{ ...body, ...show(step >= 1), maxWidth: 1200 }}>
          {t("It tracks two things: your ability, and your awareness of it. Understanding which stage you are in changes how you learn, how you coach others, and how you read the discomfort of growth.",
            "Model ini melacak dua hal: kemampuan Anda, dan kesadaran Anda akan hal itu. Memahami tahap mana yang Anda jalani mengubah cara Anda belajar, cara Anda melatih orang lain, dan cara Anda membaca ketidaknyamanan pertumbuhan.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "framework-intro",
    dark: true,
    steps: 2,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Two things move together", "Dua hal yang bergerak bersama", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite }}>{t("Competence, and awareness of it", "Kompetensi, dan kesadaran akan hal itu", lang)}</h2>
        <div style={show(step >= 1)}>{rule(120)}</div>
        <p style={{ ...body, ...show(step >= 1), color: onNavy, maxWidth: 1100 }}>
          {t("As they shift, you move from not knowing what you don't know, to a skill that no longer needs thought at all.",
            "Seiring keduanya berubah, Anda bergerak dari tidak tahu apa yang tidak Anda ketahui, menuju keahlian yang tidak lagi memerlukan pikiran sama sekali.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "word-pairs",
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Before the stages", "Sebelum tahapannya", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Two pairs of words", "Dua pasang kata", lang)}</h2>
        <div style={{ display: "flex", gap: 40, width: 1340 }}>
          {WORD_PAIRS.map((pair, n) => (
            <div key={n} style={{ ...card, ...show(step >= n), flex: 1, padding: "30px 36px", borderTop: `6px solid ${n === 0 ? orange : navy}` }}>
              <p style={{ ...kicker, textAlign: "left", fontSize: 18, color: n === 0 ? orange : navy, marginBottom: 20 }}>{t(pair.heading.en, pair.heading.id, lang)}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {pair.words.map((w, i) => (
                  <div key={i}>
                    <p style={{ fontFamily: serif, fontSize: 40, fontWeight: 600, color: w.strong ? navy : muted, margin: "0 0 4px", lineHeight: 1.1 }}>{t(w.word.en, w.word.id, lang)}</p>
                    <p style={{ fontFamily: sans, fontSize: 22, lineHeight: 1.45, color: muted, margin: 0 }}>{t(w.meaning.en, w.meaning.id, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...body, ...show(step >= 2), fontSize: 26 }}>
          {t("Each stage combines one word from each pair.", "Setiap tahap menggabungkan satu kata dari masing-masing pasangan.", lang)}
        </p>
      </>
    ),
  },
  // The staircase builds up: stage 1 revealed, its detail, stage 2 added, its detail, and so on
  ...STAGES.flatMap((st, n): Slide[] => [
    { key: `staircase-${n + 1}`, render: lang => <StaircaseSlide upTo={n} lang={lang} /> },
    { key: `stage-${n + 1}`, steps: st.extra ? 3 : 2, render: (lang, step) => <StageDetailSlide n={n} lang={lang} step={step} /> },
  ]),
  {
    key: "faith-anchor",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Faith anchor", "Pegangan iman", lang)}</p>
        <h2 style={{ ...bigTitle, color: offWhite, fontStyle: "italic", fontSize: 74, maxWidth: 1300 }}>
          &ldquo;{t("I have learned, in whatever state I am, to be content.", "Aku telah belajar mencukupkan diri dalam segala keadaan.", lang)}&rdquo;
        </h2>
        <p style={kicker}>{t("Philippians 4:11", "Filipi 4:11 (TB)", lang)}</p>
        <div style={show(step >= 1)}>{rule(120)}</div>
        <p style={{ ...body, ...show(step >= 1), color: onNavy, maxWidth: 1150 }}>
          {t("The Greek word for \"learned\" is manthano: not book-learning, but knowing that comes from doing.",
            "Kata Yunani untuk \"belajar\" adalah manthano: bukan belajar dari buku, melainkan pengenalan yang lahir dari latihan.", lang)}
        </p>
        <p style={{ ...body, ...show(step >= 2), color: onNavy, maxWidth: 1150 }}>
          {t("Paul was not always content. His four stages were lived out across a life, from persecutor to a peace that no longer needed effort to hold.",
            "Paulus tidak selalu hidup dalam kecukupan hati. Empat tahapnya dijalani sepanjang hidupnya, dari penganiaya hingga kedamaian yang tak lagi butuh usaha untuk dipertahankan.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "key-takeaways",
    steps: 4,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Key takeaways", "Poin utama", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 60 }}>{t("Four things to carry forward", "Empat hal untuk dibawa pulang", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: "100%" }}>
          {KEY_TAKEAWAYS.map((k, n) => (
            <div key={n} style={{ ...card, ...show(step >= n), padding: "30px 32px", borderTop: `6px solid ${orange}` }}>
              <p style={{ fontFamily: sans, fontSize: 17, fontWeight: 700, color: orange, letterSpacing: "0.1em", margin: "0 0 12px" }}>{n + 1}</p>
              <p style={{ fontFamily: serif, fontSize: 27, fontWeight: 600, color: navy, margin: "0 0 10px", lineHeight: 1.25 }}>{t(k.lead.en, k.lead.id, lang)}</p>
              <p style={{ fontFamily: sans, fontSize: 18, lineHeight: 1.45, color: muted, margin: 0 }}>{t(k.rest.en, k.rest.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "this-week",
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Put it into practice", "Terapkan minggu ini", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 62 }}>{t("Three things to do this week", "Tiga hal untuk dilakukan minggu ini", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: "100%" }}>
          {THIS_WEEK.map((w, n) => (
            <div key={n} style={{ ...card, ...show(step >= n), padding: "34px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
              <span style={{ width: 60, height: 60, borderRadius: 999, background: orange, color: "white", fontFamily: serif, fontSize: 36, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n + 1}</span>
              <p style={{ fontFamily: sans, fontSize: 23, lineHeight: 1.45, fontWeight: 600, color: navy, margin: 0 }}>{t(w.en, w.id, lang)}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "questions",
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Talk about it", "Diskusikan", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 66 }}>{t("Questions to sit with", "Pertanyaan untuk direnungkan", lang)}</h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 20, width: 1200 }}>
          {QUESTIONS.map((q, n) => (
            <li key={n} style={{ ...card, ...show(step >= n), display: "flex", alignItems: "center", gap: 28, padding: "26px 36px" }}>
              <span style={{ flexShrink: 0, fontFamily: serif, fontSize: 60, fontWeight: 600, color: orange, lineHeight: 1, width: 44 }}>{n + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 34, fontWeight: 500, color: navy, lineHeight: 1.25 }}>{t(q.en, q.id, lang)}</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
];

const stepsOf = (index: number) => SLIDES[index].steps ?? 1;

// One slide on the 1600×900 canvas, with a quiet footer
function SlideFrame({ index, lang, step }: { index: number; lang: Lang; step: number }) {
  const s = SLIDES[index];
  const isTitle = index === 0;
  const dark = !!s.dark;
  return (
    <div style={{ width: W, height: H, position: "relative", background: dark ? navy : offWhite, overflow: "hidden", fontFamily: sans }}>
      {isTitle && (
        <img src={`${IMG}/hero-competence.jpg`} alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, mixBlendMode: "luminosity" }} />
      )}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: orange }} />
      <div style={{ position: "absolute", inset: "64px 120px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {s.render(lang, step)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: dark ? onNavy : muted, letterSpacing: "0.04em" }}>
            <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
            {t("Four Stages of Competence", "Empat Tahap Kompetensi", lang)}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: dark ? onNavy : muted }}>{index + 1} / {SLIDES.length}</span>
        </div>
      )}
      {isTitle && (
        <img src="/logo-icon.png" alt="Crispy Development" width={40} height={40} style={{ position: "absolute", right: 56, bottom: 44, display: "block" }} />
      )}
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

  // Preload the hero image so the first slide never waits
  useEffect(() => {
    const im = new Image();
    im.src = `${IMG}/hero-competence.jpg`;
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
        .fsc-fade { animation: fscFade 0.45s ease; }
        @keyframes fscFade { from { opacity: 0; } to { opacity: 1; } }
        .fsc-ui { transition: opacity 0.4s ease, transform 0.4s ease; }
        .fsc-pill:hover { background: oklch(100% 0 0 / 0.12) !important; }
        .fsc-pill:focus-visible, .fsc-thumb:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .fsc-thumb { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fsc-thumb:hover { transform: translateY(-3px); }
        .fsc-bar { transform-origin: left; animation: fscGrow 0.9s ease both 0.2s; }
        @keyframes fscGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .fsc-fade { animation: none; opacity: 1; } .fsc-ui, .fsc-thumb { transition: none; } }
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
          <div key={`${i}-${lang}`} className="fsc-fade" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <SlideFrame index={i} lang={lang} step={step} />
          </div>
          {blank && <div style={{ position: "absolute", inset: 0, background: "black" }} />}
        </div>
      </div>

      {/* Start hint, shown until the presenter first moves on */}
      {!started && !overview && (
        <div className="fsc-ui" style={{ position: "absolute", left: "50%", bottom: phone ? 52 : 88, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
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
      <div className="fsc-ui" role="toolbar" aria-label={t("Presentation controls", "Kontrol presentasi", lang)}
        style={{ position: "absolute", left: "50%", bottom: phone ? 8 : 20, transform: `translateX(-50%) scale(${phone ? 0.6 : 0.82})`, transformOrigin: "bottom center",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)" }}>
        <button type="button" className="fsc-pill" style={{ ...pill, opacity: i === 0 ? 0.35 : 1 }} disabled={i === 0} onClick={() => { setStarted(true); prev(); }}
          aria-label={t("Previous slide", "Slide sebelumnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <span style={{ minWidth: 64, textAlign: "center", fontSize: 14, fontWeight: 700, color: offWhite, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {SLIDES.length}</span>
        <button type="button" className="fsc-pill" style={{ ...pill, opacity: atEnd ? 0.35 : 1 }} disabled={atEnd} onClick={() => { setStarted(true); next(); }}
          aria-label={t("Next slide", "Slide berikutnya", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {sep}
        <button type="button" className="fsc-pill" style={pill} onClick={() => setOverview(o => !o)} aria-pressed={overview}
          aria-label={t("All slides", "Semua slide", lang)} title={t("All slides (G)", "Semua slide (G)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
        </button>
        <div role="group" aria-label={t("Language", "Bahasa", lang)} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="fsc-pill" aria-pressed={lang === l} onClick={() => switchLang(l)}
              style={{ ...pill, height: 40, minWidth: 44, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="fsc-pill" style={pill} onClick={toggleFull}
          aria-label={isFull ? t("Exit full screen", "Keluar dari layar penuh", lang) : t("Full screen", "Layar penuh", lang)}
          title={isFull ? t("Exit full screen (F)", "Keluar dari layar penuh (F)", lang) : t("Full screen (F)", "Layar penuh (F)", lang)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
        {sep}
        <Link href={moduleHref} className="fsc-pill" style={{ ...pill, textDecoration: "none", gap: 6 }} aria-label={t("Close presentation", "Tutup presentasi", lang)}>
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
              <button key={s.key} type="button" className="fsc-thumb" onClick={() => { go(n); setOverview(false); setStarted(true); }}
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
