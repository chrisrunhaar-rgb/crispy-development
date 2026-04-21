"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const comparisonRows = [
  { en_aspect: "Time structure", id_aspect: "Struktur waktu", nl_aspect: "Tijdstructuur", en_mono: "Linear, sequential", id_mono: "Linear, berurutan", nl_mono: "Lineair, sequentieel", en_poly: "Fluid, simultaneous", id_poly: "Cair, simultan", nl_poly: "Vloeiend, gelijktijdig" },
  { en_aspect: "Meetings", id_aspect: "Rapat", nl_aspect: "Vergaderingen", en_mono: "Start/end on time, agenda-driven", id_mono: "Mulai/selesai tepat waktu, berbasis agenda", nl_mono: "Op tijd beginnen/eindigen, agendagericht", en_poly: "Flexible timing, relationship-driven", id_poly: "Waktu fleksibel, berbasis hubungan", nl_poly: "Flexibele timing, relatiegericht" },
  { en_aspect: "Deadlines", id_aspect: "Tenggat waktu", nl_aspect: "Deadlines", en_mono: "Firm commitments", id_mono: "Komitmen teguh", nl_mono: "Vaste toezeggingen", en_poly: "Approximate targets", id_poly: "Target perkiraan", nl_poly: "Geschatte doelen" },
  { en_aspect: "Interruptions", id_aspect: "Gangguan", nl_aspect: "Onderbrekingen", en_mono: "Disruptive, avoided", id_mono: "Mengganggu, dihindari", nl_mono: "Verstorend, vermeden", en_poly: "Normal, relational", id_poly: "Normal, relasional", nl_poly: "Normaal, relationeel" },
  { en_aspect: "Priority", id_aspect: "Prioritas", nl_aspect: "Prioriteit", en_mono: "Task completion", id_mono: "Penyelesaian tugas", nl_mono: "Taakvoltooiing", en_poly: "Relationship quality", id_poly: "Kualitas hubungan", nl_poly: "Relatiekwaliteit" },
];

const frictionAreas = [
  { number: "1", en_title: "Scheduling", id_title: "Penjadwalan", nl_title: "Planning", en_desc: "Monochronic leaders block time in advance and expect others to honour it. Polychronic team members may agree to a time but reprioritise when relational needs arise. Neither is being irresponsible — they operate from different core assumptions about what 'being committed' means.", id_desc: "Pemimpin monochronic memblokir waktu jauh sebelumnya dan mengharapkan orang lain menghormatinya. Anggota tim polychronic mungkin setuju dengan waktu tetapi memprioritaskan ulang ketika kebutuhan relasional muncul.", nl_desc: "Monochronische leiders blokkeren tijd van tevoren en verwachten dat anderen dit respecteren. Polychronische teamleden kunnen instemmen met een tijd maar opnieuw prioriteren wanneer relationele behoeften ontstaan." },
  { number: "2", en_title: "Meeting culture", id_title: "Budaya rapat", nl_title: "Vergadercultuur", en_desc: "In monochronic cultures, starting late signals disrespect. In polychronic cultures, taking time for relationship before the agenda begins is the sign of respect. The same action — arriving five minutes after the start — carries completely different meanings.", id_desc: "Dalam budaya monochronic, mulai terlambat menandakan ketidakhormatan. Dalam budaya polychronic, meluangkan waktu untuk hubungan sebelum agenda dimulai adalah tanda penghormatan.", nl_desc: "In monochronische culturen signaleert te laat beginnen oneerbiedigheid. In polychronische culturen is tijd nemen voor relatie vóór de agenda respect tonen." },
  { number: "3", en_title: "Accountability and follow-through", id_title: "Akuntabilitas dan tindak lanjut", nl_title: "Verantwoording en opvolging", en_desc: "When timelines slip in polychronic teams, monochronic leaders often interpret it as laziness or lack of commitment. What is actually happening is a different prioritisation logic — relationships, circumstances, and family may outrank the task.", id_desc: "Ketika jadwal meleset dalam tim polychronic, pemimpin monochronic sering mengartikannya sebagai kemalasan atau kurangnya komitmen. Yang sebenarnya terjadi adalah logika prioritas yang berbeda.", nl_desc: "Wanneer tijdlijnen verschuiven in polychronische teams, interpreteren monochronische leiders dit vaak als luiheid of gebrek aan toewijding. Wat er werkelijk speelt is een andere prioriteringslogica." },
  { number: "4", en_title: "Productivity perception", id_title: "Persepsi produktivitas", nl_title: "Productiviteitsperceptie", en_desc: "Monochronic cultures equate busyness with productivity. Polychronic cultures measure output by quality of relationships and results — not schedules filled. A slow conversation that builds trust may be the highest-value activity of the week.", id_desc: "Budaya monochronic menyamakan kesibukan dengan produktivitas. Budaya polychronic mengukur output berdasarkan kualitas hubungan dan hasil — bukan jadwal yang terisi.", nl_desc: "Monochronische culturen stellen drukte gelijk aan productiviteit. Polychronische culturen meten output aan de hand van relatie- en resultaatkwaliteit — niet aan gevulde agenda's." },
];

