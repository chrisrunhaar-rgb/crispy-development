"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const comparisonRows = [
  {
    en_aspect: "Authority style",
    id_aspect: "Gaya otoritas",
    nl_aspect: "Autoriteitsstijl",
    en_high: "Top-down, unquestioned",
    id_high: "Atas-ke-bawah, tidak dipertanyakan",
    nl_high: "Top-down, onbetwist",
    en_low: "Consultative, collaborative",
    id_low: "Konsultatif, kolaboratif",
    nl_low: "Consultatief, samenwerkend",
  },
  {
    en_aspect: "Disagreement",
    id_aspect: "Ketidaksetujuan",
    nl_aspect: "Onenigheid",
    en_high: "Rarely expressed openly",
    id_high: "Jarang diungkapkan secara terbuka",
    nl_high: "Zelden openlijk geuit",
    en_low: "Voiced directly and expected",
    id_low: "Diungkapkan langsung dan diharapkan",
    nl_low: "Direct geuit en verwacht",
  },
  {
    en_aspect: "Decision-making",
    id_aspect: "Pengambilan keputusan",
    nl_aspect: "Besluitvorming",
    en_high: "Senior leader decides alone",
    id_high: "Pemimpin senior memutuskan sendiri",
    nl_high: "Seniore leider beslist alleen",
    en_low: "Input sought from all levels",
    id_low: "Masukan dicari dari semua tingkat",
    nl_low: "Input gevraagd van alle niveaus",
  },
  {
    en_aspect: "Feedback flow",
    id_aspect: "Alur umpan balik",
    nl_aspect: "Feedbackstroom",
    en_high: "Downward only",
    id_high: "Hanya ke bawah",
    nl_high: "Alleen neerwaarts",
    en_low: "Multidirectional",
    id_low: "Multiarah",
    nl_low: "Meervoudig gericht",
  },
  {
    en_aspect: "Titles & formality",
    id_aspect: "Gelar & formalitas",
    nl_aspect: "Titels & formaliteit",
    en_high: "Highly valued, expected",
    id_high: "Sangat dihargai, diharapkan",
    nl_high: "Hoog gewaardeerd, verwacht",
    en_low: "Informal; first names common",
    id_low: "Informal; nama depan umum digunakan",
    nl_low: "Informeel; voornamen gangbaar",
  },
];

const implications = [
  {
    number: "1",
    en_title: "Silence is not agreement",
    id_title: "Diam bukan berarti setuju",
    nl_title: "Stilte is geen instemming",
    en_desc: "In high power-distance teams, people rarely challenge a leader publicly. What looks like consensus may be compliance. Learn to create safe, private channels for honest input.",
    id_desc: "Dalam tim dengan jarak kekuasaan tinggi, orang jarang menantang pemimpin di depan umum. Yang terlihat seperti konsensus mungkin hanya kepatuhan. Pelajari cara membuat saluran pribadi yang aman untuk masukan yang jujur.",
    nl_desc: "In teams met hoge machtafstand dagen mensen zelden een leider publiekelijk uit. Wat op consensus lijkt, kan naleving zijn. Leer veilige, privékanalen te creëren voor eerlijke inbreng.",
  },
  {
    number: "2",
    en_title: "Your informality may read as weakness",
    id_title: "Informalitas Anda mungkin terlihat sebagai kelemahan",
    nl_title: "Jouw informaliteit kan als zwakte worden gezien",
    en_desc: "Leaders who come from low power-distance cultures and work in high PD contexts often misread confusion as rejection. Adjust your posture without abandoning your values.",
    id_desc: "Pemimpin yang berasal dari budaya jarak kekuasaan rendah dan bekerja dalam konteks PD tinggi sering salah mengartikan kebingungan sebagai penolakan. Sesuaikan sikap Anda tanpa meninggalkan nilai-nilai Anda.",
    nl_desc: "Leiders uit lage machtafstandsculturen die in hoge PD-contexten werken, interpreteren verwarring vaak als afwijzing. Pas je houding aan zonder je waarden op te geven.",
  },
  {
    number: "3",
    en_title: "The leader's opinion closes the room",
    id_title: "Pendapat pemimpin menutup ruangan",
    nl_title: "De mening van de leider sluit de ruimte",
    en_desc: "If you share your view first in a high PD setting, the team will likely agree — not because they do, but because you do. Share your perspective last, or ask questions instead.",
    id_desc: "Jika Anda berbagi pandangan terlebih dahulu dalam konteks PD tinggi, tim kemungkinan akan setuju — bukan karena mereka setuju, tetapi karena Anda setuju. Bagikan perspektif Anda terakhir, atau ajukan pertanyaan sebagai gantinya.",
    nl_desc: "Als je eerst je mening deelt in een hoge PD-omgeving, zal het team waarschijnlijk instemmen — niet omdat ze het eens zijn, maar omdat jij het bent. Deel je perspectief als laatste, of stel vragen in plaats daarvan.",
  },
  {
    number: "4",
    en_title: "Relationship precedes task authority",
    id_title: "Hubungan mendahului otoritas tugas",
    nl_title: "Relatie gaat vooraf aan taakautoriteit",
    en_desc: "In many high PD cultures, authority must be relationally earned before it is institutionally accepted. Time invested in relationship is not wasted — it is foundational.",
    id_desc: "Dalam banyak budaya PD tinggi, otoritas harus diperoleh secara relasional sebelum diterima secara institusional. Waktu yang diinvestasikan dalam hubungan tidak terbuang — itu adalah fondasi.",
    nl_desc: "In veel hoge PD-culturen moet autoriteit relationeel worden verdiend voordat ze institutioneel wordt geaccepteerd. Tijd geïnvesteerd in relaties is niet verspild — het is fundamenteel.",
  },
];

