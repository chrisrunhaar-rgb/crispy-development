"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const trustTypes = [
  {
    en_title: "Task-Based Trust",
    id_title: "Kepercayaan Berbasis Tugas",
    nl_title: "Taakgebaseerd Vertrouwen",
    en_desc: "Common in Northern European and North American cultures. Trust is earned by competence, reliability, and delivering results. Relationships follow once someone proves they can do the work. The fastest path to trust is performance.",
    id_desc: "Umum di budaya Eropa Utara dan Amerika Utara. Kepercayaan diperoleh melalui kompetensi, keandalan, dan memberikan hasil. Hubungan mengikuti setelah seseorang membuktikan mereka bisa melakukan pekerjaan.",
    nl_desc: "Gangbaar in Noord-Europese en Noord-Amerikaanse culturen. Vertrouwen wordt verdiend door competentie, betrouwbaarheid en resultaten leveren. Relaties volgen zodra iemand bewijst dat ze het werk kunnen doen.",
  },
  {
    en_title: "Relationship-Based Trust",
    id_title: "Kepercayaan Berbasis Hubungan",
    nl_title: "Relatiegebaseerd Vertrouwen",
    en_desc: "Common in much of Asia, the Middle East, Africa, and Latin America. Trust is built through personal connection, shared experience, and genuine investment in the other person. Business follows relationship — not the other way around. Skipping this stage undermines everything that follows.",
    id_desc: "Umum di sebagian besar Asia, Timur Tengah, Afrika, dan Amerika Latin. Kepercayaan dibangun melalui koneksi pribadi, pengalaman bersama, dan investasi nyata pada orang lain. Bisnis mengikuti hubungan — bukan sebaliknya.",
    nl_desc: "Gangbaar in groot deel van Azië, het Midden-Oosten, Afrika en Latijns-Amerika. Vertrouwen wordt opgebouwd via persoonlijke verbinding, gedeelde ervaringen en echte investering in de ander. Zaken volgen relatie — niet andersom.",
  },
];

const principles = [
  { number: "1", en_title: "Know which trust language your team speaks", id_title: "Ketahui bahasa kepercayaan tim Anda", nl_title: "Ken de vertrouwenstaal van je team", en_desc: "Don't assume everyone earns trust the same way you do. Ask: does this person need to see my track record first, or do they need to know me as a person first? Invest accordingly.", id_desc: "Jangan asumsikan semua orang mendapatkan kepercayaan dengan cara yang sama seperti Anda. Tanyakan: apakah orang ini perlu melihat rekam jejak saya terlebih dahulu, atau mereka perlu mengenal saya sebagai pribadi terlebih dahulu?", nl_desc: "Veronderstel niet dat iedereen op dezelfde manier vertrouwen verdient als jij. Vraag jezelf: moet deze persoon eerst mijn trackrecord zien, of moeten ze me eerst als persoon leren kennen?" },
  { number: "2", en_title: "Consistency over time is universally trusted", id_title: "Konsistensi dari waktu ke waktu dipercaya secara universal", nl_title: "Consistentie door de tijd wordt universeel vertrouwd", en_desc: "Regardless of cultural background, people trust leaders who do what they say, say what they mean, and are the same person in private and in public. Integrity is the common currency of all trust.", id_desc: "Terlepas dari latar belakang budaya, orang mempercayai pemimpin yang melakukan apa yang mereka katakan, mengatakan apa yang mereka maksud, dan menjadi orang yang sama dalam kehidupan pribadi dan publik.", nl_desc: "Ongeacht culturele achtergrond vertrouwen mensen leiders die doen wat ze zeggen, zeggen wat ze bedoelen, en dezelfde persoon zijn in het privéleven en in het openbaar." },
  { number: "3", en_title: "Vulnerability accelerates trust", id_title: "Kerentanan mempercepat kepercayaan", nl_title: "Kwetsbaarheid versnelt vertrouwen", en_desc: "Admitting uncertainty, asking for help, and acknowledging a mistake signals safety. In most cultures, a leader who refuses to show any weakness is less trusted, not more — because it signals either dishonesty or insecurity.", id_desc: "Mengakui ketidakpastian, meminta bantuan, dan mengakui kesalahan memberi sinyal keamanan. Dalam kebanyakan budaya, pemimpin yang menolak menunjukkan kelemahan apa pun kurang dipercaya, bukan lebih.", nl_desc: "Onzekerheid toegeven, om hulp vragen en een fout erkennen signaleert veiligheid. In de meeste culturen wordt een leider die elke zwakte weigert te tonen minder vertrouwd, niet meer." },
  { number: "4", en_title: "Repair broken trust quickly and specifically", id_title: "Perbaiki kepercayaan yang rusak dengan cepat dan spesifik", nl_title: "Herstel gebroken vertrouwen snel en specifiek", en_desc: "When trust breaks — and it will — address it directly, name what happened, own your part, and ask what repair would look like. Generic apologies often deepen the wound; specific ones begin healing.", id_desc: "Ketika kepercayaan rusak — dan itu akan terjadi — tangani secara langsung, sebutkan apa yang terjadi, akui bagian Anda, dan tanyakan seperti apa perbaikan yang terlihat.", nl_desc: "Wanneer vertrouwen breekt — en dat zal gebeuren — pak het direct aan, benoem wat er is gebeurd, erken je aandeel, en vraag hoe herstel eruit zou zien." },
];

