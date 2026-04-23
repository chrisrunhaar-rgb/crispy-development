"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard, saveDISCResult } from "../actions";

// ── ASSESSMENT DATA ─────────────────────────────────────────────────────────────────

// Fixed per-question shuffle orders so options are never always in D/I/S/C order
const SHUFFLE_ORDERS: number[][] = [
  [2,0,3,1],[0,2,1,3],[3,1,0,2],[1,3,2,0],[2,1,0,3],
  [0,3,1,2],[3,0,2,1],[1,2,3,0],[2,3,1,0],[0,1,3,2],
  [3,2,0,1],[1,0,2,3],[2,0,1,3],[0,3,2,1],[3,1,2,0],
  [1,2,0,3],[0,1,2,3],[2,3,0,1],[3,0,1,2],[1,3,0,2],
  [0,2,3,1],[2,1,3,0],[3,2,1,0],[1,0,3,2],
];

const QS = [
  { en: "When starting a new project, your first priority is:", id: "Saat memulai proyek baru, prioritas pertama Anda adalah:", nl: "Als je aan een nieuw project begint, is jouw eerste prioriteit:", options: [
    { en: "Define the goal and get moving immediately.", id: "Menetapkan tujuan dan segera bergerak.", nl: "Het doel bepalen en meteen aan de slag gaan.", t: "D" },
    { en: "Build energy and excitement with the team.", id: "Membangun semangat dan antusias bersama tim.", nl: "Energie en enthousiasme opbouwen samen met het team.", t: "I" },
    { en: "Ensure everyone understands their role and feels included.", id: "Memastikan semua orang memahami perannya dan merasa dilibatkan.", nl: "Zorgen dat iedereen zijn rol begrijpt en zich betrokken voelt.", t: "S" },
    { en: "Gather all relevant information and create a thorough plan.", id: "Mengumpulkan semua informasi relevan dan membuat rencana yang menyeluruh.", nl: "Alle relevante informatie verzamelen en een grondig plan maken.", t: "C" },
  ]},
  { en: "In a team meeting that's running off track, you tend to:", id: "Dalam rapat tim yang berjalan tidak sesuai rencana, Anda cenderung:", nl: "In een teamvergadering die uit de hand loopt, ben jij geneigd om:", options: [
    { en: "Redirect the conversation directly and push for a decision.", id: "Langsung mengarahkan kembali diskusi dan mendorong pengambilan keputusan.", nl: "Het gesprek direct sturen en aansturen op een beslissing.", t: "D" },
    { en: "Re-energise the group and lighten the atmosphere.", id: "Membangkitkan energi kelompok dan mencairkan suasana.", nl: "De groep nieuwe energie te geven en de sfeer te verlichten.", t: "I" },
    { en: "Support whoever tries to get things back on track.", id: "Mendukung siapa pun yang berusaha mengembalikan rapat ke jalur yang benar.", nl: "Degene te ondersteunen die probeert de vergadering terug op koers te brengen.", t: "S" },
    { en: "Identify the root cause and propose a structured agenda.", id: "Mengidentifikasi akar masalah dan mengusulkan agenda yang terstruktur.", nl: "De oorzaak te achterhalen en een gestructureerde agenda voor te stellen.", t: "C" },
  ]},
  { en: "When giving feedback to a colleague, you tend to:", id: "Ketika memberikan umpan balik kepada rekan kerja, Anda cenderung:", nl: "Als je feedback geeft aan een collega, ben jij geneigd om:", options: [
    { en: "Be direct and get straight to the point.", id: "Langsung pada intinya tanpa basa-basi.", nl: "Direct en to-the-point te zijn.", t: "D" },
    { en: "Frame it positively and focus on encouragement.", id: "Menyampaikannya secara positif dengan fokus pada dorongan semangat.", nl: "Het positief te framen en te focussen op aanmoediging.", t: "I" },
    { en: "Find a private moment and deliver it gently.", id: "Mencari waktu yang tepat dan menyampaikannya dengan lembut.", nl: "Een rustig moment te zoeken en het vriendelijk over te brengen.", t: "S" },
    { en: "Prepare thoroughly and give specific, evidence-based input.", id: "Mempersiapkan dengan matang dan memberikan masukan yang spesifik berbasis fakta.", nl: "Je goed voor te bereiden en specifieke, op feiten gebaseerde input te geven.", t: "C" },
  ]},
  { en: "Under pressure, others would most likely describe you as:", id: "Di bawah tekanan, orang lain kemungkinan besar akan menggambarkan Anda sebagai:", nl: "Onder druk zouden anderen jou het meest omschrijven als:", options: [
    { en: "Decisive and assertive.", id: "Tegas dan berani mengambil sikap.", nl: "Besluitvaardig en assertief.", t: "D" },
    { en: "Energetic and optimistic.", id: "Energik dan optimistis.", nl: "Energiek en optimistisch.", t: "I" },
    { en: "Calm and steady.", id: "Tenang dan stabil.", nl: "Kalm en stabiel.", t: "S" },
    { en: "Careful and detail-focused.", id: "Hati-hati dan fokus pada detail.", nl: "Zorgvuldig en detailgericht.", t: "C" },
  ]},
  { en: "You are most motivated by:", id: "Anda paling termotivasi oleh:", nl: "Jij wordt het meest gemotiveerd door:", options: [
    { en: "Winning, achieving results, and overcoming challenges.", id: "Meraih kemenangan, mencapai hasil, dan mengatasi tantangan.", nl: "Winnen, resultaten behalen en uitdagingen overwinnen.", t: "D" },
    { en: "Connecting with others, recognition, and creative freedom.", id: "Terhubung dengan orang lain, pengakuan, dan kebebasan berkreasi.", nl: "Verbinding met anderen, erkenning en creatieve vrijheid.", t: "I" },
    { en: "Harmony, security, and genuinely helping those around you.", id: "Keharmonisan, rasa aman, dan benar-benar membantu orang-orang di sekitar Anda.", nl: "Harmonie, veiligheid en oprecht helpen van de mensen om je heen.", t: "S" },
    { en: "Accuracy, quality, and doing things the right way.", id: "Akurasi, kualitas, dan melakukan segala sesuatu dengan benar.", nl: "Nauwkeurigheid, kwaliteit en dingen op de juiste manier doen.", t: "C" },
  ]},
  { en: "When you disagree with a leadership decision, you:", id: "Ketika Anda tidak setuju dengan keputusan pimpinan, Anda:", nl: "Als jij het niet eens bent met een beslissing van de leiding, dan:", options: [
    { en: "Speak up immediately and challenge it directly.", id: "Langsung berbicara dan menantang keputusan tersebut secara langsung.", nl: "Spreek je je meteen uit en daag je het direct uit.", t: "D" },
    { en: "Talk to others about it and try to build consensus.", id: "Membicarakannya dengan orang lain dan mencoba membangun konsensus.", nl: "Praat je erover met anderen en probeer je draagvlak te creëren.", t: "I" },
    { en: "Quietly follow through while hoping things improve.", id: "Diam-diam menjalankannya sambil berharap keadaan akan membaik.", nl: "Voer je het stilletjes uit terwijl je hoopt dat het beter wordt.", t: "S" },
    { en: "Document your concerns and present your reasoning carefully.", id: "Mendokumentasikan kekhawatiran Anda dan menyampaikan alasan dengan cermat.", nl: "Leg je je bezwaren vast en breng je je redenering zorgvuldig onder woorden.", t: "C" },
  ]},
  { en: "In a cross-cultural team, your natural contribution is:", id: "Dalam tim lintas budaya, kontribusi alami Anda adalah:", nl: "In een intercultureel team is jouw natuurlijke bijdrage:", options: [
    { en: "Setting a clear direction and making fast decisions.", id: "Menetapkan arah yang jelas dan membuat keputusan cepat.", nl: "Een heldere richting bepalen en snel beslissingen nemen.", t: "D" },
    { en: "Creating connection and breaking down social barriers.", id: "Membangun koneksi dan meruntuhkan hambatan sosial.", nl: "Verbinding creëren en sociale barrières doorbreken.", t: "I" },
    { en: "Creating a safe environment where everyone feels included.", id: "Menciptakan lingkungan yang aman di mana semua orang merasa dilibatkan.", nl: "Een veilige omgeving scheppen waar iedereen zich welkom voelt.", t: "S" },
    { en: "Ensuring quality and attention to important cultural details.", id: "Memastikan kualitas dan memperhatikan detail budaya yang penting.", nl: "Kwaliteit waarborgen en aandacht geven aan belangrijke culturele details.", t: "C" },
  ]},
  { en: "When a plan changes unexpectedly, you:", id: "Ketika rencana berubah secara tiba-tiba, Anda:", nl: "Als een plan onverwacht verandert, dan:", options: [
    { en: "Adapt quickly and find a new path forward.", id: "Beradaptasi dengan cepat dan menemukan jalan baru ke depan.", nl: "Pas jij je snel aan en zoek je een nieuwe weg vooruit.", t: "D" },
    { en: "Look for the positive angle and keep the team's spirits up.", id: "Mencari sisi positifnya dan menjaga semangat tim.", nl: "Zoek jij de positieve kant en houd jij de teamgeest hoog.", t: "I" },
    { en: "Need time to process the change before fully committing.", id: "Membutuhkan waktu untuk memproses perubahan sebelum sepenuhnya berkomitmen.", nl: "Heb jij tijd nodig om de verandering te verwerken voordat je er volledig in meegaat.", t: "S" },
    { en: "Want to understand fully why it changed before accepting it.", id: "Ingin memahami sepenuhnya mengapa perubahan terjadi sebelum menerimanya.", nl: "Wil jij volledig begrijpen waarom het is veranderd voordat je het accepteert.", t: "C" },
  ]},
  { en: "You are most frustrated when:", id: "Anda paling frustrasi ketika:", nl: "Jij raakt het meest gefrustreerd als:", options: [
    { en: "Decisions drag on and things move too slowly.", id: "Keputusan berlarut-larut dan segalanya berjalan terlalu lambat.", nl: "Beslissingen eindeloos duren en alles te langzaam gaat.", t: "D" },
    { en: "The atmosphere is cold and people don't engage.", id: "Suasana dingin dan orang-orang tidak mau terlibat.", nl: "De sfeer koud is en mensen zich niet betrokken tonen.", t: "I" },
    { en: "There is constant conflict or instability in the team.", id: "Ada konflik yang terus-menerus atau ketidakstabilan dalam tim.", nl: "Er voortdurend conflict of instabiliteit in het team is.", t: "S" },
    { en: "Work is done carelessly or without attention to quality.", id: "Pekerjaan dilakukan dengan sembarangan atau tanpa memperhatikan kualitas.", nl: "Werk slordig of zonder aandacht voor kwaliteit wordt gedaan.", t: "C" },
  ]},
  { en: "When presenting ideas, you prefer to:", id: "Ketika mempresentasikan ide, Anda lebih suka:", nl: "Als je ideeën presenteert, geef jij er de voorkeur aan om:", options: [
    { en: "Be brief, direct, and confident.", id: "Singkat, langsung, dan penuh keyakinan.", nl: "Kort, direct en zelfverzekerd te zijn.", t: "D" },
    { en: "Be engaging, enthusiastic, and use stories.", id: "Menarik, penuh semangat, dan menggunakan cerita.", nl: "Boeiend en enthousiast te zijn en verhalen te gebruiken.", t: "I" },
    { en: "Check with others first and present collaboratively.", id: "Berkonsultasi dengan orang lain terlebih dahulu dan mempresentasikan secara kolaboratif.", nl: "Eerst anderen te raadplegen en samen te presenteren.", t: "S" },
    { en: "Prepare thoroughly with data and a clear structure.", id: "Mempersiapkan dengan matang menggunakan data dan struktur yang jelas.", nl: "Je grondig voor te bereiden met data en een heldere structuur.", t: "C" },
  ]},
  { en: "Others come to you most often for:", id: "Orang lain paling sering datang kepada Anda untuk:", nl: "Anderen komen het vaakst bij jou voor:", options: [
    { en: "Quick decisions and solving problems.", id: "Keputusan cepat dan pemecahan masalah.", nl: "Snelle beslissingen en het oplossen van problemen.", t: "D" },
    { en: "Energy, ideas, and encouragement.", id: "Energi, ide, dan semangat.", nl: "Energie, ideeën en aanmoediging.", t: "I" },
    { en: "Support, stability, and a listening ear.", id: "Dukungan, stabilitas, dan telinga yang siap mendengarkan.", nl: "Steun, stabiliteit en een luisterend oor.", t: "S" },
    { en: "Accuracy, analysis, and careful thinking.", id: "Akurasi, analisis, dan pemikiran yang cermat.", nl: "Nauwkeurigheid, analyse en zorgvuldig denken.", t: "C" },
  ]},
  { en: "In a new team, your role naturally becomes:", id: "Dalam tim baru, peran Anda secara alami menjadi:", nl: "In een nieuw team word jij van nature degene die:", options: [
    { en: "The one who sets the pace and direction.", id: "Orang yang menetapkan tempo dan arah.", nl: "Het tempo en de richting bepaalt.", t: "D" },
    { en: "The one who creates connections and builds energy.", id: "Orang yang membangun koneksi dan menciptakan energi.", nl: "Verbindingen legt en energie creëert.", t: "I" },
    { en: "The one who ensures no one is left behind.", id: "Orang yang memastikan tidak ada yang tertinggal.", nl: "Ervoor zorgt dat niemand achterblijft.", t: "S" },
    { en: "The one who catches errors and ensures quality.", id: "Orang yang menangkap kesalahan dan memastikan kwaliteit.", nl: "Fouten opspoort en kwaliteit bewaakt.", t: "C" },
  ]},
  { en: "When someone on your team makes a mistake, you:", id: "Ketika seseorang di tim Anda membuat kesalahan, Anda:", nl: "Als iemand in jouw team een fout maakt, dan:", options: [
    { en: "Address it quickly and directly.", id: "Menanganinya dengan cepat dan langsung.", nl: "Pak jij het snel en direct aan.", t: "D" },
    { en: "Turn it into a learning moment with a positive framing.", id: "Mengubahnya menjadi momen belajar dengan bingkai yang positif.", nl: "Maak jij er een leermoment van met een positieve insteek.", t: "I" },
    { en: "Handle it privately and protect their dignity.", id: "Menanganinya secara pribadi dan menjaga martabat mereka.", nl: "Handel jij het privé af en bescherm je hun waardigheid.", t: "S" },
    { en: "Analyse what went wrong to prevent it happening again.", id: "Menganalisis apa yang salah untuk mencegah hal itu terulang.", nl: "Analyseer jij wat er fout ging om herhaling te voorkomen.", t: "C" },
  ]},
  { en: "Your preferred working pace is:", id: "Tempo kerja pilihan Anda adalah:", nl: "Jouw voorkeurstempo bij het werken is:", options: [
    { en: "Fast and decisive.", id: "Cepat dan tegas.", nl: "Snel en besluitvaardig.", t: "D" },
    { en: "Dynamic and collaborative.", id: "Dinamis dan kolaboratif.", nl: "Dynamisch en samenwerkend.", t: "I" },
    { en: "Steady and predictable.", id: "Stabil dan dapat diprediksi.", nl: "Gestaag en voorspelbaar.", t: "S" },
    { en: "Methodical and thorough.", id: "Metodis dan menyeluruh.", nl: "Methodisch en grondig.", t: "C" },
  ]},
  { en: "When dealing with conflict, you:", id: "Ketika menghadapi konflik, Anda:", nl: "Als je met conflict te maken hebt, dan:", options: [
    { en: "Address it head-on and resolve it immediately.", id: "Menghadapinya langsung dan menyelesaikannya segera.", nl: "Pak jij het direct aan en los je het meteen op.", t: "D" },
    { en: "Try to smooth things over and restore the relationship.", id: "Berusaha meredakan ketegangan dan memulihkan hubungan.", nl: "Probeer jij de situatie te sussen en de relatie te herstellen.", t: "I" },
    { en: "Avoid it if possible and hope it resolves naturally.", id: "Menghindarinya jika memungkinkan dan berharap itu selesai dengan sendirinya.", nl: "Vermijd jij het indien mogelijk en hoop je dat het vanzelf overgaat.", t: "S" },
    { en: "Gather all the facts first, then address it logically.", id: "Mengumpulkan semua fakta terlebih dahulu, lalu menanganinya secara logis.", nl: "Verzamel jij eerst alle feiten en pak je het daarna logisch aan.", t: "C" },
  ]},
  { en: "When faced with a long to-do list, you:", id: "Ketika menghadapi daftar tugas yang panjang, Anda:", nl: "Als je voor een lange takenlijst staat, dan:", options: [
    { en: "Prioritise ruthlessly and power through the most important items.", id: "Memprioritaskan dengan tegas dan mengerjakan hal-hal terpenting.", nl: "Prioriteer jij zonder compromissen en werk je door de belangrijkste punten heen.", t: "D" },
    { en: "Work best when others are around to keep the energy up.", id: "Bekerja paling baik ketika ada orang lain di sekitar untuk menjaga semangat.", nl: "Werk jij het beste als anderen in de buurt zijn om de energie hoog te houden.", t: "I" },
    { en: "Work through it steadily, one task at a time.", id: "Mengerjakannya secara stabil, satu tugas demi satu.", nl: "Werk jij er gestaag doorheen, taak voor taak.", t: "S" },
    { en: "Create a structured system and track everything carefully.", id: "Membuat sistem yang terstruktur dan melacak semuanya dengan cermat.", nl: "Maak jij een gestructureerd systeem en houd je alles nauwkeurig bij.", t: "C" },
  ]},
  { en: "When learning something new, you prefer:", id: "Ketika mempelajari sesuatu yang baru, Anda lebih suka:", nl: "Als je iets nieuws leert, geef jij de voorkeur aan:", options: [
    { en: "A brief overview, then diving straight in hands-on.", id: "Gambaran singkat, lalu langsung terjun melakukannya.", nl: "Een kort overzicht, dan meteen hands-on aan de slag.", t: "D" },
    { en: "Interactive group sessions with discussion and shared energy.", id: "Sesi kelompok interaktif dengan diskusi dan semangat bersama.", nl: "Interactieve groepssessies met discussie en gedeelde energie.", t: "I" },
    { en: "Step-by-step guidance with plenty of time to practice.", id: "Panduan langkah demi langkah dengan banyak waktu untuk berlatih.", nl: "Stap-voor-stap begeleiding met voldoende tijd om te oefenen.", t: "S" },
    { en: "Thorough documentation and deep understanding before starting.", id: "Dokumentasi menyeluruh dan pemahaman mendalam sebelum memulai.", nl: "Uitgebreide documentatie en diep begrip voordat je begint.", t: "C" },
  ]},
  { en: "When someone disagrees with your idea, you:", id: "Ketika seseorang tidak setuju dengan ide Anda, Anda:", nl: "Als iemand het niet eens is met jouw idee, dan:", options: [
    { en: "Stand your ground unless they give compelling evidence.", id: "Tetap pada pendirian Anda kecuali mereka memberikan bukti yang meyakinkan.", nl: "Houd jij voet bij stuk, tenzij ze overtuigend bewijs leveren.", t: "D" },
    { en: "Try to win them over through enthusiasm and persuasion.", id: "Berusaha memenangkan mereka melalui antusiasme dan persuasi.", nl: "Probeer jij ze mee te krijgen via enthousiasme en overtuigingskracht.", t: "I" },
    { en: "Listen carefully and often adapt your position.", id: "Mendengarkan dengan saksama dan sering kali menyesuaikan posisi Anda.", nl: "Luister jij aandachtig en pas je je standpunt vaak aan.", t: "S" },
    { en: "Welcome specific objections and adjust your thinking accordingly.", id: "Menyambut keberatan yang spesifik dan menyesuaikan pemikiran Anda.", nl: "Verwelkom jij specifieke bezwaren en pas je je denken daar op aan.", t: "C" },
  ]},
  { en: "Your leadership style is best described as:", id: "Gaya kepemimpinan Anda paling baik digambarkan sebagai:", nl: "Jouw leiderschapsstijl is het beste te omschrijven als:", options: [
    { en: "Driving toward results with clear expectations.", id: "Mendorong ke arah hasil dengan ekspektasi yang jelas.", nl: "Sturen op resultaten met heldere verwachtingen.", t: "D" },
    { en: "Inspiring and motivating through energy and vision.", id: "Menginspirasi dan memotivasi melalui energi dan visi.", nl: "Inspireren en motiveren via energie en visie.", t: "I" },
    { en: "Supporting and developing people with patience.", id: "Mendukung dan mengembangkan orang-orang dengan sabar.", nl: "Mensen ondersteunen en ontwikkelen met geduld.", t: "S" },
    { en: "Leading through expertise, precision, and high standards.", id: "Memimpin melalui keahlian, ketepatan, dan standar yang tinggi.", nl: "Leiden via vakmanschap, precisie en hoge standaarden.", t: "C" },
  ]},
  { en: "In a crisis, your instinct is to:", id: "Dalam situasi krisis, naluri Anda adalah:", nl: "In een crisis is jouw instinct om:", options: [
    { en: "Take immediate control and start making decisions.", id: "Langsung mengambil kendali dan mulai membuat keputusan.", nl: "Direct de leiding te nemen en beslissingen te gaan nemen.", t: "D" },
    { en: "Rally people together and maintain positive energy.", id: "Menyatukan orang-orang dan mempertahankan energi positif.", nl: "Mensen samen te brengen en de positieve energie vast te houden.", t: "I" },
    { en: "Stay calm and provide stability to those around you.", id: "Tetap tenang dan memberikan stabilitas kepada orang-orang di sekitar Anda.", nl: "Kalm te blijven en de mensen om je heen stabiliteit te bieden.", t: "S" },
    { en: "Assess the situation carefully and systematically before acting.", id: "Menilai situasi secara cermat dan sistematis sebelum bertindak.", nl: "De situatie zorgvuldig en systematisch te beoordelen voordat je handelt.", t: "C" },
  ]},
  { en: "You feel a task is complete when:", id: "Anda merasa sebuah tugas selesai ketika:", nl: "Jij vindt een taak klaar als:", options: [
    { en: "The goal is achieved — results matter most.", id: "Tujuan tercapai — hasil adalah yang terpenting.", nl: "Het doel behaald is — resultaten tellen het zwaarst.", t: "D" },
    { en: "The process was engaging and the team feels good about it.", id: "Prosesnya menyenangkan dan tim merasa puas dengannya.", nl: "Het proces energiek was en het team er goed over voelt.", t: "I" },
    { en: "Everyone involved feels good about how it went.", id: "Semua orang yang terlibat merasa baik tentang jalannya pekerjaan.", nl: "Iedereen die erbij betrokken was tevreden is over hoe het gegaan is.", t: "S" },
    { en: "Every detail has been checked and the quality is right.", id: "Setiap detail telah diperiksa dan kualitasnya sudah benar.", nl: "Elk detail is nagelopen en de kwaliteit klopt.", t: "C" },
  ]},
  { en: "Others sometimes see you as:", id: "Orang lain terkadang melihat Anda sebagai:", nl: "Anderen zien jou soms als:", options: [
    { en: "Too blunt or impatient.", id: "Terlalu blak-blakan atau tidak sabar.", nl: "Te direct of ongeduldig.", t: "D" },
    { en: "Too talkative or disorganised.", id: "Terlalu banyak bicara atau kurang terorganisir.", nl: "Te praatgraag of ongeorganiseerd.", t: "I" },
    { en: "Too slow to take initiative or overly accommodating.", id: "Terlalu lambat mengambil inisiatif atau terlalu mudah mengalah.", nl: "Te traag in het nemen van initiatief of te meegaand.", t: "S" },
    { en: "Too critical or overly cautious.", id: "Terlalu kritis atau terlalu berhati-hati.", nl: "Te kritisch of te voorzichtig.", t: "C" },
  ]},
  { en: "You feel most alive in your work when:", id: "Anda merasa paling bersemangat dalam pekerjaan Anda ketika:", nl: "Jij voelt je het meest levend in je werk als:", options: [
    { en: "You're winning and seeing measurable results.", id: "Anda meraih kemenangan dan melihat hasil yang terukur.", nl: "Je wint en meetbare resultaten ziet.", t: "D" },
    { en: "You're inspiring people and creating real momentum.", id: "Anda menginspirasi orang-orang dan menciptakan momentum nyata.", nl: "Je mensen inspireert en echte momentum creëert.", t: "I" },
    { en: "You're making a genuine difference in someone's life.", id: "Anda membuat perbedaan nyata dalam kehidupan seseorang.", nl: "Je een oprecht verschil maakt in iemands leven.", t: "S" },
    { en: "You've solved a complex problem with care and precision.", id: "Anda telah memecahkan masalah yang kompleks dengan teliti dan tepat.", nl: "Je een complex probleem met zorg en precisie hebt opgelost.", t: "C" },
  ]},
  { en: "When closing out a project, you focus most on:", id: "Ketika menyelesaikan sebuah proyek, Anda paling berfokus pada:", nl: "Als je een project afsluit, let jij het meest op:", options: [
    { en: "Did we hit the target?", id: "Apakah kita mencapai target?", nl: "Hebben we het doel gehaald?", t: "D" },
    { en: "Did the team enjoy the process and celebrate the win?", id: "Apakah tim menikmati prosesnya dan merayakan keberhasilan?", nl: "Heeft het team genoten van het proces en de overwinning gevierd?", t: "I" },
    { en: "Is everyone OK? Does anyone need additional support?", id: "Apakah semua orang baik-baik saja? Apakah ada yang membutuhkan dukungan tambahan?", nl: "Is iedereen in orde? Heeft iemand extra ondersteuning nodig?", t: "S" },
    { en: "Were all quality standards met? What can we improve next time?", id: "Apakah semua standar kualitas terpenuhi? Apa yang bisa kita tingkatkan lain kali?", nl: "Zijn alle kwaliteitsstandaarden gehaald? Wat kunnen we volgende keer beter doen?", t: "C" },
  ]},
];

