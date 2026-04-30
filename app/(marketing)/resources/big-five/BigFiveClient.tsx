"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard, saveBigFiveResult } from "../actions";
import LangToggle from "@/components/LangToggle";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 50 statements (10 per trait). Field `t` = trait key.
// Rated 1–5: 1 = Strongly disagree → 5 = Strongly agree.

const QUESTIONS = [
  // Openness (O)
  {
    text: "I enjoy exploring new ideas and engaging with complex, abstract concepts.",
    text_id: "Saya senang menjelajahi ide-ide baru dan terlibat dengan konsep yang kompleks dan abstrak.",
    text_nl: "Ik verken graag nieuwe ideeën en ga de uitdaging aan van complexe, abstracte concepten.",
    t: "O",
  },
  {
    text: "I have a vivid imagination and an active inner world.",
    text_id: "Saya memiliki imajinasi yang hidup dan dunia batin yang aktif.",
    text_nl: "Ik heb een levendige verbeeldingskracht en een actief innerlijk leven.",
    t: "O",
  },
  {
    text: "I am genuinely moved by art, music, poetry, or literature.",
    text_id: "Saya benar-benar tergerak oleh seni, musik, puisi, atau sastra.",
    text_nl: "Ik word echt geraakt door kunst, muziek, poëzie of literatuur.",
    t: "O",
  },
  {
    text: "I am curious about many subjects and enjoy learning for its own sake.",
    text_id: "Saya penasaran tentang banyak hal dan menikmati belajar demi ilmu itu sendiri.",
    text_nl: "Ik ben nieuwsgierig naar veel onderwerpen en leer graag puur om het leren zelf.",
    t: "O",
  },
  {
    text: "I prefer variety and novelty to routine and predictability.",
    text_id: "Saya lebih suka variasi dan hal-hal baru daripada rutinitas dan kepastian.",
    text_nl: "Ik heb liever afwisseling en nieuwigheid dan routine en voorspelbaarheid.",
    t: "O",
  },
  {
    text: "I enjoy experimenting with new approaches rather than sticking to what works.",
    text_id: "Saya senang mencoba pendekatan baru daripada bertahan dengan yang sudah terbukti.",
    text_nl: "Ik experimenteer liever met nieuwe aanpakken dan vast te houden aan wat werkt.",
    t: "O",
  },
  {
    text: "I find it easy to think creatively and generate original ideas.",
    text_id: "Saya mudah berpikir kreatif dan menghasilkan ide-ide orisinal.",
    text_nl: "Het is makkelijk voor mij om creatief te denken en originele ideeën te bedenken.",
    t: "O",
  },
  {
    text: "I question conventional wisdom and enjoy challenging assumptions.",
    text_id: "Saya mempertanyakan kebijaksanaan konvensional dan senang menantang asumsi.",
    text_nl: "Ik stel gangbare opvattingen ter discussie en daag aannames graag uit.",
    t: "O",
  },
  {
    text: "I am drawn to cultures, perspectives, and ways of life different from my own.",
    text_id: "Saya tertarik pada budaya, perspektif, dan cara hidup yang berbeda dari milik saya.",
    text_nl: "Ik word aangetrokken door culturen, perspectieven en leefwijzen die anders zijn dan die van mij.",
    t: "O",
  },
  {
    text: "I notice beauty and meaning in everyday experiences others might overlook.",
    text_id: "Saya melihat keindahan dan makna dalam pengalaman sehari-hari yang mungkin diabaikan orang lain.",
    text_nl: "Ik zie schoonheid en betekenis in alledaagse ervaringen die anderen misschien over het hoofd zien.",
    t: "O",
  },
  // Conscientiousness (C)
  {
    text: "I am organised and keep my work, space, and commitments in order.",
    text_id: "Saya terorganisir dan menjaga pekerjaan, ruang, serta komitmen saya tetap teratur.",
    text_nl: "Ik ben georganiseerd en houd mijn werk, omgeving en afspraken op orde.",
    t: "C",
  },
  {
    text: "I complete tasks thoroughly and reliably on time.",
    text_id: "Saya menyelesaikan tugas secara menyeluruh dan dapat diandalkan tepat waktu.",
    text_nl: "Ik rond taken grondig en betrouwbaar op tijd af.",
    t: "C",
  },
  {
    text: "I set ambitious goals for myself and work persistently toward them.",
    text_id: "Saya menetapkan tujuan yang ambisius dan bekerja keras secara konsisten untuk mencapainya.",
    text_nl: "Ik stel ambitieuze doelen voor mezelf en werk er volhardend naartoe.",
    t: "C",
  },
  {
    text: "I pay close attention to detail and rarely make careless mistakes.",
    text_id: "Saya memperhatikan detail dengan seksama dan jarang membuat kesalahan ceroboh.",
    text_nl: "Ik let goed op details en maak zelden slordige fouten.",
    t: "C",
  },
  {
    text: "I am disciplined — I follow through even when motivation fades.",
    text_id: "Saya disiplin — saya tetap melanjutkan bahkan ketika motivasi menurun.",
    text_nl: "Ik ben gedisciplineerd — ik houd vol, ook als de motivatie wegzakt.",
    t: "C",
  },
  {
    text: "I think carefully and plan ahead before taking action.",
    text_id: "Saya berpikir dengan cermat dan merencanakan ke depan sebelum mengambil tindakan.",
    text_nl: "Ik denk zorgvuldig na en plan vooruit voordat ik actie onderneem.",
    t: "C",
  },
  {
    text: "People can count on me to keep my word and follow through.",
    text_id: "Orang-orang bisa mengandalkan saya untuk menepati janji dan menindaklanjutinya.",
    text_nl: "Mensen kunnen op me rekenen om mijn woord te houden en door te pakken.",
    t: "C",
  },
  {
    text: "I work hard on tasks even when they are tedious or difficult.",
    text_id: "Saya bekerja keras dalam tugas bahkan ketika membosankan atau sulit.",
    text_nl: "Ik werk hard aan taken, ook als ze saai of moeilijk zijn.",
    t: "C",
  },
  {
    text: "I hold myself to high standards and am not satisfied with mediocrity.",
    text_id: "Saya menuntut diri sendiri dengan standar tinggi dan tidak puas dengan hal yang biasa-biasa saja.",
    text_nl: "Ik stel hoge eisen aan mezelf en ben niet tevreden met middelmatigheid.",
    t: "C",
  },
  {
    text: "I tend to finish what I start, even when it is no longer exciting.",
    text_id: "Saya cenderung menyelesaikan apa yang saya mulai, bahkan ketika sudah tidak lagi menarik.",
    text_nl: "Ik maak af wat ik begin, ook als het niet meer spannend is.",
    t: "C",
  },
  // Extraversion (E)
  {
    text: "I feel energised by being around other people.",
    text_id: "Saya merasa berenergi ketika berada di sekitar orang lain.",
    text_nl: "Ik krijg energie van mensen om me heen.",
    t: "E",
  },
  {
    text: "I am talkative and find it easy to start conversations with new people.",
    text_id: "Saya suka berbicara dan mudah memulai percakapan dengan orang baru.",
    text_nl: "Ik ben praatgraag en vind het makkelijk om een gesprek te beginnen met nieuwe mensen.",
    t: "E",
  },
  {
    text: "I bring energy and enthusiasm to social and group settings.",
    text_id: "Saya membawa energi dan antusiasme ke dalam lingkungan sosial dan kelompok.",
    text_nl: "Ik breng energie en enthousiasme mee in sociale en groepssituaties.",
    t: "E",
  },
  {
    text: "I am assertive and comfortable taking charge in groups.",
    text_id: "Saya asertif dan nyaman mengambil peran pemimpin dalam kelompok.",
    text_nl: "Ik ben assertief en voel me op mijn gemak als ik de leiding neem in groepen.",
    t: "E",
  },
  {
    text: "I actively seek out social gatherings and enjoy meeting new people.",
    text_id: "Saya secara aktif mencari pertemuan sosial dan menikmati bertemu orang baru.",
    text_nl: "Ik zoek actief sociale bijeenkomsten op en vind het leuk om nieuwe mensen te ontmoeten.",
    t: "E",
  },
  {
    text: "I express my emotions openly and come across as warm and positive.",
    text_id: "Saya mengekspresikan emosi secara terbuka dan terlihat hangat dan positif.",
    text_nl: "Ik uit mijn emoties openlijk en kom warm en positief over.",
    t: "E",
  },
  {
    text: "I prefer working with others over working alone.",
    text_id: "Saya lebih suka bekerja bersama orang lain daripada bekerja sendiri.",
    text_nl: "Ik werk liever samen met anderen dan alleen.",
    t: "E",
  },
  {
    text: "I feel confident and at ease in most social situations.",
    text_id: "Saya merasa percaya diri dan nyaman dalam sebagian besar situasi sosial.",
    text_nl: "Ik voel me zelfverzekerd en op mijn gemak in de meeste sociale situaties.",
    t: "E",
  },
  {
    text: "I enjoy being the centre of attention in the right setting.",
    text_id: "Saya menikmati menjadi pusat perhatian dalam situasi yang tepat.",
    text_nl: "Ik vind het fijn om het middelpunt van de aandacht te zijn in de juiste situatie.",
    t: "E",
  },
  {
    text: "I find that conversation and collaboration sharpen my thinking.",
    text_id: "Saya menemukan bahwa percakapan dan kolaborasi mempertajam pemikiran saya.",
    text_nl: "Ik merk dat gesprek en samenwerking mijn denken scherper maken.",
    t: "E",
  },
  // Agreeableness (A)
  {
    text: "I genuinely care about others' wellbeing and try to help when I can.",
    text_id: "Saya benar-benar peduli dengan kesejahteraan orang lain dan berusaha membantu bila mampu.",
    text_nl: "Ik geef echt om het welzijn van anderen en probeer te helpen waar ik kan.",
    t: "A",
  },
  {
    text: "I trust others and generally assume they have good intentions.",
    text_id: "Saya mempercayai orang lain dan umumnya menganggap mereka memiliki niat baik.",
    text_nl: "Ik vertrouw anderen en ga er doorgaans van uit dat ze goede bedoelingen hebben.",
    t: "A",
  },
  {
    text: "I find it relatively easy to forgive people who have hurt me.",
    text_id: "Saya merasa relatif mudah untuk memaafkan orang yang telah menyakiti saya.",
    text_nl: "Ik vergeet mensen die mij pijn hebben gedaan vrij gemakkelijk.",
    t: "A",
  },
  {
    text: "I prefer to find common ground rather than win an argument.",
    text_id: "Saya lebih suka menemukan titik temu daripada memenangkan perdebatan.",
    text_nl: "Ik zoek liever naar gemeenschappelijke grond dan dat ik een discussie wil winnen.",
    t: "A",
  },
  {
    text: "I am flexible and willing to adjust my position to accommodate others.",
    text_id: "Saya fleksibel dan bersedia menyesuaikan posisi saya untuk mengakomodasi orang lain.",
    text_nl: "Ik ben flexibel en bereid mijn standpunt aan te passen om anderen tegemoet te komen.",
    t: "A",
  },
  {
    text: "I work cooperatively and rarely let competition get in the way of relationships.",
    text_id: "Saya bekerja secara kooperatif dan jarang membiarkan persaingan menghalangi hubungan.",
    text_nl: "Ik werk graag samen en laat competitie zelden in de weg staan van relaties.",
    t: "A",
  },
  {
    text: "I feel genuine empathy for people who are struggling.",
    text_id: "Saya merasakan empati yang tulus bagi orang-orang yang sedang berjuang.",
    text_nl: "Ik voel echte empathie voor mensen die het moeilijk hebben.",
    t: "A",
  },
  {
    text: "I communicate gently and avoid being harsh, blunt, or critical.",
    text_id: "Saya berkomunikasi dengan lembut dan menghindari bersikap kasar, terus terang, atau kritis.",
    text_nl: "Ik communiceer vriendelijk en vermijd hard, bot of kritisch te zijn.",
    t: "A",
  },
  {
    text: "I am considerate of others' feelings when deciding how to say something.",
    text_id: "Saya mempertimbangkan perasaan orang lain ketika memutuskan bagaimana menyampaikan sesuatu.",
    text_nl: "Ik houd rekening met de gevoelens van anderen als ik beslis hoe ik iets zeg.",
    t: "A",
  },
  {
    text: "I am generous with my time, energy, and resources.",
    text_id: "Saya murah hati dengan waktu, energi, dan sumber daya saya.",
    text_nl: "Ik ben vrijgevig met mijn tijd, energie en middelen.",
    t: "A",
  },
  // Neuroticism (N) — higher score = more emotionally reactive
  {
    text: "I experience significant stress or anxiety in challenging situations.",
    text_id: "Saya mengalami stres atau kecemasan yang signifikan dalam situasi yang menantang.",
    text_nl: "Ik ervaar veel stress of angst in uitdagende situaties.",
    t: "N",
  },
  {
    text: "My mood changes frequently depending on what is happening around me.",
    text_id: "Suasana hati saya sering berubah tergantung pada apa yang terjadi di sekitar saya.",
    text_nl: "Mijn stemming verandert vaak afhankelijk van wat er om me heen gebeurt.",
    t: "N",
  },
  {
    text: "I tend to worry about things, even when they are likely to turn out fine.",
    text_id: "Saya cenderung khawatir tentang sesuatu, bahkan ketika kemungkinan akan baik-baik saja.",
    text_nl: "Ik neig ertoe me zorgen te maken, ook als het waarschijnlijk goed afloopt.",
    t: "N",
  },
  {
    text: "Once I become upset, it takes me a while to calm down.",
    text_id: "Setelah saya marah, butuh waktu bagi saya untuk tenang.",
    text_nl: "Als ik eenmaal van slag ben, kost het me een tijdje om te kalmeren.",
    t: "N",
  },
  {
    text: "I feel self-conscious or embarrassed more easily than most people.",
    text_id: "Saya merasa tidak nyaman atau malu lebih mudah daripada kebanyakan orang.",
    text_nl: "Ik voel me eerder onzeker of verlegen dan de meeste mensen.",
    t: "N",
  },
  {
    text: "I experience strong emotional reactions when I receive criticism or face setbacks.",
    text_id: "Saya mengalami reaksi emosional yang kuat ketika menerima kritik atau menghadapi kemunduran.",
    text_nl: "Ik reageer emotioneel sterk op kritiek of tegenslagen.",
    t: "N",
  },
  {
    text: "I sometimes feel overwhelmed by demands placed on me.",
    text_id: "Saya kadang-kadang merasa kewalahan dengan tuntutan yang dibebankan pada saya.",
    text_nl: "Ik voel me soms overweldigd door de eisen die aan me worden gesteld.",
    t: "N",
  },
  {
    text: "I find it difficult to stay calm and composed under pressure.",
    text_id: "Saya merasa sulit untuk tetap tenang dan terkendali di bawah tekanan.",
    text_nl: "Het lukt me moeilijk om kalm en beheerst te blijven onder druk.",
    t: "N",
  },
  {
    text: "I notice and feel negative emotions — worry, sadness, frustration — quite intensely.",
    text_id: "Saya merasakan emosi negatif — kekhawatiran, kesedihan, frustrasi — dengan cukup intens.",
    text_nl: "Ik merk en voel negatieve emoties — bezorgdheid, verdriet, frustratie — vrij intens.",
    t: "N",
  },
  {
    text: "I find it challenging to maintain emotional equilibrium in conflict.",
    text_id: "Saya merasa sulit untuk mempertahankan keseimbangan emosional dalam konflik.",
    text_nl: "Ik vind het moeilijk om emotioneel in evenwicht te blijven tijdens een conflict.",
    t: "N",
  },
];

