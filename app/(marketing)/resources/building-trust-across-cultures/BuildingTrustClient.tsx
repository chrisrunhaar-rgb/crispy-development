"use client";
import { useState, useTransition, type CSSProperties } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

const NAVY = "oklch(22% 0.10 260)";
const ORANGE = "oklch(65% 0.15 45)";
const OFF_WHITE = "oklch(96% 0.005 80)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT = "oklch(38% 0.05 260)";
const NAVY_BORDER = "oklch(35% 0.10 260)";
const CARD_DARK = "oklch(16% 0.08 260)";

const FONT_HEADLINE = "'Cormorant Garamond', serif";
const FONT_BODY = "'Montserrat', sans-serif";

/* ---------------------------------- Content ---------------------------------- */

const HERO_SUBTITLE = {
  en: "Every leader carries an invisible map of how trust forms. Most of the time, it works fine — because everyone around you is reading the same map. But when cultures mix, those maps can point in completely different directions. This module helps you see yours clearly, understand others', and take the step that actually builds trust in your specific context.",
  id: "Setiap pemimpin membawa peta tak kasat mata tentang bagaimana kepercayaan terbentuk. Biasanya peta itu bekerja dengan baik — karena semua orang di sekitar kamu membaca peta yang sama. Tapi ketika budaya berbeda bertemu, peta-peta itu bisa menunjuk ke arah yang berlawanan. Modul ini membantu kamu melihat petamu dengan jelas, memahami peta orang lain, dan mengambil langkah yang benar-benar membangun kepercayaan dalam konteks kamu.",
};

const INTRO_PARAS = {
  en: [
    "There is a particular kind of confusion that happens in cross-cultural teams. Someone goes quiet who was once open. A relationship that felt solid starts to feel distant. Meetings still happen, work still gets done — but something has shifted, and you cannot name it. You were not in a conflict. You did not say anything wrong, as far as you know. But the warmth is gone.",
    "In many cases, what has shifted is trust. Not because anyone chose to withdraw it. But because the conditions for trust to form were never really established in the first place — and no one knew that, because both sides were assuming trust works the same way for everyone.",
    "It doesn't.",
    "Trust is one of the most culturally loaded concepts in leadership. What builds it, what breaks it, and what restores it can look completely different depending on where you and your team come from. And yet most leaders never stop to examine their own assumptions about how trust works — because those assumptions have never been challenged before.",
    "This module is about that examination. It is not about becoming suspicious of others. It is not about lowering your expectations of the people you lead. It is about developing the kind of awareness that lets you build trust intentionally — especially across the cultural distance where it matters most and is hardest to sustain.",
    "The road of influence is communication. The foundation of communication is trust. Before anything else can work — honest feedback, accountability, shared decisions, real collaboration — trust has to be there. And in cross-cultural leadership, that foundation does not appear automatically. It has to be built.",
  ],
  id: [
    "Ada kebingungan tertentu yang terjadi dalam tim lintas budaya. Seseorang yang tadinya terbuka mulai diam. Sebuah hubungan yang terasa solid mulai terasa jauh. Pertemuan tetap berlangsung, pekerjaan tetap selesai — tapi ada sesuatu yang berubah, dan kamu tidak bisa menamakannya. Tidak ada konflik. Kamu tidak mengatakan sesuatu yang salah, sejauh yang kamu tahu. Tapi kehangatan itu sudah pergi.",
    "Dalam banyak kasus, yang berubah adalah kepercayaan. Bukan karena seseorang memilih untuk menariknya. Tapi karena kondisi untuk kepercayaan itu terbentuk sebenarnya tidak pernah benar-benar dibangun sejak awal — dan tidak ada yang tahu itu, karena kedua pihak mengasumsikan bahwa kepercayaan bekerja dengan cara yang sama untuk semua orang.",
    "Ternyata tidak.",
    "Kepercayaan adalah salah satu konsep yang paling dipengaruhi budaya dalam kepemimpinan. Apa yang membangunnya, apa yang menghancurkannya, dan apa yang memulihkannya bisa terlihat sangat berbeda tergantung dari mana kamu dan timmu berasal. Namun kebanyakan pemimpin tidak pernah berhenti untuk memeriksa asumsi mereka sendiri tentang bagaimana kepercayaan bekerja — karena asumsi itu belum pernah ditantang sebelumnya.",
    "Modul ini membahas pemeriksaan itu. Bukan tentang menjadi curiga terhadap orang lain. Bukan tentang menurunkan ekspektasimu terhadap orang-orang yang kamu pimpin. Ini tentang mengembangkan kesadaran yang memungkinkan kamu membangun kepercayaan secara disengaja — terutama di tengah jarak budaya di mana hal itu paling penting dan paling sulit dipertahankan.",
    "Jalan pengaruh adalah komunikasi. Fondasi komunikasi adalah kepercayaan. Sebelum hal lain bisa berfungsi — umpan balik yang jujur, akuntabilitas, keputusan bersama, kolaborasi yang nyata — kepercayaan harus ada terlebih dahulu. Dan dalam kepemimpinan lintas budaya, fondasi itu tidak muncul secara otomatis. Ia harus dibangun.",
  ],
};

const LEARNING_OUTCOMES = {
  en: [
    { keyword: "Recognise", rest: " your own default trust model and identify how it may be misaligning with the expectations of people from different cultural backgrounds." },
    { keyword: "Distinguish", rest: " between cognitive trust and affective trust, and explain why mixing these defaults without awareness produces distance that neither side can name." },
    { keyword: "Apply", rest: " the shift from passive trust assessment (“do I trust them?”) to active trust investment (“have I created the conditions where they can trust me?”) in at least one real leadership relationship this week." },
  ],
  id: [
    { keyword: "Mengenali", rest: " model kepercayaan bawaanmu sendiri dan mengidentifikasi bagaimana model itu mungkin tidak selaras dengan ekspektasi orang-orang dari latar belakang budaya yang berbeda." },
    { keyword: "Membedakan", rest: " antara kepercayaan kognitif dan kepercayaan afektif, dan menjelaskan mengapa pencampuran default ini tanpa kesadaran menghasilkan jarak yang tidak bisa dinamai oleh kedua pihak." },
    { keyword: "Menerapkan", rest: " pergeseran dari penilaian kepercayaan yang pasif (“apakah aku mempercayai mereka?”) ke investasi kepercayaan yang aktif (“apakah aku sudah menciptakan kondisi di mana mereka bisa mempercayai aku?”) dalam setidaknya satu hubungan kepemimpinan nyata minggu ini." },
  ],
};

