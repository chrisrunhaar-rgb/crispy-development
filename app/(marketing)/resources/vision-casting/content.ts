// Vision Casting — content.ts
// All text content for the rebuilt Vision Casting module.
// Two languages: en (English), id (Indonesian). Dutch dropped 2026-05-18.
// Imported by VisionCastingClient.tsx (THEO's build).
// CLEO — last updated 2026-04-30

export type Lang = { en: string; id: string };
export type ChannelId = "passion" | "dreams" | "revelation" | "others";

// ---------------------------------------------------------------------------
// PAGE HERO
// ---------------------------------------------------------------------------

export const pageHero = {
  tag: {
    en: "Leadership · Guide",
    id: "Kepemimpinan · Panduan",
  },
  title: {
    en: "Vision Casting",
    id: "Menebar Visi",
  },
  scripture: {
    en: '"Where there is no revelation, people cast off restraint."',
    id: '"Bila tidak ada wahyu ilahi, bangsa itu menjadi liar."',
  },
  scriptureRef: {
    en: "Proverbs 29:18",
    id: "Amsal 29:18",
  },
  caption: {
    en: "Most leaders only listen in one direction. Understanding all four directions of the Vision Compass.",
    id: "Kebanyakan pemimpin hanya mendengar dari satu arah. Mengenal semua empat arah Kompas Visi.",
  },
  intro1: {
    en: "Vision in Scripture is almost always the opposite of what we expect. It is something God reveals to us — often slowly, often through more than one channel, and almost always larger than the leader who first glimpses it. Andy Stanley¹ puts it this way: vision is \"a clear mental picture of what could be, fuelled by the conviction that it should be\" (Visioneering¹, 1999). Without that conviction — the moral weight that comes from God — vision is just a goal.",
    id: "Visi dalam Kitab Suci hampir selalu berlawanan dengan apa yang kita bayangkan. Ini adalah sesuatu yang Allah nyatakan kepada kita — sering kali perlahan, sering kali melalui lebih dari satu saluran, dan hampir selalu lebih besar dari pemimpin yang pertama kali melihatnya. Andy Stanley¹ mendefinisikannya seperti ini: visi adalah \"gambaran mental yang jelas tentang apa yang bisa ada, didorong oleh keyakinan bahwa itu seharusnya ada\" (Visioneering¹, 1999). Tanpa keyakinan itu — bobot moral yang datang dari Allah — visi hanyalah sebuah tujuan.",
  },
  intro2: {
    en: "For a cross-cultural Christian leader, vision sits inside the Great Commission — Jesus' ongoing call to make disciples of every nation. Your team's specific vision is a small piece of God's larger vision for the world. Knowing this is the difference between leading a project and stewarding a calling.",
    id: "Bagi seorang pemimpin Kristen lintas budaya, visi berada di dalam Amanat Agung — panggilan Yesus yang terus-menerus untuk menjadikan semua bangsa murid-Nya. Visi spesifik tim Anda adalah bagian kecil dari visi Allah yang lebih besar untuk dunia. Menyadari ini adalah perbedaan antara memimpin sebuah proyek dan menjaga sebuah panggilan.",
  },
} as const;

// ---------------------------------------------------------------------------
// THE VISION COMPASS — four channels
// ---------------------------------------------------------------------------

