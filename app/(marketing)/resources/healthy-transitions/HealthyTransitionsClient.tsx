"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard, saveRaftPlan } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) => lang === "id" ? id : en;

// --- VERSE DATA ---

const VERSES = {
  "luke-24-17": {
    en_ref: "Luke 24:17",
    id_ref: "Lukas 24:17",
    en: "'What are you discussing together as you walk along?' They stood still, their faces downcast.",
    id: "'Apakah yang kamu percakapkan sementara kamu berjalan?' Dan mereka berhenti dengan muka muram.",
  },
  "ruth-1-16": {
    en_ref: "Ruth 1:16",
    id_ref: "Rut 1:16",
    en: "But Ruth replied, 'Don't urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay.'",
    id: "Tetapi kata Rut: 'Janganlah desak aku meninggalkan engkau dan pulang dengan tidak membawamu, sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam.'",
  },
};

// --- RAFT STEPS ---

const RAFT_STEPS = [
  {
    letter: "R",
    id_letter: "R",
    en_title: "Reconciliation",
    id_title: "Rekonsiliasi",
    en_tagline: "Straighten out what is strained before you leave.",
    id_tagline: "Perbaiki hubungan yang tegang sebelum Anda pergi.",
    en_body: `You don't have to fix everything. You don't have to resolve every misunderstanding or win every argument. But you do need to seek peace where peace is possible. Leaving without doing so carries the weight of those broken threads into your next season, and into the next team that receives you.`,
    id_body: `Anda tidak perlu memperbaiki segalanya. Tidak perlu menyelesaikan setiap kesalahpahaman atau memenangkan setiap argumen. Tetapi Anda perlu mencari perdamaian di mana perdamaian dimungkinkan. Pergi tanpa melakukan hal ini membawa beban hubungan yang putus ke musim berikutnya, dan ke tim berikutnya yang menerima Anda.`,
    en_how: [
      "Name the relationship that is strained. Don't avoid it.",
      "Initiate contact. You go first, even if you're not sure you were wrong.",
      "Say: \"Before I leave, I want to make sure there's nothing unresolved between us.\"",
      "If the other person refuses reconciliation, that is theirs to carry. You can only be responsible for your own step toward peace.",
    ],
    id_how: [
      "Namai hubungan yang tegang. Jangan hindari.",
      "Ambil inisiatif. Anda yang pertama melangkah, meskipun Anda tidak yakin apakah Anda yang salah.",
      "Katakan: \"Sebelum saya pergi, saya ingin memastikan tidak ada yang belum terselesaikan di antara kita.\"",
      "Jika orang lain menolak rekonsiliasi, itu menjadi tanggung jawab mereka. Anda hanya bertanggung jawab atas langkah Anda sendiri menuju perdamaian.",
    ],
  },
  {
    letter: "A",
    id_letter: "P",
    en_title: "Affirmation",
    id_title: "Peneguhan",
    en_tagline: "Intentionally honour those who shaped you.",
    id_tagline: "Dengan sengaja hargai mereka yang membentuk Anda.",
    en_body: `Most people leave without ever telling the people who mattered most what they meant. An affirmation is not flattery. It is a deliberate act of closing an emotional loop. It says: I saw you. You shaped me. That will not be forgotten.`,
    id_body: `Kebanyakan orang pergi tanpa pernah memberitahu orang-orang yang paling berarti tentang apa artinya mereka. Peneguhan bukan sanjungan. Itu adalah tindakan yang disengaja untuk menutup lingkaran emosional. Ini berkata: Saya melihat Anda. Anda membentuk saya. Itu tidak akan terlupakan.`,
    en_how: [
      "Make a list of 5 to 10 people who have shaped you in this season.",
      "Be specific: not \"you were such a support\" but \"when you stayed with me through that crisis in September, it changed me.\"",
      "Deliver it in a way that fits the relationship: a handwritten note, a face-to-face conversation, a voice message.",
      "Create a small ritual: a meal, a walk, a gathering. Something your body and theirs will remember.",
    ],
    id_how: [
      "Buat daftar 5 hingga 10 orang yang telah membentuk Anda di musim ini.",
      "Jadilah spesifik: bukan 'kamu sangat mendukung' tetapi 'ketika kamu tetap bersamaku melalui krisis September itu, itu mengubahku.'",
      "Sampaikan dengan cara yang sesuai dengan hubungan: catatan tulisan tangan, percakapan langsung, pesan suara.",
      "Ciptakan ritual kecil: makan bersama, jalan-jalan, pertemuan. Sesuatu yang akan diingat oleh tubuh Anda dan mereka.",
    ],
  },
  {
    letter: "F",
    id_letter: "P",
    en_title: "Farewells",
    id_title: "Perpisahan",
    en_tagline: "Say goodbye to people, places, and even things.",
    id_tagline: "Ucapkan selamat tinggal kepada orang, tempat, bahkan benda.",
    en_body: `Grief that is not expressed does not disappear. Uncried tears become emotional baggage. You carry them into the next place and wonder why you feel heavy there. Farewells create a container for grief. They say: this mattered, and now it is changing. Grief is the proof that something was real.`,
    id_body: `Kesedihan yang tidak diungkapkan tidak hilang. Air mata yang tidak ditangiskan menjadi beban emosional. Anda membawanya ke tempat berikutnya dan bertanya-tanya mengapa Anda merasa berat di sana. Perpisahan menciptakan wadah untuk kesedihan. Mereka berkata: ini penting, dan sekarang ini berubah. Duka adalah bukti bahwa sesuatu itu nyata.`,
    en_how: [
      "Visit places that hold meaning: a favourite café, the office, a neighbourhood where you walked and prayed.",
      "Allow yourself to feel the sadness. Don't spiritualise it away with \"God has something better.\" That may be true, and grief is also valid.",
      "Say goodbye to objects and possessions where appropriate. Belongings you are leaving behind carry memory.",
      "Give children and young people on your team their own age-appropriate farewell rituals. Don't rush them through.",
    ],
    id_how: [
      "Kunjungi tempat-tempat yang bermakna: kafe favorit, kantor, lingkungan tempat Anda berjalan dan berdoa.",
      "Izinkan diri Anda merasakan kesedihan. Jangan spiritualisasi dengan 'Tuhan punya sesuatu yang lebih baik.' Itu mungkin benar, dan duka juga sah.",
      "Ucapkan selamat tinggal pada benda-benda dan milik di mana sesuai. Barang bawaan yang Anda tinggalkan membawa kenangan.",
      "Berikan anak-anak dan orang muda di tim Anda ritual perpisahan yang sesuai usia mereka sendiri. Jangan terburu-buru.",
    ],
  },
  {
    letter: "T",
    id_letter: "P",
    en_title: "Think Ahead",
    id_title: "Persiapkan Masa Depan",
    en_tagline: "Prepare mentally and practically for what comes next.",
    id_tagline: "Persiapkan diri secara mental dan praktis untuk apa yang akan datang.",
    en_body: `Most people skip this step. They are so focused on closing out the current season that they arrive in the new one completely unprepared, and then wonder why they feel lost. A disorientation phase early in transition is widely reported across transition literature.³ Planning for it before it arrives changes everything.`,
    id_body: `Kebanyakan orang melewati langkah ini. Mereka begitu fokus pada penutupan musim saat ini sehingga mereka tiba di musim baru dengan sama sekali tidak siap, dan kemudian bertanya-tanya mengapa mereka merasa tersesat. Fase disorientasi di awal transisi banyak dilaporkan di seluruh literatur transisi.³ Merencanakannya sebelum datang mengubah segalanya.`,
    en_how: [
      "Research your new context before you arrive: culture, pace of life, communication styles, what is normal.",
      "Identify your first safe anchor: one relationship, one community, one rhythm you can build around immediately.",
      "Tell yourself in advance: the first 3 to 6 months will feel disorienting. This is normal. It does not mean you made the wrong choice.",
      "Build in a formal debrief or check-in with someone you trust at the 3-month mark. Not to fix everything, but to name what you are experiencing.",
    ],
    id_how: [
      "Teliti konteks baru Anda sebelum tiba: budaya, tempo hidup, gaya komunikasi, apa yang normal.",
      "Identifikasi jangkar aman pertama Anda: satu hubungan, satu komunitas, satu ritme yang bisa Anda bangun segera.",
      "Beritahu diri sendiri terlebih dahulu: 3 hingga 6 bulan pertama akan terasa membingungkan. Ini normal. Ini tidak berarti Anda membuat pilihan yang salah.",
      "Rencanakan debriefing formal atau check-in dengan seseorang yang Anda percaya pada tanda 3 bulan. Bukan untuk memperbaiki segalanya, tetapi untuk menamai apa yang Anda alami.",
    ],
  },
];

