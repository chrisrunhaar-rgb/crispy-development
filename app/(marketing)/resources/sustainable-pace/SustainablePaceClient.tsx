"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

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
    id_subtitle: "Pemeliharaan Tuhan untuk Anda",
    en_desc: "The foundation of everything. God is not a supervisor tracking your output — he is the shepherd who actively leads you to rest and restores your soul. Before you build any structure, you must believe that God's care for you is not contingent on your performance. He cares for the vessel, not just the mission.",
    id_desc: "Fondasi dari segalanya. Tuhan bukan pengawas yang melacak output Anda — Ia adalah gembala yang secara aktif memimpin Anda ke tempat istirahat dan memulihkan jiwa Anda. Sebelum Anda membangun struktur apapun, Anda harus percaya bahwa pemeliharaan Tuhan terhadap Anda tidak tergantung pada kinerja Anda. Ia merawat bejana, bukan hanya misi.",
    en_examples: ["Daily communion with God — not as duty but as source", "Prayer as honest conversation, not performance", "Trusting that God holds the mission when you step away", "Reading Scripture as nourishment, not information"],
    id_examples: ["Persekutuan harian dengan Tuhan — bukan sebagai kewajiban tetapi sebagai sumber", "Doa sebagai percakapan jujur, bukan pertunjukan", "Mempercayai bahwa Tuhan memegang misi ketika Anda beristirahat", "Membaca Kitab Suci sebagai makanan rohani, bukan informasi"],
    en_question: "When did you last come to God not to report, request, or produce — but simply to be held? What would it take to protect that space this week?",
    id_question: "Kapan terakhir kali Anda datang kepada Tuhan bukan untuk melaporkan, meminta, atau menghasilkan — tetapi sekadar untuk ditopang? Apa yang diperlukan untuk melindungi ruang itu minggu ini?",
    color: "oklch(55% 0.14 290)",
  },
  {
    key: "self",
    level: 2,
    en_title: "Self-Care",
    id_title: "Perawatan Diri",
    en_subtitle: "Your personal health architecture",
    id_subtitle: "Arsitektur kesehatan pribadi Anda",
    en_desc: "Self-care is not indulgence — it is stewardship. You are the instrument God has chosen to use. The way you manage your body, mind, and spirit directly determines your capacity to love others and lead well. Neglect here is not humility; it is poor stewardship of a resource that belongs to God.",
    id_desc: "Perawatan diri bukan kemewahan — itu adalah penatalayanan. Anda adalah instrumen yang dipilih Tuhan untuk digunakan. Cara Anda mengelola tubuh, pikiran, dan roh secara langsung menentukan kapasitas Anda untuk mengasihi orang lain dan memimpin dengan baik. Mengabaikan hal ini bukan kerendahan hati; itu adalah penatalayanan yang buruk atas sumber daya yang menjadi milik Tuhan.",
    en_examples: ["Consistent sleep (7 to 8 hours) as a non-negotiable", "Physical movement — whatever fits your context and body", "Mental rest: time without inputs, screens, or demands", "Emotional awareness: naming what you're carrying"],
    id_examples: ["Tidur yang konsisten (7 hingga 8 jam) sebagai hal yang tidak bisa ditawar", "Gerak fisik — apapun yang sesuai dengan konteks dan tubuh Anda", "Istirahat mental: waktu tanpa masukan, layar, atau tuntutan", "Kesadaran emosional: menamakan apa yang Anda tanggung"],
    en_question: "Which of the three — body, mind, or spirit — is most depleted right now? What is one specific thing you could protect for it this week?",
    id_question: "Di antara ketiganya — tubuh, pikiran, atau roh — mana yang paling terkuras saat ini? Apa satu hal konkret yang bisa Anda lindungi untuknya minggu ini?",
    color: orange,
  },
  {
    key: "mutual",
    level: 3,
    en_title: "Mutual Care",
    id_title: "Perawatan Bersama",
    en_subtitle: "Teammates who know the real weight",
    id_subtitle: "Rekan tim yang mengenal beban nyata",
    en_desc: "The people you work alongside are not just colleagues — they are potential co-sustainers. Mutual care happens when teammates hold one another's burdens, tell each other the truth, and create space to be human. It requires intentionality: in high-performance cultures, this care is often the first casualty of busyness.",
    id_desc: "Orang-orang yang bekerja bersama Anda bukan sekadar rekan kerja — mereka adalah pemelihara bersama yang potensial. Perawatan bersama terjadi ketika anggota tim saling menanggung beban satu sama lain, saling mengatakan kebenaran, dan menciptakan ruang untuk menjadi manusia. Ini membutuhkan kesengajaan: dalam budaya berkinerja tinggi, perawatan ini sering menjadi korban pertama dari kesibukan.",
    en_examples: ["Regular honest check-ins with a trusted peer — not just task updates", "Permission to name fatigue without it being seen as weakness", "Cross-cultural teams: acknowledge that care languages differ", "Celebrating wins together, not just pushing through to the next challenge"],
    id_examples: ["Check-in jujur secara teratur dengan rekan yang dipercaya — bukan hanya pembaruan tugas", "Izin untuk mengungkapkan kelelahan tanpa dianggap sebagai kelemahan", "Tim lintas budaya: akui bahwa bahasa kepedulian berbeda-beda", "Merayakan kemenangan bersama, bukan hanya terus mendorong ke tantangan berikutnya"],
    en_question: "Who on your team is watching your pace right now — and what signals are you giving them about what is acceptable for them to carry?",
    id_question: "Siapa di tim Anda yang sedang mengamati langkah Anda saat ini — dan sinyal apa yang Anda berikan kepada mereka tentang apa yang boleh mereka tanggung?",
    color: "oklch(52% 0.16 165)",
  },
  {
    key: "sender",
    level: 4,
    en_title: "Sender Care",
    id_title: "Perawatan dari Pengirim",
    en_subtitle: "Your agency, church, or organisation",
    id_subtitle: "Lembaga, gereja, atau organisasi Anda",
    en_desc: "Sustainable leaders need a sending community that actively invests in their wellbeing — not just their output. This includes adequate financial support, regular pastoral check-ins, accountability structures, and genuine interest in your personal flourishing. If this is missing or broken, that is a structural problem requiring structural solution — not just more personal resilience.",
    id_desc: "Pemimpin yang berkelanjutan membutuhkan komunitas pengirim yang secara aktif berinvestasi dalam kesejahteraan mereka — bukan hanya output mereka. Ini termasuk dukungan keuangan yang memadai, check-in pastoral yang teratur, struktur akuntabilitas, dan minat sejati dalam pertumbuhan pribadi Anda. Jika ini hilang atau rusak, itu adalah masalah struktural yang memerlukan solusi struktural — bukan hanya lebih banyak ketahanan pribadi.",
    en_examples: ["Annual review conversations that include wellbeing, not just performance", "Financial support that removes economic stress", "A pastor or mentor who knows your personal situation", "Clear re-entry support and debriefing after difficult seasons"],
    id_examples: ["Percakapan tinjauan tahunan yang mencakup kesejahteraan, bukan hanya kinerja", "Dukungan keuangan yang menghilangkan tekanan ekonomi", "Seorang pendeta atau mentor yang mengenal situasi pribadi Anda", "Dukungan kepulangan dan debriefing yang jelas setelah musim-musim yang sulit"],
    en_question: "Does your sending community know how you are really doing? If not, what is the cost of keeping that information private?",
    id_question: "Apakah komunitas pengirim Anda tahu keadaan Anda yang sebenarnya? Jika tidak, apa biaya dari menyembunyikan informasi itu?",
    color: "oklch(50% 0.14 220)",
  },
  {
    key: "specialist",
    level: 5,
    en_title: "Specialist Care",
    id_title: "Perawatan Spesialis",
    en_subtitle: "Professional support when you need it",
    id_subtitle: "Dukungan profesional saat Anda membutuhkannya",
    en_desc: "There are moments when the weight you carry requires more than a good friend, a caring team, or a supportive organisation. Professional care — a counsellor, therapist, psychologist, doctor, or spiritual director — is not a sign of failure. It is the wise use of a resource God has provided. In many cross-cultural contexts, seeking specialist care carries stigma. That stigma costs lives and ministries.",
    id_desc: "Ada saat-saat ketika beban yang Anda tanggung membutuhkan lebih dari sekadar teman yang baik, tim yang peduli, atau organisasi yang mendukung. Perawatan profesional — konselor, terapis, psikolog, dokter, atau direktur spiritual — bukan tanda kegagalan. Itu adalah penggunaan bijak dari sumber daya yang telah Tuhan sediakan. Dalam banyak konteks lintas budaya, mencari perawatan spesialis membawa stigma. Stigma itu merugikan kehidupan dan pelayanan.",
    en_examples: ["Regular counselling or therapy — preventive, not just crisis response", "Medical check-ups, including mental health screening", "A spiritual director who provides structured reflection", "Crisis debriefing after traumatic field experiences"],
    id_examples: ["Konseling atau terapi teratur — preventif, bukan hanya respons krisis", "Pemeriksaan kesehatan rutin, termasuk skrining kesehatan mental", "Seorang direktur spiritual yang memberikan refleksi terstruktur", "Debriefing krisis setelah pengalaman lapangan yang traumatis"],
    en_question: "Is there something you are carrying that would benefit from a professional conversation? What has been the barrier to seeking it?",
    id_question: "Apakah ada sesuatu yang Anda tanggung yang akan mendapat manfaat dari percakapan profesional? Apa yang selama ini menjadi hambatan untuk mencarinya?",
    color: "oklch(48% 0.14 250)",
  },
];

