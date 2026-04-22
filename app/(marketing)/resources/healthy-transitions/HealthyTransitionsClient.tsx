"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ─── VERSE DATA ──────────────────────────────────────────────────────────────

const VERSES = {
  "luke-24-17": {
    en_ref: "Luke 24:17",
    id_ref: "Lukas 24:17",
    nl_ref: "Lucas 24:17",
    en: "'What are you discussing together as you walk along?' They stood still, their faces downcast.",
    id: "'Apakah yang kamu percakapkan sementara kamu berjalan?' Dan mereka berhenti dengan muka muram.",
    nl: "'Waar lopen jullie toch over te praten?' Ze bleven staan, met sombere gezichten.",
  },
  "ruth-1-16": {
    en_ref: "Ruth 1:16",
    id_ref: "Rut 1:16",
    nl_ref: "Ruth 1:16",
    en: "But Ruth replied, 'Don't urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay.'",
    id: "Tetapi kata Rut: 'Janganlah desak aku meninggalkan engkau dan pulang dengan tidak membawamu, sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam.'",
    nl: "Maar Rut antwoordde: 'Vraag me toch niet langer u te verlaten en terug te gaan, want waar u gaat, zal ik gaan, en waar u blijft, zal ik blijven.'",
  },
};

// ─── RAFT STEPS ──────────────────────────────────────────────────────────────

