"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";


type Lang = "en" | "id";

const tFn = (en: string, id: string, lang: Lang) => lang === "id" ? id : en;

// -- ALTITUDE DATA --------------------------------------------------------------

const ALTITUDES = [
  {
    num: "01",
    ft: "5,000 ft",
    color: "oklch(45% 0.14 260)",
    colorLight: "oklch(62% 0.10 260)",
    role: "Team Member",
    roleId: "Anggota Tim",
    span: "~4 people",
    spanId: "~4 orang",
    reach: "~1,000 km",
    reachId: "~1.000 km",
    focus: "Execution",
    focusId: "Pelaksanaan",
    focusDesc: "Completing tasks, following direction, developing skills within a small team.",
    focusDescId: "Menyelesaikan tugas, mengikuti arahan, mengembangkan keterampilan dalam tim kecil.",
    qualities: ["Reliability", "Skill development", "Team player", "Personal accountability"],
    qualitiesId: ["Keandalan", "Pengembangan keterampilan", "Pemain tim", "Akuntabilitas pribadi"],
    strategy: "Focus on doing your work excellently and supporting those around you.",
    strategyId: "Fokus pada menyelesaikan pekerjaan Anda dengan sangat baik dan mendukung orang-orang di sekitar Anda.",
    strengths: ["Deep focus on tasks", "Close team relationships", "Direct contribution visibility"],
    strengthsId: ["Fokus mendalam pada tugas", "Hubungan tim yang erat", "Visibilitas kontribusi langsung"],
    weaknesses: ["Limited visibility of big picture", "Dependent on direction from above", "Risk of siloed thinking"],
    weaknessesId: ["Visibilitas gambaran besar terbatas", "Bergantung pada arahan dari atas", "Risiko pemikiran terisolir"],
    opportunities: ["Build foundational skills quickly", "Learn from close mentorship", "High-impact personal growth"],
    opportunitiesId: ["Membangun keterampilan dasar dengan cepat", "Belajar dari mentoring dekat", "Pertumbuhan pribadi berdampak tinggi"],
    threats: ["Burnout from overwork", "Stagnation without growth path", "Frustration if purpose is unclear"],
    threatsId: ["Kelelahan akibat terlalu banyak bekerja", "Stagnasi tanpa jalur pertumbuhan", "Frustrasi jika tujuan tidak jelas"],
  },
  {
    num: "02",
    ft: "10,000 ft",
    color: "oklch(48% 0.14 45)",
    colorLight: "oklch(65% 0.12 45)",
    role: "Team Leader",
    roleId: "Pemimpin Tim",
    span: "~50 people",
    spanId: "~50 orang",
    reach: "~3,000 km",
    reachId: "~3.000 km",
    focus: "People Development",
    focusId: "Pengembangan Orang",
    focusDesc: "Coaching individuals, building team culture, translating vision into action.",
    focusDescId: "Melatih individu, membangun budaya tim, menerjemahkan visi ke dalam tindakan.",
    qualities: ["Coaching", "Delegation", "Team culture building", "Clear communication"],
    qualitiesId: ["Pelatihan", "Delegasi", "Membangun budaya tim", "Komunikasi yang jelas"],
    strategy: "Develop your people — your output is their growth, not just task completion.",
    strategyId: "Kembangkan orang-orang Anda — hasil Anda adalah pertumbuhan mereka, bukan sekadar penyelesaian tugas.",
    strengths: ["Direct influence on team culture", "Visible people development", "Agile team adjustments"],
    strengthsId: ["Pengaruh langsung pada budaya tim", "Pengembangan orang yang terlihat", "Penyesuaian tim yang gesit"],
    weaknesses: ["Risk of micromanagement", "Limited strategic bandwidth", "Personal bandwidth constraints"],
    weaknessesId: ["Risiko manajemen mikro", "Bandwidth strategis terbatas", "Keterbatasan bandwidth pribadi"],
    opportunities: ["Build a high-trust team culture", "Develop future leaders", "Create strong team identity"],
    opportunitiesId: ["Membangun budaya tim yang penuh kepercayaan", "Mengembangkan pemimpin masa depan", "Menciptakan identitas tim yang kuat"],
    threats: ["Burnout from carrying team's load", "Conflict avoidance damaging team", "Promotion without preparation"],
    threatsId: ["Kelelahan dari menanggung beban tim", "Penghindaran konflik merusak tim", "Promosi tanpa persiapan"],
  },
  {
    num: "03",
    ft: "20,000 ft",
    color: "oklch(46% 0.12 145)",
    colorLight: "oklch(60% 0.10 145)",
    role: "National Organization",
    roleId: "Organisasi Nasional",
    span: "~200 people",
    spanId: "~200 orang",
    reach: "~7,000 km",
    reachId: "~7.000 km",
    focus: "Systems & Culture",
    focusId: "Sistem & Budaya",
    focusDesc: "Building scalable systems, establishing organizational culture, strategic planning.",
    focusDescId: "Membangun sistem yang dapat diskalakan, membangun budaya organisasi, perencanaan strategis.",
    qualities: ["Systems thinking", "Cultural architecture", "Strategic vision", "Cross-team alignment"],
    qualitiesId: ["Pemikiran sistemik", "Arsitektur budaya", "Visi strategis", "Keselarasan lintas tim"],
    strategy: "Design systems that outlast your presence. Build culture, not just programs.",
    strategyId: "Rancang sistem yang bertahan melampaui kehadiran Anda. Bangun budaya, bukan sekadar program.",
    strengths: ["Broad organizational influence", "Systemic problem solving", "Multi-team coordination"],
    strengthsId: ["Pengaruh organisasi yang luas", "Pemecahan masalah sistemik", "Koordinasi multi-tim"],
    weaknesses: ["Distance from front-line reality", "Risk of bureaucratic drift", "Slow to respond to local needs"],
    weaknessesId: ["Jarak dari realitas garis depan", "Risiko penyimpangan birokrasi", "Lambat merespons kebutuhan lokal"],
    opportunities: ["Systemic change with lasting impact", "Shape organizational DNA", "Develop national leaders"],
    opportunitiesId: ["Perubahan sistemik dengan dampak bertahan lama", "Membentuk DNA organisasi", "Mengembangkan pemimpin nasional"],
    threats: ["Losing touch with ground-level reality", "Organizational complexity overwhelming", "Political dynamics fragmenting unity"],
    threatsId: ["Kehilangan kontak dengan realitas tingkat dasar", "Kompleksitas organisasi yang membebani", "Dinamika politik memecah persatuan"],
  },
  {
    num: "04",
    ft: "30,000 ft",
    color: "oklch(44% 0.10 300)",
    colorLight: "oklch(60% 0.08 300)",
    role: "Field Director",
    roleId: "Direktur Lapangan",
    span: "~20 people",
    spanId: "~20 orang",
    reach: "~10,000 km",
    reachId: "~10.000 km",
    focus: "Cross-Cultural Strategy",
    focusId: "Strategi Lintas Budaya",
    focusDesc: "Aligning strategy across national contexts, navigating cultural complexity, directing field operations.",
    focusDescId: "Menyelaraskan strategi di berbagai konteks nasional, menavigasi kompleksitas budaya, mengarahkan operasi lapangan.",
    qualities: ["Cultural adaptability", "Strategic alignment", "Multi-national coordination", "Diplomatic leadership"],
    qualitiesId: ["Adaptabilitas budaya", "Keselarasan strategis", "Koordinasi multinasional", "Kepemimpinan diplomatik"],
    strategy: "Seek alignment before action. What works in one context may need translation for another.",
    strategyId: "Cari keselarasan sebelum bertindak. Apa yang berhasil dalam satu konteks mungkin perlu diterjemahkan untuk konteks lain.",
    strengths: ["Wide strategic perspective", "Cross-cultural bridge-building", "Long-term vision capacity"],
    strengthsId: ["Perspektif strategis yang luas", "Membangun jembatan lintas budaya", "Kapasitas visi jangka panjang"],
    weaknesses: ["High complexity and ambiguity", "Relational distance from teams", "Political navigation demands"],
    weaknessesId: ["Kompleksitas dan ambiguitas tinggi", "Jarak relasional dari tim", "Tuntutan navigasi politik"],
    opportunities: ["Shape strategy across multiple nations", "Build cross-cultural leadership pipelines", "Resolve systemic barriers to mission"],
    opportunitiesId: ["Membentuk strategi di berbagai negara", "Membangun jalur kepemimpinan lintas budaya", "Menyelesaikan hambatan sistemik terhadap misi"],
    threats: ["Burnout from complexity overload", "Cultural blind spots causing damage", "Isolation at senior level"],
    threatsId: ["Kelelahan akibat kelebihan kompleksitas", "Titik buta budaya menyebabkan kerusakan", "Isolasi di tingkat senior"],
  },
  {
    num: "05",
    ft: "40,000 ft",
    color: "oklch(42% 0.12 25)",
    colorLight: "oklch(60% 0.10 25)",
    role: "International Organization",
    roleId: "Organisasi Internasional",
    span: "~800 people",
    spanId: "~800 orang",
    reach: "~18,000 km",
    reachId: "~18.000 km",
    focus: "Vision & Legacy",
    focusId: "Visi & Warisan",
    focusDesc: "Setting global direction, stewarding organizational mission, building structures that outlast individuals.",
    focusDescId: "Menetapkan arah global, mengelola misi organisasi, membangun struktur yang melampaui individu.",
    qualities: ["Vision casting", "Legacy thinking", "Global perspective", "Organizational stewardship"],
    qualitiesId: ["Penetapan visi", "Pemikiran warisan", "Perspektif global", "Pengelolaan organisasi"],
    strategy: "Focus on what only you can do. Develop leaders who can operate at every altitude.⁶",
    strategyId: "Fokus pada apa yang hanya bisa Anda lakukan. Kembangkan pemimpin yang dapat beroperasi di setiap ketinggian.⁶",
    strengths: ["Global organizational influence", "Vision clarity and coherence", "Long-term structural thinking"],
    strengthsId: ["Pengaruh organisasi global", "Kejelasan dan koherensi visi", "Pemikiran struktural jangka panjang"],
    weaknesses: ["Far from operational reality", "Risk of ivory-tower leadership", "Succession planning complexity"],
    weaknessesId: ["Jauh dari realitas operasional", "Risiko kepemimpinan menara gading", "Kompleksitas perencanaan suksesi"],
    opportunities: ["Catalyze global movements", "Create lasting institutional frameworks", "Shape the next generation of leaders"],
    opportunitiesId: ["Mengkatalisis gerakan global", "Menciptakan kerangka institusional yang bertahan lama", "Membentuk generasi pemimpin berikutnya"],
    threats: ["Loss of ground-level credibility", "Organizational drift from original mission", "Leadership succession failures"],
    threatsId: ["Kehilangan kredibilitas tingkat dasar", "Penyimpangan organisasi dari misi asal", "Kegagalan suksesi kepemimpinan"],
  },
];

