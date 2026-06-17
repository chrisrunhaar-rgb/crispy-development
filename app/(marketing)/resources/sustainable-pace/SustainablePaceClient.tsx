"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

// -- TYPES & LANG --------------------------------------------------------------
type Lang = "en" | "id";

// -- BRAND TOKENS --------------------------------------------------------------
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const serif    = "Cormorant Garamond, Georgia, serif";

// -- VERSE DATA ----------------------------------------------------------------
const VERSES = {
  "mark-1-35": {
    en_ref: "Mark 1:35", id_ref: "Markus 1:35",
    en: "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
    id: "Pagi-pagi benar, waktu hari masih gelap, Ia bangun dan pergi ke luar. Ia pergi ke tempat yang sunyi dan berdoa di sana.",
  },
  "ps-23-2-3": {
    en_ref: "Psalm 23:2-3", id_ref: "Mazmur 23:2-3",
    en: "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    id: "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku.",
  },
};

// -- FIVE SPHERES DATA (O'Donnell Model) --------------------------------------
type SphereKey = "master" | "self" | "mutual" | "sender" | "specialist";

const SPHERES: {
  key: SphereKey;
  level: number;
  en_title: string; id_title: string;
  en_subtitle: string; id_subtitle: string;
  en_desc: string; id_desc: string;
  en_examples: string[]; id_examples: string[];
  en_question: string; id_question: string;
  color: string;
}[] = [
  {
    key: "master",
    level: 1,
    en_title: "Master Care",
    id_title: "Pemeliharaan Ilahi",
    en_subtitle: "God's care for you",
    id_subtitle: "Pemeliharaan Tuhan untuk kamu",
    en_desc: "The foundation of everything. God is not a supervisor tracking your output. He is the shepherd who actively leads you to rest and restores your soul. Before you build any structure, you must believe that God's care for you is not contingent on your performance. He cares for the vessel, not just the mission.",
    id_desc: "Fondasi dari segalanya. Tuhan bukan pengawas yang melacak outputmu. Ia adalah gembala yang secara aktif membimbingmu ke tempat istirahat dan memulihkan jiwamu. Sebelum kamu membangun struktur apapun, kamu harus percaya bahwa pemeliharaan Tuhan terhadapmu tidak tergantung pada kinerjamu. Ia merawat bejana, bukan hanya misi.",
    en_examples: ["Daily communion with God, not as a duty but as a source", "Prayer as honest conversation, not performance", "Trusting that God holds the mission when you step away", "Reading Scripture as nourishment, not information"],
    id_examples: ["Persekutuan harian dengan Tuhan, bukan sebagai kewajiban tetapi sebagai sumber", "Doa sebagai percakapan jujur, bukan pertunjukan", "Mempercayai bahwa Tuhan memegang misi ketika kamu beristirahat", "Membaca Kitab Suci sebagai makanan rohani, bukan informasi"],
    en_question: "When did you last come to God not to report, request, or produce, but simply to be held? What would it take to protect that space this week?",
    id_question: "Kapan terakhir kali kamu datang kepada Tuhan bukan untuk melaporkan, meminta, atau menghasilkan, tetapi sekadar untuk ditopang? Apa yang diperlukan untuk melindungi ruang itu minggu ini?",
    color: navy,
  },
  {
    key: "self",
    level: 2,
    en_title: "Self-Care",
    id_title: "Kepedulian Diri",
    en_subtitle: "Your personal health architecture",
    id_subtitle: "Arsitektur kesehatan pribadi kamu",
    en_desc: "Self-care is not indulgence. It is stewardship. You are the instrument God has chosen to use. The way you manage your body, mind, and spirit directly determines your capacity to love others and lead well. Neglect here is not humility; it is poor stewardship of a resource that belongs to God.",
    id_desc: "Kepedulian diri bukan kemewahan. Itu adalah penatalayanan. Kamu adalah instrumen yang dipilih Tuhan untuk digunakan. Cara kamu mengelola tubuh, pikiran, dan roh secara langsung menentukan kapasitasmu untuk mengasihi orang lain dan memimpin dengan baik. Mengabaikan hal ini bukan kerendahan hati; itu adalah penatalayanan yang buruk atas sumber daya yang menjadi milik Tuhan.",
    en_examples: ["Consistent sleep (7 to 8 hours) as a non-negotiable", "Physical movement, whatever fits your context and body", "Mental rest: time without inputs, screens, or demands", "Emotional awareness: naming what you're carrying"],
    id_examples: ["Tidur yang konsisten (7 hingga 8 jam) sebagai hal yang tidak bisa ditawar", "Gerak fisik, apapun yang sesuai dengan konteks dan tubuhmu", "Istirahat mental: waktu tanpa masukan, layar, atau tuntutan", "Kesadaran emosional: menamakan apa yang kamu tanggung"],
    en_question: "Which of the three, body, mind, or spirit, is most depleted right now? What is one specific thing you could protect for it this week?",
    id_question: "Di antara ketiganya, tubuh, pikiran, atau roh, mana yang paling terkuras saat ini? Apa satu hal konkret yang bisa kamu lindungi untuknya minggu ini?",
    color: orange,
  },
  {
    key: "mutual",
    level: 3,
    en_title: "Peer Care",
    id_title: "Kepedulian Sesama",
    en_subtitle: "Teammates who know the real weight",
    id_subtitle: "Rekan tim yang mengenal beban nyata",
    en_desc: "The people you work alongside are not just colleagues. They are potential co-sustainers. Peer care happens when teammates hold one another's burdens, tell each other the truth, and create space to be human. It requires intentionality: in high-performance cultures, this care is often the first casualty of busyness.",
    id_desc: "Orang-orang yang bekerja bersamamu bukan sekadar rekan kerja. Mereka adalah pemelihara bersama yang potensial. Kepedulian sesama terjadi ketika anggota tim saling menanggung beban, saling mengatakan kebenaran, dan menciptakan ruang untuk menjadi manusia. Ini membutuhkan kesengajaan: dalam budaya berkinerja tinggi, perawatan ini sering menjadi korban pertama dari kesibukan.",
    en_examples: ["Regular honest check-ins with a trusted peer, not just task updates", "Permission to name fatigue without it being seen as weakness", "Cross-cultural teams: acknowledge that care languages differ", "Celebrating wins together, not just pushing through to the next challenge"],
    id_examples: ["Check-in jujur secara teratur dengan rekan yang dipercaya, bukan hanya pembaruan tugas", "Izin untuk mengungkapkan kelelahan tanpa dianggap sebagai kelemahan", "Tim lintas budaya: akui bahwa bahasa kepedulian berbeda-beda", "Merayakan kemenangan bersama, bukan hanya terus mendorong ke tantangan berikutnya"],
    en_question: "Who on your team is watching your pace right now, and what signals are you giving them about what is acceptable for them to carry?",
    id_question: "Siapa di timmu yang sedang mengamati langkahmu saat ini, dan sinyal apa yang kamu berikan kepada mereka tentang apa yang boleh mereka tanggung?",
    color: navy,
  },
  {
    key: "sender",
    level: 4,
    en_title: "Sender Care",
    id_title: "Kepedulian dari Pengirim",
    en_subtitle: "Your agency, church, or organisation",
    id_subtitle: "Lembaga, gereja, atau organisasi kamu",
    en_desc: "Sustainable leaders need a sending community that actively invests in their wellbeing, not just their output. This includes a clear financial sustainability arrangement — however it is structured, it must be openly named and continuously reviewed so that economic stress does not become a permanent background weight — alongside regular pastoral check-ins, accountability structures, and genuine interest in your personal flourishing. If this is missing or broken, that is a structural problem requiring structural solution, not just more personal resilience.",
    id_desc: "Pemimpin yang berkelanjutan membutuhkan komunitas pengirim yang secara aktif berinvestasi dalam kesejahteraan mereka, bukan hanya output mereka. Ini termasuk pengaturan keberlanjutan finansial yang jelas — bagaimanapun strukturnya, harus secara terbuka dibicarakan dan terus ditinjau agar tekanan ekonomi tidak menjadi beban latar belakang yang permanen — disertai check-in pastoral yang teratur, struktur akuntabilitas, dan minat sejati dalam pertumbuhan pribadimu. Jika ini hilang atau rusak, itu adalah masalah struktural yang memerlukan solusi struktural, bukan hanya lebih banyak ketahanan pribadi.",
    en_examples: ["Annual review conversations that include wellbeing, not just performance", "A financial arrangement that is clearly defined, sustainable, and kept under active review", "A pastor or mentor who knows your personal situation", "Clear re-entry support and debriefing after difficult seasons"],
    id_examples: ["Percakapan tinjauan tahunan yang mencakup kesejahteraan, bukan hanya kinerja", "Pengaturan keuangan yang jelas, berkelanjutan, dan ditinjau secara aktif", "Seorang pendeta atau mentor yang mengenal situasi pribadimu", "Dukungan kepulangan dan debriefing yang jelas setelah musim-musim yang sulit"],
    en_question: "What is one thing your sending community doesn't know about how you are really doing right now, and what would it take to tell them before the end of this month? If your sender relationship is healthy, what is one way you could go deeper in it?",
    id_question: "Apa satu hal yang tidak diketahui komunitas pengirimmu tentang kondisimu yang sebenarnya saat ini, dan apa yang diperlukan untuk memberitahu mereka sebelum akhir bulan ini? Jika hubungan pengirimmu sehat, apa satu cara kamu bisa memperdalamnya?",
    color: navy,
  },
  {
    key: "specialist",
    level: 5,
    en_title: "Specialist Care",
    id_title: "Kepedulian Spesialis",
    en_subtitle: "Professional support when you need it",
    id_subtitle: "Dukungan profesional saat kamu membutuhkannya",
    en_desc: "There are moments when the weight you carry requires more than a good friend, a caring team, or a supportive organisation. Professional care (a counsellor, therapist, psychologist, doctor, or spiritual director) is not a sign of failure. It is the wise use of a resource God has provided. In many cross-cultural contexts, seeking specialist care carries stigma. That stigma costs lives and ministries.",
    id_desc: "Ada saat-saat ketika beban yang kamu tanggung membutuhkan lebih dari sekadar teman yang baik, tim yang peduli, atau organisasi yang mendukung. Kepedulian profesional (konselor, terapis, psikolog, dokter, atau direktur spiritual) bukan tanda kegagalan. Itu adalah penggunaan bijak dari sumber daya yang telah Tuhan sediakan. Dalam banyak konteks lintas budaya, mencari kepedulian spesialis membawa stigma. Stigma itu merugikan kehidupan dan pelayanan.",
    en_examples: ["Regular counselling or therapy, preventive rather than crisis response only", "Medical check-ups, including mental health screening", "A spiritual director who provides structured reflection", "Crisis debriefing after traumatic field experiences"],
    id_examples: ["Konseling atau terapi teratur, preventif bukan hanya respons krisis", "Pemeriksaan kesehatan rutin, termasuk skrining kesehatan mental", "Seorang direktur spiritual yang memberikan refleksi terstruktur", "Debriefing krisis setelah pengalaman lapangan yang traumatis"],
    en_question: "Is there something you are carrying that would benefit from a professional conversation? What has been the barrier to seeking it?",
    id_question: "Apakah ada sesuatu yang kamu tanggung yang akan mendapat manfaat dari percakapan profesional? Apa yang selama ini menjadi hambatan untuk mencarinya?",
    color: navy,
  },
];

