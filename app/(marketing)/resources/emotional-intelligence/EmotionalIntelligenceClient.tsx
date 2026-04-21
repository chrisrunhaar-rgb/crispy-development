"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const COMPONENTS = [
  {
    number: "01",
    en_title: "Self-Awareness",
    id_title: "Kesadaran Diri",
    nl_title: "Zelfbewustzijn",
    en_desc: "The ability to recognise your own emotions, strengths, weaknesses, drives, and values — and how they shape your impact on others. Self-aware leaders aren't surprised by their emotions; they notice them in real time.",
    id_desc: "Kemampuan untuk mengenali emosi, kekuatan, kelemahan, dorongan, dan nilai Anda sendiri — serta bagaimana hal-hal itu membentuk dampak Anda pada orang lain.",
    nl_desc: "Het vermogen om je eigen emoties, sterke en zwakke punten, driften en waarden te herkennen — en hoe ze je impact op anderen bepalen.",
    en_cross: "Western leaders often define self-awareness around personal goals. In Southeast Asia, self-awareness also means understanding your position in the social hierarchy and how your emotional state affects collective harmony.",
    id_cross: "Pemimpin Barat sering mendefinisikan kesadaran diri seputar tujuan pribadi. Di Asia Tenggara, kesadaran diri juga berarti memahami posisi Anda dalam hierarki sosial.",
    nl_cross: "Westerse leiders definiëren zelfbewustzijn vaak rond persoonlijke doelen. In Zuidoost-Azië betekent zelfbewustzijn ook begrijpen hoe je positie in de sociale hiërarchie de collectieve harmonie beïnvloedt.",
  },
  {
    number: "02",
    en_title: "Self-Regulation",
    id_title: "Regulasi Diri",
    nl_title: "Zelfregulering",
    en_desc: "The capacity to manage disruptive impulses — to create space between stimulus and response. Leaders who self-regulate don't let frustration drive their words or decisions.",
    id_desc: "Kapasitas untuk mengelola impuls yang mengganggu — menciptakan ruang antara stimulus dan respons. Pemimpin yang meregulasi diri tidak membiarkan frustrasi mendorong kata-kata atau keputusan mereka.",
    nl_desc: "Het vermogen om verstorende impulsen te beheersen — ruimte te creëren tussen stimulus en respons. Leiders die zichzelf reguleren laten frustratie hun woorden of beslissingen niet aansturen.",
    en_cross: "Dutch leaders may value emotional directness as regulation. But in Indonesian, Malaysian, and Filipino cultures, self-regulation is tied to 'display rules' — the social expectation to maintain composure and protect face. Public anger signals leadership failure.",
    id_cross: "Pemimpin Belanda mungkin menghargai kejujuran emosional sebagai regulasi. Namun dalam budaya Indonesia, Malaysia, dan Filipina, regulasi diri terkait dengan 'aturan tampilan' — harapan sosial untuk menjaga ketenangan.",
    nl_cross: "Nederlandse leiders waarderen emotionele eerlijkheid als regulatie. Maar in Indonesische, Maleisische en Filippijnse culturen is zelfregulering verbonden aan 'display rules' — de sociale verwachting om kalm te blijven en gezicht te bewaren.",
  },
  {
    number: "03",
    en_title: "Motivation",
    id_title: "Motivasi",
    nl_title: "Motivatie",
    en_desc: "A passion for work that reaches beyond money or status — an inner drive to achieve and improve. Highly motivated leaders persist through setbacks and inspire their teams by example.",
    id_desc: "Gairah untuk bekerja yang melampaui uang atau status — dorongan batin untuk mencapai dan berkembang. Pemimpin yang termotivasi tinggi bertahan melalui kemunduran dan menginspirasi tim mereka.",
    nl_desc: "Een passie voor werk die verder gaat dan geld of status — een innerlijke drang om te bereiken en verbeteren. Sterk gemotiveerde leiders houden vol bij tegenslagen.",
    en_cross: "Western motivation is often framed as individual achievement. In Southeast Asia, motivation is frequently about loyalty and communal success — providing for the 'work family' and bringing honour to the community.",
    id_cross: "Motivasi Barat sering dibingkai sebagai pencapaian individu. Di Asia Tenggara, motivasi sering tentang loyalitas dan kesuksesan bersama — menyediakan untuk 'keluarga kerja'.",
    nl_cross: "Westerse motivatie wordt vaak geframed als individuele prestatie. In Zuidoost-Azië gaat motivatie vaak over loyaliteit en gemeenschappelijk succes — zorgen voor de 'werkfamilie'.",
  },
  {
    number: "04",
    en_title: "Empathy",
    id_title: "Empati",
    nl_title: "Empathie",
    en_desc: "The ability to understand others' emotional makeup — especially when making decisions. Empathetic leaders don't just hear words; they sense what lies beneath them.",
    id_desc: "Kemampuan untuk memahami susunan emosional orang lain — terutama saat membuat keputusan. Pemimpin yang berempati tidak hanya mendengar kata-kata; mereka merasakan apa yang ada di baliknya.",
    nl_desc: "Het vermogen om de emotionele gesteldheid van anderen te begrijpen — vooral bij het nemen van beslissingen. Empathische leiders horen niet alleen woorden; ze voelen wat eronder zit.",
    en_cross: "Low-context leaders rely on explicit verbal communication. High-context Southeast Asian cultures demand empathy through nonverbal cues — silence, indirect language, and tone. 'Yes' often means 'I hear you,' not 'I agree.'",
    id_cross: "Pemimpin konteks rendah mengandalkan komunikasi verbal yang eksplisit. Budaya Asia Tenggara konteks tinggi menuntut empati melalui isyarat nonverbal — keheningan, bahasa tidak langsung, dan nada.",
    nl_cross: "Lage-context leiders vertrouwen op expliciete verbale communicatie. Hoge-context Zuidoost-Aziatische culturen vragen empathie via nonverbale signalen — stilte, indirecte taal en toon. 'Ja' betekent vaak 'ik hoor u,' niet 'ik ga akkoord.'",
  },
  {
    number: "05",
    en_title: "Social Skill",
    id_title: "Keterampilan Sosial",
    nl_title: "Sociale Vaardigheid",
    en_desc: "Proficiency in managing relationships and building networks across differences — finding common ground, building rapport, and moving people in a direction that benefits all.",
    id_desc: "Kemahiran dalam mengelola hubungan dan membangun jaringan di tengah perbedaan — menemukan titik temu, membangun hubungan baik, dan menggerakkan orang ke arah yang menguntungkan semua.",
    nl_desc: "Vaardigheid in het beheren van relaties en netwerken over verschillen heen — gemeenschappelijke grond vinden, rapport opbouwen, en mensen in een richting bewegen die iedereen ten goede komt.",
    en_cross: "Dutch social skills often mean consensus through direct debate. Southeast Asian social skills mean navigating hierarchy, mastering indirect reciprocity, and fostering harmony through private deliberation before any public decision.",
    id_cross: "Keterampilan sosial Belanda sering berarti konsensus melalui debat langsung. Keterampilan sosial Asia Tenggara berarti menavigasi hierarki dan memupuk harmoni melalui musyawarah pribadi sebelum keputusan publik.",
    nl_cross: "Nederlandse sociale vaardigheden betekenen vaak consensus via direct debat. Zuidoost-Aziatische sociale vaardigheden betekenen hiërarchie navigeren en harmonie bevorderen via privé-overleg vóór enige publieke beslissing.",
  },
];

