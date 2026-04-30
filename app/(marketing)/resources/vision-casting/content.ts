// Vision Casting — content.ts
// All text content for the rebuilt Vision Casting module.
// Three languages: en (English), id (Indonesian), nl (Dutch).
// Imported by VisionCastingClient.tsx (THEO's build).
// CLEO — last updated 2026-04-30

export type Lang = { en: string; id: string; nl: string };
export type ChannelId = "passion" | "dreams" | "revelation" | "others";

// ---------------------------------------------------------------------------
// PAGE HERO
// ---------------------------------------------------------------------------

export const pageHero = {
  tag: {
    en: "Leadership · Guide",
    id: "Kepemimpinan · Panduan",
    nl: "Leiderschap · Gids",
  },
  title: {
    en: "Vision Casting",
    id: "Menebar Visi",
    nl: "Vision Casting",
  },
  scripture: {
    en: '"Where there is no vision, the people perish."',
    id: '"Di mana tidak ada visi, rakyat akan binasa."',
    nl: '"Waar geen visie is, vergaat het volk."',
  },
  scriptureRef: {
    en: "Proverbs 29:18",
    id: "Amsal 29:18",
    nl: "Spreuken 29:18",
  },
  caption: {
    en: "Most leaders only listen in one direction. God speaks in four.",
    id: "Kebanyakan pemimpin hanya mendengar dari satu arah. Allah berbicara melalui empat.",
    nl: "De meeste leiders luisteren maar in één richting. God spreekt er vier.",
  },
  intro1: {
    en: "Vision in Scripture is almost always the opposite of what we expect. It is something God reveals to us — often slowly, often through more than one channel, and almost always larger than the leader who first glimpses it. Andy Stanley puts it this way: vision is \"a clear mental picture of what could be, fuelled by the conviction that it should be\" (Visioneering, 1999). Without that conviction — the moral weight that comes from God — vision is just a goal.",
    id: "Visi dalam Kitab Suci hampir selalu berlawanan dengan apa yang kita bayangkan. Ini adalah sesuatu yang Allah nyatakan kepada kita — sering kali perlahan, sering kali melalui lebih dari satu saluran, dan hampir selalu lebih besar dari pemimpin yang pertama kali melihatnya. Andy Stanley mendefinisikannya seperti ini: visi adalah \"gambaran mental yang jelas tentang apa yang bisa ada, didorong oleh keyakinan bahwa itu seharusnya ada\" (Visioneering, 1999). Tanpa keyakinan itu — bobot moral yang datang dari Allah — visi hanyalah sebuah tujuan.",
    nl: "Visie in de Schrift is bijna altijd het tegenovergestelde van wat we verwachten. Het is iets wat God aan ons onthult — vaak langzaam, vaak via meer dan één kanaal, en bijna altijd groter dan de leider die het het eerste glimpt. Andy Stanley formuleert het zo: visie is \"een helder mentaal beeld van wat zou kunnen zijn, gevoed door de overtuiging dat het zo moet zijn\" (Visioneering, 1999). Zonder die overtuiging — het morele gewicht dat van God komt — is visie slechts een doel.",
  },
  intro2: {
    en: "For a cross-cultural Christian leader, vision sits inside the Great Commission — Jesus' ongoing call to make disciples of every nation. Your team's specific vision is a small piece of God's larger vision for the world. Knowing this is the difference between leading a project and stewarding a calling.",
    id: "Bagi seorang pemimpin Kristen lintas budaya, visi berada di dalam Amanat Agung — panggilan Yesus yang terus-menerus untuk menjadikan semua bangsa murid-Nya. Visi spesifik tim Anda adalah bagian kecil dari visi Allah yang lebih besar untuk dunia. Menyadari ini adalah perbedaan antara memimpin sebuah proyek dan menjaga sebuah panggilan.",
    nl: "Voor een interculturele christelijke leider ligt de visie binnen de Grote Opdracht — Jezus' voortdurende roep om van alle volken discipelen te maken. De specifieke visie van jouw team is een klein stukje van Gods grotere visie voor de wereld. Dit beseffen is het verschil tussen het leiden van een project en het bewaken van een roeping.",
  },
} as const;

// ---------------------------------------------------------------------------
// THE VISION COMPASS — four channels
// ---------------------------------------------------------------------------

export const compassIntro: Lang = {
  en: "Vision rarely comes from one direction. The Vision Compass maps four channels through which God speaks — each one different, each one needed. Most leaders only use one or two. The strongest team vision draws from all four.",
  id: "Visi jarang datang dari satu arah. Kompas Visi memetakan empat saluran di mana Allah berbicara — masing-masing berbeda, masing-masing diperlukan. Kebanyakan pemimpin hanya menggunakan satu atau dua. Visi tim yang paling kuat menggali dari keempat-empatnya.",
  nl: "Visie komt zelden van één kant. Het Visie Kompas brengt vier kanalen in kaart waardoor God spreekt — elk anders, elk nodig. De meeste leiders gebruiken er maar één of twee. De sterkste teamvisie put uit alle vier.",
};

