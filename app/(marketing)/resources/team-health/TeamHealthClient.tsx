"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;
type VerseKey = "1cor-12-12" | "eph-4-3";

const VERSES: Record<VerseKey, { en_ref: string; id_ref: string; nl_ref: string; en: string; id: string; nl: string }> = {
  "1cor-12-12": {
    en_ref: "1 Corinthians 12:12", id_ref: "1 Korintus 12:12", nl_ref: "1 Korintiërs 12:12",
    en: "Just as a body, though one, has many parts, but all its many parts form one body, so it is with Christ.",
    id: "Karena sama seperti tubuh itu satu dan anggota-anggotanya banyak, dan segala anggota itu, sekalipun banyak, merupakan satu tubuh, demikian pula Kristus.",
    nl: "Een lichaam is een eenheid die uit vele delen bestaat; ondanks de veelheid aan delen vormen ze samen één lichaam. Zo is het ook met het lichaam van Christus.",
  },
  "eph-4-3": {
    en_ref: "Ephesians 4:3", id_ref: "Efesus 4:3", nl_ref: "Efeziërs 4:3",
    en: "Make every effort to keep the unity of the Spirit through the bond of peace.",
    id: "dan berusahalah memelihara kesatuan Roh oleh ikatan damai sejahtera.",
    nl: "Span u in om door de samenbindende vrede de eenheid te bewaren die de Geest u geeft.",
  },
};

