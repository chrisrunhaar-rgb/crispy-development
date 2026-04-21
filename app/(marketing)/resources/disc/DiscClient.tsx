"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard, saveDISCResult } from "../actions";

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────

// Fixed per-question shuffle orders so options are never always in D/I/S/C order
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
    { en: "The one who catches errors and ensures quality.", id: "Orang yang menangkap kesalahan dan memastikan kualitas.", t: "C" },
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

// ── DISC TYPE DATA ────────────────────────────────────────────────────────────

const DISC_TYPES = [
  {
    key: "D",
    label: { en: "Dominance", id: "Dominance" },
    tagline: { en: "Direct. Bold. Results-driven.", id: "Langsung. Berani. Berorientasi Hasil." },
    color: "oklch(52% 0.20 25)",
    colorLight: "oklch(65% 0.16 25)",
    colorVeryLight: "oklch(93% 0.04 25)",
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
  },
  {
    key: "I",
    label: { en: "Influence", id: "Influence" },
    tagline: { en: "Enthusiastic. Persuasive. People-first.", id: "Antusias. Persuasif. Mengutamakan Orang." },
    color: "oklch(52% 0.18 80)",
    colorLight: "oklch(65% 0.14 80)",
    colorVeryLight: "oklch(93% 0.04 80)",
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
  },
  {
    key: "S",
    label: { en: "Steadiness", id: "Steadiness" },
    tagline: { en: "Patient. Loyal. Consistently supportive.", id: "Sabar. Setia. Konsisten dalam Dukungan." },
    color: "oklch(48% 0.18 145)",
    colorLight: "oklch(62% 0.14 145)",
    colorVeryLight: "oklch(92% 0.04 145)",
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
  },
  {
    key: "C",
    label: { en: "Conscientiousness", id: "Conscientiousness" },
    tagline: { en: "Precise. Analytical. Excellence-driven.", id: "Tepat. Analitis. Berorientasi Keunggulan." },
    color: "oklch(48% 0.18 250)",
    colorLight: "oklch(62% 0.14 250)",
    colorVeryLight: "oklch(92% 0.04 250)",
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
  },
];

// ── RESULT PROFILES ───────────────────────────────────────────────────────────

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

// ── SCORE CALCULATION ─────────────────────────────────────────────────────────

