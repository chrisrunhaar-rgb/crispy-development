"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const VERSES = {
  "prov-4-7": {
    en_ref: "Proverbs 4:7", id_ref: "Amsal 4:7", nl_ref: "Spreuken 4:7",
    en: "The beginning of wisdom is this: Get wisdom, and whatever you get, get insight.",
    id: "Permulaan hikmat ialah: perolehlah hikmat dan dengan segala yang kaupekatkan perolehlah pengertian.",
    nl: "Het begin van wijsheid is: verwerf wijsheid, en al wat je verkrijgt, verkrijg inzicht.",
  },
  "james-1-19": {
    en_ref: "James 1:19", id_ref: "Yakobus 1:19", nl_ref: "Jakobus 1:19",
    en: "My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry.",
    id: "Hai saudara-saudara yang kukasihi, ingatlah hal ini: setiap orang hendaklah cepat untuk mendengar, tetapi lambat untuk berkata-kata, dan juga lambat untuk marah.",
    nl: "Geliefde broeders en zusters, onthoud dit: ieder mens moet zich haasten om te luisteren, maar traag zijn om te spreken, traag ook om toorn te koesteren.",
  },
};

const ORID_STAGES = [
  {
    key: "O",
    letter: "O",
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.08)",
    en_label: "Objective",
    id_label: "Objektif",
    nl_label: "Objectief",
    en_sub: "What happened?",
    id_sub: "Apa yang terjadi?",
    nl_sub: "Wat is er gebeurd?",
    en_guide: "Start with the observable facts — not what it meant, not how you felt. Just what actually happened. This stage protects the debrief from jumping to conclusions before the group has agreed on what the shared experience actually was.",
    id_guide: "Mulailah dengan fakta yang dapat diamati — bukan apa artinya, bukan bagaimana perasaan Anda. Hanya apa yang benar-benar terjadi. Tahap ini melindungi debrief dari melompat ke kesimpulan sebelum kelompok sepakat tentang apa pengalaman bersama sebenarnya.",
    nl_guide: "Begin met de waarneembare feiten — niet wat het betekende, niet hoe je je voelde. Alleen wat er werkelijk gebeurde. Deze fase beschermt het debrief van naar conclusies springen voordat de groep het eens is over wat de gedeelde ervaring werkelijk was.",
    en_questions: [
      "What did you observe happening? What did you see, hear, or notice?",
      "What were the key events, in order?",
      "What data or results came in? What were the concrete outcomes?",
    ],
    id_questions: [
      "Apa yang Anda amati terjadi? Apa yang Anda lihat, dengar, atau perhatikan?",
      "Apa kejadian-kejadian kunci, secara berurutan?",
      "Data atau hasil apa yang masuk? Apa hasil konkretnya?",
    ],
    nl_questions: [
      "Wat heb je zien gebeuren? Wat heb je gezien, gehoord of opgemerkt?",
      "Wat waren de sleutelgebeurtenissen, op volgorde?",
      "Welke data of resultaten kwamen binnen? Wat waren de concrete uitkomsten?",
    ],
    en_placeholder: "Describe what actually happened — the facts, events, and observations...",
    id_placeholder: "Ceritakan apa yang sebenarnya terjadi — fakta, kejadian, dan pengamatan...",
    nl_placeholder: "Beschrijf wat er werkelijk gebeurde — de feiten, gebeurtenissen en observaties...",
    en_cross: "In high-context cultures, the 'objective' facts may be interpreted relationally rather than logically. A missed deadline, for instance, may be less about time management and more about a relationship that needed tending first. Begin here without assuming your frame is the only frame.",
    id_cross: "Dalam budaya high-context, 'fakta objektif' mungkin ditafsirkan secara relasional daripada logis. Tenggat waktu yang terlewat, misalnya, mungkin kurang tentang manajemen waktu dan lebih tentang hubungan yang perlu dijaga lebih dulu.",
    nl_cross: "In high-context culturen kunnen 'objectieve feiten' relationeel worden geïnterpreteerd in plaats van logisch. Een gemiste deadline is misschien minder over tijdbeheer en meer over een relatie die eerst verzorging nodig had.",
  },
  {
    key: "R",
    letter: "R",
    color: "oklch(58% 0.14 200)",
    colorBg: "oklch(58% 0.14 200 / 0.08)",
    en_label: "Reflective",
    id_label: "Reflektif",
    nl_label: "Reflectief",
    en_sub: "How did it feel?",
    id_sub: "Bagaimana rasanya?",
    nl_sub: "Hoe voelde het?",
    en_guide: "Now bring in the emotional layer. This is often skipped — especially in cultures where naming feelings in a group setting is uncomfortable, or where showing emotion signals weakness. But the emotional data is real data. If it's not surfaced here, it will surface later as a conflict.",
    id_guide: "Sekarang masukkan lapisan emosional. Ini sering dilewati — terutama dalam budaya di mana menyebutkan perasaan dalam kelompok tidak nyaman, atau di mana menunjukkan emosi menandakan kelemahan. Tetapi data emosional adalah data nyata.",
    nl_guide: "Breng nu de emotionele laag erin. Dit wordt vaak overgeslagen — vooral in culturen waar het benoemen van gevoelens in een groepsetting ongemakkelijk is, of waar het tonen van emotie zwakte signaleert. Maar emotionele data is echte data.",
    en_questions: [
      "What was the emotional atmosphere in the team during this experience?",
      "What energised you? What drained you?",
      "Was there a moment of surprise, frustration, joy, or confusion?",
    ],
    id_questions: [
      "Bagaimana suasana emosional dalam tim selama pengalaman ini?",
      "Apa yang memberi Anda energi? Apa yang menguras Anda?",
      "Adakah momen kejutan, frustrasi, kegembiraan, atau kebingungan?",
    ],
    nl_questions: [
      "Wat was de emotionele sfeer in het team tijdens deze ervaring?",
      "Wat gaf je energie? Wat putte je uit?",
      "Was er een moment van verrassing, frustratie, vreugde of verwarring?",
    ],
    en_placeholder: "Describe the emotional experience — what the team was feeling, and when...",
    id_placeholder: "Ceritakan pengalaman emosional — apa yang dirasakan tim, dan kapan...",
    nl_placeholder: "Beschrijf de emotionele ervaring — wat het team voelde, en wanneer...",
    en_cross: "Some team members may express emotion through indirection — a story, a metaphor, or a reference to someone else's experience rather than their own. Create space for this. Not every reflective answer will be a direct personal statement, and that's still valid data.",
    id_cross: "Beberapa anggota tim mungkin mengungkapkan emosi melalui ketidaklangsungan — cerita, metafora, atau referensi pada pengalaman orang lain daripada milik sendiri. Buat ruang untuk ini.",
    nl_cross: "Sommige teamleden kunnen emotie uitdrukken via indirectheid — een verhaal, metafoor, of verwijzing naar iemand anders' ervaring. Maak hier ruimte voor. Niet elk reflectief antwoord hoeft een directe persoonlijke uitspraak te zijn.",
  },
  {
    key: "I",
    letter: "I",
    color: "oklch(52% 0.14 290)",
    colorBg: "oklch(52% 0.14 290 / 0.08)",
    en_label: "Interpretive",
    id_label: "Interpretatif",
    nl_label: "Interpretatief",
    en_sub: "What does it mean?",
    id_sub: "Apa artinya?",
    nl_sub: "Wat betekent het?",
    en_guide: "Now the group makes meaning from the data and emotion. This is the stage that generates real insight — and where the most significant cross-cultural divergence often appears. People from different cultural backgrounds may draw radically different conclusions from the same set of facts and feelings. The debrief leader's job here is to hold the tension and draw out the multiple interpretations before landing on one.",
    id_guide: "Sekarang kelompok membuat makna dari data dan emosi. Ini adalah tahap yang menghasilkan wawasan nyata — dan di mana perbedaan lintas budaya paling signifikan sering muncul. Orang dari latar belakang budaya yang berbeda mungkin menarik kesimpulan yang sangat berbeda dari kumpulan fakta dan perasaan yang sama.",
    nl_guide: "Nu maakt de groep betekenis van de data en de emotie. Dit is de fase die echte inzichten genereert — en waar de meest significante interculturele divergentie vaak verschijnt. Mensen met verschillende culturele achtergronden kunnen radicaal verschillende conclusies trekken uit dezelfde set feiten en gevoelens.",
    en_questions: [
      "Why do you think this happened the way it did?",
      "What does this tell us about how we work together?",
      "What assumptions were we operating under that we now want to question?",
      "If a different team had done this, what might they have done differently?",
    ],
    id_questions: [
      "Mengapa menurut Anda ini terjadi seperti yang terjadi?",
      "Apa yang ini katakan tentang cara kita bekerja bersama?",
      "Asumsi apa yang kita gunakan yang sekarang ingin kita pertanyakan?",
      "Jika tim yang berbeda melakukan ini, apa yang mungkin mereka lakukan secara berbeda?",
    ],
    nl_questions: [
      "Waarom denk je dat dit zo is verlopen?",
      "Wat zegt dit over hoe wij samenwerken?",
      "Onder welke aannames werkten we die we nu willen bevragen?",
      "Als een ander team dit had gedaan, wat hadden zij misschien anders gedaan?",
    ],
    en_placeholder: "What does this experience reveal? What assumptions or patterns are you seeing?",
    id_placeholder: "Apa yang pengalaman ini ungkapkan? Asumsi atau pola apa yang Anda lihat?",
    nl_placeholder: "Wat onthult deze ervaring? Welke aannames of patronen zie je?",
    en_cross: "This stage is where monocultural teams often converge too quickly — the dominant cultural voice provides an interpretation and everyone quietly agrees. In cross-cultural teams, slow this stage down deliberately. Ask: does anyone see it differently? That question alone can unlock the most valuable insight.",
    id_cross: "Tahap ini adalah di mana tim monobudaya sering berkonvergensi terlalu cepat — suara budaya dominan memberikan interpretasi dan semua orang diam-diam setuju. Dalam tim lintas budaya, perlambat tahap ini dengan sengaja.",
    nl_cross: "Dit is de fase waar monoculturele teams te snel convergeren — de dominante culturele stem geeft een interpretatie en iedereen stemt stilletjes in. Vertraag in interculturele teams deze fase bewust. Vraag: ziet iemand het anders?",
  },
  {
    key: "D",
    letter: "D",
    color: "oklch(45% 0.12 150)",
    colorBg: "oklch(45% 0.12 150 / 0.08)",
    en_label: "Decisional",
    id_label: "Keputusan",
    nl_label: "Beslissend",
    en_sub: "What will we do differently?",
    id_sub: "Apa yang akan kita lakukan berbeda?",
    nl_sub: "Wat doen we anders?",
    en_guide: "The debrief earns its place here — when it produces decisions, not just reflections. Good debriefs always end with a concrete next step. Not a long list of lessons that no one will read again. One or two specific commitments that someone owns.",
    id_guide: "Debrief mendapatkan tempatnya di sini — ketika menghasilkan keputusan, bukan hanya refleksi. Debrief yang baik selalu berakhir dengan langkah selanjutnya yang konkret. Bukan daftar panjang pelajaran yang tidak akan dibaca lagi. Satu atau dua komitmen spesifik yang dimiliki seseorang.",
    nl_guide: "Het debrief verdient hier zijn plek — wanneer het beslissingen oplevert, niet alleen reflecties. Goede debriefs eindigen altijd met een concrete volgende stap. Niet een lange lijst lessen die niemand meer zal lezen. Één of twee specifieke commitments die iemand eigenaar van maakt.",
    en_questions: [
      "What is the one thing we will do differently next time?",
      "Who owns this change, and by when?",
      "What does success look like 30 days from now?",
    ],
    id_questions: [
      "Apa satu hal yang akan kita lakukan berbeda lain kali?",
      "Siapa yang memiliki perubahan ini, dan kapan?",
      "Seperti apa kesuksesan 30 hari dari sekarang?",
    ],
    nl_questions: [
      "Wat is de ene ding dat we de volgende keer anders doen?",
      "Wie is eigenaar van deze verandering, en wanneer?",
      "Hoe ziet succes er over 30 dagen uit?",
    ],
    en_placeholder: "What specific changes will you make? Who is responsible and by when?",
    id_placeholder: "Perubahan spesifik apa yang akan Anda buat? Siapa yang bertanggung jawab dan kapan?",
    nl_placeholder: "Welke specifieke veranderingen ga je doorvoeren? Wie is verantwoordelijk en wanneer?",
    en_cross: "In cultures with a strong hierarchy, the decisional stage may be uncomfortable — making a change implies criticism of what was done before, and that criticism may feel directed at the leader. Name this explicitly: reflection is not blame. A decision to do something differently is an act of respect for the mission, not a verdict on the past.",
    id_cross: "Dalam budaya dengan hierarki kuat, tahap keputusan mungkin tidak nyaman — membuat perubahan menyiratkan kritik terhadap apa yang dilakukan sebelumnya. Sebutkan ini secara eksplisit: refleksi bukanlah menyalahkan. Keputusan untuk melakukan sesuatu yang berbeda adalah tindakan menghormati misi.",
    nl_cross: "In culturen met een sterke hiërarchie kan de beslissingsfase ongemakkelijk zijn — een verandering impliceert kritiek op wat eerder is gedaan. Benoem dit expliciet: reflectie is geen verwijt. Een beslissing om iets anders te doen is een daad van respect voor de missie.",
  },
];