// -- STRESS AUDIT DATA ---------------------------------------------------------
type StressAuditQuestion = {
  en: string; id: string;
  en_anchor_low: string; id_anchor_low: string;
  en_anchor_high: string; id_anchor_high: string;
};

type StressAuditArea = {
  key: string;
  en_label: string; id_label: string;
  habitCategory: "Body" | "Mind" | "Spirit";
  questions: StressAuditQuestion[];
};

const STRESS_AUDIT: StressAuditArea[] = [
  {
    key: "work-pace",
    en_label: "Work Pace",
    id_label: "Kecepatan Kerja",
    habitCategory: "Mind",
    questions: [
      {
        en: "How often do you end your workday feeling you focused on what matters most, rather than just responding to what was urgent?",
        id: "Seberapa sering kamu mengakhiri hari kerja dengan merasa telah fokus pada hal yang paling penting, bukan hanya merespons yang mendesak?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Consistently", id_anchor_high: "Konsisten",
      },
      {
        en: "When unexpected demands arise, how much margin do you have to absorb them without dropping essential commitments?",
        id: "Ketika tuntutan tak terduga muncul, seberapa besar ruang yang kamu miliki untuk menyerapnya tanpa mengabaikan komitmen penting?",
        en_anchor_low: "No margin", id_anchor_low: "Tidak ada ruang",
        en_anchor_high: "Plenty of room", id_anchor_high: "Banyak ruang",
      },
      {
        en: "How sustainable does your current pace feel? Could you maintain it for another six months without significant personal cost?",
        id: "Seberapa berkelanjutan kecepatan kerjamu saat ini? Bisakah kamu mempertahankannya selama enam bulan lagi tanpa biaya pribadi yang signifikan?",
        en_anchor_low: "Unsustainable", id_anchor_low: "Tidak berkelanjutan",
        en_anchor_high: "Sustainable", id_anchor_high: "Berkelanjutan",
      },
      {
        en: "How clearly have you communicated your workload limits to those who place demands on your time?",
        id: "Seberapa jelas kamu telah mengomunikasikan batas beban kerjamu kepada mereka yang meminta waktumu?",
        en_anchor_low: "Not at all", id_anchor_low: "Sama sekali tidak",
        en_anchor_high: "Very clearly", id_anchor_high: "Sangat jelas",
      },
    ],
  },
  {
    key: "physical",
    en_label: "Physical Health",
    id_label: "Kesehatan Fisik",
    habitCategory: "Body",
    questions: [
      {
        en: "How consistently are you getting 7 to 8 hours of sleep each night?",
        id: "Seberapa konsisten kamu mendapatkan 7 hingga 8 jam tidur setiap malam?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Almost always", id_anchor_high: "Hampir selalu",
      },
      {
        en: "How often are you engaging in physical movement that genuinely restores your energy?",
        id: "Seberapa sering kamu melakukan gerakan fisik yang benar-benar memulihkan energimu?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Regularly", id_anchor_high: "Secara teratur",
      },
      {
        en: "How well are you eating in ways that sustain your energy throughout the day rather than relying on stimulants?",
        id: "Seberapa baik kamu makan dengan cara yang menopang energimu sepanjang hari, bukan mengandalkan stimulan?",
        en_anchor_low: "Poorly", id_anchor_low: "Buruk",
        en_anchor_high: "Well", id_anchor_high: "Baik",
      },
      {
        en: "How would you rate your overall physical energy for the actual demands of your role right now?",
        id: "Bagaimana kamu menilai energi fisik keseluruhanmu untuk tuntutan peranmu saat ini?",
        en_anchor_low: "Depleted", id_anchor_low: "Terkuras",
        en_anchor_high: "Strong", id_anchor_high: "Kuat",
      },
    ],
  },
  {
    key: "spiritual",
    en_label: "Spiritual Depth",
    id_label: "Kedalaman Rohani",
    habitCategory: "Spirit",
    questions: [
      {
        en: "How often do you spend time with God that feels genuinely nourishing rather than obligatory?",
        id: "Seberapa sering kamu menghabiskan waktu bersama Tuhan yang terasa benar-benar memelihara, bukan sekadar kewajiban?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Regularly", id_anchor_high: "Secara teratur",
      },
      {
        en: "How connected do you feel to God's presence in your daily work and relationships, not just in designated spiritual time?",
        id: "Seberapa terhubung kamu dengan kehadiran Tuhan dalam pekerjaan dan hubunganmu sehari-hari, bukan hanya dalam waktu rohani yang ditentukan?",
        en_anchor_low: "Disconnected", id_anchor_low: "Terputus",
        en_anchor_high: "Deeply connected", id_anchor_high: "Sangat terhubung",
      },
      {
        en: "How honest is your prayer life? Does it include your doubts, fears, and frustrations, or mostly your requests and reports?",
        id: "Seberapa jujur kehidupan doamu? Apakah mencakup keraguan, ketakutan, dan frustrasimu, atau sebagian besar hanya permintaan dan laporan?",
        en_anchor_low: "Surface only", id_anchor_low: "Permukaan saja",
        en_anchor_high: "Fully honest", id_anchor_high: "Sepenuhnya jujur",
      },
      {
        en: "How embedded are you in a local community of faith where you genuinely receive, rather than only give?",
        id: "Seberapa tertanam kamu dalam komunitas iman lokal di mana kamu benar-benar menerima, bukan hanya memberi?",
        en_anchor_low: "Isolated", id_anchor_low: "Terisolasi",
        en_anchor_high: "Well embedded", id_anchor_high: "Sangat tertanam",
      },
    ],
  },
  {
    key: "relationships",
    en_label: "Key Relationships",
    id_label: "Hubungan Utama",
    habitCategory: "Spirit",
    questions: [
      {
        en: "How many people in your life have full access to how you are really doing: not your ministry update, but your actual state?",
        id: "Berapa banyak orang dalam hidupmu yang memiliki akses penuh ke kondisimu yang sesungguhnya: bukan pembaruan pelayananmu, tetapi keadaanmu yang sebenarnya?",
        en_anchor_low: "No one", id_anchor_low: "Tidak ada",
        en_anchor_high: "Several", id_anchor_high: "Beberapa",
      },
      {
        en: "How much genuine mutual support exists in your closest work relationships? Can weight be shared?",
        id: "Seberapa besar dukungan saling yang tulus dalam hubungan kerjamu yang paling dekat? Bisakah beban dibagi?",
        en_anchor_low: "Very little", id_anchor_low: "Sangat sedikit",
        en_anchor_high: "Significant", id_anchor_high: "Signifikan",
      },
      {
        en: "How honest are your most important relationships? Can difficult things be said and received without damage?",
        id: "Seberapa jujur hubunganmu yang paling penting? Bisakah hal-hal sulit dikatakan dan diterima tanpa merusak?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Consistently", id_anchor_high: "Konsisten",
      },
      {
        en: "How connected do you feel to the people who matter most to you right now?",
        id: "Seberapa terhubung kamu dengan orang-orang yang paling berarti bagimu saat ini?",
        en_anchor_low: "Distant", id_anchor_low: "Jauh",
        en_anchor_high: "Close", id_anchor_high: "Dekat",
      },
    ],
  },
  {
    key: "finances",
    en_label: "Financial Stability",
    id_label: "Stabilitas Keuangan",
    habitCategory: "Mind",
    questions: [
      {
        en: "How often does financial concern actively occupy your attention as a source of stress?",
        id: "Seberapa sering kekhawatiran finansial secara aktif menyita perhatianmu sebagai sumber stres?",
        en_anchor_low: "Daily", id_anchor_low: "Setiap hari",
        en_anchor_high: "Rarely", id_anchor_high: "Jarang",
      },
      {
        en: "How adequately does your current income or support meet your basic needs and existing commitments?",
        id: "Seberapa memadai penghasilan atau dukunganmu saat ini untuk memenuhi kebutuhan dasar dan komitmen yang ada?",
        en_anchor_low: "Not adequately", id_anchor_low: "Tidak memadai",
        en_anchor_high: "Well", id_anchor_high: "Baik",
      },
      {
        en: "How much financial margin do you have to absorb unexpected costs without significant anxiety?",
        id: "Seberapa besar ruang finansial yang kamu miliki untuk menyerap biaya tak terduga tanpa kecemasan yang signifikan?",
        en_anchor_low: "None", id_anchor_low: "Tidak ada",
        en_anchor_high: "Significant", id_anchor_high: "Signifikan",
      },
      {
        en: "How stable does your financial situation feel looking six months ahead?",
        id: "Seberapa stabil situasi finansialmu jika melihat enam bulan ke depan?",
        en_anchor_low: "Very uncertain", id_anchor_low: "Sangat tidak pasti",
        en_anchor_high: "Stable", id_anchor_high: "Stabil",
      },
    ],
  },
  {
    key: "family",
    en_label: "Family Health",
    id_label: "Kesehatan Keluarga",
    habitCategory: "Spirit",
    questions: [
      {
        en: "How present and genuinely connected are you with your family in the time you spend together, not physically present but mentally elsewhere?",
        id: "Seberapa hadir dan benar-benar terhubung kamu dengan keluargamu dalam waktu yang kamu habiskan bersama, bukan sekadar hadir secara fisik tetapi pikiran di tempat lain?",
        en_anchor_low: "Rarely present", id_anchor_low: "Jarang hadir",
        en_anchor_high: "Fully present", id_anchor_high: "Sepenuhnya hadir",
      },
      {
        en: "How well does your family understand and actively support the demands of your calling?",
        id: "Seberapa baik keluargamu memahami dan secara aktif mendukung tuntutan panggilanmu?",
        en_anchor_low: "Poorly", id_anchor_low: "Buruk",
        en_anchor_high: "Very well", id_anchor_high: "Sangat baik",
      },
      {
        en: "How often does work pressure spill into your home environment in ways that damage family relationships?",
        id: "Seberapa sering tekanan pekerjaan merembes ke lingkungan rumahmu dengan cara yang merusak hubungan keluarga?",
        en_anchor_low: "Frequently", id_anchor_low: "Sering",
        en_anchor_high: "Rarely", id_anchor_high: "Jarang",
      },
      {
        en: "How would the people closest to you describe your availability to them right now?",
        id: "Bagaimana orang-orang terdekatmu akan menggambarkan ketersediaanmu bagi mereka saat ini?",
        en_anchor_low: "Largely unavailable", id_anchor_low: "Sebagian besar tidak tersedia",
        en_anchor_high: "Genuinely available", id_anchor_high: "Benar-benar tersedia",
      },
    ],
  },
  {
    key: "purpose",
    en_label: "Sense of Purpose",
    id_label: "Rasa Tujuan",
    habitCategory: "Spirit",
    questions: [
      {
        en: "How clearly connected is your daily work to the calling that brought you to it in the first place?",
        id: "Seberapa jelas pekerjaan harianmu terhubung dengan panggilan yang membawamu ke sini sejak awal?",
        en_anchor_low: "Disconnected", id_anchor_low: "Terputus",
        en_anchor_high: "Very clear", id_anchor_high: "Sangat jelas",
      },
      {
        en: "How motivated do you feel by the work itself, not by obligation or duty, but genuine engagement?",
        id: "Seberapa termotivasi kamu oleh pekerjaan itu sendiri, bukan karena kewajiban atau tugas, tetapi keterlibatan yang tulus?",
        en_anchor_low: "Disengaged", id_anchor_low: "Tidak terlibat",
        en_anchor_high: "Genuinely motivated", id_anchor_high: "Benar-benar termotivasi",
      },
      {
        en: "How often do you experience a concrete sense of meaning and contribution in what you do?",
        id: "Seberapa sering kamu merasakan makna dan kontribusi yang nyata dalam apa yang kamu lakukan?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Regularly", id_anchor_high: "Secara teratur",
      },
      {
        en: "How aligned does your current role feel with where you believe God is leading you?",
        id: "Seberapa selaras peranmu saat ini dengan ke mana kamu percaya Tuhan sedang membimbingmu?",
        en_anchor_low: "Misaligned", id_anchor_low: "Tidak selaras",
        en_anchor_high: "Strongly aligned", id_anchor_high: "Sangat selaras",
      },
    ],
  },
  {
    key: "emotional",
    en_label: "Emotional Processing",
    id_label: "Pemrosesan Emosi",
    habitCategory: "Mind",
    questions: [
      {
        en: "How well do you identify and name your emotional state as you are experiencing it, rather than suppressing it?",
        id: "Seberapa baik kamu mengidentifikasi dan menamakan kondisi emosionalmu saat mengalaminya, bukan menekannya?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Consistently", id_anchor_high: "Konsisten",
      },
      {
        en: "How often do you actively process difficult experiences: with a trusted person, through writing, or in honest prayer?",
        id: "Seberapa sering kamu secara aktif memproses pengalaman sulit: dengan orang yang dipercaya, melalui tulisan, atau dalam doa yang jujur?",
        en_anchor_low: "Almost never", id_anchor_low: "Hampir tidak pernah",
        en_anchor_high: "Regularly", id_anchor_high: "Secara teratur",
      },
      {
        en: "How much unprocessed weight are you carrying right now: things you have not had space to work through?",
        id: "Seberapa besar beban yang belum diproses yang kamu tanggung saat ini: hal-hal yang belum sempat kamu selesaikan?",
        en_anchor_low: "Very heavy", id_anchor_low: "Sangat berat",
        en_anchor_high: "Minimal", id_anchor_high: "Minimal",
      },
      {
        en: "How emotionally honest are you with the people closest to you about what you are actually carrying?",
        id: "Seberapa jujur kamu secara emosional dengan orang-orang terdekatmu tentang apa yang sebenarnya kamu tanggung?",
        en_anchor_low: "Very guarded", id_anchor_low: "Sangat tertutup",
        en_anchor_high: "Fully open", id_anchor_high: "Sepenuhnya terbuka",
      },
    ],
  },
  {
    key: "creative",
    en_label: "Creative Expression",
    id_label: "Ekspresi Kreatif",
    habitCategory: "Body",
    questions: [
      {
        en: "How often do you engage in a creative activity that is genuinely disconnected from your ministry or professional role?",
        id: "Seberapa sering kamu terlibat dalam aktivitas kreatif yang benar-benar terpisah dari pelayanan atau peran profesionalmu?",
        en_anchor_low: "Never", id_anchor_low: "Tidak pernah",
        en_anchor_high: "Regularly", id_anchor_high: "Secara teratur",
      },
      {
        en: "How alive does your inner creative life feel right now: your capacity for wonder, play, and making?",
        id: "Seberapa hidup kehidupan kreatif batinmu saat ini: kapasitasmu untuk kekaguman, bermain, dan berkreasi?",
        en_anchor_low: "Dry", id_anchor_low: "Kering",
        en_anchor_high: "Alive", id_anchor_high: "Hidup",
      },
      {
        en: "How much time do you give to activities that restore you through beauty, exploration, or simply doing something you enjoy?",
        id: "Seberapa banyak waktu yang kamu berikan untuk aktivitas yang memulihkanmu melalui keindahan, eksplorasi, atau sekadar melakukan sesuatu yang kamu nikmati?",
        en_anchor_low: "Almost none", id_anchor_low: "Hampir tidak ada",
        en_anchor_high: "Meaningful time", id_anchor_high: "Waktu yang berarti",
      },
      {
        en: "How often do you create or explore something simply for the joy of it, with no outcome in mind?",
        id: "Seberapa sering kamu menciptakan atau menjelajahi sesuatu hanya karena kesenangannya, tanpa tujuan tertentu?",
        en_anchor_low: "Never", id_anchor_low: "Tidak pernah",
        en_anchor_high: "Often", id_anchor_high: "Sering",
      },
    ],
  },
  {
    key: "rest",
    en_label: "Regular Rest",
    id_label: "Istirahat Teratur",
    habitCategory: "Body",
    questions: [
      {
        en: "How consistently are you protecting one full day each week as genuine rest, genuinely offline from your responsibilities?",
        id: "Seberapa konsisten kamu melindungi satu hari penuh setiap minggu sebagai istirahat sejati, benar-benar offline dari tanggung jawabmu?",
        en_anchor_low: "Rarely", id_anchor_low: "Jarang",
        en_anchor_high: "Consistently", id_anchor_high: "Konsisten",
      },
      {
        en: "How restful is the rest you take? Are you truly recovering, or are you resting while remaining mentally on?",
        id: "Seberapa memulihkan istirahat yang kamu ambil? Apakah kamu benar-benar pulih, atau beristirahat sambil tetap aktif secara mental?",
        en_anchor_low: "Not restful", id_anchor_low: "Tidak memulihkan",
        en_anchor_high: "Genuinely restorative", id_anchor_high: "Benar-benar memulihkan",
      },
      {
        en: "How much guilt or resistance do you experience when you stop working before all the tasks are done?",
        id: "Seberapa besar rasa bersalah atau penolakan yang kamu rasakan ketika berhenti bekerja sebelum semua tugas selesai?",
        en_anchor_low: "Significant guilt", id_anchor_low: "Rasa bersalah yang besar",
        en_anchor_high: "Little or none", id_anchor_high: "Sedikit atau tidak ada",
      },
      {
        en: "How intentional are you about creating genuine silence and stillness in your week?",
        id: "Seberapa disengaja kamu dalam menciptakan keheningan dan ketenangan sejati dalam minggumu?",
        en_anchor_low: "Not intentional", id_anchor_low: "Tidak disengaja",
        en_anchor_high: "Very intentional", id_anchor_high: "Sangat disengaja",
      },
    ],
  },
];

