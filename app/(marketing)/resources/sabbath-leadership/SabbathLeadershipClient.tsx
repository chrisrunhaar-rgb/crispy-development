"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const BURNOUT_SIGNS = [
  {
    en: "Exhaustion that doesn't recover with a weekend — you wake up tired even after rest.",
    id: "Kelelahan yang tidak pulih dengan akhir pekan — Anda bangun dengan lelah bahkan setelah istirahat.",
    nl: "Uitputting die niet herstelt na een weekend — je wordt moe wakker zelfs na rust.",
  },
  {
    en: "Cynicism creeping into your view of the work, the team, or the mission.",
    id: "Sinisme yang merayap ke dalam pandangan Anda tentang pekerjaan, tim, atau misi.",
    nl: "Cynisme dat je kijk op het werk, het team of de missie binnensluipt.",
  },
  {
    en: "A growing sense that what you do no longer matters — diminished efficacy.",
    id: "Perasaan yang semakin besar bahwa apa yang Anda lakukan tidak lagi penting — berkurangnya kemanjuran.",
    nl: "Een groeiend gevoel dat wat je doet er niet meer toe doet — verminderde effectiviteit.",
  },
  {
    en: "Digital work seeping into every hour — no clear boundary between 'on' and 'off'.",
    id: "Pekerjaan digital meresap ke setiap jam — tidak ada batas yang jelas antara 'aktif' dan 'tidak aktif'.",
    nl: "Digitaal werk dat elk uur binnensijpelt — geen duidelijke grens tussen 'aan' en 'uit'.",
  },
  {
    en: "Irritability and reactivity that you can't explain — small things trigger large responses.",
    id: "Iritabilitas dan reaktivitas yang tidak dapat Anda jelaskan — hal-hal kecil memicu respons besar.",
    nl: "Irritabiliteit en reactiviteit die je niet kunt verklaren — kleine dingen veroorzaken grote reacties.",
  },
];