const TOOLKIT_QUESTIONS = {
  O: {
    en: [
      "What did we set out to do?",
      "What actually happened? Walk me through it in sequence.",
      "What data or observable results do we have?",
      "What did you see and hear?",
    ],
    id: [
      "Apa yang kita rencanakan untuk dilakukan?",
      "Apa yang sebenarnya terjadi? Ceritakan secara berurutan.",
      "Data atau hasil yang dapat diamati apa yang kita miliki?",
      "Apa yang Anda lihat dan dengar?",
    ],
    nl: [
      "Wat hadden we ons voorgenomen te doen?",
      "Wat is er werkelijk gebeurd? Neem me mee in de volgorde.",
      "Welke data of observeerbare resultaten hebben we?",
      "Wat heb je gezien en gehoord?",
    ],
  },
  R: {
    en: [
      "What was the energy like in the team during this?",
      "What was the high point for you personally?",
      "Was there a moment of frustration, surprise, or confusion?",
      "What are you most proud of? What is still weighing on you?",
    ],
    id: [
      "Bagaimana energi tim selama ini?",
      "Apa titik tertinggi bagi Anda secara pribadi?",
      "Adakah momen frustrasi, kejutan, atau kebingungan?",
      "Apa yang paling Anda banggakan? Apa yang masih mengganggu Anda?",
    ],
    nl: [
      "Hoe was de energie in het team hierbij?",
      "Wat was het hoogtepunt voor jou persoonlijk?",
      "Was er een moment van frustratie, verrassing of verwarring?",
      "Waar ben je het meest trots op? Wat weegt nog steeds voor je?",
    ],
  },
  I: {
    en: [
      "Why do you think it went the way it did?",
      "What does this tell us about how we work together?",
      "What assumption were we operating under that we should question?",
      "Does anyone see this differently?",
    ],
    id: [
      "Mengapa menurut Anda hal itu berjalan seperti itu?",
      "Apa yang ini katakan tentang cara kita bekerja bersama?",
      "Asumsi apa yang kita pegang yang seharusnya kita pertanyakan?",
      "Apakah ada yang melihat ini secara berbeda?",
    ],
    nl: [
      "Waarom denk je dat het zo is gegaan?",
      "Wat zegt dit over hoe wij samenwerken?",
      "Welke aanname werkten we mee die we zouden moeten bevragen?",
      "Ziet iemand dit anders?",
    ],
  },
  D: {
    en: [
      "What is the one thing we will do differently next time?",
      "Who is responsible for this, and by when?",
      "What would success look like in 30 days?",
      "What do we need to stop doing, start doing, or keep doing?",
    ],
    id: [
      "Apa satu hal yang akan kita lakukan berbeda lain kali?",
      "Siapa yang bertanggung jawab atas ini, dan kapan?",
      "Seperti apa kesuksesan dalam 30 hari?",
      "Apa yang perlu kita hentikan, mulai, atau pertahankan?",
    ],
    nl: [
      "Wat is de ene zaak die we de volgende keer anders doen?",
      "Wie is daar verantwoordelijk voor, en wanneer?",
      "Hoe ziet succes er over 30 dagen uit?",
      "Wat moeten we stoppen, starten of vasthouden?",
    ],
  },
};

