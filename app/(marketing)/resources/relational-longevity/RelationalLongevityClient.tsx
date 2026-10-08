"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

// --- TYPES ------------------------------------------------------------------

type Lang = "en" | "id";
type Props = { userPathway: string | null; isSaved: boolean };

const tFn = (en: string, id: string, lang: Lang): string =>
  lang === "en" ? en : id;

// --- VERSES -----------------------------------------------------------------

const VERSES = {
  "col-3-14": {
    en_ref: "Colossians 3:14",
    id_ref: "Kolose 3:14",
    en: "And over all these virtues put on love, which binds them all together in perfect unity.",
    id: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
    en_version: "NIV",
    id_version: "TB",
  },
  "acts-15-39": {
    en_ref: "Acts 15:39",
    id_ref: "Kisah Para Rasul 15:39",
    en: "They had such a sharp disagreement that they parted company.",
    id: "Hal itu menimbulkan perselisihan yang tajam, sehingga mereka berpisah.",
    en_version: "NIV",
    id_version: "TB",
  },
};

// --- SUPERSCRIPT HELPER -----------------------------------------------------

function withSup(text: string): React.ReactNode {
  const parts = text.split(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^[¹²³⁴⁵⁶⁷⁸⁹⁰]+$/.test(part) ? (
      <span key={i} style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

// --- SKILL SECTIONS ---------------------------------------------------------

type SkillKey = "listening" | "conflict" | "loss";

const SKILLS: {
  key: SkillKey;
  accentColor: string;
  accentBg: string;
  en_label: string;
  id_label: string;
  en_subtitle: string;
  id_subtitle: string;
  en_intro: string;
  id_intro: string;
  en_scenario_heading: string;
  id_scenario_heading: string;
  en_scenario: string;
  id_scenario: string;
  en_typical_label: string;
  id_typical_label: string;
  en_typical: string;
  id_typical: string;
  en_better_label: string;
  id_better_label: string;
  en_better: string;
  id_better: string;
  en_technique_heading: string;
  id_technique_heading: string;
  en_technique_steps: { label: string; body: string }[];
  id_technique_steps: { label: string; body: string }[];
}[] = [
  {
    key: "listening",
    accentColor: "oklch(45% 0.14 200)",
    accentBg: "oklch(45% 0.14 200 / 0.08)",
    en_label: "Loving Listening",
    id_label: "Mendengarkan dengan Kasih",
    en_subtitle: "The shift from advice-giver to question-asker",
    id_subtitle: "Beralih dari pemberi saran menjadi penanya",
    en_intro:
      "Most of us were trained to fix, advise and respond quickly. We offer solutions before the other person has finished speaking. In cross-cultural teams, where so much context stays hidden, the first skill is simple: stay longer in the question. Loving listening is an active choice. You try to understand before you are understood, and you ask before you assume.",
    id_intro:
      "Sebagian besar dari kita dilatih untuk memperbaiki, memberi saran dan merespons dengan cepat. Kita menawarkan solusi sebelum orang lain selesai bicara. Dalam tim lintas budaya, di mana banyak konteks tidak terlihat, keterampilan pertama itu sederhana: bertahanlah lebih lama dalam pertanyaan. Mendengarkan dengan kasih adalah pilihan yang aktif. Kamu berusaha memahami sebelum dipahami, dan bertanya sebelum berasumsi.",
    en_scenario_heading: "The scenario",
    id_scenario_heading: "Skenario",
    en_scenario:
      "A colleague from a different cultural background approaches you after a team meeting. She says quietly: \"I'm not sure I can keep going like this. Everything feels so heavy.\"",
    id_scenario:
      "Seorang kolega dari latar belakang budaya yang berbeda mendekatimu setelah rapat tim. Dia berkata pelan: \"Saya tidak yakin bisa terus seperti ini. Semuanya terasa begitu berat.\"",
    en_typical_label: "Typical response",
    id_typical_label: "Respons umum",
    en_typical:
      "\"I know how you feel. Have you tried taking some time off? You probably just need rest. Things will get better. Remember why you're here. Let me know if I can help with your workload.\"",
    id_typical:
      "\"Saya mengerti perasaanmu. Sudahkah kamu mencoba mengambil waktu istirahat? Kamu mungkin hanya perlu istirahat. Semuanya akan membaik. Ingat kenapa kamu ada di sini. Beri tahu saya kalau saya bisa membantu dengan beban kerjamu.\"",
    en_better_label: "Loving listening response",
    id_better_label: "Respons mendengarkan dengan kasih",
    en_better:
      "\"That sounds really hard. [Pause.] What's making it feel the heaviest right now?\" Then wait. Fully. Don't rescue, don't redirect. The pause may feel awkward, but it is often where the real issue comes to the surface.",
    id_better:
      "\"Kedengarannya sangat berat. [Jeda.] Apa yang paling membuatnya terasa berat saat ini?\" Lalu tunggu. Sepenuhnya. Jangan menyelamatkan, jangan mengalihkan. Jeda itu mungkin terasa canggung, tetapi sering kali di situlah masalah yang sebenarnya muncul.",
    en_technique_heading: "The technique: Reflect, Ask, Wait",
    id_technique_heading: "Tekniknya: Refleksikan, Tanyakan, Tunggu",
    en_technique_steps: [
      {
        label: "Reflect",
        body: "Mirror back what you heard. Keep it short: \"That sounds exhausting.\" \"It sounds like something shifted recently.\" This tells the other person you received what they said. Mindful listening is one of the core skills in intercultural conflict work, and it starts here.⁴",
      },
      {
        label: "Ask",
        body: "Ask one open question, not a checklist. \"What feels hardest right now?\" or \"Where is most of the weight coming from?\" One question, then stop. A string of questions can feel like an interrogation, especially in high-context cultures, and people go quiet.",
      },
      {
        label: "Wait",
        body: "Silence is not a problem to fix. In many high-context cultures, a pause before answering shows respect and careful thought. People raised in more direct cultures often rush to fill the gap, yet the real answer often forms in that silence. Give it 5 seconds. Then 10.",
      },
    ],
    id_technique_steps: [
      {
        label: "Refleksikan",
        body: "Ulangi kembali apa yang kamu dengar. Cukup singkat: \"Kedengarannya melelahkan.\" \"Sepertinya ada yang berubah belakangan ini.\" Ini menunjukkan bahwa kamu sungguh menerima apa yang dia katakan. Mendengarkan dengan penuh perhatian adalah salah satu keterampilan inti dalam menangani konflik antarbudaya, dan semuanya dimulai di sini.⁴",
      },
      {
        label: "Tanyakan",
        body: "Ajukan satu pertanyaan terbuka, bukan daftar periksa. \"Apa yang paling berat saat ini?\" atau \"Dari mana sebagian besar beban itu datang?\" Satu pertanyaan, lalu berhenti. Rentetan pertanyaan bisa terasa seperti interogasi, terutama dalam budaya high-context, dan orang pun jadi diam.",
      },
      {
        label: "Tunggu",
        body: "Keheningan bukan masalah yang harus diperbaiki. Dalam banyak budaya high-context, jeda sebelum menjawab menunjukkan rasa hormat dan pemikiran yang matang. Orang dari budaya yang lebih langsung sering buru-buru mengisi keheningan, padahal jawaban yang sebenarnya sering terbentuk di sana. Beri waktu 5 detik. Lalu 10.",
      },
    ],
  },
  {
    key: "conflict",
    accentColor: "oklch(50% 0.17 30)",
    accentBg: "oklch(50% 0.17 30 / 0.08)",
    en_label: "Handling Conflict Well",
    id_label: "Menangani Konflik dengan Baik",
    en_subtitle: "Cross-cultural conflict escalation patterns",
    id_subtitle: "Pola eskalasi konflik lintas budaya",
    en_intro:
      "Conflict in cross-cultural teams rarely announces itself. It often moves in patterns that newcomers miss, especially when cultures differ on directness, hierarchy and face.⁵ If you understand the three stages of escalation and what usually goes wrong at each one, your team has a far better chance of repairing instead of fracturing.",
    id_intro:
      "Konflik dalam tim lintas budaya jarang muncul terang-terangan. Sering kali konflik bergerak dalam pola yang tidak terlihat oleh pendatang baru, terutama ketika budaya berbeda soal keterusterangan, hierarki dan menjaga muka.⁵ Kalau kamu memahami tiga tahap eskalasi dan apa yang biasanya salah di setiap tahap, timmu punya peluang jauh lebih besar untuk pulih daripada retak.",
    en_scenario_heading: "Three stages of escalation",
    id_scenario_heading: "Tiga tahap eskalasi",
    en_scenario:
      "A senior team member keeps dismissing ideas from a junior colleague in team meetings. He is not aggressive, just consistent. The junior colleague says nothing in the meetings, but starts pulling back from team activities.",
    id_scenario:
      "Seorang anggota tim senior terus mengabaikan ide dari kolega junior dalam rapat tim. Dia tidak agresif, tetapi konsisten. Kolega junior tidak berkata apa-apa dalam rapat, tetapi mulai menarik diri dari kegiatan tim.",
    en_typical_label: "Stage 1: Signal",
    id_typical_label: "Tahap 1: Sinyal",
    en_typical:
      "The junior colleague's silence and withdrawal IS the signal. In many cultures, including Indonesian settings where harmony (rukun) and shame (malu) shape how people speak, conflict is often expressed indirectly.⁶ Pulling back carries a message. The common mistake: a leader from a more direct culture reads it as disengagement or personality, and misses the relational signal that something is wrong.",
    id_typical:
      "Diam dan menarik dirinya kolega junior ITULAH sinyalnya. Dalam banyak budaya, termasuk di Indonesia di mana rukun dan malu membentuk cara orang berbicara, konflik sering diungkapkan secara tidak langsung.⁶ Menarik diri pun membawa pesan. Kesalahan yang sering terjadi: pemimpin dari budaya yang lebih langsung membacanya sebagai kurang peduli atau soal kepribadian, lalu melewatkan sinyal relasional bahwa ada yang tidak beres.",
    en_better_label: "Stage 2: Response",
    id_better_label: "Tahap 2: Respons",
    en_better:
      "When the signal is ignored, one of two things usually happens. The tension hardens into resentment and the relationship slowly dies, or it erupts later with more force, often in the wrong setting. The window to respond is between signal and escalation. A skilled leader names the pattern they have noticed, without labelling it a conflict. Privately, gently, specifically: \"I've noticed you've been quieter recently. Is there something I should be aware of?\"",
    id_better:
      "Ketika sinyal diabaikan, biasanya terjadi salah satu dari dua hal. Ketegangan mengeras menjadi kepahitan dan hubungan perlahan mati, atau meledak kemudian dengan lebih keras, sering di situasi yang salah. Waktu terbaik untuk merespons ada di antara sinyal dan eskalasi. Pemimpin yang terampil menyebutkan pola yang dia perhatikan, tanpa menyebutnya konflik. Secara pribadi, lembut dan spesifik: \"Saya perhatikan kamu lebih pendiam belakangan ini. Apakah ada sesuatu yang perlu saya ketahui?\"",
    en_technique_heading: "Stage 3: Resolution",
    id_technique_heading: "Tahap 3: Resolusi",
    en_technique_steps: [
      {
        label: "Resolution is not the same as agreement",
        body: "Cross-cultural conflict rarely ends with both sides openly naming what happened. In high-context cultures, naming a conflict directly can feel more damaging than the conflict itself. Resolution may look like this: the senior team member starts including the junior's ideas, the junior re-engages, and nobody ever says the word 'conflict.' The relationship moves forward.",
      },
      {
        label: "Third-party facilitation",
        body: "In many cultures, a trusted go-between is the right path for resolving conflict, and using one is no sign of failure.⁵ A respected team member, a senior pastor or an elder who carries weight with both people can often open a way that direct confrontation cannot. Leaders who insist on face-to-face resolution may be applying their own cultural framework instead of serving the relationship.",
      },
      {
        label: "Don't wait for a crisis",
        body: "The best conflict work happens long before any single event. Build a team culture where small tensions are named early, where questions are safe to ask, and where leaders show vulnerability by saying: \"I think something is off between us. Can we talk?\" In a healthy team, conflict still happens, but it comes to the surface quickly instead of festering underneath.",
      },
    ],
    id_technique_steps: [
      {
        label: "Resolusi tidak sama dengan kesepakatan",
        body: "Konflik lintas budaya jarang berakhir dengan kedua pihak terang-terangan membicarakan apa yang terjadi. Dalam budaya high-context, menyebut konflik secara langsung bisa terasa lebih merusak daripada konflik itu sendiri. Resolusi bisa terlihat seperti ini: anggota tim senior mulai memakai ide si junior, si junior kembali terlibat, dan tidak ada yang pernah menyebut kata 'konflik.' Hubungan pun bergerak maju.",
      },
      {
        label: "Fasilitasi pihak ketiga",
        body: "Dalam banyak budaya, perantara yang dipercaya adalah jalan yang tepat untuk menyelesaikan konflik, dan memakainya bukan tanda kegagalan.⁵ Anggota tim yang dihormati, pendeta senior, atau tokoh yang disegani kedua pihak sering bisa membuka jalan yang tidak bisa dibuka oleh konfrontasi langsung. Pemimpin yang memaksakan penyelesaian empat mata mungkin sedang menerapkan kerangka budayanya sendiri, bukan melayani hubungan itu.",
      },
      {
        label: "Jangan menunggu krisis",
        body: "Penanganan konflik yang terbaik terjadi jauh sebelum ada peristiwa besar. Bangun budaya tim di mana ketegangan kecil dibicarakan sejak awal, di mana bertanya itu aman, dan di mana pemimpin memberi teladan keterbukaan dengan berkata: \"Sepertinya ada yang tidak beres di antara kita. Bisa kita bicara?\" Dalam tim yang sehat, konflik tetap ada, tetapi cepat muncul ke permukaan dan tidak dibiarkan membusuk di bawah.",
      },
    ],
  },
  {
    key: "loss",
    accentColor: "oklch(42% 0.12 290)",
    accentBg: "oklch(42% 0.12 290 / 0.08)",
    en_label: "Processing Loss Together",
    id_label: "Mengolah Kehilangan Bersama",
    en_subtitle: "The unique grief of cross-cultural life",
    id_subtitle: "Duka unik kehidupan lintas budaya",
    en_intro:
      "Cross-cultural workers don't just experience losses. They accumulate them. Every departure, transition and goodbye is a small grief that rarely gets named, let alone processed. Families serving abroad and international team members often live with compacted grief: losses stack up faster than they can be processed, and field culture can make grieving feel out of place. Relational breakdown often starts here, in loss nobody has put into words, long before any open conflict.",
    id_intro:
      "Pekerja lintas budaya tidak hanya mengalami kehilangan. Mereka mengumpulkannya. Setiap kepergian, transisi dan perpisahan adalah duka kecil yang jarang disebut, apalagi diolah. Keluarga pekerja lapangan dan anggota tim internasional sering hidup dengan duka yang menumpuk: kehilangan datang lebih cepat daripada yang bisa diolah, dan budaya lapangan bisa membuat berduka terasa tidak pantas. Kerusakan relasional sering dimulai di sini, dalam kehilangan yang tidak pernah diungkapkan, jauh sebelum ada konflik terbuka.",
    en_scenario_heading: "What accumulated loss looks like",
    id_scenario_heading: "Seperti apa kehilangan yang menumpuk",
    en_scenario:
      "A team member has been on the field for four years. In that time two close colleagues have left, their child has changed schools twice, their home church has changed leadership, they were evacuated once during a political crisis with 48 hours to leave, and last month their closest local friend moved away. Each loss was brief. None was formally acknowledged. They arrive at team meetings on time, carry their responsibilities and laugh at the right moments. Inside, they are running on empty.",
    id_scenario:
      "Seorang anggota tim sudah empat tahun di lapangan. Selama itu, dua kolega dekat sudah pergi, anaknya pindah sekolah dua kali, gereja asalnya berganti pemimpin, dia pernah dievakuasi saat krisis politik dan hanya punya 48 jam untuk pergi, dan bulan lalu sahabat lokal terdekatnya pindah kota. Setiap kehilangan terjadi sebentar. Tidak satu pun diakui secara resmi. Dia datang ke rapat tepat waktu, menjalankan tanggung jawabnya dan tertawa di saat yang tepat. Di dalam, dia kehabisan tenaga.",
    en_typical_label: "What teams typically miss",
    id_typical_label: "Yang biasanya dilewatkan tim",
    en_typical:
      "Teams that run well on tasks often have no language for grief. Debriefs focus on tasks, logistics and planning, and never ask: \"What have we lost this season? What do we need to grieve before we move on?\" Many workers never get a debrief at all. One recent survey found only 14% of returning workers had received one.⁷ Unnamed loss has a cost: people disengage, resentment toward leaders grows, and some end up leaving.",
    id_typical:
      "Tim yang berjalan baik dalam tugas sering tidak punya bahasa untuk duka. Debriefing berfokus pada tugas, logistik dan rencana, dan tidak pernah bertanya: \"Apa yang sudah kita kehilangan di musim ini? Apa yang perlu kita ratapi sebelum melangkah?\" Banyak pekerja bahkan tidak pernah mendapat debriefing. Sebuah survei terbaru menemukan hanya 14% pekerja yang pulang yang pernah menerimanya.⁷ Kehilangan yang tidak disebut ada harganya: orang menarik diri, kepahitan terhadap pemimpin tumbuh, dan sebagian akhirnya pergi.",
    en_better_label: "How to create space for loss",
    id_better_label: "Cara memberi tempat bagi duka",
    en_better:
      "It starts with the leader naming their own losses first. This is honest modelling, not a show of vulnerability: \"Before we look at the quarter ahead, I want to name something we've lost. Sarah leaving took something from this team. I miss working with her. Does anyone else want to name what they've been carrying?\" Naming, inviting and not rushing past builds the relational safety that helps people stay.",
    id_better:
      "Semuanya dimulai dengan pemimpin yang lebih dulu menyebut kehilangannya sendiri. Ini teladan yang jujur, bukan pertunjukan kerentanan: \"Sebelum kita melihat kuartal ke depan, saya ingin menyebut sesuatu yang sudah kita kehilangan. Kepergian Sarah mengambil sesuatu dari tim ini. Saya rindu bekerja bersamanya. Ada yang ingin menyebut apa yang sedang kalian pikul?\" Menyebut, mengundang dan tidak buru-buru melewatinya membangun rasa aman yang membantu orang bertahan.",
    en_technique_heading: "Three practices for teams",
    id_technique_heading: "Tiga praktik untuk tim",
    en_technique_steps: [
      {
        label: "The goodbye ritual",
        body: "Every departure deserves a proper farewell. Go beyond a cake and a card: give it a structured moment where the team speaks honestly about what this person gave and what leaves with them. A goodbye ritual is grief hygiene. It keeps unspoken loss from piling up.",
      },
      {
        label: "The quarterly grief check",
        body: "Once a quarter, before forward planning, add one question to the team meeting: \"What has this team lost, in people, momentum or dreams, that we haven't yet acknowledged?\" Keep a written list where everyone can see it. Naming loss keeps a team resilient, and it is different from wallowing.",
      },
      {
        label: "The personal loss inventory",
        body: "As a leader, ask team members one by one, and often: \"How is the weight of transition sitting with you right now?\" 'How are you doing?' gets a social answer. A specific, honest question gets a real one. Cross-cultural workers often carry losses silently because no one asked. Your question changes that.",
      },
    ],
    id_technique_steps: [
      {
        label: "Ritual perpisahan",
        body: "Setiap kepergian layak mendapat perpisahan yang pantas. Lebih dari kue dan kartu, beri waktu khusus di mana tim berbicara jujur tentang apa yang sudah diberikan orang ini dan apa yang ikut pergi bersamanya. Ritual perpisahan adalah cara merawat duka. Ini menjaga agar kehilangan yang tak terucap tidak menumpuk.",
      },
      {
        label: "Pemeriksaan duka triwulanan",
        body: "Sekali setiap kuartal, sebelum membahas rencana ke depan, tambahkan satu pertanyaan di rapat tim: \"Apa yang sudah hilang dari tim ini, baik orang, semangat atau impian, yang belum kita akui?\" Simpan daftar tertulis yang bisa dilihat semua orang. Menyebut kehilangan membuat tim tetap tangguh, dan itu berbeda dengan larut dalam kesedihan.",
      },
      {
        label: "Inventaris kehilangan pribadi",
        body: "Sebagai pemimpin, tanyakan kepada anggota timmu satu per satu, dan sering: \"Bagaimana beban transisi ini terasa buatmu sekarang?\" 'Apa kabar?' hanya mendapat jawaban basa-basi. Pertanyaan yang spesifik dan jujur mendapat jawaban yang sebenarnya. Pekerja lintas budaya sering memikul kehilangan dalam diam karena tidak ada yang bertanya. Pertanyaanmu mengubah itu.",
      },
    ],
  },
];

// --- HEALTH CHECK STATEMENTS ------------------------------------------------

const HEALTH_CHECKS: {
  id: string;
  en: string;
  id_lang: string;
}[] = [
  {
    id: "hc1",
    en: "When a colleague shares something difficult, my first instinct is to listen, not to fix or advise.",
    id_lang: "Ketika seorang kolega berbagi sesuatu yang sulit, naluri pertama saya adalah mendengarkan, bukan memperbaiki atau memberi saran.",
  },
  {
    id: "hc2",
    en: "I notice early signals that something is off in a relationship, before it becomes a visible problem.",
    id_lang: "Saya memperhatikan sinyal awal bahwa ada yang tidak beres dalam suatu hubungan, sebelum menjadi masalah yang terlihat.",
  },
  {
    id: "hc3",
    en: "I feel free to name tension or awkwardness directly with the people I work with.",
    id_lang: "Saya merasa bebas untuk menyebut ketegangan atau kecanggungan secara langsung dengan orang-orang yang bekerja bersama saya.",
  },
  {
    id: "hc4",
    en: "My team has language for grief and loss, not just for tasks and plans.",
    id_lang: "Tim saya punya bahasa untuk duka dan kehilangan, bukan hanya untuk tugas dan rencana.",
  },
  {
    id: "hc5",
    en: "When I reflect on the goodbyes and transitions of the past year, I feel they were adequately acknowledged.",
    id_lang: "Ketika saya merenungkan perpisahan dan transisi setahun terakhir, saya merasa semuanya sudah cukup diakui.",
  },
  {
    id: "hc6",
    en: "The relationships on my team feel strong enough to survive a real disagreement.",
    id_lang: "Hubungan dalam tim saya terasa cukup kuat untuk bertahan dari perbedaan pendapat yang nyata.",
  },
];

// --- COMPONENT --------------------------------------------------------------

export default function RelationalLongevityClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [openSkill, setOpenSkill] = useState<SkillKey | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("relational-longevity");
      setSaved(true);
    });
  }

  function toggleCheck(id: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // --- BRAND TOKENS ----------------------------------------------------------
  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(96% 0.005 80)";
  const lightGray = "oklch(88% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";
  const eyebrow: React.CSSProperties = {
    fontFamily: "Montserrat, sans-serif",
    color: orange,
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: orange,
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
          fontSize: "inherit",
          padding: 0,
          textDecoration: "underline dotted",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </button>
    );
  }

  // --- RENDER ----------------------------------------------------------------
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* -- Language Bar --------------------------------------------------- */}

      {/* -- Hero ----------------------------------------------------------- */}
      <section style={{ background: navy, padding: "88px 24px 80px", position: "relative", overflow: "hidden" }}>
        <img
          src="/images/resources/relational-longevity/hero.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            mixBlendMode: "luminosity",
            pointerEvents: "none",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <p style={{ ...eyebrow, marginBottom: 20 }}>
            {t("Team & Facilitation", "Tim & Fasilitasi")}
          </p>

          {/* Striking stat */}
          <div
            style={{
              display: "inline-block",
              background: "oklch(65% 0.15 45 / 0.12)",
              border: "1px solid oklch(65% 0.15 45 / 0.4)",
              borderRadius: 12,
              padding: "10px 18px",
              marginBottom: 28,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(14px, 1.6vw, 17px)",
                color: orange,
                margin: 0,
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              {withSup(
                t(
                  "Most early departures from the field are preventable.¹ Team relationships are a big part of the story.²",
                  "Sebagian besar kepergian dini dari lapangan sebenarnya bisa dicegah.¹ Hubungan dalam tim adalah bagian besar dari ceritanya.²"
                )
              )}
            </p>
          </div>

          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              color: offWhite,
              margin: "0 0 24px",
              lineHeight: 1.08,
            }}
          >
            {t("Relational Longevity", "Kelanggengan Relasional")}
          </h1>

          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(17px, 2vw, 22px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.75,
              maxWidth: 640,
              marginBottom: 32,
              fontStyle: "italic",
            }}
          >
            {withSup(
              t(
                "Broken team relationships are one of the main preventable reasons cross-cultural workers leave the field early.²³ Here are three skills that help people stay.",
                "Hubungan tim yang rusak adalah salah satu alasan utama yang bisa dicegah mengapa pekerja lintas budaya meninggalkan lapangan lebih awal.²³ Berikut tiga keterampilan yang membantu orang bertahan."
              )
            )}
          </p>

          {/* Opening question */}
          <div
            style={{
              borderLeft: `3px solid ${orange}`,
              paddingLeft: 20,
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 20px)",
                color: "oklch(88% 0.02 80)",
                lineHeight: 1.7,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {t(
                "Think of the last person who left your team or organisation earlier than expected. What was the real reason?",
                "Pikirkan orang terakhir yang meninggalkan tim atau organisasimu lebih cepat dari yang diharapkan. Apa alasan sebenarnya?"
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saved || isPending}
              aria-pressed={saved}
              aria-label={
                saved
                  ? t("Saved to your dashboard", "Tersimpan di dasbor kamu")
                  : t("Save this module to your dashboard", "Simpan modul ini ke dasbor kamu")
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
                padding: "10px 24px",
                border: "none",
                borderRadius: 4,
                background: saved ? "oklch(35% 0.05 260)" : orange,
                color: offWhite,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: saved ? "default" : "pointer",
              }}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                <path
                  d="M6 3h12v18l-6-4.5L6 21z"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{saved ? t("Saved to Dashboard", "Tersimpan di Dasbor") : t("Save to Dashboard", "Simpan ke Dasbor")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* -- Context Bar ----------------------------------------------------- */}
      <div style={{ background: "oklch(28% 0.09 260)", padding: "32px 24px" }}>
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              stat: "71%",
              en: "of attrition is preventable, according to the ReMAP II study¹",
              id: "kepergian dari lapangan sebenarnya bisa dicegah, menurut studi ReMAP II¹",
            },
            {
              stat: "SYIS",
              en: "Sharpening Your Interpersonal Skills: the curriculum behind this module",
              id: "Mengasah Keterampilan Interpersonal: kurikulum di balik modul ini",
            },
            {
              stat: "3",
              en: "skills this module practises: listening, handling conflict and grieving loss together",
              id: "keterampilan yang dilatih modul ini: mendengarkan, menangani konflik dan berduka bersama",
            },
          ].map((item, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(32px, 4vw, 44px)",
                  fontWeight: 700,
                  color: orange,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {item.stat}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "oklch(76% 0.03 80)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {withSup(lang === "en" ? item.en : item.id)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* -- Three Skills Accordion ------------------------------------------ */}
      <div style={{ padding: "80px 24px", maxWidth: 860, margin: "0 auto" }}>
        <p style={{ ...eyebrow, marginBottom: 12, textAlign: "center" }}>
          {t("Three Relational Skills", "Tiga Keterampilan Relasional")}
        </p>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {t("Build the skills that keep teams together", "Bangun keterampilan yang menjaga tim tetap bersatu")}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: bodyText,
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 52px",
          }}
        >
          {t(
            "Each section is scenario-based. Read the situation, then compare the typical response with the skilled one.",
            "Setiap bagian berbasis skenario. Baca situasinya, lalu lihat perbedaan antara respons yang biasa dan respons yang terampil."
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SKILLS.map((skill, skillIdx) => {
            const isOpen = openSkill === skill.key;
            const label = lang === "en" ? skill.en_label : skill.id_label;
            const subtitle = lang === "en" ? skill.en_subtitle : skill.id_subtitle;

            return (
              <div
                key={skill.key}
                style={{
                  border: `1px solid ${isOpen ? skill.accentColor : "oklch(88% 0.01 80)"}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Accordion header */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSkill(isOpen ? null : skill.key)}
                  style={{
                    width: "100%",
                    background: isOpen ? skill.accentBg : offWhite,
                    border: "none",
                    cursor: "pointer",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                    transition: "background 0.2s",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      borderRadius: "50%",
                      border: `2px solid ${skill.accentColor}`,
                      color: skill.accentColor,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: serif,
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: 1,
                    }}
                  >
                    {skillIdx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "clamp(15px, 1.8vw, 18px)",
                        fontWeight: 800,
                        color: isOpen ? skill.accentColor : navy,
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 13, color: bodyText }}>{subtitle}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 20,
                      color: skill.accentColor,
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-flex",
                    }}
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div style={{ padding: "0 28px 36px", background: offWhite }}>
                    {/* Intro */}
                    <p
                      style={{
                        fontSize: 15,
                        color: bodyText,
                        lineHeight: 1.8,
                        marginBottom: 32,
                        paddingTop: 20,
                        borderTop: `2px solid ${skill.accentBg}`,
                      }}
                    >
                      {withSup(lang === "en" ? skill.en_intro : skill.id_intro)}
                    </p>

                    {/* Scenario */}
                    <div
                      style={{
                        background: lightGray,
                        borderRadius: 8,
                        padding: "20px 24px",
                        marginBottom: 28,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: skill.accentColor,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        {lang === "en" ? skill.en_scenario_heading : skill.id_scenario_heading}
                      </p>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: "clamp(15px, 1.7vw, 18px)",
                          fontStyle: "italic",
                          color: navy,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {lang === "en" ? skill.en_scenario : skill.id_scenario}
                      </p>
                    </div>

                    {/* Contrast: typical vs. better */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 16,
                        marginBottom: 32,
                      }}
                    >
                      {/* Typical */}
                      <div
                        style={{
                          background: "oklch(52% 0.18 25 / 0.06)",
                          border: "1px solid oklch(52% 0.18 25 / 0.2)",
                          borderRadius: 8,
                          padding: "18px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "oklch(48% 0.18 25)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          {lang === "en" ? skill.en_typical_label : skill.id_typical_label}
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: bodyText,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {withSup(lang === "en" ? skill.en_typical : skill.id_typical)}
                        </p>
                      </div>

                      {/* Better */}
                      <div
                        style={{
                          background: skill.accentBg,
                          border: `1px solid ${skill.accentColor}40`,
                          borderRadius: 8,
                          padding: "18px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: skill.accentColor,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          {lang === "en" ? skill.en_better_label : skill.id_better_label}
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: bodyText,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {withSup(lang === "en" ? skill.en_better : skill.id_better)}
                        </p>
                      </div>
                    </div>

                    {/* Technique steps */}
                    <div>
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 13,
                          fontWeight: 800,
                          color: navy,
                          marginBottom: 16,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {lang === "en" ? skill.en_technique_heading : skill.id_technique_heading}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {(lang === "en" ? skill.en_technique_steps : skill.id_technique_steps).map((step, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              gap: 16,
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: skill.accentColor,
                                color: offWhite,
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 12,
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <p
                                style={{
                                  fontFamily: "Montserrat, sans-serif",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: skill.accentColor,
                                  marginBottom: 4,
                                }}
                              >
                                {step.label}
                              </p>
                              <p
                                style={{
                                  fontSize: 14,
                                  color: bodyText,
                                  lineHeight: 1.75,
                                  margin: 0,
                                }}
                              >
                                {withSup(step.body)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* -- Relational Health Check ----------------------------------------- */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 12, textAlign: "center" }}>
            {t("Reflection", "Refleksi")}
          </p>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 800,
              color: navy,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("Relational Health Check", "Pemeriksaan Kesehatan Relasional")}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: bodyText,
              lineHeight: 1.7,
              textAlign: "center",
              marginBottom: 40,
              maxWidth: 560,
              margin: "0 auto 40px",
            }}
          >
            {t(
              "These six statements are honest prompts, with no score at the end. Sit with each one and notice what comes up.",
              "Enam pernyataan ini adalah ajakan untuk jujur, tanpa skor di akhir. Renungkan satu per satu dan perhatikan apa yang muncul."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HEALTH_CHECKS.map((item, idx) => {
              const isChecked = checkedItems.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isChecked}
                  onClick={() => toggleCheck(item.id)}
                  style={{
                    background: isChecked ? "oklch(65% 0.15 45 / 0.08)" : offWhite,
                    border: `1px solid ${isChecked ? orange : "oklch(88% 0.01 80)"}`,
                    borderRadius: 8,
                    padding: "18px 20px",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: `2px solid ${isChecked ? orange : "oklch(75% 0.02 80)"}`,
                      background: isChecked ? orange : "transparent",
                      flexShrink: 0,
                      marginTop: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {isChecked && (
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        aria-hidden="true"
                        style={{ display: "block" }}
                      >
                        <path
                          d="M1 4L4.5 7.5L11 1"
                          stroke={offWhite}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: orange,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <p
                      style={{
                        fontSize: 15,
                        color: isChecked ? navy : bodyText,
                        lineHeight: 1.7,
                        margin: 0,
                        fontWeight: isChecked ? 600 : 400,
                      }}
                    >
                      {lang === "en" ? item.en : item.id_lang}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reflection prompt below checklist */}
          {checkedItems.size > 0 && (
            <div
              style={{
                marginTop: 28,
                background: offWhite,
                borderRadius: 8,
                padding: "24px 28px",
                borderLeft: `4px solid ${orange}`,
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  fontStyle: "italic",
                  color: navy,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {checkedItems.size >= 5
                  ? t(
                      "These are real strengths. The challenge now is to protect them under pressure, in busy seasons and when the team is losing people.",
                      "Ini adalah kekuatan yang nyata. Tantangannya sekarang adalah menjaganya saat tertekan, di musim sibuk dan ketika tim kehilangan orang."
                    )
                  : checkedItems.size >= 3
                  ? t(
                      "You have a foundation to build on. The statements you didn't check are the ones to sit with. What would need to shift for them to become true?",
                      "Kamu punya fondasi untuk dibangun. Pernyataan yang tidak kamu centang adalah yang paling perlu direnungkan. Apa yang perlu berubah supaya pernyataan itu menjadi benar?"
                    )
                  : t(
                      "Honesty is the starting point. These gaps are exactly where the three skills in this module do their work.",
                      "Kejujuran adalah titik awal. Celah-celah ini justru tempat tiga keterampilan dalam modul ini bekerja."
                    )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* -- Biblical Foundation --------------------------------------------- */}
      <section style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 20 }}>
            {t("Biblical Foundation", "Dasar Alkitab")}
          </p>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 800,
              color: offWhite,
              marginBottom: 48,
            }}
          >
            {t(
              "Even the best relationships can break, and God still works",
              "Hubungan terbaik pun bisa retak, dan Allah tetap bekerja"
            )}
          </h2>

          {/* Verse 1: Colossians 3:14 */}
          <div style={{ marginBottom: 52 }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 14,
              }}
            >
              <VerseRef id="col-3-14">
                {lang === "en" ? VERSES["col-3-14"].en_ref : VERSES["col-3-14"].id_ref}
              </VerseRef>
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              &ldquo;{lang === "en" ? VERSES["col-3-14"].en : VERSES["col-3-14"].id}&rdquo;
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
              }}
            >
              {t(
                "Paul's letter to the Colossians lists the clothing of a healthy community: compassion, kindness, humility, gentleness, patience, forbearance and forgiveness. Look at the structure. Love is not just one more item on the list. It is what binds all the others together. Without love, the other virtues stay isolated skills, good in theory and brittle in practice. Communication techniques alone do not keep cross-cultural teams together. Love expressed through them does. The three skills in this module (listening, handling conflict and processing loss) are love made concrete.",
                "Surat Paulus kepada jemaat di Kolose menyebut 'pakaian' sebuah komunitas yang sehat: belas kasihan, kemurahan, kerendahan hati, kelemahlembutan, kesabaran, saling sabar dan saling mengampuni. Perhatikan susunannya. Kasih bukan sekadar satu butir lagi dalam daftar. Kasihlah yang mengikat semuanya. Tanpa kasih, kebajikan lain hanya menjadi keterampilan yang terpisah, bagus dalam teori tetapi rapuh dalam praktik. Teknik komunikasi saja tidak cukup untuk menjaga tim lintas budaya tetap bersatu. Kasih yang dinyatakan melalui teknik itulah yang menjaganya. Tiga keterampilan dalam modul ini (mendengarkan, menangani konflik dan mengolah kehilangan) adalah kasih yang diwujudkan."
              )}
            </p>
          </div>

          {/* Verse 2: Acts 15:39 */}
          <div
            style={{
              borderTop: "1px solid oklch(35% 0.06 260)",
              paddingTop: 48,
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 14,
              }}
            >
              <VerseRef id="acts-15-39">
                {lang === "en" ? VERSES["acts-15-39"].en_ref : VERSES["acts-15-39"].id_ref}
              </VerseRef>
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              &ldquo;{lang === "en" ? VERSES["acts-15-39"].en : VERSES["acts-15-39"].id}&rdquo;
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              {withSup(
                t(
                  "This verse has no neat happy ending. Paul and Barnabas had been sent out together by the church in Antioch and had planted churches across Galatia. Then they had a disagreement so sharp (the Greek word is paroxysmos) that they parted ways.⁸ The Bible does not play this down. It reports it plainly. Both men kept serving, each with a new partner. And the story did not end there. Paul later names Barnabas as a fellow worker (1 Corinthians 9:6) and asks for Mark, calling him useful for ministry (2 Timothy 4:11), which suggests the relationships were eventually restored.⁸",
                  "Ayat ini tidak punya akhir bahagia yang rapi. Paulus dan Barnabas diutus bersama oleh jemaat di Antiokhia dan telah mendirikan jemaat-jemaat di Galatia. Lalu mereka berselisih begitu tajam (kata Yunaninya paroxysmos) sehingga mereka berpisah.⁸ Alkitab tidak mengecilkan hal ini. Alkitab mencatatnya apa adanya. Keduanya tetap melayani, masing-masing dengan rekan baru. Dan ceritanya tidak berhenti di situ. Paulus kemudian menyebut Barnabas sebagai rekan sepelayanan (1 Korintus 9:6) dan meminta Markus datang karena pelayanannya berguna (2 Timotius 4:11). Ini menunjukkan bahwa hubungan mereka akhirnya dipulihkan.⁸"
                )
              )}
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
              }}
            >
              {t(
                "What this means for you: relational longevity is worth fighting for, and the three skills in this module are how you fight for it. Still, longevity is different from perfection. Some relationships will break despite your best efforts. Your relational health is measured by whether you brought love, honesty and humility to each relationship, and whether you keep doing so, more than by whether every one survived intact.",
                "Artinya bagimu: kelanggengan relasional layak diperjuangkan, dan tiga keterampilan dalam modul ini adalah cara memperjuangkannya. Namun langgeng tidak sama dengan sempurna. Sebagian hubungan akan retak meskipun kamu sudah berusaha sebaik mungkin. Kesehatan relasionalmu tidak diukur dari apakah semua hubungan bertahan utuh, tetapi dari apakah kamu membawa kasih, kejujuran dan kerendahan hati ke dalamnya, dan terus melakukannya."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* -- Key Takeaways ---------------------------------------------------- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 12, textAlign: "center" }}>
            {t("Key Takeaways", "Poin Utama")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              color: navy,
              fontStyle: "italic",
              lineHeight: 1.2,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            {t("What to Carry Forward", "Yang Perlu Dibawa")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                en: "Broken team relationships are one of the main preventable reasons people leave the field early. Investing in them is investing in staying power.",
                id: "Hubungan tim yang rusak adalah salah satu alasan utama yang bisa dicegah mengapa orang meninggalkan lapangan lebih awal. Merawatnya berarti membantu orang bertahan.",
              },
              {
                en: "Listen before you fix. Reflect, ask one open question, then wait.",
                id: "Dengarkan sebelum memperbaiki. Refleksikan, ajukan satu pertanyaan terbuka, lalu tunggu.",
              },
              {
                en: "Silence and withdrawal are often signals. Name the pattern privately and gently, before tension hardens or erupts.",
                id: "Diam dan menarik diri sering kali adalah sinyal. Sebutkan polanya secara pribadi dan lembut, sebelum ketegangan mengeras atau meledak.",
              },
              {
                en: "Resolution may not look like open agreement. In many cultures a trusted go-between is the right path.",
                id: "Resolusi belum tentu berupa kesepakatan terbuka. Dalam banyak budaya, perantara yang dipercaya adalah jalan yang tepat.",
              },
              {
                en: "Name loss out loud. Goodbye rituals and regular grief checks keep unspoken loss from piling up.",
                id: "Sebutkan kehilangan dengan terbuka. Ritual perpisahan dan pemeriksaan duka rutin menjaga agar kehilangan yang tak terucap tidak menumpuk.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 10,
                  padding: "24px 28px",
                  borderLeft: `4px solid ${orange}`,
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(28px, 3vw, 36px)",
                    fontWeight: 700,
                    color: orange,
                    lineHeight: 1,
                    minWidth: 32,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(15px, 1.7vw, 17px)",
                    color: bodyText,
                    lineHeight: 1.85,
                    margin: 0,
                  }}
                >
                  {lang === "en" ? item.en : item.id}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Sources ---------------------------------------------------------- */}
      <SourcesDropdown
        lang={lang}
        background={offWhite}
        sources={[
          "Propempo International. \"The Truth About Missionary Attrition.\" Cites the ReMAP II finding that 71% of attrition is preventable, with peer conflict among the preventable causes. https://propempo.com/community/propempo-blog/the-truth-about-missionary-attrition2/",
          "A Life Overseas. \"New data confirms that team conflict is one of the primary factors in missionary attrition.\" Survey of 221 agencies: team conflict ranks among the top five preventable factors. https://www.alifeoverseas.com/new-data-confirms-that-team-conflict-is-one-of-the-primary-factors-in-missionary-attrition/",
          "World Evangelical Alliance Missions Commission. US Report of Findings on Missionary Retention (December 2003). Problems with peers rank fifth overall and third among preventable causes. https://www.worldevangelicals.org/resources/rfiles/res3_95_link_1292358708.pdf",
          "Grothe, T. \"Intercultural Conflict Management\" (8.2), in Exploring Intercultural Communication. LibreTexts. Mindful listening as a core intercultural conflict skill. https://socialsci.libretexts.org/Courses/Butte_College/Exploring_Intercultural_Communication_(Grothe)/08:_Intercultural_Conflict/8.02:_Intercultural_Conflict_Management",
          "Ting-Toomey, S. Face-Negotiation Theory (1985/1988). Face concerns, indirect approaches and third-party mediation in high-context cultures. Summary: https://en.wikipedia.org/wiki/Face_negotiation_theory",
          "\"Exploring Intercultural Communication in Indonesia: Cultural Values, Challenges, and Strategies.\" ResearchGate. On rukun, malu and indirect expression. https://www.researchgate.net/publication/371709788_Exploring_Intercultural_Communication_in_Indonesia_Cultural_Values_Challenges_and_Strategies",
          "A Life Overseas. \"What Missionaries Need Today: 2023 FieldPartner Survey Results.\" Only 14% of returnees had been debriefed; conflict resolution is a top unmet training need. https://www.alifeoverseas.com/what-missionaries-need-today-a-summary-of-the-2023-fieldpartner-survey-results/",
          "ReadingActs. \"Acts 15:36-40: Disagreement with Barnabas.\" On paroxysmos, and how later references to Barnabas and Mark suggest restoration. https://readingacts.com/2019/03/03/acts-1536-40-disagreement-with-barnabas-2/",
        ]}
      />

      {/* -- Footer / Keep Going --------------------------------------------- */}
      <section style={{ background: navy, padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 800,
              color: offWhite,
              marginBottom: 16,
            }}
          >
            {t("Keep Growing", "Terus Bertumbuh")}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "oklch(76% 0.03 80)",
              lineHeight: 1.75,
              maxWidth: 520,
              margin: "0 auto 40px",
            }}
          >
            {t(
              "The skills that keep teams together take practice. Explore more training modules to deepen your cross-cultural leadership.",
              "Keterampilan yang menjaga tim tetap bersatu perlu dilatih. Jelajahi modul pelatihan lain untuk memperdalam kepemimpinan lintas budayamu."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/resources"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                padding: "12px 36px",
                background: orange,
                color: offWhite,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: 4,
              }}
            >
              {t("Training", "Pelatihan")}
            </Link>
            <Link
              href="/resources/conflict-resolution"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                padding: "12px 36px",
                background: "transparent",
                border: `2px solid ${offWhite}`,
                color: offWhite,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: 4,
              }}
            >
              {t("Conflict Resolution", "Resolusi Konflik")}
            </Link>
          </div>
        </div>
      </section>

      {/* -- Verse Popup ----------------------------------------------------- */}
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
              borderRadius: 12,
              padding: "44px 40px",
              maxWidth: 540,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: 22,
                lineHeight: 1.7,
                color: navy,
                fontStyle: "italic",
                marginBottom: 20,
              }}
            >
              &ldquo;{lang === "en" ? verseData.en : verseData.id}&rdquo;
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.08em",
                marginBottom: 28,
              }}
            >
              {lang === "en" ? verseData.en_ref : verseData.id_ref}{" "}
              ({lang === "en" ? verseData.en_version : verseData.id_version})
            </p>
            <button
              type="button"
              onClick={() => setActiveVerse(null)}
              style={{
                minHeight: 44,
                padding: "10px 24px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 12,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 13,
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