export const channels: Array<{
  id: ChannelId;
  direction: "N" | "E" | "S" | "W";
  colorAccent: string;
  label: Lang;
  tagline: Lang;
  body: Lang;
  biblicalAnchorTitle: Lang;
  biblicalFigure: Lang;
  diagnosticQuestion: Lang;
  firstStepPractice: Lang;
}> = [
  {
    id: "passion",
    direction: "S",
    colorAccent: "oklch(55% 0.18 20)",
    label: {
      en: "Passion",
      id: "Gairah",
      nl: "Passie",
    },
    tagline: {
      en: "What cannot be ignored",
      id: "Apa yang tidak bisa diabaikan",
      nl: "Wat niet genegeerd kan worden",
    },
    body: {
      en: "Andy Stanley names this in Visioneering. His first building block: \"A vision begins as a concern.\" Vision in Scripture rarely begins with strategy — it begins with grief, longing, or unease that will not let the leader go. Passion is not the same as preference. A preference is what you enjoy; a passion is what you cannot put down.",
      id: "Andy Stanley menyebutkan ini dalam Visioneering. Bata bangunan pertamanya: \"Sebuah visi dimulai sebagai kekhawatiran.\" Visi dalam Kitab Suci jarang dimulai dengan strategi — itu dimulai dengan kesedihan, kerinduan, atau kegelisahan yang tidak akan melepaskan sang pemimpin. Gairah tidak sama dengan preferensi. Preferensi adalah apa yang Anda nikmati; gairah adalah apa yang tidak bisa Anda tinggalkan.",
      nl: "Andy Stanley benoemt dit in Visioneering. Zijn eerste bouwsteen: \"Een visie begint als een bezorgdheid.\" Visie in de Schrift begint zelden met strategie — het begint met verdriet, verlangen of onrust die de leider niet loslaat. Passie is niet hetzelfde als voorkeur. Een voorkeur is wat je leuk vindt; een passie is wat je niet kunt neerleggen.",
    },
    biblicalAnchorTitle: {
      en: "Nehemiah — grief that became a mission",
      id: "Nehemia — kesedihan yang menjadi misi",
      nl: "Nehemia — verdriet dat een missie werd",
    },
    biblicalFigure: {
      en: "When Nehemiah heard that the wall of Jerusalem was broken down and the gates burned, he sat down and wept and mourned for days, fasted and prayed. He did not yet have a plan. He did not yet have permission. He did not yet have a team. He had a concern that would not leave him. From that concern came one of the most carefully executed leadership projects in Scripture. Andy Stanley builds Visioneering around this story for a reason. The passion you cannot put down is often the first move of God's vision in you.",
      id: "Ketika Nehemia mendengar bahwa tembok Yerusalem telah runtuh dan pintu-pintunya terbakar, ia duduk, menangis, dan berkabung selama beberapa hari, berpuasa dan berdoa. Ia belum memiliki rencana. Ia belum mendapat izin. Ia belum memiliki tim. Ia memiliki kekhawatiran yang tidak mau pergi. Dari kekhawatiran itu lahirlah salah satu proyek kepemimpinan yang paling hati-hati dilaksanakan dalam Kitab Suci. Andy Stanley membangun Visioneering di sekitar kisah ini karena alasan yang baik. Gairah yang tidak bisa Anda tinggalkan sering kali merupakan langkah pertama visi Allah dalam diri Anda.",
      nl: "Toen Nehemia hoorde dat de muur van Jeruzalem was afgebroken en de poorten verbrand, ging hij zitten, huilde en rouwde dagenlang, vastte en bad. Hij had nog geen plan. Hij had nog geen toestemming. Hij had nog geen team. Hij had een bezorgdheid die hem niet losliet. Uit die bezorgdheid ontstond een van de meest zorgvuldig uitgevoerde leiderschapsprojecten in de Schrift. Andy Stanley bouwt Visioneering rondom dit verhaal — met reden. De passie die je niet kunt neerleggen is vaak de eerste beweging van Gods visie in jou.",
    },
    diagnosticQuestion: {
      en: "What concern have you been carrying for more than a year that you cannot put down?",
      id: "Kekhawatiran apa yang sudah Anda tanggung lebih dari setahun yang tidak bisa Anda tinggalkan?",
      nl: "Welke bezorgdheid draag je al meer dan een jaar mee die je niet kunt neerleggen?",
    },
    firstStepPractice: {
      en: "Write down the one issue, situation, or need that consistently breaks your heart or stirs you most. Bring it to prayer for the next four weeks. Notice whether it grows or fades.",
      id: "Tuliskan satu masalah, situasi, atau kebutuhan yang secara konsisten mematahkan hati Anda atau paling menggerakkan Anda. Bawa dalam doa selama empat minggu ke depan. Perhatikan apakah itu tumbuh atau memudar.",
      nl: "Schrijf de ene kwestie, situatie of nood op die consequent je hart breekt of je het meest beweegt. Breng het vier weken lang in gebed. Merk op of het groeit of vervaagt.",
    },
  },
  {
    id: "dreams",
    direction: "E",
    colorAccent: "oklch(50% 0.18 295)",
    label: {
      en: "Dreams",
      id: "Mimpi",
      nl: "Dromen",
    },
    tagline: {
      en: "What stirs the imagination",
      id: "Apa yang menggerakkan imajinasi",
      nl: "Wat de verbeelding beweegt",
    },
    body: {
      en: "Throughout Scripture God speaks through dreams. Joseph the patriarch dreams of grain bowing to grain (Genesis 37). Daniel interprets Nebuchadnezzar's dream (Daniel 2). These are literal dreams, but also longings — the future-imagination that stirs in our minds, often when we are quiet enough to hear it. Many leaders dismiss these as fantasy. Scripture treats them as data. This channel shows how vision arrives. Whether it is from God is what the five tests below are for.",
      id: "Sepanjang Kitab Suci, Allah berbicara melalui mimpi. Yusuf sang patriark bermimpi tentang berkas gandum yang membungkuk pada berkasnya (Kejadian 37). Daniel menafsirkan mimpi Nebukadnezar (Daniel 2). Ini adalah mimpi harfiah, tetapi juga kerinduan — imajinasi masa depan yang bergerak dalam pikiran kita, sering kali ketika kita cukup tenang untuk mendengarnya. Banyak pemimpin menganggapnya sebagai fantasi. Kitab Suci memperlakukannya sebagai data. Saluran ini menunjukkan bagaimana visi datang. Apakah itu dari Allah adalah tujuan dari lima pengujian di bawah ini.",
      nl: "Door de hele Schrift spreekt God door dromen. Jozef de aartsvader droomt van graanschoven die buigen voor zijn schoof (Genesis 37). Daniël interpreteert de droom van Nebukadnezar (Daniël 2). Dit zijn letterlijke dromen, maar ook verlangens — de toekomstverbeelding die in onze geest beweegt, vaak wanneer we stil genoeg zijn om het te horen. Veel leiders doen dit af als fantasie. De Schrift behandelt ze als gegevens. Dit kanaal laat zien hoe visie aankomt. Of het van God is, is waarvoor de vijf testen hieronder zijn.",
    },
    biblicalAnchorTitle: {
      en: "Joseph — the longing that cost everything",
      id: "Yusuf — kerinduan yang mengorbangkan segalanya",
      nl: "Jozef — het verlangen dat alles kostte",
    },
    biblicalFigure: {
      en: "Joseph dreamed of grain sheaves bowing to his sheaf, and stars and moon bowing to him. His brothers hated him for it. The dreams cost him almost everything — sold into slavery, falsely accused, imprisoned for years. But the dreams were from God, and they came true in ways Joseph could not have imagined. Cross-cultural leaders learn from him: the longing that stirs in your imagination is not always foolish. Hold it. Test it. Wait on it. God has used dreams since Genesis.",
      id: "Yusuf bermimpi tentang berkas-berkas gandum yang membungkuk pada berkasnya, dan bintang-bintang serta bulan membungkuk padanya. Saudara-saudaranya membencinya karena itu. Mimpi-mimpi itu hampir mengambil segalanya darinya — dijual sebagai budak, dituduh palsu, dipenjara selama bertahun-tahun. Tetapi mimpi-mimpi itu dari Allah, dan menjadi kenyataan dengan cara yang tidak bisa dibayangkan Yusuf. Para pemimpin lintas budaya belajar darinya: kerinduan yang bergerak dalam imajinasi Anda tidak selalu bodoh. Pegang itu. Uji itu. Tunggu itu. Allah telah menggunakan mimpi sejak Kejadian.",
      nl: "Jozef droomde van graanschoven die voor zijn schoof bogen, en sterren en maan die voor hem bogen. Zijn broers haatten hem erom. De dromen kostten hem bijna alles — als slaaf verkocht, valselijk beschuldigd, jarenlang gevangengezet. Maar de dromen kwamen van God en werden werkelijkheid op manieren die Jozef niet had kunnen bedenken. Interculturele leiders leren van hem: het verlangen dat in je verbeelding beweegt is niet altijd dwaas. Houd het vast. Test het. Wacht erop. God heeft dromen gebruikt sinds Genesis.",
    },
    diagnosticQuestion: {
      en: "What picture of the future keeps returning to you when you are quiet enough to hear it?",
      id: "Gambaran masa depan apa yang terus kembali kepada Anda ketika Anda cukup tenang untuk mendengarnya?",
      nl: "Welk toekomstbeeld keert steeds terug wanneer je stil genoeg bent om het te horen?",
    },
    firstStepPractice: {
      en: "Keep a notebook by your bed for one month. Write down what stirs in you on waking. Bring the notebook to prayer once a week. Notice what patterns emerge.",
      id: "Simpan buku catatan di samping tempat tidur Anda selama satu bulan. Tuliskan apa yang menggerakkan Anda saat bangun. Bawa buku catatan itu dalam doa sekali seminggu. Perhatikan pola apa yang muncul.",
      nl: "Houd een maand lang een notitieboekje bij je bed. Schrijf op wat er bij je opkomt bij het ontwaken. Breng het notitieboekje één keer per week in gebed. Merk op welke patronen zich voordoen.",
    },
  },
  {
    id: "revelation",
    direction: "N",
    colorAccent: "oklch(22% 0.10 260)",
    label: {
      en: "Revelation",
      id: "Wahyu",
      nl: "Openbaring",
    },
    tagline: {
      en: "What God speaks directly",
      id: "Apa yang Allah ucapkan langsung",
      nl: "Wat God rechtstreeks spreekt",
    },
    body: {
      en: "Sometimes God speaks more directly. Paul receives a vision of a man from Macedonia begging him to come (Acts 16:9), and the gospel crosses into Europe. Peter receives the vision of the sheet that opens the gospel to the Gentiles (Acts 10). These moments are rarer, but they are real. A leader who has not made room for them will miss them when they come. Revelation is not the same as a feeling that confirms what you already wanted to do. Real revelation usually surprises the leader, often disrupts plans, and almost always carries the weight of conviction that this is from God. This channel describes how vision arrives. The five tests below are the tool for testing that conviction.",
      id: "Terkadang Allah berbicara lebih langsung. Paulus menerima penglihatan tentang seorang laki-laki dari Makedonia yang memohonnya untuk datang (Kisah 16:9), dan Injil menyeberang ke Eropa. Petrus menerima penglihatan tentang kain besar yang membuka Injil bagi orang bukan Yahudi (Kisah 10). Saat-saat ini lebih jarang, tetapi nyata. Seorang pemimpin yang tidak menyediakan ruang bagi mereka akan melewatkan mereka ketika datang. Wahyu tidak sama dengan perasaan yang mengkonfirmasi apa yang sudah ingin Anda lakukan. Wahyu sejati biasanya mengejutkan pemimpin, sering kali mengganggu rencana, dan hampir selalu membawa bobot keyakinan bahwa ini dari Allah. Saluran ini menggambarkan bagaimana visi datang. Lima pengujian di bawah ini adalah alat untuk menguji keyakinan itu.",
      nl: "Soms spreekt God directer. Paulus ontvangt een visioen van een man uit Macedonië die hem smeekt te komen (Handelingen 16:9), en het evangelie steekt over naar Europa. Petrus ontvangt het visioen van het laken dat het evangelie opent voor de heidenen (Handelingen 10). Deze momenten zijn zeldzamer, maar ze zijn echt. Een leider die er geen ruimte voor heeft gemaakt, zal ze missen wanneer ze komen. Openbaring is niet hetzelfde als een gevoel dat bevestigt wat je al wilde doen. Echte openbaring verrast de leider gewoonlijk, verstoort vaak plannen, en draagt bijna altijd het gewicht van de overtuiging dat dit van God is. Dit kanaal beschrijft hoe visie aankomt. De vijf testen hieronder zijn het instrument om die overtuiging te testen.",
    },
    biblicalAnchorTitle: {
      en: "Paul — a vision that redirected a continent",
      id: "Paulus — penglihatan yang mengubah arah sebuah benua",
      nl: "Paulus — een visioen dat een continent omleide",
    },
    biblicalFigure: {
      en: "Acts 16 records that during the night Paul had a vision of a man of Macedonia standing and begging him, \"Come over to Macedonia and help us.\" Paul was already mid-mission, planning to go elsewhere, when the vision redirected him entirely. The next sentence: \"We got ready at once.\" Paul did not delay. Real revelation usually surprises the leader, often disrupts plans, and almost always carries the weight of conviction. The European church is rooted in a vision Paul received in his sleep.",
      id: "Kisah 16 mencatat bahwa pada malam hari Paulus mendapat penglihatan seorang laki-laki Makedonia berdiri dan memohonnya, \"Menyeberanglah ke Makedonia dan tolonglah kami.\" Paulus sudah berada di tengah misi, merencanakan untuk pergi ke tempat lain, ketika penglihatan itu sepenuhnya mengubah arahnya. Kalimat berikutnya: \"Segera kami berusaha berangkat ke Makedonia.\" Paulus tidak menunda. Wahyu sejati biasanya mengejutkan pemimpin, sering kali mengganggu rencana, dan hampir selalu membawa bobot keyakinan. Gereja di Eropa berakar pada penglihatan yang Paulus terima saat tidur.",
      nl: "Handelingen 16 vermeldt dat Paulus 's nachts een visioen had van een man uit Macedonië die stond en hem smeekte: \"Kom over naar Macedonië en help ons.\" Paulus was al midden in zijn reis, van plan ergens anders naartoe te gaan, toen het visioen hem volledig omleidde. De volgende zin: \"Wij maakten ons terstond gereed om naar Macedonië te reizen.\" Paulus vertraagde niet. Echte openbaring verrast de leider gewoonlijk, verstoort vaak plannen, en draagt bijna altijd het gewicht van overtuiging. De Europese kerk is geworteld in een visioen dat Paulus in zijn slaap ontving.",
    },
    diagnosticQuestion: {
      en: "When did you last make unhurried space for God to speak — not to confirm what you were already planning, but to surprise you?",
      id: "Kapan terakhir kali Anda membuat ruang yang tidak terburu-buru bagi Allah untuk berbicara — bukan untuk mengkonfirmasi apa yang sudah Anda rencanakan, tetapi untuk mengejutkan Anda?",
      nl: "Wanneer heb je voor het laatste ongehaaste ruimte gemaakt voor God om te spreken — niet om te bevestigen wat je al van plan was, maar om je te verrassen?",
    },
    firstStepPractice: {
      en: "Set aside one hour this week with no agenda. No Bible reading plan, no prayer list. Just silence and the question: \"Lord, is there anything you want to show me?\" Write down whatever comes.",
      id: "Sisihkan satu jam minggu ini tanpa agenda. Tidak ada rencana membaca Alkitab, tidak ada daftar doa. Hanya keheningan dan pertanyaan: \"Tuhan, adakah sesuatu yang ingin Engkau tunjukkan kepadaku?\" Tuliskan apa pun yang datang.",
      nl: "Zet deze week een uur apart zonder agenda. Geen Bijbelleerplan, geen gebedlijst. Alleen stilte en de vraag: \"Heer, is er iets wat U mij wilt laten zien?\" Schrijf op wat er komt.",
    },
  },
  {
    id: "others",
    direction: "W",
    colorAccent: "oklch(38% 0.12 155)",
    label: {
      en: "Others",
      id: "Sesama",
      nl: "Anderen",
    },
    tagline: {
      en: "What God reveals through community",
      id: "Apa yang Allah nyatakan melalui komunitas",
      nl: "Wat God onthult via gemeenschap",
    },
    body: {
      en: "This is the most underestimated channel. God almost never gives one leader the whole vision. Each member of the team sees a part — and the leader who only listens to their own passion, their own dreams, and their own revelation will carry an incomplete picture. The cross-cultural Christian team is especially well-positioned for this channel. Diversity of culture means diversity of vantage point. The Javanese team member, the Australian team member, the Filipino team member each see the same calling differently. The full picture emerges only when all four channels speak together.",
      id: "Ini adalah saluran yang paling diremehkan. Allah hampir tidak pernah memberikan seluruh visi kepada satu pemimpin. Setiap anggota tim melihat satu bagiannya — dan pemimpin yang hanya mendengarkan gairahnya sendiri, mimpinya sendiri, dan wahyunya sendiri akan membawa gambaran yang tidak lengkap. Tim Kristen lintas budaya sangat baik posisinya untuk saluran ini. Keragaman budaya berarti keragaman sudut pandang. Anggota tim dari Jawa, dari Australia, dari Filipina — masing-masing melihat panggilan yang sama secara berbeda. Gambaran penuh hanya muncul ketika keempat saluran berbicara bersama.",
      nl: "Dit is het meest onderschatte kanaal. God geeft bijna nooit één leider de hele visie. Elk teamlid ziet een deel — en de leider die alleen luistert naar zijn eigen passie, zijn eigen dromen en zijn eigen openbaring, draagt een onvolledig beeld. Het interculturele christelijke team is bijzonder goed gepositioneerd voor dit kanaal. Culturele diversiteit betekent diversiteit van gezichtspunt. Het Javaanse teamlid, het Australische teamlid, het Filipijnse teamlid — elk ziet dezelfde roeping anders. Het volledige beeld ontstaat pas wanneer alle vier kanalen samen spreken.",
    },
    biblicalAnchorTitle: {
      en: "Antioch — vision born in community",
      id: "Antiokhia — visi yang lahir dalam komunitas",
      nl: "Antiochië — visie geboren in gemeenschap",
    },
    biblicalFigure: {
      en: "While the church at Antioch was worshipping the Lord and fasting, the Holy Spirit said, \"Set apart for me Barnabas and Saul for the work to which I have called them.\" The call came to the community, not to Barnabas or Saul alone. The whole church laid hands on them and sent them off. The first cross-cultural mission journey in Christian history began as collective discernment, not personal ambition. The vision your team carries together is almost always larger and more accurate than the vision any one of you carries alone.",
      id: "Sementara gereja di Antiokhia sedang beribadah kepada Tuhan dan berpuasa, Roh Kudus berkata, \"Pisahkanlah Barnabas dan Saulus bagi-Ku untuk melakukan pekerjaan yang telah Kutentukan bagi mereka.\" Panggilan itu datang kepada komunitas, bukan kepada Barnabas atau Saulus seorang diri. Seluruh gereja menumpangkan tangan kepada mereka dan melepas mereka. Perjalanan misi lintas budaya pertama dalam sejarah Kekristenan dimulai sebagai pertimbangan bersama, bukan ambisi pribadi. Visi yang dibawa tim Anda bersama-sama hampir selalu lebih besar dan lebih akurat daripada visi yang dibawa salah satu dari Anda sendiri.",
      nl: "Terwijl de gemeente in Antiochië de Here aanbad en vastte, zei de Heilige Geest: \"Zondert Barnabas en Saulus voor Mij af voor het werk waartoe Ik hen geroepen heb.\" De roeping kwam tot de gemeenschap, niet tot Barnabas of Saulus alleen. De hele gemeente legde hun de handen op en zond hen weg. De eerste interculturele zendingsreis in de christelijke geschiedenis begon als collectieve onderscheiding, niet als persoonlijke ambitie. De visie die je team samen draagt is bijna altijd groter en nauwkeuriger dan de visie die ieder van jullie alleen draagt.",
    },
    diagnosticQuestion: {
      en: "Who in your team have you not yet asked what they see? Whose vision-channel are you not listening to?",
      id: "Siapa dalam tim Anda yang belum Anda tanya apa yang mereka lihat? Saluran visi siapa yang tidak Anda dengarkan?",
      nl: "Wie in je team heb je nog niet gevraagd wat zij zien? Naar wiens visiekanaal luister je niet?",
    },
    firstStepPractice: {
      en: "Schedule individual conversations with each team member this month. Ask one question: \"What do you see when you imagine this team three years from now?\" Take notes. Say nothing except \"tell me more.\"",
      id: "Jadwalkan percakapan individual dengan setiap anggota tim bulan ini. Ajukan satu pertanyaan: \"Apa yang Anda lihat ketika Anda membayangkan tim ini tiga tahun dari sekarang?\" Ambil catatan. Jangan katakan apa pun kecuali \"ceritakan lebih banyak.\"",
      nl: "Plan deze maand individuele gesprekken met elk teamlid. Stel één vraag: \"Wat zie jij als je je dit team over drie jaar voorstelt?\" Maak aantekeningen. Zeg niets anders dan \"vertel meer.\"",
    },
  },
];

