"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

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
          ? "Burnout risk spectrum based on Montero-Marín et al. Each subtype maps to a different risk zone."
          : "Spektrum risiko kelelahan berdasarkan model Montero-Marín dkk. Setiap subtipe memetakan ke zona risiko berbeda."}
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
          src="/images/resources/understanding-burnout/hero-nest.jpg"
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
              "Burnout builds slowly and rarely announces itself. This module helps you name the type you are carrying, understand how it works, and find the path back to working from identity rather than from pressure.",
              "Kelelahan berkembang perlahan dan jarang mengumumkan dirinya sendiri. Modul ini membantu Anda menamai jenis kelelahan yang Anda bawa, memahami cara kerjanya, dan menemukan jalan kembali untuk bekerja dari identitas, bukan dari tekanan.",
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
          <p style={eyebrowStyle}>
            {t("THE COST NOBODY NAMES", "HARGA YANG TIDAK PERNAH DIUCAPKAN", lang)}
          </p>
          <h2 style={h2Style()}>
            {t("The Call That Broke Me", "Panggilan yang Menghancurkan Saya", lang)}
          </h2>
          <p style={bodyStyle()}>
            {t(
              "Five years into cross-cultural ministry, in a city far from home, a leader was producing visible fruit. The team was growing. The program was running. By any external measure, the work was succeeding. What no one saw (including the leader) was the cost building underneath. The early-morning hours that had once felt like communion began to feel like catching up. The people they served began to feel like demand. By the time the collapse came, no one, including the leader, had seen it building.",
              "Lima tahun dalam pelayanan lintas budaya, di sebuah kota jauh dari rumah, seorang pemimpin menghasilkan buah yang nyata. Tim bertumbuh. Program berjalan. Berdasarkan ukuran eksternal mana pun, pekerjaan itu berhasil. Yang tidak terlihat siapa pun (termasuk pemimpin itu sendiri) adalah biaya yang menumpuk di balik permukaan. Jam-jam dini hari yang dulunya terasa seperti persekutuan mulai terasa seperti mengejar ketertinggalan. Orang-orang yang dilayani mulai terasa seperti beban. Ketika keruntuhan itu tiba, tidak ada seorang pun, termasuk pemimpin itu sendiri, yang melihatnya datang.",
              lang
            )}
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: bodyText, lineHeight: 1.5, marginTop: "-0.75rem", marginBottom: "1.25rem" }}>
            <a
              href="https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1326227/full"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: navy, textDecoration: "underline", textUnderlineOffset: "2px" }}
            >
              {t(
                "Source: Abdul Aziz & Ong, \"Prevalence and associated factors of burnout among working adults in Southeast Asia,\" Frontiers in Public Health, 2024",
                "Sumber: Abdul Aziz & Ong, \"Prevalensi dan faktor terkait kelelahan pada pekerja dewasa di Asia Tenggara,\" Frontiers in Public Health, 2024",
                lang
              )}
            </a>
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
              "Burnout is not a personality weakness, a faith failure, or simply working too hard. The World Health Organization classifies it as an occupational phenomenon: a syndrome resulting from chronic workplace stress that has not been successfully managed. Three dimensions define it: exhaustion (energy depletion), cynicism (growing distance and negativism toward the work and people in it), and reduced efficacy (loss of confidence in one's own competence and impact). These three dimensions can operate independently. A leader can be exhausted but still engaged, or disengaged without being physically depleted.",
              "Kelelahan bukan kelemahan kepribadian, kegagalan iman, atau sekadar terlalu banyak bekerja. Organisasi Kesehatan Dunia mengklasifikasikannya sebagai fenomena pekerjaan: sebuah sindrom yang diakibatkan oleh stres kerja kronis yang tidak berhasil dikelola. Tiga dimensi mendefinisikannya: kelelahan (penipisan energi), sinisme (jarak dan negativisme yang berkembang terhadap pekerjaan dan orang-orang di dalamnya), dan berkurangnya efikasi (hilangnya kepercayaan pada kompetensi dan dampak diri sendiri). Ketiga dimensi ini dapat beroperasi secara independen. Seorang pemimpin bisa kelelahan tetapi tetap terlibat, atau tidak terlibat tanpa fisik yang terkuras.",
              lang
            )}
          </p>

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
                      "The Job Demands-Resources (JD-R) model offers a structural explanation for burnout. Burnout occurs when job demands (workload, emotional demands, role ambiguity, interpersonal conflict) consistently outpace the resources available to meet them: autonomy, feedback, supervisory support, skill match, relationship quality. The model explains why two workers in identical roles can have completely different experiences: the ratio of demands to resources differs. Burnout is therefore not simply a willpower or character problem. It is a structural diagnosis that calls for a structural response.",
                      "Model Tuntutan Pekerjaan-Sumber Daya (JD-R) menawarkan penjelasan struktural untuk kelelahan. Kelelahan terjadi ketika tuntutan pekerjaan (beban kerja, tuntutan emosional, ambiguitas peran, konflik interpersonal) secara konsisten melebihi sumber daya yang tersedia untuk memenuhinya: otonomi, umpan balik, dukungan pengawasan, kecocokan keterampilan, kualitas hubungan. Model ini menjelaskan mengapa dua pekerja dalam peran yang identik dapat memiliki pengalaman yang sepenuhnya berbeda: rasio tuntutan terhadap sumber daya berbeda. Kelelahan oleh karena itu bukan sekadar masalah kemauan atau karakter. Ini adalah diagnosis struktural yang membutuhkan respons struktural.",
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
                      "Prolonged exposure to elevated cortisol (the hormone released under chronic stress) progressively impairs the prefrontal cortex, the region responsible for complex thinking, empathy, and long-range planning. At the same time, the amygdala (the threat-detection centre) becomes hypersensitive. The result is a person who is increasingly reactive, less able to think clearly, less able to feel connected, and often unaware that this is happening because the very capacity for self-assessment has been compromised. This is why self-report about burnout is notoriously unreliable: the instrument measuring the problem is itself affected by the problem.",
                      "Paparan berkepanjangan terhadap kortisol yang meningkat (hormon yang dilepaskan di bawah stres kronis) secara progresif merusak korteks prefrontal, wilayah yang bertanggung jawab untuk pemikiran kompleks, empati, dan perencanaan jangka panjang. Pada saat yang sama, amigdala (pusat deteksi ancaman) menjadi hipersensitif. Hasilnya adalah seseorang yang semakin reaktif, kurang mampu berpikir jernih, kurang mampu merasa terhubung, dan sering tidak menyadari bahwa ini terjadi karena kapasitas penilaian diri itu sendiri telah terganggu. Inilah mengapa laporan diri tentang kelelahan terkenal tidak dapat diandalkan: instrumen yang mengukur masalah itu sendiri dipengaruhi oleh masalah.",
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
          SECTION 5 -- The Three Paths Out
          ============================================================ */}
      <section style={{ background: offWhite, ...sectionPadding }}>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>{t("THE RESPONSE", "RESPONSNYA", lang)}</p>
          <h2 style={h2Style()}>
            {t("The Three Paths Out", "Tiga Jalan Keluar", lang)}
          </h2>
          <p style={bodyStyle()}>
            {t(
              "The right response to burnout depends on which pattern you are in. A frenetic worker needs something different from an underchallenged worker, and both need something different from a worn-out worker. What follows are three targeted pathways, one for each subtype. Find the one that matches your assessment result.",
              "Respons yang tepat terhadap kelelahan tergantung pada pola mana yang Anda alami. Pekerja frenetic membutuhkan sesuatu yang berbeda dari pekerja underchallenged, dan keduanya membutuhkan sesuatu yang berbeda dari pekerja worn-out. Berikut adalah tiga jalur yang ditargetkan, satu untuk setiap subtipe. Temukan yang sesuai dengan hasil penilaian Anda.",
              lang
            )}
          </p>

          {/* Pathway accordion cards */}
          {[
            {
              key: "frenetic",
              title: t("If you are frenetic: permission to stop", "Jika Anda frenetic: izin untuk berhenti", lang),
              body: t(
                "The primary intervention is identity-based permission to stop: not efficiency advice or better time management. Build non-negotiable recovery anchors into the week as structural commitments, not suggestions. Identify one person who has explicit permission to name the warning signs when they appear. Return to the question of whether the work is held as servant or master of your calling. Walter Brueggemann's observation applies directly here: in a culture that treats availability as virtue and busyness as faithfulness, choosing to stop is a theological statement. The fourth commandment was not a productivity recommendation. It was a declaration of freedom.",
                "Intervensi utama adalah izin berbasis identitas untuk berhenti: bukan saran efisiensi atau manajemen waktu yang lebih baik. Bangun jangkar pemulihan yang tidak bisa dinegosiasikan ke dalam minggu sebagai komitmen struktural, bukan saran. Identifikasi satu orang yang memiliki izin eksplisit untuk menamai tanda-tanda peringatan ketika mereka muncul. Kembalilah ke pertanyaan apakah pekerjaan dipegang sebagai pelayan atau tuan dari panggilan Anda. Pengamatan Walter Brueggemann berlaku langsung di sini: dalam budaya yang memperlakukan ketersediaan sebagai kebajikan dan kesibukan sebagai kesetiaan, memilih untuk berhenti adalah pernyataan teologis. Perintah keempat bukanlah rekomendasi produktivitas. Itu adalah deklarasi kebebasan.",
                lang
              ),
            },
            {
              key: "underchallenged",
              title: t("If you are underchallenged: renewed purpose", "Jika Anda underchallenged: tujuan yang diperbarui", lang),
              body: t(
                "The intervention here is renewed purpose and craft challenge, not more rest. Have an honest conversation with leadership about role fit, skill match, and how your best contribution is actually being used. Build peer relationships with people doing substantive work in your field. Ask the specific question beneath the general one: not just 'am I called to this kind of work?' but 'what is the particular thing I am made to do, and is there room for it here?' The Jethro model from Exodus 18 is relevant: Jethro did not tell Moses to pray more or manage his stress better. He looked at the structure and said it was not good, and then he changed the structure.",
                "Intervensi di sini adalah tujuan yang diperbarui dan tantangan kerajinan, bukan lebih banyak istirahat. Lakukan percakapan jujur dengan kepemimpinan tentang kesesuaian peran, kecocokan keterampilan, dan bagaimana kontribusi terbaik Anda sebenarnya digunakan. Bangun hubungan rekan dengan orang-orang yang melakukan pekerjaan substantif di bidang Anda. Ajukan pertanyaan spesifik di balik pertanyaan umum: bukan hanya 'apakah saya dipanggil untuk jenis pekerjaan ini?' tetapi 'apa hal khusus yang saya diciptakan untuk lakukan, dan apakah ada ruang untuk itu di sini?' Model Yitro dari Keluaran 18 relevan: Yitro tidak memberitahu Musa untuk lebih berdoa atau mengelola stresnya dengan lebih baik. Ia melihat strukturnya dan berkata itu tidak baik, dan kemudian ia mengubah strukturnya.",
                lang
              ),
            },
            {
              key: "worn-out",
              title: t("If you are worn-out: honest assessment", "Jika Anda worn-out: penilaian yang jujur", lang),
              body: t(
                "This pattern is the most serious and requires honest assessment of whether recovery is possible within the current system without structural change, or whether a period of leave, clinical support, or a role change is needed. Worn-out burnout does not respond well to individual practices alone: the structural and relational drivers need to change. This module can offer a framework and a starting point. It cannot replace a trusted counsellor, a wise supervisor, a doctor, or a member care worker. If you scored in this range, the most important next step is not to read more content. It is to tell one person the truth about where you actually are today.",
                "Pola ini adalah yang paling serius dan memerlukan penilaian jujur apakah pemulihan mungkin dalam sistem saat ini tanpa perubahan struktural, atau apakah diperlukan periode cuti, dukungan klinis, atau perubahan peran. Kelelahan worn-out tidak merespons dengan baik terhadap praktik individu saja: pendorong struktural dan relasional perlu berubah. Modul ini dapat menawarkan kerangka kerja dan titik awal. Ini tidak dapat menggantikan konselor yang dipercaya, pengawas yang bijak, dokter, atau pekerja perawatan anggota. Jika Anda mendapat skor dalam rentang ini, langkah terpenting selanjutnya bukanlah membaca lebih banyak konten. Melainkan menceritakan kebenaran kepada satu orang tentang posisi Anda sebenarnya hari ini.",
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
                "James names the emotions that drive earthly wisdom: the ones that quietly shape decisions, responses, and pace of life. Which one whispers loudest in you right now?",
                "Yakobus menamai emosi yang mendorong hikmat duniawi: yang diam-diam membentuk keputusan, respons, dan kecepatan hidup. Mana yang paling keras berbisik dalam diri Anda saat ini?",
                lang
              )}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.75rem",
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
              ].map(({ key, icon, label, reflection }) => {
                const isSelected = selectedEmotion === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedEmotion(isSelected ? null : key)}
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "1.25rem 1rem",
                      background: isSelected ? orange : "oklch(28% 0.08 260)",
                      color: isSelected ? "#fff" : "oklch(82% 0.01 80)",
                      border: `1.5px solid ${isSelected ? orange : "oklch(38% 0.08 260)"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{icon}</span>
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
                  "Montero-Marin's three subtypes (frenetic, underchallenged, and worn-out) respond to different drivers and need different interventions. Recognising your own pattern is the first step toward a response that actually fits.",
                  "God's response to Elijah's collapse was physical before it was spiritual. Food, water, rest, then the still small voice. The body is not separate from the spiritual life. It is the place where the spiritual life is lived.",
                  "Selfish ambition often wears ministry clothes. It sounds like vision, faithfulness, responsibility, even sacrifice. The diagnostic question is not how much you are working. It is from where.",
                  "Working from identity costs energy but does not burn you out. The drift begins when we start to serve the results rather than the calling from which those results flow.",
                ]
              : [
                  "Kelelahan bukan terutama kegagalan manajemen waktu. Ini adalah diagnosis sistem di bawah tekanan, sering didorong oleh penyimpangan bertahap dari bekerja berdasarkan panggilan ke bekerja berdasarkan ambisi, ketakutan, atau kebutuhan akan hasil.",
                  "Tiga subtipe Montero-Marin (frenetic, underchallenged, dan worn-out) merespons pendorong yang berbeda dan membutuhkan intervensi yang berbeda. Mengenali pola Anda sendiri adalah langkah pertama menuju respons yang benar-benar sesuai.",
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
