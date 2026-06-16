"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard, saveEnneagramResult } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";
import { trackAssessmentCompletion } from "@/lib/ga-events";
import EnneagramTypesGrid from "./EnneagramTypesGrid";
import TypeCard from "./TypeCard";
import LangToggle from "@/components/LangToggle";

// ── LANGUAGE ──────────────────────────────────────────────────────────────────
type Lang = "en" | "id";
type T3 = { en: string; id: string };
function tFn(obj: T3, lang: Lang): string { return obj[lang]; }

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 45 statements (5 per type). Field `t` = Enneagram type number (1-9).
// Rated 1–5: 1 = Not like me → 5 = Very much like me.

const QUESTIONS: { en: string; id: string; t: number }[] = [
  // Type 1 — The Reformer
  {
    en: "I hold myself and others to high standards and feel responsible for doing things the right way.",
    id: "Saya memegang standar tinggi untuk diri saya dan orang lain, dan merasa bertanggung jawab untuk melakukan sesuatu dengan benar.",
    t: 1,
  },
  {
    en: "I notice flaws and imperfections quickly — in myself, others, or situations.",
    id: "Saya cepat menyadari kekurangan dan ketidaksempurnaan — dalam diri saya, orang lain, atau situasi.",
    t: 1,
  },
  {
    en: "There is a persistent inner critic in my mind that holds me accountable.",
    id: "Ada suara kritik batin yang terus-menerus dalam pikiran saya yang membuat saya bertanggung jawab.",
    t: 1,
  },
  {
    en: "I feel a strong sense of purpose tied to making things better or more just.",
    id: "Saya merasakan tujuan yang kuat yang terkait dengan membuat segala sesuatu menjadi lebih baik atau lebih adil.",
    t: 1,
  },
  {
    en: "When people around me cut corners or ignore ethical standards, I feel frustrated and responsible to address it.",
    id: "Ketika orang-orang di sekitar saya mengambil jalan pintas atau mengabaikan standar etis, saya merasa frustrasi dan bertanggung jawab untuk mengatasinya.",
    t: 1,
  },
  // Type 2 — The Helper
  {
    en: "I naturally sense what others need and feel pulled to provide it.",
    id: "Saya secara alami merasakan apa yang dibutuhkan orang lain dan merasa terdorong untuk memenuhinya.",
    t: 2,
  },
  {
    en: "My sense of worth is closely tied to being needed and appreciated by others.",
    id: "Rasa harga diri saya sangat terkait dengan dibutuhkan dan dihargai oleh orang lain.",
    t: 2,
  },
  {
    en: "I find it easier to give than to receive — asking for help feels uncomfortable.",
    id: "Saya merasa lebih mudah memberi daripada menerima — meminta bantuan terasa tidak nyaman.",
    t: 2,
  },
  {
    en: "I adapt my behaviour to what will make the people I care about feel good.",
    id: "Saya menyesuaikan perilaku saya dengan apa yang akan membuat orang-orang yang saya pedulikan merasa baik.",
    t: 2,
  },
  {
    en: "People often come to me for emotional support, and I rarely turn them away.",
    id: "Orang-orang sering datang kepada saya untuk dukungan emosional, dan saya hampir tidak pernah menolak mereka.",
    t: 2,
  },
  // Type 3 — The Achiever
  {
    en: "Accomplishing goals and being seen as successful is very important to me.",
    id: "Mencapai tujuan dan dilihat sebagai orang yang sukses sangat penting bagi saya.",
    t: 3,
  },
  {
    en: "I can adapt my style and presentation depending on what the situation or audience requires.",
    id: "Saya dapat menyesuaikan gaya dan presentasi saya tergantung pada apa yang dibutuhkan situasi atau audiens.",
    t: 3,
  },
  {
    en: "I feel most alive when I am making progress, completing tasks, and being productive.",
    id: "Saya merasa paling hidup ketika saya membuat kemajuan, menyelesaikan tugas, dan menjadi produktif.",
    t: 3,
  },
  {
    en: "I am aware of how others perceive me and work to maintain a positive, competent image.",
    id: "Saya sadar bagaimana orang lain memandang saya dan berusaha untuk mempertahankan citra yang positif dan kompeten.",
    t: 3,
  },
  {
    en: "I tend to measure my value by what I achieve and struggle to slow down without feeling guilty.",
    id: "Saya cenderung mengukur nilai diri saya dari apa yang saya capai dan kesulitan untuk melambat tanpa merasa bersalah.",
    t: 3,
  },
  // Type 4 — The Individualist
  {
    en: "I often feel that something is missing — a sense of incompleteness or deep longing.",
    id: "Saya sering merasa ada sesuatu yang hilang — rasa ketidaklengkapan atau kerinduan yang mendalam.",
    t: 4,
  },
  {
    en: "I have deep and intense emotions that others don't always understand.",
    id: "Saya memiliki emosi yang dalam dan intens yang tidak selalu dipahami orang lain.",
    t: 4,
  },
  {
    en: "I value authenticity and originality highly — being ordinary or typical feels suffocating.",
    id: "Saya sangat menghargai keaslian dan orisinalitas — menjadi biasa atau tipikal terasa menyesakkan.",
    t: 4,
  },
  {
    en: "I am drawn to what is meaningful, beautiful, and emotionally significant.",
    id: "Saya tertarik pada hal-hal yang bermakna, indah, dan penting secara emosional.",
    t: 4,
  },
  {
    en: "I can experience mood swings and sometimes feel fundamentally different from those around me.",
    id: "Saya bisa mengalami perubahan suasana hati dan terkadang merasa berbeda secara mendasar dari orang-orang di sekitar saya.",
    t: 4,
  },
  // Type 5 — The Investigator
  {
    en: "I prefer to observe and think deeply before joining a conversation or making a decision.",
    id: "Saya lebih suka mengamati dan berpikir mendalam sebelum bergabung dalam percakapan atau mengambil keputusan.",
    t: 5,
  },
  {
    en: "I protect my energy and time carefully and need significant alone time to recharge.",
    id: "Saya menjaga energi dan waktu saya dengan hati-hati dan membutuhkan waktu sendirian yang cukup untuk mengisi ulang daya.",
    t: 5,
  },
  {
    en: "I feel most confident when I have built deep knowledge and expertise in an area.",
    id: "Saya merasa paling percaya diri ketika saya telah membangun pengetahuan dan keahlian yang mendalam di suatu bidang.",
    t: 5,
  },
  {
    en: "Emotionally intense situations feel draining — I prefer engaging with ideas over strong feelings.",
    id: "Situasi yang penuh emosi terasa melelahkan — saya lebih suka berinteraksi dengan ide daripada perasaan yang kuat.",
    t: 5,
  },
  {
    en: "I tend to minimise my needs so I don't feel dependent on or overwhelmed by others.",
    id: "Saya cenderung meminimalkan kebutuhan saya agar tidak merasa bergantung pada atau kewalahan oleh orang lain.",
    t: 5,
  },
  // Type 6 — The Loyalist
  {
    en: "I tend to anticipate problems and mentally prepare for what could go wrong.",
    id: "Saya cenderung mengantisipasi masalah dan secara mental mempersiapkan diri untuk apa yang mungkin salah.",
    t: 6,
  },
  {
    en: "Trust must be earned — I can be skeptical of authority or new people until I feel certain.",
    id: "Kepercayaan harus diperoleh — saya bisa skeptis terhadap otoritas atau orang baru sampai saya merasa yakin.",
    t: 6,
  },
  {
    en: "I feel most secure within trusted relationships, clear structures, and reliable expectations.",
    id: "Saya merasa paling aman dalam hubungan yang terpercaya, struktur yang jelas, dan harapan yang dapat diandalkan.",
    t: 6,
  },
  {
    en: "Once I commit to a person or cause, I am deeply loyal and show up consistently.",
    id: "Ketika saya berkomitmen pada seseorang atau suatu tujuan, saya sangat setia dan hadir secara konsisten.",
    t: 6,
  },
  {
    en: "I experience underlying anxiety about security and sometimes struggle to fully trust my own judgment.",
    id: "Saya mengalami kecemasan mendasar tentang keamanan dan terkadang kesulitan untuk sepenuhnya mempercayai penilaian saya sendiri.",
    t: 6,
  },
  // Type 7 — The Enthusiast
  {
    en: "I am energised by new ideas, possibilities, and experiences — life feels most alive when things are fresh.",
    id: "Saya mendapat energi dari ide-ide baru, kemungkinan, dan pengalaman — hidup terasa paling hidup ketika segalanya segar.",
    t: 7,
  },
  {
    en: "I find it hard to stay with discomfort or boredom for long — I tend to reframe or move on.",
    id: "Saya kesulitan untuk bertahan dalam ketidaknyamanan atau kebosanan — saya cenderung mereframing atau beranjak.",
    t: 7,
  },
  {
    en: "I have many interests and ideas, and I sometimes start more things than I finish.",
    id: "Saya memiliki banyak minat dan ide, dan terkadang saya memulai lebih banyak hal daripada yang saya selesaikan.",
    t: 7,
  },
  {
    en: "I prefer to keep my options open and find restrictions or firm commitments uncomfortable.",
    id: "Saya lebih suka menjaga pilihan tetap terbuka dan merasa tidak nyaman dengan pembatasan atau komitmen yang tegas.",
    t: 7,
  },
  {
    en: "I naturally see the positive in situations and become restless when life feels too routine.",
    id: "Saya secara alami melihat sisi positif dalam situasi dan menjadi gelisah ketika hidup terasa terlalu rutin.",
    t: 7,
  },
  // Type 8 — The Challenger
  {
    en: "I take charge naturally and am comfortable confronting situations or people that feel unjust.",
    id: "Saya secara alami mengambil kendali dan nyaman menghadapi situasi atau orang yang terasa tidak adil.",
    t: 8,
  },
  {
    en: "Vulnerability feels uncomfortable — I prefer to project strength and stay in control.",
    id: "Kerentanan terasa tidak nyaman — saya lebih suka menampilkan kekuatan dan tetap dalam kendali.",
    t: 8,
  },
  {
    en: "I can be intense and others sometimes experience me as too direct, too forceful, or too much.",
    id: "Saya bisa menjadi intens dan orang lain terkadang mengalami saya sebagai terlalu langsung, terlalu tegas, atau terlalu banyak.",
    t: 8,
  },
  {
    en: "I feel called to protect people who are vulnerable and to fight for what is right.",
    id: "Saya merasa terpanggil untuk melindungi orang-orang yang rentan dan berjuang untuk kebenaran.",
    t: 8,
  },
  {
    en: "I go all-in on what I believe in — half-measures and timidity frustrate me deeply.",
    id: "Saya sepenuhnya berkomitmen pada apa yang saya percaya — setengah-setengah dan pengecut membuat saya sangat frustrasi.",
    t: 8,
  },
  // Type 9 — The Peacemaker
  {
    en: "I find conflict deeply uncomfortable and naturally try to mediate or smooth things over.",
    id: "Saya merasa konflik sangat tidak nyaman dan secara alami berusaha untuk menjadi perantara atau meredakannya.",
    t: 9,
  },
  {
    en: "I can lose sight of my own priorities when I am busy supporting others.",
    id: "Saya bisa kehilangan pandangan tentang prioritas saya sendiri ketika saya sibuk mendukung orang lain.",
    t: 9,
  },
  {
    en: "I see all sides of an issue and can find it hard to take a strong personal stance.",
    id: "Saya melihat semua sisi dari suatu masalah dan bisa merasa kesulitan untuk mengambil sikap yang kuat secara pribadi.",
    t: 9,
  },
  {
    en: "People find me easy to be around — I have a calming, reassuring presence.",
    id: "Orang-orang merasa nyaman berada di sekitar saya — saya memiliki kehadiran yang menenangkan dan meyakinkan.",
    t: 9,
  },
  {
    en: "I can procrastinate on things that matter to me personally while remaining productive for others.",
    id: "Saya bisa menunda hal-hal yang penting bagi saya secara pribadi sementara tetap produktif untuk orang lain.",
    t: 9,
  },
];

