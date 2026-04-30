"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

type SectionProps = {
  lang: Lang;
  t: (en: string, id: string, nl: string) => string;
  orange: string;
  navy: string;
  offWhite: string;
  lightGray: string;
  bodyText: string;
};

// ─── Country PD Scores ────────────────────────────────────────────────────────
const pdScores = [
  { country_en: "Malaysia", country_id: "Malaysia", country_nl: "Maleisië", score: 104, level: "high" },
  { country_en: "Philippines", country_id: "Filipina", country_nl: "Filipijnen", score: 94, level: "high" },
  { country_en: "Indonesia", country_id: "Indonesia", country_nl: "Indonesië", score: 78, level: "high" },
  { country_en: "South Korea", country_id: "Korea Selatan", country_nl: "Zuid-Korea", score: 60, level: "medium" },
  { country_en: "United States", country_id: "Amerika Serikat", country_nl: "Verenigde Staten", score: 40, level: "low" },
  { country_en: "Netherlands", country_id: "Belanda", country_nl: "Nederland", score: 38, level: "low" },
  { country_en: "Australia", country_id: "Australia", country_nl: "Australië", score: 36, level: "low" },
  { country_en: "Denmark", country_id: "Denmark", country_nl: "Denemarken", score: 18, level: "low" },
];

// ─── Friction Points (accordion) ─────────────────────────────────────────────
const frictionPoints = [
  {
    number: "01",
    en_title: "Silence in meetings is not agreement",
    id_title: "Diam dalam rapat bukan berarti setuju",
    nl_title: "Stilte in vergaderingen is geen instemming",
    en_tagline: "What you read as consensus may be compliance.",
    id_tagline: "Apa yang Anda baca sebagai konsensus mungkin hanyalah kepatuhan.",
    nl_tagline: "Wat jij als consensus leest, kan gewoon gehoorzaamheid zijn.",
    en_body: "In high PD cultures, team members rarely challenge a leader publicly — especially in a group setting. Silence and nodding do not mean 'I agree.' They often mean 'I respect you too much to contradict you here.' The real feedback, if it comes at all, will arrive privately, indirectly, and much later.",
    id_body: "Dalam budaya PD tinggi, anggota tim jarang menantang pemimpin secara publik — terutama dalam kelompok. Diam dan anggukan tidak berarti 'Saya setuju.' Seringkali itu berarti 'Saya terlalu menghormati Anda untuk membantah di sini.' Umpan balik nyata, jika ada, akan datang secara pribadi, tidak langsung, dan jauh kemudian.",
    nl_body: "In hoge PD-culturen daagt een teamlid een leider zelden publiekelijk uit — zeker niet in een groep. Stilte en knikken betekenen niet 'Ik ben het eens.' Ze betekenen vaak 'Ik respecteer je te veel om je hier te tegenspreken.' Echte feedback, als die al komt, komt privé, indirect, en veel later.",
    en_practice: "Create private channels for honest input — a one-on-one after the meeting, a written form, or a trusted go-between. Make it safe to disagree without it being a public act.",
    id_practice: "Buat saluran pribadi untuk masukan yang jujur — percakapan satu-satu setelah rapat, formulir tertulis, atau perantara yang dipercaya. Jadikan tidak setuju sebagai hal yang aman tanpa harus menjadi tindakan publik.",
    nl_practice: "Creëer privékanalen voor eerlijke feedback — een één-op-één na de vergadering, een schriftelijk formulier, of een vertrouwde tussenpersoon. Maak het veilig om het oneens te zijn zonder dat het een publieke daad is.",
  },
  {
    number: "02",
    en_title: "Your informality may read as incompetence",
    id_title: "Informalitas Anda mungkin terlihat sebagai ketidakmampuan",
    nl_title: "Jouw informaliteit kan als onbekwaamheid worden gezien",
    en_tagline: "Wanting to be called by your first name can undermine your authority.",
    id_tagline: "Ingin dipanggil dengan nama depan Anda bisa melemahkan otoritas Anda.",
    nl_tagline: "Willen dat mensen je bij je voornaam noemen kan je gezag ondermijnen.",
    en_body: "A leader from a low PD culture who drops titles, sits with the team rather than at the head of the table, and says 'I don't have all the answers — let's figure it out together' may genuinely intend this as humility. In a high PD context, it can land as weakness. The team may start wondering: does this person actually know what they are doing? Who is in charge here? Uncertainty about leadership creates anxiety — not empowerment.",
    id_body: "Pemimpin dari budaya PD rendah yang melepas gelar, duduk bersama tim daripada di kepala meja, dan berkata 'Saya tidak punya semua jawaban — mari kita cari tahu bersama' mungkin sungguh-sungguh bermaksud ini sebagai kerendahan hati. Dalam konteks PD tinggi, ini bisa terlihat sebagai kelemahan. Tim mungkin mulai bertanya-tanya: apakah orang ini benar-benar tahu apa yang mereka lakukan?",
    nl_body: "Een leider uit een lage PD-cultuur die titels weglaat, naast het team zit in plaats van aan het hoofd van de tafel, en zegt 'Ik heb niet alle antwoorden — laten we het samen uitzoeken' bedoelt dit misschien oprecht als bescheidenheid. In een hoge PD-context kan dit als zwakte overkomen. Het team vraagt zich misschien af: weet deze persoon wel wat ze doen?",
    en_practice: "Maintain visible, calm authority — make clear decisions, communicate them clearly, and create structure. You can still be warm and relational without creating confusion about who leads.",
    id_practice: "Pertahankan otoritas yang terlihat dan tenang — buat keputusan yang jelas, komunikasikan dengan jelas, dan ciptakan struktur. Anda masih bisa hangat dan relasional tanpa menciptakan kebingungan tentang siapa yang memimpin.",
    nl_practice: "Behoud zichtbaar, rustig gezag — neem duidelijke beslissingen, communiceer ze helder, en creëer structuur. Je kunt nog steeds warm en relationeel zijn zonder verwarring te creëren over wie er leidt.",
  },
  {
    number: "03",
    en_title: "The leader's opinion closes the room",
    id_title: "Pendapat pemimpin menutup ruangan",
    nl_title: "De mening van de leider sluit de discussie",
    en_tagline: "If you speak first, you may be the only one speaking.",
    id_tagline: "Jika Anda berbicara pertama, Anda mungkin satu-satunya yang berbicara.",
    nl_tagline: "Als jij als eerste spreekt, ben jij misschien de enige die spreekt.",
    en_body: "In high PD settings, once the leader has shared their view, the conversation is often over. Not because people agree — but because disagreeing with the leader feels disrespectful or even risky. If you open a discussion by saying 'Here is what I think we should do,' your team will almost certainly say yes. This is not consensus. It is deference.",
    id_body: "Dalam kondisi PD tinggi, begitu pemimpin berbagi pandangannya, percakapan sering berakhir. Bukan karena orang setuju — tetapi karena tidak setuju dengan pemimpin terasa tidak hormat atau bahkan berisiko. Jika Anda membuka diskusi dengan mengatakan 'Ini yang menurut saya harus kita lakukan,' tim Anda hampir pasti akan mengatakan ya. Ini bukan konsensus. Ini adalah kepatuhan.",
    nl_body: "In hoge PD-omgevingen is het gesprek vaak voorbij zodra de leider zijn mening heeft gegeven. Niet omdat mensen het eens zijn — maar omdat het oneens zijn met de leider onfatsoenlijk of zelfs riskant aanvoelt. Als je een discussie opent met 'Dit is wat ik denk dat we moeten doen,' zal je team bijna zeker ja zeggen. Dit is geen consensus. Het is ontzag.",
    en_practice: "Ask before you tell. Share your perspective last, not first. Or ask a specific, narrow question: 'What is one risk we have not considered?' rather than 'What do you all think?'",
    id_practice: "Tanya sebelum memberi tahu. Bagikan perspektif Anda terakhir, bukan pertama. Atau ajukan pertanyaan yang spesifik dan terbatas: 'Apa satu risiko yang belum kita pertimbangkan?' daripada 'Apa pendapat semua orang?'",
    nl_practice: "Vraag voordat je vertelt. Deel je perspectief als laatste, niet als eerste. Of stel een specifieke, gerichte vraag: 'Wat is één risico dat we nog niet hebben overwogen?' in plaats van 'Wat denken jullie allemaal?'",
  },
  {
    number: "04",
    en_title: "Authority must be earned relationally before it works formally",
    id_title: "Otoritas harus diperoleh secara relasional sebelum bekerja secara formal",
    nl_title: "Gezag moet relationeel verdiend worden voordat het formeel werkt",
    en_tagline: "Your title alone is not enough — here, the person behind the title matters more.",
    id_tagline: "Gelar Anda saja tidak cukup — di sini, orang di balik gelar itu lebih penting.",
    nl_tagline: "Jouw titel alleen is niet genoeg — hier telt de persoon achter de titel meer.",
    en_body: "In many high PD cultures, formal authority is respected — but it only goes so far. Real influence, the kind where people go the extra mile for you, requires relational trust. If you have not invested time in knowing your team personally — their families, their concerns, their background — you may have their compliance but not their commitment. The time you spend on relationships is not wasted. It is the foundation your formal authority stands on.",
    id_body: "Dalam banyak budaya PD tinggi, otoritas formal dihormati — tetapi hanya sejauh ini. Pengaruh nyata, di mana orang melakukan lebih dari yang diharapkan untuk Anda, membutuhkan kepercayaan relasional. Jika Anda belum menginvestasikan waktu untuk mengenal tim Anda secara pribadi — keluarga, kekhawatiran, latar belakang mereka — Anda mungkin memiliki kepatuhan mereka tetapi bukan komitmen mereka.",
    nl_body: "In veel hoge PD-culturen wordt formeel gezag gerespecteerd — maar het gaat slechts zo ver. Echte invloed, waarbij mensen het extra voor je doen, vereist relationeel vertrouwen. Als je geen tijd hebt geïnvesteerd in je team persoonlijk kennen — hun families, zorgen, achtergrond — heb je misschien hun gehoorzaamheid maar niet hun toewijding.",
    en_practice: "Invest in one-on-one time with each team member — not about work, about them. Learn names, families, stories. In most high PD cultures, the leader who knows their people is the leader people will follow.",
    id_practice: "Investasikan waktu satu-satu dengan setiap anggota tim — bukan tentang pekerjaan, tentang mereka. Pelajari nama, keluarga, cerita mereka. Dalam sebagian besar budaya PD tinggi, pemimpin yang mengenal orang-orangnya adalah pemimpin yang akan diikuti orang.",
    nl_practice: "Investeer in één-op-één tijd met elk teamlid — niet over werk, maar over hen. Leer namen, families, verhalen kennen. In de meeste hoge PD-culturen is de leider die zijn mensen kent de leider die mensen zullen volgen.",
  },
];

