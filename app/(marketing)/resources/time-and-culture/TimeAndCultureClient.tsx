"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const COMPARISON = [
  {
    aspect: { en: "Time structure", id: "Struktur waktu", nl: "Tijdstructuur" },
    mono:   { en: "Linear, sequential — one thing at a time", id: "Linear, berurutan — satu hal pada satu waktu", nl: "Lineair, sequentieel — één ding tegelijk" },
    poly:   { en: "Fluid, simultaneous — many things at once", id: "Cair, simultan — banyak hal sekaligus", nl: "Vloeiend, gelijktijdig — meerdere dingen tegelijk" },
  },
  {
    aspect: { en: "Meetings", id: "Rapat", nl: "Vergaderingen" },
    mono:   { en: "Fixed start/end, agenda-driven, task-focused", id: "Mulai/selesai tetap, berbasis agenda, fokus tugas", nl: "Vaste start/einde, agendagericht, taakgericht" },
    poly:   { en: "Flexible timing, relationship-driven, holistic", id: "Waktu fleksibel, berbasis hubungan, holistik", nl: "Flexibele timing, relatiegericht, holistisch" },
  },
  {
    aspect: { en: "Deadlines", id: "Tenggat waktu", nl: "Deadlines" },
    mono:   { en: "Firm commitments — missing one signals failure", id: "Komitmen teguh — melanggarnya menandakan kegagalan", nl: "Vaste toezeggingen — missen ervan signaleert falen" },
    poly:   { en: "Approximate targets — context can shift them", id: "Target perkiraan — konteks bisa mengubahnya", nl: "Geschatte doelen — context kan ze verschuiven" },
  },
  {
    aspect: { en: "Interruptions", id: "Gangguan", nl: "Onderbrekingen" },
    mono:   { en: "Disruptive and disrespectful — to be avoided", id: "Mengganggu dan tidak sopan — harus dihindari", nl: "Verstorend en onrespectvol — te vermijden" },
    poly:   { en: "Normal and relational — people take priority", id: "Normal dan relasional — orang lebih diprioritaskan", nl: "Normaal en relationeel — mensen krijgen prioriteit" },
  },
  {
    aspect: { en: "Core priority", id: "Prioritas utama", nl: "Kernprioriteit" },
    mono:   { en: "Task completion — results before relationships", id: "Penyelesaian tugas — hasil sebelum hubungan", nl: "Taakvoltooiing — resultaten boven relaties" },
    poly:   { en: "Relationship quality — trust enables results", id: "Kualitas hubungan — kepercayaan menghasilkan hasil", nl: "Relatiekwaliteit — vertrouwen maakt resultaten mogelijk" },
  },
];

