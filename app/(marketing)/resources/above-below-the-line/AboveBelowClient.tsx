"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";

const t = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const ABOVE = [
  {
    word: "OWNERSHIP",
    wordId: "KEPEMILIKAN",
    wordNl: "EIGENAARSCHAP",
    descEn: "You take full ownership of your situation, choices, and outcomes — not because you caused everything, but because you have the power to respond.",
    descId: "Anda mengambil kepemilikan penuh atas situasi, pilihan, dan hasil Anda — bukan karena Anda menyebabkan segalanya, tetapi karena Anda memiliki kekuatan untuk merespons.",
    descNl: "U neemt volledige verantwoordelijkheid voor uw situatie, keuzes en uitkomsten — niet omdat u alles veroorzaakte, maar omdat u de kracht hebt om te reageren.",
  },
  {
    word: "ACCOUNTABLE",
    wordId: "BERTANGGUNG GUGAT",
    wordNl: "AANSPREEKBAAR",
    descEn: "You hold yourself to your commitments and standards. You follow through on what you said you would do, and own it when you don't.",
    descId: "Anda memegang komitmen dan standar Anda sendiri. Anda menindaklanjuti apa yang Anda katakan akan dilakukan, dan mengakuinya ketika Anda tidak melakukannya.",
    descNl: "U houdt uzelf aan uw verplichtingen en normen. U doet wat u zei te zullen doen, en erkent het wanneer dat niet het geval is.",
  },
  {
    word: "RESPONSIBLE",
    wordId: "BERTANGGUNG JAWAB",
    wordNl: "VERANTWOORDELIJK",
    descEn: "You recognize that your role, your actions, and your responses are yours to steward. You don't outsource your obligations to others or circumstances.",
    descId: "Anda menyadari bahwa peran, tindakan, dan respons Anda adalah milik Anda untuk dikelola. Anda tidak mengalihdayakan kewajiban Anda kepada orang lain atau keadaan.",
    descNl: "U erkent dat uw rol, uw acties en uw reacties van u zijn om te beheren. U geeft uw verplichtingen niet uit handen aan anderen of omstandigheden.",
  },
];

const BELOW = [
  {
    word: "BLAME",
    wordId: "MENYALAHKAN",
    wordNl: "BESCHULDIGING",
    descEn: "You focus on who caused the problem rather than what can be done about it. Blame keeps you stuck in the past and robs you of agency.",
    descId: "Anda fokus pada siapa yang menyebabkan masalah daripada apa yang bisa dilakukan. Menyalahkan membuat Anda terjebak di masa lalu dan merampas kemandirian Anda.",
    descNl: "U richt zich op wie het probleem veroorzaakte in plaats van wat eraan gedaan kan worden. Beschuldigen houdt u gevangen in het verleden en ontneemt u uw handelingsvrijheid.",
  },
  {
    word: "EXCUSE",
    wordId: "MENCARI ALASAN",
    wordNl: "EXCUUS",
    descEn: "You justify inaction or failure with reasons outside your control. Excuses feel valid in the moment but become patterns that limit growth.",
    descId: "Anda membenarkan ketidakaktifan atau kegagalan dengan alasan di luar kendali Anda. Alasan terasa valid pada saat itu tetapi menjadi pola yang membatasi pertumbuhan.",
    descNl: "U rechtvaardigt inactiviteit of mislukking met redenen buiten uw controle. Excuses voelen op het moment geldig, maar worden patronen die groei beperken.",
  },
  {
    word: "DENIAL",
    wordId: "PENYANGKALAN",
    wordNl: "ONTKENNING",
    descEn: "You refuse to acknowledge the reality of a problem or your part in it. Denial is the deepest below-the-line behavior — it blocks all learning and change.",
    descId: "Anda menolak untuk mengakui realitas suatu masalah atau peran Anda di dalamnya. Penyangkalan adalah perilaku di bawah garis yang paling dalam — itu menghalangi semua pembelajaran dan perubahan.",
    descNl: "U weigert de realiteit van een probleem of uw aandeel daarin te erkennen. Ontkenning is het diepste onder-de-lijn-gedrag — het blokkeert alle leren en verandering.",
  },
];