const DIMENSIONS = [
  {
    en_name: "Psychological Safety", id_name: "Keamanan Psikologis", nl_name: "Psychologische Veiligheid",
    en_short: "Safety", id_short: "Aman", nl_short: "Veiligheid",
    en_low: "Fear of speaking up", id_low: "Takut untuk berbicara", nl_low: "Angst om te spreken",
    en_high: "Full honesty, no fear", id_high: "Kejujuran penuh, tanpa rasa takut", nl_high: "Volledige eerlijkheid, geen angst",
    en_desc: "Team members can speak up, disagree, and admit mistakes without fear of punishment or humiliation. This is the single most important factor in team effectiveness.",
    id_desc: "Anggota tim dapat berbicara, tidak setuju, dan mengakui kesalahan tanpa takut dihukum atau dipermalukan. Ini adalah faktor terpenting dalam efektivitas tim.",
    nl_desc: "Teamleden kunnen spreken, het oneens zijn en fouten toegeven zonder angst voor bestraffing of vernedering. Dit is de meest bepalende factor voor teameffectiviteit.",
    en_fix: "Start with one-on-one conversations. Ask: 'What's one thing you'd say if you knew there'd be no consequences?' Then make sure there aren't any.",
    id_fix: "Mulailah dengan percakapan satu lawan satu. Tanyakan: 'Apa satu hal yang akan kamu katakan jika kamu tahu tidak ada konsekuensinya?' Kemudian pastikan tidak ada.",
    nl_fix: "Begin met één-op-één gesprekken. Vraag: 'Wat is één ding dat je zou zeggen als je wist dat er geen gevolgen waren?' Zorg er dan voor dat die er ook niet zijn.",
  },
  {
    en_name: "Clarity of Purpose & Roles", id_name: "Kejelasan Tujuan & Peran", nl_name: "Duidelijkheid van Doel & Rollen",
    en_short: "Clarity", id_short: "Kejelasan", nl_short: "Duidelijkheid",
    en_low: "Confusion about direction", id_low: "Kebingungan tentang arah", nl_low: "Verwarring over richting",
    en_high: "Crystal clear to everyone", id_high: "Sangat jelas bagi semua orang", nl_high: "Volstrekt duidelijk voor iedereen",
    en_desc: "Everyone knows what the team is trying to achieve and what their specific contribution is. Ambiguity about purpose or role is a leading cause of quiet disengagement.",
    id_desc: "Semua orang tahu apa yang ingin dicapai tim dan apa kontribusi spesifik mereka. Ambiguitas tentang tujuan atau peran adalah penyebab utama ketidakterlibatan diam-diam.",
    nl_desc: "Iedereen weet wat het team probeert te bereiken en wat hun specifieke bijdrage is. Ambiguïteit over doel of rol is een voorname oorzaak van stille desengagement.",
    en_fix: "Write your team's purpose in one sentence. Then ask each member to write theirs independently. Compare. The gaps show you exactly what to clarify.",
    id_fix: "Tuliskan tujuan tim Anda dalam satu kalimat. Kemudian minta setiap anggota menuliskan milik mereka secara independen. Bandingkan. Celahnya menunjukkan apa yang perlu diklarifikasi.",
    nl_fix: "Schrijf het doel van je team in één zin. Vraag dan elk lid het hunne onafhankelijk te schrijven. Vergelijk. De kloven tonen je precies wat je moet verduidelijken.",
  },
  {
    en_name: "Healthy Conflict", id_name: "Konflik Sehat", nl_name: "Gezond Conflict",
    en_short: "Conflict", id_short: "Konflik", nl_short: "Conflict",
    en_low: "Silence or always destructive", id_low: "Keheningan atau selalu destruktif", nl_low: "Stilte of altijd destructief",
    en_high: "Open, ideas-only debate", id_high: "Debat terbuka, hanya tentang ide", nl_high: "Open debat, alleen over ideeën",
    en_desc: "The team can disagree on ideas without it becoming personal or political. Healthy teams fight for the best outcome. Absence of conflict is not health — it is suppression.",
    id_desc: "Tim dapat tidak setuju pada ide tanpa menjadi pribadi atau politis. Tim yang sehat berjuang untuk hasil terbaik. Ketiadaan konflik bukan kesehatan — itu penekanan.",
    nl_desc: "Het team kan het oneens zijn over ideeën zonder dat het persoonlijk of politiek wordt. Gezonde teams strijden voor het beste resultaat. Afwezigheid van conflict is geen gezondheid — het is onderdrukking.",
    en_fix: "Introduce structured disagreement: 'Before we move on, who sees a risk we haven't named?' Making conflict a named part of process lowers the personal cost of raising it.",
    id_fix: "Perkenalkan ketidaksetujuan terstruktur: 'Sebelum kita melanjutkan, siapa yang melihat risiko yang belum kita sebutkan?' Menjadikan konflik sebagai bagian bernama dari proses menurunkan biaya pribadi.",
    nl_fix: "Introduceer gestructureerde onenigheid: 'Voordat we verdergaan, wie ziet een risico dat we nog niet hebben benoemd?' Het benoemen van conflict als deel van het proces verlaagt de persoonlijke kosten.",
  },
  {
    en_name: "Accountability", id_name: "Akuntabilitas", nl_name: "Verantwoording",
    en_short: "Accountability", id_short: "Akuntabilitas", nl_short: "Verantwoording",
    en_low: "No follow-through or punitive", id_low: "Tidak ada tindak lanjut atau hukuman", nl_low: "Geen follow-through of bestraffend",
    en_high: "Clear, honest, and kind", id_high: "Jelas, jujur, dan baik", nl_high: "Helder, eerlijk en vriendelijk",
    en_desc: "People are held to clear expectations, and when those expectations are not met, it is addressed honestly and constructively. A team where no one is held accountable breeds resentment.",
    id_desc: "Orang dipegang pada harapan yang jelas, dan ketika harapan itu tidak terpenuhi, itu ditangani dengan jujur dan konstruktif. Tim tanpa akuntabilitas menimbulkan kebencian.",
    nl_desc: "Mensen worden gehouden aan duidelijke verwachtingen, en wanneer die niet worden gehaald, wordt dit eerlijk en constructief besproken. Een team zonder verantwoording kweekt wrok.",
    en_fix: "The problem is rarely that people don't want accountability — expectations were never made explicit. Start there: write three things you expect of every team member this quarter.",
    id_fix: "Masalahnya jarang bahwa orang tidak menginginkan akuntabilitas — harapan tidak pernah dibuat eksplisit. Mulailah dari sana: tuliskan tiga hal yang Anda harapkan dari setiap anggota tim.",
    nl_fix: "Het probleem is zelden dat mensen geen verantwoording willen — verwachtingen zijn nooit expliciet gemaakt. Begin daar: schrijf drie dingen op die je dit kwartaal van elk teamlid verwacht.",
  },
  {
    en_name: "Shared Celebration", id_name: "Perayaan Bersama", nl_name: "Gedeeld Vieren",
    en_short: "Celebration", id_short: "Perayaan", nl_short: "Vieren",
    en_low: "Only leader or high performers", id_low: "Hanya pemimpin atau pemain tinggi", nl_low: "Alleen leider of toppresteerders",
    en_high: "Whole team celebrates together", id_high: "Seluruh tim merayakan bersama", nl_high: "Heel team viert samen",
    en_desc: "The team celebrates together — not just the leader, not just the high performers. Shared celebration creates shared identity, and shared identity sustains teams through hard seasons.",
    id_desc: "Tim merayakan bersama — bukan hanya pemimpin, bukan hanya pemain tinggi. Perayaan bersama menciptakan identitas bersama, dan identitas bersama menopang tim melalui musim yang sulit.",
    nl_desc: "Het team viert samen — niet alleen de leider, niet alleen de toppresteerders. Gedeeld vieren creëert gedeelde identiteit, en gedeelde identiteit houdt teams staande in moeilijke tijden.",
    en_fix: "Next time your team hits a milestone, make celebration specific: name what each person contributed. Generic praise for 'the team' lands differently than hearing your own contribution named.",
    id_fix: "Lain kali tim Anda mencapai tonggak, jadikan perayaannya spesifik: sebutkan apa yang dikontribusikan setiap orang. Pujian generik berbeda artinya dari mendengar kontribusi Anda sendiri disebutkan.",
    nl_fix: "De volgende keer dat je team een mijlpaal bereikt, maak de viering specifiek: benoem wat elk persoon heeft bijgedragen. Generieke lof landt anders dan het horen van jouw eigen bijdrage.",
  },
];