function getResultKey(scores: { D: number; I: number; S: number; C: number }): ResultKey {
  const entries = Object.entries(scores) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  const second = entries[1];
  const threshold = top[1] * 0.75;
  if (second[1] >= threshold) {
    const combo = [top[0], second[0]].sort().join("") as ResultKey;
    return combo;
  }
  return top[0] as ResultKey;
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Lang = "en" | "id";
type ScoreKey = "D" | "I" | "S" | "C";
type QuizState = "idle" | "active" | "done";

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DiscClient({
  isSaved: isSavedProp,
  discResult,
  discScores,
}: {
  isSaved: boolean;
  discResult: string | null;
  discScores: { D: number; I: number; S: number; C: number } | null;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [quizState, setQuizState] = useState<QuizState>(
    discResult && discScores ? "done" : "idle"
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<ScoreKey, number>>(
    discScores ?? { D: 0, I: 0, S: 0, C: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<ScoreKey[]>([]);
  const [saved, setSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!discResult);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tr = (en: string, id: string) => lang === "en" ? en : id;

  // Build shuffled options for current question using fixed per-question shuffle
  function getShuffledOptions(qIndex: number) {
    const order = SHUFFLE_ORDERS[qIndex] ?? [0, 1, 2, 3];
    return order.map((i) => QS[qIndex].options[i]);
  }

  function startQuiz() {
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(t: ScoreKey) {
    const newScores = { ...scores, [t]: scores[t] + 1 };
    const newHistory = [...answerHistory, t];
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
    if (currentQ === 0) return;
    const prevType = answerHistory[answerHistory.length - 1];
    setAnswerHistory(answerHistory.slice(0, -1));
    setScores({ ...scores, [prevType]: scores[prevType] - 1 });
    setCurrentQ(currentQ - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
  }

  const total = scores.D + scores.I + scores.S + scores.C;
  const resultKey = total > 0 ? getResultKey(scores) : "D";
  const resultText = RESULT_PROFILES[lang][resultKey];

  const pD = total > 0 ? Math.round((scores.D / total) * 100) : 0;
  const pI = total > 0 ? Math.round((scores.I / total) * 100) : 0;
  const pS = total > 0 ? Math.round((scores.S / total) * 100) : 0;
  const pC = total > 0 ? 100 - pD - pI - pS : 0;

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("disc");
      if (!result.error) setSaved(true);
    });
  }

  function handleSaveResult() {
    startTransition(async () => {
      await saveDISCResult(resultKey, { D: pD, I: pI, S: pS, C: pC });
      setResultSaved(true);
    });
  }

  const primaryType = DISC_TYPES.find(t => t.key === resultKey[0]) ?? DISC_TYPES[0];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        paddingTop: "clamp(2.5rem, 4vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Faint background: DISC letters */}
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "clamp(-2rem, 2vw, 4rem)",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.5rem, 2vw, 1.5rem)",
          opacity: 0.04,
          pointerEvents: "none",
          userSelect: "none",
        }}>
          {["D", "I", "S", "C"].map((letter, i) => {
            const colors = [
              "oklch(52% 0.20 25)",
              "oklch(52% 0.18 80)",
              "oklch(48% 0.18 145)",
              "oklch(48% 0.18 250)",
            ];
            return (
              <span key={letter} style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "clamp(5rem, 12vw, 14rem)",
                fontWeight: 900,
                color: colors[i],
                lineHeight: 1,
              }}>
                {letter}
              </span>
            );
          })}
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Breadcrumb */}
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← {tr("Resources", "Sumber Daya")}
          </Link>

          {/* Lang toggle */}
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.75rem" }}>
            {(["en", "id"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", padding: "0.3rem 0.7rem",
                background: lang === l ? "oklch(65% 0.15 45)" : "transparent",
                color: lang === l ? "oklch(14% 0.08 260)" : "oklch(60% 0.04 260)",
                border: "1px solid", borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(35% 0.05 260)",
                cursor: "pointer",
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="pathway-badge" style={{ background: "oklch(65% 0.15 45 / 0.15)", color: "oklch(82% 0.08 60)", marginBottom: "1.25rem", display: "inline-flex" }}>
            {tr("Cross-Cultural Leadership", "Kepemimpinan Lintas Budaya")}
          </span>

          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "18ch" }}>
            {lang === "en"
              ? <>DISC<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Personality Profile.</span></>
              : <>DISC<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Profil Kepribadian.</span></>}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem" }}>
            {tr(
              "Understand your behavioural style and how it shapes the way you lead, communicate, and collaborate across cultures.",
              "Pahami gaya perilaku Anda dan bagaimana hal itu membentuk cara Anda memimpin, berkomunikasi, dan berkolaborasi lintas budaya."
            )}
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "3rem" }}>
            <button onClick={startQuiz} className="btn-primary">
              {quizState === "done"
                ? tr("Retake the Quiz →", "Ulangi Kuis →")
                : tr("Discover Your Style →", "Temukan Gaya Anda →")}
            </button>
            <a href="#disc-types" className="btn-ghost" style={{ textDecoration: "none" }}>
              {tr("Explore the Styles", "Jelajahi Gaya-Gaya")}
            </a>
            {saved ? (
              <Link href="/dashboard" style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700,
                letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
              }}>
                ✓ {tr("In your dashboard", "Di dashboard Anda")}
              </Link>
            ) : (
              <button onClick={handleSave} disabled={isPending} style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700,
                letterSpacing: "0.06em", color: "oklch(97% 0.005 80)",
                background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)",
                border: "none", padding: "0.625rem 1.25rem",
                cursor: isPending ? "wait" : "pointer", transition: "background 0.15s",
              }}>
                {isPending
                  ? tr("Saving…", "Menyimpan…")
                  : tr("+ Add to Dashboard", "+ Tambah ke Dashboard")}
              </button>
            )}
          </div>

          {/* DISC letter badges */}
          <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 2rem)", alignItems: "center", flexWrap: "wrap" }}>
            {DISC_TYPES.map(type => (
              <a key={type.key} href={`#disc-${type.key}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                <div style={{
                  width: "clamp(2.5rem, 5vw, 3.5rem)",
                  height: "clamp(2.5rem, 5vw, 3.5rem)",
                  background: type.bg,
                  border: `2px solid ${type.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))",
                }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "clamp(1rem, 2vw, 1.5rem)", color: type.colorLight }}>
                    {type.key}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight }}>
                  {type.label[lang]}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
                {tr("A Behavioural Framework", "Kerangka Perilaku")}
              </p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>
                {lang === "en"
                  ? <>Understanding how people<br />are wired to behave.</>
                  : <>Memahami bagaimana orang<br />terkondisi untuk berperilaku.</>}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch", marginBottom: "1rem" }}>
                {tr(
                  "DISC is one of the most widely used behavioural frameworks in the world. It describes four primary styles — Dominance, Influence, Steadiness, and Conscientiousness — that shape how people communicate, make decisions, handle conflict, and respond to pressure.",
                  "DISC adalah salah satu kerangka perilaku yang paling banyak digunakan di dunia. Ini menggambarkan empat gaya utama — Dominance, Influence, Steadiness, dan Conscientiousness — yang membentuk cara orang berkomunikasi, mengambil keputusan, menangani konflik, dan merespons tekanan."
                )}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
                {tr(
                  "In cross-cultural leadership, DISC becomes even more powerful. When you understand your own default style, you can adapt more intentionally to the people and cultures around you — without losing who you are.",
                  "Dalam kepemimpinan lintas budaya, DISC menjadi jauh lebih powerful. Ketika Anda memahami gaya default Anda sendiri, Anda bisa beradaptasi lebih disengaja terhadap orang-orang dan budaya di sekitar Anda — tanpa kehilangan jati diri Anda."
                )}
              </p>
              <a href="#quiz-section" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
                {tr("Take the Assessment →", "Mulai Penilaian →")}
              </a>
            </div>

            {/* Right: 2x2 summary grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "oklch(88% 0.008 80)" }}>
              {DISC_TYPES.map(type => (
                <div key={type.key} style={{ background: "white", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <div style={{
                      width: "2rem", height: "2rem",
                      background: type.colorVeryLight,
                      border: `2px solid ${type.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "0.875rem", color: type.color }}>
                        {type.key}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "oklch(22% 0.005 260)" }}>
                      {type.label[lang]}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: type.color, fontWeight: 700, letterSpacing: "0.04em" }}>
                    {type.tagline[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DISC TYPE DETAIL SECTIONS ── */}
      <div id="disc-types">
        {DISC_TYPES.map((type) => (
          <section key={type.key} id={`disc-${type.key}`} style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: type.bg }}>
            <div className="container-wide">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 5rem)", alignItems: "start" }}>

                {/* Left: type identity */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    <div style={{
                      width: "4rem", height: "4rem",
                      border: `3px solid ${type.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "2rem", color: type.colorLight }}>
                        {type.key}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.2rem" }}>
                        {type.label[lang]}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: type.color, fontWeight: 600 }}>
                        {type.tagline[lang]}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(70% 0.04 260)", marginBottom: "2rem" }}>
                    {type.overview[lang]}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ padding: "1.25rem", background: "oklch(97% 0.005 80 / 0.05)", borderLeft: `3px solid ${type.color}` }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.5rem" }}>
                        {tr("Motivated by", "Termotivasi oleh")}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(72% 0.04 260)" }}>
                        {type.motivation[lang]}
                      </p>
                    </div>
                    <div style={{ padding: "1.25rem", background: "oklch(97% 0.005 80 / 0.05)", borderLeft: `3px solid ${type.color}` }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.5rem" }}>
                        {tr("Fears", "Ketakutan")}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(72% 0.04 260)" }}>
                        {type.fear[lang]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: strengths, blindspots, communication, cross-cultural */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                  {/* Expand/collapse toggle */}
                  <button
                    onClick={() => setExpandedType(expandedType === type.key ? null : type.key)}
                    style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: type.colorLight, background: "oklch(97% 0.005 80 / 0.06)",
                      border: `1px solid ${type.color}40`,
                      padding: "0.75rem 1.25rem", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <span>{expandedType === type.key ? tr("Hide Details ↑", "Sembunyikan ↑") : tr("Show Full Profile ↓", "Tampilkan Profil Lengkap ↓")}</span>
                  </button>

                  {/* Always visible: strengths + blindspots */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.75rem" }}>
                        {tr("Strengths", "Kekuatan")}
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {type.strengths[lang].map((s, i) => (
                          <li key={i} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(72% 0.04 260)", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                            <span style={{ color: type.color, flexShrink: 0, marginTop: "0.1rem" }}>+</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.75rem" }}>
                        {tr("Blind Spots", "Titik Buta")}
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {type.blindspots[lang].map((s, i) => (
                          <li key={i} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(72% 0.04 260)", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                            <span style={{ color: "oklch(55% 0.12 25)", flexShrink: 0, marginTop: "0.1rem" }}>−</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Expanded: communication + cross-cultural */}
                  {expandedType === type.key && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ padding: "1.25rem 1.5rem", background: "oklch(97% 0.005 80 / 0.05)", borderTop: `2px solid ${type.color}` }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.625rem" }}>
                          {tr("How to Communicate with Them", "Cara Berkomunikasi dengan Mereka")}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)" }}>
                          {type.communication[lang]}
                        </p>
                      </div>
                      <div style={{ padding: "1.25rem 1.5rem", background: "oklch(97% 0.005 80 / 0.05)", borderTop: `2px solid ${type.color}` }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.625rem" }}>
                          {tr("Cross-Cultural Leadership Note", "Catatan Kepemimpinan Lintas Budaya")}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)" }}>
                          {type.crossCultural[lang]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── QUIZ ── */}
      <section id="quiz-section" style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)", position: "relative" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>
            {tr("Self-Assessment", "Penilaian Diri")}
          </p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>
            {tr("Discover your DISC style.", "Temukan gaya DISC Anda.")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", marginBottom: "3rem", maxWidth: "52ch" }}>
            {tr(
              "24 questions. Choose what feels most natural — not what you think you should do. Your result shows a score breakdown across all four styles.",
              "24 pertanyaan. Pilih yang paling alami — bukan apa yang Anda pikir seharusnya Anda lakukan. Hasilnya menunjukkan skor dari keempat gaya perilaku."
            )}
          </p>

          <div style={{ maxWidth: "680px", background: "oklch(30% 0.12 260)", overflow: "hidden" }}>
            <div style={{ height: "3px", background: `linear-gradient(90deg, oklch(52% 0.20 25), oklch(52% 0.18 80), oklch(48% 0.18 145), oklch(48% 0.18 250))` }} />
            <div style={{ padding: "clamp(2rem, 4vw, 3.5rem)" }}>

              {quizState === "idle" && (
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                    {tr(
                      "Each scenario has four options. There are no right or wrong answers. Choose the response that feels most like you — not what you think you should do.",
                      "Setiap skenario memiliki empat pilihan. Tidak ada jawaban yang benar atau salah. Pilih respons yang paling mencerminkan diri Anda — bukan apa yang Anda pikir seharusnya Anda lakukan."
                    )}
                  </p>
                  <button onClick={startQuiz} className="btn-primary">
                    {tr("Begin the Quiz →", "Mulai Kuis →")}
                  </button>
                </div>
              )}

              {quizState === "active" && (
                <div>
                  {/* Progress bar */}
                  <div style={{ marginBottom: "2rem" }}>
                    <div style={{ height: "2px", background: "oklch(97% 0.005 80 / 0.08)", marginBottom: "0.625rem" }}>
                      <div style={{ height: "100%", background: "oklch(65% 0.15 45)", width: `${((currentQ + 1) / QS.length) * 100}%`, transition: "width 0.4s ease" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.008 260)" }}>
                      {tr("Question", "Pertanyaan")} {currentQ + 1} {tr("of", "dari")} {QS.length}
                    </p>
                  </div>

                  {/* Question */}
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "1.0625rem", color: "oklch(97% 0.005 80)", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                    {QS[currentQ][lang]}
                  </p>

                  {/* Options */}
                  <style>{`
                    .disc-opt { background: oklch(97% 0.005 80 / 0.04); border: 1px solid oklch(97% 0.005 80 / 0.1); color: oklch(78% 0.04 260); }
                    @media (hover: hover) { .disc-opt:hover { background: oklch(97% 0.005 80 / 0.08) !important; border-color: oklch(97% 0.005 80 / 0.2) !important; color: oklch(97% 0.005 80) !important; } }
                    .disc-opt:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 2px; }
                  `}</style>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {getShuffledOptions(currentQ).map((opt, i) => (
                      <button
                        key={i}
                        className="disc-opt"
                        onClick={() => handleAnswer(opt.t as ScoreKey)}
                        style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.5,
                          padding: "1rem 1.25rem", textAlign: "left", cursor: "pointer",
                          transition: "background 0.15s, border-color 0.15s, color 0.15s",
                          display: "flex", gap: "1rem", alignItems: "flex-start",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em", color: "oklch(55% 0.008 260)", flexShrink: 0, marginTop: "0.15rem" }}>
                          {["A", "B", "C", "D"][i]}
                        </span>
                        {opt[lang]}
                      </button>
                    ))}
                  </div>

                  {/* Back button */}
                  {currentQ > 0 && (
                    <button
                      onClick={handleBack}
                      style={{
                        marginTop: "1.25rem",
                        fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: "oklch(55% 0.008 260)", background: "none",
                        border: "1px solid oklch(42% 0.008 260 / 0.5)",
                        padding: "0.625rem 1.25rem", cursor: "pointer",
                        alignSelf: "flex-start",
                      }}
                    >
                      ← {tr("Go Back", "Kembali")}
                    </button>
                  )}
                </div>
              )}

              {quizState === "done" && (
                <div>
                  <p className="t-label" style={{ color: primaryType.colorLight, marginBottom: "1.25rem", fontSize: "0.62rem", letterSpacing: "0.14em" }}>
                    {tr("Your DISC Profile", "Profil DISC Anda")}
                  </p>

                  {/* Identity block — type badge + name + tagline + score bars unified */}
                  <div style={{
                    borderLeft: `3px solid ${primaryType.color}`,
                    paddingLeft: "1.25rem",
                    marginBottom: "2rem",
                  }}>
                    {/* Type letter + name row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                      <div style={{
                        width: "3rem", height: "3rem", flexShrink: 0,
                        background: `${primaryType.color}18`,
                        border: `2px solid ${primaryType.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "1.5rem", color: primaryType.colorLight, lineHeight: 1 }}>
                          {resultKey[0]}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: "oklch(97% 0.005 80)", lineHeight: 1.15, marginBottom: "0.2rem" }}>
                          {primaryType.label[lang]}
                          {resultKey.length === 2 && (
                            <span style={{ color: primaryType.colorLight, fontSize: "0.9rem", fontWeight: 600, marginLeft: "0.5rem", opacity: 0.8 }}>
                              / {DISC_TYPES.find(t => t.key === resultKey[1])?.label[lang]}
                            </span>
                          )}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: primaryType.colorLight, fontWeight: 600, letterSpacing: "0.02em" }}>
                          {primaryType.tagline[lang]}
                        </p>
                      </div>
                    </div>

                    {/* Score bars — tighter, mobile-safe */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {[
                        { key: "D", label: "D", fullLabel: tr("Dominance", "Dominance"), pct: pD, color: "oklch(52% 0.20 25)", light: "oklch(65% 0.16 25)" },
                        { key: "I", label: "I", fullLabel: tr("Influence", "Influence"), pct: pI, color: "oklch(52% 0.18 80)", light: "oklch(65% 0.14 80)" },
                        { key: "S", label: "S", fullLabel: tr("Steadiness", "Steadiness"), pct: pS, color: "oklch(48% 0.18 145)", light: "oklch(62% 0.14 145)" },
                        { key: "C", label: "C", fullLabel: tr("Conscientiousness", "Conscientiousness"), pct: pC, color: "oklch(48% 0.18 250)", light: "oklch(62% 0.14 250)" },
                      ].map(bar => {
                        const isPrimary = bar.key === resultKey[0];
                        return (
                          <div key={bar.key} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{
                              fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "0.65rem",
                              color: isPrimary ? bar.light : bar.color,
                              width: "0.75rem", flexShrink: 0, textAlign: "center",
                              opacity: isPrimary ? 1 : 0.7,
                            }}>
                              {bar.key}
                            </span>
                            <div style={{ flex: 1, height: isPrimary ? "7px" : "4px", background: "oklch(97% 0.005 80 / 0.07)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${bar.pct}%`, background: isPrimary ? bar.light : bar.color, opacity: isPrimary ? 1 : 0.55, transition: "width 1s ease" }} />
                            </div>
                            <span style={{
                              fontFamily: "var(--font-montserrat)", fontSize: isPrimary ? "0.85rem" : "0.75rem",
                              fontWeight: isPrimary ? 800 : 600,
                              color: isPrimary ? "oklch(92% 0.005 80)" : "oklch(58% 0.04 260)",
                              width: "2.5rem", textAlign: "right", flexShrink: 0,
                            }}>
                              {bar.pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Result profile text — personal insight moment */}
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.75,
                    color: "oklch(82% 0.03 260)", marginBottom: "2.5rem",
                    paddingBottom: "2rem",
                    borderBottom: "1px solid oklch(97% 0.005 80 / 0.07)",
                  }}>
                    {resultText}
                  </p>

                  {/* Save to dashboard — soft, non-intrusive */}
                  <div style={{ marginBottom: "1.75rem" }}>
                    {resultSaved ? (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(60% 0.14 145)", letterSpacing: "0.04em" }}>
                        ✓ {tr("Result saved to your dashboard", "Hasil tersimpan ke dashboard Anda")}
                      </p>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(58% 0.04 260)", lineHeight: 1.5 }}>
                          {tr("Keep this result — save it to your dashboard.", "Simpan hasil ini ke dashboard Anda.")}
                        </p>
                        <button
                          onClick={handleSaveResult}
                          disabled={isPending}
                          style={{
                            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                            letterSpacing: "0.07em", textTransform: "uppercase",
                            background: "oklch(65% 0.15 45)", color: "oklch(14% 0.08 260)",
                            border: "none", padding: "0.6rem 1.375rem", cursor: isPending ? "wait" : "pointer",
                            whiteSpace: "nowrap", flexShrink: 0,
                          }}
                        >
                          {isPending ? tr("Saving…", "Menyimpan…") : tr("Save My Result →", "Simpan Hasilku →")}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Retake + dashboard */}
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button onClick={retake} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(58% 0.04 260)", background: "none", border: "1px solid oklch(38% 0.008 260)", padding: "0.7rem 1.375rem", cursor: "pointer" }}>
                      {tr("Retake Quiz", "Ulangi Kuis")}
                    </button>
                    <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>
                      {tr("Go to Dashboard →", "Ke Dashboard →")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {tr("More in the Library", "Lebih Banyak di Perpustakaan")}
            </p>
            <h2 className="t-section" style={{ marginBottom: "1rem" }}>
              {lang === "en"
                ? <>Part of the full<br />content library.</>
                : <>Bagian dari perpustakaan<br />konten lengkap.</>}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", marginBottom: "2rem", maxWidth: "48ch" }}>
              {tr(
                "The DISC Profile is one of many frameworks in the Crispy Development library — tools, reflections, and assessments built for cross-cultural leaders.",
                "Profil DISC adalah salah satu dari banyak kerangka kerja dalam perpustakaan Crispy Development — alat, refleksi, dan penilaian yang dibangun untuk pemimpin lintas budaya."
              )}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {saved ? (
                <Link href="/dashboard" className="btn-primary">
                  {tr("Go to Dashboard →", "Ke Dashboard →")}
                </Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? tr("Saving…", "Menyimpan…") : tr("+ Save to Dashboard", "+ Simpan ke Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-ghost" style={{ textDecoration: "none" }}>
                {tr("Browse Library →", "Jelajahi Perpustakaan →")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
