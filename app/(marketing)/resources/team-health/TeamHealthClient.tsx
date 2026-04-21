"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const healthMarkers = [
  { number: "1", en_title: "Psychological safety", id_title: "Keamanan psikologis", nl_title: "Psychologische veiligheid", en_desc: "Team members can speak up, disagree, and admit mistakes without fear of punishment or humiliation. Google's Project Aristotle identified this as the single most important factor in team effectiveness.", id_desc: "Anggota tim dapat berbicara, tidak setuju, dan mengakui kesalahan tanpa takut dihukum atau dipermalukan. Project Aristotle Google mengidentifikasi ini sebagai faktor terpenting dalam efektivitas tim.", nl_desc: "Teamleden kunnen spreken, het oneens zijn en fouten toegeven zonder angst voor bestraffing of vernedering. Google's Project Aristotle identificeerde dit als de enkelfactor meest belangrijk in teameffectiviteit." },
  { number: "2", en_title: "Clarity of purpose and roles", id_title: "Kejelasan tujuan dan peran", nl_title: "Duidelijkheid van doel en rollen", en_desc: "Everyone knows what the team is trying to achieve and what their specific contribution is. Ambiguity about purpose or role is one of the leading causes of disengagement and quiet resignation.", id_desc: "Semua orang tahu apa yang ingin dicapai tim dan apa kontribusi spesifik mereka. Ambiguitas tentang tujuan atau peran adalah salah satu penyebab utama ketidakterlibatan dan pengunduran diri diam-diam.", nl_desc: "Iedereen weet wat het team probeert te bereiken en wat hun specifieke bijdrage is. Ambiguïteit over doel of rol is een van de voornaamste oorzaken van desengagement." },
  { number: "3", en_title: "Healthy conflict", id_title: "Konflik sehat", nl_title: "Gezond conflict", en_desc: "The team can disagree on ideas without it becoming personal or political. Healthy teams fight for the best outcome — not for their own position. Absence of conflict is not health; it is often suppression.", id_desc: "Tim dapat tidak setuju pada ide tanpa menjadi pribadi atau politis. Tim yang sehat berjuang untuk hasil terbaik — bukan untuk posisi mereka sendiri. Ketiadaan konflik bukan kesehatan; itu seringkali penekanan.", nl_desc: "Het team kan het oneens zijn over ideeën zonder dat het persoonlijk of politiek wordt. Gezonde teams strijden voor het beste resultaat — niet voor hun eigen positie. Afwezigheid van conflict is geen gezondheid; het is vaak onderdrukking." },
  { number: "4", en_title: "Accountability without fear", id_title: "Akuntabilitas tanpa rasa takut", nl_title: "Verantwoording zonder angst", en_desc: "People are held to clear expectations, and when those expectations are not met, it is addressed — honestly, quickly, and constructively. A team where no one is ever held accountable eventually resents those who are.", id_desc: "Orang dipegang pada harapan yang jelas, dan ketika harapan itu tidak terpenuhi, itu ditangani — dengan jujur, cepat, dan konstruktif.", nl_desc: "Mensen worden gehouden aan duidelijke verwachtingen, en wanneer die verwachtingen niet worden gehaald, wordt dit besproken — eerlijk, snel en constructief." },
  { number: "5", en_title: "Shared celebration", id_title: "Perayaan bersama", nl_title: "Gedeeld vieren", en_desc: "The team celebrates together. Not just the leader, and not just the high performers. Shared celebration creates shared identity — and shared identity sustains teams through the difficult seasons.", id_desc: "Tim merayakan bersama. Bukan hanya pemimpin, dan bukan hanya para pemain tinggi. Perayaan bersama menciptakan identitas bersama — dan identitas bersama menopang tim melalui musim-musim yang sulit.", nl_desc: "Het team viert samen. Niet alleen de leider, en niet alleen de hoge presteerders. Gedeeld vieren creëert gedeelde identiteit — en gedeelde identiteit houdt teams staande door moeilijke seizoenen." },
];

