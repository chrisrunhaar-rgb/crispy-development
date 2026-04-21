"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const dimensions = [
  {
    number: "1",
    en_title: "High-Context vs. Low-Context",
    id_title: "Konteks Tinggi vs. Konteks Rendah",
    nl_title: "Hoge-Context vs. Lage-Context",
    en_desc: "High-context cultures (Japan, Arab world, much of Southeast Asia) communicate meaning through tone, silence, relationships, and what is NOT said. Low-context cultures (Germany, Netherlands, USA) prioritise explicit, direct verbal communication. Misreading this leads to misunderstanding or inadvertent offense.",
    id_desc: "Budaya konteks tinggi (Jepang, dunia Arab, banyak Asia Tenggara) menyampaikan makna melalui nada, keheningan, hubungan, dan apa yang TIDAK dikatakan. Budaya konteks rendah (Jerman, Belanda, AS) memprioritaskan komunikasi verbal yang eksplisit dan langsung.",
    nl_desc: "Hoge-contextculturen (Japan, Arabische wereld, groot deel van Zuidoost-Azië) communiceren betekenis via toon, stilte, relaties en wat NIET gezegd wordt. Lage-contextculturen (Duitsland, Nederland, VS) geven prioriteit aan expliciete, directe verbale communicatie.",
  },
  {
    number: "2",
    en_title: "Direct vs. Indirect Communication",
    id_title: "Komunikasi Langsung vs. Tidak Langsung",
    nl_title: "Directe vs. Indirecte Communicatie",
    en_desc: "Direct communicators say what they mean and expect others to do the same. Indirect communicators rely on implication, story, and intermediaries to convey difficult truths — particularly when face or harmony is at stake. Neither is dishonest; they are different grammars of truth.",
    id_desc: "Komunikator langsung mengatakan apa yang mereka maksud dan mengharapkan orang lain melakukan hal yang sama. Komunikator tidak langsung mengandalkan implikasi, cerita, dan perantara untuk menyampaikan kebenaran yang sulit — terutama ketika harga diri atau harmoni dipertaruhkan.",
    nl_desc: "Directe communicatoren zeggen wat ze bedoelen en verwachten dat anderen hetzelfde doen. Indirecte communicatoren vertrouwen op implicatie, verhaal en tussenpersonen om moeilijke waarheden over te brengen — met name als gezicht of harmonie op het spel staat.",
  },
  {
    number: "3",
    en_title: "Formal vs. Informal",
    id_title: "Formal vs. Informal",
    nl_title: "Formeel vs. Informeel",
    en_desc: "Some cultures expect strict protocol around titles, seating, greetings, and meeting flow. Others thrive on first names and casual conversation. Jumping levels of formality before a relationship has been built is perceived as disrespectful in many Asian and African cultures.",
    id_desc: "Beberapa budaya mengharapkan protokol ketat seputar gelar, tempat duduk, salam, dan alur rapat. Yang lain berkembang dengan nama depan dan percakapan santai. Melompati tingkat formalitas sebelum hubungan dibangun dianggap tidak sopan di banyak budaya Asia dan Afrika.",
    nl_desc: "Sommige culturen verwachten strikte protocollen rondom titels, zitplaatsen, begroetingen en vergaderverloop. Andere gedijen op voornamen en informeel gesprek. Te snel formele niveaus overslaan wordt in veel Aziatische en Afrikaanse culturen als respectloos ervaren.",
  },
  {
    number: "4",
    en_title: "Expressive vs. Reserved",
    id_title: "Ekspresif vs. Tertahan",
    nl_title: "Expressief vs. Gereserveerd",
    en_desc: "Expressive cultures (Latin America, Southern Europe, parts of Africa) show emotion openly in professional contexts. Reserved cultures (Nordic countries, East Asia) value emotional restraint as professional and respectful. Expressiveness is not drama; reservedness is not coldness.",
    id_desc: "Budaya ekspresif (Amerika Latin, Eropa Selatan, sebagian Afrika) menunjukkan emosi secara terbuka dalam konteks profesional. Budaya tertahan (negara-negara Nordik, Asia Timur) menghargai pengendalian emosi sebagai profesional dan hormat.",
    nl_desc: "Expressieve culturen (Latijns-Amerika, Zuid-Europa, delen van Afrika) tonen emotie openlijk in professionele contexten. Gereserveerde culturen (Scandinavische landen, Oost-Azië) waarderen emotionele terughoudendheid als professioneel en respectvol.",
  },
];

const principles = [
  { number: "1", en: "Listen for meaning, not just words — notice tone, pace, and what is left unsaid.", id: "Dengarkan makna, bukan hanya kata-kata — perhatikan nada, tempo, dan apa yang tidak diucapkan.", nl: "Luister naar betekenis, niet alleen woorden — let op toon, tempo en wat onuitgesproken blijft." },
  { number: "2", en: "Ask clarifying questions without assumption — 'What did you mean by that?' goes a long way.", id: "Ajukan pertanyaan klarifikasi tanpa asumsi — 'Apa yang Anda maksud dengan itu?' sangat membantu.", nl: "Stel verhelderende vragen zonder aannames — 'Wat bedoel je daarmee?' gaat een lange weg." },
  { number: "3", en: "Name your own communication style openly — it creates safety for others to name theirs.", id: "Sebutkan gaya komunikasi Anda sendiri secara terbuka — ini menciptakan keamanan bagi orang lain untuk menyebutkan gaya mereka.", nl: "Benoem je eigen communicatiestijl openlijk — het creëert veiligheid voor anderen om de hunne te benoemen." },
  { number: "4", en: "Slow down in cross-cultural conversations — misreading is more likely when you go fast.", id: "Perlambat dalam percakapan lintas budaya — salah membaca lebih mungkin terjadi ketika Anda terburu-buru.", nl: "Vertraag in interculturele gesprekken — verkeerd interpreteren is waarschijnlijker als je snel gaat." },
  { number: "5", en: "Assume misunderstanding before assuming bad intent — grace first, interpretation second.", id: "Asumsikan kesalahpahaman sebelum mengasumsikan niat buruk — anugerah dulu, interpretasi kemudian.", nl: "Ga uit van misverstand voordat je uitgaat van kwade bedoelingen — genade eerst, interpretatie tweede." },
];