const ABOVE_PHRASES = ["When…", "Choice", "I am going to…", "I will", "I chose to", "I chose not to", "Make things happen", "Why not?", "TGIM (Thank God It's Monday)", "Day one"];
const ABOVE_PHRASES_ID = ["Ketika…", "Pilihan", "Saya akan…", "Saya mau", "Saya memilih untuk", "Saya memilih untuk tidak", "Jadikan hal itu terjadi", "Kenapa tidak?", "TGIM (Terima kasih Tuhan hari Senin)", "Hari pertama"];
const ABOVE_PHRASES_NL = ["Wanneer…", "Keuze", "Ik ga…", "Ik wil", "Ik koos voor", "Ik koos ervoor niet te", "Dingen laten gebeuren", "Waarom niet?", "TGIM (Dank God, het is maandag)", "Dag één"];

const BELOW_PHRASES = ["If…", "Had no choice", "I hope…", "Maybe…", "I try…", "It might…", "I think…", "I need to…", "Hopefully", "Every intention", "I should", "I would", "I could", "I must", "WHY?", "TGIF", "Waiting for other people", "One day"];
const BELOW_PHRASES_ID = ["Jika…", "Tidak punya pilihan", "Saya harap…", "Mungkin…", "Saya mencoba…", "Mungkin saja…", "Saya pikir…", "Saya perlu…", "Semoga", "Setiap niat", "Saya seharusnya", "Saya akan", "Saya bisa", "Saya harus", "KENAPA?", "TGIF", "Menunggu orang lain", "Suatu hari nanti"];
const BELOW_PHRASES_NL = ["Als…", "Had geen keuze", "Ik hoop…", "Misschien…", "Ik probeer…", "Het zou kunnen…", "Ik denk…", "Ik moet…", "Hopelijk", "Altijd de intentie", "Ik zou moeten", "Ik zou", "Ik kon", "Ik moet", "WAAROM?", "TGIF", "Wachten op anderen", "Op een dag"];

function getAbovePhrases(lang: Lang) {
  return lang === "en" ? ABOVE_PHRASES : lang === "id" ? ABOVE_PHRASES_ID : ABOVE_PHRASES_NL;
}
function getBelowPhrases(lang: Lang) {
  return lang === "en" ? BELOW_PHRASES : lang === "id" ? BELOW_PHRASES_ID : BELOW_PHRASES_NL;
}