// ── DISC TYPE DATA ────────────────────────────────────────────────────────────

const DISC_TYPES = [
  {
    key: "D",
    label: { en: "Dominance", id: "Dominance", nl: "Dominantie" },
    tagline: { en: "Direct. Bold. Results-driven.", id: "Langsung. Berani. Berorientasi Hasil.", nl: "Direct. Gedurfd. Resultaatgericht." },
    color: "oklch(52% 0.20 25)",
    colorLight: "oklch(65% 0.16 25)",
    colorVeryLight: "oklch(93% 0.04 25)",
    bg: "oklch(18% 0.15 25)",
    overview: {
      en: "The D-type leader is direct, competitive, and driven by results. They make decisions quickly, take charge under pressure, and thrive in environments where they can set direction and drive outcomes. They are natural initiators who cut through complexity and act.",
      id: "Pemimpin tipe D bersifat langsung, kompetitif, dan didorong oleh hasil. Mereka mengambil keputusan dengan cepat, mengambil kendali di bawah tekanan, dan berkembang di lingkungan di mana mereka dapat menentukan arah dan mendorong hasil. Mereka adalah inisiator alami yang memotong kompleksitas dan segera bertindak.",
      nl: "De D-type leider is direct, competitief en gedreven door resultaten. Ze nemen snel beslissingen, pakken de leiding onder druk en gedijen in omgevingen waar ze richting kunnen bepalen en resultaten kunnen bewerkstelligen. Het zijn natuurlijke initiatiefnemers die complexiteit doorbreken en gewoon handelen.",
    },
    motivation: {
      en: "Results, control, challenges, and the freedom to lead without restriction.",
      id: "Hasil, kendali, tantangan, dan kebebasan untuk memimpin tanpa batasan.",
      nl: "Resultaten, controle, uitdagingen en de vrijheid om te leiden zonder beperkingen.",
    },
    fear: {
      en: "Being taken advantage of, losing control, or appearing weak.",
      id: "Dimanfaatkan, kehilangan kendali, atau terlihat lemah.",
      nl: "Misbruikt worden, de controle verliezen of zwak overkomen.",
    },
    strengths: {
      en: ["Decisive under pressure", "Goal-oriented and focused", "Drives results quickly", "Natural initiator", "Tackles challenges head-on"],
      id: ["Tegas di bawah tekanan", "Berorientasi tujuan dan fokus", "Mendorong hasil dengan cepat", "Inisiator alami", "Menghadapi tantangan secara langsung"],
      nl: ["Besluitvaardig onder druk", "Doelgericht en gefocust", "Bereikt snel resultaten", "Natuurlijke initiatiefnemer", "Pakt uitdagingen direct aan"],
    },
    blindspots: {
      en: ["Can be too blunt or intimidating", "May steamroll others' input", "Impatient with slower processes", "Can prioritise outcomes over people"],
      id: ["Bisa terlalu blak-blakan atau mengintimidasi", "Mungkin mengabaikan masukan orang lain", "Tidak sabar dengan proses yang lebih lambat", "Bisa memprioritaskan hasil di atas orang"],
      nl: ["Kan te direct of intimiderend zijn", "Neigt ertoe de inbreng van anderen te overrulen", "Ongeduldig met tragere processen", "Kan resultaten boven mensen stellen"],
    },
    communication: {
      en: "Be direct. Lead with the bottom line. Keep it brief and respect their time. Avoid long explanations and get to the point immediately.",
      id: "Bersikap langsung. Mulai dengan intinya. Tetap ringkas dan hormati waktu mereka. Hindari penjelasan panjang dan langsung pada intinya.",
      nl: "Wees direct. Begin met de kern. Houd het kort en respecteer hun tijd. Vermijd lange uitleg en kom meteen ter zake.",
    },
    crossCultural: {
      en: "In high-context cultures, the D-type's directness can feel aggressive or disrespectful. Learning to slow down, read the room, and allow indirect communication to unfold is a key growth area in cross-cultural contexts.",
      id: "Dalam budaya high-context, kecenderungan langsung tipe D bisa terasa agresif atau tidak sopan. Belajar untuk memperlambat, membaca situasi, dan membiarkan komunikasi tidak langsung berkembang adalah area pertumbuhan utama dalam konteks lintas budaya.",
      nl: "In high-context culturen kan de directheid van de D-type agressief of respectloos aanvoelen. Leren vertragen, de sfeer lezen en indirecte communicatie de ruimte geven is een belangrijk groeipunt in interculturele contexten.",
    },
  },
  {
    key: "I",
    label: { en: "Influence", id: "Influence", nl: "Invloed" },
    tagline: { en: "Enthusiastic. Persuasive. People-first.", id: "Antusias. Persuasif. Mengutamakan Orang.", nl: "Enthousiast. Overtuigend. Mensgericht." },
    color: "oklch(52% 0.18 80)",
    colorLight: "oklch(65% 0.14 80)",
    colorVeryLight: "oklch(93% 0.04 80)",
    bg: "oklch(18% 0.12 80)",
    overview: {
      en: "The I-type leader is enthusiastic, expressive, and energised by people. They are gifted communicators who inspire others, build rapport quickly, and create momentum through energy and optimism. They thrive in collaborative, visible roles where their personality can shine.",
      id: "Pemimpin tipe I antusias, ekspresif, dan bersemangat oleh orang-orang. Mereka adalah komunikator berbakat yang menginspirasi orang lain, membangun hubungan dengan cepat, dan menciptakan momentum melalui energi dan optimisme. Mereka berkembang dalam peran yang kolaboratif dan terlihat di mana kepribadian mereka dapat bersinar.",
      nl: "De I-type leider is enthousiast, expressief en krijgt energie van mensen. Het zijn getalenteerde communicators die anderen inspireren, snel een band opbouwen en momentum creëren door energie en optimisme. Ze gedijen in samenwerkende, zichtbare rollen waar hun persoonlijkheid kan schitteren.",
    },
    motivation: {
      en: "Recognition, social connection, freedom of expression, and collaborative success.",
      id: "Pengakuan, koneksi sosial, kebebasan berekspresi, dan keberhasilan bersama.",
      nl: "Erkenning, sociale verbinding, vrijheid van expressie en gezamenlijk succes.",
    },
    fear: {
      en: "Social rejection, being ignored, or losing their influence over others.",
      id: "Penolakan sosial, diabaikan, atau kehilangan pengaruh mereka terhadap orang lain.",
      nl: "Sociale afwijzing, genegeerd worden of hun invloed op anderen verliezen.",
    },
    strengths: {
      en: ["Builds relationships naturally", "Highly persuasive and inspiring", "Creates positive team culture", "Enthusiastic and energising", "Collaborative and inclusive"],
      id: ["Membangun hubungan secara alami", "Sangat persuasif dan inspiratif", "Menciptakan budaya tim yang positif", "Antusias dan membangkitkan semangat", "Kolaboratif dan inklusif"],
      nl: ["Bouwt moeiteloos relaties op", "Zeer overtuigend en inspirerend", "Creëert een positieve teamcultuur", "Enthousiast en aanstekelijk", "Samenwerkend en inclusief"],
    },
    blindspots: {
      en: ["Can over-promise and under-deliver", "May lose focus on details and follow-through", "Emotions can drive decision-making", "Can struggle with structure and consistency"],
      id: ["Bisa terlalu banyak berjanji dan kurang memenuhinya", "Mungkin kehilangan fokus pada detail dan tindak lanjut", "Emosi bisa mendorong pengambilan keputusan", "Bisa kesulitan dengan struktur dan konsistensi"],
      nl: ["Kan te veel beloven en te weinig nakomen", "Kan het zicht op details en opvolging verliezen", "Emoties kunnen besluitvorming sturen", "Kan moeite hebben met structuur en consistentie"],
    },
    communication: {
      en: "Be warm and personal. Start with the relationship before business. Give them space to talk and share ideas. Affirm their contributions and avoid being overly critical.",
      id: "Bersikap hangat dan personal. Mulai dengan hubungan sebelum bisnis. Beri mereka ruang untuk berbicara dan berbagi ide. Akui kontribusi mereka dan hindari terlalu kritis.",
      nl: "Wees warm en persoonlijk. Begin met de relatie voordat je zakelijk wordt. Geef ze ruimte om te praten en ideeën te delen. Bevestig hun bijdragen en vermijd overdreven kritiek.",
    },
    crossCultural: {
      en: "The I-type's expressiveness is a gift in relational cultures but can feel superficial or exhausting in more reserved contexts. Building genuine depth — not just warmth — is the growth edge in cross-cultural leadership.",
      id: "Ekspresivitas tipe I adalah anugerah dalam budaya relasional tetapi bisa terasa dangkal atau melelahkan dalam konteks yang lebih tertutup. Membangun kedalaman sejati — bukan hanya kehangatan — adalah area pertumbuhan dalam kepemimpinan lintas budaya.",
      nl: "De expressiviteit van de I-type is een gave in relationele culturen, maar kan oppervlakkig of vermoeiend aanvoelen in meer gereserveerde contexten. Echte diepgang opbouwen — niet alleen warmte — is het groeipunt in intercultureel leiderschap.",
    },
  },
  {
    key: "S",
    label: { en: "Steadiness", id: "Steadiness", nl: "Standvastigheid" },
    tagline: { en: "Patient. Loyal. Consistently supportive.", id: "Sabar. Setia. Konsisten dalam Dukungan.", nl: "Geduldig. Loyaal. Betrouwbaar ondersteunend." },
    color: "oklch(48% 0.18 145)",
    colorLight: "oklch(62% 0.14 145)",
    colorVeryLight: "oklch(92% 0.04 145)",
    bg: "oklch(18% 0.10 145)",
    overview: {
      en: "The S-type leader is patient, dependable, and deeply loyal. They create stable, supportive environments where people feel safe and valued. They are skilled listeners and excellent mediators who hold teams together through consistency, warmth, and quiet strength.",
      id: "Pemimpin tipe S sabar, dapat diandalkan, dan sangat setia. Mereka menciptakan lingkungan yang stabil dan mendukung di mana orang merasa aman dan dihargai. Mereka adalah pendengar terampil dan mediator yang sangat baik yang menyatukan tim melalui konsistensi, kehangatan, dan kekuatan yang tenang.",
      nl: "De S-type leider is geduldig, betrouwbaar en diep loyaal. Ze creëren stabiele, ondersteunende omgevingen waar mensen zich veilig en gewaardeerd voelen. Het zijn vaardige luisteraars en uitstekende bemiddelaars die teams bij elkaar houden via consistentie, warmte en stille kracht.",
    },
    motivation: {
      en: "Stability, sincere appreciation, contributing to a team they believe in, and harmonious working relationships.",
      id: "Stabilitas, penghargaan tulus, berkontribusi pada tim yang mereka percayai, dan hubungan kerja yang harmonis.",
      nl: "Stabiliteit, oprechte waardering, bijdragen aan een team dat ze vertrouwen en harmonieuze werkrelaties.",
    },
    fear: {
      en: "Sudden change, conflict, loss of security, and letting people down.",
      id: "Perubahan mendadak, konflik, kehilangan rasa aman, dan mengecewakan orang lain.",
      nl: "Plotselinge verandering, conflict, verlies van veiligheid en mensen teleurstellen.",
    },
    strengths: {
      en: ["Deeply reliable and consistent", "Excellent listener and mediator", "Creates psychological safety", "Long-term loyalty and commitment", "Holds teams together under pressure"],
      id: ["Sangat dapat diandalkan dan konsisten", "Pendengar dan mediator yang luar biasa", "Menciptakan keamanan psikologis", "Loyalitas dan komitmen jangka panjang", "Menyatukan tim di bawah tekanan"],
      nl: ["Zeer betrouwbaar en consistent", "Uitstekende luisteraar en bemiddelaar", "Creëert psychologische veiligheid", "Loyaliteit en toewijding op de lange termijn", "Houdt teams bij elkaar onder druk"],
    },
    blindspots: {
      en: ["Avoids necessary conflict", "Can resist change even when needed", "May say yes when they mean no", "Slow to take initiative without encouragement"],
      id: ["Menghindari konflik yang diperlukan", "Bisa menolak perubahan bahkan ketika dibutuhkan", "Mungkin mengatakan ya ketika maksudnya tidak", "Lambat mengambil inisiatif tanpa dorongan"],
      nl: ["Vermijdt noodzakelijk conflict", "Kan verandering weerstaan ook als die nodig is", "Zegt soms ja terwijl ze nee bedoelen", "Traag in het nemen van initiatief zonder aanmoediging"],
    },
    communication: {
      en: "Be sincere, warm, and patient. Give them time to respond. Avoid sudden changes without explanation. Show genuine care for them as a person — not just a team member.",
      id: "Bersikap tulus, hangat, dan sabar. Beri mereka waktu untuk merespons. Hindari perubahan mendadak tanpa penjelasan. Tunjukkan perhatian tulus kepada mereka sebagai pribadi — bukan hanya anggota tim.",
      nl: "Wees oprecht, warm en geduldig. Geef ze tijd om te reageren. Vermijd plotselinge veranderingen zonder uitleg. Toon echte betrokkenheid bij hen als persoon — niet alleen als teamlid.",
    },
    crossCultural: {
      en: "The S-type's patience and harmony-seeking are deeply valued across most cultures. The growth edge is learning to express disagreement and take the lead — especially in cultures that respect assertiveness and directness.",
      id: "Kesabaran dan pencarian harmoni tipe S sangat dihargai di sebagian besar budaya. Area pertumbuhan adalah belajar mengungkapkan ketidaksetujuan dan mengambil inisiatif — terutama dalam budaya yang menghormati ketegasan dan keterbukaan.",
      nl: "Het geduld en het streven naar harmonie van de S-type worden in de meeste culturen zeer gewaardeerd. Het groeipunt is leren om meningsverschillen te uiten en het voortouw te nemen — vooral in culturen die assertiviteit en directheid waarderen.",
    },
  },
  {
    key: "C",
    label: { en: "Conscientiousness", id: "Conscientiousness", nl: "Consciëntieusheid" },
    tagline: { en: "Precise. Analytical. Excellence-driven.", id: "Tepat. Analitis. Berorientasi Keunggulan.", nl: "Precies. Analytisch. Kwaliteitsgericht." },
    color: "oklch(48% 0.18 250)",
    colorLight: "oklch(62% 0.14 250)",
    colorVeryLight: "oklch(92% 0.04 250)",
    bg: "oklch(20% 0.14 250)",
    overview: {
      en: "The C-type leader is analytical, precise, and driven by accuracy. They value quality over speed, data over assumption, and systems over intuition. They are natural problem-solvers who bring rigour, structure, and careful thinking to everything they do.",
      id: "Pemimpin tipe C analitis, tepat, dan didorong oleh akurasi. Mereka menghargai kualitas di atas kecepatan, data di atas asumsi, dan sistem di atas intuisi. Mereka adalah pemecah masalah alami yang membawa kekakuan, struktur, dan pemikiran cermat ke dalam semua yang mereka lakukan.",
      nl: "De C-type leider is analytisch, precies en gedreven door nauwkeurigheid. Ze stellen kwaliteit boven snelheid, data boven aannames en systemen boven intuïtie. Het zijn natuurlijke probleemoplossers die discipline, structuur en zorgvuldig denken inbrengen in alles wat ze doen.",
    },
    motivation: {
      en: "Accuracy, quality, deep expertise, and being given the time and space to do things right.",
      id: "Akurasi, kualitas, keahlian mendalam, dan diberi waktu serta ruang untuk melakukan segala sesuatu dengan benar.",
      nl: "Nauwkeurigheid, kwaliteit, diepgaande expertise en de tijd en ruimte krijgen om dingen goed te doen.",
    },
    fear: {
      en: "Being wrong, producing poor quality work, criticism without substance, and acting without enough information.",
      id: "Salah, menghasilkan pekerjaan berkualitas buruk, kritik tanpa substansi, dan bertindak tanpa informasi yang cukup.",
      nl: "Ongelijk hebben, werk van slechte kwaliteit leveren, kritiek zonder onderbouwing en handelen zonder voldoende informatie.",
    },
    strengths: {
      en: ["High standards and attention to detail", "Systematic problem-solving", "Critical thinking and analysis", "Reliable and thorough", "Brings structure and precision"],
      id: ["Standar tinggi dan perhatian terhadap detail", "Pemecahan masalah sistematis", "Pemikiran kritis dan analisis", "Dapat diandalkan dan menyeluruh", "Membawa struktur dan ketepatan"],
      nl: ["Hoge standaarden en oog voor detail", "Systematisch probleemoplossen", "Kritisch denken en analyse", "Betrouwbaar en grondig", "Brengt structuur en precisie"],
    },
    blindspots: {
      en: ["Can over-analyse and delay decisions", "May be overly critical of others' work", "Can come across as cold or aloof", "Perfectionistic tendencies can slow progress"],
      id: ["Bisa terlalu banyak menganalisis dan menunda keputusan", "Mungkin terlalu kritis terhadap pekerjaan orang lain", "Bisa terkesan dingin atau tidak peduli", "Kecenderungan perfeksionis dapat memperlambat kemajuan"],
      nl: ["Kan te veel analyseren en beslissingen uitstellen", "Kan overdreven kritisch zijn op andermans werk", "Kan koel of afstandelijk overkomen", "Perfectionistische neigingen kunnen vooruitgang vertragen"],
    },
    communication: {
      en: "Be accurate and prepared. Provide evidence and logical reasoning. Give them time to process and don't rush to a decision. Avoid vague language — they want specifics.",
      id: "Bersikap akurat dan siap. Berikan bukti dan penalaran logis. Beri mereka waktu untuk memproses dan jangan terburu-buru mengambil keputusan. Hindari bahasa yang samar — mereka menginginkan hal yang spesifik.",
      nl: "Wees nauwkeurig en voorbereid. Lever bewijs en logische redenering. Geef ze tijd om te verwerken en haast je niet naar een beslissing. Vermijd vage taal — ze willen specifieke informatie.",
    },
    crossCultural: {
      en: "The C-type's need for precision is a great asset in technical or quality-focused cultures. The growth edge is learning to work with relational ambiguity — where trust is built through relationships, not systems — and to communicate warmth alongside accuracy.",
      id: "Kebutuhan tipe C akan ketepatan adalah aset besar dalam budaya teknis atau yang berfokus pada kualitas. Area pertumbuhan adalah belajar bekerja dengan ambiguitas relasional — di mana kepercayaan dibangun melalui hubungan, bukan sistem — dan untuk mengkomunikasikan kehangatan bersama ketepatan.",
      nl: "De behoefte aan precisie van de C-type is een groot pluspunt in technische of kwaliteitsgerichte culturen. Het groeipunt is leren omgaan met relationele ambiguïteit — waar vertrouwen wordt opgebouwd via relaties, niet systemen — en warmte te communiceren naast nauwkeurigheid.",
    },
  },
];

