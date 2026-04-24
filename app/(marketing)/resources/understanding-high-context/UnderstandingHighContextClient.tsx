"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

type Props = { userPathway: string | null; isSaved: boolean };

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const lightGray = "oklch(95% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";

// ─── Bible Verses ─────────────────────────────────────────────────────────────
const VERSES: Record<string, { en_ref: string; id_ref: string; nl_ref: string; en: string; id: string; nl: string }> = {
  "john-16-12": {
    en_ref: "John 16:12",
    id_ref: "Yohanes 16:12",
    nl_ref: "Johannes 16:12",
    en: "I have much more to say to you, more than you can now bear.",
    id: "Masih banyak hal yang harus Kukatakan kepadamu, tetapi sekarang kamu belum dapat menanggungnya.",
    nl: "Nog veel meer heb ik jullie te zeggen, maar jullie kunnen het nu nog niet verdragen.",
  },
  "1cor-9-22": {
    en_ref: "1 Corinthians 9:22",
    id_ref: "1 Korintus 9:22",
    nl_ref: "1 Korintiërs 9:22",
    en: "I have become all things to all people so that by all possible means I might save some.",
    id: "Bagi semua orang aku telah menjadi segalanya, supaya aku sedapat mungkin memenangkan beberapa orang dari antara mereka.",
    nl: "Voor iedereen ben ik alles geworden om door alle mogelijke middelen enigen te redden.",
  },
};

// ─── Spectrum bar regions ─────────────────────────────────────────────────────
// Each dimension has a spectrumRegions array placing world regions on a 0–100 scale
// 0 = low-context pole, 100 = high-context pole

