"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

const NAVY = "oklch(22% 0.10 260)";
const ORANGE = "oklch(65% 0.15 45)";
const OFF_WHITE = "oklch(96% 0.005 80)";
const BODY_TEXT = "oklch(38% 0.05 260)";
const MUTED = "oklch(55% 0.008 260)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";

type Lang = "en" | "id";
type DisguiseKey = "fear" | "perf" | "overwhelm";

function t(en: string, id: string, lang: Lang) {
  return lang === "id" ? id : en;
}

const QUESTIONS: { en: string; id: string; group: DisguiseKey }[] = [
  { group: "fear", en: "I delay starting because I'm worried the result won't be good enough.", id: "Saya menunda memulai karena khawatir hasilnya tidak cukup baik." },
  { group: "fear", en: "I feel more anxious about failing than motivated to succeed.", id: "Saya merasa lebih cemas terhadap kegagalan daripada termotivasi untuk berhasil." },
  { group: "fear", en: "I tell myself I need more preparation before I can really begin.", id: "Saya merasa perlu lebih banyak persiapan sebelum benar-benar bisa memulai." },
  { group: "perf", en: "I find myself restarting or revising work that was already adequate.", id: "Saya sering memulai ulang atau merevisi pekerjaan yang sebenarnya sudah cukup baik." },
  { group: "perf", en: "I wait until conditions are ideal before beginning anything important.", id: "Saya menunggu kondisi ideal sebelum memulai sesuatu yang penting." },
  { group: "perf", en: "If I can't do something well, I'd rather not do it at all.", id: "Jika tidak bisa melakukannya dengan baik, lebih baik tidak melakukannya sama sekali." },
  { group: "overwhelm", en: "When a task feels large or unclear, I drift to smaller, easier things instead.", id: "Ketika sebuah tugas terasa besar atau tidak jelas, saya beralih ke hal-hal yang lebih mudah." },
  { group: "overwhelm", en: "I struggle to identify where to start, so I don't start at all.", id: "Saya kesulitan menentukan dari mana harus memulai, sehingga akhirnya tidak memulai." },
  { group: "overwhelm", en: "Important tasks tend to pile up because I'm waiting to feel ready.", id: "Tugas-tugas penting cenderung menumpuk karena saya menunggu sampai merasa siap." },
];

const SCALE: { en: string; id: string }[] = [
  { en: "Rarely", id: "Jarang" },
  { en: "Sometimes", id: "Kadang" },
  { en: "Often", id: "Sering" },
];


type Strategy = { title: { en: string; id: string }; body: { en: string; id: string } };
type DisguiseData = {
  label: { en: string; id: string };
  color: string;
  intro: { en: string; id: string };
  strategies: Strategy[];
};

