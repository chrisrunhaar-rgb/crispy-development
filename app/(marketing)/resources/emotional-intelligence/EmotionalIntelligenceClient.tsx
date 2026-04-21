"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const components = [
  { number: "1", en_title: "Self-Awareness", id_title: "Kesadaran Diri", nl_title: "Zelfbewustzijn", en_desc: "The ability to recognise and understand your own emotions, strengths, weaknesses, drives, values, and their impact on others. Self-aware leaders are not surprised by their emotions — they notice them in real time and understand what drives them.", id_desc: "Kemampuan untuk mengenali dan memahami emosi, kekuatan, kelemahan, dorongan, nilai Anda sendiri, dan dampaknya pada orang lain. Pemimpin yang sadar diri tidak terkejut dengan emosi mereka — mereka memperhatikannya secara real time.", nl_desc: "Het vermogen om je eigen emoties, sterke en zwakke punten, driften, waarden en hun impact op anderen te herkennen en begrijpen. Zelfbewuste leiders worden niet verrast door hun emoties — ze merken ze in realtime op." },
  { number: "2", en_title: "Self-Regulation", id_title: "Regulasi Diri", nl_title: "Zelfregulering", en_desc: "The ability to manage disruptive impulses and moods — to think before acting. Leaders who self-regulate don't let frustration turn into reactivity. They create space between stimulus and response, which is where wisdom lives.", id_desc: "Kemampuan untuk mengelola impuls dan suasana hati yang mengganggu — untuk berpikir sebelum bertindak. Pemimpin yang meregulasi diri tidak membiarkan frustrasi berubah menjadi reaktivitas.", nl_desc: "Het vermogen om verstorende impulsen en stemmingen te beheersen — te denken voor je handelt. Leiders die zichzelf reguleren laten frustratie niet omslaan in reactiviteit." },
  { number: "3", en_title: "Motivation", id_title: "Motivasi", nl_title: "Motivatie", en_desc: "A passion for work beyond money or status — driven by an inner desire to achieve and improve. Highly motivated leaders set stretch goals, track progress persistently, and remain optimistic even when things go wrong. Their energy is contagious.", id_desc: "Gairah untuk bekerja di luar uang atau status — didorong oleh keinginan batin untuk mencapai dan berkembang. Pemimpin yang sangat termotivasi menetapkan tujuan yang menantang, melacak kemajuan secara konsisten.", nl_desc: "Een passie voor werk die verder gaat dan geld of status — aangedreven door een innerlijk verlangen om te bereiken en verbeteren. Sterk gemotiveerde leiders stellen uitdagende doelen en houden optimisme vast." },
  { number: "4", en_title: "Empathy", id_title: "Empati", nl_title: "Empathie", en_desc: "The ability to understand and consider others' emotional makeup — especially when making decisions. Empathetic leaders don't just hear words; they sense what is beneath them. In cross-cultural contexts, empathy requires extra imagination because emotional expression varies so widely.", id_desc: "Kemampuan untuk memahami dan mempertimbangkan susunan emosional orang lain — terutama saat membuat keputusan. Pemimpin yang berempati tidak hanya mendengar kata-kata; mereka merasakan apa yang ada di baliknya.", nl_desc: "Het vermogen om de emotionele gesteldheid van anderen te begrijpen en te overwegen — vooral bij het nemen van beslissingen. Empathische leiders horen niet alleen woorden; ze voelen wat eronder zit." },
  { number: "5", en_title: "Social Skill", id_title: "Keterampilan Sosial", nl_title: "Sociale Vaardigheid", en_desc: "Proficiency in managing relationships and building networks — the ability to find common ground and build rapport across differences. Socially skilled leaders are persuasive without being manipulative, collaborative without losing directness.", id_desc: "Kemahiran dalam mengelola hubungan dan membangun jaringan — kemampuan menemukan titik temu dan membangun hubungan baik di tengah perbedaan. Pemimpin yang terampil secara sosial persuasif tanpa menjadi manipulatif.", nl_desc: "Vaardigheid in het beheren van relaties en netwerken opbouwen — het vermogen om gemeenschappelijke grond te vinden en rapport op te bouwen over verschillen heen." },
];

const practices = [
  { number: "1", en: "Keep a daily emotion log — name what you felt, when, and what triggered it. Naming is the beginning of regulation.", id: "Simpan catatan emosi harian — namai apa yang Anda rasakan, kapan, dan apa yang memicunya. Penamaan adalah awal dari regulasi.", nl: "Houd een dagelijks emotielogboek bij — benoem wat je voelde, wanneer en wat het triggerde. Benoemen is het begin van regulering." },
  { number: "2", en: "Before any difficult conversation, pause for 60 seconds to name your emotional state and your goal.", id: "Sebelum percakapan sulit apa pun, berhenti sejenak selama 60 detik untuk menyebutkan kondisi emosional Anda dan tujuan Anda.", nl: "Pauzeer voor elk moeilijk gesprek 60 seconden om je emotionele staat en je doel te benoemen." },
  { number: "3", en: "Practice perspective-taking — before reacting, ask: 'What might this feel like from their side of the table?'", id: "Latih pengambilan perspektif — sebelum bereaksi, tanyakan: 'Seperti apa rasanya dari sisi mereka?'", nl: "Oefen perspectiefname — vraag voor je reageert: 'Hoe zou dit aanvoelen vanuit hun kant van de tafel?'" },
  { number: "4", en: "Seek unfiltered feedback on your emotional impact from someone you trust completely.", id: "Cari umpan balik yang tidak tersaring tentang dampak emosional Anda dari seseorang yang Anda percaya sepenuhnya.", nl: "Zoek ongefiltreerde feedback over je emotionele impact van iemand die je volledig vertrouwt." },
  { number: "5", en: "Celebrate team wins emotionally — not just logistically. People remember how you made them feel, not the slide deck.", id: "Rayakan kemenangan tim secara emosional — bukan hanya secara logistis. Orang mengingat bagaimana Anda membuat mereka merasa, bukan presentasi.", nl: "Vier teamoverwinningen emotioneel — niet alleen logistiek. Mensen herinneren hoe je ze liet voelen, niet het slidedeck." },
];