const TEACHING_PARAS = {
  en: [
    "Here is a question worth sitting with: when you think about whether you trust someone, what is the evidence you are looking at?",
    "For many leaders — especially those shaped by Western European or North American working cultures — the answer involves things like: Did they do what they said they would? Did they deliver on time? Are they competent? Do they follow through? This is sometimes called cognitive trust. It is task-based, built through reliable performance, and felt most naturally in low-context cultures where professional behaviour and personal relationship are kept separate.",
    "For many others — leaders and team members shaped by Indonesian, Brazilian, Nigerian, Chinese, or Indian working cultures, among others — the trust question looks very different. Before performance can mean anything, relationship has to come first. Have we spent real time together? Does this person know my family situation, my pressures, my story? Do they genuinely care about me as a person, not just what I produce? This is affective trust. It is relationship-based, built through emotional closeness and shared personal experience, and it takes time that task-focused cultures often do not naturally invest.",
    "Neither model is wrong. Both are deeply human. Both appear in Scripture.",
    "But when these two models collide in a team — without anyone naming what is happening — the result is predictable. The Dutch leader thinks the Indonesian team member is too slow to get to work because he keeps wanting to talk and share meals. The Indonesian team member thinks the Dutch leader cannot be trusted because he never takes the time to actually know you before he starts asking things of you. Both are working hard. Both have genuine goodwill. And neither one can name what is breaking down.",
    "This is what researchers call the trust asymmetry. It is not a flaw in either cultural model. It is a structural collision between two equally legitimate ways of building human relationships — one designed for efficiency, one designed for safety — that most people have never had to consciously examine, because they have only ever worked with people who share their defaults.",
    "The asymmetry becomes dangerous when it goes unnamed. Because when trust starts to erode across cultures, the breakdown is often self-sealing. Each person interprets the other's behaviour through their own cultural lens. The task-focused leader sees withdrawal and labels it passivity or disengagement. The relationship-focused team member sees pressure and labels it coldness or disrespect. Neither sees the trust failure clearly enough to name it. So there is no foundation from which to begin a real conversation. The distance grows, and no one knows exactly why.",
    "This is not primarily a skills problem. It is an awareness problem.",
    "The shift this module invites is simple to describe and genuinely hard to do. It is a move from passive trust assessment to active trust investment.",
    "Most leaders, when they think about trust in a team, are quietly asking: “Do I trust this person?” That is passive assessment. It puts you in the position of the evaluator, watching to see if the other person earns your confidence.",
    "But there is a different conviction, one shaped by real experience of this kind of silent breakdown: we assume that when we trust someone, the person also trusts us. That is not the case. Trust needs to grow, and only grows when we intentionally care about the other person, genuinely try to listen and understand their situation, values, and viewpoints.",
    "The question that changes things is not “do I trust them?” The question is: “Have I done everything I can so that this person can grow in trusting me?”",
    "That shift — from assessor to investor — is where cross-cultural trust actually begins.",
  ],
  id: [
    "Ini adalah pertanyaan yang layak untuk direnungkan: ketika kamu memikirkan apakah kamu mempercayai seseorang, bukti apa yang sedang kamu lihat?",
    "Bagi banyak pemimpin — terutama mereka yang dibentuk oleh budaya kerja Eropa Barat atau Amerika Utara — jawabannya melibatkan hal-hal seperti: Apakah mereka melakukan apa yang mereka katakan? Apakah mereka tepat waktu? Apakah mereka kompeten? Apakah mereka menindaklanjuti? Ini kadang disebut kepercayaan kognitif. Ini berbasis tugas, dibangun melalui kinerja yang dapat diandalkan, dan paling terasa alami dalam budaya konteks rendah di mana perilaku profesional dan hubungan personal dipisahkan.",
    "Bagi banyak orang lain — pemimpin dan anggota tim yang dibentuk oleh budaya kerja Indonesia, Brasil, Nigeria, China, atau India, antara lain — pertanyaan kepercayaan terlihat sangat berbeda. Sebelum kinerja bisa berarti apa pun, hubungan harus datang lebih dulu. Apakah kita sudah menghabiskan waktu yang benar-benar bersama? Apakah orang ini mengetahui situasi keluargaku, tekananku, ceritaku? Apakah mereka benar-benar peduli padaku sebagai manusia, bukan hanya apa yang aku hasilkan? Ini adalah kepercayaan afektif. Ini berbasis hubungan, dibangun melalui kedekatan emosional dan pengalaman personal bersama, dan membutuhkan waktu yang sering tidak diinvestasikan secara alami oleh budaya yang berfokus pada tugas.",
    "Tidak ada model yang salah. Keduanya sangat manusiawi. Keduanya muncul dalam Kitab Suci.",
    "Tapi ketika dua model ini bertabrakan dalam satu tim — tanpa ada yang menamai apa yang sedang terjadi — hasilnya dapat diprediksi. Pemimpin dari Belanda berpikir anggota tim dari Indonesia terlalu lambat bekerja karena dia terus ingin berbicara dan makan bersama. Anggota tim dari Indonesia berpikir pemimpin dari Belanda tidak bisa dipercaya karena dia tidak pernah meluangkan waktu untuk benar-benar mengenalmu sebelum mulai meminta sesuatu darimu. Keduanya bekerja keras. Keduanya memiliki niat baik yang tulus. Dan tidak ada satu pun yang bisa menamai apa yang sedang rusak.",
    "Ini yang disebut peneliti sebagai asimetri kepercayaan. Ini bukan cacat dalam salah satu model budaya. Ini adalah tabrakan struktural antara dua cara membangun hubungan manusia yang sama-sama sah — satu dirancang untuk efisiensi, satu dirancang untuk keamanan — yang kebanyakan orang tidak pernah harus periksa secara sadar, karena mereka hanya pernah bekerja dengan orang-orang yang berbagi default yang sama.",
    "Asimetri menjadi berbahaya ketika tidak dinamai. Karena ketika kepercayaan mulai terkikis lintas budaya, kerusakan itu sering kali menyegel dirinya sendiri. Setiap orang menafsirkan perilaku orang lain melalui lensa budayanya sendiri. Pemimpin yang berfokus pada tugas melihat penarikan diri dan memberinya label pasif atau tidak terlibat. Anggota tim yang berfokus pada hubungan melihat tekanan dan memberinya label dingin atau tidak menghormati. Tidak ada yang melihat kegagalan kepercayaan itu dengan cukup jelas untuk menamakannya. Jadi tidak ada fondasi dari mana memulai percakapan yang nyata. Jarak semakin besar, dan tidak ada yang tahu persis mengapa.",
    "Ini bukan terutama masalah keterampilan. Ini masalah kesadaran.",
    "Pergeseran yang diundang modul ini sederhana untuk dijelaskan dan sungguh sulit untuk dilakukan. Ini adalah langkah dari penilaian kepercayaan yang pasif ke investasi kepercayaan yang aktif.",
    "Kebanyakan pemimpin, ketika memikirkan kepercayaan dalam tim, diam-diam bertanya: “Apakah aku mempercayai orang ini?” Itu adalah penilaian pasif. Itu menempatkan kamu dalam posisi sebagai penilai, menunggu untuk melihat apakah orang lain mendapatkan kepercayaanmu.",
    "Tapi ada keyakinan yang berbeda, yang dibentuk oleh pengalaman nyata dari jenis kerusakan diam seperti ini: kita mengasumsikan bahwa ketika kita mempercayai seseorang, orang itu juga mempercayai kita. Itu tidak benar. Kepercayaan perlu tumbuh, dan hanya tumbuh ketika kita dengan sengaja peduli pada orang lain, benar-benar mencoba mendengarkan dan memahami situasi, nilai, dan sudut pandang mereka.",
    "Pertanyaan yang mengubah segalanya bukan “apakah aku mempercayai mereka?” Pertanyaannya adalah: “Apakah aku sudah melakukan semua yang bisa aku lakukan agar orang ini bisa bertumbuh dalam mempercayai aku?”",
    "Pergeseran itu — dari penilai ke investor — adalah tempat kepercayaan lintas budaya sebenarnya dimulai.",
  ],
};

type ConceptCardData = {
  name: string;
  subtitle: string;
  sections: { label: string; body: string }[];
};

const CONCEPT_CARDS: { en: ConceptCardData; id: ConceptCardData }[] = [
  {
    en: {
      name: "COGNITIVE TRUST",
      subtitle: "Task-based. Earned through reliable performance.",
      sections: [
        { label: "What it is", body: "Trust built through demonstrated competence, reliable delivery, and consistent professional behaviour. It is primarily task-based — you earn it by doing what you said you would do, on time, to a good standard." },
        { label: "Where it is the default", body: "USA, Germany, Netherlands, Scandinavia, Australia, United Kingdom, and most other low-context, individualist cultures. These contexts tend to separate professional relationship from personal relationship — competence speaks first." },
        { label: "How it is built", body: "Show up prepared. Deliver what you promised. Follow through consistently. Be honest about limitations. Meet deadlines. Competence and reliability are the currency." },
        { label: "What breaks it", body: "Missed commitments, inconsistent delivery, making promises that go unfulfilled, lack of transparency about failures or delays. Lateness without explanation reads as disrespect for the professional relationship." },
      ],
    },
    id: {
      name: "KEPERCAYAAN KOGNITIF",
      subtitle: "Berbasis tugas. Diperoleh melalui kinerja yang dapat diandalkan.",
      sections: [
        { label: "Apa itu", body: "Kepercayaan yang dibangun melalui kompetensi yang terbukti, penyampaian yang dapat diandalkan, dan perilaku profesional yang konsisten. Ini terutama berbasis tugas — kamu mendapatkannya dengan melakukan apa yang kamu katakan akan kamu lakukan, tepat waktu, dengan standar yang baik." },
        { label: "Di mana ini menjadi default", body: "Amerika Serikat, Jerman, Belanda, Skandinavia, Australia, Inggris Raya, dan kebanyakan budaya konteks rendah dan individualis lainnya. Konteks-konteks ini cenderung memisahkan hubungan profesional dari hubungan personal — kompetensi berbicara lebih dulu." },
        { label: "Bagaimana membangunnya", body: "Hadir dengan siap. Sampaikan apa yang kamu janjikan. Tindaklanjuti secara konsisten. Jujur tentang keterbatasan. Tepati tenggat waktu. Kompetensi dan keandalan adalah mata uangnya." },
        { label: "Apa yang menghancurkannya", body: "Komitmen yang tidak ditepati, penyampaian yang tidak konsisten, membuat janji yang tidak ditepati, kurangnya transparansi tentang kegagalan atau keterlambatan. Keterlambatan tanpa penjelasan dibaca sebagai kurang menghormati hubungan profesional." },
      ],
    },
  },
  {
    en: {
      name: "AFFECTIVE TRUST",
      subtitle: "Relationship-based. Earned through personal investment.",
      sections: [
        { label: "What it is", body: "Trust built through emotional connection, genuine personal interest, and shared human experience. It is primarily relationship-based — you earn it by investing in the person before you invest in the project." },
        { label: "Where it is the default", body: "Indonesia, Brazil, Nigeria, China, India, Saudi Arabia, Mexico, and most high-context, collectivist cultures. In these contexts, personal relationship and professional relationship are not separated — knowing someone as a person is the prerequisite for trusting them professionally." },
        { label: "How it is built", body: "Spend time together beyond the task. Ask about family, personal situation, and concerns. Share meals. Be genuinely curious about who this person is outside the meeting room. Acknowledge life before business." },
        { label: "What breaks it", body: "Moving straight to task without investing in relationship first. Treating people primarily as their function or output. Declining social invitations. Rushing through the personal to get to the professional. Feeling “too busy” to engage on a human level." },
      ],
    },
    id: {
      name: "KEPERCAYAAN AFEKTIF",
      subtitle: "Berbasis hubungan. Diperoleh melalui investasi personal.",
      sections: [
        { label: "Apa itu", body: "Kepercayaan yang dibangun melalui koneksi emosional, minat personal yang tulus, dan pengalaman manusiawi bersama. Ini terutama berbasis hubungan — kamu mendapatkannya dengan berinvestasi pada orangnya sebelum berinvestasi pada proyeknya." },
        { label: "Di mana ini menjadi default", body: "Indonesia, Brasil, Nigeria, China, India, Arab Saudi, Meksiko, dan kebanyakan budaya konteks tinggi dan kolektivis. Dalam konteks-konteks ini, hubungan personal dan profesional tidak dipisahkan — mengenal seseorang sebagai manusia adalah prasyarat untuk mempercayai mereka secara profesional." },
        { label: "Bagaimana membangunnya", body: "Habiskan waktu bersama di luar tugas. Tanyakan tentang keluarga, situasi personal, dan kekhawatiran. Makan bersama. Jadilah penasaran yang tulus tentang siapa orang ini di luar ruang rapat. Akui kehidupan sebelum bisnis." },
        { label: "Apa yang menghancurkannya", body: "Langsung ke tugas tanpa berinvestasi dalam hubungan terlebih dahulu. Memperlakukan orang terutama sebagai fungsi atau output mereka. Menolak undangan sosial. Bergegas melewati hal personal untuk sampai ke hal profesional. Merasa “terlalu sibuk” untuk terlibat pada tingkat manusiawi." },
      ],
    },
  },
];

