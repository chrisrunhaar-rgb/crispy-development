"use client";
import { useState, useTransition, useEffect, useRef, Fragment, type CSSProperties, type ReactNode, type KeyboardEvent } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY       = "oklch(22% 0.10 260)";
const ORANGE     = "oklch(65% 0.15 45)";
const OFF_WHITE  = "oklch(96% 0.005 80)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT  = "oklch(38% 0.05 260)";
const CARD_DARK  = "oklch(16% 0.08 260)";
const NAVY_BORDER = "oklch(35% 0.10 260)";

const FONT_HEADLINE = "'Cormorant Garamond', serif";
const FONT_BODY     = "'Montserrat', sans-serif";

// ─── Reusable styles ──────────────────────────────────────────────────────────
const prose: CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: "clamp(15px, 1.6vw, 17px)",
  color: BODY_TEXT,
  lineHeight: 1.85,
  marginBottom: 22,
};
const proseDark: CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: "clamp(15px, 1.6vw, 17px)",
  color: "oklch(80% 0.03 260)",
  lineHeight: 1.85,
  marginBottom: 22,
};
const eyebrow: CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: ORANGE,
  marginBottom: 10,
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = "en" | "id";
type Props = { isSaved: boolean; [key: string]: unknown };

// ─── Section 1 Three Inboxes data ─────────────────────────────────────────────
const INBOX_EMAIL = {
  from: { en: "From: Markus W.", id: "Dari: Markus W." },
  subject: { en: "Subject: Last week's report", id: "Subjek: Laporan minggu lalu" },
  body: {
    en: "The analysis in last week's report was shallow. The conclusions were unsupported by the data. This is not the standard we need.",
    id: "Analisis dalam laporan minggu lalu dangkal. Kesimpulan-kesimpulannya tidak didukung oleh data. Ini bukan standar yang kita butuhkan.",
  },
  footer: {
    en: "Sent to three team leads -- word for word the same.",
    id: "Dikirim ke tiga pemimpin tim -- kata per kata sama.",
  },
};

const INBOX_CARDS: { chip: string; name: string; visible: { en: string; id: string }; reveal: { en: string; id: string } }[] = [
  {
    chip: "MUNICH",
    name: "Claudia",
    visible: {
      en: "Revised analysis sent back before lunch.",
      id: "Analisis revisi dikirim kembali sebelum makan siang.",
    },
    reveal: {
      en: "Clear critique, problem named, fixed by noon. She respected the directness.",
      id: "Kritik jelas, masalah disebutkan, selesai sebelum siang. Ia menghormati kelangsungan itu.",
    },
  },
  {
    chip: "SEOUL",
    name: "Jiyeon",
    visible: {
      en: "Laptop closed until five o'clock. No reply.",
      id: "Laptop ditutup sampai pukul lima. Tanpa balasan.",
    },
    reveal: {
      en: "The written record felt permanent -- public humiliation. Within a month she applied for a transfer. She never mentioned the email.",
      id: "Catatan tertulis itu terasa permanen -- penghinaan publik. Dalam sebulan ia mengajukan mutasi. Ia tidak pernah menyebut email itu.",
    },
  },
  {
    chip: "SÃO PAULO",
    name: "Rafael",
    visible: {
      en: "Phoned a mutual colleague before replying.",
      id: "Menelepon rekan bersama sebelum membalas.",
    },
    reveal: {
      en: "Is Markus angry? Is the relationship okay? Reassured, he laughed, relaxed, and sent a revised draft that afternoon.",
      id: "Apakah Markus marah? Apakah hubungannya baik-baik saja? Setelah ditenangkan, ia tertawa, santai, dan mengirim draf revisi sore itu.",
    },
  },
];

// ─── Section 2 Culture dial explorer data ─────────────────────────────────────
const CULTURE_DIALS: {
  name: { en: string; id: string };
  comm: { en: string; id: string };
  evalv: { en: string; id: string };
  commPos: number;
  evalPos: number;
  gotcha: { en: string; id: string };
}[] = [
  {
    name: { en: "France", id: "Prancis" },
    comm: { en: "high-context", id: "konteks tinggi" },
    evalv: { en: "direct", id: "langsung" },
    commPos: 74,
    evalPos: 24,
    gotcha: {
      en: "The critique arrives with elegance. It is still a verdict.",
      id: "Kritik tiba dengan elegan. Itu tetap sebuah vonis.",
    },
  },
  {
    name: { en: "United States", id: "Amerika Serikat" },
    comm: { en: "low-context", id: "konteks rendah" },
    evalv: { en: "indirect", id: "tidak langsung" },
    commPos: 18,
    evalPos: 68,
    gotcha: {
      en: "Plain talk, soft critique. The feedback sandwich is an American invention.",
      id: "Bicara terus terang, kritik lembut. Feedback sandwich adalah penemuan Amerika.",
    },
  },
  {
    name: { en: "Germany", id: "Jerman" },
    comm: { en: "low-context", id: "konteks rendah" },
    evalv: { en: "very direct", id: "sangat langsung" },
    commPos: 14,
    evalPos: 8,
    gotcha: {
      en: `Precision is respect. "Completely wrong" is about the work, never the person.`,
      id: `Presisi adalah bentuk hormat. "Sepenuhnya salah" adalah tentang pekerjaan, bukan orangnya.`,
    },
  },
  {
    name: { en: "Kenya", id: "Kenya" },
    comm: { en: "high-context", id: "konteks tinggi" },
    evalv: { en: "indirect with warmth", id: "tidak langsung dengan kehangatan" },
    commPos: 70,
    evalPos: 76,
    gotcha: {
      en: "Correction is framed as community impact, with an offer of support.",
      id: "Koreksi dibingkai sebagai dampak komunitas, dengan tawaran dukungan.",
    },
  },
  {
    name: { en: "Japan", id: "Jepang" },
    comm: { en: "high-context", id: "konteks tinggi" },
    evalv: { en: "highly indirect", id: "sangat tidak langsung" },
    commPos: 92,
    evalPos: 92,
    gotcha: {
      en: "The hardest feedback may be a pause, or a topic that never comes up.",
      id: "Umpan balik yang paling keras bisa berupa jeda, atau topik yang tidak pernah muncul.",
    },
  },
  {
    name: { en: "Indonesia", id: "Indonesia" },
    comm: { en: "high-context", id: "konteks tinggi" },
    evalv: { en: "highly indirect", id: "sangat tidak langsung" },
    commPos: 86,
    evalPos: 88,
    gotcha: {
      en: "Correction travels privately and gently, often across several conversations.",
      id: "Koreksi berjalan secara pribadi dan lembut, sering kali melalui beberapa percakapan.",
    },
  },
];

// ─── Section 3 Intensity pairs data ───────────────────────────────────────────
const INTENSITY_HEADERS = {
  up: { en: "TURNED UP -- UPGRADERS", id: "DINAIKKAN -- PENGUAT" },
  down: { en: "TURNED DOWN -- DOWNGRADERS", id: "DITURUNKAN -- PELEMBUT" },
};

const INTENSITY_PAIRS: { up: { en: string; id: string }; down: { en: string; id: string } }[] = [
  {
    up: { en: "This is completely wrong.", id: "Ini sepenuhnya salah." },
    down: {
      en: "I wonder if this might need another look.",
      id: "Saya bertanya-tanya apakah ini mungkin perlu ditinjau lagi.",
    },
  },
  {
    up: { en: "Redo it entirely.", id: "Buat ulang seluruhnya." },
    down: {
      en: "Maybe one or two areas are worth revisiting.",
      id: "Mungkin ada satu atau dua area yang layak ditinjau ulang.",
    },
  },
  {
    up: { en: "The analysis is shallow.", id: "Analisisnya dangkal." },
    down: {
      en: "The analysis might benefit from a little more depth.",
      id: "Analisisnya mungkin akan lebih baik dengan sedikit kedalaman lagi.",
    },
  },
];

// ─── Section 3 Reframe rounds data ────────────────────────────────────────────
const REFRAME_ROUNDS = [
  {
    num: 1,
    title: { en: "German to Japanese register", id: "Register Jerman ke Jepang" },
    ctx: { en: "Germany → Japan", id: "Jerman → Jepang" },
    scenarioLabel: { en: "The feedback as given:", id: "Umpan balik yang diberikan:" },
    scenario: {
      en: `"This report is completely unacceptable. The analysis is shallow and the conclusions are unsupported by the data. This is entirely not the standard we require."`,
      id: `"Laporan ini sepenuhnya tidak dapat diterima. Analisisnya dangkal dan kesimpulan-kesimpulannya tidak didukung oleh data. Ini sama sekali bukan standar yang kami butuhkan."`,
    },
    instruction: {
      en: "Rewrite this for a Japanese colleague using downgraders and face-preserving framing.",
      id: "Tulis ulang ini untuk kolega Jepang menggunakan pelembut dan bingkai yang menjaga muka.",
    },
    reframe: {
      en: `"Thank you for the time you put into this draft. I wonder if this section might benefit from a little more development in the analysis -- perhaps we could look at it together before the final version goes out? I want to make sure it reflects the quality I know you're capable of."`,
      id: `"Terima kasih atas waktu yang kamu curahkan untuk draf ini. Saya bertanya-tanya apakah bagian ini mungkin mendapat manfaat dari sedikit lebih banyak pengembangan dalam analisis -- mungkin kita bisa melihatnya bersama sebelum versi final keluar? Saya ingin memastikannya mencerminkan kualitas yang saya tahu kamu mampu capai."`,
    },
    explanationLabel: { en: "What changed and why:", id: "Apa yang berubah dan mengapa:" },
    explanation: {
      en: `The upgraders are gone -- "completely," "entirely," the verdict. A question replaces the closed door, and the opening thanks makes the critique receivable. The truth is unchanged.`,
      id: `Penguat-penguatnya hilang -- "sepenuhnya," "sama sekali," vonisnya. Pertanyaan menggantikan pintu yang tertutup, dan terima kasih pembuka membuat kritik dapat diterima. Kebenarannya tidak berubah.`,
    },
  },
  {
    num: 2,
    title: { en: "Indirect to accountable", id: "Tidak langsung ke akuntabel" },
    ctx: { en: "East Africa → Universal", id: "Afrika Timur → Universal" },
    scenarioLabel: { en: "The feedback as given:", id: "Umpan balik yang diberikan:" },
    scenario: {
      en: `"We may want to think about how we approach reporting going forward. Some people have noticed it can be a challenge sometimes."`,
      id: `"Kita mungkin perlu memikirkan pendekatan pelaporan ke depannya. Beberapa orang memperhatikan itu terkadang bisa menjadi tantangan."`,
    },
    instruction: {
      en: "Rewrite this to be specific and accountable without removing the face-preserving tone.",
      id: "Tulis ulang ini agar spesifik dan akuntabel tanpa menghilangkan nada yang menjaga muka.",
    },
    reframe: {
      en: `"I want to talk this through with you first, before it goes wider. The last three reports framed the outcomes data differently, and that could affect how donors read our progress. Can we set time this week to align on one approach?"`,
      id: `"Saya ingin membicarakan ini denganmu dulu, sebelum meluas. Tiga laporan terakhir membingkai data hasil secara berbeda, dan itu bisa mempengaruhi cara donor membaca kemajuan kita. Bisakah kita atur waktu minggu ini untuk menyepakati satu pendekatan?"`,
    },
    explanationLabel: { en: "What changed and why:", id: "Apa yang berubah dan mengapa:" },
    explanation: {
      en: "The original protected dignity but lost the issue -- nothing was named. The reframe keeps the relational opening, names the specific thing, and closes with a concrete ask.",
      id: "Versi asli menjaga martabat tetapi kehilangan masalahnya -- tidak ada yang disebutkan. Reframe mempertahankan pembukaan relasional, menyebutkan hal spesifik, dan menutup dengan permintaan konkret.",
    },
  },
];

// ─── Section 4 Silence cards data ─────────────────────────────────────────────
const SILENCE_CARDS: { term: string; region: { en: string; id: string }; back: { en: string; id: string } }[] = [
  {
    term: "MALU",
    region: { en: "Indonesia", id: "Indonesia" },
    back: {
      en: "More than embarrassment: the knowledge that your standing has dropped in others' eyes. One manager, criticized publicly, smiled through the meeting and resigned the next morning.",
      id: "Lebih dari rasa malu biasa: kesadaran bahwa kedudukanmu telah turun di mata orang lain. Seorang manajer, dikritik di depan umum, tersenyum sepanjang rapat dan mengundurkan diri keesokan paginya.",
    },
  },
  {
    term: "CHAE-MYUN & NUNCHI",
    region: { en: "Korea", id: "Korea" },
    back: {
      en: "Chae-myun is social face; losing it publicly can take years to repair. Nunchi reads the room. Shorter emails and quieter meetings are the feedback.",
      id: "Chae-myun adalah muka sosial; kehilangannya di depan umum bisa butuh bertahun-tahun untuk dipulihkan. Nunchi membaca suasana. Email yang memendek dan rapat yang menyepi adalah umpan baliknya.",
    },
  },
  {
    term: "UBUNTU",
    region: { en: "Southern Africa", id: "Afrika bagian selatan" },
    back: {
      en: `"I am because we are." Correction is community business. Isolating one person's failure, with no path back into the group, feels structurally wrong.`,
      id: `"Saya ada karena kita ada." Koreksi adalah urusan komunitas. Mengisolasi kegagalan satu orang, tanpa jalan kembali ke dalam kelompok, terasa salah secara struktural.`,
    },
  },
  {
    term: "PERSONALISMO",
    region: { en: "Latin America", id: "Amerika Latin" },
    back: {
      en: "Relationship is the channel. Feedback down a cold professional line reads as a message about the relationship itself. That is why Rafael phoned first.",
      id: "Hubungan adalah salurannya. Umpan balik lewat jalur profesional yang dingin terbaca sebagai pesan tentang hubungan itu sendiri. Itulah mengapa Rafael menelepon dulu.",
    },
  },
];
// ─── Nathan Case Study data ───────────────────────────────────────────────────
type CaseChoice = {
  label: { en: string; id: string };
  action: { en: string[]; id: string[] };
  outcome: { en: string[]; id: string[] };
};

const CASE_WHAT_NEXT = { en: "What happens next:", id: "Apa yang terjadi selanjutnya:" };

const CASE_SETUP: Record<Lang, string[]> = {
  en: [
    "You lead an NGO team in East Africa. James, your field reporting lead, frames outcomes data more optimistically than the numbers support -- nothing false, but it would not survive a direct donor question. He believes he is protecting the project.",
  ],
  id: [
    "Kamu memimpin tim LSM di Afrika Timur. James, penanggung jawab pelaporan lapanganmu, membingkai data hasil lebih optimis daripada yang didukung angka -- tidak ada yang palsu, tetapi tidak akan bertahan jika donor bertanya langsung. Ia percaya sedang melindungi proyek.",
  ],
};

const CASE_CP1: { heading: { en: string; id: string }; options: [CaseChoice, CaseChoice] } = {
  heading: {
    en: "Choice Point 1 -- How do you open?",
    id: "Titik Pilihan 1 -- Bagaimana kamu membuka?",
  },
  options: [
    {
      label: { en: "Option A -- Begin with the issue", id: "Pilihan A -- Mulai dengan masalah" },
      action: {
        en: ["You meet privately and name it straight away: the last three reports do not match the numbers."],
        id: ["Kamu bertemu secara pribadi dan langsung menyebutkannya: tiga laporan terakhir tidak cocok dengan angkanya."],
      },
      outcome: {
        en: ["James nods, agrees, thanks you. Two weeks later the pattern has only half-changed -- he heard a preference, not a correction."],
        id: ["James mengangguk, setuju, berterima kasih. Dua minggu kemudian polanya baru setengah berubah -- ia mendengar preferensi, bukan koreksi."],
      },
    },
    {
      label: { en: "Option B -- Begin with the relationship", id: "Pilihan B -- Mulai dengan hubungan" },
      action: {
        en: [`You open with what you genuinely value in his work: "There's something I want to work through with you first, before it goes anywhere else."`],
        id: [`Kamu membuka dengan apa yang sungguh kamu hargai dari kerjanya: "Ada sesuatu yang ingin saya selesaikan denganmu terlebih dahulu, sebelum pergi ke mana pun."`],
      },
      outcome: {
        en: ["James relaxes. You are not angry, and this is private -- the hard content can now enter through an open door."],
        id: ["James menjadi santai. Kamu tidak marah, dan ini bersifat pribadi -- konten yang sulit kini bisa masuk melalui pintu yang terbuka."],
      },
    },
  ],
};

