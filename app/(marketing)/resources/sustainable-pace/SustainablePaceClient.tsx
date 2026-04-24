"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

// ── TYPES & LANG ──────────────────────────────────────────────────────────────
type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ── BRAND TOKENS ──────────────────────────────────────────────────────────────
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(97% 0.005 80)";
const lightGray = "oklch(95% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const serif    = "Cormorant Garamond, Georgia, serif";

// ── VERSE DATA ────────────────────────────────────────────────────────────────
const VERSES = {
  "mark-1-35": {
    en_ref: "Mark 1:35", id_ref: "Markus 1:35", nl_ref: "Marcus 1:35",
    en: "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
    id: "Pagi-pagi benar, waktu hari masih gelap, Ia bangun dan pergi ke luar. Ia pergi ke tempat yang sunyi dan berdoa di sana.",
    nl: "Vroeg in de ochtend, toen het nog donker was, stond hij op en ging naar buiten. Hij liep naar een eenzame plek en bad daar.",
  },
  "ps-23-2-3": {
    en_ref: "Psalm 23:2–3", id_ref: "Mazmur 23:2–3", nl_ref: "Psalm 23:2–3",
    en: "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    id: "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku.",
    nl: "Hij laat mij rusten in groene weiden en voert mij naar vredig water, hij geeft mij nieuwe kracht.",
  },
};

// ── FIVE SPHERES DATA (O'Donnell Model) ──────────────────────────────────────
type SphereKey = "master" | "self" | "mutual" | "sender" | "specialist";

