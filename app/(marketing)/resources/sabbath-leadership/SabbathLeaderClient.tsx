"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const navy      = "oklch(22% 0.10 260)";
const orange    = "oklch(65% 0.15 45)";
const offWhite  = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText  = "oklch(35% 0.08 260)";
const FONT      = "var(--font-montserrat), Montserrat, sans-serif";
const CORMORANT = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const MX        = 860;

// ─── Data ────────────────────────────────────────────────────────────────────
const dm1Options = [
  {
    label: `"I'm running on empty but I can't stop -- there's too much depending on me."`,
    labelID: `"Aku berlari dengan tangki kosong tapi tidak bisa berhenti -- terlalu banyak yang bergantung padaku."`,
    response: `That's a real position, and you're not alone in it. Most leaders reading this are carrying exactly that weight. Station 2 is for you -- it's about what happens before a sermon, before a strategy, before anything else. It's about what God actually does first.`,
    responseID: `Itu posisi yang nyata, dan kamu tidak sendirian. Kebanyakan pemimpin yang membaca ini menanggung beban itu. Pos 2 untukmu -- ini tentang apa yang terjadi sebelum khotbah, sebelum strategi, sebelum hal lain apa pun. Ini tentang apa yang sebenarnya Tuhan lakukan pertama kali.`,
  },
  {
    label: `"I stopped once, but I don't know how to make it a practice."`,
    labelID: `"Aku pernah berhenti sekali, tapi tidak tahu bagaimana menjadikannya kebiasaan."`,
    response: `You've already crossed the hardest threshold -- you know rest is possible. What you're missing is a structure that holds. Station 2 will show you something about how provision actually works, and the SRDC cards later will give you a practical framework to build from.`,
    responseID: `Kamu sudah melewati ambang yang paling sulit -- kamu tahu istirahat itu mungkin. Yang kurang adalah struktur yang bertahan. Pos 2 akan menunjukkan sesuatu tentang bagaimana provisi sebenarnya bekerja, dan kartu SRDC nanti akan memberimu kerangka praktis untuk dibangun.`,
  },
  {
    label: `"I rest fine personally -- but my team doesn't see me model it."`,
    labelID: `"Secara pribadi aku istirahat cukup baik -- tapi timku tidak melihat aku memodelkannya."`,
    response: `That awareness is already leadership. You've noticed the gap between your private practice and your public posture. Station 2 has something important for you about what modelling rest actually costs -- and what it gives.`,
    responseID: `Kesadaran itu sudah merupakan kepemimpinan. Kamu sudah memperhatikan kesenjangan antara praktik pribadi dan postur publikmu. Pos 2 punya sesuatu yang penting untukmu tentang apa yang sebenarnya dipertaruhkan saat memodelkan istirahat -- dan apa yang diberikannya.`,
  },
];

const dm2Options = [
  {
    label: `"Organisational pressure -- the culture expects constant availability."`,
    labelID: `"Tekanan organisasi -- budayanya mengharapkan ketersediaan konstan."`,
    response: `This is the most common barrier in high-demand ministry contexts, and it is real. It is not enough to want to rest if the system punishes stopping. Station 4 has something to say about where the still small voice fits -- and why quiet things cannot be heard by leaders who have never stopped.`,
    responseID: `Ini adalah hambatan yang paling umum dalam konteks pelayanan yang menuntut tinggi, dan itu nyata. Tidak cukup ingin beristirahat jika sistem menghukum orang yang berhenti. Pos 4 punya sesuatu untuk dikatakan tentang di mana suara yang lembut itu cocok -- dan mengapa hal-hal yang tenang tidak bisa didengar oleh pemimpin yang tidak pernah berhenti.`,
  },
  {
    label: `"Spiritual guilt -- I feel I'm letting God or my supporters down when I stop."`,
    labelID: `"Rasa bersalah spiritual -- aku merasa mengecewakan Tuhan atau pendukungku ketika aku berhenti."`,
    response: `This is the heaviest barrier to carry, because it has God's name on it. But the Elijah story is pointed: it is God who told Elijah to stop, God who fed him, God who let him sleep. The angel did not say "stop being so discouraged." He said "eat." Station 4 is for you.`,
    responseID: `Ini adalah hambatan yang paling berat untuk dibawa, karena ada nama Tuhan di dalamnya. Tapi cerita Elia itu tajam: adalah Tuhan yang menyuruh Elia berhenti, Tuhan yang memberinya makan, Tuhan yang membiarkannya tidur. Malaikat itu tidak berkata "berhenti merasa begitu putus asa." Dia berkata "makan." Pos 4 untukmu.`,
  },
  {
    label: `"My own drive -- I'm the one who doesn't want to stop."`,
    labelID: `"Doronganku sendiri -- akulah yang tidak ingin berhenti."`,
    response: `That honesty is worth something. Knowing it is you -- not the organisation, not the theology -- is the beginning of the change. Station 4 will take you somewhere quieter.`,
    responseID: `Kejujuran itu bernilai. Mengetahui bahwa itu adalah kamu -- bukan organisasi, bukan teologi -- adalah awal dari perubahan. Pos 4 akan membawamu ke tempat yang lebih tenang.`,
  },
];

const dm3Options = [
  {
    label: `"Naming a Sabbath day -- and communicating it to my team."`,
    labelID: `"Menetapkan hari Sabat -- dan mengkomunikasikannya kepada timku."`,
    response: `This is the structural step. Naming it makes it real. Communicating it makes it protected. Use the SRDC cards below to fill the day in. Start with the S -- decide when it ends, and tell someone before this week is over.`,
    responseID: `Ini adalah langkah struktural. Menamakannya membuatnya nyata. Mengkomunikasikannya membuatnya terlindungi. Gunakan kartu SRDC di bawah untuk mengisi hari itu. Mulai dengan S -- putuskan kapan berakhirnya, dan beritahu seseorang sebelum minggu ini selesai.`,
  },
  {
    label: `"Disconnecting from work communication for one full day each week."`,
    labelID: `"Memutus komunikasi pekerjaan selama satu hari penuh setiap minggu."`,
    response: `This is the boundary step. The research shows that the greatest barrier to genuine recovery is not absence from work, but presence in the mind. Turning off the notifications is not the same as ignoring them -- it is building a structure that keeps the choice from having to be remade every hour. The R card below gives you a framework.`,
    responseID: `Ini adalah langkah batas. Penelitian menunjukkan bahwa hambatan terbesar untuk pemulihan sejati bukan ketidakhadiran dari pekerjaan, tetapi kehadiran dalam pikiran. Mematikan notifikasi bukan berarti mengabaikannya -- ini adalah membangun struktur yang membuat pilihan tidak harus dibuat ulang setiap jam. Kartu R di bawah memberimu kerangka kerja.`,
  },
  {
    label: `"Identifying one person who will hold me accountable to rest."`,
    labelID: `"Mengidentifikasi satu orang yang akan memintai pertanggungjawabanku untuk beristirahat."`,
    response: `This is the relational step -- and often the most effective one, because the recovery paradox is not solved by discipline alone. It is solved by structure, and structure holds when someone else knows about it. The C card below gives you a starting practice. Take it into a conversation this week.`,
    responseID: `Ini adalah langkah relasional -- dan sering kali yang paling efektif, karena paradoks pemulihan tidak diselesaikan oleh disiplin saja. Diselesaikan oleh struktur, dan struktur bertahan ketika orang lain mengetahuinya. Kartu C di bawah memberimu praktik awal. Bawa itu ke dalam percakapan minggu ini.`,
  },
];

