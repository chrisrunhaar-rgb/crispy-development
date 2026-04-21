"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const biasCategories = [
  { number: "1", en_title: "Attribution Biases", id_title: "Bias Atribusi", nl_title: "Attributiebiases", en_example: "Fundamental Attribution Error: attributing others' poor behaviour to their character while attributing your own to circumstances. In cross-cultural settings, this means assuming a team member is lazy when they are actually navigating a cultural expectation you don't understand.", id_example: "Kesalahan Atribusi Fundamental: mengatribusikan perilaku buruk orang lain pada karakter mereka sementara mengatribusikan milik Anda sendiri pada keadaan. Dalam konteks lintas budaya, ini berarti mengasumsikan anggota tim malas ketika mereka sebenarnya menavigasi harapan budaya yang tidak Anda pahami.", nl_example: "Fundamentele Attributiefout: het gedrag van anderen toeschrijven aan hun karakter terwijl je het jouwe aan omstandigheden toeschrijft. In interculturele omgevingen betekent dit aannemen dat een teamlid lui is terwijl ze eigenlijk navigeren door een culturele verwachting die jij niet begrijpt." },
  { number: "2", en_title: "Confirmation Bias", id_title: "Bias Konfirmasi", nl_title: "Bevestigingsbias", en_example: "Seeking and favouring information that confirms your existing beliefs. In cross-cultural leadership, this creates a dangerous feedback loop: you believe local leaders are not ready for authority, you only notice evidence that supports this, and you never actually give them the chance that would disprove it.", id_example: "Mencari dan mendukung informasi yang mengkonfirmasi keyakinan Anda yang ada. Dalam kepemimpinan lintas budaya, ini menciptakan lingkaran umpan balik yang berbahaya: Anda percaya pemimpin lokal tidak siap untuk otoritas, Anda hanya memperhatikan bukti yang mendukung ini.", nl_example: "Informatie zoeken en begunstigen die je bestaande overtuigingen bevestigt. In intercultureel leiderschap creëert dit een gevaarlijke feedbacklus: je gelooft dat lokale leiders niet klaar zijn voor autoriteit, je merkt alleen bewijs op dat dit ondersteunt." },
  { number: "3", en_title: "In-Group / Out-Group Bias", id_title: "Bias Dalam Kelompok / Luar Kelompok", nl_title: "In-groep / Uit-groep Bias", en_example: "Favouring people who are culturally similar to you — in hiring, delegation, and trust. This bias operates below conscious awareness and is one of the most damaging in multicultural teams. Leaders consistently give more opportunities, grace, and benefit of the doubt to people who look, speak, and think like them.", id_example: "Menyukai orang yang secara budaya mirip dengan Anda — dalam perekrutan, delegasi, dan kepercayaan. Bias ini beroperasi di bawah kesadaran dan merupakan salah satu yang paling merusak dalam tim multikultural.", nl_example: "De voorkeur geven aan mensen die cultureel op jou lijken — bij aanwerving, delegatie en vertrouwen. Deze bias werkt onder bewust bewustzijn en is een van de meest schadelijke in multiculturele teams." },
  { number: "4", en_title: "Availability Bias", id_title: "Bias Ketersediaan", nl_title: "Beschikbaarheidsbias", en_example: "Overweighting information that is easily recalled. The last thing that went wrong becomes disproportionately influential. In cross-cultural leadership: one bad experience with a team from a particular culture colours all future interactions with people from that background.", id_example: "Memberi bobot berlebihan pada informasi yang mudah diingat. Hal terakhir yang berjalan salah menjadi sangat berpengaruh. Dalam kepemimpinan lintas budaya: satu pengalaman buruk dengan tim dari budaya tertentu mewarnai semua interaksi masa depan dengan orang-orang dari latar belakang itu.", nl_example: "Te veel gewicht geven aan gemakkelijk herinnerde informatie. Het laatste dat misging wordt onevenredig invloedrijk. In intercultureel leiderschap: één slechte ervaring met een team uit een bepaalde cultuur kleurt alle toekomstige interacties met mensen uit die achtergrond." },
  { number: "5", en_title: "Anchoring Bias", id_title: "Bias Penjangkaran", nl_title: "Verankerbias", en_example: "Relying too heavily on the first piece of information encountered. If your first impression of a culture is negative (perhaps from a difficult entry experience), that anchor shapes all subsequent interpretations even when circumstances improve.", id_example: "Terlalu mengandalkan informasi pertama yang ditemui. Jika kesan pertama Anda tentang budaya negatif (mungkin dari pengalaman masuk yang sulit), jangkar itu membentuk semua interpretasi selanjutnya bahkan ketika keadaan membaik.", nl_example: "Te veel vertrouwen op het eerste stuk informatie dat wordt tegengekomen. Als je eerste indruk van een cultuur negatief is (misschien door een moeilijke beginervaring), vormt dat anker alle volgende interpretaties zelfs wanneer omstandigheden verbeteren." },
  { number: "6", en_title: "Halo / Horn Effect", id_title: "Efek Halo / Tanduk", nl_title: "Halo / Hoorns Effect", en_example: "Letting one positive quality (halo) or one negative quality (horns) define your entire perception of a person. Common in cross-cultural settings when a person's language proficiency — or accent — colours your assessment of their intelligence, leadership capacity, or trustworthiness.", id_example: "Membiarkan satu kualitas positif (halo) atau satu kualitas negatif (tanduk) mendefinisikan seluruh persepsi Anda tentang seseorang. Umum dalam konteks lintas budaya ketika kemampuan bahasa seseorang mewarnai penilaian Anda.", nl_example: "Een positieve kwaliteit (halo) of negatieve kwaliteit (hoorns) je volledige perceptie van een persoon laten bepalen. Gangbaar in interculturele omgevingen wanneer de taalvaardigheid van een persoon jouw beoordeling van hun intelligentie kleurt." },
];