// ---------------------------------------------------------------------------
// FIVE TESTS — Discernment Audit
// Adapted from Andy Stanley's Visioneering
// ---------------------------------------------------------------------------

export const fiveTestsIntro: Lang = {
  en: "Not every strong feeling is God-given vision. Andy Stanley's Visioneering offers a discernment framework — five questions that help a leader distinguish a God-originated vision from a good idea, a personal ambition, or a fear-driven reaction.",
  id: "Tidak setiap perasaan kuat adalah visi yang diberikan Allah. Visioneering karya Andy Stanley menawarkan kerangka penegasan — lima pertanyaan yang membantu pemimpin membedakan visi yang berasal dari Allah dari ide yang baik, ambisi pribadi, atau reaksi yang didorong ketakutan.",
  nl: "Niet elk sterk gevoel is door God gegeven visie. Visioneering van Andy Stanley biedt een onderscheidingskader — vijf vragen die een leider helpen een door God ingegeven visie te onderscheiden van een goed idee, persoonlijke ambitie, of een angstgedreven reactie.",
};

export const fiveTests: Array<{
  id: string;
  title: Lang;
  question: Lang;
  helpText: Lang;
}> = [
  {
    id: "time",
    title: {
      en: "Time",
      id: "Waktu",
      nl: "Tijd",
    },
    question: {
      en: "Has this vision survived at least three months of prayer and patience?",
      id: "Apakah visi ini telah bertahan setidaknya tiga bulan doa dan kesabaran?",
      nl: "Heeft deze visie minstens drie maanden van gebed en geduld overleefd?",
    },
    helpText: {
      en: "Andy Stanley writes: \"What God originates, he orchestrates.\" A vision that keeps returning and gathering weight over months is more likely from God than one that arrives intensely and fades just as quickly.",
      id: "Andy Stanley menulis: \"Apa yang Allah ciptakan, Dia atur.\" Sebuah visi yang terus kembali dan mengumpulkan berat selama berbulan-bulan lebih mungkin dari Allah daripada yang datang dengan intens dan pudar sama cepatnya.",
      nl: "Andy Stanley schrijft: \"Wat God origineert, orchestreert hij.\" Een visie die maandenlang blijft terugkeren en zwaarder wordt, is waarschijnlijker van God dan een die intens aankomt en net zo snel vervaagt.",
    },
  },
  {
    id: "scripture",
    title: {
      en: "Scripture",
      id: "Kitab Suci",
      nl: "Schrift",
    },
    question: {
      en: "Does this vision align with the character of God and the call of the Great Commission?",
      id: "Apakah visi ini selaras dengan karakter Allah dan panggilan Amanat Agung?",
      nl: "Sluit deze visie aan bij het karakter van God en de roeping van de Grote Opdracht?",
    },
    helpText: {
      en: "A vision that contradicts God's character is not from God, however passionate it feels. A vision aligned with the Great Commission — making disciples among all peoples — carries built-in weight.",
      id: "Sebuah visi yang bertentangan dengan karakter Allah tidak berasal dari Allah, betapapun bersemangatnya rasanya. Sebuah visi yang selaras dengan Amanat Agung — menjadikan semua bangsa murid — memiliki bobot bawaan.",
      nl: "Een visie die ingaat tegen Gods karakter is niet van God, hoe gepassioneerd het ook voelt. Een visie die aansluit bij de Grote Opdracht — discipelen maken onder alle volken — draagt ingebouwd gewicht.",
    },
  },
  {
    id: "community",
    title: {
      en: "Community",
      id: "Komunitas",
      nl: "Gemeenschap",
    },
    question: {
      en: "Have at least three trusted people independently confirmed this vision?",
      id: "Apakah setidaknya tiga orang yang dipercaya telah secara mandiri mengkonfirmasi visi ini?",
      nl: "Hebben ten minste drie betrouwbare mensen deze visie onafhankelijk bevestigd?",
    },
    helpText: {
      en: "If multiple trusted people confirm it without prompting, that is significant. If they unanimously hesitate, that is also significant. Neither silences God, but both are worth listening to. Choose people who are genuinely free to disagree — people who care about you enough to say no. Their hesitation is not a failure of faith; it is data.",
      id: "Jika beberapa orang yang dipercaya mengkonfirmasinya tanpa diminta, itu signifikan. Jika mereka dengan suara bulat ragu-ragu, itu juga signifikan. Keduanya tidak membungkam Allah, tetapi keduanya layak didengarkan. Pilih orang-orang yang benar-benar bebas untuk tidak setuju — orang-orang yang cukup peduli dengan Anda untuk mengatakan tidak. Keraguan mereka bukan kegagalan iman; itu adalah data.",
      nl: "Als meerdere vertrouwde mensen het zonder aanmoediging bevestigen, is dat significant. Als ze unaniem aarzelen, is dat ook significant. Geen van beide zwijgt God, maar beide zijn het waard om naar te luisteren. Kies mensen die echt vrij zijn om het niet eens te zijn — mensen die genoeg om je geven om nee te zeggen. Hun aarzeling is geen geloofsgebrek; het is data.",
    },
  },
  {
    id: "sacrifice",
    title: {
      en: "Sacrifice",
      id: "Pengorbanan",
      nl: "Opoffering",
    },
    question: {
      en: "Are you willing to pursue this vision even if it costs comfort, reputation, or recognition?",
      id: "Apakah Anda bersedia mengejar visi ini bahkan jika itu mengorbangkan kenyamanan, reputasi, atau pengakuan?",
      nl: "Ben je bereid deze visie na te streven, zelfs als het comfort, reputatie of erkenning kost?",
    },
    helpText: {
      en: "A vision that requires no sacrifice usually has no power. The cross-cultural context adds its own costs — cultural displacement, loneliness, the slow grind of building across difference. Willingness to pay these is a sign that the vision has roots.",
      id: "Sebuah visi yang tidak memerlukan pengorbanan biasanya tidak memiliki kekuatan. Konteks lintas budaya menambahkan biayanya sendiri — perpindahan budaya, kesepian, usaha lambat membangun di tengah perbedaan. Kesediaan untuk membayar ini adalah tanda bahwa visi memiliki akar.",
      nl: "Een visie die geen opoffering vereist, heeft gewoonlijk geen kracht. De interculturele context voegt zijn eigen kosten toe — culturele ontworteling, eenzaamheid, de trage moeite van bouwen over verschil heen. Bereidheid om dit te betalen is een teken dat de visie wortels heeft.",
    },
  },
  {
    id: "fruit",
    title: {
      en: "Fruit",
      id: "Buah",
      nl: "Vrucht",
    },
    question: {
      en: "Is early pursuit of this vision producing love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control? Or the opposite?",
      id: "Apakah mengejar visi ini secara awal menghasilkan kasih, sukacita, damai, kesabaran, kemurahan, kebaikan, kesetiaan, kelembutan, dan penguasaan diri? Atau sebaliknya?",
      nl: "Levert het vroeg nastreven van deze visie liefde, vreugde, vrede, geduld, vriendelijkheid, goedheid, trouw, zachtmoedigheid en zelfbeheersing op? Of het tegendeel?",
    },
    helpText: {
      en: "The fruit reveals the source. A vision that breeds pride, control, and exhaustion in the leader is worth examining. A vision that produces patience and joy even in difficulty is worth holding.",
      id: "Buah mengungkapkan sumbernya. Sebuah visi yang menumbuhkan kebanggaan, kontrol, dan kelelahan dalam diri pemimpin layak untuk diperiksa. Sebuah visi yang menghasilkan kesabaran dan sukacita bahkan dalam kesulitan layak untuk dipegang.",
      nl: "De vrucht onthult de bron. Een visie die trots, controle en uitputting bij de leider kweekt, is het waard om te onderzoeken. Een visie die geduld en vreugde voortbrengt, zelfs in moeilijkheid, is het waard om vast te houden.",
    },
  },
];

