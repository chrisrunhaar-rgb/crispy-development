"use client";
import React, { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
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
    en_tagline: "Relief, mixed with something harder to place",
    id_tagline: "Lega, bercampur sesuatu yang sulit dijelaskan",
    en_vignette: "She walked into her parents' house and felt less than she expected. Some relief, but also a strange blankness. She smiled, and her family said how well she seemed.",
    id_vignette: "Ia masuk ke rumah orang tuanya, tetapi perasaannya tidak sekuat yang ia bayangkan. Ada sedikit kelegaan, tetapi juga kekosongan yang aneh. Ia tersenyum, dan keluarganya berkata ia tampak baik-baik saja.",
    en_feelings: [
      "A strange flatness where you expected to feel excited or relieved",
      "Hyper-awareness of everything you left behind: sounds, smells, conversations",
      "Acting 'normal' for family and friends while feeling unsettled inside",
    ],
    id_feelings: [
      "Kekosongan aneh di mana Anda berharap merasa bersemangat atau lega",
      "Kesadaran yang berlebihan tentang semua yang Anda tinggalkan: suara, bau, percakapan",
      "Bersikap 'normal' di depan keluarga dan teman sambil merasa gelisah di dalam hati",
    ],
    en_traps: [
      "Staying busy to avoid sitting with the disorientation",
      "Telling stories about where you have been more often than others can take in",
      "Reassuring everyone (and yourself) that you're fine",
    ],
    id_traps: [
      "Tetap sibuk untuk menghindari duduk dengan disorientasi",
      "Bercerita tentang tempat Anda dulu tinggal lebih sering daripada yang sanggup didengar orang lain",
      "Meyakinkan semua orang (dan diri sendiri) bahwa Anda baik-baik saja",
    ],
    en_helps: [
      "Put your losses into words. Make a list and write it down. Losses that stay unspoken often weigh more.",
      "Allow yourself at least 30 minutes a day of quiet, with no screens and no productivity. Let your nervous system decompress.",
      "Find one person who has lived cross-culturally and tell them the real version of how you're doing.⁵",
    ],
    id_helps: [
      "Ungkapkan apa yang hilang dari Anda: buat daftar dan tuliskan. Kehilangan yang tidak diungkapkan sering terasa lebih berat.",
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
    en_vignette: "He sat across from his oldest friend and found the conversation harder than before. Three years ago they talked for hours. Now there were long pauses, and he felt lonelier than he had expected.",
    id_vignette: "Ia duduk berhadapan dengan sahabat lamanya dan mendapati percakapan mereka lebih sulit dari dulu. Tiga tahun lalu mereka bisa berbicara berjam-jam. Sekarang banyak jeda panjang, dan ia merasa lebih kesepian daripada yang ia duga.",
    en_feelings: [
      "Grief that catches you off guard: a song, a smell, a WhatsApp message that brings it all back",
      "Irritation with your home culture's pace and priorities",
      "A deep loneliness even when surrounded by people who love you",
    ],
    id_feelings: [
      "Duka yang datang tiba-tiba: sebuah lagu, aroma, atau pesan WhatsApp yang membangkitkan semuanya kembali",
      "Rasa jengkel terhadap irama hidup dan prioritas di budaya asal Anda",
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
      "Let the grief come. It often shows how much that place and those people meant to you. Don't rush past it or explain it away with spiritual words.⁶",
      "Tell a few trusted people: 'I'm not adjusting as well as I look.' You don't need everyone to understand. One or two people who do will be enough.",
      "Go easy on comparison. Your previous context was different, and that difference is easy to romanticise. Idealising the past is often grief speaking, so hold those memories loosely.",
    ],
    id_helps: [
      "Biarkan duka itu datang. Duka sering menunjukkan betapa berartinya tempat dan orang-orang itu bagi Anda. Jangan terburu-buru melewatinya atau menutupinya dengan kata-kata rohani.⁶",
      "Beritahu beberapa orang yang Anda percaya: 'Saya tidak menyesuaikan diri sebaik yang terlihat.' Anda tidak perlu semua orang mengerti. Satu atau dua orang yang mengerti sudah cukup.",
      "Batasi kebiasaan membandingkan. Tempat Anda sebelumnya memang berbeda, dan perbedaan itu mudah dibayangkan lebih indah daripada kenyataannya. Mengidealkan masa lalu sering kali adalah bagian dari duka, jadi jangan menggenggam kenangan itu terlalu erat.",
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
      "Expecting to become the same person you were before you left",
    ],
    id_traps: [
      "Merasa bersalah karena menyesuaikan diri, seolah-olah menjadi bagian di sini berarti mengkhianati di sana",
      "Terlalu banyak jadwal untuk menciptakan rasa memiliki sebelum waktunya untuk terbentuk secara alami",
      "Berharap menjadi orang yang sama seperti sebelum Anda pergi",
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
    en_vignette: "He was leading a meeting when he noticed tension between two team members from different cultural backgrounds. He said something quiet and accurate, and the conversation eased. It was one of the first times his years abroad felt useful at home.",
    id_vignette: "Ia sedang memimpin rapat ketika ia melihat ketegangan antara dua anggota tim dari latar belakang budaya yang berbeda. Ia mengatakan sesuatu yang tenang dan tepat, dan percakapan menjadi lebih cair. Itu salah satu saat pertama ia merasa pengalamannya bertahun-tahun di luar negeri berguna di tanah air.",
    en_feelings: [
      "A settled sense of who you are, shaped by where you have been without being defined by it",
      "The ability to hold grief and gratitude for the same experience at the same time",
      "A quiet confidence that what you carry can be useful to the people around you",
    ],
    id_feelings: [
      "Rasa tenang tentang siapa Anda, dibentuk oleh tempat-tempat yang pernah Anda tinggali tanpa ditentukan olehnya",
      "Kemampuan untuk menampung duka dan rasa syukur untuk pengalaman yang sama pada saat yang sama",
      "Keyakinan yang tenang bahwa apa yang Anda bawa bisa berguna bagi orang-orang di sekitar Anda",
    ],
    en_traps: [
      "Assuming integration means the grief is gone, when it has simply found its rightful place",
      "Framing too much through 'when I was overseas'. Your history can serve others without taking over the conversation",
      "Stopping here. Integration opens the door to giving your cross-cultural experience away.",
    ],
    id_traps: [
      "Menganggap integrasi berarti duka sudah hilang, padahal duka itu hanya sudah menemukan tempatnya",
      "Terlalu sering mengaitkan segala hal dengan 'waktu saya di luar negeri'. Pengalaman Anda bisa melayani orang lain tanpa mendominasi percakapan",
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
    en_body: "Before you left, did you seek peace in relationships that were strained? If not, the work can still be done, even across distance. Unresolved relationships can travel with you and surface in unexpected places.",
    id_body: "Sebelum Anda pergi, apakah Anda mengupayakan perdamaian dalam hubungan yang tegang? Jika belum, hal itu masih bisa dilakukan, bahkan dari jauh. Hubungan yang belum dipulihkan bisa ikut bersama Anda dan muncul di tempat yang tidak terduga.",
    en_question: "Is there a relationship from your time overseas that you left without resolution? What would one step toward peace look like, even now?",
    id_question: "Apakah ada hubungan dari masa Anda di luar negeri yang Anda tinggalkan tanpa penyelesaian? Seperti apa satu langkah menuju perdamaian, bahkan sekarang?",
  },
  {
    letter: "A",
    en_title: "Affirmation",
    id_title: "Peneguhan",
    en_body: "Did you tell the people who shaped you what they meant to you? Many people leave without saying it, and those left behind may carry a quiet loss. Affirmation is the deliberate act of honouring a person before you go.",
    id_body: "Apakah Anda sudah memberi tahu orang-orang yang membentuk Anda betapa berartinya mereka? Banyak orang pergi tanpa mengatakannya, dan mereka yang ditinggalkan bisa menanggung kehilangan yang tidak terucapkan. Peneguhan berarti dengan sadar menghargai seseorang sebelum Anda pergi.",
    en_question: "Who are the 3 to 5 people from your cross-cultural season who most shaped you? Have you told them specifically what they gave you?",
    id_question: "Siapa 3 sampai 5 orang dari masa lintas budaya Anda yang paling membentuk Anda? Apakah Anda sudah memberi tahu mereka secara spesifik apa yang mereka berikan kepada Anda?",
  },
  {
    letter: "F",
    en_title: "Farewells",
    id_title: "Perpisahan",
    en_body: "Grief that isn't expressed tends to stay with you and can become weight you carry into the next season. Saying goodbye to a place, a community, a language or a rhythm of life is a healthy way to honour what you had.",
    id_body: "Duka yang tidak diungkapkan cenderung tetap tinggal dan bisa menjadi beban yang Anda bawa ke masa berikutnya. Mengucapkan selamat tinggal kepada sebuah tempat, komunitas, bahasa, atau ritme hidup adalah cara yang sehat untuk menghargai apa yang pernah Anda alami.",
    en_question: "What did you not get to grieve before or during the transition? What do you still carry that hasn't been given its proper goodbye?",
    id_question: "Apa yang tidak bisa Anda berdukacitakan sebelum atau selama transisi? Apa yang masih Anda bawa yang belum mendapatkan perpisahan yang layak?",
  },
  {
    letter: "T",
    en_title: "Think Ahead",
    id_title: "Persiapkan Masa Depan",
    en_body: "Returning tends to follow recognisable stages. Knowing that Collision may come, and that it is usually temporary, can change how you face it. Thinking ahead can make the harder seasons easier to bear.",
    id_body: "Proses pulang biasanya mengikuti tahapan yang bisa dikenali. Mengetahui bahwa Benturan mungkin datang, dan biasanya bersifat sementara, bisa mengubah cara Anda menghadapinya. Berpikir ke depan bisa membuat masa yang berat lebih mudah ditanggung.",
    en_question: "Which stage of the process do you think will be hardest for you personally, and what one thing could you put in place now to help when you arrive there?",
    id_question: "Menurut Anda, tahap mana dalam proses ini yang paling sulit bagi Anda secara pribadi, dan satu hal apa yang bisa Anda siapkan sekarang untuk membantu saat Anda tiba di sana?",
  },
];

// --- REFLECTION STATEMENTS ---------------------------------------------------
const OBJECTIVES: { en: string; id: string }[] = [
  { en: "Explain why many people expect returning to be easier than leaving, and how that affects preparation.", id: "Menjelaskan mengapa banyak orang mengira pulang lebih mudah daripada pergi, dan bagaimana hal itu memengaruhi persiapan." },
  { en: "Recognise the four common stages of re-entry and identify which one you are in now.", id: "Memahami empat tahap umum saat pulang dan mengenali tahap yang sedang Anda alami." },
  { en: "Use the RAFT framework to close a relationship, farewell or loss that is still open.", id: "Menerapkan kerangka RAFT pada hubungan, perpisahan, atau kehilangan yang belum tuntas." },
  { en: "List the losses of your cross-cultural season and choose one way to grieve them well.", id: "Menuliskan kehilangan dari masa lintas budaya Anda dan memilih satu cara untuk berduka dengan sehat." },
  { en: "Describe one way your cross-cultural experience can serve the people around you at home.", id: "Menjelaskan satu cara pengalaman lintas budaya Anda bisa melayani orang-orang di sekitar Anda di tanah air." },
];

// Self-assessment: higher = healthier, no reverse scoring
const ASSESS: { en: string; id: string; en_label: string; id_label: string }[] = [
  { en: "I have given my return as much thought and preparation as I gave my leaving.", id: "Saya memikirkan dan mempersiapkan kepulangan saya sama seriusnya seperti saat saya berangkat dulu.", en_label: "Realistic expectations", id_label: "Harapan yang realistis" },
  { en: "I have put into words what I lost when I left, and I allow myself to grieve it.", id: "Saya sudah mengungkapkan apa yang hilang saat saya pergi, dan saya mengizinkan diri saya berduka.", en_label: "Grieving losses", id_label: "Berduka atas kehilangan" },
  { en: "I have a settled sense of who I am now, shaped by both places.", id: "Saya merasa mantap tentang siapa saya sekarang, yang dibentuk oleh kedua tempat itu.", en_label: "Sense of identity", id_label: "Jati diri" },
  { en: "I have at least one or two people at home I can be honest with about how I am doing.", id: "Saya punya setidaknya satu atau dua orang di sini yang bisa saya ajak bicara dengan jujur tentang keadaan saya.", en_label: "Honest relationships", id_label: "Hubungan yang jujur" },
  { en: "I am finding a place to belong in a church or community here.", id: "Saya mulai merasa menjadi bagian dari sebuah gereja atau komunitas di sini.", en_label: "Church and community", id_label: "Gereja dan komunitas" },
  { en: "I can talk about my cross-cultural years in a way that fits the listener.", id: "Saya bisa bercerita tentang tahun-tahun lintas budaya saya dengan cara yang sesuai bagi pendengar.", en_label: "Telling your story", id_label: "Menceritakan kisah Anda" },
  { en: "I am getting enough rest and quiet time, without filling every day.", id: "Saya mendapat cukup istirahat dan waktu tenang, tanpa mengisi setiap hari dengan kesibukan.", en_label: "Rest", id_label: "Istirahat" },
  { en: "I can handle the differences in my home culture without frequent irritation.", id: "Saya bisa menghadapi perbedaan di budaya asal saya tanpa sering merasa jengkel.", en_label: "Home culture adjustment", id_label: "Penyesuaian budaya asal" },
  { en: "My relationship with God feels steady through this transition.", id: "Hubungan saya dengan Tuhan terasa stabil selama masa transisi ini.", en_label: "Faith", id_label: "Iman" },
  { en: "I have a sense of direction for the next season, even if it is not fully clear.", id: "Saya punya gambaran arah untuk masa berikutnya, meskipun belum sepenuhnya jelas.", en_label: "Next steps", id_label: "Langkah berikutnya" },
];

const ASSESS_SCALE: { en: string; id: string }[] = [
  { en: "Not at all", id: "Sama sekali tidak" },
  { en: "A little", id: "Sedikit" },
  { en: "Somewhat", id: "Sebagian" },
  { en: "Mostly", id: "Sebagian besar" },
  { en: "Fully", id: "Sepenuhnya" },
];

const ASSESS_BANDS = [
  {
    min: 10, max: 22, anchor: "journey-map-section",
    en_title: "Still finding your footing", id_title: "Masih mencari pijakan",
    en_body: "Coming home seems to be taking a lot out of you right now. That is common, especially in the first months, and it does not mean you are doing it wrong. Go slowly and let others help carry it.",
    id_body: "Proses pulang tampaknya sedang menguras banyak tenaga Anda saat ini. Hal itu umum, terutama di bulan-bulan pertama, dan bukan berarti Anda melakukannya dengan salah. Jalani dengan perlahan dan biarkan orang lain ikut menolong.",
    en_tip: "Start with \"What Can Help\" under Arrival in The Re-Entry Process, and talk with one person you trust this week.",
    id_tip: "Mulailah dari \"Yang Bisa Membantu\" pada tahap Kedatangan di bagian Proses Kembali ke Tanah Air, dan bicaralah dengan satu orang yang Anda percaya minggu ini.",
  },
  {
    min: 23, max: 32, anchor: "journey-map-section",
    en_title: "Working through it", id_title: "Sedang menjalaninya",
    en_body: "Some areas are settling while others still feel raw. This mix is normal in the middle of re-entry. Your lowest areas show where a little attention may help most.",
    id_body: "Beberapa area mulai tenang, sementara yang lain masih terasa berat. Campuran ini wajar di tengah masa pulang. Area terendah Anda menunjukkan di mana sedikit perhatian bisa paling menolong.",
    en_tip: "Read \"What Can Help\" under Collision in The Re-Entry Process, and pick one step for your lowest area.",
    id_tip: "Bacalah \"Yang Bisa Membantu\" pada tahap Benturan di bagian Proses Kembali ke Tanah Air, lalu pilih satu langkah untuk area terendah Anda.",
  },
  {
    min: 33, max: 41, anchor: "raft-section",
    en_title: "Finding your ground", id_title: "Mulai menemukan pijakan",
    en_body: "Much of your return seems to be settling. There may still be a few loose ends from your cross-cultural season. Giving them some attention now can make the next season lighter.",
    id_body: "Sebagian besar proses pulang Anda tampaknya mulai tenang. Mungkin masih ada beberapa hal yang belum selesai dari masa lintas budaya Anda. Memberi perhatian pada hal-hal itu sekarang bisa membuat masa berikutnya lebih ringan.",
    en_tip: "Work through the RAFT section, starting with the card that matches your lowest area.",
    id_tip: "Kerjakan bagian RAFT, mulai dari kartu yang paling sesuai dengan area terendah Anda.",
  },
  {
    min: 42, max: 50, anchor: "journey-map-section",
    en_title: "Settling well", id_title: "Sudah merasa mantap",
    en_body: "You seem to be holding both places well, with room for grief and gratitude. This is a good season to think about how your experience can serve others.",
    id_body: "Anda tampaknya bisa merangkul kedua tempat itu dengan baik, dengan ruang untuk duka dan juga rasa syukur. Ini masa yang baik untuk memikirkan bagaimana pengalaman Anda bisa melayani orang lain.",
    en_tip: "Read \"What Can Help\" under Integration in The Re-Entry Process, and look for one newcomer or returnee you could support.",
    id_tip: "Bacalah \"Yang Bisa Membantu\" pada tahap Integrasi di bagian Proses Kembali ke Tanah Air, dan carilah satu pendatang baru atau orang yang baru pulang yang bisa Anda dukung.",
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
  const [aStep, setAStep] = useState(0);
  const [aAnswers, setAAnswers] = useState<(number | null)[]>(Array(ASSESS.length).fill(null));

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

  const aDone = aStep >= ASSESS.length;
  const aTotal = aAnswers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const aBand = ASSESS_BANDS.find((b) => aTotal >= b.min && aTotal <= b.max) ?? ASSESS_BANDS[0];
  const aLowest = aAnswers
    .map((a, i) => ({ i, s: a ?? 0 }))
    .sort((x, y) => x.s - y.s || x.i - y.i)
    .slice(0, 2);
  function answerQ(score: number) {
    setAAnswers((prev) => { const next = [...prev]; next[aStep] = score; return next; });
    setAStep((s) => Math.min(s + 1, ASSESS.length));
  }
  function backQ() { setAStep((s) => Math.max(0, s - 1)); }
  function restartA() { setAAnswers(Array(ASSESS.length).fill(null)); setAStep(0); }

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
              "Personal Development · Guide",
              "Pengembangan Pribadi · Panduan",
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
              "Coming home can take as much care as leaving, and this module helps you give it that care.",
              "Pulang bisa memerlukan perhatian yang sama besarnya dengan saat pergi, dan modul ini menolong Anda memberikan perhatian itu.",
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
            "Coming home is a transition of its own",
            "Pulang adalah sebuah transisi tersendiri",
          )}
        </h2>
        <div style={{ fontSize: "clamp(16px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "When you moved cross-culturally, most people around you expected it to be hard. Many offered support, sent care packages and checked in. That made it easier to admit when you were struggling.",
              "Ketika Anda pindah ke budaya lain, kebanyakan orang di sekitar Anda sudah menduga bahwa itu akan berat. Banyak yang memberi dukungan, mengirim paket, dan menanyakan kabar Anda. Hal itu membuat Anda lebih mudah mengakui saat Anda sedang bergumul.",
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {cite(t(
              "Coming back can feel different. Many people, returnees included, expect going home to be easier than leaving, so it often gets less preparation and less attention. Researchers call the adjustment reverse culture shock, and many returnees find it harder than they expected.¹ One study that followed returnees for six months found that a harder re-entry predicted more loneliness, depression and stress later on.² Another found that when home turns out worse than people expected, their wellbeing drops.³",
              "Pulang bisa terasa berbeda. Banyak orang, termasuk mereka yang pulang, mengira pulang lebih mudah daripada pergi, sehingga persiapan dan perhatian untuknya sering lebih sedikit. Para peneliti menyebut masa penyesuaian ini gegar budaya terbalik, dan banyak orang yang pulang merasakannya lebih berat daripada yang mereka duga.¹ Satu penelitian yang mengikuti orang-orang yang pulang selama enam bulan menemukan bahwa masa pulang yang lebih berat diikuti oleh rasa kesepian, depresi, dan stres yang lebih tinggi sesudahnya.² Penelitian lain menemukan bahwa ketika keadaan di tanah air ternyata lebih buruk dari yang diharapkan, kesejahteraan mereka menurun.³",
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
              "You have changed while you were away, and so have the people at home, often in different directions. Much of the friction of coming back sits in that gap.",
              "Anda telah berubah selama pergi, demikian juga orang-orang di tanah air, sering kali ke arah yang berbeda. Banyak gesekan saat pulang muncul dari perbedaan itu.",
            )}
          </blockquote>
          <p style={{ marginBottom: 0 }}>
            {t(
              "This module maps the process. It describes the stages, shows that what you may be feeling is common, and gives practical tools for each phase. It also holds that your cross-cultural years still have value for the season ahead.",
              "Modul ini memetakan prosesnya: menjelaskan tahap-tahapnya, menunjukkan bahwa apa yang mungkin Anda rasakan itu umum, dan memberi langkah praktis untuk setiap fase. Modul ini juga menegaskan bahwa tahun-tahun lintas budaya Anda tetap berharga untuk masa yang akan datang.",
            )}
          </p>
        </div>
      </div>

      {/* -- After This Module ------------------------------------------------ */}
      <div style={{ background: navy, padding: "56px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 20,
          }}>
            {t("After This Module", "Setelah Modul Ini")}
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
            {OBJECTIVES.map((o, i) => (
              <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ flex: "0 0 3px", height: 20, background: orange, marginTop: 3 }} />
                <span style={{
                  fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 500,
                  lineHeight: 1.7, color: "oklch(76% 0.03 80)",
                }}>
                  {lang === "id" ? o.id : o.en}
                </span>
              </li>
            ))}
          </ul>
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
                "Four common stages of coming home",
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
                  {t("Faith Anchor", "Pegangan Iman")} →
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
                  {t("What Can Help", "Yang Bisa Membantu")}
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
      <div id="raft-section" style={{ scrollMarginTop: 24, padding: "96px 24px 96px", maxWidth: 860, margin: "0 auto" }}>

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
              "Developed by Dave Pollock and Ruth Van Reken, RAFT is a framework for finishing well, so you can enter the next season with less left unfinished.⁷",
              "Dikembangkan oleh Dave Pollock dan Ruth Van Reken, RAFT adalah kerangka untuk mengakhiri dengan baik, sehingga Anda bisa memasuki masa berikutnya dengan lebih sedikit hal yang belum selesai.⁷",
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
              "Scripture includes stories of leaving and returning",
              "Alkitab memuat kisah-kisah tentang pergi dan pulang",
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
                "Joseph spent years in Egypt as a slave, a prisoner and later a senior official. He lived cross-culturally long before that was a category. When his brothers arrived, he had to hold his two worlds together: the boy they remembered and the man he had become. His weeping was the overflow of someone who had kept those two worlds apart for years.",
                "Yusuf menghabiskan bertahun-tahun di Mesir sebagai budak, tahanan, dan kemudian pejabat tinggi. Ia hidup lintas budaya jauh sebelum istilah itu dikenal. Ketika saudara-saudaranya datang, ia harus menyatukan dua dunianya: anak laki-laki yang mereka ingat dan pria yang kini berdiri di hadapan mereka. Tangisannya adalah luapan dari seseorang yang bertahun-tahun memisahkan kedua dunia itu.",
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
                "Ruth's story is the reverse of re-entry. She chose to settle in a foreign culture, leaving the familiar behind. Yet her experience mirrors what returning cross-cultural workers may feel: grief at leaving people she loved, the courage to commit to a new place, and the slow, demanding work of being known in a place you now call home. Her wholehearted commitment amid uncertainty is the same posture integration asks of you.",
                "Kisah Rut adalah kebalikan dari pulang ke tanah air. Ia memilih menetap di budaya asing dan meninggalkan hal-hal yang familiar. Namun pengalamannya mirip dengan apa yang mungkin dirasakan pekerja lintas budaya yang pulang: duka karena meninggalkan orang-orang yang ia kasihi, keberanian untuk berkomitmen pada tempat yang baru, dan proses yang lambat serta penuh pengorbanan untuk dikenal di tempat yang sekarang Anda sebut rumah. Komitmen sepenuh hati di tengah ketidakpastian adalah sikap yang juga dibutuhkan dalam proses integrasi.",
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
                "Grief in re-entry is common and usually reflects how much the past season meant to you. Psalm 126 holds both: 'those who sow with tears will reap with songs of joy.' The sowing and the harvest belong to one story, told across time.",
                "Duka saat pulang itu umum dan biasanya mencerminkan betapa berartinya masa lalu itu bagi Anda. Mazmur 126 memuat keduanya: 'orang-orang yang menabur dengan mencucurkan air mata, akan menuai dengan bersorak-sorai.' Menabur dan menuai adalah bagian dari satu kisah yang sama, yang terbentang dari waktu ke waktu.",
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

      {/* -- Self-Assessment (one question at a time) ----------------------- */}
      <div id="self-assessment" style={{ background: lightGray, padding: "96px 24px", scrollMarginTop: 24 }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 16 }}>
            {t("Self-Assessment", "Penilaian Diri")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700,
            color: navy, lineHeight: 1.2, fontStyle: "italic", marginBottom: 16,
          }}>
            {t("How is your return going?", "Bagaimana proses pulang Anda?")}
          </h2>
          <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", color: bodyText, lineHeight: 1.8, maxWidth: 620, marginBottom: 32 }}>
            {t(
              "Rate each statement from 1 to 5 based on the last few weeks. There are no right answers, only a clearer picture of where to give your attention.",
              "Beri nilai 1 sampai 5 untuk setiap pernyataan berdasarkan beberapa minggu terakhir. Tidak ada jawaban benar atau salah, hanya gambaran yang lebih jelas tentang bagian yang perlu Anda perhatikan.",
            )}
          </p>

          <div aria-live="polite" style={{
            background: "white", borderRadius: 10, padding: "28px clamp(18px, 4vw, 32px)",
            borderLeft: `4px solid ${orange}`,
          }}>
            {!aDone ? (
              <div key={aStep}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: bodyText, letterSpacing: "0.04em" }}>
                    {aStep + 1} {t("of", "dari")} {ASSESS.length}
                  </p>
                  {aStep > 0 && (
                    <button type="button" onClick={backQ} style={{
                      background: "none", border: "none", cursor: "pointer", minHeight: 44, padding: "0 4px",
                      fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange,
                      textDecoration: "underline", textUnderlineOffset: 3,
                    }}>
                      {t("Back", "Kembali")}
                    </button>
                  )}
                </div>
                <div aria-hidden="true" style={{ height: 4, background: lightGray, borderRadius: 2, marginBottom: 24 }}>
                  <div style={{ height: 4, width: `${(aStep / ASSESS.length) * 100}%`, background: orange, borderRadius: 2, transition: "width 0.25s" }} />
                </div>
                <p style={{
                  fontFamily: serif, fontSize: "clamp(19px, 2.4vw, 24px)", color: navy,
                  lineHeight: 1.5, margin: "0 0 28px", fontWeight: 600,
                }}>
                  {lang === "id" ? ASSESS[aStep].id : ASSESS[aStep].en}
                </p>
                <div role="group" aria-label={t("Choose a score from 1 to 5", "Pilih nilai dari 1 sampai 5")}
                  style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {ASSESS_SCALE.map((sc, k) => {
                    const v = k + 1;
                    const sel = aAnswers[aStep] === v;
                    const word = lang === "id" ? sc.id : sc.en;
                    return (
                      <button key={v} type="button" onClick={() => answerQ(v)}
                        aria-pressed={sel} aria-label={`${v}, ${word}`} title={word}
                        style={{
                          minHeight: 56, borderRadius: 8, cursor: "pointer",
                          fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700,
                          border: `2px solid ${sel ? navy : "oklch(80% 0.02 260)"}`,
                          background: sel ? navy : "white", color: sel ? offWhite : navy,
                        }}>
                        {v}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, fontSize: 12, color: bodyText, lineHeight: 1.4 }}>
                  <span>1 = {lang === "id" ? ASSESS_SCALE[0].id : ASSESS_SCALE[0].en}</span>
                  <span style={{ textAlign: "right" }}>5 = {lang === "id" ? ASSESS_SCALE[4].id : ASSESS_SCALE[4].en}</span>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 12 }}>
                  {t("Your result", "Hasil Anda")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 56px)", fontWeight: 700, color: navy, lineHeight: 1, margin: "0 0 4px" }}>
                  {aTotal}<span style={{ fontSize: "0.45em", color: bodyText, fontWeight: 600 }}> / {ASSESS.length * 5}</span>
                </p>
                <h3 style={{ fontFamily: serif, fontSize: "clamp(22px, 2.8vw, 28px)", fontWeight: 700, fontStyle: "italic", color: navy, margin: "12px 0 12px" }}>
                  {lang === "id" ? aBand.id_title : aBand.en_title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: bodyText, lineHeight: 1.85, margin: "0 0 20px" }}>
                  {lang === "id" ? aBand.id_body : aBand.en_body}
                </p>
                <p style={{ fontSize: 14, color: navy, lineHeight: 1.7, margin: "0 0 8px" }}>
                  <strong>{t("Your lowest areas: ", "Area terendah Anda: ")}</strong>
                  {aLowest.map((x) => (lang === "id" ? ASSESS[x.i].id_label : ASSESS[x.i].en_label)).join(", ")}
                </p>
                <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: "0 0 24px" }}>
                  {lang === "id" ? aBand.id_tip : aBand.en_tip}{" "}
                  <a href={`#${aBand.anchor}`} style={{ color: orange, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    {t("Go to this section", "Buka bagian ini")}
                  </a>
                </p>
                <button type="button" onClick={restartA} style={{
                  minHeight: 44, padding: "10px 24px", borderRadius: 4, cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                  background: "transparent", color: navy, border: `1.5px solid ${navy}`,
                }}>
                  {t("Start again", "Mulai lagi")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* -- Close: The Gift ----------------------------------------------- */}
      <div style={{ background: offWhite, padding: "96px 24px" }}>
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
            {t("A Final Word", "Kata Akhir")}
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(28px, 3.5vw, 42px)",
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
            fontSize: "clamp(15px, 1.7vw, 17px)",
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 32,
          }}>
            {t(
              "Over time, what you carry from those years may become useful in ways you can't yet see. You may notice things others miss, or help someone who is just arriving where you have been. That is part of integration, and it is worth the time it takes.",
              "Seiring waktu, apa yang Anda bawa dari tahun-tahun itu bisa menjadi berguna dengan cara yang belum terlihat sekarang. Anda mungkin melihat hal-hal yang terlewat oleh orang lain, atau menolong seseorang yang baru mengalami apa yang dulu Anda alami. Itu bagian dari integrasi, dan layak diberi waktu.",
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
                en: "Many people expect coming home to be easier than leaving, and many find it harder than they expected.¹ Feeling out of place at home is a normal response to a real transition.",
                id: "Banyak orang mengira pulang lebih mudah daripada pergi, dan banyak yang merasakannya lebih berat daripada yang mereka duga.¹ Merasa asing di rumah sendiri adalah respons yang wajar terhadap sebuah transisi yang nyata.",
              },
              {
                en: "The four stages are a map, and the months are rough guides. You may move faster or slower, or circle back for a while.⁴",
                id: "Keempat tahap ini adalah peta, dan jumlah bulannya hanya perkiraan. Anda mungkin bergerak lebih cepat atau lebih lambat, atau kembali ke tahap sebelumnya untuk sementara.⁴",
              },
              {
                en: "Grief for the people and places you left is real. Name your losses and give them room instead of hurrying past them.⁶",
                id: "Duka atas orang dan tempat yang Anda tinggalkan itu nyata. Ungkapkan kehilangan Anda dan beri ruang baginya, jangan terburu-buru melewatinya.⁶",
              },
              {
                en: "Finishing well matters. RAFT helps you leave with fewer loose ends, so you carry less unfinished weight into the next season.⁷",
                id: "Mengakhiri dengan baik itu penting. RAFT menolong Anda pergi dengan lebih sedikit urusan yang tertinggal, sehingga beban yang Anda bawa ke masa berikutnya lebih ringan.⁷",
              },
              {
                en: "Time helps. In one study of long-term Christian workers, depression tended to ease the longer people had been home.⁸ While you wait, find one or two people who understand.⁵",
                id: "Waktu menolong. Dalam satu penelitian tentang pekerja Kristen jangka panjang, depresi cenderung mereda seiring makin lamanya mereka berada di tanah air.⁸ Sambil menunggu, carilah satu atau dua orang yang mengerti.⁵",
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

      {/* -- Sources -------------------------------------------------------- */}
      <SourcesDropdown
        lang={lang}
        background={offWhite}
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