const WARNING_SIGNS = [
  { en: "Conversations are cautious — people say what the leader wants to hear, not what they actually think.", id: "Percakapan berhati-hati — orang mengatakan apa yang ingin didengar pemimpin, bukan apa yang sebenarnya mereka pikirkan.", nl: "Gesprekken zijn voorzichtig — mensen zeggen wat de leider wil horen, niet wat ze werkelijk denken." },
  { en: "The best people are quietly looking for the exit — often silent before they announce they're leaving.", id: "Orang-orang terbaik diam-diam mencari jalan keluar — sering diam sebelum mereka mengumumkan kepergian mereka.", nl: "De beste mensen zoeken stilletjes naar de uitgang — vaak stil voordat ze aankondigen te vertrekken." },
  { en: "No one ever pushes back in meetings — all ideas are agreed to but not all acted upon.", id: "Tidak ada yang pernah mendorong balik dalam rapat — semua ide disetujui tetapi tidak semua dilaksanakan.", nl: "Niemand duwt ooit terug in vergaderingen — alle ideeën worden ingestemd maar niet allemaal uitgevoerd." },
  { en: "Small tensions never get fully resolved — they accumulate into factions or quiet disengagement.", id: "Ketegangan kecil tidak pernah benar-benar terselesaikan — mereka menumpuk menjadi faksi atau ketidakterlibatan diam-diam.", nl: "Kleine spanningen worden nooit volledig opgelost — ze stapelen zich op tot facties of stille desengagement." },
  { en: "The leader is the only one who seems energised — the team is executing, not co-creating.", id: "Pemimpinlah satu-satunya yang tampak bersemangat — tim sedang menjalankan, bukan mencipta bersama.", nl: "De leider is de enige die energiek lijkt — het team voert uit, creëert niet mee." },
];