// ─── 5 Communication Dimensions ──────────────────────────────────────────────
const DIMENSIONS = [
  {
    id: "direct-indirect",
    en_pole_low: "Direct",
    id_pole_low: "Langsung",
    nl_pole_low: "Direct",
    en_pole_high: "Indirect",
    id_pole_high: "Tidak Langsung",
    nl_pole_high: "Indirect",
    en_title: "Direct vs. Indirect Communication",
    id_title: "Komunikasi Langsung vs. Tidak Langsung",
    nl_title: "Directe vs. Indirecte Communicatie",
    en_subtitle: "What you hear is not always what was said",
    id_subtitle: "Apa yang Anda dengar tidak selalu yang diucapkan",
    nl_subtitle: "Wat je hoort is niet altijd wat er gezegd werd",
    spectrum: [
      { en_label: "Netherlands", id_label: "Belanda", nl_label: "Nederland", position: 8 },
      { en_label: "Germany", id_label: "Jerman", nl_label: "Duitsland", position: 14 },
      { en_label: "USA", id_label: "Amerika Serikat", nl_label: "VS", position: 22 },
      { en_label: "Brazil", id_label: "Brasil", nl_label: "Brazilië", position: 48 },
      { en_label: "Nigeria", id_label: "Nigeria", nl_label: "Nigeria", position: 58 },
      { en_label: "Japan", id_label: "Jepang", nl_label: "Japan", position: 78 },
      { en_label: "Indonesia", id_label: "Indonesia", nl_label: "Indonesië", position: 82 },
      { en_label: "China", id_label: "Tiongkok", nl_label: "China", position: 88 },
    ],
    en_scenario_low_label: "Dutch project manager (direct)",
    id_scenario_low_label: "Manajer proyek Belanda (langsung)",
    nl_scenario_low_label: "Nederlandse projectmanager (direct)",
    en_scenario_low: "After reviewing the report, Erik tells his Indonesian colleague directly: \"The analysis in section 3 is incomplete. It doesn't address the budget risk. I need a revised version by Friday.\" He moves on immediately. To him, clarity is respect.",
    id_scenario_low: "Setelah meninjau laporan, Erik langsung memberi tahu rekan Indonesia-nya: \"Analisis di bagian 3 tidak lengkap. Tidak membahas risiko anggaran. Saya butuh versi yang direvisi pada hari Jumat.\" Baginya, kejelasan adalah bentuk rasa hormat.",
    nl_scenario_low: "Na het rapport te hebben doorgenomen zegt Erik rechtstreeks tegen zijn Indonesische collega: \"De analyse in sectie 3 is onvolledig. Het gaat niet in op het budgetrisico. Ik heb voor vrijdag een herziene versie nodig.\" Hij gaat direct door. Voor hem is duidelijkheid respect.",
    en_scenario_high_label: "Indonesian team leader (indirect)",
    id_scenario_high_label: "Pemimpin tim Indonesia (tidak langsung)",
    nl_scenario_high_label: "Indonesische teamleider (indirect)",
    en_scenario_high: "Budi, reviewing the same report, says warmly: \"This is a good effort. I wonder if we could also look at the financial side — I think there may be something worth exploring before the deadline.\" He pauses. He waits. The message is there — for those who know how to listen.",
    id_scenario_high: "Budi, yang meninjau laporan yang sama, berkata dengan hangat: \"Ini adalah upaya yang bagus. Saya bertanya-tanya apakah kita juga bisa melihat sisi keuangannya — saya pikir mungkin ada sesuatu yang layak dijelajahi sebelum tenggat waktu.\" Dia berhenti. Dia menunggu. Pesannya ada di sana.",
    nl_scenario_high: "Budi bekijkt hetzelfde rapport en zegt vriendelijk: \"Dit is een goede poging. Ik vraag me af of we ook naar de financiële kant kunnen kijken — ik denk dat er iets de moeite waard kan zijn om te verkennen vóór de deadline.\" Hij pauzeert. Hij wacht. De boodschap is er — voor wie weet te luisteren.",
    en_practice: "When working with indirect communicators: slow down, ask clarifying questions, leave silence after feedback. The real response may come hours later, privately. Do not mistake quietness for agreement.",
    id_practice: "Saat bekerja dengan komunikator tidak langsung: perlambat, ajukan pertanyaan klarifikasi, biarkan keheningan setelah umpan balik. Respons nyata mungkin datang berjam-jam kemudian, secara pribadi. Jangan salah mengartikan kesunyian sebagai persetujuan.",
    nl_practice: "Als je met indirecte communicatoren werkt: vertraag, stel verhelderende vragen, laat stilte na feedback. De echte reactie kan uren later komen, privé. Verwis rust niet met instemming.",
    en_bridge: "Ask instead of tell. Replace \"The report needs revision\" with \"What do you think would strengthen section 3?\" You get the same outcome without the cultural collision.",
    id_bridge: "Tanya daripada beritahu. Ganti \"Laporan perlu direvisi\" dengan \"Menurut Anda, apa yang akan memperkuat bagian 3?\" Anda mendapatkan hasil yang sama tanpa benturan budaya.",
    nl_bridge: "Vraag in plaats van zeg. Vervang \"Het rapport moet worden herzien\" door \"Wat denk je dat sectie 3 zou versterken?\" Je krijgt hetzelfde resultaat zonder culturele botsing.",
  },
  {
    id: "explicit-implicit",
    en_pole_low: "Explicit",
    id_pole_low: "Eksplisit",
    nl_pole_low: "Expliciet",
    en_pole_high: "Implicit",
    id_pole_high: "Implisit",
    nl_pole_high: "Impliciet",
    en_title: "Explicit vs. Implicit Meaning",
    id_title: "Makna Eksplisit vs. Implisit",
    nl_title: "Expliciete vs. Impliciete Betekenis",
    en_subtitle: "Where does the meaning actually live?",
    id_subtitle: "Di mana makna sebenarnya berada?",
    nl_subtitle: "Waar leeft de betekenis eigenlijk?",
    spectrum: [
      { en_label: "Australia", id_label: "Australia", nl_label: "Australië", position: 12 },
      { en_label: "Canada", id_label: "Kanada", nl_label: "Canada", position: 18 },
      { en_label: "France", id_label: "Prancis", nl_label: "Frankrijk", position: 35 },
      { en_label: "India", id_label: "India", nl_label: "India", position: 55 },
      { en_label: "South Korea", id_label: "Korea Selatan", nl_label: "Zuid-Korea", position: 72 },
      { en_label: "Arab world", id_label: "Dunia Arab", nl_label: "Arabische wereld", position: 80 },
      { en_label: "Thailand", id_label: "Thailand", nl_label: "Thailand", position: 84 },
    ],
    en_scenario_low_label: "Contract meeting (explicit context)",
    id_scenario_low_label: "Rapat kontrak (konteks eksplisit)",
    nl_scenario_low_label: "Contractvergadering (expliciete context)",
    en_scenario_low: "At the negotiation table, Sarah lays it out clearly: \"We agree on scope, timeline, and deliverables. Everything we commit to will be in the written contract. If it's not in writing, we can't guarantee it.\" This gives her team certainty. She writes it all down.",
    id_scenario_low: "Di meja negosiasi, Sarah menguraikannya dengan jelas: \"Kami sepakat mengenai ruang lingkup, jadwal, dan hasil kerja. Semua yang kami komitmenkan akan ada dalam kontrak tertulis. Jika tidak tertulis, kami tidak bisa menjaminnya.\" Ini memberi timnya kepastian.",
    nl_scenario_low: "Aan de onderhandelingstafel legt Sarah het duidelijk uit: \"We zijn het eens over de scope, het tijdpad en de deliverables. Alles wat we toezeggen staat in het schriftelijke contract. Als het er niet in staat, kunnen we het niet garanderen.\" Ze schrijft alles op.",
    en_scenario_high_label: "Partnership discussion (implicit context)",
    id_scenario_high_label: "Diskusi kemitraan (konteks implisit)",
    nl_scenario_high_label: "Partnerschapsgesprek (impliciete context)",
    en_scenario_high: "Amir nods throughout the meeting. He says \"we will see\" and \"this is possible.\" He mentions his uncle works in the sector. He pours more tea. To his business partners, the meaning is clear: the relationship is warm, the door is open, nothing is refused. The details will be worked out through trust over time.",
    id_scenario_high: "Amir mengangguk sepanjang pertemuan. Dia berkata \"kita lihat saja\" dan \"ini mungkin bisa.\" Dia menyebutkan pamannya bekerja di sektor itu. Dia menuangkan teh lagi. Bagi mitra bisnisnya, maknanya jelas: hubungan hangat, pintu terbuka, tidak ada yang ditolak.",
    nl_scenario_high: "Amir knikt door de vergadering heen. Hij zegt \"we zullen zien\" en \"dit is mogelijk.\" Hij noemt dat zijn oom in de sector werkt. Hij schenkt meer thee in. Voor zijn zakenpartners is de betekenis duidelijk: de relatie is warm, de deur staat open, niets wordt geweigerd.",
    en_practice: "In high-context settings, pay attention to what surrounds the words: who is in the room, the order of speaking, the use of stories and analogies. These carry meaning the words alone do not.",
    id_practice: "Dalam konteks tinggi, perhatikan apa yang mengelilingi kata-kata: siapa yang ada di ruangan, urutan berbicara, penggunaan cerita dan analogi. Semua ini membawa makna yang tidak dapat dibawa oleh kata-kata saja.",
    nl_practice: "Let in hoge-context omgevingen op wat de woorden omringt: wie er in de kamer is, de spreekvolgorde, het gebruik van verhalen en analogieën. Deze dragen betekenis die de woorden alleen niet dragen.",
    en_bridge: "When you sense implicit meaning, reflect it back: \"It sounds like there may be some hesitation — am I reading that right?\" This lets the person confirm or redirect without losing face.",
    id_bridge: "Ketika Anda merasakan makna implisit, cerminkan kembali: \"Kedengarannya ada keengganan — apakah saya membaca itu dengan benar?\" Ini memungkinkan orang tersebut mengkonfirmasi atau mengarahkan ulang tanpa kehilangan muka.",
    nl_bridge: "Als je impliciete betekenis aanvoelt, spiegeel het terug: \"Het klinkt alsof er enige terughoudendheid is — lees ik dat goed?\" Dit laat de persoon bevestigen of bijsturen zonder gezichtsverlies.",
  },
  {
    id: "task-relationship",
    en_pole_low: "Task-First",
    id_pole_low: "Tugas Dahulu",
    nl_pole_low: "Taak Eerst",
    en_pole_high: "Relationship-First",
    id_pole_high: "Hubungan Dahulu",
    nl_pole_high: "Relatie Eerst",
    en_title: "Task-First vs. Relationship-First",
    id_title: "Tugas Dahulu vs. Hubungan Dahulu",
    nl_title: "Taak Eerst vs. Relatie Eerst",
    en_subtitle: "Can we skip the small talk and get to business?",
    id_subtitle: "Bisakah kita lewati basa-basi dan langsung ke urusan?",
    nl_subtitle: "Kunnen we de smalltalk overslaan en ter zake komen?",
    spectrum: [
      { en_label: "Sweden", id_label: "Swedia", nl_label: "Zweden", position: 10 },
      { en_label: "USA", id_label: "Amerika Serikat", nl_label: "VS", position: 24 },
      { en_label: "UK", id_label: "Inggris", nl_label: "VK", position: 30 },
      { en_label: "Mexico", id_label: "Meksiko", nl_label: "Mexico", position: 60 },
      { en_label: "Saudi Arabia", id_label: "Arab Saudi", nl_label: "Saudi-Arabië", position: 72 },
      { en_label: "Indonesia", id_label: "Indonesia", nl_label: "Indonesië", position: 80 },
      { en_label: "China", id_label: "Tiongkok", nl_label: "China", position: 86 },
    ],
    en_scenario_low_label: "First team meeting (task-first)",
    id_scenario_low_label: "Rapat tim pertama (tugas dahulu)",
    nl_scenario_low_label: "Eerste teamvergadering (taak eerst)",
    en_scenario_low: "Mark opens the meeting at 9:00 sharp: \"Good morning everyone. Our goal today is to finalise the project timeline. Let's start with deliverables.\" He has an agenda. He expects to close the meeting in 45 minutes with clear decisions. Efficiency is his form of respect.",
    id_scenario_low: "Mark membuka rapat tepat jam 9: \"Selamat pagi semua. Tujuan kita hari ini adalah menyelesaikan jadwal proyek. Mari mulai dengan hasil kerja.\" Dia memiliki agenda. Dia berharap menutup rapat dalam 45 menit dengan keputusan yang jelas. Efisiensi adalah bentuk rasa hormatnya.",
    nl_scenario_low: "Mark opent de vergadering stipt om 9 uur: \"Goedemorgen allemaal. Ons doel vandaag is de projecttijdlijn af te ronden. Laten we beginnen met de deliverables.\" Hij heeft een agenda. Hij verwacht de vergadering binnen 45 minuten af te sluiten met duidelijke besluiten.",
    en_scenario_high_label: "First business meeting (relationship-first)",
    id_scenario_high_label: "Rapat bisnis pertama (hubungan dahulu)",
    nl_scenario_high_label: "Eerste zakelijke vergadering (relatie eerst)",
    en_scenario_high: "Pak Hendra opens the same meeting: \"Please, sit — have you had breakfast? How was your journey?\" Forty minutes pass. They talk about family, about the city, about a mutual friend. Then, gently, he says: \"Now — shall we talk about working together?\" The relationship IS the work. Without it, nothing signed will hold.",
    id_scenario_high: "Pak Hendra membuka rapat yang sama: \"Silakan duduk — sudah sarapan? Bagaimana perjalanannya?\" Empat puluh menit berlalu. Mereka berbicara tentang keluarga, kota, dan seorang teman bersama. Kemudian, dengan lembut, dia berkata: \"Nah — apakah kita bisa bicara tentang kerja sama?\" Hubungan ADALAH pekerjaan itu sendiri.",
    nl_scenario_high: "Pak Hendra opent dezelfde vergadering: \"Kom zitten — heb je al ontbeten? Hoe was de reis?\" Veertig minuten gaan voorbij. Ze praten over familie, de stad, een gemeenschappelijke vriend. Dan zegt hij rustig: \"Nu — zullen we over samenwerken praten?\" De relatie IS het werk. Zonder haar houdt niets dat getekend wordt stand.",
    en_practice: "In relationship-first cultures, the time spent on connection is not wasted time — it is the investment that makes the task possible. Budget for it. A 20-minute coffee conversation can determine whether a contract succeeds.",
    id_practice: "Dalam budaya hubungan dahulu, waktu yang dihabiskan untuk koneksi bukan waktu yang terbuang — itu adalah investasi yang membuat tugas menjadi mungkin. Anggarkan waktu untuk itu. Percakapan kopi 20 menit dapat menentukan apakah kontrak berhasil.",
    nl_practice: "In relatie-eerste culturen is tijd besteed aan verbinding geen verspilde tijd — het is de investering die de taak mogelijk maakt. Plan ervoor. Een gesprekje van 20 minuten bij de koffie kan bepalen of een contract slaagt.",
    en_bridge: "Start every cross-cultural meeting with genuine personal interest — not a scripted opener, but a real question. \"How has the week been for you?\" costs 90 seconds and opens a relationship account.",
    id_bridge: "Mulailah setiap rapat lintas budaya dengan ketertarikan pribadi yang tulus — bukan pembuka yang sudah direncanakan, tetapi pertanyaan nyata. \"Bagaimana minggu ini bagi Anda?\" hanya membutuhkan 90 detik dan membuka rekening hubungan.",
    nl_bridge: "Begin elke interculturele vergadering met oprechte persoonlijke interesse — geen script, maar een echte vraag. \"Hoe was de week voor jou?\" kost 90 seconden en opent een relatierekening.",
  },
  {
    id: "face-saving",
    en_pole_low: "Individual",
    id_pole_low: "Individual",
    nl_pole_low: "Individueel",
    en_pole_high: "Collective",
    id_pole_high: "Kolektif",
    nl_pole_high: "Collectief",
    en_title: "Individual vs. Collective Face-Saving",
    id_title: "Menjaga Muka: Individual vs. Kolektif",
    nl_title: "Individueel vs. Collectief Gezichtsbehoud",
    en_subtitle: "Whose honour is at stake — and who carries the shame?",
    id_subtitle: "Kehormatan siapa yang dipertaruhkan — dan siapa yang menanggung rasa malu?",
    nl_subtitle: "Wiens eer staat op het spel — en wie draagt de schaamte?",
    spectrum: [
      { en_label: "Netherlands", id_label: "Belanda", nl_label: "Nederland", position: 7 },
      { en_label: "Australia", id_label: "Australia", nl_label: "Australië", position: 15 },
      { en_label: "UK", id_label: "Inggris", nl_label: "VK", position: 20 },
      { en_label: "Brazil", id_label: "Brasil", nl_label: "Brazilië", position: 42 },
      { en_label: "Philippines", id_label: "Filipina", nl_label: "Filipijnen", position: 70 },
      { en_label: "Indonesia", id_label: "Indonesia", nl_label: "Indonesië", position: 78 },
      { en_label: "Japan", id_label: "Jepang", nl_label: "Japan", position: 85 },
      { en_label: "China", id_label: "Tiongkok", nl_label: "China", position: 88 },
    ],
    en_scenario_low_label: "Performance correction (low-context)",
    id_scenario_low_label: "Koreksi kinerja (konteks rendah)",
    nl_scenario_low_label: "Prestatiecorrectie (laagcontext)",
    en_scenario_low: "In a team meeting, the manager says: \"James, I noticed the client report had some errors last week. Can you walk us through what happened?\" Direct, in the room. James explains. The team learns. To the manager, this is transparency and accountability — no blame, just correction.",
    id_scenario_low: "Dalam rapat tim, manajer berkata: \"James, saya perhatikan laporan klien ada beberapa kesalahan minggu lalu. Bisakah Anda jelaskan apa yang terjadi?\" Langsung, di depan semua orang. James menjelaskan. Tim belajar. Bagi manajer, ini adalah transparansi dan akuntabilitas — tidak ada tuduhan, hanya koreksi.",
    nl_scenario_low: "In een teamvergadering zegt de manager: \"James, ik merkte dat het klantrapport vorige week enkele fouten bevatte. Kun je ons meenemen in wat er is gebeurd?\" Direct, in de kamer. James legt het uit. Het team leert. Voor de manager is dit transparantie en verantwoording.",
    en_scenario_high_label: "Performance correction (high-context)",
    id_scenario_high_label: "Koreksi kinerja (konteks tinggi)",
    nl_scenario_high_label: "Prestatiecorrectie (hoogcontext)",
    en_scenario_high: "After the team meeting, the manager asks Siti to stay behind. With the door closed, he says gently: \"I know you've been under a lot of pressure. I want to make sure the next report reflects your best work — can we look at it together?\" The correction happens. But Siti's face is protected. She can correct without shame.",
    id_scenario_high: "Setelah rapat tim, manajer meminta Siti untuk tinggal. Dengan pintu tertutup, dia berkata dengan lembut: \"Saya tahu kamu sedang dalam banyak tekanan. Saya ingin memastikan laporan berikutnya mencerminkan karya terbaikmu — bisakah kita lihat bersama?\" Koreksi terjadi. Tetapi muka Siti terlindungi.",
    nl_scenario_high: "Na de teamvergadering vraagt de manager Siti te blijven. Met de deur dicht zegt hij zacht: \"Ik weet dat je onder veel druk staat. Ik wil ervoor zorgen dat het volgende rapport je beste werk weerspiegelt — kunnen we het samen bekijken?\" De correctie gebeurt. Maar Siti's gezicht is beschermd.",
    en_practice: "Never correct publicly in collective face-saving cultures. Not because it avoids accountability — but because public correction destroys the relationship that makes accountability sustainable. Private correction is not weakness; it is wisdom.",
    id_practice: "Jangan pernah mengoreksi secara publik dalam budaya penjagaan muka kolektif. Bukan karena menghindari akuntabilitas — tetapi karena koreksi publik menghancurkan hubungan yang membuat akuntabilitas berkelanjutan. Koreksi pribadi bukan kelemahan; itu kebijaksanaan.",
    nl_practice: "Corrigeer nooit publiekelijk in collectieve gezichtsbesparende culturen. Niet om verantwoording te vermijden — maar omdat publieke correctie de relatie vernietigt die verantwoording duurzaam maakt. Private correctie is geen zwakte; het is wijsheid.",
    en_bridge: "Before giving feedback, ask yourself: \"Will this protect or expose the person?\" Choose private settings. Frame correction as investment, not accusation. The goal is the relationship AND the standard — not one at the expense of the other.",
    id_bridge: "Sebelum memberikan umpan balik, tanyakan pada diri sendiri: \"Apakah ini akan melindungi atau mengekspos orang tersebut?\" Pilih pengaturan pribadi. Bingkai koreksi sebagai investasi, bukan tuduhan. Tujuannya adalah hubungan DAN standar — bukan salah satunya dengan mengorbankan yang lain.",
    nl_bridge: "Vraag jezelf voor feedback geven af: \"Beschermt of blootstelt dit de persoon?\" Kies privéomgevingen. Formuleer correctie als investering, niet als beschuldiging. Het doel is de relatie EN de standaard — niet één ten koste van de ander.",
  },
  {
    id: "time",
    en_pole_low: "Time as Commodity",
    id_pole_low: "Waktu sebagai Komoditas",
    nl_pole_low: "Tijd als Grondstof",
    en_pole_high: "Time as Relationship",
    id_pole_high: "Waktu sebagai Hubungan",
    nl_pole_high: "Tijd als Relatie",
    en_title: "Time as Commodity vs. Time as Relationship",
    id_title: "Waktu sebagai Komoditas vs. Waktu sebagai Hubungan",
    nl_title: "Tijd als Grondstof vs. Tijd als Relatie",
    en_subtitle: "Is time something you spend — or something you share?",
    id_subtitle: "Apakah waktu sesuatu yang Anda habiskan — atau sesuatu yang Anda bagikan?",
    nl_subtitle: "Is tijd iets wat je besteedt — of iets wat je deelt?",
    spectrum: [
      { en_label: "Switzerland", id_label: "Swiss", nl_label: "Zwitserland", position: 5 },
      { en_label: "Germany", id_label: "Jerman", nl_label: "Duitsland", position: 10 },
      { en_label: "Netherlands", id_label: "Belanda", nl_label: "Nederland", position: 12 },
      { en_label: "USA", id_label: "Amerika Serikat", nl_label: "VS", position: 20 },
      { en_label: "Spain", id_label: "Spanyol", nl_label: "Spanje", position: 55 },
      { en_label: "Kenya", id_label: "Kenya", nl_label: "Kenia", position: 68 },
      { en_label: "Arab world", id_label: "Dunia Arab", nl_label: "Arabische wereld", position: 76 },
      { en_label: "Indonesia", id_label: "Indonesia", nl_label: "Indonesië", position: 82 },
    ],
    en_scenario_low_label: "The 9:00 meeting (monochronic view)",
    id_scenario_low_label: "Rapat jam 9 (pandangan monokronik)",
    nl_scenario_low_label: "De 9:00-vergadering (monochronisch)",
    en_scenario_low: "Lisa arrives at 8:58. She has a prepared agenda, a timer for each item, and an expectation that the meeting ends at 10:00. When it runs over, she grows visibly uncomfortable. She follows up with action items within the hour. Time is finite and precise — wasting it is a form of disrespect.",
    id_scenario_low: "Lisa tiba pukul 8:58. Dia memiliki agenda yang disiapkan, timer untuk setiap item, dan harapan bahwa rapat berakhir pukul 10:00. Ketika melebihi waktu, dia tampak tidak nyaman. Dia menindaklanjuti dengan item tindakan dalam satu jam. Waktu terbatas dan tepat — membuangnya adalah bentuk tidak hormat.",
    nl_scenario_low: "Lisa arriveert om 8:58. Ze heeft een voorbereide agenda, een timer voor elk punt en de verwachting dat de vergadering om 10:00 eindigt. Als het uitloopt, wordt ze zichtbaar ongemakkelijk. Ze stuurt binnen een uur actiepunten op. Tijd is eindig en precies — verspilling is een vorm van onrespect.",
    en_scenario_high_label: "The 9:00 meeting (polychronic view)",
    id_scenario_high_label: "Rapat jam 9 (pandangan polykronik)",
    nl_scenario_high_label: "De 9:00-vergadering (polychronisch)",
    en_scenario_high: "Rizal arrives at 9:20. Before discussing any agenda item, he asks about a colleague's sick parent. Someone else joins late with food — he welcomes them. The meeting takes three hours. But every relationship in the room is stronger. Tomorrow's collaboration will be easier. Time given to people IS the work.",
    id_scenario_high: "Rizal tiba pukul 9:20. Sebelum membahas agenda apapun, dia menanyakan tentang orang tua sakit seorang rekan. Seseorang bergabung terlambat dengan makanan — dia menyambut mereka. Rapat berlangsung tiga jam. Tetapi setiap hubungan di ruangan lebih kuat. Kolaborasi hari esok akan lebih mudah. Waktu yang diberikan kepada orang ADALAH pekerjaan itu sendiri.",
    nl_scenario_high: "Rizal arriveert om 9:20. Voor hij een agendapunt bespreekt, vraagt hij naar de zieke ouder van een collega. Iemand komt laat binnen met eten — hij verwelkomt ze. De vergadering duurt drie uur. Maar elke relatie in de kamer is sterker. De samenwerking van morgen zal makkelijker zijn. Tijd gegeven aan mensen IS het werk.",
    en_practice: "If you are monochronic working with polychronic colleagues: build buffer into your schedule for relationship time — it is not inefficiency, it is the price of trust. If you are polychronic working with monochronic leaders: give advance notice of delays and honour commitments to time where they matter most.",
    id_practice: "Jika Anda monokronik yang bekerja dengan rekan polykronik: bangun penyangga dalam jadwal Anda untuk waktu hubungan — itu bukan ketidakefisienan, itu harga kepercayaan. Jika Anda polykronik yang bekerja dengan pemimpin monokronik: berikan pemberitahuan awal tentang keterlambatan.",
    nl_practice: "Als je monochronisch werkt met polychronische collega's: bouw buffer in je schema voor relatietijd — dat is geen inefficiëntie, dat is de prijs van vertrouwen. Als je polychronisch werkt met monochronische leiders: geef vooraf aan wanneer het uitloopt.",
    en_bridge: "Reframe: time invested in people early saves time lost to misunderstanding, conflict, and rebuilding trust later. The polychronic meeting that runs long is sometimes the most efficient long-term investment.",
    id_bridge: "Ubah kerangka pikir: waktu yang diinvestasikan untuk orang-orang di awal menghemat waktu yang hilang akibat kesalahpahaman, konflik, dan membangun kembali kepercayaan di kemudian hari. Rapat polykronik yang berlangsung lama terkadang merupakan investasi jangka panjang yang paling efisien.",
    nl_bridge: "Herformuleer: tijd vroeg geïnvesteerd in mensen bespaart tijd die later verloren gaat aan misverstanden, conflicten en vertrouwensherstel. De polychronische vergadering die uitloopt is soms de efficiëntste langetermijninvestering.",
  },
];

