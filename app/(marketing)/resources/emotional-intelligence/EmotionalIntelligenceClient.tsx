"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const DOMAINS = [
  {
    id: "sa",
    number: "01",
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.08)",
    en_title: "Self-Awareness",
    id_title: "Kesadaran Diri",
    nl_title: "Zelfbewustzijn",
    en_scenario: "You're in a tense team meeting. A colleague pushes back on your proposal in front of everyone. Before you respond — do you notice what's happening inside you? The irritation, the defensiveness, the urge to justify?",
    id_scenario: "Anda sedang dalam rapat tim yang tegang. Seorang rekan menolak usulan Anda di depan semua orang. Sebelum Anda merespons — apakah Anda memperhatikan apa yang terjadi di dalam diri Anda? Iritasi, defensif, dorongan untuk membenarkan diri?",
    nl_scenario: "Je zit in een gespannen teamvergadering. Een collega stelt je voorstel in twijfel voor iedereen. Voor je reageert — merk je op wat er in je omgaat? De irritatie, de defensiviteit, de drang om je te rechtvaardigen?",
    en_question: "How clearly and quickly do you notice your own emotional reactions in high-pressure moments?",
    id_question: "Seberapa jelas dan cepat Anda menyadari reaksi emosional Anda sendiri dalam momen tekanan tinggi?",
    nl_question: "Hoe duidelijk en snel merk je je eigen emotionele reacties op in momenten van druk?",
  },
  {
    id: "sr",
    number: "02",
    color: "oklch(48% 0.14 145)",
    colorBg: "oklch(48% 0.14 145 / 0.08)",
    en_title: "Self-Regulation",
    id_title: "Regulasi Diri",
    nl_title: "Zelfregulering",
    en_scenario: "Your team member has missed a clear deadline — again. You feel frustration rising. You have two choices: react from the frustration, or pause, process, and respond from a grounded place.",
    id_scenario: "Anggota tim Anda melewatkan tenggat waktu yang jelas — lagi. Anda merasakan frustrasi meningkat. Anda memiliki dua pilihan: bereaksi dari frustrasi, atau berhenti sejenak, memproses, dan merespons dari tempat yang lebih tenang.",
    nl_scenario: "Je teamlid heeft opnieuw een duidelijke deadline gemist. Je voelt frustratie opkomen. Je hebt twee keuzes: reageren vanuit die frustratie, of even pauzeren, verwerken en reageren vanuit een rustiger plek.",
    en_question: "How consistently do you pause before reacting and respond from calm rather than impulse?",
    id_question: "Seberapa konsisten Anda berhenti sejenak sebelum bereaksi dan merespons dari ketenangan daripada impuls?",
    nl_question: "Hoe consistent pauzeer je voor je reageert en reageer je vanuit rust in plaats van impuls?",
  },
  {
    id: "mo",
    number: "03",
    color: "oklch(55% 0.14 230)",
    colorBg: "oklch(55% 0.14 230 / 0.08)",
    en_title: "Motivation",
    id_title: "Motivasi",
    nl_title: "Motivatie",
    en_scenario: "Three weeks into a difficult cross-cultural project, progress is slow. The team is struggling, the outcomes are unclear, and you're losing sleep. No one is watching closely.",
    id_scenario: "Tiga minggu setelah memulai proyek lintas budaya yang sulit, kemajuan lambat. Tim sedang berjuang, hasilnya tidak jelas, dan Anda kurang tidur. Tidak ada yang mengawasi dengan seksama.",
    nl_scenario: "Drie weken na de start van een moeizaam intercultureel project gaat het langzaam. Het team worstelt, de uitkomsten zijn onduidelijk en je slaapt slecht. Niemand let nauwkeurig op.",
    en_question: "How consistently do you find the inner drive to keep going — not because someone is watching, but because the work matters?",
    id_question: "Seberapa konsisten Anda menemukan dorongan batin untuk terus maju — bukan karena ada yang mengawasi, tetapi karena pekerjaan itu penting?",
    nl_question: "Hoe consistent vind je de innerlijke drive om door te gaan — niet omdat iemand kijkt, maar omdat het werk ertoe doet?",
  },
  {
    id: "em",
    number: "04",
    color: "oklch(58% 0.15 15)",
    colorBg: "oklch(58% 0.15 15 / 0.08)",
    en_title: "Empathy",
    id_title: "Empati",
    nl_title: "Empathie",
    en_scenario: "A team member from the Philippines has been giving one-word answers in meetings for two weeks. You could assume she's just quiet. Or you could lean in — reading what's not being said.",
    id_scenario: "Seorang anggota tim dari Filipina telah memberikan jawaban satu kata dalam rapat selama dua minggu. Anda bisa berasumsi dia memang pendiam. Atau Anda bisa lebih peduli — membaca apa yang tidak dikatakan.",
    nl_scenario: "Een teamlid uit de Filipijnen geeft al twee weken eenwoordige antwoorden in vergaderingen. Je kunt aannemen dat ze gewoon stil is. Of je kunt nader treden — lezen wat er niet gezegd wordt.",
    en_question: "How often do you read what's beneath the surface — sensing what team members feel but aren't saying?",
    id_question: "Seberapa sering Anda membaca apa yang ada di balik permukaan — merasakan apa yang dirasakan anggota tim tetapi tidak dikatakan?",
    nl_question: "Hoe vaak lees je wat er onder de oppervlakte speelt — sensing wat teamleden voelen maar niet zeggen?",
  },
  {
    id: "ss",
    number: "05",
    color: "oklch(52% 0.14 310)",
    colorBg: "oklch(52% 0.14 310 / 0.08)",
    en_title: "Social Skills",
    id_title: "Keterampilan Sosial",
    nl_title: "Sociale vaardigheden",
    en_scenario: "Two team members from different cultural backgrounds are in a quiet but visible conflict — one is avoiding, one is confronting. The room has noticed. You are the leader in the room.",
    id_scenario: "Dua anggota tim dari latar belakang budaya berbeda sedang dalam konflik yang tenang namun terlihat — satu menghindari, satu menghadapi. Ruangan sudah merasakannya. Anda adalah pemimpin di ruangan itu.",
    nl_scenario: "Twee teamleden uit verschillende culturele achtergronden zitten in een stille maar zichtbare conflict — één vermijdt, één confronteert. De kamer heeft het gemerkt. Jij bent de leider in de ruimte.",
    en_question: "How confidently do you navigate tension, help people toward understanding, and keep relationships intact?",
    id_question: "Seberapa percaya diri Anda menavigasi ketegangan, membantu orang menuju pemahaman, dan menjaga hubungan tetap utuh?",
    nl_question: "Hoe zelfverzekerd navigeer je spanningen, help je mensen naar begrip en houd je relaties intact?",
  },
];