// Round-robin order: O1,C1,E1,A1,N1, O2,C2,E2,A2,N2, ...
const QUESTION_ORDER = [
  0, 10, 20, 30, 40,
  1, 11, 21, 31, 41,
  2, 12, 22, 32, 42,
  3, 13, 23, 33, 43,
  4, 14, 24, 34, 44,
  5, 15, 25, 35, 45,
  6, 16, 26, 36, 46,
  7, 17, 27, 37, 47,
  8, 18, 28, 38, 48,
  9, 19, 29, 39, 49,
];

const SCALE_LABELS = {
  en: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
  id: ["Sangat tidak setuju", "Tidak setuju", "Netral", "Setuju", "Sangat setuju"],
  nl: ["Helemaal mee oneens", "Mee oneens", "Neutraal", "Mee eens", "Helemaal mee eens"],
};

// ── TRAIT DATA ────────────────────────────────────────────────────────────────

const TRAITS = [
  {
    key: "O",
    name: "Openness",
    name_id: "Keterbukaan",
    name_nl: "Openheid",
    subtitle: "Curiosity, creativity & imagination",
    subtitle_id: "Rasa ingin tahu, kreativitas & imajinasi",
    subtitle_nl: "Nieuwsgierigheid, creativiteit & verbeelding",
    color: "oklch(52% 0.22 280)",
    colorLight: "oklch(65% 0.17 280)",
    colorVeryLight: "oklch(94% 0.04 280)",
    bg: "oklch(16% 0.18 280)",
    icon: "◈",
    highLabel: "Visionary",
    highLabel_id: "Visioner",
    highLabel_nl: "Visionair",
    lowLabel: "Grounded",
    lowLabel_id: "Membumi",
    lowLabel_nl: "Nuchter",
    overview: "Openness reflects your appetite for ideas, experiences, and imagination. High scorers are curious, creative, and drawn to novelty — they thrive in ambiguous, complex environments and bring imaginative thinking to problems. Lower scorers are practical, grounded, and focused — they build reliable systems and deliver consistent results in familiar territory.",
    overview_id: "Keterbukaan mencerminkan selera Anda terhadap ide, pengalaman, dan imajinasi. Mereka yang mendapat skor tinggi penuh rasa ingin tahu, kreatif, dan tertarik pada hal-hal baru — mereka berkembang dalam lingkungan yang ambigu dan kompleks serta membawa pemikiran imajinatif dalam memecahkan masalah. Mereka yang mendapat skor lebih rendah bersifat praktis, membumi, dan fokus — mereka membangun sistem yang andal dan menghasilkan hasil konsisten di wilayah yang familiar.",
    overview_nl: "Openheid weerspiegelt je honger naar ideeën, ervaringen en verbeelding. Hoge scorers zijn nieuwsgierig, creatief en aangetrokken door nieuwigheid — ze gedijen in ambigue, complexe omgevingen en brengen verbeeldingskracht mee bij het oplossen van problemen. Lagere scorers zijn praktisch, nuchter en gefocust — ze bouwen betrouwbare systemen en leveren consistente resultaten in vertrouwd terrein.",
    highDescription: "You bring curiosity, imagination, and a genuine appetite for complexity to your leadership. You think creatively, challenge assumptions, and see possibilities others miss. You thrive in ambiguous, rapidly changing environments and naturally push teams toward innovation.",
    highDescription_id: "Anda membawa rasa ingin tahu, imajinasi, dan hasrat nyata terhadap kompleksitas dalam kepemimpinan Anda. Anda berpikir kreatif, menantang asumsi, dan melihat kemungkinan yang dilewatkan orang lain. Anda berkembang dalam lingkungan yang ambigu dan berubah cepat, serta secara alami mendorong tim menuju inovasi.",
    highDescription_nl: "Je brengt nieuwsgierigheid, verbeelding en een echte honger naar complexiteit mee in je leiderschap. Je denkt creatief, daagt aannames uit en ziet kansen die anderen missen. Je gedijt in ambigue, snel veranderende omgevingen en duwt teams van nature richting innovatie.",
    lowDescription: "You are practical, focused, and reliable — a leader who builds solid systems and delivers consistent results. You know what works and stick with it. Your strength lies in execution, not experimentation — and teams trust you for your steady, grounded judgment.",
    lowDescription_id: "Anda praktis, fokus, dan dapat diandalkan — seorang pemimpin yang membangun sistem yang kokoh dan memberikan hasil yang konsisten. Anda tahu apa yang berhasil dan tetap berpegang padanya. Kekuatan Anda terletak pada eksekusi, bukan eksperimen — dan tim mempercayai Anda karena penilaian Anda yang stabil dan membumi.",
    lowDescription_nl: "Je bent praktisch, gefocust en betrouwbaar — een leider die solide systemen bouwt en consistente resultaten levert. Je weet wat werkt en houdt je daaraan. Je kracht ligt in uitvoering, niet in experimenteren — en teams vertrouwen op je nuchtere, stabiele oordeel.",
    leadershipHigh: "Use your creativity to inspire vision and challenge the status quo. Watch out for the tendency to leap to new ideas before current ones are fully executed. Teams need both your imagination and your grounding.",
    leadershipHigh_id: "Gunakan kreativitas Anda untuk menginspirasi visi dan menantang status quo. Waspadai kecenderungan untuk melompat ke ide baru sebelum ide yang ada benar-benar dilaksanakan. Tim membutuhkan imajinasi sekaligus keteguhan Anda.",
    leadershipHigh_nl: "Gebruik je creativiteit om visie te inspireren en de status quo uit te dagen. Let op de neiging om naar nieuwe ideeën te springen voordat de huidige volledig zijn uitgevoerd. Teams hebben zowel je verbeelding als je nuchterheid nodig.",
    leadershipLow: "Your reliability and focus on proven methods create stability. Be intentional about making room for creative input from others. Environments that demand rapid change may stretch you — build relationships with high-O collaborators.",
    leadershipLow_id: "Keandalan dan fokus Anda pada metode yang terbukti menciptakan stabilitas. Bersikaplah dengan sengaja dalam memberi ruang bagi masukan kreatif dari orang lain. Lingkungan yang menuntut perubahan cepat mungkin menantang Anda — bangun hubungan dengan rekan yang memiliki Keterbukaan tinggi.",
    leadershipLow_nl: "Je betrouwbaarheid en focus op bewezen methoden zorgen voor stabiliteit. Wees bewust in het maken van ruimte voor creatieve inbreng van anderen. Omgevingen die snelle verandering vragen kunnen je uitrekken — bouw relaties op met collaborateurs die hoog scoren op Openheid.",
    crossCultural: "In collectivist or tradition-respecting cultures, high Openness needs to be balanced with respect for what has worked. In innovation-driven cultures, lower Openness can be misread as resistance to change. In either context, frame your approach in terms of team benefit, not preference.",
    crossCultural_id: "Dalam budaya kolektivis atau yang menghormati tradisi, Keterbukaan tinggi perlu diimbangi dengan rasa hormat terhadap apa yang telah berhasil. Dalam budaya yang berorientasi inovasi, Keterbukaan rendah bisa disalahartikan sebagai penolakan terhadap perubahan. Dalam konteks apa pun, bingkai pendekatan Anda dalam hal manfaat bagi tim, bukan preferensi pribadi.",
    crossCultural_nl: "In collectivistische of traditiegerichte culturen moet hoge Openheid in balans worden gebracht met respect voor wat heeft gewerkt. In innovatiegerichte culturen kan lagere Openheid worden uitgelegd als weerstand tegen verandering. In beide contexten: presenteer je aanpak in termen van teamvoordeel, niet persoonlijke voorkeur.",
    biblicalFigure: "Abraham",
    biblicalRef: "Genesis 12:1–4",
    biblicalReflection: "Abraham left Ur for an unknown land — pure Openness. Willing to risk the new, follow vision into uncertainty, build a future he could not yet see. His shadow: vision sometimes outran wisdom. Openness is faith that can become naiveté if not tempered by counsel and patience.",
  },
  {
    key: "C",
    name: "Conscientiousness",
    name_id: "Kehati-hatian",
    name_nl: "Zorgvuldigheid",
    subtitle: "Discipline, reliability & organisation",
    subtitle_id: "Disiplin, keandalan & organisasi",
    subtitle_nl: "Discipline, betrouwbaarheid & organisatie",
    color: "oklch(50% 0.18 215)",
    colorLight: "oklch(64% 0.14 215)",
    colorVeryLight: "oklch(94% 0.03 215)",
    bg: "oklch(17% 0.14 215)",
    icon: "◉",
    highLabel: "Structured",
    highLabel_id: "Terstruktur",
    highLabel_nl: "Gestructureerd",
    lowLabel: "Flexible",
    lowLabel_id: "Fleksibel",
    lowLabel_nl: "Flexibel",
    overview: "Conscientiousness measures how organized, disciplined, and goal-directed you are. High scorers set high standards, plan carefully, and follow through with remarkable consistency — they are the people who get things done. Lower scorers are more flexible and spontaneous, often thriving in fast-moving or creative contexts where rigid planning would slow things down.",
    overview_id: "Kehati-hatian mengukur seberapa terorganisir, disiplin, dan terarah pada tujuan Anda. Mereka yang mendapat skor tinggi menetapkan standar tinggi, merencanakan dengan cermat, dan menindaklanjuti dengan konsistensi yang luar biasa — merekalah orang-orang yang menyelesaikan sesuatu. Mereka yang mendapat skor lebih rendah lebih fleksibel dan spontan, sering berkembang dalam konteks yang bergerak cepat atau kreatif di mana perencanaan yang kaku akan memperlambat segalanya.",
    overview_nl: "Zorgvuldigheid meet hoe georganiseerd, gedisciplineerd en doelgericht je bent. Hoge scorers stellen hoge eisen, plannen zorgvuldig en volgen door met opmerkelijke consistentie — het zijn de mensen die dingen gedaan krijgen. Lagere scorers zijn flexibeler en spontaner, en gedijen vaak in snelbewegende of creatieve contexten waar rigide planning de boel vertraagt.",
    highDescription: "You are organised, disciplined, and dependable — one of the most reliable predictors of leadership effectiveness. You set high standards, plan carefully, and follow through. Teams trust you because you consistently deliver. Your greatest challenge is extending grace to others who work differently.",
    highDescription_id: "Anda terorganisir, disiplin, dan dapat diandalkan — salah satu prediktor efektivitas kepemimpinan yang paling andal. Anda menetapkan standar tinggi, merencanakan dengan cermat, dan menindaklanjutinya. Tim mempercayai Anda karena Anda secara konsisten memberikan hasil. Tantangan terbesar Anda adalah memberi ruang bagi orang lain yang bekerja dengan cara berbeda.",
    highDescription_nl: "Je bent georganiseerd, gedisciplineerd en betrouwbaar — een van de sterkste voorspellers van leiderschapseffectiviteit. Je stelt hoge eisen, plant zorgvuldig en pakt door. Teams vertrouwen je omdat je consistent levert. Je grootste uitdaging is het tonen van genade aan anderen die anders werken.",
    lowDescription: "You are flexible, adaptable, and spontaneous — able to pivot quickly when plans change. You bring a relaxed energy to high-pressure situations and rarely get paralysed by the need for perfect preparation. Your growth edge is building enough structure to support others who need clearer expectations.",
    lowDescription_id: "Anda fleksibel, mudah beradaptasi, dan spontan — mampu berputar cepat ketika rencana berubah. Anda membawa energi yang santai ke situasi bertekanan tinggi dan jarang terlumpuhkan oleh kebutuhan akan persiapan yang sempurna. Titik pertumbuhan Anda adalah membangun struktur yang cukup untuk mendukung orang lain yang membutuhkan ekspektasi yang lebih jelas.",
    lowDescription_nl: "Je bent flexibel, aanpasbaar en spontaan — in staat snel te schakelen als plannen veranderen. Je brengt een ontspannen energie mee in drukke situaties en raakt zelden verlamd door de behoefte aan perfecte voorbereiding. Je groeipunt is het opbouwen van voldoende structuur om anderen te ondersteunen die duidelijkere verwachtingen nodig hebben.",
    leadershipHigh: "Your follow-through and high standards are strengths. Watch for perfectionism that slows the team or unrealistic expectations of others. Create space for imperfect progress over perfect paralysis.",
    leadershipHigh_id: "Tindak lanjut Anda dan standar tinggi adalah kekuatan. Waspadai perfeksionisme yang memperlambat tim atau ekspektasi yang tidak realistis terhadap orang lain. Ciptakan ruang untuk kemajuan yang tidak sempurna daripada kelumpuhan yang sempurna.",
    leadershipHigh_nl: "Je doorzettingsvermogen en hoge eisen zijn sterke punten. Let op perfectionisme dat het team vertraagt of onrealistische verwachtingen van anderen. Maak ruimte voor onvolmaakte voortgang boven perfecte verlamming.",
    leadershipLow: "Your flexibility is valuable in dynamic environments. Build habits and systems that compensate for your lower preference for structure — especially when leading others who need clear expectations and reliable follow-through.",
    leadershipLow_id: "Fleksibilitas Anda sangat berharga dalam lingkungan yang dinamis. Bangun kebiasaan dan sistem yang mengkompensasi preferensi Anda yang lebih rendah terhadap struktur — terutama saat memimpin orang lain yang membutuhkan ekspektasi yang jelas dan tindak lanjut yang dapat diandalkan.",
    leadershipLow_nl: "Je flexibiliteit is waardevol in dynamische omgevingen. Bouw gewoonten en systemen op die compenseren voor je lagere voorkeur voor structuur — vooral als je anderen leidt die duidelijke verwachtingen en betrouwbare opvolging nodig hebben.",
    crossCultural: "In monochronic (time-structured) cultures, low Conscientiousness can be seen as unreliable. In polychronic cultures, high Conscientiousness can come across as rigid or controlling. The most effective leaders adapt their discipline to what their team's context requires.",
    crossCultural_id: "Dalam budaya monochronic (terstruktur oleh waktu), Kehati-hatian rendah dapat dilihat sebagai tidak dapat diandalkan. Dalam budaya polychronic, Kehati-hatian tinggi dapat terkesan kaku atau suka mengontrol. Pemimpin yang paling efektif menyesuaikan kedisiplinan mereka dengan apa yang dibutuhkan konteks tim mereka.",
    crossCultural_nl: "In monochronische (tijdgestructureerde) culturen kan lage Zorgvuldigheid worden gezien als onbetrouwbaar. In polychronische culturen kan hoge Zorgvuldigheid overkomen als rigide of controlerend. De meest effectieve leiders passen hun discipline aan op wat de context van hun team vereist.",
    biblicalFigure: "Daniel",
    biblicalRef: "Daniel 1 & 6",
    biblicalReflection: "Daniel prayed three times a day, kept his integrity in food and worship, and served three foreign reigns faithfully in the smallest detail. His shadow: discipline can lock out grace if it becomes its own measure of righteousness. Daniel offered his discipline upward as worship, not as moral leverage.",
  },
  {
    key: "E",
    name: "Extraversion",
    name_id: "Ekstraversi",
    name_nl: "Extraversie",
    subtitle: "Energy, sociability & assertiveness",
    subtitle_id: "Energi, sosiabilitas & asertivitas",
    subtitle_nl: "Energie, sociabiliteit & assertiviteit",
    color: "oklch(60% 0.20 52)",
    colorLight: "oklch(72% 0.15 52)",
    colorVeryLight: "oklch(94% 0.04 52)",
    bg: "oklch(18% 0.13 52)",
    icon: "◎",
    highLabel: "Outgoing",
    highLabel_id: "Extrovert",
    highLabel_nl: "Extravert",
    lowLabel: "Reflective",
    lowLabel_id: "Reflektif",
    lowLabel_nl: "Reflectief",
    overview: "Extraversion describes how you gain energy, engage socially, and assert yourself. High scorers draw energy from people and stimulation — they are expressive, action-oriented, and naturally visible in groups. Introverts (low scorers) draw energy from solitude and depth — they observe, reflect, and bring a thoughtful presence to teams. Neither is better; both have profound leadership strengths.",
    overview_id: "Ekstraversi menggambarkan bagaimana Anda mendapatkan energi, terlibat secara sosial, dan menegaskan diri. Mereka yang mendapat skor tinggi mendapatkan energi dari orang dan stimulasi — mereka ekspresif, berorientasi tindakan, dan secara alami terlihat dalam kelompok. Introvert (skor rendah) mendapatkan energi dari kesendirian dan kedalaman — mereka mengamati, merefleksi, dan membawa kehadiran yang penuh pemikiran bagi tim. Tidak ada yang lebih baik; keduanya memiliki kekuatan kepemimpinan yang mendalam.",
    overview_nl: "Extraversie beschrijft hoe je energie opdoet, sociaal betrokken bent en jezelf laat gelden. Hoge scorers halen energie uit mensen en stimulatie — ze zijn expressief, actiegericht en van nature zichtbaar in groepen. Introverten (lage scorers) halen energie uit eenzaamheid en diepte — ze observeren, reflecteren en brengen een doordachte aanwezigheid mee voor teams. Geen van beide is beter; beide hebben diepe leiderschapssterktes.",
    highDescription: "You draw energy from people and bring warmth, visibility, and momentum to your leadership. You are comfortable in the spotlight, expressive in communication, and naturally draw people toward a shared vision. Your challenge is creating space for quieter voices and ensuring depth matches your pace.",
    highDescription_id: "Anda mendapatkan energi dari orang lain dan membawa kehangatan, visibilitas, dan momentum dalam kepemimpinan Anda. Anda nyaman menjadi pusat perhatian, ekspresif dalam komunikasi, dan secara alami menarik orang menuju visi bersama. Tantangan Anda adalah menciptakan ruang untuk suara-suara yang lebih tenang dan memastikan kedalaman sesuai dengan kecepatan Anda.",
    highDescription_nl: "Je haalt energie uit mensen en brengt warmte, zichtbaarheid en momentum mee in je leiderschap. Je voelt je thuis in de schijnwerpers, bent expressief in communicatie en trekt mensen van nature naar een gedeelde visie. Je uitdaging is ruimte maken voor stillere stemmen en ervoor zorgen dat diepgang gelijke tred houdt met je tempo.",
    lowDescription: "You are a reflective, considered leader who listens deeply and thinks carefully before speaking. You bring calm to chaotic environments and your insights are often the most valuable in the room — when you choose to share them. Your growth edge is consistent visibility and proactive self-expression.",
    lowDescription_id: "Anda adalah pemimpin yang reflektif dan penuh pertimbangan yang mendengarkan secara mendalam dan berpikir matang sebelum berbicara. Anda membawa ketenangan ke lingkungan yang kacau dan wawasan Anda sering kali yang paling berharga di ruangan — ketika Anda memilih untuk berbagi. Titik pertumbuhan Anda adalah visibilitas yang konsisten dan ekspresi diri yang proaktif.",
    lowDescription_nl: "Je bent een reflectieve, overwogen leider die diep luistert en goed nadenkt voordat je spreekt. Je brengt rust in chaotische omgevingen en je inzichten zijn vaak de waardevolste in de kamer — als je ervoor kiest ze te delen. Je groeipunt is consistente zichtbaarheid en proactieve zelfexpressie.",
    leadershipHigh: "Your energy and visibility are genuine gifts. Invest in the discipline of listening — slowing down enough to hear what others aren't saying. Ensure your extraversion doesn't crowd out the introverts on your team.",
    leadershipHigh_id: "Energi dan visibilitas Anda adalah anugerah sejati. Investasikan dalam disiplin mendengarkan — melambat cukup untuk mendengar apa yang tidak dikatakan orang lain. Pastikan ekstraversi Anda tidak menyingkirkan para introvert di tim Anda.",
    leadershipHigh_nl: "Je energie en zichtbaarheid zijn echte gaven. Investeer in de discipline van luisteren — genoeg vertragen om te horen wat anderen niet zeggen. Zorg dat je extraversie de introverten in je team niet verdringt.",
    leadershipLow: "Your depth and thoughtfulness are enormous assets. Be intentional about making your presence felt — speak earlier in meetings, communicate your vision more often. Leadership often requires more visibility than introverts find natural.",
    leadershipLow_id: "Kedalaman dan pemikiran matang Anda adalah aset yang luar biasa. Bersikaplah dengan sengaja dalam membuat kehadiran Anda terasa — berbicaralah lebih awal dalam rapat, komunikasikan visi Anda lebih sering. Kepemimpinan sering membutuhkan visibilitas lebih dari yang dianggap alami oleh para introvert.",
    leadershipLow_nl: "Je diepgang en doordachtheid zijn enorme troeven. Wees bewust in het laten voelen van je aanwezigheid — spreek eerder in vergaderingen, communiceer je visie vaker. Leiderschap vraagt vaak meer zichtbaarheid dan introverten van nature prettig vinden.",
    crossCultural: "In collectivist or low-context cultures, extraversion is often more valued than in reflective, high-context cultures. Across all cultures, the key is adaptability — reading what the room needs and adjusting your presence accordingly.",
    crossCultural_id: "Dalam budaya kolektivis atau low-context, ekstraversi sering lebih dihargai daripada dalam budaya reflektif dan high-context. Di semua budaya, kuncinya adalah kemampuan beradaptasi — membaca apa yang dibutuhkan situasi dan menyesuaikan kehadiran Anda.",
    crossCultural_nl: "In collectivistische of lage-contextculturen wordt extraversie vaak meer gewaardeerd dan in reflectieve, hoge-contextculturen. In alle culturen is het sleutelwoord aanpassingsvermogen — lees wat de ruimte nodig heeft en pas je aanwezigheid daarop aan.",
    biblicalFigure: "Peter",
    biblicalRef: "Matthew 16; Acts 2",
    biblicalReflection: "Peter was first to speak, first to walk on water, first to deny. His Extraversion built the early church through bold initiation and visible courage. His shadow: words sometimes outran readiness. High-E leaders learn from Peter — initiation needs reflection, or it cracks under pressure.",
  },
  {
    key: "A",
    name: "Agreeableness",
    name_id: "Keramahan",
    name_nl: "Vriendelijkheid",
    subtitle: "Cooperation, trust & empathy",
    subtitle_id: "Kerja sama, kepercayaan & empati",
    subtitle_nl: "Samenwerking, vertrouwen & empathie",
    color: "oklch(52% 0.18 155)",
    colorLight: "oklch(65% 0.14 155)",
    colorVeryLight: "oklch(94% 0.03 155)",
    bg: "oklch(17% 0.12 155)",
    icon: "◐",
    highLabel: "Harmonious",
    highLabel_id: "Harmonis",
    highLabel_nl: "Harmonieus",
    lowLabel: "Direct",
    lowLabel_id: "Langsung",
    lowLabel_nl: "Direct",
    overview: "Agreeableness reflects your orientation toward cooperation, trust, and empathy. High scorers create warm, trusting environments and prioritise relationships — they are natural team-builders and peacemakers. Lower scorers are more competitive, direct, and willing to challenge — they push for results and hold high standards, even at the cost of relational comfort.",
    overview_id: "Keramahan mencerminkan orientasi Anda terhadap kerja sama, kepercayaan, dan empati. Mereka yang mendapat skor tinggi menciptakan lingkungan yang hangat dan penuh kepercayaan serta memprioritaskan hubungan — mereka adalah pembangun tim dan pembuat perdamaian yang alami. Mereka yang mendapat skor lebih rendah lebih kompetitif, langsung, dan bersedia menantang — mereka mendorong hasil dan memegang standar tinggi, bahkan dengan mengorbankan kenyamanan relasional.",
    overview_nl: "Vriendelijkheid weerspiegelt je oriëntatie op samenwerking, vertrouwen en empathie. Hoge scorers creëren warme, vertrouwde omgevingen en geven prioriteit aan relaties — ze zijn natuurlijke teambuilders en vredestichters. Lagere scorers zijn meer competitief, direct en bereid te challengen — ze dringen aan op resultaten en houden hoge eisen aan, ook ten koste van relationeel comfort.",
    highDescription: "You are warm, cooperative, and genuinely other-focused. You create environments where people feel valued and heard, and you build the relational trust that sustains long-term teams. Your growth edge is learning to hold conflict when it's needed — and to maintain your own convictions under relational pressure.",
    highDescription_id: "Anda hangat, kooperatif, dan benar-benar berfokus pada orang lain. Anda menciptakan lingkungan di mana orang merasa dihargai dan didengar, dan Anda membangun kepercayaan relasional yang mempertahankan tim jangka panjang. Titik pertumbuhan Anda adalah belajar menghadapi konflik ketika diperlukan — dan mempertahankan keyakinan Anda sendiri di bawah tekanan relasional.",
    highDescription_nl: "Je bent warm, coöperatief en oprecht op anderen gericht. Je creëert omgevingen waar mensen zich gewaardeerd en gehoord voelen, en je bouwt het relationele vertrouwen dat teams op de lange termijn draagt. Je groeipunt is leren conflict aan te gaan als dat nodig is — en je eigen overtuigingen staande te houden onder relationele druk.",
    lowDescription: "You are direct, confident, and willing to challenge. You hold high standards and aren't afraid of difficult conversations. This makes you an effective advocate and negotiator. Your growth edge is ensuring your directness builds trust rather than eroding it — especially with high-A team members.",
    lowDescription_id: "Anda langsung, percaya diri, dan bersedia menantang. Anda memegang standar tinggi dan tidak takut menghadapi percakapan sulit. Ini menjadikan Anda advokat dan negosiator yang efektif. Titik pertumbuhan Anda adalah memastikan keterusterangan Anda membangun kepercayaan, bukan mengikisnya — terutama dengan anggota tim yang memiliki Keramahan tinggi.",
    lowDescription_nl: "Je bent direct, zelfverzekerd en bereid te challengen. Je stelt hoge eisen en bent niet bang voor moeilijke gesprekken. Dit maakt je een effectieve pleitbezorger en onderhandelaar. Je groeipunt is ervoor zorgen dat je directheid vertrouwen opbouwt in plaats van afbreekt — vooral bij teamleden met hoge Vriendelijkheid.",
    leadershipHigh: "Your warmth and cooperation are powerful team-building tools. Build the habit of productive conflict — there are times when relational discomfort is the price of necessary truth. Practice holding your convictions clearly while remaining genuinely open.",
    leadershipHigh_id: "Kehangatan dan kerja sama Anda adalah alat pembangun tim yang kuat. Bangun kebiasaan konflik yang produktif — ada saat-saat ketika ketidaknyamanan relasional adalah harga dari kebenaran yang perlu disampaikan. Latih mempertahankan keyakinan Anda dengan jelas sambil tetap benar-benar terbuka.",
    leadershipHigh_nl: "Je warmte en samenwerking zijn krachtige teambuilding-tools. Bouw de gewoonte op van productief conflict — soms is relationeel ongemak de prijs van noodzakelijke waarheid. Oefen in het vasthouden van je overtuigingen terwijl je oprecht open blijft.",
    leadershipLow: "Your directness is a genuine asset — teams need leaders who will say the hard thing. Invest in the relational warmth and empathy that earns you the right to be direct. Trust is not optional; it's the ground on which directness becomes useful.",
    leadershipLow_id: "Keterusterangan Anda adalah aset nyata — tim membutuhkan pemimpin yang akan mengatakan hal yang sulit. Investasikan dalam kehangatan relasional dan empati yang memberikan Anda hak untuk bersikap langsung. Kepercayaan bukan pilihan; itu adalah fondasi di mana keterusterangan menjadi berguna.",
    leadershipLow_nl: "Je directheid is een echte troef — teams hebben leiders nodig die de harde waarheid durven te zeggen. Investeer in de relationele warmte en empathie die je het recht geeft om direct te zijn. Vertrouwen is geen optie; het is de bodem waarop directheid nuttig wordt.",
    crossCultural: "High Agreeableness aligns naturally with collectivist, face-saving cultures. Low Agreeableness is more valued in individualistic, direct cultures. In cross-cultural teams, the key is reading which form of directness is helpful and which is simply rude.",
    crossCultural_id: "Keramahan tinggi secara alami selaras dengan budaya kolektivis yang menjaga muka. Keramahan rendah lebih dihargai dalam budaya individualistis yang langsung. Dalam tim lintas budaya, kuncinya adalah membaca bentuk keterusterangan mana yang membantu dan mana yang sekadar kasar.",
    crossCultural_nl: "Hoge Vriendelijkheid sluit van nature aan bij collectivistische, gezichtbesparende culturen. Lage Vriendelijkheid wordt meer gewaardeerd in individualistische, directe culturen. In interculturele teams is het de kunst om te lezen welke vorm van directheid helpend is en welke simpelweg bot.",
    biblicalFigure: "Barnabas",
    biblicalRef: "Acts 4:36; 9:27; 15:36–39",
    biblicalReflection: "Son of Encouragement. Barnabas vouched for Saul when no one would, mentored John Mark when Paul wrote him off, and held the early team together. His shadow: Agreeableness can avoid the hard call. Warmth without truth becomes sentimentality.",
  },
  {
    key: "N",
    name: "Emotional Stability",
    name_id: "Stabilitas Emosional",
    name_nl: "Emotionele Stabiliteit",
    subtitle: "Calm under pressure & emotional resilience",
    subtitle_id: "Tenang di bawah tekanan & ketahanan emosional",
    subtitle_nl: "Rust onder druk & emotionele veerkracht",
    color: "oklch(50% 0.20 310)",
    colorLight: "oklch(63% 0.15 310)",
    colorVeryLight: "oklch(94% 0.04 310)",
    bg: "oklch(16% 0.17 310)",
    icon: "◑",
    highLabel: "Sensitive",
    highLabel_id: "Sensitif",
    highLabel_nl: "Gevoelig",
    lowLabel: "Resilient",
    lowLabel_id: "Tangguh",
    lowLabel_nl: "Veerkrachtig",
    overview: "This dimension describes your emotional reactivity and resilience. Lower scores on Neuroticism reflect high emotional stability — calm under pressure, recovering quickly from setbacks. Higher scores reflect greater emotional sensitivity — you experience stress, anxiety, and mood variability more intensely. Both ends have leadership implications: stability brings calm; sensitivity brings empathy and depth.",
    overview_id: "Dimensi ini menggambarkan reaktivitas dan ketahanan emosional Anda. Skor yang lebih rendah pada Neurotisisme mencerminkan stabilitas emosional yang tinggi — tenang di bawah tekanan, pulih dengan cepat dari kemunduran. Skor yang lebih tinggi mencerminkan sensitivitas emosional yang lebih besar — Anda mengalami stres, kecemasan, dan variabilitas suasana hati dengan lebih intens. Kedua ujungnya memiliki implikasi kepemimpinan: stabilitas membawa ketenangan; sensitivitas membawa empati dan kedalaman.",
    overview_nl: "Deze dimensie beschrijft je emotionele reactiviteit en veerkracht. Lagere scores op Neuroticisme weerspiegelen hoge emotionele stabiliteit — kalm onder druk, snel herstellen van tegenslagen. Hogere scores weerspiegelen grotere emotionele gevoeligheid — je ervaart stress, angst en stemmingswisselingen intenser. Beide uiteinden hebben leiderschapsimplicaties: stabiliteit brengt rust; gevoeligheid brengt empathie en diepte.",
    highDescription: "You are emotionally sensitive and feel things deeply — stress, anxiety, and setbacks land with real weight. This sensitivity makes you attentive and empathetic, but it can also make pressure and criticism harder to carry. Your growth edge is building practices that regulate your emotional experience before it affects your team.",
    highDescription_id: "Anda sensitif secara emosional dan merasakan sesuatu dengan mendalam — stres, kecemasan, dan kemunduran terasa dengan beban nyata. Sensitivitas ini membuat Anda perhatian dan empatik, tetapi juga bisa membuat tekanan dan kritik lebih sulit ditanggung. Titik pertumbuhan Anda adalah membangun praktik yang mengatur pengalaman emosional Anda sebelum mempengaruhi tim Anda.",
    highDescription_nl: "Je bent emotioneel gevoelig en voelt dingen diep — stress, angst en tegenslagen komen hard aan. Deze gevoeligheid maakt je attent en empatisch, maar kan druk en kritiek ook zwaarder maken om te dragen. Je groeipunt is het opbouwen van praktijken die je emotionele beleving reguleren voordat het je team beïnvloedt.",
    lowDescription: "You are emotionally stable, calm under pressure, and resilient in the face of setbacks. Teams experience you as a steady, regulated presence — especially when things are difficult. Your growth edge is staying attuned to the emotional experience of team members who are wired more sensitively.",
    lowDescription_id: "Anda stabil secara emosional, tenang di bawah tekanan, dan tangguh menghadapi kemunduran. Tim mengalami Anda sebagai kehadiran yang stabil dan terkendali — terutama ketika keadaan sulit. Titik pertumbuhan Anda adalah tetap peka terhadap pengalaman emosional anggota tim yang lebih sensitif.",
    lowDescription_nl: "Je bent emotioneel stabiel, kalm onder druk en veerkrachtig bij tegenslagen. Teams ervaren je als een stabiele, gereguleerde aanwezigheid — especially als het moeilijk wordt. Je groeipunt is afgestemd blijven op de emotionele beleving van teamleden die gevoeliger zijn aangelegd.",
    leadershipHigh: "Build strong self-care and emotional regulation practices. Name your emotions before they name you. Your sensitivity is a gift to your team's emotional culture — make sure it is expressed with awareness, not reactivity. Find a trusted confidant outside your team for processing.",
    leadershipHigh_id: "Bangun praktik perawatan diri dan pengaturan emosi yang kuat. Namai emosi Anda sebelum emosi itu menamai Anda. Sensitivitas Anda adalah anugerah bagi budaya emosional tim Anda — pastikan itu diekspresikan dengan kesadaran, bukan reaktivitas. Temukan orang kepercayaan di luar tim Anda untuk memproses pengalaman.",
    leadershipHigh_nl: "Bouw sterke zelfzorg- en emotieregulatiegewoonten op. Benoem je emoties voordat ze jou benoemen. Je gevoeligheid is een geschenk voor de emotionele cultuur van je team — zorg dat het tot uitdrukking komt met bewustzijn, niet met reactiviteit. Zoek een vertrouwde gesprekspartner buiten je team voor verwerking.",
    leadershipLow: "Your emotional stability is a genuine asset in crisis, conflict, and change. Stay curious about the emotional dynamics of your team — your natural calm can make you underestimate how much others are affected by what you take in stride.",
    leadershipLow_id: "Stabilitas emosional Anda adalah aset nyata dalam krisis, konflik, dan perubahan. Tetap penasaran tentang dinamika emosional tim Anda — ketenangan alami Anda bisa membuat Anda meremehkan seberapa besar orang lain dipengaruhi oleh apa yang Anda anggap biasa.",
    leadershipLow_nl: "Je emotionele stabiliteit is een echte troef in crisis, conflict en verandering. Blijf nieuwsgierig naar de emotionele dynamiek van je team — je natuurlijke rust kan ertoe leiden dat je onderschat hoeveel anderen worden geraakt door wat jij makkelijk opvangt.",
    crossCultural: "Emotional expression is profoundly shaped by cultural norms. In many cultures, visible emotional stability signals strength; in others, it signals coldness. High emotional sensitivity, when managed well, often reads as genuine care in relational cultures.",
    crossCultural_id: "Ekspresi emosi sangat dipengaruhi oleh norma budaya. Di banyak budaya, stabilitas emosional yang terlihat menandakan kekuatan; di budaya lain, itu menandakan dingin. Sensitivitas emosional yang tinggi, bila dikelola dengan baik, sering kali dibaca sebagai kepedulian yang tulus dalam budaya relasional.",
    crossCultural_nl: "Emotionele expressie wordt diepgaand gevormd door culturele normen. In veel culturen signaleert zichtbare emotionele stabiliteit kracht; in andere signaleert het koudheid. Hoge emotionele gevoeligheid, goed gemanaged, wordt in relationele culturen vaak gelezen als oprechte betrokkenheid.",
    biblicalFigure: "Joseph",
    biblicalRef: "Genesis 37–50",
    biblicalReflection: "Joseph was sold by his brothers, falsely accused, imprisoned, then elevated to rule Egypt. Through every reversal he kept his centre. High emotional stability is the gift that lets a leader carry weight without becoming the weight. The shadow risk: stability becomes detachment. Joseph wept openly when reunited with his brothers — stability with feeling intact.",
  },
];

