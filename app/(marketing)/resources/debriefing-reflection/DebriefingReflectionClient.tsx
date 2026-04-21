"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const oridStages = [
  { number: "1", en_title: "Objective — What happened?", id_title: "Objektif — Apa yang terjadi?", nl_title: "Objectief — Wat is er gebeurd?", en_desc: "Gather factual data without interpretation. What did you observe? What happened concretely? Who was there? What was said? This stage grounds the reflection in shared reality rather than individual interpretation.", id_desc: "Kumpulkan data faktual tanpa interpretasi. Apa yang Anda amati? Apa yang terjadi secara konkret? Siapa yang ada di sana? Apa yang dikatakan? Tahap ini mendasarkan refleksi pada realitas bersama daripada interpretasi individual.", nl_desc: "Verzamel feitelijke gegevens zonder interpretatie. Wat heb je waargenomen? Wat is er concreet gebeurd? Wie was er? Wat werd er gezegd? Dit stadium verankert de reflectie in gedeelde werkelijkheid." },
  { number: "2", en_title: "Reflective — How did it feel?", id_title: "Reflektif — Bagaimana rasanya?", nl_title: "Reflectief — Hoe voelde het?", en_desc: "Surface emotional responses and initial reactions. What stood out? What surprised, delighted, or troubled you? This stage acknowledges that experiences are not just intellectual events — they land emotionally, and those emotions carry important data.", id_desc: "Ungkap respons emosional dan reaksi awal. Apa yang menonjol? Apa yang mengejutkan, menyenangkan, atau mengganggu Anda? Tahap ini mengakui bahwa pengalaman bukan hanya peristiwa intelektual.", nl_desc: "Breng emotionele reacties en eerste indrukken naar boven. Wat viel op? Wat verraste, verheugde of verontrustte je? Dit stadium erkent dat ervaringen niet alleen intellectuele gebeurtenissen zijn." },
  { number: "3", en_title: "Interpretive — What does it mean?", id_title: "Interpretatif — Apa artinya?", nl_title: "Interpretatief — Wat betekent het?", en_desc: "Draw meaning and learning from what happened. What patterns do you notice? What does this tell you about yourself, your team, or the culture you are in? This is where insight is generated — not in the event itself, but in the meaning made from it.", id_desc: "Tarik makna dan pembelajaran dari apa yang terjadi. Pola apa yang Anda perhatikan? Apa yang ini katakan tentang Anda, tim Anda, atau budaya yang Anda hadapi? Di sinilah wawasan dihasilkan.", nl_desc: "Maak betekenis en trek lessen uit wat er is gebeurd. Welke patronen merk je op? Wat vertelt dit je over jezelf, je team of de cultuur? Hier wordt inzicht gegenereerd." },
  { number: "4", en_title: "Decisional — What next?", id_title: "Keputusan — Apa selanjutnya?", nl_title: "Beslissingsgericht — Wat nu?", en_desc: "Identify specific, actionable next steps. What will you do differently? What commitment are you making? What needs to change? The ORID framework only becomes transformative when it moves from insight to action.", id_desc: "Identifikasi langkah-langkah konkret dan dapat ditindaklanjuti berikutnya. Apa yang akan Anda lakukan secara berbeda? Komitmen apa yang Anda buat? Apa yang perlu berubah?", nl_desc: "Identificeer specifieke, uitvoerbare volgende stappen. Wat ga je anders doen? Welke toezegging doe je? Wat moet er veranderen? Het ORID-framework wordt pas transformatief als het van inzicht naar actie gaat." },
];

