"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard, saveSmartGoal } from "../actions";

type Lang = "en" | "id" | "nl";
type Answer = "yes" | "partial" | "no";

const LETTERS = [
  {
    letter: "S",
    wordEn: "Specific",
    wordId: "Spesifik",
    wordNl: "Specifiek",
    color: "oklch(42% 0.14 260)",
    colorBg: "oklch(42% 0.14 260 / 0.08)",
    descEn: "A specific goal answers the who, what, where, and why. Vague goals stay wishes; specific goals become plans.",
    descId: "Tujuan yang spesifik menjawab siapa, apa, di mana, dan mengapa. Tujuan yang samar tetap menjadi keinginan; tujuan yang spesifik menjadi rencana.",
    descNl: "Een specifiek doel beantwoordt de vragen wie, wat, waar en waarom. Vage doelen blijven wensen; specifieke doelen worden plannen.",
    questionsEn: [
      "What exactly do you want to achieve?",
      "Who is involved or responsible?",
      "Where will it take place (if applicable)?",
      "Why is this goal important to you?",
    ],
    questionsId: [
      "Apa tepatnya yang ingin Anda capai?",
      "Siapa yang terlibat atau bertanggung jawab?",
      "Di mana itu akan berlangsung (jika berlaku)?",
      "Mengapa tujuan ini penting bagi Anda?",
    ],
    questionsNl: [
      "Wat wil je precies bereiken?",
      "Wie is erbij betrokken of verantwoordelijk?",
      "Waar vindt het plaats (indien van toepassing)?",
      "Waarom is dit doel belangrijk voor jou?",
    ],
    worksheetQEn: [
      { q: "Can you describe exactly what you want to achieve in one clear sentence?", hint: "A specific goal names the outcome, not the activity." },
      { q: "Do you know who is responsible and who else is involved?", hint: "Clarity on ownership prevents goals from drifting." },
      { q: "Do you know where or in what context this will happen?", hint: "Context grounds a goal in reality." },
      { q: "Can you clearly explain why this goal matters to you right now?", hint: "A strong 'why' fuels action when motivation fades." },
    ],
    worksheetQId: [
      { q: "Bisakah Anda menggambarkan dengan tepat apa yang ingin dicapai dalam satu kalimat yang jelas?", hint: "Tujuan yang spesifik menyebutkan hasil, bukan aktivitas." },
      { q: "Apakah Anda tahu siapa yang bertanggung jawab dan siapa lagi yang terlibat?", hint: "Kejelasan kepemilikan mencegah tujuan menjadi kabur." },
      { q: "Apakah Anda tahu di mana atau dalam konteks apa ini akan terjadi?", hint: "Konteks membumikan tujuan dalam kenyataan." },
      { q: "Dapatkah Anda menjelaskan dengan jelas mengapa tujuan ini penting bagi Anda sekarang?", hint: "\"Mengapa\" yang kuat memotivasi tindakan ketika semangat memudar." },
    ],
    worksheetQNl: [
      { q: "Kun jij in één heldere zin beschrijven wat je precies wilt bereiken?", hint: "Een specifiek doel benoemt de uitkomst, niet de activiteit." },
      { q: "Weet je wie verantwoordelijk is en wie er verder bij betrokken is?", hint: "Duidelijkheid over eigenaarschap voorkomt dat doelen afdrijven." },
      { q: "Weet je waar of in welke context dit zal plaatsvinden?", hint: "Context verankert een doel in de werkelijkheid." },
      { q: "Kun je duidelijk uitleggen waarom dit doel er nu voor jou toe doet?", hint: "Een sterk 'waarom' voedt actie wanneer de motivatie wegzakt." },
    ],
    actionEn: "CLARIFY",
    actionId: "KLARIFIKASI",
    actionNl: "VERDUIDELIJK",
    actionDescEn: "Rewrite your goal as a single sentence that answers: what, who, where, and why.",
    actionDescId: "Tulis ulang tujuan Anda sebagai satu kalimat yang menjawab: apa, siapa, di mana, dan mengapa.",
    actionDescNl: "Herschrijf je doel als één zin die antwoord geeft op: wat, wie, waar en waarom.",
    actionColor: "oklch(42% 0.14 260)",
  },
  {
    letter: "M",
    wordEn: "Motivating",
    wordId: "Memotivasi",
    wordNl: "Motiverend",
    color: "oklch(48% 0.18 25)",
    colorBg: "oklch(48% 0.18 25 / 0.08)",
    descEn: "A motivating goal aligns with your values and creates energy. Goals without inner fire get abandoned when difficulty comes.",
    descId: "Tujuan yang memotivasi selaras dengan nilai-nilai Anda dan menciptakan energi. Tujuan tanpa api batin akan ditinggalkan ketika kesulitan datang.",
    descNl: "Een motiverend doel sluit aan bij je waarden en wekt energie. Doelen zonder innerlijk vuur worden opgegeven zodra het moeilijk wordt.",
    questionsEn: [
      "Does the goal align with your values and passions?",
      "Does the goal excite and inspire you, creating energy?",
      "Does the goal help you push through challenges and setbacks?",
    ],
    questionsId: [
      "Apakah tujuan tersebut selaras dengan nilai-nilai dan hasrat Anda?",
      "Apakah tujuan tersebut membuat Anda bersemangat dan terinspirasi, menciptakan energi?",
      "Apakah tujuan tersebut membantu Anda melewati tantangan dan kemunduran?",
    ],
    questionsNl: [
      "Sluit het doel aan bij jouw waarden en passies?",
      "Inspireert en enthousiasmeert het doel je, waardoor het energie geeft?",
      "Helpt het doel je door uitdagingen en tegenslagen heen?",
    ],
    worksheetQEn: [
      { q: "Does this goal connect to something you genuinely care about — a value, a calling, or a dream?", hint: "Intrinsic motivation outlasts external pressure every time." },
      { q: "When you think about achieving this goal, does it create positive energy and excitement?", hint: "If the idea feels flat, the goal may be borrowed from someone else's vision." },
      { q: "Can you imagine this goal carrying you through a hard stretch — when progress stalls or costs rise?", hint: "Motivating goals feel worth the sacrifice." },
    ],
    worksheetQId: [
      { q: "Apakah tujuan ini terhubung dengan sesuatu yang benar-benar Anda pedulikan — sebuah nilai, panggilan, atau impian?", hint: "Motivasi intrinsik selalu lebih tahan lama daripada tekanan eksternal." },
      { q: "Ketika memikirkan pencapaian tujuan ini, apakah itu menciptakan energi positif dan kegembiraan?", hint: "Jika ideanya terasa datar, tujuan mungkin dipinjam dari visi orang lain." },
      { q: "Bisakah Anda membayangkan tujuan ini membawa Anda melalui masa sulit — ketika kemajuan terhenti atau biaya meningkat?", hint: "Tujuan yang memotivasi terasa sepadan dengan pengorbanannya." },
    ],
    worksheetQNl: [
      { q: "Heeft dit doel verbinding met iets wat je echt belangrijk vindt — een waarde, een roeping of een droom?", hint: "Intrinsieke motivatie houdt het altijd langer vol dan externe druk." },
      { q: "Wanneer je aan het bereiken van dit doel denkt, geeft dat positieve energie en enthousiasme?", hint: "Als het idee vlak aanvoelt, is het doel misschien geleend van iemand anders' visie." },
      { q: "Kun jij je voorstellen dat dit doel je door een moeilijke periode heen draagt — wanneer de voortgang stagneert of de kosten stijgen?", hint: "Motiverende doelen voelen het offer waard." },
    ],
    actionEn: "REFRAME",
    actionId: "UBAH PERSPEKTIF",
    actionNl: "HERFORMULEER",
    actionDescEn: "Connect the goal to a deeper value or purpose — find the 'why' that creates genuine energy.",
    actionDescId: "Hubungkan tujuan dengan nilai atau tujuan yang lebih dalam — temukan 'mengapa' yang menciptakan energi yang nyata.",
    actionDescNl: "Verbind het doel met een diepere waarde of een hoger doel — vind het 'waarom' dat echte energie geeft.",
    actionColor: "oklch(48% 0.18 25)",
  },
  {
    letter: "A",
    wordEn: "Achievable",
    wordId: "Dapat Dicapai",
    wordNl: "Haalbaar",
    color: "oklch(46% 0.16 145)",
    colorBg: "oklch(46% 0.16 145 / 0.08)",
    descEn: "An achievable goal stretches you without breaking you. It's ambitious enough to matter, realistic enough to execute.",
    descId: "Tujuan yang dapat dicapai merentangkan Anda tanpa memecah Anda. Cukup ambisius untuk berarti, cukup realistis untuk dijalankan.",
    descNl: "Een haalbaar doel daagt je uit zonder je te breken. Ambitieus genoeg om er toe te doen, realistisch genoeg om uit te voeren.",
    questionsEn: [
      "Is the goal realistic given your resources and constraints?",
      "What steps or actions will you take to reach the goal?",
      "Do you have the necessary skills and support?",
    ],
    questionsId: [
      "Apakah tujuan tersebut realistis mengingat sumber daya dan kendala Anda?",
      "Langkah atau tindakan apa yang akan Anda ambil untuk mencapai tujuan?",
      "Apakah Anda memiliki keterampilan dan dukungan yang diperlukan?",
    ],
    questionsNl: [
      "Is het doel realistisch gezien jouw middelen en beperkingen?",
      "Welke stappen of acties ga je ondernemen om het doel te bereiken?",
      "Beschik je over de benodigde vaardigheden en ondersteuning?",
    ],
    worksheetQEn: [
      { q: "Do you have (or can realistically obtain) the time, money, and resources this goal requires?", hint: "Stretch goals inspire. Impossible goals demoralise." },
      { q: "Can you name at least three concrete actions you would take to move toward this goal?", hint: "If you can't describe the path, the goal may still be too vague." },
      { q: "Do you have the skills, relationships, or support structure needed to succeed — or a plan to build them?", hint: "Gaps in capability are normal; ignoring them is not." },
    ],
    worksheetQId: [
      { q: "Apakah Anda memiliki (atau dapat memperoleh secara realistis) waktu, uang, dan sumber daya yang diperlukan tujuan ini?", hint: "Tujuan ambisius menginspirasi. Tujuan yang mustahil membuat lesu." },
      { q: "Bisakah Anda menyebutkan setidaknya tiga tindakan konkret yang akan Anda ambil untuk menuju tujuan ini?", hint: "Jika Anda tidak bisa menggambarkan jalannya, tujuan mungkin masih terlalu kabur." },
      { q: "Apakah Anda memiliki keterampilan, hubungan, atau struktur dukungan yang diperlukan untuk berhasil — atau rencana untuk membangunnya?", hint: "Kesenjangan kemampuan adalah hal yang normal; mengabaikannya tidak." },
    ],
    worksheetQNl: [
      { q: "Heb je de tijd, het geld en de middelen die dit doel vereist — of kun je die realistisch verkrijgen?", hint: "Ambitieuze doelen inspireren. Onmogelijke doelen ontmoedigen." },
      { q: "Kun jij ten minste drie concrete acties benoemen die je zou ondernemen om dit doel te bereiken?", hint: "Als je het pad niet kunt beschrijven, is het doel misschien nog te vaag." },
      { q: "Heb je de vaardigheden, relaties of ondersteuningsstructuur die nodig zijn om te slagen — of een plan om die op te bouwen?", hint: "Hiaten in capaciteit zijn normaal; ze negeren niet." },
    ],
    actionEn: "NEGOTIATE",
    actionId: "NEGOSIASI",
    actionNl: "ONDERHANDEL",
    actionDescEn: "Adjust the scope, timeline, or resources to make the goal doable — without losing the ambition.",
    actionDescId: "Sesuaikan ruang lingkup, jadwal, atau sumber daya agar tujuan bisa dilakukan — tanpa kehilangan ambisi.",
    actionDescNl: "Pas de reikwijdte, planning of middelen aan zodat het doel uitvoerbaar wordt — zonder de ambitie te verliezen.",
    actionColor: "oklch(46% 0.16 145)",
  },
  {
    letter: "R",
    wordEn: "Relevant",
    wordId: "Relevan",
    wordNl: "Relevant",
    color: "oklch(44% 0.14 290)",
    colorBg: "oklch(44% 0.14 290 / 0.08)",
    descEn: "A relevant goal fits your current season and contributes to your long-term vision. Right goals at the wrong time become burdens.",
    descId: "Tujuan yang relevan sesuai dengan musim Anda saat ini dan berkontribusi pada visi jangka panjang Anda. Tujuan yang tepat pada waktu yang salah menjadi beban.",
    descNl: "Een relevant doel past bij jouw huidige seizoen en draagt bij aan je langetermijnvisie. De juiste doelen op het verkeerde moment worden lasten.",
    questionsEn: [
      "Does the goal fit your current season of life and circumstances?",
      "Will it contribute meaningfully to your long-term vision?",
      "Is now the right time to pursue this goal?",
    ],
    questionsId: [
      "Apakah tujuan tersebut sesuai dengan musim kehidupan dan keadaan Anda saat ini?",
      "Apakah ini akan berkontribusi secara bermakna pada visi jangka panjang Anda?",
      "Apakah sekarang waktu yang tepat untuk mengejar tujuan ini?",
    ],
    questionsNl: [
      "Past het doel bij jouw huidige levenssituatie en omstandigheden?",
      "Draagt het betekenisvol bij aan jouw langetermijnvisie?",
      "Is dit het juiste moment om dit doel na te streven?",
    ],
    worksheetQEn: [
      { q: "Does this goal align with where you are in life right now — your role, season, and priorities?", hint: "A goal right for the future can still be wrong for today." },
      { q: "Does pursuing this goal move you meaningfully toward your long-term vision or calling?", hint: "Relevant goals build on each other. Irrelevant ones scatter energy." },
      { q: "If you stopped everything else, would this goal be worth your full focus right now?", hint: "Saying yes to one thing means saying no to many others." },
    ],
    worksheetQId: [
      { q: "Apakah tujuan ini selaras dengan posisi Anda dalam hidup sekarang — peran, musim, dan prioritas Anda?", hint: "Tujuan yang tepat untuk masa depan bisa saja salah untuk hari ini." },
      { q: "Apakah mengejar tujuan ini membawa Anda secara bermakna menuju visi atau panggilan jangka panjang Anda?", hint: "Tujuan yang relevan saling membangun. Yang tidak relevan mencerai-beraikan energi." },
      { q: "Jika Anda menghentikan segalanya, apakah tujuan ini layak mendapat fokus penuh Anda sekarang?", hint: "Berkata ya pada satu hal berarti berkata tidak pada banyak hal lainnya." },
    ],
    worksheetQNl: [
      { q: "Sluit dit doel aan bij waar je nu in het leven staat — je rol, seizoen en prioriteiten?", hint: "Een doel dat juist is voor de toekomst kan vandaag toch verkeerd zijn." },
      { q: "Brengt het nastreven van dit doel je betekenisvol dichter bij je langetermijnvisie of roeping?", hint: "Relevante doelen bouwen op elkaar voort. Irrelevante doelen versnipperen energie." },
      { q: "Als je alles zou stilleggen, is dit doel dan de volledige focus waard op dit moment?", hint: "Ja zeggen tegen één ding betekent nee zeggen tegen veel andere dingen." },
    ],
    actionEn: "NEGOTIATE",
    actionId: "NEGOSIASI",
    actionNl: "ONDERHANDEL",
    actionDescEn: "Ask whether this is the right goal for this season — or if it belongs in a different chapter.",
    actionDescId: "Tanyakan apakah ini tujuan yang tepat untuk musim ini — atau apakah itu milik bab yang berbeda.",
    actionDescNl: "Vraag je af of dit het juiste doel is voor dit seizoen — of dat het thuishoort in een ander hoofdstuk.",
    actionColor: "oklch(44% 0.14 290)",
  },
  {
    letter: "T",
    wordEn: "Trackable",
    wordId: "Dapat Dilacak",
    wordNl: "Meetbaar",
    color: "oklch(40% 0.12 60)",
    colorBg: "oklch(40% 0.12 60 / 0.08)",
    descEn: "A trackable goal has clear milestones and a definition of done. What gets measured gets managed — and celebrated.",
    descId: "Tujuan yang dapat dilacak memiliki tonggak yang jelas dan definisi selesai. Apa yang diukur dikelola — dan dirayakan.",
    descNl: "Een meetbaar doel heeft duidelijke mijlpalen en een definitie van 'klaar'. Wat gemeten wordt, wordt beheerd — en gevierd.",
    questionsEn: [
      "How will you track progress?",
      "How will you know when the goal is accomplished?",
      "Are there milestones or checkpoints along the way?",
    ],
    questionsId: [
      "Bagaimana Anda akan melacak kemajuan?",
      "Bagaimana Anda akan tahu kapan tujuan tercapai?",
      "Apakah ada tonggak atau pos pemeriksaan di sepanjang jalan?",
    ],
    questionsNl: [
      "Hoe ga je de voortgang bijhouden?",
      "Hoe weet je wanneer het doel bereikt is?",
      "Zijn er mijlpalen of controlepunten onderweg?",
    ],
    worksheetQEn: [
      { q: "Do you have a clear finish line — a specific outcome that tells you the goal is done?", hint: "Without a finish line, goals become habits. Sometimes that's fine. Often it isn't." },
      { q: "Can you identify 2–3 milestones that mark meaningful progress along the way?", hint: "Milestones create momentum. They let you celebrate before the end." },
      { q: "Do you have a concrete way to track and review progress — a date, a metric, or a check-in?", hint: "Tracking needs to be built in, not hoped for." },
    ],
    worksheetQId: [
      { q: "Apakah Anda memiliki garis akhir yang jelas — hasil spesifik yang memberi tahu Anda bahwa tujuan telah selesai?", hint: "Tanpa garis akhir, tujuan menjadi kebiasaan. Kadang itu baik. Sering kali tidak." },
      { q: "Bisakah Anda mengidentifikasi 2–3 tonggak yang menandai kemajuan berarti di sepanjang jalan?", hint: "Tonggak menciptakan momentum. Mereka memungkinkan Anda merayakan sebelum akhir." },
      { q: "Apakah Anda memiliki cara konkret untuk melacak dan meninjau kemajuan — tanggal, metrik, atau pemeriksaan?", hint: "Pelacakan perlu dibangun, bukan sekadar diharapkan." },
    ],
    worksheetQNl: [
      { q: "Heb je een duidelijke eindstreep — een specifieke uitkomst die aangeeft dat het doel bereikt is?", hint: "Zonder eindstreep worden doelen gewoontes. Soms is dat goed. Vaak niet." },
      { q: "Kun jij 2–3 mijlpalen benoemen die betekenisvolle voortgang markeren onderweg?", hint: "Mijlpalen creëren momentum. Ze laten je vieren voor het einde." },
      { q: "Heb je een concrete manier om voortgang bij te houden en te evalueren — een datum, een maatstaf of een check-in?", hint: "Bijhouden moet ingebouwd zijn, niet gehoopt worden." },
    ],
    actionEn: "CLARIFY",
    actionId: "KLARIFIKASI",
    actionNl: "VERDUIDELIJK",
    actionDescEn: "Add a specific deadline, at least one measurable outcome, and a regular review point.",
    actionDescId: "Tambahkan tenggat waktu tertentu, setidaknya satu hasil yang terukur, dan titik tinjauan rutin.",
    actionDescNl: "Voeg een specifieke deadline toe, minimaal één meetbaar resultaat en een regelmatig evaluatiemoment.",
    actionColor: "oklch(42% 0.14 260)",
  },
];