const trustDiffs = [
  { en_label: "High-trust cultures", id_label: "Budaya kepercayaan tinggi", nl_label: "Hoge-vertrouwenculturen", en_desc: "Trust is assumed until broken. Systems and contracts exist but are not the primary mechanism. Relationships are built on shared reputation and social networks.", id_desc: "Kepercayaan diasumsikan sampai rusak. Sistem dan kontrak ada tetapi bukan mekanisme utama. Hubungan dibangun atas reputasi bersama dan jaringan sosial.", nl_desc: "Vertrouwen wordt verondersteld totdat het gebroken is. Systemen en contracten bestaan maar zijn niet het primaire mechanisme." },
  { en_label: "Low-trust cultures", id_label: "Budaya kepercayaan rendah", nl_label: "Lage-vertrouwenculturen", en_desc: "Trust must be explicitly earned. Formal structures, contracts, and verification systems play a larger role. Personal connection still matters but proof is required first.", id_desc: "Kepercayaan harus secara eksplisit diperoleh. Struktur formal, kontrak, dan sistem verifikasi memainkan peran yang lebih besar. Koneksi pribadi masih penting tetapi bukti diperlukan terlebih dahulu.", nl_desc: "Vertrouwen moet expliciet worden verdiend. Formele structuren, contracten en verificatiesystemen spelen een grotere rol. Persoonlijke verbinding telt nog steeds maar bewijs is eerst vereist." },
];