const reflectionTypes = [
  { number: "1", en_title: "Solo Reflection", id_title: "Refleksi Mandiri", nl_title: "Persoonlijke Reflectie", en_desc: "Journaling, prayer, and contemplation done individually. This is the foundation of all other reflection — a leader who cannot reflect alone will struggle to lead reflective conversations.", id_desc: "Jurnal, doa, dan kontemplasi yang dilakukan secara individual. Ini adalah fondasi dari semua refleksi lainnya.", nl_desc: "Journaling, gebed en contemplatie gedaan individueel. Dit is de basis van alle andere reflectie." },
  { number: "2", en_title: "Team Debrief", id_title: "Evaluasi Tim", nl_title: "Teamdebrief", en_desc: "Structured group reflection on a shared experience. Used after events, outreach, projects, or significant decisions. Most effective when the leader asks rather than tells.", id_desc: "Refleksi kelompok terstruktur tentang pengalaman bersama. Digunakan setelah acara, penjangkauan, proyek, atau keputusan signifikan.", nl_desc: "Gestructureerde groepsreflectie op een gedeelde ervaring. Gebruikt na evenementen, projecten of significante beslissingen." },
  { number: "3", en_title: "Periodic Review", id_title: "Tinjauan Berkala", nl_title: "Periodieke Review", en_desc: "Scheduled reflection at regular intervals — weekly, monthly, quarterly, annually. The discipline here is not reactivity but rhythm: creating space before there is a crisis that forces it.", id_desc: "Refleksi terjadwal pada interval teratur — mingguan, bulanan, triwulanan, tahunan. Disiplin di sini bukan reaktivitas tetapi ritme.", nl_desc: "Geplande reflectie op regelmatige intervallen — wekelijks, maandelijks, kwartaal, jaarlijks. De discipline hier is niet reactiviteit maar ritme." },
  { number: "4", en_title: "After-Action Review", id_title: "Tinjauan Pasca-Aksi", nl_title: "After-Action Review", en_desc: "Structured debrief immediately after a significant event or decision. Four questions: What was supposed to happen? What actually happened? Why the difference? What do we do next time?", id_desc: "Evaluasi terstruktur segera setelah peristiwa atau keputusan penting. Empat pertanyaan: Apa yang seharusnya terjadi? Apa yang sebenarnya terjadi? Mengapa perbedaannya? Apa yang kita lakukan next time?", nl_desc: "Gestructureerde debrief direct na een significant evenement of beslissing. Vier vragen: Wat had er moeten gebeuren? Wat is er werkelijk gebeurd? Waarom het verschil? Wat doen we de volgende keer?" },
  { number: "5", en_title: "Exit Debrief", id_title: "Evaluasi Keluar", nl_title: "Exitdebrief", en_desc: "A structured reflection when someone leaves a role, team, or season. Captures learning before it walks out the door — and honours the person's contribution by taking their experience seriously.", id_desc: "Refleksi terstruktur ketika seseorang meninggalkan peran, tim, atau musim. Menangkap pembelajaran sebelum pergi — dan menghormati kontribusi orang tersebut.", nl_desc: "Een gestructureerde reflectie wanneer iemand een rol, team of seizoen verlaat. Vangt lering op voordat het de deur uit loopt — en eert de bijdrage van de persoon." },
];