const reflectionQuestions = [
  { roman: "I", en: "Which of Goleman's five components is your strongest? Which most needs development?", id: "Manakah dari lima komponen Goleman yang paling kuat dalam diri Anda? Mana yang paling perlu dikembangkan?", nl: "Welke van Golemans vijf componenten is jouw sterkste? Welke vraagt het meest om ontwikkeling?" },
  { roman: "II", en: "When did you last react emotionally in a way that damaged a relationship? What would high EQ have looked like?", id: "Kapan terakhir kali Anda bereaksi secara emosional dengan cara yang merusak suatu hubungan? Seperti apa EQ yang tinggi?", nl: "Wanneer reageerde je voor het laatst emotioneel op een manier die een relatie schaadde? Hoe had hoge EQ eruitzien?" },
  { roman: "III", en: "How does cross-cultural context make empathy harder — and how are you compensating for that?", id: "Bagaimana konteks lintas budaya membuat empati lebih sulit — dan bagaimana Anda mengkompensasi hal itu?", nl: "Hoe maakt interculturele context empathie moeilijker — en hoe compenseer je daarvoor?" },
  { roman: "IV", en: "Who in your life has modelled extraordinary emotional intelligence? What did they do differently?", id: "Siapa dalam hidup Anda yang telah menunjukkan kecerdasan emosional yang luar biasa? Apa yang mereka lakukan secara berbeda?", nl: "Wie in je leven heeft buitengewone emotionele intelligentie gemodelleerd? Wat deden zij anders?" },
  { roman: "V", en: "In what ways does your spiritual formation shape your emotional regulation?", id: "Dengan cara apa pembentukan rohani Anda membentuk regulasi emosional Anda?", nl: "Op welke manieren vormt je spirituele vorming je emotionele regulatie?" },
  { roman: "VI", en: "What would your team say is your most consistent emotional pattern — positive or negative?", id: "Apa yang akan dikatakan tim Anda tentang pola emosional Anda yang paling konsisten — positif atau negatif?", nl: "Wat zou je team zeggen dat jouw meest consistente emotionele patroon is — positief of negatief?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function EmotionalIntelligenceClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("emotional-intelligence");
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
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Self-Leadership", "Kepemimpinan Diri", "Zelfleiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Emotional Intelligence", "Kecerdasan Emosional", "Emotionele Intelligentie")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"In a high-IQ job pool, soft skills like discipline, drive and empathy mark those who emerge as outstanding." — Daniel Goleman',
            '"Dalam kumpulan pekerjaan IQ tinggi, soft skill seperti disiplin, dorongan, dan empati menandai mereka yang muncul sebagai luar biasa." — Daniel Goleman',
            '"In een pool van hoge-IQ-banen zijn soft skills zoals discipline, gedrevenheid en empathie bepalend voor wie uitblinkt." — Daniel Goleman'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", borderRadius: 6, border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "When Daniel Goleman published Emotional Intelligence in 1995, research revealed something counterintuitive: in leadership roles, EQ often matters more than IQ. The higher people climb in an organisation, the more EQ — not technical skill — determines their effectiveness and impact.",
            "Ketika Daniel Goleman menerbitkan Emotional Intelligence pada tahun 1995, penelitian mengungkapkan sesuatu yang berlawanan dengan intuisi: dalam peran kepemimpinan, EQ sering kali lebih penting daripada IQ.",
            "Toen Daniel Goleman in 1995 Emotional Intelligence publiceerde, onthulde onderzoek iets contra-intuïtiefs: in leiderschapsrollen is EQ vaak belangrijker dan IQ."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "In cross-cultural ministry and leadership, EQ becomes even more critical. You are navigating emotional landscapes shaped by different cultural norms around expression, restraint, conflict, and hierarchy — all at once. Developing EQ is not optional for effective cross-cultural leaders.",
            "Dalam pelayanan dan kepemimpinan lintas budaya, EQ menjadi bahkan lebih kritis. Anda menavigasi lanskap emosional yang dibentuk oleh norma budaya yang berbeda seputar ekspresi, pengendalian, konflik, dan hierarki.",
            "In interculturele bediening en leiderschap wordt EQ nog kritischer. Je navigeert emotionele landschappen gevormd door verschillende culturele normen rondom expressie, terughoudendheid, conflict en hiërarchie."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("Goleman's 5 Components", "5 Komponen Goleman", "Golemans 5 Componenten")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {components.map((c) => (
              <div key={c.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{c.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? c.en_title : lang === "id" ? c.id_title : c.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? c.en_desc : lang === "id" ? c.id_desc : c.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("5 Development Practices", "5 Praktik Pengembangan", "5 Ontwikkelingspraktijken")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {practices.map((p) => (
            <div key={p.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{p.number}</div>
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                {lang === "en" ? p.en : lang === "id" ? p.id : p.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
          </h2>
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
