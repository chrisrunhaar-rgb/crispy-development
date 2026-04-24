"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard, saveRLGLScore } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

const tr = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const GREEN_PRINCIPLES = [
  {
    titleEn: "Exploration", titleId: "Eksplorasi", titleNl: "Verkenning",
    descEn: "Open the floor to any and all possibilities — no idea is too wild at this stage.",
    descId: "Buka ruang untuk semua kemungkinan — tidak ada ide yang terlalu liar pada tahap ini.",
    descNl: "Open de vloer voor alle mogelijkheden — geen idee is te gek in dit stadium.",
  },
  {
    titleEn: "Open-Mindedness", titleId: "Keterbukaan Pikiran", titleNl: "Openheid",
    descEn: "Consider even the 'unlikely' or 'radical' ideas. Breakthrough thinking often starts at the edges.",
    descId: "Pertimbangkan bahkan ide yang 'tidak mungkin' atau 'radikal'. Pemikiran terobosan sering dimulai dari pinggiran.",
    descNl: "Overweeg zelfs de 'onwaarschijnlijke' of 'radicale' ideeën. Doorbraakdenken begint vaak aan de randen.",
  },
  {
    titleEn: "Divergent Thinking", titleId: "Pemikiran Divergen", titleNl: "Divergent Denken",
    descEn: "Aim for quantity over quality — you'll sort later. Volume of ideas fuels creativity.",
    descId: "Utamakan kuantitas daripada kualitas — Anda akan memilah nanti. Volume ide mendorong kreativitas.",
    descNl: "Streef naar kwantiteit boven kwaliteit — je sorteert later. Volume aan ideeën voedt creativiteit.",
  },
  {
    titleEn: "Encouragement", titleId: "Dorongan", titleNl: "Aanmoediging",
    descEn: "Build on others' suggestions with 'Yes, and…' thinking. Momentum grows through addition.",
    descId: "Bangun di atas saran orang lain dengan pemikiran 'Ya, dan…'. Momentum tumbuh melalui penambahan.",
    descNl: "Bouw voort op suggesties van anderen met 'Ja, en…' denken. Momentum groeit door toevoeging.",
  },
  {
    titleEn: "No Judgment", titleId: "Tanpa Penilaian", titleNl: "Geen Oordeel",
    descEn: "No criticism, evaluation, or filtering at this stage. Premature judgment kills creativity.",
    descId: "Tidak ada kritik, evaluasi, atau penyaringan pada tahap ini. Penilaian dini membunuh kreativitas.",
    descNl: "Geen kritiek, evaluatie of filteren in dit stadium. Voortijdig oordelen doodt creativiteit.",
  },
  {
    titleEn: "Delay Analysis", titleId: "Tunda Analisis", titleNl: "Uitgestelde Analyse",
    descEn: "Don't try to decide yet — just imagine what's possible. The decision comes later.",
    descId: "Jangan mencoba memutuskan dulu — bayangkan saja apa yang mungkin. Keputusan akan datang kemudian.",
    descNl: "Probeer nog niet te beslissen — stel je gewoon voor wat mogelijk is. De beslissing komt later.",
  },
];