// -- STRESS AUDIT DATA ---------------------------------------------------------
const STRESS_AREAS: {
  key: string;
  icon: string;
  en_label: string; id_label: string;
  en_low: string; id_low: string;
  en_high: string; id_high: string;
}[] = [
  {
    key: "work-pace",
    icon: "⚡",
    en_label: "Work Pace",
    id_label: "Kecepatan Kerja",
    en_low: "Overwhelmed, unsustainable, no margin",
    id_low: "Kewalahan, tidak berkelanjutan, tidak ada ruang gerak",
    en_high: "Manageable, margin present, pace feels right",
    id_high: "Dapat dikelola, ada ruang gerak, kecepatan terasa tepat",
  },
  {
    key: "physical",
    icon: "💪",
    en_label: "Physical Health",
    id_label: "Kesehatan Fisik",
    en_low: "Exhausted, unwell, neglecting body",
    id_low: "Kelelahan, tidak sehat, mengabaikan tubuh",
    en_high: "Energised, sleeping well, moving regularly",
    id_high: "Berenergi, tidur nyenyak, bergerak secara teratur",
  },
  {
    key: "spiritual",
    icon: "✦",
    en_label: "Spiritual Depth",
    id_label: "Kedalaman Rohani",
    en_low: "Going through the motions, spiritually dry",
    id_low: "Menjalani rutinitas, kering secara rohani",
    en_high: "Alive in faith, connected to God, nourished",
    id_high: "Hidup dalam iman, terhubung dengan Tuhan, terpelihara",
  },
  {
    key: "relationships",
    icon: "🤝",
    en_label: "Key Relationships",
    id_label: "Hubungan Utama",
    en_low: "Isolated, strained, or surface-level only",
    id_low: "Terisolasi, tegang, atau hanya di permukaan",
    en_high: "Connected, honest, genuinely supported",
    id_high: "Terhubung, jujur, didukung dengan tulus",
  },
  {
    key: "finances",
    icon: "💼",
    en_label: "Financial Stability",
    id_label: "Stabilitas Keuangan",
    en_low: "Chronic stress, uncertainty, under-resourced",
    id_low: "Stres kronis, ketidakpastian, kurang sumber daya",
    en_high: "Stable, needs met, future is manageable",
    id_high: "Stabil, kebutuhan terpenuhi, masa depan dapat dikelola",
  },
  {
    key: "family",
    icon: "🏠",
    en_label: "Family Health",
    id_label: "Kesehatan Keluarga",
    en_low: "Neglected, strained, tension at home",
    id_low: "Terabaikan, tegang, ketegangan di rumah",
    en_high: "Present, connected, family thriving",
    id_high: "Hadir, terhubung, keluarga berkembang",
  },
  {
    key: "purpose",
    icon: "🧭",
    en_label: "Sense of Purpose",
    id_label: "Rasa Tujuan",
    en_low: "Disconnected, questioning, going through motions",
    id_low: "Terputus, mempertanyakan, hanya menjalani rutinitas",
    en_high: "Clear calling, meaningful work, motivated",
    id_high: "Panggilan jelas, pekerjaan bermakna, termotivasi",
  },
  {
    key: "emotional",
    icon: "💭",
    en_label: "Emotional Processing",
    id_label: "Pemrosesan Emosi",
    en_low: "Suppressing, numbing, unprocessed weight",
    id_low: "Menekan, mematikan rasa, beban yang belum diproses",
    en_high: "Naming feelings, processing well, emotionally honest",
    id_high: "Menamakan perasaan, memproses dengan baik, jujur secara emosional",
  },
  {
    key: "creative",
    icon: "🎨",
    en_label: "Creative Expression",
    id_label: "Ekspresi Kreatif",
    en_low: "None, dried up, no outlet",
    id_low: "Tidak ada, mengering, tidak ada saluran ekspresi",
    en_high: "Regular creative outlet, making, exploring",
    id_high: "Saluran kreatif yang teratur, berkreasi, menjelajahi",
  },
  {
    key: "rest",
    icon: "🌙",
    en_label: "Regular Rest",
    id_label: "Istirahat Teratur",
    en_low: "No Sabbath, no genuine rest, always on",
    id_low: "Tidak ada Sabat, tidak ada istirahat sejati, selalu aktif",
    en_high: "Protected rest rhythms, genuine offline time",
    id_high: "Ritme istirahat yang terlindungi, waktu offline yang sejati",
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
  icon: string;
}[] = [
  {
    key: "body",
    icon: "💪",
    color: "oklch(52% 0.16 145)",
    en_title: "Body",
    id_title: "Tubuh",
    en_tagline: "Your physical instrument",
    id_tagline: "Instrumen fisik Anda",
    en_desc: "Your body is not separate from your ministry — it is the medium through which all of it happens. Leaders who neglect their physical health are not more sacrificial. They are less sustainable. Treat your body as the instrument it is.",
    id_desc: "Tubuh Anda tidak terpisah dari pelayanan Anda — tubuh adalah medium di mana semua itu terjadi. Pemimpin yang mengabaikan kesehatan fisik mereka tidak lebih berkorban. Mereka lebih cepat habis. Perlakukan tubuh Anda sebagai instrumen yang seharusnya.",
    habits: [
      {
        en: "Sleep 7 to 8 hours⁷. Not as a reward for finishing, but as a daily non-negotiable. Chronic sleep debt is not dedication — it is slow self-destruction.",
        id: "Tidur 7 hingga 8 jam⁷. Bukan sebagai hadiah karena sudah menyelesaikan pekerjaan, tetapi sebagai hal yang tidak bisa ditawar setiap hari. Kekurangan tidur kronis bukan dedikasi — itu adalah penghancuran diri yang perlahan.",
      },
      {
        en: "Move your body for 30 minutes, three times a week. Adapt the form to your context — walking is enough. Your cardiovascular health predicts your cognitive sharpness⁸.",
        id: "Gerakkan tubuh Anda selama 30 menit, tiga kali seminggu. Sesuaikan bentuknya dengan konteks Anda — berjalan kaki sudah cukup. Kesehatan kardiovaskular Anda memprediksi ketajaman kognitif Anda⁸.",
      },
      {
        en: "Eat food that sustains rather than numbs. In high-stress seasons, leaders often default to stimulants (caffeine, sugar) and neglect real nutrition. Notice the pattern.",
        id: "Makan makanan yang menopang daripada mematikan rasa. Dalam musim penuh tekanan, pemimpin sering beralih ke stimulan (kafein, gula) dan mengabaikan nutrisi yang sesungguhnya. Perhatikan pola ini.",
      },
    ],
  },
  {
    key: "mind",
    icon: "🧠",
    color: "oklch(50% 0.14 220)",
    en_title: "Mind",
    id_title: "Pikiran",
    en_tagline: "Your cognitive and emotional capacity",
    id_tagline: "Kapasitas kognitif dan emosional Anda",
    en_desc: "The mind needs input, processing time, and genuine limits. Leaders who never stop taking in information, never process what they experience, and never set cognitive limits eventually produce neither wisdom nor clarity — only noise.",
    id_desc: "Pikiran membutuhkan masukan, waktu pemrosesan, dan batasan yang sesungguhnya. Pemimpin yang tidak pernah berhenti menerima informasi, tidak pernah memproses pengalaman mereka, dan tidak pernah menetapkan batasan kognitif pada akhirnya tidak menghasilkan kebijaksanaan atau kejernihan — hanya kebisingan.",
    habits: [
      {
        en: "Read one book every month — not for professional development only, but for joy, breadth, and perspective. Narrow minds lead narrow organisations.",
        id: "Baca satu buku setiap bulan — bukan hanya untuk pengembangan profesional, tetapi untuk kesenangan, wawasan, dan perspektif. Pikiran yang sempit memimpin organisasi yang sempit.",
      },
      {
        en: "Create 20 minutes of daily processing time — journalling, walking without a podcast, or quiet prayer. Your brain needs white space to integrate experience into learning.",
        id: "Ciptakan 20 menit waktu pemrosesan harian — jurnal, berjalan tanpa podcast, atau doa yang tenang. Otak Anda membutuhkan ruang kosong untuk mengintegrasikan pengalaman menjadi pembelajaran.",
      },
      {
        en: "Set a digital boundary: no screens for the first 30 minutes of your morning and the last 30 minutes before sleep. These are your highest-value thinking windows — protect them.",
        id: "Tetapkan batasan digital: tidak ada layar selama 30 menit pertama di pagi hari dan 30 menit terakhir sebelum tidur. Ini adalah jendela berpikir bernilai tertinggi Anda — lindungi mereka.",
      },
    ],
  },
  {
    key: "spirit",
    icon: "✦",
    color: "oklch(55% 0.14 290)",
    en_title: "Spirit",
    id_title: "Roh",
    en_tagline: "Your connection to the source",
    id_tagline: "Koneksi Anda ke sumber",
    en_desc: "Spiritual health is not measured by religious activity — it is measured by your connectedness to God. A leader can be extraordinarily busy with spiritual work and be spiritually empty. The habits here are not about performance. They are about remaining connected to the one who called you.",
    id_desc: "Kesehatan rohani tidak diukur dari aktivitas keagamaan — tetapi dari koneksi Anda dengan Tuhan. Seorang pemimpin bisa sangat sibuk dengan pekerjaan rohani dan tetap kosong secara rohani. Kebiasaan di sini bukan tentang performa. Ini tentang tetap terhubung dengan Dia yang memanggil Anda.",
    habits: [
      {
        en: "Pray honestly — including your doubts, frustrations, and fears. Jesus withdrew to solitary places not to report his successes but to remain in communion with the Father.",
        id: "Berdoa dengan jujur — termasuk keraguan, frustrasi, dan ketakutan Anda. Yesus menyingkir ke tempat-tempat yang sunyi bukan untuk melaporkan keberhasilan-Nya tetapi untuk tetap berada dalam persekutuan dengan Bapa.",
      },
      {
        en: "Read Scripture slowly — not for sermon preparation or content production, but for personal nourishment. Two verses read meditatively sustain more than two chapters read for information.",
        id: "Baca Kitab Suci dengan perlahan — bukan untuk persiapan khotbah atau produksi konten, tetapi untuk pemeliharaan pribadi. Dua ayat yang dibaca secara meditatif memberikan lebih banyak sustansi daripada dua pasal yang dibaca hanya untuk informasi.",
      },
      {
        en: "Stay embedded in a local community of faith. Cross-cultural leaders are especially vulnerable to becoming 'everyone's pastor and no one's parishioner.' Find a community where you receive, not only give.",
        id: "Tetaplah terhubung dalam komunitas iman lokal. Pemimpin lintas budaya sangat rentan menjadi 'gembala semua orang dan jemaat tidak seorang pun.' Temukan komunitas di mana Anda menerima, bukan hanya memberi.",
      },
    ],
  },
];

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
  const [auditScores, setAuditScores] = useState<Record<string, number>>({});
  const [openHabit, setOpenHabit] = useState<string | null>(null);

  const t = (en: string, id: string) => lang === "en" ? en : id;

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

      {/* -- STICKY NAV -- */}
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
          {t("PERSONAL DEVELOPMENT", "PENGEMBANGAN PRIBADI")}
        </span>
      </div>

      {/* -- HERO: SURVIVING VS THRIVING -- */}
      <section style={{ background: navy, padding: "96px 24px 80px", position: "relative", overflow: "hidden" }}>
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
              "Kebanyakan pemimpin tidak gagal. Mereka sedang bertahan — mengelola output sambil diam-diam menguras diri. Pertanyaan yang diajukan modul ini bukan: bisakah Anda terus berjalan? Melainkan: apakah Anda sedang membangun untuk bertahan lama?"
            )}
          </p>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600,
            color: "oklch(55% 0.06 260)", lineHeight: 1.65, maxWidth: 600, marginBottom: 48,
          }}>
            {t(
              "This is not the Sabbath module — that is about theological rest. This is practical. It is about the architecture of your personal health: the systems, habits, and support structures that determine whether you are still effective in 10 years.",
              "Ini bukan modul Sabat — itu tentang istirahat teologis. Ini bersifat praktis. Ini tentang arsitektur kesehatan pribadi Anda: sistem, kebiasaan, dan struktur dukungan yang menentukan apakah Anda masih efektif dalam 10 tahun ke depan."
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
                padding: "14px 36px",
                background: "transparent",
                border: `1.5px solid ${offWhite}`,
                cursor: saved ? "default" : "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                color: offWhite, letterSpacing: "0.06em", borderRadius: 4,
                opacity: saved ? 0.7 : 1,
              }}
            >
              {isPending
                ? t("Saving...", "Menyimpan...")
                : saved
                ? `✓ ${t("Saved to Dashboard", "Tersimpan di Dashboard")}`
                : t("Save to Dashboard", "Simpan ke Dashboard")}
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
                "Perawatan proaktif mencegah keluarnya para pemimpin. Ini bukan kemewahan yang disimpan untuk mereka yang memiliki energi berlebih. Ini adalah strategi yang membuat Anda tetap dalam pekerjaan cukup lama untuk melihatnya berbuah."
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
            {t("The Five Spheres of Care", "Lima Lingkup Perawatan")}
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
              "Klik lingkup mana saja untuk menjelajahi artinya dan seberapa kuat kondisi Anda saat ini."
            )}
          </p>

          {/* Sphere visual */}
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
                    background: isActive ? offWhite : "white",
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
                    {lang === "en" ? activeSphereData.en_title : activeSphereData.id_title}
                  </div>
                  <div style={{ fontFamily: serif, fontSize: 15, color: bodyText, fontStyle: "italic" }}>
                    {lang === "en" ? activeSphereData.en_subtitle : activeSphereData.id_subtitle}
                  </div>
                </div>
              </div>

              <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.85, marginBottom: 32 }}>
                {lang === "en" ? activeSphereData.en_desc : activeSphereData.id_desc}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: 12,
                  }}>
                    {t("What This Looks Like", "Bagaimana Ini Terlihat")}
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {(lang === "en" ? activeSphereData.en_examples : activeSphereData.id_examples).map((ex, i) => (
                      <li key={i} style={{
                        display: "flex", gap: 10, alignItems: "flex-start",
                        marginBottom: 10, fontFamily: serif,
                        fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.6, color: bodyText,
                      }}>
                        <span style={{ color: activeSphereData.color, fontWeight: 700, flexShrink: 0, marginTop: 3 }}>›</span>
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
                    {t("Reflection", "Refleksi")}
                  </p>
                  <div style={{
                    background: lightGray, borderRadius: 10, padding: "20px 22px",
                    borderLeft: `3px solid ${activeSphereData.color}`,
                  }}>
                    <p style={{
                      fontFamily: serif, fontSize: "clamp(14px, 1.5vw, 17px)",
                      color: navy, lineHeight: 1.7, fontStyle: "italic", margin: 0,
                    }}>
                      {lang === "en" ? activeSphereData.en_question : activeSphereData.id_question}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            {t("Where Are You Right Now?", "Di Mana Anda Sekarang?")}
          </h2>
          <p style={{
            fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)",
            color: bodyText, lineHeight: 1.85, maxWidth: 640, marginBottom: 16,
          }}>
            {t(
              "Rate each of the ten areas on a scale of 1 to 5. This is not a diagnostic test — it is a rapid scan to help you see where your energy is actually going. Be honest. No one else will see this.",
              "Nilai setiap sepuluh area pada skala 1 hingga 5. Ini bukan tes diagnostik — ini adalah pemindaian cepat untuk membantu Anda melihat ke mana energi Anda sebenarnya pergi. Jujurlah. Tidak ada orang lain yang akan melihat ini."
            )}
          </p>
          <div style={{ display: "flex", gap: 32, marginBottom: 56, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "oklch(55% 0.18 25)" }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText }}>
                {t("1 to 2: Critical attention needed", "1 hingga 2: Perlu perhatian kritis")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: orange }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText }}>
                {t("3: Watchful — invest here", "3: Waspada — investasikan di sini")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "oklch(52% 0.16 145)" }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: bodyText }}>
                {t("4 to 5: Healthy — maintain it", "4 hingga 5: Sehat — pertahankan")}
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
                        {lang === "en" ? area.en_label : area.id_label}
                      </div>
                      {score > 0 && (
                        <div style={{
                          fontFamily: serif, fontSize: 12, color: getScoreColor(score),
                          fontStyle: "italic", marginTop: 2,
                        }}>
                          {score <= 2
                            ? (lang === "en" ? area.en_low : area.id_low)
                            : score >= 4
                            ? (lang === "en" ? area.en_high : area.id_high)
                            : t("Moderate, worth monitoring", "Sedang, perlu dipantau")}
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
                          borderRadius: 12,
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
                  {t("avg score", "skor rata-rata")}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 8 }}>
                  {totalScored}/{STRESS_AREAS.length} {t("areas rated", "area dinilai")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: "oklch(80% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                  {avgScore !== null && avgScore <= 2.5
                    ? t(
                        "Your overall picture shows significant depletion. This is not the time for more willpower — it is the time for structural change. Look at your lowest-scored areas first.",
                        "Gambaran keseluruhan Anda menunjukkan penipisan yang signifikan. Ini bukan saatnya untuk lebih banyak kemauan — ini saatnya untuk perubahan struktural. Lihat area dengan skor terendah Anda terlebih dahulu."
                      )
                    : avgScore !== null && avgScore <= 3.5
                    ? t(
                        "You are managing, but the margin is thin. The areas you scored 1 to 2 are worth your focused attention before they become crises.",
                        "Anda bisa bertahan, tetapi ruang gerak Anda sempit. Area yang Anda nilai 1 hingga 2 layak mendapat perhatian terfokus sebelum menjadi krisis."
                      )
                    : t(
                        "Your overall health looks solid. The practice now is maintenance — protect what is working and stay honest about any areas that start to slip.",
                        "Kesehatan keseluruhan Anda terlihat solid. Praktik sekarang adalah pemeliharaan — lindungi apa yang berhasil dan tetap jujur tentang area yang mulai menurun."
                      )}
                </p>
              </div>
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
              "Tiga kategori — sembilan kebiasaan. Bukan aturan untuk dipatuhi, tetapi investasi untuk dilindungi. Anda tidak akan melakukan semua sembilan dengan sempurna. Pilih satu atau dua yang diungkapkan Audit Stres Anda sebagai yang paling Anda butuhkan."
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
                        {lang === "en" ? cat.en_title : cat.id_title}
                      </div>
                      <div style={{ fontFamily: serif, fontSize: 14, color: bodyText, fontStyle: "italic", marginTop: 3 }}>
                        {lang === "en" ? cat.en_tagline : cat.id_tagline}
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
                        {lang === "en" ? cat.en_desc : cat.id_desc}
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
      <section style={{ background: offWhite, padding: "96px 24px" }}>
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
                "The research is direct: a study of 4,338 leaders across Southeast Asia found a 62.91% burnout rate³. Among cross-cultural field workers specifically, the factor most cited as contributing to burnout is not language acquisition, cultural complexity, or security risk. It is Sabbath refusal.",
                "Penelitian menunjukkan ini secara langsung: sebuah studi terhadap 4.338 pemimpin di Asia Tenggara menemukan tingkat kelelahan 62,91%³. Di antara pekerja lintas budaya di lapangan secara khusus, faktor yang paling sering disebut sebagai kontribusi terhadap kelelahan bukan penguasaan bahasa, kompleksitas budaya, atau risiko keamanan. Melainkan penolakan Sabat."
              )}
            </p>
            <p style={{ marginBottom: 28 }}>
              {t(
                "This is not simply an individual character flaw. In ministry and field contexts, the pressure not to rest is structurally embedded. Stopping feels like abandoning people who need you. Rest produces guilt because the work is never done. In collectivist cultures, taking personal time away from the team carries social cost — rest can feel like a statement about your commitment.",
                "Ini bukan sekadar kelemahan karakter individu. Dalam konteks pelayanan dan lapangan, tekanan untuk tidak beristirahat tertanam secara struktural. Berhenti terasa seperti meninggalkan orang-orang yang membutuhkan Anda. Istirahat menimbulkan rasa bersalah karena pekerjaannya tidak pernah selesai. Dalam budaya kolektivis, mengambil waktu pribadi dari tim membawa biaya sosial — istirahat bisa terasa seperti pernyataan tentang komitmen Anda."
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
                "Pertanyaannya bukan apakah Anda merasakan tekanan untuk terus maju. Tentu saja Anda merasakannya. Pertanyaannya adalah apakah Anda sedang membangun kehidupan di mana kapasitas yang berkelanjutan dimungkinkan — atau apakah Anda menguras waduk yang tidak pernah Anda isi kembali."
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
                "Perhatikan kata kerja aktif: Ia membaringkan, Ia membimbing, Ia menyegarkan. Mazmur ini menggambarkan Allah yang tidak sekadar mengizinkan istirahat — Ia memulainya. 'Ia membaringkan aku' adalah gambaran yang kuat: Gembala memimpin domba ke padang yang berumput hijau dan domba itu berbaring, karena itulah yang dilakukan Gembala. Allah tidak pasif terhadap kesejahteraan Anda. Ia secara aktif memandu Anda menuju pembaruan."
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
                  "Perintah keempat muncul dua kali dalam Kitab Suci. Dalam Keluaran 20, perintah untuk beristirahat didasarkan pada penciptaan: Allah beristirahat pada hari ketujuh, dan demikian pula Anda. Dalam Ulangan 5, perintah itu didasarkan pada pembebasan: Anda adalah budak di Mesir, di mana tidak ada yang beristirahat. Istirahat adalah tanda kebebasan."
                )}
              </p>
              <p style={{ marginBottom: 24 }}>
                {t(
                  "For cross-cultural leaders, the second framing may be more personally necessary. Many carry an Egypt inside them — an internalized taskmaster that does not allow them to stop. The Deuteronomy 5 Sabbath is not just permission to rest. It is a declaration that you are no longer defined by what you produce.",
                  "Bagi pemimpin lintas budaya, framing kedua mungkin lebih diperlukan secara pribadi. Banyak yang membawa Mesir di dalam diri mereka — seorang mandor yang diinternalisasi yang tidak mengizinkan mereka berhenti. Sabat Ulangan 5 bukan sekadar izin untuk beristirahat. Itu adalah deklarasi bahwa Anda tidak lagi didefinisikan oleh apa yang Anda hasilkan."
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
                  "Abraham Joshua Heschel⁵ menggambarkan Sabat sebagai 'istana dalam waktu' — bukan tempat yang Anda datangi, tetapi ruang yang Anda huni, terlepas dari geografi. Bagi pemimpin yang pelayanannya membawa mereka jauh dari rumah, ini layak untuk direnungkan. Sabat Anda menemani Anda ke mana pun. Itu tidak tergantung pada lokasi."
                )}
              </p>
              <p style={{ marginBottom: 0 }}>
                {t(
                  "The research adds a further dimension. Leaders who practise psychological detachment⁶ — genuine mental disengagement from work during rest — not only recover better themselves. Studies show that a leader's capacity to detach directly improves the recovery outcomes of their team. Protecting your rhythm is not just self-care. It is stewardship of those you lead.",
                  "Penelitian menambahkan dimensi lain. Pemimpin yang mempraktikkan pelepasan psikologis⁶ — pelepasan mental yang tulus dari pekerjaan selama istirahat — tidak hanya pulih lebih baik sendiri. Studi menunjukkan bahwa kemampuan pemimpin untuk melepaskan diri secara langsung meningkatkan hasil pemulihan tim mereka. Melindungi ritme Anda bukan sekadar perawatan diri. Itu adalah penatalayanan atas mereka yang Anda pimpin."
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
                "Anda bukan sumber energi. Anda adalah bejananya. Tuhan yang sama yang mengutus Anda ke dalam pekerjaan adalah Tuhan yang merancang istirahat ke dalam jalinan penciptaan. Membangun kecepatan yang berkelanjutan bukan konsesi terhadap kelemahan Anda — itu adalah tindakan iman dalam pemeliharaan-Nya yang terus-menerus."
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
                id: "Penelitian secara konsisten menunjukkan paradoks pemulihan⁶: pemimpin yang membangun ritme istirahat secara proaktif pulih lebih baik dan memimpin lebih baik. Bangun arsitektur itu sebelum Anda membutuhkannya, bukan ketika Anda sudah kehabisan energi.",
              },
              {
                en: "In high-demand cross-cultural contexts, rest-guilt is socially enforced, not just personally felt. Naming that pressure is the first honest step.",
                id: "Dalam konteks lintas budaya yang penuh tuntutan, rasa bersalah saat istirahat ditegakkan secara sosial, bukan hanya dirasakan secara pribadi. Menamai tekanan itu adalah langkah jujur pertama.",
              },
              {
                en: "When you protect your own rhythm, you give your team implicit permission to protect theirs. Your pace sets the system.",
                id: "Ketika Anda melindungi ritme Anda sendiri, Anda memberi tim Anda izin implisit untuk melindungi ritme mereka. Kecepatan Anda mengatur sistem.",
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
              "Look back at your Stress Audit. Which area scored lowest? That is where you begin. Not the whole framework — one habit, one sphere, one honest conversation. Sustainable pace is built one protected investment at a time.",
              "Lihat kembali Audit Stres Anda. Area mana yang mendapat skor terendah? Di situlah Anda memulai. Bukan seluruh kerangka — satu kebiasaan, satu lingkup, satu percakapan yang jujur. Kecepatan berkelanjutan dibangun satu investasi yang terlindungi pada satu waktu."
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
                background: saved ? "oklch(40% 0.15 145)" : orange,
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
      <div style={{ padding: "48px 24px 32px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: orange, marginBottom: 16 }}>
          Sources
        </p>
        {[
          "¹ Taylor, W.D. (ed.) — Too Valuable to Lose: Exploring the Causes and Cures of Missionary Attrition (William Carey Library, 1997) — ReMap I global study of cross-cultural worker attrition; identifies personal health neglect as leading preventable cause.",
          "² O'Donnell, K. (ed.) — Doing Member Care Well: Perspectives and Practices from the Field (William Carey Library, 2002) — establishes the five-sphere concentric model of member care for long-term cross-cultural workers.",
          "³ Susabda, Y. & Gunawan, R. — Burnout Among Christian Leaders in Southeast Asia (Asia Graduate School of Theology, 2019) — survey of 4,338 leaders finding 62.91% burnout prevalence; Sabbath refusal identified as primary field-specific contributor.",
          "⁴ Brueggemann, W. — Sabbath as Resistance: Saying No to the Culture of Now (Westminster John Knox Press, 2014) — theological argument that Sabbath is counter-cultural resistance to productivity idolatry, not mere recuperation.",
          "⁵ Heschel, A.J. — The Sabbath: Its Meaning for Modern Man (Farrar, Straus and Giroux, 1951) — foundational theology of Sabbath as sacred time rather than sacred space; origin of the 'palace in time' image.",
          "⁶ Sonnentag, S. — Psychological Detachment from Work During Leisure Time: The Benefits of Mentally Disengaging from Work (Current Directions in Psychological Science, 2012) — meta-analysis establishing psychological detachment as the single most evidence-supported recovery mechanism; leader detachment improves team recovery outcomes.",
          "⁷ Walker, M.P. — Why We Sleep: Unlocking the Power of Sleep and Dreams (Scribner, 2017) — comprehensive review of sleep science; documents cognitive, emotional, and physiological costs of chronic sleep debt below 7 hours.",
          "⁸ Ratey, J.J. — Spark: The Revolutionary New Science of Exercise and the Brain (Little, Brown, 2008) — evidence base for aerobic exercise improving executive function, stress regulation, and cognitive sharpness in high-demand roles.",
        ].map((src, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: orange, flexShrink: 0, lineHeight: 1.7 }}>{["¹","²","³","⁴","⁵","⁶","⁷","⁸"][i]}</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "oklch(52% 0.04 260)", lineHeight: 1.7 }}>{src.replace(/^[¹²³⁴⁵⁶⁷⁸]\s*/,"")}</span>
          </div>
        ))}
      </div>

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
            "Jelajahi lebih banyak modul pelatihan untuk memperdalam kepemimpinan lintas budaya Anda."
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
