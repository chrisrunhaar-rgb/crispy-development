"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const PANES = [
  {
    key: "open",
    row: 0, col: 0,
    color: "oklch(48% 0.14 145)",
    colorBg: "oklch(48% 0.14 145 / 0.08)",
    colorBorder: "oklch(48% 0.14 145)",
    en_title: "Open", en_sub: "The Arena",
    id_title: "Terbuka", id_sub: "Arena",
    nl_title: "Open", nl_sub: "De Arena",
    en_body: "What is known both to you and to those around you. This is the space of honest, effective collaboration. The larger your Arena, the less energy people spend guessing your motives, second-guessing your decisions, or managing around your blind spots.",
    id_body: "Apa yang diketahui baik oleh Anda maupun orang-orang di sekitar Anda. Ini adalah ruang kolaborasi yang jujur dan efektif. Semakin besar Arena Anda, semakin sedikit energi yang dihabiskan orang untuk menebak motif Anda, meragukan keputusan Anda, atau mengelola sekitar titik buta Anda.",
    nl_body: "Wat zowel aan jou als aan mensen om je heen bekend is. Dit is de ruimte van eerlijke, effectieve samenwerking. Hoe groter je Arena, hoe minder energie mensen steken in het raden van je motieven, twijfelen aan je beslissingen of omgaan met je blinde vlekken.",
    en_cross: "In Dutch and German contexts, the Arena tends to be large — directness and transparency are cultural defaults. In Indonesian, Filipino, and many East Asian contexts, the Arena builds slowly through relational investment. Expecting a large Arena early often creates mistrust.",
    id_cross: "Dalam konteks Belanda dan Jerman, Arena cenderung besar — kejujuran dan transparansi adalah default budaya. Dalam konteks Indonesia, Filipina, dan banyak konteks Asia Timur, Arena berkembang perlahan melalui investasi relasional. Mengharapkan Arena yang besar di awal sering menciptakan ketidakpercayaan.",
    nl_cross: "In Nederlandse en Duitse contexten is de Arena doorgaans groot — directheid en transparantie zijn culturele standaarden. In Indonesische, Filippijnse en veel Oost-Aziatische contexten groeit de Arena langzaam via relationele investering. Het verwachten van een grote Arena vroeg schept vaak wantrouwen.",
    en_question: "Where in your leadership relationships has the Arena shrunk — and what closed it?",
    id_question: "Di mana dalam hubungan kepemimpinan Anda Arena menyusut — dan apa yang menutupnya?",
    nl_question: "Waar in je leiderschapsrelaties is de Arena gekrompen — en wat sloot hem?",
    en_action: "This week: share one thing about how you process conflict or feedback that your team probably doesn't know. Not vulnerability for vulnerability's sake — but information that helps them work with you better.",
    id_action: "Minggu ini: bagikan satu hal tentang bagaimana Anda memproses konflik atau umpan balik yang mungkin tidak diketahui tim Anda. Bukan kerentanan demi kerentanan — tetapi informasi yang membantu mereka bekerja lebih baik dengan Anda.",
    nl_action: "Deze week: deel één ding over hoe jij conflict of feedback verwerkt dat je team waarschijnlijk niet weet. Niet kwetsbaarheid om de kwetsbaarheid — maar informatie die hen helpt beter met jou samen te werken.",
  },
  {
    key: "blind",
    row: 0, col: 1,
    color: "oklch(58% 0.15 15)",
    colorBg: "oklch(58% 0.15 15 / 0.08)",
    colorBorder: "oklch(58% 0.15 15)",
    en_title: "Blind Spot",  en_sub: "What others see in you",
    id_title: "Titik Buta",  id_sub: "Apa yang dilihat orang lain pada Anda",
    nl_title: "Blinde vlek", nl_sub: "Wat anderen in jou zien",
    en_body: "What others observe in you that you cannot see yourself. This is the most dangerous quadrant for leaders: your impact on the room, the way your stress lands on your team, the patterns in how you make decisions under pressure. You are the last to know.",
    id_body: "Apa yang diamati orang lain pada diri Anda yang tidak bisa Anda lihat sendiri. Ini adalah kuadran paling berbahaya bagi pemimpin: dampak Anda di ruangan, cara stres Anda mempengaruhi tim, pola cara Anda mengambil keputusan di bawah tekanan. Anda adalah orang terakhir yang tahu.",
    nl_body: "Wat anderen in jou waarnemen dat jij zelf niet kunt zien. Dit is het gevaarlijkste kwadrant voor leiders: je impact op de kamer, de manier waarop je stress op je team landt, de patronen in hoe je beslissingen neemt onder druk. Jij bent de laatste die het weet.",
    en_cross: "Cross-cultural blind spots are especially common. A Western leader's 'directness' may land as aggression. An Indonesian leader's 'respect for hierarchy' may land as withholding. Neither intends the impact they create.",
    id_cross: "Titik buta lintas budaya sangat umum terjadi. 'Ketegasan' pemimpin Barat mungkin terasa seperti agresi. 'Penghormatan terhadap hierarki' pemimpin Indonesia mungkin terasa seperti menahan informasi. Tidak ada yang bermaksud menciptakan dampak yang mereka buat.",
    nl_cross: "Interculturele blinde vlekken komen bijzonder vaak voor. De 'directheid' van een westerse leider kan agressief overkomen. Het 'respect voor hiërarchie' van een Indonesische leider kan overkomen als achterhouden. Niemand bedoelt de impact die ze creëren.",
    en_question: "If you could hear an honest conversation your team was having about your leadership style when you weren't in the room — what would you be afraid to hear?",
    id_question: "Jika Anda bisa mendengar percakapan jujur yang dilakukan tim Anda tentang gaya kepemimpinan Anda saat Anda tidak ada di ruangan — apa yang akan Anda takutkan untuk didengar?",
    nl_question: "Als je een eerlijk gesprek van je team over jouw leiderschapsstijl kon horen als je er niet bij was — wat zou je bang zijn te horen?",
    en_action: "This week: ask one person who will be honest with you — 'What's one thing I do that makes your job harder?' Listen without defending. Thank them. That gap is your blind spot.",
    id_action: "Minggu ini: tanyakan kepada satu orang yang akan jujur kepada Anda — 'Apa satu hal yang saya lakukan yang membuat pekerjaan Anda lebih sulit?' Dengarkan tanpa membela diri. Ucapkan terima kasih. Celah itu adalah titik buta Anda.",
    nl_action: "Deze week: vraag één persoon die eerlijk tegen je zal zijn — 'Wat is één ding wat ik doe dat jouw werk moeilijker maakt?' Luister zonder je te verdedigen. Bedank hen. Dat gat is je blinde vlek.",
  },
  {
    key: "hidden",
    row: 1, col: 0,
    color: "oklch(65% 0.15 45)",
    colorBg: "oklch(65% 0.15 45 / 0.08)",
    colorBorder: "oklch(65% 0.15 45)",
    en_title: "Hidden", en_sub: "The Facade",
    id_title: "Tersembunyi", id_sub: "Fasad",
    nl_title: "Verborgen", nl_sub: "De Façade",
    en_body: "What you know about yourself but have chosen not to share. Some of this is appropriate — not everything needs to be disclosed. But when the Hidden pane grows too large, the gap between your private self and your presented self creates exhaustion. You spend energy managing the gap.",
    id_body: "Apa yang Anda ketahui tentang diri sendiri tetapi memilih untuk tidak dibagikan. Sebagian dari ini wajar — tidak semuanya perlu diungkapkan. Tetapi ketika pane Tersembunyi tumbuh terlalu besar, celah antara diri pribadi dan diri yang ditampilkan menciptakan kelelahan. Anda menghabiskan energi mengelola celah tersebut.",
    nl_body: "Wat je over jezelf weet maar hebt gekozen niet te delen. Sommige hiervan is gepast — niet alles hoeft onthuld te worden. Maar wanneer het Verborgen deel te groot wordt, creëert de kloof tussen je private zelf en je gepresenteerde zelf uitputting. Je besteedt energie aan het beheren van de kloof.",
    en_cross: "In high-context cultures (Indonesia, Japan, Korea), a larger Hidden pane is not dysfunction — it is social wisdom. What you share with your team leader is different from what you share with a peer. Cross-cultural leaders must read this without pathologising it.",
    id_cross: "Dalam budaya high-context (Indonesia, Jepang, Korea), pane Tersembunyi yang lebih besar bukan disfungsi — itu adalah kebijaksanaan sosial. Apa yang Anda bagikan dengan pemimpin tim berbeda dari apa yang Anda bagikan dengan rekan. Pemimpin lintas budaya harus membaca ini tanpa menjadikannya patologis.",
    nl_cross: "In high-context culturen (Indonesië, Japan, Korea) is een groter Verborgen deel geen disfunctie — het is sociale wijsheid. Wat je deelt met je teamleider verschilt van wat je deelt met een peer. Interculturele leiders moeten dit kunnen lezen zonder het te pathologiseren.",
    en_question: "What is something true about your leadership — a struggle, a fear, a pattern — that you have never said out loud to your team?",
    id_question: "Apa sesuatu yang benar tentang kepemimpinan Anda — sebuah perjuangan, ketakutan, pola — yang belum pernah Anda katakan dengan keras kepada tim Anda?",
    nl_question: "Wat is iets waars over je leiderschap — een strijd, een angst, een patroon — dat je nooit hardop hebt gezegd tegen je team?",
    en_action: "This week: identify one thing in your Hidden pane that, if shared appropriately, would actually help your team trust you more. Consider whether it is time to move it toward the Open.",
    id_action: "Minggu ini: identifikasi satu hal dalam pane Tersembunyi Anda yang, jika dibagikan dengan tepat, sebenarnya akan membantu tim Anda mempercayai Anda lebih banyak. Pertimbangkan apakah sudah waktunya untuk memindahkannya ke arah Terbuka.",
    nl_action: "Deze week: identificeer één ding in je Verborgen deel dat, indien gepast gedeeld, je team er eigenlijk toe zou brengen je meer te vertrouwen. Overweeg of het tijd is om het naar het Open te verplaatsen.",
  },
  {
    key: "unknown",
    row: 1, col: 1,
    color: "oklch(45% 0.08 260)",
    colorBg: "oklch(45% 0.08 260 / 0.08)",
    colorBorder: "oklch(45% 0.08 260)",
    en_title: "Unknown", en_sub: "Undiscovered territory",
    id_title: "Tidak Diketahui", id_sub: "Wilayah yang belum ditemukan",
    nl_title: "Onbekend", nl_sub: "Onontdekt terrein",
    en_body: "What neither you nor others currently know about you. This is not emptiness — it is potential. It includes gifts not yet discovered, patterns not yet seen, capacities not yet tested. Cross-cultural challenge is one of the fastest ways to bring the Unknown into view.",
    id_body: "Apa yang saat ini tidak diketahui oleh Anda maupun orang lain tentang Anda. Ini bukan kekosongan — ini adalah potensi. Ini mencakup karunia yang belum ditemukan, pola yang belum terlihat, kapasitas yang belum diuji. Tantangan lintas budaya adalah salah satu cara tercepat untuk membawa yang Tidak Diketahui ke permukaan.",
    nl_body: "Wat op dit moment noch jij noch anderen over jou weten. Dit is geen leegte — het is potentieel. Het omvat gaven die nog niet ontdekt zijn, patronen die nog niet gezien zijn, capaciteiten die nog niet getest zijn. Interculturele uitdaging is een van de snelste manieren om het Onbekende zichtbaar te maken.",
    en_cross: "Every major cross-cultural posting reveals something leaders didn't know about themselves — a resilience they didn't have at home, a rigidity that only shows under unfamiliar pressure. The Unknown shrinks through challenge, not comfort.",
    id_cross: "Setiap penugasan lintas budaya utama mengungkapkan sesuatu tentang diri pemimpin yang belum mereka ketahui — ketahanan yang tidak mereka miliki di rumah, kekakuan yang hanya muncul di bawah tekanan yang tidak familiar. Yang Tidak Diketahui menyusut melalui tantangan, bukan kenyamanan.",
    nl_cross: "Elke grote interculturele uitzending onthult iets wat leiders niet over zichzelf wisten — een veerkracht die ze thuis niet hadden, een rigiditeit die alleen onder onbekende druk zichtbaar wordt. Het Onbekende krimpt door uitdaging, niet door comfort.",
    en_question: "What cross-cultural experience in the past two years has shown you something about yourself you didn't previously know?",
    id_question: "Pengalaman lintas budaya apa dalam dua tahun terakhir yang telah menunjukkan sesuatu tentang diri Anda yang belum Anda ketahui sebelumnya?",
    nl_question: "Welke interculturele ervaring in de afgelopen twee jaar heeft je iets over jezelf laten zien dat je eerder niet wist?",
    en_action: "This week: step deliberately into one unfamiliar cross-cultural situation — a conversation, a meeting, a responsibility you usually avoid. Notice what it surfaces in you. That is the Unknown becoming visible.",
    id_action: "Minggu ini: masuki dengan sengaja satu situasi lintas budaya yang tidak familiar — percakapan, rapat, tanggung jawab yang biasanya Anda hindari. Perhatikan apa yang muncul dalam diri Anda. Itulah yang Tidak Diketahui menjadi terlihat.",
    nl_action: "Deze week: stap bewust in één onbekende interculturele situatie — een gesprek, een vergadering, een verantwoordelijkheid die je normaal vermijdt. Merk op wat het in je naar boven brengt. Dat is het Onbekende dat zichtbaar wordt.",
  },
];