const counterStrategies = [
  { number: "1", en: "Name your biases before high-stakes decisions — literally write down: 'What bias might be shaping my thinking here?'", id: "Sebutkan bias Anda sebelum keputusan berisiko tinggi — secara harfiah tuliskan: 'Bias apa yang mungkin membentuk pemikiran saya di sini?'", nl: "Benoem je biases voor beslissingen met hoge inzet — schrijf letterlijk op: 'Welke bias kan mijn denken hier beïnvloeden?'" },
  { number: "2", en: "Build cross-cultural accountability — have someone from a different background review significant decisions with you.", id: "Bangun akuntabilitas lintas budaya — minta seseorang dari latar belakang yang berbeda untuk meninjau keputusan penting bersama Anda.", nl: "Bouw interculturele verantwoording op — laat iemand uit een andere achtergrond significante beslissingen met je beoordelen." },
  { number: "3", en: "Delay judgment — resist the urge to categorise quickly. The longer you suspend interpretation, the more accurate it becomes.", id: "Tunda penilaian — tahan dorongan untuk mengkategorikan dengan cepat. Semakin lama Anda menangguhkan interpretasi, semakin akurat itu.", nl: "Stel oordeel uit — weersta de drang om snel te categoriseren. Hoe langer je interpretatie uitstelt, hoe accurater het wordt." },
  { number: "4", en: "Actively seek disconfirming information — ask: 'What would have to be true for me to be wrong about this?'", id: "Secara aktif cari informasi yang menyangkal — tanyakan: 'Apa yang harus benar agar saya salah tentang ini?'", nl: "Zoek actief naar weerleggende informatie — vraag: 'Wat zou waar moeten zijn om me in dit geval fout te laten zijn?'" },
  { number: "5", en: "Practice cultural humility as a spiritual discipline — remember that you see through a glass darkly (1 Corinthians 13:12). Your perception is partial.", id: "Praktikkan kerendahan hati budaya sebagai disiplin rohani — ingat bahwa Anda melihat melalui kaca yang gelap (1 Korintus 13:12). Persepsi Anda hanya sebagian.", nl: "Beoefen culturele bescheidenheid als geestelijke discipline — onthoud dat je door een glas onduidelijk ziet (1 Korintiërs 13:12). Je perceptie is gedeeltelijk." },
];