const RAFT_STEPS = [
  {
    letter: "R",
    en_title: "Reconciliation",
    id_title: "Rekonsiliasi",
    nl_title: "Verzoening",
    en_tagline: "Straighten out what is strained before you leave.",
    id_tagline: "Perbaiki hubungan yang tegang sebelum Anda pergi.",
    nl_tagline: "Herstel wat gespannen is voordat je vertrekt.",
    en_body: `You don't have to fix everything. You don't have to resolve every misunderstanding or win every argument. But you do need to seek peace where peace is possible. Leaving without doing so carries the weight of those broken threads into your next season — and into the next team that receives you.`,
    id_body: `Anda tidak perlu memperbaiki segalanya. Tidak perlu menyelesaikan setiap kesalahpahaman atau memenangkan setiap argumen. Tetapi Anda perlu mencari perdamaian di mana perdamaian dimungkinkan. Pergi tanpa melakukan hal ini membawa beban hubungan yang putus ke musim berikutnya — dan ke tim berikutnya yang menerima Anda.`,
    nl_body: `Je hoeft niet alles op te lossen. Je hoeft niet elk misverstand recht te zetten of elk argument te winnen. Maar je moet vrede zoeken waar vrede mogelijk is. Vertrekken zonder dit te doen draagt het gewicht van die gebroken draden mee naar je volgende seizoen — en naar het volgende team dat je ontvangt.`,
    en_how: [
      "Name the relationship that is strained — don't avoid it.",
      "Initiate contact. You go first, even if you're not sure you were wrong.",
      "Say: \"Before I leave, I want to make sure there's nothing unresolved between us.\"",
      "If the other person refuses reconciliation — that is theirs to carry. You can only be responsible for your own step toward peace.",
    ],
    id_how: [
      "Namai hubungan yang tegang — jangan hindari.",
      "Ambil inisiatif. Anda yang pertama melangkah, meskipun Anda tidak yakin apakah Anda yang salah.",
      "Katakan: \"Sebelum saya pergi, saya ingin memastikan tidak ada yang belum terselesaikan di antara kita.\"",
      "Jika orang lain menolak rekonsiliasi — itu menjadi tanggung jawab mereka. Anda hanya bertanggung jawab atas langkah Anda sendiri menuju perdamaian.",
    ],
    nl_how: [
      "Benoem de relatie die gespannen is — ga er niet omheen.",
      "Neem het initiatief. Jij gaat als eerste, ook als je niet zeker weet of jij fout was.",
      "Zeg: 'Voordat ik vertrek, wil ik zeker weten dat er niets onopgelost is tussen ons.'",
      "Als de ander verzoening weigert — dat is hun last om te dragen. Je bent alleen verantwoordelijk voor je eigen stap richting vrede.",
    ],
  },
  {
    letter: "A",
    en_title: "Affirmation",
    id_title: "Peneguhan",
    nl_title: "Bevestiging",
    en_tagline: "Intentionally honour those who shaped you.",
    id_tagline: "Dengan sengaja hargai mereka yang membentuk Anda.",
    nl_tagline: "Eer bewust degenen die jou gevormd hebben.",
    en_body: `Most people leave without ever telling the people who mattered most what they meant. An affirmation is not flattery — it is a deliberate act of closing an emotional loop. It says: I saw you. You shaped me. That will not be forgotten.`,
    id_body: `Kebanyakan orang pergi tanpa pernah memberitahu orang-orang yang paling berarti tentang apa artinya mereka. Peneguhan bukan sanjungan — itu adalah tindakan yang disengaja untuk menutup lingkaran emosional. Ini berkata: Saya melihat Anda. Anda membentuk saya. Itu tidak akan terlupakan.`,
    nl_body: `De meeste mensen vertrekken zonder ooit te vertellen aan de mensen die het meest betekenden wat ze voor hen betekenden. Een bevestiging is geen vleierij — het is een bewuste daad van het sluiten van een emotionele lus. Het zegt: ik zag je. Je hebt me gevormd. Dat zal niet vergeten worden.`,
    en_how: [
      "Make a list of 5–10 people who have shaped you in this season.",
      "Be specific — not \"you were such a support\" but \"when you stayed with me through that crisis in September, it changed me.\"",
      "Deliver it in a way that fits the relationship: a handwritten note, a face-to-face conversation, a voice message.",
      "Create a small ritual: a meal, a walk, a gathering — something your body and theirs will remember.",
    ],
    id_how: [
      "Buat daftar 5–10 orang yang telah membentuk Anda di musim ini.",
      "Jadilah spesifik — bukan 'kamu sangat mendukung' tetapi 'ketika kamu tetap bersamaku melalui krisis September itu, itu mengubahku.'",
      "Sampaikan dengan cara yang sesuai dengan hubungan: catatan tulisan tangan, percakapan langsung, pesan suara.",
      "Ciptakan ritual kecil: makan bersama, jalan-jalan, pertemuan — sesuatu yang akan diingat oleh tubuh Anda dan mereka.",
    ],
    nl_how: [
      "Maak een lijst van 5–10 mensen die jou dit seizoen hebben gevormd.",
      "Wees specifiek — niet 'je was zo'n steun' maar 'toen je in september bij me bleef door die crisis, veranderde dat mij.'",
      "Lever het op een manier die past bij de relatie: een handgeschreven briefje, een persoonlijk gesprek, een voice-bericht.",
      "Creëer een klein ritueel: een maaltijd, een wandeling, een bijeenkomst — iets wat jouw lichaam en dat van hen zal onthouden.",
    ],
  },
  {
    letter: "F",
    en_title: "Farewells",
    id_title: "Perpisahan",
    nl_title: "Afscheid",
    en_tagline: "Say goodbye to people, places, and even things.",
    id_tagline: "Ucapkan selamat tinggal kepada orang, tempat, bahkan benda.",
    nl_tagline: "Neem afscheid van mensen, plekken en zelfs dingen.",
    en_body: `Grief that is not expressed does not disappear. Uncried tears become emotional baggage. You carry them into the next place and wonder why you feel heavy there. Farewells create a container for grief — they say: this mattered, and now it is changing. Grief is the proof that something was real.`,
    id_body: `Kesedihan yang tidak diungkapkan tidak hilang. Air mata yang tidak ditangiskan menjadi beban emosional. Anda membawanya ke tempat berikutnya dan bertanya-tanya mengapa Anda merasa berat di sana. Perpisahan menciptakan wadah untuk kesedihan — mereka berkata: ini penting, dan sekarang ini berubah. Duka adalah bukti bahwa sesuatu itu nyata.`,
    nl_body: `Verdriet dat niet wordt uitgedrukt verdwijnt niet. Niet gehuilede tranen worden emotionele bagage. Je draagt ze mee naar de volgende plek en vraagt je af waarom je je daar zwaar voelt. Afscheid neemt schept een container voor verdriet — het zegt: dit deed ertoe, en nu verandert het. Rouw is het bewijs dat iets echt was.`,
    en_how: [
      "Visit places that hold meaning — a favourite café, the office, a neighbourhood where you walked and prayed.",
      "Allow yourself to feel the sadness. Don't spiritualise it away with \"God has something better.\" That may be true — and grief is also valid.",
      "Say goodbye to objects and possessions where appropriate — belongings you are leaving behind carry memory.",
      "Give children and young people on your team their own age-appropriate farewell rituals — don't rush them through.",
    ],
    id_how: [
      "Kunjungi tempat-tempat yang bermakna — kafe favorit, kantor, lingkungan tempat Anda berjalan dan berdoa.",
      "Izinkan diri Anda merasakan kesedihan. Jangan spiritualisasi dengan 'Tuhan punya sesuatu yang lebih baik.' Itu mungkin benar — dan duka juga sah.",
      "Ucapkan selamat tinggal pada benda-benda dan milik di mana sesuai — barang bawaan yang Anda tinggalkan membawa kenangan.",
      "Berikan anak-anak dan orang muda di tim Anda ritual perpisahan yang sesuai usia mereka sendiri — jangan terburu-buru.",
    ],
    nl_how: [
      "Bezoek plekken die betekenis dragen — een favoriete koffietent, het kantoor, een wijk waar je liep en bad.",
      "Laat jezelf het verdriet voelen. Spiritualiseer het niet weg met 'God heeft iets beters.' Dat kan waar zijn — en rouw is ook geldig.",
      "Neem waar gepast afscheid van voorwerpen en bezittingen — spullen die je achterlaat dragen herinneringen.",
      "Geef kinderen en jongeren in je team hun eigen leeftijdsgeschikte afscheidsrituelen — haast hen er niet doorheen.",
    ],
  },
  {
    letter: "T",
    en_title: "Think Ahead",
    id_title: "Persiapkan Masa Depan",
    nl_title: "Vooruitdenken",
    en_tagline: "Prepare mentally and practically for what comes next.",
    id_tagline: "Persiapkan diri secara mental dan praktis untuk apa yang akan datang.",
    nl_tagline: "Bereid je mentaal en praktisch voor op wat komen gaat.",
    en_body: `Most people skip this step. They are so focused on closing out the current season that they arrive in the new one completely unprepared — and then wonder why they feel lost. The chaos stage of transition is real and predictable. Planning for it before it arrives changes everything.`,
    id_body: `Kebanyakan orang melewati langkah ini. Mereka begitu fokus pada penutupan musim saat ini sehingga mereka tiba di musim baru dengan sama sekali tidak siap — dan kemudian bertanya-tanya mengapa mereka merasa tersesat. Tahap kekacauan transisi adalah nyata dan dapat diprediksi. Merencanakannya sebelum datang mengubah segalanya.`,
    nl_body: `De meeste mensen slaan deze stap over. Ze zijn zo gefocust op het afsluiten van het huidige seizoen dat ze volkomen onvoorbereid in het nieuwe aankomen — en dan afvragen waarom ze zich verloren voelen. De chaosfase van transitie is echt en voorspelbaar. Er voor plannen voordat het aankomt verandert alles.`,
    en_how: [
      "Research your new context before you arrive — culture, pace of life, communication styles, what is normal.",
      "Identify your first safe anchor: one relationship, one community, one rhythm you can build around immediately.",
      "Tell yourself in advance: the first 3–6 months will feel disorienting. This is normal. It does not mean you made the wrong choice.",
      "Build in a formal debrief or check-in with someone you trust at the 3-month mark — not to fix everything, but to name what you are experiencing.",
    ],
    id_how: [
      "Teliti konteks baru Anda sebelum tiba — budaya, tempo hidup, gaya komunikasi, apa yang normal.",
      "Identifikasi jangkar aman pertama Anda: satu hubungan, satu komunitas, satu ritme yang bisa Anda bangun segera.",
      "Beritahu diri sendiri terlebih dahulu: 3–6 bulan pertama akan terasa membingungkan. Ini normal. Ini tidak berarti Anda membuat pilihan yang salah.",
      "Rencanakan debriefing formal atau check-in dengan seseorang yang Anda percaya pada tanda 3 bulan — bukan untuk memperbaiki segalanya, tetapi untuk menamai apa yang Anda alami.",
    ],
    nl_how: [
      "Onderzoek je nieuwe context voordat je aankomt — cultuur, levenstempo, communicatiestijlen, wat normaal is.",
      "Identificeer je eerste veilige anker: één relatie, één gemeenschap, één ritme waaromheen je meteen kunt bouwen.",
      "Zeg jezelf van tevoren: de eerste 3–6 maanden zullen desoriënterend aanvoelen. Dit is normaal. Het betekent niet dat je de verkeerde keuze hebt gemaakt.",
      "Plan een formele debriefing of check-in met iemand die je vertrouwt op de 3-maandsgrens — niet om alles op te lossen, maar om te benoemen wat je ervaart.",
    ],
  },
];

// ─── TRANSITION PHASES ───────────────────────────────────────────────────────