const RED_PRINCIPLES = [
  {
    titleEn: "Evaluation", titleId: "Evaluasi", titleNl: "Evaluatie",
    descEn: "Critically assess all the ideas generated in the Green phase — not to kill them, but to stress-test them.",
    descId: "Nilai secara kritis semua ide yang dihasilkan dalam fase Hijau — bukan untuk mematikannya, tetapi untuk mengujinya.",
    descNl: "Beoordeel kritisch alle ideeën uit de Groene fase — niet om ze te doden, maar om ze te testen.",
  },
  {
    titleEn: "Critical Thinking", titleId: "Pemikiran Kritis", titleNl: "Kritisch Denken",
    descEn: "Weigh risks, benefits, and practicalities. Good ideas survive scrutiny; great ones become better through it.",
    descId: "Timbang risiko, manfaat, dan kepraktisan. Ide yang baik bertahan dari pengawasan; ide yang hebat menjadi lebih baik karenanya.",
    descNl: "Weeg risico's, voordelen en praktische aspecten. Goede ideeën overleven scrutiny; grote ideeën worden er beter door.",
  },
  {
    titleEn: "Convergent Thinking", titleId: "Pemikiran Konvergen", titleNl: "Convergent Denken",
    descEn: "Narrow ideas to the most viable options. Focus enables execution — too many options stall progress.",
    descId: "Sempurnakan ide menjadi pilihan yang paling layak. Fokus memungkinkan pelaksanaan — terlalu banyak pilihan menghentikan kemajuan.",
    descNl: "Versmal ideeën tot de meest haalbare opties. Focus maakt uitvoering mogelijk — te veel opties blokkeren voortgang.",
  },
  {
    titleEn: "Decision-Making", titleId: "Pengambilan Keputusan", titleNl: "Besluitvorming",
    descEn: "Choose based on values, evidence, and strategy — not just what feels comfortable or familiar.",
    descId: "Pilih berdasarkan nilai, bukti, dan strategi — bukan hanya apa yang terasa nyaman atau familiar.",
    descNl: "Kies op basis van waarden, bewijs en strategie — niet alleen wat comfortabel of vertrouwd voelt.",
  },
  {
    titleEn: "Feedback", titleId: "Umpan Balik", titleNl: "Feedback",
    descEn: "Offer constructive critique to improve or combine ideas. Refinement is an act of respect for the original thinking.",
    descId: "Berikan kritik konstruktif untuk memperbaiki atau menggabungkan ide. Penyempurnaan adalah bentuk penghormatan terhadap pemikiran asli.",
    descNl: "Bied constructieve kritiek om ideeën te verbeteren of combineren. Verfijning is een blijk van respect voor het oorspronkelijke denken.",
  },
];

const GREEN_PHRASES = [
  "What else could we try?",
  "Even wild ideas are welcome right now.",
  "Let's keep adding before we evaluate.",
  "There are no bad ideas in this phase.",
  "Build on what someone else just said.",
  "Let's imagine what's possible without limits.",
];

const GREEN_PHRASES_ID = [
  "Apa lagi yang bisa kita coba?",
  "Bahkan ide-ide gila pun disambut sekarang.",
  "Mari terus tambahkan sebelum kita evaluasi.",
  "Tidak ada ide yang buruk dalam fase ini.",
  "Bangun di atas apa yang baru saja dikatakan orang lain.",
  "Mari bayangkan apa yang mungkin tanpa batas.",
];

const GREEN_PHRASES_NL = [
  "Wat kunnen we nog meer proberen?",
  "Zelfs wilde ideeën zijn nu welkom.",
  "Laten we blijven toevoegen voordat we evalueren.",
  "Er zijn geen slechte ideeën in deze fase.",
  "Bouw voort op wat iemand anders net zei.",
  "Laten we ons voorstellen wat mogelijk is zonder beperkingen.",
];

const RED_PHRASES = [
  "What are the risks of this option?",
  "Which idea fits our current goals best?",
  "What evidence supports this idea?",
  "What are the potential downsides or obstacles?",
  "Is this realistic with our current resources?",
];

const RED_PHRASES_ID = [
  "Apa risiko dari pilihan ini?",
  "Ide mana yang paling sesuai dengan tujuan kita saat ini?",
  "Bukti apa yang mendukung ide ini?",
  "Apa potensi kerugian atau hambatannya?",
  "Apakah ini realistis dengan sumber daya kita saat ini?",
];

const RED_PHRASES_NL = [
  "Wat zijn de risico's van deze optie?",
  "Welk idee past het beste bij onze huidige doelen?",
  "Welk bewijs ondersteunt dit idee?",
  "Wat zijn de potentiële nadelen of obstakels?",
  "Is dit realistisch met onze huidige middelen?",
];

