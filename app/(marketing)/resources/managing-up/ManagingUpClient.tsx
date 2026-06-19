"use client";
import { useState, useTransition, type CSSProperties } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

/* ── Token constants ─────────────────────────────────────────────────────── */
const NAVY       = "oklch(22% 0.10 260)";
const ORANGE     = "oklch(65% 0.15 45)";
const OFF_WHITE  = "oklch(96% 0.005 80)";   // 96%, NOT 97%
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT  = "oklch(38% 0.05 260)";
const NAVY_MID   = "oklch(26% 0.09 260)";
const FONT       = "Montserrat, sans-serif";
const CORMORANT  = "'Cormorant Garamond', serif";

/* ── Lang helper ─────────────────────────────────────────────────────────── */
type Lang = "en" | "id";
const tFn = (en: string, id: string, lang: Lang) => lang === "id" ? id : en;

/* ── Shared style objects ────────────────────────────────────────────────── */
const eyebrow: CSSProperties = {
  fontFamily: FONT, fontSize: 11, fontWeight: 700,
  letterSpacing: "0.14em", textTransform: "uppercase",
  color: ORANGE, marginBottom: 12,
};

const sectionH2Light: CSSProperties = {
  fontFamily: CORMORANT, fontWeight: 600, color: NAVY,
  fontSize: "clamp(26px, 3.5vw, 42px)", lineHeight: 1.12, margin: "0 0 32px",
};

const sectionH2Dark: CSSProperties = {
  ...sectionH2Light, color: OFF_WHITE,
};

const proseLight: CSSProperties = {
  fontFamily: FONT, fontSize: "clamp(15px, 1.6vw, 17px)", color: BODY_TEXT,
  lineHeight: 1.85, marginBottom: 20,
};

/* ── Data arrays ─────────────────────────────────────────────────────────── */

// Section 1: 4 needs
const leaderNeeds = [
  {
    number: "1",
    en_title: "Clarity, not confusion",
    id_title: "Kejelasan, bukan kebingungan",
    en_desc: "Your leader needs to know what you are working on, where things stand, and whether there are decisions sitting with them that they have not noticed yet. Not because they distrust you — because they are carrying more than you can see, and they cannot afford to guess.",
    id_desc: "Pemimpinmu perlu tahu apa yang sedang kamu kerjakan, di mana semuanya berada, dan apakah ada keputusan yang menunggu mereka yang belum mereka sadari. Bukan karena mereka tidak percaya kamu — tapi karena mereka membawa lebih banyak dari yang bisa kamu lihat, dan mereka tidak bisa menebak-nebak.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  {
    number: "2",
    en_title: "Honest intelligence, not flattery",
    id_title: "Kecerdasan yang jujur, bukan sanjungan",
    en_desc: "Your leader needs to be able to predict you. When you say something will be done by Thursday, it is done by Thursday. Your leader should never need to chase you. Reliability builds a specific kind of trust that is hard to rebuild once broken.",
    id_desc: "Pemimpinmu perlu bisa memprediksi kamu. Ketika kamu bilang sesuatu akan selesai Kamis, itu selesai Kamis. Pemimpinmu tidak seharusnya perlu mengejar kamu. Keandalan membangun jenis kepercayaan tertentu yang sulit dibangun ulang begitu rusak.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <polyline points="9 10 11 12 15 8"/>
      </svg>
    ),
  },
  {
    number: "3",
    en_title: "Solutions, not just problems",
    id_title: "Solusi, bukan hanya masalah",
    en_desc: "Your leader needs you to bring problems with suggested solutions, not just problems. Every problem you bring without a suggested path forward adds to a cognitive load that is already high. Show up as a thinking partner, not a problem-reporter.",
    id_desc: "Pemimpinmu perlu kamu membawa masalah dengan solusi yang disarankan, bukan hanya masalahnya saja. Setiap masalah yang kamu bawa tanpa jalur yang disarankan menambah beban kognitif yang sudah tinggi. Hadirlah sebagai mitra berpikir, bukan pelapor masalah.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
      </svg>
    ),
  },
  {
    number: "4",
    en_title: "Reliability and follow-through",
    id_title: "Keandalan dan tindak lanjut",
    en_desc: "Your leader needs to know that your work is moving in the same direction they are trying to take the organisation. When you disagree, say so in the right room, at the right time — then commit to the direction chosen. Alignment is not compliance; it is partnership.",
    id_desc: "Pemimpinmu perlu tahu bahwa pekerjaanmu bergerak ke arah yang sama dengan yang mereka coba bawa organisasi. Ketika kamu tidak setuju, sampaikan di ruang yang tepat, pada waktu yang tepat — lalu berkomitmen pada arah yang dipilih. Keselarasan bukan kepatuhan; itu kemitraan.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
];