type Props = { userPathway: string | null; isSaved: boolean };
export default function TeamHealthClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [scores, setScores] = useState<number[]>([5, 5, 5, 5, 5]);
  const [activeVerse, setActiveVerse] = useState<VerseKey | null>(null);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const avgScore = scores.reduce((a, b) => a + b, 0) / 5;
  const minIdx = scores.indexOf(Math.min(...scores));

  const tierColor = avgScore >= 8 ? "oklch(45% 0.14 155)" : avgScore >= 6 ? orange : avgScore >= 4 ? "oklch(58% 0.15 45)" : "oklch(52% 0.18 25)";
  const tierText = {
    en: avgScore >= 8 ? "Strong foundation — protect and keep investing."
      : avgScore >= 6 ? "Growing — real strengths and real gaps. Focus where the score is lowest."
      : avgScore >= 4 ? "Developing — this team needs intentional work."
      : "At risk — the foundations need rebuilding before the team can grow.",
    id: avgScore >= 8 ? "Fondasi yang kuat — lindungi dan terus berinvestasi."
      : avgScore >= 6 ? "Berkembang — kekuatan nyata dan kesenjangan nyata. Fokus di mana skor terendah."
      : avgScore >= 4 ? "Berkembang — tim ini membutuhkan pekerjaan yang disengaja."
      : "Berisiko — fondasi perlu dibangun kembali sebelum tim bisa berkembang.",
    nl: avgScore >= 8 ? "Sterk fundament — bescherm en blijf investeren."
      : avgScore >= 6 ? "Groeiend — echte krachten en echte hiaten. Focus waar de score het laagst is."
      : avgScore >= 4 ? "Ontwikkelend — dit team heeft bewust werk nodig."
      : "Risico — de fundamenten moeten worden herbouwd voordat het team kan groeien.",
  };

  // Pentagon SVG math
  const cx = 150, cy = 140, maxR = 90;
  const angleDeg = [-90, -18, 54, 126, 198];
  const angles = angleDeg.map(a => a * Math.PI / 180);
  const outerPts = angles.map(a => [cx + maxR * Math.cos(a), cy + maxR * Math.sin(a)]);
  const scorePts = angles.map((a, i) => {
    const r = maxR * (scores[i] / 10);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const gridPcts = [0.25, 0.5, 0.75, 1.0];
  const toPath = (pts: number[][]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";
  const labelOffset = maxR + 22;
  const labelPos = angles.map((a, i) => ({
    x: cx + labelOffset * Math.cos(a),
    y: cy + labelOffset * Math.sin(a),
    anchor: (Math.cos(a) > 0.15 ? "start" : Math.cos(a) < -0.15 ? "end" : "middle") as "start" | "end" | "middle",
    dy: Math.sin(a) > 0.4 ? 14 : Math.sin(a) < -0.4 ? -4 : 4,
  }));

  return (
    <div style={{ minHeight: "100vh", background: offWhite, fontFamily: "Montserrat, sans-serif" }}>

      {/* Language + Save bar */}
      <div style={{ background: navy, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(["en", "id", "nl"] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "6px 16px", border: "none", borderRadius: 4, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              background: lang === l ? orange : "transparent",
              color: lang === l ? offWhite : "oklch(70% 0.04 260)",
            }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={() => {
          startTransition(async () => {
            await saveResourceToDashboard("team-health");
            setSaved(true);
          });
        }} disabled={saved || isPending} style={{
          padding: "8px 20px", borderRadius: 6,
          border: `1px solid ${saved ? "oklch(70% 0.04 260)" : orange}`,
          background: "transparent", color: saved ? "oklch(70% 0.04 260)" : orange,
          fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
          cursor: saved ? "default" : "pointer",
        }}>
          {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
        </button>
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "68px 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: orange, marginBottom: 20, textTransform: "uppercase" }}>
          {t("Module 14 · Team Health", "Modul 14 · Kesehatan Tim", "Module 14 · Teamgezondheid")}
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(40px, 6vw, 70px)", fontWeight: 600, color: offWhite, margin: "0 auto 20px", maxWidth: 680, lineHeight: 1.15 }}>
          {t("How Healthy Is Your Team?", "Seberapa Sehat Tim Anda?", "Hoe Gezond is Jouw Team?")}
        </h1>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, color: "oklch(78% 0.04 260)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          {t(
            "An honest diagnosis is the most loving thing you can do for a team. Use this scan to see clearly — not to judge, but to lead better.",
            "Diagnosis yang jujur adalah hal paling penuh kasih yang dapat Anda lakukan untuk sebuah tim. Gunakan pemindai ini untuk melihat dengan jelas — bukan untuk menghakimi, tetapi untuk memimpin lebih baik.",
            "Een eerlijke diagnose is het liefdevollste wat je voor een team kunt doen. Gebruik deze scan om helder te zien — niet om te oordelen, maar om beter te leiden."
          )}
        </p>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Team Health Scan */}
        <div style={{ marginTop: 52, marginBottom: 64 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
            {t("The Scan", "Pemindaiannya", "De Scan")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 600, color: navy, marginBottom: 12, lineHeight: 1.25 }}>
            {t("Rate your team on each dimension", "Nilai tim Anda pada setiap dimensi", "Beoordeel je team op elke dimensie")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: bodyText, lineHeight: 1.7, marginBottom: 36, maxWidth: 600 }}>
            {t(
              "Score honestly — not how you wish things were, but how they actually are right now. 1 = very low, 10 = excellent.",
              "Nilai dengan jujur — bukan bagaimana Anda ingin keadaannya, tetapi bagaimana sebenarnya saat ini. 1 = sangat rendah, 10 = sangat baik.",
              "Scoor eerlijk — niet zoals je wil dat het is, maar zoals het werkelijk is. 1 = zeer laag, 10 = uitstekend."
            )}
          </p>

          {/* Sliders + pentagon side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" }}>

            {/* Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {DIMENSIONS.map((dim, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: i === minIdx ? "oklch(45% 0.12 25)" : navy, margin: 0 }}>
                      {tFn(dim.en_name, dim.id_name, dim.nl_name, lang)}
                      {i === minIdx && <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "oklch(55% 0.12 25)", marginLeft: 8, textTransform: "uppercase" }}>
                        {t("focus area", "area fokus", "aandachtsgebied")}
                      </span>}
                    </p>
                    <span style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, color: orange, lineHeight: 1 }}>
                      {scores[i]}
                    </span>
                  </div>
                  <input type="range" min={1} max={10} step={1} value={scores[i]}
                    onChange={e => {
                      const next = [...scores];
                      next[i] = Number(e.target.value);
                      setScores(next);
                    }}
                    style={{ width: "100%", accentColor: orange, cursor: "pointer", margin: "4px 0 6px" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "oklch(55% 0.08 25)", fontStyle: "italic" }}>
                      {tFn(dim.en_low, dim.id_low, dim.nl_low, lang)}
                    </span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "oklch(42% 0.12 155)", fontStyle: "italic" }}>
                      {tFn(dim.en_high, dim.id_high, dim.nl_high, lang)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pentagon chart + overall */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <svg viewBox="0 0 300 280" style={{ width: "100%", maxWidth: 300 }}>
                {gridPcts.map((pct, gi) => {
                  const pts = angles.map(a => [cx + maxR * pct * Math.cos(a), cy + maxR * pct * Math.sin(a)]);
                  return <path key={gi} d={toPath(pts)} fill="none" stroke="oklch(86% 0.008 80)" strokeWidth="1" />;
                })}
                {outerPts.map(([x, y], i) => (
                  <line key={i} x1={cx} y1={cy} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="oklch(86% 0.008 80)" strokeWidth="1" />
                ))}
                <path d={toPath(scorePts)} fill="oklch(65% 0.15 45 / 0.18)" stroke={orange} strokeWidth="2.5" strokeLinejoin="round" />
                {scorePts.map(([x, y], i) => (
                  <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="5" fill={orange} />
                ))}
                {labelPos.map((lp, i) => (
                  <text key={i} x={lp.x.toFixed(1)} y={(lp.y + lp.dy).toFixed(1)} textAnchor={lp.anchor}
                    style={{ fontFamily: "Montserrat, sans-serif", fontSize: "8.5px", fontWeight: 700, fill: i === minIdx ? "oklch(45% 0.12 25)" : navy, letterSpacing: "0.06em" }}>
                    {tFn(DIMENSIONS[i].en_short, DIMENSIONS[i].id_short, DIMENSIONS[i].nl_short, lang).toUpperCase()}
                  </text>
                ))}
              </svg>

              {/* Score card */}
              <div style={{ padding: "20px 28px", background: navy, borderRadius: 12, textAlign: "center", width: "100%", boxSizing: "border-box" as const }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", margin: "0 0 6px" }}>
                  {t("Overall Health", "Kesehatan Keseluruhan", "Algehele Gezondheid")}
                </p>
                <p style={{ fontFamily: serif, fontSize: 48, fontWeight: 700, color: tierColor, lineHeight: 1, margin: "0 0 10px" }}>
                  {avgScore.toFixed(1)}
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "oklch(80% 0.03 260)", lineHeight: 1.6, margin: 0 }}>
                  {tFn(tierText.en, tierText.id, tierText.nl, lang)}
                </p>
              </div>
            </div>
          </div>

          {/* Targeted insight for lowest */}
          <div style={{ marginTop: 32, padding: "24px 28px", background: lightGray, borderRadius: 12 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", margin: "0 0 8px" }}>
              {t("Lowest Score — Start Here", "Skor Terendah — Mulai di Sini", "Laagste Score — Begin Hier")}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: navy, margin: "0 0 8px" }}>
              {tFn(DIMENSIONS[minIdx].en_name, DIMENSIONS[minIdx].id_name, DIMENSIONS[minIdx].nl_name, lang)}: {scores[minIdx]}/10
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: bodyText, lineHeight: 1.75, margin: "0 0 14px" }}>
              {tFn(DIMENSIONS[minIdx].en_desc, DIMENSIONS[minIdx].id_desc, DIMENSIONS[minIdx].nl_desc, lang)}
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "oklch(35% 0.10 155)", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "oklch(35% 0.12 155)" }}>{t("One practical step: ", "Satu langkah praktis: ", "Één praktische stap: ")}</strong>
              <em>{tFn(DIMENSIONS[minIdx].en_fix, DIMENSIONS[minIdx].id_fix, DIMENSIONS[minIdx].nl_fix, lang)}</em>
            </p>
          </div>
        </div>

        {/* Warning Signs */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
            {t("Warning Signs", "Tanda Peringatan", "Waarschuwingssignalen")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 600, color: navy, marginBottom: 20, lineHeight: 1.3 }}>
            {t("What unhealthy looks like — before it becomes a crisis", "Seperti apa tidak sehat — sebelum menjadi krisis", "Hoe ongezond eruitziet — voordat het een crisis wordt")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {WARNING_SIGNS.map((ws, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "14px 20px", background: lightGray, borderRadius: 8, alignItems: "flex-start" }}>
                <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: "oklch(60% 0.12 25)", lineHeight: 1.3, minWidth: 16, flexShrink: 0 }}>!</span>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                  {tFn(ws.en, ws.id, ws.nl, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Biblical Foundation */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
            {t("Biblical Foundation", "Dasar Alkitabiah", "Bijbelse Basis")}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 600, color: navy, marginBottom: 20, lineHeight: 1.25 }}>
            {t("The Body, Not Just a Team", "Tubuh, Bukan Sekadar Tim", "Het Lichaam, Niet Slechts een Team")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, color: bodyText, lineHeight: 1.8, maxWidth: 680, marginBottom: 28 }}>
            {t(
              "Paul's image of the church as a body is not just a metaphor for good teamwork. It is a theological claim: teams are not assembled for efficiency — they are assembled by God for mutual belonging, mutual service, and shared witness. The health of your team is a Kingdom matter. When it breaks down, something of the witness of God's character is diminished.",
              "Gambaran Paulus tentang gereja sebagai tubuh bukan sekadar metafora untuk kerja tim yang baik. Ini adalah klaim teologis: tim tidak dirakit untuk efisiensi — mereka dirakit oleh Allah untuk kepemilikan bersama, pelayanan bersama, dan kesaksian bersama. Kesehatan tim Anda adalah masalah Kerajaan.",
              "Paulus' beeld van de kerk als een lichaam is niet slechts een metafoor voor goed teamwerk. Het is een theologische claim: teams worden niet samengesteld voor efficiëntie — ze worden door God samengesteld voor wederzijdse verbondenheid en gedeeld getuigenis. De gezondheid van je team is een Koninkrijkszaak."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {(["1cor-12-12", "eph-4-3"] as VerseKey[]).map(vKey => {
              const v = VERSES[vKey];
              return (
                <div key={vKey} style={{ padding: "28px 28px", background: lightGray, borderRadius: 10 }}>
                  <p style={{ fontFamily: serif, fontSize: 19, fontStyle: "italic", color: navy, lineHeight: 1.7, marginBottom: 16 }}>
                    "{lang === "en" ? v.en : lang === "id" ? v.id : v.nl}"
                  </p>
                  <button onClick={() => setActiveVerse(vKey)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
                    color: orange, letterSpacing: "0.08em", textDecoration: "underline dotted", padding: 0,
                  }}>
                    {lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reflection */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 16 }}>
            {t("Reflection", "Refleksi", "Reflectie")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {([
              {
                roman: "I",
                en: "On the 5 dimensions, where does your team score highest? Where does it most need attention?",
                id: "Pada 5 dimensi, di mana tim Anda mendapat skor tertinggi? Di mana itu paling membutuhkan perhatian?",
                nl: "Op de 5 dimensies, waar scoort je team het hoogst? Waar heeft het het meest aandacht nodig?",
              },
              {
                roman: "II",
                en: "Does your team have genuine psychological safety? What specific evidence do you have?",
                id: "Apakah tim Anda memiliki keamanan psikologis yang tulus? Bukti spesifik apa yang Anda miliki?",
                nl: "Heeft je team echte psychologische veiligheid? Welk specifiek bewijs heb je?",
              },
              {
                roman: "III",
                en: "What would your team say if asked anonymously: 'Does our leader model the health they call us to?'",
                id: "Apa yang akan dikatakan tim Anda jika ditanya secara anonim: 'Apakah pemimpin kami mencontohkan kesehatan yang mereka serukan kepada kami?'",
                nl: "Wat zou je team zeggen als anoniem gevraagd: 'Modelleert onze leider de gezondheid waartoe ze ons oproepen?'",
              },
            ] as { roman: string; en: string; id: string; nl: string }[]).map(q => (
              <div key={q.roman} style={{ display: "flex", gap: 18, padding: "18px 22px", background: lightGray, borderRadius: 10, alignItems: "flex-start" }}>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: orange, minWidth: 26, flexShrink: 0, lineHeight: 1.2 }}>{q.roman}</span>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {tFn(q.en, q.id, q.nl, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment */}
        <div style={{ padding: "40px", background: lightGray, borderRadius: 16, marginBottom: 52 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: orange, textTransform: "uppercase", marginBottom: 12 }}>
            {t("Your Commitment", "Komitmen Anda", "Jouw Verbintenis")}
          </p>
          <p style={{ fontFamily: serif, fontSize: 22, color: navy, lineHeight: 1.6, marginBottom: 24, fontStyle: "italic" }}>
            {t(
              "Based on this scan — what is the one thing you will do differently this month as a team leader?",
              "Berdasarkan pemindaian ini — apa satu hal yang akan Anda lakukan secara berbeda bulan ini sebagai pemimpin tim?",
              "Op basis van deze scan — wat is het ene dat je deze maand als teamleider anders zult doen?"
            )}
          </p>
          {!committed ? (
            <>
              <textarea value={commitment} onChange={e => setCommitment(e.target.value)}
                placeholder={t("Write your commitment here...", "Tuliskan komitmen Anda di sini...", "Schrijf hier je verbintenis...")}
                style={{
                  width: "100%", minHeight: 100, padding: "16px",
                  border: "1px solid oklch(80% 0.012 80)", borderRadius: 8,
                  fontFamily: "Montserrat, sans-serif", fontSize: 14, color: bodyText,
                  background: offWhite, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
                }} />
              <button onClick={() => { if (commitment.trim()) setCommitted(true); }} disabled={!commitment.trim()} style={{
                marginTop: 14, padding: "12px 28px",
                background: commitment.trim() ? navy : "oklch(80% 0.01 80)",
                color: offWhite, border: "none", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                cursor: commitment.trim() ? "pointer" : "default",
              }}>
                {t("I'm Committing to This", "Saya Berkomitmen pada Ini", "Hier Verbind Ik Mij Aan")}
              </button>
            </>
          ) : (
            <div style={{ padding: "22px 26px", background: offWhite, borderRadius: 10, border: "1px solid oklch(88% 0.008 80)" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: orange, textTransform: "uppercase", marginBottom: 8 }}>
                {t("Noted", "Tercatat", "Genoteerd")}
              </p>
              <p style={{ fontFamily: serif, fontSize: 19, color: navy, fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>
                "{commitment}"
              </p>
            </div>
          )}
        </div>

        {/* Back */}
        <div style={{ textAlign: "center" }}>
          <Link href="/resources" style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
            color: navy, textDecoration: "none", letterSpacing: "0.08em",
            padding: "12px 28px", border: `2px solid ${navy}`, borderRadius: 6, display: "inline-block",
          }}>
            {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
          </Link>
        </div>
      </div>

      {/* Verse popup */}
      {activeVerse && (
        <div onClick={() => setActiveVerse(null)} style={{
          position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: offWhite, borderRadius: 16, padding: "40px 36px", maxWidth: 520, width: "100%",
          }}>
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.65, color: navy, fontStyle: "italic", marginBottom: 16 }}>
              "{lang === "en" ? VERSES[activeVerse].en : lang === "id" ? VERSES[activeVerse].id : VERSES[activeVerse].nl}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 24 }}>
              — {lang === "en" ? VERSES[activeVerse].en_ref : lang === "id" ? VERSES[activeVerse].id_ref : VERSES[activeVerse].nl_ref} {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <button onClick={() => setActiveVerse(null)} style={{
              padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6,
              fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer",
            }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