const FIELD_STORY_PARAS = {
  en: [
    "I have experienced the moment when trust disappears without warning.",
    "Communication changed. People who had been warm went quiet. Friendships that felt real went distant. I could not find a single event that explained it. No argument. No obvious misunderstanding. Nothing I could point to and say: that was it. That was where it broke.",
    "What made it hardest was not the distance itself. What made it hardest was this: because there was no trust anymore, there was no foundation from which to start the real conversation. The conversation that might have explained what happened. The conversation that might have built a bridge back.",
    "Without trust, even the attempt to repair feels unsafe. So the silence grows. And because neither side has the language — or the relationship — to cross it, the door closes. Not in anger. Just quietly. Permanently.",
    "I did not know, at the time, that what I was experiencing had a name. I did not know that what had broken down between us was not just a personal relationship but two entirely different models of how trust forms and what it requires. I was reading from one map. The people around me were reading from another. And neither map ever became visible to either of us.",
    "The question I carry from that experience is not “who was at fault?” I have stopped asking that. The question I carry is this: “Did I do everything I could to create the conditions where they could trust me?” Not just whether I trusted them. Whether I invested, genuinely and practically, in a way that made sense to them — not just to me.",
    "I don't have a clean ending to give you here. I don't think I fully understood that until after the door had closed. But I understand it now. And that understanding is what this module is built on.",
  ],
  id: [
    "Aku pernah mengalami momen ketika kepercayaan hilang tanpa peringatan.",
    "Komunikasi berubah. Orang-orang yang tadinya hangat menjadi diam. Persahabatan yang terasa nyata menjadi jauh. Aku tidak bisa menemukan satu peristiwa pun yang menjelaskan itu. Tidak ada pertengkaran. Tidak ada kesalahpahaman yang jelas. Tidak ada yang bisa aku tunjuk dan katakan: itulah yang terjadi. Di situlah semuanya rusak.",
    "Yang membuatnya paling sulit bukan jarak itu sendiri. Yang membuatnya paling sulit adalah ini: karena tidak ada lagi kepercayaan, tidak ada fondasi dari mana memulai percakapan yang nyata. Percakapan yang mungkin menjelaskan apa yang terjadi. Percakapan yang mungkin membangun jembatan kembali.",
    "Tanpa kepercayaan, bahkan upaya untuk memperbaiki pun terasa tidak aman. Jadi diam semakin tumbuh. Dan karena tidak ada pihak yang memiliki bahasa — atau hubungan — untuk menyeberanginya, pintu itu tertutup. Bukan dalam kemarahan. Hanya dengan sunyi. Secara permanen.",
    "Aku tidak tahu, pada saat itu, bahwa apa yang aku alami memiliki nama. Aku tidak tahu bahwa apa yang rusak di antara kami bukan hanya hubungan personal tetapi dua model yang sepenuhnya berbeda tentang bagaimana kepercayaan terbentuk dan apa yang dibutuhkannya. Aku membaca dari satu peta. Orang-orang di sekitarku membaca dari peta lain. Dan tidak ada satu peta pun yang pernah terlihat oleh salah satu dari kami.",
    "Pertanyaan yang aku bawa dari pengalaman itu bukan “siapa yang salah?” Aku telah berhenti menanyakan itu. Pertanyaan yang aku bawa adalah ini: “Apakah aku sudah melakukan semua yang bisa aku lakukan untuk menciptakan kondisi di mana mereka bisa mempercayaiku?” Bukan hanya apakah aku mempercayai mereka. Apakah aku berinvestasi, dengan tulus dan praktis, dengan cara yang masuk akal bagi mereka — bukan hanya bagiku.",
    "Aku tidak punya akhir yang rapi untuk diberikan kepadamu di sini. Aku tidak berpikir aku benar-benar memahami itu sampai setelah pintu itu tertutup. Tapi aku memahaminya sekarang. Dan pemahaman itulah yang menjadi fondasi modul ini.",
  ],
};

const SELF_ASSESSMENT_ITEMS = [
  {
    en: "Before starting a new working relationship with someone from a different cultural background, I invest time in understanding who they are as a person — not just what they bring to the role.",
    id: "Sebelum memulai hubungan kerja baru dengan seseorang dari latar belakang budaya yang berbeda, aku meluangkan waktu untuk memahami siapa mereka sebagai manusia — bukan hanya apa yang mereka bawa ke dalam peran.",
  },
  {
    en: "When I sense distance or disengagement from a team member, my first instinct is to ask what I might be missing in how I am relating to them — not to assume the issue is on their side.",
    id: "Ketika aku merasakan jarak atau ketidakterlibatan dari anggota tim, insting pertamaku adalah bertanya apa yang mungkin aku lewatkan dalam cara aku berhubungan dengan mereka — bukan langsung mengasumsikan masalah ada di pihak mereka.",
  },
  {
    en: "I can name the cultural trust default I operate from most naturally (task-based or relationship-based), and I am aware of how that default shapes my behaviour with others.",
    id: "Aku bisa menamai default kepercayaan budaya yang paling alami aku operasikan (berbasis tugas atau berbasis hubungan), dan aku sadar bagaimana default itu membentuk perilakuku dengan orang lain.",
  },
  {
    en: "When I do something to build trust — spending time, asking questions, following through on commitments — I think about whether it is meaningful in the way my team member understands trust, not just in the way I understand it.",
    id: "Ketika aku melakukan sesuatu untuk membangun kepercayaan — menghabiskan waktu, mengajukan pertanyaan, menindaklanjuti komitmen — aku memikirkan apakah itu bermakna dengan cara anggota timku memahami kepercayaan, bukan hanya dengan cara aku memahaminya.",
  },
  {
    en: "I have recently taken a concrete step to invest in a relationship where trust has felt thin — without waiting for the other person to make the first move.",
    id: "Aku baru-baru ini mengambil langkah konkret untuk berinvestasi dalam hubungan di mana kepercayaan terasa tipis — tanpa menunggu orang lain mengambil langkah pertama.",
  },
];