// -- HABITS DATA ---------------------------------------------------------------
const HABIT_CATEGORIES: {
  key: string;
  en_title: string; id_title: string;
  en_tagline: string; id_tagline: string;
  en_desc: string; id_desc: string;
  habits: { en: string; id: string; }[];
  color: string;
  letter: string;
  id_letter: string;
}[] = [
  {
    key: "body",
    letter: "B",
    id_letter: "T",
    color: navy,
    en_title: "Body",
    id_title: "Tubuh",
    en_tagline: "Your physical instrument",
    id_tagline: "Instrumen fisik kamu",
    en_desc: "Your body is not separate from your ministry — it is the medium through which all of it happens. Leaders who neglect their physical health are not more sacrificial. They are less sustainable. Treat your body as the instrument it is.",
    id_desc: "Tubuh kamu tidak terpisah dari pelayanan kamu — tubuh adalah medium di mana semua itu terjadi. Pemimpin yang mengabaikan kesehatan fisik mereka tidak lebih berkorban. Mereka lebih cepat habis. Perlakukan tubuh kamu sebagai instrumen yang seharusnya.",
    habits: [
      {
        en: "Sleep 7 to 8 hours⁷. Not as a reward for finishing, but as a daily non-negotiable. Chronic sleep debt is not dedication — it is slow self-destruction.",
        id: "Tidur 7 hingga 8 jam⁷. Bukan sebagai hadiah karena sudah menyelesaikan pekerjaan, tetapi sebagai hal yang tidak bisa ditawar setiap hari. Kekurangan tidur kronis bukan dedikasi — itu adalah penghancuran diri yang perlahan.",
      },
      {
        en: "Move your body for 30 minutes, three times a week. Adapt the form to your context — walking is enough. Your cardiovascular health predicts your cognitive sharpness⁸.",
        id: "Gerakkan tubuh kamu selama 30 menit, tiga kali seminggu. Sesuaikan bentuknya dengan konteks kamu — berjalan kaki sudah cukup. Kesehatan kardiovaskular kamu memprediksi ketajaman kognitif kamu⁸.",
      },
      {
        en: "Eat food that sustains rather than numbs. In high-stress seasons, leaders often default to stimulants (caffeine, sugar) and neglect real nutrition. Notice the pattern.",
        id: "Makan makanan yang menopang daripada mematikan rasa. Dalam musim penuh tekanan, pemimpin sering beralih ke stimulan (kafein, gula) dan mengabaikan nutrisi yang sesungguhnya. Perhatikan pola ini.",
      },
    ],
  },
  {
    key: "mind",
    letter: "M",
    id_letter: "P",
    color: navy,
    en_title: "Mind",
    id_title: "Pikiran",
    en_tagline: "Your cognitive and emotional capacity",
    id_tagline: "Kapasitas kognitif dan emosional kamu",
    en_desc: "The mind needs input, processing time, and genuine limits. Leaders who never stop taking in information, never process what they experience, and never set cognitive limits eventually produce neither wisdom nor clarity — only noise.",
    id_desc: "Pikiran membutuhkan masukan, waktu pemrosesan, dan batasan yang sesungguhnya. Pemimpin yang tidak pernah berhenti menerima informasi, tidak pernah memproses pengalaman mereka, dan tidak pernah menetapkan batasan kognitif pada akhirnya tidak menghasilkan kebijaksanaan atau kejernihan — hanya kebisingan.",
    habits: [
      {
        en: "Read one book every month — not for professional development only, but for joy, breadth, and perspective. Narrow minds lead narrow organisations.",
        id: "Baca satu buku setiap bulan — bukan hanya untuk pengembangan profesional, tetapi untuk kesenangan, wawasan, dan perspektif. Pikiran yang sempit memimpin organisasi yang sempit.",
      },
      {
        en: "Create 20 minutes of daily processing time — journalling, walking without a podcast, or quiet prayer. Your brain needs white space to integrate experience into learning.",
        id: "Ciptakan 20 menit waktu pemrosesan harian — jurnal, berjalan tanpa podcast, atau doa yang tenang. Otak kamu membutuhkan ruang kosong untuk mengintegrasikan pengalaman menjadi pembelajaran.",
      },
      {
        en: "Set a digital boundary: no screens for the first 30 minutes of your morning and the last 30 minutes before sleep. These are your highest-value thinking windows — protect them.",
        id: "Tetapkan batasan digital: tidak ada layar selama 30 menit pertama di pagi hari dan 30 menit terakhir sebelum tidur. Ini adalah jendela berpikir bernilai tertinggi kamu — lindungi mereka.",
      },
    ],
  },
  {
    key: "spirit",
    letter: "S",
    id_letter: "R",
    color: navy,
    en_title: "Spirit",
    id_title: "Roh",
    en_tagline: "Your connection to the source",
    id_tagline: "Koneksi kamu ke sumber",
    en_desc: "Spiritual health is not measured by religious activity — it is measured by your connectedness to God. A leader can be extraordinarily busy with spiritual work and be spiritually empty. The habits here are not about performance. They are about remaining connected to the one who called you.",
    id_desc: "Kesehatan rohani tidak diukur dari aktivitas keagamaan — tetapi dari koneksi kamu dengan Tuhan. Seorang pemimpin bisa sangat sibuk dengan pekerjaan rohani dan tetap kosong secara rohani. Kebiasaan di sini bukan tentang performa. Ini tentang tetap terhubung dengan Dia yang memanggil kamu.",
    habits: [
      {
        en: "Pray honestly — including your doubts, frustrations, and fears. Jesus withdrew to solitary places not to report his successes but to remain in communion with the Father.",
        id: "Berdoa dengan jujur — termasuk keraguan, frustrasi, dan ketakutan kamu. Yesus menyingkir ke tempat-tempat yang sunyi bukan untuk melaporkan keberhasilan-Nya tetapi untuk tetap berada dalam persekutuan dengan Bapa.",
      },
      {
        en: "Read Scripture slowly — not for sermon preparation or content production, but for personal nourishment. Two verses read meditatively sustain more than two chapters read for information.",
        id: "Baca Kitab Suci dengan perlahan — bukan untuk persiapan khotbah atau produksi konten, tetapi untuk pemeliharaan pribadi. Dua ayat yang dibaca secara meditatif memberikan lebih banyak sustansi daripada dua pasal yang dibaca hanya untuk informasi.",
      },
      {
        en: "Stay embedded in a local community of faith. Cross-cultural leaders are especially vulnerable to becoming 'everyone's pastor and no one's parishioner.' Find a community where you receive, not only give.",
        id: "Tetaplah terhubung dalam komunitas iman lokal. Pemimpin lintas budaya sangat rentan menjadi 'gembala semua orang dan jemaat tidak seorang pun.' Temukan komunitas di mana kamu menerima, bukan hanya memberi.",
      },
    ],
  },
];

