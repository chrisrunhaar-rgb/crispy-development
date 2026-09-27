"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// Presentation mode for Six Thinking Hats. Architecture mirrors
// healthy-conflict/present/PresentClient.tsx exactly: fixed 1600x900 canvas
// scaled to fit, click-by-click step reveal, keyboard nav, fullscreen,
// EN/ID toggle, overview thumbnail strip.

type Lang = "en" | "id";
type Pair = { en: string; id: string };
const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);
const tp = (p: Pair, lang: Lang) => (lang === "id" ? p.id : p.en);

const SLUG = "six-thinking-hats";
const IMG = `/images/resources/${SLUG}`;

const navy = "oklch(22% 0.10 260)";
const ink = "oklch(14% 0.05 260)";
const offWhite = "oklch(96% 0.005 80)";
const orange = "oklch(65% 0.15 45)";
const lightGray = "oklch(88% 0.008 80)";
const muted = "oklch(48% 0.04 260)";
const onNavy = "oklch(82% 0.025 80)";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'Montserrat', sans-serif";

const W = 1600;
const H = 900;
const MIN_WIDTH = 768;
const IDLE_MS = 2500;

type Hat = {
  key: string;
  num: string;
  nameEn: string;
  nameId: string;
  focusEn: string;
  focusId: string;
  fill: string;
  bg: string;
  txt: string;
  accent: string;
  briefEn: string;
  briefId: string;
  noteEn: string;
  noteId: string;
  questionEn: string;
  questionId: string;
};