const PRINCIPLES = [
  {
    num: "01",
    titleEn: "Understand Your Altitude",
    titleId: "Pahami Ketinggian Anda",
    descEn: "Know what altitude you're currently operating at — and what that demands of you. Each level has unique responsibilities, blind spots, and growth edges.",
    descId: "Ketahui ketinggian mana yang sedang Anda operasikan — dan apa yang itu tuntut dari Anda. Setiap level memiliki tanggung jawab, titik buta, dan tantangan pertumbuhan yang unik.",
  },
  {
    num: "02",
    titleEn: "Trust Others",
    titleId: "Percayai Orang Lain",
    descEn: "You cannot operate at all altitudes simultaneously. Trust the leaders at other altitudes to do their work — and resist the urge to descend unnecessarily.",
    descId: "Anda tidak dapat beroperasi di semua ketinggian secara bersamaan. Percayai pemimpin di ketinggian lain untuk melakukan pekerjaan mereka — dan tahan dorongan untuk turun tanpa perlu.",
  },
  {
    num: "03",
    titleEn: "Seek Alignment",
    titleId: "Cari Keselarasan",
    descEn: "Great leaders align up, down, and across. Ensure your work at your altitude serves the mission, supports those below, and honors those above.",
    descId: "Pemimpin hebat menyelaraskan ke atas, ke bawah, dan ke samping. Pastikan pekerjaan Anda di ketinggian Anda melayani misi, mendukung yang di bawah, dan menghormati yang di atas.",
  },
  {
    num: "04",
    titleEn: "Develop Perspective",
    titleId: "Kembangkan Perspektif",
    descEn: "Periodically rise to a higher altitude to see the bigger picture — then return to your level with renewed clarity and purpose.",
    descId: "Secara berkala naikkan ke ketinggian yang lebih tinggi untuk melihat gambaran yang lebih besar — kemudian kembalilah ke level Anda dengan kejelasan dan tujuan yang diperbarui.",
  },
  {
    num: "05",
    titleEn: "Practice Self-Awareness",
    titleId: "Praktikkan Kesadaran Diri",
    descEn: "The greatest danger is operating at the wrong altitude without knowing it — research suggests only 10–15% of leaders are genuinely self-aware.⁵ Regular reflection, feedback, and accountability keep you calibrated.",
    descId: "Bahaya terbesar adalah beroperasi di ketinggian yang salah tanpa menyadarinya — penelitian menunjukkan hanya 10–15% pemimpin yang benar-benar sadar diri.⁵ Refleksi rutin, umpan balik, dan akuntabilitas membuat Anda tetap terkalibrasi.",
  },
];