const SCORE_LABELS = {
  en: ["—", "Rarely", "Sometimes", "Often", "Very often", "Almost always"],
  id: ["—", "Jarang", "Kadang-kadang", "Sering", "Sangat sering", "Hampir selalu"],
  nl: ["—", "Zelden", "Soms", "Vaak", "Heel vaak", "Bijna altijd"],
};

const VERSES = {
  "prov-4-23": {
    en_ref: "Proverbs 4:23",
    id_ref: "Amsal 4:23",
    nl_ref: "Spreuken 4:23",
    en: "Above all else, guard your heart, for everything you do flows from it.",
    id: "Jagalah hatimu dengan segala kewaspadaan, karena dari situlah terpancar kehidupan.",
    nl: "Waak over je hart, het is de bron van je leven.",
  },
  "james-1-19": {
    en_ref: "James 1:19",
    id_ref: "Yakobus 1:19",
    nl_ref: "Jakobus 1:19",
    en: "Everyone should be quick to listen, slow to speak and slow to become angry.",
    id: "Setiap orang hendaklah cepat untuk mendengar, tetapi lambat untuk berkata-kata, dan juga lambat untuk marah.",
    nl: "Ieder mens moet zich haasten om te luisteren, maar traag zijn om te spreken, traag ook om toornig te worden.",
  },
};