// Section 2: 5 principles
const principles = [
  {
    padded: "01",
    en_title: "Know Their World",
    id_title: "Kenali Dunia Mereka",
    en_body: "Senior leaders have limited bandwidth. They are managing multiple channels of information simultaneously, and they do not always have context for what you are about to say. Lead with the conclusion. Tell them what happened, what it means, and what you need, in that order. Then offer detail if they want it. This structure — most important thing first, supporting information after — is what your leader's brain is looking for even if they have never articulated it.",
    id_body: "Pemimpin senior memiliki bandwidth yang terbatas. Mereka mengelola beberapa saluran informasi sekaligus, dan tidak selalu punya konteks untuk apa yang akan kamu katakan. Mulailah dengan kesimpulan. Beritahu mereka apa yang terjadi, apa artinya, dan apa yang kamu butuhkan, dalam urutan itu. Itulah struktur yang dicari otak pemimpinmu bahkan jika mereka belum pernah mengungkapkannya.",
  },
  {
    padded: "02",
    en_title: "Match Medium to Message",
    id_title: "Sesuaikan Media dengan Pesan",
    en_body: "Some leaders want data. Some want narrative. Some need a two-minute verbal briefing; others want a bullet-point email they can read at 6am. Managing up means adapting to your leader's style, not the other way around. This is asymmetric by design: the one who is managing up carries the responsibility for the fit. Pay attention to how your leader communicates with others. What format do their own communications take? These are signals worth reading.",
    id_body: "Sebagian pemimpin butuh data. Sebagian butuh narasi. Sebagian butuh briefing verbal dua menit; yang lain butuh email berpoin-poin yang bisa mereka baca jam 6 pagi. Mengelola ke atas berarti beradaptasi dengan gaya pemimpinmu, bukan sebaliknya. Ini asimetris secara desain: yang mengelola ke atas bertanggung jawab atas kesesuaiannya. Perhatikan cara pemimpinmu berkomunikasi dengan orang lain. Format apa yang digunakan komunikasi mereka kepada kamu? Itu adalah sinyal yang layak dibaca.",
  },
  {
    padded: "03",
    en_title: "Read the Moment",
    id_title: "Baca Situasinya",
    en_body: "Timing matters more than most people realise. The same conversation, on the same topic, with the same content, lands completely differently depending on when it happens. A complex issue raised when your leader is walking between two meetings will receive a fraction of the attention it deserves. Reading your leader's energy and context is a skill. It requires observation. When in doubt, ask: 'Is now a good time?' It is a simple question that signals respect for your leader's attention, and it almost always works.",
    id_body: "Waktu lebih penting dari yang disadari kebanyakan orang. Percakapan yang sama, tentang topik yang sama, dengan konten yang sama, mendarat sangat berbeda tergantung kapan terjadi. Isu kompleks yang diangkat ketika pemimpinmu sedang berjalan di antara dua rapat akan mendapat sebagian kecil perhatian yang layak diterimanya. Membaca energi dan konteks pemimpinmu adalah keterampilan. Ketika ragu, tanya: 'Apakah ini waktu yang tepat?' Pertanyaan sederhana yang memberi sinyal rasa hormat terhadap perhatian pemimpinmu.",
  },
  {
    padded: "04",
    en_title: "Disagree Well",
    id_title: "Tidak Setuju dengan Baik",
    en_body: "Raise concerns in private; once a decision is made, support it publicly. This principle does not suppress honest disagreement — it channels it wisely. A leader who hears your concerns privately and considers them is far more likely to adjust course than one who is ambushed publicly. And a team that sees you publicly support decisions even when you disagreed in private is watching a model of integrity. These two moves together — private honesty, public alignment — are the highest form of upward influence.",
    id_body: "Angkat kekhawatiran secara pribadi; setelah keputusan dibuat, dukung secara publik. Prinsip ini tidak menekan ketidaksetujuan yang jujur, melainkan menyalurkannya dengan bijaksana. Seorang pemimpin yang mendengar kekhawatiranmu secara pribadi jauh lebih mungkin menyesuaikan arah daripada yang diserang di depan umum. Dan tim yang melihat kamu mendukung keputusan secara publik bahkan ketika kamu tidak setuju secara pribadi sedang menyaksikan model integritas.",
  },
  {
    padded: "05",
    en_title: "Protect Their Radar",
    id_title: "Jaga Radar Mereka",
    en_body: "No leader should hear bad news from someone else first. After a conversation, a decision, or a completed task, close the loop. A brief message confirming what was agreed, what you did, and what comes next. Most people forget this step because the task feels complete when it is done. But the loop is not just for your records. It gives your leader certainty, confirms that things are moving, and reduces the number of things they have to track actively. Over time, consistent loop-closing becomes the highest form of reliability.",
    id_body: "Tidak ada pemimpin yang harus mendengar berita buruk dari orang lain lebih dulu. Setelah percakapan, keputusan, atau tugas yang selesai, tutup lingkarannya. Pesan singkat mengkonfirmasi apa yang disepakati, apa yang kamu lakukan, dan apa yang akan datang. Kebanyakan orang melupakan langkah ini karena tugas terasa selesai. Tapi lingkaran bukan hanya untuk catatanmu. Ia memberi pemimpinmu kepastian dan mengurangi jumlah hal yang harus mereka lacak secara aktif.",
  },
];

