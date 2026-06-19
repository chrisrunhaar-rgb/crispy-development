"use client";

import { useState, useTransition, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveDISCResult } from "../actions";
import { trackAssessmentCompletion } from "@/lib/ga-events";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

// -- ASSESSMENT DATA -----------------------------------------------------------------

const SHUFFLE_ORDERS: number[][] = [
  [2,0,3,1],[0,2,1,3],[3,1,0,2],[1,3,2,0],[2,1,0,3],
  [0,3,1,2],[3,0,2,1],[1,2,3,0],[2,3,1,0],[0,1,3,2],
  [3,2,0,1],[1,0,2,3],[2,0,1,3],[0,3,2,1],[3,1,2,0],
  [1,2,0,3],[0,1,2,3],[2,3,0,1],[3,0,1,2],[1,3,0,2],
  [0,2,3,1],[2,1,3,0],[3,2,1,0],[1,0,3,2],
];

const QS = [
  { en: "When starting a new project, your first priority is:", id: "Saat memulai proyek baru, prioritas pertama Anda adalah:", options: [
    { en: "Define the goal and get moving immediately.", id: "Menetapkan tujuan dan segera bergerak.", t: "D" },
    { en: "Build energy and excitement with the team.", id: "Membangun semangat dan antusias bersama tim.", t: "I" },
    { en: "Ensure everyone understands their role and feels included.", id: "Memastikan semua orang memahami perannya dan merasa dilibatkan.", t: "S" },
    { en: "Gather all relevant information and create a thorough plan.", id: "Mengumpulkan semua informasi relevan dan membuat rencana yang menyeluruh.", t: "C" },
  ]},
  { en: "In a team meeting that's running off track, you tend to:", id: "Dalam rapat tim yang berjalan tidak sesuai rencana, Anda cenderung:", options: [
    { en: "Redirect the conversation directly and push for a decision.", id: "Langsung mengarahkan kembali diskusi dan mendorong pengambilan keputusan.", t: "D" },
    { en: "Re-energise the group and lighten the atmosphere.", id: "Membangkitkan energi kelompok dan mencairkan suasana.", t: "I" },
    { en: "Support whoever tries to get things back on track.", id: "Mendukung siapa pun yang berusaha mengembalikan rapat ke jalur yang benar.", t: "S" },
    { en: "Identify the root cause and propose a structured agenda.", id: "Mengidentifikasi akar masalah dan mengusulkan agenda yang terstruktur.", t: "C" },
  ]},
  { en: "When giving feedback to a colleague, you tend to:", id: "Ketika memberikan umpan balik kepada rekan kerja, Anda cenderung:", options: [
    { en: "Be direct and get straight to the point.", id: "Langsung pada intinya tanpa basa-basi.", t: "D" },
    { en: "Frame it positively and focus on encouragement.", id: "Menyampaikannya secara positif dengan fokus pada dorongan semangat.", t: "I" },
    { en: "Find a private moment and deliver it gently.", id: "Mencari waktu yang tepat dan menyampaikannya dengan lembut.", t: "S" },
    { en: "Prepare thoroughly and give specific, evidence-based input.", id: "Mempersiapkan dengan matang dan memberikan masukan yang spesifik berbasis fakta.", t: "C" },
  ]},
  { en: "Under pressure, others would most likely describe you as:", id: "Di bawah tekanan, orang lain kemungkinan besar akan menggambarkan Anda sebagai:", options: [
    { en: "Decisive and assertive.", id: "Tegas dan berani mengambil sikap.", t: "D" },
    { en: "Energetic and optimistic.", id: "Energik dan optimistis.", t: "I" },
    { en: "Calm and steady.", id: "Tenang dan stabil.", t: "S" },
    { en: "Careful and detail-focused.", id: "Hati-hati dan fokus pada detail.", t: "C" },
  ]},
  { en: "You are most motivated by:", id: "Anda paling termotivasi oleh:", options: [
    { en: "Winning, achieving results, and overcoming challenges.", id: "Meraih kemenangan, mencapai hasil, dan mengatasi tantangan.", t: "D" },
    { en: "Connecting with others, recognition, and creative freedom.", id: "Terhubung dengan orang lain, pengakuan, dan kebebasan berkreasi.", t: "I" },
    { en: "Harmony, security, and genuinely helping those around you.", id: "Keharmonisan, rasa aman, dan benar-benar membantu orang-orang di sekitar Anda.", t: "S" },
    { en: "Accuracy, quality, and doing things the right way.", id: "Akurasi, kualitas, dan melakukan segala sesuatu dengan benar.", t: "C" },
  ]},
  { en: "When you disagree with a leadership decision, you:", id: "Ketika Anda tidak setuju dengan keputusan pimpinan, Anda:", options: [
    { en: "Speak up immediately and challenge it directly.", id: "Langsung berbicara dan menantang keputusan tersebut secara langsung.", t: "D" },
    { en: "Talk to others about it and try to build consensus.", id: "Membicarakannya dengan orang lain dan mencoba membangun konsensus.", t: "I" },
    { en: "Quietly follow through while hoping things improve.", id: "Diam-diam menjalankannya sambil berharap keadaan akan membaik.", t: "S" },
    { en: "Document your concerns and present your reasoning carefully.", id: "Mendokumentasikan kekhawatiran Anda dan menyampaikan alasan dengan cermat.", t: "C" },
  ]},
  { en: "In a cross-cultural team, your natural contribution is:", id: "Dalam tim lintas budaya, kontribusi alami Anda adalah:", options: [
    { en: "Setting a clear direction and making fast decisions.", id: "Menetapkan arah yang jelas dan membuat keputusan cepat.", t: "D" },
    { en: "Creating connection and breaking down social barriers.", id: "Membangun koneksi dan meruntuhkan hambatan sosial.", t: "I" },
    { en: "Creating a safe environment where everyone feels included.", id: "Menciptakan lingkungan yang aman di mana semua orang merasa dilibatkan.", t: "S" },
    { en: "Ensuring quality and attention to important cultural details.", id: "Memastikan kualitas dan memperhatikan detail budaya yang penting.", t: "C" },
  ]},
  { en: "When a plan changes unexpectedly, you:", id: "Ketika rencana berubah secara tiba-tiba, Anda:", options: [
    { en: "Adapt quickly and find a new path forward.", id: "Beradaptasi dengan cepat dan menemukan jalan baru ke depan.", t: "D" },
    { en: "Look for the positive angle and keep the team's spirits up.", id: "Mencari sisi positifnya dan menjaga semangat tim.", t: "I" },
    { en: "Need time to process the change before fully committing.", id: "Membutuhkan waktu untuk memproses perubahan sebelum sepenuhnya berkomitmen.", t: "S" },
    { en: "Want to understand fully why it changed before accepting it.", id: "Ingin memahami sepenuhnya mengapa perubahan terjadi sebelum menerimanya.", t: "C" },
  ]},
  { en: "You are most frustrated when:", id: "Anda paling frustrasi ketika:", options: [
    { en: "Decisions drag on and things move too slowly.", id: "Keputusan berlarut-larut dan segalanya berjalan terlalu lambat.", t: "D" },
    { en: "The atmosphere is cold and people don't engage.", id: "Suasana dingin dan orang-orang tidak mau terlibat.", t: "I" },
    { en: "There is constant conflict or instability in the team.", id: "Ada konflik yang terus-menerus atau ketidakstabilan dalam tim.", t: "S" },
    { en: "Work is done carelessly or without attention to quality.", id: "Pekerjaan dilakukan dengan sembarangan atau tanpa memperhatikan kualitas.", t: "C" },
  ]},
  { en: "When presenting ideas, you prefer to:", id: "Ketika mempresentasikan ide, Anda lebih suka:", options: [
    { en: "Be brief, direct, and confident.", id: "Singkat, langsung, dan penuh keyakinan.", t: "D" },
    { en: "Be engaging, enthusiastic, and use stories.", id: "Menarik, penuh semangat, dan menggunakan cerita.", t: "I" },
    { en: "Check with others first and present collaboratively.", id: "Berkonsultasi dengan orang lain terlebih dahulu dan mempresentasikan secara kolaboratif.", t: "S" },
    { en: "Prepare thoroughly with data and a clear structure.", id: "Mempersiapkan dengan matang menggunakan data dan struktur yang jelas.", t: "C" },
  ]},
  { en: "Others come to you most often for:", id: "Orang lain paling sering datang kepada Anda untuk:", options: [
    { en: "Quick decisions and solving problems.", id: "Keputusan cepat dan pemecahan masalah.", t: "D" },
    { en: "Energy, ideas, and encouragement.", id: "Energi, ide, dan semangat.", t: "I" },
    { en: "Support, stability, and a listening ear.", id: "Dukungan, stabilitas, dan telinga yang siap mendengarkan.", t: "S" },
    { en: "Accuracy, analysis, and careful thinking.", id: "Akurasi, analisis, dan pemikiran yang cermat.", t: "C" },
  ]},
  { en: "In a new team, your role naturally becomes:", id: "Dalam tim baru, peran Anda secara alami menjadi:", options: [
    { en: "The one who sets the pace and direction.", id: "Orang yang menetapkan tempo dan arah.", t: "D" },
    { en: "The one who creates connections and builds energy.", id: "Orang yang membangun koneksi dan menciptakan energi.", t: "I" },
    { en: "The one who ensures no one is left behind.", id: "Orang yang memastikan tidak ada yang tertinggal.", t: "S" },
    { en: "The one who catches errors and ensures quality.", id: "Orang yang menangkap kesalahan dan memastikan kwaliteit.", t: "C" },
  ]},
  { en: "When someone on your team makes a mistake, you:", id: "Ketika seseorang di tim Anda membuat kesalahan, Anda:", options: [
    { en: "Address it quickly and directly.", id: "Menanganinya dengan cepat dan langsung.", t: "D" },
    { en: "Turn it into a learning moment with a positive framing.", id: "Mengubahnya menjadi momen belajar dengan bingkai yang positif.", t: "I" },
    { en: "Handle it privately and protect their dignity.", id: "Menanganinya secara pribadi dan menjaga martabat mereka.", t: "S" },
    { en: "Analyse what went wrong to prevent it happening again.", id: "Menganalisis apa yang salah untuk mencegah hal itu terulang.", t: "C" },
  ]},
  { en: "Your preferred working pace is:", id: "Tempo kerja pilihan Anda adalah:", options: [
    { en: "Fast and decisive.", id: "Cepat dan tegas.", t: "D" },
    { en: "Dynamic and collaborative.", id: "Dinamis dan kolaboratif.", t: "I" },
    { en: "Steady and predictable.", id: "Stabil dan dapat diprediksi.", t: "S" },
    { en: "Methodical and thorough.", id: "Metodis dan menyeluruh.", t: "C" },
  ]},
  { en: "When dealing with conflict, you:", id: "Ketika menghadapi konflik, Anda:", options: [
    { en: "Address it head-on and resolve it immediately.", id: "Menghadapinya langsung dan menyelesaikannya segera.", t: "D" },
    { en: "Try to smooth things over and restore the relationship.", id: "Berusaha meredakan ketegangan dan memulihkan hubungan.", t: "I" },
    { en: "Avoid it if possible and hope it resolves naturally.", id: "Menghindarinya jika memungkinkan dan berharap itu selesai dengan sendirinya.", t: "S" },
    { en: "Gather all the facts first, then address it logically.", id: "Mengumpulkan semua fakta terlebih dahulu, lalu menanganinya secara logis.", t: "C" },
  ]},
  { en: "When faced with a long to-do list, you:", id: "Ketika menghadapi daftar tugas yang panjang, Anda:", options: [
    { en: "Prioritise ruthlessly and power through the most important items.", id: "Memprioritaskan dengan tegas dan mengerjakan hal-hal terpenting.", t: "D" },
    { en: "Work best when others are around to keep the energy up.", id: "Bekerja paling baik ketika ada orang lain di sekitar untuk menjaga semangat.", t: "I" },
    { en: "Work through it steadily, one task at a time.", id: "Mengerjakannya secara stabil, satu tugas demi satu.", t: "S" },
    { en: "Create a structured system and track everything carefully.", id: "Membuat sistem yang terstruktur dan melacak semuanya dengan cermat.", t: "C" },
  ]},
  { en: "When learning something new, you prefer:", id: "Ketika mempelajari sesuatu yang baru, Anda lebih suka:", options: [
    { en: "A brief overview, then diving straight in hands-on.", id: "Gambaran singkat, lalu langsung terjun melakukannya.", t: "D" },
    { en: "Interactive group sessions with discussion and shared energy.", id: "Sesi kelompok interaktif dengan diskusi dan semangat bersama.", t: "I" },
    { en: "Step-by-step guidance with plenty of time to practice.", id: "Panduan langkah demi langkah dengan banyak waktu untuk berlatih.", t: "S" },
    { en: "Thorough documentation and deep understanding before starting.", id: "Dokumentasi menyeluruh dan pemahaman mendalam sebelum memulai.", t: "C" },
  ]},
  { en: "When someone disagrees with your idea, you:", id: "Ketika seseorang tidak setuju dengan ide Anda, Anda:", options: [
    { en: "Stand your ground unless they give compelling evidence.", id: "Tetap pada pendirian Anda kecuali mereka memberikan bukti yang meyakinkan.", t: "D" },
    { en: "Try to win them over through enthusiasm and persuasion.", id: "Berusaha memenangkan mereka melalui antusiasme dan persuasi.", t: "I" },
    { en: "Listen carefully and often adapt your position.", id: "Mendengarkan dengan saksama dan sering kali menyesuaikan posisi Anda.", t: "S" },
    { en: "Welcome specific objections and adjust your thinking accordingly.", id: "Menyambut keberatan yang spesifik dan menyesuaikan pemikiran Anda.", t: "C" },
  ]},
  { en: "Your leadership style is best described as:", id: "Gaya kepemimpinan Anda paling baik digambarkan sebagai:", options: [
    { en: "Driving toward results with clear expectations.", id: "Mendorong ke arah hasil dengan ekspektasi yang jelas.", t: "D" },
    { en: "Inspiring and motivating through energy and vision.", id: "Menginspirasi dan memotivasi melalui energi dan visi.", t: "I" },
    { en: "Supporting and developing people with patience.", id: "Mendukung dan mengembangkan orang-orang dengan sabar.", t: "S" },
    { en: "Leading through expertise, precision, and high standards.", id: "Memimpin melalui keahlian, ketepatan, dan standar yang tinggi.", t: "C" },
  ]},
  { en: "In a crisis, your instinct is to:", id: "Dalam situasi krisis, naluri Anda adalah:", options: [
    { en: "Take immediate control and start making decisions.", id: "Langsung mengambil kendali dan mulai membuat keputusan.", t: "D" },
    { en: "Rally people together and maintain positive energy.", id: "Menyatukan orang-orang dan mempertahankan energi positif.", t: "I" },
    { en: "Stay calm and provide stability to those around you.", id: "Tetap tenang dan memberikan stabilitas kepada orang-orang di sekitar Anda.", t: "S" },
    { en: "Assess the situation carefully and systematically before acting.", id: "Menilai situasi secara cermat dan sistematis sebelum bertindak.", t: "C" },
  ]},
  { en: "You feel a task is complete when:", id: "Anda merasa sebuah tugas selesai ketika:", options: [
    { en: "The goal is achieved — results matter most.", id: "Tujuan tercapai — hasil adalah yang terpenting.", t: "D" },
    { en: "The process was engaging and the team feels good about it.", id: "Prosesnya menyenangkan dan tim merasa puas dengannya.", t: "I" },
    { en: "Everyone involved feels good about how it went.", id: "Semua orang yang terlibat merasa baik tentang jalannya pekerjaan.", t: "S" },
    { en: "Every detail has been checked and the quality is right.", id: "Setiap detail telah diperiksa dan kualitasnya sudah benar.", t: "C" },
  ]},
  { en: "Others sometimes see you as:", id: "Orang lain terkadang melihat Anda sebagai:", options: [
    { en: "Too blunt or impatient.", id: "Terlalu blak-blakan atau tidak sabar.", t: "D" },
    { en: "Too talkative or disorganised.", id: "Terlalu banyak bicara atau kurang terorganisir.", t: "I" },
    { en: "Too slow to take initiative or overly accommodating.", id: "Terlalu lambat mengambil inisiatif atau terlalu mudah mengalah.", t: "S" },
    { en: "Too critical or overly cautious.", id: "Terlalu kritis atau terlalu berhati-hati.", t: "C" },
  ]},
  { en: "You feel most alive in your work when:", id: "Anda merasa paling bersemangat dalam pekerjaan Anda ketika:", options: [
    { en: "You're winning and seeing measurable results.", id: "Anda meraih kemenangan dan melihat hasil yang terukur.", t: "D" },
    { en: "You're inspiring people and creating real momentum.", id: "Anda menginspirasi orang-orang dan menciptakan momentum nyata.", t: "I" },
    { en: "You're making a genuine difference in someone's life.", id: "Anda membuat perbedaan nyata dalam kehidupan seseorang.", t: "S" },
    { en: "You've solved a complex problem with care and precision.", id: "Anda telah memecahkan masalah yang kompleks dengan teliti dan tepat.", t: "C" },
  ]},
  { en: "When closing out a project, you focus most on:", id: "Ketika menyelesaikan sebuah proyek, Anda paling berfokus pada:", options: [
    { en: "Did we hit the target?", id: "Apakah kita mencapai target?", t: "D" },
    { en: "Did the team enjoy the process and celebrate the win?", id: "Apakah tim menikmati prosesnya dan merayakan keberhasilan?", t: "I" },
    { en: "Is everyone OK? Does anyone need additional support?", id: "Apakah semua orang baik-baik saja? Apakah ada yang membutuhkan dukungan tambahan?", t: "S" },
    { en: "Were all quality standards met? What can we improve next time?", id: "Apakah semua standar kualitas terpenuhi? Apa yang bisa kita tingkatkan lain kali?", t: "C" },
  ]},
];

