"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveResourceToDashboard, saveThinkingStyleResult } from "../actions";

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────

const QS = [
  {en:"Your team presents a new project idea. Your first instinct is to:",id:"Tim Anda mempresentasikan ide proyek baru. Naluri pertama Anda adalah:",nl:"Jouw team presenteert een nieuw projectidee. Jouw eerste instinct is om:",options:[{en:"Ask for a clear outline of the steps and expected outcomes.",id:"Meminta gambaran langkah-langkah yang jelas dan hasil yang diharapkan.",nl:"Om een duidelijk overzicht van de stappen en verwachte resultaten te vragen.",t:"C"},{en:"Ask how it will affect everyone involved and the bigger picture.",id:"Bertanya bagaimana dampaknya terhadap semua orang dan gambaran besarnya.",nl:"Te vragen hoe het iedereen die erbij betrokken is en het grotere geheel zal beïnvloeden.",t:"H"},{en:"Pause and notice whether something about it feels right or off.",id:"Berhenti sejenak dan merasakan apakah ada sesuatu yang terasa benar atau tidak.",nl:"Even te pauzeren en op te merken of iets erover goed of niet goed voelt.",t:"I"}]},
  {en:"When conflict arises in your team, you tend to:",id:"Ketika konflik muncul dalam tim Anda, Anda cenderung:",nl:"Wanneer er een conflict ontstaat in jouw team, neig jij ertoe om:",options:[{en:"Identify the facts and define clearly what went wrong.",id:"Mengidentifikasi fakta dan mendefinisikan dengan jelas apa yang salah.",nl:"De feiten te identificeren en duidelijk te definiëren wat er mis ging.",t:"C"},{en:"Focus on restoring harmony and keeping everyone together.",id:"Berfokus pada memulihkan keharmonisan dan menjaga semua orang tetap bersatu.",nl:"Je te richten op het herstel van harmonie en iedereen bij elkaar te houden.",t:"H"},{en:"Sense the emotional undercurrents and address what's really going on.",id:"Merasakan arus emosional yang mendasarinya dan menangani apa yang sebenarnya terjadi.",nl:"De emotionele onderstroom te voelen en aan te pakken wat er echt speelt.",t:"I"}]},
  {en:"You're making a major decision. You feel most confident when:",id:"Anda membuat keputusan penting. Anda merasa paling yakin ketika:",nl:"Je neemt een belangrijke beslissing. Je voelt je het meest zeker wanneer:",options:[{en:"You have enough data and logical reasoning to support your choice.",id:"Anda memiliki cukup data dan penalaran logis untuk mendukung pilihan Anda.",nl:"Je voldoende gegevens en logische redenering hebt om je keuze te onderbouwen.",t:"C"},{en:"You've considered how it will affect all the people involved.",id:"Anda telah mempertimbangkan bagaimana dampaknya terhadap semua orang yang terlibat.",nl:"Je hebt nagedacht over hoe het alle betrokkenen zal beïnvloeden.",t:"H"},{en:"You have an inner sense it's the right move, even if you can't fully explain it.",id:"Anda memiliki perasaan batin bahwa ini langkah yang benar, meskipun tidak bisa sepenuhnya menjelaskannya.",nl:"Je een innerlijk gevoel hebt dat het de juiste stap is, ook al kun je het niet volledig uitleggen.",t:"I"}]},
  {en:"A colleague gives you a long, story-filled update. You most likely:",id:"Seorang rekan memberikan laporan panjang yang penuh cerita. Anda kemungkinan besar:",nl:"Een collega geeft je een lang en verhaalrijk bijgepraat. Jij doet waarschijnlijk:",options:[{en:"Get impatient waiting for the main point.",id:"Tidak sabar menunggu poin utamanya.",nl:"Ongeduldig worden in afwachting van het hoofdpunt.",t:"C"},{en:"Enjoy hearing about the context and all the connections.",id:"Menikmati mendengar konteks dan semua kaitannya.",nl:"Genieten van het horen over de context en alle verbanden.",t:"H"},{en:"Pay close attention to the tone and what's left unsaid.",id:"Memperhatikan nada bicara dan apa yang tidak diucapkan.",nl:"Goed letten op de toon en wat er niet gezegd wordt.",t:"I"}]},
  {en:"In a meeting, you are most likely to say:",id:"Dalam rapat, Anda paling sering mengatakan:",nl:"In een vergadering zeg jij het vaakst:",options:[{en:'"Let\'s define the problem clearly before we discuss solutions."',id:'"Mari kita definisikan masalahnya dengan jelas sebelum membahas solusinya."',nl:'"Laten we het probleem duidelijk definiëren voordat we oplossingen bespreken."',t:"C"},{en:'"How will this affect the team long-term?"',id:'"Bagaimana dampak jangka panjangnya terhadap tim?"',nl:'"Hoe zal dit het team op de lange termijn beïnvloeden?"',t:"H"},{en:'"Something doesn\'t feel right about this direction."',id:'"Ada sesuatu yang terasa tidak benar tentang arah ini."',nl:'"Er klopt iets niet aan deze richting."',t:"I"}]},
  {en:"When reading or studying new material, you:",id:"Ketika membaca atau mempelajari materi baru, Anda:",nl:"Wanneer je nieuwe stof leest of bestudeert:",options:[{en:"Look for the structure, key points, and logical flow.",id:"Mencari struktur, poin-poin utama, dan alur yang logis.",nl:"Zoek je naar de structuur, kernpunten en logische opbouw.",t:"C"},{en:"Connect it to other areas of life and consider broader implications.",id:"Menghubungkannya dengan bidang kehidupan lain dan mempertimbangkan implikasi yang lebih luas.",nl:"Verbind je het met andere levensgebieden en overweeg je bredere implicaties.",t:"H"},{en:"Pay attention to how it resonates with your gut and lived experience.",id:"Memperhatikan bagaimana itu beresonansi dengan intuisi dan pengalaman hidup Anda.",nl:"Let je op hoe het resoneert met je instinct en levenservaring.",t:"I"}]},
  {en:"If a plan seems contradictory, you:",id:"Jika sebuah rencana tampak kontradiktif, Anda:",nl:"Als een plan tegenstrijdig lijkt:",options:[{en:"Need the contradiction resolved before you can move forward.",id:"Perlu kontradiksi itu diselesaikan sebelum bisa melangkah maju.",nl:"Moet de tegenstrijdigheid opgelost worden voordat je verder kunt.",t:"C"},{en:"Accept that tension can coexist and focus on the overall outcome.",id:"Menerima bahwa ketegangan bisa hidup berdampingan dan fokus pada hasil keseluruhan.",nl:"Accepteer je dat spanning kan samengaan en richt je je op het algehele resultaat.",t:"H"},{en:"Trust your intuition about which direction is right, even without full clarity.",id:"Mempercayai intuisi Anda tentang arah mana yang benar, bahkan tanpa kejelasan penuh.",nl:"Vertrouw je op je intuïtie over welke richting juist is, zelfs zonder volledige duidelijkheid.",t:"I"}]},
  {en:"Your leadership strength is most often:",id:"Kekuatan kepemimpinan Anda yang paling sering terlihat adalah:",nl:"Jouw leiderschapskracht is het vaakst:",options:[{en:"Bringing clarity, structure, and direction.",id:"Membawa kejelasan, struktur, dan arah.",nl:"Helderheid, structuur en richting brengen.",t:"C"},{en:"Building unity and helping people see the bigger picture.",id:"Membangun persatuan dan membantu orang melihat gambaran besar.",nl:"Eenheid opbouwen en mensen helpen het grotere geheel te zien.",t:"H"},{en:"Sensing what's really happening beneath the surface.",id:"Merasakan apa yang sebenarnya terjadi di balik permukaan.",nl:"Voelen wat er echt onder de oppervlakte speelt.",t:"I"}]},
  {en:"When communicating important information, you prefer:",id:"Ketika mengkomunikasikan informasi penting, Anda lebih suka:",nl:"Wanneer je belangrijke informatie communiceert, geef jij de voorkeur aan:",options:[{en:"Clear, structured points in a logical sequence.",id:"Poin-poin yang jelas dan terstruktur dalam urutan logis.",nl:"Duidelijke, gestructureerde punten in een logische volgorde.",t:"C"},{en:"Stories and examples that show how things connect.",id:"Cerita dan contoh yang menunjukkan bagaimana segala sesuatu saling terhubung.",nl:"Verhalen en voorbeelden die laten zien hoe dingen met elkaar verbonden zijn.",t:"H"},{en:"Reflective language that captures the atmosphere and deeper meaning.",id:"Bahasa yang reflektif yang menangkap suasana dan makna yang lebih dalam.",nl:"Reflectieve taal die de sfeer en diepere betekenis weergeeft.",t:"I"}]},
  {en:'When someone says "I just sense this is the right thing to do," you:',id:'Ketika seseorang berkata "Saya hanya merasakan ini adalah hal yang benar," Anda:',nl:'Wanneer iemand zegt "Ik voel gewoon dat dit het juiste is om te doen":',options:[{en:"Ask them to give you evidence or reasoning.",id:"Meminta mereka memberikan bukti atau penalaran.",nl:"Vraag je om bewijs of redenering.",t:"C"},{en:"Consider how that feeling fits into the bigger relational context.",id:"Mempertimbangkan bagaimana perasaan itu cocok dengan konteks relasional yang lebih besar.",nl:"Overweeg je hoe dat gevoel past in de bredere relationele context.",t:"H"},{en:"Respect it — you know that intuition is a valid form of knowing.",id:"Menghormatinya — Anda tahu bahwa intuisi adalah bentuk pengetahuan yang valid.",nl:"Respecteer je het — je weet dat intuïtie een geldige manier van weten is.",t:"I"}]},
  {en:"On a new team, you naturally:",id:"Dalam tim baru, Anda secara alami:",nl:"In een nieuw team doe jij van nature:",options:[{en:"Try to establish clear roles, processes, and expectations.",id:"Mencoba menetapkan peran, proses, dan ekspektasi yang jelas.",nl:"Probeer je duidelijke rollen, processen en verwachtingen vast te stellen.",t:"C"},{en:"Focus on building relationships and understanding group dynamics.",id:"Berfokus pada membangun hubungan dan memahami dinamika kelompok.",nl:"Richt je je op het opbouwen van relaties en het begrijpen van groepsdynamiek.",t:"H"},{en:"Read the room and tune into the unspoken atmosphere.",id:"Membaca suasana dan menyelaraskan diri dengan atmosfer yang tidak terucapkan.",nl:"Lees je de situatie en stem je je af op de onuitgesproken sfeer.",t:"I"}]},
  {en:"When evaluating whether something is true, you primarily ask:",id:"Ketika mengevaluasi apakah sesuatu itu benar, Anda terutama bertanya:",nl:"Wanneer je beoordeelt of iets waar is, vraag je je voornamelijk af:",options:[{en:"Is it consistent and principled?",id:"Apakah ini konsisten dan berprinsip?",nl:"Is het consistent en principieel?",t:"C"},{en:"Does it fit the full context and relationships involved?",id:"Apakah ini sesuai dengan konteks penuh dan hubungan yang terlibat?",nl:"Past het bij de volledige context en betrokken relaties?",t:"H"},{en:"Does it ring true from lived experience or inner conviction?",id:"Apakah ini terasa benar dari pengalaman hidup atau keyakinan batin?",nl:"Klopt het vanuit levenservaring of innerlijke overtuiging?",t:"I"}]},
  {en:"A team member is struggling. Your first response is to:",id:"Seorang anggota tim sedang berjuang. Respons pertama Anda adalah:",nl:"Een teamlid heeft het moeilijk. Jouw eerste reactie is:",options:[{en:"Identify what's causing the problem and suggest a clear plan.",id:"Mengidentifikasi apa yang menyebabkan masalah dan menyarankan rencana yang jelas.",nl:"Identificeren wat het probleem veroorzaakt en een duidelijk plan voorstellen.",t:"C"},{en:"Make sure they feel supported and explore how it's affecting everyone.",id:"Memastikan mereka merasa didukung dan mengeksplorasi bagaimana ini mempengaruhi semua orang.",nl:"Ervoor zorgen dat ze zich gesteund voelen en onderzoeken hoe het iedereen beïnvloedt.",t:"H"},{en:"Sit with them and tune into what's really going on beneath the surface.",id:"Duduk bersama mereka dan menyelaraskan diri dengan apa yang sebenarnya terjadi di balik permukaan.",nl:"Bij hen gaan zitten en je afstemmen op wat er echt onder de oppervlakte speelt.",t:"I"}]},
  {en:"When planning, you feel most at home with:",id:"Ketika merencanakan, Anda merasa paling nyaman dengan:",nl:"Bij het plannen voel jij je het meest thuis met:",options:[{en:"Detailed steps and measurable outcomes.",id:"Langkah-langkah terperinci dan hasil yang terukur.",nl:"Gedetailleerde stappen en meetbare resultaten.",t:"C"},{en:"Flexible plans that consider people and relationships.",id:"Rencana fleksibel yang mempertimbangkan orang dan hubungan.",nl:"Flexibele plannen die rekening houden met mensen en relaties.",t:"H"},{en:"A general sense of direction guided by discernment.",id:"Arah umum yang dipandu oleh kepekaan rohani.",nl:"Een algemeen richtingsgevoel geleid door onderscheidingsvermogen.",t:"I"}]},
  {en:"Your biggest frustration in a team is when:",id:"Frustrasi terbesar Anda dalam tim adalah ketika:",nl:"Jouw grootste frustratie in een team is wanneer:",options:[{en:"Things are disorganized or undefined.",id:"Segala sesuatunya tidak terorganisir atau tidak terdefinisi.",nl:"Dingen ongeorganiseerd of ongedefinieerd zijn.",t:"C"},{en:"People ignore relational dynamics and focus only on tasks.",id:"Orang-orang mengabaikan dinamika relasional dan hanya fokus pada tugas.",nl:"Mensen relationele dynamiek negeren en alleen op taken focussen.",t:"H"},{en:"The atmosphere feels wrong but no one acknowledges it.",id:"Suasana terasa salah tetapi tidak ada yang mengakuinya.",nl:"De sfeer verkeerd aanvoelt maar niemand het erkent.",t:"I"}]},
  {en:"You tend to make decisions based on:",id:"Anda cenderung membuat keputusan berdasarkan:",nl:"Je neigt ernaar beslissingen te nemen op basis van:",options:[{en:"Facts, analysis, and objective criteria.",id:"Fakta, analisis, dan kriteria objektif.",nl:"Feiten, analyse en objectieve criteria.",t:"C"},{en:"The impact on people and the whole system.",id:"Dampak pada orang-orang dan seluruh sistem.",nl:"De impact op mensen en het gehele systeem.",t:"H"},{en:"Inner conviction and a sense of what the moment calls for.",id:"Keyakinan batin dan rasa akan apa yang dibutuhkan saat ini.",nl:"Innerlijke overtuiging en een gevoel voor wat het moment vraagt.",t:"I"}]},
  {en:"When two ideas seem to contradict each other, your instinct is:",id:"Ketika dua ide tampak bertentangan satu sama lain, naluri Anda adalah:",nl:"Wanneer twee ideeën tegenstrijdig lijken, is jouw instinct:",options:[{en:"Figure out which one is right.",id:"Mencari tahu mana yang benar.",nl:"Uitzoeken welke de juiste is.",t:"C"},{en:"See how both might contribute to a fuller picture.",id:"Melihat bagaimana keduanya mungkin berkontribusi pada gambaran yang lebih lengkap.",nl:"Zien hoe beide kunnen bijdragen aan een vollediger beeld.",t:"H"},{en:"Sit with the tension — sometimes truth holds paradox.",id:"Duduk dengan ketegangan itu — terkadang kebenaran mengandung paradoks.",nl:"Met de spanning zitten — soms houdt waarheid een paradox in.",t:"I"}]},
  {en:"In a group discussion, you are most likely to:",id:"Dalam diskusi kelompok, Anda paling sering:",nl:"In een groepsdiscussie doe jij het vaakst:",options:[{en:"Push for clarity and specific answers.",id:"Mendorong kejelasan dan jawaban yang spesifik.",nl:"Dringen op duidelijkheid en specifieke antwoorden.",t:"C"},{en:"Make sure all voices are heard and perspectives are included.",id:"Memastikan semua suara didengar dan perspektif disertakan.",nl:"Ervoor zorgen dat alle stemmen worden gehoord en perspectieven worden meegenomen.",t:"H"},{en:"Notice what's not being said and name it carefully.",id:"Memperhatikan apa yang tidak dikatakan dan menyebutkannya dengan hati-hati.",nl:"Opmerken wat er niet gezegd wordt en het voorzichtig benoemen.",t:"I"}]},
  {en:"You describe your ideal working environment as:",id:"Anda menggambarkan lingkungan kerja ideal Anda sebagai:",nl:"Jij beschrijft jouw ideale werkomgeving als:",options:[{en:"Structured, clear expectations, logical flow.",id:"Terstruktur, ekspektasi yang jelas, alur yang logis.",nl:"Gestructureerd, duidelijke verwachtingen, logische opbouw.",t:"C"},{en:"Collaborative, relational, team-focused.",id:"Kolaboratif, relasional, berfokus pada tim.",nl:"Samenwerkend, relationeel, teamgericht.",t:"H"},{en:"Reflective, meaningful, with room for depth.",id:"Reflektif, bermakna, dengan ruang untuk kedalaman.",nl:"Reflectief, betekenisvol, met ruimte voor diepgang.",t:"I"}]},
  {en:"After a long leadership day, you feel most drained by:",id:"Setelah hari kepemimpinan yang panjang, Anda merasa paling terkuras oleh:",nl:"Na een lange leiderschapsdag voel jij je het meest uitgeput door:",options:[{en:"Endless ambiguity and lack of clarity.",id:"Ambiguitas tanpa akhir dan kurangnya kejelasan.",nl:"Eindeloze vaagheid en gebrek aan duidelijkheid.",t:"C"},{en:"Broken relationships or unresolved group tension.",id:"Hubungan yang rusak atau ketegangan kelompok yang tidak terselesaikan.",nl:"Verstoorde relaties of onopgeloste groepsspanning.",t:"H"},{en:"Shallow conversations that never get to what really matters.",id:"Percakapan dangkal yang tidak pernah sampai pada apa yang benar-benar penting.",nl:"Oppervlakkige gesprekken die nooit bij wat echt belangrijk is uitkomen.",t:"I"}]}
];

