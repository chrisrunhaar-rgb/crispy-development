"use client";
import { useState, useTransition, useId } from "react";
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
    involvement: 5, ownership: 100,
  },
};

const phaseName = (k: PhaseKey, lang: Lang) => t(PHASES[k].en, PHASES[k].id, lang);

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
@keyframes mawl-pop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes mawl-fade { from { opacity: 1; } to { opacity: 0.25; } }
@keyframes mawl-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.mawl-pop { opacity: 0; transform-box: fill-box; animation: mawl-pop 0.5s ease-out forwards; }
.mawl-fadeout { animation: mawl-fade 2.4s ease-in-out 0.4s forwards; }
.mawl-pulse { animation: mawl-pulse 1.6s ease-in-out infinite; }
.mawl-trans { transition: all 0.35s ease; }
@media (prefers-reduced-motion: reduce) {
  .mawl-pop { animation: none; opacity: 1; transform: none; }
  .mawl-fadeout { animation: none; opacity: 0.25; }
  .mawl-pulse { animation: none; }
  .mawl-trans { transition: none !important; }
}
`;

// ─── Small SVG person ─────────────────────────────────────────────────────────
function Person({ x, y, color, dashed = false, s = 1, className, style }: {
  x: number; y: number; color: string; dashed?: boolean; s?: number;
  className?: string; style?: React.CSSProperties;
}) {
  const dash = dashed ? "4 4" : undefined;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={className} style={style}>
        <circle cx={0} cy={-38} r={11} fill={dashed ? "none" : color} stroke={color} strokeWidth={2.5} strokeDasharray={dash} />
        <path d="M -18 12 Q -18 -22 0 -22 Q 18 -22 18 12 Z" fill={dashed ? "none" : color} stroke={color} strokeWidth={2.5} strokeDasharray={dash} strokeLinejoin="round" />
      </g>
    </g>
  );
}

// ─── Phase scenes ─────────────────────────────────────────────────────────────
function PhaseScene({ phase, lang }: { phase: PhaseKey; lang: Lang }) {
  const learner = orange;
  if (phase === "model") {
    return (
      <svg viewBox="0 0 320 150" width="100%" style={{ maxWidth: 360, display: "block" }} aria-hidden="true">
        <Person x={100} y={118} color={navy} />
        <rect x={128} y={96} width={44} height={26} rx={5} fill={navy} className="mawl-pulse" />
        <Person x={232} y={118} color={learner} s={0.9} />
        <g className="mawl-pop" style={{ animationDelay: "0.7s" }}>
          <rect x={168} y={10} width={132} height={32} rx={8} fill={white} stroke={lightGray} strokeWidth={1.5} />
          <text x={234} y={31} textAnchor="middle" fontSize={14} fontWeight={600} fill={navy}>
            {t("I could do that.", "Saya juga bisa.", lang)}
          </text>
        </g>
      </svg>
    );
  }
  if (phase === "assist") {
    return (
      <svg viewBox="0 0 320 150" width="100%" style={{ maxWidth: 360, display: "block" }} aria-hidden="true">
        <defs>
          <marker id="mawl-scene-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={orange} />
          </marker>
        </defs>
        <text x={122} y={30} textAnchor="end" fontSize={14} fontWeight={700} fill={navy}>{phaseName("model", lang)}</text>
        <line x1={132} y1={20} x2={176} y2={20} stroke={orange} strokeWidth={2} markerEnd="url(#mawl-scene-arrow)" />
        <line x1={176} y1={30} x2={132} y2={30} stroke={orange} strokeWidth={2} markerEnd="url(#mawl-scene-arrow)" />
        <text x={186} y={30} fontSize={14} fontWeight={700} fill={navy}>{phaseName("assist", lang)}</text>
        <Person x={92} y={130} color={navy} s={0.9} style={{ opacity: 0.85 }} />
        <Person x={140} y={130} color={learner} s={0.9} />
        <text x={214} y={80} fontSize={14} fontWeight={700} fill={muted}>{t("Falls", "Jatuh", lang)}</text>
        {[0, 1, 2].map(i => (
          <circle key={i} cx={222 + i * 24} cy={100} r={8} fill={navy} className="mawl-pop" style={{ animationDelay: `${0.4 + i * 0.6}s` }} />
        ))}
        <text x={214} y={134} fontSize={14} fontWeight={700} fill={orange} className="mawl-pop" style={{ animationDelay: "2.2s" }}>
          {t("Normal.", "Wajar.", lang)}
        </text>
      </svg>
    );
  }
  if (phase === "watch") {
    const skills = lang === "id"
      ? ["Menyalakan", "Mengerem", "Mengarahkan", "Tanjakan", "Aturan jalan"]
      : ["Start", "Brake", "Steer", "Hills", "Road rules"];
    return (
      <svg viewBox="0 0 320 150" width="100%" style={{ maxWidth: 360, display: "block" }} aria-hidden="true">
        <Person x={36} y={128} color={navy} dashed s={0.75} style={{ opacity: 0.6 }} />
        <Person x={100} y={128} color={learner} />
        {skills.map((s, i) => (
          <g key={s}>
            <rect x={160} y={10 + i * 27} width={18} height={18} rx={3} fill="none" stroke={muted} strokeWidth={1.5} />
            <path d={`M ${164} ${19 + i * 27} l 4 4 l 7 -8`} fill="none" stroke={orange} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="mawl-pop" style={{ animationDelay: `${0.4 + i * 0.5}s` }} />
            <text x={188} y={24 + i * 27} fontSize={14} fill={navy}>{s}</text>
          </g>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 150" width="100%" style={{ maxWidth: 360, display: "block" }} aria-hidden="true">
      <defs>
        <marker id="mawl-scene-arrow2" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={orange} />
        </marker>
      </defs>
      <Person x={52} y={128} color={navy} dashed s={0.9} className="mawl-fadeout" />
      <g className="mawl-pop" style={{ animationDelay: "0.3s" }}>
        <rect x={8} y={14} width={104} height={32} rx={8} fill={white} stroke={lightGray} strokeWidth={1.5} />
        <text x={60} y={35} textAnchor="middle" fontSize={14} fontWeight={600} fill={navy}>
          {t("It's yours.", "Ini milik Anda.", lang)}
        </text>
      </g>
      <Person x={158} y={128} color={learner} s={1.1} />
      <line x1={190} y1={100} x2={236} y2={100} stroke={orange} strokeWidth={2} markerEnd="url(#mawl-scene-arrow2)" className="mawl-pop" style={{ animationDelay: "1.6s" }} />
      <Person x={270} y={128} color={muted} s={0.8} className="mawl-pop" style={{ animationDelay: "2s" }} />
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
    <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: 420, display: "block", margin: "0 auto" }} aria-hidden="true">
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

// ─── Generations ──────────────────────────────────────────────────────────────
const GEN_STEPS = [
  {
    labelEn: "Gen 1", labelId: "Gen 1",
    en: "You train Ana, a nurse in Cebu, to lead a health-education group for mothers. You model, assist, watch and launch.",
    id: "Anda melatih Ana, seorang perawat di Cebu, untuk memimpin kelompok penyuluhan kesehatan bagi para ibu. Anda meneladani, membantu, mengamati, lalu memandirikannya.",
  },
  {
    labelEn: "Gen 2", labelId: "Gen 2",
    en: "Ana trains Joel with the same four phases. You are not in the room. Your job now is to watch whether Ana passes on the cycle, not only the skill.",
    id: "Ana melatih Joel dengan empat tahap yang sama. Anda tidak berada di ruangan. Tugas Anda sekarang adalah mengamati apakah Ana meneruskan siklusnya, bukan hanya keterampilannya.",
  },
  {
    labelEn: "Gen 3", labelId: "Gen 3",
    en: "Joel trains Ria. Others are doing the same alongside them, and you have never met most of them.",
    id: "Joel melatih Ria. Orang-orang lain melakukan hal yang sama di samping mereka, dan sebagian besar dari mereka belum pernah Anda temui.",
  },
  {
    labelEn: "Gen 4", labelId: "Gen 4",
    en: "Ria trains Tomas. The fourth generation is the proof. It shows that the cycle itself was passed on, not just a single skill.",
    id: "Ria melatih Tomas. Generasi keempat adalah buktinya. Ini menunjukkan bahwa siklus itu sendiri yang diteruskan, bukan sekadar satu keterampilan.",
  },
  {
    labelEn: "And beyond", labelId: "Dan seterusnya",
    en: "From here nobody can count, and nobody controls it. That is what a movement looks like: leaders training leaders long after anyone remembers who started it.",
    id: "Dari sini tidak ada yang bisa menghitung, dan tidak ada yang mengendalikannya. Seperti itulah sebuah gerakan: pemimpin melatih pemimpin, lama setelah tidak ada lagi yang ingat siapa yang memulainya.",
  },
];

function GenerationsVisual({ step, lang }: { step: number; lang: Lang }) {
  const rows = [
    { y: 36, xs: [200] },
    { y: 96, xs: [130, 270] },
    { y: 156, xs: [80, 160, 240, 320] },
    { y: 216, xs: [25, 75, 125, 175, 225, 275, 325, 375] },
  ];
  const chain = [{ g: 0, i: 0 }, { g: 1, i: 0 }, { g: 2, i: 1 }, { g: 3, i: 3 }];
  const names = ["Ana", "Joel", "Ria", "Tomas"];
  const isChain = (g: number, i: number) => chain.some(c => c.g === g && c.i === i);
  const vis = (g: number) => (step >= g ? 1 : 0.08);
  return (
    <svg viewBox="0 0 400 290" width="100%" style={{ maxWidth: 480, display: "block", margin: "0 auto" }} aria-hidden="true">
      {rows.slice(1).map((row, g) =>
        row.xs.map((x, i) => {
          const parent = rows[g].xs[Math.floor(i / 2)];
          const onChain = isChain(g, Math.floor(i / 2)) && isChain(g + 1, i);
          return (
            <line key={`${g}-${i}`} x1={parent} y1={rows[g].y} x2={x} y2={row.y} className="mawl-trans"
              stroke={onChain ? orange : lightGray} strokeWidth={onChain ? 3 : 1.5} opacity={vis(g + 1)} />
          );
        })
      )}
      {rows.map((row, g) =>
        row.xs.map((x, i) => (
          <circle key={`n${g}-${i}`} cx={x} cy={row.y} r={g === 3 ? 9 : 12} className="mawl-trans"
            fill={isChain(g, i) ? orange : navy} opacity={vis(g)} />
        ))
      )}
      {chain.map((c, n) => {
        const x = rows[c.g].xs[c.i];
        const y = rows[c.g].y;
        const pos = n === 0 ? { x: x + 20, y: y + 5, a: "start" } : n === 1 ? { x: x - 20, y: y + 5, a: "end" } : n === 2 ? { x: x + 20, y: y + 5, a: "start" } : { x, y: y + 30, a: "middle" };
        return (
          <text key={names[n]} x={pos.x} y={pos.y} textAnchor={pos.a as "start" | "end" | "middle"} fontSize={14} fontWeight={700} fill={navy} className="mawl-trans" opacity={vis(c.g)}>
            {names[n]}
          </text>
        );
      })}
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={`b${i}`} cx={12.5 + i * 25} cy={272} r={4} fill={navy} className="mawl-trans" opacity={step >= 4 ? 0.35 : 0.05} />
      ))}
      <text x={200} y={16} textAnchor="middle" fontSize={14} fill={muted}>{t("You", "Anda", lang)}</text>
    </svg>
  );
}

// ─── Planner ──────────────────────────────────────────────────────────────────
type SkillRow = { skill: string; phase: PhaseKey | null; next: string };
const NEXT_HINT: Record<PhaseKey, { en: string; id: string }> = {
  model: { en: "e.g. Let them sit in next time, then explain your thinking afterwards.", id: "mis. Ajak mereka ikut lain kali, lalu jelaskan cara berpikir Anda sesudahnya." },
  assist: { en: "e.g. Hand it over next week and stay right beside them.", id: "mis. Serahkan minggu depan dan tetaplah di samping mereka." },
  watch: { en: "e.g. Stay out of the room and ask three questions afterwards.", id: "mis. Jangan hadir di ruangan, lalu ajukan tiga pertanyaan sesudahnya." },
  launch: { en: "e.g. Announce the handover and set a monthly friendship call.", id: "mis. Umumkan penyerahannya dan atur telepon persahabatan sebulan sekali." },
};

function LaunchPlanner({ lang }: { lang: Lang }) {
  const uid = useId();
  const [name, setName] = useState("");
  const [rows, setRows] = useState<SkillRow[]>([{ skill: "", phase: null, next: "" }]);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");

  const update = (i: number, patch: Partial<SkillRow>) =>
    setRows(r => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  const counts = PHASE_KEYS.map(k => ({ k, n: rows.filter(r => r.phase === k).length }));

  async function copyPlan() {
    const lines = [
      `${t("Launch plan for", "Rencana pemandirian untuk", lang)}: ${name || "..."}`,
      ...rows.filter(r => r.skill.trim()).map((r, i) =>
        `${i + 1}. ${r.skill} | ${r.phase ? phaseName(r.phase, lang) : "?"} | ${t("Next step", "Langkah berikutnya", lang)}: ${r.next || "..."}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyState("ok");
    } catch {
      setCopyState("fail");
    }
  }

  const input: React.CSSProperties = {
    width: "100%", minHeight: 44, padding: "10px 12px", borderRadius: 6, border: `1px solid ${lightGray}`,
    fontSize: 15, fontFamily: "Montserrat, sans-serif", color: navy, background: white, boxSizing: "border-box",
  };
  const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: navy, margin: "0 0 6px" };

  return (
    <div style={{ background: white, border: `1px solid ${lightGray}`, borderRadius: 8, padding: "24px 20px" }}>
      <label htmlFor={`${uid}-name`} style={label}>{t("Who are you training?", "Siapa yang sedang Anda latih?", lang)}</label>
      <input id={`${uid}-name`} value={name} onChange={e => setName(e.target.value)} style={{ ...input, marginBottom: 20 }}
        placeholder={t("First name", "Nama depan", lang)} />

      {rows.map((row, i) => (
        <fieldset key={i} style={{ border: `1px solid ${lightGray}`, borderRadius: 6, padding: "16px 14px", margin: "0 0 14px" }}>
          <legend style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: orange, padding: "0 6px" }}>
            {t("Skill", "Keterampilan", lang)} {i + 1}
          </legend>
          <label htmlFor={`${uid}-s${i}`} style={label}>{t("Skill their role needs", "Keterampilan yang dibutuhkan perannya", lang)}</label>
          <input id={`${uid}-s${i}`} value={row.skill} onChange={e => update(i, { skill: e.target.value })} style={{ ...input, marginBottom: 12 }}
            placeholder={t("e.g. Running the weekly meeting", "mis. Memimpin rapat mingguan", lang)} />
          <p style={label} id={`${uid}-p${i}`}>{t("Where is this skill today?", "Di tahap mana keterampilan ini sekarang?", lang)}</p>
          <div role="group" aria-labelledby={`${uid}-p${i}`} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {PHASE_KEYS.map(k => (
              <button key={k} type="button" aria-pressed={row.phase === k} onClick={() => update(i, { phase: k })}
                style={{
                  minHeight: 44, padding: "8px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif", border: `1.5px solid ${row.phase === k ? navy : lightGray}`,
                  background: row.phase === k ? navy : white, color: row.phase === k ? white : navy,
                }}>
                {phaseName(k, lang)}
              </button>
            ))}
          </div>
          <label htmlFor={`${uid}-n${i}`} style={label}>{t("One next step", "Satu langkah berikutnya", lang)}</label>
          <textarea id={`${uid}-n${i}`} value={row.next} onChange={e => update(i, { next: e.target.value })} rows={2}
            style={{ ...input, resize: "vertical" }}
            placeholder={row.phase ? t(NEXT_HINT[row.phase].en, NEXT_HINT[row.phase].id, lang) : t("Pick a phase first for a suggestion.", "Pilih tahap terlebih dahulu untuk melihat saran.", lang)} />
          {rows.length > 1 && (
            <button type="button" onClick={() => setRows(r => r.filter((_, j) => j !== i))}
              style={{ marginTop: 8, minHeight: 44, background: "none", border: "none", color: muted, fontSize: 13, textDecoration: "underline", cursor: "pointer", padding: 0, fontFamily: "Montserrat, sans-serif" }}>
              {t("Remove this skill", "Hapus keterampilan ini", lang)}
            </button>
          )}
        </fieldset>
      ))}

      {rows.length < 5 && (
        <button type="button" onClick={() => setRows(r => [...r, { skill: "", phase: null, next: "" }])}
          style={{ minHeight: 44, padding: "10px 18px", borderRadius: 8, border: `1.5px dashed ${navy}`, background: "transparent", color: navy, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Montserrat, sans-serif", marginBottom: 20 }}>
          + {t("Add a skill", "Tambah keterampilan", lang)} ({rows.length}/5)
        </button>
      )}

      <div style={{ ...callout, marginBottom: 16 }}>
        <p style={{ ...label, marginBottom: 8 }}>{t("Your picture so far", "Gambaran Anda sejauh ini", lang)}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
          {counts.map(({ k, n }) => (
            <span key={k} style={{ fontSize: 14, color: bodyText }}>
              <strong style={{ color: navy }}>{phaseName(k, lang)}</strong>: {n}
            </span>
          ))}
        </div>
        {counts[0].n + counts[1].n > 2 && (
          <p style={{ ...p, fontSize: 14, margin: "10px 0 0" }}>
            {t("Most skills are still close to you. Pick one to move forward this month, not all of them.",
              "Sebagian besar keterampilan masih dekat dengan Anda. Pilih satu untuk digerakkan bulan ini, bukan semuanya.", lang)}
          </p>
        )}
      </div>

      <button type="button" onClick={copyPlan}
        style={{ minHeight: 44, padding: "10px 20px", borderRadius: 8, border: "none", background: orange, color: white, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
        {t("Copy my plan", "Salin rencana saya", lang)}
      </button>
      <span aria-live="polite" style={{ marginLeft: 12, fontSize: 13.5, color: muted }}>
        {copyState === "ok" && t("Copied.", "Tersalin.", lang)}
        {copyState === "fail" && t("Could not copy. Select the text and copy it yourself.", "Gagal menyalin. Pilih teksnya dan salin sendiri.", lang)}
      </span>
      <p style={{ ...p, fontSize: 13, color: muted, margin: "14px 0 0" }}>
        {t("Nothing here is saved or sent. It stays on this page until you leave.", "Tidak ada yang disimpan atau dikirim. Semuanya hanya ada di halaman ini sampai Anda pergi.", lang)}
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
  const [genStep, setGenStep] = useState(0);
  const [researchOpen, setResearchOpen] = useState(false);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard(SLUG);
      setSaved(true);
    });
  }

  const ph = PHASES[phase];
  const research = (lang === "id" ? RESEARCH_ID : RESEARCH_EN).split("\n\n");

  const riderSkills: { en: string; id: string; phase: PhaseKey }[] = [
    { en: "Starting the engine", id: "Menyalakan mesin", phase: "launch" },
    { en: "Braking", id: "Mengerem", phase: "watch" },
    { en: "Steering through traffic", id: "Mengarahkan di tengah lalu lintas", phase: "watch" },
    { en: "Steep hills", id: "Tanjakan curam", phase: "assist" },
    { en: "Road rules in a busy city", id: "Aturan jalan di kota yang ramai", phase: "model" },
  ];

  const mistakes = [
    {
      en: "Skipping Assist.", id: "Melewatkan Bantu.",
      dEn: "You show it once and say \"over to you\". Most people fall without someone beside them and decide they are not cut out for it.",
      dId: "Anda menunjukkannya sekali lalu berkata \"silakan\". Kebanyakan orang jatuh tanpa ada yang mendampingi, lalu menyimpulkan bahwa mereka tidak cocok untuk tugas itu.",
    },
    {
      en: "Staying in Assist too long.", id: "Terlalu lama di tahap Bantu.",
      dEn: "Help turns into control. They stop thinking because you will fix it anyway.",
      dId: "Bantuan berubah menjadi kendali. Mereka berhenti berpikir karena toh Anda yang akan memperbaikinya.",
    },
    {
      en: "Never leaving Watch.", id: "Tidak pernah keluar dari tahap Amati.",
      dEn: "Your check-ins become an approval step they cannot move without.",
      dId: "Pemantauan Anda berubah menjadi izin yang harus mereka tunggu sebelum bisa bergerak.",
    },
    {
      en: "Launching without checking the whole skill set.", id: "Memandirikan tanpa memeriksa seluruh keterampilan.",
      dEn: "They can run the meeting but have never handled a conflict in it. The gap shows up at the worst moment.",
      dId: "Mereka bisa memimpin rapat, tetapi belum pernah menangani konflik di dalamnya. Celah itu muncul di saat yang paling buruk.",
    },
    {
      en: "Stopping at one generation.", id: "Berhenti di satu generasi.",
      dEn: "You trained a leader who does not train anyone. The work ends with them.",
      dId: "Anda melatih seorang pemimpin yang tidak melatih siapa pun. Pekerjaan itu berhenti pada dirinya.",
    },
  ];

  const prompts: { k: PhaseKey; en: string; id: string }[] = [
    { k: "model", en: "What do you do every week that nobody has seen up close?", id: "Apa yang Anda lakukan setiap minggu yang belum pernah dilihat orang lain dari dekat?" },
    { k: "assist", en: "Who did you take a task back from after one mistake?", id: "Dari siapa Anda mengambil kembali sebuah tugas setelah satu kesalahan?" },
    { k: "watch", en: "Who could do the work but waits for your approval?", id: "Siapa yang sebenarnya mampu bekerja, tetapi masih menunggu persetujuan Anda?" },
    { k: "launch", en: "Which role would be hardest to give away, and what does that tell you?", id: "Peran mana yang paling sulit Anda serahkan, dan apa artinya itu bagi Anda?" },
  ];

  const takeaways = [
    { en: "The leader is often the bottleneck. If your team waits for you, look at your own habits first.", id: "Pemimpin sering kali menjadi penghambat. Jika tim Anda menunggu Anda, periksa dulu kebiasaan Anda sendiri." },
    { en: "Model briefly, assist closely, watch for a long time, then launch.", id: "Teladani dengan singkat, bantu dari dekat, amati dalam waktu lama, lalu mandirikan." },
    { en: "Work skill by skill. One person can be in all four phases at once.", id: "Bekerjalah keterampilan demi keterampilan. Satu orang bisa berada di keempat tahap sekaligus." },
    { en: "Falls in Assist are normal. Show it again, then hand it straight back.", id: "Jatuh di tahap Bantu itu wajar. Contohkan lagi, lalu segera serahkan kembali." },
    { en: "Watch through to the fourth generation. The cycle itself is the last skill you pass on.", id: "Amati hingga generasi keempat. Siklus itu sendiri adalah keterampilan terakhir yang Anda teruskan." },
  ];

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
          <h2 style={h2}>{t("Why your team is still waiting", "Mengapa tim Anda masih menunggu", lang)}</h2>
          <p style={p}>{t(
            "Many leaders say they want their people to step up. Then they keep running the meeting, answering every question and fixing each mistake before anyone else sees it. The team learns the lesson quickly: wait, and the leader will do it.",
            "Banyak pemimpin berkata mereka ingin orang-orangnya maju. Lalu mereka tetap memimpin setiap rapat, menjawab setiap pertanyaan, dan memperbaiki setiap kesalahan sebelum orang lain melihatnya. Tim dengan cepat menangkap pelajarannya: tunggu saja, nanti pemimpin yang mengerjakan.", lang)}</p>
          <p style={p}>{t(
            "Think back to how you learned to ride a motorbike or a bicycle. Someone showed you how. Then they held the seat while you wobbled. Then they stood by the road and called out advice. One day you rode off and they were no longer there. Four phases, and in each one the teacher did less.",
            "Ingat kembali bagaimana Anda belajar mengendarai sepeda motor atau sepeda. Seseorang menunjukkan caranya. Lalu ia memegangi jok sementara Anda oleng. Lalu ia berdiri di pinggir jalan dan meneriakkan saran. Suatu hari Anda melaju sendiri dan ia tidak ada lagi di sana. Empat tahap, dan di setiap tahap sang pengajar semakin sedikit terlibat.", lang)}</p>
          <p style={p}>{t(
            "The pattern is old. Jesus used it with his disciples, and Paul used it in city after city.",
            "Pola ini sudah lama ada. Yesus memakainya bersama murid-murid-Nya, dan Paulus memakainya dari kota ke kota.", lang)}<Sup n="¹" />{t(
            " This module walks through the four phases, shows where leaders get stuck, and helps you plan the next step for the people you are training.",
            " Modul ini membahas keempat tahap, menunjukkan di mana pemimpin sering tersangkut, dan menolong Anda merencanakan langkah berikutnya bagi orang-orang yang sedang Anda latih.", lang)}</p>
          <figure style={{ margin: "32px 0 0" }}>
            <img
              src={`/images/resources/${SLUG}/cycle-${lang}.webp`}
              alt={t("Illustration of the four-phase training cycle: Model, Assist, Watch and Launch, with the leader stepping back at each phase.",
                "Ilustrasi siklus pelatihan empat tahap: Teladani, Bantu, Amati, dan Mandirikan, dengan pemimpin semakin mundur di setiap tahap.", lang)}
              width={1280} height={985}
              style={{ width: "100%", height: "auto", borderRadius: 8, display: "block", background: white }}
            />
          </figure>
        </div>
      </section>

      {/* ── 3. THE CYCLE ────────────────────────────────────────────────────── */}
      <section style={{ ...section, background: white }}>
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
            style={{ border: `1px solid ${lightGray}`, borderRadius: 8, padding: "24px 20px", background: offWhite }}>
            <h3 style={h3}>{phaseName(phase, lang)}: {t(ph.shortEn, ph.shortId, lang)}</h3>
            <div key={`${phase}-${lang}`} style={{ margin: "8px 0 16px" }}>
              <PhaseScene phase={phase} lang={lang} />
            </div>
            <p style={p}>{t(ph.bodyEn, ph.bodyId, lang)}</p>
            <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, margin: 0 }}>
              {[
                { l: t("Who does the work", "Siapa yang mengerjakan", lang), v: t(ph.whoEn, ph.whoId, lang) },
                { l: t("Your role", "Peran Anda", lang), v: t(ph.roleEn, ph.roleId, lang) },
                { l: t("How long", "Berapa lama", lang), v: t(ph.longEn, ph.longId, lang) },
                { l: t("Watch out", "Waspadai", lang), v: t(ph.riskEn, ph.riskId, lang) },
              ].map(c => (
                <div key={c.l} style={{ background: white, borderRadius: 6, padding: "12px 14px", border: `1px solid ${lightGray}` }}>
                  <dt style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: 6 }}>{c.l}</dt>
                  <dd style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: navy }}>{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* How your role shifts */}
          <h3 style={{ ...h3, marginTop: 48 }}>{t("How your role shifts", "Bagaimana peran Anda bergeser", lang)}</h3>
          <p style={p}>{t(
            "Your involvement falls as their ownership grows. The phases are also very different in length. Model is short. Watch is long.",
            "Keterlibatan Anda menurun seiring bertumbuhnya rasa kepemilikan mereka. Panjang setiap tahap juga sangat berbeda. Teladani singkat. Amati panjang.", lang)}</p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13, color: bodyText, marginBottom: 14 }}>
            <span><span aria-hidden="true" style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: navy, marginRight: 6, verticalAlign: "middle" }} />{t("Your involvement", "Keterlibatan Anda", lang)}</span>
            <span><span aria-hidden="true" style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: orange, marginRight: 6, verticalAlign: "middle" }} />{t("Their ownership", "Kepemilikan mereka", lang)}</span>
          </div>
          <div>
            {PHASE_KEYS.map(k => {
              const d = PHASES[k];
              const active = k === phase;
              return (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "96px 1fr", alignItems: "center", gap: 12, marginBottom: 12, opacity: active ? 1 : 0.6 }} className="mawl-trans">
                  <span style={{ fontSize: 14, fontWeight: 700, color: navy }}>{phaseName(k, lang)}</span>
                  <div>
                    <div role="img" aria-label={`${t("Your involvement", "Keterlibatan Anda", lang)} ${d.involvement}%`} style={{ height: 10, background: lightGray, borderRadius: 5, marginBottom: 5 }}>
                      <div className="mawl-trans" style={{ width: `${d.involvement}%`, height: "100%", background: navy, borderRadius: 5 }} />
                    </div>
                    <div role="img" aria-label={`${t("Their ownership", "Kepemilikan mereka", lang)} ${d.ownership}%`} style={{ height: 10, background: lightGray, borderRadius: 5 }}>
                      <div className="mawl-trans" style={{ width: `${d.ownership}%`, height: "100%", background: orange, borderRadius: 5 }} />
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* ── 4. SKILL BY SKILL ───────────────────────────────────────────────── */}
      <section id="mc-four-stages" style={section}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Skill by skill", "Keterampilan demi keterampilan", lang)}</p>
          <h2 style={h2}>{t("Nobody is in one phase for a whole role", "Tidak ada yang berada di satu tahap untuk seluruh perannya", lang)}</h2>
          <p style={p}>{t(
            "Go back to the new rider. On the same afternoon they can be in Launch for starting the engine, Watch for braking and Assist on steep hills, while you still model the road rules in a busy city. A team leader is the same. They may run meetings on their own and still need you beside them for a hard conversation. Readiness belongs to the task, not the person.",
            "Kembali ke pengendara baru tadi. Pada sore yang sama ia bisa berada di tahap Mandirikan untuk menyalakan mesin, Amati untuk mengerem, dan Bantu di tanjakan curam, sementara Anda masih meneladankan aturan jalan di kota yang ramai. Seorang pemimpin tim pun sama. Ia mungkin sudah bisa memimpin rapat sendiri, tetapi masih membutuhkan Anda di sampingnya untuk percakapan yang sulit. Kesiapan melekat pada tugas, bukan pada orangnya.", lang)}<Sup n="²" /></p>
          <div style={{ background: white, border: `1px solid ${lightGray}`, borderRadius: 8, overflow: "hidden", margin: "20px 0 24px" }}>
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

      {/* ── 5. SHADOW LEADERSHIP ────────────────────────────────────────────── */}
      <section style={{ ...section, background: white }}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Leading from the shadows", "Memimpin dari balik layar", lang)}</p>
          <h2 style={h2}>{t("Put them in the spotlight", "Tempatkan mereka di bawah sorotan", lang)}</h2>
          <figure style={{ margin: "8px 0 20px" }}>
            <svg viewBox="0 0 400 200" width="100%" style={{ maxWidth: 440, display: "block", margin: "0 auto" }} aria-hidden="true">
              <rect x={0} y={0} width={400} height={200} rx={8} fill={navy} />
              <path d="M 230 0 L 290 0 L 330 178 L 190 178 Z" fill={orange} opacity={0.28} />
              <ellipse cx={260} cy={180} rx={72} ry={10} fill={orange} opacity={0.35} />
              <Person x={260} y={166} color={orange} s={1.2} />
              <Person x={80} y={170} color="oklch(60% 0.05 260)" dashed s={1} />
              <text x={260} y={196} textAnchor="middle" fontSize={14} fontWeight={700} fill={offWhite}>{t("Them", "Mereka", lang)}</text>
              <text x={80} y={196} textAnchor="middle" fontSize={14} fill="oklch(75% 0.04 260)">{t("You", "Anda", lang)}</text>
            </svg>
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

      {/* ── 6. SCENARIOS ────────────────────────────────────────────────────── */}
      <section style={section}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Practice", "Latihan", lang)}</p>
          <h2 style={h2}>{t("Which phase is this?", "Tahap apakah ini?", lang)}</h2>
          <p style={p}>{t("Five leaders in five cities. Pick the phase each one is in right now.", "Lima pemimpin di lima kota. Pilih tahap yang sedang dijalani masing-masing saat ini.", lang)}</p>
          {SCENARIOS.map((s, i) => <ScenarioCard key={s.placeEn} s={s} index={i} lang={lang} />)}

          <h3 style={{ ...h3, marginTop: 40 }}>{t("Where the cycle breaks", "Di mana siklus ini macet", lang)}</h3>
          <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {mistakes.map((m, i) => (
              <li key={m.en} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 10, marginBottom: 14 }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 600, color: orange, lineHeight: 1.1 }}>{i + 1}</span>
                <p style={{ ...p, margin: 0 }}><strong style={{ color: navy }}>{t(m.en, m.id, lang)}</strong> {t(m.dEn, m.dId, lang)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 7. GENERATIONS ──────────────────────────────────────────────────── */}
      <section style={{ ...section, background: white }}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Generations", "Generasi", lang)}</p>
          <h2 style={h2}>{t("Launch starts the next cycle", "Mandirikan memulai siklus berikutnya", lang)}</h2>
          <p style={p}>{t(
            "Launch is not the end. The person you launched now models the same work for someone else. Step through to see what happens.",
            "Mandirikan bukanlah akhir. Orang yang Anda mandirikan kini meneladankan pekerjaan yang sama bagi orang lain. Ikuti langkah demi langkah untuk melihat apa yang terjadi.", lang)}</p>
          <div role="group" aria-label={t("Generations", "Generasi", lang)} style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0 20px" }}>
            {GEN_STEPS.map((g, i) => (
              <button key={g.labelEn} type="button" aria-pressed={genStep === i} aria-controls="mawl-gen-text" onClick={() => setGenStep(i)}
                style={{
                  minHeight: 44, padding: "8px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif", border: `1.5px solid ${genStep === i ? orange : lightGray}`,
                  background: genStep === i ? orange : white, color: genStep === i ? white : navy,
                }}>
                {t(g.labelEn, g.labelId, lang)}
              </button>
            ))}
          </div>
          <figure style={{ margin: 0 }}>
            <GenerationsVisual step={genStep} lang={lang} />
            <figcaption style={{ fontSize: 13, color: muted, textAlign: "center", marginTop: 8 }}>
              {t("Each leader trains others. The orange line follows one chain from Ana to Tomas.", "Setiap pemimpin melatih orang lain. Garis oranye mengikuti satu rantai dari Ana hingga Tomas.", lang)}
            </figcaption>
          </figure>
          <p id="mawl-gen-text" aria-live="polite" style={{ ...p, marginTop: 20, minHeight: 84 }}>
            {t(GEN_STEPS[genStep].en, GEN_STEPS[genStep].id, lang)}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" disabled={genStep === 0} onClick={() => setGenStep(s => Math.max(0, s - 1))}
              style={{ minHeight: 44, padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${lightGray}`, background: white, color: navy, fontWeight: 600, cursor: genStep === 0 ? "default" : "pointer", opacity: genStep === 0 ? 0.4 : 1, fontFamily: "Montserrat, sans-serif" }}>
              {t("Back", "Kembali", lang)}
            </button>
            <button type="button" disabled={genStep === GEN_STEPS.length - 1} onClick={() => setGenStep(s => Math.min(GEN_STEPS.length - 1, s + 1))}
              style={{ minHeight: 44, padding: "8px 18px", borderRadius: 8, border: "none", background: navy, color: white, fontWeight: 600, cursor: genStep === GEN_STEPS.length - 1 ? "default" : "pointer", opacity: genStep === GEN_STEPS.length - 1 ? 0.4 : 1, fontFamily: "Montserrat, sans-serif" }}>
              {t("Next", "Lanjut", lang)}
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. PLANNER ──────────────────────────────────────────────────────── */}
      <section style={section}>
        <div style={wrap}>
          <p style={eyebrow}>{t("Your plan", "Rencana Anda", lang)}</p>
          <h2 style={h2}>{t("My Launch Planner", "Perencana Pemandirian Saya", lang)}</h2>
          <p style={p}>{t(
            "Pick one person you are training. List up to five skills their role needs, mark where each one is today, and write one next step for each. Run the cycle skill by skill.",
            "Pilih satu orang yang sedang Anda latih. Tuliskan hingga lima keterampilan yang dibutuhkan perannya, tandai posisi masing-masing saat ini, lalu tulis satu langkah berikutnya untuk setiap keterampilan. Jalankan siklusnya keterampilan demi keterampilan.", lang)}</p>
          <LaunchPlanner lang={lang} />
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
          <p style={{ ...p, color: "oklch(85% 0.02 260)" }}>{t(
            "Paul did not hand the elders a manual. He handed them to God. Launch is an act of trust in God as much as in people. Paul kept writing and praying for the churches he had left, but he did not take them back.",
            "Paulus tidak menyerahkan buku panduan kepada para penatua. Ia menyerahkan mereka kepada Tuhan. Memandirikan adalah tindakan percaya kepada Tuhan, sama seperti percaya kepada manusia. Paulus terus menulis surat dan mendoakan jemaat-jemaat yang ia tinggalkan, tetapi ia tidak mengambil alih mereka kembali.", lang)}</p>
          <blockquote style={{ margin: "0 0 16px", padding: "20px 22px", background: "oklch(28% 0.10 260)", borderRadius: 6 }}>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 21, fontStyle: "italic", lineHeight: 1.5, color: offWhite, margin: "0 0 8px" }}>
              {t("\"And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.\"",
                "\"Apa yang telah engkau dengar dari padaku di depan banyak saksi, percayakanlah itu kepada orang-orang yang dapat dipercayai, yang juga cakap mengajar orang lain.\"", lang)}
            </p>
            <cite style={{ fontSize: 13, fontStyle: "normal", color: orange, fontWeight: 700 }}>{t("2 Timothy 2:2 (NIV)", "2 Timotius 2:2 (TB)", lang)}</cite>
          </blockquote>
          <p style={{ ...p, color: "oklch(85% 0.02 260)", margin: 0 }}>{t(
            "Four generations in one verse: Paul, Timothy, reliable people, and others. The finish line is not the first person you train. It is the fourth.",
            "Empat generasi dalam satu ayat: Paulus, Timotius, orang-orang yang dapat dipercaya, dan orang lain. Garis akhirnya bukan orang pertama yang Anda latih, melainkan orang keempat.", lang)}</p>
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
        "The Holy Bible, New International Version (2011) and Alkitab Terjemahan Baru (LAI): Mark 3:14; Luke 9-10; Acts 17:2, 18:11, 20:17-38; 2 Timothy 2:2.",
      ]} lang={lang} markerStyle="superscript" />
    </div>
  );
}
