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

const HATS = [
  {
    num: "01",
    colorName: "White", colorNameId: "Putih", colorNameNl: "Wit",
    emoji: "🎩",
    bg: "oklch(94% 0.00 0)",
    color: "oklch(35% 0.03 260)",
    accent: "oklch(55% 0.04 260)",
    focusEn: "Facts & Information", focusId: "Fakta & Informasi", focusNl: "Feiten & Informatie",
    descEn: "The White Hat focuses on objective data, facts, and figures. It encourages neutral analysis of what is known and identifies information gaps.",
    descId: "Topi Putih berfokus pada data objektif, fakta, dan angka. Mendorong analisis netral tentang apa yang diketahui dan mengidentifikasi kesenjangan informasi.",
    descNl: "De Witte Hoed richt zich op objectieve gegevens, feiten en cijfers. Hij moedigt neutrale analyse aan van wat bekend is en identificeert informatiegaten.",
    benefitEn: "Encourages data-driven decisions by emphasizing facts and avoiding assumptions.",
    benefitId: "Mendorong keputusan berbasis data dengan menekankan fakta dan menghindari asumsi.",
    benefitNl: "Stimuleert datagestuurde beslissingen door feiten te benadrukken en aannames te vermijden.",
    riskEn: "Over-reliance on available information may ignore intuition or creativity.",
    riskId: "Ketergantungan berlebihan pada informasi yang tersedia dapat mengabaikan intuisi atau kreativitas.",
    riskNl: "Overmatig vertrouwen op beschikbare informatie kan intuïtie of creativiteit negeren.",
    questionsEn: ["What information do we have, and what do we need to find out?", "Are the sources of this information reliable and accurate?"],
    questionsId: ["Informasi apa yang kita miliki, dan apa yang perlu kita cari tahu?", "Apakah sumber informasi ini dapat diandalkan dan akurat?"],
    questionsNl: ["Welke informatie hebben we, en wat moeten we nog uitzoeken?", "Zijn de bronnen van deze informatie betrouwbaar en nauwkeurig?"],
  },
  {
    num: "02",
    colorName: "Red", colorNameId: "Merah", colorNameNl: "Rood",
    emoji: "🎩",
    bg: "oklch(94% 0.05 25)",
    color: "oklch(42% 0.18 25)",
    accent: "oklch(55% 0.20 25)",
    focusEn: "Feelings & Intuition", focusId: "Perasaan & Intuisi", focusNl: "Gevoel & Intuïtie",
    descEn: "The Red Hat allows expression of emotions, gut feelings, and intuition without requiring justification — acknowledging the emotional dimension of decision-making.",
    descId: "Topi Merah memungkinkan ekspresi emosi, perasaan naluriah, dan intuisi tanpa memerlukan pembenaran — mengakui dimensi emosional dalam pengambilan keputusan.",
    descNl: "De Rode Hoed maakt expressie van emoties, buikgevoel en intuïtie mogelijk zonder rechtvaardiging — erkent de emotionele dimensie van besluitvorming.",
    benefitEn: "Brings emotional insights into decision-making, adding depth to logical reasoning.",
    benefitId: "Membawa wawasan emosional ke dalam pengambilan keputusan, menambah kedalaman penalaran logis.",
    benefitNl: "Brengt emotionele inzichten in de besluitvorming, voegt diepte toe aan logisch redeneren.",
    riskEn: "Decisions might become overly influenced by emotions rather than evidence or logic.",
    riskId: "Keputusan mungkin terlalu dipengaruhi oleh emosi daripada bukti atau logika.",
    riskNl: "Beslissingen kunnen te sterk worden beïnvloed door emoties in plaats van bewijs of logica.",
    questionsEn: ["What is my gut feeling about this situation or idea?", "How do emotions — mine or others' — impact this decision?"],
    questionsId: ["Apa perasaan naluriah saya tentang situasi atau ide ini?", "Bagaimana emosi — saya atau orang lain — mempengaruhi keputusan ini?"],
    questionsNl: ["Wat is mijn gevoel over deze situatie of dit idee?", "Hoe beïnvloeden emoties — van mij of anderen — deze beslissing?"],
  },
  {
    num: "03",
    colorName: "Black", colorNameId: "Hitam", colorNameNl: "Zwart",
    emoji: "🎩",
    bg: "oklch(94% 0.01 260)",
    color: "oklch(22% 0.04 260)",
    accent: "oklch(38% 0.05 260)",
    focusEn: "Critical Judgment", focusId: "Penilaian Kritis", focusNl: "Kritisch Oordeel",
    descEn: "The Black Hat focuses on identifying potential risks, challenges, and weaknesses in ideas to ensure practicality and avoid failure.",
    descId: "Topi Hitam berfokus pada mengidentifikasi potensi risiko, tantangan, dan kelemahan dalam ide untuk memastikan kepraktisan dan menghindari kegagalan.",
    descNl: "De Zwarte Hoed richt zich op het identificeren van potentiële risico's, uitdagingen en zwaktes in ideeën om praktijkbaarheid te waarborgen en mislukking te vermijden.",
    benefitEn: "Encourages thorough evaluation by highlighting potential pitfalls and fostering cautious planning.",
    benefitId: "Mendorong evaluasi menyeluruh dengan menyoroti potensi jebakan dan mendorong perencanaan yang hati-hati.",
    benefitNl: "Stimuleert grondige evaluatie door potentiële valkuilen te benadrukken en voorzichtige planning te bevorderen.",
    riskEn: "Excessive focus on negatives can suppress creativity and optimism.",
    riskId: "Fokus berlebihan pada hal negatif dapat menekan kreativitas dan optimisme.",
    riskNl: "Overmatige focus op negatieven kan creativiteit en optimisme onderdrukken.",
    questionsEn: ["What are the potential risks or downsides of this idea?", "What obstacles or challenges could prevent success?"],
    questionsId: ["Apa potensi risiko atau kerugian dari ide ini?", "Hambatan atau tantangan apa yang dapat mencegah keberhasilan?"],
    questionsNl: ["Wat zijn de potentiële risico's of nadelen van dit idee?", "Welke obstakels of uitdagingen kunnen succes verhinderen?"],
  },
  {
    num: "04",
    colorName: "Yellow", colorNameId: "Kuning", colorNameNl: "Geel",
    emoji: "🎩",
    bg: "oklch(96% 0.06 90)",
    color: "oklch(45% 0.14 85)",
    accent: "oklch(60% 0.16 85)",
    focusEn: "Optimistic Thinking", focusId: "Pemikiran Optimistis", focusNl: "Optimistisch Denken",
    descEn: "The Yellow Hat emphasizes positivity, identifying benefits, opportunities, and logical reasons for success — encouraging constructive and solution-oriented thinking.",
    descId: "Topi Kuning menekankan positivitas, mengidentifikasi manfaat, peluang, dan alasan logis untuk sukses — mendorong pemikiran yang konstruktif dan berorientasi solusi.",
    descNl: "De Gele Hoed benadrukt positiviteit, identificeert voordelen, kansen en logische redenen voor succes — stimuleert constructief en oplossings­gericht denken.",
    benefitEn: "Highlights opportunities and potential benefits, fostering a positive and solution-oriented mindset.",
    benefitId: "Menyoroti peluang dan manfaat potensial, mendorong pola pikir yang positif dan berorientasi solusi.",
    benefitNl: "Belicht kansen en potentiële voordelen, bevordert een positieve en oplossingsgerichte denkwijze.",
    riskEn: "May overlook risks or downsides due to an overly optimistic outlook.",
    riskId: "Mungkin mengabaikan risiko atau kerugian karena pandangan yang terlalu optimistis.",
    riskNl: "Kan risico's of nadelen over het hoofd zien door een te optimistische kijk.",
    questionsEn: ["What are the benefits and opportunities this idea could bring?", "Why might this plan succeed, and how can we maximize its potential?"],
    questionsId: ["Apa manfaat dan peluang yang bisa dibawa oleh ide ini?", "Mengapa rencana ini mungkin berhasil, dan bagaimana kita bisa memaksimalkan potensinya?"],
    questionsNl: ["Welke voordelen en kansen kan dit idee bieden?", "Waarom kan dit plan slagen, en hoe kunnen we het potentieel maximaliseren?"],
  },
  {
    num: "05",
    colorName: "Green", colorNameId: "Hijau", colorNameNl: "Groen",
    emoji: "🎩",
    bg: "oklch(94% 0.05 145)",
    color: "oklch(38% 0.14 145)",
    accent: "oklch(52% 0.16 145)",
    focusEn: "Creativity & Alternatives", focusId: "Kreativitas & Alternatif", focusNl: "Creativiteit & Alternatieven",
    descEn: "The Green Hat encourages creative thinking, exploring alternatives, new ideas, and innovative solutions to challenges.",
    descId: "Topi Hijau mendorong pemikiran kreatif, mengeksplorasi alternatif, ide-ide baru, dan solusi inovatif untuk tantangan.",
    descNl: "De Groene Hoed stimuleert creatief denken, het verkennen van alternatieven, nieuwe ideeën en innovatieve oplossingen voor uitdagingen.",
    benefitEn: "Promotes innovative ideas and fosters out-of-the-box thinking.",
    benefitId: "Mempromosikan ide-ide inovatif dan mendorong pemikiran di luar kebiasaan.",
    benefitNl: "Bevordert innovatieve ideeën en stimuleert out-of-the-box denken.",
    riskEn: "Excessive focus on creativity may lead to impractical or unfeasible solutions.",
    riskId: "Fokus berlebihan pada kreativitas dapat menghasilkan solusi yang tidak praktis atau tidak layak.",
    riskNl: "Overmatige focus op creativiteit kan leiden tot onpraktische of onhaalbare oplossingen.",
    questionsEn: ["What new ideas or approaches could we explore?", "How can we think differently to solve this problem?"],
    questionsId: ["Ide atau pendekatan baru apa yang bisa kita jelajahi?", "Bagaimana kita bisa berpikir secara berbeda untuk memecahkan masalah ini?"],
    questionsNl: ["Welke nieuwe ideeën of benaderingen kunnen we verkennen?", "Hoe kunnen we anders denken om dit probleem op te lossen?"],
  },
  {
    num: "06",
    colorName: "Blue", colorNameId: "Biru", colorNameNl: "Blauw",
    emoji: "🎩",
    bg: "oklch(93% 0.04 250)",
    color: "oklch(40% 0.16 250)",
    accent: "oklch(55% 0.18 250)",
    focusEn: "Process Control", focusId: "Kontrol Proses", focusNl: "Procescontrole",
    descEn: "The Blue Hat focuses on leadership and organization — managing the thinking process and ensuring all perspectives are addressed effectively.",
    descId: "Topi Biru berfokus pada kepemimpinan dan organisasi — mengelola proses berpikir dan memastikan semua perspektif ditangani secara efektif.",
    descNl: "De Blauwe Hoed richt zich op leiderschap en organisatie — het beheren van het denkproces en ervoor zorgen dat alle perspectieven effectief worden behandeld.",
    benefitEn: "Ensures organized and balanced thinking by managing the flow of discussion.",
    benefitId: "Memastikan pemikiran yang terorganisir dan seimbang dengan mengelola alur diskusi.",
    benefitNl: "Zorgt voor georganiseerd en evenwichtig denken door de stroom van de discussie te beheren.",
    riskEn: "Poor facilitation may lead to bias or neglect of specific hats.",
    riskId: "Fasilitasi yang buruk dapat menyebabkan bias atau pengabaian topi tertentu.",
    riskNl: "Slechte facilitering kan leiden tot vooringenomenheid of verwaarlozing van specifieke hoeden.",
    questionsEn: ["What is our goal, and how should we structure the discussion?", "Have we considered all perspectives, and what's the next step?"],
    questionsId: ["Apa tujuan kita, dan bagaimana kita harus menyusun diskusi?", "Apakah kita telah mempertimbangkan semua perspektif, dan apa langkah selanjutnya?"],
    questionsNl: ["Wat is ons doel, en hoe moeten we de discussie structureren?", "Hebben we alle perspectieven overwogen, en wat is de volgende stap?"],
  },
];