type ResultKey = "C" | "H" | "I" | "CH" | "CI" | "HI" | "CHI";

const RESULTS: Record<"en" | "id" | "nl", Record<ResultKey, string>> = {
  en: {
    C: "You lead with structure and logic. Your greatest strength is bringing clarity to complex situations. Growth edge: invite different kinds of knowing into your leadership.",
    H: "You lead with relationships and the big picture. Your greatest strength is building unity across differences. Growth edge: practice naming what needs to be named, even when it's uncomfortable.",
    I: "You lead with depth and discernment. Your greatest strength is sensing what's really happening beneath the surface. Growth edge: translate your insights into clear, actionable language.",
    CH: "You blend structure with relational awareness — bringing both clarity and care to your leadership. A rare and powerful combination.",
    CI: "You combine logical thinking with deep intuition. You can analyse carefully and still trust your gut when it matters most.",
    HI: "You hold both relationship and depth together — sensitive to people and to what lies beneath. A leader who sees the whole person.",
    CHI: "You draw on all three styles fluidly. Analytical, relational, or deeply intuitive — depending on what the moment calls for.",
  },
  id: {
    C: "Anda memimpin dengan struktur dan logika. Kekuatan terbesar Anda adalah membawa kejelasan pada situasi yang kompleks. Tantangan: undang berbagai jenis pengetahuan ke dalam kepemimpinan Anda.",
    H: "Anda memimpin dengan hubungan dan gambaran besar. Kekuatan terbesar Anda adalah membangun persatuan di tengah perbedaan. Tantangan: latih diri untuk menyebutkan apa yang perlu disebutkan.",
    I: "Anda memimpin dengan kedalaman dan kepekaan. Kekuatan terbesar Anda adalah merasakan apa yang sebenarnya terjadi. Tantangan: terjemahkan wawasan Anda ke dalam bahasa yang jelas dan dapat ditindaklanjuti.",
    CH: "Anda memadukan struktur dengan kesadaran relasional — membawa kejelasan sekaligus kepedulian. Kombinasi yang langka dan kuat.",
    CI: "Anda menggabungkan pemikiran logis dengan intuisi yang dalam. Anda dapat menganalisis dengan cermat dan tetap mempercayai intuisi Anda.",
    HI: "Anda menyatukan hubungan dan kedalaman — peka terhadap orang-orang dan terhadap apa yang tersembunyi di baliknya.",
    CHI: "Anda menggabungkan ketiga gaya secara fleksibel — analitis, relasional, atau sangat intuitif, tergantung pada apa yang dibutuhkan saat ini.",
  },
  nl: {
    C: "Je leidt met structuur en logica. Jouw grootste kracht is het brengen van helderheid in complexe situaties. Groeipunt: nodig verschillende manieren van weten uit in jouw leiderschap.",
    H: "Je leidt met relaties en het grotere geheel. Jouw grootste kracht is het opbouwen van eenheid te midden van verschillen. Groeipunt: oefen om te benoemen wat benoemd moet worden, ook als het ongemakkelijk is.",
    I: "Je leidt met diepgang en onderscheidingsvermogen. Jouw grootste kracht is voelen wat er echt onder de oppervlakte speelt. Groeipunt: vertaal je inzichten naar heldere, uitvoerbare taal.",
    CH: "Je combineert structuur met relationeel bewustzijn — en brengt zowel helderheid als zorg in jouw leiderschap. Een zeldzame en krachtige combinatie.",
    CI: "Je combineert logisch denken met diepe intuïtie. Je kunt zorgvuldig analyseren en toch vertrouwen op je gevoel wanneer het er het meest toe doet.",
    HI: "Je houdt relatie en diepgang samen — gevoelig voor mensen en voor wat er achter schuilgaat. Een leider die de hele mens ziet.",
    CHI: "Je put vloeiend uit alle drie de stijlen. Analytisch, relationeel of diep intuïtief — afhankelijk van wat het moment vraagt.",
  },
};