// --- TRANSITION PHASES ---

const TRANSITION_PHASES = [
  {
    en_phase: "Departure",
    id_phase: "Kepergian",
    en_description: "The final weeks before leaving. Often marked by a mix of grief, excitement, and productivity collapse. Relationships intensify. Unresolved things surface.",
    id_description: "Minggu-minggu terakhir sebelum pergi. Sering ditandai dengan campuran duka, kegembiraan, dan kemerosotan produktivitas. Hubungan menguat. Hal-hal yang belum terselesaikan muncul ke permukaan.",
  },
  {
    en_phase: "Chaos",
    id_phase: "Kekacauan",
    en_description: "The first weeks to months in the new context. Disorientation, cognitive overload, emotional flatness. Everything requires effort. Simple tasks feel hard. For most people, this phase eases with time — though how long varies significantly by person and cultural distance.⁴",
    id_description: "Minggu hingga bulan pertama dalam konteks baru. Disorientasi, kelebihan beban kognitif, kelesuan emosional. Segalanya membutuhkan usaha. Tugas sederhana terasa sulit. Bagi kebanyakan orang, fase ini berkurang seiring waktu — meskipun berapa lama bervariasi secara signifikan berdasarkan orang dan jarak budaya.⁴",
  },
  {
    en_phase: "Adjustment",
    id_phase: "Penyesuaian",
    en_description: "Slowly, patterns form. The new context starts to make sense. You find rhythms, relationships begin to root. You stop comparing everything to what came before.",
    id_description: "Perlahan-lahan, pola terbentuk. Konteks baru mulai masuk akal. Anda menemukan ritme, hubungan mulai berakar. Anda berhenti membandingkan segalanya dengan yang datang sebelumnya.",
  },
  {
    en_phase: "Reattachment",
    id_phase: "Keterlibatan Kembali",
    en_description: "You belong again. Not the same as before, differently. You have integrated the loss and the new beginning. You can give yourself fully to where you are.",
    id_description: "Anda memiliki rasa memiliki kembali. Tidak sama seperti sebelumnya, dengan cara yang berbeda. Anda telah mengintegrasikan kehilangan dan awal baru. Anda bisa memberikan diri sepenuhnya untuk di mana Anda berada.",
  },
];

