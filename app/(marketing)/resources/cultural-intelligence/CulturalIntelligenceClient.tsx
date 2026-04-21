"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

// ─── CQ Dimensions (accordion data) ───────────────────────────────────────────
const cqDimensions = [
  {
    number: "01",
    en_title: "Motivational CQ — The Drive",
    id_title: "CQ Motivasi — Dorongan",
    nl_title: "Motivationele CQ — De Drijfveer",
    en_tagline: "Do you actually want to understand them — or just manage them?",
    id_tagline: "Apakah Anda benar-benar ingin memahami mereka — atau sekadar mengelola mereka?",
    nl_tagline: "Wil je hen echt begrijpen — of alleen maar managen?",
    en_desc: "Motivational CQ is the energy source of the whole model. It is your intrinsic interest in cross-cultural engagement — your willingness to sit with discomfort, your confidence that you can learn, your genuine curiosity about how other people see the world. Without this, the other three dimensions never activate.",
    id_desc: "CQ Motivasi adalah sumber energi dari seluruh model. Ini adalah minat intrinsik Anda dalam keterlibatan lintas budaya — kesediaan Anda untuk duduk dengan ketidaknyamanan, keyakinan bahwa Anda bisa belajar, keingintahuan sejati tentang bagaimana orang lain melihat dunia.",
    nl_desc: "Motivationele CQ is de energiebron van het hele model. Het is je intrinsieke interesse in interculturele betrokkenheid — je bereidheid om met ongemak te zitten, je vertrouwen dat je kunt leren, je echte nieuwsgierigheid naar hoe anderen de wereld zien.",
    en_low: "Low Motivational CQ looks like: anxiety masked as 'I just prefer working with my own people.' It looks like checking cultural boxes on a form while privately wishing everyone would just think like you do.",
    id_low: "CQ Motivasi rendah terlihat seperti: kecemasan yang disamarkan sebagai 'Saya lebih suka bekerja dengan orang-orang saya sendiri.' Terlihat seperti mencentang kotak budaya di formulir sambil diam-diam berharap semua orang berpikir seperti Anda.",
    nl_low: "Lage Motivationele CQ ziet eruit als: angst vermomd als 'Ik werk liever met mijn eigen mensen.' Het lijkt op het afvinken van culturele vakjes op een formulier terwijl je stiekem wenst dat iedereen gewoon zoals jij zou denken.",
    en_scenario: "Scenario: A Dutch leader in Jakarta notices his Indonesian team rarely speaks up in group meetings. Low Motivational CQ assumes they're passive. High Motivational CQ gets curious: what does respectful contribution look like here? He asks. He listens. He restructures his meetings.",
    id_scenario: "Skenario: Seorang pemimpin Belanda di Jakarta memperhatikan timnya jarang berbicara dalam rapat kelompok. CQ Motivasi rendah menganggap mereka pasif. CQ Motivasi tinggi menjadi penasaran: seperti apa kontribusi yang penuh hormat di sini? Dia bertanya. Dia mendengarkan. Dia merestrukturisasi rapatnya.",
    nl_scenario: "Scenario: Een Nederlandse leider in Jakarta merkt dat zijn Indonesische team zelden spreekt tijdens groepsvergaderingen. Lage Motivationele CQ veronderstelt passiviteit. Hoge Motivationele CQ wordt nieuwsgierig: hoe ziet respectvolle bijdrage er hier uit? Hij vraagt. Hij luistert. Hij herstructureert zijn vergaderingen.",
  },
  {
    number: "02",
    en_title: "Cognitive CQ — The Knowledge",
    id_title: "CQ Kognitif — Pengetahuan",
    nl_title: "Cognitieve CQ — De Kennis",
    en_tagline: "Understanding cultures is not the same as knowing facts about them.",
    id_tagline: "Memahami budaya tidak sama dengan mengetahui fakta tentang mereka.",
    nl_tagline: "Culturen begrijpen is niet hetzelfde als feiten over hen kennen.",
    en_desc: "Cognitive CQ is your cultural knowledge base — but it is more than memorizing customs. It is understanding how culture shapes the deep architecture of human thought: how people define time, authority, shame, honour, family obligation, and truth. It includes understanding cultural value dimensions like individualism vs. collectivism, high vs. low power distance, and direct vs. indirect communication.",
    id_desc: "CQ Kognitif adalah basis pengetahuan budaya Anda — tetapi lebih dari sekadar menghafal adat istiadat. Ini adalah memahami bagaimana budaya membentuk arsitektur mendalam pemikiran manusia: bagaimana orang mendefinisikan waktu, otoritas, rasa malu, kehormatan, kewajiban keluarga, dan kebenaran.",
    nl_desc: "Cognitieve CQ is je culturele kennisbasis — maar het is meer dan gewoonten memoriseren. Het is begrijpen hoe cultuur de diepe architectuur van menselijk denken vormt: hoe mensen tijd, autoriteit, schaamte, eer, familieverplichting en waarheid definiëren.",
    en_low: "Low Cognitive CQ looks like: assuming that because you've read one book on a culture, you understand it. It looks like applying Hofstede's dimensions as if they're descriptions of individuals rather than statistical tendencies. It looks like 'I've been here 3 months, I get this place.'",
    id_low: "CQ Kognitif rendah terlihat seperti: mengasumsikan bahwa karena Anda telah membaca satu buku tentang suatu budaya, Anda memahaminya. Terlihat seperti menerapkan dimensi Hofstede seolah-olah mereka menggambarkan individu daripada kecenderungan statistik.",
    nl_low: "Lage Cognitieve CQ ziet eruit als: aannemen dat je een cultuur begrijpt omdat je er één boek over hebt gelezen. Het lijkt op het toepassen van Hofstedes dimensies alsof ze individuen beschrijven in plaats van statistische tendensen.",
    en_scenario: "Scenario: A Korean-American pastor plants a church in Lagos, Nigeria. He's studied African cultures — or so he thinks. He arrives expecting a high-context, oral, communal culture. What he finds is a sophisticated urban congregation shaped by Pentecostalism, British colonial history, and 21st-century tech entrepreneurship. His framework was a starting point, not a destination.",
    id_scenario: "Skenario: Seorang pendeta Korea-Amerika menanam gereja di Lagos, Nigeria. Dia telah mempelajari budaya Afrika — atau begitu pikirnya. Dia tiba dengan mengharapkan budaya konteks tinggi, lisan, dan komunal. Yang dia temukan adalah jemaat perkotaan yang canggih yang dibentuk oleh Pentakostalisme, sejarah kolonial Inggris, dan kewirausahaan teknologi abad ke-21.",
    nl_scenario: "Scenario: Een Koreaans-Amerikaanse pastor plant een kerk in Lagos, Nigeria. Hij heeft Afrikaanse culturen bestudeerd — of zo denkt hij. Hij verwacht een hogere-context, mondelinge, gemeenschappelijke cultuur. Wat hij vindt is een geavanceerde stadsgemeente gevormd door het Pinksterchristendom, de Britse koloniale geschiedenis en 21e-eeuwse tech-ondernemerschap.",
  },
  {
    number: "03",
    en_title: "Metacognitive CQ — The Strategy",
    id_title: "CQ Metakognitif — Strategi",
    nl_title: "Metacognitieve CQ — De Strategie",
    en_tagline: "The hardest skill: watching yourself think — in real time.",
    id_tagline: "Keterampilan tersulit: mengamati diri sendiri berpikir — secara real time.",
    nl_tagline: "De moeilijkste vaardigheid: jezelf zien denken — in real time.",
    en_desc: "Metacognitive CQ is awareness of your own thinking process during cross-cultural encounters. It is the capacity to pause mid-interpretation and ask: 'Am I reading this situation through my own cultural lens? What assumptions am I importing here?' High metacognitive CQ leaders plan before, monitor during, and reflect after culturally complex interactions. They catch themselves before a misread becomes a misstep.",
    id_desc: "CQ Metakognitif adalah kesadaran tentang proses berpikir Anda sendiri selama pertemuan lintas budaya. Ini adalah kapasitas untuk berhenti di tengah interpretasi dan bertanya: 'Apakah saya membaca situasi ini melalui lensa budaya saya sendiri?'",
    nl_desc: "Metacognitieve CQ is bewustzijn van je eigen denkproces tijdens interculturele ontmoetingen. Het is het vermogen om midden in een interpretatie te pauzeren en te vragen: 'Lees ik deze situatie door mijn eigen culturele lens? Welke aannames breng ik hier mee?'",
    en_low: "Low Metacognitive CQ looks like: never questioning your first read of a situation. Assuming silence means agreement. Assuming directness means respect. Assuming busyness means commitment. These are all cultural defaults dressed up as universal truth.",
    id_low: "CQ Metakognitif rendah terlihat seperti: tidak pernah mempertanyakan pembacaan pertama Anda tentang suatu situasi. Mengasumsikan keheningan berarti persetujuan. Mengasumsikan ketegasan berarti rasa hormat. Ini semua adalah default budaya yang disamarkan sebagai kebenaran universal.",
    nl_low: "Lage Metacognitieve CQ ziet eruit als: nooit je eerste lezing van een situatie in twijfel trekken. Ervan uitgaan dat stilte instemming betekent. Ervan uitgaan dat directheid respect betekent. Dit zijn allemaal culturele standaardinstellingen vermomd als universele waarheid.",
    en_scenario: "Scenario: A British NGO director in Cairo gets frustrated that her Egyptian counterpart never disagrees with her in meetings. She concludes he's a yes-man. Metacognitive CQ would prompt her to ask: 'Is public disagreement with a female foreign director simply not the way criticism works here? Where does his real feedback surface?' Answer: in private conversations, over tea, after the meeting ends.",
    id_scenario: "Skenario: Seorang direktur LSM Inggris di Kairo frustrasi karena mitra Mesirnya tidak pernah tidak setuju dengannya dalam rapat. Dia menyimpulkan dia orang yang hanya mengiyakan. CQ Metakognitif akan mendorongnya untuk bertanya: 'Apakah ketidaksetujuan publik dengan direktur asing perempuan bukan cara kritik bekerja di sini?'",
    nl_scenario: "Scenario: Een Britse NGO-directeur in Caïro wordt gefrustreerd omdat haar Egyptische tegenhanger het nooit met haar oneens is in vergaderingen. Ze concludeert dat hij een ja-knikker is. Metacognitieve CQ zou haar ertoe aanzetten te vragen: 'Is openbaar meningsverschil met een vrouwelijke buitenlandse directeur hier gewoon niet de manier waarop kritiek werkt?'",
  },
  {
    number: "04",
    en_title: "Behavioral CQ — The Action",
    id_title: "CQ Perilaku — Tindakan",
    nl_title: "Gedragsmatige CQ — De Actie",
    en_tagline: "Knowing is not enough. You have to actually change how you show up.",
    id_tagline: "Mengetahui saja tidak cukup. Anda harus benar-benar mengubah cara Anda hadir.",
    nl_tagline: "Weten is niet genoeg. Je moet daadwerkelijk veranderen hoe je verschijnt.",
    en_desc: "Behavioral CQ is the visible output of the whole model — the actual adjustment of your verbal and nonverbal behavior in cross-cultural settings. This includes tone, pace of speech, eye contact, physical proximity, touch, directness, formality, how you give feedback, how you handle silence, and how you open and close meetings. High behavioral CQ doesn't mean becoming a different person. It means expanding your range.",
    id_desc: "CQ Perilaku adalah output yang terlihat dari seluruh model — penyesuaian aktual dari perilaku verbal dan nonverbal Anda dalam pengaturan lintas budaya. Ini mencakup nada, kecepatan berbicara, kontak mata, kedekatan fisik, kesentuhan, ketegasan, formalitas.",
    nl_desc: "Gedragsmatige CQ is de zichtbare uitvoer van het hele model — de feitelijke aanpassing van je verbale en non-verbale gedrag in interculturele omgevingen. Dit omvat toon, spreektempo, oogcontact, fysieke nabijheid, aanraking, directheid, formaliteit.",
    en_low: "Low Behavioral CQ looks like: knowing everything about a culture and still reverting to your default style under pressure. Or over-correcting so aggressively that people feel patronised. ('He tries too hard to be one of us.') The goal is authentic range, not performance.",
    id_low: "CQ Perilaku rendah terlihat seperti: mengetahui segalanya tentang suatu budaya dan masih kembali ke gaya default Anda di bawah tekanan. Atau terlalu mengoreksi secara agresif sehingga orang merasa direndahkan. Tujuannya adalah jangkauan yang otentik, bukan pertunjukan.",
    nl_low: "Lage Gedragsmatige CQ ziet eruit als: alles over een cultuur weten en toch terugvallen op je standaardstijl onder druk. Of zo agressief overcorrigeren dat mensen zich betutteld voelen. Het doel is authentiek bereik, geen optreden.",
    en_scenario: "Scenario: An American church planter in Thailand learns intellectually that Thai culture values indirect communication and 'saving face.' But in a tense team meeting, he reverts to his direct American style: 'Let's just be honest about what's not working.' The room goes silent — not with agreement, but with shutdown. His behavioral CQ failed at the moment it mattered most.",
    id_scenario: "Skenario: Seorang penanam gereja Amerika di Thailand belajar secara intelektual bahwa budaya Thailand menghargai komunikasi tidak langsung dan 'menyelamatkan muka.' Tetapi dalam rapat tim yang tegang, dia kembali ke gaya Amerika yang langsung: 'Mari kita jujur tentang apa yang tidak berhasil.' Ruangan menjadi sunyi — bukan dengan persetujuan, tetapi dengan penutupan.",
    nl_scenario: "Scenario: Een Amerikaanse kerkplanter in Thailand leert intellectueel dat de Thaise cultuur indirecte communicatie en 'gezichtsbehoud' waardeert. Maar in een gespannen teamvergadering valt hij terug op zijn directe Amerikaanse stijl: 'Laten we gewoon eerlijk zijn over wat niet werkt.' De kamer wordt stil — niet met instemming, maar met sluiting.",
  },
];