// ── RESULT PROFILES ───────────────────────────────────────────────────────────

type ResultKey = "D" | "I" | "S" | "C" | "DI" | "DS" | "DC" | "IS" | "IC" | "SC";

const RESULT_PROFILES: Record<"en" | "id" | "nl", Record<ResultKey, string>> = {
  en: {
    D: "You lead with boldness and results. Your greatest strength is driving action and cutting through indecision. Growth edge: slow down enough to bring people with you — not just past them.",
    I: "You lead with energy and relationships. Your greatest strength is inspiring others and creating momentum. Growth edge: follow through on commitments and develop your eye for detail.",
    S: "You lead with patience and loyalty. Your greatest strength is creating environments where people feel safe and valued. Growth edge: practise taking initiative and speaking your concerns earlier.",
    C: "You lead with precision and expertise. Your greatest strength is bringing rigour and quality to everything. Growth edge: learn to act with less-than-perfect information and share your insights more openly.",
    DI: "You combine boldness with people-energy — driving results while keeping others inspired. A powerful combination in leading diverse teams.",
    DS: "You balance directness with steadiness — goal-focused yet able to create stable, loyal teams. You lead with both force and consistency.",
    DC: "You combine drive with precision — results-oriented and quality-obsessed. Your challenge: don't let perfectionism slow momentum.",
    IS: "You blend enthusiasm with warmth — inspiring people while genuinely caring for them. A gift in relational and cross-cultural contexts.",
    IC: "You combine persuasion with precision — engaging communicator and careful thinker. Balance spontaneity with follow-through.",
    SC: "You bring steadiness and rigour together — reliable, patient, and quality-driven. A trusted anchor for any team.",
  },
  id: {
    D: "Anda memimpin dengan keberanian dan fokus pada hasil. Kekuatan terbesar Anda adalah mendorong aksi dan mengatasi kebimbangan. Area pertumbuhan: perlambat langkah cukup untuk membawa orang bersama Anda — bukan hanya melewati mereka.",
    I: "Anda memimpin dengan energi dan hubungan. Kekuatan terbesar Anda adalah menginspirasi orang lain dan menciptakan momentum. Area pertumbuhan: tindaklanjuti komitmen dan kembangkan perhatian Anda terhadap detail.",
    S: "Anda memimpin dengan kesabaran dan kesetiaan. Kekuatan terbesar Anda adalah menciptakan lingkungan di mana orang merasa aman dan dihargai. Area pertumbuhan: latih diri untuk mengambil inisiatif dan ungkapkan kekhawatiran Anda lebih awal.",
    C: "Anda memimpin dengan ketepatan dan keahlian. Kekuatan terbesar Anda adalah membawa ketelitian dan kualitas ke dalam segalanya. Area pertumbuhan: belajarlah untuk bertindak dengan informasi yang tidak sempurna dan bagikan wawasan Anda dengan lebih terbuka.",
    DI: "Anda menggabungkan keberanian dengan energi relasional — mendorong hasil sambil menginspirasi orang lain. Kombinasi yang kuat dalam memimpin tim yang beragam.",
    DS: "Anda menyeimbangkan ketegasan dengan kestabilan — berfokus pada tujuan namun mampu menciptakan tim yang stabil dan loyal. Anda memimpin dengan kekuatan sekaligus konsistensi.",
    DC: "Anda menggabungkan dorongan dengan ketepatan — berorientasi hasil dan terobsesi dengan kualitas. Tantangan Anda: jangan biarkan perfeksionisme memperlambat momentum.",
    IS: "Anda memadukan antusiasme dengan kehangatan — menginspirasi orang-orang sambil benar-benar peduli terhadap mereka. Anugerah dalam konteks relasional dan lintas budaya.",
    IC: "Anda menggabungkan persuasi dengan ketepatan — komunikator yang menarik dan pemikir yang cermat. Seimbangkan spontanitas dengan tindak lanjut.",
    SC: "Anda membawa kestabilan dan ketelitian bersama-sama — dapat diandalkan, sabar, dan berorientasi kualitas. Jangkar terpercaya bagi tim mana pun.",
  },
  nl: {
    D: "Jij leidt met durf en focus op resultaten. Je grootste kracht is het in beweging brengen van mensen en het doorbreken van besluiteloosheid. Groeipunt: vertraag genoeg om mensen mee te nemen — niet alleen voorbij ze te gaan.",
    I: "Jij leidt met energie en relaties. Je grootste kracht is het inspireren van anderen en het creëren van momentum. Groeipunt: kom je beloften na en ontwikkel je oog voor detail.",
    S: "Jij leidt met geduld en loyaliteit. Je grootste kracht is het creëren van omgevingen waar mensen zich veilig en gewaardeerd voelen. Groeipunt: oefen in het nemen van initiatief en spreek je zorgen eerder uit.",
    C: "Jij leidt met precisie en expertise. Je grootste kracht is het inbrengen van discipline en kwaliteit in alles. Groeipunt: leer te handelen met onvolledige informatie en deel je inzichten opener.",
    DI: "Jij combineert durf met mensgerichte energie — je behaalt resultaten terwijl je anderen geïnspireerd houdt. Een krachtige combinatie bij het leiden van diverse teams.",
    DS: "Jij balanceert directheid met standvastigheid — doelgericht maar in staat om stabiele, loyale teams te bouwen. Jij leidt met zowel kracht als consistentie.",
    DC: "Jij combineert gedrevenheid met precisie — resultaatgericht en kwaliteitsgedreven. Je uitdaging: laat perfectionisme het momentum niet vertragen.",
    IS: "Jij mengt enthousiasme met warmte — je inspireert mensen terwijl je oprecht om hen geeft. Een gave in relationele en interculturele contexten.",
    IC: "Jij combineert overtuigingskracht met precisie — een boeiende communicator en een zorgvuldig denker. Balanceer spontaniteit met opvolging.",
    SC: "Jij brengt standvastigheid en discipline samen — betrouwbaar, geduldig en kwaliteitsgericht. Een vertrouwd ankerpunt voor elk team.",
  },
};