const SPHERES: {
  key: SphereKey;
  level: number;
  en_title: string; id_title: string; nl_title: string;
  en_subtitle: string; id_subtitle: string; nl_subtitle: string;
  en_desc: string; id_desc: string; nl_desc: string;
  en_examples: string[]; id_examples: string[]; nl_examples: string[];
  en_question: string; id_question: string; nl_question: string;
  color: string;
}[] = [
  {
    key: "master",
    level: 1,
    en_title: "Master Care",
    id_title: "Pemeliharaan Ilahi",
    nl_title: "Goddelijke Zorg",
    en_subtitle: "God's care for you",
    id_subtitle: "Pemeliharaan Tuhan untuk Anda",
    nl_subtitle: "Gods zorg voor jou",
    en_desc: "The foundation of everything. God is not a supervisor tracking your output — he is the shepherd who actively leads you to rest and restores your soul. Before you build any structure, you must believe that God's care for you is not contingent on your performance. He cares for the vessel, not just the mission.",
    id_desc: "Fondasi dari segalanya. Tuhan bukan pengawas yang melacak output Anda — Ia adalah gembala yang secara aktif memimpin Anda ke tempat istirahat dan memulihkan jiwa Anda. Sebelum Anda membangun struktur apapun, Anda harus percaya bahwa pemeliharaan Tuhan terhadap Anda tidak tergantung pada kinerja Anda. Ia merawat bejana, bukan hanya misi.",
    nl_desc: "De basis van alles. God is geen supervisor die je output bijhoudt — hij is de herder die je actief naar rust leidt en je ziel herstelt. Voordat je enige structuur opbouwt, moet je geloven dat Gods zorg voor jou niet afhankelijk is van je prestaties. Hij zorgt voor het vat, niet alleen de missie.",
    en_examples: ["Daily communion with God — not as duty but as source", "Prayer as honest conversation, not performance", "Trusting that God holds the mission when you step away", "Reading Scripture as nourishment, not information"],
    id_examples: ["Persekutuan harian dengan Tuhan — bukan sebagai kewajiban tetapi sebagai sumber", "Doa sebagai percakapan jujur, bukan pertunjukan", "Mempercayai bahwa Tuhan memegang misi ketika Anda beristirahat", "Membaca Kitab Suci sebagai makanan rohani, bukan informasi"],
    nl_examples: ["Dagelijkse gemeenschap met God — niet als plicht maar als bron", "Gebed als eerlijk gesprek, niet als prestatie", "Vertrouwen dat God de missie vasthoudt als jij even stopt", "Schrift lezen als voeding, niet als informatie"],
    en_question: "When did you last come to God without an agenda — just to be with him?",
    id_question: "Kapan terakhir kali Anda datang kepada Tuhan tanpa agenda — hanya untuk bersama dengan-Nya?",
    nl_question: "Wanneer ben je voor het laatst naar God gegaan zonder agenda — gewoon om bij hem te zijn?",
    color: "oklch(55% 0.14 290)",
  },
  {
    key: "self",
    level: 2,
    en_title: "Self-Care",
    id_title: "Perawatan Diri",
    nl_title: "Zelfzorg",
    en_subtitle: "Your personal health architecture",
    id_subtitle: "Arsitektur kesehatan pribadi Anda",
    nl_subtitle: "Je persoonlijke gezondheidsarchitectuur",
    en_desc: "Self-care is not indulgence — it is stewardship. You are the instrument God has chosen to use. The way you manage your body, mind, and spirit directly determines your capacity to love others and lead well. Neglect here is not humility; it is poor stewardship of a resource that belongs to God.",
    id_desc: "Perawatan diri bukan kemewahan — itu adalah penatalayanan. Anda adalah instrumen yang dipilih Tuhan untuk digunakan. Cara Anda mengelola tubuh, pikiran, dan roh secara langsung menentukan kapasitas Anda untuk mengasihi orang lain dan memimpin dengan baik. Mengabaikan hal ini bukan kerendahan hati; itu adalah penatalayanan yang buruk atas sumber daya yang menjadi milik Tuhan.",
    nl_desc: "Zelfzorg is geen verwennerij — het is rentmeesterschap. Jij bent het instrument dat God heeft gekozen om te gebruiken. De manier waarop je je lichaam, geest en ziel beheert, bepaalt direct je vermogen om anderen lief te hebben en goed te leiden. Verwaarlozing hier is geen bescheidenheid; het is slecht rentmeesterschap van een middel dat aan God toebehoort.",
    en_examples: ["Consistent sleep (7–8 hours) as a non-negotiable", "Physical movement — whatever fits your context and body", "Mental rest: time without inputs, screens, or demands", "Emotional awareness: naming what you're carrying"],
    id_examples: ["Tidur yang konsisten (7–8 jam) sebagai hal yang tidak bisa ditawar", "Gerak fisik — apapun yang sesuai dengan konteks dan tubuh Anda", "Istirahat mental: waktu tanpa masukan, layar, atau tuntutan", "Kesadaran emosional: menamakan apa yang Anda tanggung"],
    nl_examples: ["Consistent slapen (7–8 uur) als niet-onderhandelbaar", "Lichamelijke beweging — wat ook bij jouw context en lichaam past", "Mentale rust: tijd zonder input, schermen of eisen", "Emotioneel bewustzijn: benoemen wat je draagt"],
    en_question: "Which of the three — body, mind, or spirit — is most depleted for you right now?",
    id_question: "Di antara ketiganya — tubuh, pikiran, atau roh — mana yang paling terkuras bagi Anda saat ini?",
    nl_question: "Welke van de drie — lichaam, geest of ziel — is voor jou nu het meest uitgeput?",
    color: orange,
  },
  {
    key: "mutual",
    level: 3,
    en_title: "Mutual Care",
    id_title: "Perawatan Bersama",
    nl_title: "Wederzijdse Zorg",
    en_subtitle: "Teammates who know the real weight",
    id_subtitle: "Rekan tim yang mengenal beban nyata",
    nl_subtitle: "Teamgenoten die het echte gewicht kennen",
    en_desc: "The people you work alongside are not just colleagues — they are potential co-sustainers. Mutual care happens when teammates hold one another's burdens, tell each other the truth, and create space to be human. It requires intentionality: in high-performance cultures, this care is often the first casualty of busyness.",
    id_desc: "Orang-orang yang bekerja bersama Anda bukan sekadar rekan kerja — mereka adalah pemelihara bersama yang potensial. Perawatan bersama terjadi ketika anggota tim saling menanggung beban satu sama lain, saling mengatakan kebenaran, dan menciptakan ruang untuk menjadi manusia. Ini membutuhkan kesengajaan: dalam budaya berkinerja tinggi, perawatan ini sering menjadi korban pertama dari kesibukan.",
    nl_desc: "De mensen met wie je samenwerkt zijn niet zomaar collega's — ze zijn potentiële mede-dragers. Wederzijdse zorg vindt plaats wanneer teamleden elkaars lasten dragen, elkaar de waarheid vertellen en ruimte scheppen om mens te zijn. Het vraagt intentionaliteit: in prestatiegerichte culturen is deze zorg vaak het eerste slachtoffer van drukte.",
    en_examples: ["Regular honest check-ins with a trusted peer — not just task updates", "Permission to name fatigue without it being seen as weakness", "Cross-cultural teams: acknowledge that care languages differ", "Celebrating wins together, not just pushing through to the next challenge"],
    id_examples: ["Check-in jujur secara teratur dengan rekan yang dipercaya — bukan hanya pembaruan tugas", "Izin untuk mengungkapkan kelelahan tanpa dianggap sebagai kelemahan", "Tim lintas budaya: akui bahwa bahasa kepedulian berbeda-beda", "Merayakan kemenangan bersama, bukan hanya terus mendorong ke tantangan berikutnya"],
    nl_examples: ["Regelmatige eerlijke check-ins met een vertrouwde collega — niet alleen taakinformatie", "Toestemming om vermoeidheid te benoemen zonder dat het als zwakte wordt gezien", "Interculturele teams: erken dat zorgstijlen verschillen", "Successen samen vieren, niet alleen doorgaan naar de volgende uitdaging"],
    en_question: "Who on your team knows when you are struggling — and do they feel safe enough to tell you the same?",
    id_question: "Siapa di tim Anda yang tahu ketika Anda sedang berjuang — dan apakah mereka cukup aman untuk memberitahu Anda hal yang sama?",
    nl_question: "Wie in jouw team weet wanneer jij het moeilijk hebt — en voelen zij zich veilig genoeg om jou hetzelfde te vertellen?",
    color: "oklch(52% 0.16 165)",
  },
  {
    key: "sender",
    level: 4,
    en_title: "Sender Care",
    id_title: "Perawatan dari Pengirim",
    nl_title: "Zenderzorg",
    en_subtitle: "Your agency, church, or organisation",
    id_subtitle: "Lembaga, gereja, atau organisasi Anda",
    nl_subtitle: "Jouw organisatie, kerk of zendende gemeenschap",
    en_desc: "Sustainable leaders need a sending community that actively invests in their wellbeing — not just their output. This includes adequate financial support, regular pastoral check-ins, accountability structures, and genuine interest in your personal flourishing. If this is missing or broken, that is a structural problem requiring structural solution — not just more personal resilience.",
    id_desc: "Pemimpin yang berkelanjutan membutuhkan komunitas pengirim yang secara aktif berinvestasi dalam kesejahteraan mereka — bukan hanya output mereka. Ini termasuk dukungan keuangan yang memadai, check-in pastoral yang teratur, struktur akuntabilitas, dan minat sejati dalam pertumbuhan pribadi Anda. Jika ini hilang atau rusak, itu adalah masalah struktural yang memerlukan solusi struktural — bukan hanya lebih banyak ketahanan pribadi.",
    nl_desc: "Duurzame leiders hebben een zendende gemeenschap nodig die actief investeert in hun welzijn — niet alleen in hun output. Dit omvat adequate financiële steun, regelmatige pastorale check-ins, verantwoordelijkheidsstructuren en oprechte interesse in je persoonlijke bloei. Als dit ontbreekt of stuk is, is dat een structureel probleem dat een structurele oplossing vereist — niet alleen meer persoonlijke weerbaarheid.",
    en_examples: ["Annual review conversations that include wellbeing, not just performance", "Financial support that removes economic stress", "A pastor or mentor who knows your personal situation", "Clear re-entry support and debriefing after difficult seasons"],
    id_examples: ["Percakapan tinjauan tahunan yang mencakup kesejahteraan, bukan hanya kinerja", "Dukungan keuangan yang menghilangkan tekanan ekonomi", "Seorang pendeta atau mentor yang mengenal situasi pribadi Anda", "Dukungan kepulangan dan debriefing yang jelas setelah musim-musim yang sulit"],
    nl_examples: ["Jaarlijkse gesprekken die ook welzijn bespreken, niet alleen prestaties", "Financiële steun die economische stress wegneemt", "Een pastor of mentor die je persoonlijke situatie kent", "Duidelijke ondersteuning bij terugkeer en debriefing na zware seizoenen"],
    en_question: "Does your sending organisation know how you are really doing — and do they have structures to respond to what you tell them?",
    id_question: "Apakah organisasi pengirim Anda mengetahui keadaan Anda yang sebenarnya — dan apakah mereka memiliki struktur untuk merespons apa yang Anda katakan?",
    nl_question: "Weet jouw zendende organisatie hoe het echt met je gaat — en hebben ze structuren om te reageren op wat je hen vertelt?",
    color: "oklch(50% 0.14 220)",
  },
  {
    key: "specialist",
    level: 5,
    en_title: "Specialist Care",
    id_title: "Perawatan Spesialis",
    nl_title: "Specialistische Zorg",
    en_subtitle: "Professional support when you need it",
    id_subtitle: "Dukungan profesional saat Anda membutuhkannya",
    nl_subtitle: "Professionele ondersteuning wanneer je dat nodig hebt",
    en_desc: "There are moments when the weight you carry requires more than a good friend, a caring team, or a supportive organisation. Professional care — a counsellor, therapist, psychologist, doctor, or spiritual director — is not a sign of failure. It is the wise use of a resource God has provided. In many cross-cultural contexts, seeking specialist care carries stigma. That stigma costs lives and ministries.",
    id_desc: "Ada saat-saat ketika beban yang Anda tanggung membutuhkan lebih dari sekadar teman yang baik, tim yang peduli, atau organisasi yang mendukung. Perawatan profesional — konselor, terapis, psikolog, dokter, atau direktur spiritual — bukan tanda kegagalan. Itu adalah penggunaan bijak dari sumber daya yang telah Tuhan sediakan. Dalam banyak konteks lintas budaya, mencari perawatan spesialis membawa stigma. Stigma itu merugikan kehidupan dan pelayanan.",
    nl_desc: "Er zijn momenten dat het gewicht dat je draagt meer vereist dan een goede vriend, een zorgzaam team of een ondersteunende organisatie. Professionele zorg — een counselor, therapeut, psycholoog, arts of geestelijk begeleider — is geen teken van falen. Het is het wijze gebruik van een middel dat God heeft verschaft. In veel interculturele contexten draagt het zoeken naar specialistische zorg stigma. Dat stigma kost levens en bedieningen.",
    en_examples: ["Regular counselling or therapy — preventive, not just crisis response", "Medical check-ups, including mental health screening", "A spiritual director who provides structured reflection", "Crisis debriefing after traumatic field experiences"],
    id_examples: ["Konseling atau terapi teratur — preventif, bukan hanya respons krisis", "Pemeriksaan kesehatan rutin, termasuk skrining kesehatan mental", "Seorang direktur spiritual yang memberikan refleksi terstruktur", "Debriefing krisis setelah pengalaman lapangan yang traumatis"],
    nl_examples: ["Regelmatige counseling of therapie — preventief, niet alleen crisisrespons", "Medische check-ups, inclusief screening van geestelijke gezondheid", "Een geestelijk begeleider die gestructureerde reflectie biedt", "Crisisopvang na traumatische ervaringen in het veld"],
    en_question: "Is there something you are currently carrying that would benefit from a professional conversation — and what is stopping you from seeking it?",
    id_question: "Apakah ada sesuatu yang saat ini Anda tanggung yang akan mendapat manfaat dari percakapan profesional — dan apa yang menghalangi Anda untuk mencarinya?",
    nl_question: "Is er iets wat je nu draagt dat baat zou hebben bij een professioneel gesprek — en wat weerhoudt je ervan om dat te zoeken?",
    color: "oklch(48% 0.14 250)",
  },
];

