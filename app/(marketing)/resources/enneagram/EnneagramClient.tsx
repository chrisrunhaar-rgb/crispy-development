"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard, saveEnneagramResult } from "../actions";
import EnneagramTypesGrid from "./EnneagramTypesGrid";
import TypeCard from "./TypeCard";
import LangToggle from "@/components/LangToggle";

// ── LANGUAGE ──────────────────────────────────────────────────────────────────
type Lang = "en" | "id" | "nl";
type T3 = { en: string; id: string; nl: string };
function tFn(obj: T3, lang: Lang): string { return obj[lang]; }

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 45 statements (5 per type). Field `t` = Enneagram type number (1-9).
// Rated 1–5: 1 = Not like me → 5 = Very much like me.

const QUESTIONS: { en: string; id: string; nl: string; t: number }[] = [
  // Type 1 — The Reformer
  {
    en: "I hold myself and others to high standards and feel responsible for doing things the right way.",
    id: "Saya memegang standar tinggi untuk diri saya dan orang lain, dan merasa bertanggung jawab untuk melakukan sesuatu dengan benar.",
    nl: "Ik stel hoge eisen aan mezelf en anderen en voel me verantwoordelijk om dingen op de juiste manier te doen.",
    t: 1,
  },
  {
    en: "I notice flaws and imperfections quickly — in myself, others, or situations.",
    id: "Saya cepat menyadari kekurangan dan ketidaksempurnaan — dalam diri saya, orang lain, atau situasi.",
    nl: "Ik zie fouten en onvolkomenheden snel — bij mezelf, anderen of in situaties.",
    t: 1,
  },
  {
    en: "There is a persistent inner critic in my mind that holds me accountable.",
    id: "Ada suara kritik batin yang terus-menerus dalam pikiran saya yang membuat saya bertanggung jawab.",
    nl: "Er is een aanhoudende innerlijke criticus in mijn hoofd die mij verantwoordelijk houdt.",
    t: 1,
  },
  {
    en: "I feel a strong sense of purpose tied to making things better or more just.",
    id: "Saya merasakan tujuan yang kuat yang terkait dengan membuat segala sesuatu menjadi lebih baik atau lebih adil.",
    nl: "Ik heb een sterk gevoel van doelgerichtheid dat verbonden is met het verbeteren van de wereld en het bevorderen van rechtvaardigheid.",
    t: 1,
  },
  {
    en: "When people around me cut corners or ignore ethical standards, I feel frustrated and responsible to address it.",
    id: "Ketika orang-orang di sekitar saya mengambil jalan pintas atau mengabaikan standar etis, saya merasa frustrasi dan bertanggung jawab untuk mengatasinya.",
    nl: "Als mensen om mij heen sluipwegen nemen of ethische normen negeren, voel ik me gefrustreerd en verplicht om er iets van te zeggen.",
    t: 1,
  },
  // Type 2 — The Helper
  {
    en: "I naturally sense what others need and feel pulled to provide it.",
    id: "Saya secara alami merasakan apa yang dibutuhkan orang lain dan merasa terdorong untuk memenuhinya.",
    nl: "Ik voel van nature aan wat anderen nodig hebben en word gedreven om daarin te voorzien.",
    t: 2,
  },
  {
    en: "My sense of worth is closely tied to being needed and appreciated by others.",
    id: "Rasa harga diri saya sangat terkait dengan dibutuhkan dan dihargai oleh orang lain.",
    nl: "Mijn gevoel van eigenwaarde is sterk verbonden met nodig zijn en gewaardeerd worden door anderen.",
    t: 2,
  },
  {
    en: "I find it easier to give than to receive — asking for help feels uncomfortable.",
    id: "Saya merasa lebih mudah memberi daripada menerima — meminta bantuan terasa tidak nyaman.",
    nl: "Ik vind het gemakkelijker om te geven dan te ontvangen — om hulp vragen voelt ongemakkelijk.",
    t: 2,
  },
  {
    en: "I adapt my behaviour to what will make the people I care about feel good.",
    id: "Saya menyesuaikan perilaku saya dengan apa yang akan membuat orang-orang yang saya pedulikan merasa baik.",
    nl: "Ik pas mijn gedrag aan op wat de mensen die mij dierbaar zijn een goed gevoel geeft.",
    t: 2,
  },
  {
    en: "People often come to me for emotional support, and I rarely turn them away.",
    id: "Orang-orang sering datang kepada saya untuk dukungan emosional, dan saya hampir tidak pernah menolak mereka.",
    nl: "Mensen komen vaak bij mij voor emotionele steun, en ik stuur hen zelden weg.",
    t: 2,
  },
  // Type 3 — The Achiever
  {
    en: "Accomplishing goals and being seen as successful is very important to me.",
    id: "Mencapai tujuan dan dilihat sebagai orang yang sukses sangat penting bagi saya.",
    nl: "Het behalen van doelen en als succesvol worden gezien is voor mij erg belangrijk.",
    t: 3,
  },
  {
    en: "I can adapt my style and presentation depending on what the situation or audience requires.",
    id: "Saya dapat menyesuaikan gaya dan presentasi saya tergantung pada apa yang dibutuhkan situasi atau audiens.",
    nl: "Ik kan mijn stijl en presentatie aanpassen aan wat de situatie of het publiek vereist.",
    t: 3,
  },
  {
    en: "I feel most alive when I am making progress, completing tasks, and being productive.",
    id: "Saya merasa paling hidup ketika saya membuat kemajuan, menyelesaikan tugas, dan menjadi produktif.",
    nl: "Ik voel me het meest levend als ik vooruitgang boek, taken afmaak en productief ben.",
    t: 3,
  },
  {
    en: "I am aware of how others perceive me and work to maintain a positive, competent image.",
    id: "Saya sadar bagaimana orang lain memandang saya dan berusaha untuk mempertahankan citra yang positif dan kompeten.",
    nl: "Ik ben me bewust van hoe anderen mij zien en werk eraan om een positief en bekwaam beeld te handhaven.",
    t: 3,
  },
  {
    en: "I tend to measure my value by what I achieve and struggle to slow down without feeling guilty.",
    id: "Saya cenderung mengukur nilai diri saya dari apa yang saya capai dan kesulitan untuk melambat tanpa merasa bersalah.",
    nl: "Ik meet mijn waarde vaak af aan wat ik bereik en vind het moeilijk om te vertragen zonder me schuldig te voelen.",
    t: 3,
  },
  // Type 4 — The Individualist
  {
    en: "I often feel that something is missing — a sense of incompleteness or deep longing.",
    id: "Saya sering merasa ada sesuatu yang hilang — rasa ketidaklengkapan atau kerinduan yang mendalam.",
    nl: "Ik heb vaak het gevoel dat er iets ontbreekt — een gevoel van onvolledigheid of een diep verlangen.",
    t: 4,
  },
  {
    en: "I have deep and intense emotions that others don't always understand.",
    id: "Saya memiliki emosi yang dalam dan intens yang tidak selalu dipahami orang lain.",
    nl: "Ik heb diepe en intense gevoelens die anderen niet altijd begrijpen.",
    t: 4,
  },
  {
    en: "I value authenticity and originality highly — being ordinary or typical feels suffocating.",
    id: "Saya sangat menghargai keaslian dan orisinalitas — menjadi biasa atau tipikal terasa menyesakkan.",
    nl: "Ik hecht veel waarde aan authenticiteit en originaliteit — gewoon of doorsnee zijn voelt verstikkend.",
    t: 4,
  },
  {
    en: "I am drawn to what is meaningful, beautiful, and emotionally significant.",
    id: "Saya tertarik pada hal-hal yang bermakna, indah, dan penting secara emosional.",
    nl: "Ik word aangetrokken door wat betekenisvol, mooi en emotioneel van belang is.",
    t: 4,
  },
  {
    en: "I can experience mood swings and sometimes feel fundamentally different from those around me.",
    id: "Saya bisa mengalami perubahan suasana hati dan terkadang merasa berbeda secara mendasar dari orang-orang di sekitar saya.",
    nl: "Ik kan stemmingswisselingen ervaren en voel me soms fundamenteel anders dan de mensen om mij heen.",
    t: 4,
  },
  // Type 5 — The Investigator
  {
    en: "I prefer to observe and think deeply before joining a conversation or making a decision.",
    id: "Saya lebih suka mengamati dan berpikir mendalam sebelum bergabung dalam percakapan atau mengambil keputusan.",
    nl: "Ik observeer en denk liever grondig na voordat ik deelneem aan een gesprek of een beslissing neem.",
    t: 5,
  },
  {
    en: "I protect my energy and time carefully and need significant alone time to recharge.",
    id: "Saya menjaga energi dan waktu saya dengan hati-hati dan membutuhkan waktu sendirian yang cukup untuk mengisi ulang daya.",
    nl: "Ik ga zorgvuldig om met mijn energie en tijd en heb veel alleen-tijd nodig om op te laden.",
    t: 5,
  },
  {
    en: "I feel most confident when I have built deep knowledge and expertise in an area.",
    id: "Saya merasa paling percaya diri ketika saya telah membangun pengetahuan dan keahlian yang mendalam di suatu bidang.",
    nl: "Ik voel me het meest zeker als ik diepgaande kennis en expertise in een gebied heb opgebouwd.",
    t: 5,
  },
  {
    en: "Emotionally intense situations feel draining — I prefer engaging with ideas over strong feelings.",
    id: "Situasi yang penuh emosi terasa melelahkan — saya lebih suka berinteraksi dengan ide daripada perasaan yang kuat.",
    nl: "Emotioneel intense situaties voelen uitputtend — ik werk liever met ideeën dan met sterke gevoelens.",
    t: 5,
  },
  {
    en: "I tend to minimise my needs so I don't feel dependent on or overwhelmed by others.",
    id: "Saya cenderung meminimalkan kebutuhan saya agar tidak merasa bergantung pada atau kewalahan oleh orang lain.",
    nl: "Ik neig ertoe mijn behoeften te minimaliseren zodat ik me niet afhankelijk van anderen voel of door hen overweldigd word.",
    t: 5,
  },
  // Type 6 — The Loyalist
  {
    en: "I tend to anticipate problems and mentally prepare for what could go wrong.",
    id: "Saya cenderung mengantisipasi masalah dan secara mental mempersiapkan diri untuk apa yang mungkin salah.",
    nl: "Ik neig ertoe problemen te voorzien en me mentaal voor te bereiden op wat er mis kan gaan.",
    t: 6,
  },
  {
    en: "Trust must be earned — I can be skeptical of authority or new people until I feel certain.",
    id: "Kepercayaan harus diperoleh — saya bisa skeptis terhadap otoritas atau orang baru sampai saya merasa yakin.",
    nl: "Vertrouwen moet verdiend worden — ik kan sceptisch zijn tegenover autoriteit of nieuwe mensen totdat ik zekerheid voel.",
    t: 6,
  },
  {
    en: "I feel most secure within trusted relationships, clear structures, and reliable expectations.",
    id: "Saya merasa paling aman dalam hubungan yang terpercaya, struktur yang jelas, dan harapan yang dapat diandalkan.",
    nl: "Ik voel me het meest veilig in vertrouwde relaties, duidelijke structuren en betrouwbare verwachtingen.",
    t: 6,
  },
  {
    en: "Once I commit to a person or cause, I am deeply loyal and show up consistently.",
    id: "Ketika saya berkomitmen pada seseorang atau suatu tujuan, saya sangat setia dan hadir secara konsisten.",
    nl: "Als ik me aan iemand of een zaak verbind, ben ik diep loyaal en kom ik consequent opdagen.",
    t: 6,
  },
  {
    en: "I experience underlying anxiety about security and sometimes struggle to fully trust my own judgment.",
    id: "Saya mengalami kecemasan mendasar tentang keamanan dan terkadang kesulitan untuk sepenuhnya mempercayai penilaian saya sendiri.",
    nl: "Ik ervaar een onderliggende angst over veiligheid en heb het soms moeilijk om mijn eigen oordeel volledig te vertrouwen.",
    t: 6,
  },
  // Type 7 — The Enthusiast
  {
    en: "I am energised by new ideas, possibilities, and experiences — life feels most alive when things are fresh.",
    id: "Saya mendapat energi dari ide-ide baru, kemungkinan, dan pengalaman — hidup terasa paling hidup ketika segalanya segar.",
    nl: "Ik krijg energie van nieuwe ideeën, mogelijkheden en ervaringen — het leven voelt het levendigst als er frisse dingen zijn.",
    t: 7,
  },
  {
    en: "I find it hard to stay with discomfort or boredom for long — I tend to reframe or move on.",
    id: "Saya kesulitan untuk bertahan dalam ketidaknyamanan atau kebosanan — saya cenderung mereframing atau beranjak.",
    nl: "Ik vind het moeilijk om lang met ongemak of verveling te blijven — ik herformuleer situaties liever of ga verder.",
    t: 7,
  },
  {
    en: "I have many interests and ideas, and I sometimes start more things than I finish.",
    id: "Saya memiliki banyak minat dan ide, dan terkadang saya memulai lebih banyak hal daripada yang saya selesaikan.",
    nl: "Ik heb veel interesses en ideeën, en ik begin soms meer dingen dan ik afmaak.",
    t: 7,
  },
  {
    en: "I prefer to keep my options open and find restrictions or firm commitments uncomfortable.",
    id: "Saya lebih suka menjaga pilihan tetap terbuka dan merasa tidak nyaman dengan pembatasan atau komitmen yang tegas.",
    nl: "Ik houd mijn opties liever open en vind beperkingen of vaste verplichtingen ongemakkelijk.",
    t: 7,
  },
  {
    en: "I naturally see the positive in situations and become restless when life feels too routine.",
    id: "Saya secara alami melihat sisi positif dalam situasi dan menjadi gelisah ketika hidup terasa terlalu rutin.",
    nl: "Ik zie van nature het positieve in situaties en word onrustig als het leven te routinematig aanvoelt.",
    t: 7,
  },
  // Type 8 — The Challenger
  {
    en: "I take charge naturally and am comfortable confronting situations or people that feel unjust.",
    id: "Saya secara alami mengambil kendali dan nyaman menghadapi situasi atau orang yang terasa tidak adil.",
    nl: "Ik neem van nature de leiding en heb er geen moeite mee situaties of mensen te confronteren die onrechtvaardig aanvoelen.",
    t: 8,
  },
  {
    en: "Vulnerability feels uncomfortable — I prefer to project strength and stay in control.",
    id: "Kerentanan terasa tidak nyaman — saya lebih suka menampilkan kekuatan dan tetap dalam kendali.",
    nl: "Kwetsbaarheid voelt ongemakkelijk — ik projecteer liever kracht en blijf in controle.",
    t: 8,
  },
  {
    en: "I can be intense and others sometimes experience me as too direct, too forceful, or too much.",
    id: "Saya bisa menjadi intens dan orang lain terkadang mengalami saya sebagai terlalu langsung, terlalu tegas, atau terlalu banyak.",
    nl: "Ik kan intens zijn en anderen ervaren mij soms als te direct, te dwingend of te veel.",
    t: 8,
  },
  {
    en: "I feel called to protect people who are vulnerable and to fight for what is right.",
    id: "Saya merasa terpanggil untuk melindungi orang-orang yang rentan dan berjuang untuk kebenaran.",
    nl: "Ik voel me geroepen om kwetsbare mensen te beschermen en te strijden voor wat juist is.",
    t: 8,
  },
  {
    en: "I go all-in on what I believe in — half-measures and timidity frustrate me deeply.",
    id: "Saya sepenuhnya berkomitmen pada apa yang saya percaya — setengah-setengah dan pengecut membuat saya sangat frustrasi.",
    nl: "Ik ga volledig voor wat ik geloof — halfslachtigheid en besluiteloosheid frustreren mij diep.",
    t: 8,
  },
  // Type 9 — The Peacemaker
  {
    en: "I find conflict deeply uncomfortable and naturally try to mediate or smooth things over.",
    id: "Saya merasa konflik sangat tidak nyaman dan secara alami berusaha untuk menjadi perantara atau meredakannya.",
    nl: "Ik vind conflict diep ongemakkelijk en probeer van nature te bemiddelen of de zaken glad te strijken.",
    t: 9,
  },
  {
    en: "I can lose sight of my own priorities when I am busy supporting others.",
    id: "Saya bisa kehilangan pandangan tentang prioritas saya sendiri ketika saya sibuk mendukung orang lain.",
    nl: "Ik kan mijn eigen prioriteiten uit het oog verliezen als ik druk bezig ben anderen te ondersteunen.",
    t: 9,
  },
  {
    en: "I see all sides of an issue and can find it hard to take a strong personal stance.",
    id: "Saya melihat semua sisi dari suatu masalah dan bisa merasa kesulitan untuk mengambil sikap yang kuat secara pribadi.",
    nl: "Ik zie alle kanten van een kwestie en vind het soms moeilijk om een duidelijk persoonlijk standpunt in te nemen.",
    t: 9,
  },
  {
    en: "People find me easy to be around — I have a calming, reassuring presence.",
    id: "Orang-orang merasa nyaman berada di sekitar saya — saya memiliki kehadiran yang menenangkan dan meyakinkan.",
    nl: "Mensen vinden het prettig om bij mij te zijn — ik heb een kalmerende, geruststellende aanwezigheid.",
    t: 9,
  },
  {
    en: "I can procrastinate on things that matter to me personally while remaining productive for others.",
    id: "Saya bisa menunda hal-hal yang penting bagi saya secara pribadi sementara tetap produktif untuk orang lain.",
    nl: "Ik kan dingen die mij persoonlijk belangrijk zijn voor me uitschuiven, terwijl ik voor anderen productief blijf.",
    t: 9,
  },
];

