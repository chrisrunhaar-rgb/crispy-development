"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const navy      = "oklch(22% 0.10 260)";
const orange    = "oklch(65% 0.15 45)";
const offWhite  = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText  = "oklch(35% 0.08 260)";
const FONT      = "var(--font-montserrat), Montserrat, sans-serif";
const CORMORANT = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const MX        = 860;

// ─── Assessment questions ────────────────────────────────────────────────────
const assessmentQuestions = [
  {
    dimension: "FREQUENCY",
    en: "How often do you intentionally seek silence before God?",
    id: "Seberapa sering Anda sengaja mencari keheningan di hadapan Tuhan?",
    optionsEN: ["Never / rarely", "1-2 times per week", "3-5 times per week", "Daily"],
    optionsID: ["Tidak pernah / jarang", "1-2 kali per minggu", "3-5 kali per minggu", "Setiap hari"],
  },
  {
    dimension: "DURATION",
    en: "When you do find silence, how long does it typically last?",
    id: "Ketika Anda menemukan keheningan, biasanya berapa lama bertahan?",
    optionsEN: ["Less than 5 minutes", "5-15 minutes", "15-30 minutes", "More than 30 minutes"],
    optionsID: ["Kurang dari 5 menit", "5-15 menit", "15-30 menit", "Lebih dari 30 menit"],
  },
  {
    dimension: "QUALITY",
    en: "When you sit in silence, what usually happens?",
    id: "Ketika Anda duduk dalam keheningan, apa yang biasanya terjadi?",
    optionsEN: ["My mind races the whole time", "I reach for my phone within minutes", "I'm partly present with God", "I'm fully present and listening"],
    optionsID: ["Pikiran saya berlari sepanjang waktu", "Saya langsung meraih ponsel", "Saya sebagian hadir bersama Tuhan", "Saya sepenuhnya hadir dan mendengarkan"],
  },
  {
    dimension: "EASE",
    en: "How easy is it for you to enter silence?",
    id: "Seberapa mudah bagi Anda untuk masuk ke dalam keheningan?",
    optionsEN: ["Very difficult - I can't seem to stop", "Difficult - takes real effort", "Manageable - with the right conditions", "Natural - it's a well-worn practice"],
    optionsID: ["Sangat sulit - saya tampaknya tidak bisa berhenti", "Sulit - butuh usaha nyata", "Bisa dikelola - dengan kondisi yang tepat", "Alami - ini sudah jadi praktik yang mapan"],
  },
  {
    dimension: "INTENTIONALITY",
    en: "How would you describe the role of silence in your current leadership rhythm?",
    id: "Bagaimana Anda menggambarkan peran keheningan dalam ritme kepemimpinan Anda saat ini?",
    optionsEN: ["Always accidental - I stumble into it", "Mostly accidental - rarely planned", "Mostly planned - sometimes inconsistent", "Built into my rhythm - intentional and regular"],
    optionsID: ["Selalu kebetulan - saya tidak sengaja menemukannya", "Kebanyakan kebetulan - jarang direncanakan", "Kebanyakan direncanakan - kadang tidak konsisten", "Sudah masuk ritme - intentional dan teratur"],
  },
];

// ─── Scenario cards ──────────────────────────────────────────────────────────
const personalCards = [
  {
    labelEN: "5-Minute Morning Anchor",
    labelID: "Jangkar Pagi 5 Menit",
    responseEN: "Before you check your phone, before you open email, before the first notification lands - sit in silence for five minutes. No agenda. No words. Just willingness. This is the smallest sustainable version of the practice. Five minutes is not ideal. It is a beginning. The Desert Fathers called the early morning hours Vigils - the time when the self is most undefended and God is most audible. You do not need to be a monk to steal five minutes from your morning before the world finds you.",
    responseID: "Sebelum Anda memeriksa ponsel, sebelum membuka email, sebelum notifikasi pertama datang - duduklah dalam keheningan selama lima menit. Tidak ada agenda. Tidak ada kata-kata. Hanya kesediaan. Ini adalah versi terkecil dari praktik yang berkelanjutan. Lima menit tidak ideal. Ini adalah awal. Para Bapa Padang Gurun menyebut jam-jam pagi awal sebagai Vigils - waktu ketika diri paling tidak terjaga dan Allah paling terdengar.",
  },
  {
    labelEN: "A 24-Hour Digital Fast",
    labelID: "Puasa Digital 24 Jam",
    responseEN: "Once a month, put down the devices for 24 hours. No social media, no news, no email. Not as punishment - as an act of love. Layne McDonald, who writes on digital wisdom, frames a digital fast as saying: 'I love You more than I love being informed.' Jesus regularly withdrew to desolate places (Luke 5:16). He was not irresponsible. He was replenishing the source from which everything else came. The fast reveals what the device was filling. Often, it is a restlessness that God wants to address - not the device itself.",
    responseID: "Sebulan sekali, letakkan perangkat selama 24 jam. Tidak ada media sosial, tidak ada berita, tidak ada email. Bukan sebagai hukuman - sebagai tindakan kasih. Layne McDonald membingkai puasa digital sebagai mengatakan: 'Aku mencintai-Mu lebih dari aku mencintai keinginan untuk selalu terinformasi.' Yesus secara teratur menarik diri ke tempat-tempat sepi (Lukas 5:16). Dia tidak tidak bertanggung jawab. Dia mengisi ulang sumber dari mana segalanya datang.",
  },
  {
    labelEN: "Lectio Divina (Sacred Reading)",
    labelID: "Lectio Divina (Bacaan Sakral)",
    responseEN: "Choose a short passage of Scripture - six to ten verses. Read it once, slowly. Read it a second time. On the third reading, ask one question: what word or phrase caught my attention? Do not analyse it. Sit with it for five minutes. Let it rest in you. This is lectio divina - the practice the monastic tradition has used for fifteen hundred years to hear Scripture as a living word rather than a text to be studied. The final movement, contemplatio, is wordless rest in God's presence. No agenda, no performance. Just arrival.",
    responseID: "Pilih bagian Kitab Suci yang pendek - enam hingga sepuluh ayat. Baca sekali, perlahan. Baca kedua kali. Pada bacaan ketiga, ajukan satu pertanyaan: kata atau frasa apa yang menarik perhatian saya? Jangan menganalisisnya. Duduk bersamanya selama lima menit. Biarkan beristirahat dalam diri Anda. Ini adalah lectio divina - praktik yang telah digunakan tradisi monastik selama lima belas ratus tahun untuk mendengar Kitab Suci sebagai firman yang hidup.",
  },
  {
    labelEN: "Annual Silent Retreat (48 hours)",
    labelID: "Retret Hening Tahunan (48 jam)",
    responseEN: "Once a year, go somewhere quiet - a monastery, a retreat house, a cabin - for 48 hours of intentional silence. Bring your Bible. Bring a journal. Bring nothing that requires a screen. This is not a working retreat. It is not strategic planning dressed up in spiritual language. It is stopping. Many leaders resist this because they cannot see the ROI. The ROI is not visible in the same accounting system. Leaders who build this into their year consistently report that more clarity comes from those 48 hours than from any planning weekend.",
    responseID: "Setahun sekali, pergilah ke tempat yang tenang - biara, rumah retret, kabin - selama 48 jam keheningan yang intentional. Bawa Alkitab Anda. Bawa jurnal. Jangan bawa apa pun yang membutuhkan layar. Ini bukan retret kerja. Ini bukan perencanaan strategis yang dibungkus dalam bahasa rohani. Ini adalah berhenti. Banyak pemimpin menolak ini karena mereka tidak dapat melihat hasilnya. Hasilnya tidak terlihat dalam sistem akuntansi yang sama.",
  },
  {
    labelEN: "Phone-Free Commute or Walk",
    labelID: "Perjalanan atau Jalan Tanpa Ponsel",
    responseEN: "Leave your phone behind for one commute or walk per day. No earbuds. No podcast. No audiobook. Just movement and whatever arises. This may feel wasteful at first. That feeling is data - it tells you how thoroughly the space for unstructured thought has been colonised. The research suggests that the default mode network - the part of the brain active in unfocused thought - is where creativity, self-reflection, and emotional processing happen. You do not need to fill every commute with content. Some of your most important thinking happens when you stop feeding the mind and let it breathe.",
    responseID: "Tinggalkan ponsel Anda untuk satu perjalanan atau jalan per hari. Tidak ada earbuds. Tidak ada podcast. Tidak ada audiobook. Hanya gerakan dan apa pun yang muncul. Ini mungkin terasa sia-sia pada awalnya. Perasaan itu adalah data - itu memberi tahu Anda betapa menyeluruhnya ruang untuk pemikiran tidak terstruktur telah dikolonisasi.",
  },
];

