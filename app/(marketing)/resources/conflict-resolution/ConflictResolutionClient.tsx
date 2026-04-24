"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const VERSES = {
  "rom-12-18": {
    en_ref: "Romans 12:18", id_ref: "Roma 12:18", nl_ref: "Romeinen 12:18",
    en: "If it is possible, as far as it depends on you, live at peace with everyone.",
    id: "Sedapat-dapatnya, kalau hal itu bergantung padamu, hiduplah dalam perdamaian dengan semua orang.",
    nl: "Span je, voor zover het in uw macht ligt, in voor de vrede met alle mensen.",
  },
  "matt-5-9": {
    en_ref: "Matthew 5:9", id_ref: "Matius 5:9", nl_ref: "Matteüs 5:9",
    en: "Blessed are the peacemakers, for they will be called children of God.",
    id: "Berbahagialah orang yang membawa damai, karena mereka akan disebut anak-anak Allah.",
    nl: "Gelukkig de vredestichters, want zij zullen kinderen van God genoemd worden.",
  },
};

type ModeKey = "competing" | "collaborating" | "compromising" | "avoiding" | "accommodating";

const MODES: {
  key: ModeKey;
  color: string;
  colorBg: string;
  top: string;
  left: string;
  en_label: string;
  id_label: string;
  nl_label: string;
  en_tagline: string;
  id_tagline: string;
  nl_tagline: string;
  en_desc: string;
  id_desc: string;
  nl_desc: string;
  en_when: string;
  id_when: string;
  nl_when: string;
  en_cross: string;
  id_cross: string;
  nl_cross: string;
  en_cultures: string;
  id_cultures: string;
  nl_cultures: string;
  en_tip: string;
  id_tip: string;
  nl_tip: string;
}[] = [
  {
    key: "competing",
    color: "oklch(52% 0.18 25)",
    colorBg: "oklch(52% 0.18 25 / 0.10)",
    top: "10%", left: "10%",
    en_label: "Competing",
    id_label: "Bersaing",
    nl_label: "Concurreren",
    en_tagline: "Win-lose · High assertiveness, low cooperation",
    id_tagline: "Menang-kalah · Asertivitas tinggi, kerja sama rendah",
    nl_tagline: "Win-verlies · Hoge assertiviteit, lage samenwerking",
    en_desc: "You pursue your own goals at the expense of others. Positional, direct, and willing to use authority or argument to prevail. The fastest style — but it costs relationship capital.",
    id_desc: "Anda mengejar tujuan Anda sendiri dengan mengorbankan orang lain. Posisional, langsung, dan bersedia menggunakan otoritas atau argumen untuk menang. Gaya tercepat — tetapi menghabiskan modal hubungan.",
    nl_desc: "Je streeft je eigen doelen na ten koste van anderen. Positioneel, direct, en bereid gezag of argument te gebruiken om te winnen. De snelste stijl — maar het kost relatiekapitaal.",
    en_when: "When quick decisions are critical, when a position genuinely needs defending, or when someone is exploiting non-competing behaviour.",
    id_when: "Ketika keputusan cepat sangat penting, ketika posisi perlu benar-benar dipertahankan, atau ketika seseorang mengeksploitasi perilaku tidak bersaing.",
    nl_when: "Wanneer snelle beslissingen kritiek zijn, wanneer een positie echt verdedigd moet worden, of wanneer iemand niet-competitief gedrag uitbuit.",
    en_cross: "In high-context, honour-oriented cultures — much of Asia, the Middle East, Africa — competing registers as aggressive and disrespectful, damaging the relationship permanently. What feels decisive to a Northern European may feel like an attack in Southeast Asia.",
    id_cross: "Dalam budaya high-context yang berorientasi kehormatan — banyak Asia, Timur Tengah, Afrika — bersaing terasa agresif dan tidak hormat, merusak hubungan secara permanen. Yang terasa tegas bagi orang Eropa Utara mungkin terasa seperti serangan di Asia Tenggara.",
    nl_cross: "In high-context, eer-georiënteerde culturen — groot deel van Azië, Midden-Oosten, Afrika — voelt concurreren agressief en respectloos aan, wat de relatie permanent beschadigt. Wat beslissend aanvoelt voor een Noord-Europeaan kan in Zuidoost-Azië aanvoelen als een aanval.",
    en_cultures: "More natural in: Northern Europe, North America, parts of East Asia (competitive business contexts). Feels foreign or threatening in: Southeast Asia, Sub-Saharan Africa, Latin America.",
    id_cultures: "Lebih alami di: Eropa Utara, Amerika Utara, sebagian Asia Timur (konteks bisnis kompetitif). Terasa asing atau mengancam di: Asia Tenggara, Afrika Sub-Sahara, Amerika Latin.",
    nl_cultures: "Meer natuurlijk in: Noord-Europa, Noord-Amerika, delen van Oost-Azië. Voelt vreemd of bedreigend in: Zuidoost-Azië, Sub-Sahara Afrika, Latijns-Amerika.",
    en_tip: "If this is not your natural style, practise it in lower-stakes situations first — disagreeing in a meeting when you're sure of your ground, or defending a position one step further than you normally would.",
    id_tip: "Jika ini bukan gaya alami Anda, praktikkan dalam situasi berrisiko lebih rendah terlebih dahulu — tidak setuju dalam rapat ketika Anda yakin, atau mempertahankan posisi satu langkah lebih jauh dari biasanya.",
    nl_tip: "Als dit niet je natuurlijke stijl is, oefen het dan eerst in situaties met lagere inzet — het oneens zijn in een vergadering wanneer je zeker bent van je zaak, of een positie één stap verder verdedigen dan normaal.",
  },
  {
    key: "collaborating",
    color: "oklch(45% 0.14 155)",
    colorBg: "oklch(45% 0.14 155 / 0.10)",
    top: "10%", left: "75%",
    en_label: "Collaborating",
    id_label: "Berkolaborasi",
    nl_label: "Samenwerken",
    en_tagline: "Win-win · High assertiveness, high cooperation",
    id_tagline: "Menang-menang · Asertivitas tinggi, kerja sama tinggi",
    nl_tagline: "Win-win · Hoge assertiviteit, hoge samenwerking",
    en_desc: "Both parties' concerns are fully explored and addressed. Requires honesty and openness from all sides. The ideal outcome — but also the most time-intensive and relationship-dependent style.",
    id_desc: "Kekhawatiran kedua pihak dieksplorasi dan ditangani sepenuhnya. Membutuhkan kejujuran dan keterbukaan dari semua pihak. Hasil ideal — tetapi juga gaya yang paling intensif waktu dan bergantung pada hubungan.",
    nl_desc: "De zorgen van beide partijen worden volledig onderzocht en aangepakt. Vereist eerlijkheid en openheid van alle kanten. Het ideale resultaat — maar ook de meest tijdsintensieve en relatieafhankelijke stijl.",
    en_when: "When both parties' interests are important, when long-term relationship requires trust repair, or when full buy-in is needed for implementation.",
    id_when: "Ketika kepentingan kedua pihak penting, ketika hubungan jangka panjang memerlukan perbaikan kepercayaan, atau ketika dukungan penuh diperlukan untuk implementasi.",
    nl_when: "Wanneer de belangen van beide partijen belangrijk zijn, wanneer langdurige relaties vertrouwensherstel vereisen, of wanneer volledige inzet nodig is voor uitvoering.",
    en_cross: "Collaboration requires both parties to openly state their real interests — something that's difficult or inappropriate in many high-context cultures where direct disclosure of needs feels presumptuous. True collaboration in cross-cultural teams may need to happen indirectly: through a facilitator, over time, or via smaller trust-building steps.",
    id_cross: "Kolaborasi mengharuskan kedua pihak untuk secara terbuka menyatakan kepentingan nyata mereka — sesuatu yang sulit atau tidak pantas dalam banyak budaya high-context di mana pengungkapan langsung kebutuhan terasa sok. Kolaborasi sejati dalam tim lintas budaya mungkin perlu terjadi secara tidak langsung.",
    nl_cross: "Samenwerken vereist dat beide partijen hun echte belangen openlijk uiten — iets wat moeilijk of ongepast is in veel high-context culturen waar directe openbaring van behoeften aanmatigend aanvoelt. Echte samenwerking in interculturele teams moet mogelijk indirect gebeuren.",
    en_cultures: "More natural in: Scandinavia, Canada, some Latin American contexts (when relationship is strong). Challenging in: high power-distance contexts where openly stating interests to a superior feels inappropriate.",
    id_cultures: "Lebih alami di: Skandinavia, Kanada, beberapa konteks Amerika Latin (ketika hubungan kuat). Menantang di: konteks jarak kekuasaan tinggi di mana menyatakan kepentingan kepada atasan terasa tidak pantas.",
    nl_cultures: "Meer natuurlijk in: Scandinavië, Canada, sommige Latijns-Amerikaanse contexten. Uitdagend in: hoge machtafstandscontexten waar het openlijk uiten van belangen naar een leidinggevende ongepast aanvoelt.",
    en_tip: "If collaboration is not flowing naturally, lower the formality first — have the conversation during a meal, a walk, or in a relaxed setting. Formal settings inhibit the openness that collaboration needs.",
    id_tip: "Jika kolaborasi tidak mengalir secara alami, turunkan formalitas terlebih dahulu — lakukan percakapan selama makan, berjalan, atau dalam suasana santai. Pengaturan formal menghambat keterbukaan yang dibutuhkan kolaborasi.",
    nl_tip: "Als samenwerken niet van nature vloeit, verlaag dan eerst de formaliteit — voer het gesprek tijdens een maaltijd, een wandeling, of in een ontspannen omgeving. Formele settings belemmeren de openheid die samenwerking nodig heeft.",
  },
  {
    key: "compromising",
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.10)",
    top: "47%", left: "43%",
    en_label: "Compromising",
    id_label: "Berkompromi",
    nl_label: "Compromissen Sluiten",
    en_tagline: "Partial win · Medium assertiveness, medium cooperation",
    id_tagline: "Menang sebagian · Asertivitas sedang, kerja sama sedang",
    nl_tagline: "Gedeeltelijke winst · Middelmatige assertiviteit en samenwerking",
    en_desc: "Both parties give something up to reach a middle ground. Faster than collaborating, fairer than competing. No one is fully satisfied — but the conflict is resolved.",
    id_desc: "Kedua pihak menyerahkan sesuatu untuk mencapai jalan tengah. Lebih cepat dari berkolaborasi, lebih adil dari bersaing. Tidak ada yang sepenuhnya puas — tetapi konfliknya diselesaikan.",
    nl_desc: "Beide partijen geven iets op om een middenweg te bereiken. Sneller dan samenwerken, eerlijker dan concurreren. Niemand is volledig tevreden — maar het conflict is opgelost.",
    en_when: "When goals are moderately important, as a temporary settlement under time pressure, or when equal-power parties need a workable outcome.",
    id_when: "Ketika tujuan cukup penting, sebagai penyelesaian sementara di bawah tekanan waktu, atau ketika pihak-pihak berdaya setara memerlukan hasil yang dapat dikerjakan.",
    nl_when: "Wanneer doelen matig belangrijk zijn, als tijdelijke regeling onder tijdsdruk, of wanneer gelijkwaardig machtige partijen een werkbaar resultaat nodig hebben.",
    en_cross: "Compromise works well in low-context, egalitarian cultures where explicit negotiation is normal. In many high-context cultures, explicit compromise can feel like public loss for both parties — especially if the 'giving up' becomes visible. Indirect compromise through a third party often lands better.",
    id_cross: "Kompromi bekerja dengan baik dalam budaya low-context dan egaliter di mana negosiasi eksplisit adalah normal. Dalam banyak budaya high-context, kompromi eksplisit bisa terasa seperti kekalahan publik bagi kedua pihak — terutama jika 'menyerah' menjadi terlihat.",
    nl_cross: "Compromis werkt goed in low-context, egalitaire culturen waar expliciete onderhandeling normaal is. In veel high-context culturen kan expliciet compromis aanvoelen als publiek verlies voor beide partijen — especially als het 'opgeven' zichtbaar wordt.",
    en_cultures: "More natural in: Western business contexts, Germany, Netherlands. Can feel like public failure in: cultures where loss must not be made visible (much of East Asia, Middle East).",
    id_cultures: "Lebih alami di: konteks bisnis Barat, Jerman, Belanda. Bisa terasa seperti kegagalan publik di: budaya di mana kerugian tidak boleh terlihat (banyak Asia Timur, Timur Tengah).",
    nl_cultures: "Meer natuurlijk in: Westerse zakelijke contexten, Duitsland, Nederland. Kan aanvoelen als publiek falen in: culturen waar verlies niet zichtbaar mag worden gemaakt.",
    en_tip: "When compromise feels stuck, check whether the real obstacle is saving face. Reframe from 'what do we each give up?' to 'what do we both gain by moving forward?' The same outcome, with a different narrative.",
    id_tip: "Ketika kompromi terasa macet, periksa apakah hambatan sebenarnya adalah menyelamatkan muka. Ubah bingkai dari 'apa yang masing-masing kita serahkan?' menjadi 'apa yang kita sama-sama dapatkan dengan melangkah maju?'",
    nl_tip: "Als compromis vastloopt, controleer dan of het echte obstakel gezichtsverlies is. Herframe van 'wat geven we elk op?' naar 'wat winnen we allebei door verder te gaan?' Dezelfde uitkomst, met een ander narratief.",
  },
  {
    key: "avoiding",
    color: "oklch(45% 0.12 250)",
    colorBg: "oklch(45% 0.12 250 / 0.10)",
    top: "82%", left: "10%",
    en_label: "Avoiding",
    id_label: "Menghindari",
    nl_label: "Vermijden",
    en_tagline: "Withdraw · Low assertiveness, low cooperation",
    id_tagline: "Menarik diri · Asertivitas rendah, kerja sama rendah",
    nl_tagline: "Terugtrekken · Lage assertiviteit, lage samenwerking",
    en_desc: "Postpone or sidestep the conflict entirely. Issues are neither resolved nor escalated. Often seen as passive — but in some contexts it is a sophisticated relational strategy, not a failure.",
    id_desc: "Tunda atau hindari konflik sepenuhnya. Masalah tidak diselesaikan maupun dieskalasi. Sering dilihat sebagai pasif — tetapi dalam beberapa konteks itu adalah strategi relasional yang canggih, bukan kegagalan.",
    nl_desc: "Stel het conflict volledig uit of ontwijk het. Kwesties worden noch opgelost noch geëscaleerd. Vaak gezien als passief — maar in sommige contexten is het een verfijnde relationele strategie, geen falen.",
    en_when: "When the issue is trivial, when timing is wrong, when emotions are too high for productive conversation, or when the relationship needs protection from a premature confrontation.",
    id_when: "Ketika masalah sepele, ketika waktunya salah, ketika emosi terlalu tinggi untuk percakapan produktif, atau ketika hubungan perlu dilindungi dari konfrontasi yang prematur.",
    nl_when: "Wanneer de kwestie triviaal is, wanneer de timing verkeerd is, wanneer emoties te hoog zijn voor productief gesprek, of wanneer de relatie bescherming nodig heeft tegen een premature confrontatie.",
    en_cross: "What looks like 'avoiding' to a Western observer is often active face-saving and relationship-maintenance in East Asian, Southeast Asian, and many African contexts. The indirect approach — signalling displeasure through tone, silence, or a trusted third party — is not avoidance; it is a culturally appropriate conflict resolution method.",
    id_cross: "Apa yang terlihat seperti 'menghindari' bagi pengamat Barat sering kali adalah penyelamatan muka aktif dan pemeliharaan hubungan dalam konteks Asia Timur, Asia Tenggara, dan banyak Afrika. Pendekatan tidak langsung — menandakan ketidakpuasan melalui nada, keheningan, atau pihak ketiga yang dipercaya — bukan penghindaran; itu adalah metode resolusi konflik yang tepat secara budaya.",
    nl_cross: "Wat voor een Westerse waarnemer op 'vermijden' lijkt, is in Oost-Aziatische, Zuidoost-Aziatische en veel Afrikaanse contexten vaak actief gezichtsbehoud en relatieonderhoud. De indirecte aanpak is geen vermijding; het is een cultureel gepaste methode voor conflictoplossing.",
    en_cultures: "Often misread as 'passive' in: Northern Europe, North America. Recognized as sophisticated relationship management in: East Asia, Southeast Asia, Middle East, Sub-Saharan Africa.",
    id_cultures: "Sering disalahartikan sebagai 'pasif' di: Eropa Utara, Amerika Utara. Diakui sebagai manajemen hubungan yang canggih di: Asia Timur, Asia Tenggara, Timur Tengah, Afrika Sub-Sahara.",
    nl_cultures: "Vaak ten onrechte als 'passief' gelezen in: Noord-Europa, Noord-Amerika. Herkend als verfijnd relatiebeheer in: Oost-Azië, Zuidoost-Azië, Midden-Oosten, Sub-Sahara Afrika.",
    en_tip: "If avoiding is your instinct, build a checkpoint: 'I'm not avoiding this — I'm waiting for the right moment. Here is what that moment looks like, and here is my deadline for addressing it.' Intentional timing is wisdom; indefinite postponement is not.",
    id_tip: "Jika menghindari adalah naluri Anda, bangun titik pemeriksaan: 'Saya tidak menghindari ini — saya menunggu momen yang tepat. Inilah seperti apa momen itu, dan inilah tenggat waktu saya untuk mengatasinya.'",
    nl_tip: "Als vermijden je instinct is, bouw een controlepunt: 'Ik vermijd dit niet — ik wacht op het juiste moment. Dit is hoe dat moment eruitziet, en dit is mijn deadline om het aan te pakken.' Intentionele timing is wijsheid; onbepaald uitstel niet.",
  },
  {
    key: "accommodating",
    color: "oklch(50% 0.14 290)",
    colorBg: "oklch(50% 0.14 290 / 0.10)",
    top: "82%", left: "75%",
    en_label: "Accommodating",
    id_label: "Mengakomodasi",
    nl_label: "Aanpassen",
    en_tagline: "Yield · Low assertiveness, high cooperation",
    id_tagline: "Menyerah · Asertivitas rendah, kerja sama tinggi",
    nl_tagline: "Toegeven · Lage assertiviteit, hoge samenwerking",
    en_desc: "You give up your own position to meet the other party's needs. Prioritises the relationship over the outcome. Can be genuine generosity — or chronic self-suppression. The difference matters.",
    id_desc: "Anda melepaskan posisi Anda sendiri untuk memenuhi kebutuhan pihak lain. Memprioritaskan hubungan di atas hasil. Bisa menjadi kemurahan hati yang tulus — atau penekanan diri yang kronis. Perbedaannya penting.",
    nl_desc: "Je geeft je eigen positie op om aan de behoeften van de andere partij te voldoen. Prioriteert de relatie boven de uitkomst. Kan echte vrijgevigheid zijn — of chronische zelfonderdrukking. Het verschil is belangrijk.",
    en_when: "When you realise you are wrong, when the issue matters far more to the other party, when preserving the relationship serves a greater purpose, or as a deliberate investment in trust.",
    id_when: "Ketika Anda menyadari Anda salah, ketika masalah jauh lebih penting bagi pihak lain, ketika mempertahankan hubungan melayani tujuan yang lebih besar, atau sebagai investasi sengaja dalam kepercayaan.",
    nl_when: "Wanneer je beseft dat je ongelijk hebt, wanneer de kwestie veel meer van belang is voor de andere partij, wanneer de relatie behouden een groter doel dient, of als bewuste investering in vertrouwen.",
    en_cross: "In many communal and high-context cultures, accommodation is the expected response of someone in a junior position — it is not weakness but appropriate deference. Western leaders who read accommodation as passivity may miss that their team is functioning exactly as their culture expects. The question to ask is not 'why won't they push back?' but 'what does their response tell me about how they see our relationship?'",
    id_cross: "Dalam banyak budaya komunal dan high-context, akomodasi adalah respons yang diharapkan dari seseorang di posisi junior — itu bukan kelemahan tetapi ketundukan yang tepat. Pemimpin Barat yang membaca akomodasi sebagai kepasifan mungkin melewatkan bahwa tim mereka berfungsi persis seperti yang diharapkan budaya mereka.",
    nl_cross: "In veel communale en high-context culturen is accommoderen de verwachte reactie van iemand in een lagere positie — het is geen zwakte maar gepaste eerbied. Westerse leiders die accommoderen als passiviteit lezen, missen mogelijk dat hun team precies functioneert zoals hun cultuur verwacht.",
    en_cultures: "Expected behaviour for juniors in: much of East Asia, South Asia, hierarchical African cultures. Seen as over-deferential in: Scandinavia, Netherlands, where flat hierarchy is the norm.",
    id_cultures: "Perilaku yang diharapkan untuk junior di: banyak Asia Timur, Asia Selatan, budaya Afrika hierarkis. Dilihat sebagai terlalu patuh di: Skandinavia, Belanda, di mana hierarki datar adalah norma.",
    nl_cultures: "Verwacht gedrag voor junioren in: groot deel van Oost-Azië, Zuid-Azië, hiërarchische Afrikaanse culturen. Gezien als overdreven onderdanig in: Scandinavië, Nederland, waar een platte hiërarchie de norm is.",
    en_tip: "If accommodating is your default, distinguish between genuine generosity and self-suppression. Ask: 'Am I giving this up because it's genuinely better for the mission, or because I'm uncomfortable with conflict?' The first is leadership. The second needs attention.",
    id_tip: "Jika mengakomodasi adalah default Anda, bedakan antara kemurahan hati yang tulus dan penekanan diri. Tanyakan: 'Apakah saya melepaskan ini karena benar-benar lebih baik untuk misi, atau karena saya tidak nyaman dengan konflik?'",
    nl_tip: "Als accommoderen je standaard is, onderscheid dan echte vrijgevigheid van zelfonderdrukking. Vraag: 'Geef ik dit op omdat het oprecht beter is voor de missie, of omdat ik ongemakkelijk ben met conflict?' Het eerste is leiderschap. Het tweede behoeft aandacht.",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function ConflictResolutionClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<ModeKey | null>(null);
  const [defaultMode, setDefaultMode] = useState<ModeKey | null>(null);

  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("conflict-resolution");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const activeMode = selectedMode ? MODES.find((m) => m.key === selectedMode)! : null;
  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button onClick={() => setActiveVerse(id)} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: "inherit", padding: 0, textDecoration: "underline dotted", textUnderlineOffset: 3 }}>
        {children}
      </button>
    );
  }

  const DEFAULT_INSIGHT: Record<ModeKey, { en: string; id: string; nl: string }> = {
    competing: {
      en: "Your default is Competing. You're clear-thinking and decisive under pressure. Your cross-cultural risk: directness reads as aggression in most of the world. Practice reading whether your team is engaging with you — or just deferring to avoid conflict.",
      id: "Default Anda adalah Bersaing. Anda berpikir jernih dan tegas di bawah tekanan. Risiko lintas budaya Anda: keterusterangan dibaca sebagai agresi di sebagian besar dunia. Praktikkan membaca apakah tim Anda terlibat dengan Anda — atau hanya menurut untuk menghindari konflik.",
      nl: "Jouw standaard is Concurreren. Je denkt helder en bent besluitvaardig onder druk. Je interculturele risico: directheid wordt in het grootste deel van de wereld als agressie gelezen. Oefen het lezen of je team echt meedoet — of alleen toegeeft om conflict te vermijden.",
    },
    collaborating: {
      en: "Your default is Collaborating. You invest deeply in working things through. Your cross-cultural risk: collaboration requires openness that many cultures cannot offer in formal settings. Don't mistake silence for agreement — check whether your team can actually voice disagreement safely.",
      id: "Default Anda adalah Berkolaborasi. Anda berinvestasi secara mendalam dalam mengerjakan sesuatu. Risiko lintas budaya Anda: kolaborasi membutuhkan keterbukaan yang banyak budaya tidak dapat tawarkan dalam pengaturan formal.",
      nl: "Jouw standaard is Samenwerken. Je investeert diep in het doorwerken van zaken. Je interculturele risico: samenwerken vereist openheid die veel culturen in formele omgevingen niet kunnen bieden. Verwar stilte niet met instemming.",
    },
    compromising: {
      en: "Your default is Compromising. You're pragmatic and fair-minded. Your cross-cultural risk: visible compromise can mean public loss for both parties in face-oriented cultures. Explore whether indirect settlement through a third party achieves the same result with less cost.",
      id: "Default Anda adalah Berkompromi. Anda pragmatis dan berpikiran adil. Risiko lintas budaya Anda: kompromi yang terlihat dapat berarti kerugian publik bagi kedua pihak dalam budaya berorientasi muka.",
      nl: "Jouw standaard is Compromissen Sluiten. Je bent pragmatisch en eerlijk. Je interculturele risico: zichtbaar compromis kan voor beide partijen publiek verlies betekenen in eer-georiënteerde culturen.",
    },
    avoiding: {
      en: "Your default is Avoiding. You're patient and protect relationships well. Your cross-cultural risk: indefinite avoidance is not culturally sophisticated — it's unresolved conflict. Build a practice of setting an internal 'address by' date for every issue you're sitting on.",
      id: "Default Anda adalah Menghindari. Anda sabar dan melindungi hubungan dengan baik. Risiko lintas budaya Anda: penghindaran tanpa batas bukanlah kecanggihan budaya — itu konflik yang tidak terselesaikan.",
      nl: "Jouw standaard is Vermijden. Je bent geduldig en beschermt relaties goed. Je interculturele risico: onbepaald vermijden is niet cultureel verfijnd — het is onopgelost conflict.",
    },
    accommodating: {
      en: "Your default is Accommodating. You're generous and relationally intelligent. Your cross-cultural risk: chronic accommodation can breed resentment and signal to your team that you don't actually hold a position. Make sure they know the difference between when you're giving freely and when you're being led.",
      id: "Default Anda adalah Mengakomodasi. Anda murah hati dan cerdas secara relasional. Risiko lintas budaya Anda: akomodasi kronis dapat menumbuhkan kebencian dan memberi sinyal kepada tim Anda bahwa Anda sebenarnya tidak memegang posisi.",
      nl: "Jouw standaard is Aanpassen. Je bent vrijgevig en relationeel intelligent. Je interculturele risico: chronisch accommoderen kan wrok kweken en je team signaleren dat je eigenlijk geen standpunt inneemt.",
    },
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>

      {/* Language bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText, borderRadius: 3 }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div style={{ background: navy, padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Module 11 · Leadership Skills", "Modul 11 · Keterampilan Kepemimpinan", "Module 11 · Leiderschapsvaardigheden")}
          </p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: offWhite, margin: "0 0 24px", lineHeight: 1.15 }}>
            {t("Conflict Resolution Across Cultures", "Resolusi Konflik Lintas Budaya", "Conflictoplossing over Culturen Heen")}
          </h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, maxWidth: 640, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Every leader has a default conflict style. In cross-cultural settings, your default may be creating problems you can't see. Explore the map — then find your range.",
              "Setiap pemimpin memiliki gaya konflik default. Dalam pengaturan lintas budaya, default Anda mungkin menciptakan masalah yang tidak dapat Anda lihat. Jelajahi peta — lalu temukan jangkauan Anda.",
              "Elke leider heeft een standaard conflictstijl. In interculturele settings kan jouw standaard problemen creëren die je niet ziet. Verken de kaart — dan vind je bereik."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, borderRadius: 4 }}>
              {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
            <Link href="/resources" style={{ padding: "12px 28px", border: "1px solid oklch(45% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: "oklch(78% 0.03 80)", textDecoration: "none", borderRadius: 4 }}>
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div style={{ padding: "72px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: navy, marginBottom: 8, textAlign: "center" }}>
          {t("The Conflict Style Map", "Peta Gaya Konflik", "De Conflictstijlkaart")}
        </h2>
        <p style={{ fontSize: 14, color: bodyText, textAlign: "center", marginBottom: 40 }}>
          {t("Click any style to explore it", "Klik gaya mana saja untuk menjelajahinya", "Klik een stijl om hem te verkennen")}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* The Map */}
          <div>
            {/* Axis labels */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, flexShrink: 0 }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: bodyText, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", flex: 1 }}>
                ← {t("Low cooperation", "Kerja sama rendah", "Lage samenwerking")} · {t("High cooperation", "Kerja sama tinggi", "Hoge samenwerking")} →
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {/* Y-axis label */}
              <div style={{ width: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, color: bodyText, letterSpacing: "0.08em", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  ↑ {t("Assert", "Asertif", "Assertief")} ↓
                </span>
              </div>

              {/* Map container */}
              <div style={{ flex: 1, position: "relative", paddingTop: "85%", background: lightGray, borderRadius: 8 }}>
                {/* Axis lines */}
                <div style={{ position: "absolute", top: "50%", left: "5%", right: "5%", height: 1, background: "oklch(88% 0.01 80)", transform: "translateY(-50%)" }} />
                <div style={{ position: "absolute", left: "50%", top: "5%", bottom: "5%", width: 1, background: "oklch(88% 0.01 80)", transform: "translateX(-50%)" }} />

                {/* Mode nodes */}
                {MODES.map((mode) => {
                  const isSelected = selectedMode === mode.key;
                  const isDefault = defaultMode === mode.key;
                  return (
                    <button
                      key={mode.key}
                      onClick={() => setSelectedMode(isSelected ? null : mode.key)}
                      style={{
                        position: "absolute",
                        top: mode.top, left: mode.left,
                        transform: "translate(-50%, -50%)",
                        width: isSelected ? 84 : 76,
                        height: isSelected ? 84 : 76,
                        borderRadius: "50%",
                        background: isSelected ? mode.color : offWhite,
                        border: `3px solid ${mode.color}`,
                        cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                        boxShadow: isSelected ? `0 4px 16px ${mode.color}40` : "none",
                        zIndex: isSelected ? 2 : 1,
                        padding: 4,
                        gap: 2,
                      }}
                    >
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 800, color: isSelected ? offWhite : mode.color, textAlign: "center", lineHeight: 1.2 }}>
                        {lang === "en" ? mode.en_label : lang === "id" ? mode.id_label : mode.nl_label}
                      </span>
                      {isDefault && (
                        <span style={{ fontSize: 9, background: isSelected ? offWhite : mode.color, color: isSelected ? mode.color : offWhite, padding: "1px 4px", borderRadius: 2, fontWeight: 700 }}>
                          {t("MY DEFAULT", "DEFAULT SAYA", "MIJN STANDAARD")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map legend */}
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MODES.map((m) => (
                <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: m.color }} />
                  <span style={{ fontSize: 11, color: bodyText }}>
                    {lang === "en" ? m.en_label : lang === "id" ? m.id_label : m.nl_label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div>
            {!activeMode ? (
              <div style={{ background: lightGray, padding: "40px 32px", borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>↖</div>
                <p style={{ fontFamily: serif, fontSize: 18, color: navy, fontStyle: "italic", lineHeight: 1.6 }}>
                  {t("Select a style on the map to explore it", "Pilih gaya pada peta untuk menjelajahinya", "Selecteer een stijl op de kaart om hem te verkennen")}
                </p>
              </div>
            ) : (
              <div style={{ background: activeMode.colorBg, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ background: activeMode.color, padding: "20px 24px" }}>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 800, color: offWhite, marginBottom: 4 }}>
                    {lang === "en" ? activeMode.en_label : lang === "id" ? activeMode.id_label : activeMode.nl_label}
                  </h3>
                  <p style={{ fontSize: 12, color: "oklch(90% 0.02 80)", margin: 0 }}>
                    {lang === "en" ? activeMode.en_tagline : lang === "id" ? activeMode.id_tagline : activeMode.nl_tagline}
                  </p>
                </div>
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: activeMode.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                      {t("What it looks like", "Seperti apa tampilannya", "Hoe het eruitziet")}
                    </p>
                    <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                      {lang === "en" ? activeMode.en_desc : lang === "id" ? activeMode.id_desc : activeMode.nl_desc}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: activeMode.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                      {t("When to use it", "Kapan menggunakannya", "Wanneer te gebruiken")}
                    </p>
                    <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                      {lang === "en" ? activeMode.en_when : lang === "id" ? activeMode.id_when : activeMode.nl_when}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: activeMode.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                      {t("Cross-cultural dimension", "Dimensi lintas budaya", "Interculturele dimensie")}
                    </p>
                    <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.7, marginBottom: 10 }}>
                      {lang === "en" ? activeMode.en_cross : lang === "id" ? activeMode.id_cross : activeMode.nl_cross}
                    </p>
                    <p style={{ fontSize: 12, color: bodyText, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
                      {lang === "en" ? activeMode.en_cultures : lang === "id" ? activeMode.id_cultures : activeMode.nl_cultures}
                    </p>
                  </div>
                  <div style={{ background: offWhite, padding: "14px 16px", borderRadius: 6 }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: activeMode.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                      {t("Expand your range", "Perluas jangkauan Anda", "Vergroot je bereik")}
                    </p>
                    <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                      {lang === "en" ? activeMode.en_tip : lang === "id" ? activeMode.id_tip : activeMode.nl_tip}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Your Default section */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("What is your default?", "Apa default Anda?", "Wat is jouw standaard?")}
          </h2>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.7, textAlign: "center", marginBottom: 36 }}>
            {t("Select the style you naturally reach for first in most conflicts.", "Pilih gaya yang secara alami Anda capai pertama kali dalam kebanyakan konflik.", "Selecteer de stijl waarnaar je van nature als eerste grijpt in de meeste conflicten.")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 36 }}>
            {MODES.map((m) => {
              const isMyDefault = defaultMode === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setDefaultMode(isMyDefault ? null : m.key)}
                  style={{
                    padding: "16px 12px", border: `2px solid ${isMyDefault ? m.color : "oklch(88% 0.01 80)"}`,
                    background: isMyDefault ? m.colorBg : offWhite,
                    cursor: "pointer", borderRadius: 6, textAlign: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 800, color: isMyDefault ? m.color : navy, marginBottom: 4 }}>
                    {lang === "en" ? m.en_label : lang === "id" ? m.id_label : m.nl_label}
                  </div>
                  <div style={{ fontSize: 11, color: bodyText, lineHeight: 1.4 }}>
                    {lang === "en" ? m.en_tagline.split(" · ")[0] : lang === "id" ? m.id_tagline.split(" · ")[0] : m.nl_tagline.split(" · ")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {defaultMode && (
            <div style={{ background: offWhite, padding: "28px 32px", borderRadius: 8 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: MODES.find((m) => m.key === defaultMode)!.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                {t("Your cross-cultural profile", "Profil lintas budaya Anda", "Jouw intercultureel profiel")}
              </p>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                {lang === "en" ? DEFAULT_INSIGHT[defaultMode].en : lang === "id" ? DEFAULT_INSIGHT[defaultMode].id : DEFAULT_INSIGHT[defaultMode].nl}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Biblical Foundation */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Biblical Foundation", "Dasar Alkitab", "Bijbelse Basis")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: offWhite, marginBottom: 40 }}>
            {t("Peacemaking, Not Peace-Keeping", "Pembuat Damai, Bukan Penjaga Damai", "Vredestichting, Niet Vredeshandhaving")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {[
              {
                id: "rom-12-18",
                en_body: "Romans 12:18 is careful. It says 'as far as it depends on you' — acknowledging that not every conflict resolves cleanly, and that the other party must also choose reconciliation. But the phrase 'if it is possible' is followed by the expectation that we try. Passivity is not peace. Avoidance is not shalom. The cross-cultural leader is called to pursue peace actively, within the real constraints of context.",
                id_body: "Roma 12:18 sangat hati-hati. Dikatakan 'kalau hal itu bergantung padamu' — mengakui bahwa tidak setiap konflik terselesaikan dengan bersih, dan bahwa pihak lain juga harus memilih rekonsiliasi. Tetapi frasa 'sedapat-dapatnya' diikuti oleh harapan bahwa kita mencoba. Kepasifan bukan kedamaian. Penghindaran bukan syalom.",
                nl_body: "Romeinen 12:18 is zorgvuldig. Het zegt 'voor zover het in uw macht ligt' — erkennend dat niet elk conflict netjes oplost, en dat de andere partij ook verzoening moet kiezen. Maar de frase 'indien het mogelijk is' wordt gevolgd door de verwachting dat we het proberen. Passiviteit is geen vrede. Vermijden is geen sjalom.",
              },
              {
                id: "matt-5-9",
                en_body: "Peacemakers — not peacekeepers. A keeper preserves the status quo. A maker does the harder work of creating something new where conflict once stood. In cross-cultural leadership, making peace often means crossing the cultural gap yourself: adopting an indirect approach when it serves reconciliation better than a direct one, or sitting with discomfort rather than forcing premature resolution. The Beatitude does not say 'blessed are those who avoid conflict.' It says blessed are those who make peace — which assumes the conflict was real.",
                id_body: "Pembuat damai — bukan penjaga damai. Seorang penjaga mempertahankan status quo. Seorang pembuat melakukan pekerjaan yang lebih sulit untuk menciptakan sesuatu yang baru di mana konflik pernah berdiri. Dalam kepemimpinan lintas budaya, membuat damai sering kali berarti menyeberangi kesenjangan budaya sendiri.",
                nl_body: "Vredestichters — geen vredesbewaarders. Een bewaarder handhaaft de status quo. Een stichter doet het zwaardere werk van het scheppen van iets nieuws waar ooit conflict was. In intercultureel leiderschap betekent vrede stichten vaak zelf de culturele kloof oversteken.",
              },
            ].map((item) => {
              const vd = VERSES[item.id as keyof typeof VERSES];
              return (
                <div key={item.id}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.1em", marginBottom: 14 }}>
                    <VerseRef id={item.id}>{lang === "en" ? vd.en_ref : lang === "id" ? vd.id_ref : vd.nl_ref}</VerseRef>
                  </p>
                  <p style={{ fontFamily: serif, fontSize: "clamp(17px, 1.9vw, 21px)", fontStyle: "italic", color: offWhite, lineHeight: 1.7, marginBottom: 20 }}>
                    "{lang === "en" ? vd.en : lang === "id" ? vd.id : vd.nl}"
                  </p>
                  <p style={{ fontSize: 15, color: "oklch(76% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? item.en_body : lang === "id" ? item.id_body : item.nl_body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: lightGray, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: navy, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 36px", background: navy, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4 }}>
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </div>

      {/* Verse Popup */}
      {activeVerse && verseData && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: offWhite, borderRadius: 12, padding: "44px 40px", maxWidth: 540, width: "100%" }}>
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.7, color: navy, fontStyle: "italic", marginBottom: 20 }}>
              "{lang === "en" ? verseData.en : lang === "id" ? verseData.id : verseData.nl}"
            </p>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 28 }}>
              — {lang === "en" ? verseData.en_ref : lang === "id" ? verseData.id_ref : verseData.nl_ref}{" "}
              {lang === "en" ? "(NIV)" : lang === "id" ? "(TB)" : "(NBV)"}
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