// Round-robin question order: interleaves all 9 types (type1q1, type2q1, ..., type9q1, type1q2, ...)
const QUESTION_ORDER = [
  0, 5, 10, 15, 20, 25, 30, 35, 40,
  1, 6, 11, 16, 21, 26, 31, 36, 41,
  2, 7, 12, 17, 22, 27, 32, 37, 42,
  3, 8, 13, 18, 23, 28, 33, 38, 43,
  4, 9, 14, 19, 24, 29, 34, 39, 44,
];

const SCALE_LABELS: T3[] = [
  { en: "Not like me",        id: "Tidak seperti saya",       nl: "Niet zoals ik" },
  { en: "Slightly like me",   id: "Sedikit seperti saya",     nl: "Een beetje zoals ik" },
  { en: "Somewhat like me",   id: "Agak seperti saya",        nl: "Enigszins zoals ik" },
  { en: "Mostly like me",     id: "Sebagian besar seperti saya", nl: "Grotendeels zoals ik" },
  { en: "Very much like me",  id: "Sangat seperti saya",      nl: "Heel erg zoals ik" },
];

const UI: Record<string, T3> = {
  personalityAssessment: { en: "Personality Assessment", id: "Penilaian Kepribadian", nl: "Persoonlijkheidsbeoordeling" },
  enneagram:             { en: "Enneagram",              id: "Enneagram",             nl: "Enneagram" },
  startAssessment:       { en: "Start Assessment →",     id: "Mulai Tes →",     nl: "Start Test →" },
  saveDashboard:         { en: "Save to Dashboard",      id: "Simpan ke Dashboard",      nl: "Opslaan in Dashboard" },
  saved:                 { en: "✓ Saved to Dashboard",                id: "✓ Tersimpan di Dashboard",           nl: "✓ Opgeslagen in Dashboard" },
  saving:                { en: "Saving…",                id: "Menyimpan…",            nl: "Opslaan…" },
  saveMyResult:          { en: "Save My Result →",       id: "Simpan Hasil Saya →",   nl: "Mijn Resultaat Opslaan →" },
  resultSaved:           { en: "✓ Result saved to your dashboard", id: "✓ Hasil disimpan ke dasbor Anda", nl: "✓ Resultaat opgeslagen in uw dashboard" },
  retake:                { en: "Retake",                 id: "Ulangi",                nl: "Opnieuw doen" },
  yourType:              { en: "Your Type",              id: "Tipe Anda",             nl: "Uw Type" },
  wing:                  { en: "Wing — ",                id: "Wing — ",               nl: "Vleugel — " },
  yourScoreProfile:      { en: "Your Score Profile",     id: "Profil Skor Anda",      nl: "Uw Scoreprofiel" },
  coreMotivation:        { en: "Core Motivation",        id: "Motivasi Inti",         nl: "Kernmotivatie" },
  coreFear:              { en: "Core Fear",              id: "Ketakutan Inti",        nl: "Kernangst" },
  strengths:             { en: "Strengths",              id: "Kekuatan",              nl: "Sterke Punten" },
  growthAreas:           { en: "Growth Areas",           id: "Area Pertumbuhan",      nl: "Groeipunten" },
  howToCommunicate:      { en: "How to Communicate with This Type", id: "Cara Berkomunikasi dengan Tipe Ini", nl: "Hoe te Communiceren met Dit Type" },
  crossCulturalLeadership: { en: "Cross-Cultural Leadership", id: "Kepemimpinan Lintas Budaya", nl: "Intercultureel Leiderschap" },
  allNineTypes:          { en: "All Nine Types",         id: "Semua Sembilan Tipe",   nl: "Alle Negen Types" },
  yourTypeBadge:         { en: "Your Type",              id: "Tipe Anda",             nl: "Uw Type" },
  motivation:            { en: "Motivation: ",           id: "Motivasi: ",            nl: "Motivatie: " },
  aboutAssessment:       { en: "About This Assessment",  id: "Tentang Penilaian Ini", nl: "Over Deze Beoordeling" },
  whatIsEnneagram:       { en: "What is the Enneagram?", id: "Apa itu Enneagram?",    nl: "Wat is het Enneagram?" },
  enneagramP1:           {
    en: "The Enneagram is one of the most powerful personality frameworks available for leadership development. Unlike tools that simply describe surface behaviour, the Enneagram reveals the why behind how you act — your core motivations, deepest fears, and most consistent patterns.",
    id: "Enneagram adalah salah satu kerangka kepribadian paling kuat yang tersedia untuk pengembangan kepemimpinan. Tidak seperti alat yang hanya menggambarkan perilaku permukaan, Enneagram mengungkapkan mengapa di balik cara Anda bertindak — motivasi inti, ketakutan terdalam, dan pola yang paling konsisten.",
    nl: "Het Enneagram is een van de krachtigste persoonlijkheidsmodellen voor leiderschapsontwikkeling. In tegenstelling tot instrumenten die alleen oppervlakkig gedrag beschrijven, onthult het Enneagram het waarom achter hoe u handelt — uw kernmotivaties, diepste angsten en meest consistente patronen.",
  },
  enneagramP2:           {
    en: "The word comes from the Greek ennea (nine) and gramma (something written). It describes nine distinct personality types, each shaped by a core motivation and a core fear that operate below the surface of most self-awareness. The system has roots in ancient wisdom traditions and has been developed in modern form by teachers like Riso, Hudson, and Rohr.",
    id: "Kata ini berasal dari bahasa Yunani ennea (sembilan) dan gramma (sesuatu yang tertulis). Ini menggambarkan sembilan tipe kepribadian yang berbeda, masing-masing dibentuk oleh motivasi inti dan ketakutan inti yang beroperasi di bawah permukaan kesadaran diri. Sistem ini berakar pada tradisi kebijaksanaan kuno dan telah dikembangkan dalam bentuk modern oleh guru-guru seperti Riso, Hudson, dan Rohr.",
    nl: "Het woord komt van het Griekse ennea (negen) en gramma (iets geschrevens). Het beschrijft negen onderscheiden persoonlijkheidstypes, elk gevormd door een kernmotivatie en een kernangst die onder het oppervlak van het zelfbewustzijn werken. Het systeem heeft wortels in oude wijsheidstradities en is in moderne vorm ontwikkeld door leraren als Riso, Hudson en Rohr.",
  },
  enneagramP3:           {
    en: "For cross-cultural teams, the Enneagram is particularly valuable. It explains why leaders from different backgrounds can have the same behaviour for completely different reasons — and why the same approach can feel like care to one person and control to another.",
    id: "Untuk tim lintas budaya, Enneagram sangat berharga. Ini menjelaskan mengapa pemimpin dari latar belakang yang berbeda dapat memiliki perilaku yang sama karena alasan yang sangat berbeda — dan mengapa pendekatan yang sama bisa terasa seperti perhatian bagi satu orang dan kontrol bagi orang lain.",
    nl: "Voor interculturele teams is het Enneagram bijzonder waardevol. Het verklaart waarom leiders uit verschillende achtergronden hetzelfde gedrag kunnen vertonen om totaal verschillende redenen — en waarom dezelfde aanpak voor de ene persoon als zorg aanvoelt en voor de andere als controle.",
  },
  nineTypes:             { en: "The Nine Types",         id: "Sembilan Tipe",         nl: "De Negen Types" },
  howToTake:             { en: "How to take this assessment", id: "Cara mengikuti penilaian ini", nl: "Hoe deze beoordeling in te vullen" },
  tip1:                  { en: "Answer 45 short statements — about 8–10 minutes.", id: "Jawab 45 pernyataan singkat — sekitar 8–10 menit.", nl: "Beantwoord 45 korte stellingen — ongeveer 8–10 minuten." },
  tip2:                  { en: "Rate each statement 1–5 based on how much it describes you.", id: "Beri nilai setiap pernyataan 1–5 berdasarkan seberapa banyak itu menggambarkan Anda.", nl: "Beoordeel elke stelling 1–5 op basis van hoe goed die u beschrijft." },
  tip3:                  { en: "Answer based on how you generally are, not how you want to be.", id: "Jawab berdasarkan bagaimana Anda umumnya, bukan bagaimana Anda ingin menjadi.", nl: "Antwoord op basis van hoe u doorgaans bent, niet hoe u wilt zijn." },
  tip4:                  { en: "There are no right or wrong answers — be as honest as you can.", id: "Tidak ada jawaban yang benar atau salah — jujurlah sebisa mungkin.", nl: "Er zijn geen goede of foute antwoorden — wees zo eerlijk mogelijk." },
  tip5:                  { en: "Your result reflects your most active pattern, not a fixed label.", id: "Hasil Anda mencerminkan pola yang paling aktif, bukan label yang tetap.", nl: "Uw resultaat weerspiegelt uw meest actieve patroon, niet een vast label." },
  questionOf:            { en: (i: number, total: number) => `Question ${i} of ${total}` as string, id: (i: number, total: number) => `Pertanyaan ${i} dari ${total}` as string, nl: (i: number, total: number) => `Vraag ${i} van ${total}` as string } as unknown as T3,
  howMuch:               { en: "How much does this describe you?", id: "Seberapa banyak ini menggambarkan Anda?", nl: "In hoeverre beschrijft dit u?" },
  back:                  { en: "← Back", id: "← Kembali", nl: "← Terug" },
};

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