const DISGUISES: Record<DisguiseKey, DisguiseData> = {
  fear: {
    label: { en: "Fear of Failure", id: "Takut Gagal" },
    color: "oklch(42% 0.14 260)",
    intro: {
      en: "Avoidance is a protection strategy. It works in the short term: when the emotional cost of risking failure feels higher than the cost of not trying, the rational move is to not try. The problem compounds. The longer you wait, the more loaded the task becomes — and the more your sense of self gets entangled with whether you can finally do it well.",
      id: "Penghindaran adalah strategi perlindungan. Itu berhasil dalam jangka pendek: ketika biaya emosional dari risiko kegagalan terasa lebih tinggi dari biaya tidak mencoba, keputusan yang masuk akal adalah tidak mencoba. Masalahnya terus bertambah. Semakin lama kamu menunggu, semakin berat beban tugasnya — dan semakin dalam keterkaitannya dengan rasa dirimu.",
    },
    strategies: [
      {
        title: { en: "Name what you're protecting yourself from", id: "Beri nama apa yang sedang kamu lindungi" },
        body: {
          en: "Ask yourself: 'What am I actually afraid will happen if this doesn't go well?' Usually the answer is judgment, disappointment, or proof of inadequacy. Name it precisely. A fear named clearly loses some of its power to govern your behaviour — because you can now respond to the actual fear rather than to the fog of avoidance.",
          id: "Tanyakan pada dirimu: 'Apa yang sebenarnya aku takutkan akan terjadi jika ini tidak berjalan baik?' Biasanya jawabannya adalah penilaian, kekecewaan, atau bukti ketidakcukupan. Beri nama dengan tepat. Ketakutan yang sudah diberi nama kehilangan sebagian kekuatannya — karena sekarang kamu bisa merespons ketakutan yang sebenarnya, bukan kabut penghindaran.",
        },
      },
      {
        title: { en: "Define done, not perfect", id: "Tentukan 'selesai', bukan 'sempurna'" },
        body: {
          en: "Before you begin any task, write down in one sentence what 'done' looks like. Not 'excellent.' Not 'impressive.' What is the minimum acceptable version of this task? An imperfect thing that exists is infinitely more useful than a perfect thing that doesn't. Set the bar at completion.",
          id: "Sebelum memulai tugas apapun, tuliskan dalam satu kalimat seperti apa 'selesai' itu. Bukan 'luar biasa.' Bukan 'mengesankan.' Apa versi minimum yang bisa diterima dari tugas ini? Sesuatu yang tidak sempurna tapi ada jauh lebih berguna dari sesuatu yang sempurna tapi tidak ada. Tetapkan standar pada penyelesaian.",
        },
      },
      {
        title: { en: "Faithfulness, not success", id: "Kesetiaan, bukan kesuksesan" },
        body: {
          en: "In Matthew 25, the third servant buried his talent because he was afraid. His failure was not the absence of profit — it was the choice of inaction over faithfulness. The master did not ask for guaranteed returns. He asked for engagement. Your calling is not to guarantee a good outcome. It is to show up with what you have been given.",
          id: "Dalam Matius 25, hamba ketiga mengubur talentanya karena ia takut. Kegagalannya bukan ketiadaan keuntungan — melainkan memilih ketidakaktifan daripada kesetiaan. Sang tuan tidak meminta hasil yang dijamin. Dia meminta keterlibatan. Panggilanmu bukan menjamin hasil yang baik. Melainkan hadir dengan apa yang telah diberikan kepadamu.",
        },
      },
    ],
  },
  perf: {
    label: { en: "Perfectionism", id: "Perfeksionisme" },
    color: "oklch(44% 0.14 300)",
    intro: {
      en: "Perfectionism wears virtue as a disguise. It presents as high standards, diligence, care. But the diagnostic question is not 'are my standards high?' — it is 'are my standards preventing me from beginning?' High standards that produce inaction are not a virtue. They are a protection strategy. Perfectionism's core logic: if I never fully start, I can never officially fail.",
      id: "Perfeksionisme menyamar sebagai kebajikan. Ia tampil sebagai standar tinggi, ketekunan, kepedulian. Tapi pertanyaan diagnostiknya bukan 'apakah standarku tinggi?' — melainkan 'apakah standarku mencegahku untuk memulai?' Standar tinggi yang menghasilkan ketidakaktifan bukan kebajikan. Itu adalah strategi perlindungan. Logika inti perfeksionisme: jika tidak pernah benar-benar memulai, tidak bisa secara resmi gagal.",
    },
    strategies: [
      {
        title: { en: "Set the minimum viable standard first", id: "Tetapkan standar minimum terlebih dahulu" },
        body: {
          en: "Before you open any file, write down what 'done' looks like — not 'polished', not 'ready to present', just complete. All sections covered. Everything included once, imperfectly. Write this before you begin. Once a baseline exists, you can improve it. You cannot improve a blank page.",
          id: "Sebelum membuka file apapun, tuliskan seperti apa 'selesai' itu — bukan 'rapi', bukan 'siap presentasi', hanya lengkap. Semua bagian tercakup. Semuanya termasuk sekali, tidak sempurna. Tuliskan ini sebelum memulai. Setelah ada basis, kamu bisa memperbaikinya. Kamu tidak bisa memperbaiki halaman kosong.",
        },
      },
      {
        title: { en: "The 15-minute draft rule", id: "Aturan draft 15 menit" },
        body: {
          en: "Set a timer for 15 minutes. Write, design, or build something — anything — before the timer ends. It will not be your best work. That is exactly the point. An imperfect draft that exists gives you something to improve. The Zeigarnik effect guarantees your brain will pull toward completion once it has started. Perfectionism thrives on blankness.",
          id: "Atur timer selama 15 menit. Tulis, desain, atau bangun sesuatu — apa saja — sebelum timer berakhir. Itu tidak akan menjadi karya terbaikmu. Itulah intinya. Draft tidak sempurna yang ada memberimu sesuatu untuk diperbaiki. Efek Zeigarnik menjamin otakmu akan menarik ke arah penyelesaian begitu sudah dimulai. Perfeksionisme berkembang dalam kekosongan.",
        },
      },
      {
        title: { en: "Grace is the structural solution", id: "Kasih karunia adalah solusi struktural" },
        body: {
          en: "Perfectionism has a theological root: identity built on performance. If what I produce defines who I am, then producing something imperfect is an existential threat. Grace removes the stakes from performance. You are not defined by what you complete. When the outcome no longer determines your worth, you are free to begin.",
          id: "Perfeksionisme memiliki akar teologis: identitas yang dibangun di atas kinerja. Jika apa yang aku hasilkan mendefinisikan siapa aku, maka menghasilkan sesuatu yang tidak sempurna adalah ancaman eksistensial. Kasih karunia menghilangkan taruhan dari kinerja. Kamu tidak didefinisikan oleh apa yang kamu selesaikan. Ketika hasil tidak lagi menentukan nilaimu, kamu bebas untuk memulai.",
        },
      },
    ],
  },
  overwhelm: {
    label: { en: "Overwhelm", id: "Kewalahan" },
    color: "oklch(48% 0.18 25)",
    intro: {
      en: "When a task is complex, ambiguous, or large, the brain reads it as a threat. The amygdala fires before the prefrontal cortex can assess the actual danger level. The result is task paralysis — not laziness, but a neurological response to perceived threat. Motivation is not the solution. Reducing the perceived scope until the brain no longer registers danger is.",
      id: "Ketika sebuah tugas kompleks, ambigu, atau besar, otak membacanya sebagai ancaman. Amigdala bereaksi sebelum korteks prefrontal bisa menilai tingkat bahaya yang sebenarnya. Hasilnya adalah kelumpuhan tugas — bukan kemalasan, tapi respons neurologis terhadap ancaman yang dirasakan. Motivasi bukan solusinya. Mengurangi cakupan yang dirasakan sampai otak tidak lagi mendeteksi bahaya — itulah solusinya.",
    },
    strategies: [
      {
        title: { en: "Smallest possible first action", id: "Tindakan pertama yang sekecil mungkin" },
        body: {
          en: "Not 'write the report.' Not 'plan the project.' Open the document. Send one email. Look at the brief. The task itself does not shrink — but your relationship to it changes the moment you have started. Research confirms: starting anything, even imperfectly, activates momentum. The Zeigarnik effect means your brain will pull toward completion once it has begun.",
          id: "Bukan 'tulis laporan.' Bukan 'rencanakan proyek.' Buka dokumennya. Kirim satu email. Lihat briefnya. Tugasnya sendiri tidak mengecil — tapi hubunganmu dengannya berubah di saat kamu sudah memulai. Penelitian mengonfirmasi: memulai apapun, meskipun tidak sempurna, mengaktifkan momentum. Efek Zeigarnik berarti otakmu akan menarik ke arah penyelesaian begitu sudah dimulai.",
        },
      },
      {
        title: { en: "If-then planning", id: "Perencanaan jika-maka" },
        body: {
          en: "'I will work on [specific task] on [day] at [time] at [place].' Research across 642 independent tests found this format produced a medium-to-large effect on follow-through (d = 0.65). It bypasses the deliberation phase where procrastination initiates. Once the brain has a concrete trigger, it no longer has to decide whether to begin — it only has to recognise the cue.",
          id: "'Saya akan mengerjakan [tugas spesifik] pada [hari] pukul [waktu] di [tempat].' Penelitian lintas 642 uji independen menemukan format ini menghasilkan efek signifikan pada tindak lanjut (d = 0,65). Ini melewati fase deliberasi tempat penundaan dimulai. Begitu otak memiliki pemicu yang konkret, ia tidak lagi harus memutuskan apakah akan mulai — hanya perlu mengenali isyaratnya.",
        },
      },
      {
        title: { en: "The ant principle: prepare before you need to", id: "Prinsip semut: bersiap sebelum dibutuhkan" },
        body: {
          en: "Proverbs 6:6-8 commends the ant's approach: proactive preparation without external compulsion. Applied: when you are not yet overwhelmed, break the task into its smallest components and write them down. When overwhelm arrives, you already have a starting point. Preparation during calm prevents paralysis under pressure.",
          id: "Amsal 6:6-8 memuji pendekatan semut: persiapan proaktif tanpa paksaan eksternal. Diterapkan: ketika kamu belum kewalahan, pecah tugasnya menjadi komponen terkecil dan tuliskan. Ketika kewalahan datang, kamu sudah punya titik awal. Persiapan saat tenang mencegah kelumpuhan saat tertekan.",
        },
      },
    ],
  },
};