// ── UI STRINGS ────────────────────────────────────────────────────────────────

const UI = {
  en: {
    langLabel: "Language",
    assessmentLabel: "Personality Assessment",
    heroTitle1: "The Big Five",
    heroTitleItalic: "OCEAN Profile",
    heroDesc: "The most scientifically validated personality framework in the world — five dimensions that predict how you lead, collaborate, adapt, and grow across every culture.",
    startBtn: "Start Assessment →",
    whatIsTitle: "What is the Big Five?",
    whatIsP1: "The Big Five — also known as the OCEAN model — emerged not from one theorist's idea but from decades of cross-cultural research. When researchers analysed which words humans use to describe each other across many languages, the same five clusters kept appearing. The Big Five is the structure of personality that the data itself produced.",
    whatIsP2: "Unlike DISC or Myers-Briggs, the Big Five does not put you in a box. You receive a unique score on each of the five traits along a continuum. Your profile is the unique shape that emerges from your five scores combined — the OCEAN pentagon that is genuinely yours.",
    whatIsP3: "It is the framework most widely used in cross-cultural leadership research, with the five traits replicating across more than fifty countries. A Javanese team member's high Conscientiousness means roughly the same thing as a Dutch team member's high Conscientiousness. This shared baseline is rare in personality psychology and unusually useful for international teams.",
    crossCulturalCaveatTitle: "Cross-Cultural Caveat",
    crossCulturalCaveat: "Big Five is the most cross-culturally validated personality framework in the world — validated in more than fifty countries. Two caveats remain. First, most validation samples are still drawn from WEIRD populations (Western, Educated, Industrialised, Rich, Democratic). Second, trait labels carry cultural weight — 'Agreeableness' reads differently in honour cultures versus consensus cultures. Read your scores as a starting point for self-awareness, not as a verdict.",
    biblicalAnchorLabel: "Biblical Reflection",
    fiveDimTitle: "The Five Dimensions",
    fiveDimSub: "Each dimension exists on a spectrum — neither end is superior. Effective leaders understand where they sit and what that means for how they lead.",
    howToTitle: "How to take this assessment",
    howToItems: [
      ["50 statements", "Rate each on a 5-point scale from Strongly Disagree to Strongly Agree."],
      ["Be honest, not aspirational", "Describe how you actually are — not how you'd like to be or think you should be."],
      ["No right answers", "Every profile has genuine strengths. This is not a pass/fail test."],
      ["Takes about 8–10 minutes", "Find a quiet moment. Rushed answers produce less accurate profiles."],
    ],
    beginBtn: "Start Assessment",
    progressLabel: (cur: number, tot: number) => `${cur} / ${tot}`,
    backBtn: "← Back",
    resultsLabel: "Your Big Five Profile",
    resultsTitle: "Your OCEAN Results",
    resultsDesc: "Your profile shows where you sit on each of the five dimensions. Remember: no score is better or worse — each position has unique leadership strengths.",
    yourFiveDim: "Your Five Dimensions",
    whatScoresMean: "What Your Scores Mean",
    leadershipEdge: "Leadership Edge",
    crossCulturalAwareness: "Cross-Cultural Awareness",
    mostDistinctive: "Most Distinctive Trait",
    saveDashboard: "Save to Dashboard",
    saving: "Saving…",
    savedDashboard: "✓ Saved to your dashboard",
    retake: "Retake Assessment",
    pctLabels: ["Low", "Moderately Low", "Moderate", "Moderately High", "High"],
  },
  id: {
    langLabel: "Bahasa",
    assessmentLabel: "Penilaian Kepribadian",
    heroTitle1: "Big Five",
    heroTitleItalic: "Profil OCEAN",
    heroDesc: "Kerangka kepribadian yang paling tervalidasi secara ilmiah di dunia — lima dimensi yang memprediksi cara Anda memimpin, berkolaborasi, beradaptasi, dan berkembang di setiap budaya.",
    startBtn: "Mulai Tes →",
    whatIsTitle: "Apa itu Big Five?",
    whatIsP1: "Big Five — juga dikenal sebagai model OCEAN — muncul bukan dari ide satu teoris, tetapi dari dekade penelitian lintas budaya. Ketika para peneliti menganalisis kata-kata yang digunakan manusia untuk mendeskripsikan satu sama lain di berbagai bahasa, lima kelompok yang sama selalu muncul. Big Five adalah struktur kepribadian yang dihasilkan oleh data itu sendiri.",
    whatIsP2: "Tidak seperti DISC atau Myers-Briggs, Big Five tidak menempatkan Anda dalam kotak. Anda menerima skor unik pada masing-masing dari lima sifat sepanjang kontinum. Profil Anda adalah bentuk unik yang muncul dari kombinasi lima skor Anda — pentagon OCEAN yang benar-benar milik Anda.",
    whatIsP3: "Ini adalah kerangka yang paling banyak digunakan dalam penelitian kepemimpinan lintas budaya, dengan lima sifat yang mereplikasi di lebih dari lima puluh negara. Artinya, Kesadaran tinggi anggota tim dari Jawa berarti hal yang kurang lebih sama dengan Kesadaran tinggi anggota tim dari Belanda.",
    crossCulturalCaveatTitle: "Catatan Lintas Budaya",
    crossCulturalCaveat: "Big Five adalah kerangka kepribadian yang paling tervalidasi secara lintas budaya di dunia — telah divalidasi di lebih dari lima puluh negara. Dua catatan tetap perlu diperhatikan. Pertama, sebagian besar sampel validasi masih berasal dari populasi WEIRD (Western, Educated, Industrialised, Rich, Democratic). Kedua, label sifat membawa bobot budaya — 'Keramahan' dibaca berbeda dalam budaya kehormatan versus budaya konsensus. Baca skor Anda sebagai titik awal kesadaran diri, bukan sebagai keputusan final.",
    biblicalAnchorLabel: "Refleksi Alkitab",
    fiveDimTitle: "Lima Dimensi",
    fiveDimSub: "Setiap dimensi ada pada spektrum — tidak ada ujung yang lebih unggul. Pemimpin yang efektif memahami di mana mereka berada dan apa artinya bagi cara mereka memimpin.",
    howToTitle: "Cara mengambil penilaian ini",
    howToItems: [
      ["50 pernyataan", "Nilai masing-masing pada skala 5 poin dari Sangat Tidak Setuju hingga Sangat Setuju."],
      ["Jujur, bukan aspirasional", "Gambarkan diri Anda yang sebenarnya — bukan bagaimana Anda ingin menjadi atau berpikir seharusnya."],
      ["Tidak ada jawaban yang benar", "Setiap profil memiliki kekuatan yang nyata. Ini bukan tes lulus/gagal."],
      ["Membutuhkan sekitar 8–10 menit", "Temukan momen yang tenang. Jawaban yang terburu-buru menghasilkan profil yang kurang akurat."],
    ],
    beginBtn: "Mulai Tes",
    progressLabel: (cur: number, tot: number) => `${cur} / ${tot}`,
    backBtn: "← Kembali",
    resultsLabel: "Profil Big Five Anda",
    resultsTitle: "Hasil OCEAN Anda",
    resultsDesc: "Profil Anda menunjukkan di mana Anda berada pada masing-masing dari lima dimensi. Ingat: tidak ada skor yang lebih baik atau lebih buruk — setiap posisi memiliki kekuatan kepemimpinan yang unik.",
    yourFiveDim: "Lima Dimensi Anda",
    whatScoresMean: "Arti Skor Anda",
    leadershipEdge: "Keunggulan Kepemimpinan",
    crossCulturalAwareness: "Kesadaran Lintas Budaya",
    mostDistinctive: "Sifat Paling Menonjol",
    saveDashboard: "Simpan ke Dashboard",
    saving: "Menyimpan…",
    savedDashboard: "✓ Tersimpan di dasbor Anda",
    retake: "Ulangi Penilaian",
    pctLabels: ["Rendah", "Cukup Rendah", "Sedang", "Cukup Tinggi", "Tinggi"],
  },
  nl: {
    langLabel: "Taal",
    assessmentLabel: "Persoonlijkheidstest",
    heroTitle1: "De Big Five",
    heroTitleItalic: "OCEAN Profiel",
    heroDesc: "Het meest wetenschappelijk gevalideerde persoonlijkheidsmodel ter wereld — vijf dimensies die voorspellen hoe je leidt, samenwerkt, je aanpast en groeit in elke cultuur.",
    startBtn: "Start de test →",
    whatIsTitle: "Wat is de Big Five?",
    whatIsP1: "De Big Five — ook bekend als het OCEAN-model — is niet voortgekomen uit het idee van één theoreticus, maar uit decennia cross-cultureel onderzoek. Toen onderzoekers analyseerden welke woorden mensen in verschillende talen gebruiken om elkaar te beschrijven, kwamen steeds dezelfde vijf clusters naar voren. De Big Five is de persoonlijkheidsstructuur die de data zelf heeft voortgebracht.",
    whatIsP2: "In tegenstelling tot DISC of Myers-Briggs stopt de Big Five je niet in een hokje. Je krijgt een unieke score op elk van de vijf eigenschappen langs een continuüm. Je profiel is de unieke vorm die ontstaat uit de combinatie van je vijf scores — de OCEAN-pentagon die echt van jou is.",
    whatIsP3: "Het is het meest gebruikte model in intercultureel leiderschapsonderzoek, waarbij de vijf eigenschappen repliceren in meer dan vijftig landen. De hoge Zorgvuldigheid van een Javaans teamlid betekent ongeveer hetzelfde als de hoge Zorgvuldigheid van een Nederlands teamlid.",
    crossCulturalCaveatTitle: "Interculturele Kanttekening",
    crossCulturalCaveat: "Big Five is het meest cross-cultureel gevalideerde persoonlijkheidsmodel ter wereld — gevalideerd in meer dan vijftig landen. Twee voorbehouden blijven gelden. Ten eerste zijn de meeste validatiesteekproeven nog steeds afkomstig uit WEIRD-populaties (Western, Educated, Industrialised, Rich, Democratic). Ten tweede dragen traitlabels cultureel gewicht — 'Vriendelijkheid' wordt anders gelezen in eer-culturen versus consensusculturen. Lees je scores als een startpunt voor zelfbewustzijn, niet als een oordeel.",
    biblicalAnchorLabel: "Bijbelse Reflectie",
    fiveDimTitle: "De Vijf Dimensies",
    fiveDimSub: "Elke dimensie bestaat op een spectrum — geen van beide uiteinden is beter. Effectieve leiders begrijpen waar ze staan en wat dat betekent voor hoe ze leiden.",
    howToTitle: "Hoe je deze test invult",
    howToItems: [
      ["50 uitspraken", "Beoordeel elke uitspraak op een 5-puntsschaal van Helemaal mee oneens tot Helemaal mee eens."],
      ["Wees eerlijk, niet ambitieus", "Beschrijf hoe je werkelijk bent — niet hoe je zou willen zijn of denkt te moeten zijn."],
      ["Geen goede antwoorden", "Elk profiel heeft echte sterke punten. Dit is geen zakken-of-slagen-test."],
      ["Duurt ongeveer 8–10 minuten", "Zoek een rustig moment. Gehaaste antwoorden leveren minder nauwkeurige profielen op."],
    ],
    beginBtn: "Begin de test",
    progressLabel: (cur: number, tot: number) => `${cur} / ${tot}`,
    backBtn: "← Terug",
    resultsLabel: "Jouw Big Five Profiel",
    resultsTitle: "Jouw OCEAN Resultaten",
    resultsDesc: "Je profiel laat zien waar je staat op elk van de vijf dimensies. Onthoud: geen score is beter of slechter — elke positie heeft unieke leiderschapssterktes.",
    yourFiveDim: "Jouw Vijf Dimensies",
    whatScoresMean: "Wat jouw scores betekenen",
    leadershipEdge: "Leiderschapsvoordeel",
    crossCulturalAwareness: "Intercultureel Bewustzijn",
    mostDistinctive: "Meest Onderscheidende Eigenschap",
    saveDashboard: "Opslaan in Dashboard",
    saving: "Opslaan…",
    savedDashboard: "✓ Opgeslagen in je dashboard",
    retake: "Test opnieuw doen",
    pctLabels: ["Laag", "Vrij laag", "Gemiddeld", "Vrij hoog", "Hoog"],
  },
};