const PITFALLS = [
  {
    en: "Leading from the wrong altitude — doing work that belongs to a different level",
    id: "Memimpin dari ketinggian yang salah — melakukan pekerjaan yang seharusnya di level berbeda",
  },
  {
    en: "Failing to delegate — staying at 5,000 ft when you should be at 20,000 ft",
    id: "Gagal mendelegasikan — tetap di 5.000 kaki padahal seharusnya berada di 20.000 kaki",
  },
  {
    en: "Losing touch with ground reality — flying so high you can't read the terrain",
    id: "Kehilangan kontak dengan realitas lapangan — terbang terlalu tinggi sehingga tidak bisa membaca medan",
  },
  {
    en: "Confusing busyness with effectiveness — activity at the wrong altitude wastes everyone's energy",
    id: "Mengacaukan kesibukan dengan efektivitas — aktivitas di ketinggian yang salah membuang energi semua orang",
  },
];

const REFLECTION = [
  { roman: "I", en: "What feedback am I receiving about my leadership style?", id: "Umpan balik apa yang saya terima tentang gaya kepemimpinan saya?" },
  { roman: "II", en: "Am I focused on the right outcomes for my altitude?", id: "Apakah saya fokus pada hasil yang tepat untuk ketinggian saya?" },
  { roman: "III", en: "What does my current altitude require of me that I'm not yet doing?", id: "Apa yang dituntut ketinggian saya saat ini yang belum saya lakukan?" },
  { roman: "IV", en: "Where am I feeling the most stress or confusion — and what altitude does that suggest?", id: "Di mana saya paling banyak merasakan stres atau kebingungan — dan ketinggian apa yang itu tunjukkan?" },
  { roman: "V", en: "Do I have clarity on why we're doing what we're doing at this altitude?", id: "Apakah saya memiliki kejelasan tentang mengapa kita melakukan apa yang kita lakukan di ketinggian ini?" },
  { roman: "VI", en: "Am I trusting others enough to lead at their altitudes?", id: "Apakah saya cukup mempercayai orang lain untuk memimpin di ketinggian mereka?" },
  { roman: "VII", en: "Where does my work align with the larger mission — and where is there drift?", id: "Di mana pekerjaan saya selaras dengan misi yang lebih besar — dan di mana ada penyimpangan?" },
  { roman: "VIII", en: "Am I collaborating effectively with leaders at different altitudes?", id: "Apakah saya berkolaborasi secara efektif dengan pemimpin di ketinggian yang berbeda?" },
  { roman: "IX", en: "What am I holding onto that I should be delegating?", id: "Apa yang saya pegang yang seharusnya saya delegasikan?" },
  { roman: "X", en: "How effectively am I communicating vision and direction to those at lower altitudes?", id: "Seberapa efektif saya mengkomunikasikan visi dan arah kepada mereka yang berada di ketinggian lebih rendah?" },
  { roman: "XI", en: "What would it look like to grow into the next altitude of leadership?", id: "Seperti apa rasanya berkembang menuju ketinggian kepemimpinan berikutnya?" },
  { roman: "XII", en: "How well do I know my own strengths and limitations at my current altitude?", id: "Seberapa baik saya mengenal kekuatan dan keterbatasan saya sendiri di ketinggian saya saat ini?" },
];