const teamCards = [
  {
    labelEN: "Opening Silence Before Team Meetings",
    labelID: "Keheningan Pembuka Sebelum Rapat Tim",
    responseEN: "Begin every team meeting with two minutes of silence. No agenda. No prayer request list. No opening song. Just two minutes of quiet, together. This practice is countercultural enough that it will feel awkward the first few times. That is normal. What teams consistently report after six weeks is that meetings change character. People arrive less frantic. Conversation is more honest. Decisions feel more grounded. You are not just managing productivity. You are modelling that silence is safe - that it is not dead space but living space.",
    responseID: "Mulai setiap rapat tim dengan dua menit keheningan. Tidak ada agenda. Tidak ada daftar permintaan doa. Tidak ada lagu pembuka. Hanya dua menit tenang, bersama. Praktik ini cukup berlawanan dengan budaya sehingga akan terasa canggung beberapa kali pertama. Itu normal. Apa yang secara konsisten dilaporkan tim setelah enam minggu adalah rapat berubah karakternya.",
  },
  {
    labelEN: "Team Digital Sabbath (One Day Per Week)",
    labelID: "Sabat Digital Tim (Satu Hari Per Minggu)",
    responseEN: "As a team, choose one day per week where no work communication is sent. No WhatsApp messages, no emails, no 'just checking in.' This is harder to implement than it sounds - there will always be something urgent. But the practice of naming a boundary together does something that individual discipline cannot: it creates a shared culture of rest. Global Frontier Missions frames the Sabbath as a weekly confession that ministry is ultimately God's work, not ours. A team that rests together models something the communities they serve desperately need to see.",
    responseID: "Sebagai tim, pilih satu hari per minggu di mana tidak ada komunikasi pekerjaan yang dikirim. Tidak ada pesan WhatsApp, tidak ada email, tidak ada 'hanya memeriksa.' Ini lebih sulit diterapkan dari yang terdengar - selalu ada sesuatu yang mendesak. Tapi praktik menetapkan batas bersama melakukan sesuatu yang tidak bisa dilakukan disiplin individu: menciptakan budaya istirahat bersama.",
  },
  {
    labelEN: "Silent Prayer Together (Monthly)",
    labelID: "Doa Hening Bersama (Bulanan)",
    responseEN: "Once a month, gather your team for 20 minutes of corporate silent prayer. Open with a short Scripture reading. Then sit in silence together. Close with one question: 'What did you notice?' You do not need to share deeply. The act of naming what arrived in the silence is often enough. The Quaker tradition has practised corporate silence for four hundred years, describing it as 'an intensified pause, a vitalised hush, a creative quiet.' Teams who introduce this practice often report that it changes the quality of prayer in the team more than any training on intercession.",
    responseID: "Sebulan sekali, kumpulkan tim Anda selama 20 menit doa hening bersama. Buka dengan bacaan Kitab Suci yang singkat. Kemudian duduk dalam keheningan bersama. Tutup dengan satu pertanyaan: 'Apa yang Anda perhatikan?' Anda tidak perlu berbagi secara mendalam. Tradisi Quaker telah mempraktikkan keheningan bersama selama empat ratus tahun, menggambarkannya sebagai 'jeda yang diintensifkan, kesunyian yang dihidupkan, ketenangan yang kreatif.'",
  },
  {
    labelEN: "Structured Debrief with Space for Silence",
    labelID: "Debriefing Terstruktur dengan Ruang untuk Keheningan",
    responseEN: "After significant events - a difficult season, a major project, a leadership crisis - build a structured debrief that begins not with reporting but with silence. Ask the team to sit quietly for five minutes before anyone speaks. Then ask: 'What happened inside you during that season?' Not just 'what went well' or 'what could we improve,' but what happened in the interior. Cross-cultural workers often move from one intense experience to the next without processing what each one left behind. Silence before debrief creates the conditions for honesty that polished reporting rarely allows.",
    responseID: "Setelah peristiwa-peristiwa penting - musim yang sulit, proyek besar, krisis kepemimpinan - bangun debriefing terstruktur yang dimulai bukan dengan pelaporan tetapi dengan keheningan. Minta tim untuk duduk diam selama lima menit sebelum siapa pun berbicara. Kemudian tanya: 'Apa yang terjadi di dalam diri Anda selama musim itu?' Tidak hanya 'apa yang berjalan dengan baik' - tapi apa yang terjadi di interior.",
  },
];