// ─── Reflection Questions ─────────────────────────────────────────────────────
const reflectionQuestions = [
  {
    roman: "I",
    en: "What is your home culture's power-distance default? How has it shaped the way you lead — or follow?",
    id: "Apa default jarak kekuasaan budaya asal Anda? Bagaimana hal itu membentuk cara Anda memimpin — atau mengikuti?",
    nl: "Wat is de machtafstandsstandaard van jouw thuiscultuur? Hoe heeft het de manier waarop jij leidt — of volgt — gevormd?",
  },
  {
    roman: "II",
    en: "Think of a moment when silence from your team turned out to mean something different than you thought. What were they actually communicating?",
    id: "Pikirkan saat ketika diam dari tim Anda ternyata berarti sesuatu yang berbeda dari yang Anda kira. Apa yang sebenarnya mereka sampaikan?",
    nl: "Denk aan een moment waarop stilte van je team iets anders bleek te betekenen dan je dacht. Wat communiceerden ze eigenlijk?",
  },
  {
    roman: "III",
    en: "Jesus held full authority and chose radical servanthood. What does that model mean for how you hold and use power in your specific context?",
    id: "Yesus memegang otoritas penuh dan memilih kerendahan hati radikal. Apa artinya model itu bagi cara Anda memegang dan menggunakan kekuasaan dalam konteks spesifik Anda?",
    nl: "Jezus had volledig gezag en koos voor radicale dienstbaarheid. Wat betekent dat model voor hoe jij macht vasthoudt en gebruikt in jouw specifieke context?",
  },
  {
    roman: "IV",
    en: "Who on your team is doing the most cultural adaptation work right now? Is that weight distributed fairly — or is one person carrying most of it?",
    id: "Siapa di tim Anda yang sedang melakukan paling banyak pekerjaan adaptasi budaya sekarang? Apakah beban itu didistribusikan secara adil — atau apakah satu orang menanggung sebagian besar?",
    nl: "Wie in je team doet momenteel het meeste culturele aanpassingswerk? Is die last eerlijk verdeeld — of draagt één persoon het grootste deel?",
  },
  {
    roman: "V",
    en: "In what ways might your current leadership style be creating confusion or anxiety in your team — without you realising it?",
    id: "Dengan cara apa gaya kepemimpinan Anda saat ini mungkin menciptakan kebingungan atau kecemasan dalam tim Anda — tanpa Anda sadari?",
    nl: "Op welke manieren kan je huidige leiderschapsstijl verwarring of angst in je team creëren — zonder dat je het beseft?",
  },
];

// ─── Hofstede Limitation Cards (Section A) ────────────────────────────────────
const hofstedeLimitations = [
  {
    number: "1",
    title: { en: "The IBM study", id: "Studi IBM", nl: "Het IBM-onderzoek" },
    body: {
      en: "Hofstede's data comes from IBM employees surveyed between 1967 and 1973. The sample was large — 117,000 people across 50+ countries — but drawn entirely from a single multinational corporation. IBM employees may not represent their broader home cultures. Brendan McSweeney's 2002 critique in Human Relations remains one of the strongest: the sample was structurally biased and some countries had fewer than 200 respondents.",
      id: "Data Hofstede berasal dari karyawan IBM yang disurvei antara tahun 1967 dan 1973. Sampelnya besar — 117.000 orang di lebih dari 50 negara — tetapi semuanya diambil dari satu perusahaan multinasional. Karyawan IBM mungkin tidak mewakili budaya asal mereka secara lebih luas. Kritik Brendan McSweeney tahun 2002 dalam Human Relations tetap menjadi salah satu yang paling kuat: sampelnya bias secara struktural dan beberapa negara memiliki kurang dari 200 responden.",
      nl: "Hofstede's data is afkomstig van IBM-medewerkers die werden ondervraagd tussen 1967 en 1973. De steekproef was groot — 117.000 mensen in meer dan 50 landen — maar volledig afkomstig van één multinational. IBM-medewerkers vertegenwoordigen mogelijk niet hun bredere thuisculturen. Brendan McSweeney's kritiek uit 2002 in Human Relations blijft een van de sterkste: de steekproef was structureel bevooroordeeld en sommige landen hadden minder dan 200 respondenten.",
    },
  },
  {
    number: "2",
    title: { en: "Scores change", id: "Skor berubah", nl: "Scores veranderen" },
    body: {
      en: "Hofstede's core data is over fifty years old. Power Distance scores drift as cultures develop economically and politically. South Korea, for example, has shown declining PD over recent decades as democratic institutions have strengthened and younger generations have entered leadership roles. The bar chart above is a useful baseline — not a current reading.",
      id: "Data inti Hofstede sudah lebih dari lima puluh tahun. Skor Jarak Kekuasaan bergeser seiring berkembangnya budaya secara ekonomi dan politik. Korea Selatan, misalnya, telah menunjukkan penurunan PD selama beberapa dekade terakhir seiring menguatnya institusi demokratis dan masuknya generasi muda ke peran kepemimpinan. Bagan batang di atas adalah dasar yang berguna — bukan pembacaan terkini.",
      nl: "Hofstede's kerndata is meer dan vijftig jaar oud. PDI-scores verschuiven naarmate culturen zich economisch en politiek ontwikkelen. Zuid-Korea heeft de afgelopen decennia bijvoorbeeld een dalende PD laten zien, doordat democratische instellingen zijn versterkt en jongere generaties leiderschapsrollen zijn gaan vervullen. De bovenstaande staafdiagram is een nuttige uitgangswaarde — geen actuele meting.",
    },
  },
  {
    number: "3",
    title: { en: "Within-country variation", id: "Variasi dalam negara", nl: "Variatie binnen landen" },
    body: {
      en: "A young, university-educated professional in Jakarta may operate at a much lower personal PD than the Indonesian national average. A traditional farmer in rural Friesland may operate at higher PD than the Dutch national average. The PDI chart is a starting hypothesis about an individual — not a verdict.",
      id: "Seorang profesional muda berpendidikan universitas di Jakarta mungkin beroperasi pada PD pribadi yang jauh lebih rendah dari rata-rata nasional Indonesia. Seorang petani tradisional di pedesaan mungkin beroperasi pada PD yang lebih tinggi dari rata-rata nasional. Bagan PDI adalah hipotesis awal tentang seseorang — bukan vonis.",
      nl: "Een jonge, universitair opgeleide professional in Jakarta kan op een veel lager persoonlijk PD-niveau opereren dan het Indonesisch nationaal gemiddelde. Een traditionele boer op het platteland kan op een hoger PD-niveau opereren dan het Nederlands nationaal gemiddelde. De PDI-grafiek is een beginshypothese over een individu — geen eindoordeel.",
    },
  },
];

// ─── GLOBE Power Distance Scores (Section B) ──────────────────────────────────
// Source: House et al., The GLOBE Study of 62 Societies (2004). Scale 1–7.
const globeScores = [
  { country: { en: "Philippines", id: "Filipina", nl: "Filipijnen" }, asIs: 5.44, shouldBe: 2.64 },
  { country: { en: "South Korea", id: "Korea Selatan", nl: "Zuid-Korea" }, asIs: 5.61, shouldBe: 2.55 },
  { country: { en: "Indonesia", id: "Indonesia", nl: "Indonesië" }, asIs: 5.18, shouldBe: 2.49 },
  { country: { en: "Australia", id: "Australia", nl: "Australië" }, asIs: 4.74, shouldBe: 2.49 },
  { country: { en: "United States", id: "Amerika Serikat", nl: "Verenigde Staten" }, asIs: 4.88, shouldBe: 2.85 },
  { country: { en: "Netherlands", id: "Belanda", nl: "Nederland" }, asIs: 4.11, shouldBe: 2.76 },
];

// ─── Adjacent Frameworks (Section B) ─────────────────────────────────────────
const meyerFramework = {
  title: { en: "Erin Meyer: Leading vs Deciding Are Not the Same", id: "Erin Meyer: Memimpin vs Memutuskan Itu Berbeda", nl: "Erin Meyer: Leiden en Beslissen zijn niet hetzelfde" },
  label: { en: "The Culture Map", id: "Peta Budaya", nl: "De Cultuurkaart" },
  body: {
    en: "Erin Meyer's framework maps cultural difference along eight scales. Two are most relevant here. The Leading scale runs from egalitarian to hierarchical — built directly on Hofstede's PDI and GLOBE data. The Deciding scale runs from consensual to top-down. They are not the same thing, and many cultures fall in unexpected combinations. Germans are more hierarchical than Americans on the Leading scale — but more consensual on the Deciding scale. Japan is famously hierarchical and deeply consensual at the same time: the ringi system requires consensus-building at lower levels before proposals ever reach senior leaders. This second-axis nuance is often exactly what cross-cultural leaders are missing.",
    id: "Kerangka kerja Erin Meyer memetakan perbedaan budaya di sepanjang delapan skala. Dua yang paling relevan di sini. Skala Memimpin membentang dari egaliter hingga hierarkis — dibangun langsung berdasarkan PDI Hofstede dan data GLOBE. Skala Memutuskan membentang dari konsensual hingga top-down. Keduanya bukan hal yang sama, dan banyak budaya jatuh dalam kombinasi yang tak terduga. Jerman lebih hierarkis dari Amerika pada skala Memimpin — tetapi lebih konsensual pada skala Memutuskan. Jepang secara terkenal hierarkis sekaligus sangat konsensual: sistem ringi mengharuskan pembangunan konsensus di tingkat bawah sebelum usulan mencapai pemimpin senior.",
    nl: "Erin Meyers raamwerk brengt culturele verschillen in kaart langs acht schalen. Twee zijn hier het meest relevant. De Leading-schaal loopt van egalitair naar hiërarchisch — direct gebouwd op Hofstede's PDI en GLOBE-data. De Deciding-schaal loopt van consensueel naar top-down. Ze zijn niet hetzelfde, en veel culturen vallen in onverwachte combinaties. Duitsers zijn hiërarchischer dan Amerikanen op de Leading-schaal — maar meer consensueel op de Deciding-schaal. Japan is beroemd hiërarchisch en tegelijkertijd diep consensueel: het ringi-systeem vereist consensusvorming op lagere niveaus voordat voorstellen ooit bij senior leiders terechtkomen.",
  },
  implication: {
    en: "Before assuming a high-PD team wants top-down decisions, check where they sit on the Deciding scale. A leader can be high-PD without being top-down on decisions — or low-PD without being consensual. The combination may surprise you.",
    id: "Sebelum mengasumsikan tim PD tinggi menginginkan keputusan top-down, periksa posisi mereka pada skala Memutuskan. Seorang pemimpin bisa PD tinggi tanpa bersifat top-down dalam keputusan — atau PD rendah tanpa konsensual. Kombinasinya mungkin mengejutkan Anda.",
    nl: "Controleer, voordat je aanneemt dat een hoge-PD-team top-down beslissingen wil, waar ze staan op de Deciding-schaal. Een leider kan hoge-PD zijn zonder top-down in beslissingen te zijn — of lage-PD zonder consensueel te zijn. De combinatie kan je verrassen.",
  },
};

