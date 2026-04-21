"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const cqDimensions = [
  {
    number: "1",
    en_title: "Motivational CQ",
    id_title: "CQ Motivasi",
    nl_title: "Motivationele CQ",
    en_desc: "The drive and energy to learn about and function effectively in culturally diverse situations. Leaders with high Motivational CQ are curious rather than anxious when encountering difference. They persist through the discomfort of the unfamiliar.",
    id_desc: "Dorongan dan energi untuk belajar dan berfungsi secara efektif dalam situasi yang beragam secara budaya. Pemimpin dengan CQ Motivasi tinggi merasa penasaran daripada cemas ketika menghadapi perbedaan.",
    nl_desc: "De drive en energie om te leren en effectief te functioneren in cultureel diverse situaties. Leiders met een hoge Motivationele CQ zijn nieuwsgierig in plaats van angstig bij het ontmoeten van verschillen.",
  },
  {
    number: "2",
    en_title: "Cognitive CQ",
    id_title: "CQ Kognitif",
    nl_title: "Cognitieve CQ",
    en_desc: "Knowledge of cultural norms, values, and practices across different cultures. This includes understanding how culture shapes business practices, communication styles, and worldviews. It is not about memorizing facts — it is about building frameworks.",
    id_desc: "Pengetahuan tentang norma, nilai, dan praktik budaya di berbagai budaya. Ini mencakup pemahaman tentang bagaimana budaya membentuk praktik bisnis, gaya komunikasi, dan pandangan dunia.",
    nl_desc: "Kennis van culturele normen, waarden en praktijken in verschillende culturen. Dit omvat inzicht in hoe cultuur zakelijke praktijken, communicatiestijlen en wereldbeelden vormt.",
  },
  {
    number: "3",
    en_title: "Metacognitive CQ",
    id_title: "CQ Metakognitif",
    nl_title: "Metacognitieve CQ",
    en_desc: "The ability to be aware of and adjust your own thinking processes in cross-cultural interactions. High metacognitive CQ means questioning your own assumptions before, during, and after intercultural encounters — catching yourself mid-interpretation.",
    id_desc: "Kemampuan untuk menyadari dan menyesuaikan proses berpikir Anda sendiri dalam interaksi lintas budaya. CQ Metakognitif yang tinggi berarti mempertanyakan asumsi Anda sendiri sebelum, selama, dan setelah pertemuan antarbudaya.",
    nl_desc: "Het vermogen om je eigen denkprocessen in interculturele interacties bewust te zijn en aan te passen. Hoge metacognitieve CQ betekent je eigen aannames bevragen voor, tijdens en na interculturele ontmoetingen.",
  },
  {
    number: "4",
    en_title: "Behavioral CQ",
    id_title: "CQ Perilaku",
    nl_title: "Gedragsmatige CQ",
    en_desc: "The ability to flex verbal and nonverbal actions appropriately when interacting cross-culturally. It is not just knowing what to do — it is actually doing it. This includes tone, gestures, eye contact, physical distance, and pace of speech.",
    id_desc: "Kemampuan untuk menyesuaikan tindakan verbal dan nonverbal secara tepat ketika berinteraksi lintas budaya. Ini bukan hanya mengetahui apa yang harus dilakukan — tetapi benar-benar melakukannya.",
    nl_desc: "Het vermogen om verbale en non-verbale acties passend aan te passen bij interculturele interacties. Het gaat niet alleen om weten wat te doen — het gaat om het ook daadwerkelijk doen.",
  },
];

