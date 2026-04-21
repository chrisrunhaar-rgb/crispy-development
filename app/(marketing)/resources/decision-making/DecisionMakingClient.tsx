"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const decisionStyles = [
  { number: "1", en_title: "Rational", id_title: "Rasional", nl_title: "Rationeel", en_desc: "Systematic, data-driven analysis. The decision-maker gathers information, weighs options, and selects the optimal outcome. Highly valued in Western business culture but can be slow and misses relational and intuitive dimensions.", id_desc: "Analisis sistematis berbasis data. Pengambil keputusan mengumpulkan informasi, menimbang pilihan, dan memilih hasil yang optimal. Sangat dihargai dalam budaya bisnis Barat tetapi bisa lambat dan melewatkan dimensi relasional dan intuitif.", nl_desc: "Systematische, op data gebaseerde analyse. De beslisser verzamelt informatie, weegt opties en selecteert het optimale resultaat. Hoog gewaardeerd in de westerse bedrijfscultuur maar kan traag zijn." },
  { number: "2", en_title: "Intuitive", id_title: "Intuitif", nl_title: "Intuïtief", en_desc: "Pattern recognition and gut-level judgment based on experience. Fast and often correct — but difficult to explain or justify to others. Many experienced leaders in cross-cultural contexts develop this over years of exposure.", id_desc: "Pengenalan pola dan penilaian intuitif berdasarkan pengalaman. Cepat dan sering benar — tetapi sulit dijelaskan atau dibenarkan kepada orang lain. Banyak pemimpin berpengalaman mengembangkan ini selama bertahun-tahun.", nl_desc: "Patroonherkenning en instinctief oordeel op basis van ervaring. Snel en vaak correct — maar moeilijk uit te leggen of te rechtvaardigen aan anderen." },
  { number: "3", en_title: "Dependent", id_title: "Bergantung", nl_title: "Afhankelijk", en_desc: "Seeking guidance from others before deciding — from senior figures, elders, experts, or consensus. Common in high power-distance and collectivist cultures. Not weakness — it is a culturally appropriate stewardship of authority.", id_desc: "Mencari bimbingan dari orang lain sebelum memutuskan — dari tokoh senior, tetua, ahli, atau konsensus. Umum dalam budaya jarak kekuasaan tinggi dan kolektivis. Bukan kelemahan — itu adalah pengelolaan otoritas yang tepat secara budaya.", nl_desc: "Begeleiding zoeken bij anderen voor er wordt beslist — van senior figuren, ouderen, experts of consensus. Gangbaar in hoge machtafstands- en collectivistische culturen. Geen zwakte — het is cultureel passend beheer van autoriteit." },
  { number: "4", en_title: "Avoidant", id_title: "Menghindari", nl_title: "Vermijdend", en_desc: "Postponing or deflecting decisions — often to preserve relationships, maintain harmony, or avoid responsibility for a bad outcome. In the short term, it can prevent conflict. Over time, it creates the paralysis that compounds every other problem.", id_desc: "Menunda atau mengalihkan keputusan — sering untuk menjaga hubungan, mempertahankan harmoni, atau menghindari tanggung jawab atas hasil yang buruk. Dalam jangka pendek, ini dapat mencegah konflik.", nl_desc: "Beslissingen uitstellen of afwentelen — vaak om relaties te bewaren, harmonie te bewaren of verantwoordelijkheid voor een slechte uitkomst te vermijden. Op korte termijn kan het conflict voorkomen." },
];

