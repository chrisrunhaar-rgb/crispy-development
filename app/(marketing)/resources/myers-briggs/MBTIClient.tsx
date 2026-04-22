"use client";

import { useState, useTransition } from "react";
import { saveResourceToDashboard, saveMBTIResult } from "../actions";

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
// 40 forced-choice pairs (10 per dichotomy).
// For each pair, choosing option A scores the first pole, B scores the second.
// d: "EI" | "SN" | "TF" | "JP"
// A pole: E, S, T, J respectively | B pole: I, N, F, P

const QUESTIONS: { d: string; a: { en: string; id: string; nl: string }; b: { en: string; id: string; nl: string } }[] = [
  // E / I
  { d: "EI", a: { en: "You feel energised after a lively social gathering.", id: "Kamu merasa penuh energi setelah acara sosial yang ramai.", nl: "Je voelt je energiek na een levendig sociaal samenzijn." }, b: { en: "You feel drained after a lively social gathering, even a good one.", id: "Kamu merasa lelah setelah acara sosial yang ramai, meskipun menyenangkan.", nl: "Je voelt je leeg na een levendig sociaal samenzijn, ook als het gezellig was." } },
  { d: "EI", a: { en: "You tend to think out loud — talking helps you work things out.", id: "Kamu cenderung berpikir sambil berbicara — ngobrol membantumu memproses sesuatu.", nl: "Je denkt graag hardop — praten helpt je om dingen uit te werken." }, b: { en: "You prefer to think privately first, then share once you've processed.", id: "Kamu lebih suka berpikir sendiri dulu, baru berbagi setelah memproses semuanya.", nl: "Je denkt liever eerst voor jezelf, en deelt pas als je het verwerkt hebt." } },
  { d: "EI", a: { en: "You prefer to have several projects and social commitments running simultaneously.", id: "Kamu suka menjalankan beberapa proyek dan komitmen sosial secara bersamaan.", nl: "Je houdt ervan om meerdere projecten en sociale verplichtingen tegelijk te hebben." }, b: { en: "You prefer fewer commitments with room for depth and solitude.", id: "Kamu lebih suka sedikit komitmen dengan ruang untuk kedalaman dan kesendirian.", nl: "Je geeft de voorkeur aan minder verplichtingen, met ruimte voor diepgang en rust." } },
  { d: "EI", a: { en: "In meetings, you speak up early and often.", id: "Dalam rapat, kamu bicara lebih awal dan sering.", nl: "In vergaderingen spreek je vroeg en regelmatig." }, b: { en: "In meetings, you listen carefully and speak when you have something well-formed to say.", id: "Dalam rapat, kamu mendengarkan dengan cermat dan bicara saat sudah punya sesuatu yang matang untuk disampaikan.", nl: "In vergaderingen luister je aandachtig en spreek je pas als je iets weloverwogen te zeggen hebt." } },
  { d: "EI", a: { en: "You meet new people with ease and enjoy the experience.", id: "Kamu mudah bertemu orang baru dan menikmatinya.", nl: "Je ontmoet gemakkelijk nieuwe mensen en geniet daarvan." }, b: { en: "Meeting many new people in a short time is draining for you.", id: "Bertemu banyak orang baru dalam waktu singkat membuat kamu lelah.", nl: "Veel nieuwe mensen ontmoeten in korte tijd kost je veel energie." } },
  { d: "EI", a: { en: "You feel most alive when surrounded by activity and people.", id: "Kamu merasa paling hidup saat dikelilingi aktivitas dan orang-orang.", nl: "Je voelt je het meest levendig als je omringd bent door activiteit en mensen." }, b: { en: "You feel most alive in quiet moments of reflection or deep one-on-one connection.", id: "Kamu merasa paling hidup dalam momen tenang untuk refleksi atau percakapan mendalam berdua.", nl: "Je voelt je het meest levendig in stille momenten van reflectie of een diep één-op-één gesprek." } },
  { d: "EI", a: { en: "You would rather discuss a problem with others than think through it alone.", id: "Kamu lebih suka mendiskusikan masalah bersama orang lain daripada memikirkannya sendiri.", nl: "Je bespreekt een probleem liever met anderen dan dat je er alleen over nadenkt." }, b: { en: "You would rather think through a problem alone and then consult others.", id: "Kamu lebih suka memikirkan masalah sendiri dulu, baru berkonsultasi dengan orang lain.", nl: "Je denkt liever eerst zelf na over een probleem, en overlegt daarna met anderen." } },
  { d: "EI", a: { en: "You recharge by going out and being with people.", id: "Kamu mengisi ulang energi dengan keluar dan bersama orang lain.", nl: "Je laadt op door eropuit te gaan en met mensen te zijn." }, b: { en: "You recharge by spending time at home or alone.", id: "Kamu mengisi ulang energi dengan menghabiskan waktu di rumah atau sendirian.", nl: "Je laadt op door tijd thuis of alleen door te brengen." } },
  { d: "EI", a: { en: "You have a wide circle of friends and enjoy maintaining many relationships.", id: "Kamu punya lingkaran pertemanan yang luas dan senang menjaga banyak hubungan.", nl: "Je hebt een brede vriendenkring en onderhoudt graag veel relaties." }, b: { en: "You have a small number of deep friendships you invest in fully.", id: "Kamu punya sedikit persahabatan yang dalam dan kamu investasikan sepenuhnya.", nl: "Je hebt een klein aantal diepe vriendschappen waar je volledig in investeert." } },
  { d: "EI", a: { en: "Action and engagement feel more natural than reflection and observation.", id: "Bertindak dan terlibat terasa lebih alami daripada merenung dan mengamati.", nl: "Handelen en betrokken zijn voelt natuurlijker dan reflecteren en observeren." }, b: { en: "Observation and reflection feel more natural than immediate action.", id: "Mengamati dan merenung terasa lebih alami daripada langsung bertindak.", nl: "Observeren en nadenken voelt natuurlijker dan meteen handelen." } },
  // S / N
  { d: "SN", a: { en: "You prefer dealing with concrete facts and practical details.", id: "Kamu lebih suka berurusan dengan fakta konkret dan detail praktis.", nl: "Je werkt liever met concrete feiten en praktische details." }, b: { en: "You prefer exploring patterns, meanings, and future possibilities.", id: "Kamu lebih suka menjelajahi pola, makna, dan kemungkinan masa depan.", nl: "Je verkent liever patronen, betekenissen en toekomstige mogelijkheden." } },
  { d: "SN", a: { en: "You trust experience and what you can directly observe more than theory.", id: "Kamu lebih mempercayai pengalaman dan apa yang bisa langsung kamu amati daripada teori.", nl: "Je vertrouwt ervaring en directe waarneming meer dan theorie." }, b: { en: "You trust intuition and insight even when you can't fully explain your reasoning.", id: "Kamu mempercayai intuisi dan wawasan meskipun tidak bisa sepenuhnya menjelaskan alasanmu.", nl: "Je vertrouwt op intuïtie en inzicht, ook als je je redenering niet volledig kunt uitleggen." } },
  { d: "SN", a: { en: "You focus on what is — the present situation as it actually exists.", id: "Kamu fokus pada apa yang ada — situasi saat ini sebagaimana adanya.", nl: "Je richt je op wat er is — de huidige situatie zoals die werkelijk bestaat." }, b: { en: "You focus on what could be — future possibilities and scenarios.", id: "Kamu fokus pada apa yang bisa ada — kemungkinan dan skenario masa depan.", nl: "Je richt je op wat zou kunnen zijn — toekomstige mogelijkheden en scenario's." } },
  { d: "SN", a: { en: "You prefer step-by-step instructions and clear, tested methods.", id: "Kamu lebih suka petunjuk langkah demi langkah dan metode yang jelas dan teruji.", nl: "Je geeft de voorkeur aan stap-voor-stap instructies en duidelijke, bewezen methoden." }, b: { en: "You prefer to understand principles and find your own way to apply them.", id: "Kamu lebih suka memahami prinsip dan menemukan caramu sendiri untuk menerapkannya.", nl: "Je begrijpt liever de principes en zoekt je eigen manier om die toe te passen." } },
  { d: "SN", a: { en: "You notice precise details and remember them accurately.", id: "Kamu memperhatikan detail yang tepat dan mengingatnya dengan akurat.", nl: "Je merkt precieze details op en onthoudt ze nauwkeurig." }, b: { en: "You notice patterns and connections across multiple situations.", id: "Kamu memperhatikan pola dan koneksi di berbagai situasi.", nl: "Je ziet patronen en verbanden in uiteenlopende situaties." } },
  { d: "SN", a: { en: "You are energised by working with established systems and improving what already works.", id: "Kamu bersemangat saat bekerja dengan sistem yang sudah ada dan menyempurnakan yang sudah berjalan.", nl: "Je krijgt energie van werken met bewezen systemen en het verbeteren van wat al werkt." }, b: { en: "You are energised by reimagining how things could work if you started from scratch.", id: "Kamu bersemangat saat membayangkan ulang bagaimana sesuatu bisa bekerja jika dimulai dari awal.", nl: "Je krijgt energie van opnieuw bedenken hoe dingen zouden kunnen werken als je van nul begon." } },
  { d: "SN", a: { en: "You prefer familiar approaches over untested innovations.", id: "Kamu lebih suka pendekatan yang familiar daripada inovasi yang belum teruji.", nl: "Je geeft de voorkeur aan vertrouwde aanpakken boven onbeproefde vernieuwingen." }, b: { en: "You are drawn to new ideas, experiments, and unexplored territory.", id: "Kamu tertarik pada ide-ide baru, eksperimen, dan wilayah yang belum dijelajahi.", nl: "Je wordt aangetrokken door nieuwe ideeën, experimenten en onbekend terrein." } },
  { d: "SN", a: { en: "When solving a problem, you work methodically through the known facts.", id: "Saat memecahkan masalah, kamu bekerja secara metodis melalui fakta-fakta yang diketahui.", nl: "Bij het oplossen van een probleem werk je methodisch door de bekende feiten heen." }, b: { en: "When solving a problem, you quickly generate multiple possibilities and explore them.", id: "Saat memecahkan masalah, kamu dengan cepat menghasilkan berbagai kemungkinan dan menjelajahinya.", nl: "Bij het oplossen van een probleem genereer je snel meerdere mogelijkheden en verken je die." } },
  { d: "SN", a: { en: "You prefer a world of concrete reality to one of imagination and abstraction.", id: "Kamu lebih suka dunia realitas konkret daripada imajinasi dan abstraksi.", nl: "Je geeft de voorkeur aan concrete werkelijkheid boven verbeelding en abstractie." }, b: { en: "Your imagination is rich and you often think in metaphors, symbols, and ideas.", id: "Imajinasimu kaya dan kamu sering berpikir dalam metafora, simbol, dan ide.", nl: "Je fantasie is rijk en je denkt vaak in metaforen, symbolen en ideeën." } },
  { d: "SN", a: { en: "You trust what has worked before more than what might work in theory.", id: "Kamu lebih mempercayai apa yang sudah terbukti berhasil daripada apa yang mungkin berhasil secara teori.", nl: "Je vertrouwt meer op wat eerder heeft gewerkt dan op wat in theorie zou kunnen werken." }, b: { en: "You trust creative vision and inspiration even when it hasn't been proven yet.", id: "Kamu mempercayai visi kreatif dan inspirasi meskipun belum terbukti.", nl: "Je vertrouwt op creatieve visie en inspiratie, ook als die nog niet bewezen zijn." } },
  // T / F
  { d: "TF", a: { en: "You prioritise logical consistency when making decisions.", id: "Kamu mengutamakan konsistensi logis saat membuat keputusan.", nl: "Je geeft prioriteit aan logische consistentie bij het nemen van beslissingen." }, b: { en: "You prioritise harmony and the impact on people when making decisions.", id: "Kamu mengutamakan harmoni dan dampak pada orang-orang saat membuat keputusan.", nl: "Je geeft prioriteit aan harmonie en de impact op mensen bij het nemen van beslissingen." } },
  { d: "TF", a: { en: "You believe objective truth is more important than subjective feelings.", id: "Kamu percaya kebenaran objektif lebih penting daripada perasaan subjektif.", nl: "Je vindt dat objectieve waarheid belangrijker is dan subjectieve gevoelens." }, b: { en: "You believe how people feel about a decision matters as much as whether it is correct.", id: "Kamu percaya bagaimana perasaan orang tentang sebuah keputusan sama pentingnya dengan apakah itu benar.", nl: "Je vindt dat hoe mensen zich voelen over een beslissing net zo belangrijk is als of die beslissing correct is." } },
  { d: "TF", a: { en: "You are comfortable delivering criticism when it is logically justified.", id: "Kamu nyaman menyampaikan kritik ketika itu secara logis memang tepat.", nl: "Je voelt je op je gemak bij het geven van kritiek als die logisch gerechtvaardigd is." }, b: { en: "You think carefully about how to deliver criticism so it lands with care.", id: "Kamu memikirkan dengan cermat cara menyampaikan kritik agar diterima dengan baik.", nl: "Je denkt zorgvuldig na over hoe je kritiek geeft, zodat het met begrip aankomt." } },
  { d: "TF", a: { en: "You make decisions by analysing the problem and applying consistent principles.", id: "Kamu membuat keputusan dengan menganalisis masalah dan menerapkan prinsip yang konsisten.", nl: "Je neemt beslissingen door het probleem te analyseren en consistente principes toe te passen." }, b: { en: "You make decisions by considering what feels right and what serves the people involved.", id: "Kamu membuat keputusan dengan mempertimbangkan apa yang terasa benar dan apa yang melayani orang-orang yang terlibat.", nl: "Je neemt beslissingen door te overwegen wat goed voelt en wat de betrokken mensen ten goede komt." } },
  { d: "TF", a: { en: "You find it easier to remain objective and detached when someone is emotionally upset.", id: "Kamu lebih mudah tetap objektif dan tidak terbawa emosi ketika seseorang sedang marah atau sedih.", nl: "Je kunt gemakkelijker objectief en afstandelijk blijven als iemand emotioneel overstuur is." }, b: { en: "You find yourself naturally empathising and emotionally joining people in what they're experiencing.", id: "Kamu secara alami berempati dan ikut merasakan apa yang dialami orang lain.", nl: "Je empathiseert van nature mee en sluit je emotioneel aan bij wat anderen meemaken." } },
  { d: "TF", a: { en: "Being right matters more to you than being liked in most professional situations.", id: "Dalam kebanyakan situasi profesional, menjadi benar lebih penting bagimu daripada disukai.", nl: "In de meeste professionele situaties is gelijk hebben voor jou belangrijker dan aardig gevonden worden." }, b: { en: "Maintaining positive relationships matters as much as being correct in most professional situations.", id: "Dalam kebanyakan situasi profesional, menjaga hubungan positif sama pentingnya dengan menjadi benar.", nl: "In de meeste professionele situaties is het onderhouden van goede relaties net zo belangrijk als gelijk hebben." } },
  { d: "TF", a: { en: "You tend to be sceptical and challenge ideas before accepting them.", id: "Kamu cenderung skeptis dan menantang ide-ide sebelum menerimanya.", nl: "Je bent van nature sceptisch en daagt ideeën uit voordat je ze accepteert." }, b: { en: "You tend to appreciate others' perspectives and look for merit before critiquing.", id: "Kamu cenderung menghargai perspektif orang lain dan mencari nilai positifnya sebelum mengkritik.", nl: "Je waardeert andermans perspectieven en zoekt naar de merites ervan voordat je kritiek geeft." } },
  { d: "TF", a: { en: "You are uncomfortable when decisions are made on the basis of emotions rather than facts.", id: "Kamu tidak nyaman ketika keputusan dibuat berdasarkan emosi daripada fakta.", nl: "Je voelt je ongemakkelijk als beslissingen op basis van emoties in plaats van feiten worden genomen." }, b: { en: "You are uncomfortable when decisions are made without considering their human impact.", id: "Kamu tidak nyaman ketika keputusan dibuat tanpa mempertimbangkan dampaknya pada manusia.", nl: "Je voelt je ongemakkelijk als beslissingen worden genomen zonder rekening te houden met de menselijke impact." } },
  { d: "TF", a: { en: "You value competence and effectiveness above sensitivity in a team setting.", id: "Dalam lingkungan tim, kamu menghargai kompetensi dan efektivitas di atas kepekaan.", nl: "In een teamsetting waardeer je vakbekwaamheid en effectiviteit boven gevoeligheid." }, b: { en: "You value genuine care and relational health as much as effectiveness in a team setting.", id: "Dalam lingkungan tim, kamu menghargai kepedulian tulus dan kesehatan relasional sama pentingnya dengan efektivitas.", nl: "In een teamsetting hecht je evenveel waarde aan oprechte zorg en relationele gezondheid als aan effectiviteit." } },
  { d: "TF", a: { en: "When someone comes to you with a problem, your instinct is to analyse and solve it.", id: "Ketika seseorang datang dengan masalah, instingmu adalah menganalisis dan memecahkannya.", nl: "Als iemand met een probleem naar je toe komt, is je instinct om het te analyseren en op te lossen." }, b: { en: "When someone comes to you with a problem, your instinct is to understand and empathise.", id: "Ketika seseorang datang dengan masalah, instingmu adalah memahami dan berempati.", nl: "Als iemand met een probleem naar je toe komt, is je instinct om te begrijpen en mee te voelen." } },
  // J / P
  { d: "JP", a: { en: "You like having a plan and feel unsettled when things are undefined.", id: "Kamu suka punya rencana dan merasa tidak nyaman ketika sesuatu tidak jelas.", nl: "Je houdt van een plan hebben en voelt je onrustig als dingen niet duidelijk zijn." }, b: { en: "You like keeping your options open and find firm plans premature.", id: "Kamu suka tetap membuka pilihan dan merasa rencana yang pasti terlalu dini.", nl: "Je houdt je opties liever open en vindt vaste plannen vaak te vroeg." } },
  { d: "JP", a: { en: "You feel best when you have completed your work and can rest.", id: "Kamu merasa paling baik ketika sudah menyelesaikan pekerjaan dan bisa beristirahat.", nl: "Je voelt je het best als je je werk af hebt en kunt rusten." }, b: { en: "You feel best when you have options and room to adapt.", id: "Kamu merasa paling baik ketika punya pilihan dan ruang untuk beradaptasi.", nl: "Je voelt je het best als je opties hebt en ruimte om je aan te passen." } },
  { d: "JP", a: { en: "You organise your time, workspace, and commitments carefully.", id: "Kamu mengatur waktu, ruang kerja, dan komitmenmu dengan cermat.", nl: "Je organiseert je tijd, werkruimte en verplichtingen zorgvuldig." }, b: { en: "You are comfortable with a more fluid approach to time and space.", id: "Kamu nyaman dengan pendekatan yang lebih fleksibel terhadap waktu dan ruang.", nl: "Je voelt je op je gemak met een meer vloeiende aanpak van tijd en ruimte." } },
  { d: "JP", a: { en: "Deadlines are clear guides that help you structure your work.", id: "Tenggat waktu adalah panduan yang jelas yang membantumu menyusun pekerjaan.", nl: "Deadlines zijn duidelijke richtlijnen die je helpen je werk te structureren." }, b: { en: "Deadlines are external pressure; you often produce your best work right before them.", id: "Tenggat waktu adalah tekanan eksternal; kamu sering menghasilkan pekerjaan terbaikmu tepat sebelum itu.", nl: "Deadlines zijn externe druk; je levert je beste werk vaak vlak van tevoren." } },
  { d: "JP", a: { en: "You prefer to resolve open questions and move forward rather than stay in a state of uncertainty.", id: "Kamu lebih suka menyelesaikan pertanyaan yang terbuka dan melanjutkan daripada tetap dalam ketidakpastian.", nl: "Je lost openstaande vragen liever op en gaat verder, in plaats van in onzekerheid te blijven." }, b: { en: "You prefer to gather more information before committing to a decision.", id: "Kamu lebih suka mengumpulkan lebih banyak informasi sebelum berkomitmen pada keputusan.", nl: "Je verzamelt liever meer informatie voordat je je aan een beslissing vastlegt." } },
  { d: "JP", a: { en: "You find it satisfying to complete tasks fully before moving to new ones.", id: "Kamu merasa puas menyelesaikan tugas sepenuhnya sebelum beralih ke yang baru.", nl: "Je vindt het bevredigend om taken volledig af te ronden voordat je naar nieuwe gaat." }, b: { en: "You enjoy starting new tasks and find strict completion before starting another constraining.", id: "Kamu menikmati memulai tugas baru dan merasa terbatas jika harus menyelesaikan satu dulu sebelum memulai yang lain.", nl: "Je begint graag nieuwe taken en vindt het beperkend om iets volledig af te ronden voordat je aan iets anders begint." } },
  { d: "JP", a: { en: "You like your life to be organised, structured, and predictable.", id: "Kamu suka hidupmu terorganisir, terstruktur, dan dapat diprediksi.", nl: "Je houdt van een leven dat georganiseerd, gestructureerd en voorspelbaar is." }, b: { en: "You like your life to be flexible, spontaneous, and open to new possibilities.", id: "Kamu suka hidupmu fleksibel, spontan, dan terbuka untuk kemungkinan baru.", nl: "Je houdt van een leven dat flexibel, spontaan en open voor nieuwe mogelijkheden is." } },
  { d: "JP", a: { en: "When faced with a choice, you like to decide and move on.", id: "Saat dihadapkan dengan pilihan, kamu suka memutuskan dan melanjutkan.", nl: "Als je voor een keuze staat, beslis je liever en ga je verder." }, b: { en: "When faced with a choice, you like to keep exploring before deciding.", id: "Saat dihadapkan dengan pilihan, kamu suka terus menjelajahi sebelum memutuskan.", nl: "Als je voor een keuze staat, blijf je liever verkennen voordat je beslist." } },
  { d: "JP", a: { en: "You plan ahead and dislike being caught unprepared.", id: "Kamu merencanakan ke depan dan tidak suka ketahuan tidak siap.", nl: "Je plant vooruit en hebt een hekel aan onvoorbereid worden." }, b: { en: "You adapt as you go and find over-planning unnecessary and constraining.", id: "Kamu beradaptasi seiring berjalannya waktu dan merasa perencanaan berlebihan itu tidak perlu dan membatasi.", nl: "Je past je aan terwijl je bezig bent en vindt overmatig plannen onnodig en beperkend." } },
  { d: "JP", a: { en: "You feel most productive when following a clear structure.", id: "Kamu merasa paling produktif ketika mengikuti struktur yang jelas.", nl: "Je voelt je het productiefst als je een duidelijke structuur volgt." }, b: { en: "You feel most productive when you have freedom to respond to what emerges.", id: "Kamu merasa paling produktif ketika punya kebebasan untuk merespons apa yang muncul.", nl: "Je voelt je het productiefst als je de vrijheid hebt om te reageren op wat zich aandient." } },
];