const STEPS = [
  {
    num: "01",
    titleEn: "Explain the Two Phases", titleId: "Jelaskan Dua Fase", titleNl: "Leg de Twee Fasen Uit",
    descEn: "Clarify the difference between Green and Red thinking before starting. Make sure everyone understands which mode is active.",
    descId: "Jelaskan perbedaan antara pemikiran Hijau dan Merah sebelum memulai. Pastikan semua orang memahami mode mana yang aktif.",
    descNl: "Verduidelijk het verschil tussen Groen en Rood denken voordat je begint. Zorg dat iedereen begrijpt welke modus actief is.",
  },
  {
    num: "02",
    titleEn: "Begin with GREEN Phase", titleId: "Mulai dengan Fase HIJAU", titleNl: "Begin met de GROENE Fase",
    descEn: "Set a timer (e.g., 10–15 mins). Capture all ideas — no limits. Appoint a scribe so nothing is lost.",
    descId: "Atur timer (misalnya, 10-15 menit). Catat semua ide — tanpa batas. Tunjuk pencatat agar tidak ada yang terlewat.",
    descNl: "Stel een timer in (bijv. 10–15 min). Noteer alle ideeën — geen beperkingen. Wijs een notulist aan zodat niets verloren gaat.",
  },
  {
    num: "03",
    titleEn: "Shift to RED Phase", titleId: "Beralih ke Fase MERAH", titleNl: "Schakel over naar de RODE Fase",
    descEn: "Announce the switch clearly. Begin reviewing, discussing, and deciding. Don't let the phases blur.",
    descId: "Umumkan perpindahan dengan jelas. Mulai tinjau, diskusikan, dan putuskan. Jangan biarkan fase-fase menjadi kabur.",
    descNl: "Kondig de overschakeling duidelijk aan. Begin met beoordelen, bespreken en beslissen. Laat de fasen niet vervagen.",
  },
  {
    num: "04",
    titleEn: "Finalize & Assign Action", titleId: "Finalisasi & Tetapkan Tindakan", titleNl: "Finaliseer & Wijs Actie Toe",
    descEn: "Choose next steps, assign responsibilities, and revisit if more clarity is needed. End with clear ownership.",
    descId: "Pilih langkah selanjutnya, tetapkan tanggung jawab, dan tinjau kembali jika diperlukan lebih banyak kejelasan. Akhiri dengan kepemilikan yang jelas.",
    descNl: "Kies volgende stappen, wijs verantwoordelijkheden toe en herzie indien meer duidelijkheid nodig is. Eindig met duidelijk eigenaarschap.",
  },
];

