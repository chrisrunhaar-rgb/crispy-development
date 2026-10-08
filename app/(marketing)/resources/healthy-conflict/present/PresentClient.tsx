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

const SLUG = "healthy-conflict";
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
// Short slide versions of the Healthy Conflict module text: one sentence per line.
type Pair = { en: string; id: string };

const DEF_PARTS: Pair[] = [
  { en: "People who depend on each other", id: "Orang-orang yang saling bergantung" },
  { en: "See their goals, needs or views as opposed", id: "Merasa tujuan, kebutuhan, atau pandangan mereka saling bertentangan" },
  { en: "At least one of them feels it", id: "Setidaknya salah satu dari mereka merasakannya" },
];

const GAINS: { title: Pair; body: Pair }[] = [
  { title: { en: "Unity", id: "Kesatuan" }, body: { en: "People are on the same side again.", id: "Orang kembali berada di pihak yang sama." } },
  { title: { en: "Clarity", id: "Kejelasan" }, body: { en: "People understand the problem and each other better than before.", id: "Orang memahami masalahnya dan memahami satu sama lain lebih baik daripada sebelumnya." } },
  { title: { en: "Trust", id: "Kepercayaan" }, body: { en: "People know they can disagree and still stay together.", id: "Orang tahu bahwa mereka boleh berbeda pendapat dan tetap bersama." } },
];

const UNSAFE_LINES: Pair[] = [
  { en: "Many people have lived through unhealthy conflict.", id: "Banyak orang pernah mengalami konflik yang tidak sehat." },
  { en: "When a new conflict starts, the old fear comes back.", id: "Ketika konflik baru muncul, rasa takut yang lama kembali." },
  { en: "To them, silence feels safer than speaking.", id: "Bagi mereka, diam terasa lebih aman daripada bicara." },
];

const PILE_LINES: Pair[] = [
  { en: "Conflict that is not named does not disappear.", id: "Konflik yang tidak diungkapkan tidak hilang." },
  { en: "Small conflicts pile up.", id: "Konflik-konflik kecil menumpuk." },
  { en: "When emotions run high, they come out together.", id: "Ketika emosi memuncak, semuanya keluar sekaligus." },
  { en: "Often over something small.", id: "Sering kali karena hal yang sepele." },
];

const STAGES: { head: Pair; text: Pair }[] = [
  { head: { en: "Early stages", id: "Tahap awal" }, text: { en: "People still want both sides to win.", id: "Kedua pihak masih ingin keduanya menang." } },
  { head: { en: "Middle stages", id: "Tahap tengah" }, text: { en: "Each person wants to win and the other to lose.", id: "Masing-masing ingin menang dan ingin pihak lain kalah." } },
  { head: { en: "Last stages", id: "Tahap akhir" }, text: { en: "Both sides are willing to lose, as long as the other side loses more.", id: "Kedua pihak rela rugi, asalkan pihak lain rugi lebih besar." } },
];

const WAY_OR_AVOID: { good: boolean; head: Pair; items: Pair[] }[] = [
  { good: true, head: { en: "Giving way", id: "Mengalah" }, items: [
    { en: "Comes from care for the other person.", id: "Lahir dari kepedulian terhadap orang lain." },
    { en: "You choose to let the matter go.", id: "Anda memilih untuk melepaskan persoalan itu." },
    { en: "It is settled for you.", id: "Bagi Anda persoalan itu selesai." },
  ] },
  { good: false, head: { en: "Avoiding", id: "Menghindar" }, items: [
    { en: "Comes from fear or from wanting to escape.", id: "Lahir dari rasa takut atau keinginan untuk lari." },
    { en: "You stay silent, but the matter is still there.", id: "Anda diam, tetapi persoalannya masih ada." },
    { en: "It stays with you and adds to the pile.", id: "Persoalan itu tetap tinggal dalam diri Anda dan menambah tumpukan." },
  ] },
];

const THREE_QUESTIONS: Pair[] = [
  { en: "Was the matter named, at least to yourself and in prayer?", id: "Apakah persoalan itu sudah diungkapkan, setidaknya kepada diri sendiri dan dalam doa?" },
  { en: "Is it finished, with no bad feeling left?", id: "Apakah sudah selesai, tanpa rasa tidak enak yang tersisa?" },
  { en: "Has it stayed away, with no need to bring it back?", id: "Apakah persoalan itu tidak muncul lagi, tanpa perlu diungkit kembali?" },
];

const INDIRECT: Pair[] = [
  { en: "A private conversation", id: "Percakapan pribadi" },
  { en: "A question", id: "Pertanyaan" },
  { en: "A story", id: "Cerita" },
  { en: "A trusted third person", id: "Orang ketiga yang dipercaya" },
];

const CONTRAST: { a: Pair; h: Pair }[] = [
  { a: { en: "Silence means peace", id: "Diam dianggap damai" }, h: { en: "Silence is a warning sign", id: "Diam adalah tanda peringatan" } },
  { a: { en: "The problem stays hidden", id: "Masalah tetap tersembunyi" }, h: { en: "The problem is named early", id: "Masalah diungkapkan sejak dini" } },
  { a: { en: "People talk about each other", id: "Orang membicarakan satu sama lain di belakang" }, h: { en: "People talk to each other", id: "Orang berbicara langsung satu sama lain" } },
  { a: { en: "People adjust in private, before talking", id: "Orang menyesuaikan diri sendiri-sendiri, sebelum bicara" }, h: { en: "People adjust together, after talking", id: "Orang menyesuaikan diri bersama-sama, setelah bicara" } },
  { a: { en: "Small problems pile up", id: "Masalah kecil menumpuk" }, h: { en: "Small problems are handled while they are small", id: "Masalah kecil ditangani selagi masih kecil" } },
  { a: { en: "Trust slowly breaks down", id: "Kepercayaan perlahan runtuh" }, h: { en: "Trust grows", id: "Kepercayaan bertumbuh" } },
  { a: { en: "Unity on the surface", id: "Kesatuan di permukaan saja" }, h: { en: "Unity that holds under pressure", id: "Kesatuan yang bertahan di bawah tekanan" } },
];

