"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const visionElements = [
  { number: "1", en_title: "Direction — Where are we going?", id_title: "Arah — Ke mana kita pergi?", nl_title: "Richting — Waar gaan we naartoe?", en_desc: "A compelling vision names a specific destination. Vague aspirations ('we want to grow') are not vision — they are wishful thinking. Powerful vision is specific enough that you would know when you arrived and know if you have drifted.", id_desc: "Visi yang menarik menyebutkan tujuan yang spesifik. Aspirasi yang samar ('kita ingin tumbuh') bukan visi — itu adalah angan-angan. Visi yang kuat cukup spesifik sehingga Anda tahu kapan Anda tiba dan tahu apakah Anda telah menyimpang.", nl_desc: "Een overtuigende visie noemt een specifieke bestemming. Vage aspiraties ('we willen groeien') zijn geen visie — het is wensdenken. Krachtige visie is specifiek genoeg dat je zou weten wanneer je bent aangekomen." },
  { number: "2", en_title: "Motivation — Why does it matter?", id_title: "Motivasi — Mengapa itu penting?", nl_title: "Motivatie — Waarom doet het ertoe?", en_desc: "Vision must answer the question every person silently asks: 'Why should I give my life to this?' The motivation must be bigger than the organisation — it must connect to something that transcends survival and comfort. For Kingdom leaders, this is usually the deepest Why of all.", id_desc: "Visi harus menjawab pertanyaan yang diam-diam ditanyakan setiap orang: 'Mengapa saya harus memberikan hidup saya untuk ini?' Motivasinya harus lebih besar dari organisasi.", nl_desc: "Visie moet de vraag beantwoorden die iedereen stilzwijgend stelt: 'Waarom zou ik mijn leven hieraan geven?' De motivatie moet groter zijn dan de organisatie — het moet verbinden met iets dat overleven en comfort overstijgt." },
  { number: "3", en_title: "Values — How will we travel?", id_title: "Nilai-nilai — Bagaimana kita bepergian?", nl_title: "Waarden — Hoe zullen we reizen?", en_desc: "Vision without values is just ambition. The values define the road rules — what we will and will not do to get there. In cross-cultural teams, values must be named explicitly because they are not shared by default. The journey is as important as the destination.", id_desc: "Visi tanpa nilai hanyalah ambisi. Nilai-nilai mendefinisikan aturan jalan — apa yang akan dan tidak akan kita lakukan untuk mencapainya. Dalam tim lintas budaya, nilai-nilai harus disebutkan secara eksplisit karena tidak dibagikan secara default.", nl_desc: "Visie zonder waarden is slechts ambitie. De waarden definiëren de verkeersregels — wat we wel en niet zullen doen om er te komen. In interculturele teams moeten waarden expliciet worden benoemd." },
  { number: "4", en_title: "Impact — Who benefits?", id_title: "Dampak — Siapa yang diuntungkan?", nl_title: "Impact — Wie profiteert?", en_desc: "Name the specific people who will be different because this vision is realised. Not just the organisation's members — but the communities, peoples, or generations who will be affected. This moves vision from inward to outward, from self-serving to sacrificial.", id_desc: "Sebutkan orang-orang spesifik yang akan berbeda karena visi ini terwujud. Bukan hanya anggota organisasi — tetapi komunitas, masyarakat, atau generasi yang akan terpengaruh.", nl_desc: "Benoem de specifieke mensen die anders zullen zijn omdat deze visie is gerealiseerd. Niet alleen de leden van de organisatie — maar de gemeenschappen, volkeren of generaties die worden beïnvloed." },
];