const warningSigns = [
  { en: "Conversations are cautious — people say what they think the leader wants to hear, not what they actually think.", id: "Percakapan berhati-hati — orang mengatakan apa yang mereka pikir ingin didengar pemimpin, bukan apa yang sebenarnya mereka pikirkan.", nl: "Gesprekken zijn voorzichtig — mensen zeggen wat ze denken dat de leider wil horen, niet wat ze werkelijk denken." },
  { en: "Best people are quietly looking for the exit — often silent before they announce they are leaving.", id: "Orang-orang terbaik diam-diam mencari jalan keluar — sering diam sebelum mereka mengumumkan kepergian mereka.", nl: "De beste mensen zoeken stilletjes naar de uitgang — vaak stil voordat ze aankondigen te vertrekken." },
  { en: "No one ever pushes back in meetings — all ideas are agreed to but not all acted upon.", id: "Tidak ada yang pernah mendorong balik dalam rapat — semua ide disetujui tetapi tidak semua dilaksanakan.", nl: "Niemand duwt ooit terug in vergaderingen — alle ideeën worden ingestemd maar niet allemaal uitgevoerd." },
  { en: "Small tensions never get fully resolved — they accumulate into factions or disengagement.", id: "Ketegangan kecil tidak pernah benar-benar terselesaikan — mereka menumpuk menjadi faksi atau ketidakterlibatan.", nl: "Kleine spanningen worden nooit volledig opgelost — ze stapelen zich op tot facties of desengagement." },
  { en: "The leader is the only one who seems energised — the team is executing, not co-creating.", id: "Pemimpinlah satu-satunya yang tampak bersemangat — tim sedang menjalankan, bukan mencipta bersama.", nl: "De leider is de enige die energiek lijkt — het team voert uit, creëert niet mee." },
];

const selfAssessment = [
  { q_en: "When someone on the team makes a mistake, the most common response is…", q_id: "Ketika seseorang dalam tim membuat kesalahan, respons yang paling umum adalah…", q_nl: "Wanneer iemand in het team een fout maakt, is de meest voorkomende reactie…", low_en: "Blame or silence", low_id: "Menyalahkan atau diam", low_nl: "Beschuldigen of stilte", high_en: "Learning and support", high_id: "Pembelajaran dan dukungan", high_nl: "Leren en ondersteuning" },
  { q_en: "Disagreement in team meetings is…", q_id: "Ketidaksetujuan dalam rapat tim adalah…", q_nl: "Onenigheid in teamvergaderingen is…", low_en: "Rare or always tense", low_id: "Jarang atau selalu tegang", low_nl: "Zeldzaam of altijd gespannen", high_en: "Normal and productive", high_id: "Normal dan produktif", high_nl: "Normaal en productief" },
  { q_en: "People know clearly what they are responsible for and how it connects to the team's purpose.", q_id: "Orang-orang tahu dengan jelas apa yang mereka tanggung jawabi dan bagaimana itu terhubung dengan tujuan tim.", q_nl: "Mensen weten duidelijk waarvoor ze verantwoordelijk zijn en hoe dat aansluit bij het doel van het team.", low_en: "Rarely true", low_id: "Jarang benar", low_nl: "Zelden waar", high_en: "Consistently true", high_id: "Konsisten benar", high_nl: "Consistent waar" },
  { q_en: "When the team succeeds, the credit is…", q_id: "Ketika tim berhasil, kreditnya…", q_nl: "Wanneer het team slaagt, gaat de eer naar…", low_en: "Taken by the leader", low_id: "Diambil oleh pemimpin", low_nl: "De leider", high_en: "Shared across the team", high_id: "Dibagikan di seluruh tim", high_nl: "Het hele team" },
  { q_en: "When I think about this team in 5 years…", q_id: "Ketika saya memikirkan tim ini dalam 5 tahun…", q_nl: "Als ik aan dit team denk over 5 jaar…", low_en: "I feel uncertainty or dread", low_id: "Saya merasa tidak pasti atau khawatir", low_nl: "Voel ik onzekerheid of vrees", high_en: "I feel genuine hope", high_id: "Saya merasakan harapan yang tulus", high_nl: "Voel ik echte hoop" },
];

