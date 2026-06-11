"use client";
import { useState, useTransition, type CSSProperties } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";
import Image from "next/image";

// ─── Brand constants ──────────────────────────────────────────────────────────
const NAVY       = "oklch(22% 0.10 260)";
const ORANGE     = "oklch(65% 0.15 45)";
const OFF_WHITE  = "oklch(96% 0.005 80)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT  = "oklch(38% 0.05 260)";
const NAVY_BORDER = "oklch(35% 0.10 260)";
const CARD_DARK  = "oklch(16% 0.08 260)";

const FONT_HEADLINE = "'Cormorant Garamond', serif";
const FONT_BODY     = "'Montserrat', sans-serif";

// ─── Reusable style objects ───────────────────────────────────────────────────
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

const scriptureStyle: CSSProperties = {
  fontFamily: FONT_HEADLINE,
  fontStyle: "italic",
  fontWeight: 600,
  color: ORANGE,
};

// ─── Content data ─────────────────────────────────────────────────────────────

const HERO_SUBTITLE = {
  en: "How meaning travels between the words — and what you miss when you only hear the words.",
  id: "Cara makna berjalan di antara kata-kata — dan apa yang kamu lewatkan ketika hanya mendengar kata-katanya saja.",
};

const HERO_INTRO = {
  en: "You asked a clear question. You got a clear answer. The meeting ended well — or so you thought. Three weeks later you discover nothing happened, and nobody feels the need to explain why. That moment of confusion is the starting point for this module. High-context communication is not broken communication. It is a different system entirely, and once you learn to read it, you will not miss a signal the same way again.",
  id: "Kamu mengajukan pertanyaan yang jelas. Kamu mendapat jawaban yang jelas. Rapat berakhir dengan baik — setidaknya begitu yang kamu kira. Tiga minggu kemudian kamu menyadari tidak ada yang terjadi, dan tidak ada yang merasa perlu menjelaskan mengapa. Momen kebingungan itulah titik awal modul ini. Komunikasi berkonteks tinggi bukan komunikasi yang rusak. Ini adalah sistem yang berbeda sepenuhnya, dan begitu kamu belajar membacanya, kamu tidak akan melewatkan sinyal dengan cara yang sama lagi.",
};

const OPENING_TEACHING_PARAS = {
  en: [
    "In low-context communication, the message is in the words. If something matters, you say it clearly. Anything important is written down, spelled out, confirmed. This is the communication style of Germany, the Netherlands, the United States, and a cluster of other countries where directness is a virtue and clarity is kindness.",
    "In high-context communication, the message is in everything around the words. The relationship between the speakers. The setting. The pause before the answer. What was not said. The tone in the room after someone speaks. For the people who grew up inside this system, none of this requires explanation — it is simply how communication works. For someone coming from outside it, it can feel like everyone is speaking in code.",
    "Most of the world's cultures lean high-context. This includes most of Asia, the Middle East, Latin America, and sub-Saharan Africa. This is not a quirk or a communication problem to be fixed. It is the dominant mode of human communication on the planet.",
    "One honest note: the researcher who popularised this framework, Edward T. Hall, never validated it with rigorous data, and academic critics have raised serious questions about placing whole countries on a fixed scale (Cardon 2008, Kittler et al. 2011). This module uses the framework as a practical lens, not a scientific measurement. Erin Meyer's Culture Map — built from extensive research across 62 countries — refines Hall's ideas and offers a more reliable guide. The tendencies described here are real. They are just not a rulebook for predicting individuals.",
  ],
  id: [
    "Dalam komunikasi berkonteks rendah, pesan ada di dalam kata-kata. Jika sesuatu penting, kamu mengatakannya dengan jelas. Hal-hal penting dituliskan, dijabarkan, dikonfirmasi. Inilah gaya komunikasi Jerman, Belanda, Amerika Serikat, dan sejumlah negara lain di mana berbicara langsung adalah suatu kebajikan dan kejelasan adalah bentuk kebaikan.",
    "Dalam komunikasi berkonteks tinggi, pesan ada di dalam segala sesuatu yang mengelilingi kata-kata. Hubungan antara para pembicara. Setting percakapan. Jeda sebelum menjawab. Apa yang tidak dikatakan. Nada di ruangan setelah seseorang berbicara. Bagi orang yang tumbuh dalam sistem ini, semua ini tidak memerlukan penjelasan — itulah cara komunikasi bekerja. Bagi seseorang yang datang dari luar sistem ini, rasanya seperti semua orang berbicara dalam kode.",
    "Sebagian besar budaya di dunia cenderung berkonteks tinggi. Ini mencakup sebagian besar Asia, Timur Tengah, Amerika Latin, dan Afrika sub-Sahara. Ini bukan keanehan atau masalah komunikasi yang perlu diperbaiki. Ini adalah mode komunikasi manusia yang paling dominan di dunia.",
    "Satu catatan jujur: peneliti yang mempopulerkan kerangka ini, Edward T. Hall, tidak pernah memvalidasinya dengan data yang ketat, dan para kritikus akademis telah mempertanyakan penempatan seluruh negara pada skala yang tetap (Cardon 2008, Kittler dkk. 2011). Modul ini menggunakan kerangka tersebut sebagai lensa praktis, bukan sebagai pengukuran ilmiah. Culture Map karya Erin Meyer — yang dibangun dari penelitian mendalam di lebih dari 62 negara — menyempurnakan gagasan Hall dan menawarkan panduan yang lebih andal. Kecenderungan yang dijelaskan di sini adalah nyata. Namun bukan berarti ini adalah aturan untuk memprediksi individu.",
  ],
};

const LEARNING_OUTCOMES = {
  en: [
    { keyword: "Recognise", rest: " the five key dynamics of high-context communication — indirect refusal, communicative silence, face-saving, relational preamble, and consensus-based decisions — and identify them in real cross-cultural moments." },
    { keyword: "Locate", rest: " yourself and the cultures you work with on the communication spectrum, identifying the gap that produces misunderstanding." },
    { keyword: "Apply", rest: " one concrete adjustment in your next cross-cultural meeting, based on what you decoded in the signal rooms." },
  ],
  id: [
    { keyword: "Mengenali", rest: " lima dinamika utama komunikasi berkonteks tinggi — penolakan tidak langsung, keheningan komunikatif, menjaga muka, basa-basi relasional, dan keputusan berbasis konsensus — serta mengidentifikasinya dalam momen lintas budaya yang nyata." },
    { keyword: "Menempatkan", rest: " dirimu dan budaya yang kamu kerjakan dalam spektrum komunikasi, dan mengidentifikasi kesenjangan yang menghasilkan kesalahpahaman." },
    { keyword: "Menerapkan", rest: " satu penyesuaian konkret dalam rapatmu lintas budaya berikutnya, berdasarkan apa yang kamu dekode di ruang-ruang sinyal." },
  ],
};

// ─── Signal Rooms data ────────────────────────────────────────────────────────

type DialogueLine = {
  speaker: string;
  text: { en: string; id: string };
  isSilence?: boolean;
};

type RoomOption = {
  label: { en: string; id: string };
  isCorrect: boolean;
};

type SignalRoom = {
  number: number;
  title: { en: string; id: string };
  region: { en: string; id: string };
  setup: { en: string; id: string };
  dialogue: DialogueLine[];
  options: [RoomOption, RoomOption, RoomOption];
  reveal: { en: string; id: string };
  takeaway: { en: string; id: string };
};