const SAFE_STEPS: Pair[] = [
  { en: "Say that conflict is normal.", id: "Katakan bahwa konflik itu wajar." },
  { en: "Explain the rules before the conversation starts.", id: "Jelaskan aturannya sebelum percakapan dimulai." },
  { en: "Choose the time and the place.", id: "Pilih waktu dan tempatnya." },
];

const RULES: { title: Pair; lines: Pair[] }[] = [
  {
    title: { en: "Trust is a decision, not a feeling.", id: "Percaya adalah keputusan, bukan perasaan." },
    lines: [
      { en: "You may not feel trust at this moment.", id: "Mungkin saat ini Anda tidak merasakan kepercayaan." },
      { en: "You decide to trust the other person anyway.", id: "Anda tetap memutuskan untuk memercayai orang itu." },
      { en: "Choosing to trust keeps the conversation about the problem.", id: "Memilih untuk percaya menjaga percakapan tetap tentang masalahnya." },
    ],
  },
  {
    title: { en: "There is no winner and no loser.", id: "Tidak ada pemenang dan tidak ada yang kalah." },
    lines: [
      { en: "The goal is not to win the argument.", id: "Tujuannya bukan memenangkan perdebatan." },
      { en: "The goal is a better result for the team.", id: "Tujuannya adalah hasil yang lebih baik bagi tim." },
      { en: "If one person loses, the whole team loses something.", id: "Jika satu orang kalah, seluruh tim kehilangan sesuatu." },
    ],
  },
  {
    title: { en: "Talk about the problem, not the person.", id: "Bicarakan masalahnya, bukan orangnya." },
    lines: [
      { en: "Describe what happened and how it affects the work.", id: "Ceritakan apa yang terjadi dan bagaimana hal itu memengaruhi pekerjaan." },
      { en: "People can solve a problem together.", id: "Orang bisa memecahkan masalah bersama-sama." },
      { en: "A judgement about a person can only be defended.", id: "Penilaian terhadap pribadi seseorang hanya akan dibela mati-matian." },
    ],
  },
  {
    title: { en: "Listen until you can repeat the other person's view.", id: "Dengarkan sampai Anda bisa mengulang pandangan orang lain." },
    lines: [
      { en: "Before you answer, say back what you heard.", id: "Sebelum menjawab, ulangi apa yang Anda dengar." },
      { en: "You do not have to agree with them.", id: "Anda tidak harus setuju dengannya." },
      { en: "You do have to understand them first.", id: "Tetapi Anda harus memahaminya lebih dahulu." },
    ],
  },
  {
    title: { en: "Talk first, then adjust.", id: "Bicara dulu, baru menyesuaikan diri." },
    lines: [
      { en: "Adjusting in silence is a form of avoiding.", id: "Menyesuaikan diri tanpa bicara adalah salah satu bentuk menghindar." },
      { en: "Talk first.", id: "Bicaralah lebih dahulu." },
      { en: "Then both people adjust, based on what you agreed together.", id: "Setelah itu kedua pihak menyesuaikan diri berdasarkan apa yang disepakati bersama." },
    ],
  },
];

const NOT_LEADER_LINES: Pair[][] = [
  [{ en: "Start by raising it privately with the other person (Matthew 18:15).", id: "Mulailah dengan membicarakannya secara pribadi dengan orang yang bersangkutan (Matius 18:15)." }],
  [{ en: "If a private conversation does not feel safe, ask a trusted third person to help.", id: "Jika percakapan pribadi terasa tidak aman, mintalah bantuan orang ketiga yang Anda percaya." }],
  [
    { en: "If you are afraid to speak, ask yourself where the fear comes from.", id: "Jika Anda takut berbicara, tanyakan pada diri sendiri dari mana rasa takut itu berasal." },
    { en: "Is it this team, or an earlier experience?", id: "Dari tim ini, atau dari pengalaman sebelumnya?" },
  ],
];