// Round-robin question order: interleaves all 9 types (type1q1, type2q1, ..., type9q1, type1q2, ...)
const QUESTION_ORDER = [
  0, 5, 10, 15, 20, 25, 30, 35, 40,
  1, 6, 11, 16, 21, 26, 31, 36, 41,
  2, 7, 12, 17, 22, 27, 32, 37, 42,
  3, 8, 13, 18, 23, 28, 33, 38, 43,
  4, 9, 14, 19, 24, 29, 34, 39, 44,
];

const SCALE_LABELS: T3[] = [
  { en: "Not like me",        id: "Tidak seperti saya" },
  { en: "Slightly like me",   id: "Sedikit seperti saya" },
  { en: "Somewhat like me",   id: "Agak seperti saya" },
  { en: "Mostly like me",     id: "Sebagian besar seperti saya" },
  { en: "Very much like me",  id: "Sangat seperti saya" },
];

const UI: Record<string, T3> = {
  personalityAssessment: { en: "Personality Assessment", id: "Penilaian Kepribadian" },
  enneagram:             { en: "Enneagram",              id: "Enneagram" },
  startAssessment:       { en: "Start Assessment →",     id: "Mulai Tes →" },
  saveDashboard:         { en: "Save to Dashboard",      id: "Simpan ke Dashboard" },
  saved:                 { en: "✓ Saved to Dashboard",                id: "✓ Tersimpan di Dashboard" },
  saving:                { en: "Saving…",                id: "Menyimpan…" },
  saveMyResult:          { en: "Save My Result →",       id: "Simpan Hasil Saya →" },
  resultSaved:           { en: "✓ Result saved to your dashboard", id: "✓ Hasil disimpan ke dasbor Anda" },
  retake:                { en: "Retake",                 id: "Ulangi" },
  yourType:              { en: "Your Type",              id: "Tipe Anda" },
  wing:                  { en: "Wing — ",                id: "Wing — " },
  yourScoreProfile:      { en: "Your Score Profile",     id: "Profil Skor Anda" },
  coreMotivation:        { en: "Core Motivation",        id: "Motivasi Inti" },
  coreFear:              { en: "Core Fear",              id: "Ketakutan Inti" },
  strengths:             { en: "Strengths",              id: "Kekuatan" },
  growthAreas:           { en: "Growth Areas",           id: "Area Pertumbuhan" },
  howToCommunicate:      { en: "How to Communicate with This Type", id: "Cara Berkomunikasi dengan Tipe Ini" },
  crossCulturalLeadership: { en: "Cross-Cultural Leadership", id: "Kepemimpinan Lintas Budaya" },
  allNineTypes:          { en: "All Nine Types",         id: "Semua Sembilan Tipe" },
  yourTypeBadge:         { en: "Your Type",              id: "Tipe Anda" },
  motivation:            { en: "Motivation: ",           id: "Motivasi: " },
  aboutAssessment:       { en: "About This Assessment",  id: "Tentang Penilaian Ini" },
  triadsTitle:           { en: "The Three Triads", id: "Tiga Triad" },
  caveatTitle:           { en: "A Note Before You Begin", id: "Catatan Sebelum Memulai" },
  caveatBody:            {
    en: "The Enneagram has roots in pre-Christian wisdom traditions, and some evangelical voices are cautious about its use. The version developed by Riso,³ Hudson,³ Rohr⁴ and others is a well-established spiritual and psychological framework — not a spiritual practice. Used as a tool for self-knowledge, it is theologically neutral. Hold it as a mirror, not a master. Read your result as a hypothesis about your motivations, not a verdict on your soul.",
    id: "Enneagram berakar pada tradisi kebijaksanaan pra-Kristen, dan beberapa suara evangelikal berhati-hati tentang penggunaannya. Versi yang dikembangkan oleh Riso,³ Hudson,³ Rohr⁴ dan lainnya adalah kerangka spiritual dan psikologis yang mapan — bukan praktik spiritual. Digunakan sebagai alat untuk pengetahuan diri, ini secara teologis netral. Jadikanlah sebagai cermin, bukan tuan. Bacalah hasil Anda sebagai hipotesis tentang motivasi Anda, bukan vonis atas jiwa Anda.",
  },
  howToReadTitle:        { en: "How to Read Your Result", id: "Cara Membaca Hasil Anda" },
  howToRead1:            { en: "Your type is your most active pattern, not a fixed label. Every person carries some of every type — one is simply dominant.", id: "Tipe Anda adalah pola yang paling aktif, bukan label tetap. Setiap orang memiliki semua tipe — satu hanya lebih dominan." },
  howToRead2:            { en: "Look at your wing — the adjacent type you also carry strongly. A 1w9 leads very differently from a 1w2.", id: "Perhatikan wing Anda — tipe yang berdekatan yang juga Anda miliki kuat. 1w9 memimpin sangat berbeda dari 1w2." },
  howToRead3:            { en: "The Enneagram describes movement. Under stress you move toward one type; in growth, toward another. Your result names both directions.", id: "Enneagram menggambarkan gerakan. Di bawah tekanan Anda bergerak menuju satu tipe; dalam pertumbuhan, menuju tipe lain. Hasil Anda menyebutkan kedua arah." },
  whatIsEnneagram:       { en: "What is the Enneagram?", id: "Apa itu Enneagram?" },
  enneagramP1:           {
    en: "The Enneagram is one of the most powerful personality frameworks available for leadership development. Unlike tools that simply describe surface behaviour, the Enneagram reveals the why behind how you act — your core motivations, deepest fears, and most consistent patterns.",
    id: "Enneagram adalah salah satu kerangka kepribadian paling kuat yang tersedia untuk pengembangan kepemimpinan. Tidak seperti alat yang hanya menggambarkan perilaku permukaan, Enneagram mengungkapkan mengapa di balik cara Anda bertindak — motivasi inti, ketakutan terdalam, dan pola yang paling konsisten.",
  },
  enneagramP2:           {
    en: "The word comes from the Greek ennea (nine) and gramma (something written). It describes nine distinct personality types, each shaped by a core motivation and a core fear that operate below the surface of most self-awareness. The system traces its modern form to Oscar Ichazo,¹ who introduced it at the Arica Institute in the 1960s–1970s, and was brought into psychological use by Claudio Naranjo.² Don Richard Riso and Russ Hudson³ and Richard Rohr⁴ shaped it into the framework most widely used in leadership and spiritual formation today.",
    id: "Kata ini berasal dari bahasa Yunani ennea (sembilan) dan gramma (sesuatu yang tertulis). Ini menggambarkan sembilan tipe kepribadian yang berbeda, masing-masing dibentuk oleh motivasi inti dan ketakutan inti yang beroperasi di bawah permukaan kesadaran diri. Sistem ini menelusuri bentuk modernnya kepada Oscar Ichazo,¹ yang memperkenalkannya di Institut Arica pada tahun 1960an–1970an, dan dikembangkan secara psikologis oleh Claudio Naranjo.² Don Richard Riso, Russ Hudson³ dan Richard Rohr⁴ membentuknya menjadi kerangka yang paling banyak digunakan dalam konteks kepemimpinan dan pembentukan spiritual saat ini.",
  },
  enneagramP3:           {
    en: "For cross-cultural teams, the Enneagram is particularly valuable. It explains why leaders from different backgrounds can have the same behaviour for completely different reasons — and why the same approach can feel like care to one person and control to another.",
    id: "Untuk tim lintas budaya, Enneagram sangat berharga. Ini menjelaskan mengapa pemimpin dari latar belakang yang berbeda dapat memiliki perilaku yang sama karena alasan yang sangat berbeda — dan mengapa pendekatan yang sama bisa terasa seperti perhatian bagi satu orang dan kontrol bagi orang lain.",
  },
  nineTypes:             { en: "The Nine Types",         id: "Sembilan Tipe" },
  howToTake:             { en: "How to take this assessment", id: "Cara mengikuti penilaian ini" },
  tip1:                  { en: "Answer 45 short statements — about 8–10 minutes.", id: "Jawab 45 pernyataan singkat — sekitar 8–10 menit." },
  tip2:                  { en: "Rate each statement 1–5 based on how much it describes you.", id: "Beri nilai setiap pernyataan 1–5 berdasarkan seberapa banyak itu menggambarkan Anda." },
  tip3:                  { en: "Answer based on how you generally are, not how you want to be.", id: "Jawab berdasarkan bagaimana Anda umumnya, bukan bagaimana Anda ingin menjadi." },
  tip4:                  { en: "There are no right or wrong answers — be as honest as you can.", id: "Tidak ada jawaban yang benar atau salah — jujurlah sebisa mungkin." },
  tip5:                  { en: "Your result reflects your most active pattern, not a fixed label.", id: "Hasil Anda mencerminkan pola yang paling aktif, bukan label yang tetap." },
  questionOf:            { en: (i: number, total: number) => `Question ${i} of ${total}` as string, id: (i: number, total: number) => `Pertanyaan ${i} dari ${total}` as string } as unknown as T3,
  howMuch:               { en: "How much does this describe you?", id: "Seberapa banyak ini menggambarkan Anda?" },
  back:                  { en: "← Back", id: "← Kembali" },
};

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