const reflectionQuestions = [
  { roman: "I", en: "Which communication dimension creates the most friction for you personally? What triggers it?", id: "Dimensi komunikasi mana yang menciptakan gesekan paling banyak bagi Anda secara pribadi? Apa yang memicunya?", nl: "Welke communicatiedimensie creëert de meeste wrijving voor jou persoonlijk? Wat triggert het?" },
  { roman: "II", en: "Can you recall a cross-cultural miscommunication that, in hindsight, makes complete sense now?", id: "Dapatkah Anda mengingat miskomunikasi lintas budaya yang, jika dipikir ulang, kini masuk akal sepenuhnya?", nl: "Kun je je een interculturele miscommunicatie herinneren die achteraf volkomen logisch is?" },
  { roman: "III", en: "How do you handle silence in conversation? What does silence mean in your culture vs. others you work with?", id: "Bagaimana Anda menangani keheningan dalam percakapan? Apa arti keheningan dalam budaya Anda vs. budaya lain yang Anda kerjakan?", nl: "Hoe ga je om met stilte in gesprekken? Wat betekent stilte in jouw cultuur vs. anderen waarmee je werkt?" },
  { roman: "IV", en: "Are you naturally expressive or reserved? How does that affect how your team reads you?", id: "Apakah Anda secara alami ekspresif atau tertahan? Bagaimana itu mempengaruhi cara tim Anda membaca Anda?", nl: "Ben je van nature expressief of gereserveerd? Hoe beïnvloedt dat hoe je team jou leest?" },
  { roman: "V", en: "What would it look like to build a team communication covenant that honours multiple styles?", id: "Seperti apa membangun perjanjian komunikasi tim yang menghormati berbagai gaya?", nl: "Hoe zou het eruit zien om een teamcommunicatieverbond te bouwen dat meerdere stijlen eert?" },
  { roman: "VI", en: "How does the biblical call to 'speak truth in love' apply across these four dimensions?", id: "Bagaimana panggilan alkitabiah untuk 'berkata benar dengan kasih' berlaku di keempat dimensi ini?", nl: "Hoe past de bijbelse roeping tot 'waarheid spreken in liefde' op deze vier dimensies?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function InterculturalCommunicationClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("intercultural-communication");
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
          {t("Communication", "Komunikasi", "Communicatie")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Intercultural Communication", "Komunikasi Antarbudaya", "Interculturele Communicatie")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"The biggest problem in communication is the illusion that it has taken place." — George Bernard Shaw',
            '"Masalah terbesar dalam komunikasi adalah ilusi bahwa komunikasi telah terjadi." — George Bernard Shaw',
            '"Het grootste probleem in communicatie is de illusie dat het heeft plaatsgevonden." — George Bernard Shaw'
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
            "Communication is never just the transfer of information. It is a cultural act — shaped by history, value systems, relationships, and power dynamics. What feels clear and honest in one culture can feel blunt or even rude in another. What feels warm and indirect in one setting reads as evasive or untrustworthy in another.",
            "Komunikasi bukan sekadar transfer informasi. Ini adalah tindakan budaya — dibentuk oleh sejarah, sistem nilai, hubungan, dan dinamika kekuasaan. Apa yang terasa jelas dan jujur dalam satu budaya bisa terasa blak-blakan atau bahkan kasar di budaya lain.",
            "Communicatie is nooit alleen de overdracht van informatie. Het is een culturele daad — gevormd door geschiedenis, waardensystemen, relaties en machtsdynamiek. Wat in één cultuur duidelijk en eerlijk aanvoelt, kan in een andere bot of zelfs onbeleefd lijken."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Cross-cultural leaders who understand the four major communication dimensions are better equipped to speak in ways that are heard, listen in ways that understand, and lead in ways that build rather than erode trust.",
            "Pemimpin lintas budaya yang memahami empat dimensi komunikasi utama lebih siap untuk berbicara dengan cara yang didengar, mendengarkan dengan cara yang memahami, dan memimpin dengan cara yang membangun daripada mengikis kepercayaan.",
            "Interculturele leiders die de vier grote communicatiedimensies begrijpen zijn beter uitgerust om te spreken op manieren die gehoord worden, te luisteren op manieren die begrijpen, en te leiden op manieren die vertrouwen opbouwen in plaats van afbreken."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("4 Communication Dimensions", "4 Dimensi Komunikasi", "4 Communicatiedimensies")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {dimensions.map((d) => (
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

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("5 Practical Principles", "5 Prinsip Praktis", "5 Praktische Principes")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {principles.map((p) => (
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