const CASE_CP2: Record<"A" | "B", { heading: { en: string; id: string }; intro: { en: string; id: string }; options: [CaseChoice, CaseChoice] }> = {
  A: {
    heading: {
      en: "Choice Point 2 -- Naming the stakes",
      id: "Titik Pilihan 2 -- Menyebutkan taruhannya",
    },
    intro: {
      en: "James heard you, but not at the depth you intended.",
      id: "James mendengarmu, tetapi tidak sedalam yang kamu maksudkan.",
    },
    options: [
      {
        label: { en: "Option A1 -- Cite the professional standard", id: "Pilihan A1 -- Rujuk standar profesional" },
        action: {
          en: ["You walk through the data policy and donor agreements. Contractual, not stylistic."],
          id: ["Kamu menjelaskan kebijakan data dan perjanjian donor. Kontraktual, bukan soal gaya."],
        },
        outcome: {
          en: ["He complies. The reports improve; the relationship cools. The behavior changed -- the understanding did not."],
          id: ["Ia patuh. Laporan membaik; hubungan mendingin. Perilakunya berubah -- pemahamannya tidak."],
        },
      },
      {
        label: { en: "Option A2 -- Ask what he was protecting", id: "Pilihan A2 -- Tanyakan apa yang ia lindungi" },
        action: {
          en: [`"James, help me understand -- when you framed the data this way, what were you trying to achieve?"`],
          id: [`"James, bantu saya memahami -- ketika kamu membingkai data seperti ini, apa yang ingin kamu capai?"`],
        },
        outcome: {
          en: ["He exhales. In his world, keeping donors confident is the job. Now you can change the mental model, not just the behavior."],
          id: ["Ia menghembuskan napas. Dalam dunianya, menjaga kepercayaan donor adalah pekerjaannya. Sekarang kamu bisa mengubah model mentalnya, bukan hanya perilakunya."],
        },
      },
    ],
  },
  B: {
    heading: {
      en: "Choice Point 2 -- Naming the stakes",
      id: "Titik Pilihan 2 -- Menyebutkan taruhannya",
    },
    intro: {
      en: "The relational opening worked. Now you name the pattern.",
      id: "Pembukaan relasional berhasil. Sekarang kamu menyebutkan polanya.",
    },
    options: [
      {
        label: { en: "Option B1 -- Name it, then ask", id: "Pilihan B1 -- Sebutkan, lalu tanyakan" },
        action: {
          en: [`You describe the selective framing, then: "I want to understand your thinking before I say more."`],
          id: [`Kamu menggambarkan pembingkaian selektif itu, lalu: "Saya ingin memahami pemikiranmu sebelum berbicara lebih jauh."`],
        },
        outcome: {
          en: ["Because it feels safe, James explains the value behind the behavior: protecting the donor relationship. You have more to work with."],
          id: ["Karena terasa aman, James menjelaskan nilai di balik perilakunya: melindungi hubungan dengan donor. Kamu punya lebih banyak bahan untuk dikerjakan."],
        },
      },
      {
        label: { en: "Option B2 -- Give the parable first", id: "Pilihan B2 -- Berikan perumpamaan dahulu" },
        action: {
          en: [`"Let me tell you what a donor would think, seeing this report next to the raw numbers."`],
          id: [`"Biarkan saya menceritakan apa yang akan dipikirkan donor, melihat laporan ini berdampingan dengan angka mentahnya."`],
        },
        outcome: {
          en: ["James reaches the verdict himself. By the time you name it, he is ready for both the accountability and the path forward."],
          id: ["James sampai pada vonis itu sendiri. Saat kamu menyebutkannya, ia siap menerima akuntabilitas sekaligus jalan ke depan."],
        },
      },
    ],
  },
};

const CASE_CP3: {
  heading: { en: string; id: string };
  intro: { en: string; id: string };
  promptsLabel: { en: string; id: string };
  prompts: { en: string[]; id: string[] };
} = {
  heading: {
    en: "Choice Point 3 -- What does restoration look like?",
    id: "Titik Pilihan 3 -- Seperti apa pemulihan itu?",
  },
  intro: {
    en: "Whatever path you took, James knows the practice must change. What does he walk away with?",
    id: "Apa pun jalur yang kamu ambil, James tahu praktiknya harus berubah. Apa yang ia bawa pulang?",
  },
  promptsLabel: {
    en: "For you to consider:",
    id: "Untuk kamu renungkan:",
  },
  prompts: {
    en: [
      `Matthew 18 calls the goal "you have won them back." What does winning James back look like?`,
      "Correction without restored honor can damage more than the problem. How do you restore James's standing -- in his eyes and the team's?",
      "Did your path correct his behavior, or his understanding? Which one lasts?",
    ],
    id: [
      `Matius 18 menyebut tujuannya "kamu telah mendapatkannya kembali." Seperti apa mendapatkan James kembali?`,
      "Koreksi tanpa kehormatan yang dipulihkan bisa merusak lebih dari masalahnya. Bagaimana kamu memulihkan kedudukan James -- di matanya dan di mata tim?",
      "Apakah jalurmu mengoreksi perilakunya, atau pemahamannya? Mana yang bertahan?",
    ],
  },
};

// ─── Section 6 step cards ─────────────────────────────────────────────────────
const STEP_CARDS: Record<Lang, { num: string; title: string; body: string }[]> = {
  en: [
    {
      num: "01",
      title: "Know your default register",
      body: "Direct or indirect -- neither is better, but be conscious enough of yours to adjust it.",
    },
    {
      num: "02",
      title: "Read the context you are entering",
      body: "Where does this person sit on the Evaluating scale? What roles do face, dignity, and community play?",
    },
    {
      num: "03",
      title: "Translate the truth, never dilute it",
      body: "The content does not change -- the form does. Upgraders or downgraders, preamble or plain, verdict or shared problem.",
    },
    {
      num: "04",
      title: "Plan the follow-up",
      body: "Agreement in the room may not mean agreement. Return gently within days -- sometimes the follow-up carries the weight.",
    },
  ],
  id: [
    {
      num: "01",
      title: "Kenali register defaultmu",
      body: "Langsung atau tidak langsung -- tidak ada yang lebih baik, tetapi sadarilah milikmu cukup dalam untuk menyesuaikannya.",
    },
    {
      num: "02",
      title: "Baca konteks yang kamu masuki",
      body: "Di mana orang ini berada pada skala Evaluasi? Apa peran muka, martabat, dan komunitas?",
    },
    {
      num: "03",
      title: "Terjemahkan kebenaran, jangan encerkan",
      body: "Kontennya tidak berubah -- bentuknya yang berubah. Penguat atau pelembut, basa-basi atau langsung, vonis atau masalah bersama.",
    },
    {
      num: "04",
      title: "Rencanakan tindak lanjut",
      body: "Persetujuan di ruangan belum tentu berarti setuju. Kembalilah dengan lembut dalam beberapa hari -- terkadang tindak lanjutlah yang membawa bobot.",
    },
  ],
};

// ─── Checklist data (Section 6) ───────────────────────────────────────────────
const CHECKLIST_COLS: Record<Lang, { col: string; title: string; items: string[] }[]> = {
  en: [
    {
      col: "BEFORE",
      title: "BEFORE",
      items: [
        "I can state the core truth in one plain sentence",
        "I know this person's likely position on the Evaluating scale",
        "I have chosen a private setting -- and considered an intermediary",
        "I know what restoration looks like, not just correction",
      ],
    },
    {
      col: "DURING",
      title: "DURING",
      items: [
        "I opened with relational groundwork, even briefly",
        "I named the issue clearly enough that nothing stays uncertain",
        "I asked what they were trying to protect",
        "I did not mistake composed silence for agreement",
      ],
    },
    {
      col: "AFTER",
      title: "AFTER",
      items: [
        "I followed up privately within a few days",
        "I watched for quiet signals: shorter emails, reduced engagement",
        "I visibly restored their dignity in the team",
      ],
    },
  ],
  id: [
    {
      col: "SEBELUM",
      title: "SEBELUM",
      items: [
        "Saya bisa menyatakan kebenaran intinya dalam satu kalimat yang jelas",
        "Saya tahu kemungkinan posisi orang ini pada skala Evaluasi",
        "Saya telah memilih tempat pribadi -- dan mempertimbangkan perantara",
        "Saya tahu seperti apa pemulihan, bukan hanya koreksi",
      ],
    },
    {
      col: "SELAMA",
      title: "SELAMA",
      items: [
        "Saya membuka dengan landasan relasional, meski singkat",
        "Saya menyebutkan masalah cukup jelas sehingga tidak ada yang tersisa samar",
        "Saya menanyakan apa yang mereka coba lindungi",
        "Saya tidak mengacaukan keheningan yang tenang dengan persetujuan",
      ],
    },
    {
      col: "SETELAH",
      title: "SETELAH",
      items: [
        "Saya menindaklanjuti secara pribadi dalam beberapa hari",
        "Saya memperhatikan sinyal hening: email memendek, keterlibatan berkurang",
        "Saya memulihkan martabat mereka di tim secara terlihat",
      ],
    },
  ],
};