const hallFramework = {
  title: { en: "Edward Hall: Why Direct Communication Backfires", id: "Edward Hall: Mengapa Komunikasi Langsung Bisa Berbalik Merugikan", nl: "Edward Hall: Waarom directe communicatie averechts werkt" },
  label: { en: "High-Context Communication", id: "Komunikasi Konteks Tinggi", nl: "Hoge-Contextcommunicatie" },
  body: {
    en: "Edward Hall's framework (Beyond Culture, 1976) addresses communication rather than authority directly — but the two interact powerfully. Most high-PD cultures are also high-context: critical information is communicated indirectly, through tone, timing, who is in the room, and what is deliberately left unsaid. A leader who tries to flatten power distance through direct, low-context communication often makes the situation worse. The team perceives the leader as either incompetent — does she really not know what is going on? — or as forcing them into a communication style that feels disrespectful in their tradition. Direct communication without relational authority is not humility. It is confusion.",
    id: "Kerangka kerja Edward Hall (Beyond Culture, 1976) membahas komunikasi daripada otoritas secara langsung — tetapi keduanya berinteraksi dengan kuat. Sebagian besar budaya PD tinggi juga merupakan budaya konteks tinggi: informasi penting dikomunikasikan secara tidak langsung, melalui nada, waktu, siapa yang ada di ruangan, dan apa yang sengaja tidak diucapkan. Seorang pemimpin yang mencoba meratakan jarak kekuasaan melalui komunikasi langsung dan konteks rendah sering memperburuk situasi. Tim menganggap pemimpin itu tidak kompeten — apakah dia benar-benar tidak tahu apa yang terjadi? — atau memaksakan gaya komunikasi yang terasa tidak hormat dalam tradisi mereka.",
    nl: "Edward Halls raamwerk (Beyond Culture, 1976) richt zich op communicatie in plaats van autoriteit direct — maar de twee werken krachtig op elkaar in. De meeste hoge-PD-culturen zijn ook hoge-contextculturen: kritieke informatie wordt indirect gecommuniceerd, via toon, timing, wie er in de kamer is, en wat bewust onuitgesproken wordt gelaten. Een leider die probeert de machtafstand te verkleinen via directe, lage-contextcommunicatie maakt de situatie vaak erger. Het team ervaart de leider als incompetent — weet zij echt niet wat er speelt? — of als iemand die hen dwingt tot een communicatiestijl die in hun traditie respectloos aanvoelt.",
  },
  implication: {
    en: "In high-PD and high-context cultures, how you say something — and what you leave unsaid — carries as much information as the words themselves. Building relational authority before attempting to flatten hierarchy is not optional. It is the prerequisite.",
    id: "Dalam budaya PD tinggi dan konteks tinggi, bagaimana Anda mengatakan sesuatu — dan apa yang Anda tinggalkan tanpa diucapkan — membawa informasi sebanyak kata-kata itu sendiri. Membangun otoritas relasional sebelum mencoba meratakan hierarki bukanlah pilihan. Itu adalah prasyarat.",
    nl: "In hoge-PD- en hoge-contextculturen draagt hoe je iets zegt — en wat je onuitgesproken laat — evenveel informatie als de woorden zelf. Relationeel gezag opbouwen voordat je probeert de hiërarchie af te vlakken is niet optioneel. Het is de voorwaarde.",
  },
};

// ─── Research Insight Cards (Section C) ──────────────────────────────────────
const insightCards = [
  {
    id: "innovation",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6L15 17H9l-.8-2C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
      </svg>
    ),
    title: { en: "Innovation", id: "Inovasi", nl: "Innovatie" },
    body: {
      en: "Lower power distance correlates with higher organisational innovation. The leading explanation: in low-PD organisations, junior employees challenge ideas more freely, surfacing problems and improvements that high-PD organisations only discover through failure. Innovation initiatives that work in low-PD home offices often struggle in high-PD field contexts — not because the team is less creative, but because the structure does not reward speaking up.",
      id: "Jarak kekuasaan yang lebih rendah berkorelasi dengan inovasi organisasi yang lebih tinggi. Penjelasan utamanya: dalam organisasi PD rendah, karyawan junior lebih bebas menantang ide, mengangkat masalah dan perbaikan yang hanya ditemukan organisasi PD tinggi melalui kegagalan. Inisiatif inovasi yang berhasil di kantor pusat PD rendah sering kali kesulitan dalam konteks lapangan PD tinggi — bukan karena tim kurang kreatif, tetapi karena strukturnya tidak mendorong orang untuk berbicara.",
      nl: "Lagere machtafstand correleert met hogere organisatorische innovatie. De meest gangbare verklaring: in lage-PD-organisaties dagen junior medewerkers ideeën vrijer uit, waardoor ze problemen en verbeteringen naar boven brengen die hoge-PD-organisaties pas bij mislukking ontdekken. Innovatie-initiatieven die werken in lage-PD-hoofdkantoren hebben het vaak moeilijk in hoge-PD-veldcontexten — niet omdat het team minder creatief is, maar omdat de structuur het uiten van meningen niet beloont.",
    },
    implication: {
      en: "The fix is structural, not motivational. Build channels that make speaking up safe before assuming your team has nothing to say.",
      id: "Solusinya bersifat struktural, bukan motivasional. Bangun saluran yang membuat berbicara aman sebelum mengasumsikan tim Anda tidak memiliki apapun untuk dikatakan.",
      nl: "De oplossing is structureel, niet motivationeel. Bouw kanalen die het uiten van meningen veilig maken voordat je ervan uitgaat dat je team niets te zeggen heeft.",
    },
  },
  {
    id: "decision-quality",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><path d="M12 3v1M12 20v1M4.2 6.2l.7.7M19.1 6.2l-.7.7M3 12h1M20 12h1M4.9 17.8l.7-.7M19.1 17.8l-.7-.7" />
      </svg>
    ),
    title: { en: "Decision Quality", id: "Kualitas Keputusan", nl: "Besluitkwaliteit" },
    body: {
      en: "High-PD organisations are faster to decide but slower to surface problems. Low-PD organisations are slower to decide but more likely to catch errors before implementation. Neither is universally better — the right balance depends on the cost of failure. For high-stakes, low-reversal decisions — strategic, financial, medical, safety — low-PD input structures generally produce better outcomes.",
      id: "Organisasi PD tinggi lebih cepat mengambil keputusan tetapi lebih lambat mengangkat masalah. Organisasi PD rendah lebih lambat mengambil keputusan tetapi lebih mungkin menangkap kesalahan sebelum implementasi. Tidak ada yang secara universal lebih baik — keseimbangan yang tepat bergantung pada biaya kegagalan. Untuk keputusan berisiko tinggi dan sulit dibalik — strategis, finansial, medis, keselamatan — struktur masukan PD rendah umumnya menghasilkan hasil yang lebih baik.",
      nl: "Hoge-PD-organisaties beslissen sneller maar brengen problemen trager naar boven. Lage-PD-organisaties beslissen trager maar vangen fouten vaker op vóór de implementatie. Geen van beide is universeel beter — de juiste balans hangt af van de kosten van mislukking. Voor beslissingen met hoge inzet en lage omkeerbaarheid — strategisch, financieel, medisch, veiligheid — leveren lage-PD-inbrengstructuren doorgaans betere resultaten.",
    },
    implication: {
      en: "Know the cost of being wrong before you choose your decision process. Speed is not always the asset it appears to be.",
      id: "Ketahui biaya dari kesalahan sebelum Anda memilih proses pengambilan keputusan. Kecepatan tidak selalu menjadi aset seperti yang terlihat.",
      nl: "Ken de kosten van een verkeerde beslissing voordat je je besluitvormingsproces kiest. Snelheid is niet altijd het voordeel dat het lijkt.",
    },
  },
  {
    id: "ethics",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: { en: "Ethics & Accountability", id: "Etika & Akuntabilitas", nl: "Ethiek & Verantwoording" },
    body: {
      en: "Higher power distance correlates with higher tolerance of corruption in cross-national studies (Husted 1999; Park 2003). This does not mean high-PD cultures are made of more corrupt people — it means high-PD structures provide less institutional friction against corruption when it occurs. For Christian organisations: safeguarding policies that depend on a junior worker reporting a senior leader's misconduct will fail predictably in high-PD environments unless the reporting channel is specifically designed to bypass the normal hierarchy.",
      id: "Jarak kekuasaan yang lebih tinggi berkorelasi dengan toleransi korupsi yang lebih tinggi dalam studi lintas negara (Husted 1999; Park 2003). Ini bukan berarti budaya PD tinggi terdiri dari orang-orang yang lebih korup — ini berarti struktur PD tinggi memberikan gesekan institusional yang lebih sedikit terhadap korupsi ketika itu terjadi. Untuk organisasi Kristen: kebijakan perlindungan yang bergantung pada pekerja junior yang melaporkan pelanggaran pemimpin senior akan gagal secara dapat diprediksi di lingkungan PD tinggi kecuali saluran pelaporan dirancang khusus untuk melewati hierarki normal.",
      nl: "Hogere machtafstand correleert met hogere tolerantie voor corruptie in landenvergelijkende studies (Husted 1999; Park 2003). Dit betekent niet dat hoge-PD-culturen uit meer corrupte mensen bestaan — het betekent dat hoge-PD-structuren minder institutionele weerstand bieden tegen corruptie als die zich voordoet. Voor christelijke organisaties: beschermingsbeleid dat afhankelijk is van een junior medewerker die wangedrag van een senior leider meldt, zal voorspelbaar mislukken in hoge-PD-omgevingen, tenzij het meldkanaal specifiek is ontworpen om de normale hiërarchie te omzeilen.",
    },
    implication: {
      en: "Design safeguarding systems that structurally bypass hierarchy — not ones that rely on personal courage to challenge authority.",
      id: "Rancang sistem perlindungan yang secara struktural melewati hierarki — bukan yang bergantung pada keberanian pribadi untuk menantang otoritas.",
      nl: "Ontwerp beschermingssystemen die de hiërarchie structureel omzeilen — niet systemen die vertrouwen op persoonlijke moed om autoriteit uit te dagen.",
    },
  },
  {
    id: "leadership-effectiveness",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    title: { en: "Leadership Effectiveness", id: "Efektivitas Kepemimpinan", nl: "Leiderschapseffectiviteit" },
    body: {
      en: "GLOBE research found that culturally-endorsed leadership styles vary dramatically across PD levels. In high-PD cultures, leaders are expected to be decisive, paternal, and visibly authoritative. In low-PD cultures, they are expected to be participative, accessible, and humble. The same leader can be highly effective in one context and ineffective in another — without changing their underlying behaviour. Only the cultural fit changes.",
      id: "Penelitian GLOBE menemukan bahwa gaya kepemimpinan yang didukung secara budaya bervariasi secara dramatis di berbagai tingkat PD. Dalam budaya PD tinggi, pemimpin diharapkan tegas, kebapakan, dan terlihat berwibawa. Dalam budaya PD rendah, mereka diharapkan partisipatif, mudah diakses, dan rendah hati. Pemimpin yang sama bisa sangat efektif dalam satu konteks dan tidak efektif dalam konteks lain — tanpa mengubah perilaku dasarnya. Hanya kesesuaian budaya yang berubah.",
      nl: "GLOBE-onderzoek toonde aan dat cultureel gesteunde leiderschapsstijlen sterk variëren per PD-niveau. In hoge-PD-culturen worden leiders verwacht besluitvaardig, vaderlijk en zichtbaar gezaghebbend te zijn. In lage-PD-culturen worden ze verwacht participatief, toegankelijk en bescheiden te zijn. Dezelfde leider kan in de ene context zeer effectief zijn en in de andere ineffectief — zonder dat het onderliggende gedrag verandert. Alleen de culturele fit verandert.",
    },
    implication: {
      en: "If you feel you are doing the same thing you always did and getting a different reception — you probably are. The context changed, not you. Diagnose the cultural fit before diagnosing yourself.",
      id: "Jika Anda merasa melakukan hal yang sama seperti biasa tetapi mendapat respons yang berbeda — kemungkinan besar memang begitu. Konteksnya yang berubah, bukan Anda. Diagnosis kesesuaian budaya sebelum mendiagnosis diri sendiri.",
      nl: "Als je het gevoel hebt dat je hetzelfde doet als altijd maar een andere ontvangst krijgt — klopt dat waarschijnlijk. De context is veranderd, niet jij. Diagnosticeer de culturele fit voordat je jezelf diagnosticeert.",
    },
  },
];