const SCENARIOS = [
  {
    title: { en: "The Honest Critique", id: "Kritik yang Jujur", nl: "De Eerlijke Kritiek" },
    setup: {
      en: "A Dutch project manager in Jakarta holds a weekly 'transparency check' — calling out team members' errors openly in front of the whole group to ensure accountability.",
      id: "Seorang manajer proyek Belanda di Jakarta mengadakan 'pemeriksaan transparansi' mingguan — menyebutkan kesalahan anggota tim secara terbuka di depan seluruh kelompok.",
      nl: "Een Nederlandse projectmanager in Jakarta houdt een wekelijkse 'transparantiecheck' — teamfouten openlijk bespreken voor de hele groep voor verantwoording.",
    },
    breakdown: {
      en: "Public criticism causes a profound loss of face in high-context Southeast Asian cultures. The team didn't become more accountable — they became quiet, withdrawn, and began hiding problems instead of surfacing them.",
      id: "Kritik publik menyebabkan kehilangan muka yang mendalam dalam budaya Asia Tenggara konteks tinggi. Tim tidak menjadi lebih bertanggung jawab — mereka menjadi diam dan mulai menyembunyikan masalah.",
      nl: "Openbare kritiek veroorzaakt een diep gezichtsverlies in hoge-context Zuidoost-Aziatische culturen. Het team werd niet verantwoordelijker — ze werden stil en begonnen problemen te verbergen.",
    },
    response: {
      en: "Address errors one-on-one, privately, framed as collaborative problem-solving. Publicly celebrate what the team is doing well. Save accountability conversations for private space.",
      id: "Tangani kesalahan secara pribadi, empat mata, dibingkai sebagai pemecahan masalah kolaboratif. Rayakan secara publik apa yang dilakukan tim dengan baik.",
      nl: "Bespreek fouten privé, één-op-één, geframed als gezamenlijk probleemoplossen. Vier publiekelijk wat het team goed doet. Bewaar verantwoordingsgesprekken voor privéruimte.",
    },
  },
  {
    title: { en: "Silence in the Boardroom", id: "Keheningan di Ruang Rapat", nl: "Stilte in de Boardroom" },
    setup: {
      en: "A Western leader in Kuala Lumpur presents a new strategy and asks for objections. The room is silent. He assumes consensus and moves to implementation.",
      id: "Seorang pemimpin Barat di Kuala Lumpur mempresentasikan strategi baru dan meminta keberatan. Ruangan sunyi. Ia mengasumsikan konsensus dan bergerak ke implementasi.",
      nl: "Een Westerse leider in Kuala Lumpur presenteert een nieuwe strategie en vraagt om bezwaren. De kamer is stil. Hij neemt consensus aan en gaat over tot implementatie.",
    },
    breakdown: {
      en: "Silence was not agreement — it was respect for hierarchy. The team had significant reservations but no safe channel to express them. Passive resistance followed, and the implementation quietly failed.",
      id: "Keheningan bukan persetujuan — itu adalah rasa hormat terhadap hierarki. Tim memiliki keberatan signifikan tetapi tidak ada saluran yang aman untuk mengekspresikannya.",
      nl: "Stilte was geen instemming — het was respect voor hiërarchie. Het team had aanzienlijke bezwaren maar geen veilig kanaal om ze te uiten. Passief verzet volgde.",
    },
    response: {
      en: "After any group presentation, follow up individually. Ask open questions like 'What challenges might come up in your area?' Create smaller, safer spaces for honest input before locking in decisions.",
      id: "Setelah presentasi kelompok, tindak lanjuti secara individual. Ajukan pertanyaan terbuka seperti 'Tantangan apa yang mungkin muncul di area Anda?' Ciptakan ruang yang lebih kecil dan aman untuk masukan jujur.",
      nl: "Volg na elke groepspresentatie individueel op. Stel open vragen zoals 'Welke uitdagingen kunnen er in jouw gebied opkomen?' Creëer kleinere, veiligere ruimtes voor eerlijke inbreng.",
    },
  },
  {
    title: { en: "The Deadline Meltdown", id: "Keruntuhan Deadline", nl: "De Deadline-uitbarsting" },
    setup: {
      en: "A Filipino team misses a critical deadline due to a misunderstanding. Their Western leader loses their temper publicly — voice raised, visible frustration shown in the open office.",
      id: "Tim Filipina melewatkan deadline kritis karena kesalahpahaman. Pemimpin Barat mereka kehilangan kesabaran secara publik — suara meninggi, frustrasi terlihat di kantor terbuka.",
      nl: "Een Filipijns team mist een kritieke deadline door een misverstand. Hun Westerse leider verliest zijn geduld publiekelijk — stem verheven, zichtbare frustratie in het open kantoor.",
    },
    breakdown: {
      en: "In Southeast Asian display rules, public anger signals a loss of self-control and a failure of leadership. The team didn't become motivated — they became ashamed, disconnected, and started avoiding their leader entirely.",
      id: "Dalam aturan tampilan Asia Tenggara, kemarahan publik menandakan hilangnya kendali diri dan kegagalan kepemimpinan. Tim tidak menjadi termotivasi — mereka menjadi malu dan mulai menghindari pemimpin mereka.",
      nl: "In Zuidoost-Aziatische display rules signaleert publieke woede verlies van zelfbeheersing. Het team raakte niet gemotiveerd — ze schaamden zich en begonnen hun leider te vermijden.",
    },
    response: {
      en: "Step away, regulate privately first. Return calm. Address the missed deadline by asking what happened — listen fully before responding. Refocus on shared loyalty and the mission, not personal frustration.",
      id: "Menjauh, regulasi secara pribadi terlebih dahulu. Kembali dengan tenang. Atasi deadline yang terlewat dengan bertanya apa yang terjadi — dengarkan sepenuhnya sebelum merespons.",
      nl: "Stap weg, reguleer eerst privé. Keer rustig terug. Bespreek de gemiste deadline door te vragen wat er is gebeurd — luister volledig voor je reageert. Herricht op gedeelde loyaliteit en de missie.",
    },
  },
];