export const auditResultTemplate: {
  strongSigns: Lang;
  areasToWatch: Lang;
  allClear: Lang;
} = {
  strongSigns: {
    en: "Strong signs across {tests}. These are worth holding — continue testing over time.",
    id: "Tanda-tanda kuat di {tests}. Ini layak untuk dipegang — terus uji seiring waktu.",
    nl: "Sterke tekenen bij {tests}. Dit is het waard om vast te houden — blijf het in de loop van de tijd testen.",
  },
  areasToWatch: {
    en: "Worth sitting with {tests}. These are not reasons to abandon the vision — but they are invitations to keep listening before moving forward.",
    id: "Perlu dipikirkan lebih lanjut: {tests}. Ini bukan alasan untuk meninggalkan visi — tetapi ini adalah undangan untuk terus mendengarkan sebelum melangkah maju.",
    nl: "De moeite waard om bij stil te staan: {tests}. Dit zijn geen redenen om de visie op te geven — maar het zijn uitnodigingen om te blijven luisteren voordat je verdergaat.",
  },
  allClear: {
    en: "All five tests point in the same direction. That is rare — and significant. Keep moving.",
    id: "Kelima pengujian menunjuk ke arah yang sama. Itu jarang — dan signifikan. Terus maju.",
    nl: "Alle vijf testen wijzen in dezelfde richting. Dat is zeldzaam — en veelbetekenend. Blijf doorgaan.",
  },
};

