"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const navy = "oklch(22% 0.10 260)";
const offWhite = "oklch(96% 0.005 80)";
const orange = "oklch(65% 0.15 45)";
const bodyText = "oklch(38% 0.05 260)";
const lightGray = "oklch(88% 0.008 80)";
const muted = "oklch(48% 0.04 260)";
const calloutBg = "oklch(97% 0.010 50)";
const calloutBorder = "oklch(88% 0.030 50)";
const white = "oklch(99.5% 0.002 80)";

const SLUG = "model-assist-watch-launch";

const Sup = ({ n }: { n: string }) => (
  <span style={{ color: orange, fontWeight: 700 }}>{n}</span>
);

// ─── Phase data ───────────────────────────────────────────────────────────────
type PhaseKey = "model" | "assist" | "watch" | "launch";
const PHASE_KEYS: PhaseKey[] = ["model", "assist", "watch", "launch"];

type Phase = {
  key: PhaseKey;
  en: string; id: string;
  shortEn: string; shortId: string;
  bodyEn: string; bodyId: string;
  whoEn: string; whoId: string;
  roleEn: string; roleId: string;
  longEn: string; longId: string;
  riskEn: string; riskId: string;
  storyEn: string; storyId: string;
  bubbleEn?: string; bubbleId?: string;
  img: { w: number; h: number; altEn: string; altId: string };
  involvement: number; ownership: number;
};

const PHASES: Record<PhaseKey, Phase> = {
  model: {
    key: "model", en: "Model", id: "Teladani",
    shortEn: "You do it. They watch.",
    shortId: "Anda melakukannya. Mereka mengamati.",
    bodyEn: "Do the task in front of them, then explain what you did and why. Let them see the real thing, including the parts that go wrong. Once or twice is often enough. The aim is a clear picture in their head of what good looks like.",
    bodyId: "Lakukan tugas itu di depan mereka, lalu jelaskan apa yang Anda lakukan dan mengapa. Biarkan mereka melihat kenyataannya, termasuk bagian yang tidak berjalan mulus. Sekali atau dua kali sering kali sudah cukup. Tujuannya adalah gambaran yang jelas di kepala mereka tentang seperti apa pekerjaan yang baik.",
    whoEn: "You", whoId: "Anda",
    roleEn: "Doer and narrator", roleId: "Pelaku sekaligus pencerita",
    longEn: "Short. A few times.", longId: "Singkat. Beberapa kali saja.",
    riskEn: "Staying here. Endless demonstrations feel safe for you and teach them to watch instead of act.",
    riskId: "Terlalu lama di sini. Demonstrasi tanpa akhir terasa aman bagi Anda, tetapi mengajar mereka untuk menonton, bukan bertindak.",
    storyEn: "Before you ride anywhere, you put your helmet on. They see that before they hear a single instruction, and it is the first thing you model. Then they stand and watch how you ride: sitting up straight, hands steady, eyes on the road.",
    storyId: "Sebelum berkendara ke mana pun, Anda memakai helm. Mereka melihatnya bahkan sebelum mendengar satu instruksi pun, dan itulah hal pertama yang Anda teladankan. Lalu mereka berdiri dan mengamati cara Anda berkendara: duduk tegak, tangan mantap, mata ke jalan.",
    img: { w: 752, h: 564, altEn: "A learner stands and watches the leader, in blue, ride a scooter. A light bulb above the learner's head.", altId: "Seorang pelajar berdiri dan mengamati pemimpin, berwarna biru, mengendarai skuter. Ada bola lampu di atas kepala pelajar." },
    involvement: 95, ownership: 10,
  },
  assist: {
    key: "assist", en: "Assist", id: "Bantu",
    shortEn: "They do it. You stand right beside them.",
    shortId: "Mereka melakukannya. Anda berdiri tepat di samping mereka.",
    bodyEn: "Hand over the task while you stay close. Coach in the moment, give clear instructions and expect them to fall. When a step is not working, show it again and hand it straight back. Going back and forth between Model and Assist is normal. It is not a failure.",
    bodyId: "Serahkan tugas itu sementara Anda tetap dekat. Bimbing saat itu juga, beri instruksi yang jelas, dan terimalah bahwa mereka akan jatuh. Ketika satu langkah tidak berhasil, contohkan lagi lalu segera serahkan kembali. Bolak-balik antara Teladani dan Bantu itu wajar. Itu bukan kegagalan.",
    whoEn: "They do, you help", whoId: "Mereka, dengan bantuan Anda",
    roleEn: "Coach at their elbow", roleId: "Pelatih di samping mereka",
    longEn: "Weeks, sometimes months", longId: "Beberapa minggu, kadang berbulan-bulan",
    riskEn: "Taking the task back after the first fall, or never taking your hand off the handlebar.",
    riskId: "Mengambil kembali tugas itu setelah jatuh pertama, atau tidak pernah melepaskan tangan dari setang.",
    storyEn: "Now they sit on the scooter and you walk right beside them, one hand on their back. You tell them to try first. They wobble, you steady them, and they try again.",
    storyId: "Sekarang mereka yang duduk di skuter dan Anda berjalan tepat di samping mereka, satu tangan di punggung mereka. Anda meminta mereka mencoba lebih dulu. Mereka oleng, Anda menahan, lalu mereka mencoba lagi.",
    bubbleEn: "Try first.", bubbleId: "Coba dulu.",
    img: { w: 602, h: 452, altEn: "The leader, in blue, walks beside the learner on a scooter with a hand on their back.", altId: "Pemimpin, berwarna biru, berjalan di samping pelajar di atas skuter dengan satu tangan di punggungnya." },
    involvement: 70, ownership: 40,
  },
  watch: {
    key: "watch", en: "Watch", id: "Amati",
    shortEn: "They lead. You check in from a distance.",
    shortId: "Mereka memimpin. Anda memantau dari kejauhan.",
    bodyEn: "Step back and let them run it without you in the room. Visit, call, ask good questions, send someone else to encourage them. Check the whole skill set, not only the part they already do well. This is the longest phase, and most of the real growth happens here.",
    bodyId: "Mundurlah dan biarkan mereka menjalankannya tanpa Anda di ruangan. Kunjungi, telepon, ajukan pertanyaan yang baik, utus orang lain untuk menguatkan mereka. Periksa seluruh rangkaian keterampilan, bukan hanya bagian yang sudah mereka kuasai. Inilah tahap terpanjang, dan sebagian besar pertumbuhan yang sesungguhnya terjadi di sini.",
    whoEn: "They do, you observe", whoId: "Mereka, Anda mengamati",
    roleEn: "Encourager and checker", roleId: "Penyemangat dan pemeriksa",
    longEn: "Months to years", longId: "Berbulan-bulan hingga bertahun-tahun",
    riskEn: "Never leaving, or launching before every skill on the list has been checked.",
    riskId: "Tidak pernah pergi, atau melepas mereka sebelum setiap keterampilan dalam daftar diperiksa.",
    storyEn: "They ride off on their own. You stand at the side of the road with your arms folded and call out the one thing that matters most. The rest they work out on the road.",
    storyId: "Mereka melaju sendiri. Anda berdiri di pinggir jalan dengan tangan terlipat dan meneriakkan satu hal yang paling penting. Sisanya mereka pelajari sendiri di jalan.",
    bubbleEn: "Don't hit other motorbikes on the road!", bubbleId: "Jangan menabrak motor lain di jalan!",
    img: { w: 624, h: 468, altEn: "The leader, in blue, stands with arms folded as the learner rides past on a scooter.", altId: "Pemimpin, berwarna biru, berdiri dengan tangan terlipat saat pelajar melaju melewatinya di atas skuter." },
    involvement: 35, ownership: 75,
  },
  launch: {
    key: "launch", en: "Launch", id: "Mandirikan",
    shortEn: "It is theirs. You become a friend.",
    shortId: "Ini milik mereka. Anda menjadi sahabat.",
    bodyEn: "Hand over the role for real. Say it out loud, in front of others if you can. Problems will come, and that is fine. Stay in touch as a friend and pray for them, but do not take the decisions back. Now they start their own cycle with someone new.",
    bodyId: "Serahkan peran itu dengan sungguh-sungguh. Katakan dengan jelas, di depan orang lain jika memungkinkan. Masalah akan datang, dan itu tidak apa-apa. Tetaplah berhubungan sebagai sahabat dan doakan mereka, tetapi jangan mengambil kembali keputusan-keputusannya. Sekarang mereka memulai siklus mereka sendiri dengan orang baru.",
    whoEn: "They do, on their own", whoId: "Mereka, secara mandiri",
    roleEn: "Friend who prays", roleId: "Sahabat yang mendoakan",
    longEn: "Open-ended", longId: "Tanpa batas waktu",
    riskEn: "Hovering because being needed feels good.",
    riskId: "Terus membayangi karena dibutuhkan itu terasa menyenangkan.",
    storyEn: "They learned on a small scooter. They leave on a much bigger motorbike, heading for roads you have never ridden. You fade to an outline and wave them off.",
    storyId: "Mereka belajar dengan skuter kecil. Mereka pergi dengan sepeda motor yang jauh lebih besar, menuju jalan-jalan yang belum pernah Anda lalui. Anda memudar menjadi garis samar dan melambaikan tangan.",
    img: { w: 656, h: 492, altEn: "The learner rides away on a big motorbike while the leader, now a dashed outline, waves goodbye.", altId: "Pelajar melaju dengan sepeda motor besar sementara pemimpin, kini hanya garis putus-putus, melambaikan tangan." },
    involvement: 5, ownership: 100,
  },
};

const phaseName = (k: PhaseKey, lang: Lang) => t(PHASES[k].en, PHASES[k].id, lang);

// ─── Theory: the method behind each phase ─────────────────────────────────────
type L = { en: string; id: string };
type Theory = {
  key: PhaseKey;
  motto: L;
  what: L;
  why: L; whySup: string;
  elements: L[];
  nextLabel: L;
  next: L;
  scripture: L;
};

