"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

// ── TYPES ──────────────────────────────────────────────────────────────────────

type Lang = "en" | "id" | "nl";

// ── HELPERS ────────────────────────────────────────────────────────────────────

const t = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ── DATA ───────────────────────────────────────────────────────────────────────

const ANDRAGOGY = [
  {
    num: "01",
    titleEn: "Motivation", titleId: "Motivasi", titleNl: "Motivatie",
    subtitleEn: "Internal Drive", subtitleId: "Dorongan Internal", subtitleNl: "Interne Drijfveer",
    descEn: "Adults learn best when they are internally motivated. Learning driven by curiosity, purpose, and personal relevance produces deeper and more lasting understanding than external pressure alone.",
    descId: "Orang dewasa belajar paling baik ketika mereka termotivasi secara internal. Pembelajaran yang didorong oleh rasa ingin tahu, tujuan, dan relevansi pribadi menghasilkan pemahaman yang lebih dalam dan bertahan lama daripada tekanan eksternal semata.",
    descNl: "Volwassenen leren het best wanneer ze intern gemotiveerd zijn. Leren gedreven door nieuwsgierigheid, doelgerichtheid en persoonlijke relevantie leidt tot dieper en duurzamer begrip dan externe druk alleen.",
    color: "oklch(45% 0.14 260)",
  },
  {
    num: "02",
    titleEn: "Readiness", titleId: "Kesiapan", titleNl: "Gereedheid",
    subtitleEn: "Relevance", subtitleId: "Relevansi", subtitleNl: "Relevantie",
    descEn: "Adults are ready to learn when the content is relevant to their current life or role. They engage when they can see a direct application to a real challenge they are facing.",
    descId: "Orang dewasa siap belajar ketika konten relevan dengan kehidupan atau peran mereka saat ini. Mereka terlibat ketika mereka dapat melihat penerapan langsung pada tantangan nyata yang sedang mereka hadapi.",
    descNl: "Volwassenen zijn klaar om te leren wanneer de inhoud relevant is voor hun huidige leven of rol. Ze raken betrokken wanneer ze een directe toepassing zien op een echte uitdaging waarmee ze worden geconfronteerd.",
    color: "oklch(48% 0.14 45)",
  },
  {
    num: "03",
    titleEn: "Experience", titleId: "Pengalaman", titleNl: "Ervaring",
    subtitleEn: "Past Knowledge", subtitleId: "Pengetahuan Sebelumnya", subtitleNl: "Voorkennis",
    descEn: "Adults bring a reservoir of experience to any learning environment. Effective training connects new concepts to what learners already know — honoring their history rather than ignoring it.",
    descId: "Orang dewasa membawa reservoir pengalaman ke lingkungan belajar apa pun. Pelatihan yang efektif menghubungkan konsep baru dengan apa yang sudah diketahui peserta — menghormati sejarah mereka daripada mengabaikannya.",
    descNl: "Volwassenen brengen een reservoir aan ervaring mee naar elke leeromgeving. Effectieve training verbindt nieuwe concepten met wat leerlingen al weten — hun geschiedenis eerend in plaats van negerend.",
    color: "oklch(46% 0.12 145)",
  },
  {
    num: "04",
    titleEn: "Self-Direction", titleId: "Pengarahan Diri", titleNl: "Zelfsturing",
    subtitleEn: "Autonomy", subtitleId: "Otonomi", subtitleNl: "Autonomie",
    descEn: "Adults prefer to take ownership of their own learning journey. Offering choices, self-paced elements, and personal application options respects the adult learner's need for autonomy.",
    descId: "Orang dewasa lebih suka mengambil kepemilikan atas perjalanan belajar mereka sendiri. Menawarkan pilihan, elemen pembelajaran mandiri, dan opsi penerapan pribadi menghormati kebutuhan peserta dewasa akan otonomi.",
    descNl: "Volwassenen geven er de voorkeur aan eigenaarschap te nemen over hun eigen leertraject. Het aanbieden van keuzes, zelfbepaald leren en persoonlijke toepassingsopties respecteert de behoefte aan autonomie van de volwassen leerder.",
    color: "oklch(44% 0.10 300)",
  },
  {
    num: "05",
    titleEn: "Orientation to Learning", titleId: "Orientasi terhadap Pembelajaran", titleNl: "Leeroriëntatie",
    subtitleEn: "Learning by Doing", subtitleId: "Belajar dengan Melakukan", subtitleNl: "Leren door te Doen",
    descEn: "Adults are problem-centred, not subject-centred. They learn most effectively when content is organized around real-life problems and immediately applicable skills — not abstract theories.",
    descId: "Orang dewasa berpusat pada masalah, bukan pada mata pelajaran. Mereka belajar paling efektif ketika konten diorganisir di sekitar masalah kehidupan nyata dan keterampilan yang langsung dapat diterapkan — bukan teori abstrak.",
    descNl: "Volwassenen zijn probleemgericht, niet vakgericht. Ze leren het meest effectief wanneer inhoud is georganiseerd rond praktische problemen en direct toepasbare vaardigheden — niet abstracte theorieën.",
    color: "oklch(42% 0.12 25)",
  },
];