const communicationPrinciples = [
  { number: "1", en_title: "Repeat more than you think necessary", id_title: "Ulangi lebih dari yang Anda pikir perlu", nl_title: "Herhaal vaker dan je nodig denkt", en_desc: "Research suggests leaders need to communicate a vision seven to ten times before it begins to settle. Most leaders say the vision twice and wonder why no one is aligned. You have to say it until you are tired of saying it — and then keep saying it.", id_desc: "Penelitian menunjukkan pemimpin perlu mengkomunikasikan visi tujuh hingga sepuluh kali sebelum mulai menetap. Sebagian besar pemimpin mengatakan visi dua kali dan bertanya-tanya mengapa tidak ada yang selaras.", nl_desc: "Onderzoek suggereert dat leiders een visie zeven tot tien keer moeten communiceren voordat ze begint te landen. De meeste leiders zeggen de visie twee keer en vragen zich af waarom niemand op één lijn zit." },
  { number: "2", en_title: "Use story, not slides", id_title: "Gunakan cerita, bukan slide", nl_title: "Gebruik verhalen, geen slides", en_desc: "A vision presented as a list of bullet points will not move people. A vision told as a story — vivid, specific, emotionally true — creates longing and momentum. The most powerful vision moments in history were speeches, not spreadsheets.", id_desc: "Visi yang disajikan sebagai daftar poin tidak akan menggerakkan orang. Visi yang diceritakan sebagai cerita — hidup, spesifik, benar secara emosional — menciptakan kerinduan dan momentum.", nl_desc: "Een visie gepresenteerd als een lijst met bullet points zal mensen niet bewegen. Een visie verteld als verhaal — levendig, specifiek, emotioneel waar — creëert verlangen en momentum." },
  { number: "3", en_title: "Invite people in, don't announce to them", id_title: "Undang orang masuk, jangan umumkan kepada mereka", nl_title: "Nodig mensen uit, kondig niet aan", en_desc: "Announcement creates distance; invitation creates ownership. Share the vision and say: 'Here is where I believe we are called to go. I need to know if you see it too.' When people choose the vision rather than receive it, they own it.", id_desc: "Pengumuman menciptakan jarak; undangan menciptakan kepemilikan. Bagikan visi dan katakan: 'Inilah di mana saya percaya kita dipanggil untuk pergi. Saya perlu tahu apakah Anda juga melihatnya.'", nl_desc: "Aankondiging creëert afstand; uitnodiging creëert eigenaarschap. Deel de visie en zeg: 'Hier geloof ik dat we geroepen zijn naartoe te gaan. Ik moet weten of jij het ook ziet.'" },
];

const crossCulturalChallenges = [
  { en: "In high power-distance cultures, vision may be received as instruction rather than invitation — and followed without genuine buy-in.", id: "Dalam budaya jarak kekuasaan tinggi, visi mungkin diterima sebagai instruksi daripada undangan — dan diikuti tanpa dukungan yang tulus.", nl: "In hoge machtafstandsculturen kan visie als instructie worden ontvangen in plaats van uitnodiging — en gevolgd worden zonder echte instemming." },
  { en: "Collective cultures may resist individual-hero language — frame the vision as 'what we will do together', not 'where I am leading you'.", id: "Budaya kolektif mungkin menolak bahasa pahlawan individual — bingkai visi sebagai 'apa yang akan kita lakukan bersama', bukan 'di mana saya memimpin Anda'.", nl: "Collectivistische culturen kunnen individuele-held-taal weerstaan — kader de visie als 'wat we samen zullen doen', niet 'waar ik je naartoe leid'." },
  { en: "Short-term thinking cultures may struggle with 10-year horizons — break the vision into nearer-term waypoints that feel achievable.", id: "Budaya pemikiran jangka pendek mungkin kesulitan dengan cakrawala 10 tahun — pecah visi menjadi titik-titik jalan jangka pendek yang terasa dapat dicapai.", nl: "Culturen met korte-termijndenken kunnen moeite hebben met 10-jaars horizons — splits de visie op in kortere-termijn waypoints die haalbaar aanvoelen." },
];