const THEORY: Theory[] = [
  {
    key: "model",
    motto: { en: "I do, you watch", id: "Saya melakukan, Anda mengamati" },
    what: {
      en: "You do the real task while they are with you. Afterwards you explain what you did, why you did it and what you were thinking at each step.",
      id: "Anda mengerjakan tugas yang sesungguhnya sementara mereka bersama Anda. Sesudahnya Anda menjelaskan apa yang Anda lakukan, mengapa, dan apa yang Anda pikirkan di setiap langkah.",
    },
    why: {
      en: "People copy what they see far more than what they are told. Much of a skill is also hidden inside your head: what you noticed, the options you rejected, the moment you decided. If you never say it out loud, they only see the result and miss the thinking.",
      id: "Orang jauh lebih banyak meniru apa yang mereka lihat daripada apa yang dikatakan kepada mereka. Sebagian besar keterampilan juga tersembunyi di dalam kepala Anda: apa yang Anda perhatikan, pilihan yang Anda tolak, saat Anda memutuskan. Jika Anda tidak pernah mengucapkannya, mereka hanya melihat hasilnya dan kehilangan cara berpikirnya.",
    },
    whySup: "⁵",
    elements: [
      { en: "Real situations, not a staged demonstration", id: "Situasi nyata, bukan peragaan yang diatur" },
      { en: "Think out loud: name what you notice and why you choose", id: "Berpikir dengan suara keras: sebutkan apa yang Anda perhatikan dan mengapa Anda memilih" },
      { en: "Let them see your mistakes and how you recover", id: "Biarkan mereka melihat kesalahan Anda dan cara Anda memperbaikinya" },
      { en: "Keep it short. A few times is usually enough", id: "Buatlah singkat. Beberapa kali biasanya sudah cukup" },
    ],
    nextLabel: { en: "Move on when", id: "Lanjut ketika" },
    next: {
      en: "They can describe what good looks like and they are asking to try.",
      id: "Mereka bisa menjelaskan seperti apa pekerjaan yang baik dan mereka ingin mencoba.",
    },
    scripture: {
      en: "Jesus first called the twelve \"that they might be with him\" (Mark 3:14). They watched him teach, heal and pray long before he sent them anywhere.",
      id: "Yesus pertama-tama memanggil kedua belas murid \"untuk menyertai Dia\" (Markus 3:14). Mereka melihat Dia mengajar, menyembuhkan, dan berdoa jauh sebelum Ia mengutus mereka ke mana pun.",
    },
  },
  {
    key: "assist",
    motto: { en: "You do, I help", id: "Anda melakukan, saya membantu" },
    what: {
      en: "They do the task and you stay close enough to help in the moment. You give clear instructions, step in when needed and then hand it straight back.",
      id: "Mereka mengerjakan tugas itu dan Anda tetap cukup dekat untuk membantu saat itu juga. Anda memberi instruksi yang jelas, turun tangan bila perlu, lalu segera menyerahkannya kembali.",
    },
    why: {
      en: "Watching builds understanding, but only doing builds skill. The first attempts are where most people lose heart, so this is where support matters most. Learning research calls this scaffolding: help that lets someone do what they cannot yet do alone.",
      id: "Mengamati membangun pemahaman, tetapi hanya melakukan yang membangun keterampilan. Percobaan-percobaan pertama adalah saat kebanyakan orang patah semangat, jadi di sinilah dukungan paling dibutuhkan. Penelitian pembelajaran menyebutnya scaffolding (perancah): bantuan yang memungkinkan seseorang melakukan apa yang belum bisa ia lakukan sendiri.",
    },
    whySup: "³ ⁴",
    elements: [
      { en: "Give real work, not practice tasks", id: "Berikan pekerjaan nyata, bukan tugas latihan" },
      { en: "Coach during the task and talk it through straight after", id: "Bimbing selama tugas berlangsung dan bahas bersama segera sesudahnya" },
      { en: "Expect falls. If a step fails, show it again, then hand it back", id: "Terimalah bahwa mereka akan jatuh. Jika satu langkah gagal, contohkan lagi, lalu serahkan kembali" },
      { en: "Name the progress you see, as specifically as you can", id: "Sebutkan kemajuan yang Anda lihat, sespesifik mungkin" },
    ],
    nextLabel: { en: "Move on when", id: "Lanjut ketika" },
    next: {
      en: "They can do the whole task from start to finish without you stepping in, even if it is not polished yet.",
      id: "Mereka bisa mengerjakan seluruh tugas dari awal sampai akhir tanpa Anda turun tangan, meskipun belum sempurna.",
    },
    scripture: {
      en: "Jesus sent the twelve out two by two with clear instructions. When they came back, he took them aside to hear what had happened (Luke 9:1-10).",
      id: "Yesus mengutus kedua belas murid berdua-dua dengan instruksi yang jelas. Ketika mereka kembali, Ia membawa mereka menyendiri untuk mendengar apa yang telah terjadi (Lukas 9:1-10).",
    },
  },
  {
    key: "watch",
    motto: { en: "You do, I watch", id: "Anda melakukan, saya mengamati" },
    what: {
      en: "You step back. They lead without you in the room, and you check in from a distance through visits, calls and good questions.",
      id: "Anda mundur. Mereka memimpin tanpa Anda di ruangan, dan Anda memantau dari kejauhan melalui kunjungan, telepon, dan pertanyaan yang baik.",
    },
    why: {
      en: "Confidence and judgement only grow when you are not there to lean on. This is where they meet situations you never showed them. Your job moves from teaching to encouraging and checking, so small gaps are caught early. Support that is never taken away slowly turns into dependence.",
      id: "Rasa percaya diri dan kemampuan menimbang hanya bertumbuh ketika Anda tidak ada di sana untuk diandalkan. Di sinilah mereka bertemu situasi yang tidak pernah Anda tunjukkan. Tugas Anda bergeser dari mengajar menjadi menguatkan dan memeriksa, sehingga celah kecil ketahuan lebih awal. Dukungan yang tidak pernah ditarik perlahan berubah menjadi ketergantungan.",
    },
    whySup: "² ⁴",
    elements: [
      { en: "A set rhythm of check-ins that gets less frequent over time", id: "Jadwal pemantauan yang tetap dan makin jarang seiring waktu" },
      { en: "Ask questions instead of giving answers", id: "Ajukan pertanyaan, bukan jawaban" },
      { en: "Check the whole skill set, including the rare and hard parts", id: "Periksa seluruh keterampilan, termasuk bagian yang jarang dan sulit" },
      { en: "Encourage often, and send others to encourage them too", id: "Sering-seringlah menguatkan, dan utus orang lain untuk menguatkan mereka juga" },
    ],
    nextLabel: { en: "Move on when", id: "Lanjut ketika" },
    next: {
      en: "They handle the unexpected well, solve problems without calling you, and you have checked every skill the role needs.",
      id: "Mereka menangani hal tak terduga dengan baik, menyelesaikan masalah tanpa menelepon Anda, dan Anda sudah memeriksa setiap keterampilan yang dibutuhkan peran itu.",
    },
    scripture: {
      en: "When the seventy-two came back full of joy, Jesus listened, celebrated with them and corrected their focus (Luke 10:17-20). Paul kept watch in the same way, through visits and letters to the churches he had started.",
      id: "Ketika ketujuh puluh dua murid kembali dengan sukacita, Yesus mendengarkan, bersukacita bersama mereka, dan meluruskan fokus mereka (Lukas 10:17-20). Paulus memantau dengan cara yang sama, melalui kunjungan dan surat kepada jemaat-jemaat yang ia rintis.",
    },
  },
  {
    key: "launch",
    motto: { en: "You do, I pray", id: "Anda melakukan, saya berdoa" },
    what: {
      en: "You hand over the role for real and say so openly. You stay in touch as a friend who prays and encourages, but the decisions are now theirs.",
      id: "Anda menyerahkan peran itu dengan sungguh-sungguh dan menyatakannya secara terbuka. Anda tetap berhubungan sebagai sahabat yang mendoakan dan menguatkan, tetapi keputusan-keputusan kini ada di tangan mereka.",
    },
    why: {
      en: "Until the handover is clear, they keep checking with you and others keep coming to you. A public release gives them authority, not only tasks. It also frees you to begin the cycle again with someone new.",
      id: "Selama serah terima itu belum jelas, mereka akan terus bertanya kepada Anda dan orang lain akan terus datang kepada Anda. Pelepasan secara terbuka memberi mereka wewenang, bukan hanya tugas. Hal itu juga membebaskan Anda untuk memulai siklus lagi dengan orang baru.",
    },
    whySup: "⁶",
    elements: [
      { en: "Make the handover public, in front of the people they will lead", id: "Lakukan serah terima secara terbuka, di depan orang-orang yang akan mereka pimpin" },
      { en: "Hand over authority, not only the work", id: "Serahkan wewenang, bukan hanya pekerjaannya" },
      { en: "Stay a friend, not a supervisor. Do not take decisions back", id: "Tetaplah menjadi sahabat, bukan atasan. Jangan mengambil kembali keputusan mereka" },
      { en: "Agree that they will now train someone else", id: "Sepakati bahwa sekarang mereka akan melatih orang lain" },
    ],
    nextLabel: { en: "You know it worked when", id: "Anda tahu ini berhasil ketika" },
    next: {
      en: "They are modelling the same skill for someone new. The cycle has started again without you.",
      id: "Mereka sedang meneladankan keterampilan yang sama kepada orang baru. Siklusnya sudah dimulai lagi tanpa Anda.",
    },
    scripture: {
      en: "Before he left Ephesus, Paul gathered the elders, entrusted the church to them and committed them to God (Acts 20:17-38). He then asked Timothy to pass on what he had learned to reliable people who could teach others (2 Timothy 2:2).",
      id: "Sebelum meninggalkan Efesus, Paulus mengumpulkan para penatua, mempercayakan jemaat kepada mereka, dan menyerahkan mereka kepada Allah (Kisah Para Rasul 20:17-38). Kemudian ia meminta Timotius meneruskan apa yang telah ia pelajari kepada orang-orang yang dapat dipercaya, yang cakap mengajar orang lain (2 Timotius 2:2).",
    },
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────
const eyebrow: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
  color: orange, margin: "0 0 10px",
};
const h2: React.CSSProperties = {
  fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(24px, 3.5vw, 32px)",
  fontWeight: 600, color: navy, margin: "0 0 16px", lineHeight: 1.2,
};
const h3: React.CSSProperties = {
  fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600,
  color: navy, margin: "0 0 10px", lineHeight: 1.25,
};
const p: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.75, color: bodyText, margin: "0 0 16px" };
const wrap: React.CSSProperties = { maxWidth: 720, margin: "0 auto", padding: "0 24px" };
const section: React.CSSProperties = { padding: "64px 0" };
const callout: React.CSSProperties = {
  background: calloutBg, border: `1px solid ${calloutBorder}`, borderRadius: 6, padding: "18px 20px",
};

// ─── Motion (respects reduced motion) ─────────────────────────────────────────
const MOTION_CSS = `
.mawl-trans { transition: all 0.35s ease; }
.mawl-range { accent-color: ${orange}; width: 100%; height: 44px; cursor: pointer; }
@media (max-width: 560px) {
  .mawl-strip { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (prefers-reduced-motion: reduce) {
  .mawl-trans { transition: none !important; }
}
`;