function getResultKey(c: number, h: number, i: number): ResultKey {
  const mx = Math.max(c, h, i);
  const th = mx * 0.75;
  const d = [c >= th ? "C" : "", h >= th ? "H" : "", i >= th ? "I" : ""].filter(Boolean).join("");
  return (d as ResultKey) || "CHI";
}

// ── STYLES ────────────────────────────────────────────────────────────────────

const STYLES = [
  {
    key: "conceptual",
    color: "oklch(48% 0.18 250)",
    colorLight: "oklch(62% 0.14 250)",
    colorVeryLight: "oklch(92% 0.04 250)",
    bg: "oklch(20% 0.14 250)",
    tagline: "Clarity. Structure. Logic.",
    taglineId: "Kejelasan. Struktur. Logika.",
    taglineNl: "Helderheid. Structuur. Logica.",
    overview: "The Conceptual thinker seeks clarity, order, and logical consistency. Reality is processed through analysis and definition. Complex issues are broken into smaller parts. Thinking moves from parts to conclusion: A + B + C leads to D.",
    overviewId: "Pemikir Konseptual mencari kejelasan, keteraturan, dan konsistensi logis. Realitas diproses melalui analisis dan definisi. Persoalan kompleks dipecah menjadi bagian-bagian kecil. Proses berpikir bergerak dari bagian menuju kesimpulan: A + B + C = D.",
    overviewNl: "De Conceptuele denker zoekt helderheid, orde en logische consistentie. De werkelijkheid wordt verwerkt via analyse en definitie. Complexe vraagstukken worden opgesplitst in kleinere delen. Het denken gaat van delen naar conclusie: A + B + C leidt tot D.",
    viewOfTruth: "Truth is consistent, definable, and based on principles that do not change. If something appears contradictory, it must be resolved. Things are evaluated in clear categories: right or wrong, correct or incorrect.",
    viewOfTruthId: "Kebenaran bersifat konsisten, dapat didefinisikan, dan didasarkan pada prinsip-prinsip yang tidak berubah. Jika sesuatu tampak bertentangan, harus diselesaikan. Segala sesuatu dievaluasi dalam kategori yang jelas: benar atau salah, tepat atau tidak tepat.",
    viewOfTruthNl: "Waarheid is consistent, definieerbaar en gebaseerd op principes die niet veranderen. Als iets tegenstrijdig lijkt, moet dat worden opgelost. Dingen worden beoordeeld in duidelijke categorieën: goed of fout, correct of incorrect.",
    communication: "Communication is direct, structured, and often sequential. The Conceptual thinker prefers outlines, summaries, bullet points, and logical flow.",
    communicationId: "Komunikasi bersifat langsung, terstruktur, dan sering kali berurutan. Pemikir Konseptual menyukai kerangka, ringkasan, poin-poin utama, dan alur yang logis.",
    communicationNl: "Communicatie is direct, gestructureerd en vaak opeenvolgend. De Conceptuele denker geeft de voorkeur aan overzichten, samenvattingen, opsommingstekens en logische opbouw.",
    communicationQuote: "\"What exactly do you mean?\" · \"Let's define the problem clearly.\" · \"What is the main point?\"",
    communicationQuoteId: "\"Apa maksud Anda secara tepat?\" · \"Mari kita definisikan masalahnya dengan jelas.\" · \"Apa poin utamanya?\"",
    communicationQuoteNl: "\"Wat bedoel je precies?\" · \"Laten we het probleem duidelijk definiëren.\" · \"Wat is het hoofdpunt?\"",
    decisionMaking: "Decisions are based on analysis, principles, and evidence. Sufficient information is needed before concluding; measurable outcomes are preferred.",
    decisionMakingId: "Keputusan didasarkan pada analisis, prinsip, dan bukti. Informasi yang cukup dibutuhkan sebelum menarik kesimpulan; hasil yang terukur lebih disukai.",
    decisionMakingNl: "Beslissingen worden genomen op basis van analyse, principes en bewijs. Er is voldoende informatie nodig voordat een conclusie wordt getrokken; meetbare resultaten hebben de voorkeur.",
    strengths: ["Analytical problem-solving", "Clear communication", "Logical decision-making", "Consistent principles", "Structured planning"],
    strengthsId: ["Pemecahan masalah analitis", "Komunikasi yang jelas", "Pengambilan keputusan logis", "Prinsip yang konsisten", "Perencanaan terstruktur"],
    strengthsNl: ["Analytisch probleemoplossen", "Heldere communicatie", "Logische besluitvorming", "Consistente principes", "Gestructureerde planning"],
    blindspots: ["May miss relational nuance", "Can over-analyse before acting", "May dismiss intuitive knowing", "Risks reducing people to processes"],
    blindspotsId: ["Mungkin melewatkan nuansa relasional", "Bisa terlalu banyak menganalisis sebelum bertindak", "Mungkin mengabaikan pengetahuan intuitif", "Risiko mereduksi orang menjadi proses"],
    blindspotsNl: ["Mist mogelijk relationele nuance", "Kan te veel analyseren vóór er gehandeld wordt", "Kan intuïtieve kennis afwijzen", "Risico om mensen te reduceren tot processen"],
    relatingTo: [
      {
        img: "/head-holistic.png",
        titleEn: "Relating to the Holistic Thinker",
        titleId: "Berelasi dengan Pemikir Holistik",
        titleNl: "Omgaan met de Holistische Denker",
        bodyEn: "May feel the Holistic thinker is unclear or unfocused. When long stories replace main points, the Conceptual thinker thinks: \"Can we get to the conclusion?\"",
        bodyId: "Mungkin merasa Pemikir Holistik kurang jelas atau tidak fokus. Ketika cerita panjang menggantikan poin utama, Pemikir Konseptual berpikir: \"Bisakah kita langsung pada kesimpulan?\"",
        bodyNl: "Kan het gevoel hebben dat de Holistische denker onduidelijk of ongeconcentreerd is. Wanneer lange verhalen het hoofdpunt vervangen, denkt de Conceptuele denker: \"Kunnen we naar de conclusie?\"",
      },
      {
        img: "/head-intuitional.png",
        titleEn: "Relating to the Intuitional Thinker",
        titleId: "Berelasi dengan Pemikir Intuitif",
        titleNl: "Omgaan met de Intuïtieve Denker",
        bodyEn: "Feels uncomfortable when the Intuitional thinker speaks in impressions without clear explanation. \"I sense this is right\" may feel insufficient.",
        bodyId: "Merasa tidak nyaman ketika Pemikir Intuitif berbicara dalam kesan tanpa penjelasan yang jelas. \"Saya merasakan ini benar\" dapat terasa kurang kuat.",
        bodyNl: "Voelt zich ongemakkelijk wanneer de Intuïtieve denker spreekt in indrukken zonder duidelijke uitleg. \"Ik voel dat dit juist is\" kan onvoldoende aanvoelen.",
      },
    ],
    quote: '"Not everything can be reduced to a formula — but having one helps."',
    quoteId: '"Tidak semua hal bisa dirumuskan — tapi memiliki rumus sangat membantu."',
    quoteNl: '"Niet alles kan tot een formule worden herleid — maar er één hebben helpt enorm."',
    img: "/head-conceptual.png",
    imgAlt: "Conceptual Thinker",
  },
  {
    key: "holistic",
    color: "oklch(48% 0.18 145)",
    colorLight: "oklch(62% 0.14 145)",
    colorVeryLight: "oklch(92% 0.04 145)",
    bg: "oklch(18% 0.10 145)",
    tagline: "Relationships. Context. Wholeness.",
    taglineId: "Hubungan. Konteks. Keutuhan.",
    taglineNl: "Relaties. Context. Volledigheid.",
    overview: "The Holistic thinker sees reality as interconnected. Beginning with the whole, then moving to details. Life is understood as a web of relationships where everything affects everything else.",
    overviewId: "Pemikir Holistik melihat realitas sebagai sesuatu yang saling terhubung. Memulai dari keseluruhan, lalu bergerak menuju detail. Hidup dipahami sebagai jejaring relasi di mana segala sesuatu saling memengaruhi.",
    overviewNl: "De Holistische denker ziet de werkelijkheid als onderling verbonden. Begint met het geheel, beweegt dan naar details. Het leven wordt begrepen als een web van relaties waarin alles elkaar beïnvloedt.",
    viewOfTruth: "Truth is relational and contextual. Tension and apparent contradiction can exist without immediate resolution. Change is a natural part of life.",
    viewOfTruthId: "Kebenaran bersifat relasional dan kontekstual. Ketegangan dan pertentangan yang tampak dapat tetap ada tanpa harus segera diselesaikan. Perubahan dipandang sebagai bagian alami dari kehidupan.",
    viewOfTruthNl: "Waarheid is relationeel en contextueel. Spanning en schijnbare tegenstrijdigheid kunnen bestaan zonder onmiddellijke oplossing. Verandering is een natuurlijk onderdeel van het leven.",
    communication: "Communication often includes stories, metaphors, examples, and references to shared experiences. The Holistic thinker values harmony and relational balance.",
    communicationId: "Komunikasi sering kali mencakup cerita, metafora, contoh, dan rujukan pada pengalaman bersama. Pemikir Holistik menghargai keharmonisan dan keseimbangan relasional.",
    communicationNl: "Communicatie omvat vaak verhalen, metaforen, voorbeelden en verwijzingen naar gedeelde ervaringen. De Holistische denker waardeert harmonie en relationeel evenwicht.",
    communicationQuote: "\"We need to look at the bigger picture.\" · \"How will this affect everyone?\" · \"Let's think about long-term impact.\"",
    communicationQuoteId: "\"Kita perlu melihat gambaran besarnya.\" · \"Bagaimana hal ini akan memengaruhi semua orang?\" · \"Mari kita pikirkan dampak jangka panjangnya.\"",
    communicationQuoteNl: "\"We moeten het grotere geheel bekijken.\" · \"Hoe zal dit iedereen beïnvloeden?\" · \"Laten we nadenken over de impact op de lange termijn.\"",
    decisionMaking: "Decisions consider impact on the whole system: people, relationships, timing, and future consequences. Harmony and sustainability are important factors.",
    decisionMakingId: "Keputusan mempertimbangkan dampaknya terhadap keseluruhan sistem: orang-orang, relasi, waktu, dan konsekuensi di masa depan. Keharmonisan dan keberlanjutan menjadi faktor penting.",
    decisionMakingNl: "Beslissingen houden rekening met de impact op het gehele systeem: mensen, relaties, timing en toekomstige gevolgen. Harmonie en duurzaamheid zijn belangrijke factoren.",
    strengths: ["Systems thinking", "Relational intelligence", "Building team unity", "Long-view perspective", "Bridge-building across differences"],
    strengthsId: ["Pemikiran sistemik", "Kecerdasan relasional", "Membangun persatuan tim", "Perspektif jangka panjang", "Membangun jembatan lintas perbedaan"],
    strengthsNl: ["Systeemdenken", "Relationele intelligentie", "Teamsamenhang opbouwen", "Langetermijnperspectief", "Bruggen bouwen over verschillen heen"],
    blindspots: ["May avoid necessary directness", "Can prioritise harmony over truth", "May lose focus in the details", "Risks over-explaining context"],
    blindspotsId: ["Mungkin menghindari ketegasan yang diperlukan", "Bisa memprioritaskan harmoni di atas kebenaran", "Mungkin kehilangan fokus dalam detail", "Risiko terlalu banyak menjelaskan konteks"],
    blindspotsNl: ["Kan noodzakelijke directheid vermijden", "Kan harmonie boven waarheid stellen", "Kan focus verliezen in de details", "Risico van overmatig uitleggen van context"],
    relatingTo: [
      {
        img: "/head-conceptual.png",
        titleEn: "Relating to the Conceptual Thinker",
        titleId: "Berelasi dengan Pemikir Konseptual",
        titleNl: "Omgaan met de Conceptuele Denker",
        bodyEn: "Appreciates clarity and structure, but tension arises when discussions become too analytical. May feel that the Conceptual thinker misses the bigger picture.",
        bodyId: "Menghargai kejelasan dan struktur, tetapi ketegangan muncul ketika diskusi menjadi terlalu analitis. Mungkin merasa bahwa Pemikir Konseptual melewatkan gambaran besar.",
        bodyNl: "Waardeert helderheid en structuur, maar spanning ontstaat wanneer discussies te analytisch worden. Kan het gevoel hebben dat de Conceptuele denker het grotere geheel mist.",
      },
      {
        img: "/head-intuitional.png",
        titleEn: "Relating to the Intuitional Thinker",
        titleId: "Berelasi dengan Pemikir Intuitif",
        titleNl: "Omgaan met de Intuïtieve Denker",
        bodyEn: "Often comfortable together — both value meaning beyond pure logic and appreciate symbolism and depth. Tension arises when harmony is prioritized over conviction.",
        bodyId: "Sering merasa nyaman bersama — keduanya menghargai makna yang melampaui logika murni dan menghargai simbolisme serta kedalaman. Ketegangan muncul ketika keharmonisan diprioritaskan di atas keyakinan.",
        bodyNl: "Voelt zich vaak prettig samen — beiden waarderen betekenis voorbij pure logica en hechten aan symboliek en diepgang. Spanning ontstaat wanneer harmonie wordt geprioriteerd boven overtuiging.",
      },
    ],
    quote: '"Everything is connected. You can\'t understand the part without understanding the whole."',
    quoteId: '"Segalanya saling terhubung. Anda tidak bisa memahami bagian tanpa memahami keseluruhan."',
    quoteNl: '"Alles is met elkaar verbonden. Je kunt het deel niet begrijpen zonder het geheel te begrijpen."',
    img: "/head-holistic.png",
    imgAlt: "Holistic Thinker",
  },
  {
    key: "intuitional",
    color: "oklch(48% 0.18 300)",
    colorLight: "oklch(62% 0.14 300)",
    colorVeryLight: "oklch(92% 0.04 300)",
    bg: "oklch(18% 0.12 300)",
    tagline: "Perception. Depth. Discernment.",
    taglineId: "Persepsi. Kedalaman. Kepekaan.",
    taglineNl: "Waarneming. Diepgang. Onderscheiding.",
    overview: "The Intuitional thinker processes reality through experience, perception, and inner awareness. Meaning is often sensed before it is explained. Some truths must be encountered rather than analyzed.",
    overviewId: "Pemikir Intuitif memproses realitas melalui pengalaman, persepsi, dan kesadaran batin. Makna sering kali dirasakan sebelum dapat dijelaskan. Beberapa kebenaran perlu dialami, bukan sekadar dianalisis.",
    overviewNl: "De Intuïtieve denker verwerkt de werkelijkheid via ervaring, waarneming en innerlijk bewustzijn. Betekenis wordt vaak gevoeld voordat het wordt uitgelegd. Sommige waarheden moeten worden ondervonden in plaats van geanalyseerd.",
    viewOfTruth: "Truth is discovered through insight, reflection, and sometimes revelation. Authenticity and depth are central. Mystery is not a weakness — it is part of reality.",
    viewOfTruthId: "Kebenaran ditemukan melalui wawasan, perenungan, dan terkadang melalui pewahyuan. Keaslian dan kedalaman menjadi hal yang utama. Misteri bukanlah kelemahan — itu adalah bagian dari realitas.",
    viewOfTruthNl: "Waarheid wordt ontdekt via inzicht, reflectie en soms openbaring. Authenticiteit en diepgang staan centraal. Mysterie is geen zwakte — het is een deel van de werkelijkheid.",
    communication: "Language tends to be reflective, metaphorical, and atmosphere-sensitive. The Intuitional thinker communicates through impression and resonance as much as argument.",
    communicationId: "Bahasa cenderung reflektif, metaforis, dan peka terhadap suasana. Pemikir Intuitif berkomunikasi melalui kesan dan resonansi sama seperti melalui argumen.",
    communicationNl: "Taal is doorgaans reflectief, metaforisch en sfeergevoelig. De Intuïtieve denker communiceert even zozeer via indruk en resonantie als via argumentatie.",
    communicationQuote: "\"I sense something is happening here.\" · \"There is something deeper.\" · \"I cannot fully explain it, but I know this matters.\"",
    communicationQuoteId: "\"Saya merasakan sesuatu sedang terjadi.\" · \"Ada sesuatu yang lebih dalam.\" · \"Saya tidak bisa menjelaskannya sepenuhnya, tetapi saya tahu ini penting.\"",
    communicationQuoteNl: "\"Ik voel dat hier iets speelt.\" · \"Er is iets diepers.\" · \"Ik kan het niet volledig uitleggen, maar ik weet dat dit ertoe doet.\"",
    decisionMaking: "Decisions are influenced by inner conviction, perception, and discernment. Context, timing, and atmosphere are significant factors in the process.",
    decisionMakingId: "Keputusan dipengaruhi oleh keyakinan batin, persepsi, dan kepekaan rohani. Konteks, waktu, dan suasana menjadi faktor yang signifikan dalam prosesnya.",
    decisionMakingNl: "Beslissingen worden beïnvloed door innerlijke overtuiging, waarneming en onderscheidingsvermogen. Context, timing en sfeer zijn significante factoren in het proces.",
    strengths: ["Reading atmospheres and people", "Sensing unspoken dynamics", "Spiritual discernment", "Deep listening", "Seeing beneath the surface"],
    strengthsId: ["Membaca suasana dan orang-orang", "Merasakan dinamika yang tidak terucapkan", "Kepekaan rohani", "Mendengarkan dengan mendalam", "Melihat di balik permukaan"],
    strengthsNl: ["Sferen en mensen aanvoelen", "Onuitgesproken dynamieken waarnemen", "Geestelijk onderscheidingsvermogen", "Diep luisteren", "Onder de oppervlakte zien"],
    blindspots: ["May struggle to explain insights clearly", "Can feel misunderstood by more analytical colleagues", "May resist structure even when it would help", "Risks acting on impression without verification"],
    blindspotsId: ["Mungkin kesulitan menjelaskan wawasan dengan jelas", "Bisa merasa kurang dipahami oleh rekan yang lebih analitis", "Mungkin menolak struktur bahkan ketika itu membantu", "Risiko bertindak berdasarkan kesan tanpa verifikasi"],
    blindspotsNl: ["Kan moeite hebben inzichten duidelijk te verwoorden", "Kan zich onbegrepen voelen door meer analytische collega's", "Kan structuur afwijzen ook als die zou helpen", "Risico van handelen op indruk zonder verificatie"],
    relatingTo: [
      {
        img: "/head-conceptual.png",
        titleEn: "Relating to the Conceptual Thinker",
        titleId: "Berelasi dengan Pemikir Konseptual",
        titleNl: "Omgaan met de Conceptuele Denker",
        bodyEn: "May feel restricted or misunderstood. Detailed analysis can feel draining. The Intuitional thinker thinks: \"Not everything can be explained.\"",
        bodyId: "Mungkin merasa dibatasi atau kurang dipahami. Analisis yang rinci dapat terasa melelahkan. Pemikir Intuitif berpikir: \"Tidak semua hal dapat dijelaskan.\"",
        bodyNl: "Kan zich beperkt of onbegrepen voelen. Gedetailleerde analyse kan vermoeiend aanvoelen. De Intuïtieve denker denkt: \"Niet alles kan worden uitgelegd.\"",
      },
      {
        img: "/head-holistic.png",
        titleEn: "Relating to the Holistic Thinker",
        titleId: "Berelasi dengan Pemikir Holistik",
        titleNl: "Omgaan met de Holistische Denker",
        bodyEn: "Often appreciates the Holistic thinker's relational awareness. Both are sensitive to atmosphere. Tension arises when group harmony is prioritized over deep personal conviction.",
        bodyId: "Sering menghargai kesadaran relasional Pemikir Holistik. Keduanya peka terhadap suasana. Ketegangan muncul ketika keharmonisan kelompok diprioritaskan di atas keyakinan pribadi yang mendalam.",
        bodyNl: "Waardeert vaak het relationele bewustzijn van de Holistische denker. Beiden zijn gevoelig voor sfeer. Spanning ontstaat wanneer groepsharmonie wordt geprioriteerd boven diepe persoonlijke overtuiging.",
      },
    ],
    quote: '"Not everything can be explained. But that doesn\'t mean it isn\'t real."',
    quoteId: '"Tidak semua hal bisa dijelaskan. Tapi bukan berarti itu tidak nyata."',
    quoteNl: '"Niet alles kan worden uitgelegd. Maar dat betekent niet dat het niet echt is."',
    img: "/head-intuitional.png",
    imgAlt: "Intuitional Thinker",
  },
];