// Key takeaways
const takeaways = [
  {
    num: "1",
    en_title: "Managing up is a discipline, not a tactic.",
    id_title: "Mengelola ke atas adalah disiplin, bukan taktik.",
    en_body: "It's not about gaming the system or managing impressions. It's about taking honest responsibility for the quality of a relationship that shapes everything you're trying to do.",
    id_body: "Ini bukan tentang memainkan sistem atau mengelola kesan. Ini tentang mengambil tanggung jawab yang jujur atas kualitas hubungan yang membentuk semua yang Anda coba lakukan.",
  },
  {
    num: "2",
    en_title: "Your leader has needs you may not be meeting.",
    id_title: "Pemimpin Anda memiliki kebutuhan yang mungkin tidak Anda penuhi.",
    en_body: "Clarity, honest intelligence, proposed solutions, and reliability — these are not optional extras. They are the foundation of trust upward. Ask yourself which one you're weakest on.",
    id_body: "Kejelasan, kecerdasan yang jujur, solusi yang diusulkan, dan keandalan — ini bukan tambahan opsional. Ini adalah fondasi kepercayaan ke atas. Tanyakan diri Anda mana yang paling lemah pada Anda.",
  },
  {
    num: "3",
    en_title: "Cultural context changes how, not whether.",
    id_title: "Konteks budaya mengubah cara, bukan apakah.",
    en_body: "Across every culture, leaders need people they can trust. What changes is how that trust is communicated, when, in what tone, and through which channels. Adapt the form, not the substance.",
    id_body: "Di setiap budaya, pemimpin membutuhkan orang yang bisa mereka percaya. Yang berubah adalah cara kepercayaan itu dikomunikasikan, kapan, dalam nada apa, dan melalui saluran mana. Sesuaikan bentuknya, bukan substansinya.",
  },
];

// Dig Deeper accordion panels
const digDeeperPanels = [
  {
    en_title: "The Cross-Cultural Dimension of Managing Up",
    id_title: "Dimensi Lintas Budaya dari Mengelola ke Atas",
    en_paras: [
      "Different cultures hold profoundly different assumptions about authority. In high power-distance contexts — common across much of Asia, the Middle East, and parts of Africa and Latin America — approaching a senior leader proactively with bad news or a contrary opinion may feel presumptuous or disrespectful. Silence in these contexts is not agreement; it is often honour.",
      "In lower power-distance contexts — Northern Europe, much of North America — the expectation is often that team members will speak up directly, offer opinions freely, and flag problems early. A leader who has to dig for information from their team sees it as a sign of disengagement or even dishonesty.",
      "Managing up across a cultural gap requires you to understand which cultural frame your leader is operating from — not assume that your own default is universal. The skill is not about eliminating the cultural difference. It is about naming it carefully and finding the version of honesty, clarity, and reliability that actually lands in your specific relationship.",
    ],
    id_paras: [
      "Budaya yang berbeda memiliki asumsi yang sangat berbeda tentang otoritas. Dalam konteks jarak kekuasaan yang tinggi — umum di sebagian besar Asia, Timur Tengah, dan bagian Afrika dan Amerika Latin — mendekati pemimpin senior secara proaktif dengan berita buruk atau pendapat yang berbeda mungkin terasa lancang atau tidak menghormati. Diam dalam konteks ini bukanlah persetujuan; ini sering kali merupakan penghormatan.",
      "Dalam konteks jarak kekuasaan yang lebih rendah — Eropa Utara, sebagian besar Amerika Utara — ekspektasinya sering kali adalah anggota tim akan berbicara langsung, menawarkan pendapat dengan bebas, dan menandai masalah lebih awal. Seorang pemimpin yang harus menggali informasi dari tim mereka melihatnya sebagai tanda ketidakterlibatan atau bahkan ketidakjujuran.",
      "Mengelola ke atas melintasi kesenjangan budaya mengharuskan Anda memahami kerangka budaya mana yang dioperasikan pemimpin Anda — tidak mengasumsikan bahwa default Anda sendiri bersifat universal. Keterampilan ini bukan tentang menghilangkan perbedaan budaya. Ini tentang menamakannya dengan hati-hati dan menemukan versi kejujuran, kejelasan, dan keandalan yang benar-benar mendarat dalam hubungan spesifik Anda.",
    ],
  },
  {
    en_title: "When Your Leader Is Difficult",
    id_title: "Ketika Pemimpin Anda Sulit",
    en_paras: [
      "Managing up assumes a leader worth managing up to. But what happens when your leader is weak, insecure, politically motivated, or simply unkind? The theology of authority does not ask you to pretend these realities do not exist.",
      "There is a difference between managing up and enabling dysfunction. Managing up means taking responsibility for your side of the relationship — being reliable, clear, honest, and proactive — regardless of how your leader behaves. It does not mean absorbing abuse, covering incompetence, or betraying your integrity for the sake of the relationship.",
      "The hardest version of managing up is caring enough about your leader's success to tell them the truth — clearly, privately, respectfully — when they are heading somewhere that will hurt them or the mission. That is not insubordination. That is service.",
    ],
    id_paras: [
      "Mengelola ke atas mengasumsikan pemimpin yang layak dikelola ke atasnya. Tapi apa yang terjadi ketika pemimpin Anda lemah, tidak aman, bermotif politis, atau sekadar tidak baik? Teologi otoritas tidak meminta Anda berpura-pura bahwa kenyataan ini tidak ada.",
      "Ada perbedaan antara mengelola ke atas dan memungkinkan disfungsi. Mengelola ke atas berarti mengambil tanggung jawab untuk sisi Anda dari hubungan — dapat diandalkan, jelas, jujur, dan proaktif — terlepas dari bagaimana pemimpin Anda berperilaku. Itu tidak berarti menyerap pelecehan, menutupi ketidakmampuan, atau mengkhianati integritas Anda demi hubungan.",
      "Versi paling sulit dari mengelola ke atas adalah cukup peduli dengan keberhasilan pemimpin Anda untuk memberi tahu mereka kebenaran — dengan jelas, secara pribadi, dengan hormat — ketika mereka menuju ke suatu tempat yang akan menyakiti mereka atau misi. Itu bukan pembangkangan. Itu adalah pelayanan.",
    ],
  },
  {
    en_title: "Managing Up and Whistleblowing: Where Is the Line?",
    id_title: "Mengelola ke Atas dan Whistleblowing: Di Mana Batasnya?",
    en_paras: [
      "This question comes up in every high-stakes leadership context: when does loyalty to your leader cross into complicity with something wrong? The principle that guides this is not loyalty to the person, but loyalty to the mission and to truth.",
      "Managing up operates in the space of legitimate disagreement, honest feedback, and wise timing. Whistleblowing enters the picture when the issue is no longer a matter of style, judgment, or cultural difference — but genuine ethical failure: deception, abuse of power, financial misconduct, harm to people.",
      "The threshold is not comfort. It is integrity. Most leaders will never face a true whistleblowing situation. But it is worth knowing the line exists — and that faithfulness sometimes requires crossing it, at personal cost, in service of something larger than the relationship.",
    ],
    id_paras: [
      "Pertanyaan ini muncul dalam setiap konteks kepemimpinan yang berisiko tinggi: kapan loyalitas kepada pemimpin Anda menjadi keterlibatan dengan sesuatu yang salah? Prinsip yang memandu ini bukan loyalitas kepada orang tersebut, tetapi loyalitas kepada misi dan kebenaran.",
      "Mengelola ke atas beroperasi dalam ruang ketidaksetujuan yang sah, umpan balik yang jujur, dan penetapan waktu yang bijaksana. Whistleblowing memasuki gambaran ketika masalahnya bukan lagi masalah gaya, penilaian, atau perbedaan budaya — tetapi kegagalan etis yang nyata: penipuan, penyalahgunaan kekuasaan, pelanggaran keuangan, kerugian bagi orang-orang.",
      "Ambang batasnya bukan kenyamanan. Ini adalah integritas. Kebanyakan pemimpin tidak akan pernah menghadapi situasi whistleblowing yang sesungguhnya. Tetapi ada baiknya mengetahui bahwa garis itu ada — dan bahwa kesetiaan kadang-kadang mengharuskan untuk menyeberanginya, dengan biaya pribadi, demi sesuatu yang lebih besar dari hubungan.",
    ],
  },
];