const SCENARIOS = [
  {
    title: { en: "The Greedy Institution", id: "Institusi yang Rakus", nl: "De Gulzige Instelling" },
    setup: {
      en: "A Western Christian leader moves to a Southeast Asian context and tries to impose a rigid 40-hour workweek and structured productivity frameworks. He values clear boundaries, recovery time, and work-life separation.",
      id: "Seorang pemimpin Kristen Barat pindah ke konteks Asia Tenggara dan mencoba menerapkan kerja 40 jam yang ketat dan kerangka produktivitas terstruktur.",
      nl: "Een Westerse christelijke leider verhuist naar een Zuidoost-Aziatische context en probeert een rigide 40-urige werkweek en gestructureerde productiviteitsframeworks op te leggen.",
    },
    breakdown: {
      en: "The local team's rhythm is seasonal, relational, and communal — rest is woven into festivals, family obligations, and religious assembly. The Western framework feels oppressive, not freeing. The leader burns out trying to enforce it, and the team quietly resists.",
      id: "Ritme tim lokal bersifat musiman, relasional, dan komunal — istirahat dijalin ke dalam festival, kewajiban keluarga, dan perkumpulan keagamaan. Kerangka Barat terasa menindas.",
      nl: "Het ritme van het lokale team is seizoensgebonden, relationeel en communaal — rust is verweven in festivals, familieverplichtingen en religieuze bijeenkomsten. Het Westerse framework voelt onderdrukkend aan.",
    },
    response: {
      en: "Learn the rest rhythms of your context before imposing your own. Build in the communal rest cycles already present in the culture. Your personal Sabbath practice may look different in Surabaya than it did in Rotterdam — and that's not a failure of discipline.",
      id: "Pelajari ritme istirahat konteks Anda sebelum memaksakan milik Anda sendiri. Bangun siklus istirahat komunal yang sudah ada dalam budaya. Praktik Sabat pribadi Anda mungkin terlihat berbeda.",
      nl: "Leer de rustritmes van je context voor je je eigen oplegt. Bouw de communale rustcycli in die al aanwezig zijn in de cultuur. Je persoonlijke Sabbathpraktijk kan er in Surabaya anders uitzien dan in Rotterdam.",
    },
  },
  {
    title: { en: "The Digital Boundary Collapse", id: "Runtuhnya Batas Digital", nl: "De Digitale Grensval" },
    setup: {
      en: "A high-capacity leader manages teams across three time zones. He is responsive 24/7, keeps WhatsApp notifications on through the night, and prides himself on always being available.",
      id: "Seorang pemimpin berkapasitas tinggi mengelola tim di tiga zona waktu. Ia responsif 24/7, menjaga notifikasi WhatsApp menyala sepanjang malam.",
      nl: "Een high-capacity leider beheert teams over drie tijdzones. Hij is 24/7 bereikbaar, houdt WhatsApp-meldingen de hele nacht aan.",
    },
    breakdown: {
      en: "After 18 months, his creative thinking has dulled. He's short with his family. He can't fully concentrate on anything. He's technically present in every meeting but mentally absent. Hidden overtime has quietly consumed his margin.",
      id: "Setelah 18 bulan, pemikiran kreatifnya telah tumpul. Ia mudah marah dengan keluarganya. Ia tidak dapat berkonsentrasi penuh pada apapun. Lembur tersembunyi secara diam-diam telah menghabiskan marginnya.",
      nl: "Na 18 maanden is zijn creatief denken afgestompt. Hij is kortaf met zijn gezin. Verborgen overwerk heeft zijn marge stilletjes opgeslokt.",
    },
    response: {
      en: "Create rituals to start and end the day — not just to manage tasks, but to mark the boundary of work. Turn off notifications from 9pm to 7am. One full day of digital non-engagement per week is not a luxury. It is the biological minimum for sustainable leadership.",
      id: "Ciptakan ritual untuk memulai dan mengakhiri hari — bukan hanya untuk mengelola tugas, tetapi untuk menandai batas pekerjaan. Matikan notifikasi dari jam 9 malam hingga 7 pagi.",
      nl: "Creëer rituelen om de dag te starten en te beëindigen — niet alleen om taken te beheren, maar om de grens van werk te markeren. Schakel meldingen uit van 21:00 tot 07:00.",
    },
  },
  {
    title: { en: "Busyness as Identity", id: "Kesibukan sebagai Identitas", nl: "Drukte als Identiteit" },
    setup: {
      en: "A respected leader in a mission organisation has never taken a full week of holiday in five years. Her team admires her work ethic. She measures her faithfulness by her output. Rest feels like a form of spiritual negligence.",
      id: "Seorang pemimpin yang dihormati dalam organisasi misi belum pernah mengambil liburan penuh dalam lima tahun. Timnya mengagumi etos kerjanya. Ia mengukur kesetiaannya dengan hasilnya.",
      nl: "Een gerespecteerde leider in een missieorganisatie heeft in vijf jaar geen volledige vakantieweek genomen. Haar team bewondert haar arbeidsethos.",
    },
    breakdown: {
      en: "She mistakes activity for faithfulness. Her team begins to mirror her pattern — no one takes leave, no one admits fatigue. The organisation is producing less than three years ago despite working harder. The culture has confused sacrifice with sustainability.",
      id: "Ia salah mengira aktivitas sebagai kesetiaan. Timnya mulai mencerminkan polanya — tidak ada yang mengambil cuti. Budaya telah mencampuradukkan pengorbanan dengan keberlanjutan.",
      nl: "Ze verwart activiteit met trouw. Haar team spiegelt haar patroon — niemand neemt verlof. De cultuur heeft opoffering verward met duurzaamheid.",
    },
    response: {
      en: "Sabbath is not a reward for hard work — it is a command built into creation. God rested, not because he was tired, but to model the rhythm. High-capacity leaders who don't rest eventually stop being high-capacity. Rest is a form of leadership.",
      id: "Sabat bukan hadiah untuk kerja keras — itu adalah perintah yang dibangun ke dalam ciptaan. Allah beristirahat bukan karena Ia lelah, tetapi untuk memodelkan ritme.",
      nl: "Sabbat is geen beloning voor hard werk — het is een gebod ingebouwd in de schepping. God rustte niet omdat hij moe was, maar om het ritme te modelleren.",
    },
  },
];