// ---------------------------------------------------------------------------
// FACILITATION TOOLS
// ---------------------------------------------------------------------------

export const facilitationToolsIntro: Lang = {
  en: "These tools are designed for team use. Each one addresses a different moment in the vision-discernment process — from surfacing what individuals see, to practising the kind of silence that vision requires.",
  id: "Alat-alat ini dirancang untuk digunakan oleh tim. Masing-masing menangani momen yang berbeda dalam proses penegasan visi — dari mengungkap apa yang dilihat individu, hingga mempraktikkan keheningan yang visi perlukan.",
  nl: "Deze tools zijn ontworpen voor teamgebruik. Elk behandelt een ander moment in het visie-onderscheidingsproces — van het naar boven halen van wat individuen zien tot het oefenen van de soort stilte die visie vereist.",
};

export const facilitationTools: Array<{
  id: string;
  number: number;
  title: Lang;
  purpose: Lang;
  duration: Lang;
  instructions: Lang;
}> = [
  {
    id: "listening-round",
    number: 1,
    title: {
      en: "The Listening Round",
      id: "Putaran Mendengarkan",
      nl: "De Luisterronde",
    },
    purpose: {
      en: "Surface what each team member sees before the leader speaks.",
      id: "Mengungkap apa yang dilihat setiap anggota tim sebelum pemimpin berbicara.",
      nl: "Naar boven halen wat elk teamlid ziet voordat de leider spreekt.",
    },
    duration: {
      en: "One 60-minute conversation per team member, spread over a season.",
      id: "Satu percakapan 60 menit per anggota tim, tersebar dalam satu musim.",
      nl: "Één gesprek van 60 minuten per teamlid, verspreid over een seizoen.",
    },
    instructions: {
      en: "Ask each team member: \"What do you see when you imagine our team three years from now? What stirs your heart about this work? What is one thing you think God might be calling us toward that we haven't named yet?\" Take notes. Do not respond beyond curiosity. Do this with every team member before any team-wide vision conversation.",
      id: "Tanyakan setiap anggota tim: \"Apa yang Anda lihat ketika Anda membayangkan tim kita tiga tahun dari sekarang? Apa yang menggerakkan hati Anda tentang pekerjaan ini? Apa satu hal yang Anda pikir Allah mungkin memanggil kita ke arahnya yang belum kita sebutkan?\" Ambil catatan. Jangan merespons melebihi rasa ingin tahu. Lakukan ini dengan setiap anggota tim sebelum percakapan visi seluruh tim.",
      nl: "Vraag elk teamlid: \"Wat zie jij als je ons team over drie jaar voor je ziet? Wat raakt jouw hart bij dit werk? Wat is één ding waarvan je denkt dat God ons er misschien naartoe roept dat we nog niet hebben benoemd?\" Maak aantekeningen. Reageer niet verder dan nieuwsgierigheid. Doe dit met elk teamlid vóór elk teambreed visiogesprek.",
    },
  },
  {
    id: "four-channels-conversation",
    number: 2,
    title: {
      en: "The Four Channels Conversation",
      id: "Percakapan Empat Saluran",
      nl: "Het Vier-Kanalengesprek",
    },
    purpose: {
      en: "Make the four sources of vision explicit with the team.",
      id: "Membuat empat sumber visi menjadi eksplisit bersama tim.",
      nl: "De vier bronnen van visie expliciet maken met het team.",
    },
    duration: {
      en: "90-minute team meeting.",
      id: "Rapat tim 90 menit.",
      nl: "Teamvergadering van 90 minuten.",
    },
    instructions: {
      en: "Open with the Vision Compass. Walk the team through each direction — South (Passion), East (Dreams), North (Revelation), West (Others). Ask each member: \"Which channel speaks loudest to you? Through which channel does God most often give you vision?\" Let the conversation surface the team's different gifts of perception.",
      id: "Buka dengan Kompas Visi. Pandu tim melalui setiap arah — Selatan (Gairah), Timur (Mimpi), Utara (Wahyu), Barat (Sesama). Tanyakan setiap anggota: \"Saluran mana yang paling keras berbicara kepada Anda? Melalui saluran mana Allah paling sering memberikan Anda visi?\" Biarkan percakapan mengungkap karunia persepsi yang berbeda dari tim.",
      nl: "Open met het Visie Kompas. Begeleid het team door elke richting — Zuid (Passie), Oost (Dromen), Noord (Openbaring), West (Anderen). Vraag elk lid: \"Welk kanaal spreekt het hardst tot jou? Via welk kanaal geeft God jou het meest visie?\" Laat het gesprek de verschillende perceptiegaven van het team naar boven halen.",
    },
  },
  {
    id: "acts-13-pause",
    number: 3,
    title: {
      en: "The Acts 13 Pause",
      id: "Jeda Kisah 13",
      nl: "De Handelingen 13 Pauze",
    },
    purpose: {
      en: "Build silence and prayer into vision discernment.",
      id: "Membangun keheningan dan doa ke dalam penegasan visi.",
      nl: "Stilte en gebed inbouwen in visie-onderscheiding.",
    },
    duration: {
      en: "Half-day team retreat.",
      id: "Retret tim setengah hari.",
      nl: "Halve dag teamretraite.",
    },
    instructions: {
      en: "Borrow the Acts 13 pattern. Gather to worship and pray together — without strategy talk for the first half. Only after substantial silence does the team share what each person sensed. The vision that emerges from this kind of discernment carries weight that strategy meetings cannot produce.",
      id: "Pinjam pola Kisah 13. Berkumpul untuk beribadah dan berdoa bersama — tanpa pembicaraan strategi selama paruh pertama. Hanya setelah keheningan yang cukup baru tim berbagi apa yang dirasakan masing-masing orang. Visi yang muncul dari penegasan semacam ini membawa bobot yang tidak dapat dihasilkan oleh rapat strategi.",
      nl: "Leen het patroon van Handelingen 13. Kom samen om te aanbidden en te bidden — zonder strategiegesprek in de eerste helft. Pas na aanzienlijke stilte deelt het team wat ieder persoon heeft gevoeld. De visie die uit dit soort onderscheiding naar voren komt, draagt gewicht dat strategievergaderingen niet kunnen produceren.",
    },
  },
  {
    id: "vision-story",
    number: 4,
    title: {
      en: "The Vision Story",
      id: "Kisah Visi",
      nl: "Het Visioen Verhaal",
    },
    purpose: {
      en: "Move from bullet-point vision to story-told vision.",
      id: "Bergerak dari visi poin-poin ke visi yang diceritakan sebagai kisah.",
      nl: "Bewegen van bullet-point visie naar als verhaal vertelde visie.",
    },
    duration: {
      en: "45 minutes alone, then 30 minutes with the team.",
      id: "45 menit sendiri, kemudian 30 menit bersama tim.",
      nl: "45 minuten alleen, dan 30 minuten met het team.",
    },
    instructions: {
      en: "Write the vision as a story, not a list. \"Imagine our team in three years. It is Tuesday morning. What do we see? Who is there? What are they doing? What stories are they telling each other?\" Read the story to the team. Listen for what they add, correct, or ask about. Try opening with: \"Imagine the day when...\" and then paint a specific picture. Vision spoken as story sticks where bullet points evaporate.",
      id: "Tuliskan visi sebagai sebuah kisah, bukan daftar. \"Bayangkan tim kita dalam tiga tahun. Ini adalah Selasa pagi. Apa yang kita lihat? Siapa yang ada di sana? Apa yang mereka lakukan? Kisah apa yang mereka ceritakan satu sama lain?\" Bacakan kisah itu kepada tim. Dengarkan apa yang mereka tambahkan, koreksi, atau tanyakan. Coba buka dengan: \"Bayangkan hari ketika...\" lalu gambarkan gambaran yang spesifik. Visi yang diucapkan sebagai kisah melekat di mana poin-poin menguap.",
      nl: "Schrijf de visie als een verhaal, niet als een lijst. \"Stel je ons team voor over drie jaar. Het is dinsdagochtend. Wat zien we? Wie is er? Wat doen ze? Welke verhalen vertellen ze elkaar?\" Lees het verhaal aan het team voor. Luister naar wat zij toevoegen, corrigeren of over vragen. Probeer te beginnen met: \"Stel je de dag voor wanneer...\" en schilder dan een specifiek beeld. Visie gesproken als verhaal blijft hangen waar bullet points verdampen.",
    },
  },
  {
    id: "repeat-calendar",
    number: 5,
    title: {
      en: "The Repeat Calendar",
      id: "Kalender Pengulangan",
      nl: "De Herhalingskalender",
    },
    purpose: {
      en: "Force the leader to communicate the vision seven to ten times.",
      id: "Memaksa pemimpin untuk mengkomunikasikan visi tujuh hingga sepuluh kali.",
      nl: "De leider dwingen de visie zeven tot tien keer te communiceren.",
    },
    duration: {
      en: "Ongoing.",
      id: "Berkelanjutan.",
      nl: "Doorlopend.",
    },
    instructions: {
      en: "Mark vision-casting moments on the calendar — once a month at minimum, woven into team meetings, one-on-ones, written communication, and team retreats. Track each one. Research suggests leaders need to communicate vision seven to ten times before it begins to settle. The leader who feels they have over-communicated is usually communicating it for the first time at the level the team needs.",
      id: "Tandai momen-momen penebaran visi di kalender — minimal sekali sebulan, dijalin ke dalam rapat tim, pertemuan satu lawan satu, komunikasi tertulis, dan retret tim. Lacak masing-masing. Penelitian menunjukkan pemimpin perlu mengkomunikasikan visi tujuh hingga sepuluh kali sebelum mulai menetap. Pemimpin yang merasa telah terlalu banyak berkomunikasi biasanya baru mengkomunikasikannya untuk pertama kali di tingkat yang dibutuhkan tim.",
      nl: "Markeer visie-uitdragmomenten in de kalender — minstens één keer per maand, verweven in teamvergaderingen, één-op-ééngesprekken, schriftelijke communicatie en teamretraites. Registreer ze allemaal. Onderzoek suggereert dat leiders een visie zeven tot tien keer moeten communiceren voordat die begint te landen. De leider die het gevoel heeft te veel gecommuniceerd te hebben, communiceert het meestal voor de eerste keer op het niveau dat het team nodig heeft.",
    },
  },
];

