"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) => lang === "en" ? en : id;

// -- BRAND TOKENS ---------------------------------------------------------------
const navy      = "oklch(22% 0.10 260)";
const orange    = "oklch(65% 0.15 45)";
const offWhite  = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const charcoal  = "oklch(18% 0.000 0)";
const bodyText  = "oklch(38% 0.05 260)";

// -- RISK SPECTRUM DIAGRAM -----------------------------------------------------
function RiskSpectrumDiagram({ lang }: { lang: Lang }) {
  const en = lang === "en";

  const bands = [
    { label: en ? "Working from\nidentity" : "Dari\nidentitas", bg: "hsl(215,55%,28%)" },
    { label: en ? "Drifting" : "Menyimpang",                    bg: "hsl(210,40%,44%)" },
    { label: en ? "At risk" : "Berisiko",                       bg: "hsl(35,70%,48%)" },
    { label: en ? "Burning" : "Terbakar",                       bg: "hsl(0,60%,38%)" },
  ];

  return (
    <figure style={{ margin: "2rem 0 0" }}>
      {/* 4-band spectrum bar */}
      <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 64 }}>
        {bands.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: b.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.2)" : undefined,
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(9px, 1.3vw, 12px)",
                fontWeight: 700,
                color: "white",
                textAlign: "center",
                lineHeight: 1.25,
                padding: "0 4px",
                whiteSpace: "pre-line",
              }}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>

      {/* Subtype spans — show where each subtype sits on the spectrum */}
      <div style={{ position: "relative", height: 100, marginTop: 10 }}>
        {/* Frenetic: drifting and at-risk (25%–75%) */}
        <div
          style={{
            position: "absolute", top: 0, left: "25%", right: "25%", height: 28,
            background: "hsl(42,75%,52%)", borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(10px, 1.4vw, 12px)", fontWeight: 700, color: "white" }}>
            {en ? "Frenetic" : "Frenetic"}
          </span>
        </div>
        {/* Underchallenged: drifting only (25%–50%) */}
        <div
          style={{
            position: "absolute", top: 36, left: "25%", width: "25%", height: 28,
            background: "hsl(185,45%,38%)", borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(9px, 1.2vw, 12px)", fontWeight: 700, color: "white", textAlign: "center", padding: "0 4px", lineHeight: 1.2 }}>
            {en ? "Underchallenged" : "Underchallenged"}
          </span>
        </div>
        {/* Worn-out: at-risk and burning (50%–100%) */}
        <div
          style={{
            position: "absolute", top: 72, left: "50%", right: 0, height: 28,
            background: "hsl(345,55%,32%)", borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(10px, 1.4vw, 12px)", fontWeight: 700, color: "white" }}>
            {en ? "Worn-out" : "Worn-out"}
          </span>
        </div>
      </div>

      <figcaption style={{ fontSize: "0.8rem", color: bodyText, marginTop: "0.5rem", fontFamily: "Montserrat, sans-serif" }}>
        {en
          ? "Burnout risk spectrum based on Montero-Marín et al.³ Each subtype maps to a different risk zone."
          : "Spektrum risiko kelelahan berdasarkan model Montero-Marín dkk.³ Setiap subtipe memetakan ke zona risiko berbeda."}
      </figcaption>
    </figure>
  );
}

// -- BURNOUT CAUSES SPOKE DIAGRAM -----------------------------------------------
function BurnoutCausesSpoke({ lang }: { lang: Lang }) {
  const _navy      = "oklch(22% 0.10 260)";
  const _orange    = "oklch(65% 0.15 45)";
  const _offWhite  = "oklch(96% 0.005 80)";
  const _bodyText  = "oklch(38% 0.05 260)";

  const en = lang === "en";
  const nodes = [
    { label: en ? "Work\nOverload" : "Beban Kerja\nBerlebih",       angle: -90 },
    { label: en ? "Lack of\nControl" : "Kurangnya\nKendali",        angle: -30 },
    { label: en ? "Lack of\nReward" : "Kurangnya\nPenghargaan",     angle: 30 },
    { label: en ? "Lack of\nCommunity" : "Kurangnya\nKomunitas",    angle: 90 },
    { label: en ? "Lack of\nFairness" : "Kurangnya\nKeadilan",      angle: 150 },
    { label: en ? "Values\nMismatch" : "Ketidaksesuaian\nNilai",    angle: 210 },
  ];

  const cx = 250, cy = 250, r = 155, nodeW = 90, nodeH = 48;

  return (
    <figure style={{ margin: "2rem 0", textAlign: "center" as const }}>
      <svg
        viewBox="0 0 500 500"
        style={{ width: "100%", maxWidth: 480, height: "auto" }}
        aria-hidden="true"
        role="img"
      >
        <defs>
          <radialGradient id="bcs-center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(30% 0.12 260)" />
            <stop offset="100%" stopColor="oklch(22% 0.10 260)" />
          </radialGradient>
          <filter id="bcs-node-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.25)" />
          </filter>
        </defs>

        {/* Spokes */}
        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x2 = cx + r * Math.cos(rad);
          const y2 = cy + r * Math.sin(rad);
          return (
            <line
              key={i}
              x1={cx} y1={cy} x2={x2} y2={y2}
              stroke="oklch(65% 0.15 45)"
              strokeWidth="2"
              strokeOpacity="0.7"
            />
          );
        })}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={52} fill="url(#bcs-center-grad)" />
        <circle cx={cx} cy={cy} r={52} fill="none" stroke="oklch(65% 0.15 45)" strokeWidth="1.5" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="oklch(96% 0.005 80)"
          fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.5">
          {en ? "6 MAIN" : "6 FAKTOR"}
        </text>
        <text x={cx} y={cy + 7} textAnchor="middle" fill="oklch(96% 0.005 80)"
          fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.5">
          {en ? "CAUSES" : "UTAMA"}
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fill="oklch(65% 0.15 45)"
          fontFamily="Montserrat, sans-serif" fontSize="9" fontWeight="600" letterSpacing="0.3">
          {en ? "OF BURNOUT" : "KELELAHAN"}
        </text>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + r * Math.cos(rad);
          const ny = cy + r * Math.sin(rad);
          const lines = node.label.split("\n");
          return (
            <g key={i} filter="url(#bcs-node-shadow)">
              <ellipse
                cx={nx} cy={ny}
                rx={nodeW / 2} ry={nodeH / 2}
                fill="oklch(96% 0.005 80)"
                stroke="oklch(65% 0.15 45)"
                strokeWidth="1.2"
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={nx}
                  y={ny + (li - (lines.length - 1) / 2) * 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="oklch(22% 0.10 260)"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="10"
                  fontWeight="700"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: "0.75rem",
        color: _bodyText,
        marginTop: "0.5rem",
        opacity: 0.7,
      }}>
        {en
          ? "Six Areas of Work–Life Mismatch (Maslach & Leiter²)"
          : "Enam Area Ketidaksesuaian Pekerjaan–Kehidupan (Maslach & Leiter²)"}
      </figcaption>
    </figure>
  );
}

// -- MAIN COMPONENT -------------------------------------------------------------
export default function UnderstandingBurnoutClient({
  isSaved,
}: {
  isSaved: boolean;
}) {
  const { lang: rawLang } = useLanguage();
  const lang = (rawLang === "id" ? "id" : "en") as Lang;

  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  // Section 2 Dig Deeper
  const [digOpen2, setDigOpen2] = useState(false);

  // Section 4 Dig Deeper
  const [digOpen4, setDigOpen4] = useState(false);

  // Section 4 pathway accordions
  const [pathOpen, setPathOpen] = useState<string | null>(null);

  // Section 5 checklist
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggleCheck = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  // Section 6 emotion card pick
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Assessment state
  const [answers, setAnswers] = useState<(number | null)[]>(Array(20).fill(null));
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [bgOpen, setBgOpen] = useState(false);
  const [leaderOpen, setLeaderOpen] = useState(false);

  function handleAnswer(value: number) {
    const next = [...answers];
    next[currentQ] = value;
    setAnswers(next);
    if (currentQ < 19) {
      setTimeout(() => setCurrentQ((q) => q + 1), 400);
    } else {
      setTimeout(() => setShowResult(true), 400);
    }
  }

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("understanding-burnout");
      setSaved(true);
    });
  }

  // Score calculations
  const totalScore = answers.reduce<number>((s, a) => s + (a ?? 0), 0);
  const freneticScore = answers.slice(0, 7).reduce<number>((s, a) => s + (a ?? 0), 0);
  const underchallengedScore = answers.slice(7, 13).reduce<number>((s, a) => s + (a ?? 0), 0);
  const wornOutScore = answers.slice(13, 20).reduce<number>((s, a) => s + (a ?? 0), 0);

  const dominantSubtype = (() => {
    const frPct = (freneticScore as number) / 28;
    const ucPct = (underchallengedScore as number) / 24;
    const woPct = (wornOutScore as number) / 28;
    if (frPct >= ucPct && frPct >= woPct) return "frenetic";
    if (ucPct >= frPct && ucPct >= woPct) return "underchallenged";
    return "worn-out";
  })();

  const band = (() => {
    const s = totalScore as number;
    if (s <= 29) return "identity";
    if (s <= 49) return "drifting";
    if (s <= 69) return "at-risk";
    return "burning";
  })();

  const answerLabels = {
    en: ["Never", "Rarely", "Sometimes", "Often", "Almost always"],
    id: ["Tidak pernah", "Jarang", "Kadang-kadang", "Sering", "Hampir selalu"],
  };

  const questions = [
    // Frenetic 1-7
    { en: "I find it difficult to stop working even when I know I should rest.", id: "Saya merasa sulit untuk berhenti bekerja bahkan ketika saya tahu saya harus istirahat." },
    { en: "I feel guilty when I am not being productive.", id: "Saya merasa bersalah ketika saya tidak produktif." },
    { en: "I measure my worth or sense of calling by how much I am accomplishing.", id: "Saya mengukur nilai atau rasa panggilan saya dari seberapa banyak yang saya capai." },
    { en: "I take on more than I can manage because I am afraid something important will be missed.", id: "Saya mengambil lebih banyak dari yang bisa saya tangani karena saya takut sesuatu yang penting akan terlewatkan." },
    { en: "I find it hard to say no to requests, even when I am already at capacity.", id: "Saya merasa sulit untuk mengatakan tidak pada permintaan, bahkan ketika saya sudah penuh." },
    { en: "I push through fatigue because the work feels too important to pause.", id: "Saya memaksakan diri melalui kelelahan karena pekerjaan terasa terlalu penting untuk dijeda." },
    { en: "The pace I am currently working at is not sustainable, but I keep going anyway.", id: "Kecepatan kerja saya saat ini tidak berkelanjutan, tetapi saya terus saja." },
    // Underchallenged 8-13
    { en: "The work I am doing right now does not use my best gifts or capacities.", id: "Pekerjaan yang saya lakukan saat ini tidak menggunakan karunia atau kapasitas terbaik saya." },
    { en: "I find it hard to care about the tasks in front of me even though I know they matter.", id: "Saya merasa sulit untuk peduli dengan tugas di hadapan saya meskipun saya tahu tugas itu penting." },
    { en: "I feel a growing distance between what I am doing and what I believe I was called to do.", id: "Saya merasakan jarak yang semakin besar antara apa yang saya lakukan dan apa yang saya yakini sebagai panggilan saya." },
    { en: "The routine of my work has become flat or meaningless.", id: "Rutinitas pekerjaan saya telah menjadi datar atau tidak bermakna." },
    { en: "I feel underused, as though my best is not needed here.", id: "Saya merasa kurang dimanfaatkan, seolah yang terbaik dari saya tidak dibutuhkan di sini." },
    { en: "I am going through the motions without genuine engagement.", id: "Saya menjalani rutinitas tanpa keterlibatan yang tulus." },
    // Worn-out 14-20
    { en: "I feel little energy or motivation even after rest.", id: "Saya merasa sedikit energi atau motivasi bahkan setelah beristirahat." },
    { en: "I have started to feel that my efforts make no real difference.", id: "Saya mulai merasa bahwa upaya saya tidak membuat perbedaan nyata." },
    { en: "I have withdrawn from people or relationships I used to invest in.", id: "Saya telah menarik diri dari orang-orang atau hubungan yang dulu saya jaga." },
    { en: "I feel unacknowledged or invisible in my work.", id: "Saya merasa tidak diakui atau tidak terlihat dalam pekerjaan saya." },
    { en: "I have lost the sense of purpose that once made this work feel meaningful.", id: "Saya telah kehilangan rasa tujuan yang pernah membuat pekerjaan ini terasa bermakna." },
    { en: "I feel that things are out of my control and there is nothing I can do to change them.", id: "Saya merasa bahwa segala sesuatunya di luar kendali saya dan tidak ada yang bisa saya lakukan untuk mengubahnya." },
    { en: "I am simply enduring rather than living into my calling.", id: "Saya hanya bertahan daripada hidup dalam panggilan saya." },
  ];

  // -- SHARED STYLES --
  const sectionPadding = { padding: "5rem 1.5rem" };
  const containerStyle = { maxWidth: "860px", margin: "0 auto" };
  const eyebrowStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: orange,
    marginBottom: "0.75rem",
  };
  const h2Style = (light?: boolean) => ({
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: 600,
    lineHeight: 1.15,
    color: light ? offWhite : navy,
    marginBottom: "1.5rem",
    marginTop: 0,
  });
  const bodyStyle = (light?: boolean) => ({
    fontFamily: "Montserrat, sans-serif",
    fontSize: "1rem",
    lineHeight: 1.8,
    color: light ? "oklch(85% 0.01 80)" : bodyText,
    marginBottom: "1.25rem",
  });

  // ============================================================
  // HERO SECTION
  // ============================================================
  return (
    <>
      <LangToggle />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          background: navy,
          overflow: "hidden",
          padding: "7rem 1.5rem 6rem",
        }}
      >
        <img
          src="/images/resources/understanding-burnout/hero-burnout-generated.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            mixBlendMode: "luminosity",
          }}
        />
        <div style={{ ...containerStyle, position: "relative", zIndex: 1 }}>
          <p style={eyebrowStyle}>{t("Personal Growth", "Pengembangan Diri", lang)}</p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              lineHeight: 1.1,
              color: offWhite,
              marginBottom: "1.5rem",
              marginTop: 0,
            }}
          >
            {t("Understanding Burnout", "Memahami Kelelahan", lang)}
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(17px, 2.2vw, 22px)",
              color: "oklch(82% 0.03 260)",
              lineHeight: 1.6,
              maxWidth: 580,
              marginBottom: 32,
            }}
          >
            {t(
              "Burnout among cross-cultural workers and the organizations that send and support them is on the rise. The loss of a leader from the field carries a real financial cost, but the deeper costs fall on teams, families, marriages, and the communities they serve.",
              "Kelelahan di kalangan pekerja lintas budaya dan organisasi yang mengutus serta mendukung mereka terus meningkat. Kehilangan seorang pemimpin dari lapangan memiliki biaya finansial yang nyata, tetapi biaya yang lebih dalam jatuh pada tim, keluarga, pernikahan, dan komunitas yang mereka layani.",
              lang
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            aria-label={t(saved ? "Saved to dashboard" : "Save to dashboard", saved ? "Tersimpan di dasbor" : "Simpan ke dasbor")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              minHeight: 44, padding: "10px 20px",
              background: "transparent", border: `1.5px solid ${saved ? orange : "oklch(55% 0.04 260)"}`,
              borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600,
              color: saved ? orange : "oklch(70% 0.04 260)", cursor: saved ? "default" : "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={saved ? orange : "none"} stroke={saved ? orange : "currentColor"} strokeWidth="1.5" aria-hidden="true">
              <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z"/>
            </svg>
            {t(saved ? "Saved" : "Save to Dashboard", saved ? "Tersimpan" : "Simpan ke Dasbor", lang)}
          </button>
        </div>
      </section>

      {/* ============================================================
          SECTION 1 -- The Call That Broke Me
          ============================================================ */}
      <section style={{ background: offWhite, ...sectionPadding }}>
        <div style={containerStyle}>
          <h2 style={h2Style()}>
            {t("Nobody saw it coming.", "Tidak ada yang menduga.", lang)}
          </h2>
          <p style={bodyStyle()}>
            {t(
              "Five years into cross-cultural ministry, in a city far from home, a leader was producing visible fruit. The team was growing. The program was running. By any external measure, the work was succeeding. What no one saw (including the leader) was the cost building underneath. The early-morning hours that had once felt like communion began to feel like catching up. The people they served began to feel like demand. By the time the collapse came, no one, including the leader, had seen it building.",
              "Lima tahun dalam pelayanan lintas budaya, di sebuah kota jauh dari rumah, seorang pemimpin menghasilkan buah yang nyata. Tim bertumbuh. Program berjalan. Berdasarkan ukuran eksternal mana pun, pekerjaan itu berhasil. Yang tidak terlihat siapa pun (termasuk pemimpin itu sendiri) adalah biaya yang menumpuk di balik permukaan. Jam-jam dini hari yang dulunya terasa seperti persekutuan mulai terasa seperti mengejar ketertinggalan. Orang-orang yang dilayani mulai terasa seperti beban. Ketika keruntuhan itu tiba, tidak ada seorang pun, termasuk pemimpin itu sendiri, yang melihatnya datang.",
              lang
            )}
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 -- What Burnout Actually Is
          ============================================================ */}
      <section style={{ background: lightGray, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("THE SCIENCE", "ILMUNYA", lang)}</p>
          <h2 style={h2Style()}>
            {t("What Burnout Actually Is", "Apa Sebenarnya Kelelahan Itu", lang)}
          </h2>
          <p style={bodyStyle()}>
            {t(
              "Burnout is not a personality weakness, a faith failure, or simply working too hard. According to the World Health Organization¹, burnout is a syndrome resulting from chronic, unmanaged workplace stress. It is characterized by three main manifestations:",
              "Kelelahan bukan kelemahan kepribadian, kegagalan iman, atau sekadar terlalu banyak bekerja. Menurut Organisasi Kesehatan Dunia¹, kelelahan adalah sebuah sindrom yang diakibatkan oleh stres kerja kronis yang tidak berhasil dikelola. Sindrom ini dicirikan oleh tiga manifestasi utama:",
              lang
            )}
          </p>
          <ul style={{
            listStyle: "none", padding: 0, margin: "1.5rem 0 2rem",
            display: "flex", flexDirection: "column" as const, gap: "1rem",
          }}>
            {[
              {
                label: t("Exhaustion", "Kelelahan", lang),
                body: t(
                  "occurs when physical, emotional, mental, or relational resources are depleted. It is the experience of having nothing left to give — not just tiredness, but depletion at the level of identity and capacity.",
                  "terjadi ketika sumber daya fisik, emosional, mental, atau relasional habis terkuras. Ini adalah pengalaman tidak memiliki apa-apa lagi untuk diberikan — bukan sekadar kelelahan, melainkan penipisan pada tingkat identitas dan kapasitas.",
                  lang
                ),
              },
              {
                label: t("Cynicism", "Sinisme", lang),
                body: t(
                  "emerges when emotions begin to take over, producing increased negativity toward the work, the people in it, and the leader's own calling. It is a defensive response to sustained depletion — and one that is difficult to reverse once established.",
                  "muncul ketika emosi mulai mengambil alih, menghasilkan negativitas yang semakin meningkat terhadap pekerjaan, orang-orang di dalamnya, dan panggilan pemimpin itu sendiri. Ini adalah respons defensif terhadap penipisan yang berkelanjutan — dan sulit untuk dibalik begitu sudah terjadi.",
                  lang
                ),
              },
              {
                label: t("Reduced Professional Efficacy", "Berkurangnya Efikasi Profesional", lang),
                body: t(
                  "develops as a growing sense of ineffectiveness sets in. Leaders in this phase continue to work — sometimes intensively — while becoming increasingly convinced that their effort is making no meaningful difference. This conviction feels like realism, which is what makes it so difficult to counter.",
                  "berkembang seiring dengan munculnya rasa tidak efektif yang semakin besar. Pemimpin dalam fase ini terus bekerja — terkadang dengan intensif — sambil semakin yakin bahwa upaya mereka tidak membuat perbedaan yang berarti. Keyakinan ini terasa seperti realisme, itulah yang membuatnya sangat sulit untuk dilawan.",
                  lang
                ),
              },
            ].map(({ label, body }) => (
              <li key={label} style={{
                display: "flex", gap: "1rem", alignItems: "flex-start",
                padding: "1rem 1.25rem",
                background: "#fff",
                borderRadius: 8,
                borderLeft: `3px solid ${orange}`,
              }}>
                <div>
                  <span style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem",
                    fontWeight: 700, color: navy, display: "block", marginBottom: 4,
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem",
                    lineHeight: 1.7, color: bodyText,
                  }}>
                    {body}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Warning Signs of Burnout — Paula Davis */}
          <div style={{ margin: "2.5rem 0" }}>
            <h3 style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(14px, 1.8vw, 17px)",
              fontWeight: 700,
              color: navy,
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
              marginBottom: "1rem",
              marginTop: 0,
            }}>
              {t("Warning Signs of Burnout", "Tanda-Tanda Peringatan Kelelahan", lang)}⁸
            </h3>

            {/* Desktop table — hidden on mobile */}
            <style>{`
              .wst-table { display: grid; }
              .wst-stacked { display: none; }
              @media (max-width: 639px) {
                .wst-table { display: none; }
                .wst-stacked { display: flex; }
              }
            `}</style>

            <div className="wst-table" style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              borderRadius: 8, overflow: "hidden",
              border: `1px solid ${lightGray}`,
              fontSize: "clamp(12px, 1.5vw, 14px)",
              fontFamily: "Montserrat, sans-serif",
            }}>
              {/* Header row */}
              {[
                t("Physical", "Fisik", lang),
                t("Psychological", "Psikologis", lang),
                t("Behavioral", "Perilaku", lang),
              ].map((header, i) => (
                <div key={i} style={{
                  background: navy, color: offWhite,
                  fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  padding: "10px 14px",
                  borderRight: i < 2 ? `1px solid rgba(255,255,255,0.12)` : undefined,
                }}>
                  {header}
                </div>
              ))}
              {/* Data rows */}
              {[
                [
                  t("Chronic fatigue", "Kelelahan kronis", lang),
                  t("Anxiety", "Kecemasan", lang),
                  t("Productivity decline", "Penurunan produktivitas", lang),
                ],
                [
                  t("Insomnia", "Insomnia", lang),
                  t("Depression", "Depresi", lang),
                  t("Absenteeism", "Absenteisme", lang),
                ],
                [
                  t("Frequent illness", "Sering sakit", lang),
                  t("Anger/irritability", "Marah/mudah tersinggung", lang),
                  t("Neglecting responsibilities", "Mengabaikan tanggung jawab", lang),
                ],
                [
                  t("Physical pain", "Nyeri fisik", lang),
                  t("Loss of enjoyment", "Kehilangan kesenangan", lang),
                  t("Social withdrawal", "Menarik diri dari lingkungan sosial", lang),
                ],
                [
                  t("Loss of appetite", "Kehilangan nafsu makan", lang),
                  t("Pessimism", "Pesimisme", lang),
                  t("Increased substance use", "Peningkatan penggunaan zat", lang),
                ],
                [
                  t("Dizziness / headaches", "Pusing / sakit kepala", lang),
                  t("Feeling trapped", "Merasa terjebak", lang),
                  t("Taking longer to complete tasks", "Butuh waktu lebih lama untuk menyelesaikan tugas", lang),
                ],
              ].map((row, ri) =>
                row.map((cell, ci) => (
                  <div key={`${ri}-${ci}`} style={{
                    padding: "9px 14px",
                    background: ri % 2 === 0 ? "#fff" : "oklch(96% 0.005 80)",
                    borderTop: `1px solid ${lightGray}`,
                    borderRight: ci < 2 ? `1px solid ${lightGray}` : undefined,
                    color: bodyText,
                    lineHeight: 1.4,
                  }}>
                    {cell}
                  </div>
                ))
              )}
            </div>

            {/* Mobile stacked list */}
            <div className="wst-stacked" style={{ flexDirection: "column" as const, gap: "1rem" }}>
              {[
                {
                  cat: t("Physical", "Fisik", lang),
                  items: [
                    t("Chronic fatigue", "Kelelahan kronis", lang),
                    t("Insomnia", "Insomnia", lang),
                    t("Frequent illness", "Sering sakit", lang),
                    t("Physical pain", "Nyeri fisik", lang),
                    t("Loss of appetite", "Kehilangan nafsu makan", lang),
                    t("Dizziness / headaches", "Pusing / sakit kepala", lang),
                  ],
                },
                {
                  cat: t("Psychological", "Psikologis", lang),
                  items: [
                    t("Anxiety", "Kecemasan", lang),
                    t("Depression", "Depresi", lang),
                    t("Anger/irritability", "Marah/mudah tersinggung", lang),
                    t("Loss of enjoyment", "Kehilangan kesenangan", lang),
                    t("Pessimism", "Pesimisme", lang),
                    t("Feeling trapped", "Merasa terjebak", lang),
                  ],
                },
                {
                  cat: t("Behavioral", "Perilaku", lang),
                  items: [
                    t("Productivity decline", "Penurunan produktivitas", lang),
                    t("Absenteeism", "Absenteisme", lang),
                    t("Neglecting responsibilities", "Mengabaikan tanggung jawab", lang),
                    t("Social withdrawal", "Menarik diri dari lingkungan sosial", lang),
                    t("Increased substance use", "Peningkatan penggunaan zat", lang),
                    t("Taking longer to complete tasks", "Butuh waktu lebih lama untuk menyelesaikan tugas", lang),
                  ],
                },
              ].map(({ cat, items }) => (
                <div key={cat} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${lightGray}` }}>
                  <div style={{
                    background: navy, color: offWhite, fontWeight: 700,
                    fontSize: 12, letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    padding: "8px 14px",
                    fontFamily: "Montserrat, sans-serif",
                  }}>
                    {cat}
                  </div>
                  <ul style={{ margin: 0, padding: "8px 14px 12px", listStyle: "disc", paddingLeft: 30 }}>
                    {items.map((item) => (
                      <li key={item} style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 13, color: bodyText,
                        lineHeight: 1.5, marginBottom: 4,
                      }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Concept Cards -- 3 subtypes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
              margin: "2rem 0",
            }}
          >
            {/* Card 1 -- Frenetic */}
            <div
              style={{
                background: navy,
                borderRadius: "10px",
                padding: "1.75rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: orange,
                  margin: 0,
                }}
              >
                {t("Frenetic: Overload", "Frenetic: Kelebihan Beban", lang)}
              </p>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.8rem",
                  color: "oklch(75% 0.01 80)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {t("High drive, still pushing", "Dorongan tinggi, terus memaksakan diri", lang)}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(85% 0.01 80)", margin: 0 }}>
                {t(
                  "High ambition, high commitment, keeps pushing through depletion. Coping style is active but unsustainable. This is often the leader who cannot stop because stopping feels like faithlessness. Visible, productive, well-regarded, and running on a collapsing foundation.",
                  "Ambisi tinggi, komitmen tinggi, terus mendorong meskipun sudah terkuras. Gaya mengatasinya aktif tetapi tidak berkelanjutan. Ini sering kali adalah pemimpin yang tidak bisa berhenti karena berhenti terasa seperti tidak setia. Terlihat, produktif, dihormati, dan berjalan di atas fondasi yang runtuh.",
                  lang
                )}
              </p>
            </div>

            {/* Card 2 -- Underchallenged */}
            <div
              style={{
                background: navy,
                borderRadius: "10px",
                padding: "1.75rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: orange,
                  margin: 0,
                }}
              >
                {t("Underchallenged: Disengagement", "Underchallenged: Ketidakterlibatan", lang)}
              </p>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.8rem",
                  color: "oklch(75% 0.01 80)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {t("Disconnected from purpose", "Terputus dari tujuan", lang)}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(85% 0.01 80)", margin: 0 }}>
                {t(
                  "Not overwhelmed but disengaged. Skills are underused. The work feels repetitive, small, disconnected from calling. Common among experienced leaders placed in roles below their capacity, or those whose pioneering work has become bureaucratic maintenance. The exhaustion here is not from too much. It is from too little meaning.",
                  "Tidak kewalahan tetapi tidak terlibat. Keterampilan tidak dimanfaatkan. Pekerjaan terasa berulang, kecil, terputus dari panggilan. Umum di antara pemimpin berpengalaman yang ditempatkan dalam peran di bawah kapasitas mereka, atau mereka yang pekerjaan perintisnya telah menjadi pemeliharaan birokrasi. Kelelahan di sini bukan karena terlalu banyak, melainkan karena terlalu sedikit makna.",
                  lang
                )}
              </p>
            </div>

            {/* Card 3 -- Worn-Out */}
            <div
              style={{
                background: navy,
                borderRadius: "10px",
                padding: "1.75rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: orange,
                  margin: 0,
                }}
              >
                {t("Worn-Out: Neglect", "Worn-Out: Pengabaian", lang)}
              </p>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.8rem",
                  color: "oklch(75% 0.01 80)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {t("Apathy, passivity, stopped trying", "Apatis, pasif, berhenti berusaha", lang)}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", lineHeight: 1.7, color: "oklch(85% 0.01 80)", margin: 0 }}>
                {t(
                  "Advanced disengagement, apathy, passivity. This leader has often passed through frenetic burnout without recovery and arrived at a place where effort no longer feels worth it. Acknowledgment feels absent. Control feels absent. They have stopped trying to change what is not changing. This is the hardest pattern to reverse and the most likely to precede attrition or breakdown.",
                  "Ketidakterlibatan lanjut, apatis, pasif. Pemimpin ini sering telah melewati kelelahan frenetic tanpa pemulihan dan tiba di tempat di mana usaha tidak lagi terasa sepadan. Pengakuan terasa tidak ada. Kontrol terasa tidak ada. Mereka telah berhenti mencoba mengubah apa yang tidak berubah. Ini adalah pola yang paling sulit untuk dibalik dan yang paling mungkin mendahului gesekan atau kerusakan.",
                  lang
                )}
              </p>
            </div>
          </div>

          {/* SVG Diagram */}
          <RiskSpectrumDiagram lang={lang} />

          {/* Dig Deeper -- Section 2 */}
          <div style={{ marginTop: "2.5rem" }}>
            <button
              onClick={() => setDigOpen2((v) => !v)}
              aria-expanded={digOpen2}
              aria-controls="dig-deeper-s2"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: navy,
                background: "transparent",
                border: `1.5px solid ${navy}`,
                borderRadius: "6px",
                padding: "0.6rem 1.25rem",
                cursor: "pointer",
              }}
            >
              {t("Dig Deeper ->", "Pelajari Lebih Lanjut ->", lang)}
            </button>
            <div
              id="dig-deeper-s2"
              role="region"
              aria-label={t("Additional depth", "Kedalaman tambahan", lang)}
              style={{
                display: "grid",
                gridTemplateRows: digOpen2 ? "1fr" : "0fr",
                transition: "grid-template-rows 0.3s ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    marginTop: "1.25rem",
                    padding: "1.5rem",
                    background: "oklch(92% 0.005 80)",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${orange}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: navy,
                      marginBottom: "0.75rem",
                      marginTop: 0,
                    }}
                  >
                    {t("The Job Demands-Resources Model", "Model Tuntutan Pekerjaan-Sumber Daya", lang)}
                  </p>
                  <p style={{ ...bodyStyle(), marginBottom: "1rem" }}>
                    {t(
                      "The Job Demands-Resources (JD-R) model⁴ offers a structural explanation for burnout. Burnout occurs when job demands (workload, emotional demands, role ambiguity, interpersonal conflict) consistently outpace the resources available to meet them: autonomy, feedback, supervisory support, skill match, relationship quality. The model explains why two workers in identical roles can have completely different experiences: the ratio of demands to resources differs. Burnout is therefore not simply a willpower or character problem. It is a structural diagnosis that calls for a structural response.",
                      "Model Tuntutan Pekerjaan-Sumber Daya (JD-R)⁴ menawarkan penjelasan struktural untuk kelelahan. Kelelahan terjadi ketika tuntutan pekerjaan (beban kerja, tuntutan emosional, ambiguitas peran, konflik interpersonal) secara konsisten melebihi sumber daya yang tersedia untuk memenuhinya: otonomi, umpan balik, dukungan pengawasan, kecocokan keterampilan, kualitas hubungan. Model ini menjelaskan mengapa dua pekerja dalam peran yang identik dapat memiliki pengalaman yang sepenuhnya berbeda: rasio tuntutan terhadap sumber daya berbeda. Kelelahan oleh karena itu bukan sekadar masalah kemauan atau karakter. Ini adalah diagnosis struktural yang membutuhkan respons struktural.",
                      lang
                    )}
                  </p>
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: navy,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {t("The Neuroscience of Chronic Stress", "Neurosains Stres Kronis", lang)}
                  </p>
                  <p style={{ ...bodyStyle(), marginBottom: 0 }}>
                    {t(
                      "Prolonged exposure to elevated cortisol⁵ (the hormone released under chronic stress) progressively impairs the prefrontal cortex, the region responsible for complex thinking, empathy, and long-range planning. At the same time, the amygdala (the threat-detection centre) becomes hypersensitive. The result is a person who is increasingly reactive, less able to think clearly, less able to feel connected, and often unaware that this is happening because the very capacity for self-assessment has been compromised. This is why self-report about burnout is notoriously unreliable: the instrument measuring the problem is itself affected by the problem.",
                      "Paparan berkepanjangan terhadap kortisol⁵ yang meningkat (hormon yang dilepaskan di bawah stres kronis) secara progresif merusak korteks prefrontal, wilayah yang bertanggung jawab untuk pemikiran kompleks, empati, dan perencanaan jangka panjang. Pada saat yang sama, amigdala (pusat deteksi ancaman) menjadi hipersensitif. Hasilnya adalah seseorang yang semakin reaktif, kurang mampu berpikir jernih, kurang mampu merasa terhubung, dan sering tidak menyadari bahwa ini terjadi karena kapasitas penilaian diri itu sendiri telah terganggu. Inilah mengapa laporan diri tentang kelelahan terkenal tidak dapat diandalkan: instrumen yang mengukur masalah itu sendiri dipengaruhi oleh masalah.",
                      lang
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION — Systemic Causes of Burnout
          ============================================================ */}
      <section style={{ background: offWhite, padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: orange,
            marginBottom: "0.5rem",
            marginTop: 0,
          }}>
            {t("WHAT THE RESEARCH SHOWS", "APA YANG DITUNJUKKAN PENELITIAN", lang)}
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(30px, 4.5vw, 52px)",
            fontWeight: 600,
            lineHeight: 1.1,
            color: navy,
            marginBottom: "1.5rem",
            marginTop: 0,
          }}>
            {t("When the System Is Part of the Problem", "Ketika Sistemlah yang Menjadi Bagian dari Masalah", lang)}
          </h2>
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.8vw, 17px)",
            lineHeight: 1.8,
            color: bodyText,
            marginBottom: "2.5rem",
            marginTop: 0,
          }}>
            {t(
              "Burnout is rarely just a personal failure. Research consistently points to organizational and systemic conditions as primary drivers. Christina Maslach and Michael Leiter² identify six areas where mismatches between a person and their work environment create the conditions for burnout — regardless of the individual's resilience, character, or faith.",
              "Kelelahan jarang hanya merupakan kegagalan pribadi. Penelitian secara konsisten menunjuk pada kondisi organisasi dan sistem sebagai pendorong utama. Christina Maslach dan Michael Leiter² mengidentifikasi enam area di mana ketidaksesuaian antara seseorang dan lingkungan kerjanya menciptakan kondisi untuk kelelahan — terlepas dari ketahanan, karakter, atau iman individu tersebut.",
              lang
            )}
          </p>

          {/* Hub-and-spoke SVG diagram */}
          <BurnoutCausesSpoke lang={lang} />

          {/* 6 systemic cause cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.25rem",
            marginTop: "2.5rem",
          }}>
            {[
              {
                title: t("Lack of Control", "Kurangnya Kendali", lang),
                body: t(
                  "When leaders have little say over the decisions, resources, or pace that affect their work, the result is a chronic sense of helplessness. The work continues, but the ability to shape it diminishes. Over time, this erodes agency — and without agency, sustained engagement becomes impossible.",
                  "Ketika para pemimpin memiliki sedikit kendali atas keputusan, sumber daya, atau tempo yang mempengaruhi pekerjaan mereka, hasilnya adalah rasa tidak berdaya yang kronis. Pekerjaan terus berlanjut, tetapi kemampuan untuk membentuknya berkurang. Seiring waktu, ini mengikis agensi — dan tanpa agensi, keterlibatan yang berkelanjutan menjadi tidak mungkin.",
                  lang
                ),
              },
              {
                title: t("Lack of Reward", "Kurangnya Penghargaan", lang),
                body: t(
                  "Reward is not only financial. When contribution goes unacknowledged — by supervisors, teams, or the broader community — the intrinsic motivation that sustains cross-cultural workers begins to erode. The question 'does my work matter?' starts to go unanswered, and the silence becomes its own kind of weight.",
                  "Penghargaan bukan hanya soal finansial. Ketika kontribusi tidak diakui — oleh atasan, tim, atau komunitas yang lebih luas — motivasi intrinsik yang menopang para pekerja lintas budaya mulai terkikis. Pertanyaan 'apakah pekerjaan saya berarti?' mulai tidak terjawab, dan keheningan itu menjadi bebannya sendiri.",
                  lang
                ),
              },
              {
                title: t("Values Mismatch", "Ketidaksesuaian Nilai", lang),
                body: t(
                  "When the organization asks for things that conflict with what the leader believes matters — whether in ethics, priorities, or methodology — the dissonance is not abstract. It is felt in every decision, every meeting, every report. Over time, the cost of maintaining integrity in a misaligned system is one of the most consistent predictors of burnout.",
                  "Ketika organisasi meminta hal-hal yang bertentangan dengan apa yang diyakini pemimpin sebagai penting — baik dalam etika, prioritas, maupun metodologi — disonans ini bukan sesuatu yang abstrak. Ini dirasakan dalam setiap keputusan, setiap pertemuan, setiap laporan. Seiring waktu, biaya mempertahankan integritas dalam sistem yang tidak selaras adalah salah satu prediktor kelelahan yang paling konsisten.",
                  lang
                ),
              },
              {
                title: t("Work Overload", "Beban Kerja Berlebih", lang),
                body: t(
                  "Sustained overload — not temporary intensity — is the most direct path to exhaustion. In cross-cultural contexts, role boundaries are frequently unclear, reporting lines often span time zones, and the sense of responsibility to the work rarely turns off. The result is not just busyness: it is the slow depletion of the very resources needed to sustain the work.",
                  "Beban berlebih yang berkelanjutan — bukan intensitas sementara — adalah jalur paling langsung menuju kelelahan. Dalam konteks lintas budaya, batas peran sering kali tidak jelas, jalur pelaporan seringkali merentang lintas zona waktu, dan rasa tanggung jawab terhadap pekerjaan jarang mati. Hasilnya bukan sekadar kesibukan: melainkan penipisan perlahan dari sumber daya yang justru dibutuhkan untuk mempertahankan pekerjaan.",
                  lang
                ),
              },
              {
                title: t("Lack of Community", "Kurangnya Komunitas", lang),
                body: t(
                  "Cross-cultural workers are uniquely vulnerable to isolation — geographically, culturally, and relationally. When genuine community is absent, there is no one to name the warning signs, no one to carry part of the weight, no one to reflect back what is being lost. The research is consistent: social support is not a comfort, it is a structural protection against burnout.",
                  "Pekerja lintas budaya sangat rentan terhadap isolasi — secara geografis, budaya, dan relasional. Ketika komunitas yang sejati tidak ada, tidak ada yang bisa menyebutkan tanda-tanda peringatan, tidak ada yang bisa menanggung sebagian beban, tidak ada yang bisa mencerminkan kembali apa yang sedang hilang. Penelitian ini konsisten: dukungan sosial bukan sekadar kenyamanan, melainkan perlindungan struktural terhadap kelelahan.",
                  lang
                ),
              },
              {
                title: t("Lack of Fairness", "Kurangnya Keadilan", lang),
                body: t(
                  "When leaders observe inconsistency in how decisions are made — who receives support, who carries the heaviest loads, whose concerns are heard and whose are dismissed — the cumulative effect is a loss of trust in the system itself. This erosion of trust is one of the more insidious burnout drivers because it is relational and often unspoken.",
                  "Ketika pemimpin mengamati inkonsistensi dalam cara keputusan dibuat — siapa yang mendapat dukungan, siapa yang menanggung beban paling berat, siapa yang keprihatinannya didengar dan siapa yang diabaikan — efek kumulatifnya adalah hilangnya kepercayaan pada sistem itu sendiri. Erosi kepercayaan ini adalah salah satu pendorong kelelahan yang lebih berbahaya karena bersifat relasional dan sering kali tidak terucapkan.",
                  lang
                ),
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                style={{
                  background: navy,
                  borderRadius: 10,
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: "0.75rem",
                }}
              >
                <h3 style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: orange,
                  margin: 0,
                  letterSpacing: "0.02em",
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.88rem",
                  lineHeight: 1.75,
                  color: "oklch(82% 0.03 260)",
                  margin: 0,
                }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3 -- 20-Question Assessment
          ============================================================ */}
      <section style={{ background: offWhite, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("THE ASSESSMENT", "PENILAIAN DIRI", lang)}</p>
          <h2 style={h2Style()}>
            {t("Where Are You on the Risk Spectrum?", "Di Mana Anda di Spektrum Risiko?", lang)}
          </h2>
          <p style={bodyStyle()}>
            {t(
              "This is not a clinical diagnostic. It is a mirror: a way to see patterns that are often invisible from the inside. Burnout, unlike most challenges, is characterised by the person experiencing it being one of the last to notice. The assessment places you on a four-band spectrum and identifies which of the three Montero-Marin patterns is most prominent for you right now.",
              "Ini bukan diagnosis klinis. Ini adalah cermin: cara untuk melihat pola yang sering tidak terlihat dari dalam. Kelelahan, tidak seperti sebagian besar tantangan, ditandai oleh orang yang mengalaminya sebagai salah satu yang terakhir menyadari. Penilaian ini menempatkan Anda pada spektrum empat band dan mengidentifikasi mana dari tiga pola Montero-Marin yang paling menonjol bagi Anda saat ini.",
              lang
            )}
          </p>

          {!showResult ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              {/* Progress bar */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.75rem",
                    color: bodyText,
                    marginBottom: "0.4rem",
                  }}
                >
                  <span>{t(`Question ${currentQ + 1} of 20`, `Pertanyaan ${currentQ + 1} dari 20`, lang)}</span>
                  <span>{Math.round((currentQ / 20) * 100)}%</span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: lightGray,
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(currentQ / 20) * 100}%`,
                      background: orange,
                      borderRadius: "3px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Cluster label */}
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "oklch(60% 0.05 260)",
                  marginBottom: "0.5rem",
                }}
              >
                {currentQ < 7
                  ? t("Pattern: Frenetic", "Pola: Frenetic", lang)
                  : currentQ < 13
                  ? t("Pattern: Underchallenged", "Pola: Underchallenged", lang)
                  : t("Pattern: Worn-Out", "Pola: Worn-Out", lang)}
              </p>

              {/* Question */}
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: navy,
                  lineHeight: 1.5,
                  marginBottom: "1.75rem",
                  minHeight: "3em",
                }}
              >
                {lang === "en" ? questions[currentQ].en : questions[currentQ].id}
              </p>

              {/* Answer options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {answerLabels[lang].map((label, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: answers[currentQ] === i ? 700 : 400,
                      textAlign: "left",
                      padding: "0.75rem 1rem",
                      background: answers[currentQ] === i ? navy : "oklch(95% 0.005 80)",
                      color: answers[currentQ] === i ? offWhite : navy,
                      border: `1.5px solid ${answers[currentQ] === i ? navy : "oklch(80% 0.008 80)"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Back button */}
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ((q) => q - 1)}
                  style={{
                    marginTop: "1.25rem",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.8rem",
                    color: bodyText,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {t("<- Back", "<- Kembali", lang)}
                </button>
              )}
            </div>
          ) : (
            /* RESULT CARD */
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "2.5rem",
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: orange,
                  marginBottom: "0.5rem",
                }}
              >
                {t("Your result", "Hasil Anda", lang)}
              </p>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 600,
                  color: navy,
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                {band === "identity" && t("Working from Identity", "Bekerja dari Identitas", lang)}
                {band === "drifting" && t("Drifting", "Menyimpang", lang)}
                {band === "at-risk" && t("At Risk", "Berisiko", lang)}
                {band === "burning" && t("Burning", "Terbakar", lang)}
              </h3>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.85rem",
                  color: bodyText,
                  marginBottom: "1.25rem",
                }}
              >
                {t(`Score: ${totalScore} / 80`, `Skor: ${totalScore} / 80`, lang)}
              </p>
              <p style={bodyStyle()}>
                {band === "identity" &&
                  t(
                    "Your current pattern shows a sustainable base. You are not immune to drift, but the indicators right now point toward work rooted in identity rather than performance. The challenge at this stage is staying aware: burnout most often takes hold when leaders stop asking the question.",
                    "Pola Anda saat ini menunjukkan fondasi yang berkelanjutan. Anda tidak kebal terhadap penyimpangan, tetapi indikator saat ini menunjukkan pekerjaan yang berakar pada identitas daripada kinerja. Tantangan pada tahap ini adalah tetap waspada: kelelahan paling sering terjadi ketika pemimpin berhenti mengajukan pertanyaan ini.",
                    lang
                  )}
                {band === "drifting" &&
                  t(
                    "Early-stage drift is detectable. You are not in crisis, but patterns are present that (if unaddressed) tend toward depletion. This is the most common result, and the most actionable one. You have enough margin left to change direction before it becomes harder.",
                    "Penyimpangan tahap awal dapat dideteksi. Anda tidak dalam krisis, tetapi ada pola yang (jika tidak ditangani) cenderung menuju penipisan. Ini adalah hasil yang paling umum, dan yang paling dapat ditindaklanjuti. Anda masih memiliki cukup ruang untuk mengubah arah sebelum menjadi lebih sulit.",
                    lang
                  )}
                {band === "at-risk" &&
                  t(
                    "Significant imbalance is present. A recognisable subtype pattern is identifiable in your scores. Intervention is warranted now. Not after the next season, not when things slow down. The practical pathways in Section 5 are directly relevant to where you are.",
                    "Ketidakseimbangan yang signifikan ada. Pola subtipe yang dapat dikenali dapat diidentifikasi dalam skor Anda. Intervensi diperlukan sekarang. Bukan setelah musim berikutnya, bukan ketika segala sesuatunya melambat. Jalur praktis di Bagian 5 langsung relevan dengan posisi Anda.",
                    lang
                  )}
                {band === "burning" &&
                  t(
                    "Acute burnout indicators are present. Please read this carefully: this module can offer a framework and a first step, but it cannot replace the support of a trusted person, a supervisor, a counsellor, or a doctor. Naming what is happening is the most important thing you can do right now. You are not alone, and this is not the end.",
                    "Indikator kelelahan akut ada. Mohon baca ini dengan seksama: modul ini dapat memberikan kerangka kerja dan langkah pertama, tetapi tidak dapat menggantikan dukungan dari orang yang dipercaya, atasan, konselor, atau dokter. Menamai apa yang terjadi adalah hal terpenting yang dapat Anda lakukan sekarang. Anda tidak sendirian, dan ini bukan akhirnya.",
                    lang
                  )}
              </p>
              <div
                style={{
                  background: "oklch(95% 0.005 80)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  borderLeft: `4px solid ${orange}`,
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: navy,
                    marginBottom: "0.5rem",
                    marginTop: 0,
                  }}
                >
                  {t("Dominant pattern", "Pola dominan", lang)}:{" "}
                  {dominantSubtype === "frenetic" && t("Frenetic", "Frenetic", lang)}
                  {dominantSubtype === "underchallenged" && t("Underchallenged", "Underchallenged", lang)}
                  {dominantSubtype === "worn-out" && t("Worn-Out", "Worn-Out", lang)}
                </p>
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.85rem",
                    color: bodyText,
                    margin: 0,
                  }}
                >
                  {t("One honest next step:", "Satu langkah jujur berikutnya:", lang)}{" "}
                  {band === "identity" &&
                    t(
                      "Use the burning-emotions card in the Faith Anchor section as a regular personal check-in.",
                      "Gunakan kartu emosi-terbakar di bagian Jangkar Iman sebagai pemeriksaan pribadi yang teratur.",
                      lang
                    )}
                  {band === "drifting" &&
                    t(
                      "Read Section 4 (The Drift Nobody Planned) carefully. Then identify which burning emotion from Section 6 has been driving the drift.",
                      "Baca Bagian 4 (Penyimpangan yang Tidak Direncanakan Siapapun) dengan seksama. Kemudian identifikasi emosi terbakar mana dari Bagian 6 yang telah mendorong penyimpangan.",
                      lang
                    )}
                  {band === "at-risk" &&
                    t(
                      "Go directly to Section 5 and find the pathway that matches your dominant subtype. Then share your result with one person you trust.",
                      "Langsung ke Bagian 5 dan temukan jalur yang sesuai dengan subtipe dominan Anda. Kemudian bagikan hasil Anda dengan satu orang yang Anda percaya.",
                      lang
                    )}
                  {band === "burning" &&
                    t(
                      "Section 5 (the Worn-Out pathway) is written for where you are. Please also reach out to someone today.",
                      "Bagian 5 (jalur Worn-Out) ditulis untuk posisi Anda. Mohon juga hubungi seseorang hari ini.",
                      lang
                    )}
                </p>
              </div>
              <button
                onClick={() => {
                  setAnswers(Array(20).fill(null));
                  setCurrentQ(0);
                  setShowResult(false);
                }}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: navy,
                  background: "transparent",
                  border: `1.5px solid ${navy}`,
                  borderRadius: "6px",
                  padding: "0.6rem 1.25rem",
                  cursor: "pointer",
                }}
              >
                {t("Retake assessment", "Ulangi penilaian", lang)}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          SECTION 4 -- The Drift Nobody Planned
          ============================================================ */}
      <section style={{ background: navy, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("THE ROOT", "AKAR MASALAH", lang)}</p>
          <h2 style={h2Style(true)}>
            {t("The Drift Nobody Planned", "Penyimpangan yang Tidak Direncanakan Siapapun", lang)}
          </h2>
          <p style={bodyStyle(true)}>
            {t(
              "Most burnouts among ministry and cross-cultural leaders are not caused primarily by working too hard. They happen when, gradually and often invisibly, the leader drifts from serving out of God's calling and wisdom to serving out of their own ambition, expectations, fears, or need for results. The distinction is not between effort and rest. It is between identity and performance. And it rarely announces itself.",
              "Sebagian besar kelelahan di antara pemimpin pelayanan dan lintas budaya tidak disebabkan terutama oleh terlalu banyak bekerja. Itu terjadi ketika, secara bertahap dan sering tidak terlihat, pemimpin menyimpang dari melayani berdasarkan panggilan dan hikmat Allah ke melayani berdasarkan ambisi, harapan, ketakutan, atau kebutuhan akan hasil sendiri. Perbedaannya bukan antara usaha dan istirahat. Melainkan antara identitas dan kinerja. Dan itu jarang mengumumkan dirinya sendiri.",
              lang
            )}
          </p>
          <p style={bodyStyle(true)}>
            {t(
              "Selfish ambition does not announce itself as selfish ambition. In ministry and cross-cultural work, it wears ministry clothes. It sounds like vision, like faithfulness, like sacrifice, like responsibility. The leader who cannot delegate because the standard will drop: that may not be diligence; it may be control. The leader who cannot rest because the need is too great: that may not be calling; it may be fear of what happens to their sense of worth when the output stops. The leader who cannot receive help without feeling ashamed: that is not strength; that is isolation wearing the face of faith.",
              "Ambisi egois tidak mengumumkan dirinya sebagai ambisi egois. Dalam pelayanan dan pekerjaan lintas budaya, ia mengenakan pakaian pelayanan. Terdengar seperti visi, seperti kesetiaan, seperti pengorbanan, seperti tanggung jawab. Pemimpin yang tidak bisa mendelegasikan karena standar akan menurun: itu mungkin bukan ketekunan; mungkin kontrol. Pemimpin yang tidak bisa beristirahat karena kebutuhan terlalu besar: itu mungkin bukan panggilan; mungkin ketakutan akan apa yang terjadi pada rasa nilai diri mereka ketika output berhenti. Pemimpin yang tidak bisa menerima bantuan tanpa merasa malu: itu bukan kekuatan; itu isolasi yang mengenakan wajah iman.",
              lang
            )}
          </p>
          <p style={bodyStyle(true)}>
            {t(
              "In 1 Kings 19, Elijah collapses under a broom tree after his greatest public victory. An angel arrives. Not with a word of correction or a theological challenge. With food and water, twice. 'The journey is too great for you.' God's first response to burnout is physical. Rest before duty. Body before soul. No rebuke. When Elijah finally speaks, God listens. When Elijah finally walks again, God meets him not in the fire or the earthquake or the wind, but in the still small voice. Recovery from burnout is not spectacular. It is slow, quiet, and arrives in the spaces where noise has finally stopped.",
              "Dalam 1 Raja-raja 19, Elia runtuh di bawah pohon aras setelah kemenangan publik terbesarnya. Seorang malaikat datang. Bukan dengan kata-kata koreksi atau tantangan teologis. Dengan makanan dan air, dua kali. 'Perjalanan ini terlalu berat bagimu.' Respons pertama Allah terhadap kelelahan bersifat fisik. Istirahat sebelum kewajiban. Tubuh sebelum jiwa. Tidak ada teguran. Ketika Elia akhirnya berbicara, Allah mendengarkan. Ketika Elia akhirnya berjalan lagi, Allah menemuinya bukan dalam api atau gempa bumi atau angin, tetapi dalam suara yang sunyi dan lembut. Pemulihan dari kelelahan bukanlah hal yang spektakuler. Ini lambat, tenang, dan tiba di ruang di mana kebisingan akhirnya berhenti.",
              lang
            )}
          </p>

          {/* Dig Deeper -- Section 4 */}
          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={() => setDigOpen4((v) => !v)}
              aria-expanded={digOpen4}
              aria-controls="dig-deeper-s4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: offWhite,
                background: "transparent",
                border: `1.5px solid oklch(60% 0.05 260)`,
                borderRadius: "6px",
                padding: "0.6rem 1.25rem",
                cursor: "pointer",
              }}
            >
              {t("Dig Deeper ->", "Pelajari Lebih Lanjut ->", lang)}
            </button>
            <div
              id="dig-deeper-s4"
              role="region"
              aria-label={t("Additional depth", "Kedalaman tambahan", lang)}
              style={{
                display: "grid",
                gridTemplateRows: digOpen4 ? "1fr" : "0fr",
                transition: "grid-template-rows 0.3s ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    marginTop: "1.25rem",
                    padding: "1.5rem",
                    background: "oklch(28% 0.08 260)",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${orange}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: offWhite,
                      marginBottom: "0.75rem",
                      marginTop: 0,
                    }}
                  >
                    {t("Recognising the drift in real time", "Mengenali penyimpangan secara real-time", lang)}
                  </p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", lineHeight: 1.8, color: "oklch(82% 0.01 80)", margin: 0 }}>
                    {t(
                      "Four signs that the drift has begun: (1) You feel guilty when you are not working, even during designated rest. (2) You have stopped being honest with the people closest to you about how you are actually doing. (3) The work has stopped being something you do from a place of fullness and started feeling like something you owe. (4) Your physical health, sleep quality, or key relationships have quietly deteriorated, and you have not named it to anyone.",
                      "Empat tanda bahwa penyimpangan telah dimulai: (1) Anda merasa bersalah ketika tidak bekerja, bahkan selama waktu istirahat yang ditetapkan. (2) Anda telah berhenti jujur dengan orang-orang terdekat Anda tentang bagaimana keadaan Anda sebenarnya. (3) Pekerjaan telah berhenti menjadi sesuatu yang Anda lakukan dari tempat yang penuh dan mulai terasa seperti sesuatu yang Anda utang. (4) Kesehatan fisik, kualitas tidur, atau hubungan kunci Anda telah menurun diam-diam, dan Anda belum memberitahukannya kepada siapa pun.",
                      lang
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5 -- Prevention: Three Patterns That Lead to Burnout
          ============================================================ */}
      <section style={{ background: offWhite, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("PREVENTION", "PENCEGAHAN", lang)}</p>
          <h2 style={h2Style()}>
            {t("Three Patterns That Lead to Burnout", "Tiga Pola yang Menuju Kelelahan", lang)}
          </h2>
          <p style={bodyStyle()}>
            {t(
              "Burnout doesn't announce itself. Each of the three subtypes has a distinctive pattern — a set of habits, pressures, and responses that, if left unchecked, deepen into the full syndrome. The goal here is not recovery from burnout already established. It is recognition and early action: seeing the path you are on, and choosing to turn while there is still room to turn.",
              "Kelelahan tidak mengumumkan dirinya sendiri. Setiap dari tiga subtipe memiliki pola tersendiri — serangkaian kebiasaan, tekanan, dan respons yang, jika tidak ditangani, akan semakin dalam menjadi sindrom penuh. Tujuan di sini bukan pemulihan dari kelelahan yang sudah terjadi. Ini adalah pengenalan dan tindakan dini: melihat jalur yang Anda tempuh, dan memilih untuk berbalik selagi masih ada ruang untuk berbalik.",
              lang
            )}
          </p>

          {/* Pathway accordion cards */}
          {[
            {
              key: "frenetic",
              title: t("If you tend toward frenetic: build in permission to stop", "Jika Anda cenderung frenetic: bangun izin untuk berhenti", lang),
              body: t(
                "The earliest intervention for this pattern — before depletion sets in — is identity-based permission to stop: not efficiency advice or better time management. Build non-negotiable recovery anchors into the week as structural commitments, not suggestions. Identify one person who has explicit permission to name the warning signs when they appear. Return now to the question of whether the work is held as servant or master of your calling. Walter Brueggemann's⁷ observation applies directly here: in a culture that treats availability as virtue and busyness as faithfulness, choosing to stop is a theological statement. The fourth commandment was not a productivity recommendation. It was a declaration of freedom.",
                "Intervensi paling awal untuk pola ini — sebelum kelelahan benar-benar melanda — adalah izin berbasis identitas untuk berhenti: bukan saran efisiensi atau manajemen waktu yang lebih baik. Bangun jangkar pemulihan yang tidak bisa dinegosiasikan ke dalam minggu sebagai komitmen struktural, bukan sekadar saran. Identifikasi satu orang yang memiliki izin eksplisit untuk menamai tanda-tanda peringatan ketika mereka muncul. Kembalilah sekarang ke pertanyaan apakah pekerjaan dipegang sebagai pelayan atau tuan dari panggilan Anda. Pengamatan Walter Brueggemann⁷ berlaku langsung di sini: dalam budaya yang memperlakukan ketersediaan sebagai kebajikan dan kesibukan sebagai kesetiaan, memilih untuk berhenti adalah pernyataan teologis. Perintah keempat bukanlah rekomendasi produktivitas. Itu adalah deklarasi kebebasan.",
                lang
              ),
            },
            {
              key: "underchallenged",
              title: t("If you tend toward underchallenged: pursue renewed purpose now", "Jika Anda cenderung underchallenged: temukan tujuan yang diperbarui sekarang", lang),
              body: t(
                "The intervention here is renewed purpose and craft challenge, not more rest. Have an honest conversation with leadership about role fit, skill match, and how your best contribution is actually being used. Build peer relationships with people doing substantive work in your field. Ask the specific question beneath the general one: not just 'am I called to this kind of work?' but 'what is the particular thing I am made to do, and is there room for it here?' The Jethro model from Exodus 18 is relevant: Jethro did not tell Moses to pray more or manage his stress better. He looked at the structure and said it was not good, and then he changed the structure.",
                "Intervensi di sini adalah tujuan yang diperbarui dan tantangan kerajinan, bukan lebih banyak istirahat. Lakukan percakapan jujur dengan kepemimpinan tentang kesesuaian peran, kecocokan keterampilan, dan bagaimana kontribusi terbaik Anda sebenarnya digunakan. Bangun hubungan rekan dengan orang-orang yang melakukan pekerjaan substantif di bidang Anda. Ajukan pertanyaan spesifik di balik pertanyaan umum: bukan hanya 'apakah saya dipanggil untuk jenis pekerjaan ini?' tetapi 'apa hal khusus yang saya diciptakan untuk lakukan, dan apakah ada ruang untuk itu di sini?' Model Yitro dari Keluaran 18 relevan: Yitro tidak memberitahu Musa untuk lebih berdoa atau mengelola stresnya dengan lebih baik. Ia melihat strukturnya dan berkata itu tidak baik, dan kemudian ia mengubah strukturnya.",
                lang
              ),
            },
            {
              key: "worn-out",
              title: t("If you see worn-out signs: seek honest assessment today", "Jika Anda melihat tanda-tanda worn-out: cari penilaian jujur sekarang", lang),
              body: t(
                "This is the pattern where the window to act is narrowing. When worn-out signs appear — apathy, detachment, the sense that effort no longer matters — the most important move is honest assessment before the trajectory tips further. The question is not whether you can push through. It is whether you can see clearly enough to act now. The structural and relational drivers that produce this pattern need to change, not just individual coping strategies. This module can offer a framework and a starting point. It cannot replace a trusted counsellor, a wise supervisor, a doctor, or a member care worker. If you are showing signs in this range, the most important next step is not more content. It is to tell one person the truth about where you actually are today.",
                "Ini adalah pola di mana jendela untuk bertindak semakin menyempit. Ketika tanda-tanda worn-out muncul — apatis, terlepas, perasaan bahwa upaya tidak lagi berarti — langkah terpenting adalah penilaian jujur sebelum lintasan semakin dalam. Pertanyaannya bukan apakah Anda bisa terus bertahan. Melainkan apakah Anda bisa melihat dengan cukup jelas untuk bertindak sekarang. Pendorong struktural dan relasional yang menghasilkan pola ini perlu berubah, bukan hanya strategi koping individu. Modul ini dapat menawarkan kerangka kerja dan titik awal. Ini tidak dapat menggantikan konselor yang dipercaya, pengawas yang bijak, dokter, atau pekerja perawatan anggota. Jika Anda menunjukkan tanda-tanda dalam rentang ini, langkah terpenting selanjutnya bukan lebih banyak konten. Melainkan menceritakan kebenaran kepada satu orang tentang posisi Anda sebenarnya hari ini.",
                lang
              ),
            },
          ].map(({ key, title, body }) => (
            <div
              key={key}
              style={{
                marginBottom: "1rem",
                border: `1.5px solid oklch(80% 0.008 80)`,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setPathOpen(pathOpen === key ? null : key)}
                aria-expanded={pathOpen === key}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "1.25rem 1.5rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: navy,
                  background: pathOpen === key ? "oklch(94% 0.007 80)" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {title}
                <span style={{ fontSize: "1.1rem", color: orange }}>{pathOpen === key ? "−" : "+"}</span>
              </button>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: pathOpen === key ? "1fr" : "0fr",
                  transition: "grid-template-rows 0.3s ease",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      color: bodyText,
                      padding: "0 1.5rem 1.5rem",
                      margin: 0,
                    }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Reflect-and-Mark Checklist */}
          <div style={{ marginTop: "3rem" }}>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 600,
                color: navy,
                marginBottom: "1.5rem",
                marginTop: 0,
              }}
            >
              {t("This Week: Reflect and Mark", "Minggu Ini: Renungkan dan Tandai", lang)}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {[
                {
                  col: t("Before the Week Begins", "Sebelum Minggu Dimulai", lang),
                  items: lang === "en"
                    ? [
                        "Name one boundary I will protect this week",
                        "Identify who has permission to check on me honestly",
                        "Choose one recovery practice I will protect (sleep, movement, silence)",
                        "Review whether my workload this week is sustainable",
                        "Pray or reflect: am I working from rest, or toward it?",
                      ]
                    : [
                        "Namai satu batasan yang akan saya lindungi minggu ini",
                        "Identifikasi siapa yang memiliki izin untuk memeriksa saya secara jujur",
                        "Pilih satu praktik pemulihan yang akan saya lindungi (tidur, gerak, keheningan)",
                        "Tinjau apakah beban kerja saya minggu ini berkelanjutan",
                        "Berdoa atau renungkan: apakah saya bekerja dari istirahat, atau menuju istirahat?",
                      ],
                },
                {
                  col: t("In the Day's Work", "Dalam Pekerjaan Harian", lang),
                  items: lang === "en"
                    ? [
                        "Notice when guilt, not purpose, is driving the pace",
                        "Take one complete break away from screens",
                        "Ask one honest question before taking on a new task",
                        "Protect the quality of sleep tonight",
                        "Check in with one person about how they are actually doing",
                      ]
                    : [
                        "Perhatikan ketika rasa bersalah, bukan tujuan, yang mendorong kecepatan",
                        "Ambil satu istirahat lengkap jauh dari layar",
                        "Ajukan satu pertanyaan jujur sebelum mengambil tugas baru",
                        "Lindungi kualitas tidur malam ini",
                        "Hubungi satu orang tentang bagaimana keadaan mereka sebenarnya",
                      ],
                },
                {
                  col: t("When Pressure Peaks", "Ketika Tekanan Memuncak", lang),
                  items: lang === "en"
                    ? [
                        "Name what is driving the pressure (fear / comparison / control / recognition)",
                        "Ask: is this mine to carry, or have I taken it from someone else?",
                        "Choose one thing to let go of today. Not postpone. Let go.",
                        "Remember: Jesus worked from rest. The yoke is easy, the burden is light.",
                        "Tell someone the truth about where I am today",
                      ]
                    : [
                        "Namai apa yang mendorong tekanan (ketakutan / perbandingan / kontrol / pengakuan)",
                        "Tanya: apakah ini milik saya untuk ditanggung, atau saya ambil dari orang lain?",
                        "Pilih satu hal untuk dilepaskan hari ini. Bukan ditunda. Dilepaskan.",
                        "Ingat: Yesus bekerja dari istirahat. Kuk itu enak, bebannya ringan.",
                        "Ceritakan kebenaran kepada seseorang tentang di mana saya hari ini",
                      ],
                },
              ].map(({ col, items }) => (
                <div key={col}>
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: orange,
                      marginBottom: "0.75rem",
                      marginTop: 0,
                    }}
                  >
                    {col}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {items.map((item, i) => {
                      const ck = `${col}-${i}`;
                      return (
                        <li
                          key={ck}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.6rem",
                            marginBottom: "0.6rem",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleCheck(ck)}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              width: "18px",
                              height: "18px",
                              marginTop: "2px",
                              border: `2px solid ${checked[ck] ? orange : "oklch(65% 0.03 260)"}`,
                              borderRadius: "3px",
                              background: checked[ck] ? orange : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: 700,
                              transition: "all 0.15s ease",
                            }}
                          >
                            {checked[ck] ? "✓" : ""}
                          </span>
                          <span
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                              fontSize: "0.85rem",
                              lineHeight: 1.6,
                              color: checked[ck] ? "oklch(55% 0.03 260)" : bodyText,
                              textDecoration: "none",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6 -- Faith Anchor: Two Wisdoms
          ============================================================ */}
      <section style={{ background: navy, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("FAITH ANCHOR", "JANGKAR IMAN", lang)}</p>
          <h2 style={h2Style(true)}>{t("Two Wisdoms", "Dua Hikmat", lang)}</h2>

          {/* Scripture block -- James 3 */}
          <blockquote
            style={{
              borderLeft: `4px solid ${orange}`,
              paddingLeft: "1.5rem",
              margin: "0 0 2rem 0",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(17px, 2.2vw, 21px)",
                fontStyle: "italic",
                lineHeight: 1.7,
                color: "oklch(88% 0.008 80)",
                marginBottom: "0.5rem",
              }}
            >
              {t(
                "If you are wise and understand God's ways, prove it by living an honorable life, doing good works with the humility that comes from wisdom. But if you are bitterly jealous and there is selfish ambition in your heart, don't cover up the truth with boasting and lying. For jealousy and selfishness are not God's kind of wisdom. Such things are earthly, unspiritual, and demonic. For wherever there is jealousy and selfish ambition, there you will find disorder and evil of every kind. But the wisdom from above is first of all pure. It is also peace loving, gentle at all times, and willing to yield to others. It is full of mercy and the power to do good.",
                "Jika kamu bijaksana dan mengerti jalan Allah, buktikanlah dengan hidup yang terhormat dan dengan perbuatan baik yang dilakukan dengan kerendahan hati yang datang dari kebijaksanaan. Tetapi jika kamu sangat cemburu dan ada ambisi egois dalam hatimu, janganlah menutupi kebenaran dengan membual dan berbohong. Sebab kecemburuan dan keegoisan bukanlah hikmat Allah. Hal-hal seperti itu bersifat duniawi, tidak rohani, dan bersifat iblis. Sebab di mana pun ada kecemburuan dan ambisi egois, di sana kamu akan menemukan ketidakteraturan dan segala kejahatan. Tetapi hikmat yang dari atas pertama-tama murni. Ia juga mencintai perdamaian, selalu lembut, dan mau mengalah kepada orang lain. Ia penuh belas kasihan dan kuasa untuk berbuat baik.",
                lang
              )}
            </p>
            <cite
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.8rem",
                color: "oklch(70% 0.03 260)",
                fontStyle: "normal",
              }}
            >
              {t("James 3:13-17 (NLT)", "Yakobus 3:13-17 (BIS)", lang)}
            </cite>
          </blockquote>

          <p style={bodyStyle(true)}>
            {t(
              "James is not describing two categories of people. He is describing two modes of operating that any person can inhabit, sometimes in the same week. Earthly wisdom drives from zelos: burning emotional energy, comparison, the need to produce and be seen. It feels urgent and motivated. It produces disorder. Wisdom from above is pure, peace-loving, willing to yield. It is not passive or unproductive; it produces fruit. But its source is different. The diagnostic question is not how hard you are working. It is from where.",
              "Yakobus tidak menggambarkan dua kategori orang. Ia menggambarkan dua mode beroperasi yang dapat dihuni siapa saja, kadang-kadang dalam minggu yang sama. Hikmat duniawi bergerak dari zelos: energi emosional yang membara, perbandingan, kebutuhan untuk menghasilkan dan dilihat. Rasanya mendesak dan termotivasi. Ini menghasilkan ketidaktertiban. Hikmat dari atas murni, mencintai perdamaian, mau mengalah. Ini tidak pasif atau tidak produktif; ini menghasilkan buah. Tetapi sumbernya berbeda. Pertanyaan diagnostik bukan seberapa keras Anda bekerja. Melainkan dari mana.",
              lang
            )}
          </p>

          {/* Burning-emotions card-pick */}
          <div style={{ marginTop: "2.5rem", marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "oklch(82% 0.01 80)",
                marginBottom: "1.5rem",
              }}
            >
              {t(
                "James names two roots: bitter envy and selfish ambition. From those roots grow recognisable patterns. Which of these feels most present in you right now?",
                "Yakobus menyebut dua akar: iri hati yang pahit dan ambisi yang mementingkan diri. Dari akar-akar itu tumbuh pola yang dapat dikenali. Mana yang paling terasa dalam diri Anda saat ini?",
                lang
              )}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {[
                {
                  key: "fear",
                  icon: "◇",
                  label: t("Fear", "Ketakutan", lang),
                  reflection: {
                    en: "What are you afraid will happen if you slow down or let go? Name it specifically: not 'things will fall apart' but what specifically you fear losing.",
                    id: "Apa yang Anda takutkan akan terjadi jika Anda memperlambat atau melepaskan? Namai secara spesifik: bukan 'semuanya akan hancur' tetapi apa yang secara spesifik Anda takutkan untuk kehilangan.",
                  },
                },
                {
                  key: "comparison",
                  icon: "⟷",
                  label: t("Comparison", "Perbandingan", lang),
                  reflection: {
                    en: "Whose output, reach, or recognition have you been measuring yourself against? What does that comparison cost you, and what would it free you from if you stopped?",
                    id: "Output, jangkauan, atau pengakuan siapa yang telah Anda jadikan tolok ukur diri Anda? Apa biaya perbandingan itu bagi Anda, dan dari apa Anda akan bebas jika berhenti?",
                  },
                },
                {
                  key: "frustration",
                  icon: "△",
                  label: t("Frustration", "Frustrasi", lang),
                  reflection: {
                    en: "What expectation (of yourself, your work, or God) is not being met? Is the expectation yours, or was it given to you by someone else?",
                    id: "Harapan apa (terhadap diri sendiri, pekerjaan Anda, atau Allah) yang tidak terpenuhi? Apakah harapan itu milik Anda, atau diberikan kepada Anda oleh orang lain?",
                  },
                },
                {
                  key: "pride",
                  icon: "◉",
                  label: t("Pride", "Kebanggaan", lang),
                  reflection: {
                    en: "Where have you made yourself indispensable? What would actually happen (in the work, in the team, in God's purposes) if you stepped back or asked for help?",
                    id: "Di mana Anda telah membuat diri Anda tak tergantikan? Apa yang sebenarnya akan terjadi (dalam pekerjaan, dalam tim, dalam tujuan Allah) jika Anda mundur atau meminta bantuan?",
                  },
                },
                {
                  key: "recognition",
                  icon: "☆",
                  label: t("Desire for recognition", "Keinginan akan pengakuan", lang),
                  reflection: {
                    en: "Who do you most want to notice the work you are doing? What would it mean if they never did, and what does that tell you about where your worth is rooted?",
                    id: "Siapa yang paling ingin Anda perhatikan untuk pekerjaan yang Anda lakukan? Apa artinya jika mereka tidak pernah melakukannya, dan apa yang itu katakan tentang di mana akar nilai diri Anda?",
                  },
                },
                {
                  key: "control",
                  icon: "⊞",
                  label: t("Control", "Kontrol", lang),
                  reflection: {
                    en: "What are you currently managing that you were never meant to carry alone? What would it look like to trust God and the people around you with a piece of it this week?",
                    id: "Apa yang Anda kelola saat ini yang tidak pernah dimaksudkan untuk Anda tanggung sendiri? Seperti apa tampaknya untuk mempercayai Allah dan orang-orang di sekitar Anda dengan sebagian dari itu minggu ini?",
                  },
                },
              ].map(({ key, label, reflection }) => {
                const isSelected = selectedEmotion === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedEmotion(isSelected ? null : key)}
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      textAlign: "center",
                      padding: "0.65rem 0.75rem",
                      background: isSelected ? orange : "oklch(28% 0.08 260)",
                      color: isSelected ? "#fff" : "oklch(82% 0.01 80)",
                      border: `1.5px solid ${isSelected ? orange : "oklch(38% 0.08 260)"}`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Reflection reveal */}
            {selectedEmotion && (
              <div
                style={{
                  background: "oklch(28% 0.08 260)",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  borderLeft: `4px solid ${orange}`,
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: orange,
                    marginBottom: "0.75rem",
                    marginTop: 0,
                  }}
                >
                  {t("Reflect", "Renungkan", lang)}
                </p>
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    color: "oklch(85% 0.01 80)",
                    margin: 0,
                  }}
                >
                  {(() => {
                    const emotions: Record<string, { en: string; id: string }> = {
                      fear: {
                        en: "What are you afraid will happen if you slow down or let go? Name it specifically: not 'things will fall apart' but what specifically you fear losing.",
                        id: "Apa yang Anda takutkan akan terjadi jika Anda memperlambat atau melepaskan? Namai secara spesifik: bukan 'semuanya akan hancur' tetapi apa yang secara spesifik Anda takutkan untuk kehilangan.",
                      },
                      comparison: {
                        en: "Whose output, reach, or recognition have you been measuring yourself against? What does that comparison cost you, and what would it free you from if you stopped?",
                        id: "Output, jangkauan, atau pengakuan siapa yang telah Anda jadikan tolok ukur diri Anda? Apa biaya perbandingan itu bagi Anda, dan dari apa Anda akan bebas jika berhenti?",
                      },
                      frustration: {
                        en: "What expectation (of yourself, your work, or God) is not being met? Is the expectation yours, or was it given to you by someone else?",
                        id: "Harapan apa (terhadap diri sendiri, pekerjaan Anda, atau Allah) yang tidak terpenuhi? Apakah harapan itu milik Anda, atau diberikan kepada Anda oleh orang lain?",
                      },
                      pride: {
                        en: "Where have you made yourself indispensable? What would actually happen (in the work, in the team, in God's purposes) if you stepped back or asked for help?",
                        id: "Di mana Anda telah membuat diri Anda tak tergantikan? Apa yang sebenarnya akan terjadi (dalam pekerjaan, dalam tim, dalam tujuan Allah) jika Anda mundur atau meminta bantuan?",
                      },
                      recognition: {
                        en: "Who do you most want to notice the work you are doing? What would it mean if they never did, and what does that tell you about where your worth is rooted?",
                        id: "Siapa yang paling ingin Anda perhatikan untuk pekerjaan yang Anda lakukan? Apa artinya jika mereka tidak pernah melakukannya, dan apa yang itu katakan tentang di mana akar nilai diri Anda?",
                      },
                      control: {
                        en: "What are you currently managing that you were never meant to carry alone? What would it look like to trust God and the people around you with a piece of it this week?",
                        id: "Apa yang Anda kelola saat ini yang tidak pernah dimaksudkan untuk Anda tanggung sendiri? Seperti apa tampaknya untuk mempercayai Allah dan orang-orang di sekitar Anda dengan sebagian dari itu minggu ini?",
                      },
                    };
                    const e = emotions[selectedEmotion];
                    return lang === "en" ? e.en : e.id;
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Birds paragraph */}
          <p style={bodyStyle(true)}>
            {t(
              "God made birds to fly. Flying is their identity: it costs energy, but it does not burn them out, because they are operating from what they were made for. A fish swimming costs energy. Neither bird nor fish burns out from doing what they are made to do. We burn out when our identity shifts from 'what I am made for' to 'what I must produce.' Working from identity costs energy. Working from fear, ambition, or need for recognition consumes it.",
              "Allah menciptakan burung untuk terbang. Terbang adalah identitas mereka: ini membutuhkan energi, tetapi tidak membuat mereka kelelahan, karena mereka beroperasi dari apa yang mereka diciptakan untuk lakukan. Ikan berenang membutuhkan energi. Baik burung maupun ikan tidak kelelahan dari melakukan apa yang mereka diciptakan untuk lakukan. Kita kelelahan ketika identitas kita bergeser dari 'apa yang saya diciptakan untuk lakukan' ke 'apa yang harus saya hasilkan.' Bekerja dari identitas membutuhkan energi. Bekerja dari ketakutan, ambisi, atau kebutuhan akan pengakuan menghabiskannya.",
              lang
            )}
          </p>

          {/* Commissioning -- 1 Corinthians */}
          <blockquote
            style={{
              borderLeft: `4px solid oklch(45% 0.08 260)`,
              paddingLeft: "1.5rem",
              margin: "0",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(16px, 2vw, 19px)",
                fontStyle: "italic",
                lineHeight: 1.7,
                color: "oklch(80% 0.008 80)",
                marginBottom: "0.5rem",
              }}
            >
              {t(
                "God chose things the world considers foolish in order to shame those who think they are wise. And he chose things that are powerless to shame those who are powerful. God chose things despised by the world, things counted as nothing at all, and used them to bring to nothing what the world considers important. As a result, no one can ever boast in the presence of God.",
                "Allah memilih hal-hal yang dianggap bodoh oleh dunia untuk mempermalukan orang-orang yang merasa bijaksana. Dan Dia memilih hal-hal yang tidak berdaya untuk mempermalukan orang-orang yang berkuasa. Allah memilih hal-hal yang tidak dihormati di dunia, hal-hal yang dianggap tidak berarti sama sekali, dan menggunakannya untuk meniadakan apa yang dianggap penting oleh dunia. Sebagai hasilnya, tidak ada seorang pun yang dapat membanggakan diri di hadirat Allah.",
                lang
              )}
            </p>
            <cite
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.8rem",
                color: "oklch(65% 0.03 260)",
                fontStyle: "normal",
              }}
            >
              {t("1 Corinthians 1:27-29 (NLT)", "1 Korintus 1:27-29 (BIS)", lang)}
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ============================================================
          SECTION 7 -- Key Takeaways
          ============================================================ */}
      <section style={{ background: lightGray, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("KEY TAKEAWAYS", "POIN-POIN UTAMA", lang)}</p>
          <h2 style={h2Style()}>{t("What to Carry Forward", "Yang Perlu Dibawa Ke Depan", lang)}</h2>
          <ol
            style={{
              paddingLeft: "1.25rem",
              margin: 0,
            }}
          >
            {(lang === "en"
              ? [
                  "Burnout is not primarily a time-management failure. It is a diagnosis of a system under pressure, often driven by a gradual drift from working out of calling to working out of ambition, fear, or need for results.",
                  "Montero-Marín's³ three subtypes (frenetic, underchallenged, and worn-out) respond to different drivers and need different interventions. Recognising your own pattern is the first step toward a response that actually fits.",
                  "God's response to Elijah's collapse was physical before it was spiritual. Food, water, rest, then the still small voice. The body is not separate from the spiritual life. It is the place where the spiritual life is lived.",
                  "Selfish ambition often wears ministry clothes. It sounds like vision, faithfulness, responsibility, even sacrifice. The diagnostic question is not how much you are working. It is from where.",
                  "Working from identity costs energy but does not burn you out. The drift begins when we start to serve the results rather than the calling from which those results flow.",
                ]
              : [
                  "Kelelahan bukan terutama kegagalan manajemen waktu. Ini adalah diagnosis sistem di bawah tekanan, sering didorong oleh penyimpangan bertahap dari bekerja berdasarkan panggilan ke bekerja berdasarkan ambisi, ketakutan, atau kebutuhan akan hasil.",
                  "Tiga subtipe Montero-Marín³ (frenetic, underchallenged, dan worn-out) merespons pendorong yang berbeda dan membutuhkan intervensi yang berbeda. Mengenali pola Anda sendiri adalah langkah pertama menuju respons yang benar-benar sesuai.",
                  "Respons Allah terhadap keruntuhan Elia bersifat fisik sebelum rohani. Makanan, air, istirahat, kemudian suara yang sunyi dan lembut. Tubuh tidak terpisah dari kehidupan rohani. Itu adalah tempat di mana kehidupan rohani dijalani.",
                  "Ambisi egois sering mengenakan pakaian pelayanan. Terdengar seperti visi, kesetiaan, tanggung jawab, bahkan pengorbanan. Pertanyaan diagnostik bukan seberapa banyak Anda bekerja, melainkan dari mana.",
                  "Bekerja dari identitas membutuhkan energi tetapi tidak membuat Anda kelelahan. Penyimpangan dimulai ketika kita mulai melayani hasil daripada panggilan dari mana hasil itu mengalir.",
                ]
            ).map((item, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  color: bodyText,
                  marginBottom: "1rem",
                  paddingLeft: "0.25rem",
                }}
              >
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================
          FOR TEAM LEADERS CALLOUT
          ============================================================ */}
      <div style={{ background: "oklch(93% 0.005 80)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div
            style={{
              border: "1.5px solid oklch(82% 0.012 80)",
              borderRadius: 12,
              background: "oklch(97% 0.004 80)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "28px 32px 24px" }}>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  color: orange,
                  margin: "0 0 10px 0",
                }}
              >
                {t("For Team Leaders", "Untuk Pemimpin Tim", lang)}
              </p>
              <button
                onClick={() => setLeaderOpen((v) => !v)}
                aria-expanded={leaderOpen}
                aria-controls="leader-callout-body"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left" as const,
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(22px, 3vw, 30px)",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: navy,
                    margin: 0,
                  }}
                >
                  {t("If You Lead a Cross-Cultural Team", "Jika Kamu Memimpin Tim Lintas Budaya", lang)}
                </h3>
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: leaderOpen ? "#fff" : orange,
                    border: `1.5px solid ${orange}`,
                    borderRadius: 8,
                    padding: "6px 14px",
                    whiteSpace: "nowrap" as const,
                    transition: "background 0.15s ease, color 0.15s ease",
                    background: leaderOpen ? orange : "transparent",
                  }}
                >
                  {leaderOpen ? t("Close", "Tutup", lang) + " ↑" : t("Read", "Baca", lang) + " →"}
                </span>
              </button>
            </div>
            <div
              id="leader-callout-body"
              role="region"
              aria-label={t("For Team Leaders content", "Konten untuk pemimpin tim", lang)}
              style={{
                display: "grid",
                gridTemplateRows: leaderOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.3s ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    borderTop: "1px solid oklch(85% 0.008 80)",
                    padding: "24px 32px 32px",
                  }}
                >
                  {(lang === "en" ? [
                    "When someone on your team burns out, the instinct is to focus on them, to offer support, rest, or counselling. That matters. But research by Leiter and Maslach shows something uncomfortable: the same person placed in a different organisational context frequently does not burn out. The syndrome is triggered by structural conditions, not solely by individual vulnerability.",
                    "That means burnout on your team is often a signal about your organisation, not a verdict on the person.",
                    "Six risk factors shape whether your team environment protects or depletes: workload, control over one’s own work, reward (financial and relational), community cohesion, perceived fairness, and values alignment. These are not abstract theory. The Maslach Burnout Inventory (MBI) and the Areas of Worklife Survey (AWS) give you concrete tools to screen for these conditions before people collapse.",
                    "The shift leaders need to make is from reactive care to structural prevention. Your team deserves both.",
                  ] : [
                    "Ketika seseorang di timmu mengalami burnout, naluri pertama adalah fokus pada mereka, menawarkan dukungan, istirahat, atau konseling. Itu penting. Namun penelitian oleh Leiter dan Maslach mengungkapkan sesuatu yang tidak nyaman: orang yang sama, ketika ditempatkan dalam konteks organisasi yang berbeda, sering kali tidak mengalami burnout. Sindrom ini dipicu oleh kondisi struktural, bukan semata-mata oleh kerentanan pribadi seseorang.",
                    "Artinya, burnout dalam timmu sering kali adalah sinyal tentang organisasimu, bukan penilaian atas individu tersebut.",
                    "Ada enam faktor risiko yang menentukan apakah lingkungan timmu melindungi atau justru menguras tenaga: beban kerja, kendali atas pekerjaan sendiri, penghargaan (finansial maupun relasional), kohesi komunitas, keadilan yang dirasakan, dan keselarasan nilai. Ini bukan teori semata. Maslach Burnout Inventory (MBI) dan Areas of Worklife Survey (AWS) memberikan alat yang konkret untuk mendeteksi kondisi-kondisi ini sebelum orang-orang di timmu jatuh.",
                    "Pergeseran yang perlu dibuat oleh pemimpin adalah dari perawatan reaktif menuju pencegahan struktural. Timmu layak mendapatkan keduanya.",
                  ]).map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "0.93rem",
                        lineHeight: 1.85,
                        color: bodyText,
                        margin: i === 0 ? 0 : "1rem 0 0 0",
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          LONG-FORM SEO BACKGROUND
      ════════════════════════════════════════════════════════════ */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 12 }}>
            Background
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
            Understanding Burnout: What the Research Says About Exhaustion, Recovery, and Leaders Who Last
          </h2>
          <button
            onClick={() => setBgOpen(!bgOpen)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 20, marginBottom: 24, padding: "10px 20px",
              background: "transparent", border: `1.5px solid ${orange}`,
              color: orange, borderRadius: 12,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.04em",
            }}
          >
            {bgOpen ? "Close ↑" : "Read the research →"}
          </button>

          {/* Lausanne connection card */}
          <a
            href="https://lausanne.org/global-analysis/burnout-among-missionaries"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: navy, borderRadius: 12, padding: "14px 18px",
              textDecoration: "none", marginBottom: 24,
              border: `1px solid rgba(255,255,255,0.1)`,
              transition: "opacity 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="12" r="4.5" stroke={orange} strokeWidth="1.8" />
              <circle cx="17" cy="12" r="4.5" stroke={offWhite} strokeWidth="1.8" />
              <line x1="11.2" y1="9.5" x2="12.8" y2="14.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 3px", fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: orange }}>
                {t("Lausanne Movement", "Gerakan Lausanne", lang)}
              </p>
              <p style={{ margin: 0, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: offWhite, lineHeight: 1.35 }}>
                {t("Burnout Among Missionaries", "Burnout di Kalangan Misionaris", lang)}
              </p>
            </div>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, flexShrink: 0 }}>↗</span>
          </a>

          {bgOpen && [
            "Christina Maslach's burnout model remains the most rigorously validated framework in the field after more than four decades of research.² Her three-dimensional model — emotional exhaustion, depersonalisation (or cynicism), and reduced sense of personal efficacy — identifies not a single symptom but a progressive syndrome that develops in stages. The Maslach Burnout Inventory, developed from her framework, has been administered in hundreds of studies across dozens of countries and remains the gold standard instrument for measuring burnout in research and clinical contexts. Understanding burnout begins with understanding that it is not a single event but a trajectory.",
            "The distinction between stress and burnout matters clinically and practically, and the confusion between them is one of the most common reasons early burnout goes unaddressed.² Stress is characterised by overengagement: too many demands, too much urgency, too much emotional activation. Burnout is characterised by disengagement: emotional numbness, loss of meaning, withdrawal from connection. Stress says everything matters too much; burnout says nothing matters enough. A leader attempting to recover from burnout by applying stress-management techniques — working harder, pushing through, maintaining high output — is accelerating the syndrome, not reversing it.",
            "The exhaustion phase develops first, typically through a combination of sustained role overload, insufficient autonomy, inadequate recognition, and chronic interpersonal friction.² It is the loss of emotional energy — the depletion of the internal resource that enables genuine connection, empathy, and sustained engagement with work. Leaders in this phase often continue to function at a high level externally while experiencing significant internal depletion. This dissociation between visible performance and inner experience is one of the reasons burnout in senior leaders is frequently identified late — by the time the external signals appear, the internal trajectory is often well advanced.",
            "Depersonalisation — the second stage of Maslach's model — is characterised by emotional distance from the people and the work that previously carried meaning.² Leaders in this phase describe going through the motions: still delivering outputs, still managing relationships, but with a felt absence of genuine care for the outcomes. Cynicism becomes the default register — a protective emotional strategy that, paradoxically, deepens the disengagement it was designed to manage. Colleagues and team members typically sense this shift before the leader acknowledges it, and the relational damage it creates is one of the more persistent consequences of burnout.",
            "Reduced personal efficacy — the third stage — produces a paralysing combination that is particularly disorienting for high-achieving leaders.² They continue to work, often intensively, while becoming progressively convinced that their work is making no meaningful difference. This conviction is not a factual assessment; it is a symptom of the syndrome. But it feels like clear-eyed realism, which is what makes it so difficult to counter. Leaders in this stage often interpret their reduced efficacy as evidence that they were never as capable as others believed — a form of post-burnout identity collapse that requires both clinical support and, often, sustained relational investment to address.",
            "Regional prevalence data contextualises what individual leaders may experience as personal failure within a larger epidemiological picture.⁶ Abdul Aziz and Ong's 2024 study found 62.91% of full-time employees across Southeast Asia reporting significant burnout — a prevalence rate that should shift the response from individual intervention to systemic concern. Among field-based cross-cultural workers, rates are consistently higher, compounded by cultural stress, geographic isolation, support deficits, and the weight of sustained high-commitment work without structural protection. The evidence is clear: burnout in these contexts is not primarily a personal resilience failure — it is a structural and systemic condition.",
            "Recovery from burnout requires more than rest — a finding that surprises many leaders who believe a holiday or a sabbatical will resolve the syndrome. Michael Leiter and Christina Maslach's intervention research identifies six dimensions of work-life fit — workload, control, reward, community, fairness, and values alignment — and demonstrates that effective recovery requires addressing the structural drivers, not just the symptoms. Vacation produces temporary symptom relief but not sustained recovery if the conditions that produced burnout remain unchanged on return. Genuine recovery requires both physiological restoration and structural change, and often takes significantly longer than leaders expect.",
            "For Christian leaders, burnout carries a particular spiritual dimension that compounds the syndrome through a shame dynamic. The belief that spiritual dedication should override human limits — that a genuine calling produces inexhaustible capacity, and that exhaustion indicates insufficient faith or commitment — functions as an active barrier to early help-seeking. This theological distortion, well-documented in research on missionary attrition and cross-cultural worker health, frames burnout as a spiritual failure rather than a medical and organisational condition. The result is that leaders who most need support are least likely to seek it, and those around them are least equipped to offer it without inadvertently reinforcing the shame.",
            "Organisational dynamics are co-producers of burnout, not a passive backdrop to individual experience. Leiter and Maslach's research demonstrates that the same person in a different organisational context will frequently not burn out — the syndrome is triggered by specific combinations of structural conditions, not solely by individual vulnerability. This has significant implications for how leaders at every level think about burnout in their teams: it is not sufficient to support individuals who are showing signs of burnout while leaving the organisational conditions unchanged. The most protective environments are those where workload equity, genuine autonomy, fair recognition, and values alignment are structurally maintained.",
            "The most protective factors against burnout are not primarily individual practices — though those matter — but organisational and relational conditions that leaders can actively build.² Autonomy: the experience of meaningful control over one's work. Genuine recognition: reward that is proportionate to contribution and sincerely given. Real community: relationships characterised by mutual support and honest communication, not performative collegiality. Workload equity: distribution of demands that does not consistently overload some members while underloading others. Values alignment: the experience that the work being asked for is consistent with what one believes matters. Leaders who build these conditions are doing burnout prevention work — and modelling, in their leadership, the very quality of engagement that makes long-term, sustainable, faithful contribution possible.²",
          ].map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── Sources ── */}
      <SourcesDropdown sources={[
        "¹ World Health Organization — Burn-out an \"occupational phenomenon\": International Classification of Diseases (ICD-11, 2019) — Establishes burnout as a syndrome of chronic workplace stress, the foundational classification used throughout this module.",
        "² Christina Maslach & Michael P. Leiter — The Truth About Burnout (Jossey-Bass, 1997) — Defines the three-dimension model (exhaustion, cynicism, reduced efficacy) that underpins the MBI and most burnout research since.",
        "³ Jesús Montero-Marín, Javier García-Campayo et al. — \"A newer and broader definition of burnout: Validation of the Burnout Clinical Subtype Questionnaire (BCSQ-36)\" (BMC Public Health, 2011) — Introduces the frenetic, underchallenged, and worn-out subtypes used in the assessment and spectrum diagram.",
        "⁴ Arnold Bakker & Evangelia Demerouti — \"The Job Demands-Resources model: State of the art\" (Journal of Managerial Psychology, 2007) — The structural model explaining how demand-resource imbalance produces burnout regardless of individual resilience.",
        "⁵ Bruce S. McEwen — \"Stressed or stressed out: What is the difference?\" (Journal of Psychiatry & Neuroscience, 2005) — Documents how chronic cortisol elevation impairs prefrontal cortex function and sensitises the amygdala, underpinning the neuroscience section.",
        "⁶ Abdul Aziz & Ong — \"Prevalence and associated factors of burnout among working adults in Southeast Asia\" (Frontiers in Public Health, 2024) — Regional prevalence data providing context for cross-cultural ministry leaders in Southeast Asia.",
        "⁷ Walter Brueggemann — Sabbath as Resistance: Saying No to the Culture of Now (Westminster John Knox Press, 2014) — Theological framing of Sabbath rest as a counter-cultural act of freedom, cited in the frenetic pathway.",
        "⁸ Paula Davis — Beating Burnout at Work: Why Teams Hold the Secret to Well-Being and Resilience (Wharton School Press, University of Pennsylvania, 2021), pp.10–11 — Source for the Warning Signs of Burnout table (physical, psychological, and behavioral indicators).",
        "⁹ Lausanne Movement — \"Burnout Among Missionaries\" (Lausanne Global Analysis, 2024) — Source for the systemic conditions framework and the opening paragraph on organizational drivers of burnout. https://lausanne.org/global-analysis/burnout-among-missionaries",
      ]} lang={lang} />

      {/* Fade-in keyframe for emotion reflection */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