const SIGNAL_ROOMS: SignalRoom[] = [
  {
    number: 1,
    title: { en: "The Yes That Isn't Yes", id: "Ya yang Bukan Ya" },
    region: { en: "Japan · Middle East · Latin America", id: "Jepang · Timur Tengah · Amerika Latin" },
    setup: { en: "Indirect refusal is not dishonesty. It is a different kind of honesty.", id: "Penolakan tidak langsung bukan ketidakjujuran. Ini adalah kejujuran dalam bentuk yang berbeda." },
    dialogue: [
      { speaker: "Alex (team lead, visiting from Germany)", text: { en: "So — can your team deliver the full report by Friday?", id: "Jadi — apakah tim kamu bisa menyerahkan laporan lengkap pada hari Jumat?" } },
      { speaker: "Kenji (senior local staff)", text: { en: "Yes, we will do our best.", id: "Ya, kami akan melakukan yang terbaik." } },
      { speaker: "Alex", text: { en: "Perfect. So Friday is confirmed?", id: "Baik. Jadi Jumat sudah dipastikan?" } },
      { speaker: "Kenji", text: { en: "We will try very hard to meet your expectations.", id: "Kami akan berusaha keras untuk memenuhi harapan kamu." } },
      { speaker: "Alex", text: { en: "Great. I'll tell the client it's Friday.", id: "Bagus. Saya akan memberitahu klien bahwa itu Jumat." } },
      { speaker: "Kenji", text: { en: "[long pause]", id: "[jeda panjang]" }, isSilence: true },
    ],
    options: [
      { label: { en: "Kenji agreed. The team will deliver on Friday.", id: "Kenji setuju. Tim akan menyelesaikannya pada hari Jumat." }, isCorrect: false },
      { label: { en: "Kenji is being evasive because he doesn't respect the deadline.", id: "Kenji menghindari pertanyaan karena dia tidak menghormati tenggat waktu." }, isCorrect: false },
      { label: { en: "Kenji is politely communicating that Friday is not possible — without saying no.", id: "Kenji sedang menyampaikan dengan sopan bahwa Jumat tidak memungkinkan — tanpa mengatakan tidak." }, isCorrect: true },
    ],
    reveal: {
      en: "Kenji said \"we will try\" twice and went silent after the deadline was confirmed. In high-context Japanese communication, this is a clear signal. Direct refusal would embarrass Alex and damage the relationship. The polite non-commitment and the pause carry the \"no\" that politeness will not let Kenji speak aloud.\n\nThis pattern appears across many cultures. In Arabic-speaking contexts, a host who is asked for something they cannot provide may say \"inshallah\" (God willing) not as a genuine commitment but as a graceful deflection. In much of Latin America, \"veremos\" (we will see) performs the same function. In Korean and Japanese settings, the phrase \"it may be difficult\" is, for experienced listeners, a firm no.\n\nThe pattern is not evasion. It is a relational gift: the refusal is delivered in a way that preserves the dignity of everyone in the room. A low-context leader who mistakes this for agreement and confirms the deadline to the client has missed the message entirely — not because Kenji was unclear, but because the message was not where they were looking.",
      id: "Kenji berkata \"kami akan mencoba\" dua kali dan diam setelah tenggat waktu dikonfirmasi. Dalam komunikasi berkonteks tinggi ala Jepang, ini adalah sinyal yang jelas. Penolakan langsung akan mempermalukan Alex dan merusak hubungan. Ketidakpastian yang sopan dan jeda itu membawa \"tidak\" yang tidak bisa diucapkan Kenji secara langsung karena alasan kesopanan.\n\nPola ini muncul di banyak budaya. Dalam konteks berbahasa Arab, seorang tuan rumah yang diminta sesuatu yang tidak bisa diberikannya mungkin berkata \"inshallah\" (semoga Allah menghendaki) bukan sebagai komitmen nyata, melainkan sebagai pengalihan yang anggun. Di banyak wilayah Amerika Latin, \"veremos\" (kita lihat saja) berfungsi dengan cara yang sama. Dalam konteks Korea dan Jepang, ungkapan \"itu mungkin sulit\" adalah, bagi pendengar berpengalaman, sebuah penolakan yang tegas.\n\nPolanya bukan penghindaran. Ini adalah hadiah relasional: penolakan disampaikan dengan cara yang menjaga martabat semua orang di ruangan. Seorang pemimpin berkonteks rendah yang salah mengira ini sebagai persetujuan dan mengonfirmasi tenggat waktu kepada klien telah melewatkan pesannya sepenuhnya — bukan karena Kenji tidak jelas, tetapi karena pesannya tidak ada di tempat yang mereka cari.",
    },
    takeaway: {
      en: "Next time, when someone says 'we will try' or 'we will do our best,' ask one follow-up: 'What would make that harder than expected?' The hesitation in the answer tells you more than the words.",
      id: "Lain kali, ketika seseorang berkata 'kami akan mencoba' atau 'kami akan melakukan yang terbaik,' tanyakan satu pertanyaan lanjutan: 'Apa yang bisa membuat itu lebih sulit dari yang diharapkan?' Keraguan dalam jawabannya menceritakan lebih banyak daripada kata-katanya.",
    },
  },
  {
    number: 2,
    title: { en: "What Silence Means", id: "Apa Arti Keheningan" },
    region: { en: "East Asia · Southeast Asia", id: "Asia Timur · Asia Tenggara" },
    setup: { en: "The loudest communication in the room is sometimes the thing nobody says.", id: "Komunikasi paling keras di ruangan terkadang adalah hal yang tidak dikatakan siapa pun." },
    dialogue: [
      { speaker: "Marta (program director, Dutch, on a video call)", text: { en: "Does anyone have concerns about the new timeline?", id: "Apakah ada yang punya kekhawatiran tentang jadwal baru ini?" } },
      { speaker: "(Silence — three seconds)", text: { en: "[silence — three seconds]", id: "[hening — tiga detik]" }, isSilence: true },
      { speaker: "Marta", text: { en: "OK. No concerns. Let's move forward.", id: "Oke. Tidak ada kekhawatiran. Mari kita lanjutkan." } },
      { speaker: "Lan (senior local coordinator)", text: { en: "Yes, we can proceed.", id: "Ya, kita bisa melanjutkan." } },
      { speaker: "(Later that day — private message to a colleague)", text: { en: "[later that day, private message]", id: "[belakangan hari itu, pesan pribadi]" }, isSilence: true },
      { speaker: "Lan", text: { en: "Did she really not notice that nobody spoke?", id: "Apakah dia benar-benar tidak menyadari bahwa tidak ada yang bicara?" } },
    ],
    options: [
      { label: { en: "The team had no concerns. Silence meant agreement.", id: "Tim tidak punya kekhawatiran. Keheningan berarti persetujuan." }, isCorrect: false },
      { label: { en: "The team was disengaged and didn't care about the timeline.", id: "Tim tidak bersemangat dan tidak peduli dengan jadwal tersebut." }, isCorrect: false },
      { label: { en: "The silence was the team's answer. Concerns existed, but speaking up in a group setting felt impossible.", id: "Keheningan itu adalah jawaban tim. Ada kekhawatiran, tetapi berbicara di depan semua orang terasa tidak mungkin." }, isCorrect: true },
    ],
    reveal: {
      en: "In Dutch communication culture, silence in response to a question often signals that no one has concerns. In Vietnamese, Thai, and many other Southeast Asian communication contexts, silence in a group setting can mean the opposite: concerns exist but the relational cost of raising them publicly is too high.\n\nLan's private message tells the whole story. She noticed. She understood what her colleagues were communicating. She also understood that Marta had missed it entirely.\n\nThe Japanese concept kuuki wo yomu — literally \"reading the air\" — describes the competency that was absent from this meeting. Reading the air means picking up meaning from atmosphere, pause, and posture rather than from explicit statements. A person who cannot do this is sometimes called kuuki yomenai — someone who can't read the air — and is seen as socially underdeveloped, not merely different.\n\nMarta's error was not bad intent. It was a framework mismatch. She listened for words. The team answered in silence.",
      id: "Dalam budaya komunikasi Belanda, keheningan sebagai respons atas sebuah pertanyaan sering kali menandakan bahwa tidak ada yang memiliki kekhawatiran. Dalam konteks komunikasi Vietnam, Thailand, dan banyak negara Asia Tenggara lainnya, keheningan dalam forum kelompok bisa berarti sebaliknya: ada kekhawatiran, tetapi biaya relasional untuk mengungkapkannya secara terbuka terlalu tinggi.\n\nPesan pribadi Lan menceritakan keseluruhan cerita. Dia memperhatikan. Dia memahami apa yang rekan-rekannya komunikasikan. Dia juga menyadari bahwa Marta melewatkan semuanya.\n\nKonsep Jepang kuuki wo yomu — secara harfiah berarti \"membaca udara\" — menggambarkan kompetensi yang absen dalam pertemuan ini. Membaca udara berarti menangkap makna dari atmosfer, jeda, dan postur tubuh, bukan dari pernyataan eksplisit. Seseorang yang tidak bisa melakukan ini kadang disebut kuuki yomenai — orang yang tidak bisa membaca udara — dan dianggap kurang matang secara sosial, bukan sekadar berbeda.\n\nKesalahan Marta bukan karena niat buruk. Ini adalah ketidakcocokan kerangka berpikir. Dia mendengarkan kata-kata. Tim menjawab dengan keheningan.",
    },
    takeaway: {
      en: "Next time, after any group silence, try this: 'I want to check in separately with a few of you — is there anything you want me to know that's easier to say one-on-one?' It signals that you welcome what the room couldn't say out loud.",
      id: "Lain kali, setelah ada keheningan dalam kelompok, coba ini: 'Saya ingin berbincang secara terpisah dengan beberapa dari kamu — apakah ada yang ingin kamu sampaikan yang lebih mudah dibicarakan satu lawan satu?' Ini memberi sinyal bahwa kamu menyambut apa yang tidak bisa dikatakan ruangan itu dengan keras.",
    },
  },
  {
    number: 3,
    title: { en: "Saving Face", id: "Menjaga Muka" },
    region: { en: "China · Arab World · Latin America", id: "Tiongkok · Dunia Arab · Amerika Latin" },
    setup: { en: "Different word, same need — dignity is not a Western idea.", id: "Kata yang berbeda, kebutuhan yang sama — martabat bukan ide orang Barat." },
    dialogue: [
      { speaker: "David (regional director, British)", text: { en: "I need to give you some feedback about last week's presentation. It wasn't up to the standard we need. The data was incomplete and you ran over time.", id: "Saya perlu memberimu umpan balik tentang presentasi minggu lalu. Itu tidak sesuai standar yang kita butuhkan. Datanya tidak lengkap dan kamu melebihi waktu yang ditetapkan." } },
      { speaker: "Fatima (project lead, Egyptian, in a team meeting)", text: { en: "Thank you for letting me know.", id: "Terima kasih sudah memberitahu saya." } },
      { speaker: "(Later that week)", text: { en: "[later that week]", id: "[belakangan minggu itu]" }, isSilence: true },
      { speaker: "Colleague (privately, to David)", text: { en: "Did you know Fatima is looking for another position?", id: "Apakah kamu tahu Fatima sedang mencari posisi lain?" } },
      { speaker: "David", text: { en: "What? Why? I only gave her feedback.", id: "Apa? Mengapa? Saya hanya memberikan umpan balik." } },
    ],
    options: [
      { label: { en: "Fatima is oversensitive. Honest feedback is part of professional development.", id: "Fatima terlalu sensitif. Umpan balik yang jujur adalah bagian dari pengembangan profesional." }, isCorrect: false },
      { label: { en: "Fatima is avoiding accountability by leaving instead of improving.", id: "Fatima menghindari akuntabilitas dengan pergi daripada memperbaiki diri." }, isCorrect: false },
      { label: { en: "Fatima experienced the public feedback as a public shaming. The professional relationship may not recover.", id: "Fatima mengalami umpan balik publik itu sebagai penghinaan di depan umum. Hubungan profesional mungkin tidak akan pulih." }, isCorrect: true },
    ],
    reveal: {
      en: "The concept of face — protecting and preserving one's dignity and social standing — is not a quirk of one culture. It appears worldwide under different names. In Chinese culture, mianzi refers to the social currency of reputation and status. In Arabic-speaking cultures, wajh (face) shapes how disagreement, criticism, and refusal are handled. In Spanish-speaking contexts, dignidad (dignity) frames how correction lands. In Indonesian and Malay cultures, malu (shame/embarrassment) is a central social regulator.\n\nThe words are different. The human need is the same.\n\nDavid's feedback was accurate. His delivery made it impossible to receive. Public correction in many high-context cultures does not function as guidance — it functions as an attack on reputation. The feedback may have been entirely true, but delivering it in front of others activated the face-protection response: Fatima's exit is not avoidance of accountability, it is protection of dignity.\n\nThis is one of the most consequential misreads a leader can make — not because the feedback was wrong, but because the method destroyed the relationship the feedback was meant to strengthen.",
      id: "Konsep muka — melindungi dan menjaga martabat serta kedudukan sosial seseorang — bukan ciri khas satu budaya saja. Konsep ini muncul di seluruh dunia dengan nama yang berbeda. Dalam budaya Tionghoa, mianzi mengacu pada modal sosial berupa reputasi dan status. Dalam budaya berbahasa Arab, wajh (muka) membentuk cara ketidaksetujuan, kritik, dan penolakan ditangani. Dalam konteks berbahasa Spanyol, dignidad (martabat) menentukan cara koreksi diterima. Dalam budaya Indonesia dan Malaysia, malu (rasa malu/canggung) adalah pengatur sosial yang sangat penting.\n\nKatanya berbeda. Kebutuhan manusianya sama.\n\nUmpan balik David akurat. Cara penyampaiannya membuat umpan balik itu tidak mungkin diterima. Koreksi di depan umum dalam banyak budaya berkonteks tinggi tidak berfungsi sebagai panduan — melainkan sebagai serangan terhadap reputasi. Umpan balik itu mungkin sepenuhnya benar, tetapi menyampaikannya di hadapan orang lain mengaktifkan respons perlindungan muka: kepergian Fatima bukan penghindaran akuntabilitas, melainkan perlindungan martabat.\n\nIni adalah salah satu kesalahan baca yang paling berdampak yang bisa dilakukan seorang pemimpin — bukan karena umpan baliknya salah, tetapi karena metodenya menghancurkan hubungan yang seharusnya diperkuat oleh umpan balik tersebut.",
    },
    takeaway: {
      en: "Next time, for anything corrective: private first, always. Ask to meet one-on-one, name what you observed, and ask what got in the way. The conversation changes completely.",
      id: "Lain kali, untuk hal apa pun yang bersifat korektif: pribadi dulu, selalu. Minta untuk bertemu empat mata, ungkapkan apa yang kamu amati, dan tanyakan apa yang menjadi hambatan. Percakapannya berubah sepenuhnya.",
    },
  },
  {
    number: 4,
    title: { en: "Relationship Before Business", id: "Hubungan Sebelum Bisnis" },
    region: { en: "Middle East · Africa · Southeast Asia", id: "Timur Tengah · Afrika · Asia Tenggara" },
    setup: { en: "The meeting before the meeting is not a delay. It is the meeting.", id: "Pertemuan sebelum pertemuan bukan penundaan. Itulah pertemuannya." },
    dialogue: [
      { speaker: "Christine (country manager, Canadian)", text: { en: "Great — so we're agreed on the partnership terms. Shall we get the contract drafted?", id: "Bagus — jadi kita sudah sepakat dengan syarat-syarat kemitraan. Apakah kita mulai menyusun kontraknya?" } },
      { speaker: "Emmanuel (CEO, Nigerian)", text: { en: "Yes, yes. But first, how is your family? You mentioned your son last time. How is he doing?", id: "Ya, ya. Tapi pertama, bagaimana kabar keluargamu? Kamu menyebut anakmu terakhir kali. Bagaimana keadaannya?" } },
      { speaker: "Christine (slightly impatient)", text: { en: "He's fine, thank you. So on the contract — should we aim to have it signed by end of month?", id: "Dia baik-baik saja, terima kasih. Jadi soal kontrak — haruskah kita menargetkan penandatanganan sebelum akhir bulan?" } },
      { speaker: "Emmanuel", text: { en: "Of course. But sit — let me have them bring tea. You know, my father used to say, the agreement between men is not the paper they sign. It is the trust they build.", id: "Tentu. Tapi duduklah — biar saya minta mereka membawakan teh. Kamu tahu, ayah saya dulu selalu berkata, kesepakatan antara manusia bukan kertas yang mereka tandatangani. Melainkan kepercayaan yang mereka bangun." } },
      { speaker: "Christine (later, to her colleague)", text: { en: "We're three meetings in and we still haven't got to the details.", id: "Kita sudah tiga kali rapat dan masih belum sampai ke detailnya." } },
    ],
    options: [
      { label: { en: "Emmanuel is stalling the contract process to gain negotiating time.", id: "Emmanuel menunda proses kontrak untuk mendapatkan waktu bernegosiasi." }, isCorrect: false },
      { label: { en: "Emmanuel is disorganised and unfocused.", id: "Emmanuel tidak terorganisir dan tidak fokus." }, isCorrect: false },
      { label: { en: "Emmanuel is building the relational foundation without which no contract will hold. The tea is not a delay. It is the work.", id: "Emmanuel sedang membangun fondasi relasional yang tanpanya tidak ada kontrak yang akan bertahan. Teh itu bukan penundaan. Itulah pekerjaannya." }, isCorrect: true },
    ],
    reveal: {
      en: "Across much of sub-Saharan Africa, the Middle East, and Latin America, relationship is not a precondition for doing business — relationship is the business. A contract signed without relational trust is, in practice, fragile. When things go wrong (and they do), the document is less important than the relationship that determines how both parties will behave.\n\nEmmanuel's father's words are not sentiment. They are operational wisdom, validated by experience in relational-transaction cultures.\n\nWhat Christine reads as inefficiency, Emmanuel reads as essential diligence. The time spent building trust is the investment that protects the partnership when it is tested. A leader who rushes past relationship-building to get to the agenda has, in many contexts, already damaged what they came to protect.\n\nThis pattern has a name in Indonesian culture: basa-basi — the relational preamble that establishes respect before substance. The form varies by culture. The function is the same: relationship is context, and context carries the message.",
      id: "Di sebagian besar wilayah Afrika sub-Sahara, Timur Tengah, dan Amerika Latin, hubungan bukan prasyarat untuk berbisnis — hubungan adalah bisnisnya itu sendiri. Kontrak yang ditandatangani tanpa kepercayaan relasional, dalam praktiknya, sangat rapuh. Ketika sesuatu berjalan tidak sesuai rencana (dan itu pasti terjadi), dokumennya kurang penting dibanding hubungan yang menentukan bagaimana kedua pihak akan berperilaku.\n\nKata-kata ayah Emmanuel bukan sekadar sentimentalitas. Itu adalah kebijaksanaan operasional, yang divalidasi oleh pengalaman dalam budaya transaksi relasional.\n\nApa yang dibaca Christine sebagai ketidakefisienan, dibaca Emmanuel sebagai ketekunan yang esensial. Waktu yang dihabiskan untuk membangun kepercayaan adalah investasi yang melindungi kemitraan ketika diuji. Seorang pemimpin yang terburu-buru melewati pembangunan hubungan untuk sampai ke agenda, dalam banyak konteks, sudah merusak apa yang mereka datangi untuk dilindungi.\n\nPola ini punya nama dalam budaya Indonesia: basa-basi — basa-basi relasional yang membangun rasa hormat sebelum substansi. Bentuknya berbeda-beda menurut budaya. Fungsinya sama: hubungan adalah konteks, dan konteks membawa pesan.",
    },
    takeaway: {
      en: "Next time you are impatient with the preamble, ask yourself: what would it mean to this person if you skipped it? The answer is usually worth slowing down for.",
      id: "Lain kali kamu tidak sabar dengan basa-basi, tanyakan pada dirimu sendiri: apa artinya bagi orang ini jika kamu melewatinya? Jawabannya biasanya sepadan dengan waktu untuk melambat.",
    },
  },
  {
    number: 5,
    title: { en: "Who Really Decides", id: "Siapa yang Sebenarnya Memutuskan" },
    region: { en: "Japan · West Africa · Indonesia", id: "Jepang · Afrika Barat · Indonesia" },
    setup: { en: "The person who speaks last in the meeting may not be the one who decided.", id: "Orang yang berbicara terakhir dalam rapat mungkin bukan orang yang mengambil keputusan." },
    dialogue: [
      { speaker: "Sarah (project consultant, American)", text: { en: "So the leadership team endorsed the proposal. When can we expect sign-off from Mr. Park?", id: "Jadi tim kepemimpinan sudah mendukung proposalnya. Kapan kita bisa mengharapkan persetujuan dari Pak Park?" } },
      { speaker: "Ji-woo (senior analyst, Korean)", text: { en: "Mr. Park will confirm next week.", id: "Pak Park akan mengonfirmasi minggu depan." } },
      { speaker: "Sarah", text: { en: "But he was in the meeting. He seemed positive.", id: "Tapi dia ada dalam rapat. Dia tampak positif." } },
      { speaker: "Ji-woo", text: { en: "Yes. The team will need to discuss further.", id: "Ya. Tim perlu mendiskusikannya lebih lanjut." } },
      { speaker: "Sarah", text: { en: "Didn't we just spend three hours discussing it?", id: "Bukankah kita baru saja menghabiskan tiga jam mendiskusikannya?" } },
      { speaker: "Ji-woo", text: { en: "[long pause]", id: "[jeda panjang]" }, isSilence: true },
    ],
    options: [
      { label: { en: "The organisation is bureaucratic and indecisive.", id: "Organisasi ini birokratis dan tidak tegas." }, isCorrect: false },
      { label: { en: "Ji-woo is blocking the proposal for personal reasons.", id: "Ji-woo menghalangi proposal karena alasan pribadi." }, isCorrect: false },
      { label: { en: "The meeting was not the decision point. The real decision happens in the consultation process that surrounds it.", id: "Rapat bukan titik pengambilan keputusan. Keputusan nyata terjadi dalam proses konsultasi yang mengelilinginya." }, isCorrect: true },
    ],
    reveal: {
      en: "In Japanese corporate culture, nemawashi describes the process of informal pre-consultation — building consensus before the formal meeting so that the meeting itself is a confirmation, not a deliberation. The visible meeting is the last step of a process that has been running quietly in the background.\n\nIn South African Zulu and Xhosa traditions, indaba refers to a community gathering where decisions are made through deep collective deliberation — the process of reaching shared understanding cannot be rushed. In Indonesian culture, musyawarah mufakat (deliberation toward consensus) follows the same principle: genuine consensus cannot be forced and does not emerge in a single formal meeting.\n\nFor a leader from a culture where meetings are decision points, watching an apparently agreed proposal disappear into \"further discussion\" is baffling. But in high-context, consensus-oriented cultures, a decision announced in a meeting without prior relational alignment is fragile — and often quietly reversed.\n\nThe process is not slower than decision-by-vote. It is different. It produces a different kind of agreement: one that has been woven into the fabric of relationships before it is formally announced.",
      id: "Dalam budaya perusahaan Jepang, nemawashi menggambarkan proses pra-konsultasi informal — membangun konsensus sebelum rapat formal sehingga rapat itu sendiri adalah konfirmasi, bukan musyawarah. Rapat yang terlihat adalah langkah terakhir dari sebuah proses yang telah berjalan diam-diam di latar belakang.\n\nDalam tradisi Zulu dan Xhosa Afrika Selatan, indaba mengacu pada pertemuan komunitas di mana keputusan dibuat melalui musyawarah kolektif yang mendalam — proses mencapai pemahaman bersama tidak bisa dipaksakan. Dalam budaya Indonesia, musyawarah mufakat (musyawarah menuju mufakat) mengikuti prinsip yang sama: konsensus sejati tidak bisa dipaksakan dan tidak muncul dalam satu rapat formal.\n\nBagi seorang pemimpin dari budaya di mana rapat adalah titik pengambilan keputusan, melihat proposal yang tampaknya sudah disepakati menghilang ke dalam \"diskusi lebih lanjut\" sungguh membingungkan. Namun dalam budaya berkonteks tinggi yang berorientasi pada konsensus, sebuah keputusan yang diumumkan dalam rapat tanpa keselarasan relasional sebelumnya sangat rapuh — dan sering kali dibatalkan secara diam-diam.\n\nProsesnya bukan lebih lambat dari pengambilan keputusan lewat pemungutan suara. Prosesnya berbeda. Ini menghasilkan jenis kesepakatan yang berbeda: satu yang telah dijalin ke dalam jalinan hubungan sebelum diumumkan secara resmi.",
    },
    takeaway: {
      en: "Next time you need a decision from a consensus-oriented team, ask: 'Who else needs to be part of this conversation before it lands?' Finding out early saves weeks.",
      id: "Lain kali kamu membutuhkan keputusan dari tim yang berorientasi pada konsensus, tanyakan: 'Siapa lagi yang perlu menjadi bagian dari percakapan ini sebelum keputusan diambil?' Mengetahuinya lebih awal bisa menghemat berminggu-minggu waktu.",
    },
  },
];