// ---------------------------------------------------------------------------
// RESOURCE CARDS
// ---------------------------------------------------------------------------

export const resourceCards: Array<{
  type: "book" | "video" | "module";
  title: string;
  meta: string;
  description: string;
  href: string;
}> = [
  {
    type: "book",
    title: "Visioneering",
    meta: "Andy Stanley · 1999, revised 2014",
    description:
      "Built around the story of Nehemiah. Stanley's 20-point building blocks framework traces how God-given vision moves from a concern in one person's heart to a project that reshapes a community. The primary anchor for this module.",
    href: "https://www.amazon.com/Visioneering-Discovering-Maintaining-Personal-Vision/dp/159052456X/ref=sr_1_2?dib=eyJ2IjoiMSJ9._zK7bMTYhObZQuxDv3CfZqumvf3SxEpib3zPAJzTFWKMv76OmC9qGdLea4lN-2fDqiDMiL-qvj2e-NmmGXu7hze5WNL8l19HtGDwNdzcDPaA57_vN0rwa1IL9MRxKm59QOpAGeab44DT44zsmFci0YYq6hxGL4-GYrTXfaF3AZsGejtl7rx011WAwS5C_f9ZFTHcDOyJb7BoJcIsxeH4ZHhI506OxtGC16Tolz_gJRc._99mNf46DQxHdo_Y6Zze6bVmhQf0ABsJu2-spvxizFs&dib_tag=se&keywords=visioneering&qid=1777518683&sr=8-2",
  },
  {
    type: "book",
    title: "Courageous Leadership",
    meta: "Bill Hybels · 2002, updated 2009",
    description:
      "A classic on vision casting in the church context. Hybels is especially strong on the discipline of repeating vision and the difference between casting vision and announcing strategy.",
    href: "https://www.amazon.com/Courageous-Leadership-Field-Tested-Strategy-Leader/dp/0310495954/ref=sr_1_1?crid=1MB4ZG285HDBK&dib=eyJ2IjoiMSJ9.ZkFk4mUvlZcikFw_c0kX25WMHL6by1t6paCZPLywSLTYb4McfNS58soAX-H0xfaD_TY5NB9KHrou5-0mP6R_r7zTlYASg9iVs20zeQNnnJv7-Q9hOSUX0kpHxI1uCTy0dWAa01DDa_mbsmf7FsCYCJ_jQGD2pPrx2c7WCRxdr5dAdyK4JLvoSwJlkjJt_VQpPFE7fpdapW-gSLksnud5fY4xVMP2nWj70L86wtmieTs.e7qZPHnZfTs6hec5nbtBPPQyxUrQrGErJWKT8_AIgUw&dib_tag=se&keywords=courageous+leadership&qid=1777518762&s=books&sprefix=courageous+leadership%2Cstripbooks-intl-ship%2C311&sr=1-1",
  },
  {
    type: "book",
    title: "God Dreams",
    meta: "Will Mancini & Warren Bird · 2016",
    description:
      "Twelve recurring patterns in how God-given vision shapes itself in different ministry contexts. Useful for teams that need language to articulate what they are already sensing.",
    href: "https://www.amazon.com/God-Dreams-Templates-Finding-Focusing/dp/B0DHPHJ1QZ/ref=sr_1_2?crid=3PJU25VO325GY&dib=eyJ2IjoiMSJ9.vypjJhwoy8FZWxHkZhDJwb7i1JXMPLPMQdbReExbB5TbemOOEpQDdjfEoBCDLu-_KzLMZl7klM57vkhJND-hnqgKPgobDMhaNS7M7PZqHYBDmFyAhUlfldM4RiOb-Vfmzhs8yTI223fGCV6yko8SwT3oKfVzw0d9MRO0mXAy_-iPiBmtz9kWZvzVauIbxTHftiPeccQqSsmo3p1fM6Bv9hmb__dnX_LpBAnKUQawlFc.EWvy8KTvPvms50MoEFuhsuXzjcbbbkVcgeTynHxrrKg&dib_tag=se&keywords=god+dreams&qid=1777518841&s=books&sprefix=god+dream%2Cstripbooks-intl-ship%2C328&sr=1-2",
  },
  {
    type: "video",
    title: "Andy Stanley — Visioneering",
    meta: "Andy Stanley",
    description:
      "Stanley's own teaching on the Visioneering framework. Worth watching as a companion to the book — he tells the Nehemiah story in a way that is hard to forget.",
    href: "https://www.youtube.com/watch?v=eK_pMaDqy64",
  },
  {
    type: "video",
    title: "Pellegrino Riccardi — Cross-Cultural Communication",
    meta: "TEDxBergen",
    description:
      "Used across Crispy Leaders modules. Riccardi explores the cultural assumptions that shape how we lead and listen — directly relevant to the Others channel of the Vision Compass.",
    href: "#",
  },
  {
    type: "module",
    title: "Influential Leadership Framework",
    meta: "Crispy Leaders",
    description:
      "How to mobilise people once the vision is clear. The natural next step after you have discerned what God is calling you toward.",
    href: "/resources/influential-leadership-framework",
  },
  {
    type: "module",
    title: "Storytelling for Leaders",
    meta: "Crispy Leaders",
    description:
      "The craft of vision spoken as story. How to move from bullet-point vision statements to narrative that sticks.",
    href: "/resources/storytelling-leadership",
  },
  {
    type: "module",
    title: "Servant Leadership",
    meta: "Crispy Leaders",
    description:
      "The heart posture that protects a leader's vision from becoming personal ambition. A necessary companion to vision casting.",
    href: "/resources/servant-leadership",
  },
];

