"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const lightGray = "oklch(95% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const serif = "Cormorant Garamond, Georgia, serif";

// ─── VERSE DATA ───────────────────────────────────────────────────────────────
// TB = Terjemahan Baru (Indonesian), NBV = Nieuwe Bijbelvertaling (Dutch)
const VERSES: Record<string, { en_ref: string; id_ref: string; nl_ref: string; en: string; id: string; nl: string }> = {
  "gen-45-9": {
    en_ref: "Genesis 45:9",
    id_ref: "Kejadian 45:9",
    nl_ref: "Genesis 45:9",
    en: "Now hurry back to my father and say to him, 'This is what your son Joseph says: God has made me lord of all Egypt. Come down to me; don't delay.'",
    id: "Sekarang segera pergilah kepada ayahku dan katakanlah kepadanya: Beginilah kata anakmu Yusuf: Allah telah membuat aku tuan atas seluruh Mesir. Datanglah kepadaku, janganlah tunggu-tunggu.",
    nl: "Ga nu vlug naar mijn vader en zeg hem: ‘Dit zegt uw zoon Jozef: God heeft mij aangesteld tot heer over heel Egypte. Kom naar mij toe, aarzel niet.’",
  },
  "ruth-1-16": {
    en_ref: "Ruth 1:16",
    id_ref: "Rut 1:16",
    nl_ref: "Ruth 1:16",
    en: "But Ruth replied, 'Don't urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.'",
    id: "Tetapi kata Rut: 'Janganlah desak aku meninggalkan engkau dan pulang dengan tidak membawamu, sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam; bangsamulah bangsaku dan Allahmulah Allahku.'",
    nl: "Maar Rut antwoordde: 'Vraag me toch niet langer u te verlaten en terug te gaan, want waar u gaat, zal ik gaan, en waar u blijft, zal ik blijven. Uw volk is mijn volk en uw God is mijn God.'",
  },
  "ps-126-5": {
    en_ref: "Psalm 126:5",
    id_ref: "Mazmur 126:5",
    nl_ref: "Psalm 126:5",
    en: "Those who sow with tears will reap with songs of joy.",
    id: "Orang-orang yang menabur dengan mencucurkan air mata, akan menuai dengan bersorak-sorai.",
    nl: "Wie in tranen zaaien, zullen oogsten met gejuich.",
  },
  "phil-3-13": {
    en_ref: "Philippians 3:13",
    id_ref: "Filipi 3:13",
    nl_ref: "Filippenzen 3:13",
    en: "Brothers and sisters, I do not consider myself yet to have taken hold of it. But one thing I do: Forgetting what is behind and straining toward what is ahead.",
    id: "Saudara-saudara, aku sendiri tidak menganggap, bahwa aku telah menangkapnya, tetapi ini yang kulakukan: aku melupakan apa yang telah di belakangku dan mengarahkan diri kepada apa yang di hadapanku.",
    nl: "Broeders en zusters, ik beeld me niet in dat ik het al heb bereikt, maar één ding is zeker: ik vergeet wat achter me ligt en richt me op wat voor me ligt.",
  },
  "rom-12-2": {
    en_ref: "Romans 12:2",
    id_ref: "Roma 12:2",
    nl_ref: "Romeinen 12:2",
    en: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
    id: "Janganlah kamu menjadi serupa dengan dunia ini, tetapi berubahlah oleh pembaruan budimu.",
    nl: "Pas u niet aan deze wereld aan, maar word innerlijk veranderd door uw gezindheid te vernieuwen.",
  },
  "isa-43-18": {
    en_ref: "Isaiah 43:18–19",
    id_ref: "Yesaya 43:18–19",
    nl_ref: "Jesaja 43:18–19",
    en: "Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.",
    id: "Janganlah ingat-ingat hal-hal yang dahulu, dan janganlah perhatikan hal-hal yang dari zaman purbakala! Lihat, Aku hendak membuat sesuatu yang baru, yang sekarang sudah tumbuh, belumkah kamu mengetahuinya? Ya, Aku hendak membuat jalan di padang gurun dan sungai-sungai di padang belantara.",
    nl: "Denk niet meer aan het vroegere, houd u niet bezig met wat lang geleden was. Ik ga iets nieuws doen, het begint al te ontkiemen, merkt u het niet? Ik baan een weg door de woestijn, ik laat rivieren stromen in de wildernis.",
  },
};

// ─── JOURNEY STAGES ──────────────────────────────────────────────────────────
const JOURNEY_STAGES = [
  {
    id: "arrival",
    en_title: "Arrival",
    id_title: "Kedatangan",
    nl_title: "Aankomst",
    en_timeframe: "0–3 months",
    id_timeframe: "0–3 bulan",
    nl_timeframe: "0–3 maanden",
    en_tagline: "The honeymoon that hides a wound",
    id_tagline: "Bulan madu yang menyembunyikan luka",
    nl_tagline: "De huwelijksreis die een wond verbergt",
    en_vignette: "She walked into her parents' house and felt nothing — no relief, no joy, just a strange blankness. She smiled anyway, and everyone said how well she seemed.",
    id_vignette: "Ia masuk ke rumah orang tuanya dan tidak merasakan apa-apa — tidak ada kelegaan, tidak ada sukacita, hanya kekosongan yang aneh. Ia tetap tersenyum, dan semua orang berkata betapa baik penampilannya.",
    nl_vignette: "Ze liep het huis van haar ouders binnen en voelde niets — geen opluchting, geen vreugde, alleen een vreemde leegte. Ze glimlachte toch, en iedereen zei hoe goed ze eruitzag.",
    en_feelings: [
      "A strange flatness where you expected to feel excited or relieved",
      "Hyper-awareness of everything you left behind — sounds, smells, conversations",
      "Performing 'normal' for family and friends while feeling internally unmoored",
    ],
    id_feelings: [
      "Kekosongan aneh di mana Anda berharap merasa bersemangat atau lega",
      "Kesadaran yang berlebihan tentang semua yang Anda tinggalkan — suara, bau, percakapan",
      "Berpura-pura 'normal' di depan keluarga dan teman sambil merasa tidak berakar secara internal",
    ],
    nl_feelings: [
      "Een vreemde leegte waar je verwachtte je blij of opgelucht te voelen",
      "Hyperbewustzijn van alles wat je achter hebt gelaten — geluiden, geuren, gesprekken",
      "Normaal doen voor familie en vrienden terwijl je je innerlijk stuurloos voelt",
    ],
    en_traps: [
      "Staying busy to avoid sitting with the disorientation",
      "Telling stories about where you came from — constantly, to anyone who will listen",
      "Reassuring everyone (and yourself) that you're fine",
    ],
    id_traps: [
      "Tetap sibuk untuk menghindari duduk dengan disorientasi",
      "Terus-menerus bercerita tentang tempat asal Anda — kepada siapa saja yang mau mendengar",
      "Meyakinkan semua orang (dan diri sendiri) bahwa Anda baik-baik saja",
    ],
    nl_traps: [
      "Bezig blijven om de desoriëntatie te vermijden",
      "Verhalen vertellen over waar je vandaan komt — voortdurend, aan iedereen die wil luisteren",
      "Iedereen (en jezelf) geruststellen dat je prima bent",
    ],
    en_helps: [
      "Name what you lost — make a list, write it down. Losses only have power when they are unnamed.",
      "Allow yourself at least 30 minutes a day of quiet — no screens, no productivity. Let your nervous system decompress.",
      "Find one person who has lived cross-culturally and tell them the real version of how you're doing.",
    ],
    id_helps: [
      "Namai apa yang Anda kehilangan — buat daftar, tuliskan. Kehilangan hanya memiliki kekuatan ketika tidak disebutkan.",
      "Izinkan diri Anda setidaknya 30 menit sehari dalam keheningan — tanpa layar, tanpa produktivitas. Biarkan sistem saraf Anda melonggarkan tekanan.",
      "Temukan satu orang yang pernah hidup lintas budaya dan ceritakan kepada mereka versi nyata tentang kondisi Anda.",
    ],
    nl_helps: [
      "Benoem wat je verloren hebt — maak een lijst, schrijf het op. Verliezen hebben alleen kracht als ze niet benoemd zijn.",
      "Gun jezelf minstens 30 minuten per dag stilte — geen schermen, geen productiviteit. Laat je zenuwstelsel tot rust komen.",
      "Zoek iemand die cross-cultureel heeft geleefd en vertel hen de échte versie van hoe het met je gaat.",
    ],
    verse_key: "ps-126-5",
  },
  {
    id: "collision",
    en_title: "Collision",
    id_title: "Benturan",
    nl_title: "Botsing",
    en_timeframe: "3–9 months",
    id_timeframe: "3–9 bulan",
    nl_timeframe: "3–9 maanden",
    en_tagline: "When home no longer feels like home",
    id_tagline: "Ketika rumah tidak lagi terasa seperti rumah",
    nl_tagline: "Wanneer thuis niet meer als thuis voelt",
    en_vignette: "He sat across from his oldest friend and realized they had nothing to talk about. Three years ago they were inseparable. Now he felt more alone at this table than he had in the country he'd just left.",
    id_vignette: "Ia duduk berhadapan dengan teman lamanya dan menyadari bahwa mereka tidak memiliki hal yang bisa dibicarakan. Tiga tahun lalu mereka tidak terpisahkan. Sekarang ia merasa lebih kesepian di meja ini daripada di negara yang baru saja ia tinggalkan.",
    nl_vignette: "Hij zat tegenover zijn oudste vriend en besefte dat ze niets te bespreken hadden. Drie jaar geleden waren ze onafscheidelijk. Nu voelde hij zich eenzamer aan deze tafel dan in het land dat hij zojuist had verlaten.",
    en_feelings: [
      "Grief that catches you off guard — a song, a smell, a WhatsApp message that breaks you open",
      "Irritation with your home culture's pace, priorities, and superficiality",
      "A deep loneliness even when surrounded by people who love you",
    ],
    id_feelings: [
      "Duka yang mengejutkan Anda — sebuah lagu, aroma, pesan WhatsApp yang membuat Anda merasa hancur",
      "Kejengkelan dengan kecepatan, prioritas, dan kedangkalan budaya asal Anda",
      "Kesepian yang mendalam meski dikelilingi orang-orang yang menyayangi Anda",
    ],
    nl_feelings: [
      "Verdriet dat je overvalt — een liedje, een geur, een WhatsApp-bericht dat je openbreekt",
      "Irritatie over het tempo, de prioriteiten en de oppervlakkigheid van je thuiscultuur",
      "Een diepe eenzaamheid ook als je omringd bent door mensen die van je houden",
    ],
    en_traps: [
      "Idealising where you came from ('back there, everything was more real')",
      "Withdrawing from relationships because explaining feels exhausting",
      "Questioning whether you made the right decision to come back",
    ],
    id_traps: [
      "Mengidealisasi tempat asal ('di sana, segalanya lebih nyata')",
      "Menarik diri dari hubungan karena menjelaskan terasa melelahkan",
      "Mempertanyakan apakah Anda membuat keputusan yang tepat untuk kembali",
    ],
    nl_traps: [
      "Idealiseren van waar je vandaan komt ('daar was alles echter')",
      "Je terugtrekken uit relaties omdat uitleggen uitputtend voelt",
      "Je afvragen of je de juiste beslissing hebt genomen om terug te komen",
    ],
    en_helps: [
      "Let the grief come. Grief is proof that what you had was real — don't rush past it or spiritualise it away.",
      "Tell a few trusted people: 'I'm not adjusting as well as I look.' You don't need everyone to understand — you need one or two people who do.",
      "Resist comparison. Your previous context was not better — it was different. Idealising the past is a grief response, not an accurate reading of reality.",
    ],
    id_helps: [
      "Biarkan duka datang. Duka adalah bukti bahwa apa yang Anda miliki itu nyata — jangan terburu-buru melewatinya atau mengspiritualkan.",
      "Beritahu beberapa orang yang Anda percaya: 'Saya tidak menyesuaikan diri sebaik yang terlihat.' Anda tidak membutuhkan semua orang untuk mengerti — Anda hanya butuh satu atau dua orang.",
      "Tolak perbandingan. Konteks sebelumnya Anda tidak lebih baik — itu berbeda. Mengidealisasi masa lalu adalah respons duka, bukan pembacaan akurat tentang kenyataan.",
    ],
    nl_helps: [
      "Laat het verdriet komen. Verdriet is het bewijs dat wat je had echt was — haast er niet overheen en spiritualiseer het niet weg.",
      "Vertel een paar vertrouwde mensen: 'Ik pas me niet zo goed aan als ik er uitzie.' Je hoeft niet dat iedereen het begrijpt — je hebt één of twee mensen nodig die het doen.",
      "Weersta vergelijking. Jouw vorige context was niet beter — het was anders. Het idealiseren van het verleden is een rouwreactie, geen nauwkeurige lezing van de werkelijkheid.",
    ],
    verse_key: "rom-12-2",
  },
  {
    id: "adjustment",
    en_title: "Adjustment",
    id_title: "Penyesuaian",
    nl_title: "Aanpassing",
    en_timeframe: "9–18 months",
    id_timeframe: "9–18 bulan",
    nl_timeframe: "9–18 maanden",
    en_tagline: "Finding the ground beneath your feet again",
    id_tagline: "Menemukan kembali pijakan di bawah kaki Anda",
    nl_tagline: "De grond weer onder je voeten voelen",
    en_vignette: "She still thought about Jakarta every day. But she had started running a new route near her house, and she noticed she looked forward to it. That felt significant.",
    id_vignette: "Ia masih memikirkan Jakarta setiap hari. Tetapi ia mulai berlari di rute baru dekat rumahnya, dan ia menyadari bahwa ia menantikannya. Itu terasa bermakna.",
    nl_vignette: "Ze dacht nog elke dag aan Jakarta. Maar ze was begonnen met een nieuwe route te lopen bij haar huis, en ze merkte dat ze ernaar uitkeek. Dat voelde significant.",
    en_feelings: [
      "Moments of genuine belonging that surprise you — followed by guilt for not missing it more",
      "A growing ability to hold both realities: who you were there, and who you are becoming here",
      "Cautious hope that you might actually find a meaningful life in this place",
    ],
    id_feelings: [
      "Momen-momen kebersamaan sejati yang mengejutkan Anda — diikuti oleh rasa bersalah karena tidak merindukan lebih banyak",
      "Kemampuan yang tumbuh untuk memegang kedua realitas: siapa Anda di sana, dan siapa Anda menjadi di sini",
      "Harapan yang hati-hati bahwa Anda mungkin benar-benar menemukan kehidupan yang bermakna di tempat ini",
    ],
    nl_feelings: [
      "Momenten van echte verbondenheid die je verrassen — gevolgd door schuldgevoel dat je het niet meer mist",
      "Een groeiend vermogen om beide realiteiten te dragen: wie je daar was, en wie je hier wordt",
      "Voorzichtige hoop dat je misschien echt een zinvol leven kunt vinden op deze plek",
    ],
    en_traps: [
      "Feeling guilty for adjusting — as though belonging here means betraying there",
      "Over-scheduling to create a sense of belonging before it's ready to form naturally",
      "Expecting your identity to snap back to who you were before you left",
    ],
    id_traps: [
      "Merasa bersalah karena menyesuaikan diri — seolah-olah menjadi bagian di sini berarti mengkhianati di sana",
      "Terlalu banyak jadwal untuk menciptakan rasa memiliki sebelum waktunya untuk terbentuk secara alami",
      "Mengharapkan identitas Anda kembali ke siapa Anda sebelum pergi",
    ],
    nl_traps: [
      "Schuldig voelen over aanpassen — alsof ergens bij horen hier verraad betekent aan daar",
      "Te veel plannen om een gevoel van verbondenheid te creëren voordat het klaar is om zich natuurlijk te vormen",
      "Verwachten dat je identiteit terugspringt naar wie je was voor je vertrok",
    ],
    en_helps: [
      "Give yourself permission to belong here without conditions. Adjusting is not betrayal — it is faithfulness to where God has placed you now.",
      "Start building rituals in this place: a regular walk, a weekly meal, a community of practice. Belonging is built slowly through repeated acts.",
      "Begin to articulate what the cross-cultural years gave you — not just what they cost you. This is the beginning of integration.",
    ],
    id_helps: [
      "Izinkan diri Anda untuk menjadi bagian di sini tanpa syarat. Menyesuaikan diri bukan pengkhianatan — itu kesetiaan pada tempat yang Tuhan tempatkan Anda sekarang.",
      "Mulai membangun ritual di tempat ini: jalan-jalan teratur, makan bersama mingguan, komunitas praktik. Rasa memiliki dibangun perlahan melalui tindakan berulang.",
      "Mulai articulasikan apa yang diberikan tahun-tahun lintas budaya kepada Anda — bukan hanya apa yang mereka habiskan. Ini adalah awal dari integrasi.",
    ],
    nl_helps: [
      "Geef jezelf toestemming om hier bij te horen zonder voorwaarden. Aanpassen is geen verraad — het is trouw aan waar God je nu geplaatst heeft.",
      "Begin rituelen op te bouwen op deze plek: een vaste wandeling, een wekelijkse maaltijd, een oefengemeenschap. Verbondenheid wordt langzaam opgebouwd door herhaalde daden.",
      "Begin te verwoorden wat de interculturele jaren je hebben gegeven — niet alleen wat ze je hebben gekost. Dit is het begin van integratie.",
    ],
    verse_key: "phil-3-13",
  },
  {
    id: "integration",
    en_title: "Integration",
    id_title: "Integrasi",
    nl_title: "Integratie",
    en_timeframe: "18 months+",
    id_timeframe: "18 bulan ke atas",
    nl_timeframe: "18+ maanden",
    en_tagline: "The cross-cultural gift becomes available",
    id_tagline: "Karunia lintas budaya menjadi tersedia",
    nl_tagline: "Het interculturele geschenk wordt beschikbaar",
    en_vignette: "He was leading a meeting when he noticed he was the only one who could see what was happening between two team members from different cultural backgrounds. He said something quiet and accurate. The room shifted. For the first time in years, his history felt like a gift.",
    id_vignette: "Ia sedang memimpin rapat ketika ia menyadari bahwa ia adalah satu-satunya yang bisa melihat apa yang terjadi antara dua anggota tim dari latar belakang budaya yang berbeda. Ia mengatakan sesuatu yang tenang dan tepat. Ruangan berubah. Untuk pertama kalinya dalam bertahun-tahun, sejarahnya terasa seperti karunia.",
    nl_vignette: "Hij leidde een vergadering toen hij merkte dat hij de enige was die kon zien wat er gebeurde tussen twee teamleden met verschillende culturele achtergronden. Hij zei iets rustig en raak. De sfeer in de kamer veranderde. Voor het eerst in jaren voelde zijn geschiedenis als een geschenk.",
    en_feelings: [
      "A settled sense of who you are — not defined by where you have been, but shaped by it",
      "The ability to hold grief and gratitude for the same experience at the same time",
      "A quiet confidence that what you carry is genuinely useful to the people around you",
    ],
    id_feelings: [
      "Rasa yang tenang tentang siapa Anda — tidak didefinisikan oleh tempat Anda telah berada, tetapi dibentuk olehnya",
      "Kemampuan untuk menampung duka dan rasa syukur untuk pengalaman yang sama pada saat yang sama",
      "Kepercayaan diri yang tenang bahwa apa yang Anda bawa benar-benar berguna bagi orang-orang di sekitar Anda",
    ],
    nl_feelings: [
      "Een rustig gevoel van wie je bent — niet gedefinieerd door waar je bent geweest, maar erdoor gevormd",
      "Het vermogen om rouw en dankbaarheid voor dezelfde ervaring tegelijkertijd te dragen",
      "Een stille zekerheid dat wat je draagt echt nuttig is voor de mensen om je heen",
    ],
    en_traps: [
      "Assuming integration means the grief is gone — it has simply found its rightful place",
      "Becoming the person who frames everything through 'when I was overseas' — your history serves others, it doesn't define every conversation",
      "Stopping here. Integration is not the end — it is the beginning of giving your cross-cultural experience away.",
    ],
    id_traps: [
      "Menganggap integrasi berarti duka sudah hilang — itu hanya telah menemukan tempatnya yang tepat",
      "Menjadi orang yang membingkai segalanya melalui 'ketika saya di luar negeri' — sejarah Anda melayani orang lain, bukan mendefinisikan setiap percakapan",
      "Berhenti di sini. Integrasi bukan akhir — itu adalah awal dari membagikan pengalaman lintas budaya Anda.",
    ],
    nl_traps: [
      "Aannemen dat integratie betekent dat het verdriet weg is — het heeft simpelweg zijn rechtmatige plek gevonden",
      "De persoon worden die alles inkadrert door 'toen ik in het buitenland was' — jouw geschiedenis dient anderen, ze definieert niet elk gesprek",
      "Hier stoppen. Integratie is niet het einde — het is het begin van het weggeven van jouw interculturele ervaring.",
    ],
    verse_key: "isa-43-18",
  },
];

// ─── RAFT CARDS ───────────────────────────────────────────────────────────────
const RAFT_CARDS = [
  {
    letter: "R",
    en_title: "Reconciliation",
    id_title: "Rekonsiliasi",
    nl_title: "Verzoening",
    en_body: "Before you left, did you seek peace with those relationships that were strained? If not, the work still waits — even across distance. Unreconciled relationships travel with you and surface in unexpected places.",
    id_body: "Sebelum Anda pergi, apakah Anda mencari perdamaian dengan hubungan-hubungan yang tegang? Jika tidak, pekerjaan itu masih menunggu — bahkan melintasi jarak. Hubungan yang belum direkonsiliasi ikut bersama Anda dan muncul di tempat-tempat yang tidak terduga.",
    nl_body: "Heb je, voor je vertrok, vrede gezocht in de relaties die gespannen waren? Als dat niet het geval is, wacht het werk nog steeds — zelfs over de afstand. Onverzoende relaties reizen met je mee en duiken op op onverwachte plekken.",
    en_question: "Is there a relationship from your time overseas that you left without resolution? What would one step toward peace look like — even now?",
    id_question: "Apakah ada hubungan dari masa Anda di luar negeri yang Anda tinggalkan tanpa penyelesaian? Seperti apa satu langkah menuju perdamaian — bahkan sekarang?",
    nl_question: "Is er een relatie uit je tijd in het buitenland die je zonder oplossing hebt achtergelaten? Hoe zou één stap richting vrede eruitzien — zelfs nu?",
  },
  {
    letter: "A",
    en_title: "Affirmation",
    id_title: "Peneguhan",
    nl_title: "Bevestiging",
    en_body: "Did you tell the people who shaped you what they meant? Most people leave without closing this loop — and the people left behind carry an unnamed loss. Affirmation is not sentimentality. It is the deliberate act of honouring a person before you go.",
    id_body: "Apakah Anda memberitahu orang-orang yang membentuk Anda apa artinya mereka? Kebanyakan orang pergi tanpa menutup lingkaran ini — dan orang-orang yang ditinggalkan menanggung kehilangan yang tidak disebutkan. Peneguhan bukan sentimentalitas. Itu adalah tindakan yang disengaja untuk menghormati seseorang sebelum Anda pergi.",
    nl_body: "Heb je de mensen die jou hebben gevormd verteld wat ze voor je betekenden? De meeste mensen vertrekken zonder deze lus te sluiten — en de mensen die achterblijven dragen een ongenoemde verlies. Bevestiging is geen sentimentaliteit. Het is de bewuste daad van iemand eren voor je gaat.",
    en_question: "Who are the 3–5 people from your cross-cultural season who most shaped you? Have you told them specifically — not generally — what they gave you?",
    id_question: "Siapa 3–5 orang dari musim lintas budaya Anda yang paling membentuk Anda? Apakah Anda sudah memberitahu mereka secara spesifik — bukan secara umum — apa yang mereka berikan kepada Anda?",
    nl_question: "Wie zijn de 3–5 mensen uit jouw interculturele seizoen die jou het meest hebben gevormd? Heb je hen specifiek — niet algemeen — verteld wat ze jou hebben gegeven?",
  },
  {
    letter: "F",
    en_title: "Farewells",
    id_title: "Perpisahan",
    nl_title: "Afscheid",
    en_body: "Grief that isn't expressed doesn't disappear — it gets stored. Unexpressed farewells become emotional weight you carry into the next season. Saying goodbye to a place, a community, a language, or a rhythm of life is not weakness. It is the evidence that what you had was real.",
    id_body: "Duka yang tidak diungkapkan tidak hilang — itu tersimpan. Perpisahan yang tidak diungkapkan menjadi beban emosional yang Anda bawa ke musim berikutnya. Mengucapkan selamat tinggal pada sebuah tempat, komunitas, bahasa, atau ritme kehidupan bukan kelemahan. Itu adalah bukti bahwa apa yang Anda miliki itu nyata.",
    nl_body: "Verdriet dat niet wordt uitgedrukt verdwijnt niet — het wordt opgeslagen. Niet-uitgesproken afscheiden worden emotionele last die je meeneemt naar het volgende seizoen. Afscheid nemen van een plek, een gemeenschap, een taal of een levensritme is geen zwakte. Het is het bewijs dat wat je had echt was.",
    en_question: "What did you not get to grieve before or during the transition? What do you still carry that hasn't been given its proper goodbye?",
    id_question: "Apa yang tidak bisa Anda berdukacitakan sebelum atau selama transisi? Apa yang masih Anda bawa yang belum mendapatkan perpisahan yang layak?",
    nl_question: "Waarover heb je niet kunnen rouwen voor of tijdens de transitie? Wat draag je nog mee dat geen behoorlijk afscheid heeft gekregen?",
  },
  {
    letter: "T",
    en_title: "Think Ahead",
    id_title: "Persiapkan Masa Depan",
    nl_title: "Vooruitdenken",
    en_body: "The returning well journey has predictable stages. Knowing that Collision is coming — and that it is temporary — changes your relationship to it entirely. Naming the road ahead is not pessimism. It is wisdom that shortens the hard seasons.",
    id_body: "Perjalanan kembali dengan baik memiliki tahapan yang dapat diprediksi. Mengetahui bahwa Benturan akan datang — dan itu sementara — mengubah hubungan Anda dengannya sepenuhnya. Menamai jalan di depan bukan pesimisme. Itu adalah kebijaksanaan yang mempersingkat musim-musim yang berat.",
    nl_body: "De reis van goed terugkeren heeft voorspelbare fasen. Weten dat Botsing komt — en dat het tijdelijk is — verandert je relatie ermee volledig. De weg vooruit benoemen is geen pessimisme. Het is wijsheid die de zware seizoenen verkort.",
    en_question: "Which stage of the journey do you think is hardest for you personally — and what one thing could you put in place now to help when you arrive there?",
    id_question: "Menurut Anda, tahap perjalanan mana yang paling sulit bagi Anda secara pribadi — dan satu hal apa yang bisa Anda siapkan sekarang untuk membantu saat Anda tiba di sana?",
    nl_question: "Welke fase van de reis denk je dat voor jou persoonlijk het moeilijkst is — en wat is één ding dat je nu kunt regelen om te helpen als je daar aankomt?",
  },
];

// ─── REFLECTION STATEMENTS ───────────────────────────────────────────────────
const REFLECTION_STATEMENTS = [
  {
    en: "I have moments of genuine joy in my home culture, but they're followed by guilt — like I shouldn't be enjoying it here.",
    id: "Saya memiliki momen-momen sukacita sejati dalam budaya asal saya, tetapi diikuti oleh rasa bersalah — seolah saya tidak seharusnya menikmatinya di sini.",
    nl: "Ik heb momenten van echte vreugde in mijn thuiscultuur, maar ze worden gevolgd door schuldgevoel — alsof ik het hier niet zou moeten genieten.",
    en_stage: "Adjustment",
    id_stage: "Penyesuaian",
    nl_stage: "Aanpassing",
  },
  {
    en: "People around me assume I'm fine because I look fine. But inside I feel like a stranger in a place that's supposed to be home.",
    id: "Orang-orang di sekitar saya menganggap saya baik-baik saja karena saya terlihat baik-baik saja. Tapi di dalam saya merasa seperti orang asing di tempat yang seharusnya menjadi rumah.",
    nl: "Mensen om me heen nemen aan dat ik prima ben omdat ik er prima uitzie. Maar van binnen voel ik me een vreemdeling op een plek die thuis zou moeten zijn.",
    en_stage: "Collision",
    id_stage: "Benturan",
    nl_stage: "Botsing",
  },
  {
    en: "I find myself constantly comparing my home culture unfavourably to where I came from — the pace, the priorities, the conversations.",
    id: "Saya terus-menerus membandingkan budaya asal saya dengan tidak menguntungkan dibandingkan tempat asal saya — kecepatan, prioritas, percakapan.",
    nl: "Ik vergelijk mijn thuiscultuur voortdurend ongunstig met waar ik vandaan kom — het tempo, de prioriteiten, de gesprekken.",
    en_stage: "Collision",
    id_stage: "Benturan",
    nl_stage: "Botsing",
  },
  {
    en: "There are relationships I left without saying what I needed to say — and I still feel the weight of that.",
    id: "Ada hubungan yang saya tinggalkan tanpa mengatakan apa yang perlu saya katakan — dan saya masih merasakan beratnya itu.",
    nl: "Er zijn relaties die ik heb achtergelaten zonder te zeggen wat ik had moeten zeggen — en ik voel het gewicht daarvan nog steeds.",
    en_stage: "Arrival",
    id_stage: "Kedatangan",
    nl_stage: "Aankomst",
  },
  {
    en: "I can see things in groups and teams that others miss — cross-cultural dynamics, unspoken tensions, misread signals. That feels like a gift now.",
    id: "Saya bisa melihat hal-hal dalam kelompok dan tim yang dilewatkan orang lain — dinamika lintas budaya, ketegangan yang tidak terucapkan, sinyal yang salah dibaca. Itu terasa seperti karunia sekarang.",
    nl: "Ik kan dingen zien in groepen en teams die anderen missen — interculturele dynamieken, onuitgesproken spanningen, verkeerd gelezen signalen. Dat voelt nu als een geschenk.",
    en_stage: "Integration",
    id_stage: "Integrasi",
    nl_stage: "Integratie",
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
type Props = { userPathway: string | null; isSaved: boolean };

export default function ReturningWellClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeStage, setActiveStage] = useState<string>("arrival");
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeRaft, setActiveRaft] = useState<number | null>(null);
  const [reflectionAnswers, setReflectionAnswers] = useState<(boolean | null)[]>(
    Array(REFLECTION_STATEMENTS.length).fill(null)
  );

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("returning-well");
      setSaved(true);
    });
  }

  // JOURNEY_STAGES always has 4 members — activeStage is always a valid id
  // Cast through unknown to strip the | undefined that find() adds
  const currentStage = JOURNEY_STAGES.find((s) => s.id === activeStage) as unknown as {
    id: string; en_title: string; id_title: string; nl_title: string;
    en_timeframe: string; id_timeframe: string; nl_timeframe: string;
    en_tagline: string; id_tagline: string; nl_tagline: string;
    en_vignette: string; id_vignette: string; nl_vignette: string;
    en_feelings: string[]; id_feelings: string[]; nl_feelings: string[];
    en_traps: string[]; id_traps: string[]; nl_traps: string[];
    en_helps: string[]; id_helps: string[]; nl_helps: string[];
    verse_key: string;
  };
  const verseData = activeVerse ? VERSES[activeVerse] : null;

  const answeredCount = reflectionAnswers.filter((a) => a !== null).length;
  const agreedStatements = reflectionAnswers
    .map((a, i) => (a === true ? REFLECTION_STATEMENTS[i] : null))
    .filter(Boolean);

  // Infer stage from agreed statements
  const stageCounts: Record<string, number> = {};
  agreedStatements.forEach((s) => {
    if (s) {
      const stageKey = lang === "en" ? s.en_stage : lang === "id" ? s.id_stage : s.nl_stage;
      stageCounts[stageKey] = (stageCounts[stageKey] ?? 0) + 1;
    }
  });
  const inferredStageRaw = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>

      {/* ── Language Bar ─────────────────────────────────────────────────── */}
      <div style={{
        background: lightGray,
        borderBottom: "1px solid oklch(90% 0.01 80)",
        padding: "10px 24px",
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "4px 14px",
              border: "none",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              background: lang === l ? navy : "transparent",
              color: lang === l ? offWhite : bodyText,
              borderRadius: 3,
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            color: orange,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}>
            {t(
              "Cross-Cultural · Personal Development",
              "Lintas Budaya · Pengembangan Diri",
              "Intercultureel · Persoonlijke Ontwikkeling"
            )}
          </p>
          <h1 style={{
            fontFamily: serif,
            fontSize: "clamp(38px, 5.5vw, 68px)",
            fontWeight: 700,
            color: offWhite,
            margin: "0 auto 28px",
            lineHeight: 1.12,
            fontStyle: "italic",
          }}>
            {t(
              "Returning Well",
              "Kembali dengan Baik",
              "Goed Terugkeren"
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
              "Het leven na intercultureel werk"
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
              "Nobody warns you about this part. You prepared for the cross-cultural move — the language, the culture, the discomfort of being foreign. But nobody told you that coming home can be harder than going. That the country you return to is not the one you left. That you are not the person who left either. This module is for the journey no one prepared you for.",
              "Tidak ada yang memperingatkan Anda tentang bagian ini. Anda mempersiapkan diri untuk perpindahan lintas budaya — bahasa, budaya, ketidaknyamanan menjadi orang asing. Tetapi tidak ada yang memberi tahu Anda bahwa pulang bisa lebih sulit dari pergi. Bahwa negara tempat Anda kembali bukan negara yang Anda tinggalkan. Bahwa Anda juga bukan orang yang pergi itu. Modul ini untuk perjalanan yang tidak disiapkan oleh siapa pun untuk Anda.",
              "Niemand waarschuwt je voor dit deel. Je bereidde je voor op de interculturele verhuizing — de taal, de cultuur, het ongemak van buitenlands zijn. Maar niemand vertelde je dat thuiskomen moeilijker kan zijn dan gaan. Dat het land waarnaar je terugkeert niet het land is dat je verliet. Dat jij ook niet dezelfde persoon bent die vertrok. Deze module is voor de reis waarvoor niemand je heeft voorbereid."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "13px 30px",
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
              {saved
                ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
            <Link
              href="/resources"
              style={{
                padding: "13px 30px",
                border: "1px solid oklch(40% 0.06 260)",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "oklch(78% 0.03 80)",
                textDecoration: "none",
                borderRadius: 4,
                display: "inline-block",
              }}
            >
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Re-entry Explained ───────────────────────────────────────────── */}
      <div style={{ padding: "96px 24px 64px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{
          fontFamily: serif,
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: orange,
          marginBottom: 28,
        }}>
          {t("What Is Re-Entry?", "Apa Itu Kembali ke Tanah Air?", "Wat Is Re-Integratie?")}
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
            "Reverse culture shock is real — and it's often harder than the original",
            "Gegar budaya terbalik itu nyata — dan seringkali lebih berat dari yang pertama",
            "Omgekeerde cultuurschok is echt — en is vaak zwaarder dan het origineel"
          )}
        </h2>
        <div style={{ fontSize: "clamp(16px, 1.9vw, 19px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "When you moved cross-culturally, everyone around you expected it to be difficult. They offered support, sent care packages, checked in. There was a structure of expectation that gave you permission to struggle.",
              "Ketika Anda berpindah secara lintas budaya, semua orang di sekitar Anda mengharapkan itu akan sulit. Mereka menawarkan dukungan, mengirim paket perawatan, memeriksa keadaan Anda. Ada struktur harapan yang memberi Anda izin untuk berjuang.",
              "Toen je intercultureel verhuisde, verwachtten de mensen om je heen dat het moeilijk zou zijn. Ze boden ondersteuning, stuurden pakketjes, informeerden naar je. Er was een verwachtingsstructuur die je toestemming gaf om te worstelen."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "When you come back, no one extends that grace. People assume you are relieved. They assume you are home. What they don't understand — what you may not have understood either — is that re-entry is its own form of culture shock. Researchers call it reverse culture shock, and studies consistently show it is more destabilising than the original adjustment.",
              "Ketika Anda kembali, tidak ada yang memperpanjang anugerah itu. Orang-orang berasumsi Anda lega. Mereka berasumsi Anda sudah di rumah. Apa yang tidak mereka mengerti — apa yang mungkin juga tidak Anda mengerti — adalah bahwa kembali ke tanah air adalah bentuk gegar budaya tersendiri. Para peneliti menyebutnya gegar budaya terbalik, dan studi secara konsisten menunjukkan bahwa itu lebih mengguncang daripada penyesuaian awal.",
              "Als je terugkomt, verlengt niemand die genade. Mensen nemen aan dat je opgelucht bent. Ze nemen aan dat je thuis bent. Wat ze niet begrijpen — wat je zelf misschien ook niet begreep — is dat re-integratie een eigen vorm van cultuurschok is. Onderzoekers noemen het omgekeerde cultuurschok, en studies tonen consistent aan dat het ontregelender is dan de oorspronkelijke aanpassing."
            )}
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
              "You changed. The people you left didn't — at least not in the same direction. The gap between who you became and who they expected you to be is where the collision happens.",
              "Anda berubah. Orang-orang yang Anda tinggalkan tidak berubah — setidaknya tidak ke arah yang sama. Kesenjangan antara siapa yang Anda menjadi dan siapa yang mereka harapkan adalah tempat di mana benturan terjadi.",
              "Jij bent veranderd. De mensen die je achterliet niet — tenminste niet in dezelfde richting. De kloof tussen wie je werd en wie zij verwachtten dat je zou zijn, is waar de botsing plaatsvindt."
            )}
          </blockquote>
          <p style={{ marginBottom: 0 }}>
            {t(
              "This module maps the journey. It names the stages, normalises what you are likely feeling, and gives you practical tools for each phase. It also holds the belief that what happened to you in your cross-cultural years was not wasted — it is a gift still being unwrapped.",
              "Modul ini memetakan perjalanan. Ini menamai tahapan-tahapan, menormalkan apa yang mungkin Anda rasakan, dan memberi Anda alat praktis untuk setiap fase. Ini juga mempertahankan keyakinan bahwa apa yang terjadi pada Anda di tahun-tahun lintas budaya Anda tidak terbuang sia-sia — itu adalah karunia yang masih sedang dibuka.",
              "Deze module brengt de reis in kaart. Het benoemt de fasen, normaliseert wat je waarschijnlijk voelt en geeft je praktische tools voor elke fase. Het draagt ook de overtuiging dat wat er met je is gebeurd in je interculturele jaren niet verspild was — het is een geschenk dat nog steeds wordt uitgepakt."
            )}
          </p>
        </div>
      </div>

      {/* ── Journey Map ──────────────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 0 96px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 20,
            }}>
              {t("The Re-Entry Journey", "Perjalanan Kembali ke Tanah Air", "De Re-Integratiereis")}
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
                "Four stages — and where you might be right now",
                "Empat tahap — dan di mana Anda mungkin berada sekarang",
                "Vier fasen — en waar je je nu misschien bevindt"
              )}
            </h2>
          </div>

          {/* Stage selector — horizontal arc */}
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
              const stageTitle = lang === "en" ? stage.en_title : lang === "id" ? stage.id_title : stage.nl_title;
              const timeframe = lang === "en" ? stage.en_timeframe : lang === "id" ? stage.id_timeframe : stage.nl_timeframe;
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
                    {lang === "en" ? currentStage.en_timeframe : lang === "id" ? currentStage.id_timeframe : currentStage.nl_timeframe}
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
                    {lang === "en" ? currentStage.en_title : lang === "id" ? currentStage.id_title : currentStage.nl_title}
                  </h3>
                  <p style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 20px)",
                    color: "oklch(72% 0.04 260)",
                    fontStyle: "italic",
                    margin: 0,
                  }}>
                    {lang === "en" ? currentStage.en_tagline : lang === "id" ? currentStage.id_tagline : currentStage.nl_tagline}
                  </p>
                </div>
                <button
                  onClick={() => setActiveVerse(currentStage.verse_key)}
                  style={{
                    background: "oklch(30% 0.08 260)",
                    border: "none",
                    borderRadius: 6,
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
                  {t("Faith Anchor", "Jangkar Iman", "Geloofanker")} →
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
                "{lang === "en" ? currentStage.en_vignette : lang === "id" ? currentStage.id_vignette : currentStage.nl_vignette}"
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
                  {t("What You Might Be Feeling", "Yang Mungkin Anda Rasakan", "Wat Je Misschien Voelt")}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(lang === "en" ? currentStage.en_feelings : lang === "id" ? currentStage.id_feelings : currentStage.nl_feelings).map((f, i) => (
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
                  {t("Traps to Watch For", "Jebakan yang Perlu Diwaspadai", "Valkuilen om op te Letten")}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(lang === "en" ? currentStage.en_traps : lang === "id" ? currentStage.id_traps : currentStage.nl_traps).map((trap, i) => (
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
                  {t("What Actually Helps", "Yang Sebenarnya Membantu", "Wat Echt Helpt")}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(lang === "en" ? currentStage.en_helps : lang === "id" ? currentStage.id_helps : currentStage.nl_helps).map((h, i) => (
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
                        {h}
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

      {/* ── The RAFT Model ───────────────────────────────────────────────── */}
      <div style={{ padding: "96px 24px 96px", maxWidth: 960, margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 20,
          }}>
            {t("A Tool for the Transition", "Alat untuk Transisi", "Een Hulpmiddel voor de Transitie")}
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
            {t("The RAFT Model", "Model RAFT", "Het RAFT-model")}
          </h2>
          <p style={{
            fontSize: "clamp(15px, 1.7vw, 17px)",
            color: bodyText,
            lineHeight: 1.8,
            maxWidth: 600,
            margin: "0 auto",
          }}>
            {t(
              "Developed by Dave Pollock and Ruth Van Reken, RAFT is a framework for finishing well — so that what you carry into the next season is freedom, not unfinished weight.",
              "Dikembangkan oleh Dave Pollock dan Ruth Van Reken, RAFT adalah kerangka kerja untuk mengakhiri dengan baik — sehingga apa yang Anda bawa ke musim berikutnya adalah kebebasan, bukan beban yang belum selesai.",
              "Ontwikkeld door Dave Pollock en Ruth Van Reken, is RAFT een raamwerk voor goed afsluiten — zodat wat je meeneemt naar het volgende seizoen vrijheid is, geen onafgemaakte last."
            )}
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
                    {lang === "en" ? card.en_title : lang === "id" ? card.id_title : card.nl_title}
                  </div>
                  <div style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    color: isOpen ? orange : "oklch(60% 0.04 260)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}>
                    {isOpen ? t("click to close", "klik untuk tutup", "klik om te sluiten") : t("click to explore", "klik untuk jelajahi", "klik om te verkennen")}
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
                      {lang === "en" ? card.en_body : lang === "id" ? card.id_body : card.nl_body}
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
                        {t("Reflection Question", "Pertanyaan Refleksi", "Reflectievraag")}
                      </p>
                      <p style={{
                        fontFamily: serif,
                        fontSize: "clamp(15px, 1.7vw, 17px)",
                        color: navy,
                        lineHeight: 1.75,
                        fontStyle: "italic",
                        margin: 0,
                      }}>
                        {lang === "en" ? card.en_question : lang === "id" ? card.id_question : card.nl_question}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Biblical Foundation ──────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 24,
          }}>
            {t("Biblical Foundation", "Dasar Alkitabiah", "Bijbelse Fundering")}
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
              "Re-entry is not a modern problem — it is a biblical one",
              "Kembali ke tanah air bukan masalah modern — itu masalah alkitabiah",
              "Re-integratie is geen modern probleem — het is een bijbels probleem"
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
              {t("Joseph — Genesis 45", "Yusuf — Kejadian 45", "Jozef — Genesis 45")}
            </p>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.85,
              marginBottom: 20,
            }}>
              {t(
                "Joseph spent years in Egypt — as a slave, as a prisoner, as a senior official. He was thoroughly cross-cultural long before that was a category. When his brothers arrived, he had to manage the collision of his two worlds: the boy they remembered, and the man he had become. His weeping was not weakness — it was the natural overflow of a person who had been holding two worlds apart for years, and whose integration finally arrived.",
                "Yusuf menghabiskan bertahun-tahun di Mesir — sebagai budak, sebagai tahanan, sebagai pejabat senior. Ia sepenuhnya lintas budaya jauh sebelum itu menjadi sebuah kategori. Ketika saudara-saudaranya tiba, ia harus mengelola benturan dua dunianya: anak laki-laki yang mereka ingat, dan pria yang ia telah menjadi. Tangisannya bukan kelemahan — itu adalah luapan alami dari seseorang yang telah menahan dua dunia terpisah selama bertahun-tahun, dan integrasinya akhirnya tiba.",
                "Jozef bracht jaren door in Egypte — als slaaf, als gevangene, als hoge ambtenaar. Hij was grondig intercultureel lang voordat dat een categorie was. Toen zijn broers aankwamen, moest hij de botsing van zijn twee werelden beheren: de jongen die ze herinnerden, en de man die hij was geworden. Zijn huilen was geen zwakte — het was de natuurlijke overloopvan iemand die twee werelden jarenlang uit elkaar had gehouden, en wiens integratie eindelijk arriveerde."
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
              {lang === "en" ? VERSES["gen-45-9"].en_ref : lang === "id" ? VERSES["gen-45-9"].id_ref : VERSES["gen-45-9"].nl_ref}
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
              {t("Ruth — A stranger returning to a stranger's land", "Rut — Orang asing yang kembali ke tanah orang asing", "Ruth — Een vreemdeling die terugkeert naar een vreemd land")}
            </p>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.85,
              marginBottom: 20,
            }}>
              {t(
                "Ruth's story is the inverse of re-entry — she chose to enter a foreign culture permanently, leaving everything familiar behind. But her experience mirrors what returning cross-cultural workers feel: the grief of leaving a people she loved, the courage of committing fully to a new place, the slow and costly work of being known as a foreigner in the place you now call home. What she modelled — wholehearted commitment in the face of complete uncertainty — is the same posture integration asks of you.",
                "Kisah Rut adalah kebalikan dari kembali ke tanah air — ia memilih untuk masuk ke budaya asing secara permanen, meninggalkan semua yang familiar. Tetapi pengalamannya mencerminkan apa yang dirasakan oleh pekerja lintas budaya yang kembali: duka karena meninggalkan orang-orang yang ia cintai, keberanian untuk berkomitmen sepenuhnya pada tempat baru, pekerjaan yang lambat dan mahal untuk dikenal sebagai orang asing di tempat yang sekarang Anda sebut rumah. Apa yang ia contohkan — komitmen sepenuh hati dalam menghadapi ketidakpastian total — adalah postur yang sama yang diminta integrasi dari Anda.",
                "Het verhaal van Ruth is het omgekeerde van re-integratie — ze koos ervoor permanent een vreemde cultuur binnen te gaan, alles vertrouwds achterlatend. Maar haar ervaring weerspiegelt wat terugkerende interculturele werkers voelen: het verdriet van het verlaten van mensen van wie ze hield, de moed om zich volledig te committeren aan een nieuwe plek, het langzame en kostbare werk van gekend worden als buitenlander op de plek die je nu thuis noemt. Wat ze modelleerde — wholehearted inzet in het aangezicht van totale onzekerheid — is dezelfde houding die integratie van jou vraagt."
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
              {lang === "en" ? VERSES["ruth-1-16"].en_ref : lang === "id" ? VERSES["ruth-1-16"].id_ref : VERSES["ruth-1-16"].nl_ref}
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
                "The grief of re-entry is not a sign that something has gone wrong. It is a sign that something was real. Psalm 126 holds both realities — 'those who sow with tears will reap with songs of joy.' The sowing and the harvest are not separate stories. They are one story, told across time.",
                "Duka dari kembali ke tanah air bukan tanda bahwa sesuatu telah salah. Itu tanda bahwa sesuatu itu nyata. Mazmur 126 mempertahankan kedua realitas — 'orang-orang yang menabur dengan mencucurkan air mata, akan menuai dengan bersorak-sorai.' Penabur dan panen bukan cerita yang terpisah. Mereka adalah satu cerita, diceritakan sepanjang waktu.",
                "Het verdriet van re-integratie is geen teken dat er iets mis is gegaan. Het is een teken dat iets echt was. Psalm 126 houdt beide realiteiten vast — 'wie in tranen zaaien, zullen oogsten met gejuich.' Het zaaien en de oogst zijn geen afzonderlijke verhalen. Ze zijn één verhaal, verteld over de tijd."
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
              {lang === "en" ? VERSES["ps-126-5"].en_ref : lang === "id" ? VERSES["ps-126-5"].id_ref : VERSES["ps-126-5"].nl_ref}
            </button>
          </div>
        </div>
      </div>

      {/* ── Where Are You Right Now? ─────────────────────────────────────── */}
      <div style={{ padding: "96px 24px 96px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: serif,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: orange,
              marginBottom: 20,
            }}>
              {t("Self-Assessment", "Penilaian Diri", "Zelfbeoordeling")}
            </p>
            <h2 style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: navy,
              lineHeight: 1.18,
              fontStyle: "italic",
              marginBottom: 16,
            }}>
              {t("Where are you right now?", "Di mana Anda berada sekarang?", "Waar ben je nu?")}
            </h2>
            <p style={{
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: bodyText,
              lineHeight: 1.8,
              maxWidth: 520,
              margin: "0 auto",
            }}>
              {t(
                "Read each statement. Mark whether it resonates with where you are today.",
                "Baca setiap pernyataan. Tandai apakah itu beresonansi dengan posisi Anda hari ini.",
                "Lees elke uitspraak. Markeer of het resoneert met waar je vandaag bent."
              )}
            </p>
          </div>

          {/* Statements */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REFLECTION_STATEMENTS.map((stmt, i) => {
              const answer = reflectionAnswers[i];
              return (
                <div key={i} style={{
                  background: answer === true ? "oklch(94% 0.01 155 / 0.5)" : answer === false ? lightGray : offWhite,
                  border: answer === true
                    ? "1px solid oklch(70% 0.1 155)"
                    : answer === false
                    ? "1px solid oklch(88% 0.01 80)"
                    : `1px solid oklch(88% 0.01 80)`,
                  borderRadius: 10,
                  padding: "24px 28px",
                  transition: "background 0.2s, border 0.2s",
                }}>
                  <p style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 19px)",
                    color: navy,
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    margin: "0 0 16px",
                  }}>
                    "{lang === "en" ? stmt.en : lang === "id" ? stmt.id : stmt.nl}"
                  </p>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button
                      onClick={() => {
                        const updated = [...reflectionAnswers];
                        updated[i] = answer === true ? null : true;
                        setReflectionAnswers(updated);
                      }}
                      style={{
                        padding: "7px 20px",
                        border: `1px solid ${answer === true ? "oklch(50% 0.12 155)" : "oklch(80% 0.02 260)"}`,
                        borderRadius: 4,
                        background: answer === true ? "oklch(50% 0.12 155)" : "transparent",
                        color: answer === true ? offWhite : bodyText,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {t("This is me", "Ini saya", "Dit ben ik")}
                    </button>
                    <button
                      onClick={() => {
                        const updated = [...reflectionAnswers];
                        updated[i] = answer === false ? null : false;
                        setReflectionAnswers(updated);
                      }}
                      style={{
                        padding: "7px 20px",
                        border: `1px solid oklch(80% 0.02 260)`,
                        borderRadius: 4,
                        background: answer === false ? lightGray : "transparent",
                        color: bodyText,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {t("Not yet", "Belum", "Nog niet")}
                    </button>
                    {answer === true && (
                      <span style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: orange,
                        marginLeft: 8,
                      }}>
                        {lang === "en" ? stmt.en_stage : lang === "id" ? stmt.id_stage : stmt.nl_stage}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inferred stage result */}
          {answeredCount >= 3 && inferredStageRaw && (
            <div style={{
              marginTop: 40,
              background: navy,
              borderRadius: 12,
              padding: "36px 40px",
            }}>
              <p style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: orange,
                marginBottom: 16,
              }}>
                {t("Based on your responses", "Berdasarkan respons Anda", "Op basis van je antwoorden")}
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 22px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.75,
                marginBottom: 20,
              }}>
                {t(
                  `You seem to be in the ${inferredStageRaw} stage of re-entry. That's valuable information — not to label you, but to give you permission to be exactly where you are.`,
                  `Anda tampaknya berada di tahap ${inferredStageRaw} dari kembali ke tanah air. Itu informasi yang berharga — bukan untuk memberi label Anda, tetapi untuk memberi Anda izin menjadi tepat di mana Anda berada.`,
                  `Je lijkt je in de ${inferredStageRaw}-fase van re-integratie te bevinden. Dat is waardevolle informatie — niet om je te labelen, maar om je toestemming te geven precies te zijn waar je bent.`
                )}
              </p>
              <button
                onClick={() => {
                  const stageMap: Record<string, string> = {
                    "Arrival": "arrival", "Kedatangan": "arrival", "Aankomst": "arrival",
                    "Collision": "collision", "Benturan": "collision", "Botsing": "collision",
                    "Adjustment": "adjustment", "Penyesuaian": "adjustment", "Aanpassing": "adjustment",
                    "Integration": "integration", "Integrasi": "integration", "Integratie": "integration",
                  };
                  const stageId = stageMap[inferredStageRaw];
                  if (stageId) {
                    setActiveStage(stageId);
                    document.getElementById("journey-map-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  padding: "11px 26px",
                  background: orange,
                  border: "none",
                  borderRadius: 4,
                  color: offWhite,
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                {t(
                  `See what helps in the ${inferredStageRaw} stage →`,
                  `Lihat apa yang membantu di tahap ${inferredStageRaw} →`,
                  `Zie wat helpt in de ${inferredStageRaw}-fase →`
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Close — The Gift ─────────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: serif,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: orange,
            marginBottom: 24,
          }}>
            {t("A Final Word", "Kata Akhir", "Een Laatste Woord")}
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(26px, 3.2vw, 40px)",
            fontWeight: 700,
            color: navy,
            lineHeight: 1.2,
            fontStyle: "italic",
            marginBottom: 32,
          }}>
            {t(
              "Your cross-cultural years are not behind you — they are inside you",
              "Tahun-tahun lintas budaya Anda bukan di belakang Anda — itu ada di dalam Anda",
              "Je interculturele jaren liggen niet achter je — ze zitten in je"
            )}
          </h2>
          <p style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 20px)",
            color: bodyText,
            lineHeight: 1.9,
            marginBottom: 32,
          }}>
            {t(
              "There will come a day — probably not yet, but it will come — when what you carry from those years is the most useful thing in the room. When you can see what others can't. When your fluency in discomfort becomes someone else's safety. When your theology of grief becomes a lifeline for someone just arriving where you have been. That is integration. And it is worth the long road to get there.",
              "Akan datang suatu hari — mungkin belum sekarang, tetapi akan datang — ketika apa yang Anda bawa dari tahun-tahun itu adalah hal paling berguna di ruangan. Ketika Anda bisa melihat apa yang tidak bisa dilihat orang lain. Ketika kemahiran Anda dalam ketidaknyamanan menjadi keamanan orang lain. Ketika teologi kesedihan Anda menjadi tali penyelamat bagi seseorang yang baru tiba di tempat yang pernah Anda jalani. Itulah integrasi. Dan itu layak diperjuangkan melalui jalan yang panjang.",
              "Er zal een dag komen — waarschijnlijk nog niet, maar hij zal komen — waarop wat je uit die jaren meeneemt het meest nuttige in de kamer is. Wanneer je kunt zien wat anderen niet kunnen. Wanneer jouw vloeiendheid in ongemak iemands anders veiligheid wordt. Wanneer jouw theologie van verdriet een reddingslijn wordt voor iemand die net aankomt waar jij bent geweest. Dat is integratie. En het is de lange weg waard."
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
            {lang === "en" ? VERSES["isa-43-18"].en_ref : lang === "id" ? VERSES["isa-43-18"].id_ref : VERSES["isa-43-18"].nl_ref}
          </button>
        </div>
      </div>

      {/* ── Footer nav ───────────────────────────────────────────────────── */}
      <div style={{
        padding: "48px 24px",
        background: offWhite,
        borderTop: `1px solid oklch(90% 0.01 80)`,
        display: "flex",
        gap: 16,
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        <button
          onClick={handleSave}
          disabled={saved || isPending}
          style={{
            padding: "12px 28px",
            border: "none",
            cursor: saved ? "default" : "pointer",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            background: saved ? "oklch(35% 0.05 260)" : navy,
            color: offWhite,
            letterSpacing: "0.04em",
            borderRadius: 4,
          }}
        >
          {saved
            ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard")
            : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
        </button>
        <Link
          href="/resources"
          style={{
            padding: "12px 28px",
            border: `1px solid oklch(80% 0.02 260)`,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: bodyText,
            textDecoration: "none",
            borderRadius: 4,
            display: "inline-block",
          }}
        >
          {t("All Resources", "Semua Sumber", "Alle Bronnen")}
        </Link>
        <Link
          href="/resources/healthy-transitions"
          style={{
            padding: "12px 28px",
            border: `1px solid oklch(80% 0.02 260)`,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: bodyText,
            textDecoration: "none",
            borderRadius: 4,
            display: "inline-block",
          }}
        >
          {t("Related: Healthy Transitions →", "Terkait: Transisi yang Sehat →", "Gerelateerd: Gezonde Transities →")}
        </Link>
      </div>

      {/* ── Verse Modal ──────────────────────────────────────────────────── */}
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
              "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.nl}"
            </p>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: orange,
              letterSpacing: "0.08em",
              marginBottom: 28,
            }}>
              — {lang === "en" ? verseData.en_ref : lang === "id" ? verseData.id_ref : verseData.nl_ref}{" "}
              <span style={{ fontWeight: 400, color: bodyText }}>
                ({lang === "en" ? "NIV" : lang === "id" ? "TB" : "NBV"})
              </span>
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "11px 28px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 6,
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
