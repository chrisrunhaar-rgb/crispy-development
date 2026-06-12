"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { saveResourceToDashboard, saveMindsetScore } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY = "oklch(22% 0.10 260)";
const ORANGE = "oklch(65% 0.15 45)";
const OFF_WHITE = "oklch(96% 0.005 80)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT = "oklch(38% 0.05 260)";

// ── Data ──────────────────────────────────────────────────────────────────────

const DIM_LABELS: Record<string, { en: string; id: string }> = {
  "Challenges":        { en: "Challenges",             id: "Tantangan" },
  "Skills":            { en: "Skills",                 id: "Keterampilan" },
  "Obstacles":         { en: "Obstacles",              id: "Hambatan" },
  "Success of Others": { en: "Success of Others",      id: "Kesuksesan Orang Lain" },
  "Effort":            { en: "Effort",                 id: "Usaha" },
};

const QUESTIONS = [
  // CHALLENGES
  {
    dim: "Challenges",
    en: "When I face a difficult situation, I look for what I can learn from it.",
    id: "Ketika saya menghadapi situasi yang sulit, saya mencari apa yang bisa saya pelajari darinya.",
    type: "growth" as const,
  },
  {
    dim: "Challenges",
    en: "I push myself outside my comfort zone because I know that's where growth happens.",
    id: "Saya mendorong diri saya keluar dari zona nyaman karena saya tahu di situlah pertumbuhan terjadi.",
    type: "growth" as const,
  },
  {
    dim: "Challenges",
    en: "I tend to avoid situations where there's a real chance I might fail.",
    id: "Saya cenderung menghindari situasi di mana ada kemungkinan nyata saya bisa gagal.",
    type: "fixed" as const,
  },
  // SKILLS
  {
    dim: "Skills",
    en: "I believe most skills can be developed with consistent practice — intelligence and talent are starting points, not limits.",
    id: "Saya percaya bahwa sebagian besar keterampilan dapat dikembangkan dengan latihan yang konsisten — kecerdasan dan bakat adalah titik awal, bukan batasan.",
    type: "growth" as const,
  },
  {
    dim: "Skills",
    en: "I enjoy learning new things even when I'm not good at them at first.",
    id: "Saya senang mempelajari hal-hal baru bahkan ketika saya tidak mahir pada awalnya.",
    type: "growth" as const,
  },
  {
    dim: "Skills",
    en: "If I'm not naturally talented at something, I assume it's probably not for me.",
    id: "Jika saya tidak berbakat secara alami dalam sesuatu, saya berasumsi itu mungkin bukan untuk saya.",
    type: "fixed" as const,
  },
  // OBSTACLES
  {
    dim: "Obstacles",
    en: "When I hit a wall, I look for a different way around rather than giving up.",
    id: "Ketika saya menghadapi hambatan, saya mencari cara lain daripada menyerah.",
    type: "growth" as const,
  },
  {
    dim: "Obstacles",
    en: "I see setbacks as temporary and part of the process, not as a sign of my limits.",
    id: "Saya melihat kemunduran sebagai hal yang sementara dan bagian dari proses, bukan sebagai tanda batas kemampuan saya.",
    type: "growth" as const,
  },
  {
    dim: "Obstacles",
    en: "When I face a major obstacle, I often feel stuck and powerless to change the outcome.",
    id: "Ketika saya menghadapi hambatan besar, saya sering merasa terjebak dan tidak berdaya untuk mengubah hasilnya.",
    type: "fixed" as const,
  },
  // SUCCESS OF OTHERS
  {
    dim: "Success of Others",
    en: "When I see others succeeding, I feel genuinely inspired and look for what I can learn from them.",
    id: "Ketika saya melihat orang lain berhasil, saya merasa benar-benar terinspirasi dan mencari apa yang bisa saya pelajari dari mereka.",
    type: "growth" as const,
  },
  {
    dim: "Success of Others",
    en: "Other people's success motivates me — it shows me what's possible.",
    id: "Kesuksesan orang lain memotivasi saya — itu menunjukkan kepada saya apa yang mungkin.",
    type: "growth" as const,
  },
  {
    dim: "Success of Others",
    en: "When others succeed where I'm struggling, I often feel threatened or like it's somehow unfair.",
    id: "Ketika orang lain berhasil di bidang yang saya perjuangkan, saya sering merasa terancam atau seolah itu tidak adil.",
    type: "fixed" as const,
  },
  // EFFORT
  {
    dim: "Effort",
    en: "I believe consistent effort is the main ingredient for long-term success.",
    id: "Saya percaya bahwa usaha yang konsisten adalah bahan utama untuk kesuksesan jangka panjang.",
    type: "growth" as const,
  },
  {
    dim: "Effort",
    en: "I find meaning in working hard at something, even when the results aren't immediate.",
    id: "Saya menemukan makna dalam bekerja keras pada sesuatu, bahkan ketika hasilnya tidak segera terlihat.",
    type: "growth" as const,
  },
  {
    dim: "Effort",
    en: "If I have to try really hard at something, I start to wonder if I'm actually cut out for it.",
    id: "Jika saya harus benar-benar bekerja keras pada sesuatu, saya mulai bertanya-tanya apakah saya memang cocok untuk itu.",
    type: "fixed" as const,
  },
];

const SCALE_LABELS = {
  en: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  id: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"],
};