const ACTIONS = [
  {
    labelEn: "CLARIFY", labelId: "KLARIFIKASI", labelNl: "VERDUIDELIJK",
    color: "oklch(42% 0.14 260)",
    descEn: "Use when your goal is not Specific or Trackable. Make it precise — add details, define the finish line, break it into steps.",
    descId: "Gunakan ketika tujuan Anda tidak Spesifik atau Dapat Dilacak. Jadikan tepat — tambahkan detail, tentukan garis akhir, pecah menjadi langkah-langkah.",
    descNl: "Gebruik dit wanneer je doel niet Specifiek of Meetbaar is. Maak het precies — voeg details toe, bepaal de eindstreep, verdeel het in stappen.",
  },
  {
    labelEn: "REFRAME", labelId: "UBAH PERSPEKTIF", labelNl: "HERFORMULEER",
    color: "oklch(48% 0.18 25)",
    descEn: "Use when your goal is not Motivating. Reconnect it to a deeper value or purpose — find the 'why' that creates energy.",
    descId: "Gunakan ketika tujuan Anda tidak Memotivasi. Hubungkan kembali dengan nilai atau tujuan yang lebih dalam — temukan 'mengapa' yang menciptakan energi.",
    descNl: "Gebruik dit wanneer je doel niet Motiverend is. Verbind het opnieuw met een diepere waarde of een hoger doel — vind het 'waarom' dat energie geeft.",
  },
  {
    labelEn: "NEGOTIATE", labelId: "NEGOSIASI", labelNl: "ONDERHANDEL",
    color: "oklch(46% 0.16 145)",
    descEn: "Use when your goal is not Achievable or Relevant. Adjust scope, timing, or resources — or ask: 'Is this the right goal for this season?'",
    descId: "Gunakan ketika tujuan Anda tidak Dapat Dicapai atau Relevan. Sesuaikan ruang lingkup, waktu, atau sumber daya — atau tanyakan: 'Apakah ini tujuan yang tepat untuk musim ini?'",
    descNl: "Gebruik dit wanneer je doel niet Haalbaar of Relevant is. Pas reikwijdte, timing of middelen aan — of vraag: 'Is dit het juiste doel voor dit seizoen?'",
  },
];