// ─── CQ Development Levels ────────────────────────────────────────────────────
const developmentLevels = [
  {
    level: "01",
    en_label: "Beginner",
    id_label: "Pemula",
    nl_label: "Beginner",
    en_subtitle: "Build your foundation — honest self-awareness first",
    id_subtitle: "Bangun fondasi Anda — kesadaran diri yang jujur lebih dulu",
    nl_subtitle: "Bouw je fundament — eerlijke zelfbewustwording eerst",
    color: "#4A90D9",
    actions: [
      {
        en: "Take the Cultural Values Profile assessment (free at CulturalQ.com). Don't just note your scores — sit with what surprises you. Your lowest score is your most urgent growth edge.",
        id: "Ambil penilaian Profil Nilai Budaya (gratis di CulturalQ.com). Jangan hanya catat skor Anda — renungkan apa yang mengejutkan Anda. Skor terendah Anda adalah tepi pertumbuhan paling mendesak.",
        nl: "Doe de Cultural Values Profile-beoordeling (gratis op CulturalQ.com). Noteer niet alleen je scores — blijf stilstaan bij wat je verrast. Je laagste score is je meest urgente groeipunt.",
      },
      {
        en: "Choose one person in your context whose cultural background significantly differs from yours. Spend 30 minutes asking them about their culture — not to analyze, but to genuinely understand. Listen more than you speak.",
        id: "Pilih satu orang dalam konteks Anda yang latar belakang budayanya sangat berbeda dari Anda. Habiskan 30 menit bertanya tentang budaya mereka — bukan untuk menganalisis, tetapi untuk benar-benar memahami.",
        nl: "Kies één persoon in jouw context wiens culturele achtergrond significant verschilt van de jouwe. Besteed 30 minuten aan het stellen van vragen over hun cultuur — niet om te analyseren, maar om oprecht te begrijpen.",
      },
    ],
  },
  {
    level: "02",
    en_label: "Practitioner",
    id_label: "Praktisi",
    nl_label: "Practitioner",
    en_subtitle: "Build systematic habits — discipline over inspiration",
    id_subtitle: "Bangun kebiasaan sistematis — disiplin lebih dari inspirasi",
    nl_subtitle: "Bouw systematische gewoonten — discipline boven inspiratie",
    color: "#E07540",
    actions: [
      {
        en: "After every significant cross-cultural interaction, write three sentences: (1) What happened. (2) What I assumed. (3) What might have actually been going on. This is metacognitive CQ in practice — and it compounds over time.",
        id: "Setelah setiap interaksi lintas budaya yang signifikan, tulis tiga kalimat: (1) Apa yang terjadi. (2) Apa yang saya asumsikan. (3) Apa yang mungkin sebenarnya terjadi. Ini adalah CQ Metakognitif dalam praktik — dan itu bertambah seiring waktu.",
        nl: "Schrijf na elke significante interculturele interactie drie zinnen: (1) Wat er gebeurde. (2) Wat ik veronderstelde. (3) Wat er eigenlijk aan de hand kon zijn. Dit is Metacognitieve CQ in de praktijk — en het accumuleert in de loop van de tijd.",
      },
      {
        en: "Find a cultural mentor — ideally someone local to your context who respects you enough to be honest. Meet monthly. Ask explicitly: 'What am I missing? What do I get wrong that you haven't told me yet?' Honour their honesty.",
        id: "Temukan mentor budaya — idealnya seseorang yang lokal untuk konteks Anda yang cukup menghormati Anda untuk jujur. Bertemu setiap bulan. Tanyakan secara eksplisit: 'Apa yang saya lewatkan? Apa yang saya salah yang belum Anda ceritakan?'",
        nl: "Vind een culturele mentor — idealiter iemand die lokaal is in jouw context en je genoeg respecteert om eerlijk te zijn. Kom maandelijks samen. Vraag expliciet: 'Wat mis ik? Wat doe ik fout dat je me nog niet hebt verteld?' Eer hun eerlijkheid.",
      },
    ],
  },
  {
    level: "03",
    en_label: "Advanced",
    id_label: "Lanjutan",
    nl_label: "Gevorderd",
    en_subtitle: "Lead others into growth — teach what you've learned",
    id_subtitle: "Pimpin orang lain dalam pertumbuhan — ajarkan apa yang telah Anda pelajari",
    nl_subtitle: "Leid anderen in groei — onderwijs wat je hebt geleerd",
    color: "#1B3A6B",
    actions: [
      {
        en: "Deliberately put yourself in culturally unfamiliar situations where you hold no positional power — as a guest, a learner, a follower. Experience what it feels like to be the cultural minority in the room. This builds empathy that no seminar can teach.",
        id: "Dengan sengaja tempatkan diri Anda dalam situasi yang tidak dikenal secara budaya di mana Anda tidak memiliki kekuatan posisional — sebagai tamu, pelajar, pengikut. Rasakan seperti apa menjadi minoritas budaya di ruangan.",
        nl: "Stel jezelf bewust bloot aan cultureel onbekende situaties waar je geen positionele macht hebt — als gast, leerling, volgeling. Ervaar hoe het voelt om de culturele minderheid in de kamer te zijn.",
      },
      {
        en: "Build CQ development into your team culture. Debrief cross-cultural failures openly. Celebrate cultural learning moments. Create space for your team members from minority cultures to name what isn't working — and actually change when they do.",
        id: "Bangun pengembangan CQ ke dalam budaya tim Anda. Debriefkan kegagalan lintas budaya secara terbuka. Rayakan momen pembelajaran budaya. Ciptakan ruang bagi anggota tim Anda dari budaya minoritas untuk menyebutkan apa yang tidak berhasil — dan benar-benar berubah ketika mereka melakukannya.",
        nl: "Bouw CQ-ontwikkeling in je teamcultuur. Bespreek interculturele mislukkingen openlijk. Vier culturele leermomenten. Maak ruimte voor je teamleden uit minderhedenculturen om te benoemen wat niet werkt — en verander daadwerkelijk als ze dat doen.",
      },
    ],
  },
];