// --- PLANNER PROMPTS ---

const PLANNER_PROMPTS = [
  {
    letter: "R",
    id_letter: "R",
    en_question: "Is there a relationship I am leaving with unresolved tension? What would one step toward reconciliation look like, even if the outcome is uncertain?",
    id_question: "Apakah ada hubungan yang saya tinggalkan dengan ketegangan yang belum terselesaikan? Seperti apa satu langkah menuju rekonsiliasi, bahkan jika hasilnya tidak pasti?",
  },
  {
    letter: "A",
    id_letter: "P",
    en_question: "Who are the 3 to 5 people I most want to affirm before I leave? What specific thing did they do or say that I want to honour?",
    id_question: "Siapa 3 hingga 5 orang yang paling ingin saya teguhkan sebelum saya pergi? Apa hal spesifik yang mereka lakukan atau katakan yang ingin saya hargai?",
  },
  {
    letter: "F",
    id_letter: "P",
    en_question: "What places, routines, or relationships will I grieve the most? Have I allowed myself space to feel that, or have I been rushing past it?",
    id_question: "Tempat, rutinitas, atau hubungan apa yang paling saya rindukan? Apakah saya sudah memberikan diri sendiri ruang untuk merasakannya, atau apakah saya telah terburu-buru melewatinya?",
  },
  {
    letter: "T",
    id_letter: "P",
    en_question: "What do I know about the new context I am entering? What is my plan for the first 90 days, and who will I check in with at the 3-month mark?",
    id_question: "Apa yang saya ketahui tentang konteks baru yang saya masuki? Apa rencana saya untuk 90 hari pertama, dan dengan siapa saya akan check-in pada tanda 3 bulan?",
  },
];

// --- COMPONENT ---

type Props = { userPathway: string | null; isSaved: boolean };