const srdcCards = [
  {
    letter: "S",
    word: "Stop",
    wordID: "Berhenti",
    desc: "Deliberately and completely cease work activity. Not slow down. Not wind down gradually. Stop.",
    descID: "Hentikan aktivitas kerja secara sengaja dan sepenuhnya. Bukan melambat. Bukan perlahan-lahan mengakhiri. Berhenti.",
    practices: [
      `Set a specific stop time on your chosen Sabbath day and name it as a covenant commitment -- not a preference. Tell one person the exact time before the day begins. Accountability makes the stop structural rather than aspirational.`,
      `Begin your Sabbath 30 minutes earlier than the day itself. Use those 30 minutes only for transition -- close your laptop, silence your work notifications, and let your nervous system adjust before the day starts. Hard stops after sustained intensity are neurologically difficult. The transition window is the buffer that makes the stop real.`,
      `Write "Sabbath" in your calendar as a meeting. Protect it with the same firmness you would protect a meeting with your supervisor or a donor conversation. If something tries to displace it, treat that as a scheduling conflict to be renegotiated -- not a reason to cancel the Sabbath.`,
    ],
    practicesID: [
      `Tetapkan waktu berhenti yang spesifik pada hari Sabatmu yang dipilih dan namai itu sebagai komitmen perjanjian -- bukan preferensi. Beritahu satu orang waktu pastinya sebelum hari dimulai. Akuntabilitas membuat penghentian bersifat struktural daripada hanya harapan.`,
      `Mulailah Sabatmu 30 menit lebih awal dari hari itu sendiri. Gunakan 30 menit itu hanya untuk transisi -- tutup laptopmu, matikan notifikasi pekerjaan, dan biarkan sistem sarafmu menyesuaikan diri sebelum hari dimulai. Penghentian keras setelah intensitas yang berkelanjutan sulit secara neurologis. Jendela transisi adalah penyangga yang membuat penghentian menjadi nyata.`,
      `Tulis "Sabat" di kalendermu sebagai pertemuan. Lindungi dengan ketegasan yang sama seperti kamu melindungi pertemuan dengan atasanmu atau percakapan dengan donor. Jika ada sesuatu yang mencoba memindahkannya, perlakukan itu sebagai konflik jadwal yang perlu dinegosiasi ulang -- bukan alasan untuk membatalkan Sabat.`,
    ],
  },
  {
    letter: "R",
    word: "Rest",
    wordID: "Istirahat",
    desc: "Allow your body and mind to recover without agenda. Rest is not laziness. It is repair.",
    descID: "Biarkan tubuh dan pikiranmu pulih tanpa agenda. Istirahat bukan kemalasan. Itu adalah perbaikan.",
    practices: [
      `Sleep in on your Sabbath day without guilt. Not as self-indulgence -- as an act of trust. If the work will continue without you on any other day, it will continue while you sleep. Your body is not a machine you can run indefinitely without maintenance. Elijah's first provision was sleep before food.`,
      `Eat one slow, unhurried meal. Sit down. Not at your desk. Not while checking your phone. Take your time. In a world where even mealtimes have been colonized by productivity, a slow meal is a small act of resistance.`,
      `When something feels like work, treat it as work -- and leave it for tomorrow. This includes answering "just one email." The IMD research is clear: compulsive overwork is defined precisely by the inability to stop even during nominally free time. Name the impulse when it comes. Then set it down.`,
    ],
    practicesID: [
      `Tidur lebih lama di hari Sabatmu tanpa rasa bersalah. Bukan sebagai kesenangan diri -- sebagai tindakan kepercayaan. Jika pekerjaan akan berlanjut tanpa kamu di hari lain, itu akan berlanjut saat kamu tidur. Tubuhmu bukan mesin yang bisa kamu jalankan tanpa batas tanpa perawatan. Provisi pertama Elia adalah tidur sebelum makan.`,
      `Makan satu kali makan yang lambat dan tidak terburu-buru. Duduk. Bukan di mejamu. Bukan sambil memeriksa ponselmu. Ambil waktumu. Di dunia di mana bahkan waktu makan telah dikolonisasi oleh produktivitas, makan yang lambat adalah tindakan perlawanan kecil.`,
      `Ketika sesuatu terasa seperti pekerjaan, perlakukan itu sebagai pekerjaan -- dan tinggalkan untuk besok. Ini termasuk menjawab "hanya satu email." Penelitian IMD jelas: kerja kompulsif didefinisikan tepatnya oleh ketidakmampuan untuk berhenti bahkan selama waktu yang secara nominal bebas. Namai dorongan itu ketika datang. Kemudian letakkan.`,
    ],
  },
  {
    letter: "D",
    word: "Delight",
    wordID: "Bersukacita",
    desc: "Do something that brings you joy simply because it is good -- not because it is useful, productive, or missiologically defensible.",
    descID: "Lakukan sesuatu yang membawa kegembiraan bagimu semata-mata karena itu baik -- bukan karena berguna, produktif, atau dapat dibenarkan secara misiologis.",
    practices: [
      `Identify one thing you genuinely enjoyed as a child or young adult that you have stopped doing -- not because you outgrew it, but because you stopped having time. Give it one hour this Sabbath. It does not need to have a point. That is the point.`,
      `Walk somewhere beautiful without a destination, a podcast, or an agenda. Notice what you see. The default mode of the mind, when released from task-focus, returns to connection and creativity. This is not wasted time. It is the ground from which insight grows.`,
      `Spend time with someone whose company brings you genuine pleasure -- without an agenda for the conversation, without a ministry reason, without an outcome. Cook something together. Sit outside. Let the time be full without being productive.`,
    ],
    practicesID: [
      `Identifikasi satu hal yang benar-benar kamu nikmati di masa kecil atau masa muda yang telah berhenti kamu lakukan -- bukan karena kamu sudah melewatinya, tetapi karena kamu tidak punya waktu lagi. Berikan satu jam untuk itu di Sabat ini. Tidak perlu ada maknanya. Itulah poinnya.`,
      `Berjalan ke suatu tempat yang indah tanpa tujuan, podcast, atau agenda. Perhatikan apa yang kamu lihat. Mode default pikiran, ketika dilepaskan dari fokus tugas, kembali ke koneksi dan kreativitas. Ini bukan waktu yang terbuang. Ini adalah tanah tempat wawasan tumbuh.`,
      `Habiskan waktu bersama seseorang yang kehadirannya membawa kesenangan nyata bagimu -- tanpa agenda untuk percakapan, tanpa alasan pelayanan, tanpa hasil. Masak sesuatu bersama. Duduk di luar. Biarkan waktu penuh tanpa harus produktif.`,
    ],
  },
  {
    letter: "C",
    word: "Contemplate",
    wordID: "Merenungkan",
    desc: "Be still in God's presence without asking for anything or doing anything. Not intercession. Not strategic prayer. Just presence.",
    descID: "Diamlah dalam hadirat Tuhan tanpa meminta apa pun atau melakukan apa pun. Bukan syafaat. Bukan doa strategis. Hanya kehadiran.",
    practices: [
      `Read one short Scripture passage slowly. Read it three times. After the third reading, ask yourself: what word or phrase caught my attention? Sit with that word for five minutes without explaining it. Let it rest. This is the practice the Christian tradition calls lectio divina -- sacred reading -- and it is one of the oldest tools for hearing what arrives in silence.`,
      `Write one sentence in a journal: "Today I am grateful for..." Let it become a prayer before you close the page. Gratitude is not a productivity hack. It is a reorientation of attention -- from what is missing to what has been given. Research consistently links gratitude practices to increased energy and reduced anxiety. More importantly, it is the disposition of Sabbath: receiving what God has provided.`,
      `Take a 20-minute walk without your phone, without earbuds, and without a destination. Let your footsteps be the rhythm. Let your mind come to rest. In many Christian traditions, this is called a "prayer walk" -- but the point is not to fill the walk with words. It is to arrive at stillness. The Elijah moment was silence after the wind, earthquake, and fire. Silence takes time to reach.`,
    ],
    practicesID: [
      `Baca satu bagian Kitab Suci yang pendek dengan perlahan. Baca tiga kali. Setelah bacaan ketiga, tanya dirimu: kata atau frasa apa yang menarik perhatianku? Diamlah dengan kata itu selama lima menit tanpa menjelaskannya. Biarkan beristirahat. Ini adalah praktik yang disebut tradisi Kristen sebagai lectio divina -- bacaan sakral -- dan ini adalah salah satu alat tertua untuk mendengar apa yang datang dalam keheningan.`,
      `Tulis satu kalimat dalam jurnal: "Hari ini aku bersyukur untuk..." Biarkan menjadi doa sebelum kamu menutup halaman. Rasa syukur bukan trik produktivitas. Ini adalah reorientasi perhatian -- dari apa yang kurang ke apa yang telah diberikan. Penelitian secara konsisten menghubungkan praktik rasa syukur dengan peningkatan energi dan berkurangnya kecemasan. Yang lebih penting, itu adalah disposisi Sabat: menerima apa yang telah Tuhan berikan.`,
      `Lakukan perjalanan 20 menit tanpa ponsel, tanpa earphone, dan tanpa tujuan. Biarkan langkah kakimu menjadi ritme. Biarkan pikiranmu beristirahat. Dalam banyak tradisi Kristen, ini disebut "prayer walk" -- tapi intinya bukan mengisi perjalanan dengan kata-kata. Ini adalah untuk mencapai ketenangan. Momen Elia adalah keheningan setelah angin, gempa bumi, dan api. Keheningan butuh waktu untuk dicapai.`,
    ],
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function StationDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", maxWidth: MX, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ flex: 1, height: 1, background: lightGray }} />
      <span style={{ color: orange, fontSize: "1.2rem", lineHeight: 1 }}>·</span>
      <div style={{ flex: 1, height: 1, background: lightGray }} />
    </div>
  );
}

function RecoveryParadoxSVG({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const svgFont = "Montserrat, sans-serif";
  const svgCormorant = "Cormorant Garamond, Georgia, serif";

  return (
    <figure style={{ margin: "0 auto", maxWidth: 560, width: "100%", padding: "0 24px" }}>
      <svg
        viewBox="0 0 560 420"
        width="100%"
        aria-hidden="true"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <marker id="rp-arrow-axis" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={navy} />
          </marker>
          <marker id="rp-arrow-loop" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={orange} />
          </marker>
        </defs>

        {/* Y-axis */}
        <line x1="80" y1="370" x2="80" y2="40" stroke={navy} strokeWidth="1.5" markerEnd="url(#rp-arrow-axis)" />
        {/* X-axis */}
        <line x1="60" y1="360" x2="510" y2="360" stroke={navy} strokeWidth="1.5" markerEnd="url(#rp-arrow-axis)" />

        {/* Y-axis label */}
        <text
          transform="rotate(-90, 22, 210)"
          x="22" y="210"
          textAnchor="middle"
          fontFamily={svgFont}
          fontSize="10"
          fill={navy}
          opacity="0.65"
        >
          {t("Capacity to Rest", "Kapasitas Beristirahat")}
        </text>

        {/* Y HIGH / LOW */}
        <text x="72" y="54" textAnchor="end" fontFamily={svgFont} fontSize="8" fill={navy} opacity="0.45">HIGH</text>
        <text x="72" y="364" textAnchor="end" fontFamily={svgFont} fontSize="8" fill={navy} opacity="0.45">LOW</text>

        {/* X-axis label */}
        <text x="290" y="400" textAnchor="middle" fontFamily={svgFont} fontSize="10" fill={navy} opacity="0.65">
          {t("Depletion Level", "Tingkat Kelelahan")}
        </text>

        {/* X LOW / HIGH */}
        <text x="86" y="378" textAnchor="start" fontFamily={svgFont} fontSize="8" fill={navy} opacity="0.45">LOW</text>
        <text x="502" y="378" textAnchor="end" fontFamily={svgFont} fontSize="8" fill={navy} opacity="0.45">HIGH</text>

        {/* Main descending curve */}
        <path d="M 80,70 C 180,80 300,280 480,340" stroke={navy} strokeWidth="3" fill="none" />

        {/* Orange dashed feedback arc */}
        <path
          d="M 480,340 A 300,200 0 0 0 80,70"
          stroke={orange}
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 5"
          markerEnd="url(#rp-arrow-loop)"
          opacity="0.85"
        />

        {/* Right node -- high depletion / low rest */}
        <circle cx="480" cy="340" r="18" fill={orange} opacity="0.15" />
        <circle cx="480" cy="340" r="5" fill={orange} />

        {/* Left node -- low depletion / high rest */}
        <circle cx="80" cy="70" r="18" fill={navy} opacity="0.10" />
        <circle cx="80" cy="70" r="5" fill={navy} />

        {/* Central title */}
        <text x="290" y="110" textAnchor="middle" fontFamily={svgCormorant} fontSize="20" fontStyle="italic" fill={navy}>
          {t("Recovery Paradox", "Paradoks Pemulihan")}
        </text>
        <line x1="210" y1="140" x2="370" y2="140" stroke={orange} strokeWidth="0.8" opacity="0.6" />

        {/* Loop direction label */}
        <text x="285" y="26" textAnchor="middle" fontFamily={svgFont} fontSize="9" fill={orange} fontWeight="600">
          {t("MORE DEPLETION", "KELELAHAN BERTAMBAH")}
        </text>
        <text x="285" y="38" textAnchor="middle" fontFamily={svgFont} fontSize="8" fill={orange} opacity="0.6">
          {t("(feeds back)", "(umpan balik)")}
        </text>

        {/* Callout box */}
        <rect x="351" y="158" width="130" height="38" rx="4" fill="white" stroke={orange} strokeWidth="1" opacity="0.95" />
        <text x="416" y="174" textAnchor="middle" fontFamily={svgFont} fontSize="10" fill={navy}>
          {t("Can't Detach", "Tidak Bisa")}
        </text>
        <text x="416" y="188" textAnchor="middle" fontFamily={svgFont} fontSize="10" fill={navy}>
          {t("to Rest", "Beristirahat")}
        </text>

        {/* Leader line to callout */}
        <line x1="288" y1="200" x2="350" y2="175" stroke={orange} strokeWidth="0.8" opacity="0.55" />
      </svg>

      <figcaption style={{
        textAlign: "center",
        fontSize: "0.72rem",
        color: "oklch(55% 0.05 260)",
        fontFamily: FONT,
        marginTop: "0.875rem",
        fontStyle: "italic",
        lineHeight: 1.5,
      }}>
        {t(
          "Recovery Paradox: the conditions that create exhaustion also reduce the ability to rest. / Paradoks Pemulihan: kondisi yang menciptakan kelelahan juga mengurangi kemampuan untuk beristirahat.",
          "Paradoks Pemulihan: kondisi yang menciptakan kelelahan juga mengurangi kemampuan untuk beristirahat. / Recovery Paradox: the conditions that create exhaustion also reduce the ability to rest."
        )}
      </figcaption>
    </figure>
  );
}

// ─── Shared styles ───────────────────────────────────────────────────────────
const prose: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
  color: bodyText,
  lineHeight: 1.8,
  marginBottom: "1.25rem",
};