// ---------------------------------------------------------------------------
// CALL TO ACTION
// ---------------------------------------------------------------------------

export const cta: {
  heading: Lang;
  body: Lang;
  buttonLabel: Lang;
} = {
  heading: {
    en: "Try the Listening Round this quarter.",
    id: "Coba Putaran Mendengarkan kuartal ini.",
    nl: "Probeer de Luisterronde dit kwartaal.",
  },
  body: {
    en: "Before you speak the vision again, hear what your team is already seeing. Run individual conversations with each member. Ask what stirs them. Take notes. Say nothing except \"tell me more.\" The vision that emerges will be larger than the one you started with.",
    id: "Sebelum Anda berbicara visi lagi, dengarkan apa yang sudah dilihat tim Anda. Lakukan percakapan individual dengan setiap anggota. Tanyakan apa yang menggerakkan mereka. Ambil catatan. Jangan katakan apa pun kecuali \"ceritakan lebih banyak.\" Visi yang muncul akan lebih besar dari yang Anda mulai.",
    nl: "Voordat je de visie opnieuw uitspreekt, hoor wat je team al ziet. Voer individuele gesprekken met elk lid. Vraag wat hen beweegt. Maak aantekeningen. Zeg niets anders dan \"vertel meer.\" De visie die naar voren komt, zal groter zijn dan de visie waarmee je begon.",
  },
  buttonLabel: {
    en: "← Content Library",
    id: "← Perpustakaan Konten",
    nl: "← Contentbibliotheek",
  },
};