// ─── How your role shifts: two-line chart ─────────────────────────────────────
function RoleShiftChart({ selected, lang }: { selected: PhaseKey; lang: Lang }) {
  const xs = [60, 160, 260, 360];
  const y = (v: number) => 24 + (100 - v) * 1.5;
  const inv = PHASE_KEYS.map((k, i) => `${xs[i]},${y(PHASES[k].involvement)}`).join(" ");
  const own = PHASE_KEYS.map((k, i) => `${xs[i]},${y(PHASES[k].ownership)}`).join(" ");
  return (
    <svg viewBox="0 0 400 230" width="100%" style={{ maxWidth: 560, display: "block", margin: "0 auto" }}
      role="img" aria-label={t(
        "Line chart. Your involvement falls from 95 percent in Model to 5 percent in Launch. Their ownership rises from 10 percent to 100 percent. The lines cross between Assist and Watch.",
        "Grafik garis. Keterlibatan Anda turun dari 95 persen di tahap Teladani menjadi 5 persen di tahap Mandirikan. Kepemilikan mereka naik dari 10 persen menjadi 100 persen. Kedua garis bersilangan di antara Bantu dan Amati.", lang)}>
      {[0, 50, 100].map(v => (
        <line key={v} x1={30} x2={390} y1={y(v)} y2={y(v)} stroke={lightGray} strokeWidth={1} />
      ))}
      {PHASE_KEYS.map((k, i) => k === selected && (
        <rect key={k} x={xs[i] - 40} y={12} width={80} height={172} rx={8} fill={calloutBg} className="mawl-trans" />
      ))}
      <text x={203} y={y(55) - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={muted}>{t("Handover", "Serah terima", lang)}</text>
      <polyline points={inv} fill="none" stroke={navy} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={own} fill="none" stroke={orange} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
      {PHASE_KEYS.map((k, i) => {
        const sel = k === selected;
        return (
          <g key={k}>
            <circle cx={xs[i]} cy={y(PHASES[k].involvement)} r={sel ? 7 : 5} fill={navy} stroke={white} strokeWidth={2} />
            <circle cx={xs[i]} cy={y(PHASES[k].ownership)} r={sel ? 7 : 5} fill={orange} stroke={white} strokeWidth={2} />
            <text x={xs[i]} y={208} textAnchor="middle" fontSize={14} fontWeight={700} fill={sel ? navy : muted}>{phaseName(k, lang)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── The cycle ────────────────────────────────────────────────────────────────
const NODE_POS: Record<PhaseKey, { x: number; y: number }> = {
  model: { x: 200, y: 70 }, assist: { x: 330, y: 200 }, watch: { x: 200, y: 330 }, launch: { x: 70, y: 200 },
};
const NODE_STROKE: Record<PhaseKey, { dash?: string; opacity: number }> = {
  model: { opacity: 1 }, assist: { opacity: 0.85 }, watch: { dash: "8 6", opacity: 0.6 }, launch: { dash: "3 7", opacity: 0.45 },
};

function CycleDiagram({ selected, onSelect, lang }: { selected: PhaseKey; onSelect: (k: PhaseKey) => void; lang: Lang }) {
  const arcs = [
    "M 257 83.2 A 130 130 0 0 1 316.8 143",
    "M 316.8 257 A 130 130 0 0 1 257 316.8",
    "M 143 316.8 A 130 130 0 0 1 83.2 257",
  ];
  return (
    <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: 620, display: "block", margin: "0 auto" }} aria-hidden="true">
      <defs>
        <marker id="mawl-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={orange} />
        </marker>
      </defs>
      {arcs.map(d => <path key={d} d={d} fill="none" stroke={orange} strokeWidth={3} markerEnd="url(#mawl-arrow)" />)}
      {/* Launch back to Model: a new cycle */}
      <path d="M 83.2 143 A 130 130 0 0 1 143 83.2" fill="none" stroke={orange} strokeWidth={3} strokeDasharray="6 5" markerEnd="url(#mawl-arrow)" />
      <text x={58} y={72} textAnchor="middle" fontSize={14} fontWeight={700} fill={orange}>{t("New cycle", "Siklus baru", lang)}</text>
      {/* Model and Assist go back and forth */}
      <path d="M 280 172 Q 272 126 236 118" fill="none" stroke={orange} strokeWidth={2} markerStart="url(#mawl-arrow)" markerEnd="url(#mawl-arrow)" />
      <text x={250} y={160} textAnchor="middle" fontSize={14} fill={muted}>{t("Show again", "Contohkan lagi", lang)}</text>
      <text x={200} y={200} textAnchor="middle" fontSize={14} fontWeight={600} fill={muted}>{t("Your presence", "Kehadiran Anda", lang)}</text>
      <text x={200} y={220} textAnchor="middle" fontSize={14} fontWeight={600} fill={muted}>{t("fades", "memudar", lang)}</text>
      {PHASE_KEYS.map((k, i) => {
        const { x, y } = NODE_POS[k];
        const sel = selected === k;
        const st = NODE_STROKE[k];
        return (
          <g key={k} onClick={() => onSelect(k)} style={{ cursor: "pointer" }}>
            <g className="mawl-trans" style={{ transform: `scale(${sel ? 1.12 : 1})`, transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={x} cy={y} r={48} fill={sel ? navy : white} />
              <circle cx={x} cy={y} r={48} fill="none" stroke={sel ? orange : navy} strokeWidth={3}
                strokeDasharray={st.dash} strokeOpacity={sel ? 1 : st.opacity} />
              <text x={x} y={y - 6} textAnchor="middle" fontSize={14} fontWeight={700} fill={sel ? orange : muted}>{i + 1}</text>
              <text x={x} y={y + 14} textAnchor="middle" fontSize={14} fontWeight={700} fill={sel ? white : navy}>{phaseName(k, lang)}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Scenarios ────────────────────────────────────────────────────────────────
type Scenario = {
  placeEn: string; placeId: string; en: string; id: string; answer: PhaseKey; explainEn: string; explainId: string;
};
const SCENARIOS: Scenario[] = [
  {
    placeEn: "Nairobi, Kenya", placeId: "Nairobi, Kenya",
    en: "Grace has run the weekly staff briefing at a Nairobi clinic for three months. Daniel, her manager, no longer attends. Every other Friday he reads her notes and asks one or two questions about the decisions she made.",
    id: "Grace sudah memimpin rapat staf mingguan di sebuah klinik di Nairobi selama tiga bulan. Daniel, atasannya, tidak lagi hadir. Setiap dua minggu sekali pada hari Jumat ia membaca catatan Grace dan mengajukan satu atau dua pertanyaan tentang keputusan yang ia ambil.",
    answer: "watch",
    explainEn: "Watch. Grace leads and Daniel checks from a distance. His questions keep the whole skill in view without taking the meeting back.",
    explainId: "Amati. Grace memimpin dan Daniel memeriksa dari kejauhan. Pertanyaannya menjaga seluruh keterampilan tetap terlihat tanpa mengambil alih rapat itu.",
  },
  {
    placeEn: "Lima, Peru", placeId: "Lima, Peru",
    en: "Lucía is leading her first small group in Lima. Mateo sits next to her. When the discussion stalls he leans over and whispers a question she could ask. Afterwards they talk through what worked.",
    id: "Lucía memimpin kelompok kecil pertamanya di Lima. Mateo duduk di sebelahnya. Ketika diskusi macet, ia mencondongkan badan dan membisikkan pertanyaan yang bisa Lucía ajukan. Sesudahnya mereka membahas apa yang berhasil.",
    answer: "assist",
    explainEn: "Assist. Lucía does the work while Mateo coaches at her elbow. Stalls and stumbles are expected here.",
    explainId: "Bantu. Lucía mengerjakannya sementara Mateo membimbing di sampingnya. Kemacetan dan kesalahan memang wajar di tahap ini.",
  },
  {
    placeEn: "Seoul, South Korea", placeId: "Seoul, Korea Selatan",
    en: "Ji-woo has a difficult client call in Seoul. She invites Min-jun, a new team member, to listen in and take notes. Afterwards she explains why she paused before answering the client's complaint.",
    id: "Ji-woo akan menerima telepon sulit dari seorang klien di Seoul. Ia mengajak Min-jun, anggota tim baru, untuk ikut mendengarkan dan mencatat. Sesudahnya ia menjelaskan mengapa ia berhenti sejenak sebelum menanggapi keluhan klien itu.",
    answer: "model",
    explainEn: "Model. Ji-woo does the task and explains her thinking. Min-jun gets a clear picture of what good looks like.",
    explainId: "Teladani. Ji-woo mengerjakan tugas itu dan menjelaskan cara berpikirnya. Min-jun mendapat gambaran yang jelas tentang seperti apa pekerjaan yang baik.",
  },
  {
    placeEn: "Amman, Jordan", placeId: "Amman, Yordania",
    en: "Samir started a food distribution for refugee families in Amman. After two years of working alongside Rania, he tells the volunteers that Rania now leads it. He moves to a new neighbourhood and calls her once a month to ask how he can pray.",
    id: "Samir memulai pembagian makanan bagi keluarga pengungsi di Amman. Setelah dua tahun bekerja bersama Rania, ia mengumumkan kepada para relawan bahwa Rania kini memimpinnya. Ia pindah ke lingkungan baru dan menelepon Rania sebulan sekali untuk menanyakan apa yang bisa ia doakan.",
    answer: "launch",
    explainEn: "Launch. The role is handed over in public, and Samir stays a friend without taking decisions back.",
    explainId: "Mandirikan. Peran itu diserahkan secara terbuka, dan Samir tetap menjadi sahabat tanpa mengambil kembali keputusan.",
  },
  {
    placeEn: "Rotterdam, Netherlands", placeId: "Rotterdam, Belanda",
    en: "Anke has prepared the team budget in Rotterdam for eighteen months. Every year Pieter still rewrites half of it the night before it is due. Anke no longer puts much effort into her draft.",
    id: "Anke sudah menyusun anggaran tim di Rotterdam selama delapan belas bulan. Namun setiap tahun Pieter masih menulis ulang separuhnya pada malam sebelum tenggat. Anke tidak lagi berusaha keras untuk drafnya.",
    answer: "assist",
    explainEn: "Assist, but it should be Watch by now. Pieter is still holding the handlebar. After eighteen months Anke needs him to step back, review, and let her own the result.",
    explainId: "Bantu, padahal seharusnya sudah Amati. Pieter masih memegang setang. Setelah delapan belas bulan, Anke membutuhkan Pieter untuk mundur, meninjau, dan membiarkan ia memiliki hasilnya.",
  },
];

function ScenarioCard({ s, index, lang }: { s: Scenario; index: number; lang: Lang }) {
  const [pick, setPick] = useState<PhaseKey | null>(null);
  const correct = pick === s.answer;
  return (
    <div style={{ background: white, border: `1px solid ${lightGray}`, borderRadius: 8, padding: "22px 20px", marginBottom: 16 }}>
      <p style={{ ...eyebrow, color: muted, marginBottom: 8 }}>{index + 1}. {t(s.placeEn, s.placeId, lang)}</p>
      <p style={{ ...p, marginBottom: 14 }}>{t(s.en, s.id, lang)}</p>
      <div role="group" aria-label={t("Which phase is this?", "Tahap apakah ini?", lang)} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PHASE_KEYS.map(k => {
          const chosen = pick === k;
          const isAnswer = pick !== null && k === s.answer;
          return (
            <button key={k} type="button" aria-pressed={chosen} onClick={() => setPick(k)}
              style={{
                minHeight: 44, padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                border: `1.5px solid ${isAnswer ? orange : chosen ? navy : lightGray}`,
                background: isAnswer ? orange : chosen ? navy : white,
                color: isAnswer || chosen ? white : navy,
              }}>
              {phaseName(k, lang)}
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {pick && (
          <p style={{ ...p, margin: "14px 0 0", fontSize: 14.5 }}>
            <strong style={{ color: correct ? orange : navy }}>
              {correct ? t("Yes. ", "Tepat. ", lang) : t("Not quite. ", "Belum tepat. ", lang)}
            </strong>
            {t(s.explainEn, s.explainId, lang)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Multiplication ───────────────────────────────────────────────────────────
const IMG = `/images/resources/${SLUG}`;

const GEN_STRIP = [
  { src: "cut-you", w: 334, h: 400, hPx: 110, en: "You", id: "Anda", subEn: "Paul", subId: "Paulus" },
  { src: "cut-scooter", w: 282, h: 334, hPx: 120, en: "Ana", id: "Ana", subEn: "Timothy", subId: "Timotius" },
  { src: "cut-bigbike", w: 436, h: 418, hPx: 140, en: "Joel", id: "Joel", subEn: "Reliable people", subId: "Orang yang dapat dipercaya" },
];

function MultiplyStrip({ lang }: { lang: Lang }) {
  const cell: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", textAlign: "center", minWidth: 0 };
  const name: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: navy, margin: "10px 0 2px" };
  const sub: React.CSSProperties = { fontSize: 12.5, color: muted, margin: 0 };
  return (
    <figure style={{ margin: "28px 0 8px" }}>
      <div className="mawl-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px 12px", alignItems: "end" }}>
        {GEN_STRIP.map(g => (
          <div key={g.src} style={cell}>
            <img src={`${IMG}/${g.src}.webp`} alt="" aria-hidden="true" width={g.w} height={g.h}
              style={{ height: g.hPx, width: "auto", maxWidth: "100%", display: "block" }} />
            <p style={name}>{t(g.en, g.id, lang)}</p>
            <p style={sub}>{t(g.subEn, g.subId, lang)}</p>
          </div>
        ))}
        <div style={cell}>
          <div aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 140 }}>
            {[0.55, 0.7, 0.85, 0.7].map((s, i) => (
              <img key={i} src={`${IMG}/cut-bigbike.webp`} alt="" width={436} height={418}
                style={{ height: 140 * s * 0.6, width: "auto", display: "block", opacity: 0.55 + i * 0.1 }} />
            ))}
          </div>
          <p style={name}>{t("And beyond", "Dan seterusnya", lang)}</p>
          <p style={sub}>{t("Others", "Orang lain", lang)}</p>
        </div>
      </div>
      <figcaption style={{ fontSize: 13, color: muted, textAlign: "center", marginTop: 16 }}>
        {t("Each generation rides a bigger motorbike than the one before. The four generations of 2 Timothy 2:2.",
          "Setiap generasi mengendarai motor yang lebih besar daripada generasi sebelumnya. Empat generasi dalam 2 Timotius 2:2.", lang)}
      </figcaption>
    </figure>
  );
}

function GrowthSlider({ years, setYears, lang }: { years: number; setYears: (n: number) => void; lang: Lang }) {
  const add = years + 1;
  const mult = Math.pow(2, years);
  const fmt = (n: number) => n.toLocaleString(lang === "id" ? "id-ID" : "en-US");
  const bar = (n: number, color: string, label: string) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: navy }}>{label}</span>
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 600, color, lineHeight: 1 }}>{fmt(n)}</span>
      </div>
      <div style={{ height: 14, background: lightGray, borderRadius: 7, overflow: "hidden" }}>
        <div className="mawl-trans" style={{ width: `${Math.max(1.5, (n / 1024) * 100)}%`, height: "100%", background: color, borderRadius: 7 }} />
      </div>
    </div>
  );
  return (
    <div style={{ background: white, border: `1px solid ${lightGray}`, borderRadius: 8, padding: "24px 20px", margin: "20px 0 8px" }}>
      <label htmlFor="mawl-years" style={{ display: "block", fontSize: 14, fontWeight: 700, color: navy, marginBottom: 4 }}>
        {t("Years", "Tahun", lang)}: <span style={{ color: orange }}>{years}</span>
      </label>
      <input id="mawl-years" type="range" min={1} max={10} step={1} value={years} className="mawl-range"
        onChange={e => setYears(Number(e.target.value))}
        aria-valuetext={t(`${years} years`, `${years} tahun`, lang)} />
      <div aria-live="polite" style={{ marginTop: 12 }}>
        {bar(add, navy, t("Addition: you train one new leader a year", "Penambahan: Anda melatih satu pemimpin baru setiap tahun", lang))}
        {bar(mult, orange, t("Multiplication: every leader trains one new leader a year", "Pelipatgandaan: setiap pemimpin melatih satu pemimpin baru setiap tahun", lang))}
      </div>
      <p style={{ fontSize: 12.5, color: muted, margin: "4px 0 0" }}>
        {t("An illustration, not a forecast. Real life is slower and messier, but the shape holds.",
          "Ini ilustrasi, bukan ramalan. Kenyataannya lebih lambat dan tidak serapi ini, tetapi polanya tetap sama.", lang)}
      </p>
    </div>
  );
}

// ─── Research text ────────────────────────────────────────────────────────────
const RESEARCH_EN = `What the research says

The four phases are not new. Robert Coleman's study of how Jesus trained the twelve described a pattern of selection, association, demonstration, delegation, supervision and reproduction.¹ His point was that Jesus invested deeply in a few people who would then reach many.

Leadership research reaches a similar shape from another direction. Hersey and Blanchard's life cycle theory argued that the right leadership style depends on the follower's readiness for a specific task, moving from high direction, to high support, to low involvement as readiness grows.² Because readiness is tied to the task and not the person, a skill-by-skill approach matters.

In learning science, Vygotsky described the zone of proximal development: the gap between what a learner can do alone and what they can do with help.³ Wood, Bruner and Ross called that help "scaffolding" and noted that it has to be removed as competence grows, a process later called fading.⁴ Collins, Brown and Newman combined these ideas into cognitive apprenticeship: modelling, coaching, scaffolding and fading, with the expert's thinking made visible.⁵ Pearson and Gallagher's gradual release of responsibility moves from "I do" to "we do" to "you do".⁶

The research agrees on two things leaders often skip. Support has to be withdrawn on purpose, not left in place out of habit. And learners need to see the expert's reasoning, not only the result, which is why Model includes explaining what you did and why.`;

const RESEARCH_ID = `Apa kata penelitian

Keempat tahap ini bukan hal baru. Kajian Robert Coleman tentang cara Yesus melatih kedua belas murid menggambarkan pola seleksi, kebersamaan, demonstrasi, pendelegasian, pengawasan, dan reproduksi.¹ Menurutnya, Yesus berinvestasi secara mendalam pada sedikit orang yang kemudian akan menjangkau banyak orang.

Penelitian kepemimpinan sampai pada bentuk yang serupa dari arah lain. Teori siklus hidup Hersey dan Blanchard menyatakan bahwa gaya kepemimpinan yang tepat bergantung pada kesiapan pengikut untuk tugas tertentu, bergerak dari arahan tinggi, ke dukungan tinggi, lalu ke keterlibatan rendah seiring bertumbuhnya kesiapan.² Karena kesiapan terkait dengan tugas dan bukan dengan orangnya, pendekatan keterampilan demi keterampilan menjadi penting.

Dalam ilmu pembelajaran, Vygotsky menggambarkan zona perkembangan proksimal: jarak antara apa yang bisa dilakukan pelajar sendiri dan apa yang bisa ia lakukan dengan bantuan.³ Wood, Bruner, dan Ross menyebut bantuan itu "scaffolding" (perancah) dan mencatat bahwa bantuan itu harus dilepas seiring bertumbuhnya kompetensi, sebuah proses yang kemudian disebut fading (pemudaran).⁴ Collins, Brown, dan Newman menggabungkan gagasan ini menjadi magang kognitif: pemodelan, pembimbingan, perancah, dan pemudaran, dengan cara berpikir sang ahli dibuat terlihat.⁵ Model pelepasan tanggung jawab bertahap dari Pearson dan Gallagher bergerak dari "saya melakukan" ke "kita melakukan" lalu ke "Anda melakukan".⁶

Penelitian sepakat tentang dua hal yang sering dilewatkan pemimpin. Dukungan harus ditarik dengan sengaja, bukan dibiarkan karena kebiasaan. Dan pelajar perlu melihat cara berpikir sang ahli, bukan hanya hasilnya. Karena itulah tahap Teladani mencakup menjelaskan apa yang Anda lakukan dan mengapa.`;

// ─── Main component ───────────────────────────────────────────────────────────
type Props = { isSaved: boolean };

export default function ModelAssistWatchLaunchClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [phase, setPhase] = useState<PhaseKey>("model");
  const [years, setYears] = useState(3);
  const [openMistake, setOpenMistake] = useState<number | null>(null);
  const [researchOpen, setResearchOpen] = useState(false);
  const [theoryOpen, setTheoryOpen] = useState<PhaseKey[]>(["model"]);
  const toggleTheory = (k: PhaseKey) =>
    setTheoryOpen(o => (o.includes(k) ? o.filter(x => x !== k) : [...o, k]));

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard(SLUG);
      setSaved(true);
    });
  }

  const ph = PHASES[phase];
  const research = (lang === "id" ? RESEARCH_ID : RESEARCH_EN).split("\n\n");

  const objectives = [
    { en: "know the four phases and what your role is in each one", id: "mengenal keempat tahap dan peran Anda di setiap tahap" },
    { en: "spot which phase someone is in, skill by skill", id: "mengenali tahap yang sedang dijalani seseorang, keterampilan demi keterampilan" },
    { en: "avoid the five places where the cycle usually breaks", id: "menghindari lima titik di mana siklus ini biasanya macet" },
    { en: "train for multiplication, not just one successor", id: "melatih untuk pelipatgandaan, bukan hanya untuk satu pengganti" },
  ];

  const story = [
    {
      en: "Before a single word about safety, the teacher puts on a helmet. That is the first act of modelling. The learner sees it and copies it without being told.",
      id: "Sebelum mengucapkan satu kata pun tentang keselamatan, sang pengajar memakai helm. Itulah tindakan meneladani yang pertama. Si pelajar melihatnya dan menirunya tanpa perlu disuruh.",
    },
    {
      en: "Then the learner watches how the teacher rides: sitting up straight, hands steady, eyes on the road.",
      id: "Lalu si pelajar mengamati cara sang pengajar berkendara: duduk tegak, tangan mantap, mata ke jalan.",
    },
    {
      en: "Next the learner gets on a small scooter while the teacher walks right beside them.",
      id: "Berikutnya si pelajar naik skuter kecil sementara sang pengajar berjalan tepat di sampingnya.",
    },
    {
      en: "Later the teacher stands by the road, calling out advice, and the learner rides off alone.",
      id: "Kemudian sang pengajar berdiri di pinggir jalan sambil meneriakkan saran, dan si pelajar melaju sendiri.",
    },
    {
      en: "Years later the learner rides a much bigger motorbike on roads the teacher has never seen. Good training ends with someone who does more than you.",
      id: "Bertahun-tahun kemudian si pelajar mengendarai sepeda motor yang jauh lebih besar di jalan-jalan yang belum pernah dilihat sang pengajar. Pelatihan yang baik berakhir dengan seseorang yang melakukan lebih banyak daripada Anda.",
    },
  ];

  const riderSkills: { en: string; id: string; phase: PhaseKey }[] = [
    { en: "Starting the engine", id: "Menyalakan mesin", phase: "launch" },
    { en: "Braking", id: "Mengerem", phase: "watch" },
    { en: "Steering through traffic", id: "Mengarahkan di tengah lalu lintas", phase: "watch" },
    { en: "Steep hills", id: "Tanjakan curam", phase: "assist" },
    { en: "Road rules in a busy city", id: "Aturan jalan di kota yang ramai", phase: "model" },
  ];

  const mistakes = [
    {
      en: "Skipping Assist", id: "Melewatkan tahap Bantu",
      lookEn: "You show it once, say \"over to you\" and walk away. It is like handing someone the keys after one demonstration.",
      lookId: "Anda menunjukkannya sekali, berkata \"silakan\", lalu pergi. Seperti menyerahkan kunci motor setelah satu kali peragaan.",
      whyEn: "It feels efficient. You assume they understood because they nodded.",
      whyId: "Rasanya efisien. Anda mengira mereka sudah paham karena mereka mengangguk.",
      doEn: "Stay beside them for the first real attempts. Expect falls and plan time for them.",
      doId: "Tetaplah di samping mereka pada percobaan-percobaan pertama yang sungguhan. Terimalah bahwa mereka akan jatuh dan sediakan waktu untuk itu.",
    },
    {
      en: "Staying in Assist too long", id: "Terlalu lama di tahap Bantu",
      lookEn: "Months later you are still holding the handlebar. They have stopped thinking, because you will fix it anyway.",
      lookId: "Berbulan-bulan kemudian Anda masih memegang setang. Mereka berhenti berpikir, karena toh Anda yang akan memperbaikinya.",
      whyEn: "Stepping back feels risky, and fixing it yourself is faster.",
      whyId: "Mundur terasa berisiko, dan memperbaikinya sendiri lebih cepat.",
      doEn: "Agree on a date when you will step back. Let small mistakes stand and talk them through afterwards.",
      doId: "Sepakati tanggal kapan Anda akan mundur. Biarkan kesalahan kecil terjadi, lalu bahas bersama sesudahnya.",
    },
    {
      en: "Never leaving Watch", id: "Tidak pernah keluar dari tahap Amati",
      lookEn: "Every decision still passes through you. Your check-ins have turned into an approval step they cannot move without.",
      lookId: "Setiap keputusan masih harus melalui Anda. Pemantauan Anda sudah berubah menjadi izin yang harus mereka tunggu sebelum bisa bergerak.",
      whyEn: "Being needed feels good.",
      whyId: "Dibutuhkan itu terasa menyenangkan.",
      doEn: "Check in less often, on a set rhythm. Ask questions instead of giving answers. Name a launch date.",
      doId: "Kurangi frekuensi pemantauan dan tetapkan jadwal yang tetap. Ajukan pertanyaan, bukan jawaban. Tentukan tanggal pemandirian.",
    },
    {
      en: "Launching without checking the whole skill set", id: "Memandirikan tanpa memeriksa seluruh keterampilan",
      lookEn: "They can run the meeting but have never handled a conflict in it. The gap shows up at the worst moment.",
      lookId: "Mereka bisa memimpin rapat, tetapi belum pernah menangani konflik di dalamnya. Celah itu muncul di saat yang paling buruk.",
      whyEn: "You checked the skills you could see and missed the ones that only appear under pressure.",
      whyId: "Anda memeriksa keterampilan yang terlihat dan melewatkan yang baru muncul saat ada tekanan.",
      doEn: "List every skill the role needs, including the rare and hard ones, and check each one.",
      doId: "Tuliskan setiap keterampilan yang dibutuhkan peran itu, termasuk yang jarang dan sulit, lalu periksa satu per satu.",
    },
    {
      en: "Stopping at one generation", id: "Berhenti di satu generasi",
      lookEn: "You trained a good leader who does not train anyone. The work ends with them.",
      lookId: "Anda melatih seorang pemimpin yang baik, tetapi ia tidak melatih siapa pun. Pekerjaan itu berhenti pada dirinya.",
      whyEn: "Passing on the cycle was never part of the goal.",
      whyId: "Meneruskan siklus ini memang tidak pernah menjadi bagian dari tujuan.",
      doEn: "Say from the start that the goal is for them to train someone else. Watch whether they pass on the cycle, not only the skill.",
      doId: "Katakan sejak awal bahwa tujuannya adalah agar mereka melatih orang lain. Amati apakah mereka meneruskan siklusnya, bukan hanya keterampilannya.",
    },
  ];

  const prompts: { k: PhaseKey; en: string; id: string }[] = [
    { k: "model", en: "What do you do every week that nobody has seen up close?", id: "Apa yang Anda lakukan setiap minggu yang belum pernah dilihat orang lain dari dekat?" },
    { k: "assist", en: "Who did you take a task back from after one mistake?", id: "Dari siapa Anda mengambil kembali sebuah tugas setelah satu kesalahan?" },
    { k: "watch", en: "Who could do the work but waits for your approval?", id: "Siapa yang sebenarnya mampu bekerja, tetapi masih menunggu persetujuan Anda?" },
    { k: "launch", en: "Which role would be hardest to give away, and what does that tell you?", id: "Peran mana yang paling sulit Anda serahkan, dan apa artinya itu bagi Anda?" },
  ];

  const takeaways = [
    { en: "The goal is leaders who go further than you, not copies of you.", id: "Tujuannya adalah pemimpin yang melangkah lebih jauh dari Anda, bukan tiruan Anda." },
    { en: "Model briefly, assist closely, watch for a long time, then launch.", id: "Teladani dengan singkat, bantu dari dekat, amati dalam waktu lama, lalu mandirikan." },
    { en: "Work skill by skill. Someone can be in Launch for one skill and still in Model for another.", id: "Bekerjalah keterampilan demi keterampilan. Seseorang bisa berada di tahap Mandirikan untuk satu keterampilan dan masih di tahap Teladani untuk keterampilan lain." },
    { en: "Falls in Assist are normal. Show it again, then hand it straight back.", id: "Jatuh di tahap Bantu itu wajar. Contohkan lagi, lalu segera serahkan kembali." },
    { en: "Multiplication only happens when you choose it. Train people who will train others.", id: "Pelipatgandaan hanya terjadi jika Anda memilihnya. Latihlah orang-orang yang akan melatih orang lain." },
  ];

  const foldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, margin: "0 0 4px" };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <style>{MOTION_CSS}</style>
      <LangToggle />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Leadership", "Kepemimpinan", lang)}</p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 20px", lineHeight: 1.08 }}>
            {t("Model, Assist, Watch, Launch", "Teladani, Bantu, Amati, Mandirikan", lang)}
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(17px, 2.5vw, 22px)", color: "oklch(85% 0.03 80)", maxWidth: 580, margin: "0 0 32px", lineHeight: 1.6, fontStyle: "italic" }}>
            {t("Many leaders want their people to take over. Often the leader is the one standing in the way.",
              "Banyak pemimpin ingin orang-orangnya mengambil alih. Sering kali justru sang pemimpin yang menghalanginya.", lang)}
          </p>
          {saved ? (
            <Link href="/dashboard" style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", minHeight: 44 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              {t("In your dashboard", "Di dasbor Anda", lang)}
            </Link>
          ) : (
            <button onClick={handleSave} disabled={isPending}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "oklch(78% 0.03 80)", padding: "10px 20px", minHeight: 44, borderRadius: 8, fontWeight: 600, fontSize: 13, border: "1px solid oklch(55% 0.05 260)", cursor: isPending ? "wait" : "pointer", fontFamily: "Montserrat, sans-serif" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              {isPending ? t("Saving...", "Menyimpan...", lang) : t("Save to dashboard", "Simpan ke dasbor", lang)}
            </button>
          )}
        </div>
      </div>

      {/* ── 2. OPENER ───────────────────────────────────────────────────────── */}
      <section style={section}>
        <div style={wrap}>
          <h2 style={h2}>{t("Growing leaders who go further than you", "Menumbuhkan pemimpin yang melangkah lebih jauh dari Anda", lang)}</h2>
          <p style={p}>{t(
            "Many leaders say they want their people to step up. Then they keep running the meeting, answering every question and fixing each mistake before anyone else sees it. The team learns the lesson quickly: wait, and the leader will do it.",
            "Banyak pemimpin berkata mereka ingin orang-orangnya maju. Lalu mereka tetap memimpin setiap rapat, menjawab setiap pertanyaan, dan memperbaiki setiap kesalahan sebelum orang lain melihatnya. Tim dengan cepat menangkap pelajarannya: tunggu saja, nanti pemimpin yang mengerjakan.", lang)}</p>
          <p style={p}>{t(
            "The goal is not a copy of yourself. It is a leader who can do the work without you, and in time do more than you could. Jesus trained his disciples this way, and Paul did the same in city after city.",
            "Tujuannya bukan tiruan diri Anda. Tujuannya adalah seorang pemimpin yang bisa mengerjakan tugas itu tanpa Anda, dan pada waktunya melakukan lebih banyak daripada yang bisa Anda lakukan. Yesus melatih murid-murid-Nya dengan cara ini, dan Paulus melakukan hal yang sama dari kota ke kota.", lang)}<Sup n="¹" /></p>
          <div style={{ ...callout, marginTop: 24 }}>
            <p style={{ ...foldLabel, marginBottom: 10 }}>{t("After this module you will", "Setelah modul ini Anda akan", lang)}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {objectives.map(o => (
                <li key={o.en} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 6, fontSize: 15, lineHeight: 1.6, color: navy, marginBottom: 6 }}>
                  <span aria-hidden="true" style={{ color: orange, fontWeight: 700 }}>✓</span>
                  <span>{t(o.en, o.id, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 2b. THEORY ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingTop: 0 }}>
        <div style={wrap}>
          <div style={{ borderTop: `1px solid ${lightGray}`, paddingTop: 56 }}>
            <p style={eyebrow}>{t("The method", "Metodenya", lang)}</p>
            <h2 style={h2}>{t("What each phase is for", "Untuk apa setiap tahap", lang)}</h2>
            <p style={p}>{t(
              "Each phase has its own job, a reason it works and a sign that tells you it is time to move on. Underneath all four is one idea: your support goes down in steps while their ability goes up. Jesus trained the twelve this way, and leadership and learning research arrives at the same shape.",
              "Setiap tahap memiliki tugasnya sendiri, alasan mengapa ia berhasil, dan tanda yang memberi tahu Anda bahwa sudah waktunya melangkah. Di balik keempatnya ada satu gagasan: dukungan Anda turun selangkah demi selangkah sementara kemampuan mereka naik. Yesus melatih kedua belas murid dengan cara ini, dan penelitian kepemimpinan serta pembelajaran sampai pada bentuk yang sama.", lang)}<Sup n="¹ ² ⁶" /></p>

            {/* The four steps at a glance */}
            <ol aria-label={t("The four steps at a glance", "Keempat langkah sekilas", lang)}
              style={{ listStyle: "none", padding: 0, margin: "24px 0 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
              {THEORY.map((th, i) => (
                <li key={th.key} style={{ background: i === 3 ? orange : `oklch(${22 + i * 12}% ${0.10 - i * 0.015} 260)`, color: white, borderRadius: 8, padding: "12px 14px" }}>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>{i + 1}. {phaseName(th.key, lang)}</span>
                  <span style={{ display: "block", fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, lineHeight: 1.25, marginTop: 4 }}>{t(th.motto.en, th.motto.id, lang)}</span>
                </li>
              ))}
            </ol>

            {/* Phase-by-phase detail */}
            <div style={{ display: "grid", gap: 12 }}>
              {THEORY.map((th, i) => {
                const open = theoryOpen.includes(th.key);
                const panelId = `mawl-theory-${th.key}`;
                return (
                  <div key={th.key} style={{ background: white, border: `1px solid ${open ? navy : lightGray}`, borderRadius: 8 }}>
                    <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => toggleTheory(th.key)}
                      style={{ width: "100%", minHeight: 56, display: "grid", gridTemplateColumns: "36px 1fr 20px", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
                      <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: "50%", background: open ? navy : offWhite, color: open ? white : navy, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{i + 1}</span>
                      <span>
                        <span style={{ display: "block", fontSize: 16, fontWeight: 700, color: navy }}>{phaseName(th.key, lang)}</span>
                        <span style={{ display: "block", fontSize: 13.5, color: muted, marginTop: 2 }}>{t(PHASES[th.key].shortEn, PHASES[th.key].shortId, lang)}</span>
                      </span>
                      <span aria-hidden="true" className="mawl-trans" style={{ color: orange, fontSize: 18, fontWeight: 700, transform: open ? "rotate(45deg)" : "none", textAlign: "center" }}>+</span>
                    </button>
                    {open && (
                      <div id={panelId} role="region" aria-label={phaseName(th.key, lang)} style={{ padding: "4px 20px 22px" }}>
                        <p style={foldLabel}>{t("What you do", "Apa yang Anda lakukan", lang)}</p>
                        <p style={{ ...p, marginBottom: 18 }}>{t(th.what.en, th.what.id, lang)}</p>
                        <p style={foldLabel}>{t("Why it works", "Mengapa ini berhasil", lang)}</p>
                        <p style={{ ...p, marginBottom: 18 }}>{t(th.why.en, th.why.id, lang)}<Sup n={th.whySup} /></p>
                        <p style={foldLabel}>{t("Key elements", "Unsur utama", lang)}</p>
                        <ul style={{ margin: "0 0 18px", padding: 0, listStyle: "none" }}>
                          {th.elements.map(el => (
                            <li key={el.en} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 6, fontSize: 15, lineHeight: 1.6, color: navy, marginBottom: 6 }}>
                              <span aria-hidden="true" style={{ color: orange, fontWeight: 700 }}>•</span>
                              <span>{t(el.en, el.id, lang)}</span>
                            </li>
                          ))}
                        </ul>
                        <div style={{ ...callout, marginBottom: 14 }}>
                          <p style={foldLabel}>{t(th.nextLabel.en, th.nextLabel.id, lang)}</p>
                          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: navy, fontWeight: 600 }}>{t(th.next.en, th.next.id, lang)}</p>
                        </div>
                        <p style={foldLabel}>{t("In Scripture", "Dalam Alkitab", lang)}</p>
                        <p style={{ ...p, margin: 0, fontStyle: "italic" }}>{t(th.scripture.en, th.scripture.id, lang)}<Sup n="⁷" /></p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 13.5, color: muted, margin: "16px 0 0" }}>{t(
              "Now watch the method in action. The story below walks through all four phases.",
              "Sekarang lihat metode ini dijalankan. Kisah di bawah ini melewati keempat tahap.", lang)}</p>
          </div>
        </div>
      </section>

      {/* ── 3. STORY ────────────────────────────────────────────────────────── */}
      <section style={{ ...section, background: white }}>
        <div style={wrap}>
          <p style={eyebrow}>{t("A story", "Sebuah kisah", lang)}</p>
          <h2 style={h2}>{t("Learning to ride a motorbike", "Belajar mengendarai sepeda motor", lang)}</h2>
          {story.map(s => <p key={s.en} style={p}>{t(s.en, s.id, lang)}</p>)}
          <figure style={{ margin: "28px 0 0" }}>
            <img
              src={`${IMG}/cycle-${lang}.webp`}
              alt={t("Illustration of the four-phase training cycle: Model, Assist, Watch and Launch, with the leader stepping back at each phase.",
                "Ilustrasi siklus pelatihan empat tahap: Teladani, Bantu, Amati, dan Mandirikan, dengan pemimpin semakin mundur di setiap tahap.", lang)}
              width={1280} height={985}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <figcaption style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontStyle: "italic", color: navy, textAlign: "center", marginTop: 12 }}>
              {t("Four phases, and in each one the teacher does less.", "Empat tahap, dan di setiap tahap sang pengajar semakin sedikit terlibat.", lang)}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── 4. THE CYCLE ────────────────────────────────────────────────────── */}
      <section style={section}>
        <div style={wrap}>
          <p style={eyebrow}>{t("The cycle", "Siklusnya", lang)}</p>
          <h2 style={h2}>{t("Four phases. Your presence fades.", "Empat tahap. Kehadiran Anda memudar.", lang)}</h2>
          <p style={p}>{t(
            "Tap a phase to see what it looks like. Notice how the leader's outline moves from solid to dashed. The small arrow between Model and Assist is there on purpose: you will go back and forth.",
            "Ketuk salah satu tahap untuk melihat seperti apa bentuknya. Perhatikan garis pemimpin yang berubah dari utuh menjadi putus-putus. Panah kecil di antara Teladani dan Bantu sengaja ada di sana: Anda akan bolak-balik di antara keduanya.", lang)}</p>
          <figure style={{ margin: "24px 0 0" }}>
            <CycleDiagram selected={phase} onSelect={setPhase} lang={lang} />
            <figcaption style={{ fontSize: 13, color: muted, textAlign: "center", marginTop: 8 }}>
              {t("The cycle: Model, Assist, Watch, Launch, then a new cycle with someone else.",
                "Siklusnya: Teladani, Bantu, Amati, Mandirikan, lalu siklus baru dengan orang lain.", lang)}
            </figcaption>
          </figure>
          <div role="group" aria-label={t("Choose a phase", "Pilih tahap", lang)} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, margin: "20px 0 24px" }}>
            {PHASE_KEYS.map((k, i) => (
              <button key={k} type="button" aria-pressed={phase === k} aria-controls="mawl-phase-panel" onClick={() => setPhase(k)}
                style={{
                  minHeight: 44, padding: "10px 12px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif", border: `1.5px solid ${phase === k ? navy : lightGray}`,
                  background: phase === k ? navy : white, color: phase === k ? white : navy,
                }}>
                {i + 1}. {phaseName(k, lang)}
              </button>
            ))}
          </div>

          <div id="mawl-phase-panel" role="region" aria-live="polite" aria-label={phaseName(phase, lang)}
            style={{ border: `1px solid ${lightGray}`, borderRadius: 8, padding: "24px 20px", background: white }}>
            <h3 style={h3}>{phaseName(phase, lang)}: {t(ph.shortEn, ph.shortId, lang)}</h3>
            <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", background: white, margin: "8px 0 12px" }}>
              <img key={phase} src={`${IMG}/phase-${phase}.webp`} alt={t(ph.img.altEn, ph.img.altId, lang)}
                width={ph.img.w} height={ph.img.h}
                style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block" }} />
            </div>
            {ph.bubbleEn && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <p style={{ margin: 0, background: calloutBg, border: `1.5px solid ${calloutBorder}`, borderRadius: 14, padding: "8px 16px", fontSize: 15, fontWeight: 700, color: navy }}>
                  &ldquo;{t(ph.bubbleEn, ph.bubbleId ?? "", lang)}&rdquo;
                </p>
              </div>
            )}
            <p style={{ ...p, fontStyle: "italic" }}>{t(ph.storyEn, ph.storyId, lang)}</p>
            <p style={p}>{t(ph.bodyEn, ph.bodyId, lang)}</p>
            <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "1fr", gap: 12, margin: 0 }}>
              {[
                { l: t("Who does the work", "Siapa yang mengerjakan", lang), v: t(ph.whoEn, ph.whoId, lang) },
                { l: t("Your role", "Peran Anda", lang), v: t(ph.roleEn, ph.roleId, lang) },
                { l: t("How long", "Berapa lama", lang), v: t(ph.longEn, ph.longId, lang) },
                { l: t("Watch out", "Waspadai", lang), v: t(ph.riskEn, ph.riskId, lang) },
              ].map(c => (
                <div key={c.l} style={{ background: offWhite, borderRadius: 6, padding: "12px 14px", border: `1px solid ${lightGray}`, minHeight: 132, boxSizing: "border-box" }}>
                  <dt style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: 6 }}>{c.l}</dt>
                  <dd style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: navy }}>{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* How your role shifts */}
          <h3 style={{ ...h3, marginTop: 48 }}>{t("How your role shifts", "Bagaimana peran Anda bergeser", lang)}</h3>
          <p style={p}>{t(
            "Your involvement goes down as their ownership goes up. Somewhere between Assist and Watch the lines cross, and the work becomes more theirs than yours.",
            "Keterlibatan Anda turun seiring naiknya rasa kepemilikan mereka. Di antara tahap Bantu dan Amati kedua garis itu bersilangan, dan pekerjaan itu menjadi lebih milik mereka daripada milik Anda.", lang)}</p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13, color: bodyText, marginBottom: 10 }}>
            <span><span aria-hidden="true" style={{ display: "inline-block", width: 18, height: 4, borderRadius: 2, background: navy, marginRight: 6, verticalAlign: "middle" }} />{t("Your involvement", "Keterlibatan Anda", lang)}</span>
            <span><span aria-hidden="true" style={{ display: "inline-block", width: 18, height: 4, borderRadius: 2, background: orange, marginRight: 6, verticalAlign: "middle" }} />{t("Their ownership", "Kepemilikan mereka", lang)}</span>
          </div>
          <div style={{ background: white, border: `1px solid ${lightGray}`, borderRadius: 8, padding: "16px 12px 8px" }}>
            <RoleShiftChart selected={phase} lang={lang} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: navy, margin: "28px 0 8px" }}>{t("Typical length", "Panjang yang umum", lang)}</p>
          <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 36, fontSize: 12, fontWeight: 700 }}>
            <div style={{ flex: 1, background: navy, color: white, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }} title={phaseName("model", lang)}>1</div>
            <div style={{ flex: 3, background: "oklch(35% 0.09 260)", color: white, display: "flex", alignItems: "center", justifyContent: "center" }}>{phaseName("assist", lang)}</div>
            <div style={{ flex: 10, background: "oklch(58% 0.06 260)", color: white, display: "flex", alignItems: "center", justifyContent: "center" }}>{phaseName("watch", lang)}</div>
            <div style={{ flex: 5, background: `linear-gradient(90deg, ${orange}, oklch(65% 0.15 45 / 0.1))`, color: white, display: "flex", alignItems: "center", paddingLeft: 10 }}>{phaseName("launch", lang)}</div>
          </div>
          <p style={{ fontSize: 12.5, color: muted, margin: "6px 0 0" }}>{t("1 = Model. Launch has no end point.", "1 = Teladani. Mandirikan tidak memiliki titik akhir.", lang)}</p>
        </div>
      </section>

      {/* ── 5. SKILL BY SKILL ───────────────────────────────────────────────── */}
      <section id="mc-four-stages" style={{ ...section, background: white }}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Skill by skill", "Keterampilan demi keterampilan", lang)}</p>
          <h2 style={h2}>{t("One person can be in Launch and Model at the same time", "Satu orang bisa berada di tahap Mandirikan dan Teladani sekaligus", lang)}</h2>
          <p style={p}>{t(
            "You move each skill through the cycle, not the whole person. Go back to the new rider. You have launched them on starting the engine. You watch their braking from the roadside. On steep hills you still walk beside them. And on the rules of a busy city road you are still riding in front, showing the way.",
            "Yang Anda gerakkan melalui siklus ini adalah setiap keterampilan, bukan orangnya secara utuh. Kembali ke pengendara baru tadi. Untuk menyalakan mesin, Anda sudah memandirikannya. Cara ia mengerem Anda amati dari pinggir jalan. Di tanjakan curam Anda masih berjalan di sampingnya. Dan untuk aturan jalan di kota yang ramai, Anda masih berkendara di depan untuk menunjukkan jalannya.", lang)}</p>
          <p style={p}>{t(
            "A team leader is the same. They may run meetings on their own and still need you beside them for a hard conversation. Readiness belongs to the task, not the person.",
            "Seorang pemimpin tim pun sama. Ia mungkin sudah bisa memimpin rapat sendiri, tetapi masih membutuhkan Anda di sampingnya untuk percakapan yang sulit. Kesiapan melekat pada tugas, bukan pada orangnya.", lang)}<Sup n="²" /></p>
          <div style={{ background: offWhite, border: `1px solid ${lightGray}`, borderRadius: 8, overflow: "hidden", margin: "20px 0 24px" }}>
            {riderSkills.map((s, i) => (
              <div key={s.en} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: i ? `1px solid ${lightGray}` : "none" }}>
                <span style={{ fontSize: 14.5, color: navy }}>{t(s.en, s.id, lang)}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: white, background: s.phase === "launch" ? orange : navy, opacity: s.phase === "model" ? 1 : s.phase === "assist" ? 0.85 : s.phase === "watch" ? 0.7 : 1, borderRadius: 999, padding: "4px 12px", whiteSpace: "nowrap" }}>
                  {phaseName(s.phase, lang)}
                </span>
              </div>
            ))}
          </div>
          <div style={callout}>
            <p style={{ ...p, margin: 0 }}>{t(
              "Inside each phase your learner is also moving through the Four Stages of Competence: from not knowing what they lack, to painful awareness, to effortful skill, to ease. The painful awareness usually hits hardest in Assist. That is where people want to quit, and where your presence matters most.",
              "Di dalam setiap tahap, pelajar Anda juga sedang bergerak melalui Empat Tahap Kompetensi: dari tidak tahu apa yang kurang, ke kesadaran yang menyakitkan, ke keterampilan yang masih butuh usaha, hingga menjadi lancar. Kesadaran yang menyakitkan itu biasanya paling terasa di tahap Bantu. Di situlah orang ingin menyerah, dan di situlah kehadiran Anda paling berarti.", lang)}</p>
          </div>
        </div>
      </section>

      {/* ── 6. SHADOW LEADERSHIP ────────────────────────────────────────────── */}
      <section style={section}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Leading from the shadows", "Memimpin dari balik layar", lang)}</p>
          <h2 style={h2}>{t("Put them in the spotlight", "Tempatkan mereka di bawah sorotan", lang)}</h2>
          <figure style={{ margin: "8px 0 20px" }}>
            <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
              <img src={`${IMG}/spotlight.webp`} width={1400} height={760}
                alt={t("On a dark stage, the learner rides a big motorbike under a spotlight while the leader stands in the shadows with arms folded.",
                  "Di panggung yang gelap, pelajar mengendarai sepeda motor besar di bawah sorotan lampu, sementara pemimpin berdiri di balik bayang-bayang dengan tangan terlipat.", lang)}
                style={{ width: "100%", height: "auto", display: "block" }} />
              <span aria-hidden="true" style={{ position: "absolute", left: "20%", bottom: "6%", transform: "translateX(-50%)", fontSize: "clamp(11px, 2.2vw, 14px)", fontWeight: 700, color: "#8b97b3", whiteSpace: "nowrap" }}>
                {t("In the shadows", "Di balik layar", lang)}
              </span>
              <span aria-hidden="true" style={{ position: "absolute", left: "65%", bottom: "6%", transform: "translateX(-50%)", fontSize: "clamp(11px, 2.2vw, 14px)", fontWeight: 700, color: "#fff3d6", whiteSpace: "nowrap" }}>
                {t("In the spotlight", "Di bawah sorotan", lang)}
              </span>
            </div>
            <figcaption style={{ fontSize: 13, color: muted, textAlign: "center", marginTop: 8 }}>
              {t("In Watch and Launch, the light belongs to them. You stay in the shadows.", "Di tahap Amati dan Mandirikan, sorotan milik mereka. Anda tetap di balik layar.", lang)}
            </figcaption>
          </figure>
          <p style={p}>{t(
            "In many cultures the room looks to whoever stands at the front, or to the most senior person present. If you are in the room, people will still turn to you, even after you have handed the role over. Sometimes the kindest thing you can do is stay away.",
            "Di banyak budaya, semua orang di ruangan memandang kepada siapa pun yang berdiri di depan, atau kepada orang yang paling senior. Jika Anda ada di ruangan, orang-orang tetap akan menoleh kepada Anda, bahkan setelah Anda menyerahkan peran itu. Kadang hal paling baik yang bisa Anda lakukan adalah tidak hadir.", lang)}</p>
          <p style={p}>{t(
            "Where hierarchy runs deep, from Lagos to Riyadh to Seoul, say it out loud: \"Rania leads this now. Take your questions to her.\" Without that public word, people assume the handover is not real and keep coming back to you.",
            "Di tempat yang hierarkinya kuat, dari Lagos hingga Riyadh hingga Seoul, katakanlah dengan jelas: \"Sekarang Rania yang memimpin ini. Bawalah pertanyaan Anda kepadanya.\" Tanpa pernyataan terbuka itu, orang akan menganggap penyerahan itu tidak sungguhan dan terus kembali kepada Anda.", lang)}</p>
        </div>
      </section>

      {/* ── 7. SCENARIOS + MISTAKES ─────────────────────────────────────────── */}
      <section style={{ ...section, background: white }}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Practice", "Latihan", lang)}</p>
          <h2 style={h2}>{t("Which phase is this?", "Tahap apakah ini?", lang)}</h2>
          <p style={p}>{t("Five leaders in five cities. Pick the phase each one is in right now.", "Lima pemimpin di lima kota. Pilih tahap yang sedang dijalani masing-masing saat ini.", lang)}</p>
          {SCENARIOS.map((s, i) => <ScenarioCard key={s.placeEn} s={s} index={i} lang={lang} />)}

          <h3 style={{ ...h3, marginTop: 40 }}>{t("Where the cycle breaks", "Di mana siklus ini macet", lang)}</h3>
          <p style={p}>{t("Five common places leaders get stuck. Open each one to see what it looks like and what to do instead.",
            "Lima titik yang sering membuat pemimpin tersangkut. Buka masing-masing untuk melihat seperti apa bentuknya dan apa yang sebaiknya dilakukan.", lang)}</p>
          <div>
            {mistakes.map((m, i) => {
              const open = openMistake === i;
              return (
                <div key={m.en} style={{ border: `1px solid ${lightGray}`, borderRadius: 8, marginBottom: 10, background: open ? offWhite : white }} className="mawl-trans">
                  <button type="button" aria-expanded={open} aria-controls={`mawl-mistake-${i}`} onClick={() => setOpenMistake(open ? null : i)}
                    style={{ width: "100%", minHeight: 44, display: "grid", gridTemplateColumns: "32px 1fr 20px", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 600, color: orange, lineHeight: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: navy }}>{t(m.en, m.id, lang)}</span>
                    <span aria-hidden="true" style={{ fontSize: 18, color: orange, fontWeight: 700 }}>{open ? "−" : "+"}</span>
                  </button>
                  <div id={`mawl-mistake-${i}`} hidden={!open} style={{ padding: "0 16px 16px 58px" }}>
                    {[
                      { l: t("What it looks like", "Seperti apa bentuknya", lang), v: t(m.lookEn, m.lookId, lang) },
                      { l: t("Why it happens", "Mengapa terjadi", lang), v: t(m.whyEn, m.whyId, lang) },
                      { l: t("What to do instead", "Apa yang sebaiknya dilakukan", lang), v: t(m.doEn, m.doId, lang) },
                    ].map(r => (
                      <div key={r.l} style={{ marginBottom: 12 }}>
                        <p style={foldLabel}>{r.l}</p>
                        <p style={{ ...p, margin: 0, fontSize: 15 }}>{r.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. MULTIPLICATION ───────────────────────────────────────────────── */}
      <section style={section}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Multiplication through generations", "Pelipatgandaan lintas generasi", lang)}</p>
          <h2 style={h2}>{t("The game changer: they go further than you", "Pengubah permainan: mereka melangkah lebih jauh dari Anda", lang)}</h2>
          <p style={p}>{t(
            "Addition means you train people yourself, one after another. Multiplication means the people you train go on to train others. Launch is not the end of the cycle. It is where the next one begins.",
            "Penambahan berarti Anda sendiri yang melatih orang, satu demi satu. Pelipatgandaan berarti orang-orang yang Anda latih melanjutkan dengan melatih orang lain. Mandirikan bukanlah akhir siklus. Di sanalah siklus berikutnya dimulai.", lang)}</p>
          <blockquote style={{ margin: "24px 0", padding: "20px 22px", background: white, borderLeft: `4px solid ${orange}`, borderRadius: 6 }}>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 21, fontStyle: "italic", lineHeight: 1.5, color: navy, margin: "0 0 8px" }}>
              {t("\"And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.\"",
                "\"Apa yang telah engkau dengar dari padaku di depan banyak saksi, percayakanlah itu kepada orang-orang yang dapat dipercayai, yang juga cakap mengajar orang lain.\"", lang)}
            </p>
            <cite style={{ fontSize: 13, fontStyle: "normal", color: orange, fontWeight: 700 }}>{t("2 Timothy 2:2 (NIV)", "2 Timotius 2:2 (TB)", lang)}</cite>
          </blockquote>
          <p style={p}>{t(
            "Four generations in one verse: Paul, Timothy, reliable people, and others. The finish line is not the first person you train. It is the fourth.",
            "Empat generasi dalam satu ayat: Paulus, Timotius, orang-orang yang dapat dipercaya, dan orang lain. Garis akhirnya bukan orang pertama yang Anda latih, melainkan orang keempat.", lang)}</p>

          <MultiplyStrip lang={lang} />

          <p style={{ ...p, marginTop: 24 }}>{t(
            "Picture it in Cebu. You train Ana, a nurse, to lead a health group for mothers. Ana trains Joel. Joel trains Ria. Soon mothers are being helped by people you have never met, in places you have never been.",
            "Bayangkan di Cebu. Anda melatih Ana, seorang perawat, untuk memimpin kelompok kesehatan bagi para ibu. Ana melatih Joel. Joel melatih Ria. Tak lama kemudian para ibu ditolong oleh orang-orang yang belum pernah Anda temui, di tempat-tempat yang belum pernah Anda kunjungi.", lang)}</p>

          <h3 style={{ ...h3, marginTop: 36 }}>{t("Jesus with the Twelve", "Yesus bersama kedua belas murid", lang)}</h3>
          <p style={p}>{t(
            "Jesus spent about three years with twelve people. He did not try to reach everyone himself. Then he sent them to make disciples of all nations (Matthew 28:19). Within about thirty years the message had travelled from Jerusalem to Rome (Acts 28).",
            "Yesus menghabiskan sekitar tiga tahun bersama dua belas orang. Ia tidak berusaha menjangkau semua orang seorang diri. Lalu Ia mengutus mereka untuk menjadikan semua bangsa murid-Nya (Matius 28:19). Dalam waktu sekitar tiga puluh tahun, berita itu sudah sampai dari Yerusalem ke Roma (Kisah Para Rasul 28).", lang)}</p>

          <h3 style={{ ...h3, marginTop: 36 }}>{t("Addition or multiplication?", "Penambahan atau pelipatgandaan?", lang)}</h3>
          <p style={p}>{t("Move the slider to see how the two compare over time.", "Geser penggeser untuk melihat perbandingan keduanya dari waktu ke waktu.", lang)}</p>
          <GrowthSlider years={years} setYears={setYears} lang={lang} />

          <h3 style={{ ...h3, marginTop: 36 }}>{t("Why it matters", "Mengapa ini penting", lang)}</h3>
          <p style={p}>{t(
            "Your reach is limited by your time and your years. Theirs is not. When the people you train also train others, the work keeps growing long after you have stepped back, and in places you will never go.",
            "Jangkauan Anda dibatasi oleh waktu dan usia Anda. Jangkauan mereka tidak. Ketika orang-orang yang Anda latih juga melatih orang lain, pekerjaan itu terus bertumbuh lama setelah Anda mundur, dan di tempat-tempat yang tidak akan pernah Anda datangi.", lang)}</p>
          <div style={{ ...callout, margin: "24px 0" }}>
            <p style={{ ...p, margin: 0 }}><strong style={{ color: navy }}>{t("It only happens when you choose it. ", "Ini hanya terjadi jika Anda memilihnya. ", lang)}</strong>{t(
              "Multiplication does not happen by accident. Make it the goal from the first day, and say it out loud: \"I am training you so that you can train someone else.\"",
              "Pelipatgandaan tidak terjadi secara kebetulan. Jadikan itu tujuan sejak hari pertama, dan katakan dengan jelas: \"Saya melatih Anda supaya Anda bisa melatih orang lain.\"", lang)}</p>
          </div>
          <p style={{ ...p, margin: 0 }}>{t(
            "This is the game changer. They learned on your small scooter. They ride off on a bigger motorbike and do more than you ever could. That is not a threat to your leadership. It is the fruit of it.",
            "Inilah pengubah permainannya. Mereka belajar dengan skuter kecil Anda. Mereka melaju dengan sepeda motor yang lebih besar dan melakukan lebih banyak daripada yang pernah bisa Anda lakukan. Itu bukan ancaman bagi kepemimpinan Anda. Itulah buahnya.", lang)}</p>
        </div>
      </section>

      {/* ── 9. FAITH ANCHOR ─────────────────────────────────────────────────── */}
      <section style={{ ...section, background: navy }}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Faith anchor", "Jangkar iman", lang)}</p>
          <h2 style={{ ...h2, color: offWhite }}>{t("Entrusted, not held", "Dipercayakan, bukan digenggam", lang)}</h2>
          <p style={{ ...p, color: "oklch(85% 0.02 260)" }}>{t(
            "Jesus appointed the twelve \"that they might be with him and that he might send them out\".",
            "Yesus menetapkan dua belas murid \"untuk menyertai Dia dan untuk diutus-Nya\".", lang)}<Sup n="⁷" />{t(
            " Being with him came first. Sending came second. They watched him heal and teach, tried it with him nearby, went out in pairs and came back to report (Luke 9 and 10). At the end he handed them the whole mission.",
            " Menyertai lebih dulu, diutus kemudian. Mereka melihat Dia menyembuhkan dan mengajar, mencobanya sendiri dengan Dia di dekat mereka, diutus berdua-dua lalu kembali untuk melapor (Lukas 9 dan 10). Pada akhirnya Ia menyerahkan seluruh misi kepada mereka.", lang)}</p>
          <p style={{ ...p, color: "oklch(85% 0.02 260)" }}>{t("Paul followed the same shape:", "Paulus mengikuti bentuk yang sama:", lang)}</p>

          <ol style={{ listStyle: "none", margin: "8px 0 28px", padding: 0 }}>
            {[
              {
                tag: t("Model and Assist", "Teladani dan Bantu", lang),
                time: t("Weeks to years per city", "Beberapa minggu hingga bertahun-tahun per kota", lang),
                text: t("A few weeks in Thessalonica (Acts 17:2). Eighteen months in Corinth (Acts 18:11). About three years in Ephesus (Acts 20:31).",
                  "Beberapa minggu di Tesalonika (Kis. 17:2). Delapan belas bulan di Korintus (Kis. 18:11). Sekitar tiga tahun di Efesus (Kis. 20:31).", lang),
                color: orange, dashed: false,
              },
              {
                tag: t("Watch", "Amati", lang),
                time: t("More than a decade", "Lebih dari satu dasawarsa", lang),
                text: t("Return visits, Timothy and Titus sent in his place, and letters that answered real questions from real churches.",
                  "Kunjungan ulang, Timotius dan Titus yang diutus menggantikannya, dan surat-surat yang menjawab pertanyaan nyata dari jemaat-jemaat yang nyata.", lang),
                color: "oklch(75% 0.04 260)", dashed: true,
              },
              {
                tag: t("Launch", "Mandirikan", lang),
                time: t("Miletus", "Miletus", lang),
                text: t("He told the Ephesian elders they would not see him again (Acts 20:25), warned them about wolves from outside and within, and then committed them to God (Acts 20:29-32).",
                  "Ia berkata kepada para penatua Efesus bahwa mereka tidak akan melihat mukanya lagi (Kis. 20:25), memperingatkan mereka tentang serigala dari luar dan dari dalam, lalu menyerahkan mereka kepada Tuhan (Kis. 20:29-32).", lang),
                color: offWhite, dashed: true,
              },
            ].map((s, i, arr) => (
              <li key={s.tag} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 14 }}>
                <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2.5px ${s.dashed ? "dashed" : "solid"} ${s.color}`, background: s.dashed ? "transparent" : s.color, marginTop: 4 }} />
                  {i < arr.length - 1 && <span style={{ flex: 1, width: 2, background: "oklch(40% 0.06 260)", margin: "4px 0" }} />}
                </div>
                <div style={{ paddingBottom: 22 }}>
                  <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange }}>{s.tag}</p>
                  <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: offWhite }}>{s.time}</p>
                  <p style={{ ...p, margin: 0, color: "oklch(85% 0.02 260)" }}>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <blockquote style={{ margin: "0 0 24px", padding: "20px 22px", background: "oklch(28% 0.10 260)", borderRadius: 6 }}>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 21, fontStyle: "italic", lineHeight: 1.5, color: offWhite, margin: "0 0 8px" }}>
              {t("\"Now I commit you to God and to the word of his grace, which can build you up and give you an inheritance among all those who are sanctified.\"",
                "\"Dan sekarang aku menyerahkan kamu kepada Tuhan dan kepada firman kasih karunia-Nya, yang berkuasa membangun kamu dan menganugerahkan kepada kamu bagian yang ditentukan bagi semua orang yang telah dikuduskan-Nya.\"", lang)}
            </p>
            <cite style={{ fontSize: 13, fontStyle: "normal", color: orange, fontWeight: 700 }}>{t("Acts 20:32 (NIV)", "Kisah Para Rasul 20:32 (TB)", lang)}</cite>
          </blockquote>
          <p style={{ ...p, color: "oklch(85% 0.02 260)", margin: 0 }}>{t(
            "Paul did not hand the elders a manual. He handed them to God. Launch is an act of trust in God as much as in people. Paul kept writing and praying for the churches he had left, but he did not take them back.",
            "Paulus tidak menyerahkan buku panduan kepada para penatua. Ia menyerahkan mereka kepada Tuhan. Memandirikan adalah tindakan percaya kepada Tuhan, sama seperti percaya kepada manusia. Paulus terus menulis surat dan mendoakan jemaat-jemaat yang ia tinggalkan, tetapi ia tidak mengambil alih mereka kembali.", lang)}</p>
        </div>
      </section>

      {/* ── 10. YOUR TURN ───────────────────────────────────────────────────── */}
      <section style={section}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Reflect", "Renungkan", lang)}</p>
          <h2 style={h2}>{t("Your turn", "Giliran Anda", lang)}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {prompts.map(q => (
              <div key={q.k} style={{ background: white, border: `1px solid ${lightGray}`, borderRadius: 8, padding: "18px 18px" }}>
                <p style={{ ...eyebrow, marginBottom: 8 }}>{phaseName(q.k, lang)}</p>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, lineHeight: 1.4, color: navy, margin: 0 }}>{t(q.en, q.id, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. KEY TAKEAWAYS ───────────────────────────────────────────────── */}
      <section style={{ ...section, background: white }}>
        <div style={wrap}>
          <h2 style={h2}>{t("Key takeaways", "Poin-poin penting", lang)}</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {takeaways.map((k, i) => (
              <li key={k.en} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 8, padding: "14px 0", borderTop: i ? `1px solid ${lightGray}` : "none" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: orange, lineHeight: 1 }}>{i + 1}</span>
                <p style={{ ...p, margin: 0 }}>{t(k.en, k.id, lang)}</p>
              </li>
            ))}
          </ol>

          {/* Research collapsible */}
          <div style={{ marginTop: 36 }}>
            <button type="button" aria-expanded={researchOpen} aria-controls="mawl-research" onClick={() => setResearchOpen(o => !o)}
              style={{ minHeight: 44, background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 15, fontWeight: 700, color: orange, fontFamily: "Montserrat, sans-serif" }}>
              {researchOpen ? t("Hide the research ↑", "Sembunyikan penelitian ↑", lang) : t("Read the research →", "Baca penelitiannya →", lang)}
            </button>
            <div id="mawl-research" role="region" aria-label={research[0]} className="mawl-trans"
              style={{ display: "grid", gridTemplateRows: researchOpen ? "1fr" : "0fr" }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{ paddingTop: 16 }} hidden={!researchOpen}>
                  <h3 style={h3}>{research[0]}</h3>
                  {research.slice(1).map((para, i) => <p key={i} style={p}>{para}</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. SOURCES ─────────────────────────────────────────────────────── */}
      <SourcesDropdown sources={[
        "Coleman, R. E. (1963). The master plan of evangelism. Revell.",
        "Hersey, P., & Blanchard, K. H. (1969). Life cycle theory of leadership. Training and Development Journal, 23(5), 26-34.",
        "Vygotsky, L. S. (1978). Mind in society: The development of higher psychological processes. Harvard University Press.",
        "Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. Journal of Child Psychology and Psychiatry, 17(2), 89-100.",
        "Collins, A., Brown, J. S., & Newman, S. E. (1989). Cognitive apprenticeship: Teaching the crafts of reading, writing, and mathematics. In L. B. Resnick (Ed.), Knowing, learning, and instruction (pp. 453-494). Erlbaum.",
        "Pearson, P. D., & Gallagher, M. C. (1983). The instruction of reading comprehension. Contemporary Educational Psychology, 8(3), 317-344.",
        "The Holy Bible, New International Version (2011) and Alkitab Terjemahan Baru (LAI): Mark 3:14; Luke 9-10; Matthew 28:19; Acts 17:2, 18:11, 20:17-38, 28; 2 Timothy 2:2.",
      ]} lang={lang} markerStyle="superscript" />
    </div>
  );
}