// ── STRESS AUDIT DATA ─────────────────────────────────────────────────────────
const STRESS_AREAS: {
  key: string;
  icon: string;
  en_label: string; id_label: string; nl_label: string;
  en_low: string; id_low: string; nl_low: string;
  en_high: string; id_high: string; nl_high: string;
}[] = [
  {
    key: "work-pace",
    icon: "⚡",
    en_label: "Work Pace",
    id_label: "Kecepatan Kerja",
    nl_label: "Werktempo",
    en_low: "Overwhelmed, unsustainable, no margin",
    id_low: "Kewalahan, tidak berkelanjutan, tidak ada ruang gerak",
    nl_low: "Overweldigd, onhoudbaar, geen marge",
    en_high: "Manageable, margin present, pace feels right",
    id_high: "Dapat dikelola, ada ruang gerak, kecepatan terasa tepat",
    nl_high: "Beheersbaar, marge aanwezig, tempo voelt goed",
  },
  {
    key: "physical",
    icon: "🏃",
    en_label: "Physical Health",
    id_label: "Kesehatan Fisik",
    nl_label: "Lichamelijke Gezondheid",
    en_low: "Exhausted, unwell, neglecting body",
    id_low: "Kelelahan, tidak sehat, mengabaikan tubuh",
    nl_low: "Uitgeput, ziek, lichaam verwaarlozen",
    en_high: "Energised, sleeping well, moving regularly",
    id_high: "Berenergi, tidur nyenyak, bergerak secara teratur",
    nl_high: "Energiek, goed slapend, regelmatig in beweging",
  },
  {
    key: "spiritual",
    icon: "✝",
    en_label: "Spiritual Depth",
    id_label: "Kedalaman Rohani",
    nl_label: "Geestelijke Diepte",
    en_low: "Going through the motions, spiritually dry",
    id_low: "Menjalani rutinitas, kering secara rohani",
    nl_low: "Routine, geestelijk droog",
    en_high: "Alive in faith, connected to God, nourished",
    id_high: "Hidup dalam iman, terhubung dengan Tuhan, terpelihara",
    nl_high: "Levendig in geloof, verbonden met God, gevoed",
  },
  {
    key: "relationships",
    icon: "🤝",
    en_label: "Key Relationships",
    id_label: "Hubungan Utama",
    nl_label: "Sleutelrelaties",
    en_low: "Isolated, strained, or surface-level only",
    id_low: "Terisolasi, tegang, atau hanya di permukaan",
    nl_low: "Geïsoleerd, gespannen of alleen oppervlakkig",
    en_high: "Connected, honest, genuinely supported",
    id_high: "Terhubung, jujur, didukung dengan tulus",
    nl_high: "Verbonden, eerlijk, oprecht ondersteund",
  },
  {
    key: "finances",
    icon: "💰",
    en_label: "Financial Stability",
    id_label: "Stabilitas Keuangan",
    nl_label: "Financiële Stabiliteit",
    en_low: "Chronic stress, uncertainty, under-resourced",
    id_low: "Stres kronis, ketidakpastian, kurang sumber daya",
    nl_low: "Chronische stress, onzekerheid, onvoldoende middelen",
    en_high: "Stable, needs met, future is manageable",
    id_high: "Stabil, kebutuhan terpenuhi, masa depan dapat dikelola",
    nl_high: "Stabiel, behoeften vervuld, toekomst beheersbaar",
  },
  {
    key: "family",
    icon: "🏠",
    en_label: "Family Health",
    id_label: "Kesehatan Keluarga",
    nl_label: "Gezinsgezondheid",
    en_low: "Neglected, strained, tension at home",
    id_low: "Terabaikan, tegang, ketegangan di rumah",
    nl_low: "Verwaarloosd, gespannen, spanning thuis",
    en_high: "Present, connected, family thriving",
    id_high: "Hadir, terhubung, keluarga berkembang",
    nl_high: "Aanwezig, verbonden, gezin bloeit",
  },
  {
    key: "purpose",
    icon: "🧭",
    en_label: "Sense of Purpose",
    id_label: "Rasa Tujuan",
    nl_label: "Gevoel van Roeping",
    en_low: "Disconnected, questioning, going through motions",
    id_low: "Terputus, mempertanyakan, hanya menjalani rutinitas",
    nl_low: "Losgeraakt, twijfelend, routine draaien",
    en_high: "Clear calling, meaningful work, motivated",
    id_high: "Panggilan jelas, pekerjaan bermakna, termotivasi",
    nl_high: "Heldere roeping, zinvol werk, gemotiveerd",
  },
  {
    key: "emotional",
    icon: "💬",
    en_label: "Emotional Processing",
    id_label: "Pemrosesan Emosi",
    nl_label: "Emotionele Verwerking",
    en_low: "Suppressing, numbing, unprocessed weight",
    id_low: "Menekan, mematikan rasa, beban yang belum diproses",
    nl_low: "Onderdrukken, verdoven, onverwerkt gewicht",
    en_high: "Naming feelings, processing well, emotionally honest",
    id_high: "Menamakan perasaan, memproses dengan baik, jujur secara emosional",
    nl_high: "Gevoelens benoemen, goed verwerken, emotioneel eerlijk",
  },
  {
    key: "creative",
    icon: "🎨",
    en_label: "Creative Expression",
    id_label: "Ekspresi Kreatif",
    nl_label: "Creatieve Expressie",
    en_low: "None, dried up, no outlet",
    id_low: "Tidak ada, mengering, tidak ada saluran ekspresi",
    nl_low: "Geen, opgedroogd, geen uitlaatklep",
    en_high: "Regular creative outlet, making, exploring",
    id_high: "Saluran kreatif yang teratur, berkreasi, menjelajahi",
    nl_high: "Regelmatige creatieve uitlaatklep, maken, verkennen",
  },
  {
    key: "rest",
    icon: "🌙",
    en_label: "Regular Rest",
    id_label: "Istirahat Teratur",
    nl_label: "Regelmatige Rust",
    en_low: "No Sabbath, no genuine rest, always on",
    id_low: "Tidak ada Sabat, tidak ada istirahat sejati, selalu aktif",
    nl_low: "Geen Sabbat, geen echte rust, altijd aan",
    en_high: "Protected rest rhythms, genuine offline time",
    id_high: "Ritme istirahat yang terlindungi, waktu offline yang sejati",
    nl_high: "Beschermde rustritmes, echte offline-tijd",
  },
];