// ─── Self-mapping canvas prompts ──────────────────────────────────────────────
const CANVAS_PROMPTS = [
  {
    eyebrow: { en: "Prompt 1 — Your Default", id: "Pertanyaan 1 — Defaultmu" },
    heading: {
      en: "Where would you plot yourself on this scale, based on how you actually communicate — not how you think you should?",
      id: "Di mana kamu akan menempatkan dirimu dalam skala ini, berdasarkan cara kamu sebenarnya berkomunikasi — bukan cara yang menurutmu seharusnya?",
    },
    hint: {
      en: "Look at the cultures plotted above. Do you tend toward the explicit end — direct, written, task-first? Or toward the implicit end — reading the room, building relationship before business, leaving things unsaid?",
      id: "Lihat budaya-budaya yang digambar di atas. Apakah kamu cenderung ke ujung eksplisit — langsung, tertulis, tugas lebih dulu? Atau ke ujung implisit — membaca suasana, membangun hubungan sebelum bisnis, membiarkan hal-hal tidak diucapkan?",
    },
  },
  {
    eyebrow: { en: "Prompt 2 — The People You Lead", id: "Pertanyaan 2 — Orang-orang yang Kamu Pimpin" },
    heading: {
      en: "Name one or two cultures you work with most closely. Based on what you have seen in the signal rooms — where would you place them?",
      id: "Sebutkan satu atau dua budaya yang paling sering kamu kerjakan. Berdasarkan apa yang kamu lihat di ruang sinyal — di mana kamu akan menempatkan mereka?",
    },
    hint: {
      en: "You are not labelling them permanently. You are estimating a tendency so you can communicate more intentionally.",
      id: "Kamu tidak memberi label secara permanen. Kamu memperkirakan kecenderungan agar bisa berkomunikasi dengan lebih disengaja.",
    },
  },
  {
    eyebrow: { en: "Prompt 3 — The Gap", id: "Pertanyaan 3 — Kesenjangan" },
    heading: {
      en: "Where is the largest gap between your default and theirs? What is one thing you could adjust this week to close it?",
      id: "Di mana kesenjangan terbesar antara defaultmu dan default mereka? Apa satu hal yang bisa kamu sesuaikan minggu ini untuk menutupnya?",
    },
    hint: {
      en: "Not a permanent change. Not an identity shift. Just one adjustment — one deliberate move toward their communication language.",
      id: "Bukan perubahan permanen. Bukan pergeseran identitas. Hanya satu penyesuaian — satu langkah yang disengaja menuju bahasa komunikasi mereka.",
    },
  },
];