const strategies = [
  { number: "1", en: "Name your time orientation openly with your team — make the invisible expectation visible.", id: "Ungkapkan orientasi waktu Anda secara terbuka dengan tim Anda — buat harapan tak terlihat menjadi terlihat.", nl: "Benoem je tijdoriëntatie openlijk met je team — maak de onzichtbare verwachting zichtbaar." },
  { number: "2", en: "Build relationship time intentionally into meetings — not as waste, but as investment.", id: "Bangun waktu hubungan dengan sengaja ke dalam rapat — bukan sebagai pemborosan, tetapi sebagai investasi.", nl: "Bouw relationele tijd bewust in vergaderingen — niet als verspilling, maar als investering." },
  { number: "3", en: "Agree on what 'on time' and 'deadline' mean explicitly within your team context.", id: "Sepakati apa arti 'tepat waktu' dan 'tenggat waktu' secara eksplisit dalam konteks tim Anda.", nl: "Spreek expliciet af wat 'op tijd' en 'deadline' betekenen in jouw teamcontext." },
  { number: "4", en: "When timelines slip, ask about reasons before drawing conclusions — context matters enormously.", id: "Ketika jadwal meleset, tanyakan alasannya sebelum menarik kesimpulan — konteks sangat penting.", nl: "Wanneer tijdlijnen verschuiven, vraag naar redenen voordat je conclusies trekt — context is enorm belangrijk." },
  { number: "5", en: "Protect the relationship even when enforcing accountability — the person always comes before the task.", id: "Lindungi hubungan bahkan ketika menegakkan akuntabilitas — orang selalu datang sebelum tugas.", nl: "Bescherm de relatie zelfs bij het handhaven van verantwoording — de persoon komt altijd voor de taak." },
];