const USE_CASES = [
  {
    titleEn: "Team Meetings", titleId: "Rapat Tim", titleNl: "Teamvergaderingen",
    descEn: "Assign specific hats to team members for structured, comprehensive discussion. Each person focuses on one perspective — facts, risks, or opportunities. Reduces bias and enhances collaboration.",
    descId: "Tetapkan topi tertentu kepada anggota tim untuk diskusi yang terstruktur dan komprehensif. Setiap orang berfokus pada satu perspektif — fakta, risiko, atau peluang. Mengurangi bias dan meningkatkan kolaborasi.",
    descNl: "Wijs specifieke hoeden toe aan teamleden voor gestructureerde, uitgebreide discussie. Iedereen richt zich op één perspectief — feiten, risico's of kansen. Vermindert vooringenomenheid en verbetert samenwerking.",
  },
  {
    titleEn: "Decision-Making", titleId: "Pengambilan Keputusan", titleNl: "Besluitvorming",
    descEn: "Sequentially apply the hats (White for facts, Black for risks, Yellow for opportunities) to create a logical flow. All perspectives are considered, resulting in informed and balanced decisions.",
    descId: "Terapkan topi secara berurutan (Putih untuk fakta, Hitam untuk risiko, Kuning untuk peluang) untuk menciptakan alur yang logis. Semua perspektif dipertimbangkan, menghasilkan keputusan yang terinformasi dan seimbang.",
    descNl: "Pas de hoeden opeenvolgend toe (Wit voor feiten, Zwart voor risico's, Geel voor kansen) om een logische stroom te creëren. Alle perspectieven worden meegenomen, wat resulteert in geïnformeerde en evenwichtige beslissingen.",
  },
  {
    titleEn: "Problem-Solving", titleId: "Pemecahan Masalah", titleNl: "Probleemoplossing",
    descEn: "Start with Green for creative solutions, switch to Black for challenges, then Blue to prioritize and create an action plan.",
    descId: "Mulai dengan Hijau untuk solusi kreatif, beralih ke Hitam untuk tantangan, lalu Biru untuk memprioritaskan dan membuat rencana tindakan.",
    descNl: "Begin met Groen voor creatieve oplossingen, schakel over naar Zwart voor uitdagingen, dan Blauw om te prioriteren en een actieplan op te stellen.",
  },
  {
    titleEn: "Conflict Resolution", titleId: "Resolusi Konflik", titleNl: "Conflictoplossing",
    descEn: "Begin with Red to allow everyone to express emotions, then White for factual points, Yellow to identify common goals and opportunities for resolution.",
    descId: "Mulai dengan Merah untuk memungkinkan semua orang mengekspresikan emosi, lalu Putih untuk poin faktual, Kuning untuk mengidentifikasi tujuan bersama dan peluang resolusi.",
    descNl: "Begin met Rood zodat iedereen emoties kan uiten, dan Wit voor feitelijke punten, Geel om gemeenschappelijke doelen en kansen voor oplossing te identificeren.",
  },
  {
    titleEn: "Strategic Planning", titleId: "Perencanaan Strategis", titleNl: "Strategische Planning",
    descEn: "White to analyze current data, Black to identify risks, Green for innovative strategies, Blue to organize all ideas into a coherent long-term plan.",
    descId: "Putih untuk menganalisis data saat ini, Hitam untuk mengidentifikasi risiko, Hijau untuk strategi inovatif, Biru untuk mengorganisir semua ide menjadi rencana jangka panjang yang koheren.",
    descNl: "Wit om huidige data te analyseren, Zwart om risico's te identificeren, Groen voor innovatieve strategieën, Blauw om alle ideeën te organiseren tot een coherent langetermijnplan.",
  },
  {
    titleEn: "Self-Reflection", titleId: "Refleksi Diri", titleNl: "Zelfreflectie",
    descEn: "Use all six hats individually to explore your thoughts, emotions, and ideas from multiple angles. Uncover blind spots and ensure a well-rounded understanding of personal challenges.",
    descId: "Gunakan keenam topi secara individual untuk mengeksplorasi pikiran, emosi, dan ide Anda dari berbagai sudut pandang. Temukan titik buta dan pastikan pemahaman yang menyeluruh tentang tantangan pribadi.",
    descNl: "Gebruik alle zes hoeden individueel om uw gedachten, emoties en ideeën vanuit meerdere hoeken te verkennen. Ontdek blinde vlekken en zorg voor een afgerond begrip van persoonlijke uitdagingen.",
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type Props = { userPathway: string | null; isSaved: boolean };

export default function SixThinkingHatsClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [activeHat, setActiveHat] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const tr = (en: string, id: string, nl: string) => t(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => { await saveResourceToDashboard("six-thinking-hats"); setSaved(true); });
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 80)", minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "96px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 80% 30%, oklch(65% 0.15 45) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {tr("Team & Facilitation · Guide", "Tim & Fasilitasi · Panduan", "Team & Facilitatie · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, margin: "0 0 24px", color: "oklch(96% 0.005 80)" }}>
            {tr("Six Thinking Hats", "Enam Topi Berpikir", "Zes Denkhoeden")}
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.65, color: "oklch(78% 0.04 260)", maxWidth: 580, margin: "0 0 40px" }}>
            {tr(
              "Edward de Bono's powerful framework for better decisions. By deliberately separating six modes of thinking, teams move from confusion to clarity — and from conflict to collaboration.",
              "Kerangka kuat Edward de Bono untuk keputusan yang lebih baik. Dengan sengaja memisahkan enam mode berpikir, tim bergerak dari kebingungan menuju kejelasan — dan dari konflik menuju kolaborasi.",
              "Edward de Bono's krachtige kader voor betere beslissingen. Door zes denkmodi bewust te scheiden, bewegen teams van verwarring naar helderheid — en van conflict naar samenwerking."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: saved ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved ? tr("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : tr("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(20px, 2.5vw, 26px)", lineHeight: 1.6, color: "oklch(30% 0.08 260)", fontStyle: "italic", marginBottom: 28 }}>
          {tr(
            '"The Six Thinking Hats method separates thinking into different modes, making it easier for people to think about the right things at the right time."',
            '"Metode Enam Topi Berpikir memisahkan pemikiran ke dalam mode yang berbeda, sehingga lebih mudah bagi orang untuk memikirkan hal yang tepat pada waktu yang tepat."',
            '"De Zes Denkhoeden-methode scheidt denken in verschillende modi, waardoor het voor mensen gemakkelijker wordt om op het juiste moment over de juiste dingen na te denken."'
          )}
        </p>
        <p style={{ fontSize: 14, color: "oklch(55% 0.06 260)", marginBottom: 32 }}>— Edward de Bono</p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "oklch(38% 0.05 260)" }}>
          {tr(
            "The Six Thinking Hats framework was developed by Dr. Edward de Bono to improve decision-making and problem-solving. By separating emotions, logic, creativity, and judgment into six distinct 'hats', teams can have more balanced and productive discussions — without the confusion that comes when everyone thinks in all directions at once.",
            "Kerangka Enam Topi Berpikir dikembangkan oleh Dr. Edward de Bono untuk meningkatkan pengambilan keputusan dan pemecahan masalah. Dengan memisahkan emosi, logika, kreativitas, dan penilaian menjadi enam 'topi' yang berbeda, tim dapat berdiskusi lebih seimbang dan produktif — tanpa kebingungan yang timbul ketika semua orang berpikir ke segala arah sekaligus.",
            "Het Zes Denkhoeden-kader werd ontwikkeld door Dr. Edward de Bono om besluitvorming en probleemoplossing te verbeteren. Door emoties, logica, creativiteit en oordeel te scheiden in zes afzonderlijke 'hoeden', kunnen teams evenwichtiger en productiever discussiëren — zonder de verwarring die ontstaat wanneer iedereen tegelijk in alle richtingen denkt."
          )}
        </p>
      </section>

      {/* HAT CARDS */}
      <section style={{ background: "oklch(95% 0.008 80)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {tr("The Six Hats", "Enam Topi", "De Zes Hoeden")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {tr("Select a hat to explore its focus, benefits, risks, and key questions.", "Pilih topi untuk menjelajahi fokus, manfaat, risiko, dan pertanyaan utamanya.", "Selecteer een hoed om de focus, voordelen, risico's en sleutelvragen te verkennen.")}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
            {HATS.map((hat, i) => (
              <button key={hat.num} onClick={() => setActiveHat(activeHat === i ? null : i)} style={{ padding: "10px 20px", borderRadius: 6, cursor: "pointer", background: activeHat === i ? hat.color : "white", color: activeHat === i ? "white" : "oklch(30% 0.08 260)", border: `1px solid ${activeHat === i ? hat.color : "oklch(88% 0.02 260)"}`, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, transition: "all 0.2s ease" }}>
                {tr(hat.colorName, hat.colorNameId, hat.colorNameNl)} — {tr(hat.focusEn, hat.focusId, hat.focusNl)}
              </button>
            ))}
          </div>
          {activeHat !== null && (() => {
            const hat = HATS[activeHat];
            return (
              <div style={{ background: hat.bg, borderRadius: 12, padding: "40px", border: `1px solid ${hat.color}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 600, color: hat.color, lineHeight: 1 }}>{hat.num}</span>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: hat.color, margin: 0 }}>
                      {tr(hat.colorName, hat.colorNameId, hat.colorNameNl)} Hat
                    </h3>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: hat.accent }}>
                      {tr(hat.focusEn, hat.focusId, hat.focusNl)}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "oklch(30% 0.06 260)", marginBottom: 28 }}>
                  {tr(hat.descEn, hat.descId, hat.descNl)}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
                  <div style={{ background: "white", borderRadius: 8, padding: "18px 20px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(45% 0.12 145)", marginBottom: 10 }}>
                      {tr("Benefit", "Manfaat", "Voordeel")}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: 0 }}>
                      {tr(hat.benefitEn, hat.benefitId, hat.benefitNl)}
                    </p>
                  </div>
                  <div style={{ background: "white", borderRadius: 8, padding: "18px 20px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(42% 0.12 25)", marginBottom: 10 }}>
                      {tr("Risk", "Risiko", "Risico")}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: 0 }}>
                      {tr(hat.riskEn, hat.riskId, hat.riskNl)}
                    </p>
                  </div>
                </div>
                <div style={{ background: "white", borderRadius: 8, padding: "18px 20px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: hat.accent, marginBottom: 12 }}>
                    {tr("Key Questions", "Pertanyaan Utama", "Sleutelvragen")}
                  </p>
                  {(lang === "en" ? hat.questionsEn : lang === "id" ? hat.questionsId : hat.questionsNl).map(q => (
                    <p key={q} style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: "0 0 8px", fontStyle: "italic" }}>"{q}"</p>
                  ))}
                </div>
              </div>
            );
          })()}
          {activeHat === null && (
            <div style={{ background: "oklch(94% 0.005 260)", borderRadius: 12, padding: "32px", textAlign: "center", color: "oklch(55% 0.05 260)", fontSize: 15 }}>
              {tr("Select a hat above to explore it.", "Pilih topi di atas untuk menjelajahinya.", "Selecteer een hoed hierboven om deze te verkennen.")}
            </div>
          )}
        </div>
      </section>

      {/* USE CASES */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {tr("How to Use the Six Hats", "Cara Menggunakan Enam Topi", "Hoe de Zes Hoeden te Gebruiken")}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
          {tr("Six contexts where the framework creates immediate value.", "Enam konteks di mana kerangka ini menciptakan nilai langsung.", "Zes contexten waar het kader direct waarde creëert.")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {USE_CASES.map((u, i) => (
            <div key={u.titleEn} style={{ background: "white", borderRadius: 10, padding: "24px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>
                    {tr(u.titleEn, u.titleId, u.titleNl)}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>
                    {tr(u.descEn, u.descId, u.descNl)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {tr("Try It in Your Next Meeting", "Coba di Rapat Berikutnya", "Probeer het in je Volgende Vergadering")}
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {tr("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