const ASSESSMENT_RESULTS = {
  high: {
    en: {
      title: "You are leading as an investor",
      body: "Your answers suggest that active trust investment is already part of how you lead. The risk at this level is subtle: the habits that built trust in one relationship can quietly become a formula. Look at the statement where you scored lowest. That is where your next growth is. Keep asking the question behind this module: have I done everything I can so this person can grow in trusting me?",
    },
    id: {
      title: "Kamu memimpin sebagai investor",
      body: "Jawabanmu menunjukkan bahwa investasi kepercayaan yang aktif sudah menjadi bagian dari caramu memimpin. Risikonya di level ini halus: kebiasaan yang membangun kepercayaan dalam satu hubungan bisa diam-diam menjadi rumus. Lihat pernyataan dengan nilai terendahmu. Di situlah pertumbuhanmu berikutnya. Terus tanyakan pertanyaan di balik modul ini: apakah aku sudah melakukan semua yang aku bisa agar orang ini bisa bertumbuh dalam mempercayai aku?",
    },
  },
  mid: {
    en: {
      title: "You are somewhere in between",
      body: "Your answers suggest a mix of active investment and passive assessment. That is where most leaders honestly are. The most useful next step is specific, not general: find your lowest score above, and treat that statement as your assignment for the coming weeks. The practical actions below give you a place to start.",
    },
    id: {
      title: "Kamu berada di antara keduanya",
      body: "Jawabanmu menunjukkan campuran antara investasi aktif dan penilaian pasif. Di situlah kebanyakan pemimpin sebenarnya berada. Langkah berikutnya yang paling berguna bersifat spesifik, bukan umum: temukan nilai terendahmu di atas, dan jadikan pernyataan itu sebagai tugasmu untuk minggu-minggu mendatang. Tindakan praktis di bawah memberimu tempat untuk memulai.",
    },
  },
  low: {
    en: {
      title: "You are mostly assessing, not yet investing",
      body: "Your answers suggest that trust in your team is currently something you evaluate more than something you build. That is not a verdict. It is the most common starting point, and naming it honestly is already the first move. Choose one relationship where trust feels thin and begin there. The practical actions below are designed for exactly this.",
    },
    id: {
      title: "Kamu lebih banyak menilai, belum berinvestasi",
      body: "Jawabanmu menunjukkan bahwa kepercayaan dalam timmu saat ini lebih merupakan sesuatu yang kamu evaluasi daripada sesuatu yang kamu bangun. Itu bukan vonis. Itu adalah titik awal yang paling umum, dan menamainya dengan jujur sudah merupakan langkah pertama. Pilih satu hubungan di mana kepercayaan terasa tipis dan mulailah dari sana. Tindakan praktis di bawah dirancang persis untuk ini.",
    },
  },
};

const REFLECTION_NOTE = {
  en: "There is no threshold to hit here. If several of your answers are lower than you would like, that is not a verdict — it is a starting point. The goal of this module is not a perfect score. It is one honest next step.",
  id: "Tidak ada ambang batas yang harus dicapai di sini. Jika beberapa jawabanmu lebih rendah dari yang kamu inginkan, itu bukan vonis — itu adalah titik awal. Tujuan modul ini bukan skor sempurna. Ini adalah satu langkah jujur berikutnya.",
};

type ScenarioData = {
  number: number;
  title: string;
  situation: string;
  leaderMove: string;
  whatHappened: string;
  insight: string;
};

const SCENARIO_CARDS: { en: ScenarioData; id: ScenarioData }[] = [
  {
    en: {
      number: 1,
      title: "“The One Who's Always Late”",
      situation: "A Dutch team leader is working with an Indonesian team member. The team member is consistently late to online meetings — 10 to 20 minutes. He is always apologetic when he arrives and always comes prepared with good input. But the leader is increasingly frustrated. In her culture, lateness is a signal — it says: this is not important to me, or I don't take this seriously.",
      leaderMove: "She addresses it directly in their next one-on-one. She tells him she values him but the consistent lateness is making it hard for her to trust his commitment. She expects it to stop.",
      whatHappened: "The team member is deeply hurt. He has been giving everything to this work. He has been juggling impossible demands on his time — family obligations, local network meetings, church responsibilities — all of which he sees as part of his full commitment to the community they are both trying to serve. Lateness, in his experience, has never been read as disrespect. It has always been accepted as a signal that he is a person with full responsibilities, not just a function. He goes quiet. The relationship cools.",
      insight: "The leader read the behaviour through her cultural lens and made a trust judgment based on what lateness means in her context. She was not wrong to name it. But she missed the chance to ask first: what does being on time mean here, and what is this person's situation? The trust breach was not caused by the lateness. It was caused by the judgment made without understanding.",
    },
    id: {
      number: 1,
      title: "“Yang Selalu Terlambat”",
      situation: "Seorang pemimpin tim dari Belanda bekerja dengan anggota tim dari Indonesia. Anggota tim itu secara konsisten terlambat untuk pertemuan online — 10 hingga 20 menit. Dia selalu meminta maaf ketika tiba dan selalu datang dengan masukan yang baik. Tapi pemimpin itu semakin frustrasi. Dalam budayanya, keterlambatan adalah sinyal — itu mengatakan: ini tidak penting bagiku, atau aku tidak menganggap ini serius.",
      leaderMove: "Dia mengatasinya secara langsung dalam sesi satu lawan satu berikutnya. Dia mengatakan bahwa dia menghargainya tetapi keterlambatan yang konsisten membuatnya sulit untuk mempercayai komitmennya. Dia berharap itu berhenti.",
      whatHappened: "Anggota tim itu sangat terluka. Dia telah memberikan segalanya untuk pekerjaan ini. Dia telah menyeimbangkan tuntutan waktu yang mustahil — kewajiban keluarga, pertemuan jaringan lokal, tanggung jawab gereja — yang semuanya dia lihat sebagai bagian dari komitmen penuhnya kepada komunitas yang keduanya coba layani. Keterlambatan, dalam pengalamannya, tidak pernah dibaca sebagai ketidakhormatan. Itu selalu diterima sebagai sinyal bahwa dia adalah orang dengan tanggung jawab penuh, bukan hanya fungsi. Dia diam. Hubungan itu mendingin.",
      insight: "Pemimpin membaca perilaku itu melalui lensa budayanya dan membuat penilaian kepercayaan berdasarkan apa arti keterlambatan dalam konteksnya. Dia tidak salah untuk menamakannya. Tapi dia melewatkan kesempatan untuk bertanya terlebih dahulu: apa arti ketepatan waktu di sini, dan apa situasi orang ini? Pelanggaran kepercayaan bukan disebabkan oleh keterlambatan. Itu disebabkan oleh penilaian yang dibuat tanpa pemahaman.",
    },
  },
  {
    en: {
      number: 2,
      title: "“Getting Things Done First”",
      situation: "A Western team leader is starting a new project with a team in the Philippines. He wants to move quickly. He sends a detailed project brief on day one, schedules a working meeting for day two, and puts the team on a shared task tracker. He is organised, efficient, and genuinely excited about the work.",
      leaderMove: "He leads the first meeting professionally and efficiently. He covers the plan, assigns responsibilities, sets milestones, and closes in 45 minutes. He feels good about the start.",
      whatHappened: "Over the following two weeks, the team delivers work — but communication drops significantly. Updates are minimal. Questions go unasked. In the team meeting, no one raises concerns, even when it is clear things are falling behind. The leader cannot figure out why such a capable team is performing below their evident ability.",
      insight: "In a high-affective-trust culture, the team needed to know the leader as a person before they could work openly with him. The first meeting should have included who he is, not just what the project is. Because there was no relational foundation, the team defaulted to safe compliance rather than genuine collaboration. They delivered what was asked — but they would not risk honesty without trust. The leader was not failing at the task. He was failing at the prerequisite.",
    },
    id: {
      number: 2,
      title: "“Menyelesaikan Pekerjaan Lebih Dulu”",
      situation: "Seorang pemimpin tim Barat memulai proyek baru dengan tim di Filipina. Dia ingin bergerak cepat. Dia mengirimkan brief proyek terperinci pada hari pertama, menjadwalkan pertemuan kerja untuk hari kedua, dan menempatkan tim di pelacak tugas bersama. Dia terorganisir, efisien, dan benar-benar bersemangat tentang pekerjaan itu.",
      leaderMove: "Dia memimpin pertemuan pertama secara profesional dan efisien. Dia membahas rencana, menugaskan tanggung jawab, menetapkan tonggak, dan menutup dalam 45 menit. Dia merasa baik tentang awal ini.",
      whatHappened: "Selama dua minggu berikutnya, tim menghasilkan pekerjaan — tetapi komunikasi menurun secara signifikan. Pembaruan minimal. Pertanyaan tidak diajukan. Dalam pertemuan tim, tidak ada yang mengangkat kekhawatiran, bahkan ketika jelas bahwa sesuatu tertinggal. Pemimpin tidak bisa memahami mengapa tim yang sangat mampu ini berkinerja di bawah kemampuan nyata mereka.",
      insight: "Dalam budaya kepercayaan afektif tinggi, tim perlu mengenal pemimpin sebagai manusia sebelum mereka bisa bekerja secara terbuka dengannya. Pertemuan pertama seharusnya mencakup siapa dia, bukan hanya apa proyeknya. Karena tidak ada fondasi relasional, tim beralih ke kepatuhan yang aman daripada kolaborasi yang tulus. Mereka menghasilkan apa yang diminta — tetapi mereka tidak mau mengambil risiko kejujuran tanpa kepercayaan. Pemimpin tidak gagal dalam tugasnya. Dia gagal pada prasyaratnya.",
    },
  },
  {
    en: {
      number: 3,
      title: "“We're All Christians Here”",
      situation: "A Korean church leader joins an international ministry team made up of people from Germany, Uganda, and the USA. Everyone on the team is a committed Christian. The team leader says in the first meeting: “We don't have to spend too much time getting to know each other — we're all family in Christ.” The assumption is that shared faith creates an instant relational foundation.",
      leaderMove: "He moves quickly to project assignments and spiritual goals. He brings strong theological conviction and visible personal integrity. He works hard, prays hard, and expects the same from everyone.",
      whatHappened: "The Ugandan team member struggles significantly. In his experience, shared faith is the reason you invest deeply in relationship — it is not a substitute for it. For him, calling each other “family in Christ” without actually building that family feels like using sacred language as a shortcut. He remains polite and committed, but he never opens up. The leader never knows what resources, perspectives, and concerns he is not hearing.",
      insight: "Shared Christian values can accelerate trust formation — but they do not substitute for the cultural work of actually building it. Faith provides a motive and a framework. It does not override the mechanisms by which different cultures build trust. A leader who says “we are family in Christ” and then skips the investment of actually becoming family has used theology to avoid relational work, not to deepen it.",
    },
    id: {
      number: 3,
      title: "“Kita Semua Orang Kristen di Sini”",
      situation: "Seorang pemimpin gereja dari Korea bergabung dengan tim pelayanan internasional yang terdiri dari orang-orang dari Jerman, Uganda, dan AS. Semua orang di tim adalah orang Kristen yang berkomitmen. Pemimpin tim berkata dalam pertemuan pertama: “Kita tidak perlu menghabiskan terlalu banyak waktu untuk saling mengenal — kita semua keluarga dalam Kristus.” Asumsinya adalah bahwa iman bersama menciptakan fondasi relasional yang instan.",
      leaderMove: "Dia bergerak cepat ke penugasan proyek dan tujuan spiritual. Dia membawa keyakinan teologis yang kuat dan integritas personal yang terlihat. Dia bekerja keras, berdoa keras, dan mengharapkan hal yang sama dari semua orang.",
      whatHappened: "Anggota tim dari Uganda mengalami kesulitan yang signifikan. Dalam pengalamannya, iman bersama adalah alasan untuk berinvestasi mendalam dalam hubungan — itu bukan penggantinya. Baginya, menyebut satu sama lain “keluarga dalam Kristus” tanpa benar-benar membangun keluarga itu terasa seperti menggunakan bahasa sakral sebagai jalan pintas. Dia tetap sopan dan berkomitmen, tetapi dia tidak pernah membuka diri. Pemimpin tidak pernah tahu sumber daya, perspektif, dan kekhawatiran apa yang tidak dia dengar.",
      insight: "Nilai-nilai Kristen bersama dapat mempercepat pembentukan kepercayaan — tetapi tidak menggantikan pekerjaan budaya untuk benar-benar membangunnya. Iman memberikan motif dan kerangka kerja. Itu tidak mengesampingkan mekanisme di mana budaya yang berbeda membangun kepercayaan. Seorang pemimpin yang berkata “kita adalah keluarga dalam Kristus” dan kemudian melewatkan investasi untuk benar-benar menjadi keluarga telah menggunakan teologi untuk menghindari pekerjaan relasional, bukan untuk mendalamkannya.",
    },
  },
];