const reflectionQuestions = [
  { roman: "I", en: "Can you articulate your current vision in one clear, compelling sentence? If not, who else can?", id: "Dapatkah Anda mengartikulasikan visi Anda saat ini dalam satu kalimat yang jelas dan menarik? Jika tidak, siapa lagi yang bisa?", nl: "Kun je je huidige visie in één duidelijke, overtuigende zin verwoorden? Zo niet, wie kan dat dan?" },
  { roman: "II", en: "How many times have you communicated the vision this month? Is it enough?", id: "Berapa kali Anda mengkomunikasikan visi bulan ini? Apakah itu cukup?", nl: "Hoeveel keer heb je de visie deze maand gecommuniceerd? Is het genoeg?" },
  { roman: "III", en: "Does your vision connect to something that matters beyond your organisation? Does it have a Kingdom dimension?", id: "Apakah visi Anda terhubung dengan sesuatu yang penting di luar organisasi Anda? Apakah memiliki dimensi Kerajaan?", nl: "Verbindt je visie met iets dat verder reikt dan je organisatie? Heeft het een Koninkrijksdimensie?" },
  { roman: "IV", en: "How has your cross-cultural context shaped or complicated your vision? What adjustments have you made?", id: "Bagaimana konteks lintas budaya Anda telah membentuk atau memperumit visi Anda? Penyesuaian apa yang telah Anda buat?", nl: "Hoe heeft jouw interculturele context je visie gevormd of gecompliceerd? Welke aanpassingen heb je gemaakt?" },
  { roman: "V", en: "Who in your team most owns the vision? Who seems least connected to it? What accounts for the difference?", id: "Siapa dalam tim Anda yang paling memiliki visi? Siapa yang tampaknya paling tidak terhubung dengannya? Apa yang menyebabkan perbedaan tersebut?", nl: "Wie in je team bezit de visie het meest? Wie lijkt er het minst mee verbonden? Wat verklaart het verschil?" },
  { roman: "VI", en: "How does Habakkuk 2:2 ('Write the vision clearly so that the one who reads it can run') shape how you communicate yours?", id: "Bagaimana Habakuk 2:2 ('Tuliskan visi dengan jelas sehingga orang yang membacanya dapat berlari') membentuk cara Anda mengkomunikasikan visi Anda?", nl: "Hoe vormt Habakuk 2:2 ('Schrijf het visioen duidelijk op zodat degene die het leest kan rennen') hoe jij de jouwe communiceert?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function VisionCastingClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("vision-casting");
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
      <LangToggle />

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Leadership · Guide", "Kepemimpinan · Panduan", "Leiderschap · Gids")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Vision Casting", "Menebar Visi", "Vision Casting")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Where there is no vision, the people perish." — Proverbs 29:18',
            '"Di mana tidak ada visi, rakyat akan binasa." — Amsal 29:18',
            '"Waar geen visie is, vergaat het volk." — Spreuken 29:18'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", borderRadius: 6, border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Vision is not a statement on a wall — it is a living, spoken, repeated picture of a preferred future that moves people toward something greater than the status quo. Leaders without vision manage; leaders with vision mobilise.",
            "Visi bukan pernyataan di dinding — itu adalah gambaran hidup, lisan, berulang dari masa depan yang lebih baik yang menggerakkan orang menuju sesuatu yang lebih besar dari status quo. Pemimpin tanpa visi mengelola; pemimpin dengan visi memobilisasi.",
            "Visie is geen statement op een muur — het is een levend, gesproken, herhaald beeld van een gewenste toekomst die mensen beweegt naar iets groter dan de status quo. Leiders zonder visie beheren; leiders met visie mobiliseren."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "In cross-cultural contexts, vision casting is both more important and more complex. You are trying to move people from multiple cultural backgrounds toward a shared future — which means the vision must be large enough to be compelling, specific enough to be actionable, and culturally wise enough to be owned by all.",
            "Dalam konteks lintas budaya, penebaran visi lebih penting dan lebih kompleks. Anda mencoba menggerakkan orang-orang dari berbagai latar belakang budaya menuju masa depan bersama — yang berarti visi harus cukup besar untuk menarik, cukup spesifik untuk dapat ditindaklanjuti, dan cukup bijak secara budaya untuk dimiliki semua.",
            "In interculturele contexten is vision casting zowel belangrijker als complexer. Je probeert mensen vanuit meerdere culturele achtergronden naar een gedeelde toekomst te bewegen — wat betekent dat de visie groot genoeg moet zijn om overtuigend te zijn, specifiek genoeg om uitvoerbaar te zijn, en cultureel wijs genoeg om door allen te worden bezeten."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("4 Elements of a Compelling Vision", "4 Elemen Visi yang Menarik", "4 Elementen van een Overtuigende Visie")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {visionElements.map((el) => (
              <div key={el.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{el.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? el.en_title : lang === "id" ? el.id_title : el.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? el.en_desc : lang === "id" ? el.id_desc : el.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("3 Communication Principles", "3 Prinsip Komunikasi", "3 Communicatieprincipes")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {communicationPrinciples.map((p) => (
            <div key={p.number} style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{p.number}</div>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? p.en_title : lang === "id" ? p.id_title : p.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? p.en_desc : lang === "id" ? p.id_desc : p.nl_desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 24, fontWeight: 800, color: navy, marginBottom: 24, textAlign: "center" }}>
            {t("Cross-Cultural Vision Challenges", "Tantangan Visi Lintas Budaya", "Interculturele Visie-uitdagingen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {crossCulturalChallenges.map((c, i) => (
              <div key={i} style={{ background: offWhite, borderRadius: 8, padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ color: navy, fontSize: 18, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                  {lang === "en" ? c.en : lang === "id" ? c.id : c.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {reflectionQuestions.map((q) => (
            <div key={q.roman} style={{ background: lightGray, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
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
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </div>
    </div>
  );
}