const SIX_HATS: Hat[] = [
  {
    key: "white", num: "01", nameEn: "White", nameId: "Putih",
    focusEn: "Facts & Information", focusId: "Fakta & Informasi",
    fill: "oklch(97% 0 0)", bg: "oklch(94% 0.00 0)", txt: "oklch(35% 0.03 260)", accent: "oklch(55% 0.04 260)",
    briefEn: "Objective data only. What do we know, what don't we, what do we need to find out.",
    briefId: "Hanya data objektif. Apa yang kita ketahui, apa yang belum, apa yang perlu dicari tahu.",
    noteEn: "What counts as evidence differs by culture. Some weigh testimony and precedent, others weigh statistics.",
    noteId: "Apa yang dianggap bukti berbeda antar budaya. Sebagian mengutamakan kesaksian, sebagian lagi statistik.",
    questionEn: "What information do we have, and what do we need to find out?",
    questionId: "Informasi apa yang kita miliki, dan apa yang perlu kita cari tahu?",
  },
  {
    key: "red", num: "02", nameEn: "Red", nameId: "Merah",
    focusEn: "Feelings & Intuition", focusId: "Perasaan & Intuisi",
    fill: "oklch(55% 0.20 25)", bg: "oklch(94% 0.05 25)", txt: "oklch(42% 0.18 25)", accent: "oklch(55% 0.20 25)",
    briefEn: "Gut feelings and emotion, shared without needing to justify them.",
    briefId: "Perasaan naluriah dan emosi, disampaikan tanpa perlu dibenarkan.",
    noteEn: "Naming the hat separates the feeling from the person, so quieter voices can speak safely.",
    noteId: "Menyebut nama topi memisahkan perasaan dari orangnya, sehingga suara yang lebih pelan bisa aman bicara.",
    questionEn: "What is my gut feeling about this, and what does it tell us?",
    questionId: "Apa perasaan naluriah saya tentang ini, dan apa yang diungkapkannya?",
  },
  {
    key: "black", num: "03", nameEn: "Black", nameId: "Hitam",
    focusEn: "Critical Judgment", focusId: "Penilaian Kritis",
    fill: "oklch(18% 0.01 260)", bg: "oklch(94% 0.01 260)", txt: "oklch(22% 0.04 260)", accent: "oklch(38% 0.05 260)",
    briefEn: "Risks and weak points. Caution is the job, not the person.",
    briefId: "Risiko dan titik lemah. Kehati-hatian adalah tugas topi ini, bukan sifat pribadi.",
    noteEn: "Assigning dissent as a shared role, not a personality, widens the range of views a team considers.",
    noteId: "Menjadikan ketidaksetujuan sebagai peran bersama, bukan sifat pribadi, memperluas sudut pandang yang dipertimbangkan tim.",
    questionEn: "What are the risks, and who might be negatively affected?",
    questionId: "Apa risikonya, dan siapa yang mungkin terdampak negatif?",
  },
  {
    key: "yellow", num: "04", nameEn: "Yellow", nameId: "Kuning",
    focusEn: "Optimistic Thinking", focusId: "Pemikiran Optimistis",
    fill: "oklch(80% 0.16 95)", bg: "oklch(96% 0.06 90)", txt: "oklch(45% 0.14 85)", accent: "oklch(60% 0.16 85)",
    briefEn: "Benefits and opportunity, backed by reasoning, not wishful thinking.",
    briefId: "Manfaat dan peluang, didukung alasan, bukan sekadar angan-angan.",
    noteEn: "Naming benefits is the hat's job, not self-promotion, so modest voices get a fair hearing too.",
    noteId: "Menyebut manfaat adalah tugas topi ini, bukan promosi diri, sehingga suara yang rendah hati juga didengar.",
    questionEn: "Why might this succeed, and what value does it create?",
    questionId: "Mengapa ini bisa berhasil, dan nilai apa yang diciptakannya?",
  },
  {
    key: "green", num: "05", nameEn: "Green", nameId: "Hijau",
    focusEn: "Creativity & Alternatives", focusId: "Kreativitas & Alternatif",
    fill: "oklch(55% 0.15 145)", bg: "oklch(94% 0.05 145)", txt: "oklch(38% 0.14 145)", accent: "oklch(52% 0.16 145)",
    briefEn: "New ideas and alternatives. Judgment is suspended so possibilities can emerge.",
    briefId: "Ide baru dan alternatif. Penilaian ditangguhkan agar berbagai kemungkinan bisa muncul.",
    noteEn: "Diverse life experience is a direct creative asset for cross-cultural teams.",
    noteId: "Pengalaman hidup yang beragam adalah aset kreatif langsung bagi tim lintas budaya.",
    questionEn: "What would we try if we knew we could not fail?",
    questionId: "Apa yang akan kita coba jika kita tahu tidak akan gagal?",
  },
  {
    key: "blue", num: "06", nameEn: "Blue", nameId: "Biru",
    focusEn: "Process Control", focusId: "Kontrol Proses",
    fill: "oklch(48% 0.18 250)", bg: "oklch(93% 0.04 250)", txt: "oklch(40% 0.16 250)", accent: "oklch(55% 0.18 250)",
    briefEn: "Manages the thinking process. Opens and closes every session.",
    briefId: "Mengelola proses berpikir. Membuka dan menutup setiap sesi.",
    noteEn: "The facilitator can redirect the conversation without anyone losing face.",
    noteId: "Fasilitator bisa mengarahkan ulang percakapan tanpa siapa pun kehilangan muka.",
    questionEn: "What is our goal today, and which hats does this need?",
    questionId: "Apa tujuan kita hari ini, dan topi apa yang dibutuhkan?",
  },
];
const HAT_BY_KEY: Record<string, Hat> = Object.fromEntries(SIX_HATS.map(h => [h.key, h]));

const SEQUENCES: { labelEn: string; labelId: string; order: string[] }[] = [
  { labelEn: "Problem-Solving", labelId: "Pemecahan Masalah", order: ["green", "black", "blue"] },
  { labelEn: "Decision-Making", labelId: "Pengambilan Keputusan", order: ["white", "black", "yellow"] },
];