type Props = { userPathway: string | null; isSaved: boolean };

export default function EmotionalIntelligenceClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [scores, setScores] = useState<Record<string, number | null>>({ sa: null, sr: null, mo: null, em: null, ss: null });
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const showSave = userPathway !== null;
  const allScored = Object.values(scores).every(v => v !== null);
  const scoredCount = Object.values(scores).filter(v => v !== null).length;
  const translation = lang === "id" ? "TB" : lang === "nl" ? "NBV" : "NIV";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("emotional-intelligence");
      setSaved(true);
    });
  }

  const lowestDomain = allScored
    ? DOMAINS.reduce((min, d) => (scores[d.id]! < scores[min.id]!) ? d : min, DOMAINS[0])
    : null;

  const highestDomain = allScored
    ? DOMAINS.reduce((max, d) => (scores[d.id]! > scores[max.id]!) ? d : max, DOMAINS[0])
    : null;

  return (
    <>
      <LangToggle />
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(2.5rem, 4vw, 4rem)", paddingBottom: "clamp(2.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← Content Library
          </Link>


          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "oklch(65% 0.15 45 / 0.15)", color: "oklch(82% 0.08 60)", padding: "0.25rem 0.75rem", display: "inline-flex", marginBottom: "1.25rem" }}>
            {t("Self-Assessment", "Penilaian Diri", "Zelfevaluatie")}
          </span>

          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development · Guide", "Pengembangan Pribadi · Panduan", "Persoonlijke Ontwikkeling · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, fontSize: "clamp(40px, 6vw, 72px)", color: "oklch(97% 0.005 80)", margin: "0 0 24px", lineHeight: 1.08 }}>
            {lang === "en" ? <>Emotional<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Intelligence.</span></> : lang === "id" ? <>Kecerdasan<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Emosional.</span></> : <>Emotionele<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Intelligentie.</span></>}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "oklch(72% 0.04 260)", maxWidth: "50ch", marginBottom: "2rem", lineHeight: 1.65 }}>
            {t(
              "Not a definition. A scan. Five real leadership moments — your honest response to each will reveal more than any textbook.",
              "Bukan definisi. Sebuah pemindaian. Lima momen kepemimpinan nyata — respons jujur Anda untuk setiap momen akan mengungkapkan lebih dari buku teks mana pun.",
              "Geen definitie. Een scan. Vijf echte leiderschapsmomenten — jouw eerlijke respons op elk ervan onthult meer dan welk leerboek dan ook.",
            )}
          </p>

          {scoredCount > 0 && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.08em" }}>
              {scoredCount}/5 {t("domains rated", "domain dinilai", "domeinen beoordeeld")}
              {allScored ? ` — ${t("your profile is ready", "profil Anda siap", "je profiel is klaar")} ↓` : ""}
            </p>
          )}

          {showSave && (
            <div style={{ marginTop: "1.5rem" }}>
              {saved ? (
                <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  ✓ {t("In your dashboard", "Di dashboard Anda", "In uw dashboard")}
                </Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.625rem 1.25rem", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── THE SCAN ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("The EQ Scan", "Pemindaian EQ", "De EQ-scan")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(22% 0.10 260)", marginBottom: "0.75rem" }}>
            {t("Five scenarios. One honest question each.", "Lima skenario. Satu pertanyaan jujur untuk masing-masing.", "Vijf scenario's. Één eerlijke vraag per stuk.")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.05 260)", marginBottom: "3rem", maxWidth: "52ch", lineHeight: 1.7 }}>
            {t(
              "Read each scenario. Then rate yourself honestly — not how you'd like to be, but how you actually are, most of the time.",
              "Baca setiap skenario. Kemudian nilai diri Anda dengan jujur — bukan bagaimana Anda ingin menjadi, tetapi bagaimana Anda sebenarnya, sebagian besar waktu.",
              "Lees elk scenario. Beoordeel jezelf dan eerlijk — niet hoe je wilt zijn, maar hoe je werkelijk bent, de meeste van de tijd.",
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px", background: "oklch(88% 0.008 80)" }}>
            {DOMAINS.map(domain => {
              const score = scores[domain.id];
              const title = lang === "en" ? domain.en_title : lang === "id" ? domain.id_title : domain.nl_title;
              const scenario = lang === "en" ? domain.en_scenario : lang === "id" ? domain.id_scenario : domain.nl_scenario;
              const question = lang === "en" ? domain.en_question : lang === "id" ? domain.id_question : domain.nl_question;
              const labels = SCORE_LABELS[lang];

              return (
                <div key={domain.id} style={{ background: score !== null ? domain.colorBg : "oklch(97% 0.005 80)", padding: "2rem clamp(1.5rem, 4vw, 2.5rem)" }}>
                  <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    <span style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "2.25rem", fontWeight: 700, color: domain.color, lineHeight: 1, flexShrink: 0, minWidth: "2.5rem" }}>{domain.number}</span>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1rem", color: "oklch(22% 0.10 260)", marginBottom: "0.625rem" }}>
                        {title}
                      </h3>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(42% 0.05 260)", marginBottom: "1rem" }}>
                        {scenario}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", fontWeight: 600, color: "oklch(32% 0.08 260)", marginBottom: "0.875rem", fontStyle: "italic" }}>
                        {question}
                      </p>
                    </div>
                  </div>

                  {/* Rating buttons */}
                  <div style={{ paddingLeft: "3.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setScores(s => ({ ...s, [domain.id]: n }))}
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.5rem 1rem",
                          border: "1px solid",
                          borderColor: score === n ? domain.color : "oklch(80% 0.008 80)",
                          background: score === n ? domain.color : "oklch(97% 0.005 80)",
                          color: score === n ? "oklch(97% 0.005 80)" : "oklch(50% 0.05 260)",
                          cursor: "pointer",
                          transition: "all 0.12s ease",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n} — {labels[n]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── YOUR PROFILE (shows once all scored) ── */}
      {allScored && (
        <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
          <div className="container-wide">
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
              {t("Your EQ Profile", "Profil EQ Anda", "Jouw EQ-profiel")}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(97% 0.005 80)", marginBottom: "2.5rem" }}>
              {t("Here is where you stand.", "Inilah posisi Anda.", "Hier sta je.")}
            </h2>

            {/* Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem", maxWidth: "560px" }}>
              {DOMAINS.map(domain => {
                const score = scores[domain.id] ?? 0;
                const title = lang === "en" ? domain.en_title : lang === "id" ? domain.id_title : domain.nl_title;
                return (
                  <div key={domain.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: "oklch(82% 0.03 80)" }}>
                        {domain.number} {title}
                      </span>
                      <span style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.3rem", fontWeight: 700, color: domain.color, lineHeight: 1 }}>
                        {score}/5
                      </span>
                    </div>
                    <div style={{ height: "8px", background: "oklch(35% 0.08 260)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(score / 5) * 100}%`, background: domain.color, borderRadius: "4px", transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interpretation */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "oklch(35% 0.08 260)" }}>
              {highestDomain && (
                <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: highestDomain.color, marginBottom: "0.625rem" }}>
                    {t("Your Strongest Domain", "Domain Terkuat Anda", "Je sterkste domein")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(90% 0.02 80)", marginBottom: "0.625rem" }}>
                    {lang === "en" ? highestDomain.en_title : lang === "id" ? highestDomain.id_title : highestDomain.nl_title}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(68% 0.04 260)", margin: 0 }}>
                    {t(
                      "This is a foundation you can build on. High scores here give you a stable base for developing the other domains.",
                      "Ini adalah fondasi yang dapat Anda bangun. Skor tinggi di sini memberi Anda basis yang stabil untuk mengembangkan domain lainnya.",
                      "Dit is een fundament om op verder te bouwen. Hoge scores hier geven je een stabiele basis om de andere domeinen te ontwikkelen.",
                    )}
                  </p>
                </div>
              )}
              {lowestDomain && (
                <div style={{ background: "oklch(28% 0.11 260)", padding: "2rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.625rem" }}>
                    {t("Your Growth Edge", "Area Pertumbuhan Anda", "Je groeipunt")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(90% 0.02 80)", marginBottom: "0.625rem" }}>
                    {lang === "en" ? lowestDomain.en_title : lang === "id" ? lowestDomain.id_title : lowestDomain.nl_title}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(68% 0.04 260)", margin: 0 }}>
                    {t(
                      "A lower score isn't failure — it is the most honest gift you can give yourself. Growth starts where self-deception ends.",
                      "Skor yang lebih rendah bukan kegagalan — itu adalah hadiah paling jujur yang bisa Anda berikan kepada diri sendiri. Pertumbuhan dimulai di mana penipuan diri berakhir.",
                      "Een lagere score is geen falen — het is het eerlijkste cadeau dat je jezelf kunt geven. Groei begint waar zelfbedrog eindigt.",
                    )}
                  </p>
                </div>
              )}
            </div>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(62% 0.04 260)", maxWidth: "58ch", marginTop: "2rem" }}>
              {t(
                "EQ is not fixed. It grows through attention and practice — especially in cross-cultural contexts where your automatic patterns get disrupted. What you do with this profile is the real work.",
                "EQ tidak tetap. Ia berkembang melalui perhatian dan latihan — terutama dalam konteks lintas budaya di mana pola otomatis Anda terganggu. Apa yang Anda lakukan dengan profil ini adalah pekerjaan yang sesungguhnya.",
                "EQ is niet vast. Het groeit door aandacht en oefening — vooral in interculturele contexten waar je automatische patronen worden verstoord. Wat je met dit profiel doet, is het echte werk.",
              )}
            </p>
          </div>
        </section>
      )}

      {/* ── BIBLICAL FOUNDATION ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("Biblical Foundation", "Landasan Alkitab", "Bijbelse basis")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(22% 0.10 260)", marginBottom: "1.25rem", maxWidth: "36ch" }}>
            {t("The heart as the source of leadership", "Hati sebagai sumber kepemimpinan", "Het hart als bron van leiderschap")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.05 260)", maxWidth: "62ch", marginBottom: "1rem" }}>
            {t(
              "Daniel Goleman popularised EQ in 1995. But the ancient wisdom literature of Scripture had already mapped the same terrain thousands of years earlier. Proverbs describes the heart as the command centre of human action — and calls the wise leader to guard it with everything they have.",
              "Daniel Goleman mempopulerkan EQ pada tahun 1995. Tetapi literatur kebijaksanaan kuno Kitab Suci telah memetakan wilayah yang sama ribuan tahun sebelumnya. Amsal menggambarkan hati sebagai pusat komando tindakan manusia — dan memanggil pemimpin yang bijak untuk menjaganya dengan segalanya.",
              "Daniel Goleman populariseerde EQ in 1995. Maar de oude wijsheidsliteratuur van de Schrift had hetzelfde terrein duizenden jaren eerder al in kaart gebracht. Spreuken beschrijft het hart als het commandocentrum van menselijk handelen — en roept de wijze leider op het te bewaken met alles wat hij heeft.",
            )}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.05 260)", maxWidth: "62ch", marginBottom: "2.5rem" }}>
            {t(
              "James takes it further: to be quick to listen, slow to speak, and slow to anger is not a personality type — it is a practised discipline. It is, in modern terms, exactly what self-regulation and empathy require. These are not soft skills. They are fruits of the Spirit in action inside a meeting room.",
              "Yakobus melangkah lebih jauh: cepat mendengar, lambat berbicara, dan lambat marah bukan tipe kepribadian — itu adalah disiplin yang dipraktikkan. Dalam istilah modern, itulah yang dibutuhkan regulasi diri dan empati. Ini bukan keterampilan lunak. Ini adalah buah Roh yang beraksi di dalam ruang rapat.",
              "Jakobus gaat verder: snel luisteren, traag spreken en traag tot toorn zijn is geen persoonlijkheidstype — het is een geoefende discipline. In moderne termen is dat precies wat zelfregulering en empathie vereisen. Dit zijn geen zachte vaardigheden. Het zijn vruchten van de Geest in actie in een vergaderruimte.",
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
            {(["prov-4-23", "james-1-19"] as const).map(key => {
              const v = VERSES[key];
              const ref = lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref;
              const text = lang === "en" ? v.en : lang === "id" ? v.id : v.nl;
              return (
                <div key={key} style={{ background: "oklch(97% 0.005 80)", padding: "2rem" }}>
                  <button onClick={() => setActiveVerse(key)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(65% 0.15 45)", fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "underline dotted", padding: 0, marginBottom: "0.875rem", display: "block" }}>
                    {ref} ({translation})
                  </button>
                  <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.15rem", fontStyle: "italic", color: "oklch(30% 0.10 260)", lineHeight: 1.65, margin: 0 }}>
                    "{text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ONE NEXT STEP ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 4rem)", background: "oklch(95% 0.008 80)" }}>
        <div className="container-wide" style={{ maxWidth: "640px" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("One Next Step", "Satu Langkah Berikutnya", "Één volgende stap")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(22% 0.10 260)", marginBottom: "1rem" }}>
            {allScored
              ? t("Based on your lowest domain:", "Berdasarkan domain terendah Anda:", "Gebaseerd op je laagste domein:")
              : t("Complete the scan to get your next step.", "Selesaikan pemindaian untuk mendapatkan langkah berikutnya.", "Voltooi de scan om je volgende stap te krijgen.")}
          </h2>

          {allScored && lowestDomain && (
            <div style={{ background: "oklch(22% 0.10 260)", padding: "2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: lowestDomain.color, marginBottom: "0.625rem" }}>
                {lang === "en" ? lowestDomain.en_title : lang === "id" ? lowestDomain.id_title : lowestDomain.nl_title}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(78% 0.03 80)", margin: 0 }}>
                {lowestDomain.id === "sa" && t(
                  "This week: after every significant conversation, take 60 seconds to notice what you felt during it. Not what happened — what you felt. Write it down. That's where self-awareness grows.",
                  "Minggu ini: setelah setiap percakapan penting, luangkan 60 detik untuk memperhatikan apa yang Anda rasakan selama percakapan itu. Bukan apa yang terjadi — apa yang Anda rasakan. Tuliskan. Di situlah kesadaran diri berkembang.",
                  "Deze week: neem na elk belangrijk gesprek 60 seconden om op te merken wat je ertijdens voelde. Niet wat er gebeurde — wat je voelde. Schrijf het op. Daar groeit zelfbewustzijn.",
                )}
                {lowestDomain.id === "sr" && t(
                  "This week: identify one recurring trigger that makes you react before you think. Name it. The next time it happens, say the trigger's name in your mind before you speak. That gap is self-regulation.",
                  "Minggu ini: identifikasi satu pemicu berulang yang membuat Anda bereaksi sebelum berpikir. Namai. Lain kali itu terjadi, ucapkan nama pemicunya dalam pikiran sebelum berbicara. Jeda itulah regulasi diri.",
                  "Deze week: identificeer één terugkerende trigger die je doet reageren voor je denkt. Geef het een naam. De volgende keer dat het gebeurt, zeg de naam van de trigger in je gedachten voor je spreekt. Dat is zelfregulering.",
                )}
                {lowestDomain.id === "mo" && t(
                  "This week: write down the one sentence that captures WHY this leadership work matters to you — beyond titles, salaries, or expectations. Read it each morning. That sentence is your motivational anchor.",
                  "Minggu ini: tuliskan satu kalimat yang menangkap MENGAPA pekerjaan kepemimpinan ini penting bagi Anda — melampaui jabatan, gaji, atau harapan. Baca setiap pagi. Kalimat itu adalah jangkar motivasi Anda.",
                  "Deze week: schrijf de ene zin op die vastlegt WAAROM dit leiderschapswerk voor jou van belang is — voorbij titels, salarissen of verwachtingen. Lees het elke ochtend. Die zin is je motivatie-anker.",
                )}
                {lowestDomain.id === "em" && t(
                  "This week: in one meeting, spend the first ten minutes focused entirely on reading the room — not your agenda. Notice who seems disengaged, who hasn't spoken, who looks uncertain. Ask one of them a question.",
                  "Minggu ini: dalam satu rapat, habiskan sepuluh menit pertama sepenuhnya fokus pada membaca suasana ruangan — bukan agenda Anda. Perhatikan siapa yang tampak tidak terlibat, siapa yang belum berbicara, siapa yang terlihat tidak yakin. Ajukan pertanyaan kepada salah satu dari mereka.",
                  "Deze week: besteed in één vergadering de eerste tien minuten volledig aan het lezen van de kamer — niet je agenda. Merk op wie er niet bij betrokken lijkt, wie nog niet heeft gesproken, wie er onzeker uitziet. Stel een van hen een vraag.",
                )}
                {lowestDomain.id === "ss" && t(
                  "This week: find a low-stakes relational tension in your team — something small but present. Step in and address it directly. Don't wait for the right moment. The practice of small moves builds the muscle for larger ones.",
                  "Minggu ini: temukan ketegangan relasional berisiko rendah dalam tim Anda — sesuatu yang kecil tetapi hadir. Turun tangan dan atasi secara langsung. Jangan menunggu momen yang tepat. Latihan gerakan kecil membangun kemampuan untuk yang lebih besar.",
                  "Deze week: vind een laagdrempelige relationele spanning in je team — iets kleins maar aanwezig. Grijp in en pak het direct aan. Wacht niet op het juiste moment. De oefening van kleine bewegingen bouwt de spier voor grotere.",
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de Bibliotheek")}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(97% 0.005 80)", marginBottom: "1rem" }}>
              {t("Part of the full content library.", "Bagian dari perpustakaan konten lengkap.", "Onderdeel van de volledige contentbibliotheek.")}
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!userPathway ? (
                <Link href="/signup" className="btn-primary">{t("Join the Community →", "Bergabung →", "Word lid →")}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →", "Naar Dashboard →")}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan", "Verken de Bibliotheek")}</Link>
            </div>
          </div>
          <div style={{ background: "oklch(28% 0.11 260)", padding: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(80% 0.04 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {t(
                "\"EQ is not a personality trait. It is a set of learned skills — and cross-cultural friction is the fastest teacher.\"",
                "\"EQ bukan sifat kepribadian. Ini adalah serangkaian keterampilan yang dipelajari — dan gesekan lintas budaya adalah guru tercepat.\"",
                "\"EQ is geen persoonlijkheidstrek. Het is een reeks aangeleerde vaardigheden — en interculturele wrijving is de snelste leraar.\"",
              )}
            </p>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crispy Development</span>
          </div>
        </div>
      </section>

      {/* ── VERSE POPUP ── */}
      {activeVerse && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1.5rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "oklch(97% 0.005 80)", borderRadius: "12px", padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)", maxWidth: "520px", width: "100%" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(22% 0.10 260)", lineHeight: 1.65, marginBottom: "1rem" }}>
              "{lang === "en" ? VERSES[activeVerse as keyof typeof VERSES].en : lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id : VERSES[activeVerse as keyof typeof VERSES].nl}"
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
              — {lang === "en" ? VERSES[activeVerse as keyof typeof VERSES].en_ref : lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id_ref : VERSES[activeVerse as keyof typeof VERSES].nl_ref} ({translation})
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, background: "oklch(22% 0.10 260)", color: "oklch(97% 0.005 80)", border: "none", padding: "0.625rem 1.5rem", cursor: "pointer", borderRadius: "4px" }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