// -- FIELD STORY ---------------------------------------------------------------
const FIELD_STORY = {
  en: "A field worker I know — I'll call her Miriam — sent me a message at 11pm on a Tuesday. She was asking for advice about her team. She wasn't burned out yet. Or so she thought.\n\nWe talked for an hour. Somewhere in the middle of the conversation, she mentioned she hadn't taken a full day off in four months. She said it almost as an aside, as if it were unremarkable.\n\nI asked how that felt. She said it felt normal. That was the part that worried me.\n\nWhen I pressed further, the picture became clearer. Her organisation had no structured pastoral check-in. Her sending church's idea of support was a WhatsApp message once a month. Her teammates were equally overloaded — so asking anyone for help felt like adding to their burden. She was quietly filling every role that wasn't getting filled, without telling anyone.\n\nThe spheres around her had collapsed one by one. Not dramatically. Just gradually.\n\nWhat she described wasn't a character flaw. It was an architecture problem. She had been faithful in every visible dimension — the work was good, the relationships were real, the impact was measurable. But no one had built the scaffolding that was supposed to hold her up. And she had been too busy holding everyone else up to notice.\n\nWe made a plan. She started with the Stress Audit. Her scores on Peer Care and Sender Care were the lowest. She started one honest conversation with her team leader. Then another. Slowly, the invisible weight became something speakable.\n\nShe is still in the field. She is pacing differently now. Not perfectly — but she knows what the slippage looks like, and she has people who notice it too.\n\nThat is the difference sustainable pace makes. Not the absence of pressure. Just the architecture to hold you when it comes.",
  id: "Seorang pekerja lapangan yang saya kenal — sebut saja Miriam — mengirim pesan pukul 11 malam di hari Selasa. Dia meminta saran tentang timnya. Dia belum burnout. Begitu pikirnya.\n\nKami berbicara selama satu jam. Di tengah percakapan, dia menyebutkan bahwa dia tidak mengambil hari libur penuh selama empat bulan. Dia mengatakannya hampir sebagai tambahan, seolah itu bukan hal yang luar biasa.\n\nSaya bertanya bagaimana rasanya. Dia bilang terasa normal. Bagian itulah yang membuat saya khawatir.\n\nKetika saya terus bertanya, gambarannya semakin jelas. Organisasinya tidak memiliki check-in pastoral yang terstruktur. Cara gereja pengirimnya memberikan dukungan adalah pesan WhatsApp sekali sebulan. Rekan-rekannya sama-sama kelebihan beban — jadi meminta bantuan kepada siapa pun terasa seperti menambah beban mereka. Dia diam-diam mengisi setiap peran yang tidak terisi, tanpa memberi tahu siapa pun.\n\nLingkup kepedulian di sekitarnya runtuh satu per satu. Bukan secara dramatis. Hanya secara bertahap.\n\nApa yang dia gambarkan bukan cacat karakter. Itu masalah arsitektur. Dia telah setia dalam setiap dimensi yang terlihat — pekerjaannya baik, hubungannya nyata, dampaknya terukur. Tetapi tidak ada yang membangun perancah yang seharusnya menopangnya. Dan dia terlalu sibuk menopang orang lain untuk menyadarinya.\n\nKami membuat rencana. Dia memulai dengan Audit Stres. Skornya pada Kepedulian Sesama dan Kepedulian dari Pengirim adalah yang terendah. Dia memulai satu percakapan jujur dengan pemimpin timnya. Lalu satu lagi. Perlahan, beban yang tidak terlihat menjadi sesuatu yang bisa dibicarakan.\n\nDia masih di lapangan. Sekarang dia mengatur kecepatannya secara berbeda. Tidak sempurna — tetapi dia tahu seperti apa kemerosotan itu, dan ada orang-orang yang juga memperhatikannya.\n\nItulah perbedaan yang dibuat oleh kecepatan yang berkelanjutan. Bukan ketiadaan tekanan. Hanya arsitektur untuk menopangmu ketika tekanan itu datang.",
};

// -- PROPS ---------------------------------------------------------------------
type Props = { userPathway: string | null; isSaved: boolean };