const QUIZ_STATEMENTS = [
  { en: "Let's collect as many ideas as possible before we judge any of them.", id: "Mari kumpulkan sebanyak mungkin ide sebelum kita menilai salah satunya.", nl: "Laten we zo veel mogelijk ideeën verzamelen voordat we er een beoordelen.", answer: "green" as const },
  { en: "Which of these options best aligns with our goals and available resources?", id: "Pilihan mana yang paling sesuai dengan tujuan dan sumber daya kita?", nl: "Welke van deze opties sluit het beste aan bij onze doelen en beschikbare middelen?", answer: "red" as const },
  { en: "What if we tried the complete opposite of what we normally do?", id: "Bagaimana jika kita mencoba kebalikan dari apa yang biasanya kita lakukan?", nl: "Wat als we het tegenovergestelde probeerden van wat we normaal doen?", answer: "green" as const },
  { en: "We need to assess the risks before committing to this direction.", id: "Kita perlu menilai risiko sebelum berkomitmen pada arah ini.", nl: "We moeten de risico's beoordelen voordat we ons committeren aan deze richting.", answer: "red" as const },
  { en: "Yes, and — what if we built on that idea and took it even further?", id: "Ya, dan — bagaimana jika kita membangun di atas ide itu dan membawanya lebih jauh lagi?", nl: "Ja, en — wat als we voortbouwden op dat idee en het nog verder brachten?", answer: "green" as const },
  { en: "Let's narrow this down to the two strongest options and make a decision today.", id: "Mari persempit ini menjadi dua opsi terkuat dan buat keputusan hari ini.", nl: "Laten we dit terugbrengen tot de twee sterkste opties en vandaag een beslissing nemen.", answer: "red" as const },
  { en: "There are no bad ideas at this stage — everything is welcome.", id: "Tidak ada ide yang buruk pada tahap ini — semuanya disambut.", nl: "Er zijn geen slechte ideeën in dit stadium — alles is welkom.", answer: "green" as const },
  { en: "What evidence do we have that this approach will actually work?", id: "Bukti apa yang kita miliki bahwa pendekatan ini benar-benar akan berhasil?", nl: "Welk bewijs hebben we dat deze aanpak echt zal werken?", answer: "red" as const },
  { en: "Let's give everyone 5 minutes to write down every idea — no matter how wild.", id: "Mari berikan semua orang 5 menit untuk menuliskan setiap ide — tidak peduli seberapa liarnya.", nl: "Laten we iedereen 5 minuten geven om elk idee op te schrijven — hoe wild ook.", answer: "green" as const },
  { en: "Before we move on, who will own this decision and be accountable for the outcome?", id: "Sebelum kita melanjutkan, siapa yang akan memiliki keputusan ini dan bertanggung jawab atas hasilnya?", nl: "Voordat we verdergaan, wie neemt eigenaarschap over deze beslissing en is verantwoordelijk voor de uitkomst?", answer: "red" as const },
  { en: "What would the most creative solution look like if there were no constraints at all?", id: "Seperti apa solusi paling kreatif jika tidak ada hambatan sama sekali?", nl: "Hoe zou de meest creatieve oplossing eruitzien als er helemaal geen beperkingen waren?", answer: "green" as const },
  { en: "Let's be realistic — not all of these ideas fit our current budget or timeline.", id: "Mari realistis — tidak semua ide ini sesuai dengan anggaran atau jadwal kita saat ini.", nl: "Laten we realistisch zijn — niet al deze ideeën passen in ons huidige budget of tijdlijn.", answer: "red" as const },
  { en: "Let's suspend judgment for now and keep adding to the list.", id: "Mari tunda penilaian untuk sementara dan terus tambahkan ke daftar.", nl: "Laten we het oordeel voorlopig uitstellen en doorgaan met toevoegen aan de lijst.", answer: "green" as const },
  { en: "Let's evaluate each idea against our defined criteria before moving forward.", id: "Mari evaluasi setiap ide berdasarkan kriteria yang telah ditetapkan sebelum melanjutkan.", nl: "Laten we elk idee beoordelen aan de hand van onze vastgestelde criteria voordat we verdergaan.", answer: "red" as const },
  { en: "I want to hear from everyone — every perspective adds value at this point.", id: "Saya ingin mendengar dari semua orang — setiap perspektif menambah nilai pada titik ini.", nl: "Ik wil van iedereen horen — elk perspectief voegt op dit punt waarde toe.", answer: "green" as const },
  { en: "Based on the data, option A performs better — let's go with that.", id: "Berdasarkan data, opsi A lebih baik — mari kita pilih itu.", nl: "Op basis van de gegevens presteert optie A beter — laten we daarvoor kiezen.", answer: "red" as const },
  { en: "Even unlikely solutions might lead us somewhere unexpected and valuable.", id: "Bahkan solusi yang tampak tidak mungkin bisa membawa kita ke suatu tempat yang tidak terduga dan berharga.", nl: "Zelfs onwaarschijnlijke oplossingen kunnen ons naar iets onverwachts en waardevols leiden.", answer: "green" as const },
  { en: "Let's weigh the pros and cons and commit to one clear direction.", id: "Mari pertimbangkan pro dan kontra dan berkomitmen pada satu arah yang jelas.", nl: "Laten we de voor- en nadelen afwegen en ons committeren aan één duidelijke richting.", answer: "red" as const },
  { en: "What's a completely different approach we've never considered before?", id: "Apa pendekatan yang sama sekali berbeda yang belum pernah kita pertimbangkan sebelumnya?", nl: "Wat is een compleet andere aanpak die we nog nooit hebben overwogen?", answer: "green" as const },
  { en: "We need to document this decision and the reasoning behind it for the team.", id: "Kita perlu mendokumentasikan keputusan ini dan alasan di baliknya untuk tim.", nl: "We moeten deze beslissing en de redenering erachter documenteren voor het team.", answer: "red" as const },
];