const frameworkSteps = [
  { number: "1", en_title: "Name the decision clearly", id_title: "Sebutkan keputusan dengan jelas", nl_title: "Benoem de beslissing duidelijk", en_desc: "State the decision in one clear sentence. Many decisions stall because the actual question is vague. What exactly needs to be decided, and by when?", id_desc: "Nyatakan keputusan dalam satu kalimat yang jelas. Banyak keputusan terhenti karena pertanyaan sebenarnya tidak jelas. Apa tepatnya yang perlu diputuskan, dan kapan?", nl_desc: "Verwoord de beslissing in één duidelijke zin. Veel beslissingen stagneren omdat de eigenlijke vraag vaag is. Wat moet er precies worden beslist, en wanneer?" },
  { number: "2", en_title: "Gather perspectives (not just data)", id_title: "Kumpulkan perspektif (bukan hanya data)", nl_title: "Verzamel perspectieven (niet alleen data)", en_desc: "Who will be affected? Who has cultural or relational context you lack? Consult people who will live with the decision — their buy-in is part of the decision's quality.", id_desc: "Siapa yang akan terpengaruh? Siapa yang memiliki konteks budaya atau relasional yang kurang Anda miliki? Konsultasikan dengan orang-orang yang akan hidup dengan keputusan tersebut.", nl_desc: "Wie wordt beïnvloed? Wie heeft culturele of relationele context die jij mist? Raadpleeg mensen die met de beslissing moeten leven — hun instemming is deel van de kwaliteit van de beslissing." },
  { number: "3", en_title: "Decide and own it", id_title: "Putuskan dan miliki itu", nl_title: "Beslis en neem verantwoordelijkheid", en_desc: "Choose. Leaders who perpetually defer create anxiety and drift. Make the call, even under uncertainty, and commit to it clearly. Decisiveness is a gift to your team.", id_desc: "Pilih. Pemimpin yang terus-menerus menunda menciptakan kecemasan dan penyimpangan. Buat keputusan, bahkan dalam ketidakpastian, dan berkomitmen padanya dengan jelas. Ketegasan adalah hadiah bagi tim Anda.", nl_desc: "Kies. Leiders die voortdurend uitstellen creëren angst en drift. Neem de beslissing, zelfs onder onzekerheid, en ga er duidelijk aan toe. Besluitvaardigheid is een geschenk voor je team." },
  { number: "4", en_title: "Communicate culturally", id_title: "Komunikasikan secara budaya", nl_title: "Communiceer cultureel", en_desc: "The same decision needs to be communicated differently in different cultural contexts. What will this decision mean relationally to your team? How do you frame it to honour both the decision and the people?", id_desc: "Keputusan yang sama perlu dikomunikasikan secara berbeda dalam konteks budaya yang berbeda. Apa arti keputusan ini secara relasional bagi tim Anda? Bagaimana Anda membingkainya untuk menghormati keputusan dan orang-orangnya?", nl_desc: "Dezelfde beslissing moet anders worden gecommuniceerd in verschillende culturele contexten. Wat betekent deze beslissing relationeel voor je team? Hoe kun je het framen om zowel de beslissing als de mensen te eren?" },
];

const consensusVsAuth = [
  { en_label: "Consensus cultures", id_label: "Budaya konsensus", nl_label: "Consensusculturen", en_text: "Decisions are discussed extensively until broad agreement is reached. Slower process — but stronger buy-in and execution. Leaders who rush this create backlash and passive resistance.", id_text: "Keputusan dibahas secara ekstensif sampai tercapai kesepakatan luas. Proses lebih lambat — tetapi dukungan dan pelaksanaan yang lebih kuat.", nl_text: "Beslissingen worden uitgebreid besproken totdat brede overeenstemming is bereikt. Langzamer proces — maar sterkere instemming en uitvoering." },
  { en_label: "Authority cultures", id_label: "Budaya otoritas", nl_label: "Autoriteitsculturen", en_text: "Decisions are made by the appropriate authority figure and communicated downward. Faster process — but requires the leader to have earned relational trust. Participation may be cosmetic rather than genuine.", id_text: "Keputusan dibuat oleh tokoh otoritas yang tepat dan dikomunikasikan ke bawah. Proses lebih cepat — tetapi memerlukan pemimpin yang telah mendapatkan kepercayaan relasional.", nl_text: "Beslissingen worden genomen door de bevoegde autoriteitsfiguur en neerwaarts gecommuniceerd. Sneller proces — maar vereist dat de leider relationeel vertrouwen heeft verdiend." },
];