// -- COMPONENT -----------------------------------------------------------------
export default function SustainablePaceClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeSphere, setActiveSphere] = useState<SphereKey | null>(null);
  const [openHabit, setOpenHabit] = useState<string | null>(null);

  // Stress Audit sequential state
  const [auditStarted, setAuditStarted] = useState(false);
  const [auditAreaIndex, setAuditAreaIndex] = useState(0);
  const [auditQuestionIndex, setAuditQuestionIndex] = useState(0);
  const [auditAnswers, setAuditAnswers] = useState<Record<string, number[]>>({});
  const [auditComplete, setAuditComplete] = useState(false);

  const t = (en: string, id: string) => lang === "en" ? en : id;

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("sustainable-pace");
      setSaved(true);
    });
  }

  function handleAuditAnswer(score: number) {
    const area = STRESS_AUDIT[auditAreaIndex];
    const currentAnswers = auditAnswers[area.key] ?? [];
    const updatedAnswers = [...currentAnswers, score];
    const newAnswers = { ...auditAnswers, [area.key]: updatedAnswers };
    setAuditAnswers(newAnswers);

    const totalQuestions = area.questions.length;
    if (auditQuestionIndex + 1 < totalQuestions) {
      setAuditQuestionIndex(auditQuestionIndex + 1);
    } else if (auditAreaIndex + 1 < STRESS_AUDIT.length) {
      setAuditAreaIndex(auditAreaIndex + 1);
      setAuditQuestionIndex(0);
    } else {
      setAuditComplete(true);
    }
  }

  function resetAudit() {
    setAuditStarted(false);
    setAuditAreaIndex(0);
    setAuditQuestionIndex(0);
    setAuditAnswers({});
    setAuditComplete(false);
  }

  const totalQuestionCount = STRESS_AUDIT.reduce((sum, a) => sum + a.questions.length, 0);
  const answeredCount = Object.values(auditAnswers).reduce((sum, arr) => sum + arr.length, 0);

  // Compute area averages for summary
  const areaAverages: { area: StressAuditArea; avg: number }[] = STRESS_AUDIT.map(area => {
    const answers = auditAnswers[area.key] ?? [];
    const avg = answers.length > 0
      ? Math.round((answers.reduce((a, b) => a + b, 0) / answers.length) * 10) / 10
      : 0;
    return { area, avg };
  });

  const lowestArea = auditComplete
    ? areaAverages.reduce((min, curr) => curr.avg < min.avg ? curr : min, areaAverages[0])
    : null;

  const getScoreColor = (score: number) => {
    if (score <= 2) return "oklch(55% 0.18 25)";
    if (score <= 3) return orange;
    return "oklch(45% 0.14 145)";
  };

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* -- HERO: SURVIVING VS THRIVING -- */}
      <section id="mc-sabbath-ref" style={{ background: navy, padding: "96px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 0%, oklch(30% 0.12 260 / 0.6) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <img
          src="/images/resources/sustainable-pace/hero.jpg"
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
            color: orange, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 20,
          }}>
            {t("PERSONAL DEVELOPMENT", "PENGEMBANGAN PRIBADI")}
          </p>
          <h1 style={{
            fontFamily: serif, fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 700, color: offWhite, lineHeight: 1.1, fontStyle: "italic",
            marginBottom: 32,
          }}>
            {t("Surviving vs. Thriving", "Bertahan vs. Berkembang")}
          </h1>
          <div style={{ width: 48, height: 2, background: orange, marginBottom: 36 }} />
          <p style={{
            fontFamily: serif, fontSize: "clamp(18px, 2.4vw, 24px)",
            color: "oklch(80% 0.03 80)", lineHeight: 1.75, marginBottom: 16,
            fontStyle: "italic", maxWidth: 640,
          }}>
            {t(
              "Most leaders are not failing. They are surviving — managing output while quietly depleting. The question this module asks is not: can you keep going? It is: are you building to last?",
              "Kebanyakan pemimpin tidak gagal. Mereka sedang bertahan — mengelola output sambil diam-diam menguras diri. Pertanyaan yang diajukan modul ini bukan: bisakah kamu terus berjalan? Melainkan: apakah kamu sedang membangun untuk bertahan lama?"
            )}
          </p>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600,
            color: "oklch(55% 0.06 260)", lineHeight: 1.65, maxWidth: 600, marginBottom: 48,
          }}>
            {t(
              "This is not the Sabbath module — that is about theological rest. This is practical. It is about the architecture of your personal health: the systems, habits, and support structures that determine whether you are still effective in 10 years.",
              "Ini bukan modul Sabat — itu tentang istirahat teologis. Ini bersifat praktis. Ini tentang arsitektur kesehatan pribadi kamu: sistem, kebiasaan, dan struktur dukungan yang menentukan apakah kamu masih efektif dalam 10 tahun ke depan."
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
                "Pagi-pagi benar, waktu hari masih gelap, Ia bangun dan pergi ke luar. Ia pergi ke tempat yang sunyi dan berdoa di sana."
              )}"
            </p>
            <p style={{ fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
              <button
                onClick={() => setActiveVerse("mark-1-35")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: orange, fontWeight: 700, fontSize: 12,
                  textDecoration: "underline dotted", textUnderlineOffset: 3, padding: 0,
                }}
              >
                {t("Mark 1:35", "Markus 1:35")}
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
                padding: "12px 28px",
                background: "transparent",
                border: `1.5px solid oklch(55% 0.05 260)`,
                cursor: saved ? "default" : isPending ? "wait" : "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                color: offWhite, letterSpacing: "0.04em", borderRadius: 8,
                opacity: saved ? 0.7 : 1,
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              {saved ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  {t("Saved to Dashboard", "Tersimpan di Dashboard")}
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  {isPending ? t("Saving...", "Menyimpan...") : t("Save to Dashboard", "Simpan ke Dashboard")}
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* -- SECTION I: THE KEY QUESTION -- */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32,
          }}>
            {t("I. The Question Behind the Question", "I. Pertanyaan di Balik Pertanyaan")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic",
          }}>
            {t("What Does It Cost to Keep Going?", "Berapa Harga untuk Terus Berjalan?")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 28 }}>
              {t(
                "The ReMap research¹ — one of the most extensive studies of cross-cultural worker attrition ever conducted — found that the majority of preventable departures were not caused by theological failure, moral collapse, or lack of vision. They were caused by neglect of personal health: physical depletion, relational isolation, emotional overload, and lack of adequate support structures.",
                "Penelitian ReMap¹ — salah satu studi paling ekstensif tentang keluarnya pekerja lintas budaya yang pernah dilakukan — menemukan bahwa mayoritas keberangkatan yang dapat dicegah tidak disebabkan oleh kegagalan teologis, keruntuhan moral, atau kurangnya visi. Mereka disebabkan oleh pengabaian kesehatan pribadi: kelelahan fisik, isolasi relasional, kelebihan emosional, dan kurangnya struktur dukungan yang memadai."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "The insight is confronting: most leaders who leave the field — or who stay but become shadows of themselves — were not undone by the hard things. They were undone by the slow accumulation of small depletions they never addressed.",
                "Pemahamannya mengejutkan: sebagian besar pemimpin yang meninggalkan lapangan — atau yang tetap tetapi menjadi bayang-bayang diri mereka sendiri — tidak dihancurkan oleh hal-hal yang sulit. Mereka dihancurkan oleh akumulasi perlahan dari penipisan kecil yang tidak pernah mereka tangani."
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
                "Perawatan proaktif mencegah keluarnya para pemimpin. Ini bukan kemewahan yang disimpan untuk mereka yang memiliki energi berlebih. Ini adalah strategi yang membuat kamu tetap dalam pekerjaan cukup lama untuk melihatnya berbuah."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "Jesus modelled this. The most effective leader in human history regularly withdrew from the work — before dawn, to solitary places — not as indulgence, but as the deep rhythm that sustained everything else. He was not less missional because he withdrew. He was more effective because of it.",
                "Yesus memodelkan hal ini. Pemimpin paling efektif dalam sejarah manusia secara teratur mengundurkan diri dari pekerjaan — sebelum fajar, ke tempat-tempat yang sunyi — bukan sebagai kemewahan, tetapi sebagai ritme mendalam yang menopang segalanya. Ia tidak kurang bermisi karena menyingkir. Ia lebih efektif karena hal itu."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* -- SECTION II: THE FIVE SPHERES -- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center",
          }}>
            {t("II. The O'Donnell Model", "II. Model O'Donnell")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("The Five Spheres of Care", "Lima Lingkup Kepedulian")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: bodyText, lineHeight: 1.85, maxWidth: 640,
            margin: "0 auto 20px", textAlign: "center",
          }}>
            {t(
              "Kelly O'Donnell's² member care framework identifies five concentric levels of care that every long-term leader needs. No single level is sufficient alone — resilience requires all five.",
              "Kerangka perawatan anggota Kelly O'Donnell² mengidentifikasi lima tingkat perawatan konsentris yang dibutuhkan setiap pemimpin jangka panjang. Tidak ada satu tingkat yang cukup sendiri — ketahanan membutuhkan kelima level tersebut."
            )}
          </p>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
            color: "oklch(55% 0.06 260)", textAlign: "center", marginBottom: 64, fontStyle: "italic",
          }}>
            {t(
              "Click any sphere to explore what it means and how strong yours is right now.",
              "Klik lingkup mana saja untuk menjelajahi artinya dan seberapa kuat kondisi kamu saat ini."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 700, margin: "0 auto 48px" }}>
            {SPHERES.map((sphere) => {
              const isActive = activeSphere === sphere.key;
              return (
                <div key={sphere.key} style={{ borderBottom: `1px solid oklch(85% 0.008 260)` }}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveSphere(isActive ? null : sphere.key)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setActiveSphere(isActive ? null : sphere.key); }}
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      background: isActive ? offWhite : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      transition: "background 0.15s",
                      outline: "none",
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
                        {lang === "en" ? sphere.en_title : sphere.id_title}
                      </div>
                      <div style={{ fontFamily: serif, fontSize: 14, color: bodyText, fontStyle: "italic" }}>
                        {lang === "en" ? sphere.en_subtitle : sphere.id_subtitle}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 18, color: sphere.color, fontWeight: 300,
                      transform: isActive ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s", flexShrink: 0,
                    }}>
                      +
                    </span>
                  </div>

                  {isActive && (
                    <div style={{
                      padding: "0 24px 32px 80px",
                      background: offWhite,
                    }}>
                      <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: bodyText, lineHeight: 1.85, marginBottom: 24 }}>
                        {lang === "en" ? sphere.en_desc : sphere.id_desc}
                      </p>
                      <div style={{ marginBottom: 20 }}>
                        <p style={{
                          fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                          letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 10,
                        }}>
                          {t("What This Looks Like", "Bagaimana Ini Terlihat")}
                        </p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                          {(lang === "en" ? sphere.en_examples : sphere.id_examples).map((ex, i) => (
                            <li key={i} style={{
                              display: "flex", gap: 10, alignItems: "flex-start",
                              marginBottom: 8, fontFamily: serif,
                              fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.6, color: bodyText,
                            }}>
                              <span style={{ color: sphere.color, fontWeight: 700, flexShrink: 0, marginTop: 3 }}>›</span>
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{
                        background: lightGray, borderRadius: 10, padding: "18px 20px",
                        borderLeft: `3px solid ${sphere.color}`,
                      }}>
                        <p style={{
                          fontFamily: serif, fontSize: "clamp(14px, 1.5vw, 16px)",
                          color: navy, lineHeight: 1.7, fontStyle: "italic", margin: 0,
                        }}>
                          {lang === "en" ? sphere.en_question : sphere.id_question}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -- SECTION III: THE STRESS AUDIT -- */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16,
          }}>
            {t("III. The Stress Audit", "III. Audit Stres")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2, fontStyle: "italic",
          }}>
            {t("Where Are You Right Now?", "Di Mana Kamu Sekarang?")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: bodyText, lineHeight: 1.85, maxWidth: 640, marginBottom: 40,
          }}>
            {t(
              "Forty questions across ten areas. Answer honestly. No one sees your results. The audit takes about five minutes and gives you a clear picture of where your energy is actually going.",
              "Empat puluh pertanyaan di sepuluh area. Jawab dengan jujur. Hasilnya hanya untuk kamu. Audit ini membutuhkan sekitar lima menit dan memberikanmu gambaran jelas tentang ke mana energimu sebenarnya pergi."
            )}
          </p>

          {/* Before audit starts */}
          {!auditStarted && !auditComplete && (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setAuditStarted(true)}
                style={{
                  padding: "16px 48px", background: navy, color: offWhite, border: "none",
                  borderRadius: 4, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                  fontSize: 14, letterSpacing: "0.06em", cursor: "pointer",
                }}
              >
                {t("Start Audit", "Mulai Audit")}
              </button>
            </div>
          )}

          {/* During audit */}
          {auditStarted && !auditComplete && (() => {
            const area = STRESS_AUDIT[auditAreaIndex];
            const question = area.questions[auditQuestionIndex];
            const progressPct = Math.round((answeredCount / totalQuestionCount) * 100);
            const descriptors = [
              { score: 1, en: lang === "en" ? question.en_anchor_low : question.id_anchor_low, id: lang === "en" ? question.en_anchor_low : question.id_anchor_low },
              { score: 2, en: t("Rarely", "Jarang"), id: t("Rarely", "Jarang") },
              { score: 3, en: t("Sometimes", "Kadang-kadang"), id: t("Sometimes", "Kadang-kadang") },
              { score: 4, en: t("Often", "Sering"), id: t("Often", "Sering") },
              { score: 5, en: lang === "en" ? question.en_anchor_high : question.id_anchor_high, id: lang === "en" ? question.en_anchor_high : question.id_anchor_high },
            ];
            return (
              <div>
                {/* Progress bar */}
                <div style={{ height: 4, background: lightGray, borderRadius: 4, marginBottom: 32, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progressPct}%`, background: orange, transition: "width 0.3s" }} />
                </div>
                {/* Area + question counters */}
                <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em" }}>
                    {t(`Area ${auditAreaIndex + 1} of ${STRESS_AUDIT.length}`, `Area ${auditAreaIndex + 1} dari ${STRESS_AUDIT.length}`)}
                    {": "}
                    {lang === "en" ? area.en_label : area.id_label}
                  </span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText }}>
                    {t(`Question ${auditQuestionIndex + 1} of ${area.questions.length}`, `Pertanyaan ${auditQuestionIndex + 1} dari ${area.questions.length}`)}
                  </span>
                </div>
                {/* Question text */}
                <p style={{
                  fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 26px)",
                  fontWeight: 700, color: navy, lineHeight: 1.55, marginBottom: 40,
                  fontStyle: "italic", maxWidth: 700,
                }}>
                  {lang === "en" ? question.en : question.id}
                </p>
                {/* Response options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 560 }}>
                  {descriptors.map(d => (
                    <button
                      key={d.score}
                      onClick={() => handleAuditAnswer(d.score)}
                      style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "14px 20px", borderRadius: 8, cursor: "pointer",
                        background: offWhite, border: `1.5px solid oklch(85% 0.008 80)`,
                        textAlign: "left", transition: "border-color 0.15s, background 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = orange;
                        (e.currentTarget as HTMLButtonElement).style.background = "oklch(94% 0.008 45)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(85% 0.008 80)";
                        (e.currentTarget as HTMLButtonElement).style.background = offWhite;
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: "50%", background: navy,
                        color: offWhite, fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                        fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>{d.score}</span>
                      <span style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: bodyText, lineHeight: 1.4 }}>
                        {d.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Audit complete: summary */}
          {auditComplete && lowestArea && (
            <div>
              {/* Score overview */}
              {(() => {
                const allAvg = areaAverages.reduce((s, r) => s + r.avg, 0) / areaAverages.length;
                const overallLabel = allAvg <= 2.5
                  ? t("High Depletion", "Kelelahan Tinggi")
                  : allAvg <= 3.5
                  ? t("Moderate Strain", "Tekanan Sedang")
                  : t("Healthy Margin", "Margin Sehat");
                const overallColor = allAvg <= 2.5 ? "oklch(55% 0.18 25)" : allAvg <= 3.5 ? orange : "oklch(45% 0.14 145)";
                return (
                  <div style={{
                    background: navy, borderRadius: 14, padding: "28px 32px", marginBottom: 32,
                    display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
                  }}>
                    <div style={{ textAlign: "center", minWidth: 80 }}>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 42, fontWeight: 800, color: overallColor, lineHeight: 1 }}>
                        {allAvg.toFixed(1)}
                      </div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, color: overallColor, letterSpacing: "0.1em", marginTop: 4 }}>
                        {overallLabel}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <p style={{ fontFamily: serif, fontSize: "clamp(14px, 1.6vw, 16px)", color: "oklch(80% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                        {allAvg <= 2.5
                          ? t(
                              "Significant depletion across multiple areas. This is the time for structural change, not more willpower. Start with your lowest area.",
                              "Penipisan signifikan di beberapa area. Ini saatnya perubahan struktural, bukan kemauan yang lebih keras. Mulai dari area terendahmu."
                            )
                          : allAvg <= 3.5
                          ? t(
                              "You are managing, but margin is thin. Your lowest areas need focused attention before they become crises.",
                              "Kamu bisa bertahan, tetapi ruang gerakmu sempit. Area terendahmu perlu perhatian terfokus sebelum menjadi krisis."
                            )
                          : t(
                              "Your overall health looks solid. The practice now is maintenance: protect what is working and stay honest about any areas beginning to slip.",
                              "Kesehatan keseluruhanmu terlihat solid. Praktik sekarang adalah pemeliharaan: lindungi apa yang berhasil dan tetap jujur tentang area yang mulai menurun."
                            )}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Lowest area callout */}
              <div style={{
                background: offWhite, border: `2px solid ${orange}`, borderRadius: 12,
                padding: "20px 24px", marginBottom: 28,
              }}>
                <p style={{
                  fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                  color: orange, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8,
                }}>
                  {t("Start Here", "Mulai Di Sini")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)", color: navy, fontWeight: 700, fontStyle: "italic", marginBottom: 6, lineHeight: 1.3 }}>
                  {lang === "en" ? lowestArea.area.en_label : lowestArea.area.id_label}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(14px, 1.5vw, 16px)", color: bodyText, margin: 0, lineHeight: 1.65 }}>
                  {lowestArea.area.habitCategory === "Body"
                    ? t(
                        "Your body is the first to signal overload and the last to receive care. Open the Body section below to find one habit to protect this week.",
                        "Tubuhmu adalah yang pertama memberi sinyal kelebihan beban dan yang terakhir menerima perawatan. Buka bagian Tubuh di bawah untuk menemukan satu kebiasaan yang bisa kamu lindungi minggu ini."
                      )
                    : lowestArea.area.habitCategory === "Mind"
                    ? t(
                        "Mental overload accumulates silently until it becomes unmistakable. Open the Mind section below to find one habit to protect this week.",
                        "Kelebihan beban mental terakumulasi diam-diam sampai menjadi tak terbantahkan. Buka bagian Pikiran di bawah untuk menemukan satu kebiasaan yang bisa kamu lindungi minggu ini."
                      )
                    : t(
                        "Spiritual depletion often hides beneath religious busyness. Open the Spirit section below to find one habit to protect this week.",
                        "Penipisan rohani sering tersembunyi di balik kesibukan keagamaan. Buka bagian Roh di bawah untuk menemukan satu kebiasaan yang bisa kamu lindungi minggu ini."
                      )}
                </p>
              </div>

              {/* Area breakdown with bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
                {areaAverages.map(({ area, avg }) => {
                  const isLowest = area.key === lowestArea.area.key;
                  const scoreColor = getScoreColor(avg);
                  const scoreLabel = avg <= 2 ? t("Critical", "Kritis") : avg <= 3 ? t("Watch", "Perhatikan") : t("Healthy", "Sehat");
                  return (
                    <div key={area.key} style={{
                      padding: "12px 16px", borderRadius: 8,
                      background: isLowest ? "oklch(98% 0.008 45)" : offWhite,
                      border: `1.5px solid ${isLowest ? orange : "oklch(88% 0.008 80)"}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <span style={{ flex: 1, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: navy }}>
                          {lang === "en" ? area.en_label : area.id_label}
                          {isLowest && (
                            <span style={{ marginLeft: 8, fontFamily: serif, fontWeight: 400, fontStyle: "italic", fontSize: 12, color: orange }}>
                              {t("lowest", "terendah")}
                            </span>
                          )}
                        </span>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: scoreColor, letterSpacing: "0.06em" }}>
                          {scoreLabel}
                        </span>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, color: scoreColor, minWidth: 28, textAlign: "right" }}>
                          {avg.toFixed(1)}
                        </span>
                      </div>
                      <div style={{ height: 4, background: lightGray, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(avg / 5) * 100}%`, background: scoreColor, borderRadius: 4, transition: "width 0.4s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Retake */}
              <button
                onClick={resetAudit}
                style={{
                  padding: "12px 32px", background: "transparent",
                  border: `1.5px solid ${navy}`, borderRadius: 8,
                  fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                  color: navy, letterSpacing: "0.04em", cursor: "pointer",
                }}
              >
                {t("Retake Audit", "Ulangi Audit")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* -- SECTION IV: THREE CATEGORIES OF HABITS -- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16, textAlign: "center",
          }}>
            {t("IV. Practical Habits", "IV. Kebiasaan Praktis")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 16, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("Body, Mind, Spirit", "Tubuh, Pikiran, Roh")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: bodyText, lineHeight: 1.85, maxWidth: 640,
            margin: "0 auto 64px", textAlign: "center",
          }}>
            {t(
              "Three categories — nine habits. Not rules to comply with, but investments to protect. You are not going to do all nine perfectly. Pick the one or two that your Stress Audit revealed you need most.",
              "Tiga kategori — sembilan kebiasaan. Bukan aturan untuk dipatuhi, tetapi investasi untuk dilindungi. kamu tidak akan melakukan semua sembilan dengan sempurna. Pilih satu atau dua yang diungkapkan Audit Stres kamu sebagai yang paling kamu butuhkan."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1.5px solid oklch(85% 0.008 260)`, borderRadius: 12, overflow: "hidden" }}>
            {HABIT_CATEGORIES.map((cat, idx) => {
              const isOpen = openHabit === cat.key;
              return (
                <div
                  key={cat.key}
                  style={{ borderTop: idx > 0 ? `1px solid oklch(88% 0.008 260)` : "none" }}
                >
                  <button
                    onClick={() => setOpenHabit(isOpen ? null : cat.key)}
                    style={{
                      width: "100%", textAlign: "left", padding: "24px 28px",
                      background: isOpen ? navy : offWhite, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 16,
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: isOpen ? offWhite : cat.color,
                      color: isOpen ? navy : offWhite,
                      fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "background 0.2s, color 0.2s",
                    }}>
                      {lang === "id" ? cat.id_letter : cat.letter}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                        fontSize: 18, color: isOpen ? offWhite : navy,
                        transition: "color 0.2s",
                      }}>
                        {lang === "en" ? cat.en_title : cat.id_title}
                      </div>
                      <div style={{ fontFamily: serif, fontSize: 14, color: isOpen ? "oklch(75% 0.02 80)" : bodyText, fontStyle: "italic", transition: "color 0.2s" }}>
                        {lang === "en" ? cat.en_tagline : cat.id_tagline}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 22, color: isOpen ? offWhite : cat.color, fontWeight: 300,
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s, color 0.2s", flexShrink: 0,
                    }}>
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "32px 28px 36px", background: offWhite }}>
                      <p style={{
                        fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
                        color: bodyText, lineHeight: 1.85, marginBottom: 28,
                      }}>
                        {lang === "en" ? cat.en_desc : cat.id_desc}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {cat.habits.map((habit, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex", gap: 18, alignItems: "flex-start",
                              padding: "18px 20px", background: lightGray,
                              borderRadius: 10, borderLeft: `3px solid ${cat.color}`,
                            }}
                          >
                            <div style={{
                              fontFamily: serif, fontSize: "clamp(26px, 3vw, 34px)",
                              fontWeight: 700, color: cat.color, lineHeight: 1,
                              minWidth: 26, flexShrink: 0, marginTop: -2,
                            }}>
                              {i + 1}
                            </div>
                            <p style={{
                              fontFamily: serif, fontSize: "clamp(14px, 1.5vw, 16px)",
                              color: bodyText, lineHeight: 1.85, margin: 0,
                            }}>
                              {t(habit.en, habit.id)}
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

      {/* -- SECTION V: WHY STOPPING IS HARD HERE -- */}
      <section id="mc-burnout-data" style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16,
          }}>
            {t("V. The Field Context", "V. Konteks Lapangan")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: navy, marginBottom: 40, lineHeight: 1.2, fontStyle: "italic",
          }}>
            {t("Why Stopping is Hard Here", "Mengapa Berhenti Itu Sulit di Sini")}
          </h2>
          <div style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", color: bodyText, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 28 }}>
              {t(
                "A 2024 public health study of 4,338 full-time workers across Malaysia, Singapore, the Philippines, and Indonesia found 62.91% reporting high or very high burnout levels³; research among cross-cultural field workers consistently identifies Sabbath neglect as a primary contributing factor.",
                "Sebuah studi kesehatan masyarakat 2024 terhadap 4.338 pekerja penuh waktu di Malaysia, Singapura, Filipina, dan Indonesia menemukan 62,91% melaporkan tingkat kelelahan yang tinggi atau sangat tinggi³; penelitian di antara pekerja lapangan lintas budaya secara konsisten mengidentifikasi penolakan Sabat sebagai faktor penyebab utama."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "This is not simply an individual character flaw. In ministry and field contexts, the pressure not to rest is structurally embedded. Stopping feels like abandoning people who need you. Rest produces guilt because the work is never done. In collectivist cultures, taking personal time away from the team carries social cost — rest can feel like a statement about your commitment.",
                "Ini bukan sekadar kelemahan karakter individu. Dalam konteks pelayanan dan lapangan, tekanan untuk tidak beristirahat tertanam secara struktural. Berhenti terasa seperti meninggalkan orang-orang yang membutuhkan kamu. Istirahat menimbulkan rasa bersalah karena pekerjaannya tidak pernah selesai. Dalam budaya kolektivis, mengambil waktu pribadi dari tim membawa biaya sosial — istirahat bisa terasa seperti pernyataan tentang komitmen kamu."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "There is also a spiritual identity trap. Many leaders in ministry have made the work part of their identity to the degree that stopping the work means losing a sense of who they are. The call becomes the self. And when the call is the self, rest feels like disappearance.",
                "Ada juga jebakan identitas rohani. Banyak pemimpin dalam pelayanan telah menjadikan pekerjaan sebagai bagian dari identitas mereka sedemikian rupa sehingga berhenti dari pekerjaan berarti kehilangan rasa diri mereka sendiri. Panggilan menjadi diri. Dan ketika panggilan adalah diri, istirahat terasa seperti kehilangan."
              )}
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)",
              fontStyle: "italic", color: navy, lineHeight: 1.75,
              padding: "8px 0 8px 28px", borderLeft: `3px solid ${orange}`,
              marginBottom: 28,
            }}>
              {t(
                "Naming this pressure is not defeat. It is honesty. The reason pace architecture is difficult for cross-cultural leaders specifically is not weakness — it is a combination of real external pressures and internalized beliefs about sacrifice, vocation, and worth.",
                "Menamai tekanan ini bukan kekalahan. Itu kejujuran. Alasan arsitektur kecepatan sulit bagi pemimpin lintas budaya secara khusus bukan kelemahan — itu adalah kombinasi dari tekanan eksternal nyata dan keyakinan yang diinternalisasi tentang pengorbanan, panggilan, dan nilai."
              )}
            </p>
            <p style={{ marginBottom: 0 }}>
              {t(
                "The question is not whether you feel the pressure to keep going. Of course you do. The question is whether you are building a life where sustainable capacity is possible — or whether you are draining a reservoir you never refill.",
                "Pertanyaannya bukan apakah kamu merasakan tekanan untuk terus maju. Tentu saja kamu merasakannya. Pertanyaannya adalah apakah kamu sedang membangun kehidupan di mana kapasitas yang berkelanjutan dimungkinkan — atau apakah kamu menguras waduk yang tidak pernah kamu isi kembali."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* -- SECTION VI: BIBLICAL FOUNDATION -- */}
      <section style={{ background: navy, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center",
          }}>
            {t("VI. Biblical Foundation", "VI. Dasar Alkitab")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700, color: offWhite, marginBottom: 20, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("Jesus and the Rhythm of Withdrawal", "Yesus dan Ritme Penyingkiran")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: "oklch(70% 0.03 80)", lineHeight: 1.85, maxWidth: 620,
            margin: "0 auto 72px", textAlign: "center",
          }}>
            {t(
              "Sustainable pace is not a leadership strategy invented in the 21st century. It is a pattern modelled by Jesus himself — and described throughout Scripture.",
              "Kecepatan yang berkelanjutan bukan strategi kepemimpinan yang ditemukan di abad ke-21. Ini adalah pola yang dimodelkan oleh Yesus sendiri — dan digambarkan di seluruh Kitab Suci."
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
                {t("Mark 1:35", "Markus 1:35")}
              </button>
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)",
              fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 24,
            }}>
              "{t(
                "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
                "Pagi-pagi benar, waktu hari masih gelap, Ia bangun dan pergi ke luar. Ia pergi ke tempat yang sunyi dan berdoa di sana."
              )}"
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(72% 0.03 80)", lineHeight: 1.85,
            }}>
              {t(
                "This verse sits in the middle of one of the most intense ministry passages in the Gospels. The day before, Jesus had healed Peter's mother-in-law, and by evening the whole town had gathered at the door. He healed many, drove out demons, and was in constant demand. And then — before anyone else was awake — he left. Not after everyone had been seen to. Not after the crowds had dispersed. Before.",
                "Ayat ini berada di tengah salah satu bagian pelayanan paling intens dalam Injil. Sehari sebelumnya, Yesus telah menyembuhkan ibu mertua Petrus, dan menjelang sore seluruh kota telah berkumpul di depan pintu. Ia menyembuhkan banyak orang, mengusir setan, dan terus diminta. Dan kemudian — sebelum siapa pun terbangun — Ia pergi. Bukan setelah semua orang dilayani. Bukan setelah kerumunan bubar. Sebelum."
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
                {t("Psalm 23:2-3", "Mazmur 23:2-3")}
              </button>
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(18px, 2vw, 22px)",
              fontStyle: "italic", color: offWhite, lineHeight: 1.75, marginBottom: 24,
            }}>
              "{t(
                "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
                "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku."
              )}"
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "oklch(72% 0.03 80)", lineHeight: 1.85,
            }}>
              {t(
                "Notice the active verbs: he makes, he leads, he refreshes. The Psalm describes a God who does not simply permit rest — he initiates it. 'He makes me lie down' is a strong image: the shepherd leads the sheep to green pasture and the sheep lies down, because that is what the shepherd is doing. God is not passive about your wellbeing. He is actively guiding you toward renewal.",
                "Perhatikan kata kerja aktif: Ia membaringkan, Ia membimbing, Ia menyegarkan. Mazmur ini menggambarkan Allah yang tidak sekadar mengizinkan istirahat — Ia memulainya. 'Ia membaringkan aku' adalah gambaran yang kuat: Gembala memimpin domba ke padang yang berumput hijau dan domba itu berbaring, karena itulah yang dilakukan Gembala. Allah tidak pasif terhadap kesejahteraanmu. Ia secara aktif memandumu menuju pembaruan."
              )}
            </p>
          </div>

          {/* The Sabbath Command */}
          <div style={{ marginBottom: 64 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
              color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28,
            }}>
              {t("The Sabbath Command", "Perintah Sabat")}
            </p>
            <div style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: "oklch(72% 0.03 80)", lineHeight: 1.85 }}>
              <p style={{ marginBottom: 24 }}>
                {t(
                  "The fourth commandment appears twice in Scripture. In Exodus 20, the command to rest is grounded in creation: God rested on the seventh day, and so should you. In Deuteronomy 5, the command is grounded in liberation: you were slaves in Egypt, where no one rested. Rest is the mark of freedom.",
                  "Perintah keempat muncul dua kali dalam Kitab Suci. Dalam Keluaran 20, perintah untuk beristirahat didasarkan pada penciptaan: Allah beristirahat pada hari ketujuh, dan demikian pula kamu. Dalam Ulangan 5, perintah itu didasarkan pada pembebasan: kamu adalah budak di Mesir, di mana tidak ada yang beristirahat. Istirahat adalah tanda kebebasan."
                )}
              </p>
              <p style={{ marginBottom: 24 }}>
                {t(
                  "For cross-cultural leaders, the second framing may be more personally necessary. Many carry an Egypt inside them — an internalized taskmaster that does not allow them to stop. The Deuteronomy 5 Sabbath is not just permission to rest. It is a declaration that you are no longer defined by what you produce.",
                  "Bagi pemimpin lintas budaya, framing kedua mungkin lebih diperlukan secara pribadi. Banyak yang membawa Mesir di dalam diri mereka — seorang mandor yang diinternalisasi yang tidak mengizinkan mereka berhenti. Sabat Ulangan 5 bukan sekadar izin untuk beristirahat. Itu adalah deklarasi bahwa kamu tidak lagi didefinisikan oleh apa yang kamu hasilkan."
                )}
              </p>
              <div style={{
                background: "oklch(18% 0.09 260)", borderRadius: 10, padding: "28px 32px",
                borderLeft: `4px solid ${orange}`, marginBottom: 24,
              }}>
                <p style={{
                  fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)",
                  fontStyle: "italic", color: offWhite, lineHeight: 1.8, marginBottom: 12,
                }}>
                  {t(
                    `"Sabbath is not simply the pause that refreshes. It is the pause that transforms."`,
                    `"Sabat bukan sekadar jeda yang menyegarkan. Itu adalah jeda yang mengubah."`
                  )}
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
                  Walter Brueggemann⁴
                </p>
              </div>
              <p style={{ marginBottom: 24 }}>
                {t(
                  "Abraham Joshua Heschel⁵ described the Sabbath as a 'palace in time' — not a place you go, but a space you inhabit, regardless of geography. For leaders whose ministry takes them far from home, this is worth sitting with. Your Sabbath travels with you. It is not location-dependent.",
                  "Abraham Joshua Heschel⁵ menggambarkan Sabat sebagai 'istana dalam waktu' — bukan tempat yang kamu datangi, tetapi ruang yang kamu huni, terlepas dari geografi. Bagi pemimpin yang pelayanannya membawa mereka jauh dari rumah, ini layak untuk direnungkan. Sabat kamu menemani kamu ke mana pun. Itu tidak tergantung pada lokasi."
                )}
              </p>
              <p style={{ marginBottom: 0 }}>
                {t(
                  "The research adds a further dimension. Leaders who practise psychological detachment⁶ — genuine mental disengagement from work during rest — not only recover better themselves. Studies show that a leader's capacity to detach directly improves the recovery outcomes of their team. Protecting your rhythm is not just self-care. It is stewardship of those you lead.",
                  "Penelitian menambahkan dimensi lain. Pemimpin yang mempraktikkan pelepasan psikologis⁶ — pelepasan mental yang tulus dari pekerjaan selama istirahat — tidak hanya pulih lebih baik sendiri. Studi menunjukkan bahwa kemampuan pemimpin untuk melepaskan diri secara langsung meningkatkan hasil pemulihan tim mereka. Melindungi ritme kamu bukan sekadar perawatan diri. Itu adalah penatalayanan atas mereka yang kamu pimpin."
                )}
              </p>
            </div>
          </div>

          {/* The Theological Reframe */}
          <div style={{
            background: "oklch(18% 0.09 260)", borderRadius: 12, padding: "40px 40px",
            borderLeft: `4px solid ${orange}`,
          }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
              color: orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20,
            }}>
              {t("The Theological Reframe", "Reframing Teologis")}
            </p>
            <p style={{
              fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 23px)",
              fontStyle: "italic", color: offWhite, lineHeight: 1.8, marginBottom: 20,
            }}>
              {t(
                "You are not the energy source. You are the vessel. The same God who sent you into the work is the God who designed rest into the fabric of creation. Building a sustainable pace is not a concession to your weakness — it is an act of faith in his ongoing provision.",
                "kamu bukan sumber energi. kamu adalah bejananya. Tuhan yang sama yang mengutus kamu ke dalam pekerjaan adalah Tuhan yang merancang istirahat ke dalam jalinan penciptaan. Membangun kecepatan yang berkelanjutan bukan konsesi terhadap kelemahan kamu — itu adalah tindakan iman dalam pemeliharaan-Nya yang terus-menerus."
              )}
            </p>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
              color: orange, letterSpacing: "0.08em", margin: 0,
            }}>
              {t(
                "The leader who learns to pace themselves is not less dedicated. They are more faithful.",
                "Pemimpin yang belajar mengatur kecepatan diri mereka tidak kurang berdedikasi. Mereka lebih setia."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* -- SECTION VII: KEY TAKEAWAYS -- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 16,
          }}>
            {t("VII. Key Takeaways", "VII. Poin Utama")}
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
                en: "Sustainable pace is not about doing less — it is about building architecture that makes exhaustion rare.",
                id: "Kecepatan berkelanjutan bukan tentang melakukan lebih sedikit — ini tentang membangun arsitektur yang membuat kelelahan menjadi jarang terjadi.",
              },
              {
                en: "Research consistently shows a recovery paradox⁶: leaders who build rest rhythms proactively recover better and lead better. Build the architecture before you need it, not when you are already running empty.",
                id: "Penelitian secara konsisten menunjukkan paradoks pemulihan⁶: pemimpin yang membangun ritme istirahat secara proaktif pulih lebih baik dan memimpin lebih baik. Bangun arsitektur itu sebelum kamu membutuhkannya, bukan ketika kamu sudah kehabisan energi.",
              },
              {
                en: "In high-demand cross-cultural contexts, rest-guilt is socially enforced, not just personally felt. Naming that pressure is the first honest step.",
                id: "Dalam konteks lintas budaya yang penuh tuntutan, rasa bersalah saat istirahat ditegakkan secara sosial, bukan hanya dirasakan secara pribadi. Menamai tekanan itu adalah langkah jujur pertama.",
              },
              {
                en: "When you protect your own rhythm, you give your team implicit permission to protect theirs. Your pace sets the system.",
                id: "Ketika kamu melindungi ritme kamu sendiri, kamu memberi tim kamu izin implisit untuk melindungi ritme mereka. Kecepatan kamu mengatur sistem.",
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
                  {t(item.en, item.id)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- FROM THE FIELD -- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ borderLeft: `4px solid ${orange}`, paddingLeft: 32 }}>
            <p style={{
              fontFamily: serif, fontSize: 11, fontWeight: 400,
              letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 8,
            }}>
              {t("From the Field", "Dari Lapangan")}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: bodyText, margin: "0 0 24px", letterSpacing: "0.04em" }}>
              {t("Field story — composite, based on documented patterns. Name withheld.", "Kisah dari lapangan — komposit, berdasarkan pola yang terdokumentasi. Nama dirahasiakan.")}
            </p>
            {FIELD_STORY[lang].split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: serif, fontSize: "clamp(16px, 1.9vw, 20px)", color: bodyText,
                lineHeight: 1.9, marginBottom: 20,
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* -- SECTION VIII: YOUR NEXT STEP -- */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: serif, fontSize: 11, fontWeight: 400,
            letterSpacing: "0.18em", textTransform: "uppercase", color: orange, marginBottom: 32, textAlign: "center",
          }}>
            {t("VIII. Your Next Step", "VIII. Langkah Berikutnya")}
          </p>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.2,
            fontStyle: "italic", textAlign: "center",
          }}>
            {t("One Investment This Week", "Satu Investasi Minggu Ini")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 19px)",
            color: bodyText, lineHeight: 1.85, textAlign: "center", marginBottom: 48,
          }}>
            {t(
              "Look back at your Stress Audit. Which area scored lowest? That is where you begin: not the whole framework, just one habit, one sphere, one honest conversation. Sustainable pace is built one protected investment at a time.",
              "Lihat kembali Audit Stres kamu. Area mana yang mendapat skor terendah? Di situlah kamu memulai: bukan seluruh kerangka, cukup satu kebiasaan, satu lingkup, satu percakapan yang jujur. Kecepatan berkelanjutan dibangun satu investasi yang terlindungi pada satu waktu."
            )}
          </p>
          <p style={{
            fontFamily: serif, fontSize: "clamp(15px, 1.6vw, 17px)",
            color: bodyText, lineHeight: 1.85, textAlign: "center", marginBottom: 48,
            fontStyle: "italic",
          }}>
            {t(
              "Come back in seven days and re-score your lowest area. Sustainable pace is built in cycles, not single sessions.",
              "Kembali dalam tujuh hari dan nilai ulang area terendahmu. Kecepatan berkelanjutan dibangun dalam siklus, bukan sesi tunggal."
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
                "Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang; Ia menyegarkan jiwaku."
              )}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", margin: 0 }}>
              <button
                onClick={() => setActiveVerse("ps-23-2-3")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: orange, fontWeight: 700, fontSize: 12,
                  textDecoration: "underline dotted", textUnderlineOffset: 3, padding: 0,
                }}
              >
                {t("Psalm 23:2-3", "Mazmur 23:2-3")}
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
                background: saved ? navy : orange,
                color: offWhite, letterSpacing: "0.06em", borderRadius: 4,
              }}
            >
              {saved
                ? `✓ ${t("Saved to Dashboard", "Tersimpan di Dashboard")}`
                : t("Save to Dashboard", "Simpan ke Dashboard")}
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
                {t("Back to Pathway", "Kembali ke Jalur")}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Sources ── */}
      <SourcesDropdown sources={[
        "Taylor, W.D. (Ed.) — Too Valuable to Lose: Exploring the Causes and Cures of Missionary Attrition (William Carey Library, 1997) — ReMap I global study of cross-cultural worker attrition; identifies personal health neglect as leading preventable cause.",
        "O'Donnell, K. (ed.) — Doing Member Care Well: Perspectives and Practices from the Field (William Carey Library, 2002) — establishes the five-sphere concentric model of member care for long-term cross-cultural workers.",
        "Abdul Aziz, A.F. & Ong, T. (2024). Prevalence and associated factors of burnout among working adults in Southeast Asia: results from a public health assessment. Frontiers in Public Health, March 14, 2024. DOI: 10.3389/fpubh.2024.1326227. Survey of 4,338 full-time employees across Malaysia, Singapore, Philippines, and Indonesia; 62.91% reported high or very high burnout; cross-cultural field worker research consistently identifies Sabbath neglect as a primary contributing factor.",
        "Brueggemann, W. Sabbath as Resistance: Saying No to the Culture of Now (Westminster John Knox Press, 2014). Theological argument that Sabbath is counter-cultural resistance to productivity idolatry, not mere recuperation.",
        "Heschel, A.J. The Sabbath: Its Meaning for Modern Man (Farrar, Straus and Giroux, 1951). Foundational theology of Sabbath as sacred time rather than sacred space; origin of the 'palace in time' image.",
        "Sonnentag, S. — Psychological Detachment from Work During Leisure Time: The Benefits of Mentally Disengaging from Work (Current Directions in Psychological Science, 2012) — meta-analysis establishing psychological detachment as the single most evidence-supported recovery mechanism; leader detachment improves team recovery outcomes.",
        "Walker, M.P. — Why We Sleep: Unlocking the Power of Sleep and Dreams (Scribner, 2017) — comprehensive review of sleep science; documents cognitive, emotional, and physiological costs of chronic sleep debt below 7 hours.",
        "Ratey, J.J. — Spark: The Revolutionary New Science of Exercise and the Brain (Little, Brown, 2008) — evidence base for aerobic exercise improving executive function, stress regulation, and cognitive sharpness in high-demand roles.",
      ]} lang={lang} />

      {/* -- FOOTER -- */}
      <section style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: serif, fontSize: "clamp(26px, 3vw, 36px)",
          fontWeight: 700, color: offWhite, marginBottom: 16, fontStyle: "italic",
        }}>
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>
        <p style={{
          fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 18px)",
          color: "oklch(70% 0.03 80)", lineHeight: 1.75, maxWidth: 480,
          margin: "0 auto 40px",
        }}>
          {t(
            "Explore more training modules to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya kamu."
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
          {t("All Resources", "Semua Sumber Daya")}
        </Link>
      </section>

      {/* -- VERSE POPUP -- */}
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
              {lang === "en" ? verseData.en_ref : verseData.id_ref}
              {" "}({lang === "en" ? "NIV" : "TB"})
            </p>
            <p style={{
              fontFamily: serif, fontSize: 22, lineHeight: 1.7,
              color: navy, fontStyle: "italic", marginBottom: 28,
            }}>
              "{lang === "en" ? verseData.en : verseData.id}"
            </p>
            <button
              onClick={() => setActiveVerse(null)}
              style={{
                padding: "10px 24px", background: navy, color: offWhite,
                border: "none", borderRadius: 12,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("Close", "Tutup")}
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