const VERSES = {
  "ps-139-23": {
    en_ref: "Psalm 139:23–24",
    id_ref: "Mazmur 139:23–24",
    nl_ref: "Psalm 139:23–24",
    en: "Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.",
    id: "Selidikilah aku, ya Allah, dan kenallah hatiku, ujilah aku dan kenallah pikiran-pikiranku; lihatlah, apakah jalanku serong, dan tuntunlah aku di jalan yang kekal!",
    nl: "Doorgrond mij, God, en ken mijn hart, peil mij, weet wat mij beweegt, zie of ik niet op een dwaalweg ben en leid mij op de weg die eeuwig is.",
  },
  "1cor-13-12": {
    en_ref: "1 Corinthians 13:12",
    id_ref: "1 Korintus 13:12",
    nl_ref: "1 Korintiërs 13:12",
    en: "For now we see only a reflection as in a mirror; then we shall see face to face. Now I know in part; then I shall know fully, even as I am fully known.",
    id: "Karena sekarang kita melihat dalam cermin suatu gambaran yang samar-samar, tetapi nanti kita akan melihat muka dengan muka. Sekarang aku hanya mengenal dengan tidak sempurna, tetapi nanti aku akan mengenal dengan sempurna, seperti aku sendiri dikenal dengan sempurna.",
    nl: "Nu kijken we nog in een spiegel en zien slechts een onduidelijk beeld, maar straks staan we oog in oog. Nu ken ik nog slechts ten dele, maar straks zal ik volledig kennen, zoals ik zelf gekend word.",
  },
};