const supStyle: React.CSSProperties = {
  color: orange,
  fontSize: "0.65em",
  verticalAlign: "super",
  lineHeight: 0,
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function SabbathLeaderClient({
  isSaved,
  isLoggedIn,
}: {
  isSaved: boolean;
  isLoggedIn: boolean;
}) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;

  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const [decision1, setDecision1] = useState<number | null>(null);
  const [decision2, setDecision2] = useState<number | null>(null);
  const [decision3, setDecision3] = useState<number | null>(null);
  const [digDeeper1Open, setDigDeeper1Open] = useState(false);
  const [digDeeper2Open, setDigDeeper2Open] = useState(false);

  const t = (en: string, id: string) => lang === "id" ? id : en;

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("sabbath-leadership");
      setSaved(true);
    });
  }

  // ─── Shared section containers ────────────────────────────────────────────
  const sec = (bg: string, py = "4rem"): React.CSSProperties => ({
    background: bg,
    padding: `${py} 0`,
  });

  const inner: React.CSSProperties = {
    maxWidth: MX,
    margin: "0 auto",
    padding: "0 24px",
  };

  // ─── Scripture blockquote ─────────────────────────────────────────────────
  function Scripture({ verse, ref: ref_ }: { verse: string; ref: string }) {
    return (
      <blockquote style={{
        borderLeft: `3px solid ${orange}`,
        paddingLeft: "1.5rem",
        margin: "2rem 0",
      }}>
        <p style={{
          fontFamily: CORMORANT,
          fontStyle: "italic",
          fontSize: "clamp(20px, 3vw, 26px)",
          color: navy,
          lineHeight: 1.5,
          margin: 0,
        }}>
          {verse}
        </p>
        <cite style={{
          display: "block",
          fontFamily: FONT,
          fontSize: "0.75rem",
          color: "oklch(55% 0.05 260)",
          fontStyle: "normal",
          marginTop: "0.75rem",
          letterSpacing: "0.04em",
        }}>
          {ref_}
        </cite>
      </blockquote>
    );
  }

  // ─── Station header ───────────────────────────────────────────────────────
  function StationHeader({
    eyebrowEN, eyebrowID,
    bilingualLabel,
  }: {
    eyebrowEN: string; eyebrowID: string;
    bilingualLabel: string;
  }) {
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{
          fontFamily: FONT,
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          color: orange,
          fontWeight: 700,
          margin: "0 0 0.4rem",
        }}>
          {t(eyebrowEN, eyebrowID)}
        </p>
        <p style={{
          fontFamily: FONT,
          fontSize: "0.72rem",
          fontWeight: 400,
          color: "oklch(58% 0.05 260)",
          margin: 0,
        }}>
          {bilingualLabel}
        </p>
      </div>
    );
  }

  // ─── Pause note ───────────────────────────────────────────────────────────
  function PauseNote() {
    return (
      <p style={{
        textAlign: "center",
        fontFamily: FONT,
        fontSize: "0.68rem",
        letterSpacing: "0.12em",
        color: orange,
        fontWeight: 700,
        margin: "3rem 0 1.5rem",
      }}>
        {t("PAUSE AND REFLECT", "BERHENTI DAN RENUNGKAN")}
      </p>
    );
  }

  // ─── Decision moment ──────────────────────────────────────────────────────
  function DecisionMoment({
    titleEN, titleID,
    subtitleEN, subtitleID,
    options,
    selected,
    onSelect,
  }: {
    titleEN: string; titleID: string;
    subtitleEN: string; subtitleID: string;
    options: typeof dm1Options;
    selected: number | null;
    onSelect: (i: number) => void;
  }) {
    return (
      <div>
        <h3 style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)",
          color: navy,
          textAlign: "center",
          letterSpacing: "0.05em",
          marginBottom: "0.5rem",
        }}>
          {t(titleEN, titleID)}
        </h3>
        <p style={{
          textAlign: "center",
          fontFamily: FONT,
          fontSize: "0.85rem",
          color: "oklch(55% 0.05 260)",
          marginBottom: "2rem",
        }}>
          {t(subtitleEN, subtitleID)}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <div key={i}>
                <button
                  onClick={() => onSelect(i)}
                  aria-pressed={isSelected}
                  aria-expanded={isSelected}
                  aria-controls={`dm-response-${titleEN.slice(0,6)}-${i}`}
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: isSelected ? navy : "white",
                    border: isSelected
                      ? `2px solid ${navy}`
                      : `2px solid ${lightGray}`,
                    borderLeft: `4px solid ${orange}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: FONT,
                    fontSize: "0.9rem",
                    color: isSelected ? "white" : bodyText,
                    fontWeight: isSelected ? 600 : 400,
                    transition: "background 0.2s ease, color 0.2s ease",
                    minHeight: 44,
                    lineHeight: 1.5,
                  }}
                >
                  {lang === "id" ? opt.labelID : opt.label}
                </button>

                {/* Animated response panel */}
                <div
                  id={`dm-response-${titleEN.slice(0,6)}-${i}`}
                  style={{
                    display: "grid",
                    gridTemplateRows: isSelected ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.28s ease",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div style={{
                      padding: "1.25rem 1.25rem 1.25rem 1.5rem",
                      background: offWhite,
                      borderLeft: `4px solid ${orange}`,
                      borderBottom: `1px solid ${lightGray}`,
                      borderRight: `1px solid ${lightGray}`,
                      borderRadius: "0 0 4px 4px",
                    }}>
                      <p style={{ ...prose, margin: 0 }}>
                        {lang === "id" ? opt.responseID : opt.response}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Chevron for Dig Deeper ───────────────────────────────────────────────
  function Chevron({ isOpen, light = false }: { isOpen: boolean; light?: boolean }) {
    const color = light ? offWhite : navy;
    return (
      <span style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRight: `2px solid ${color}`,
        borderBottom: `2px solid ${color}`,
        transform: isOpen ? "rotate(-135deg) translateY(3px)" : "rotate(45deg)",
        transition: "transform 0.25s ease",
        flexShrink: 0,
        marginLeft: "1rem",
      }} />
    );
  }

  // ─── Dig Deeper accordion ─────────────────────────────────────────────────
  function DigDeeper({
    id,
    labelEN, labelID,
    isOpen,
    onToggle,
    children,
  }: {
    id: string;
    labelEN: string; labelID: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) {
    return (
      <div style={{ marginTop: "2.5rem" }}>
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={id}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            background: "transparent",
            border: "none",
            borderTop: `1px solid ${lightGray}`,
            borderBottom: isOpen ? "none" : `1px solid ${lightGray}`,
            cursor: "pointer",
            fontFamily: FONT,
            fontSize: "0.83rem",
            fontWeight: 600,
            color: navy,
            textAlign: "left",
            letterSpacing: "0.02em",
          }}
        >
          <span>{t(labelEN, labelID)}</span>
          <Chevron isOpen={isOpen} />
        </button>

        <div
          id={id}
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div style={{
              padding: "1.5rem 1.25rem 2rem",
              borderBottom: `1px solid ${lightGray}`,
            }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: FONT, background: offWhite, color: bodyText }}>
      <LangToggle />

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        background: navy,
        padding: "5rem 24px 4.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Hero photo — luminosity blend over navy */}
        <img
          src="/images/resources/sabbath-leadership/hero-a.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            opacity: 0.22, mixBlendMode: "luminosity",
            pointerEvents: "none", userSelect: "none",
          }}
        />
        {/* Duotone overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: navy, opacity: 0.15, mixBlendMode: "multiply",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: MX, margin: "0 auto", position: "relative" }}>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            color: orange,
            fontWeight: 700,
            marginBottom: "1.25rem",
          }}>
            {t("SUSTAINABLE LEADERSHIP", "KEPEMIMPINAN BERKELANJUTAN")}
          </p>

          <h1 style={{
            fontFamily: CORMORANT,
            fontWeight: 600,
            fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
            color: "white",
            marginBottom: "1.5rem",
            lineHeight: 1.15,
          }}>
            {t("The Sabbath Leader", "Pemimpin Sabat")}
          </h1>

          <p style={{
            fontFamily: CORMORANT,
            fontStyle: "italic",
            fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
            color: "oklch(80% 0.04 260)",
            maxWidth: 640,
            margin: "0 auto",
            lineHeight: 1.65,
          }}>
            {t(
              "The leaders who most need rest are the ones who find it hardest to reach. This module follows one burned-out prophet through five stations -- and what happened when God didn't fix him, but fed him. By the time you finish, you'll have a framework you can actually use.",
              "Pemimpin yang paling butuh istirahat justru sering kali paling sulit untuk berhenti. Modul ini mengikuti perjalanan seorang nabi yang kelelahan melalui lima pos cerita -- dan apa yang terjadi ketika Tuhan tidak memperbaiki dia, tapi memberi makan dia. Saat kamu selesai, kamu akan punya kerangka kerja yang benar-benar bisa kamu pakai."
            )}
          </p>
        </div>
      </section>

      {/* ─── Slow-read notice ─── */}
      <div style={{
        background: "oklch(96% 0.035 75)",
        borderBottom: `1px solid oklch(88% 0.05 75)`,
        padding: "0.875rem 24px",
      }}>
        <div style={{ maxWidth: MX, margin: "0 auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>📖</span>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.78rem",
            color: "oklch(42% 0.08 60)",
            margin: 0,
            lineHeight: 1.5,
          }}>
            {t(
              "This module takes 15--20 minutes to read. It is built for slow reading -- follow Elijah through each station before moving on.",
              "Modul ini membutuhkan 15--20 menit untuk dibaca. Dirancang untuk dibaca pelan -- ikuti perjalanan Elia di setiap pos sebelum melanjutkan."
            )}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          INTRODUCTION
      ════════════════════════════════════════════════════════════ */}
      <section style={sec(offWhite)}>
        <div style={inner}>
          <p style={prose}>
            {t(
              "Burnout is not a season you push through. That is the lie most leaders are living with -- the idea that if you just stay the course long enough, the exhaustion will lift and momentum will return. It rarely works that way.",
              "Kelelahan bukan musim yang harus kamu terobos. Itu adalah kebohongan yang dihidupi oleh banyak pemimpin -- gagasan bahwa jika kamu cukup bertahan, kelelahan akan hilang dan momentum akan kembali. Itu jarang berhasil."
            )}
          </p>
          <p style={prose}>
            {t(
              "The numbers are stark. A 2024 study of 4,338 full-time employees across Malaysia, Singapore, the Philippines, and Indonesia found that 62.91% experienced high or very high burnout.",
              "Angkanya jelas. Sebuah studi 2024 terhadap 4.338 karyawan penuh waktu di Malaysia, Singapura, Filipina, dan Indonesia menemukan bahwa 62,91% mengalami kelelahan tinggi atau sangat tinggi."
            )}
            <sup style={supStyle}>1</sup>
            {" "}{t(
              "That is not a minority experience -- it is the majority one. And that figure covers the broader workforce. Cross-cultural workers and ministry leaders carry additional layers: language acquisition demands, spiritual pressure, donor visibility, cultural navigation, and the particular loneliness of living between worlds.",
              " Itu bukan pengalaman minoritas -- itu adalah pengalaman mayoritas. Dan angka itu mencakup tenaga kerja secara umum. Pekerja lintas budaya dan pemimpin pelayanan menanggung lapisan tambahan: tuntutan belajar bahasa, tekanan spiritual, akuntabilitas donor, navigasi budaya, dan kesendirian khas dari hidup di antara dua dunia."
            )}
          </p>
          <p style={prose}>
            {t(
              "Research by Compass Asia found that 71% of field workers leave the field for preventable reasons.",
              "Penelitian dari Compass Asia menemukan bahwa 71% pekerja lapangan meninggalkan ladang karena alasan yang bisa dicegah."
            )}
            <sup style={supStyle}>2</sup>
            {" "}{t(
              "When those workers were asked the single factor most often cited in their burnout, they named their own unwillingness to take one complete day off per week. Not organizational failure. Not persecution. Not circumstance. A rhythm they had stopped keeping.",
              " Ketika para pekerja itu ditanya faktor tunggal yang paling sering disebutkan dalam kelelahan mereka, mereka menyebut keengganan mereka sendiri untuk mengambil satu hari penuh istirahat per minggu. Bukan kegagalan organisasi. Bukan penganiayaan. Bukan keadaan. Sebuah ritme yang telah berhenti mereka jaga."
            )}
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            {t(
              "Here is what makes this hard: the people most depleted are the ones who find rest hardest to reach. Researchers call this the recovery paradox. High job demands -- the very conditions that create exhaustion -- also reduce your ability to psychologically detach from work. The more you need to stop, the harder stopping feels.",
              "Inilah yang membuat ini sulit: orang-orang yang paling terkuras adalah orang-orang yang paling sulit meraih istirahat. Para peneliti menyebut ini paradoks pemulihan. Tuntutan pekerjaan yang tinggi -- kondisi yang sama yang menciptakan kelelahan -- juga mengurangi kemampuanmu untuk melepaskan diri secara psikologis dari pekerjaan. Semakin kamu perlu berhenti, semakin sulit rasanya untuk berhenti."
            )}
          </p>
        </div>
      </section>

      {/* ─── Learning Outcomes ─── */}
      <section style={sec(offWhite, "0")}>
        <div style={{ ...inner, paddingBottom: "4rem" }}>
          <div style={{
            background: "white",
            borderLeft: `4px solid ${orange}`,
            borderRadius: "0 6px 6px 0",
            padding: "1.75rem 2rem",
          }}>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              color: orange,
              fontWeight: 700,
              marginBottom: "1rem",
            }}>
              {t("LEARNING OUTCOMES", "TUJUAN PEMBELAJARAN")}
            </p>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.875rem",
              color: "oklch(55% 0.05 260)",
              marginBottom: "0.875rem",
            }}>
              {t("After this module, you will be able to:", "Setelah modul ini, kamu akan mampu:")}
            </p>
            <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
              {[
                {
                  en: "Describe the psychological mechanism that makes rest hardest when it is most needed -- the recovery paradox -- and why willpower alone cannot solve it.",
                  id: "Menggambarkan mekanisme psikologis yang membuat istirahat paling sulit saat paling dibutuhkan -- paradoks pemulihan -- dan mengapa kekuatan tekad saja tidak cukup untuk mengatasinya.",
                },
                {
                  en: "Identify the cultural, organizational, and spiritual pressures that prevent leaders in cross-cultural and high-demand ministry contexts from building Sabbath rhythms.",
                  id: "Mengidentifikasi tekanan budaya, organisasi, dan spiritual yang menghalangi pemimpin dalam konteks lintas budaya dan pelayanan intensif dari membangun ritme Sabat.",
                },
                {
                  en: "Apply Scazzero's Stop/Rest/Delight/Contemplate (SRDC) framework to design a Sabbath practice suited to your own context and season.",
                  id: "Menerapkan kerangka Stop/Rest/Delight/Contemplate (SRDC) dari Scazzero untuk merancang praktik Sabat yang sesuai dengan konteks dan musimmu sendiri.",
                },
              ].map((item, i) => (
                <li key={i} style={{
                  fontFamily: FONT,
                  fontSize: "0.875rem",
                  color: bodyText,
                  lineHeight: 1.7,
                  marginBottom: i < 2 ? "0.75rem" : 0,
                }}>
                  {t(item.en, item.id)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATION 1 -- THE COLLAPSE  (offWhite)
      ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "3rem 0 0" }}>
        <StationDivider />
      </div>

      <section style={sec(offWhite, "3rem")}>
        <div style={inner}>
          <StationHeader
            eyebrowEN="STATION 1 -- THE COLLAPSE"
            eyebrowID="STASIUN 1 -- KERUNTUHAN"
            bilingualLabel="Station 1: The Collapse / Stasiun 1: Keruntuhan"
          />

          <Scripture
            verse={t(
              `"I have had enough, LORD. Take my life; I am no better than my ancestors."`,
              `"Cukuplah itu! Ya TUHAN, ambillah nyawaku, sebab aku ini tidak lebih baik dari pada nenek moyangku."`
            )}
            ref={t("-- 1 Kings 19:4", "-- 1 Raja-raja 19:4")}
          />

          <p style={prose}>
            {t(
              "Elijah had just pulled off one of the most dramatic confrontations in the Old Testament. On Mount Carmel, he had faced 450 prophets of Baal alone, called fire down from heaven, and seen an entire nation stagger back toward God. By any measure, it was the high point of his ministry.",
              "Elia baru saja menyelesaikan salah satu konfrontasi paling dramatis dalam Perjanjian Lama. Di Gunung Karmel, dia menghadapi 450 nabi Baal seorang diri, memanggil api dari langit, dan menyaksikan seluruh bangsa terhuyung kembali kepada Tuhan. Dari sudut pandang mana pun, itu adalah puncak pelayanannya."
            )}
          </p>
          <p style={prose}>
            {t(
              "Three days later, he was sitting under a broom tree in the wilderness, asking God to let him die.",
              "Tiga hari kemudian, dia duduk di bawah pohon arar di padang gurun, memohon kepada Tuhan agar mengambil nyawanya."
            )}
          </p>
          <p style={prose}>
            {t(
              "The sequence matters. Elijah didn't collapse during the lean years of hiding by the Kerith Brook. He didn't break under three and a half years of drought. He collapsed after Carmel. After the triumph. After the adrenaline drained.",
              "Urutannya penting. Elia tidak runtuh selama tahun-tahun sulit bersembunyi di tepi sungai Kerit. Dia tidak hancur dalam tiga setengah tahun kemarau. Dia runtuh setelah Karmel. Setelah kemenangan. Setelah adrenalin habis."
            )}
          </p>
          <p style={prose}>
            {t(
              "This is the pattern that burnout researchers keep finding. It is not weakness that drops a leader. It is the crash that follows a sustained peak. The high-demand context accumulates. The big win arrives. The adrenaline fades. And beneath it, the reserves are already gone.",
              "Inilah pola yang terus-menerus ditemukan oleh para peneliti kelelahan. Bukan kelemahan yang menjatuhkan seorang pemimpin. Melainkan keruntuhan yang mengikuti puncak yang berkepanjangan. Konteks yang menuntut tinggi terakumulasi. Kemenangan besar tiba. Adrenalin memudar. Dan di balik itu, cadangan sudah habis."
            )}
          </p>
          <p style={prose}>
            {t(
              "There is important research here. A meta-analysis of over 38,000 employees confirmed what practitioners in ministry have long observed: high job demands negatively predict your ability to detach from work.",
              "Ada penelitian penting di sini. Sebuah meta-analisis terhadap lebih dari 38.000 karyawan mengonfirmasi apa yang sudah lama diamati oleh para praktisi pelayanan: tuntutan pekerjaan yang tinggi secara negatif memprediksi kemampuanmu untuk melepaskan diri dari pekerjaan."
            )}
            <sup style={supStyle}>3</sup>
            {" "}{t(
              "The more demanding your context, the harder it becomes to psychologically step away from it -- even when you technically have the time.",
              " Semakin menuntut konteksmu, semakin sulit untuk secara psikologis melangkah pergi dari sana -- bahkan ketika kamu secara teknis punya waktu."
            )}
          </p>
          <p style={prose}>
            {t(
              "This is what researchers call the recovery paradox. It is not a character flaw. It is a documented psychological dynamic: the people who most need to rest are the least equipped, in that moment, to do so.",
              "Inilah yang disebut para peneliti sebagai paradoks pemulihan. Ini bukan cacat karakter. Ini adalah dinamika psikologis yang terdokumentasi: orang-orang yang paling butuh istirahat adalah orang-orang yang paling tidak siap, pada saat itu, untuk melakukannya."
            )}
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            {t(
              "He wasn't weak. He was depleted. And there is a difference.",
              "Dia tidak lemah. Dia terkuras. Dan ada perbedaannya."
            )}
          </p>

          {/* Decision Moment 1 */}
          <PauseNote />
          <DecisionMoment
            titleEN="WHERE ARE YOU RIGHT NOW?"
            titleID="KAMU SEKARANG ADA DI MANA?"
            subtitleEN="Choose the option that is closest to where you find yourself today:"
            subtitleID="Pilih opsi yang paling mendekati posisimu hari ini:"
            options={dm1Options}
            selected={decision1}
            onSelect={(i) => setDecision1(decision1 === i ? null : i)}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATION 2 -- THE PROVISION  (white)
      ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "3rem 0 0" }}>
        <StationDivider />
      </div>

      <section style={sec("white", "3rem")}>
        <div style={inner}>
          <StationHeader
            eyebrowEN="STATION 2 -- THE PROVISION"
            eyebrowID="STASIUN 2 -- PROVISI"
            bilingualLabel="Station 2: The Provision / Stasiun 2: Provisi"
          />

          <Scripture
            verse={t(
              `"Get up and eat."`,
              `"Bangunlah, makanlah."`
            )}
            ref={t("-- 1 Kings 19:5", "-- 1 Raja-raja 19:5")}
          />

          <p style={prose}>
            {t(
              "Elijah is under the broom tree. He has just prayed to die. He is as depleted as a person gets. And the first thing God does is let him sleep.",
              "Elia ada di bawah pohon arar. Dia baru saja berdoa agar mati. Dia sekelelahan yang bisa dialami seseorang. Dan hal pertama yang Tuhan lakukan adalah membiarkan dia tidur."
            )}
          </p>
          <p style={prose}>
            {t(
              "The angel appears, touches him, and says four words: \"Get up and eat.\" There is a cake baked on coals. A jar of water. No rebuke. No vision. No explanation of what comes next. Just food and the freedom to lie back down.",
              "Malaikat muncul, menyentuhnya, dan berkata empat kata: \"Bangun dan makanlah.\" Ada roti yang dipanggang di atas bara. Sebuah kendi air. Tidak ada teguran. Tidak ada penglihatan. Tidak ada penjelasan tentang apa yang akan datang. Hanya makanan dan kebebasan untuk berbaring kembali."
            )}
          </p>
          <p style={prose}>
            {t(
              "What is remarkable about this moment is what is absent. God does not correct Elijah's theology. God does not remind him of his calling. God does not tell him to pull himself together. The first response to a burned-out leader is provision -- material, physical, immediate.",
              "Yang luar biasa dari momen ini adalah apa yang tidak ada. Tuhan tidak memperbaiki teologi Elia. Tuhan tidak mengingatkannya akan panggilannya. Tuhan tidak menyuruhnya untuk membenahi diri. Respons pertama terhadap seorang pemimpin yang kelelahan adalah provisi -- material, fisik, langsung."
            )}
          </p>
          <p style={prose}>
            {t(
              "Rest begins in the body. Not in willpower. Not in a new resolve. In the body.",
              "Istirahat dimulai di dalam tubuh. Bukan dalam kekuatan tekad. Bukan dalam tekad baru. Dalam tubuh."
            )}
          </p>
          <p style={prose}>
            {t(
              "Peter Scazzero uses the framework Stop/Rest/Delight/Contemplate to describe what a full Sabbath practice involves.",
              "Peter Scazzero menggunakan kerangka Stop/Rest/Delight/Contemplate untuk menggambarkan apa yang dimaksud dengan praktik Sabat yang penuh."
            )}
            <sup style={supStyle}>5</sup>
            {" "}{t(
              "But the first letter -- the S -- is not \"slow down a little.\" It is Stop. Completely. The way Elijah stopped.",
              " Tapi huruf pertama -- S -- bukan \"sedikit melambat.\" Ini adalah Stop. Sepenuhnya. Seperti cara Elia berhenti."
            )}
          </p>
          <p style={prose}>
            {t(
              "Brueggemann captures what is at stake:",
              "Brueggemann menangkap apa yang dipertaruhkan:"
            )}
            {" "}
            <em>{t(
              `"Sabbath is not simply the pause that refreshes. It is the pause that transforms."`,
              `"Sabat bukan sekadar jeda yang menyegarkan. Itu adalah jeda yang mengubah."`
            )}</em>
            <sup style={supStyle}>6</sup>
            {" "}{t(
              "That language -- transforms -- is stronger than recover. Recovery implies returning to where you were. Transformation implies becoming someone the rest shaped.",
              " Bahasa itu -- mengubah -- lebih kuat dari pulih. Pemulihan berarti kembali ke tempat kamu berada. Transformasi berarti menjadi seseorang yang dibentuk oleh istirahat itu."
            )}
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            {t(
              "Researchers at IMD Business School distinguish between excessive overwork -- which is demanding but recoverable with genuine downtime -- and compulsive overwork, where guilt during breaks prevents true recovery even when you are nominally off duty.",
              "Para peneliti di IMD Business School membedakan antara kerja berlebihan yang berlebihan -- yang menuntut tapi bisa dipulihkan dengan waktu istirahat yang sungguh-sungguh -- dan kerja berlebihan yang kompulsif, di mana rasa bersalah saat istirahat mencegah pemulihan sejati bahkan ketika kamu secara nominal sedang libur."
            )}
            <sup style={supStyle}>7</sup>
            {" "}{t(
              "Ministry culture often produces the second type. Leaders who stop physically but continue mentally are not resting. They are pausing. Sabbath requires not just absence from work but freedom from the guilt of not working.",
              " Budaya pelayanan sering menghasilkan tipe kedua. Pemimpin yang berhenti secara fisik tetapi terus berlanjut secara mental tidak sedang beristirahat. Mereka sedang berhenti sejenak. Sabat membutuhkan bukan hanya absen dari pekerjaan tetapi kebebasan dari rasa bersalah karena tidak bekerja."
            )}
          </p>

          {/* Dig Deeper 1 */}
          <DigDeeper
            id="dd1-panel"
            labelEN="Dig Deeper: The Research Behind the Recovery Paradox"
            labelID="Pelajari Lebih Dalam: Penelitian di Balik Paradoks Pemulihan"
            isOpen={digDeeper1Open}
            onToggle={() => setDigDeeper1Open(!digDeeper1Open)}
          >
            <p style={{ ...prose, fontWeight: 600, color: navy }}>
              {t(
                "The meta-analysis by Wendsche and Lohmann-Haislah (2017) drew on 91 samples across 86 studies, totalling 38,124 participants.",
                "Meta-analisis oleh Wendsche dan Lohmann-Haislah (2017) mengambil data dari 91 sampel di 86 studi, dengan total 38.124 peserta."
              )}
              <sup style={supStyle}>3</sup>
              {" "}{t(
                "Findings on psychological detachment:",
                "Temuan tentang pelepasan psikologis:"
              )}
            </p>
            <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
              {[
                { en: "Reduced exhaustion: r = −0.36", id: "Pengurangan kelelahan: r = −0,36" },
                { en: "Improved wellbeing: r = 0.32", id: "Peningkatan kesejahteraan: r = 0,32" },
                { en: "Reduced fatigue: r = −0.42 (strongest effect)", id: "Pengurangan kelelahan fisik: r = −0,42 (efek terkuat)" },
                { en: "Better sleep quality: r = 0.30", id: "Kualitas tidur yang lebih baik: r = 0,30" },
              ].map((item, i) => (
                <li key={i} style={{ fontFamily: FONT, fontSize: "0.875rem", color: bodyText, lineHeight: 1.7, marginBottom: "0.3rem" }}>
                  {t(item.en, item.id)}
                </li>
              ))}
            </ul>
            <p style={prose}>
              {t(
                "The recovery paradox emerged from a related finding: high job demands predicted lower ability to detach (r = −0.25). This is not a personality issue -- it is a structural one. The conditions that create the need for recovery also impair the mechanisms of recovery.",
                "Paradoks pemulihan muncul dari temuan terkait: tuntutan pekerjaan yang tinggi memprediksi kemampuan yang lebih rendah untuk melepaskan diri (r = −0,25). Ini bukan masalah kepribadian -- ini adalah masalah struktural. Kondisi yang menciptakan kebutuhan pemulihan juga mengganggu mekanisme pemulihan."
              )}
            </p>
            <p style={prose}>
              {t(
                "Sonnentag and Schiffner (2019) extended this into leadership specifically.",
                "Sonnentag dan Schiffner (2019) memperluas ini ke kepemimpinan secara khusus."
              )}
              <sup style={supStyle}>4</sup>
              {" "}{t(
                "When supervisors psychologically disengage from work during leisure time, their subordinates show measurably improved recovery outcomes. Three mechanisms explain this:",
                " Ketika supervisor secara psikologis melepaskan diri dari pekerjaan selama waktu luang, bawahan mereka menunjukkan hasil pemulihan yang terukur membaik. Tiga mekanisme menjelaskan ini:"
              )}
            </p>
            <ol style={{ paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
              {[
                {
                  en: "Leaders who detach maintain better emotional states, making them more supportive when they return.",
                  id: "Pemimpin yang melepaskan diri mempertahankan keadaan emosional yang lebih baik, membuat mereka lebih suportif saat kembali.",
                },
                {
                  en: "They refrain from contacting staff outside working hours, giving team members genuine recovery time.",
                  id: "Mereka menahan diri dari menghubungi staf di luar jam kerja, memberikan anggota tim waktu pemulihan yang nyata.",
                },
                {
                  en: "They role-model boundary-keeping as an organizational norm -- communicating that rest is not disloyal.",
                  id: "Mereka memodelkan pemeliharaan batas sebagai norma organisasi -- mengkomunikasikan bahwa istirahat bukanlah ketidaksetiaan.",
                },
              ].map((item, i) => (
                <li key={i} style={{ fontFamily: FONT, fontSize: "0.875rem", color: bodyText, lineHeight: 1.7, marginBottom: "0.5rem" }}>
                  {t(item.en, item.id)}
                </li>
              ))}
            </ol>
            <p style={{ ...prose, marginBottom: 0 }}>
              {t(
                "Critically, leader detachment was a stronger predictor of employee recovery than the quality of the leader-supervisor relationship itself. A leader who models rest does more for their team's wellbeing than a leader who maintains a warm and consistent relationship but never stops.",
                "Yang kritis, pelepasan pemimpin adalah prediktor pemulihan karyawan yang lebih kuat dibanding kualitas hubungan pemimpin-supervisor itu sendiri. Pemimpin yang memodelkan istirahat melakukan lebih banyak untuk kesejahteraan timnya dibanding pemimpin yang mempertahankan hubungan yang hangat dan konsisten tapi tidak pernah berhenti."
              )}
            </p>
          </DigDeeper>
        </div>

        {/* Recovery Paradox SVG */}
        <div style={{ maxWidth: MX, margin: "3rem auto 0", padding: "0 0 1rem" }}>
          <RecoveryParadoxSVG lang={lang} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATION 3 -- THE LONG SLEEP  (offWhite)
      ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "3rem 0 0" }}>
        <StationDivider />
      </div>

      <section style={sec(offWhite, "3rem")}>
        <div style={inner}>
          <StationHeader
            eyebrowEN="STATION 3 -- THE LONG SLEEP"
            eyebrowID="STASIUN 3 -- TIDUR PANJANG"
            bilingualLabel="Station 3: The Long Sleep / Stasiun 3: Tidur Panjang"
          />

          <Scripture
            verse={t(
              `"He arose and ate and drank, and went in the strength of that food forty days and forty nights to Horeb, the mount of God."`,
              `"Lalu bangunlah ia, makan dan minum, dan dengan kekuatan yang didapat dari makanan itu ia berjalan empat puluh hari empat puluh malam lamanya sampai ke Horeb, gunung Allah."`
            )}
            ref={t("-- 1 Kings 19:8", "-- 1 Raja-raja 19:8")}
          />

          <p style={prose}>
            {t(
              "The angel came back a second time. \"Get up and eat, for the pathway is too much for you.\" Elijah slept. He ate. He slept again. He ate again. And then he walked forty days and forty nights on the strength of that one meal.",
              "Malaikat datang kembali untuk kedua kalinya. \"Bangun dan makanlah, karena prosesnya terlalu berat bagimu.\" Elia tidur. Dia makan. Dia tidur lagi. Dia makan lagi. Dan kemudian dia berjalan empat puluh hari empat puluh malam dari kekuatan satu kali makan itu."
            )}
          </p>
          <p style={prose}>
            {t(
              "Sit with the proportion of that. One encounter. One night of provision. Forty days of capacity.",
              "Renungkan proporsinya. Satu pertemuan. Satu malam provisi. Empat puluh hari kapasitas."
            )}
          </p>
          <p style={prose}>
            {t(
              "This is why Scazzero calls Sabbath a formation practice rather than a recovery strategy. Recovery is about returning to baseline. Formation is about being made into something. The forty days of Elijah's walking were not powered by Elijah's resolve. They were powered by what God had given him in a single night of care.",
              "Itulah mengapa Scazzero menyebut Sabat sebagai praktik pembentukan daripada strategi pemulihan. Pemulihan adalah tentang kembali ke titik dasar. Pembentukan adalah tentang dibentuk menjadi sesuatu. Empat puluh hari perjalanan Elia tidak didorong oleh tekad Elia. Itu didorong oleh apa yang Tuhan berikan kepadanya dalam satu malam kepedulian."
            )}
          </p>
          <p style={prose}>
            {t(
              "This pattern is not random. It is shaped by culture. In Confucian-influenced settings across Asia, rest carries social weight. If one person takes a day off, coworkers absorb the additional work. Rest becomes a statement that your colleagues matter less than your own comfort. In ministry contexts, this pressure is amplified by a theological layer: donor accountability, spiritual visibility, and the persistent belief that struggling means your faith is insufficient. The result is a systemic barrier, not an individual one.",
              "Pola ini bukan kebetulan. Ini dibentuk oleh budaya. Dalam setting yang dipengaruhi oleh nilai-nilai Konfusianisme di seluruh Asia, istirahat memiliki bobot sosial. Jika seseorang mengambil hari libur, rekan kerja menyerap pekerjaan tambahan. Istirahat menjadi pernyataan bahwa rekan-rekanmu penting lebih sedikit dari kenyamananmu sendiri. Dalam konteks pelayanan, tekanan ini diperkuat oleh lapisan teologis: akuntabilitas donor, visibilitas spiritual, dan keyakinan yang persisten bahwa berjuang berarti imanmu tidak cukup. Hasilnya adalah hambatan sistemik, bukan hambatan individual."
            )}
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            {t(
              "De Villiers and Marchinkowski (2021), writing in HTS Theological Studies, offer a framing that responds to this directly. They describe Sabbath as a covenantal act -- not a personal preference, but a structured commitment in relationship to God and community.",
              "De Villiers dan Marchinkowski (2021), menulis dalam HTS Theological Studies, menawarkan kerangka yang merespons ini secara langsung. Mereka menggambarkan Sabat sebagai tindakan perjanjian -- bukan preferensi pribadi, tetapi komitmen terstruktur dalam hubungan dengan Tuhan dan komunitas."
            )}
            <sup style={supStyle}>9</sup>
            {" "}{t(
              "Sabbath, in this frame, is the regular act of trust that says: the work belongs to God. I can stop because God does not.",
              " Sabat, dalam kerangka ini, adalah tindakan kepercayaan rutin yang berkata: pekerjaan ini milik Tuhan. Aku bisa berhenti karena Tuhan tidak berhenti."
            )}
          </p>

          {/* Decision Moment 2 */}
          <PauseNote />
          <DecisionMoment
            titleEN="WHAT MAKES STOPPING FEEL IMPOSSIBLE?"
            titleID="APA YANG MEMBUAT BERHENTI TERASA MUSTAHIL?"
            subtitleEN="Choose the option that most honestly names your barrier:"
            subtitleID="Pilih opsi yang paling jujur menyebutkan hambatanmu:"
            options={dm2Options}
            selected={decision2}
            onSelect={(i) => setDecision2(decision2 === i ? null : i)}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATION 4 -- THE QUESTION  (white)
      ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "3rem 0 0" }}>
        <StationDivider />
      </div>

      <section style={sec("white", "3rem")}>
        <div style={inner}>
          <StationHeader
            eyebrowEN="STATION 4 -- THE QUESTION"
            eyebrowID="STASIUN 4 -- PERTANYAAN"
            bilingualLabel="Station 4: The Question / Stasiun 4: Pertanyaan"
          />

          <Scripture
            verse={t(
              `"What are you doing here, Elijah?"`,
              `"Apakah kerjamu di sini, Elia?"`
            )}
            ref={t("-- 1 Kings 19:9", "-- 1 Raja-raja 19:9")}
          />

          <p style={prose}>
            {t(
              "Elijah reaches Horeb -- the mountain of God. He goes into a cave. And then the word of the Lord comes to him: \"What are you doing here, Elijah?\" It is not an accusation. It is a question. The kind of question that creates space.",
              "Elia mencapai Horeb -- gunung Allah. Dia masuk ke dalam gua. Dan kemudian firman Tuhan datang kepadanya: \"Apa kerjamu di sini, Elia?\" Itu bukan tuduhan. Itu adalah pertanyaan. Jenis pertanyaan yang menciptakan ruang."
            )}
          </p>
          <p style={prose}>
            {t(
              "A great wind tore the mountains apart. An earthquake shook the ground. Fire passed. But the Lord was not in any of them. And then: a gentle whisper. A still small voice. The sound of thin silence.",
              "Angin besar merobek gunung-gunung. Gempa bumi mengguncang tanah. Api lewat. Tapi Tuhan tidak ada dalam satupun dari mereka. Dan kemudian: bisikan lembut. Suara yang halus dan sunyi. Bunyi keheningan tipis."
            )}
          </p>
          <p style={prose}>
            {t(
              "Here is the teaching the story refuses to rush past: God was not in the overwhelming things. God was in the quiet. And the quiet required Elijah to be still long enough to hear it.",
              "Inilah pengajaran yang tidak diburu-buru oleh cerita: Tuhan tidak ada dalam hal-hal yang luar biasa. Tuhan ada dalam ketenangan. Dan ketenangan itu mengharuskan Elia cukup diam untuk mendengarnya."
            )}
          </p>
          <p style={prose}>
            {t(
              "This is the contemplative core of Sabbath. Not information -- but attention. Not answers -- but presence. Abraham Joshua Heschel writes that Western culture is organized around the conquest of space and objects, but that Sabbath sanctifies time instead.",
              "Inilah inti kontemplatif dari Sabat. Bukan informasi -- tapi perhatian. Bukan jawaban -- tapi kehadiran. Abraham Joshua Heschel menulis bahwa budaya Barat diorganisir di sekitar penaklukan ruang dan objek, tetapi bahwa Sabat menyucikan waktu."
            )}
            <sup style={supStyle}>8</sup>
            {" "}{t(
              "He calls it \"a palace in time\" -- a sanctuary built not in stone or location, but in hours. For cross-cultural leaders who live in transit, who belong fully to no single place, this framing carries particular weight. The Sabbath travels with them.",
              " Dia menyebutnya \"istana dalam waktu\" -- tempat suci yang dibangun bukan dalam batu atau lokasi, tetapi dalam jam-jam. Bagi pemimpin lintas budaya yang hidup dalam transit, yang tidak sepenuhnya milik satu tempat, kerangka ini memiliki bobot tertentu. Sabat bepergian bersama mereka."
            )}
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            {t(
              "Leaders who have not rested cannot hear quiet things. Not because they are spiritually deficient -- but because the nervous system trained on noise cannot receive what arrives in silence. Sabbath is, among other things, training the ear.",
              "Pemimpin yang tidak beristirahat tidak bisa mendengar hal-hal yang tenang. Bukan karena mereka kekurangan secara spiritual -- tetapi karena sistem saraf yang terlatih pada kebisingan tidak dapat menerima apa yang datang dalam keheningan. Sabat adalah, di antara hal-hal lain, melatih telinga."
            )}
          </p>

          {/* Dig Deeper 2 */}
          <DigDeeper
            id="dd2-panel"
            labelEN="Dig Deeper: Brueggemann and Heschel"
            labelID="Pelajari Lebih Dalam: Brueggemann dan Heschel"
            isOpen={digDeeper2Open}
            onToggle={() => setDigDeeper2Open(!digDeeper2Open)}
          >
            <p style={prose}>
              {t(
                "Walter Brueggemann's Sabbath as Resistance (Westminster John Knox, 2013) opens with the Egyptian slave economy. In Egypt, there was no Sabbath. Production was continuous. Workers were defined entirely by their output. Worth was calculated in bricks.",
                "Sabbath as Resistance (Westminster John Knox, 2013) karya Walter Brueggemann dibuka dengan ekonomi budak Mesir. Di Mesir, tidak ada Sabat. Produksi berlangsung terus-menerus. Para pekerja didefinisikan sepenuhnya oleh hasilnya. Nilai dihitung dalam batu bata."
              )}
              <sup style={supStyle}>6</sup>
            </p>
            <p style={prose}>
              {t(
                "Brueggemann argues that the Sabbath commandment in Exodus was not only a religious observance -- it was a structural counter to that economy. When Israel stopped producing, they declared by action that they were not slaves. Their worth did not depend on their output. For leaders in performance-driven organisations -- including ministry organizations with donor accountability structures -- Sabbath is not a reward for finishing your work. It is a declaration that you are not what you produce.",
                "Brueggemann berargumen bahwa perintah Sabat dalam Keluaran bukan hanya ketaatan agama -- itu adalah perlawanan struktural terhadap ekonomi itu. Ketika Israel berhenti memproduksi, mereka menyatakan dengan tindakan bahwa mereka bukan budak. Nilai mereka tidak bergantung pada hasil mereka. Bagi pemimpin dalam organisasi yang didorong oleh kinerja -- termasuk organisasi pelayanan dengan struktur akuntabilitas donor -- Sabat bukan hadiah karena menyelesaikan pekerjaan. Ini adalah deklarasi bahwa kamu bukan apa yang kamu hasilkan."
              )}
            </p>
            <p style={prose}>
              {t(
                "Abraham Joshua Heschel, writing from the Jewish tradition in The Sabbath (1951), argues that Western civilization is dominated by an orientation toward space: we build, occupy, conquer, and acquire. But the Sabbath sanctifies time. It builds a \"palace in time\" -- a sanctuary that requires no location, no building, no deed.",
                "Abraham Joshua Heschel, menulis dari tradisi Yahudi dalam The Sabbath (1951), berargumen bahwa peradaban Barat didominasi oleh orientasi terhadap ruang: kita membangun, menempati, menaklukkan, dan memperoleh. Tapi Sabat menyucikan waktu. Ia membangun \"istana dalam waktu\" -- tempat suci yang tidak memerlukan lokasi, bangunan, atau kepemilikan."
              )}
              <sup style={supStyle}>8</sup>
            </p>
            <p style={{ ...prose, marginBottom: 0 }}>
              {t(
                "His concept of menuha (the Hebrew word often translated as \"rest\") is not the absence of activity. It is not mere cessation. Heschel describes it as a particular quality of being -- active rest, creative stillness, delight. Sabbath is not collapse. It is a different kind of aliveness. For Mark 2:27 -- \"The Sabbath was made for man, not man for the Sabbath\" -- this is not Jesus dismissing Sabbath. It is Jesus restoring its creation intent.",
                "Konsepnya tentang menuha (kata Ibrani yang sering diterjemahkan sebagai \"istirahat\") bukan ketiadaan aktivitas. Ini bukan sekadar penghentian. Heschel menggambarkannya sebagai kualitas keberadaan tertentu -- istirahat aktif, keheningan kreatif, kesenangan. Sabat bukan runtuh. Ini adalah jenis keaktifan yang berbeda. Untuk Markus 2:27 -- \"Hari Sabat diadakan untuk manusia dan bukan manusia untuk hari Sabat\" -- ini bukan Yesus mengabaikan Sabat. Ini adalah Yesus memulihkan niat penciptaannya."
              )}
            </p>
          </DigDeeper>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATION 5 -- THE RETURN  (offWhite)
      ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "3rem 0 0" }}>
        <StationDivider />
      </div>

      <section style={sec(offWhite, "3rem")}>
        <div style={inner}>
          <StationHeader
            eyebrowEN="STATION 5 -- THE RETURN"
            eyebrowID="STASIUN 5 -- KEMBALI"
            bilingualLabel="Station 5: The Return / Stasiun 5: Kembali"
          />

          <Scripture
            verse={t(
              `"Go, return on your way."`,
              `"Pergilah, kembalilah menempuh perjalananmu."`
            )}
            ref={t("-- 1 Kings 19:15", "-- 1 Raja-raja 19:15")}
          />

          <p style={prose}>
            {t(
              "God asks Elijah the question a second time. Elijah answers with the same words. And this time, God does not argue with the answer. He simply sends him back.",
              "Tuhan mengajukan pertanyaan kepada Elia untuk kedua kalinya. Elia menjawab lagi dengan kata-kata yang sama. Dan kali ini, Tuhan tidak berdebat dengan jawabannya. Dia hanya menyuruhnya kembali."
            )}
          </p>
          <p style={prose}>
            {t(
              "There is a mission waiting. There is work to do -- anointing kings, appointing a successor. The story does not end at Horeb. Elijah returns. The calling resumes. But something has changed. Elijah did not earn his way back to ministry through spiritual performance. He was fed. He rested. He heard a whisper. And then he was sent.",
              "Ada misi yang menunggu. Ada pekerjaan yang harus dilakukan -- mengurapi raja, menunjuk penerus. Cerita tidak berakhir di Horeb. Elia kembali. Panggilan berlanjut. Tapi sesuatu telah berubah. Elia tidak mendapatkan kembali jalan ke pelayanan melalui kinerja spiritual. Dia diberi makan. Dia beristirahat. Dia mendengar bisikan. Dan kemudian dia diutus."
            )}
          </p>
          <p style={prose}>
            {t(
              "The provision became the preparation. The rest was not an interruption of the work -- it was the means by which the work could continue.",
              "Provisi menjadi persiapan. Istirahat itu bukan gangguan dari pekerjaan -- itu adalah sarana agar pekerjaan bisa dilanjutkan."
            )}
          </p>
          <p style={prose}>
            {t(
              "Calling it \"self-care\" does not land well with leaders who have given everything to a cause. But reframing it as stewardship -- of the mission, of the team, of the calling -- changes the logic entirely.",
              "Menyebutnya \"perawatan diri\" tidak terdengar baik bagi pemimpin yang telah memberikan segalanya untuk sebuah tujuan. Tapi merangkainya sebagai penatalayanan -- dari misi, dari tim, dari panggilan -- mengubah logikanya sepenuhnya."
            )}
          </p>
          <p style={prose}>
            {t(
              "Sonnentag and Schiffner (2019) showed that leader detachment from work during leisure time was a stronger predictor of team member wellbeing than the quality of the relationship between leader and supervisor.",
              "Sonnentag dan Schiffner (2019) menunjukkan bahwa pelepasan pemimpin dari pekerjaan selama waktu luang adalah prediktor kesejahteraan anggota tim yang lebih kuat dibanding kualitas hubungan antara pemimpin dan supervisor."
            )}
            <sup style={supStyle}>4</sup>
            {" "}{t(
              "Leaders who model relentless availability teach their teams that rest is disloyal. Leaders who model Sabbath give their teams organizational permission to stop.",
              " Pemimpin yang memodelkan ketersediaan tanpa henti mengajari tim mereka bahwa istirahat itu tidak setia. Pemimpin yang memodelkan Sabat memberi tim mereka izin organisasi untuk berhenti."
            )}
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            {t(
              "Mark Buchanan puts it plainly: Sabbath imparts both a day and a disposition. It is \"a time on the calendar and a way we see.\" Protecting your Sabbath is protecting your team. That is not self-care language. That is stewardship language.",
              "Mark Buchanan mengatakannya dengan jelas: Sabat memberikan keduanya -- hari dan disposisi. Ini adalah \"waktu dalam kalender dan cara kita melihat.\" Melindungi Sabatmu berarti melindungi timmu. Itu bukan bahasa perawatan diri. Itu adalah bahasa penatalayanan."
            )}
            <sup style={supStyle}>10</sup>
          </p>

          {/* Decision Moment 3 */}
          <PauseNote />
          <DecisionMoment
            titleEN="WHAT WOULD ONE CHANGE LOOK LIKE?"
            titleID="SATU PERUBAHAN AKAN TERLIHAT SEPERTI APA?"
            subtitleEN="Choose the step that feels most honest for where you are right now:"
            subtitleID="Pilih langkah yang paling jujur untuk posisimu saat ini:"
            options={dm3Options}
            selected={decision3}
            onSelect={(i) => setDecision3(decision3 === i ? null : i)}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SRDC PRACTICE CARDS  (offWhite)
      ════════════════════════════════════════════════════════════ */}
      <section style={sec(offWhite, "5rem")}>
        <div style={inner}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              color: orange,
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}>
              {t("SRDC FRAMEWORK", "KERANGKA SRDC")}
            </p>
            <h2 style={{
              fontFamily: CORMORANT,
              fontWeight: 600,
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              color: navy,
              marginBottom: "0.75rem",
            }}>
              {t("Stop. Rest. Delight. Contemplate.", "Berhenti. Istirahat. Bersukacita. Merenungkan.")}
            </h2>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.875rem",
              color: "oklch(55% 0.05 260)",
              maxWidth: 520,
              margin: "0 auto",
            }}>
              {t(
                "Four movements that together form a Sabbath. Each card gives you one practice area and three things to try this week.",
                "Empat gerakan yang bersama-sama membentuk Sabat. Setiap kartu memberimu satu area praktik dan tiga hal untuk dicoba minggu ini."
              )}
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "1.5rem",
          }}>
            {srdcCards.map((card) => (
              <article
                key={card.letter}
                style={{
                  background: offWhite,
                  border: `1px solid ${lightGray}`,
                  borderRadius: "6px",
                  padding: "2rem",
                  cursor: "default",
                }}
              >
                {/* Big letter */}
                <p style={{
                  fontFamily: CORMORANT,
                  fontWeight: 600,
                  fontSize: "clamp(52px, 8vw, 72px)",
                  color: orange,
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}>
                  {card.letter}
                </p>

                {/* Word */}
                <h3 style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: navy,
                  marginBottom: "0.75rem",
                  letterSpacing: "0.02em",
                }}>
                  {t(card.word, card.wordID)}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.85rem",
                  color: "oklch(42% 0.06 260)",
                  lineHeight: 1.65,
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}>
                  {t(card.desc, card.descID)}
                </p>

                {/* Practices */}
                <ol style={{ paddingLeft: "1.1rem", margin: 0 }}>
                  {(lang === "id" ? card.practicesID : card.practices).map((p, i) => (
                    <li key={i} style={{
                      fontFamily: FONT,
                      fontSize: "0.82rem",
                      color: bodyText,
                      lineHeight: 1.7,
                      marginBottom: i < 2 ? "0.875rem" : 0,
                    }}>
                      {p}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FAITH ANCHOR  (navy)
      ════════════════════════════════════════════════════════════ */}
      <section style={sec(navy)}>
        <div style={inner}>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            color: orange,
            fontWeight: 700,
            marginBottom: "2.5rem",
          }}>
            {t("FAITH ANCHOR", "JANGKAR IMAN")}
          </p>

          {/* Scripture 1 */}
          <blockquote style={{
            borderLeft: `3px solid ${orange}`,
            paddingLeft: "1.5rem",
            marginBottom: "2rem",
          }}>
            <p style={{
              fontFamily: CORMORANT,
              fontStyle: "italic",
              fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)",
              color: "white",
              lineHeight: 1.55,
              margin: 0,
            }}>
              {t(
                `"Get up and eat, for the pathway is too much for you."`,
                `"Bangunlah dan makanlah, sebab perjalananmu masih jauh bagimu."`
              )}
            </p>
            <cite style={{
              display: "block",
              fontFamily: FONT,
              fontSize: "0.75rem",
              color: "oklch(70% 0.04 260)",
              fontStyle: "normal",
              marginTop: "0.75rem",
            }}>
              {t("-- 1 Kings 19:7", "-- 1 Raja-raja 19:7")}
            </cite>
          </blockquote>

          {/* Scripture 2 */}
          <blockquote style={{
            borderLeft: `3px solid ${orange}`,
            paddingLeft: "1.5rem",
            marginBottom: "3rem",
          }}>
            <p style={{
              fontFamily: CORMORANT,
              fontStyle: "italic",
              fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)",
              color: "white",
              lineHeight: 1.55,
              margin: 0,
            }}>
              {t(
                `"There remains, then, a Sabbath-rest for the people of God; for anyone who enters God's rest also rests from their own works, just as God did from his."`,
                `"Jadi masih tersedia suatu hari perhentian, hari Sabat, bagi umat Allah. Sebab barangsiapa telah masuk ke tempat peristirahatan-Nya, ia sendiri telah beristirahat dari segala pekerjaannya, sama seperti Allah berhenti dari pekerjaan-Nya."`
              )}
            </p>
            <cite style={{
              display: "block",
              fontFamily: FONT,
              fontSize: "0.75rem",
              color: "oklch(70% 0.04 260)",
              fontStyle: "normal",
              marginTop: "0.75rem",
            }}>
              {t("-- Hebrews 4:9-10", "-- Ibrani 4:9-10")}
            </cite>
          </blockquote>

          {/* Reflection */}
          {[
            {
              en: "What God said to Elijah on that hillside was not a correction. It was a provision. The burned-out prophet asked to die. God's response was food and sleep. Not explanation. Not vision. Not rebuke for the collapse that followed Carmel. Just: here is bread. Here is water. Eat. Sleep. The pathway ahead is too much for you as you are. Let me give you what you need before you go.",
              id: "Apa yang dikatakan Tuhan kepada Elia di atas bukit itu bukan teguran. Itu adalah provisi. Nabi yang kelelahan itu meminta untuk mati. Respons Tuhan adalah makanan dan tidur. Bukan penjelasan. Bukan penglihatan. Bukan teguran atas keruntuhan yang mengikuti Karmel. Hanya: ini rotinya. Ini airnya. Makan. Tidur. Prosesnya terlalu berat bagimu seperti ini. Biarkan Aku memberimu apa yang kamu butuhkan sebelum kamu pergi.",
            },
            {
              en: "The writers of Scripture return to this pattern across the centuries. The Hebrews 4 text introduces a word that appears only once in the New Testament: sabbatismos. A Sabbath-rest. The author's argument is not simply that weekly rest is good practice. It is that there is a rest that remains -- an eschatological reality into which believers are already entering, and which has not yet fully arrived. The Sabbath is both present and future. Both practice and promise.",
              id: "Para penulis Kitab Suci kembali ke pola ini selama berabad-abad. Teks Ibrani 4 memperkenalkan kata yang hanya muncul sekali dalam Perjanjian Baru: sabbatismos. Istirahat Sabat. Argumen penulisnya bukan hanya bahwa istirahat mingguan adalah praktik yang baik. Melainkan bahwa ada istirahat yang tetap ada -- realitas eskatologis yang sudah dimasuki oleh orang-orang percaya, dan yang belum sepenuhnya tiba. Sabat itu sekaligus kini dan masa depan. Sekaligus praktik dan janji.",
            },
            {
              en: "Dan Allender argues that Sabbath is fundamentally about eschatological joy -- menuha, the Hebrew word for rest that carries within it a sense of delight, not mere cessation. The Sabbath you practice this week is not primarily a recovery tool. It is a declaration. It declares that you are not a slave to your output. It declares that God holds the work while you stop. And it is a small, weekly taste of a rest that is still coming.",
              id: "Dan Allender berargumen bahwa Sabat pada dasarnya adalah tentang kegembiraan eskatologis -- menuha, kata Ibrani untuk istirahat yang membawa dalam dirinya rasa kesenangan, bukan sekadar penghentian. Sabat yang kamu praktikkan minggu ini bukan terutama alat pemulihan. Ini adalah deklarasi. Ia menyatakan bahwa kamu bukan budak dari hasilmu. Ia menyatakan bahwa Tuhan memegang pekerjaan sementara kamu berhenti. Dan ini adalah cicipan kecil dan mingguan dari istirahat yang masih akan datang.",
            },
            {
              en: "The still small voice is not loud. But leaders who stop, and eat, and sleep -- they tend to hear it.",
              id: "Suara yang lembut itu tidak keras. Tapi pemimpin yang berhenti, dan makan, dan tidur -- mereka cenderung mendengarnya.",
            },
          ].map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: FONT,
                fontSize: "clamp(0.9rem, 1.6vw, 1rem)",
                color: "oklch(82% 0.04 260)",
                lineHeight: 1.85,
                marginBottom: i < 3 ? "1.25rem" : 0,
              }}
            >
              {t(p.en, p.id)}
            </p>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          KEY TAKEAWAYS  (lightGray)
      ════════════════════════════════════════════════════════════ */}
      <section style={sec(lightGray)}>
        <div style={inner}>
          <p style={{
            fontFamily: FONT,
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            color: orange,
            fontWeight: 700,
            marginBottom: "2.5rem",
          }}>
            {t("KEY TAKEAWAYS", "POIN UTAMA")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {[
              {
                en: "The recovery paradox is real: the more depleted you are, the harder it is to rest. Sabbath cannot be left to willpower -- it requires structure, accountability, and an honest commitment that is made before the week begins, not in the moment when everything feels urgent.",
                id: "Paradoks pemulihan itu nyata: semakin kamu terkuras, semakin sulit untuk beristirahat. Sabat tidak bisa diserahkan pada kekuatan tekad -- itu membutuhkan struktur, akuntabilitas, dan komitmen jujur yang dibuat sebelum minggu dimulai, bukan pada saat ketika segalanya terasa mendesak.",
              },
              {
                en: "Your Sabbath protects more than you. When leaders model rest, teams gain organizational permission to stop. The research is clear: leader detachment during leisure time predicts team wellbeing more strongly than the quality of the relationship itself. Sustainable leadership is not a private discipline. It shapes the culture around you.",
                id: "Sabatmu melindungi lebih dari sekadar dirimu. Ketika pemimpin memodelkan istirahat, tim mendapat izin organisasi untuk berhenti. Penelitian jelas: pelepasan pemimpin selama waktu luang memprediksi kesejahteraan tim lebih kuat dibanding kualitas hubungan itu sendiri. Kepemimpinan berkelanjutan bukan disiplin pribadi. Ini membentuk budaya di sekitarmu.",
              },
              {
                en: "Sabbath is not a recovery strategy. It is a formation practice. It is how leaders are reminded, week by week, that they are not defined by their output -- and that there is a rest still coming. Elijah was fed once and walked forty days. The provision is always scaled to what the calling requires. Your job is to stop long enough to receive it.",
                id: "Sabat bukan strategi pemulihan. Ini adalah praktik pembentukan. Ini adalah cara pemimpin diingatkan, minggu demi minggu, bahwa mereka tidak didefinisikan oleh hasilnya -- dan bahwa ada istirahat yang masih akan datang. Elia diberi makan sekali dan berjalan empat puluh hari. Provisi selalu diskalakan sesuai dengan apa yang dibutuhkan panggilan. Tugasmu adalah berhenti cukup lama untuk menerimanya.",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: CORMORANT,
                  fontWeight: 600,
                  fontSize: "2rem",
                  color: orange,
                  lineHeight: 1,
                  flexShrink: 0,
                  paddingTop: "0.1rem",
                }}>
                  {i + 1}
                </span>
                <p style={{ ...prose, margin: 0 }}>
                  {t(item.en, item.id)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SOURCES  (lightGray, continued)
      ════════════════════════════════════════════════════════════ */}
      <section style={sec(lightGray, "0")}>
        <div style={{ ...inner, paddingBottom: "3rem" }}>
          <div style={{ borderTop: `1px solid ${lightGray}`, paddingTop: "2rem" }}>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: orange,
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}>
              Sources
            </p>

            {[
              { n: 1, text: "Abdul Aziz, N., & Ong, M. (2024). Burnout prevalence among full-time employees in Southeast Asia. N=4,338 across Malaysia, Singapore, Philippines, and Indonesia." },
              { n: 2, text: "Compass Asia & Shepherd's Staff. Research on field worker attrition and preventable burnout. Finding: 71% of field workers leave for preventable reasons; single most-cited factor was failure to maintain one complete rest day per week." },
              { n: 3, text: "Wendsche, J., & Lohmann-Haislah, A. (2017). A meta-analysis on antecedents and outcomes of detachment from work. Frontiers in Psychology, 7. N=38,124 across 91 samples and 86 studies." },
              { n: 4, text: "Sonnentag, S., & Schiffner, J. (2019). Psychological detachment from work during nonwork time and employee well-being: The role of leader detachment. Journal of Work and Organizational Psychology, 35(1), 1--9." },
              { n: 5, text: "Scazzero, P. (2006). Emotionally Healthy Spirituality. Zondervan. SRDC framework: Stop, Rest, Delight, Contemplate." },
              { n: 6, text: "Brueggemann, W. (2013). Sabbath as Resistance: Saying No to the Culture of Now. Westminster John Knox Press." },
              { n: 7, text: "IMD Business School. Research distinguishing excessive overwork (recoverable with genuine downtime) from compulsive overwork (where guilt during nominal rest prevents true recovery)." },
              { n: 8, text: "Heschel, A. J. (1951). The Sabbath: Its Meaning for Modern Man. Farrar, Straus and Giroux. Concepts of menuha and Sabbath as 'a palace in time.'" },
              { n: 9, text: "De Villiers, P. G. R., & Marchinkowski, T. (2021). Sabbath as a covenantal act in the Old Testament. HTS Theological Studies, 77(4)." },
              { n: 10, text: "Buchanan, M. (2006). The Rest of God: Restoring Your Soul by Restoring Sabbath. Thomas Nelson. Quote: Sabbath imparts 'a time on the calendar and a way we see.'" },
            ].map(({ n, text }) => (
              <div key={n} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: FONT,
                  fontSize: "0.7rem",
                  color: orange,
                  fontWeight: 700,
                  minWidth: "1.25rem",
                  paddingTop: "0.15rem",
                  flexShrink: 0,
                }}>
                  {n}
                </span>
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.75rem",
                  color: "oklch(52% 0.05 260)",
                  margin: 0,
                  lineHeight: 1.65,
                }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SAVE CTA  (lightGray, continued)
      ════════════════════════════════════════════════════════════ */}
      {isLoggedIn && (
        <section style={sec(lightGray, "0")}>
          <div style={{ ...inner, paddingBottom: "4rem", textAlign: "center" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                fontFamily: FONT,
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: saved ? "oklch(55% 0.05 260)" : "white",
                background: saved ? lightGray : orange,
                border: saved ? `1px solid ${lightGray}` : "none",
                borderRadius: "4px",
                padding: "0.875rem 2rem",
                cursor: saved ? "default" : "pointer",
                transition: "opacity 0.2s ease",
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {saved
                ? t("Saved to your dashboard", "Tersimpan di dashboard kamu")
                : isPending
                ? t("Saving...", "Menyimpan...")
                : t("Save this module", "Simpan modul ini")}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