export default function AboveBelowClient({
  userPathway,
  isSaved,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [activeView, setActiveView] = useState<"above" | "below" | "compare">("compare");
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("above-below-the-line");
      setSaved(true);
    });
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <Link href="/resources" style={{ fontSize: 13, color: "oklch(65% 0.08 260)", textDecoration: "none", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>← {t("All Resources", "Semua Sumber Daya", "Alle Bronnen", lang)}</Link>
            <div style={{ display: "flex", gap: 8 }}>
              {(["en", "id", "nl"] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: "5px 14px", borderRadius: 4, border: "1px solid", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", background: lang === l ? "oklch(65% 0.15 45)" : "transparent", color: lang === l ? "oklch(15% 0.05 45)" : "oklch(65% 0.06 260)", borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(42% 0.08 260)" }}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>Guide</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(72% 0.05 260)", background: "oklch(55% 0.05 260 / 0.20)", padding: "4px 10px", borderRadius: 4 }}>EN · ID · NL</span>
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px", lineHeight: 1.1 }}>{t("Above & Below the Line", "Di Atas & Di Bawah Garis", "Boven & Onder de Lijn", lang)}</h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>{t(
            "Are you leading as a Victor or a Victim? This framework helps you recognize reactive patterns — blame, excuse, denial — and choose ownership, accountability, and responsibility instead.",
            "Apakah Anda memimpin sebagai Victor atau Korban? Kerangka ini membantu Anda mengenali pola reaktif — menyalahkan, mencari alasan, penyangkalan — dan memilih kepemilikan, tanggung gugat, dan tanggung jawab.",
            "Leidt u als Overwinnaar of als Slachtoffer? Dit kader helpt u reactieve patronen te herkennen — beschuldiging, excuus, ontkenning — en te kiezen voor eigenaarschap, aanspreekbaarheid en verantwoordelijkheid.",
            lang
          )}</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "transparent", color: "oklch(85% 0.04 260)", padding: "13px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: "pointer" }}>{isPending ? t("Saving…", "Menyimpan…", "Opslaan…", lang) : t("Add to Dashboard", "Tambah ke Dasbor", "Toevoegen aan Dashboard", lang)}</button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>✓ {t("Saved to Dashboard", "Disimpan ke Dasbor", "Opgeslagen in Dashboard", lang)}</span>
            )}
          </div>
        </div>
      </section>

      {/* MAIN FRAMEWORK */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>{t("The Line", "Garis Tersebut", "De Lijn", lang)}</h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 32, lineHeight: 1.65 }}>{t(
            "There is a line. Every response you give to a situation is either above it or below it.",
            "Ada sebuah garis. Setiap respons yang Anda berikan terhadap suatu situasi berada di atas atau di bawahnya.",
            "Er is een lijn. Elke reactie die u geeft op een situatie bevindt zich er boven of eronder.",
            lang
          )}</p>

          {/* View toggle */}
          <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
            {(["compare", "above", "below"] as const).map(view => (
              <button key={view} onClick={() => setActiveView(view)} style={{ padding: "10px 20px", borderRadius: 6, border: `2px solid ${activeView === view ? (view === "above" ? "oklch(46% 0.16 145)" : view === "below" ? "oklch(48% 0.18 25)" : "oklch(42% 0.14 260)") : "oklch(88% 0.008 260)"}`, background: activeView === view ? (view === "above" ? "oklch(46% 0.16 145)" : view === "below" ? "oklch(48% 0.18 25)" : "oklch(42% 0.14 260)") : "white", color: activeView === view ? "white" : "oklch(30% 0.06 260)", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                {view === "compare"
                  ? t("Compare Both", "Bandingkan Keduanya", "Vergelijk Beide", lang)
                  : view === "above"
                  ? `↑ ${t("Above the Line", "Di Atas Garis", "Boven de Lijn", lang)}`
                  : `↓ ${t("Below the Line", "Di Bawah Garis", "Onder de Lijn", lang)}`}
              </button>
            ))}
          </div>

          {/* Compare view */}
          {activeView === "compare" && (
            <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 20px oklch(20% 0.06 260 / 0.10)" }}>
              {/* Above */}
              <div style={{ background: "oklch(46% 0.16 145 / 0.08)", padding: "36px 32px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", marginBottom: 8 }}>↑ {t("ABOVE THE LINE", "DI ATAS GARIS", "BOVEN DE LIJN", lang)}</div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(30% 0.10 145)", marginBottom: 20 }}>{t("Victor · Pro-Active", "Victor · Pro-Aktif", "Overwinnaar · Pro-Actief", lang)}</div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {ABOVE.map(item => (
                    <div key={item.word}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "oklch(34% 0.12 145)", letterSpacing: "0.04em" }}>{t(item.word, item.wordId, item.wordNl, lang)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {getAbovePhrases(lang).map(phrase => (
                    <span key={phrase} style={{ background: "oklch(46% 0.16 145 / 0.14)", color: "oklch(34% 0.12 145)", padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{phrase}</span>
                  ))}
                </div>
              </div>

              {/* The Line divider */}
              <div style={{ background: "oklch(22% 0.10 260)", padding: "14px 32px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1, height: 1, background: "oklch(42% 0.08 260)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(65% 0.08 260)", whiteSpace: "nowrap" }}>{t("— THE LINE —", "— GARIS —", "— DE LIJN —", lang)}</span>
                <div style={{ flex: 1, height: 1, background: "oklch(42% 0.08 260)" }} />
              </div>

              {/* Below */}
              <div style={{ background: "oklch(48% 0.18 25 / 0.08)", padding: "36px 32px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 8 }}>↓ {t("BELOW THE LINE", "DI BAWAH GARIS", "ONDER DE LIJN", lang)}</div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(30% 0.12 25)", marginBottom: 20 }}>{t("Victim · Re-Active", "Korban · Re-Aktif", "Slachtoffer · Re-Actief", lang)}</div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {BELOW.map(item => (
                    <div key={item.word}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "oklch(38% 0.14 25)", letterSpacing: "0.04em" }}>{t(item.word, item.wordId, item.wordNl, lang)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {getBelowPhrases(lang).map(phrase => (
                    <span key={phrase} style={{ background: "oklch(48% 0.18 25 / 0.10)", color: "oklch(38% 0.14 25)", padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{phrase}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Above detail */}
          {activeView === "above" && (
            <div style={{ background: "oklch(46% 0.16 145 / 0.08)", borderRadius: 12, padding: "40px", border: "1px solid oklch(46% 0.16 145 / 0.25)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", marginBottom: 8 }}>{t("ABOVE THE LINE", "DI ATAS GARIS", "BOVEN DE LIJN", lang)}</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "oklch(30% 0.10 145)", marginBottom: 32 }}>{t("Victor · Pro-Active Mindset", "Victor · Pola Pikir Pro-Aktif", "Overwinnaar · Pro-Actieve Mindset", lang)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
                {ABOVE.map(item => (
                  <div key={item.word} style={{ background: "white", borderRadius: 8, padding: "20px 24px" }}>
                    <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "oklch(34% 0.12 145)", margin: "0 0 8px", letterSpacing: "0.04em" }}>{t(item.word, item.wordId, item.wordNl, lang)}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.descEn, item.descId, item.descNl, lang)}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", borderRadius: 8, padding: "20px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", marginBottom: 14 }}>{t("Language Cues — Above the Line", "Isyarat Bahasa — Di Atas Garis", "Taalcues — Boven de Lijn", lang)}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {getAbovePhrases(lang).map(phrase => (
                    <span key={phrase} style={{ background: "oklch(46% 0.16 145 / 0.10)", color: "oklch(34% 0.12 145)", padding: "4px 10px", borderRadius: 4, fontSize: 13, fontWeight: 600 }}>{phrase}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Below detail */}
          {activeView === "below" && (
            <div style={{ background: "oklch(48% 0.18 25 / 0.08)", borderRadius: 12, padding: "40px", border: "1px solid oklch(48% 0.18 25 / 0.25)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 8 }}>{t("BELOW THE LINE", "DI BAWAH GARIS", "ONDER DE LIJN", lang)}</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "oklch(30% 0.12 25)", marginBottom: 32 }}>{t("Victim · Re-Active Patterns", "Korban · Pola Re-Aktif", "Slachtoffer · Re-Actieve Patronen", lang)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
                {BELOW.map(item => (
                  <div key={item.word} style={{ background: "white", borderRadius: 8, padding: "20px 24px" }}>
                    <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "oklch(38% 0.14 25)", margin: "0 0 8px", letterSpacing: "0.04em" }}>{t(item.word, item.wordId, item.wordNl, lang)}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(35% 0.06 260)", margin: 0 }}>{t(item.descEn, item.descId, item.descNl, lang)}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", borderRadius: 8, padding: "20px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", marginBottom: 14 }}>{t("Language Cues — Below the Line", "Isyarat Bahasa — Di Bawah Garis", "Taalcues — Onder de Lijn", lang)}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {getBelowPhrases(lang).map(phrase => (
                    <span key={phrase} style={{ background: "oklch(48% 0.18 25 / 0.10)", color: "oklch(38% 0.14 25)", padding: "4px 10px", borderRadius: 4, fontSize: 13, fontWeight: 600 }}>{phrase}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* REFLECTION */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>{t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen", lang)}</h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>{t(
          "Use these to process your own leadership patterns — alone or with a coach.",
          "Gunakan ini untuk memproses pola kepemimpinan Anda sendiri — sendiri atau bersama pelatih.",
          "Gebruik deze vragen om uw eigen leiderschapspatronen te verwerken — alleen of met een coach.",
          lang
        )}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            {
              color: "oklch(46% 0.16 145)",
              qEn: "Think of a recent situation. What was your first instinct — Victor or Victim? What drove that response?",
              qId: "Pikirkan situasi terkini. Apa naluri pertama Anda — Victor atau Korban? Apa yang mendorong respons itu?",
              qNl: "Denk aan een recente situatie. Wat was uw eerste instinct — Overwinnaar of Slachtoffer? Wat dreef die reactie?",
            },
            {
              color: "oklch(42% 0.14 260)",
              qEn: "Where in your leadership do you notice below-the-line patterns most often? What triggers them?",
              qId: "Di mana dalam kepemimpinan Anda Anda paling sering memperhatikan pola di bawah garis? Apa yang memicunya?",
              qNl: "Waar in uw leiderschap ziet u het vaakst onder-de-lijn-patronen? Wat triggert die?",
            },
            {
              color: "oklch(48% 0.18 25)",
              qEn: "What would it look like to choose ownership in the situation you're currently facing? What one above-the-line action could you take today?",
              qId: "Seperti apa memilih kepemilikan dalam situasi yang Anda hadapi saat ini? Satu tindakan di atas garis apa yang bisa Anda ambil hari ini?",
              qNl: "Hoe zou eigenaarschap kiezen eruitzien in de situatie waarmee u nu te maken heeft? Welke ene boven-de-lijn-actie kunt u vandaag ondernemen?",
            },
          ].map((q, i) => (
            <div key={i} style={{ background: "white", borderRadius: 10, padding: "28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: q.color, display: "block", marginBottom: 12, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(30% 0.06 260)", margin: 0, fontStyle: "italic" }}>"{t(q.qEn, q.qId, q.qNl, lang)}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>{t("Choose to Lead Above the Line", "Pilih untuk Memimpin Di Atas Garis", "Kies om Boven de Lijn te Leiden", lang)}</h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>{t("Browse All Resources", "Jelajahi Semua Sumber Daya", "Bekijk Alle Bronnen", lang)}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