const SCENARIOS = [
  {
    title: { en: "The 9:00 AM Meeting", id: "Rapat Pukul 09:00", nl: "De 9:00 vergadering" },
    setup: {
      en: "A Dutch leader schedules a planning meeting for exactly 9:00 AM. At 9:05, three Indonesian team members are still in the hallway — one finishing a conversation, one helping a colleague with a quick question, one making tea.",
      id: "Seorang pemimpin Belanda menjadwalkan rapat perencanaan tepat pukul 09:00. Pukul 09:05, tiga anggota tim Indonesia masih di lorong — satu menyelesaikan percakapan, satu membantu rekan dengan pertanyaan singkat, satu membuat teh.",
      nl: "Een Nederlandse leider plant een planningsvergadering voor precies 9:00 uur. Om 9:05 staan drie Indonesische teamleden nog in de gang — één rondt een gesprek af, één helpt een collega met een snelle vraag, één zet thee.",
    },
    dutch: {
      en: "\"They don't respect my time. They're disorganised and unprofessional.\"",
      id: "\"Mereka tidak menghormati waktuku. Mereka tidak terorganisir dan tidak profesional.\"",
      nl: "\"Ze respecteren mijn tijd niet. Ze zijn ongeorganiseerd en onprofessioneel.\"",
    },
    sea: {
      en: "\"He's rigid and cold. Why would I ignore my colleague mid-conversation just because of a clock?\"",
      id: "\"Dia kaku dan dingin. Mengapa saya harus mengabaikan rekan di tengah percakapan hanya karena jam?\"",
      nl: "\"Hij is star en kil. Waarom zou ik mijn collega midden in een gesprek negeren vanwege een klok?\"",
    },
    insight: {
      en: "In polychronic cultures, finishing a relational duty is not lateness — it is the higher priority. The clock has not been forgotten; it has been outranked.",
      id: "Dalam budaya polychronic, menyelesaikan kewajiban relasional bukan keterlambatan — itu prioritas yang lebih tinggi. Jam tidak dilupakan; ia hanya kalah prioritas.",
      nl: "In polychronische culturen is het afmaken van een relationele plicht geen te-laat-komen — het is de hogere prioriteit. De klok is niet vergeten; hij is overtroffen in prioriteit.",
    },
  },
  {
    title: { en: "The Sliding Deadline", id: "Tenggat Waktu yang Bergeser", nl: "De verschuivende deadline" },
    setup: {
      en: "A report was due Friday. The Malaysian team member delivers it Monday morning with a brief apology — his pastor's father passed away over the weekend and he spent three days supporting the family.",
      id: "Laporan seharusnya selesai Jumat. Anggota tim Malaysia menyerahkannya Senin pagi dengan permintaan maaf singkat — ayah pendetanya meninggal akhir pekan dan ia menghabiskan tiga hari mendampingi keluarga.",
      nl: "Een rapport was vrijdag verwacht. Het Maleisische teamlid levert het maandag af met een korte verontschuldiging — zijn pastoors vader overleed in het weekend en hij bracht drie dagen door met de familie.",
    },
    dutch: {
      en: "\"He missed the deadline again. If I can't rely on him for this, how can I trust him with bigger things?\"",
      id: "\"Dia melewatkan tenggat waktu lagi. Jika saya tidak bisa mengandalkannya untuk ini, bagaimana saya bisa mempercayainya untuk hal yang lebih besar?\"",
      nl: "\"Hij heeft de deadline weer gemist. Als ik niet op hem kan rekenen hiervoor, hoe kan ik hem dan vertrouwen met grotere dingen?\"",
    },
    sea: {
      en: "\"He doesn't understand that human obligations come first. Being present for a grieving family is not optional in my culture.\"",
      id: "\"Dia tidak mengerti bahwa kewajiban manusiawi harus didahulukan. Hadir untuk keluarga yang berduka bukan pilihan dalam budayaku.\"",
      nl: "\"Hij begrijpt niet dat menselijke verplichtingen eerst komen. Aanwezig zijn voor een rouwende familie is niet optioneel in mijn cultuur.\"",
    },
    insight: {
      en: "Polychronic reliability is not about keeping to schedules — it is about being present for people when they need you. That reliability is just as real; it runs in a different direction.",
      id: "Keandalan polychronic bukan tentang mematuhi jadwal — melainkan hadir untuk orang ketika mereka membutuhkan Anda. Keandalan itu sama nyatanya; hanya berjalan ke arah yang berbeda.",
      nl: "Polychronische betrouwbaarheid gaat niet over het naleven van schema's — maar over aanwezig zijn voor mensen wanneer ze je nodig hebben. Die betrouwbaarheid is net zo echt; ze loopt in een andere richting.",
    },
  },
  {
    title: { en: "The Decision That Won't Land", id: "Keputusan yang Tak Kunjung Selesai", nl: "Het besluit dat maar niet valt" },
    setup: {
      en: "A Dutch leader is running a team meeting and pushes for a final decision by the hour's end. The Filipino team keeps looping back, raising implications for other departments, asking how this will affect relationships with the partner organisation.",
      id: "Seorang pemimpin Belanda memimpin rapat tim dan mendorong keputusan akhir sebelum jam selesai. Tim Filipina terus kembali ke awal, mengangkat implikasi untuk departemen lain, menanyakan bagaimana ini akan mempengaruhi hubungan dengan organisasi mitra.",
      nl: "Een Nederlandse leider leidt een teamvergadering en dringt aan op een definitief besluit voor het einde van het uur. Het Filippijnse team blijft teruggaan, wijst op implicaties voor andere afdelingen en vraagt hoe dit de relaties met de partnerorganisatie beïnvloedt.",
    },
    dutch: {
      en: "\"We're going in circles. We'll never make progress at this pace. Why can't they just decide?\"",
      id: "\"Kita berputar-putar. Kita tidak akan pernah maju dengan kecepatan ini. Mengapa mereka tidak bisa memutuskan?\"",
      nl: "\"We draaien in cirkels. Op dit tempo komen we nooit vooruit. Waarom kunnen ze niet gewoon beslissen?\"",
    },
    sea: {
      en: "\"He's being reckless. A decision this big affects 20 people and three partners. Rushing it will cost us more than taking another week.\"",
      id: "\"Dia tidak hati-hati. Keputusan sebesar ini mempengaruhi 20 orang dan tiga mitra. Terburu-buru akan lebih merugikan kami daripada menunggu seminggu lagi.\"",
      nl: "\"Hij is onbezonnen. Een besluit van deze omvang beïnvloedt 20 mensen en drie partners. Haasten kost meer dan nog een week nemen.\"",
    },
    insight: {
      en: "The team is not avoiding the decision — they are being thorough about its relational impact. In high-context, polychronic cultures, the quality of a decision includes how it lands relationally, not just what it achieves logically.",
      id: "Tim tidak menghindari keputusan — mereka sedang teliti tentang dampak relasionalnya. Dalam budaya high-context dan polychronic, kualitas keputusan mencakup bagaimana dampaknya secara relasional, bukan hanya apa yang dicapainya secara logis.",
      nl: "Het team vermijdt de beslissing niet — ze zijn grondig over de relationele impact ervan. In high-context, polychronische culturen omvat de kwaliteit van een besluit hoe het relationeel landt, niet alleen wat het logisch bereikt.",
    },
  },
];