const LEARNING_STYLES = [
  {
    num: "01",
    titleEn: "Visual", titleId: "Visual", titleNl: "Visueel",
    descEn: "Learns through images, diagrams, charts, and spatial understanding.",
    descId: "Belajar melalui gambar, diagram, grafik, dan pemahaman spasial.",
    descNl: "Leert via beelden, diagrammen, grafieken en ruimtelijk begrip.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  },
  {
    num: "02",
    titleEn: "Linguistic", titleId: "Linguistik", titleNl: "Linguïstisch",
    descEn: "Learns through reading, writing, listening, and verbal explanation.",
    descId: "Belajar melalui membaca, menulis, mendengarkan, dan penjelasan verbal.",
    descNl: "Leert via lezen, schrijven, luisteren en verbale uitleg.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    num: "03",
    titleEn: "Auditory", titleId: "Auditori", titleNl: "Auditief",
    descEn: "Learns best through listening, discussion, and verbal processing.",
    descId: "Belajar terbaik melalui mendengarkan, diskusi, dan pemrosesan verbal.",
    descNl: "Leert het best via luisteren, discussie en verbale verwerking.",
    icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
  },
  {
    num: "04",
    titleEn: "Logical", titleId: "Logis", titleNl: "Logisch",
    descEn: "Learns through systems, reasoning, patterns, and cause-and-effect.",
    descId: "Belajar melalui sistem, penalaran, pola, dan sebab-akibat.",
    descNl: "Leert via systemen, redenering, patronen en oorzaak-gevolg.",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    num: "05",
    titleEn: "Kinesthetic", titleId: "Kinestetik", titleNl: "Kinesthetisch",
    descEn: "Learns through physical experience, touch, movement, and hands-on practice.",
    descId: "Belajar melalui pengalaman fisik, sentuhan, gerakan, dan praktik langsung.",
    descNl: "Leert via lichamelijke ervaring, aanraking, beweging en praktische oefening.",
    icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
  },
  {
    num: "06",
    titleEn: "Intrapersonal", titleId: "Intrapersonal", titleNl: "Intrapersoonlijk",
    descEn: "Learns through reflection, self-awareness, and personal connection to material.",
    descId: "Belajar melalui refleksi, kesadaran diri, dan koneksi pribadi dengan materi.",
    descNl: "Leert via reflectie, zelfbewustzijn en persoonlijke verbinding met het materiaal.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    num: "07",
    titleEn: "Interpersonal", titleId: "Interpersonal", titleNl: "Interpersoonlijk",
    descEn: "Learns best through social interaction, collaboration, and group discussion.",
    descId: "Belajar terbaik melalui interaksi sosial, kolaborasi, dan diskusi kelompok.",
    descNl: "Leert het best via sociale interactie, samenwerking en groepsdiscussie.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

const LEARNING_METHODS = [
  {
    num: "01",
    titleEn: "Group Discussion", titleId: "Diskusi Kelompok", titleNl: "Groepsdiscussie",
    descEn: "Structured dialogue around a topic or case. Builds collective insight and surfaces diverse perspectives.",
    descId: "Dialog terstruktur seputar topik atau kasus. Membangun wawasan kolektif dan memunculkan perspektif yang beragam.",
    descNl: "Gestructureerde dialoog rond een onderwerp of casus. Bouwt collectief inzicht op en brengt diverse perspectieven naar voren.",
  },
  {
    num: "02",
    titleEn: "Lecture + Interactive", titleId: "Ceramah + Interaktif", titleNl: "Lezing + Interactief",
    descEn: "Short focused input (10-15 min) followed by questions, responses, or application. Attention curves demand this rhythm.",
    descId: "Masukan terfokus singkat (10-15 menit) diikuti pertanyaan, respons, atau penerapan. Kurva perhatian menuntut ritme ini.",
    descNl: "Korte, gerichte input (10-15 min) gevolgd door vragen, reacties of toepassing. Aandachtscurves vereisen dit ritme.",
  },
  {
    num: "03",
    titleEn: "Case Study", titleId: "Studi Kasus", titleNl: "Casusstudie",
    descEn: "Analysis of a real or fictional scenario. Develops critical thinking and contextual application of principles.",
    descId: "Analisis skenario nyata atau fiktif. Mengembangkan pemikiran kritis dan penerapan prinsip secara kontekstual.",
    descNl: "Analyse van een echt of fictief scenario. Ontwikkelt kritisch denken en contextuele toepassing van principes.",
  },
  {
    num: "04",
    titleEn: "Storytelling", titleId: "Bercerita", titleNl: "Verhalen Vertellen",
    descEn: "Narrative-driven learning that embeds concepts in memorable human experience. Particularly effective in oral cultures.",
    descId: "Pembelajaran berbasis narasi yang menanamkan konsep dalam pengalaman manusia yang mudah diingat. Sangat efektif dalam budaya lisan.",
    descNl: "Narratief gestuurd leren dat concepten inbedt in memorabele menselijke ervaringen. Bijzonder effectief in orale culturen.",
  },
  {
    num: "05",
    titleEn: "Peer Teaching", titleId: "Pengajaran Sesama", titleNl: "Peer-onderwijs",
    descEn: "Participants teach a concept to each other. Teaching deepens understanding more than receiving alone.",
    descId: "Peserta mengajarkan konsep satu sama lain. Mengajar memperdalam pemahaman lebih dari sekadar menerima.",
    descNl: "Deelnemers leren een concept aan elkaar. Lesgeven verdiept begrip meer dan alleen ontvangen.",
  },
  {
    num: "06",
    titleEn: "Experiential Learning", titleId: "Pembelajaran Pengalaman", titleNl: "Ervaringsleren",
    descEn: "Structured activities that create direct experience — then reflection. Kolb's learning cycle in action.",
    descId: "Kegiatan terstruktur yang menciptakan pengalaman langsung — kemudian refleksi. Siklus belajar Kolb dalam tindakan.",
    descNl: "Gestructureerde activiteiten die directe ervaring creëren — dan reflectie. Kolbs leercyclus in actie.",
  },
  {
    num: "07",
    titleEn: "Reflective Exercise", titleId: "Latihan Reflektif", titleNl: "Reflectieve Oefening",
    descEn: "Journaling, quiet processing, or personal inventory that connects content to individual experience and application.",
    descId: "Jurnal, pemrosesan tenang, atau inventaris pribadi yang menghubungkan konten dengan pengalaman dan penerapan individu.",
    descNl: "Dagboekschrijven, rustige verwerking of persoonlijke inventaris die inhoud verbindt met individuele ervaring en toepassing.",
  },
  {
    num: "08",
    titleEn: "Role Play", titleId: "Permainan Peran", titleNl: "Rollenspel",
    descEn: "Simulated scenarios that build empathy, practice skills, and reveal assumptions in a safe environment.",
    descId: "Skenario simulasi yang membangun empati, melatih keterampilan, dan mengungkapkan asumsi dalam lingkungan yang aman.",
    descNl: "Gesimuleerde scenario's die empathie opbouwen, vaardigheden oefenen en aannames blootleggen in een veilige omgeving.",
  },
  {
    num: "09",
    titleEn: "Socratic Questioning", titleId: "Pertanyaan Sokratik", titleNl: "Socratische Vragen",
    descEn: "Guided discovery through strategic questions rather than direct instruction. Develops critical thinking and ownership.",
    descId: "Penemuan terbimbing melalui pertanyaan strategis daripada instruksi langsung. Mengembangkan pemikiran kritis dan kepemilikan.",
    descNl: "Geleide ontdekking door strategische vragen in plaats van directe instructie. Ontwikkelt kritisch denken en eigenaarschap.",
  },
  {
    num: "10",
    titleEn: "Collaborative Learning", titleId: "Pembelajaran Kolaboratif", titleNl: "Samenwerkend Leren",
    descEn: "Group projects or tasks where learning happens through working together toward a shared goal.",
    descId: "Proyek atau tugas kelompok di mana pembelajaran terjadi melalui bekerja bersama menuju tujuan bersama.",
    descNl: "Groepsprojecten of taken waarbij leren plaatsvindt door samen te werken naar een gedeeld doel.",
  },
];

const BREAKS = [
  { emoji: "💧", en: "Drink water", id: "Minum air", nl: "Water drinken" },
  { emoji: "✍️", en: "Brief journaling or reflection", id: "Jurnal atau refleksi singkat", nl: "Kort dagboekschrijven of reflectie" },
  { emoji: "🧘", en: "Light stretching or movement", id: "Peregangan ringan atau gerakan", nl: "Lichte rekken of beweging" },
  { emoji: "💬", en: "Short peer interaction", id: "Interaksi singkat dengan sesama", nl: "Korte interactie met een ander" },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type Props = { userPathway: string | null; isSaved: boolean };

export default function AttentionRetentionClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const tr = (en: string, id: string, nl: string) => t(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("attention-retention");
      setSaved(true);
    });
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      <LangToggle />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        color: "oklch(97% 0.005 80)",
        padding: "96px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 30% 60%, oklch(65% 0.15 45) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          {/* lang toggle */}

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
              {tr("Training Design", "Desain Pelatihan", "Trainingsontwerp")}
            </span>
          </div>

          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {tr("Team & Facilitation · Guide", "Tim & Fasilitasi · Panduan", "Team & Facilitatie · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, margin: "0 0 24px", color: "oklch(96% 0.005 80)" }}>
            {tr("Attention & Retention", "Perhatian & Retensi", "Aandacht & Retentie")}
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.65, color: "oklch(78% 0.04 260)", maxWidth: 580, margin: "0 0 40px" }}>
            {tr(
              "Understanding how adults learn — and how to design training that actually sticks. Rooted in andragogy, attention science, and cross-cultural application.",
              "Memahami bagaimana orang dewasa belajar — dan cara merancang pelatihan yang benar-benar bertahan. Berakar pada andragogi, ilmu perhatian, dan penerapan lintas budaya.",
              "Begrijpen hoe volwassenen leren — en hoe je training ontwerpt die echt beklijft. Geworteld in andragogie, aandachtswetenschap en interculturele toepassing."
            )}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: saved ? "oklch(35% 0.08 260)" : "transparent",
              color: "oklch(75% 0.04 260)",
              padding: "14px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14,
              border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved ? tr("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : tr("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </section>

      {/* ── ATTENTION SECTION ─────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 24px" }}>
          {tr("How Attention Works", "Bagaimana Perhatian Bekerja", "Hoe Aandacht Werkt")}
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(38% 0.05 260)", marginBottom: 24 }}>
          {tr(
            "The average adult attention span in a learning environment is 10–20 minutes before focus begins to fade. This is not a weakness — it is how the human brain is designed. Effective trainers and communicators work with this reality, not against it.",
            "Rentang perhatian rata-rata orang dewasa dalam lingkungan belajar adalah 10–20 menit sebelum fokus mulai memudar. Ini bukan kelemahan — itulah cara otak manusia dirancang. Pelatih dan komunikator yang efektif bekerja dengan realitas ini, bukan melawannya.",
            "De gemiddelde aandachtsspanne van volwassenen in een leeromgeving is 10–20 minuten voordat de focus begint te vervagen. Dit is geen zwakte — het is hoe het menselijk brein is ontworpen. Effectieve trainers en communicators werken mét deze realiteit, niet ertegen."
          )}
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(38% 0.05 260)", marginBottom: 48 }}>
          {tr(
            "Understanding the typical attention curve helps you structure sessions for maximum impact — keeping engagement high and enabling deeper learning through strategic rhythm.",
            "Memahami kurva perhatian tipikal membantu Anda menyusun sesi untuk dampak maksimal — menjaga keterlibatan tetap tinggi dan memungkinkan pembelajaran yang lebih dalam melalui ritme strategis.",
            "Het begrijpen van de typische aandachtscurve helpt je sessies te structureren voor maximale impact — betrokkenheid hoog houden en dieper leren mogelijk maken door strategisch ritme."
          )}
        </p>

        {/* attention curve visual */}
        <div style={{ background: "oklch(22% 0.10 260)", borderRadius: 12, padding: "40px", marginBottom: 48 }}>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: 24 }}>
            {tr("The Attention Curve", "Kurva Perhatian", "De Aandachtscurve")}
          </h3>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "stretch" }}>
            {[
              {
                time: tr("0–5 min", "0–5 mnt", "0–5 min"),
                levelEn: "High", levelId: "Tinggi", levelNl: "Hoog",
                descEn: "Peak engagement. Introduce key concepts and prime the learner.",
                descId: "Keterlibatan puncak. Perkenalkan konsep kunci dan persiapkan peserta.",
                descNl: "Piekbetrokkenheid. Introduceer kernconcepten en bereid de leerder voor.",
                height: "100%", color: "oklch(45% 0.14 145)"
              },
              {
                time: tr("5–15 min", "5–15 mnt", "5–15 min"),
                levelEn: "Sustained", levelId: "Berkelanjutan", levelNl: "Aanhoudend",
                descEn: "Solid focus. Core content delivery — your main teaching window.",
                descId: "Fokus solid. Penyampaian konten inti — jendela pengajaran utama Anda.",
                descNl: "Solide focus. Kerninhoud overdragen — uw belangrijkste leervenster.",
                height: "88%", color: "oklch(48% 0.14 45)"
              },
              {
                time: tr("15–20 min", "15–20 mnt", "15–20 min"),
                levelEn: "Fading", levelId: "Memudar", levelNl: "Wegvallend",
                descEn: "Natural decline begins. Introduce interaction or activity to reset.",
                descId: "Penurunan alami dimulai. Perkenalkan interaksi atau aktivitas untuk menyegarkan.",
                descNl: "Natuurlijke daling begint. Introduceer interactie of activiteit om te resetten.",
                height: "62%", color: "oklch(52% 0.14 55)"
              },
              {
                time: tr("20+ min", "20+ mnt", "20+ min"),
                levelEn: "Low", levelId: "Rendah", levelNl: "Laag",
                descEn: "Without a break or reset, retention drops significantly.",
                descId: "Tanpa jeda atau penyegaran, retensi menurun secara signifikan.",
                descNl: "Zonder pauze of reset daalt de retentie aanzienlijk.",
                height: "35%", color: "oklch(42% 0.12 25)"
              },
            ].map((s) => (
              <div key={s.time} style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                <div style={{ width: "100%", height: 100, background: "oklch(30% 0.08 260)", borderRadius: 6, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: s.height, background: s.color, borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "white", margin: 0, textAlign: "center" }}>{s.time}</p>
                <p style={{ fontSize: 11, color: s.color, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, textAlign: "center" }}>
                  {lang === "en" ? s.levelEn : lang === "id" ? s.levelId : s.levelNl}
                </p>
                <p style={{ fontSize: 12, color: "oklch(68% 0.04 260)", lineHeight: 1.5, margin: 0, textAlign: "center" }}>
                  {lang === "en" ? s.descEn : lang === "id" ? s.descId : s.descNl}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* recovery breaks */}
        <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(35% 0.08 260)", marginBottom: 20 }}>
          {tr("Recovery Breaks That Work", "Jeda Pemulihan yang Efektif", "Herstelpauzess Die Werken")}
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(40% 0.06 260)", marginBottom: 24 }}>
          {tr(
            "A 3–5 minute break between content segments is not wasted time — it is the mechanism that enables retention. Not all breaks are equal. These four types have proven most effective:",
            "Jeda 3–5 menit di antara segmen konten bukan waktu yang terbuang — melainkan mekanisme yang memungkinkan retensi. Tidak semua jeda sama. Empat jenis berikut terbukti paling efektif:",
            "Een pauze van 3–5 minuten tussen inhoudsegmenten is geen verspilde tijd — het is het mechanisme dat retentie mogelijk maakt. Niet alle pauzes zijn gelijk. Deze vier typen zijn het meest effectief gebleken:"
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {BREAKS.map((b) => (
            <div key={b.en} style={{ background: "white", borderRadius: 10, padding: "20px", textAlign: "center", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>{b.emoji}</span>
              <p style={{ fontSize: 14, fontWeight: 600, color: "oklch(28% 0.08 260)", margin: 0 }}>
                {tr(b.en, b.id, b.nl)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ANDRAGOGY ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ maxWidth: 620, marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", display: "block", marginBottom: 16 }}>
              Malcolm Knowles, 1980
            </span>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
              {tr(
                "Andragogy: The Five Principles of Adult Learning",
                "Andragogi: Lima Prinsip Pembelajaran Orang Dewasa",
                "Andragogie: De Vijf Principes van Volwassenenleren"
              )}
            </h2>
            <p style={{ fontSize: 16, color: "oklch(72% 0.05 260)", lineHeight: 1.7 }}>
              {tr(
                "Malcolm Knowles identified five core principles that distinguish how adults learn from how children learn. Every trainer working with adult leaders should know these principles — and design around them.",
                "Malcolm Knowles mengidentifikasi lima prinsip inti yang membedakan bagaimana orang dewasa belajar dari bagaimana anak-anak belajar. Setiap pelatih yang bekerja dengan pemimpin dewasa harus mengetahui prinsip-prinsip ini — dan merancang berdasarkannya.",
                "Malcolm Knowles identificeerde vijf kernprincipes die onderscheiden hoe volwassenen leren van hoe kinderen leren. Elke trainer die met volwassen leiders werkt, moet deze principes kennen — en er omheen ontwerpen."
              )}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {ANDRAGOGY.map((p) => (
              <div key={p.num} style={{ background: "oklch(28% 0.09 260)", borderRadius: 10, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 600, color: p.color, lineHeight: 1, display: "block" }}>{p.num}</span>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 600, color: "oklch(94% 0.005 80)", margin: 0 }}>
                      {tr(p.titleEn, p.titleId, p.titleNl)}
                    </h3>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.color }}>
                      {tr(p.subtitleEn, p.subtitleId, p.subtitleNl)}
                    </span>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(72% 0.04 260)", margin: 0 }}>
                    {tr(p.descEn, p.descId, p.descNl)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNING STYLES ───────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {tr("Seven Learning Styles", "Tujuh Gaya Belajar", "Zeven Leerstijlen")}
        </h2>
        <p style={{ fontSize: 16, color: "oklch(44% 0.06 260)", marginBottom: 48, lineHeight: 1.65 }}>
          {tr(
            "Different learners process information in different ways. Effective training blends multiple styles to maximize engagement and retention across a diverse group.",
            "Pelajar yang berbeda memproses informasi dengan cara yang berbeda. Pelatihan yang efektif memadukan beberapa gaya untuk memaksimalkan keterlibatan dan retensi di seluruh kelompok yang beragam.",
            "Verschillende leerders verwerken informatie op verschillende manieren. Effectieve training combineert meerdere stijlen om betrokkenheid en retentie in een diverse groep te maximaliseren."
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {LEARNING_STYLES.map((s, i) => {
            const colors = [
              "oklch(45% 0.14 260)",
              "oklch(48% 0.14 45)",
              "oklch(46% 0.12 145)",
              "oklch(44% 0.10 300)",
              "oklch(42% 0.12 25)",
              "oklch(45% 0.10 200)",
              "oklch(48% 0.12 320)",
            ];
            const c = colors[i % colors.length];
            return (
              <div key={s.num} style={{ background: "white", borderRadius: 10, padding: "24px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: `oklch(95% 0.04 ${c.match(/\d+\)$/)?.[0]?.replace(")", "") ?? "260"})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8">
                      <path d={s.icon} />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: "oklch(60% 0.05 260)", fontWeight: 700, letterSpacing: "0.08em" }}>{s.num}</span>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: 0 }}>
                      {tr(s.titleEn, s.titleId, s.titleNl)}
                    </h3>
                  </div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>
                  {tr(s.descEn, s.descId, s.descNl)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LEARNING METHODS ──────────────────────────────────────────────────── */}
      <section style={{ background: "oklch(95% 0.008 80)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {tr("Ten Learning Methods", "Sepuluh Metode Pembelajaran", "Tien Leermethoden")}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(44% 0.06 260)", marginBottom: 48, lineHeight: 1.65 }}>
            {tr(
              "These ten methods cover the full spectrum from receptive to active learning. The most effective training sequences draw on at least 3–4 of these in a single session.",
              "Sepuluh metode ini mencakup spektrum penuh dari pembelajaran reseptif hingga aktif. Urutan pelatihan yang paling efektif menggabungkan setidaknya 3–4 dari ini dalam satu sesi.",
              "Deze tien methoden bestrijken het volledige spectrum van receptief tot actief leren. De meest effectieve trainingssequenties putten uit ten minste 3–4 van deze methoden in één sessie."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {LEARNING_METHODS.map((m) => (
              <div key={m.num} style={{ background: "white", borderRadius: 10, padding: "24px 24px", boxShadow: "0 1px 6px oklch(20% 0.06 260 / 0.06)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0 }}>{m.num}</span>
                  <div>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>
                      {tr(m.titleEn, m.titleId, m.titleNl)}
                    </h3>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>
                      {tr(m.descEn, m.descId, m.descNl)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY INSIGHT ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ background: "oklch(22% 0.10 260)", borderRadius: 12, padding: "48px 44px" }}>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.5, color: "oklch(92% 0.005 80)", fontStyle: "italic", margin: "0 0 24px" }}>
            {tr(
              '"Training that sticks is not designed around content. It\'s designed around the learner."',
              '"Pelatihan yang bertahan bukan dirancang di sekitar konten. Melainkan dirancang di sekitar peserta."',
              '"Training die beklijft is niet ontworpen rond inhoud. Het is ontworpen rond de leerder."'
            )}
          </p>
          <p style={{ fontSize: 15, color: "oklch(62% 0.06 260)", margin: 0 }}>
            {tr(
              "The goal is not to transfer information — it is to produce transformation. When we understand how adults learn, we can design experiences that truly change how people lead.",
              "Tujuannya bukan untuk mentransfer informasi — melainkan untuk menghasilkan transformasi. Ketika kita memahami bagaimana orang dewasa belajar, kita dapat merancang pengalaman yang benar-benar mengubah cara orang memimpin.",
              "Het doel is niet om informatie over te dragen — het is om transformatie te bewerkstelligen. Wanneer we begrijpen hoe volwassenen leren, kunnen we ervaringen ontwerpen die echt veranderen hoe mensen leiden."
            )}
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {tr("Design Better Training", "Rancang Pelatihan yang Lebih Baik", "Ontwerp Betere Training")}
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={userPathway ? "/dashboard" : "/personal"} style={{
              display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)",
              padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14,
              border: "1px solid oklch(42% 0.08 260)", textDecoration: "none",
            }}>
              {userPathway ? tr("Go to Dashboard", "Ke Dashboard", "Naar Dashboard") : tr("Explore Pathways", "Jelajahi Jalur", "Verken Trajecten")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