const CHECKLIST = {
  thisWeek: {
    en: [
      "Identify one relationship in your team where trust feels thin — and name (to yourself, honestly) whether you have invested in that relationship in the way that makes sense to the other person.",
      "In your next significant interaction with a cross-cultural colleague, ask one question you would not normally ask — something about their situation, their family, or what is genuinely on their mind right now.",
      "Notice when you make a trust judgment today. Ask: am I evaluating this person through my cultural lens, or theirs?",
      "Read one team member's context this week — not their performance, but their life. What pressures are they carrying? What does “a good week” look like for them?",
      "If there is a relationship that has gone cold and you do not know why — send a message. Not to resolve anything. Just to stay present.",
    ],
    id: [
      "Identifikasi satu hubungan dalam timmu di mana kepercayaan terasa tipis — dan namai (untuk dirimu sendiri, dengan jujur) apakah kamu telah berinvestasi dalam hubungan itu dengan cara yang masuk akal bagi orang lain.",
      "Dalam interaksi penting berikutnya dengan rekan kerja lintas budaya, tanyakan satu pertanyaan yang biasanya tidak kamu tanyakan — sesuatu tentang situasi mereka, keluarga mereka, atau apa yang benar-benar ada di pikiran mereka saat ini.",
      "Perhatikan ketika kamu membuat penilaian kepercayaan hari ini. Tanyakan: apakah aku mengevaluasi orang ini melalui lensa budayaku, atau lensa mereka?",
      "Pelajari konteks satu anggota tim minggu ini — bukan kinerja mereka, tetapi kehidupan mereka. Tekanan apa yang mereka tanggung? Seperti apa “minggu yang baik” bagi mereka?",
      "Jika ada hubungan yang mendingin dan kamu tidak tahu mengapa — kirim pesan. Bukan untuk menyelesaikan apa pun. Hanya untuk tetap hadir.",
    ],
  },
  ongoing: {
    en: [
      "Before entering a new cross-cultural working relationship, clarify your own trust default. Are you primarily cognitive (task-based) or affective (relationship-based) in how you build trust? Neither is better — but knowing yourself is the first step.",
      "When you sense disengagement or distance, make inquiry the first move, not judgment. Ask what is happening in their life before concluding something about their commitment.",
      "Build relationship margin into your work schedule. Not as a bonus when time allows — as a non-negotiable component of how you lead cross-culturally.",
      "When trust breaks — and it will — resist the impulse to diagnose from a distance. If the relationship can bear it, ask directly: “I feel like something shifted between us. Can we talk about it?”",
      "Regularly ask yourself the harder question: not “do I trust my team?” but “have I done everything I can to give my team the conditions to trust me?”",
    ],
    id: [
      "Sebelum memasuki hubungan kerja lintas budaya baru, klarifikasi default kepercayaanmu sendiri. Apakah kamu terutama kognitif (berbasis tugas) atau afektif (berbasis hubungan) dalam cara kamu membangun kepercayaan? Tidak ada yang lebih baik — tetapi mengenal dirimu sendiri adalah langkah pertama.",
      "Ketika kamu merasakan ketidakterlibatan atau jarak, jadikan penyelidikan sebagai langkah pertama, bukan penilaian. Tanyakan apa yang terjadi dalam kehidupan mereka sebelum menyimpulkan sesuatu tentang komitmen mereka.",
      "Bangun margin hubungan ke dalam jadwal kerja kamu. Bukan sebagai bonus ketika ada waktu — sebagai komponen yang tidak dapat ditawar dari cara kamu memimpin lintas budaya.",
      "Ketika kepercayaan rusak — dan itu akan terjadi — tahan dorongan untuk mendiagnosis dari jarak jauh. Jika hubungan dapat menanggungnya, tanyakan secara langsung: “Aku merasa ada sesuatu yang berubah di antara kita. Bisakah kita membicarakannya?”",
      "Secara rutin tanyakan pada dirimu sendiri pertanyaan yang lebih sulit: bukan “apakah aku mempercayai timku?” tetapi “apakah aku sudah melakukan semua yang bisa aku lakukan untuk memberi timku kondisi untuk mempercayaiku?”",
    ],
  },
};