const reflectionQuestions = [
  { roman: "I", en: "Do you naturally build trust through task-delivery or through relationship investment? What is your default?", id: "Apakah Anda secara alami membangun kepercayaan melalui penyelesaian tugas atau investasi hubungan? Apa default Anda?", nl: "Bouw jij van nature vertrouwen op via taakvoltooiing of via relatie-investering? Wat is jouw standaard?" },
  { roman: "II", en: "Who in your team trusts you deeply? Who does not? What accounts for the difference?", id: "Siapa dalam tim Anda yang sangat mempercayai Anda? Siapa yang tidak? Apa yang menyebabkan perbedaan tersebut?", nl: "Wie in je team vertrouwt je diep? Wie niet? Wat verklaart het verschil?" },
  { roman: "III", en: "When has a lack of relational investment cost you influence that could not be recovered quickly?", id: "Kapan kurangnya investasi relasional menghabiskan pengaruh Anda yang tidak dapat dipulihkan dengan cepat?", nl: "Wanneer heeft een gebrek aan relationele investering je invloed gekost die niet snel hersteld kon worden?" },
  { roman: "IV", en: "How does the biblical idea of faithfulness (pistis) shape your theology of trust-building?", id: "Bagaimana konsep alkitabiah tentang kesetiaan (pistis) membentuk teologi Anda tentang membangun kepercayaan?", nl: "Hoe vormt het bijbelse begrip trouw (pistis) jouw theologie van vertrouwen opbouwen?" },
  { roman: "V", en: "Have you ever had to rebuild broken trust cross-culturally? What did you learn?", id: "Pernahkah Anda harus membangun kembali kepercayaan yang rusak secara lintas budaya? Apa yang Anda pelajari?", nl: "Heb je ooit gebroken vertrouwen intercultureel moeten herstellen? Wat heb je geleerd?" },
  { roman: "VI", en: "What specific investment could you make this week to deepen trust with one team member?", id: "Investasi spesifik apa yang bisa Anda lakukan minggu ini untuk memperdalam kepercayaan dengan satu anggota tim?", nl: "Welke specifieke investering kun je deze week doen om vertrouwen met één teamlid te verdiepen?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function BuildingTrustClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("building-trust-across-cultures");
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
          {t("Relationships", "Hubungan", "Relaties")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Building Trust Across Cultures", "Membangun Kepercayaan Lintas Budaya", "Vertrouwen Opbouwen Across Culturen")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Trust is the glue of life. It is the most essential ingredient in effective communication." — Stephen Covey',
            '"Kepercayaan adalah perekat kehidupan. Ini adalah bahan paling esensial dalam komunikasi yang efektif." — Stephen Covey',
            '"Vertrouwen is de lijm van het leven. Het is het meest essentiële ingrediënt in effectieve communicatie." — Stephen Covey'
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
            "Trust is not universal — the way it is built, broken, and repaired differs significantly across cultures. A leader who earns deep trust in one cultural context may find themselves starting from zero when they move to another — not because of character failure, but because the trust-building grammar is different.",
            "Kepercayaan tidak universal — cara membangun, merusak, dan memperbaikinya berbeda secara signifikan di berbagai budaya. Seorang pemimpin yang mendapatkan kepercayaan mendalam dalam satu konteks budaya mungkin mendapati diri mereka mulai dari nol ketika pindah ke yang lain.",
            "Vertrouwen is niet universeel — de manier waarop het wordt opgebouwd, gebroken en hersteld verschilt aanzienlijk tussen culturen. Een leider die diep vertrouwen verdient in één culturele context kan zich nul zien beginnen wanneer ze naar een andere verhuizen."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "The foundational distinction, identified by researchers Fons Trompenaars and Charles Hampden-Turner, is between task-based and relationship-based trust. Understanding which mode your team operates in is essential for earning genuine influence.",
            "Perbedaan mendasar, yang diidentifikasi oleh peneliti Fons Trompenaars dan Charles Hampden-Turner, adalah antara kepercayaan berbasis tugas dan berbasis hubungan. Memahami mode mana yang dioperasikan tim Anda sangat penting untuk mendapatkan pengaruh yang nyata.",
            "Het fundamentele onderscheid, geïdentificeerd door onderzoekers Fons Trompenaars en Charles Hampden-Turner, is tussen taakgebaseerd en relatiegebaseerd vertrouwen."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Two Foundations of Trust", "Dua Fondasi Kepercayaan", "Twee Fundamenten van Vertrouwen")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {trustTypes.map((type, i) => (
              <div key={i} style={{ background: offWhite, borderRadius: 12, padding: "32px 28px" }}>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 16 }}>
                  {lang === "en" ? type.en_title : lang === "id" ? type.id_title : type.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? type.en_desc : lang === "id" ? type.id_desc : type.nl_desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("4 Trust-Building Principles", "4 Prinsip Membangun Kepercayaan", "4 Principes voor Vertrouwen Opbouwen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {principles.map((p) => (
            <div key={p.number} style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{p.number}</div>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? p.en_title : lang === "id" ? p.id_title : p.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? p.en_desc : lang === "id" ? p.id_desc : p.nl_desc}
                </p>
              </div>
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