const DIMENSIONS_INFO = [
  {
    key: "challenges",
    en: {
      label: "CHALLENGES",
      growth: "Embraces challenges. Looks for opportunities for self-growth. Sees failure as part of the process.",
      fixed: "Defaults to familiar paths to protect against visible failure. Avoids situations where public mistakes are possible. Risk tolerance stays low under pressure.",
    },
    id: {
      label: "TANTANGAN",
      growth: "Merangkul tantangan. Mencari peluang untuk pertumbuhan diri. Melihat kegagalan sebagai bagian dari proses.",
      fixed: "Memilih jalur yang sudah dikenal untuk melindungi diri dari kegagalan yang terlihat. Menghindari situasi di mana kesalahan publik mungkin terjadi. Toleransi risiko tetap rendah di bawah tekanan.",
    },
  },
  {
    key: "skills",
    en: {
      label: "SKILLS",
      growth: "Focuses on getting gradually better. Believes in constantly learning new skills. Sees failures as temporary setbacks.",
      fixed: "Believes that you're either good at something or not. Has excuses for why new things can't be learned.",
    },
    id: {
      label: "KETERAMPILAN",
      growth: "Fokus pada perbaikan bertahap. Percaya pada pembelajaran keterampilan baru secara terus-menerus. Melihat kegagalan sebagai kemunduran sementara.",
      fixed: "Percaya bahwa Anda berbakat dalam sesuatu atau tidak. Punya alasan mengapa hal-hal baru tidak bisa dipelajari.",
    },
  },
  {
    key: "obstacles",
    en: {
      label: "OBSTACLES",
      growth: "Sees obstacles as an inevitable part of the process. Knows that all problems have solutions. Persists through difficulty.",
      fixed: "Gives up in the face of an obstacle. Sees obstacles as the limit of their own abilities. Feels stuck and powerless.",
    },
    id: {
      label: "HAMBATAN",
      growth: "Melihat hambatan sebagai bagian yang tak terhindarkan dari proses. Tahu bahwa semua masalah memiliki solusi. Bertahan melalui kesulitan.",
      fixed: "Menyerah ketika menghadapi hambatan. Melihat hambatan sebagai batas kemampuan sendiri. Merasa terjebak dan tidak berdaya.",
    },
  },
  {
    key: "success-of-others",
    en: {
      label: "SUCCESS OF OTHERS",
      growth: "Is inspired by the success of others. Tries to learn from their success. Sees others' wins as evidence of what's possible.",
      fixed: "Sees others' advancement as a comment on their own worth. Feels quietly displaced by peer recognition. Struggles to celebrate others when their own position feels insecure.",
    },
    id: {
      label: "KESUKSESAN ORANG LAIN",
      growth: "Terinspirasi oleh kesuksesan orang lain. Mencoba belajar dari kesuksesan mereka. Melihat kemenangan orang lain sebagai bukti apa yang mungkin.",
      fixed: "Melihat kemajuan orang lain sebagai komentar tentang nilai diri sendiri. Merasa tersisih secara diam-diam oleh pengakuan rekan. Kesulitan merayakan orang lain ketika posisi sendiri terasa tidak aman.",
    },
  },
  {
    key: "effort",
    en: {
      label: "EFFORT",
      growth: "Sees consistent effort as fruitful, even when results are slow or invisible. Commits to the process rather than demanding immediate proof. Persists because the work itself has value.",
      fixed: "Does not feel motivated to put in the extra effort. Believes that talent should be enough.",
    },
    id: {
      label: "USAHA",
      growth: "Melihat usaha yang konsisten sebagai hal yang bermanfaat, bahkan ketika hasilnya lambat atau tidak terlihat. Berkomitmen pada proses daripada menuntut bukti segera. Bertahan karena pekerjaan itu sendiri memiliki nilai.",
      fixed: "Tidak merasa termotivasi untuk memberikan upaya ekstra. Percaya bahwa bakat seharusnya sudah cukup.",
    },
  },
];

// ── Helper functions ──────────────────────────────────────────────────────────

