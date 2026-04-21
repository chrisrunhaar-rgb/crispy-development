"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const burnoutReasons = [
  { number: "1", en_title: "Identity fused with output", id_title: "Identitas menyatu dengan output", nl_title: "Identiteit versmolten met output", en_desc: "When a leader's sense of worth is tied to productivity, rest feels like failure. The inability to stop working is often not a capacity issue — it is a theological one. Leaders need to know they are enough apart from what they produce.", id_desc: "Ketika rasa harga diri seorang pemimpin terikat pada produktivitas, istirahat terasa seperti kegagalan. Ketidakmampuan untuk berhenti bekerja sering kali bukan masalah kapasitas — itu adalah masalah teologis.", nl_desc: "Wanneer het gevoel van eigenwaarde van een leider verbonden is aan productiviteit, voelt rust als falen. Het onvermogen te stoppen is vaak geen capaciteitsprobleem — het is een theologisch probleem." },
  { number: "2", en_title: "Chronic under-delegation", id_title: "Kurang delegasi kronis", nl_title: "Chronische onderdelegatie", en_desc: "Leaders who cannot entrust work to others carry impossible loads. Cross-cultural contexts amplify this — if you don't trust local team members fully, you end up carrying their work too. Burnout follows.", id_desc: "Pemimpin yang tidak dapat mempercayakan pekerjaan kepada orang lain membawa beban yang tidak mungkin. Konteks lintas budaya memperkuat ini — jika Anda tidak sepenuhnya mempercayai anggota tim lokal, Anda akhirnya membawa pekerjaan mereka juga.", nl_desc: "Leiders die werk niet aan anderen kunnen toevertrouwen dragen onmogelijke lasten. Interculturele contexten versterken dit — als je lokale teamleden niet volledig vertrouwt, draag je uiteindelijk hun werk ook." },
  { number: "3", en_title: "Absence of solitude", id_title: "Ketiadaan kesunyian", nl_title: "Afwezigheid van eenzaamheid", en_desc: "Cross-cultural leaders are often always 'on' — navigating language, culture, relationships, and expectations simultaneously. Without intentional solitude, the tank empties and emotional reserves run out. Leadership then becomes reactive rather than responsive.", id_desc: "Pemimpin lintas budaya sering selalu 'aktif' — menavigasi bahasa, budaya, hubungan, dan harapan secara bersamaan. Tanpa kesunyian yang disengaja, tangki mengosongkan diri dan cadangan emosional habis.", nl_desc: "Interculturele leiders zijn vaak altijd 'aan' — ze navigeren tegelijkertijd taal, cultuur, relaties en verwachtingen. Zonder bewuste eenzaamheid raakt de tank leeg en de emotionele reserves op." },
  { number: "4", en_title: "Confusion between urgency and importance", id_title: "Kebingungan antara urgensi dan kepentingan", nl_title: "Verwarring tussen urgentie en belangrijkheid", en_desc: "Without a Sabbath rhythm, everything becomes urgent. The tyranny of the immediate displaces the strategic and the sacred. Leaders who do not regularly withdraw to pray, think, and rest lose their capacity to discern what actually matters.", id_desc: "Tanpa ritme Sabat, segalanya menjadi mendesak. Tirani hal-hal segera menggantikan hal-hal strategis dan sakral. Pemimpin yang tidak secara teratur mundur untuk berdoa, berpikir, dan beristirahat kehilangan kemampuan mereka untuk mendiskriminasikan apa yang sebenarnya penting.", nl_desc: "Zonder een Sabbatsritme wordt alles urgent. De tirannie van het directe verdringt het strategische en het heilige. Leiders die zich niet regelmatig terugtrekken om te bidden, denken en rusten verliezen hun vermogen om te onderscheiden wat werkelijk belangrijk is." },
];