// -- DISC TYPE DATA ------------------------------------------------------------

const DISC_TYPES = [
  {
    key: "D",
    label: { en: "Dominance", id: "Dominance" },
    tagline: { en: "Direct. Bold. Results-driven.", id: "Langsung. Berani. Berorientasi Hasil." },
    color: "oklch(52% 0.27 25)",
    colorLight: "oklch(62% 0.22 25)",
    colorVeryLight: "oklch(96% 0.05 25)",
    bg: "oklch(18% 0.15 25)",
    overview: {
      en: "The D-type leader is direct, competitive, and driven by results. They make decisions quickly, take charge under pressure, and thrive in environments where they can set direction and drive outcomes. They are natural initiators who cut through complexity and act.",
      id: "Pemimpin tipe D bersifat langsung, kompetitif, dan didorong oleh hasil. Mereka mengambil keputusan dengan cepat, mengambil kendali di bawah tekanan, dan berkembang di lingkungan di mana mereka dapat menentukan arah dan mendorong hasil. Mereka adalah inisiator alami yang memotong kompleksitas dan segera bertindak.",
    },
    motivation: {
      en: "Results, control, challenges, and the freedom to lead without restriction.",
      id: "Hasil, kendali, tantangan, dan kebebasan untuk memimpin tanpa batasan.",
    },
    fear: {
      en: "Being taken advantage of, losing control, or appearing weak.",
      id: "Dimanfaatkan, kehilangan kendali, atau terlihat lemah.",
    },
    strengths: {
      en: ["Decisive under pressure", "Goal-oriented and focused", "Drives results quickly", "Natural initiator", "Tackles challenges head-on"],
      id: ["Tegas di bawah tekanan", "Berorientasi tujuan dan fokus", "Mendorong hasil dengan cepat", "Inisiator alami", "Menghadapi tantangan secara langsung"],
    },
    blindspots: {
      en: ["Can be too blunt or intimidating", "May steamroll others' input", "Impatient with slower processes", "Can prioritise outcomes over people"],
      id: ["Bisa terlalu blak-blakan atau mengintimidasi", "Mungkin mengabaikan masukan orang lain", "Tidak sabar dengan proses yang lebih lambat", "Bisa memprioritaskan hasil di atas orang"],
    },
    communication: {
      en: "Be direct. Lead with the bottom line. Keep it brief and respect their time. Avoid long explanations and get to the point immediately.",
      id: "Bersikap langsung. Mulai dengan intinya. Tetap ringkas dan hormati waktu mereka. Hindari penjelasan panjang dan langsung pada intinya.",
    },
    crossCultural: {
      en: "In high-context cultures, the D-type's directness can feel aggressive or disrespectful. Learning to slow down, read the room, and allow indirect communication to unfold is a key growth area in cross-cultural contexts.",
      id: "Dalam budaya high-context, kecenderungan langsung tipe D bisa terasa agresif atau tidak sopan. Belajar untuk memperlambat, membaca situasi, dan membiarkan komunikasi tidak langsung berkembang adalah area pertumbuhan utama dalam konteks lintas budaya.",
    },
    biblical: {
      name: "Paul",
      text: "Paul was the prototypical D-leader. He pushed mission forward fast, planted churches across the Roman world, and was unafraid to confront — even Peter to his face. His drive launched the gospel into new cultures. His growth edge? Learning to lead without crushing his coworkers (Mark, John). Drive needs grace.",
    },
    digDeeper: {
      en: "In a high-context team (Indonesia, Levantine contexts, Japan), your directness can read as disrespect before you have said anything offensive. The skill is not softening your message — it is slowing your timeline. The same goal, arrived at through a longer road, often gets further faster. Watch what happens in your team when you let silence run three seconds longer than is comfortable for you.",
      id: "Dalam tim high-context (Indonesia, konteks Levant, Jepang), ketegasanmu dapat dibaca sebagai ketidakhormatan sebelum kamu mengatakan sesuatu yang menyinggung. Keterampilannya bukan memperhalus pesanmu — melainkan memperlambat jadwalmu. Tujuan yang sama, dicapai melalui jalan yang lebih panjang, seringkali lebih jauh lebih cepat. Perhatikan apa yang terjadi dalam timmu ketika kamu membiarkan keheningan berlangsung tiga detik lebih lama dari yang nyaman bagimu.",
    },
  },
  {
    key: "I",
    label: { en: "Influence", id: "Influence" },
    tagline: { en: "Enthusiastic. Persuasive. People-first.", id: "Antusias. Persuasif. Mengutamakan Orang." },
    color: "oklch(62% 0.22 87)",
    colorLight: "oklch(72% 0.18 87)",
    colorVeryLight: "oklch(96% 0.04 87)",
    bg: "oklch(18% 0.12 80)",
    overview: {
      en: "The I-type leader is enthusiastic, expressive, and energised by people. They are gifted communicators who inspire others, build rapport quickly, and create momentum through energy and optimism. They thrive in collaborative, visible roles where their personality can shine.",
      id: "Pemimpin tipe I antusias, ekspresif, dan bersemangat oleh orang-orang. Mereka adalah komunikator berbakat yang menginspirasi orang lain, membangun hubungan dengan cepat, dan menciptakan momentum melalui energi dan optimisme. Mereka berkembang dalam peran yang kolaboratif dan terlihat di mana kepribadian mereka dapat bersinar.",
    },
    motivation: {
      en: "Recognition, social connection, freedom of expression, and collaborative success.",
      id: "Pengakuan, koneksi sosial, kebebasan berekspresi, dan keberhasilan bersama.",
    },
    fear: {
      en: "Social rejection, being ignored, or losing their influence over others.",
      id: "Penolakan sosial, diabaikan, atau kehilangan pengaruh mereka terhadap orang lain.",
    },
    strengths: {
      en: ["Builds relationships naturally", "Highly persuasive and inspiring", "Creates positive team culture", "Enthusiastic and energising", "Collaborative and inclusive"],
      id: ["Membangun hubungan secara alami", "Sangat persuasif dan inspiratif", "Menciptakan budaya tim yang positif", "Antusias dan membangkitkan semangat", "Kolaboratif dan inklusif"],
    },
    blindspots: {
      en: ["Can over-promise and under-deliver", "May lose focus on details and follow-through", "Emotions can drive decision-making", "Can struggle with structure and consistency"],
      id: ["Bisa terlalu banyak berjanji dan kurang memenuhinya", "Mungkin kehilangan fokus pada detail dan tindak lanjut", "Emosi bisa mendorong pengambilan keputusan", "Bisa kesulitan dengan struktur dan konsistensi"],
    },
    communication: {
      en: "Be warm and personal. Start with the relationship before business. Give them space to talk and share ideas. Affirm their contributions and avoid being overly critical.",
      id: "Bersikap hangat dan personal. Mulai dengan hubungan sebelum bisnis. Beri mereka ruang untuk berbicara dan berbagi ide. Akui kontribusi mereka dan hindari terlalu kritis.",
    },
    crossCultural: {
      en: "The I-type's expressiveness is a gift in relational cultures but can feel superficial or exhausting in more reserved contexts. Building genuine depth — not just warmth — is the growth edge in cross-cultural leadership.",
      id: "Ekspresivitas tipe I adalah anugerah dalam budaya relasional tetapi bisa terasa dangkal atau melelahkan dalam konteks yang lebih tertutup. Membangun kedalaman sejati — bukan hanya kehangatan — adalah area pertumbuhan dalam kepemimpinan lintas budaya.",
    },
    biblical: {
      name: "Peter",
      text: "Peter is the I-leader of the early church — warm, expressive, the first to speak. His enthusiasm carried the disciples; his energy preached the first sermon at Pentecost. But his I-style also led him to bold declarations his courage could not yet match — including the night he denied Jesus. Influence needs depth.",
    },
    digDeeper: {
      en: "In reserved or formal cultural contexts (East Asia, Northern Europe, some Middle Eastern settings), your natural expressiveness can read as superficial or unserious. The growth move is not suppressing your energy — it is developing genuine depth in the relationship before the energy lands well. I-type leaders who master this become some of the most effective cross-cultural bridge-builders in any team.",
      id: "Dalam konteks budaya yang tertutup atau formal (Asia Timur, Eropa Utara, beberapa lingkungan Timur Tengah), ekspresivitasmu yang alami bisa terbaca sebagai dangkal atau tidak serius. Langkah pertumbuhannya bukan menekan energimu — melainkan mengembangkan kedalaman sejati dalam hubungan sebelum energi itu diterima dengan baik. Pemimpin tipe I yang menguasai ini menjadi beberapa pembangun jembatan lintas budaya paling efektif dalam tim mana pun.",
    },
  },
  {
    key: "S",
    label: { en: "Steadiness", id: "Steadiness" },
    tagline: { en: "Patient. Loyal. Consistently supportive.", id: "Sabar. Setia. Konsisten dalam Dukungan." },
    color: "oklch(52% 0.22 145)",
    colorLight: "oklch(62% 0.18 145)",
    colorVeryLight: "oklch(95% 0.05 145)",
    bg: "oklch(18% 0.10 145)",
    overview: {
      en: "The S-type leader is patient, dependable, and deeply loyal. They create stable, supportive environments where people feel safe and valued. They are skilled listeners and excellent mediators who hold teams together through consistency, warmth, and quiet strength.",
      id: "Pemimpin tipe S sabar, dapat diandalkan, dan sangat setia. Mereka menciptakan lingkungan yang stabil dan mendukung di mana orang merasa aman dan dihargai. Mereka adalah pendengar terampil dan mediator yang sangat baik yang menyatukan tim melalui konsistensi, kehangatan, dan kekuatan yang tenang.",
    },
    motivation: {
      en: "Stability, sincere appreciation, contributing to a team they believe in, and harmonious working relationships.",
      id: "Stabilitas, penghargaan tulus, berkontribusi pada tim yang mereka percayai, dan hubungan kerja yang harmonis.",
    },
    fear: {
      en: "Sudden change, conflict, loss of security, and letting people down.",
      id: "Perubahan mendadak, konflik, kehilangan rasa aman, dan mengecewakan orang lain.",
    },
    strengths: {
      en: ["Deeply reliable and consistent", "Excellent listener and mediator", "Creates psychological safety", "Long-term loyalty and commitment", "Holds teams together under pressure"],
      id: ["Sangat dapat diandalkan dan konsisten", "Pendengar dan mediator yang luar biasa", "Menciptakan keamanan psikologis", "Loyalitas dan komitmen jangka panjang", "Menyatukan tim di bawah tekanan"],
    },
    blindspots: {
      en: ["Avoids necessary conflict", "Can resist change even when needed", "May say yes when they mean no", "Slow to take initiative without encouragement"],
      id: ["Menghindari konflik yang diperlukan", "Bisa menolak perubahan bahkan ketika dibutuhkan", "Mungkin mengatakan ya ketika maksudnya tidak", "Lambat mengambil inisiatif tanpa dorongan"],
    },
    communication: {
      en: "Be sincere, warm, and patient. Give them time to respond. Avoid sudden changes without explanation. Show genuine care for them as a person — not just a team member.",
      id: "Bersikap tulus, hangat, dan sabar. Beri mereka waktu untuk merespons. Hindari perubahan mendadak tanpa penjelasan. Tunjukkan perhatian tulus kepada mereka sebagai pribadi — bukan hanya anggota tim.",
    },
    crossCultural: {
      en: "The S-type's patience and harmony-seeking are deeply valued across most cultures. The growth edge is learning to express disagreement and take the lead — especially in cultures that respect assertiveness and directness.",
      id: "Kesabaran dan pencarian harmoni tipe S sangat dihargai di sebagian besar budaya. Area pertumbuhan adalah belajar mengungkapkan ketidaksetujuan dan mengambil inisiatif — terutama dalam budaya yang menghormati ketegasan dan keterbukaan.",
    },
    biblical: {
      name: "Barnabas",
      text: "Barnabas means 'Son of Encouragement' — a pure S-leader. He vouched for Saul when no one trusted him, mentored John Mark when Paul wrote him off, and held the early team together quietly. His patience built leaders Paul could not. Steadiness is rarely loud, but the church would have fractured without him. Some traditions map Barnabas as I-type rather than S — his warmth and encouragement support either reading. What is clear: his patient loyalty held the early team together when boldness alone would have fractured it.",
    },
    digDeeper: {
      en: "In Indonesian and other Southeast Asian contexts, your harmony-preservation behaviors are not a weakness label waiting to be overcome — they are culturally skilled leadership. The ability to read the room, protect relationships, and hold space for others before pushing to a conclusion reflects deep relational intelligence. The growth edge is not becoming more assertive for its own sake, but learning when speaking first protects others from carrying more than they should.",
      id: "Dalam konteks Indonesia dan Asia Tenggara lainnya, perilaku pelestarian harmonimu bukan label kelemahan yang menunggu untuk diatasi — melainkan kepemimpinan yang terampil secara budaya. Kemampuan membaca situasi, melindungi hubungan, dan memberi ruang bagi orang lain sebelum mendorong ke kesimpulan mencerminkan kecerdasan relasional yang mendalam. Area pertumbuhannya bukan menjadi lebih asertif demi dirinya sendiri, tetapi belajar kapan berbicara lebih dulu melindungi orang lain dari membawa beban yang seharusnya tidak mereka tanggung.",
    },
  },
  {
    key: "C",
    label: { en: "Conscientiousness", id: "Conscientiousness" },
    tagline: { en: "Precise. Analytical. Excellence-driven.", id: "Tepat. Analitis. Berorientasi Keunggulan." },
    color: "oklch(50% 0.22 245)",
    colorLight: "oklch(60% 0.18 245)",
    colorVeryLight: "oklch(95% 0.05 245)",
    bg: "oklch(20% 0.14 250)",
    overview: {
      en: "The C-type leader is analytical, precise, and driven by accuracy. They value quality over speed, data over assumption, and systems over intuition. They are natural problem-solvers who bring rigour, structure, and careful thinking to everything they do.",
      id: "Pemimpin tipe C analitis, tepat, dan didorong oleh akurasi. Mereka menghargai kualitas di atas kecepatan, data di atas asumsi, dan sistem di atas intuisi. Mereka adalah pemecah masalah alami yang membawa kekakuan, struktur, dan pemikiran cermat ke dalam semua yang mereka lakukan.",
    },
    motivation: {
      en: "Accuracy, quality, deep expertise, and being given the time and space to do things right.",
      id: "Akurasi, kualitas, keahlian mendalam, dan diberi waktu serta ruang untuk melakukan segala sesuatu dengan benar.",
    },
    fear: {
      en: "Being wrong, producing poor quality work, criticism without substance, and acting without enough information.",
      id: "Salah, menghasilkan pekerjaan berkualitas buruk, kritik tanpa substansi, dan bertindak tanpa informasi yang cukup.",
    },
    strengths: {
      en: ["High standards and attention to detail", "Systematic problem-solving", "Critical thinking and analysis", "Reliable and thorough", "Brings structure and precision"],
      id: ["Standar tinggi dan perhatian terhadap detail", "Pemecahan masalah sistematis", "Pemikiran kritis dan analisis", "Dapat diandalkan dan menyeluruh", "Membawa struktur dan ketepatan"],
    },
    blindspots: {
      en: ["Can over-analyse and delay decisions", "May be overly critical of others' work", "Can come across as cold or aloof", "Perfectionistic tendencies can slow progress"],
      id: ["Bisa terlalu banyak menganalisis dan menunda keputusan", "Mungkin terlalu kritis terhadap pekerjaan orang lain", "Bisa terkesan dingin atau tidak peduli", "Kecenderungan perfeksionis dapat memperlambat kemajuan"],
    },
    communication: {
      en: "Be accurate and prepared. Provide evidence and logical reasoning. Give them time to process and don't rush to a decision. Avoid vague language — they want specifics.",
      id: "Bersikap akurat dan siap. Berikan bukti dan penalaran logis. Beri mereka waktu untuk memproses dan jangan terburu-buru mengambil keputusan. Hindari bahasa yang samar — mereka menginginkan hal yang spesifik.",
    },
    crossCultural: {
      en: "The C-type's need for precision is a great asset in technical or quality-focused cultures. The growth edge is learning to work with relational ambiguity — where trust is built through relationships, not systems — and to communicate warmth alongside accuracy.",
      id: "Kebutuhan tipe C akan ketepatan adalah aset besar dalam budaya teknis atau yang berfokus pada kualitas. Area pertumbuhan adalah belajar bekerja dengan ambiguitas relasional — di mana kepercayaan dibangun melalui hubungan, bukan sistem — dan untuk mengkomunikasikan kehangatan bersama ketepatan.",
    },
    biblical: {
      name: "Luke",
      text: "Luke wrote the most precise gospel — careful research, ordered chronology, named sources. His C-style preserved the historical anchor of the faith: dates, places, witnesses. Quiet, exact, unshowy. Without his rigour, the church would have lost the documentary weight of what happened. Faithful leadership sometimes looks like patient verification.",
    },
    digDeeper: {
      en: "In oral-preference cultures (much of sub-Saharan Africa, oral-tradition communities across Asia and the Pacific), your documentation requests can read as distrust before a single question is asked. The skill is pairing precision with warmth — making clear that your thoroughness is in service of the mission, not a judgment on people. C-type leaders who learn to communicate the 'why' behind their standards become trusted quality anchors in diverse teams.",
      id: "Dalam budaya berbasis lisan (sebagian besar Afrika sub-Sahara, komunitas tradisi lisan di seluruh Asia dan Pasifik), permintaan dokumentasimu dapat terbaca sebagai ketidakpercayaan bahkan sebelum satu pertanyaan pun diajukan. Keterampilannya adalah memadukan ketepatan dengan kehangatan — menjelaskan bahwa ketelitianmu adalah untuk melayani misi, bukan menghakimi orang. Pemimpin tipe C yang belajar mengkomunikasikan 'mengapa' di balik standar mereka menjadi jangkar kualitas yang dipercaya dalam tim yang beragam.",
    },
  },
];