// Sources array
const SOURCES = [
  "John Gabarro and John Kotter, 'Managing Your Boss', Harvard Business Review (1980/2005). The canonical article on managing up — still the clearest framing.",
  "Geert Hofstede, Cultures and Organizations: Software of the Mind (McGraw-Hill). Power distance theory — foundational for cross-cultural authority dynamics.",
  "David Rock, Your Brain at Work (HarperBusiness). SCARF model — relevant to how leaders experience threat/safety in relationships with direct reports.",
  "James 1:19 — 'Everyone should be quick to listen, slow to speak and slow to become angry.' Applied to managing up as a listening discipline.",
  "Romans 13:1 — 'There is no authority except that which God has established.' Theological framing for the authority relationship.",
  "1 Peter 2:13-17 — Submission to authority as a Kingdom witness, not a political compromise.",
  "Patrick Lencioni, The Five Dysfunctions of a Team (Jossey-Bass). Trust as the foundation of all team function — applicable to the leader-direct report relationship.",
];

/* ── Props ───────────────────────────────────────────────────────────────── */
type Props = { userPathway: string | null; isSaved: boolean };

/* ── Main component ──────────────────────────────────────────────────────── */
export default function ManagingUpClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openPanel, setOpenPanel] = useState<number | null>(null);
  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("managing-up");
      setSaved(true);
    });
  }

  return (
    <div style={{ fontFamily: FONT, background: OFF_WHITE, minHeight: "100vh" }}>

      {/* ── Style tag for responsive grid ── */}
      <style>{`
        @media (max-width: 640px) { .mu-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── 1. LangToggle — FIRST element ── */}
      <LangToggle />

      {/* ══════════════════════════════════════════════════════════════
          2. HERO
      ══════════════════════════════════════════════════════════════ */}
      <div style={{
        background: NAVY,
        padding: "clamp(64px, 10vw, 96px) 24px clamp(56px, 8vw, 80px)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Hero image — luminosity overlay */}
        <img
          src="/images/resources/managing-up/header.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            opacity: 0.18, mixBlendMode: "luminosity", pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: FONT, fontSize: 12, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: ORANGE, marginBottom: 16, margin: "0 0 16px",
          }}>
            {t("Leadership — Guide", "Kepemimpinan — Panduan")}
          </p>

          {/* H1 */}
          <h1 style={{
            fontFamily: CORMORANT, fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 600, color: OFF_WHITE, lineHeight: 1.08, margin: "0 0 24px",
          }}>
            {t("Managing Up", "Mengelola ke Atas")}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: CORMORANT, fontStyle: "italic",
            fontSize: "clamp(17px, 2.2vw, 22px)", color: "oklch(82% 0.03 260)",
            lineHeight: 1.65, maxWidth: 580, margin: "0 0 40px",
          }}>
            {t(
              "How you lead your leader is as important as how you lead your team.",
              "Cara Anda memimpin pemimpin Anda sama pentingnya dengan cara Anda memimpin tim Anda.",
            )}
          </p>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            aria-label={saved
              ? t("Saved to your dashboard", "Tersimpan di dashboard Anda")
              : t("Save this resource to your dashboard", "Simpan sumber daya ini ke dashboard Anda")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              minHeight: 44, padding: "14px 28px", borderRadius: 12,
              border: "1px solid oklch(42% 0.08 260)",
              background: saved ? "oklch(35% 0.08 260)" : "transparent",
              color: saved ? OFF_WHITE : "oklch(75% 0.04 260)",
              fontFamily: FONT, fontSize: 14, fontWeight: 600,
              cursor: saved ? "default" : "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {/* Bookmark SVG */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? OFF_WHITE : "none"}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            {saved
              ? t("Saved to Dashboard", "Tersimpan di Dashboard")
              : t("Save to Dashboard", "Simpan ke Dashboard")}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. INTRODUCTION
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={sectionH2Light}>
            {t("What Managing Up Actually Means", "Apa yang Sebenarnya Dimaksud dengan Mengelola ke Atas")}
          </h2>
          <p style={proseLight}>
            {t(
              "You know someone like this. A capable, hard-working leader who keeps producing good results but can never seem to get traction with the person above them. Projects stall waiting for approval. Their ideas land flat. They feel invisible, or worse, misunderstood. The problem is rarely competence. It is almost always a relationship that hasn't been tended.",
              "Kamu pasti kenal seseorang seperti ini. Pemimpin yang cakap, pekerja keras, terus menghasilkan hasil yang baik, tapi entah kenapa tidak pernah bisa dapat traksi dari orang di atasnya. Proyek-proyek macet menunggu persetujuan. Ide-idenya tidak mendarat. Mereka merasa tidak terlihat, atau lebih buruk lagi, disalahpahami. Masalahnya hampir tidak pernah soal kompetensi. Hampir selalu soal hubungan yang tidak pernah dirawat.",
            )}
          </p>
          <p style={{ ...proseLight, marginBottom: 0 }}>
            {t(
              "Managing up is not a political game. It is not flattery or self-promotion. It is the practice of leading intentionally in the upward direction: understanding what your leader needs, communicating in ways that work for them, and building the kind of trust that creates room for you to lead well. This module covers the core needs your leader has from you, and five principles for communicating upward that actually work across cultural contexts.",
              "Mengelola ke atas bukan permainan politik. Bukan pula sanjungan atau promosi diri. Ini adalah praktik memimpin secara sengaja ke arah atas: memahami apa yang dibutuhkan pemimpin kamu, berkomunikasi dengan cara yang tepat bagi mereka, dan membangun kepercayaan yang memberi ruang untuk kamu memimpin dengan baik. Modul ini membahas kebutuhan inti pemimpin kamu dari kamu, dan lima prinsip berkomunikasi ke atas yang benar-benar berhasil lintas konteks budaya.",
            )}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. LEARNING OUTCOMES
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: LIGHT_GRAY, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Learning Outcomes", "Tujuan Pembelajaran")}</p>
          <h2 style={sectionH2Light}>
            {t("By the end of this module:", "Setelah menyelesaikan modul ini:")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, marginTop: 9, flexShrink: 0 }} />
              <p style={{ fontFamily: FONT, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                <strong style={{ fontFamily: FONT, color: NAVY }}>
                  {t("Understand", "Memahami")}
                </strong>
                {t(
                  " what your leader genuinely needs from you, beyond the task list — and why meeting those needs is the fastest path to influence.",
                  " apa yang benar-benar dibutuhkan pemimpin Anda dari Anda, di luar daftar tugas — dan mengapa memenuhi kebutuhan tersebut adalah jalur tercepat menuju pengaruh.",
                )}
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, marginTop: 9, flexShrink: 0 }} />
              <p style={{ fontFamily: FONT, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                <strong style={{ fontFamily: FONT, color: NAVY }}>
                  {t("Apply", "Menerapkan")}
                </strong>
                {t(
                  " five proven principles for communicating upward — with honesty, timing, and cultural intelligence.",
                  " lima prinsip yang terbukti untuk berkomunikasi ke atas — dengan kejujuran, ketepatan waktu, dan kecerdasan budaya.",
                )}
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, marginTop: 9, flexShrink: 0 }} />
              <p style={{ fontFamily: FONT, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                <strong style={{ fontFamily: FONT, color: NAVY }}>
                  {t("Develop", "Mengembangkan")}
                </strong>
                {t(
                  " a personal practice of managing up that serves your leader, the mission, and your own integrity.",
                  " praktik pribadi mengelola ke atas yang melayani pemimpin, misi, dan integritas Anda sendiri.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. SECTION 1: 4 THINGS YOUR LEADER NEEDS (Icon card grid)
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow}>{t("The Foundation", "Fondasi")}</p>
          <h2 style={sectionH2Light}>
            {t("4 Things Your Leader Needs from You", "4 Hal yang Dibutuhkan Pemimpin Anda dari Anda")}
          </h2>
          <p style={proseLight}>
            {t(
              "Influence flows to those who make their leader's job easier. Before thinking about communication tactics or career moves, master these four fundamentals.",
              "Pengaruh mengalir kepada mereka yang membuat pekerjaan pemimpin mereka lebih mudah. Sebelum memikirkan taktik komunikasi atau langkah karier, kuasai empat hal mendasar ini.",
            )}
          </p>

          <div
            className="mu-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
              marginTop: 40,
            }}
          >
            {leaderNeeds.map((need) => (
              <div
                key={need.number}
                style={{
                  background: OFF_WHITE,
                  border: "1px solid oklch(22% 0.10 260 / 0.18)",
                  borderRadius: 12,
                  padding: "28px 28px",
                  display: "flex", flexDirection: "column", gap: 16,
                }}
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "oklch(65% 0.15 45 / 0.10)",
                  borderRadius: 8, padding: 10,
                  width: 52, height: 52, flexShrink: 0,
                  color: ORANGE,
                }}>
                  {need.icon}
                </div>

                <h3 style={{
                  fontFamily: FONT, fontSize: 16, fontWeight: 800,
                  color: NAVY, margin: 0,
                }}>
                  {lang === "id" ? need.id_title : need.en_title}
                </h3>

                <p style={{
                  fontFamily: FONT, fontSize: 14, color: BODY_TEXT,
                  lineHeight: 1.75, margin: 0,
                }}>
                  {lang === "id" ? need.id_desc : need.en_desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          6. SECTION 2: 5 PRINCIPLES FOR COMMUNICATING UPWARD
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: LIGHT_GRAY, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow}>{t("The Practice", "Praktik")}</p>
          <h2 style={sectionH2Light}>
            {t("5 Principles for Communicating Upward", "5 Prinsip untuk Berkomunikasi ke Atas")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {principles.map((p, idx) => (
              <div key={p.padded}>
                <div style={{ display: "flex", gap: 28, alignItems: "flex-start", paddingBottom: 32 }}>
                  <span style={{
                    fontFamily: CORMORANT,
                    fontSize: "clamp(44px, 6vw, 64px)",
                    fontWeight: 600,
                    color: ORANGE,
                    lineHeight: 1,
                    minWidth: 48,
                    flexShrink: 0,
                    userSelect: "none",
                  }}>
                    {p.padded}
                  </span>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: FONT, fontSize: 16, fontWeight: 700,
                      color: NAVY, marginBottom: 8, marginTop: 10,
                    }}>
                      {lang === "id" ? p.id_title : p.en_title}
                    </h3>
                    <p style={{ ...proseLight, marginBottom: 0 }}>
                      {lang === "id" ? p.id_body : p.en_body}
                    </p>
                  </div>
                </div>

                {idx < principles.length - 1 && (
                  <hr style={{
                    border: "none",
                    borderTop: "1px solid oklch(22% 0.10 260 / 0.12)",
                    margin: "0 0 32px",
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          7. FAITH ANCHOR (OFF_WHITE, not navy)
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("FAITH ANCHOR", "JANGKAR IMAN")}</p>
          <h2 style={{
            fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600,
            fontSize: "clamp(26px, 3.5vw, 44px)", color: NAVY,
            lineHeight: 1.12, margin: "0 0 36px",
          }}>
            {t("Authority Is a Gift, Not a Threat", "Otoritas Adalah Anugerah, Bukan Ancaman")}
          </h2>

          <div style={{
            background: "oklch(97% 0.010 50)",
            border: "1px solid oklch(88% 0.030 50)",
            borderRadius: 8, padding: "1.25rem 1.5rem", margin: "0 0 28px",
          }}>
            <p style={{
              fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600,
              fontSize: "clamp(16px, 2vw, 20px)", color: NAVY,
              lineHeight: 1.65, margin: 0,
            }}>
              {t(
                "Romans 13:1 — 'Let everyone be subject to the governing authorities, for there is no authority except that which God has established.'",
                "Roma 13:1 — 'Setiap orang harus tunduk kepada pemerintah yang di atasnya, sebab tidak ada pemerintah yang tidak berasal dari Allah.'",
              )}
            </p>
          </div>

          <p style={proseLight}>
            {t(
              "Scripture does not treat authority as a necessary evil. It treats it as a gift — a structure God placed in creation not to constrain human flourishing, but to enable it. Romans 13 and 1 Peter 2 are not calls to passive submission to corrupt systems. They are calls to recognize that God works through human authority structures, however imperfect.",
              "Alkitab tidak memperlakukan otoritas sebagai kejahatan yang diperlukan. Alkitab memperlakukannya sebagai anugerah — struktur yang Allah tempatkan dalam ciptaan bukan untuk membatasi kemakmuran manusia, tetapi untuk memungkinkannya. Roma 13 dan 1 Petrus 2 bukan seruan untuk tunduk secara pasif pada sistem yang korup. Ini adalah seruan untuk mengenali bahwa Allah bekerja melalui struktur otoritas manusiawi, betapapun tidak sempurnanya.",
            )}
          </p>
          <p style={proseLight}>
            {t(
              "This reframes managing up entirely. If your leader is part of the authority structure God has placed in your life — even a flawed one — then serving them well is not a political strategy. It is a spiritual discipline. The question is not how much you can extract from this relationship, but how faithfully you can serve within it.",
              "Ini sepenuhnya mengubah bingkai mengelola ke atas. Jika pemimpin Anda adalah bagian dari struktur otoritas yang Allah tempatkan dalam hidup Anda — bahkan yang tidak sempurna — maka melayani mereka dengan baik bukanlah strategi politik. Ini adalah disiplin rohani. Pertanyaannya bukan seberapa banyak yang dapat Anda ekstrak dari hubungan ini, tetapi seberapa setia Anda dapat melayani di dalamnya.",
            )}
          </p>
          <p style={{ ...proseLight, marginBottom: 28 }}>
            {t(
              "Jesus, the ultimate example of managing up, submitted to human authority while never compromising his integrity. He paid taxes (Matthew 17:27). He respected Pilate's office even while refusing to be defined by his verdict (John 19:11). He operated within the structures of his day while embodying a different Kingdom entirely. Managing up, done with honesty and integrity, is not a betrayal of your own authority. It is the exercise of it.",
              "Yesus, contoh utama mengelola ke atas, tunduk pada otoritas manusiawi sambil tidak pernah mengkompromikan integritasnya. Dia membayar pajak (Matius 17:27). Dia menghormati jabatan Pilatus bahkan sambil menolak untuk didefinisikan oleh putusannya (Yohanes 19:11). Dia beroperasi dalam struktur zamannya sambil mewujudkan Kerajaan yang sama sekali berbeda. Mengelola ke atas, dilakukan dengan kejujuran dan integritas, bukan pengkhianatan terhadap otoritas Anda sendiri. Ini adalah pelaksanaannya.",
            )}
          </p>

          <div style={{
            background: "oklch(97% 0.010 50)",
            border: "1px solid oklch(88% 0.030 50)",
            borderRadius: 8, padding: "1.25rem 1.5rem",
          }}>
            <p style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: ORANGE, marginBottom: 8, margin: "0 0 8px",
            }}>
              {t("REFLECTION", "REFLEKSI")}
            </p>
            <p style={{
              fontFamily: FONT, fontSize: "clamp(15px, 1.6vw, 17px)", color: BODY_TEXT,
              lineHeight: 1.85, margin: 0,
            }}>
              {t(
                "Who is the authority over you right now that is most difficult to honour? What would faithfulness look like in practice?",
                "Siapa otoritas di atas Anda saat ini yang paling sulit untuk dihormati? Apa yang akan terlihat dari kesetiaan dalam praktik?",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          8. KEY TAKEAWAYS
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: LIGHT_GRAY, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Key Takeaways", "Poin Utama")}</p>
          <h2 style={sectionH2Light}>
            {t("Three things worth holding from this module:", "Tiga hal yang layak dibawa dari modul ini:")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {takeaways.map((tk) => (
              <div
                key={tk.num}
                style={{
                  background: OFF_WHITE, borderRadius: 12, padding: "28px 32px",
                  display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap",
                }}
              >
                <span style={{
                  fontFamily: CORMORANT, fontSize: 52, fontWeight: 700,
                  color: ORANGE, lineHeight: 1, minWidth: 36, flexShrink: 0,
                }}>
                  {tk.num}
                </span>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{
                    fontFamily: FONT, fontSize: 16, fontWeight: 800,
                    color: NAVY, marginTop: 0, marginBottom: 8,
                  }}>
                    {lang === "id" ? tk.id_title : tk.en_title}
                  </h3>
                  <p style={{
                    fontFamily: FONT, fontSize: 15, color: BODY_TEXT,
                    lineHeight: 1.75, margin: 0,
                  }}>
                    {lang === "id" ? tk.id_body : tk.en_body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          9. DIG DEEPER (3 accordions, grid-template-rows transition)
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Dig Deeper", "Pelajari Lebih Lanjut")}</p>
          <h2 style={sectionH2Light}>
            {t("For those who want to go further", "Untuk mereka yang ingin melangkah lebih jauh")}
          </h2>

          <div style={{ marginTop: 32 }}>
            {digDeeperPanels.map((panel, i) => {
              const isOpen = openPanel === i;
              return (
                <div
                  key={i}
                  style={{
                    border: "1px solid oklch(22% 0.10 260 / 0.14)",
                    borderRadius: 10,
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  <button
                    onClick={() => setOpenPanel(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`dig-deeper-panel-${i}`}
                    style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%", padding: "20px 24px",
                      background: OFF_WHITE, border: "none",
                      cursor: "pointer", textAlign: "left",
                      minHeight: 44,
                      fontFamily: FONT, fontSize: 15, fontWeight: 700, color: NAVY,
                    }}
                  >
                    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: NAVY }}>
                      {lang === "id" ? panel.id_title : panel.en_title}
                    </span>
                    {/* CSS chevron */}
                    <span style={{
                      display: "inline-block", width: 9, height: 9,
                      borderRight: `2px solid ${NAVY}`,
                      borderBottom: `2px solid ${NAVY}`,
                      transform: isOpen ? "rotate(-135deg)" : "rotate(45deg)",
                      transition: "transform 0.25s ease",
                      flexShrink: 0,
                      marginLeft: 8,
                      marginTop: isOpen ? 4 : 0,
                    }} />
                  </button>

                  <div
                    id={`dig-deeper-panel-${i}`}
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.3s ease",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ minHeight: 0 }}>
                      <div style={{
                        padding: "0 24px 24px",
                        borderTop: "1px solid oklch(22% 0.10 260 / 0.10)",
                      }}>
                        {(lang === "id" ? panel.id_paras : panel.en_paras).map((para, pi) => (
                          <p key={pi} style={{
                            fontFamily: FONT,
                            fontSize: "clamp(15px, 1.6vw, 17px)",
                            color: BODY_TEXT, lineHeight: 1.85,
                            marginBottom: pi < panel.en_paras.length - 1 ? 16 : 0,
                            marginTop: pi === 0 ? 20 : 0,
                          }}>
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          10. SOURCES (SourcesDropdown — LIGHT_GRAY bg via prop)
      ══════════════════════════════════════════════════════════════ */}
      <SourcesDropdown
        sources={SOURCES}
        lang={lang}
        markerStyle="number"
        background={LIGHT_GRAY}
      />

      {/* ══════════════════════════════════════════════════════════════
          11. FROM THE FIELD (always last — navy bg)
      ══════════════════════════════════════════════════════════════ */}
      <div style={{
        background: NAVY,
        padding: "clamp(4rem, 7vw, 7rem) 24px",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ ...eyebrow, color: ORANGE }}>
            {t("FROM THE FIELD", "DARI LAPANGAN")}
          </p>
          <h2 style={sectionH2Dark}>
            {t("What leaders are saying", "Apa kata para pemimpin")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <blockquote style={{
              margin: 0,
              background: NAVY_MID,
              borderRadius: 8,
              padding: "1.75rem 2rem",
              borderTop: `2px solid ${ORANGE}`,
            }}>
              <p style={{
                fontFamily: CORMORANT, fontStyle: "italic",
                color: OFF_WHITE,
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                lineHeight: 1.65, margin: "0 0 1rem",
              }}>
                {t(
                  "\"I spent three years thinking my leader just didn't see my potential. When I finally started actually managing up — giving him clarity, flagging problems early, coming with solutions — everything changed within four months.\"",
                  "\"Saya menghabiskan tiga tahun berpikir pemimpin saya tidak melihat potensi saya. Ketika saya akhirnya benar-benar mulai mengelola ke atas — memberinya kejelasan, menandai masalah lebih awal, datang dengan solusi — semuanya berubah dalam empat bulan.\"",
                )}
              </p>
              <cite style={{
                fontFamily: FONT, fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.1em", color: ORANGE, fontStyle: "normal",
                display: "block",
              }}>
                {t("Team leader, International NGO, Southeast Asia", "Pemimpin tim, LSM Internasional, Asia Tenggara")}
              </cite>
            </blockquote>

            <blockquote style={{
              margin: 0,
              background: NAVY_MID,
              borderRadius: 8,
              padding: "1.75rem 2rem",
              borderTop: `2px solid ${ORANGE}`,
            }}>
              <p style={{
                fontFamily: CORMORANT, fontStyle: "italic",
                color: OFF_WHITE,
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                lineHeight: 1.65, margin: "0 0 1rem",
              }}>
                {t(
                  "\"In my culture, you don't question authority. But my Western leader expected me to speak up. Learning that 'managing up' could mean speaking honestly — not disrespectfully — was genuinely freeing.\"",
                  "\"Dalam budaya saya, Anda tidak mempertanyakan otoritas. Tetapi pemimpin Barat saya mengharapkan saya untuk berbicara. Belajar bahwa 'mengelola ke atas' bisa berarti berbicara jujur — tidak tidak menghormati — sungguh membebaskan.\"",
                )}
              </p>
              <cite style={{
                fontFamily: FONT, fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.1em", color: ORANGE, fontStyle: "normal",
                display: "block",
              }}>
                {t("Programme manager, Faith-based organisation, East Africa", "Manajer program, Organisasi berbasis iman, Afrika Timur")}
              </cite>
            </blockquote>
          </div>
        </div>
      </div>

    </div>
  );
}