// ── HABITS DATA ───────────────────────────────────────────────────────────────
const HABIT_CATEGORIES: {
  key: string;
  en_title: string; id_title: string; nl_title: string;
  en_tagline: string; id_tagline: string; nl_tagline: string;
  en_desc: string; id_desc: string; nl_desc: string;
  habits: {
    en: string; id: string; nl: string;
  }[];
  color: string;
  icon: string;
}[] = [
  {
    key: "body",
    icon: "🏃",
    color: "oklch(52% 0.16 145)",
    en_title: "Body",
    id_title: "Tubuh",
    nl_title: "Lichaam",
    en_tagline: "Your physical instrument",
    id_tagline: "Instrumen fisik Anda",
    nl_tagline: "Jouw fysieke instrument",
    en_desc: "Your body is not separate from your ministry — it is the medium through which all of it happens. Leaders who neglect their physical health are not more sacrificial. They are less sustainable. Treat your body as the instrument it is.",
    id_desc: "Tubuh Anda tidak terpisah dari pelayanan Anda — tubuh adalah medium di mana semua itu terjadi. Pemimpin yang mengabaikan kesehatan fisik mereka tidak lebih berkorban. Mereka lebih cepat habis. Perlakukan tubuh Anda sebagai instrumen yang seharusnya.",
    nl_desc: "Jouw lichaam staat niet los van je bediening — het is het medium waardoor alles gebeurt. Leiders die hun lichamelijke gezondheid verwaarlozen zijn niet meer opofferend. Ze zijn minder duurzaam. Behandel je lichaam als het instrument dat het is.",
    habits: [
      {
        en: "Sleep 7–8 hours. Not as a reward for finishing, but as a daily non-negotiable. Chronic sleep debt is not dedication — it is slow self-destruction.",
        id: "Tidur 7–8 jam. Bukan sebagai hadiah karena sudah menyelesaikan pekerjaan, tetapi sebagai hal yang tidak bisa ditawar setiap hari. Kekurangan tidur kronis bukan dedikasi — itu adalah penghancuran diri yang perlahan.",
        nl: "Slaap 7–8 uur. Niet als beloning voor het afmaken, maar als dagelijks niet-onderhandelbaar. Chronisch slaaptekort is geen toewijding — het is langzame zelfvernietiging.",
      },
      {
        en: "Move your body for 30 minutes, three times a week. Adapt the form to your context — walking is enough. Your cardiovascular health predicts your cognitive sharpness.",
        id: "Gerakkan tubuh Anda selama 30 menit, tiga kali seminggu. Sesuaikan bentuknya dengan konteks Anda — berjalan kaki sudah cukup. Kesehatan kardiovaskular Anda memprediksi ketajaman kognitif Anda.",
        nl: "Beweeg je lichaam 30 minuten, drie keer per week. Pas de vorm aan jouw context aan — wandelen is genoeg. Je cardiovasculaire gezondheid voorspelt je cognitieve scherpte.",
      },
      {
        en: "Eat food that sustains rather than numbs. In high-stress seasons, leaders often default to stimulants (caffeine, sugar) and neglect real nutrition. Notice the pattern.",
        id: "Makan makanan yang menopang daripada mematikan rasa. Dalam musim penuh tekanan, pemimpin sering beralih ke stimulan (kafein, gula) dan mengabaikan nutrisi yang sesungguhnya. Perhatikan pola ini.",
        nl: "Eet voedsel dat voedt in plaats van verdooft. In periodes met veel stress grijpen leiders vaak naar stimulantia (cafeïne, suiker) en verwaarlozen echte voeding. Merk het patroon op.",
      },
    ],
  },
  {
    key: "mind",
    icon: "📖",
    color: "oklch(50% 0.14 220)",
    en_title: "Mind",
    id_title: "Pikiran",
    nl_title: "Geest",
    en_tagline: "Your cognitive and emotional capacity",
    id_tagline: "Kapasitas kognitif dan emosional Anda",
    nl_tagline: "Je cognitieve en emotionele capaciteit",
    en_desc: "The mind needs input, processing time, and genuine limits. Leaders who never stop taking in information, never process what they experience, and never set cognitive limits eventually produce neither wisdom nor clarity — only noise.",
    id_desc: "Pikiran membutuhkan masukan, waktu pemrosesan, dan batasan yang sesungguhnya. Pemimpin yang tidak pernah berhenti menerima informasi, tidak pernah memproses pengalaman mereka, dan tidak pernah menetapkan batasan kognitif pada akhirnya tidak menghasilkan kebijaksanaan atau kejernihan — hanya kebisingan.",
    nl_desc: "De geest heeft input, verwerkingstijd en echte grenzen nodig. Leiders die nooit stoppen met informatie opnemen, nooit verwerken wat ze meemaken en nooit cognitieve grenzen stellen, produceren uiteindelijk geen wijsheid of helderheid — alleen ruis.",
    habits: [
      {
        en: "Read one book every month — not for professional development only, but for joy, breadth, and perspective. Narrow minds lead narrow organisations.",
        id: "Baca satu buku setiap bulan — bukan hanya untuk pengembangan profesional, tetapi untuk kesenangan, wawasan, dan perspektif. Pikiran yang sempit memimpin organisasi yang sempit.",
        nl: "Lees één boek per maand — niet alleen voor professionele ontwikkeling, maar voor plezier, breedte en perspectief. Smalle geesten leiden smalle organisaties.",
      },
      {
        en: "Create 20 minutes of daily processing time — journalling, walking without a podcast, or quiet prayer. Your brain needs white space to integrate experience into learning.",
        id: "Ciptakan 20 menit waktu pemrosesan harian — jurnal, berjalan tanpa podcast, atau doa yang tenang. Otak Anda membutuhkan ruang kosong untuk mengintegrasikan pengalaman menjadi pembelajaran.",
        nl: "Creëer dagelijks 20 minuten verwerkingstijd — journaling, wandelen zonder podcast, of stil gebed. Je brein heeft witte ruimte nodig om ervaringen te integreren tot leren.",
      },
      {
        en: "Set a digital boundary: no screens for the first 30 minutes of your morning and the last 30 minutes before sleep. These are your highest-value thinking windows — protect them.",
        id: "Tetapkan batasan digital: tidak ada layar selama 30 menit pertama di pagi hari dan 30 menit terakhir sebelum tidur. Ini adalah jendela berpikir bernilai tertinggi Anda — lindungi mereka.",
        nl: "Stel een digitale grens: geen schermen gedurende de eerste 30 minuten van je ochtend en de laatste 30 minuten voor het slapen. Dit zijn je meest waardevolle denkvensters — bescherm ze.",
      },
    ],
  },
  {
    key: "spirit",
    icon: "✝",
    color: "oklch(55% 0.14 290)",
    en_title: "Spirit",
    id_title: "Roh",
    nl_title: "Ziel",
    en_tagline: "Your connection to the source",
    id_tagline: "Koneksi Anda ke sumber",
    nl_tagline: "Je verbinding met de bron",
    en_desc: "Spiritual health is not measured by religious activity — it is measured by your connectedness to God. A leader can be extraordinarily busy with spiritual work and be spiritually empty. The habits here are not about performance. They are about remaining connected to the one who called you.",
    id_desc: "Kesehatan rohani tidak diukur dari aktivitas keagamaan — tetapi dari koneksi Anda dengan Tuhan. Seorang pemimpin bisa sangat sibuk dengan pekerjaan rohani dan tetap kosong secara rohani. Kebiasaan di sini bukan tentang performa. Ini tentang tetap terhubung dengan Dia yang memanggil Anda.",
    nl_desc: "Geestelijke gezondheid wordt niet gemeten aan religieuze activiteit — maar aan je verbondenheid met God. Een leider kan buitengewoon druk zijn met geestelijk werk en toch geestelijk leeg zijn. De gewoonten hier gaan niet over prestaties. Ze gaan over verbonden blijven met degene die jou riep.",
    habits: [
      {
        en: "Pray honestly — including your doubts, frustrations, and fears. Jesus withdrew to solitary places not to report his successes but to remain in communion with the Father.",
        id: "Berdoa dengan jujur — termasuk keraguan, frustrasi, dan ketakutan Anda. Yesus menyingkir ke tempat-tempat yang sunyi bukan untuk melaporkan keberhasilan-Nya tetapi untuk tetap berada dalam persekutuan dengan Bapa.",
        nl: "Bid eerlijk — inclusief je twijfels, frustraties en angsten. Jezus trok zich terug naar eenzame plekken niet om zijn successen te rapporteren maar om in gemeenschap met de Vader te blijven.",
      },
      {
        en: "Read Scripture slowly — not for sermon preparation or content production, but for personal nourishment. Two verses read meditatively sustain more than two chapters read for information.",
        id: "Baca Kitab Suci dengan perlahan — bukan untuk persiapan khotbah atau produksi konten, tetapi untuk pemeliharaan pribadi. Dua ayat yang dibaca secara meditatif memberikan lebih banyak sustansi daripada dua pasal yang dibaca hanya untuk informasi.",
        nl: "Lees de Schrift langzaam — niet voor preekvoorbereiding of inhoudsproductie, maar voor persoonlijke voeding. Twee verzen meditatief gelezen geven meer voeding dan twee hoofdstukken informatief gelezen.",
      },
      {
        en: "Stay embedded in a local community of faith. Cross-cultural leaders are especially vulnerable to becoming 'everyone's pastor and no one's parishioner.' Find a community where you receive, not only give.",
        id: "Tetaplah terhubung dalam komunitas iman lokal. Pemimpin lintas budaya sangat rentan menjadi 'gembala semua orang dan jemaat tidak seorang pun.' Temukan komunitas di mana Anda menerima, bukan hanya memberi.",
        nl: "Blijf ingebed in een plaatselijke geloofsgemeenschap. Interculturele leiders zijn bijzonder kwetsbaar voor het worden van 'ieders pastor en niemands gemeentelid.' Vind een gemeenschap waar je ontvangt, niet alleen geeft.",
      },
    ],
  },
];

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = { userPathway: string | null; isSaved: boolean };

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function SustainablePaceClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeSphere, setActiveSphere] = useState<SphereKey | null>(null);
  const [auditScores, setAuditScores] = useState<Record<string, number>>({});
  const [openHabit, setOpenHabit] = useState<string | null>(null);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("sustainable-pace");
      setSaved(true);
    });
  }

  function setScore(key: string, score: number) {
    setAuditScores(prev => ({ ...prev, [key]: score }));
  }

  const totalScored = Object.keys(auditScores).length;
  const avgScore = totalScored > 0
    ? Math.round((Object.values(auditScores).reduce((a, b) => a + b, 0) / totalScored) * 10) / 10
    : null;

  const getScoreColor = (score: number) => {
    if (score <= 2) return "oklch(55% 0.18 25)";
    if (score <= 3) return orange;
    return "oklch(52% 0.16 145)";
  };

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;
  const activeSphereData = activeSphere ? SPHERES.find(s => s.key === activeSphere) : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* ── LANGUAGE BAR ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: navy, padding: "10px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid oklch(30% 0.08 260)",
      }}>
        <span style={{
          fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.14em", color: "oklch(62% 0.06 260)", textTransform: "uppercase",
        }}>
          {t("Personal Development · Health Architecture", "Pengembangan Pribadi · Arsitektur Kesehatan", "Persoonlijke Ontwikkeling · Gezondheidsarchitectuur")}
        </span>
      </div>

      {/* ── HERO: SURVIVING VS THRIVING ── */}
      <section style={{ background: navy, padding: "96px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 0%, oklch(30% 0.12 260 / 0.6) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <p style={{
            color: orange, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 20,
          }}>
            {t("Personal Development · Guide", "Pengembangan Pribadi · Panduan", "Persoonlijke Ontwikkeling · Gids")}
          </p>
          <h1 style={{
            fontFamily: serif, fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 700, color: offWhite, lineHeight: 1.1, fontStyle: "italic",
            marginBottom: 32,
          }}>
            {t("Surviving vs. Thriving", "Bertahan vs. Berkembang", "Overleven vs. Bloeien")}
          </h1>
          <div style={{ width: 48, height: 2, background: orange, marginBottom: 36 }} />
          <p style={{
            fontFamily: serif, fontSize: "clamp(18px, 2.4vw, 24px)",
            color: "oklch(80% 0.03 80)", lineHeight: 1.75, marginBottom: 16,
            fontStyle: "italic", maxWidth: 640,
          }}>
            {t(
              "Most leaders are not failing. They are surviving — managing output while quietly depleting. The question this module asks is not: can you keep going? It is: are you building to last?",
              "Kebanyakan pemimpin tidak gagal. Mereka sedang bertahan — mengelola output sambil diam-diam menguras diri. Pertanyaan yang diajukan modul ini bukan: bisakah Anda terus berjalan? Melainkan: apakah Anda sedang membangun untuk bertahan lama?",
              "De meeste leiders falen niet. Ze overleven — ze managen output terwijl ze zichzelf stiekem uitputten. De vraag die deze module stelt is niet: kun je doorgaan? Het is: bouw je om te blijven?"
            )}
          </p>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600,
            color: "oklch(55% 0.06 260)", lineHeight: 1.65, maxWidth: 600, marginBottom: 48,
          }}>
            {t(
              "This is not the Sabbath module — that is about theological rest. This is practical. It is about the architecture of your personal health: the systems, habits, and support structures that determine whether you are still effective in 10 years.",
              "Ini bukan modul Sabat — itu tentang istirahat teologis. Ini bersifat praktis. Ini tentang arsitektur kesehatan pribadi Anda: sistem, kebiasaan, dan struktur dukungan yang menentukan apakah Anda masih efektif dalam 10 tahun ke depan.",
              "Dit is niet de Sabbat-module — die gaat over theologische rust. Dit is praktisch. Het gaat over de architectuur van je persoonlijke gezondheid: de systemen, gewoonten en ondersteunende structuren die bepalen of je over 10 jaar nog effectief bent."
            )}
          </p>

          {/* Opening verse pull-quote */}
          <div style={{
            background: "oklch(28% 0.10 260 / 0.7)", borderRadius: 12,
            padding: "28px 32px", maxWidth: 600, borderLeft: `3px solid ${orange}`,
          }}>
            <p style={{
              fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)",
              color: "oklch(88% 0.04 80)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 12,
            }}>
              "{t(
                "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
                "Pagi-pagi benar, waktu hari masih gelap, Ia bangun dan pergi ke luar. Ia pergi ke tempat yang sunyi dan berdoa di sana.",
                "Vroeg in de ochtend, toen het nog donker was, stond hij op en ging naar buiten. Hij liep naar een eenzame plek en bad daar."
              )}"
            </p>
            <p style={{ fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
              —{" "}
              <button
                onClick={() => setActiveVerse("mark-1-35")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: orange, fontWeight: 700, fontSize: 12,
                  textDecoration: "underline dotted", textUnderlineOffset: 3, padding: 0,
                }}
              >
                {t("Mark 1:35", "Markus 1:35", "Marcus 1:35")}
              </button>{" "}
              (NIV)
            </p>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 48, flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "12px 28px", border: "none",
                cursor: saved ? "default" : "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                background: saved ? "oklch(35% 0.05 260)" : orange,
                color: offWhite, letterSpacing: "0.04em", borderRadius: 4,
              }}
            >
              {saved
                ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
            <Link
              href="/resources"
              style={{
                padding: "12px 28px", border: "1px solid oklch(45% 0.05 260)",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                color: "oklch(78% 0.03 80)", textDecoration: "none", borderRadius: 4,
              }}
            >
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION I: THE KEY QUESTION ── */}
      <section style={{ padding: "96px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{
          fontFamily: serif, fontSize: 11, fontWeight: 400,
          letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32,
        }}>
          {t("I. The Question Behind the Question", "I. Pertanyaan di Balik Pertanyaan", "I. De Vraag Achter de Vraag")}
        </p>
        <h2 style={{
          fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic",
        }}>
          {t("What Does It Cost to Keep Going?", "Berapa Harga untuk Terus Berjalan?", "Wat Kost Het om Door te Gaan?")}
        </h2>
        <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 28 }}>
            {t(
              "The ReMap research — one of the most extensive studies of cross-cultural worker attrition ever conducted — found that the majority of preventable departures were not caused by theological failure, moral collapse, or lack of vision. They were caused by neglect of personal health: physical depletion, relational isolation, emotional overload, and lack of adequate support structures.",
              "Penelitian ReMap — salah satu studi paling ekstensif tentang keluarnya pekerja lintas budaya yang pernah dilakukan — menemukan bahwa mayoritas keberangkatan yang dapat dicegah tidak disebabkan oleh kegagalan teologis, keruntuhan moral, atau kurangnya visi. Mereka disebabkan oleh pengabaian kesehatan pribadi: kelelahan fisik, isolasi relasional, kelebihan emosional, dan kurangnya struktur dukungan yang memadai.",
              "Het ReMap-onderzoek — een van de meest uitgebreide studies naar uitval van interculturele werkers ooit uitgevoerd — ontdekte dat de meerderheid van vermijdbare vertrekken niet werd veroorzaakt door theologisch falen, morele ineenstorting of gebrek aan visie. Ze werden veroorzaakt door verwaarlozing van persoonlijke gezondheid: fysieke uitputting, relationele isolatie, emotionele overbelasting en gebrek aan adequate ondersteuningsstructuren."
            )}
          </p>
          <p style={{ marginBottom: 28 }}>
            {t(
              "The insight is confronting: most leaders who leave the field — or who stay but become shadows of themselves — were not undone by the hard things. They were undone by the slow accumulation of small depletions they never addressed.",
              "Pemahamannya mengejutkan: sebagian besar pemimpin yang meninggalkan lapangan — atau yang tetap tetapi menjadi bayang-bayang diri mereka sendiri — tidak dihancurkan oleh hal-hal yang sulit. Mereka dihancurkan oleh akumulasi perlahan dari penipisan kecil yang tidak pernah mereka tangani.",
              "Het inzicht is confronterend: de meeste leiders die het veld verlaten — of die blijven maar zichzelf niet meer zijn — werden niet geveld door de zware dingen. Ze werden geveld door de langzame opeenhoping van kleine uitputtingen die ze nooit aanpakten."
            )}
          </p>
          <p style={{
            fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 24px)",
            fontStyle: "italic", color: navy, lineHeight: 1.75,
            padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`,
            marginBottom: 28,
          }}>
            {t(
              "Proactive care prevents attrition. It is not a luxury reserved for those with energy to spare. It is the strategy that keeps you in the work long enough to see it bear fruit.",
              "Perawatan proaktif mencegah keluarnya para pemimpin. Ini bukan kemewahan yang disimpan untuk mereka yang memiliki energi berlebih. Ini adalah strategi yang membuat Anda tetap dalam pekerjaan cukup lama untuk melihatnya berbuah.",
              "Proactieve zorg voorkomt uitval. Het is geen luxe gereserveerd voor degenen die energie te sparen hebben. Het is de strategie die je lang genoeg in het werk houdt om het vruchten te zien dragen."
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            {t(
              "Jesus modelled this. The most effective leader in human history regularly withdrew from the work — before dawn, to solitary places — not as indulgence, but as the deep rhythm that sustained everything else. He was not less missional because he withdrew. He was more effective because of it.",
              "Yesus memodelkan hal ini. Pemimpin paling efektif dalam sejarah manusia secara teratur mengundurkan diri dari pekerjaan — sebelum fajar, ke tempat-tempat yang sunyi — bukan sebagai kemewahan, tetapi sebagai ritme mendalam yang menopang segalanya. Ia tidak kurang bermisi karena menyingkir. Ia lebih efektif karena hal itu.",
              "Jezus modelleerde dit. De meest effectieve leider in de menselijke geschiedenis trok zich regelmatig terug van het werk — voor zonsopgang, naar eenzame plaatsen — niet als verwennerij, maar als het diepe ritme dat alles onderhield. Hij was niet minder missionair omdat hij zich terugtrok. Hij was effectiever daardoor."
            )}
          </p>
        </div>
      </section>

      {/* ── SECTION II: THE FIVE SPHERES ── */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center",
          }}>
            {t("II. The O'Donnell Model", "II. Model O'Donnell", "II. Het O'Donnell-model")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("The Five Spheres of Care", "Lima Lingkup Perawatan", "De Vijf Sferen van Zorg")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: bodyText, lineHeight: 1.85, maxWidth: 640,
            margin: "0 auto 20px", textAlign: "center",
          }}>
            {t(
              "Kelly O'Donnell's member care framework identifies five concentric levels of care that every long-term leader needs. No single level is sufficient alone — resilience requires all five.",
              "Kerangka perawatan anggota Kelly O'Donnell mengidentifikasi lima tingkat perawatan konsentris yang dibutuhkan setiap pemimpin jangka panjang. Tidak ada satu tingkat yang cukup sendiri — ketahanan membutuhkan kelima level tersebut.",
              "Kelly O'Donnells member care-raamwerk identificeert vijf concentrische niveaus van zorg die elke langetermijnleider nodig heeft. Geen enkel niveau is alleen voldoende — weerbaarheid vereist alle vijf."
            )}
          </p>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
            color: "oklch(55% 0.06 260)", textAlign: "center", marginBottom: 64, fontStyle: "italic",
          }}>
            {t(
              "Click any sphere to explore what it means and how strong yours is right now.",
              "Klik lingkup mana saja untuk menjelajahi artinya dan seberapa kuat kondisi Anda saat ini.",
              "Klik op een bol om te ontdekken wat het betekent en hoe sterk die voor jou nu is."
            )}
          </p>

          {/* Sphere visual — concentric rings with clickable labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 700, margin: "0 auto 48px" }}>
            {SPHERES.map((sphere, i) => {
              const isActive = activeSphere === sphere.key;
              const indent = i * 20;
              return (
                <button
                  key={sphere.key}
                  onClick={() => setActiveSphere(isActive ? null : sphere.key)}
                  style={{
                    textAlign: "left",
                    marginLeft: indent,
                    marginRight: indent,
                    padding: "20px 28px",
                    borderRadius: 10,
                    border: `2px solid ${isActive ? sphere.color : "oklch(88% 0.008 260)"}`,
                    background: isActive ? `oklch(97% 0.005 80)` : "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    transition: "border-color 0.15s",
                    boxShadow: isActive ? `0 0 0 4px ${sphere.color}20` : "none",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: sphere.color,
                    flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontFamily: "Montserrat, sans-serif",
                    fontWeight: 800, fontSize: 13,
                  }}>
                    {sphere.level}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                      fontSize: 15, color: isActive ? sphere.color : navy, marginBottom: 2,
                    }}>
                      {tFn(sphere.en_title, sphere.id_title, sphere.nl_title, lang)}
                    </div>
                    <div style={{ fontFamily: serif, fontSize: 14, color: bodyText, fontStyle: "italic" }}>
                      {tFn(sphere.en_subtitle, sphere.id_subtitle, sphere.nl_subtitle, lang)}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 18, color: sphere.color, fontWeight: 300,
                    transform: isActive ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s", flexShrink: 0,
                  }}>
                    +
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sphere detail panel */}
          {activeSphereData && (
            <div style={{
              background: "white", borderRadius: 16, padding: "40px 36px",
              border: `2px solid ${activeSphereData.color}40`,
              marginBottom: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: activeSphereData.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800, fontSize: 18, flexShrink: 0,
                }}>
                  {activeSphereData.level}
                </div>
                <div>
                  <div style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                    fontSize: 20, color: activeSphereData.color,
                  }}>
                    {tFn(activeSphereData.en_title, activeSphereData.id_title, activeSphereData.nl_title, lang)}
                  </div>
                  <div style={{ fontFamily: serif, fontSize: 15, color: bodyText, fontStyle: "italic" }}>
                    {tFn(activeSphereData.en_subtitle, activeSphereData.id_subtitle, activeSphereData.nl_subtitle, lang)}
                  </div>
                </div>
              </div>

              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 32 }}>
                {tFn(activeSphereData.en_desc, activeSphereData.id_desc, activeSphereData.nl_desc, lang)}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 12,
                  }}>
                    {t("What This Looks Like", "Bagaimana Ini Terlihat", "Hoe Dit Eruitziet")}
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {(lang === "en" ? activeSphereData.en_examples : lang === "id" ? activeSphereData.id_examples : activeSphereData.nl_examples).map((ex, i) => (
                      <li key={i} style={{
                        display: "flex", gap: 10, alignItems: "flex-start",
                        marginBottom: 10, fontFamily: serif,
                        fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.6, color: bodyText,
                      }}>
                        <span style={{ color: activeSphereData.color, fontWeight: 700, flexShrink: 0, marginTop: 3 }}>→</span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 12,
                  }}>
                    {t("Reflection", "Refleksi", "Reflectie")}
                  </p>
                  <div style={{
                    background: lightGray, borderRadius: 10, padding: "20px 22px",
                    borderLeft: `3px solid ${activeSphereData.color}`,
                  }}>
                    <p style={{
                      fontFamily: serif, fontSize: "clamp(14px, 1.5vw, 17px)",
                      color: navy, lineHeight: 1.7, fontStyle: "italic", margin: 0,
                    }}>
                      {tFn(activeSphereData.en_question, activeSphereData.id_question, activeSphereData.nl_question, lang)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION III: THE STRESS AUDIT ── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16,
          }}>
            {t("III. The Stress Audit", "III. Audit Stres", "III. De Stressaudit")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2, fontStyle: "italic",
          }}>
            {t("Where Are You Right Now?", "Di Mana Anda Sekarang?", "Waar Ben Je Nu?")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: bodyText, lineHeight: 1.85, maxWidth: 640, marginBottom: 16,
          }}>
            {t(
              "Rate each of the ten areas on a scale of 1–5. This is not a diagnostic test — it is a rapid scan to help you see where your energy is actually going. Be honest. No one else will see this.",
              "Nilai setiap sepuluh area pada skala 1–5. Ini bukan tes diagnostik — ini adalah pemindaian cepat untuk membantu Anda melihat ke mana energi Anda sebenarnya pergi. Jujurlah. Tidak ada orang lain yang akan melihat ini.",
              "Beoordeel elk van de tien gebieden op een schaal van 1–5. Dit is geen diagnostische test — het is een snelle scan om te zien waar je energie eigenlijk naartoe gaat. Wees eerlijk. Niemand anders zal dit zien."
            )}
          </p>
          <div style={{ display: "flex", gap: 32, marginBottom: 56, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "oklch(55% 0.18 25)" }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText }}>
                1–2: {t("Critical attention needed", "Perlu perhatian kritis", "Kritieke aandacht nodig")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: orange }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText }}>
                3: {t("Watchful — invest here", "Waspada — investasikan di sini", "Attent — investeer hier")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "oklch(52% 0.16 145)" }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText }}>
                4–5: {t("Healthy — maintain it", "Sehat — pertahankan", "Gezond — houd het vast")}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {STRESS_AREAS.map(area => {
              const score = auditScores[area.key] ?? 0;
              return (
                <div
                  key={area.key}
                  style={{
                    background: "white", borderRadius: 12, padding: "22px 24px",
                    border: `1.5px solid ${score > 0 ? getScoreColor(score) + "60" : "oklch(90% 0.008 80)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{area.icon}</span>
                    <div>
                      <div style={{
                        fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                        fontSize: 14, color: navy,
                      }}>
                        {tFn(area.en_label, area.id_label, area.nl_label, lang)}
                      </div>
                      {score > 0 && (
                        <div style={{
                          fontFamily: serif, fontSize: 12, color: getScoreColor(score),
                          fontStyle: "italic", marginTop: 2,
                        }}>
                          {score <= 2
                            ? tFn(area.en_low, area.id_low, area.nl_low, lang)
                            : score >= 4
                            ? tFn(area.en_high, area.id_high, area.nl_high, lang)
                            : t("Moderate — worth monitoring", "Sedang — perlu dipantau", "Matig — het waard om te monitoren")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setScore(area.key, n)}
                        style={{
                          flex: 1, height: 36, border: "none", cursor: "pointer",
                          borderRadius: 6,
                          background: n <= score ? getScoreColor(score) : "oklch(92% 0.006 80)",
                          fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                          fontSize: 13,
                          color: n <= score ? "white" : "oklch(68% 0.04 260)",
                          transition: "background 0.15s",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit summary */}
          {totalScored > 0 && (
            <div style={{
              marginTop: 40, background: navy, borderRadius: 14, padding: "32px 36px",
              display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap",
            }}>
              <div style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{
                  fontFamily: serif, fontSize: "clamp(44px, 5vw, 60px)",
                  fontWeight: 700, color: avgScore !== null ? getScoreColor(avgScore) : orange,
                  lineHeight: 1,
                }}>
                  {avgScore}
                </div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "oklch(62% 0.06 260)", fontWeight: 700, letterSpacing: "0.08em", marginTop: 4 }}>
                  {t("avg score", "skor rata-rata", "gem. score")}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 8 }}>
                  {totalScored}/{STRESS_AREAS.length} {t("areas rated", "area dinilai", "gebieden beoordeeld")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: "oklch(80% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                  {avgScore !== null && avgScore <= 2.5
                    ? t(
                        "Your overall picture shows significant depletion. This is not the time for more willpower — it is the time for structural change. Look at your lowest-scored areas first.",
                        "Gambaran keseluruhan Anda menunjukkan penipisan yang signifikan. Ini bukan saatnya untuk lebih banyak kemauan — ini saatnya untuk perubahan struktural. Lihat area dengan skor terendah Anda terlebih dahulu.",
                        "Jouw totaalbeeld laat aanzienlijke uitputting zien. Dit is niet de tijd voor meer wilskracht — het is de tijd voor structurele verandering. Kijk eerst naar je laagst gescoorde gebieden."
                      )
                    : avgScore !== null && avgScore <= 3.5
                    ? t(
                        "You are managing, but the margin is thin. The areas you scored 1–2 are worth your focused attention before they become crises.",
                        "Anda bisa bertahan, tetapi ruang gerak Anda sempit. Area yang Anda nilai 1–2 layak mendapat perhatian terfokus sebelum menjadi krisis.",
                        "Je redt het, maar de marge is dun. De gebieden die je 1–2 scoorde verdienen je gerichte aandacht voordat ze crises worden."
                      )
                    : t(
                        "Your overall health looks solid. The practice now is maintenance — protect what is working and stay honest about any areas that start to slip.",
                        "Kesehatan keseluruhan Anda terlihat solid. Praktik sekarang adalah pemeliharaan — lindungi apa yang berhasil dan tetap jujur tentang area yang mulai menurun.",
                        "Jouw algehele gezondheid ziet er solide uit. De oefening nu is onderhoud — bescherm wat werkt en blijf eerlijk over gebieden die beginnen te zakken."
                      )}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION IV: THREE CATEGORIES OF HABITS ── */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center",
          }}>
            {t("IV. Practical Habits", "IV. Kebiasaan Praktis", "IV. Praktische Gewoonten")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("Body, Mind, Spirit", "Tubuh, Pikiran, Roh", "Lichaam, Geest, Ziel")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: bodyText, lineHeight: 1.85, maxWidth: 640,
            margin: "0 auto 64px", textAlign: "center",
          }}>
            {t(
              "Three categories — nine habits. Not rules to comply with, but investments to protect. You are not going to do all nine perfectly. Pick the one or two that your Stress Audit revealed you need most.",
              "Tiga kategori — sembilan kebiasaan. Bukan aturan untuk dipatuhi, tetapi investasi untuk dilindungi. Anda tidak akan melakukan semua sembilan dengan sempurna. Pilih satu atau dua yang diungkapkan Audit Stres Anda sebagai yang paling Anda butuhkan.",
              "Drie categorieën — negen gewoonten. Geen regels om na te leven, maar investeringen om te beschermen. Je gaat ze niet alle negen perfect doen. Kies de een of twee die jouw Stressaudit heeft onthuld als wat je het meest nodig hebt."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HABIT_CATEGORIES.map(cat => {
              const isOpen = openHabit === cat.key;
              return (
                <div
                  key={cat.key}
                  style={{
                    background: "white", borderRadius: 14, overflow: "hidden",
                    border: `2px solid ${isOpen ? cat.color : "oklch(88% 0.008 260)"}`,
                    transition: "border-color 0.2s",
                  }}
                >
                  <button
                    onClick={() => setOpenHabit(isOpen ? null : cat.key)}
                    style={{
                      width: "100%", textAlign: "left", padding: "28px 32px",
                      background: "none", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 20,
                    }}
                  >
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                        fontSize: 20, color: isOpen ? cat.color : navy,
                      }}>
                        {tFn(cat.en_title, cat.id_title, cat.nl_title, lang)}
                      </div>
                      <div style={{ fontFamily: serif, fontSize: 14, color: bodyText, fontStyle: "italic", marginTop: 3 }}>
                        {tFn(cat.en_tagline, cat.id_tagline, cat.nl_tagline, lang)}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 22, color: cat.color, fontWeight: 300,
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s", flexShrink: 0,
                    }}>
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 32px 36px" }}>
                      <p style={{
                        fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
                        color: bodyText, lineHeight: 1.85, marginBottom: 36,
                      }}>
                        {tFn(cat.en_desc, cat.id_desc, cat.nl_desc, lang)}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {cat.habits.map((habit, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex", gap: 24, alignItems: "flex-start",
                              padding: "22px 24px", background: lightGray,
                              borderRadius: 10, borderLeft: `3px solid ${cat.color}`,
                            }}
                          >
                            <div style={{
                              fontFamily: serif, fontSize: "clamp(36px, 4vw, 48px)",
                              fontWeight: 700, color: cat.color, lineHeight: 1,
                              minWidth: 36, flexShrink: 0, marginTop: -4,
                            }}>
                              {i + 1}
                            </div>
                            <p style={{
                              fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
                              color: bodyText, lineHeight: 1.85, margin: 0,
                            }}>
                              {tFn(habit.en, habit.id, habit.nl, lang)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION V: BIBLICAL FOUNDATION ── */}
      <section style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center",
          }}>
            {t("V. Biblical Foundation", "V. Dasar Alkitab", "V. Bijbelse Basis")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: offWhite, marginBottom: 20, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("Jesus and the Rhythm of Withdrawal", "Yesus dan Ritme Penyingkiran", "Jezus en het Ritme van Terugtrekking")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: "oklch(70% 0.03 80)", lineHeight: 1.85, maxWidth: 620,
            margin: "0 auto 72px", textAlign: "center",
          }}>
            {t(
              "Sustainable pace is not a leadership strategy invented in the 21st century. It is a pattern modelled by Jesus himself — and described throughout Scripture.",
              "Kecepatan yang berkelanjutan bukan strategi kepemimpinan yang ditemukan di abad ke-21. Ini adalah pola yang dimodelkan oleh Yesus sendiri — dan digambarkan di seluruh Kitab Suci.",
              "Duurzaam tempo is geen leiderschapsstrategie uitgevonden in de 21e eeuw. Het is een patroon gemodelleerd door Jezus zelf — en beschreven door de hele Schrift."
            )}
          </p>

          {/* Mark 1:35 */}
          <div style={{ marginBottom: 64 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
              color: orange, letterSpacing: "0.1em", marginBottom: 20,
            }}>
              <button
                onClick={() => setActiveVerse("mark-1-35")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: orange, fontWeight: 700, fontSize: 12,
                  textDecoration: "underline dotted", textUnderlineOffset: 3, padding: 0,
                  letterSpacing: "0.1em",
                }}
              >
                {t("Mark 1:35", "Markus 1:35", "Marcus 1:35")}
              </button>
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)",
              fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 24,
            }}>
              "{t(
                "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
                "Pagi-pagi benar, waktu hari masih gelap, Ia bangun dan pergi ke luar. Ia pergi ke tempat yang sunyi dan berdoa di sana.",
                "Vroeg in de ochtend, toen het nog donker was, stond hij op en ging naar buiten. Hij liep naar een eenzame plek en bad daar."
              )}"
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(72% 0.03 80)", lineHeight: 1.85,
            }}>
              {t(
                "This verse sits in the middle of one of the most intense ministry passages in the Gospels. The day before, Jesus had healed Peter's mother-in-law, and by evening the whole town had gathered at the door. He healed many, drove out demons, and was in constant demand. And then — before anyone else was awake — he left. Not after everyone had been seen to. Not after the crowds had dispersed. Before.",
                "Ayat ini berada di tengah salah satu bagian pelayanan paling intens dalam Injil. Sehari sebelumnya, Yesus telah menyembuhkan ibu mertua Petrus, dan menjelang sore seluruh kota telah berkumpul di depan pintu. Ia menyembuhkan banyak orang, mengusir setan, dan terus diminta. Dan kemudian — sebelum siapa pun terbangun — Ia pergi. Bukan setelah semua orang dilayani. Bukan setelah kerumunan bubar. Sebelum.",
                "Dit vers staat midden in een van de meest intense bedieningspassages in de Evangeliën. De dag ervoor had Jezus de schoonmoeder van Petrus genezen, en 's avonds had de hele stad zich voor de deur verzameld. Hij genas velen, dreef demonen uit en was voortdurend gevraagd. En toen — voordat iemand anders wakker was — vertrok hij. Niet nadat iedereen geholpen was. Niet nadat de menigte was opgelost. Daarvóór."
              )}
            </p>
          </div>

          {/* Psalm 23:2-3 */}
          <div style={{ marginBottom: 64 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
              color: orange, letterSpacing: "0.1em", marginBottom: 20,
            }}>
              <button
                onClick={() => setActiveVerse("ps-23-2-3")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: orange, fontWeight: 700, fontSize: 12,
                  textDecoration: "underline dotted", textUnderlineOffset: 3, padding: 0,
                  letterSpacing: "0.1em",
                }}
              >
                {t("Psalm 23:2–3", "Mazmur 23:2–3", "Psalm 23:2–3")}
              </button>
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)",
              fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 24,
            }}>
              "{t(
                "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
                "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku.",
                "Hij laat mij rusten in groene weiden en voert mij naar vredig water, hij geeft mij nieuwe kracht."
              )}"
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(72% 0.03 80)", lineHeight: 1.85,
            }}>
              {t(
                "Notice the active verbs: he makes, he leads, he refreshes. The Psalm describes a God who does not simply permit rest — he initiates it. 'He makes me lie down' is a strong image: the shepherd leads the sheep to green pasture and the sheep lies down, because that is what the shepherd is doing. God is not passive about your wellbeing. He is actively guiding you toward renewal.",
                "Perhatikan kata kerja aktif: Ia membaringkan, Ia membimbing, Ia menyegarkan. Mazmur ini menggambarkan Allah yang tidak sekadar mengizinkan istirahat — Ia memulainya. 'Ia membaringkan aku' adalah gambaran yang kuat: Gembala memimpin domba ke padang yang berumput hijau dan domba itu berbaring, karena itulah yang dilakukan Gembala. Allah tidak pasif terhadap kesejahteraan Anda. Ia secara aktif memandu Anda menuju pembaruan.",
                "Let op de actieve werkwoorden: hij laat rusten, hij voert, hij geeft kracht. De Psalm beschrijft een God die rust niet slechts toestaat — hij initieert het. 'Hij laat mij rusten' is een sterk beeld: de herder leidt het schaap naar groene weiden en het schaap gaat liggen, omdat dat is wat de herder doet. God is niet passief over jouw welzijn. Hij leidt je actief naar vernieuwing."
              )}
            </p>
          </div>

          {/* The ReMap insight as theological anchor */}
          <div style={{
            background: "oklch(18% 0.09 260)", borderRadius: 12, padding: "40px 40px",
            borderLeft: `4px solid ${orange}`,
          }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
              color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20,
            }}>
              {t("The Theological Reframe", "Reframing Teologis", "De Theologische Herformulering")}
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 23px)",
              fontStyle: "italic", color: offWhite, lineHeight: 1.8, marginBottom: 20,
            }}>
              {t(
                "You are not the energy source. You are the vessel. The same God who sent you into the work is the God who designed rest into the fabric of creation. Building a sustainable pace is not a concession to your weakness — it is an act of faith in his ongoing provision.",
                "Anda bukan sumber energi. Anda adalah bejananya. Tuhan yang sama yang mengutus Anda ke dalam pekerjaan adalah Tuhan yang merancang istirahat ke dalam jalinan penciptaan. Membangun kecepatan yang berkelanjutan bukan konsesi terhadap kelemahan Anda — itu adalah tindakan iman dalam pemeliharaan-Nya yang terus-menerus.",
                "Jij bent niet de energiebron. Jij bent het vat. Dezelfde God die jou in het werk zond is de God die rust in het weefsel van de schepping heeft ontworpen. Een duurzaam tempo bouwen is geen concessie aan jouw zwakte — het is een daad van geloof in zijn voortdurende voorziening."
              )}
            </p>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
              color: orange, letterSpacing: "0.08em", margin: 0,
            }}>
              {t(
                "The leader who learns to pace themselves is not less dedicated. They are more faithful.",
                "Pemimpin yang belajar mengatur kecepatan diri mereka tidak kurang berdedikasi. Mereka lebih setia.",
                "De leider die leert zichzelf te doseren is niet minder toegewijd. Ze zijn trouwer."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION VI: YOUR ONE STEP ── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center",
          }}>
            {t("VI. Your Next Step", "VI. Langkah Berikutnya", "VI. Jouw Volgende Stap")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("One Investment This Week", "Satu Investasi Minggu Ini", "Één Investering Deze Week")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)",
            color: bodyText, lineHeight: 1.85, textAlign: "center", marginBottom: 48,
          }}>
            {t(
              "Look back at your Stress Audit. Which area scored lowest? That is where you begin. Not the whole framework — one habit, one sphere, one honest conversation. Sustainable pace is built one protected investment at a time.",
              "Lihat kembali Audit Stres Anda. Area mana yang mendapat skor terendah? Di situlah Anda memulai. Bukan seluruh kerangka — satu kebiasaan, satu lingkup, satu percakapan yang jujur. Kecepatan berkelanjutan dibangun satu investasi yang terlindungi pada satu waktu.",
              "Kijk terug naar je Stressaudit. Welk gebied scoorde het laagst? Daar begin je. Niet het hele raamwerk — één gewoonte, één sfeer, één eerlijk gesprek. Duurzaam tempo wordt gebouwd één beschermde investering tegelijk."
            )}
          </p>

          {/* Closing verse */}
          <div style={{
            background: lightGray, borderRadius: 12, padding: "36px 40px",
            textAlign: "center", marginBottom: 48,
            borderTop: `3px solid ${orange}`,
          }}>
            <p style={{
              fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)",
              fontStyle: "italic", color: navy, lineHeight: 1.75, marginBottom: 16,
            }}>
              "{t(
                "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
                "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku.",
                "Hij laat mij rusten in groene weiden en voert mij naar vredig water, hij geeft mij nieuwe kracht."
              )}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
              —{" "}
              <button
                onClick={() => setActiveVerse("ps-23-2-3")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: orange, fontWeight: 700, fontSize: 12,
                  textDecoration: "underline dotted", textUnderlineOffset: 3, padding: 0,
                }}
              >
                {t("Psalm 23:2–3", "Mazmur 23:2–3", "Psalm 23:2–3")}
              </button>{" "}
              (NIV)
            </p>
          </div>

          {/* Save + navigation */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "14px 36px", border: "none",
                cursor: saved ? "default" : "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                background: saved ? "oklch(40% 0.15 145)" : orange,
                color: offWhite, letterSpacing: "0.06em", borderRadius: 4,
              }}
            >
              {saved
                ? `✓ ${t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard")}`
                : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
            {userPathway && (
              <Link
                href="/dashboard"
                style={{
                  padding: "14px 32px", background: "transparent",
                  color: navy, border: `1.5px solid oklch(80% 0.01 260)`,
                  borderRadius: 4, fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700, fontSize: 13, textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                {t("Back to Pathway", "Kembali ke Jalur", "Terug naar Pad")}
              </Link>
            )}
            <Link
              href="/resources"
              style={{
                padding: "14px 32px", background: "transparent",
                color: bodyText, border: `1.5px solid oklch(85% 0.008 80)`,
                borderRadius: 4, fontFamily: "Montserrat, sans-serif",
                fontWeight: 600, fontSize: 13, textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <section style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)",
          fontWeight: 700, color: offWhite, marginBottom: 16, fontStyle: "italic",
        }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{
          fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 18px)",
          color: "oklch(70% 0.03 80)", lineHeight: 1.75, maxWidth: 480,
          margin: "0 auto 40px",
        }}>
          {t(
            "Explore more resources to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
            "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
          )}
        </p>
        <Link
          href="/resources"
          style={{
            display: "inline-block", padding: "14px 36px",
            background: orange, color: offWhite,
            fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700,
            textDecoration: "none", borderRadius: 4, letterSpacing: "0.04em",
          }}
        >
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </section>

      {/* ── VERSE POPUP ── */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: offWhite, borderRadius: 16, padding: "44px 40px",
              maxWidth: 540, width: "100%",
            }}
          >
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", color: orange, marginBottom: 20,
            }}>
              {lang === "en"
                ? verseData.en_ref
                : lang === "id"
                ? verseData.id_ref
                : verseData.nl_ref}
              {" "}({lang === "en" ? "NIV" : lang === "id" ? "TB" : "NBV"})
            </p>
            <p style={{
              fontFamily: serif, fontSize: 22, lineHeight: 1.7,
              color: navy, fontStyle: "italic", marginBottom: 28,
            }}>
              "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.nl}"
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px", background: navy, color: offWhite,
                border: "none", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