const KEY_TAKEAWAYS = [
  {
    en: {
      title: "The shift from assessing to investing.",
      body: "Most leaders carry the question “do I trust them?” as their default trust posture. This module challenges you to carry a different question instead: “Have I done everything I can to create the conditions where they can trust me?” That shift — from passive evaluator to active investor — is where cross-cultural trust work actually begins. It is also the harder posture to hold, because it puts the responsibility in your hands rather than theirs.",
    },
    id: {
      title: "Pergeseran dari menilai ke berinvestasi.",
      body: "Kebanyakan pemimpin membawa pertanyaan “apakah aku mempercayai mereka?” sebagai postur kepercayaan default mereka. Modul ini menantang kamu untuk membawa pertanyaan yang berbeda: “Apakah aku sudah melakukan semua yang bisa aku lakukan untuk menciptakan kondisi di mana mereka bisa mempercayaiku?” Pergeseran itu — dari penilai pasif ke investor aktif — adalah tempat pekerjaan kepercayaan lintas budaya sebenarnya dimulai. Ini juga postur yang lebih sulit untuk dipertahankan, karena menempatkan tanggung jawab di tanganmu daripada di tangan mereka.",
    },
  },
  {
    en: {
      title: "Know your own trust default.",
      body: "You have a cultural default for how trust forms — task-based (cognitive) or relationship-based (affective). Most people have never had to examine it because they have always worked with people who share it. Cross-cultural leadership changes that. The default itself is not the problem. Operating from it without awareness, in a context where others are operating from a different one, is where the invisible damage happens. Name yours. Then ask what it costs the people you lead.",
    },
    id: {
      title: "Kenali default kepercayaanmu sendiri.",
      body: "Kamu memiliki default budaya untuk bagaimana kepercayaan terbentuk — berbasis tugas (kognitif) atau berbasis hubungan (afektif). Kebanyakan orang tidak pernah harus memeriksanya karena mereka selalu bekerja dengan orang-orang yang berbagi default yang sama. Kepemimpinan lintas budaya mengubah itu. Default itu sendiri bukan masalahnya. Beroperasi darinya tanpa kesadaran, dalam konteks di mana orang lain beroperasi dari default yang berbeda, adalah tempat kerusakan tak kasat mata terjadi. Namai defaultmu. Kemudian tanyakan apa biayanya bagi orang-orang yang kamu pimpin.",
    },
  },
  {
    en: {
      title: "Take the first step before trust exists.",
      body: "The model is not “wait until trust is established, then invest.” The model — drawn from Jesus in John 13 and Paul in Acts 17 — is to invest first, from a place of security and clarity about who you are, before the relationship has proven itself. Not naively. Not without discernment. But genuinely. In the specific cultural language of the person in front of you, not just in your own. That is the investment that builds something real.",
    },
    id: {
      title: "Ambil langkah pertama sebelum kepercayaan ada.",
      body: "Modelnya bukan “tunggu sampai kepercayaan terbangun, baru berinvestasi.” Modelnya — yang diambil dari Yesus dalam Yohanes 13 dan Paulus dalam Kisah Para Rasul 17 — adalah berinvestasi lebih dulu, dari tempat keamanan dan kejelasan tentang siapa kamu, sebelum hubungan itu membuktikan dirinya. Bukan dengan naif. Bukan tanpa kebijaksanaan. Tapi dengan sungguh-sungguh. Dalam bahasa budaya spesifik dari orang yang ada di depanmu, bukan hanya dalam bahasamu sendiri. Itulah investasi yang membangun sesuatu yang nyata.",
    },
  },
];

/* ------------------------------- Sub-components ------------------------------- */

function ConceptCard({
  index,
  data,
  expanded,
  onToggle,
  lang,
}: {
  index: number;
  data: ConceptCardData;
  expanded: boolean;
  onToggle: (i: number) => void;
  lang: "en" | "id";
}) {
  return (
    <div
      onClick={() => onToggle(index)}
      style={{
        background: NAVY,
        border: "1px solid " + NAVY_BORDER,
        borderRadius: 12,
        padding: "1.5rem",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        alignSelf: "start",
        minHeight: 160,
      }}
    >
      <h3 style={{ fontFamily: FONT_BODY, fontSize: 20, fontWeight: 800, color: ORANGE, margin: "0 0 6px" }}>
        {data.name}
      </h3>
      <p style={{ fontFamily: FONT_HEADLINE, fontSize: 18, fontStyle: "italic", color: OFF_WHITE, margin: "0 0 12px", lineHeight: 1.5 }}>
        {data.subtitle}
      </p>

      {expanded && (
        <div id={`concept-card-panel-${index}`}>
          {data.sections.map((section, si) => {
            const isBreaks = si === 3;
            if (isBreaks) {
              return (
                <div key={si} style={{ background: CARD_DARK, borderRadius: 8, padding: "12px 16px", margin: "0 0 16px" }}>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 4px" }}>
                    {section.label}
                  </p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "oklch(75% 0.04 260)", fontStyle: "italic", lineHeight: 1.75, margin: 0 }}>
                    {section.body}
                  </p>
                </div>
              );
            }
            return (
              <div key={si}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 4px" }}>
                  {section.label}
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "oklch(80% 0.04 260)", lineHeight: 1.75, margin: "0 0 16px" }}>
                  {section.body}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(index);
        }}
        aria-expanded={expanded}
        aria-controls={`concept-card-panel-${index}`}
        style={{
          fontFamily: FONT_BODY,
          fontSize: 12,
          color: ORANGE,
          margin: "12px 0 0",
          fontWeight: 600,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          minHeight: 44,
          textAlign: "left",
        }}
      >
        {expanded
          ? lang === "id" ? "Tampilkan lebih sedikit ↑" : "Show less ↑"
          : lang === "id" ? "Tampilkan lebih banyak ↓" : "Show more ↓"}
      </button>
    </div>
  );
}