// -- COMPONENT -----------------------------------------------------------------

type Props = { userPathway: string | null; isSaved: boolean };

export default function LeadershipAltitudesClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [activeAltitude, setActiveAltitude] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("leadership-altitudes");
      setSaved(true);
    });
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      <LangToggle />

      {/* -- HERO --------------------------------------------------------------- */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        color: "oklch(97% 0.005 80)",
        padding: "96px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 70% 50%, oklch(65% 0.15 45) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          {/* lang toggle */}

          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Leadership — Guide", "Kepemimpinan — Panduan")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, margin: "0 0 24px", color: "oklch(96% 0.005 80)" }}>
            {t("Leadership Altitudes", "Ketinggian Kepemimpinan")}
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.65, color: "oklch(78% 0.04 260)", maxWidth: 580, margin: "0 0 40px" }}>
            {t(
              "Every leader operates at a different altitude. Understanding yours — and the altitude of those you lead — transforms how you delegate, communicate, and develop others.",
              "Setiap pemimpin beroperasi pada ketinggian yang berbeda. Memahami ketinggian Anda — dan ketinggian mereka yang Anda pimpin — mengubah cara Anda mendelegasikan, berkomunikasi, dan mengembangkan orang lain."
            )}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: saved ? "oklch(35% 0.08 260)" : "transparent",
              color: saved ? "oklch(75% 0.04 260)" : "oklch(75% 0.04 260)",
              padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14,
              border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved
                ? t("Saved to Dashboard", "Tersimpan di Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard")}
            </button>
          </div>
        </div>
      </section>

      {/* -- INTRO --------------------------------------------------------------- */}
      <section style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(20px, 2.5vw, 26px)", lineHeight: 1.6, color: "oklch(30% 0.08 260)", fontStyle: "italic", borderLeft: "none", margin: "0 0 32px" }}>
          {t(
            '"The higher you fly, the more you see — but the less detail you can make out. The question is never how high, but what altitude serves the mission."',
            '"Semakin tinggi Anda terbang, semakin banyak yang Anda lihat — tetapi semakin sedikit detail yang bisa Anda kenali. Pertanyaannya bukan seberapa tinggi, tetapi ketinggian mana yang melayani misi."',
            '"Hoe hoger je vliegt, hoe meer je ziet — maar hoe minder details je kunt onderscheiden. De vraag is nooit hoe hoog, maar welke hoogte de missie dient."'
          )}
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(38% 0.05 260)", marginBottom: 24 }}>
          {t(
            "The Leadership Altitudes framework uses the metaphor of flight to describe different levels of organizational leadership. From the ground-level team member executing daily tasks to the international organization casting global vision — each altitude has a distinct focus, span of control,¹ and set of responsibilities.",
            "Kerangka Ketinggian Kepemimpinan menggunakan metafora penerbangan untuk menggambarkan berbagai level kepemimpinan organisasi. Dari anggota tim tingkat dasar yang melaksanakan tugas harian hingga organisasi internasional yang menetapkan visi global — setiap ketinggian memiliki fokus, rentang kendali,¹ dan serangkaian tanggung jawab yang berbeda."
          )}
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(38% 0.05 260)" }}>
          {t(
            "A leader can — and often must — operate at multiple altitudes. But the art is knowing which altitude the moment demands.² This framework is a practitioner conceptual tool — it maps accumulated leadership wisdom, not a single validated empirical model.",
            "Seorang pemimpin bisa — dan seringkali harus — beroperasi di berbagai ketinggian. Tetapi seninya adalah mengetahui ketinggian mana yang dibutuhkan saat ini.² Kerangka ini adalah alat konseptual praktisi — memetakan kebijaksanaan kepemimpinan yang terakumulasi, bukan model empiris yang divalidasi tunggal."
          )}
        </p>
      </section>

      {/* -- INFOGRAPHIC --------------------------------------------------------- */}
      <section style={{ padding: "0 24px 72px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 32px oklch(20% 0.06 260 / 0.15)" }}>
          <Image
            src="/resources/leadership-altitudes-infographic.png"
            alt={t("Leadership Altitudes Infographic", "Infografis Ketinggian Kepemimpinan")}
            width={1200}
            height={900}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>
        <p style={{ fontSize: 13, color: "oklch(55% 0.05 260)", textAlign: "center", marginTop: 12 }}>
          {t(
            "Leadership Altitudes — from Team Member (5,000 ft) to International Organization (40,000 ft)",
            "Ketinggian Kepemimpinan — dari Anggota Tim (5.000 kaki) hingga Organisasi Internasional (40.000 kaki)"
          )}
        </p>
      </section>


      {/* -- ALTITUDE CARDS ------------------------------------------------------ */}
      <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {t("The Five Altitudes", "Lima Ketinggian")}
        </h2>
        <p style={{ fontSize: 16, color: "oklch(44% 0.06 260)", marginBottom: 48, lineHeight: 1.65 }}>
          {t(
            "Select an altitude to explore its focus, qualities, and SWOT analysis.",
            "Pilih ketinggian untuk menjelajahi fokus, kualitas, dan analisis SWOT-nya."
          )}
        </p>

        {/* altitude selector tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {ALTITUDES.map((alt, i) => (
            <button key={alt.num} onClick={() => setActiveAltitude(activeAltitude === i ? null : i)} style={{
              padding: "10px 20px", borderRadius: 12, cursor: "pointer",
              background: activeAltitude === i ? alt.color : "white",
              color: activeAltitude === i ? "white" : "oklch(30% 0.08 260)",
              border: `1px solid ${activeAltitude === i ? alt.color : "oklch(88% 0.02 260)"}`,
              fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s ease",
            }}>
              {alt.ft} — {t(alt.role, alt.roleId)}
            </button>
          ))}
        </div>

        {/* altitude detail panel */}
        {activeAltitude !== null && (() => {
          const alt = ALTITUDES[activeAltitude];
          const qualitiesArr = lang === "id" ? alt.qualitiesId : alt.qualities;
          const strengthsArr = lang === "id" ? alt.strengthsId : alt.strengths;
          const weaknessesArr = lang === "id" ? alt.weaknessesId : alt.weaknesses;
          const opportunitiesArr = lang === "id" ? alt.opportunitiesId : alt.opportunities;
          const threatsArr = lang === "id" ? alt.threatsId : alt.threats;
          return (
            <div style={{
              background: "white", borderRadius: 12, overflow: "hidden",
              boxShadow: "0 2px 24px oklch(20% 0.06 260 / 0.10)",
              border: `1px solid oklch(90% 0.02 260)`,
            }}>
              {/* header */}
              <div style={{ background: alt.color, padding: "40px 40px 36px", color: "white" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 56, fontWeight: 600, lineHeight: 1, color: "white", opacity: 0.25 }}>{alt.num}</span>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 600, margin: "0 0 4px", color: "white" }}>
                      {t(alt.role, alt.roleId)}
                    </h3>
                    <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>
                      {alt.ft} — {t(`Span: ${alt.span}`, `Rentang: ${alt.spanId}`)}
                    </p>
                  </div>
                </div>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 4, padding: "6px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {t(`Focus: ${alt.focus}`, `Fokus: ${alt.focusId}`)}
                </div>
              </div>

              <div style={{ padding: "40px" }}>
                {/* focus description */}
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "oklch(35% 0.06 260)", marginBottom: 32 }}>
                  {t(alt.focusDesc, alt.focusDescId)}
                </p>

                {/* key qualities */}
                <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: alt.color, marginBottom: 16 }}>
                  {t("Key Qualities", "Kualitas Utama")}
                </h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
                  {qualitiesArr.map((q: string) => (
                    <span key={q} style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                      background: `oklch(95% 0.04 ${alt.color.match(/\d+ 0\.\d+ (\d+)/)?.[1] ?? "260"})`,
                      color: alt.color,
                    }}>{q}</span>
                  ))}
                </div>

                {/* SWOT */}
                <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(40% 0.06 260)", marginBottom: 20 }}>
                  {t("SWOT Analysis", "Analisis SWOT")}
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
                  {[
                    { label: t("Strengths", "Kekuatan"), items: strengthsArr, color: "oklch(95% 0.05 145)", textColor: "oklch(32% 0.12 145)" },
                    { label: t("Weaknesses", "Kelemahan"), items: weaknessesArr, color: "oklch(96% 0.04 25)", textColor: "oklch(35% 0.10 25)" },
                    { label: t("Opportunities", "Peluang"), items: opportunitiesArr, color: "oklch(95% 0.04 260)", textColor: "oklch(32% 0.12 260)" },
                    { label: t("Threats", "Ancaman"), items: threatsArr, color: "oklch(96% 0.03 300)", textColor: "oklch(35% 0.08 300)" },
                  ].map(({ label, items, color, textColor }) => (
                    <div key={label} style={{ background: color, borderRadius: 8, padding: "20px" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: textColor, marginBottom: 12 }}>{label}</p>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {items.map((item: string) => (
                          <li key={item} style={{ fontSize: 13, lineHeight: 1.6, color: "oklch(28% 0.06 260)", marginBottom: 6 }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* strategy */}
                <div style={{ background: "oklch(97% 0.005 80)", borderRadius: 8, padding: "20px 24px" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: alt.color, marginBottom: 8 }}>
                    {t("Strategy", "Strategi")}
                  </p>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.07 260)", margin: 0, fontStyle: "italic" }}>
                    "{t(alt.strategy, alt.strategyId)}"
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {activeAltitude === null && (
          <div style={{ background: "oklch(95% 0.008 260)", borderRadius: 12, padding: "40px", textAlign: "center", color: "oklch(50% 0.06 260)", fontSize: 15 }}>
            {t(
              "Select an altitude above to explore its details.",
              "Pilih ketinggian di atas untuk menjelajahi detailnya."
            )}
          </div>
        )}
      </section>

      {/* -- MULTIPLE ALTITUDES -------------------------------------------------- */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "72px 24px", color: "white" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 24px" }}>
            {t(
              "A Leader Can Operate at Multiple Altitudes",
              "Seorang Pemimpin Dapat Beroperasi di Berbagai Ketinggian"
            )}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(75% 0.04 260)", marginBottom: 24 }}>
            {t(
              "Effective leaders are not locked into one altitude. A Field Director may need to descend to Team Leader altitude to coach a struggling team³ — then rise back to 30,000 ft to navigate a strategic decision. This movement is healthy and necessary.",
              "Pemimpin yang efektif tidak terkunci pada satu ketinggian. Seorang Direktur Lapangan mungkin perlu turun ke ketinggian Pemimpin Tim untuk melatih tim yang kesulitan³ — kemudian naik kembali ke 30.000 kaki untuk menavigasi keputusan strategis. Pergerakan ini sehat dan diperlukan."
            )}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(75% 0.04 260)" }}>
            {t(
              "The danger is when a leader becomes stuck — either micromanaging at a level too low for their role,⁴ or flying too high and losing touch with reality. Self-awareness and consistent feedback are the corrective mechanisms.⁵",
              "Bahayanya adalah ketika seorang pemimpin terjebak — entah mengelola secara mikro pada level yang terlalu rendah untuk peran mereka,⁴ atau terbang terlalu tinggi dan kehilangan kontak dengan realitas. Kesadaran diri dan umpan balik yang konsisten adalah mekanisme korektif.⁵"
            )}
          </p>
        </div>
      </section>

      {/* -- COMMON PITFALLS ----------------------------------------------------- */}
      <section style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 40px" }}>
          {t("Common Pitfalls", "Jebakan Umum")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PITFALLS.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "20px 24px", background: "white", borderRadius: 8, boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, minWidth: 28 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.07 260)" }}>
                {t(p.en, p.id)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* -- 5 PRINCIPLES -------------------------------------------------------- */}
      <section style={{ background: "oklch(95% 0.008 80)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t(
              "Five Principles for Altitude-Aware Leadership",
              "Lima Prinsip untuk Kepemimpinan yang Sadar Ketinggian"
            )}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(44% 0.06 260)", marginBottom: 48, lineHeight: 1.65 }}>
            {t(
              "These principles apply regardless of which altitude you currently lead from.",
              "Prinsip-prinsip ini berlaku terlepas dari ketinggian mana Anda saat ini memimpin."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.num} style={{ background: "white", borderRadius: 10, padding: "28px 28px 28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: "oklch(65% 0.15 45)", display: "block", lineHeight: 1, marginBottom: 12 }}>{p.num}</span>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
                  {t(p.titleEn, p.titleId)}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "oklch(42% 0.06 260)", margin: 0 }}>
                  {t(p.descEn, p.descId)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- REFLECTION ---------------------------------------------------------- */}
      <section style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {t("Reflection Questions", "Pertanyaan Refleksi")}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
          {t(
            "Use these questions for personal reflection, team discussion, or leadership development sessions. The PDF includes space for written responses.",
            "Gunakan pertanyaan-pertanyaan ini untuk refleksi pribadi, diskusi tim, atau sesi pengembangan kepemimpinan. PDF menyertakan ruang untuk jawaban tertulis."
          )}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {REFLECTION.map((r) => (
            <div key={r.roman} style={{ display: "flex", gap: 20, padding: "18px 24px", background: "white", borderRadius: 8, boxShadow: "0 1px 6px oklch(20% 0.06 260 / 0.06)" }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 600, color: "oklch(65% 0.15 45)", minWidth: 28, flexShrink: 0, paddingTop: 2 }}>{r.roman}</span>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.07 260)" }}>{t(r.en, r.id)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -- SOURCES ------------------------------------------------------------- */}
      <SourcesDropdown sources={[
        "Ram Charan, Stephen Drotter & James Noel — The Leadership Pipeline: How to Build the Leadership Powered Company (Jossey-Bass, 2001) — foundational work on differentiated leadership levels, span of control, and role transitions.",
        "Bill Hybels — Axiom: Powerful Leadership Proverbs (Zondervan, 2008); see also Liz Wiseman & Greg McKeown — Multipliers: How the Best Leaders Make Everyone Smarter (HarperBusiness, 2010) — practitioner frameworks describing altitude-like leadership differentiation.",
        "Marcus Buckingham & Curt Coffman — First, Break All the Rules (Simon & Schuster, 1999) — Gallup research on manager-level coaching, people development, and why the direct leader is the primary variable in team performance.",
        "Liz Wiseman — Multipliers (HarperBusiness, 2010) — research on diminisher vs. multiplier leaders; the cost of leaders operating below their altitude (micromanagement) and above it (ivory-tower detachment).",
        "Tasha Eurich — Insight: Why We're Not as Self-Aware as We Think, and How Seeing Ourselves Clearly Helps Us Succeed at Work and in Life (Crown Business, 2017) — research finding only 10–15% of people are genuinely self-aware; practical methods for accurate self-assessment.",
        "Elliott Jaques — Requisite Organization (Cason Hall, 1989) — time-span of discretion theory; empirical basis for the idea that different organizational levels require qualitatively different thinking horizons and decision-making capacity.",
      ]} lang={lang} />

      {/* -- CTA ----------------------------------------------------------------- */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t("Apply This in Your Context", "Terapkan Ini dalam Konteks Anda")}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(72% 0.05 260)", lineHeight: 1.7, marginBottom: 40 }}>
            {t(
              "The Leadership Altitudes framework is one of many tools in the Crispy Leaders training library — built for field workers and cross-cultural leaders.",
              "Kerangka Ketinggian Kepemimpinan adalah salah satu dari banyak alat di perpustakaan pelatihan Crispy Leaders — dibangun untuk pekerja lintas budaya dan pemimpin lintas budaya."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{
              display: "inline-block", background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)",
              padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 14,
              letterSpacing: "0.04em", textDecoration: "none",
            }}>
              {t("Training", "Pelatihan")}
            </Link>
            <Link href={userPathway ? "/dashboard" : "/personal"} style={{
              display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)",
              padding: "14px 32px", borderRadius: 12, fontWeight: 600, fontSize: 14,
              border: "1px solid oklch(42% 0.08 260)", textDecoration: "none",
            }}>
              {userPathway
                ? t("Go to Dashboard", "Ke Dashboard")
                : t("Explore Pathways", "Jelajahi Jalur")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