const TYPES = [
  {
    number: 1,
    name: { en: "The Reformer", id: "Si Perfeksionis", nl: "De Hervormer" },
    tagline: { en: "Principled. Purposeful. Committed to what's right.", id: "Berprinsip. Bertujuan. Berkomitmen pada kebenaran.", nl: "Principieel. Doelgericht. Toegewijd aan wat juist is." },
    color: "oklch(52% 0.18 250)",
    colorLight: "oklch(65% 0.14 250)",
    colorVeryLight: "oklch(94% 0.03 250)",
    bg: "oklch(18% 0.14 250)",
    overview: {
      en: "The Type 1 leader is driven by a deep sense of purpose and a commitment to integrity. They hold themselves and others to high standards, work hard to improve what's broken, and lead by example. Their inner conviction is one of their greatest strengths — and their greatest source of internal pressure.",
      id: "Pemimpin Tipe 1 didorong oleh rasa tujuan yang mendalam dan komitmen terhadap integritas. Mereka memegang standar tinggi untuk diri mereka sendiri dan orang lain, bekerja keras untuk memperbaiki apa yang salah, dan memimpin dengan teladan. Keyakinan batin mereka adalah salah satu kekuatan terbesar mereka — dan sumber tekanan internal terbesar mereka.",
      nl: "De Type 1-leider wordt gedreven door een diep gevoel van doelgerichtheid en een toewijding aan integriteit. Ze stellen hoge eisen aan zichzelf en anderen, werken hard om te verbeteren wat niet deugt, en leiden door voorbeeld. Hun innerlijke overtuiging is een van hun grootste krachten — en hun grootste bron van interne druk.",
    },
    motivation: {
      en: "To be good, ethical, and right — to improve the world and act with integrity.",
      id: "Menjadi baik, etis, dan benar — untuk memperbaiki dunia dan bertindak dengan integritas.",
      nl: "Goed, ethisch en juist zijn — de wereld verbeteren en met integriteit handelen.",
    },
    fear: {
      en: "Being flawed, corrupt, or condemned — being a hypocrite who fails to live up to their own ideals.",
      id: "Menjadi cacat, korup, atau terkutuk — menjadi munafik yang gagal memenuhi ideal mereka sendiri.",
      nl: "Gebrekkig, corrupt of veroordeeld zijn — een huichelaar zijn die niet aan zijn eigen idealen voldoet.",
    },
    strengths: {
      en: ["Principled and deeply ethical", "High standards and consistent follow-through", "Brings clarity to values and expectations", "Self-disciplined and hardworking", "Natural reformer — always working to improve"],
      id: ["Berprinsip dan sangat etis", "Standar tinggi dan konsisten dalam tindak lanjut", "Membawa kejelasan pada nilai-nilai dan harapan", "Disiplin diri dan rajin", "Reformator alami — selalu bekerja untuk memperbaiki"],
      nl: ["Principieel en diep ethisch", "Hoge normen en consequente opvolging", "Brengt duidelijkheid in waarden en verwachtingen", "Zelfdisciplineerd en hardwerkend", "Natuurlijke hervormer — altijd bezig met verbeteren"],
    },
    blindspots: {
      en: ["Can be overly self-critical and perfectionistic", "May judge others harshly against their internal standards", "Resentment builds when expectations aren't met", "Struggles to celebrate progress — always focused on what's still wrong"],
      id: ["Bisa terlalu kritis terhadap diri sendiri dan perfeksionis", "Mungkin menghakimi orang lain dengan keras berdasarkan standar internal mereka", "Rasa kesal menumpuk ketika harapan tidak terpenuhi", "Kesulitan merayakan kemajuan — selalu fokus pada apa yang masih salah"],
      nl: ["Kan overdreven zelfkritisch en perfectionistisch zijn", "Kan anderen hard beoordelen aan de hand van interne normen", "Wrok bouwt zich op als verwachtingen niet worden nagekomen", "Moeite om vooruitgang te vieren — altijd gefocust op wat nog niet goed is"],
    },
    communication: {
      en: "Be logical, calm, and ethical. Show respect for their standards. Don't ask them to cut corners. Acknowledge their effort and intentions before giving feedback — they are harder on themselves than you could ever be.",
      id: "Bersikaplah logis, tenang, dan etis. Tunjukkan rasa hormat terhadap standar mereka. Jangan minta mereka mengambil jalan pintas. Akui usaha dan niat mereka sebelum memberikan umpan balik — mereka lebih keras pada diri sendiri daripada yang bisa Anda lakukan.",
      nl: "Wees logisch, kalm en ethisch. Toon respect voor hun normen. Vraag hen niet om sluipwegen te nemen. Erken hun inspanning en intenties voordat u feedback geeft — ze zijn strenger voor zichzelf dan u ooit zou kunnen zijn.",
    },
    crossCultural: {
      en: "The Type 1's strong sense of right and wrong can create friction in high-context or relationally oriented cultures where truth is navigated, not declared. Growth edge: holding conviction with grace — learning to influence through relationship and humility, not just principle.",
      id: "Rasa benar dan salah yang kuat dari Tipe 1 dapat menciptakan gesekan dalam budaya berorientasi konteks tinggi atau relasional di mana kebenaran dinavigasi, bukan dinyatakan. Tepi pertumbuhan: memegang keyakinan dengan penuh kasih — belajar mempengaruhi melalui hubungan dan kerendahan hati, bukan hanya prinsip.",
      nl: "Het sterke gevoel van goed en kwaad van Type 1 kan wrijving veroorzaken in hoge-context- of relationeel georiënteerde culturen waar waarheid wordt onderhandeld, niet uitgesproken. Groeipunt: overtuiging met gratie vasthouden — leren om te beïnvloeden via relatie en nederigheid, niet alleen via principes.",
    },
    wing9: {
      en: "1w9 — The Idealist: More introverted and philosophical. Their convictions run deep but are held more quietly. They combine principle with patience and can seem detached from emotion.",
      id: "1w9 — Si Idealis: Lebih introver dan filosofis. Keyakinan mereka sangat mendalam tetapi dipegang lebih diam-diam. Mereka memadukan prinsip dengan kesabaran dan bisa tampak terlepas dari emosi.",
      nl: "1w9 — De Idealist: Meer introvert en filosofisch. Hun overtuigingen zijn diep maar worden stiller vastgehouden. Ze combineren principe met geduld en kunnen emotioneel afstandelijk lijken.",
    },
    wing2: {
      en: "1w2 — The Advocate: More outwardly oriented and people-focused. They apply their high standards in service of others, becoming teachers, advocates, and reformers with a warm edge.",
      id: "1w2 — Si Advokat: Lebih berorientasi keluar dan berfokus pada orang. Mereka menerapkan standar tinggi mereka dalam melayani orang lain, menjadi guru, advokat, dan reformator dengan sentuhan hangat.",
      nl: "1w2 — De Advocaat: Meer naar buiten gericht en mensgericht. Ze passen hun hoge normen toe in dienst van anderen en worden leraren, pleitbezorgers en hervormers met een warme kant.",
    },
  },
  {
    number: 2,
    name: { en: "The Helper", id: "Si Penolong", nl: "De Helper" },
    tagline: { en: "Generous. Warm. Relationally attentive.", id: "Murah hati. Hangat. Penuh perhatian dalam relasi.", nl: "Genereus. Warm. Relationeel opmerkzaam." },
    color: "oklch(52% 0.18 10)",
    colorLight: "oklch(65% 0.14 10)",
    colorVeryLight: "oklch(94% 0.04 10)",
    bg: "oklch(18% 0.14 10)",
    overview: {
      en: "The Type 2 leader leads through relationship. They are warm, empathetic, and genuinely invested in the people around them. They are often the emotional glue of a team — present, attentive, and generous with their time and energy. Their growth edge is learning to lead from their own needs and calling, not just in response to others'.",
      id: "Pemimpin Tipe 2 memimpin melalui hubungan. Mereka hangat, empatik, dan sungguh-sungguh peduli pada orang-orang di sekitar mereka. Mereka sering menjadi perekat emosional sebuah tim — hadir, penuh perhatian, dan murah hati dengan waktu dan energi mereka. Tepi pertumbuhan mereka adalah belajar memimpin dari kebutuhan dan panggilan mereka sendiri, bukan hanya sebagai respons terhadap orang lain.",
      nl: "De Type 2-leider leidt via relaties. Ze zijn warm, empathisch en oprecht geïnvesteerd in de mensen om hen heen. Ze zijn vaak de emotionele lijm van een team — aanwezig, attent en royaal met hun tijd en energie. Hun groeipunt is leren leiden vanuit hun eigen behoeften en roeping, niet alleen als reactie op die van anderen.",
    },
    motivation: {
      en: "To be loved, needed, and appreciated — to feel that their giving makes them indispensable.",
      id: "Untuk dicintai, dibutuhkan, dan dihargai — untuk merasakan bahwa pemberian mereka membuat mereka tak tergantikan.",
      nl: "Geliefd, nodig en gewaardeerd worden — het gevoel hebben dat hun geven hen onmisbaar maakt.",
    },
    fear: {
      en: "Being unwanted, unloved, or rejected — being seen as a burden rather than a gift.",
      id: "Tidak diinginkan, tidak dicintai, atau ditolak — dilihat sebagai beban daripada anugerah.",
      nl: "Ongewenst, onbemind of afgewezen worden — als een last worden gezien in plaats van als een geschenk.",
    },
    strengths: {
      en: ["Deep empathy and relational intelligence", "Serves others generously and joyfully", "Creates warmth and belonging in teams", "Builds loyalty through genuine care", "Natural encourager — people feel valued around them"],
      id: ["Empati yang dalam dan kecerdasan relasional", "Melayani orang lain dengan murah hati dan gembira", "Menciptakan kehangatan dan rasa memiliki dalam tim", "Membangun loyalitas melalui kepedulian yang tulus", "Pemberi semangat alami — orang-orang merasa dihargai di sekitar mereka"],
      nl: ["Diepe empathie en relationele intelligentie", "Dient anderen royaal en vreugdevol", "Creëert warmte en verbondenheid in teams", "Bouwt loyaliteit op door oprechte zorg", "Natuurlijke aanmoediger — mensen voelen zich gewaardeerd in hun nabijheid"],
    },
    blindspots: {
      en: ["Can neglect their own needs and then feel resentful", "Struggles with boundaries — saying no feels unloving", "Can become indirect or manipulative when feeling unappreciated", "Emotional health depends heavily on others' responses"],
      id: ["Bisa mengabaikan kebutuhan mereka sendiri dan kemudian merasa kesal", "Kesulitan dengan batas — mengatakan tidak terasa tidak penuh kasih", "Bisa menjadi tidak langsung atau manipulatif ketika merasa tidak dihargai", "Kesehatan emosional sangat bergantung pada respons orang lain"],
      nl: ["Kan eigen behoeften verwaarlozen en dan wrok voelen", "Moeite met grenzen — nee zeggen voelt liefdeloos", "Kan indirect of manipulatief worden als ze zich niet gewaardeerd voelen", "Emotionele gezondheid hangt sterk af van de reacties van anderen"],
    },
    communication: {
      en: "Be warm, personal, and appreciative. Acknowledge the person before the task. Express genuine gratitude — it fuels them. Avoid being cold or transactional — they read relational temperature in everything.",
      id: "Bersikaplah hangat, personal, dan penuh apresiasi. Akui orangnya sebelum tugasnya. Ungkapkan rasa terima kasih yang tulus — itu memberi mereka energi. Hindari bersikap dingin atau transaksional — mereka membaca suhu relasional dalam segala hal.",
      nl: "Wees warm, persoonlijk en waarderend. Erken de persoon vóór de taak. Druk echte dankbaarheid uit — dat geeft hen energie. Vermijd koud of transactioneel zijn — ze lezen relationele temperatuur in alles.",
    },
    crossCultural: {
      en: "The Type 2's warmth is a gift in relational cultures. In task-focused or emotionally reserved contexts, learning to deliver results without over-personalising is key. Across cultures, the form of care varies — be careful not to impose your version of love on others.",
      id: "Kehangatan Tipe 2 adalah anugerah dalam budaya relasional. Dalam konteks yang berfokus pada tugas atau emosional yang tertahan, kunci utamanya adalah belajar memberikan hasil tanpa terlalu mempersonalisasi. Di berbagai budaya, bentuk kepedulian berbeda-beda — berhati-hatilah untuk tidak memaksakan versi cinta Anda kepada orang lain.",
      nl: "De warmte van Type 2 is een geschenk in relationele culturen. In taakgerichte of emotioneel gereserveerde contexten is het belangrijk te leren resultaten te leveren zonder te veel te personaliseren. In verschillende culturen varieert de vorm van zorg — wees voorzichtig met het opleggen van uw versie van liefde aan anderen.",
    },
    wing1: {
      en: "2w1 — The Servant: More principled and self-demanding. They combine generous giving with a strong moral framework. Their service has a mission quality — they give because it is the right thing to do.",
      id: "2w1 — Si Pelayan: Lebih berprinsip dan menuntut diri sendiri. Mereka memadukan kemurahan hati dengan kerangka moral yang kuat. Pelayanan mereka memiliki kualitas misi — mereka memberi karena itu adalah hal yang benar untuk dilakukan.",
      nl: "2w1 — De Dienaar: Principiëler en veeleisender voor zichzelf. Ze combineren vrijgevig geven met een sterk moreel kader. Hun dienst heeft een missiekwaliteit — ze geven omdat het de juiste zaak is.",
    },
    wing3: {
      en: "2w3 — The Host: More image-conscious and outgoing. They love to be seen as helpful and connect helping with their public identity. Warmth meets ambition in how they serve.",
      id: "2w3 — Si Tuan Rumah: Lebih sadar citra dan ramah. Mereka suka dipandang sebagai orang yang membantu dan menghubungkan bantuan dengan identitas publik mereka. Kehangatan bertemu ambisi dalam cara mereka melayani.",
      nl: "2w3 — De Gastheer/-vrouw: Meer bewust van imago en extravert. Ze houden ervan als helpend gezien te worden en verbinden helpen met hun publieke identiteit. Warmte ontmoet ambitie in hoe ze dienen.",
    },
  },
  {
    number: 3,
    name: { en: "The Achiever", id: "Si Berprestasi", nl: "De Presteerder" },
    tagline: { en: "Driven. Adaptable. Naturally effective.", id: "Bersemangat. Adaptif. Efektif secara alami.", nl: "Gedreven. Aanpasbaar. Van nature effectief." },
    color: "oklch(55% 0.18 65)",
    colorLight: "oklch(68% 0.14 65)",
    colorVeryLight: "oklch(94% 0.04 65)",
    bg: "oklch(18% 0.12 65)",
    overview: {
      en: "The Type 3 leader is a high performer who adapts, executes, and delivers. They are natural motivators who lead by example, setting the pace through visible achievement. They bring energy and efficiency to every team they join. Their growth edge is learning that who they are matters more than what they accomplish.",
      id: "Pemimpin Tipe 3 adalah pemain tinggi yang beradaptasi, mengeksekusi, dan memberikan hasil. Mereka adalah motivator alami yang memimpin dengan teladan, menetapkan ritme melalui pencapaian yang terlihat. Mereka membawa energi dan efisiensi ke setiap tim yang mereka bergabungi. Tepi pertumbuhan mereka adalah belajar bahwa siapa mereka lebih penting daripada apa yang mereka capai.",
      nl: "De Type 3-leider is een topperformer die zich aanpast, uitvoert en levert. Ze zijn natuurlijke motivators die het voorbeeld geven en het tempo bepalen via zichtbare prestaties. Ze brengen energie en efficiëntie mee naar elk team. Hun groeipunt is leren dat wie ze zijn, meer telt dan wat ze bereiken.",
    },
    motivation: {
      en: "To be valuable and admired — to be recognized for their accomplishments and seen as outstanding.",
      id: "Menjadi berharga dan dikagumi — diakui atas pencapaian mereka dan dianggap luar biasa.",
      nl: "Waardevol en bewonderd worden — erkend worden voor hun prestaties en als uitstekend worden gezien.",
    },
    fear: {
      en: "Being worthless or failing publicly — being exposed as a fraud beneath the achievements.",
      id: "Menjadi tidak berharga atau gagal di depan umum — terekspos sebagai penipu di balik pencapaian.",
      nl: "Waardeloos zijn of publiekelijk falen — als bedrieger ontmaskerd worden achter de prestaties.",
    },
    strengths: {
      en: ["Highly effective and results-driven", "Adapts naturally to different contexts and audiences", "Motivates others through visible achievement", "Energetic and focused under pressure", "Communicates vision and goals with clarity and persuasion"],
      id: ["Sangat efektif dan berorientasi pada hasil", "Beradaptasi secara alami dengan konteks dan audiens yang berbeda", "Memotivasi orang lain melalui pencapaian yang terlihat", "Energetik dan fokus di bawah tekanan", "Mengkomunikasikan visi dan tujuan dengan jelas dan persuasif"],
      nl: ["Zeer effectief en resultaatgericht", "Past zich van nature aan aan verschillende contexten en publieken", "Motiveert anderen door zichtbare prestaties", "Energiek en gefocust onder druk", "Communiceert visie en doelen met helderheid en overtuigingskracht"],
    },
    blindspots: {
      en: ["Can prioritize image over authenticity", "May lose touch with genuine emotions in pursuit of goals", "Can push people too hard to perform", "Struggles to slow down and simply 'be' without an agenda"],
      id: ["Bisa memprioritaskan citra daripada keaslian", "Bisa kehilangan kontak dengan emosi sejati dalam mengejar tujuan", "Bisa mendorong orang terlalu keras untuk berprestasi", "Kesulitan untuk melambat dan sekadar 'ada' tanpa agenda"],
      nl: ["Kan imago boven authenticiteit stellen", "Kan het contact met echte emoties verliezen in de achtervolging van doelen", "Kan mensen te hard pushen om te presteren", "Moeite om te vertragen en gewoon te 'zijn' zonder agenda"],
    },
    communication: {
      en: "Be efficient and outcome-focused. Show them the path to success. Acknowledge their achievements specifically. Avoid making them feel like they're underperforming — they take it to heart.",
      id: "Bersikaplah efisien dan fokus pada hasil. Tunjukkan jalur menuju kesuksesan. Akui pencapaian mereka secara spesifik. Hindari membuat mereka merasa berkinerja buruk — mereka sangat merasakannya.",
      nl: "Wees efficiënt en resultaatgericht. Laat hen het pad naar succes zien. Erken hun prestaties specifiek. Vermijd dat ze het gevoel krijgen dat ze ondermaats presteren — ze nemen het ter harte.",
    },
    crossCultural: {
      en: "The Type 3's drive and efficiency is valued in performance-oriented cultures. In relational or shame-based cultures, the pressure to appear successful can amplify unhealthy patterns. Growth edge: prioritizing authentic relationships over impressive outcomes — being known, not just admired.",
      id: "Dorongan dan efisiensi Tipe 3 dihargai dalam budaya berorientasi kinerja. Dalam budaya relasional atau berbasis malu, tekanan untuk tampak sukses dapat memperkuat pola yang tidak sehat. Tepi pertumbuhan: memprioritaskan hubungan yang autentik daripada hasil yang mengesankan — dikenal, bukan hanya dikagumi.",
      nl: "De drive en efficiëntie van Type 3 worden gewaardeerd in prestatiegericht culturen. In relationele of schaamteculturen kan de druk om succesvol te lijken ongezonde patronen versterken. Groeipunt: authentieke relaties boven indrukwekkende resultaten stellen — gekend worden, niet alleen bewonderd.",
    },
    wing2: {
      en: "3w2 — The Charmer: More people-focused and relational. They achieve through connection, combining effectiveness with genuine warmth. Success means winning people as much as results.",
      id: "3w2 — Si Pemikat: Lebih berfokus pada orang dan relasional. Mereka berprestasi melalui koneksi, memadukan efektivitas dengan kehangatan yang tulus. Sukses berarti memenangkan hati orang sebanyak hasilnya.",
      nl: "3w2 — De Charmeur: Meer mensgericht en relationeel. Ze bereiken door verbinding, waarbij ze effectiviteit combineren met echte warmte. Succes betekent mensen winnen evenveel als resultaten.",
    },
    wing4: {
      en: "3w4 — The Professional: More introspective and concerned with depth. They want to achieve something meaningful, not just impressive. Combines ambition with the desire to express something true.",
      id: "3w4 — Si Profesional: Lebih introspektif dan peduli dengan kedalaman. Mereka ingin mencapai sesuatu yang bermakna, bukan hanya mengesankan. Memadukan ambisi dengan keinginan untuk mengekspresikan sesuatu yang nyata.",
      nl: "3w4 — De Professional: Meer introspectief en bezorgd om diepgang. Ze willen iets betekenisvols bereiken, niet alleen iets indrukwekkends. Combineert ambitie met de wens iets waars uit te drukken.",
    },
  },
  {
    number: 4,
    name: { en: "The Individualist", id: "Si Individualis", nl: "De Individualist" },
    tagline: { en: "Expressive. Authentic. Emotionally deep.", id: "Ekspresif. Autentik. Penuh kedalaman emosi.", nl: "Expressief. Authentiek. Emotioneel diep." },
    color: "oklch(48% 0.22 295)",
    colorLight: "oklch(62% 0.17 295)",
    colorVeryLight: "oklch(94% 0.04 295)",
    bg: "oklch(16% 0.18 295)",
    overview: {
      en: "The Type 4 leader brings depth, creativity, and emotional intelligence to everything they do. They long to be truly known and to express something genuine. They are drawn to meaning, beauty, and authenticity — and they help teams access the deeper 'why' behind the work. Their growth edge is finding identity in what they share with others, not just what makes them different.",
      id: "Pemimpin Tipe 4 membawa kedalaman, kreativitas, dan kecerdasan emosional dalam segala hal yang mereka lakukan. Mereka merindukan untuk benar-benar dikenal dan mengekspresikan sesuatu yang tulus. Mereka tertarik pada makna, keindahan, dan keaslian — dan mereka membantu tim mengakses 'mengapa' yang lebih dalam di balik pekerjaan. Tepi pertumbuhan mereka adalah menemukan identitas dalam apa yang mereka bagikan dengan orang lain, bukan hanya apa yang membuat mereka berbeda.",
      nl: "De Type 4-leider brengt diepgang, creativiteit en emotionele intelligentie in alles wat ze doen. Ze verlangen ernaar werkelijk gekend te worden en iets echts uit te drukken. Ze worden aangetrokken door betekenis, schoonheid en authenticiteit — en helpen teams het diepere 'waarom' achter het werk te bereiken. Hun groeipunt is identiteit vinden in wat ze delen met anderen, niet alleen in wat hen onderscheidt.",
    },
    motivation: {
      en: "To find and express their unique identity — to be truly seen and understood for who they are at the deepest level.",
      id: "Menemukan dan mengekspresikan identitas unik mereka — untuk benar-benar dilihat dan dipahami untuk siapa mereka pada tingkat paling dalam.",
      nl: "Hun unieke identiteit vinden en uitdrukken — werkelijk gezien en begrepen worden voor wie ze zijn op het diepste niveau.",
    },
    fear: {
      en: "Having no identity or personal significance — being ordinary, flawed, or fundamentally deficient.",
      id: "Tidak memiliki identitas atau signifikansi pribadi — menjadi biasa, cacat, atau secara mendasar kurang.",
      nl: "Geen identiteit of persoonlijke betekenis hebben — gewoon, gebrekkig of fundamenteel tekortschietend zijn.",
    },
    strengths: {
      en: ["Deep empathy and emotional intelligence", "Brings authenticity and meaning to their work", "Creative and original thinker", "Helps teams explore the deeper 'why'", "Connects at a soul level with people who are hurting"],
      id: ["Empati yang dalam dan kecerdasan emosional", "Membawa keaslian dan makna pada pekerjaan mereka", "Pemikir yang kreatif dan orisinal", "Membantu tim mengeksplorasi 'mengapa' yang lebih dalam", "Terhubung pada level jiwa dengan orang-orang yang sedang terluka"],
      nl: ["Diepe empathie en emotionele intelligentie", "Brengt authenticiteit en betekenis in hun werk", "Creatief en origineel denker", "Helpt teams het diepere 'waarom' te verkennen", "Verbindt op zielsniveau met mensen die pijn lijden"],
    },
    blindspots: {
      en: ["Can become absorbed in their own emotional landscape", "May envy others who seem to have what they lack", "Can withdraw or become dramatic when misunderstood", "Mood fluctuations affect team consistency"],
      id: ["Bisa tenggelam dalam lanskap emosional mereka sendiri", "Mungkin iri pada orang lain yang tampaknya memiliki apa yang mereka kurangi", "Bisa menarik diri atau menjadi dramatis ketika disalahpahami", "Fluktuasi suasana hati memengaruhi konsistensi tim"],
      nl: ["Kan opgaan in hun eigen emotionele landschap", "Kan jaloers worden op anderen die lijken te hebben wat ze missen", "Kan zich terugtrekken of dramatisch worden als ze verkeerd begrepen worden", "Stemmingswisselingen beïnvloeden teamconsistentie"],
    },
    communication: {
      en: "Acknowledge their uniqueness and depth. Don't rush them to 'get over it' emotionally. Create space for genuine expression. They respond to authenticity — don't be performative or shallow around them.",
      id: "Akui keunikan dan kedalaman mereka. Jangan terburu-buru menyuruh mereka untuk 'melewatinya' secara emosional. Ciptakan ruang untuk ekspresi yang tulus. Mereka merespons keaslian — jangan berpura-pura atau dangkal di sekitar mereka.",
      nl: "Erken hun uniciteit en diepgang. Haast hen niet om 'erover heen te komen' emotioneel. Creëer ruimte voor echte expressie. Ze reageren op authenticiteit — wees niet schijnheilig of oppervlakkig in hun aanwezigheid.",
    },
    crossCultural: {
      en: "The Type 4's focus on individual uniqueness can clash with collectivist cultures where the group is primary. Growth edge: learning to find meaning through community and shared identity — discovering that 'we' can be just as deep as 'I'.",
      id: "Fokus Tipe 4 pada keunikan individu bisa bertentangan dengan budaya kolektivis di mana kelompok adalah yang utama. Tepi pertumbuhan: belajar menemukan makna melalui komunitas dan identitas bersama — menemukan bahwa 'kita' bisa sama dalamnya dengan 'saya'.",
      nl: "De focus van Type 4 op individuele uniciteit kan botsen met collectivistische culturen waar de groep centraal staat. Groeipunt: leren betekenis te vinden via gemeenschap en gedeelde identiteit — ontdekken dat 'wij' even diep kan zijn als 'ik'.",
    },
    wing3: {
      en: "4w3 — The Aristocrat: More driven and image-aware. Combines depth with ambition. Wants their uniqueness to be not just felt but seen and recognised. Often highly creative and publicly expressive.",
      id: "4w3 — Si Aristokrat: Lebih bersemangat dan sadar citra. Memadukan kedalaman dengan ambisi. Ingin keunikan mereka tidak hanya dirasakan tetapi juga dilihat dan diakui. Sering sangat kreatif dan ekspresif secara publik.",
      nl: "4w3 — De Aristocraat: Gedrevener en meer beeldgericht. Combineert diepgang met ambitie. Wil dat hun uniciteit niet alleen gevoeld maar ook gezien en erkend wordt. Vaak zeer creatief en publiek expressief.",
    },
    wing5: {
      en: "4w5 — The Bohemian: More withdrawn and intellectual. Combines emotional depth with a need to understand. Often produces rich, complex creative work in private before sharing it.",
      id: "4w5 — Si Bohemian: Lebih menarik diri dan intelektual. Memadukan kedalaman emosional dengan kebutuhan untuk memahami. Sering menghasilkan karya kreatif yang kaya dan kompleks secara pribadi sebelum membagikannya.",
      nl: "4w5 — De Bohemien: Meer teruggetrokken en intellectueel. Combineert emotionele diepgang met een behoefte aan begrip. Produceert vaak rijk, complex creatief werk in privé voordat het gedeeld wordt.",
    },
  },
  {
    number: 5,
    name: { en: "The Investigator", id: "Si Investigator", nl: "De Onderzoeker" },
    tagline: { en: "Analytical. Perceptive. Expert.", id: "Analitis. Jeli. Ahli.", nl: "Analytisch. Opmerkzaam. Expert." },
    color: "oklch(50% 0.16 195)",
    colorLight: "oklch(64% 0.12 195)",
    colorVeryLight: "oklch(94% 0.03 195)",
    bg: "oklch(18% 0.12 195)",
    overview: {
      en: "The Type 5 leader is a thinker. They build deep expertise, observe before acting, and bring careful, well-researched thinking to every decision. They are often the most prepared person in the room — and they lead best when they can operate from a position of knowledge and autonomy. Their growth edge is learning to engage fully in life rather than observing from a distance.",
      id: "Pemimpin Tipe 5 adalah pemikir. Mereka membangun keahlian yang mendalam, mengamati sebelum bertindak, dan membawa pemikiran yang hati-hati dan teriteliti ke setiap keputusan. Mereka sering menjadi orang yang paling siap di ruangan — dan mereka memimpin paling baik ketika mereka dapat beroperasi dari posisi pengetahuan dan otonomi. Tepi pertumbuhan mereka adalah belajar untuk terlibat sepenuhnya dalam kehidupan daripada mengamati dari kejauhan.",
      nl: "De Type 5-leider is een denker. Ze bouwen diepe expertise op, observeren voordat ze handelen en brengen zorgvuldig, goed onderbouwd denken naar elke beslissing. Ze zijn vaak de meest voorbereide persoon in de kamer — en ze leiden het best als ze kunnen opereren vanuit een positie van kennis en autonomie. Hun groeipunt is leren volledig deel te nemen aan het leven in plaats van van een afstand te observeren.",
    },
    motivation: {
      en: "To be competent and knowledgeable — to understand the world deeply and function independently.",
      id: "Menjadi kompeten dan berpengetahuan — untuk memahami dunia secara mendalam dan berfungsi secara mandiri.",
      nl: "Competent en deskundig zijn — de wereld diepgaand begrijpen en onafhankelijk functioneren.",
    },
    fear: {
      en: "Being incompetent, helpless, or overwhelmed by the demands and intrusions of others.",
      id: "Menjadi tidak kompeten, tidak berdaya, atau kewalahan oleh tuntutan dan gangguan orang lain.",
      nl: "Incompetent, hulpeloos of overweldigd worden door de eisen en inbreuken van anderen.",
    },
    strengths: {
      en: ["Deep expertise and rigorous analytical thinking", "Objective and carefully considered perspective", "Thorough preparation and research", "Calm under pressure — not reactive or impulsive", "Holds complexity without panic or shortcuts"],
      id: ["Keahlian mendalam dan pemikiran analitis yang ketat", "Perspektif yang objektif dan dipertimbangkan dengan hati-hati", "Persiapan dan penelitian yang menyeluruh", "Tenang di bawah tekanan — tidak reaktif atau impulsif", "Memegang kompleksitas tanpa panik atau jalan pintas"],
      nl: ["Diepe expertise en rigoureus analytisch denken", "Objectief en zorgvuldig overwogen perspectief", "Grondige voorbereiding en onderzoek", "Kalm onder druk — niet reactief of impulsief", "Houdt complexiteit vast zonder paniek of shortcuts"],
    },
    blindspots: {
      en: ["Can withdraw and become isolated from the team", "May hoard knowledge rather than sharing it generously", "Emotional vulnerability feels threatening — can seem cold", "Analysis paralysis can slow decisions past the point of usefulness"],
      id: ["Bisa menarik diri dan menjadi terisolasi dari tim", "Mungkin menimbun pengetahuan daripada berbagi secara murah hati", "Kerentanan emosional terasa mengancam — bisa tampak dingin", "Kelumpuhan analisis dapat memperlambat keputusan melampaui titik kegunaan"],
      nl: ["Kan zich terugtrekken en geïsoleerd raken van het team", "Kan kennis hamsteren in plaats van het royaal te delen", "Emotionele kwetsbaarheid voelt bedreigend — kan koud lijken", "Analyseverlamming kan beslissingen vertragen voorbij het punt van bruikbaarheid"],
    },
    communication: {
      en: "Give them space to think. Don't demand immediate answers. Bring data, not just feelings. Respect their boundaries around time and energy — they are not being cold; they are being careful.",
      id: "Beri mereka ruang untuk berpikir. Jangan menuntut jawaban segera. Bawa data, bukan hanya perasaan. Hormati batasan mereka seputar waktu dan energi — mereka tidak sedang dingin; mereka sedang berhati-hati.",
      nl: "Geef hen ruimte om na te denken. Eis geen onmiddellijke antwoorden. Breng data, niet alleen gevoelens. Respecteer hun grenzen rond tijd en energie — ze zijn niet koud; ze zijn zorgvuldig.",
    },
    crossCultural: {
      en: "The Type 5's preference for privacy and expertise-based authority can feel distant in highly relational cultures. Growth edge: learning to build trust through relationship, not just competence — and to engage emotionally even when it feels uncomfortable.",
      id: "Preferensi Tipe 5 untuk privasi dan otoritas berbasis keahlian bisa terasa jauh dalam budaya yang sangat relasional. Tepi pertumbuhan: belajar membangun kepercayaan melalui hubungan, bukan hanya kompetensi — dan terlibat secara emosional bahkan ketika terasa tidak nyaman.",
      nl: "De voorkeur van Type 5 voor privacy en op expertise gebaseerde autoriteit kan in sterk relationele culturen afstandelijk aanvoelen. Groeipunt: leren vertrouwen op te bouwen via relaties, niet alleen via competentie — en emotioneel betrokken te zijn zelfs als het ongemakkelijk voelt.",
    },
    wing4: {
      en: "5w4 — The Iconoclast: More emotionally expressive and creative. Combines analytical depth with aesthetic sensibility. Often produces visionary, original thinking that challenges convention.",
      id: "5w4 — Si Ikonoklas: Lebih ekspresif secara emosional dan kreatif. Memadukan kedalaman analitis dengan kepekaan estetis. Sering menghasilkan pemikiran visioner dan orisinal yang menantang konvensi.",
      nl: "5w4 — De Iconoclast: Emotioneel expressiever en creatiever. Combineert analytische diepgang met esthetisch gevoel. Produceert vaak visionair, origineel denken dat conventies uitdaagt.",
    },
    wing6: {
      en: "5w6 — The Problem Solver: More practically oriented and loyal. Combines deep expertise with a focus on reliability and problem-solving within trusted structures.",
      id: "5w6 — Si Pemecah Masalah: Lebih berorientasi praktis dan setia. Memadukan keahlian mendalam dengan fokus pada keandalan dan pemecahan masalah dalam struktur yang dipercaya.",
      nl: "5w6 — De Probleemoplosser: Meer praktisch gericht en loyaal. Combineert diepe expertise met een focus op betrouwbaarheid en probleemoplossing binnen vertrouwde structuren.",
    },
  },
  {
    number: 6,
    name: { en: "The Loyalist", id: "Si Setia", nl: "De Loyalist" },
    tagline: { en: "Loyal. Responsible. Trustworthy.", id: "Setia. Bertanggung jawab. Dapat dipercaya.", nl: "Loyaal. Verantwoordelijk. Betrouwbaar." },
    color: "oklch(48% 0.18 240)",
    colorLight: "oklch(62% 0.13 240)",
    colorVeryLight: "oklch(94% 0.03 240)",
    bg: "oklch(17% 0.15 240)",
    overview: {
      en: "The Type 6 leader is committed, responsible, and deeply loyal to the people and causes they believe in. They are excellent at identifying risks, testing systems, and building the trust that sustains long-term teams. Their growth edge is learning to trust themselves and act despite uncertainty — moving from anxiety to courageous faithfulness.",
      id: "Pemimpin Tipe 6 berkomitmen, bertanggung jawab, dan sangat setia pada orang-orang dan tujuan yang mereka yakini. Mereka sangat baik dalam mengidentifikasi risiko, menguji sistem, dan membangun kepercayaan yang menopang tim jangka panjang. Tepi pertumbuhan mereka adalah belajar mempercayai diri sendiri dan bertindak meskipun ada ketidakpastian — bergerak dari kecemasan menuju kesetiaan yang berani.",
      nl: "De Type 6-leider is toegewijd, verantwoordelijk en diep loyaal aan de mensen en zaken waarin hij gelooft. Ze zijn uitstekend in het identificeren van risico's, het testen van systemen en het opbouwen van het vertrouwen dat langdurige teams in stand houdt. Hun groeipunt is leren zichzelf te vertrouwen en te handelen ondanks onzekerheid — van angst naar moedige trouw.",
    },
    motivation: {
      en: "To have security, support, and certainty — to feel that they and the people they care for are safe.",
      id: "Memiliki keamanan, dukungan, dan kepastian — untuk merasakan bahwa mereka dan orang-orang yang mereka pedulikan aman.",
      nl: "Veiligheid, steun en zekerheid hebben — het gevoel hebben dat zij en de mensen voor wie ze zorgen veilig zijn.",
    },
    fear: {
      en: "Being abandoned, without support, or facing danger without allies — being left alone when it counts.",
      id: "Ditinggalkan, tanpa dukungan, atau menghadapi bahaya tanpa sekutu — dibiarkan sendirian ketika itu penting.",
      nl: "Verlaten worden, zonder steun, of gevaar trotseren zonder bondgenoten — alleen gelaten worden als het er echt op aankomt.",
    },
    strengths: {
      en: ["Deeply loyal and consistently trustworthy", "Excellent at anticipating risks and potential problems", "Builds trust through consistency and follow-through", "Committed to the team's wellbeing", "Courageous when it counts — fear activates rather than paralyses them"],
      id: ["Sangat setia dan selalu dapat dipercaya", "Sangat baik dalam mengantisipasi risiko dan masalah potensial", "Membangun kepercayaan melalui konsistensi dan tindak lanjut", "Berkomitmen pada kesejahteraan tim", "Berani ketika dibutuhkan — ketakutan mengaktifkan daripada melumpuhkan mereka"],
      nl: ["Diep loyaal en consequent betrouwbaar", "Uitstekend in het anticiperen op risico's en mogelijke problemen", "Bouwt vertrouwen op door consistentie en opvolging", "Toegewijd aan het welzijn van het team", "Moedig als het erop aankomt — angst activeert in plaats van verlaamt"],
    },
    blindspots: {
      en: ["Chronic anxiety can create self-doubt and overthinking", "May test others' loyalty unnecessarily", "Ambivalent toward authority — can be too compliant or too resistant", "Worst-case thinking can block positive risk-taking"],
      id: ["Kecemasan kronis dapat menciptakan keraguan diri dan terlalu banyak berpikir", "Mungkin menguji loyalitas orang lain tanpa perlu", "Ambivalen terhadap otoritas — bisa terlalu patuh atau terlalu menentang", "Pemikiran skenario terburuk dapat menghalangi pengambilan risiko yang positif"],
      nl: ["Chronische angst kan zelftwijfel en over-nadenken veroorzaken", "Kan andermans loyaliteit onnodig testen", "Ambivalent tegenover autoriteit — kan te volgzaam of te weerbaar zijn", "Worst-case-denken kan positieve risiconame blokkeren"],
    },
    communication: {
      en: "Be consistent, transparent, and reliable. Reassure them with substance — not just words. Explain your reasoning. Sudden changes without explanation shake them deeply. Follow through on what you say you will do.",
      id: "Bersikaplah konsisten, transparan, dan dapat diandalkan. Yakinkan mereka dengan substansi — bukan hanya kata-kata. Jelaskan penalaran Anda. Perubahan mendadak tanpa penjelasan sangat mengguncang mereka. Ikuti apa yang Anda katakan akan Anda lakukan.",
      nl: "Wees consistent, transparant en betrouwbaar. Stel hen gerust met inhoud — niet alleen woorden. Leg uw redenering uit. Plotselinge veranderingen zonder uitleg raken hen diep. Kom na wat u zegt te zullen doen.",
    },
    crossCultural: {
      en: "The Type 6's focus on trust-building is universally valuable. In high-power-distance cultures, their ambivalence toward authority can cause confusion. Growth edge: distinguishing healthy accountability from anxious compliance or unnecessary rebellion.",
      id: "Fokus Tipe 6 pada membangun kepercayaan sangat berharga secara universal. Dalam budaya jarak kekuasaan tinggi, ambivalensi mereka terhadap otoritas bisa menyebabkan kebingungan. Tepi pertumbuhan: membedakan akuntabilitas yang sehat dari kepatuhan yang cemas atau pemberontakan yang tidak perlu.",
      nl: "De focus van Type 6 op vertrouwen opbouwen is universeel waardevol. In hoge-machtafstand-culturen kan hun ambivalentie tegenover autoriteit verwarring veroorzaken. Groeipunt: gezonde verantwoordelijkheid onderscheiden van angstige gehoorzaamheid of onnodige opstandigheid.",
    },
    wing5: {
      en: "6w5 — The Defender: More introverted and analytical. Combines loyalty with independent thinking. Tends to test authority through careful analysis rather than emotional reaction.",
      id: "6w5 — Si Pembela: Lebih introver dan analitis. Memadukan loyalitas dengan pemikiran mandiri. Cenderung menguji otoritas melalui analisis yang cermat daripada reaksi emosional.",
      nl: "6w5 — De Verdediger: Meer introvert en analytisch. Combineert loyaliteit met onafhankelijk denken. Heeft de neiging autoriteit te testen via zorgvuldige analyse in plaats van emotionele reactie.",
    },
    wing7: {
      en: "6w7 — The Buddy: More outgoing and playful. Combines loyalty with warmth and humour. Their anxiety takes a lighter edge — they manage uncertainty through connection and optimism.",
      id: "6w7 — Si Sahabat: Lebih ramah dan bersifat ceria. Memadukan loyalitas dengan kehangatan dan humor. Kecemasan mereka memiliki tepi yang lebih ringan — mereka mengelola ketidakpastian melalui koneksi dan optimisme.",
      nl: "6w7 — De Vriend: Meer extravert en speels. Combineert loyaliteit met warmte en humor. Hun angst heeft een lichtere kant — ze beheren onzekerheid via verbinding en optimisme.",
    },
  },
  {
    number: 7,
    name: { en: "The Enthusiast", id: "Si Antusias", nl: "De Enthousiast" },
    tagline: { en: "Visionary. Energetic. Possibility-focused.", id: "Visioner. Energetik. Berfokus pada kemungkinan.", nl: "Visionair. Energiek. Gericht op mogelijkheden." },
    color: "oklch(60% 0.18 30)",
    colorLight: "oklch(72% 0.14 30)",
    colorVeryLight: "oklch(94% 0.04 30)",
    bg: "oklch(18% 0.12 30)",
    overview: {
      en: "The Type 7 leader brings energy, ideas, and irresistible forward momentum. They see possibility where others see problems and inspire teams to believe that things can be different. Their gift is keeping teams moving with joy and vision — their growth edge is learning to stay present when things are hard, rather than seeking the next new thing.",
      id: "Pemimpin Tipe 7 membawa energi, ide, dan momentum maju yang tak tertahankan. Mereka melihat kemungkinan di mana orang lain melihat masalah dan menginspirasi tim untuk percaya bahwa sesuatu bisa berbeda. Hadiah mereka adalah menjaga tim terus bergerak dengan sukacita dan visi — tepi pertumbuhan mereka adalah belajar untuk tetap hadir ketika segala sesuatu menjadi sulit, daripada mencari hal baru berikutnya.",
      nl: "De Type 7-leider brengt energie, ideeën en onweerstaanbare voorwaartse beweging. Ze zien mogelijkheden waar anderen problemen zien en inspireren teams om te geloven dat dingen anders kunnen. Hun gave is teams met vreugde en visie in beweging te houden — hun groeipunt is leren aanwezig te blijven als het moeilijk wordt, in plaats van het volgende nieuwe ding te zoeken.",
    },
    motivation: {
      en: "To be happy, stimulated, and free — to experience everything life has to offer without being trapped in pain.",
      id: "Menjadi bahagia, terstimulasi, dan bebas — untuk mengalami semua yang ditawarkan kehidupan tanpa terjebak dalam rasa sakit.",
      nl: "Gelukkig, gestimuleerd en vrij zijn — alles wat het leven te bieden heeft ervaren zonder gevangen te zitten in pijn.",
    },
    fear: {
      en: "Being deprived, trapped, or stuck in pain and limitation — missing out on what life could be.",
      id: "Kekurangan, terjebak, atau terjebak dalam rasa sakit dan keterbatasan — melewatkan apa yang bisa ditawarkan kehidupan.",
      nl: "Tekortgedaan worden, gevangen zitten of vastzitten in pijn en beperkingen — iets mislopen van wat het leven zou kunnen zijn.",
    },
    strengths: {
      en: ["Visionary and generative with ideas", "Creates energy and enthusiasm in teams", "Connects disparate ideas creatively", "Resilient — bounces back quickly from setbacks", "Makes the future feel exciting and achievable"],
      id: ["Visioner dan generatif dengan ide-ide", "Menciptakan energi dan antusiasme dalam tim", "Menghubungkan ide-ide yang berbeda secara kreatif", "Tangguh — bangkit kembali dengan cepat dari kemunduran", "Membuat masa depan terasa menarik dan dapat dicapai"],
      nl: ["Visionair en generatief met ideeën", "Creëert energie en enthousiasme in teams", "Verbindt uiteenlopende ideeën creatief", "Veerkrachtig — herstelt snel van tegenslagen", "Maakt de toekomst opwindend en haalbaar"],
    },
    blindspots: {
      en: ["Can start things without finishing them", "Uses optimism and new experiences to avoid depth and difficulty", "May over-commit and under-deliver", "Struggles to be fully present in pain or loss"],
      id: ["Bisa memulai sesuatu tanpa menyelesaikannya", "Menggunakan optimisme dan pengalaman baru untuk menghindari kedalaman dan kesulitan", "Mungkin terlalu berkomitmen dan kurang memberikan hasil", "Kesulitan untuk hadir sepenuhnya dalam rasa sakit atau kehilangan"],
      nl: ["Kan dingen beginnen zonder ze af te maken", "Gebruikt optimisme en nieuwe ervaringen om diepgang en moeilijkheden te vermijden", "Kan te veel beloven en te weinig leveren", "Moeite om volledig aanwezig te zijn in pijn of verlies"],
    },
    communication: {
      en: "Engage with their vision and enthusiasm first. Be positive and forward-focused. Keep it dynamic and interactive. They lose energy quickly in heavy, over-structured, or deeply analytical environments.",
      id: "Libatkan diri dengan visi dan antusiasme mereka terlebih dahulu. Bersikaplah positif dan berorientasi ke depan. Jaga agar tetap dinamis dan interaktif. Mereka kehilangan energi dengan cepat dalam lingkungan yang berat, terlalu terstruktur, atau sangat analitis.",
      nl: "Ga eerst in op hun visie en enthousiasme. Wees positief en toekomstgericht. Houd het dynamisch en interactief. Ze verliezen snel energie in zware, overgestructureerde of diep analytische omgevingen.",
    },
    crossCultural: {
      en: "The Type 7's optimism and energy is a genuine gift across cultures. In contexts where suffering and lament are processed communally, their drive to stay positive can feel dismissive. Growth edge: learning to be fully present in pain — without immediately trying to fix it or escape it.",
      id: "Optimisme dan energi Tipe 7 adalah anugerah nyata di berbagai budaya. Dalam konteks di mana penderitaan dan ratapan diproses secara komunal, dorongan mereka untuk tetap positif bisa terasa meremehkan. Tepi pertumbuhan: belajar untuk hadir sepenuhnya dalam rasa sakit — tanpa segera mencoba memperbaikinya atau melarikan diri darinya.",
      nl: "Het optimisme en de energie van Type 7 is een echt geschenk in alle culturen. In contexten waar lijden en rouw communaal worden verwerkt, kan hun drang positief te blijven afwijzend aanvoelen. Groeipunt: leren volledig aanwezig te zijn in pijn — zonder onmiddellijk te proberen het op te lossen of te ontvluchten.",
    },
    wing6: {
      en: "7w6 — The Entertainer: More loyal and relational. Combines enthusiasm with a commitment to community. Their energy is channelled through relationships — fun, warm, and grounding.",
      id: "7w6 — Si Penghibur: Lebih setia dan relasional. Memadukan antusiasme dengan komitmen pada komunitas. Energi mereka disalurkan melalui hubungan — menyenangkan, hangat, dan membumi.",
      nl: "7w6 — De Entertainer: Loyaler en relationeler. Combineert enthousiasme met een toewijding aan gemeenschap. Hun energie wordt gekanaliseerd via relaties — leuk, warm en aardsverbindend.",
    },
    wing8: {
      en: "7w8 — The Realist: More driven and assertive. Combines enthusiasm with force. Goes big on ideas and follows through with intensity. Can be charismatic and overwhelming in equal measure.",
      id: "7w8 — Si Realis: Lebih bersemangat dan asertif. Memadukan antusiasme dengan kekuatan. Berpikir besar tentang ide dan menindaklanjutinya dengan intensitas. Bisa karismatik dan luar biasa dalam ukuran yang sama.",
      nl: "7w8 — De Realist: Gedrevener en assertiever. Combineert enthousiasme met kracht. Denkt groot over ideeën en volgt door met intensiteit. Kan in gelijke mate charismatisch en overweldigend zijn.",
    },
  },
  {
    number: 8,
    name: { en: "The Challenger", id: "Si Penantang", nl: "De Uitdager" },
    tagline: { en: "Powerful. Decisive. Protective.", id: "Kuat. Tegas. Protektif.", nl: "Krachtig. Besluitvaardig. Beschermend." },
    color: "oklch(50% 0.22 25)",
    colorLight: "oklch(63% 0.17 25)",
    colorVeryLight: "oklch(94% 0.04 25)",
    bg: "oklch(17% 0.16 25)",
    overview: {
      en: "The Type 8 leader leads with strength, decisiveness, and intensity. They take charge, protect the vulnerable, and fight for what's right. They are energised by challenge and unafraid of confrontation. Their greatest gift is their willingness to bear the weight of leadership — their growth edge is discovering that vulnerability is not weakness but the deepest form of strength.",
      id: "Pemimpin Tipe 8 memimpin dengan kekuatan, ketegasan, dan intensitas. Mereka mengambil kendali, melindungi yang rentan, dan berjuang untuk kebenaran. Mereka mendapat energi dari tantangan dan tidak takut konfrontasi. Hadiah terbesar mereka adalah kesediaan mereka untuk menanggung beban kepemimpinan — tepi pertumbuhan mereka adalah menemukan bahwa kerentanan bukan kelemahan tetapi bentuk kekuatan yang paling dalam.",
      nl: "De Type 8-leider leidt met kracht, besluitvaardigheid en intensiteit. Ze nemen de leiding, beschermen de kwetsbaren en strijden voor wat juist is. Ze krijgen energie van uitdagingen en zijn niet bang voor confrontaties. Hun grootste gave is hun bereidheid de last van leiderschap te dragen — hun groeipunt is ontdekken dat kwetsbaarheid geen zwakheid is maar de diepste vorm van kracht.",
    },
    motivation: {
      en: "To be self-reliant, strong, and in control of their own life — to protect themselves and those they care for.",
      id: "Menjadi mandiri, kuat, dan mengendalikan kehidupan mereka sendiri — untuk melindungi diri mereka dan orang-orang yang mereka pedulikan.",
      nl: "Zelfredzaam, sterk en in controle over het eigen leven zijn — zichzelf en de mensen voor wie ze zorgen beschermen.",
    },
    fear: {
      en: "Being controlled, betrayed, manipulated, or losing their power and agency.",
      id: "Dikendalikan, dikhianati, dimanipulasi, atau kehilangan kekuatan dan kemampuan bertindak mereka.",
      nl: "Gecontroleerd, verraden, gemanipuleerd worden of hun macht en handelingsvrijheid verliezen.",
    },
    strengths: {
      en: ["Decisive and action-oriented", "Protects and advocates fiercely for those in their care", "Unafraid of difficult conversations and necessary conflict", "Brings strength and courage to uncertain situations", "Natural authority — people know they can rely on them"],
      id: ["Tegas dan berorientasi pada tindakan", "Melindungi dan mengadvokasi dengan kuat bagi mereka yang berada dalam perlindungannya", "Tidak takut percakapan sulit dan konflik yang diperlukan", "Membawa kekuatan dan keberanian dalam situasi yang tidak pasti", "Otoritas alami — orang tahu mereka bisa mengandalkannya"],
      nl: ["Besluitvaardig en actiegericht", "Beschermt en pleit vurig voor degenen onder hun hoede", "Niet bang voor moeilijke gesprekken en noodzakelijk conflict", "Brengt kracht en moed in onzekere situaties", "Natuurlijk gezag — mensen weten dat ze op hen kunnen vertrouwen"],
    },
    blindspots: {
      en: ["Can be domineering and unaware of their impact on others", "Struggles with vulnerability and admitting weakness", "Trust, once broken, is rarely restored", "Can bulldoze others in pursuit of what they believe is right"],
      id: ["Bisa mendominasi dan tidak menyadari dampaknya pada orang lain", "Kesulitan dengan kerentanan dan mengakui kelemahan", "Kepercayaan, begitu rusak, jarang dipulihkan", "Bisa menghancurkan orang lain dalam mengejar apa yang mereka yakini benar"],
      nl: ["Kan dominant zijn en zich niet bewust zijn van hun impact op anderen", "Moeite met kwetsbaarheid en het erkennen van zwakte", "Vertrouwen, eenmaal gebroken, wordt zelden hersteld", "Kan anderen overrijden in de achtervolging van wat ze juist vinden"],
    },
    communication: {
      en: "Be direct, honest, and confident. Don't be passive or vague — they lose respect quickly. Earn their respect through strength, not compliance. Show them you can handle their directness without becoming defensive.",
      id: "Bersikaplah langsung, jujur, dan percaya diri. Jangan bersikap pasif atau tidak jelas — mereka dengan cepat kehilangan rasa hormat. Dapatkan rasa hormat mereka melalui kekuatan, bukan kepatuhan. Tunjukkan bahwa Anda bisa menangani kelangsungan mereka tanpa menjadi defensif.",
      nl: "Wees direct, eerlijk en zelfverzekerd. Wees niet passief of vaag — ze verliezen snel respect. Verdien hun respect door kracht, niet gehoorzaamheid. Laat zien dat u hun directheid kunt hanteren zonder defensief te worden.",
    },
    crossCultural: {
      en: "The Type 8's directness is empowering in some cultures and deeply disrespectful in others. In shame-based or high-context cultures, their confrontational style can destroy relationships irreparably. Growth edge: learning cultural sensitivity without losing their core strength — discovering that restraint is power.",
      id: "Ketegasan Tipe 8 memberdayakan dalam beberapa budaya dan sangat tidak hormat dalam budaya lain. Dalam budaya berbasis malu atau konteks tinggi, gaya konfrontatif mereka dapat merusak hubungan secara tidak dapat diperbaiki. Tepi pertumbuhan: belajar kepekaan budaya tanpa kehilangan kekuatan inti mereka — menemukan bahwa menahan diri adalah kekuatan.",
      nl: "De directheid van Type 8 is empowerend in sommige culturen en diep respectloos in andere. In schaamte-culturen of hoge-context-culturen kan hun confronterende stijl relaties onherstelbaar beschadigen. Groeipunt: culturele sensitiviteit leren zonder hun kerkkracht te verliezen — ontdekken dat terughoudendheid macht is.",
    },
    wing7: {
      en: "8w7 — The Maverick: More energetic and adventurous. Combines strength with enthusiasm and vision. Often charismatic, bold, and future-facing — intensity with a playful edge.",
      id: "8w7 — Si Maverick: Lebih energetik dan petualang. Memadukan kekuatan dengan antusiasme dan visi. Sering karismatik, berani, dan berorientasi masa depan — intensitas dengan sentuhan yang menyenangkan.",
      nl: "8w7 — De Maverick: Energieker en avontuurlijker. Combineert kracht met enthousiasme en visie. Vaak charismatisch, gedurfd en toekomstgericht — intensiteit met een speelse kant.",
    },
    wing9: {
      en: "8w9 — The Bear: More steady and patient. Combines power with calm. Their strength is held in reserve and deployed only when necessary. Often deeply protective and surprisingly gentle.",
      id: "8w9 — Si Beruang: Lebih stabil dan sabar. Memadukan kekuatan dengan ketenangan. Kekuatan mereka disimpan dan hanya digunakan saat diperlukan. Sering sangat protektif dan mengejutkan dalam kelembutan.",
      nl: "8w9 — De Beer: Stabieler en geduldiger. Combineert kracht met kalmte. Hun kracht wordt in reserve gehouden en alleen ingezet als dat nodig is. Vaak diep beschermend en verrassend zacht.",
    },
  },
  {
    number: 9,
    name: { en: "The Peacemaker", id: "Si Pendamai", nl: "De Vredestichter" },
    tagline: { en: "Peaceful. Inclusive. A steady presence.", id: "Damai. Inklusif. Hadir dengan stabil.", nl: "Vredig. Inclusief. Een stabiele aanwezigheid." },
    color: "oklch(50% 0.15 145)",
    colorLight: "oklch(63% 0.12 145)",
    colorVeryLight: "oklch(94% 0.03 145)",
    bg: "oklch(17% 0.10 145)",
    overview: {
      en: "The Type 9 leader is the unifying force of any team. They see all perspectives, create harmony, and hold space for everyone to be heard. Their calm, non-anxious presence is a profound gift in conflict-heavy environments. Their growth edge is claiming their own voice and leading with their full self — not just facilitating everyone else.",
      id: "Pemimpin Tipe 9 adalah kekuatan pemersatu dari tim mana pun. Mereka melihat semua perspektif, menciptakan harmoni, dan memberi ruang bagi semua orang untuk didengar. Kehadiran mereka yang tenang dan tidak cemas adalah anugerah yang mendalam dalam lingkungan yang penuh konflik. Tepi pertumbuhan mereka adalah mengklaim suara mereka sendiri dan memimpin dengan diri penuh mereka — bukan hanya memfasilitasi semua orang lain.",
      nl: "De Type 9-leider is de verenigde kracht van elk team. Ze zien alle perspectieven, creëren harmonie en geven iedereen ruimte om gehoord te worden. Hun kalme, niet-angstige aanwezigheid is een diepgaand geschenk in conflictrijke omgevingen. Hun groeipunt is hun eigen stem opeisen en leiden met hun volle zelf — niet alleen anderen faciliteren.",
    },
    motivation: {
      en: "To have inner peace and harmony — to stay connected with others and avoid separation or conflict.",
      id: "Memiliki kedamaian batin dan harmoni — untuk tetap terhubung dengan orang lain dan menghindari pemisahan atau konflik.",
      nl: "Innerlijke vrede en harmonie hebben — verbonden blijven met anderen en scheiding of conflict vermijden.",
    },
    fear: {
      en: "Conflict, fragmentation, and being cut off from the people they love — losing their sense of inner calm.",
      id: "Konflik, fragmentasi, dan terputus dari orang-orang yang mereka cintai — kehilangan rasa ketenangan batin mereka.",
      nl: "Conflict, fragmentatie en afgesneden worden van de mensen van wie ze houden — hun gevoel van innerlijke rust verliezen.",
    },
    strengths: {
      en: ["Natural mediator and bridge-builder", "Inclusive — everyone feels heard and valued", "Calm, non-anxious presence under pressure", "Sees all sides without bias or agenda", "Holds diverse teams together with grace and steadiness"],
      id: ["Mediator alami dan pembangun jembatan", "Inklusif — semua orang merasa didengar dan dihargai", "Kehadiran yang tenang dan tidak cemas di bawah tekanan", "Melihat semua sisi tanpa bias atau agenda", "Menyatukan tim yang beragam dengan keanggunan dan kestabilan"],
      nl: ["Natuurlijke bemiddelaar en bruggenbouwer", "Inclusief — iedereen voelt zich gehoord en gewaardeerd", "Kalme, niet-angstige aanwezigheid onder druk", "Ziet alle kanten zonder vooroordeel of agenda", "Houdt diverse teams samen met gratie en standvastigheid"],
    },
    blindspots: {
      en: ["Can lose themselves in others' agendas and forget their own", "Procrastination and disengagement from personal priorities", "Conflict avoidance allows problems to fester unaddressed", "May go along to avoid disruption even when they deeply disagree"],
      id: ["Bisa kehilangan diri dalam agenda orang lain dan melupakan mereka sendiri", "Menunda dan tidak terlibat dengan prioritas pribadi", "Penghindaran konflik membiarkan masalah membusuk tanpa ditangani", "Mungkin mengikuti untuk menghindari gangguan bahkan ketika mereka sangat tidak setuju"],
      nl: ["Kan zichzelf verliezen in andermans agenda's en de eigen vergeten", "Uitstelgedrag en ontkoppeling van persoonlijke prioriteiten", "Conflictvermijding laat problemen sudderen zonder oplossing", "Kan meegaan om verstoring te vermijden zelfs als ze het diep oneens zijn"],
    },
    communication: {
      en: "Create space for them to share their view — they won't always volunteer it. Give them time to respond. Don't force quick decisions. And most importantly: ask them what they want, then actually wait for a real answer.",
      id: "Ciptakan ruang bagi mereka untuk berbagi pandangan mereka — mereka tidak selalu menawarkannya secara sukarela. Beri mereka waktu untuk merespons. Jangan paksakan keputusan cepat. Dan yang terpenting: tanyakan apa yang mereka inginkan, lalu benar-benar tunggu jawaban nyata.",
      nl: "Creëer ruimte voor hen om hun mening te delen — ze zullen die niet altijd vrijwillig geven. Geef hen tijd om te reageren. Dwing geen snelle beslissingen af. En het belangrijkst: vraag wat ze willen, en wacht dan echt op een echt antwoord.",
    },
    crossCultural: {
      en: "The Type 9's harmony-seeking is deeply valued in collectivist cultures. In individualistic cultures, their reluctance to assert their own view can be misread as indecision or lack of conviction. Growth edge: claiming their voice and being willing to disrupt the peace when justice or truth demands it.",
      id: "Pencarian harmoni Tipe 9 sangat dihargai dalam budaya kolektivis. Dalam budaya individualis, keengganan mereka untuk menegaskan pandangan mereka sendiri bisa disalahartikan sebagai ketidaktegasan atau kurangnya keyakinan. Tepi pertumbuhan: mengklaim suara mereka dan bersedia mengganggu kedamaian ketika keadilan atau kebenaran menuntutnya.",
      nl: "Het harmonie zoeken van Type 9 wordt diep gewaardeerd in collectivistische culturen. In individualistische culturen kan hun terughoudendheid om hun eigen mening te uiten verkeerd worden gelezen als besluiteloosheid of gebrek aan overtuiging. Groeipunt: hun stem opeisen en bereid zijn de vrede te verstoren als gerechtigheid of waarheid dat vereist.",
    },
    wing8: {
      en: "9w8 — The Referee: More assertive and direct. Combines peacefulness with strength. Can step into conflict when necessary and advocate firmly, but always in service of harmony.",
      id: "9w8 — Si Wasit: Lebih asertif dan langsung. Memadukan ketenangan dengan kekuatan. Bisa melangkah ke dalam konflik ketika diperlukan dan mengadvokasi dengan kuat, tetapi selalu dalam pelayanan harmoni.",
      nl: "9w8 — De Scheidsrechter: Assertiever en directer. Combineert vredigheid met kracht. Kan in conflict stappen als dat nodig is en krachtig pleiten, maar altijd in dienst van harmonie.",
    },
    wing1: {
      en: "9w1 — The Dreamer: More principled and idealistic. Combines the desire for peace with a quiet conviction about what's right. Often visionary in a gentle, long-term way.",
      id: "9w1 — Si Pemimpi: Lebih berprinsip dan idealis. Memadukan keinginan untuk damai dengan keyakinan yang tenang tentang apa yang benar. Sering visioner dengan cara yang lembut dan jangka panjang.",
      nl: "9w1 — De Dromer: Principiëler en idealisti sch. Combineert het verlangen naar vrede met een stille overtuiging over wat juist is. Vaak visionair op een zachte, langetermijn manier.",
    },
  },
];