// ─── Key Takeaways ────────────────────────────────────────────────────────────
const KEY_TAKEAWAYS = [
  {
    en: {
      title: "The message is rarely just in the words.",
      body: "In high-context cultures, the message lives in the relationship, the setting, and what is NOT said — not only in the words. Most of the world communicates this way.",
    },
    id: {
      title: "Pesan jarang hanya ada dalam kata-kata.",
      body: "Dalam budaya berkonteks tinggi, pesan ada dalam hubungan, setting, dan apa yang TIDAK dikatakan — bukan hanya dalam kata-kata. Sebagian besar dunia berkomunikasi dengan cara ini.",
    },
  },
  {
    en: {
      title: "Five dynamics, one pattern — different names, same need.",
      body: "Indirect refusal, communicative silence, face-saving, relationship as prerequisite, and consensus before announcement. Different names, same patterns.",
    },
    id: {
      title: "Lima dinamika, satu pola — nama berbeda, kebutuhan sama.",
      body: "Penolakan tidak langsung, keheningan komunikatif, menjaga muka, hubungan sebagai prasyarat, dan konsensus sebelum pengumuman. Nama yang berbeda, pola yang sama.",
    },
  },
  {
    en: {
      title: "The gap between your default and theirs is the work.",
      body: "The gap between your communication instinct and your team's is not a problem to be eliminated. It is the place where the most important learning happens.",
    },
    id: {
      title: "Kesenjangan antara defaultmu dan default mereka adalah pekerjaannya.",
      body: "Kesenjangan antara naluri komunikasimu dan naluri timmu bukan masalah yang harus dihilangkan. Itulah tempat di mana pembelajaran terpenting terjadi.",
    },
  },
];

const FAITH_PARAS = {
  en: [
    "God did not communicate the gospel from a distance. <em>John 1:14</em> says the Word became flesh and dwelt among us. The incarnation is not a strategy — it is a statement about how God chose to reach people. He entered a specific culture, language, and moment in history. He worked with the grain of context, not against it.",
    "Jesus did this throughout his ministry. With Nicodemus — an educated religious leader — he engaged the language of Torah and rebirth. With a woman at a well in Samaria — an outsider by every social measure — he opened with water, the thing right in front of them. With fishing communities, he used nets and harvests. The message never changed. The entry point always did.",
    "Paul at Athens is perhaps the most instructive example for leaders working across contexts today. Before he spoke, he observed the city. He engaged different communities. He found a bridge in something the Athenians themselves had built — an altar to an unknown god. Then he quoted their own poets back to them. He was not trying to trick his audience into the gospel. He was trying to speak in a way they could actually hear.",
    "This is not mere technique. Dean Flemming (2004) argues that Paul's approach at Athens shows that both form and substance can be contextualised without compromising the core of the message. Developing the capacity to communicate across high and low-context cultures is, for a follower of Jesus, a theological calling — not just a professional skill.",
  ],
  id: [
    "Allah tidak mengomunikasikan Injil dari kejauhan. <em>Yohanes 1:14</em> mengatakan Firman itu menjadi manusia dan diam di antara kita. Inkarnasi bukan sebuah strategi — ini adalah pernyataan tentang bagaimana Allah memilih untuk menjangkau manusia. Dia masuk ke dalam budaya, bahasa, dan momen sejarah yang spesifik. Dia bekerja mengikuti alur konteks, bukan melawannya.",
    "Yesus melakukan ini sepanjang pelayanan-Nya. Dengan Nikodemus — seorang pemimpin agama yang terpelajar — Dia berbicara dalam bahasa Taurat dan kelahiran baru. Dengan seorang perempuan di sumur di Samaria — seorang orang luar menurut setiap tolok ukur sosial — Dia membuka percakapan dengan air, hal yang ada tepat di hadapan mereka. Dengan komunitas nelayan, Dia menggunakan jala dan panen. Pesannya tidak pernah berubah. Titik masuknya selalu berubah.",
    "Paulus di Atena mungkin adalah contoh yang paling instruktif bagi para pemimpin yang bekerja lintas konteks saat ini. Sebelum berbicara, dia mengamati kota itu. Dia terlibat dengan berbagai komunitas. Dia menemukan jembatan dalam sesuatu yang dibangun oleh orang Atena sendiri — sebuah mezbah untuk allah yang tidak dikenal. Kemudian dia mengutip penyair-penyair mereka sendiri. Dia tidak mencoba mengelabui pendengarnya masuk ke dalam Injil. Dia mencoba berbicara dengan cara yang benar-benar bisa mereka dengar.",
    "Ini bukan sekadar teknik. Dean Flemming (2004) berpendapat bahwa pendekatan Paulus di Atena menunjukkan bahwa bentuk maupun substansi dapat dikontekstualisasi tanpa mengorbankan inti pesannya. Mengembangkan kemampuan untuk berkomunikasi lintas budaya berkonteks tinggi dan rendah adalah, bagi seorang pengikut Yesus, sebuah panggilan teologis — bukan sekadar keterampilan profesional.",
  ],
};