const FACILITATION_TIPS = [
  {
    en_tip: "Start with O, not I.",
    en_body: "Inexperienced debrief leaders jump to interpretation immediately. Ground the conversation in shared facts first — even 5 minutes on the Objective stage changes the quality of everything that follows.",
    id_tip: "Mulai dengan O, bukan I.",
    id_body: "Pemimpin debrief yang tidak berpengalaman langsung melompat ke interpretasi. Dasarkan percakapan pada fakta bersama terlebih dahulu.",
    nl_tip: "Begin met O, niet met I.",
    nl_body: "Onervaren debriefleiders springen meteen naar interpretatie. Grond het gesprek eerst in gedeelde feiten — zelfs 5 minuten in de Objectieve fase verandert de kwaliteit van alles wat volgt.",
  },
  {
    en_tip: "Name the level you're at.",
    en_body: "Say out loud: \"We're going to spend a few minutes just on what happened — no analysis yet.\" This gives permission to slow down and prevents the most vocal person from pulling everyone into interpretation before the facts are shared.",
    id_tip: "Sebutkan level di mana Anda berada.",
    id_body: "Katakan dengan lantang: \"Kita akan menghabiskan beberapa menit hanya pada apa yang terjadi — belum ada analisis.\" Ini memberi izin untuk memperlambat.",
    nl_tip: "Benoem het niveau waarop je bent.",
    nl_body: "Zeg hardop: \"We gaan een paar minuten besteden aan wat er is gebeurd — nog geen analyse.\" Dit geeft toestemming om te vertragen.",
  },
  {
    en_tip: "Silence is data.",
    en_body: "In cross-cultural settings, silence after a question is often processing, not reluctance. Wait longer than you're comfortable with. Count to 10 before rephrasing the question. The best insights often come from people who needed more space to speak.",
    id_tip: "Diam adalah data.",
    id_body: "Dalam lingkungan lintas budaya, keheningan setelah pertanyaan sering kali merupakan pemrosesan, bukan keengganan. Tunggu lebih lama dari yang Anda rasa nyaman.",
    nl_tip: "Stilte is data.",
    nl_body: "In interculturele settings is stilte na een vraag vaak verwerking, geen terughoudendheid. Wacht langer dan comfortabel voelt. Tel tot 10 voor je de vraag herformuleert.",
  },
  {
    en_tip: "End with one owner.",
    en_body: "A debrief that produces a list of 8 action items and assigns them to 'the team' will change nothing. End every debrief with one or two concrete actions, each with a named owner and a date. Everything else is insight — which has value, but it's not change.",
    id_tip: "Akhiri dengan satu pemilik.",
    id_body: "Debrief yang menghasilkan daftar 8 item tindakan dan menugaskannya kepada 'tim' tidak akan mengubah apapun. Akhiri setiap debrief dengan satu atau dua tindakan konkret, masing-masing dengan pemilik yang disebutkan namanya dan tanggal.",
    nl_tip: "Eindig met één eigenaar.",
    nl_body: "Een debrief die 8 actiepunten oplevert en ze toewijst aan 'het team' verandert niets. Eindig elk debrief met één of twee concrete acties, elk met een benoemde eigenaar en een datum.",
  },
];

