"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard, saveMindsetScore } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

const DIM_LABELS: Record<string, { en: string; id: string; nl: string }> = {
  "Challenges":        { en: "Challenges",         id: "Tantangan",           nl: "Uitdagingen" },
  "Skills":            { en: "Skills",              id: "Keterampilan",        nl: "Vaardigheden" },
  "Obstacles":         { en: "Obstacles",           id: "Hambatan",            nl: "Obstakels" },
  "Success of Others": { en: "Success of Others",   id: "Kesuksesan Orang Lain", nl: "Succes van Anderen" },
  "Effort":            { en: "Effort",              id: "Usaha",               nl: "Inspanning" },
};

const QUESTIONS = [
  // CHALLENGES
  {
    dim: "Challenges",
    en: "When I face a difficult situation, I look for what I can learn from it.",
    id: "Ketika saya menghadapi situasi yang sulit, saya mencari apa yang bisa saya pelajari darinya.",
    nl: "Als ik een moeilijke situatie tegenkom, zoek ik naar wat ik ervan kan leren.",
    type: "growth" as const,
  },
  {
    dim: "Challenges",
    en: "I push myself outside my comfort zone because I know that's where growth happens.",
    id: "Saya mendorong diri saya keluar dari zona nyaman karena saya tahu di situlah pertumbuhan terjadi.",
    nl: "Ik duw mezelf buiten mijn comfortzone omdat ik weet dat daar groei plaatsvindt.",
    type: "growth" as const,
  },
  {
    dim: "Challenges",
    en: "I tend to avoid situations where there's a real chance I might fail.",
    id: "Saya cenderung menghindari situasi di mana ada kemungkinan nyata saya bisa gagal.",
    nl: "Ik neig ernaar situaties te vermijden waarbij er een echte kans is dat ik zal falen.",
    type: "fixed" as const,
  },
  // SKILLS
  {
    dim: "Skills",
    en: "I believe most skills can be developed with consistent practice — intelligence and talent are starting points, not limits.",
    id: "Saya percaya bahwa sebagian besar keterampilan dapat dikembangkan dengan latihan yang konsisten — kecerdasan dan bakat adalah titik awal, bukan batasan.",
    nl: "Ik geloof dat de meeste vaardigheden kunnen worden ontwikkeld door consistente oefening — intelligentie en talent zijn startpunten, geen grenzen.",
    type: "growth" as const,
  },
  {
    dim: "Skills",
    en: "I enjoy learning new things even when I'm not good at them at first.",
    id: "Saya senang mempelajari hal-hal baru bahkan ketika saya tidak mahir pada awalnya.",
    nl: "Ik geniet ervan nieuwe dingen te leren, ook als ik er in het begin niet goed in ben.",
    type: "growth" as const,
  },
  {
    dim: "Skills",
    en: "If I'm not naturally talented at something, I assume it's probably not for me.",
    id: "Jika saya tidak berbakat secara alami dalam sesuatu, saya berasumsi itu mungkin bukan untuk saya.",
    nl: "Als ik ergens niet van nature talent voor heb, ga ik ervan uit dat het waarschijnlijk niets voor mij is.",
    type: "fixed" as const,
  },
  // OBSTACLES
  {
    dim: "Obstacles",
    en: "When I hit a wall, I look for a different way around rather than giving up.",
    id: "Ketika saya menghadapi hambatan, saya mencari cara lain daripada menyerah.",
    nl: "Als ik tegen een muur aanloop, zoek ik naar een andere weg in plaats van op te geven.",
    type: "growth" as const,
  },
  {
    dim: "Obstacles",
    en: "I see setbacks as temporary and part of the process, not as a sign of my limits.",
    id: "Saya melihat kemunduran sebagai hal yang sementara dan bagian dari proses, bukan sebagai tanda batas kemampuan saya.",
    nl: "Ik zie tegenslagen als tijdelijk en als onderdeel van het proces, niet als teken van mijn grenzen.",
    type: "growth" as const,
  },
  {
    dim: "Obstacles",
    en: "When I face a major obstacle, I often feel stuck and powerless to change the outcome.",
    id: "Ketika saya menghadapi hambatan besar, saya sering merasa terjebak dan tidak berdaya untuk mengubah hasilnya.",
    nl: "Als ik een groot obstakel tegenkom, voel ik me vaak vastgelopen en machteloos om de uitkomst te veranderen.",
    type: "fixed" as const,
  },
  // SUCCESS OF OTHERS
  {
    dim: "Success of Others",
    en: "When I see others succeeding, I feel genuinely inspired and look for what I can learn from them.",
    id: "Ketika saya melihat orang lain berhasil, saya merasa benar-benar terinspirasi dan mencari apa yang bisa saya pelajari dari mereka.",
    nl: "Als ik anderen zie slagen, voel ik me oprecht geïnspireerd en zoek ik naar wat ik van hen kan leren.",
    type: "growth" as const,
  },
  {
    dim: "Success of Others",
    en: "Other people's success motivates me — it shows me what's possible.",
    id: "Kesuksesan orang lain memotivasi saya — itu menunjukkan kepada saya apa yang mungkin.",
    nl: "Het succes van anderen motiveert mij — het laat mij zien wat mogelijk is.",
    type: "growth" as const,
  },
  {
    dim: "Success of Others",
    en: "When others succeed where I'm struggling, I often feel threatened or like it's somehow unfair.",
    id: "Ketika orang lain berhasil di bidang yang saya perjuangkan, saya sering merasa terancam atau seolah itu tidak adil.",
    nl: "Als anderen slagen waar ik moeite mee heb, voel ik me vaak bedreigd of alsof het op de een of andere manier oneerlijk is.",
    type: "fixed" as const,
  },
  // EFFORT
  {
    dim: "Effort",
    en: "I believe consistent effort is the main ingredient for long-term success.",
    id: "Saya percaya bahwa usaha yang konsisten adalah bahan utama untuk kesuksesan jangka panjang.",
    nl: "Ik geloof dat consistente inspanning het belangrijkste ingrediënt is voor succes op lange termijn.",
    type: "growth" as const,
  },
  {
    dim: "Effort",
    en: "I find meaning in working hard at something, even when the results aren't immediate.",
    id: "Saya menemukan makna dalam bekerja keras pada sesuatu, bahkan ketika hasilnya tidak segera terlihat.",
    nl: "Ik vind betekenis in hard werken aan iets, ook als de resultaten niet onmiddellijk zichtbaar zijn.",
    type: "growth" as const,
  },
  {
    dim: "Effort",
    en: "If I have to try really hard at something, I start to wonder if I'm actually cut out for it.",
    id: "Jika saya harus benar-benar bekerja keras pada sesuatu, saya mulai bertanya-tanya apakah saya memang cocok untuk itu.",
    nl: "Als ik ergens heel hard voor moet werken, begin ik me af te vragen of ik er eigenlijk wel voor in de wieg ben gelegd.",
    type: "fixed" as const,
  },
];