const FIELD_STORY = {
  en: "I had been leading the team for about eight months when I realized I had been running meetings I did not actually understand.\n\nEvery week, I would ask if there were concerns. Every week, the room was quiet. I took this as a good sign. The team was aligned. Progress was clear. When things did not get done, I assumed it was capacity — never communication.\n\nThen a local colleague I trusted pulled me aside after a meeting. She did not challenge me. She just asked a question. \"Do you know what it costs someone on this team to speak up in the room when you are there?\"\n\nI did not know what she meant. She explained, carefully, that my directness — which I thought of as efficiency — landed as pressure. When I asked for concerns in a group, people heard: perform confidence in front of the leader. No one was going to raise a problem there.\n\nI started meeting people one-on-one before group sessions. I stopped asking \"are there any concerns\" and started asking \"help me understand what might slow this down.\" The amount of information that came back was humbling.\n\nI had not changed my team. I had changed where I was listening.",
  id: "Saya sudah memimpin tim selama sekitar delapan bulan ketika saya menyadari bahwa saya telah menjalankan rapat-rapat yang sebenarnya tidak saya pahami.\n\nSetiap minggu, saya bertanya apakah ada kekhawatiran. Setiap minggu, ruangan itu sunyi. Saya mengambil ini sebagai pertanda baik. Tim sudah selaras. Kemajuan jelas terlihat. Ketika sesuatu tidak terselesaikan, saya berasumsi itu soal kapasitas — bukan komunikasi.\n\nKemudian seorang rekan lokal yang saya percaya menarik saya ke samping setelah sebuah rapat. Dia tidak menantang saya. Dia hanya mengajukan satu pertanyaan. \"Apakah kamu tahu berapa biaya yang harus dibayar seseorang di tim ini untuk berbicara di ruangan ketika kamu ada di sana?\"\n\nSaya tidak mengerti apa yang dia maksud. Dia menjelaskan, dengan hati-hati, bahwa ketegasan saya — yang saya pikir adalah efisiensi — terasa seperti tekanan. Ketika saya meminta kekhawatiran dalam kelompok, orang-orang mendengar: tampilkan kepercayaan diri di hadapan pemimpin. Tidak ada yang akan mengangkat masalah di sana.\n\nSaya mulai menemui orang-orang secara empat mata sebelum sesi kelompok. Saya berhenti bertanya \"apakah ada kekhawatiran\" dan mulai bertanya \"bantu saya memahami apa yang mungkin memperlambat hal ini.\" Jumlah informasi yang kembali sangat merendahkan hati.\n\nSaya tidak mengubah tim saya. Saya mengubah tempat saya mendengarkan.",
};

const RESEARCH_BG_PARAS_EN = `Where the framework came from

The term "high-context culture" was introduced by American anthropologist Edward T. Hall in his 1976 book Beyond Culture, building on observations first published in The Silent Language in 1959. Hall proposed that cultures exist on a spectrum: in low-context cultures, meaning is carried primarily in explicit verbal messages; in high-context cultures, meaning is embedded in relationships, shared history, and implicit signals.

Hall's framework became, for decades, the most cited model in intercultural communication training. It offered practitioners a useful vocabulary for something real: the fact that people from different cultural backgrounds can be sitting in the same conversation and experiencing entirely different exchanges.

The evidence problem

Here is what module designers and learners need to know honestly: Hall's framework was never built on systematic research. He offered no methodology, no measurement instrument, and no peer-reviewed validation for placing specific countries on his spectrum. His categories emerged from personal observation and fieldwork, not from representative data.

In 2008, Peter W. Cardon published a meta-analysis in the Journal of Business and Technical Communication examining 224 articles across seven intercultural communication journals. His conclusion was pointed: Hall's model was "never described with any empirical rigour," and "no known research involving any instrument or measure of contexting validates it" (Cardon 2008).

Kittler, Rygl, and Mackinnon's 2011 review in the International Journal of Cross Cultural Management reached similar conclusions, finding that most research using Hall's country classifications relies on "seemingly less-than-adequate evidence" and may amount to little more than codified cultural stereotyping (Kittler et al. 2011).

This is not a reason to throw the framework away. It is a reason to hold it lightly. The communication tendencies it names — indirect refusal, silence as communication, face-saving, relational preamble, consensus before announcement — are documented across many independent research traditions. They are real. They simply cannot be predicted from nationality alone.

More reliable tools

Several more rigorous frameworks inform this module. Erin Meyer's Culture Map (2014), developed at INSEAD through extensive research across more than 62 countries, operationalises Hall's communicating dimension as the first of eight independent cultural scales. Meyer's contribution is important: she shows that cultures can be high-context in communication but low-context in other dimensions, correcting the oversimplification of treating "high-context culture" as a single monolithic identity.

The GLOBE Project (House et al. 2004), which surveyed more than 17,000 middle managers across 62 societies on nine cultural dimensions, provides large-scale empirical grounding for many of the patterns described in this module — particularly the relationship between in-group collectivism, power distance, and indirect communication norms.

Geert Hofstede's cultural dimensions model offers useful context for understanding why high-context communication operates as it does in specific settings. The combination of high power distance and strong collectivism in many high-context cultures explains why direct challenge of authority and open group disagreement carry significant social costs.

What the research actually documents

Indirect refusal has been documented across Japanese, Korean, Arabic, and Southeast Asian communication contexts. The phrase "it may be difficult" in Korean or Japanese business communication carries the force of a refusal for experienced participants — but reads as uncertainty to an outside observer.

Silence as communication is grounded in the kuuki wo yomu ("reading the air") concept in Japanese communication, and in documented sungkan culture in Indonesian workplaces. Research by CIPD (2017) found that sungkan — a Javanese concept describing respectful restraint — contributed to regular misunderstandings in Indonesian workplaces.

Face-saving as a cross-cultural pattern is well documented. The Chinese concept mianzi, the Arabic wajh, Spanish dignidad, and Indonesian and Malay malu represent parallel constructs in independent cultural traditions, all pointing to the same dynamic: public criticism is experienced as an attack on social standing.

A note on individuals

Every framework used in this module carries the same limitation: communication tendencies are real at the population level, but they cannot predict how any individual will communicate. Younger professionals, internationally educated workers, urban contexts, and third-culture individuals may communicate very differently from the patterns described here. Treat these frameworks as a starting orientation — a way to name what you are noticing — rather than as a system for categorising people.`;