export const compassIntro: Lang = {
  en: "Vision rarely comes from one direction. The Vision Compass maps four channels through which God speaks — each one different, each one needed. Most leaders only use one or two. The strongest team vision draws from all four.",
  id: "Visi jarang datang dari satu arah. Kompas Visi memetakan empat saluran di mana Allah berbicara — masing-masing berbeda, masing-masing diperlukan. Kebanyakan pemimpin hanya menggunakan satu atau dua. Visi tim yang paling kuat menggali dari keempat-empatnya.",
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
    },
    tagline: {
      en: "What cannot be ignored",
      id: "Apa yang tidak bisa diabaikan",
    },
    body: {
      en: "Andy Stanley¹ names this in Visioneering¹. His first building block: \"A vision begins as a concern.\" Vision in Scripture rarely begins with strategy — it begins with grief, longing, or unease that will not let the leader go. Passion is not the same as preference. A preference is what you enjoy; a passion is what you cannot put down.",
      id: "Andy Stanley¹ menyebutkan ini dalam Visioneering¹. Bata bangunan pertamanya: \"Sebuah visi dimulai sebagai kekhawatiran.\" Visi dalam Kitab Suci jarang dimulai dengan strategi — itu dimulai dengan kesedihan, kerinduan, atau kegelisahan yang tidak akan melepaskan sang pemimpin. Gairah tidak sama dengan preferensi. Preferensi adalah apa yang Anda nikmati; gairah adalah apa yang tidak bisa Anda tinggalkan.",
    },
    biblicalAnchorTitle: {
      en: "Nehemiah — grief that became a mission",
      id: "Nehemia — kesedihan yang menjadi misi",
    },
    biblicalFigure: {
      en: "When Nehemiah heard that the wall of Jerusalem was broken down and the gates burned, he sat down and wept and mourned for days, fasted and prayed. He did not yet have a plan. He did not yet have permission. He did not yet have a team. He had a concern that would not leave him. From that concern came one of the most carefully executed leadership projects in Scripture. Andy Stanley¹ builds Visioneering¹ around this story for a reason. The passion you cannot put down is often the first move of God's vision in you.",
      id: "Ketika Nehemia mendengar bahwa tembok Yerusalem telah runtuh dan pintu-pintunya terbakar, ia duduk, menangis, dan berkabung selama beberapa hari, berpuasa dan berdoa. Ia belum memiliki rencana. Ia belum mendapat izin. Ia belum memiliki tim. Ia memiliki kekhawatiran yang tidak mau pergi. Dari kekhawatiran itu lahirlah salah satu proyek kepemimpinan yang paling hati-hati dilaksanakan dalam Kitab Suci. Andy Stanley¹ membangun Visioneering¹ di sekitar kisah ini karena alasan yang baik. Gairah yang tidak bisa Anda tinggalkan sering kali merupakan langkah pertama visi Allah dalam diri Anda.",
    },
    diagnosticQuestion: {
      en: "What concern have you been carrying for more than a year that you cannot put down?",
      id: "Kekhawatiran apa yang sudah Anda tanggung lebih dari setahun yang tidak bisa Anda tinggalkan?",
    },
    firstStepPractice: {
      en: "Write down the one issue, situation, or need that consistently breaks your heart or stirs you most. Bring it to prayer for the next four weeks. Notice whether it grows or fades.",
      id: "Tuliskan satu masalah, situasi, atau kebutuhan yang secara konsisten mematahkan hati Anda atau paling menggerakkan Anda. Bawa dalam doa selama empat minggu ke depan. Perhatikan apakah itu tumbuh atau memudar.",
    },
  },
  {
    id: "dreams",
    direction: "E",
    colorAccent: "oklch(50% 0.18 295)",
    label: {
      en: "Dreams",
      id: "Mimpi",
    },
    tagline: {
      en: "What stirs the imagination",
      id: "Apa yang menggerakkan imajinasi",
    },
    body: {
      en: "Throughout Scripture God speaks through dreams. Joseph the patriarch dreams of grain bowing to grain (Genesis 37). Daniel interprets Nebuchadnezzar's dream (Daniel 2). These are literal dreams, but also longings — the future-imagination that stirs in our minds, often when we are quiet enough to hear it. Many leaders dismiss these as fantasy. Scripture treats them as data. This channel shows how vision arrives. Whether it is from God is what the five tests below are for.",
      id: "Sepanjang Kitab Suci, Allah berbicara melalui mimpi. Yusuf sang patriark bermimpi tentang berkas gandum yang membungkuk pada berkasnya (Kejadian 37). Daniel menafsirkan mimpi Nebukadnezar (Daniel 2). Ini adalah mimpi harfiah, tetapi juga kerinduan — imajinasi masa depan yang bergerak dalam pikiran kita, sering kali ketika kita cukup tenang untuk mendengarnya. Banyak pemimpin menganggapnya sebagai fantasi. Kitab Suci memperlakukannya sebagai data. Saluran ini menunjukkan bagaimana visi datang. Apakah itu dari Allah adalah tujuan dari lima pengujian di bawah ini.",
    },
    biblicalAnchorTitle: {
      en: "Joseph — the longing that cost everything",
      id: "Yusuf — kerinduan yang mengorbangkan segalanya",
    },
    biblicalFigure: {
      en: "Joseph dreamed of grain sheaves bowing to his sheaf, and stars and moon bowing to him. His brothers hated him for it. The dreams cost him almost everything — sold into slavery, falsely accused, imprisoned for years. But the dreams were from God, and they came true in ways Joseph could not have imagined. Cross-cultural leaders learn from him: the longing that stirs in your imagination is not always foolish. Hold it. Test it. Wait on it. God has used dreams since Genesis.",
      id: "Yusuf bermimpi tentang berkas-berkas gandum yang membungkuk pada berkasnya, dan bintang-bintang serta bulan membungkuk padanya. Saudara-saudaranya membencinya karena itu. Mimpi-mimpi itu hampir mengambil segalanya darinya — dijual sebagai budak, dituduh palsu, dipenjara selama bertahun-tahun. Tetapi mimpi-mimpi itu dari Allah, dan menjadi kenyataan dengan cara yang tidak bisa dibayangkan Yusuf. Para pemimpin lintas budaya belajar darinya: kerinduan yang bergerak dalam imajinasi Anda tidak selalu bodoh. Pegang itu. Uji itu. Tunggu itu. Allah telah menggunakan mimpi sejak Kejadian.",
    },
    diagnosticQuestion: {
      en: "What picture of the future keeps returning to you when you are quiet enough to hear it?",
      id: "Gambaran masa depan apa yang terus kembali kepada Anda ketika Anda cukup tenang untuk mendengarnya?",
    },
    firstStepPractice: {
      en: "Keep a notebook by your bed for one month. Write down what stirs in you on waking. Bring the notebook to prayer once a week. Notice what patterns emerge.",
      id: "Simpan buku catatan di samping tempat tidur Anda selama satu bulan. Tuliskan apa yang menggerakkan Anda saat bangun. Bawa buku catatan itu dalam doa sekali seminggu. Perhatikan pola apa yang muncul.",
    },
  },
  {
    id: "revelation",
    direction: "N",
    colorAccent: "oklch(22% 0.10 260)",
    label: {
      en: "Revelation",
      id: "Wahyu",
    },
    tagline: {
      en: "What God speaks directly",
      id: "Apa yang Allah ucapkan langsung",
    },
    body: {
      en: "Sometimes God speaks more directly. Paul receives a vision of a man from Macedonia begging him to come (Acts 16:9), and the gospel crosses into Europe. Peter receives the vision of the sheet that opens the gospel to the Gentiles (Acts 10). These moments are rarer, but they are real. A leader who has not made room for them will miss them when they come. Revelation is not the same as a feeling that confirms what you already wanted to do. Real revelation usually surprises the leader, often disrupts plans, and almost always carries the weight of conviction that this is from God. This channel describes how vision arrives. The five tests below are the tool for testing that conviction.",
      id: "Terkadang Allah berbicara lebih langsung. Paulus menerima penglihatan tentang seorang laki-laki dari Makedonia yang memohonnya untuk datang (Kisah 16:9), dan Injil menyeberang ke Eropa. Petrus menerima penglihatan tentang kain besar yang membuka Injil bagi orang bukan Yahudi (Kisah 10). Saat-saat ini lebih jarang, tetapi nyata. Seorang pemimpin yang tidak menyediakan ruang bagi mereka akan melewatkan mereka ketika datang. Wahyu tidak sama dengan perasaan yang mengkonfirmasi apa yang sudah ingin Anda lakukan. Wahyu sejati biasanya mengejutkan pemimpin, sering kali mengganggu rencana, dan hampir selalu membawa bobot keyakinan bahwa ini dari Allah. Saluran ini menggambarkan bagaimana visi datang. Lima pengujian di bawah ini adalah alat untuk menguji keyakinan itu.",
    },
    biblicalAnchorTitle: {
      en: "Paul — a vision that redirected a continent",
      id: "Paulus — penglihatan yang mengubah arah sebuah benua",
    },
    biblicalFigure: {
      en: "Acts 16 records that during the night Paul had a vision of a man of Macedonia standing and begging him, \"Come over to Macedonia and help us.\" Paul was already mid-mission, planning to go elsewhere, when the vision redirected him entirely. The next sentence: \"We got ready at once.\" Paul did not delay. Real revelation usually surprises the leader, often disrupts plans, and almost always carries the weight of conviction. The European church is rooted in a vision Paul received in his sleep.",
      id: "Kisah 16 mencatat bahwa pada malam hari Paulus mendapat penglihatan seorang laki-laki Makedonia berdiri dan memohonnya, \"Menyeberanglah ke Makedonia dan tolonglah kami.\" Paulus sudah berada di tengah misi, merencanakan untuk pergi ke tempat lain, ketika penglihatan itu sepenuhnya mengubah arahnya. Kalimat berikutnya: \"Segera kami berusaha berangkat ke Makedonia.\" Paulus tidak menunda. Wahyu sejati biasanya mengejutkan pemimpin, sering kali mengganggu rencana, dan hampir selalu membawa bobot keyakinan. Gereja di Eropa berakar pada penglihatan yang Paulus terima saat tidur.",
    },
    diagnosticQuestion: {
      en: "When did you last make unhurried space for God to speak — not to confirm what you were already planning, but to surprise you?",
      id: "Kapan terakhir kali Anda membuat ruang yang tidak terburu-buru bagi Allah untuk berbicara — bukan untuk mengkonfirmasi apa yang sudah Anda rencanakan, tetapi untuk mengejutkan Anda?",
    },
    firstStepPractice: {
      en: "Set aside one hour this week with no agenda. No Bible reading plan, no prayer list. Just silence and the question: \"Lord, is there anything you want to show me?\" Write down whatever comes.",
      id: "Sisihkan satu jam minggu ini tanpa agenda. Tidak ada rencana membaca Alkitab, tidak ada daftar doa. Hanya keheningan dan pertanyaan: \"Tuhan, adakah sesuatu yang ingin Engkau tunjukkan kepadaku?\" Tuliskan apa pun yang datang.",
    },
  },
  {
    id: "others",
    direction: "W",
    colorAccent: "oklch(38% 0.12 155)",
    label: {
      en: "Others",
      id: "Sesama",
    },
    tagline: {
      en: "What God reveals through community",
      id: "Apa yang Allah nyatakan melalui komunitas",
    },
    body: {
      en: "This is the most underestimated channel. God almost never gives one leader the whole vision. Each member of the team sees a part — and the leader who only listens to their own passion, their own dreams, and their own revelation will carry an incomplete picture. The cross-cultural Christian team is especially well-positioned for this channel. Diversity of culture means diversity of vantage point. The Javanese team member, the Australian team member, the Filipino team member each see the same calling differently. The full picture emerges only when all four channels speak together.",
      id: "Ini adalah saluran yang paling diremehkan. Allah hampir tidak pernah memberikan seluruh visi kepada satu pemimpin. Setiap anggota tim melihat satu bagiannya — dan pemimpin yang hanya mendengarkan gairahnya sendiri, mimpinya sendiri, dan wahyunya sendiri akan membawa gambaran yang tidak lengkap. Tim Kristen lintas budaya sangat baik posisinya untuk saluran ini. Keragaman budaya berarti keragaman sudut pandang. Anggota tim dari Jawa, dari Australia, dari Filipina — masing-masing melihat panggilan yang sama secara berbeda. Gambaran penuh hanya muncul ketika keempat saluran berbicara bersama.",
    },
    biblicalAnchorTitle: {
      en: "Antioch — vision born in community",
      id: "Antiokhia — visi yang lahir dalam komunitas",
    },
    biblicalFigure: {
      en: "While the church at Antioch was worshipping the Lord and fasting, the Holy Spirit said, \"Set apart for me Barnabas and Saul for the work to which I have called them.\" The call came to the community, not to Barnabas or Saul alone. The whole church laid hands on them and sent them off. The first cross-cultural mission journey in Christian history began as collective discernment, not personal ambition. The vision your team carries together is almost always larger and more accurate than the vision any one of you carries alone.",
      id: "Sementara gereja di Antiokhia sedang beribadah kepada Tuhan dan berpuasa, Roh Kudus berkata, \"Pisahkanlah Barnabas dan Saulus bagi-Ku untuk melakukan pekerjaan yang telah Kutentukan bagi mereka.\" Panggilan itu datang kepada komunitas, bukan kepada Barnabas atau Saulus seorang diri. Seluruh gereja menumpangkan tangan kepada mereka dan melepas mereka. Perjalanan misi lintas budaya pertama dalam sejarah Kekristenan dimulai sebagai pertimbangan bersama, bukan ambisi pribadi. Visi yang dibawa tim Anda bersama-sama hampir selalu lebih besar dan lebih akurat daripada visi yang dibawa salah satu dari Anda sendiri.",
    },
    diagnosticQuestion: {
      en: "Who in your team have you not yet asked what they see? Whose vision-channel are you not listening to?",
      id: "Siapa dalam tim Anda yang belum Anda tanya apa yang mereka lihat? Saluran visi siapa yang tidak Anda dengarkan?",
    },
    firstStepPractice: {
      en: "Schedule individual conversations with each team member this month. Ask one question: \"What do you see when you imagine this team three years from now?\" Take notes. Say nothing except \"tell me more.\"",
      id: "Jadwalkan percakapan individual dengan setiap anggota tim bulan ini. Ajukan satu pertanyaan: \"Apa yang Anda lihat ketika Anda membayangkan tim ini tiga tahun dari sekarang?\" Ambil catatan. Jangan katakan apa pun kecuali \"ceritakan lebih banyak.\"",
    },
  },
];