// ─── Reflection Questions ─────────────────────────────────────────────────────
const reflectionQuestions = [
  {
    roman: "I",
    en: "Think of a cross-cultural relationship that hasn't worked well. Which CQ dimension was most underdeveloped — yours, not theirs?",
    id: "Pikirkan hubungan lintas budaya yang tidak berjalan dengan baik. Dimensi CQ mana yang paling kurang berkembang — Anda, bukan mereka?",
    nl: "Denk aan een interculturele relatie die niet goed werkte. Welke CQ-dimensie was het meest onderontwikkeld — die van jou, niet van hen?",
  },
  {
    roman: "II",
    en: "What is one cultural assumption you hold that you have never seriously questioned? Where did it come from?",
    id: "Apa satu asumsi budaya yang Anda pegang yang belum pernah Anda pertanyakan secara serius? Dari mana asalnya?",
    nl: "Wat is één culturele aanname die je hebt die je nooit serieus hebt bevraagd? Waar komt die vandaan?",
  },
  {
    roman: "III",
    en: "In what ways has your faith community subtly exported your home culture alongside the gospel? What would it look like to untangle those two things?",
    id: "Dengan cara apa komunitas iman Anda secara halus mengekspor budaya rumah Anda bersama dengan Injil? Seperti apa memisahkan kedua hal tersebut?",
    nl: "Op welke manieren heeft jouw geloofsgemeenschap stilletjes je thuiscultuur samen met het evangelie geëxporteerd? Hoe zou het eruitzien om die twee dingen los te koppelen?",
  },
  {
    roman: "IV",
    en: "Who in your life has higher CQ than you in specific dimensions? What would it look like to deliberately learn from them this month?",
    id: "Siapa dalam hidup Anda yang memiliki CQ lebih tinggi dari Anda di dimensi tertentu? Seperti apa secara sengaja belajar dari mereka bulan ini?",
    nl: "Wie in je leven heeft een hogere CQ dan jij op specifieke dimensies? Hoe zou het eruitzien om deze maand bewust van hen te leren?",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function CulturalIntelligenceClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openDimension, setOpenDimension] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("cultural-intelligence");
      setSaved(true);
    });
  }

  const navy = "#1B3A6B";
  const navyOklch = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "#E07540";
  const orangeOklch = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";
  const charcoal = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>

      {/* ─── LANG SWITCHER ──────────────────────────────────────────────────── */}
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navyOklch : "transparent", color: lang === l ? offWhite : bodyText, transition: "all 0.15s ease" }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <div style={{ background: navyOklch, padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        {/* Orange left-edge accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: orangeOklch }} />
        {/* Subtle texture overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 50%, oklch(30% 0.12 260) 0%, transparent 60%)", opacity: 0.5 }} />

        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: orangeOklch, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Cross-Cultural Leadership", "Kepemimpinan Lintas Budaya", "Intercultureel Leiderschap")}
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(34px, 5.5vw, 58px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 780, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {t("Cultural Intelligence (CQ)", "Kecerdasan Budaya (CQ)", "Culturele Intelligentie (CQ)")}
          </h1>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(19px, 2.5vw, 26px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.6, fontStyle: "italic" }}>
            {t(
              '"Crossing cultural divides is not a soft skill. It is the most demanding form of leadership there is."',
              '"Melampaui batas budaya bukan keterampilan lunak. Ini adalah bentuk kepemimpinan paling menuntut yang ada."',
              '"Culturele grenzen oversteken is geen soft skill. Het is de meest veeleisende vorm van leiderschap die bestaat."'
            )}
          </p>
          <p style={{ color: "oklch(65% 0.05 260)", fontSize: 13, marginBottom: 36, fontStyle: "italic" }}>— David Livermore</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{ padding: "13px 30px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(45% 0.08 260)" : orangeOklch, color: offWhite, letterSpacing: "0.02em" }}
            >
              {saved ? t("Saved ✓", "Tersimpan ✓", "Opgeslagen ✓") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
            </button>
            <Link
              href="/resources"
              style={{ padding: "13px 30px", borderRadius: 6, border: "1px solid oklch(45% 0.05 260)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}
            >
              {t("All Resources", "Semua Sumber", "Alle Bronnen")}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: OPENING HOOK ────────────────────────────────────────── */}
      {/* Format: Vivid narrative story block with left-border pull styling */}
      <div style={{ padding: "80px 24px 0", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
          {t("A Story", "Sebuah Kisah", "Een Verhaal")}
        </p>

        {/* Story block */}
        <div style={{ borderLeft: `4px solid ${orangeOklch}`, paddingLeft: 28, marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 2.8vw, 26px)", color: navyOklch, lineHeight: 1.55, marginBottom: 20, fontStyle: "italic" }}>
            {t(
              "Mark had led teams in five countries. MBA from a top school. Strong communicator. Clear vision. Everyone said he was going places.",
              "Mark telah memimpin tim di lima negara. MBA dari sekolah terkemuka. Komunikator yang kuat. Visi yang jelas. Semua orang mengatakan dia akan berhasil.",
              "Mark had teams geleid in vijf landen. MBA van een topschool. Sterke communicator. Heldere visie. Iedereen zei dat hij ver zou komen."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "When he arrived in Malaysia to lead a regional church-planting network, he did what he always did: called a team meeting, laid out the vision, assigned roles, and asked for input. The room nodded. He left energised.",
              "Ketika dia tiba di Malaysia untuk memimpin jaringan penanaman gereja regional, dia melakukan apa yang selalu dilakukannya: mengadakan rapat tim, memaparkan visi, memberikan peran, dan meminta masukan. Ruangan mengangguk. Dia pergi dengan penuh semangat.",
              "Toen hij in Maleisië aankwam om een regionaal kerkplantersnetwerk te leiden, deed hij wat hij altijd deed: een teamvergadering beleggen, de visie uiteenzetten, rollen toewijzen en om input vragen. De kamer knikte. Hij vertrok vol energie."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "Three months later, nothing had moved. The team was polite, present, and perfectly unproductive. People were carrying out tasks without any sense of ownership. Two senior local leaders had quietly stopped coming. When Mark finally asked a trusted colleague what was wrong, the answer stopped him cold:",
              "Tiga bulan kemudian, tidak ada yang bergerak. Tim itu sopan, hadir, dan sepenuhnya tidak produktif. Orang-orang melakukan tugas tanpa rasa kepemilikan apapun. Dua pemimpin lokal senior telah diam-diam berhenti datang. Ketika Mark akhirnya bertanya kepada seorang kolega terpercaya apa yang salah, jawabannya membuatnya terdiam:",
              "Drie maanden later was er niets veranderd. Het team was beleefd, aanwezig en volkomen onproductief. Mensen voerden taken uit zonder enige eigenaarschap. Twee senior lokale leiders waren stilletjes gestopt met komen. Toen Mark eindelijk aan een vertrouwde collega vroeg wat er mis was, trof het antwoord hem als een koude douche:"
            )}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(19px, 2.5vw, 23px)", color: navyOklch, lineHeight: 1.6, fontStyle: "italic", marginBottom: 0 }}>
            {t(
              '"You came in as the expert. You told people what the vision was. In our culture, that means the conversation is already over."',
              '"Kamu datang sebagai ahlinya. Kamu memberi tahu orang-orang apa visinya. Dalam budaya kami, itu berarti percakapan sudah berakhir."',
              '"Je kwam binnen als de expert. Je vertelde mensen wat de visie was. In onze cultuur betekent dat dat het gesprek al voorbij is."'
            )}
          </p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
          {t(
            "Mark had high IQ. He had strong EQ. He understood the gospel. But he lacked Cultural Intelligence — and it cost him a year of leadership and several key relationships.",
            "Mark memiliki IQ tinggi. Dia memiliki EQ yang kuat. Dia memahami Injil. Tetapi dia kekurangan Kecerdasan Budaya — dan itu menghabiskan satu tahun kepemimpinan dan beberapa hubungan kunci.",
            "Mark had een hoge IQ. Hij had sterke EQ. Hij begreep het evangelie. Maar hij miste Culturele Intelligentie — en dat kostte hem een jaar leiderschap en verschillende sleutelrelaties."
          )}
        </p>
        <p style={{ fontSize: 17, fontWeight: 700, color: navyOklch, lineHeight: 1.7, marginBottom: 0 }}>
          {t("This is a CQ problem. And it is far more common than you think.", "Ini adalah masalah CQ. Dan ini jauh lebih umum dari yang Anda kira.", "Dit is een CQ-probleem. En het komt veel vaker voor dan je denkt.")}
        </p>
      </div>

      {/* ─── IMAGE 1 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image
            src="/resources/cultural-intelligence-1.jpg"
            alt="Diverse leaders in cross-cultural dialogue"
            width={1312}
            height={736}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t("Cross-cultural dialogue requires more than goodwill — it requires intelligence.", "Dialog lintas budaya membutuhkan lebih dari niat baik — membutuhkan kecerdasan.", "Interculturele dialoog vereist meer dan goede wil — het vereist intelligentie.")}
        </p>
      </div>

      {/* ─── SECTION 2: WHAT CQ ACTUALLY IS ────────────────────────────────── */}
      {/* Format: Two-column concept split with pull-quote */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("The Framework", "Kerangka Kerja", "Het Kader")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navyOklch, marginBottom: 32, lineHeight: 1.2 }}>
          {t("What CQ Actually Is — and What It Isn't", "Apa CQ Sebenarnya — dan Apa yang Bukan", "Wat CQ Echt Is — en Wat Niet")}
        </h2>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Cultural Intelligence (CQ) was introduced in 2003 by researchers Christopher Earley and Soon Ang, and significantly developed by David Livermore. It is the capability to function effectively across culturally diverse situations — not just national cultures, but ethnic, generational, organisational, and religious cultures too.",
            "Kecerdasan Budaya (CQ) diperkenalkan pada tahun 2003 oleh peneliti Christopher Earley dan Soon Ang, dan dikembangkan secara signifikan oleh David Livermore. Ini adalah kemampuan untuk berfungsi secara efektif di berbagai situasi yang beragam secara budaya.",
            "Culturele Intelligentie (CQ) werd in 2003 geïntroduceerd door onderzoekers Christopher Earley en Soon Ang, en significant ontwikkeld door David Livermore. Het is het vermogen om effectief te functioneren in cultureel diverse situaties."
          )}
        </p>

        {/* Mirror vs Window callout */}
        <div style={{ background: navyOklch, borderRadius: 10, padding: "32px 36px", margin: "36px 0", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "0 10px 0 120px", background: "oklch(30% 0.12 260)", opacity: 0.5 }} />
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.5, fontStyle: "italic", margin: "0 0 16px", position: "relative" }}>
            {t(
              '"Most leaders look at the world through a mirror — they see their own culture reflected back. CQ teaches you to look through a window — to see another world as it actually is."',
              '"Sebagian besar pemimpin melihat dunia melalui cermin — mereka melihat budaya mereka sendiri terpantul kembali. CQ mengajarkan Anda untuk melihat melalui jendela — untuk melihat dunia lain sebagaimana adanya."',
              '"De meeste leiders kijken naar de wereld door een spiegel — ze zien hun eigen cultuur weerspiegeld. CQ leert je door een raam te kijken — om een andere wereld te zien zoals die werkelijk is."'
            )}
          </p>
          <p style={{ color: orangeOklch, fontSize: 13, fontWeight: 600, margin: 0, position: "relative" }}>— David Livermore</p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "CQ is not the same as cultural knowledge. You can know everything about gift-giving customs in Japan and still completely misread a moment of silence from a Japanese colleague. Knowledge is raw material. CQ is what you build with it.",
            "CQ tidak sama dengan pengetahuan budaya. Anda bisa mengetahui segalanya tentang adat pemberian hadiah di Jepang dan masih sepenuhnya salah membaca momen keheningan dari kolega Jepang. Pengetahuan adalah bahan mentah. CQ adalah apa yang Anda bangun dengannya.",
            "CQ is niet hetzelfde als culturele kennis. Je kunt alles weten over cadeaugeefgewoonten in Japan en toch een moment van stilte van een Japanse collega volledig verkeerd lezen. Kennis is ruwe stof. CQ is wat je ermee bouwt."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "It is not the same as EQ either. Emotional intelligence helps you read people; cultural intelligence helps you read context. Both are necessary. A leader with high EQ but low CQ will be genuinely empathetic — and still systematically misunderstand the people they lead.",
            "Itu juga tidak sama dengan EQ. Kecerdasan emosional membantu Anda membaca orang; kecerdasan budaya membantu Anda membaca konteks. Keduanya diperlukan. Pemimpin dengan EQ tinggi tetapi CQ rendah akan benar-benar empatik — dan masih secara sistematis salah memahami orang-orang yang dipimpinnya.",
            "Het is ook niet hetzelfde als EQ. Emotionele intelligentie helpt je mensen te lezen; culturele intelligentie helpt je context te lezen. Beide zijn noodzakelijk. Een leider met hoge EQ maar lage CQ zal oprecht empathisch zijn — en nog steeds systematisch de mensen die hij leidt verkeerd begrijpen."
          )}
        </p>

        {/* Faith anchor: the Incarnation */}
        <div style={{ borderTop: `3px solid ${orangeOklch}`, paddingTop: 32, marginTop: 36 }}>
          <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
          </p>
          <h3 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 20, fontWeight: 700, color: navyOklch, marginBottom: 16 }}>
            {t("The Incarnation as the Ultimate CQ Model", "Inkarnasi sebagai Model CQ Tertinggi", "De Incarnatie als het Ultieme CQ-Model")}
          </h3>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 16 }}>
            {t(
              "The most profound act of cultural intelligence in history was not a leadership seminar — it was the Incarnation. God did not shout instructions from heaven. He moved into the neighbourhood. He learned the language, ate the food, understood the honour-shame dynamics of first-century Jewish culture, and communicated truth in forms his audience could receive.",
              "Tindakan kecerdasan budaya paling mendalam dalam sejarah bukan seminar kepemimpinan — itu adalah Inkarnasi. Allah tidak berteriak instruksi dari surga. Dia pindah ke lingkungan. Dia belajar bahasa, makan makanan, memahami dinamika kehormatan-rasa malu dari budaya Yahudi abad pertama.",
              "De meest diepgaande daad van culturele intelligentie in de geschiedenis was geen leiderschapsseminaar — het was de Incarnatie. God schreeuwde geen instructies vanuit de hemel. Hij verhuisde naar de buurt. Hij leerde de taal, at het voedsel, begreep de eer-schaamdynamiek van de eerste-eeuwse Joodse cultuur."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85 }}>
            {t(
              "In Acts 17, Paul in Athens doesn't quote the Hebrew scriptures — he quotes Greek poets. He enters the cultural conversation on its own terms before redirecting it toward truth. Paul's entire missionary method is an exercise in high CQ: 'I have become all things to all people, so that by all possible means I might save some' (1 Cor 9:22). This is not compromise. This is intelligence.",
              "Dalam Kisah Para Rasul 17, Paulus di Athena tidak mengutip Kitab Suci Ibrani — dia mengutip penyair Yunani. Dia memasuki percakapan budaya dengan syaratnya sendiri sebelum mengarahkannya menuju kebenaran. Seluruh metode misionaris Paulus adalah latihan CQ tinggi: 'Aku menjadi semua hal bagi semua orang' (1 Kor 9:22).",
              "In Handelingen 17 citeert Paulus in Athene niet de Hebreeuwse geschriften — hij citeert Griekse dichters. Hij treedt de culturele conversatie op haar eigen voorwaarden toe voordat hij die richting de waarheid stuurt. Paulus' hele missionaire methode is een oefening in hoge CQ: 'Ik ben alles voor allen geworden' (1 Kor 9:22)."
            )}
          </p>
        </div>
      </div>

      {/* ─── SECTION 3: THE 4 DIMENSIONS — ACCORDION ───────────────────────── */}
      {/* Format: Interactive expandable accordion with depth */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("The Four Dimensions", "Empat Dimensi", "De Vier Dimensies")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navyOklch, marginBottom: 12, lineHeight: 1.2 }}>
            {t("The CQ Model — Deep Dive", "Model CQ — Pendalaman", "Het CQ-Model — Verdieping")}
          </h2>
          <p style={{ color: bodyText, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            {t(
              "Each dimension builds on the others. A deficit in any one collapses the whole. Click each to go deeper.",
              "Setiap dimensi dibangun di atas yang lain. Kekurangan di salah satu runtuhkan semuanya. Klik masing-masing untuk lebih dalam.",
              "Elke dimensie bouwt voort op de anderen. Een tekort in één ervan laat het geheel instorten. Klik op elk voor meer diepgang."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {cqDimensions.map((d, i) => {
              const isOpen = openDimension === i;
              return (
                <div
                  key={d.number}
                  style={{ background: offWhite, borderRadius: 10, overflow: "hidden", boxShadow: isOpen ? "0 4px 24px oklch(20% 0.08 260 / 0.12)" : "none", transition: "box-shadow 0.2s ease" }}
                >
                  <button
                    onClick={() => setOpenDimension(isOpen ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, color: isOpen ? orangeOklch : "oklch(75% 0.04 260)", lineHeight: 1, minWidth: 44, flexShrink: 0, transition: "color 0.15s ease" }}>
                      {d.number}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navyOklch, margin: "0 0 4px" }}>
                        {lang === "en" ? d.en_title : lang === "id" ? d.id_title : d.nl_title}
                      </p>
                      <p style={{ fontSize: 13, color: bodyText, margin: 0, fontStyle: "italic" }}>
                        {lang === "en" ? d.en_tagline : lang === "id" ? d.id_tagline : d.nl_tagline}
                      </p>
                    </div>
                    <span style={{ color: isOpen ? orangeOklch : "oklch(65% 0.04 260)", fontSize: 22, fontWeight: 300, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", flexShrink: 0 }}>+</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 28px 28px", borderTop: "1px solid oklch(92% 0.01 80)" }}>
                      <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                        <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.85, margin: 0 }}>
                          {lang === "en" ? d.en_desc : lang === "id" ? d.id_desc : d.nl_desc}
                        </p>

                        {/* Low CQ failure mode */}
                        <div style={{ background: "oklch(97% 0.008 25)", border: "1px solid oklch(88% 0.04 30)", borderRadius: 8, padding: "16px 20px" }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "oklch(50% 0.10 30)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                            {t("Failure Mode — Low CQ", "Mode Kegagalan — CQ Rendah", "Faalvorm — Lage CQ")}
                          </p>
                          <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                            {lang === "en" ? d.en_low : lang === "id" ? d.id_low : d.nl_low}
                          </p>
                        </div>

                        {/* Scenario */}
                        <div style={{ borderLeft: `3px solid ${orangeOklch}`, paddingLeft: 20 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: orangeOklch, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                            {t("In Practice", "Dalam Praktik", "In de Praktijk")}
                          </p>
                          <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                            {lang === "en" ? d.en_scenario : lang === "id" ? d.id_scenario : d.nl_scenario}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SECTION 4: THE CQ GAP IN ASIAN/AFRICAN CONTEXTS ───────────────── */}
      {/* Format: Editorial essay with bold statement callouts */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("A Non-Western Lens", "Lensa Non-Barat", "Een Niet-Westers Perspectief")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navyOklch, marginBottom: 32, lineHeight: 1.2 }}>
          {t("When You Are the Cultural Minority", "Ketika Anda Adalah Minoritas Budaya", "Wanneer Jij de Culturele Minderheid Bent")}
        </h2>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 24 }}>
          {t(
            "Here is the problem with most CQ training: it was built for Westerners navigating non-Western contexts. The dominant narrative assumes you are the outsider crossing into someone else's culture — usually a white, Western, educated professional entering Asia, Africa, or the Middle East.",
            "Inilah masalah dengan sebagian besar pelatihan CQ: itu dibangun untuk orang Barat yang bernavigasi konteks non-Barat. Narasi dominan mengasumsikan Anda adalah orang luar yang memasuki budaya orang lain — biasanya profesional berkulit putih, Barat, berpendidikan yang memasuki Asia, Afrika, atau Timur Tengah.",
            "Hier is het probleem met de meeste CQ-training: het werd gebouwd voor Westerlingen die niet-westerse contexten navigeren. De dominante vertelling veronderstelt dat je de buitenstaander bent die de cultuur van iemand anders binnentreedt — gewoonlijk een witte, westerse, opgeleide professional die Azië, Afrika of het Midden-Oosten binnenstapt."
          )}
        </p>

        {/* Bold statement callout */}
        <div style={{ background: navyOklch, borderRadius: 10, padding: "28px 36px", margin: "32px 0" }}>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 27px)", color: offWhite, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
            {t(
              "But what about the Filipino leader navigating a Korean-dominated church? The Nigerian pastor working under Swiss mission leadership? The Indonesian team member in a Dutch-founded NGO? CQ cuts both ways — and power matters.",
              "Tapi bagaimana dengan pemimpin Filipina yang bernavigasi di gereja yang didominasi Korea? Pendeta Nigeria yang bekerja di bawah kepemimpinan misi Swiss? Anggota tim Indonesia di LSM yang didirikan Belanda? CQ berlaku dua arah — dan kekuasaan penting.",
              "Maar hoe zit het met de Filipijnse leider die een door Korea gedomineerde kerk navigeert? De Nigeriaanse pastor die werkt onder Zwitserse zendingsleiding? Het Indonesische teamlid in een door Nederland opgerichte NGO? CQ werkt beide kanten op — en macht telt."
            )}
          </p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "When you are the minority culture in your organisation, CQ development looks different. You are already doing the adaptation work every day — often invisibly, often without acknowledgement, often at real personal cost. The emotional labour of constantly translating yourself is exhausting in ways that majority-culture leaders rarely notice.",
            "Ketika Anda adalah budaya minoritas dalam organisasi Anda, pengembangan CQ terlihat berbeda. Anda sudah melakukan pekerjaan adaptasi setiap hari — seringkali tidak terlihat, seringkali tanpa pengakuan, seringkali dengan biaya pribadi yang nyata. Kerja emosional dalam terus-menerus menerjemahkan diri Anda sangat melelahkan dengan cara yang jarang diperhatikan oleh pemimpin budaya mayoritas.",
            "Wanneer je de minderheidscultuur bent in je organisatie, ziet CQ-ontwikkeling er anders uit. Je doet het aanpassingswerk al elke dag — vaak onzichtbaar, vaak zonder erkenning, vaak tegen echte persoonlijke kosten. De emotionele arbeid van jezelf voortdurend vertalen is uitputtend op manieren die leiders van de meerderheidscultuur zelden opmerken."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "CQ is not the same as assimilation. There is a critical difference between adapting your style and abandoning your identity. High CQ does not mean becoming culturally neutral — it means being able to move between cultural registers without losing your core. The Korean leader who learns to lead with Western-style directness in board meetings does not need to stop being Korean. The adaptation is contextual. The identity remains.",
            "CQ tidak sama dengan asimilasi. Ada perbedaan penting antara mengadaptasi gaya Anda dan meninggalkan identitas Anda. CQ tinggi tidak berarti menjadi netral secara budaya — itu berarti mampu bergerak di antara register budaya tanpa kehilangan inti Anda.",
            "CQ is niet hetzelfde als assimilatie. Er is een cruciaal verschil tussen je stijl aanpassen en je identiteit opgeven. Hoge CQ betekent niet cultureel neutraal worden — het betekent in staat zijn tussen culturele registers te bewegen zonder je kern te verliezen."
          )}
        </p>

        <div style={{ background: lightGray, borderRadius: 10, padding: "28px 32px", marginTop: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: navyOklch, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            {t("A Word on Power", "Tentang Kekuasaan", "Een Woord over Macht")}
          </p>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, margin: 0 }}>
            {t(
              "True CQ development in any organisation must include structural honesty: who has power here, whose cultural norms are treated as the default, and who carries the heaviest adaptation burden? If CQ training only asks minority-culture staff to adapt further, it is not CQ — it is compliance dressed in development language. Healthy cross-cultural organisations distribute the adaptation work. They ask the majority culture to move too.",
              "Pengembangan CQ sejati dalam organisasi mana pun harus mencakup kejujuran struktural: siapa yang memiliki kekuasaan di sini, norma budaya siapa yang diperlakukan sebagai default, dan siapa yang menanggung beban adaptasi terbesar? Jika pelatihan CQ hanya meminta staf budaya minoritas untuk beradaptasi lebih jauh, itu bukan CQ — itu adalah kepatuhan yang ditutupi dalam bahasa pengembangan.",
              "Echte CQ-ontwikkeling in elke organisatie moet structurele eerlijkheid omvatten: wie heeft hier macht, wiens culturele normen worden behandeld als de standaard, en wie draagt de zwaarste aanpassingslast? Als CQ-training alleen minderheidscultuurmedewerkers vraagt om verder aan te passen, is het geen CQ — het is compliance gekleed in ontwikkelingstaal."
            )}
          </p>
        </div>
      </div>

      {/* ─── SECTION 5: HOW TO BUILD YOUR CQ — LEVEL SYSTEM ────────────────── */}
      {/* Format: Visual level progression cards with numbered actions */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Development Path", "Jalur Pengembangan", "Ontwikkelingspad")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navyOklch, marginBottom: 12, lineHeight: 1.2 }}>
            {t("How to Build Your CQ", "Cara Membangun CQ Anda", "Hoe Je Je CQ Opbouwt")}
          </h2>
          <p style={{ color: bodyText, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            {t(
              "CQ is not a personality trait — it is a practiced discipline. These three levels are progressive. Don't skip ahead.",
              "CQ bukan sifat kepribadian — ini adalah disiplin yang dipraktikkan. Tiga tingkat ini bersifat progresif. Jangan melompat ke depan.",
              "CQ is geen persoonlijkheidstrek — het is een geoefende discipline. Deze drie niveaus zijn progressief. Sla niet vooruit."
            )}
          </p>

          {/* Level progress indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 48, overflow: "hidden", borderRadius: 8 }}>
            {developmentLevels.map((level, i) => (
              <div
                key={level.level}
                style={{ flex: 1, background: level.color, padding: "12px 16px", textAlign: "center", position: "relative" }}
              >
                <p style={{ color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 2px", opacity: 0.8 }}>
                  {t("Level", "Tingkat", "Niveau")} {level.level}
                </p>
                <p style={{ color: "white", fontSize: 14, fontWeight: 700, margin: 0 }}>
                  {lang === "en" ? level.en_label : lang === "id" ? level.id_label : level.nl_label}
                </p>
                {i < developmentLevels.length - 1 && (
                  <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, background: level.color, clipPath: "polygon(0 0, 100% 50%, 0 100%)", zIndex: 1 }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {developmentLevels.map((level) => (
              <div
                key={level.level}
                style={{ background: offWhite, borderRadius: 12, overflow: "hidden", borderTop: `4px solid ${level.color}` }}
              >
                <div style={{ padding: "28px 32px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 700, color: level.color, lineHeight: 1 }}>{level.level}</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navyOklch, margin: 0 }}>
                        {lang === "en" ? level.en_label : lang === "id" ? level.id_label : level.nl_label}
                      </p>
                      <p style={{ fontSize: 13, color: bodyText, margin: 0, fontStyle: "italic" }}>
                        {lang === "en" ? level.en_subtitle : lang === "id" ? level.id_subtitle : level.nl_subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "20px 32px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {level.actions.map((action, ai) => (
                    <div key={ai} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: level.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{ai + 1}</span>
                      </div>
                      <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                        {lang === "en" ? action.en : lang === "id" ? action.id : action.nl}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── IMAGE 2 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px 0" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image
            src="/resources/cultural-intelligence-2.jpg"
            alt="Reflective faith-anchored leadership in an Asian context"
            width={1312}
            height={736}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t("Cultural intelligence grows from the inside out — grounded in identity, not performance.", "Kecerdasan budaya tumbuh dari dalam ke luar — berakar pada identitas, bukan penampilan.", "Culturele intelligentie groeit van binnenuit — geworteld in identiteit, niet in prestatie.")}
        </p>
      </div>

      {/* ─── SECTION 6: CLOSING REFLECTION + FAITH ANCHOR ───────────────────── */}
      {/* Format: Scripture callout (Cormorant) + journal questions grid */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("Closing Reflection", "Refleksi Penutup", "Slotreflectie")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navyOklch, marginBottom: 32, lineHeight: 1.2 }}>
          {t("Why This Matters Eternally", "Mengapa Ini Penting Secara Abadi", "Waarom Dit Eeuwig Telt")}
        </h2>

        {/* Scripture callout */}
        <div style={{ background: navyOklch, borderRadius: 12, padding: "40px 44px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.4 }} />
          <div style={{ position: "absolute", bottom: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.3 }} />
          <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, position: "relative" }}>
            {t("Scripture", "Kitab Suci", "Schriftuur")}
          </p>
          <blockquote style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.65, fontStyle: "italic", margin: "0 0 20px", position: "relative" }}>
            {t(
              '"From one man he made all the nations, that they should inhabit the whole earth; and he marked out their appointed times in history and the boundaries of their lands. God did this so that they would seek him and perhaps reach out for him and find him, though he is not far from any one of us."',
              '"Dari satu orang Ia telah menjadikan semua bangsa dan umat manusia untuk mendiami seluruh muka bumi dan Ia telah menentukan musim-musim bagi mereka dan batas-batas kediaman mereka, supaya mereka mencari Dia dan mudah-mudahan menjamah dan menemukan Dia, walaupun Ia tidak jauh dari kita masing-masing."',
              '"Van één mens heeft hij alle volken gemaakt om de hele aarde te bewonen; hij heeft de tijden die voor hen bestemd zijn en de grenzen van hun woongebied vastgesteld. Zijn doel was dat ze hem zouden zoeken, dat ze al tastend naar hem op zoek zouden gaan en hem zouden vinden, terwijl hij toch niet ver van ons is."'
            )}
          </blockquote>
          <p style={{ color: orangeOklch, fontSize: 14, fontWeight: 600, margin: 0, position: "relative" }}>
            {t("Acts 17:26–27 (NIV)", "Kisah Para Rasul 17:26–27", "Handelingen 17:26–27")}
          </p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Every culture you encounter is not an obstacle to the gospel — it is a context in which God has been at work long before you arrived. The diversity of nations is not a problem to be managed. It is, according to Acts 17, a deliberate design — God placed every people in their time and place so that they might seek him.",
            "Setiap budaya yang Anda temui bukan penghalang bagi Injil — itu adalah konteks di mana Allah telah bekerja jauh sebelum Anda tiba. Keragaman bangsa-bangsa bukan masalah yang harus dikelola. Menurut Kisah Para Rasul 17, itu adalah desain yang disengaja — Allah menempatkan setiap orang di waktu dan tempat mereka sehingga mereka dapat mencari-Nya.",
            "Elke cultuur die je tegenkomt is geen obstakel voor het evangelie — het is een context waarin God aan het werk was lang voordat jij arriveerde. De diversiteit van volken is geen probleem om te beheren. Het is, volgens Handelingen 17, een bewust ontwerp — God plaatste elk volk in hun tijd en plaats zodat ze hem zouden zoeken."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 48 }}>
          {t(
            "This means cross-cultural intelligence is not just a professional competency. It is a form of faithfulness. When you develop your CQ, you are taking seriously the world God made — the world in which his image is distributed across every tribe and tongue and people and nation (Rev 5:9). To dismiss a culture you do not understand is, in a real sense, to dismiss part of the image of God. And to grow in CQ is to grow in your capacity to see him more fully.",
            "Ini berarti kecerdasan lintas budaya bukan hanya kompetensi profesional. Ini adalah bentuk kesetiaan. Ketika Anda mengembangkan CQ Anda, Anda mengambil dengan serius dunia yang Allah ciptakan — dunia di mana gambar-Nya tersebar di setiap suku dan lidah dan orang dan bangsa (Why 5:9).",
            "Dit betekent dat interculturele intelligentie niet alleen een professionele competentie is. Het is een vorm van trouw. Wanneer je je CQ ontwikkelt, neem je de wereld die God maakte serieus — de wereld waarin zijn beeld verspreid is over elke stam en taal en volk en natie (Op 5:9)."
          )}
        </p>

        {/* Journal Questions Grid */}
        <div style={{ borderTop: `3px solid ${orangeOklch}`, paddingTop: 40 }}>
          <p style={{ color: orangeOklch, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            {t("Journal Questions", "Pertanyaan Jurnal", "Journaalvragen")}
          </p>
          <p style={{ color: bodyText, fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            {t(
              "Take time with each. These are not quiz questions — they are invitations to grow.",
              "Luangkan waktu untuk masing-masing. Ini bukan pertanyaan kuis — ini adalah undangan untuk bertumbuh.",
              "Neem de tijd voor elk. Dit zijn geen quizvragen — het zijn uitnodigingen om te groeien."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {reflectionQuestions.map((q) => (
              <div
                key={q.roman}
                style={{ background: lightGray, borderRadius: 10, padding: "24px 24px 24px 20px", display: "flex", gap: 16, alignItems: "flex-start", borderLeft: `3px solid ${orangeOklch}` }}
              >
                <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: orangeOklch, lineHeight: 1, minWidth: 24, flexShrink: 0, paddingTop: 2 }}>{q.roman}</span>
                <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                  {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA FOOTER ─────────────────────────────────────────────────────── */}
      <div style={{ background: navyOklch, padding: "72px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: orangeOklch }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: offWhite, marginBottom: 16, lineHeight: 1.2 }}>
            {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
          </h2>
          <p style={{ color: "oklch(75% 0.04 260)", fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
            {t(
              "Explore more resources to deepen your cross-cultural leadership.",
              "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.",
              "Verken meer bronnen om je intercultureel leiderschap te verdiepen."
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/resources"
              style={{ display: "inline-block", padding: "14px 32px", background: orangeOklch, color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none", letterSpacing: "0.02em" }}
            >
              {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
            </Link>
            <Link
              href="/resources/power-distance"
              style={{ display: "inline-block", padding: "14px 32px", border: "1px solid oklch(45% 0.05 260)", color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
            >
              {t("Power Distance →", "Jarak Kekuasaan →", "Machtafstand →")}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