export default function HealthyTransitionsClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [planSavePending, startPlanTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeRaft, setActiveRaft] = useState<number | null>(null);
  const [plannerAnswers, setPlannerAnswers] = useState(["", "", "", ""]);
  const [plannerSubmitted, setPlannerSubmitted] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);

  const t = (en: string, id: string) => tFn(en, id, lang);

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(96% 0.005 80)";
  const lightGray = "oklch(88% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("healthy-transitions");
      setSaved(true);
    });
  }

  function handlePlanSubmit() {
    if (!allPlannerFilled) return;
    setPlannerSubmitted(true);
    startPlanTransition(async () => {
      const result = await saveRaftPlan(
        { R: plannerAnswers[0], A: plannerAnswers[1], F: plannerAnswers[2], T: plannerAnswers[3] },
        lang
      );
      if (!result.error) setPlanSaved(true);
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
      <LangToggle />

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px", position: "relative", overflow: "hidden" }}>
        <img
          src="/images/resources/healthy-transitions/hero.jpg"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development", "Pengembangan Pribadi")}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Healthy Transitions", "Transisi yang Sehat")}
          </h1>
          <div style={{ width: 48, height: 1, background: orange, margin: "0 auto 32px" }} />
          <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2.3vw, 22px)", color: "oklch(82% 0.025 80)", lineHeight: 1.8, marginBottom: 48, fontStyle: "italic", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Most people don't leave well. They disappear into the busyness of packing, the relief of finishing, the anxiety of what's next. The relationships they leave behind carry the unfinished weight for years. The RAFT model exists because transitions done poorly leave lasting damage.¹ Transitions done well set you, and everyone you leave behind, free.",
              "Kebanyakan orang tidak pergi dengan baik. Mereka menghilang ke dalam kesibukan mengemas, lega karena selesai, kecemasan tentang apa selanjutnya. Hubungan yang mereka tinggalkan menanggung beban yang belum selesai selama bertahun-tahun. Model RPPP ada karena transisi yang dilakukan dengan buruk meninggalkan kerusakan yang bertahan lama. Transisi yang dilakukan dengan baik membebaskan Anda, dan semua orang yang Anda tinggalkan."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "12px 28px",
                border: `1px solid ${offWhite}`,
                background: "transparent",
                cursor: saved ? "default" : "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                color: offWhite, letterSpacing: "0.04em", borderRadius: 4,
                opacity: saved || isPending ? 0.7 : 1,
              }}
            >
              {saved
                ? t("Saved to Dashboard", "Tersimpan di Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* Section I: The Reality */}
      <div style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("I. The Reality", "I. Realitas")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("Transitions Done Poorly Cost More Than You Know", "Transisi yang Dilakukan dengan Buruk Merugikan Lebih dari yang Anda Tahu")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Cross-cultural leaders move frequently. They leave teams, countries, roles, and communities more often than almost anyone else in their field. And yet most organisations and most people treat the leaving as an afterthought: something to survive, not something to do with care.",
                "Pemimpin lintas budaya sering berpindah. Mereka meninggalkan tim, negara, peran, dan komunitas lebih sering dari hampir siapa pun di bidangnya. Namun sebagian besar organisasi dan kebanyakan orang memperlakukan kepergian sebagai hal yang tidak penting: sesuatu untuk ditanggung, bukan sesuatu yang harus dilakukan dengan penuh perhatian."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Research on attrition and cross-cultural departure consistently finds the same pattern: the way people leave predicts how they arrive in the next place.² Leaders who leave without reconciling unresolved conflict bring that conflict into new teams. Those who never grieve a leaving arrive emotionally numb in the next community. Those who don't prepare for the chaos of re-entry are blindsided by how disorienting it is.",
                "Penelitian tentang atrisi dan kepergian lintas budaya secara konsisten menemukan pola yang sama: cara orang pergi memprediksi bagaimana mereka tiba di tempat berikutnya.² Pemimpin yang pergi tanpa menyelesaikan konflik yang belum terselesaikan membawa konflik itu ke tim baru. Mereka yang tidak pernah berduka atas kepergian tiba secara emosional mati rasa di komunitas berikutnya. Mereka yang tidak mempersiapkan diri menghadapi kekacauan kepulangan terkejut betapa mengganggu itu."
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`, marginBottom: 28 }}>
              {t(
                "A healthy transition is not about making the leaving comfortable. It is about being fully present to the ending, so you can be fully present to the beginning.",
                "Transisi yang sehat bukan tentang membuat kepergian menjadi nyaman. Ini tentang hadir sepenuhnya pada akhir, sehingga Anda bisa hadir sepenuhnya pada awal."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "David Pollock, who spent decades working with cross-cultural families, developed the RAFT model as a widely trusted practitioner framework for doing the emotional and relational work of leaving well.¹ The four letters each name a domain of work that most leaders neglect. None of them require extraordinary courage. They require intention.",
                "David Pollock, yang menghabiskan beberapa dekade bekerja dengan keluarga lintas budaya, mengembangkan model RPPP sebagai kerangka praktisi yang dipercaya luas untuk melakukan pekerjaan emosional dan relasional dalam pergi dengan baik.¹ Keempat huruf masing-masing menamai domain pekerjaan yang diabaikan oleh kebanyakan pemimpin. Tidak ada yang memerlukan keberanian luar biasa. Mereka memerlukan niat."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section II: The RAFT Model */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center" }}>
            {t("II. The Framework", "II. Kerangka Kerja")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("The RAFT Model", "Model RPPP")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 64, textAlign: "center", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Four domains of relational and emotional work. Each builds on the previous. Together they make it possible to leave well.",
              "Empat domain pekerjaan relasional dan emosional. Masing-masing dibangun di atas yang sebelumnya. Bersama-sama mereka memungkinkan kepergian yang baik."
            )}
          </p>

          {/* Step selector circles */}
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
                {lang === "id" ? step.id_letter : step.letter}
              </button>
            ))}
          </div>

          {/* Step labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 64, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            {RAFT_STEPS.map((step, i) => (
              <p key={i} style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                color: activeRaft === i ? orange : bodyText,
                letterSpacing: "0.05em", textAlign: "center", margin: 0,
                textTransform: "uppercase",
              }}>
                {lang === "id" ? step.id_title : step.en_title}
              </p>
            ))}
          </div>

          {/* Active step content */}
          {activeRaft === null ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, fontStyle: "italic", lineHeight: 1.8 }}>
                {t(
                  "Select a letter above to explore each step of the RAFT journey.",
                  "Pilih huruf di atas untuk menjelajahi setiap langkah perjalanan RPPP."
                )}
              </p>
            </div>
          ) : (
            <div style={{ background: offWhite, borderRadius: 8, padding: "48px 48px 40px", boxShadow: "0 2px 24px oklch(20% 0.05 260 / 0.07)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 36 }}>
                <div style={{ fontFamily: serif, fontSize: "clamp(56px, 7vw, 80px)", fontWeight: 700, color: orange, lineHeight: 1, flexShrink: 0, fontStyle: "italic" }}>
                  {lang === "id" ? RAFT_STEPS[activeRaft].id_letter : RAFT_STEPS[activeRaft].letter}
                </div>
                <div>
                  <h3 style={{ fontFamily: serif, fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 700, color: navy, fontStyle: "italic", margin: "0 0 10px" }}>
                    {lang === "id" ? RAFT_STEPS[activeRaft].id_title : RAFT_STEPS[activeRaft].en_title}
                  </h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: orange, letterSpacing: "0.04em", margin: 0 }}>
                    {lang === "id" ? RAFT_STEPS[activeRaft].id_tagline : RAFT_STEPS[activeRaft].en_tagline}
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9, marginBottom: 36 }}>
                {lang === "id" ? RAFT_STEPS[activeRaft].id_body : RAFT_STEPS[activeRaft].en_body}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: navy, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
                {t("How to do it", "Cara melakukannya")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {(lang === "id" ? RAFT_STEPS[activeRaft].id_how : RAFT_STEPS[activeRaft].en_how).map((item, idx) => (
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
              {/* Step navigation */}
              <div style={{ display: "flex", gap: 12, marginTop: 40, justifyContent: "flex-end" }}>
                {activeRaft > 0 && (
                  <button
                    onClick={() => setActiveRaft(activeRaft - 1)}
                    style={{ padding: "10px 22px", background: "transparent", border: `1px solid oklch(80% 0.01 80)`, borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: bodyText, cursor: "pointer", letterSpacing: "0.04em" }}
                  >
                    ← {lang === "id" ? RAFT_STEPS[activeRaft - 1].id_title : RAFT_STEPS[activeRaft - 1].en_title}
                  </button>
                )}
                {activeRaft < RAFT_STEPS.length - 1 && (
                  <button
                    onClick={() => setActiveRaft(activeRaft + 1)}
                    style={{ padding: "10px 22px", background: navy, border: "none", borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: offWhite, cursor: "pointer", letterSpacing: "0.04em" }}
                  >
                    {lang === "id" ? RAFT_STEPS[activeRaft + 1].id_title : RAFT_STEPS[activeRaft + 1].en_title} →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "oklch(90% 0.008 80)" }} />
      </div>

      {/* Section III: Transition Phases */}
      <div style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("III. The Curve", "III. Kurva Transisi")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("What to Expect in the Middle", "Apa yang Diharapkan di Tengah Perjalanan")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 56 }}>
            {t(
              "Knowing the curve doesn't make it easy. But it makes it less frightening, because you can name what is happening rather than being swallowed by it. These four phases are a directional normalising map drawn from transition literature³ — a way of naming common experiences, not a guaranteed sequence. Individual and cultural contexts vary considerably.",
              "Mengetahui kurva tidak membuatnya mudah. Tetapi itu membuatnya kurang menakutkan, karena Anda bisa menamai apa yang terjadi daripada ditelan olehnya. Keempat fase ini adalah peta normalisasi arah yang diambil dari literatur transisi³ — cara untuk menamai pengalaman umum, bukan urutan yang dijamin. Konteks individu dan budaya sangat bervariasi."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TRANSITION_PHASES.map((phase, i) => (
              <div key={i} style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
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
                <div style={{ paddingBottom: i < TRANSITION_PHASES.length - 1 ? 48 : 0 }}>
                  <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.3vw, 26px)", fontWeight: 700, color: i === 1 ? orange : navy, fontStyle: "italic", marginBottom: 12, lineHeight: 1.3 }}>
                    {lang === "id" ? phase.id_phase : phase.en_phase}
                  </h3>
                  <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                    {lang === "id" ? phase.id_description : phase.en_description}
                  </p>
                  {i === 1 && (
                    <div style={{ marginTop: 16, padding: "14px 20px", background: "oklch(93% 0.012 65)", borderRadius: 4, borderLeft: `3px solid ${orange}` }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "oklch(44% 0.08 50)", margin: 0 }}>
                        {t(
                          "This is the stage most people mistake for failure. It is not. It is the cost of having left something real.",
                          "Ini adalah tahap yang paling banyak orang salah kira sebagai kegagalan. Bukan begitu. Ini adalah harga meninggalkan sesuatu yang nyata."
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section IV: Cross-Cultural Dimension */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("IV. Cross-Cultural Dimension", "IV. Dimensi Lintas Budaya")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: offWhite, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("Reverse Culture Shock Is the Harder One", "Gegar Budaya Terbalik Adalah yang Lebih Berat")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: "oklch(76% 0.03 80)", lineHeight: 1.9 }}>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Forward culture shock, arriving in a new country, is widely understood. You expect it. People around you name it. There is social permission to struggle.",
                "Gegar budaya maju, tiba di negara baru, sudah banyak dipahami. Anda mengharapkannya. Orang-orang di sekitar Anda menamakannya. Ada izin sosial untuk berjuang."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Reverse culture shock, returning to your home culture after an extended cross-cultural assignment, is harder precisely because it is unexpected.⁵ You expect home to feel like home. Instead, it feels foreign. Your humour doesn't land. Your references confuse people. The pace feels wrong. The conversations feel shallow. And there is almost no social permission to name this, because you are home.",
                "Gegar budaya terbalik, kembali ke budaya asal Anda setelah penugasan lintas budaya yang panjang, lebih berat tepat karena tidak terduga.⁵ Anda mengharapkan rumah terasa seperti rumah. Sebaliknya, itu terasa asing. Humor Anda tidak mendarat. Referensi Anda membingungkan orang. Temponya terasa salah. Percakapannya terasa dangkal. Dan hampir tidak ada izin sosial untuk menamakannya, karena Anda sudah di rumah."
              )}
            </p>
            <div style={{ background: "oklch(18% 0.09 260)", padding: "32px 36px", borderRadius: 12, marginBottom: 28 }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: offWhite, lineHeight: 1.8, marginBottom: 12 }}>
                {t(
                  "\"I expected to struggle in Thailand. I did not expect to struggle in the Netherlands. But I've been back for eight months and I still feel like a foreigner at my own family dinner table.\"",
                  "\"Saya mengharapkan berjuang di Thailand. Saya tidak mengharapkan berjuang di Belanda. Tapi saya sudah kembali selama delapan bulan dan saya masih merasa seperti orang asing di meja makan keluarga saya sendiri.\""
                )}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
                {t("— Cross-cultural leader, on re-entry after 7 years", "— Pemimpin lintas budaya, tentang kepulangan setelah 7 tahun")}
              </p>
            </div>
            <p style={{ marginBottom: 28 }}>
              {t(
                "This is the re-entry myth: the belief that going home will be easy. In reality, the people who knew you left in a different form than the one that returned. You have changed. They have changed. The relationship has to be renegotiated. This takes time, and it takes the same RAFT work that applies to any other transition.",
                "Ini adalah mitos kepulangan: keyakinan bahwa pulang ke rumah akan mudah. Pada kenyataannya, orang-orang yang mengenal Anda pergi dalam bentuk yang berbeda dari yang kembali. Anda telah berubah. Mereka telah berubah. Hubungan harus dinegosiasikan ulang. Ini membutuhkan waktu, dan membutuhkan pekerjaan RPPP yang sama yang berlaku untuk transisi lainnya."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "Two specific re-entry dynamics to anticipate. Comparison: the instinct to compare your home context unfavourably with the field, or vice versa. Neither comparison produces belonging. And Invisibility: people around you often cannot see or honour the transformation you've been through. You have lived through things that don't translate in ordinary conversation. Name this to yourself. Find people who can receive it. Research on perceived social support suggests that one attuned relationship matters more than a large network with formulaic responses.⁶",
                "Dua dinamika kepulangan spesifik yang perlu diantisipasi. Perbandingan: naluri untuk membandingkan konteks rumah Anda secara tidak menguntungkan dengan lapangan, atau sebaliknya. Tidak ada perbandingan yang menghasilkan rasa memiliki. Dan Ketidaktampakan: orang-orang di sekitar Anda sering tidak dapat melihat atau menghormati transformasi yang telah Anda jalani. Anda telah menjalani hal-hal yang tidak dapat diterjemahkan dalam percakapan biasa. Namai ini untuk diri sendiri. Temukan orang-orang yang bisa menerimanya. Penelitian tentang dukungan sosial yang dirasakan menunjukkan bahwa satu hubungan yang penuh perhatian lebih penting daripada jaringan besar dengan respons yang bersifat formula.⁶"
              )}
            </p>
            <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: offWhite, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
              {t(
                "Re-entry is not a homecoming. It is another transition, and it deserves the same intentional RAFT work as any other.",
                "Kepulangan bukan sebuah pulang ke rumah. Ini adalah transisi lain, dan layak mendapatkan pekerjaan RPPP yang disengaja yang sama seperti yang lainnya."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section V: Biblical Foundation */}
      <div style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32 }}>
            {t("V. Biblical Foundation", "V. Dasar Alkitab")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("God Has Always Walked People Through Transitions", "Allah Selalu Memandu Umat-Nya Melalui Transisi")}
          </h2>

          {/* Luke 24 */}
          <div style={{ marginBottom: 72 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 8 }}>
              <VerseRef id="luke-24-17">{t("Luke 24:17", "Lukas 24:17")}</VerseRef>
              {" "}(NIV)
            </p>
            <div style={{ background: lightGray, padding: "32px 36px", borderRadius: 4, marginBottom: 28 }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 12 }}>
                {t(
                  "\"'What are you discussing together as you walk along?' They stood still, their faces downcast.\"",
                  "\"'Apakah yang kamu percakapkan sementara kamu berjalan?' Dan mereka berhenti dengan muka muram.\""
                )}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.06em", margin: 0 }}>
                — <VerseRef id="luke-24-17">{t("Luke 24:17", "Lukas 24:17")}</VerseRef> (NIV)
              </p>
            </div>
            <div style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
              <p style={{ marginBottom: 20 }}>
                {t(
                  "The Road to Emmaus is a story about people in the middle of a transition they did not choose. The disciples had just lived through the crucifixion: the sudden, violent end of everything they thought was certain. They are walking away, heads down, processing out loud.",
                  "Jalan menuju Emaus adalah kisah tentang orang-orang di tengah transisi yang tidak mereka pilih. Para murid baru saja melewati penyaliban: akhir yang tiba-tiba dan keras dari semua yang mereka pikir pasti. Mereka berjalan menjauh, kepala tertunduk, memproses dengan keras."
                )}
              </p>
              <p style={{ marginBottom: 20 }}>
                {t(
                  "Jesus doesn't appear with a solution. He appears with a question: what are you discussing? He walks with them in the confusion before he explains. He meets them in the grieving before he reframes the story. This is the pastoral pattern Jesus models: first the accompaniment, then the understanding.",
                  "Yesus tidak muncul dengan solusi. Ia muncul dengan pertanyaan: apa yang kalian bicarakan? Ia berjalan bersama mereka dalam kebingungan sebelum menjelaskan. Ia menemani mereka dalam duka sebelum membingkai ulang kisahnya. Ini adalah pola pastoral yang Yesus contohkan: pertama pendampingan, kemudian pemahaman."
                )}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
                {t(
                  "The question Jesus asks, \"What things?\", is a RAFT question. He is inviting them to name their grief before offering perspective. Don't rush past the naming.",
                  "Pertanyaan yang Yesus ajukan, 'Hal-hal apa?', adalah pertanyaan RPPP. Ia mengundang mereka untuk menamai duka mereka sebelum menawarkan perspektif. Jangan terburu-buru melewati penamaannya."
                )}
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "oklch(90% 0.008 80)", marginBottom: 72 }} />

          {/* Ruth 1 */}
          <div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 8 }}>
              <VerseRef id="ruth-1-16">{t("Ruth 1:16", "Rut 1:16")}</VerseRef>
              {" "}(NIV)
            </p>
            <div style={{ background: lightGray, padding: "32px 36px", borderRadius: 4, marginBottom: 28 }}>
              <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 12 }}>
                {t(
                  "\"But Ruth replied, 'Don't urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay.'\"",
                  "\"Tetapi kata Rut: 'Janganlah desak aku meninggalkan engkau dan pulang dengan tidak membawamu, sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam.'\""
                )}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.06em", margin: 0 }}>
                — <VerseRef id="ruth-1-16">{t("Ruth 1:16", "Rut 1:16")}</VerseRef> (NIV)
              </p>
            </div>
            <div style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
              <p style={{ marginBottom: 20 }}>
                {t(
                  "Ruth 1 is, among other things, a masterclass in farewell. Naomi has lost everything: her husband, her sons, her home context, and she is returning to Bethlehem. Orpah goes back. Ruth stays. But the text does not rush this scene. The three women stood together and wept aloud. There is grief before the decision. The decision comes out of the grief, not away from it.",
                  "Rut 1 adalah, di antara hal-hal lain, kelas master dalam perpisahan. Naomi telah kehilangan segalanya: suaminya, anak-anaknya, konteks rumahnya, dan ia kembali ke Betlehem. Orpa kembali. Rut tetap tinggal. Tetapi teks tidak terburu-buru pada adegan ini. Ketiga wanita itu berdiri bersama dan menangis dengan keras. Ada kesedihan sebelum keputusan. Keputusan itu muncul dari kesedihan, bukan menjauh darinya."
                )}
              </p>
              <p style={{ marginBottom: 20 }}>
                {t(
                  "Ruth's commitment to Naomi is not a denial of the loss. It is a loyalty chosen in full awareness of the cost. She knows she is leaving her own people, her own gods, her own culture. She names this. And then she goes. This is the RAFT model in biblical form: the grief is not bypassed, the relationship is honoured, the commitment to what comes next is made from a place of full presence.",
                  "Komitmen Rut kepada Naomi bukan penyangkalan atas kehilangan. Itu adalah kesetiaan yang dipilih dengan penuh kesadaran akan harganya. Ia tahu ia meninggalkan orang-orangnya sendiri, dewa-dewanya sendiri, budayanya sendiri. Ia menamakannya. Dan kemudian ia pergi. Ini adalah model RPPP dalam bentuk alkitabiah: kesedihan tidak dilewati, hubungan dihormati, komitmen untuk apa yang akan datang dibuat dari tempat kehadiran penuh."
                )}
              </p>
              <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: navy, lineHeight: 1.75, padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}` }}>
                {t(
                  "Ruth models radical affirmation: she chooses Naomi not despite the complexity of the leaving, but through it. That is what a RAFT farewell looks like at its most complete.",
                  "Rut memodelkan peneguhan radikal: ia memilih Naomi bukan meskipun kompleksitas kepergian, tetapi melaluinya. Itulah tampilan perpisahan RPPP pada wujud paling lengkapnya."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section VI: Personal RAFT Planner */}
      <div style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center" }}>
            {t("VI. Your RAFT Planner", "VI. Perencana RPPP Anda")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2, fontStyle: "italic", textAlign: "center" }}>
            {t("Apply It to Your Transition", "Terapkan pada Transisi Anda")}
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: bodyText, lineHeight: 1.85, marginBottom: 64, textAlign: "center", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Use these four prompts for a transition you are currently navigating, or one you can see coming. Take your time. Honest answers are more useful than polished ones.",
              "Gunakan empat pertanyaan ini untuk transisi yang sedang Anda jalani, atau yang bisa Anda lihat akan datang. Luangkan waktu Anda. Jawaban yang jujur lebih berguna daripada yang dipoles."
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
                      {lang === "id" ? prompt.id_letter : prompt.letter}
                    </div>
                    <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: navy, lineHeight: 1.75, fontStyle: "italic", margin: "8px 0 0" }}>
                      {lang === "id" ? prompt.id_question : prompt.en_question}
                    </p>
                  </div>
                  <textarea
                    value={plannerAnswers[i]}
                    onChange={(e) => {
                      const next = [...plannerAnswers];
                      next[i] = e.target.value;
                      setPlannerAnswers(next);
                    }}
                    placeholder={t("Write your response here...", "Tulis respons Anda di sini...")}
                    rows={4}
                    style={{
                      width: "100%", padding: "16px 18px",
                      fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
                      color: bodyText, background: lightGray,
                      border: "1px solid oklch(80% 0.01 80)", borderRadius: 4,
                      resize: "vertical", lineHeight: 1.75,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <button
                  onClick={handlePlanSubmit}
                  disabled={!allPlannerFilled}
                  style={{
                    padding: "14px 40px", border: "none",
                    cursor: allPlannerFilled ? "pointer" : "default",
                    fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                    background: allPlannerFilled ? orange : "oklch(80% 0.01 80)",
                    color: allPlannerFilled ? offWhite : "oklch(55% 0.01 80)",
                    letterSpacing: "0.06em", borderRadius: 4,
                  }}
                >
                  {t("Complete My RAFT Plan", "Selesaikan Rencana RPPP Saya")}
                </button>
                {!allPlannerFilled && (
                  <p style={{ fontFamily: serif, fontSize: 13, color: bodyText, fontStyle: "italic", marginTop: 12 }}>
                    {t("Answer all four prompts to complete your plan.", "Jawab keempat pertanyaan untuk menyelesaikan rencana RPPP Anda.")}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: offWhite, borderRadius: 8, padding: "48px 40px", boxShadow: "0 2px 24px oklch(20% 0.05 260 / 0.07)" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
                {t("Your RAFT Plan", "Rencana RPPP Anda")}
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
                        {lang === "id" ? prompt.id_letter : prompt.letter}
                      </div>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: navy, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
                        {lang === "id" ? RAFT_STEPS[i].id_title : RAFT_STEPS[i].en_title}
                      </p>
                    </div>
                    <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, fontStyle: "italic", paddingLeft: 48 }}>
                      "{plannerAnswers[i]}"
                    </p>
                  </div>
                ))}
              </div>
              {planSaved ? (
                <div style={{ marginTop: 28, padding: "14px 20px", background: "oklch(93% 0.012 65)", borderRadius: 8, borderLeft: `3px solid ${orange}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "oklch(44% 0.08 50)", margin: 0 }}>
                    {t("Plan saved to your dashboard.", "Rencana tersimpan di dashboard Anda.")}
                  </p>
                </div>
              ) : planSavePending ? (
                <div style={{ marginTop: 28, padding: "14px 20px" }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText, margin: 0, fontStyle: "italic" }}>
                    {t("Saving...", "Menyimpan...")}
                  </p>
                </div>
              ) : null}
              <div style={{ marginTop: 32, padding: "24px 28px", background: lightGray, borderRadius: 12, borderLeft: `3px solid ${orange}` }}>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: navy, lineHeight: 1.8, fontStyle: "italic", margin: 0 }}>
                  {t(
                    "Take this plan into prayer. Ask God which step requires your attention first, and who might walk through it with you.",
                    "Bawa rencana ini ke dalam doa. Tanyakan kepada Allah langkah mana yang memerlukan perhatian Anda terlebih dahulu, dan siapa yang mungkin melewatinya bersama Anda."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sources */}
      <SourcesDropdown sources={[
        "David Pollock & Ruth Van Reken — Third Culture Kids: Preparing for the Life Between Worlds (Nicholas Brealey, 3rd ed., 2017). The source work for the RAFT model — a widely trusted practitioner framework developed through decades of field work; no peer-reviewed empirical validation exists.",
        "Melissa Selby — The Journey Back: Understanding Re-entry and Attrition in Cross-Cultural Workers (William Carey Library, 2018). Field research on attrition patterns and the predictive relationship between departure quality and re-entry adjustment.",
        "William Bridges with Susan Bridges — Transitions: Making Sense of Life's Changes (Da Capo Press, 4th ed., 2019). The transition phases on this page are a directional normalising map drawn from this and similar practitioner literature — a way of naming common experiences, not an empirically validated sequence.",
        "Adrian Furnham & Stephen Bochner — Culture Shock: Psychological Reactions to Unfamiliar Environments (Routledge, 1986); P. Adler — 'The Transitional Experience: An Alternative View of Culture Shock,' Journal of Humanistic Psychology (1975). The research base for disorientation timelines in cross-cultural adjustment; duration varies significantly by individual and cultural distance.",
        "Clyde Austin (ed.) — Cross-Cultural Re-Entry: A Book of Readings (Abilene Christian University Press, 1986). Foundational collection on reverse culture shock; the experience of return as harder than initial arrival is consistently documented across this literature.",
        "PMC12840645 (Chan et al., 2026, Hong Kong/China context): perceived support appraisal quality outweighs network size. Confirms Zavala-Barajas (2022) missionary-context finding: one attuned relationship sustains more than a large network with formulaic responses.",
      ]} lang={lang} />

      {/* Footer */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: offWhite, marginBottom: 16, fontStyle: "italic" }}>
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>
        <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)", color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t(
            "Explore more training modules to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda."
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
          {t("All Resources", "Semua Sumber")}
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
              "{lang === "id" ? verseData.id : verseData.en}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — {lang === "id" ? verseData.id_ref : verseData.en_ref}{" "}
              {lang === "id" ? "(TB)" : "(NIV)"}
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px", background: navy, color: offWhite,
                border: "none", borderRadius: 12,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
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