// -- RESULT PROFILES -----------------------------------------------------------

type ResultKey = "D" | "I" | "S" | "C" | "DI" | "DS" | "DC" | "IS" | "IC" | "SC";

const RESULT_PROFILES: Record<"en" | "id", Record<ResultKey, string>> = {
  en: {
    D: "You lead with boldness and results. Your greatest strength is driving action and cutting through indecision. Growth edge: slow down enough to bring people with you — not just past them.",
    I: "You lead with energy and relationships. Your greatest strength is inspiring others and creating momentum. Growth edge: follow through on commitments and develop your eye for detail.",
    S: "You lead with patience and loyalty. Your greatest strength is creating environments where people feel safe and valued. Growth edge: practise taking initiative and speaking your concerns earlier.",
    C: "You lead with precision and expertise. Your greatest strength is bringing rigour and quality to everything. Growth edge: learn to act with less-than-perfect information and share your insights more openly.",
    DI: "You combine boldness with people-energy — driving results while keeping others inspired. A powerful combination in leading diverse teams.",
    DS: "You balance directness with steadiness — goal-focused yet able to create stable, loyal teams. You lead with both force and consistency.",
    DC: "You combine drive with precision — results-oriented and quality-obsessed. Your challenge: don't let perfectionism slow momentum.",
    IS: "You blend enthusiasm with warmth — inspiring people while genuinely caring for them. A gift in relational and cross-cultural contexts.",
    IC: "You combine persuasion with precision — engaging communicator and careful thinker. Balance spontaneity with follow-through.",
    SC: "You bring steadiness and rigour together — reliable, patient, and quality-driven. A trusted anchor for any team.",
  },
  id: {
    D: "Anda memimpin dengan keberanian dan fokus pada hasil. Kekuatan terbesar Anda adalah mendorong aksi dan mengatasi kebimbangan. Area pertumbuhan: perlambat langkah cukup untuk membawa orang bersama Anda — bukan hanya melewati mereka.",
    I: "Anda memimpin dengan energi dan hubungan. Kekuatan terbesar Anda adalah menginspirasi orang lain dan menciptakan momentum. Area pertumbuhan: tindaklanjuti komitmen dan kembangkan perhatian Anda terhadap detail.",
    S: "Anda memimpin dengan kesabaran dan kesetiaan. Kekuatan terbesar Anda adalah menciptakan lingkungan di mana orang merasa aman dan dihargai. Area pertumbuhan: latih diri untuk mengambil inisiatif dan ungkapkan kekhawatiran Anda lebih awal.",
    C: "Anda memimpin dengan ketepatan dan keahlian. Kekuatan terbesar Anda adalah membawa ketelitian dan kualitas ke dalam segalanya. Area pertumbuhan: belajarlah untuk bertindak dengan informasi yang tidak sempurna dan bagikan wawasan Anda dengan lebih terbuka.",
    DI: "Anda menggabungkan keberanian dengan energi relasional — mendorong hasil sambil menginspirasi orang lain. Kombinasi yang kuat dalam memimpin tim yang beragam.",
    DS: "Anda menyeimbangkan ketegasan dengan kestabilan — berfokus pada tujuan namun mampu menciptakan tim yang stabil dan loyal. Anda memimpin dengan kekuatan sekaligus konsistensi.",
    DC: "Anda menggabungkan dorongan dengan ketepatan — berorientasi hasil dan terobsesi dengan kualitas. Tantangan Anda: jangan biarkan perfeksionisme memperlambat momentum.",
    IS: "Anda memadukan antusiasme dengan kehangatan — menginspirasi orang-orang sambil benar-benar peduli terhadap mereka. Anugerah dalam konteks relasional dan lintas budaya.",
    IC: "Anda menggabungkan persuasi dengan ketepatan — komunikator yang menarik dan pemikir yang cermat. Seimbangkan spontanitas dengan tindak lanjut.",
    SC: "Anda membawa kestabilan dan ketelitian bersama-sama — dapat diandalkan, sabar, dan berorientasi kualitas. Jangkar terpercaya bagi tim mana pun.",
  },
};

