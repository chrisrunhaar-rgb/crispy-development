"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

// --- BRAND TOKENS -------------------------------------------------------------
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const lightGray = "oklch(95% 0.008 80)";
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
    en_ref: "Isaiah 43:18—19",
    id_ref: "Yesaya 43:18—19",
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
    en_timeframe: "0—3 months",
    id_timeframe: "0—3 bulan",
    en_tagline: "The honeymoon that hides a wound",
    id_tagline: "Bulan madu yang menyembunyikan luka",
    en_vignette: "She walked into her parents' house and felt nothing — no relief, no joy, just a strange blankness. She smiled anyway, and everyone said how well she seemed.",
    id_vignette: "Ia masuk ke rumah orang tuanya dan tidak merasakan apa-apa — tidak ada kelegaan, tidak ada sukacita, hanya kekosongan yang aneh. Ia tetap tersenyum, dan semua orang berkata betapa baik penampilannya.",
    en_feelings: [
      "A strange flatness where you expected to feel excited or relieved",
    ],
    id_feelings: [
      "Kekosongan aneh di mana Anda berharap merasa bersemangat atau lega",
    ],
    en_traps: [
      "Staying busy to avoid sitting with the disorientation",
    ],
    id_traps: [
      "Tetap sibuk untuk menghindari duduk dengan disorientasi",
    ],
    en_helps: [
      "Name what you lost — make a list, write it down. Losses only have power when they are unnamed.",
    ],
    id_helps: [
      "Namai apa yang Anda kehilangan — buat daftar, tuliskan. Kehilangan hanya memiliki kekuatan ketika tidak disebutkan.",
    ],
    verse_key: "ps-126-5",
  },
  {
    id: "collision",
    en_title: "Collision",
    id_title: "Benturan",
    en_timeframe: "3—9 months",
    id_timeframe: "3—9 bulan",
    en_tagline: "When home no longer feels like home",
    id_tagline: "Ketika rumah tidak lagi terasa seperti rumah",
    en_vignette: "He sat across from his oldest friend and realized they had nothing to talk about. Three years ago they were inseparable. Now he felt more alone at this table than he had in the country he'd just left.",
    id_vignette: "Ia duduk berhadapan dengan teman lamanya dan menyadari bahwa mereka tidak memiliki hal yang bisa dibicarakan. Tiga tahun lalu mereka tidak terpisahkan. Sekarang ia merasa lebih kesepian di meja ini daripada di negara yang baru saja ia tinggalkan.",
    en_feelings: [
      "Grief that catches you off guard — a song, a smell, a WhatsApp message that breaks you open",
    ],
    id_feelings: [
      "Duka yang mengejutkan Anda — sebuah lagu, aroma, pesan WhatsApp yang membuat Anda merasa hancur",
    ],
    en_traps: [
      "Idealising where you came from ('back there, everything was more real')",
    ],
    id_traps: [
      "Mengidealisasi tempat asal ('di sana, segalanya lebih nyata')",
    ],
    en_helps: [
      "Let the grief come. Grief is proof that what you had was real — don't rush past it or spiritualise it away.",
    ],
    id_helps: [
      "Biarkan duka datang. Duka adalah bukti bahwa apa yang Anda miliki itu nyata — jangan terburu-buru melewatinya atau mengspiritualkan.",
    ],
    verse_key: "rom-12-2",
  },
  {
    id: "adjustment",
    en_title: "Adjustment",
    id_title: "Penyesuaian",
    en_timeframe: "9—18 months",
    id_timeframe: "9—18 bulan",
    en_tagline: "Finding the ground beneath your feet again",
    id_tagline: "Menemukan kembali pijakan di bawah kaki Anda",
    en_vignette: "She still thought about Jakarta every day. But she had started running a new route near her house, and she noticed she looked forward to it. That felt significant.",
    id_vignette: "Ia masih memikirkan Jakarta setiap hari. Tetapi ia mulai berlari di rute baru dekat rumahnya, dan ia menyadari bahwa ia menantikannya. Itu terasa bermakna.",
    en_feelings: [
      "Moments of genuine belonging that surprise you — followed by guilt for not missing it more",
    ],
    id_feelings: [
      "Momen-momen kebersamaan sejati yang mengejutkan Anda — diikuti oleh rasa bersalah karena tidak merindukan lebih banyak",
    ],
    en_traps: [
      "Feeling guilty for adjusting — as though belonging here means betraying there",
    ],
    id_traps: [
      "Merasa bersalah karena menyesuaikan diri — seolah-olah menjadi bagian di sini berarti mengkhianati di sana",
    ],
    en_helps: [
      "Give yourself permission to belong here without conditions. Adjusting is not betrayal — it is faithfulness to where God has placed you now.",
    ],
    id_helps: [
      "Izinkan diri Anda untuk menjadi bagian di sini tanpa syarat. Menyesuaikan diri bukan pengkhianatan — itu kesetiaan pada tempat yang Tuhan tempatkan Anda sekarang.",
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
      "A settled sense of who you are — not defined by where you have been, but shaped by it",
    ],
    id_feelings: [
      "Rasa yang tenang tentang siapa Anda — tidak didefinisikan oleh tempat Anda telah berada, tetapi dibentuk olehnya",
    ],
    en_traps: [
      "Assuming integration means the grief is gone — it has simply found its rightful place",
    ],
    id_traps: [
      "Menganggap integrasi berarti duka sudah hilang — itu hanya telah menemukan tempatnya yang tepat",
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
    en_body: "Before you left, did you seek peace with those relationships that were strained? If not, the work still waits — even across distance. Unreconciled relationships travel with you and surface in unexpected places.",
    id_body: "Sebelum Anda pergi, apakah Anda mencari perdamaian dengan hubungan-hubungan yang tegang? Jika tidak, pekerjaan itu masih menunggu — bahkan melintasi jarak. Hubungan yang belum direkonsiliasi ikut bersama Anda dan muncul di tempat-tempat yang tidak terduga.",
    en_question: "Is there a relationship from your time overseas that you left without resolution? What would one step toward peace look like — even now?",
    id_question: "Apakah ada hubungan dari masa Anda di luar negeri yang Anda tinggalkan tanpa penyelesaian? Seperti apa satu langkah menuju perdamaian — bahkan sekarang?",
  },
  {
    letter: "A",
    en_title: "Affirmation",
    id_title: "Peneguhan",
    en_body: "Did you tell the people who shaped you what they meant? Most people leave without closing this loop — and the people left behind carry an unnamed loss. Affirmation is not sentimentality. It is the deliberate act of honouring a person before you go.",
    id_body: "Apakah Anda memberitahu orang-orang yang membentuk Anda apa artinya mereka? Kebanyakan orang pergi tanpa menutup lingkaran ini — dan orang-orang yang ditinggalkan menanggung kehilangan yang tidak disebutkan. Peneguhan bukan sentimentalitas. Itu adalah tindakan yang disengaja untuk menghormati seseorang sebelum Anda pergi.",
    en_question: "Who are the 3—5 people from your cross-cultural season who most shaped you? Have you told them specifically — not generally — what they gave you?",
    id_question: "Siapa 3—5 orang dari musim lintas budaya Anda yang paling membentuk Anda? Apakah Anda sudah memberitahu mereka secara spesifik — bukan secara umum — apa yang mereka berikan kepada Anda?",
  },
  {
    letter: "F",
    en_title: "Farewells",
    id_title: "Perpisahan",
    en_body: "Grief that isn't expressed doesn't disappear — it gets stored. Unexpressed farewells become emotional weight you carry into the next season. Saying goodbye to a place, a community, a language, or a rhythm of life is not weakness. It is the evidence that what you had was real.",
    id_body: "Duka yang tidak diungkapkan tidak hilang — itu tersimpan. Perpisahan yang tidak diungkapkan menjadi beban emosional yang Anda bawa ke musim berikutnya. Mengucapkan selamat tinggal pada sebuah tempat, komunitas, bahasa, atau ritme kehidupan bukan kelemahan. Itu adalah bukti bahwa apa yang Anda miliki itu nyata.",
    en_question: "What did you not get to grieve before or during the transition? What do you still carry that hasn't been given its proper goodbye?",
    id_question: "Apa yang tidak bisa Anda berdukacitakan sebelum atau selama transisi? Apa yang masih Anda bawa yang belum mendapatkan perpisahan yang layak?",
  },
  {
    letter: "T",
    en_title: "Think Ahead",
    id_title: "Persiapkan Masa Depan",
    en_body: "The returning well journey has predictable stages. Knowing that Collision is coming — and that it is temporary — changes your relationship to it entirely. Naming the road ahead is not pessimism. It is wisdom that shortens the hard seasons.",
    id_body: "Perjalanan kembali dengan baik memiliki tahapan yang dapat diprediksi. Mengetahui bahwa Benturan akan datang — dan itu sementara — mengubah hubungan Anda dengannya sepenuhnya. Menamai jalan di depan bukan pesimisme. Itu adalah kebijaksanaan yang mempersingkat musim-musim yang berat.",
    en_question: "Which stage of the journey do you think is hardest for you personally — and what one thing could you put in place now to help when you arrive there?",
    id_question: "Menurut Anda, tahap perjalanan mana yang paling sulit bagi Anda secara pribadi — dan satu hal apa yang bisa Anda siapkan sekarang untuk membantu saat Anda tiba di sana?",
  },
];