// ─── Key Takeaways (Section 8) ────────────────────────────────────────────────
const KEY_TAKEAWAYS: Record<Lang, { title: string; body: string }[]> = {
  en: [
    { title: "Feedback is never culturally neutral -- the same words land differently in different logic systems.", body: "" },
    { title: "Communicating and Evaluating are two separate dials that move independently.", body: "" },
    { title: "Upgraders intensify, downgraders soften -- intensity is the most adjustable part of your feedback.", body: "" },
    { title: "In honor-shame cultures, correction without restored dignity often damages more than no correction at all.", body: "" },
    { title: "Nathan told the story first -- the indirect path is what makes the direct truth land.", body: "" },
  ],
  id: [
    { title: "Umpan balik tidak pernah netral secara budaya -- kata-kata yang sama mendarat berbeda dalam sistem logika yang berbeda.", body: "" },
    { title: "Komunikasi dan Evaluasi adalah dua skala terpisah yang bergerak secara independen.", body: "" },
    { title: "Penguat mengintensifkan, pelembut memperlunak -- intensitas adalah bagian umpan balikmu yang paling bisa disesuaikan.", body: "" },
    { title: "Dalam budaya kehormatan-malu, koreksi tanpa martabat yang dipulihkan sering merusak lebih dari tanpa koreksi sama sekali.", body: "" },
    { title: "Natan menceritakan kisahnya terlebih dahulu -- jalan tidak langsung itulah yang membuat kebenaran langsung mendarat.", body: "" },
  ],
};
const S2_PARAS: Record<Lang, string[]> = {
  en: [
    "There is a common assumption among leaders working across cultures: if you know whether someone is from a high-context or low-context culture, you know how to give them feedback. More context, more indirectness. Less context, more directness. Simple.",
    "The assumption is wrong -- and getting it wrong produces some of the most predictable intercultural friction in global teams.",
    "The distinction between high-context and low-context communication comes from anthropologist Edward T. Hall, who noted in the 1950s and 1970s that cultures differ fundamentally in how much meaning is carried by explicit words versus the surrounding context -- the relationship, the setting, shared history, non-verbal signals. In high-context cultures (prevalent across much of Asia, Africa, and the Middle East), meaning is layered and relational. Silence carries weight. What is left unsaid is often more significant than what is spoken. In low-context cultures (Germany, Scandinavia, the Netherlands, the United States), meaning is encoded explicitly in the words. Say what you mean. Mean what you say. Ambiguity is a problem to be solved.",
    "This is genuinely useful as a starting map. But Erin Meyer, who teaches organizational behavior at INSEAD, identified something that Hall’s single-axis model could not show: the way you communicate and the way you give feedback are two separate things, and they move independently of each other.",
    "Meyer calls these the Communicating scale and the Evaluating scale -- and the gap between them is where confusion lives.",
    "The Communicating scale measures how much meaning is carried implicitly versus explicitly. The Evaluating scale measures how directly negative feedback is delivered -- whether criticism is stated plainly or softened, hedged, and wrapped in layers of relational context.",
    "Here is what makes this important: these two dials do not move together.",
    "The French are textbook high-context communicators -- layered, allusive, where subtext and intellectual nuance carry much of the meaning. Yet when a French professional thinks your work is inadequate, they will often tell you so in terms that leave no ambiguity. France sits on the direct end of the Evaluating scale, even as it sits at the indirect end of the Communicating scale.",
    "Americans, by contrast, are strongly low-context communicators. American business culture prizes explicitness -- say it plainly, be clear, avoid ambiguity. Yet American professional feedback culture is famously soft. The \u201cfeedback sandwich\u201d -- positive, critical, positive -- is an American invention. American managers routinely wrap difficult assessments in so much encouragement that the critique itself gets lost. The United States is a low-context communicator that delivers highly indirect negative feedback.",
    "A Dutch engineer working with a French colleague may assume: \u201cwe both communicate plainly, so we share the same feedback culture.\u201d They do not. The Dutch engineer will deliver feedback bluntly and expect it to be received professionally. The French colleague will deliver feedback with rhetorical sophistication that the Dutch engineer mistakes for politeness and the French colleague intends as precision.",
    "An American manager working with a Japanese colleague may assume: \u201cwe are both indirect, so we are on the same page.\u201d They are not -- the American is indirect about criticism in order to preserve the relationship; the Japanese professional is indirect as a structural feature of how truth is communicated at all, and the signals the American is missing are not softening devices but primary communication.",
    "This is why the two-dial model matters. The question is not just \u201cis this a high-context culture?\u201d The question is \u201cwhat is the Evaluating scale here -- and is that different from my assumption?\u201d",
    "Look at your own culture on both spectra. Then look at the cultures you work with most. The gap between those positions -- not just on one scale but on both -- is where your feedback is getting lost.",
  ],
  id: [
    "Ada asumsi umum di kalangan pemimpin yang bekerja lintas budaya: jika kamu tahu apakah seseorang berasal dari budaya berkonteks tinggi atau rendah, kamu tahu cara memberi mereka umpan balik. Lebih banyak konteks, lebih banyak ketidaklangsungan. Lebih sedikit konteks, lebih langsung. Sederhana.",
    "Asumsi itu salah -- dan salah dalam hal ini menghasilkan beberapa gesekan antarbudaya yang paling dapat diprediksi dalam tim global.",
    "Perbedaan antara komunikasi berkonteks tinggi dan rendah berasal dari antropolog Edward T. Hall, yang mencatat pada 1950-an dan 1970-an bahwa budaya berbeda secara fundamental dalam seberapa banyak makna dibawa oleh kata-kata eksplisit versus konteks sekitarnya -- hubungan, setting, sejarah bersama, sinyal non-verbal. Dalam budaya berkonteks tinggi (umum di sebagian besar Asia, Afrika, dan Timur Tengah), makna berlapis dan relasional. Keheningan memiliki bobot. Apa yang tidak dikatakan sering kali lebih signifikan dari apa yang diucapkan. Dalam budaya berkonteks rendah (Jerman, Skandinavia, Belanda, Amerika Serikat), makna dikodekan secara eksplisit dalam kata-kata. Katakan apa yang kamu maksud. Maksudkan apa yang kamu katakan. Ambiguitas adalah masalah yang harus dipecahkan.",
    "Ini sungguh berguna sebagai peta awal. Tetapi Erin Meyer, yang mengajar perilaku organisasi di INSEAD, mengidentifikasi sesuatu yang tidak bisa ditunjukkan oleh model satu sumbu Hall: cara kamu berkomunikasi dan cara kamu memberi umpan balik adalah dua hal yang terpisah, dan keduanya bergerak secara independen satu sama lain.",
    "Meyer menyebut ini skala Komunikasi dan skala Evaluasi -- dan kesenjangan di antara keduanya adalah tempat kebingungan berada.",
    "Skala Komunikasi mengukur seberapa banyak makna dibawa secara implisit versus eksplisit. Skala Evaluasi mengukur seberapa langsung umpan balik negatif disampaikan -- apakah kritik dinyatakan terang-terangan atau dilembutkan, dilindungi, dan dibungkus dalam lapisan konteks relasional.",
    "Inilah yang membuat ini penting: kedua skala ini tidak bergerak bersama.",
    "Orang Prancis adalah komunikator berkonteks tinggi yang tekstual -- berlapis, allusif, di mana subteks dan nuansa intelektual membawa banyak makna. Namun ketika seorang profesional Prancis menganggap pekerjaan kamu tidak memadai, mereka sering akan memberitahukannya dalam istilah yang tidak meninggalkan ambiguitas. Prancis berada di ujung langsung pada skala Evaluasi, meskipun berada di ujung tidak langsung pada skala Komunikasi.",
    "Sebaliknya, orang Amerika adalah komunikator berkonteks rendah yang kuat. Budaya bisnis Amerika menghargai keeksplisitan -- katakan dengan jelas, bersikaplah jelas, hindari ambiguitas. Namun budaya umpan balik profesional Amerika terkenal lembut. \u201cFeedback sandwich\u201d -- positif, kritis, positif -- adalah penemuan Amerika. Manajer Amerika secara rutin membungkus penilaian yang sulit dalam begitu banyak dorongan sehingga kritik itu sendiri hilang. Amerika Serikat adalah komunikator berkonteks rendah yang menyampaikan umpan balik negatif yang sangat tidak langsung.",
    "Seorang insinyur Belanda yang bekerja dengan kolega Prancis mungkin berasumsi: \u201ckita berdua berkomunikasi dengan jelas, jadi kita memiliki budaya umpan balik yang sama.\u201d Mereka tidak. Insinyur Belanda akan menyampaikan umpan balik secara blak-blakan dan mengharapkannya diterima secara profesional. Kolega Prancis akan menyampaikan umpan balik dengan kecanggihan retoris yang disalahartikan oleh insinyur Belanda sebagai kesopanan dan yang dimaksud oleh kolega Prancis sebagai presisi.",
    "Seorang manajer Amerika yang bekerja dengan kolega Jepang mungkin berasumsi: \u201ckita berdua tidak langsung, jadi kita pada halaman yang sama.\u201d Mereka tidak -- orang Amerika tidak langsung tentang kritik untuk menjaga hubungan; profesional Jepang tidak langsung sebagai fitur struktural dari bagaimana kebenaran dikomunikasikan sama sekali, dan sinyal yang dilewatkan oleh orang Amerika bukan perangkat pelembut tetapi komunikasi primer.",
    "Inilah mengapa model dua skala penting. Pertanyaannya bukan hanya \u201capakah ini budaya berkonteks tinggi?\u201d Pertanyaannya adalah \u201capa skala Evaluasi di sini -- dan apakah itu berbeda dari asumsi saya?\u201d",
    "Lihatlah budayamu sendiri pada kedua spektrum. Kemudian lihatlah budaya yang paling banyak kamu kerjakan. Kesenjangan antara posisi-posisi tersebut -- bukan hanya pada satu skala tetapi pada keduanya -- adalah tempat umpan balikmu hilang.",
  ],
};
const UDRG_TABLE = {
  headers: {
    en: ["Culture", "Evaluating Scale Position", "Typical Feedback Language", "Example"],
    id: ["Budaya", "Posisi Skala Evaluasi", "Bahasa Umpan Balik Umum", "Contoh"],
  },
  rows: [
    {
      culture: { en: "Germany", id: "Jerman" },
      pos: { en: "Very direct", id: "Sangat langsung" },
      lang: { en: "Upgraders, plain declaratives", id: "Penguat, deklaratif polos" },
      example: { en: "“This is completely wrong. The data does not support the conclusion.”", id: "“Ini sepenuhnya salah. Data tidak mendukung kesimpulan.”" },
    },
    {
      culture: { en: "Netherlands", id: "Belanda" },
      pos: { en: "Very direct", id: "Sangat langsung" },
      lang: { en: "Upgraders, matter-of-fact", id: "Penguat, lugas" },
      example: { en: "“This is not what we asked for. It needs to be redone entirely.”", id: "“Ini bukan yang kami minta. Ini perlu dibuat ulang sepenuhnya.”" },
    },
    {
      culture: { en: "Israel", id: "Israel" },
      pos: { en: "Very direct", id: "Sangat langsung" },
      lang: { en: "Upgraders, confrontational warmth", id: "Penguat, kehangatan konfrontatif" },
      example: { en: "“I'll be straight with you -- this doesn't work. Let's fix it together.”", id: "“Saya akan berbicara jujur denganmu -- ini tidak berhasil. Mari kita perbaiki bersama.”" },
    },
    {
      culture: { en: "Australia", id: "Australia" },
      pos: { en: "Moderately direct", id: "Cukup langsung" },
      lang: { en: "Mild upgraders, informal", id: "Penguat ringan, informal" },
      example: { en: "“Yeah, this one's not quite there. The main issue is the analysis section.”", id: "“Ya, yang ini belum cukup. Masalah utamanya adalah bagian analisis.”" },
    },
    {
      culture: { en: "United States", id: "Amerika Serikat" },
      pos: { en: "Indirect", id: "Tidak langsung" },
      lang: { en: "Downgraders wrapped in positives", id: "Pelembut dibungkus hal positif" },
      example: { en: "“There are some really interesting ideas here. I do wonder if the analysis section could be developed a little more?”", id: "“Ada beberapa ide yang sangat menarik di sini. Saya bertanya-tanya apakah bagian analisis bisa dikembangkan sedikit lagi?”" },
    },
    {
      culture: { en: "United Kingdom", id: "Inggris" },
      pos: { en: "Indirect (heavily coded)", id: "Tidak langsung (berkode)" },
      lang: { en: "Heavy downgraders, understatement", id: "Pelembut kuat, understatement" },
      example: { en: "“I'm not sure this is quite ready yet. There might be one or two areas worth revisiting.”", id: "“Saya tidak yakin ini sudah cukup siap. Mungkin ada satu atau dua area yang layak ditinjau ulang.”" },
    },
    {
      culture: { en: "Brazil", id: "Brasil" },
      pos: { en: "Moderately indirect", id: "Cukup tidak langsung" },
      lang: { en: "Relationship-first framing", id: "Bingkai relasi terlebih dahulu" },
      example: { en: "“I really appreciate the effort on this -- I think we might want to look at the analysis together before we send it.”", id: "“Saya benar-benar menghargai upaya dalam hal ini -- saya pikir kita mungkin ingin melihat analisisnya bersama sebelum mengirimkannya.”" },
    },
    {
      culture: { en: "Kenya", id: "Kenya" },
      pos: { en: "Indirect with relational warmth", id: "Tidak langsung dengan kehangatan relasional" },
      lang: { en: "Indirect, community-impact framing", id: "Tidak langsung, bingkai dampak komunitas" },
      example: { en: "“The team will need to see a stronger analysis before we can move forward. How can we support you in that?”", id: "“Tim perlu melihat analisis yang lebih kuat sebelum kita bisa melanjutkan. Bagaimana kita bisa mendukungmu dalam hal itu?”" },
    },
    {
      culture: { en: "Japan", id: "Jepang" },
      pos: { en: "Highly indirect", id: "Sangat tidak langsung" },
      lang: { en: "Strong downgraders, extensive hedging, silence", id: "Pelembut kuat, banyak perlindungan, keheningan" },
      example: { en: "“I wonder if perhaps there might be some areas that could potentially benefit from a little more... consideration.” (followed by silence)", id: "“Saya bertanya-tanya apakah mungkin ada beberapa area yang berpotensi mendapat manfaat dari sedikit lebih banyak... pertimbangan.” (diikuti keheningan)" },
    },
    {
      culture: { en: "South Korea", id: "Korea Selatan" },
      pos: { en: "Highly indirect", id: "Sangat tidak langsung" },
      lang: { en: "Downgraders, hierarchy-sensitive", id: "Pelembut, peka hierarki" },
      example: { en: "Correction typically delivered privately through a trusted senior intermediary, or signaled through reduced eye contact and a brief pause.", id: "Koreksi biasanya disampaikan secara pribadi melalui perantara senior terpercaya, atau disinyalkan melalui kontak mata yang berkurang dan jeda singkat." },
    },
    {
      culture: { en: "Indonesia", id: "Indonesia" },
      pos: { en: "Highly indirect", id: "Sangat tidak langsung" },
      lang: { en: "Downgraders, basa basi preamble, private setting", id: "Pelembut, basa-basi, setting pribadi" },
      example: { en: "Extended relational preamble, then: “Perhaps this section could be strengthened a little before we finalize it?” Often spread across multiple conversations.", id: "Basa-basi relasional yang panjang, lalu: “Mungkin bagian ini bisa diperkuat sedikit sebelum kita finalisasi?” Sering tersebar dalam beberapa percakapan." },
    },
  ],
};
const S5_METHOD: Record<Lang, { intro: string; items: { lead: string; body: string }[] }> = {
  en: {
    intro: "Nathan's method has been studied carefully in biblical leadership scholarship. It follows a recognizable pattern:",
    items: [
      { lead: "Indirect approach via story", body: "he created empathy, built understanding, drew David into the moral logic before the application arrived" },
      { lead: "Comprehension before confrontation", body: "he waited until David had already reached the right verdict before naming him as the subject" },
      { lead: "Direct declaration", body: `when understanding was secured, he named the truth plainly: "You are the man"` },
      { lead: "Specific accountability", body: "he named the exact actions and their consequences without softening what David had done" },
      { lead: "Private setting", body: "this was a one-to-one conversation, not a public accusation" },
    ],
  },
  id: {
    intro: "Metode Natan telah dipelajari dengan cermat dalam kajian kepemimpinan biblika. Ini mengikuti pola yang dapat dikenali:",
    items: [
      { lead: "Pendekatan tidak langsung melalui kisah", body: "ia menciptakan empati, membangun pemahaman, menarik Daud ke dalam logika moral sebelum penerapan tiba" },
      { lead: "Pemahaman sebelum konfrontasi", body: "ia menunggu sampai Daud sudah mencapai vonis yang benar sebelum menamainya sebagai subjek" },
      { lead: "Deklarasi langsung", body: `ketika pemahaman diamankan, ia menyebutkan kebenaran secara terang-terangan: "Engkau sendiri orang itu"` },
      { lead: "Akuntabilitas spesifik", body: "ia menyebutkan tindakan yang tepat dan konsekuensinya tanpa melembutkan apa yang telah Daud lakukan" },
      { lead: "Setting pribadi", body: "ini adalah percakapan empat mata, bukan tuduhan publik" },
    ],
  },
};
const S5_PARAS: Record<Lang, string[]> = {
  en: [
    "Before we get to practice, there is a question that sits underneath all of this that is worth naming directly.",
    "You may have been reading this module and thinking: this is all very thoughtful, but at what point does cultural sensitivity become an excuse for not saying the hard thing? If I keep softening and hedging and wrapping in relational preamble, at what point have I stopped delivering the feedback at all?",
    "It is a fair question. And the biblical tradition does not let you off the hook with a simple answer.",
    `Proverbs 27:5-6 is blunt: "Better is open rebuke than hidden love. Faithful are the wounds of a friend." The Hebrew wisdom tradition does not treat indirect deflection as kindness. It treats the withholding of correction as a failure of love -- and, strikingly, it equates that failure with the deceptive flattery of an enemy. If you care about someone, you tell them the truth. That is not optional.`,

    "And yet, sitting right inside the same tradition, there is a man named Nathan who chose not to begin with the direct statement.",
    `David had committed adultery with Bathsheba and had arranged the death of Uriah her husband. Nathan knew. God sent him to confront the king. And Nathan did not walk into the throne room and say, "You are guilty of adultery and murder."`,
    "He told a story.",
    `A rich man had many flocks, but when a traveler came, he took a poor man's one beloved lamb rather than from his own flock, and killed it for the feast. David, hearing the story, was outraged. "That man deserves to die!" he said.`,
    `"You are the man," Nathan said.`,
    "Five words. But the parable came first.",
    "The parable was not evasion. It was not weakness. It was preparation -- the structure that made the direct truth receivable. Nathan needed David to arrive at the verdict himself before it could be applied to David. The indirect path was what made the direct declaration land.",
    "This is not a template to be mechanically applied -- it is a model of what it looks like when truth-telling is shaped by the question: how does this person need to receive this in order for the truth to actually reach them?",
    "The Nathan Principle is not a technique for avoiding directness. Nathan was direct -- devastatingly direct, when the moment came. The principle is about the preparation that makes direct truth receivable. The indirect path is not the opposite of the direct declaration. It is what makes the direct declaration land.",
  ],
  id: [
    "Sebelum kita masuk ke praktik, ada pertanyaan yang berada di bawah semua ini yang layak disebutkan secara langsung.",
    "Kamu mungkin telah membaca modul ini dan berpikir: ini semua sangat bijaksana, tetapi pada titik mana kepekaan budaya menjadi alasan untuk tidak mengatakan hal yang sulit? Jika saya terus melembutkan dan melindungi dan membungkus dalam basa-basi relasional, pada titik mana saya berhenti menyampaikan umpan balik sama sekali?",
    "Itu adalah pertanyaan yang adil. Dan tradisi biblika tidak membiarkan kamu lolos dengan jawaban sederhana.",
    `Amsal 27:5-6 terus terang: "Teguran yang terang-terangan lebih baik daripada kasih yang tersembunyi. Dapat dipercaya tikaman seorang sahabat." Tradisi hikmat Ibrani tidak memperlakukan pengalihan tidak langsung sebagai kebaikan. Ini memperlakukan penahanan koreksi sebagai kegagalan kasih -- dan, luar biasa, ini menyamakan kegagalan itu dengan sanjungan menipu dari seorang musuh. Jika kamu peduli pada seseorang, kamu memberitahu mereka kebenaran. Itu bukan opsional.`,

    "Namun, tepat di dalam tradisi yang sama, ada seorang pria bernama Natan yang memilih untuk tidak memulai dengan pernyataan langsung.",
    `Daud telah berzinah dengan Batsyeba dan telah mengatur kematian Uria suaminya. Natan tahu. Tuhan mengutusnya untuk menghadapi raja. Dan Natan tidak berjalan masuk ke ruang takhta dan berkata, "Kamu bersalah atas perzinahan dan pembunuhan."`,
    "Ia menceritakan sebuah kisah.",
    `Seorang pria kaya memiliki banyak kawanan, tetapi ketika seorang musafir datang, ia mengambil satu-satunya domba betina kesayangan orang miskin alih-alih dari kawanannya sendiri, dan menyembelihnya untuk perjamuan. Daud, mendengar kisah itu, marah besar. "Orang itu layak mati!" katanya.`,
    `"Engkau sendiri orang itu," kata Natan.`,
    "Lima kata. Tetapi perumpamaan datang terlebih dahulu.",
    "Perumpamaan itu bukan penghindaran. Itu bukan kelemahan. Itu adalah persiapan -- struktur yang membuat kebenaran langsung dapat diterima. Natan membutuhkan Daud untuk sampai pada vonis itu sendiri sebelum dapat diterapkan pada Daud. Jalan tidak langsung itulah yang membuat deklarasi langsung mendarat.",
    "Ini bukan template yang harus diterapkan secara mekanis -- ini adalah model tentang seperti apa jadinya ketika penyampaian kebenaran dibentuk oleh pertanyaan: bagaimana orang ini perlu menerima ini agar kebenaran benar-benar sampai kepada mereka?",
    "Prinsip Natan bukan teknik untuk menghindari ketegasan. Natan tegas -- sangat tegas, ketika saatnya tiba. Prinsipnya adalah tentang persiapan yang membuat kebenaran langsung dapat diterima. Jalan tidak langsung bukan lawan dari deklarasi langsung. Itulah yang membuat deklarasi langsung mendarat.",
  ],
};
const FAITH_PARAS: Record<Lang, string[]> = {
  en: [
    `The Greek word that sits behind "speaking the truth in love" in Ephesians 4:15 is *aletheuon* -- a word that carries the force of living or embodying truth, not merely stating accurate propositions. Paul was not writing a communication tip. He was describing the corporate life of a diverse church under pressure, and he was arguing that truth-speaking and love are not in tension -- they are the same act, pursued faithfully.`,
    "This matters for cross-cultural feedback because the two distortions that corrupt feedback across cultural difference map precisely onto the two failures Paul is guarding against.",
    "The first distortion is truth without love: delivering accurate correction in a form that damages rather than restores, stripping a person of dignity in order to achieve behavioral compliance. This is what the German manager in Section 1 did without knowing it. The content was right; the carrying was destructive.",
    `The second distortion is love without truth: withholding correction to maintain surface harmony, letting a problem grow because naming it feels dangerous to the relationship. This is what Proverbs 27 is most direct about: "Better is open rebuke than hidden love. Faithful are the wounds of a friend; profuse are the kisses of an enemy." Withholding correction to preserve a relationship is not kindness, in the Hebrew wisdom tradition. It is what an enemy does.`,

    `*Aletheuon en agape* -- living the truth in love -- refuses both distortions. The question the phrase puts to every cross-cultural leader is not "did I say the true thing?" but "did I carry the true thing in a way that this person could actually receive it?"`,
    "Proverbs 27:5-6 holds an uncomfortable tension for leaders working in honor-shame cultures. Open rebuke -- clear, named, direct -- is presented as a mark of genuine friendship. And yet the cultural logic of communities shaped by shame-sensitivity and face-preservation makes open rebuke structurally damaging unless it comes through a pathway that also offers restored dignity. The question is not which of these is more biblical. Both are in the text. The question is how to honor both simultaneously -- which is precisely what Nathan's method was designed to do.",
    `Jesus' graduated model in Matthew 18:15-17 -- private first, then with witnesses, then community -- is striking in how structurally compatible it is with high-context feedback principles. Begin with the least confrontational, most relational approach. Escalate only when necessary. And keep the goal clear: "you have won them back." Restoration is the target. Correction is the path to it, not the destination itself.`,

    `Nathan understood this at a level that deserves careful attention. He did not begin with "You are the man." He began with a story that built David's moral comprehension from the inside -- drew him into the verdict before applying it to him. The parable was not evasion. It was preparation. The direct declaration, "You are the man," hit harder because of what preceded it. And notably: Nathan was not punishing David. He was restoring him. The correction was devastating, but the goal was not devastation.`,

    "There is a theological thread running through honor-shame scholarship that has direct implications for how correction is understood in global Christian contexts. In shame-oriented cultures -- which include large portions of Asia, Africa, the Middle East, and Latin America -- the gospel addresses shame through honor restoration. The adopted child receives a new name, a new status, a new standing before the community. Correction in these contexts, when it functions like the gospel, does not merely name a failure and demand changed behavior. It names the failure clearly, then offers a pathway back to dignity -- not because the person earned it, but because restoration is what the gospel does.",
    "Correction without restoration in these contexts is not just culturally incomplete. It is theologically incomplete. It strips out the half of the gospel that such cultures are most equipped to understand.",
    "The practical implication: when you correct someone in a high-shame-sensitivity cultural context, the restoration is not optional -- it is the point. The pathway back to honor before God and community is not an afterthought to the accountability. It is what makes the correction an act of love rather than an act of judgment.",
  ],
  id: [
    `Kata Yunani yang ada di balik "berkata benar dalam kasih" dalam Efesus 4:15 adalah *aletheuon* -- sebuah kata yang membawa kekuatan hidup atau mewujudkan kebenaran, bukan sekadar menyatakan proposisi yang akurat. Paulus tidak sedang menulis tips komunikasi. Ia menggambarkan kehidupan bersama sebuah jemaat yang beragam di bawah tekanan, dan ia berargumen bahwa berbicara kebenaran dan kasih tidak berada dalam ketegangan -- keduanya adalah tindakan yang sama, dikejar dengan setia.`,
    "Ini penting untuk umpan balik lintas budaya karena dua distorsi yang merusak umpan balik lintas perbedaan budaya tepat memetakan dua kegagalan yang dijaga Paulus.",
    "Distorsi pertama adalah kebenaran tanpa kasih: menyampaikan koreksi yang akurat dalam bentuk yang merusak daripada memulihkan, menghilangkan martabat seseorang untuk mencapai kepatuhan perilaku. Inilah yang dilakukan manajer Jerman di Bagian 1 tanpa menyadarinya. Kontennya benar; penyampaiannya merusak.",
    `Distorsi kedua adalah kasih tanpa kebenaran: menahan koreksi untuk mempertahankan harmoni permukaan, membiarkan masalah tumbuh karena menyebutkannya terasa berbahaya bagi hubungan. Inilah yang paling langsung disebutkan Amsal 27: "Teguran yang terang-terangan lebih baik daripada kasih yang tersembunyi. Dapat dipercaya tikaman seorang sahabat; tetapi ciuman seorang musuh sangat banyak." Menahan koreksi untuk menjaga hubungan bukan kebaikan, dalam tradisi hikmat Ibrani. Itu adalah apa yang dilakukan musuh.`,

    `*Aletheuon en agape* -- hidup dalam kebenaran dengan kasih -- menolak kedua distorsi tersebut. Pertanyaan yang diajukan frasa ini kepada setiap pemimpin lintas budaya bukan "apakah saya mengatakan hal yang benar?" tetapi "apakah saya membawa hal yang benar dengan cara yang benar-benar bisa diterima orang ini?"`,
    "Amsal 27:5-6 memegang ketegangan yang tidak nyaman bagi pemimpin yang bekerja dalam budaya kehormatan-malu. Teguran yang terang-terangan -- jelas, disebut, langsung -- disajikan sebagai tanda persahabatan yang tulus. Namun logika budaya komunitas yang dibentuk oleh kepekaan malu dan pelestarian muka membuat teguran terbuka secara struktural merusak kecuali datang melalui jalur yang juga menawarkan martabat yang dipulihkan. Pertanyaannya bukan mana dari ini yang lebih biblika. Keduanya ada dalam teks. Pertanyaannya adalah bagaimana menghormati keduanya secara bersamaan -- yang persis itulah yang dirancang metode Natan.",
    `Model bertahap Yesus dalam Matius 18:15-17 -- pribadi terlebih dahulu, kemudian dengan saksi, kemudian komunitas -- mencolok dalam seberapa kompatibel secara strukturalnya dengan prinsip-prinsip umpan balik berkonteks tinggi. Mulai dengan pendekatan yang paling tidak konfrontatif, paling relasional. Eskalasi hanya jika diperlukan. Dan jaga tujuan tetap jelas: "kamu telah mendapatkan mereka kembali." Pemulihan adalah targetnya. Koreksi adalah jalannya, bukan tujuan itu sendiri.`,

    `Natan memahami ini pada tingkat yang layak mendapat perhatian cermat. Ia tidak memulai dengan "Engkau sendiri orang itu." Ia memulai dengan sebuah kisah yang membangun pemahaman moral Daud dari dalam -- menariknya ke dalam vonis sebelum menerapkannya padanya. Perumpamaan itu bukan penghindaran. Itu adalah persiapan. Deklarasi langsung, "Engkau sendiri orang itu," memukul lebih keras karena apa yang mendahuluinya. Dan perlu dicatat: Natan tidak menghukum Daud. Ia memulihkannya. Koreksi itu menghancurkan, tetapi tujuannya bukan kehancuran.`,

    "Ada benang teologis yang mengalir melalui beasiswa kehormatan-malu yang memiliki implikasi langsung tentang bagaimana koreksi dipahami dalam konteks Kristen global. Dalam budaya berorientasi malu -- yang mencakup sebagian besar Asia, Afrika, Timur Tengah, dan Amerika Latin -- injil mengatasi rasa malu melalui pemulihan kehormatan. Anak yang diadopsi menerima nama baru, status baru, kedudukan baru di hadapan komunitas. Koreksi dalam konteks ini, ketika berfungsi seperti injil, tidak hanya menyebutkan kegagalan dan menuntut perilaku yang berubah. Ini menyebutkan kegagalan dengan jelas, kemudian menawarkan jalur kembali ke martabat -- bukan karena orang itu mendapatkannya, tetapi karena pemulihan adalah apa yang dilakukan injil.",
    "Koreksi tanpa pemulihan dalam konteks ini tidak hanya tidak lengkap secara budaya. Ini tidak lengkap secara teologis. Ini menanggalkan setengah dari injil yang paling siap dipahami oleh budaya-budaya tersebut.",
    "Implikasi praktisnya: ketika kamu mengoreksi seseorang dalam konteks budaya dengan kepekaan malu yang tinggi, pemulihan bukan opsional -- itu adalah intinya. Jalur kembali kepada kehormatan di hadapan Allah dan komunitas bukan renungan terhadap akuntabilitas. Itu adalah apa yang membuat koreksi menjadi tindakan kasih daripada tindakan penghakiman.",
  ],
};
// ─── Section 9 From the Field ─────────────────────────────────────────────────
const FIELD_STORIES: Record<Lang, { title: string; subtitle: string; paras: string[] }[]> = {
  en: [
    {
      title: '"He was fine. He resigned the next morning."',
      subtitle: "Composite -- Southeast Asian organizational context",
      paras: [
        "I had been managing the regional operations team for about eight months when the pattern started showing up in performance reviews. One of my strongest local managers -- I will call him Arif -- was consistently producing outcomes that were below what I knew he was capable of. The numbers were fine on paper. The downstream work was not.",
        "I decided to address it directly. Arif and I had a good working relationship, I thought. We met weekly. He always had something useful to add in team discussions. I pulled him into a meeting room one afternoon and walked him through what I was observing: specific deliverables that had come in below standard, timelines missed, a pattern that was starting to affect the team's output. I was specific. I was clear. I told him what needed to change and by when.",
        `He was attentive throughout. Took notes. Said, "Yes, I understand. I will work on this." Thanked me for being direct. I left the meeting feeling that it had gone about as well as a difficult conversation could.`,

        "Two weeks later, Arif's line manager came to me with an administrative question about notice periods. Arif had submitted his resignation the same afternoon as our meeting.",
        "I did not understand it. I had done everything right -- I had been specific, private, professional. I had not been unkind. But what I had not understood was what the meeting communicated to Arif beyond its explicit content. The fact that I had kept notes, that I had referenced a pattern across multiple weeks, that I named specific deliverables by date -- this told him that his performance was being tracked and documented at a level that, in his cultural logic, meant his position was in question. The meeting was not feedback. It was a warning he could not respond to without losing face. He processed it as a door closing, not a path opening.",
        `What I would do differently: I would not have come with notes. I would have opened with a genuine question -- "I want to understand what has been challenging about this last quarter" -- and let him tell me what was in the way before I named what I was observing. I would have built the corrective frame around a shared problem rather than a documented pattern. And I would have made clear, in words, that the conversation was between us -- that I was bringing this to him first because I believed in his ability to solve it.`,
      ],
    },
    {
      title: "The Translator in the Room",
      subtitle: "Composite -- East African NGO context",
      paras: [
        "We had a funding review coming up, and I knew -- because multiple people had told me indirectly -- that there were concerns about how Daniel, one of our senior program officers, was presenting outcomes data to donors. Nothing false. But consistently shaped to look better than the underlying reality.",
        "I had tried to raise it once before in a team meeting. Nothing came of it. Daniel had smiled and agreed with the process feedback I gave; the reports had not changed.",
        "A colleague suggested I speak to David first. David had been with the organization for twelve years, was respected by everyone on the team, and had a long-standing personal relationship with Daniel. I was hesitant -- it felt like I was outsourcing a difficult conversation. But I agreed.",
        "David came back to me two days later. He had spoken with Daniel. The conversation had apparently been straightforward -- David had described the situation as a risk to the organization and asked Daniel to make changes. Daniel had listened to David in a way he had not listened to me. The following reporting cycle was substantially better.",
        "I spent some time thinking about what the difference was. It was not that David had said something I could not have said. It was that David's voice carried relational weight that mine did not -- weight built over twelve years of being present through difficult things, being trusted, being seen as someone whose concern came from genuine care for the organization and the people in it. My voice was accurate. David's voice was credible in a way mine was not yet.",
        "There is a version of this story where I resist using an intermediary because it feels like it compromises my authority as a manager. That version ends with a funding review conversation that is much harder than it needed to be.",
      ],
    },
    {
      title: "Getting the Reframe Wrong (and Then Right)",
      subtitle: "Composite -- Northern European and East Asian team context",
      paras: [
        "I am Dutch. I have been working in multicultural teams in Southeast Asia for nearly a decade, and I still get this wrong regularly enough that I am not sure the learning ever becomes automatic.",
        `The moment I want to describe happened during a virtual project review. A Korean colleague had submitted a deliverable that was genuinely not ready -- the core analysis was missing a dimension that we had explicitly agreed would be included. I knew this. The team lead knew this. In the call, I said something like: "I think there might be a few areas here that could be developed a bit further before we finalize -- especially the comparative piece."`,
        `I thought I was being kind. In Dutch terms, I was being almost embarrassingly gentle.`,
        `My Korean colleague heard, I would learn later, "this is not ready and I have said so in front of the team." The "comparative piece" was a specific enough reference that it pointed at a clear gap. The "before we finalize" implied a deadline problem. And the "might" and "a bit further" did not soften it enough to prevent the group-facing element from landing as a public correction.`,
        `After the call, a mutual colleague told me what had happened. I went back to my Korean colleague privately, opened by saying that I was aware the way I had raised the feedback in the group setting had probably not been how it should have gone, and asked if we could work through the deliverable together. I said -- and this felt important to say explicitly -- that the gap in the analysis was not a reflection on their competence; I had probably not been clear enough in the initial brief about what "comparative" meant.`,
        "This was partially true and mostly strategic, but it was not dishonest. It was a face-restoring move that offered my colleague a way to correct the work without the correction sitting on top of a public loss of standing.",
        "The deliverable came back two days later. It was excellent.",
        `What I had learned: in indirect feedback cultures, "gentle" by my standards is not the same as gentle by theirs. And the group setting changes everything -- what felt to me like a low-key comment in a meeting was, from the other side, a correction made in front of peers. The register of the delivery and the setting of the delivery both have to be right, or neither is.`,
      ],
    },
  ],
  id: [
    {
      title: '"Dia baik-baik saja. Ia mengundurkan diri keesokan paginya."',
      subtitle: "Komposit -- Konteks organisasi Asia Tenggara",
      paras: [
        "Saya telah mengelola tim operasi regional selama sekitar delapan bulan ketika pola itu mulai muncul dalam tinjauan kinerja. Salah satu manajer lokal saya yang paling kuat -- saya akan menyebutnya Arif -- secara konsisten menghasilkan hasil yang di bawah yang saya tahu mampu ia capai. Angkanya baik di atas kertas. Pekerjaan hilir tidak.",
        "Saya memutuskan untuk mengatasinya secara langsung. Arif dan saya memiliki hubungan kerja yang baik, pikir saya. Kami bertemu setiap minggu. Ia selalu punya sesuatu yang berguna untuk ditambahkan dalam diskusi tim. Saya menariknya ke ruang rapat suatu sore dan menjelaskan apa yang saya amati: hasil-hasil spesifik yang masuk di bawah standar, tenggat waktu yang terlewat, pola yang mulai mempengaruhi output tim. Saya spesifik. Saya jelas. Saya memberitahunya apa yang perlu berubah dan kapan.",
        `Ia penuh perhatian sepanjang waktu. Mencatat. Berkata, "Ya, saya mengerti. Saya akan mengerjakan ini." Berterima kasih karena saya bersikap langsung. Saya meninggalkan pertemuan dengan perasaan bahwa itu berjalan sebaik yang bisa dilakukan percakapan yang sulit.`,
        "Dua minggu kemudian, manajer lini Arif datang kepada saya dengan pertanyaan administratif tentang periode pemberitahuan. Arif telah mengajukan pengunduran dirinya pada sore yang sama dengan pertemuan kami.",
        "Saya tidak mengerti. Saya telah melakukan segalanya dengan benar -- saya telah spesifik, pribadi, profesional. Saya tidak tidak baik. Tetapi apa yang tidak saya pahami adalah apa yang dikomunikasikan pertemuan itu kepada Arif di luar konten eksplisitnya. Fakta bahwa saya telah membuat catatan, bahwa saya telah merujuk pola selama beberapa minggu, bahwa saya menyebutkan hasil-hasil spesifik berdasarkan tanggal -- ini memberitahunya bahwa kinerjanya sedang dilacak dan didokumentasikan pada tingkat yang, dalam logika budayanya, berarti posisinya dipertanyakan. Pertemuan itu bukan umpan balik. Itu adalah peringatan yang tidak bisa ia tanggapi tanpa kehilangan muka. Ia memprosesnya sebagai pintu yang menutup, bukan jalan yang terbuka.",
        `Apa yang akan saya lakukan secara berbeda: Saya tidak akan datang dengan catatan. Saya akan membuka dengan pertanyaan yang tulus -- "Saya ingin memahami apa yang telah menantang selama kuartal terakhir ini" -- dan membiarkan ia memberitahu saya apa yang ada di jalan sebelum saya menyebutkan apa yang saya amati. Saya akan membangun kerangka korektif di sekitar masalah bersama daripada pola yang terdokumentasi. Dan saya akan memperjelas, dalam kata-kata, bahwa percakapan tersebut antara kami -- bahwa saya membawa ini kepadanya terlebih dahulu karena saya percaya pada kemampuannya untuk menyelesaikannya.`,
      ],
    },
    {
      title: "Penerjemah di Ruangan",
      subtitle: "Komposit -- Konteks LSM Afrika Timur",
      paras: [
        "Kami akan menghadapi tinjauan pendanaan, dan saya tahu -- karena beberapa orang telah memberitahu saya secara tidak langsung -- bahwa ada kekhawatiran tentang bagaimana Daniel, salah satu petugas program senior kami, mempresentasikan data hasil kepada donor. Tidak ada yang salah. Tetapi secara konsisten dibentuk untuk terlihat lebih baik dari kenyataan dasarnya.",
        "Saya telah mencoba mengangkatnya sekali sebelumnya dalam rapat tim. Tidak ada yang terjadi. Daniel telah tersenyum dan setuju dengan umpan balik proses yang saya berikan; laporan-laporan tidak berubah.",
        "Seorang kolega menyarankan saya untuk berbicara dengan David terlebih dahulu. David telah bersama organisasi selama dua belas tahun, dihormati oleh semua orang di tim, dan memiliki hubungan pribadi yang sudah lama dengan Daniel. Saya ragu -- rasanya seperti saya mengalihdayakan percakapan yang sulit. Tetapi saya setuju.",
        "David kembali kepada saya dua hari kemudian. Ia telah berbicara dengan Daniel. Percakapan itu tampaknya lugas -- David telah menggambarkan situasinya sebagai risiko bagi organisasi dan meminta Daniel untuk melakukan perubahan. Daniel telah mendengarkan David dengan cara yang tidak ia lakukan kepada saya. Siklus pelaporan berikutnya jauh lebih baik.",
        "Saya menghabiskan waktu untuk memikirkan apa perbedaannya. Bukan bahwa David telah mengatakan sesuatu yang tidak bisa saya katakan. Adalah bahwa suara David membawa bobot relasional yang tidak dimiliki suara saya -- bobot yang dibangun selama dua belas tahun hadir melalui hal-hal yang sulit, dipercaya, dilihat sebagai seseorang yang kepeduliannya berasal dari kepedulian tulus terhadap organisasi dan orang-orang di dalamnya. Suara saya akurat. Suara David dapat dipercaya dengan cara yang belum dimiliki suara saya.",
        "Ada versi cerita ini di mana saya menolak menggunakan perantara karena rasanya seperti mengkompromikan otoritas saya sebagai manajer. Versi itu berakhir dengan percakapan tinjauan pendanaan yang jauh lebih sulit dari yang seharusnya.",
      ],
    },
    {
      title: "Salah Melakukan Reframe (dan Kemudian Benar)",
      subtitle: "Komposit -- Konteks tim Eropa Utara dan Asia Timur",
      paras: [
        "Saya orang Belanda. Saya telah bekerja dalam tim multikultural di Asia Tenggara selama hampir satu dekade, dan saya masih sering melakukan kesalahan ini sehingga saya tidak yakin pembelajaran itu pernah menjadi otomatis.",
        `Momen yang ingin saya ceritakan terjadi selama tinjauan proyek virtual. Seorang kolega Korea telah menyerahkan hasil yang sungguh-sungguh belum siap -- analisis inti kehilangan dimensi yang secara eksplisit kami setujui akan disertakan. Saya tahu ini. Pemimpin tim tahu ini. Dalam panggilan itu, saya mengatakan sesuatu seperti: "Saya pikir mungkin ada beberapa area di sini yang bisa dikembangkan sedikit lebih lanjut sebelum kita finalisasi -- terutama bagian komparatif."`,
        "Saya pikir saya bersikap baik. Dalam istilah Belanda, saya hampir memalukan betapa lembutnya saya.",
        `Kolega Korea saya mendengar, seperti yang saya pelajari kemudian, "ini belum siap dan saya telah mengatakan demikian di depan tim." "Bagian komparatif" adalah referensi yang cukup spesifik sehingga menunjuk pada celah yang jelas. "Sebelum kita finalisasi" mengimplikasikan masalah tenggat waktu. Dan "mungkin" dan "sedikit lebih lanjut" tidak cukup melembutkannya untuk mencegah elemen yang menghadap kelompok mendarat sebagai koreksi publik.`,

        `Setelah panggilan, seorang kolega bersama memberitahu saya apa yang terjadi. Saya kembali kepada kolega Korea saya secara pribadi, membuka dengan mengatakan bahwa saya menyadari cara saya mengangkat umpan balik dalam setting kelompok mungkin tidak seperti yang seharusnya, dan bertanya apakah kita bisa mengerjakan hasilnya bersama. Saya berkata -- dan ini terasa penting untuk dikatakan secara eksplisit -- bahwa celah dalam analisis bukan cerminan kompetensi mereka; saya mungkin tidak cukup jelas dalam arahan awal tentang apa arti "komparatif."`,
        "Ini sebagian benar dan sebagian besar strategis, tetapi tidak tidak jujur. Itu adalah gerakan pemulihan muka yang memberikan kolega saya cara untuk mengoreksi pekerjaan tanpa koreksi berada di atas kehilangan kedudukan publik.",
        "Hasilnya kembali dua hari kemudian. Itu luar biasa.",
        `Apa yang telah saya pelajari: dalam budaya umpan balik tidak langsung, "lembut" menurut standar saya tidak sama dengan lembut menurut standar mereka. Dan setting kelompok mengubah segalanya -- apa yang bagi saya terasa seperti komentar yang tidak mencolok dalam rapat, dari sisi lain, adalah koreksi yang dibuat di depan rekan-rekan. Register penyampaian dan setting penyampaian keduanya harus benar, atau tidak satupun yang benar.`,

      ],
    },
  ],
};
// ─── DigDeeper (shared collapsible panel) ─────────────────────────────────────
function DigDeeper({ lang, panelId, title, dark, children }: {
  lang: Lang;
  panelId: string;
  title: { en: string; id: string };
  dark: boolean;
  children: ReactNode;
}) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [open, setOpen] = useState(false);
  const borderColor = dark ? "oklch(40% 0.06 260)" : "oklch(85% 0.01 80)";
  const labelColor = dark ? OFF_WHITE : NAVY;
  const subColor = dark ? "oklch(65% 0.04 260)" : "oklch(55% 0.04 260)";

  return (
    <div style={{ marginTop: 40 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          width: "100%",
          minHeight: 44,
          padding: "1rem 1.25rem",
          background: "transparent",
          border: `1px solid ${borderColor}`,
          borderRadius: 10,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: FONT_BODY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.7rem", color: labelColor }}>
            {t("Dig Deeper", "Gali Lebih Dalam")}
          </span>
          <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: "0.7rem", color: subColor }}>
            {t("for those who want the full story", "untuk yang ingin cerita lengkapnya")}
          </span>
        </span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <path d="M3 6l5 5 5-5" stroke={labelColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={panelId}
        style={{
          maxHeight: open ? 12000 : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease, opacity 0.4s ease",
        }}
      >
        <div style={{ padding: "1.5rem 1.25rem" }}>
          <h4 style={{ fontFamily: FONT_BODY, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: labelColor, marginTop: 0, marginBottom: 18 }}>
            {title[lang]}
          </h4>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── DefinitionChip ───────────────────────────────────────────────────────────
function DefinitionChip({ term, definition, inverted }: {
  term: string;
  definition: string;
  inverted?: boolean;
}) {
  return (
    <div style={{ flex: "1 1 260px", minWidth: 0 }}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: inverted ? CARD_DARK : NAVY,
        border: inverted ? `1px solid ${NAVY_BORDER}` : "none",
        borderRadius: 999,
        padding: "8px 18px",
        marginBottom: 10,
      }}>
        <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: ORANGE, flexShrink: 0 }} />
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: OFF_WHITE }}>
          {term}
        </span>
      </span>
      <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: inverted ? "oklch(75% 0.04 260)" : BODY_TEXT, lineHeight: 1.7, margin: 0 }}>
        {definition}
      </p>
    </div>
  );
}