const developSteps = [
  {
    number: "1",
    en: "Pursue genuine curiosity — ask questions about culture without judgment or agenda.",
    id: "Kembangkan rasa ingin tahu yang tulus — ajukan pertanyaan tentang budaya tanpa penilaian atau agenda.",
    nl: "Cultiveer echte nieuwsgierigheid — stel vragen over cultuur zonder oordeel of agenda.",
  },
  {
    number: "2",
    en: "Study one culture deeply rather than skimming many. Depth creates transferable insight.",
    id: "Pelajari satu budaya secara mendalam daripada sekadar mengenal banyak. Kedalaman menciptakan wawasan yang dapat dipindahtangankan.",
    nl: "Bestudeer één cultuur grondig in plaats van veel culturen oppervlakkig. Diepte schept overdraagbaar inzicht.",
  },
  {
    number: "3",
    en: "Practice reflective journaling after significant cross-cultural interactions.",
    id: "Latih jurnal reflektif setelah interaksi lintas budaya yang signifikan.",
    nl: "Oefen reflectief journaling na significante interculturele interacties.",
  },
  {
    number: "4",
    en: "Seek out a cultural mentor — someone who can give you honest feedback on your blind spots.",
    id: "Cari mentor budaya — seseorang yang dapat memberi Anda umpan balik jujur tentang titik buta Anda.",
    nl: "Zoek een culturele mentor — iemand die je eerlijke feedback kan geven over je blinde vlekken.",
  },
  {
    number: "5",
    en: "Debrief cross-cultural failures without shame. Every misread is a learning opportunity.",
    id: "Evaluasi kegagalan lintas budaya tanpa rasa malu. Setiap salah baca adalah peluang belajar.",
    nl: "Debrief interculturele mislukkingen zonder schaamte. Elk misverstand is een leerkans.",
  },
];