const TIPS: { titleEn: string; titleId: string; bodyEn: string; bodyId: string }[] = [
  {
    titleEn: "Name the hat out loud", titleId: "Sebutkan topi dengan lantang",
    bodyEn: "\"I'm wearing the Black Hat.\" Separates the concern from the person raising it.",
    bodyId: "\"Saya memakai Topi Hitam.\" Memisahkan kekhawatiran dari orang yang menyampaikannya.",
  },
  {
    titleEn: "Switch hats when you need to", titleId: "Ganti topi saat dibutuhkan",
    bodyEn: "New information changes the mode. Name it, then move.",
    bodyId: "Informasi baru mengubah mode. Sebutkan, lalu lanjutkan.",
  },
  {
    titleEn: "Use all six, not just favourites", titleId: "Gunakan semua enam, bukan hanya favorit",
    bodyEn: "The Green Hat matters exactly as much as the Black.",
    bodyId: "Topi Hijau sama pentingnya dengan Topi Hitam.",
  },
];

const QUESTIONS: Pair[] = [
  { en: "What information do we have, and what do we need to find out?", id: "Informasi apa yang kita miliki, dan apa yang perlu kita cari tahu?" },
  { en: "Who might be negatively affected, and in what ways?", id: "Siapa yang mungkin terdampak negatif, dan dengan cara apa?" },
  { en: "What is our goal today, and which hats does this conversation need?", id: "Apa tujuan kita hari ini, dan topi apa yang dibutuhkan percakapan ini?" },
];

const bigTitle: React.CSSProperties = { fontFamily: serif, fontWeight: 600, fontSize: 64, lineHeight: 1.08, margin: 0 };
const midTitle: React.CSSProperties = { fontFamily: serif, fontWeight: 600, fontSize: 44, lineHeight: 1.15, margin: "0 0 28px" };
const kicker: React.CSSProperties = { fontFamily: sans, fontSize: 15, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: orange, margin: "0 0 18px" };
const body: React.CSSProperties = { fontFamily: sans, fontSize: 22, lineHeight: 1.55, margin: 0 };
const card = (bg: string): React.CSSProperties => ({ background: bg, borderRadius: 14, padding: "26px 30px" });
const rule = (w: number): React.CSSProperties => ({ width: w, height: 3, background: orange, borderRadius: 2 });

function show(on: boolean): React.CSSProperties {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 0.45s ease, transform 0.45s ease",
  };
}

function HatIcon({ fill, size = 88 }: { fill: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.78)} viewBox="0 0 120 94" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="78" rx="54" ry="13" fill={fill} opacity={0.92} />
      <path d="M22 74 Q22 18 60 18 Q98 18 98 74 Z" fill={fill} stroke="oklch(20% 0.02 260 / 0.25)" strokeWidth={2} />
      <ellipse cx="60" cy="18" rx="16" ry="6" fill="oklch(100% 0 0 / 0.22)" />
    </svg>
  );
}