// --- REFLECTION STATEMENTS ---------------------------------------------------
const REFLECTION_STATEMENTS = [
  {
    en: "I have moments of genuine joy in my home culture, but they're followed by guilt — like I shouldn't be enjoying it here.",
    id: "Saya memiliki momen-momen sukacita sejati dalam budaya asal saya, tetapi diikuti oleh rasa bersalah — seolah saya tidak seharusnya menikmatinya di sini.",
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
    en: "I find myself constantly comparing my home culture unfavourably to where I came from — the pace, the priorities, the conversations.",
    id: "Saya terus-menerus membandingkan budaya asal saya dengan tidak menguntungkan dibandingkan tempat asal saya — kecepatan, prioritas, percakapan.",
    en_stage: "Collision",
    id_stage: "Benturan",
  },
  {
    en: "There are relationships I left without saying what I needed to say — and I still feel the weight of that.",
    id: "Ada hubungan yang saya tinggalkan tanpa mengatakan apa yang perlu saya katakan — dan saya masih merasakan beratnya itu.",
    en_stage: "Arrival",
    id_stage: "Kedatangan",
  },
  {
    en: "I can see things in groups and teams that others miss — cross-cultural dynamics, unspoken tensions, misread signals. That feels like a gift now.",
    id: "Saya bisa melihat hal-hal dalam kelompok dan tim yang dilewatkan orang lain — dinamika lintas budaya, ketegangan yang tidak terucapkan, sinyal yang salah dibaca. Itu terasa seperti karunia sekarang.",
    en_stage: "Integration",
    id_stage: "Integrasi",
  },
];

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

  // JOURNEY_STAGES always has 4 members — activeStage is always a valid id
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
      <div style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <p style={{
            color: orange,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}>
            {t(
              "Personal Development — Article",
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
              "Nobody warns you about this part. You prepared for the cross-cultural move — the language, the culture, the discomfort of being foreign. But nobody told you that coming home can be harder than going. That the country you return to is not the one you left. That you are not the person who left either. This module is for the journey no one prepared you for.",
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "13px 30px",
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
              {saved
                ? t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* -- Re-entry Explained --------------------------------------------- */}
      <div style={{ padding: "96px 24px 64px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{
          fontFamily: serif,
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: orange,
          marginBottom: 28,
        }}>
          {t("What Is Re-Entry?", "Apa Itu Kembali ke Tanah Air?", "Wat Is Re-Integratie?")}
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
            "Reverse culture shock is real — and it's often harder than the original",
          )}
        </h2>
        <div style={{ fontSize: "clamp(16px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "When you moved cross-culturally, everyone around you expected it to be difficult. They offered support, sent care packages, checked in. There was a structure of expectation that gave you permission to struggle.",
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "When you come back, no one extends that grace. People assume you are relieved. They assume you are home. What they don't understand — what you may not have understood either — is that re-entry is its own form of culture shock. Researchers call it reverse culture shock, and studies consistently show it is more destabilising than the original adjustment.",
            )}
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
              "You changed. The people you left didn't — at least not in the same direction. The gap between who you became and who they expected you to be is where the collision happens.",
            )}
          </blockquote>
          <p style={{ marginBottom: 0 }}>
            {t(
              "This module maps the journey. It names the stages, normalises what you are likely feeling, and gives you practical tools for each phase. It also holds the belief that what happened to you in your cross-cultural years was not wasted — it is a gift still being unwrapped.",
            )}
          </p>
        </div>
      </div>

      {/* -- Journey Map ---------------------------------------------------- */}
      <div style={{ background: lightGray, padding: "80px 0 96px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 20,
            }}>
              {t("The Re-Entry Journey", "Perjalanan Kembali ke Tanah Air", "De Re-Integratiereis")}
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
                "Four stages — and where you might be right now",
              )}
            </h2>
          </div>

          {/* Stage selector — horizontal arc */}
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
                  {t("Faith Anchor", "Jangkar Iman", "Geloofanker")} ?
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
                  {t("What You Might Be Feeling", "Yang Mungkin Anda Rasakan", "Wat Je Misschien Voelt")}
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
                  {t("Traps to Watch For", "Jebakan yang Perlu Diwaspadai", "Valkuilen om op te Letten")}
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
                  {t("What Actually Helps", "Yang Sebenarnya Membantu", "Wat Echt Helpt")}
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
                        {h}
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
      <div style={{ padding: "96px 24px 96px", maxWidth: 960, margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 20,
          }}>
            {t("A Tool for the Transition", "Alat untuk Transisi", "Een Hulpmiddel voor de Transitie")}
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
            {t("The RAFT Model", "Model RAFT", "Het RAFT-model")}
          </h2>
          <p style={{
            fontSize: "clamp(15px, 1.7vw, 17px)",
            color: bodyText,
            lineHeight: 1.8,
            maxWidth: 600,
            margin: "0 auto",
          }}>
            {t(
              "Developed by Dave Pollock and Ruth Van Reken, RAFT is a framework for finishing well — so that what you carry into the next season is freedom, not unfinished weight.",
            )}
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
                    {isOpen ? t("click to close", "klik untuk tutup", "klik om te sluiten") : t("click to explore", "klik untuk jelajahi", "klik om te verkennen")}
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
                        {t("Reflection Question", "Pertanyaan Refleksi", "Reflectievraag")}
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
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 24,
          }}>
            {t("Biblical Foundation", "Dasar Alkitabiah", "Bijbelse Fundering")}
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
              "Re-entry is not a modern problem — it is a biblical one",
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
              {t("Joseph — Genesis 45", "Yusuf — Kejadian 45", "Jozef — Genesis 45")}
            </p>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.85,
              marginBottom: 20,
            }}>
              {t(
                "Joseph spent years in Egypt — as a slave, as a prisoner, as a senior official. He was thoroughly cross-cultural long before that was a category. When his brothers arrived, he had to manage the collision of his two worlds: the boy they remembered, and the man he had become. His weeping was not weakness — it was the natural overflow of a person who had been holding two worlds apart for years, and whose integration finally arrived.",
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
              {t("Ruth — A stranger returning to a stranger's land", "Rut — Orang asing yang kembali ke tanah orang asing", "Ruth — Een vreemdeling die terugkeert naar een vreemd land")}
            </p>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.85,
              marginBottom: 20,
            }}>
              {t(
                "Ruth's story is the inverse of re-entry — she chose to enter a foreign culture permanently, leaving everything familiar behind. But her experience mirrors what returning cross-cultural workers feel: the grief of leaving a people she loved, the courage of committing fully to a new place, the slow and costly work of being known as a foreigner in the place you now call home. What she modelled — wholehearted commitment in the face of complete uncertainty — is the same posture integration asks of you.",
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
                "The grief of re-entry is not a sign that something has gone wrong. It is a sign that something was real. Psalm 126 holds both realities — 'those who sow with tears will reap with songs of joy.' The sowing and the harvest are not separate stories. They are one story, told across time.",
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
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 20,
            }}>
              {t("Self-Assessment", "Penilaian Diri", "Zelfbeoordeling")}
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
              {t("Where are you right now?", "Di mana Anda berada sekarang?", "Waar ben je nu?")}
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
                      {t("This is me", "Ini saya", "Dit ben ik")}
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
                      {t("Not yet", "Belum", "Nog niet")}
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
                {t("Based on your responses", "Berdasarkan respons Anda", "Op basis van je antwoorden")}
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
                  `You seem to be in the ${inferredStageRaw} stage of re-entry. That's valuable information — not to label you, but to give you permission to be exactly where you are.`,
                  `Anda tampaknya berada di tahap ${inferredStageRaw} dari kembali ke tanah air. Itu informasi yang berharga — bukan untuk memberi label Anda, tetapi untuk memberi Anda izin menjadi tepat di mana Anda berada.`,
                  `Je lijkt je in de ${inferredStageRaw}-fase van re-integratie te bevinden. Dat is waardevolle informatie — niet om je te labelen, maar om je toestemming te geven precies te zijn waar je bent.`
                )}
              </p>
              <button
                onClick={() => {
                  const stageMap: Record<string, string> = {
                    "Arrival": "arrival", "Kedatangan": "arrival", "Aankomst": "arrival",
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
                  `See what helps in the ${inferredStageRaw} stage ?`,
                  `Lihat apa yang membantu di tahap ${inferredStageRaw} ?`,
                  `Zie wat helpt in de ${inferredStageRaw}-fase ?`
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* -- Close — The Gift ----------------------------------------------- */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 24,
          }}>
            {t("A Final Word", "Kata Akhir", "Een Laatste Woord")}
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
              "Your cross-cultural years are not behind you — they are inside you",
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
              "There will come a day — probably not yet, but it will come — when what you carry from those years is the most useful thing in the room. When you can see what others can't. When your fluency in discomfort becomes someone else's safety. When your theology of grief becomes a lifeline for someone just arriving where you have been. That is integration. And it is worth the long road to get there.",
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
          onClick={handleSave}
          disabled={saved || isPending}
          style={{
            padding: "12px 28px",
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
          {saved
            ? t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")
            : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
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
          {t("All Resources", "Semua Sumber", "Alle Bronnen")}
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
          {t("Related: Healthy Transitions", "Terkait: Transisi yang Sehat", "Gerelateerd: Gezonde Transities")}
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
              — {lang === "id" ? verseData.id_ref : verseData.en_ref}{" "}
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
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