// ─── Personal Assessment Questions ────────────────────────────────────────────
const ASSESSMENT_QUESTIONS = [
  {
    en_q: "When someone is slow to give a direct answer, my instinctive reaction is:",
    id_q: "Ketika seseorang lambat memberikan jawaban langsung, reaksi instinktif saya adalah:",
    nl_q: "Wanneer iemand langzaam een direct antwoord geeft, is mijn instinctieve reactie:",
    options: [
      {
        en: "Frustration — just say what you mean",
        id: "Frustrasi — katakan saja apa yang Anda maksud",
        nl: "Frustratie — zeg gewoon wat je bedoelt",
        style: "low",
      },
      {
        en: "Curiosity — I try to read between the lines",
        id: "Rasa ingin tahu — saya mencoba membaca antara baris",
        nl: "Nieuwsgierigheid — ik probeer tussen de regels te lezen",
        style: "high",
      },
    ],
  },
  {
    en_q: "Before a business meeting, I typically:",
    id_q: "Sebelum rapat bisnis, saya biasanya:",
    nl_q: "Voor een zakelijke vergadering:",
    options: [
      {
        en: "Prepare a tight agenda and expect to stick to it",
        id: "Mempersiapkan agenda yang ketat dan berharap untuk mengikutinya",
        nl: "Bereid ik een strak agenda voor en verwacht ik me eraan te houden",
        style: "low",
      },
      {
        en: "Plan some relationship time before getting to business",
        id: "Merencanakan waktu untuk membangun hubungan sebelum membahas urusan",
        nl: "Plan ik wat relatietijd voordat ik ter zake kom",
        style: "high",
      },
    ],
  },
  {
    en_q: "When I need to correct someone's work, I prefer to:",
    id_q: "Ketika saya perlu mengoreksi pekerjaan seseorang, saya lebih suka:",
    nl_q: "Wanneer ik iemands werk moet corrigeren, geef ik er de voorkeur aan:",
    options: [
      {
        en: "Address it clearly in the team meeting — transparency matters",
        id: "Membahasnya dengan jelas dalam rapat tim — transparansi penting",
        nl: "Het duidelijk in de teamvergadering aan te pakken — transparantie telt",
        style: "low",
      },
      {
        en: "Pull the person aside privately — protecting their dignity matters more",
        id: "Mengajak orang itu berbicara secara pribadi — melindungi martabat mereka lebih penting",
        nl: "De persoon privé apart te nemen — hun waardigheid beschermen weegt zwaarder",
        style: "high",
      },
    ],
  },
  {
    en_q: "When a meeting runs 30 minutes over schedule, I feel:",
    id_q: "Ketika rapat berlangsung 30 menit lebih dari jadwal, saya merasa:",
    nl_q: "Wanneer een vergadering 30 minuten uitloopt, voel ik me:",
    options: [
      {
        en: "Anxious — this disrupts the rest of my day",
        id: "Cemas — ini mengganggu sisa hari saya",
        nl: "Ongerust — dit verstoort de rest van mijn dag",
        style: "low",
      },
      {
        en: "Fine — the conversation was clearly worth it",
        id: "Tidak masalah — percakapannya jelas layak untuk itu",
        nl: "Oké — het gesprek was duidelijk de moeite waard",
        style: "high",
      },
    ],
  },
  {
    en_q: "When I write a proposal or agreement, I tend to:",
    id_q: "Ketika saya menulis proposal atau perjanjian, saya cenderung:",
    nl_q: "Wanneer ik een voorstel of overeenkomst schrijf, neiging ik ertoe:",
    options: [
      {
        en: "Spell out every detail — ambiguity creates problems",
        id: "Menjelaskan setiap detail — ambiguitas menciptakan masalah",
        nl: "Elk detail uit te schrijven — ambiguïteit creëert problemen",
        style: "low",
      },
      {
        en: "Keep it broad — trust fills in the gaps",
        id: "Membuatnya luas — kepercayaan mengisi kekosongan",
        nl: "Het ruim te houden — vertrouwen vult de leemten",
        style: "high",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function UnderstandingHighContextClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [activeDimension, setActiveDimension] = useState<number>(0);
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [showAssessmentResult, setShowAssessmentResult] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("understanding-high-context");
      setSaved(true);
    });
  }

  function handleAnswer(qIndex: number, style: string) {
    setAssessmentAnswers(prev => ({ ...prev, [qIndex]: style }));
  }

  function computeResult() {
    const highCount = Object.values(assessmentAnswers).filter(v => v === "high").length;
    return highCount;
  }

  const dim = DIMENSIONS[activeDimension];

  // ─── Spectrum bar dot positions ──────────────────────────────────────────
  function SpectrumBar({ items }: { items: { en_label: string; id_label: string; nl_label: string; position: number }[] }) {
    return (
      <div style={{ position: "relative", margin: "28px 0 48px" }}>
        {/* Track */}
        <div style={{
          height: 6,
          borderRadius: 3,
          background: `linear-gradient(to right, oklch(45% 0.10 240), ${orange})`,
          position: "relative",
        }} />
        {/* Dots */}
        {items.map((item, i) => {
          const label = lang === "en" ? item.en_label : lang === "id" ? item.id_label : item.nl_label;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${item.position}%`,
                top: -5,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: offWhite,
                border: `2.5px solid ${orange}`,
                boxShadow: "0 1px 4px oklch(0% 0 0 / 0.15)",
              }} />
              <span style={{
                marginTop: 6,
                fontSize: 11,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: bodyText,
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}>{label}</span>
            </div>
          );
        })}
        {/* Pole labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
          <span style={{ fontSize: 11, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "oklch(45% 0.10 240)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {lang === "en" ? dim.en_pole_low : lang === "id" ? dim.id_pole_low : dim.nl_pole_low}
          </span>
          <span style={{ fontSize: 11, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: orange, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {lang === "en" ? dim.en_pole_high : lang === "id" ? dim.id_pole_high : dim.nl_pole_high}
          </span>
        </div>
      </div>
    );
  }

  const highCount = computeResult();
  const answeredAll = Object.keys(assessmentAnswers).length === ASSESSMENT_QUESTIONS.length;

  return (
    <div style={{ background: offWhite, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: bodyText }}>

      {/* ── Language Toggle ─────────────────────────────────────────────── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: offWhite,
        borderBottom: `1px solid oklch(88% 0.008 80)`,
        padding: "10px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}>
        <Link href="/resources" style={{ fontSize: 13, color: bodyText, textDecoration: "none", fontWeight: 600, opacity: 0.7, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          {t("Resources", "Sumber Daya", "Bronnen")}
        </Link>
        <div style={{ display: "flex", gap: 4 }}>
          {(["en", "id", "nl"] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.06em",
                background: lang === l ? navy : "transparent",
                color: lang === l ? offWhite : bodyText,
                transition: "all 0.15s",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saved || isPending}
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: `1.5px solid ${saved ? "oklch(60% 0.12 150)" : navy}`,
            background: saved ? "oklch(60% 0.12 150 / 0.1)" : "transparent",
            color: saved ? "oklch(40% 0.12 150)" : navy,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 12,
            cursor: saved ? "default" : "pointer",
            letterSpacing: "0.04em",
            transition: "all 0.2s",
          }}
        >
          {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save", "Simpan", "Opslaan in Dashboard")}
        </button>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div style={{
        background: navy,
        padding: "80px 24px 64px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          background: `${orange}22`,
          border: `1px solid ${orange}55`,
          borderRadius: 20,
          padding: "5px 16px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: orange,
          marginBottom: 24,
        }}>
          {t("Cross-Cultural Leadership", "Kepemimpinan Lintas Budaya", "Intercultureel Leiderschap")}
        </div>
        <h1 style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 700,
          color: offWhite,
          lineHeight: 1.15,
          margin: "0 auto 20px",
          maxWidth: 760,
        }}>
          {t(
            "Understanding High-Context Cultures",
            "Memahami Budaya Konteks Tinggi",
            "Hoge-Context Culturen Begrijpen"
          )}
        </h1>
        <p style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(18px, 3vw, 24px)",
          color: "oklch(85% 0.02 80)",
          maxWidth: 600,
          margin: "0 auto 40px",
          lineHeight: 1.6,
          fontStyle: "italic",
        }}>
          {t(
            "How communication styles shape relationships — and what that means for cross-cultural teams.",
            "Bagaimana gaya komunikasi membentuk hubungan — dan apa artinya bagi tim lintas budaya.",
            "Hoe communicatiestijlen relaties vormen — en wat dat betekent voor interculturele teams."
          )}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: t("9 min read", "9 menit baca", "9 min lezen"), icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
            { label: t("5 dimensions", "5 dimensi", "5 dimensies"), icon: "M4 6h16M4 12h16M4 18h16" },
            { label: t("3 languages", "3 bahasa", "3 talen"), icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "oklch(75% 0.02 80)", fontSize: 13, fontWeight: 600 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={m.icon} />
              </svg>
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Intro Context Block ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 40px" }}>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: bodyText, marginBottom: 20 }}>
          {t(
            "In 1976, anthropologist Edward T. Hall introduced a concept that would reframe how we understand human communication: the distinction between high-context and low-context cultures. It is one of the most practically useful frameworks for any leader who works across cultural boundaries.",
            "Pada tahun 1976, antropolog Edward T. Hall memperkenalkan konsep yang akan mengubah cara kita memahami komunikasi manusia: perbedaan antara budaya konteks tinggi dan konteks rendah. Ini adalah salah satu kerangka kerja yang paling praktis berguna bagi setiap pemimpin yang bekerja lintas batas budaya.",
            "In 1976 introduceerde antropoloog Edward T. Hall een concept dat onze kijk op menselijke communicatie zou hervormen: het onderscheid tussen hoge-context en lage-context culturen. Het is een van de meest praktisch bruikbare kaders voor elke leider die over culturele grenzen heen werkt."
          )}
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: bodyText, marginBottom: 20 }}>
          {t(
            "The core insight: in high-context cultures, most of the meaning in communication is implicit — carried by relationship, tone, setting, silence, and shared history. In low-context cultures, meaning is explicit — carried in words, stated clearly, and documented in writing.",
            "Wawasan utama: dalam budaya konteks tinggi, sebagian besar makna dalam komunikasi bersifat implisit — dibawa oleh hubungan, nada, konteks, keheningan, dan sejarah bersama. Dalam budaya konteks rendah, makna bersifat eksplisit — dibawa dalam kata-kata, dinyatakan dengan jelas, dan didokumentasikan secara tertulis.",
            "De kerngedachte: in hoge-context culturen is het grootste deel van de betekenis in communicatie impliciet — gedragen door relatie, toon, omgeving, stilte en gedeelde geschiedenis. In lage-context culturen is de betekenis expliciet — gedragen in woorden, duidelijk uitgesproken en schriftelijk vastgelegd."
          )}
        </p>
        <div style={{
          background: `${orange}12`,
          borderLeft: `4px solid ${orange}`,
          borderRadius: "0 12px 12px 0",
          padding: "20px 24px",
          margin: "32px 0",
        }}>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, lineHeight: 1.6, color: navy, fontStyle: "italic", margin: 0 }}>
            {t(
              "\"Neither is superior. Neither is more honest. They are different languages of meaning — and fluency in both is a leadership superpower.\"",
              "\"Tidak ada yang lebih unggul. Tidak ada yang lebih jujur. Keduanya adalah bahasa makna yang berbeda — dan kelancaran dalam keduanya adalah kekuatan super kepemimpinan.\"",
              "\"Geen van beide is superieur. Geen van beide is eerlijker. Het zijn verschillende talen van betekenis — en vaardigheid in beide is een leiderschapssuperpower.\""
            )}
          </p>
        </div>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: bodyText }}>
          {t(
            "This module explores five dimensions where high-context and low-context approaches create real friction for leaders. For each one, you will see where world regions typically fall on the spectrum, two scenarios showing the same leadership situation handled differently, and a practical bridge for navigating the gap.",
            "Modul ini mengeksplorasi lima dimensi di mana pendekatan konteks tinggi dan konteks rendah menciptakan gesekan nyata bagi para pemimpin. Untuk masing-masing, Anda akan melihat di mana wilayah dunia biasanya jatuh pada spektrum, dua skenario yang menunjukkan situasi kepemimpinan yang sama ditangani secara berbeda, dan jembatan praktis untuk menavigasi kesenjangan.",
            "Deze module verkent vijf dimensies waar hoge-context en lage-context benaderingen echte wrijving creëren voor leiders. Voor elke dimensie zie je waar wereldregio's doorgaans op het spectrum vallen, twee scenario's die dezelfde leiderschapssituatie anders aanpakken, en een praktische brug om de kloof te overbruggen."
          )}
        </p>
      </div>

      {/* ── Dimension Navigator ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 16px" }}>
        <div style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
        }}>
          {DIMENSIONS.map((d, i) => {
            const title = lang === "en" ? d.en_title : lang === "id" ? d.id_title : d.nl_title;
            return (
              <button
                key={d.id}
                onClick={() => setActiveDimension(i)}
                style={{
                  flexShrink: 0,
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: activeDimension === i ? `2px solid ${orange}` : `2px solid oklch(88% 0.008 80)`,
                  background: activeDimension === i ? `${orange}15` : offWhite,
                  color: activeDimension === i ? navy : bodyText,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: activeDimension === i ? 700 : 500,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  letterSpacing: "0.02em",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: activeDimension === i ? orange : lightGray,
                  color: activeDimension === i ? offWhite : bodyText,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                {title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Dimension ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{
          background: offWhite,
          border: `1.5px solid oklch(88% 0.008 80)`,
          borderRadius: 20,
          padding: "clamp(24px, 4vw, 48px)",
          boxShadow: "0 4px 32px oklch(22% 0.10 260 / 0.06)",
        }}>
          {/* Dimension Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 48,
                fontWeight: 700,
                color: `${orange}`,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>
                {String(activeDimension + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "clamp(18px, 3vw, 24px)",
                  fontWeight: 800,
                  color: navy,
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  {lang === "en" ? dim.en_title : lang === "id" ? dim.id_title : dim.nl_title}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: bodyText, fontStyle: "italic" }}>
                  {lang === "en" ? dim.en_subtitle : lang === "id" ? dim.id_subtitle : dim.nl_subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Spectrum Bar */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: bodyText, opacity: 0.6, marginBottom: 8 }}>
              {t("Cultural spectrum — where regions typically fall", "Spektrum budaya — di mana wilayah biasanya berada", "Cultureel spectrum — waar regio's doorgaans vallen")}
            </p>
            <SpectrumBar items={dim.spectrum} />
          </div>

          {/* Side-by-Side Scenarios */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}>
            {/* Low-context scenario */}
            <div style={{
              background: lightGray,
              borderRadius: 16,
              padding: "28px 24px",
              borderTop: `4px solid oklch(45% 0.10 240)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "oklch(45% 0.10 240)",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(45% 0.10 240)" }}>
                  {lang === "en" ? dim.en_scenario_low_label : lang === "id" ? dim.id_scenario_low_label : dim.nl_scenario_low_label}
                </span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                {lang === "en" ? dim.en_scenario_low : lang === "id" ? dim.id_scenario_low : dim.nl_scenario_low}
              </p>
            </div>

            {/* High-context scenario */}
            <div style={{
              background: `${orange}08`,
              borderRadius: 16,
              padding: "28px 24px",
              borderTop: `4px solid ${orange}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: orange,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: orange }}>
                  {lang === "en" ? dim.en_scenario_high_label : lang === "id" ? dim.id_scenario_high_label : dim.nl_scenario_high_label}
                </span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                {lang === "en" ? dim.en_scenario_high : lang === "id" ? dim.id_scenario_high : dim.nl_scenario_high}
              </p>
            </div>
          </div>

          {/* This means in practice */}
          <div style={{
            background: navy,
            borderRadius: 12,
            padding: "24px 28px",
            marginBottom: 20,
          }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: `${orange}` }}>
              {t("This means in practice", "Artinya dalam praktik", "Dit betekent in de praktijk")}
            </p>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "oklch(88% 0.02 80)" }}>
              {lang === "en" ? dim.en_practice : lang === "id" ? dim.id_practice : dim.nl_practice}
            </p>
          </div>

          {/* Cross-cultural bridge */}
          <div style={{
            background: `${orange}10`,
            border: `1.5px dashed ${orange}55`,
            borderRadius: 12,
            padding: "20px 24px",
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}>
            <svg style={{ flexShrink: 0, marginTop: 2 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
              <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange }}>
                {t("Cross-cultural bridge", "Jembatan lintas budaya", "Interculturele brug")}
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: navy }}>
                {lang === "en" ? dim.en_bridge : lang === "id" ? dim.id_bridge : dim.nl_bridge}
              </p>
            </div>
          </div>

          {/* Dimension navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, gap: 12 }}>
            <button
              onClick={() => setActiveDimension(Math.max(0, activeDimension - 1))}
              disabled={activeDimension === 0}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: `1.5px solid oklch(88% 0.008 80)`,
                background: "transparent",
                color: activeDimension === 0 ? "oklch(80% 0.008 80)" : navy,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                cursor: activeDimension === 0 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              {t("Previous", "Sebelumnya", "Vorige")}
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: bodyText, alignSelf: "center" }}>
              {activeDimension + 1} / {DIMENSIONS.length}
            </span>
            <button
              onClick={() => setActiveDimension(Math.min(DIMENSIONS.length - 1, activeDimension + 1))}
              disabled={activeDimension === DIMENSIONS.length - 1}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: `1.5px solid ${activeDimension < DIMENSIONS.length - 1 ? navy : "oklch(88% 0.008 80)"}`,
                background: activeDimension < DIMENSIONS.length - 1 ? navy : "transparent",
                color: activeDimension < DIMENSIONS.length - 1 ? offWhite : "oklch(80% 0.008 80)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                cursor: activeDimension === DIMENSIONS.length - 1 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {t("Next dimension", "Dimensi berikutnya", "Volgende dimensie")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Biblical Foundation ─────────────────────────────────────────── */}
      <div style={{
        background: navy,
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: orange }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange }}>
              {t("Biblical Foundation", "Fondasi Alkitabiah", "Bijbelse Fundering")}
            </span>
          </div>
          <h2 style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            color: offWhite,
            margin: "0 0 32px",
            lineHeight: 1.2,
          }}>
            {t(
              "Jesus was a high-context communicator",
              "Yesus adalah komunikator konteks tinggi",
              "Jezus was een hoge-context communicator"
            )}
          </h2>

          <p style={{ fontSize: 16, lineHeight: 1.85, color: "oklch(82% 0.02 80)", marginBottom: 24 }}>
            {t(
              "The Bible is itself a cross-cultural document. It was written in Hebrew, Aramaic, and Greek — three languages that carry different communication logics. The Old Testament is deeply high-context: meaning is embedded in story, symbol, repetition, and communal memory. You cannot understand the Psalms without knowing the history they are mourning. You cannot understand the prophets without knowing the political situation they are speaking into.",
              "Alkitab sendiri adalah dokumen lintas budaya. Ditulis dalam bahasa Ibrani, Aram, dan Yunani — tiga bahasa yang membawa logika komunikasi yang berbeda. Perjanjian Lama sangat berorientasi konteks tinggi: makna tertanam dalam cerita, simbol, pengulangan, dan memori komunal. Anda tidak dapat memahami Mazmur tanpa mengetahui sejarah yang mereka ratapi.",
              "De Bijbel is zelf een cross-cultureel document. Het is geschreven in het Hebreeuws, Aramees en Grieks — drie talen die verschillende communicatielogica's dragen. Het Oude Testament is diep hoge-context: betekenis is ingebed in verhaal, symbool, herhaling en gemeenschappelijk geheugen."
            )}
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.85, color: "oklch(82% 0.02 80)", marginBottom: 24 }}>
            {t(
              "Jesus, when he taught, almost never gave a direct proposition. He told stories. He asked questions. He used silence. He healed people in ways that communicated far more than any speech could. When he said \"I am the bread of life,\" he was speaking into a community whose identity was formed around the wilderness manna and the Passover meal — meanings that would have been obvious to his listeners and invisible to an outsider.",
              "Yesus, ketika mengajar, hampir tidak pernah memberikan proposisi langsung. Dia bercerita. Dia mengajukan pertanyaan. Dia menggunakan keheningan. Ketika Dia berkata \"Akulah roti kehidupan,\" Dia berbicara kepada komunitas yang identitasnya terbentuk di sekitar manna di padang gurun dan perjamuan Paskah — makna yang sudah jelas bagi pendengarnya.",
              "Jezus, wanneer hij onderwees, gaf bijna nooit een directe propositie. Hij vertelde verhalen. Hij stelde vragen. Hij gebruikte stilte. Toen hij zei 'Ik ben het brood des levens,' sprak hij in een gemeenschap wier identiteit gevormd was rond het manna in de woestijn en de Pesachmaaltijd — betekenissen die voor zijn toehoorders voor de hand lagen."
            )}
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.85, color: "oklch(82% 0.02 80)", marginBottom: 36 }}>
            {t(
              "And yet, when Paul wrote to the Corinthians — a cosmopolitan, Greek-speaking, low-context audience — he argued. He made propositions. He laid out logic. He was the same man, carrying the same gospel, adapting his communication style to the cultural context. Not compromise. Incarnation.",
              "Namun, ketika Paulus menulis kepada jemaat Korintus — audiens kosmopolitan berbahasa Yunani yang berorientasi konteks rendah — dia berargumentasi. Dia membuat proposisi. Dia menguraikan logika. Dia adalah orang yang sama, membawa injil yang sama, menyesuaikan gaya komunikasinya dengan konteks budaya. Bukan kompromi. Inkarnasi.",
              "En toch, toen Paulus aan de Korintiërs schreef — een kosmopolitisch, Grieks sprekend, laagcontext publiek — redeneerde hij. Hij maakte proposities. Hij legde logica uit. Dezelfde man, hetzelfde evangelie, zijn communicatiestijl aanpassend aan de culturele context. Geen compromis. Incarnatie."
            )}
          </p>

          {/* Two verse anchors */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
            {/* Verse 1 */}
            <div style={{
              background: "oklch(28% 0.10 260)",
              borderRadius: 16,
              padding: "28px 24px",
              borderLeft: `4px solid ${orange}`,
            }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 19, lineHeight: 1.65, color: "oklch(90% 0.02 80)", fontStyle: "italic", margin: "0 0 16px" }}>
                "{lang === "en" ? VERSES["john-16-12"].en : lang === "id" ? VERSES["john-16-12"].id : VERSES["john-16-12"].nl}"
              </p>
              <button
                onClick={() => setActiveVerse("john-16-12")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: orange,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  padding: 0,
                  textDecoration: "underline dotted",
                }}
              >
                {lang === "en" ? VERSES["john-16-12"].en_ref : lang === "id" ? VERSES["john-16-12"].id_ref : VERSES["john-16-12"].nl_ref}
              </button>
              <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.6, color: "oklch(72% 0.03 260)" }}>
                {t(
                  "Jesus was calibrating the pace of revelation to the readiness of his audience. High-context communication is often about timing — releasing meaning when it can be received.",
                  "Yesus menyesuaikan kecepatan pewahyuan dengan kesiapan audiens-Nya. Komunikasi konteks tinggi sering kali tentang waktu — melepaskan makna ketika dapat diterima.",
                  "Jezus kalibreerde het tempo van openbaring op de bereidheid van zijn publiek. Hoge-context communicatie gaat vaak over timing — betekenis vrijgeven wanneer het ontvangen kan worden."
                )}
              </p>
            </div>

            {/* Verse 2 */}
            <div style={{
              background: "oklch(28% 0.10 260)",
              borderRadius: 16,
              padding: "28px 24px",
              borderLeft: `4px solid ${orange}`,
            }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 19, lineHeight: 1.65, color: "oklch(90% 0.02 80)", fontStyle: "italic", margin: "0 0 16px" }}>
                "{lang === "en" ? VERSES["1cor-9-22"].en : lang === "id" ? VERSES["1cor-9-22"].id : VERSES["1cor-9-22"].nl}"
              </p>
              <button
                onClick={() => setActiveVerse("1cor-9-22")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: orange,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  padding: 0,
                  textDecoration: "underline dotted",
                }}
              >
                {lang === "en" ? VERSES["1cor-9-22"].en_ref : lang === "id" ? VERSES["1cor-9-22"].id_ref : VERSES["1cor-9-22"].nl_ref}
              </button>
              <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.6, color: "oklch(72% 0.03 260)" }}>
                {t(
                  "Paul's cross-cultural flexibility was not theological compromise — it was communicative wisdom. He adjusted how he communicated, not what. This is the biblical mandate for cultural intelligence.",
                  "Fleksibilitas lintas budaya Paulus bukan kompromi teologis — itu adalah kebijaksanaan komunikatif. Dia menyesuaikan cara berkomunikasi, bukan apa yang dikomunikasikan. Ini adalah mandat Alkitabiah untuk kecerdasan budaya.",
                  "Paulus' interculturele flexibiliteit was geen theologisch compromis — het was communicatieve wijsheid. Hij paste aan hoe hij communiceerde, niet wat. Dit is het bijbelse mandaat voor culturele intelligentie."
                )}
              </p>
            </div>
          </div>

          <div style={{
            background: "oklch(28% 0.10 260)",
            borderRadius: 16,
            padding: "28px 28px",
          }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange }}>
              {t("Kingdom question", "Pertanyaan Kerajaan", "Koninkrijksvraag")}
            </p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "oklch(88% 0.02 80)", fontStyle: "italic" }}>
              {t(
                "If Jesus and Paul both adapted their communication to their cultural audience — not compromising the message, but honouring the listener — what does that ask of you in the context you are leading in today?",
                "Jika Yesus dan Paulus keduanya menyesuaikan komunikasi mereka dengan audiens budaya mereka — tidak mengompromikan pesan, tetapi menghormati pendengar — apa yang diminta dari Anda dalam konteks yang Anda pimpin hari ini?",
                "Als Jezus en Paulus beiden hun communicatie aanpasten aan hun culturele publiek — de boodschap niet compromitterend, maar de luisteraar eerend — wat vraagt dat van jou in de context die je vandaag leidt?"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Personal Assessment ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: orange }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange }}>
              {t("Personal Assessment", "Penilaian Pribadi", "Persoonlijke Assessment")}
            </span>
          </div>
          <h2 style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 700,
            color: navy,
            margin: "0 0 16px",
          }}>
            {t("What is your default communication style?", "Apa gaya komunikasi default Anda?", "Wat is jouw standaard communicatiestijl?")}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: bodyText }}>
            {t(
              "These five questions will help you identify whether you lean toward low-context or high-context communication. There is no right answer — only greater self-awareness.",
              "Lima pertanyaan ini akan membantu Anda mengidentifikasi apakah Anda cenderung ke komunikasi konteks rendah atau konteks tinggi. Tidak ada jawaban yang benar — hanya kesadaran diri yang lebih besar.",
              "Deze vijf vragen helpen je te identificeren of je neigt naar lage-context of hoge-context communicatie. Er is geen goed antwoord — alleen grotere zelfkennis."
            )}
          </p>
        </div>

        {ASSESSMENT_QUESTIONS.map((q, i) => {
          const question = lang === "en" ? q.en_q : lang === "id" ? q.id_q : q.nl_q;
          return (
            <div
              key={i}
              style={{
                marginBottom: 28,
                padding: "28px 28px",
                background: offWhite,
                border: `1.5px solid ${assessmentAnswers[i] ? `${orange}55` : "oklch(88% 0.008 80)"}`,
                borderRadius: 16,
                transition: "border-color 0.2s",
              }}
            >
              <p style={{ margin: "0 0 20px", fontSize: 16, lineHeight: 1.65, color: navy, fontWeight: 600 }}>
                <span style={{ color: orange, fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, marginRight: 8 }}>{i + 1}.</span>
                {question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, j) => {
                  const optLabel = lang === "en" ? opt.en : lang === "id" ? opt.id : opt.nl;
                  const isSelected = assessmentAnswers[i] === opt.style;
                  return (
                    <button
                      key={j}
                      onClick={() => handleAnswer(i, opt.style)}
                      style={{
                        padding: "14px 18px",
                        borderRadius: 10,
                        border: `2px solid ${isSelected ? (opt.style === "high" ? orange : "oklch(45% 0.10 240)") : "oklch(88% 0.008 80)"}`,
                        background: isSelected
                          ? (opt.style === "high" ? `${orange}12` : "oklch(45% 0.10 240 / 0.08)")
                          : lightGray,
                        color: isSelected
                          ? (opt.style === "high" ? navy : "oklch(25% 0.10 240)")
                          : bodyText,
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: 14,
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        lineHeight: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? (opt.style === "high" ? orange : "oklch(45% 0.10 240)") : "oklch(70% 0.008 80)"}`,
                        background: isSelected ? (opt.style === "high" ? orange : "oklch(45% 0.10 240)") : "transparent",
                        flexShrink: 0,
                        display: "inline-block",
                        transition: "all 0.15s",
                      }} />
                      {optLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Result */}
        {answeredAll && (
          <div style={{
            marginTop: 8,
            padding: "40px 36px",
            background: navy,
            borderRadius: 20,
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 72,
              fontWeight: 700,
              color: orange,
              lineHeight: 1,
              marginBottom: 8,
            }}>
              {highCount}/5
            </div>
            <p style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(60% 0.04 260)" }}>
              {t("High-context responses", "Respons konteks tinggi", "Hoge-context antwoorden")}
            </p>
            {highCount <= 1 && (
              <>
                <p style={{ fontSize: 18, fontWeight: 700, color: offWhite, margin: "0 0 12px", fontFamily: "Montserrat, sans-serif" }}>
                  {t("Strongly low-context", "Sangat berorientasi konteks rendah", "Sterk laagcontext")}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(78% 0.02 80)", margin: 0 }}>
                  {t(
                    "You default to direct, explicit communication — clarity is your instinct. Your key growth edge is learning to read the room in high-context settings. Slow down, look for what isn't being said, and invest in relationship time before diving into task.",
                    "Anda menggunakan komunikasi langsung dan eksplisit secara default — kejelasan adalah insting Anda. Kunci pertumbuhan Anda adalah belajar membaca suasana dalam situasi konteks tinggi. Perlambat, cari apa yang tidak dikatakan, dan investasikan waktu untuk hubungan sebelum menyelami tugas.",
                    "Je gebruikt standaard directe, expliciete communicatie — duidelijkheid is jouw instinct. Jouw groeipunt is leren de ruimte te lezen in hoge-context omgevingen. Vertraag, zoek naar wat er niet gezegd wordt, en investeer in relatietijd voor je in de taak duikt."
                  )}
                </p>
              </>
            )}
            {highCount === 2 && (
              <>
                <p style={{ fontSize: 18, fontWeight: 700, color: offWhite, margin: "0 0 12px", fontFamily: "Montserrat, sans-serif" }}>
                  {t("Leaning low-context", "Cenderung konteks rendah", "Neigt naar laagcontext")}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(78% 0.02 80)", margin: 0 }}>
                  {t(
                    "You lean toward directness, but you have some instincts for relational sensitivity. In cross-cultural settings, lean into those instincts more — the discomfort of ambiguity is often the entry point for trust.",
                    "Anda cenderung ke ketegasan, tetapi Anda memiliki beberapa insting untuk sensitivitas relasional. Dalam situasi lintas budaya, lebih andalkan insting tersebut — ketidaknyamanan ambiguitas sering kali menjadi titik masuk kepercayaan.",
                    "Je neigt naar directheid, maar hebt ook enige instincten voor relationele gevoeligheid. In interculturele situaties, vertrouw die instincten meer — het ongemak van ambiguïteit is vaak het toegangspunt voor vertrouwen."
                  )}
                </p>
              </>
            )}
            {highCount === 3 && (
              <>
                <p style={{ fontSize: 18, fontWeight: 700, color: offWhite, margin: "0 0 12px", fontFamily: "Montserrat, sans-serif" }}>
                  {t("Culturally bilingual", "Dua bahasa budaya", "Cultureel tweetalig")}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(78% 0.02 80)", margin: 0 }}>
                  {t(
                    "You sit at the centre — adaptable in both directions. This is a significant strength for cross-cultural leadership. Your challenge is knowing when to be direct and when to hold back. Context-reading is your key skill to develop.",
                    "Anda berada di tengah — dapat beradaptasi di kedua arah. Ini adalah kekuatan signifikan untuk kepemimpinan lintas budaya. Tantangan Anda adalah mengetahui kapan harus langsung dan kapan harus menahan diri. Membaca konteks adalah keterampilan utama yang perlu dikembangkan.",
                    "Je zit in het midden — aanpasbaar in beide richtingen. Dit is een significante sterkte voor intercultureel leiderschap. Je uitdaging is weten wanneer je direct moet zijn en wanneer je moet inhouden. Contextueel lezen is jouw sleutelcompetentie."
                  )}
                </p>
              </>
            )}
            {highCount === 4 && (
              <>
                <p style={{ fontSize: 18, fontWeight: 700, color: offWhite, margin: "0 0 12px", fontFamily: "Montserrat, sans-serif" }}>
                  {t("Leaning high-context", "Cenderung konteks tinggi", "Neigt naar hoogcontext")}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(78% 0.02 80)", margin: 0 }}>
                  {t(
                    "You naturally read between lines, invest in relationships, and protect dignity in conflict. Your growth edge: learn to communicate more explicitly when working with low-context colleagues. They will often need you to say it clearly — and that is not a betrayal of your values.",
                    "Anda secara alami membaca antara baris, berinvestasi dalam hubungan, dan melindungi martabat dalam konflik. Sisi pertumbuhan Anda: belajar berkomunikasi lebih eksplisit saat bekerja dengan rekan konteks rendah. Mereka akan sering membutuhkan Anda untuk mengatakannya dengan jelas.",
                    "Je leest van nature tussen de regels, investeert in relaties en beschermt waardigheid in conflict. Jouw groeipunt: leer explicieter communiceren bij laagcontext collega's. Ze zullen jou vaak nodig hebben om het duidelijk te zeggen — en dat is geen verraad aan jouw waarden."
                  )}
                </p>
              </>
            )}
            {highCount === 5 && (
              <>
                <p style={{ fontSize: 18, fontWeight: 700, color: offWhite, margin: "0 0 12px", fontFamily: "Montserrat, sans-serif" }}>
                  {t("Strongly high-context", "Sangat berorientasi konteks tinggi", "Sterk hoogcontext")}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "oklch(78% 0.02 80)", margin: 0 }}>
                  {t(
                    "You are deeply relational, indirect, and sensitive to group dynamics. In mixed-culture teams, your challenge is making your meaning accessible to those who cannot read the signals you naturally send. Practice naming things directly in safe spaces — it will make you a stronger bridge between both worlds.",
                    "Anda sangat relasional, tidak langsung, dan sensitif terhadap dinamika kelompok. Dalam tim multi-budaya, tantangan Anda adalah membuat makna Anda dapat diakses oleh mereka yang tidak dapat membaca sinyal yang Anda kirim secara alami. Berlatihlah menyebutkan hal-hal secara langsung di tempat yang aman.",
                    "Je bent diep relationeel, indirect en gevoelig voor groepsdynamiek. In gemengde cultuurteams is je uitdaging je betekenis toegankelijk te maken voor degenen die de signalen die jij natuurlijk uitzendt niet kunnen lezen. Oefen in veilige ruimtes dingen direct te benoemen."
                  )}
                </p>
              </>
            )}

            <div style={{ marginTop: 28, padding: "20px 24px", background: "oklch(28% 0.10 260)", borderRadius: 12 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "oklch(80% 0.02 80)", fontStyle: "italic" }}>
                {t(
                  "Remember: your default style is not your ceiling. The goal is not to abandon who you are — it is to expand your range. The most effective cross-cultural leaders are fluent in both registers.",
                  "Ingat: gaya default Anda bukan batas Anda. Tujuannya bukan untuk meninggalkan siapa diri Anda — melainkan untuk memperluas jangkauan Anda. Pemimpin lintas budaya yang paling efektif fasih dalam kedua register.",
                  "Onthoud: jouw standaardstijl is niet jouw plafond. Het doel is niet wie je bent achter te laten — het is je bereik te vergroten. De meest effectieve interculturele leiders zijn vaardig in beide registers."
                )}
              </p>
            </div>
          </div>
        )}

        {!answeredAll && (
          <p style={{ textAlign: "center", fontSize: 14, color: bodyText, opacity: 0.6, marginTop: 16 }}>
            {t(
              `Answer all 5 questions to see your result (${Object.keys(assessmentAnswers).length}/5 answered)`,
              `Jawab semua 5 pertanyaan untuk melihat hasil Anda (${Object.keys(assessmentAnswers).length}/5 dijawab)`,
              `Beantwoord alle 5 vragen om je resultaat te zien (${Object.keys(assessmentAnswers).length}/5 beantwoord)`
            )}
          </p>
        )}
      </div>

      {/* ── Footer CTA ─────────────────────────────────────────────────── */}
      <div style={{
        background: lightGray,
        borderTop: `1px solid oklch(88% 0.008 80)`,
        padding: "56px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h3 style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 700,
            color: navy,
            margin: "0 0 16px",
          }}>
            {t("Keep building your cross-cultural fluency", "Terus bangun kelancaran lintas budaya Anda", "Blijf je interculturele vaardigheid opbouwen")}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, marginBottom: 32 }}>
            {t(
              "High-context and low-context communication is one dimension of a much larger picture. Explore the related modules below.",
              "Komunikasi konteks tinggi dan rendah adalah satu dimensi dari gambaran yang jauh lebih besar. Jelajahi modul terkait di bawah ini.",
              "Hoge-context en lage-context communicatie is één dimensie van een veel groter geheel. Verken de gerelateerde modules hieronder."
            )}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/resources/intercultural-communication" style={{
              padding: "12px 24px",
              background: navy,
              color: offWhite,
              borderRadius: 8,
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.04em",
            }}>
              {t("Intercultural Communication", "Komunikasi Antarbudaya", "Interculturele Communicatie")}
            </Link>
            <Link href="/resources/cultural-intelligence" style={{
              padding: "12px 24px",
              background: "transparent",
              color: navy,
              borderRadius: 8,
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.04em",
              border: `1.5px solid ${navy}`,
            }}>
              {t("Cultural Intelligence (CQ)", "Kecerdasan Budaya (CQ)", "Culturele Intelligentie (CQ)")}
            </Link>
            <Link href="/resources/giving-feedback-across-cultures" style={{
              padding: "12px 24px",
              background: "transparent",
              color: navy,
              borderRadius: 8,
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.04em",
              border: `1.5px solid ${navy}`,
            }}>
              {t("Giving Feedback Across Cultures", "Umpan Balik Lintas Budaya", "Feedback Geven over Culturen")}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Verse Popup ─────────────────────────────────────────────────── */}
      {activeVerse && VERSES[activeVerse] && (
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
            onClick={e => e.stopPropagation()}
            style={{
              background: offWhite,
              borderRadius: 20,
              padding: "44px 40px",
              maxWidth: 520,
              width: "100%",
              boxShadow: "0 24px 80px oklch(10% 0.05 260 / 0.35)",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange }}>
                {lang === "en" ? "NIV" : lang === "id" ? "TB" : "NBV"}
              </span>
            </div>
            <p style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 22,
              lineHeight: 1.65,
              color: navy,
              fontStyle: "italic",
              margin: "0 0 20px",
            }}>
              "{lang === "en" ? VERSES[activeVerse].en : lang === "id" ? VERSES[activeVerse].id : VERSES[activeVerse].nl}"
            </p>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: orange,
              letterSpacing: "0.08em",
              margin: "0 0 28px",
            }}>
              — {lang === "en" ? VERSES[activeVerse].en_ref : lang === "id" ? VERSES[activeVerse].id_ref : VERSES[activeVerse].nl_ref}
              {" "}({lang === "en" ? "NIV" : lang === "id" ? "TB" : "NBV"})
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "12px 28px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 8,
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