const TRANSITION_PHASES = [
  {
    en_phase: "Departure",
    id_phase: "Kepergian",
    nl_phase: "Vertrek",
    en_description: "The final weeks before leaving. Often marked by a mix of grief, excitement, and productivity collapse. Relationships intensify. Unresolved things surface.",
    id_description: "Minggu-minggu terakhir sebelum pergi. Sering ditandai dengan campuran duka, kegembiraan, dan kemerosotan produktivitas. Hubungan menguat. Hal-hal yang belum terselesaikan muncul ke permukaan.",
    nl_description: "De laatste weken voor vertrek. Vaak gekenmerkt door een mix van verdriet, opwinding en productiviteitsinstorting. Relaties intensiveren. Onopgeloste zaken komen naar de oppervlakte.",
  },
  {
    en_phase: "Chaos",
    id_phase: "Kekacauan",
    nl_phase: "Chaos",
    en_description: "The first weeks to months in the new context. Disorientation, cognitive overload, emotional flatness. Everything requires effort. Simple tasks feel hard. This is normal — and temporary.",
    id_description: "Minggu hingga bulan pertama dalam konteks baru. Disorientasi, kelebihan beban kognitif, kelesuan emosional. Segalanya membutuhkan usaha. Tugas sederhana terasa sulit. Ini normal — dan sementara.",
    nl_description: "De eerste weken tot maanden in de nieuwe context. Desoriëntatie, cognitieve overbelasting, emotionele vlakheid. Alles kost moeite. Eenvoudige taken voelen zwaar aan. Dit is normaal — en tijdelijk.",
  },
  {
    en_phase: "Adjustment",
    id_phase: "Penyesuaian",
    nl_phase: "Aanpassing",
    en_description: "Slowly, patterns form. The new context starts to make sense. You find rhythms, relationships begin to root. You stop comparing everything to what came before.",
    id_description: "Perlahan-lahan, pola terbentuk. Konteks baru mulai masuk akal. Anda menemukan ritme, hubungan mulai berakar. Anda berhenti membandingkan segalanya dengan yang datang sebelumnya.",
    nl_description: "Langzaam vormen zich patronen. De nieuwe context begint logisch te worden. Je vindt ritmes, relaties beginnen te wortelen. Je stopt met alles te vergelijken met wat eerder was.",
  },
  {
    en_phase: "Reattachment",
    id_phase: "Keterlibatan Kembali",
    nl_phase: "Herverbinding",
    en_description: "You belong again. Not the same as before — differently. You have integrated the loss and the new beginning. You can give yourself fully to where you are.",
    id_description: "Anda memiliki rasa memiliki kembali. Tidak sama seperti sebelumnya — dengan cara yang berbeda. Anda telah mengintegrasikan kehilangan dan awal baru. Anda bisa memberikan diri sepenuhnya untuk di mana Anda berada.",
    nl_description: "Je hoort er weer bij. Niet hetzelfde als voorheen — anders. Je hebt het verlies en het nieuwe begin geïntegreerd. Je kunt jezelf volledig geven aan waar je bent.",
  },
];

// ─── RAFT PLANNER PROMPTS ─────────────────────────────────────────────────────