const reflectionQuestions = [
  { roman: "I", en: "Which of the six bias categories resonates most with patterns you notice in yourself?", id: "Kategori bias mana dari enam yang paling beresonansi dengan pola yang Anda perhatikan dalam diri Anda?", nl: "Welke van de zes biascategorieën resoneert het meest met patronen die je in jezelf opmerkt?" },
  { roman: "II", en: "Have you ever made a significant judgment about a team member that you later discovered was culturally misread?", id: "Pernahkah Anda membuat penilaian signifikan tentang anggota tim yang kemudian Anda temukan disalahbaca secara budaya?", nl: "Heb je ooit een significant oordeel geveld over een teamlid waarvan je later ontdekte dat het cultureel verkeerd was gelezen?" },
  { roman: "III", en: "Who in your life gives you the most honest feedback on your blind spots? Is that enough?", id: "Siapa dalam hidup Anda yang memberi Anda umpan balik paling jujur tentang titik buta Anda? Apakah itu cukup?", nl: "Wie in je leven geeft je de eerlijkste feedback op je blinde vlekken? Is dat genoeg?" },
  { roman: "IV", en: "How might your own cultural background be a source of systematic bias that you have never questioned?", id: "Bagaimana latar belakang budaya Anda sendiri bisa menjadi sumber bias sistematis yang belum pernah Anda pertanyakan?", nl: "Hoe kan jouw eigen culturele achtergrond een bron van systematische bias zijn die je nooit hebt bevraagd?" },
  { roman: "V", en: "What would humble, learner-posture leadership look like in your specific cultural and ministry context?", id: "Seperti apa kepemimpinan yang rendah hati dan berpostur pelajar dalam konteks budaya dan pelayanan spesifik Anda?", nl: "Hoe zou bescheiden, lerenden-houding-leiderschap eruitzien in jouw specifieke culturele en bedieningscontext?" },
  { roman: "VI", en: "How does the biblical imperative to 'think of others as more significant than yourselves' (Phil 2:3) serve as an antidote to bias?", id: "Bagaimana imperatif alkitabiah untuk 'menganggap orang lain lebih penting dari diri Anda sendiri' (Fil 2:3) berfungsi sebagai penawar bias?", nl: "Hoe dient het bijbelse gebod om 'anderen belangrijker te achten dan uzelf' (Fil 2:3) als tegengif voor bias?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function CognitiveBiasesClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("cognitive-biases");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Self-Leadership", "Kepemimpinan Diri", "Zelfleiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Cognitive Biases in Leadership", "Bias Kognitif dalam Kepemimpinan", "Cognitieve Biases in Leiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"We think we see the world as it is. We actually see the world as we are." — Anaïs Nin',
            '"Kita pikir kita melihat dunia sebagaimana adanya. Kita sebenarnya melihat dunia sebagaimana kita adanya." — Anaïs Nin',
            '"We denken dat we de wereld zien zoals ze is. We zien de wereld eigenlijk zoals wij zijn." — Anaïs Nin'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", borderRadius: 6, border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Cognitive biases are systematic errors in thinking that affect every human being — not just the uninformed or the unintelligent. They are shortcuts the brain takes to process the overwhelming volume of information it receives each day. In ordinary life, many of them are helpful. In leadership — and especially cross-cultural leadership — they can be devastating.",
            "Bias kognitif adalah kesalahan sistematis dalam berpikir yang mempengaruhi setiap manusia — bukan hanya yang tidak terinformasi atau tidak cerdas. Mereka adalah jalan pintas yang diambil otak untuk memproses volume informasi yang luar biasa yang diterimanya setiap hari.",
            "Cognitieve biases zijn systematische denkfouten die elke mens treffen — niet alleen de ongeïnformeerde of onintelligente. Het zijn snelkoppelingen die het brein neemt om het overweldigende volume informatie te verwerken dat het elke dag ontvangt."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Cross-cultural leaders are especially vulnerable because they are operating in an environment where their brain's pattern-recognition system is working with incomplete data. Cultural norms they take for granted don't apply; behaviours that seem strange may be entirely rational; silence may mean something other than what they assume.",
            "Pemimpin lintas budaya sangat rentan karena mereka beroperasi di lingkungan di mana sistem pengenalan pola otak mereka bekerja dengan data yang tidak lengkap. Norma budaya yang mereka anggap bisa diterima begitu saja tidak berlaku; perilaku yang tampak aneh mungkin sepenuhnya rasional.",
            "Interculturele leiders zijn bijzonder kwetsbaar omdat ze opereren in een omgeving waar het patroonherkenningssysteem van hun brein werkt met onvolledige gegevens. Culturele normen die ze als vanzelfsprekend beschouwen gelden niet."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("6 Categories of Cognitive Bias", "6 Kategori Bias Kognitif", "6 Categorieën van Cognitieve Bias")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {biasCategories.map((b) => (
              <div key={b.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{b.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? b.en_title : lang === "id" ? b.id_title : b.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? b.en_example : lang === "id" ? b.id_example : b.nl_example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("5 Ways to Counter Bias", "5 Cara Mengatasi Bias", "5 Manieren om Bias te Tegengaan")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, marginBottom: 40, fontSize: 15 }}>
          {t("You cannot eliminate bias — but you can interrupt it.", "Anda tidak bisa menghilangkan bias — tetapi Anda bisa menginterupsinya.", "Je kunt bias niet elimineren — maar je kunt het wel onderbreken.")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {counterStrategies.map((s) => (
            <div key={s.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{s.number}</div>
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                {lang === "en" ? s.en : lang === "id" ? s.id : s.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {reflectionQuestions.map((q) => (
              <div key={q.roman} style={{ background: offWhite, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