const reflectionQuestions = [
  { roman: "I", en: "When did you last have a deep, structured debrief — solo or with a team? What came out of it?", id: "Kapan terakhir kali Anda melakukan evaluasi mendalam yang terstruktur — sendiri atau dengan tim? Apa hasilnya?", nl: "Wanneer had je voor het laatste een diepe, gestructureerde debrief — solo of met een team? Wat kwam eruit?" },
  { roman: "II", en: "What experiences in the past year are still 'unprocessed'? What might be in them that you haven't yet learned?", id: "Pengalaman apa dalam setahun terakhir yang masih 'belum diproses'? Apa yang mungkin ada di dalamnya yang belum Anda pelajari?", nl: "Welke ervaringen van het afgelopen jaar zijn nog 'onverwerkt'? Wat zit er mogelijk in dat je nog niet hebt geleerd?" },
  { roman: "III", en: "Does your team have a regular reflection culture? What would you need to change to create one?", id: "Apakah tim Anda memiliki budaya refleksi yang teratur? Apa yang perlu Anda ubah untuk menciptakannya?", nl: "Heeft je team een reguliere reflectiecultuur? Wat zou je moeten veranderen om er een te creëren?" },
  { roman: "IV", en: "Which stage of the ORID model is hardest for you — and what does that reveal about your processing style?", id: "Tahap mana dari model ORID yang paling sulit bagi Anda — dan apa yang itu ungkapkan tentang gaya pemrosesan Anda?", nl: "Welk stadium van het ORID-model is het moeilijkst voor jou — en wat onthult dat over je verwerkingsstijl?" },
  { roman: "V", en: "How does your cultural context affect how people in your team process and debrief experience?", id: "Bagaimana konteks budaya Anda memengaruhi cara orang dalam tim Anda memproses dan mengevaluasi pengalaman?", nl: "Hoe beïnvloedt jouw culturele context hoe mensen in je team ervaringen verwerken en evalueren?" },
  { roman: "VI", en: "What would be different in your leadership if you reflected deeply after every significant decision?", id: "Apa yang akan berbeda dalam kepemimpinan Anda jika Anda merefleksikan secara mendalam setelah setiap keputusan penting?", nl: "Wat zou er anders zijn in je leiderschap als je na elke significante beslissing diep zou reflecteren?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function DebriefingReflectionClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("debriefing-reflection");
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
          {t("Learning & Growth", "Pembelajaran & Pertumbuhan", "Leren & Groei")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Debriefing & Reflection", "Evaluasi & Refleksi", "Debriefen & Reflectie")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"We do not learn from experience. We learn from reflecting on experience." — John Dewey',
            '"Kita tidak belajar dari pengalaman. Kita belajar dari merefleksikan pengalaman." — John Dewey',
            '"We leren niet van ervaring. We leren van reflecteren op ervaring." — John Dewey'
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
            "Most leaders are addicted to activity. The pace of cross-cultural ministry means there is always another meeting, another problem, another relationship that needs attention. In this environment, reflection gets pushed to 'when things slow down' — which is never.",
            "Kebanyakan pemimpin kecanduan aktivitas. Laju pelayanan lintas budaya berarti selalu ada rapat lain, masalah lain, hubungan lain yang membutuhkan perhatian. Dalam lingkungan ini, refleksi didorong ke 'ketika segalanya melambat' — yang tidak pernah terjadi.",
            "De meeste leiders zijn verslaafd aan activiteit. Het tempo van interculturele bediening betekent dat er altijd een andere vergadering, een ander probleem, een andere relatie is die aandacht nodig heeft. Reflectie wordt dan uitgesteld tot 'wanneer het rustiger wordt' — wat nooit komt."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "The ORID framework — developed by the Institute of Cultural Affairs — provides a simple, structured pathway through any reflection. It moves from the factual to the emotional to the interpretive to the decisive. It works for individuals, pairs, and teams.",
            "Kerangka ORID — dikembangkan oleh Institute of Cultural Affairs — menyediakan jalur sederhana dan terstruktur melalui refleksi apa pun. Ini bergerak dari faktual ke emosional ke interpretatif ke decisional. Ini bekerja untuk individu, pasangan, dan tim.",
            "Het ORID-framework — ontwikkeld door het Institute of Cultural Affairs — biedt een eenvoudige, gestructureerde weg door elke reflectie. Het beweegt van het feitelijke naar het emotionele naar het interpretatieve naar het beslissingsgerichte."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("The ORID Framework", "Kerangka ORID", "Het ORID-framework")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {oridStages.map((s) => (
              <div key={s.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{s.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? s.en_title : lang === "id" ? s.id_title : s.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? s.en_desc : lang === "id" ? s.id_desc : s.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("5 Types of Reflection", "5 Jenis Refleksi", "5 Soorten Reflectie")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {reflectionTypes.map((r) => (
            <div key={r.number} style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{r.number}</div>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? r.en_title : lang === "id" ? r.id_title : r.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? r.en_desc : lang === "id" ? r.id_desc : r.nl_desc}
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