// ---------------------------------------------------------------------------
// FIVE TESTS — Discernment Audit
// Adapted from Andy Stanley's Visioneering
// ---------------------------------------------------------------------------

export const fiveTestsIntro: Lang = {
  en: "Not every strong feeling is God-given vision. Andy Stanley's¹ Visioneering¹ offers a discernment framework — five questions that help a leader distinguish a God-originated vision from a good idea, a personal ambition, or a fear-driven reaction.",
  id: "Tidak setiap perasaan kuat adalah visi yang diberikan Allah. Visioneering¹ karya Andy Stanley¹ menawarkan kerangka penegasan — lima pertanyaan yang membantu pemimpin membedakan visi yang berasal dari Allah dari ide yang baik, ambisi pribadi, atau reaksi yang didorong ketakutan.",
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
    },
    question: {
      en: "Has this vision survived at least three months of prayer and patience?",
      id: "Apakah visi ini telah bertahan setidaknya tiga bulan doa dan kesabaran?",
    },
    helpText: {
      en: "Andy Stanley¹ writes: \"What God originates, he orchestrates.\" A vision that keeps returning and gathering weight over months is more likely from God than one that arrives intensely and fades just as quickly.",
      id: "Andy Stanley¹ menulis: \"Apa yang Allah ciptakan, Dia atur.\" Sebuah visi yang terus kembali dan mengumpulkan berat selama berbulan-bulan lebih mungkin dari Allah daripada yang datang dengan intens dan pudar sama cepatnya.",
    },
  },
  {
    id: "scripture",
    title: {
      en: "Scripture",
      id: "Kitab Suci",
    },
    question: {
      en: "Does this vision align with the character of God and the call of the Great Commission?",
      id: "Apakah visi ini selaras dengan karakter Allah dan panggilan Amanat Agung?",
    },
    helpText: {
      en: "A vision that contradicts God's character is not from God, however passionate it feels. A vision aligned with the Great Commission — making disciples among all peoples — carries built-in weight.",
      id: "Sebuah visi yang bertentangan dengan karakter Allah tidak berasal dari Allah, betapapun bersemangatnya rasanya. Sebuah visi yang selaras dengan Amanat Agung — menjadikan semua bangsa murid — memiliki bobot bawaan.",
    },
  },
  {
    id: "community",
    title: {
      en: "Community",
      id: "Komunitas",
    },
    question: {
      en: "Have at least three trusted people independently confirmed this vision?",
      id: "Apakah setidaknya tiga orang yang dipercaya telah secara mandiri mengkonfirmasi visi ini?",
    },
    helpText: {
      en: "If multiple trusted people confirm it without prompting, that is significant. If they unanimously hesitate, that is also significant. Neither silences God, but both are worth listening to. Choose people who are genuinely free to disagree — people who care about you enough to say no. Their hesitation is not a failure of faith; it is data.",
      id: "Jika beberapa orang yang dipercaya mengkonfirmasinya tanpa diminta, itu signifikan. Jika mereka dengan suara bulat ragu-ragu, itu juga signifikan. Keduanya tidak membungkam Allah, tetapi keduanya layak didengarkan. Pilih orang-orang yang benar-benar bebas untuk tidak setuju — orang-orang yang cukup peduli dengan Anda untuk mengatakan tidak. Keraguan mereka bukan kegagalan iman; itu adalah data.",
    },
  },
  {
    id: "sacrifice",
    title: {
      en: "Sacrifice",
      id: "Pengorbanan",
    },
    question: {
      en: "Are you willing to pursue this vision even if it costs comfort, reputation, or recognition?",
      id: "Apakah Anda bersedia mengejar visi ini bahkan jika itu mengorbangkan kenyamanan, reputasi, atau pengakuan?",
    },
    helpText: {
      en: "A vision that requires no sacrifice usually has no power. The cross-cultural context adds its own costs — cultural displacement, loneliness, the slow grind of building across difference. Willingness to pay these is a sign that the vision has roots.",
      id: "Sebuah visi yang tidak memerlukan pengorbanan biasanya tidak memiliki kekuatan. Konteks lintas budaya menambahkan biayanya sendiri — perpindahan budaya, kesepian, usaha lambat membangun di tengah perbedaan. Kesediaan untuk membayar ini adalah tanda bahwa visi memiliki akar.",
    },
  },
  {
    id: "fruit",
    title: {
      en: "Fruit",
      id: "Buah",
    },
    question: {
      en: "Is early pursuit of this vision producing love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control? Or the opposite?",
      id: "Apakah mengejar visi ini secara awal menghasilkan kasih, sukacita, damai, kesabaran, kemurahan, kebaikan, kesetiaan, kelembutan, dan penguasaan diri? Atau sebaliknya?",
    },
    helpText: {
      en: "The fruit reveals the source. A vision that breeds pride, control, and exhaustion in the leader is worth examining. A vision that produces patience and joy even in difficulty is worth holding.",
      id: "Buah mengungkapkan sumbernya. Sebuah visi yang menumbuhkan kebanggaan, kontrol, dan kelelahan dalam diri pemimpin layak untuk diperiksa. Sebuah visi yang menghasilkan kesabaran dan sukacita bahkan dalam kesulitan layak untuk dipegang.",
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
  },
  areasToWatch: {
    en: "Worth sitting with {tests}. These are not reasons to abandon the vision — but they are invitations to keep listening before moving forward.",
    id: "Perlu dipikirkan lebih lanjut: {tests}. Ini bukan alasan untuk meninggalkan visi — tetapi ini adalah undangan untuk terus mendengarkan sebelum melangkah maju.",
  },
  allClear: {
    en: "All five tests point in the same direction. That is rare — and significant. Keep moving.",
    id: "Kelima pengujian menunjuk ke arah yang sama. Itu jarang — dan signifikan. Terus maju.",
  },
};