const TYPES = [
  {
    number: 1,
    name: { en: "The Reformer", id: "Si Perfeksionis" },
    tagline: { en: "Principled. Purposeful. Committed to what's right.", id: "Berprinsip. Bertujuan. Berkomitmen pada kebenaran." },
    color: "oklch(52% 0.18 250)",
    colorLight: "oklch(65% 0.14 250)",
    colorVeryLight: "oklch(94% 0.03 250)",
    bg: "oklch(18% 0.14 250)",
    overview: {
      en: "The Type 1 leader is driven by a deep sense of purpose and a commitment to integrity. They hold themselves and others to high standards, work hard to improve what's broken, and lead by example. Their inner conviction is one of their greatest strengths — and their greatest source of internal pressure.",
      id: "Pemimpin Tipe 1 didorong oleh rasa tujuan yang mendalam dan komitmen terhadap integritas. Mereka memegang standar tinggi untuk diri mereka sendiri dan orang lain, bekerja keras untuk memperbaiki apa yang salah, dan memimpin dengan teladan. Keyakinan batin mereka adalah salah satu kekuatan terbesar mereka — dan sumber tekanan internal terbesar mereka.",
    },
    motivation: {
      en: "To be good, ethical, and right — to improve the world and act with integrity.",
      id: "Menjadi baik, etis, dan benar — untuk memperbaiki dunia dan bertindak dengan integritas.",
    },
    fear: {
      en: "Being flawed, corrupt, or condemned — being a hypocrite who fails to live up to their own ideals.",
      id: "Menjadi cacat, korup, atau terkutuk — menjadi munafik yang gagal memenuhi ideal mereka sendiri.",
    },
    strengths: {
      en: ["Principled and deeply ethical", "High standards and consistent follow-through", "Brings clarity to values and expectations", "Self-disciplined and hardworking", "Natural reformer — always working to improve"],
      id: ["Berprinsip dan sangat etis", "Standar tinggi dan konsisten dalam tindak lanjut", "Membawa kejelasan pada nilai-nilai dan harapan", "Disiplin diri dan rajin", "Reformator alami — selalu bekerja untuk memperbaiki"],
    },
    blindspots: {
      en: ["Can be overly self-critical and perfectionistic", "May judge others harshly against their internal standards", "Resentment builds when expectations aren't met", "Struggles to celebrate progress — always focused on what's still wrong"],
      id: ["Bisa terlalu kritis terhadap diri sendiri dan perfeksionis", "Mungkin menghakimi orang lain dengan keras berdasarkan standar internal mereka", "Rasa kesal menumpuk ketika harapan tidak terpenuhi", "Kesulitan merayakan kemajuan — selalu fokus pada apa yang masih salah"],
    },
    communication: {
      en: "Be logical, calm, and ethical. Show respect for their standards. Don't ask them to cut corners. Acknowledge their effort and intentions before giving feedback — they are harder on themselves than you could ever be.",
      id: "Bersikaplah logis, tenang, dan etis. Tunjukkan rasa hormat terhadap standar mereka. Jangan minta mereka mengambil jalan pintas. Akui usaha dan niat mereka sebelum memberikan umpan balik — mereka lebih keras pada diri sendiri daripada yang bisa Anda lakukan.",
    },
    crossCultural: {
      en: "The Type 1's strong sense of right and wrong can create friction in high-context or relationally oriented cultures where truth is navigated, not declared. Growth edge: holding conviction with grace — learning to influence through relationship and humility, not just principle.",
      id: "Rasa benar dan salah yang kuat dari Tipe 1 dapat menciptakan gesekan dalam budaya berorientasi konteks tinggi atau relasional di mana kebenaran dinavigasi, bukan dinyatakan. Tepi pertumbuhan: memegang keyakinan dengan penuh kasih — belajar mempengaruhi melalui hubungan dan kerendahan hati, bukan hanya prinsip.",
    },
    wing9: {
      en: "1w9 — The Idealist: More introverted and philosophical. Their convictions run deep but are held more quietly. They combine principle with patience and can seem detached from emotion.",
      id: "1w9 — Si Idealis: Lebih introver dan filosofis. Keyakinan mereka sangat mendalam tetapi dipegang lebih diam-diam. Mereka memadukan prinsip dengan kesabaran dan bisa tampak terlepas dari emosi.",
    },
    wing2: {
      en: "1w2 — The Advocate: More outwardly oriented and people-focused. They apply their high standards in service of others, becoming teachers, advocates, and reformers with a warm edge.",
      id: "1w2 — Si Advokat: Lebih berorientasi keluar dan berfokus pada orang. Mereka menerapkan standar tinggi mereka dalam melayani orang lain, menjadi guru, advokat, dan reformator dengan sentuhan hangat.",
    },
  },
  {
    number: 2,
    name: { en: "The Helper", id: "Si Penolong" },
    tagline: { en: "Generous. Warm. Relationally attentive.", id: "Murah hati. Hangat. Penuh perhatian dalam relasi." },
    color: "oklch(52% 0.18 10)",
    colorLight: "oklch(65% 0.14 10)",
    colorVeryLight: "oklch(94% 0.04 10)",
    bg: "oklch(18% 0.14 10)",
    overview: {
      en: "The Type 2 leader leads through relationship. They are warm, empathetic, and genuinely invested in the people around them. They are often the emotional glue of a team — present, attentive, and generous with their time and energy. Their growth edge is learning to lead from their own needs and calling, not just in response to others'.",
      id: "Pemimpin Tipe 2 memimpin melalui hubungan. Mereka hangat, empatik, dan sungguh-sungguh peduli pada orang-orang di sekitar mereka. Mereka sering menjadi perekat emosional sebuah tim — hadir, penuh perhatian, dan murah hati dengan waktu dan energi mereka. Tepi pertumbuhan mereka adalah belajar memimpin dari kebutuhan dan panggilan mereka sendiri, bukan hanya sebagai respons terhadap orang lain.",
    },
    motivation: {
      en: "To be loved, needed, and appreciated — to feel that their giving makes them indispensable.",
      id: "Untuk dicintai, dibutuhkan, dan dihargai — untuk merasakan bahwa pemberian mereka membuat mereka tak tergantikan.",
    },
    fear: {
      en: "Being unwanted, unloved, or rejected — being seen as a burden rather than a gift.",
      id: "Tidak diinginkan, tidak dicintai, atau ditolak — dilihat sebagai beban daripada anugerah.",
    },
    strengths: {
      en: ["Deep empathy and relational intelligence", "Serves others generously and joyfully", "Creates warmth and belonging in teams", "Builds loyalty through genuine care", "Natural encourager — people feel valued around them"],
      id: ["Empati yang dalam dan kecerdasan relasional", "Melayani orang lain dengan murah hati dan gembira", "Menciptakan kehangatan dan rasa memiliki dalam tim", "Membangun loyalitas melalui kepedulian yang tulus", "Pemberi semangat alami — orang-orang merasa dihargai di sekitar mereka"],
    },
    blindspots: {
      en: ["Can neglect their own needs and then feel resentful", "Struggles with boundaries — saying no feels unloving", "Can become indirect or manipulative when feeling unappreciated", "Emotional health depends heavily on others' responses"],
      id: ["Bisa mengabaikan kebutuhan mereka sendiri dan kemudian merasa kesal", "Kesulitan dengan batas — mengatakan tidak terasa tidak penuh kasih", "Bisa menjadi tidak langsung atau manipulatif ketika merasa tidak dihargai", "Kesehatan emosional sangat bergantung pada respons orang lain"],
    },
    communication: {
      en: "Be warm, personal, and appreciative. Acknowledge the person before the task. Express genuine gratitude — it fuels them. Avoid being cold or transactional — they read relational temperature in everything.",
      id: "Bersikaplah hangat, personal, dan penuh apresiasi. Akui orangnya sebelum tugasnya. Ungkapkan rasa terima kasih yang tulus — itu memberi mereka energi. Hindari bersikap dingin atau transaksional — mereka membaca suhu relasional dalam segala hal.",
    },
    crossCultural: {
      en: "The Type 2's warmth is a gift in relational cultures. In task-focused or emotionally reserved contexts, learning to deliver results without over-personalising is key. Across cultures, the form of care varies — be careful not to impose your version of love on others.",
      id: "Kehangatan Tipe 2 adalah anugerah dalam budaya relasional. Dalam konteks yang berfokus pada tugas atau emosional yang tertahan, kunci utamanya adalah belajar memberikan hasil tanpa terlalu mempersonalisasi. Di berbagai budaya, bentuk kepedulian berbeda-beda — berhati-hatilah untuk tidak memaksakan versi cinta Anda kepada orang lain.",
    },
    wing1: {
      en: "2w1 — The Servant: More principled and self-demanding. They combine generous giving with a strong moral framework. Their service has a mission quality — they give because it is the right thing to do.",
      id: "2w1 — Si Pelayan: Lebih berprinsip dan menuntut diri sendiri. Mereka memadukan kemurahan hati dengan kerangka moral yang kuat. Pelayanan mereka memiliki kualitas misi — mereka memberi karena itu adalah hal yang benar untuk dilakukan.",
    },
    wing3: {
      en: "2w3 — The Host: More image-conscious and outgoing. They love to be seen as helpful and connect helping with their public identity. Warmth meets ambition in how they serve.",
      id: "2w3 — Si Tuan Rumah: Lebih sadar citra dan ramah. Mereka suka dipandang sebagai orang yang membantu dan menghubungkan bantuan dengan identitas publik mereka. Kehangatan bertemu ambisi dalam cara mereka melayani.",
    },
  },
  {
    number: 3,
    name: { en: "The Achiever", id: "Si Berprestasi" },
    tagline: { en: "Driven. Adaptable. Naturally effective.", id: "Bersemangat. Adaptif. Efektif secara alami." },
    color: "oklch(55% 0.18 65)",
    colorLight: "oklch(68% 0.14 65)",
    colorVeryLight: "oklch(94% 0.04 65)",
    bg: "oklch(18% 0.12 65)",
    overview: {
      en: "The Type 3 leader is a high performer who adapts, executes, and delivers. They are natural motivators who lead by example, setting the pace through visible achievement. They bring energy and efficiency to every team they join. Their growth edge is learning that who they are matters more than what they accomplish.",
      id: "Pemimpin Tipe 3 adalah pemain tinggi yang beradaptasi, mengeksekusi, dan memberikan hasil. Mereka adalah motivator alami yang memimpin dengan teladan, menetapkan ritme melalui pencapaian yang terlihat. Mereka membawa energi dan efisiensi ke setiap tim yang mereka bergabungi. Tepi pertumbuhan mereka adalah belajar bahwa siapa mereka lebih penting daripada apa yang mereka capai.",
    },
    motivation: {
      en: "To be valuable and admired — to be recognized for their accomplishments and seen as outstanding.",
      id: "Menjadi berharga dan dikagumi — diakui atas pencapaian mereka dan dianggap luar biasa.",
    },
    fear: {
      en: "Being worthless or failing publicly — being exposed as a fraud beneath the achievements.",
      id: "Menjadi tidak berharga atau gagal di depan umum — terekspos sebagai penipu di balik pencapaian.",
    },
    strengths: {
      en: ["Highly effective and results-driven", "Adapts naturally to different contexts and audiences", "Motivates others through visible achievement", "Energetic and focused under pressure", "Communicates vision and goals with clarity and persuasion"],
      id: ["Sangat efektif dan berorientasi pada hasil", "Beradaptasi secara alami dengan konteks dan audiens yang berbeda", "Memotivasi orang lain melalui pencapaian yang terlihat", "Energetik dan fokus di bawah tekanan", "Mengkomunikasikan visi dan tujuan dengan jelas dan persuasif"],
    },
    blindspots: {
      en: ["Can prioritize image over authenticity", "May lose touch with genuine emotions in pursuit of goals", "Can push people too hard to perform", "Struggles to slow down and simply 'be' without an agenda"],
      id: ["Bisa memprioritaskan citra daripada keaslian", "Bisa kehilangan kontak dengan emosi sejati dalam mengejar tujuan", "Bisa mendorong orang terlalu keras untuk berprestasi", "Kesulitan untuk melambat dan sekadar 'ada' tanpa agenda"],
    },
    communication: {
      en: "Be efficient and outcome-focused. Show them the path to success. Acknowledge their achievements specifically. Avoid making them feel like they're underperforming — they take it to heart.",
      id: "Bersikaplah efisien dan fokus pada hasil. Tunjukkan jalur menuju kesuksesan. Akui pencapaian mereka secara spesifik. Hindari membuat mereka merasa berkinerja buruk — mereka sangat merasakannya.",
    },
    crossCultural: {
      en: "The Type 3's drive and efficiency is valued in performance-oriented cultures. In relational or shame-based cultures, the pressure to appear successful can amplify unhealthy patterns. Growth edge: prioritizing authentic relationships over impressive outcomes — being known, not just admired.",
      id: "Dorongan dan efisiensi Tipe 3 dihargai dalam budaya berorientasi kinerja. Dalam budaya relasional atau berbasis malu, tekanan untuk tampak sukses dapat memperkuat pola yang tidak sehat. Tepi pertumbuhan: memprioritaskan hubungan yang autentik daripada hasil yang mengesankan — dikenal, bukan hanya dikagumi.",
    },
    wing2: {
      en: "3w2 — The Charmer: More people-focused and relational. They achieve through connection, combining effectiveness with genuine warmth. Success means winning people as much as results.",
      id: "3w2 — Si Pemikat: Lebih berfokus pada orang dan relasional. Mereka berprestasi melalui koneksi, memadukan efektivitas dengan kehangatan yang tulus. Sukses berarti memenangkan hati orang sebanyak hasilnya.",
    },
    wing4: {
      en: "3w4 — The Professional: More introspective and concerned with depth. They want to achieve something meaningful, not just impressive. Combines ambition with the desire to express something true.",
      id: "3w4 — Si Profesional: Lebih introspektif dan peduli dengan kedalaman. Mereka ingin mencapai sesuatu yang bermakna, bukan hanya mengesankan. Memadukan ambisi dengan keinginan untuk mengekspresikan sesuatu yang nyata.",
    },
  },
  {
    number: 4,
    name: { en: "The Individualist", id: "Si Individualis" },
    tagline: { en: "Expressive. Authentic. Emotionally deep.", id: "Ekspresif. Autentik. Penuh kedalaman emosi." },
    color: "oklch(48% 0.22 295)",
    colorLight: "oklch(62% 0.17 295)",
    colorVeryLight: "oklch(94% 0.04 295)",
    bg: "oklch(16% 0.18 295)",
    overview: {
      en: "The Type 4 leader brings depth, creativity, and emotional intelligence to everything they do. They long to be truly known and to express something genuine. They are drawn to meaning, beauty, and authenticity — and they help teams access the deeper 'why' behind the work. Their growth edge is finding identity in what they share with others, not just what makes them different.",
      id: "Pemimpin Tipe 4 membawa kedalaman, kreativitas, dan kecerdasan emosional dalam segala hal yang mereka lakukan. Mereka merindukan untuk benar-benar dikenal dan mengekspresikan sesuatu yang tulus. Mereka tertarik pada makna, keindahan, dan keaslian — dan mereka membantu tim mengakses 'mengapa' yang lebih dalam di balik pekerjaan. Tepi pertumbuhan mereka adalah menemukan identitas dalam apa yang mereka bagikan dengan orang lain, bukan hanya apa yang membuat mereka berbeda.",
    },
    motivation: {
      en: "To find and express their unique identity — to be truly seen and understood for who they are at the deepest level.",
      id: "Menemukan dan mengekspresikan identitas unik mereka — untuk benar-benar dilihat dan dipahami untuk siapa mereka pada tingkat paling dalam.",
    },
    fear: {
      en: "Having no identity or personal significance — being ordinary, flawed, or fundamentally deficient.",
      id: "Tidak memiliki identitas atau signifikansi pribadi — menjadi biasa, cacat, atau secara mendasar kurang.",
    },
    strengths: {
      en: ["Deep empathy and emotional intelligence", "Brings authenticity and meaning to their work", "Creative and original thinker", "Helps teams explore the deeper 'why'", "Connects at a soul level with people who are hurting"],
      id: ["Empati yang dalam dan kecerdasan emosional", "Membawa keaslian dan makna pada pekerjaan mereka", "Pemikir yang kreatif dan orisinal", "Membantu tim mengeksplorasi 'mengapa' yang lebih dalam", "Terhubung pada level jiwa dengan orang-orang yang sedang terluka"],
    },
    blindspots: {
      en: ["Can become absorbed in their own emotional landscape", "May envy others who seem to have what they lack", "Can withdraw or become dramatic when misunderstood", "Mood fluctuations affect team consistency"],
      id: ["Bisa tenggelam dalam lanskap emosional mereka sendiri", "Mungkin iri pada orang lain yang tampaknya memiliki apa yang mereka kurangi", "Bisa menarik diri atau menjadi dramatis ketika disalahpahami", "Fluktuasi suasana hati memengaruhi konsistensi tim"],
    },
    communication: {
      en: "Acknowledge their uniqueness and depth. Don't rush them to 'get over it' emotionally. Create space for genuine expression. They respond to authenticity — don't be performative or shallow around them.",
      id: "Akui keunikan dan kedalaman mereka. Jangan terburu-buru menyuruh mereka untuk 'melewatinya' secara emosional. Ciptakan ruang untuk ekspresi yang tulus. Mereka merespons keaslian — jangan berpura-pura atau dangkal di sekitar mereka.",
    },
    crossCultural: {
      en: "The Type 4's focus on individual uniqueness can clash with collectivist cultures where the group is primary. Growth edge: learning to find meaning through community and shared identity — discovering that 'we' can be just as deep as 'I'.",
      id: "Fokus Tipe 4 pada keunikan individu bisa bertentangan dengan budaya kolektivis di mana kelompok adalah yang utama. Tepi pertumbuhan: belajar menemukan makna melalui komunitas dan identitas bersama — menemukan bahwa 'kita' bisa sama dalamnya dengan 'saya'.",
    },
    wing3: {
      en: "4w3 — The Aristocrat: More driven and image-aware. Combines depth with ambition. Wants their uniqueness to be not just felt but seen and recognised. Often highly creative and publicly expressive.",
      id: "4w3 — Si Aristokrat: Lebih bersemangat dan sadar citra. Memadukan kedalaman dengan ambisi. Ingin keunikan mereka tidak hanya dirasakan tetapi juga dilihat dan diakui. Sering sangat kreatif dan ekspresif secara publik.",
    },
    wing5: {
      en: "4w5 — The Bohemian: More withdrawn and intellectual. Combines emotional depth with a need to understand. Often produces rich, complex creative work in private before sharing it.",
      id: "4w5 — Si Bohemian: Lebih menarik diri dan intelektual. Memadukan kedalaman emosional dengan kebutuhan untuk memahami. Sering menghasilkan karya kreatif yang kaya dan kompleks secara pribadi sebelum membagikannya.",
    },
  },
  {
    number: 5,
    name: { en: "The Investigator", id: "Si Investigator" },
    tagline: { en: "Analytical. Perceptive. Expert.", id: "Analitis. Jeli. Ahli." },
    color: "oklch(50% 0.16 195)",
    colorLight: "oklch(64% 0.12 195)",
    colorVeryLight: "oklch(94% 0.03 195)",
    bg: "oklch(18% 0.12 195)",
    overview: {
      en: "The Type 5 leader is a thinker. They build deep expertise, observe before acting, and bring careful, well-researched thinking to every decision. They are often the most prepared person in the room — and they lead best when they can operate from a position of knowledge and autonomy. Their growth edge is learning to engage fully in life rather than observing from a distance.",
      id: "Pemimpin Tipe 5 adalah pemikir. Mereka membangun keahlian yang mendalam, mengamati sebelum bertindak, dan membawa pemikiran yang hati-hati dan teriteliti ke setiap keputusan. Mereka sering menjadi orang yang paling siap di ruangan — dan mereka memimpin paling baik ketika mereka dapat beroperasi dari posisi pengetahuan dan otonomi. Tepi pertumbuhan mereka adalah belajar untuk terlibat sepenuhnya dalam kehidupan daripada mengamati dari kejauhan.",
    },
    motivation: {
      en: "To be competent and knowledgeable — to understand the world deeply and function independently.",
      id: "Menjadi kompeten dan berpengetahuan — untuk memahami dunia secara mendalam dan berfungsi secara mandiri.",
    },
    fear: {
      en: "Being incompetent, helpless, or overwhelmed by the demands and intrusions of others.",
      id: "Menjadi tidak kompeten, tidak berdaya, atau kewalahan oleh tuntutan dan gangguan orang lain.",
    },
    strengths: {
      en: ["Deep expertise and rigorous analytical thinking", "Objective and carefully considered perspective", "Thorough preparation and research", "Calm under pressure — not reactive or impulsive", "Holds complexity without panic or shortcuts"],
      id: ["Keahlian mendalam dan pemikiran analitis yang ketat", "Perspektif yang objektif dan dipertimbangkan dengan hati-hati", "Persiapan dan penelitian yang menyeluruh", "Tenang di bawah tekanan — tidak reaktif atau impulsif", "Memegang kompleksitas tanpa panik atau jalan pintas"],
    },
    blindspots: {
      en: ["Can withdraw and become isolated from the team", "May hoard knowledge rather than sharing it generously", "Emotional vulnerability feels threatening — can seem cold", "Analysis paralysis can slow decisions past the point of usefulness"],
      id: ["Bisa menarik diri dan menjadi terisolasi dari tim", "Mungkin menimbun pengetahuan daripada berbagi secara murah hati", "Kerentanan emosional terasa mengancam — bisa tampak dingin", "Kelumpuhan analisis dapat memperlambat keputusan melampaui titik kegunaan"],
    },
    communication: {
      en: "Give them space to think. Don't demand immediate answers. Bring data, not just feelings. Respect their boundaries around time and energy — they are not being cold; they are being careful.",
      id: "Beri mereka ruang untuk berpikir. Jangan menuntut jawaban segera. Bawa data, bukan hanya perasaan. Hormati batasan mereka seputar waktu dan energi — mereka tidak sedang dingin; mereka sedang berhati-hati.",
    },
    crossCultural: {
      en: "The Type 5's preference for privacy and expertise-based authority can feel distant in highly relational cultures. Growth edge: learning to build trust through relationship, not just competence — and to engage emotionally even when it feels uncomfortable.",
      id: "Preferensi Tipe 5 untuk privasi dan otoritas berbasis keahlian bisa terasa jauh dalam budaya yang sangat relasional. Tepi pertumbuhan: belajar membangun kepercayaan melalui hubungan, bukan hanya kompetensi — dan terlibat secara emosional bahkan ketika terasa tidak nyaman.",
    },
    wing4: {
      en: "5w4 — The Iconoclast: More emotionally expressive and creative. Combines analytical depth with aesthetic sensibility. Often produces visionary, original thinking that challenges convention.",
      id: "5w4 — Si Ikonoklas: Lebih ekspresif secara emosional dan kreatif. Memadukan kedalaman analitis dengan kepekaan estetis. Sering menghasilkan pemikiran visioner dan orisinal yang menantang konvensi.",
    },
    wing6: {
      en: "5w6 — The Problem Solver: More practically oriented and loyal. Combines deep expertise with a focus on reliability and problem-solving within trusted structures.",
      id: "5w6 — Si Pemecah Masalah: Lebih berorientasi praktis dan setia. Memadukan keahlian mendalam dengan fokus pada keandalan dan pemecahan masalah dalam struktur yang dipercaya.",
    },
  },
  {
    number: 6,
    name: { en: "The Loyalist", id: "Si Setia" },
    tagline: { en: "Loyal. Responsible. Trustworthy.", id: "Setia. Bertanggung jawab. Dapat dipercaya." },
    color: "oklch(48% 0.18 240)",
    colorLight: "oklch(62% 0.13 240)",
    colorVeryLight: "oklch(94% 0.03 240)",
    bg: "oklch(17% 0.15 240)",
    overview: {
      en: "The Type 6 leader is committed, responsible, and deeply loyal to the people and causes they believe in. They are excellent at identifying risks, testing systems, and building the trust that sustains long-term teams. Their growth edge is learning to trust themselves and act despite uncertainty — moving from anxiety to courageous faithfulness.",
      id: "Pemimpin Tipe 6 berkomitmen, bertanggung jawab, dan sangat setia pada orang-orang dan tujuan yang mereka yakini. Mereka sangat baik dalam mengidentifikasi risiko, menguji sistem, dan membangun kepercayaan yang menopang tim jangka panjang. Tepi pertumbuhan mereka adalah belajar mempercayai diri sendiri dan bertindak meskipun ada ketidakpastian — bergerak dari kecemasan menuju kesetiaan yang berani.",
    },
    motivation: {
      en: "To have security, support, and certainty — to feel that they and the people they care for are safe.",
      id: "Memiliki keamanan, dukungan, dan kepastian — untuk merasakan bahwa mereka dan orang-orang yang mereka pedulikan aman.",
    },
    fear: {
      en: "Being abandoned, without support, or facing danger without allies — being left alone when it counts.",
      id: "Ditinggalkan, tanpa dukungan, atau menghadapi bahaya tanpa sekutu — dibiarkan sendirian ketika itu penting.",
    },
    strengths: {
      en: ["Deeply loyal and consistently trustworthy", "Excellent at anticipating risks and potential problems", "Builds trust through consistency and follow-through", "Committed to the team's wellbeing", "Courageous when it counts — fear activates rather than paralyses them"],
      id: ["Sangat setia dan selalu dapat dipercaya", "Sangat baik dalam mengantisipasi risiko dan masalah potensial", "Membangun kepercayaan melalui konsistensi dan tindak lanjut", "Berkomitmen pada kesejahteraan tim", "Berani ketika dibutuhkan — ketakutan mengaktifkan daripada melumpuhkan mereka"],
    },
    blindspots: {
      en: ["Chronic anxiety can create self-doubt and overthinking", "May test others' loyalty unnecessarily", "Ambivalent toward authority — can be too compliant or too resistant", "Worst-case thinking can block positive risk-taking"],
      id: ["Kecemasan kronis dapat menciptakan keraguan diri dan terlalu banyak berpikir", "Mungkin menguji loyalitas orang lain tanpa perlu", "Ambivalen terhadap otoritas — bisa terlalu patuh atau terlalu menentang", "Pemikiran skenario terburuk dapat menghalangi pengambilan risiko yang positif"],
    },
    communication: {
      en: "Be consistent, transparent, and reliable. Reassure them with substance — not just words. Explain your reasoning. Sudden changes without explanation shake them deeply. Follow through on what you say you will do.",
      id: "Bersikaplah konsisten, transparan, dan dapat diandalkan. Yakinkan mereka dengan substansi — bukan hanya kata-kata. Jelaskan penalaran Anda. Perubahan mendadak tanpa penjelasan sangat mengguncang mereka. Ikuti apa yang Anda katakan akan Anda lakukan.",
    },
    crossCultural: {
      en: "The Type 6's focus on trust-building is universally valuable. In high-power-distance cultures, their ambivalence toward authority can cause confusion. Growth edge: distinguishing healthy accountability from anxious compliance or unnecessary rebellion.",
      id: "Fokus Tipe 6 pada membangun kepercayaan sangat berharga secara universal. Dalam budaya jarak kekuasaan tinggi, ambivalensi mereka terhadap otoritas bisa menyebabkan kebingungan. Tepi pertumbuhan: membedakan akuntabilitas yang sehat dari kepatuhan yang cemas atau pemberontakan yang tidak perlu.",
    },
    wing5: {
      en: "6w5 — The Defender: More introverted and analytical. Combines loyalty with independent thinking. Tends to test authority through careful analysis rather than emotional reaction.",
      id: "6w5 — Si Pembela: Lebih introver dan analitis. Memadukan loyalitas dengan pemikiran mandiri. Cenderung menguji otoritas melalui analisis yang cermat daripada reaksi emosional.",
    },
    wing7: {
      en: "6w7 — The Buddy: More outgoing and playful. Combines loyalty with warmth and humour. Their anxiety takes a lighter edge — they manage uncertainty through connection and optimism.",
      id: "6w7 — Si Sahabat: Lebih ramah dan bersifat ceria. Memadukan loyalitas dengan kehangatan dan humor. Kecemasan mereka memiliki tepi yang lebih ringan — mereka mengelola ketidakpastian melalui koneksi dan optimisme.",
    },
  },
  {
    number: 7,
    name: { en: "The Enthusiast", id: "Si Antusias" },
    tagline: { en: "Visionary. Energetic. Possibility-focused.", id: "Visioner. Energetik. Berfokus pada kemungkinan." },
    color: "oklch(60% 0.18 30)",
    colorLight: "oklch(72% 0.14 30)",
    colorVeryLight: "oklch(94% 0.04 30)",
    bg: "oklch(18% 0.12 30)",
    overview: {
      en: "The Type 7 leader brings energy, ideas, and irresistible forward momentum. They see possibility where others see problems and inspire teams to believe that things can be different. Their gift is keeping teams moving with joy and vision — their growth edge is learning to stay present when things are hard, rather than seeking the next new thing.",
      id: "Pemimpin Tipe 7 membawa energi, ide, dan momentum maju yang tak tertahankan. Mereka melihat kemungkinan di mana orang lain melihat masalah dan menginspirasi tim untuk percaya bahwa sesuatu bisa berbeda. Hadiah mereka adalah menjaga tim terus bergerak dengan sukacita dan visi — tepi pertumbuhan mereka adalah belajar untuk tetap hadir ketika segala sesuatu menjadi sulit, daripada mencari hal baru berikutnya.",
    },
    motivation: {
      en: "To be happy, stimulated, and free — to experience everything life has to offer without being trapped in pain.",
      id: "Menjadi bahagia, terstimulasi, dan bebas — untuk mengalami semua yang ditawarkan kehidupan tanpa terjebak dalam rasa sakit.",
    },
    fear: {
      en: "Being deprived, trapped, or stuck in pain and limitation — missing out on what life could be.",
      id: "Kekurangan, terjebak, atau terjebak dalam rasa sakit dan keterbatasan — melewatkan apa yang bisa ditawarkan kehidupan.",
    },
    strengths: {
      en: ["Visionary and generative with ideas", "Creates energy and enthusiasm in teams", "Connects disparate ideas creatively", "Resilient — bounces back quickly from setbacks", "Makes the future feel exciting and achievable"],
      id: ["Visioner dan generatif dengan ide-ide", "Menciptakan energi dan antusiasme dalam tim", "Menghubungkan ide-ide yang berbeda secara kreatif", "Tangguh — bangkit kembali dengan cepat dari kemunduran", "Membuat masa depan terasa menarik dan dapat dicapai"],
    },
    blindspots: {
      en: ["Can start things without finishing them", "Uses optimism and new experiences to avoid depth and difficulty", "May over-commit and under-deliver", "Struggles to be fully present in pain or loss"],
      id: ["Bisa memulai sesuatu tanpa menyelesaikannya", "Menggunakan optimisme dan pengalaman baru untuk menghindari kedalaman dan kesulitan", "Mungkin terlalu berkomitmen dan kurang memberikan hasil", "Kesulitan untuk hadir sepenuhnya dalam rasa sakit atau kehilangan"],
    },
    communication: {
      en: "Engage with their vision and enthusiasm first. Be positive and forward-focused. Keep it dynamic and interactive. They lose energy quickly in heavy, over-structured, or deeply analytical environments.",
      id: "Libatkan diri dengan visi dan antusiasme mereka terlebih dahulu. Bersikaplah positif dan berorientasi ke depan. Jaga agar tetap dinamis dan interaktif. Mereka kehilangan energi dengan cepat dalam lingkungan yang berat, terlalu terstruktur, atau sangat analitis.",
    },
    crossCultural: {
      en: "The Type 7's optimism and energy is a genuine gift across cultures. In contexts where suffering and lament are processed communally, their drive to stay positive can feel dismissive. Growth edge: learning to be fully present in pain — without immediately trying to fix it or escape it.",
      id: "Optimisme dan energi Tipe 7 adalah anugerah nyata di berbagai budaya. Dalam konteks di mana penderitaan dan ratapan diproses secara komunal, dorongan mereka untuk tetap positif bisa terasa meremehkan. Tepi pertumbuhan: belajar untuk hadir sepenuhnya dalam rasa sakit — tanpa segera mencoba memperbaikinya atau melarikan diri darinya.",
    },
    wing6: {
      en: "7w6 — The Entertainer: More loyal and relational. Combines enthusiasm with a commitment to community. Their energy is channelled through relationships — fun, warm, and grounding.",
      id: "7w6 — Si Penghibur: Lebih setia dan relasional. Memadukan antusiasme dengan komitmen pada komunitas. Energi mereka disalurkan melalui hubungan — menyenangkan, hangat, dan membumi.",
    },
    wing8: {
      en: "7w8 — The Realist: More driven and assertive. Combines enthusiasm with force. Goes big on ideas and follows through with intensity. Can be charismatic and overwhelming in equal measure.",
      id: "7w8 — Si Realis: Lebih bersemangat dan asertif. Memadukan antusiasme dengan kekuatan. Berpikir besar tentang ide dan menindaklanjutinya dengan intensitas. Bisa karismatik dan luar biasa dalam ukuran yang sama.",
    },
  },
  {
    number: 8,
    name: { en: "The Challenger", id: "Si Penantang" },
    tagline: { en: "Powerful. Decisive. Protective.", id: "Kuat. Tegas. Protektif." },
    color: "oklch(50% 0.22 25)",
    colorLight: "oklch(63% 0.17 25)",
    colorVeryLight: "oklch(94% 0.04 25)",
    bg: "oklch(17% 0.16 25)",
    overview: {
      en: "The Type 8 leader leads with strength, decisiveness, and intensity. They take charge, protect the vulnerable, and fight for what's right. They are energised by challenge and unafraid of confrontation. Their greatest gift is their willingness to bear the weight of leadership — their growth edge is discovering that vulnerability is not weakness but the deepest form of strength.",
      id: "Pemimpin Tipe 8 memimpin dengan kekuatan, ketegasan, dan intensitas. Mereka mengambil kendali, melindungi yang rentan, dan berjuang untuk kebenaran. Mereka mendapat energi dari tantangan dan tidak takut konfrontasi. Hadiah terbesar mereka adalah kesediaan mereka untuk menanggung beban kepemimpinan — tepi pertumbuhan mereka adalah menemukan bahwa kerentanan bukan kelemahan tetapi bentuk kekuatan yang paling dalam.",
    },
    motivation: {
      en: "To be self-reliant, strong, and in control of their own life — to protect themselves and those they care for.",
      id: "Menjadi mandiri, kuat, dan mengendalikan kehidupan mereka sendiri — untuk melindungi diri mereka dan orang-orang yang mereka pedulikan.",
    },
    fear: {
      en: "Being controlled, betrayed, manipulated, or losing their power and agency.",
      id: "Dikendalikan, dikhianati, dimanipulasi, atau kehilangan kekuatan dan kemampuan bertindak mereka.",
    },
    strengths: {
      en: ["Decisive and action-oriented", "Protects and advocates fiercely for those in their care", "Unafraid of difficult conversations and necessary conflict", "Brings strength and courage to uncertain situations", "Natural authority — people know they can rely on them"],
      id: ["Tegas dan berorientasi pada tindakan", "Melindungi dan mengadvokasi dengan kuat bagi mereka yang berada dalam perlindungannya", "Tidak takut percakapan sulit dan konflik yang diperlukan", "Membawa kekuatan dan keberanian dalam situasi yang tidak pasti", "Otoritas alami — orang tahu mereka bisa mengandalkannya"],
    },
    blindspots: {
      en: ["Can be domineering and unaware of their impact on others", "Struggles with vulnerability and admitting weakness", "Trust, once broken, is rarely restored", "Can bulldoze others in pursuit of what they believe is right"],
      id: ["Bisa mendominasi dan tidak menyadari dampaknya pada orang lain", "Kesulitan dengan kerentanan dan mengakui kelemahan", "Kepercayaan, begitu rusak, jarang dipulihkan", "Bisa menghancurkan orang lain dalam mengejar apa yang mereka yakini benar"],
    },
    communication: {
      en: "Be direct, honest, and confident. Don't be passive or vague — they lose respect quickly. Earn their respect through strength, not compliance. Show them you can handle their directness without becoming defensive.",
      id: "Bersikaplah langsung, jujur, dan percaya diri. Jangan bersikap pasif atau tidak jelas — mereka dengan cepat kehilangan rasa hormat. Dapatkan rasa hormat mereka melalui kekuatan, bukan kepatuhan. Tunjukkan bahwa Anda bisa menangani kelangsungan mereka tanpa menjadi defensif.",
    },
    crossCultural: {
      en: "The Type 8's directness is empowering in some cultures and deeply disrespectful in others. In shame-based or high-context cultures, their confrontational style can destroy relationships irreparably. Growth edge: learning cultural sensitivity without losing their core strength — discovering that restraint is power.",
      id: "Ketegasan Tipe 8 memberdayakan dalam beberapa budaya dan sangat tidak hormat dalam budaya lain. Dalam budaya berbasis malu atau konteks tinggi, gaya konfrontatif mereka dapat merusak hubungan secara tidak dapat diperbaiki. Tepi pertumbuhan: belajar kepekaan budaya tanpa kehilangan kekuatan inti mereka — menemukan bahwa menahan diri adalah kekuatan.",
    },
    wing7: {
      en: "8w7 — The Maverick: More energetic and adventurous. Combines strength with enthusiasm and vision. Often charismatic, bold, and future-facing — intensity with a playful edge.",
      id: "8w7 — Si Maverick: Lebih energetik dan petualang. Memadukan kekuatan dengan antusiasme dan visi. Sering karismatik, berani, dan berorientasi masa depan — intensitas dengan sentuhan yang menyenangkan.",
    },
    wing9: {
      en: "8w9 — The Bear: More steady and patient. Combines power with calm. Their strength is held in reserve and deployed only when necessary. Often deeply protective and surprisingly gentle.",
      id: "8w9 — Si Beruang: Lebih stabil dan sabar. Memadukan kekuatan dengan ketenangan. Kekuatan mereka disimpan dan hanya digunakan saat diperlukan. Sering sangat protektif dan mengejutkan dalam kelembutan.",
    },
  },
  {
    number: 9,
    name: { en: "The Peacemaker", id: "Si Pendamai" },
    tagline: { en: "Peaceful. Inclusive. A steady presence.", id: "Damai. Inklusif. Hadir dengan stabil." },
    color: "oklch(50% 0.15 145)",
    colorLight: "oklch(63% 0.12 145)",
    colorVeryLight: "oklch(94% 0.03 145)",
    bg: "oklch(17% 0.10 145)",
    overview: {
      en: "The Type 9 leader is the unifying force of any team. They see all perspectives, create harmony, and hold space for everyone to be heard. Their calm, non-anxious presence is a profound gift in conflict-heavy environments. Their growth edge is claiming their own voice and leading with their full self — not just facilitating everyone else.",
      id: "Pemimpin Tipe 9 adalah kekuatan pemersatu dari tim mana pun. Mereka melihat semua perspektif, menciptakan harmoni, dan memberi ruang bagi semua orang untuk didengar. Kehadiran mereka yang tenang dan tidak cemas adalah anugerah yang mendalam dalam lingkungan yang penuh konflik. Tepi pertumbuhan mereka adalah mengklaim suara mereka sendiri dan memimpin dengan diri penuh mereka — bukan hanya memfasilitasi semua orang lain.",
    },
    motivation: {
      en: "To have inner peace and harmony — to stay connected with others and avoid separation or conflict.",
      id: "Memiliki kedamaian batin dan harmoni — untuk tetap terhubung dengan orang lain dan menghindari pemisahan atau konflik.",
    },
    fear: {
      en: "Conflict, fragmentation, and being cut off from the people they love — losing their sense of inner calm.",
      id: "Konflik, fragmentasi, dan terputus dari orang-orang yang mereka cintai — kehilangan rasa ketenangan batin mereka.",
    },
    strengths: {
      en: ["Natural mediator and bridge-builder", "Inclusive — everyone feels heard and valued", "Calm, non-anxious presence under pressure", "Sees all sides without bias or agenda", "Holds diverse teams together with grace and steadiness"],
      id: ["Mediator alami dan pembangun jembatan", "Inklusif — semua orang merasa didengar dan dihargai", "Kehadiran yang tenang dan tidak cemas di bawah tekanan", "Melihat semua sisi tanpa bias atau agenda", "Menyatukan tim yang beragam dengan keanggunan dan kestabilan"],
    },
    blindspots: {
      en: ["Can lose themselves in others' agendas and forget their own", "Procrastination and disengagement from personal priorities", "Conflict avoidance allows problems to fester unaddressed", "May go along to avoid disruption even when they deeply disagree"],
      id: ["Bisa kehilangan diri dalam agenda orang lain dan melupakan mereka sendiri", "Menunda dan tidak terlibat dengan prioritas pribadi", "Penghindaran konflik membiarkan masalah membusuk tanpa ditangani", "Mungkin mengikuti untuk menghindari gangguan bahkan ketika mereka sangat tidak setuju"],
    },
    communication: {
      en: "Create space for them to share their view — they won't always volunteer it. Give them time to respond. Don't force quick decisions. And most importantly: ask them what they want, then actually wait for a real answer.",
      id: "Ciptakan ruang bagi mereka untuk berbagi pandangan mereka — mereka tidak selalu menawarkannya secara sukarela. Beri mereka waktu untuk merespons. Jangan paksakan keputusan cepat. Dan yang terpenting: tanyakan apa yang mereka inginkan, lalu benar-benar tunggu jawaban nyata.",
    },
    crossCultural: {
      en: "The Type 9's harmony-seeking is deeply valued in collectivist cultures. In individualistic cultures, their reluctance to assert their own view can be misread as indecision or lack of conviction. Growth edge: claiming their voice and being willing to disrupt the peace when justice or truth demands it.",
      id: "Pencarian harmoni Tipe 9 sangat dihargai dalam budaya kolektivis. Dalam budaya individualis, keengganan mereka untuk menegaskan pandangan mereka sendiri bisa disalahartikan sebagai ketidaktegasan atau kurangnya keyakinan. Tepi pertumbuhan: mengklaim suara mereka dan bersedia mengganggu kedamaian ketika keadilan atau kebenaran menuntutnya.",
    },
    wing8: {
      en: "9w8 — The Referee: More assertive and direct. Combines peacefulness with strength. Can step into conflict when necessary and advocate firmly, but always in service of harmony.",
      id: "9w8 — Si Wasit: Lebih asertif dan langsung. Memadukan ketenangan dengan kekuatan. Bisa melangkah ke dalam konflik ketika diperlukan dan mengadvokasi dengan kuat, tetapi selalu dalam pelayanan harmoni.",
    },
    wing1: {
      en: "9w1 — The Dreamer: More principled and idealistic. Combines the desire for peace with a quiet conviction about what's right. Often visionary in a gentle, long-term way.",
      id: "9w1 — Si Pemimpi: Lebih berprinsip dan idealis. Memadukan keinginan untuk damai dengan keyakinan yang tenang tentang apa yang benar. Sering visioner dengan cara yang lembut dan jangka panjang.",
    },
  },
];