type Lang = "en" | "id" | "nl";

// ── OCEAN RADAR SVG ───────────────────────────────────────────────────────────

function OceanRadarSVG({ pcts, size = 160, showLabels = false }: {
  pcts: { O: number; C: number; E: number; A: number; ES: number };
  size?: number;
  showLabels?: boolean;
}) {
  const cx = size / 2, cy = size / 2;
  const r = (size / 2) * 0.70;
  const TRAIT_ORDER = ["O", "C", "E", "A", "ES"] as const;
  const COLORS: Record<string, string> = {
    O: "oklch(52% 0.22 280)", C: "oklch(50% 0.18 215)", E: "oklch(60% 0.20 52)",
    A: "oklch(52% 0.18 155)", ES: "oklch(50% 0.20 310)",
  };
  function angle(i: number) { return -Math.PI / 2 + (i * 2 * Math.PI) / 5; }
  function pt(i: number, pct: number): [number, number] {
    const d = (pct / 100) * r;
    return [cx + d * Math.cos(angle(i)), cy + d * Math.sin(angle(i))];
  }
  function polyPts(pct: number) { return TRAIT_ORDER.map((_, i) => pt(i, pct).join(",")).join(" "); }
  const userPts = TRAIT_ORDER.map((t, i) => pt(i, pcts[t]));
  const userPoly = userPts.map(p => p.join(",")).join(" ");
  const labelGap = showLabels ? Math.max(16, size * 0.05) : 0;
  const labelRadius = r + labelGap;
  const dotR = Math.max(3, size * 0.009);
  const labelFontSize = Math.max(9, Math.round(size * 0.03)) + "px";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25, 50, 75, 100].map(p => (
        <polygon key={p} points={polyPts(p)} fill="none" stroke="oklch(88% 0.006 260)" strokeWidth={0.75} />
      ))}
      {TRAIT_ORDER.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="oklch(88% 0.006 260)" strokeWidth={0.75} />;
      })}
      <polygon points={userPoly} fill="oklch(52% 0.22 280 / 0.14)" stroke="oklch(52% 0.22 280)" strokeWidth={1.5} />
      {userPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={dotR} fill={COLORS[TRAIT_ORDER[i]]} />
      ))}
      {showLabels && TRAIT_ORDER.map((t, i) => {
        const ang = angle(i);
        const lx = cx + labelRadius * Math.cos(ang);
        const ly = cy + labelRadius * Math.sin(ang);
        const anchor = Math.cos(ang) > 0.2 ? "start" : Math.cos(ang) < -0.2 ? "end" : "middle";
        return (
          <text key={t} x={lx} y={ly + 4} textAnchor={anchor}
            style={{ fontFamily: "var(--font-montserrat)", fontSize: labelFontSize, fontWeight: 700, fill: COLORS[t], letterSpacing: "0.04em" }}>
            {t}
          </text>
        );
      })}
    </svg>
  );
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function calcPct(raw: number): number {
  return Math.round(((raw - 10) / 40) * 100);
}

