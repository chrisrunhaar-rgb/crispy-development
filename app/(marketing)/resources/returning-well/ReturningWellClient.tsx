"use client";
import React, { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

// --- BRAND TOKENS -------------------------------------------------------------
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const serif = "Cormorant Garamond, Georgia, serif";

// --- VERSE DATA ---------------------------------------------------------------
// TB = Terjemahan Baru (Indonesian)
const VERSES: Record<string, { en_ref: string; id_ref: string; en: string; id: string }> = {
  "gen-45-9": {
    en_ref: "Genesis 45:9",
    id_ref: "Kejadian 45:9",
    en: "Now hurry back to my father and say to him, 'This is what your son Joseph says: God has made me lord of all Egypt. Come down to me; don't delay.'",
    id: "Sekarang segera pergilah kepada ayahku dan katakanlah kepadanya: Beginilah kata anakmu Yusuf: Allah telah membuat aku tuan atas seluruh Mesir. Datanglah kepadaku, janganlah tunggu-tunggu.",
  },
  "ruth-1-16": {
    en_ref: "Ruth 1:16",
    id_ref: "Rut 1:16",
    en: "But Ruth replied, 'Don't urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.'",
    id: "Tetapi kata Rut: 'Janganlah desak aku meninggalkan engkau dan pulang dengan tidak membawamu, sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam; bangsamulah bangsaku dan Allahmulah Allahku.'",
  },
  "ps-126-5": {
    en_ref: "Psalm 126:5",
    id_ref: "Mazmur 126:5",
    en: "Those who sow with tears will reap with songs of joy.",
    id: "Orang-orang yang menabur dengan mencucurkan air mata, akan menuai dengan bersorak-sorai.",
  },
  "phil-3-13": {
    en_ref: "Philippians 3:13",
    id_ref: "Filipi 3:13",
    en: "Brothers and sisters, I do not consider myself yet to have taken hold of it. But one thing I do: Forgetting what is behind and straining toward what is ahead.",
    id: "Saudara-saudara, aku sendiri tidak menganggap, bahwa aku telah menangkapnya, tetapi ini yang kulakukan: aku melupakan apa yang telah di belakangku dan mengarahkan diri kepada apa yang di hadapanku.",
  },
  "rom-12-2": {
    en_ref: "Romans 12:2",
    id_ref: "Roma 12:2",
    en: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
    id: "Janganlah kamu menjadi serupa dengan dunia ini, tetapi berubahlah oleh pembaruan budimu.",
  },
  "isa-43-18": {
    en_ref: "Isaiah 43:18-19",
    id_ref: "Yesaya 43:18-19",
    en: "Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.",
    id: "Janganlah ingat-ingat hal-hal yang dahulu, dan janganlah perhatikan hal-hal yang dari zaman purbakala! Lihat, Aku hendak membuat sesuatu yang baru, yang sekarang sudah tumbuh, belumkah kamu mengetahuinya? Ya, Aku hendak membuat jalan di padang gurun dan sungai-sungai di padang belantara.",
  },
};

// --- JOURNEY STAGES ----------------------------------------------------------
const JOURNEY_STAGES = [
  {
    id: "arrival",
    en_title: "Arrival",
    id_title: "Kedatangan",
    en_timeframe: "0-3 months",
    id_timeframe: "0-3 bulan",
    en_tagline: "The honeymoon that hides a wound",
    id_tagline: "Bulan madu yang menyembunyikan luka",
    en_vignette: "She walked into her parents' house and felt nothing. No relief, no joy, just a strange blankness. She smiled anyway, and everyone said how well she seemed.",
    id_vignette: "Ia masuk ke rumah orang tuanya dan tidak merasakan apa-apa. Tidak ada kelegaan, tidak ada sukacita, hanya kekosongan yang aneh. Ia tetap tersenyum, dan semua orang berkata betapa baik penampilannya.",
    en_feelings: [
      "A strange flatness where you expected to feel excited or relieved",
      "Hyper-awareness of everything you left behind: sounds, smells, conversations",
      "Performing 'normal' for family and friends while feeling internally unmoored",
    ],
    id_feelings: [
      "Kekosongan aneh di mana Anda berharap merasa bersemangat atau lega",
      "Kesadaran yang berlebihan tentang semua yang Anda tinggalkan: suara, bau, percakapan",
      "Berpura-pura 'normal' di depan keluarga dan teman sambil merasa tidak berakar secara internal",
    ],
    en_traps: [
      "Staying busy to avoid sitting with the disorientation",
      "Telling stories about where you came from, constantly, to anyone who will listen",
      "Reassuring everyone (and yourself) that you're fine",
    ],
    id_traps: [
      "Tetap sibuk untuk menghindari duduk dengan disorientasi",
      "Terus-menerus bercerita tentang tempat asal Anda kepada siapa saja yang mau mendengar",
      "Meyakinkan semua orang (dan diri sendiri) bahwa Anda baik-baik saja",
    ],
    en_helps: [
      "Name what you lost. Make a list and write it down. Losses only have power when they are unnamed.",
      "Allow yourself at least 30 minutes a day of quiet, with no screens and no productivity. Let your nervous system decompress.",
      "Find one person who has lived cross-culturally and tell them the real version of how you're doing.⁵",
    ],
    id_helps: [
      "Ungkapkan apa yang hilang dari Anda: buat daftar, tuliskan. Kehilangan hanya memiliki kekuatan ketika tidak disebutkan.",
      "Izinkan diri Anda setidaknya 30 menit sehari dalam keheningan, tanpa layar dan tanpa target. Beri waktu bagi sistem saraf Anda untuk tenang kembali.",
      "Temukan satu orang yang pernah hidup lintas budaya dan ceritakan kepada mereka versi nyata tentang kondisi Anda.⁵",
    ],
    verse_key: "ps-126-5",
  },
  {
    id: "collision",
    en_title: "Collision",
    id_title: "Benturan",
    en_timeframe: "3-9 months",
    id_timeframe: "3-9 bulan",
    en_tagline: "When home no longer feels like home",
    id_tagline: "Ketika rumah tidak lagi terasa seperti rumah",
    en_vignette: "He sat across from his oldest friend and realized they had nothing to talk about. Three years ago they were inseparable. Now he felt more alone at this table than he had in the country he'd just left.",
    id_vignette: "Ia duduk berhadapan dengan teman lamanya dan menyadari bahwa mereka tidak memiliki hal yang bisa dibicarakan. Tiga tahun lalu mereka tidak terpisahkan. Sekarang ia merasa lebih kesepian di meja ini daripada di negara yang baru saja ia tinggalkan.",
    en_feelings: [
      "Grief that catches you off guard: a song, a smell, a WhatsApp message that breaks you open",
      "Irritation with your home culture's pace, priorities, and superficiality",
      "A deep loneliness even when surrounded by people who love you",
    ],
    id_feelings: [
      "Duka yang datang tiba-tiba: sebuah lagu, aroma, atau pesan WhatsApp yang membuat Anda hancur",
      "Kejengkelan dengan kecepatan, prioritas, dan kedangkalan budaya asal Anda",
      "Kesepian yang mendalam meski dikelilingi orang-orang yang menyayangi Anda",
    ],
    en_traps: [
      "Idealising where you came from ('back there, everything was more real')",
      "Withdrawing from relationships because explaining feels exhausting",
      "Questioning whether you made the right decision to come back",
    ],
    id_traps: [
      "Mengidealisasi tempat Anda bertugas dulu ('di sana, segalanya lebih nyata')",
      "Menarik diri dari hubungan karena menjelaskan terasa melelahkan",
      "Mempertanyakan apakah Anda membuat keputusan yang tepat untuk kembali",
    ],
    en_helps: [
      "Let the grief come. Grief is proof that what you had was real. Don't rush past it or explain it away with spiritual words.⁶",
      "Tell a few trusted people: 'I'm not adjusting as well as I look.' You don't need everyone to understand. One or two people who do will be enough.",
      "Resist comparison. Your previous context was different, and that difference is easy to romanticise. Idealising the past is often grief speaking, so hold those memories loosely.",
    ],
    id_helps: [
      "Biarkan duka datang. Duka adalah bukti bahwa apa yang Anda miliki itu nyata. Jangan terburu-buru melewatinya atau menutupinya dengan kata-kata rohani.⁶",
      "Beritahu beberapa orang yang Anda percaya: 'Saya tidak menyesuaikan diri sebaik yang terlihat.' Anda tidak perlu semua orang mengerti. Satu atau dua orang yang mengerti sudah cukup.",
      "Tolak perbandingan. Tempat Anda sebelumnya memang berbeda, dan perbedaan itu mudah diromantisasi. Mengidealkan masa lalu sering kali adalah suara duka, jadi peganglah kenangan itu dengan longgar.",
    ],
    verse_key: "rom-12-2",
  },
  {
    id: "adjustment",
    en_title: "Adjustment",
    id_title: "Penyesuaian",
    en_timeframe: "9-18 months",
    id_timeframe: "9-18 bulan",
    en_tagline: "Finding the ground beneath your feet again",
    id_tagline: "Menemukan kembali pijakan di bawah kaki Anda",
    en_vignette: "She still thought about Jakarta every day. But she had started running a new route near her house, and she noticed she looked forward to it. That felt significant.",
    id_vignette: "Ia masih memikirkan Jakarta setiap hari. Tetapi ia mulai berlari di rute baru dekat rumahnya, dan ia menyadari bahwa ia menantikannya. Itu terasa bermakna.",
    en_feelings: [
      "Moments of genuine belonging that surprise you, followed by guilt for not missing it more",
      "A growing ability to hold both realities: who you were there, and who you are becoming here",
      "Cautious hope that you might actually find a meaningful life in this place",
    ],
    id_feelings: [
      "Momen-momen kebersamaan sejati yang mengejutkan Anda, lalu diikuti rasa bersalah karena tidak terlalu rindu lagi",
      "Kemampuan yang tumbuh untuk memegang kedua realitas: siapa Anda di sana, dan siapa Anda menjadi di sini",
      "Harapan yang hati-hati bahwa Anda mungkin benar-benar menemukan kehidupan yang bermakna di tempat ini",
    ],
    en_traps: [
      "Feeling guilty for adjusting, as though belonging here means betraying there",
      "Over-scheduling to create a sense of belonging before it's ready to form naturally",
      "Expecting your identity to snap back to who you were before you left",
    ],
    id_traps: [
      "Merasa bersalah karena menyesuaikan diri, seolah-olah menjadi bagian di sini berarti mengkhianati di sana",
      "Terlalu banyak jadwal untuk menciptakan rasa memiliki sebelum waktunya untuk terbentuk secara alami",
      "Mengharapkan identitas Anda kembali ke siapa Anda sebelum pergi",
    ],
    en_helps: [
      "Give yourself permission to belong here without conditions. Adjusting is faithfulness to where God has placed you now.",
      "Start building rituals in this place: a regular walk, a weekly meal, a community of practice. Belonging is built slowly through repeated acts.",
      "Begin to put into words what the cross-cultural years gave you, alongside what they cost you. This is the beginning of integration.",
    ],
    id_helps: [
      "Izinkan diri Anda untuk menjadi bagian di sini tanpa syarat. Menyesuaikan diri adalah bentuk kesetiaan pada tempat di mana Tuhan menempatkan Anda sekarang.",
      "Mulai membangun ritual di tempat ini: jalan-jalan teratur, makan bersama mingguan, komunitas praktik. Rasa memiliki dibangun perlahan melalui tindakan berulang.",
      "Mulailah merumuskan apa yang diberikan tahun-tahun lintas budaya kepada Anda, di samping apa yang harus Anda bayar. Ini adalah awal dari integrasi.",
    ],
    verse_key: "phil-3-13",
  },
  {
    id: "integration",
    en_title: "Integration",
    id_title: "Integrasi",
    en_timeframe: "18 months+",
    id_timeframe: "18 bulan ke atas",
    en_tagline: "The cross-cultural gift becomes available",
    id_tagline: "Karunia lintas budaya menjadi tersedia",
    en_vignette: "He was leading a meeting when he noticed he was the only one who could see what was happening between two team members from different cultural backgrounds. He said something quiet and accurate. The room shifted. For the first time in years, his history felt like a gift.",
    id_vignette: "Ia sedang memimpin rapat ketika ia menyadari bahwa ia adalah satu-satunya yang bisa melihat apa yang terjadi antara dua anggota tim dari latar belakang budaya yang berbeda. Ia mengatakan sesuatu yang tenang dan tepat. Ruangan berubah. Untuk pertama kalinya dalam bertahun-tahun, sejarahnya terasa seperti karunia.",
    en_feelings: [
      "A settled sense of who you are, shaped by where you have been without being defined by it",
      "The ability to hold grief and gratitude for the same experience at the same time",
      "A quiet confidence that what you carry is genuinely useful to the people around you",
    ],
    id_feelings: [
      "Rasa tenang tentang siapa Anda, dibentuk oleh tempat-tempat yang pernah Anda tinggali tanpa ditentukan olehnya",
      "Kemampuan untuk menampung duka dan rasa syukur untuk pengalaman yang sama pada saat yang sama",
      "Kepercayaan diri yang tenang bahwa apa yang Anda bawa benar-benar berguna bagi orang-orang di sekitar Anda",
    ],
    en_traps: [
      "Assuming integration means the grief is gone, when it has simply found its rightful place",
      "Becoming the person who frames everything through 'when I was overseas'. Your history can serve others without taking over every conversation",
      "Stopping here. Integration opens the door to giving your cross-cultural experience away.",
    ],
    id_traps: [
      "Menganggap integrasi berarti duka sudah hilang, padahal duka itu hanya sudah menemukan tempatnya",
      "Menjadi orang yang membingkai segalanya melalui 'waktu saya di luar negeri'. Pengalaman Anda bisa melayani orang lain tanpa menguasai setiap percakapan",
      "Berhenti di sini. Integrasi membuka pintu untuk membagikan pengalaman lintas budaya Anda kepada orang lain.",
    ],
    en_helps: [
      "Tell your story in a way that serves the listener. Ask what they need before you share what you saw.",
      "Find one place where your cross-cultural experience is useful: a newcomer, a multicultural team, or someone preparing to leave.",
      "Keep a few threads to your former home alive: a regular call, a recipe, a language you still read. Integration holds both places.",
    ],
    id_helps: [
      "Ceritakan kisah Anda dengan cara yang menolong pendengar. Tanyakan dulu apa yang mereka butuhkan sebelum Anda membagikan apa yang Anda lihat.",
      "Temukan satu tempat di mana pengalaman lintas budaya Anda berguna: pendatang baru, tim multibudaya, atau seseorang yang sedang bersiap untuk pergi.",
      "Jaga beberapa ikatan dengan tempat Anda dulu: telepon rutin, resep masakan, bahasa yang masih Anda baca. Integrasi berarti memegang kedua tempat itu.",
    ],
    verse_key: "isa-43-18",
  },
];

// --- RAFT CARDS ---------------------------------------------------------------
const RAFT_CARDS = [
  {
    letter: "R",
    en_title: "Reconciliation",
    id_title: "Rekonsiliasi",
    en_body: "Before you left, did you seek peace with those relationships that were strained? If not, the work still waits, even across distance. Unreconciled relationships travel with you and surface in unexpected places.",
    id_body: "Sebelum Anda pergi, apakah Anda mencari perdamaian dengan hubungan-hubungan yang tegang? Jika tidak, pekerjaan itu masih menunggu, bahkan dari jauh. Hubungan yang belum direkonsiliasi ikut bersama Anda dan muncul di tempat-tempat yang tidak terduga.",
    en_question: "Is there a relationship from your time overseas that you left without resolution? What would one step toward peace look like, even now?",
    id_question: "Apakah ada hubungan dari masa Anda di luar negeri yang Anda tinggalkan tanpa penyelesaian? Seperti apa satu langkah menuju perdamaian, bahkan sekarang?",
  },
  {
    letter: "A",
    en_title: "Affirmation",
    id_title: "Peneguhan",
    en_body: "Did you tell the people who shaped you what they meant? Most people leave without closing this loop, and the people left behind carry an unnamed loss. Affirmation is the deliberate act of honouring a person before you go.",
    id_body: "Apakah Anda memberitahu orang-orang yang membentuk Anda apa artinya mereka? Kebanyakan orang pergi tanpa menutup lingkaran ini, dan orang-orang yang ditinggalkan menanggung kehilangan yang tidak terucapkan. Peneguhan adalah tindakan yang disengaja untuk menghormati seseorang sebelum Anda pergi.",
    en_question: "Who are the 3 to 5 people from your cross-cultural season who most shaped you? Have you told them specifically what they gave you?",
    id_question: "Siapa 3 sampai 5 orang dari musim lintas budaya Anda yang paling membentuk Anda? Apakah Anda sudah memberi tahu mereka secara spesifik apa yang mereka berikan kepada Anda?",
  },
  {
    letter: "F",
    en_title: "Farewells",
    id_title: "Perpisahan",
    en_body: "Grief that isn't expressed doesn't disappear. It gets stored. Unexpressed farewells become emotional weight you carry into the next season. Saying goodbye to a place, a community, a language, or a rhythm of life is not weakness. It is the evidence that what you had was real.",
    id_body: "Duka yang tidak diungkapkan tidak hilang. Duka itu tersimpan. Perpisahan yang tidak diungkapkan menjadi beban emosional yang Anda bawa ke musim berikutnya. Mengucapkan selamat tinggal pada sebuah tempat, komunitas, bahasa, atau ritme kehidupan bukan kelemahan. Itu adalah bukti bahwa apa yang Anda miliki itu nyata.",
    en_question: "What did you not get to grieve before or during the transition? What do you still carry that hasn't been given its proper goodbye?",
    id_question: "Apa yang tidak bisa Anda berdukacitakan sebelum atau selama transisi? Apa yang masih Anda bawa yang belum mendapatkan perpisahan yang layak?",
  },
  {
    letter: "T",
    en_title: "Think Ahead",
    id_title: "Persiapkan Masa Depan",
    en_body: "Returning tends to follow recognisable stages. Knowing that Collision is likely to come, and that it is temporary, changes how you face it. Naming the road ahead is wisdom, and it can make the hard seasons easier to bear.",
    id_body: "Proses pulang biasanya mengikuti tahapan yang bisa dikenali. Mengetahui bahwa Benturan kemungkinan akan datang, dan bahwa itu sementara, mengubah cara Anda menghadapinya. Menyebutkan jalan di depan adalah kebijaksanaan, dan itu bisa membuat musim yang berat lebih mudah ditanggung.",
    en_question: "Which stage of the process do you think will be hardest for you personally, and what one thing could you put in place now to help when you arrive there?",
    id_question: "Menurut Anda, tahap mana dalam proses ini yang paling sulit bagi Anda secara pribadi, dan satu hal apa yang bisa Anda siapkan sekarang untuk membantu saat Anda tiba di sana?",
  },
];

// --- REFLECTION STATEMENTS ---------------------------------------------------
const REFLECTION_STATEMENTS = [
  {
    en: "I have moments of genuine joy in my home culture, but they're followed by guilt, as if I shouldn't be enjoying it here.",
    id: "Saya memiliki momen-momen sukacita sejati di tempat saya baru pulang ini, tetapi diikuti oleh rasa bersalah, seolah saya tidak seharusnya menikmatinya di sini.",
    en_stage: "Adjustment",
    id_stage: "Penyesuaian",
  },
  {
    en: "People around me assume I'm fine because I look fine. But inside I feel like a stranger in a place that's supposed to be home.",
    id: "Orang-orang di sekitar saya menganggap saya baik-baik saja karena saya terlihat baik-baik saja. Tapi di dalam saya merasa seperti orang asing di tempat yang seharusnya menjadi rumah.",
    en_stage: "Collision",
    id_stage: "Benturan",
  },
  {
    en: "I find myself constantly comparing my home culture unfavourably to where I came from: the pace, the priorities, the conversations.",
    id: "Saya terus-menerus merasa tempat saya baru pulang ini lebih buruk dibandingkan tempat saya bertugas: kecepatannya, prioritasnya, percakapannya.",
    en_stage: "Collision",
    id_stage: "Benturan",
  },
  {
    en: "There are relationships I left without saying what I needed to say, and I still feel the weight of that.",
    id: "Ada hubungan yang saya tinggalkan tanpa mengatakan apa yang perlu saya katakan, dan hal itu masih terasa berat di hati saya.",
    en_stage: "Arrival",
    id_stage: "Kedatangan",
  },
  {
    en: "I can see things in groups and teams that others miss: cross-cultural dynamics, unspoken tensions, misread signals. That feels like a gift now.",
    id: "Saya bisa melihat hal-hal dalam kelompok dan tim yang dilewatkan orang lain: dinamika lintas budaya, ketegangan yang tidak terucapkan, sinyal yang salah dibaca. Itu terasa seperti karunia sekarang.",
    en_stage: "Integration",
    id_stage: "Integrasi",
  },
];

// Orange superscript citations
function cite(text: string): React.ReactNode {
  const parts = text.split(/([¹²³⁴⁵⁶⁷⁸⁹]+)/);
  return (
    <>
      {parts.map((p, i) =>
        /^[¹²³⁴⁵⁶⁷⁸⁹]+$/.test(p)
          ? <span key={i} style={{ color: orange }}>{p}</span>
          : p,
      )}
    </>
  );
}

// --- COMPONENT ----------------------------------------------------------------
type Props = { userPathway: string | null; isSaved: boolean };

export default function ReturningWellClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeStage, setActiveStage] = useState<string>("arrival");
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeRaft, setActiveRaft] = useState<number | null>(null);
  const [reflectionAnswers, setReflectionAnswers] = useState<(boolean | null)[]>(
    Array(REFLECTION_STATEMENTS.length).fill(null)
  );

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("returning-well");
      setSaved(true);
    });
  }

  // JOURNEY_STAGES always has 4 members, so activeStage is always a valid id
  // Cast through unknown to strip the | undefined that find() adds
  const currentStage = JOURNEY_STAGES.find((s) => s.id === activeStage) as unknown as {
    id: string; en_title: string; id_title: string;     en_timeframe: string; id_timeframe: string;     en_tagline: string; id_tagline: string;     en_vignette: string; id_vignette: string;     en_feelings: string[]; id_feelings: string[];     en_traps: string[]; id_traps: string[];     en_helps: string[]; id_helps: string[];     verse_key: string;
  };
  const verseData = activeVerse ? VERSES[activeVerse] : null;

  const answeredCount = reflectionAnswers.filter((a) => a !== null).length;
  const agreedStatements = reflectionAnswers
    .map((a, i) => (a === true ? REFLECTION_STATEMENTS[i] : null))
    .filter(Boolean);

  // Infer stage from agreed statements
  const stageCounts: Record<string, number> = {};
  agreedStatements.forEach((s) => {
    if (s) {
      const stageKey = lang === "en" ? s.en_stage : lang === "id" ? s.id_stage : s.id_stage;
      stageCounts[stageKey] = (stageCounts[stageKey] ?? 0) + 1;
    }
  });
  const inferredStageRaw = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* -- Language Bar --------------------------------------------------- */}

      {/* -- Hero ----------------------------------------------------------- */}
      <section style={{ background: navy, padding: "96px 24px 88px", position: "relative", overflow: "hidden" }}>
        <img
          src="/images/resources/returning-well/hero.jpg"
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity",
            pointerEvents: "none",
          }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            color: orange,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}>
            {t(
              "Personal Development · Article",
              "Pengembangan Pribadi · Artikel",
            )}
          </p>
          <h1 style={{
            fontFamily: serif,
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 600,
            color: offWhite,
            margin: "0 0 24px",
            lineHeight: 1.08,
          }}>
            {t(
              "Returning Well",
              "Kembali dengan Baik",
            )}
          </h1>
          <p style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 21px)",
            color: "oklch(72% 0.04 260)",
            letterSpacing: "0.02em",
            marginBottom: 36,
            fontStyle: "italic",
          }}>
            {t(
              "Life after cross-cultural work",
              "Kehidupan setelah pekerjaan lintas budaya",
            )}
          </p>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 36px" }} />
          <p style={{
            fontFamily: serif,
            fontSize: "clamp(18px, 2.2vw, 22px)",
            color: "oklch(82% 0.025 80)",
            lineHeight: 1.85,
            marginBottom: 52,
            fontStyle: "italic",
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            {t(
              "Nobody warns you about this part. You prepared for the cross-cultural move: the language, the culture, the discomfort of being foreign. But nobody told you that coming home can be harder than going. That the country you return to is not the one you left. That you are not the person who left either. This module is for the part no one prepared you for.",
              "Tidak ada yang memperingatkan Anda tentang bagian ini. Anda mempersiapkan diri untuk perpindahan lintas budaya: bahasa, budaya, ketidaknyamanan menjadi orang asing. Tetapi tidak ada yang memberi tahu Anda bahwa pulang bisa lebih sulit dari pergi. Bahwa negara tempat Anda kembali bukan negara yang Anda tinggalkan. Bahwa Anda juga bukan orang yang pergi itu. Modul ini untuk bagian yang tidak pernah disiapkan siapa pun bagi Anda.",
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saved || isPending}
              aria-pressed={saved}
              aria-label={saved
                ? t("Saved to your dashboard", "Tersimpan di dasbor Anda")
                : t("Save this module to your dashboard", "Simpan modul ini ke dasbor Anda")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
                padding: "10px 24px",
                border: "none",
                cursor: saved ? "default" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                background: saved ? "oklch(35% 0.05 260)" : orange,
                color: offWhite,
                letterSpacing: "0.04em",
                borderRadius: 4,
              }}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                <path d="M6 3h12v18l-6-4.5L6 21z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span>
                {saved
                  ? t("Saved to Dashboard", "Tersimpan di Dasbor")
                  : t("Save to Dashboard", "Simpan ke Dasbor")}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* -- Re-entry Explained --------------------------------------------- */}
      <div style={{ padding: "96px 24px 64px", maxWidth: 860, margin: "0 auto" }}>
        <p style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: orange,
          marginBottom: 28,
        }}>
          {t("What Is Re-Entry?", "Apa Itu Kembali ke Tanah Air?")}
        </p>
        <h2 style={{
          fontFamily: serif,
          fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: 700,
          color: navy,
          marginBottom: 40,
          lineHeight: 1.18,
          fontStyle: "italic",
        }}>
          {t(
            "Reverse culture shock is real, and it can be harder than the first move",
            "Gegar budaya terbalik itu nyata, dan bisa lebih berat daripada kepindahan pertama",
          )}
        </h2>
        <div style={{ fontSize: "clamp(16px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "When you moved cross-culturally, everyone around you expected it to be difficult. They offered support, sent care packages, checked in. There was a structure of expectation that gave you permission to struggle.",
              "Ketika Anda berpindah secara lintas budaya, semua orang di sekitar Anda mengharapkan itu akan sulit. Mereka menawarkan dukungan, mengirim paket perawatan, memeriksa keadaan Anda. Ada struktur harapan yang memberi Anda izin untuk berjuang.",
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {cite(t(
              "When you come back, no one extends that grace. People assume you are relieved. They assume you are home. What they don't understand, and what you may not have understood either, is that re-entry is its own form of culture shock. Researchers call it reverse culture shock, and many returnees find it harder than they expected.¹ One study that followed returnees for six months found that a harder re-entry predicted more loneliness, depression and stress later on.² Another found that when home turns out worse than people expected, their wellbeing drops.³",
              "Ketika Anda kembali, tidak ada yang memperpanjang anugerah itu. Orang-orang berasumsi Anda lega. Mereka berasumsi Anda sudah di rumah. Yang tidak mereka mengerti, dan mungkin juga belum Anda mengerti, adalah bahwa pulang ke tanah air merupakan bentuk gegar budaya tersendiri. Para peneliti menyebutnya gegar budaya terbalik, dan banyak orang yang pulang merasakannya lebih berat daripada yang mereka duga.¹ Satu penelitian yang mengikuti para pulangan selama enam bulan menemukan bahwa masa pulang yang lebih berat memprediksi rasa kesepian, depresi, dan stres yang lebih tinggi sesudahnya.² Penelitian lain menemukan bahwa ketika keadaan di rumah ternyata lebih buruk dari yang diharapkan, kesejahteraan orang itu menurun.³",
            ))}
          </p>
          <blockquote style={{
            fontFamily: serif,
            fontSize: "clamp(19px, 2.2vw, 24px)",
            fontStyle: "italic",
            color: navy,
            lineHeight: 1.75,
            padding: "12px 0 12px 28px",
            borderLeft: `3px solid ${orange}`,
            marginBottom: 32,
            marginLeft: 0,
          }}>
            {t(
              "You changed. The people you left didn't, at least not in the same direction. The gap between who you became and who they expected you to be is where the collision happens.",
              "Anda berubah. Orang-orang yang Anda tinggalkan tidak berubah, setidaknya tidak ke arah yang sama. Benturan terjadi di celah antara diri Anda yang sekarang dan diri Anda yang mereka harapkan.",
            )}
          </blockquote>
          <p style={{ marginBottom: 0 }}>
            {t(
              "This module maps the process. It names the stages, normalises what you are likely feeling, and gives you practical tools for each phase. It also holds the belief that your cross-cultural years were not wasted. They are a gift still being unwrapped.",
              "Modul ini memetakan prosesnya. Modul ini menamai tahap-tahapnya, menolong Anda melihat bahwa apa yang Anda rasakan itu wajar, dan memberi alat praktis untuk setiap fase. Modul ini juga berpegang pada keyakinan bahwa tahun-tahun lintas budaya Anda tidak sia-sia. Tahun-tahun itu adalah karunia yang masih sedang dibuka.",
            )}
          </p>
        </div>
      </div>

      {/* -- Journey Map ---------------------------------------------------- */}
      <div id="journey-map-section" style={{ background: lightGray, padding: "80px 0 96px", scrollMarginTop: 24 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 20,
            }}>
              {t("The Re-Entry Process", "Proses Kembali ke Tanah Air")}
            </p>
            <h2 style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: navy,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}>
              {t(
                "Four stages, and where you might be right now",
                "Empat tahap, dan di mana Anda mungkin berada sekarang",
              )}
            </h2>
            <p style={{
              fontSize: "clamp(14px, 1.6vw, 16px)",
              color: bodyText,
              lineHeight: 1.75,
              maxWidth: 600,
              margin: "20px auto 0",
            }}>
              {cite(t(
                "The months below are rough guides. Research with returnees shows that people move through these stages at different speeds, and some circle back to an earlier stage before moving on.⁴",
                "Jumlah bulan di bawah ini hanya perkiraan kasar. Penelitian dengan orang-orang yang pulang menunjukkan bahwa setiap orang melewati tahap-tahap ini dengan kecepatan berbeda, dan ada yang kembali ke tahap sebelumnya sebelum melangkah lagi.⁴",
              ))}
            </p>
          </div>

          {/* Stage selector: horizontal arc */}
          <div style={{
            display: "flex",
            gap: 0,
            marginBottom: 48,
            borderRadius: 8,
            overflow: "hidden",
            border: `1px solid oklch(88% 0.01 80)`,
          }}>
            {JOURNEY_STAGES.map((stage, idx) => {
              const isActive = stage.id === activeStage;
              const stageTitle = lang === "en" ? stage.en_title : lang === "id" ? stage.id_title : stage.id_title;
              const timeframe = lang === "en" ? stage.en_timeframe : lang === "id" ? stage.id_timeframe : stage.id_timeframe;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  style={{
                    flex: 1,
                    padding: "20px 12px",
                    border: "none",
                    borderRight: idx < JOURNEY_STAGES.length - 1 ? `1px solid oklch(88% 0.01 80)` : "none",
                    cursor: "pointer",
                    background: isActive ? navy : offWhite,
                    color: isActive ? offWhite : bodyText,
                    textAlign: "center",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  <div style={{
                    fontFamily: serif,
                    fontSize: "clamp(15px, 1.8vw, 20px)",
                    fontWeight: 700,
                    fontStyle: "italic",
                    marginBottom: 4,
                    color: isActive ? offWhite : navy,
                  }}>
                    {stageTitle}
                  </div>
                  <div style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: isActive ? orange : "oklch(60% 0.04 260)",
                    textTransform: "uppercase",
                  }}>
                    {timeframe}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active stage content */}
          <div style={{
            background: offWhite,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 24px oklch(20% 0.06 260 / 0.07)",
          }}>
            {/* Stage header */}
            <div style={{ background: navy, padding: "40px 48px 36px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: orange,
                    marginBottom: 12,
                  }}>
                    {lang === "en" ? currentStage.en_timeframe : lang === "id" ? currentStage.id_timeframe : currentStage.id_timeframe}
                  </p>
                  <h3 style={{
                    fontFamily: serif,
                    fontSize: "clamp(26px, 3vw, 38px)",
                    fontWeight: 700,
                    color: offWhite,
                    margin: "0 0 10px",
                    fontStyle: "italic",
                    lineHeight: 1.15,
                  }}>
                    {lang === "en" ? currentStage.en_title : lang === "id" ? currentStage.id_title : currentStage.id_title}
                  </h3>
                  <p style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 20px)",
                    color: "oklch(72% 0.04 260)",
                    fontStyle: "italic",
                    margin: 0,
                  }}>
                    {lang === "en" ? currentStage.en_tagline : lang === "id" ? currentStage.id_tagline : currentStage.id_tagline}
                  </p>
                </div>
                <button
                  onClick={() => setActiveVerse(currentStage.verse_key)}
                  style={{
                    background: "oklch(30% 0.08 260)",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 18px",
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: orange,
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("Faith Anchor", "Pegangan Iman")} ?
                </button>
              </div>
            </div>

            {/* Vignette */}
            <div style={{
              background: "oklch(96% 0.008 260)",
              borderBottom: `1px solid oklch(90% 0.01 80)`,
              padding: "28px 48px",
            }}>
              <p style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.9vw, 20px)",
                color: navy,
                fontStyle: "italic",
                lineHeight: 1.75,
                margin: 0,
              }}>
                "{lang === "en" ? currentStage.en_vignette : lang === "id" ? currentStage.id_vignette : currentStage.id_vignette}"
              </p>
            </div>

            {/* Three-column content */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 0,
            }}>
              {/* What you might be feeling */}
              <div style={{
                padding: "40px 36px",
                borderRight: `1px solid oklch(90% 0.01 80)`,
              }}>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: orange,
                  marginBottom: 20,
                }}>
                  {t("What You Might Be Feeling", "Yang Mungkin Anda Rasakan")}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(lang === "en" ? currentStage.en_feelings : lang === "id" ? currentStage.id_feelings : currentStage.id_feelings).map((f, i) => (
                    <li key={i} style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 18,
                      alignItems: "flex-start",
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: orange,
                        flexShrink: 0,
                        marginTop: 7,
                      }} />
                      <span style={{
                        fontSize: "clamp(14px, 1.6vw, 16px)",
                        color: bodyText,
                        lineHeight: 1.65,
                      }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What you might be doing */}
              <div style={{
                padding: "40px 36px",
                borderRight: `1px solid oklch(90% 0.01 80)`,
                background: "oklch(96.5% 0.004 80)",
              }}>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "oklch(55% 0.08 45)",
                  marginBottom: 20,
                }}>
                  {t("Traps to Watch For", "Jebakan yang Perlu Diwaspadai")}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(lang === "en" ? currentStage.en_traps : lang === "id" ? currentStage.id_traps : currentStage.id_traps).map((trap, i) => (
                    <li key={i} style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 18,
                      alignItems: "flex-start",
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "oklch(55% 0.12 45)",
                        flexShrink: 0,
                        marginTop: 7,
                      }} />
                      <span style={{
                        fontSize: "clamp(14px, 1.6vw, 16px)",
                        color: bodyText,
                        lineHeight: 1.65,
                      }}>
                        {trap}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What actually helps */}
              <div style={{ padding: "40px 36px" }}>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "oklch(40% 0.12 155)",
                  marginBottom: 20,
                }}>
                  {t("What Actually Helps", "Yang Sebenarnya Membantu")}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(lang === "en" ? currentStage.en_helps : lang === "id" ? currentStage.id_helps : currentStage.id_helps).map((h, i) => (
                    <li key={i} style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 18,
                      alignItems: "flex-start",
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "oklch(40% 0.12 155)",
                        flexShrink: 0,
                        marginTop: 7,
                      }} />
                      <span style={{
                        fontSize: "clamp(14px, 1.6vw, 16px)",
                        color: bodyText,
                        lineHeight: 1.65,
                      }}>
                        {cite(h)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Journey arc visual indicator */}
          <div style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}>
            {JOURNEY_STAGES.map((stage, i) => (
              <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setActiveStage(stage.id)}
                  style={{
                    width: stage.id === activeStage ? 36 : 10,
                    height: 10,
                    borderRadius: 5,
                    background: stage.id === activeStage ? orange : "oklch(80% 0.02 260)",
                    border: "none",
                    cursor: "pointer",
                    transition: "width 0.25s, background 0.25s",
                    padding: 0,
                  }}
                />
                {i < JOURNEY_STAGES.length - 1 && (
                  <div style={{ width: 24, height: 1, background: "oklch(80% 0.02 260)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -- The RAFT Model ------------------------------------------------- */}
      <div style={{ padding: "96px 24px 96px", maxWidth: 860, margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 20,
          }}>
            {t("A Tool for the Transition", "Alat untuk Transisi")}
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(30px, 3.8vw, 48px)",
            fontWeight: 700,
            color: navy,
            lineHeight: 1.15,
            fontStyle: "italic",
            marginBottom: 20,
          }}>
            {t("The RAFT Model", "Model RAFT")}
          </h2>
          <p style={{
            fontSize: "clamp(15px, 1.7vw, 17px)",
            color: bodyText,
            lineHeight: 1.8,
            maxWidth: 600,
            margin: "0 auto",
          }}>
            {cite(t(
              "Developed by Dave Pollock and Ruth Van Reken, RAFT is a framework for finishing well, so that you carry freedom into the next season instead of unfinished weight.⁷",
              "Dikembangkan oleh Dave Pollock dan Ruth Van Reken, RAFT adalah kerangka untuk mengakhiri dengan baik, sehingga Anda membawa kebebasan ke musim berikutnya, bukan beban yang belum selesai.⁷",
            ))}
          </p>
        </div>

        {/* RAFT cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {RAFT_CARDS.map((card, idx) => {
            const isOpen = activeRaft === idx;
            return (
              <div key={card.letter} style={{
                background: offWhite,
                border: isOpen ? `2px solid ${navy}` : `1px solid oklch(88% 0.01 80)`,
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: isOpen ? "0 4px 32px oklch(20% 0.06 260 / 0.10)" : "none",
                transition: "box-shadow 0.2s, border 0.2s",
              }}>
                <button
                  onClick={() => setActiveRaft(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    background: isOpen ? navy : "transparent",
                    border: "none",
                    padding: "32px 28px 28px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{
                    fontFamily: serif,
                    fontSize: 72,
                    fontWeight: 700,
                    color: isOpen ? orange : "oklch(88% 0.02 260)",
                    lineHeight: 1,
                    marginBottom: 12,
                  }}>
                    {card.letter}
                  </div>
                  <div style={{
                    fontFamily: serif,
                    fontSize: "clamp(18px, 2vw, 22px)",
                    fontWeight: 700,
                    fontStyle: "italic",
                    color: isOpen ? offWhite : navy,
                    marginBottom: 6,
                  }}>
                    {lang === "en" ? card.en_title : lang === "id" ? card.id_title : card.id_title}
                  </div>
                  <div style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    color: isOpen ? orange : "oklch(60% 0.04 260)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}>
                    {isOpen ? t("click to close", "klik untuk tutup") : t("click to explore", "klik untuk jelajahi")}
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 28px 32px" }}>
                    <p style={{
                      fontSize: "clamp(14px, 1.6vw, 16px)",
                      color: bodyText,
                      lineHeight: 1.8,
                      marginBottom: 24,
                    }}>
                      {lang === "en" ? card.en_body : lang === "id" ? card.id_body : card.id_body}
                    </p>
                    <div style={{
                      background: lightGray,
                      borderRadius: 8,
                      padding: "20px 22px",
                      borderLeft: `3px solid ${orange}`,
                    }}>
                      <p style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        color: orange,
                        marginBottom: 10,
                      }}>
                        {t("Reflection Question", "Pertanyaan Refleksi")}
                      </p>
                      <p style={{
                        fontFamily: serif,
                        fontSize: "clamp(15px, 1.7vw, 17px)",
                        color: navy,
                        lineHeight: 1.75,
                        fontStyle: "italic",
                        margin: 0,
                      }}>
                        {lang === "en" ? card.en_question : lang === "id" ? card.id_question : card.id_question}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* -- Biblical Foundation -------------------------------------------- */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 24,
          }}>
            {t("Biblical Foundation", "Dasar Alkitabiah")}
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 700,
            color: offWhite,
            marginBottom: 48,
            lineHeight: 1.18,
            fontStyle: "italic",
          }}>
            {t(
              "Re-entry is an old story, and Scripture tells it",
              "Pulang ke tanah air adalah kisah lama, dan Alkitab menceritakannya",
            )}
          </h2>

          {/* Joseph */}
          <div style={{ marginBottom: 52 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 12,
            }}>
              {t("Joseph: Genesis 45", "Yusuf: Kejadian 45")}
            </p>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.85,
              marginBottom: 20,
            }}>
              {t(
                "Joseph spent years in Egypt as a slave, a prisoner and finally a senior official. He was thoroughly cross-cultural long before that was a category. When his brothers arrived, he had to manage the collision of his two worlds: the boy they remembered, and the man he had become. His weeping was the natural overflow of a person who had been holding two worlds apart for years, and whose integration finally arrived.",
                "Yusuf menghabiskan bertahun-tahun di Mesir sebagai budak, tahanan, dan akhirnya pejabat tinggi. Ia sepenuhnya lintas budaya jauh sebelum itu menjadi sebuah kategori. Ketika saudara-saudaranya tiba, ia harus mengelola benturan dua dunianya: anak laki-laki yang mereka ingat, dan pria yang kini ia jadi. Tangisannya adalah luapan alami dari seseorang yang telah menahan dua dunia terpisah selama bertahun-tahun, dan integrasinya akhirnya tiba.",
              )}
            </p>
            <button
              onClick={() => setActiveVerse("gen-45-9")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: orange,
                fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                padding: 0,
                textDecoration: "underline dotted",
                textUnderlineOffset: 3,
              }}
            >
              {lang === "en" ? VERSES["gen-45-9"].en_ref : lang === "id" ? VERSES["gen-45-9"].id_ref : VERSES["gen-45-9"].id_ref}
            </button>
          </div>

          {/* Ruth */}
          <div style={{ marginBottom: 52 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 12,
            }}>
              {t("Ruth: A stranger in a stranger's land", "Rut: Orang asing di tanah orang asing")}
            </p>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.85,
              marginBottom: 20,
            }}>
              {t(
                "Ruth's story is the inverse of re-entry. She chose to enter a foreign culture permanently, leaving everything familiar behind. But her experience mirrors what returning cross-cultural workers feel: the grief of leaving a people she loved, the courage of committing fully to a new place, the slow and costly work of being known as a foreigner in the place you now call home. Her wholehearted commitment in the face of complete uncertainty is the same posture integration asks of you.",
                "Kisah Rut adalah kebalikan dari pulang ke tanah air. Ia memilih untuk masuk ke budaya asing secara permanen, meninggalkan semua yang familiar. Tetapi pengalamannya mencerminkan apa yang dirasakan oleh pekerja lintas budaya yang kembali: duka karena meninggalkan orang-orang yang ia cintai, keberanian untuk berkomitmen sepenuhnya pada tempat baru, pekerjaan yang lambat dan mahal untuk dikenal sebagai orang asing di tempat yang sekarang Anda sebut rumah. Komitmen sepenuh hati yang ia tunjukkan di tengah ketidakpastian total adalah sikap yang sama yang diminta integrasi dari Anda.",
              )}
            </p>
            <button
              onClick={() => setActiveVerse("ruth-1-16")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: orange,
                fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                padding: 0,
                textDecoration: "underline dotted",
                textUnderlineOffset: 3,
              }}
            >
              {lang === "en" ? VERSES["ruth-1-16"].en_ref : lang === "id" ? VERSES["ruth-1-16"].id_ref : VERSES["ruth-1-16"].id_ref}
            </button>
          </div>

          {/* Theological reflection */}
          <div style={{
            borderTop: "1px solid oklch(35% 0.06 260)",
            paddingTop: 40,
          }}>
            <p style={{
              fontFamily: serif,
              fontSize: "clamp(18px, 2.1vw, 22px)",
              color: "oklch(85% 0.025 80)",
              lineHeight: 1.85,
              fontStyle: "italic",
              marginBottom: 24,
            }}>
              {t(
                "The grief of re-entry is not a sign that something has gone wrong. It is a sign that something was real. Psalm 126 holds both realities: 'those who sow with tears will reap with songs of joy.' The sowing and the harvest are not separate stories. They are one story, told across time.",
                "Duka dari kembali ke tanah air bukan tanda bahwa sesuatu telah salah. Itu tanda bahwa sesuatu itu nyata. Mazmur 126 memegang kedua kenyataan itu: 'orang-orang yang menabur dengan mencucurkan air mata, akan menuai dengan bersorak-sorai.' Penabur dan panen bukan cerita yang terpisah. Mereka adalah satu cerita, diceritakan sepanjang waktu.",
              )}
            </p>
            <button
              onClick={() => setActiveVerse("ps-126-5")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: orange,
                fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                padding: 0,
                textDecoration: "underline dotted",
                textUnderlineOffset: 3,
              }}
            >
              {lang === "en" ? VERSES["ps-126-5"].en_ref : lang === "id" ? VERSES["ps-126-5"].id_ref : VERSES["ps-126-5"].id_ref}
            </button>
          </div>
        </div>
      </div>

      {/* -- Where Are You Right Now? --------------------------------------- */}
      <div style={{ padding: "96px 24px 96px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 20,
            }}>
              {t("Self-Assessment", "Penilaian Diri")}
            </p>
            <h2 style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: navy,
              lineHeight: 1.18,
              fontStyle: "italic",
              marginBottom: 16,
            }}>
              {t("Where are you right now?", "Di mana Anda berada sekarang?")}
            </h2>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: bodyText,
              lineHeight: 1.8,
              maxWidth: 520,
              margin: "0 auto",
            }}>
              {t(
                "Read each statement. Mark whether it resonates with where you are today.",
                "Baca setiap pernyataan. Tandai apakah itu beresonansi dengan posisi Anda hari ini.",
              )}
            </p>
          </div>

          {/* Statements */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REFLECTION_STATEMENTS.map((stmt, i) => {
              const answer = reflectionAnswers[i];
              return (
                <div key={i} style={{
                  background: answer === true ? "oklch(94% 0.01 155 / 0.5)" : answer === false ? lightGray : offWhite,
                  border: answer === true
                    ? "1px solid oklch(70% 0.1 155)"
                    : answer === false
                    ? "1px solid oklch(88% 0.01 80)"
                    : `1px solid oklch(88% 0.01 80)`,
                  borderRadius: 10,
                  padding: "24px 28px",
                  transition: "background 0.2s, border 0.2s",
                }}>
                  <p style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 19px)",
                    color: navy,
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    margin: "0 0 16px",
                  }}>
                    "{lang === "en" ? stmt.en : stmt.id}"
                  </p>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button
                      onClick={() => {
                        const updated = [...reflectionAnswers];
                        updated[i] = answer === true ? null : true;
                        setReflectionAnswers(updated);
                      }}
                      style={{
                        padding: "7px 20px",
                        border: `1px solid ${answer === true ? "oklch(50% 0.12 155)" : "oklch(80% 0.02 260)"}`,
                        borderRadius: 4,
                        background: answer === true ? "oklch(50% 0.12 155)" : "transparent",
                        color: answer === true ? offWhite : bodyText,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {t("This is me", "Ini saya")}
                    </button>
                    <button
                      onClick={() => {
                        const updated = [...reflectionAnswers];
                        updated[i] = answer === false ? null : false;
                        setReflectionAnswers(updated);
                      }}
                      style={{
                        padding: "7px 20px",
                        border: `1px solid oklch(80% 0.02 260)`,
                        borderRadius: 4,
                        background: answer === false ? lightGray : "transparent",
                        color: bodyText,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {t("Not yet", "Belum")}
                    </button>
                    {answer === true && (
                      <span style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: orange,
                        marginLeft: 8,
                      }}>
                        {lang === "en" ? stmt.en_stage : lang === "id" ? stmt.id_stage : stmt.id_stage}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inferred stage result */}
          {answeredCount >= 3 && inferredStageRaw && (
            <div style={{
              marginTop: 40,
              background: navy,
              borderRadius: 12,
              padding: "36px 40px",
            }}>
              <p style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: orange,
                marginBottom: 16,
              }}>
                {t("Based on your responses", "Berdasarkan respons Anda")}
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 22px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.75,
                marginBottom: 20,
              }}>
                {t(
                  `You seem to be in the ${inferredStageRaw} stage of re-entry. That's useful to know. It gives you permission to be exactly where you are.`,
                  `Anda tampaknya berada di tahap ${inferredStageRaw} dari kembali ke tanah air. Itu berguna untuk diketahui. Anda boleh berada tepat di tempat Anda sekarang.`,
                )}
              </p>
              <button
                onClick={() => {
                  const stageMap: Record<string, string> = {
                    "Arrival": "arrival", "Kedatangan": "arrival",
                    "Collision": "collision", "Benturan": "collision",
                    "Adjustment": "adjustment", "Penyesuaian": "adjustment",
                    "Integration": "integration", "Integrasi": "integration",
                  };
                  const stageId = stageMap[inferredStageRaw];
                  if (stageId) {
                    setActiveStage(stageId);
                    document.getElementById("journey-map-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  padding: "11px 26px",
                  background: orange,
                  border: "none",
                  borderRadius: 4,
                  color: offWhite,
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                {t(
                  `See what helps in the ${inferredStageRaw} stage →`,
                  `Lihat apa yang membantu di tahap ${inferredStageRaw} →`,
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* -- Key Takeaways -------------------------------------------------- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 16,
          }}>
            {t("Key Takeaways", "Poin Utama")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 48, lineHeight: 1.2, fontStyle: "italic",
          }}>
            {t("What to Carry Forward", "Yang Perlu Dibawa")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                en: "Re-entry is its own kind of culture shock, and many people find it harder than they expected.¹ Feeling lost at home is a normal response to a real transition.",
                id: "Pulang ke tanah air adalah jenis gegar budaya tersendiri, dan banyak orang merasakannya lebih berat daripada yang mereka duga.¹ Merasa asing di rumah sendiri adalah respons yang wajar terhadap sebuah transisi yang nyata.",
              },
              {
                en: "The four stages are a map, and the months are rough guides. You may move faster or slower, or circle back for a while.⁴",
                id: "Keempat tahap ini adalah peta, dan jumlah bulannya hanya perkiraan. Anda mungkin bergerak lebih cepat atau lebih lambat, atau kembali ke tahap sebelumnya untuk sementara.⁴",
              },
              {
                en: "Grief for the people and places you left is real. Name your losses and give them room instead of hurrying past them.⁶",
                id: "Duka atas orang dan tempat yang Anda tinggalkan itu nyata. Sebutkan kehilangan Anda dan beri ruang baginya, jangan terburu-buru melewatinya.⁶",
              },
              {
                en: "Finishing well matters. RAFT helps you leave with fewer loose ends, so you carry less unfinished weight into the next season.⁷",
                id: "Mengakhiri dengan baik itu penting. RAFT menolong Anda pergi dengan lebih sedikit urusan yang tertinggal, sehingga beban yang Anda bawa ke musim berikutnya lebih ringan.⁷",
              },
              {
                en: "Time helps. In one study of long-term Christian workers, depression tended to ease the longer people had been home.⁸ While you wait, find one or two people who understand.⁵",
                id: "Waktu menolong. Dalam satu penelitian tentang pekerja Kristen jangka panjang, depresi cenderung mereda seiring makin lamanya mereka berada di rumah.⁸ Sambil menunggu, carilah satu atau dua orang yang mengerti.⁵",
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 10, padding: "24px 28px",
                borderLeft: `4px solid ${orange}`,
                display: "flex", gap: 20, alignItems: "flex-start",
              }}>
                <div style={{
                  fontFamily: serif, fontSize: "clamp(28px, 3vw, 36px)",
                  fontWeight: 700, color: orange, lineHeight: 1,
                  minWidth: 32, flexShrink: 0, marginTop: -2,
                }}>
                  {i + 1}
                </div>
                <p style={{
                  fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
                  color: bodyText, lineHeight: 1.85, margin: 0,
                }}>
                  {cite(t(item.en, item.id))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Close: The Gift ----------------------------------------------- */}
      <div style={{ background: offWhite, padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 24,
          }}>
            {t("A Final Word", "Kata Akhir")}
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(26px, 3.2vw, 40px)",
            fontWeight: 700,
            color: navy,
            lineHeight: 1.2,
            fontStyle: "italic",
            marginBottom: 32,
          }}>
            {t(
              "Your cross-cultural years are still with you, carried inside you",
              "Tahun-tahun lintas budaya Anda masih bersama Anda, tersimpan di dalam diri Anda",
            )}
          </h2>
          <p style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 20px)",
            color: bodyText,
            lineHeight: 1.9,
            marginBottom: 32,
          }}>
            {t(
              "There will come a day, probably not yet but it will come, when what you carry from those years is the most useful thing in the room. When you can see what others can't. When your fluency in discomfort becomes someone else's safety. When your theology of grief becomes a lifeline for someone just arriving where you have been. That is integration. And it is worth the long road to get there.",
              "Akan datang suatu hari, mungkin belum sekarang tetapi pasti datang, ketika apa yang Anda bawa dari tahun-tahun itu adalah hal paling berguna di ruangan. Ketika Anda bisa melihat apa yang tidak bisa dilihat orang lain. Ketika kemahiran Anda dalam ketidaknyamanan menjadi keamanan orang lain. Ketika teologi kesedihan Anda menjadi tali penyelamat bagi seseorang yang baru tiba di tempat yang pernah Anda jalani. Itulah integrasi. Dan itu layak diperjuangkan melalui jalan yang panjang.",
            )}
          </p>
          <button
            onClick={() => setActiveVerse("isa-43-18")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: orange,
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              padding: 0,
              textDecoration: "underline dotted",
              textUnderlineOffset: 3,
            }}
          >
            {lang === "en" ? VERSES["isa-43-18"].en_ref : lang === "id" ? VERSES["isa-43-18"].id_ref : VERSES["isa-43-18"].id_ref}
          </button>
        </div>
      </div>

      {/* -- Sources -------------------------------------------------------- */}
      <div style={{ background: offWhite, padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SourcesDropdown
            lang={lang}
            sources={[
              "¹ Gaw, K. F. (2000). Reverse culture shock in students returning from overseas. International Journal of Intercultural Relations, 24, 83-104. https://www.sciencedirect.com/science/article/abs/pii/S0147176799000243",
              "² Fanari, A., & Segrin, C. (2021). Longitudinal effects of U.S. students' reentry shock on psychological health after returning home during the COVID-19 global pandemic. International Journal of Intercultural Relations, 82, 298-310. https://pmc.ncbi.nlm.nih.gov/articles/PMC8530500/",
              "³ Geeraert, N., Ward, C., & Hanel, P. H. P. (2022). Returning home: The role of expectations in re-entry adaptation. Applied Psychology: Health and Well-Being, 14. https://pmc.ncbi.nlm.nih.gov/articles/PMC9541004/",
              "⁴ Wattanacharoensil, W., Talawanich, S., & Jianvittayakit, L. (2019). Multiple qualitative procedures to elicit reverse culture shock experience. MethodsX, 7, 100766. https://pmc.ncbi.nlm.nih.gov/articles/PMC6992980/",
              "⁵ Selby, S. P., Braunack-Mayer, A., Moulding, N., Jones, A., Clark, S., & Beilby, J. (2009). Resilience in re-entering missionaries: Why do some do well? Mental Health, Religion and Culture, 12(7), 701-720. https://researchnow.flinders.edu.au/en/publications/resilience-in-re-entering-missionaries-why-do-some-do-well/",
              "⁶ Selby, S. P., Clark, S., Braunack-Mayer, A., Jones, A., Moulding, N., & Beilby, J. (2009). Back home: A qualitative study exploring re-entering cross-cultural missionary aid workers' loss and grief. Omega: Journal of Death and Dying, 59(1), 19-38. https://pubmed.ncbi.nlm.nih.gov/19634504/",
              "⁷ Pollock, D. C., Van Reken, R. E., & Pollock, M. V. (2017). Third Culture Kids: The Experience of Growing Up Among Worlds (3rd ed.). Nicholas Brealey Publishing.",
              "⁸ Zavala-Barajas, S. L., Eltiti, S., & Crawford, N. (2022). Contributing factors in the successful repatriation of long-term adult Christian missionaries. Journal of Psychology and Theology. https://journals.sagepub.com/doi/10.1177/00916471221082056",
            ]}
          />
        </div>
      </div>

      {/* -- Footer nav ----------------------------------------------------- */}
      <div style={{
        padding: "48px 24px",
        background: offWhite,
        borderTop: `1px solid oklch(90% 0.01 80)`,
        display: "flex",
        gap: 16,
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved || isPending}
          aria-pressed={saved}
          aria-label={saved
            ? t("Saved to your dashboard", "Tersimpan di dasbor Anda")
            : t("Save this module to your dashboard", "Simpan modul ini ke dasbor Anda")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            minHeight: 44,
            padding: "10px 24px",
            border: "none",
            cursor: saved ? "default" : "pointer",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            background: saved ? "oklch(35% 0.05 260)" : navy,
            color: offWhite,
            letterSpacing: "0.04em",
            borderRadius: 4,
          }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
            <path d="M6 3h12v18l-6-4.5L6 21z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span>
            {saved
              ? t("Saved to Dashboard", "Tersimpan di Dasbor")
              : t("Save to Dashboard", "Simpan ke Dasbor")}
          </span>
        </button>
        <Link
          href="/resources"
          style={{
            padding: "12px 28px",
            border: `1px solid oklch(80% 0.02 260)`,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: bodyText,
            textDecoration: "none",
            borderRadius: 4,
            display: "inline-block",
          }}
        >
          {t("All Resources", "Semua Materi")}
        </Link>
        <Link
          href="/resources/healthy-transitions"
          style={{
            padding: "12px 28px",
            border: `1px solid oklch(80% 0.02 260)`,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: bodyText,
            textDecoration: "none",
            borderRadius: 4,
            display: "inline-block",
          }}
        >
          {t("Related: Healthy Transitions", "Terkait: Transisi yang Sehat")}
        </Link>
      </div>

      {/* -- Verse Modal ---------------------------------------------------- */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.05 260 / 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: offWhite,
              borderRadius: 16,
              padding: "44px 40px",
              maxWidth: 540,
              width: "100%",
              boxShadow: "0 24px 80px oklch(10% 0.05 260 / 0.35)",
            }}
          >
            <p style={{
              fontFamily: serif,
              fontSize: "clamp(20px, 2.4vw, 26px)",
              lineHeight: 1.7,
              color: navy,
              fontStyle: "italic",
              marginBottom: 20,
            }}>
              "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.id}"
            </p>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: orange,
              letterSpacing: "0.08em",
              marginBottom: 28,
            }}>
              {lang === "id" ? verseData.id_ref : verseData.en_ref}{" "}
              <span style={{ fontWeight: 400, color: bodyText }}>
                ({lang === "id" ? "TB" : "NIV"})
              </span>
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "11px 28px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 12,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              {t("Close", "Tutup")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