function calcGrowthScore(answers: Record<number, number>): number {
  let total = 0;
  let count = 0;
  QUESTIONS.forEach((q, i) => {
    if (answers[i] !== undefined) {
      const raw = answers[i];
      const normalized = q.type === "growth" ? raw : (6 - raw);
      total += normalized;
      count++;
    }
  });
  if (count === 0) return 0;
  return Math.round(((total / count - 1) / 4) * 100);
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FixedGrowthMindsetClient({
  userPathway,
  isSaved,
  savedScore,
}: {
  userPathway: string | null;
  isSaved: boolean;
  savedScore?: number | null;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [growthScore, setGrowthScore] = useState<number | null>(savedScore ?? null);
  const [scoreSaved, setScoreSaved] = useState(savedScore != null);
  const [isSavingScore, startSaveScore] = useTransition();

  const t = (en: string, id: string) => lang === "id" ? id : en;

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("fixed-growth-mindset");
      setSaved(true);
    });
  }

  function handleSubmit() {
    const score = calcGrowthScore(answers);
    setGrowthScore(score);
    setQuizSubmitted(true);
  }

  function handleSaveScore() {
    if (growthScore == null) return;
    startSaveScore(async () => {
      await saveMindsetScore(growthScore);
      setScoreSaved(true);
    });
  }

  function handleRetake() {
    setAnswers({});
    setQuizSubmitted(false);
    setCurrentQ(0);
    setGrowthScore(savedScore ?? null);
    setScoreSaved(savedScore != null);
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function getMindsetLabel(score: number): string {
    if (score >= 80) return t("Strong Growth Mindset", "Mindset Pertumbuhan Kuat");
    if (score >= 65) return t("Growth-Leaning Mindset", "Mindset Cenderung Bertumbuh");
    if (score >= 45) return t("Mixed Mindset", "Mindset Campuran");
    if (score >= 30) return t("Fixed-Leaning Mindset", "Mindset Cenderung Tetap");
    return t("Fixed Mindset", "Mindset Tetap");
  }

  function getMindsetColor(score: number): string {
    if (score >= 65) return "oklch(46% 0.16 145)";
    if (score >= 45) return "oklch(65% 0.15 45)";
    return "oklch(48% 0.18 25)";
  }

  function getScoreApplicationText(): { heading: string; body: string } {
    const score = growthScore ?? 0;
    if (score <= 39) {
      return {
        heading: t("Where You Are Right Now", "Di Mana Anda Berada Saat Ini"),
        body: t(
          "Your scores suggest you are currently in a more fixed orientation. This is not a verdict — it is information. The most valuable next step is not to change your score but to get curious about what is driving these patterns. Where did they come from? What are they protecting you from? That question is worth more than a number.",
          "Skor Anda menunjukkan bahwa saat ini Anda berada dalam orientasi yang lebih tetap. Ini bukan vonis — ini adalah informasi. Langkah selanjutnya yang paling berharga bukan mengubah skor Anda, tetapi menjadi penasaran tentang apa yang mendorong pola-pola ini. Dari mana mereka berasal? Dari apa mereka melindungi Anda? Pertanyaan itu lebih berharga dari sebuah angka."
        ),
      };
    }
    if (score <= 64) {
      return {
        heading: t("A Mixed Picture", "Gambaran yang Beragam"),
        body: t(
          "Your scores show a mixed picture — growth-oriented in some areas, more defended in others. This is actually where most leaders live. The question is not 'am I growth-minded' but 'where am I most likely to go fixed and why?' That specificity is where real change begins.",
          "Skor Anda menunjukkan gambaran yang beragam — berorientasi pada pertumbuhan di beberapa area, lebih defensif di area lain. Ini sebenarnya di mana kebanyakan pemimpin berada. Pertanyaannya bukan 'apakah saya berpikiran berkembang' tetapi 'di mana saya paling mungkin menjadi tetap dan mengapa?' Kekhususan itulah tempat perubahan nyata dimulai."
        ),
      };
    }
    return {
      heading: t("Growth-Oriented, But Go Deeper", "Berorientasi Pertumbuhan, Tapi Pergi Lebih Dalam"),
      body: t(
        "Your scores reflect a broadly growth-oriented orientation. The invitation here is to go deeper than the score suggests — growth mindset can become a self-concept ('I'm the kind of person who grows') and self-concepts can be their own kind of fixed. The sharpest question for you is not where you are stuck, but where you might be coasting.",
        "Skor Anda mencerminkan orientasi yang secara luas berorientasi pada pertumbuhan. Undangan di sini adalah pergi lebih dalam dari yang disarankan skor — mindset pertumbuhan bisa menjadi konsep diri ('Saya adalah jenis orang yang berkembang') dan konsep diri bisa menjadi jenis tetap mereka sendiri. Pertanyaan paling tajam untuk Anda bukan di mana Anda terjebak, tetapi di mana Anda mungkin melaju santai."
      ),
    };
  }

  const scaleLabels = SCALE_LABELS[lang];
  const DIMS_ORDER = ["Challenges", "Skills", "Obstacles", "Success of Others", "Effort"];

  // Shared eyebrow style
  const eyebrowStyle: React.CSSProperties = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: ORANGE,
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  };

  // Shared section h2 style (dark bg variant for navy sections)
  const sectionH2Style: React.CSSProperties = {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 600,
    color: NAVY,
    margin: "0 0 12px",
  };

  const sectionH2LightStyle: React.CSSProperties = {
    ...sectionH2Style,
    color: OFF_WHITE,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "860px",
    margin: "0 auto",
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: OFF_WHITE, minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: NAVY, padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        {/* Hero photo overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/resources/fixed-growth-mindset/hero.jpg"
            alt=""
            fill
            style={{ objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity" }}
            aria-hidden="true"
            priority
          />
          {/* NAVY duotone overlay (multiply, 0.15) */}
          <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: 0.15, mixBlendMode: "multiply" }} />
        </div>
        <div style={{ ...containerStyle, position: "relative", zIndex: 1 }}>
          <p style={{ ...eyebrowStyle }}>
            {t("PERSONAL DEVELOPMENT", "PENGEMBANGAN PRIBADI")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Fixed vs. Growth Mindset", "Mindset Tetap vs. Pertumbuhan")}
          </h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40, fontStyle: "italic", fontFamily: "Cormorant Garamond, serif" }}>
            {t(
              "Drawing on Carol Dweck's widely studied framework, this assessment reveals where your mindset is fixed and where it's growing — across five key dimensions.",
              "Berdasarkan kerangka kerja Carol Dweck yang banyak dipelajari, penilaian ini mengungkapkan di mana mindset Anda tetap dan di mana ia berkembang — dalam lima dimensi utama."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={isPending}
                aria-label={t("Save to Dashboard", "Simpan ke Dashboard")}
                style={{
                  background: "transparent",
                  color: "oklch(100% 0 0)",
                  padding: "0 24px",
                  minHeight: 44,
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  border: "1px solid oklch(100% 0 0 / 0.5)",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "oklch(100% 0 0 / 0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {isPending ? t("Saving...", "Menyimpan...") : t("Save to Dashboard", "Simpan ke Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard")}
              </span>
            )}
            {growthScore != null && (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 18, fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: getMindsetColor(growthScore) }}>
                  {growthScore}%
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: getMindsetColor(growthScore) }}>
                  {getMindsetLabel(growthScore)}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DWECK INTRO */}
      <section style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ ...containerStyle }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "center" }}>
            <div>
              <p style={{ ...eyebrowStyle }}>{t("THE RESEARCH", "PENELITIAN")}</p>
              <h2 style={{ ...sectionH2Style }}>
                {t("The Research Behind It", "Penelitian di Baliknya")}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: BODY_TEXT, margin: "0 0 16px" }}>
                {t(
                  "According to researcher Carol Dweck, there are two types of mindsets. A fixed mindset believes that qualities like intelligence or talent are innate — you have what you were given. A growth mindset holds that you can improve any quality through effort and persistence.",
                  "Menurut peneliti Carol Dweck, ada dua jenis mindset. Mindset tetap percaya bahwa kualitas seperti kecerdasan atau bakat bersifat bawaan — Anda memiliki apa yang diberikan kepada Anda. Mindset pertumbuhan berpendapat bahwa Anda dapat meningkatkan kualitas apa pun melalui usaha dan ketekunan."
                )}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: BODY_TEXT, margin: 0 }}>
                {t(
                  "Research suggests growth mindset is associated with greater persistence and more adaptive responses to failure, though effects vary significantly across individuals and cultural contexts. The shift often starts with recognizing which mindset is operating in a given area of your life.",
                  "Penelitian menunjukkan bahwa mindset pertumbuhan dikaitkan dengan ketekunan yang lebih besar dan respons yang lebih adaptif terhadap kegagalan, meskipun efeknya sangat bervariasi di antara individu dan konteks budaya. Pergeseran ini sering dimulai dengan mengenali mindset mana yang beroperasi di area kehidupan Anda tertentu."
                )}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "oklch(46% 0.16 145 / 0.08)", borderRadius: 10, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: "oklch(34% 0.12 145)", marginBottom: 8 }}>
                  {t("Growth Mindset", "Mindset Pertumbuhan")}
                </div>
                <div style={{ fontSize: 13, color: "oklch(38% 0.10 145)", lineHeight: 1.5 }}>
                  {t("Defines success as gradual improvement and growth", "Mendefinisikan keberhasilan sebagai perbaikan dan pertumbuhan bertahap")}
                </div>
              </div>
              <div style={{ background: "oklch(48% 0.18 25 / 0.08)", borderRadius: 10, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: "oklch(38% 0.14 25)", marginBottom: 8 }}>
                  {t("Fixed Mindset", "Mindset Tetap")}
                </div>
                <div style={{ fontSize: 13, color: "oklch(42% 0.10 25)", lineHeight: 1.5 }}>
                  {t("Defines success as being right and not failing", "Mendefinisikan keberhasilan sebagai benar dan tidak gagal")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIVE DIMENSIONS */}
      <section style={{ background: LIGHT_GRAY, padding: "72px 24px" }}>
        <div style={{ ...containerStyle }}>
          <p style={{ ...eyebrowStyle }}>{t("FIVE DIMENSIONS", "LIMA DIMENSI")}</p>
          <h2 style={{ ...sectionH2Style }}>
            {t("Five Key Dimensions", "Lima Dimensi Utama")}
          </h2>
          <p style={{ fontSize: 15, color: BODY_TEXT, marginBottom: 36, lineHeight: 1.65 }}>
            {t(
              "The assessment covers five areas where your mindset has the greatest impact on how you perform and grow.",
              "Penilaian ini mencakup lima area di mana mindset Anda memiliki dampak terbesar pada cara Anda berkinerja dan berkembang."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DIMENSIONS_INFO.map((d, i) => {
              const ldata = d[lang];
              return (
                <div key={d.key} style={{ background: "white", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0 }}>
                    <div style={{ padding: "20px 24px", display: "flex", alignItems: "center" }}>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: ORANGE, lineHeight: 1, minWidth: 32 }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div style={{ padding: "20px 24px 20px 0", background: "oklch(46% 0.16 145 / 0.05)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", marginBottom: 6 }}>
                        {t("GROWTH", "PERTUMBUHAN")}: {ldata.label}
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: "oklch(30% 0.08 145)", margin: 0 }}>{ldata.growth}</p>
                    </div>
                    <div style={{ padding: "20px 24px 20px 16px", background: "oklch(48% 0.18 25 / 0.05)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 6 }}>
                        {t("FIXED", "TETAP")}: {ldata.label}
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: "oklch(32% 0.10 25)", margin: 0 }}>{ldata.fixed}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MINDSET IN THE FIELD */}
      <section style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ ...containerStyle }}>
          <p style={{ ...eyebrowStyle }}>{t("IN THE FIELD", "DI LAPANGAN")}</p>
          <h2 style={{ ...sectionH2Style }}>
            {t("Mindset in the Field", "Pola Pikir di Lapangan")}
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: BODY_TEXT }}>
            <p style={{ marginBottom: 16 }}>
              {t(
                "Dweck's research was conducted in schools and Western workplaces. The framework is solid. But cross-cultural leaders live and work in conditions that stress-test mindset in ways the original research did not anticipate.",
                "Penelitian Dweck dilakukan di sekolah-sekolah dan tempat kerja Barat. Kerangka kerjanya kuat. Tetapi para pemimpin lintas budaya hidup dan bekerja dalam kondisi yang menguji pola pikir dengan cara yang tidak diantisipasi oleh penelitian aslinya."
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "When you move into a new culture, every basic competency gets reset. Language, social codes, reading a room, knowing when to speak, knowing when silence is the right move. You were an effective leader before. Now you are a beginner again, and everyone can see it. For leaders whose identity is tied to being capable, this is not just uncomfortable. It is destabilizing.",
                "Ketika Anda pindah ke budaya baru, setiap kompetensi dasar direset. Bahasa, kode sosial, membaca ruangan, mengetahui kapan harus berbicara, mengetahui kapan diam adalah langkah yang tepat. Anda adalah pemimpin yang efektif sebelumnya. Sekarang Anda adalah pemula lagi, dan semua orang bisa melihatnya. Bagi pemimpin yang identitasnya terikat pada kemampuan, ini bukan hanya tidak nyaman. Ini destabilisasi."
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "In that state, fixed mindset patterns do not just appear. They intensify.",
                "Dalam keadaan itu, pola pikir tetap tidak hanya muncul. Mereka intensif."
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "The Challenges dimension becomes: 'I am not equipped for this.' Obstacles stop feeling like part of the process and start feeling like confirmation of a deeper inadequacy. The Success of Others dimension stops being about inspiration and becomes about the shame of comparison: 'They adapted so quickly. Something must be wrong with me.'",
                "Dimensi Tantangan menjadi: 'Saya tidak siap untuk ini.' Hambatan berhenti terasa seperti bagian dari proses dan mulai terasa seperti konfirmasi ketidakmampuan yang lebih dalam. Dimensi Kesuksesan Orang Lain berhenti menjadi tentang inspirasi dan menjadi tentang rasa malu dari perbandingan: 'Mereka beradaptasi begitu cepat. Pasti ada yang salah dengan saya.'"
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "There is also a cultural layer. In many of the contexts this audience works in, failure carries public weight. Losing face in a community where relationships are long-term and visible is not the same as failing a task. It is relational damage. This makes the instinct to avoid risk deeply rational, not simply fearful.",
                "Ada juga lapisan budaya. Dalam banyak konteks di mana audiens ini bekerja, kegagalan memiliki bobot publik. Kehilangan muka dalam komunitas di mana hubungan bersifat jangka panjang dan terlihat tidak sama dengan gagal dalam tugas. Itu adalah kerusakan relasional. Ini membuat naluri untuk menghindari risiko sangat rasional, bukan sekadar ketakutan."
              )}
            </p>
            <p style={{ margin: 0 }}>
              {t(
                "A growth mindset for a cross-cultural leader is not about performing confidence. It is about holding competence and incompetence at the same time, staying curious under pressure, and treating each new culture as a teacher rather than a test.",
                "Mindset pertumbuhan bagi seorang pemimpin lintas budaya bukan tentang menampilkan kepercayaan diri. Ini tentang menahan kompetensi dan ketidakmampuan pada saat yang sama, tetap penasaran di bawah tekanan, dan memperlakukan setiap budaya baru sebagai guru daripada ujian."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section style={{ padding: "72px 24px", background: OFF_WHITE, borderTop: `1px solid ${LIGHT_GRAY}` }}>
        <div style={{ ...containerStyle }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
            <div>
              <p style={{ ...eyebrowStyle }}>{t("ASSESSMENT", "PENILAIAN")}</p>
              <h2 style={{ ...sectionH2Style }}>
                {t("Mindset Assessment", "Penilaian Mindset")}
              </h2>
              <p style={{ fontSize: 15, color: BODY_TEXT, lineHeight: 1.65, margin: 0 }}>
                {t(
                  "15 statements across 5 dimensions. This is for you, not for anyone else. Rate how you actually think and behave, not how you wish you did.",
                  "15 pernyataan di 5 dimensi. Ini untuk Anda, bukan untuk orang lain. Nilailah bagaimana Anda benar-benar berpikir dan berperilaku, bukan bagaimana Anda berharap melakukannya."
                )}
              </p>
            </div>
            {growthScore != null && !quizOpen && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: BODY_TEXT, marginBottom: 2 }}>
                  {t("Previous Score", "Skor Sebelumnya")}
                </div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: getMindsetColor(growthScore), lineHeight: 1 }}>{growthScore}%</div>
              </div>
            )}
          </div>

          {!quizOpen && (
            <div style={{ marginTop: 28 }}>
              <button
                onClick={() => { setQuizOpen(true); if (quizSubmitted) handleRetake(); }}
                style={{ background: NAVY, color: "white", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer", minHeight: 44 }}
              >
                {growthScore != null
                  ? t("Retake Assessment", "Ulangi Penilaian")
                  : t("Start Assessment", "Mulai Tes")}
              </button>
            </div>
          )}

          {quizOpen && (
            <div style={{ marginTop: 36 }}>
              {!quizSubmitted && (() => {
                const q = QUESTIONS[currentQ];
                const statement = lang === "id" ? q.id : q.en;
                const ans = answers[currentQ];
                const dimLabel = DIM_LABELS[q.dim][lang];
                const isLast = currentQ === QUESTIONS.length - 1;
                const progressPct = Math.round(((currentQ + 1) / QUESTIONS.length) * 100);
                return (
                  <div>
                    {/* Progress bar */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: BODY_TEXT, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {t(`Question ${currentQ + 1} of ${QUESTIONS.length}`, `Pertanyaan ${currentQ + 1} dari ${QUESTIONS.length}`)}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: ORANGE, letterSpacing: "0.06em", textTransform: "uppercase" }}>{dimLabel}</span>
                      </div>
                      <div style={{ height: 4, background: LIGHT_GRAY, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progressPct}%`, background: NAVY, borderRadius: 4, transition: "width 0.3s ease" }} />
                      </div>
                    </div>

                    {/* Question card */}
                    <div style={{ background: "white", borderRadius: 12, padding: "28px 24px", border: `1px solid ${LIGHT_GRAY}`, marginBottom: 20 }}>
                      <p style={{ fontSize: 16, lineHeight: 1.65, color: NAVY, margin: "0 0 20px", fontWeight: 500 }}>{statement}</p>
                      <div role="group" aria-label={t(q.en, q.id)} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {scaleLabels.map((label, vi) => {
                          const val = vi + 1;
                          return (
                            <button
                              key={val}
                              onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: val }))}
                              aria-pressed={ans === val}
                              style={{
                                flex: 1, minWidth: 70, padding: "10px 6px", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer",
                                border: `2px solid ${ans === val ? NAVY : LIGHT_GRAY}`,
                                background: ans === val ? NAVY : "white",
                                color: ans === val ? "white" : BODY_TEXT,
                                letterSpacing: "0.02em", textAlign: "center", lineHeight: 1.3, minHeight: 44,
                                transition: "background 0.15s, border-color 0.15s",
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      {currentQ > 0 && (
                        <button
                          onClick={() => setCurrentQ(q => q - 1)}
                          style={{ background: "transparent", color: BODY_TEXT, padding: "12px 24px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: `1px solid ${LIGHT_GRAY}`, cursor: "pointer", minHeight: 44 }}
                        >
                          {t("Previous", "Sebelumnya")}
                        </button>
                      )}
                      {!isLast ? (
                        <button
                          onClick={() => setCurrentQ(q => q + 1)}
                          style={{ background: NAVY, color: "white", padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", letterSpacing: "0.04em", minHeight: 44 }}
                        >
                          {t("Next", "Selanjutnya")}
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={!allAnswered}
                          style={{ background: allAnswered ? NAVY : LIGHT_GRAY, color: allAnswered ? "white" : BODY_TEXT, padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: allAnswered ? "pointer" : "not-allowed", letterSpacing: "0.04em", minHeight: 44 }}
                        >
                          {t("See My Results", "Lihat Hasil Saya")}
                        </button>
                      )}
                      {!allAnswered && isLast && (
                        <span style={{ fontSize: 13, color: BODY_TEXT }}>
                          {QUESTIONS.length - answeredCount} {t("questions remaining", "pertanyaan tersisa")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {quizSubmitted && (
                <div style={{ background: LIGHT_GRAY, borderRadius: 12, padding: "36px 40px", marginTop: 16 }}>
                  {/* Score display */}
                  <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: BODY_TEXT, marginBottom: 6 }}>
                        {t("Your Mindset Score", "Skor Mindset Anda")}
                      </div>
                      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 64, fontWeight: 700, color: getMindsetColor(growthScore!), lineHeight: 1 }}>{growthScore}%</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: getMindsetColor(growthScore!), marginTop: 4 }}>{getMindsetLabel(growthScore!)}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ background: "oklch(80% 0.008 80)", borderRadius: 12, height: 12, marginBottom: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 12, background: "linear-gradient(to right, oklch(48% 0.18 25), oklch(65% 0.15 45), oklch(46% 0.16 145))", width: "100%" }} />
                      </div>
                      <div style={{ position: "relative", height: 8, marginBottom: 16 }}>
                        <div style={{ position: "absolute", left: `${growthScore}%`, transform: "translateX(-50%)", width: 3, height: 16, background: NAVY, borderRadius: 2, top: -4 }} />
                      </div>
                    </div>
                  </div>

                  {/* Score-based application path */}
                  {(() => {
                    const { heading, body } = getScoreApplicationText();
                    return (
                      <div style={{ background: "white", borderRadius: 10, padding: "24px 28px", marginBottom: 20 }}>
                        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: NAVY, margin: "0 0 10px" }}>{heading}</h3>
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: BODY_TEXT, margin: 0 }}>{body}</p>
                      </div>
                    );
                  })()}

                  {/* Per-dimension breakdown */}
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: BODY_TEXT, margin: "0 0 16px" }}>
                    {growthScore! >= 80
                      ? t(
                          "You demonstrate a strong growth mindset across most areas. Keep investing in the few areas where fixed thinking still shows up.",
                          "Anda menunjukkan mindset pertumbuhan yang kuat di sebagian besar area. Terus berinvestasi pada beberapa area di mana pemikiran tetap masih muncul."
                        )
                      : growthScore! >= 65
                      ? t(
                          "You lean toward growth in most areas, with some fixed patterns in specific dimensions. Review the questions where you scored lower to identify where to focus.",
                          "Anda cenderung bertumbuh di sebagian besar area, dengan beberapa pola tetap di dimensi tertentu. Tinjau pertanyaan di mana Anda mendapat skor lebih rendah untuk mengidentifikasi di mana harus fokus."
                        )
                      : growthScore! >= 45
                      ? t(
                          "You have a mixed mindset — growth in some areas, fixed in others. Understanding where the fixed patterns are gives you a clear target for growth.",
                          "Anda memiliki mindset campuran — pertumbuhan di beberapa area, tetap di area lain. Memahami di mana pola tetap berada memberikan Anda target yang jelas untuk pertumbuhan."
                        )
                      : t(
                          "Fixed thinking is showing up across several dimensions. This awareness is the first step. Start with one dimension and commit to shifting your approach there.",
                          "Pemikiran tetap muncul di beberapa dimensi. Kesadaran ini adalah langkah pertama. Mulailah dengan satu dimensi dan berkomitmen untuk mengubah pendekatan Anda di sana."
                        )}
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                      onClick={handleRetake}
                      style={{ background: "transparent", color: BODY_TEXT, padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 13, border: `1px solid oklch(75% 0.008 80)`, cursor: "pointer", minHeight: 44 }}
                    >
                      {t("Retake Assessment", "Ulangi Penilaian")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* HOW TO SHIFT */}
      <section style={{ background: OFF_WHITE, padding: "72px 24px", borderTop: `1px solid ${LIGHT_GRAY}` }}>
        <div style={{ ...containerStyle }}>
          <p style={{ ...eyebrowStyle }}>{t("PRACTICE", "LATIHAN")}</p>
          <h2 style={{ ...sectionH2Style }}>
            {t("How to Shift Your Mindset", "Cara Mengubah Mindset Anda")}
          </h2>
          <p style={{ fontSize: 15, color: BODY_TEXT, marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "Mindset change is not a one-time decision — it is a practice. Use this three-step process for any dimension where you want to grow.",
              "Perubahan mindset bukan keputusan sekali jalan — ini adalah latihan. Gunakan proses tiga langkah ini untuk dimensi mana pun yang ingin Anda kembangkan."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                step: "01", color: "oklch(42% 0.14 260)",
                title: t("Name It", "Beri Nama"),
                desc: t(
                  "For a specific dimension, write down your current belief honestly. What do you actually think — not what you know you should think?",
                  "Untuk dimensi tertentu, tuliskan keyakinan Anda saat ini dengan jujur. Apa yang sebenarnya Anda pikirkan — bukan apa yang Anda tahu seharusnya Anda pikirkan?"
                ),
              },
              {
                step: "02", color: "oklch(48% 0.18 25)",
                title: t("Spot the Pattern", "Kenali Polanya"),
                desc: t(
                  "Is this a fixed or growth belief? Do not judge — just notice. Awareness is always the first step toward change.",
                  "Apakah ini keyakinan tetap atau pertumbuhan? Jangan menghakimi — cukup perhatikan. Kesadaran selalu menjadi langkah pertama menuju perubahan."
                ),
              },
              {
                step: "03", color: "oklch(46% 0.16 145)",
                title: t("Reframe It", "Ubah Bingkainya"),
                desc: t(
                  "Ask: 'What would a growth-oriented version of this belief look like?' Write it down and commit to returning to it when the fixed pattern shows up.",
                  "Tanyakan: 'Seperti apa versi keyakinan ini yang berorientasi pertumbuhan?' Tuliskan dan berkomitmenlah untuk kembali ke sana ketika pola tetap muncul."
                ),
              },
            ].map(item => (
              <div key={item.step} style={{ background: "white", borderRadius: 10, padding: "28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)", border: `1px solid ${LIGHT_GRAY}` }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: item.color, lineHeight: 1, flexShrink: 0 }}>{item.step}</span>
                  <div>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: NAVY, margin: "0 0 8px" }}>{item.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: BODY_TEXT, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAITH ANCHOR */}
      <section style={{ background: NAVY, padding: "72px 24px" }}>
        <div style={{ ...containerStyle }}>
          <p style={{ ...eyebrowStyle, color: ORANGE }}>{t("FAITH ANCHOR", "JANGKAR IMAN")}</p>
          <h2 style={{ ...sectionH2LightStyle }}>
            {t("Faithful with What You Have Been Given", "Setia dengan Apa yang Telah Diberikan")}
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(80% 0.04 260)" }}>
            <p style={{ marginBottom: 16 }}>
              {t(
                "In Matthew 25, Jesus tells a story about three servants who are each entrusted with a sum of money while their master is away. Two of them invest it. One buries it in the ground. When the master returns, he commends the two who risked. He rebukes the one who played it safe.",
                "Dalam Matius 25, Yesus menceritakan kisah tentang tiga hamba yang masing-masing dipercayakan sejumlah uang sementara tuan mereka pergi. Dua dari mereka menginvestasikannya. Satu menguburnya di tanah. Ketika tuan kembali, dia memuji dua orang yang mengambil risiko. Dia menegur yang bermain aman."
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "The servant who buried his talent did not have a character problem. He had a fear problem. 'I was afraid,' he says. So he protected what he had rather than risking what he could become.",
                "Hamba yang mengubur talentanya tidak memiliki masalah karakter. Dia memiliki masalah ketakutan. 'Aku takut,' katanya. Jadi dia melindungi apa yang dimilikinya daripada mengambil risiko tentang siapa yang bisa ia jadikan."
              )}
            </p>
            <p style={{ marginBottom: 16, fontStyle: "italic", color: OFF_WHITE }}>
              {t(
                "That is a fixed mindset in biblical clothing.",
                "Itulah mindset tetap dalam pakaian alkitabiah."
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "The servants who invested were not reckless. They were faithful. They understood that what they had been entrusted with was not theirs to hoard. It was meant to grow.",
                "Hamba-hamba yang berinvestasi bukan tidak bertanggung jawab. Mereka setia. Mereka memahami bahwa apa yang telah dipercayakan kepada mereka bukan milik mereka untuk ditimbun. Itu dimaksudkan untuk berkembang."
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "Paul echoes this in his letter to Timothy: 'Do not neglect the gift you have' (1 Timothy 4:14).",
                "Paulus menggemakan ini dalam suratnya kepada Timotius: 'Jangan abaikan karunia yang ada padamu' (1 Timotius 4:14)."
              )}
            </p>
            <p style={{ marginBottom: 16 }}>
              {t(
                "Growth mindset, in this light, is not about ambition. It is about stewardship. The abilities, experiences, and calling you carry have been placed in your hands for a reason. Burying them because you might fail is not humility. It is fear dressed up as safety.",
                "Mindset pertumbuhan, dalam terang ini, bukan tentang ambisi. Ini tentang penatalayanan. Kemampuan, pengalaman, dan panggilan yang Anda bawa telah ditempatkan di tangan Anda dengan alasan. Mengubur mereka karena Anda mungkin gagal bukan kerendahan hati. Itu adalah ketakutan yang menyamar sebagai keamanan."
              )}
            </p>
            <p style={{ margin: 0, fontStyle: "italic", color: OFF_WHITE, fontFamily: "Cormorant Garamond, serif", fontSize: 18 }}>
              {t(
                "The invitation is not to be fearless. It is to be faithful.",
                "Undangannya bukan untuk tidak takut. Ini untuk menjadi setia."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* KEY TAKEAWAYS */}
      <section style={{ background: LIGHT_GRAY, padding: "72px 24px" }}>
        <div style={{ ...containerStyle }}>
          <p style={{ ...eyebrowStyle }}>{t("KEY TAKEAWAYS", "POIN UTAMA")}</p>
          <h2 style={{ ...sectionH2Style }}>
            {t("What to Carry Forward", "Yang Perlu Dibawa")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
            {[
              {
                num: "01",
                en: "Fixed mindset patterns do not make you a poor leader. They make you a human one. Recognizing them is the work.",
                id: "Pola mindset tetap tidak membuat Anda pemimpin yang buruk. Mereka membuat Anda manusiawi. Mengenali mereka adalah pekerjaan itu.",
              },
              {
                num: "02",
                en: "In cross-cultural settings, fear of visible failure is often a learned response to real social stakes, not a character flaw to overcome quickly.",
                id: "Dalam lingkungan lintas budaya, ketakutan akan kegagalan yang terlihat sering kali merupakan respons yang dipelajari terhadap taruhan sosial nyata, bukan cacat karakter yang harus diatasi dengan cepat.",
              },
              {
                num: "03",
                en: "Growth mindset is not about ambition or self-improvement. It is about faithfulness with what you have been given, in the context where you have been placed.",
                id: "Mindset pertumbuhan bukan tentang ambisi atau pengembangan diri. Ini tentang kesetiaan dengan apa yang telah diberikan kepada Anda, dalam konteks di mana Anda telah ditempatkan.",
              },
              {
                num: "04",
                en: "The goal is not a perfect score. It is the honest question: where am I protecting myself when I could be growing?",
                id: "Tujuannya bukan skor sempurna. Ini adalah pertanyaan jujur: di mana saya melindungi diri saya sendiri ketika saya bisa bertumbuh?",
              },
            ].map(item => (
              <div key={item.num} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "white", borderRadius: 10, padding: "24px 28px" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: ORANGE, lineHeight: 1, flexShrink: 0, minWidth: 36 }}>{item.num}</span>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: BODY_TEXT, margin: 0 }}>{t(item.en, item.id)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFLECTION QUESTIONS */}
      <section style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ ...containerStyle }}>
          <p style={{ ...eyebrowStyle }}>{t("REFLECTION", "REFLEKSI")}</p>
          <h2 style={{ ...sectionH2Style }}>
            {t("Questions Worth Sitting With", "Pertanyaan yang Layak Direnungkan")}
          </h2>
          <p style={{ fontSize: 15, color: BODY_TEXT, lineHeight: 1.65, marginBottom: 32, marginTop: 8 }}>
            {t(
              "These questions are designed for cross-cultural leaders. Take your time with them.",
              "Pertanyaan-pertanyaan ini dirancang untuk pemimpin lintas budaya. Luangkan waktu Anda dengan mereka."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                num: 1,
                en: "Think of a moment in cross-cultural work when you felt like you were not cut out for this. Looking back: was that a fixed-mindset moment, a legitimate limit, or something your context imposed on you? What is the difference?",
                id: "Pikirkan momen dalam pekerjaan lintas budaya ketika Anda merasa tidak cocok untuk ini. Melihat ke belakang: apakah itu momen mindset tetap, batasan yang sah, atau sesuatu yang dipaksakan konteks Anda kepada Anda? Apa perbedaannya?",
              },
              {
                num: 2,
                en: "In your home culture, how was failure typically handled — privately, communally, as shame, or as information? How has that cultural script shaped the voice you hear when you make a mistake in your current context?",
                id: "Dalam budaya asal Anda, bagaimana kegagalan biasanya ditangani — secara pribadi, komunal, sebagai rasa malu, atau sebagai informasi? Bagaimana skrip budaya itu membentuk suara yang Anda dengar ketika Anda membuat kesalahan dalam konteks Anda saat ini?",
              },
              {
                num: 3,
                en: "Where in your leadership role are you most likely to go fixed — under pressure, in ambiguous situations, in front of people whose respect you need? What does that pattern cost you?",
                id: "Di mana dalam peran kepemimpinan Anda Anda paling mungkin menjadi tetap — di bawah tekanan, dalam situasi ambigu, di depan orang-orang yang rasa hormatnya Anda butuhkan? Apa yang pola itu menelan biaya dari Anda?",
              },
              {
                num: 4,
                en: "Dweck's research identifies effort as the mechanism of growth. But in high-load ministry or field contexts, effort is rarely the shortage — protection is. What would it look like to protect your growth capacity the way you protect your team's wellbeing?",
                id: "Penelitian Dweck mengidentifikasi usaha sebagai mekanisme pertumbuhan. Tetapi dalam konteks pelayanan atau lapangan yang berat, usaha jarang menjadi kekurangan — perlindungan adalah. Seperti apa melindungi kapasitas pertumbuhan Anda seperti Anda melindungi kesejahteraan tim Anda?",
              },
              {
                num: 5,
                en: "If the people you lead could see your fixed-mindset moments clearly, what would they learn from how you handle them? What do you want them to learn?",
                id: "Jika orang-orang yang Anda pimpin dapat melihat momen mindset tetap Anda dengan jelas, apa yang akan mereka pelajari dari cara Anda menanganinya? Apa yang ingin Anda ajarkan kepada mereka?",
              },
            ].map(item => (
              <div key={item.num} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "white", borderRadius: 10, padding: "24px 28px", border: `1px solid ${LIGHT_GRAY}` }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: ORANGE, lineHeight: 1.1, flexShrink: 0, minWidth: 24 }}>{item.num}</span>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: BODY_TEXT, margin: 0 }}>{t(item.en, item.id)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...eyebrowStyle, color: ORANGE }}>{t("NEXT STEPS", "LANGKAH SELANJUTNYA")}</p>
          <h2 style={{ ...sectionH2LightStyle }}>
            {t("Your Mindset Is Not Fixed", "Mindset Anda Tidak Tetap")}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(72% 0.05 260)", lineHeight: 1.7, marginBottom: 40 }}>
            {t(
              "Awareness is the beginning of change. Retake this assessment every few months. Not to measure yourself, but to see where you have more to give.",
              "Kesadaran adalah awal dari perubahan. Ulangi penilaian ini setiap beberapa bulan. Bukan untuk mengukur diri Anda, tetapi untuk melihat di mana Anda memiliki lebih banyak untuk diberikan."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => { setQuizOpen(true); if (quizSubmitted) handleRetake(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{ background: ORANGE, color: "oklch(15% 0.05 45)", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", letterSpacing: "0.04em", minHeight: 44 }}
            >
              {growthScore != null
                ? t("Retake Assessment", "Ulangi Penilaian")
                : t("Start Assessment", "Mulai Tes")}
            </button>
            <Link href="/resources" style={{ display: "inline-flex", alignItems: "center", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none", minHeight: 44 }}>
              {t("All Resources", "Semua Sumber Daya")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