export default function BigFiveClient({
  isSaved: isSavedProp,
  savedScores,
}: {
  isSaved: boolean;
  savedScores: Record<string, number> | null;
}) {
  const [quizState, setQuizState] = useState<QuizState>(savedScores ? "done" : "idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { O: 0, C: 0, E: 0, A: 0, N: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; value: number; trait: string }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedScores);
  const [isPending, startTransition] = useTransition();
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;

  const t = UI[lang];

  function tTrait(trait: typeof TRAITS[0], field: string): string {
    if (lang === "id") {
      const v = (trait as Record<string, unknown>)[`${field}_id`];
      if (typeof v === "string") return v;
    }
    if (lang === "nl") {
      const v = (trait as Record<string, unknown>)[`${field}_nl`];
      if (typeof v === "string") return v;
    }
    return (trait as Record<string, unknown>)[field] as string;
  }

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ O: 0, C: 0, E: 0, A: 0, N: 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(value: number) {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    setAnswerHistory(prev => [...prev, { qIdx, value, trait: q.t }]);
    setScores(prev => ({ ...prev, [q.t]: (prev[q.t] ?? 0) + value }));
    if (currentIdx + 1 < QUESTION_ORDER.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (currentIdx === 0) { setQuizState("idle"); return; }
    const last = answerHistory[answerHistory.length - 1];
    if (!last) return;
    setScores(prev => ({ ...prev, [last.trait]: (prev[last.trait] ?? 0) - last.value }));
    setAnswerHistory(prev => prev.slice(0, -1));
    setCurrentIdx(prev => prev - 1);
  }

  function handleSave() {
    startTransition(async () => {
      if (!isSaved) {
        await saveResourceToDashboard("big-five");
        setIsSaved(true);
      }
      const result = await saveBigFiveResult(scores);
      if (!result.error) setResultSaved(true);
    });
  }


  function pctLabel(pct: number): string {
    if (pct >= 75) return t.pctLabels[4];
    if (pct >= 55) return t.pctLabels[3];
    if (pct >= 45) return t.pctLabels[2];
    if (pct >= 25) return t.pctLabels[1];
    return t.pctLabels[0];
  }

  // ── IDLE STATE ──────────────────────────────────────────────────────────────
  if (quizState === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(98% 0.008 280)", fontFamily: "'Literata', Georgia, serif" }}>
        <LangToggle />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;0,7..72,500;0,7..72,600;1,7..72,400&family=Barlow:wght@400;500;600&display=swap');
          .ocean-btn { transition: all 0.18s ease; cursor: pointer; }
          .ocean-btn:hover { transform: translateY(-1px); }
          .trait-card { transition: all 0.18s ease; }
          .trait-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px oklch(52% 0.22 280 / 0.12); }
        `}</style>

        {/* Hero */}
        <div style={{ background: "oklch(22% 0.16 280)", color: "white", padding: "72px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
              {lang === "en" ? "Personal Development · Assessment" : lang === "id" ? "Pengembangan Pribadi · Penilaian" : "Persoonlijke Ontwikkeling · Beoordeling"}
            </p>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, marginBottom: 20 }}>
              {t.heroTitle1}<br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "oklch(78% 0.14 280)" }}>{t.heroTitleItalic}</em>
            </h1>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "oklch(82% 0.06 280)", maxWidth: 600 }}>
              {t.heroDesc}
            </p>
            <button
              onClick={startQuiz}
              className="ocean-btn"
              style={{ marginTop: 36, padding: "14px 36px", background: "oklch(65% 0.22 280)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: "0.02em" }}
            >
              {t.startBtn}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>

          {/* What is Big Five */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 16 }}>
              {t.whatIsTitle}
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.05 280)", marginBottom: 16 }}>
              {t.whatIsP1}
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.05 280)", marginBottom: 16 }}>
              {t.whatIsP2}
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(30% 0.05 280)" }}>
              {t.whatIsP3}
            </p>
            <div style={{ background: "oklch(94% 0.06 52)", borderLeft: "3px solid oklch(65% 0.15 52)", borderRadius: "0 8px 8px 0", padding: "16px 20px", marginTop: 20 }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: "oklch(45% 0.14 52)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{t.crossCulturalCaveatTitle}</p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, lineHeight: 1.7, color: "oklch(30% 0.08 52)", margin: 0 }}>{t.crossCulturalCaveat}</p>
            </div>
          </section>

          {/* The 5 traits */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 8 }}>
              {t.fiveDimTitle}
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "oklch(45% 0.06 280)", marginBottom: 28 }}>
              {t.fiveDimSub}
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {TRAITS.map(trait => (
                <div key={trait.key} className="trait-card" style={{ background: "white", borderRadius: 12, padding: "24px 28px", border: `1px solid ${trait.colorVeryLight}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: trait.colorVeryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: trait.color, fontSize: 22, fontWeight: 700 }}>
                      {trait.key}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 20, fontWeight: 500, color: "oklch(18% 0.10 280)" }}>{tTrait(trait, "name")}</span>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: trait.color, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{tTrait(trait, "subtitle")}</span>
                      </div>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, lineHeight: 1.65, color: "oklch(35% 0.06 280)", margin: 0 }}>{tTrait(trait, "overview")}</p>
                      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: trait.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {lang === "id" ? "Refleksi Alkitab" : lang === "nl" ? "Bijbelse Reflectie" : "Biblical Reflection"}
                        </span>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "oklch(45% 0.08 280)", fontStyle: "italic" }}>
                          {(trait as any).biblicalFigure} — {(trait as any).biblicalRef}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How to take */}
          <section style={{ background: "white", borderRadius: 16, padding: "32px 36px", border: "1px solid oklch(90% 0.05 280)" }}>
            <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 22, fontWeight: 500, color: "oklch(22% 0.16 280)", marginBottom: 16 }}>
              {t.howToTitle}
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {t.howToItems.map(([label, desc]) => (
                <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid oklch(95% 0.03 280)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(52% 0.22 280)", marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(22% 0.10 280)" }}>{label} — </span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "oklch(38% 0.06 280)" }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={startQuiz}
              className="ocean-btn"
              style={{ marginTop: 28, padding: "13px 32px", background: "oklch(22% 0.16 280)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600 }}
            >
              {t.beginBtn}
            </button>
          </section>
        </div>
      </div>
    );
  }

  // ── ACTIVE STATE ─────────────────────────────────────────────────────────────
  if (quizState === "active") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const trait = TRAITS.find(tr => tr.key === q.t)!;
    const progress = ((currentIdx) / QUESTION_ORDER.length) * 100;
    const scaleLabels = SCALE_LABELS[lang];
    const qText = lang === "id" ? q.text_id : lang === "nl" ? q.text_nl : q.text;

    return (
      <div id="quiz-section" style={{ minHeight: "100vh", background: "oklch(98% 0.008 280)", fontFamily: "'Barlow', sans-serif" }}>
        <LangToggle />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;0,7..72,500;1,7..72,400&family=Barlow:wght@400;500;600&display=swap');
          .scale-btn { transition: all 0.15s ease; cursor: pointer; border: 2px solid oklch(88% 0.04 280); background: white; border-radius: 10px; padding: 14px 8px; }
          .scale-btn:hover { border-color: var(--trait-color); background: var(--trait-vl); transform: translateY(-2px); }
        `}</style>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          {/* Progress */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "oklch(50% 0.08 280)", fontWeight: 500 }}>
                {t.progressLabel(currentIdx + 1, QUESTION_ORDER.length)}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: trait.color }}>
                  {tTrait(trait, "name")}
                </span>
              </div>
            </div>
            <div style={{ height: 4, background: "oklch(90% 0.04 280)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: trait.color, borderRadius: 4, transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ background: "white", borderRadius: 20, padding: "40px", border: "1px solid oklch(92% 0.04 280)", marginBottom: 32, minHeight: 180, display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: "'Literata', Georgia, serif", fontSize: "clamp(18px, 2.5vw, 22px)", lineHeight: 1.55, color: "oklch(18% 0.10 280)", margin: 0, fontWeight: 400 }}>
              {qText}
            </p>
          </div>

          {/* Scale */}
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 32 } as React.CSSProperties}
          >
            {scaleLabels.map((label, i) => (
              <button
                key={i}
                className="scale-btn"
                onClick={() => handleAnswer(i + 1)}
                style={{ "--trait-color": trait.color, "--trait-vl": trait.colorVeryLight, textAlign: "center", flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } as React.CSSProperties}
              >
                <span style={{ fontFamily: "'Literata', serif", fontSize: 22, fontWeight: 300, color: trait.colorLight }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "oklch(45% 0.06 280)", lineHeight: 1.3 }}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleBack}
            style={{ background: "transparent", border: "none", color: "oklch(55% 0.08 280)", fontFamily: "'Barlow', sans-serif", fontSize: 14, cursor: "pointer", padding: "8px 0" }}
          >
            {t.backBtn}
          </button>
        </div>
      </div>
    );
  }

  // ── DONE STATE ───────────────────────────────────────────────────────────────
  // Convert raw scores to percentages; invert N for "Emotional Stability"
  const pcts: Record<string, number> = {};
  TRAITS.forEach(tr => {
    const raw = scores[tr.key] ?? 10;
    pcts[tr.key] = calcPct(raw);
  });
  const stabilityPct = 100 - pcts.N;

  // Dominant trait (excluding N, use Stability)
  const ranked = TRAITS.map(tr => ({
    ...tr,
    displayPct: tr.key === "N" ? stabilityPct : pcts[tr.key],
  })).sort((a, b) => b.displayPct - a.displayPct);

  return (
    <div style={{ minHeight: "100vh", background: "oklch(98% 0.008 280)", fontFamily: "'Barlow', sans-serif" }}>
      <LangToggle />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;0,7..72,500;1,7..72,400&family=Barlow:wght@400;500;600&display=swap');
        .bar-fill { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .result-section { transition: all 0.18s ease; }
      `}</style>

      {/* Header */}
      <div style={{ background: "oklch(22% 0.16 280)", color: "white", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.resultsTitle}
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "oklch(78% 0.06 280)", lineHeight: 1.6, maxWidth: 560 }}>
            {t.resultsDesc}
          </p>
        </div>
      </div>

      {/* Pentagon profile */}
      <div style={{ background: "white", borderTop: "3px solid oklch(88% 0.006 260)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(45% 0.06 280)", margin: 0 }}>
            {lang === "id" ? "Bentuk Profil OCEAN Anda" : lang === "nl" ? "Jouw OCEAN-profielvorm" : "Your OCEAN Profile Shape"}
          </p>
          <OceanRadarSVG
            pcts={{ O: pcts.O, C: pcts.C, E: pcts.E, A: pcts.A, ES: stabilityPct }}
            size={440}
            showLabels={true}
          />
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "oklch(50% 0.06 280)", textAlign: "center", maxWidth: 380 }}>
            {lang === "id" ? "Pentagon unik Anda — bentuk yang terbentuk dari lima skor Anda" : lang === "nl" ? "Jouw unieke pentagon — de vorm van jouw vijf scores samen" : "Your unique pentagon — the shape formed by your five scores combined"}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Score bars */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 24 }}>
            {t.yourFiveDim}
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {TRAITS.map(trait => {
              const displayPct = trait.key === "N" ? stabilityPct : pcts[trait.key];
              const label = tTrait(trait, "name");
              const rawLabel = trait.key === "N"
                ? (stabilityPct >= 50 ? tTrait(trait, "lowLabel") : tTrait(trait, "highLabel"))
                : (displayPct >= 50 ? tTrait(trait, "highLabel") : tTrait(trait, "lowLabel"));
              return (
                <div key={trait.key} style={{ background: "white", borderRadius: 14, padding: "24px 28px", border: "1px solid oklch(92% 0.04 280)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: trait.colorVeryLight, display: "flex", alignItems: "center", justifyContent: "center", color: trait.color, fontSize: 14, fontWeight: 700 }}>
                        {trait.key}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 17, fontWeight: 500, color: "oklch(20% 0.10 280)" }}>{label}</div>
                        <div style={{ fontSize: 12, color: "oklch(50% 0.08 280)" }}>{tTrait(trait, "subtitle")}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 26, fontWeight: 600, color: trait.color }}>{displayPct}%</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: trait.colorLight }}>{pctLabel(displayPct)} · {rawLabel}</div>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ height: 8, background: "oklch(93% 0.03 280)", borderRadius: 8, overflow: "hidden" }}>
                    <div className="bar-fill" style={{ height: "100%", width: `${displayPct}%`, background: `linear-gradient(90deg, ${trait.colorLight}, ${trait.color})`, borderRadius: 8 }} />
                  </div>
                  {/* Low–High labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 280)" }}>{trait.key === "N" ? tTrait(trait, "highLabel") : tTrait(trait, "lowLabel")}</span>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.06 280)" }}>{trait.key === "N" ? tTrait(trait, "lowLabel") : tTrait(trait, "highLabel")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Per-trait insights */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.16 280)", marginBottom: 24 }}>
            {t.whatScoresMean}
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {TRAITS.map(trait => {
              const displayPct = trait.key === "N" ? stabilityPct : pcts[trait.key];
              const isHigh = displayPct >= 50;
              const description = isHigh
                ? (trait.key === "N" ? tTrait(trait, "lowDescription") : tTrait(trait, "highDescription"))
                : (trait.key === "N" ? tTrait(trait, "highDescription") : tTrait(trait, "lowDescription"));
              const leadership = isHigh
                ? (trait.key === "N" ? tTrait(trait, "leadershipLow") : tTrait(trait, "leadershipHigh"))
                : (trait.key === "N" ? tTrait(trait, "leadershipHigh") : tTrait(trait, "leadershipLow"));
              const crossCultural = tTrait(trait, "crossCultural");
              const label = tTrait(trait, "name");
              return (
                <div key={trait.key} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid oklch(92% 0.04 280)" }}>
                  <div style={{ padding: "20px 24px", background: trait.colorVeryLight, borderBottom: `1px solid oklch(88% 0.04 280)` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: trait.color }} />
                      <span style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 18, fontWeight: 500, color: "oklch(18% 0.12 280)" }}>{label}</span>
                      <span style={{ marginLeft: "auto", fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: trait.color }}>{displayPct}% — {pctLabel(displayPct)}</span>
                    </div>
                  </div>
                  <div style={{ padding: "24px" }}>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "oklch(28% 0.06 280)", marginBottom: 20 }}>{description}</p>
                    <div style={{ background: "oklch(97% 0.015 280)", borderRadius: 10, padding: "16px 20px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: trait.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{t.leadershipEdge}</p>
                      <p style={{ fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.06 280)", margin: 0 }}>{leadership}</p>
                    </div>
                    <div style={{ marginTop: 16, background: "oklch(97% 0.015 280)", borderRadius: 10, padding: "16px 20px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "oklch(45% 0.06 280)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{t.crossCulturalAwareness}</p>
                      <p style={{ fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.06 280)", margin: 0 }}>{crossCultural}</p>
                    </div>
                    <div style={{ marginTop: 16, background: "oklch(97% 0.02 280)", borderRadius: 10, padding: "16px 20px", borderLeft: "3px solid oklch(65% 0.06 280)" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "oklch(45% 0.06 280)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                        {t.biblicalAnchorLabel} — {(trait as any).biblicalFigure}
                      </p>
                      <p style={{ fontSize: 11, color: "oklch(55% 0.06 280)", fontStyle: "italic", marginBottom: 8 }}>
                        {(trait as any).biblicalRef}
                      </p>
                      <p style={{ fontSize: 15, lineHeight: 1.65, color: "oklch(32% 0.06 280)", margin: 0 }}>
                        {(trait as any).biblicalReflection}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Your Dominant Strength */}
        <section style={{ background: "oklch(22% 0.16 280)", borderRadius: 20, padding: "36px 40px", color: "white", marginBottom: 40 }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(70% 0.12 280)", marginBottom: 12 }}>
            {t.mostDistinctive}
          </p>
          <h2 style={{ fontFamily: "'Literata', Georgia, serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 300, marginBottom: 16, letterSpacing: "-0.01em" }}>
            {tTrait(ranked[0], "name")}
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, lineHeight: 1.7, color: "oklch(82% 0.06 280)", maxWidth: 540 }}>
            {ranked[0].displayPct >= 50
              ? (ranked[0].key === "N" ? tTrait(ranked[0], "lowDescription") : tTrait(ranked[0], "highDescription"))
              : (ranked[0].key === "N" ? tTrait(ranked[0], "highDescription") : tTrait(ranked[0], "lowDescription"))}
          </p>
        </section>

        {/* Save / Retake */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {!resultSaved && (
            <button
              onClick={handleSave}
              disabled={isPending}
              style={{ padding: "13px 28px", background: "oklch(52% 0.22 280)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? t.saving : t.saveDashboard}
            </button>
          )}
          {resultSaved && (
            <div style={{ padding: "13px 20px", background: "oklch(92% 0.05 155)", color: "oklch(35% 0.14 155)", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600 }}>
              {t.savedDashboard}
            </div>
          )}
          <button
            onClick={startQuiz}
            style={{ padding: "13px 28px", background: "white", color: "oklch(35% 0.10 280)", border: "2px solid oklch(85% 0.05 280)", borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            {t.retake}
          </button>
        </div>
      </div>
    </div>
  );
}