const STRATEGIES = [
  {
    en: "Name your time orientation openly with your team. Make the invisible expectation visible — most people assume everyone shares their default.",
    id: "Ungkapkan orientasi waktu Anda secara terbuka dengan tim. Buat harapan tak terlihat menjadi terlihat — kebanyakan orang berasumsi semua orang memiliki default yang sama.",
    nl: "Benoem je tijdoriëntatie openlijk met je team. Maak de onzichtbare verwachting zichtbaar — de meeste mensen nemen aan dat iedereen hun standaard deelt.",
  },
  {
    en: "Build relationship time intentionally into meetings — five minutes at the start is not wasted time, it is the lubricant that makes everything else run.",
    id: "Bangun waktu hubungan dengan sengaja ke dalam rapat — lima menit di awal bukan waktu yang terbuang, itu adalah pelumas yang membuat segalanya berjalan.",
    nl: "Bouw relationele tijd bewust in vergaderingen — vijf minuten aan het begin is geen verspilde tijd, het is het smeermiddel dat alles laat werken.",
  },
  {
    en: "Agree explicitly on what 'on time' and 'deadline' mean in your context. Don't assume shared definitions — negotiate them.",
    id: "Sepakati secara eksplisit apa arti 'tepat waktu' dan 'tenggat waktu' dalam konteks Anda. Jangan berasumsi definisi yang sama — negosiasikan mereka.",
    nl: "Spreek expliciet af wat 'op tijd' en 'deadline' in jouw context betekenen. Neem geen gedeelde definities aan — onderhandel ze.",
  },
  {
    en: "When timelines slip, ask before you conclude. The real reason is often relational, familial, or communal — not laziness.",
    id: "Ketika jadwal meleset, tanyakan sebelum menyimpulkan. Alasan sebenarnya sering bersifat relasional, keluarga, atau komunal — bukan kemalasan.",
    nl: "Wanneer tijdlijnen verschuiven, vraag voordat je concludeert. De echte reden is vaak relationeel, familiaal of communaal — geen luiheid.",
  },
  {
    en: "Protect the relationship when enforcing accountability. The person always comes before the task — even when the task is urgent.",
    id: "Lindungi hubungan saat menegakkan akuntabilitas. Orang selalu lebih penting dari tugas — bahkan ketika tugasnya mendesak.",
    nl: "Bescherm de relatie bij het handhaven van verantwoording. De persoon komt altijd voor de taak — ook als de taak urgent is.",
  },
  {
    en: "Model healthy margin yourself. Leaders who are always rushed give their teams permission to be the same — or teach anxiety as a virtue.",
    id: "Tunjukkan batas yang sehat sendiri. Pemimpin yang selalu terburu-buru memberi timnya izin untuk sama — atau mengajarkan kecemasan sebagai kebajikan.",
    nl: "Modelleer zelf gezonde marge. Leiders die altijd gehaast zijn geven hun teams toestemming hetzelfde te zijn — of leren angst als een deugd.",
  },
];

const QUESTIONS = [
  {
    roman: "I",
    en: "Where do you sit on the monochronic–polychronic spectrum? How does your default shape the frustrations you carry into cross-cultural situations?",
    id: "Di mana posisi Anda dalam spektrum monochronic–polychronic? Bagaimana default Anda membentuk frustrasi yang Anda bawa ke situasi lintas budaya?",
    nl: "Waar zit jij op het monochronisch–polychronisch spectrum? Hoe vormt jouw standaard de frustraties die je meeneemt naar interculturele situaties?",
  },
  {
    roman: "II",
    en: "Think of a team member who was 'always late' or 'never met deadlines'. What was likely happening from their cultural framework?",
    id: "Pikirkan anggota tim yang 'selalu terlambat' atau 'tidak pernah memenuhi tenggat waktu'. Apa yang kemungkinan terjadi dari kerangka budaya mereka?",
    nl: "Denk aan een teamlid dat 'altijd te laat' was of 'nooit deadlines haalde'. Wat speelde er waarschijnlijk vanuit hun cultureel kader?",
  },
  {
    roman: "III",
    en: "How does the biblical concept of Kairos — God's appointed moment, not clock-measured — challenge purely monochronic assumptions about effectiveness?",
    id: "Bagaimana konsep alkitabiah Kairos — momen yang ditetapkan Tuhan, bukan diukur jam — menantang asumsi murni monochronic tentang efektivitas?",
    nl: "Hoe daagt het bijbelse concept Kairos — Gods aangewezen moment, niet klokgemeten — puur monochronische aannames over effectiviteit uit?",
  },
  {
    roman: "IV",
    en: "Do the time agreements in your team reflect one person's cultural default, or have you genuinely negotiated them together?",
    id: "Apakah kesepakatan waktu dalam tim Anda mencerminkan default budaya satu orang, atau apakah Anda benar-benar telah merundingkannya bersama?",
    nl: "Weerspiegelen de tijdsafspraken in je team de culturele standaard van één persoon, of heb je ze echt samen onderhandeld?",
  },
  {
    roman: "V",
    en: "When has someone's flexible relationship with time led to a better outcome than your tight schedule would have allowed?",
    id: "Kapan hubungan fleksibel seseorang dengan waktu menghasilkan hasil yang lebih baik daripada yang diizinkan jadwal ketat Anda?",
    nl: "Wanneer heeft iemands flexibele omgang met tijd tot een beter resultaat geleid dan jouw strakke schema zou hebben toegestaan?",
  },
];