const STRATEGIES = [
  {
    en: "Keep a daily emotion log — name what you felt, when, and what triggered it. Naming is the beginning of regulation.",
    id: "Simpan catatan emosi harian — namai apa yang Anda rasakan, kapan, dan apa yang memicunya.",
    nl: "Houd een dagelijks emotielogboek bij — benoem wat je voelde, wanneer en wat het triggerde.",
  },
  {
    en: "Before any difficult conversation, pause for 60 seconds to name your emotional state and clarify your actual goal.",
    id: "Sebelum percakapan sulit, berhenti sejenak 60 detik untuk menyebutkan kondisi emosional Anda dan mengklarifikasi tujuan Anda.",
    nl: "Pauzeer voor elk moeilijk gesprek 60 seconden om je emotionele staat te benoemen en je doel te verduidelijken.",
  },
  {
    en: "Practice perspective-taking — before reacting, ask: 'What might this situation feel like from their side of the table?'",
    id: "Latih pengambilan perspektif — sebelum bereaksi, tanyakan: 'Seperti apa rasanya situasi ini dari sisi mereka?'",
    nl: "Oefen perspectiefname — vraag voor je reageert: 'Hoe zou dit aanvoelen vanuit hun kant van de tafel?'",
  },
  {
    en: "After meetings in high-context cultures, follow up individually to hear what wasn't said in the room.",
    id: "Setelah pertemuan dalam budaya konteks tinggi, tindak lanjuti secara individual untuk mendengar apa yang tidak dikatakan dalam rapat.",
    nl: "Volg na vergaderingen in hoge-context culturen individueel op om te horen wat niet in de kamer werd gezegd.",
  },
  {
    en: "Seek unfiltered feedback on your emotional impact from someone in your team who will tell you the truth.",
    id: "Cari umpan balik yang tidak tersaring tentang dampak emosional Anda dari seseorang di tim Anda yang akan memberi tahu kebenaran.",
    nl: "Zoek ongefiltreerde feedback over je emotionele impact van iemand in je team die je de waarheid vertelt.",
  },
  {
    en: "Celebrate team wins with emotion — not just logistics. People remember how you made them feel, not the slide deck.",
    id: "Rayakan kemenangan tim dengan emosi — bukan hanya logistik. Orang mengingat bagaimana Anda membuat mereka merasa.",
    nl: "Vier teamoverwinningen met emotie — niet alleen logistiek. Mensen herinneren hoe je ze liet voelen.",
  },
];