const reflectionQuestions = [
  { roman: "I", en: "On the 5 health markers, where does your team score highest? Where does it most need attention?", id: "Pada 5 penanda kesehatan, di mana tim Anda mendapat skor tertinggi? Di mana itu paling membutuhkan perhatian?", nl: "Op de 5 gezondheidsmarkers, waar scoort je team het hoogst? Waar heeft het het meest aandacht nodig?" },
  { roman: "II", en: "Which warning sign resonates most? What is that telling you about the current state of your team?", id: "Tanda peringatan mana yang paling beresonansi? Apa yang itu katakan kepada Anda tentang keadaan tim Anda saat ini?", nl: "Welk waarschuwingssignaal resoneert het meest? Wat vertelt dat je over de huidige staat van je team?" },
  { roman: "III", en: "Does your team have genuine psychological safety? What evidence do you have either way?", id: "Apakah tim Anda memiliki keamanan psikologis yang tulus? Bukti apa yang Anda miliki untuk keduanya?", nl: "Heeft je team echte psychologische veiligheid? Welk bewijs heb je hoe dan ook?" },
  { roman: "IV", en: "What would your team say if asked anonymously: 'Does our leader model the health they call us to?'", id: "Apa yang akan dikatakan tim Anda jika ditanya secara anonim: 'Apakah pemimpin kami mencontohkan kesehatan yang mereka serukan kepada kami?'", nl: "Wat zou je team zeggen als anoniem gevraagd: 'Modelleert onze leider de gezondheid waartoe ze ons oproepen?'" },
  { roman: "V", en: "What one practical change could dramatically improve team health in the next 90 days?", id: "Perubahan praktis apa yang bisa secara dramatis meningkatkan kesehatan tim dalam 90 hari ke depan?", nl: "Welke ene praktische verandering zou de gezondheid van het team de komende 90 dagen dramatisch kunnen verbeteren?" },
  { roman: "VI", en: "How does the biblical picture of the body of Christ (1 Corinthians 12) challenge or confirm your current team culture?", id: "Bagaimana gambaran alkitabiah tentang tubuh Kristus (1 Korintus 12) menantang atau mengkonfirmasi budaya tim Anda saat ini?", nl: "Hoe daagt het bijbelse beeld van het lichaam van Christus (1 Korintiërs 12) jouw huidige teamcultuur uit of bevestigt het die?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function TeamHealthClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("team-health");
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
          {t("Team Leadership", "Kepemimpinan Tim", "Teamleiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Team Health", "Kesehatan Tim", "Teamgezondheid")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"A healthy team is not one with no problems — it is one with the capacity to face its problems together."',
            '"Tim yang sehat bukan yang tidak punya masalah — melainkan yang memiliki kapasitas untuk menghadapi masalahnya bersama-sama."',
            '"Een gezond team is niet een team zonder problemen — het is een team dat de capaciteit heeft zijn problemen samen te faced."'
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
            "Team health is not an accident. It is the result of intentional leadership — creating conditions where people can do their best work, grow as human beings, and contribute to something larger than themselves. In cross-cultural teams, this requires even greater intention because the markers of health are not always obvious across cultural contexts.",
            "Kesehatan tim bukan kebetulan. Ini adalah hasil kepemimpinan yang disengaja — menciptakan kondisi di mana orang dapat melakukan pekerjaan terbaik mereka, tumbuh sebagai manusia, dan berkontribusi pada sesuatu yang lebih besar dari diri mereka sendiri.",
            "Teamgezondheid is geen toeval. Het is het resultaat van intentioneel leiderschap — omstandigheden creëren waar mensen hun beste werk kunnen doen, als mensen kunnen groeien en kunnen bijdragen aan iets groters dan zichzelf."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("5 Markers of a Healthy Team", "5 Penanda Tim yang Sehat", "5 Markers van een Gezond Team")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {healthMarkers.map((m) => (
              <div key={m.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{m.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? m.en_title : lang === "id" ? m.id_title : m.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? m.en_desc : lang === "id" ? m.id_desc : m.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 24, textAlign: "center" }}>
          {t("5 Warning Signs of Dysfunction", "5 Tanda Peringatan Disfungsi", "5 Waarschuwingssignalen van Disfunctie")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {warningSigns.map((w, i) => (
            <div key={i} style={{ background: lightGray, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ color: orange, fontSize: 18, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>⚠</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                {lang === "en" ? w.en : lang === "id" ? w.id : w.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("Team Health Self-Assessment", "Penilaian Mandiri Kesehatan Tim", "Teamgezondheid Zelfbeoordeling")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, marginBottom: 40, fontSize: 15 }}>
            {t("For each question, consider whether your team is closer to the low or high end.", "Untuk setiap pertanyaan, pertimbangkan apakah tim Anda lebih dekat ke ujung rendah atau tinggi.", "Overweeg voor elke vraag of je team dichter bij het lage of hoge uiteinde zit.")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {selfAssessment.map((item, i) => (
              <div key={i} style={{ background: offWhite, borderRadius: 12, padding: "24px 28px" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, color: navy, fontSize: 15, marginBottom: 14 }}>
                  {lang === "en" ? item.q_en : lang === "id" ? item.q_id : item.q_nl}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "oklch(50% 0.08 30)", fontWeight: 600 }}>
                    {lang === "en" ? item.low_en : lang === "id" ? item.low_id : item.low_nl}
                  </span>
                  <div style={{ flex: 1, height: 4, background: "oklch(88% 0.02 80)", borderRadius: 2, position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: -3, width: 10, height: 10, background: orange, borderRadius: "50%", transform: "translateX(-50%)" }} />
                  </div>
                  <span style={{ fontSize: 13, color: "oklch(45% 0.12 150)", fontWeight: 600 }}>
                    {lang === "en" ? item.high_en : lang === "id" ? item.high_id : item.high_nl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