const reflectionQuestions = [
  { roman: "I", en: "What is your dominant decision-making style? When does it serve you well, and when does it hinder you?", id: "Apa gaya pengambilan keputusan dominan Anda? Kapan itu melayani Anda dengan baik, dan kapan itu menghalangi Anda?", nl: "Wat is jouw dominante besluitvormingsstijl? Wanneer dient het je goed, en wanneer belemmert het je?" },
  { roman: "II", en: "Think of a significant decision you made recently. Which style governed it — and was that appropriate to the context?", id: "Pikirkan keputusan penting yang Anda buat baru-baru ini. Gaya mana yang mengatur itu — dan apakah itu tepat untuk konteksnya?", nl: "Denk aan een recente significante beslissing die je hebt genomen. Welke stijl bepaalde het — en was dat passend bij de context?" },
  { roman: "III", en: "How does your team's cultural background shape their expectation of how decisions should be made?", id: "Bagaimana latar belakang budaya tim Anda membentuk harapan mereka tentang bagaimana keputusan harus dibuat?", nl: "Hoe vormt de culturele achtergrond van je team hun verwachting van hoe beslissingen moeten worden genomen?" },
  { roman: "IV", en: "When have you made a decision that was technically correct but relationally destructive? What did you miss?", id: "Kapan Anda membuat keputusan yang secara teknis benar tetapi merusak secara relasional? Apa yang Anda lewatkan?", nl: "Wanneer heb je een beslissing genomen die technisch correct was maar relationeel destructief? Wat heb je gemist?" },
  { roman: "V", en: "How does trusting God's sovereignty free you to make decisions under uncertainty without paralysis?", id: "Bagaimana mempercayai kedaulatan Tuhan membebaskan Anda untuk membuat keputusan dalam ketidakpastian tanpa kelumpuhan?", nl: "Hoe bevrijdt het vertrouwen in Gods soevereiniteit je om beslissingen te nemen onder onzekerheid zonder verlamming?" },
  { roman: "VI", en: "What decision are you currently avoiding? What would it take to move forward this week?", id: "Keputusan apa yang saat ini Anda hindari? Apa yang diperlukan untuk melangkah maju minggu ini?", nl: "Welke beslissing vermijd je momenteel? Wat zou er nodig zijn om deze week vooruit te gaan?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function DecisionMakingClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("decision-making");
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
          {t("Leadership Skills", "Keterampilan Kepemimpinan", "Leiderschapsvaardigheden")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Decision-Making Across Cultures", "Pengambilan Keputusan Lintas Budaya", "Besluitvorming Across Culturen")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"A good decision made slowly is often better than a perfect decision made never."',
            '"Keputusan yang baik yang dibuat dengan lambat seringkali lebih baik daripada keputusan yang sempurna yang tidak pernah dibuat."',
            '"Een goede beslissing die langzaam wordt genomen is vaak beter dan een perfecte beslissing die nooit wordt genomen."'
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
            "How decisions are made — and who makes them — is one of the most culturally loaded aspects of leadership. A leader who excels at decision-making in one cultural context can be paralysed or perceived as autocratic in another, simply because the expected process differs.",
            "Bagaimana keputusan dibuat — dan siapa yang membuatnya — adalah salah satu aspek kepemimpinan yang paling bernuansa budaya. Seorang pemimpin yang unggul dalam pengambilan keputusan dalam satu konteks budaya bisa lumpuh atau dianggap otoriter di konteks lain.",
            "Hoe beslissingen worden genomen — en wie ze neemt — is een van de meest cultureel beladen aspecten van leiderschap. Een leider die uitblinkt in besluitvorming in één culturele context kan verlamd raken of als autocratisch worden gezien in een andere."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Understanding the four main decision-making styles — and when each serves the situation — gives leaders the flexibility to lead decisively without being tone-deaf to how their decisions land culturally.",
            "Memahami empat gaya pengambilan keputusan utama — dan kapan masing-masing melayani situasi — memberi pemimpin fleksibilitas untuk memimpin dengan tegas tanpa menjadi tidak peka terhadap bagaimana keputusan mereka berdampak secara budaya.",
            "Het begrijpen van de vier voornaamste besluitvormingsstijlen — en wanneer elk de situatie dient — geeft leiders de flexibiliteit om besluitvaardig te leiden zonder onverschillig te zijn voor hoe hun beslissingen cultureel landen."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("4 Decision-Making Styles", "4 Gaya Pengambilan Keputusan", "4 Besluitvormingsstijlen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {decisionStyles.map((d) => (
              <div key={d.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{d.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
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
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("4-Step Framework for Deciding Under Uncertainty", "Kerangka 4 Langkah untuk Memutuskan dalam Ketidakpastian", "4-Staps Framework voor Beslissen Onder Onzekerheid")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {frameworkSteps.map((f) => (
            <div key={f.number} style={{ background: lightGray, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{f.number}</div>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? f.en_title : lang === "id" ? f.id_title : f.nl_title}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? f.en_desc : lang === "id" ? f.id_desc : f.nl_desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 32, textAlign: "center" }}>
            {t("Consensus vs. Authority Cultures", "Budaya Konsensus vs. Otoritas", "Consensus- vs. Autoriteitsculturen")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {consensusVsAuth.map((c, i) => (
              <div key={i} style={{ background: offWhite, borderRadius: 12, padding: "28px 28px" }}>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 12 }}>
                  {lang === "en" ? c.en_label : lang === "id" ? c.id_label : c.nl_label}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {lang === "en" ? c.en_text : lang === "id" ? c.id_text : c.nl_text}
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
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