const LEVELS = [
  {
    level: "01",
    en_title: "Aware",
    id_title: "Sadar",
    nl_title: "Bewust",
    color: "oklch(55% 0.12 45)",
    colorBg: "oklch(97% 0.02 45)",
    en_steps: ["Can name your dominant emotions in most situations", "Recognise when your emotional state affects your tone", "Understand the basics of Goleman's 5 components"],
    id_steps: ["Dapat menyebutkan emosi dominan Anda dalam sebagian besar situasi", "Mengenali ketika kondisi emosional memengaruhi nada Anda", "Memahami dasar 5 komponen Goleman"],
    nl_steps: ["Kan je dominante emoties benoemen in de meeste situaties", "Herkent wanneer je emotionele staat je toon beïnvloedt", "Begrijpt de basis van Golemans 5 componenten"],
  },
  {
    level: "02",
    en_title: "Regulated",
    id_title: "Teratur",
    nl_title: "Gereguleerd",
    color: "oklch(50% 0.14 260)",
    colorBg: "oklch(96% 0.02 260)",
    en_steps: ["Consistently create space between stimulus and response", "Read nonverbal cues across cultural contexts", "Adapt your emotional expression to the cultural setting"],
    id_steps: ["Secara konsisten menciptakan ruang antara stimulus dan respons", "Membaca isyarat nonverbal di berbagai konteks budaya", "Menyesuaikan ekspresi emosional Anda dengan setting budaya"],
    nl_steps: ["Creëert consistent ruimte tussen stimulus en respons", "Leest nonverbale signalen in verschillende culturele contexten", "Past je emotionele expressie aan de culturele setting aan"],
  },
  {
    level: "03",
    en_title: "Influential",
    id_title: "Berpengaruh",
    nl_title: "Invloedrijk",
    color: "oklch(45% 0.12 150)",
    colorBg: "oklch(96% 0.02 150)",
    en_steps: ["Build psychological safety across cultural difference", "Lead others in developing their own emotional intelligence", "Model emotional health as a visible leadership discipline"],
    id_steps: ["Membangun keamanan psikologis di tengah perbedaan budaya", "Memimpin orang lain dalam mengembangkan kecerdasan emosional mereka", "Memodelkan kesehatan emosional sebagai disiplin kepemimpinan yang terlihat"],
    nl_steps: ["Bouwt psychologische veiligheid over culturele verschillen heen", "Begeleidt anderen in het ontwikkelen van hun eigen emotionele intelligentie", "Modelleert emotionele gezondheid als zichtbare leiderschapsdiscipline"],
  },
];