// ── COMPARISON TABLE DATA ─────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  { labelEn: "Core Focus", labelId: "Fokus Utama", labelNl: "Kernfocus", C: { en: "Structure & logic", id: "Struktur & logika", nl: "Structuur & logica" }, H: { en: "Relationships & connections", id: "Relasi & keterhubungan", nl: "Relaties & verbanden" }, I: { en: "Experience & insight", id: "Pengalaman & wawasan", nl: "Ervaring & inzicht" } },
  { labelEn: "Thinking Direction", labelId: "Arah Berpikir", labelNl: "Denkrichting", C: { en: "Parts → Whole", id: "Bagian → Keseluruhan", nl: "Delen → Geheel" }, H: { en: "Whole → Parts", id: "Keseluruhan → Bagian", nl: "Geheel → Delen" }, I: { en: "Experience → Meaning", id: "Pengalaman → Makna", nl: "Ervaring → Betekenis" } },
  { labelEn: "Primary Question", labelId: "Pertanyaan Utama", labelNl: "Centrale vraag", C: { en: '"What is the main point?"', id: '"Apa poin utamanya?"', nl: '"Wat is het hoofdpunt?"' }, H: { en: '"How does this connect?"', id: '"Bagaimana ini saling terhubung?"', nl: '"Hoe hangt dit samen?"' }, I: { en: '"What is really happening beneath this?"', id: '"Apa yang sebenarnya terjadi di balik ini?"', nl: '"Wat speelt er echt achter dit?"' } },
  { labelEn: "View of Truth", labelId: "Pandangan Kebenaran", labelNl: "Kijk op waarheid", C: { en: "Defined, consistent, principle-based", id: "Terdefinisi, konsisten, berbasis prinsip", nl: "Omschreven, consistent, principieel" }, H: { en: "Contextual, relational, integrated", id: "Kontekstual, relasional, terintegrasi", nl: "Contextueel, relationeel, geïntegreerd" }, I: { en: "Revealed, perceived, experiential", id: "Diungkapkan, dipersepsikan, dialami", nl: "Onthuld, waargenomen, ervaringsgericht" } },
  { labelEn: "Contradiction", labelId: "Kontradiksi", labelNl: "Tegenstrijdigheid", C: { en: "Must be resolved", id: "Harus diselesaikan", nl: "Moet worden opgelost" }, H: { en: "Can coexist in tension", id: "Dapat hidup dalam ketegangan", nl: "Kan in spanning samengaan" }, I: { en: "May hold paradox as mystery", id: "Dapat memegang paradoks sebagai misteri", nl: "Kan paradox als mysterie bevatten" } },
  { labelEn: "Communication", labelId: "Komunikasi", labelNl: "Communicatie", C: { en: "Direct, structured, analytical", id: "Langsung, terstruktur, analitis", nl: "Direct, gestructureerd, analytisch" }, H: { en: "Story-based, relational, illustrative", id: "Berbasis cerita, relasional, ilustratif", nl: "Verhaalgebaseerd, relationeel, illustratief" }, I: { en: "Reflective, symbolic, emotional", id: "Reflektif, simbolis, emosional", nl: "Reflectief, symbolisch, emotioneel" } },
  { labelEn: "Decision Basis", labelId: "Dasar Keputusan", labelNl: "Beslissingsbasis", C: { en: "Analysis & logic", id: "Analisis & logika", nl: "Analyse & logica" }, H: { en: "Impact on people & system", id: "Dampak pada orang & sistem", nl: "Impact op mensen & systeem" }, I: { en: "Inner conviction & discernment", id: "Keyakinan batin & kepekaan", nl: "Innerlijke overtuiging & onderscheiding" } },
  { labelEn: "Response to Conflict", labelId: "Respons Konflik", labelNl: "Reactie op conflict", C: { en: "Clarify facts and principles", id: "Mengklarifikasi fakta & prinsip", nl: "Feiten en principes verduidelijken" }, H: { en: "Seek harmony and balance", id: "Mencari keharmonisan & keseimbangan", nl: "Harmonie en balans zoeken" }, I: { en: "Sense emotional undercurrents", id: "Merasakan arus emosional yang mendasari", nl: "Emotionele onderstroom voelen" } },
  { labelEn: "Leadership Contribution", labelId: "Kontribusi Kepemimpinan", labelNl: "Leiderschapsbijdrage", C: { en: "Structure and direction", id: "Struktur & arah", nl: "Structuur & richting" }, H: { en: "Unity and cohesion", id: "Persatuan & kohesi", nl: "Eenheid & cohesie" }, I: { en: "Spiritual and emotional depth", id: "Kedalaman spiritual & emosional", nl: "Spirituele & emotionele diepgang" } },
  { labelEn: "Comfort Zone", labelId: "Zona Nyaman", labelNl: "Comfortzone", C: { en: "Certainty & order", id: "Kepastian & keteraturan", nl: "Zekerheid & orde" }, H: { en: "Complexity & connection", id: "Kompleksitas & keterhubungan", nl: "Complexiteit & verbondenheid" }, I: { en: "Mystery & atmosphere", id: "Misteri & suasana", nl: "Mysterie & sfeer" } },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

