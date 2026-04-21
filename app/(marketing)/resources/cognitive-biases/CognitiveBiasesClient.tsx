"use client";
import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

type BiasCategory = "memory" | "social" | "learning" | "belief" | "money" | "politics";

type Bias = {
  name: string;
  category: BiasCategory;
  crossCulturalNote: string;
};

const CATEGORY_META: Record<BiasCategory, { en: string; id: string; nl: string; color: string }> = {
  memory:   { en: "Memory",   id: "Memori",   nl: "Geheugen",  color: "oklch(62% 0.12 220)" },
  social:   { en: "Social",   id: "Sosial",   nl: "Sociaal",   color: "oklch(48% 0.14 260)" },
  learning: { en: "Learning", id: "Belajar",  nl: "Leren",     color: "oklch(62% 0.14 80)"  },
  belief:   { en: "Belief",   id: "Keyakinan",nl: "Overtuiging",color: "oklch(55% 0.16 25)"  },
  money:    { en: "Money",    id: "Keuangan", nl: "Geld",       color: "oklch(52% 0.14 145)" },
  politics: { en: "Politics", id: "Politik",  nl: "Politiek",  color: "oklch(62% 0.14 45)"  },
};

const BIASES: Bias[] = [
  // Memory
  { name: "Availability Heuristic",          category: "memory",   crossCulturalNote: "Leaders judge an entire region's potential based on one recent, high-profile story rather than representative data." },
  { name: "Forer Effect (Barnum Effect)",     category: "memory",   crossCulturalNote: "Vague cultural assessments like 'this culture is collective' feel personally accurate but are too general to guide real decisions." },
  { name: "Google Effect (Digital Amnesia)",  category: "memory",   crossCulturalNote: "Leaders who look up local customs on demand rather than internalising them appear detached or disrespectful to local staff." },
  { name: "Availability Cascade",             category: "memory",   crossCulturalNote: "Repeated negative tropes about a culture at HQ harden into 'fact' through sheer repetition, distorting a leader's expectations before they even arrive." },
  { name: "Tachypsychia",                     category: "memory",   crossCulturalNote: "Under cross-border negotiation stress, a leader may perceive a culturally normal silence as far longer and more hostile than it actually is." },
  { name: "Zeigarnik Effect",                 category: "memory",   crossCulturalNote: "Preoccupation with unfinished home-office tasks distracts a leader from building the slow, patient relationships required in relationship-oriented cultures." },
  { name: "Suggestibility",                   category: "memory",   crossCulturalNote: "A leader may unconsciously alter their memory of a meeting to match later 'cultural insights' from a consultant, skewing future strategy." },
  { name: "False Memory",                     category: "memory",   crossCulturalNote: "A leader might 'remember' a local partner agreeing to terms that were never explicitly stated, creating trust-breaking moments when expectations aren't met." },
  { name: "Cryptomnesia",                     category: "memory",   crossCulturalNote: "A leader may unknowingly present a local employee's culturally-specific idea as their own, damaging morale and local ownership." },
  // Social
  { name: "Fundamental Attribution Error",    category: "social",   crossCulturalNote: "Leaders blame a local employee's character for a missed deadline rather than considering situational factors like local infrastructure or public holidays." },
  { name: "Self-Serving Bias",                category: "social",   crossCulturalNote: "Leaders credit their own 'global mindset' for project success while blaming 'local cultural resistance' for failure." },
  { name: "In-Group Favoritism",              category: "social",   crossCulturalNote: "Leaders unintentionally offer better assignments or mentoring to expats from their home country rather than to equally capable local talent." },
  { name: "Halo Effect",                      category: "social",   crossCulturalNote: "If a local manager speaks the leader's language fluently, the leader incorrectly assumes equal competence in all other areas." },
  { name: "Moral Luck",                       category: "social",   crossCulturalNote: "A leader judges a local manager's character based on outcomes shaped by local market volatility or political instability outside that manager's control." },
  { name: "False Consensus",                  category: "social",   crossCulturalNote: "Leaders assume their 'universal' management style is desired everywhere, failing to recognise that local teams may prefer fundamentally different leadership behaviour." },
  { name: "Spotlight Effect",                 category: "social",   crossCulturalNote: "Expat leaders overthink their cultural gaffes, believing the local team is constantly judging them — creating unnecessary anxiety and social distance." },
  { name: "Defensive Attribution",            category: "social",   crossCulturalNote: "When accidents occur in a foreign branch, leaders may blame local teams more harshly because they feel less similar to them." },
  { name: "Just-World Hypothesis",            category: "social",   crossCulturalNote: "Leaders assume a struggling local office simply isn't working hard enough, ignoring systemic inequalities or historical disadvantages in that region." },
  { name: "Naïve Realism",                    category: "social",   crossCulturalNote: "Leaders believe their business perspective is objective and that local dissent reflects bias — not a legitimately different, equally valid view." },
  { name: "Naïve Cynicism",                   category: "social",   crossCulturalNote: "Leaders dismiss a local partner's emphasis on relationship-building as self-interest, missing the deep cultural value of concepts like guanxi or wasta." },
  { name: "Dunning-Kruger Effect",            category: "social",   crossCulturalNote: "After one trip to a new country, a leader believes they are now a cultural expert — leading to overconfident and often costly decisions." },
  { name: "Third-Person Effect",              category: "social",   crossCulturalNote: "Leaders believe their local teams are susceptible to cultural bias while remaining convinced they themselves are immune." },
  { name: "Stereotyping",                     category: "social",   crossCulturalNote: "Leaders expect a local employee to behave like a cultural archetype, missing the individual's unique strengths and personality." },
  { name: "Outgroup Homogeneity Bias",        category: "social",   crossCulturalNote: "Leaders treat 'the Asian team' as a monolithic group, ignoring the vast cultural differences between nationalities, subcultures, and generations." },
  { name: "Ben Franklin Effect",              category: "social",   crossCulturalNote: "Asking a local peer for a small favour can increase their investment in the partnership — a useful tool for building cross-cultural trust." },
  { name: "Bystander Effect",                 category: "social",   crossCulturalNote: "In a multicultural HQ, leaders fail to address subtle discrimination, assuming someone in the Diversity department will handle it." },
  { name: "Blind Spot Bias",                  category: "social",   crossCulturalNote: "Leaders readily identify cultural biases in their local staff while remaining blind to their own ethnocentrism." },
  // Learning
  { name: "Curse of Knowledge",               category: "learning", crossCulturalNote: "HQ experts can't explain processes clearly to local teams because they've forgotten what it's like not to have 10 years of institutional context." },
  { name: "Anchoring",                        category: "learning", crossCulturalNote: "A leader fixates on the first cost estimate from a local vendor, failing to recalibrate even as more reliable market data becomes available." },
  { name: "Declinism",                        category: "learning", crossCulturalNote: "Leaders compare every foreign market to a nostalgic 'golden era' of expansion, failing to see fresh opportunities in the current landscape." },
  { name: "Status Quo Bias",                  category: "learning", crossCulturalNote: "Leaders resist adapting proven home-country strategies to local needs, preferring the familiar over the effective." },
  { name: "Framing Effect",                   category: "learning", crossCulturalNote: "A local team's response to the same proposal shifts entirely based on whether it's framed as a gain or a loss — cultural context amplifies this further." },
  { name: "Survivorship Bias",                category: "learning", crossCulturalNote: "Leaders study only the few successful multinational entries in a region, missing the majority of failures that would teach them what not to do." },
  { name: "Clustering Illusion",              category: "learning", crossCulturalNote: "Two or three coincidental sales in a new market get interpreted as a trend, prompting premature and costly scaling." },
  { name: "Pessimism Bias",                   category: "learning", crossCulturalNote: "Leaders overestimate political or economic instability in developing markets, causing the company to miss early-mover advantages." },
  { name: "Optimism Bias",                    category: "learning", crossCulturalNote: "Leaders underestimate the time needed to navigate local bureaucracies, leading to missed deadlines and significant budget overruns." },
  // Belief
  { name: "Bandwagon Effect",                 category: "belief",   crossCulturalNote: "A leader enters a popular 'emerging market' because competitors are doing so — without a real strategic fit for their specific mission or organisation." },
  { name: "Automation Bias",                  category: "belief",   crossCulturalNote: "Over-reliance on standardised HR software causes leaders to miss high-potential local candidates who don't fit a Western-built algorithm of success." },
  { name: "Reactance",                        category: "belief",   crossCulturalNote: "If HQ rules are imposed too aggressively, local employees feel their autonomy is threatened and may intentionally undermine the new policies." },
  { name: "Confirmation Bias",                category: "belief",   crossCulturalNote: "Leaders notice only information that supports existing cultural stereotypes while filtering out evidence that would challenge them." },
  { name: "Backfire Effect",                  category: "belief",   crossCulturalNote: "When a leader presents data to disprove a local team's long-held business practice, it can actually strengthen their resolve to keep doing it." },
  { name: "Belief Bias",                      category: "belief",   crossCulturalNote: "Leaders accept a weak business case from a local partner simply because the final conclusion aligns with their own cultural assumptions." },
  { name: "Authority Bias",                   category: "belief",   crossCulturalNote: "In high-power-distance cultures, a leader receives only agreement — honest, necessary dissent is withheld from anyone holding a senior title." },
  { name: "Placebo Effect",                   category: "belief",   crossCulturalNote: "A leader believes a new cross-cultural training program is working simply because money was spent on it, even when team behaviour is unchanged." },
  // Money
  { name: "Sunk Cost Fallacy",                category: "money",    crossCulturalNote: "Leaders continue pouring resources into a failing foreign subsidiary because they've invested too much ego and time to admit the strategy isn't working." },
  { name: "Gambler's Fallacy",                category: "money",    crossCulturalNote: "After several failed product launches in a new region, a leader believes they're 'due' for a win rather than addressing root causes." },
  { name: "Zero-Risk Bias",                   category: "money",    crossCulturalNote: "Leaders waste resources eliminating minor local risks while ignoring larger, more significant threats that carry greater long-term cost." },
  { name: "IKEA Effect",                      category: "money",    crossCulturalNote: "A leader overvalues a business plan they helped create, dismissing superior, more culturally-nuanced suggestions from local managers." },
  // Politics
  { name: "Groupthink",                       category: "politics", crossCulturalNote: "An expat leadership team isolates from local advice to maintain internal harmony, producing out-of-touch strategic decisions that locals could have prevented." },
  { name: "Law of Triviality",                category: "politics", crossCulturalNote: "A cross-cultural team spends hours debating slogan translation while ignoring major flaws in the underlying distribution or go-to-market model." },
];

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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<BiasCategory | "all">("all");
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("cognitive-biases");
      setSaved(true);
    });
  }

  const filteredBiases = useMemo(() => {
    return BIASES.filter(b => {
      const matchesCat = activeCategory === "all" || b.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.crossCulturalNote.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      {/* Lang bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
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

      {/* Intro */}
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

      {/* ── 50-BIAS SEARCHABLE LIBRARY ── */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("Reference Library", "Perpustakaan Referensi", "Naslagbibliotheek")}
            </p>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: navy, marginBottom: 12 }}>
              {t("50 Biases — Cross-Cultural Impact", "50 Bias — Dampak Lintas Budaya", "50 Biases — Interculturele Impact")}
            </h2>
            <p style={{ color: bodyText, fontSize: 15, maxWidth: 560, margin: "0 auto" }}>
              {t(
                "Each bias below includes a specific note on how it shows up in cross-cultural leadership contexts.",
                "Setiap bias di bawah ini mencakup catatan khusus tentang bagaimana ia muncul dalam konteks kepemimpinan lintas budaya.",
                "Elke bias bevat een specifieke noot over hoe het zich manifesteert in interculturele leiderschapscontexten."
              )}
            </p>
          </div>

          {/* Search bar */}
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("Search biases…", "Cari bias…", "Zoek biases…")}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "0.75rem 1rem",
              border: "1px solid oklch(82% 0.008 80)",
              background: offWhite,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              color: navy,
              marginBottom: "1.25rem",
              outline: "none",
            }}
          />

          {/* Category filter */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setActiveCategory("all")}
              style={{ padding: "0.375rem 1rem", border: "1px solid", borderColor: activeCategory === "all" ? navy : "oklch(82% 0.008 80)", background: activeCategory === "all" ? navy : "transparent", color: activeCategory === "all" ? offWhite : bodyText, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}
            >
              {t("All", "Semua", "Alle")} ({BIASES.length})
            </button>
            {(Object.entries(CATEGORY_META) as [BiasCategory, typeof CATEGORY_META[BiasCategory]][]).map(([key, meta]) => {
              const count = BIASES.filter(b => b.category === key).length;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{ padding: "0.375rem 1rem", border: "1px solid", borderColor: isActive ? meta.color : "oklch(82% 0.008 80)", background: isActive ? meta.color : "transparent", color: isActive ? offWhite : bodyText, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}
                >
                  {lang === "en" ? meta.en : lang === "id" ? meta.id : meta.nl} ({count})
                </button>
              );
            })}
          </div>

          {/* Result count */}
          <p style={{ fontSize: 12, color: "oklch(55% 0.008 260)", marginBottom: "1.5rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {t(`Showing ${filteredBiases.length} of ${BIASES.length}`, `Menampilkan ${filteredBiases.length} dari ${BIASES.length}`, `Toont ${filteredBiases.length} van ${BIASES.length}`)}
          </p>

          {/* Cards grid */}
          {filteredBiases.length === 0 ? (
            <p style={{ textAlign: "center", color: bodyText, padding: "3rem 0" }}>
              {t("No biases match your search.", "Tidak ada bias yang cocok.", "Geen biases gevonden.")}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filteredBiases.map(bias => {
                const catMeta = CATEGORY_META[bias.category];
                return (
                  <div
                    key={bias.name}
                    style={{ background: offWhite, border: "1px solid oklch(90% 0.008 80)", padding: "1.125rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13, color: navy, margin: 0, lineHeight: 1.3 }}>
                        {bias.name}
                      </p>
                      <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: offWhite, background: catMeta.color, padding: "2px 7px" }}>
                        {lang === "en" ? catMeta.en : lang === "id" ? catMeta.id : catMeta.nl}
                      </span>
                    </div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12.5, color: bodyText, lineHeight: 1.65, margin: 0 }}>
                      {bias.crossCulturalNote}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6 Editorial deep-dives */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("6 Patterns Worth Understanding Deeply", "6 Pola yang Layak Dipahami Mendalam", "6 Patronen die Diep Begrip Verdienen")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("These six show up most often — and most destructively — in cross-cultural teams.", "Enam ini paling sering muncul — dan paling destruktif — dalam tim lintas budaya.", "Deze zes komen het vaakst voor — en het meest destructief — in interculturele teams.")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {biasCategories.map((b) => (
              <div key={b.number} style={{ background: lightGray, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
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

      {/* Counter strategies */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
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
      </div>

      {/* Reflection questions */}
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

      {/* Footer CTA */}
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