function ScenarioCard({
  index,
  data,
  revealed,
  onToggle,
  lang,
}: {
  index: number;
  data: ScenarioData;
  revealed: boolean;
  onToggle: (i: number) => void;
  lang: "en" | "id";
}) {
  const subLabel: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: ORANGE,
    margin: "16px 0 4px",
  };
  const subBody: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 15,
    color: BODY_TEXT,
    lineHeight: 1.8,
    margin: 0,
  };

  return (
    <div
      style={{
        background: OFF_WHITE,
        border: "1px solid " + LIGHT_GRAY,
        borderRadius: "0 12px 12px 0",
        borderLeft: "4px solid " + ORANGE,
        marginBottom: 24,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "1.5rem 1.75rem" }}>
        <h3 style={{ fontFamily: FONT_BODY, fontSize: 17, fontWeight: 800, color: NAVY, margin: "0 0 4px" }}>
          <span style={{ color: ORANGE }}>
            {lang === "id" ? `Skenario ${data.number} —` : `Scenario ${data.number} —`}
          </span>{" "}
          {data.title}
        </h3>

        <p style={subLabel}>{lang === "id" ? "Situasi" : "Situation"}</p>
        <p style={subBody}>{data.situation}</p>

        <p style={subLabel}>{lang === "id" ? "Langkah pemimpin" : "The leader's move"}</p>
        <p style={subBody}>{data.leaderMove}</p>

        <p style={subLabel}>{lang === "id" ? "Apa yang terjadi" : "What happened"}</p>
        <p style={subBody}>{data.whatHappened}</p>

        <button
          onClick={() => onToggle(index)}
          aria-expanded={revealed}
          aria-controls={`scenario-insight-panel-${index}`}
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            fontWeight: 700,
            color: NAVY,
            background: "none",
            border: "1px solid " + NAVY,
            padding: "10px 20px",
            borderRadius: 12,
            cursor: "pointer",
            marginTop: 16,
            minHeight: 44,
          }}
        >
          {revealed
            ? lang === "id" ? "Sembunyikan wawasan ↑" : "Hide insight ↑"
            : lang === "id" ? "Lihat wawasannya →" : "See the insight →"}
        </button>
      </div>

      {revealed && (
        <div id={`scenario-insight-panel-${index}`} style={{ background: LIGHT_GRAY, padding: "1.25rem 1.75rem", borderTop: "1px solid oklch(82% 0.008 80)" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>
            {lang === "id" ? "Wawasan" : "Insight"}
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
            {data.insight}
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Main component -------------------------------- */

type Props = {
  userPathway?: string | null;
  isSaved: boolean;
};

export default function BuildingTrustClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: "en" | "id" = ctxLang === "id" ? "id" : "en";

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [revealedScenarios, setRevealedScenarios] = useState<Set<number>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const t = (en: string, id: string) => (lang === "id" ? id : en);

  const handleSave = () => {
    if (saved || isPending) return;
    startTransition(async () => {
      await saveResourceToDashboard("building-trust-across-cultures");
      setSaved(true);
    });
  };

  const toggleScenario = (i: number) => {
    setRevealedScenarios((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleChecklistItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const prose: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(15px, 1.6vw, 17px)",
    color: BODY_TEXT,
    lineHeight: 1.85,
    marginBottom: 22,
  };
  const proseDark: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(15px, 1.6vw, 17px)",
    color: "oklch(80% 0.03 260)",
    lineHeight: 1.85,
    marginBottom: 22,
  };
  const scriptureStyle: CSSProperties = {
    fontFamily: FONT_HEADLINE,
    fontStyle: "italic",
    fontWeight: 600,
    color: ORANGE,
  };
  const eyebrow: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: ORANGE,
    marginBottom: 10,
  };

  return (
    <>
      <LangToggle />

      {/* 1 — Hero */}
      <div style={{ background: NAVY, padding: "clamp(64px, 10vw, 96px) 24px clamp(56px, 8vw, 80px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, marginBottom: 16 }}>
            {t("Cross-Cultural — Module", "Lintas Budaya — Modul")}
          </p>
          <h1 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.08, margin: "0 0 24px" }}>
            {t("Building Trust Across Cultures", "Membangun Kepercayaan Lintas Budaya")}
          </h1>
          <p style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(17px, 2.2vw, 22px)", fontStyle: "italic", color: "oklch(82% 0.03 260)", lineHeight: 1.65, maxWidth: 580, margin: "0 0 40px" }}>
            {HERO_SUBTITLE[lang]}
          </p>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: saved ? "oklch(35% 0.08 260)" : "transparent",
              color: "oklch(75% 0.04 260)",
              padding: "14px 28px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: FONT_BODY,
              border: "1px solid oklch(42% 0.08 260)",
              cursor: saved || isPending ? "default" : "pointer",
            }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {isPending
              ? t("Saving…", "Menyimpan…")
              : saved
                ? t("Saved to Dashboard", "Tersimpan di Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard")}
          </button>
        </div>
      </div>

      {/* 2 — Introduction */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, margin: "0 0 36px" }}>
            {t("The Foundation Under Everything", "Fondasi di Bawah Segalanya")}
          </h2>
          {INTRO_PARAS[lang].map((para, i) => (
            <p key={i} style={prose}>{para}</p>
          ))}
        </div>
      </div>

      {/* 3 — Learning Outcomes */}
      <div style={{ background: LIGHT_GRAY, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Learning Outcomes", "Tujuan Pembelajaran")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, color: NAVY, margin: "0 0 32px", lineHeight: 1.2 }}>
            {t("By the end of this module:", "Setelah menyelesaikan modul ini:")}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            {LEARNING_OUTCOMES[lang].map((outcome, i) => (
              <li key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: ORANGE, marginTop: 9, flexShrink: 0 }} />
                <p style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 400, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                  <strong style={{ fontWeight: 700, color: NAVY }}>{outcome.keyword}</strong>
                  {outcome.rest}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4 — Teaching */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, margin: "0 0 36px" }}>
            {t("Trust Is Not Universal", "Kepercayaan Bukan Sesuatu yang Universal")}
          </h2>
          {TEACHING_PARAS[lang].map((para, i) => (
            <p key={i} style={prose}>{para}</p>
          ))}
        </div>
      </div>

      {/* 5 — Concept Cards */}
      <div style={{ background: NAVY, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Two Trust Models", "Dua Model Kepercayaan")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.2, margin: "0 0 40px" }}>
            {t("Cognitive Trust vs. Affective Trust", "Kepercayaan Kognitif vs. Kepercayaan Afektif")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {CONCEPT_CARDS.map((card, i) => (
              <ConceptCard
                key={i}
                index={i}
                data={card[lang]}
                expanded={expandedCard === i}
                onToggle={(idx) => setExpandedCard(expandedCard === idx ? null : idx)}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 6 — Field Story */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ borderLeft: "4px solid " + ORANGE, paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }}>
            <p style={{ ...eyebrow, marginBottom: 8 }}>{t("Field Story", "Kisah Lapangan")}</p>
            <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.8vw, 32px)", fontStyle: "italic", fontWeight: 600, color: NAVY, lineHeight: 1.2, margin: "0 0 28px" }}>
              {t("“When the Door Closed”", "“Ketika Pintu Itu Tertutup”")}
            </h2>
            {FIELD_STORY_PARAS[lang].map((para, i) => (
              <p key={i} style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(16px, 1.9vw, 20px)", color: BODY_TEXT, lineHeight: 1.9, marginBottom: 20 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 7 — Self-Assessment */}
      <div style={{ background: LIGHT_GRAY, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Self-Assessment", "Penilaian Diri")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: NAVY, margin: "0 0 12px", lineHeight: 1.2 }}>
            {t("How are you building trust right now?", "Bagaimana kamu membangun kepercayaan saat ini?")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: "0 0 8px" }}>
            {t(
              "These five statements are not a test. They are a mirror. Read each one and mark where you honestly land on a scale of 1 to 5.",
              "Lima pernyataan ini bukan ujian. Ini adalah cermin. Baca masing-masing dan tandai di mana kamu benar-benar berada pada skala 1 hingga 5."
            )}
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: BODY_TEXT, margin: "0 0 36px" }}>
            {t(
              "1 = Rarely or never · 2 = Occasionally · 3 = Sometimes · 4 = Often · 5 = Consistently",
              "1 = Jarang atau tidak pernah · 2 = Sesekali · 3 = Kadang-kadang · 4 = Sering · 5 = Konsisten"
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {SELF_ASSESSMENT_ITEMS.map((item, i) => (
              <div key={i} style={{ background: OFF_WHITE, borderRadius: 12, padding: "24px 28px" }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: "0 0 16px" }}>
                  {item[lang]}
                </p>
                <div
                  role="group"
                  aria-label={t(`Rate statement ${i + 1} from 1 to 5`, `Beri nilai pernyataan ${i + 1} dari 1 sampai 5`)}
                  style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                >
                  {[1, 2, 3, 4, 5].map((n) => {
                    const selected = ratings[i] === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setRatings((prev) => ({ ...prev, [i]: n }))}
                        aria-pressed={selected}
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 14,
                          fontWeight: 700,
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          border: selected ? "1.5px solid " + NAVY : "1.5px solid " + NAVY_BORDER,
                          background: selected ? NAVY : "transparent",
                          color: selected ? OFF_WHITE : BODY_TEXT,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div aria-live="polite">
            {Object.keys(ratings).length === SELF_ASSESSMENT_ITEMS.length &&
              (() => {
                const total = Object.values(ratings).reduce((a, b) => a + b, 0);
                const band = total >= 20 ? "high" : total >= 13 ? "mid" : "low";
                const result = ASSESSMENT_RESULTS[band][lang];
                return (
                  <div style={{ background: NAVY, borderRadius: 12, padding: "28px 32px", marginTop: 32 }}>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(75% 0.13 45)", margin: "0 0 10px" }}>
                      {t("Your result", "Hasilmu")} · {total}/25
                    </p>
                    <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 600, color: OFF_WHITE, margin: "0 0 12px", lineHeight: 1.25 }}>
                      {result.title}
                    </h3>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "oklch(88% 0.008 80)", lineHeight: 1.75, margin: 0 }}>
                      {result.body}
                    </p>
                  </div>
                );
              })()}
          </div>

          <div style={{ background: "oklch(93% 0.008 80)", borderRadius: 10, padding: "20px 24px", margin: "32px 0 0", borderLeft: "3px solid " + ORANGE }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontStyle: "italic", color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
              {REFLECTION_NOTE[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* 8 — Scenario Cards */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Scenario Cards", "Kartu Skenario")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: NAVY, margin: "0 0 8px", lineHeight: 1.2 }}>
            {t("Three moments where trust broke down", "Tiga momen di mana kepercayaan runtuh")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: "0 0 36px" }}>
            {t("Read the situation, then reveal what happened and why.", "Baca situasinya, lalu ungkap apa yang terjadi dan mengapa.")}
          </p>
          {SCENARIO_CARDS.map((scenario, i) => (
            <ScenarioCard
              key={i}
              index={i}
              data={scenario[lang]}
              revealed={revealedScenarios.has(i)}
              onToggle={toggleScenario}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* 9 — Checklist */}
      <div style={{ background: LIGHT_GRAY, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Practical Action", "Tindakan Praktis")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: NAVY, margin: "0 0 40px", lineHeight: 1.2 }}>
            {t("Put it into practice", "Terapkan dalam tindakan")}
          </h2>

          {(["thisWeek", "ongoing"] as const).map((group, gi) => (
            <div key={group} style={{ marginTop: gi === 1 ? 40 : 0 }}>
              <h3 style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY, margin: "0 0 16px", paddingBottom: 8, borderBottom: "2px solid " + NAVY }}>
                {group === "thisWeek" ? t("This Week", "Minggu Ini") : t("Ongoing", "Berkelanjutan")}
              </h3>
              {CHECKLIST[group][lang].map((item, i) => {
                const key = `${group === "thisWeek" ? "w" : "o"}-${i}`;
                const checked = !!checkedItems[key];
                const isLast = i === CHECKLIST[group][lang].length - 1;
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      padding: "12px 0",
                      borderBottom: isLast ? "none" : "1px solid oklch(84% 0.008 80)",
                    }}
                  >
                    <button
                      onClick={() => toggleChecklistItem(key)}
                      aria-pressed={checked}
                      aria-label={item}
                      style={{
                        width: 44,
                        height: 44,
                        border: "none",
                        background: "transparent",
                        flexShrink: 0,
                        margin: "-10px -11px -11px -11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          border: checked ? "none" : "2px solid " + NAVY_BORDER,
                          background: checked ? ORANGE : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {checked && (
                          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                    </button>
                    <p
                      onClick={() => toggleChecklistItem(key)}
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 15,
                        color: checked ? "oklch(48% 0.04 260)" : BODY_TEXT,
                        lineHeight: 1.75,
                        cursor: "pointer",
                        flex: 1,
                        margin: 0,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 10 — Faith Anchor */}
      <div style={{ background: NAVY, padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 12 }}>{t("Faith Anchor", "Jangkar Iman")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(28px, 3.5vw, 44px)", fontStyle: "italic", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.15, margin: "0 0 36px" }}>
            {t("He Invested First", "Dia Berinvestasi Lebih Dahulu")}
          </h2>

          {lang === "id" ? (
            <>
              <p style={proseDark}>
                Ada godaan yang mengalir melalui pengajaran kepemimpinan Kristen tentang kepercayaan: langkah yang berkata “percayalah kepada Tuhan, karena itu percayalah kepada orang.” Kedengarannya benar. Terasa berdasar. Tapi ini adalah kesalahan kategori yang, jika dibiarkan tidak tertantang, menyiapkan para pemimpin untuk kekecewaan nyata.
              </p>
              <p style={proseDark}>
                Kepercayaan Tuhan adalah mutlak dan tanpa syarat. Dia tidak berubah. Dia tidak bisa gagal. Kesetiaan-Nya tidak bergantung pada perilaku kita, sejarah kita, atau budaya kita. Ketika <span style={scriptureStyle}>Amsal 3:5</span> berkata “percayalah kepada Tuhan dengan segenap hatimu,” itu berbicara tentang kategori kepercayaan yang tidak memiliki padanan manusiawi. Itu adalah satu-satunya kepercayaan yang tidak bisa salah tempat.
              </p>
              <p style={proseDark}>
                Kepercayaan manusia berbeda. Orang berubah. Konteks bergeser. Hubungan berlapis dengan sejarah, ekspektasi, asumsi budaya, dan luka. Kepercayaan manusia harus diperoleh, dibangun, dipelihara, dan kadang dibangun kembali dari nol. Itu tidak pernah otomatis. Dan dalam pengaturan lintas budaya, jalur di mana ia terbentuk tidak sama untuk semua orang. Mencampuradukkan keduanya — menggunakan kesetiaan mutlak Tuhan sebagai model untuk apa yang harus kamu harapkan dari atau tawarkan kepada orang lain — menghasilkan naivitas atau rasa bersalah yang palsu. Tidak ada yang melayani siapa pun.
              </p>
              <p style={proseDark}>Jangkar yang lebih baik bukan apa yang Tuhan itu. Ini adalah apa yang Yesus lakukan.</p>
              <p style={proseDark}>
                Dalam <span style={scriptureStyle}>Yohanes 13</span>, Yesus membasuh kaki murid-muridnya. Apa yang dikatakan teks itu sebelum tindakan itu sangat penting: “Yesus tahu bahwa Bapa telah menyerahkan segala sesuatu ke dalam tangannya dan bahwa ia datang dari Allah dan kembali kepada Allah.” Dia bertindak dari tempat keamanan yang lengkap. Dia tidak memerlukan murid-murid untuk mempercayainya terlebih dahulu. Dia tidak menahan investasi sampai hubungan itu terbukti. Dia melayani lebih dulu, dari kepastian tentang siapa dia dan milik siapa dia.
              </p>
              <p style={proseDark}>
                Inilah modelnya. Bukan “aku akan mempercayaimu ketika kamu mendapatkannya.” Tapi: “Aku akan berinvestasi padamu, dengan tulus dan praktis, sebelum kepercayaan terbangun — karena aku tahu siapa aku dan aku tahu apa yang aku dipanggil untuk lakukan.”
              </p>
              <p style={proseDark}>
                Paulus di Areopagus (<span style={scriptureStyle}>Kisah Para Rasul 17</span>) memperluas ini ke dalam penerapan lintas budaya. Dia memasuki Athena pada jarak budaya yang maksimal. Dia tidak mengimpor kerangka budayanya sendiri dan menuntut orang Athena untuk menyesuaikan diri. Dia mengamati. Dia menemukan mezbah untuk allah yang tidak dikenal — titik kesamaan yang tulus — dan dia membangun dari sana. Dia mendapatkan hak untuk berbicara sebelum dia berbicara.
              </p>
              <p style={proseDark}>
                Ini bukan strategi. Ini adalah inkarnasi yang diterapkan pada kepemimpinan. Firman itu menjadi daging — memasuki budaya, mempelajari bahasanya, bekerja dalam batasannya, dan mendapatkan kepercayaan dengan menjadi sungguh-sungguh hadir. Pemimpin lintas budaya yang ingin mengikuti Yesus tidak berdiri di tepi budaya dan memanggil orang-orang untuk datang. Mereka masuk. Mereka mengamati. Mereka menemukan kesamaan. Mereka berinvestasi sebelum mereka mengharapkan.
              </p>
              <p style={{ ...proseDark, marginBottom: 0 }}>
                Pertanyaannya bukan apakah Tuhan bisa dipercaya. Dia bisa, tanpa syarat. Pertanyaannya adalah apakah kamu telah menjadi jenis pemimpin — dalam konteks budaya spesifikmu, dengan orang-orang spesifik ini — yang telah memberikan timmu alasan apa pun untuk mempercayaimu.
              </p>
            </>
          ) : (
            <>
              <p style={proseDark}>
                There is a temptation that runs through Christian leadership teaching on trust: the move that says “trust God, therefore trust people.” It sounds right. It feels grounded. But it is a category error that, if left unchallenged, sets leaders up for real disappointment.
              </p>
              <p style={proseDark}>
                God's trustworthiness is absolute and unconditional. He does not change. He cannot fail. His faithfulness is not contingent on our behaviour, our history, or our culture. When <span style={scriptureStyle}>Proverbs 3:5</span> says “trust in the Lord with all your heart,” it is speaking of a category of trust that has no human equivalent. It is the only trust that cannot be misplaced.
              </p>
              <p style={proseDark}>
                Human trust is different. People change. Contexts shift. Relationships are layered with history, expectation, cultural assumption, and hurt. Human trust must be earned, built, tended to, and sometimes rebuilt from nothing. It is never automatic. And in cross-cultural settings, the paths by which it forms are not the same for everyone. Conflating the two — using God's absolute faithfulness as the model for what you should expect from or offer to other people — produces either naivety or false guilt. Neither serves anyone.
              </p>
              <p style={proseDark}>The better anchor is not what God is. It is what Jesus did.</p>
              <p style={proseDark}>
                In <span style={scriptureStyle}>John 13</span>, Jesus washes his disciples' feet. What the text says before that act matters enormously: “Jesus knew that the Father had put all things under his power, and that he had come from God and was returning to God.” He acted from a place of complete security. He did not need the disciples to trust him first. He did not withhold investment until the relationship was proven. He served first, from certainty about who he was and whose he was.
              </p>
              <p style={proseDark}>
                This is the model. Not “I will trust you when you earn it.” But: “I will invest in you, genuinely and practically, before trust has been established — because I know who I am and I know what I am called to do.”
              </p>
              <p style={proseDark}>
                Paul at the Areopagus (<span style={scriptureStyle}>Acts 17</span>) extends this into cross-cultural application. He enters Athens at maximum cultural distance. He does not import his own cultural frame and demand that the Athenians adjust. He observes. He finds the altar to the unknown God — a point of genuine common ground — and he builds from there. He earns the right to speak before he speaks.
              </p>
              <p style={proseDark}>
                This is not strategy. This is incarnation applied to leadership. The Word became flesh — entered the culture, learned its language, worked within its constraints, and earned trust by being genuinely present. The cross-cultural leader who wants to follow Jesus does not stand at the edge of the culture and call people over. They go in. They observe. They find the common ground. They invest before they expect.
              </p>
              <p style={{ ...proseDark, marginBottom: 0 }}>
                The question is not whether God is trustworthy. He is, without condition. The question is whether you have been the kind of leader — in your specific cultural context, with these specific people — who has given your team any reason to trust you.
              </p>
            </>
          )}
        </div>
      </div>

      {/* 11 — Key Takeaway */}
      <div style={{ background: OFF_WHITE, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>{t("Key Takeaways", "Poin Utama")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: NAVY, margin: "0 0 40px", lineHeight: 1.2 }}>
            {t("Three things worth holding from this module:", "Tiga hal yang layak dibawa dari modul ini:")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {KEY_TAKEAWAYS.map((takeaway, i) => (
              <div key={i} style={{ background: LIGHT_GRAY, borderRadius: 12, padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                <span style={{ fontFamily: FONT_HEADLINE, fontSize: 52, fontWeight: 700, color: ORANGE, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 800, color: NAVY, marginTop: 0, marginBottom: 8 }}>
                    {takeaway[lang].title}
                  </h3>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                    {takeaway[lang].body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
