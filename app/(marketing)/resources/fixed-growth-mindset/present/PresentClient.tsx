"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
const SERIF = "Cormorant Garamond, Georgia, serif";
const SANS = "Montserrat, sans-serif";

const W = 1600;
const H = 900;
const IDLE_MS = 2500;

const MODULE_HREF = "/resources/fixed-growth-mindset";
const IMG = "/images/resources/fixed-growth-mindset/hero.jpg";
const MODULE_TITLE: Pair = { en: "Fixed vs Growth Mindset", id: "Mindset Tetap vs. Pertumbuhan" };

// ── Content, lifted from the module itself ────────────────────────────────

const DIMENSIONS: { label: Pair; growth: Pair; fixed: Pair }[] = [
  {
    label: { en: "Challenges", id: "Tantangan" },
    growth: { en: "Embraces challenges.", id: "Merangkul tantangan." },
    fixed: { en: "Defaults to familiar paths to protect against visible failure.", id: "Memilih jalur yang sudah dikenal untuk melindungi diri dari kegagalan yang terlihat." },
  },
  {
    label: { en: "Skills", id: "Keterampilan" },
    growth: { en: "Focuses on getting gradually better.", id: "Fokus pada perbaikan bertahap." },
    fixed: { en: "Believes you're either good at something or not.", id: "Percaya bahwa Anda berbakat dalam sesuatu atau tidak." },
  },
  {
    label: { en: "Obstacles", id: "Hambatan" },
    growth: { en: "Sees obstacles as an inevitable part of the process.", id: "Melihat hambatan sebagai bagian yang tak terhindarkan dari proses." },
    fixed: { en: "Gives up in the face of an obstacle.", id: "Menyerah ketika menghadapi hambatan." },
  },
  {
    label: { en: "Success of Others", id: "Kesuksesan Orang Lain" },
    growth: { en: "Is inspired by the success of others.", id: "Terinspirasi oleh kesuksesan orang lain." },
    fixed: { en: "Sees others' advancement as a comment on their own worth.", id: "Melihat kemajuan orang lain sebagai komentar tentang nilai diri sendiri." },
  },
  {
    label: { en: "Effort", id: "Usaha" },
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
    steps: 5,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Lima Dimensi" : "Five Dimensions"}</Eyebrow>
        <H2>{lang === "id" ? "Di Mana Mindset Muncul" : "Where Mindset Shows Up"}</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {DIMENSIONS.map((d, n) => (
            <div key={d.label.en} style={{ ...show(step >= n), display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderBottom: n < 4 ? `1px solid ${LIGHT_GRAY}` : "none" }}>
              <span style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: ORANGE, minWidth: 48 }}>{String(n + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: SANS, fontSize: 30, fontWeight: 600, color: NAVY }}>{d.label[lang]}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "contrast",
    steps: 5,
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
            <div key={d.label.en} style={{ ...show(step > n), display: "contents" }}>
              <div style={{ padding: "16px 20px 16px 0", fontFamily: SANS, fontSize: 20, fontWeight: 700, color: NAVY, borderTop: `1px solid ${LIGHT_GRAY}` }}>
                {d.label[lang]}
              </div>
              <div style={{ padding: "16px 20px", background: "oklch(46% 0.16 145 / 0.06)", borderTop: `1px solid ${LIGHT_GRAY}` }}>
                <p style={{ margin: 0, fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: "oklch(30% 0.08 145)" }}>{d.growth[lang]}</p>
              </div>
              <div style={{ padding: "16px 20px", background: "oklch(48% 0.18 25 / 0.06)", borderTop: `1px solid ${LIGHT_GRAY}` }}>
                <p style={{ margin: 0, fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: "oklch(32% 0.10 25)" }}>{d.fixed[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "field-reset",
    dark: true,
    steps: 3,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Di Lapangan" : "In the Field"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Mindset di Lapangan" : "Mindset in the Field"}</H2>
        <Point on={step >= 0} dark>
          {lang === "id"
            ? "Penelitian Dweck dilakukan di sekolah dan tempat kerja Barat. Pemimpin lintas budaya menguji kerangka kerja ini lebih jauh."
            : "Dweck's research was conducted in schools and Western workplaces. Cross-cultural leaders stress-test it further."}
        </Point>
        <Point on={step >= 1} dark>
          {lang === "id"
            ? "Setiap kompetensi dasar direset: bahasa, kode sosial, membaca ruangan."
            : "Every basic competency gets reset: language, social codes, reading a room."}
        </Point>
        <Point on={step >= 2} dark>
          {lang === "id"
            ? "Anda adalah pemimpin yang efektif sebelumnya. Sekarang Anda pemula lagi, dan semua orang bisa melihatnya."
            : "You were an effective leader before. Now you are a beginner again, and everyone can see it."}
        </Point>
      </div>
    ),
  },
  {
    key: "field-intensify",
    steps: 3,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Di Lapangan" : "In the Field"}</Eyebrow>
        <H2>{lang === "id" ? "Pola Tetap Menjadi Lebih Intens" : "Fixed Patterns Intensify"}</H2>
        <Point on={step >= 0}>
          {lang === "id" ? "Dalam keadaan itu, pola mindset tetap tidak hanya muncul. Mereka intensif." : "In that state, fixed mindset patterns do not just appear. They intensify."}
        </Point>
        <Point on={step >= 1}>
          {lang === "id" ? "Tantangan menjadi: “Saya tidak siap untuk ini.”" : "Challenges becomes: “I am not equipped for this.”"}
        </Point>
        <Point on={step >= 2}>
          {lang === "id"
            ? "Kesuksesan Orang Lain menjadi rasa malu: “Mereka beradaptasi begitu cepat. Pasti ada yang salah dengan saya.”"
            : "Success of Others becomes the shame of comparison: “They adapted so quickly. Something must be wrong with me.”"}
        </Point>
      </div>
    ),
  },
  {
    key: "field-face",
    dark: true,
    steps: 2,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Lapisan Budaya" : "The Cultural Layer"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Kehilangan Muka Bukan Sekadar Gagal" : "Losing Face Is Not Just Failing"}</H2>
        <Point on={step >= 0} dark>
          {lang === "id"
            ? "Kehilangan muka dalam komunitas dengan hubungan jangka panjang bukan sama dengan gagal dalam tugas. Itu kerusakan relasional."
            : "Losing face in a community where relationships are long-term and visible is not the same as failing a task. It is relational damage."}
        </Point>
        <Point on={step >= 1} dark>
          {lang === "id" ? "Ini membuat naluri menghindari risiko sangat rasional, bukan sekadar ketakutan." : "This makes the instinct to avoid risk deeply rational, not simply fearful."}
        </Point>
      </div>
    ),
  },
  {
    key: "field-growth",
    steps: 1,
    render: (lang) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Kesimpulan" : "The Point"}</Eyebrow>
        <H2>{lang === "id" ? "Bukan Tentang Menampilkan Kepercayaan Diri" : "Not About Performing Confidence"}</H2>
        <Point on={true}>
          {lang === "id"
            ? "Mindset pertumbuhan bagi pemimpin lintas budaya adalah menahan kompetensi dan ketidakmampuan bersamaan, tetap penasaran di bawah tekanan, dan memperlakukan setiap budaya baru sebagai guru, bukan ujian."
            : "A growth mindset for a cross-cultural leader is holding competence and incompetence at the same time, staying curious under pressure, and treating each new culture as a teacher, not a test."}
        </Point>
      </div>
    ),
  },
  {
    key: "shift-intro",
    dark: true,
    steps: 1,
    render: (lang) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Latihan" : "Practice"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Cara Mengubah Mindset Anda" : "How to Shift Your Mindset"}</H2>
        <Point on={true} dark>
          {lang === "id" ? "Perubahan mindset bukan keputusan sekali jalan. Ini adalah latihan." : "Mindset change is not a one-time decision. It is a practice."}
        </Point>
      </div>
    ),
  },
  ...SHIFT_STEPS.map((s): Slide => ({
    key: `shift-${s.step}`,
    steps: 2,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? `Langkah ${s.step}` : `Step ${s.step}`}</Eyebrow>
        <H2>{s.title[lang]}</H2>
        <Point on={step >= 0}>{s.point[lang]}</Point>
        <Point on={step >= 1}>{s.detail[lang]}</Point>
      </div>
    ),
  })),
  {
    key: "faith-anchor",
    dark: true,
    steps: 5,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Jangkar Iman" : "Faith Anchor"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Setia dengan Apa yang Telah Diberikan" : "Faithful with What You Have Been Given"}</H2>
        <Point on={step >= 0} dark>
          {lang === "id"
            ? "Dalam Matius 25, tiga hamba dipercayakan sejumlah uang. Dua menginvestasikannya. Satu menguburnya di tanah."
            : "In Matthew 25, three servants are entrusted with a sum of money. Two invest it. One buries it in the ground."}
        </Point>
        <Point on={step >= 1} dark>
          {lang === "id"
            ? "Hamba yang mengubur talentanya tidak memiliki masalah karakter. Ia memiliki masalah ketakutan. “Aku takut,” katanya."
            : "The servant who buried his talent did not have a character problem. He had a fear problem. “I was afraid,” he says."}
        </Point>
        <p style={{ ...show(step >= 2), fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: OFF_WHITE, margin: "0 0 22px", maxWidth: 1100 }}>
          {lang === "id" ? "Itulah mindset tetap dalam pakaian alkitabiah." : "That is a fixed mindset in biblical clothing."}
        </p>
        <Point on={step >= 3} dark>
          {lang === "id" ? "“Jangan abaikan karunia yang ada padamu” (1 Timotius 4:14)." : "“Do not neglect the gift you have” (1 Timothy 4:14)."}
        </Point>
        <p style={{ ...show(step >= 4), fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: ON_NAVY, margin: 0, maxWidth: 1100 }}>
          {lang === "id" ? "Undangannya bukan untuk tidak takut. Ini untuk menjadi setia." : "The invitation is not to be fearless. It is to be faithful."}
        </p>
      </div>
    ),
  },
  {
    key: "takeaways",
    steps: 4,
    render: (lang, step) => (
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Poin Utama" : "Key Takeaways"}</Eyebrow>
        <H2>{lang === "id" ? "Yang Perlu Dibawa" : "What to Carry Forward"}</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAKEAWAYS.map((t, n) => (
            <div key={n} style={{ ...show(step >= n), display: "flex", gap: 24, alignItems: "flex-start", padding: "14px 0" }}>
              <span style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 600, color: ORANGE, lineHeight: 1, minWidth: 48 }}>{String(n + 1).padStart(2, "0")}</span>
              <p style={{ fontFamily: SANS, fontSize: 23, lineHeight: 1.5, color: "oklch(30% 0.05 260)", margin: 0 }}>{t[lang]}</p>
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
      <div>
        <Eyebrow color={ORANGE}>{lang === "id" ? "Langkah Selanjutnya" : "Next Steps"}</Eyebrow>
        <H2 dark>{lang === "id" ? "Mindset Anda Tidak Tetap" : "Your Mindset Is Not Fixed"}</H2>
        <Point on={true} dark>
          {lang === "id"
            ? "Kesadaran adalah awal dari perubahan. Perhatikan di mana Anda melindungi diri, ketika Anda bisa bertumbuh."
            : "Awareness is the beginning of change. Notice where you are protecting yourself, when you could be growing."}
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