function ProcrastinationLoopSVG({ lang }: { lang: Lang }) {
  const cx = 250, cy = 240, R = 155, r = 42;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const nodeData = [
    { angle: -90, color: NAVY, lines: { en: ["Task", "Arrives"], id: ["Tugas", "Muncul"] } },
    { angle: -90 + 72, color: "oklch(42% 0.18 20)", lines: { en: ["Negative", "Emotion"], id: ["Emosi", "Negatif"] } },
    { angle: -90 + 144, color: "oklch(48% 0.18 25)", lines: { en: ["Avoidance"], id: ["Menghindar"] } },
    { angle: -90 + 216, color: "oklch(42% 0.14 145)", lines: { en: ["Short-Term", "Relief"], id: ["Kelegaan", "Sesaat"] } },
    { angle: -90 + 288, color: "oklch(38% 0.16 310)", lines: { en: ["Guilt &", "Shame"], id: ["Rasa", "Bersalah"] } },
  ].map(n => ({ ...n, x: cx + R * Math.cos(toRad(n.angle)), y: cy + R * Math.sin(toRad(n.angle)) }));

  const arrows = nodeData.map((from, i) => {
    const to = nodeData[(i + 1) % 5];
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len, ny = dy / len;
    return { x1: from.x + r * nx, y1: from.y + r * ny, x2: to.x - (r + 5) * nx, y2: to.y - (r + 5) * ny };
  });

  return (
    <figure style={{ margin: "2rem auto", maxWidth: 460 }}>
      <svg viewBox="0 0 500 480" width="100%" aria-hidden="true" style={{ display: "block" }}>
        <defs>
          <marker id="proc-loop-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={ORANGE} />
          </marker>
        </defs>
        {arrows.map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            stroke={ORANGE} strokeWidth="2" markerEnd="url(#proc-loop-arrow)" />
        ))}
        {nodeData.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={r} fill={n.color} />
            {n.lines[lang].map((line, li) => (
              <text key={li} x={n.x} textAnchor="middle" fill="white" fontSize="10"
                fontFamily="var(--font-montserrat, sans-serif)" fontWeight="700"
                y={n.y + (n.lines[lang].length === 1 ? 4 : li === 0 ? -5 : 9)}>
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
      <figcaption style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: MUTED, textAlign: "center", lineHeight: 1.5, marginTop: "0.5rem" }}>
        {t(
          "The procrastination loop: each avoidance provides short-term relief that reinforces the next avoidance.",
          "Lingkaran penundaan: setiap penghindaran memberikan kelegaan sesaat yang memperkuat penghindaran berikutnya.",
          lang
        )}
        {lang === "id" && (
          <span style={{ display: "block", marginTop: "0.2rem", fontSize: "0.66rem", opacity: 0.75 }}>
            Task Arrives = Tugas Muncul · Negative Emotion = Emosi Negatif · Avoidance = Menghindar · Short-Term Relief = Kelegaan Sesaat · Guilt & Shame = Rasa Bersalah
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export default function OvercomingProcrastinationClient({
  isSaved,
  userId,
}: {
  isSaved: boolean;
  userId: string | null;
}) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;

  const [answers, setAnswers] = useState<number[]>(Array(9).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const [commitAction, setCommitAction] = useState("");
  const [commitDate, setCommitDate] = useState("");
  const [commitTime, setCommitTime] = useState("");
  const [commitPlace, setCommitPlace] = useState("");
  const [reminderStatus, setReminderStatus] = useState<"idle" | "loading" | "set" | "error">("idle");

  function handleAddToCalendar() {
    const start = new Date(`${commitDate}T${commitTime}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: commitAction.trim(),
      dates: `${fmt(start)}/${fmt(end)}`,
      details: "Commitment from Crispy Leaders — Overcoming Procrastination",
      location: commitPlace.trim(),
    });
    window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
  }

  async function handleSetReminder() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    setReminderStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setReminderStatus("error"); return; }

      const reg = await navigator.serviceWorker.ready;
      const rawKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
      const padding = "=".repeat((4 - (rawKey.length % 4)) % 4);
      const base64 = (rawKey + padding).replace(/-/g, "+").replace(/_/g, "/");
      const keyBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      let sub = await reg.pushManager.getSubscription();
      try {
        if (sub) await sub.unsubscribe();
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes });
      } catch {
        if (!sub) throw new Error("Subscription failed");
      }

      const subJson = sub.toJSON() as { endpoint: string; keys?: { p256dh: string; auth: string } };
      const remindAt = new Date(`${commitDate}T${commitTime}`).toISOString();
      const res = await fetch("/api/push/commitment-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: commitAction.trim(),
          remindAt,
          subscription: {
            endpoint: sub.endpoint,
            keys: { p256dh: subJson.keys?.p256dh ?? "", auth: subJson.keys?.auth ?? "" },
          },
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      setReminderStatus("set");
    } catch (err) {
      console.error("[commitment-reminder]", err);
      setReminderStatus("error");
    }
  }

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("overcoming-procrastination");
      setSaved(true);
    });
  }

  function setAnswer(qi: number, val: number) {
    const next = [...answers];
    next[qi] = val;
    setAnswers(next);
    setShowResult(false);
    if (qi < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(qi + 1), 180);
    }
  }

  const allAnswered = answers.every(a => a > 0);

  const fearScore = answers[0] + answers[1] + answers[2];
  const perfScore = answers[3] + answers[4] + answers[5];
  const overwhelmScore = answers[6] + answers[7] + answers[8];

  function getDominant(): DisguiseKey {
    if (fearScore >= perfScore && fearScore >= overwhelmScore) return "fear";
    if (perfScore >= overwhelmScore) return "perf";
    return "overwhelm";
  }

  const dominant = getDominant();
  const disguise = DISGUISES[dominant];

  const commitFilled = commitAction.trim() && commitDate && commitTime && commitPlace.trim();
  const dateDisplay = commitDate
    ? new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${commitDate}T00:00:00`))
    : "";
  const timeDisplay = commitTime
    ? new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(`2000-01-01T${commitTime}`))
    : "";
  const commitmentSentence = commitFilled
    ? t(
        `I will ${commitAction.trim()} on ${dateDisplay} at ${timeDisplay} at ${commitPlace.trim()}.`,
        `Saya akan ${commitAction.trim()} pada ${dateDisplay} pukul ${timeDisplay} di ${commitPlace.trim()}.`,
        lang
      )
    : null;

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.85rem",
    padding: "10px 14px",
    border: `1px solid ${LIGHT_GRAY}`,
    background: "white",
    color: BODY_TEXT,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };

  const sectionH2: React.CSSProperties = {
    fontFamily: "var(--font-cormorant-garamond, 'Cormorant Garamond', serif)",
    fontSize: "clamp(26px, 3.5vw, 40px)",
    fontWeight: 600,
    color: NAVY,
    margin: "0 0 0.75rem",
    lineHeight: 1.15,
  };

  const eyebrow: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: ORANGE,
    margin: "0 0 0.75rem",
  };

  return (
    <div style={{ fontFamily: "var(--font-montserrat)", background: "oklch(97% 0.003 260)", minHeight: "100vh" }}>

      <LangToggle />

      {/* HERO */}
      <section style={{
        position: "relative",
        backgroundImage: "url('/resources/overcoming-procrastination-hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        backgroundColor: NAVY,
      }}>
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.10 260 / 0.82)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "80px 24px 68px" }}>
          <p style={{ ...eyebrow, color: ORANGE }}>
            {t("Personal Growth — Self-Assessment", "Pertumbuhan Pribadi — Penilaian Diri", lang)}
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant-garamond, 'Cormorant Garamond', serif)",
            fontSize: "clamp(38px, 6vw, 68px)",
            fontWeight: 600,
            color: OFF_WHITE,
            margin: "0 0 1.25rem",
            lineHeight: 1.08,
          }}>
            {t("Overcoming Procrastination", "Mengatasi Penundaan", lang)}
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "oklch(78% 0.04 260)", lineHeight: 1.7, maxWidth: 580, marginBottom: "2rem" }}>
            {t(
              "Procrastination is not laziness. It is fear, perfectionism, or overwhelm wearing a mask. This self-assessment helps you identify your pattern — and gives you targeted tools to move through it.",
              "Penundaan bukan kemalasan. Itu adalah ketakutan, perfeksionisme, atau kewalahan yang memakai topeng. Penilaian diri ini membantu kamu mengidentifikasi polamu — dan memberimu alat yang tepat untuk mengatasinya.",
              lang
            )}
          </p>
          {userId && (
            !saved ? (
              <button
                onClick={handleSave}
                disabled={isPending}
                aria-label={t("Save to Dashboard", "Simpan ke Dashboard", lang)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: ORANGE, color: "oklch(15% 0.05 45)",
                  padding: "0 1.5rem", minHeight: 44, border: "none", cursor: "pointer",
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.82rem",
                  letterSpacing: "0.04em",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 2h10a1 1 0 0 1 1 1v11l-6-3-6 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                {isPending ? t("Saving...", "Menyimpan...", lang) : t("Save to Dashboard", "Simpan ke Dashboard", lang)}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "oklch(72% 0.14 145)", fontSize: "0.85rem", fontWeight: 600, minHeight: 44 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("Saved to Dashboard", "Tersimpan di Dashboard", lang)}
              </span>
            )
          )}
        </div>
      </section>

      {/* FRAMING */}
      <section style={{ padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={eyebrow}>{t("The Disguise", "Topengnya", lang)}</p>
          <h2 style={sectionH2}>{t("It's not laziness. It's avoidance.", "Bukan kemalasan. Ini penghindaran.", lang)}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", marginTop: "1.75rem" }}>
            <div>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: "0 0 1.1rem" }}>
                {t(
                  "In 2013, researchers Fuschia Sirois and Timothy Pychyl published what has since become the defining framework for understanding procrastination. Their finding: procrastination is not a time management failure. It is an emotion regulation strategy.",
                  "Pada tahun 2013, peneliti Fuschia Sirois dan Timothy Pychyl menerbitkan kerangka kerja yang sejak saat itu menjadi acuan utama untuk memahami penundaan. Temuan mereka: penundaan bukan kegagalan manajemen waktu. Itu adalah strategi regulasi emosi.",
                  lang
                )}
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: "0 0 1.1rem" }}>
                {t(
                  "When a task triggers anxiety, self-doubt, or dread, the mind finds a way to avoid the discomfort — even if that avoidance creates far greater discomfort later. The short-term relief is real. That is exactly why it works, and why it is so persistent.",
                  "Ketika sebuah tugas memicu kecemasan, keraguan diri, atau rasa gentar, pikiran menemukan cara untuk menghindari ketidaknyamanan itu — meskipun penghindaran itu menciptakan ketidaknyamanan yang jauh lebih besar di kemudian hari. Kelegaan jangka pendek itu nyata. Itulah persis mengapa ini berhasil, dan mengapa ini sangat persisten.",
                  lang
                )}
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                {t(
                  "Three patterns account for most procrastination in leaders and cross-cultural workers: fear of failure, perfectionism, and overwhelm. Each has a different emotional driver — and a different solution.",
                  "Tiga pola yang mencakup sebagian besar penundaan pada pemimpin dan pekerja lintas budaya: takut gagal, perfeksionisme, dan kewalahan. Masing-masing memiliki pendorong emosional yang berbeda — dan solusi yang berbeda.",
                  lang
                )}
              </p>
            </div>
            <div>
              <ProcrastinationLoopSVG lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section style={{ background: "oklch(95% 0.004 260)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={eyebrow}>{t("The Disguise Detector", "Pendeteksi Topeng", lang)}</p>
          <h2 style={sectionH2}>{t("Identify your pattern", "Kenali polamu", lang)}</h2>
          <p style={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.65, margin: "0.5rem 0 1.5rem", maxWidth: 560 }}>
            {t(
              "One statement at a time. Rate each honestly — selecting an answer moves you forward automatically.",
              "Satu pernyataan sekaligus. Nilai setiap pernyataan dengan jujur — memilih jawaban akan melanjutkan ke pernyataan berikutnya secara otomatis.",
              lang
            )}
          </p>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.625rem" }}>
            <div style={{ flex: 1, height: 4, background: LIGHT_GRAY }}>
              <div style={{
                height: "100%",
                background: ORANGE,
                width: `${(answers.filter(a => a > 0).length / 9) * 100}%`,
                transition: "width 0.3s ease",
              }} />
            </div>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem",
              color: NAVY, whiteSpace: "nowrap", minWidth: "2.5rem", textAlign: "right",
            }}>
              {answers.filter(a => a > 0).length} / 9
            </span>
          </div>

          {/* Current question card */}
          <div style={{ background: "white", padding: "1.75rem 1.75rem 1.5rem", marginBottom: "1rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.65,
              margin: "0 0 1.5rem",
            }}>
              <span style={{ color: MUTED, fontWeight: 700, marginRight: "0.625rem", fontSize: "0.75rem" }}>
                {currentQ + 1}.
              </span>
              {QUESTIONS[currentQ][lang]}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[1, 2, 3].map(val => (
                <button
                  key={val}
                  onClick={() => setAnswer(currentQ, val)}
                  style={{
                    flex: 1,
                    minHeight: 68,
                    border: `2px solid ${answers[currentQ] === val ? NAVY : LIGHT_GRAY}`,
                    background: answers[currentQ] === val ? NAVY : "oklch(98% 0.002 260)",
                    color: answers[currentQ] === val ? OFF_WHITE : MUTED,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.25rem",
                    transition: "all 0.12s ease",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", lineHeight: 1 }}>{val}</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", lineHeight: 1 }}>
                    {SCALE[val - 1][lang]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: "0.72rem", color: MUTED, margin: "0 0 1.25rem", textAlign: "center" }}>
            {t("1 = Rarely · 2 = Sometimes · 3 = Often", "1 = Jarang · 2 = Kadang · 3 = Sering", lang)}
          </p>

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {currentQ > 0 ? (
              <button
                onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: "none", border: `1.5px solid ${LIGHT_GRAY}`,
                  color: MUTED, cursor: "pointer",
                  padding: "0 1.25rem", minHeight: 40,
                  fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.78rem",
                  letterSpacing: "0.04em",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("Back", "Kembali", lang)}
              </button>
            ) : <div />}

            {allAnswered && (
              <button
                onClick={() => setShowResult(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: NAVY, color: OFF_WHITE,
                  padding: "0 2rem", minHeight: 48,
                  border: "none", cursor: "pointer",
                  fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.82rem",
                  letterSpacing: "0.05em", textTransform: "uppercase",
                }}
              >
                {t("Reveal My Pattern", "Ungkap Polaku", lang)}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* RESULT */}
      {showResult && (
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <p style={eyebrow}>{t("Your Dominant Pattern", "Pola Dominanmu", lang)}</p>
            <h2 style={{ ...sectionH2, color: disguise.color }}>
              {disguise.label[lang]}
            </h2>

            {/* Score bar */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              {(["fear", "perf", "overwhelm"] as DisguiseKey[]).map(key => {
                const score = key === "fear" ? fearScore : key === "perf" ? perfScore : overwhelmScore;
                const d = DISGUISES[key];
                const isTop = key === dominant;
                return (
                  <div key={key} style={{
                    flex: 1, minWidth: 120,
                    padding: "0.875rem 1rem",
                    background: isTop ? d.color : "white",
                    border: `1.5px solid ${isTop ? d.color : LIGHT_GRAY}`,
                    display: "flex", flexDirection: "column", gap: "0.3rem",
                  }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isTop ? "oklch(88% 0.03 80)" : MUTED }}>
                      {d.label[lang]}
                    </span>
                    <span style={{ fontFamily: "var(--font-cormorant-garamond, 'Cormorant Garamond', serif)", fontSize: "1.75rem", fontWeight: 600, color: isTop ? OFF_WHITE : d.color, lineHeight: 1 }}>
                      {score}
                      <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-montserrat)", fontWeight: 400, color: isTop ? "oklch(80% 0.03 80)" : MUTED }}>/9</span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Intro */}
            <div style={{
              borderLeft: `4px solid ${disguise.color}`,
              paddingLeft: "1.5rem",
              marginBottom: "2.5rem",
            }}>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                {disguise.intro[lang]}
              </p>
            </div>

            {/* 3 Strategy cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {disguise.strategies.map((s, si) => (
                <div key={si} style={{ background: "white", padding: "1.5rem 1.75rem" }}>
                  <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: disguise.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.75rem", color: "white", lineHeight: 1 }}>
                        {si + 1}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: NAVY, margin: 0, lineHeight: 1.4 }}>
                      {s.title[lang]}
                    </p>
                  </div>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.75, color: BODY_TEXT, margin: "0 0 0 2.625rem" }}>
                    {s.body[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CROSS-CULTURAL DIG DEEPER */}
      <section style={{ background: "oklch(95% 0.004 260)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, margin: 0 }}>{t("Dig Deeper", "Gali Lebih Dalam", lang)}</p>
          <h2 style={{ ...sectionH2, margin: "0.375rem 0 2rem", fontSize: "clamp(20px, 2.5vw, 30px)" }}>
            {t("The cross-cultural dimension", "Dimensi lintas budaya", lang)}
          </h2>

          <div>
            <div>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: "0 0 1.1rem" }}>
                {t(
                  "In many Southeast Asian contexts, what looks like procrastination may be something different: structural silence. In Indonesia, two cultural forces shape how delay presents in organisations.",
                  "Dalam banyak konteks Asia Tenggara, apa yang terlihat seperti penundaan mungkin adalah sesuatu yang berbeda: diam struktural. Di Indonesia, dua kekuatan budaya membentuk bagaimana penundaan muncul dalam organisasi.",
                  lang
                )}
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: "0 0 1.1rem" }}>
                {t(
                  "First, jam karet ('rubber time') — the widely understood flexibility of time commitments in social and semi-formal settings. This is not the same as task avoidance; it is a cultural orientation toward relational priorities. Second, malu (face-saving) — the tendency to avoid direct refusal in order to preserve relational harmony. A team member may accept a task they know is impossible rather than embarrass their leader or themselves. What looks like delay may be relational protection.",
                  "Pertama, jam karet — fleksibilitas komitmen waktu yang umum dipahami dalam lingkungan sosial dan semi-formal. Ini bukan sama dengan penghindaran tugas; ini adalah orientasi budaya terhadap prioritas relasional. Kedua, malu — kecenderungan untuk menghindari penolakan langsung demi menjaga keharmonisan relasional. Anggota tim mungkin menerima tugas yang mereka tahu mustahil daripada memalukan pemimpin atau diri mereka sendiri. Apa yang terlihat seperti penundaan mungkin adalah perlindungan relasional.",
                  lang
                )}
              </p>
              <div style={{ background: "white", padding: "1.25rem 1.5rem", margin: "1.25rem 0", borderLeft: `3px solid ${ORANGE}` }}>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.75, color: BODY_TEXT, margin: 0 }}>
                  {t(
                    "Indonesia's power distance index is 78/100 — very high. Team members may be unlikely to raise concerns about unrealistic timelines, waiting instead for clear direction before beginning. What looks like individual delay may be deference to hierarchy.",
                    "Indeks jarak kekuasaan Indonesia adalah 78/100 — sangat tinggi. Anggota tim mungkin tidak akan mengangkat kekhawatiran tentang jadwal yang tidak realistis, malah menunggu arahan yang jelas sebelum memulai. Apa yang terlihat seperti penundaan individual mungkin adalah kepatuhan pada hierarki.",
                    lang
                  )}
                </p>
              </div>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                {t(
                  "For leaders working cross-culturally: distinguish individual psychological delay from organisational structural silence. Ask first — is the task unclear? Is the workload impossible? Has approval been clearly communicated? Sometimes the most important intervention is not a motivational conversation but a structural clarification.",
                  "Bagi pemimpin yang bekerja lintas budaya: bedakan penundaan psikologis individual dari diam struktural organisasional. Tanyakan terlebih dahulu — apakah tugasnya tidak jelas? Apakah beban kerjanya mustahil? Apakah persetujuan sudah dikomunikasikan dengan jelas? Kadang-kadang intervensi terpenting bukan percakapan motivasional, melainkan klarifikasi struktural.",
                  lang
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAITH ANCHOR */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Faith Anchor", "Jangkar Iman", lang)}</p>
          <h2 style={sectionH2}>{t("A deeper root", "Akar yang lebih dalam", lang)}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.75rem" }}>
            <div style={{ background: "white", padding: "1.75rem 2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.10em", textTransform: "uppercase", color: ORANGE, margin: "0 0 0.75rem" }}>
                ACEDIA
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                {t(
                  "The Christian tradition has named this condition for 1,600 years. Evagrius Ponticus, writing in the 4th century, called it acedia — the 'noonday demon' that attacks when the day is long and progress feels impossible. Thomas Aquinas refined the definition: acedia is 'oppressive sadness that depresses man's mind so that he can do nothing freely.' Aquinas distinguished acedia from depression or laziness — it is a failure of will toward the good, and its remedy is not more self-discipline, but contemplation of what is truly worth doing.",
                  "Tradisi Kristen telah memberi nama kondisi ini selama 1.600 tahun. Evagrius Ponticus, yang menulis pada abad ke-4, menyebutnya acedia — 'setan tengah hari' yang menyerang ketika hari terasa panjang dan kemajuan terasa mustahil. Thomas Aquinas menyempurnakan definisinya: acedia adalah 'kesedihan yang menindas yang menekan pikiran manusia sehingga ia tidak dapat melakukan apapun dengan bebas.' Aquinas membedakan acedia dari depresi atau kemalasan — ini adalah kegagalan kehendak terhadap yang baik, dan obatnya bukan lebih banyak disiplin diri, melainkan perenungan tentang apa yang benar-benar layak dilakukan.",
                  lang
                )}
              </p>
            </div>

            <div style={{ background: "white", padding: "1.75rem 2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.10em", textTransform: "uppercase", color: ORANGE, margin: "0 0 0.75rem" }}>
                {t("Matthew 25 — The Parable of the Talents", "Matius 25 — Perumpamaan Talenta", lang)}
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: "0 0 0.875rem" }}>
                {t(
                  "In Matthew 25, the servant who buries his talent does not do so out of laziness. He says it plainly: 'I was afraid.' The master's condemnation is not of the absence of profit — it is of the choice of inaction over faithfulness. The servant misunderstood the character of the master, and that misunderstanding produced paralysis.",
                  "Dalam Matius 25, hamba yang mengubur talentanya tidak melakukannya karena kemalasan. Dia mengatakannya dengan jelas: 'Aku takut.' Kecaman sang tuan bukan karena ketiadaan keuntungan — melainkan karena memilih ketidakaktifan daripada kesetiaan. Hamba itu salah memahami karakter sang tuan, dan kesalahpahaman itu menghasilkan kelumpuhan.",
                  lang
                )}
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                {t(
                  "Faithfulness in the parable is not the guarantee of a good outcome. It is the willingness to act with what one has been given. Colossians 3:23 frames stewardship of time as worship — not as productivity. The goal is not maximum output. The goal is faithful engagement.",
                  "Kesetiaan dalam perumpamaan itu bukan jaminan hasil yang baik. Itu adalah kesediaan untuk bertindak dengan apa yang telah diberikan. Kolose 3:23 membingkai pengelolaan waktu sebagai ibadah — bukan sebagai produktivitas. Tujuannya bukan output maksimal. Tujuannya adalah keterlibatan yang setia.",
                  lang
                )}
              </p>
            </div>

            <div style={{ background: "white", padding: "1.75rem 2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.10em", textTransform: "uppercase", color: ORANGE, margin: "0 0 0.75rem" }}>
                {t("Grace as the structural solution", "Kasih karunia sebagai solusi struktural", lang)}
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: BODY_TEXT, margin: 0 }}>
                {t(
                  "The deepest solution to perfectionism-driven delay is not more willpower — it is grace. When identity is built on performance, producing something imperfect is an existential threat. Justification by faith means the outcome does not define you. You are free to begin imperfectly, to complete inadequately, and to offer it faithfully. Anna Smith, writing in Modern Reformation, argues that perfectionism is a form of self-justification — and that grace is not a soft encouragement but a structural reorientation: when your worth is no longer at stake in your output, you can finally begin.",
                  "Solusi terdalam untuk penundaan yang didorong perfeksionisme bukan lebih banyak kemauan — melainkan kasih karunia. Ketika identitas dibangun di atas kinerja, menghasilkan sesuatu yang tidak sempurna adalah ancaman eksistensial. Pembenaran melalui iman berarti hasilnya tidak mendefinisikan kamu. Kamu bebas untuk memulai secara tidak sempurna, menyelesaikan secara tidak memadai, dan mempersembahkannya dengan setia. Anna Smith, dalam Modern Reformation, berpendapat bahwa perfeksionisme adalah bentuk pembenaran diri — dan bahwa kasih karunia bukan dorongan yang lemah melainkan reorientasi struktural: ketika nilaimu tidak lagi dipertaruhkan dalam outputmu, kamu akhirnya bisa mulai.",
                  lang
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION INTENTION BUILDER */}
      <section style={{ background: NAVY, padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Make One Commitment", "Buat Satu Komitmen", lang)}</p>
          <h2 style={{ ...sectionH2, color: OFF_WHITE }}>
            {t("If-then planning", "Perencanaan jika-maka", lang)}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "oklch(72% 0.04 260)", lineHeight: 1.7, margin: "0.5rem 0 2.5rem", maxWidth: 560 }}>
            {t(
              "Across 642 independent tests, specifying when, where, and exactly what you will do produced a medium-to-large effect on follow-through (d = 0.65). Complete the sentence below.",
              "Dalam 642 uji independen, menentukan kapan, di mana, dan apa tepatnya yang akan kamu lakukan menghasilkan efek signifikan pada tindak lanjut (d = 0,65). Lengkapi kalimat di bawah ini.",
              lang
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.06 260)", display: "block", marginBottom: "0.4rem" }}>
                {t("Specific task", "Tugas spesifik", lang)}
              </label>
              <input
                type="text"
                value={commitAction}
                onChange={e => { setCommitAction(e.target.value); setReminderStatus("idle"); }}
                placeholder={t("e.g. write the introduction", "mis. tulis pendahuluan", lang)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.06 260)", display: "block", marginBottom: "0.4rem" }}>
                {t("Date", "Tanggal", lang)}
              </label>
              <input
                type="date"
                value={commitDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => { setCommitDate(e.target.value); setReminderStatus("idle"); }}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.06 260)", display: "block", marginBottom: "0.4rem" }}>
                {t("Time", "Waktu", lang)}
              </label>
              <input
                type="time"
                value={commitTime}
                onChange={e => { setCommitTime(e.target.value); setReminderStatus("idle"); }}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.06 260)", display: "block", marginBottom: "0.4rem" }}>
                {t("Place", "Tempat", lang)}
              </label>
              <input
                type="text"
                value={commitPlace}
                onChange={e => { setCommitPlace(e.target.value); setReminderStatus("idle"); }}
                placeholder={t("e.g. my desk", "mis. meja kerja saya", lang)}
                style={inputStyle}
              />
            </div>
          </div>

          {commitmentSentence ? (
            <>
              <div style={{
                marginTop: "2rem",
                background: "oklch(28% 0.10 260)",
                borderLeft: `4px solid ${ORANGE}`,
                padding: "1.5rem 1.75rem",
              }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 0.5rem" }}>
                  {t("Your commitment", "Komitmenmu", lang)}
                </p>
                <p style={{ fontFamily: "var(--font-cormorant-garamond, 'Cormorant Garamond', serif)", fontSize: "1.25rem", fontStyle: "italic", color: OFF_WHITE, margin: 0, lineHeight: 1.55 }}>
                  &ldquo;{commitmentSentence}&rdquo;
                </p>
              </div>

              <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                {/* Add to Calendar — universal, no auth needed */}
                <button
                  onClick={handleAddToCalendar}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    background: ORANGE,
                    border: "none",
                    color: "oklch(15% 0.05 45)",
                    padding: "0 1.25rem", minHeight: 40,
                    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="1" y="2" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {t("Add to Calendar", "Tambah ke Kalender", lang)}
                </button>

                {/* Push reminder — requires auth + notification permission */}
                {userId && reminderStatus !== "set" && (
                  <button
                    onClick={handleSetReminder}
                    disabled={reminderStatus === "loading"}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.5rem",
                      background: "transparent",
                      border: `1.5px solid ${ORANGE}`,
                      color: ORANGE,
                      padding: "0 1.25rem", minHeight: 40,
                      fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      cursor: reminderStatus === "loading" ? "wait" : "pointer",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M7 5v3l2 1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M4.5 1.5L7 0l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {reminderStatus === "loading"
                      ? t("Setting reminder...", "Mengatur pengingat...", lang)
                      : t("Remind me at this time", "Ingatkan saya pada waktu ini", lang)}
                  </button>
                )}

                {reminderStatus === "set" && (
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(68% 0.14 145)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t("Reminder set.", "Pengingat diatur.", lang)}
                  </span>
                )}
              </div>

              {reminderStatus === "error" && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(65% 0.18 25)", margin: "0.75rem 0 0" }}>
                  {t("Could not set reminder. Make sure notifications are allowed.", "Tidak bisa mengatur pengingat. Pastikan notifikasi diizinkan.", lang)}
                </p>
              )}
            </>
          ) : (
            <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", border: `1px dashed oklch(38% 0.08 260)` }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", color: "oklch(55% 0.06 260)", margin: 0, fontStyle: "italic" }}>
                {t("Your commitment will appear here once all four fields are filled.", "Komitmenmu akan muncul di sini setelah semua empat bidang diisi.", lang)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* KEY TAKEAWAYS */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Key Takeaways", "Poin Utama", lang)}</p>
          <h2 style={sectionH2}>{t("What to carry forward", "Yang perlu dibawa", lang)}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginTop: "1.75rem" }}>
            {[
              {
                en: "Procrastination is not a character flaw. It is an emotion regulation strategy — and that means it can be addressed at the root.",
                id: "Penundaan bukan cacat karakter. Itu adalah strategi regulasi emosi — dan itu berarti bisa diatasi dari akarnya.",
              },
              {
                en: "Three patterns account for most delay in leaders: fear of failure, perfectionism, and overwhelm. Each has a different driver and a different solution.",
                id: "Tiga pola yang mencakup sebagian besar penundaan pada pemimpin: takut gagal, perfeksionisme, dan kewalahan. Masing-masing memiliki pendorong yang berbeda dan solusi yang berbeda.",
              },
              {
                en: "Short-term avoidance is genuinely relieving — which is why the cycle persists. Naming the emotion behind the delay is the first step to interrupting it.",
                id: "Penghindaran jangka pendek sungguh-sungguh memberikan kelegaan — itulah mengapa siklusnya terus berlanjut. Memberi nama emosi di balik penundaan adalah langkah pertama untuk memutusnya.",
              },
              {
                en: "If-then planning produces the strongest evidence-based effect on follow-through (d = 0.65 across 642 tests). Specify the task, day, time, and place — before the moment arrives.",
                id: "Perencanaan jika-maka menghasilkan efek berbasis bukti terkuat pada tindak lanjut (d = 0,65 dalam 642 uji). Tentukan tugasnya, harinya, waktunya, dan tempatnya — sebelum momennya tiba.",
              },
              {
                en: "Grace is the structural solution to perfectionism. When your worth is not on the line, you are free to begin — imperfectly, inadequately, faithfully.",
                id: "Kasih karunia adalah solusi struktural untuk perfeksionisme. Ketika nilaimu tidak dipertaruhkan, kamu bebas untuk memulai — tidak sempurna, tidak memadai, dengan setia.",
              },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: "1rem", alignItems: "flex-start",
                background: "white", padding: "1.125rem 1.375rem",
              }}>
                <div style={{
                  width: 26, height: 26,
                  background: NAVY, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.7rem", color: "white", lineHeight: 1 }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: BODY_TEXT, margin: 0 }}>{item[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FROM THE FIELD */}
      <section style={{ background: "oklch(95% 0.004 260)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={eyebrow}>{t("From the Field", "Dari Lapangan", lang)}</p>
          <h2 style={sectionH2}>{t("A question to sit with", "Sebuah pertanyaan untuk direnungkan", lang)}</h2>
          <blockquote style={{
            borderLeft: `4px solid ${ORANGE}`,
            margin: "1.75rem 0 0",
            paddingLeft: "1.5rem",
            fontFamily: "var(--font-cormorant-garamond, 'Cormorant Garamond', serif)",
            fontSize: "clamp(1.125rem, 2vw, 1.4rem)",
            fontStyle: "italic",
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.6,
          }}>
            {t(
              "What has procrastination cost you — not in productivity, but in relationships, calling, or courage? And what might faithfulness look like in the one task you have been putting off?",
              "Apa yang telah penundaan ambil dari kamu — bukan dalam produktivitas, tetapi dalam hubungan, panggilan, atau keberanian? Dan seperti apa kesetiaan dalam satu tugas yang selama ini kamu tunda?",
              lang
            )}
          </blockquote>
        </div>
      </section>

    </div>
  );
}