const reflectionQuestions = [
  {
    roman: "I",
    en: "Which CQ dimension feels most natural to you, and which is your greatest growth edge?",
    id: "Dimensi CQ mana yang paling alami bagi Anda, dan mana yang menjadi area pertumbuhan terbesar Anda?",
    nl: "Welke CQ-dimensie voelt het meest natuurlijk voor je, en welke is je grootste groeipunt?",
  },
  {
    roman: "II",
    en: "Think of a cross-cultural interaction that went wrong. Which CQ dimension was underdeveloped?",
    id: "Pikirkan interaksi lintas budaya yang berjalan salah. Dimensi CQ mana yang kurang berkembang?",
    nl: "Denk aan een interculturele interactie die misging. Welke CQ-dimensie was onderontwikkeld?",
  },
  {
    roman: "III",
    en: "How does your faith shape your motivation to understand people from other cultures?",
    id: "Bagaimana iman Anda membentuk motivasi Anda untuk memahami orang dari budaya lain?",
    nl: "Hoe vormt je geloof je motivatie om mensen uit andere culturen te begrijpen?",
  },
  {
    roman: "IV",
    en: "What cultural assumption do you hold that you have never seriously questioned?",
    id: "Asumsi budaya apa yang Anda pegang yang belum pernah Anda pertanyakan secara serius?",
    nl: "Welke culturele aanname heb je die je nooit serieus hebt bevraagd?",
  },
  {
    roman: "V",
    en: "Who in your team has higher CQ than you in specific areas? What can you learn from them?",
    id: "Siapa dalam tim Anda yang memiliki CQ lebih tinggi dari Anda di area tertentu? Apa yang dapat Anda pelajari dari mereka?",
    nl: "Wie in je team heeft een hogere CQ dan jij op specifieke gebieden? Wat kun je van hen leren?",
  },
  {
    roman: "VI",
    en: "What would change in your leadership if you increased your Behavioral CQ by even 20%?",
    id: "Apa yang akan berubah dalam kepemimpinan Anda jika Anda meningkatkan CQ Perilaku Anda bahkan sebesar 20%?",
    nl: "Wat zou er veranderen in je leiderschap als je je Gedragsmatige CQ met zelfs 20% zou verhogen?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function CulturalIntelligenceClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("cultural-intelligence");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      {/* LANG SWITCHER */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* HERO */}
      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Cross-Cultural Leadership", "Kepemimpinan Lintas Budaya", "Intercultureel Leiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Cultural Intelligence (CQ)", "Kecerdasan Budaya (CQ)", "Culturele Intelligentie (CQ)")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"The ability to cross divides and thrive in multiple cultures." — David Livermore',
            '"Kemampuan untuk melampaui perbedaan dan berkembang dalam berbagai budaya." — David Livermore',
            '"Het vermogen om grenzen te overstijgen en te gedijen in meerdere culturen." — David Livermore'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", borderRadius: 6, border: `1px solid oklch(50% 0.05 260)`, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      {/* INTRO */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Cultural Intelligence — often abbreviated as CQ — is the capability to function effectively across national, ethnic, and organizational cultures. Unlike cultural knowledge alone, CQ is an active, learnable skill set that transforms how you read situations, relate to people, and make decisions in multicultural environments.",
            "Kecerdasan Budaya — sering disingkat CQ — adalah kemampuan untuk berfungsi secara efektif di berbagai budaya nasional, etnis, dan organisasi. Berbeda dengan pengetahuan budaya semata, CQ adalah seperangkat keterampilan aktif yang dapat dipelajari yang mengubah cara Anda membaca situasi, berhubungan dengan orang, dan membuat keputusan dalam lingkungan multikultural.",
            "Culturele Intelligentie — vaak afgekort als CQ — is het vermogen om effectief te functioneren in nationale, etnische en organisatorische culturen. Anders dan louter culturele kennis, is CQ een actieve, aanleerbaare vaardigheidsset die transformeert hoe je situaties leest, je verhoudt tot mensen en beslissingen neemt in multiculturele omgevingen."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Developed by researchers David Livermore and Soon Ang, the CQ framework identifies four distinct but interconnected dimensions. Growing in all four is what separates leaders who merely survive cross-cultural ministry from those who truly thrive in it.",
            "Dikembangkan oleh peneliti David Livermore dan Soon Ang, kerangka CQ mengidentifikasi empat dimensi yang berbeda tetapi saling terkait. Pertumbuhan di keempat dimensi inilah yang membedakan pemimpin yang sekadar bertahan dalam pelayanan lintas budaya dari mereka yang benar-benar berkembang.",
            "Ontwikkeld door onderzoekers David Livermore en Soon Ang, identificeert het CQ-framework vier onderscheidende maar onderling verbonden dimensies. Groeien in alle vier is wat leiders scheidt die slechts overleven in interculturele bediening van degenen die er echt in gedijen."
          )}
        </p>
      </div>

      {/* CQ DIMENSIONS */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 8, textAlign: "center" }}>
            {t("The Four Dimensions of CQ", "Empat Dimensi CQ", "De Vier Dimensies van CQ")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, marginBottom: 48, fontSize: 16, lineHeight: 1.75 }}>
            {t("Each dimension builds on the others. True cultural agility requires all four.", "Setiap dimensi dibangun di atas yang lain. Ketangkasan budaya sejati membutuhkan keempat dimensi.", "Elke dimensie bouwt voort op de andere. Echte culturele behendigheid vereist alle vier.")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {cqDimensions.map((d) => (
              <div key={d.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{d.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? d.en_title : lang === "id" ? d.id_title : d.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? d.en_desc : lang === "id" ? d.id_desc : d.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEVELOP CQ */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 8, textAlign: "center" }}>
          {t("5 Ways to Develop Your CQ", "5 Cara Mengembangkan CQ Anda", "5 Manieren om je CQ te Ontwikkelen")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, marginBottom: 48, fontSize: 16 }}>
          {t("CQ is not a personality trait — it is a practiced discipline.", "CQ bukan sifat kepribadian — ini adalah disiplin yang dipraktikkan.", "CQ is geen persoonlijkheidstrek — het is een geoefende discipline.")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {developSteps.map((s) => (
            <div key={s.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{s.number}</div>
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                {lang === "en" ? s.en : lang === "id" ? s.id : s.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* REFLECTION QUESTIONS */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 8, textAlign: "center" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, marginBottom: 48, fontSize: 16 }}>
            {t("Take time with each one. These are not quiz questions — they are invitations to grow.", "Luangkan waktu untuk setiap pertanyaan. Ini bukan pertanyaan kuis — ini adalah undangan untuk bertumbuh.", "Neem de tijd voor elk. Dit zijn geen quizvragen — het zijn uitnodigingen om te groeien.")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {reflectionQuestions.map((q) => (
              <div key={q.roman} style={{ background: offWhite, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
