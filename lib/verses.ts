export type VerseEntry = {
  ref: string;
  refId: string;
  version: string;
  text: string;
  textId: string; // Indonesian
  isChapter?: boolean; // true = key verses from a chapter, not exhaustive
};

export const VERSES: VerseEntry[] = [
  // ── Karunia Rohani ──
  {
    ref: "1 Corinthians 12 (key verses)",
    refId: "1 Korintus 12 (ayat kunci)",
    version: "NIV",
    isChapter: true,
    text: `"Now about the gifts of the Spirit, brothers and sisters, I do not want you to be uninformed… There are different kinds of gifts, but the same Spirit distributes them. There are different kinds of service, but the same Lord. There are different kinds of working, but in all of them and in everyone it is the same God at work. Now to each one the manifestation of the Spirit is given for the common good…\n\nJust as a body, though one, has many parts, but all its many parts form one body, so it is with Christ… Now you are the body of Christ, and each one of you is a part of it. And God has placed in the church first of all apostles, second prophets, third teachers, then miracles, then gifts of healing, of helping, of guidance, and of different kinds of tongues." (1 Cor 12:1, 4–7, 12, 27–28, NIV)`,
    textId: `"Sekarang tentang karunia-karunia Roh, saudara-saudara, aku tidak mau kamu tidak mengetahuinya… Ada berbagai karunia, tetapi satu Roh yang sama. Ada berbagai pelayanan, tetapi satu Tuhan yang sama. Dan ada berbagai perbuatan ajaib, tetapi Allah yang sama membuat semuanya dalam semua orang. Tetapi kepada tiap-tiap orang diberikan penyataan Roh untuk kepentingan bersama…\n\nSebab sama seperti tubuh itu satu dan anggota-anggotanya banyak… kamu adalah tubuh Kristus dan kamu masing-masing adalah anggotanya. Dan Allah telah menetapkan beberapa orang dalam Jemaat: pertama sebagai rasul, kedua sebagai nabi, ketiga sebagai pengajar. Selanjutnya mereka yang mendapat karunia untuk mengadakan mujizat, untuk menyembuhkan, untuk melayani, untuk memimpin, dan untuk berkata-kata dalam bahasa roh." (1 Kor 12:1, 4–7, 12, 27–28, TB)`,
  },
  {
    ref: "Romans 12:6–8",
    refId: "Roma 12:6–8",
    version: "NIV",
    text: `"We have different gifts, according to the grace given to each of us. If your gift is prophesying, then prophesy in accordance with your faith; if it is serving, then serve; if it is teaching, then teach; if it is to encourage, then give encouragement; if it is giving, then give generously; if it is to lead, do it diligently; if it is to show mercy, do it cheerfully." (Romans 12:6–8, NIV)`,
    textId: `"Demikianlah kita mempunyai karunia yang berlain-lainan menurut kasih karunia yang dianugerahkan kepada kita: Jika karunia itu adalah untuk bernubuat baiklah kita melakukannya sesuai dengan iman kita. Jika karunia untuk melayani, baiklah kita melayani; jika karunia untuk mengajar, baiklah kita mengajar; jika karunia untuk menasihati, baiklah kita menasihati. Siapa yang membagi-bagikan sesuatu, hendaklah ia melakukannya dengan hati yang ikhlas; siapa yang memberi pimpinan, hendaklah ia melakukannya dengan rajin; siapa yang menunjukkan kemurahan, hendaklah ia melakukannya dengan sukacita." (Roma 12:6–8, TB)`,
  },
  {
    ref: "Ephesians 4:11–12",
    refId: "Efesus 4:11–12",
    version: "NIV",
    text: `"So Christ himself gave the apostles, the prophets, the evangelists, the pastors and teachers, to equip his people for works of service, so that the body of Christ may be built up until we all reach unity in the faith and in the knowledge of the Son of God and become mature, attaining to the whole measure of the fullness of Christ." (Ephesians 4:11–12, NIV)`,
    textId: `"Dan Ialah yang memberikan baik rasul-rasul maupun nabi-nabi, baik pemberita-pemberita Injil maupun gembala-gembala dan pengajar-pengajar, untuk memperlengkapi orang-orang kudus bagi pekerjaan pelayanan, bagi pembangunan tubuh Kristus, sampai kita semua telah mencapai kesatuan iman dan pengetahuan yang benar tentang Anak Allah, kedewasaan penuh, dan tingkat pertumbuhan yang sesuai dengan kepenuhan Kristus." (Efesus 4:11–12, TB)`,
  },

  // ── Cultural Intelligence ──
  {
    ref: "Acts 17:26–27",
    refId: "Kisah Para Rasul 17:26–27",
    version: "NIV",
    text: `"From one man he made all the nations, that they should inhabit the whole earth; and he marked out their appointed times in history and the boundaries of their lands. God did this so that they would seek him and perhaps reach out for him and find him, though he is not far from any one of us." (Acts 17:26–27, NIV)`,
    textId: `"Dari satu orang saja Ia telah menjadikan semua bangsa dan umat manusia untuk mendiami seluruh muka bumi dan Ia telah menentukan musim-musim bagi mereka dan batas-batas kediaman mereka, supaya mereka mencari Dia dan mudah-mudahan menjamah dan menemukan Dia, walaupun Ia tidak jauh dari kita masing-masing." (Kisah Para Rasul 17:26–27, TB)`,
  },

  // ── Intercultural Communication ──
  {
    ref: "Ephesians 4:15",
    refId: "Efesus 4:15",
    version: "NIV",
    text: `"Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ." (Ephesians 4:15, NIV)`,
    textId: `"Tetapi dengan teguh berpegang kepada kebenaran di dalam kasih kita bertumbuh di dalam segala hal ke arah Dia, Kristus, yang adalah Kepala." (Efesus 4:15, TB)`,
  },

  // ── Power Distance ──
  {
    ref: "Matthew 20:26–28",
    refId: "Matius 20:26–28",
    version: "NIV",
    text: `"Not so with you. Instead, whoever wants to become great among you must be your servant, and whoever wants to be first must be your slave — just as the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many." (Matthew 20:26–28, NIV)`,
    textId: `"Tidaklah demikian di antara kamu. Barangsiapa ingin menjadi besar di antara kamu, hendaklah ia menjadi pelayanmu, dan barangsiapa ingin menjadi terkemuka di antara kamu, hendaklah ia menjadi hambamu; sama seperti Anak Manusia datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang." (Matius 20:26–28, TB)`,
  },
];

export function getVerse(refId: string): VerseEntry | undefined {
  return VERSES.find(v => v.ref === refId || v.refId === refId);
}