const dimensions = [
  { number: "1", en_title: "Rest (physical)", id_title: "Istirahat (fisik)", nl_title: "Rust (fysiek)", en_desc: "The body needs sleep, stillness, and physical disengagement from work. Leaders who ignore physical rest pay compound interest over time — exhaustion degrades decision quality, relational attunement, and spiritual sensitivity.", id_desc: "Tubuh membutuhkan tidur, ketenangan, dan pemisahan fisik dari pekerjaan. Pemimpin yang mengabaikan istirahat fisik membayar bunga majemuk dari waktu ke waktu.", nl_desc: "Het lichaam heeft slaap, rust en fysieke ontkoppeling van werk nodig. Leiders die fysieke rust negeren betalen samengestelde rente over tijd." },
  { number: "2", en_title: "Delight (emotional)", id_title: "Sukacita (emosional)", nl_title: "Vreugde (emotioneel)", en_desc: "Sabbath is not just cessation from work — it is active enjoyment of creation. Find what restores you emotionally: family, beauty, creativity, nature, laughter. Leaders who only stop working but never play are in partial Sabbath at best.", id_desc: "Sabat bukan hanya berhenti dari pekerjaan — itu adalah kenikmatan aktif dari ciptaan. Temukan apa yang memulihkan Anda secara emosional: keluarga, keindahan, kreativitas, alam, tawa.", nl_desc: "Sabbat is niet alleen stoppen met werken — het is actief genieten van de schepping. Ontdek wat jou emotioneel herstelt: familie, schoonheid, creativiteit, natuur, lachen." },
  { number: "3", en_title: "Worship (spiritual)", id_title: "Penyembahan (spiritual)", nl_title: "Aanbidding (spiritueel)", en_desc: "Sabbath reorients the leader toward God rather than toward their own agenda. Time in Scripture, prayer, and worship recalibrates identity, reminds of dependence, and restores perspective that busyness always erodes.", id_desc: "Sabat mengorientasikan ulang pemimpin menuju Tuhan daripada agenda mereka sendiri. Waktu dalam Firman, doa, dan penyembahan mengkalibrasi ulang identitas, mengingatkan ketergantungan, dan memulihkan perspektif.", nl_desc: "Sabbat heroriënteert de leider naar God in plaats van naar hun eigen agenda. Tijd in de Schrift, gebed en aanbidding herkalibereert identiteit, herinnert aan afhankelijkheid en herstelt perspectief." },
  { number: "4", en_title: "Community (relational)", id_title: "Komunitas (relasional)", nl_title: "Gemeenschap (relationeel)", en_desc: "True rest is often experienced in the presence of trusted people with no agenda. Leaders need relationships where they are simply known — not followed. This relational Sabbath restores the humanity that leadership pressure slowly strips away.", id_desc: "Istirahat sejati sering dialami di hadapan orang-orang yang dipercaya tanpa agenda. Pemimpin membutuhkan hubungan di mana mereka hanya dikenal — tidak diikuti.", nl_desc: "Echte rust wordt vaak ervaren in de aanwezigheid van vertrouwde mensen zonder agenda. Leiders hebben relaties nodig waar ze simpelweg gekend zijn — niet gevolgd." },
  { number: "5", en_title: "Anticipation (forward-looking)", id_title: "Antisipasi (berorientasi ke depan)", nl_title: "Anticipatie (toekomstgericht)", en_desc: "Sabbath rhythm creates a horizon to look toward. It prevents the leader from collapsing into the present pressure by maintaining a regular reminder that there is more to life than this week's urgent tasks. Hope is a leadership resource.", id_desc: "Ritme Sabat menciptakan cakrawala untuk ditatap. Ini mencegah pemimpin dari keruntuhan ke dalam tekanan saat ini dengan mempertahankan pengingat rutin bahwa ada lebih banyak dalam hidup daripada tugas-tugas mendesak minggu ini.", nl_desc: "Het Sabbatsritme creëert een horizon om naar uit te zien. Het voorkomt dat de leider instort onder de huidige druk door regelmatig te herinneren dat er meer is in het leven dan de urgente taken van deze week." },
];