const SCALE_LABELS = {
  en: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  id: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"],
  nl: ["Sterk Oneens", "Oneens", "Neutraal", "Eens", "Sterk Eens"],
};

const DIMENSIONS_INFO = [
  {
    key: "challenges",
    en: { label: "CHALLENGES", growth: "Embraces challenges. Looks for opportunities for self-growth. Sees failure as part of the process.", fixed: "Gives up when challenged. Avoids challenges to avoid failure. Stays in the safe lane." },
    id: { label: "TANTANGAN", growth: "Merangkul tantangan. Mencari peluang untuk pertumbuhan diri. Melihat kegagalan sebagai bagian dari proses.", fixed: "Menyerah saat ditantang. Menghindari tantangan untuk menghindari kegagalan. Tetap di jalur aman." },
    nl: { label: "UITDAGINGEN", growth: "Omarmt uitdagingen. Zoekt naar kansen voor zelfgroei. Ziet falen als onderdeel van het proces.", fixed: "Geeft op als het moeilijk wordt. Vermijdt uitdagingen om falen te vermijden. Blijft in de veilige zone." },
  },
  {
    key: "skills",
    en: { label: "SKILLS", growth: "Focuses on getting gradually better. Believes in constantly learning new skills. Sees failures as temporary setbacks.", fixed: "Believes that you're either good at something or not. Has excuses for why new things can't be learned." },
    id: { label: "KETERAMPILAN", growth: "Fokus pada perbaikan bertahap. Percaya pada pembelajaran keterampilan baru secara terus-menerus. Melihat kegagalan sebagai kemunduran sementara.", fixed: "Percaya bahwa Anda berbakat dalam sesuatu atau tidak. Punya alasan mengapa hal-hal baru tidak bisa dipelajari." },
    nl: { label: "VAARDIGHEDEN", growth: "Richt zich op geleidelijke verbetering. Gelooft in continu nieuwe vaardigheden leren. Ziet mislukkingen als tijdelijke tegenslagen.", fixed: "Gelooft dat je ergens goed in bent of niet. Heeft excuses waarom nieuwe dingen niet geleerd kunnen worden." },
  },
  {
    key: "obstacles",
    en: { label: "OBSTACLES", growth: "Sees obstacles as an inevitable part of the process. Knows that all problems have solutions. Persists through difficulty.", fixed: "Gives up in the face of an obstacle. Sees obstacles as the limit of their own abilities. Feels stuck and powerless." },
    id: { label: "HAMBATAN", growth: "Melihat hambatan sebagai bagian yang tak terhindarkan dari proses. Tahu bahwa semua masalah memiliki solusi. Bertahan melalui kesulitan.", fixed: "Menyerah ketika menghadapi hambatan. Melihat hambatan sebagai batas kemampuan sendiri. Merasa terjebak dan tidak berdaya." },
    nl: { label: "OBSTAKELS", growth: "Ziet obstakels als een onvermijdelijk deel van het proces. Weet dat alle problemen oplossingen hebben. Houdt vol ondanks moeilijkheden.", fixed: "Geeft op wanneer er een obstakel is. Ziet obstakels als de grens van de eigen vermogens. Voelt zich vastgelopen en machteloos." },
  },
  {
    key: "success-of-others",
    en: { label: "SUCCESS OF OTHERS", growth: "Is inspired by the success of others. Tries to learn from their success. Sees others' wins as evidence of what's possible.", fixed: "Sees the success of others as a threat. Thinks it's unfair that others are succeeding. Compares and despairs." },
    id: { label: "KESUKSESAN ORANG LAIN", growth: "Terinspirasi oleh kesuksesan orang lain. Mencoba belajar dari kesuksesan mereka. Melihat kemenangan orang lain sebagai bukti apa yang mungkin.", fixed: "Melihat kesuksesan orang lain sebagai ancaman. Berpikir tidak adil bahwa orang lain berhasil. Membandingkan dan putus asa." },
    nl: { label: "SUCCES VAN ANDEREN", growth: "Wordt geïnspireerd door het succes van anderen. Probeert te leren van hun succes. Ziet andermans winst als bewijs van wat mogelijk is.", fixed: "Ziet het succes van anderen als een bedreiging. Denkt dat het oneerlijk is dat anderen succesvol zijn. Vergelijkt en wanhoopt." },
  },
  {
    key: "effort",
    en: { label: "EFFORT", growth: "Sees effort as the main ingredient for success. Embraces hard work as the path to mastery. Effort creates ability.", fixed: "Does not feel motivated to put in the extra effort. Believes that talent should be enough." },
    id: { label: "USAHA", growth: "Melihat usaha sebagai bahan utama untuk sukses. Merangkul kerja keras sebagai jalan menuju keahlian. Usaha menciptakan kemampuan.", fixed: "Tidak merasa termotivasi untuk memberikan upaya ekstra. Percaya bahwa bakat seharusnya sudah cukup." },
    nl: { label: "INSPANNING", growth: "Ziet inspanning als het belangrijkste ingrediënt voor succes. Omarmt hard werken als de weg naar meesterschap. Inspanning creëert vermogen.", fixed: "Voelt geen motivatie om extra moeite te doen. Gelooft dat talent genoeg zou moeten zijn." },
  },
];

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
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [growthScore, setGrowthScore] = useState<number | null>(savedScore ?? null);
  const [scoreSaved, setScoreSaved] = useState(savedScore != null);
  const [isSavingScore, startSaveScore] = useTransition();

  const t = (en: string, id: string, nl: string) => lang === "en" ? en : lang === "id" ? id : nl;

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
    setGrowthScore(savedScore ?? null);
    setScoreSaved(savedScore != null);
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function getMindsetLabel(score: number): string {
    if (score >= 80) return t("Strong Growth Mindset", "Mindset Pertumbuhan Kuat", "Sterk Groeimindset");
    if (score >= 65) return t("Growth-Leaning Mindset", "Mindset Cenderung Bertumbuh", "Groeigericht Mindset");
    if (score >= 45) return t("Mixed Mindset", "Mindset Campuran", "Gemengd Mindset");
    if (score >= 30) return t("Fixed-Leaning Mindset", "Mindset Cenderung Tetap", "Vast-Neigend Mindset");
    return t("Fixed Mindset", "Mindset Tetap", "Vast Mindset");
  }

  function getMindsetColor(score: number): string {
    if (score >= 65) return "oklch(46% 0.16 145)";
    if (score >= 45) return "oklch(65% 0.15 45)";
    return "oklch(48% 0.18 25)";
  }

  const scaleLabels = SCALE_LABELS[lang];
  const DIMS_ORDER = ["Challenges", "Skills", "Obstacles", "Success of Others", "Effort"];

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>
              {t("Assessment", "Penilaian", "Beoordeling")}
            </span>
            
          </div>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development · Guide", "Pengembangan Pribadi · Panduan", "Persoonlijke Ontwikkeling · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Fixed vs. Growth Mindset", "Mindset Tetap vs. Pertumbuhan", "Vast vs. Groeimindset")}
          </h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
            {t(
              "Based on Carol Dweck's landmark research, this assessment reveals where your mindset is fixed and where it's growing — across five key dimensions.",
              "Berdasarkan penelitian terobosan Carol Dweck, penilaian ini mengungkapkan di mana mindset Anda tetap dan di mana ia berkembang — dalam lima dimensi utama.",
              "Gebaseerd op het baanbrekende onderzoek van Carol Dweck, toont deze beoordeling waar jouw mindset vast zit en waar het groeit — op vijf belangrijke dimensies."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "13px 28px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}
              </span>
            )}
            {growthScore != null && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, padding: "13px 0", color: getMindsetColor(growthScore) }}>
                {t("Last score", "Skor terakhir", "Laatste score")}: {growthScore}% — {getMindsetLabel(growthScore)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* DWECK INTRO */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 16px" }}>
              {t("The Research Behind It", "Penelitian di Baliknya", "Het Onderzoek Erachter")}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(38% 0.06 260)", margin: "0 0 16px" }}>
              {t(
                "According to researcher Carol Dweck, there are two types of mindsets. A fixed mindset believes that qualities like intelligence or talent are innate — you have what you were given. A growth mindset holds that you can improve any quality through effort and persistence.",
                "Menurut peneliti Carol Dweck, ada dua jenis mindset. Mindset tetap percaya bahwa kualitas seperti kecerdasan atau bakat bersifat bawaan — Anda memiliki apa yang diberikan kepada Anda. Mindset pertumbuhan berpendapat bahwa Anda dapat meningkatkan kualitas apa pun melalui usaha dan ketekunan.",
                "Volgens onderzoeker Carol Dweck zijn er twee soorten mindsets. Een vast mindset gelooft dat kwaliteiten zoals intelligentie of talent aangeboren zijn — je hebt wat je meegegeven is. Een groeimindset houdt in dat je elke kwaliteit kunt verbeteren door inspanning en doorzettingsvermogen."
              )}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(38% 0.06 260)", margin: 0 }}>
              {t(
                "With a growth mindset, you are far more likely to take action, persist through difficulty, and actually achieve your goals. The shift often starts with recognizing which mindset is operating in a given area of your life.",
                "Dengan mindset pertumbuhan, Anda jauh lebih mungkin untuk mengambil tindakan, bertahan melalui kesulitan, dan benar-benar mencapai tujuan Anda. Pergeseran ini sering dimulai dengan mengenali mindset mana yang beroperasi di area kehidupan Anda tertentu.",
                "Met een groeimindset ben je veel meer geneigd om actie te ondernemen, door moeilijkheden heen te bijten en je doelen daadwerkelijk te bereiken. De verschuiving begint vaak met het herkennen welk mindset er actief is op een bepaald gebied van je leven."
              )}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "oklch(46% 0.16 145 / 0.08)", borderRadius: 10, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: "oklch(34% 0.12 145)", marginBottom: 8 }}>
                {t("Growth Mindset", "Mindset Pertumbuhan", "Groeimindset")}
              </div>
              <div style={{ fontSize: 13, color: "oklch(38% 0.10 145)", lineHeight: 1.5 }}>
                {t("Defines success as gradual improvement and growth", "Mendefinisikan keberhasilan sebagai perbaikan dan pertumbuhan bertahap", "Definieert succes als geleidelijke verbetering en groei")}
              </div>
            </div>
            <div style={{ background: "oklch(48% 0.18 25 / 0.08)", borderRadius: 10, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: "oklch(38% 0.14 25)", marginBottom: 8 }}>
                {t("Fixed Mindset", "Mindset Tetap", "Vast Mindset")}
              </div>
              <div style={{ fontSize: 13, color: "oklch(42% 0.10 25)", lineHeight: 1.5 }}>
                {t("Defines success as being right and not failing", "Mendefinisikan keberhasilan sebagai benar dan tidak gagal", "Definieert succes als gelijk hebben en niet falen")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIVE DIMENSIONS */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Five Key Dimensions", "Lima Dimensi Utama", "Vijf Sleuteldimensies")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 36, lineHeight: 1.65 }}>
            {t(
              "The assessment covers five areas where your mindset has the greatest impact on how you perform and grow.",
              "Penilaian ini mencakup lima area di mana mindset Anda memiliki dampak terbesar pada cara Anda berkinerja dan berkembang.",
              "De beoordeling omvat vijf gebieden waar jouw mindset de grootste impact heeft op hoe je presteert en groeit."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DIMENSIONS_INFO.map((d, i) => {
              const ldata = d[lang];
              return (
                <div key={d.key} style={{ background: "white", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0 }}>
                    <div style={{ padding: "20px 24px", display: "flex", alignItems: "center" }}>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, minWidth: 32 }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div style={{ padding: "20px 24px 20px 0", background: "oklch(46% 0.16 145 / 0.05)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", marginBottom: 6 }}>
                        {t("GROWTH", "PERTUMBUHAN", "GROEI")} · {ldata.label}
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: "oklch(30% 0.08 145)", margin: 0 }}>{ldata.growth}</p>
                    </div>
                    <div style={{ padding: "20px 24px 20px 16px", background: "oklch(48% 0.18 25 / 0.05)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 6 }}>
                        {t("FIXED", "TETAP", "VAST")} · {ldata.label}
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

      {/* ASSESSMENT */}
      <section style={{ padding: "72px 24px", background: "white" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>
                {t("Mindset Assessment", "Penilaian Mindset", "Mindset Beoordeling")}
              </h2>
              <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", lineHeight: 1.65, margin: 0 }}>
                {t(
                  "15 statements across 5 dimensions. Rate how much each sounds like you — be honest for the most useful results.",
                  "15 pernyataan di 5 dimensi. Nilai seberapa banyak setiap pernyataan terdengar seperti Anda — jujurlah untuk hasil yang paling berguna.",
                  "15 uitspraken over 5 dimensies. Beoordeel hoe goed elke uitspraak bij jou past — wees eerlijk voor de meest nuttige resultaten."
                )}
              </p>
            </div>
            {growthScore != null && !quizOpen && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", marginBottom: 2 }}>
                  {t("Previous Score", "Skor Sebelumnya", "Vorige Score")}
                </div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: getMindsetColor(growthScore), lineHeight: 1 }}>{growthScore}%</div>
              </div>
            )}
          </div>

          {!quizOpen && (
            <div style={{ marginTop: 28 }}>
              <button
                onClick={() => { setQuizOpen(true); if (quizSubmitted) handleRetake(); }}
                style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}
              >
                {growthScore != null
                  ? t("Retake Assessment", "Ulangi Penilaian", "Herkies Beoordeling")
                  : t("Start Assessment", "Mulai Tes", "Start Test")}
              </button>
            </div>
          )}

          {quizOpen && (
            <div style={{ marginTop: 36 }}>
              {!quizSubmitted && (
                <p style={{ fontSize: 13, color: "oklch(52% 0.06 260)", marginBottom: 28 }}>
                  {answeredCount} {t("of", "dari", "van")} {QUESTIONS.length} {t("answered", "dijawab", "beantwoord")}
                </p>
              )}

              {DIMS_ORDER.map(dim => {
                const dimQuestions = QUESTIONS.map((q, i) => ({ ...q, idx: i })).filter(q => q.dim === dim);
                const dimLabel = DIM_LABELS[dim][lang];
                return (
                  <div key={dim} style={{ marginBottom: 36 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ height: 1, flex: 1, background: "oklch(88% 0.008 260)" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", whiteSpace: "nowrap" }}>{dimLabel}</span>
                      <div style={{ height: 1, flex: 1, background: "oklch(88% 0.008 260)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {dimQuestions.map(q => {
                        const ans = answers[q.idx];
                        const statement = lang === "en" ? q.en : lang === "id" ? q.id : q.nl;
                        return (
                          <div key={q.idx} style={{ background: "oklch(97% 0.005 260)", borderRadius: 10, padding: "20px 24px" }}>
                            <p style={{ fontSize: 15, lineHeight: 1.6, color: "oklch(22% 0.10 260)", margin: "0 0 16px", fontWeight: 500 }}>{statement}</p>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {scaleLabels.map((label, vi) => {
                                const val = vi + 1;
                                return (
                                  <button
                                    key={val}
                                    onClick={() => !quizSubmitted && setAnswers(prev => ({ ...prev, [q.idx]: val }))}
                                    disabled={quizSubmitted}
                                    style={{
                                      flex: 1, minWidth: 70, padding: "8px 6px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: quizSubmitted ? "default" : "pointer",
                                      border: `2px solid ${ans === val ? "oklch(42% 0.14 260)" : "oklch(86% 0.008 260)"}`,
                                      background: ans === val ? "oklch(42% 0.14 260)" : "white",
                                      color: ans === val ? "white" : "oklch(40% 0.06 260)",
                                      letterSpacing: "0.02em", textAlign: "center", lineHeight: 1.3,
                                    }}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    style={{ background: allAnswered ? "oklch(22% 0.10 260)" : "oklch(80% 0.008 260)", color: allAnswered ? "white" : "oklch(55% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: allAnswered ? "pointer" : "not-allowed", letterSpacing: "0.04em" }}
                  >
                    {t("See My Results", "Lihat Hasil Saya", "Zie Mijn Resultaten")}
                  </button>
                  {!allAnswered && (
                    <span style={{ fontSize: 13, color: "oklch(52% 0.06 260)" }}>
                      {QUESTIONS.length - answeredCount} {t("questions remaining", "pertanyaan tersisa", "vragen resterend")}
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ background: "oklch(94% 0.008 260)", borderRadius: 12, padding: "36px 40px", marginTop: 16 }}>
                  <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", marginBottom: 6 }}>
                        {t("Your Mindset Score", "Skor Mindset Anda", "Jouw Mindset Score")}
                      </div>
                      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 64, fontWeight: 700, color: getMindsetColor(growthScore!), lineHeight: 1 }}>{growthScore}%</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: getMindsetColor(growthScore!), marginTop: 4 }}>{getMindsetLabel(growthScore!)}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ background: "oklch(88% 0.008 260)", borderRadius: 6, height: 12, marginBottom: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 6, background: "linear-gradient(to right, oklch(48% 0.18 25), oklch(65% 0.15 45), oklch(46% 0.16 145))", width: "100%" }} />
                      </div>
                      <div style={{ position: "relative", height: 8, marginBottom: 16 }}>
                        <div style={{ position: "absolute", left: `${growthScore}%`, transform: "translateX(-50%)", width: 3, height: 16, background: "oklch(22% 0.10 260)", borderRadius: 2, top: -4 }} />
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(32% 0.06 260)", margin: 0 }}>
                        {growthScore! >= 80
                          ? t(
                              "You demonstrate a strong growth mindset across most areas. Keep investing in the few areas where fixed thinking still shows up.",
                              "Anda menunjukkan mindset pertumbuhan yang kuat di sebagian besar area. Terus berinvestasi pada beberapa area di mana pemikiran tetap masih muncul.",
                              "Je toont een sterk groeimindset op de meeste gebieden. Blijf investeren in de weinige gebieden waar vast denken nog voorkomt."
                            )
                          : growthScore! >= 65
                          ? t(
                              "You lean toward growth in most areas, with some fixed patterns in specific dimensions. Review the questions where you scored lower to identify where to focus.",
                              "Anda cenderung bertumbuh di sebagian besar area, dengan beberapa pola tetap di dimensi tertentu. Tinjau pertanyaan di mana Anda mendapat skor lebih rendah untuk mengidentifikasi di mana harus fokus.",
                              "Je neigt naar groei op de meeste gebieden, met enkele vaste patronen in specifieke dimensies. Bekijk de vragen waarop je lager scoorde om te bepalen waar je je op moet richten."
                            )
                          : growthScore! >= 45
                          ? t(
                              "You have a mixed mindset — growth in some areas, fixed in others. Understanding where the fixed patterns are gives you a clear target for growth.",
                              "Anda memiliki mindset campuran — pertumbuhan di beberapa area, tetap di area lain. Memahami di mana pola tetap berada memberikan Anda target yang jelas untuk pertumbuhan.",
                              "Je hebt een gemengd mindset — groei op sommige gebieden, vast op andere. Begrijpen waar de vaste patronen zitten, geeft je een duidelijk doel voor groei."
                            )
                          : t(
                              "Fixed thinking is showing up across several dimensions. This awareness is the first step. Start with one dimension and commit to shifting your approach there.",
                              "Pemikiran tetap muncul di beberapa dimensi. Kesadaran ini adalah langkah pertama. Mulailah dengan satu dimensi dan berkomitmen untuk mengubah pendekatan Anda di sana.",
                              "Vast denken duikt op in meerdere dimensies. Dit bewustzijn is de eerste stap. Begin met één dimensie en commit je eraan om je aanpak daar te veranderen."
                            )}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {!scoreSaved ? (
                      <button
                        onClick={handleSaveScore}
                        disabled={isSavingScore}
                        style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "12px 28px", borderRadius: 6, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", letterSpacing: "0.04em" }}
                      >
                        {isSavingScore ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                      </button>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "oklch(40% 0.16 145)", fontWeight: 700, fontSize: 13 }}>
                        ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}
                      </span>
                    )}
                    <button
                      onClick={handleRetake}
                      style={{ background: "transparent", color: "oklch(30% 0.06 260)", padding: "12px 28px", borderRadius: 6, fontWeight: 600, fontSize: 13, border: "1px solid oklch(82% 0.008 260)", cursor: "pointer" }}
                    >
                      {t("Retake Assessment", "Ulangi Penilaian", "Beoordeling Overdoen")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* HOW TO REFRAME */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("How to Shift Your Mindset", "Cara Mengubah Mindset Anda", "Hoe Je Mindset Te Verschuiven")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "Mindset change is not a one-time decision — it's a practice. Use this three-step process for any dimension where you want to grow.",
              "Perubahan mindset bukan keputusan sekali jalan — ini adalah latihan. Gunakan proses tiga langkah ini untuk dimensi mana pun yang ingin Anda kembangkan.",
              "Mindsetverandering is geen eenmalige beslissing — het is een oefening. Gebruik dit driestappe proces voor elke dimensie waar je wilt groeien."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                step: "01", color: "oklch(42% 0.14 260)",
                title: t("Name It", "Beri Nama", "Benoem Het"),
                desc: t(
                  "For a specific dimension, write down your current belief honestly. What do you actually think — not what you know you should think?",
                  "Untuk dimensi tertentu, tuliskan keyakinan Anda saat ini dengan jujur. Apa yang sebenarnya Anda pikirkan — bukan apa yang Anda tahu seharusnya Anda pikirkan?",
                  "Schrijf voor een specifieke dimensie je huidige overtuiging eerlijk op. Wat denk je werkelijk — niet wat je denkt dat je zou moeten denken?"
                ),
              },
              {
                step: "02", color: "oklch(48% 0.18 25)",
                title: t("Spot the Pattern", "Kenali Polanya", "Herken het Patroon"),
                desc: t(
                  "Is this a fixed or growth belief? Don't judge — just notice. Awareness is always the first step toward change.",
                  "Apakah ini keyakinan tetap atau pertumbuhan? Jangan menghakimi — cukup perhatikan. Kesadaran selalu menjadi langkah pertama menuju perubahan.",
                  "Is dit een vaste of groeiende overtuiging? Oordeel niet — merk het gewoon op. Bewustzijn is altijd de eerste stap naar verandering."
                ),
              },
              {
                step: "03", color: "oklch(46% 0.16 145)",
                title: t("Reframe It", "Ubah Bingkainya", "Herformuleer Het"),
                desc: t(
                  "Ask: 'What would a growth-oriented version of this belief look like?' Write it down and commit to returning to it when the fixed pattern shows up.",
                  "Tanyakan: 'Seperti apa versi keyakinan ini yang berorientasi pertumbuhan?' Tuliskan dan berkomitmenlah untuk kembali ke sana ketika pola tetap muncul.",
                  "Vraag: 'Hoe zou een groeigericht versie van deze overtuiging eruitzien?' Schrijf het op en commit je eraan om er op terug te vallen als het vaste patroon opduikt."
                ),
              },
            ].map(item => (
              <div key={item.step} style={{ background: "white", borderRadius: 10, padding: "28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: item.color, lineHeight: 1, flexShrink: 0 }}>{item.step}</span>
                  <div>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>{item.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t("Your Mindset Is Not Fixed", "Mindset Anda Tidak Tetap", "Jouw Mindset Is Niet Vast")}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(72% 0.05 260)", lineHeight: 1.7, marginBottom: 40 }}>
            {t(
              "Awareness is the first step. Retake this assessment every few months to track your mindset shift over time.",
              "Kesadaran adalah langkah pertama. Ulangi penilaian ini setiap beberapa bulan untuk melacak pergeseran mindset Anda dari waktu ke waktu.",
              "Bewustzijn is de eerste stap. Doe deze beoordeling elke paar maanden opnieuw om je mindsetverschuiving in de tijd bij te houden."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => { setQuizOpen(true); if (quizSubmitted) handleRetake(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", letterSpacing: "0.04em" }}
            >
              {growthScore != null
                ? t("Retake Assessment", "Ulangi Penilaian", "Beoordeling Overdoen")
                : t("Start Assessment", "Mulai Tes", "Start Test")}
            </button>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