// ---------------------------------------------------------------------------
// FACILITATION TOOLS
// ---------------------------------------------------------------------------

export const facilitationToolsIntro: Lang = {
  en: "These tools are designed for team use. Each one addresses a different moment in the vision-discernment process — from surfacing what individuals see, to practising the kind of silence that vision requires.",
  id: "Alat-alat ini dirancang untuk digunakan oleh tim. Masing-masing menangani momen yang berbeda dalam proses penegasan visi — dari mengungkap apa yang dilihat individu, hingga mempraktikkan keheningan yang visi perlukan.",
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
    },
    purpose: {
      en: "Surface what each team member sees before the leader speaks.",
      id: "Mengungkap apa yang dilihat setiap anggota tim sebelum pemimpin berbicara.",
    },
    duration: {
      en: "One 60-minute conversation per team member, spread over a season.",
      id: "Satu percakapan 60 menit per anggota tim, tersebar dalam satu musim.",
    },
    instructions: {
      en: "Ask each team member: \"What do you see when you imagine our team three years from now? What stirs your heart about this work? What is one thing you think God might be calling us toward that we haven't named yet?\" Take notes. Do not respond beyond curiosity. Do this with every team member before any team-wide vision conversation.",
      id: "Tanyakan setiap anggota tim: \"Apa yang Anda lihat ketika Anda membayangkan tim kita tiga tahun dari sekarang? Apa yang menggerakkan hati Anda tentang pekerjaan ini? Apa satu hal yang Anda pikir Allah mungkin memanggil kita ke arahnya yang belum kita sebutkan?\" Ambil catatan. Jangan merespons melebihi rasa ingin tahu. Lakukan ini dengan setiap anggota tim sebelum percakapan visi seluruh tim.",
    },
  },
  {
    id: "four-channels-conversation",
    number: 2,
    title: {
      en: "The Four Channels Conversation",
      id: "Percakapan Empat Saluran",
    },
    purpose: {
      en: "Make the four sources of vision explicit with the team.",
      id: "Membuat empat sumber visi menjadi eksplisit bersama tim.",
    },
    duration: {
      en: "90-minute team meeting.",
      id: "Rapat tim 90 menit.",
    },
    instructions: {
      en: "Open with the Vision Compass. Walk the team through each direction — South (Passion), East (Dreams), North (Revelation), West (Others). Ask each member: \"Which channel speaks loudest to you? Through which channel does God most often give you vision?\" Let the conversation surface the team's different gifts of perception.",
      id: "Buka dengan Kompas Visi. Pandu tim melalui setiap arah — Selatan (Gairah), Timur (Mimpi), Utara (Wahyu), Barat (Sesama). Tanyakan setiap anggota: \"Saluran mana yang paling keras berbicara kepada Anda? Melalui saluran mana Allah paling sering memberikan Anda visi?\" Biarkan percakapan mengungkap karunia persepsi yang berbeda dari tim.",
    },
  },
  {
    id: "acts-13-pause",
    number: 3,
    title: {
      en: "The Acts 13 Pause",
      id: "Jeda Kisah 13",
    },
    purpose: {
      en: "Build silence and prayer into vision discernment.",
      id: "Membangun keheningan dan doa ke dalam penegasan visi.",
    },
    duration: {
      en: "Half-day team retreat.",
      id: "Retret tim setengah hari.",
    },
    instructions: {
      en: "Borrow the Acts 13 pattern. Gather to worship and pray together — without strategy talk for the first half. Only after substantial silence does the team share what each person sensed. The vision that emerges from this kind of discernment carries weight that strategy meetings cannot produce.",
      id: "Pinjam pola Kisah 13. Berkumpul untuk beribadah dan berdoa bersama — tanpa pembicaraan strategi selama paruh pertama. Hanya setelah keheningan yang cukup baru tim berbagi apa yang dirasakan masing-masing orang. Visi yang muncul dari penegasan semacam ini membawa bobot yang tidak dapat dihasilkan oleh rapat strategi.",
    },
  },
  {
    id: "vision-story",
    number: 4,
    title: {
      en: "The Vision Story",
      id: "Kisah Visi",
    },
    purpose: {
      en: "Move from bullet-point vision to story-told vision.",
      id: "Bergerak dari visi poin-poin ke visi yang diceritakan sebagai kisah.",
    },
    duration: {
      en: "45 minutes alone, then 30 minutes with the team.",
      id: "45 menit sendiri, kemudian 30 menit bersama tim.",
    },
    instructions: {
      en: "Write the vision as a story, not a list. \"Imagine our team in three years. It is Tuesday morning. What do we see? Who is there? What are they doing? What stories are they telling each other?\" Read the story to the team. Listen for what they add, correct, or ask about. Try opening with: \"Imagine the day when...\" and then paint a specific picture. Vision spoken as story sticks where bullet points evaporate.",
      id: "Tuliskan visi sebagai sebuah kisah, bukan daftar. \"Bayangkan tim kita dalam tiga tahun. Ini adalah Selasa pagi. Apa yang kita lihat? Siapa yang ada di sana? Apa yang mereka lakukan? Kisah apa yang mereka ceritakan satu sama lain?\" Bacakan kisah itu kepada tim. Dengarkan apa yang mereka tambahkan, koreksi, atau tanyakan. Coba buka dengan: \"Bayangkan hari ketika...\" lalu gambarkan gambaran yang spesifik. Visi yang diucapkan sebagai kisah melekat di mana poin-poin menguap.",
    },
  },
  {
    id: "repeat-calendar",
    number: 5,
    title: {
      en: "The Repeat Calendar",
      id: "Kalender Pengulangan",
    },
    purpose: {
      en: "Force the leader to communicate the vision seven to ten times.",
      id: "Memaksa pemimpin untuk mengkomunikasikan visi tujuh hingga sepuluh kali.",
    },
    duration: {
      en: "Ongoing.",
      id: "Berkelanjutan.",
    },
    instructions: {
      en: "Mark vision-casting moments on the calendar — once a month at minimum, woven into team meetings, one-on-ones, written communication, and team retreats. Track each one. Research suggests² leaders need to communicate vision seven to ten times² before it begins to settle. The leader who feels they have over-communicated is usually communicating it for the first time at the level the team needs.",
      id: "Tandai momen-momen penebaran visi di kalender — minimal sekali sebulan, dijalin ke dalam rapat tim, pertemuan satu lawan satu, komunikasi tertulis, dan retret tim. Lacak masing-masing. Penelitian menunjukkan² pemimpin perlu mengkomunikasikan visi tujuh hingga sepuluh kali² sebelum mulai menetap. Pemimpin yang merasa telah terlalu banyak berkomunikasi biasanya baru mengkomunikasikannya untuk pertama kali di tingkat yang dibutuhkan tim.",
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
  },
  body: {
    en: "Before you speak the vision again, hear what your team is already seeing. Run individual conversations with each member. Ask what stirs them. Take notes. Say nothing except \"tell me more.\" The vision that emerges will be larger than the one you started with.",
    id: "Sebelum Anda berbicara visi lagi, dengarkan apa yang sudah dilihat tim Anda. Lakukan percakapan individual dengan setiap anggota. Tanyakan apa yang menggerakkan mereka. Ambil catatan. Jangan katakan apa pun kecuali \"ceritakan lebih banyak.\" Visi yang muncul akan lebih besar dari yang Anda mulai.",
  },
  buttonLabel: {
    en: "← Training",
    id: "← Pelatihan",
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
    },
    fiveTests: {
      en: "Five Tests for Vision",
      id: "Lima Pengujian Visi",
    },
    facilitationTools: {
      en: "Facilitation Tools",
      id: "Alat Fasilitasi",
    },
    resources: {
      en: "Go Deeper",
      id: "Pelajari Lebih Dalam",
    },
  },
  buttons: {
    saveToDashboard: {
      en: "Save to Dashboard",
      id: "Simpan ke Dashboard",
    },
    savedToDashboard: {
      en: "✓ Saved to Dashboard",
      id: "✓ Tersimpan di Dashboard",
    },
    startAudit: {
      en: "Run the Discernment Audit",
      id: "Jalankan Audit Penegasan",
    },
    viewAllResources: {
      en: "← Training",
      id: "← Pelatihan",
    },
  },
  labels: {
    direction: {
      en: "Direction",
      id: "Arah",
    },
    biblicalAnchor: {
      en: "Biblical Anchor",
      id: "Jangkar Alkitab",
    },
    diagnosticQuestion: {
      en: "Diagnostic Question",
      id: "Pertanyaan Diagnostik",
    },
    firstStep: {
      en: "First Step",
      id: "Langkah Pertama",
    },
    purpose: {
      en: "Purpose",
      id: "Tujuan",
    },
    duration: {
      en: "Duration",
      id: "Durasi",
    },
    howItWorks: {
      en: "How it works",
      id: "Cara kerjanya",
    },
    yes: {
      en: "Yes",
      id: "Ya",
    },
    unsure: {
      en: "Unsure",
      id: "Tidak Yakin",
    },
    no: {
      en: "No",
      id: "Tidak",
    },
    yourResults: {
      en: "Your results",
      id: "Hasil Anda",
    },
    leadershipGuide: {
      en: "Leadership · Guide",
      id: "Kepemimpinan · Panduan",
    },
    book: {
      en: "Book",
      id: "Buku",
    },
    video: {
      en: "Video",
      id: "Video",
    },
    module: {
      en: "Module",
      id: "Modul",
    },
  },
};