const STRATEGIES = [
  {
    en: "Establish a weekly full-day digital sabbath — one day with no emails, messages, or screens. Non-negotiable.",
    id: "Tetapkan sabat digital satu hari penuh setiap minggu — satu hari tanpa email, pesan, atau layar. Tidak dapat dinegosiasikan.",
    nl: "Stel een wekelijkse volledige digitale sabbat in — één dag zonder e-mails, berichten of schermen. Niet onderhandelbaar.",
  },
  {
    en: "Create rituals to start and end the workday — a brief prayer, a five-minute walk, or any physical marker that says 'work begins' and 'work ends.'",
    id: "Ciptakan ritual untuk memulai dan mengakhiri hari kerja — doa singkat, jalan kaki lima menit, atau penanda fisik yang mengatakan 'kerja dimulai' dan 'kerja berakhir.'",
    nl: "Creëer rituelen om de werkdag te starten en te beëindigen — een kort gebed, een vijf minuten durende wandeling, of een fysieke markering.",
  },
  {
    en: "Prioritise sleep and physical exercise as leadership disciplines — not self-care add-ons. They are the biological foundations of cognitive function.",
    id: "Prioritaskan tidur dan olahraga sebagai disiplin kepemimpinan — bukan tambahan perawatan diri. Mereka adalah fondasi biologis fungsi kognitif.",
    nl: "Prioriteer slaap en lichaamsbeweging als leiderschapsdisciplines — niet als zelfzorgtoevoegingen. Ze zijn de biologische basis van cognitief functioneren.",
  },
  {
    en: "Build a peer accountability structure for rest — someone who will ask you the uncomfortable question: 'Did you actually rest this week?'",
    id: "Bangun struktur akuntabilitas rekan untuk istirahat — seseorang yang akan mengajukan pertanyaan yang tidak nyaman: 'Apakah Anda benar-benar beristirahat minggu ini?'",
    nl: "Bouw een peer accountability structuur voor rust — iemand die je de ongemakkelijke vraag stelt: 'Heb je deze week echt gerust?'",
  },
  {
    en: "Take the full annual leave you are entitled to. Model rest for your team — they won't take leave if you never do.",
    id: "Ambil cuti tahunan penuh yang menjadi hak Anda. Modelkan istirahat untuk tim Anda — mereka tidak akan mengambil cuti jika Anda tidak pernah melakukannya.",
    nl: "Neem het volledige jaarlijkse verlof dat je toekomt. Modeleer rust voor je team — ze nemen geen verlof als jij dat nooit doet.",
  },
];

