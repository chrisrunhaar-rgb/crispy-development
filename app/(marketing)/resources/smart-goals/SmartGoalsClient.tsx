"use client";

import { useState, useTransition, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard, saveSmartGoal, saveSmartGoalToTable, getSmartGoalAiSuggestion, getSmartGoalCoachingResponse, getSmartGoalAiScore } from "../actions";
import LangToggle from "@/components/LangToggle";

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
      { q: "Does this goal describe exactly what you want to achieve in one clear sentence?", hint: "A specific goal names the outcome, not the activity." },
      { q: "Does this goal name who is responsible and who else needs to be involved?", hint: "Clarity on ownership prevents goals from drifting." },
      { q: "Does this goal specify where or in what context it will happen?", hint: "Context grounds a goal in reality." },
      { q: "Does this goal explain the 'why' — the reason this outcome matters?", hint: "A strong 'why' fuels action when motivation fades." },
    ],
    worksheetQId: [
      { q: "Apakah tujuan ini menggambarkan dengan tepat apa yang ingin Anda capai dalam satu kalimat yang jelas?", hint: "Tujuan yang spesifik menyebutkan hasil, bukan aktivitas." },
      { q: "Apakah tujuan ini menyebutkan siapa yang bertanggung jawab dan siapa lagi yang perlu terlibat?", hint: "Kejelasan kepemilikan mencegah tujuan menjadi kabur." },
      { q: "Apakah tujuan ini menetapkan di mana atau dalam konteks apa hal ini akan terjadi?", hint: "Konteks membumikan tujuan dalam kenyataan." },
      { q: "Apakah tujuan ini menjelaskan 'mengapa' — alasan mengapa hasil ini penting?", hint: "\"Mengapa\" yang kuat memotivasi tindakan ketika semangat memudar." },
    ],
    worksheetQNl: [
      { q: "Beschrijft dit doel precies wat je wilt bereiken in één duidelijke zin?", hint: "Een specifiek doel benoemt de uitkomst, niet de activiteit." },
      { q: "Benoemt dit doel wie verantwoordelijk is en wie er verder bij betrokken moet zijn?", hint: "Duidelijkheid over eigenaarschap voorkomt dat doelen afdrijven." },
      { q: "Specificeert dit doel waar of in welke context het zal plaatsvinden?", hint: "Context verankert een doel in de werkelijkheid." },
      { q: "Legt dit doel het 'waarom' uit — de reden waarom dit resultaat ertoe doet?", hint: "Een sterk 'waarom' voedt actie wanneer de motivatie wegzakt." },
    ],
    actionEn: "CLARIFY",
    actionId: "KLARIFIKASI",
    actionNl: "VERDUIDELIJK",
    actionDescEn: "Rewrite your goal as a single sentence that answers: what, who, where, and why.",
    actionDescId: "Tulis ulang tujuan Anda sebagai satu kalimat yang menjawab: apa, siapa, di mana, dan mengapa.",
    actionDescNl: "Herschrijf je doel als ——n zin die antwoord geeft op: wat, wie, waar en waarom.",
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
      { q: "Does this goal connect to a value, a calling, or a dream you genuinely care about?", hint: "Intrinsic motivation outlasts external pressure every time." },
      { q: "Does this goal read like something you genuinely want — not just something you feel you should do?", hint: "If the goal feels flat on the page, the motivation behind it may be borrowed." },
      { q: "Does this goal feel worth pursuing through difficulty and setback?", hint: "Motivating goals feel worth the sacrifice." },
    ],
    worksheetQId: [
      { q: "Apakah tujuan ini terhubung dengan nilai, panggilan, atau impian yang benar-benar Anda pedulikan?", hint: "Motivasi intrinsik selalu lebih tahan lama daripada tekanan eksternal." },
      { q: "Apakah tujuan ini mencerminkan sesuatu yang benar-benar Anda inginkan — bukan sekadar yang Anda rasa harus dilakukan?", hint: "Jika tujuan terasa datar di atas kertas, motivasi di baliknya mungkin dipinjam." },
      { q: "Apakah tujuan ini terasa layak untuk dikejar meski ada kesulitan dan kemunduran?", hint: "Tujuan yang memotivasi terasa sepadan dengan pengorbanannya." },
    ],
    worksheetQNl: [
      { q: "Verbindt dit doel met een waarde, een roeping of een droom die je echt belangrijk vindt?", hint: "Intrinsieke motivatie houdt het altijd langer vol dan externe druk." },
      { q: "Leest dit doel als iets wat je echt wilt — en niet als iets wat je denkt te moeten doen?", hint: "Als het doel op papier vlak aanvoelt, is de motivatie erachter misschien geleend." },
      { q: "Voelt dit doel het waard om na te streven, ook door moeilijkheden en tegenslagen heen?", hint: "Motiverende doelen voelen het offer waard." },
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
      { q: "Does this goal reflect what's actually possible given your current time, money, and resources?", hint: "Stretch goals inspire. Impossible goals demoralise." },
      { q: "Does this goal describe an outcome you can take concrete, actionable steps toward?", hint: "If the path can't be described, the goal may still be too vague." },
      { q: "Does this goal account for the skills, relationships, or support structure needed to succeed?", hint: "Gaps in capability are normal; ignoring them is not." },
    ],
    worksheetQId: [
      { q: "Apakah tujuan ini mencerminkan apa yang benar-benar mungkin mengingat waktu, uang, dan sumber daya Anda saat ini?", hint: "Tujuan ambisius menginspirasi. Tujuan yang mustahil membuat lesu." },
      { q: "Apakah tujuan ini menggambarkan hasil yang dapat Anda tuju dengan langkah-langkah konkret?", hint: "Jika jalurnya tidak bisa digambarkan, tujuan mungkin masih terlalu kabur." },
      { q: "Apakah tujuan ini mempertimbangkan keterampilan, hubungan, atau struktur dukungan yang diperlukan untuk berhasil?", hint: "Kesenjangan kemampuan adalah hal yang normal; mengabaikannya tidak." },
    ],
    worksheetQNl: [
      { q: "Weerspiegelt dit doel wat realistisch haalbaar is met je huidige tijd, geld en middelen?", hint: "Ambitieuze doelen inspireren. Onmogelijke doelen ontmoedigen." },
      { q: "Beschrijft dit doel een uitkomst waarop je concrete, uitvoerbare stappen kunt zetten?", hint: "Als het pad niet beschreven kan worden, is het doel misschien nog te vaag." },
      { q: "Houdt dit doel rekening met de vaardigheden, relaties of ondersteuningsstructuur die nodig zijn om te slagen?", hint: "Hiaten in capaciteit zijn normaal; ze negeren niet." },
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
      { q: "Does this goal fit where you are right now — your role, your season, your priorities?", hint: "A goal right for the future can still be wrong for today." },
      { q: "Does this goal connect to your bigger vision or calling — not just a short-term desire?", hint: "Relevant goals build on each other. Irrelevant ones scatter energy." },
      { q: "Does pursuing this goal make sense right now, given everything else on your plate?", hint: "Saying yes to one thing means saying no to many others." },
    ],
    worksheetQId: [
      { q: "Apakah tujuan ini sesuai dengan posisi Anda sekarang — peran, musim, dan prioritas Anda?", hint: "Tujuan yang tepat untuk masa depan bisa saja salah untuk hari ini." },
      { q: "Apakah tujuan ini terhubung dengan visi atau panggilan yang lebih besar — bukan sekadar keinginan jangka pendek?", hint: "Tujuan yang relevan saling membangun. Yang tidak relevan mencerai-beraikan energi." },
      { q: "Apakah mengejar tujuan ini masuk akal sekarang, mengingat semua hal lain yang ada di piring Anda?", hint: "Berkata ya pada satu hal berarti berkata tidak pada banyak hal lainnya." },
    ],
    worksheetQNl: [
      { q: "Past dit doel bij waar je nu staat — je rol, je seizoen, je prioriteiten?", hint: "Een doel dat juist is voor de toekomst kan vandaag toch verkeerd zijn." },
      { q: "Verbindt dit doel met jouw grotere visie of roeping — en niet slechts met een kortetermijnwens?", hint: "Relevante doelen bouwen op elkaar voort. Irrelevante doelen versnipperen energie." },
      { q: "Is het zinvol om dit doel nu na te streven, gegeven alles wat er al op je bord ligt?", hint: "Ja zeggen tegen één ding betekent nee zeggen tegen veel andere dingen." },
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
      { q: "Does this goal include a clear finish line — a specific outcome that tells you when it's done?", hint: "Without a finish line, goals become habits. Sometimes that's fine. Often it isn't." },
      { q: "Does this goal mention at least one way to measure meaningful progress?", hint: "Milestones create momentum. They let you celebrate before the end." },
      { q: "Does this goal have a concrete review date or metric built in?", hint: "Tracking needs to be built in, not hoped for." },
    ],
    worksheetQId: [
      { q: "Apakah tujuan ini memiliki garis akhir yang jelas — hasil spesifik yang memberi tahu Anda kapan selesai?", hint: "Tanpa garis akhir, tujuan menjadi kebiasaan. Kadang itu baik. Sering kali tidak." },
      { q: "Apakah tujuan ini menyebutkan setidaknya satu cara untuk mengukur kemajuan yang berarti?", hint: "Tonggak menciptakan momentum. Mereka memungkinkan Anda merayakan sebelum akhir." },
      { q: "Apakah tujuan ini memiliki tanggal tinjauan atau metrik konkret yang sudah tercantum?", hint: "Pelacakan perlu dibangun, bukan sekadar diharapkan." },
    ],
    worksheetQNl: [
      { q: "Bevat dit doel een duidelijke eindstreep — een specifieke uitkomst die aangeeft wanneer het klaar is?", hint: "Zonder eindstreep worden doelen gewoontes. Soms is dat goed. Vaak niet." },
      { q: "Noemt dit doel minstens één manier om betekenisvolle voortgang te meten?", hint: "Mijlpalen creëren momentum. Ze laten je vieren voor het einde." },
      { q: "Bevat dit doel een concrete evaluatiedatum of meetlat?", hint: "Bijhouden moet ingebouwd zijn, niet gehoopt worden." },
    ],
    actionEn: "CLARIFY",
    actionId: "KLARIFIKASI",
    actionNl: "VERDUIDELIJK",
    actionDescEn: "Add a specific deadline, at least one measurable outcome, and a regular review point.",
    actionDescId: "Tambahkan tenggat waktu tertentu, setidaknya satu hasil yang terukur, dan titik tinjauan rutin.",
    actionDescNl: "Voeg een specifieke deadline toe, minimaal ——n meetbaar resultaat en een regelmatig evaluatiemoment.",
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
  const { lang: _ctxLang } = useLanguage();
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
  const [rewriteTexts, setRewriteTexts] = useState<Record<number, string>>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<number, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<number, boolean>>({});
  const [coachingResult, setCoachingResult] = useState<Partial<Record<"clarify" | "reframe" | "negotiate", string>>>({});
  const [coachingLoading, setCoachingLoading] = useState<Partial<Record<"clarify" | "reframe" | "negotiate", boolean>>>({});
  const [aiScore, setAiScore] = useState<{ score: number; reason: string } | null>(null);
  const worksheetCardRef = useRef<HTMLDivElement>(null);

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
    if (step < 6) {
      setStep(s => s + 1);
      setTimeout(() => worksheetCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(s => s - 1);
      setTimeout(() => worksheetCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
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
    data.completedAt = new Date().toISOString();

    startSavingWorksheet(async () => {
      const { score, reason } = await getSmartGoalAiScore(goalText);
      const scoreToSave = score ?? 3;
      if (score && reason) setAiScore({ score, reason });
      data.overall_score = String(scoreToSave);
      await saveSmartGoal(data);
      await saveSmartGoalToTable({ goal: goalText, answers: data, overallScore: scoreToSave });
      setWorksheetSaved(true);
    });
  }

  function handleRetake() {
    setStep(0);
    setGoalText("");
    setAnswers({});
    setWorksheetSaved(false);
    setAiScore(null);
    setRewriteTexts({});
    setAiSuggestions({});
    setAiLoading({});
    setCoachingResult({});
    setCoachingLoading({});
  }

  async function handleAiSuggest(li: number) {
    const letter = LETTERS[li];
    const qs = lang === "en" ? letter.worksheetQEn : lang === "id" ? letter.worksheetQId : letter.worksheetQNl;
    const letterAnswers = answers[li] ?? {};
    const weakQuestions = qs
      .filter((_, qi) => letterAnswers[qi] === "partial" || letterAnswers[qi] === "no")
      .map(qItem => qItem.q);
    setAiLoading(prev => ({ ...prev, [li]: true }));
    const { suggestion } = await getSmartGoalAiSuggestion(goalText, letter.letter, letter.wordEn, weakQuestions);
    setAiLoading(prev => ({ ...prev, [li]: false }));
    if (suggestion) setAiSuggestions(prev => ({ ...prev, [li]: suggestion }));
  }

  async function handleCoachingAction(action: "clarify" | "reframe" | "negotiate") {
    setCoachingLoading(prev => ({ ...prev, [action]: true }));
    const { response } = await getSmartGoalCoachingResponse(goalText, action);
    setCoachingLoading(prev => ({ ...prev, [action]: false }));
    if (response) setCoachingResult(prev => ({ ...prev, [action]: response }));
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
              borderRadius: 12,
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

  function hasAnyWeakAnswer(li: number): boolean {
    return Object.values(answers[li] ?? {}).some(a => a === "partial" || a === "no");
  }

  function renderRewriteSection(li: number) {
    if (!hasAnyWeakAnswer(li)) return null;
    const letter = LETTERS[li];
    const draftText = rewriteTexts[li] ?? goalText;

    return (
      <div style={{ marginTop: 28, borderTop: "1px solid oklch(88% 0.008 260)", paddingTop: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: letter.color, marginBottom: 8 }}>
          {t("Refine Your Goal", "Sempurnakan Tujuan Anda", "Verfijn uw doel")}
        </p>
        <p style={{ fontSize: 14, color: "oklch(44% 0.06 260)", lineHeight: 1.65, marginBottom: 16 }}>
          {t(
            `Your goal could be stronger on ${letter.wordEn}. Rewrite it below to address what's missing — the improved version carries into the next step.`,
            `Tujuan Anda bisa lebih kuat pada ${letter.wordId}. Tulis ulang di bawah untuk mengatasi kekurangannya — versi yang diperbaiki akan dibawa ke langkah berikutnya.`,
            `Uw doel kan sterker op ${letter.wordNl}. Herschrijf het hieronder om de zwakke punten aan te pakken — de verbeterde versie gaat mee naar de volgende stap.`
          )}
        </p>
        <textarea
          value={draftText}
          onChange={e => setRewriteTexts(prev => ({ ...prev, [li]: e.target.value }))}
          rows={3}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: `2px solid ${letter.color}`,
            fontSize: 14,
            lineHeight: 1.6,
            color: "oklch(22% 0.10 260)",
            fontFamily: "Montserrat, sans-serif",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            background: "white",
          }}
        />
        <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              if (rewriteTexts[li]?.trim()) {
                setGoalText(rewriteTexts[li]);
              }
            }}
            disabled={!rewriteTexts[li]?.trim() || rewriteTexts[li] === goalText}
            style={{
              background: rewriteTexts[li]?.trim() && rewriteTexts[li] !== goalText ? letter.color : "oklch(88% 0.008 260)",
              color: rewriteTexts[li]?.trim() && rewriteTexts[li] !== goalText ? "white" : "oklch(55% 0.05 260)",
              padding: "8px 18px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: rewriteTexts[li]?.trim() && rewriteTexts[li] !== goalText ? "pointer" : "not-allowed",
            }}
          >
            {t("Use this version →", "Gunakan versi ini →", "Gebruik deze versie →")}
          </button>
          <span style={{ fontSize: 12, color: "oklch(55% 0.05 260)" }}>
            {t("Optional — continue without rewriting if your goal already addresses this.", "Opsional — lanjutkan tanpa menulis ulang jika tujuan Anda sudah membahas ini.", "Optioneel — ga door zonder herschrijven als uw doel dit al behandelt.")}
          </span>
        </div>
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

          {/* AI suggestion */}
          <div style={{ marginTop: 20, borderTop: "1px solid oklch(90% 0.006 260)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => handleAiSuggest(li)}
                disabled={aiLoading[li] || goalText.trim().length < 10}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: aiLoading[li] ? "oklch(88% 0.008 260)" : "oklch(65% 0.15 45)",
                  color: aiLoading[li] ? "oklch(55% 0.05 260)" : "oklch(15% 0.05 45)",
                  padding: "8px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                  border: "none", cursor: aiLoading[li] ? "not-allowed" : "pointer", letterSpacing: "0.03em",
                }}
              >
                <span style={{ fontSize: 15 }}>✦</span>
                {aiLoading[li]
                  ? t("Thinking—", "Memproses—", "Bezig—")
                  : t(`AI: improve the ${letter.wordEn} element`, `AI: perkuat elemen ${letter.wordId}`, `AI: versterk het ${letter.wordNl} element`)}
              </button>
              <span style={{ fontSize: 12, color: "oklch(55% 0.05 260)" }}>
                {t(`Ask AI what to add to make this goal more ${letter.wordEn}.`, `Minta AI apa yang perlu ditambahkan agar tujuan ini lebih ${letter.wordId}.`, `Vraag AI wat toe te voegen om dit doel meer ${letter.wordNl} te maken.`)}
              </span>
            </div>
            {aiSuggestions[li] && (
              <div style={{ background: "oklch(65% 0.15 45 / 0.07)", border: "1px solid oklch(65% 0.15 45 / 0.25)", borderRadius: 8, padding: "14px 16px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(48% 0.12 45)", margin: "0 0 10px" }}>
                  {t("What to add to your goal", "Yang perlu ditambahkan ke tujuan Anda", "Wat toe te voegen aan je doel")}
                </p>
                <div style={{ fontSize: 14, color: "oklch(22% 0.10 260)", lineHeight: 1.7 }}>
                  {aiSuggestions[li].split("\n").filter(Boolean).map((line, i) => (
                    <p key={i} style={{ margin: "0 0 6px" }}>{line}</p>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "oklch(52% 0.06 260)", margin: "10px 0 0", fontStyle: "italic" }}>
                  {t("Use these to refine your goal in the box below.", "Gunakan ini untuk menyempurnakan tujuan Anda di kotak di bawah.", "Gebruik dit om je doel te verfijnen in het vak hieronder.")}
                </p>
              </div>
            )}
          </div>

          {renderRewriteSection(li)}
        </div>
      );
    }

    // Step 6: Coaching finish
    if (step === 6) {
      const coachingActions: Array<{
        key: "clarify" | "reframe" | "negotiate";
        labelEn: string; labelId: string; labelNl: string;
        descEn: string; descId: string; descNl: string;
        color: string; colorBg: string; colorBorder: string;
      }> = [
        {
          key: "clarify",
          labelEn: "Clarify", labelId: "Klarifikasi", labelNl: "Verduidelijken",
          descEn: "Ask AI to surface what's still unclear or missing in your goal.",
          descId: "Minta AI mengungkap apa yang masih belum jelas dalam tujuan Anda.",
          descNl: "Vraag AI wat nog onduidelijk of ontbreekt in je doel.",
          color: "oklch(42% 0.14 260)",
          colorBg: "oklch(42% 0.14 260 / 0.06)",
          colorBorder: "oklch(42% 0.14 260 / 0.25)",
        },
        {
          key: "reframe",
          labelEn: "Reframe", labelId: "Bingkai Ulang", labelNl: "Herformuleren",
          descEn: "Ask AI for a question that connects this goal to what matters most to you.",
          descId: "Minta AI pertanyaan yang menghubungkan tujuan ini dengan apa yang terpenting.",
          descNl: "Vraag AI een vraag die dit doel verbindt met wat voor jou het meest belangrijk is.",
          color: "oklch(65% 0.15 45)",
          colorBg: "oklch(65% 0.15 45 / 0.07)",
          colorBorder: "oklch(65% 0.15 45 / 0.30)",
        },
        {
          key: "negotiate",
          labelEn: "Negotiate", labelId: "Negosiasi", labelNl: "Onderhandelen",
          descEn: "Ask AI to suggest how to adjust the scope without losing the ambition.",
          descId: "Minta AI menyarankan cara menyesuaikan lingkup tanpa kehilangan ambisi.",
          descNl: "Vraag AI hoe je de omvang aanpast zonder de ambitie te verliezen.",
          color: "oklch(46% 0.16 145)",
          colorBg: "oklch(46% 0.16 145 / 0.07)",
          colorBorder: "oklch(46% 0.16 145 / 0.28)",
        },
      ];

      return (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(55% 0.08 260)", marginBottom: 8 }}>
            {t("Your Goal", "Tujuan Anda", "Jouw Doel")}
          </p>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 16px" }}>
            {t("You've worked through every element.", "Anda telah mengerjakan setiap elemen.", "Je hebt elk element doorgewerkt.")}
          </h3>

          {/* Goal display */}
          <div style={{ background: "oklch(22% 0.10 260 / 0.05)", borderRadius: 8, padding: "12px 16px", marginBottom: 28, fontSize: 14, color: "oklch(28% 0.08 260)", lineHeight: 1.65 }}>
            <span style={{ fontWeight: 700, color: "oklch(22% 0.10 260)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
              {t("Goal", "Tujuan", "Doel")}
            </span>
            {goalText}
          </div>

          {/* Three coaching actions */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.06 260)", marginBottom: 12 }}>
            {t("One more question?", "Satu pertanyaan lagi?", "Nog een vraag?")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {coachingActions.map(action => (
              <div
                key={action.key}
                style={{
                  background: coachingResult[action.key] ? action.colorBg : "oklch(98% 0.003 260)",
                  borderRadius: 10,
                  padding: "16px 20px",
                  border: `1px solid ${coachingResult[action.key] ? action.colorBorder : "oklch(90% 0.005 260)"}`,
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleCoachingAction(action.key)}
                    disabled={!!coachingLoading[action.key]}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: coachingLoading[action.key] ? "oklch(88% 0.008 260)" : action.color,
                      color: coachingLoading[action.key] ? "oklch(55% 0.05 260)" : "white",
                      padding: "7px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13,
                      border: "none", cursor: coachingLoading[action.key] ? "not-allowed" : "pointer",
                      letterSpacing: "0.04em", flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>✦</span>
                    {coachingLoading[action.key]
                      ? t("Thinking—", "Memproses—", "Bezig—")
                      : t(action.labelEn, action.labelId, action.labelNl)}
                  </button>
                  <span style={{ fontSize: 13, color: "oklch(48% 0.06 260)", lineHeight: 1.5 }}>
                    {t(action.descEn, action.descId, action.descNl)}
                  </span>
                </div>
                {coachingResult[action.key] && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${action.colorBorder}` }}>
                    <p style={{ fontSize: 14, color: "oklch(22% 0.10 260)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                      &ldquo;{coachingResult[action.key]}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final goal edit */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(52% 0.06 260)", marginBottom: 10 }}>
            {t("Refine your goal (optional)", "Sempurnakan tujuan Anda (opsional)", "Verfijn je doel (optioneel)")}
          </p>
          <textarea
            value={goalText}
            onChange={e => setGoalText(e.target.value)}
            rows={3}
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1.5px solid oklch(85% 0.008 260)", fontSize: 14, color: "oklch(22% 0.10 260)", lineHeight: 1.65, fontFamily: "inherit", resize: "vertical", marginBottom: 24, background: "white" }}
          />

          {/* AI score card — shown after save */}
          {worksheetSaved && aiScore && (() => {
            const R = 22;
            const C = 2 * Math.PI * R;
            const filled = (aiScore.score / 5) * C;
            return (
              <div style={{ background: "white", border: "1px solid oklch(88% 0.015 45)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <svg viewBox="0 0 60 60" width="60" height="60" style={{ flexShrink: 0 }}>
                  <circle cx="30" cy="30" r={R} fill="none" stroke="oklch(92% 0.006 80)" strokeWidth="6" />
                  <circle cx="30" cy="30" r={R} fill="none" stroke="oklch(65% 0.15 45)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${filled} ${C}`} transform="rotate(-90 30 30)" />
                  <text x="30" y="35" textAnchor="middle" fontSize="13" fontWeight="800" fill="oklch(22% 0.10 260)" fontFamily="Montserrat, sans-serif">{aiScore.score}/5</text>
                </svg>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", margin: "0 0 4px" }}>
                    {t("AI Score", "Skor AI", "AI Score")}
                  </p>
                  <p style={{ fontSize: 14, color: "oklch(28% 0.08 260)", margin: 0, lineHeight: 1.55 }}>{aiScore.reason}</p>
                </div>
              </div>
            );
          })()}

          {/* Save / retake */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {!worksheetSaved ? (
              <button
                onClick={handleSaveWorksheet}
                disabled={savingWorksheet}
                style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: savingWorksheet ? "not-allowed" : "pointer" }}
              >
                {savingWorksheet ? t("Saving—", "Menyimpan—", "Opslaan—") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(46% 0.16 145)", fontSize: 14, fontWeight: 700, padding: "12px 0" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="oklch(46% 0.16 145)"/><path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}
              </span>
            )}
            <button
              onClick={handleRetake}
              style={{ background: "transparent", color: "oklch(44% 0.06 260)", padding: "12px 24px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "2px solid oklch(86% 0.008 260)", cursor: "pointer" }}
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
      <LangToggle />

      {/* HERO */}
      <section style={{
        position: "relative",
        backgroundImage: "url('/resources/smart-goals-hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        backgroundColor: "oklch(22% 0.10 260)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.10 260 / 0.82)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "80px 24px 72px" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development — Worksheet", "Pengembangan Pribadi — Lembar Kerja", "Persoonlijke Ontwikkeling — Werkblad")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: "oklch(96% 0.005 80)", margin: "0 0 24px", lineHeight: 1.08 }}>SMART Goals</h1>
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
              style={{ display: "inline-block", background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "13px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}
            >
              {t("Start Creating My Goal", "Mulai Membuat Tujuan Saya", "Begin mijn doel te maken")}
            </button>
            {!saved ? (
              <button onClick={handleSave} disabled={isPending} style={{ background: "transparent", color: "oklch(85% 0.04 260)", padding: "13px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: "pointer" }}>
                {isPending ? t("Saving—", "Menyimpan—", "Opslaan—") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(65% 0.15 145)", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>? {t("Saved to Dashboard", "Tersimpan di Dashboard", "Opgeslagen in Dashboard")}</span>
            )}
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section style={{ background: "white", padding: "64px 24px 56px", borderBottom: "1px solid oklch(91% 0.008 260)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, color: "oklch(22% 0.10 260)", margin: "0 0 20px" }}>
            {t("Why SMART goals work", "Mengapa tujuan SMART berhasil", "Waarom SMART-doelen werken")}
          </h2>

          <p style={{ fontSize: 15, color: "oklch(38% 0.05 260)", lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "The SMART framework was introduced in 1981 by George T. Doran, a corporate planning director who wanted a simple way to write management objectives. He proposed goals be Specific, Measurable, Assignable, Realistic, and Time-related. The idea spread quickly — and mutated. Dozens of variants now exist, which tells you something important: the acronym is a tool, not a theory.",
              "Kerangka SMART diperkenalkan pada tahun 1981 oleh George T. Doran, seorang direktur perencanaan perusahaan yang ingin cara sederhana untuk menulis tujuan manajemen. Ia mengusulkan tujuan harus Spesifik, Terukur, Dapat Ditugaskan, Realistis, dan Terkait Waktu. Ide ini menyebar dengan cepat — dan bermutasi. Sekarang ada lusinan varian, yang memberi tahu Anda sesuatu yang penting: akronim ini adalah alat, bukan teori.",
              "Het SMART-kader werd in 1981 geïntroduceerd door George T. Doran, een directeur bedrijfsplanning die een eenvoudige manier wilde om managementdoelstellingen te schrijven. Hij stelde voor dat doelen Specifiek, Meetbaar, Toewijsbaar, Realistisch en Tijdsgebonden moesten zijn. Het idee verspreidde zich snel — en muteerde. Er bestaan nu tientallen varianten, wat je iets belangrijks vertelt: het acroniem is een hulpmiddel, geen theorie."
            )}
          </p>

          <p style={{ fontSize: 15, color: "oklch(38% 0.05 260)", lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "The real science behind SMART comes from Edwin Locke and Gary Latham, whose forty years of research across more than 1,000 studies showed this: specific, well-defined goals consistently produce better results than vague ones. Not because of the acronym — because clarity, commitment, and feedback work. That foundation is what this tool is built on.",
              "Ilmu pengetahuan nyata di balik SMART berasal dari Edwin Locke dan Gary Latham, yang empat puluh tahun penelitiannya di lebih dari 1.000 studi menunjukkan ini: tujuan yang spesifik dan terdefinisi dengan baik secara konsisten menghasilkan hasil yang lebih baik daripada tujuan yang samar. Bukan karena akronimnya — karena kejelasan, komitmen, dan umpan balik bekerja. Itulah fondasi yang menjadi dasar alat ini.",
              "De echte wetenschap achter SMART komt van Edwin Locke en Gary Latham, wier veertig jaar onderzoek over meer dan 1.000 studies dit aantoonde: specifieke, goed omschreven doelen produceren consistent betere resultaten dan vage doelen. Niet vanwege het acroniem — omdat duidelijkheid, betrokkenheid en feedback werken. Dat fundament is waar dit hulpmiddel op gebouwd is."
            )}
          </p>

          <p style={{ fontSize: 15, color: "oklch(38% 0.05 260)", lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "This module follows Ken Blanchard's variant — Specific, Motivating, Achievable, Relevant, Trackable — because two changes matter deeply for cross-cultural leaders. 'Motivating' replaces 'Measurable': before asking how to count progress, we ask why this goal matters at all. 'Trackable' replaces 'Time-bound': in complex, relational, and ministry work, noticing movement is more honest than hitting a fixed deadline. These aren't softer standards — they're more honest ones.",
              "Modul ini mengikuti varian Ken Blanchard — Spesifik, Memotivasi, Dapat Dicapai, Relevan, Dapat Dilacak — karena dua perubahan sangat penting bagi pemimpin lintas budaya. 'Memotivasi' menggantikan 'Terukur': sebelum bertanya bagaimana menghitung kemajuan, kami bertanya mengapa tujuan ini sama sekali penting. 'Dapat Dilacak' menggantikan 'Terikat Waktu': dalam pekerjaan yang kompleks, relasional, dan pelayanan, memperhatikan pergerakan lebih jujur daripada memenuhi tenggat waktu yang tetap.",
              "Deze module volgt de variant van Ken Blanchard — Specifiek, Motiverend, Haalbaar, Relevant, Traceerbaar — omdat twee veranderingen diep van belang zijn voor cross-culturele leiders. 'Motiverend' vervangt 'Meetbaar': voordat we vragen hoe we voortgang kunnen tellen, vragen we waarom dit doel überhaupt belangrijk is. 'Traceerbaar' vervangt 'Tijdsgebonden': in complex, relationeel en ministerie-werk is het eerlijker beweging op te merken dan een vaste deadline te halen."
            )}
          </p>

          <div style={{ background: "oklch(96% 0.008 260)", borderLeft: "3px solid oklch(42% 0.14 260)", borderRadius: "0 8px 8px 0", padding: "20px 24px", marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: "oklch(32% 0.06 260)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
              {t(
                "\"Come now, you who say, 'Today or tomorrow we will go into such and such a town and spend a year there...' — yet you do not know what tomorrow will bring. Instead you ought to say, 'If the Lord wills, we will live and do this or that.'\" — James 4:13–15",
                "\"Jadi sekarang, hai kamu yang berkata: 'Hari ini atau besok kami akan pergi ke kota ini dan menghabiskan satu tahun di sana...' — padahal kamu tidak tahu apa yang akan terjadi besok. Sebaliknya kamu harus berkata: 'Jika Tuhan menghendaki, kami akan hidup dan melakukan ini atau itu.'\" — Yakobus 4:13–15",
                "\"Welaan, gij die zegt: Vandaag of morgen zullen wij naar die stad gaan en daar een jaar doorbrengen... — terwijl gij niet weet wat uw leven morgen zal zijn. Veeleer behoort gij te zeggen: Als de Here wil, zullen wij leven en dit of dat doen.\" — Jakobus 4:13–15"
              )}
            </p>
          </div>

          <p style={{ fontSize: 15, color: "oklch(38% 0.05 260)", lineHeight: 1.75, margin: 0 }}>
            {t(
              "James isn't telling us not to plan. He's telling us not to plan arrogantly — as if the future belongs to us. The model for this is Nehemiah: he prayed before every major move, planned every material detail (travel permits, timber supply, timeline), and rebuilt the wall in 52 days. Goals are instruments of stewardship. Hold them with diligence — and with open hands.",
              "Yakobus tidak mengatakan kepada kita untuk tidak merencanakan. Dia mengatakan kepada kita untuk tidak merencanakan dengan sombong — seolah-olah masa depan milik kita. Model untuk ini adalah Nehemia: ia berdoa sebelum setiap langkah besar, merencanakan setiap detail material (izin perjalanan, pasokan kayu, jadwal waktu), dan membangun kembali tembok dalam 52 hari. Tujuan adalah instrumen pengelolaan. Pegang dengan ketekunan — dan dengan tangan terbuka.",
              "Jakobus zegt ons niet om niet te plannen. Hij zegt ons om niet arrogant te plannen — alsof de toekomst van ons is. Het model hiervoor is Nehemia: hij bad voor elke grote stap, plande elk materieel detail (reisvergunningen, houtvoorraad, tijdlijn), en herbouwde de muur in 52 dagen. Doelen zijn instrumenten van rentmeesterschap. Houd ze vast met ijver — en met open handen."
            )}
          </p>
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
                    {t("If not met", "Jika tidak terpenuhi", "Als niet voldaan")}
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
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "oklch(65% 0.15 45)", margin: "0 0 12px" }}>
            {t("SMART Goal Creator", "Pembuat Tujuan SMART", "SMART Doel Creator")}
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
                style={{ background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "14px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", letterSpacing: "0.03em" }}
              >
                {savedGoal?.goal
                  ? t("Create a New Goal", "Buat Tujuan Baru", "Nieuw doel maken")
                  : t("Start Creating My Goal", "Mulai Membuat Tujuan Saya", "Begin mijn doel te maken")}
              </button>
            </div>
          ) : (
            <div ref={worksheetCardRef} style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 16px oklch(20% 0.06 260 / 0.10)", overflow: "hidden" }}>
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
                    style={{ background: "transparent", color: "oklch(44% 0.06 260)", padding: "10px 20px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "2px solid oklch(86% 0.008 260)", cursor: "pointer" }}
                  >
                    {step === 0 ? t("Cancel", "Batal", "Annuleren") : t("Back", "Kembali", "Terug")}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    style={{
                      background: canProceed() ? "oklch(22% 0.10 260)" : "oklch(86% 0.008 260)",
                      color: canProceed() ? "white" : "oklch(60% 0.04 260)",
                      padding: "10px 24px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      border: "none",
                      cursor: canProceed() ? "pointer" : "not-allowed",
                      transition: "all 0.15s",
                    }}
                  >
                    {step === 5 ? t("See Results", "Lihat Hasil", "Bekijk resultaten") : t("Next", "Berikutnya", "Volgende")}
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
              "Gebruik het SMART-werkblad met jouw team of in je volgende ——n-op-——ngesprek. Elk lid evalueert zijn eigen doel — jij coacht de zwakke punten."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => { setWorksheetOpen(true); setStep(0); window.scrollTo({ top: document.getElementById("worksheet-section")?.offsetTop ?? 0, behavior: "smooth" }); }}
              style={{ display: "inline-block", background: "oklch(65% 0.15 45)", color: "oklch(15% 0.05 45)", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", border: "none", cursor: "pointer" }}
            >
              {t("Start Creating My Goal", "Mulai Membuat Tujuan Saya", "Begin mijn doel te maken")}
            </button>
            <Link href="/resources" style={{ display: "inline-block", background: "transparent", color: "oklch(85% 0.04 260)", padding: "14px 32px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", textDecoration: "none" }}>
              {t("Training", "Pelatihan", "Bekijk alle bronnen")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