const REFLECTION = [
  {
    roman: "I",
    en: "Which of Goleman's five components is your clearest strength? Which is your most significant growth edge?",
    id: "Manakah dari lima komponen Goleman yang paling jelas menjadi kekuatan Anda? Mana yang paling signifikan sebagai area pertumbuhan?",
    nl: "Welke van Golemans vijf componenten is jouw duidelijkste kracht? Welke is jouw meest significante groeiedge?",
  },
  {
    roman: "II",
    en: "When did you last react emotionally in a way that damaged a relationship? What would a high-EQ response have looked like?",
    id: "Kapan terakhir kali Anda bereaksi secara emosional dengan cara yang merusak suatu hubungan? Seperti apa respons EQ tinggi?",
    nl: "Wanneer reageerde je voor het laatst emotioneel op een manier die een relatie schaadde? Hoe had een hoge-EQ-respons eruitzien?",
  },
  {
    roman: "III",
    en: "In what cross-cultural situation have you most struggled to read emotional signals correctly? What did you miss?",
    id: "Dalam situasi lintas budaya apa Anda paling kesulitan membaca sinyal emosional dengan benar? Apa yang Anda lewatkan?",
    nl: "In welke interculturele situatie heb je het meest moeite gehad om emotionele signalen correct te lezen? Wat miste je?",
  },
  {
    roman: "IV",
    en: "Who in your life has modelled extraordinary emotional intelligence? What specifically did they do differently?",
    id: "Siapa dalam hidup Anda yang telah memodelkan kecerdasan emosional yang luar biasa? Apa yang mereka lakukan secara berbeda?",
    nl: "Wie in je leven heeft buitengewone emotionele intelligentie gemodelleerd? Wat deden zij specifiek anders?",
  },
  {
    roman: "V",
    en: "How does your spiritual formation shape your emotional regulation? Where is God growing you right now?",
    id: "Bagaimana pembentukan rohani Anda membentuk regulasi emosional Anda? Di mana Allah sedang menumbuhkan Anda sekarang?",
    nl: "Hoe vormt je geestelijke vorming je emotionele regulatie? Waar laat God je op dit moment groeien?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function EmotionalIntelligenceClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("emotional-intelligence");
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
      {/* Language bar */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
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
          {t("Emotional Intelligence", "Kecerdasan Emosional", "Emotionele Intelligentie")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"In a high-IQ job pool, soft skills like discipline, drive, and empathy mark those who emerge as outstanding." — Daniel Goleman',
            '"Dalam kumpulan pekerjaan IQ tinggi, soft skill seperti disiplin, dorongan, dan empati menandai mereka yang muncul sebagai luar biasa." — Daniel Goleman',
            '"In een pool van hoge-IQ-banen zijn soft skills zoals discipline, gedrevenheid en empathie bepalend voor wie uitblinkt." — Daniel Goleman'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      {/* Opening story */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "When Daniel Goleman published Emotional Intelligence in 1995, the research revealed something counterintuitive: in leadership roles, EQ often matters more than IQ. The higher people climb in an organisation, the more emotional intelligence — not technical skill — determines their effectiveness.",
            "Ketika Daniel Goleman menerbitkan Emotional Intelligence pada tahun 1995, penelitian mengungkapkan sesuatu yang berlawanan dengan intuisi: dalam peran kepemimpinan, EQ sering kali lebih penting daripada IQ.",
            "Toen Daniel Goleman in 1995 Emotional Intelligence publiceerde, onthulde onderzoek iets contra-intuïtiefs: in leiderschapsrollen is EQ vaak belangrijker dan IQ. Hoe hoger mensen klimmen, hoe meer EQ hun effectiviteit bepaalt."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "In cross-cultural leadership, EQ becomes even more demanding. You're navigating emotional landscapes shaped by different norms around expression, restraint, conflict, and hierarchy — simultaneously. What reads as confident directness in Amsterdam lands as aggression in Jakarta. What feels like evasion in a Rotterdam meeting is mature diplomacy in Manila. The emotionally intelligent leader learns to read two emotional maps at once.",
            "Dalam kepemimpinan lintas budaya, EQ menjadi bahkan lebih menuntut. Anda menavigasi lanskap emosional yang dibentuk oleh norma yang berbeda seputar ekspresi, pengendalian, konflik, dan hierarki — secara bersamaan.",
            "In intercultureel leiderschap wordt EQ nog veeleisender. Je navigeert emotionele landschappen gevormd door verschillende normen rondom expressie, terughoudendheid, conflict en hiërarchie — tegelijk. Wat in Amsterdam zelfverzekerd directheid is, komt in Jakarta aan als agressie."
          )}
        </p>
      </div>

      {/* 5 Components */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("Goleman's 5 Components", "5 Komponen Goleman", "Golemans 5 Componenten")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("Each component — with a cross-cultural lens", "Setiap komponen — dengan perspektif lintas budaya", "Elk component — met een interculturele lens")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {COMPONENTS.map((c) => (
              <div key={c.number} style={{ background: offWhite, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 48, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 44, flexShrink: 0 }}>{c.number}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? c.en_title : lang === "id" ? c.id_title : c.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: "0 0 16px" }}>
                    {lang === "en" ? c.en_desc : lang === "id" ? c.id_desc : c.nl_desc}
                  </p>
                  <div style={{ background: "oklch(94% 0.015 45)", padding: "14px 18px" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(50% 0.12 45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      {t("Cross-Cultural Lens", "Perspektif Lintas Budaya", "Interculturele Lens")}
                    </p>
                    <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                      {lang === "en" ? c.en_cross : lang === "id" ? c.id_cross : c.nl_cross}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ padding: "72px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
          {t("When EQ Breaks Down", "Ketika EQ Gagal", "Wanneer EQ Faalt")}
        </h2>
        <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
          {t("Three real-world scenarios — what went wrong, and the high-EQ response", "Tiga skenario nyata — apa yang salah, dan respons EQ tinggi", "Drie praktijkscenario's — wat misging, en de hoge-EQ-respons")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SCENARIOS.map((s, i) => {
            const isOpen = openScenario === i;
            return (
              <div key={i} style={{ border: `1px solid ${isOpen ? orange : "oklch(88% 0.01 80)"}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                <button
                  onClick={() => setOpenScenario(isOpen ? null : i)}
                  style={{ width: "100%", padding: "20px 28px", background: isOpen ? navy : offWhite, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left", transition: "background 0.2s" }}
                >
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: isOpen ? offWhite : navy }}>
                    {s.title[lang]}
                  </span>
                  <span style={{ color: isOpen ? orange : bodyText, fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "28px 28px 32px", background: offWhite }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      {t("The Situation", "Situasinya", "De Situatie")}
                    </p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.setup[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(45% 0.15 20)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      {t("What Went Wrong", "Yang Salah", "Wat Misging")}
                    </p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, marginBottom: 24 }}>{s.breakdown[lang]}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(40% 0.12 160)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      {t("The High-EQ Response", "Respons EQ Tinggi", "De Hoge-EQ-Respons")}
                    </p>
                    <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{s.response[lang]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Biblical anchor */}
      <div style={{ background: navy, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 48 }}>
            {t("The Emotionally Intelligent Leader in Scripture", "Pemimpin Cerdas Emosional dalam Kitab Suci", "De Emotioneel Intelligente Leider in de Schrift")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                ref: "Philippians 2:4",
                verse: {
                  en: '"Let each of you look not only to his own interests, but also to the interests of others."',
                  id: '"Janganlah tiap-tiap orang hanya memperhatikan kepentingannya sendiri, tetapi kepentingan orang lain juga."',
                  nl: '"Laat ieder niet alleen op zijn eigen belangen letten, maar ook op die van anderen."',
                },
                comment: {
                  en: "The biblical foundation for empathy and social concern. It mandates that leaders move beyond their own 'inner focus' to prioritise the emotional and professional wellbeing of their team — across every culture.",
                  id: "Landasan alkitabiah untuk empati dan kepedulian sosial. Ini mengamanatkan bahwa pemimpin bergerak melampaui 'fokus batin' mereka sendiri untuk memprioritaskan kesejahteraan emosional dan profesional tim mereka.",
                  nl: "De bijbelse basis voor empathie en sociale zorg. Het verplicht leiders om voorbij hun eigen 'innerlijke focus' te gaan en de emotionele en professionele welzijn van hun team te prioriteren.",
                },
              },
              {
                ref: "Proverbs 15:1",
                verse: {
                  en: '"A soft answer turns away wrath, but a harsh word stirs up anger."',
                  id: '"Jawaban yang lemah lembut meredakan kegeraman, tetapi perkataan yang pedas membangkitkan marah."',
                  nl: '"Een zachte reactie doet grimmigheid wijken, maar een grievend woord wekt toorn op."',
                },
                comment: {
                  en: "A direct command for self-regulation. The leader's ability to modulate their emotional response is the primary tool for maintaining social harmony — whether in a Rotterdam boardroom or a Manila office.",
                  id: "Perintah langsung untuk regulasi diri. Kemampuan pemimpin untuk memodulasi respons emosional mereka adalah alat utama untuk menjaga harmoni sosial — baik di ruang rapat Rotterdam maupun kantor Manila.",
                  nl: "Een directe opdracht voor zelfregulering. Het vermogen van de leider om hun emotionele respons te moduleren is het primaire instrument voor sociale harmonie — of het nu in een Rotterdamse boardroom is of een Manilas kantoor.",
                },
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <p style={{ color: orange, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{item.ref}</p>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, fontStyle: "italic", color: offWhite, lineHeight: 1.6, marginBottom: 16 }}>
                  {item.verse[lang]}
                </p>
                <p style={{ fontSize: 15, color: "oklch(78% 0.03 80)", lineHeight: 1.75, margin: 0 }}>
                  {item.comment[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Strategies */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("6 Development Practices", "6 Praktik Pengembangan", "6 Ontwikkelingspraktijken")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {STRATEGIES.map((s, i) => (
              <div key={i} style={{ background: lightGray, padding: "24px 28px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 40, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 4 }}>
                  {lang === "en" ? s.en : lang === "id" ? s.id : s.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Development path */}
      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12, textAlign: "center" }}>
            {t("Your Development Path", "Jalur Pengembangan Anda", "Jouw Ontwikkelpad")}
          </h2>
          <p style={{ textAlign: "center", color: bodyText, fontSize: 15, marginBottom: 48 }}>
            {t("Where are you on the EQ journey?", "Di mana Anda dalam perjalanan EQ?", "Waar ben je op de EQ-reis?")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {LEVELS.map((lv) => (
              <div key={lv.level} style={{ background: lv.colorBg, padding: "28px 24px" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: lv.color, lineHeight: 1, marginBottom: 12 }}>{lv.level}</div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: navy, marginBottom: 16 }}>
                  {lang === "en" ? lv.en_title : lang === "id" ? lv.id_title : lv.nl_title}
                </h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(lang === "en" ? lv.en_steps : lang === "id" ? lv.id_steps : lv.nl_steps).map((step, si) => (
                    <li key={si} style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, marginBottom: 8 }}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {REFLECTION.map((q) => (
            <div key={q.roman} style={{ background: lightGray, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t(
            "Explore more resources to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
            "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
          )}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