const RESEARCH_BG_PARAS_ID = `Dari mana kerangka ini berasal

Istilah "budaya berkonteks tinggi" diperkenalkan oleh antropolog Amerika Edward T. Hall dalam bukunya Beyond Culture (1976), yang dibangun di atas pengamatan yang pertama kali diterbitkan dalam The Silent Language pada tahun 1959. Hall mengusulkan bahwa budaya ada dalam sebuah spektrum: dalam budaya berkonteks rendah, makna terutama dibawa dalam pesan verbal yang eksplisit; dalam budaya berkonteks tinggi, makna tertanam dalam hubungan, sejarah bersama, dan sinyal implisit.

Kerangka Hall menjadi, selama beberapa dekade, model yang paling banyak dikutip dalam pelatihan komunikasi lintas budaya. Ini menawarkan kepada para praktisi kosakata yang berguna untuk sesuatu yang nyata: kenyataan bahwa orang-orang dari latar belakang budaya yang berbeda bisa duduk dalam percakapan yang sama namun mengalami pertukaran yang sepenuhnya berbeda.

Masalah bukti

Inilah yang perlu diketahui secara jujur: kerangka Hall tidak pernah dibangun atas penelitian sistematis. Pada tahun 2008, Peter W. Cardon menerbitkan meta-analisis yang memeriksa 224 artikel di tujuh jurnal komunikasi lintas budaya. Kesimpulannya: model Hall "tidak pernah dijelaskan dengan ketelitian empiris apa pun." Tinjauan Kittler dkk. (2011) mencapai kesimpulan serupa.

Ini bukan alasan untuk membuang kerangka tersebut. Ini adalah alasan untuk memegangnya dengan longgar. Kecenderungan komunikasi yang disebutkannya nyata. Namun tidak bisa diprediksi dari kebangsaan saja.

Alat yang lebih andal

Beberapa kerangka yang lebih ketat menginformasikan modul ini. Culture Map karya Erin Meyer (2014), yang dikembangkan di INSEAD melalui penelitian ekstensif di lebih dari 62 negara, mengoperasionalkan dimensi komunikasi Hall sebagai yang pertama dari delapan skala budaya independen.

Proyek GLOBE (House dkk. 2004), yang mensurvei lebih dari 17.000 manajer menengah di 62 masyarakat, memberikan landasan empiris berskala besar untuk banyak pola yang dijelaskan dalam modul ini.

Apa yang sebenarnya didokumentasikan penelitian

Penolakan tidak langsung terdokumentasi di seluruh konteks komunikasi Jepang, Korea, Arab, dan Asia Tenggara. Keheningan sebagai komunikasi didasarkan pada konsep kuuki wo yomu dalam komunikasi Jepang, dan dalam budaya sungkan yang terdokumentasi di tempat kerja Indonesia.

Menjaga muka sebagai pola lintas budaya terdokumentasi dengan baik — mianzi Tionghoa, wajh Arab, dignidad Spanyol, dan malu Indonesia semuanya menunjuk pada dinamika yang sama: kritik publik dialami sebagai serangan terhadap kedudukan sosial.

Catatan tentang individu

Setiap kerangka dalam modul ini membawa batasan yang sama: kecenderungan komunikasi nyata di tingkat populasi, tetapi tidak dapat memprediksi bagaimana individu mana pun akan berkomunikasi. Perlakukan kerangka-kerangka ini sebagai orientasi awal — cara untuk menamai apa yang kamu perhatikan — bukan sebagai sistem untuk mengkategorikan orang.`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContextCalibrationGauge({ lang }: { lang: "en" | "id" }) {
  const t = (en: string, id: string) => (lang === "id" ? id : en);

  // Axis band geometry
  const BAND_Y = 152;   // top of gradient band
  const BAND_H = 18;    // band height
  const AXIS_Y = BAND_Y + BAND_H / 2; // 161 — visual centre of band
  const X0 = 60;        // band left edge
  const X1 = 740;       // band right edge

  // Tick/marker y (midpoint of band)
  const TICK_Y = AXIS_Y;

  // Label rows
  const ROW_A = 124;    // primary above row
  const ROW_B = 98;     // secondary above row (used for Netherlands, UK, Indonesia)
  const ROW_C = 208;    // primary below row  (Brazil, Mexico, China)

  // Leader line colour
  const LEADER = "oklch(65% 0.06 260)";
  const LABEL_FILL = NAVY;

  // Culture x-positions (spread deliberately across the band)
  // Low-context squares: Germany 90, Netherlands 145, USA 205, UK 265, Australia 325
  // High-context circles: Brazil 435, Kenya 490, Mexico 548, India 600, China 654, Indonesia 702, Japan 740

  return (
    <figure style={{ margin: "0 0 56px", padding: 0 }}>
      <svg
        aria-hidden="true"
        viewBox="0 0 800 320"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          {/* Gradient band: off-white left → mid-navy right */}
          <linearGradient id="hc-spectrum-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#F8F7F4" />
            <stop offset="30%"  stopColor="#b8c8df" />
            <stop offset="65%"  stopColor="#4a6a9e" />
            <stop offset="100%" stopColor="#1B3A6B" />
          </linearGradient>
          {/* Arrowhead for axis */}
          <marker id="hc-arrowhead" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#1B3A6B" />
          </marker>
        </defs>

        {/* ── Zone background fills ──────────────────────────────────── */}
        <rect x={X0} y="20" width="260" height="266" rx="6"
          fill="oklch(92% 0.008 80)" fillOpacity="0.55" />
        <rect x="360" y="20" width="380" height="266" rx="6"
          fill="oklch(28% 0.10 260)" fillOpacity="0.10" />

        {/* ── Zone labels ───────────────────────────────────────────── */}
        <text x={X0 + 8} y="40" fontFamily={FONT_BODY} fontSize="11" fontWeight="700"
          letterSpacing="1.5" textTransform="uppercase" fill="oklch(55% 0.06 260)">
          {t("LOW-CONTEXT", "KONTEKS RENDAH")}
        </text>
        <text x={X1 - 8} y="40" textAnchor="end" fontFamily={FONT_BODY} fontSize="11"
          fontWeight="700" letterSpacing="1.5" fill="oklch(30% 0.10 260)">
          {t("HIGH-CONTEXT", "KONTEKS TINGGI")}
        </text>

        {/* ── Gradient band ─────────────────────────────────────────── */}
        <rect x={X0} y={BAND_Y} width={X1 - X0} height={BAND_H} rx="9"
          fill="url(#hc-spectrum-grad)" />
        {/* Right arrowhead continuation */}
        <line x1={X1} y1={AXIS_Y} x2={X1 + 14} y2={AXIS_Y}
          stroke="#1B3A6B" strokeWidth="1.5" markerEnd="url(#hc-arrowhead)" />

        {/* ════════ LOW-CONTEXT CULTURES (squares) ════════════════════ */}

        {/* Germany — Row A (above) */}
        <line x1="90" y1={TICK_Y} x2="90" y2={ROW_A + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <rect x="85" y={TICK_Y - 5} width="10" height="10" fill={NAVY} />
        <text x="90" y={ROW_A} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Germany", "Jerman")}
        </text>

        {/* Netherlands — Row B (above, staggered higher) */}
        <line x1="145" y1={TICK_Y} x2="145" y2={ROW_B + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <rect x="140" y={TICK_Y - 5} width="10" height="10" fill={NAVY} />
        <text x="145" y={ROW_B} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Netherlands", "Belanda")}
        </text>

        {/* USA — Row A */}
        <line x1="205" y1={TICK_Y} x2="205" y2={ROW_A + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <rect x="200" y={TICK_Y - 5} width="10" height="10" fill={NAVY} />
        <text x="205" y={ROW_A} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("USA", "AS")}
        </text>

        {/* UK — Row B */}
        <line x1="265" y1={TICK_Y} x2="265" y2={ROW_B + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <rect x="260" y={TICK_Y - 5} width="10" height="10" fill={NAVY} />
        <text x="265" y={ROW_B} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("UK", "Inggris")}
        </text>

        {/* Australia — Row A */}
        <line x1="325" y1={TICK_Y} x2="325" y2={ROW_A + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <rect x="320" y={TICK_Y - 5} width="10" height="10" fill={NAVY} />
        <text x="325" y={ROW_A} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Australia", "Australia")}
        </text>

        {/* ════════ YOU? marker — between zones ══════════════════════ */}
        {/* Dashed drop-line */}
        <line x1="390" y1="64" x2="390" y2={TICK_Y - 2}
          stroke={ORANGE} strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
        {/* Marker ring */}
        <circle cx="390" cy={TICK_Y} r="10" fill="none" stroke={ORANGE} strokeWidth="2" />
        {/* Label */}
        <text x="390" y="60" textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="700" fill={ORANGE}>
          {t("You?", "Kamu?")}
        </text>

        {/* ════════ HIGH-CONTEXT CULTURES (circles) ═══════════════════ */}

        {/* Brazil — Row C (below) */}
        <circle cx="435" cy={TICK_Y} r="6" fill={NAVY} />
        <line x1="435" y1={TICK_Y + 6} x2="435" y2={ROW_C - 14}
          stroke={LEADER} strokeWidth="0.8" />
        <text x="435" y={ROW_C} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Brazil", "Brasil")}
        </text>

        {/* Kenya — Row A (above) */}
        <circle cx="490" cy={TICK_Y} r="6" fill={NAVY} />
        <line x1="490" y1={TICK_Y - 6} x2="490" y2={ROW_A + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <text x="490" y={ROW_A} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Kenya", "Kenya")}
        </text>

        {/* Mexico — Row C (below) */}
        <circle cx="548" cy={TICK_Y} r="6" fill={NAVY} />
        <line x1="548" y1={TICK_Y + 6} x2="548" y2={ROW_C - 14}
          stroke={LEADER} strokeWidth="0.8" />
        <text x="548" y={ROW_C} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Mexico", "Meksiko")}
        </text>

        {/* India — Row A (above) */}
        <circle cx="600" cy={TICK_Y} r="6" fill={NAVY} />
        <line x1="600" y1={TICK_Y - 6} x2="600" y2={ROW_A + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <text x="600" y={ROW_A} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("India", "India")}
        </text>

        {/* China — Row C (below) */}
        <circle cx="650" cy={TICK_Y} r="6" fill={NAVY} />
        <line x1="650" y1={TICK_Y + 6} x2="650" y2={ROW_C - 14}
          stroke={LEADER} strokeWidth="0.8" />
        <text x="650" y={ROW_C} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("China", "Tiongkok")}
        </text>

        {/* Indonesia — Row B (above, staggered higher) */}
        <circle cx="698" cy={TICK_Y} r="6" fill={NAVY} />
        <line x1="698" y1={TICK_Y - 6} x2="698" y2={ROW_B + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <text x="698" y={ROW_B} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Indonesia", "Indonesia")}
        </text>

        {/* Japan — Row A (above) */}
        <circle cx="740" cy={TICK_Y} r="6" fill={NAVY} />
        <line x1="740" y1={TICK_Y - 6} x2="740" y2={ROW_A + 3}
          stroke={LEADER} strokeWidth="0.8" />
        <text x="740" y={ROW_A} textAnchor="middle" fontFamily={FONT_BODY}
          fontSize="14" fontWeight="600" fill={LABEL_FILL}>
          {t("Japan", "Jepang")}
        </text>

        {/* ── Legend row ────────────────────────────────────────────── */}
        {/* Centred legend strip */}
        <rect x="150" y="272" width="500" height="32" rx="8"
          fill="oklch(92% 0.008 80)" fillOpacity="0.7" />

        {/* Square legend item */}
        <rect x="180" y="282" width="10" height="10" fill={NAVY} />
        <text x="198" y="291" fontFamily={FONT_BODY} fontSize="12" fontWeight="500" fill={NAVY}>
          {t("Square = task / cognitive", "Kotak = tugas / kognitif")}
        </text>

        {/* Circle legend item */}
        <circle cx="404" cy="287" r="5.5" fill={NAVY} />
        <text x="417" y="291" fontFamily={FONT_BODY} fontSize="12" fontWeight="500" fill={NAVY}>
          {t("Circle = relational / affective", "Lingkaran = relasional / afektif")}
        </text>
      </svg>
      <figcaption style={{
        fontFamily: FONT_BODY,
        fontSize: 13,
        fontStyle: "italic",
        color: "oklch(48% 0.04 260)",
        lineHeight: 1.7,
        maxWidth: 640,
        margin: "20px auto 0",
        textAlign: "center",
      }}>
        {t(
          "Communication styles on a spectrum from low-context (explicit, direct, written) to high-context (implicit, indirect, relational). Position is relative; every culture contains internal variation.",
          "Gaya komunikasi dalam spektrum dari konteks rendah (eksplisit, langsung, tertulis) hingga konteks tinggi (implisit, tidak langsung, relasional). Posisi bersifat relatif; setiap budaya mengandung variasi internal."
        )}
      </figcaption>
    </figure>
  );
}

function SignalRoom({
  room,
  roomIndex,
  choice,
  onChoice,
  lang,
}: {
  room: SignalRoom;
  roomIndex: number;
  choice: number | undefined;
  onChoice: (roomIndex: number, optionIndex: number) => void;
  lang: "en" | "id";
}) {
  const t = (en: string, id: string) => (lang === "id" ? id : en);
  const hasChosen = choice !== undefined;
  const isCorrectChoice = hasChosen && room.options[choice].isCorrect;

  return (
    <div style={{
      background: "oklch(18% 0.09 260)",
      border: "1px solid oklch(30% 0.09 260)",
      borderRadius: 16,
      padding: "clamp(24px, 4vw, 40px)",
      marginBottom: 48,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: FONT_HEADLINE, fontSize: 44, fontWeight: 700, color: "oklch(35% 0.10 260)", lineHeight: 1, flexShrink: 0 }}>
            {room.number}
          </span>
          <div>
            <h3 style={{ fontFamily: FONT_BODY, fontSize: 18, fontWeight: 800, color: OFF_WHITE, margin: 0, lineHeight: 1.2 }}>
              {room.title[lang]}
            </h3>
          </div>
        </div>
        <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, padding: "4px 10px", border: "1px solid oklch(40% 0.10 260)", borderRadius: 20, whiteSpace: "nowrap", alignSelf: "center" }}>
          {room.region[lang]}
        </span>
      </div>

      {/* Setup */}
      <p style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(15px, 1.8vw, 18px)", fontStyle: "italic", color: "oklch(72% 0.04 260)", lineHeight: 1.6, margin: "0 0 20px" }}>
        {room.setup[lang]}
      </p>

      {/* Dialogue */}
      <div
        style={{ background: "oklch(14% 0.07 260)", borderRadius: 10, padding: "20px 24px", marginBottom: 28 }}
        role="region"
        aria-label={t("Dialogue", "Dialog")}
      >
        {room.dialogue.map((line, i) => (
          <div key={i} style={{
            marginBottom: i < room.dialogue.length - 1 ? 16 : 0,
            paddingBottom: i < room.dialogue.length - 1 ? 16 : 0,
            borderBottom: i < room.dialogue.length - 1 ? "1px solid oklch(22% 0.08 260)" : "none",
          }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 4px" }}>
              {line.speaker}
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "oklch(85% 0.04 260)", lineHeight: 1.75, margin: 0, fontStyle: line.isSilence ? "italic" : "normal" }}>
              {line.text[lang]}
            </p>
          </div>
        ))}
      </div>

      {/* Decode prompt */}
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.04 260)", margin: "0 0 16px" }}>
        {t("What is happening here?", "Apa yang sedang terjadi di sini?")}
      </p>

      {/* Options */}
      <div role="group" aria-label={t("Choose what is happening in this moment", "Pilih apa yang sedang terjadi dalam momen ini")}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {room.options.map((option, optIdx) => {
          const isChosen = hasChosen && choice === optIdx;
          const isCorrect = option.isCorrect;
          const lockedOut = hasChosen && !isChosen;

          let bg = "oklch(22% 0.09 260)";
          let border = "1px solid oklch(38% 0.09 260)";
          let color = "oklch(80% 0.04 260)";

          if (isChosen && isCorrect) {
            bg = "oklch(25% 0.12 160)";
            border = "1.5px solid oklch(60% 0.14 160)";
            color = "oklch(90% 0.06 160)";
          } else if (isChosen && !isCorrect) {
            bg = "oklch(18% 0.10 25)";
            border = "1.5px solid oklch(52% 0.12 25)";
            color = "oklch(82% 0.06 25)";
          }

          return (
            <button
              key={optIdx}
              aria-pressed={isChosen}
              aria-disabled={lockedOut}
              onClick={() => onChoice(roomIndex, optIdx)}
              style={{
                background: bg,
                border,
                color,
                borderRadius: 10,
                padding: "14px 20px",
                minHeight: 44,
                cursor: lockedOut ? "default" : "pointer",
                fontFamily: FONT_BODY,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.5,
                textAlign: "left",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                transition: "background 0.15s, border-color 0.15s",
                opacity: lockedOut ? 0.45 : 1,
                pointerEvents: lockedOut ? "none" : "auto",
                width: "100%",
              }}
            >
              {hasChosen && isChosen && isCorrect && (
                <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, background: "oklch(60% 0.14 160)", color: "white", borderRadius: "50%", flexShrink: 0, fontSize: 12, fontWeight: 700 }}>✓</span>
              )}
              {hasChosen && isChosen && !isCorrect && (
                <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, background: "oklch(52% 0.12 25)", color: "white", borderRadius: "50%", flexShrink: 0, fontSize: 12, fontWeight: 700 }}>×</span>
              )}
              <span>{option.label[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* Reveal */}
      <div
        id={`room-reveal-${roomIndex}`}
        aria-live="polite"
        style={{
          marginTop: 24,
          background: "oklch(14% 0.07 260)",
          borderRadius: 10,
          padding: hasChosen ? "20px 24px" : "0",
          borderLeft: hasChosen ? "3px solid " + ORANGE : "none",
          maxHeight: hasChosen ? "2000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s ease, padding 0.2s",
        }}
      >
        {hasChosen && (
          <>
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>
              {isCorrectChoice
                ? t("You read it right", "Kamu membacanya dengan tepat")
                : t("Here is what was actually happening", "Inilah yang sebenarnya terjadi")}
            </p>
            {room.reveal[lang].split("\n\n").map((para, i) => (
              <p key={i} style={{ fontFamily: FONT_BODY, fontSize: 15, color: "oklch(85% 0.04 260)", lineHeight: 1.8, margin: i < room.reveal[lang].split("\n\n").length - 1 ? "0 0 16px" : 0 }}>
                {para}
              </p>
            ))}
            <div style={{ marginTop: 20, padding: "12px 16px", background: "oklch(20% 0.09 260)", borderRadius: 8, borderLeft: "3px solid oklch(45% 0.12 160)" }}>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.10 160)", margin: "0 0 6px" }}>
                {t("Next time", "Lain kali")}
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "oklch(80% 0.04 260)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
                {room.takeaway[lang]}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  isSaved: boolean;
  [key: string]: unknown;
};

export default function UnderstandingHighContextClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: "en" | "id" = ctxLang === "id" ? "id" : "en";
  const t = (en: string, id: string) => (lang === "id" ? id : en);

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [roomChoices, setRoomChoices] = useState<Record<number, number>>({});
  const [bgOpen, setBgOpen] = useState(false);

  const handleSave = () => {
    if (saved || isPending) return;
    startTransition(async () => {
      await saveResourceToDashboard("understanding-high-context");
      setSaved(true);
    });
  };

  const handleChoice = (roomIndex: number, optionIndex: number) => {
    if (roomIndex in roomChoices) return;
    setRoomChoices((prev) => ({ ...prev, [roomIndex]: optionIndex }));
  };

  return (
    <>
      <LangToggle />

      {/* 1 — Hero (NAVY) */}
      <div style={{ background: NAVY, padding: "clamp(64px, 10vw, 96px) 24px clamp(56px, 8vw, 80px)", position: "relative", overflow: "hidden" }}>
        {/* Background hero image */}
        <img
          src="/images/resources/understanding-high-context/hero-layered-light.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.22,
            mixBlendMode: "luminosity",
          }}
        />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
            {t("Cross-Cultural — Module", "Lintas Budaya — Modul")}
          </p>
          <h1 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.08, margin: "0 0 24px" }}>
            {t("Understanding High-Context Cultures", "Memahami Budaya Berkonteks Tinggi")}
          </h1>
          <p style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(17px, 2.2vw, 22px)", fontStyle: "italic", color: "oklch(82% 0.03 260)", lineHeight: 1.65, maxWidth: 580, margin: "0 0 40px" }}>
            {HERO_SUBTITLE[lang]}
          </p>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            aria-label={t("Save this module to your dashboard", "Simpan modul ini ke dashboard kamu")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: saved ? "oklch(35% 0.08 260)" : "transparent",
              color: "oklch(75% 0.04 260)",
              padding: "14px 28px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: FONT_BODY,
              border: "1px solid oklch(42% 0.08 260)",
              cursor: saved || isPending ? "default" : "pointer",
              minHeight: 44,
            }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {isPending
              ? t("Saving…", "Menyimpan…")
              : saved
                ? t("Saved to Dashboard", "Tersimpan di Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard")}
          </button>
        </div>
      </div>

      {/* 2 — Opening Teaching (OFF_WHITE) */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Opening Teaching", "Pengajaran Pembuka")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, margin: "0 0 12px" }}>
            {t("What high-context actually means", "Apa sebenarnya yang dimaksud 'berkonteks tinggi'")}
          </h2>
          <p style={{ ...prose, fontFamily: FONT_HEADLINE, fontSize: "clamp(16px, 1.9vw, 20px)", fontStyle: "italic", color: BODY_TEXT, lineHeight: 1.8, margin: "0 0 36px" }}>
            {HERO_INTRO[lang]}
          </p>
          {OPENING_TEACHING_PARAS[lang].map((para, i) => (
            <p key={i} style={prose}>{para}</p>
          ))}

          {/* Collapsible research background */}
          <div style={{ marginTop: 32 }}>
            <button
              onClick={() => setBgOpen((v) => !v)}
              aria-expanded={bgOpen}
              aria-controls="research-background-panel"
              style={{
                fontFamily: FONT_BODY,
                fontSize: 14,
                fontWeight: 600,
                color: NAVY,
                background: "none",
                border: "1px solid " + NAVY,
                padding: "10px 20px",
                borderRadius: 12,
                cursor: "pointer",
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {bgOpen
                ? t("Hide the research ↑", "Sembunyikan penelitiannya ↑")
                : t("Read the research →", "Baca penelitiannya →")}
            </button>
            {bgOpen && (
              <div
                id="research-background-panel"
                style={{ marginTop: 24, padding: "24px 28px", background: LIGHT_GRAY, borderRadius: 12, borderLeft: "4px solid " + ORANGE }}
              >
                <p style={{ ...eyebrow, marginBottom: 16 }}>
                  {t("The Research Behind This Module", "Penelitian di Balik Modul Ini")}
                </p>
                {(lang === "id" ? RESEARCH_BG_PARAS_ID : RESEARCH_BG_PARAS_EN)
                  .split("\n\n")
                  .map((para, i) => {
                    const isHeading = para.length < 60 && !para.includes(".");
                    if (isHeading) {
                      return (
                        <p key={i} style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: NAVY, margin: "20px 0 8px" }}>
                          {para}
                        </p>
                      );
                    }
                    return <p key={i} style={{ fontFamily: FONT_BODY, fontSize: 14, color: BODY_TEXT, lineHeight: 1.8, margin: "0 0 16px" }}>{para}</p>;
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 — Learning Outcomes (LIGHT_GRAY) */}
      <div style={{ background: LIGHT_GRAY, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Learning Outcomes", "Tujuan Pembelajaran")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, color: NAVY, margin: "0 0 32px", lineHeight: 1.2 }}>
            {t("By the end of this module:", "Setelah menyelesaikan modul ini:")}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            {LEARNING_OUTCOMES[lang].map((outcome, i) => (
              <li key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: ORANGE, marginTop: 9, flexShrink: 0 }} />
                <p style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 400, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                  <strong style={{ fontWeight: 700, color: NAVY }}>{outcome.keyword}</strong>
                  {outcome.rest}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4 — Signal Rooms intro (OFF_WHITE) */}
      <div style={{ background: OFF_WHITE, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: NAVY, lineHeight: 1.2, margin: "0 0 20px" }}>
            {t("Five dynamics to decode", "Lima dinamika yang perlu kamu dekode")}
          </h2>
          <p style={prose}>
            {t(
              "The five signal rooms below each present a real moment of cross-cultural communication. In each one, something is being communicated — but not in the words. Read the dialogue, make your choice, then see what was actually happening beneath the surface. These five dynamics appear in workplaces, partnerships, and ministry teams across the globe — different names, same patterns.",
              "Lima ruang sinyal di bawah ini masing-masing menyajikan momen nyata komunikasi lintas budaya. Dalam setiap ruang, sesuatu sedang dikomunikasikan — tetapi bukan dalam kata-kata. Baca dialognya, buat pilihanmu, lalu lihat apa yang sebenarnya terjadi di balik permukaan. Lima dinamika ini muncul di tempat kerja, kemitraan, dan tim pelayanan di seluruh dunia — nama yang berbeda, pola yang sama."
            )}
          </p>
        </div>
      </div>

      {/* 5 — Signal Rooms (NAVY) */}
      <div style={{ background: NAVY, padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow}>{t("The Five Signal Rooms", "Lima Ruang Sinyal")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.2, margin: "0 0 12px" }}>
            {t("Decode what just happened", "Baca apa yang baru saja terjadi")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "oklch(72% 0.04 260)", lineHeight: 1.75, margin: "0 0 56px", maxWidth: 600 }}>
            {t(
              "Each room shows you a real moment of cross-cultural communication. Read the dialogue, then choose what you think is happening beneath the surface.",
              "Setiap ruang menunjukkan momen nyata komunikasi lintas budaya. Baca dialog tersebut, lalu pilih apa yang menurutmu sedang terjadi di balik permukaan."
            )}
          </p>
          {SIGNAL_ROOMS.map((room, i) => (
            <SignalRoom
              key={i}
              room={room}
              roomIndex={i}
              choice={roomChoices[i]}
              onChoice={handleChoice}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* 6 — Self-Mapping Canvas (LIGHT_GRAY) */}
      <div style={{ background: LIGHT_GRAY, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Self-Mapping Canvas", "Peta Diri")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: NAVY, margin: "0 0 12px", lineHeight: 1.2 }}>
            {t("Where do you sit — and who are you working with?", "Di mana posisimu — dan dengan siapa kamu bekerja?")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: "0 0 36px" }}>
            {t(
              "Use the scale above as your reference. Work through these prompts in the order given.",
              "Gunakan skala di atas sebagai referensimu. Kerjakan pertanyaan-pertanyaan ini secara berurutan."
            )}
          </p>

          {/* Prompt cards */}
          {CANVAS_PROMPTS.map((prompt, i) => (
            <div key={i} style={{
              background: OFF_WHITE,
              borderRadius: 12,
              padding: "24px 28px",
              borderLeft: "4px solid " + ORANGE,
              marginBottom: 20,
            }}>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>
                {prompt.eyebrow[lang]}
              </p>
              <p style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(17px, 2vw, 21px)", fontStyle: "italic", color: NAVY, lineHeight: 1.6, margin: "0 0 16px" }}>
                {prompt.heading[lang]}
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                {prompt.hint[lang]}
              </p>
            </div>
          ))}

          {/* Closing reflection note */}
          <div style={{ background: "oklch(93% 0.008 80)", borderRadius: 10, padding: "20px 24px", margin: "32px 0 0", borderLeft: "3px solid " + ORANGE }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontStyle: "italic", color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
              {t(
                "This is not about placing cultures in a hierarchy. Every position on this scale is a legitimate communication style. The goal is clarity — so you can bridge the gap intentionally.",
                "Ini bukan tentang menempatkan budaya dalam hierarki. Setiap posisi dalam skala ini adalah gaya komunikasi yang sah. Tujuannya adalah kejelasan — agar kamu bisa menjembatani kesenjangan secara disengaja."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 7 — Context-Calibration Gauge (OFF_WHITE) */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Communication Spectrum", "Spektrum Komunikasi")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, margin: "0 0 16px" }}>
            {t("Where does your culture sit?", "Di mana posisi budayamu?")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: "0 0 40px", maxWidth: 600 }}>
            {t(
              "Every culture falls somewhere on this spectrum — not as a fixed point, but as a tendency. Knowing the range helps you calibrate what to expect and what to adjust.",
              "Setiap budaya berada di suatu tempat dalam spektrum ini — bukan sebagai titik tetap, tetapi sebagai kecenderungan. Mengetahui rentangnya membantumu mengkalibrasi apa yang diharapkan dan apa yang perlu disesuaikan."
            )}
          </p>
          <ContextCalibrationGauge lang={lang} />
        </div>
      </div>

      {/* 8 — Faith Anchor (NAVY) */}
      <div style={{ background: NAVY, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 12 }}>{t("Faith Anchor", "Jangkar Iman")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(28px, 3.5vw, 44px)", fontStyle: "italic", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.15, margin: "0 0 36px" }}>
            {t("God Spoke in Context", "Allah Berbicara dalam Konteks")}
          </h2>
          {FAITH_PARAS[lang].map((para, i) => (
            <p key={i} style={proseDark} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      </div>

      {/* 9 — From the Field (OFF_WHITE) */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ borderLeft: "4px solid " + ORANGE, paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }}>
            <p style={{ ...eyebrow, marginBottom: 8 }}>{t("From the Field", "Dari Lapangan")}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: BODY_TEXT, margin: "0 0 24px" }}>
              {t("Field story — composite, based on documented patterns. Name withheld.", "Kisah dari lapangan — komposit, berdasarkan pola yang terdokumentasi. Nama dirahasiakan.")}
            </p>
            {FIELD_STORY[lang].split("\n\n").map((para, i) => (
              <p key={i} style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(16px, 1.9vw, 20px)", color: BODY_TEXT, lineHeight: 1.9, marginBottom: 20 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 10 — Key Takeaways (OFF_WHITE with light gray cards) */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Key Takeaways", "Poin Utama")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, margin: "0 0 36px" }}>
            {t("Three things worth holding from this module:", "Tiga hal yang layak dibawa dari modul ini:")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {KEY_TAKEAWAYS.map((takeaway, i) => (
              <div key={i} style={{ background: LIGHT_GRAY, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                <span style={{ fontFamily: FONT_HEADLINE, fontSize: 52, fontWeight: 700, color: ORANGE, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 800, color: NAVY, marginTop: 0, marginBottom: 8 }}>
                    {takeaway[lang].title}
                  </h3>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                    {takeaway[lang].body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