const strategies = [
  { number: "1", en: "Clarify your own power-distance assumptions before entering a new cultural context.", id: "Klarifikasi asumsi jarak kekuasaan Anda sendiri sebelum memasuki konteks budaya baru.", nl: "Verduidelijk je eigen machtafstandsaannames voordat je een nieuwe culturele context betreedt." },
  { number: "2", en: "In high PD contexts, honor titles and formalities — even if they feel unnecessary to you.", id: "Dalam konteks PD tinggi, hormati gelar dan formalitas — bahkan jika terasa tidak perlu bagi Anda.", nl: "In hoge PD-contexten: eer titels en formaliteiten — ook als ze jou onnodig lijken." },
  { number: "3", en: "Build in one-on-one conversations to surface what won't be said in group settings.", id: "Bangun percakapan satu-satu untuk memunculkan apa yang tidak akan dikatakan dalam kelompok.", nl: "Bouw één-op-één gesprekken in om te achterhalen wat niet in groepsverband wordt gezegd." },
  { number: "4", en: "Model respectful pushback yourself — it gives others permission to do the same safely.", id: "Tunjukkan penolakan yang hormat sendiri — ini memberi orang lain izin untuk melakukan hal yang sama dengan aman.", nl: "Modelleer zelf respectvolle tegenspraak — het geeft anderen toestemming hetzelfde veilig te doen." },
  { number: "5", en: "When leading cross-PD teams, name the tension openly and invite multiple approaches.", id: "Ketika memimpin tim lintas-PD, ungkapkan ketegangan secara terbuka dan undang berbagai pendekatan.", nl: "Bij het leiden van cross-PD-teams: benoem de spanning openlijk en nodig meerdere benaderingen uit." },
];