// ── WING CALCULATION ──────────────────────────────────────────────────────────
// Adjacent types on the Enneagram circle: 1↔9↔8, 1↔2, 2↔3, 3↔4, 4↔5, 5↔6, 6↔7, 7↔8

function getAdjacentTypes(t: number): [number, number] {
  if (t === 1) return [9, 2];
  if (t === 9) return [8, 1];
  return [t - 1, t + 1] as [number, number];
}

function getWingDescription(primaryType: number, scores: Record<string, number>, lang: Lang): string | null {
  const [a, b] = getAdjacentTypes(primaryType);
  const scoreA = scores[String(a)] ?? 0;
  const scoreB = scores[String(b)] ?? 0;
  const wingType = scoreA >= scoreB ? a : b;
  const type = TYPES[primaryType - 1];
  if (!type) return null;
  const typeRecord = type as unknown as Record<string, unknown>;
  const wingKey = wingType === a ? `wing${a}` : `wing${b}`;
  const wingObj = typeRecord[wingKey];
  if (wingObj && typeof wingObj === "object") return (wingObj as T3)[lang] ?? null;
  return null;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

export default function EnneagramClient({
  isSaved: isSavedProp,
  savedType,
  savedScores,
}: {
  isSaved: boolean;
  savedType: number | null;
  savedScores: Record<string, number> | null;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const t = (obj: T3) => tFn(obj, lang);
  const [quizState, setQuizState] = useState<QuizState>(
    savedType && savedScores ? "done" : "idle"
  );
  const [currentIdx, setCurrentIdx] = useState(0); // index into QUESTION_ORDER
  // scores[t] = sum of ratings given for type t
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ questionIdx: number; value: number; type: number }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedType);
  const [expandedType, setExpandedType] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [resultFlipped, setResultFlipped] = useState(false);

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(value: number) {
    const questionIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[questionIdx];
    const newScores = { ...scores, [String(q.t)]: (scores[String(q.t)] ?? 0) + value };
    const newHistory = [...answerHistory, { questionIdx, value, type: q.t }];
    if (currentIdx < QUESTION_ORDER.length - 1) {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setCurrentIdx(currentIdx + 1);
    } else {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setQuizState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (currentIdx === 0) return;
    const last = answerHistory[answerHistory.length - 1];
    const newScores = { ...scores, [String(last.type)]: (scores[String(last.type)] ?? 0) - last.value };
    setScores(newScores);
    setAnswerHistory(answerHistory.slice(0, -1));
    setCurrentIdx(currentIdx - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentIdx(0);
    setScores({ "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 });
    setAnswerHistory([]);
    setResultSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      const r = await saveResourceToDashboard("enneagram");
      if (!r.error) setIsSaved(true);
    });
  }

  function handleSaveResult() {
    startTransition(async () => {
      await saveEnneagramResult(primaryType.number, scores);
      setResultSaved(true);
    });
  }

  // Determine primary type (highest score)
  const sortedTypes = TYPES.slice().sort((a, b) => (scores[String(b.number)] ?? 0) - (scores[String(a.number)] ?? 0));
  const primaryType = sortedTypes[0];
  const wingDesc = quizState === "done" ? getWingDescription(primaryType.number, scores, lang) : null;
  const maxPossible = 25; // 5 questions × max rating 5

  const currentQuestion = quizState === "active" ? QUESTIONS[QUESTION_ORDER[currentIdx]] : null;
  const progressPct = Math.round((currentIdx / QUESTION_ORDER.length) * 100);

  const heroTagline = {
    en: "Understand the core motivations, fears, and growth paths that shape how you lead, relate, and grow.",
    id: "Pahami motivasi inti, ketakutan, dan jalur pertumbuhan yang membentuk cara Anda memimpin, berhubungan, dan berkembang.",
    nl: "Begrijp de kernmotivaties, angsten en groeipaden die bepalen hoe u leidt, verbindt en groeit.",
  };

  return (
    <>
      <LangToggle />
      {/* ── LANGUAGE TOGGLE ── */}

      {/* ── HERO ── */}
      <div style={{
        background: quizState === "done" ? primaryType.bg : "oklch(17% 0.12 260)",
        padding: "4rem 2rem 3.5rem",
        transition: "background 0.6s ease",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "3rem", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: quizState === "done" ? primaryType.colorLight : "oklch(65% 0.15 45)",
            marginBottom: "1rem",
          }}>
            {t(UI.personalityAssessment)}
          </p>
          <h1 style={{
            fontFamily: "var(--font-montserrat)", fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            color: "oklch(97% 0.005 80)", letterSpacing: "-0.03em", lineHeight: 1.05,
            marginBottom: "1.25rem",
          }}>
            {quizState === "done"
              ? `Type ${primaryType.number} — ${t(primaryType.name)}`
              : t(UI.enneagram)}
          </h1>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "1.15rem", color: "oklch(66% 0.04 260)", lineHeight: 1.6, maxWidth: "52ch",
          }}>
            {quizState === "done"
              ? t(primaryType.tagline)
              : t(heroTagline)}
          </p>

          {quizState === "idle" && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={startQuiz}
                style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "oklch(65% 0.15 45)", color: "white",
                  border: "none", padding: "0.75rem 1.75rem", cursor: "pointer",
                }}
              >
                {t(UI.startAssessment)}
              </button>
              {!isSaved && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "transparent", color: "oklch(66% 0.04 260)",
                    border: "1px solid oklch(35% 0.04 260)", padding: "0.75rem 1.75rem",
                    cursor: "pointer", opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isSaved ? t(UI.saved) : t(UI.saveDashboard)}
                </button>
              )}
            </div>
          )}
          </div>

          {quizState === "idle" && (
            <img src="/enneagram-types/enneagram-wheel.png" alt="Enneagram Wheel" loading="lazy" style={{ width: "320px", height: "auto", opacity: 0.85, flexShrink: 0 }} />
          )}


          {quizState === "done" && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {!resultSaved && (
                <button
                  type="button"
                  onClick={handleSaveResult}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "oklch(65% 0.15 45)", color: "white",
                    border: "none", padding: "0.75rem 1.75rem", cursor: "pointer",
                    opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isPending ? t(UI.saving) : t(UI.saveMyResult)}
                </button>
              )}
              {resultSaved && (
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "oklch(62% 0.14 145)", padding: "0.75rem 0",
                }}>
                  {t(UI.resultSaved)}
                </p>
              )}
              <button
                type="button"
                onClick={retake}
                style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600,
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  background: "transparent", color: "oklch(55% 0.04 260)",
                  border: "1px solid oklch(35% 0.04 260)", padding: "0.75rem 1.5rem", cursor: "pointer",
                }}
              >
                {t(UI.retake)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RESULTS ── */}
      {quizState === "done" && (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* Result Type Tile */}
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ height: "280px" }}>
              <TypeCard
                type={primaryType}
                lang={lang}
                isFlipped={resultFlipped}
                onClick={() => setResultFlipped(!resultFlipped)}
              />
            </div>
          </div>

          {/* Primary type overview */}
          <div style={{
            background: primaryType.colorVeryLight,
            padding: "2rem",
            marginBottom: "2.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: primaryType.color, marginBottom: "0.75rem",
            }}>
              {t(UI.yourType)}
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.95rem", fontWeight: 400,
              color: "oklch(25% 0.008 260)", lineHeight: 1.75, maxWidth: "60ch",
            }}>
              {t(primaryType.overview)}
            </p>

            {wingDesc && (
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", fontWeight: 400,
                color: "oklch(40% 0.008 260)", lineHeight: 1.65, marginTop: "1rem",
                maxWidth: "60ch",
              }}>
                <strong style={{ fontWeight: 700, color: primaryType.color }}>{t(UI.wing)}</strong>
                {wingDesc}
              </p>
            )}
          </div>

          {/* All 9 scores */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "oklch(52% 0.008 260)", marginBottom: "1.25rem",
            }}>
              {t(UI.yourScoreProfile)}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {sortedTypes.map((st) => {
                const score = scores[String(st.number)] ?? 0;
                const pct = Math.round((score / maxPossible) * 100);
                const isPrimary = st.number === primaryType.number;
                return (
                  <div key={st.number} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{
                      width: "24px", flexShrink: 0,
                      fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: isPrimary ? 800 : 500,
                      color: isPrimary ? st.color : "oklch(52% 0.008 260)", textAlign: "right",
                    }}>
                      {st.number}
                    </div>
                    <div style={{ flex: 1, background: "oklch(90% 0.005 80)", height: "6px", position: "relative" }}>
                      <div style={{
                        position: "absolute", inset: 0, right: `${100 - pct}%`,
                        background: isPrimary ? st.color : "oklch(72% 0.008 260)",
                        transition: "right 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      }} />
                    </div>
                    <div style={{
                      width: "80px", flexShrink: 0,
                      fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
                      fontWeight: isPrimary ? 700 : 400,
                      color: isPrimary ? st.color : "oklch(55% 0.008 260)",
                    }}>
                      {t(st.name).replace(/^(The |De |Si )/i, "")}
                    </div>
                    <div style={{
                      width: "32px", flexShrink: 0, textAlign: "right",
                      fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
                      fontWeight: isPrimary ? 700 : 400,
                      color: isPrimary ? st.color : "oklch(58% 0.008 260)",
                    }}>
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core motivation + fear */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.coreMotivation)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: "oklch(28% 0.006 260)", lineHeight: 1.65 }}>{t(primaryType.motivation)}</p>
            </div>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.coreFear)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.88rem", color: "oklch(28% 0.006 260)", lineHeight: 1.65 }}>{t(primaryType.fear)}</p>
            </div>
          </div>

          {/* Strengths + blindspots */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(48% 0.14 145)", marginBottom: "0.75rem" }}>{t(UI.strengths)}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(primaryType.strengths[lang] as string[]).map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(52% 0.14 145)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>✓</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(52% 0.18 25)", marginBottom: "0.75rem" }}>{t(UI.growthAreas)}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(primaryType.blindspots[lang] as string[]).map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                    <span style={{ color: "oklch(55% 0.18 45)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>→</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Communication + cross-cultural */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.howToCommunicate)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7 }}>{t(primaryType.communication)}</p>
            </div>
            <div style={{ background: "oklch(97.5% 0.003 80)", padding: "1.5rem", outline: "1px solid oklch(88% 0.006 80)" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: primaryType.color, marginBottom: "0.625rem" }}>{t(UI.crossCulturalLeadership)}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(28% 0.006 260)", lineHeight: 1.7 }}>{t(primaryType.crossCultural)}</p>
            </div>
          </div>

          {/* All 9 types grid */}
          <EnneagramTypesGrid types={TYPES} lang={lang} />
        </div>
      )}

      {/* ── BACKGROUND (idle) ── */}
      {quizState === "idle" && (
        <div id="quiz-section" style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* What is the Enneagram */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {t(UI.aboutAssessment)}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(18% 0.005 260)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "2rem" }}>
              {t(UI.whatIsEnneagram)}
            </h2>
            <img src="/enneagram-types/enneagram-wheel.png" alt="Enneagram Wheel" loading="lazy" style={{ width: "100%", maxWidth: "500px", height: "auto", display: "block", margin: "0 auto 2rem auto" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                {t(UI.enneagramP1)}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                {t(UI.enneagramP2)}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.006 260)", lineHeight: 1.75 }}>
                {t(UI.enneagramP3)}
              </p>
            </div>
            <img src="/enneagram-types/overview.png" alt="Enneagram Overview" loading="lazy" style={{ width: "100%", maxWidth: "600px", marginTop: "2rem", borderRadius: "0.5rem" }} />
          </div>

          {/* The 9 types with card flip */}
          <EnneagramTypesGrid types={TYPES} lang={lang} />

          {/* How to take it */}
          <div style={{ background: "oklch(97% 0.01 50)", padding: "1.75rem 2rem", marginBottom: "2.5rem", outline: "1px solid oklch(88% 0.008 80)" }}>
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", marginBottom: "1rem" }}>{t(UI.howToTake)}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {([UI.tip1, UI.tip2, UI.tip3, UI.tip4, UI.tip5] as T3[]).map((tip, i) => (
                <li key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                  <span style={{ color: "oklch(65% 0.15 45)", fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(30% 0.006 260)", lineHeight: 1.5 }}>{t(tip)}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={startQuiz}
            style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: "oklch(65% 0.15 45)", color: "white",
              border: "none", padding: "0.875rem 2.25rem", cursor: "pointer",
            }}
          >
            {t(UI.startAssessment)}
          </button>
        </div>
      )}

      {/* ── QUIZ ── */}
      {quizState === "active" && currentQuestion && (
        <div id="quiz-section" style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" }}>

          {/* Progress */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(52% 0.008 260)" }}>
                {lang === "en" ? `Question ${currentIdx + 1} of ${QUESTION_ORDER.length}` : lang === "id" ? `Pertanyaan ${currentIdx + 1} dari ${QUESTION_ORDER.length}` : `Vraag ${currentIdx + 1} van ${QUESTION_ORDER.length}`}
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(65% 0.15 45)" }}>
                {progressPct}%
              </span>
            </div>
            <div style={{ height: "3px", background: "oklch(88% 0.006 80)" }}>
              <div style={{
                height: "100%", width: `${progressPct}%`,
                background: "oklch(65% 0.15 45)",
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Statement */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "1rem" }}>
              {t(UI.howMuch)}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 500, fontSize: "1.0625rem", color: "oklch(18% 0.005 260)", lineHeight: 1.65 }}>
              &ldquo;{currentQuestion[lang]}&rdquo;
            </p>
          </div>

          {/* Likert scale */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
            {SCALE_LABELS.map((labelObj, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAnswer(value)}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.875rem 1.25rem",
                    background: "white",
                    border: "1.5px solid oklch(86% 0.006 80)",
                    cursor: "pointer", textAlign: "left",
                    transition: "border-color 0.15s ease, background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(65% 0.15 45)";
                    (e.currentTarget as HTMLButtonElement).style.background = "oklch(99% 0.015 50)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(86% 0.006 80)";
                    (e.currentTarget as HTMLButtonElement).style.background = "white";
                  }}
                >
                  <span style={{
                    width: "24px", height: "24px", flexShrink: 0, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    background: "oklch(93% 0.005 80)",
                    fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                    color: "oklch(45% 0.008 260)",
                  }}>{value}</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", fontWeight: 400, color: "oklch(25% 0.006 260)" }}>
                    {t(labelObj)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Back */}
          {currentIdx > 0 && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 600,
                letterSpacing: "0.06em", background: "none", border: "none",
                color: "oklch(55% 0.008 260)", cursor: "pointer", textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {t(UI.back)}
            </button>
          )}
        </div>
      )}
    </>
  );
}