// ── SCORE CALCULATION ─────────────────────────────────────────────────────────

function getResultKey(scores: { D: number; I: number; S: number; C: number }): ResultKey {
  const entries = Object.entries(scores) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  const second = entries[1];
  const threshold = top[1] * 0.75;
  if (second[1] >= threshold) {
    const combo = [top[0], second[0]].sort().join("") as ResultKey;
    return combo;
  }
  return top[0] as ResultKey;
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Lang = "en" | "id" | "nl";
type ScoreKey = "D" | "I" | "S" | "C";
type QuizState = "idle" | "active" | "done";

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DiscClient({
  isSaved: isSavedProp,
  discResult,
  discScores,
}: {
  isSaved: boolean;
  discResult: string | null;
  discScores: { D: number; I: number; S: number; C: number } | null;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [quizState, setQuizState] = useState<QuizState>(
    discResult && discScores ? "done" : "idle"
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<ScoreKey, number>>(
    discScores ?? { D: 0, I: 0, S: 0, C: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<ScoreKey[]>([]);
  const [saved, setSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!discResult);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tr = (en: string, id: string, nl: string) => lang === "en" ? en : lang === "nl" ? nl : id;

  // Build shuffled options for current question using fixed per-question shuffle
  function getShuffledOptions(qIndex: number) {
    const order = SHUFFLE_ORDERS[qIndex] ?? [0, 1, 2, 3];
    return order.map((i) => QS[qIndex].options[i]);
  }

  function startQuiz() {
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(t: ScoreKey) {
    const newScores = { ...scores, [t]: scores[t] + 1 };
    const newHistory = [...answerHistory, t];
    if (currentQ < QS.length - 1) {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setCurrentQ(currentQ + 1);
    } else {
      setScores(newScores);
      setAnswerHistory(newHistory);
      setQuizState("done");
    }
  }

  function handleBack() {
    if (currentQ === 0) return;
    const prevType = answerHistory[answerHistory.length - 1];
    setAnswerHistory(answerHistory.slice(0, -1));
    setScores({ ...scores, [prevType]: scores[prevType] - 1 });
    setCurrentQ(currentQ - 1);
  }

  function retake() {
    setQuizState("idle");
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setAnswerHistory([]);
    setResultSaved(false);
  }

  const total = scores.D + scores.I + scores.S + scores.C;
  const resultKey = total > 0 ? getResultKey(scores) : "D";
  const resultText = RESULT_PROFILES[lang][resultKey];

  const pD = total > 0 ? Math.round((scores.D / total) * 100) : 0;
  const pI = total > 0 ? Math.round((scores.I / total) * 100) : 0;
  const pS = total > 0 ? Math.round((scores.S / total) * 100) : 0;
  const pC = total > 0 ? 100 - pD - pI - pS : 0;

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("disc");
      if (!result.error) setSaved(true);
    });
  }

  function handleSaveResult() {
    startTransition(async () => {
      await saveDISCResult(resultKey, { D: pD, I: pI, S: pS, C: pC });
      setResultSaved(true);
    });
  }

  // Progress bar color cycling: D→I→S→C (6 questions per color)
  const getProgressBarColor = (questionIndex: number) => {
    const colorIndex = Math.floor(questionIndex / 6);
    const colors = [
      "oklch(52% 0.20 25)",    // D-red (Q 0-5)
      "oklch(52% 0.18 80)",    // I-yellow (Q 6-11)
      "oklch(48% 0.18 145)",   // S-green (Q 12-17)
      "oklch(48% 0.18 250)",   // C-blue (Q 18-23)
    ];
    return colors[colorIndex % 4];
  };

  const primaryType = DISC_TYPES.find(t => t.key === resultKey[0]) ?? DISC_TYPES[0];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        paddingTop: "clamp(2.5rem, 4vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />

        {/* Faint background: DISC letters */}
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "clamp(-2rem, 2vw, 4rem)",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.5rem, 2vw, 1.5rem)",
          opacity: 0.04,
          pointerEvents: "none",
          userSelect: "none",
        }}>
          {["D", "I", "S", "C"].map((letter, i) => {
            const colors = [
              "oklch(52% 0.20 25)",
              "oklch(52% 0.18 80)",
              "oklch(48% 0.18 145)",
              "oklch(48% 0.18 250)",
            ];
            return (
              <span key={letter} style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "clamp(5rem, 12vw, 14rem)",
                fontWeight: 900,
                color: colors[i],
                lineHeight: 1,
              }}>
                {letter}
              </span>
            );
          })}
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Breadcrumb */}
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← {tr("Resources", "Sumber Daya", "Bibliotheek")}
          </Link>

          {/* Lang toggle */}
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.75rem" }}>
            {(["en", "id", "nl"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", padding: "0.3rem 0.7rem",
                background: lang === l ? "oklch(65% 0.15 45)" : "transparent",
                color: lang === l ? "oklch(14% 0.08 260)" : "oklch(60% 0.04 260)",
                border: "1px solid", borderColor: lang === l ? "oklch(65% 0.15 45)" : "oklch(35% 0.05 260)",
                cursor: "pointer",
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="pathway-badge" style={{ background: "oklch(65% 0.15 45 / 0.15)", color: "oklch(82% 0.08 60)", marginBottom: "1.25rem", display: "inline-flex" }}>
            {tr("Cross-Cultural Leadership", "Kepemimpinan Lintas Budaya", "Intercultureel Leiderschap")}
          </span>

          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "18ch" }}>
            {lang === "en"
              ? <>DISC<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Personality Profile.</span></>
              : lang === "nl"
              ? <>DISC<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Persoonlijkheidsprofiel.</span></>
              : <>DISC<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Profil Kepribadian.</span></>}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem" }}>
            {tr(
              "See how you lead across cultures — authentically.",
              "Lihat bagaimana Anda memimpin lintas budaya — dengan autentik.",
              "Zie hoe je authentiek leiding geeft in interculturele contexten."
            )}
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "3rem" }}>
            <button onClick={startQuiz} className="btn-primary">
              {quizState === "done"
                ? tr("Retake Assessment →", "Ulangi Assessment →", "Assessment opnieuw doen →")
                : tr("Discover Your Style →", "Temukan Gaya Anda →", "Ontdek jouw stijl →")}
            </button>
            <a href="#disc-types" className="btn-ghost" style={{ textDecoration: "none" }}>
              {tr("Explore the Styles", "Jelajahi Gaya-Gaya", "Verken de stijlen")}
            </a>
            {saved ? (
              <Link href="/dashboard" style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700,
                letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
              }}>
                ✓ {tr("In your dashboard", "Di dashboard Anda", "In je dashboard")}
              </Link>
            ) : (
              <button onClick={handleSave} disabled={isPending} style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700,
                letterSpacing: "0.06em", color: "oklch(97% 0.005 80)",
                background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)",
                border: "none", padding: "0.625rem 1.25rem",
                cursor: isPending ? "wait" : "pointer", transition: "background 0.15s",
              }}>
                {isPending
                  ? tr("Saving…", "Menyimpan…", "Opslaan…")
                  : tr("+ Add to Dashboard", "+ Tambah ke Dashboard", "+ Toevoegen aan dashboard")}
              </button>
            )}
          </div>

          {/* DISC letter badges */}
          <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 2rem)", alignItems: "center", flexWrap: "wrap" }}>
            {DISC_TYPES.map(type => (
              <a key={type.key} href={`#disc-${type.key}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                <div style={{
                  width: "clamp(2.5rem, 5vw, 3.5rem)",
                  height: "clamp(2.5rem, 5vw, 3.5rem)",
                  background: type.bg,
                  border: `2px solid ${type.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))",
                }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "clamp(1rem, 2vw, 1.5rem)", color: type.colorLight }}>
                    {type.key}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight }}>
                  {type.label[lang]}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
                {tr("A Behavioural Framework", "Kerangka Perilaku", "Een gedragskader")}
              </p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>
                {lang === "en"
                  ? <>Understanding how people<br />are wired to behave.</>
                  : lang === "nl"
                  ? <>Begrijpen hoe mensen<br />van nature gedragen.</>
                  : <>Memahami bagaimana orang<br />terkondisi untuk berperilaku.</>}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch", marginBottom: "1rem" }}>
                {tr(
                  "DISC is one of the most widely used behavioural frameworks in the world. It describes four primary styles — Dominance, Influence, Steadiness, and Conscientiousness — that shape how people communicate, make decisions, handle conflict, and respond to pressure.",
                  "DISC adalah salah satu kerangka perilaku yang paling banyak digunakan di dunia. Ini menggambarkan empat gaya utama — Dominance, Influence, Steadiness, dan Conscientiousness — yang membentuk cara orang berkomunikasi, mengambil keputusan, menangani konflik, dan merespons tekanan.",
                  "DISC is een van de meest gebruikte gedragskaders ter wereld. Het beschrijft vier primaire stijlen — Dominantie, Invloed, Standvastigheid en Consciëntieusheid — die bepalen hoe mensen communiceren, beslissingen nemen, met conflicten omgaan en reageren op druk."
                )}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
                {tr(
                  "In cross-cultural leadership, DISC becomes even more powerful. When you understand your own default style, you can adapt more intentionally to the people and cultures around you — without losing who you are.",
                  "Dalam kepemimpinan lintas budaya, DISC menjadi jauh lebih powerful. Ketika Anda memahami gaya default Anda sendiri, Anda bisa beradaptasi lebih disengaja terhadap orang-orang dan budaya di sekitar Anda — tanpa kehilangan jati diri Anda.",
                  "In intercultureel leiderschap wordt DISC nog krachtiger. Als je je eigen standaardstijl kent, kun je je bewuster aanpassen aan de mensen en culturen om je heen — zonder jezelf te verliezen."
                )}
              </p>
              <a href="#quiz-section" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
                {tr("Take the Assessment →", "Mulai Penilaian →", "Start de assessment →")}
              </a>
            </div>

            {/* Right: 2x2 summary grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "oklch(88% 0.008 80)" }}>
              {DISC_TYPES.map(type => (
                <div key={type.key} style={{
                  background: type.color,
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <div style={{
                      width: "2rem", height: "2rem",
                      background: "white",
                      border: "none",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "0.875rem", color: type.color }}>
                        {type.key}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "white" }}>
                      {type.label[lang]}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "white", fontWeight: 700, letterSpacing: "0.04em" }}>
                    {type.tagline[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DISC TYPE DETAIL SECTIONS ── */}
      <div id="disc-types">
        {DISC_TYPES.map((type) => (
          <section key={type.key} id={`disc-${type.key}`} style={{
            paddingBlock: "clamp(4rem, 7vw, 7rem)",
            background: type.bg,
            borderLeft: `4px solid ${type.color}`
          }}>
            <div className="container-wide">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(3rem, 6vw, 5rem)", alignItems: "start" }}>

                {/* Left: type identity */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    <div style={{
                      width: "4rem", height: "4rem",
                      border: `3px solid ${type.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "2rem", color: type.colorLight }}>
                        {type.key}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.2rem" }}>
                        {type.label[lang]}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: type.color, fontWeight: 600 }}>
                        {type.tagline[lang]}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(70% 0.04 260)", marginBottom: "2rem" }}>
                    {type.overview[lang]}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ padding: "1.25rem", background: "oklch(97% 0.005 80 / 0.05)", borderLeft: `3px solid ${type.color}` }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.5rem" }}>
                        {tr("Motivated by", "Termotivasi oleh", "Gemotiveerd door")}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(72% 0.04 260)" }}>
                        {type.motivation[lang]}
                      </p>
                    </div>
                    <div style={{ padding: "1.25rem", background: "oklch(97% 0.005 80 / 0.05)", borderLeft: `3px solid ${type.color}` }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.5rem" }}>
                        {tr("Fears", "Ketakutan", "Angsten")}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.6, color: "oklch(72% 0.04 260)" }}>
                        {type.fear[lang]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: strengths, blindspots, communication, cross-cultural */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                  {/* Expand/collapse toggle */}
                  <button
                    onClick={() => setExpandedType(expandedType === type.key ? null : type.key)}
                    style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: type.colorLight, background: "oklch(97% 0.005 80 / 0.06)",
                      border: `1px solid ${type.color}40`,
                      padding: "0.75rem 1.25rem", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <span>{expandedType === type.key ? tr("Hide Details ↑", "Sembunyikan ↑", "Verberg details ↑") : tr("Show Full Profile ↓", "Tampilkan Profil Lengkap ↓", "Toon volledig profiel ↓")}</span>
                  </button>

                  {/* Always visible: strengths + blindspots */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.75rem" }}>
                        {tr("Strengths", "Kekuatan", "Sterktes")}
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {type.strengths[lang].map((s, i) => (
                          <li key={i} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(72% 0.04 260)", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                            <span style={{ color: type.color, flexShrink: 0, marginTop: "0.1rem" }}>+</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.75rem" }}>
                        {tr("Blind Spots", "Titik Buta", "Blinde vlekken")}
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {type.blindspots[lang].map((s, i) => (
                          <li key={i} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(72% 0.04 260)", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                            <span style={{ color: "oklch(55% 0.12 25)", flexShrink: 0, marginTop: "0.1rem" }}>−</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Expanded: communication + cross-cultural */}
                  {expandedType === type.key && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ padding: "1.25rem 1.5rem", background: "oklch(97% 0.005 80 / 0.05)", borderTop: `2px solid ${type.color}` }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.625rem" }}>
                          {tr("How to Communicate with Them", "Cara Berkomunikasi dengan Mereka", "Hoe communiceer je met hen")}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)" }}>
                          {type.communication[lang]}
                        </p>
                      </div>
                      <div style={{ padding: "1.25rem 1.5rem", background: "oklch(97% 0.005 80 / 0.05)", borderTop: `2px solid ${type.color}` }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.colorLight, marginBottom: "0.625rem" }}>
                          {tr("Cross-Cultural Leadership Note", "Catatan Kepemimpinan Lintas Budaya", "Interculturele leiderschapsnotitie")}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(72% 0.04 260)" }}>
                          {type.crossCultural[lang]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── ASSESSMENT ── */}
      <section id="quiz-section" style={{
        paddingBlock: "clamp(4rem, 7vw, 7rem)",
        background: "oklch(97% 0.005 80)",
        position: "relative",
        borderTop: "4px solid transparent",
        backgroundImage: `linear-gradient(to right, oklch(97% 0.005 80), oklch(97% 0.005 80)), linear-gradient(90deg, oklch(52% 0.20 25) 0%, oklch(52% 0.18 80) 33%, oklch(48% 0.18 145) 66%, oklch(48% 0.18 250) 100%)`,
        backgroundClip: "padding-box, border-box",
        backgroundOrigin: "padding-box, border-box"
      }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>
            {tr("Self-Assessment", "Penilaian Diri", "Zelfreflectie")}
          </p>
          <h2 className="t-section" style={{ color: "oklch(22% 0.005 260)", marginBottom: "0.75rem" }}>
            {tr("Discover your DISC style.", "Temukan gaya DISC Anda.", "Ontdek jouw DISC-stijl.")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", marginBottom: "3rem", maxWidth: "52ch" }}>
            {tr(
              "24 questions. Choose what feels most natural — not what you think you should do. Your result shows a score breakdown across all four styles.",
              "24 pertanyaan. Pilih yang paling alami — bukan apa yang Anda pikir seharusnya Anda lakukan. Hasilnya menunjukkan skor dari keempat gaya perilaku.",
              "24 vragen. Kies wat het meest natuurlijk voelt — niet wat je denkt dat je zou moeten doen. Je resultaat toont een scoreverdeling over alle vier de stijlen."
            )}
          </p>

          <div style={{ maxWidth: "680px", background: "oklch(30% 0.12 260)", overflow: "hidden" }}>
            <div style={{ height: "3px", background: `linear-gradient(90deg, oklch(52% 0.20 25), oklch(52% 0.18 80), oklch(48% 0.18 145), oklch(48% 0.18 250))` }} />
            <div style={{ padding: "clamp(2rem, 4vw, 3.5rem)" }}>

              {quizState === "idle" && (
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                    {tr(
                      "Each scenario has four options. There are no right or wrong answers. Choose the response that feels most like you — not what you think you should do.",
                      "Setiap skenario memiliki empat pilihan. Tidak ada jawaban yang benar atau salah. Pilih respons yang paling mencerminkan diri Anda — bukan apa yang Anda pikir seharusnya Anda lakukan.",
                      "Elk scenario heeft vier opties. Er zijn geen goede of foute antwoorden. Kies het antwoord dat het meest op jou lijkt — niet wat je denkt dat je zou moeten doen."
                    )}
                  </p>
                  <button onClick={startQuiz} className="btn-primary">
                    {tr("Begin the Assessment →", "Mulai Assessment →", "Begin de assessment →")}
                  </button>
                </div>
              )}

              {quizState === "active" && (
                <div>
                  {/* Progress bar with color cycling */}
                  <div style={{ marginBottom: "2rem" }}>
                    <div style={{ height: "2px", background: "oklch(97% 0.005 80 / 0.08)", marginBottom: "0.625rem" }}>
                      <div style={{
                        height: "100%",
                        background: getProgressBarColor(currentQ),
                        width: `${((currentQ + 1) / QS.length) * 100}%`,
                        transition: "width 0.4s ease, background 0.3s ease"
                      }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: getProgressBarColor(currentQ) }}>
                      {tr("Question", "Pertanyaan", "Vraag")} {currentQ + 1} {tr("of", "dari", "van")} {QS.length}
                    </p>
                  </div>

                  {/* Question */}
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "1.0625rem", color: "oklch(97% 0.005 80)", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                    {QS[currentQ][lang]}
                  </p>

                  {/* Options */}
                  <style>{`
                    .disc-opt { background: oklch(97% 0.005 80 / 0.04); border: 1px solid oklch(97% 0.005 80 / 0.1); color: oklch(78% 0.04 260); }
                    @media (hover: hover) { .disc-opt:hover { background: oklch(97% 0.005 80 / 0.08) !important; border-color: oklch(97% 0.005 80 / 0.2) !important; color: oklch(97% 0.005 80) !important; } }
                    .disc-opt:focus-visible { outline: 2px solid oklch(65% 0.15 45); outline-offset: 2px; }
                  `}</style>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {getShuffledOptions(currentQ).map((opt, i) => (
                      <button
                        key={i}
                        className="disc-opt"
                        onClick={() => handleAnswer(opt.t as ScoreKey)}
                        style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.5,
                          padding: "1rem 1.25rem", textAlign: "left", cursor: "pointer",
                          transition: "background 0.15s, border-color 0.15s, color 0.15s",
                          display: "flex", gap: "1rem", alignItems: "flex-start",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em", color: "oklch(55% 0.008 260)", flexShrink: 0, marginTop: "0.15rem" }}>
                          {["A", "B", "C", "D"][i]}
                        </span>
                        {opt[lang]}
                      </button>
                    ))}
                  </div>

                  {/* Back button */}
                  {currentQ > 0 && (
                    <button
                      onClick={handleBack}
                      style={{
                        marginTop: "1.25rem",
                        fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: "oklch(55% 0.008 260)", background: "none",
                        border: "1px solid oklch(42% 0.008 260 / 0.5)",
                        padding: "0.625rem 1.25rem", cursor: "pointer",
                        alignSelf: "flex-start",
                      }}
                    >
                      ← {tr("Go Back", "Kembali", "Terug")}
                    </button>
                  )}
                </div>
              )}

              {quizState === "done" && (
                <div>
                  <p className="t-label" style={{ color: primaryType.colorLight, marginBottom: "1.25rem", fontSize: "0.62rem", letterSpacing: "0.14em" }}>
                    {tr("Your DISC Profile", "Profil DISC Anda", "Jouw DISC-profiel")}
                  </p>

                  {/* Identity block — type badge + name + tagline + score bars unified */}
                  <div style={{
                    borderLeft: `3px solid ${primaryType.color}`,
                    paddingLeft: "1.25rem",
                    marginBottom: "2rem",
                  }}>
                    {/* Type letter + name row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                      <div style={{
                        width: "3rem", height: "3rem", flexShrink: 0,
                        background: `${primaryType.color}18`,
                        border: `2px solid ${primaryType.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "1.5rem", color: primaryType.colorLight, lineHeight: 1 }}>
                          {resultKey[0]}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.25rem", color: "oklch(97% 0.005 80)", lineHeight: 1.15, marginBottom: "0.2rem" }}>
                          {primaryType.label[lang]}
                          {resultKey.length === 2 && (
                            <span style={{ color: primaryType.colorLight, fontSize: "0.9rem", fontWeight: 600, marginLeft: "0.5rem", opacity: 0.8 }}>
                              / {DISC_TYPES.find(t => t.key === resultKey[1])?.label[lang]}
                            </span>
                          )}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: primaryType.colorLight, fontWeight: 600, letterSpacing: "0.02em" }}>
                          {primaryType.tagline[lang]}
                        </p>
                      </div>
                    </div>

                    {/* Score bars — tighter, mobile-safe */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {[
                        { key: "D", label: "D", fullLabel: tr("Dominance", "Dominance", "Dominantie"), pct: pD, color: "oklch(52% 0.20 25)", light: "oklch(65% 0.16 25)" },
                        { key: "I", label: "I", fullLabel: tr("Influence", "Influence", "Invloed"), pct: pI, color: "oklch(52% 0.18 80)", light: "oklch(65% 0.14 80)" },
                        { key: "S", label: "S", fullLabel: tr("Steadiness", "Steadiness", "Standvastigheid"), pct: pS, color: "oklch(48% 0.18 145)", light: "oklch(62% 0.14 145)" },
                        { key: "C", label: "C", fullLabel: tr("Conscientiousness", "Conscientiousness", "Consciëntieusheid"), pct: pC, color: "oklch(48% 0.18 250)", light: "oklch(62% 0.14 250)" },
                      ].map(bar => {
                        const isPrimary = bar.key === resultKey[0];
                        return (
                          <div key={bar.key} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{
                              fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "0.65rem",
                              color: isPrimary ? bar.light : bar.color,
                              width: "0.75rem", flexShrink: 0, textAlign: "center",
                              opacity: isPrimary ? 1 : 0.7,
                            }}>
                              {bar.key}
                            </span>
                            <div style={{ flex: 1, height: isPrimary ? "7px" : "4px", background: "oklch(97% 0.005 80 / 0.07)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${bar.pct}%`, background: isPrimary ? bar.light : bar.color, opacity: isPrimary ? 1 : 0.55, transition: "width 1s ease" }} />
                            </div>
                            <span style={{
                              fontFamily: "var(--font-montserrat)", fontSize: isPrimary ? "0.85rem" : "0.75rem",
                              fontWeight: isPrimary ? 800 : 600,
                              color: isPrimary ? "oklch(92% 0.005 80)" : "oklch(58% 0.04 260)",
                              width: "2.5rem", textAlign: "right", flexShrink: 0,
                            }}>
                              {bar.pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Result profile text — personal insight moment */}
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "1rem", lineHeight: 1.75,
                    color: "oklch(82% 0.03 260)", marginBottom: "2.5rem",
                    paddingBottom: "2rem",
                    borderBottom: "1px solid oklch(97% 0.005 80 / 0.07)",
                  }}>
                    {resultText}
                  </p>

                  {/* Save to dashboard — soft, non-intrusive */}
                  <div style={{ marginBottom: "1.75rem" }}>
                    {resultSaved ? (
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(60% 0.14 145)", letterSpacing: "0.04em" }}>
                        ✓ {tr("Result saved to your dashboard", "Hasil tersimpan ke dashboard Anda", "Resultaat opgeslagen in je dashboard")}
                      </p>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(58% 0.04 260)", lineHeight: 1.5 }}>
                          {tr("Keep this result — save it to your dashboard.", "Simpan hasil ini ke dashboard Anda.", "Bewaar dit resultaat in je dashboard.")}
                        </p>
                        <button
                          onClick={handleSaveResult}
                          disabled={isPending}
                          style={{
                            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
                            letterSpacing: "0.07em", textTransform: "uppercase",
                            background: "oklch(65% 0.15 45)", color: "oklch(14% 0.08 260)",
                            border: "none", padding: "0.6rem 1.375rem", cursor: isPending ? "wait" : "pointer",
                            whiteSpace: "nowrap", flexShrink: 0,
                          }}
                        >
                          {isPending ? tr("Saving…", "Menyimpan…", "Opslaan…") : tr("Save My Result →", "Simpan Hasilku →", "Sla mijn resultaat op →")}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Retake + dashboard */}
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button onClick={retake} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(58% 0.04 260)", background: "none", border: "1px solid oklch(38% 0.008 260)", padding: "0.7rem 1.375rem", cursor: "pointer" }}>
                      {tr("Retake Assessment", "Ulangi Assessment", "Assessment opnieuw doen")}
                    </button>
                    <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>
                      {tr("Go to Dashboard →", "Ke Dashboard →", "Naar dashboard →")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {tr("Next Steps", "Langkah Selanjutnya", "Volgende stappen")}
            </p>
            <h2 className="t-section" style={{ marginBottom: "1rem" }}>
              {lang === "en"
                ? <>Explore Cross-Cultural<br />Tools.</>
                : lang === "nl"
                ? <>Ontdek interculturele<br />tools.</>
                : <>Jelajahi Tools Lintas<br />Budaya.</>}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", marginBottom: "2rem", maxWidth: "48ch" }}>
              {tr(
                "Now that you understand your DISC profile, you're ready to explore how your style shows up in cross-cultural contexts. The Crispy library offers frameworks, reflections, and tools designed for leaders like you.",
                "Sekarang Anda memahami profil DISC Anda, Anda siap untuk mengeksplorasi bagaimana gaya Anda muncul dalam konteks lintas budaya. Perpustakaan Crispy menawarkan kerangka kerja, refleksi, dan alat yang dirancang untuk pemimpin seperti Anda.",
                "Nu je je DISC-profiel begrijpt, ben je klaar om te verkennen hoe jouw stijl zich manifesteert in interculturele contexten. De Crispy-bibliotheek biedt kaders, reflecties en tools speciaal ontworpen voor leiders zoals jij."
              )}
            </p>
            <Link href="/resources" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
              {tr("Explore Cross-Cultural Tools →", "Jelajahi Cross-Cultural Tools →", "Verken Cross-Cultural Tools →")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