const LEVELS = [
  {
    level: { en: "Beginner", id: "Pemula", nl: "Beginner" },
    title: { en: "Becoming Aware", id: "Menjadi Sadar", nl: "Bewust worden" },
    steps: {
      en: ["Name your own time orientation without judgment", "Identify 2 team members whose time behaviour confuses you", "Ask one question before drawing a conclusion next time"],
      id: ["Kenali orientasi waktu Anda sendiri tanpa penilaian", "Identifikasi 2 anggota tim yang perilaku waktunya membingungkan Anda", "Ajukan satu pertanyaan sebelum menarik kesimpulan berikutnya"],
      nl: ["Benoem je eigen tijdoriëntatie zonder oordeel", "Identificeer 2 teamleden wier tijdsgedrag je verward", "Stel één vraag voordat je de volgende keer een conclusie trekt"],
    },
    color: "oklch(48% 0.14 145)",
    colorBg: "oklch(48% 0.14 145 / 0.07)",
    colorBorder: "oklch(48% 0.14 145 / 0.2)",
  },
  {
    level: { en: "Practitioner", id: "Praktisi", nl: "Beoefenaar" },
    title: { en: "Bridging Actively", id: "Menjembatani Secara Aktif", nl: "Actief overbruggen" },
    steps: {
      en: ["Open team conversations about time norms explicitly", "Redesign your meeting structure to include relational time", "Agree on a shared definition of 'deadline' with your team"],
      id: ["Buka percakapan tim tentang norma waktu secara eksplisit", "Redesain struktur rapat Anda untuk menyertakan waktu relasional", "Sepakati definisi 'tenggat waktu' bersama tim Anda"],
      nl: ["Open teamgesprekken over tijdsnormen expliciet", "Herontwerp je vergaderstructuur om relationele tijd op te nemen", "Spreek een gezamenlijke definitie van 'deadline' af met je team"],
    },
    color: "oklch(50% 0.14 25)",
    colorBg: "oklch(50% 0.14 25 / 0.07)",
    colorBorder: "oklch(50% 0.14 25 / 0.2)",
  },
  {
    level: { en: "Advanced", id: "Mahir", nl: "Gevorderd" },
    title: { en: "Integrating Both", id: "Mengintegrasikan Keduanya", nl: "Beide integreren" },
    steps: {
      en: ["Build team rhythms that serve both orientations", "Coach others to navigate time tension with curiosity, not judgment", "Design accountability systems that honour relationship without abandoning results"],
      id: ["Bangun ritme tim yang melayani kedua orientasi", "Latih orang lain untuk menghadapi ketegangan waktu dengan rasa ingin tahu, bukan penilaian", "Rancang sistem akuntabilitas yang menghormati hubungan tanpa meninggalkan hasil"],
      nl: ["Bouw teamritmes die beide oriëntaties dienen", "Coach anderen om tijdspanning te navigeren met nieuwsgierigheid, niet oordeel", "Ontwerp verantwoordingssystemen die relaties eren zonder resultaten te laten varen"],
    },
    color: "oklch(52% 0.14 45)",
    colorBg: "oklch(52% 0.14 45 / 0.07)",
    colorBorder: "oklch(52% 0.14 45 / 0.2)",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function TimeAndCultureClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const showSave = userPathway !== null;

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("time-and-culture");
      setSaved(true);
    });
  }

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(2.5rem, 4vw, 4rem)", paddingBottom: "clamp(2.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← Resources
          </Link>

          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.75rem" }}>
            {(["en", "id", "nl"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.3rem 0.7rem", background: lang === l ? "oklch(65% 0.15 45)" : "transparent", color: lang === l ? "oklch(14% 0.08 260)" : "oklch(60% 0.04 260)", border: "1px solid", borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(35% 0.05 260)", cursor: "pointer" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="pathway-badge" style={{ background: "oklch(65% 0.15 45 / 0.15)", color: "oklch(82% 0.08 60)", marginBottom: "1.25rem", display: "inline-flex" }}>
            {t("Cultural Dimensions", "Dimensi Budaya", "Culturele Dimensies")}
          </span>

          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "18ch" }}>
            {lang === "en"
              ? <>Time &amp;<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Culture.</span></>
              : lang === "id"
              ? <>Waktu &amp;<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Budaya.</span></>
              : <>Tijd &amp;<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Cultuur.</span></>}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem" }}>
            {t(
              "Time is not neutral. How your culture handles it is one of the deepest sources of cross-cultural friction — and one of the most overlooked.",
              "Waktu tidak netral. Bagaimana budaya Anda menanganinya adalah salah satu sumber gesekan lintas budaya yang paling dalam — dan paling sering diabaikan.",
              "Tijd is niet neutraal. Hoe jouw cultuur ermee omgaat is een van de diepste bronnen van interculturele wrijving — en een van de meest over het hoofd geziene.",
            )}
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {showSave && (
              saved ? (
                <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  ✓ {t("In your dashboard", "Di dashboard Anda", "In uw dashboard")}
                </Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.625rem 1.25rem", cursor: isPending ? "wait" : "pointer", transition: "background 0.15s" }}>
                  {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("+ Add to Dashboard", "+ Tambah ke Dashboard", "+ Toevoegen aan Dashboard")}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── OPENING STORY ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
                {t("Opening Story", "Cerita Pembuka", "Openingsverhaal")}
              </p>
              <h2 className="t-section" style={{ marginBottom: "1.25rem" }}>
                {t("9:05 AM.", "Pukul 09:05.", "9:05 uur.")}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(38% 0.005 260)", marginBottom: "1rem" }}>
                {t(
                  "Lars scheduled the meeting for 9:00 AM sharp. He arrived at 8:55, laptop open, agenda printed. By 9:05, three of his Indonesian team members had still not entered the room.",
                  "Lars menjadwalkan rapat tepat pukul 09:00. Ia tiba pukul 08:55, laptop terbuka, agenda tercetak. Pukul 09:05, tiga anggota tim Indonesianya belum masuk ruangan.",
                  "Lars had de vergadering ingepland voor precies 9:00 uur. Hij arriveerde om 8:55, laptop open, agenda uitgeprint. Om 9:05 waren drie van zijn Indonesische teamleden nog niet binnengekomen.",
                )}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(38% 0.005 260)", marginBottom: "1rem" }}>
                {t(
                  "He could see them through the glass — Dimas was finishing a conversation with someone from another department, Rini was helping a colleague find a file, Yanto was making tea and listening to both of them.",
                  "Ia bisa melihat mereka melalui kaca — Dimas sedang menyelesaikan percakapan dengan seseorang dari departemen lain, Rini membantu rekan menemukan file, Yanto membuat teh sambil mendengarkan keduanya.",
                  "Hij kon ze door het glas zien — Dimas rondde een gesprek af met iemand van een andere afdeling, Rini hielp een collega een bestand te vinden, Yanto zette thee en luisterde naar hen allebei.",
                )}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(38% 0.005 260)" }}>
                {t(
                  "Lars felt disrespected. His team felt nothing was unusual. Same moment — completely different worlds.",
                  "Lars merasa tidak dihormati. Timnya merasa tidak ada yang tidak biasa. Momen yang sama — dunia yang benar-benar berbeda.",
                  "Lars voelde zich niet gerespecteerd. Zijn team voelde dat er niets bijzonders was. Zelfde moment — volledig andere werelden.",
                )}
              </p>
            </div>

            <div style={{ background: "oklch(22% 0.10 260)", padding: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1rem", fontSize: "0.6rem" }}>
                {t("The Root Cause", "Akar Masalah", "De Oorzaak")}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontStyle: "italic", color: "oklch(85% 0.03 80)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                {t(
                  "\"Neither Lars nor his team was wrong. They were operating from different core assumptions about what time is for — and neither had ever made those assumptions visible.\"",
                  "\"Baik Lars maupun timnya tidak salah. Mereka beroperasi dari asumsi inti yang berbeda tentang untuk apa waktu itu — dan tidak ada yang pernah membuat asumsi tersebut terlihat.\"",
                  "\"Noch Lars noch zijn team had het mis. Ze opereerden vanuit verschillende kernassumpties over waarvoor tijd is — en niemand had die aannames ooit zichtbaar gemaakt.\"",
                )}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(70% 0.04 260)" }}>
                {t(
                  "Anthropologist Edward T. Hall called this the difference between monochronic and polychronic time. It is one of the most fundamental — and most invisible — cultural divides in global teams.",
                  "Antropolog Edward T. Hall menyebut ini perbedaan antara waktu monochronic dan polychronic. Ini adalah salah satu perbedaan budaya yang paling mendasar — dan paling tidak terlihat — dalam tim global.",
                  "Antropoloog Edward T. Hall noemde dit het verschil tussen monochronische en polychronische tijd. Het is een van de meest fundamentele — en meest onzichtbare — culturele kloven in mondiale teams.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(99% 0.002 80)" }}>
        <div className="container-wide">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
              {t("Hall's Framework", "Kerangka Hall", "Hall's Framework")}
            </p>
            <h2 className="t-section">
              {t("Two ways of experiencing time", "Dua cara mengalami waktu", "Twee manieren om tijd te ervaren")}
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "oklch(97% 0.005 80)", border: "1px solid oklch(88% 0.008 80)" }}>
              <thead>
                <tr style={{ background: "oklch(22% 0.10 260)" }}>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(60% 0.04 260)", width: "25%" }}>
                    {t("Aspect", "Aspek", "Aspect")}
                  </th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", width: "37.5%" }}>
                    {t("Monochronic", "Monochronic", "Monochronisch")}
                    <span style={{ display: "block", fontWeight: 400, letterSpacing: "0.05em", fontSize: "0.65rem", color: "oklch(55% 0.04 260)", marginTop: "0.2rem", textTransform: "none" }}>
                      {t("Netherlands, Germany, Scandinavia, USA", "Belanda, Jerman, Skandinavia, AS", "Nederland, Duitsland, Scandinavië, VS")}
                    </span>
                  </th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(72% 0.14 145)", width: "37.5%" }}>
                    {t("Polychronic", "Polychronic", "Polychronisch")}
                    <span style={{ display: "block", fontWeight: 400, letterSpacing: "0.05em", fontSize: "0.65rem", color: "oklch(55% 0.04 260)", marginTop: "0.2rem", textTransform: "none" }}>
                      {t("Indonesia, Malaysia, Philippines, Middle East, Latin America", "Indonesia, Malaysia, Filipina, Timur Tengah, Amerika Latin", "Indonesië, Maleisië, Filipijnen, Midden-Oosten, Latijns-Amerika")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(90% 0.008 80)", background: i % 2 === 0 ? "oklch(97% 0.005 80)" : "oklch(99% 0.002 80)" }}>
                    <td style={{ padding: "1rem 1.25rem", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.825rem", color: "oklch(30% 0.12 260)" }}>
                      {row.aspect[lang]}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", color: "oklch(42% 0.008 260)", lineHeight: 1.6 }}>
                      {row.mono[lang]}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", color: "oklch(42% 0.008 260)", lineHeight: 1.6 }}>
                      {row.poly[lang]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 3 SCENARIOS ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
              {t("In the Field", "Di Lapangan", "In het veld")}
            </p>
            <h2 className="t-section">
              {t("Three clashes that happen every week", "Tiga benturan yang terjadi setiap minggu", "Drie botsingen die elke week voorkomen")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {SCENARIOS.map((s, i) => {
              const isOpen = openScenario === i;
              return (
                <div key={i} style={{ background: "oklch(97% 0.005 80)" }}>
                  <button
                    onClick={() => setOpenScenario(isOpen ? null : i)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}
                  >
                    <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 700, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, minWidth: "2rem" }}>{i + 1}</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", color: "oklch(22% 0.10 260)", flex: 1 }}>{s.title[lang]}</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", color: "oklch(55% 0.008 260)", flexShrink: 0 }}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 2rem 2rem 2rem" }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(38% 0.008 260)", marginBottom: "1.5rem", paddingLeft: "3.5rem" }}>
                        {s.setup[lang]}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.25rem", paddingLeft: "3.5rem" }}>
                        <div style={{ background: "oklch(30% 0.12 260 / 0.06)", border: "1px solid oklch(30% 0.12 260 / 0.15)", padding: "1.25rem 1.5rem" }}>
                          <p className="t-label" style={{ fontSize: "0.55rem", color: "oklch(30% 0.12 260)", marginBottom: "0.5rem" }}>
                            {t("Western perspective", "Perspektif Barat", "Westers perspectief")}
                          </p>
                          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", fontStyle: "italic", color: "oklch(30% 0.12 260)", lineHeight: 1.6, margin: 0 }}>{s.dutch[lang]}</p>
                        </div>
                        <div style={{ background: "oklch(65% 0.15 45 / 0.06)", border: "1px solid oklch(65% 0.15 45 / 0.2)", padding: "1.25rem 1.5rem" }}>
                          <p className="t-label" style={{ fontSize: "0.55rem", color: "oklch(52% 0.12 45)", marginBottom: "0.5rem" }}>
                            {t("SEA perspective", "Perspektif Asia Tenggara", "ZO-Aziatisch perspectief")}
                          </p>
                          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", fontStyle: "italic", color: "oklch(38% 0.10 45)", lineHeight: 1.6, margin: 0 }}>{s.sea[lang]}</p>
                        </div>
                      </div>
                      <div style={{ paddingLeft: "3.5rem", paddingTop: "0.5rem" }}>
                        <p className="t-label" style={{ fontSize: "0.55rem", color: "oklch(65% 0.15 45)", marginBottom: "0.375rem" }}>
                          {t("What's really happening", "Yang sebenarnya terjadi", "Wat er werkelijk speelt")}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(38% 0.008 260)", margin: 0 }}>{s.insight[lang]}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAITH ANCHOR ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.6rem" }}>
                {t("A Word on Time", "Sepatah Kata tentang Waktu", "Een woord over tijd")}
              </p>
              <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1.25rem" }}>
                {t("Chronos and Kairos", "Chronos dan Kairos", "Chronos en Kairos")}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", marginBottom: "1rem" }}>
                {t(
                  "The Bible uses two distinct words for time. Chronos refers to clock time — minutes, hours, deadlines. Kairos refers to the appointed moment — the right time, the opportune season, the moment God has prepared.",
                  "Alkitab menggunakan dua kata berbeda untuk waktu. Chronos mengacu pada waktu jam — menit, jam, tenggat waktu. Kairos mengacu pada momen yang ditetapkan — waktu yang tepat, musim yang tepat, momen yang telah Tuhan siapkan.",
                  "De Bijbel gebruikt twee verschillende woorden voor tijd. Chronos verwijst naar kloktijd — minuten, uren, deadlines. Kairos verwijst naar het aangewezen moment — de juiste tijd, het geschikte seizoen, het moment dat God heeft bereid.",
                )}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)" }}>
                {t(
                  "Monochronic cultures are deeply comfortable with Chronos. But the most pivotal moments in Scripture — a burning bush, a chance encounter at a well, a tax collector in a tree — did not arrive on schedule. Cross-cultural leaders who can hold both orientations are better positioned to recognise when God is in the interruption.",
                  "Budaya monochronic sangat nyaman dengan Chronos. Tetapi momen-momen paling penting dalam Kitab Suci — semak yang terbakar, pertemuan kebetulan di sumur, pemungut cukai di pohon — tidak tiba sesuai jadwal. Pemimpin lintas budaya yang bisa memegang kedua orientasi lebih siap untuk mengenali ketika Tuhan ada dalam gangguan.",
                  "Monochronische culturen zijn diep comfortabel met Chronos. Maar de meest cruciale momenten in de Schrift — een brandende struik, een toevallige ontmoeting bij een put, een tollenaar in een boom — kwamen niet op schema. Interculturele leiders die beide oriëntaties kunnen vasthouden zijn beter gepositioneerd om te herkennen wanneer God in de onderbreking is.",
                )}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { ref: "Ecclesiastes 3:1", en: "\"There is a time for everything, and a season for every activity under the heavens.\" — Not all time is equal. Wisdom knows which kind is which.", id: "\"Ada waktu untuk segala sesuatu, ada musim untuk segala kejadian di bawah langit.\" — Tidak semua waktu setara. Kebijaksanaan mengetahui mana yang mana.", nl: "\"Er is een tijd voor alles en een uur voor elk doel onder de hemel.\" — Niet alle tijd is gelijk. Wijsheid weet welke welke is." },
                { ref: "Ephesians 5:15–16", en: "\"Be very careful, then, how you live — not as unwise but as wise, making the most of every opportunity.\" — Redeeming time is not filling a schedule; it is recognising the moment.", id: "\"Karena itu, perhatikanlah dengan saksama bagaimana kamu hidup, janganlah seperti orang bebal, tetapi seperti orang arif, dan pergunakanlah waktu yang ada.\" — Menebus waktu bukan mengisi jadwal; itu mengenali momen.", nl: "\"Pas dus goed op hoe u leeft, niet als onverstandigen maar als verstandigen. Benut de tijd ten volle.\" — Tijd benutten is geen schema vullen; het is het moment herkennen." },
                { ref: "2 Peter 3:8", en: "\"With the Lord a day is like a thousand years, and a thousand years are like a day.\" — God is not bound by either monochronic or polychronic time. Both are held within His.", id: "\"Di hadapan Tuhan satu hari sama seperti seribu tahun dan seribu tahun sama seperti satu hari.\" — Tuhan tidak terikat oleh waktu monochronic maupun polychronic. Keduanya ada dalam milik-Nya.", nl: "\"Voor de Heer is een dag als duizend jaar en duizend jaar als één dag.\" — God is niet gebonden aan monochronische noch polychronische tijd. Beide worden gehouden in de Zijne." },
              ].map(v => (
                <div key={v.ref} style={{ background: "oklch(28% 0.11 260)", padding: "1.5rem" }}>
                  <p className="t-label" style={{ fontSize: "0.6rem", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem" }}>{v.ref}</p>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", fontStyle: "italic", color: "oklch(85% 0.03 80)", lineHeight: 1.65, margin: 0 }}>
                    {lang === "en" ? v.en : lang === "id" ? v.id : v.nl}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STRATEGIES ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
              {t("Practical Leadership", "Kepemimpinan Praktis", "Praktisch leiderschap")}
            </p>
            <h2 className="t-section">
              {t("Six bridging strategies", "Enam strategi menjembatani", "Zes verbindingsstrategieën")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {STRATEGIES.map((s, i) => (
              <div key={i} style={{ background: "oklch(97% 0.005 80)", padding: "2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontWeight: 700, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, minWidth: "2rem" }}>{i + 1}</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(38% 0.008 260)", margin: 0, paddingTop: "0.4rem" }}>
                  {lang === "en" ? s.en : lang === "id" ? s.id : s.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPMENT PATH ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(99% 0.002 80)" }}>
        <div className="container-wide">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
              {t("Your Development Path", "Jalur Pengembangan Anda", "Jouw ontwikkelpad")}
            </p>
            <h2 className="t-section">
              {t("Where are you now?", "Di mana Anda sekarang?", "Waar ben jij nu?")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {LEVELS.map((l) => (
              <div key={l.level.en} style={{ background: "oklch(97% 0.005 80)", padding: "2rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: l.colorBg, border: `1px solid ${l.colorBorder}`, padding: "0.2rem 0.75rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: l.color }}>
                    {l.level[lang]}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", marginBottom: "1.25rem" }}>
                  {l.title[lang]}
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {l.steps[lang].map((step, i) => (
                    <li key={i} style={{ display: "flex", gap: "0.75rem", fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(38% 0.008 260)", lineHeight: 1.6 }}>
                      <span style={{ color: l.color, fontWeight: 700, flexShrink: 0 }}>+</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFLECTION QUESTIONS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide">
          <div style={{ paddingLeft: "2.5rem" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>
              {t("Reflection", "Refleksi", "Reflectie")}
            </p>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "2.5rem" }}>
              {t("Five questions worth sitting with.", "Lima pertanyaan yang layak direnungkan.", "Vijf vragen om bij stil te staan.")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(40% 0.008 260 / 0.3)" }}>
              {QUESTIONS.map((q) => (
                <div key={q.roman} style={{ background: "oklch(28% 0.10 260)", padding: "1.75rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.7rem", color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", flexShrink: 0, paddingTop: "0.15rem", minWidth: "1.75rem" }}>{q.roman}</span>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(78% 0.04 260)", margin: 0 }}>
                    {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de Bibliotheek")}
            </p>
            <h2 className="t-section" style={{ marginBottom: "1rem" }}>
              {t(<>Part of the full<br />content library.</>, <>Bagian dari perpustakaan<br />konten lengkap.</>, <>Onderdeel van de volledige<br />contentbibliotheek.</>)}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", marginBottom: "2rem", maxWidth: "48ch" }}>
              {t(
                "Time & Culture is one of many dimensions explored in the Crispy Development library — built for leaders navigating cross-cultural complexity.",
                "Waktu & Budaya adalah salah satu dari banyak dimensi yang dieksplorasi dalam perpustakaan Crispy Development — dibangun untuk pemimpin yang menavigasi kompleksitas lintas budaya.",
                "Tijd & Cultuur is een van de vele dimensies die worden onderzocht in de Crispy Development bibliotheek — gebouwd voor leiders die interculturele complexiteit navigeren.",
              )}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!userPathway ? (
                <Link href="/signup" className="btn-primary">{t("Join the Community →", "Bergabung →", "Word lid →")}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →", "Naar Dashboard →")}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("+ Add to Dashboard", "+ Tambah ke Dashboard", "+ Toevoegen aan Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan", "Verken de Bibliotheek")}</Link>
            </div>
          </div>
          <div style={{ background: "oklch(30% 0.12 260)", padding: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.375rem", fontStyle: "italic", color: "oklch(78% 0.04 260)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              {t(
                "\"The most disruptive cross-cultural tool is a question asked before a conclusion is drawn.\"",
                "\"Alat lintas budaya yang paling mengganggu adalah pertanyaan yang diajukan sebelum kesimpulan ditarik.\"",
                "\"Het meest disruptieve interculturele instrument is een vraag die wordt gesteld voordat een conclusie wordt getrokken.\"",
              )}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(65% 0.15 45)" }} />
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crispy Development</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