const TAKEAWAYS: Pair[] = [
  { en: "Conflict is when people who depend on each other see their goals, needs or views as opposed.", id: "Konflik adalah ketika orang-orang yang saling bergantung merasa tujuan, kebutuhan, atau pandangan mereka saling bertentangan." },
  { en: "Healthy conflict is conflict faced openly and with respect.", id: "Konflik yang sehat adalah konflik yang dihadapi secara terbuka dan dengan saling menghormati." },
  { en: "The fear is real, even when the danger is not.", id: "Rasa takutnya nyata, meskipun bahayanya tidak." },
  { en: "Unnamed conflict does not go away. It piles up.", id: "Konflik yang tidak diungkapkan tidak hilang. Konflik itu menumpuk." },
  { en: "The leader creates a safe place and explains the rules before the conversation starts.", id: "Pemimpin menciptakan tempat yang aman dan menjelaskan aturannya sebelum percakapan dimulai." },
  { en: "Trust is a decision, not a feeling.", id: "Percaya adalah keputusan, bukan perasaan." },
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

function Check({ good }: { good: boolean }) {
  return (
    <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, background: good ? orange : lightGray, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={good ? "white" : muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {good ? <path d="M5 12l5 5 9-10" /> : <path d="M7 7l10 10M17 7L7 17" />}
      </svg>
    </span>
  );
}


// Larger serif statement line, used for one-sentence-per-line builds
const line = (size = 48, color = navy): React.CSSProperties => ({
  fontFamily: serif, fontSize: size, fontWeight: 600, color, margin: 0, lineHeight: 1.2, textAlign: "center",
});
const numDot = (bg: string, size = 56): React.CSSProperties => ({
  flexShrink: 0, width: size, height: size, borderRadius: 999, background: bg, color: offWhite, fontFamily: serif,
  fontSize: Math.round(size * 0.6), fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center",
});
const stack = (gap: number): React.CSSProperties => ({ display: "flex", flexDirection: "column", alignItems: "center", gap });

// The five rules overview, built up one rule at a time.
// Rules before `upTo` are shown, `upTo` is the one about to be unpacked (5 = all shown).
function RuleListSlide({ upTo, lang }: { upTo: number; lang: Lang }) {
  return (
    <>
      <div style={stack(14)}>
        <p style={kicker}>{t("The rules", "Aturannya", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Five rules for healthy conflict", "Lima aturan untuk konflik yang sehat", lang)}</h2>
        <p style={{ ...body, fontSize: 26 }}>{t("The leader explains these rules before the conversation starts.", "Pemimpin menjelaskan aturan ini sebelum percakapan dimulai.", lang)}</p>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, width: 1160 }}>
        {RULES.map((r, n) => {
          const current = n === upTo;
          const future = n > upTo;
          return (
            <li key={r.title.en} className={current ? "hc-step" : undefined}
              style={{ ...card, display: "flex", alignItems: "center", gap: 24, padding: "12px 28px",
                background: future ? "transparent" : "white", boxShadow: future ? "none" : card.boxShadow,
                border: future ? `2px dashed ${lightGray}` : current ? `2px solid ${orange}` : "2px solid transparent" }}>
              <span style={{ ...numDot(future ? "transparent" : current ? orange : navy, 48), color: future ? lightGray : offWhite, border: future ? `2px solid ${lightGray}` : "none" }}>{n + 1}</span>
              <span style={{ fontFamily: sans, fontSize: 27, fontWeight: 600, color: current ? navy : muted, visibility: future ? "hidden" : "visible" }}>
                {t(r.title.en, r.title.id, lang)}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function RuleSlide({ n, lang, step }: { n: number; lang: Lang; step: number }) {
  const r = RULES[n];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span style={{ ...numDot(navy, 120), fontSize: 72 }}>{n + 1}</span>
        <div>
          <p style={{ ...kicker, textAlign: "left", marginBottom: 10 }}>{t(`Rule ${n + 1} of 5`, `Aturan ${n + 1} dari 5`, lang)}</p>
          <h2 style={{ ...midTitle, textAlign: "left", fontSize: 62 }}>{t(r.title.en, r.title.id, lang)}</h2>
        </div>
      </div>
      <div style={{ ...card, borderLeft: `8px solid ${orange}`, padding: "40px 52px", display: "flex", flexDirection: "column", gap: 22 }}>
        {r.lines.map((l, k) => (
          <p key={l.en} style={{ ...show(step >= k), fontFamily: sans, fontSize: 34, lineHeight: 1.35, fontWeight: 500, color: navy, margin: 0 }}>
            {t(l.en, l.id, lang)}
          </p>
        ))}
      </div>
    </div>
  );
}

// A small pile of blocks that grows as the slide builds
function Pile({ count, burst }: { count: number; burst: boolean }) {
  const blocks = [
    { w: 300, x: 0 }, { w: 260, x: 22 }, { w: 230, x: -14 }, { w: 200, x: 30 }, { w: 170, x: 4 }, { w: 130, x: 20 },
  ];
  return (
    <div aria-hidden="true" style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 10, width: 380, height: 420, justifyContent: "flex-start" }}>
      {blocks.map((b, n) => (
        <div key={n} style={{
          width: b.w, height: 56, borderRadius: 10, transform: `translateX(${b.x}px)`,
          background: burst && n === blocks.length - 1 ? orange : n % 2 ? muted : navy,
          opacity: n < count ? 1 : 0, transition: "opacity 0.5s ease, background 0.5s ease",
        }} />
      ))}
    </div>
  );
}

// ─── The slides ───────────────────────────────────────────────────────────────
// `steps` is how many clicks a slide has: each click reveals the next part.
type Slide = { key: string; dark?: boolean; steps?: number; render: (lang: Lang, step: number) => React.ReactNode };

const RULE_SLIDES: Slide[] = RULES.flatMap((r, n): Slide[] => [
  { key: `rules-${n}`, render: lang => <RuleListSlide upTo={n} lang={lang} /> },
  { key: `rule-${n + 1}`, steps: r.lines.length, render: (lang, step) => <RuleSlide n={n} lang={lang} step={step} /> },
]);

const SLIDES: Slide[] = [
  {
    key: "title",
    dark: true,
    render: lang => (
      <>
        <p style={kicker}>{t("Cross-Cultural Leadership", "Kepemimpinan Lintas Budaya", lang)}</p>
        <h1 style={{ ...bigTitle, fontSize: 128, color: offWhite, maxWidth: 1250 }}>{t("Healthy Conflict", "Konflik yang Sehat", lang)}</h1>
        {rule(120)}
        <div style={stack(6)}>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 42, lineHeight: 1.35, color: onNavy, margin: 0, textAlign: "center" }}>
            {t("Conflict that is not named does not go away.", "Konflik yang tidak diungkapkan tidak hilang.", lang)}
          </p>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 42, lineHeight: 1.35, color: onNavy, margin: 0, textAlign: "center" }}>
            {t("It grows.", "Konflik itu terus membesar.", lang)}
          </p>
        </div>
      </>
    ),
  },
  {
    key: "every-team",
    steps: 3,
    render: (lang, step) => (
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", alignItems: "center", gap: 72, width: "100%" }}>
        <img src={`${IMG}/conflict-table.jpg`} alt={t("A team around a table.", "Sebuah tim duduk mengelilingi meja.", lang)}
          style={{ width: "100%", height: 560, objectFit: "cover", borderRadius: 20, display: "block", boxShadow: "0 24px 60px oklch(14% 0.05 260 / 0.22)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <p style={{ fontFamily: serif, fontSize: 64, fontWeight: 600, color: navy, margin: 0, lineHeight: 1.1 }}>
            {t("Every team has conflict.", "Setiap tim pernah mengalami konflik.", lang)}
          </p>
          {rule()}
          <p style={{ ...show(step >= 1), ...body, textAlign: "left", fontSize: 32, color: navy }}>
            {t("People who work closely together will see things differently.", "Orang yang bekerja berdekatan pasti punya cara pandang yang berbeda.", lang)}
          </p>
          <p style={{ ...show(step >= 2), fontFamily: serif, fontStyle: "italic", fontSize: 46, fontWeight: 600, color: orange, margin: 0, lineHeight: 1.15 }}>
            {t("What matters is what the team does with it.", "Yang penting adalah apa yang dilakukan tim dengan perbedaan itu.", lang)}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "def-conflict",
    steps: 4,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Key terms", "Istilah kunci", lang)}</p>
          <h2 style={midTitle}>{t("What is conflict?", "Apa itu konflik?", lang)}</h2>
        </div>
        <div style={{ ...card, borderLeft: `8px solid ${orange}`, padding: "34px 48px", maxWidth: 1240 }}>
          <p style={{ fontFamily: serif, fontSize: 40, fontWeight: 500, lineHeight: 1.3, color: navy, margin: 0 }}>
            {t("Conflict is when people who depend on each other see their goals, needs or views as opposed, and at least one of them feels it.",
              "Konflik adalah ketika orang-orang yang saling bergantung merasa tujuan, kebutuhan, atau pandangan mereka saling bertentangan, dan setidaknya salah satu dari mereka merasakannya.", lang)}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, width: "100%" }}>
          {DEF_PARTS.map((p, n) => (
            <div key={p.en} style={{ ...show(step > n), display: "flex", alignItems: "center", gap: 18, padding: "20px 24px", borderRadius: 16, border: `2px solid ${lightGray}` }}>
              <span style={numDot(orange, 48)}>{n + 1}</span>
              <span style={{ fontFamily: sans, fontSize: 23, fontWeight: 600, lineHeight: 1.35, color: navy }}>{t(p.en, p.id, lang)}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "def-healthy",
    steps: 5,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Key terms", "Istilah kunci", lang)}</p>
          <h2 style={midTitle}>{t("Healthy conflict", "Konflik yang sehat", lang)}</h2>
        </div>
        <p style={{ ...line(40), fontWeight: 500, maxWidth: 1200 }}>
          {t("Healthy conflict is when people face a conflict openly and with respect.", "Konflik yang sehat adalah ketika orang menghadapi konflik secara terbuka dan dengan saling menghormati.", lang)}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: "100%" }}>
          {GAINS.map((g, n) => (
            <div key={g.title.en} style={{ ...card, ...show(step > n), padding: "30px 30px", textAlign: "center", borderTop: `6px solid ${orange}` }}>
              <p style={{ fontFamily: serif, fontSize: 48, fontWeight: 600, color: navy, margin: "0 0 12px" }}>{t(g.title.en, g.title.id, lang)}</p>
              <p style={{ fontFamily: sans, fontSize: 22, lineHeight: 1.45, color: muted, margin: 0 }}>{t(g.body.en, g.body.id, lang)}</p>
            </div>
          ))}
        </div>
        <p style={{ ...show(step >= 4), ...line(40, orange), fontStyle: "italic" }}>
          {t("After the conflict, they continue together in unity.", "Setelah konflik, mereka melangkah bersama dalam kesatuan.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "unsafe",
    dark: true,
    steps: 4,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Why teams avoid conflict", "Mengapa tim menghindari konflik", lang)}</p>
          <h2 style={{ ...midTitle, color: offWhite }}>{t("Conflict feels unsafe", "Konflik terasa tidak aman", lang)}</h2>
        </div>
        {rule()}
        <div style={stack(22)}>
          {UNSAFE_LINES.map((l, n) => (
            <p key={l.en} style={{ ...show(step >= n), ...line(42, offWhite), fontWeight: 500 }}>{t(l.en, l.id, lang)}</p>
          ))}
        </div>
        <p style={{ ...show(step >= 3), ...line(56, orange), fontStyle: "italic" }}>
          {t("The fear is real, even when the danger is not.", "Rasa takutnya nyata, meskipun bahayanya tidak.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "piles",
    steps: 3,
    render: (lang, step) => (
      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", alignItems: "center", gap: 72, width: "100%" }}>
        <Pile count={step === 0 ? 2 : 6} burst={step >= 2} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={{ ...kicker, textAlign: "left" }}>{t("Why teams avoid conflict", "Mengapa tim menghindari konflik", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 60, textAlign: "left" }}>{t("Unnamed conflict piles up", "Konflik yang tidak diungkapkan akan menumpuk", lang)}</h2>
          {rule()}
          {PILE_LINES.map((l, n) => (
            <p key={l.en} style={{ ...show(step >= [0, 1, 2, 2][n]), ...line(36, n === 3 ? orange : navy), fontWeight: 500, textAlign: "left", fontStyle: n === 3 ? "italic" : "normal" }}>
              {t(l.en, l.id, lang)}
            </p>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "grows",
    steps: 4,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Why teams avoid conflict", "Mengapa tim menghindari konflik", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 64 }}>{t("How unhealthy conflict grows", "Bagaimana konflik yang tidak sehat membesar", lang)}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: "100%" }}>
          {STAGES.map((s, n) => (
            <div key={s.head.en} style={{ ...card, ...show(step >= n), padding: "32px 30px", borderTop: `8px solid ${[lightGray, muted, navy][n]}` }}>
              <p style={{ fontFamily: sans, fontSize: 19, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: muted, margin: "0 0 14px" }}>{t(s.head.en, s.head.id, lang)}</p>
              <p style={{ fontFamily: serif, fontSize: 36, fontWeight: 600, lineHeight: 1.25, color: navy, margin: 0 }}>{t(s.text.en, s.text.id, lang)}</p>
            </div>
          ))}
        </div>
        <p style={{ ...show(step >= 3), ...line(42, orange), fontStyle: "italic", maxWidth: 1200 }}>
          {t("Healthy conflict names a difference in the early stages.", "Konflik yang sehat mengungkapkan perbedaan pada tahap awal.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "giving-way",
    steps: 2,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Dig deeper", "Pelajari lebih dalam", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Giving way is different from avoiding", "Mengalah berbeda dari menghindar", lang)}</h2>
          <p style={body}>{t("From the outside, giving way and avoiding look the same.", "Dari luar, mengalah dan menghindar tampak sama.", lang)}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%" }}>
          {WAY_OR_AVOID.map((v, n) => (
            <div key={v.head.en} style={{ ...card, ...show(step >= n), padding: "32px 40px", borderTop: `6px solid ${v.good ? orange : lightGray}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <Check good={v.good} />
                <p style={{ fontFamily: serif, fontSize: 50, fontWeight: 600, color: navy, margin: 0, lineHeight: 1.1 }}>{t(v.head.en, v.head.id, lang)}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {v.items.map(it => (
                  <p key={it.en} style={{ fontFamily: sans, fontSize: 25, lineHeight: 1.4, color: v.good ? navy : muted, margin: 0 }}>{t(it.en, it.id, lang)}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    key: "three-questions",
    steps: 4,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Giving way or avoiding?", "Mengalah atau menghindar?", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 64 }}>{t("Three questions to tell them apart", "Tiga pertanyaan untuk membedakannya", lang)}</h2>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18, width: 1200 }}>
          {THREE_QUESTIONS.map((q, n) => (
            <li key={q.en} style={{ ...card, ...show(step >= n), display: "flex", alignItems: "center", gap: 28, padding: "22px 36px" }}>
              <span style={{ flexShrink: 0, fontFamily: serif, fontSize: 60, fontWeight: 600, color: orange, lineHeight: 1, width: 40 }}>{n + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 36, fontWeight: 500, color: navy, lineHeight: 1.25 }}>{t(q.en, q.id, lang)}</span>
            </li>
          ))}
        </ol>
        <div style={{ ...show(step >= 3), ...stack(8) }}>
          <p style={{ ...line(36, navy) }}>{t("If the answer to all three is yes, you gave way.", "Jika jawaban untuk ketiganya ya, Anda mengalah.", lang)}</p>
          <p style={{ ...line(36, orange), fontStyle: "italic" }}>{t("If not, the conflict still needs to be named.", "Jika tidak, konflik itu masih perlu diungkapkan.", lang)}</p>
        </div>
      </>
    ),
  },
  {
    key: "face",
    steps: 3,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Conflict, culture and face", "Konflik, budaya, dan muka", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 62 }}>{t("Indirect naming is still naming", "Mengungkapkan secara tidak langsung tetap mengungkapkan", lang)}</h2>
        </div>
        <p style={{ ...line(36), fontWeight: 500, maxWidth: 1240 }}>
          {t("In many cultures, direct confrontation in front of others causes loss of face for both people.",
            "Di banyak budaya, menghadapi orang secara langsung di depan orang lain membuat kedua pihak kehilangan muka.", lang)}
        </p>
        <div style={{ ...show(step >= 1), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, maxWidth: 1300 }}>
          {INDIRECT.map(w => (
            <span key={w.en} style={{ ...card, padding: "18px 30px", fontFamily: sans, fontSize: 26, fontWeight: 600, color: navy, border: `2px solid ${orange}` }}>{t(w.en, w.id, lang)}</span>
          ))}
        </div>
        <p style={{ ...show(step >= 2), ...line(38, orange), fontStyle: "italic", maxWidth: 1240 }}>
          {t("The prophet Nathan named David's sin through a story (2 Samuel 12).", "Nabi Natan mengungkapkan dosa Daud melalui sebuah cerita (2 Samuel 12).", lang)}
        </p>
      </>
    ),
  },
  {
    key: "see-it",
    render: lang => {
      const k: React.CSSProperties = {
        position: "absolute", transform: "translate(-50%,-50%)", fontFamily: sans, fontWeight: 700, fontSize: 17,
        letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", color: "oklch(45% 0.13 258)",
      };
      return (
        <div style={stack(16)}>
          <p style={kicker}>{t("See it", "Lihat gambarnya", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 52 }}>{t("What healthy conflict looks like", "Seperti apa konflik yang sehat", lang)}</h2>
          <figure style={{ margin: 0, width: 820 }}>
            <div style={{ position: "relative", background: "#ffffff", borderRadius: 12 }}>
              <div aria-hidden="true" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginBottom: -21, paddingTop: 10,
                fontFamily: sans, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.1, color: "oklch(60% 0.17 45)" }}>
                <div>{t("Unity", "Kesatuan", lang)}</div>
                <div>{t("Clarity", "Kejelasan", lang)}</div>
                <div>{t("Trust", "Kepercayaan", lang)}</div>
              </div>
              <img src={`${IMG}/healthy-conflict-visual.webp`}
                alt={t("Two people at a table. Each line has a knot: the conflict. The lines meet in a safe place and go forward as one line to a good outcome.",
                  "Dua orang di sebuah meja. Setiap garis memiliki simpul, yaitu konflik. Kedua garis bertemu di tempat yang aman dan bergerak maju sebagai satu garis menuju hasil yang baik.", lang)}
                style={{ width: 820, height: 461, display: "block", borderRadius: 12 }} />
              <span aria-hidden="true" style={{ ...k, left: "32%", top: "86%" }}>{t("Conflict", "Konflik", lang)}</span>
              <span aria-hidden="true" style={{ ...k, left: "67.6%", top: "86%" }}>{t("Conflict", "Konflik", lang)}</span>
              <span aria-hidden="true" style={{ ...k, left: "50%", top: "79%" }}>{t("Safe place", "Tempat aman", lang)}</span>
            </div>
            <figcaption style={{ ...body, fontSize: 24, marginTop: 14 }}>
              {t("Two lines come together in a safe place and go forward as one.", "Dua garis bertemu di tempat yang aman, lalu bergerak maju sebagai satu.", lang)}
            </figcaption>
          </figure>
        </div>
      );
    },
  },
  {
    key: "avoid",
    render: lang => (
      <div style={stack(16)}>
        <p style={kicker}>{t("Compare", "Bandingkan", lang)}</p>
        <h2 style={{ ...midTitle, fontSize: 52 }}>{t("Avoiding conflict", "Menghindari konflik", lang)}</h2>
        <figure style={{ margin: 0, width: 880 }}>
          <img src={`${IMG}/conflict-avoidance.webp`}
            alt={t("Two people with arms crossed turn away from each other. Their lines pull apart in opposite directions.",
              "Dua orang bersedekap dan saling membelakangi. Garis mereka saling menjauh ke arah yang berlawanan.", lang)}
            style={{ width: 880, height: 495, display: "block", borderRadius: 12 }} />
          <figcaption style={{ ...body, fontSize: 24, marginTop: 14 }}>
            {t("Each person turns away and the lines pull apart.", "Masing-masing berbalik, dan garis mereka saling menjauh.", lang)}
          </figcaption>
        </figure>
      </div>
    ),
  },
  {
    key: "contrast",
    steps: 7,
    render: (lang, step) => {
      const cell: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16, padding: "10px 22px", fontFamily: sans, fontSize: 23, lineHeight: 1.3 };
      return (
        <>
          <div style={stack(12)}>
            <p style={kicker}>{t("Compare", "Bandingkan", lang)}</p>
            <h2 style={{ ...midTitle, fontSize: 54 }}>{t("Avoiding conflict and healthy conflict", "Menghindari konflik dan konflik yang sehat", lang)}</h2>
          </div>
          <div style={{ ...card, width: 1300, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
            <div style={{ ...cell, background: lightGray, fontWeight: 700, color: muted, fontSize: 19, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 22px" }}>{t("Avoiding conflict", "Menghindari konflik", lang)}</div>
            <div style={{ ...cell, background: navy, fontWeight: 700, color: offWhite, fontSize: 19, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 22px" }}>{t("Healthy conflict", "Konflik yang sehat", lang)}</div>
            {CONTRAST.map((r, n) => (
              <div key={r.a.en} style={{ display: "contents" }}>
                <div style={{ ...cell, ...show(step >= n), color: muted, borderTop: `1px solid ${lightGray}` }}><Check good={false} />{t(r.a.en, r.a.id, lang)}</div>
                <div style={{ ...cell, ...show(step >= n), color: navy, fontWeight: 600, borderTop: `1px solid ${lightGray}` }}><Check good />{t(r.h.en, r.h.id, lang)}</div>
              </div>
            ))}
          </div>
        </>
      );
    },
  },
  {
    key: "safe-place",
    steps: 4,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("The leader's role", "Peran pemimpin", lang)}</p>
          <h2 style={midTitle}>{t("Creating a safe place", "Menciptakan tempat yang aman", lang)}</h2>
          <p style={{ ...body, maxWidth: 1150 }}>{t("A team will not name conflict until it feels safe to do so.", "Sebuah tim tidak akan mengungkapkan konflik sebelum merasa aman untuk melakukannya.", lang)}</p>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18, width: 1100 }}>
          {SAFE_STEPS.map((s, n) => (
            <li key={s.en} style={{ ...card, ...show(step > n), display: "flex", alignItems: "center", gap: 28, padding: "22px 34px" }}>
              <span style={numDot(orange, 60)}>{n + 1}</span>
              <span style={{ fontFamily: serif, fontSize: 40, fontWeight: 600, color: navy, lineHeight: 1.2 }}>{t(s.en, s.id, lang)}</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    key: "safe-not-comfortable",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("The leader's role", "Peran pemimpin", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite, maxWidth: 1250 }}>{t("Safe is not the same as comfortable.", "Aman tidak sama dengan nyaman.", lang)}</h2>
        {rule()}
        <p style={{ ...show(step >= 1), ...line(44, offWhite), fontWeight: 500 }}>{t("A safe team still disagrees.", "Tim yang aman tetap berbeda pendapat.", lang)}</p>
        <p style={{ ...show(step >= 2), ...line(46, orange), fontStyle: "italic", maxWidth: 1200 }}>
          {t("Safe means people can disagree without fear of being punished for it.", "Aman berarti orang boleh berbeda pendapat tanpa takut dihukum karenanya.", lang)}
        </p>
      </>
    ),
  },
  ...RULE_SLIDES,
  { key: "rules-all", render: lang => <RuleListSlide upTo={RULES.length} lang={lang} /> },
  {
    key: "not-leader",
    steps: 4,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("If you are not the leader", "Jika Anda bukan pemimpin", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 56 }}>{t("You can still name a conflict", "Anda tetap dapat mengungkapkan konflik", lang)}</h2>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, width: 1240 }}>
          {NOT_LEADER_LINES.map((group, n) => (
            <li key={group[0].en} style={{ ...card, ...show(step >= n), display: "flex", alignItems: "center", gap: 26, padding: "16px 32px" }}>
              <span style={numDot(navy, 48)}>{n + 1}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {group.map(l => (
                  <span key={l.en} style={{ fontFamily: sans, fontSize: 25, fontWeight: 500, lineHeight: 1.35, color: navy }}>{t(l.en, l.id, lang)}</span>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <div style={{ ...show(step >= 3), width: 1240, padding: "14px 32px", borderRadius: 14, border: `2px solid ${orange}`, display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ fontFamily: sans, fontSize: 21, lineHeight: 1.4, fontWeight: 600, color: navy, margin: 0 }}>
            {t("These rules do not cover abuse, harassment, misconduct or safeguarding concerns.",
              "Aturan ini tidak mencakup kekerasan, pelecehan, pelanggaran etika, atau masalah perlindungan anak dan orang yang rentan.", lang)}
          </p>
          <p style={{ fontFamily: sans, fontSize: 21, lineHeight: 1.4, color: muted, margin: 0 }}>
            {t("Those must be reported to the right person.", "Hal-hal itu harus dilaporkan kepada pihak yang tepat.", lang)}
          </p>
        </div>
      </>
    ),
  },
  {
    key: "faith",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Faith Anchor", "Pegangan Iman", lang)}</p>
        <h2 style={{ ...bigTitle, color: offWhite }}>{t("Silence is not peace", "Diam bukan damai", lang)}</h2>
        {rule()}
        <p style={{ ...show(step >= 1), ...line(42, offWhite), fontWeight: 500, maxWidth: 1250 }}>
          {t("Paul tells us to work to keep the unity of the Spirit (Ephesians 4:3).", "Paulus mengajak kita berusaha memelihara kesatuan Roh (Efesus 4:3).", lang)}
        </p>
        <p style={{ ...show(step >= 2), ...line(52, orange), fontStyle: "italic" }}>
          {t("Unity does not keep itself.", "Kesatuan tidak menjaga dirinya sendiri.", lang)}
        </p>
      </>
    ),
  },
  {
    key: "foothold",
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Faith Anchor", "Pegangan Iman", lang)}</p>
        <blockquote style={{ ...card, margin: 0, borderLeft: `8px solid ${orange}`, padding: "36px 52px", maxWidth: 1300 }}>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 44, lineHeight: 1.3, color: navy, margin: "0 0 18px" }}>
            &ldquo;{t("Be angry and do not sin; do not let the sun go down on your anger, and give no opportunity to the devil.",
              "Apabila kamu menjadi marah, janganlah kamu berbuat dosa: janganlah matahari terbenam, sebelum padam amarahmu, dan janganlah beri kesempatan kepada Iblis.", lang)}&rdquo;
          </p>
          <p style={{ fontFamily: sans, fontSize: 20, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: muted, margin: 0 }}>
            {t("Ephesians 4:26-27, ESV", "Efesus 4:26-27, TB", lang)}
          </p>
        </blockquote>
        <p style={{ ...show(step >= 1), ...line(38), fontWeight: 500, maxWidth: 1250 }}>
          {t("Anger that is held in and never dealt with gives the enemy a foothold.", "Amarah yang dipendam dan tidak pernah diselesaikan memberi kesempatan kepada Iblis.", lang)}
        </p>
        <div style={{ ...show(step >= 2), ...stack(6) }}>
          <p style={{ ...line(38, orange), fontStyle: "italic" }}>{t("The problem is not the quiet itself.", "Masalahnya bukan pada diam itu sendiri,", lang)}</p>
          <p style={{ ...line(38, orange), fontStyle: "italic" }}>{t("It is what we leave unresolved.", "tetapi pada apa yang kita biarkan tidak terselesaikan.", lang)}</p>
        </div>
      </>
    ),
  },
  {
    key: "our-part",
    steps: 3,
    render: (lang, step) => {
      const ref: React.CSSProperties = { fontFamily: sans, fontSize: 19, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, margin: "0 0 14px" };
      const txt: React.CSSProperties = { fontFamily: serif, fontSize: 34, fontWeight: 500, lineHeight: 1.3, color: navy, margin: 0 };
      return (
        <>
          <p style={kicker}>{t("Faith Anchor", "Pegangan Iman", lang)}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%" }}>
            <div style={{ ...card, padding: "32px 38px", borderTop: `6px solid ${orange}` }}>
              <p style={ref}>{t("James 4:1", "Yakobus 4:1", lang)}</p>
              <p style={txt}>{t("Not all conflict comes from the enemy.", "Tidak semua konflik berasal dari Iblis.", lang)}</p>
              <p style={{ ...txt, marginTop: 10 }}>{t("James says it starts in our own desires.", "Yakobus mengatakan bahwa konflik bermula dari keinginan kita sendiri.", lang)}</p>
              <p style={{ ...txt, marginTop: 10, fontWeight: 600 }}>{t("We are responsible for our part.", "Kita bertanggung jawab atas bagian kita.", lang)}</p>
            </div>
            <div style={{ ...card, ...show(step >= 1), padding: "32px 38px", borderTop: `6px solid ${orange}` }}>
              <p style={ref}>{t("Leviticus 19:17", "Imamat 19:17", lang)}</p>
              <p style={txt}>{t("Do not hate a brother in the heart.", "Jangan membenci saudara di dalam hati.", lang)}</p>
              <p style={{ ...txt, marginTop: 10, fontWeight: 600 }}>{t("Speak to him honestly.", "Tegurlah dia dengan terus terang.", lang)}</p>
            </div>
          </div>
          <div style={{ ...show(step >= 2), width: "100%", padding: "18px 32px", borderRadius: 14, border: `2px solid ${lightGray}`, display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ fontFamily: sans, fontSize: 23, lineHeight: 1.45, fontWeight: 600, color: navy, margin: 0 }}>
              {t("If you are being harmed, bullied or abused, you do not have to face that person alone.",
                "Jika Anda disakiti, dirundung, atau dianiaya, Anda tidak harus menghadapi orang itu sendirian.", lang)}
            </p>
            <p style={{ fontFamily: sans, fontSize: 23, lineHeight: 1.45, color: muted, margin: 0 }}>
              {t("Tell someone with authority to act, or a trusted person outside the situation.",
                "Beri tahu seseorang yang berwenang untuk bertindak, atau orang tepercaya di luar situasi itu.", lang)}
            </p>
          </div>
        </>
      );
    },
  },
  {
    key: "not-peace",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <>
        <p style={kicker}>{t("Faith Anchor", "Pegangan Iman", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite }}>{t("Avoiding conflict is not peace.", "Menghindari konflik bukanlah damai.", lang)}</h2>
        {rule()}
        <p style={{ ...show(step >= 1), ...line(42, offWhite), fontWeight: 500, maxWidth: 1250 }}>
          {t("Healthy conflict names the problem early, in love, and directly with the person involved.",
            "Konflik yang sehat mengungkapkan masalah sejak dini, dengan kasih, dan langsung kepada orang yang bersangkutan.", lang)}
        </p>
        <p style={{ ...show(step >= 2), ...line(50, orange), fontStyle: "italic" }}>
          {t("That is how a team keeps its unity.", "Dengan cara itulah sebuah tim menjaga kesatuannya.", lang)}
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
          {t("Is there something unresolved in your team that is safe and right to name?", "Apakah ada sesuatu yang belum terselesaikan dalam tim Anda yang aman dan tepat untuk diungkapkan?", lang)}
        </p>
        <p style={{ ...show(step >= 1), ...line(54, orange), fontStyle: "italic", maxWidth: 1250 }}>
          {t("What would it look like to name it in love this week?", "Seperti apa jadinya jika Anda mengungkapkannya dengan kasih minggu ini?", lang)}
        </p>
      </>
    ),
  },
  {
    key: "takeaways",
    steps: 6,
    render: (lang, step) => (
      <>
        <div style={stack(14)}>
          <p style={kicker}>{t("Key takeaways", "Poin penting", lang)}</p>
          <h2 style={{ ...midTitle, fontSize: 64 }}>{t("What to remember", "Yang perlu diingat", lang)}</h2>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: "100%" }}>
          {TAKEAWAYS.map((k, n) => (
            <li key={k.en} style={{ ...show(step >= n), background: lightGray, borderRadius: 16, display: "flex", alignItems: "center", gap: 22, padding: "22px 28px" }}>
              <span style={numDot(orange, 52)}>{n + 1}</span>
              <span style={{ fontFamily: sans, fontSize: 23, fontWeight: 600, lineHeight: 1.4, color: navy }}>{t(k.en, k.id, lang)}</span>
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
        <img src={`${IMG}/hero.jpg`} alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity" }} />
      )}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: orange }} />
      <div style={{ position: "absolute", inset: "64px 120px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {s.render(lang, step)}
      </div>
      {!isTitle && (
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 600, color: dark ? onNavy : muted, letterSpacing: "0.04em" }}>
            <img src="/logo-icon.png" alt="" aria-hidden="true" width={30} height={30} style={{ display: "block" }} />
            {t("Healthy Conflict", "Konflik yang Sehat", lang)}
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

  // Preload every slide image so clicking through never waits
  useEffect(() => {
    ["hero", "conflict-table"].forEach(s => { const im = new Image(); im.src = `${IMG}/${s}.jpg`; });
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
        @media (prefers-reduced-motion: reduce) { .hc-fade, .hc-step, .hc-bar { animation: none; opacity: 1; } .hc-ui, .hc-thumb { transition: none; } }
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
        <div className="hc-ui" style={{ position: "absolute", left: "50%", bottom: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
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
        style={{ position: "absolute", left: "50%", bottom: 28, transform: "translateX(-50%)",
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