const PLANNER_PROMPTS = [
  {
    letter: "R",
    en_question: "Is there a relationship I am leaving with unresolved tension? What would one step toward reconciliation look like — even if the outcome is uncertain?",
    id_question: "Apakah ada hubungan yang saya tinggalkan dengan ketegangan yang belum terselesaikan? Seperti apa satu langkah menuju rekonsiliasi — bahkan jika hasilnya tidak pasti?",
    nl_question: "Is er een relatie die ik met onopgeloste spanning achterlaat? Hoe zou één stap richting verzoening eruitzien — ook als de uitkomst onzeker is?",
  },
  {
    letter: "A",
    en_question: "Who are the 3–5 people I most want to affirm before I leave? What specific thing did they do or say that I want to honour?",
    id_question: "Siapa 3–5 orang yang paling ingin saya teguhkan sebelum saya pergi? Apa hal spesifik yang mereka lakukan atau katakan yang ingin saya hargai?",
    nl_question: "Wie zijn de 3–5 mensen die ik het meest wil bevestigen voor ik vertrek? Welk specifiek ding deden of zeiden ze wat ik wil eren?",
  },
  {
    letter: "F",
    en_question: "What places, routines, or relationships will I grieve the most? Have I allowed myself space to feel that — or have I been rushing past it?",
    id_question: "Tempat, rutinitas, atau hubungan apa yang paling saya rindukan? Apakah saya sudah memberikan diri sendiri ruang untuk merasakannya — atau apakah saya telah terburu-buru melewatinya?",
    nl_question: "Welke plekken, routines of relaties zal ik het meest missen? Heb ik mezelf ruimte gegeven om dat te voelen — of ben ik er snel overheen gegaan?",
  },
  {
    letter: "T",
    en_question: "What do I know about the new context I am entering? What is my plan for the first 90 days — and who will I check in with at the 3-month mark?",
    id_question: "Apa yang saya ketahui tentang konteks baru yang saya masuki? Apa rencana saya untuk 90 hari pertama — dan dengan siapa saya akan check-in pada tanda 3 bulan?",
    nl_question: "Wat weet ik over de nieuwe context die ik betreedt? Wat is mijn plan voor de eerste 90 dagen — en met wie zal ik inchecken op de 3-maandsgrens?",
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

type Props = { userPathway: string | null; isSaved: boolean };

export default function HealthyTransitionsClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeRaft, setActiveRaft] = useState<number | null>(null);
  const [plannerAnswers, setPlannerAnswers] = useState(["", "", "", ""]);
  const [plannerSubmitted, setPlannerSubmitted] = useState(false);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("healthy-transitions");
      setSaved(true);
    });
  }

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
          fontSize: "inherit", padding: 0, textDecoration: "underline dotted",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </button>
    );
  }

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  const allPlannerFilled = plannerAnswers.every((a) => a.trim().length > 0);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>

      {/* Language bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "4px 14px", border: "none", cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
              background: lang === l ? navy : "transparent",
              color: lang === l ? offWhite : bodyText,
              borderRadius: 3,
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Cross-Cultural Leadership · Personal Development", "Kepemimpinan Lintas Budaya · Pengembangan Diri", "Intercultureel Leiderschap · Persoonlijke Ontwikkeling")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, color: offWhite, margin: "0 auto 32px", lineHeight: 1.15, fontStyle: "italic" }}>
            {t("Healthy Transitions", "Transisi yang Sehat", "Gezonde Transities")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.3vw, 22px)", color: "oklch(82% 0.025 80)", lineHeight: 1.8, marginBottom: 48, fontStyle: "italic", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Most people don't leave well. They disappear — into the busyness of packing, the relief of finishing, the anxiety of what's next. The relationships they leave behind carry the unfinished weight for years. The RAFT model exists because transitions done poorly leave lasting damage. Transitions done well set you — and everyone you leave behind — free.",
              "Kebanyakan orang tidak pergi dengan baik. Mereka menghilang — ke dalam kesibukan mengemas, lega karena selesai, kecemasan tentang apa selanjutnya. Hubungan yang mereka tinggalkan menanggung beban yang belum selesai selama bertahun-tahun. Model RAFT ada karena transisi yang dilakukan dengan buruk meninggalkan kerusakan yang bertahan lama. Transisi yang dilakukan dengan baik membebaskan Anda — dan semua orang yang Anda tinggalkan.",
              "De meeste mensen vertrekken niet goed. Ze verdwijnen — in de drukte van inpakken, de opluchting van het afronden, de angst voor wat komen gaat. De relaties die ze achterlaten dragen het onafgemaakte gewicht jarenlang. Het RAFT-model bestaat omdat slecht uitgevoerde transities blijvende schade aanrichten. Goed uitgevoerde transities bevrijden jou — en iedereen die je achterlaat."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "12px 28px", border: "none",
                cursor: saved ? "default" : "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                background: saved ? "oklch(35% 0.05 260)" : orange,
                color: offWhite, letterSpacing: "0.04em", borderRadius: 4,
              }}
            >
              {saved
                ? t("Saved to Dashboard", "Tersimpan di Dasbor", "Opgeslagen in Dashboard")
                : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
            </button>
            <Link
              href="/resources"
              style={{
                padding: "12px 28px", border: "1px solid oklch(45% 0.05 260)",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                color: "oklch(78% 0.03 80)", textDecoration: "none", borderRadius: 4,
              }}
            >
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </div>

      {/* Section I: The Hard Truth */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("I. The Reality", "I. Realitas", "I. De Realiteit")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("Transitions Done Poorly Cost More Than You Know", "Transisi yang Dilakukan dengan Buruk Merugikan Lebih dari yang Anda Tahu", "Slecht Uitgevoerde Transities Kosten Meer dan Je Beseft")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "Cross-cultural leaders move frequently. They leave teams, countries, roles, and communities more often than almost anyone else in their field. And yet most organisations and most people treat the leaving as an afterthought — something to survive, not something to do with care.",
              "Pemimpin lintas budaya sering berpindah. Mereka meninggalkan tim, negara, peran, dan komunitas lebih sering dari hampir siapa pun di bidangnya. Namun sebagian besar organisasi dan kebanyakan orang memperlakukan kepergian sebagai hal yang tidak penting — sesuatu untuk ditanggung, bukan sesuatu yang harus dilakukan dengan penuh perhatian.",
              "Interculturele leiders verhuizen vaak. Ze verlaten teams, landen, rollen en gemeenschappen vaker dan bijna iedereen in hun vakgebied. Toch behandelen de meeste organisaties en de meeste mensen het vertrek als bijzaak — iets om te overleven, niet iets om zorgvuldig te doen."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "Research on missionary attrition and cross-cultural departure consistently finds the same pattern: the way people leave predicts how they arrive in the next place. Leaders who leave without reconciling unresolved conflict bring that conflict into new teams. Those who never grieve a leaving arrive emotionally numb in the next community. Those who don't prepare for the chaos of re-entry are blindsided by how disorienting it is.",
              "Penelitian tentang atrisi misionaris dan kepergian lintas budaya secara konsisten menemukan pola yang sama: cara orang pergi memprediksi bagaimana mereka tiba di tempat berikutnya. Pemimpin yang pergi tanpa menyelesaikan konflik yang belum terselesaikan membawa konflik itu ke tim baru. Mereka yang tidak pernah berduka atas kepergian tiba secara emosional mati rasa di komunitas berikutnya. Mereka yang tidak mempersiapkan diri menghadapi kekacauan kepulangan terkejut betapa mengganggu itu.",
              "Onderzoek naar missionaris-attrition en intercultureel vertrek vindt consequent hetzelfde patroon: de manier waarop mensen vertrekken voorspelt hoe ze op de volgende plek aankomen. Leiders die vertrekken zonder onopgelost conflict te verzoenen, brengen dat conflict mee naar nieuwe teams. Degenen die nooit rouwen om een vertrek, komen emotioneel gevoelloos aan in de volgende gemeenschap. Degenen die zich niet voorbereiden op de chaos van terugkeer, worden verrast door hoe desoriënterend het is."
            )}
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`, marginBottom: 28 }}>
            {t(
              "A healthy transition is not about making the leaving comfortable. It is about being fully present to the ending — so you can be fully present to the beginning.",
              "Transisi yang sehat bukan tentang membuat kepergian menjadi nyaman. Ini tentang hadir sepenuhnya pada akhir — sehingga Anda bisa hadir sepenuhnya pada awal.",
              "Een gezonde transitie gaat niet over het aangenaam maken van het vertrek. Het gaat over volledig aanwezig zijn bij het einde — zodat je volledig aanwezig kunt zijn bij het begin."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "David Pollock, who spent decades working with cross-cultural families, developed the RAFT model as a practical framework for doing the emotional and relational work of leaving well. The four letters each name a domain of work that most leaders neglect. None of them require extraordinary courage. They require intention.",
              "David Pollock, yang menghabiskan beberapa dekade bekerja dengan keluarga lintas budaya, mengembangkan model RAFT sebagai kerangka praktis untuk melakukan pekerjaan emosional dan relasional dalam pergi dengan baik. Keempat huruf masing-masing menamai domain pekerjaan yang diabaikan oleh kebanyakan pemimpin. Tidak ada yang memerlukan keberanian luar biasa. Mereka memerlukan niat.",
              "David Pollock, die tientallen jaren werkte met interculturele families, ontwikkelde het RAFT-model als een praktisch kader voor het doen van het emotionele en relationele werk van goed vertrekken. De vier letters benoemen elk een werkdomein dat de meeste leiders verwaarlozen. Geen van hen vereist buitengewone moed. Ze vereisen intentie."
            )}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section II: The RAFT Model — interactive journey */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center" }}>
            {t("II. The Framework", "II. Kerangka Kerja", "II. Het Kader")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("The RAFT Model", "Model RAFT", "Het RAFT-model")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 64, textAlign: "center", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Four domains of relational and emotional work. Each builds on the previous. Together they make it possible to leave well.",
              "Empat domain pekerjaan relasional dan emosional. Masing-masing dibangun di atas yang sebelumnya. Bersama-sama mereka memungkinkan kepergian yang baik.",
              "Vier domeinen van relationeel en emotioneel werk. Elk bouwt voort op het vorige. Samen maken ze het mogelijk om goed te vertrekken."
            )}
          </p>

          {/* RAFT step selector */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
            {RAFT_STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveRaft(activeRaft === i ? null : i)}
                style={{
                  width: 72, height: 72, border: "none", cursor: "pointer",
                  borderRadius: "50%",
                  background: activeRaft === i ? orange : navy,
                  color: offWhite,
                  fontFamily: serif,
                  fontSize: 32, fontWeight: 700, fontStyle: "italic",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                {step.letter}
              </button>
            ))}
          </div>

          {/* RAFT step labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 64, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            {RAFT_STEPS.map((step, i) => (
              <p key={i} style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                color: activeRaft === i ? orange : bodyText,
                letterSpacing: "0.05em", textAlign: "center", margin: 0,
                textTransform: "uppercase",
              }}>
                {lang === "en" ? step.en_title : lang === "id" ? step.id_title : step.nl_title}
              </p>
            ))}
          </div>

          {/* Active RAFT step content */}
          {activeRaft === null ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, fontStyle: "italic", lineHeight: 1.8 }}>
                {t(
                  "Select a letter above to explore each step of the RAFT journey.",
                  "Pilih huruf di atas untuk menjelajahi setiap langkah perjalanan RAFT.",
                  "Selecteer een letter hierboven om elke stap van de RAFT-reis te verkennen."
                )}
              </p>
            </div>
          ) : (
            <div style={{ background: offWhite, borderRadius: 8, padding: "48px 48px 40px", boxShadow: "0 2px 24px oklch(20% 0.05 260 / 0.07)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 36 }}>
                <div style={{ fontFamily: serif, fontSize: "clamp(56px, 7vw, 80px)", fontWeight: 700, color: orange, lineHeight: 1, flexShrink: 0, fontStyle: "italic" }}>
                  {RAFT_STEPS[activeRaft].letter}
                </div>
                <div>
                  <h3 style={{ fontFamily: serif, fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 700, color: navy, fontStyle: "italic", margin: "0 0 10px" }}>
                    {lang === "en"
                      ? RAFT_STEPS[activeRaft].en_title
                      : lang === "id"
                      ? RAFT_STEPS[activeRaft].id_title
                      : RAFT_STEPS[activeRaft].nl_title}
                  </h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: orange, letterSpacing: "0.04em", margin: 0 }}>
                    {lang === "en"
                      ? RAFT_STEPS[activeRaft].en_tagline
                      : lang === "id"
                      ? RAFT_STEPS[activeRaft].id_tagline
                      : RAFT_STEPS[activeRaft].nl_tagline}
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9, marginBottom: 36 }}>
                {lang === "en"
                  ? RAFT_STEPS[activeRaft].en_body
                  : lang === "id"
                  ? RAFT_STEPS[activeRaft].id_body
                  : RAFT_STEPS[activeRaft].nl_body}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: navy, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
                {t("How to do it", "Cara melakukannya", "Hoe het te doen")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {(lang === "en"
                  ? RAFT_STEPS[activeRaft].en_how
                  : lang === "id"
                  ? RAFT_STEPS[activeRaft].id_how
                  : RAFT_STEPS[activeRaft].nl_how
                ).map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: orange,
                      color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 12,
                      fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              {/* Navigation between steps */}
              <div style={{ display: "flex", gap: 12, marginTop: 40, justifyContent: "flex-end" }}>
                {activeRaft > 0 && (
                  <button
                    onClick={() => setActiveRaft(activeRaft - 1)}
                    style={{ padding: "10px 22px", background: "transparent", border: `1px solid oklch(80% 0.01 80)`, borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: bodyText, cursor: "pointer", letterSpacing: "0.04em" }}
                  >
                    ← {lang === "en" ? RAFT_STEPS[activeRaft - 1].en_title : lang === "id" ? RAFT_STEPS[activeRaft - 1].id_title : RAFT_STEPS[activeRaft - 1].nl_title}
                  </button>
                )}
                {activeRaft < RAFT_STEPS.length - 1 && (
                  <button
                    onClick={() => setActiveRaft(activeRaft + 1)}
                    style={{ padding: "10px 22px", background: navy, border: "none", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: offWhite, cursor: "pointer", letterSpacing: "0.04em" }}
                  >
                    {lang === "en" ? RAFT_STEPS[activeRaft + 1].en_title : lang === "id" ? RAFT_STEPS[activeRaft + 1].id_title : RAFT_STEPS[activeRaft + 1].nl_title} →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section III: Transition Phases */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("III. The Curve", "III. Kurva Transisi", "III. De Curve")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("What to Expect in the Middle", "Apa yang Diharapkan di Tengah Perjalanan", "Wat te Verwachten in het Midden")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 56 }}>
          {t(
            "Knowing the curve doesn't make it easy. But it makes it less frightening — because you can name what is happening rather than being swallowed by it.",
            "Mengetahui kurva tidak membuatnya mudah. Tetapi itu membuatnya kurang menakutkan — karena Anda bisa menamai apa yang terjadi daripada ditelan olehnya.",
            "De curve kennen maakt het niet gemakkelijk. Maar het maakt het minder angstaanjagend — omdat je kunt benoemen wat er gebeurt in plaats van erdoor opgeslokt te worden."
          )}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {TRANSITION_PHASES.map((phase, i) => (
            <div key={i} style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
              {/* Left: number + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 32, flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: i === 1 ? orange : navy,
                  color: offWhite, fontFamily: serif, fontSize: 22, fontWeight: 700,
                  fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                {i < TRANSITION_PHASES.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: "oklch(88% 0.01 80)", minHeight: 40, margin: "8px 0" }} />
                )}
              </div>
              {/* Right: content */}
              <div style={{ paddingBottom: i < TRANSITION_PHASES.length - 1 ? 48 : 0 }}>
                <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.3vw, 26px)", fontWeight: 700, color: i === 1 ? orange : navy, fontStyle: "italic", marginBottom: 12, lineHeight: 1.3 }}>
                  {lang === "en" ? phase.en_phase : lang === "id" ? phase.id_phase : phase.nl_phase}
                </h3>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                  {lang === "en" ? phase.en_description : lang === "id" ? phase.id_description : phase.nl_description}
                </p>
                {i === 1 && (
                  <div style={{ marginTop: 16, padding: "14px 20px", background: "oklch(93% 0.012 65)", borderRadius: 4, borderLeft: `3px solid ${orange}` }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "oklch(44% 0.08 50)", margin: 0 }}>
                      {t(
                        "This is the stage most people mistake for failure. It is not. It is the cost of having left something real.",
                        "Ini adalah tahap yang paling banyak orang salah kira sebagai kegagalan. Bukan begitu. Ini adalah harga meninggalkan sesuatu yang nyata.",
                        "Dit is de fase die de meeste mensen aanzien voor mislukking. Dat is het niet. Het is de prijs van het verlaten van iets echts."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section IV: Cross-Cultural Notes — Reverse Culture Shock */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("IV. Cross-Cultural Dimension", "IV. Dimensi Lintas Budaya", "IV. Interculturele Dimensie")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("Reverse Culture Shock Is the Harder One", "Gegar Budaya Terbalik Adalah yang Lebih Berat", "Omgekeerde Cultuurschok Is de Zwaardere")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9 }}>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Forward culture shock — arriving in a new country — is widely understood. You expect it. People around you name it. There is social permission to struggle.",
                "Gegar budaya maju — tiba di negara baru — sudah banyak dipahami. Anda mengharapkannya. Orang-orang di sekitar Anda menamakannya. Ada izin sosial untuk berjuang.",
                "Voorwaartse cultuurschok — aankomen in een nieuw land — is breed begrepen. Je verwacht het. Mensen om je heen benoemen het. Er is sociale toestemming om te worstelen."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Reverse culture shock — returning to your home culture after an extended cross-cultural assignment — is harder precisely because it is unexpected. You expect home to feel like home. Instead, it feels foreign. Your humour doesn't land. Your references confuse people. The pace feels wrong. The conversations feel shallow. And there is almost no social permission to name this — because you are home.",
                "Gegar budaya terbalik — kembali ke budaya asal Anda setelah penugasan lintas budaya yang panjang — lebih berat tepat karena tidak terduga. Anda mengharapkan rumah terasa seperti rumah. Sebaliknya, itu terasa asing. Humor Anda tidak mendarat. Referensi Anda membingungkan orang. Temponya terasa salah. Percakapannya terasa dangkal. Dan hampir tidak ada izin sosial untuk menamakannya — karena Anda sudah di rumah.",
                "Omgekeerde cultuurschok — terugkeren naar je thuiscultuur na een langdurige interculturele opdracht — is zwaarder juist omdat het onverwacht is. Je verwacht dat thuis als thuis aanvoelt. In plaats daarvan voelt het vreemd. Je humor landt niet. Je referenties verwarren mensen. Het tempo voelt verkeerd. De gesprekken voelen oppervlakkig. En er is bijna geen sociale toestemming om dit te benoemen — omdat je thuis bent."
              )}
            </p>
            <div style={{ background: "oklch(18% 0.09 260)", padding: "32px 36px", borderRadius: 6, marginBottom: 28 }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: offWhite, lineHeight: 1.8, marginBottom: 12 }}>
                {t(
                  "\"I expected to struggle in Thailand. I did not expect to struggle in the Netherlands. But I've been back for eight months and I still feel like a foreigner at my own family dinner table.\"",
                  "\"Saya mengharapkan berjuang di Thailand. Saya tidak mengharapkan berjuang di Belanda. Tapi saya sudah kembali selama delapan bulan dan saya masih merasa seperti orang asing di meja makan keluarga saya sendiri.\"",
                  "\"Ik verwachtte het moeilijk te hebben in Thailand. Ik verwachtte het niet moeilijk te hebben in Nederland. Maar ik ben al acht maanden terug en ik voel me nog steeds een vreemdeling aan mijn eigen familietafel.\""
                )}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
                {t("— Cross-cultural leader, on re-entry after 7 years", "— Pemimpin lintas budaya, tentang kepulangan setelah 7 tahun", "— Interculturele leider, over terugkeer na 7 jaar")}
              </p>
            </div>
            <p style={{ marginBottom: 28 }}>
              {t(
                "This is the re-entry myth: the belief that going home will be easy. In reality, the people who knew you left in a different form than the one that returned. You have changed. They have changed. The relationship has to be renegotiated. This takes time, and it takes the same RAFT work that applies to any other transition.",
                "Ini adalah mitos kepulangan: keyakinan bahwa pulang ke rumah akan mudah. Pada kenyataannya, orang-orang yang mengenal Anda pergi dalam bentuk yang berbeda dari yang kembali. Anda telah berubah. Mereka telah berubah. Hubungan harus dinegosiasikan ulang. Ini membutuhkan waktu, dan membutuhkan pekerjaan RAFT yang sama yang berlaku untuk transisi lainnya.",
                "Dit is de terugkeermythe: het geloof dat naar huis gaan gemakkelijk zal zijn. In werkelijkheid zijn de mensen die jou kenden gegaan in een andere vorm dan die terugkwam. Je bent veranderd. Zij zijn veranderd. De relatie moet opnieuw worden onderhandeld. Dit kost tijd, en het vereist hetzelfde RAFT-werk dat van toepassing is op elke andere transitie."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Two specific re-entry dynamics to anticipate: Comparison — the instinct to compare your home context unfavourably with the field, or vice versa. Neither comparison produces belonging. And Invisibility — people around you often cannot see or honour the transformation you've been through. You have lived through things that don't translate in ordinary conversation. Name this to yourself. Find people who can receive it.",
                "Dua dinamika kepulangan spesifik yang perlu diantisipasi: Perbandingan — naluri untuk membandingkan konteks rumah Anda secara tidak menguntungkan dengan lapangan, atau sebaliknya. Tidak ada perbandingan yang menghasilkan rasa memiliki. Dan Ketidaktampakan — orang-orang di sekitar Anda sering tidak dapat melihat atau menghormati transformasi yang telah Anda jalani. Anda telah menjalani hal-hal yang tidak dapat diterjemahkan dalam percakapan biasa. Namai ini untuk diri sendiri. Temukan orang-orang yang bisa menerimanya.",
                "Twee specifieke terugkeerdynamieken om op te anticiperen: Vergelijking — de instinctieve neiging om je thuiscontext ongunstig te vergelijken met het veld, of andersom. Geen van beide vergelijkingen produceert verbondenheid. En Onzichtbaarheid — mensen om je heen kunnen de transformatie die je hebt doorgemaakt vaak niet zien of eren. Je hebt dingen meegemaakt die niet vertalen in gewoon gesprek. Benoem dit voor jezelf. Zoek mensen die het kunnen ontvangen."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
              {t(
                "Re-entry is not a homecoming. It is another transition — and it deserves the same intentional RAFT work as any other.",
                "Kepulangan bukan sebuah pulang ke rumah. Ini adalah transisi lain — dan layak mendapatkan pekerjaan RAFT yang disengaja yang sama seperti yang lainnya.",
                "Terugkeer is geen thuiskomst. Het is een andere transitie — en het verdient hetzelfde intentionele RAFT-werk als elk ander."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section V: Biblical Foundation */}
      <div style={{ padding: "96px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
          {t("V. Biblical Foundation", "V. Dasar Alkitab", "V. Bijbelse Basis")}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
          {t("God Has Always Walked People Through Transitions", "Allah Selalu Memandu Umat-Nya Melalui Transisi", "God Heeft Altijd Mensen Door Transities Geleid")}
        </h2>

        {/* Luke 24 — Road to Emmaus */}
        <div style={{ marginBottom: 72 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 8 }}>
            <VerseRef id="luke-24-17">{t("Luke 24:17", "Lukas 24:17", "Lucas 24:17")}</VerseRef>
            {" "}(NIV)
          </p>
          <div style={{ background: lightGray, padding: "32px 36px", borderRadius: 4, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 12 }}>
              {t(
                "\"'What are you discussing together as you walk along?' They stood still, their faces downcast.\"",
                "\"'Apakah yang kamu percakapkan sementara kamu berjalan?' Dan mereka berhenti dengan muka muram.\"",
                "\"'Waar lopen jullie toch over te praten?' Ze bleven staan, met sombere gezichten.\""
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.06em", margin: 0 }}>
              — <VerseRef id="luke-24-17">{t("Luke 24:17", "Lukas 24:17", "Lucas 24:17")}</VerseRef> (NIV)
            </p>
          </div>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 20 }}>
              {t(
                "The Road to Emmaus is a story about people in the middle of a transition they did not choose. The disciples had just lived through the crucifixion — the sudden, violent end of everything they thought was certain. They are walking away, heads down, processing out loud.",
                "Jalan menuju Emaus adalah kisah tentang orang-orang di tengah transisi yang tidak mereka pilih. Para murid baru saja melewati penyaliban — akhir yang tiba-tiba dan keras dari semua yang mereka pikir pasti. Mereka berjalan menjauh, kepala tertunduk, memproses dengan keras.",
                "De weg naar Emmaüs is een verhaal over mensen midden in een transitie die ze niet gekozen hadden. De leerlingen hadden net de kruisiging meegemaakt — het plotselinge, gewelddadige einde van alles waarvan ze dachten dat het zeker was. Ze lopen weg, hoofd naar beneden, hardop verwerken."
              )}
            </p>
            <p style={{ marginBottom: 20 }}>
              {t(
                "Jesus doesn't appear with a solution. He appears with a question: what are you discussing? He walks with them in the confusion before he explains. He meets them in the grieving before he reframes the story. This is the pastoral pattern Jesus models — first the accompaniment, then the understanding.",
                "Yesus tidak muncul dengan solusi. Ia muncul dengan pertanyaan: apa yang kalian bicarakan? Ia berjalan bersama mereka dalam kebingungan sebelum menjelaskan. Ia menemani mereka dalam duka sebelum membingkai ulang kisahnya. Ini adalah pola pastoral yang Yesus contohkan — pertama pendampingan, kemudian pemahaman.",
                "Jezus verschijnt niet met een oplossing. Hij verschijnt met een vraag: waar praten jullie over? Hij loopt met hen mee in de verwarring voordat hij uitlegt. Hij ontmoet hen in het rouwen voordat hij het verhaal herkadert. Dit is het pastorale patroon dat Jezus modeleert — eerst de begeleiding, dan het begrip."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
              {t(
                "The question Jesus asks — \"What things?\" — is a RAFT question. He is inviting them to name their grief before offering perspective. Don't rush past the naming.",
                "Pertanyaan yang Yesus ajukan — 'Hal-hal apa?' — adalah pertanyaan RAFT. Ia mengundang mereka untuk menamai duka mereka sebelum menawarkan perspektif. Jangan terburu-buru melewati penamaannya.",
                "De vraag die Jezus stelt — 'Welke dingen?' — is een RAFT-vraag. Hij nodigt hen uit hun verdriet te benoemen voordat hij perspectief aanbiedt. Haast je niet langs het benoemen."
              )}
            </p>
          </div>
        </div>

        {/* Divider between Bible sections */}
        <div style={{ height: 1, background: "oklch(90% 0.008 80)", marginBottom: 72 }} />

        {/* Ruth 1 — Radical Farewell */}
        <div>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 8 }}>
            <VerseRef id="ruth-1-16">{t("Ruth 1:16", "Rut 1:16", "Ruth 1:16")}</VerseRef>
            {" "}(NIV)
          </p>
          <div style={{ background: lightGray, padding: "32px 36px", borderRadius: 4, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 12 }}>
              {t(
                "\"But Ruth replied, 'Don't urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay.'\"",
                "\"Tetapi kata Rut: 'Janganlah desak aku meninggalkan engkau dan pulang dengan tidak membawamu, sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam.'\"",
                "\"Maar Rut antwoordde: 'Vraag me toch niet langer u te verlaten en terug te gaan, want waar u gaat, zal ik gaan, en waar u blijft, zal ik blijven.'\""
              )}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.06em", margin: 0 }}>
              — <VerseRef id="ruth-1-16">{t("Ruth 1:16", "Rut 1:16", "Ruth 1:16")}</VerseRef> (NIV)
            </p>
          </div>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 20 }}>
              {t(
                "Ruth 1 is, among other things, a masterclass in farewell. Naomi has lost everything — her husband, her sons, her home context — and she is returning to Bethlehem. Orpah goes back. Ruth stays. But the text does not rush this scene. The three women stood together and wept aloud. There is grief before the decision. The decision comes out of the grief, not away from it.",
                "Rut 1 adalah, di antara hal-hal lain, kelas master dalam perpisahan. Naomi telah kehilangan segalanya — suaminya, anak-anaknya, konteks rumahnya — dan ia kembali ke Betlehem. Orpa kembali. Rut tetap tinggal. Tetapi teks tidak terburu-buru pada adegan ini. Ketiga wanita itu berdiri bersama dan menangis dengan keras. Ada kesedihan sebelum keputusan. Keputusan itu muncul dari kesedihan, bukan menjauh darinya.",
                "Ruth 1 is, onder andere, een meesterclass in afscheid. Naomi heeft alles verloren — haar man, haar zonen, haar thuiscontext — en ze keert terug naar Bethlehem. Orpa gaat terug. Ruth blijft. Maar de tekst haast deze scène niet. De drie vrouwen stonden samen en huilden luid. Er is verdriet voor de beslissing. De beslissing komt voort uit het verdriet, niet ervan weg."
              )}
            </p>
            <p style={{ marginBottom: 20 }}>
              {t(
                "Ruth's commitment to Naomi is not a denial of the loss — it is a loyalty chosen in full awareness of the cost. She knows she is leaving her own people, her own gods, her own culture. She names this. And then she goes. This is the RAFT model in biblical form: the grief is not bypassed, the relationship is honoured, the commitment to what comes next is made from a place of full presence.",
                "Komitmen Rut kepada Naomi bukan penyangkalan atas kehilangan — itu adalah kesetiaan yang dipilih dengan penuh kesadaran akan harganya. Ia tahu ia meninggalkan orang-orangnya sendiri, dewa-dewanya sendiri, budayanya sendiri. Ia menamakannya. Dan kemudian ia pergi. Ini adalah model RAFT dalam bentuk alkitabiah: kesedihan tidak dilewati, hubungan dihormati, komitmen untuk apa yang akan datang dibuat dari tempat kehadiran penuh.",
                "Ruths toewijding aan Naomi is geen ontkenning van het verlies — het is een loyaliteit gekozen in volledige bewustheid van de kosten. Ze weet dat ze haar eigen volk, haar eigen goden, haar eigen cultuur verlaat. Ze benoemt dit. En dan gaat ze. Dit is het RAFT-model in bijbelse vorm: het verdriet wordt niet omzeild, de relatie wordt geëerd, de toewijding aan wat komen gaat wordt gemaakt vanuit een plek van volledige aanwezigheid."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
              {t(
                "Ruth models radical affirmation — she chooses Naomi not despite the complexity of the leaving, but through it. That is what a RAFT farewell looks like at its most complete.",
                "Rut memodelkan peneguhan radikal — ia memilih Naomi bukan meskipun kompleksitas kepergian, tetapi melaluinya. Itulah tampilan perpisahan RAFT pada wujud paling lengkapnya.",
                "Ruth modelleert radicale bevestiging — ze kiest voor Naomi niet ondanks de complexiteit van het vertrek, maar erdoorheen. Dat is hoe een RAFT-afscheid eruitziet in zijn meest volledige vorm."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section VI: Personal RAFT Planner */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center" }}>
            {t("VI. Your RAFT Planner", "VI. Perencana RAFT Anda", "VI. Jouw RAFT-planner")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("Apply It to Your Transition", "Terapkan pada Transisi Anda", "Pas Het Toe op Jouw Transitie")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 64, textAlign: "center", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Use these four prompts for a transition you are currently navigating — or one you can see coming. Take your time. Honest answers are more useful than polished ones.",
              "Gunakan empat pertanyaan ini untuk transisi yang sedang Anda jalani — atau yang bisa Anda lihat akan datang. Luangkan waktu Anda. Jawaban yang jujur lebih berguna daripada yang dipoles.",
              "Gebruik deze vier vragen voor een transitie die je momenteel doormaakt — of een die je ziet aankomen. Neem je tijd. Eerlijke antwoorden zijn nuttiger dan gepolijste."
            )}
          </p>
          {!plannerSubmitted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {PLANNER_PROMPTS.map((prompt, i) => (
                <div key={i} style={{ background: offWhite, borderRadius: 8, padding: "36px 36px 32px", boxShadow: "0 1px 12px oklch(20% 0.05 260 / 0.06)" }}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", background: orange,
                      color: offWhite, fontFamily: serif, fontSize: 24, fontWeight: 700,
                      fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {prompt.letter}
                    </div>
                    <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: navy, lineHeight: 1.75, fontStyle: "italic", margin: "8px 0 0" }}>
                      {lang === "en" ? prompt.en_question : lang === "id" ? prompt.id_question : prompt.nl_question}
                    </p>
                  </div>
                  <textarea
                    value={plannerAnswers[i]}
                    onChange={(e) => {
                      const next = [...plannerAnswers];
                      next[i] = e.target.value;
                      setPlannerAnswers(next);
                    }}
                    placeholder={t("Write your response here...", "Tulis respons Anda di sini...", "Schrijf je reactie hier...")}
                    rows={4}
                    style={{
                      width: "100%", padding: "16px 18px",
                      fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
                      color: bodyText, background: lightGray,
                      border: "1px solid oklch(88% 0.01 80)", borderRadius: 4,
                      resize: "vertical", lineHeight: 1.75,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <button
                  onClick={() => { if (allPlannerFilled) setPlannerSubmitted(true); }}
                  disabled={!allPlannerFilled}
                  style={{
                    padding: "14px 40px", border: "none",
                    cursor: allPlannerFilled ? "pointer" : "default",
                    fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                    background: allPlannerFilled ? orange : "oklch(88% 0.01 80)",
                    color: allPlannerFilled ? offWhite : "oklch(65% 0.01 80)",
                    letterSpacing: "0.06em", borderRadius: 4,
                  }}
                >
                  {t("Complete My RAFT Plan", "Selesaikan Rencana RAFT Saya", "Voltooi Mijn RAFT-plan")}
                </button>
                {!allPlannerFilled && (
                  <p style={{ fontFamily: serif, fontSize: 13, color: bodyText, fontStyle: "italic", marginTop: 12 }}>
                    {t("Answer all four prompts to complete your plan.", "Jawab keempat pertanyaan untuk menyelesaikan rencana Anda.", "Beantwoord alle vier vragen om je plan te voltooien.")}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: offWhite, borderRadius: 8, padding: "48px 40px", boxShadow: "0 2px 24px oklch(20% 0.05 260 / 0.07)" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
                {t("Your RAFT Plan", "Rencana RAFT Anda", "Jouw RAFT-plan")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                {PLANNER_PROMPTS.map((prompt, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%", background: orange,
                        color: offWhite, fontFamily: serif, fontSize: 18, fontWeight: 700,
                        fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {prompt.letter}
                      </div>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: navy, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
                        {lang === "en"
                          ? RAFT_STEPS[i].en_title
                          : lang === "id"
                          ? RAFT_STEPS[i].id_title
                          : RAFT_STEPS[i].nl_title}
                      </p>
                    </div>
                    <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, fontStyle: "italic", paddingLeft: 48 }}>
                      "{plannerAnswers[i]}"
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 40, padding: "24px 28px", background: lightGray, borderRadius: 6, borderLeft: `3px solid ${orange}` }}>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: navy, lineHeight: 1.8, fontStyle: "italic", margin: 0 }}>
                  {t(
                    "Take this plan into prayer. Ask God which step requires your attention first — and who might walk through it with you.",
                    "Bawa rencana ini ke dalam doa. Tanyakan kepada Allah langkah mana yang memerlukan perhatian Anda terlebih dahulu — dan siapa yang mungkin melewatinya bersama Anda.",
                    "Neem dit plan mee in gebed. Vraag God welke stap eerst je aandacht vraagt — en wie het met je door kan lopen."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: offWhite, marginBottom: 16, fontStyle: "italic" }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t(
            "Explore more resources to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
            "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
          )}
        </p>
        <Link
          href="/resources"
          style={{
            display: "inline-block", padding: "14px 36px", background: orange,
            color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14,
            fontWeight: 700, textDecoration: "none", borderRadius: 4, letterSpacing: "0.04em",
          }}
        >
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed", inset: 0,
            background: "oklch(10% 0.05 260 / 0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: offWhite, borderRadius: 12,
              padding: "44px 40px", maxWidth: 540, width: "100%",
            }}
          >
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.7, color: navy, fontStyle: "italic", marginBottom: 20 }}>
              "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.nl}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — {lang === "en" ? verseData.en_ref : lang === "id" ? verseData.id_ref : verseData.nl_ref}{" "}
              {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px", background: navy, color: offWhite,
                border: "none", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