type ORIDKey = "O" | "R" | "I" | "D";

type Props = { userPathway: string | null; isSaved: boolean };

export default function DebriefingReflectionClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang, setLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<ORIDKey>("O");
  const [answers, setAnswers] = useState<Record<ORIDKey, string>>({ O: "", R: "", I: "", D: "" });
  const [showToolkit, setShowToolkit] = useState(false);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("debriefing-reflection");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const serif = "var(--font-cormorant, Cormorant Garamond, Georgia, serif)";

  const currentStageIndex = ORID_STAGES.findIndex((s) => s.key === activeStage);
  const currentStage = ORID_STAGES[currentStageIndex];
  const canGoBack = currentStageIndex > 0;
  const canGoForward = currentStageIndex < ORID_STAGES.length - 1;

  const allComplete = ORID_STAGES.every((s) => answers[s.key as ORIDKey].trim().length > 0);

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: "inherit", padding: 0, textDecoration: "underline dotted", textUnderlineOffset: 3 }}
      >
        {children}
      </button>
    );
  }

  const toolkitKeys: ORIDKey[] = ["O", "R", "I", "D"];
  const toolkitColors = {
    O: "oklch(65% 0.15 45)",
    R: "oklch(58% 0.14 200)",
    I: "oklch(52% 0.14 290)",
    D: "oklch(45% 0.12 150)",
  };
  const toolkitLabels = {
    O: { en: "Objective — What happened?", id: "Objektif — Apa yang terjadi?", nl: "Objectief — Wat is er gebeurd?" },
    R: { en: "Reflective — How did it feel?", id: "Reflektif — Bagaimana rasanya?", nl: "Reflectief — Hoe voelde het?" },
    I: { en: "Interpretive — What does it mean?", id: "Interpretatif — Apa artinya?", nl: "Interpretatief — Wat betekent het?" },
    D: { en: "Decisional — What will we do?", id: "Keputusan — Apa yang akan kita lakukan?", nl: "Beslissend — Wat doen we?" },
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
            {t("Module 9 · Learning from Experience", "Modul 9 · Belajar dari Pengalaman", "Module 9 · Leren van Ervaring")}
          </p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 0 24px", lineHeight: 1.15 }}>
            {t("Debriefing & Reflection", "Debriefing & Refleksi", "Debriefing & Reflectie")}
          </h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(17px, 2vw, 21px)", color: "oklch(82% 0.025 80)", lineHeight: 1.75, maxWidth: 640, marginBottom: 40, fontStyle: "italic" }}>
            {t(
              "Leaders who don't debrief don't learn — they repeat. This module walks you through a real debrief of your own experience, then hands you the tool to run it with your team.",
              "Pemimpin yang tidak melakukan debrief tidak belajar — mereka mengulangi. Modul ini memandu Anda melalui debrief nyata dari pengalaman Anda sendiri, kemudian memberi Anda alat untuk menjalankannya bersama tim.",
              "Leiders die niet debriefing doen, leren niet — ze herhalen. Deze module leidt je door een echte debrief van je eigen ervaring, en geeft je vervolgens het gereedschap om het met je team te doen."
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

      {/* Why Debrief */}
      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: navy, marginBottom: 24 }}>
          {t("Why Most Teams Don't Learn", "Mengapa Sebagian Besar Tim Tidak Belajar", "Waarom de Meeste Teams Niet Leren")}
        </h2>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Most leaders move from one experience to the next without ever processing what just happened. There isn't time. The next crisis is already on the horizon. The project is finished — what matters now is the next one.",
            "Sebagian besar pemimpin bergerak dari satu pengalaman ke pengalaman berikutnya tanpa pernah memproses apa yang baru saja terjadi. Tidak ada waktu. Krisis berikutnya sudah ada di cakrawala.",
            "De meeste leiders gaan van de ene ervaring naar de volgende zonder ooit te verwerken wat er net is gebeurd. Er is geen tijd. De volgende crisis staat al aan de horizon."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "The result is that the experience becomes a data point, not a lesson. The team gains competence in doing the thing — but not in understanding why it worked or failed. Next time, they will do approximately the same thing again.",
            "Hasilnya adalah pengalaman menjadi titik data, bukan pelajaran. Tim mendapatkan kompetensi dalam melakukan hal tersebut — tetapi tidak dalam memahami mengapa berhasil atau gagal.",
            "Het resultaat is dat de ervaring een datapunt wordt, geen les. Het team krijgt competentie in het doen van de zaak — maar niet in het begrijpen waarom het werkte of mislukte."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 32 }}>
          {t(
            "The ORID method is one of the most effective structured debrief frameworks available. It moves a group through four levels of reflection in a sequence that builds meaning rather than generating noise: Objective → Reflective → Interpretive → Decisional.",
            "Metode ORID adalah salah satu kerangka debrief terstruktur yang paling efektif. Ini memindahkan kelompok melalui empat tingkat refleksi dalam urutan yang membangun makna: Objektif → Reflektif → Interpretatif → Keputusan.",
            "De ORID-methode is een van de meest effectieve gestructureerde debriefkaders. Het beweegt een groep door vier niveaus van reflectie in een volgorde die betekenis opbouwt: Objectief → Reflectief → Interpretatief → Beslissend."
          )}
        </p>

        {/* ORID overview strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 12 }}>
          {ORID_STAGES.map((s) => (
            <div key={s.key} style={{ background: s.colorBg, padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: serif, fontSize: 36, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.letter}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: navy, letterSpacing: "0.05em" }}>
                {lang === "en" ? s.en_label : lang === "id" ? s.id_label : s.nl_label}
              </div>
              <div style={{ fontSize: 11, color: bodyText, marginTop: 4 }}>
                {lang === "en" ? s.en_sub : lang === "id" ? s.id_sub : s.nl_sub}
              </div>
            </div>
          ))}
        </div>

        {/* Faith anchor inline */}
        <div style={{ background: lightGray, padding: "24px 28px", marginTop: 32 }}>
          <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
            {t(
              "Structured reflection has deep roots in Scripture. ",
              "Refleksi terstruktur memiliki akar yang dalam dalam Kitab Suci. ",
              "Gestructureerde reflectie heeft diepe wortels in de Schrift. "
            )}
            <VerseRef id="prov-4-7">{t("Proverbs 4:7", "Amsal 4:7", "Spreuken 4:7")}</VerseRef>
            {t(
              " calls us to pursue both wisdom and insight — not just experience. And ",
              " memanggil kita untuk mengejar hikmat dan pengertian — bukan hanya pengalaman. Dan ",
              " roept ons op om zowel wijsheid als inzicht na te streven — niet alleen ervaring. En "
            )}
            <VerseRef id="james-1-19">{t("James 1:19", "Yakobus 1:19", "Jakobus 1:19")}</VerseRef>
            {t(
              " is not just personal counsel — it is a description of good debrief leadership: quick to listen, slow to speak, slow to draw conclusions.",
              " bukan hanya nasihat pribadi — ini adalah deskripsi kepemimpinan debrief yang baik: cepat mendengar, lambat berbicara, lambat menarik kesimpulan.",
              " is niet alleen persoonlijk advies — het is een beschrijving van goed debriefleiderschap: snel om te luisteren, traag om te spreken, traag om conclusies te trekken."
            )}
          </p>
        </div>
      </div>

      {/* Live ORID section heading */}
      <div style={{ background: navy, padding: "48px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: offWhite, marginBottom: 12 }}>
            {t("Do Your Own Debrief Now", "Lakukan Debrief Anda Sendiri Sekarang", "Doe Nu Je Eigen Debrief")}
          </h2>
          <p style={{ fontSize: 15, color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 580 }}>
            {t(
              "Think of a recent experience — a project, meeting, event, or conversation that didn't go quite as expected. Work through all four ORID stages. Your responses stay in your browser only.",
              "Pikirkan pengalaman baru-baru ini — proyek, rapat, acara, atau percakapan yang tidak berjalan seperti yang diharapkan. Kerjakan keempat tahap ORID. Respons Anda hanya tersimpan di browser Anda.",
              "Denk aan een recente ervaring — een project, vergadering, evenement of gesprek dat niet helemaal liep zoals verwacht. Doorwerk alle vier ORID-fasen. Je antwoorden blijven alleen in je browser."
            )}
          </p>
        </div>
      </div>

      {/* ORID Stage Navigator */}
      <div style={{ padding: "0 24px", maxWidth: 760, margin: "0 auto" }}>

        {/* Stage tab row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 0 }}>
          {ORID_STAGES.map((s, i) => {
            const isActive = s.key === activeStage;
            const isDone = answers[s.key as ORIDKey].trim().length > 0;
            return (
              <button
                key={s.key}
                onClick={() => setActiveStage(s.key as ORIDKey)}
                style={{
                  padding: "16px 12px", border: "none", cursor: "pointer", textAlign: "center",
                  background: isActive ? s.color : isDone ? s.colorBg : lightGray,
                  borderBottom: isActive ? "none" : `2px solid oklch(88% 0.01 80)`,
                  transition: "background 0.15s",
                }}
              >
                <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: isActive ? offWhite : s.color, lineHeight: 1, marginBottom: 4 }}>{s.letter}</div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, color: isActive ? "oklch(90% 0.03 80)" : navy, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {lang === "en" ? s.en_label : lang === "id" ? s.id_label : s.nl_label}
                </div>
                {isDone && !isActive && (
                  <div style={{ fontSize: 10, color: s.color, marginTop: 3, fontWeight: 700 }}>✓</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active stage content */}
        <div style={{ background: offWhite, border: `1px solid oklch(88% 0.01 80)`, borderTop: `3px solid ${currentStage.color}`, padding: "36px 32px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
            <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, color: currentStage.color, lineHeight: 1, flexShrink: 0, marginTop: -6 }}>
              {currentStage.letter}
            </div>
            <div>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 800, color: navy, marginBottom: 4 }}>
                {lang === "en" ? currentStage.en_label : lang === "id" ? currentStage.id_label : currentStage.nl_label}
                <span style={{ fontSize: 14, fontWeight: 400, color: bodyText, marginLeft: 12 }}>
                  — {lang === "en" ? currentStage.en_sub : lang === "id" ? currentStage.id_sub : currentStage.nl_sub}
                </span>
              </h3>
              <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                {lang === "en" ? currentStage.en_guide : lang === "id" ? currentStage.id_guide : currentStage.nl_guide}
              </p>
            </div>
          </div>

          {/* Questions */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: currentStage.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("Prompting questions", "Pertanyaan pemandu", "Leidende vragen")}
            </p>
            <ul style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 6 }}>
              {(lang === "en" ? currentStage.en_questions : lang === "id" ? currentStage.id_questions : currentStage.nl_questions).map((q, i) => (
                <li key={i} style={{ fontSize: 14, color: bodyText, lineHeight: 1.65 }}>{q}</li>
              ))}
            </ul>
          </div>

          {/* Textarea */}
          <textarea
            value={answers[activeStage]}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [activeStage]: e.target.value }))}
            placeholder={lang === "en" ? currentStage.en_placeholder : lang === "id" ? currentStage.id_placeholder : currentStage.nl_placeholder}
            rows={5}
            style={{ width: "100%", padding: "16px 18px", fontFamily: serif, fontSize: 17, color: bodyText, background: lightGray, border: `1px solid oklch(88% 0.01 80)`, borderRadius: 4, resize: "vertical", lineHeight: 1.75, marginBottom: 20, boxSizing: "border-box" }}
          />

          {/* Cross-cultural note */}
          <div style={{ background: currentStage.colorBg, padding: "16px 20px", marginBottom: 24 }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: currentStage.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              {t("Cross-cultural note", "Catatan lintas budaya", "Interculturele noot")}
            </p>
            <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.7, margin: 0 }}>
              {lang === "en" ? currentStage.en_cross : lang === "id" ? currentStage.id_cross : currentStage.nl_cross}
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => canGoBack && setActiveStage(ORID_STAGES[currentStageIndex - 1].key as ORIDKey)}
              disabled={!canGoBack}
              style={{ padding: "10px 24px", border: `1px solid ${canGoBack ? navy : "oklch(88% 0.01 80)"}`, background: "transparent", color: canGoBack ? navy : "oklch(80% 0.01 80)", cursor: canGoBack ? "pointer" : "default", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, borderRadius: 4 }}
            >
              ← {t("Back", "Kembali", "Terug")}
            </button>
            <span style={{ fontSize: 12, color: bodyText, fontWeight: 600 }}>
              {currentStageIndex + 1} / {ORID_STAGES.length}
            </span>
            {canGoForward ? (
              <button
                onClick={() => setActiveStage(ORID_STAGES[currentStageIndex + 1].key as ORIDKey)}
                style={{ padding: "10px 24px", border: "none", background: currentStage.color, color: offWhite, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, borderRadius: 4 }}
              >
                {t("Next Stage", "Tahap Berikutnya", "Volgende Fase")} →
              </button>
            ) : (
              <button
                onClick={() => setShowToolkit(true)}
                style={{ padding: "10px 24px", border: "none", background: allComplete ? orange : "oklch(88% 0.01 80)", color: allComplete ? offWhite : "oklch(70% 0.01 80)", cursor: allComplete ? "pointer" : "default", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, borderRadius: 4 }}
              >
                {t("See Debrief Toolkit →", "Lihat Toolkit Debrief →", "Zie Debrief Toolkit →")}
              </button>
            )}
          </div>
        </div>

        {/* Shortcut to toolkit if not all done */}
        {!allComplete && (
          <p style={{ fontSize: 13, color: bodyText, textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setShowToolkit(true)} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, textDecoration: "underline dotted", fontSize: 13 }}>
              {t("Skip to the Leader's Debrief Toolkit", "Lewati ke Toolkit Debrief Pemimpin", "Ga naar de Debrief Toolkit voor Leiders")}
            </button>
          </p>
        )}
      </div>

      {/* DEBRIEF TOOLKIT */}
      {(showToolkit || allComplete) && (
        <div style={{ background: lightGray, padding: "80px 24px", marginTop: 64 }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>

            {/* Toolkit header */}
            <div style={{ background: navy, padding: "44px 40px", marginBottom: 48 }}>
              <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                {t("For Leaders", "Untuk Pemimpin", "Voor Leiders")}
              </p>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: offWhite, marginBottom: 16 }}>
                {t("The Leader's Debrief Toolkit", "Toolkit Debrief Pemimpin", "De Debrief Toolkit voor Leiders")}
              </h2>
              <p style={{ fontSize: 15, color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 560, margin: 0 }}>
                {t(
                  "Use this toolkit to run structured ORID debriefs with your own team. Recommended for: after any significant project, cross-cultural experience, conflict, or leadership decision. Time required: 45–75 minutes.",
                  "Gunakan toolkit ini untuk menjalankan debrief ORID terstruktur dengan tim Anda sendiri. Direkomendasikan untuk: setelah proyek signifikan, pengalaman lintas budaya, konflik, atau keputusan kepemimpinan. Waktu yang diperlukan: 45–75 menit.",
                  "Gebruik deze toolkit om gestructureerde ORID-debriefs met je eigen team te leiden. Aanbevolen voor: na elk significant project, interculturele ervaring, conflict of leiderschapsbeslissing. Benodigde tijd: 45–75 minuten."
                )}
              </p>
            </div>

            {/* ORID question banks */}
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navy, marginBottom: 32 }}>
              {t("Question Bank by Stage", "Kumpulan Pertanyaan per Tahap", "Vragenbank per Fase")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 56 }}>
              {toolkitKeys.map((key) => (
                <div key={key} style={{ background: offWhite, padding: "28px 32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: toolkitColors[key], lineHeight: 1, flexShrink: 0 }}>{key}</div>
                    <div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 800, color: navy }}>
                        {lang === "en" ? toolkitLabels[key].en : lang === "id" ? toolkitLabels[key].id : toolkitLabels[key].nl}
                      </div>
                    </div>
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {(lang === "en" ? TOOLKIT_QUESTIONS[key].en : lang === "id" ? TOOLKIT_QUESTIONS[key].id : TOOLKIT_QUESTIONS[key].nl).map((q, i) => (
                      <li key={i} style={{ fontSize: 15, color: bodyText, lineHeight: 1.65 }}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Facilitation tips */}
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navy, marginBottom: 32 }}>
              {t("Facilitation Tips", "Tips Fasilitasi", "Facilitatietips")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 56 }}>
              {FACILITATION_TIPS.map((tip, i) => (
                <div key={i} style={{ background: offWhite, padding: "24px 28px" }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 800, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? tip.en_tip : lang === "id" ? tip.id_tip : tip.nl_tip}
                  </p>
                  <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                    {lang === "en" ? tip.en_body : lang === "id" ? tip.id_body : tip.nl_body}
                  </p>
                </div>
              ))}
            </div>

            {/* Run sheet */}
            <div style={{ background: offWhite, padding: "36px 40px" }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 800, color: navy, marginBottom: 24 }}>
                {t("Sample Run Sheet (60 minutes)", "Contoh Jadwal (60 menit)", "Voorbeeld Tijdschema (60 minuten)")}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { time: "0–5", en: "Frame the debrief: name the experience being debriefed, set the purpose, and remind the team that reflection is not blame.", id: "Bingkai debrief: sebutkan pengalaman yang akan di-debrief, tetapkan tujuan, dan ingatkan tim bahwa refleksi bukanlah menyalahkan.", nl: "Kader het debrief: benoem de ervaring die wordt gedebriefd, stel het doel vast, en herinner het team dat reflectie geen verwijt is." },
                  { time: "5–15", en: "O — Objective: What happened? Establish the shared facts.", id: "O — Objektif: Apa yang terjadi? Tetapkan fakta bersama.", nl: "O — Objectief: Wat is er gebeurd? Stel de gedeelde feiten vast." },
                  { time: "15–25", en: "R — Reflective: How did it feel? Surface the emotional data.", id: "R — Reflektif: Bagaimana rasanya? Ungkapkan data emosional.", nl: "R — Reflectief: Hoe voelde het? Haal de emotionele data naar boven." },
                  { time: "25–45", en: "I — Interpretive: What does it mean? This is the longest stage — hold space for multiple perspectives.", id: "I — Interpretatif: Apa artinya? Ini adalah tahap terpanjang — berikan ruang untuk berbagai perspektif.", nl: "I — Interpretatief: Wat betekent het? Dit is de langste fase — houd ruimte voor meerdere perspectieven." },
                  { time: "45–55", en: "D — Decisional: What will we do? Land on 1–2 concrete actions with named owners.", id: "D — Keputusan: Apa yang akan kita lakukan? Landas pada 1–2 tindakan konkret dengan pemilik yang disebutkan.", nl: "D — Beslissend: Wat doen we? Land op 1–2 concrete acties met genoemde eigenaren." },
                  { time: "55–60", en: "Close: Brief gratitude round. What was useful about this conversation?", id: "Penutup: Putaran syukur singkat. Apa yang berguna dari percakapan ini?", nl: "Afsluiting: Korte dankbaarheidsronde. Wat was nuttig aan dit gesprek?" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 20, padding: "12px 0", borderBottom: i < 5 ? "1px solid oklch(92% 0.008 80)" : "none", alignItems: "flex-start" }}>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: orange, minWidth: 52, flexShrink: 0, paddingTop: 2 }}>
                      {row.time} {t("min", "mnt", "min")}
                    </div>
                    <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.65, margin: 0 }}>
                      {lang === "en" ? row.en : lang === "id" ? row.id : row.nl}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ fontSize: 16, color: "oklch(76% 0.03 80)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 36px", background: orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4 }}>
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