export default function RedLightGreenLightClient({
  userPathway,
  isSaved,
  savedScore,
}: {
  userPathway: string | null;
  isSaved: boolean;
  savedScore?: number | null;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [activePhase, setActivePhase] = useState<"green" | "red">("green");
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, "green" | "red">>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(savedScore ?? null);
  const [scoreSaved, setScoreSaved] = useState(savedScore != null);
  const [isSavingScore, startSaveScore] = useTransition();

  const t = (en: string, id: string, nl: string) => tr(en, id, nl, lang);

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("red-light-green-light");
      setSaved(true);
    });
  }

  function handleAnswer(idx: number, val: "green" | "red") {
    setAnswers(prev => ({ ...prev, [idx]: val }));
  }

  function handleSubmitQuiz() {
    const correct = QUIZ_STATEMENTS.filter((q, i) => answers[i] === q.answer).length;
    const pct = Math.round((correct / QUIZ_STATEMENTS.length) * 100);
    setQuizScore(pct);
    setQuizSubmitted(true);
  }

  function handleSaveScore() {
    if (quizScore == null) return;
    startSaveScore(async () => {
      await saveRLGLScore(quizScore);
      setScoreSaved(true);
    });
  }

  function handleRetakeQuiz() {
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(savedScore ?? null);
    setScoreSaved(savedScore != null);
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUIZ_STATEMENTS.length;

  const isGreen = activePhase === "green";
  const phaseColor = isGreen ? "oklch(46% 0.16 145)" : "oklch(48% 0.18 25)";
  const phaseBg = isGreen ? "oklch(46% 0.16 145 / 0.08)" : "oklch(48% 0.18 25 / 0.08)";
  const phrases = isGreen
    ? (lang === "en" ? GREEN_PHRASES : lang === "id" ? GREEN_PHRASES_ID : GREEN_PHRASES_NL)
    : (lang === "en" ? RED_PHRASES : lang === "id" ? RED_PHRASES_ID : RED_PHRASES_NL);
  const principles = isGreen ? GREEN_PRINCIPLES : RED_PRINCIPLES;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>Guide</span>
            
          </div>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Team & Facilitation · Guide", "Tim & Fasilitasi · Panduan", "Team & Facilitatie · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px", lineHeight: 1.1 }}>
            {t("Red Light & Green Light Thinking", "Pemikiran Lampu Merah & Lampu Hijau", "Rood Licht & Groen Licht Denken")}
          </h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
            {t(
              "A facilitation framework that separates creative idea generation (Green Light) from critical evaluation and decision-making (Red Light) — helping teams be more innovative and more decisive.",
              "Kerangka fasilitasi yang memisahkan generasi ide kreatif (Lampu Hijau) dari evaluasi kritis dan pengambilan keputusan (Lampu Merah) — membantu tim menjadi lebih inovatif dan lebih tegas.",
              "Een facilitatiekader dat creatieve ideeëngeneratie (Groen Licht) scheidt van kritische evaluatie en besluitvorming (Rood Licht) — teams helpen innovatiever en besluitvaardiger te zijn."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "transparent", color: "oklch(85% 0.04 260)", padding: "13px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>
                ✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* PHASE TOGGLE */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("The Two Phases", "Dua Fase", "De Twee Fasen")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 32, lineHeight: 1.65 }}>
            {t("Select a phase to explore its principles and suggested phrases.", "Pilih fase untuk menjelajahi prinsip dan frasa yang disarankan.", "Selecteer een fase om de principes en voorgestelde zinnen te verkennen.")}
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
            <button onClick={() => setActivePhase("green")} style={{ flex: 1, minWidth: 200, padding: "20px 24px", borderRadius: 10, border: `2px solid ${isGreen ? "oklch(46% 0.16 145)" : "oklch(88% 0.008 260)"}`, background: isGreen ? "oklch(46% 0.16 145)" : "white", color: isGreen ? "white" : "oklch(30% 0.06 260)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 6, color: isGreen ? "oklch(92% 0.06 145)" : "oklch(46% 0.16 145)" }}>Phase 1</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>
                🟢 {t("Green Light", "Lampu Hijau", "Groen Licht")}
              </div>
              <div style={{ fontSize: 13, marginTop: 6, color: isGreen ? "oklch(90% 0.05 145)" : "oklch(48% 0.06 260)" }}>
                {t("Generate ideas freely", "Hasilkan ide secara bebas", "Genereer ideeën vrijelijk")}
              </div>
            </button>
            <button onClick={() => setActivePhase("red")} style={{ flex: 1, minWidth: 200, padding: "20px 24px", borderRadius: 10, border: `2px solid ${!isGreen ? "oklch(48% 0.18 25)" : "oklch(88% 0.008 260)"}`, background: !isGreen ? "oklch(48% 0.18 25)" : "white", color: !isGreen ? "white" : "oklch(30% 0.06 260)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 6, color: !isGreen ? "oklch(92% 0.06 25)" : "oklch(48% 0.18 25)" }}>Phase 2</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>
                🔴 {t("Red Light", "Lampu Merah", "Rood Licht")}
              </div>
              <div style={{ fontSize: 13, marginTop: 6, color: !isGreen ? "oklch(90% 0.05 25)" : "oklch(48% 0.06 260)" }}>
                {t("Evaluate and decide", "Evaluasi dan putuskan", "Evalueer en beslis")}
              </div>
            </button>
          </div>

          <div style={{ background: phaseBg, borderRadius: 12, padding: "40px", border: `1px solid ${phaseColor}30` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 32 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: phaseColor, marginBottom: 20 }}>
                  {t("Principles", "Prinsip", "Principes")}
                </p>
                {principles.map(p => (
                  <div key={p.titleEn} style={{ marginBottom: 16 }}>
                    <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 4px" }}>
                      {t(p.titleEn, p.titleId, p.titleNl)}
                    </h4>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "oklch(40% 0.06 260)", margin: 0 }}>
                      {t(p.descEn, p.descId, p.descNl)}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: phaseColor, marginBottom: 20 }}>
                  {t("Suggested Phrases", "Frasa yang Disarankan", "Voorgestelde Zinnen")}
                </p>
                <div style={{ background: "white", borderRadius: 8, padding: "20px" }}>
                  {phrases.map((phrase, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < phrases.length - 1 ? 12 : 0 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: phaseColor, flexShrink: 0, marginTop: 7 }} />
                      <p style={{ fontSize: 14, lineHeight: 1.55, color: "oklch(30% 0.06 260)", margin: 0, fontStyle: "italic" }}>&ldquo;{phrase}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ SECTION */}
      <section style={{ padding: "72px 24px", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>
                {t("Test Your Understanding", "Uji Pemahaman Anda", "Test Uw Begrip")}
              </h2>
              <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", lineHeight: 1.65, margin: 0 }}>
                {t(
                  "20 real-world statements. Identify whether each belongs to Green Light or Red Light thinking.",
                  "20 pernyataan dunia nyata. Identifikasi apakah setiap pernyataan termasuk pemikiran Lampu Hijau atau Lampu Merah.",
                  "20 praktijkgerichte uitspraken. Identificeer of elke uitspraak bij Groen Licht of Rood Licht denken hoort."
                )}
              </p>
            </div>
            {quizScore != null && !quizOpen && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", marginBottom: 2 }}>
                    {t("Your Score", "Skor Anda", "Uw Score")}
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: quizScore >= 80 ? "oklch(46% 0.16 145)" : quizScore >= 60 ? "oklch(65% 0.15 45)" : "oklch(48% 0.18 25)", lineHeight: 1 }}>{quizScore}%</div>
                </div>
              </div>
            )}
          </div>

          {!quizOpen && (
            <div style={{ marginTop: 28 }}>
              <button
                onClick={() => { setQuizOpen(true); if (quizSubmitted) handleRetakeQuiz(); }}
                style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}
              >
                {quizScore != null ? t("Retake Quiz", "Ikuti Kuis Lagi", "Quiz Opnieuw Doen") : t("Start Quiz", "Mulai Kuis", "Quiz Starten")}
              </button>
            </div>
          )}

          {quizOpen && (
            <div style={{ marginTop: 32 }}>
              {!quizSubmitted && (
                <p style={{ fontSize: 13, color: "oklch(52% 0.06 260)", marginBottom: 24 }}>
                  {t(`${answeredCount} of ${QUIZ_STATEMENTS.length} answered`, `${answeredCount} dari ${QUIZ_STATEMENTS.length} terjawab`, `${answeredCount} van ${QUIZ_STATEMENTS.length} beantwoord`)}
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {QUIZ_STATEMENTS.map((q, i) => {
                  const userAnswer = answers[i];
                  const correct = q.answer;
                  const isCorrect = userAnswer === correct;
                  const showResult = quizSubmitted;

                  let cardBg = "oklch(97% 0.005 260)";
                  if (showResult && userAnswer) {
                    cardBg = isCorrect ? "oklch(95% 0.04 145)" : "oklch(96% 0.04 25)";
                  }

                  return (
                    <div key={i} style={{ background: cardBg, borderRadius: 10, padding: "20px 24px", border: `1px solid ${showResult && userAnswer ? (isCorrect ? "oklch(46% 0.16 145 / 0.25)" : "oklch(48% 0.18 25 / 0.25)") : "oklch(88% 0.008 260)"}`, transition: "background 0.2s" }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0, marginTop: 2, minWidth: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 15, lineHeight: 1.6, color: "oklch(22% 0.10 260)", margin: "0 0 14px", fontWeight: 500 }}>
                            {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                          </p>
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button
                              onClick={() => !quizSubmitted && handleAnswer(i, "green")}
                              disabled={quizSubmitted}
                              style={{
                                padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: quizSubmitted ? "default" : "pointer",
                                border: `2px solid ${userAnswer === "green" ? "oklch(46% 0.16 145)" : "oklch(85% 0.008 260)"}`,
                                background: userAnswer === "green" ? "oklch(46% 0.16 145)" : "white",
                                color: userAnswer === "green" ? "white" : "oklch(40% 0.06 260)",
                                letterSpacing: "0.04em",
                              }}
                            >
                              🟢 {t("Green Light", "Lampu Hijau", "Groen Licht")}
                            </button>
                            <button
                              onClick={() => !quizSubmitted && handleAnswer(i, "red")}
                              disabled={quizSubmitted}
                              style={{
                                padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: quizSubmitted ? "default" : "pointer",
                                border: `2px solid ${userAnswer === "red" ? "oklch(48% 0.18 25)" : "oklch(85% 0.008 260)"}`,
                                background: userAnswer === "red" ? "oklch(48% 0.18 25)" : "white",
                                color: userAnswer === "red" ? "white" : "oklch(40% 0.06 260)",
                                letterSpacing: "0.04em",
                              }}
                            >
                              🔴 {t("Red Light", "Lampu Merah", "Rood Licht")}
                            </button>
                            {showResult && userAnswer && (
                              <span style={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, color: isCorrect ? "oklch(40% 0.16 145)" : "oklch(42% 0.18 25)", gap: 4 }}>
                                {isCorrect ? "✓ " : "✗ "}
                                {!isCorrect && (
                                  <span style={{ fontWeight: 400, color: "oklch(42% 0.18 25)" }}>
                                    {t(
                                      `Answer: ${correct === "green" ? "Green Light" : "Red Light"}`,
                                      `Jawaban: ${correct === "green" ? "Lampu Hijau" : "Lampu Merah"}`,
                                      `Antwoord: ${correct === "green" ? "Groen Licht" : "Rood Licht"}`
                                    )}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <div style={{ marginTop: 28, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={!allAnswered}
                    style={{ background: allAnswered ? "oklch(22% 0.10 260)" : "oklch(80% 0.008 260)", color: allAnswered ? "white" : "oklch(55% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: allAnswered ? "pointer" : "not-allowed", letterSpacing: "0.04em" }}
                  >
                    {t("Submit Answers", "Kirim Jawaban", "Antwoorden Indienen")}
                  </button>
                  {!allAnswered && (
                    <span style={{ fontSize: 13, color: "oklch(52% 0.06 260)" }}>
                      {t(
                        `${QUIZ_STATEMENTS.length - answeredCount} questions remaining`,
                        `${QUIZ_STATEMENTS.length - answeredCount} pertanyaan tersisa`,
                        `${QUIZ_STATEMENTS.length - answeredCount} vragen resterend`
                      )}
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ marginTop: 32, background: "oklch(94% 0.008 260)", borderRadius: 12, padding: "32px 36px" }}>
                  <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(44% 0.06 260)", marginBottom: 4 }}>
                        {t("Your Score", "Skor Anda", "Uw Score")}
                      </div>
                      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 56, fontWeight: 700, color: quizScore! >= 80 ? "oklch(46% 0.16 145)" : quizScore! >= 60 ? "oklch(65% 0.15 45)" : "oklch(48% 0.18 25)", lineHeight: 1 }}>{quizScore}%</div>
                      <div style={{ fontSize: 13, color: "oklch(44% 0.06 260)", marginTop: 4 }}>
                        {QUIZ_STATEMENTS.filter((q, i) => answers[i] === q.answer).length} / {QUIZ_STATEMENTS.length} {t("correct", "benar", "goed")}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <p style={{ fontSize: 15, lineHeight: 1.6, color: "oklch(30% 0.06 260)", margin: 0 }}>
                        {quizScore! >= 90
                          ? t("Excellent! You have a strong grasp of both thinking modes.", "Luar biasa! Anda memiliki pemahaman yang kuat tentang kedua mode berpikir.", "Uitstekend! U heeft een sterke grip op beide denkmodi.")
                          : quizScore! >= 75
                          ? t("Good work! A few distinctions still to sharpen — review the highlighted ones.", "Kerja bagus! Beberapa perbedaan masih perlu diasah — tinjau yang disorot.", "Goed gedaan! Een paar onderscheidingen nog te verscherpen — bekijk de gemarkeerde.")
                          : quizScore! >= 60
                          ? t("A solid start. Re-read the principles above and try again.", "Awal yang solid. Baca kembali prinsip-prinsip di atas dan coba lagi.", "Een solide begin. Herlee de bovenstaande principes en probeer opnieuw.")
                          : t("Keep practicing. The distinction between the two phases becomes clear with experience.", "Terus berlatih. Perbedaan antara dua fase menjadi jelas dengan pengalaman.", "Blijf oefenen. Het onderscheid tussen de twee fasen wordt duidelijk met ervaring.")}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {!scoreSaved ? (
                      <button
                        onClick={handleSaveScore}
                        disabled={isSavingScore}
                        style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "12px 28px", borderRadius: 6, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", letterSpacing: "0.04em" }}
                      >
                        {isSavingScore ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save Score to Dashboard", "Simpan Skor ke Dashboard", "Score Opslaan in Dashboard")}
                      </button>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "oklch(40% 0.16 145)", fontWeight: 700, fontSize: 13 }}>✓ {t("Score Saved", "Skor Disimpan", "Score Opgeslagen")}</span>
                    )}
                    <button
                      onClick={handleRetakeQuiz}
                      style={{ background: "transparent", color: "oklch(30% 0.06 260)", padding: "12px 28px", borderRadius: 6, fontWeight: 600, fontSize: 13, border: "1px solid oklch(82% 0.008 260)", cursor: "pointer" }}
                    >
                      {t("Retake Quiz", "Ikuti Kuis Lagi", "Quiz Opnieuw Doen")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* HOW TO FACILITATE */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {t("How to Facilitate This Tool", "Cara Memfasilitasi Alat Ini", "Hoe Dit Instrument te Faciliteren")}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
          {t(
            "Four steps to run an effective Red Light & Green Light session with your team.",
            "Empat langkah untuk menjalankan sesi Lampu Merah & Lampu Hijau yang efektif bersama tim Anda.",
            "Vier stappen om een effectieve Rood Licht & Groen Licht sessie te leiden met uw team."
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {STEPS.map(step => (
            <div key={step.num} style={{ background: "white", borderRadius: 10, padding: "24px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 600, color: "oklch(65% 0.15 45)", lineHeight: 1, flexShrink: 0 }}>{step.num}</span>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>
                    {t(step.titleEn, step.titleId, step.titleNl)}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(42% 0.06 260)", margin: 0 }}>
                    {t(step.descEn, step.descId, step.descNl)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "oklch(96% 0.008 260)", borderRadius: 10, padding: "24px 28px", marginTop: 32 }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "oklch(38% 0.06 260)", margin: 0 }}>
            <strong style={{ color: "oklch(22% 0.10 260)" }}>{t("Practical tip:", "Tips praktis:", "Praktische tip:")}</strong>{" "}
            {t(
              "Use visual cues like colored cards or signs to mark phase shifts. Appoint a facilitator to keep the team in the right mode. Learn to recognize what the moment calls for — creative space when the team is stuck, or focused evaluation when there are too many ideas.",
              "Gunakan isyarat visual seperti kartu atau tanda berwarna untuk menandai perpindahan fase. Tunjuk fasilitator untuk menjaga tim dalam mode yang tepat. Belajarlah mengenali apa yang dibutuhkan saat ini — ruang kreatif ketika tim terhenti, atau evaluasi terfokus ketika ada terlalu banyak ide.",
              "Gebruik visuele signalen zoals gekleurde kaarten of borden om fasewisselingen te markeren. Wijs een facilitator aan om het team in de juiste modus te houden. Leer herkennen wat het moment vraagt — creatieve ruimte wanneer het team vastzit, of gerichte evaluatie wanneer er te veel ideeën zijn."
            )}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t("Bring This Into Your Next Session", "Bawa Ini ke Sesi Berikutnya", "Breng Dit Mee naar Uw Volgende Sessie")}
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