// -- SCORE CALCULATION ---------------------------------------------------------

function getResultKey(scores: { D: number; I: number; S: number; C: number }): ResultKey {
  const entries = Object.entries(scores) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  const second = entries[1];
  const threshold = top[1] * 0.75;
  if (second[1] >= threshold) {
    const discOrder = ["D", "I", "S", "C"];
    const combo = [top[0], second[0]]
      .sort((a, b) => discOrder.indexOf(a) - discOrder.indexOf(b))
      .join("") as ResultKey;
    return combo;
  }
  return top[0] as ResultKey;
}

// Normalize raw DB result to DISC order (e.g. "CS" → "SC", "ID" → "DI")
function normalizeResult(raw: string | null): string | null {
  if (!raw) return null;
  const discOrder = ["D", "I", "S", "C"];
  return raw.split("").sort((a, b) => discOrder.indexOf(a) - discOrder.indexOf(b)).join("");
}


// -- TYPE DEFINITIONS ------------------------------------------------------------------

type Lang = "en" | "id";
type ScoreKey = "D" | "I" | "S" | "C";
type QuizState = "not-started" | "in-progress" | "done";

// -- COMPONENT -------------------------------------------------------------------------

export default function DiscClient({
  discResult,
  discScores,
}: {
  discResult: string | null;
  discScores: { D: number; I: number; S: number; C: number } | null;
}) {
  const { lang } = useLanguage() as { lang: Lang };

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>("not-started");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<ScoreKey, number>>({ D: 0, I: 0, S: 0, C: 0 });
  const [answerHistory, setAnswerHistory] = useState<Array<{ q: number; t: string }>>([]);

  // Save state
  const [resultSaved, setResultSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // UI state
  const [noHover, setNoHover] = useState(false);
  const [bgOpen, setBgOpen] = useState(false);
  const [activeTypeTab, setActiveTypeTab] = useState<Record<string, "communication" | "crossCultural">>({});
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"D" | "I" | "S" | "C" | null>(null);

  // Touch detection
  useEffect(() => {
    const onTouch = () => setNoHover(true);
    window.addEventListener("touchstart", onTouch, { once: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  // -- HELPERS -----------------------------------------------------------------------

  function tr<T extends { en: string; id: string }>(obj: T): string {
    return obj[lang as keyof T] as string;
  }

  function getShuffledOptions(qIndex: number) {
    const order = SHUFFLE_ORDERS[qIndex % SHUFFLE_ORDERS.length];
    return order.map((i) => QS[qIndex].options[i]);
  }

  // -- QUIZ HANDLERS -----------------------------------------------------------------

  function startQuiz() {
    setQuizState("in-progress");
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
  }

  function handleAnswer(type: string) {
    const newScores = { ...scores, [type]: scores[type as ScoreKey] + 1 };
    const newHistory = [...answerHistory, { q: currentQ, t: type }];
    if (currentQ < QS.length - 1) {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setCurrentQ(currentQ + 1);
    } else {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setQuizState("done");
    }
  }

  function handleBack() {
    if (currentQ === 0) {
      setQuizState("not-started");
      return;
    }
    const prev = answerHistory[answerHistory.length - 1];
    const newScores = { ...scores, [prev.t]: scores[prev.t as ScoreKey] - 1 };
    setScores(newScores);
    setAnswerHistory(answerHistory.slice(0, -1));
    setCurrentQ(currentQ - 1);
  }

  function retake() {
    setQuizState("not-started");
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
  }

  // -- RESULT CALCULATIONS -----------------------------------------------------------

  const total = scores.D + scores.I + scores.S + scores.C;
  const normalizedDiscResult = normalizeResult(discResult);
  const resultKey = quizState === "done" ? getResultKey(scores) : (normalizedDiscResult ?? "");
  const displayScores = quizState === "done" ? scores : discScores ?? { D: 0, I: 0, S: 0, C: 0 };
  const displayTotal = quizState === "done" ? total : (discScores ? discScores.D + discScores.I + discScores.S + discScores.C : 0);

  const resultText = resultKey
    ? (RESULT_PROFILES[lang as keyof typeof RESULT_PROFILES] as Record<string, string>)?.[resultKey] ?? null
    : null;

  const primaryType = resultKey ? resultKey[0] as ScoreKey : null;

  const pD = displayTotal > 0 ? Math.round((displayScores.D / displayTotal) * 100) : 0;
  const pI = displayTotal > 0 ? Math.round((displayScores.I / displayTotal) * 100) : 0;
  const pS = displayTotal > 0 ? Math.round((displayScores.S / displayTotal) * 100) : 0;
  const pC = displayTotal > 0 ? Math.round((displayScores.C / displayTotal) * 100) : 0;

  // -- SAVE HANDLERS -----------------------------------------------------------------

  async function handleSaveResult() {
    if (!resultKey) return;
    startTransition(async () => {
      await saveDISCResult(resultKey, scores);
      setResultSaved(true);
    });
  }

  function getProgressBarColor(qIndex: number): string {
    const colors: Record<ScoreKey, string> = {
      D: "oklch(52% 0.27 25)",
      I: "oklch(62% 0.22 87)",
      S: "oklch(52% 0.22 145)",
      C: "oklch(50% 0.22 245)",
    };
    const keys: ScoreKey[] = ["D", "I", "S", "C"];
    return colors[keys[Math.floor((qIndex / QS.length) * 4) % 4]];
  }

  // -- GA TRACKING -------------------------------------------------------------------

  function trackCompletion() {
    if (primaryType) {
      trackAssessmentCompletion("disc");
    }
  }

  // Track on quiz done
  useEffect(() => {
    if (quizState === "done" && primaryType) {
      trackCompletion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState]);

  // -- SCROLL HELPERS ----------------------------------------------------------------

  function scrollToType(key: string) {
    setSelectedType(key as "D" | "I" | "S" | "C");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToAssessment() {
    const el = document.getElementById("disc-assessment");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToTypes() {
    const el = document.getElementById("disc-types");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // -- MATRIX KEY HANDLER ------------------------------------------------------------

  function handleMatrixKey(e: React.KeyboardEvent<SVGGElement>, key: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToType(key);
    }
  }

  // -- RENDER ------------------------------------------------------------------------

  return (
    <>
      {/* ===================================================================
          FULL-PAGE TYPE MODAL
      =================================================================== */}
      {selectedType && (() => {
        const type = DISC_TYPES.find(t => t.key === selectedType)!;
        const accentColor = type.color;
        const activeTab = activeTypeTab[type.key] ?? "communication";
        return (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "oklch(96% 0.005 80)",
              overflowY: "auto",
            }}
          >
            {/* Modal top bar */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "oklch(96% 0.005 80)",
                borderBottom: `3px solid ${accentColor}`,
                padding: "0.75rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => {
                  setSelectedType(null);
                  document.getElementById("disc-matrix")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "oklch(35% 0.05 260)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0",
                  minHeight: 44,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                {lang === "en" ? "Go Back" : "Kembali"}
              </button>
            </div>

            {/* Modal content */}
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
              {/* Watermark */}
              <div aria-hidden="true" style={{
                position: "relative", overflow: "hidden",
              }}>
                <span style={{
                  position: "absolute", top: "-2rem", right: "-1rem",
                  fontFamily: "Montserrat, sans-serif", fontWeight: 900,
                  fontSize: "clamp(8rem, 20vw, 14rem)",
                  color: accentColor, opacity: 0.06, lineHeight: 1,
                  pointerEvents: "none", userSelect: "none",
                }}>{type.key}</span>
              </div>

              {/* Eyebrow pill */}
              <span style={{
                display: "inline-block", background: accentColor,
                color: "oklch(96% 0.005 80)", fontFamily: "Montserrat, sans-serif",
                fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.12em",
                textTransform: "uppercase", padding: "0.35rem 1rem", marginBottom: "1.25rem",
                borderRadius: "12px",
              }}>
                {type.key} — {tr(type.label)}
              </span>

              {/* Tagline */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "oklch(22% 0.10 260)",
                lineHeight: 1.2, marginBottom: "1.25rem",
              }}>
                {tr(type.tagline)}
              </h1>

              {/* Overview */}
              <p style={{
                fontFamily: "Montserrat, sans-serif", fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
                color: "oklch(35% 0.04 260)", lineHeight: 1.75, marginBottom: "2rem",
              }}>
                {tr(type.overview)}
              </p>

              {/* Strengths + Blind Spots */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.5rem", marginBottom: "2rem",
              }}>
                <div>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.75rem",
                    letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor, marginBottom: "0.75rem",
                  }}>
                    {lang === "en" ? "Strengths" : "Kekuatan"}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {type.strengths[lang].map((s, i) => (
                      <li key={i} style={{
                        fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: "0.875rem",
                        color: "oklch(30% 0.05 260)", display: "flex", alignItems: "center", gap: "0.5rem",
                      }}>
                        <span style={{ color: accentColor, fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.75rem",
                    letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.04 260)", marginBottom: "0.75rem",
                  }}>
                    {lang === "en" ? "Blind Spots" : "Titik Buta"}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {type.blindspots[lang].map((b, i) => (
                      <li key={i} style={{
                        fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontStyle: "italic",
                        fontSize: "0.875rem", color: "oklch(50% 0.04 260)", display: "flex", alignItems: "center", gap: "0.5rem",
                      }}>
                        <span style={{ color: "oklch(65% 0.03 80)", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>-</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Motivated by + Fears */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                border: "1px solid oklch(88% 0.008 80)", background: "oklch(88% 0.008 80)",
                gap: "1px", overflow: "hidden", marginBottom: "2rem",
              }}>
                <div style={{ padding: "1.25rem 1.5rem", background: "oklch(96% 0.005 80)" }}>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.7rem",
                    letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor, marginBottom: "0.5rem",
                  }}>
                    {lang === "en" ? "Motivated by" : "Termotivasi oleh"}
                  </p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "0.875rem", color: "oklch(35% 0.04 260)", lineHeight: 1.65, margin: 0 }}>
                    {tr(type.motivation)}
                  </p>
                </div>
                <div style={{ padding: "1.25rem 1.5rem", background: "oklch(96% 0.005 80)" }}>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.7rem",
                    letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor, marginBottom: "0.5rem",
                  }}>
                    {lang === "en" ? "Fears" : "Ditakuti"}
                  </p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "0.875rem", color: "oklch(35% 0.04 260)", lineHeight: 1.65, margin: 0 }}>
                    {tr(type.fear)}
                  </p>
                </div>
              </div>

              {/* Communication Style tabs */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", gap: "0", borderBottom: "1px solid oklch(88% 0.008 80)", marginBottom: "1.25rem" }}>
                  {(["communication", "crossCultural"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTypeTab((prev) => ({ ...prev, [type.key]: tab }))}
                      style={{
                        background: "none", border: "none",
                        borderBottom: activeTab === tab ? `2px solid ${accentColor}` : "2px solid transparent",
                        marginBottom: "-1px", cursor: "pointer", padding: "0.5rem 1rem 0.625rem",
                        fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.8rem",
                        color: activeTab === tab ? "oklch(22% 0.10 260)" : "oklch(55% 0.04 260)",
                        minHeight: 44, whiteSpace: "nowrap",
                      }}
                    >
                      {tab === "communication"
                        ? (lang === "en" ? "Communication Style" : "Gaya Komunikasi")
                        : (lang === "en" ? "Cross-Cultural Note" : "Catatan Lintas Budaya")}
                    </button>
                  ))}
                </div>
                <p style={{
                  fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "0.9rem",
                  color: "oklch(35% 0.04 260)", lineHeight: 1.75, margin: 0,
                }}>
                  {activeTab === "communication" ? tr(type.communication) : tr(type.crossCultural)}
                </p>
              </div>

              {/* Biblical Example */}
              <div style={{
                background: "oklch(97% 0.010 50)", border: "1px solid oklch(88% 0.030 50)",
                padding: "1.5rem", marginBottom: "1.5rem",
              }}>
                <p style={{
                  fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.7rem",
                  letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.5rem",
                }}>
                  {lang === "en" ? "Biblical Example" : "Contoh Alkitabiah"}
                </p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.25rem",
                  color: "oklch(22% 0.10 260)", marginBottom: "0.75rem",
                }}>
                  {type.biblical.name}
                </h3>
                <p style={{
                  fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "0.875rem",
                  color: "oklch(35% 0.04 260)", lineHeight: 1.75, margin: 0,
                }}>
                  {type.biblical.text}
                </p>
              </div>

              {/* Cross-Cultural Contexts — inline (no accordion) */}
              {type.digDeeper && (
                <div style={{ marginTop: "1.5rem" }}>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.75rem",
                    letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor, marginBottom: "0.75rem",
                  }}>
                    {lang === "en" ? `${type.key}-type in Cross-Cultural Contexts` : `Tipe ${type.key} dalam Konteks Lintas Budaya`}
                  </p>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem",
                    color: "oklch(40% 0.05 260)", lineHeight: 1.75, margin: 0,
                  }}>
                    {type.digDeeper[lang]}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SECTION 1 — HERO
      =================================================================== */}
      <LangToggle />

      <section
        id="disc-hero"
        style={{
          background: "oklch(22% 0.10 260)",
          position: "relative",
          overflow: "hidden",
          borderTop: "3px solid oklch(65% 0.15 45)",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem) clamp(2.5rem, 6vw, 4rem)",
        }}
      >
        {/* Hero image — luminosity blend */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/resources/disc/hero.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "luminosity",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        />

        {/* DISC watermark letters */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: "2rem",
            display: "flex",
            gap: "0.25rem",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {(["D", "I", "S", "C"] as const).map((k) => {
            const t = DISC_TYPES.find((dt) => dt.key === k)!;
            return (
              <span
                key={k}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(5rem, 12vw, 9rem)",
                  color: t.color,
                  opacity: 0.04,
                  letterSpacing: "-0.02em",
                }}
              >
                {k}
              </span>
            );
          })}
        </div>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1rem",
            }}
          >
            {lang === "en" ? "Crispy Leaders · Behavioural Assessment" : "Crispy Leaders · Penilaian Perilaku"}
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
              color: "oklch(96% 0.005 80)",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            {lang === "en" ? "DISC Personality Profile" : "Profil Kepribadian DISC"}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
              color: "oklch(78% 0.04 260)",
              lineHeight: 1.65,
              marginBottom: "2.5rem",
              maxWidth: 580,
              margin: "0 auto 2.5rem",
            }}
          >
            {lang === "en"
              ? "Your behavioral style shapes how you lead, communicate, and respond under pressure. DISC gives you a language for what is already visible in your team. Start with the assessment, then go deeper into the four types."
              : "Gaya perilakumu membentuk cara kamu memimpin, berkomunikasi, dan merespons di bawah tekanan. DISC memberimu bahasa untuk apa yang sudah terlihat dalam timmu. Mulai dengan penilaian, lalu pelajari lebih dalam keempat tipe."}
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2.5rem",
            }}
          >
            {/* Primary CTA */}
            <button
              onClick={scrollToAssessment}
              style={{
                background: "oklch(65% 0.15 45)",
                color: "oklch(96% 0.005 80)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              {lang === "en"
                ? (discResult ? "Redo the Test" : "Take the Test")
                : (discResult ? "Ulangi Tes" : "Mulai Tes")}
            </button>

          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 2 — LEARNING OUTCOMES
      =================================================================== */}
      <section
        id="disc-outcomes"
        style={{
          background: "oklch(96% 0.005 80)",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3rem)",
          borderTop: "1px solid oklch(88% 0.008 80)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1.25rem",
            }}
          >
            {lang === "en" ? "After This Module" : "Setelah Modul Ini"}
          </p>

          {/* Outcomes list */}
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {(lang === "en"
              ? [
                  "Identify your behavioral style and describe how it shapes your default communication and decision-making in cross-cultural contexts.",
                  "Recognise the four DISC patterns and explain what each one brings to a multicultural team — and where each one creates friction.",
                  "Apply DISC awareness to one real collaboration challenge in your current team.",
                ]
              : [
                  "Mengidentifikasi gaya perilakumu dan menjelaskan bagaimana gaya tersebut membentuk komunikasi dan pengambilan keputusan defaultmu dalam konteks lintas budaya.",
                  "Mengenali keempat pola DISC dan menjelaskan apa yang dibawa masing-masing tipe ke dalam tim multikultural, serta di mana masing-masing tipe menimbulkan gesekan.",
                  "Menerapkan kesadaran DISC pada satu tantangan kolaborasi nyata dalam timmu saat ini.",
                ]
            ).map((outcome, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                {/* Orange left tick */}
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 3,
                    height: "1.5em",
                    marginTop: "0.25em",
                    background: "oklch(65% 0.15 45)",
                    display: "inline-block",
                  }}
                />
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
                    color: "oklch(35% 0.04 260)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {outcome}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================================================================
          SECTION 3 — A BEHAVIOURAL FRAMEWORK
      =================================================================== */}
      <section
        id="disc-framework"
        style={{
          background: "oklch(22% 0.10 260)",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem)",
          borderTop: "1px solid oklch(32% 0.06 260)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* BLOCK A — ORIGIN + TIMELINE */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1rem",
            }}
          >
            {lang === "en" ? "A Behavioural Framework" : "Kerangka Perilaku"}
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "oklch(96% 0.005 80)",
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            {lang === "en"
              ? "Understanding how people are wired to behave."
              : "Memahami bagaimana orang cenderung berperilaku."}
          </h2>

          {/* Timeline SVG */}
          <div style={{ marginBottom: "2rem", overflowX: "auto" }}>
            <svg
              viewBox="0 0 600 80"
              aria-hidden="true"
              style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}
            >
              {/* Axis line */}
              <line x1="40" y1="40" x2="560" y2="40" stroke="oklch(96% 0.005 80)" strokeOpacity="0.30" strokeWidth="1.5" />
              {/* Nodes */}
              {[
                { x: 40, date: "c.460 BCE", label: "Hippocrates" },
                { x: 200, date: "1928", label: "Marston" },
                { x: 380, date: "1956", label: "Clarke / AVA" },
                { x: 560, date: "Today", label: "Everything DiSC" },
              ].map((node) => (
                <g key={node.x}>
                  <circle cx={node.x} cy={40} r={6} fill="oklch(65% 0.15 45)" />
                  <text
                    x={node.x}
                    y={22}
                    textAnchor="middle"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="700"
                    fontSize="10"
                    fill="oklch(65% 0.15 45)"
                  >
                    {node.date}
                  </text>
                  <text
                    x={node.x}
                    y={60}
                    textAnchor="middle"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="400"
                    fontSize="10"
                    fill="oklch(65% 0.04 260)"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
            <figcaption
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.75rem",
                color: "oklch(55% 0.04 260)",
                textAlign: "center",
                marginTop: "0.5rem",
              }}
            >
              {lang === "en"
                ? "The four-temperament tradition: Hippocrates (c.460 BCE) → Marston 1928 → Clarke / AVA 1956 → Everything DiSC today"
                : "Tradisi empat temperamen: Hippocrates (c.460 SM) → Marston 1928 → Clarke / AVA 1956 → Everything DiSC saat ini"}
            </figcaption>
          </div>

          {/* Teaching prose — paragraph 1 */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              color: "oklch(78% 0.04 260)",
              lineHeight: 1.75,
              marginBottom: "1.25rem",
            }}
          >
            {lang === "en" ? (
              <>
                DISC belongs to a 2,500-year tradition of observing four natural behavioral orientations — from Hippocrates through Galen, through medieval temperament theory, to William Moulton Marston&apos;s 1928 research and the instruments built since.
                <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>¹</span>{" "}
                Marston identified four behavioral axes that recur across cultures and contexts: Dominance, Inducement, Submission, and Compliance — the original DISC categories.
                <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>²</span>{" "}
                The framework is descriptively strong and empirically useful. It is not a peer-reviewed personality science. Use it as a behaviorally descriptive tool — a starting point for conversation, not a diagnostic conclusion.
              </>
            ) : (
              <>
                DISC termasuk dalam tradisi 2.500 tahun pengamatan empat orientasi perilaku alami — dari Hippocrates melalui Galen, melalui teori temperamen abad pertengahan, hingga penelitian William Moulton Marston tahun 1928 dan instrumen-instrumen yang dibangun setelahnya.
                <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>¹</span>{" "}
                Marston mengidentifikasi empat sumbu perilaku yang berulang di berbagai budaya dan konteks: Dominance, Inducement, Submission, dan Compliance — kategori DISC asli.
                <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>²</span>{" "}
                Kerangka ini secara deskriptif kuat dan berguna secara empiris. Ini bukan ilmu kepribadian yang ditinjau sejawat. Gunakan sebagai alat deskripsi perilaku — titik awal percakapan, bukan kesimpulan diagnostik.
              </>
            )}
          </p>

          {/* Teaching prose — paragraph 2 */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              color: "oklch(78% 0.04 260)",
              lineHeight: 1.75,
              marginBottom: "1.25rem",
            }}
          >
            {lang === "en"
              ? `DISC is not a measure of intelligence, spiritual maturity, or calling. It is not a fixed identity. Your DISC result describes your behavioral tendency under typical conditions — not who you are under pressure of growth, grief, or transformation. The result shifts across cultures and contexts. Read it as a starting point. A "high D" in Sumba is not the same as a "high D" in Sydney.`
              : `DISC bukan ukuran kecerdasan, kematangan rohani, atau panggilan. Ini bukan identitas tetap. Hasil DISC-mu menggambarkan kecenderungan perilakumu dalam kondisi biasa — bukan siapa dirimu di bawah tekanan pertumbuhan, kesedihan, atau transformasi. Hasilnya berubah di berbagai budaya dan konteks. Baca sebagai titik awal. Seorang "D tinggi" di Sumba tidak sama dengan "D tinggi" di Sydney.`}
          </p>

          {/* Teaching prose — paragraph 3 */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              color: "oklch(78% 0.04 260)",
              lineHeight: 1.75,
              marginBottom: "2.5rem",
            }}
          >
            {lang === "en" ? (
              <>
                The honest case for DISC in cross-cultural teams: it gives teams a shared, non-threatening vocabulary to name behavioral differences.
                <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>³</span>{" "}
                In a team where one person wants a decision now and another wants a week to check every detail, having words for that difference makes the conversation less personal and more practical. The framework is most powerful not as a diagnosis but as a permission: now we have language for this.
              </>
            ) : (
              <>
                Argumen jujur untuk DISC dalam tim lintas budaya: ini memberi tim kosakata bersama yang tidak mengancam untuk menamai perbedaan perilaku.
                <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>³</span>{" "}
                Dalam tim di mana satu orang menginginkan keputusan sekarang dan orang lain ingin seminggu untuk memeriksa setiap detail, memiliki kata-kata untuk perbedaan itu membuat percakapan menjadi kurang personal dan lebih praktis. Kerangka ini paling kuat bukan sebagai diagnosis tetapi sebagai izin: sekarang kita punya bahasa untuk ini.
              </>
            )}
          </p>

        </div>

        {/* BLOCK B — WHAT DISC IS NOT */}
        <div
          id="disc-cultural-limits"
          style={{
            background: "oklch(26% 0.09 260)",
            borderTop: "2px solid oklch(65% 0.15 45)",
            padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 5vw, 3rem)",
            marginTop: "3rem",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
                marginBottom: "1.25rem",
              }}
            >
              {lang === "en" ? "Important Context" : "Konteks Penting"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {(lang === "en"
                ? [
                    { label: "Not a verdict", body: "Your result is a tendency pattern, not a fixed identity. It describes your default behavior under typical conditions. It does not predict how you will act under pressure, growth, grief, or transformation." },
                    { label: "Not a prediction", body: "DISC does not tell you what someone will do. It names behavioral tendencies. People adapt, grow, and behave differently in different cultural contexts. Your type is a starting point, not a ceiling." },
                    { label: "Not universally calibrated", body: `DISC was developed primarily in Western, individualist research contexts. Hofstede's Indonesia data (Power Distance Index 78, Individualism 14) illustrates how far the underlying assumptions can sit from the contexts where many of us lead. S-type "weakness" labels — passivity, avoiding conflict, needing approval — may describe culturally skilled behavior in Indonesian and other Southeast Asian settings, not personal limitation.` },
                  ]
                : [
                    { label: "Bukan vonis", body: "Hasilmu adalah pola kecenderungan, bukan identitas tetap. Ini menggambarkan perilaku default-mu dalam kondisi biasa. Ini tidak memprediksi bagaimana kamu akan bertindak di bawah tekanan, pertumbuhan, kesedihan, atau transformasi." },
                    { label: "Bukan prediksi", body: "DISC tidak memberitahumu apa yang akan dilakukan seseorang. Ini menamai kecenderungan perilaku. Orang beradaptasi, tumbuh, dan berperilaku berbeda dalam konteks budaya yang berbeda. Tipe-mu adalah titik awal, bukan langit-langit." },
                    { label: "Tidak dikalibrasi secara universal", body: `DISC dikembangkan terutama dalam konteks penelitian Barat yang individualis. Data Indonesia Hofstede (Indeks Jarak Kekuasaan 78, Individualisme 14) menggambarkan betapa jauhnya asumsi mendasar dari konteks di mana banyak dari kita memimpin. Label "kelemahan" tipe S — pasif, menghindari konflik, butuh persetujuan — mungkin menggambarkan perilaku yang terampil secara budaya dalam konteks Indonesia dan Asia Tenggara lainnya, bukan keterbatasan pribadi.` },
                  ]
              ).map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderTop: "1px solid oklch(35% 0.06 260)",
                    paddingTop: "1rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "oklch(65% 0.15 45)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.875rem",
                      color: "oklch(78% 0.04 260)",
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ===================================================================
          SECTION 3b — 2x2 MATRIX
      =================================================================== */}
      <section
        id="disc-matrix"
        style={{
          background: "oklch(96% 0.005 80)",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem)",
          borderTop: "1px solid oklch(88% 0.008 80)",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.9rem",
              color: "oklch(35% 0.04 260)",
              lineHeight: 1.65,
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            {lang === "en"
              ? "The framework maps onto two axes — pace and orientation. Click any quadrant to explore that style."
              : "Kerangka ini dipetakan pada dua sumbu — kecepatan dan orientasi. Klik salah satu kuadran untuk mengeksplorasi gaya tersebut."}
          </p>

          <svg
            viewBox="0 0 640 580"
            role="img"
            aria-label={
              lang === "en"
                ? "DISC framework matrix — two axes: Task-Focused to People-Focused (horizontal), Fast/Active to Deliberate/Thoughtful (vertical). Four quadrants: D (top-left), I (top-right), S (bottom-right), C (bottom-left)."
                : "Matriks kerangka DISC — dua sumbu: Berorientasi Tugas ke Berorientasi Orang (horizontal), Cepat/Aktif ke Bijaksana/Penuh Pertimbangan (vertikal). Empat kuadran: D (kiri atas), I (kanan atas), S (kanan bawah), C (kiri bawah)."
            }
            style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto", cursor: "pointer" }}
          >
            {/* Axis label: TASK-FOCUSED (centered above left quadrant) */}
            <text
              x="172" y="18"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontWeight="700"
              fontSize="11"
              letterSpacing="0.12em"
              fill="oklch(40% 0.05 260)"
            >
              TASK-FOCUSED
            </text>
            {/* Axis label: PEOPLE-FOCUSED (centered above right quadrant) */}
            <text
              x="465" y="18"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontWeight="700"
              fontSize="11"
              letterSpacing="0.12em"
              fill="oklch(40% 0.05 260)"
            >
              PEOPLE-FOCUSED
            </text>
            {/* Axis label: FAST/ACTIVE (top, rotated) */}
            <text
              x="0" y="0"
              fontFamily="Montserrat, sans-serif"
              fontWeight="600"
              fontSize="11"
              letterSpacing="0.12em"
              fill="oklch(40% 0.05 260)"
              transform="translate(18,150) rotate(-90)"
              textAnchor="middle"
            >
              FAST / ACTIVE
            </text>
            {/* Axis label: DELIBERATE/THOUGHTFUL (bottom, rotated) */}
            <text
              x="0" y="0"
              fontFamily="Montserrat, sans-serif"
              fontWeight="600"
              fontSize="11"
              letterSpacing="0.12em"
              fill="oklch(40% 0.05 260)"
              transform="translate(18,430) rotate(-90)"
              textAnchor="middle"
            >
              DELIBERATE / THOUGHTFUL
            </text>

            {/* Axis lines */}
            <line x1="320" y1="30" x2="320" y2="555" stroke="oklch(30% 0.05 260)" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="30" y1="290" x2="610" y2="290" stroke="oklch(30% 0.05 260)" strokeWidth="1.5" strokeOpacity="0.25" />

            {/* Quadrant: D — top-left */}
            <g
              role="button"
              tabIndex={0}
              aria-label="D — Dominance. Direct. Bold. Results-driven."
              onClick={() => scrollToType("D")}
              onKeyDown={(e) => handleMatrixKey(e, "D")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="30" y="30" width="284" height="254"
                fill={hoveredQuadrant === "D" ? "oklch(52% 0.20 25 / 0.25)" : "oklch(52% 0.20 25 / 0.14)"}
                stroke={hoveredQuadrant === "D" ? "oklch(52% 0.27 25)" : "none"}
                strokeWidth="2"
              />
              <text x="172" y="145" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="72"
                fill="oklch(52% 0.27 25)" fillOpacity={hoveredQuadrant === "D" ? 1 : 0.85}>D</text>
              <text x="172" y="175" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="11"
                letterSpacing="0.14em" fill="oklch(52% 0.27 25)" fillOpacity="0.65">DOMINANCE</text>
              <text x="172" y="193" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="400" fontSize="10"
                fill="oklch(65% 0.04 260)">
                {lang === "en" ? "Direct · Bold · Results-driven" : "Langsung · Berani · Berorientasi Hasil"}
              </text>
              <rect
                x="30" y="30" width="284" height="254"
                fill="transparent"
                onMouseEnter={() => setHoveredQuadrant("D")}
                onMouseLeave={() => setHoveredQuadrant(null)}
              />
            </g>

            {/* Quadrant: I — top-right */}
            <g
              role="button"
              tabIndex={0}
              aria-label="I — Influence. Enthusiastic. Persuasive. People-first."
              onClick={() => scrollToType("I")}
              onKeyDown={(e) => handleMatrixKey(e, "I")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="320" y="30" width="290" height="254"
                fill={hoveredQuadrant === "I" ? "oklch(52% 0.18 80 / 0.25)" : "oklch(52% 0.18 80 / 0.14)"}
                stroke={hoveredQuadrant === "I" ? "oklch(62% 0.22 87)" : "none"}
                strokeWidth="2"
              />
              <text x="465" y="145" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="72"
                fill="oklch(62% 0.22 87)" fillOpacity={hoveredQuadrant === "I" ? 1 : 0.85}>I</text>
              <text x="465" y="175" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="11"
                letterSpacing="0.14em" fill="oklch(62% 0.22 87)" fillOpacity="0.65">INFLUENCE</text>
              <text x="465" y="193" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="400" fontSize="10"
                fill="oklch(65% 0.04 260)">
                {lang === "en" ? "Enthusiastic · Persuasive · People-first" : "Antusias · Persuasif · Mengutamakan Orang"}
              </text>
              <rect
                x="320" y="30" width="290" height="254"
                fill="transparent"
                onMouseEnter={() => setHoveredQuadrant("I")}
                onMouseLeave={() => setHoveredQuadrant(null)}
              />
            </g>

            {/* Quadrant: C — bottom-left */}
            <g
              role="button"
              tabIndex={0}
              aria-label="C — Conscientiousness. Precise. Systematic. Quality-driven."
              onClick={() => scrollToType("C")}
              onKeyDown={(e) => handleMatrixKey(e, "C")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="30" y="290" width="284" height="265"
                fill={hoveredQuadrant === "C" ? "oklch(48% 0.18 250 / 0.25)" : "oklch(48% 0.18 250 / 0.14)"}
                stroke={hoveredQuadrant === "C" ? "oklch(50% 0.22 245)" : "none"}
                strokeWidth="2"
              />
              <text x="172" y="415" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="72"
                fill="oklch(50% 0.22 245)" fillOpacity={hoveredQuadrant === "C" ? 1 : 0.85}>C</text>
              <text x="172" y="445" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="11"
                letterSpacing="0.14em" fill="oklch(50% 0.22 245)" fillOpacity="0.65">CONSCIENTIOUSNESS</text>
              <text x="172" y="463" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="400" fontSize="10"
                fill="oklch(65% 0.04 260)">
                {lang === "en" ? "Precise · Systematic · Quality-driven" : "Presisi · Sistematis · Berorientasi Kualitas"}
              </text>
              <rect
                x="30" y="290" width="284" height="265"
                fill="transparent"
                onMouseEnter={() => setHoveredQuadrant("C")}
                onMouseLeave={() => setHoveredQuadrant(null)}
              />
            </g>

            {/* Quadrant: S — bottom-right */}
            <g
              role="button"
              tabIndex={0}
              aria-label="S — Steadiness. Patient. Loyal. Team-oriented."
              onClick={() => scrollToType("S")}
              onKeyDown={(e) => handleMatrixKey(e, "S")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="320" y="290" width="290" height="265"
                fill={hoveredQuadrant === "S" ? "oklch(48% 0.18 145 / 0.25)" : "oklch(48% 0.18 145 / 0.14)"}
                stroke={hoveredQuadrant === "S" ? "oklch(52% 0.22 145)" : "none"}
                strokeWidth="2"
              />
              <text x="465" y="415" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="72"
                fill="oklch(52% 0.22 145)" fillOpacity={hoveredQuadrant === "S" ? 1 : 0.85}>S</text>
              <text x="465" y="445" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="11"
                letterSpacing="0.14em" fill="oklch(52% 0.22 145)" fillOpacity="0.65">STEADINESS</text>
              <text x="465" y="463" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="400" fontSize="10"
                fill="oklch(65% 0.04 260)">
                {lang === "en" ? "Patient · Loyal · Team-oriented" : "Sabar · Setia · Berorientasi Tim"}
              </text>
              <rect
                x="320" y="290" width="290" height="265"
                fill="transparent"
                onMouseEnter={() => setHoveredQuadrant("S")}
                onMouseLeave={() => setHoveredQuadrant(null)}
              />
            </g>
          </svg>

        </div>
      </section>

      {/* ===================================================================
          SECTION 4 — ASSESSMENT
      =================================================================== */}
      <section
        id="disc-assessment"
        style={{
          background: "oklch(22% 0.10 260)",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem)",
          borderTop: "1px solid oklch(32% 0.06 260)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Section heading */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1rem",
            }}
          >
            {lang === "en" ? "The Assessment" : "Penilaian"}
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "oklch(96% 0.005 80)",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
            }}
          >
            {lang === "en" ? "Discover your behavioral style." : "Temukan gaya perilakumu."}
          </h2>

          {/* NOT-STARTED state */}
          {quizState === "not-started" && (
            <div>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.95rem",
                  color: "oklch(68% 0.04 260)",
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                  maxWidth: 600,
                }}
              >
                {lang === "en"
                  ? "24 questions. Each presents four options — choose the one that best describes your natural tendency. There are no right or wrong answers. The whole assessment takes 6 to 8 minutes."
                  : "24 pertanyaan. Setiap pertanyaan menyajikan empat pilihan — pilih yang paling menggambarkan kecenderungan alami kamu. Tidak ada jawaban benar atau salah. Seluruh penilaian membutuhkan 6 hingga 8 menit."}
              </p>

              {/* Show prior result if available */}
              {discResult && (
                <div
                  style={{
                    background: "oklch(26% 0.09 260)",
                    borderTop: "2px solid oklch(65% 0.15 45)",
                    padding: "1.25rem 1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.875rem",
                      color: "oklch(68% 0.04 260)",
                      margin: 0,
                    }}
                  >
                    {lang === "en"
                      ? `Your saved result: ${normalizedDiscResult}. You can retake the assessment below.`
                      : `Hasil tersimpan kamu: ${normalizedDiscResult}. Kamu bisa mengulang penilaian di bawah ini.`}
                  </p>
                </div>
              )}

              <button
                onClick={startQuiz}
                style={{
                  background: "oklch(65% 0.15 45)",
                  color: "oklch(96% 0.005 80)",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "0.875rem 2rem",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                {lang === "en" ? "Start Assessment" : "Mulai Penilaian"}
              </button>
            </div>
          )}

          {/* IN-PROGRESS state */}
          {quizState === "in-progress" && (
            <div>
              {/* Progress bar */}
              <div
                style={{
                  background: "oklch(32% 0.06 260)",
                  height: 4,
                  borderRadius: 2,
                  marginBottom: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${((currentQ) / QS.length) * 100}%`,
                    background: getProgressBarColor(currentQ),
                    transition: "width 0.3s ease, background 0.5s ease",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.75rem",
                  color: "oklch(55% 0.04 260)",
                  marginBottom: "2rem",
                }}
              >
                {lang === "en"
                  ? `Question ${currentQ + 1} of ${QS.length}`
                  : `Pertanyaan ${currentQ + 1} dari ${QS.length}`}
              </p>

              {/* Question */}
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                  color: "oklch(96% 0.005 80)",
                  lineHeight: 1.4,
                  marginBottom: "1.75rem",
                }}
              >
                {QS[currentQ][lang]}
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {getShuffledOptions(currentQ).map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.t)}
                    style={{
                      background: "oklch(26% 0.09 260)",
                      border: "1px solid oklch(35% 0.06 260)",
                      color: "oklch(78% 0.04 260)",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      padding: "0.875rem 1.25rem",
                      textAlign: "left",
                      borderRadius: "8px",
                      cursor: "pointer",
                      minHeight: 44,
                      transition: "border-color 0.15s ease, background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!noHover) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(65% 0.15 45)";
                        (e.currentTarget as HTMLButtonElement).style.background = "oklch(28% 0.09 260)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(35% 0.06 260)";
                      (e.currentTarget as HTMLButtonElement).style.background = "oklch(26% 0.09 260)";
                    }}
                  >
                    {opt[lang]}
                  </button>
                ))}
              </div>

              {/* Back button */}
              <button
                onClick={handleBack}
                style={{
                  background: "none",
                  border: "none",
                  color: "oklch(55% 0.04 260)",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  padding: "0.5rem 0",
                  minHeight: 44,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {lang === "en" ? "Back" : "Kembali"}
              </button>
            </div>
          )}

          {/* DONE state — Results */}
          {(quizState === "done" || (discResult && quizState === "not-started")) && quizState === "done" && (
            <div>
              {/* Result heading */}
              <div style={{ marginBottom: "2rem" }}>
                {resultText && (
                  <>
                    <p
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "oklch(65% 0.15 45)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {lang === "en" ? "Your Result" : "Hasil Kamu"}
                    </p>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 600,
                        fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                        color: "oklch(96% 0.005 80)",
                        lineHeight: 1.2,
                        marginBottom: "1rem",
                      }}
                    >
                      {resultKey}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "0.95rem",
                        color: "oklch(68% 0.04 260)",
                        lineHeight: 1.75,
                        marginBottom: "2rem",
                      }}
                    >
                      {resultText}
                    </p>
                  </>
                )}

                {/* Score bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                  {(["D", "I", "S", "C"] as ScoreKey[]).map((key) => {
                    const t = DISC_TYPES.find((dt) => dt.key === key)!;
                    const pct = key === "D" ? pD : key === "I" ? pI : key === "S" ? pS : pC;
                    return (
                      <div key={key}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                          <span
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              color: t.color,
                            }}
                          >
                            {key} — {tr(t.label)}
                          </span>
                          <span
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              color: "oklch(55% 0.04 260)",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div
                          style={{
                            background: "oklch(32% 0.06 260)",
                            height: 6,
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: t.color,
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Jump to type */}
                {primaryType && (
                  <button
                    onClick={() => scrollToType(primaryType)}
                    style={{
                      background: "transparent",
                      border: "1.5px solid oklch(65% 0.15 45)",
                      color: "oklch(65% 0.15 45)",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "12px",
                      cursor: "pointer",
                      minHeight: 44,
                      marginBottom: "1rem",
                      marginRight: "0.75rem",
                    }}
                  >
                    {lang === "en" ? `Explore Your ${primaryType} Type` : `Jelajahi Tipe ${primaryType} Kamu`}
                  </button>
                )}

                {/* Save result */}
                {!resultSaved ? (
                  <button
                    onClick={handleSaveResult}
                    disabled={isPending}
                    style={{
                      background: "oklch(65% 0.15 45)",
                      color: "oklch(96% 0.005 80)",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "0.75rem 1.5rem",
                      border: "none",
                      borderRadius: "12px",
                      cursor: isPending ? "default" : "pointer",
                      minHeight: 44,
                      marginBottom: "1rem",
                    }}
                  >
                    {lang === "en" ? "Save Result" : "Simpan Hasil"}
                  </button>
                ) : (
                  <span
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.875rem",
                      color: "oklch(65% 0.15 45)",
                    }}
                  >
                    {lang === "en" ? "Result saved" : "Hasil tersimpan"} ✓
                  </span>
                )}

                {/* Retake */}
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={retake}
                    style={{
                      background: "none",
                      border: "none",
                      color: "oklch(55% 0.04 260)",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      padding: "0.5rem 0",
                      minHeight: 44,
                      textDecoration: "underline",
                    }}
                  >
                    {lang === "en" ? "Retake assessment" : "Ulangi penilaian"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          SECTION 5 — FAITH ANCHOR
      =================================================================== */}
      <section
        id="disc-faith"
        style={{
          background: "oklch(96% 0.005 80)",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem)",
          borderTop: "1px solid oklch(88% 0.008 80)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1.25rem",
            }}
          >
            {lang === "en" ? "Faith Anchor" : "Jangkar Iman"}
          </p>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "oklch(22% 0.10 260)",
              lineHeight: 1.2,
              marginBottom: "1.75rem",
            }}
          >
            {lang === "en"
              ? "Designed diversity is not a management problem."
              : "Keragaman yang dirancang bukan masalah manajemen."}
          </h2>

          {/* Scripture pull-quote */}
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
              color: "oklch(38% 0.05 260)",
              lineHeight: 1.65,
              borderLeft: "none",
              padding: 0,
              margin: "0 0 2rem 0",
              maxWidth: 600,
            }}
          >
            {lang === "en"
              ? `"For just as the body is one and has many members, and all the members of the body, though many, are one body, so it is with Christ... God arranged the members in the body, each one of them, as he chose. If all were a single member, where would the body be? As it is, there are many parts, yet one body." — 1 Corinthians 12:12-20 (ESV)`
              : `"Karena sama seperti tubuh itu satu dan anggota-anggotanya banyak, dan semua anggota itu, sekalipun banyak, merupakan satu tubuh, demikian pula Kristus... Allah telah menempatkan anggota-anggota, masing-masing secara khusus, di dalam tubuh, seperti yang dikehendaki-Nya. Andaikata semuanya satu anggota, di manakah tubuh? Memang ada banyak anggota, tetapi hanya satu tubuh." — 1 Korintus 12:12-20 (TB)`}
          </blockquote>

          {/* Faith prose — 3 paragraphs */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              color: "oklch(38% 0.05 260)",
              lineHeight: 1.75,
              marginBottom: "1.25rem",
            }}
          >
            {lang === "en"
              ? "The standard leadership response to behavioral diversity is: how do we align everyone? The New Testament's response is different. Paul's argument in 1 Corinthians 12 is not that we should tolerate difference but that difference was placed in the body intentionally. The weaker parts are not liabilities to be trained out. They are essential. No single behavioral style contains all that God designed leadership to require."
              : "Respons kepemimpinan standar terhadap keragaman perilaku adalah: bagaimana kita menyelaraskan semua orang? Respons Perjanjian Baru berbeda. Argumen Paulus dalam 1 Korintus 12 bukan bahwa kita harus mentolerir perbedaan tetapi bahwa perbedaan itu ditempatkan dalam tubuh dengan sengaja. Bagian yang lemah bukan beban yang perlu dilatih keluar. Mereka penting. Tidak ada satu gaya perilaku pun yang mengandung semua yang dirancang Allah untuk diperlukan kepemimpinan."}
          </p>

          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              color: "oklch(38% 0.05 260)",
              lineHeight: 1.75,
              marginBottom: "1.25rem",
            }}
          >
            {lang === "en"
              ? "This reframes DISC entirely. The D-type leader is not the ideal that S and C types should aspire toward. The S-type's patience is not a weakness waiting to be fixed. Each orientation reflects something of the image of God in how human beings were made — rational, relational, creative, precise, bold, steadfast. 1 Corinthians 12 says you need all four around the table. Behavioral diversity is one expression of the reality that no single person fully images God — the community together carries what the individual cannot."
              : "Ini membingkai ulang DISC sepenuhnya. Pemimpin tipe D bukan ideal yang seharusnya dicapai oleh tipe S dan C. Kesabaran tipe S bukan kelemahan yang menunggu untuk diperbaiki. Setiap orientasi mencerminkan sesuatu dari gambar Allah dalam cara manusia diciptakan — rasional, relasional, kreatif, presisi, berani, teguh. 1 Korintus 12 mengatakan kamu membutuhkan keempat tipe di sekitar meja. Keragaman perilaku adalah salah satu ungkapan dari kenyataan bahwa tidak ada satu orang pun yang sepenuhnya mencerminkan Allah — komunitas bersama-sama membawa apa yang tidak dapat dibawa oleh individu."}
          </p>

          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              color: "oklch(38% 0.05 260)",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            {lang === "en"
              ? "In global teams, the tendency is to code one behavioral style as professional and the others as deficits. D-style directness gets coded as competent leadership. S-style harmony gets coded as passivity. C-style precision gets coded as over-engineering. I-style relational energy gets coded as insufficiently serious. 1 Corinthians 12 subverts all of this. The body does not get to decide which members are necessary."
              : "Dalam tim global, kecenderungannya adalah mengkode satu gaya perilaku sebagai profesional dan yang lain sebagai kekurangan. Kecenderungan langsung tipe D dikode sebagai kepemimpinan yang kompeten. Keharmonisan tipe S dikode sebagai kepasifan. Ketepatan tipe C dikode sebagai terlalu berlebihan. Energi relasional tipe I dikode sebagai kurang serius. 1 Korintus 12 menumbangkan semua ini. Tubuh tidak berhak memutuskan anggota mana yang diperlukan."}
          </p>

          {/* Reflection question */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
              color: "oklch(38% 0.05 260)",
              lineHeight: 1.65,
              borderTop: "1px solid oklch(88% 0.008 80)",
              paddingTop: "1.5rem",
            }}
          >
            {lang === "en"
              ? "Which type in your team carries what you cannot see on your own?"
              : "Tipe apa dalam timmu yang membawa apa yang tidak bisa kamu lihat sendiri?"}
          </p>
        </div>
      </section>

      {/* ===================================================================
          SECTION 7 — KEY TAKEAWAYS
      =================================================================== */}
      <section
        id="disc-takeaways"
        style={{
          background: "oklch(88% 0.008 80)",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "1rem",
            }}
          >
            {lang === "en" ? "Key Takeaways" : "Poin Utama"}
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "oklch(22% 0.10 260)",
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            {lang === "en" ? "What to carry forward." : "Apa yang perlu dibawa ke depan."}
          </h2>

          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {(lang === "en"
              ? [
                  "DISC describes behavioral tendencies, not fixed identity. Read your result as your default setting, not your ceiling.",
                  "Every type brings a strength the other three need. The question is not which type is best — it is how your team covers the full picture together.",
                  "Your type lands differently across cultures. A D-style in Jakarta operates differently than a D-style in Amsterdam. The label is a starting point, not a conclusion.",
                  "Behavioral awareness is not enough on its own. What it enables is a shared vocabulary — which makes hard conversations less threatening.",
                  "Your type can grow. The history of biblical leadership is full of leaders whose style deepened and widened through friction, failure, and time.",
                ]
              : [
                  "DISC menggambarkan kecenderungan perilaku, bukan identitas tetap. Baca hasilmu sebagai pengaturan default-mu, bukan batas kemampuanmu.",
                  "Setiap tipe membawa kekuatan yang dibutuhkan tiga tipe lainnya. Pertanyaannya bukan tipe mana yang terbaik — melainkan bagaimana timmu mencakup gambaran lengkap bersama.",
                  "Tipe-mu mendarat secara berbeda di berbagai budaya. Gaya D di Jakarta beroperasi secara berbeda dari gaya D di Amsterdam. Labelnya adalah titik awal, bukan kesimpulan.",
                  "Kesadaran perilaku saja tidak cukup. Yang memungkinkannya adalah kosakata bersama — yang membuat percakapan sulit menjadi kurang mengancam.",
                  "Tipe-mu bisa bertumbuh. Sejarah kepemimpinan Alkitabiah penuh dengan pemimpin yang gayanya semakin dalam dan melebar melalui gesekan, kegagalan, dan waktu.",
                ]
            ).map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: "2rem",
                    color: "oklch(65% 0.15 45)",
                    lineHeight: 1,
                    flexShrink: 0,
                    minWidth: "2rem",
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
                    color: "oklch(30% 0.05 260)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {item}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================================================================
          SOURCES DROPDOWN + SEO BACKGROUND
      =================================================================== */}
      <section
        style={{
          background: "oklch(96% 0.005 80)",
          padding: "2rem clamp(1.25rem, 5vw, 3rem)",
          borderTop: "1px solid oklch(88% 0.008 80)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SourcesDropdown
            sources={[
              "Marston, William Moulton — Emotions of Normal People (Harcourt, Brace and Company, 1928) — https://www.goodreads.com/book/show/6827443-emotions-of-normal-people",
              "International DISC Institute — Marston's Theoretical Work — https://interdisc.org/marstons-theoretical-work/",
              "discprofile.com (Wiley) — Science Behind DiSC — https://www.discprofile.com/what-is-disc/research-reliability-and-validity",
            ]}
            lang={lang}
            markerStyle="superscript"
            background="oklch(96% 0.005 80)"
          />

          {/* SEO Background — collapsible */}
          <div style={{ marginTop: "1.5rem", borderTop: "1px solid oklch(88% 0.008 80)", paddingTop: "1rem" }}>
            <button
              onClick={() => setBgOpen(!bgOpen)}
              aria-expanded={bgOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                minHeight: 44,
              }}
            >
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  color: "oklch(45% 0.04 260)",
                }}
              >
                {lang === "en" ? "Background Reading" : "Bacaan Latar Belakang"}
              </span>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{
                  transform: bgOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  color: "oklch(55% 0.04 260)",
                }}
              >
                <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {bgOpen && (
              <div style={{ paddingTop: "1rem" }}>
                {lang === "en" ? (
                  <>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      The DISC personality profile is one of the most widely used behavioral frameworks in leadership development, team-building, and cross-cultural communication training. Based on William Moulton Marston&apos;s 1928 research, DISC identifies four behavioral tendencies — Dominance, Influence, Steadiness, and Conscientiousness — that describe how people tend to approach tasks, relationships, and challenges.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      Unlike fixed personality type systems, DISC focuses on observable behavior rather than underlying traits. This makes it particularly useful in cross-cultural leadership contexts, where behavioral patterns are more immediately visible and negotiable than deep-seated personality structures. Research supports DISC&apos;s internal consistency (Cronbach&apos;s alpha .87), though it lacks the cross-cultural validation studies that characterize the Big Five personality model.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      Christian applications of DISC have been developed since Florence Littauer&apos;s Personality Plus (1983) and Ken Voges&apos; Understanding How Others Misunderstand You (1990). These works connect the four behavioral orientations to Scripture, particularly to Paul&apos;s body-of-Christ metaphor in 1 Corinthians 12, which frames behavioral diversity as intentional divine design rather than a leadership problem to be solved.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      For cross-cultural leaders, DISC provides a shared vocabulary for naming behavioral differences without attributing blame or pathology. In multicultural teams — particularly in Indonesian and Southeast Asian contexts — understanding that S-type harmony-preservation behaviors reflect cultural competence rather than personal weakness, and that C-type documentation requests may read as distrust in oral-preference cultures, transforms how teams navigate conflict and collaboration.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "0" }}>
                      The four DISC types — D (Dominance), I (Influence), S (Steadiness), C (Conscientiousness) — are not boxes but behavioral tendencies. Every leader carries all four orientations in varying degrees. The assessment identifies which orientation is most natural under typical conditions. Growth in cross-cultural leadership involves expanding your behavioral range — not abandoning your primary style, but developing fluency in the other three.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      Profil kepribadian DISC adalah salah satu kerangka perilaku yang paling banyak digunakan dalam pengembangan kepemimpinan, pembangunan tim, dan pelatihan komunikasi lintas budaya. Berdasarkan penelitian William Moulton Marston tahun 1928, DISC mengidentifikasi empat kecenderungan perilaku — Dominance, Influence, Steadiness, dan Conscientiousness — yang menggambarkan bagaimana orang cenderung mendekati tugas, hubungan, dan tantangan.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      Tidak seperti sistem tipe kepribadian yang tetap, DISC berfokus pada perilaku yang dapat diamati daripada sifat-sifat yang mendasarinya. Hal ini membuatnya sangat berguna dalam konteks kepemimpinan lintas budaya, di mana pola perilaku lebih segera terlihat dan dapat dinegosiasikan daripada struktur kepribadian yang mendalam. Penelitian mendukung konsistensi internal DISC (alpha Cronbach .87), meskipun kurang memiliki studi validasi lintas budaya yang menjadi ciri model kepribadian Big Five.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      Aplikasi Kristen dari DISC telah dikembangkan sejak Personality Plus karya Florence Littauer (1983) dan Understanding How Others Misunderstand You karya Ken Voges (1990). Karya-karya ini menghubungkan empat orientasi perilaku dengan Kitab Suci, khususnya dengan metafora tubuh Kristus Paulus dalam 1 Korintus 12, yang membingkai keragaman perilaku sebagai desain ilahi yang disengaja daripada masalah kepemimpinan yang harus diselesaikan.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "1rem" }}>
                      Bagi pemimpin lintas budaya, DISC memberikan kosakata bersama untuk menamai perbedaan perilaku tanpa mengatribusikan kesalahan atau patologi. Dalam tim multikultural — khususnya dalam konteks Indonesia dan Asia Tenggara — memahami bahwa perilaku pelestarian harmoni tipe S mencerminkan kompetensi budaya daripada kelemahan pribadi, dan bahwa permintaan dokumentasi tipe C mungkin terbaca sebagai ketidakpercayaan dalam budaya preferensi lisan, mengubah cara tim menavigasi konflik dan kolaborasi.
                    </p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "oklch(40% 0.04 260)", lineHeight: 1.75, marginBottom: "0" }}>
                      Keempat tipe DISC — D (Dominance), I (Influence), S (Steadiness), C (Conscientiousness) — bukan kotak tetapi kecenderungan perilaku. Setiap pemimpin membawa keempat orientasi dalam tingkat yang bervariasi. Penilaian mengidentifikasi orientasi mana yang paling alami dalam kondisi biasa. Pertumbuhan dalam kepemimpinan lintas budaya melibatkan perluasan rentang perilakumu — bukan meninggalkan gaya utamamu, tetapi mengembangkan kelancaran dalam tiga lainnya.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