function SequenceRow({ seq, lang }: { seq: { labelEn: string; labelId: string; order: string[] }; lang: Lang }) {
  return (
    <div>
      <p style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, color: navy, margin: "0 0 14px" }}>
        {t(seq.labelEn, seq.labelId, lang)}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {seq.order.map((key, i) => {
          const h = HAT_BY_KEY[key];
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <HatIcon fill={h.fill} size={52} />
                <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: muted }}>
                  {t(h.nameEn, h.nameId, lang)}
                </span>
              </div>
              {i < seq.order.length - 1 && (
                <span style={{ fontFamily: sans, fontSize: 22, color: orange }} aria-hidden="true">&rarr;</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Slide = { key: string; dark?: boolean; steps?: number; render: (lang: Lang, step: number) => React.ReactNode };

const SLIDES: Slide[] = [
  // 1. Title
  {
    key: "title", dark: true,
    render: (lang) => (
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "80px 96px" }}>
        <p style={kicker}>{t("Cross-Cultural Facilitation", "Fasilitasi Lintas Budaya", lang)}</p>
        <h1 style={{ ...bigTitle, color: offWhite, maxWidth: 980 }}>
          {t("Six Thinking Hats", "Enam Topi Berpikir", lang)}
        </h1>
        <div style={{ ...rule(72), margin: "26px 0" }} />
        <p style={{ ...body, color: onNavy, maxWidth: 760, fontStyle: "italic" }}>
          {t(
            "\"The method separates thinking into different modes, making it easier for people to think about the right things at the right time.\"",
            "\"Metode ini memisahkan cara berpikir menjadi beberapa mode berbeda, sehingga orang lebih mudah memikirkan hal yang tepat pada waktu yang tepat.\"",
            lang
          )}
        </p>
        <p style={{ ...body, color: muted, fontSize: 17, marginTop: 10 }}>{t("Edward de Bono", "Edward de Bono", lang)}</p>
      </div>
    ),
  },
  // 2. Reframe
  {
    key: "reframe", dark: true, steps: 3,
    render: (lang, step) => (
      <div style={{ padding: "80px 96px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={kicker}>{t("The Core Idea", "Gagasan Inti", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite }}>{t("Parallel thinking, not adversarial thinking", "Berpikir paralel, bukan berpikir bertentangan", lang)}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <p style={{ ...body, color: onNavy }}>{t("Most meetings default to debate: positions are taken, defended, attacked.", "Sebagian besar rapat berjalan seperti debat: posisi diambil, dipertahankan, diserang.", lang)}</p>
          <p style={{ ...body, color: onNavy, ...show(step >= 1) }}>{t("Six Thinking Hats separates thinking into six distinct modes.", "Enam Topi Berpikir memisahkan cara berpikir menjadi enam mode yang berbeda.", lang)}</p>
          <p style={{ ...body, color: offWhite, fontWeight: 700, ...show(step >= 2) }}>{t("Everyone thinks in the same mode, at the same time, then shifts together.", "Semua orang berpikir dalam mode yang sama, di waktu yang sama, lalu berpindah bersama.", lang)}</p>
        </div>
      </div>
    ),
  },
  // 3. Six hats overview (one per click)
  {
    key: "overview", steps: 7,
    render: (lang, step) => (
      <div style={{ padding: "70px 96px", height: "100%" }}>
        <p style={kicker}>{t("The Framework", "Kerangka Kerja", lang)}</p>
        <h2 style={midTitle}>{t("The Six Hats", "Enam Topi", lang)}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {SIX_HATS.map((h, n) => (
            <div key={h.key} style={{ ...card(h.bg), display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, ...show(step > n) }}>
              <HatIcon fill={h.fill} size={64} />
              <p style={{ fontFamily: sans, fontSize: 19, fontWeight: 700, color: h.txt, margin: 0 }}>{t(h.nameEn, h.nameId, lang)}</p>
              <p style={{ fontFamily: sans, fontSize: 15, color: h.txt, margin: 0, opacity: 0.85 }}>{t(h.focusEn, h.focusId, lang)}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  // 4-9. One detail slide per hat
  ...SIX_HATS.map((h, idx): Slide => ({
    key: `hat-${h.key}`, steps: 3,
    render: (lang, step) => (
      <div style={{ padding: "70px 96px", height: "100%" }}>
        <p style={kicker}>{t(`Hat ${idx + 1} of 6`, `Topi ${idx + 1} dari 6`, lang)}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26 }}>
          <HatIcon fill={h.fill} size={80} />
          <div>
            <h2 style={{ ...midTitle, margin: 0, color: navy }}>{t(h.nameEn, h.nameId, lang)}</h2>
            <p style={{ fontFamily: sans, fontSize: 18, fontWeight: 600, color: h.accent, margin: "4px 0 0" }}>{t(h.focusEn, h.focusId, lang)}</p>
          </div>
        </div>
        <p style={{ ...body, color: ink, maxWidth: 900, marginBottom: 24 }}>{t(h.briefEn, h.briefId, lang)}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 940 }}>
          <div style={{ ...card(h.bg), ...show(step >= 1) }}>
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: h.txt, margin: "0 0 8px", opacity: 0.7 }}>
              {t("Cross-Cultural Note", "Catatan Lintas Budaya", lang)}
            </p>
            <p style={{ fontFamily: sans, fontSize: 19, lineHeight: 1.5, color: h.txt, margin: 0 }}>{t(h.noteEn, h.noteId, lang)}</p>
          </div>
          <div style={{ ...card(lightGray), ...show(step >= 2) }}>
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: muted, margin: "0 0 8px" }}>
              {t("Ask", "Tanyakan", lang)}
            </p>
            <p style={{ fontFamily: sans, fontSize: 19, lineHeight: 1.5, color: navy, margin: 0, fontStyle: "italic" }}>{t(h.questionEn, h.questionId, lang)}</p>
          </div>
        </div>
      </div>
    ),
  })),
  // 10. Sequencing
  {
    key: "sequencing", steps: 3,
    render: (lang, step) => (
      <div style={{ padding: "70px 96px", height: "100%" }}>
        <p style={kicker}>{t("Putting It Together", "Menerapkannya", lang)}</p>
        <h2 style={midTitle}>{t("Combine hats in sequence", "Menggabungkan topi secara berurutan", lang)}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div style={show(step >= 1)}><SequenceRow seq={SEQUENCES[0]} lang={lang} /></div>
          <div style={show(step >= 2)}><SequenceRow seq={SEQUENCES[1]} lang={lang} /></div>
        </div>
      </div>
    ),
  },
  // 11. Research stat
  {
    key: "stat", steps: 3,
    render: (lang, step) => (
      <div style={{ padding: "70px 96px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={kicker}>{t("What The Research Shows", "Apa Kata Penelitian", lang)}</p>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 48, ...show(step >= 1) }}>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 130, lineHeight: 1, color: orange }}>78</div>
          <p style={{ ...body, color: ink, maxWidth: 560, marginTop: 12 }}>
            {t("Indonesia's score on Hofstede's Power Distance Index, among the highest in the world. Disagreeing with a senior leader in public can feel face-threatening.",
              "Skor Indonesia pada Indeks Jarak Kekuasaan Hofstede, salah satu yang tertinggi di dunia. Tidak setuju dengan pemimpin senior di depan umum bisa terasa mengancam muka.", lang)}
          </p>
        </div>
        <p style={{ ...body, color: navy, fontWeight: 700, maxWidth: 900, marginTop: 30, ...show(step >= 2) }}>
          {t("Structured dissent roles, like the Black Hat, lead groups to consider a significantly wider range of perspectives.",
            "Peran ketidaksetujuan yang terstruktur, seperti Topi Hitam, membuat kelompok mempertimbangkan sudut pandang yang jauh lebih luas.", lang)}
        </p>
        <p style={{ fontFamily: sans, fontSize: 14, color: muted, marginTop: 26 }}>
          {t("Sources: Hofstede, Hofstede & Minkov, Cultures and Organizations (2010). Nemeth, Brown & Rogers, European Journal of Social Psychology (2001).",
            "Sumber: Hofstede, Hofstede & Minkov, Cultures and Organizations (2010). Nemeth, Brown & Rogers, European Journal of Social Psychology (2001).", lang)}
        </p>
      </div>
    ),
  },
  // 12. Faith
  {
    key: "faith", steps: 4,
    render: (lang, step) => (
      <div style={{ padding: "70px 96px", height: "100%" }}>
        <p style={kicker}>{t("Faith & Practice", "Iman & Praktik", lang)}</p>
        <h2 style={midTitle}>{t("Wisdom for the process", "Kebijaksanaan untuk proses", lang)}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
          <div style={{ ...card(offWhite), border: `1px solid ${lightGray}`, ...show(step >= 1) }}>
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, margin: "0 0 8px" }}>
              {t("Proverbs 15:22", "Amsal 15:22", lang)}
            </p>
            <p style={{ ...body, color: ink, margin: 0 }}>
              {t("Plans fail for lack of counsel, but with many advisers they succeed. The Black Hat is that counsel, built into the process.",
                "Rencana gagal karena tidak ada penasihat, tetapi dengan banyak penasihat, rencana itu terlaksana. Topi Hitam adalah penasihat itu, dibangun ke dalam prosesnya.", lang)}
            </p>
          </div>
          <div style={{ ...card(offWhite), border: `1px solid ${lightGray}`, ...show(step >= 2) }}>
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, margin: "0 0 8px" }}>
              {t("Acts 15", "Kisah Para Rasul 15", lang)}
            </p>
            <p style={{ ...body, color: ink, margin: 0 }}>
              {t("At the Jerusalem Council, diverse voices were heard, the process was deliberate, and the conclusion was framed as Spirit-guided discernment: Blue Hat principles in action.",
                "Dalam Konsili Yerusalem, suara yang beragam didengar, prosesnya dijalankan dengan sengaja, dan kesimpulannya dipahami sebagai hasil pimpinan Roh: prinsip Topi Biru dalam praktik.", lang)}
            </p>
          </div>
          <p style={{ ...body, color: navy, fontWeight: 700, ...show(step >= 3) }}>
            {t("Six Thinking Hats gives structure to wisdom the Scriptures already commend.",
              "Enam Topi Berpikir memberi struktur pada kebijaksanaan yang sudah dianjurkan dalam Kitab Suci.", lang)}
          </p>
        </div>
      </div>
    ),
  },
  // 13. Start today
  {
    key: "tips", steps: 4,
    render: (lang, step) => (
      <div style={{ padding: "70px 96px", height: "100%" }}>
        <p style={kicker}>{t("Start Today", "Mulai Hari Ini", lang)}</p>
        <h2 style={midTitle}>{t("Three ways to begin", "Tiga cara untuk memulai", lang)}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 940 }}>
          {TIPS.map((tip, n) => (
            <div key={tip.titleEn} style={{ ...card(offWhite), border: `1px solid ${lightGray}`, ...show(step > n) }}>
              <p style={{ fontFamily: sans, fontSize: 19, fontWeight: 700, color: navy, margin: "0 0 6px" }}>{t(tip.titleEn, tip.titleId, lang)}</p>
              <p style={{ fontFamily: sans, fontSize: 17, color: muted, margin: 0, lineHeight: 1.5 }}>{t(tip.bodyEn, tip.bodyId, lang)}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  // 14. Discussion questions
  {
    key: "questions", dark: true, steps: 4,
    render: (lang, step) => (
      <div style={{ padding: "80px 96px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={kicker}>{t("For Your Team", "Untuk Tim Anda", lang)}</p>
        <h2 style={{ ...midTitle, color: offWhite }}>{t("Discuss together", "Diskusikan bersama", lang)}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 980 }}>
          {QUESTIONS.map((q, n) => (
            <div key={q.en} style={{ display: "flex", gap: 18, alignItems: "flex-start", ...show(step > n) }}>
              <span style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, color: orange }}>{n + 1}</span>
              <p style={{ ...body, color: offWhite, fontSize: 24, margin: 0 }}>{tp(q, lang)}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function stepsOf(index: number) {
  return SLIDES[index]?.steps ?? 1;
}

function SlideFrame({ index, lang, step }: { index: number; lang: Lang; step: number }) {
  const slide = SLIDES[index];
  const isTitle = index === 0;
  return (
    <div
      style={{
        width: W, height: H, position: "relative", overflow: "hidden",
        background: slide.dark ? navy : offWhite,
        fontFamily: sans,
      }}
    >
      {isTitle && (
        <>
          <img src={`${IMG}/hero.jpg`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.28, mixBlendMode: "luminosity", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${navy} 0%, oklch(22% 0.10 260 / 0.75) 55%, ${navy} 100%)`, pointerEvents: "none" }} />
        </>
      )}
      {!slide.dark && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: orange }} />}
      <div style={{ position: "relative", height: "100%" }}>{slide.render(lang, step)}</div>
      <div style={{ position: "absolute", left: 96, right: 96, bottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: slide.dark ? onNavy : muted, opacity: 0.7 }}>
          {t("Six Thinking Hats", "Enam Topi Berpikir", lang)}
        </span>
        <span style={{ fontFamily: sans, fontSize: 13, color: slide.dark ? onNavy : muted, opacity: 0.7 }}>
          {index + 1} / {SLIDES.length}
        </span>
      </div>
    </div>
  );
}

function Thumb({ index, lang, active }: { index: number; lang: Lang; active: boolean }) {
  const scale = 200 / W;
  return (
    <div
      style={{
        width: 200, height: 200 * (H / W), position: "relative", overflow: "hidden", borderRadius: 8,
        border: active ? `3px solid ${orange}` : `1px solid ${lightGray}`, cursor: "pointer", flexShrink: 0,
      }}
    >
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: "none" }}>
        <SlideFrame index={index} lang={lang} step={stepsOf(index) - 1} />
      </div>
    </div>
  );
}

export default function PresentClient() {
  const [lang, setLang] = useState<Lang>("en");
  const [pos, setPos] = useState({ i: 0, s: 0 });
  const [scale, setScale] = useState(1);
  const [isFull, setIsFull] = useState(false);
  const [overview, setOverview] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [tooSmall, setTooSmall] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const last = SLIDES.length - 1;

  const wake = useCallback(() => {
    setShowUI(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setShowUI(false), IDLE_MS);
  }, []);

  const go = useCallback((i: number) => {
    setPos({ i: Math.max(0, Math.min(last, i)), s: 0 });
  }, [last]);

  const next = useCallback(() => {
    setPos(p => (p.s < stepsOf(p.i) - 1 ? { i: p.i, s: p.s + 1 } : p.i < last ? { i: p.i + 1, s: 0 } : p));
  }, [last]);

  const prev = useCallback(() => {
    setPos(p => (p.s > 0 ? { i: p.i, s: p.s - 1 } : p.i > 0 ? { i: p.i - 1, s: Math.max(0, stepsOf(p.i - 1) - 1) } : p));
  }, []);

  const toggleFull = useCallback(() => {
    if (!document.fullscreenElement) {
      wrapRef.current?.requestFullscreen?.().then(() => setIsFull(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFull(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      wake();
      if (overview) {
        if (e.key === "Escape") setOverview(false);
        return;
      }
      if (e.key === "ArrowRight" || e.key === " " || e.key.toLowerCase() === "n") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "p") { e.preventDefault(); prev(); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(last);
      else if (e.key.toLowerCase() === "f") toggleFull();
      else if (e.key.toLowerCase() === "g") setOverview(true);
      else if (e.key.toLowerCase() === "l") setLang(l => (l === "en" ? "id" : "en"));
      else if (e.key === "Escape" && isFull) toggleFull();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, last, overview, isFull, toggleFull, wake]);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setScale(Math.min(width / W, height / H));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MIN_WIDTH - 1}px)`);
    const update = () => setTooSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = `${IMG}/hero.jpg`;
  }, []);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setShowUI(false), IDLE_MS);
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [wake]);

  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; wake(); };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
  };

  if (tooSmall) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: navy, padding: 24 }}>
        <div style={{ background: offWhite, borderRadius: 16, padding: "36px 30px", maxWidth: 360, textAlign: "center", fontFamily: sans }}>
          <p style={{ fontFamily: serif, fontSize: 26, color: navy, margin: "0 0 10px" }}>
            {t("A bigger screen is needed", "Butuh layar yang lebih besar", lang)}
          </p>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, margin: "0 0 20px" }}>
            {t("Presentation mode works on a tablet or computer. Open this module there to show the slides.",
              "Mode presentasi berfungsi di tablet atau komputer. Buka modul ini di sana untuk menampilkan slide.", lang)}
          </p>
          <Link href={`/resources/${SLUG}`} style={{ color: navy, fontWeight: 700, textDecoration: "underline" }}>
            {t("Back to the module", "Kembali ke modul", lang)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={wake}
      onClick={e => { if (!overview && (e.target as HTMLElement).closest("[data-nozone]") == null) next(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ position: "fixed", inset: 0, background: ink, display: "flex", alignItems: "center", justifyContent: "center", cursor: showUI ? "default" : "none" }}
    >
      <div style={{ width: W * scale, height: H * scale, position: "relative" }}>
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <SlideFrame index={pos.i} lang={lang} step={pos.s} />
        </div>
      </div>

      {pos.i === 0 && pos.s === 0 && showUI && (
        <div style={{ position: "absolute", bottom: "18%", left: "50%", transform: "translateX(-50%)", color: onNavy, fontFamily: sans, fontSize: 14, opacity: 0.8, pointerEvents: "none" }}>
          {t("Click, or press the right arrow, to begin", "Klik, atau tekan panah kanan, untuk mulai", lang)}
        </div>
      )}

      <div
        data-nozone
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          background: "linear-gradient(0deg, oklch(0% 0 0 / 0.55), transparent)",
          opacity: showUI ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: showUI ? "auto" : "none",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" onClick={prev} aria-label={t("Previous", "Sebelumnya", lang)} style={navBtn}>&larr;</button>
          <button type="button" onClick={next} aria-label={t("Next", "Berikutnya", lang)} style={navBtn}>&rarr;</button>
          <span style={{ color: onNavy, fontFamily: sans, fontSize: 13, marginLeft: 6 }}>{pos.i + 1} / {SLIDES.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" onClick={() => setOverview(true)} style={navBtn} aria-label={t("Overview", "Ringkasan", lang)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </button>
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid oklch(100% 0 0 / 0.25)` }}>
            <button type="button" onClick={() => setLang("en")} style={{ ...langBtn, background: lang === "en" ? orange : "transparent" }}>EN</button>
            <button type="button" onClick={() => setLang("id")} style={{ ...langBtn, background: lang === "id" ? orange : "transparent" }}>ID</button>
          </div>
          <button type="button" onClick={toggleFull} style={navBtn} aria-label={t("Fullscreen", "Layar penuh", lang)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
          </button>
          <Link href={`/resources/${SLUG}`} style={{ ...navBtn, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {t("Close", "Tutup", lang)}
          </Link>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "oklch(100% 0 0 / 0.12)" }}>
        <div style={{ height: "100%", width: `${((pos.i + (pos.s + 1) / stepsOf(pos.i)) / SLIDES.length) * 100}%`, background: orange, transition: "width 0.3s ease" }} />
      </div>

      {overview && (
        <div
          data-nozone
          role="dialog" aria-modal="true"
          onClick={() => setOverview(false)}
          style={{ position: "fixed", inset: 0, background: "oklch(14% 0.05 260 / 0.92)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 1200, justifyContent: "center", maxHeight: "85vh", overflowY: "auto" }}
          >
            {SLIDES.map((s, i) => (
              <div key={s.key} onClick={() => { go(i); setOverview(false); }}>
                <Thumb index={i} lang={lang} active={i === pos.i} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 8, border: "1px solid oklch(100% 0 0 / 0.25)", background: "oklch(100% 0 0 / 0.08)",
  color: onNavy, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16,
};
const langBtn: React.CSSProperties = {
  width: 36, height: 40, border: "none", color: offWhite, fontFamily: sans, fontSize: 13, fontWeight: 700, cursor: "pointer",
};