// ─── BigStat ──────────────────────────────────────────────────────────────────
function BigStat({ number, caption, dark }: { number: string; caption: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, margin: "36px 0" }}>
      <span style={{ fontFamily: FONT_HEADLINE, fontSize: 96, fontWeight: 700, color: ORANGE, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
        {number}
      </span>
      <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 16px)", color: dark ? "oklch(80% 0.03 260)" : BODY_TEXT, lineHeight: 1.6, margin: 0, maxWidth: 420 }}>
        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{number} </span>
        {caption}
      </p>
    </div>
  );
}

// ─── AnnotationCard ───────────────────────────────────────────────────────────
function AnnotationCard({ label, text }: { label: string; text: string }) {
  return (
    <div style={{
      maxWidth: 480,
      marginLeft: "auto",
      marginBottom: 40,
      background: CARD_DARK,
      borderLeft: `3px solid ${ORANGE}`,
      borderRadius: "0 10px 10px 0",
      padding: "16px 20px",
    }}>
      <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>
        {label}
      </p>
      <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: "oklch(78% 0.04 260)", lineHeight: 1.7, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

// ─── StepCards (Section 6) ────────────────────────────────────────────────────
function StepCards({ lang }: { lang: Lang }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 24,
      marginBottom: 52,
    }}>
      {STEP_CARDS[lang].map((step, i) => (
        <div key={i} style={{
          background: "oklch(93% 0.005 80)",
          border: `1.5px solid ${LIGHT_GRAY}`,
          borderRadius: 14,
          padding: "24px 28px",
        }}>
          <span style={{ fontFamily: FONT_HEADLINE, fontSize: 48, fontWeight: 700, color: ORANGE, lineHeight: 1, display: "block", marginBottom: 12 }} aria-hidden="true">
            {step.num}
          </span>
          <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(19px, 2.1vw, 23px)", fontWeight: 700, color: NAVY, marginTop: 0, marginBottom: 8 }}>
            {step.title}
          </h3>
          <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: BODY_TEXT, lineHeight: 1.7, margin: 0 }}>
            {step.body}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── InboxCards (Section 1) ───────────────────────────────────────────────────
function InboxCards({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [open, setOpen] = useState<boolean[]>([false, false, false]);

  const toggle = (i: number) => {
    setOpen(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div role="group" aria-label={t("Three inboxes", "Tiga kotak masuk")}>
      {/* Sent email card */}
      <div style={{
        background: CARD_DARK,
        border: `1px solid ${NAVY_BORDER}`,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 28,
      }}>
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${NAVY_BORDER}` }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: "oklch(72% 0.04 260)", margin: "0 0 4px" }}>{INBOX_EMAIL.from[lang]}</p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, color: OFF_WHITE, margin: 0 }}>{INBOX_EMAIL.subject[lang]}</p>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <p style={{
            fontFamily: FONT_BODY,
            fontSize: "clamp(14px, 1.5vw, 15px)",
            color: "oklch(82% 0.03 260)",
            lineHeight: 1.8,
            margin: 0,
            background: "oklch(20% 0.09 260)",
            borderRadius: 10,
            padding: "16px 20px",
          }}>
            {INBOX_EMAIL.body[lang]}
          </p>
          <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 13, color: "oklch(60% 0.04 260)", margin: "14px 0 0" }}>
            {INBOX_EMAIL.footer[lang]}
          </p>
        </div>
      </div>

      {/* Recipient cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {INBOX_CARDS.map((card, i) => (
          <div key={i} style={{
            background: "oklch(18% 0.09 260)",
            border: `1px solid ${open[i] ? ORANGE : NAVY_BORDER}`,
            borderRadius: 12,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={open[i]}
              aria-controls={`gf-inbox-reveal-${i}`}
              style={{
                display: "block",
                width: "100%",
                minHeight: 44,
                textAlign: "left",
                padding: "16px 18px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "inline-block", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, marginBottom: 6 }}>
                {card.chip}
              </span>
              <span style={{ display: "block", fontFamily: FONT_HEADLINE, fontSize: 22, fontWeight: 700, color: OFF_WHITE, marginBottom: 6 }}>
                {card.name}
              </span>
              <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: "oklch(74% 0.04 260)", lineHeight: 1.6 }}>
                {card.visible[lang]}
              </span>
            </button>
            <div
              id={`gf-inbox-reveal-${i}`}
              aria-live="polite"
              style={{
                maxHeight: open[i] ? 400 : 0,
                opacity: open[i] ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.35s ease, opacity 0.3s ease",
              }}
            >
              <div style={{
                margin: "0 18px 18px",
                background: CARD_DARK,
                borderLeft: `3px solid ${ORANGE}`,
                borderRadius: "0 8px 8px 0",
                padding: "14px 16px",
              }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>
                  {t("What it felt like", "Bagaimana rasanya")}
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: "oklch(80% 0.03 260)", lineHeight: 1.7, margin: 0 }}>
                  {card.reveal[lang]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CultureDialExplorer (Section 2) ──────────────────────────────────────────
function CultureDialExplorer({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const culture = CULTURE_DIALS[active];

  function onKeyDown(e: KeyboardEvent) {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % CULTURE_DIALS.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + CULTURE_DIALS.length) % CULTURE_DIALS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = CULTURE_DIALS.length - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  function dialRow(label: string, value: string, pos: number, glyph: "circle" | "square") {
    return (
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY }}>
            {label}
          </span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: BODY_TEXT }}>
            {value}
          </span>
        </div>
        <div style={{ position: "relative", height: 18 }} aria-hidden="true">
          <div style={{ position: "absolute", top: 7, left: 0, right: 0, height: 4, background: LIGHT_GRAY, borderRadius: 2 }} />
          <div style={{ position: "absolute", top: 7, left: 0, width: `${pos}%`, height: 4, background: ORANGE, borderRadius: 2, transition: "width 0.3s ease" }} />
          <div style={{
            position: "absolute",
            top: 1,
            left: `calc(${pos}% - 8px)`,
            width: 16,
            height: 16,
            background: NAVY,
            border: `2px solid ${ORANGE}`,
            borderRadius: glyph === "circle" ? 999 : 3,
            transition: "left 0.3s ease",
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 44 }}>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 14 }}>
        {t("Tap a culture to read its two dials", "Ketuk sebuah budaya untuk membaca dua skalanya")}
      </p>
      <div role="tablist" aria-label={t("Cultures", "Budaya")} onKeyDown={onKeyDown} style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {CULTURE_DIALS.map((c, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              id={`gf-dial-tab-${i}`}
              aria-selected={isActive}
              aria-controls="gf-dial-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              style={{
                minHeight: 44,
                padding: "10px 20px",
                borderRadius: 999,
                border: isActive ? `2px solid ${ORANGE}` : `2px solid ${LIGHT_GRAY}`,
                background: isActive ? NAVY : "transparent",
                color: isActive ? OFF_WHITE : BODY_TEXT,
                fontFamily: FONT_BODY,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
              }}
            >
              {c.name[lang]}
            </button>
          );
        })}
      </div>
      <div
        id="gf-dial-panel"
        role="tabpanel"
        aria-labelledby={`gf-dial-tab-${active}`}
        aria-live="polite"
        style={{
          background: "oklch(93% 0.005 80)",
          border: `1.5px solid ${LIGHT_GRAY}`,
          borderRadius: 14,
          padding: "24px 28px",
        }}
      >
        <p style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.4vw, 28px)", fontWeight: 700, color: NAVY, margin: "0 0 20px" }}>
          {culture.name[lang]}
        </p>
        {dialRow(t("Communicating", "Komunikasi"), culture.comm[lang], culture.commPos, "circle")}
        {dialRow(t("Evaluating", "Evaluasi"), culture.evalv[lang], culture.evalPos, "square")}
        <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: BODY_TEXT, lineHeight: 1.7, margin: "16px 0 0", borderTop: `1px solid ${LIGHT_GRAY}`, paddingTop: 14 }}>
          {culture.gotcha[lang]}
        </p>
      </div>
    </div>
  );
}

// ─── IntensityPairs (Section 3) ───────────────────────────────────────────────
function IntensityPairs({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [isMobile, setIsMobile] = useState(false);
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const toggle = (i: number) => {
    setFlipped(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const headerStyle = (up: boolean): CSSProperties => ({
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: up ? ORANGE : "oklch(70% 0.04 260)",
    borderBottom: up ? `2px solid ${ORANGE}` : "2px solid oklch(40% 0.06 260)",
    paddingBottom: 10,
    margin: 0,
  });

  if (isMobile) {
    return (
      <div role="group" aria-label={t("Intensity pairs", "Pasangan intensitas")} style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
        {INTENSITY_PAIRS.map((pair, i) => {
          const showDown = flipped[i];
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              aria-pressed={showDown}
              style={{
                display: "block",
                width: "100%",
                minHeight: 44,
                textAlign: "left",
                background: CARD_DARK,
                border: `1px solid ${showDown ? "oklch(40% 0.06 260)" : ORANGE}`,
                borderRadius: 12,
                padding: "16px 20px",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: showDown ? "oklch(70% 0.04 260)" : ORANGE, marginBottom: 8 }}>
                {showDown ? INTENSITY_HEADERS.down[lang] : INTENSITY_HEADERS.up[lang]}
              </span>
              <span aria-live="polite" style={{
                display: "block",
                fontFamily: FONT_BODY,
                fontSize: "clamp(14px, 3.8vw, 15px)",
                fontWeight: showDown ? 400 : 700,
                fontStyle: showDown ? "italic" : "normal",
                color: "oklch(85% 0.03 260)",
                lineHeight: 1.7,
              }}>
                {showDown ? pair.down[lang] : pair.up[lang]}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28, rowGap: 0, marginBottom: 36 }}>
      <p style={headerStyle(true)}>{INTENSITY_HEADERS.up[lang]}</p>
      <p style={headerStyle(false)}>{INTENSITY_HEADERS.down[lang]}</p>
      {INTENSITY_PAIRS.map((pair, i) => (
        <Fragment key={i}>
          <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 15px)", fontWeight: 700, color: "oklch(85% 0.03 260)", lineHeight: 1.7, margin: 0, padding: "18px 0", borderBottom: "1px solid oklch(30% 0.09 260)" }}>
            {pair.up[lang]}
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 15px)", fontStyle: "italic", color: "oklch(75% 0.04 260)", lineHeight: 1.7, margin: 0, padding: "18px 0", borderBottom: "1px solid oklch(30% 0.09 260)" }}>
            {pair.down[lang]}
          </p>
        </Fragment>
      ))}
    </div>
  );
}

// ─── SilenceCards (Section 4) ─────────────────────────────────────────────────
function SilenceCards({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [open, setOpen] = useState<boolean[]>([false, false, false, false]);

  const toggle = (i: number) => {
    setOpen(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div
      role="group"
      aria-label={t("Four ways the unsaid speaks", "Empat cara hal yang tak terucap berbicara")}
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, margin: "36px 0 44px" }}
    >
      {SILENCE_CARDS.map((card, i) => (
        <div key={i} style={{
          background: NAVY,
          borderRadius: 14,
          overflow: "hidden",
          alignSelf: "start",
        }}>
          <button
            onClick={() => toggle(i)}
            aria-expanded={open[i]}
            aria-controls={`gf-silence-back-${i}`}
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              minHeight: 110,
              textAlign: "left",
              padding: "22px 24px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "block", fontFamily: FONT_HEADLINE, fontSize: 26, fontWeight: 700, color: OFF_WHITE, lineHeight: 1.2, marginBottom: 8 }}>
              {card.term}
            </span>
            <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE }}>
              {card.region[lang]}
            </span>
            <span aria-hidden="true" style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: open[i] ? ORANGE : "oklch(55% 0.04 260)" }}>
              {t("Tap", "Ketuk")}
            </span>
          </button>
          <div
            id={`gf-silence-back-${i}`}
            aria-live="polite"
            style={{
              maxHeight: open[i] ? 500 : 0,
              opacity: open[i] ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.35s ease, opacity 0.3s ease",
            }}
          >
            <div style={{ background: OFF_WHITE, borderTop: `3px solid ${ORANGE}`, padding: "18px 24px" }}>
              <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                {card.back[lang]}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
// ─── GivingFeedbackSpectrum SVG component ────────────────────────────────────
function GivingFeedbackSpectrum({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const BAND1_Y = 148, BAND1_H = 18, BAND1_MID = 157;
  const BAND2_Y = 312, BAND2_H = 18, BAND2_MID = 321;
  const ROW_A = 110, ROW_B = 78, ROW_C = 255;
  const ROW_D = 360, ROW_E = 330, ROW_F = 430;
  const X0 = 60, X1 = 740;
  const labelStyle = { fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700 as const, letterSpacing: "1.5px", fill: "oklch(30% 0.10 260)" };
  const axisStyle = { fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700 as const, letterSpacing: "1.2px", fill: "oklch(52% 0.06 260)" };
  const cultureStyle = { fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600 as const, fill: NAVY };
  const leaderStroke = { stroke: "oklch(65% 0.06 260)", strokeWidth: 0.8 };

  const b1Cultures = [
    { x: 60, row: "B", en: "Israel", id: "Israel" },
    { x: 117, row: "A", en: "Germany", id: "Jerman" },
    { x: 174, row: "C", en: "Netherlands", id: "Belanda" },
    { x: 231, row: "B", en: "France", id: "Prancis" },
    { x: 288, row: "A", en: "Australia", id: "Australia" },
    { x: 345, row: "C", en: "USA", id: "AS" },
    { x: 402, row: "A", en: "UK", id: "Inggris" },
    { x: 459, row: "B", en: "Brazil", id: "Brasil" },
    { x: 516, row: "A", en: "Nigeria", id: "Nigeria" },
    { x: 573, row: "C", en: "Kenya", id: "Kenya" },
    { x: 630, row: "B", en: "S. Korea", id: "Korea Sel." },
    { x: 687, row: "A", en: "Indonesia", id: "Indonesia" },
    { x: 744, row: "C", en: "Japan", id: "Jepang" },
  ];

  const b2Cultures = [
    { x: 75, row: "E", en: "Germany", id: "Jerman" },
    { x: 132, row: "D", en: "Australia", id: "Australia" },
    { x: 189, row: "F", en: "Netherlands", id: "Belanda" },
    { x: 258, row: "E", en: "USA", id: "AS" },
    { x: 321, row: "D", en: "UK", id: "Inggris" },
    { x: 390, row: "F", en: "Nigeria", id: "Nigeria" },
    { x: 447, row: "E", en: "Kenya", id: "Kenya" },
    { x: 510, row: "D", en: "Brazil", id: "Brasil" },
    { x: 573, row: "F", en: "S. Korea", id: "Korea Sel." },
    { x: 636, row: "E", en: "Indonesia", id: "Indonesia" },
    { x: 693, row: "D", en: "France", id: "Prancis" },
    { x: 744, row: "F", en: "Japan", id: "Jepang" },
  ];

  const getB1LabelY = (row: string) => row === "A" ? ROW_A : row === "B" ? ROW_B : ROW_C;
  const getB2LabelY = (row: string) => row === "D" ? ROW_D : row === "E" ? ROW_E : ROW_F;

  return (
    <figure style={{ margin: "32px 0 0" }}>
      <svg
        aria-hidden="true"
        viewBox="0 0 800 510"
        style={{ width: "100%", maxWidth: 800, display: "block", margin: "0 auto", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="gf-eval-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1B3A6B" />
            <stop offset="40%" stopColor="#4a6a9e" />
            <stop offset="75%" stopColor="#b8c8df" />
            <stop offset="100%" stopColor="#F8F7F4" />
          </linearGradient>
          <linearGradient id="gf-comm-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F8F7F4" />
            <stop offset="30%" stopColor="#b8c8df" />
            <stop offset="65%" stopColor="#4a6a9e" />
            <stop offset="100%" stopColor="#1B3A6B" />
          </linearGradient>
          <marker id="gf-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#1B3A6B" />
          </marker>
        </defs>

        {/* Band 1 zone labels */}
        <text x={X0 + 8} y={34} textAnchor="start" {...labelStyle}>{t("UPGRADER -- DIRECT", "PENGUAT -- LANGSUNG")}</text>
        <text x={X1 - 8} y={34} textAnchor="end" {...labelStyle}>{t("DOWNGRADER -- INDIRECT", "PELEMBUT -- TIDAK LANGSUNG")}</text>
        {/* Band 1 axis label */}
        <text x={400} y={138} textAnchor="middle" {...axisStyle}>{t("EVALUATING SCALE (Meyer)", "SKALA EVALUASI (Meyer)")}</text>
        {/* Band 1 gradient bar */}
        <rect x={X0} y={BAND1_Y} width={X1 - X0} height={BAND1_H} fill="url(#gf-eval-grad)" />

        {/* Band 1 cultures */}
        {b1Cultures.map((c) => {
          const labelY = getB1LabelY(c.row);
          const isUp = c.row !== "C";
          return (
            <g key={`b1-${c.x}`}>
              {/* Square glyph */}
              <rect x={c.x - 5} y={BAND1_MID - 5} width={10} height={10} fill={NAVY} />
              {/* Leader line */}
              {isUp
                ? <line x1={c.x} y1={BAND1_MID - 5} x2={c.x} y2={labelY + 4} {...leaderStroke} />
                : <line x1={c.x} y1={BAND1_MID + 5} x2={c.x} y2={labelY - 14} {...leaderStroke} />
              }
              {/* Label */}
              <text x={c.x} y={labelY} textAnchor="middle" {...cultureStyle}>{lang === "id" ? c.id : c.en}</text>
            </g>
          );
        })}

        {/* France divergence dashed connector */}
        <line x1="231" y1="175" x2="693" y2="305"
          stroke={ORANGE} strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" opacity="0.65" />
        <text x="462" y="238" textAnchor="middle"
          fontFamily={FONT_BODY} fontSize="11" fontWeight="700"
          letterSpacing="0.08em" fill={ORANGE} opacity="0.9">
          {t("FRANCE -- not where you expect", "PRANCIS -- bukan di posisi yang kamu duga")}
        </text>

        {/* Band 2 zone labels */}
        <text x={X0 + 8} y={298} textAnchor="start" {...labelStyle}>{t("LOW-CONTEXT", "KONTEKS RENDAH")}</text>
        <text x={X1 - 8} y={298} textAnchor="end" {...labelStyle}>{t("HIGH-CONTEXT", "KONTEKS TINGGI")}</text>
        {/* Band 2 axis label */}
        <text x={400} y={302} textAnchor="middle" {...axisStyle}>{t("COMMUNICATING SCALE (Meyer)", "SKALA KOMUNIKASI (Meyer)")}</text>
        {/* Band 2 gradient bar */}
        <rect x={X0} y={BAND2_Y} width={X1 - X0} height={BAND2_H} fill="url(#gf-comm-grad)" />

        {/* Band 2 cultures */}
        {b2Cultures.map((c) => {
          const labelY = getB2LabelY(c.row);
          const isUp = c.row !== "F";
          return (
            <g key={`b2-${c.x}`}>
              <circle cx={c.x} cy={BAND2_MID} r="6" fill={NAVY} />
              {isUp
                ? <line x1={c.x} y1={BAND2_MID - 6} x2={c.x} y2={labelY + 4} {...leaderStroke} />
                : <line x1={c.x} y1={BAND2_MID + 6} x2={c.x} y2={labelY - 14} {...leaderStroke} />
              }
              <text x={c.x} y={labelY} textAnchor="middle" {...cultureStyle}>{lang === "id" ? c.id : c.en}</text>
            </g>
          );
        })}

        {/* Legend strip */}
        <rect x="150" y="452" width="500" height="32" rx="8" fill="oklch(92% 0.008 80)" fillOpacity="0.7" />
        <rect x="180" y="462" width="10" height="10" fill={NAVY} />
        <text x="202" y="471" fontFamily={FONT_BODY} fontSize="12" fontWeight="500" fill={NAVY}>
          {t("Square = Evaluating scale (feedback directness)", "Kotak = Skala Evaluasi (keterusterangan umpan balik)")}
        </text>
        <circle cx="448" cy="467" r="5.5" fill={NAVY} />
        <text x="468" y="471" fontFamily={FONT_BODY} fontSize="12" fontWeight="500" fill={NAVY}>
          {t("Circle = Communicating scale (context richness)", "Lingkaran = Skala Komunikasi (kekayaan konteks)")}
        </text>
      </svg>
      <figcaption style={{ fontFamily: FONT_BODY, fontSize: 13, fontStyle: "italic", color: "oklch(48% 0.04 260)", lineHeight: 1.7, maxWidth: 640, margin: "20px auto 0", textAlign: "center" }}>
        {lang === "id"
          ? "Dua skala budaya yang independen. Kotak menandai skala Mengevaluasi (seberapa langsung umpan balik disampaikan); lingkaran menandai skala Komunikasi (seberapa banyak makna yang berjalan di luar kata-kata). Posisi Prancis -- sangat kiri pada Evaluasi, sangat kanan pada Komunikasi -- menunjukkan mengapa dua skala ini tidak bisa diasumsikan bergerak bersama. Posisi adalah kecenderungan, bukan aturan tetap."
          : "Two independent cultural scales. Squares track the Evaluating scale (how directly feedback is delivered); circles track the Communicating scale (how much meaning travels outside the words). France's position -- far-left on Evaluating, far-right on Communicating -- shows why the two scales cannot be assumed to move together. Positions are tendencies, not fixed rules."}
      </figcaption>
    </figure>
  );
}

// ─── ReframeTool component ────────────────────────────────────────────────────
function ReframeTool({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [inputs, setInputs] = useState<string[]>(["", "", ""]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const setInput = (i: number, v: string) => {
    const next = [...inputs]; next[i] = v; setInputs(next);
  };
  const reveal = (i: number) => {
    const next = [...revealed]; next[i] = true; setRevealed(next);
  };

  const containerStyle: CSSProperties = {
    background: "oklch(18% 0.09 260)",
    border: "1px solid oklch(30% 0.09 260)",
    borderRadius: 16,
    padding: "clamp(24px, 4vw, 40px)",
    marginBottom: 48,
  };
  const roundCard: CSSProperties = {
    background: "oklch(14% 0.07 260)",
    borderRadius: 12,
    padding: "24px 28px",
    marginBottom: 28,
  };
  const scenarioCard: CSSProperties = {
    background: "oklch(20% 0.09 260)",
    borderRadius: 10,
    padding: "20px 24px",
    marginBottom: 20,
    borderLeft: "3px solid oklch(40% 0.10 260)",
  };
  const revealCard: CSSProperties = {
    background: "oklch(16% 0.08 260)",
    borderRadius: 10,
    padding: "20px 24px",
    borderLeft: `3px solid ${ORANGE}`,
    marginTop: 16,
  };

  return (
    <div style={containerStyle}>
      <p style={{ ...eyebrow, marginBottom: 8 }}>{t("THE REFRAME -- 3 Rounds", "THE REFRAME -- 3 Babak")}</p>
      <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.2, margin: "0 0 16px" }}>
        {t("The Reframe Tool", "Alat Reframe")}
      </h3>
      <p style={{ ...proseDark, marginBottom: 28 }}>
        {t(
          "Same truth, different register. Try your version, then open the suggested reframe.",
          "Kebenaran sama, register berbeda. Coba versimu, lalu buka saran reframe.",
        )}
      </p>

      {/* Rounds 1 and 2 */}
      {REFRAME_ROUNDS.map((round, idx) => (
        <div key={idx} style={roundCard}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: FONT_HEADLINE, fontSize: 44, fontWeight: 700, color: "oklch(35% 0.10 260)", lineHeight: 1 }}>{round.num}</span>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 800, color: OFF_WHITE, margin: "0 0 4px" }}>{round.title[lang]}</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: 0 }}>{round.ctx[lang]}</p>
            </div>
          </div>
          <div style={scenarioCard}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "oklch(60% 0.04 260)", margin: "0 0 8px" }}>{round.scenarioLabel[lang]}</p>
            <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: 17, color: "oklch(85% 0.04 260)", lineHeight: 1.7, margin: 0 }}>{round.scenario[lang]}</p>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "oklch(68% 0.04 260)", lineHeight: 1.6, marginBottom: 12 }}>{round.instruction[lang]}</p>
          {!revealed[idx] ? (
            <>
              <textarea
                value={inputs[idx]}
                onChange={(e) => setInput(idx, e.target.value)}
                placeholder={t("Write your reframe here...", "Tulis reframemu di sini...")}
                readOnly={revealed[idx]}
                style={{
                  width: "100%",
                  minHeight: 120,
                  background: "oklch(16% 0.08 260)",
                  border: "1.5px solid oklch(32% 0.09 260)",
                  borderRadius: 10,
                  padding: 16,
                  color: "oklch(85% 0.04 260)",
                  fontFamily: FONT_BODY,
                  fontSize: "clamp(16px, 1.8vw, 17px)",
                  lineHeight: 1.7,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  display: "block",
                  marginBottom: 12,
                }}
                aria-label={t(`Round ${round.num}: write your reframe`, `Babak ${round.num}: tulis reframemu`)}
              />
              <button
                onClick={() => reveal(idx)}
                disabled={!inputs[idx].trim()}
                style={{
                  background: "transparent",
                  border: "1px solid oklch(52% 0.10 260)",
                  borderRadius: 10,
                  padding: "12px 24px",
                  minHeight: 44,
                  color: "oklch(78% 0.04 260)",
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: inputs[idx].trim() ? "pointer" : "default",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: inputs[idx].trim() ? 1 : 0.45,
                  width: "100%",
                  justifyContent: "center",
                }}
                aria-live="polite"
              >
                {t("Show suggested reframe", "Tampilkan saran reframe")}
              </button>
            </>
          ) : (
            <>
              <textarea
                value={inputs[idx]}
                readOnly
                style={{
                  width: "100%",
                  minHeight: 120,
                  background: "oklch(16% 0.08 260)",
                  border: "1.5px solid oklch(32% 0.09 260)",
                  borderRadius: 10,
                  padding: 16,
                  color: "oklch(85% 0.04 260)",
                  fontFamily: FONT_BODY,
                  fontSize: "clamp(16px, 1.8vw, 17px)",
                  lineHeight: 1.7,
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  display: "block",
                  marginBottom: 12,
                  opacity: 0.65,
                }}
              />
              <div
                style={revealCard}
                aria-live="polite"
              >
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>{t("Suggested reframe", "Saran reframe")}</p>
                <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(16px, 1.9vw, 19px)", color: "oklch(88% 0.03 260)", lineHeight: 1.7, margin: "0 0 16px" }}>{round.reframe[lang]}</p>
                <div style={{ borderBottom: "1px solid oklch(28% 0.08 260)", margin: "0 0 16px" }} />
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "oklch(55% 0.04 260)", margin: "0 0 8px" }}>{round.explanationLabel[lang]}</p>
                {round.explanation[lang].split("\n\n").map((para, i) => (
                  <p key={i} style={{ fontFamily: FONT_BODY, fontSize: 14, color: "oklch(78% 0.04 260)", lineHeight: 1.8, margin: "0 0 12px" }}>{para}</p>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Round 3 -- reflection only */}
      <div style={roundCard}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
          <span style={{ fontFamily: FONT_HEADLINE, fontSize: 44, fontWeight: 700, color: "oklch(35% 0.10 260)", lineHeight: 1 }}>3</span>
          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 800, color: OFF_WHITE, margin: "0 0 4px" }}>{t("Your context", "Konteksmu")}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: 0 }}>{t("Your culture → theirs", "Budayamu → budaya mereka")}</p>
          </div>
        </div>
        <div style={{ background: "oklch(20% 0.09 260)", borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
          <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: 17, color: "oklch(85% 0.04 260)", lineHeight: 1.7, margin: 0 }}>
            {t(
              "Think of one piece of feedback you must give this month. Up or down in intensity? Draft your reframe, then test: could the person repeat back exactly what needs to change?",
              "Pikirkan satu umpan balik yang harus kamu berikan bulan ini. Naik atau turun intensitasnya? Tulis reframe-mu, lalu uji: bisakah orang itu mengulang dengan tepat apa yang perlu berubah?",
            )}
          </p>
        </div>
        <textarea
          value={inputs[2]}
          onChange={(e) => setInput(2, e.target.value)}
          placeholder={t("This is private. Write freely.", "Ini bersifat pribadi. Tulislah dengan bebas.")}
          style={{
            width: "100%",
            minHeight: 140,
            background: "oklch(16% 0.08 260)",
            border: "1.5px solid oklch(32% 0.09 260)",
            borderRadius: 10,
            padding: 16,
            color: "oklch(85% 0.04 260)",
            fontFamily: FONT_BODY,
            fontSize: "clamp(16px, 1.8vw, 17px)",
            lineHeight: 1.7,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            display: "block",
            marginBottom: 8,
          }}
          aria-label={t("Round 3 private reflection", "Refleksi pribadi babak 3")}
        />
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontStyle: "italic", color: "oklch(55% 0.04 260)", lineHeight: 1.6 }}>
          {t("No submission. No scoring. This round is yours alone.", "Tidak ada pengiriman. Tidak ada penilaian. Babak ini hanya untukmu.")}
        </p>
      </div>
    </div>
  );
}
// ─── NathanCaseStudy ──────────────────────────────────────────────────────────
function NathanCaseStudy({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [cp1Choice, setCp1Choice] = useState<0 | 1 | null>(null);
  const [cp2Choice, setCp2Choice] = useState<0 | 1 | null>(null);
  const reduceMotion = useRef(false);
  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const branch = cp1Choice === null ? null : cp1Choice === 0 ? ("A" as const) : ("B" as const);

  const headingStyle: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(15px, 1.6vw, 16px)",
    fontWeight: 700,
    color: "oklch(78% 0.04 260)",
    marginBottom: 14,
    marginTop: 0,
  };
  const bodyStyle: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(14px, 1.5vw, 15px)",
    color: "oklch(78% 0.04 260)",
    lineHeight: 1.8,
    marginTop: 0,
    marginBottom: 14,
  };

  function renderChoice(
    options: [CaseChoice, CaseChoice],
    chosen: 0 | 1 | null,
    onChoose: (i: 0 | 1) => void,
  ) {
    const chosenOption = chosen !== null ? options[chosen] : null;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {options.map((opt, oi) => {
            const isChosen = chosen === oi;
            const isUnchosen = chosen !== null && chosen !== oi;
            return (
              <button
                key={oi}
                aria-pressed={isChosen}
                aria-disabled={isUnchosen || undefined}
                onClick={() => { if (!isUnchosen) onChoose(oi as 0 | 1); }}
                style={{
                  display: "block",
                  width: "100%",
                  minHeight: 44,
                  textAlign: "left",
                  padding: "12px 18px",
                  background: isChosen ? "oklch(28% 0.12 260)" : "oklch(20% 0.09 260)",
                  border: isChosen ? `2px solid ${ORANGE}` : "2px solid oklch(32% 0.09 260)",
                  borderRadius: 10,
                  fontFamily: FONT_BODY,
                  fontSize: "clamp(14px, 1.5vw, 15px)",
                  color: isUnchosen ? "oklch(45% 0.04 260)" : "oklch(80% 0.04 260)",
                  opacity: isUnchosen ? 0.4 : 1,
                  cursor: isUnchosen ? "default" : "pointer",
                  transition: reduceMotion.current ? "none" : "background 0.2s, border-color 0.2s, opacity 0.2s",
                }}
              >
                {opt.label[lang]}
              </button>
            );
          })}
        </div>
        {chosenOption && (
          <div style={{
            background: "oklch(16% 0.08 260)",
            border: "1.5px solid oklch(45% 0.12 160)",
            borderRadius: 12,
            padding: "20px 24px",
            transition: reduceMotion.current ? "none" : "opacity 0.3s",
          }}>
            {chosenOption.action[lang].map((p, i) => (
              <p key={`a${i}`} style={bodyStyle}>{p}</p>
            ))}
            <p style={{ ...bodyStyle, fontWeight: 700, color: "oklch(65% 0.08 160)" }}>
              {CASE_WHAT_NEXT[lang]}
            </p>
            {chosenOption.outcome[lang].map((p, i) => (
              <p key={`o${i}`} style={{ ...bodyStyle, marginBottom: i === chosenOption.outcome[lang].length - 1 ? 0 : 14 }}>{p}</p>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div role="group" aria-label={t("Nathan Case Study", "Studi Kasus Nathan")}>
      {/* Setup */}
      <div style={{
        background: "oklch(18% 0.09 260)",
        borderRadius: 14,
        padding: "24px 28px",
        marginBottom: 32,
      }}>
        <p style={{ ...eyebrow, color: ORANGE }}>{t("The Scenario", "Skenario")}</p>
        {CASE_SETUP[lang].map((p, i) => (
          <p key={i} style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 15px)", color: "oklch(78% 0.04 260)", lineHeight: 1.8, marginTop: 0, marginBottom: i === CASE_SETUP[lang].length - 1 ? 0 : 14 }}>
            {p}
          </p>
        ))}
      </div>

      {/* Choice Point 1 */}
      <div style={{ marginBottom: 36 }}>
        <p style={headingStyle}>{CASE_CP1.heading[lang]}</p>
        {renderChoice(CASE_CP1.options, cp1Choice, (i) => { setCp1Choice(i); setCp2Choice(null); })}
      </div>

      {/* Choice Point 2 -- branch depends on Choice Point 1 */}
      {branch && (
        <div style={{ marginBottom: 36 }}>
          <p style={headingStyle}>{CASE_CP2[branch].heading[lang]}</p>
          <p style={bodyStyle}>{CASE_CP2[branch].intro[lang]}</p>
          {renderChoice(CASE_CP2[branch].options, cp2Choice, setCp2Choice)}
        </div>
      )}

      {/* Choice Point 3 -- reflection prompts, no choice required */}
      {branch && cp2Choice !== null && (
        <div style={{ marginBottom: 8 }}>
          <p style={headingStyle}>{CASE_CP3.heading[lang]}</p>
          <p style={bodyStyle}>{CASE_CP3.intro[lang]}</p>
          <p style={{ ...bodyStyle, fontWeight: 700 }}>{CASE_CP3.promptsLabel[lang]}</p>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            {CASE_CP3.prompts[lang].map((p, i) => (
              <li key={i} style={{ ...bodyStyle, marginBottom: 0 }}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
// ─── FeedbackChecklist ────────────────────────────────────────────────────────
function FeedbackChecklist({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const totalItems = CHECKLIST_COLS[lang].reduce((acc, col) => acc + col.items.length, 0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  const colColors = [
    { bg: "oklch(20% 0.10 180)", border: "oklch(35% 0.10 180)", label: "oklch(65% 0.12 180)" },
    { bg: "oklch(20% 0.10 260)", border: "oklch(35% 0.10 260)", label: "oklch(65% 0.12 260)" },
    { bg: "oklch(20% 0.10 45)",  border: "oklch(35% 0.10 45)",  label: "oklch(65% 0.12 45)"  },
  ];

  return (
    <div>
      {/* Progress indicator */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: "oklch(65% 0.04 260)" }}>
            {checked.size} / {totalItems} {t("completed", "selesai")}
          </span>
          {checked.size > 0 && (
            <button
              onClick={() => setChecked(new Set())}
              style={{ background: "none", border: "none", fontFamily: FONT_BODY, fontSize: 12, color: "oklch(55% 0.04 260)", cursor: "pointer", padding: 0, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center" }}
            >
              {t("Reset", "Setel ulang")}
            </button>
          )}
        </div>
        <div style={{ height: 4, background: "oklch(32% 0.08 260)", borderRadius: 2 }}>
          <div style={{ height: "100%", background: ORANGE, borderRadius: 2, width: `${totalItems > 0 ? (checked.size / totalItems) * 100 : 0}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
        alignItems: "start",
      }}>
        {CHECKLIST_COLS[lang].map((col, ci) => (
          <div key={ci} style={{
            background: colColors[ci].bg,
            border: `1.5px solid ${colColors[ci].border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {/* Column header */}
            <div style={{ padding: "12px 18px", borderBottom: `1px solid ${colColors[ci].border}` }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: colColors[ci].label }}>
                {col.col}
              </span>
              <p style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(16px, 1.8vw, 18px)", fontWeight: 700, color: "oklch(82% 0.04 260)", margin: "4px 0 0" }}>
                {col.title}
              </p>
            </div>

            {/* Items */}
            <ul style={{ listStyle: "none", margin: 0, padding: "12px 0" }}>
              {col.items.map((item, ii) => {
                const itemId = `gf-check-${ci}-${ii}`;
                const isChecked = checked.has(itemId);
                return (
                  <li key={ii}>
                    {/* 44×44 touch wrapper */}
                    <label
                      htmlFor={itemId}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 18px",
                        cursor: "pointer",
                        minHeight: 44,
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
                        <input
                          type="checkbox"
                          id={itemId}
                          checked={isChecked}
                          onChange={() => toggle(itemId)}
                          style={{ position: "absolute", opacity: 0, width: 20, height: 20, cursor: "pointer" }}
                        />
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          border: isChecked ? `2px solid oklch(48% 0.12 160)` : `2px solid ${colColors[ci].border}`,
                          background: isChecked ? "oklch(48% 0.12 160)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background 0.2s, border-color 0.2s",
                        }}>
                          {isChecked && (
                            <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
                              <path d="M1 4l3 3L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Label text */}
                      <span style={{
                        fontFamily: FONT_BODY,
                        fontSize: "clamp(13px, 1.4vw, 14px)",
                        color: isChecked ? "oklch(55% 0.04 260)" : "oklch(75% 0.04 260)",
                        lineHeight: 1.6,
                        transition: "color 0.2s",
                      }}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
// ─── Page component ───────────────────────────────────────────────────────────
export default function GivingFeedbackClient({ isSaved, ...rest }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";
  const t = (en: string, id: string) => lang === "id" ? id : en;

  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const [fieldExpanded, setFieldExpanded] = useState<boolean[]>([false, false, false]);

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("giving-feedback-across-cultures");
      setSaved(true);
    });
  }

  const h2Dark: CSSProperties = { fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: OFF_WHITE, marginBottom: 20, marginTop: 0 };
  const h2Light: CSSProperties = { fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: NAVY, marginBottom: 20, marginTop: 0 };

  const imageWrap: CSSProperties = { position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 40 };
  const imageEl: CSSProperties = { display: "block", width: "100%", height: "auto" };
  const imageOverlay: CSSProperties = { position: "absolute", inset: 0, background: NAVY, mixBlendMode: "multiply", opacity: 0.15, pointerEvents: "none" };

  const pullQuoteDark: CSSProperties = { fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: "clamp(26px, 3.4vw, 34px)", color: OFF_WHITE, lineHeight: 1.35, margin: "48px 0 28px", paddingTop: 24, borderTop: `3px solid ${ORANGE}` };
  const pullQuoteLight: CSSProperties = { fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: "clamp(26px, 3.4vw, 34px)", color: NAVY, lineHeight: 1.35, margin: "48px 0 0", paddingTop: 24, borderTop: `3px solid ${ORANGE}` };

  return (
    <>
      <LangToggle />

      {/* ── Hero ── */}
      <section style={{ position: "relative", background: NAVY, padding: "80px 0 64px", overflow: "hidden" }}>
        <img
          src="/images/resources/giving-feedback-across-cultures/hero-prism.jpg"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity" }}
        />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Cross-Cultural -- Module", "Lintas Budaya -- Modul")}</p>
          <h1 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(34px, 5vw, 62px)", fontWeight: 700, color: OFF_WHITE, lineHeight: 1.1, marginBottom: 20, marginTop: 0 }}>
            {t("Giving Feedback Across Cultures", "Memberi Umpan Balik Lintas Budaya")}
          </h1>
          <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(17px, 2.2vw, 22px)", color: "oklch(82% 0.03 260)", lineHeight: 1.6, maxWidth: 580, marginBottom: 32 }}>
            {t(
              "The same truth -- four different registers. Learning to translate feedback across cultural difference without losing what it needs to say.",
              "Kebenaran yang sama -- empat register yang berbeda. Belajar menerjemahkan umpan balik lintas perbedaan budaya tanpa kehilangan apa yang perlu disampaikan.",
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            aria-label={t(saved ? "Saved to dashboard" : "Save to dashboard", saved ? "Tersimpan di dasbor" : "Simpan ke dasbor")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              minHeight: 44, padding: "10px 20px",
              background: "transparent", border: `1.5px solid ${saved ? ORANGE : "oklch(55% 0.04 260)"}`,
              borderRadius: 8, fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
              color: saved ? ORANGE : "oklch(70% 0.04 260)", cursor: saved ? "default" : "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={saved ? ORANGE : "none"} stroke={saved ? ORANGE : "currentColor"} strokeWidth="1.5" aria-hidden="true">
              <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z"/>
            </svg>
            {t(saved ? "Saved" : "Save to Dashboard", saved ? "Tersimpan" : "Simpan ke Dasbor")}
          </button>
        </div>
      </section>

      {/* ── S1: Three Inboxes (NAVY) ── */}
      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Section 01 -- The Same Words", "Bagian 01 -- Kata-kata yang Sama")}</p>
          <h2 style={h2Dark}>{t("Three Inboxes", "Tiga Kotak Masuk")}</h2>
          <p style={proseDark}>
            {t(
              "One manager, one email, three inboxes. To Markus the words felt clear and fair -- tap each card to see how the same message landed.",
              "Satu manajer, satu email, tiga kotak masuk. Bagi Markus kata-katanya terasa jelas dan adil -- ketuk setiap kartu untuk melihat bagaimana pesan yang sama mendarat.",
            )}
          </p>
          <InboxCards lang={lang} />
          <p style={pullQuoteDark}>
            {t(
              "One message. Three people. Three different experiences of the same words.",
              "Satu pesan. Tiga orang. Tiga pengalaman berbeda dari kata-kata yang sama.",
            )}
          </p>
          <p style={{ ...proseDark, marginBottom: 0 }}>
            {t(
              "None responded wrongly. Each read the email through the logic their culture gave them. This module teaches you to see that logic -- and write for it.",
              "Tak ada yang salah merespons. Masing-masing membaca email itu melalui logika budaya mereka. Modul ini mengajarkanmu melihat logika itu -- dan menulis untuknya.",
            )}
          </p>
        </div>
      </section>

      {/* ── S2: Two Dials, Not One (OFF_WHITE) ── */}
      <section style={{ background: OFF_WHITE, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <div style={imageWrap}>
            <img
              src="/images/resources/giving-feedback-across-cultures/two-dials.jpg"
              alt={t("Two brass dials showing different readings", "Dua alat ukur kuningan menunjukkan angka yang berbeda")}
              style={imageEl}
            />
            <div style={imageOverlay} aria-hidden="true" />
          </div>
          <p style={eyebrow}>{t("Section 02 -- The Model", "Bagian 02 -- Model")}</p>
          <h2 style={h2Light}>{t("Two Dials, Not One", "Dua Skala, Bukan Satu")}</h2>
          <p style={prose}>
            {t(
              "Most leaders assume one dial. Erin Meyer's research shows two, moving independently -- how a culture communicates, and how it criticizes. The gap is where feedback gets lost.",
              "Kebanyakan pemimpin mengasumsikan satu skala. Riset Erin Meyer menunjukkan dua, yang bergerak secara independen -- cara sebuah budaya berkomunikasi, dan cara budaya itu mengkritik. Kesenjangan itulah tempat umpan balik hilang.",
            )}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 36 }}>
            <DefinitionChip
              term={t("COMMUNICATING", "KOMUNIKASI")}
              definition={t(
                "How much meaning lives in the words, and how much in the context around them.",
                "Seberapa banyak makna ada di dalam kata-kata, dan seberapa banyak di konteks sekitarnya.",
              )}
            />
            <DefinitionChip
              term={t("EVALUATING", "EVALUASI")}
              definition={t(
                "How directly negative feedback is spoken -- plain, or softened and wrapped.",
                "Seberapa langsung umpan balik negatif diucapkan -- terang-terangan, atau dilembutkan dan dibungkus.",
              )}
            />
          </div>
          <BigStat
            number="2"
            caption={t(
              "separate dials. France communicates indirectly but criticizes directly. The USA does the opposite.",
              "skala terpisah. Prancis berkomunikasi tidak langsung tetapi mengkritik secara langsung. Amerika Serikat kebalikannya.",
            )}
          />
          <GivingFeedbackSpectrum lang={lang} />
          <CultureDialExplorer lang={lang} />
          <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(17px, 2vw, 21px)", color: BODY_TEXT, lineHeight: 1.6, textAlign: "center", maxWidth: 620, margin: "40px auto 0" }}>
            {t(
              "Find your culture on both dials. Then the culture you work with most. The gap is where your feedback disappears.",
              "Temukan budayamu pada kedua skala. Lalu budaya yang paling sering kamu hadapi. Kesenjangan itulah tempat umpan balikmu menghilang.",
            )}
          </p>
          <DigDeeper
            lang={lang}
            panelId="gf-dd-s2"
            dark={false}
            title={{ en: "Hall, Meyer, and the research behind the two dials", id: "Hall, Meyer, dan riset di balik dua dial" }}
          >
            {S2_PARAS[lang].map((p, i) => (
              <p key={i} style={{ ...prose, fontSize: "1rem", lineHeight: 1.7 }}>{p}</p>
            ))}
          </DigDeeper>
        </div>
      </section>

      {/* ── S3: Say It Stronger, Say It Softer (NAVY) ── */}
      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Section 03 -- The Language", "Bagian 03 -- Bahasa")}</p>
          <h2 style={h2Dark}>{t("Say It Stronger, Say It Softer", "Lebih Tegas, Lebih Lembut")}</h2>
          <p style={proseDark}>
            {t(
              "Every language carries small words that turn feedback up or down. Direct cultures reach for upgraders; indirect cultures reach for downgraders. Neither is more honest -- but send the wrong intensity into the wrong culture, and the message either wounds or evaporates.",
              "Setiap bahasa membawa kata-kata kecil yang menaikkan atau menurunkan volume umpan balik. Budaya langsung memakai penguat; budaya tidak langsung memakai pelembut. Tidak ada yang lebih jujur -- tetapi kirimkan intensitas yang salah ke budaya yang salah, dan pesan itu akan melukai atau menguap.",
            )}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 36 }}>
            <DefinitionChip
              inverted
              term={t("UPGRADER", "PENGUAT")}
              definition={t(
                "Intensifies: completely, totally, absolutely.",
                "Mengintensifkan: sepenuhnya, sama sekali, mutlak.",
              )}
            />
            <DefinitionChip
              inverted
              term={t("DOWNGRADER", "PELEMBUT")}
              definition={t(
                "Softens: kind of, slightly, maybe, a little.",
                "Melembutkan: agak, sedikit, mungkin, barangkali.",
              )}
            />
          </div>
          <IntensityPairs lang={lang} />
          <AnnotationCard
            label={t("WHY IT MATTERS", "MENGAPA INI PENTING")}
            text={t(
              "A British \"I'm not sure this is quite ready\" means redo it. A Dutch listener hears a mild reservation. Two different decoding tables.",
              "\"Saya tidak yakin ini sudah cukup siap\" dari orang Inggris berarti buat ulang. Pendengar Belanda mendengar keraguan kecil. Dua tabel penerjemahan yang berbeda.",
            )}
          />
          <ReframeTool lang={lang} />
          <DigDeeper
            lang={lang}
            panelId="gf-dd-s3"
            dark
            title={{ en: "The full upgrader and downgrader guide", id: "Panduan lengkap upgrader dan downgrader" }}
          >
            {UDRG_TABLE.rows.map((row, i) => (
              <div key={i} style={{ marginBottom: 26, paddingBottom: 22, borderBottom: i < UDRG_TABLE.rows.length - 1 ? "1px solid oklch(30% 0.08 260)" : "none" }}>
                <h5 style={{ fontFamily: FONT_BODY, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: OFF_WHITE, marginTop: 0, marginBottom: 12 }}>
                  {row.culture[lang]}
                </h5>
                {([
                  { label: UDRG_TABLE.headers[lang][1], value: row.pos[lang] },
                  { label: UDRG_TABLE.headers[lang][2], value: row.lang[lang] },
                  { label: UDRG_TABLE.headers[lang][3], value: row.example[lang] },
                ]).map((line, j) => (
                  <div key={j} style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginBottom: 8 }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: ORANGE, flex: "0 0 100%" }}>
                      {line.label}
                    </span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: "0.95rem", lineHeight: 1.7, color: "oklch(80% 0.03 260)" }}>
                      {line.value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </DigDeeper>
        </div>
      </section>

      {/* ── S4: When Silence Is the Feedback (OFF_WHITE) ── */}
      <section style={{ background: OFF_WHITE, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <p style={eyebrow}>{t("Section 04 -- The Unsaid", "Bagian 04 -- Yang Tak Terucap")}</p>
          <h2 style={h2Light}>{t("When Silence Is the Feedback", "Ketika Keheningan Adalah Umpan Balik")}</h2>
          <div style={imageWrap}>
            <img
              src="/images/resources/giving-feedback-across-cultures/still-water.jpg"
              alt={t("A single ripple crossing still dark water", "Satu riak melintasi air gelap yang tenang")}
              style={imageEl}
            />
            <div style={imageOverlay} aria-hidden="true" />
          </div>
          <p style={prose}>
            {t(
              "In much of the world, the loudest feedback is never spoken. It arrives as silence, distance, a colleague who stops offering ideas. Four ways the unsaid speaks.",
              "Di sebagian besar dunia, umpan balik paling keras tidak pernah diucapkan. Ia hadir sebagai keheningan, jarak, kolega yang berhenti menawarkan ide. Empat cara hal yang tak terucap berbicara.",
            )}
          </p>
          <SilenceCards lang={lang} />
          <p style={pullQuoteLight}>
            {t(
              "The signal is being sent. The receiver is missing it.",
              "Sinyal sedang dikirim. Penerima melewatkannya.",
            )}
          </p>
        </div>
      </section>

      {/* ── S5: The Nathan Principle (NAVY) ── */}
      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Section 05 -- The Principle", "Bagian 05 -- Prinsip")}</p>
          <h2 style={h2Dark}>{t("The Nathan Principle", "Prinsip Natan")}</h2>
          <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(22px, 2.6vw, 26px)", color: OFF_WHITE, lineHeight: 1.5, margin: "32px 0 28px", paddingLeft: 20, borderLeft: `3px solid ${ORANGE}` }}>
            {t(
              "\"Better is open rebuke than hidden love.\" -- Proverbs 27:5",
              "\"Teguran yang terang-terangan lebih baik daripada kasih yang tersembunyi.\" -- Amsal 27:5",
            )}
          </p>
          <p style={proseDark}>
            {t(
              "Nathan, sent to confront King David over adultery and murder, did not open with the charge. He told a story -- a rich man who took a poor man's one beloved lamb -- and let David pronounce the verdict himself.",
              "Natan, yang diutus untuk menghadapi Raja Daud atas perzinahan dan pembunuhan, tidak membuka dengan tuduhan. Ia menceritakan sebuah kisah -- seorang kaya yang mengambil satu-satunya domba kesayangan orang miskin -- dan membiarkan Daud menjatuhkan vonis itu sendiri.",
            )}
          </p>
          <p style={{ fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: "clamp(32px, 4vw, 40px)", color: OFF_WHITE, lineHeight: 1.3, margin: "36px 0 28px" }}>
            {t(
              "\"You are the man.\" -- 2 Samuel 12:7",
              "\"Engkau sendiri orang itu.\" -- 2 Samuel 12:7",
            )}
          </p>
          <BigStat
            dark
            number="5"
            caption={t(
              "words. Devastatingly direct -- receivable because the parable came first.",
              "kata. Sangat tegas -- dapat diterima karena perumpamaan datang lebih dulu.",
            )}
          />
          <p style={proseDark}>
            {t(
              "The indirect path was not evasion -- it was preparation. That is the Nathan Principle. Now test it.",
              "Jalan tidak langsung itu bukan penghindaran -- itu persiapan. Itulah Prinsip Natan. Sekarang ujilah.",
            )}
          </p>
          <div style={imageWrap}>
            <img
              src="/images/resources/giving-feedback-across-cultures/oil-lamp.jpg"
              alt={t("A small oil lamp burning in the dark", "Sebuah pelita kecil menyala dalam gelap")}
              style={imageEl}
            />
            <div style={imageOverlay} aria-hidden="true" />
          </div>
          <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.6vw, 32px)", fontWeight: 700, color: OFF_WHITE, marginBottom: 20, marginTop: 0 }}>
            {t("Case Study -- The Optimistic Reports", "Studi Kasus -- Laporan yang Optimis")}
          </h3>
          <NathanCaseStudy lang={lang} />
          <DigDeeper
            lang={lang}
            panelId="gf-dd-s5"
            dark
            title={{ en: "The Nathan method, spelled out", id: "Metode Natan, dijabarkan" }}
          >
            <p style={{ ...proseDark, fontSize: "1rem", lineHeight: 1.7 }}>{S5_METHOD[lang].intro}</p>
            <ol style={{ margin: "0 0 22px", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {S5_METHOD[lang].items.map((item, i) => (
                <li key={i} style={{ fontFamily: FONT_BODY, fontSize: "1rem", lineHeight: 1.7, color: "oklch(80% 0.03 260)" }}>
                  <strong style={{ color: OFF_WHITE }}>{item.lead}</strong> {item.body}
                </li>
              ))}
            </ol>
            {S5_PARAS[lang].map((p, i) => (
              <p key={i} style={{ ...proseDark, fontSize: "1rem", lineHeight: 1.7 }}>{p}</p>
            ))}
          </DigDeeper>
        </div>
      </section>

      {/* ── S6: The Reframe in Practice (OFF_WHITE) ── */}
      <section style={{ background: OFF_WHITE, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <p style={eyebrow}>{t("Section 06 -- The Practice", "Bagian 06 -- Praktik")}</p>
          <h2 style={h2Light}>{t("The Reframe in Practice", "Reframe dalam Praktik")}</h2>
          <p style={prose}>
            {t(
              "The whole module compresses into four moves.",
              "Seluruh modul ini terpadatkan menjadi empat langkah.",
            )}
          </p>
          <StepCards lang={lang} />
          <FeedbackChecklist lang={lang} />
        </div>
      </section>

      {/* ── S7: Faith Anchor (NAVY) ── */}
      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <h2 style={h2Dark}>{t("Faith Anchor", "Jangkar Iman")}</h2>
          <p style={proseDark}>
            {t(
              "Paul's phrase in Ephesians 4:15 -- aletheuon en agape, truthing in love -- refuses both distortions: truth without love, which wounds, and love without truth, which lets problems grow.",
              "Frasa Paulus dalam Efesus 4:15 -- aletheuon en agape, hidup dalam kebenaran dengan kasih -- menolak kedua distorsi: kebenaran tanpa kasih, yang melukai, dan kasih tanpa kebenaran, yang membiarkan masalah tumbuh.",
            )}
          </p>
          <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(22px, 2.6vw, 26px)", color: OFF_WHITE, lineHeight: 1.5, margin: "32px 0 28px", paddingLeft: 20, borderLeft: `3px solid ${ORANGE}` }}>
            {t(
              "\"Faithful are the wounds of a friend.\" -- Proverbs 27:6",
              "\"Dapat dipercaya tikaman seorang sahabat.\" -- Amsal 27:6",
            )}
          </p>
          <p style={{ ...proseDark, marginBottom: 0 }}>
            {t(
              "Matthew 18 keeps the goal in view -- private first, and always \"you have won them back.\" Restoration is the target; correction is the path.",
              "Matius 18 menjaga tujuannya tetap terlihat -- pribadi dahulu, dan selalu \"kamu telah mendapatkannya kembali.\" Pemulihan adalah target; koreksi adalah jalannya.",
            )}
          </p>
          <DigDeeper
            lang={lang}
            panelId="gf-dd-s7"
            dark
            title={{ en: "The theology of honor, shame, and truth-telling", id: "Teologi kehormatan, malu, dan berkata benar" }}
          >
            {FAITH_PARAS[lang].map((p, i) => (
              <p key={i} style={{ ...proseDark, fontSize: "1rem", lineHeight: 1.7 }}>{p}</p>
            ))}
          </DigDeeper>
        </div>
      </section>

      {/* ── S8: Key Takeaways (OFF_WHITE) ── */}
      <section style={{ background: OFF_WHITE, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 820 }}>
          <h2 style={{ ...h2Light, marginBottom: 32 }}>{t("Key Takeaways", "Poin-Poin Kunci")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {KEY_TAKEAWAYS[lang].map((item, i) => (
              <div key={i} style={{
                background: OFF_WHITE,
                border: `1.5px solid ${LIGHT_GRAY}`,
                borderLeft: `4px solid ${ORANGE}`,
                borderRadius: "0 10px 10px 0",
                padding: "18px 22px",
              }}>
                <h3 style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 15px)", fontWeight: 700, color: NAVY, marginBottom: 0, marginTop: 0 }}>
                  {item.title}
                </h3>
                {item.body ? (
                  <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: BODY_TEXT, lineHeight: 1.75, margin: "6px 0 0" }}>
                    {item.body}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S9: From the Field ── */}
      <section style={{ background: OFF_WHITE, padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 820 }}>
          <p style={eyebrow}>{t("From the Field", "Dari Lapangan")}</p>
          <h2 style={{ ...h2Light, marginBottom: 32 }}>
            {t("What This Looks Like in Practice", "Seperti Apa Ini dalam Praktik")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {FIELD_STORIES[lang].map((story, i) => (
              <article key={i} style={{
                background: "oklch(93% 0.005 80)",
                border: `1.5px solid ${LIGHT_GRAY}`,
                borderRadius: 14,
                padding: "28px 32px",
              }}>
                <p style={eyebrow}>{story.subtitle}</p>
                <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 700, color: NAVY, marginBottom: 16, marginTop: 0 }}>
                  {story.title}
                </h3>
                <p style={{ ...prose, marginBottom: 0 }}>{story.paras[0]}</p>
                {fieldExpanded[i] && story.paras.slice(1).map((p, j) => (
                  <p key={j} style={{ ...prose, marginTop: 16, marginBottom: 0 }}>{p}</p>
                ))}
                <button
                  onClick={() => setFieldExpanded(prev => prev.map((v, idx) => idx === i ? !v : v))}
                  style={{
                    marginTop: 20,
                    background: "transparent",
                    border: `1.5px solid ${ORANGE}`,
                    borderRadius: 8,
                    color: ORANGE,
                    fontFamily: FONT_BODY,
                    fontSize: "clamp(13px, 1.4vw, 14px)",
                    fontWeight: 600,
                    padding: "8px 18px",
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                  }}
                >
                  {fieldExpanded[i]
                    ? t("Show less", "Tampilkan lebih sedikit")
                    : t("Read the whole story", "Baca cerita lengkap")}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