const reflectionQuestions = [
  { roman: "I", en: "What is your home culture's power-distance orientation? How has it shaped your default leadership style?", id: "Apa orientasi jarak kekuasaan budaya asal Anda? Bagaimana hal itu membentuk gaya kepemimpinan default Anda?", nl: "Wat is de machtafstandsoriëntatie van je thuiscultuur? Hoe heeft het je standaard leiderschapsstijl gevormd?" },
  { roman: "II", en: "Have you ever had your authority resisted or your informality misread? What was actually happening?", id: "Pernahkah otoritas Anda ditolak atau informalitas Anda disalahartikan? Apa yang sebenarnya terjadi?", nl: "Is je autoriteit ooit weerstaan of je informaliteit verkeerd begrepen? Wat speelde er eigenlijk?" },
  { roman: "III", en: "How can you create spaces where people with lower positional power feel genuinely heard?", id: "Bagaimana Anda bisa menciptakan ruang di mana orang dengan kekuatan posisi lebih rendah merasa benar-benar didengar?", nl: "Hoe kun je ruimtes creëren waar mensen met minder positionele macht zich echt gehoord voelen?" },
  { roman: "IV", en: "In what ways might your leadership style be experienced as disrespectful in a high PD culture?", id: "Dengan cara apa gaya kepemimpinan Anda mungkin dianggap tidak hormat dalam budaya PD tinggi?", nl: "Op welke manieren kan jouw leiderschapsstijl als respectloos worden ervaren in een hoge PD-cultuur?" },
  { roman: "V", en: "Jesus led with radical authority and radical servanthood. How does that shape your thinking on power?", id: "Yesus memimpin dengan otoritas radikal dan kerendahan hati radikal. Bagaimana itu membentuk pemikiran Anda tentang kekuasaan?", nl: "Jezus leidde met radicale autoriteit en radicale dienstbaarheid. Hoe vormt dat jouw denken over macht?" },
  { roman: "VI", en: "What would it look like to honor the culture's power expectations while still advocating for healthier dynamics?", id: "Seperti apa menghormati harapan kekuasaan budaya sambil tetap mendukung dinamika yang lebih sehat?", nl: "Hoe zou het eruit zien om de machtsverwachtingen van de cultuur te eren terwijl je toch voor gezondere dynamieken pleit?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function PowerDistanceClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("power-distance");
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
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Cultural Dimensions", "Dimensi Budaya", "Culturele Dimensies")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Power Distance", "Jarak Kekuasaan", "Machtafstand")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Power distance is the extent to which less powerful members of institutions accept unequal distribution of power." — Geert Hofstede',
            '"Jarak kekuasaan adalah sejauh mana anggota institusi yang kurang berkuasa menerima distribusi kekuasaan yang tidak setara." — Geert Hofstede',
            '"Machtafstand is de mate waarin minder machtige leden van instellingen ongelijke verdeling van macht accepteren." — Geert Hofstede'
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

      {/* INTRO */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Power distance is one of Hofstede's original cultural dimensions, and it remains one of the most practically important for cross-cultural leaders. It describes how a society handles inequality — specifically, whether people in less powerful positions accept or challenge the authority of those above them.",
            "Jarak kekuasaan adalah salah satu dimensi budaya asli Hofstede, dan tetap menjadi salah satu yang paling praktis penting bagi pemimpin lintas budaya. Ini menggambarkan bagaimana masyarakat menangani ketidaksetaraan — khususnya, apakah orang dalam posisi yang kurang berkuasa menerima atau menantang otoritas mereka yang di atasnya.",
            "Machtafstand is een van Hofstedes originele culturele dimensies en blijft een van de meest praktisch belangrijke voor interculturele leiders. Het beschrijft hoe een samenleving omgaat met ongelijkheid — met name of mensen in minder machtige posities de autoriteit van degenen boven hen accepteren of uitdagen."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Understanding where your team members sit on this spectrum prevents countless misreadings — and unlocks leadership approaches that are both culturally intelligent and deeply effective.",
            "Memahami di mana anggota tim Anda berada dalam spektrum ini mencegah banyak kesalahan membaca — dan membuka pendekatan kepemimpinan yang cerdas secara budaya dan sangat efektif.",
            "Begrijpen waar je teamleden staan op dit spectrum voorkomt talloze misverstanden — en ontsluit leiderschapsbenaderingen die zowel cultureel intelligent als diepgaand effectief zijn."
          )}
        </p>
      </div>

      {/* COMPARISON TABLE */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("High vs. Low Power Distance", "Jarak Kekuasaan Tinggi vs. Rendah", "Hoge vs. Lage Machtafstand")}
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: offWhite, borderRadius: 12, overflow: "hidden" }}>
              <thead>
                <tr style={{ background: navy }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Aspect", "Aspek", "Aspect")}</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: orange, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("High PD", "PD Tinggi", "Hoge PD")}</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "oklch(75% 0.12 150)", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Low PD", "PD Rendah", "Lage PD")}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(92% 0.01 80)", background: i % 2 === 0 ? offWhite : lightGray }}>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: navy, fontSize: 14 }}>{lang === "en" ? row.en_aspect : lang === "id" ? row.id_aspect : row.nl_aspect}</td>
                    <td style={{ padding: "14px 20px", color: bodyText, fontSize: 14 }}>{lang === "en" ? row.en_high : lang === "id" ? row.id_high : row.nl_high}</td>
                    <td style={{ padding: "14px 20px", color: bodyText, fontSize: 14 }}>{lang === "en" ? row.en_low : lang === "id" ? row.id_low : row.nl_low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* IMPLICATIONS */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("4 Implications for Leaders", "4 Implikasi bagi Pemimpin", "4 Implicaties voor Leiders")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {implications.map((item) => (
            <div key={item.number} style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{item.number}</div>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? item.en_title : lang === "id" ? item.id_title : item.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? item.en_desc : lang === "id" ? item.id_desc : item.nl_desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STRATEGIES */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("5 Practical Strategies", "5 Strategi Praktis", "5 Praktische Strategieën")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {strategies.map((s) => (
              <div key={s.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{s.number}</div>
                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                  {lang === "en" ? s.en : lang === "id" ? s.id : s.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REFLECTION QUESTIONS */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {reflectionQuestions.map((q) => (
            <div key={q.roman} style={{ background: lightGray, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
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