// ─── Goal dropdowns labels ────────────────────────────────────────────────────
const goalLabels = [
  {
    labelEN: "In 30 days, how often do you want to practice intentional silence?",
    labelID: "Dalam 30 hari, seberapa sering Anda ingin mempraktikkan keheningan yang intentional?",
  },
  {
    labelEN: "What duration will you aim for?",
    labelID: "Durasi apa yang akan Anda tuju?",
  },
  {
    labelEN: "What quality of presence do you want to reach?",
    labelID: "Kualitas kehadiran apa yang ingin Anda capai?",
  },
  {
    labelEN: "Where do you want to be on the ease scale?",
    labelID: "Di mana Anda ingin berada pada skala kemudahan?",
  },
  {
    labelEN: "How intentional do you want your silence practice to be?",
    labelID: "Seberapa intentional Anda ingin praktik keheningan Anda?",
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────
const prose: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
  color: bodyText,
  lineHeight: 1.8,
  marginBottom: "1.25rem",
};

const supStyle: React.CSSProperties = {
  color: orange,
  fontSize: "0.65em",
  verticalAlign: "super",
  lineHeight: 0,
};

// ─── Sources dropdown ─────────────────────────────────────────────────────────
function SourcesDropdown({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);

  const sources = [
    {
      n: 1,
      text: "Frontiers in Cognition, \"The Impact of Digital Technology, Social Media, and AI on Cognitive Functions\" (2023)",
      url: "https://www.frontiersin.org/journals/cognition/articles/10.3389/fcogn.2023.1203077/full",
    },
    {
      n: 2,
      text: "Scientific Reports, \"Acute Smartphone Use Impairs Vigilance and Inhibition Capacities\" (2023)",
      url: "https://preview-www.nature.com/articles/s41598-023-50354-3",
    },
    {
      n: 3,
      text: "Scientific Reports / PMC, \"Does the Brain Drain Effect Really Exist?\" (2023)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10525686/",
    },
    {
      n: 4,
      text: "Church Life Journal (Notre Dame), \"This Is Your Brain in a Digital Age\"",
      url: "https://churchlifejournal.nd.edu/articles/this-is-your-brain-in-a-digital-age/",
    },
    {
      n: 5,
      text: "Working Preacher, Commentary on 1 Kings 19:1-15",
      url: "https://www.workingpreacher.org/commentaries/revised-common-lectionary/ordinary-12-3/commentary-on-1-kings-191-45-78-15a-2",
    },
    {
      n: 6,
      text: "JesusWalk Bible Study, \"Recognizing God's Voice: 1 Kings 19\"",
      url: "https://www.jesuswalk.com/voice/2_recognizing.htm",
    },
    {
      n: 7,
      text: "Conversatio Divina, \"Ancient Christian Wisdom for a Postmodern Age: Knowledge Born in Silence\"",
      url: "https://conversatio.org/ancient-christian-wisdom-for-a-postmodern-age-knowledge-born-in-silence/",
    },
    {
      n: 8,
      text: "Henri Nouwen, \"From Solitude to Community to Ministry\" - Christianity Today",
      url: "https://www.christianitytoday.com/pastors/content/from-solitude-to-community-to-ministry/",
    },
    {
      n: 9,
      text: "Thomas Merton, New Seeds of Contemplation",
      url: "https://www.goodreads.com/work/quotes/1133302-new-seeds-of-contemplation",
    },
    {
      n: 10,
      text: "Transforming Center, \"Practicing What We Preach: Solitude and Leadership\" (Ruth Haley Barton)",
      url: "https://transformingcenter.org/2016/07/practicing-preach/",
    },
  ];

  return (
    <div style={{ maxWidth: MX, margin: "0 auto", padding: "0 24px 48px" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: orange,
          padding: 0,
        }}
      >
        {lang === "id" ? (open ? "- Sembunyikan Sumber" : "+ Lihat Sumber") : (open ? "- Hide Sources" : "+ View Sources")}
      </button>
      {open && (
        <ol style={{ marginTop: 16, paddingLeft: 20, color: bodyText, fontFamily: FONT, fontSize: 13, lineHeight: 1.8 }}>
          {sources.map(s => (
            <li key={s.n} style={{ marginBottom: 8 }}>
              {s.text}{" "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: orange, textDecoration: "underline", wordBreak: "break-all" }}>
                {s.url}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DisciplineOfSilenceClient({
  isSaved,
  isLoggedIn,
}: {
  isSaved: boolean;
  isLoggedIn: boolean;
}) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;

  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  // Assessment state
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  // Scenario cards
  const [openPersonalCard, setOpenPersonalCard] = useState<number | null>(null);
  const [openTeamCard, setOpenTeamCard] = useState<number | null>(null);

  // Goal-setter state
  const [goals, setGoals] = useState<string[]>(["", "", "", "", ""]);
  const [weekCommitment, setWeekCommitment] = useState("");
  const [goalsSaved, setGoalsSaved] = useState(false);

  // Background / Sources
  const [bgOpen, setBgOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const t = (en: string, id: string) => lang === "id" ? id : en;

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("discipline-of-silence");
      setSaved(true);
    });
  }

  const allAnswered = answers.every(a => a !== null);

  function handleAnswerSelect(qIdx: number, optIdx: number) {
    const next = [...answers];
    next[qIdx] = next[qIdx] === optIdx ? null : optIdx;
    setAnswers(next);
  }

  function getDefaultGoal(qIdx: number): string {
    const answer = answers[qIdx];
    if (answer === null) return "";
    const q = assessmentQuestions[qIdx];
    const opts = lang === "id" ? q.optionsID : q.optionsEN;
    const nextIdx = Math.min(answer + 1, opts.length - 1);
    return opts[nextIdx];
  }

  function handleReveal() {
    if (!allAnswered) return;
    setAssessmentComplete(true);
    // Pre-fill goals at one step above assessment answers
    const prefilled = answers.map((a, i) => {
      const q = assessmentQuestions[i];
      const opts = lang === "id" ? q.optionsID : q.optionsEN;
      if (a === null) return "";
      return opts[Math.min(a + 1, opts.length - 1)];
    });
    setGoals(prefilled);
  }

  // ─── Layout helpers ────────────────────────────────────────────────────────
  const sec = (bg: string, py = "4rem"): React.CSSProperties => ({
    background: bg,
    padding: `${py} 0`,
  });

  const inner: React.CSSProperties = {
    maxWidth: MX,
    margin: "0 auto",
    padding: "0 24px",
  };

  // ─── Scripture blockquote ──────────────────────────────────────────────────
  function Scripture({ verse, ref: ref_ }: { verse: string; ref: string }) {
    return (
      <blockquote style={{
        borderLeft: `3px solid ${orange}`,
        paddingLeft: "1.5rem",
        margin: "2rem 0",
      }}>
        <p style={{
          fontFamily: CORMORANT,
          fontStyle: "italic",
          fontSize: "clamp(20px, 3vw, 26px)",
          color: navy,
          lineHeight: 1.5,
          margin: 0,
        }}>
          {verse}
        </p>
        <cite style={{
          display: "block",
          fontFamily: FONT,
          fontSize: "0.75rem",
          color: "oklch(55% 0.05 260)",
          fontStyle: "normal",
          marginTop: "0.75rem",
          letterSpacing: "0.04em",
        }}>
          {ref_}
        </cite>
      </blockquote>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: FONT, background: offWhite, color: bodyText }}>
      <LangToggle />

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        background: navy,
        padding: "5rem 24px 4.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <img
          src="/images/resources/discipline-of-silence/hero.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            opacity: 0.18, mixBlendMode: "luminosity",
            pointerEvents: "none", userSelect: "none",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: navy, opacity: 0.15, mixBlendMode: "multiply",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: MX, margin: "0 auto", position: "relative" }}>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            color: orange,
            fontWeight: 700,
            marginBottom: "1.25rem",
          }}>
            {t("FAITH & CALLING", "IMAN & PANGGILAN")}
          </p>
          <h1 style={{
            fontFamily: CORMORANT,
            fontWeight: 600,
            fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
            color: "white",
            marginBottom: "1.5rem",
            lineHeight: 1.15,
          }}>
            {t("The Discipline of Silence", "Disiplin Keheningan")}
          </h1>
          <p style={{
            fontFamily: CORMORANT,
            fontStyle: "italic",
            fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
            color: "oklch(80% 0.04 260)",
            maxWidth: 640,
            margin: "0 auto 2rem",
            lineHeight: 1.65,
          }}>
            {t(
              "In a world that is always on, intentional silence has become the rarest leadership discipline. Discover why God speaks in quiet - and how to build the practice into your life and your team.",
              "Di dunia yang selalu hidup, keheningan yang intentional telah menjadi disiplin kepemimpinan yang paling langka. Temukan mengapa Allah berbicara dalam ketenangan - dan bagaimana membangun praktik ini dalam hidup dan tim Anda."
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            style={{
              padding: "12px 28px",
              border: "none",
              cursor: saved ? "default" : "pointer",
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 700,
              background: saved ? "oklch(35% 0.05 260)" : orange,
              color: offWhite,
              letterSpacing: "0.04em",
              borderRadius: 4,
            }}
          >
            {saved ? t("Saved to Dashboard", "Tersimpan di Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard")}
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          INTRODUCTION
      ════════════════════════════════════════════════════════════ */}
      <section style={sec(offWhite)}>
        <div style={inner}>
          <p style={prose}>
            {t(
              "We live in a world that does not stop. For cross-cultural leaders, the noise is compounded: language acquisition, culture shock, team complexity, time zones, supporter expectations, and the particular weight of work that carries eternal stakes. And now, layered across all of it, a device in your pocket that is always on.",
              "Kita hidup di dunia yang tidak berhenti. Bagi pemimpin lintas budaya, kebisingan itu berlipat ganda: belajar bahasa, gegar budaya, kompleksitas tim, zona waktu, harapan pendukung, dan beban pekerjaan yang membawa taruhan abadi. Dan sekarang, di atas segalanya, sebuah perangkat di saku Anda yang selalu menyala."
            )}
          </p>
          <p style={prose}>
            {t(
              "The question this module asks is simple: If God speaks in silence, and we have stopped seeking silence, what are we missing?",
              "Pertanyaan yang diajukan modul ini sederhana: Jika Allah berbicara dalam keheningan, dan kita telah berhenti mencari keheningan, apa yang kita lewatkan?"
            )}
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            {t(
              "This module will help you diagnose where you are, understand why silence matters - both theologically and practically - and implement it, personally and with your team.",
              "Modul ini akan membantu Anda mendiagnosis di mana Anda berada, memahami mengapa keheningan penting - baik secara teologis maupun praktis - dan menerapkannya, secara pribadi dan bersama tim Anda."
            )}
          </p>
        </div>
      </section>

      {/* ─── Learning Outcomes ─── */}
      <section style={sec(offWhite, "0")}>
        <div style={{ ...inner, paddingBottom: "4rem" }}>
          <div style={{
            background: "white",
            borderLeft: `4px solid ${orange}`,
            borderRadius: "0 6px 6px 0",
            padding: "1.75rem 2rem",
          }}>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              color: orange,
              fontWeight: 700,
              marginBottom: "1rem",
            }}>
              {t("LEARNING OUTCOMES", "TUJUAN PEMBELAJARAN")}
            </p>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.875rem",
              color: "oklch(55% 0.05 260)",
              marginBottom: "0.875rem",
            }}>
              {t("After this module, you will be able to:", "Setelah modul ini, Anda akan mampu:")}
            </p>
            <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
              {[
                {
                  en: "Describe the attention crisis facing modern leaders and why cross-cultural workers are particularly vulnerable to it.",
                  id: "Menggambarkan krisis perhatian yang dihadapi pemimpin modern dan mengapa pekerja lintas budaya sangat rentan terhadapnya.",
                },
                {
                  en: "Articulate the biblical and theological grounding for silence as a leadership discipline, drawing on the Elijah narrative and the Desert Father tradition.",
                  id: "Menjelaskan dasar biblis dan teologis untuk keheningan sebagai disiplin kepemimpinan, berdasarkan narasi Elia dan tradisi Bapa Padang Gurun.",
                },
                {
                  en: "Select and implement at least one personal and one team practice from the scenario cards that fits your current context.",
                  id: "Memilih dan menerapkan setidaknya satu praktik pribadi dan satu praktik tim dari kartu skenario yang sesuai dengan konteks Anda saat ini.",
                },
              ].map((item, i) => (
                <li key={i} style={{
                  fontFamily: FONT,
                  fontSize: "0.875rem",
                  color: bodyText,
                  lineHeight: 1.7,
                  marginBottom: i < 2 ? "0.75rem" : 0,
                }}>
                  {t(item.en, item.id)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SELF-ASSESSMENT
      ════════════════════════════════════════════════════════════ */}
      <section style={sec("white")}>
        <div style={inner}>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            color: orange,
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}>
            {t("SELF-ASSESSMENT", "PENILAIAN DIRI")}
          </p>
          <h2 style={{
            fontFamily: CORMORANT,
            fontWeight: 600,
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            color: navy,
            marginBottom: "0.75rem",
          }}>
            {t("Where Are You Now?", "Di Mana Anda Sekarang?")}
          </h2>
          <p style={{ ...prose, marginBottom: "2.5rem" }}>
            {t(
              "Answer all five questions honestly. Your responses will shape your goal-setting at the end.",
              "Jawab semua lima pertanyaan dengan jujur. Jawaban Anda akan membentuk penetapan tujuan Anda di akhir."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {assessmentQuestions.map((q, qIdx) => {
              const opts = lang === "id" ? q.optionsID : q.optionsEN;
              const selected = answers[qIdx];
              return (
                <div key={q.dimension}>
                  <p style={{
                    fontFamily: FONT,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "oklch(58% 0.05 260)",
                    marginBottom: "0.5rem",
                  }}>
                    {q.dimension}
                  </p>
                  <p style={{
                    fontFamily: FONT,
                    fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
                    color: navy,
                    fontWeight: 600,
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}>
                    {lang === "id" ? q.id : q.en}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {opts.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerSelect(qIdx, optIdx)}
                          style={{
                            width: "100%",
                            padding: "0.875rem 1.25rem",
                            background: isSelected ? navy : "white",
                            border: isSelected ? `2px solid ${navy}` : `2px solid ${lightGray}`,
                            borderLeft: `4px solid ${isSelected ? orange : lightGray}`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: FONT,
                            fontSize: "0.875rem",
                            color: isSelected ? "white" : bodyText,
                            fontWeight: isSelected ? 600 : 400,
                            transition: "background 0.2s ease, color 0.2s ease",
                            minHeight: 44,
                            lineHeight: 1.5,
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!assessmentComplete && (
            <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
              <button
                onClick={handleReveal}
                disabled={!allAnswered}
                style={{
                  padding: "14px 40px",
                  border: "none",
                  cursor: allAnswered ? "pointer" : "default",
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 700,
                  background: allAnswered ? orange : lightGray,
                  color: allAnswered ? offWhite : "oklch(65% 0.01 80)",
                  letterSpacing: "0.06em",
                  borderRadius: 4,
                }}
              >
                {allAnswered
                  ? t("See My Results - Continue to Teaching", "Lihat Hasil Saya - Lanjut ke Pengajaran")
                  : t("Answer all 5 questions to continue", "Jawab semua 5 pertanyaan untuk melanjutkan")}
              </button>
            </div>
          )}

          {assessmentComplete && (
            <div style={{
              marginTop: "2rem",
              padding: "1.25rem 1.5rem",
              background: offWhite,
              borderLeft: `4px solid ${orange}`,
              borderRadius: "0 4px 4px 0",
            }}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.8rem",
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.08em",
                marginBottom: "0.25rem",
              }}>
                {t("ASSESSMENT COMPLETE", "PENILAIAN SELESAI")}
              </p>
              <p style={{ fontFamily: FONT, fontSize: "0.875rem", color: bodyText, margin: 0 }}>
                {t(
                  "Your answers have been recorded. Continue reading - your snapshot will appear in the Goal-Setter at the end.",
                  "Jawaban Anda telah dicatat. Lanjutkan membaca - snapshot Anda akan muncul di Goal-Setter di akhir."
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TEACHING — THE PROBLEM
      ════════════════════════════════════════════════════════════ */}
      {assessmentComplete && (
        <>
          <section style={sec(offWhite)}>
            <div style={inner}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                color: orange,
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}>
                {t("PART 1 OF 3", "BAGIAN 1 DARI 3")}
              </p>
              <h2 style={{
                fontFamily: CORMORANT,
                fontWeight: 600,
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: navy,
                marginBottom: "1.5rem",
              }}>
                {t("The World Always On", "Dunia yang Selalu Menyala")}
              </h2>

              <p style={prose}>
                {t(
                  "Cross-cultural leaders live between worlds. They navigate language, time zones, culture shock, team complexity, and the weight of work that never quite ends. And now, layered on top of all of this, they carry a device that is always on.",
                  "Pemimpin lintas budaya hidup di antara dunia-dunia. Mereka menavigasi bahasa, zona waktu, gegar budaya, kompleksitas tim, dan beban pekerjaan yang tidak pernah benar-benar berakhir. Dan sekarang, di atas semua ini, mereka membawa perangkat yang selalu menyala."
                )}
              </p>
              <p style={prose}>
                {t(
                  "The average person now spends over four and a half hours per day on their phone. Their screen is unlocked roughly 150 times a day - once every six minutes during waking hours. Forty-six notifications arrive each day, not counting the ones they check without a prompt. Researchers have begun calling this not the information age but the age of interruption.",
                  "Rata-rata orang sekarang menghabiskan lebih dari empat setengah jam per hari di ponsel mereka. Layar mereka dibuka kunci sekitar 150 kali sehari - sekali setiap enam menit selama jam terjaga. Empat puluh enam notifikasi tiba setiap hari, belum termasuk yang mereka periksa tanpa dorongan. Para peneliti mulai menyebutnya bukan era informasi tetapi era gangguan."
                )}
                <sup style={supStyle}>1</sup>
              </p>
              <p style={prose}>
                {t(
                  "What makes this relevant for cross-cultural leaders is not just the volume of stimulation. It is what the stimulation displaces. A 2023 peer-reviewed study found that 45 minutes of smartphone use significantly impaired both vigilance and inhibition - two capacities that are foundational to discernment, to patient listening, and to the kind of unhurried leadership that cross-cultural work demands.",
                  "Yang membuat ini relevan bagi pemimpin lintas budaya bukan hanya volume stimulasi. Ini adalah apa yang digantikan oleh stimulasi tersebut. Sebuah studi peer-reviewed 2023 menemukan bahwa 45 menit penggunaan smartphone secara signifikan merusak kewaspadaan dan inhibisi - dua kapasitas yang mendasari diskernmen, mendengarkan dengan sabar, dan jenis kepemimpinan yang tidak terburu-buru yang dibutuhkan pekerjaan lintas budaya."
                )}
                <sup style={supStyle}>2</sup>
                {" "}{t(
                  "A meta-analysis of 22 studies confirmed that simply having a smartphone present - even face down, not in use - reduces memory and attention. The researchers called this the 'brain drain effect.'",
                  "Sebuah meta-analisis dari 22 studi mengkonfirmasi bahwa sekadar memiliki smartphone di dekat kita - bahkan menghadap ke bawah, tidak digunakan - mengurangi memori dan perhatian. Para peneliti menyebutnya 'efek brain drain.'"
                )}
                <sup style={supStyle}>3</sup>
              </p>
              <p style={prose}>
                {t(
                  "For Christian leaders, this is not a productivity problem. It is a formation problem.",
                  "Bagi pemimpin Kristen, ini bukan masalah produktivitas. Ini adalah masalah pembentukan."
                )}
              </p>
              <p style={prose}>
                {t(
                  "When you are always reachable, always notified, always half-attending, you lose the capacity to be fully present. Not just to your team or your family - to God. Sofia Carozza, a Christian neuroscientist at Notre Dame, argues that digital technology erodes the two banks that keep us moving toward God: communion with others and attention to reality.",
                  "Ketika Anda selalu dapat dijangkau, selalu diberitahu, selalu setengah memperhatikan, Anda kehilangan kapasitas untuk sepenuhnya hadir. Bukan hanya untuk tim atau keluarga Anda - untuk Tuhan. Sofia Carozza, seorang neurosaintis Kristen di Notre Dame, berpendapat bahwa teknologi digital mengikis dua tepi yang membuat kita bergerak menuju Tuhan: persekutuan dengan sesama dan perhatian pada kenyataan."
                )}
                <sup style={supStyle}>4</sup>
                {" "}{t(
                  "What happens, then, when the attention required to hear God is the very attention being consumed by the device in our pocket?",
                  "Apa yang terjadi, kemudian, ketika perhatian yang diperlukan untuk mendengar Tuhan adalah perhatian yang sama yang dikonsumsi oleh perangkat di saku kita?"
                )}
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                {t(
                  "The problem is not that technology is evil. The problem is that silence is now a resource that must be fought for - and most of us have stopped fighting.",
                  "Masalahnya bukan bahwa teknologi itu jahat. Masalahnya adalah bahwa keheningan sekarang merupakan sumber daya yang harus diperjuangkan - dan kebanyakan dari kita telah berhenti berjuang."
                )}
              </p>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              TEACHING — THE NEED
          ════════════════════════════════════════════════════════════ */}
          <section style={sec("white")}>
            <div style={inner}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                color: orange,
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}>
                {t("PART 2 OF 3", "BAGIAN 2 DARI 3")}
              </p>
              <h2 style={{
                fontFamily: CORMORANT,
                fontWeight: 600,
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: navy,
                marginBottom: "1.5rem",
              }}>
                {t("God Speaks in Silence", "Allah Berbicara dalam Keheningan")}
              </h2>

              <p style={prose}>
                {t(
                  "There is a moment in the life of Elijah that feels almost embarrassingly contemporary. He is exhausted. He is under threat. He has just done something remarkable and cannot see it. He wants to die. He has retreated to the wilderness and collapsed under a tree.",
                  "Ada sebuah momen dalam kehidupan Elia yang terasa hampir memalukan dalam kekontemporerrannya. Dia kelelahan. Dia dalam ancaman. Dia baru saja melakukan sesuatu yang luar biasa dan tidak bisa melihatnya. Dia ingin mati. Dia telah mundur ke padang gurun dan jatuh di bawah pohon."
                )}
              </p>
              <p style={prose}>
                {t(
                  "God does not rebuke him. God does not send him back into ministry. God lets him sleep. God gives him food. And then God invites him deeper into the wilderness - to Horeb, the mountain of God - and there, after the wind and earthquake and fire, comes what the Hebrew text calls qol demamah daqqah (1 Kings 19:12).",
                  "Tuhan tidak menegurnya. Tuhan tidak mengirimnya kembali ke pelayanan. Tuhan membiarkan dia tidur. Tuhan memberinya makan. Dan kemudian Tuhan mengundangnya lebih dalam ke padang gurun - ke Horeb, gunung Allah - dan di sana, setelah angin dan gempa bumi dan api, datanglah apa yang disebut teks Ibrani sebagai qol demamah daqqah (1 Raja-raja 19:12)."
                )}
                <sup style={supStyle}>5</sup>
                <sup style={supStyle}>6</sup>
              </p>
              <p style={prose}>
                {t(
                  "The phrase defies easy translation. The NRSV renders it 'sound of sheer silence.' The NIV calls it 'a gentle whisper.' The KJV, 'a still small voice.' What all translations are reaching toward is the same thing: God's most intimate communication did not come in the spectacular. It came in the quiet.",
                  "Frasa itu menolak terjemahan yang mudah. NRSV mengartikannya 'bunyi keheningan murni.' NIV menyebutnya 'bisikan lembut.' KJV, 'suara yang lembut dan kecil.' Yang ingin dicapai semua terjemahan adalah hal yang sama: komunikasi Allah yang paling intim tidak datang dalam hal-hal yang spektakuler. Datang dalam ketenangan."
                )}
              </p>
              <p style={prose}>
                {t(
                  "This is not incidental to the story. It is the point. The wind, earthquake, and fire - all things that capture human attention immediately - were not where God was found. God was in the silence that came after. And Elijah, who had been asleep and fed and resting, was ready to hear it.",
                  "Ini bukan insidental dalam cerita. Ini adalah intinya. Angin, gempa bumi, dan api - semua hal yang segera menarik perhatian manusia - bukan di situlah Tuhan ditemukan. Tuhan ada dalam keheningan yang datang setelahnya. Dan Elia, yang telah tidur dan diberi makan dan beristirahat, siap untuk mendengarnya."
                )}
              </p>
              <p style={prose}>
                {t(
                  "The Desert Fathers, writing in the fourth and fifth centuries, built entire communities around this insight. Abba Arsenius heard a voice while still at the Roman court: 'Flee, be silent, pray always - these are the roots of sinlessness.' He left. He went to the desert. He became one of the most listened-to voices of his generation - precisely because he had learned to be quiet.",
                  "Para Bapa Padang Gurun, yang menulis pada abad keempat dan kelima, membangun seluruh komunitas di sekitar wawasan ini. Abba Arsenius mendengar suara saat masih di istana Romawi: 'Larilah, diamlah, berdoalah selalu - ini adalah akar ketidakberdosaan.' Dia pergi. Dia ke padang gurun. Dia menjadi salah satu suara yang paling didengarkan pada generasinya - justru karena dia telah belajar untuk diam."
                )}
                <sup style={supStyle}>7</sup>
              </p>
              <p style={prose}>
                {t(
                  "Henri Nouwen writes: 'Without solitude it is virtually impossible to have a spiritual life... In solitude we discover that our life is not a possession to be defended but a gift to be shared.' Solitude is where we discover we are beloved before we have to be useful. It is the foundation from which genuine ministry flows.",
                  "Henri Nouwen menulis: 'Tanpa kesendirian hampir tidak mungkin memiliki kehidupan spiritual... Dalam kesendirian kita menemukan bahwa hidup kita bukan kepemilikan untuk dipertahankan melainkan karunia untuk dibagikan.' Kesendirian adalah tempat kita menemukan bahwa kita dikasihi sebelum kita harus berguna. Ini adalah fondasi dari mana pelayanan yang tulus mengalir."
                )}
                <sup style={supStyle}>8</sup>
              </p>
              <p style={prose}>
                {t(
                  "The question is not whether God speaks. The question is whether we are quiet enough to hear.",
                  "Pertanyaannya bukan apakah Tuhan berbicara. Pertanyaannya adalah apakah kita cukup diam untuk mendengar."
                )}
              </p>
              <p style={prose}>
                {t(
                  "Thomas Merton puts it plainly: 'The beginning of prayer is silence. If we really want to pray we must first learn to listen, for in the silence of the heart God speaks.'",
                  "Thomas Merton mengatakannya dengan jelas: 'Awal doa adalah keheningan. Jika kita benar-benar ingin berdoa kita harus terlebih dahulu belajar mendengarkan, karena dalam keheningan hati Allah berbicara.'"
                )}
                <sup style={supStyle}>9</sup>
              </p>
              <p style={prose}>
                {t(
                  "For cross-cultural leaders - who carry more complexity, more cultural weight, and more unresolved tension than most - this is not a luxury. It is a survival strategy. Bonhoeffer's warning is pointed: 'When we do not take time to be alone in God's presence, we become dangerous or harmful in the human community.' Leaders who do not practice solitude unconsciously demand from others what only God can give.",
                  "Bagi pemimpin lintas budaya - yang membawa lebih banyak kompleksitas, beban budaya, dan ketegangan yang belum terselesaikan dari kebanyakan orang - ini bukan kemewahan. Ini adalah strategi bertahan hidup. Peringatan Bonhoeffer sangat tepat: 'Ketika kita tidak meluangkan waktu untuk sendirian di hadirat Tuhan, kita menjadi berbahaya atau merugikan dalam komunitas manusia.' Pemimpin yang tidak mempraktikkan kesendirian secara tidak sadar menuntut dari orang lain apa yang hanya Tuhan bisa berikan."
                )}
                <sup style={supStyle}>10</sup>
              </p>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              TEACHING — THE SOLUTIONS
          ════════════════════════════════════════════════════════════ */}
          <section style={sec(offWhite)}>
            <div style={inner}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                color: orange,
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}>
                {t("PART 3 OF 3", "BAGIAN 3 DARI 3")}
              </p>
              <h2 style={{
                fontFamily: CORMORANT,
                fontWeight: 600,
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: navy,
                marginBottom: "1.5rem",
              }}>
                {t("What It Looks Like in Practice", "Seperti Apa dalam Praktik")}
              </h2>

              <p style={prose}>
                {t(
                  "The obstacle is real. Leaders working cross-culturally face unique pressures that make silence harder to protect: constant urgency, blurred lines between ministry and life, supporter expectations, limited private space, and the relentless pull of a device that keeps them connected to home while they need to be rooted here.",
                  "Hambatannya nyata. Pemimpin yang bekerja lintas budaya menghadapi tekanan unik yang membuat keheningan lebih sulit dilindungi: urgensi konstan, garis kabur antara pelayanan dan kehidupan, harapan pendukung, ruang pribadi yang terbatas, dan tarikan tak henti dari perangkat yang membuat mereka terhubung ke rumah sementara mereka perlu berakar di sini."
                )}
              </p>
              <p style={prose}>
                {t(
                  "The solution is not another productivity framework. It is a decision: to fight for silence the same way you fight for anything that matters.",
                  "Solusinya bukan kerangka produktivitas lain. Ini adalah keputusan: untuk memperjuangkan keheningan dengan cara yang sama seperti Anda memperjuangkan apa pun yang penting."
                )}
              </p>
              <p style={prose}>
                {t(
                  "The scenario cards below offer concrete starting points - both for your personal practice and for the teams you lead. Not all of them will fit your context. Take what fits. Try one this week.",
                  "Kartu skenario di bawah menawarkan titik awal yang konkret - baik untuk praktik pribadi Anda maupun untuk tim yang Anda pimpin. Tidak semua akan cocok dengan konteks Anda. Ambil yang cocok. Coba satu minggu ini."
                )}
              </p>
              <p style={{ ...prose, marginBottom: 0 }}>
                {t(
                  "One thing to carry with you: you are not just building a personal discipline. As a leader, your relationship with silence shapes the culture around you. Teams led by leaders who are unhurried tend to develop permission to be unhurried. Teams led by people who are always on tend to believe that always-on is what faithfulness requires. Your silence is not self-indulgent. It is leadership.",
                  "Satu hal yang dibawa bersama Anda: Anda tidak hanya membangun disiplin pribadi. Sebagai pemimpin, hubungan Anda dengan keheningan membentuk budaya di sekitar Anda. Tim yang dipimpin oleh pemimpin yang tidak terburu-buru cenderung mengembangkan izin untuk tidak terburu-buru. Tim yang dipimpin oleh orang yang selalu aktif cenderung percaya bahwa selalu aktif adalah yang kesetiaan tuntut. Keheningan Anda bukan kemanjaan diri. Ini adalah kepemimpinan."
                )}
              </p>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              SCENARIO CARDS — PERSONAL
          ════════════════════════════════════════════════════════════ */}
          <section style={sec(navy, "5rem")}>
            <div style={inner}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                color: orange,
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}>
                {t("SCENARIO CARDS", "KARTU SKENARIO")}
              </p>
              <h2 style={{
                fontFamily: CORMORANT,
                fontWeight: 600,
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "white",
                marginBottom: "0.5rem",
              }}>
                {t("Personal Practices", "Praktik Pribadi")}
              </h2>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.875rem",
                color: "oklch(68% 0.04 260)",
                maxWidth: 520,
                marginBottom: "3rem",
              }}>
                {t(
                  "Select any card to read the full practice.",
                  "Pilih kartu mana saja untuk membaca praktik lengkapnya."
                )}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {personalCards.map((card, i) => {
                  const isOpen = openPersonalCard === i;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setOpenPersonalCard(isOpen ? null : i)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "1rem 1.25rem",
                          background: isOpen ? orange : "oklch(28% 0.10 260)",
                          border: `2px solid ${isOpen ? orange : "oklch(30% 0.10 260)"}`,
                          borderRadius: "4px",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: FONT,
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "white",
                          transition: "background 0.2s ease",
                          minHeight: 44,
                        }}
                      >
                        <span>{lang === "id" ? card.labelID : card.labelEN}</span>
                        <span style={{ color: isOpen ? "white" : orange, fontSize: "0.75rem", flexShrink: 0, marginLeft: "1rem" }}>
                          {isOpen ? t("CLOSE", "TUTUP") + " ▲" : t("READ", "BACA") + " ▼"}
                        </span>
                      </button>
                      <div style={{
                        display: "grid",
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.3s ease",
                        overflow: "hidden",
                      }}>
                        <div style={{ minHeight: 0 }}>
                          <div style={{
                            padding: "1.25rem 1.25rem 1.5rem",
                            background: "oklch(26% 0.09 260)",
                            borderLeft: `4px solid ${orange}`,
                            borderRadius: "0 0 4px 4px",
                          }}>
                            <p style={{
                              fontFamily: FONT,
                              fontSize: "0.875rem",
                              color: "oklch(82% 0.03 260)",
                              lineHeight: 1.85,
                              margin: 0,
                            }}>
                              {lang === "id" ? card.responseID : card.responseEN}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Team cards */}
              <div style={{ marginTop: "4rem" }}>
                <h2 style={{
                  fontFamily: CORMORANT,
                  fontWeight: 600,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                  color: "white",
                  marginBottom: "0.5rem",
                }}>
                  {t("Team Practices", "Praktik Tim")}
                </h2>
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.875rem",
                  color: "oklch(68% 0.04 260)",
                  maxWidth: 520,
                  marginBottom: "2rem",
                }}>
                  {t(
                    "Practices you can introduce with the people you lead.",
                    "Praktik yang dapat Anda perkenalkan kepada orang-orang yang Anda pimpin."
                  )}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {teamCards.map((card, i) => {
                    const isOpen = openTeamCard === i;
                    return (
                      <div key={i}>
                        <button
                          onClick={() => setOpenTeamCard(isOpen ? null : i)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1rem 1.25rem",
                            background: isOpen ? orange : "oklch(28% 0.10 260)",
                            border: `2px solid ${isOpen ? orange : "oklch(30% 0.10 260)"}`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: FONT,
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: "white",
                            transition: "background 0.2s ease",
                            minHeight: 44,
                          }}
                        >
                          <span>{lang === "id" ? card.labelID : card.labelEN}</span>
                          <span style={{ color: isOpen ? "white" : orange, fontSize: "0.75rem", flexShrink: 0, marginLeft: "1rem" }}>
                            {isOpen ? t("CLOSE", "TUTUP") + " ▲" : t("READ", "BACA") + " ▼"}
                          </span>
                        </button>
                        <div style={{
                          display: "grid",
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                          transition: "grid-template-rows 0.3s ease",
                          overflow: "hidden",
                        }}>
                          <div style={{ minHeight: 0 }}>
                            <div style={{
                              padding: "1.25rem 1.25rem 1.5rem",
                              background: "oklch(26% 0.09 260)",
                              borderLeft: `4px solid ${orange}`,
                              borderRadius: "0 0 4px 4px",
                            }}>
                              <p style={{
                                fontFamily: FONT,
                                fontSize: "0.875rem",
                                color: "oklch(82% 0.03 260)",
                                lineHeight: 1.85,
                                margin: 0,
                              }}>
                                {lang === "id" ? card.responseID : card.responseEN}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              FAITH ANCHOR
          ════════════════════════════════════════════════════════════ */}
          <section style={sec(navy)}>
            <div style={inner}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                color: orange,
                fontWeight: 700,
                marginBottom: "2.5rem",
              }}>
                {t("FAITH ANCHOR", "JANGKAR IMAN")}
              </p>

              <h2 style={{
                fontFamily: CORMORANT,
                fontWeight: 600,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "white",
                marginBottom: "1.75rem",
              }}>
                {t("The Still Small Voice", "Suara yang Lembut dan Kecil")}
              </h2>

              <blockquote style={{
                borderLeft: `3px solid ${orange}`,
                paddingLeft: "1.5rem",
                marginBottom: "2rem",
              }}>
                <p style={{
                  fontFamily: CORMORANT,
                  fontStyle: "italic",
                  fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)",
                  color: "white",
                  lineHeight: 1.55,
                  margin: 0,
                }}>
                  {t(
                    `"Be still, and know that I am God."`,
                    `"Diamlah dan ketahuilah, bahwa Akulah Allah."`
                  )}
                </p>
                <cite style={{
                  display: "block",
                  fontFamily: FONT,
                  fontSize: "0.75rem",
                  color: "oklch(70% 0.04 260)",
                  fontStyle: "normal",
                  marginTop: "0.75rem",
                }}>
                  {t("Psalm 46:10", "Mazmur 46:10")}
                </cite>
              </blockquote>

              {[
                {
                  en: "The story of Elijah at Horeb is one of the most psychologically honest passages in all of Scripture. He is burned out. He is afraid. He asks to die. And God's response is not a rebuke but a meal, a rest, and an invitation deeper into the wilderness.",
                  id: "Kisah Elia di Horeb adalah salah satu bagian yang paling jujur secara psikologis dalam seluruh Kitab Suci. Dia terbakar habis. Dia takut. Dia meminta untuk mati. Dan respons Tuhan bukan teguran melainkan makanan, istirahat, dan undangan lebih dalam ke padang gurun.",
                },
                {
                  en: "At the mountain, God passes by. There is wind. There is earthquake. There is fire. Then there is qol demamah daqqah - the still small voice, the sound of sheer silence. And it is in that sound that Elijah hears what he could not hear anywhere else.",
                  id: "Di gunung, Tuhan lewat. Ada angin. Ada gempa bumi. Ada api. Kemudian ada qol demamah daqqah - suara yang lembut dan kecil, bunyi keheningan murni. Dan dalam suara itulah Elia mendengar apa yang tidak bisa dia dengar di mana pun.",
                },
                {
                  en: "The Hebrew behind 'be still' is raphah - to sink down, to let go, to relax the grip. It is the posture of a person who has stopped trying to hold everything together. It is not passive resignation. It is active trust.",
                  id: "Kata Ibrani di balik 'diamlah' adalah raphah - untuk tenggelam, melepaskan, melonggarkan cengkeraman. Ini adalah postur seseorang yang telah berhenti mencoba menahan segalanya. Ini bukan penyerahan pasif. Ini adalah kepercayaan aktif.",
                },
                {
                  en: "You cannot manufacture the still small voice. But you can create the conditions in which it is more likely to be heard. That is what the discipline of silence is: not forcing God to speak, but clearing enough quiet that when he does, you are there.",
                  id: "Anda tidak bisa menciptakan suara yang lembut dan kecil. Tetapi Anda bisa menciptakan kondisi di mana itu lebih mungkin didengar. Itulah yang dimaksud dengan disiplin keheningan: bukan memaksa Tuhan untuk berbicara, tetapi membersihkan ketenangan yang cukup sehingga ketika Dia berbicara, Anda ada di sana.",
                },
              ].map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
                    color: "oklch(82% 0.04 260)",
                    lineHeight: 1.85,
                    marginBottom: i < 3 ? "1.25rem" : 0,
                  }}
                >
                  {t(p.en, p.id)}
                </p>
              ))}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              GOAL-SETTER
          ════════════════════════════════════════════════════════════ */}
          <section style={sec("white")}>
            <div style={inner}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                color: orange,
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}>
                {t("GOAL-SETTER", "PENETAPAN TUJUAN")}
              </p>
              <h2 style={{
                fontFamily: CORMORANT,
                fontWeight: 600,
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: navy,
                marginBottom: "0.75rem",
              }}>
                {t("Where Do You Want to Be?", "Di Mana Anda Ingin Berada?")}
              </h2>
              <p style={{ ...prose, marginBottom: "2.5rem" }}>
                {t(
                  "Here is a snapshot of where you started. Set your 30-day goals below.",
                  "Berikut adalah snapshot dari mana Anda memulai. Tetapkan tujuan 30 hari Anda di bawah ini."
                )}
              </p>

              {/* Assessment snapshot */}
              <div style={{
                background: offWhite,
                borderLeft: `4px solid ${orange}`,
                borderRadius: "0 4px 4px 0",
                padding: "1.5rem 2rem",
                marginBottom: "2.5rem",
              }}>
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: orange,
                  marginBottom: "1.25rem",
                }}>
                  {t("YOUR STARTING POINT", "TITIK MULAI ANDA")}
                </p>
                {assessmentQuestions.map((q, i) => {
                  const answer = answers[i];
                  if (answer === null) return null;
                  const opts = lang === "id" ? q.optionsID : q.optionsEN;
                  return (
                    <div key={i} style={{ marginBottom: i < assessmentQuestions.length - 1 ? "0.875rem" : 0 }}>
                      <p style={{
                        fontFamily: FONT,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "oklch(58% 0.05 260)",
                        letterSpacing: "0.06em",
                        margin: "0 0 0.2rem",
                      }}>
                        {q.dimension}
                      </p>
                      <p style={{
                        fontFamily: FONT,
                        fontSize: "0.9rem",
                        color: bodyText,
                        margin: 0,
                        lineHeight: 1.5,
                      }}>
                        {opts[answer]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Goal inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
                {goalLabels.map((gl, i) => {
                  const q = assessmentQuestions[i];
                  const opts = lang === "id" ? q.optionsID : q.optionsEN;
                  return (
                    <div key={i}>
                      <label style={{
                        display: "block",
                        fontFamily: FONT,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: navy,
                        letterSpacing: "0.04em",
                        marginBottom: "0.5rem",
                      }}>
                        {lang === "id" ? gl.labelID : gl.labelEN}
                      </label>
                      <select
                        value={goals[i]}
                        onChange={e => {
                          const next = [...goals];
                          next[i] = e.target.value;
                          setGoals(next);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          fontFamily: FONT,
                          fontSize: "0.9rem",
                          color: bodyText,
                          background: offWhite,
                          border: `1px solid ${lightGray}`,
                          borderRadius: 4,
                          appearance: "none" as const,
                          cursor: "pointer",
                        }}
                      >
                        <option value="">{t("Select a goal...", "Pilih tujuan...")}</option>
                        {opts.map((opt, oi) => (
                          <option key={oi} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontFamily: FONT,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: navy,
                  letterSpacing: "0.04em",
                  marginBottom: "0.5rem",
                }}>
                  {t("One thing I will try this week:", "Satu hal yang akan saya coba minggu ini:")}
                </label>
                <textarea
                  value={weekCommitment}
                  onChange={e => setWeekCommitment(e.target.value)}
                  rows={3}
                  placeholder={t("Describe one specific practice you will attempt...", "Jelaskan satu praktik spesifik yang akan Anda coba...")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontFamily: FONT,
                    fontSize: "0.9rem",
                    color: bodyText,
                    background: offWhite,
                    border: `1px solid ${lightGray}`,
                    borderRadius: 4,
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {!goalsSaved ? (
                <button
                  onClick={() => setGoalsSaved(true)}
                  style={{
                    padding: "14px 40px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 700,
                    background: orange,
                    color: offWhite,
                    letterSpacing: "0.06em",
                    borderRadius: 4,
                  }}
                >
                  {t("Save My Goals", "Simpan Tujuan Saya")}
                </button>
              ) : (
                <div style={{
                  padding: "1.25rem 1.5rem",
                  background: offWhite,
                  borderLeft: `4px solid ${orange}`,
                  borderRadius: "0 4px 4px 0",
                }}>
                  <p style={{
                    fontFamily: FONT,
                    fontSize: "0.875rem",
                    color: bodyText,
                    margin: 0,
                  }}>
                    {t(
                      "Goals saved. Come back to this page at the end of 30 days to review your progress.",
                      "Tujuan tersimpan. Kembali ke halaman ini setelah 30 hari untuk meninjau kemajuan Anda."
                    )}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              KEY TAKEAWAY
          ════════════════════════════════════════════════════════════ */}
          <section style={sec(lightGray)}>
            <div style={inner}>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                color: orange,
                fontWeight: 700,
                marginBottom: "2.5rem",
              }}>
                {t("THREE THINGS TO TAKE WITH YOU", "TIGA HAL YANG DIBAWA")}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                {[
                  {
                    en: "Silence is not the absence of something. It is the presence of Someone. The discipline is not about quiet for its own sake - it is about clearing the path for what God wants to say.",
                    id: "Keheningan bukan ketiadaan sesuatu. Ini adalah kehadiran Seseorang. Disiplin ini bukan tentang ketenangan demi ketenangan itu sendiri - ini tentang membersihkan jalan untuk apa yang ingin Allah katakan.",
                  },
                  {
                    en: "Start smaller than feels meaningful. Five minutes of intentional silence is infinitely more formative than zero minutes of planned silence. Consistency matters more than duration at the beginning.",
                    id: "Mulailah lebih kecil dari yang terasa bermakna. Lima menit keheningan yang intentional jauh lebih membentuk daripada nol menit keheningan yang direncanakan. Konsistensi lebih penting dari durasi di awal.",
                  },
                  {
                    en: "Your silence shapes your team's culture. Leaders who protect space for quiet give their teams permission to do the same. You are not just building a personal discipline - you are modelling something.",
                    id: "Keheningan Anda membentuk budaya tim Anda. Pemimpin yang melindungi ruang untuk ketenangan memberi tim mereka izin untuk melakukan hal yang sama. Anda tidak hanya membangun disiplin pribadi - Anda memodelkan sesuatu.",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                    <span style={{
                      fontFamily: CORMORANT,
                      fontWeight: 600,
                      fontSize: "2rem",
                      color: orange,
                      lineHeight: 1,
                      flexShrink: 0,
                      paddingTop: "0.1rem",
                    }}>
                      {i + 1}
                    </span>
                    <p style={{ ...prose, margin: 0 }}>
                      {t(item.en, item.id)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              CTA STRIP
          ════════════════════════════════════════════════════════════ */}
          <section style={{
            background: navy,
            padding: "3rem 24px",
            textAlign: "center",
          }}>
            <div style={{ maxWidth: MX, margin: "0 auto" }}>
              <p style={{
                fontFamily: CORMORANT,
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
                color: "white",
                lineHeight: 1.7,
                maxWidth: 600,
                margin: "0 auto",
              }}>
                {t(
                  "The most important next step is the smallest one. Choose one practice from the scenario cards above. Try it this week. Return here when you are ready to go deeper.",
                  "Langkah terpenting berikutnya adalah yang terkecil. Pilih satu praktik dari kartu skenario di atas. Coba minggu ini. Kembali ke sini ketika Anda siap untuk lebih dalam."
                )}
              </p>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              SOURCES
          ════════════════════════════════════════════════════════════ */}
          <section style={sec(lightGray, "0")}>
            <div style={{ ...inner, paddingTop: "3rem", paddingBottom: "1rem" }}>
              <div style={{ borderTop: `1px solid oklch(80% 0.01 260)`, paddingTop: "2rem" }}>
                <button
                  onClick={() => setSourcesOpen(!sourcesOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    marginBottom: sourcesOpen ? "1.5rem" : 0,
                  }}
                >
                  <p style={{
                    fontFamily: FONT,
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: orange,
                    fontWeight: 700,
                    margin: 0,
                  }}>
                    {t("Sources", "Sumber")}
                  </p>
                  <span style={{
                    fontFamily: FONT,
                    fontSize: "0.65rem",
                    color: sourcesOpen ? orange : "oklch(58% 0.05 260)",
                    transition: "color 0.2s ease",
                  }}>
                    {sourcesOpen ? "▲" : "▼"}
                  </span>
                </button>

                <div style={{
                  display: "grid",
                  gridTemplateRows: sourcesOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 0.3s ease",
                  overflow: "hidden",
                }}>
                  <div style={{ minHeight: 0 }}>
                    {[
                      { n: 1, text: "Frontiers in Cognition, \"The Impact of Digital Technology, Social Media, and AI on Cognitive Functions\" (2023)", url: "https://www.frontiersin.org/journals/cognition/articles/10.3389/fcogn.2023.1203077/full" },
                      { n: 2, text: "Scientific Reports, \"Acute Smartphone Use Impairs Vigilance and Inhibition Capacities\" (2023)", url: "https://preview-www.nature.com/articles/s41598-023-50354-3" },
                      { n: 3, text: "Scientific Reports / PMC, \"Does the Brain Drain Effect Really Exist?\" (2023)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10525686/" },
                      { n: 4, text: "Church Life Journal (Notre Dame), \"This Is Your Brain in a Digital Age\"", url: "https://churchlifejournal.nd.edu/articles/this-is-your-brain-in-a-digital-age/" },
                      { n: 5, text: "Working Preacher, Commentary on 1 Kings 19:1-15", url: "https://www.workingpreacher.org/commentaries/revised-common-lectionary/ordinary-12-3/commentary-on-1-kings-191-45-78-15a-2" },
                      { n: 6, text: "JesusWalk Bible Study, \"Recognizing God's Voice: 1 Kings 19\"", url: "https://www.jesuswalk.com/voice/2_recognizing.htm" },
                      { n: 7, text: "Conversatio Divina, \"Ancient Christian Wisdom for a Postmodern Age: Knowledge Born in Silence\"", url: "https://conversatio.org/ancient-christian-wisdom-for-a-postmodern-age-knowledge-born-in-silence/" },
                      { n: 8, text: "Henri Nouwen, \"From Solitude to Community to Ministry\" - Christianity Today", url: "https://www.christianitytoday.com/pastors/content/from-solitude-to-community-to-ministry/" },
                      { n: 9, text: "Thomas Merton, New Seeds of Contemplation", url: "https://www.goodreads.com/work/quotes/1133302-new-seeds-of-contemplation" },
                      { n: 10, text: "Transforming Center, \"Practicing What We Preach: Solitude and Leadership\" (Ruth Haley Barton)", url: "https://transformingcenter.org/2016/07/practicing-preach/" },
                    ].map(({ n, text, url }) => (
                      <div key={n} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                        <span style={{
                          fontFamily: FONT,
                          fontSize: "0.7rem",
                          color: orange,
                          fontWeight: 700,
                          minWidth: "1.5rem",
                          paddingTop: "0.15rem",
                          flexShrink: 0,
                        }}>
                          {n}
                        </span>
                        <p style={{
                          fontFamily: FONT,
                          fontSize: "0.75rem",
                          color: "oklch(52% 0.05 260)",
                          margin: 0,
                          lineHeight: 1.65,
                        }}>
                          {text}{" "}
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: orange, textDecoration: "underline", wordBreak: "break-all" }}>
                            {url}
                          </a>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════
              BACKGROUND — SEO
          ════════════════════════════════════════════════════════════ */}
          <div style={{ background: navy, padding: "80px 24px" }}>
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <p style={{
                color: orange,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                marginBottom: 12,
              }}>
                Background
              </p>
              <h2 style={{
                fontFamily: FONT,
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                color: offWhite,
                marginBottom: 32,
                lineHeight: 1.2,
              }}>
                The Discipline of Silence - A Guide for Cross-Cultural Leaders
              </h2>
              <button
                onClick={() => setBgOpen(!bgOpen)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                  marginBottom: 24,
                  padding: "10px 20px",
                  background: "transparent",
                  border: `1.5px solid ${orange}`,
                  color: orange,
                  borderRadius: 12,
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                {bgOpen ? "Close ↑" : "Read background →"}
              </button>

              {bgOpen && [
                "The noise problem facing modern leaders is not new, but it has reached a new intensity. For most of human history, silence was the default condition and distraction required effort. Today, the opposite is true. Constant stimulation is the default and silence requires effort, intention, and often a countercultural willingness to look unproductive. For cross-cultural leaders who are already managing the cognitive load of language acquisition, cultural adaptation, team complexity, and the weight of high-stakes work, this shift is not merely inconvenient. It is formative - and not in a good direction.",
                "What the research reveals is sobering. The average adult now spends over four and a half hours daily on a smartphone, with the screen unlocked roughly 150 times. A 2023 peer-reviewed study published in Scientific Reports found that 45 minutes of smartphone use significantly impaired both vigilance and inhibition - precisely the capacities most needed for discernment and patient leadership. A separate meta-analysis of 22 studies confirmed what has been called the 'brain drain effect': the mere presence of a smartphone - even unused, face down - reduces available cognitive capacity. Leaders who do not understand this dynamic are not just distracted. They are being shaped by their devices in ways they are not choosing.",
                "Cross-cultural leaders face unique silence challenges that go beyond what most leadership literature addresses. Language switching is cognitively exhausting and leaves little bandwidth for the kind of reflective quiet that silence requires. The expectation of constant availability - to home offices, to supporters, to team members across time zones - means that there is always a legitimate reason to check the phone. Add the spiritual dimension of ministry culture, where busyness is often conflated with faithfulness, and the barriers to intentional silence multiply quickly. The result is not a minor inconvenience. It is a slow erosion of the interior capacity that cross-cultural work most demands: the ability to listen before speaking, to observe before acting, to wait before deciding.",
                "The biblical tradition of silence is rooted not in quietism but in receptivity. The story of Elijah at Horeb (1 Kings 19) is the paradigmatic text: a burned-out leader, a wilderness withdrawal, and then - after wind, earthquake, and fire - the qol demamah daqqah, the still small voice, the sound of sheer silence. God's most intimate communication came not in the spectacular but in the quiet. This is not incidental to the narrative. It is the theological claim at its center. The Desert Fathers of the fourth and fifth centuries built entire communities around this insight. Abba Arsenius, who had been an educated man at the Roman court, heard a voice: 'Flee, be silent, pray always.' He obeyed. He became one of the most sought-out spiritual directors of his generation - precisely because he had learned when not to speak.",
                "Henri Nouwen's contribution to this conversation is essential for any leader in Christian ministry. His central claim in 'From Solitude to Community to Ministry' is that the sequence matters: solitude comes first, then community, then ministry. Leaders who skip the first step become dependent on community and ministry for the affirmation that only solitude with God can provide. They begin - unconsciously - to demand from their teams and their work what only God can give. Nouwen describes solitude not as isolation but as the place where one discovers that one is beloved before being useful. For leaders who derive their identity from effectiveness, this is genuinely disruptive. It is also genuinely necessary.",
                "The monastic tradition offers what modern leadership development largely lacks: a sustained, multi-century experiment in what it takes to form people who can hear. The Rule of Saint Benedict - written in the sixth century and still guiding communities today - structures the entire day around the rhythm of work, prayer, and silence. The insights are not primarily about productivity. They are about what happens to a person who, over years, stops filling every available moment with activity. Abbot Christopher Jamison, in his writing on the monastic contribution to modern life, argues that the capacity for contemplation - for sustained, attentive, non-grasping presence - is the very capacity that modern culture most systematically destroys, and that monastic practice most systematically builds.",
                "Lectio divina, the practice of slow, attentive reading of Scripture developed in the Benedictine tradition, offers a practical entry point for leaders who find unstructured silence difficult. The practice involves reading a short passage three times: once to hear the text, once to notice what word or phrase arrests attention, and a third time to rest in that word without explanation. The final movement - contemplatio - is wordless rest in God's presence. It requires no special equipment, no extended block of time, and no prior spiritual formation. Five verses and fifteen minutes is enough to begin. Many leaders who have tried extended silence and found it impossible have found lectio divina accessible as an entry practice - a structured way to approach the quiet that unstructured silence can initially refuse.",
                "The team dimension of silence is underexplored in most leadership writing. Leaders who practice silence personally but do not model it publicly communicate - by their pace, their reactivity, their always-on availability - that their team should also be always on. The research on psychological detachment is clear: leaders who mentally disconnect from work during nonwork hours have teams that recover better, report lower exhaustion, and show improved wellbeing. The converse is equally true. A leader who sends messages at 11pm, who checks email during dinner, who answers every notification within minutes, creates an implicit expectation that the team should do the same. Team silence practices - opening meetings with quiet, introducing a team digital sabbath, creating shared norms around after-hours communication - are not soft leadership choices. They are structural decisions with measurable effects on team culture and capacity.",
                "The digital sabbath and the digital fast are sustainable practices precisely because they are bounded. A 24-hour digital fast once a month, a device-free commute once a day, an annual 48-hour silent retreat - none of these require extraordinary circumstances or unusual resources. What they require is a decision, made in advance, that something matters more than the inbox. The Desert Fathers understood this. They did not flee distraction; they built structures that made distraction structurally unavailable. For leaders who find their good intentions repeatedly overridden by urgent notifications, the lesson is not to try harder. It is to build better structures. The practice has to be decided before the temptation arrives.",
                "Where to start is always the same answer: smaller than you think and sooner than feels justified. Five minutes of intentional silence before checking the phone in the morning. One walk per week without earbuds. A two-minute silence before a team meeting. These are not the end of the practice. They are the beginning of a nervous system that can eventually hold longer quiet. The discipline of silence is not a destination. It is a direction. And the direction is toward the only voice that, in the long run, gives any other voice its authority.",
              ].map((para, i) => (
                <p key={i} style={{
                  fontSize: 16,
                  color: "oklch(82% 0.03 260)",
                  lineHeight: 1.85,
                  marginBottom: 20,
                  fontFamily: FONT,
                }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─── If assessment not yet complete, show a prompt ─── */}
      {!assessmentComplete && (
        <section style={{ background: offWhite, padding: "3rem 24px", textAlign: "center" }}>
          <div style={{ maxWidth: MX, margin: "0 auto" }}>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.875rem",
              color: "oklch(58% 0.05 260)",
              fontStyle: "italic",
            }}>
              {t(
                "Complete the self-assessment above to unlock the teaching section.",
                "Selesaikan penilaian diri di atas untuk membuka bagian pengajaran."
              )}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