// ─── Reading List (Section F) ─────────────────────────────────────────────────
const readingList = [
  {
    title: "Cultures and Organizations: Software of the Mind",
    authoryear: "Hofstede, Hofstede & Minkov — 3rd ed., 2010",
    description: {
      en: "The accessible single volume covering all six Hofstede dimensions.",
      id: "Volume tunggal yang mudah dipahami yang mencakup semua enam dimensi Hofstede.",
      nl: "Het toegankelijke standaardwerk dat alle zes Hofstede-dimensies behandelt.",
    },
    url: null,
  },
  {
    title: "The Culture Map",
    authoryear: "Erin Meyer — 2014",
    description: {
      en: "The most practitioner-friendly framework for cross-cultural leadership — pairs well with Hofstede.",
      id: "Kerangka paling ramah bagi praktisi untuk kepemimpinan lintas budaya — sangat cocok dipadukan dengan Hofstede.",
      nl: "Het meest praktijkgerichte kader voor intercultureel leiderschap — past goed bij Hofstede.",
    },
    url: null,
  },
  {
    title: "The GLOBE Study of 62 Societies",
    authoryear: "House et al. — 2004",
    description: {
      en: "The full GLOBE research results, including the As Is vs Should Be findings across 62 cultures.",
      id: "Hasil penelitian GLOBE lengkap, termasuk temuan As Is vs Should Be di 62 budaya.",
      nl: "De volledige GLOBE-onderzoeksresultaten, inclusief de As Is vs Should Be-bevindingen in 62 culturen.",
    },
    url: "https://globeproject.com",
  },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function PowerDistanceClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [openPoint, setOpenPoint] = useState<number | null>(null);
  const [openFramework, setOpenFramework] = useState<number | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("power-distance");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* ─── LANG SWITCHER ──────────────────────────────────────────────────── */}

      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: orange }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 50%, oklch(30% 0.12 260) 0%, transparent 60%)", opacity: 0.5 }} />
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Cross-Cultural · Guide", "Lintas Budaya · Panduan", "Cross-Cultureel · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, margin: "0 0 24px", lineHeight: 1.08 }}>
            {t("Power Distance", "Jarak Kekuasaan", "Machtafstand")}
          </h1>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(16px, 2vw, 19px)", color: "oklch(85% 0.03 80)", maxWidth: 580, margin: "0 0 16px", lineHeight: 1.65 }}>
            {t(
              '"Power distance is the extent to which less powerful members of institutions accept and expect that power is distributed unequally."',
              '"Jarak kekuasaan adalah sejauh mana anggota institusi yang kurang berkuasa menerima dan mengharapkan bahwa kekuasaan didistribusikan secara tidak setara."',
              '"Machtafstand is de mate waarin minder machtige leden van instellingen ongelijke verdeling van macht accepteren en verwachten."'
            )}
          </p>
          <p style={{ color: "oklch(65% 0.05 260)", fontSize: 13, marginBottom: 36, fontStyle: "italic" }}>— Geert Hofstede</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: saved ? "oklch(35% 0.08 260)" : "transparent", color: "oklch(75% 0.04 260)", padding: "14px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid oklch(42% 0.08 260)", cursor: saved ? "default" : "pointer" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: OPENING STORY ───────────────────────────────────────── */}
      <div style={{ padding: "80px 24px 0", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
          {t("A Story", "Sebuah Kisah", "Een Verhaal")}
        </p>
        <div style={{ borderLeft: `4px solid ${orange}`, paddingLeft: 28, marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 2.8vw, 26px)", color: navy, lineHeight: 1.55, marginBottom: 20, fontStyle: "italic" }}>
            {t(
              "Sarah had led teams in the Netherlands for eight years. Flat structures. First names. Everyone's opinion matters. She arrived in Surabaya to lead a national team of twelve.",
              "Sarah telah memimpin tim di Belanda selama delapan tahun. Struktur datar. Nama depan. Pendapat semua orang penting. Dia tiba di Surabaya untuk memimpin tim nasional beranggotakan dua belas orang.",
              "Sarah had acht jaar lang teams geleid in Nederland. Platte structuren. Voornamen. Ieders mening telt. Ze arriveerde in Surabaya om een nationaal team van twaalf mensen te leiden."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "In her first team meeting, she laid out three options and said: 'I want to hear from everyone. What do you think we should do?' Silence. A few polite nods. One man said, 'Whatever you decide, we will support.' She pushed harder for input. More silence.",
              "Dalam rapat tim pertamanya, dia memaparkan tiga opsi dan berkata: 'Saya ingin mendengar dari semua orang. Apa yang menurut kalian harus kita lakukan?' Keheningan. Beberapa anggukan sopan. Satu pria berkata, 'Apapun yang Anda putuskan, kami akan mendukung.' Dia mendorong lebih keras untuk masukan. Lebih banyak keheningan.",
              "In haar eerste teamvergadering legde ze drie opties voor en zei: 'Ik wil van iedereen horen. Wat denken jullie dat we moeten doen?' Stilte. Een paar beleefde knikjes. Eén man zei: 'Wat u ook beslist, wij steunen u.' Ze drong harder aan op input. Meer stilte."
            )}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
            {t(
              "That evening she wrote in her journal: 'This team has no initiative. They just wait to be told what to do.'",
              "Malam itu dia menulis di jurnalnya: 'Tim ini tidak punya inisiatif. Mereka hanya menunggu untuk diberi tahu apa yang harus dilakukan.'",
              "Die avond schreef ze in haar dagboek: 'Dit team heeft geen initiatief. Ze wachten gewoon tot ze verteld worden wat ze moeten doen.'"
            )}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(19px, 2.5vw, 23px)", color: navy, lineHeight: 1.6, fontStyle: "italic" }}>
            {t(
              "She was wrong. The team had plenty of opinions. They were waiting for her to lead — because in their experience, that is what a good team does for a good leader.",
              "Dia salah. Tim memiliki banyak pendapat. Mereka menunggu dia untuk memimpin — karena dalam pengalaman mereka, itulah yang dilakukan tim yang baik untuk pemimpin yang baik.",
              "Ze had het mis. Het team had volop meningen. Ze wachtten op haar leiding — omdat in hun ervaring dat is wat een goed team doet voor een goede leider."
            )}
          </p>
        </div>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.8, marginBottom: 16 }}>
          {t(
            "This is a power distance problem. Not a people problem. And it plays out in every cross-cultural team where the leader and the team sit on different ends of the PD spectrum.",
            "Ini adalah masalah jarak kekuasaan. Bukan masalah orang. Dan ini terjadi di setiap tim lintas budaya di mana pemimpin dan tim berada di ujung berbeda spektrum PD.",
            "Dit is een machtafstandsprobleem. Geen mensenprobleem. En het speelt zich af in elk intercultureel team waar de leider en het team aan verschillende uiteinden van het PD-spectrum zitten."
          )}
        </p>
        <p style={{ fontSize: 17, fontWeight: 700, color: navy, lineHeight: 1.7 }}>
          {t(
            "Understanding power distance does not fix the gap. But it stops you from misreading your team — and that is where everything starts.",
            "Memahami jarak kekuasaan tidak memperbaiki kesenjangan. Tapi itu menghentikan Anda dari salah membaca tim Anda — dan di situlah segalanya dimulai.",
            "Machtafstand begrijpen dicht de kloof niet. Maar het voorkomt dat je je team verkeerd leest — en dat is waar alles begint."
          )}
        </p>
      </div>

      {/* ─── IMAGE 1 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image
            src="/resources/power-distance-1.jpg"
            alt="Cross-cultural team meeting showing power distance dynamics"
            width={1312}
            height={736}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t(
            "What looks like passivity is often deference — a form of respect the leader may not recognize.",
            "Yang terlihat seperti kepasifan sering kali adalah penghormatan — bentuk rasa hormat yang mungkin tidak dikenali pemimpin.",
            "Wat eruitziet als passiviteit is vaak ontzag — een vorm van respect die de leider misschien niet herkent."
          )}
        </p>
      </div>

      {/* ─── SECTION 2: WHAT IT IS ───────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("The Framework", "Kerangka Kerja", "Het Kader")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
          {t("What Power Distance Actually Measures", "Apa yang Sebenarnya Diukur Jarak Kekuasaan", "Wat Machtafstand Eigenlijk Meet")}
        </h2>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Power distance is not about whether hierarchy is good or bad. Every culture has hierarchy. The difference is in how people feel about it — how much psychological distance they expect between themselves and those in authority above them.",
            "Jarak kekuasaan bukan tentang apakah hierarki itu baik atau buruk. Setiap budaya memiliki hierarki. Perbedaannya ada pada bagaimana orang merasa tentang hal itu — seberapa besar jarak psikologis yang mereka harapkan antara diri mereka dan mereka yang berkuasa di atas mereka.",
            "Machtafstand gaat er niet over of hiërarchie goed of slecht is. Elke cultuur heeft hiërarchie. Het verschil zit in hoe mensen erover voelen — hoeveel psychologische afstand ze verwachten tussen zichzelf en degenen in autoriteit boven hen."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "In high power-distance cultures, inequality is seen as natural — even healthy. The leader is supposed to lead. Decisions flow from the top. Challenging authority publicly is not just uncomfortable; it is wrong. The hierarchy gives the team a sense of order and security.",
            "Dalam budaya jarak kekuasaan tinggi, ketidaksetaraan dilihat sebagai hal yang alami — bahkan sehat. Pemimpin seharusnya memimpin. Keputusan mengalir dari atas. Menantang otoritas secara publik bukan hanya tidak nyaman; itu salah. Hierarki memberi tim rasa ketertiban dan keamanan.",
            "In hoge machtafstandsculturen wordt ongelijkheid als natuurlijk — zelfs gezond — beschouwd. De leider zou moeten leiden. Beslissingen komen van bovenaf. Autoriteit publiekelijk uitdagen is niet alleen ongemakkelijk; het is verkeerd. De hiërarchie geeft het team een gevoel van orde en veiligheid."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 36 }}>
          {t(
            "In low power-distance cultures, hierarchy is tolerated but questioned. Everyone's voice counts. Titles don't make you right. A good leader earns respect by listening, not by rank. Challenging the boss is not disrespect — it's engagement.",
            "Dalam budaya jarak kekuasaan rendah, hierarki ditoleransi tetapi dipertanyakan. Setiap suara dihitung. Gelar tidak membuat Anda benar. Pemimpin yang baik mendapatkan rasa hormat dengan mendengarkan, bukan dengan pangkat. Menantang atasan bukan ketidakhormatan — itu adalah keterlibatan.",
            "In lage machtafstandsculturen wordt hiërarchie getolereerd maar bevraagd. Ieders stem telt. Titels maken je niet gelijk. Een goede leider verdient respect door te luisteren, niet door rang. De baas uitdagen is geen gebrek aan respect — het is betrokkenheid."
          )}
        </p>

        {/* Pull-quote */}
        <div style={{ background: navy, borderRadius: 10, padding: "32px 36px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "0 10px 0 120px", background: "oklch(30% 0.12 260)", opacity: 0.5 }} />
          <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.5, fontStyle: "italic", margin: "0 0 16px", position: "relative" }}>
            {t(
              '"In high power-distance cultures, hierarchy is not a problem to solve — it is a framework that provides order, clarity, and security. The mistake is importing your PD assumptions and calling them leadership."',
              '"Dalam budaya jarak kekuasaan tinggi, hierarki bukan masalah yang harus dipecahkan — itu adalah kerangka yang memberikan ketertiban, kejelasan, dan keamanan. Kesalahannya adalah mengimpor asumsi PD Anda dan menyebutnya kepemimpinan."',
              '"In hoge machtafstandsculturen is hiërarchie geen probleem om op te lossen — het is een kader dat orde, duidelijkheid en veiligheid biedt. De fout is je PD-aannames importeren en het leiderschap noemen."'
            )}
          </p>
          <p style={{ color: orange, fontSize: 13, fontWeight: 600, margin: 0, position: "relative" }}>— Geert Hofstede</p>
        </div>

        {/* PD Score bar chart */}
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
          {t("Power Distance Index by Country", "Indeks Jarak Kekuasaan per Negara", "Machtafstandsindex per Land")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
          {pdScores.map((c) => (
            <div key={c.country_en} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 120, fontSize: 13, fontWeight: 600, color: navy, flexShrink: 0 }}>
                {lang === "en" ? c.country_en : lang === "id" ? c.country_id : c.country_nl}
              </div>
              <div style={{ flex: 1, background: "oklch(92% 0.01 80)", borderRadius: 4, overflow: "hidden", height: 22 }}>
                <div style={{
                  width: `${c.score}%`,
                  maxWidth: "100%",
                  height: "100%",
                  background: c.level === "high" ? orange : c.level === "medium" ? "oklch(55% 0.12 45)" : "oklch(50% 0.10 260)",
                  borderRadius: 4,
                  transition: "width 0.3s ease",
                }} />
              </div>
              <div style={{ width: 36, fontSize: 13, fontWeight: 700, color: bodyText, textAlign: "right", flexShrink: 0 }}>{c.score}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "oklch(60% 0.04 260)", fontStyle: "italic", marginBottom: 0 }}>
          {t("Source: Hofstede Insights. Scale 0–104.", "Sumber: Hofstede Insights. Skala 0–104.", "Bron: Hofstede Insights. Schaal 0–104.")}
        </p>

        {/* ─── SECTION A: Going Deeper — Full Hofstede Picture ─────────────── */}
        <div style={{ height: 1, background: "oklch(90% 0.01 80)", margin: "52px 0 52px" }} />

        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("The Framework — Deeper", "Kerangka Kerja — Lebih Dalam", "Het Kader — Dieper")}
        </p>

        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
          {t("Going Deeper: The Full Hofstede Picture", "Lebih Dalam: Gambaran Lengkap Hofstede", "Dieper gaan: Het volledige Hofstede-beeld")}
        </h2>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Power Distance is the most cited of Hofstede's dimensions — but it is one of six. Knowing the others matters because they interact. The six dimensions are: Power Distance (PDI), Individualism vs Collectivism (IDV), Masculinity vs Femininity (MAS), Uncertainty Avoidance (UAI), Long-Term vs Short-Term Orientation (LTO), and Indulgence vs Restraint (IVR).",
            "Jarak Kekuasaan adalah dimensi Hofstede yang paling banyak dikutip — tetapi hanya satu dari enam. Mengetahui yang lain penting karena mereka saling berinteraksi. Keenam dimensinya adalah: Jarak Kekuasaan (PDI), Individualisme vs Kolektivisme (IDV), Maskulinitas vs Feminitas (MAS), Penghindaran Ketidakpastian (UAI), Orientasi Jangka Panjang vs Jangka Pendek (LTO), dan Indulgensi vs Pengekangan (IVR).",
            "Machtafstand is de meest geciteerde dimensie van Hofstede — maar het is er slechts één van zes. De andere kennen is belangrijk omdat ze met elkaar wisselwerken. De zes dimensies zijn: Machtafstand (PDI), Individualisme vs Collectivisme (IDV), Masculiniteit vs Femininiteit (MAS), Onzekerheidsvermijding (UAI), Lange- vs Kortetermijnoriëntatie (LTO), en Inschikkelijkheid vs Beheersing (IVR)."
          )}
        </p>

        <div style={{ background: "oklch(97% 0.012 45)", borderLeft: `4px solid ${orange}`, borderRadius: "0 8px 8px 0", padding: "24px 28px", marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Key Insight", "Wawasan Utama", "Kernbevinding")}
          </p>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, margin: 0 }}>
            {t(
              "For cross-cultural Christian leaders, the most important pairing is Power Distance plus Individualism. Most Asian, sub-Saharan African, Latin American, and Middle Eastern cultures cluster high-PD and collectivist. Most Northern European, North American, Australian, and New Zealand cultures cluster low-PD and individualist. The compound effect explains why a Western leader moving into an Indonesian or Philippine team is rarely struggling with one dimension — it is high PD plus high collectivism together that shapes what the team expects from authority.",
              "Bagi pemimpin Kristen lintas budaya, pasangan terpenting adalah Jarak Kekuasaan ditambah Individualisme. Sebagian besar budaya Asia, Afrika Sub-Sahara, Amerika Latin, dan Timur Tengah terkelompok tinggi-PD dan kolektivis. Sebagian besar budaya Eropa Utara, Amerika Utara, Australia, dan Selandia Baru terkelompok rendah-PD dan individualis. Efek gabungan inilah yang menjelaskan mengapa pemimpin Barat yang masuk ke tim Indonesia atau Filipina jarang berjuang dengan satu dimensi saja — justru PD tinggi ditambah kolektivisme tinggi bersama-sama yang membentuk apa yang diharapkan tim dari otoritas.",
              "Voor interculturele christelijke leiders is de belangrijkste combinatie Machtafstand plus Individualisme. De meeste Aziatische, sub-Saharaanse Afrikaanse, Latijns-Amerikaanse en Midden-Oosterse culturen clusteren hoge PD en collectivistisch. De meeste Noord-Europese, Noord-Amerikaanse, Australische en Nieuw-Zeelandse culturen clusteren lage PD en individualistisch. Het samengestelde effect verklaart waarom een westerse leider die een Indonesisch of Filipijns team binnenstapt zelden met één dimensie worstelt — het is hoge PD plus hoog collectivisme sámen dat bepaalt wat het team van autoriteit verwacht."
            )}
          </p>
        </div>

        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("What Hofstede Doesn't Capture", "Apa yang Tidak Ditangkap Hofstede", "Wat Hofstede niet vastlegt")}
        </p>

        <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, marginBottom: 28 }}>
          {t(
            "Hofstede's framework remains the most widely used in cross-cultural research — and one of the most critiqued. Three limitations matter most for practitioners.",
            "Kerangka kerja Hofstede tetap menjadi yang paling banyak digunakan dalam penelitian lintas budaya — dan salah satu yang paling banyak dikritik. Tiga keterbatasan paling penting bagi para praktisi.",
            "Hofstede's raamwerk blijft het meest gebruikte in intercultureel onderzoek — en een van de meest bekritiseerde. Drie beperkingen zijn het meest relevant voor beoefenaars."
          )}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 48 }}>
          {hofstedeLimitations.map((item) => (
            <div key={item.number} style={{ background: lightGray, borderRadius: 10, padding: "24px 22px", borderTop: `3px solid ${orange}`, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: orange, lineHeight: 1, flexShrink: 0 }}>
                  {item.number}
                </span>
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: navy, margin: 0, lineHeight: 1.3 }}>
                  {item.title[lang]}
                </p>
              </div>
              <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                {item.body[lang]}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <a
            href="https://www.hofstede-insights.com/country-comparison-tool"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", padding: "14px 32px", border: `2px solid ${orange}`, color: navy, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}
          >
            {t("Compare your countries → Hofstede Insights", "Bandingkan negara Anda → Hofstede Insights", "Vergelijk jouw landen → Hofstede Insights")}
          </a>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "oklch(55% 0.04 260)", lineHeight: 1.6, marginBottom: 0 }}>
          {t(
            "Enter your home country and your team's countries to see all six dimensions side by side.",
            "Masukkan negara asal Anda dan negara-negara tim Anda untuk melihat semua enam dimensi berdampingan.",
            "Voer jouw thuisland en de landen van je team in om alle zes dimensies naast elkaar te zien."
          )}
        </p>
      </div>

      {/* ─── SECTION B: Beyond Hofstede — Three Adjacent Frameworks ─────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Adjacent Frameworks", "Kerangka Kerja Terkait", "Aangrenzende kaders")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 20, lineHeight: 1.2 }}>
            {t("Beyond Hofstede: Three Frameworks That Go Further", "Melampaui Hofstede: Tiga Kerangka yang Lebih Jauh", "Voorbij Hofstede: Drie kaders die verder gaan")}
          </h2>
          <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 52 }}>
            {t(
              "Hofstede gave cross-cultural research its vocabulary. These three frameworks extend it — each adding a layer that changes how you read the same situation.",
              "Hofstede memberikan kosakata pada penelitian lintas budaya. Ketiga kerangka ini memperluas — masing-masing menambahkan lapisan yang mengubah cara Anda membaca situasi yang sama.",
              "Hofstede gaf intercultureel onderzoek zijn vocabulaire. Deze drie kaders breiden het uit — elk voegt een laag toe die verandert hoe je dezelfde situatie leest."
            )}
          </p>

          {/* Framework 1: GLOBE */}
          <div style={{ marginBottom: 4 }}>
            <button
              onClick={() => setOpenFramework(openFramework === 0 ? null : 0)}
              style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: offWhite, fontSize: 15, fontWeight: 800 }}>1</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.13em", textTransform: "uppercase", margin: "0 0 2px" }}>
                  {t("The GLOBE Study", "Studi GLOBE", "De GLOBE-studie")}
                </p>
                <h3 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(18px, 2.8vw, 24px)", fontWeight: 800, color: navy, margin: 0, lineHeight: 1.2 }}>
                  {t("GLOBE Study — What People Actually Want", "Studi GLOBE — Apa yang Sebenarnya Diinginkan Orang", "GLOBE-studie — Wat mensen echt willen")}
                </h3>
              </div>
              <span style={{ color: openFramework === 0 ? orange : "oklch(65% 0.04 260)", fontSize: 22, fontWeight: 300, transform: openFramework === 0 ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", flexShrink: 0 }}>+</span>
            </button>

            {openFramework === 0 && (
              <div style={{ paddingBottom: 28 }}>
                <div style={{ background: navy, borderRadius: 10, padding: "30px 34px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, borderRadius: "0 10px 0 100px", background: "oklch(30% 0.12 260)", opacity: 0.5 }} />
                  <p style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(18px, 2.6vw, 24px)", color: offWhite, lineHeight: 1.6, fontStyle: "italic", margin: "0 0 16px", position: "relative" }}>
                    {t(
                      '"The GLOBE study found that in almost every culture, people\'s preferred power distance is lower than the power distance they actually experience. High-PD cultures are not cultures that want to stay there — they are cultures currently operating in a way their own members would moderate if they could."',
                      '"Studi GLOBE menemukan bahwa di hampir setiap budaya, jarak kekuasaan yang diinginkan orang lebih rendah dari jarak kekuasaan yang sebenarnya mereka alami. Budaya PD tinggi bukanlah budaya yang ingin tetap di sana — mereka adalah budaya yang saat ini beroperasi dengan cara yang akan dimoderasi oleh anggotanya sendiri jika mereka bisa."',
                      '"De GLOBE-studie ontdekte dat in bijna elke cultuur de gewenste machtafstand van mensen lager is dan de machtafstand die ze daadwerkelijk ervaren. Hoge-PD-culturen zijn geen culturen die er willen blijven — het zijn culturen die momenteel op een manier functioneren die hun eigen leden zouden matigen als ze konden."'
                    )}
                  </p>
                  <p style={{ color: orange, fontSize: 13, fontWeight: 600, margin: 0, position: "relative" }}>
                    — {t("House et al., GLOBE Study (2004)", "House dkk., Studi GLOBE (2004)", "House e.a., GLOBE-studie (2004)")}
                  </p>
                </div>

                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
                  {t(
                    'Robert House and over 200 researchers studied 17,300 mid-level managers across 62 societies between 1991 and 2007. GLOBE made a crucial distinction: "As Is" scores — how things actually are — vs "Should Be" scores — how people believe things should be. For Power Distance specifically, the gap between As Is and Should Be is one of the most striking findings in cross-cultural research. It means the gap between what is and what people would prefer is often exactly where change is possible.',
                    "Robert House dan lebih dari 200 peneliti mempelajari 17.300 manajer tingkat menengah di 62 masyarakat antara tahun 1991 dan 2007. GLOBE membuat perbedaan penting: skor 'Kondisi Nyata' — bagaimana keadaan sebenarnya — vs skor 'Kondisi Ideal' — bagaimana orang percaya keadaan seharusnya. Khusus untuk Jarak Kekuasaan, kesenjangan antara Kondisi Nyata dan Kondisi Ideal adalah salah satu temuan paling mencolok dalam penelitian lintas budaya.",
                    "Robert House en meer dan 200 onderzoekers bestudeerden 17.300 middelmanagers in 62 samenlevingen tussen 1991 en 2007. GLOBE maakte een cruciaal onderscheid: 'Huidig'-scores — hoe dingen werkelijk zijn — vs 'Gewenst'-scores — hoe mensen denken dat dingen zouden moeten zijn. Voor Machtafstand specifiek is de kloof tussen Huidig en Gewenst een van de meest opvallende bevindingen in intercultureel onderzoek."
                  )}
                </p>

                <div style={{ borderLeft: `3px solid ${orange}`, paddingLeft: 20, marginBottom: 36 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    {t("Practical Implication", "Implikasi Praktis", "Praktische implicatie")}
                  </p>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                    {t(
                      "When a cross-cultural leader works to lower power distance in a high-PD team, they are not imposing a foreign value. They may be moving the team closer to what the team itself would prefer — if the data from 62 societies is any guide.",
                      "Ketika pemimpin lintas budaya bekerja untuk menurunkan jarak kekuasaan dalam tim PD tinggi, mereka tidak memaksakan nilai asing. Mereka mungkin menggerakkan tim lebih dekat ke apa yang diinginkan tim itu sendiri — jika data dari 62 masyarakat menjadi panduan.",
                      "Wanneer een interculturele leider werkt aan het verlagen van machtafstand in een hoge-PD-team, leggen ze geen vreemde waarde op. Ze bewegen het team mogelijk dichter naar wat het team zelf zou prefereren — als de data van 62 samenlevingen enige leidraad biedt."
                    )}
                  </p>
                </div>

                {/* GLOBE Bar Chart */}
                <div style={{ background: offWhite, borderRadius: 12, padding: "28px 28px 24px", boxShadow: "0 2px 16px oklch(20% 0.08 260 / 0.08)" }}>
                  <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: navy, marginBottom: 20, lineHeight: 1.3 }}>
                    {lang === "en" ? "GLOBE Power Distance: What Is vs What People Prefer" : lang === "id" ? "Jarak Kekuasaan GLOBE: Realitas vs Preferensi" : "GLOBE Machtafstand: Realiteit vs Voorkeur"}
                  </p>
                  <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: orange, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: bodyText, fontWeight: 600 }}>
                        {lang === "en" ? "As Is (current)" : lang === "id" ? "Kondisi Nyata" : "Huidig"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: "oklch(42% 0.10 260)", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: bodyText, fontWeight: 600 }}>
                        {lang === "en" ? "Should Be (preferred)" : lang === "id" ? "Kondisi Ideal" : "Gewenst"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {globeScores.map((c) => (
                      <div key={c.country.en}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginBottom: 5 }}>{c.country[lang]}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                          <div style={{ flex: 1, background: "oklch(92% 0.01 80)", borderRadius: 4, overflow: "hidden", height: 18 }}>
                            <div style={{ width: `${(c.asIs / 7) * 100}%`, height: "100%", background: orange, borderRadius: 4 }} />
                          </div>
                          <span style={{ width: 32, fontSize: 12, fontWeight: 700, color: bodyText, textAlign: "right", flexShrink: 0 }}>{c.asIs.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, background: "oklch(92% 0.01 80)", borderRadius: 4, overflow: "hidden", height: 18 }}>
                            <div style={{ width: `${(c.shouldBe / 7) * 100}%`, height: "100%", background: "oklch(42% 0.10 260)", borderRadius: 4 }} />
                          </div>
                          <span style={{ width: 32, fontSize: 12, fontWeight: 700, color: bodyText, textAlign: "right", flexShrink: 0 }}>{c.shouldBe.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingRight: 42 }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <span key={n} style={{ fontSize: 10, color: "oklch(60% 0.04 260)" }}>{n}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "oklch(60% 0.04 260)", fontStyle: "italic", marginTop: 16, marginBottom: 0 }}>
                    {t(
                      "Source: House et al., Culture, Leadership, and Organizations: The GLOBE Study of 62 Societies (2004). Scale 1–7.",
                      "Sumber: House dkk., Culture, Leadership, and Organizations: The GLOBE Study of 62 Societies (2004). Skala 1–7.",
                      "Bron: House e.a., Culture, Leadership, and Organizations: The GLOBE Study of 62 Societies (2004). Schaal 1–7."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Framework 2: Erin Meyer */}
          <div style={{ marginBottom: 4 }}>
            <button
              onClick={() => setOpenFramework(openFramework === 1 ? null : 1)}
              style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: offWhite, fontSize: 15, fontWeight: 800 }}>2</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.13em", textTransform: "uppercase", margin: "0 0 2px" }}>
                  {meyerFramework.label[lang]}
                </p>
                <h3 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(18px, 2.8vw, 24px)", fontWeight: 800, color: navy, margin: 0, lineHeight: 1.2 }}>
                  {meyerFramework.title[lang]}
                </h3>
              </div>
              <span style={{ color: openFramework === 1 ? orange : "oklch(65% 0.04 260)", fontSize: 22, fontWeight: 300, transform: openFramework === 1 ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", flexShrink: 0 }}>+</span>
            </button>
            {openFramework === 1 && (
              <div style={{ paddingBottom: 28 }}>
                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 24 }}>{meyerFramework.body[lang]}</p>
                <div style={{ borderLeft: `3px solid ${orange}`, paddingLeft: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    {t("Practical Implication", "Implikasi Praktis", "Praktische implicatie")}
                  </p>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, margin: 0 }}>{meyerFramework.implication[lang]}</p>
                </div>
              </div>
            )}
          </div>

          {/* Framework 3: Edward Hall */}
          <div style={{ marginBottom: 0 }}>
            <button
              onClick={() => setOpenFramework(openFramework === 2 ? null : 2)}
              style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: offWhite, fontSize: 15, fontWeight: 800 }}>3</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: orange, letterSpacing: "0.13em", textTransform: "uppercase", margin: "0 0 2px" }}>
                  {hallFramework.label[lang]}
                </p>
                <h3 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(18px, 2.8vw, 24px)", fontWeight: 800, color: navy, margin: 0, lineHeight: 1.2 }}>
                  {hallFramework.title[lang]}
                </h3>
              </div>
              <span style={{ color: openFramework === 2 ? orange : "oklch(65% 0.04 260)", fontSize: 22, fontWeight: 300, transform: openFramework === 2 ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", flexShrink: 0 }}>+</span>
            </button>
            {openFramework === 2 && (
              <div style={{ paddingBottom: 28 }}>
                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 24 }}>{hallFramework.body[lang]}</p>
                <div style={{ borderLeft: `3px solid ${orange}`, paddingLeft: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    {t("Practical Implication", "Implikasi Praktis", "Praktische implicatie")}
                  </p>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, margin: 0 }}>{hallFramework.implication[lang]}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── SECTION 3: FRICTION POINTS — ACCORDION ────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Where It Goes Wrong", "Di Mana Ini Salah", "Waar Het Misgaat")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
            {t("4 Friction Points in Cross-Cultural Teams", "4 Titik Gesekan dalam Tim Lintas Budaya", "4 Wrijvingspunten in Interculturele Teams")}
          </h2>
          <p style={{ color: bodyText, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            {t(
              "These are the moments where power distance gaps cause real damage — and where understanding changes everything. Click each to go deeper.",
              "Inilah saat-saat di mana kesenjangan jarak kekuasaan menyebabkan kerusakan nyata — dan di mana pemahaman mengubah segalanya. Klik masing-masing untuk lebih dalam.",
              "Dit zijn de momenten waarop machtafstandskloven echte schade aanrichten — en waar begrip alles verandert. Klik op elk voor meer diepgang."
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {frictionPoints.map((fp, i) => {
              const isOpen = openPoint === i;
              return (
                <div
                  key={fp.number}
                  style={{ background: offWhite, borderRadius: 10, overflow: "hidden", boxShadow: isOpen ? "0 4px 24px oklch(20% 0.08 260 / 0.12)" : "none", transition: "box-shadow 0.2s ease" }}
                >
                  <button
                    onClick={() => setOpenPoint(isOpen ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, color: isOpen ? orange : "oklch(75% 0.04 260)", lineHeight: 1, minWidth: 44, flexShrink: 0, transition: "color 0.15s ease" }}>
                      {fp.number}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, margin: "0 0 4px" }}>
                        {lang === "en" ? fp.en_title : lang === "id" ? fp.id_title : fp.nl_title}
                      </p>
                      <p style={{ fontSize: 13, color: bodyText, margin: 0, fontStyle: "italic" }}>
                        {lang === "en" ? fp.en_tagline : lang === "id" ? fp.id_tagline : fp.nl_tagline}
                      </p>
                    </div>
                    <span style={{ color: isOpen ? orange : "oklch(65% 0.04 260)", fontSize: 22, fontWeight: 300, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", flexShrink: 0 }}>+</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 28px 28px", borderTop: "1px solid oklch(92% 0.01 80)" }}>
                      <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                        <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.85, margin: 0 }}>
                          {lang === "en" ? fp.en_body : lang === "id" ? fp.id_body : fp.nl_body}
                        </p>
                        <div style={{ borderLeft: `3px solid ${orange}`, paddingLeft: 20 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                            {t("What to do", "Apa yang harus dilakukan", "Wat te doen")}
                          </p>
                          <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                            {lang === "en" ? fp.en_practice : lang === "id" ? fp.id_practice : fp.nl_practice}
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

      {/* ─── SECTION C: What Power Distance Actually Predicts ────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("Research Findings", "Temuan Penelitian", "Onderzoeksresultaten")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
            {t("What Power Distance Actually Predicts", "Apa yang Sebenarnya Diprediksi Jarak Kekuasaan", "Wat Machtafstand Werkelijk Voorspelt")}
          </h2>

          <style>{`
            @media (max-width: 600px) {
              .pd-insight-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          <div className="pd-insight-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {insightCards.map((card) => (
              <div key={card.id} style={{ background: offWhite, borderRadius: 10, padding: 28, boxShadow: "0 2px 16px oklch(20% 0.08 260 / 0.08)" }}>
                <div style={{ color: orange, marginBottom: 16 }}>{card.icon}</div>
                <p style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, marginBottom: 12, lineHeight: 1.3 }}>
                  {card.title[lang]}
                </p>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.85, marginBottom: 16 }}>{card.body[lang]}</p>
                <div style={{ borderTop: "1px solid oklch(90% 0.01 80)", paddingTop: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                    {t("For cross-cultural leaders:", "Bagi pemimpin lintas budaya:", "Voor interculturele leiders:")}
                  </p>
                  <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>{card.implication[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 4: FAITH ANCHOR ────────────────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("Faith Anchor", "Jangkar Iman", "Geloofsanker")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32, lineHeight: 1.2 }}>
          {t("Jesus and the Question of Power", "Yesus dan Pertanyaan tentang Kekuasaan", "Jezus en de Vraag naar Macht")}
        </h2>

        <div style={{ background: navy, borderRadius: 12, padding: "40px 44px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.4 }} />
          <div style={{ position: "absolute", bottom: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.3 }} />
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, position: "relative" }}>
            {t("Scripture", "Kitab Suci", "Schriftuur")}
          </p>
          <blockquote style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.65, fontStyle: "italic", margin: "0 0 20px", position: "relative" }}>
            {t(
              '"Whoever wants to become great among you must be your servant, and whoever wants to be first must be your slave — just as the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many."',
              '"Barangsiapa ingin menjadi besar di antara kamu, hendaklah ia menjadi pelayanmu, dan barangsiapa ingin menjadi terkemuka di antara kamu, hendaklah ia menjadi hambamu — sama seperti Anak Manusia datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang."',
              '"Wie groot wil zijn onder jullie, moet jullie dienaar zijn, en wie de eerste wil zijn, moet jullie slaaf zijn — zoals de Mensenzoon niet gekomen is om gediend te worden, maar om te dienen en zijn leven te geven als losgeld voor velen."'
            )}
          </blockquote>
          <p style={{ color: orange, fontSize: 14, fontWeight: 600, margin: 0, position: "relative" }}>
            {t("Matthew 20:26–28 (NIV)", "Matius 20:26–28", "Mattheüs 20:26–28")}
          </p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "Jesus lived in one of the highest power-distance cultures in the ancient world. Roman occupation. Religious hierarchy. Strict social order. He was not a low-PD leader in a low-PD context. He was a high-authority figure who chose to use power in a completely unexpected way.",
            "Yesus hidup dalam salah satu budaya jarak kekuasaan tertinggi di dunia kuno. Pendudukan Romawi. Hierarki keagamaan. Tatanan sosial yang ketat. Dia bukan pemimpin PD rendah dalam konteks PD rendah. Dia adalah tokoh otoritas tinggi yang memilih menggunakan kekuasaan dengan cara yang sama sekali tidak terduga.",
            "Jezus leefde in een van de hoogste machtafstandsculturen in de antieke wereld. Romeinse bezetting. Religieuze hiërarchie. Strikte sociale orde. Hij was geen lage-PD-leider in een lage-PD-context. Hij was een hoge-autoriteits figuur die ervoor koos macht op een volledig onverwachte manier te gebruiken."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "He did not dismantle hierarchy. He filled it with something different: love, sacrifice, and service. When he washed his disciples' feet (John 13), he was not pretending power did not exist — he was demonstrating what legitimate power does when it is grounded in love rather than status.",
            "Dia tidak meruntuhkan hierarki. Dia mengisinya dengan sesuatu yang berbeda: cinta, pengorbanan, dan pelayanan. Ketika Dia membasuh kaki murid-murid-Nya (Yohanes 13), Dia tidak berpura-pura kekuasaan tidak ada — Dia menunjukkan apa yang dilakukan kekuasaan yang sah ketika berakar pada cinta daripada status.",
            "Hij ontmantelde de hiërarchie niet. Hij vulde haar met iets anders: liefde, opoffering en dienst. Toen hij de voeten van zijn discipelen waste (Johannes 13), deed hij niet alsof macht niet bestond — hij demonstreerde wat legitieme macht doet wanneer ze geworteld is in liefde in plaats van status."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85 }}>
          {t(
            "This gives cross-cultural leaders something neither high PD nor low PD culture alone can offer: a model where authority is real, visible, and secure — and where that authority is used entirely in the service of others. You do not have to choose between leading clearly and serving deeply. Jesus did both.",
            "Ini memberi pemimpin lintas budaya sesuatu yang tidak dapat ditawarkan oleh budaya PD tinggi atau rendah saja: model di mana otoritas nyata, terlihat, dan aman — dan di mana otoritas itu digunakan sepenuhnya untuk melayani orang lain. Anda tidak harus memilih antara memimpin dengan jelas dan melayani dengan sepenuh hati. Yesus melakukan keduanya.",
            "Dit geeft interculturele leiders iets wat noch hoge PD noch lage PD-cultuur alleen kan bieden: een model waar autoriteit echt, zichtbaar en veilig is — en waar die autoriteit volledig wordt ingezet ten dienste van anderen. Je hoeft niet te kiezen tussen helder leiden en diep dienen. Jezus deed beide."
          )}
        </p>

        {/* ─── SECTION D: Philippians 2 — Kenosis ─────────────────────────── */}
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 32, marginTop: 32 }}>
          {t(
            "The most theologically rich New Testament text on power and leadership goes further still. Writing to the church in Philippi — a congregation struggling with internal status divisions — Paul invokes what scholars believe is an early Christian hymn about the nature of Christ's authority.",
            "Teks Perjanjian Baru yang paling kaya secara teologis tentang kekuasaan dan kepemimpinan melangkah lebih jauh lagi. Saat menulis kepada jemaat di Filipi — sebuah jemaat yang bergumul dengan perpecahan status internal — Paulus mengutip apa yang diyakini para ahli sebagai himne Kristen awal tentang hakikat otoritas Kristus.",
            "De theologisch rijkste nieuwtestamentische tekst over macht en leiderschap gaat nog verder. Schrijvend aan de gemeente in Filippi — een gemeente die worstelde met interne statusverschillen — beroept Paulus zich op wat geleerden beschouwen als een vroeg-christelijke hymne over de aard van Christus' gezag."
          )}
        </p>

        <div style={{ background: navy, borderRadius: 12, padding: "40px 44px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.4 }} />
          <div style={{ position: "absolute", bottom: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.3 }} />
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, position: "relative" }}>
            {t("Scripture", "Kitab Suci", "Schriftuur")}
          </p>
          <blockquote style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: offWhite, lineHeight: 1.65, fontStyle: "italic", margin: "0 0 20px", position: "relative" }}>
            {t(
              '"In your relationships with one another, have the same mindset as Christ Jesus: who, being in very nature God, did not consider equality with God something to be used to his own advantage; rather, he made himself nothing by taking the very nature of a servant, being made in human likeness."',
              '"Hendaklah kamu dalam hidupmu bersama, menaruh pikiran dan perasaan yang terdapat juga dalam Kristus Yesus, yang walaupun dalam rupa Allah, tidak menganggap kesetaraan dengan Allah itu sebagai milik yang harus dipertahankan, melainkan telah mengosongkan diri-Nya sendiri, dan mengambil rupa seorang hamba, dan menjadi sama dengan manusia."',
              '"Laat die gezindheid bij u zijn die ook in Christus Jezus was: die, hoewel hij de gestalte van God had, het er niet voor hield gelijk te zijn aan God iets om vast te houden, maar zichzelf ontledigd heeft door de gestalte van een slaaf aan te nemen en aan de mensen gelijk te worden."'
            )}
          </blockquote>
          <p style={{ color: orange, fontSize: 14, fontWeight: 600, margin: 0, position: "relative" }}>
            {t("Philippians 2:5–7 (NIV)", "Filipi 2:5–7", "Filippenzen 2:5–7")}
          </p>
        </div>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "The Greek term used here is kenosis — self-emptying. But notice what Paul does not say: that Christ stopped being God. He remained fully who he was — and redirected all that authority toward the service of others. This is the move a cross-cultural leader is being asked to make. Not to abandon authority, but to hold it differently.",
            "Istilah Yunani yang digunakan di sini adalah kenosis — pengosongan diri. Tetapi perhatikan apa yang tidak dikatakan Paulus: bahwa Kristus berhenti menjadi Allah. Dia tetap sepenuhnya siapa Dia — dan mengarahkan seluruh otoritas itu untuk melayani orang lain. Inilah langkah yang diminta dari seorang pemimpin lintas budaya. Bukan untuk meninggalkan otoritas, tetapi untuk memegangnya secara berbeda.",
            "De Griekse term die hier wordt gebruikt is kenosis — zelfontlediging. Maar let op wat Paulus niet zegt: dat Christus ophield God te zijn. Hij bleef volledig wie hij was — en richtte al die autoriteit op de dienst aan anderen. Dit is de stap die een interculturele leider wordt gevraagd te maken. Niet om autoriteit op te geven, maar om die anders te dragen."
          )}
        </p>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85, marginBottom: 20 }}>
          {t(
            "This matters because the well-meaning Western leader who tries to flatten power distance by making themselves invisible as a leader usually creates anxiety in a high-PD team, not empowerment. The team needs a visible leader. Kenosis is not self-erasure — it is self-giving. The difference shapes everything about how authority is used.",
            "Ini penting karena pemimpin Barat yang bermaksud baik yang mencoba meratakan jarak kekuasaan dengan membuat dirinya tidak terlihat sebagai pemimpin biasanya menciptakan kecemasan dalam tim PD tinggi, bukan pemberdayaan. Tim membutuhkan pemimpin yang terlihat. Kenosis bukan penghapusan diri — melainkan pemberian diri. Perbedaan ini membentuk segalanya tentang bagaimana otoritas digunakan.",
            "Dit is belangrijk omdat de goedbedoelende westerse leider die machtafstand probeert te verkleinen door zichzelf als leider onzichtbaar te maken, gewoonlijk angst creëert in een hoge-PD-team, geen empowerment. Het team heeft een zichtbare leider nodig. Kenosis is geen zelfverwijdering — het is zelfgave. Het verschil bepaalt alles over hoe autoriteit wordt gebruikt."
          )}
        </p>

        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.85 }}>
          {t(
            "Paul addressed Philippians 2 specifically to a church struggling with internal status divisions. The hymn was not written as a meditation on individual spirituality — it was written to address how power moves within a community. The cross-cultural leader who has Philippians 2 in their bones has a far richer frame for power than someone who only has Matthew 20.",
            "Paulus menulis Filipi 2 khusus kepada sebuah jemaat yang bergumul dengan perpecahan status internal. Himne ini tidak ditulis sebagai meditasi tentang spiritualitas individu — melainkan ditulis untuk mengatasi bagaimana kekuasaan bergerak dalam sebuah komunitas. Pemimpin lintas budaya yang menghayati Filipi 2 memiliki kerangka yang jauh lebih kaya untuk kekuasaan daripada seseorang yang hanya memiliki Matius 20.",
            "Paulus richtte Filippenzen 2 specifiek aan een gemeente die worstelde met interne statusverdeeldheid. De hymne was niet geschreven als een meditatie over individuele spiritualiteit — ze was geschreven om aan te pakken hoe macht beweegt binnen een gemeenschap. De interculturele leider die Filippenzen 2 in de botten heeft, beschikt over een veel rijker kader voor macht dan iemand die alleen Mattheüs 20 heeft."
          )}
        </p>
      </div>

      {/* ─── IMAGE 2 ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px oklch(20% 0.08 260 / 0.15)" }}>
          <Image
            src="/resources/power-distance-2.jpg"
            alt="Servant leadership — authority used in service of others"
            width={1312}
            height={736}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "oklch(60% 0.04 260)", marginTop: 10, fontStyle: "italic" }}>
          {t(
            "Real authority does not need to protect itself — it can afford to go low.",
            "Otoritas sejati tidak perlu melindungi dirinya sendiri — ia mampu untuk merendah.",
            "Echte autoriteit hoeft zichzelf niet te beschermen — ze kan het zich veroorloven om laag te gaan."
          )}
        </p>
      </div>

      {/* ─── SECTION 6: REFLECTION QUESTIONS ───────────────────────────────── */}
      <div style={{ padding: "80px 24px", maxWidth: 780, margin: "0 auto" }}>
        <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </p>
        <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12, lineHeight: 1.2 }}>
          {t("Sit With These", "Renungkan Ini", "Neem de Tijd Hiervoor")}
        </h2>
        <p style={{ color: bodyText, fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
          {t(
            "These questions are for your own reflection and for your team. The most growth often happens when you bring them to a conversation.",
            "Pertanyaan-pertanyaan ini untuk refleksi Anda sendiri dan untuk tim Anda. Pertumbuhan paling banyak sering terjadi ketika Anda membawanya ke percakapan.",
            "Deze vragen zijn voor je eigen reflectie en voor je team. De meeste groei vindt vaak plaats wanneer je ze in een gesprek inbrengt."
          )}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {reflectionQuestions.map((q) => (
            <div
              key={q.roman}
              style={{ background: lightGray, borderRadius: 10, padding: "24px 24px 24px 20px", display: "flex", gap: 16, alignItems: "flex-start", borderLeft: `3px solid ${orange}` }}
            >
              <span style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 24, flexShrink: 0, paddingTop: 2 }}>{q.roman}</span>
              <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.8, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SECTION F: Go Deeper — External Resources ───────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            {t("External Resources", "Sumber Daya Eksternal", "Externe Bronnen")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: navy, marginBottom: 56, lineHeight: 1.2 }}>
            Go Deeper
          </h2>

          {/* Watch */}
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Watch", "Tonton", "Bekijk")}
          </p>
          <div style={{ background: offWhite, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 16px oklch(20% 0.08 260 / 0.10)", marginBottom: 56 }}>
            <iframe
              src="https://www.youtube.com/embed/DqAJclwfyCw"
              title="Power Distance — Geert Hofstede"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", aspectRatio: "16/9", display: "block", border: "none" }}
            />
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <h3 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 17, fontWeight: 700, color: navy, margin: 0, flex: 1, lineHeight: 1.3 }}>
                  Power Distance — Geert Hofstede
                </h3>
                <span style={{ background: orange, color: offWhite, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, flexShrink: 0, letterSpacing: "0.05em", marginTop: 2 }}>
                  ~10 min
                </span>
              </div>
              <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {t(
                  "Hofstede explains Power Distance in his own words — the primary source. Recorded in 2014. Part of his ten-video series on all six cultural dimensions.",
                  "Hofstede menjelaskan Jarak Kekuasaan dengan kata-katanya sendiri — sumber utama. Direkam pada tahun 2014. Bagian dari seri sepuluh video tentang semua enam dimensi budaya.",
                  "Hofstede legt Machtafstand in eigen woorden uit — de primaire bron. Opgenomen in 2014. Onderdeel van zijn reeks van tien video's over alle zes culturele dimensies."
                )}
              </p>
            </div>
          </div>

          {/* Try It */}
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Try It", "Coba", "Probeer Het")}
          </p>
          <div style={{ background: navy, borderRadius: 10, padding: "36px 40px", marginBottom: 56, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "oklch(30% 0.12 260)", opacity: 0.4 }} />
            <h3 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 20, fontWeight: 800, color: offWhite, margin: "0 0 12px", position: "relative", lineHeight: 1.3 }}>
              Hofstede Insights — Country Comparison
            </h3>
            <p style={{ fontSize: 15, color: "oklch(80% 0.04 260)", lineHeight: 1.8, marginBottom: 28, position: "relative", maxWidth: 520 }}>
              {t(
                "Enter your home country and your team's countries to see all six Hofstede dimensions side by side. The most useful single tool for a cross-cultural leader doing PD analysis.",
                "Masukkan negara asal Anda dan negara-negara tim Anda untuk melihat semua enam dimensi Hofstede berdampingan. Alat tunggal paling berguna bagi pemimpin lintas budaya yang melakukan analisis PD.",
                "Voer je eigen land en de landen van je team in om alle zes Hofstede-dimensies naast elkaar te zien. Het meest nuttige enkelvoudige hulpmiddel voor een interculturele leider die PD-analyse doet."
              )}
            </p>
            <a
              href="https://www.hofstede-insights.com/country-comparison-tool"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", padding: "14px 28px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none", position: "relative", letterSpacing: "0.02em" }}
            >
              {t("Open Comparison Tool →", "Buka Alat Perbandingan →", "Open Vergelijkingstool →")}
            </a>
          </div>

          {/* Read Further */}
          <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            {t("Read Further", "Bacaan Lanjutan", "Verder Lezen")}
          </p>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.8, marginBottom: 32 }}>
            {t(
              "The works below are the primary sources behind this module. Crispy Leaders makes them accessible — these take you to the original.",
              "Karya-karya di bawah ini adalah sumber utama di balik modul ini. Crispy Leaders membuatnya mudah diakses — karya-karya ini membawa Anda ke sumber aslinya.",
              "De onderstaande werken zijn de primaire bronnen achter deze module. Crispy Leaders maakt ze toegankelijk — deze brengen je naar het origineel."
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {readingList.map((item, i) => (
              <div key={i} style={{ padding: "24px 0", borderBottom: i < readingList.length - 1 ? "1px solid oklch(88% 0.01 80)" : "none" }}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <h4 style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px, 2.2vw, 21px)", fontWeight: 700, color: navy, margin: "0 0 6px", lineHeight: 1.3, textDecoration: "underline", textDecorationColor: "oklch(50% 0.08 260 / 0.3)", textUnderlineOffset: 3 }}>
                      {item.title}
                    </h4>
                  </a>
                ) : (
                  <h4 style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px, 2.2vw, 21px)", fontWeight: 700, color: navy, margin: "0 0 6px", lineHeight: 1.3 }}>
                    {item.title}
                  </h4>
                )}
                <p style={{ color: orange, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px" }}>
                  {item.authoryear}
                </p>
                <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                  {item.description[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA FOOTER ─────────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "72px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: orange }} />
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
              style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}
            >
              {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
            </Link>
            <Link
              href="/resources/intercultural-communication"
              style={{ display: "inline-block", padding: "14px 32px", border: "1px solid oklch(45% 0.05 260)", color: offWhite, borderRadius: 6, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
            >
              {t("Intercultural Communication →", "Komunikasi Antarbudaya →", "Interculturele Communicatie →")}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