// ---------------------------------------------------------------------------
// UI STRINGS
// ---------------------------------------------------------------------------

export const ui: {
  sectionTitles: Record<string, Lang>;
  buttons: Record<string, Lang>;
  labels: Record<string, Lang>;
} = {
  sectionTitles: {
    visionCompass: {
      en: "The Vision Compass",
      id: "Kompas Visi",
      nl: "Het Visie Kompas",
    },
    fiveTests: {
      en: "Five Tests for Vision",
      id: "Lima Pengujian Visi",
      nl: "Vijf Tests voor Visie",
    },
    facilitationTools: {
      en: "Facilitation Tools",
      id: "Alat Fasilitasi",
      nl: "Facilitatietools",
    },
    resources: {
      en: "Go Deeper",
      id: "Pelajari Lebih Dalam",
      nl: "Ga Dieper",
    },
  },
  buttons: {
    saveToDashboard: {
      en: "Save to Dashboard",
      id: "Simpan ke Dashboard",
      nl: "Opslaan in Dashboard",
    },
    savedToDashboard: {
      en: "✓ Saved to Dashboard",
      id: "✓ Tersimpan di Dashboard",
      nl: "✓ Opgeslagen in Dashboard",
    },
    startAudit: {
      en: "Run the Discernment Audit",
      id: "Jalankan Audit Penegasan",
      nl: "Voer de Onderscheidingsaudit uit",
    },
    viewAllResources: {
      en: "← Content Library",
      id: "← Perpustakaan Konten",
      nl: "← Contentbibliotheek",
    },
  },
  labels: {
    direction: {
      en: "Direction",
      id: "Arah",
      nl: "Richting",
    },
    biblicalAnchor: {
      en: "Biblical Anchor",
      id: "Jangkar Alkitab",
      nl: "Bijbels Anker",
    },
    diagnosticQuestion: {
      en: "Diagnostic Question",
      id: "Pertanyaan Diagnostik",
      nl: "Diagnostische Vraag",
    },
    firstStep: {
      en: "First Step",
      id: "Langkah Pertama",
      nl: "Eerste Stap",
    },
    purpose: {
      en: "Purpose",
      id: "Tujuan",
      nl: "Doel",
    },
    duration: {
      en: "Duration",
      id: "Durasi",
      nl: "Duur",
    },
    howItWorks: {
      en: "How it works",
      id: "Cara kerjanya",
      nl: "Hoe het werkt",
    },
    yes: {
      en: "Yes",
      id: "Ya",
      nl: "Ja",
    },
    unsure: {
      en: "Unsure",
      id: "Tidak Yakin",
      nl: "Niet zeker",
    },
    no: {
      en: "No",
      id: "Tidak",
      nl: "Nee",
    },
    yourResults: {
      en: "Your results",
      id: "Hasil Anda",
      nl: "Uw resultaten",
    },
    leadershipGuide: {
      en: "Leadership · Guide",
      id: "Kepemimpinan · Panduan",
      nl: "Leiderschap · Gids",
    },
    book: {
      en: "Book",
      id: "Buku",
      nl: "Boek",
    },
    video: {
      en: "Video",
      id: "Video",
      nl: "Video",
    },
    module: {
      en: "Module",
      id: "Modul",
      nl: "Module",
    },
  },
};
