"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

function t(en: string, id: string, nl: string, lang: Lang): string {
  if (lang === "id") return id;
  if (lang === "nl") return nl;
  return en;
}

const QUOTES = [
  { quote: "Procrastination is the thief of time.", author: "Edward Young" },
  { quote: "You may delay, but time will not.", author: "Benjamin Franklin" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "You don't have to see the whole staircase. Just take the first step.", author: "Martin Luther King Jr." },
  { quote: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { quote: "A year from now you may wish you had started today.", author: "Karen Lamb" },
];

const ROOT_CAUSES = [
  {
    label: { en: "Fear of Failure", id: "Takut Gagal", nl: "Faalangst" },
    color: "oklch(42% 0.14 260)",
    desc: {
      en: "Procrastination becomes a protective shield. If I never finish — or never start — I can never fail. The problem is that avoiding the task feels safe in the short term but creates a far bigger failure over time.",
      id: "Penundaan menjadi tameng pelindung. Jika saya tidak pernah selesai — atau tidak pernah memulai — saya tidak bisa gagal. Masalahnya, menghindari tugas terasa aman dalam jangka pendek tetapi menciptakan kegagalan jauh lebih besar seiring waktu.",
      nl: "Uitstelgedrag wordt een beschermend schild. Als ik nooit klaar kom — of nooit begin — kan ik ook nooit falen. Het probleem is dat het vermijden van een taak op korte termijn veilig voelt, maar op lange termijn tot een veel groter falen leidt.",
    },
    signs: {
      en: ["You start tasks but leave them 90% done", "You say 'I just need a bit more time' indefinitely", "You feel relief when someone else takes over"],
      id: ["Anda memulai tugas tapi meninggalkannya 90% selesai", "Anda berkata 'Saya butuh sedikit lebih banyak waktu' tanpa batas", "Anda merasa lega ketika orang lain mengambil alih"],
      nl: ["Je begint taken maar laat ze voor 90% af", "Je zegt 'Ik heb nog even meer tijd nodig' eindeloos", "Je voelt opluchting als iemand anders het overneemt"],
    },
    strategy: {
      en: "Separate completing the task from the outcome. Your worth is not measured by the result — only by your faithfulness to show up. Ask: what is the smallest version of this I could finish today?",
      id: "Pisahkan antara menyelesaikan tugas dari hasilnya. Nilai Anda tidak diukur dari hasil — hanya dari kesetiaan Anda untuk hadir. Tanyakan: apa versi terkecil dari ini yang bisa saya selesaikan hari ini?",
      nl: "Maak onderscheid tussen de taak afmaken en de uitkomst. Je waarde wordt niet gemeten aan het resultaat — alleen aan je trouw om op te komen dagen. Vraag je af: wat is de kleinste versie die ik vandaag kan afronden?",
    },
  },
  {
    label: { en: "Perfectionism", id: "Perfeksionisme", nl: "Perfectionisme" },
    color: "oklch(44% 0.14 300)",
    desc: {
      en: "For perfectionists, starting means risking an imperfect result. So they don't start at all — or they start and restart endlessly. Perfectionism disguises itself as high standards, but it's often fear wearing a sophisticated mask.",
      id: "Bagi perfeksionis, memulai berarti berisiko menghasilkan sesuatu yang tidak sempurna. Jadi mereka tidak mulai sama sekali — atau mulai dan mulai ulang terus-menerus. Perfeksionisme menyamar sebagai standar tinggi, tetapi seringkali merupakan ketakutan yang memakai topeng canggih.",
      nl: "Voor perfectionisten betekent beginnen het risico nemen op een onvolmaakt resultaat. Dus beginnen ze helemaal niet — of ze beginnen en beginnen steeds opnieuw. Perfectionisme vermomt zich als hoge standaarden, maar het is vaak angst in een verfijnd masker.",
    },
    signs: {
      en: ["Excessive research before beginning anything", "Redoing work that was already adequate", "All-or-nothing thinking: if it's not perfect, it's not worth doing"],
      id: ["Riset berlebihan sebelum memulai apapun", "Mengerjakan ulang pekerjaan yang sudah cukup baik", "Pemikiran hitam-putih: jika tidak sempurna, tidak layak dilakukan"],
      nl: ["Overmatig onderzoek doen voordat je ook maar begint", "Werk opnieuw doen dat al voldoende was", "Alles-of-niets denken: als het niet perfect is, is het het niet waard"],
    },
    strategy: {
      en: "Set a minimum viable standard before you begin. Not 'what does excellent look like?' but 'what does done look like?' Imperfect action beats perfect inaction every time.",
      id: "Tetapkan standar minimum yang bisa diterima sebelum Anda mulai. Bukan 'seperti apa hasil yang luar biasa?' tapi 'seperti apa hasil yang selesai?' Tindakan tidak sempurna selalu lebih baik dari kelambanan sempurna.",
      nl: "Stel een minimale werkbare standaard in voordat je begint. Niet 'hoe ziet uitstekend eruit?' maar 'hoe ziet klaar eruit?' Onvolmaakte actie wint het altijd van perfecte stilstand.",
    },
  },
  {
    label: { en: "Overwhelm", id: "Kewalahan", nl: "Overweldiging" },
    color: "oklch(48% 0.18 25)",
    desc: {
      en: "When a task feels too large or too complex, the brain interprets it as a threat. The overwhelmed mind doesn't break it down — it freezes or flees. This is often why creative and complex work triggers more procrastination than routine tasks.",
      id: "Ketika tugas terasa terlalu besar atau terlalu kompleks, otak menafsirkannya sebagai ancaman. Pikiran yang kewalahan tidak memecahnya — melainkan membekukan atau melarikan diri. Inilah mengapa pekerjaan kreatif dan kompleks seringkali memicu penundaan lebih besar dari tugas rutin.",
      nl: "Als een taak te groot of te complex aanvoelt, interpreteert het brein dit als een bedreiging. Het overweldigde brein breekt het niet op — het bevriest of vlucht. Dit verklaart waarom creatief en complex werk vaker uitstelgedrag uitlokt dan routinetaken.",
    },
    signs: {
      en: ["You stare at the blank page for too long", "You feel paralyzed even though you know what needs doing", "Small tasks multiply because the big one never gets touched"],
      id: ["Anda menatap halaman kosong terlalu lama", "Anda merasa lumpuh meskipun tahu apa yang perlu dilakukan", "Tugas kecil bertumpuk karena tugas besar tidak pernah disentuh"],
      nl: ["Je staart te lang naar de blanco pagina", "Je voelt je verlamd, ook al weet je wat er gedaan moet worden", "Kleine taken stapelen zich op omdat de grote nooit aangepakt wordt"],
    },
    strategy: {
      en: "Break the task into the smallest possible first action — not 'write the report' but 'open the document.' Research shows that starting anything, even imperfectly, activates momentum. The Zeigarnik effect: your brain wants to finish what it starts.",
      id: "Pecah tugas menjadi tindakan pertama yang sekecil mungkin — bukan 'tulis laporan' tapi 'buka dokumen.' Penelitian menunjukkan bahwa memulai apapun, meskipun tidak sempurna, mengaktifkan momentum. Efek Zeigarnik: otak Anda ingin menyelesaikan apa yang sudah dimulai.",
      nl: "Breek de taak op in de kleinst mogelijke eerste actie — niet 'schrijf het rapport' maar 'open het document.' Onderzoek toont aan dat ergens mee beginnen, zelfs imperfect, momentum creëert. Het Zeigarnik-effect: je brein wil afmaken wat het begonnen is.",
    },
  },
  {
    label: { en: "Instant Gratification", id: "Kepuasan Instan", nl: "Onmiddellijke Bevrediging" },
    color: "oklch(46% 0.16 145)",
    desc: {
      en: "Psychologist Piers Steel's research identifies delay discounting as central to procrastination: we undervalue future rewards and overvalue immediate pleasure. Social media, snacks, or any task with a faster payoff will always win against long-term work — unless you design your environment intentionally.",
      id: "Penelitian psikolog Piers Steel mengidentifikasi penundaan imbalan sebagai inti penundaan: kita meremehkan imbalan masa depan dan terlalu menilai kesenangan langsung. Media sosial, camilan, atau tugas apapun dengan hasil lebih cepat akan selalu menang melawan pekerjaan jangka panjang — kecuali Anda merancang lingkungan dengan sengaja.",
      nl: "Onderzoek van psycholoog Piers Steel identificeert uitstelgedrag bij beloningen als centraal: we onderwaarderen toekomstige beloningen en overwaarderen onmiddellijk plezier. Sociale media, snacks of welke taak met een snellere beloning dan ook wint het altijd van langetermijnwerk — tenzij je je omgeving bewust inricht.",
    },
    signs: {
      en: ["You consistently choose comfortable tasks over important ones", "Short-term distraction feels genuinely urgent", "You know you're procrastinating and still can't stop"],
      id: ["Anda selalu memilih tugas nyaman daripada tugas penting", "Gangguan jangka pendek terasa benar-benar mendesak", "Anda tahu sedang menunda tapi tetap tidak bisa berhenti"],
      nl: ["Je kiest consequent comfortabele taken boven belangrijke", "Kortetermijnafleiding voelt echt urgent aan", "Je weet dat je aan het uitstellen bent maar kunt niet stoppen"],
    },
    strategy: {
      en: "Make the important task more immediately rewarding, and make distraction harder. Use the 5-minute rule: commit to working for just 5 minutes. Starting changes the emotional calculus. Remove temptations from your environment before you sit down to work.",
      id: "Buat tugas penting lebih langsung menguntungkan, dan buat gangguan lebih sulit. Gunakan aturan 5 menit: komit untuk bekerja selama 5 menit saja. Memulai mengubah kalkulasi emosional. Singkirkan gangguan dari lingkungan Anda sebelum duduk untuk bekerja.",
      nl: "Maak de belangrijke taak meer onmiddellijk lonend en maak afleiding moeilijker. Gebruik de 5-minuten regel: commit je om slechts 5 minuten te werken. Beginnen verandert de emotionele berekening. Verwijder verleidingen uit je omgeving voordat je gaat zitten werken.",
    },
  },
  {
    label: { en: "Fear of the Unknown", id: "Takut Ketidakpastian", nl: "Angst voor het Onbekende" },
    color: "oklch(40% 0.12 60)",
    desc: {
      en: "When we can't predict the outcome — when the path is unclear or the standards are ambiguous — anxiety fills the gap. We delay not because we're lazy, but because the task feels fundamentally uncertain.",
      id: "Ketika kita tidak dapat memprediksi hasilnya — ketika jalurnya tidak jelas atau standarnya ambigu — kecemasan mengisi kekosongan itu. Kita menunda bukan karena malas, tetapi karena tugas terasa sangat tidak pasti secara fundamental.",
      nl: "Als we de uitkomst niet kunnen voorspellen — als het pad onduidelijk is of de standaarden ambigu — vult angst die leegte. We stellen uit niet omdat we lui zijn, maar omdat de taak fundamenteel onzeker aanvoelt.",
    },
    signs: {
      en: ["New projects or roles trigger more procrastination than familiar ones", "You ask for excessive reassurance before acting", "You confuse 'I don't know enough yet' with 'I'm not ready'"],
      id: ["Proyek atau peran baru memicu lebih banyak penundaan daripada yang familiar", "Anda meminta kepastian berlebihan sebelum bertindak", "Anda mengacaukan 'saya belum cukup tahu' dengan 'saya belum siap'"],
      nl: ["Nieuwe projecten of rollen leiden tot meer uitstelgedrag dan vertrouwde", "Je vraagt overmatig om bevestiging voordat je handelt", "Je verwart 'ik weet nog niet genoeg' met 'ik ben er nog niet klaar voor'"],
    },
    strategy: {
      en: "Clarify the first concrete action, not the entire outcome. Ask: 'What would a person who wasn't afraid do next?' Then do that one thing. Uncertainty doesn't go away — you just have to act into it.",
      id: "Perjelas tindakan konkret pertama, bukan keseluruhan hasilnya. Tanyakan: 'Apa yang akan dilakukan orang yang tidak takut selanjutnya?' Kemudian lakukan satu hal itu. Ketidakpastian tidak hilang — Anda hanya perlu bertindak di tengahnya.",
      nl: "Verduidelijk de eerste concrete actie, niet de gehele uitkomst. Vraag je af: 'Wat zou iemand die niet bang was als volgende doen?' Doe dan dat ene ding. Onzekerheid verdwijnt niet — je moet er gewoon in handelen.",
    },
  },
  {
    label: { en: "Low Self-Confidence", id: "Kurang Percaya Diri", nl: "Laag Zelfvertrouwen" },
    color: "oklch(44% 0.12 195)",
    desc: {
      en: "At the core, some procrastination is a belief: 'I'm not capable of doing this well.' So we delay, waiting until we feel more confident. But confidence is not a prerequisite for action — it's a consequence of it. We become capable by doing, not by waiting until we feel ready.",
      id: "Pada intinya, beberapa penundaan adalah sebuah keyakinan: 'Saya tidak mampu melakukan ini dengan baik.' Jadi kita menunda, menunggu sampai merasa lebih percaya diri. Tapi kepercayaan diri bukanlah prasyarat untuk bertindak — itu adalah konsekuensinya. Kita menjadi mampu dengan melakukan, bukan dengan menunggu sampai kita merasa siap.",
      nl: "In de kern is sommig uitstelgedrag een overtuiging: 'Ik ben niet in staat dit goed te doen.' Dus stellen we uit en wachten we totdat we ons zelfverzekerder voelen. Maar zelfvertrouwen is geen vereiste voor actie — het is een gevolg ervan. We worden bekwaam door te doen, niet door te wachten tot we ons klaar voelen.",
    },
    signs: {
      en: ["Comparing your work unfavorably to others' before you even start", "Dismissing compliments on past work", "The inner voice says 'who do you think you are?'"],
      id: ["Membandingkan pekerjaan Anda secara tidak menguntungkan dengan orang lain bahkan sebelum Anda mulai", "Meremehkan pujian atas pekerjaan masa lalu", "Suara dalam hati berkata 'siapa yang kamu kira kamu ini?'"],
      nl: ["Je vergelijkt je werk ongunstig met anderen, nog voordat je begonnen bent", "Je wuift complimenten over eerder werk weg", "De innerlijke stem zegt: 'Wie denk je wel dat je bent?'"],
    },
    strategy: {
      en: "Reframe the task as an experiment, not a performance. You don't have to be the best — you have to be faithful to the work. Ask yourself: 'What would I attempt if I knew I could not fail?' Then take one step toward that answer.",
      id: "Ubah tugas sebagai eksperimen, bukan pertunjukan. Anda tidak harus menjadi yang terbaik — Anda harus setia pada pekerjaan. Tanyakan pada diri sendiri: 'Apa yang akan saya coba jika saya tahu tidak bisa gagal?' Kemudian ambil satu langkah menuju jawaban itu.",
      nl: "Herdefinieer de taak als een experiment, niet als een optreden. Je hoeft niet de beste te zijn — je moet trouw zijn aan het werk. Vraag jezelf: 'Wat zou ik proberen als ik wist dat ik niet kon falen?' Zet dan één stap in die richting.",
    },
  },
];

const TECHNIQUES = [
  {
    name: { en: "Eat the Frog", id: "Makan Katak", nl: "Eet de Kikker" },
    origin: "Brian Tracy",
    desc: {
      en: "Identify your most important — and usually most avoided — task. Do it first, before anything else in your day. Once the frog is eaten, everything else feels easy.",
      id: "Identifikasi tugas paling penting — dan biasanya paling dihindari. Lakukan pertama, sebelum hal lain dalam hari Anda. Setelah katak dimakan, segalanya terasa mudah.",
      nl: "Identificeer je meest belangrijke — en doorgaans meest vermeden — taak. Doe het als eerste, voor al het andere in je dag. Zodra de kikker op is, voelt de rest gemakkelijk.",
    },
    steps: {
      en: ["Identify the one task you're most avoiding today.", "Block 60–90 minutes at the start of your day for it.", "Close all notifications. Start immediately."],
      id: ["Identifikasi satu tugas yang paling Anda hindari hari ini.", "Blokir 60–90 menit di awal hari Anda untuk itu.", "Tutup semua notifikasi. Mulai segera."],
      nl: ["Identificeer de ene taak die je vandaag het meest vermijdt.", "Plan 60–90 minuten aan het begin van je dag hiervoor in.", "Sluit alle meldingen. Begin direct."],
    },
  },
  {
    name: { en: "The 5-Minute Rule", id: "Aturan 5 Menit", nl: "De 5-Minuten Regel" },
    origin: "Behavior Science",
    desc: {
      en: "Commit to working on a task for only 5 minutes. That's the whole commitment. Most of the time, you'll keep going — because starting is the hardest part. Motivation follows action, not the other way around.",
      id: "Komit untuk mengerjakan tugas hanya selama 5 menit. Itu seluruh komitmennya. Sebagian besar waktu, Anda akan terus — karena memulailah bagian tersulit. Motivasi mengikuti tindakan, bukan sebaliknya.",
      nl: "Commit je om slechts 5 minuten aan een taak te werken. Dat is de hele toezegging. Meestal ga je door — want beginnen is het moeilijkste deel. Motivatie volgt actie, niet andersom.",
    },
    steps: {
      en: ["Set a timer for 5 minutes.", "Begin the task — no distractions.", "After 5 minutes, you may stop. But you probably won't."],
      id: ["Atur timer selama 5 menit.", "Mulai tugasnya — tanpa gangguan.", "Setelah 5 menit, Anda boleh berhenti. Tapi kemungkinan Anda tidak akan."],
      nl: ["Stel een timer in voor 5 minuten.", "Begin met de taak — zonder afleidingen.", "Na 5 minuten mag je stoppen. Maar waarschijnlijk doe je dat niet."],
    },
  },
  {
    name: { en: "Implementation Intentions", id: "Niat Implementasi", nl: "Implementatie-Intenties" },
    origin: "Peter Gollwitzer",
    desc: {
      en: "Research shows that deciding when and where you'll do something dramatically increases follow-through. 'I will work on the proposal on Tuesday from 9–11am at my desk' is 2–3x more likely to happen than 'I'll work on the proposal this week.'",
      id: "Penelitian menunjukkan bahwa memutuskan kapan dan di mana Anda akan melakukan sesuatu secara dramatis meningkatkan tindak lanjut. 'Saya akan mengerjakan proposal pada Selasa dari jam 9–11 di meja saya' 2–3x lebih mungkin terjadi daripada 'Saya akan mengerjakan proposal minggu ini.'",
      nl: "Onderzoek toont aan dat beslissen wanneer en waar je iets gaat doen de kans op nakoming dramatisch vergroot. 'Ik werk aan het voorstel op dinsdag van 9–11 uur aan mijn bureau' heeft 2–3x meer kans van slagen dan 'Ik werk deze week aan het voorstel.'",
    },
    steps: {
      en: ["State the task specifically: not 'work on project' but 'write the introduction.'", "Assign a time and place: 'Tuesday, 9am, my desk.'", "Remove friction: have everything you need ready the night before."],
      id: ["Nyatakan tugasnya secara spesifik: bukan 'kerjakan proyek' tapi 'tulis pengantar.'", "Tentukan waktu dan tempat: 'Selasa, jam 9, di meja saya.'", "Hilangkan hambatan: siapkan semua yang Anda butuhkan malam sebelumnya."],
      nl: ["Formuleer de taak specifiek: niet 'werk aan project' maar 'schrijf de inleiding.'", "Wijs een tijd en plek aan: 'Dinsdag, 9 uur, mijn bureau.'", "Verwijder obstakels: zorg dat je alles klaar hebt de avond ervoor."],
    },
  },
  {
    name: { en: "The Pomodoro Technique", id: "Teknik Pomodoro", nl: "De Pomodoro Techniek" },
    origin: "Francesco Cirillo",
    desc: {
      en: "Work in focused 25-minute intervals followed by 5-minute breaks. After 4 rounds, take a longer 20-minute break. The fixed time frames reduce the perceived enormity of tasks and build sustainable momentum.",
      id: "Bekerja dalam interval terfokus 25 menit diikuti istirahat 5 menit. Setelah 4 putaran, ambil istirahat lebih lama 20 menit. Kerangka waktu tetap mengurangi besarnya tugas yang dirasakan dan membangun momentum yang berkelanjutan.",
      nl: "Werk in gefocuste intervallen van 25 minuten, gevolgd door pauzes van 5 minuten. Na 4 rondes neem je een langere pauze van 20 minuten. De vaste tijdsblokken verminderen de omvang die taken in je hoofd hebben en bouwen duurzame momentum op.",
    },
    steps: {
      en: ["Set a timer for 25 minutes.", "Work with total focus until it rings.", "Take a 5-minute break. Repeat 4 times, then take a longer break."],
      id: ["Atur timer selama 25 menit.", "Bekerja dengan fokus penuh sampai berbunyi.", "Ambil istirahat 5 menit. Ulangi 4 kali, lalu ambil istirahat lebih lama."],
      nl: ["Stel een timer in voor 25 minuten.", "Werk met volledige focus totdat hij afgaat.", "Neem een pauze van 5 minuten. Herhaal 4 keer, dan een langere pauze."],
    },
  },
];

const INNER_DIALOGUE = [
  {
    fixed: { en: "I'll feel more like it tomorrow.", id: "Besok saya akan lebih siap.", nl: "Morgen voel ik er meer voor." },
    reframe: { en: "Motivation follows action. I don't need to feel ready — I need to start.", id: "Motivasi mengikuti tindakan. Saya tidak perlu merasa siap — saya perlu memulai.", nl: "Motivatie volgt actie. Ik hoef me er niet klaar voor te voelen — ik moet beginnen." },
  },
  {
    fixed: { en: "This needs to be perfect before I can share it.", id: "Ini harus sempurna sebelum bisa saya bagikan.", nl: "Dit moet perfect zijn voordat ik het kan delen." },
    reframe: { en: "Progress is more valuable than perfection. What's the smallest version I can finish today?", id: "Kemajuan lebih berharga dari kesempurnaan. Apa versi terkecil yang bisa saya selesaikan hari ini?", nl: "Vooruitgang is waardevoller dan perfectie. Wat is de kleinste versie die ik vandaag kan afronden?" },
  },
  {
    fixed: { en: "I don't know where to start.", id: "Saya tidak tahu harus mulai dari mana.", nl: "Ik weet niet waar ik moet beginnen." },
    reframe: { en: "I don't need to know all the steps — just the first one. What's one concrete action I can take right now?", id: "Saya tidak perlu mengetahui semua langkah — hanya yang pertama. Apa satu tindakan konkret yang bisa saya lakukan sekarang?", nl: "Ik hoef niet alle stappen te kennen — alleen de eerste. Welke ene concrete actie kan ik nu nemen?" },
  },
  {
    fixed: { en: "I work better under pressure.", id: "Saya bekerja lebih baik di bawah tekanan.", nl: "Ik werk beter onder druk." },
    reframe: { en: "I'm using urgency to avoid the discomfort of doing hard work without external pressure. What happens if I create my own deadline?", id: "Saya menggunakan urgensi untuk menghindari ketidaknyamanan melakukan pekerjaan sulit tanpa tekanan eksternal. Apa yang terjadi jika saya membuat tenggat waktu sendiri?", nl: "Ik gebruik urgentie om het ongemak te vermijden van hard werken zonder externe druk. Wat gebeurt er als ik mijn eigen deadline stel?" },
  },
  {
    fixed: { en: "This is so overwhelming I can't even think about it.", id: "Ini sangat menekan sehingga saya bahkan tidak bisa memikirkannya.", nl: "Dit is zo overweldigend dat ik er niet eens aan kan denken." },
    reframe: { en: "Break it into the smallest possible unit. 'Open the document' is a complete action.", id: "Pecah menjadi unit sekecil mungkin. 'Buka dokumennya' adalah tindakan yang lengkap.", nl: "Breek het op in de kleinst mogelijke eenheid. 'Open het document' is een volledige actie." },
  },
];

export default function OvercomingProcrastinationClient({
  userPathway,
  isSaved,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [activeRootCause, setActiveRootCause] = useState<number | null>(null);
  const [activeTechnique, setActiveTechnique] = useState<number | null>(0);
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("overcoming-procrastination");
      setSaved(true);
    });
  }

  const rc = activeRootCause !== null ? ROOT_CAUSES[activeRootCause] : null;
  const tech = activeTechnique !== null ? TECHNIQUES[activeTechnique] : null;

  const langBtnBase: React.CSSProperties = { padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", border: "none" };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>{t("Guide", "Panduan", "Gids", lang)}</span>
            
          </div>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development · Worksheet", "Pengembangan Pribadi · Lembar Kerja", "Persoonlijke Ontwikkeling · Werkblad", lang)}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Overcoming Procrastination", "Mengatasi Penundaan", "Uitstelgedrag Overwinnen", lang)}
          </h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 32 }}>
            {t(
              "Procrastination isn't laziness. It's an emotion regulation problem — and that means it can be understood, addressed, and overcome with the right tools and honest self-awareness.",
              "Penundaan bukan kemalasan. Ini adalah masalah regulasi emosi — dan itu berarti bisa dipahami, diatasi, dan dikalahkan dengan alat yang tepat dan kesadaran diri yang jujur.",
              "Uitstelgedrag is geen luiheid. Het is een emotieregulatieprobleem — en dat betekent dat het begrepen, aangepakt en overwonnen kan worden met de juiste tools en eerlijke zelfkennis.",
              lang
            )}
          </p>

          {/* Language selector */}

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "13px 28px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…", lang) : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard", lang)}</span>
            )}
          </div>
        </div>
      </section>

      {/* UNDERSTANDING PROCRASTINATION */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 16px" }}>
              {t("Not Laziness — Avoidance", "Bukan Kemalasan — Penghindaran", "Geen Luiheid — Vermijding", lang)}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(38% 0.06 260)", margin: "0 0 16px" }}>
              {t(
                "Research by psychologist Timothy Pychyl shows that procrastination is not a time management problem — it's an emotion regulation problem. We delay tasks not because we're lazy, but because they trigger uncomfortable emotions: anxiety, self-doubt, boredom, frustration, or resentment.",
                "Penelitian psikolog Timothy Pychyl menunjukkan bahwa penundaan bukan masalah manajemen waktu — ini adalah masalah regulasi emosi. Kita menunda tugas bukan karena malas, tetapi karena tugas memicu emosi yang tidak nyaman: kecemasan, keraguan diri, kebosanan, frustrasi, atau kebencian.",
                "Onderzoek van psycholoog Timothy Pychyl toont aan dat uitstelgedrag geen tijdmanagementprobleem is — het is een emotieregulatieprobleem. We stellen taken uit niet omdat we lui zijn, maar omdat ze oncomfortabele emoties oproepen: angst, twijfel, verveling, frustratie of wrok.",
                lang
              )}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(38% 0.06 260)", margin: "0 0 16px" }}>
              {t(
                "In the short term, avoidance works. It removes the discomfort immediately. But it trades a short-term mood fix for a long-term cost: guilt, stress, mounting work, and eroded self-trust.",
                "Dalam jangka pendek, penghindaran berhasil. Ini menghilangkan ketidaknyamanan segera. Tapi itu menukar perbaikan suasana hati jangka pendek dengan biaya jangka panjang: rasa bersalah, stres, pekerjaan yang menumpuk, dan kepercayaan diri yang terkikis.",
                "Op korte termijn werkt vermijding. Het verwijdert het ongemak onmiddellijk. Maar het ruilt een kortetermijn-stemmingsoplossing in voor een langetermijnkost: schuldgevoel, stress, oplopend werk en aangetast zelfvertrouwen.",
                lang
              )}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(38% 0.06 260)", margin: 0 }}>
              {t(
                "The antidote is not willpower — it's self-compassion and strategy. When you understand why you're avoiding something, you can address the actual cause rather than trying to force yourself through it.",
                "Penangkalnya bukan kemauan keras — melainkan belas kasihan diri dan strategi. Ketika Anda memahami mengapa Anda menghindari sesuatu, Anda dapat mengatasi penyebab sebenarnya daripada mencoba memaksakan diri untuk melaluinya.",
                "Het tegengif is geen wilskracht — het is zelfcompassie en strategie. Als je begrijpt waarom je iets vermijdt, kun je de werkelijke oorzaak aanpakken in plaats van jezelf erdoor te forceren.",
                lang
              )}
            </p>
          </div>
          <div>
            <div style={{ background: "oklch(22% 0.10 260)", borderRadius: 10, padding: "28px 32px", marginBottom: 16 }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontStyle: "italic", color: "oklch(90% 0.03 80)", lineHeight: 1.5, margin: "0 0 12px" }}>&ldquo;{t("Procrastination is an emotion regulation problem, not a time management problem.", "Penundaan adalah masalah regulasi emosi, bukan masalah manajemen waktu.", "Uitstelgedrag is een emotieregulatieprobleem, geen tijdmanagementprobleem.", lang)}&rdquo;</p>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.08 260)", margin: 0 }}>— Timothy Pychyl, {t("Researcher", "Peneliti", "Onderzoeker", lang)}</p>
            </div>
            <div style={{ background: "oklch(94% 0.008 260)", borderRadius: 10, padding: "20px 24px" }}>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "oklch(38% 0.06 260)", margin: 0 }}>
                <strong style={{ color: "oklch(22% 0.10 260)" }}>{t("Before you begin:", "Sebelum Anda mulai:", "Voordat je begint:", lang)}</strong>{" "}
                {t(
                  "Changing habits takes time. You'll have relapses — that's normal. If the full change feels too big, start by minimizing the effects rather than eliminating procrastination entirely. Progress, not perfection.",
                  "Mengubah kebiasaan membutuhkan waktu. Anda akan mengalami kemunduran — itu normal. Jika perubahan penuh terasa terlalu besar, mulailah dengan meminimalkan dampaknya daripada menghilangkan penundaan sepenuhnya. Kemajuan, bukan kesempurnaan.",
                  "Gewoonten veranderen kost tijd. Je zult terugvallen — dat is normaal. Als de volledige verandering te groot voelt, begin dan met het minimaliseren van de effecten in plaats van uitstelgedrag volledig te elimineren. Vooruitgang, niet perfectie.",
                  lang
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {QUOTES.map((q, i) => (
              <div key={i} style={{ padding: "20px 24px" }}>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontStyle: "italic", color: "oklch(88% 0.03 80)", lineHeight: 1.55, margin: "0 0 10px" }}>&ldquo;{q.quote}&rdquo;</p>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(58% 0.08 45)", margin: 0 }}>— {q.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOT CAUSES */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("The 6 Root Causes", "6 Penyebab Utama", "De 6 Onderliggende Oorzaken", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 32, lineHeight: 1.65 }}>
            {t("Procrastination is rarely laziness. Select a cause to explore how it shows up and what to do about it.", "Penundaan jarang karena kemalasan. Pilih penyebab untuk menjelajahi bagaimana ia muncul dan apa yang harus dilakukan.", "Uitstelgedrag is zelden luiheid. Selecteer een oorzaak om te ontdekken hoe het zich manifesteert en wat je eraan kunt doen.", lang)}
          </p>

          {/* Cause pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
            {ROOT_CAUSES.map((cause, i) => (
              <button
                key={i}
                onClick={() => setActiveRootCause(activeRootCause === i ? null : i)}
                style={{
                  padding: "10px 18px", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer",
                  border: `2px solid ${activeRootCause === i ? cause.color : "oklch(88% 0.008 260)"}`,
                  background: activeRootCause === i ? cause.color : "white",
                  color: activeRootCause === i ? "white" : "oklch(30% 0.06 260)",
                }}
              >
                {String(i + 1).padStart(2, "0")} {cause.label[lang]}
              </button>
            ))}
          </div>

          {/* Active cause detail */}
          {rc ? (
            <div style={{ background: "white", borderRadius: 12, padding: "40px", boxShadow: "0 2px 16px oklch(20% 0.06 260 / 0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: rc.color, margin: "0 0 20px" }}>{rc.label[lang]}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(30% 0.06 260)", margin: "0 0 24px" }}>{rc.desc[lang]}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                <div style={{ background: "oklch(96% 0.005 260)", borderRadius: 8, padding: "20px 24px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: rc.color, margin: "0 0 12px" }}>
                    {t("Signs You Recognize This", "Tanda-Tanda Ini", "Herken Je Dit?", lang)}
                  </p>
                  {rc.signs[lang].map((sign, si) => (
                    <div key={si} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: si < rc.signs[lang].length - 1 ? 10 : 0 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: rc.color, flexShrink: 0, marginTop: 7 }} />
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: "oklch(35% 0.06 260)", margin: 0 }}>{sign}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: `${rc.color.replace(")", " / 0.06)")}`, borderRadius: 8, padding: "20px 24px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: rc.color, margin: "0 0 12px" }}>
                    {t("What to Do", "Apa yang Harus Dilakukan", "Wat te Doen", lang)}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "oklch(28% 0.06 260)", margin: 0 }}>{rc.strategy[lang]}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 12, padding: "28px", textAlign: "center", color: "oklch(55% 0.05 260)", fontSize: 15, boxShadow: "0 1px 6px oklch(20% 0.06 260 / 0.05)" }}>
              {t("Select a root cause above to explore it in depth.", "Pilih penyebab akar di atas untuk menjelajahinya lebih dalam.", "Selecteer een onderliggende oorzaak hierboven om het diepgaand te verkennen.", lang)}
            </div>
          )}
        </div>
      </section>

      {/* PRACTICAL TECHNIQUES */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Proven Techniques", "Teknik yang Terbukti", "Bewezen Technieken", lang)}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 32, lineHeight: 1.65 }}>
            {t("Techniques that have research or practical backing. Pick one — not all four at once.", "Teknik-teknik yang didukung penelitian atau praktik. Pilih satu — bukan semua empat sekaligus.", "Technieken met onderzoeks- of praktijkbasis. Kies er één — niet alle vier tegelijk.", lang)}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
            {TECHNIQUES.map((tech2, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(activeTechnique === i ? null : i)}
                style={{
                  flex: 1, minWidth: 140, padding: "14px 16px", borderRadius: 8, border: `2px solid ${activeTechnique === i ? "oklch(42% 0.14 260)" : "oklch(88% 0.008 260)"}`,
                  background: activeTechnique === i ? "oklch(42% 0.14 260)" : "white",
                  color: activeTechnique === i ? "white" : "oklch(30% 0.06 260)",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: activeTechnique === i ? "oklch(85% 0.06 260)" : "oklch(52% 0.08 260)", display: "block", marginBottom: 4 }}>{tech2.origin}</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{tech2.name[lang]}</span>
              </button>
            ))}
          </div>

          {tech && (
            <div style={{ background: "white", borderRadius: 12, padding: "36px", boxShadow: "0 2px 16px oklch(20% 0.06 260 / 0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 8px" }}>{tech.name[lang]}</h3>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.08 260)", margin: "0 0 20px" }}>{tech.origin}</p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "oklch(30% 0.06 260)", margin: "0 0 24px" }}>{tech.desc[lang]}</p>
              <div style={{ background: "oklch(95% 0.008 260)", borderRadius: 8, padding: "20px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(42% 0.14 260)", margin: "0 0 12px" }}>
                  {t("How to Apply It", "Cara Menerapkannya", "Hoe Het Toe te Passen", lang)}
                </p>
                <ol style={{ margin: 0, padding: "0 0 0 20px" }}>
                  {tech.steps[lang].map((s, si) => (
                    <li key={si} style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(32% 0.06 260)", marginBottom: si < tech.steps[lang].length - 1 ? 8 : 0 }}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* INNER DIALOGUE REFRAMES */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
          {t("Reframe Your Inner Dialogue", "Ubah Dialog Batin Anda", "Herformuleer Uw Innerlijke Dialoog", lang)}
        </h2>
        <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
          {t(
            "What you tell yourself before and during procrastination either fuels avoidance or creates momentum. These common patterns can be shifted.",
            "Apa yang Anda katakan pada diri sendiri sebelum dan selama penundaan baik mengisi penghindaran atau menciptakan momentum. Pola-pola umum ini dapat diubah.",
            "Wat je jezelf vertelt voor en tijdens uitstelgedrag voedt ofwel vermijding ofwel momentum. Deze veelvoorkomende patronen kunnen worden omgebogen.",
            lang
          )}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {INNER_DIALOGUE.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", background: "white", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 6px oklch(20% 0.06 260 / 0.06)" }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(48% 0.18 25)", margin: "0 0 6px" }}>
                  {t("Procrastination Voice", "Suara Penundaan", "Uitstelgedrag-stem", lang)}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(35% 0.08 260)", margin: 0, fontStyle: "italic" }}>&ldquo;{item.fixed[lang]}&rdquo;</p>
              </div>
              <span style={{ fontSize: 20, color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>→</span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", margin: "0 0 6px" }}>
                  {t("Growth Voice", "Suara Pertumbuhan", "Groeistem", lang)}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(28% 0.06 260)", margin: 0 }}>{item.reframe[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t("Start Before You're Ready", "Mulai Sebelum Anda Siap", "Begin Voordat Je Klaar Bent", lang)}
          </h2>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontStyle: "italic", color: "oklch(75% 0.05 80)", lineHeight: 1.6, margin: "0 0 40px" }}>&ldquo;The time for action is now. It&apos;s never too late to do something.&rdquo;<br /><span style={{ fontSize: 14, fontStyle: "normal", color: "oklch(60% 0.06 260)", fontFamily: "Montserrat, sans-serif" }}>— Antoine de Saint-Exupéry</span></p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resources" style={{ display: "inline-block", background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", textDecoration: "none" }}>
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek", lang)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