type Lang = "en" | "id" | "nl";
type ScoreKey = "C" | "H" | "I";
type QuizState = "idle" | "active" | "done";

export default function ThinkingStylesClient({
  userPathway,
  isSaved: isSavedProp,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<ScoreKey, number>>({ C: 0, H: 0, I: 0 });
  const [shuffledOptions, setShuffledOptions] = useState<typeof QS[0]["options"]>([]);
  const [saved, setSaved] = useState(isSavedProp);
  const [resultSaved, setResultSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const tr = (en: string, id: string, nl: string) => lang === "en" ? en : lang === "id" ? id : nl;

  function startQuiz() {
    setCurrentQ(0);
    setScores({ C: 0, H: 0, I: 0 });
    setShuffledOptions([...QS[0].options].sort(() => Math.random() - 0.5));
    setQuizState("active");
    window.scrollTo({ top: document.getElementById("quiz-section")?.offsetTop ?? 0, behavior: "smooth" });
  }

  function handleAnswer(t: ScoreKey) {
    const newScores = { ...scores, [t]: scores[t] + 1 };
    if (currentQ < QS.length - 1) {
      const next = currentQ + 1;
      setScores(newScores);
      setCurrentQ(next);
      setShuffledOptions([...QS[next].options].sort(() => Math.random() - 0.5));
    } else {
      setScores(newScores);
      setQuizState("done");
    }
  }

  function retake() {
    setQuizState("idle");
    setCurrentQ(0);
    setScores({ C: 0, H: 0, I: 0 });
  }

  const total = scores.C + scores.H + scores.I;
  const resultKey = total > 0 ? getResultKey(scores.C, scores.H, scores.I) : "CHI";
  const resultText = RESULTS[lang][resultKey];

  const pC = total > 0 ? Math.round((scores.C / total) * 100) : 0;
  const pH = total > 0 ? Math.round((scores.H / total) * 100) : 0;
  const pI = total > 0 ? 100 - pC - pH : 0;

  const showAddToDashboard = userPathway !== null;

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("three-thinking-styles");
      if (!result.error) setSaved(true);
    });
  }

  function handleSaveResult() {
    startTransition(async () => {
      await saveThinkingStyleResult(resultKey, { C: pC, H: pH, I: pI });
      setResultSaved(true);
    });
  }

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

        {/* Faint background heads */}
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "clamp(-4rem, 0vw, 2rem)",
          bottom: 0,
          display: "flex",
          alignItems: "flex-end",
          gap: "clamp(-3rem, -2vw, -1rem)",
          opacity: 0.15,
          pointerEvents: "none",
          userSelect: "none",
        }}>
          <Image src="/head-conceptual.png" alt="" width={180} height={220} style={{ objectFit: "contain" }} />
          <Image src="/head-holistic.png" alt="" width={220} height={270} style={{ objectFit: "contain", transform: "translateY(-2rem)" }} />
          <Image src="/head-intuitional.png" alt="" width={180} height={220} style={{ objectFit: "contain" }} />
        </div>

        <div className="container-wide" style={{ position: "relative" }}>
          {/* Breadcrumb */}
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← Content Library
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
          <h1 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "1rem", maxWidth: "14ch" }}>
            {lang === "en"
              ? <>Three<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Thinking Styles.</span></>
              : lang === "id"
              ? <>Tiga<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Gaya Berpikir.</span></>
              : <>Drie<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Denkstijlen.</span></>}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem" }}>
            {tr(
              <>When leaders understand thinking patterns, they stop taking differences personally. &ldquo;Why are they so difficult?&rdquo; becomes &ldquo;How are they processing this differently?&rdquo;</> as unknown as string,
              <>Ketika pemimpin memahami pola-pola berpikir, mereka berhenti memandang perbedaan secara pribadi. &ldquo;Mengapa mereka begitu sulit?&rdquo; berubah menjadi &ldquo;Bagaimana mereka memproses hal ini secara berbeda?&rdquo;</> as unknown as string,
              <>Wanneer leiders denkpatronen begrijpen, houden ze op om verschillen persoonlijk op te vatten. &ldquo;Waarom zijn zij zo moeilijk?&rdquo; wordt &ldquo;Hoe verwerken zij dit anders?&rdquo;</> as unknown as string,
            ) as unknown as React.ReactNode}
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "3rem" }}>
            <button onClick={startQuiz} className="btn-primary">
              {tr("Discover Your Style →", "Temukan Gaya Anda →", "Ontdek Jouw Stijl →")}
            </button>
            <a href="#conceptual" className="btn-ghost" style={{ textDecoration: "none" }}>
              {tr("Explore the Styles", "Jelajahi Gaya-Gaya", "Verken de stijlen")}
            </a>
            {showAddToDashboard && (
              saved ? (
                <Link href="/dashboard" style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "oklch(72% 0.14 145)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}>
                  ✓ {tr("In your dashboard", "Di dashboard Anda", "In jouw dashboard")}
                </Link>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "oklch(97% 0.005 80)",
                    background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)",
                    border: "none",
                    padding: "0.625rem 1.25rem",
                    cursor: isPending ? "wait" : "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {isPending
                    ? tr("Saving…", "Menyimpan…", "Opslaan…")
                    : tr("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                </button>
              )
            )}
          </div>

          {/* Labeled heads row */}
          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "flex-end" }}>
            {[
              { img: "/head-conceptual.png", labelEn: "Conceptual", labelId: "Konseptual", labelNl: "Conceptueel", color: "oklch(62% 0.14 250)" },
              { img: "/head-holistic.png", labelEn: "Holistic", labelId: "Holistik", labelNl: "Holistisch", color: "oklch(62% 0.14 145)" },
              { img: "/head-intuitional.png", labelEn: "Intuitional", labelId: "Intuitif", labelNl: "Intuïtief", color: "oklch(62% 0.14 300)" },
            ].map((h, i) => (
              <a key={h.labelEn} href={`#${h.labelEn.toLowerCase()}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
                <Image
                  src={h.img}
                  alt={h.labelEn}
                  width={i === 1 ? 88 : 72}
                  height={i === 1 ? 108 : 88}
                  style={{ objectFit: "contain", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))", transform: i === 1 ? "translateY(-1rem)" : "none" }}
                />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: h.color }}>
                  {tr(h.labelEn, h.labelId, h.labelNl)}
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

            {/* Left: intro text + style nav */}
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
                {tr("A Diagnostic Tool", "Alat Diagnostik", "Een diagnostisch instrument")}
              </p>
              <h2 className="t-section" style={{ marginBottom: "1.5rem" }}>
                {lang === "en" ? <>Understanding how people<br />process reality.</> : lang === "id" ? <>Memahami cara orang<br />memproses realitas.</> : <>Begrijpen hoe mensen<br />de werkelijkheid verwerken.</>}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch", marginBottom: "1rem" }}>
                {tr(
                  "Most people can use all three styles, but usually one is dominant. Understanding these styles increases self-awareness, strengthens teamwork, and improves communication across every kind of difference.",
                  "Sebagian besar orang dapat menggunakan ketiga gaya ini, namun biasanya satu menjadi dominan. Memahami gaya-gaya ini meningkatkan kesadaran diri, memperkuat kerja sama tim, dan memperbaiki komunikasi di tengah berbagai perbedaan.",
                  "De meeste mensen kunnen alle drie stijlen gebruiken, maar doorgaans is één dominant. Het begrijpen van deze stijlen vergroot zelfbewustzijn, versterkt teamwerk en verbetert communicatie over alle soorten verschillen heen."
                )}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch", marginBottom: "2.5rem" }}>
                {tr(
                  "When leaders understand thinking patterns, they stop taking differences personally. Instead of \"Why are they so difficult?\" the question becomes \"How are they processing this differently?\"",
                  "Ketika pemimpin memahami pola-pola berpikir, mereka berhenti memandang perbedaan secara pribadi. Alih-alih \"Mengapa mereka begitu sulit?\" pertanyaannya berubah menjadi \"Bagaimana mereka memproses hal ini secara berbeda?\"",
                  "Wanneer leiders denkpatronen begrijpen, houden ze op om verschillen persoonlijk op te vatten. In plaats van \"Waarom zijn zij zo moeilijk?\" wordt de vraag: \"Hoe verwerken zij dit anders?\""
                )}
              </p>

              {/* Style navigation */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { href: "#conceptual", labelEn: "Conceptual Thinking", labelId: "Pemikiran Konseptual", labelNl: "Conceptueel Denken", subEn: "Structure · Logic · Clarity", subId: "Struktur · Logika · Kejelasan", subNl: "Structuur · Logica · Helderheid", img: "/head-conceptual.png", bg: "oklch(92% 0.04 250)", border: "oklch(80% 0.08 250)", nameColor: "oklch(38% 0.16 250)" },
                  { href: "#holistic", labelEn: "Holistic Thinking", labelId: "Pemikiran Holistik", labelNl: "Holistisch Denken", subEn: "Relationships · Connection · Harmony", subId: "Relasi · Keterhubungan · Keharmonisan", subNl: "Relaties · Verbondenheid · Harmonie", img: "/head-holistic.png", bg: "oklch(92% 0.04 145)", border: "oklch(80% 0.08 145)", nameColor: "oklch(38% 0.16 145)" },
                  { href: "#intuitional", labelEn: "Intuitional Thinking", labelId: "Pemikiran Intuitif", labelNl: "Intuïtief Denken", subEn: "Experience · Insight · Depth", subId: "Pengalaman · Wawasan · Kedalaman", subNl: "Ervaring · Inzicht · Diepgang", img: "/head-intuitional.png", bg: "oklch(92% 0.04 300)", border: "oklch(80% 0.08 300)", nameColor: "oklch(38% 0.16 300)" },
                ].map(item => (
                  <a key={item.href} href={item.href} style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.875rem 1.125rem",
                    background: item.bg, border: `1px solid ${item.border}`,
                    textDecoration: "none", transition: "transform 0.2s ease",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(4px)"}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.transform = "none"}
                  >
                    <Image src={item.img} alt="" width={36} height={36} style={{ objectFit: "contain", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, color: item.nameColor, lineHeight: 1.3 }}>
                        {tr(item.labelEn, item.labelId, item.labelNl)}
                      </div>
                      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", letterSpacing: "0.08em", color: "oklch(58% 0.008 260)", marginTop: "0.125rem" }}>
                        {tr(item.subEn, item.subId, item.subNl)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right: learning outcomes */}
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span>{tr("What you'll be able to do", "Yang akan Anda mampu lakukan", "Wat je straks kunt doen")}</span>
                <span style={{ flex: 1, height: "1px", background: "oklch(65% 0.15 45 / 0.3)" }} />
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {[
                  {
                    num: "01",
                    en: "Recognize your own default thinking pattern and understand how it shapes your leadership strengths and blind spots.",
                    id: "Mengenali pola berpikir utama Anda sendiri dan memahami bagaimana hal itu membentuk kekuatan serta titik buta dalam kepemimpinan Anda.",
                    nl: "Jouw eigen dominante denkpatroon herkennen en begrijpen hoe het je leiderschapskrachten en blinde vlekken vormt.",
                  },
                  {
                    num: "02",
                    en: "Identify how others process information and adapt your communication for greater clarity and connection.",
                    id: "Mengidentifikasi bagaimana orang lain memproses informasi dan menyesuaikan komunikasi Anda untuk menciptakan kejelasan dan koneksi yang lebih baik.",
                    nl: "Identificeren hoe anderen informatie verwerken en je communicatie aanpassen voor meer helderheid en verbinding.",
                  },
                  {
                    num: "03",
                    en: "Interpret team tension more accurately by distinguishing personality conflict from thinking differences.",
                    id: "Menafsirkan ketegangan dalam tim dengan lebih akurat dengan membedakan antara konflik kepribadian dan perbedaan gaya berpikir.",
                    nl: "Teamspanning nauwkeuriger interpreteren door persoonlijkheidsconflict te onderscheiden van denkverschillen.",
                  },
                  {
                    num: "04",
                    en: "Build more balanced teams by intentionally valuing complementary styles rather than surrounding yourself with people who think the same way you do.",
                    id: "Membangun tim yang lebih seimbang dengan secara sadar menghargai gaya yang saling melengkapi, bukan hanya dikelilingi oleh orang-orang yang berpikir sama seperti Anda.",
                    nl: "Meer evenwichtige teams opbouwen door bewust complementaire stijlen te waarderen in plaats van jezelf te omringen met mensen die op dezelfde manier denken.",
                  },
                ].map(item => (
                  <div key={item.num} style={{ display: "flex", gap: "1.125rem", alignItems: "flex-start", padding: "1.25rem", background: "white", border: "1px solid oklch(88% 0.008 80)" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.72rem", color: "oklch(65% 0.15 45)", letterSpacing: "0.06em", flexShrink: 0, marginTop: "0.1em" }}>{item.num}</span>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.65, color: "oklch(42% 0.008 260)", margin: 0 }}>
                      {tr(item.en, item.id, item.nl)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STYLE SECTIONS ── */}
      {STYLES.map((style, styleIdx) => (
        <section key={style.key} id={style.key}>

          {/* Dark title header */}
          <div style={{ background: style.bg, paddingTop: "clamp(3rem, 5vw, 5rem)", paddingBottom: "clamp(2.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
            <div className="container-wide" style={{ position: "relative" }}>
              <p className="t-label" style={{ color: style.colorLight, marginBottom: "0.625rem", fontSize: "0.6rem" }}>
                {`0${styleIdx + 1} / 03 — ${tr("Thinking Style", "Gaya Berpikir", "Denkstijl")}`}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center" }}>
                <div>
                  <h2 className="t-hero" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.5rem", lineHeight: 0.95 }}>
                    {lang === "en"
                      ? (style.key === "conceptual" ? "Conceptual" : style.key === "holistic" ? "Holistic" : "Intuitional") + " Thinking"
                      : lang === "id"
                      ? (style.key === "conceptual" ? "Pemikiran Konseptual" : style.key === "holistic" ? "Pemikiran Holistik" : "Pemikiran Intuitif")
                      : (style.key === "conceptual" ? "Conceptueel Denken" : style.key === "holistic" ? "Holistisch Denken" : "Intuïtief Denken")}
                  </h2>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.125rem", fontStyle: "italic", color: "oklch(72% 0.04 260)", marginBottom: "1.5rem" }}>
                    {tr(style.tagline, style.taglineId, style.taglineNl)}
                  </p>
                  <p className="t-tagline" style={{ color: style.colorLight, fontStyle: "italic", maxWidth: "52ch" }}>
                    {tr(style.quote, style.quoteId, style.quoteNl)}
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Image
                    src={style.img}
                    alt={style.imgAlt}
                    width={150}
                    height={185}
                    style={{ objectFit: "contain", filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.4))" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Light content area */}
          <div style={{ background: "oklch(97% 0.005 80)", paddingBlock: "clamp(3rem, 5vw, 5rem)" }}>
            <div className="container-wide">
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>

                {/* Row 1: Overview */}
                <div style={{ background: "white", padding: "2rem 2.5rem" }}>
                  <p className="t-label" style={{ color: style.color, marginBottom: "0.875rem", fontSize: "0.6rem" }}>
                    {tr("Core Orientation", "Orientasi Utama", "Kernoriëntatie")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(32% 0.008 260)", maxWidth: "80ch" }}>
                    {tr(style.overview, style.overviewId, style.overviewNl)}
                  </p>
                </div>

                {/* Row 2: View of Truth + Decision-Making */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  <div style={{ background: "white", padding: "2rem 2.5rem" }}>
                    <p className="t-label" style={{ color: style.color, marginBottom: "0.875rem", fontSize: "0.6rem" }}>
                      {tr("View of Truth", "Pandangan tentang Kebenaran", "Kijk op waarheid")}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(42% 0.008 260)" }}>
                      {tr(style.viewOfTruth, style.viewOfTruthId, style.viewOfTruthNl)}
                    </p>
                  </div>
                  <div style={{ background: "white", padding: "2rem 2.5rem" }}>
                    <p className="t-label" style={{ color: style.color, marginBottom: "0.875rem", fontSize: "0.6rem" }}>
                      {tr("Decision-Making", "Pengambilan Keputusan", "Besluitvorming")}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(42% 0.008 260)" }}>
                      {tr(style.decisionMaking, style.decisionMakingId, style.decisionMakingNl)}
                    </p>
                  </div>
                </div>

                {/* Row 3: Communication Pattern */}
                <div style={{ background: "white", padding: "2rem 2.5rem" }}>
                  <p className="t-label" style={{ color: style.color, marginBottom: "0.875rem", fontSize: "0.6rem" }}>
                    {tr("Communication Pattern", "Pola Komunikasi", "Communicatiepatroon")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(42% 0.008 260)", marginBottom: "1rem", maxWidth: "80ch" }}>
                    {tr(style.communication, style.communicationId, style.communicationNl)}
                  </p>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.0625rem", fontStyle: "italic", color: style.color, lineHeight: 1.6, paddingLeft: "1.25rem", marginLeft: "0.125rem", borderLeft: `2px solid ${style.colorVeryLight}` }}>
                    {tr(style.communicationQuote, style.communicationQuoteId, style.communicationQuoteNl)}
                  </p>
                </div>

                {/* Row 4: Strengths + Growth Edges */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  <div style={{ background: "white", padding: "2rem 2.5rem" }}>
                    <p className="t-label" style={{ color: style.color, marginBottom: "1.25rem", fontSize: "0.6rem" }}>
                      {tr("Strengths", "Kekuatan", "Sterktes")}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {(lang === "en" ? style.strengths : lang === "id" ? style.strengthsId : style.strengthsNl).map(s => (
                        <li key={s} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(32% 0.008 260)", lineHeight: 1.5 }}>
                          <span style={{ color: style.color, fontWeight: 700, flexShrink: 0 }}>+</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: "white", padding: "2rem 2.5rem" }}>
                    <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1.25rem", fontSize: "0.6rem" }}>
                      {tr("Growth Edges", "Area Pertumbuhan", "Groeipunten")}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {(lang === "en" ? style.blindspots : lang === "id" ? style.blindspotsId : style.blindspotsNl).map(s => (
                        <li key={s} style={{ display: "flex", gap: "0.625rem", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(45% 0.008 260)", lineHeight: 1.5 }}>
                          <span style={{ color: "oklch(65% 0.008 260)", flexShrink: 0 }}>·</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Row 5: Relating To */}
                <div style={{ background: style.bg, padding: "0" }}>
                  <div style={{ padding: "1.5rem 2.5rem 1rem" }}>
                    <p className="t-label" style={{ color: style.colorLight, fontSize: "0.6rem" }}>
                      {tr("Relating to Other Styles", "Berelasi dengan Gaya Lain", "Omgaan met andere stijlen")}
                    </p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: `${style.color}33` }}>
                    {style.relatingTo.map(rel => (
                      <div key={rel.titleEn} style={{ background: `${style.bg}ee`, padding: "1.75rem 2.5rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                        <Image src={rel.img} alt="" width={40} height={40} style={{ objectFit: "contain", flexShrink: 0, opacity: 0.85 }} />
                        <div>
                          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", fontWeight: 600, color: "oklch(90% 0.005 80)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                            {tr(rel.titleEn, rel.titleId, rel.titleNl)}
                          </p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", lineHeight: 1.7, color: "oklch(70% 0.04 260)" }}>
                            {tr(rel.bodyEn, rel.bodyId, rel.bodyNl)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── COMPARISON TABLE ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(99% 0.002 80)" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
            {tr("Side by Side", "Perbandingan", "Naast elkaar")}
          </p>
          <h2 className="t-section" style={{ marginBottom: "0.75rem" }}>
            {lang === "en" ? <>How the styles<br />compare.</> : lang === "id" ? <>Perbandingan<br />ketiga gaya.</> : <>Hoe de stijlen<br />zich verhouden.</>}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(52% 0.008 260)", marginBottom: "2.5rem", maxWidth: "52ch" }}>
            {tr(
              "How the three styles differ across key leadership dimensions.",
              "Bagaimana ketiga gaya berpikir dibandingkan dalam dimensi kepemimpinan yang utama.",
              "Hoe de drie stijlen van elkaar verschillen op belangrijke leiderschapsdimensies."
            )}
          </p>

          <div style={{ overflowX: "auto", border: "1px solid oklch(88% 0.008 80)", background: "white" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: "oklch(22% 0.10 260)" }}>
                  <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", width: "180px" }}></th>
                  {[
                    { img: "/head-conceptual.png", labelEn: "Conceptual", labelId: "Konseptual", labelNl: "Conceptueel", color: "oklch(62% 0.14 250)" },
                    { img: "/head-holistic.png", labelEn: "Holistic", labelId: "Holistik", labelNl: "Holistisch", color: "oklch(62% 0.14 145)" },
                    { img: "/head-intuitional.png", labelEn: "Intuitional", labelId: "Intuitif", labelNl: "Intuïtief", color: "oklch(62% 0.14 300)" },
                  ].map(col => (
                    <th key={col.labelEn} style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
                      <Image src={col.img} alt={col.labelEn} width={40} height={40} style={{ objectFit: "contain", display: "block", margin: "0 auto 0.625rem" }} />
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: col.color, display: "block" }}>
                        {tr(col.labelEn, col.labelId, col.labelNl)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.labelEn} style={{ borderBottom: "1px solid oklch(92% 0.006 80)", background: i % 2 === 1 ? "oklch(98% 0.002 80)" : "white" }}>
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(32% 0.008 260)", whiteSpace: "nowrap" }}>
                      {tr(row.labelEn, row.labelId, row.labelNl)}
                    </td>
                    {(["C", "H", "I"] as const).map(k => (
                      <td key={k} style={{ padding: "1rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(42% 0.008 260)", textAlign: "center", lineHeight: 1.5 }}>
                        {tr(row[k].en, row[k].id, row[k].nl)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section id="quiz-section" style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)", position: "relative" }}>
        <div className="container-wide">
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>
            {tr("Self-Assessment", "Penilaian Diri", "Zelfevaluatie")}
          </p>
          <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>
            {tr("Discover your style.", "Temukan gaya Anda.", "Ontdek jouw stijl.")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", marginBottom: "3rem", maxWidth: "52ch" }}>
            {tr(
              "20 scenarios. Choose what feels most natural — not what you think you should do. Your result shows a percentage breakdown across all three styles.",
              "20 skenario. Pilih yang paling alami — bukan apa yang Anda pikir seharusnya Anda lakukan. Hasilnya menunjukkan persentase dari ketiga gaya berpikir.",
              "20 scenario's. Kies wat het meest natuurlijk aanvoelt — niet wat je denkt dat je zou moeten doen. Jouw resultaat toont een procentuele verdeling over alle drie de stijlen."
            )}
          </p>

          <div style={{ maxWidth: "680px", background: "oklch(30% 0.12 260)", overflow: "hidden" }}>
            <div style={{ height: "3px", background: "linear-gradient(90deg, oklch(48% 0.18 250), oklch(48% 0.18 145), oklch(48% 0.18 300))" }} />
            <div style={{ padding: "clamp(2rem, 4vw, 3.5rem)" }}>

              {quizState === "idle" && (
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                    {tr(
                      "Each scenario has three options. There are no right or wrong answers. Choose what feels most natural, not what you think you should do.",
                      "Setiap skenario memiliki tiga pilihan. Tidak ada jawaban yang benar atau salah. Pilih yang paling alami, bukan apa yang Anda pikir seharusnya Anda lakukan.",
                      "Elk scenario heeft drie opties. Er zijn geen goede of foute antwoorden. Kies wat het meest natuurlijk aanvoelt, niet wat je denkt dat je zou moeten doen."
                    )}
                  </p>
                  <button onClick={startQuiz} className="btn-primary">
                    {tr("Start Assessment →", "Mulai Kuis →", "Start de quiz →")}
                  </button>
                </div>
              )}

              {quizState === "active" && (
                <div>
                  <div style={{ marginBottom: "2rem" }}>
                    <div style={{ height: "2px", background: "oklch(97% 0.005 80 / 0.08)", marginBottom: "0.625rem" }}>
                      <div style={{ height: "100%", background: "oklch(65% 0.15 45)", width: `${((currentQ + 1) / QS.length) * 100}%`, transition: "width 0.4s ease" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(55% 0.008 260)" }}>
                      {currentQ + 1} {tr("of", "dari", "van")} {QS.length}
                    </p>
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "1.0625rem", color: "oklch(97% 0.005 80)", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                    {QS[currentQ][lang]}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {shuffledOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt.t as ScoreKey)}
                        style={{
                          fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.5,
                          color: "oklch(78% 0.04 260)", background: "oklch(97% 0.005 80 / 0.04)",
                          border: "1px solid oklch(97% 0.005 80 / 0.1)",
                          padding: "1rem 1.25rem", textAlign: "left", cursor: "pointer",
                          transition: "background 0.15s, border-color 0.15s, color 0.15s",
                          display: "flex", gap: "1rem", alignItems: "flex-start",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "oklch(97% 0.005 80 / 0.08)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(97% 0.005 80 / 0.2)";
                          (e.currentTarget as HTMLButtonElement).style.color = "oklch(97% 0.005 80)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "oklch(97% 0.005 80 / 0.04)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(97% 0.005 80 / 0.1)";
                          (e.currentTarget as HTMLButtonElement).style.color = "oklch(78% 0.04 260)";
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em", color: "oklch(55% 0.008 260)", flexShrink: 0, marginTop: "0.15rem" }}>
                          {["A", "B", "C"][i]}
                        </span>
                        {opt[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizState === "done" && (
                <div>
                  <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.5rem", fontSize: "0.62rem" }}>
                    {tr("Your Thinking Style", "Gaya Berpikir Anda", "Jouw Denkstijl")}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                    {[
                      { key: "C", labelEn: "Conceptual", labelId: "Konseptual", labelNl: "Conceptueel", pct: pC, color: "oklch(48% 0.18 250)" },
                      { key: "H", labelEn: "Holistic", labelId: "Holistik", labelNl: "Holistisch", pct: pH, color: "oklch(48% 0.18 145)" },
                      { key: "I", labelEn: "Intuitional", labelId: "Intuitif", labelNl: "Intuïtief", pct: pI, color: "oklch(48% 0.18 300)" },
                    ].map(bar => (
                      <div key={bar.key} style={{ display: "grid", gridTemplateColumns: "140px 1fr 48px", gap: "1rem", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Image src={`/head-${bar.key === "C" ? "conceptual" : bar.key === "H" ? "holistic" : "intuitional"}.png`} alt="" width={28} height={28} style={{ objectFit: "contain" }} />
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.04 260)", textTransform: "uppercase" }}>
                            {tr(bar.labelEn, bar.labelId, bar.labelNl)}
                          </span>
                        </div>
                        <div style={{ height: "6px", background: "oklch(97% 0.005 80 / 0.07)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${bar.pct}%`, background: bar.color, transition: "width 1s ease" }} />
                        </div>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, color: "oklch(78% 0.04 260)", textAlign: "right" }}>{bar.pct}%</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(78% 0.04 260)", marginBottom: "2rem" }}>
                    {resultText}
                  </p>
                  {/* Save result CTA */}
                  {showAddToDashboard && (
                    <div style={{ marginBottom: "1.5rem", padding: "1.25rem 1.5rem", background: "oklch(97% 0.005 80 / 0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.25rem", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", color: "oklch(95% 0.005 80)", marginBottom: "0.2rem" }}>
                          {tr("Save your result to your dashboard", "Simpan hasilmu ke dashboard", "Sla je resultaat op in je dashboard")}
                        </p>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(72% 0.04 260)" }}>
                          {tr("See your thinking style snapshot any time.", "Lihat gaya berpikirmu kapan saja.", "Bekijk je denkstijl altijd terug.")}
                        </p>
                      </div>
                      {resultSaved ? (
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, color: "oklch(55% 0.15 145)", whiteSpace: "nowrap" }}>
                          ✓ {tr("Saved to dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard")}
                        </span>
                      ) : (
                        <button
                          onClick={handleSaveResult}
                          disabled={isPending}
                          style={{
                            fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem",
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            background: "oklch(65% 0.15 45)", color: "oklch(14% 0.08 260)",
                            border: "none", padding: "0.65rem 1.5rem", cursor: isPending ? "wait" : "pointer",
                            whiteSpace: "nowrap", flexShrink: 0,
                          }}
                        >
                          {isPending ? tr("Saving…", "Menyimpan…", "Opslaan…") : tr("Save My Result →", "Simpan Hasilku →", "Sla op →")}
                        </button>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button onClick={retake} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(65% 0.04 260)", background: "none", border: "1px solid oklch(42% 0.008 260)", padding: "0.75rem 1.5rem", cursor: "pointer" }}>
                      {tr("Retake Quiz", "Ulangi Kuis", "Quiz opnieuw doen")}
                    </button>
                    {!showAddToDashboard ? (
                      <Link href="/signup" className="btn-primary" style={{ textDecoration: "none" }}>
                        {tr("Join the Community →", "Bergabung dengan Komunitas →", "Sluit je aan →")}
                      </Link>
                    ) : (
                      <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>
                        {tr("Go to Dashboard →", "Ke Dashboard →", "Naar dashboard →")}
                      </Link>
                    )}
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
              {tr("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de bibliotheek")}
            </p>
            <h2 className="t-section" style={{ marginBottom: "1rem" }}>
              {lang === "en" ? <>Part of the full<br />content library.</> : lang === "id" ? <>Bagian dari perpustakaan<br />konten lengkap.</> : <>Onderdeel van de volledige<br />inhoudsbibliotheek.</>}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", marginBottom: "2rem", maxWidth: "48ch" }}>
              {tr(
                "Three Thinking Styles is one of many frameworks in the Crispy Development library — tools, reflections, and assessments built for cross-cultural leaders.",
                "Tiga Gaya Berpikir adalah salah satu dari banyak kerangka kerja dalam perpustakaan Crispy Development — alat, refleksi, dan penilaian yang dibangun untuk pemimpin lintas budaya.",
                "Drie Denkstijlen is een van de vele kaders in de Crispy Development bibliotheek — instrumenten, reflecties en assessments gebouwd voor interculturele leiders."
              )}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!showAddToDashboard ? (
                <Link href="/signup" className="btn-primary">
                  {tr("Join the Community →", "Bergabung →", "Sluit je aan →")}
                </Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">
                  {tr("Go to Dashboard →", "Ke Dashboard →", "Naar dashboard →")}
                </Link>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="btn-primary"
                  style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}
                >
                  {isPending
                    ? tr("Saving…", "Menyimpan…", "Opslaan…")
                    : tr("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">
                {tr("Browse the Library", "Jelajahi Perpustakaan", "Bekijk de bibliotheek")}
              </Link>
            </div>
          </div>
          <div>
            <div style={{ background: "oklch(30% 0.12 260)", padding: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.375rem", fontStyle: "italic", color: "oklch(78% 0.04 260)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                {tr(
                  "\"Understanding how others think changes everything about how you lead.\"",
                  "\"Memahami cara orang lain berpikir mengubah segalanya tentang cara Anda memimpin.\"",
                  "\"Begrijpen hoe anderen denken verandert alles over hoe jij leidt.\""
                )}
              </p>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(65% 0.15 45)" }} />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>
                  Crispy Development
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