const REFLECTION = [
  {
    roman: "I",
    en: "When did you last genuinely rest — not sleep out of exhaustion, but actually stop and be restored?",
    id: "Kapan terakhir kali Anda benar-benar beristirahat — bukan tidur karena kelelahan, tetapi benar-benar berhenti dan dipulihkan?",
    nl: "Wanneer heb je voor het laatst echt gerust — niet geslapen uit uitputting, maar werkelijk gestopt en hersteld?",
  },
  {
    roman: "II",
    en: "Is your busyness a sign of faithfulness or of a deeper anxiety about your worth and productivity?",
    id: "Apakah kesibukan Anda merupakan tanda kesetiaan atau kecemasan yang lebih dalam tentang nilai dan produktivitas Anda?",
    nl: "Is jouw drukte een teken van trouw of van een diepere angst over je waarde en productiviteit?",
  },
  {
    roman: "III",
    en: "What would your leadership look like 10 years from now if you don't change your current rest rhythms?",
    id: "Seperti apa kepemimpinan Anda 10 tahun dari sekarang jika Anda tidak mengubah ritme istirahat Anda saat ini?",
    nl: "Hoe zou jouw leiderschap er over 10 jaar uitzien als je je huidige rustritmes niet verandert?",
  },
  {
    roman: "IV",
    en: "In your cultural context, what form of communal rest already exists — and how can you build your personal rhythm around it rather than against it?",
    id: "Dalam konteks budaya Anda, bentuk istirahat komunal apa yang sudah ada — dan bagaimana Anda bisa membangun ritme pribadi Anda di sekitarnya?",
    nl: "In jouw culturele context, welke vorm van communale rust bestaat er al — en hoe kun je je persoonlijke ritme eromheen bouwen?",
  },
  {
    roman: "V",
    en: "What specific practice will you commit to this week to begin building a more sustainable leadership rhythm?",
    id: "Praktik spesifik apa yang akan Anda komitmen minggu ini untuk mulai membangun ritme kepemimpinan yang lebih berkelanjutan?",
    nl: "Welke specifieke praktijk zul je deze week beginnen om een duurzamer leiderschapsritme op te bouwen?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function SabbathLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("sabbath-leadership");
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
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Sustainable Leadership", "Kepemimpinan Berkelanjutan", "Duurzaam Leiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Sabbath & Sustainable Leadership", "Sabat & Kepemimpinan Berkelanjutan", "Sabbat & Duurzaam Leiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"God blessed the seventh day and made it holy, because on it he rested from all the work of creating." — Genesis 2:3',
            '"Allah memberkati hari ketujuh itu dan menguduskannya, karena pada hari itulah Ia berhenti dari segala pekerjaan penciptaan." — Kejadian 2:3',
            '"God zegende de zevende dag en heiligde die, want op die dag rustte Hij van al het werk dat Hij scheppend had gemaakt." — Genesis 2:3'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "The Hebrew word *shabbat* means to cease, desist, or stop. Not to pause temporarily — but to genuinely stop. God did not rest on the seventh day because he was tired. He rested to model a rhythm built into the architecture of creation itself. That rhythm is not a suggestion for leaders. It is a command.",
            "Kata Ibrani *shabbat* berarti berhenti, melepaskan, atau menghentikan. Bukan untuk berhenti sementara — tetapi untuk benar-benar berhenti. Allah tidak beristirahat pada hari ketujuh karena Ia lelah. Ia beristirahat untuk memodelkan ritme yang dibangun ke dalam arsitektur ciptaan itu sendiri.",
            "Het Hebreeuwse woord *shabbat* betekent ophouden, stoppen. Niet tijdelijk pauzeren — maar echt stoppen. God rustte op de zevende dag niet omdat hij moe was. Hij rustte om een ritme te modelleren dat ingebouwd is in de architectuur van de schepping zelf."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "High-capacity leaders in cross-cultural ministry are particularly vulnerable to burnout — they serve greedy institutions that demand undivided loyalty, in contexts that blur work and life boundaries, often without an adequate support structure. This module is not about working less. It's about working in a way that can be sustained for the long haul.",
            "Pemimpin berkapasitas tinggi dalam pelayanan lintas budaya sangat rentan terhadap kelelahan — mereka melayani institusi yang menuntut loyalitas penuh, dalam konteks yang mengaburkan batas kerja dan kehidupan.",
            "High-capacity leiders in interculturele bediening zijn bijzonder kwetsbaar voor burnout — ze dienen instellingen die volledige loyaliteit eisen, in contexten die grenzen tussen werk en leven vervagen."
          )}
        </p>
      </div>

      {/* Burnout warning signs */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("5 Early Warning Signs", "5 Tanda Peringatan Dini", "5 Vroege Waarschuwingssignalen")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 40 }}>
            {t("Burnout doesn't arrive suddenly — it builds slowly from ignored signals", "Kelelahan tidak datang tiba-tiba — ia berkembang perlahan dari sinyal yang diabaikan", "Burnout komt niet plotseling — het bouwt langzaam op uit genegeerde signalen")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {BURNOUT_SIGNS.map((s, i) => (
              <div key={i} style={{ background: offWhite, padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 28, fontWeight: 700, color: "oklch(50% 0.15 20)", lineHeight: 1, minWidth: 24, flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{lang === "en" ? s.en : lang === "id" ? s.id : s.nl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ padding: "72px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("Three Patterns to Recognise", "Tiga Pola untuk Dikenali", "Drie Patronen om te Herkennen")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
          {t("Real scenarios of unsustainable leadership — and the way forward", "Skenario nyata kepemimpinan yang tidak berkelanjutan — dan jalan ke depan", "Echte scenario's van onhoudbaar leiderschap — en de weg vooruit")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SCENARIOS.map((s, i) => {
            const isOpen = openScenario === i;
            return (
              <div key={i} style={{ border: `1px solid ${isOpen ? orange : "oklch(88% 0.01 80)"}`, overflow: "hidden" }}>
                <button onClick={() => setOpenScenario(isOpen ? null : i)} style={{ width: "100%", padding: "20px 28px", background: isOpen ? navy : offWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: isOpen ? offWhite : navy }}>{s.title[lang]}</span>
                  <span style={{ color: isOpen ? orange : bodyText, fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "28px 28px 32px", background: offWhite }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("The Pattern", "Polanya", "Het Patroon")}</p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.setup[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(45% 0.15 20)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("What Happens", "Yang Terjadi", "Wat Er Gebeurt")}</p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.breakdown[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(40% 0.12 160)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t("The Sabbath Way", "Jalan Sabat", "De Sabbatweg")}</p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{s.response[lang]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Biblical anchor */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 48 }}>
            {t("The Theology of Rest", "Teologi Istirahat", "De Theologie van Rust")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                ref: "Genesis 2:2–3",
                verse: {
                  en: '"By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work. Then God blessed the seventh day and made it holy."',
                  id: '"Ketika Allah pada hari ketujuh telah menyelesaikan pekerjaan yang dibuat-Nya itu, berhentilah Ia pada hari ketujuh dari segala pekerjaan yang telah dibuat-Nya itu. Lalu Allah memberkati hari ketujuh itu dan menguduskannya."',
                  nl: '"Toen God op de zevende dag het werk voltooid had dat hij had gemaakt, rustte hij op de zevende dag van al het werk dat hij had gemaakt. God zegende de zevende dag en heiligde die."',
                },
                comment: {
                  en: "Rest is not an afterthought — it is built into the very structure of creation. God modelled the rhythm before he commanded it. Sabbath is not recovery from failure; it is the completion of faithfulness.",
                  id: "Istirahat bukan renungan setelahnya — itu dibangun ke dalam struktur ciptaan itu sendiri. Allah memodelkan ritme sebelum Ia memerintahkannya. Sabat bukan pemulihan dari kegagalan; itu adalah penyelesaian kesetiaan.",
                  nl: "Rust is geen nagedachte — het is ingebouwd in de structuur van de schepping zelf. God modelleerde het ritme voor hij het gebood. Sabbat is geen herstel van falen; het is de voltooiing van trouw.",
                },
              },
              {
                ref: "Matthew 11:28–30",
                verse: {
                  en: '"Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls."',
                  id: '"Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu. Pikullah kuk yang Kupasang dan belajarlah pada-Ku, karena Aku lemah lembut dan rendah hati dan jiwamu akan mendapat ketenangan."',
                  nl: '"Kom naar mij, jullie die vermoeid zijn en onder lasten gebukt gaan, dan zal ik jullie rust geven. Neem mijn juk op je en leer van mij, want ik ben zachtmoedig en nederig van hart. Dan zullen jullie werkelijk rust vinden."',
                },
                comment: {
                  en: "Jesus offers not an escape from work but a different quality of engagement with it. The yoke of Christ is not weight-free — but it is a weight carried in partnership with him, not alone. This is the soul-rest that sustains long ministry.",
                  id: "Yesus menawarkan bukan pelarian dari pekerjaan tetapi kualitas keterlibatan yang berbeda dengannya. Kuk Kristus tidak bebas beban — tetapi itu adalah beban yang dibawa dalam kemitraan dengan-Nya, tidak sendirian.",
                  nl: "Jezus biedt geen vlucht uit het werk maar een andere kwaliteit van betrokkenheid daarmee. Het juk van Christus is niet gewichtloos — maar het is een last die gedragen wordt in partnerschap met hem, niet alleen.",
                },
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <p style={{ color: orange, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{item.ref}</p>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, fontStyle: "italic", color: offWhite, lineHeight: 1.6, marginBottom: 16 }}>{item.verse[lang]}</p>
                <p style={{ fontSize: 15, color: "oklch(78% 0.03 80)", lineHeight: 1.75, margin: 0 }}>{item.comment[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategies */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("5 Strategies for Sustainable Rhythm", "5 Strategi untuk Ritme Berkelanjutan", "5 Strategieën voor een Duurzaam Ritme")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STRATEGIES.map((s, i) => (
              <div key={i} style={{ background: lightGray, padding: "24px 28px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>{lang === "en" ? s.en : lang === "id" ? s.id : s.nl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REFLECTION.map((q) => (
              <div key={q.roman} style={{ background: offWhite, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{lang === "en" ? q.en : lang === "id" ? q.id : q.nl}</p>
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
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