// ── WING CALCULATION ──────────────────────────────────────────────────────────
// Adjacent types on the Enneagram circle: 1↔9↔8, 1↔2, 2↔3, 3↔4, 4↔5, 5↔6, 6↔7, 7↔8

function getAdjacentTypes(t: number): [number, number] {
  if (t === 1) return [9, 2];
  if (t === 9) return [8, 1];
  return [t - 1, t + 1] as [number, number];
}

function getWingDescription(primaryType: number, scores: Record<string, number>, lang: Lang): string | null {
  const [a, b] = getAdjacentTypes(primaryType);
  const scoreA = scores[String(a)] ?? 0;
  const scoreB = scores[String(b)] ?? 0;
  const wingType = scoreA >= scoreB ? a : b;
  const type = TYPES[primaryType - 1];
  if (!type) return null;
  const typeRecord = type as unknown as Record<string, unknown>;
  const wingKey = wingType === a ? `wing${a}` : `wing${b}`;
  const wingObj = typeRecord[wingKey];
  if (wingObj && typeof wingObj === "object") return (wingObj as T3)[lang] ?? null;
  return null;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

export default function EnneagramClient({
  isSaved: isSavedProp,
  savedType,
  savedScores,
}: {
  isSaved: boolean;
  savedType: number | null;
  savedScores: Record<string, number> | null;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const t = (obj: T3) => tFn(obj, lang);
  const [quizState, setQuizState] = useState<QuizState>(
    savedType && savedScores ? "done" : "idle"
  );
  const [currentIdx, setCurrentIdx] = useState(0); // index into QUESTION_ORDER
  // scores[t] = sum of ratings given for type t
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ questionIdx: number; value: number; type: number }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedType);
  const [expandedType, setExpandedType] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [resultFlipped, setResultFlipped] = useState(false);
  const [bgOpen, setBgOpen] = useState(false);

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(value: number) {
    const questionIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[questionIdx];
    const newScores = { ...scores, [String(q.t)]: (scores[String(q.t)] ?? 0) + value };
    const newHistory = [...answerHistory, { questionIdx, value, type: q.t }];
    if (currentIdx < QUESTION_ORDER.length - 1) {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setCurrentIdx(currentIdx + 1);
    } else {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setQuizState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (currentIdx === 0) return;
    const last = answerHistory[answerHistory.length - 1];
    const newScores = { ...scores, [String(last.type)]: (scores[String(last.type)] ?? 0) - last.value };
    setScores(newScores);
    setAnswerHistory(answerHistory.slice(0, -1));
    setCurrentIdx(currentIdx - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setResultSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      const r = await saveResourceToDashboard("enneagram");
      if (!r.error) setIsSaved(true);
    });
  }

  function handleSaveResult() {
    startTransition(async () => {
      await saveEnneagramResult(primaryType.number, scores);
      setResultSaved(true);
      trackAssessmentCompletion('enneagram');
    });
  }

  // Determine primary type (highest score)
  const sortedTypes = TYPES.slice().sort((a, b) => (scores[String(b.number)] ?? 0) - (scores[String(a.number)] ?? 0));
  const primaryType = sortedTypes[0];
  const wingDesc = quizState === "done" ? getWingDescription(primaryType.number, scores, lang) : null;
  const maxPossible = 25; // 5 questions × max rating 5

  const currentQuestion = quizState === "active" ? QUESTIONS[QUESTION_ORDER[currentIdx]] : null;
  const progressPct = Math.round((currentIdx / QUESTION_ORDER.length) * 100);

  const heroTagline = {
    en: "Understand the core motivations, fears, and growth paths that shape how you lead, relate, and grow.",
    id: "Pahami motivasi inti, ketakutan, dan jalur pertumbuhan yang membentuk cara Anda memimpin, berhubungan, dan berkembang.",
  };

  return (
    <>
      <LangToggle />
      {/* ── LANGUAGE TOGGLE ── */}

      {/* ── HERO ── */}
      <div style={{
        background: quizState === "done" ? primaryType.bg : "oklch(22% 0.10 260)",
        padding: "4rem 2rem 3.5rem",
        transition: "background 0.6s ease",
        position: "relative",
        overflow: "hidden",
      }}>
        {quizState !== "done" && <img src="/images/resources/enneagram/hero.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18, mixBlendMode: "luminosity", pointerEvents: "none" }} />}
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "3rem", alignItems: "flex-start", position: "relative" }}>
          <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: quizState === "done" ? primaryType.colorLight : "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            {t(UI.personalityAssessment)}
          </p>
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif", fontWeight: 600,
            fontSize: "clamp(40px, 6vw, 72px)",
            color: "oklch(97% 0.005 80)", lineHeight: 1.08,
            marginBottom: "1.25rem",
          }}>
            {quizState === "done"
              ? `Type ${primaryType.number} — ${t(primaryType.name)}`
              : t(UI.enneagram)}
          </h1>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "1.15rem", color: "oklch(66% 0.04 260)", lineHeight: 1.6, maxWidth: "52ch",
          }}>
            {quizState === "done"
              ? t(primaryType.tagline)
              : t(heroTagline)}
          </p>

          {quizState === "idle" && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={startQuiz}
                style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "oklch(65% 0.15 45)", color: "white",
                  border: "none", padding: "0.75rem 1.75rem", cursor: "pointer",
                }}
              >
                {t(UI.startAssessment)}
              </button>
              {!isSaved && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "transparent", color: "oklch(66% 0.04 260)",
                    border: "1px solid oklch(35% 0.04 260)", padding: "0.75rem 1.75rem",
                    cursor: "pointer", opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isSaved ? t(UI.saved) : t(UI.saveDashboard)}
                </button>
              )}
            </div>
          )}
          </div>

          {quizState === "idle" && (
            <img src="/enneagram-types/enneagram-wheel.png" alt="Enneagram Wheel" loading="lazy" style={{ width: "320px", height: "auto", opacity: 0.85, flexShrink: 0 }} />
          )}


          {quizState === "done" && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {!resultSaved && (
                <button
                  type="button"
                  onClick={handleSaveResult}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "oklch(65% 0.15 45)", color: "white",
                    border: "none", padding: "0.75rem 1.75rem", cursor: "pointer",
                    opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isPending ? t(UI.saving) : t(UI.saveMyResult)}
                </button>
              )}
              {resultSaved && (
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "oklch(62% 0.14 145)", padding: "0.75rem 0",
                }}>
                  {t(UI.resultSaved)}
                </p>
              )}
              <button
                type="button"
                onClick={retake}
                style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600,
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  background: "transparent", color: "oklch(55% 0.04 260)",
                  border: "1px solid oklch(35% 0.04 260)", padding: "0.75rem 1.5rem", cursor: "pointer",
                }}
              >
                {t(UI.retake)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── LEARNING OUTCOME ─────────────────────────────────────────────────── */}
      <div style={{ background: "oklch(22% 0.10 260)", padding: "clamp(48px, 7vw, 64px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: 24 }}>
            After This Module
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Describe your Enneagram type's core motivation, defining fear, and primary defensive pattern.",
              "Recognize how your type's characteristic behaviors may be shaped or filtered differently across cultural contexts.",
              "Use your type's wing and stress line to understand how you shift under pressure or in unfamiliar cross-cultural situations.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 3, height: 20, background: "oklch(65% 0.15 45)", flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 500, color: "oklch(72% 0.04 260)", lineHeight: 1.65, margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      {quizState === "done" && (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* Result Type Tile */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ height: "280px" }}>
              <TypeCard
                type={primaryType}
                lang={lang}
                isFlipped={resultFlipped}
                onClick={() => setResultFlipped(!resultFlipped)}
              />
            </div>
          </div>

          {/* Save result — prominent placement directly below the type card */}
          <div style={{ marginBottom: "3rem" }}>
            {!resultSaved ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleSaveResult}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", fontWeight: 800,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: primaryType.color, color: "white",
                    border: "none", padding: "1rem 2.25rem", cursor: "pointer",
                    opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isPending ? t(UI.saving) : t(UI.saveMyResult)}
                </button>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.006 260)", lineHeight: 1.5, margin: 0 }}>
                  {lang === "en" ? "Save your type to your dashboard to compare with your team." : lang === "id" ? "Simpan tipe Anda ke dashboard untuk dibandingkan dengan tim Anda." : "Sla uw type op in uw dashboard om het met uw team te vergelijken."}
                </p>
              </div>
            ) : (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(48% 0.14 145)", margin: 0 }}>
                {t(UI.resultSaved)}
              </p>
            )}
          </div>

          {/* Primary type overview */}
          <div style={{
            background: primaryType.colorVeryLight,
            padding: "2rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: primaryType.color, marginBottom: "0.75rem",
            }}>
              {t(UI.yourType)}
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.95rem", fontWeight: 400,
              color: "oklch(25% 0.008 260)", lineHeight: 1.75, maxWidth: "60ch",
            }}>
              {t(primaryType.overview)}
            </p>

            {wingDesc && (
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", fontWeight: 400,
                color: "oklch(40% 0.008 260)", lineHeight: 1.65, marginTop: "1rem",
                maxWidth: "60ch",
              }}>
                <strong style={{ fontWeight: 700, color: primaryType.color }}>{t(UI.wing)}</strong>
                {wingDesc}
              </p>
            )}
          </div>

          {/* All 9 scores */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(52% 0.008 260)", marginBottom: "1.25rem",
            }}>
              {t(UI.yourScoreProfile)}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {sortedTypes.map((st) => {
                const score = scores[String(st.number)] ?? 0;
                const pct = Math.round((score / maxPossible) * 100);
                const isPrimary = st.number === primaryType.number;
                return (
                  <div key={st.number} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{
                      width: "24px", flexShrink: 0,
                      fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: isPrimary ? 800 : 500,
                      color: isPrimary ? st.color : "oklch(52% 0.008 260)", textAlign: "right",
                    }}>
                      {st.number}
                    </div>
                    <div style={{ flex: 1, background: "oklch(90% 0.005 80)", height: "6px", position: "relative" }}>
                      <div style={{
                        position: "absolute", inset: 0, right: `${100 - pct}%`,
                        background: isPrimary ? st.color : "oklch(72% 0.008 260)",
                        transition: "right 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      }} />
                    </div>
                    <div style={{
                      width: "80px", flexShrink: 0,
                      fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
                      fontWeight: isPrimary ? 700 : 400,
                      color: isPrimary ? st.color : "oklch(55% 0.008 260)",
                    }}>
                      {t(st.name).replace(/^(The |De |Si )/i, "")}
                    </div>
                    <div style={{
                      width: "32px", flexShrink: 0, textAlign: "right",
                      fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
                      fontWeight: isPrimary ? 700 : 400,
                      color: isPrimary ? st.color : "oklch(58% 0.008 260)",
                    }}>
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core motivation + fear */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.coreMotivation)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: "oklch(28% 0.006 260)", lineHeight: 1.65 }}>{t(primaryType.motivation)}</p>
            </div>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.coreFear)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: "oklch(28% 0.006 260)", lineHeight: 1.65 }}>{t(primaryType.fear)}</p>
            </div>
          </div>

          {/* Strengths + blindspots */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(48% 0.14 145)", marginBottom: "0.75rem" }}>{t(UI.strengths)}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(primaryType.strengths[lang] as string[]).map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(52% 0.14 145)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>✓</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(52% 0.18 25)", marginBottom: "0.75rem" }}>{t(UI.growthAreas)}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(primaryType.blindspots[lang] as string[]).map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(55% 0.18 45)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>→</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Communication + cross-cultural */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.howToCommunicate)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7 }}>{t(primaryType.communication)}</p>
            </div>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.crossCulturalLeadership)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7 }}>{t(primaryType.crossCultural)}</p>
            </div>
          </div>

          {/* All 9 types grid */}
          <EnneagramTypesGrid types={TYPES} lang={lang} />
        </div>
      )}

      {/* ── BACKGROUND (idle) ── */}
      {quizState === "idle" && (
        <div id="quiz-section" style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* What is the Enneagram */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {t(UI.aboutAssessment)}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(18% 0.005 260)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "2rem" }}>
              {t(UI.whatIsEnneagram)}
            </h2>
            <img src="/enneagram-types/enneagram-wheel.png" alt="Enneagram Wheel" loading="lazy" style={{ width: "100%", maxWidth: "500px", height: "auto", display: "block", margin: "0 auto 2rem auto" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                {t(UI.enneagramP1)}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                {t(UI.enneagramP2)}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                {t(UI.enneagramP3)}
              </p>
            </div>
            <img src="/enneagram-types/overview.png" alt="Enneagram Overview" loading="lazy" style={{ width: "100%", maxWidth: "600px", marginTop: "2rem", borderRadius: "0.5rem" }} />
          </div>

          {/* Three Triads */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {t(UI.triadsTitle)}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Gut / Body Triad */}
              <div style={{ background: "oklch(97% 0.015 25)", padding: "1.5rem", borderLeft: "4px solid oklch(55% 0.18 25)" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(52% 0.18 25)", marginBottom: "0.375rem" }}>
                  {lang === "en" ? "Gut / Body Triad — Types 8, 9, 1" : lang === "id" ? "Triad Gut / Tubuh — Tipe 8, 9, 1" : "Gut / Lichaamstriade — Types 8, 9, 1"}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  {lang === "en"
                    ? "These three types lead from instinct and a gut-level sense of justice. They are action-oriented and deeply aware of power, fairness, and autonomy. When healthy, they act decisively and protect others. Under stress, their power turns inward as resentment, withdrawal, or control."
                    : lang === "id"
                    ? "Tiga tipe ini memimpin dari insting dan rasa keadilan yang mendalam. Mereka berorientasi tindakan dan sangat sadar akan kekuasaan, keadilan, dan otonomi. Dalam kondisi sehat, mereka bertindak tegas dan melindungi orang lain. Di bawah tekanan, kekuatan mereka berbalik ke dalam sebagai kemarahan, penarikan diri, atau kontrol."
                    : "Deze drie typen leiden vanuit instinct en een diep gevoel van rechtvaardigheid. Ze zijn actiegericht en sterk bewust van macht, eerlijkheid en autonomie. In gezonde staat handelen ze besluitvaardig en beschermen anderen. Onder druk keert hun kracht naar binnen als wrok, terugtrekking of controle."}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontStyle: "italic", fontSize: "0.82rem", color: "oklch(42% 0.006 260)", lineHeight: 1.65 }}>
                  {lang === "en"
                    ? "Biblical anchor: Moses — his gut energy confronted Pharaoh, struck the rock, and led a stiff-necked people through forty years of wilderness. His strength was God-given. His shadow was the same energy turned inward — the slow burn that cost him the Promised Land."
                    : lang === "id"
                    ? "Jangkar alkitabiah: Musa — energinya menghadapi Firaun, memukul batu karang, dan memimpin umat yang keras kepala selama empat puluh tahun di padang gurun. Kekuatannya diberikan Tuhan. Bayangannya adalah energi yang sama yang berbalik ke dalam — bara yang perlahan yang menghalanginya memasuki Tanah Perjanjian."
                    : "Bijbels anker: Mozes — zijn instinctieve energie confronteerde Farao, sloeg de rots en leidde een hardnekkig volk door veertig jaar woestijn. Zijn kracht was door God gegeven. Zijn schaduw was diezelfde energie naar binnen gericht — de sluimerende frustratie die hem het Beloofde Land kostte."}
                </p>
              </div>

              {/* Heart / Image Triad */}
              <div style={{ background: "oklch(97% 0.015 60)", padding: "1.5rem", borderLeft: "4px solid oklch(60% 0.18 60)" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(55% 0.18 60)", marginBottom: "0.375rem" }}>
                  {lang === "en" ? "Heart / Image Triad — Types 2, 3, 4" : lang === "id" ? "Triad Hati / Citra — Tipe 2, 3, 4" : "Hart / Beeldtriade — Types 2, 3, 4"}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  {lang === "en"
                    ? "These three types lead from emotion and a deep need to be loved, valued, and seen. They are relational and image-aware, shaped by questions of identity and worth. When healthy, they bring warmth, depth, and authentic connection. Under stress, they perform, manipulate, or withdraw into longing."
                    : lang === "id"
                    ? "Tiga tipe ini memimpin dari emosi dan kebutuhan mendalam untuk dicintai, dihargai, dan dilihat. Mereka relasional dan sadar citra, dibentuk oleh pertanyaan identitas dan nilai diri. Dalam kondisi sehat, mereka membawa kehangatan, kedalaman, dan koneksi yang autentik. Di bawah tekanan, mereka berpura-pura, memanipulasi, atau menarik diri ke dalam kerinduan."
                    : "Deze drie typen leiden vanuit emotie en een diep verlangen naar liefde, waardering en erkenning. Ze zijn relationeel en beeldgericht, gevormd door vragen van identiteit en eigenwaarde. In gezonde staat brengen ze warmte, diepgang en authentieke verbinding. Onder druk presteren ze, manipuleren ze of trekken ze zich terug in verlangen."}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontStyle: "italic", fontSize: "0.82rem", color: "oklch(42% 0.006 260)", lineHeight: 1.65 }}>
                  {lang === "en"
                    ? "Biblical anchor: David — he sang the psalms, danced before the ark, wept openly, and built his identity around being a man after God's own heart. His heart energy made him Israel's most beloved king. Its shadow took him into Bathsheba and the long damage of an image he could not let fall."
                    : lang === "id"
                    ? "Jangkar alkitabiah: Daud — ia menyanyikan mazmur, menari di hadapan tabut, menangis terbuka, dan membangun identitasnya sebagai orang yang berkenan di hati Tuhan. Energi hatinya menjadikannya raja Israel yang paling dicintai. Bayangannya membawanya ke Batsyeba dan kerusakan panjang dari citra yang tidak bisa ia biarkan jatuh."
                    : "Bijbels anker: David — hij zong de psalmen, danste voor de ark, huilde openlijk en bouwde zijn identiteit op als een man naar Gods hart. Zijn hartenergie maakte hem Israëls meest geliefde koning. De schaduw ervan leidde hem naar Bathseba en de lange schade van een imago dat hij niet kon laten vallen."}
                </p>
              </div>

              {/* Head / Thinking Triad */}
              <div style={{ background: "oklch(97% 0.01 220)", padding: "1.5rem", borderLeft: "4px solid oklch(52% 0.16 220)" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(48% 0.16 220)", marginBottom: "0.375rem" }}>
                  {lang === "en" ? "Head / Thinking Triad — Types 5, 6, 7" : lang === "id" ? "Triad Kepala / Pemikiran — Tipe 5, 6, 7" : "Hoofd / Denktriade — Types 5, 6, 7"}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  {lang === "en"
                    ? "These three types lead from analysis and a deep need for security and understanding. They are planners and thinkers, shaped by fear and the quest for certainty. When healthy, they bring wisdom, foresight, and genuine insight. Under stress, they over-analyse, isolate, or escape into distraction."
                    : lang === "id"
                    ? "Tiga tipe ini memimpin dari analisis dan kebutuhan mendalam akan keamanan dan pemahaman. Mereka adalah perencana dan pemikir, dibentuk oleh ketakutan dan pencarian kepastian. Dalam kondisi sehat, mereka membawa kebijaksanaan, pandangan ke depan, dan wawasan yang tulus. Di bawah tekanan, mereka terlalu menganalisis, mengisolasi diri, atau melarikan diri ke dalam distraksi."
                    : "Deze drie typen leiden vanuit analyse en een diep verlangen naar veiligheid en begrip. Ze zijn planners en denkers, gevormd door angst en de zoektocht naar zekerheid. In gezonde staat brengen ze wijsheid, vooruitziendheid en echte inzichten. Onder druk overanalyseren ze, isoleren ze zichzelf of vluchten ze in afleiding."}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontStyle: "italic", fontSize: "0.82rem", color: "oklch(42% 0.006 260)", lineHeight: 1.65 }}>
                  {lang === "en"
                    ? "Biblical anchor: Solomon — he asked God for wisdom and received understanding wider than the sand of the sea. He observed, analysed, named patterns, and wrote Ecclesiastes. His head energy gave the world Proverbs. Its shadow drove him into intellectual and political compromise that fractured the kingdom."
                    : lang === "id"
                    ? "Jangkar alkitabiah: Salomo — ia meminta hikmat kepada Tuhan dan menerima pemahaman yang lebih luas dari pasir di laut. Ia mengamati, menganalisis, menamai pola, dan menulis Pengkhotbah. Energi kepalanya memberikan dunia Amsal. Bayangannya mendorongnya ke dalam kompromi intelektual dan politik yang memecah kerajaan."
                    : "Bijbels anker: Salomo — hij vroeg God om wijsheid en ontving begrip wijder dan het zand der zee. Hij observeerde, analyseerde, benoemde patronen en schreef Prediker. Zijn hoofdenergie gaf de wereld Spreuken. De schaduw ervan dreef hem naar intellectuele en politieke compromissen die het koninkrijk versplinterden."}
                </p>
              </div>
            </div>
          </div>

          {/* Cross-cultural caveat */}
          <div style={{ background: "oklch(96% 0.025 75)", padding: "1.5rem 1.75rem", marginBottom: "3rem", borderLeft: "4px solid oklch(65% 0.15 75)", outline: "1px solid oklch(88% 0.02 75)" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(55% 0.15 75)", marginBottom: "0.625rem" }}>
              {t(UI.caveatTitle)}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.75 }}>
              {t(UI.caveatBody)}
            </p>
          </div>

          {/* How to read your result */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {t(UI.howToReadTitle)}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {([UI.howToRead1, UI.howToRead2, UI.howToRead3] as T3[]).map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, width: "28px", height: "28px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "oklch(17% 0.12 260)", color: "white",
                    fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700,
                  }}>{i + 1}</span>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7, margin: 0 }}>
                    {t(tip)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* The 9 types with card flip */}
          <EnneagramTypesGrid types={TYPES} lang={lang} />

          {/* How to take it */}
          <div style={{ background: "oklch(97% 0.01 50)", padding: "1.75rem 2rem", marginBottom: "2.5rem", outline: "1px solid oklch(88% 0.008 80)" }}>
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", marginBottom: "1rem" }}>{t(UI.howToTake)}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {([UI.tip1, UI.tip2, UI.tip3, UI.tip4, UI.tip5] as T3[]).map((tip, i) => (
                <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(30% 0.006 260)", lineHeight: 1.5 }}>{t(tip)}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={startQuiz}
            style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: "oklch(65% 0.15 45)", color: "white",
              border: "none", padding: "0.875rem 2.25rem", cursor: "pointer",
            }}
          >
            {t(UI.startAssessment)}
          </button>
        </div>
      )}

      {/* ── QUIZ ── */}
      {quizState === "active" && currentQuestion && (
        <div id="quiz-section" style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* Progress */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(52% 0.008 260)" }}>
                {lang === "en" ? `Question ${currentIdx + 1} of ${QUESTION_ORDER.length}` : lang === "id" ? `Pertanyaan ${currentIdx + 1} dari ${QUESTION_ORDER.length}` : `Vraag ${currentIdx + 1} van ${QUESTION_ORDER.length}`}
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
                {progressPct}%
              </span>
            </div>
            <div style={{ height: "3px", background: "oklch(88% 0.006 80)" }}>
              <div style={{
                height: "100%", width: `${progressPct}%`,
                background: "oklch(65% 0.15 45)",
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Statement */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {t(UI.howMuch)}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "1.0625rem", color: "oklch(18% 0.005 260)", lineHeight: 1.65 }}>
              &ldquo;{currentQuestion[lang]}&rdquo;
            </p>
          </div>

          {/* Likert scale */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
            {SCALE_LABELS.map((labelObj, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAnswer(value)}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.875rem 1.25rem",
                    background: "white",
                    border: "1.5px solid oklch(86% 0.006 80)",
                    cursor: "pointer", textAlign: "left",
                    transition: "border-color 0.15s ease, background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(65% 0.15 45)";
                    (e.currentTarget as HTMLButtonElement).style.background = "oklch(99% 0.015 50)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(86% 0.006 80)";
                    (e.currentTarget as HTMLButtonElement).style.background = "white";
                  }}
                >
                  <span style={{
                    width: "24px", height: "24px", flexShrink: 0, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    background: "oklch(93% 0.005 80)",
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    color: "oklch(45% 0.008 260)",
                  }}>{value}</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 400, color: "oklch(25% 0.006 260)" }}>
                    {t(labelObj)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Back */}
          {currentIdx > 0 && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 600,
                letterSpacing: "0.06em", background: "none", border: "none",
                color: "oklch(55% 0.008 260)", cursor: "pointer", textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {t(UI.back)}
            </button>
          )}
        </div>
      )}

      {/* ─── KEY TAKEAWAY ──────────────────────────────────────────────────── */}
      <div style={{ background: "oklch(97% 0.005 80)", padding: "clamp(64px, 9vw, 88px) 24px", borderTop: "3px solid oklch(65% 0.15 45)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: 12 }}>
            Key Takeaway
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 800, color: "oklch(22% 0.10 260)", marginBottom: 36 }}>
            Three things to act on this week
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Read the full description for your Enneagram type — focus especially on the shadow, the core fear, and the stress line rather than only the strengths.",
              "Identify one moment from the past week where your type's core motivation shaped a decision or reaction. Name it honestly to yourself rather than reframing it positively.",
              "Share your type with one trusted colleague and ask what they observe in you — including where the description may not fully capture how you show up in your specific cultural context.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", background: "oklch(95% 0.008 80)" }}>
                <div style={{ width: 3, alignSelf: "stretch", background: "oklch(65% 0.15 45)", flexShrink: 0 }} />
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 500, color: "oklch(38% 0.05 260)", lineHeight: 1.75, margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LONG-FORM SEO SECTION ──────────────────────────────────────────── */}
      <div style={{ background: "oklch(95% 0.008 80)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            Background
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "oklch(22% 0.10 260)", marginBottom: 32, lineHeight: 1.2 }}>
            Understanding the Enneagram for Christian Leaders: Types, Motivations, and the Cultural Layer
          </h2>
          <button
            onClick={() => setBgOpen(!bgOpen)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 20, marginBottom: 24, padding: "10px 20px",
              background: "transparent", border: "1.5px solid oklch(65% 0.15 45)",
              color: "oklch(65% 0.15 45)", borderRadius: 12,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.04em",
            }}
          >
            {bgOpen ? "Close ↑" : "Read the research →"}
          </button>
          {bgOpen && [
            "The Enneagram for Christian leaders has become one of the more widely discussed personality frameworks in faith-based and cross-cultural ministry contexts over the past decade. It arrives not as a neutral behavioral tool but as a system that attempts to describe what lies underneath behavior — the motivating fear or desire that shapes how a person engages with work, leadership, relationships, and conflict. That depth is both its appeal and the source of the genuine debate it has generated in some theological circles.",
            "The nine Enneagram types — Reformer, Helper, Achiever, Individualist, Investigator, Loyalist, Enthusiast, Challenger, Peacemaker — each describe a core concern that a person organizes their life around, often below the level of conscious awareness. A Type 2 (Helper) is not simply someone who likes helping people. The Enneagram's description goes further: the Helper's core fear is that they are unlovable in themselves, and their helpfulness is often a way of securing connection and belonging through being needed. Understanding that layer does not reduce a person to a psychological category. Used well, it invites honest self-reflection: where does this pattern serve me and others, and where does it create problems I have not fully admitted?",
            "Ian Morgan Cron and Suzanne Stabile, whose book The Road Back to You⁵ brought the Enneagram to a wide Christian readership, frame the system explicitly as a tool for self-knowledge in service of spiritual growth. Christopher Heuertz, in The Sacred Enneagram,⁶ roots it in contemplative Christian tradition and centers it on the question of what it means to find one's way back to one's true self in God. Both approaches treat the framework as observational rather than prescriptive — a map, not a destination.",
            "The caution that is worth naming directly for Christian leaders is this: some of the historical and metaphysical claims made about the Enneagram's origins are disputed, and some associated teachers and ideas fall outside mainstream evangelical theology. This is a legitimate concern, and leaders who have reservations about those dimensions should not feel pressured to use the framework. What is less contestable is that the observational descriptions of the nine types have resonance for many people across very different backgrounds — which suggests that whatever its origins, it is touching something real about human patterns of fear, desire, and defense.",
            "For cross-cultural leadership teams, the Enneagram introduces an additional layer that most resources do not address adequately: the way types express themselves differently across cultural contexts. This matters because the Enneagram was largely developed and popularized in North American and European contexts, which means the typical type descriptions are written with those cultural norms embedded in them. A Type 8 (Challenger) is described as assertive, confrontational, and direct — someone who names the power dynamics in the room and is not afraid of conflict. In a Dutch or German professional culture, this description fits well. Directness is the norm, challenge is accepted as healthy, and power is something to be questioned rather than deferred to.",
            "In an Indonesian team culture, or a Kenyan organizational context, the same Type 8 energy does not typically present the same way. The cultural norms around deference, face-saving, and relational harmony shape how assertiveness gets expressed. A Type 8 leader in a high-power-distance context may lead with strong personal authority and strategic decisiveness, but rarely through open confrontation in group settings. The core motivation — a drive to protect themselves and others from being controlled, and to engage life with full force — is the same. The behavioral expression is filtered through a different cultural grammar.",
            "This is not a critique of the Enneagram as a framework. It is an invitation to hold it with appropriate nuance. The current research on whether Enneagram types manifest differently across cultures is limited, and any strong claims in this area should be treated carefully. What is more certain is that cultural context shapes which aspects of a type's description are most visible in public and which are kept more private. Helping a cross-cultural team understand this distinction — between the type's underlying motivation and its culturally-shaped expression — deepens the quality of the self-awareness the tool is meant to produce.",
            "Practically, the most useful question a cross-cultural leader can ask when introducing the Enneagram to a team is not \"what type are you?\" but \"how do you recognize yourself in this description — and where does it not quite fit?\" That second question opens space for the cultural layer. A Filipino team member may recognize themselves as a Type 9 (Peacemaker) but note that the type's characteristic conflict avoidance looks different in their context than it does in the American description: it is not conflict-avoidance out of discomfort, but relational wisdom about when speaking is helpful and when it is not.",
            "The Enneagram's value for Christian leaders is not primarily diagnostic. It is that honest reckoning with one's own patterns — the reflexes, the defensive moves, the places where fear rather than faith is driving decisions — is a form of humility that good leadership requires. Paul's language in Romans 12 about not thinking more highly of oneself than one ought to think, with sober judgment, has practical shape. The Enneagram is one tool for developing that sober judgment in a way that is honest about both the gift and the shadow of one's own design.",
            "For field workers and cross-cultural leaders who carry the particular pressures of adapting constantly to unfamiliar contexts, the Enneagram can also be a useful lens for understanding stress responses. The stress lines of each type describe where a person tends to go under sustained pressure — and those patterns are often the ones that create the most friction in cross-cultural teams, because they operate below awareness and are exaggerated by disorientation. A leader who knows that under stress their Type 3 energy collapses into disengaged Type 9 behaviors can name it when they see it happening, and invite their team to help them course-correct.",
          ].map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: "oklch(38% 0.05 260)", lineHeight: 1.85, marginBottom: 20 }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* --- SOURCES ---------------------------------------------------------- */}
      <SourcesDropdown sources={[
        "Oscar Ichazo — originator of the modern Enneagram of Personality system (Arica Institute, 1960s–1970s)",
        "Claudio Naranjo — Character and Neurosis: An Enneagram-Based Investigation (Gateways Books, 1994)",
        "Don Richard Riso & Russ Hudson — The Wisdom of the Enneagram (Bantam Books, 1999); Personality Types (Houghton Mifflin, rev. ed., 1996)",
        "Richard Rohr & Andreas Ebert — The Enneagram: A Christian Perspective (Crossroad Publishing, 2001)",
        "Ian Morgan Cron & Suzanne Stabile — The Road Back to You: An Enneagram Journey to Self-Discovery (IVP Books, 2016)",
        "Christopher Heuertz — The Sacred Enneagram: Finding Your Unique Path to Spiritual Growth (Zondervan, 2017)",
      ]} lang={lang} />
    </>
  );
}