const BIBLICAL_ANCHORS: Record<string, {
  en_title: string; id_title: string; nl_title: string;
  en_text: string; id_text: string; nl_text: string;
}> = {
  open: {
    en_title: "Paul — the Open leader",
    id_title: "Paulus — pemimpin yang Terbuka",
    nl_title: "Paulus — de Open leider",
    en_text: "Paul was one of the most self-disclosing leaders in the New Testament. He named his weakness openly — a 'thorn in the flesh' he could not remove. He called himself 'the chief of sinners'. He wrote about his inner conflict with unflinching honesty. This was not self-pity. It was deliberate openness — turning vulnerability into a doorway for others. His Arena was large, not because he had nothing to hide, but because he believed that honesty disarms shame and builds trust in ways that polished leadership never can.",
    id_text: "Paulus adalah salah satu pemimpin yang paling terbuka dalam Perjanjian Baru. Ia menyebutkan kelemahannya secara terbuka — 'duri dalam daging' yang tidak bisa dihilangkan. Ia menyebut dirinya 'yang paling utama di antara orang-orang berdosa'. Ia menulis tentang konflik batinnya dengan kejujuran yang tak tergoyahkan. Ini bukan ratapan diri. Ini adalah keterbukaan yang disengaja — mengubah kelemahannya menjadi pintu bagi orang lain. Arenanya besar, bukan karena tidak ada yang disembunyikan, tetapi karena ia percaya bahwa kejujuran melucuti rasa malu dan membangun kepercayaan dengan cara yang tidak bisa dilakukan kepemimpinan yang sempurna.",
    nl_text: "Paulus was een van de meest zelfonthullende leiders in het Nieuwe Testament. Hij noemde zijn zwakheid openlijk — een 'doorn in het vlees' die hij niet kon verwijderen. Hij noemde zichzelf 'de voornaamste der zondaren'. Hij schreef over zijn innerlijk conflict met meedogenloze eerlijkheid. Dit was geen zelfmedelijden. Het was bewuste openheid — zijn kwetsbaarheid omzetten in een deur voor anderen. Zijn Arena was groot, niet omdat hij niets te verbergen had, maar omdat hij geloofde dat eerlijkheid schaamte ontwapent en vertrouwen opbouwt op manieren die gepolijst leiderschap nooit kan.",
  },
  blind: {
    en_title: "David & Nathan — the gift of the mirror",
    id_title: "Daud & Natan — anugerah cermin",
    nl_title: "David & Nathan — het geschenk van de spiegel",
    en_text: "David was a king who could not see what everyone else could. His affair with Bathsheba, the arranged death of Uriah — he had rationalised it all. It took a prophet with a story about a stolen lamb to break through. When Nathan said 'You are the man,' David did not defend himself. He did not deflect, manage the narrative, or remove Nathan from his inner circle. He said simply: 'I have sinned against the Lord.' The blind spot was exposed. The response made all the difference. The leader who cannot receive the mirror is the leader who cannot grow.",
    id_text: "Daud adalah raja yang tidak dapat melihat apa yang dapat dilihat semua orang. Perselingkuhannya dengan Batsyeba, kematian Uria yang direncanakan — ia telah merasionalisasi semuanya. Diperlukan seorang nabi dengan cerita tentang seekor domba yang dicuri untuk menembus pertahanannya. Ketika Natan berkata 'Engkaulah orang itu,' Daud tidak membela diri. Ia tidak mengalihkan, mengelola narasi, atau mengeluarkan Natan dari lingkaran dalamnya. Ia berkata dengan sederhana: 'Aku telah berdosa kepada TUHAN.' Titik butanya terungkap. Responnya membuat semua perbedaan. Pemimpin yang tidak dapat menerima cermin adalah pemimpin yang tidak dapat bertumbuh.",
    nl_text: "David was een koning die niet kon zien wat iedereen anders kon. Zijn affaire met Batseba, de geregelde dood van Uria — hij had het allemaal gerationaliseerd. Er was een profeet nodig met een verhaal over een gestolen lam om door te breken. Toen Nathan zei 'U bent die man,' verdedigde David zichzelf niet. Hij week niet uit, beheerde het verhaal niet, of verwijderde Nathan niet uit zijn innerlijke kring. Hij zei eenvoudig: 'Ik heb gezondigd tegen de HEER.' De blinde vlek was onthuld. De reactie maakte alle verschil. De leider die de spiegel niet kan ontvangen is de leider die niet kan groeien.",
  },
  hidden: {
    en_title: "Peter at the fire — restored, not exposed",
    id_title: "Petrus di perapian — dipulihkan, bukan dipermalukan",
    nl_title: "Petrus bij het vuur — hersteld, niet ontmaskerd",
    en_text: "Peter's denial was the most public failure of the inner circle. Three times, beside a fire, he said he did not know Jesus. He hid — not just his fear, but his love, his commitment, his identity. When Jesus restored him at the lakeside, he did not do it before the crowd. He asked three quiet questions, one for each denial. Not to expose Peter, but to heal him. The pattern matters: what is Hidden should not be forced into the open. It surfaces best in safety, in genuine relationship, when the one asking truly wants your flourishing.",
    id_text: "Penyangkalan Petrus adalah kegagalan paling publik dari lingkaran dalam. Tiga kali, di samping api, ia berkata tidak mengenal Yesus. Ia menyembunyikan — bukan hanya ketakutannya, tetapi juga kasihnya, komitmennya, identitasnya. Ketika Yesus memulihkannya di tepi danau, Ia tidak melakukannya di depan orang banyak. Ia mengajukan tiga pertanyaan yang tenang, satu untuk setiap penyangkalan. Bukan untuk mempermalukan Petrus, tetapi untuk menyembuhkannya. Polanya penting: apa yang Tersembunyi tidak boleh dipaksakan ke permukaan. Ia paling baik muncul dalam keamanan, dalam hubungan yang tulus, ketika orang yang bertanya benar-benar menginginkan kemakmuran Anda.",
    nl_text: "Petrus' verloochening was het meest publieke falen van de innerlijke kring. Drie keer, bij een vuur, zei hij Jezus niet te kennen. Hij verborg — niet alleen zijn angst, maar ook zijn liefde, zijn toewijding, zijn identiteit. Toen Jezus hem herstelde aan het meer, deed hij dat niet voor de menigte. Hij stelde drie stille vragen, één voor elke verloochening. Niet om Petrus te ontmaskeren, maar om hem te genezen. Het patroon is belangrijk: wat Verborgen is moet niet worden gedwongen naar buiten. Het komt het beste naar boven in veiligheid, in echte relatie, wanneer de vragende persoon oprecht jouw bloei wil.",
  },
  unknown: {
    en_title: "Abraham leaving Ur — faith into the Unknown",
    id_title: "Abraham meninggalkan Ur — iman menuju yang Tidak Diketahui",
    nl_title: "Abraham verlaat Ur — geloof in het Onbekende",
    en_text: "Abraham left Ur without knowing where he was going. Hebrews 11 is explicit: 'He went out, not knowing where he was going.' The Unknown was not a problem to solve before departure — it was the terrain of faith itself. Every leader has a pane of self that has not yet been tested, gifts not yet summoned, strengths not yet called upon. Cross-cultural displacement is one of God's most reliable tools for shrinking the Unknown: it strips the familiar scaffolding and shows you who you are underneath. What God calls you into will always exceed what you can map in advance.",
    id_text: "Abraham meninggalkan Ur tanpa mengetahui ke mana ia pergi. Ibrani 11 dengan jelas menyatakannya: 'Ia pergi, dan ia tidak tahu ke mana ia pergi.' Yang Tidak Diketahui bukanlah masalah yang harus diselesaikan sebelum berangkat — itu adalah medan iman itu sendiri. Setiap pemimpin memiliki aspek diri yang belum pernah diuji, karunia yang belum dipanggil, kekuatan yang belum digunakan. Perpindahan lintas budaya adalah salah satu alat Allah yang paling andal untuk menyusutkan yang Tidak Diketahui: ia melepas perancah yang familiar dan menunjukkan siapa Anda sebenarnya di dalamnya. Apa yang Allah panggil Anda ke dalamnya akan selalu melampaui apa yang dapat Anda petakan sebelumnya.",
    nl_text: "Abraham verliet Ur zonder te weten waar hij heen ging. Hebreeën 11 is expliciet: 'Hij ging weg, zonder te weten waar hij heen ging.' Het Onbekende was geen probleem om op te lossen vóór vertrek — het was het terrein van het geloof zelf. Elke leider heeft een deel van zichzelf dat nog niet getest is, gaven die nog niet zijn opgeroepen, krachten die nog niet zijn aangesproken. Interculturele verplaatsing is een van Gods meest betrouwbare instrumenten om het Onbekende te verkleinen: het verwijdert de vertrouwde steigers en laat zien wie je daaronder bent. Waartoe God je roept zal altijd verder gaan dan wat je van tevoren kunt in kaart brengen.",
  },
};