const reflectionQuestions = [
  { roman: "I", en: "Where do you naturally sit on the monochronic-polychronic spectrum? How does that shape your frustrations?", id: "Di mana Anda secara alami berada dalam spektrum monochronic-polychronic? Bagaimana itu membentuk frustrasi Anda?", nl: "Waar zit je van nature op het monochronisch-polychronisch spectrum? Hoe vormt dat je frustraties?" },
  { roman: "II", en: "Think of a time a team member was 'always late'. What was likely happening from their perspective?", id: "Pikirkan saat anggota tim 'selalu terlambat'. Apa yang kemungkinan terjadi dari perspektif mereka?", nl: "Denk aan een teamlid dat 'altijd te laat' was. Wat speelde er waarschijnlijk vanuit hun perspectief?" },
  { roman: "III", en: "How does the biblical concept of Kairos (God's appointed time) challenge purely monochronic thinking?", id: "Bagaimana konsep alkitabiah Kairos (waktu yang ditetapkan Tuhan) menantang pemikiran murni monochronic?", nl: "Hoe daagt het bijbelse concept Kairos (Gods bepaalde tijd) puur monochronisch denken uit?" },
  { roman: "IV", en: "Do your team agreements around time reflect your culture, or have you genuinely negotiated them together?", id: "Apakah perjanjian tim Anda seputar waktu mencerminkan budaya Anda, atau apakah Anda benar-benar telah merundingkannya bersama?", nl: "Weerspiegelen je teamafspraken rondom tijd jouw cultuur, of heb je ze echt samen onderhandeld?" },
  { roman: "V", en: "When has someone's flexible relationship with time actually led to a better outcome than your tight schedule?", id: "Kapan hubungan fleksibel seseorang dengan waktu benar-benar menghasilkan hasil yang lebih baik daripada jadwal ketat Anda?", nl: "Wanneer heeft iemands flexibele omgang met tijd daadwerkelijk tot een beter resultaat geleid dan jouw strakke schema?" },
  { roman: "VI", en: "What rhythms of rest or margin do you model that give your team permission to be human?", id: "Ritme istirahat atau jeda apa yang Anda tunjukkan yang memberi tim Anda izin untuk menjadi manusia?", nl: "Welke ritmes van rust of marge modelleer jij die je team toestemming geven om menselijk te zijn?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function TimeAndCultureClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("time-and-culture");
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
          {t("Cultural Dimensions", "Dimensi Budaya", "Culturele Dimensies")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Time & Culture", "Waktu & Budaya", "Tijd & Cultuur")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Time is not a resource to be managed — it is a cultural lens that shapes everything." ',
            '"Waktu bukan sumber daya yang harus dikelola — itu adalah lensa budaya yang membentuk segalanya."',
            '"Tijd is geen te beheren hulpbron — het is een culturele lens die alles vormt."'
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
            "One of the most frequent sources of cross-cultural friction is not language or food — it is time. How a culture relates to time — whether it is a linear resource to be managed or a relational rhythm to be experienced — shapes everything from how meetings run to how trust is built.",
            "Salah satu sumber gesekan lintas budaya yang paling sering bukan bahasa atau makanan — itu adalah waktu. Bagaimana suatu budaya berhubungan dengan waktu — apakah itu sumber daya linear yang harus dikelola atau ritme relasional yang harus dialami — membentuk segalanya.",
            "Een van de meest frequente bronnen van interculturele wrijving is niet taal of eten — het is tijd. Hoe een cultuur zich verhoudt tot tijd — of het een lineaire hulpbron is om te beheren of een relationeel ritme om te ervaren — vormt alles."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Anthropologist Edward Hall identified two primary orientations: monochronic (time is sequential, tasks are done one at a time) and polychronic (time is fluid, multiple things happen simultaneously). Neither is superior — but misunderstanding the difference creates unnecessary conflict.",
            "Antropolog Edward Hall mengidentifikasi dua orientasi utama: monochronic (waktu berurutan, tugas dilakukan satu per satu) dan polychronic (waktu cair, beberapa hal terjadi secara bersamaan). Tidak ada yang lebih unggul — tetapi salah memahami perbedaan ini menciptakan konflik yang tidak perlu.",
            "Antropoloog Edward Hall identificeerde twee primaire oriëntaties: monochronisch (tijd is sequentieel, taken worden één voor één gedaan) en polychronisch (tijd is vloeiend, meerdere dingen vinden tegelijkertijd plaats). Geen van beide is superieur — maar het niet begrijpen van het verschil creëert onnodige conflicten."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Monochronic vs. Polychronic", "Monochronic vs. Polychronic", "Monochronisch vs. Polychronisch")}
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: offWhite, borderRadius: 12, overflow: "hidden" }}>
              <thead>
                <tr style={{ background: navy }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Aspect", "Aspek", "Aspect")}</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: orange, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Monochronic", "Monochronic", "Monochronisch")}</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "oklch(75% 0.12 150)", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700 }}>{t("Polychronic", "Polychronic", "Polychronisch")}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(92% 0.01 80)", background: i % 2 === 0 ? offWhite : lightGray }}>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: navy, fontSize: 14 }}>{lang === "en" ? row.en_aspect : lang === "id" ? row.id_aspect : row.nl_aspect}</td>
                    <td style={{ padding: "14px 20px", color: bodyText, fontSize: 14 }}>{lang === "en" ? row.en_mono : lang === "id" ? row.id_mono : row.nl_mono}</td>
                    <td style={{ padding: "14px 20px", color: bodyText, fontSize: 14 }}>{lang === "en" ? row.en_poly : lang === "id" ? row.id_poly : row.nl_poly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("4 Areas Where It Causes Friction", "4 Area yang Menyebabkan Gesekan", "4 Gebieden Waar Het Wrijving Veroorzaakt")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {frictionAreas.map((item) => (
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

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("5 Bridging Strategies", "5 Strategi Menjembatani", "5 Verbindingsstrategieën")}
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