function calcLetterScore(answers: Record<string, Answer>): number {
  const vals = Object.values(answers);
  if (vals.length === 0) return 0;
  const sum = vals.reduce((acc, a) => acc + (a === "yes" ? 1 : a === "partial" ? 0.5 : 0), 0);
  return sum / vals.length;
}

export default function SmartGoalsClient({
  userPathway,
  isSaved,
  savedGoal,
}: {
  userPathway: string | null;
  isSaved: boolean;
  savedGoal?: Record<string, string> | null;
}) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [activeLetter, setActiveLetter] = useState<number | null>(0);
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  // Worksheet state
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 = goal input, 1-5 = letter steps, 6 = results
  const [goalText, setGoalText] = useState(savedGoal?.goal ?? "");
  // answers[letterIdx][questionIdx] = Answer
  const [answers, setAnswers] = useState<Record<number, Record<number, Answer>>>({});
  const [worksheetSaved, setWorksheetSaved] = useState(!!savedGoal?.completedAt);
  const [savingWorksheet, startSavingWorksheet] = useTransition();

  const t = (en: string, id: string, nl: string) => lang === "en" ? en : lang === "id" ? id : nl;

  const active = activeLetter !== null ? LETTERS[activeLetter] : null;

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("smart-goals");
      setSaved(true);
    });
  }

  function setAnswer(letterIdx: number, qIdx: number, val: Answer) {
    setAnswers(prev => ({
      ...prev,
      [letterIdx]: { ...(prev[letterIdx] ?? {}), [qIdx]: val },
    }));
  }

  function currentLetterIdx() {
    return step - 1; // step 1 = letter 0 (S), step 2 = letter 1 (M), etc.
  }

  function canProceed(): boolean {
    if (step === 0) return goalText.trim().length > 10;
    const li = currentLetterIdx();
    const letterAnswers = answers[li] ?? {};
    const numQ = LETTERS[li].worksheetQEn.length;
    return Object.keys(letterAnswers).length === numQ;
  }

  function handleNext() {
    if (step < 6) setStep(s => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1);
  }

  function handleSaveWorksheet() {
    // Build data object to save
    const data: Record<string, string> = { goal: goalText };
    LETTERS.forEach((letter, li) => {
      const letterAnswers = answers[li] ?? {};
      const numQ = letter.worksheetQEn.length;
      for (let qi = 0; qi < numQ; qi++) {
        data[`${letter.letter}_q${qi}`] = letterAnswers[qi] ?? "no";
      }
      const score = calcLetterScore(letterAnswers);
      data[`${letter.letter}_score`] = score.toFixed(2);
      data[`${letter.letter}_met`] = score >= 0.67 ? "yes" : "no";
    });
    const metCount = LETTERS.filter((_, li) => calcLetterScore(answers[li] ?? {}) >= 0.67).length;
    data.overall_score = String(Math.round((metCount / 5) * 100));
    data.completedAt = new Date().toISOString();

    startSavingWorksheet(async () => {
      await saveSmartGoal(data);
      setWorksheetSaved(true);
    });
  }

  function handleRetake() {
    setStep(0);
    setGoalText("");
    setAnswers({});
    setWorksheetSaved(false);
  }

  // ---- WORKSHEET RENDER ----

  const TOTAL_STEPS = 7; // 0-6
  const progressPct = Math.round((step / 6) * 100);

  function renderAnswerButtons(letterIdx: number, qIdx: number) {
    const current = answers[letterIdx]?.[qIdx] ?? null;
    const opts: { val: Answer; labelEn: string; labelId: string; labelNl: string; color: string }[] = [
      { val: "yes", labelEn: "Yes", labelId: "Ya", labelNl: "Ja", color: "oklch(46% 0.16 145)" },
      { val: "partial", labelEn: "Partly", labelId: "Sebagian", labelNl: "Deels", color: "oklch(48% 0.18 55)" },
      { val: "no", labelEn: "Not yet", labelId: "Belum", labelNl: "Nog niet", color: "oklch(44% 0.14 25)" },
    ];
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {opts.map(opt => (
          <button
            key={opt.val}
            onClick={() => setAnswer(letterIdx, qIdx, opt.val)}
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: `2px solid ${current === opt.val ? opt.color : "oklch(86% 0.008 260)"}`,
              background: current === opt.val ? opt.color : "white",
              color: current === opt.val ? "white" : "oklch(38% 0.06 260)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "all 0.12s",
            }}
          >
            {t(opt.labelEn, opt.labelId, opt.labelNl)}
          </button>
        ))}
      </div>
    );
  }

  function renderWorksheetContent() {
    // Step 0: Goal input
    if (step === 0) {
      return (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(55% 0.08 260)", marginBottom: 8 }}>
            {t("Step 1 of 6 — Your Goal", "Langkah 1 dari 6 — Tujuan Anda", "Stap 1 van 6 — Jouw doel")}
          </p>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 10px" }}>
            {t("What is the goal you want to evaluate?", "Apa tujuan yang ingin Anda evaluasi?", "Wat is het doel dat je wilt evalueren?")}
          </h3>
          <p style={{ fontSize: 14, color: "oklch(44% 0.06 260)", lineHeight: 1.65, marginBottom: 24 }}>
            {t(
              "Write it as you currently have it — even if it feels rough. The worksheet will help you refine it.",
              "Tuliskan seperti yang Anda miliki sekarang — meskipun terasa kasar. Lembar kerja ini akan membantu Anda menyempurnakannya.",
              "Schrijf het op zoals je het nu hebt — ook als het nog ruw aanvoelt. Het werkblad helpt je het te verfijnen."
            )}
          </p>
          <textarea
            value={goalText}
            onChange={e => setGoalText(e.target.value)}
            placeholder={t(
              "e.g. I want to improve my leadership skills this year.",
              "mis. Saya ingin meningkatkan keterampilan kepemimpinan tahun ini.",
              "bijv. Ik wil mijn leiderschapsvaardigheden dit jaar verbeteren."
            )}
            rows={4}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 8,
              border: "2px solid oklch(86% 0.008 260)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "oklch(22% 0.10 260)",
              fontFamily: "Montserrat, sans-serif",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              background: "white",
            }}
            onFocus={e => { e.target.style.borderColor = "oklch(42% 0.14 260)"; }}
            onBlur={e => { e.target.style.borderColor = "oklch(86% 0.008 260)"; }}
          />
          {goalText.trim().length > 0 && goalText.trim().length <= 10 && (
            <p style={{ fontSize: 12, color: "oklch(44% 0.14 25)", marginTop: 8 }}>
              {t(
                "Please write a bit more — describe your goal in full.",
                "Mohon tulis sedikit lebih banyak — jelaskan tujuan Anda secara lengkap.",
                "Schrijf nog iets meer — beschrijf je doel volledig."
              )}
            </p>
          )}
        </div>
      );
    }

    // Steps 1-5: Letter questions
    if (step >= 1 && step <= 5) {
      const li = currentLetterIdx();
      const letter = LETTERS[li];
      const qs = lang === "en" ? letter.worksheetQEn : lang === "id" ? letter.worksheetQId : letter.worksheetQNl;
      const letterAnswers = answers[li] ?? {};
      const answered = Object.keys(letterAnswers).length;
      const total = qs.length;

      return (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: letter.color, marginBottom: 8 }}>
            {t(`Step ${step + 1} of 6`, `Langkah ${step + 1} dari 6`, `Stap ${step + 1} van 6`)} — {t(letter.wordEn, letter.wordId, letter.wordNl)}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 56, fontWeight: 600, color: letter.color, lineHeight: 1 }}>{letter.letter}</span>
            <div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: 0 }}>{t(letter.wordEn, letter.wordId, letter.wordNl)}</h3>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "oklch(44% 0.06 260)", lineHeight: 1.5 }}>{t(letter.descEn, letter.descId, letter.descNl)}</p>
            </div>
          </div>

          <div style={{ background: letter.colorBg, borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "oklch(30% 0.06 260)", lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700, color: letter.color }}>{t("Your goal: ", "Tujuan Anda: ", "Jouw doel: ")}</span>
            {goalText}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {qs.map((qItem, qi) => (
              <div key={qi} style={{ background: "white", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 6px oklch(20% 0.06 260 / 0.06)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 600, color: letter.color, flexShrink: 0, lineHeight: 1.5, minWidth: 20 }}>{qi + 1}.</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: 0, lineHeight: 1.55 }}>{qItem.q}</p>
                </div>
                {qItem.hint && (
                  <p style={{ fontSize: 12, color: "oklch(52% 0.06 260)", margin: "0 0 14px 30px", lineHeight: 1.5, fontStyle: "italic" }}>{qItem.hint}</p>
                )}
                <div style={{ marginLeft: 30 }}>
                  {renderAnswerButtons(li, qi)}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "oklch(55% 0.05 260)", marginTop: 16, textAlign: "right" }}>
            {answered}/{total} {t("answered", "dijawab", "beantwoord")}
          </p>
        </div>
      );
    }

    // Step 6: Results
    if (step === 6) {
      const results = LETTERS.map((letter, li) => {
        const score = calcLetterScore(answers[li] ?? {});
        const met = score >= 0.67;
        return { letter, li, score, met };
      });
      const metCount = results.filter(r => r.met).length;
      const overallPct = Math.round((metCount / 5) * 100);
      const notMet = results.filter(r => !r.met);

      return (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(55% 0.08 260)", marginBottom: 8 }}>
            {t("Results", "Hasil", "Resultaten")}
          </p>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 6px" }}>
            {t("Your SMART Score", "Skor SMART Anda", "Jouw SMART-score")}
          </h3>
          <div style={{ background: "oklch(22% 0.10 260 / 0.05)", borderRadius: 8, padding: "10px 14px", marginBottom: 24, fontSize: 13, color: "oklch(30% 0.06 260)", lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700, color: "oklch(22% 0.10 260)" }}>{t("Goal: ", "Tujuan: ", "Doel: ")}</span>
            {goalText}
          </div>

          {/* Score display */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 72, fontFamily: "Cormorant Garamond, serif", fontWeight: 600, color: metCount >= 4 ? "oklch(46% 0.16 145)" : metCount >= 3 ? "oklch(48% 0.18 55)" : "oklch(44% 0.14 25)", lineHeight: 1 }}>
              {metCount}<span style={{ fontSize: 36, color: "oklch(55% 0.05 260)" }}>/5</span>
            </div>
            <p style={{ fontSize: 14, color: "oklch(44% 0.06 260)", margin: "6px 0 0" }}>
              {metCount === 5
                ? t("Fully SMART — well done.", "Sepenuhnya SMART — bagus sekali.", "Volledig SMART — goed gedaan.")
                : metCount >= 3
                ? t("Strong foundation — a few areas to sharpen.", "Fondasi yang kuat — beberapa area perlu diasah.", "Sterke basis — enkele gebieden om aan te scherpen.")
                : t("Good start — several areas need attention.", "Awal yang baik — beberapa area perlu perhatian.", "Goed begin — enkele gebieden vereisen aandacht.")}
            </p>
          </div>

          {/* Letter results */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
            {results.map(r => (
              <div key={r.letter.letter} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                background: r.met ? r.letter.colorBg : "oklch(96% 0.003 25)",
                border: `2px solid ${r.met ? r.letter.color : "oklch(80% 0.06 25)"}`,
                borderRadius: 10,
                padding: "16px 20px",
                minWidth: 80,
              }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 600, color: r.met ? r.letter.color : "oklch(60% 0.08 25)", lineHeight: 1 }}>{r.letter.letter}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: r.met ? r.letter.color : "oklch(50% 0.08 25)", letterSpacing: "0.04em" }}>{t(r.letter.wordEn, r.letter.wordId, r.letter.wordNl)}</span>
                <span style={{ fontSize: 16 }}>{r.met ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>

          {/* Corrective actions for not-met */}
          {notMet.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(38% 0.06 260)", marginBottom: 12 }}>
                {t("What to do next", "Apa yang harus dilakukan selanjutnya", "Wat nu te doen")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {notMet.map(r => (
                  <div key={r.letter.letter} style={{ background: "white", borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 6px oklch(20% 0.06 260 / 0.06)", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: r.letter.color, lineHeight: 1, flexShrink: 0 }}>{r.letter.letter}</span>
                    <div>
                      <div style={{ display: "inline-block", background: r.letter.actionColor, color: "white", padding: "3px 10px", borderRadius: 4, fontWeight: 700, fontSize: 11, letterSpacing: "0.06em", marginBottom: 6 }}>{t(r.letter.actionEn, r.letter.actionId, r.letter.actionNl)}</div>
                      <p style={{ fontSize: 13, color: "oklch(35% 0.06 260)", margin: 0, lineHeight: 1.6 }}>{t(r.letter.actionDescEn, r.letter.actionDescId, r.letter.actionDescNl)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save / retake */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {!worksheetSaved ? (
              <button
                onClick={handleSaveWorksheet}
                disabled={savingWorksheet}
                style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "12px 24px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: savingWorksheet ? "not-allowed" : "pointer" }}
              >
                {savingWorksheet ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(46% 0.16 145)", fontSize: 14, fontWeight: 700, padding: "12px 0" }}>✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}</span>
            )}
            <button
              onClick={handleRetake}
              style={{ background: "transparent", color: "oklch(44% 0.06 260)", padding: "12px 24px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "2px solid oklch(86% 0.008 260)", cursor: "pointer" }}
            >
              {t("Evaluate Another Goal", "Evaluasi Tujuan Lain", "Evalueer een ander doel")}
            </button>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "oklch(97% 0.005 260)", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px 72px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <Link href="/resources" style={{ fontSize: 13, color: "oklch(65% 0.08 260)", textDecoration: "none", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>← {t("All Resources", "Semua Sumber Daya", "Alle bronnen")}</Link>
            <div style={{ display: "flex", gap: 8 }}>
              {(["en", "id", "nl"] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: "5px 14px", borderRadius: 4, border: "1px solid", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", background: lang === l ? "oklch(65% 0.15 45)" : "transparent", color: lang === l ? "oklch(15% 0.05 45)" : "oklch(65% 0.06 260)", borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(42% 0.08 260)" }}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", background: "oklch(65% 0.15 45 / 0.12)", padding: "4px 10px", borderRadius: 4 }}>Worksheet</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(72% 0.05 260)", background: "oklch(55% 0.05 260 / 0.20)", padding: "4px 10px", borderRadius: 4 }}>EN · ID · NL</span>
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px", lineHeight: 1.1 }}>SMART Goals</h1>
          <p style={{ fontSize: 17, color: "oklch(72% 0.05 260)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
            {t(
              "A five-part framework for setting goals that actually get done — Specific, Motivating, Achievable, Relevant, and Trackable. With built-in corrective actions: Clarify, Reframe, or Negotiate.",
              "Kerangka lima bagian untuk menetapkan tujuan yang benar-benar tercapai — Spesifik, Memotivasi, Dapat Dicapai, Relevan, dan Dapat Dilacak. Dengan tindakan korektif bawaan: Klarifikasi, Ubah Perspektif, atau Negosiasi.",
              "Een vijfdelig kader voor het stellen van doelen die daadwerkelijk worden bereikt — Specifiek, Motiverend, Haalbaar, Relevant en Meetbaar. Met ingebouwde corrigerende acties: Verduidelijk, Herformuleer of Onderhandel."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => { setWorksheetOpen(true); window.scrollTo({ top: document.getElementById("worksheet-section")?.offsetTop ?? 0, behavior: "smooth" }); }}
              style={{ display: "inline-block", background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "13px 28px", borderRadius: 6, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}
            >
              {t("Start Worksheet", "Mulai Lembar Kerja", "Start werkblad")}
            </button>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "transparent", color: "oklch(85% 0.04 260)", padding: "13px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>✓ {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}</span>
            )}
          </div>
        </div>
      </section>

      {/* SMART LETTERS */}
      <section style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("The Five Elements", "Lima Elemen", "De Vijf Elementen")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 32, lineHeight: 1.65 }}>
            {t(
              "Select a letter to explore its meaning and key questions.",
              "Pilih huruf untuk menjelajahi maknanya dan pertanyaan kunci.",
              "Selecteer een letter om de betekenis en sleutelvragen te verkennen."
            )}
          </p>

          {/* Letter selector */}
          <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
            {LETTERS.map((l, i) => (
              <button key={l.letter} onClick={() => setActiveLetter(activeLetter === i ? null : i)} style={{ flex: 1, minWidth: 120, padding: "20px 16px", borderRadius: 10, border: `2px solid ${activeLetter === i ? l.color : "oklch(88% 0.008 260)"}`, background: activeLetter === i ? l.color : "white", color: activeLetter === i ? "white" : "oklch(30% 0.06 260)", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 600, display: "block", lineHeight: 1, color: activeLetter === i ? "white" : l.color }}>{l.letter}</span>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", display: "block", marginTop: 4 }}>{t(l.wordEn, l.wordId, l.wordNl)}</span>
              </button>
            ))}
          </div>

          {/* Letter detail */}
          {active ? (
            <div style={{ background: active.colorBg, borderRadius: 12, padding: "40px", border: `1px solid ${active.color}30` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 72, fontWeight: 600, color: active.color, lineHeight: 1 }}>{active.letter}</span>
                <div>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: active.color, margin: 0 }}>{t(active.wordEn, active.wordId, active.wordNl)}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 15, lineHeight: 1.65, color: "oklch(35% 0.06 260)" }}>{t(active.descEn, active.descId, active.descNl)}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                <div style={{ background: "white", borderRadius: 8, padding: "20px 24px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: active.color, marginBottom: 14 }}>
                    {t("Questions to Ask", "Pertanyaan yang Perlu Ditanyakan", "Te stellen vragen")}
                  </p>
                  {(lang === "en" ? active.questionsEn : lang === "id" ? active.questionsId : active.questionsNl).map((q, qi) => (
                    <div key={qi} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: qi < active.questionsEn.length - 1 ? 10 : 0 }}>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 600, color: active.color, flexShrink: 0, lineHeight: 1.5 }}>{qi + 1}.</span>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(30% 0.06 260)", margin: 0 }}>{q}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "white", borderRadius: 8, padding: "20px 24px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: active.actionColor, marginBottom: 14 }}>
                    {t("If not met →", "Jika tidak terpenuhi →", "Als niet voldaan →")}
                  </p>
                  <div style={{ display: "inline-block", background: active.actionColor, color: "white", padding: "6px 14px", borderRadius: 4, fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", marginBottom: 12 }}>
                    {t(active.actionEn, active.actionId, active.actionNl)}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(30% 0.06 260)", margin: 0 }}>
                    {t(active.actionDescEn, active.actionDescId, active.actionDescNl)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 12, padding: "32px", textAlign: "center", color: "oklch(55% 0.05 260)", fontSize: 15 }}>
              {t("Select a letter above to explore it.", "Pilih huruf di atas untuk menjelajahinya.", "Selecteer hierboven een letter om het te verkennen.")}
            </div>
          )}
        </div>
      </section>

      {/* CORRECTIVE ACTIONS */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("When a Goal Falls Short", "Ketika Tujuan Kurang Memenuhi", "Wanneer een Doel Tekortschiet")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 40, lineHeight: 1.65 }}>
            {t(
              "Three corrective actions for goals that don't yet meet the SMART criteria.",
              "Tiga tindakan korektif untuk tujuan yang belum memenuhi kriteria SMART.",
              "Drie corrigerende acties voor doelen die nog niet voldoen aan de SMART-criteria."
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {ACTIONS.map(action => (
              <div key={action.labelEn} style={{ background: "white", borderRadius: 10, padding: "28px", boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
                <div style={{ display: "inline-block", background: action.color, color: "white", padding: "6px 14px", borderRadius: 4, fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", marginBottom: 16 }}>
                  {t(action.labelEn, action.labelId, action.labelNl)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(38% 0.06 260)", margin: 0 }}>
                  {t(action.descEn, action.descId, action.descNl)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKSHEET */}
      <section id="worksheet-section" style={{ background: "oklch(94% 0.008 260)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 12px" }}>
            {t("Evaluate Your Goal", "Evaluasi Tujuan Anda", "Evalueer Jouw Doel")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(44% 0.06 260)", marginBottom: 32, lineHeight: 1.65 }}>
            {t(
              "Walk through the SMART framework step by step. Answer honestly — the worksheet will tell you what's working and what to refine.",
              "Jalani kerangka SMART langkah demi langkah. Jawablah dengan jujur — lembar kerja akan memberi tahu Anda apa yang berhasil dan apa yang perlu disempurnakan.",
              "Doorloop het SMART-kader stap voor stap. Antwoord eerlijk — het werkblad vertelt je wat werkt en wat verfijnd moet worden."
            )}
          </p>

          {!worksheetOpen ? (
            <div style={{ textAlign: "center", padding: "48px 32px", background: "white", borderRadius: 12, boxShadow: "0 1px 8px oklch(20% 0.06 260 / 0.07)" }}>
              {savedGoal?.goal && (
                <div style={{ background: "oklch(46% 0.16 145 / 0.08)", border: "1px solid oklch(46% 0.16 145 / 0.3)", borderRadius: 8, padding: "14px 20px", marginBottom: 24, textAlign: "left" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(46% 0.16 145)", margin: "0 0 6px" }}>
                    {t("Last saved goal", "Tujuan terakhir yang disimpan", "Laatste opgeslagen doel")}
                  </p>
                  <p style={{ fontSize: 14, color: "oklch(30% 0.06 260)", margin: 0, lineHeight: 1.6 }}>{savedGoal.goal}</p>
                </div>
              )}
              <button
                onClick={() => setWorksheetOpen(true)}
                style={{ background: "oklch(22% 0.10 260)", color: "white", padding: "14px 36px", borderRadius: 6, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", letterSpacing: "0.03em" }}
              >
                {savedGoal?.goal
                  ? t("Start New Evaluation", "Mulai Evaluasi Baru", "Nieuwe evaluatie starten")
                  : t("Start Worksheet", "Mulai Lembar Kerja", "Start werkblad")}
              </button>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 16px oklch(20% 0.06 260 / 0.10)", overflow: "hidden" }}>
              {/* Progress bar */}
              <div style={{ background: "oklch(92% 0.008 260)", height: 4 }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "oklch(42% 0.14 260)", transition: "width 0.3s ease" }} />
              </div>

              {/* Step counter pills */}
              <div style={{ padding: "16px 24px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Goal", "S", "M", "A", "R", "T", "Results"].map((label, i) => {
                  const displayLabel = i === 0
                    ? t("Goal", "Tujuan", "Doel")
                    : i === 6
                    ? t("Results", "Hasil", "Resultaten")
                    : label;
                  return (
                    <div key={i} style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      background: step === i ? "oklch(22% 0.10 260)" : step > i ? "oklch(46% 0.16 145 / 0.15)" : "oklch(92% 0.008 260)",
                      color: step === i ? "white" : step > i ? "oklch(46% 0.16 145)" : "oklch(55% 0.05 260)",
                    }}>
                      {displayLabel}
                    </div>
                  );
                })}
              </div>

              {/* Content */}
              <div style={{ padding: "28px 32px 32px" }}>
                {renderWorksheetContent()}
              </div>

              {/* Navigation */}
              {step < 6 && (
                <div style={{ padding: "0 32px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={step === 0 ? () => setWorksheetOpen(false) : handleBack}
                    style={{ background: "transparent", color: "oklch(44% 0.06 260)", padding: "10px 20px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "2px solid oklch(86% 0.008 260)", cursor: "pointer" }}
                  >
                    {step === 0 ? t("Cancel", "Batal", "Annuleren") : t("← Back", "← Kembali", "← Terug")}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    style={{
                      background: canProceed() ? "oklch(22% 0.10 260)" : "oklch(86% 0.008 260)",
                      color: canProceed() ? "white" : "oklch(60% 0.04 260)",
                      padding: "10px 24px",
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 14,
                      border: "none",
                      cursor: canProceed() ? "pointer" : "not-allowed",
                      transition: "all 0.15s",
                    }}
                  >
                    {step === 5 ? t("See Results →", "Lihat Hasil →", "Bekijk resultaten →") : t("Next →", "Berikutnya →", "Volgende →")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "oklch(22% 0.10 260)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 20px" }}>
            {t(
              "Set Goals That Actually Happen",
              "Tetapkan Tujuan yang Benar-Benar Terwujud",
              "Stel Doelen Die Echt Uitkomen"
            )}
          </h2>
          <p style={{ fontSize: 16, color: "oklch(72% 0.05 260)", lineHeight: 1.7, marginBottom: 40 }}>
            {t(
              "Use the SMART worksheet with your team or in your next one-on-one. Each member evaluates their own goal — you coach the gaps.",
              "Gunakan lembar kerja SMART bersama tim Anda atau dalam sesi one-on-one berikutnya. Setiap anggota mengevaluasi tujuan mereka sendiri — Anda melatih kesenjangannya.",
              "Gebruik het SMART-werkblad met jouw team of in je volgende één-op-ééngesprek. Elk lid evalueert zijn eigen doel — jij coacht de zwakke punten."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => { setWorksheetOpen(true); setStep(0); window.scrollTo({ top: document.getElementById("worksheet-section")?.offsetTop ?? 0, behavior: "smooth" }); }}
              style={{ display: "inline-block", background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}
            >
              {t("Start Worksheet", "Mulai Lembar Kerja", "Start werkblad")}
            </button>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("← Content Library", "← Perpustakaan Konten", "Bekijk alle bronnen")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