// Round-robin order
const QUESTION_ORDER: number[] = [];
const byDichotomy: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] };
QUESTIONS.forEach((q, i) => byDichotomy[q.d].push(i));
for (let r = 0; r < 10; r++) {
  for (const d of ["EI", "SN", "TF", "JP"]) {
    const idx = byDichotomy[d][r];
    if (idx !== undefined) QUESTION_ORDER.push(idx);
  }
}

// ── TYPE DATA ─────────────────────────────────────────────────────────────────

type Lang = "en" | "id" | "nl";
type LStr = Record<Lang, string>;
type LStrArr = Record<Lang, string[]>;

const MBTI_TYPES: Record<string, {
  subtitle: LStr; tagline: LStr; color: string; bg: string;
  jungian: LStr; overview: LStr; strengths: LStrArr;
  growth: LStr; communication: LStr; crossCultural: LStr;
}> = {
  INTJ: {
    subtitle: { en: "The Mastermind", id: "Sang Arsitek Agung", nl: "De Strateeg" },
    tagline: { en: "Strategic. Visionary. Relentlessly driven.", id: "Strategis. Visioner. Tanpa henti.", nl: "Strategisch. Visionair. Onvermoeibaar gedreven." },
    color: "oklch(48% 0.20 260)", bg: "oklch(16% 0.18 260)",
    jungian: { en: "Dominant Introverted Intuition — supported by Extraverted Thinking", id: "Intuisi Introvert Dominan — didukung oleh Pemikiran Ekstravert", nl: "Dominante Introverte Intuïtie — ondersteund door Extraverte Denken" },
    overview: { en: "INTJs are rare strategic minds who combine long-range vision with decisive execution. They are among the most self-determined personalities — independent, rigorous, and driven by the need to improve what exists and build something better. In leadership, they are most effective when their strategic thinking is paired with the relational intelligence that allows others to follow their vision.", id: "INTJ adalah pemikir strategis langka yang memadukan visi jangka panjang dengan eksekusi yang tegas. Mereka termasuk kepribadian yang paling mandiri — independen, ketat, dan didorong oleh kebutuhan untuk memperbaiki apa yang ada dan membangun sesuatu yang lebih baik. Dalam kepemimpinan, mereka paling efektif ketika pemikiran strategis mereka dipasangkan dengan kecerdasan relasional yang memungkinkan orang lain mengikuti visi mereka.", nl: "INTJ's zijn zeldzame strategische denkers die langetermijnvisie combineren met daadkrachtige uitvoering. Ze behoren tot de meest zelfstandige persoonlijkheden — onafhankelijk, rigoureus en gedreven door de behoefte om te verbeteren wat bestaat en iets beters te bouwen. In leiderschap zijn ze het meest effectief wanneer hun strategisch denken gecombineerd wordt met relationele intelligentie die anderen in staat stelt hun visie te volgen." },
    strengths: { en: ["Long-range strategic planning", "Independent decision-making", "High intellectual standards", "Committed to continuous improvement", "Sees systemic patterns others miss"], id: ["Perencanaan strategis jangka panjang", "Pengambilan keputusan mandiri", "Standar intelektual yang tinggi", "Berkomitmen pada perbaikan berkelanjutan", "Melihat pola sistemik yang terlewat orang lain"], nl: ["Strategische planning op lange termijn", "Onafhankelijke besluitvorming", "Hoge intellectuele standaarden", "Toegewijd aan continue verbetering", "Ziet systemische patronen die anderen missen"] },
    growth: { en: "INTJs grow by opening to feedback, building relational trust, and expressing their vision accessibly. Their greatest blind spot is underestimating the role of relationship and emotion in getting things done.", id: "INTJ berkembang dengan terbuka terhadap umpan balik, membangun kepercayaan relasional, dan mengungkapkan visi mereka secara mudah dipahami. Titik buta terbesar mereka adalah meremehkan peran hubungan dan emosi dalam menyelesaikan sesuatu.", nl: "INTJ's groeien door open te staan voor feedback, relationeel vertrouwen te bouwen en hun visie toegankelijk te verwoorden. Hun grootste blinde vlek is het onderschatten van de rol van relaties en emoties bij het realiseren van doelen." },
    communication: { en: "Be substantive and direct. Don't expect warmth-first conversation — they lead with ideas. Respect their need to think. Give them time. Their depth of analysis is an asset; don't rush them to shallow conclusions.", id: "Bersikaplah substantif dan langsung. Jangan harapkan percakapan yang hangat terlebih dahulu — mereka memimpin dengan ide. Hormati kebutuhan mereka untuk berpikir. Beri mereka waktu. Kedalaman analisis mereka adalah aset; jangan terburu-buru mendorong mereka ke kesimpulan yang dangkal.", nl: "Wees inhoudelijk en direct. Verwacht geen warme opener — ze beginnen met ideeën. Respecteer hun behoefte om na te denken. Geef ze tijd. Hun analytische diepgang is een kracht; dring ze niet tot oppervlakkige conclusies." },
    crossCultural: { en: "INTJs' directness and independence can read as arrogance in high-context or collectivist cultures. Growth edge: learning to build trust and influence through relationship, not just competence.", id: "Ketegasan dan kemandirian INTJ bisa dibaca sebagai kesombongan dalam budaya konteks-tinggi atau kolektivis. Sisi pertumbuhan: belajar membangun kepercayaan dan pengaruh melalui hubungan, bukan hanya kompetensi.", nl: "De directheid en onafhankelijkheid van INTJ's kan als arrogantie worden opgevat in hoge-context- of collectivistische culturen. Groeikant: leren vertrouwen en invloed opbouwen via relaties, niet alleen via vakbekwaamheid." },
  },
  INTP: {
    subtitle: { en: "The Architect", id: "Sang Pemikir", nl: "De Denker" },
    tagline: { en: "Analytical. Curious. Relentlessly logical.", id: "Analitis. Penasaran. Logis tanpa henti.", nl: "Analytisch. Nieuwsgierig. Onverbeterlijk logisch." },
    color: "oklch(48% 0.18 240)", bg: "oklch(16% 0.16 240)",
    jungian: { en: "Dominant Introverted Thinking — supported by Extraverted Intuition", id: "Pemikiran Introvert Dominan — didukung oleh Intuisi Ekstravert", nl: "Dominant Introvert Denken — ondersteund door Extraverte Intuïtie" },
    overview: { en: "INTPs are driven by a compulsive need to understand how things work. They are among the most rigorous analytical thinkers of all types — creative, original, and deeply logical. They are at their best when given complex problems to solve and maximum freedom to think. Their greatest challenge is translating their inner world of ideas into consistent external action.", id: "INTP didorong oleh kebutuhan kuat untuk memahami bagaimana segala sesuatu bekerja. Mereka termasuk pemikir analitis paling ketat dari semua tipe — kreatif, orisinal, dan sangat logis. Mereka terbaik saat diberi masalah kompleks untuk dipecahkan dan kebebasan maksimal untuk berpikir. Tantangan terbesar mereka adalah menerjemahkan dunia ide internal menjadi tindakan eksternal yang konsisten.", nl: "INTP's worden gedreven door een dwangmatige behoefte om te begrijpen hoe dingen werken. Ze behoren tot de meest rigoureuze analytische denkers van alle typen — creatief, origineel en diep logisch. Ze zijn op hun best bij complexe problemen en maximale denkruimte. Hun grootste uitdaging is hun innerlijke ideeënwereld vertalen naar consistente externe actie." },
    strengths: { en: ["Deep logical analysis", "Original and creative thinking", "Objective and unbiased reasoning", "Sees complexity and nuance", "Deeply curious and self-directed in learning"], id: ["Analisis logis mendalam", "Pemikiran orisinal dan kreatif", "Penalaran objektif dan tidak bias", "Melihat kompleksitas dan nuansa", "Sangat penasaran dan belajar secara mandiri"], nl: ["Diepgaande logische analyse", "Origineel en creatief denken", "Objectief en onbevooroordeeld redeneren", "Ziet complexiteit en nuance", "Diep nieuwsgierig en zelfsturend in leren"] },
    growth: { en: "INTPs grow by developing follow-through, building emotional attunement, and learning to communicate their complex thinking accessibly. Their greatest challenge is completing what they start.", id: "INTP berkembang dengan mengembangkan kemampuan menyelesaikan sesuatu, membangun kepekaan emosional, dan belajar mengkomunikasikan pemikiran kompleks mereka secara mudah dipahami. Tantangan terbesar mereka adalah menyelesaikan apa yang mereka mulai.", nl: "INTP's groeien door doorzettingsvermogen te ontwikkelen, emotionele afstemming te bouwen en hun complexe denken toegankelijk te communiceren. Hun grootste uitdaging is afmaken wat ze beginnen." },
    communication: { en: "Engage their ideas directly and rigorously. They love intellectual debate. Don't rush them to a conclusion — they are building a complete framework first. Be precise; vagueness frustrates them.", id: "Libatkan ide-ide mereka secara langsung dan ketat. Mereka suka debat intelektual. Jangan paksa mereka ke kesimpulan — mereka sedang membangun kerangka yang lengkap terlebih dahulu. Bersikaplah tepat; ketidakjelasan membuat mereka frustrasi.", nl: "Ga direct en grondig op hun ideeën in. Ze houden van intellectueel debat. Haast ze niet naar een conclusie — ze bouwen eerst een volledig raamwerk. Wees precies; vaagheid frustreert hen." },
    crossCultural: { en: "INTPs' love of debate and critique can be perceived as disrespectful in cultures where ideas and authority are closely linked. Growth edge: softening critique with relational warmth.", id: "Kecintaan INTP pada debat dan kritik bisa dianggap tidak sopan dalam budaya di mana ide dan otoritas terkait erat. Sisi pertumbuhan: melembutkan kritik dengan kehangatan relasional.", nl: "De debatvreugde en kritische aard van INTP's kan als respectloos worden ervaren in culturen waar ideeën en gezag nauw verbonden zijn. Groeikant: kritiek verzachten met relationele warmte." },
  },
  ENTJ: {
    subtitle: { en: "The Commander", id: "Sang Komandan", nl: "De Commandant" },
    tagline: { en: "Decisive. Strategic. Built to lead.", id: "Tegas. Strategis. Lahir untuk memimpin.", nl: "Daadkrachtig. Strategisch. Geboren om te leiden." },
    color: "oklch(50% 0.22 25)", bg: "oklch(17% 0.16 25)",
    jungian: { en: "Dominant Extraverted Thinking — supported by Introverted Intuition", id: "Pemikiran Ekstravert Dominan — didukung oleh Intuisi Introvert", nl: "Dominant Extravert Denken — ondersteund door Introverte Intuïtie" },
    overview: { en: "ENTJs are the natural executives of the MBTI — combining strategic vision with decisive action and commanding leadership presence. They lead confidently, set high standards, and build systems that deliver results. Their challenge is that they can drive toward their goals in ways that leave people feeling bulldozed rather than led.", id: "ENTJ adalah eksekutif alami dalam MBTI — memadukan visi strategis dengan tindakan tegas dan kehadiran kepemimpinan yang kuat. Mereka memimpin dengan percaya diri, menetapkan standar tinggi, dan membangun sistem yang memberikan hasil. Tantangan mereka adalah bahwa mereka bisa mengejar tujuan dengan cara yang membuat orang merasa digilas daripada dipimpin.", nl: "ENTJ's zijn de natuurlijke bestuurders van de MBTI — ze combineren strategische visie met daadkrachtig handelen en een gezaghebbende leiderschapsaanwezigheid. Ze leiden zelfverzekerd, stellen hoge normen en bouwen systemen die resultaten opleveren. Hun uitdaging is dat ze doelen kunnen nastreven op een manier die anderen het gevoel geeft platgereden te worden in plaats van geleid." },
    strengths: { en: ["Decisive and action-oriented leadership", "Long-range strategic planning", "Builds systems and structures that work", "Commands respect through confidence and competence", "Energises teams with visible direction"], id: ["Kepemimpinan yang tegas dan berorientasi tindakan", "Perencanaan strategis jangka panjang", "Membangun sistem dan struktur yang berfungsi", "Mendapat rasa hormat melalui kepercayaan diri dan kompetensi", "Memberi energi tim dengan arah yang jelas"], nl: ["Besluitvaardig en actiegericht leiderschap", "Strategische planning op lange termijn", "Bouwt werkende systemen en structuren", "Wint respect door zelfvertrouwen en vakbekwaamheid", "Geeft teams energie met duidelijke richting"] },
    growth: { en: "ENTJs grow by developing emotional intelligence, learning to lead through influence not authority, and slowing down enough to genuinely hear what others are experiencing.", id: "ENTJ berkembang dengan mengembangkan kecerdasan emosional, belajar memimpin melalui pengaruh bukan otoritas, dan memperlambat diri untuk benar-benar mendengar apa yang dialami orang lain.", nl: "ENTJ's groeien door emotionele intelligentie te ontwikkelen, te leren leiden door invloed in plaats van autoriteit, en genoeg te vertragen om echt te horen wat anderen meemaken." },
    communication: { en: "Be confident, direct, and prepared. Come with well-reasoned positions. Don't be vague. Express disagreement clearly — they respect honest opposition more than passive agreement.", id: "Bersikaplah percaya diri, langsung, dan siap. Datanglah dengan posisi yang dipikirkan matang. Jangan samar-samar. Ungkapkan ketidaksetujuan dengan jelas — mereka lebih menghormati oposisi jujur daripada persetujuan pasif.", nl: "Wees zelfverzekerd, direct en voorbereid. Kom met doordachte standpunten. Wees niet vaag. Spreek meningsverschil duidelijk uit — ze respecteren eerlijke tegenstand meer dan passieve instemming." },
    crossCultural: { en: "ENTJs' assertive directness can be culturally disruptive in high-context or face-saving cultures. Restraint and relational sensitivity are their most important cross-cultural skills.", id: "Ketegasan langsung ENTJ bisa mengganggu secara budaya dalam budaya konteks-tinggi atau yang menjaga muka. Menahan diri dan kepekaan relasional adalah keterampilan lintas budaya terpenting mereka.", nl: "De assertieve directheid van ENTJ's kan cultureel verstorend zijn in hoge-context- of gezichtsbewarende culturen. Terughoudendheid en relationele gevoeligheid zijn hun belangrijkste interculturele vaardigheden." },
  },
  ENTP: {
    subtitle: { en: "The Visionary", id: "Sang Visioner", nl: "De Visionair" },
    tagline: { en: "Creative. Challenging. Full of possibilities.", id: "Kreatif. Menantang. Penuh kemungkinan.", nl: "Creatief. Uitdagend. Vol mogelijkheden." },
    color: "oklch(58% 0.20 45)", bg: "oklch(18% 0.14 45)",
    jungian: { en: "Dominant Extraverted Intuition — supported by Introverted Thinking", id: "Intuisi Ekstravert Dominan — didukung oleh Pemikiran Introvert", nl: "Dominant Extraverte Intuïtie — ondersteund door Introvert Denken" },
    overview: { en: "ENTPs are idea generators and innovators who love challenging assumptions and exploring new possibilities. They are energised by debate, novelty, and the joy of complex thinking. Their gift to any team is the quality of their creative thinking and their willingness to challenge what others take for granted.", id: "ENTP adalah penghasil ide dan inovator yang suka menantang asumsi dan menjelajahi kemungkinan baru. Mereka bersemangat dengan debat, hal baru, dan kegembiraan berpikir kompleks. Hadiah mereka untuk tim mana pun adalah kualitas pemikiran kreatif mereka dan kesediaan untuk menantang apa yang orang lain anggap sudah pasti.", nl: "ENTP's zijn ideeëngeneratoren en innovators die van het uitdagen van aannames en verkennen van nieuwe mogelijkheden houden. Ze krijgen energie van debat, nieuwheid en de vreugde van complex denken. Hun gift aan elk team is de kwaliteit van hun creatieve denken en hun bereidheid te challengen wat anderen als vanzelfsprekend beschouwen." },
    strengths: { en: ["Highly generative and creative", "Comfortable challenging the status quo", "Quick, agile thinking", "Inspires others with vision and energy", "Thrives in complexity and ambiguity"], id: ["Sangat generatif dan kreatif", "Nyaman menantang status quo", "Pemikiran cepat dan lincah", "Menginspirasi orang lain dengan visi dan energi", "Berkembang dalam kompleksitas dan ambiguitas"], nl: ["Zeer generatief en creatief", "Op zijn gemak bij het uitdagen van de status quo", "Snel en wendbaar denken", "Inspireert anderen met visie en energie", "Gedijt in complexiteit en ambiguïteit"] },
    growth: { en: "ENTPs grow by developing discipline for execution, deepening emotional empathy, and learning to finish what they start. Their greatest shadow is the gap between their remarkable ideas and consistent delivery.", id: "ENTP berkembang dengan mengembangkan disiplin untuk eksekusi, memperdalam empati emosional, dan belajar menyelesaikan apa yang mereka mulai. Bayangan terbesar mereka adalah kesenjangan antara ide-ide luar biasa dan pengiriman yang konsisten.", nl: "ENTP's groeien door uitvoerdiscipline te ontwikkelen, emotionele empathie te verdiepen en te leren afmaken wat ze beginnen. Hun grootste schaduwzijde is de kloof tussen hun opmerkelijke ideeën en consistente uitvoering." },
    communication: { en: "Engage with their ideas energetically. They love debate — match their directness. Don't try to close things prematurely; they are still exploring. Bring them hard problems.", id: "Libatkan ide-ide mereka dengan penuh semangat. Mereka suka debat — sesuaikan ketegasanmu. Jangan mencoba menutup sesuatu terlalu dini; mereka masih menjelajahi. Bawa mereka masalah yang sulit.", nl: "Ga energiek op hun ideeën in. Ze houden van debat — pas je directheid aan de hunne aan. Probeer dingen niet voortijdig af te sluiten; ze zijn nog aan het verkennen. Breng ze moeilijke problemen." },
    crossCultural: { en: "ENTPs' love of challenge and debate can be jarring in cultures where ideas are linked to identity and critique feels personal. Growth edge: leading with curiosity rather than confrontation.", id: "Kecintaan ENTP pada tantangan dan debat bisa mengejutkan dalam budaya di mana ide terkait dengan identitas dan kritik terasa personal. Sisi pertumbuhan: memimpin dengan keingintahuan daripada konfrontasi.", nl: "De debatvreugde van ENTP's kan schokkend zijn in culturen waar ideeën verbonden zijn aan identiteit en kritiek persoonlijk aanvoelt. Groeikant: leiden met nieuwsgierigheid in plaats van confrontatie." },
  },
  INFJ: {
    subtitle: { en: "The Counsellor", id: "Sang Penasehat", nl: "De Raadgever" },
    tagline: { en: "Visionary. Principled. A quiet force for good.", id: "Visioner. Berprinsip. Kekuatan diam untuk kebaikan.", nl: "Visionair. Principieel. Een stille kracht voor het goede." },
    color: "oklch(48% 0.22 295)", bg: "oklch(16% 0.18 295)",
    jungian: { en: "Dominant Introverted Intuition — supported by Extraverted Feeling", id: "Intuisi Introvert Dominan — didukung oleh Perasaan Ekstravert", nl: "Dominant Introverte Intuïtie — ondersteund door Extravert Gevoel" },
    overview: { en: "INFJs are rare visionaries who combine deep convictions, rich empathy, and long-range insight. They lead through the depth of their care and the clarity of their values. They are often seen as quiet but formidable — able to read people and situations with uncanny accuracy. Their challenge is translating their rich inner world into visible, sustained action.", id: "INFJ adalah visioner langka yang memadukan keyakinan mendalam, empati yang kaya, dan wawasan jangka panjang. Mereka memimpin melalui kedalaman kepedulian dan kejelasan nilai-nilai mereka. Mereka sering dilihat sebagai orang yang tenang namun tangguh — mampu membaca orang dan situasi dengan akurasi yang luar biasa. Tantangan mereka adalah menerjemahkan dunia batin yang kaya menjadi tindakan yang terlihat dan berkelanjutan.", nl: "INFJ's zijn zeldzame visionairs die diepe overtuigingen, rijke empathie en langetermijninzicht combineren. Ze leiden door de diepte van hun zorg en de helderheid van hun waarden. Ze worden vaak gezien als stil maar formidabel — in staat mensen en situaties met opmerkelijke nauwkeurigheid te lezen. Hun uitdaging is hun rijke innerlijke wereld te vertalen naar zichtbare, aanhoudende actie." },
    strengths: { en: ["Deep insight into people and situations", "Long-range visionary thinking", "Strong personal values and integrity", "Deeply empathetic and emotionally intelligent", "Inspiring when they fully claim their voice"], id: ["Wawasan mendalam tentang orang dan situasi", "Pemikiran visioner jangka panjang", "Nilai-nilai pribadi dan integritas yang kuat", "Sangat empatik dan cerdas secara emosional", "Menginspirasi ketika mereka benar-benar mengklaim suara mereka"], nl: ["Diep inzicht in mensen en situaties", "Visionair denken op lange termijn", "Sterke persoonlijke waarden en integriteit", "Diep empathisch en emotioneel intelligent", "Inspirerend wanneer ze volledig hun stem opeisen"] },
    growth: { en: "INFJs grow by learning to share their vision clearly, set firm boundaries, and resist the pull to absorb others' emotional weight until they burn out.", id: "INFJ berkembang dengan belajar berbagi visi mereka dengan jelas, menetapkan batasan yang tegas, dan menahan dorongan untuk menyerap beban emosional orang lain hingga kelelahan.", nl: "INFJ's groeien door te leren hun visie helder te delen, duidelijke grenzen te stellen en de neiging te weerstaan andermans emotionele lasten te absorberen totdat ze opbranden." },
    communication: { en: "Be genuine, values-driven, and substantive. Shallow or transactional interaction disengages them. Give them time — they process deeply. Create space for trust to develop before expecting full disclosure.", id: "Bersikaplah tulus, didorong oleh nilai-nilai, dan substantif. Interaksi yang dangkal atau transaksional membuat mereka tidak terlibat. Beri mereka waktu — mereka memproses secara mendalam. Ciptakan ruang bagi kepercayaan untuk berkembang sebelum mengharapkan keterbukaan penuh.", nl: "Wees oprecht, gedreven door waarden en inhoudelijk. Oppervlakkige of transactionele interactie haalt hen uit verbinding. Geef ze tijd — ze verwerken diep. Creëer ruimte voor vertrouwen voordat je volledige openheid verwacht." },
    crossCultural: { en: "INFJs' depth and care translate across most cultures. Their idealism can create friction in pragmatic or hierarchical contexts where relationships are transactional. Growth edge: holding conviction while adapting approach.", id: "Kedalaman dan kepedulian INFJ diterjemahkan di sebagian besar budaya. Idealisme mereka bisa menimbulkan gesekan dalam konteks pragmatis atau hierarkis di mana hubungan bersifat transaksional. Sisi pertumbuhan: mempertahankan keyakinan sambil menyesuaikan pendekatan.", nl: "De diepgang en zorg van INFJ's vertalen zich naar de meeste culturen. Hun idealisme kan wrijving veroorzaken in pragmatische of hiërarchische contexten waar relaties transactioneel zijn. Groeikant: overtuiging vasthouden terwijl de aanpak wordt aangepast." },
  },
  INFP: {
    subtitle: { en: "The Healer", id: "Sang Penyembuh", nl: "De Idealist" },
    tagline: { en: "Idealistic. Authentic. Deeply values-driven.", id: "Idealis. Autentik. Sangat didorong nilai-nilai.", nl: "Idealistisch. Authentiek. Diep waardegericht." },
    color: "oklch(52% 0.18 10)", bg: "oklch(17% 0.14 10)",
    jungian: { en: "Dominant Introverted Feeling — supported by Extraverted Intuition", id: "Perasaan Introvert Dominan — didukung oleh Intuisi Ekstravert", nl: "Dominant Introvert Gevoel — ondersteund door Extraverte Intuïtie" },
    overview: { en: "INFPs are quiet idealists who lead from deep personal values and an authentic vision of what could be. They are creative, empathetic, and fiercely loyal to the causes and people they believe in. They are often described as having an inner world of extraordinary richness — and their challenge is building the external structures that allow that richness to make a real difference.", id: "INFP adalah idealis tenang yang memimpin dari nilai-nilai pribadi yang mendalam dan visi autentik tentang apa yang bisa ada. Mereka kreatif, empatik, dan sangat setia pada tujuan dan orang-orang yang mereka percayai. Mereka sering digambarkan memiliki dunia batin dengan kekayaan luar biasa — dan tantangan mereka adalah membangun struktur eksternal yang memungkinkan kekayaan itu membuat perbedaan nyata.", nl: "INFP's zijn stille idealisten die leiden vanuit diepe persoonlijke waarden en een authentieke visie op wat zou kunnen zijn. Ze zijn creatief, empathisch en vurig loyaal aan de mensen en doelen die ze geloven. Ze hebben vaak een innerlijke wereld van buitengewone rijkdom — en hun uitdaging is externe structuren bouwen die die rijkdom een echte impact laten maken." },
    strengths: { en: ["Deep personal integrity and values clarity", "Highly empathetic and emotionally attuned", "Creative and original", "Inspires through authenticity", "Loyal to people and causes they believe in"], id: ["Integritas pribadi mendalam dan kejelasan nilai-nilai", "Sangat empatik dan peka secara emosional", "Kreatif dan orisinal", "Menginspirasi melalui keaslian", "Setia pada orang-orang dan tujuan yang mereka percayai"], nl: ["Diepe persoonlijke integriteit en waardenduidelijkheid", "Sterk empathisch en emotioneel afgestemd", "Creatief en origineel", "Inspireert door authenticiteit", "Loyaal aan mensen en doelen die ze geloven"] },
    growth: { en: "INFPs grow by building assertiveness, developing concrete execution skills, and learning to hold their convictions publicly even when challenged.", id: "INFP berkembang dengan membangun ketegasan, mengembangkan keterampilan eksekusi konkret, dan belajar mempertahankan keyakinan mereka secara publik bahkan ketika ditantang.", nl: "INFP's groeien door assertiviteit te ontwikkelen, concrete uitvoeringsvaardigheden op te bouwen en te leren hun overtuigingen publiekelijk te handhaven, ook als ze uitgedaagd worden." },
    communication: { en: "Honour their values and feelings. Create space for depth. Don't dismiss what they feel — their emotional signals carry real intelligence. Give them time; they are deliberate communicators.", id: "Hormati nilai-nilai dan perasaan mereka. Ciptakan ruang untuk kedalaman. Jangan abaikan apa yang mereka rasakan — sinyal emosional mereka membawa kecerdasan nyata. Beri mereka waktu; mereka adalah komunikator yang disengaja.", nl: "Respecteer hun waarden en gevoelens. Creëer ruimte voor diepgang. Wijs niet af wat ze voelen — hun emotionele signalen dragen echte intelligentie. Geef ze tijd; ze communiceren doelbewust." },
    crossCultural: { en: "INFPs' individualism and focus on personal authenticity can feel countercultural in collectivist contexts. Growth edge: finding meaning within community as well as through individual expression.", id: "Individualisme INFP dan fokus pada keaslian pribadi bisa terasa berlawanan budaya dalam konteks kolektivis. Sisi pertumbuhan: menemukan makna dalam komunitas juga melalui ekspresi individual.", nl: "Het individualisme van INFP's en de focus op persoonlijke authenticiteit kan tegencultureel aanvoelen in collectivistische contexten. Groeikant: betekenis vinden binnen gemeenschap én door individuele expressie." },
  },
  ENFJ: {
    subtitle: { en: "The Teacher", id: "Sang Guru", nl: "De Mentor" },
    tagline: { en: "Inspiring. Empathetic. A developer of people.", id: "Menginspirasi. Empatik. Pengembang manusia.", nl: "Inspirerend. Empathisch. Een ontwikkelaar van mensen." },
    color: "oklch(52% 0.18 155)", bg: "oklch(17% 0.13 155)",
    jungian: { en: "Dominant Extraverted Feeling — supported by Introverted Intuition", id: "Perasaan Ekstravert Dominan — didukung oleh Intuisi Introvert", nl: "Dominant Extravert Gevoel — ondersteund door Introverte Intuïtie" },
    overview: { en: "ENFJs are the warmest and most inspiring leaders in the MBTI. They combine deep care for people with a genuine vision for what a team or community can become. They lead through relationship — investing deeply in the growth of those around them, communicating with unusual warmth and clarity, and building the kind of loyalty that sustains organisations across the long term.", id: "ENFJ adalah pemimpin paling hangat dan paling menginspirasi dalam MBTI. Mereka memadukan kepedulian mendalam pada orang-orang dengan visi yang tulus tentang apa yang bisa dicapai tim atau komunitas. Mereka memimpin melalui hubungan — berinvestasi mendalam pada pertumbuhan orang-orang di sekitar mereka, berkomunikasi dengan kehangatan dan kejelasan yang luar biasa, dan membangun jenis kesetiaan yang menopang organisasi dalam jangka panjang.", nl: "ENFJ's zijn de warmste en meest inspirerende leiders in de MBTI. Ze combineren diepe zorg voor mensen met een echte visie op wat een team of gemeenschap kan worden. Ze leiden door relaties — diep investeren in de groei van degenen om hen heen, communiceren met ongewone warmte en helderheid, en het soort loyaliteit opbouwen dat organisaties op lange termijn draagt." },
    strengths: { en: ["Deeply inspiring and motivating", "Invests in others' growth and development", "Warm, clear communicator", "Builds genuine community", "Holds vision and relational health simultaneously"], id: ["Sangat menginspirasi dan memotivasi", "Berinvestasi dalam pertumbuhan dan perkembangan orang lain", "Komunikator yang hangat dan jelas", "Membangun komunitas yang tulus", "Mempertahankan visi dan kesehatan relasional secara bersamaan"], nl: ["Diep inspirerend en motiverend", "Investeert in andermans groei en ontwikkeling", "Warm, helder communicator", "Bouwt echte gemeenschap", "Behoudt visie en relationele gezondheid tegelijk"] },
    growth: { en: "ENFJs grow by learning to maintain boundaries when others' needs become consuming, holding their convictions when relational pressure is to compromise, and ensuring they receive the care they give so freely.", id: "ENFJ berkembang dengan belajar mempertahankan batasan ketika kebutuhan orang lain menjadi menguras, mempertahankan keyakinan ketika tekanan relasional adalah untuk berkompromi, dan memastikan mereka menerima kepedulian yang mereka berikan dengan begitu bebas.", nl: "ENFJ's groeien door te leren grenzen te handhaven als andermans behoeften veeleisend worden, hun overtuigingen te bewaren als de relationele druk is om te compromitteren, en ervoor te zorgen dat ze de zorg ontvangen die ze zo vrijgevig geven." },
    communication: { en: "Be warm, genuine, and purpose-focused. Engage with their vision for people. Don't be cold or dismissive of relational dynamics — they read emotional temperature accurately and respond to it.", id: "Bersikaplah hangat, tulus, dan berfokus pada tujuan. Libatkan visi mereka untuk orang-orang. Jangan dingin atau meremehkan dinamika relasional — mereka membaca suhu emosional dengan akurat dan meresponsnya.", nl: "Wees warm, oprecht en doelgericht. Ga in op hun visie voor mensen. Wees niet koud of afwijzend over relationele dynamiek — ze lezen emotionele temperatuur nauwkeurig en reageren daarop." },
    crossCultural: { en: "ENFJs' warmth resonates in almost every cultural context. In highly individualistic cultures, their community focus can be undervalued. Growth edge: holding conviction when consensus is hard to achieve.", id: "Kehangatan ENFJ beresonansi di hampir setiap konteks budaya. Dalam budaya yang sangat individualistis, fokus komunitas mereka bisa kurang dihargai. Sisi pertumbuhan: mempertahankan keyakinan ketika konsensus sulit dicapai.", nl: "De warmte van ENFJ's resoneert in vrijwel elke culturele context. In sterk individualistische culturen kan hun gemeenschapsfocus ondergewaardeerd worden. Groeikant: overtuiging vasthouden als consensus moeilijk te bereiken is." },
  },
  ENFP: {
    subtitle: { en: "The Champion", id: "Sang Juara", nl: "De Inspirator" },
    tagline: { en: "Enthusiastic. Creative. Deeply human.", id: "Antusias. Kreatif. Sangat manusiawi.", nl: "Enthousiast. Creatief. Diep menselijk." },
    color: "oklch(60% 0.18 65)", bg: "oklch(18% 0.12 65)",
    jungian: { en: "Dominant Extraverted Intuition — supported by Introverted Feeling", id: "Intuisi Ekstravert Dominan — didukung oleh Perasaan Introvert", nl: "Dominant Extraverte Intuïtie — ondersteund door Introvert Gevoel" },
    overview: { en: "ENFPs are the most enthusiastic and human-centred innovators in the MBTI. They are energised by possibilities, driven by values, and deeply invested in the people around them. They are charismatic, creative, and genuinely inspiring — and their greatest challenge is channelling their remarkable energy into sustained execution.", id: "ENFP adalah inovator paling antusias dan berpusat pada manusia dalam MBTI. Mereka bersemangat dengan kemungkinan, didorong oleh nilai-nilai, dan sangat berinvestasi pada orang-orang di sekitar mereka. Mereka karismatik, kreatif, dan benar-benar menginspirasi — dan tantangan terbesar mereka adalah menyalurkan energi luar biasa mereka ke dalam eksekusi yang berkelanjutan.", nl: "ENFP's zijn de meest enthousiaste en mensgericht innovators in de MBTI. Ze krijgen energie van mogelijkheden, worden gedreven door waarden en zijn diep geïnvesteerd in de mensen om hen heen. Ze zijn charismatisch, creatief en werkelijk inspirerend — en hun grootste uitdaging is hun opmerkelijke energie kanaliseren naar aanhoudende uitvoering." },
    strengths: { en: ["Genuinely creative and visionary", "Warm, energetic, and inspiring", "Deeply empathetic", "Sees possibilities others miss", "Builds enthusiastic followership"], id: ["Benar-benar kreatif dan visioner", "Hangat, energetik, dan menginspirasi", "Sangat empatik", "Melihat kemungkinan yang terlewat orang lain", "Membangun pengikut yang antusias"], nl: ["Werkelijk creatief en visionair", "Warm, energiek en inspirerend", "Diep empathisch", "Ziet mogelijkheden die anderen missen", "Bouwt enthousiaste aanhang op"] },
    growth: { en: "ENFPs grow by developing the discipline to follow through, building structure that supports their natural spontaneity, and learning to be fully present in difficulty without immediately seeking the next exciting thing.", id: "ENFP berkembang dengan mengembangkan disiplin untuk menindaklanjuti, membangun struktur yang mendukung spontanitas alami mereka, dan belajar hadir sepenuhnya dalam kesulitan tanpa segera mencari hal menarik berikutnya.", nl: "ENFP's groeien door de discipline te ontwikkelen om door te zetten, structuur te bouwen die hun natuurlijke spontaniteit ondersteunt en te leren volledig aanwezig te zijn bij moeilijkheden zonder meteen het volgende spannende ding te zoeken." },
    communication: { en: "Match their energy. Be genuine — they read inauthenticity instantly. Engage their ideas. Give them creative freedom within real constraints.", id: "Sesuaikan energi mereka. Bersikaplah tulus — mereka langsung membaca ketidaktulusan. Libatkan ide-ide mereka. Beri mereka kebebasan kreatif dalam batasan nyata.", nl: "Stem je energie op hen af. Wees oprecht — ze prikken door onechtheid heen. Ga op hun ideeën in. Geef ze creatieve vrijheid binnen echte beperkingen." },
    crossCultural: { en: "ENFPs' enthusiasm and openness translate well across cultures. Their individualism can be challenging in collectivist contexts. Growth edge: sustained follow-through and cultural humility.", id: "Antusiasme dan keterbukaan ENFP diterjemahkan dengan baik di berbagai budaya. Individualisme mereka bisa menantang dalam konteks kolektivis. Sisi pertumbuhan: tindak lanjut yang berkelanjutan dan kerendahan hati budaya.", nl: "Het enthousiasme en de openheid van ENFP's vertaalt zich goed naar verschillende culturen. Hun individualisme kan uitdagend zijn in collectivistische contexten. Groeikant: aanhoudend doorzetten en culturele bescheidenheid." },
  },
  ISTJ: {
    subtitle: { en: "The Inspector", id: "Sang Pemeriksa", nl: "De Bewaker" },
    tagline: { en: "Reliable. Principled. A builder of lasting things.", id: "Dapat diandalkan. Berprinsip. Pembangun hal-hal abadi.", nl: "Betrouwbaar. Principieel. Een bouwer van blijvende dingen." },
    color: "oklch(45% 0.14 215)", bg: "oklch(16% 0.12 215)",
    jungian: { en: "Dominant Introverted Sensing — supported by Extraverted Thinking", id: "Penginderaan Introvert Dominan — didukung oleh Pemikiran Ekstravert", nl: "Dominant Introvert Zintuiglijk — ondersteund door Extravert Denken" },
    overview: { en: "ISTJs are among the most dependable and thorough of all types. They lead through consistency, duty, and meticulous preparation. They build structures that last and teams that trust them precisely because they do what they say they will do. In leadership, their great gift is reliability — and their growth edge is learning to lead through inspiration as well as through trustworthy execution.", id: "ISTJ termasuk yang paling dapat diandalkan dan teliti dari semua tipe. Mereka memimpin melalui konsistensi, tugas, dan persiapan yang cermat. Mereka membangun struktur yang bertahan lama dan tim yang mempercayai mereka tepat karena mereka melakukan apa yang mereka katakan akan mereka lakukan. Dalam kepemimpinan, hadiah besar mereka adalah keandalan — dan sisi pertumbuhan mereka adalah belajar memimpin melalui inspirasi juga melalui eksekusi yang dapat dipercaya.", nl: "ISTJ's behoren tot de meest betrouwbare en grondige van alle typen. Ze leiden door consistentie, plicht en nauwgezette voorbereiding. Ze bouwen structuren die standhouden en teams die hen vertrouwen precies omdat ze doen wat ze zeggen te zullen doen. In leiderschap is hun grote gift betrouwbaarheid — en hun groeikant is leren leiden door inspiratie én vertrouwenwekkende uitvoering." },
    strengths: { en: ["Exceptionally reliable and consistent", "Thorough and well-prepared", "Strong sense of duty and responsibility", "Calm and steady under pressure", "Builds lasting structures and systems"], id: ["Sangat dapat diandalkan dan konsisten", "Teliti dan siap dengan baik", "Rasa kewajiban dan tanggung jawab yang kuat", "Tenang dan stabil di bawah tekanan", "Membangun struktur dan sistem yang bertahan lama"], nl: ["Uitzonderlijk betrouwbaar en consistent", "Grondig en goed voorbereid", "Sterk gevoel voor plicht en verantwoordelijkheid", "Kalm en standvastig onder druk", "Bouwt duurzame structuren en systemen"] },
    growth: { en: "ISTJs grow by developing flexibility, emotional attunement, and the ability to inspire as well as execute. Their resistance to change is their most significant leadership risk.", id: "ISTJ berkembang dengan mengembangkan fleksibilitas, kepekaan emosional, dan kemampuan untuk menginspirasi serta mengeksekusi. Resistensi mereka terhadap perubahan adalah risiko kepemimpinan terbesar mereka.", nl: "ISTJ's groeien door flexibiliteit, emotionele afstemming en het vermogen om te inspireren én uit te voeren te ontwikkelen. Hun weerstand tegen verandering is hun grootste leiderschapsrisico." },
    communication: { en: "Be precise, factual, and predictable. Give them time to prepare. Don't surprise them. Honour their commitments — reliability is the deepest form of respect in their world.", id: "Bersikaplah tepat, faktual, dan dapat diprediksi. Beri mereka waktu untuk mempersiapkan. Jangan mengejutkan mereka. Hormati komitmen mereka — keandalan adalah bentuk penghormatan terdalam di dunia mereka.", nl: "Wees precies, feitelijk en voorspelbaar. Geef ze tijd om voor te bereiden. Verras ze niet. Respecteer hun afspraken — betrouwbaarheid is de diepste vorm van respect in hun wereld." },
    crossCultural: { en: "ISTJs' respect for structure and tradition is valued in hierarchical cultures. In adaptive or informal environments, they may be perceived as inflexible. Growth edge: building comfort with ambiguity.", id: "Rasa hormat ISTJ terhadap struktur dan tradisi dihargai dalam budaya hierarkis. Dalam lingkungan adaptif atau informal, mereka mungkin dianggap kaku. Sisi pertumbuhan: membangun kenyamanan dengan ambiguitas.", nl: "Het respect van ISTJ's voor structuur en traditie wordt gewaardeerd in hiërarchische culturen. In adaptieve of informele omgevingen kunnen ze als inflexibel worden gezien. Groeikant: comfort opbouwen met ambiguïteit." },
  },
  ISFJ: {
    subtitle: { en: "The Nurturer", id: "Sang Pelindung", nl: "De Beschermer" },
    tagline: { en: "Caring. Faithful. The quiet backbone.", id: "Peduli. Setia. Tulang punggung yang diam.", nl: "Zorgzaam. Trouw. De stille ruggengraat." },
    color: "oklch(50% 0.16 185)", bg: "oklch(16% 0.12 185)",
    jungian: { en: "Dominant Introverted Sensing — supported by Extraverted Feeling", id: "Penginderaan Introvert Dominan — didukung oleh Perasaan Ekstravert", nl: "Dominant Introvert Zintuiglijk — ondersteund door Extravert Gevoel" },
    overview: { en: "ISFJs are warm, meticulous, and deeply devoted to the wellbeing of the people and communities they serve. They are often the invisible backbone of healthy organisations — doing what needs to be done, showing up when it counts, and rarely asking for recognition. Their growth edge is learning to advocate for themselves with the same clarity they give to others.", id: "ISFJ adalah orang yang hangat, teliti, dan sangat berdedikasi pada kesejahteraan orang-orang dan komunitas yang mereka layani. Mereka sering menjadi tulang punggung tak terlihat dari organisasi yang sehat — melakukan apa yang perlu dilakukan, hadir saat dibutuhkan, dan jarang meminta pengakuan. Sisi pertumbuhan mereka adalah belajar mengadvokasi diri sendiri dengan kejelasan yang sama yang mereka berikan kepada orang lain.", nl: "ISFJ's zijn warm, nauwgezet en diep toegewijd aan het welzijn van de mensen en gemeenschappen die ze dienen. Ze zijn vaak de onzichtbare ruggengraat van gezonde organisaties — doen wat gedaan moet worden, er zijn als het erop aankomt en zelden om erkenning vragen. Hun groeikant is leren zichzelf met dezelfde helderheid te verdedigen die ze anderen geven." },
    strengths: { en: ["Deeply caring and attentive to others", "Highly reliable and detailed", "Builds genuine community and belonging", "Loyal and consistent", "Serves without expectation of reward"], id: ["Sangat peduli dan penuh perhatian pada orang lain", "Sangat dapat diandalkan dan detail", "Membangun komunitas dan rasa memiliki yang tulus", "Setia dan konsisten", "Melayani tanpa mengharapkan imbalan"], nl: ["Diep zorgzaam en attent voor anderen", "Zeer betrouwbaar en gedetailleerd", "Bouwt echte gemeenschap en saamhorigheid", "Loyaal en consistent", "Dient zonder verwachting van beloning"] },
    growth: { en: "ISFJs grow by developing assertiveness, setting appropriate limits on how much they give, and learning to hold conflict when it is needed for the health of the team.", id: "ISFJ berkembang dengan mengembangkan ketegasan, menetapkan batasan yang tepat seberapa banyak mereka memberi, dan belajar menghadapi konflik ketika itu diperlukan untuk kesehatan tim.", nl: "ISFJ's groeien door assertiviteit te ontwikkelen, passende grenzen te stellen aan hoeveel ze geven en te leren conflict aan te gaan als dat nodig is voor de gezondheid van het team." },
    communication: { en: "Be warm, personal, and appreciative. Acknowledge their contributions specifically — they often go unrecognised and feel it. Create genuine space for them to share their own perspective.", id: "Bersikaplah hangat, personal, dan penuh penghargaan. Akui kontribusi mereka secara spesifik — mereka sering tidak diakui dan merasakannya. Ciptakan ruang yang tulus bagi mereka untuk berbagi perspektif mereka sendiri.", nl: "Wees warm, persoonlijk en waarderend. Erken hun bijdragen specifiek — ze gaan vaak onopgemerkt voorbij en voelen dat. Creëer oprechte ruimte voor hen om hun eigen perspectief te delen." },
    crossCultural: { en: "ISFJs' care and service orientation translate well across collectivist cultures. In assertive or competitive environments, their quiet approach can be overlooked. Growth edge: claiming their voice and influence.", id: "Kepedulian dan orientasi pelayanan ISFJ diterjemahkan dengan baik di berbagai budaya kolektivis. Dalam lingkungan yang asertif atau kompetitif, pendekatan diam mereka bisa diabaikan. Sisi pertumbuhan: mengklaim suara dan pengaruh mereka.", nl: "De zorg en dienstgerichtheid van ISFJ's vertalen zich goed naar collectivistische culturen. In assertieve of competitieve omgevingen kan hun stille aanpak over het hoofd worden gezien. Groeikant: hun stem en invloed opeisen." },
  },
  ESTJ: {
    subtitle: { en: "The Supervisor", id: "Sang Pengawas", nl: "De Organisator" },
    tagline: { en: "Organised. Direct. A builder of order.", id: "Terorganisir. Langsung. Pembangun keteraturan.", nl: "Georganiseerd. Direct. Een bouwer van orde." },
    color: "oklch(48% 0.18 195)", bg: "oklch(16% 0.14 195)",
    jungian: { en: "Dominant Extraverted Thinking — supported by Introverted Sensing", id: "Pemikiran Ekstravert Dominan — didukung oleh Penginderaan Introvert", nl: "Dominant Extravert Denken — ondersteund door Introvert Zintuiglijk" },
    overview: { en: "ESTJs are natural administrators who create order, clarity, and reliable systems wherever they lead. They are direct, decisive, and committed to doing things the right way — efficiently and with high standards. They build teams that know what to expect and can count on the leader to follow through. Their growth edge is learning to lead through genuine influence and not only through structure.", id: "ESTJ adalah administrator alami yang menciptakan keteraturan, kejelasan, dan sistem yang dapat diandalkan di mana pun mereka memimpin. Mereka langsung, tegas, dan berkomitmen untuk melakukan sesuatu dengan cara yang benar — secara efisien dan dengan standar tinggi. Mereka membangun tim yang tahu apa yang diharapkan dan dapat mengandalkan pemimpin untuk menindaklanjuti. Sisi pertumbuhan mereka adalah belajar memimpin melalui pengaruh sejati dan bukan hanya melalui struktur.", nl: "ESTJ's zijn natuurlijke bestuurders die overal waar ze leiden orde, duidelijkheid en betrouwbare systemen creëren. Ze zijn direct, besluitvaardig en toegewijd aan het doen van de dingen op de juiste manier — efficiënt en met hoge standaarden. Ze bouwen teams die weten wat ze kunnen verwachten en op de leider kunnen rekenen om door te zetten. Hun groeikant is leren leiden door echte invloed en niet alleen door structuur." },
    strengths: { en: ["Exceptional organiser and administrator", "Clear, direct communication", "Highly reliable and consistent", "Creates order from complexity", "Strong work ethic and high standards"], id: ["Organisator dan administrator yang luar biasa", "Komunikasi yang jelas dan langsung", "Sangat dapat diandalkan dan konsisten", "Menciptakan keteraturan dari kompleksitas", "Etos kerja yang kuat dan standar tinggi"], nl: ["Uitzonderlijk organisator en bestuurder", "Heldere, directe communicatie", "Zeer betrouwbaar en consistent", "Schept orde uit complexiteit", "Sterke werkethiek en hoge standaarden"] },
    growth: { en: "ESTJs grow by developing emotional attunement, flexibility, and the ability to inspire rather than direct. Their leadership blind spot is often the gap between their efficiency and the relational needs of their team.", id: "ESTJ berkembang dengan mengembangkan kepekaan emosional, fleksibilitas, dan kemampuan untuk menginspirasi daripada mengarahkan. Titik buta kepemimpinan mereka sering kali adalah kesenjangan antara efisiensi mereka dan kebutuhan relasional tim mereka.", nl: "ESTJ's groeien door emotionele afstemming, flexibiliteit en het vermogen om te inspireren in plaats van te sturen te ontwikkelen. Hun leiderschapsblinde vlek is vaak de kloof tussen hun efficiëntie en de relationele behoeften van hun team." },
    communication: { en: "Be direct, factual, and prepared. Come with clear information and logical reasoning. Avoid vagueness and emotional appeal over evidence. Express disagreement respectfully and directly.", id: "Bersikaplah langsung, faktual, dan siap. Datanglah dengan informasi yang jelas dan penalaran logis. Hindari ketidakjelasan dan daya tarik emosional di atas bukti. Ungkapkan ketidaksetujuan dengan hormat dan langsung.", nl: "Wees direct, feitelijk en voorbereid. Kom met duidelijke informatie en logische redenering. Vermijd vaagheid en emotionele appellen boven bewijs. Spreek meningsverschil respectvol en direct uit." },
    crossCultural: { en: "ESTJs' directness and need for structure fit well in many hierarchical cultures. In fluid or relational contexts, their need for order can feel controlling. Growth edge: building space for genuine input and adaptation.", id: "Ketegasan dan kebutuhan struktur ESTJ cocok dengan banyak budaya hierarkis. Dalam konteks yang fleksibel atau relasional, kebutuhan mereka akan keteraturan bisa terasa mengontrol. Sisi pertumbuhan: membangun ruang untuk masukan dan adaptasi yang tulus.", nl: "De directheid en behoefte aan structuur van ESTJ's past goed bij veel hiërarchische culturen. In vloeiende of relationele contexten kan hun behoefte aan orde controlerend aanvoelen. Groeikant: ruimte scheppen voor echte inbreng en aanpassing." },
  },
  ESFJ: {
    subtitle: { en: "The Provider", id: "Sang Penyedia", nl: "De Verzorger" },
    tagline: { en: "Warm. Community-focused. Deeply caring.", id: "Hangat. Fokus pada komunitas. Sangat peduli.", nl: "Warm. Gemeenschapsgericht. Diep zorgzaam." },
    color: "oklch(55% 0.18 35)", bg: "oklch(17% 0.12 35)",
    jungian: { en: "Dominant Extraverted Feeling — supported by Introverted Sensing", id: "Perasaan Ekstravert Dominan — didukung oleh Penginderaan Introvert", nl: "Dominant Extravert Gevoel — ondersteund door Introvert Zintuiglijk" },
    overview: { en: "ESFJs are the most community-oriented of all types — warm, organised, and deeply invested in the health of the people around them. They are natural hosts, encouragers, and community builders who ensure everyone feels valued and included. Their growth edge is learning to hold necessary conflict and maintain their own convictions when the relational cost is high.", id: "ESFJ adalah yang paling berorientasi komunitas dari semua tipe — hangat, terorganisir, dan sangat berinvestasi pada kesehatan orang-orang di sekitar mereka. Mereka adalah tuan rumah alami, pendorong semangat, dan pembangun komunitas yang memastikan semua orang merasa dihargai dan diikutsertakan. Sisi pertumbuhan mereka adalah belajar menghadapi konflik yang diperlukan dan mempertahankan keyakinan mereka sendiri ketika biaya relasionalnya tinggi.", nl: "ESFJ's zijn de meest gemeenschapsgerichte van alle typen — warm, georganiseerd en diep geïnvesteerd in de gezondheid van de mensen om hen heen. Ze zijn natuurlijke gastheren, aanmoedigers en gemeenschapsbuilders die ervoor zorgen dat iedereen zich gewaardeerd en erbij betrokken voelt. Hun groeikant is leren noodzakelijk conflict te handhaven en hun eigen overtuigingen te bewaren als de relationele kosten hoog zijn." },
    strengths: { en: ["Warm and genuinely caring", "Highly organised and reliable", "Builds community and belonging", "Responsive to others' needs", "Creates environments where people feel safe"], id: ["Hangat dan benar-benar peduli", "Sangat terorganisir dan dapat diandalkan", "Membangun komunitas dan rasa memiliki", "Responsif terhadap kebutuhan orang lain", "Menciptakan lingkungan di mana orang merasa aman"], nl: ["Warm en oprecht zorgzaam", "Zeer georganiseerd en betrouwbaar", "Bouwt gemeenschap en saamhorigheid", "Responsief op andermans behoeften", "Creëert omgevingen waar mensen zich veilig voelen"] },
    growth: { en: "ESFJs grow by developing comfort with productive conflict, maintaining their convictions under relational pressure, and ensuring their care for others doesn't become a source of resentment.", id: "ESFJ berkembang dengan mengembangkan kenyamanan dengan konflik produktif, mempertahankan keyakinan mereka di bawah tekanan relasional, dan memastikan kepedulian mereka pada orang lain tidak menjadi sumber kebencian.", nl: "ESFJ's groeien door comfort met productief conflict te ontwikkelen, hun overtuigingen onder relationele druk te bewaren en ervoor te zorgen dat hun zorg voor anderen geen bron van wrok wordt." },
    communication: { en: "Be warm, personal, and expressive of genuine appreciation. Acknowledge the relationship before the task. Avoid abruptness or cold efficiency — it disengages them.", id: "Bersikaplah hangat, personal, dan ekspresif dalam penghargaan yang tulus. Akui hubungan sebelum tugas. Hindari kekasaran atau efisiensi dingin — itu membuat mereka tidak terlibat.", nl: "Wees warm, persoonlijk en expressief in oprechte waardering. Erken de relatie vóór de taak. Vermijd abruptheid of koude efficiëntie — dat haalt hen uit verbinding." },
    crossCultural: { en: "ESFJs' warmth and community focus translate well across collectivist cultures. In individualistic contexts, their relational investment can seem intrusive. Growth edge: balancing care with appropriate professional boundaries.", id: "Kehangatan dan fokus komunitas ESFJ diterjemahkan dengan baik di berbagai budaya kolektivis. Dalam konteks individualistis, investasi relasional mereka bisa tampak mengganggu. Sisi pertumbuhan: menyeimbangkan kepedulian dengan batasan profesional yang tepat.", nl: "De warmte en gemeenschapsfocus van ESFJ's vertalen zich goed naar collectivistische culturen. In individualistische contexten kan hun relationele investering opdringerig lijken. Groeikant: zorg balanceren met passende professionele grenzen." },
  },
  ISTP: {
    subtitle: { en: "The Craftsman", id: "Sang Pengrajin", nl: "De Vakman" },
    tagline: { en: "Practical. Adaptable. Quietly masterful.", id: "Praktis. Adaptif. Ahli dalam diam.", nl: "Praktisch. Aanpasbaar. Stil meesterlijk." },
    color: "oklch(50% 0.15 145)", bg: "oklch(16% 0.11 145)",
    jungian: { en: "Dominant Introverted Thinking — supported by Extraverted Sensing", id: "Pemikiran Introvert Dominan — didukung oleh Penginderaan Ekstravert", nl: "Dominant Introvert Denken — ondersteund door Extravert Zintuiglijk" },
    overview: { en: "ISTPs are the most practically skilled and quietly capable of all types. They lead through excellence of execution, clear-headed problem-solving, and a remarkable ability to stay calm and effective when things go wrong. They are at their best when given a real problem to solve with maximum autonomy and minimum unnecessary structure.", id: "ISTP adalah yang paling terampil secara praktis dan paling berkemampuan dalam diam dari semua tipe. Mereka memimpin melalui keunggulan eksekusi, pemecahan masalah yang jernih, dan kemampuan luar biasa untuk tetap tenang dan efektif ketika sesuatu berjalan salah. Mereka terbaik saat diberi masalah nyata untuk dipecahkan dengan otonomi maksimal dan struktur yang tidak perlu minimal.", nl: "ISTP's zijn de meest praktisch vaardige en stil bekwame van alle typen. Ze leiden door uitvoeringsexcellentie, heldere probleemoplossing en een opmerkelijk vermogen om kalm en effectief te blijven als dingen fout gaan. Ze zijn op hun best bij een echt probleem om op te lossen met maximale autonomie en minimale onnodige structuur." },
    strengths: { en: ["Exceptional practical problem-solving", "Calm and decisive under pressure", "Highly observant and perceptive", "Efficient — cuts through to what matters", "Adaptable and resourceful in unexpected situations"], id: ["Pemecahan masalah praktis yang luar biasa", "Tenang dan tegas di bawah tekanan", "Sangat observasional dan perseptif", "Efisien — langsung ke inti masalah", "Adaptif dan kreatif dalam situasi tak terduga"], nl: ["Uitzonderlijke praktische probleemoplossing", "Kalm en besluitvaardig onder druk", "Zeer observerend en perceptief", "Efficiënt — gaat direct naar wat telt", "Aanpasbaar en vindingrijk in onverwachte situaties"] },
    growth: { en: "ISTPs grow by developing their communication, learning to express care through words as well as action, and building the long-term planning that sustains their excellence over time.", id: "ISTP berkembang dengan mengembangkan komunikasi mereka, belajar mengungkapkan kepedulian melalui kata-kata juga melalui tindakan, dan membangun perencanaan jangka panjang yang menopang keunggulan mereka dari waktu ke waktu.", nl: "ISTP's groeien door hun communicatie te ontwikkelen, te leren zorg uit te drukken door woorden én actie, en de langetermijnplanning te bouwen die hun excellentie in de tijd draagt." },
    communication: { en: "Be direct and practical. Skip the preamble. Give them space and autonomy. Don't expect emotional disclosure — they engage through action. They mean what they say; don't read in more than is there.", id: "Bersikaplah langsung dan praktis. Lewati pembukaan. Beri mereka ruang dan otonomi. Jangan harapkan pengungkapan emosional — mereka terlibat melalui tindakan. Mereka bermaksud apa yang mereka katakan; jangan membaca lebih dari yang ada.", nl: "Wees direct en praktisch. Sla de inleiding over. Geef ze ruimte en autonomie. Verwacht geen emotionele openheid — ze engageren via actie. Ze menen wat ze zeggen; lees er niet meer in dan er staat." },
    crossCultural: { en: "ISTPs' practical competence is valued in every culture. Their emotional reserve can be misread as coldness in relational cultures. Growth edge: expressing investment in people, not just solving their problems.", id: "Kompetensi praktis ISTP dihargai di setiap budaya. Cadangan emosional mereka bisa disalah tafsirkan sebagai kedinginan dalam budaya relasional. Sisi pertumbuhan: mengungkapkan investasi pada orang-orang, bukan hanya memecahkan masalah mereka.", nl: "De praktische bekwaamheid van ISTP's wordt in elke cultuur gewaardeerd. Hun emotionele reserve kan worden aangezien voor kilheid in relationele culturen. Groeikant: investering in mensen uitdrukken, niet alleen hun problemen oplossen." },
  },
  ISFP: {
    subtitle: { en: "The Composer", id: "Sang Petualang", nl: "De Kunstenaar" },
    tagline: { en: "Gentle. Creative. Authentically present.", id: "Lembut. Kreatif. Hadir secara autentik.", nl: "Zacht. Creatief. Authentiek aanwezig." },
    color: "oklch(55% 0.18 150)", bg: "oklch(17% 0.13 150)",
    jungian: { en: "Dominant Introverted Feeling — supported by Extraverted Sensing", id: "Perasaan Introvert Dominan — didukung oleh Penginderaan Ekstravert", nl: "Dominant Introvert Gevoel — ondersteund door Extravert Zintuiglijk" },
    overview: { en: "ISFPs are quiet, creative, and deeply caring individuals who lead through presence, authenticity, and the quality of their attention. They are finely attuned to beauty and to the people around them — and their gift to any team is the safety and trust that comes from someone who is genuinely present and genuinely good.", id: "ISFP adalah individu yang tenang, kreatif, dan sangat peduli yang memimpin melalui kehadiran, keaslian, dan kualitas perhatian mereka. Mereka sangat peka terhadap keindahan dan orang-orang di sekitar mereka — dan hadiah mereka untuk tim mana pun adalah keamanan dan kepercayaan yang datang dari seseorang yang benar-benar hadir dan benar-benar baik.", nl: "ISFP's zijn stille, creatieve en diep zorgzame individuen die leiden door aanwezigheid, authenticiteit en de kwaliteit van hun aandacht. Ze zijn fijnzinnig afgestemd op schoonheid en de mensen om hen heen — en hun gift aan elk team is de veiligheid en het vertrouwen dat voortkomt uit iemand die echt aanwezig en oprecht goed is." },
    strengths: { en: ["Deep empathy and attentiveness", "Creative and aesthetically sensitive", "Authentic and non-performative", "Loyal and present with people they care about", "Open and flexible to others' perspectives"], id: ["Empati mendalam dan penuh perhatian", "Kreatif dan peka secara estetis", "Autentik dan tidak performatif", "Setia dan hadir bagi orang-orang yang mereka pedulikan", "Terbuka dan fleksibel terhadap perspektif orang lain"], nl: ["Diepe empathie en opmerkzaamheid", "Creatief en esthetisch gevoelig", "Authentiek en niet-performatief", "Loyaal en aanwezig voor mensen die ze om geven", "Open en flexibel voor andermans perspectieven"] },
    growth: { en: "ISFPs grow by claiming their voice and influence, developing assertiveness, and building the confidence to hold appropriate authority without feeling it compromises their values.", id: "ISFP berkembang dengan mengklaim suara dan pengaruh mereka, mengembangkan ketegasan, dan membangun kepercayaan diri untuk memegang otoritas yang tepat tanpa merasa itu mengkompromikan nilai-nilai mereka.", nl: "ISFP's groeien door hun stem en invloed op te eisen, assertiviteit te ontwikkelen en het vertrouwen te bouwen om passend gezag te dragen zonder het gevoel te hebben dat dit hun waarden compromitteert." },
    communication: { en: "Be gentle, personal, and unhurried. Create space for them to share at their own pace. Acknowledge their contributions — especially the quiet, invisible ones. Don't push or crowd.", id: "Bersikaplah lembut, personal, dan tidak terburu-buru. Ciptakan ruang bagi mereka untuk berbagi sesuai tempo mereka sendiri. Akui kontribusi mereka — terutama yang tenang dan tidak terlihat. Jangan mendorong atau menyempit.", nl: "Wees zacht, persoonlijk en ongehaast. Creëer ruimte voor hen om in hun eigen tempo te delen. Erken hun bijdragen — vooral de stille, onzichtbare. Dring niet aan en geef ze ruimte." },
    crossCultural: { en: "ISFPs' gentleness and adaptability serve them well in most cultures. In competitive or assertive environments, their quiet approach can leave them overlooked. Growth edge: choosing to be seen and heard, not just felt.", id: "Kelembutan dan kemampuan adaptasi ISFP melayani mereka dengan baik di sebagian besar budaya. Dalam lingkungan yang kompetitif atau asertif, pendekatan diam mereka bisa membuat mereka terlewatkan. Sisi pertumbuhan: memilih untuk terlihat dan didengar, bukan hanya dirasakan.", nl: "De zachtheid en aanpassingsvermogen van ISFP's dienen hen goed in de meeste culturen. In competitieve of assertieve omgevingen kan hun stille aanpak ertoe leiden dat ze over het hoofd worden gezien. Groeikant: kiezen om gezien en gehoord te worden, niet alleen gevoeld." },
  },
  ESTP: {
    subtitle: { en: "The Promoter", id: "Sang Pengusaha", nl: "De Ondernemer" },
    tagline: { en: "Energetic. Perceptive. Built for action.", id: "Energetik. Perseptif. Dirancang untuk bertindak.", nl: "Energiek. Opmerkzaam. Gebouwd voor actie." },
    color: "oklch(58% 0.20 55)", bg: "oklch(18% 0.13 55)",
    jungian: { en: "Dominant Extraverted Sensing — supported by Introverted Thinking", id: "Penginderaan Ekstravert Dominan — didukung oleh Pemikiran Introvert", nl: "Dominant Extravert Zintuiglijk — ondersteund door Introvert Denken" },
    overview: { en: "ESTPs are the most action-oriented and perceptive of all types. They read real-world situations with extraordinary speed and accuracy and move quickly from insight to action. They are natural negotiators, performers, and crisis leaders. Their challenge is developing the strategic patience and relational depth that sustains their leadership over the long term.", id: "ESTP adalah yang paling berorientasi tindakan dan perseptif dari semua tipe. Mereka membaca situasi dunia nyata dengan kecepatan dan akurasi luar biasa dan bergerak cepat dari wawasan ke tindakan. Mereka adalah negosiator alami, pelaku, dan pemimpin krisis. Tantangan mereka adalah mengembangkan kesabaran strategis dan kedalaman relasional yang menopang kepemimpinan mereka dalam jangka panjang.", nl: "ESTP's zijn de meest actiegericht en perceptief van alle typen. Ze lezen situaties in de echte wereld met buitengewone snelheid en nauwkeurigheid en gaan snel van inzicht naar actie. Ze zijn van nature onderhandelaars, uitvoerders en crisisleiders. Hun uitdaging is strategische geduld en relationele diepgang te ontwikkelen die hun leiderschap op lange termijn draagt." },
    strengths: { en: ["Fast, accurate real-world perception", "Action-oriented and decisive", "Energetic and charismatic", "Excellent negotiator and communicator", "Resilient and adaptable under pressure"], id: ["Persepsi dunia nyata yang cepat dan akurat", "Berorientasi tindakan dan tegas", "Energetik dan karismatik", "Negosiator dan komunikator yang sangat baik", "Tangguh dan adaptif di bawah tekanan"], nl: ["Snelle, nauwkeurige waarneming van de realiteit", "Actiegericht en besluitvaardig", "Energiek en charismatisch", "Uitstekend onderhandelaar en communicator", "Veerkrachtig en aanpasbaar onder druk"] },
    growth: { en: "ESTPs grow by developing strategic patience, long-range planning, and the relational depth that builds lasting teams rather than just solving today's problem.", id: "ESTP berkembang dengan mengembangkan kesabaran strategis, perencanaan jangka panjang, dan kedalaman relasional yang membangun tim yang bertahan lama daripada hanya memecahkan masalah hari ini.", nl: "ESTP's groeien door strategisch geduld, langetermijnplanning en de relationele diepgang te ontwikkelen die duurzame teams bouwt in plaats van alleen het probleem van vandaag op te lossen." },
    communication: { en: "Be direct, energetic, and concrete. Skip theory. Keep things dynamic. They engage quickly and move on — don't over-elaborate. Match their pace.", id: "Bersikaplah langsung, energetik, dan konkret. Lewati teori. Jaga dinamika. Mereka terlibat dengan cepat dan melanjutkan — jangan terlalu mengembangkan. Sesuaikan kecepatan mereka.", nl: "Wees direct, energiek en concreet. Sla theorie over. Houd dingen dynamisch. Ze engageren snel en gaan verder — elaboreer niet te veel. Pas je tempo aan het hunne aan." },
    crossCultural: { en: "ESTPs' boldness is valued in action-oriented cultures but can seem reckless or disrespectful in deliberative or consensus-driven contexts. Growth edge: building patience for process.", id: "Keberanian ESTP dihargai dalam budaya berorientasi tindakan tetapi bisa tampak ceroboh atau tidak sopan dalam konteks yang deliberatif atau didorong konsensus. Sisi pertumbuhan: membangun kesabaran untuk proses.", nl: "De durf van ESTP's wordt gewaardeerd in actiegericht culturen maar kan roekeloos of respectloos overkomen in deliberatieve of consensusgerichte contexten. Groeikant: geduld voor proces opbouwen." },
  },
  ESFP: {
    subtitle: { en: "The Performer", id: "Sang Penghibur", nl: "De Entertainer" },
    tagline: { en: "Warm. Spontaneous. Joyfully engaged.", id: "Hangat. Spontan. Terlibat dengan penuh sukacita.", nl: "Warm. Spontaan. Vreugdevol betrokken." },
    color: "oklch(62% 0.20 48)", bg: "oklch(18% 0.13 48)",
    jungian: { en: "Dominant Extraverted Sensing — supported by Introverted Feeling", id: "Penginderaan Ekstravert Dominan — didukung oleh Perasaan Introvert", nl: "Dominant Extravert Zintuiglijk — ondersteund door Introvert Gevoel" },
    overview: { en: "ESFPs are the most warmly present and joyfully engaged of all types. They bring infectious enthusiasm, genuine care, and spontaneous energy to everything they do. They create environments where people genuinely want to show up — and their gift is making everyone feel seen, welcomed, and valued. Their growth edge is developing the discipline and long-range planning that turns their relational gifts into sustained leadership.", id: "ESFP adalah yang paling hangat dan paling terlibat dengan penuh sukacita dari semua tipe. Mereka membawa antusiasme yang menular, kepedulian yang tulus, dan energi spontan ke semua yang mereka lakukan. Mereka menciptakan lingkungan di mana orang benar-benar ingin hadir — dan hadiah mereka adalah membuat semua orang merasa dilihat, disambut, dan dihargai. Sisi pertumbuhan mereka adalah mengembangkan disiplin dan perencanaan jangka panjang yang mengubah hadiah relasional mereka menjadi kepemimpinan yang berkelanjutan.", nl: "ESFP's zijn de meest warmhartig aanwezige en vreugdevol betrokken van alle typen. Ze brengen aanstekelijk enthousiasme, oprechte zorg en spontane energie in alles wat ze doen. Ze creëren omgevingen waar mensen echt willen komen — en hun gave is iedereen het gevoel geven gezien, verwelkomd en gewaardeerd te worden. Hun groeikant is de discipline en langetermijnplanning te ontwikkelen die hun relationele gaven omzet in aanhoudend leiderschap." },
    strengths: { en: ["Warm, generous, and genuinely caring", "Brings energy and joy to team culture", "Spontaneous and highly adaptable", "Reads and responds to people intuitively", "Makes people feel genuinely welcomed"], id: ["Hangat, murah hati, dan benar-benar peduli", "Membawa energi dan sukacita ke budaya tim", "Spontan dan sangat adaptif", "Membaca dan merespons orang secara intuitif", "Membuat orang merasa benar-benar disambut"], nl: ["Warm, vrijgevig en oprecht zorgzaam", "Brengt energie en vreugde in teamcultuur", "Spontaan en zeer aanpasbaar", "Leest en reageert intuïtief op mensen", "Maakt mensen het gevoel werkelijk welkom te zijn"] },
    growth: { en: "ESFPs grow by developing follow-through, strategic discipline, and the capacity to lead through difficulty as well as celebration.", id: "ESFP berkembang dengan mengembangkan tindak lanjut, disiplin strategis, dan kapasitas untuk memimpin melalui kesulitan juga melalui perayaan.", nl: "ESFP's groeien door doorzettingsvermogen, strategische discipline en het vermogen om zowel door moeilijkheden als door vieringen te leiden te ontwikkelen." },
    communication: { en: "Be warm, positive, and personal. Engage with their energy genuinely. Show appreciation frequently and specifically. Avoid cold, heavy, or over-serious interactions.", id: "Bersikaplah hangat, positif, dan personal. Libatkan energi mereka dengan tulus. Tunjukkan penghargaan secara sering dan spesifik. Hindari interaksi yang dingin, berat, atau terlalu serius.", nl: "Wees warm, positief en persoonlijk. Ga oprecht op hun energie in. Toon regelmatig en specifiek waardering. Vermijd koude, zware of overdreven serieuze interacties." },
    crossCultural: { en: "ESFPs' warmth and expressiveness are gifts in relational cultures. In reserved or structured environments, their spontaneity can seem unprofessional. Growth edge: channelling social gifts into disciplined follow-through.", id: "Kehangatan dan ekspresivitas ESFP adalah anugerah dalam budaya relasional. Dalam lingkungan yang tertutup atau terstruktur, spontanitas mereka bisa tampak tidak profesional. Sisi pertumbuhan: menyalurkan hadiah sosial ke dalam tindak lanjut yang disiplin.", nl: "De warmte en expressiviteit van ESFP's zijn gaven in relationele culturen. In gereserveerde of gestructureerde omgevingen kan hun spontaniteit onprofessioneel overkomen. Groeikant: sociale gaven kanaliseren naar gedisciplineerd doorzetten." },
  },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "done";

function computeType(scores: Record<string, number>): { type: string; pcts: Record<string, number> } {
  const ePct = Math.round((scores.EI_E ?? 0) / ((scores.EI_E ?? 0) + (scores.EI_I ?? 1)) * 100) || 50;
  const sPct = Math.round((scores.SN_S ?? 0) / ((scores.SN_S ?? 0) + (scores.SN_N ?? 1)) * 100) || 50;
  const tPct = Math.round((scores.TF_T ?? 0) / ((scores.TF_T ?? 0) + (scores.TF_F ?? 1)) * 100) || 50;
  const jPct = Math.round((scores.JP_J ?? 0) / ((scores.JP_J ?? 0) + (scores.JP_P ?? 1)) * 100) || 50;
  const type = [ePct >= 50 ? "E" : "I", sPct >= 50 ? "S" : "N", tPct >= 50 ? "T" : "F", jPct >= 50 ? "J" : "P"].join("");
  return { type, pcts: { E: ePct, I: 100 - ePct, S: sPct, N: 100 - sPct, T: tPct, F: 100 - tPct, J: jPct, P: 100 - jPct } };
}

const DIMENSION_META = [
  { d: "EI", label: "Energy Direction", poleA: "E", labelA: "Extraversion", poleB: "I", labelB: "Introversion", color: "oklch(60% 0.18 52)" },
  { d: "SN", label: "Perception", poleA: "S", labelA: "Sensing", poleB: "N", labelB: "Intuition", color: "oklch(52% 0.22 280)" },
  { d: "TF", label: "Judgement", poleA: "T", labelA: "Thinking", poleB: "F", labelB: "Feeling", color: "oklch(50% 0.18 215)" },
  { d: "JP", label: "Orientation", poleA: "J", labelA: "Judging", poleB: "P", labelB: "Perceiving", color: "oklch(50% 0.20 25)" },
];

export default function MBTIClient({
  isSaved: isSavedProp,
  savedType,
  savedScores,
}: {
  isSaved: boolean;
  savedType: string | null;
  savedScores: Record<string, number> | null;
}) {
  const [quizState, setQuizState] = useState<QuizState>(savedType && savedScores ? "done" : "idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    savedScores ?? { EI_E: 0, EI_I: 0, SN_S: 0, SN_N: 0, TF_T: 0, TF_F: 0, JP_J: 0, JP_P: 0 }
  );
  const [answerHistory, setAnswerHistory] = useState<{ qIdx: number; key: string }[]>([]);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(!!savedType);
  const [isPending, startTransition] = useTransition();

  function startQuiz() {
    setCurrentIdx(0);
    setScores({ EI_E: 0, EI_I: 0, SN_S: 0, SN_N: 0, TF_T: 0, TF_F: 0, JP_J: 0, JP_P: 0 });
    setAnswerHistory([]);
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-mbti")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(pole: "A" | "B") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const poleMap: Record<string, Record<"A" | "B", string>> = {
      EI: { A: "EI_E", B: "EI_I" },
      SN: { A: "SN_S", B: "SN_N" },
      TF: { A: "TF_T", B: "TF_F" },
      JP: { A: "JP_J", B: "JP_P" },
    };
    const key = poleMap[q.d][pole];
    setAnswerHistory(prev => [...prev, { qIdx, key }]);
    setScores(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
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
    setScores(prev => ({ ...prev, [last.key]: Math.max(0, (prev[last.key] ?? 0) - 1) }));
    setAnswerHistory(prev => prev.slice(0, -1));
    setCurrentIdx(prev => prev - 1);
  }

  function handleSave() {
    startTransition(async () => {
      const { type } = computeType(scores);
      if (!isSaved) {
        await saveResourceToDashboard("myers-briggs");
        setIsSaved(true);
      }
      const result = await saveMBTIResult(type, scores);
      if (!result.error) setResultSaved(true);
    });
  }

  // ── IDLE ────────────────────────────────────────────────────────────────────
  if (quizState === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(97% 0.008 45)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=Jost:wght@300;400;500;600&display=swap');
          .mbti-btn { transition: all 0.18s ease; cursor: pointer; }
          .mbti-btn:hover { transform: translateY(-1px); }
        `}</style>

        <div style={{ background: "oklch(25% 0.08 45)", color: "white", padding: "72px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(72% 0.06 45)", marginBottom: 20 }}>
              Personality Assessment
            </p>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Myers-Briggs<br />
              <em style={{ fontStyle: "italic", color: "oklch(78% 0.08 45)" }}>Type Indicator</em>
            </h1>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400, lineHeight: 1.7, color: "oklch(80% 0.05 45)", maxWidth: 580 }}>
              One of the most widely used personality frameworks in the world — rooted in Jungian psychology and used by millions of leaders, teams, and organisations to understand how people think, decide, and relate.
            </p>
            <button
              onClick={startQuiz}
              className="mbti-btn"
              style={{ marginTop: 36, padding: "14px 36px", background: "oklch(62% 0.18 45)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 600 }}
            >
              Start Assessment →
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 16 }}>
              What is the Myers-Briggs Type Indicator?
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(28% 0.04 45)", marginBottom: 14 }}>
              The Myers-Briggs Type Indicator (MBTI) was developed by Isabel Briggs Myers and her mother Katharine Cook Briggs in the 1940s, drawing on the psychological theories of Carl Jung. It identifies how people prefer to direct their energy, take in information, make decisions, and organise their lives — producing one of 16 distinct personality types.
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, lineHeight: 1.75, color: "oklch(28% 0.04 45)" }}>
              The MBTI is used in team-building, leadership development, coaching, and cross-cultural work in organisations around the world. It offers a language for understanding why people think, communicate, and lead differently — and what each style brings to a team.
            </p>
          </section>

          <section style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 8 }}>
              The Jungian Foundations
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(40% 0.04 45)", marginBottom: 24 }}>
              Jung identified two core mental processes: <em>perception</em> (how we gather information) and <em>judgement</em> (how we make decisions). The MBTI adds two further dimensions to produce four preference pairs.
            </p>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { pair: "Extraversion / Introversion", desc: "Where do you direct your mental energy? Outward to people and action, or inward to thoughts and reflection?", detail: "This is Jung's most fundamental distinction — not about shyness or sociability, but about where you naturally draw energy." },
                { pair: "Sensing / Intuition", desc: "How do you take in information? Through concrete present facts, or through patterns and future possibilities?", detail: "Jung called these the two perception functions — the two radically different ways humans pay attention to the world." },
                { pair: "Thinking / Feeling", desc: "How do you make decisions? Through logical analysis and objective criteria, or through personal values and interpersonal impact?", detail: "Both are rational functions — Thinking applies objective principles; Feeling applies subjective values. Neither is emotional vs rational." },
                { pair: "Judging / Perceiving", desc: "How do you organise your outer world? With structure and closure, or with flexibility and openness?", detail: "Myers and Briggs added this fourth dimension to identify which function — judgement or perception — each type shows to the world." },
              ].map(item => (
                <div key={item.pair} style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: "1px solid oklch(88% 0.03 45)" }}>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 18, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 8 }}>{item.pair}</div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(32% 0.04 45)", lineHeight: 1.65, marginBottom: 8 }}>{item.desc}</p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "oklch(50% 0.04 45)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 8 }}>
              How This Assessment Works
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(40% 0.04 45)", marginBottom: 20 }}>
              Unlike typical Likert-scale assessments, the MBTI uses <strong>forced-choice pairs</strong> — you choose which of two statements feels more like you. This approach was designed by Myers to reveal natural preferences more directly.
            </p>
            <div style={{ background: "white", borderRadius: 16, padding: "28px 32px", border: "1px solid oklch(88% 0.03 45)" }}>
              {[
                ["40 forced-choice pairs", "Choose the option that feels more like your natural self."],
                ["No right or wrong", "Every type has genuine leadership strengths."],
                ["Be honest, not ideal", "Describe how you are — not who you aspire to be."],
                ["Takes about 8–10 minutes", "Find a quiet moment for the most accurate result."],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid oklch(94% 0.02 45)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(55% 0.12 45)", marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600, color: "oklch(20% 0.06 45)" }}>{label} — </span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(38% 0.04 45)" }}>{desc}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={startQuiz}
                className="mbti-btn"
                style={{ marginTop: 24, padding: "13px 32px", background: "oklch(25% 0.08 45)", color: "white", border: "none", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600 }}
              >
                Begin the Assessment
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ── ACTIVE ───────────────────────────────────────────────────────────────────
  if (quizState === "active") {
    const qIdx = QUESTION_ORDER[currentIdx];
    const q = QUESTIONS[qIdx];
    const dimMeta = DIMENSION_META.find(d => d.d === q.d)!;
    const progress = (currentIdx / QUESTION_ORDER.length) * 100;

    return (
      <div id="quiz-mbti" style={{ minHeight: "100vh", background: "oklch(97% 0.008 45)", fontFamily: "'Jost', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,400&family=Jost:wght@400;500;600&display=swap');
          .choice-btn { transition: all 0.15s ease; cursor: pointer; background: white; border: 2px solid oklch(88% 0.03 45); border-radius: 14px; padding: 22px 24px; text-align: left; width: 100%; }
          .choice-btn:hover { border-color: var(--dcolor); background: oklch(97% 0.01 45); transform: translateX(4px); }
        `}</style>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "oklch(50% 0.04 45)", fontWeight: 500 }}>{currentIdx + 1} / {QUESTION_ORDER.length}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: dimMeta.color }}>{dimMeta.label}: {dimMeta.labelA} vs {dimMeta.labelB}</span>
            </div>
            <div style={{ height: 4, background: "oklch(88% 0.03 45)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: dimMeta.color, borderRadius: 4, transition: "width 0.3s ease" }} />
            </div>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(50% 0.04 45)", marginBottom: 20 }}>
            Which feels more like you?
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {[{ label: "A", text: q.a }, { label: "B", text: q.b }].map(opt => (
              <button
                key={opt.label}
                className="choice-btn"
                onClick={() => handleAnswer(opt.label as "A" | "B")}
                style={{ "--dcolor": dimMeta.color } as React.CSSProperties}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 22, fontWeight: 400, color: dimMeta.color, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{opt.label}</span>
                  <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.6, color: "oklch(20% 0.05 45)", margin: 0, fontWeight: 400 }}>
                    {opt.text.en}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <button onClick={handleBack} style={{ marginTop: 28, background: "transparent", border: "none", color: "oklch(55% 0.05 45)", fontFamily: "'Jost', sans-serif", fontSize: 14, cursor: "pointer", padding: "8px 0" }}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── DONE ─────────────────────────────────────────────────────────────────────
  const { type, pcts } = computeType(scores);
  const typeData = MBTI_TYPES[type] ?? MBTI_TYPES.ENFP;

  return (
    <div style={{ minHeight: "100vh", background: "oklch(97% 0.008 45)", fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=Jost:wght@300;400;500;600&display=swap');
        .mbti-bar { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <div style={{ background: typeData.bg, color: "white", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(70% 0.05 45)", marginBottom: 12 }}>
            Your Myers-Briggs Type
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(52px, 8vw, 80px)", fontWeight: 600, color: typeData.color, lineHeight: 1 }}>{type}</span>
            <div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, lineHeight: 1.2 }}>{typeData.subtitle.en}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: "oklch(78% 0.05 45)", marginTop: 6 }}>{typeData.jungian.en}</div>
            </div>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, lineHeight: 1.7, color: "oklch(82% 0.04 45)", maxWidth: 580 }}>
            {typeData.overview.en}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Dimension profile */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 24 }}>Preference Profile</h2>
          <div style={{ display: "grid", gap: 18 }}>
            {DIMENSION_META.map(d => {
              const pctA = pcts[d.poleA] ?? 50;
              const pctB = 100 - pctA;
              const dominant = pctA >= 50 ? d.labelA : d.labelB;
              const dominantPct = pctA >= 50 ? pctA : pctB;
              return (
                <div key={d.d} style={{ background: "white", borderRadius: 14, padding: "22px 26px", border: "1px solid oklch(90% 0.03 45)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500, color: "oklch(45% 0.04 45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 600, color: d.color }}>{dominant} — {dominantPct}%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.color, minWidth: 16 }}>{d.poleA}</span>
                    <div style={{ flex: 1, height: 8, background: "oklch(91% 0.02 45)", borderRadius: 8, overflow: "hidden" }}>
                      <div className="mbti-bar" style={{ height: "100%", width: `${pctA}%`, background: `linear-gradient(90deg, ${d.color}99, ${d.color})`, borderRadius: 8 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "oklch(55% 0.04 45)", minWidth: 16 }}>{d.poleB}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.04 45)" }}>{d.labelA} {pctA}%</span>
                    <span style={{ fontSize: 11, color: "oklch(55% 0.04 45)" }}>{d.labelB} {pctB}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strengths */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 24, fontWeight: 400, color: "oklch(22% 0.06 45)", marginBottom: 16 }}>Leadership Strengths</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
            {typeData.strengths.en.map(s => (
              <li key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "white", borderRadius: 10, padding: "14px 18px", border: "1px solid oklch(90% 0.03 45)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: typeData.color, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.6, color: "oklch(28% 0.05 45)" }}>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {[
          { title: "Growth Edge", content: typeData.growth },
          { title: "Communication Insights", content: typeData.communication },
          { title: "Cross-Cultural Awareness", content: typeData.crossCultural },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 20, background: "white", borderRadius: 16, padding: "24px 28px", border: "1px solid oklch(90% 0.03 45)" }}>
            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 18, fontWeight: 400, color: "oklch(20% 0.06 45)", marginBottom: 12 }}>{section.title}</h3>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, lineHeight: 1.75, color: "oklch(30% 0.04 45)", margin: 0 }}>{section.content}</p>
          </section>
        ))}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          {!resultSaved && (
            <button onClick={handleSave} disabled={isPending}
              style={{ padding: "13px 28px", background: typeData.color, color: "white", border: "none", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: isPending ? 0.7 : 1 }}>
              {isPending ? "Saving…" : "Save to Dashboard"}
            </button>
          )}
          {resultSaved && (
            <div style={{ padding: "13px 20px", background: "oklch(92% 0.05 155)", color: "oklch(35% 0.14 155)", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600 }}>
              ✓ Saved to your dashboard
            </div>
          )}
          <button onClick={startQuiz} style={{ padding: "13px 28px", background: "white", color: "oklch(35% 0.08 45)", border: "2px solid oklch(85% 0.03 45)", borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