type Props = { userPathway: string | null; isSaved: boolean };

export default function JohariWindowClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activePane, setActivePane] = useState<string | null>(null);
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);
  const showSave = userPathway !== null;
  const translation = lang === "id" ? "TB" : lang === "nl" ? "NBV" : "NIV";

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("johari-window");
      setSaved(true);
    });
  }

  const selected = activePane ? PANES.find(p => p.key === activePane) ?? null : null;

  return (
    <>
      <LangToggle />
      {/* ── HERO ── */}
      <section style={{ background: "oklch(22% 0.10 260)", paddingTop: "clamp(2.5rem, 4vw, 4rem)", paddingBottom: "clamp(2.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, oklch(97% 0.005 80 / 0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development · Guide", "Pengembangan Pribadi · Panduan", "Persoonlijke Ontwikkeling · Gids")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, fontSize: "clamp(40px, 6vw, 72px)", color: "oklch(97% 0.005 80)", margin: "0 0 24px", lineHeight: 1.08 }}>
            {lang === "en" ? <>The Johari<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Window.</span></> : lang === "id" ? <>Jendela<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Johari.</span></> : <>Het Johari<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Venster.</span></>}
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "oklch(72% 0.04 260)", maxWidth: "50ch", marginBottom: "2rem", lineHeight: 1.65 }}>
            {t(
              "A map of what is seen, hidden, and unknown in your leadership. Click each quadrant to explore it.",
              "Peta tentang apa yang terlihat, tersembunyi, dan tidak diketahui dalam kepemimpinan Anda. Klik setiap kuadran untuk menjelajahinya.",
              "Een kaart van wat zichtbaar, verborgen en onbekend is in jouw leiderschap. Klik op elk kwadrant om het te verkennen.",
            )}
          </p>

          {showSave && (
            saved ? (
              <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                ✓ {t("In your dashboard", "Di dashboard Anda", "In uw dashboard")}
              </Link>
            ) : (
              <button onClick={handleSave} disabled={isPending} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.625rem 1.25rem", cursor: isPending ? "wait" : "pointer" }}>
                {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
              </button>
            )
          )}
        </div>
      </section>

      {/* ── THE WINDOW ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">

          {/* Axis labels + grid */}
          <div style={{ marginBottom: "0.5rem" }}>
            {/* Top axis labels */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0, marginBottom: "2px" }}>
              <div style={{ width: "clamp(72px, 9vw, 110px)" }} />
              <div style={{ padding: "0 1rem 0.75rem", textAlign: "center", borderBottom: "2px solid oklch(85% 0.012 260)" }}>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(48% 0.18 145)" }}>
                  {t("Known", "Diketahui", "Bekend")}
                </div>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(50% 0.06 260)" }}>
                  {t("to yourself", "diri sendiri", "aan jezelf")}
                </div>
              </div>
              <div style={{ padding: "0 1rem 0.75rem", textAlign: "center", borderBottom: "2px solid oklch(85% 0.012 260)" }}>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(62% 0.17 50)" }}>
                  {t("Unknown", "Tidak diketahui", "Onbekend")}
                </div>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(50% 0.06 260)" }}>
                  {t("to yourself", "diri sendiri", "aan jezelf")}
                </div>
              </div>
            </div>

            {/* Grid rows */}
            {[0, 1].map(row => (
              <div key={row} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 0, marginBottom: "2px" }}>
                {/* Left axis label */}
                <div style={{ width: "clamp(72px, 9vw, 110px)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "0.875rem", borderRight: "2px solid oklch(85% 0.012 260)" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "0.08em", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25em" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 900, color: row === 0 ? "oklch(48% 0.18 145)" : "oklch(62% 0.17 50)" }}>
                      {row === 0 ? t("Known", "Diketahui", "Bekend") : t("Unknown", "Tidak diketahui", "Onbekend")}
                    </span>
                    <span style={{ fontSize: "0.56rem", fontWeight: 600, color: "oklch(50% 0.06 260)" }}>
                      {t("to others", "orang lain", "aan anderen")}
                    </span>
                  </span>
                </div>

                {/* Two cells in this row */}
                {PANES.filter(p => p.row === row).map(pane => {
                  const isActive = activePane === pane.key;
                  const title = lang === "en" ? pane.en_title : lang === "id" ? pane.id_title : pane.nl_title;
                  const sub = lang === "en" ? pane.en_sub : lang === "id" ? pane.id_sub : pane.nl_sub;
                  return (
                    <button
                      key={pane.key}
                      onClick={() => setActivePane(isActive ? null : pane.key)}
                      style={{
                        background: isActive ? pane.colorBg : "oklch(97% 0.005 80)",
                        border: `2px solid ${isActive ? pane.colorBorder : "oklch(88% 0.008 80)"}`,
                        cursor: "pointer",
                        padding: "clamp(1.5rem, 4vw, 2.5rem)",
                        textAlign: "center",
                        minHeight: "clamp(140px, 20vw, 200px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "all 0.15s ease",
                        position: "relative",
                      }}
                    >
                      {isActive && (
                        <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "8px", height: "8px", borderRadius: "50%", background: pane.color }} />
                      )}
                      <span style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 700, color: isActive ? pane.color : "oklch(75% 0.008 80)", lineHeight: 1, display: "block", marginBottom: "0.375rem" }}>
                        {title}
                      </span>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isActive ? pane.color : "oklch(65% 0.005 260)" }}>
                        {sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {!activePane && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.825rem", color: "oklch(60% 0.04 260)", textAlign: "center", marginTop: "1.5rem", fontStyle: "italic" }}>
              {t("Select any quadrant to explore it.", "Pilih kuadran mana pun untuk menjelajahinya.", "Selecteer een kwadrant om het te verkennen.")}
            </p>
          )}
        </div>
      </section>

      {/* ── QUADRANT DETAIL ── */}
      {selected && (
        <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: selected.colorBg, borderTop: `3px solid ${selected.color}` }}>
          <div className="container-wide">
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: selected.color, marginBottom: "0.5rem" }}>
              {lang === "en" ? selected.en_sub : lang === "id" ? selected.id_sub : selected.nl_sub}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "oklch(22% 0.10 260)", marginBottom: "2rem" }}>
              {lang === "en" ? selected.en_title : lang === "id" ? selected.id_title : selected.nl_title}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 5vw, 4rem)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(38% 0.05 260)", marginBottom: "1.5rem" }}>
                  {lang === "en" ? selected.en_body : lang === "id" ? selected.id_body : selected.nl_body}
                </p>
                <div style={{ background: "oklch(22% 0.10 260 / 0.06)", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: selected.color, marginBottom: "0.5rem" }}>
                    {t("Cross-cultural dimension", "Dimensi lintas budaya", "Interculturele dimensie")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.7, color: "oklch(38% 0.05 260)", margin: 0 }}>
                    {lang === "en" ? selected.en_cross : lang === "id" ? selected.id_cross : selected.nl_cross}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ background: "oklch(97% 0.005 80)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: selected.color, marginBottom: "0.625rem" }}>
                    {t("Reflection", "Refleksi", "Reflectie")}
                  </p>
                  <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.1rem", fontStyle: "italic", color: "oklch(28% 0.10 260)", lineHeight: 1.65, margin: 0 }}>
                    {lang === "en" ? selected.en_question : lang === "id" ? selected.id_question : selected.nl_question}
                  </p>
                </div>
                <div style={{ background: "oklch(22% 0.10 260)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.625rem" }}>
                    {t("This week", "Minggu ini", "Deze week")}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", lineHeight: 1.75, color: "oklch(78% 0.03 80)", margin: 0 }}>
                    {lang === "en" ? selected.en_action : lang === "id" ? selected.id_action : selected.nl_action}
                  </p>
                </div>
              </div>
            </div>

            {/* Biblical Anchor */}
            <div style={{ marginTop: "2.5rem", borderTop: `2px solid ${selected.color}30`, paddingTop: "2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: selected.color, marginBottom: "0.5rem" }}>
                {t("Biblical Anchor", "Jangkar Alkitab", "Bijbels Anker")}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700, color: "oklch(38% 0.05 260)", marginBottom: "1rem" }}>
                {lang === "en" ? BIBLICAL_ANCHORS[selected.key].en_title : lang === "id" ? BIBLICAL_ANCHORS[selected.key].id_title : BIBLICAL_ANCHORS[selected.key].nl_title}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.075rem", fontStyle: "italic", lineHeight: 1.72, color: "oklch(32% 0.08 260)", maxWidth: "72ch", margin: 0 }}>
                {lang === "en" ? BIBLICAL_ANCHORS[selected.key].en_text : lang === "id" ? BIBLICAL_ANCHORS[selected.key].id_text : BIBLICAL_ANCHORS[selected.key].nl_text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── BIBLICAL FOUNDATION ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.75rem" }}>
            {t("Biblical Foundation", "Landasan Alkitab", "Bijbelse basis")}
          </p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "oklch(97% 0.005 80)", marginBottom: "1.25rem", maxWidth: "36ch" }}>
            {t("Being known — and knowing yourself", "Dikenal — dan mengenal diri sendiri", "Gekend worden — en jezelf kennen")}
          </h2>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "1rem" }}>
            {t(
              "Psalm 139 is one of the most radical invitations in Scripture: 'Search me, God, and know my heart.' It is a prayer that deliberately opens the Blind Spot and the Unknown to God's sight — trusting that what He sees will not destroy you, but lead you.",
              "Mazmur 139 adalah salah satu undangan paling radikal dalam Kitab Suci: 'Selidikilah aku, ya Allah, dan kenallah hatiku.' Ini adalah doa yang dengan sengaja membuka Titik Buta dan yang Tidak Diketahui kepada pandangan Allah — mempercayai bahwa apa yang Dia lihat tidak akan menghancurkan Anda, tetapi memimpin Anda.",
              "Psalm 139 is een van de meest radicale uitnodigingen in de Schrift: 'Doorgrond mij, God, en ken mijn hart.' Het is een gebed dat bewust de Blinde Vlek en het Onbekende opent voor Gods blik — vertrouwend dat wat Hij ziet je niet zal vernietigen, maar leiden.",
            )}
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(72% 0.04 260)", maxWidth: "62ch", marginBottom: "2.5rem" }}>
            {t(
              "Paul's words in 1 Corinthians 13 name the fundamental limit of every Johari Window: we see in part. Full self-knowledge is eschatological — something awaiting us in the presence of God. That is not an excuse for complacency. It is a call to humility: the leader who thinks they see themselves clearly is often the most dangerous one in the room.",
              "Kata-kata Paulus dalam 1 Korintus 13 menyebutkan batas mendasar dari setiap Jendela Johari: kita melihat sebagian. Pengetahuan diri yang penuh bersifat eskatologis — sesuatu yang menanti kita di hadirat Allah. Itu bukan alasan untuk berpuas diri. Itu adalah panggilan untuk rendah hati: pemimpin yang berpikir mereka melihat diri mereka dengan jelas seringkali adalah yang paling berbahaya di ruangan.",
              "Paulus' woorden in 1 Korintiërs 13 benoemen de fundamentele grens van elk Johari Venster: we zien ten dele. Volledige zelfkennis is eschatologisch — iets dat ons wacht in de aanwezigheid van God. Dat is geen excuus voor zelfgenoegzaamheid. Het is een oproep tot nederigheid: de leider die denkt zichzelf duidelijk te zien is vaak de gevaarlijkste in de kamer.",
            )}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "oklch(35% 0.08 260)" }}>
            {(["ps-139-23", "1cor-13-12"] as const).map(key => {
              const v = VERSES[key];
              const ref = lang === "en" ? v.en_ref : lang === "id" ? v.id_ref : v.nl_ref;
              const text = lang === "en" ? v.en : lang === "id" ? v.id : v.nl;
              return (
                <div key={key} style={{ background: "oklch(28% 0.11 260)", padding: "2rem" }}>
                  <button onClick={() => setActiveVerse(key)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(65% 0.15 45)", fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "underline dotted", padding: 0, marginBottom: "0.875rem", display: "block" }}>
                    {ref} ({translation})
                  </button>
                  <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.05rem", fontStyle: "italic", color: "oklch(85% 0.03 80)", lineHeight: 1.65, margin: 0 }}>
                    "{text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de Bibliotheek")}
            </p>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "oklch(22% 0.10 260)", marginBottom: "1rem" }}>
              {t("Part of the full content library.", "Bagian dari perpustakaan konten lengkap.", "Onderdeel van de volledige contentbibliotheek.")}
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!userPathway ? (
                <Link href="/signup" className="btn-primary">{t("Join the Community →", "Bergabung →", "Word lid →")}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →", "Naar Dashboard →")}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending ? t("Saving…", "Menyimpan…", "Opslaan…") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan", "Verken de Bibliotheek")}</Link>
            </div>
          </div>
          <div style={{ background: "oklch(22% 0.10 260)", padding: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(80% 0.04 260)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {t(
                "\"The most growth-resistant leaders are not the ones with the most blind spots — they are the ones who never ask.\"",
                "\"Pemimpin yang paling resisten terhadap pertumbuhan bukan yang memiliki titik buta terbanyak — mereka yang tidak pernah bertanya.\"",
                "\"De meest groeiresistente leiders zijn niet degenen met de meeste blinde vlekken — het zijn degenen die nooit vragen.\"",
              )}
            </p>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crispy Development</span>
          </div>
        </div>
      </section>

      {/* ── VERSE POPUP ── */}
      {activeVerse && (
        <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1.5rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "oklch(97% 0.005 80)", borderRadius: "12px", padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)", maxWidth: "520px", width: "100%" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Cormorant Garamond, Georgia, serif)", fontSize: "1.25rem", fontStyle: "italic", color: "oklch(22% 0.10 260)", lineHeight: 1.65, marginBottom: "1rem" }}>
              "{lang === "en" ? VERSES[activeVerse as keyof typeof VERSES].en : lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id : VERSES[activeVerse as keyof typeof VERSES].nl}"
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
              — {lang === "en" ? VERSES[activeVerse as keyof typeof VERSES].en_ref : lang === "id" ? VERSES[activeVerse as keyof typeof VERSES].id_ref : VERSES[activeVerse as keyof typeof VERSES].nl_ref} ({translation})
            </p>
            <button onClick={() => setActiveVerse(null)} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, background: "oklch(22% 0.10 260)", color: "oklch(97% 0.005 80)", border: "none", padding: "0.625rem 1.5rem", cursor: "pointer", borderRadius: "4px" }}>
              {t("Close", "Tutup", "Sluiten")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