const reflectionQuestions = [
  { roman: "I", en: "When did you last take a full, uninterrupted day of rest? What prevented it — practically or psychologically?", id: "Kapan terakhir kali Anda mengambil hari istirahat penuh tanpa gangguan? Apa yang menghalanginya — secara praktis atau psikologis?", nl: "Wanneer heb je voor het laatste een volledige, ononderbroken rustdag genomen? Wat weerhield je — praktisch of psychologisch?" },
  { roman: "II", en: "What is the lie you tell yourself that keeps you from resting? (e.g., 'The work won't get done without me.')", id: "Apa kebohongan yang Anda ceritakan pada diri sendiri yang membuat Anda tidak bisa beristirahat? (mis., 'Pekerjaan tidak akan selesai tanpa saya.')", nl: "Welke leugen vertel je jezelf die je verhindert te rusten? (bijv. 'Het werk wordt niet gedaan zonder mij.')" },
  { roman: "III", en: "How has the pace of your leadership affected your family, your health, or your spiritual life in the past year?", id: "Bagaimana tempo kepemimpinan Anda mempengaruhi keluarga, kesehatan, atau kehidupan rohani Anda dalam setahun terakhir?", nl: "Hoe heeft het tempo van je leiderschap het afgelopen jaar je gezin, je gezondheid of je geestelijk leven beïnvloed?" },
  { roman: "IV", en: "What does Sabbath-keeping look like practically in your cultural and ministry context?", id: "Seperti apa menjaga Sabat secara praktis dalam konteks budaya dan pelayanan Anda?", nl: "Hoe ziet Sabbat-houden er praktisch uit in jouw culturele en bedieningscontext?" },
  { roman: "V", en: "What would you need to put in place this week to protect one Sabbath rhythm next month?", id: "Apa yang perlu Anda lakukan minggu ini untuk melindungi satu ritme Sabat bulan depan?", nl: "Wat zou je deze week moeten regelen om volgende maand één Sabbatsritme te beschermen?" },
  { roman: "VI", en: "Who else on your team needs permission to rest? How can you model and create space for that?", id: "Siapa lagi dalam tim Anda yang membutuhkan izin untuk beristirahat? Bagaimana Anda bisa mencontoh dan menciptakan ruang untuk itu?", nl: "Wie in je team heeft nog meer toestemming nodig om te rusten? Hoe kun je daarvoor modelstaan en ruimte creëren?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function SabbathLeadershipClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("sabbath-leadership");
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
          {t("Sustainable Leadership", "Kepemimpinan Berkelanjutan", "Duurzaam Leiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Sabbath Leadership", "Kepemimpinan Sabat", "Sabbatsleiderschap")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Sabbath is not a pause in the work. It is the rhythm that makes the work sustainable."',
            '"Sabat bukan jeda dalam pekerjaan. Ini adalah ritme yang membuat pekerjaan berkelanjutan."',
            '"Sabbat is geen pauze in het werk. Het is het ritme dat het werk duurzaam maakt."'
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
            "Cross-cultural leadership is among the most demanding forms of ministry. You are navigating language barriers, cultural misunderstandings, relational complexity, and spiritual warfare — often far from your own support networks. Burnout is not just possible; without intentional counter-rhythms, it is likely.",
            "Kepemimpinan lintas budaya adalah salah satu bentuk pelayanan yang paling menuntut. Anda menavigasi hambatan bahasa, kesalahpahaman budaya, kompleksitas relasional, dan peperangan rohani — seringkali jauh dari jaringan dukungan Anda sendiri.",
            "Intercultureel leiderschap behoort tot de meest veeleisende vormen van bediening. Je navigeert taalbarrières, culturele misverstanden, relationele complexiteit en geestelijke strijd — vaak ver van je eigen ondersteuningsnetwerken."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "The Sabbath is God's built-in protection against the lie that everything depends on you. It is not a rule to follow — it is a gift to receive and a rhythm to inhabit. Leaders who practice Sabbath lead with greater clarity, depth, and longevity than those who do not.",
            "Sabat adalah perlindungan bawaan Tuhan terhadap kebohongan bahwa segalanya bergantung pada Anda. Ini bukan aturan yang harus diikuti — ini adalah hadiah yang harus diterima dan ritme yang harus dihuni.",
            "De Sabbat is Gods ingebouwde bescherming tegen de leugen dat alles van jou afhangt. Het is geen regel om te volgen — het is een geschenk om te ontvangen en een ritme om te bewonen."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("Why Leaders Burn Out", "Mengapa Pemimpin Kelelahan", "Waarom Leiders Uitbranden")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {burnoutReasons.map((r) => (
              <div key={r.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{r.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? r.en_title : lang === "id" ? r.id_title : r.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? r.en_desc : lang === "id" ? r.id_desc : r.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("5 Dimensions of Sabbath Rhythm", "5 Dimensi Ritme Sabat", "5 Dimensies van Sabbatsritme")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, marginBottom: 40, fontSize: 16 }}>
          {t("Sabbath is not just one day — it is a posture of sustainable rhythm across all of life.", "Sabat bukan hanya satu hari — itu adalah sikap ritme berkelanjutan di semua kehidupan.", "Sabbat is niet alleen één dag — het is een houding van duurzaam ritme door heel het leven.")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {dimensions.map((d) => (
            <div key={d.number} style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{d.number}</div>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? d.en_title : lang === "id" ? d.id_title : d.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? d.en_desc : lang === "id" ? d.id_desc : d.nl_desc}
                </p>
              </div>
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
