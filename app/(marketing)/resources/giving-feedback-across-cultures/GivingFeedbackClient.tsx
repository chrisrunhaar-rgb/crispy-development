"use client";
import { useState, useTransition, useEffect, useRef, type CSSProperties } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/LangToggle";
import { saveResourceToDashboard } from "../actions";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY       = "oklch(22% 0.10 260)";
const ORANGE     = "oklch(65% 0.15 45)";
const OFF_WHITE  = "oklch(96% 0.005 80)";
const LIGHT_GRAY = "oklch(88% 0.008 80)";
const BODY_TEXT  = "oklch(38% 0.05 260)";
const CARD_DARK  = "oklch(16% 0.08 260)";
const NAVY_BORDER = "oklch(35% 0.10 260)";

const FONT_HEADLINE = "'Cormorant Garamond', serif";
const FONT_BODY     = "'Montserrat', sans-serif";

// ─── Reusable styles ──────────────────────────────────────────────────────────
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
const eyebrow: CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: ORANGE,
  marginBottom: 10,
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = "en" | "id";
type Props = { isSaved: boolean; [key: string]: unknown };

// ─── Section 1 opening vignette paragraphs ────────────────────────────────────
const VIGNETTE_PARAS: Record<Lang, string[]> = {
  en: [
    "Markus sent the email at 8:47 on a Tuesday morning. He had been a manager for eleven years and had delivered hard feedback hundreds of times. The words felt clear, direct, and fair.",
    "\u201cThe analysis in last week’s report was shallow. The conclusions were unsupported by the data. This is not the standard we need.\u201d",
    "He sent it to three people simultaneously. Different time zones, different team leads, different cultural backgrounds. Same email, word for word.",
    "In Munich, Claudia read the message, noted the specific critique, and sent back a revised analysis before lunch. She was mildly annoyed that it had taken her two hours to work through her initial defensiveness — but the feedback was clear, the problem was named, and she fixed it. That is what feedback is for. She respected Markus for being direct.",
    "In Seoul, Jiyeon read the same email and went very still. She read it three times. Then she closed her laptop and did not open it again until after five o’clock. She did not mention it to her team. The following Monday she submitted a revised report without a word about what had changed. Three weeks later, Markus learned through a colleague that Jiyeon had applied for a transfer within the month after receiving his message. She never raised the incident. When her manager asked, she said everything was fine.",
    "In São Paulo, Rafael read the email and immediately picked up the phone to call a mutual colleague. Not to complain — to understand. Was Markus angry? Was this serious? Was the relationship okay? He needed to read the relational temperature before he could read the professional critique. When the colleague reassured him that Markus liked his work and this was just direct Northern European style, Rafael laughed, relaxed, and turned in a revised draft that afternoon. The correction landed — but only after the relational context had been re-established.",
    "One message. Three people. Three completely different experiences of the same words.",
    "Claudia received a piece of useful professional information. Jiyeon experienced something closer to public humiliation — the written record felt permanent, the lack of private relationship-building felt like a signal about her standing, and the absence of any pathway to restored dignity made the correction more damaging than any benefit it might have offered. Rafael experienced a relational alarm before he could receive a professional message, and needed the relational channel to stay open before the content could come through.",
    "None of these responses are wrong. They are all reasonable people responding to the same stimulus through the logic system their culture gave them. And Markus, who thought he had communicated clearly, had actually communicated three different things — depending on who was reading.",
    "This is the core problem with feedback across cultural difference. The words are not neutral. The format is not neutral. The channel, the timing, the presence or absence of relationship-building preamble, the degree of specificity, the use of written versus spoken delivery — every one of these carries a cultural signal that changes what the recipient hears. A piece of feedback is not just the content inside it. It is the entire delivery system, and different delivery systems produce different results in different people.",
    "The good news is that this is a skill. You can learn to read the cultural register you are delivering into. You can learn which parts of your delivery style are actually working against you. And you can learn to translate a true message into a form that travels all the way to the person it was meant for.",
    "That is what this module is for.",
  ],
  id: [
    "Markus mengirim email itu pukul 8:47 pada Selasa pagi. Ia telah menjadi manajer selama sebelas tahun dan telah menyampaikan umpan balik yang sulit ratusan kali. Kata-katanya terasa jelas, langsung, dan adil.",
    "\u201cAnalisis dalam laporan minggu lalu dangkal. Kesimpulan-kesimpulannya tidak didukung oleh data. Ini bukan standar yang kita butuhkan.\u201d",
    "Ia mengirimnya ke tiga orang sekaligus. Zona waktu berbeda, pemimpin tim berbeda, latar belakang budaya berbeda. Email yang sama, kata per kata.",
    "Di Munich, Claudia membaca pesan itu, mencatat kritik spesifiknya, dan mengirimkan kembali analisis yang direvisi sebelum makan siang. Ia sedikit kesal karena butuh dua jam untuk melewati rasa defensifnya yang awal — tetapi umpan baliknya jelas, masalahnya disebutkan, dan ia memperbaikinya. Itulah gunanya umpan balik. Ia menghormati Markus karena bersikap langsung.",
    "Di Seoul, Jiyeon membaca email yang sama dan menjadi sangat diam. Ia membacanya tiga kali. Kemudian ia menutup laptopnya dan tidak membukanya lagi hingga setelah pukul lima sore. Ia tidak menyebutkannya kepada timnya. Senin berikutnya ia menyerahkan laporan yang direvisi tanpa sepatah kata tentang apa yang telah berubah. Tiga minggu kemudian, Markus mengetahui melalui seorang rekan bahwa Jiyeon telah mengajukan mutasi dalam sebulan setelah menerima pesannya. Ia tidak pernah mengangkat kejadian itu. Ketika manajernya bertanya, ia berkata semuanya baik-baik saja.",
    "Di São Paulo, Rafael membaca email itu dan segera mengangkat telepon untuk menghubungi rekan bersama. Bukan untuk mengeluh — tetapi untuk memahami. Apakah Markus marah? Apakah ini serius? Apakah hubungan mereka baik-baik saja? Ia perlu membaca suhu relasional sebelum bisa membaca kritik profesional tersebut. Ketika rekan itu meyakinkannya bahwa Markus menyukai pekerjaannya dan ini hanyalah gaya langsung orang Eropa Utara, Rafael tertawa, santai, dan menyerahkan draf revisi pada sore itu. Koreksi itu sampai — tetapi hanya setelah konteks relasional dipulihkan kembali.",
    "Satu pesan. Tiga orang. Tiga pengalaman yang sepenuhnya berbeda dari kata-kata yang sama.",
    "Claudia menerima sepotong informasi profesional yang berguna. Jiyeon mengalami sesuatu yang lebih mendekati penghinaan publik — catatan tertulis itu terasa permanen, ketiadaan pembangunan hubungan pribadi terasa seperti sinyal tentang kedudukannya, dan ketiadaan jalan apa pun menuju pemulihan martabat membuat koreksi itu lebih merusak daripada manfaat apa pun yang mungkin ditawarkannya. Rafael mengalami alarm relasional sebelum bisa menerima pesan profesional, dan membutuhkan saluran relasional tetap terbuka sebelum konten bisa masuk.",
    "Tidak ada dari respons-respons ini yang salah. Mereka semua adalah orang-orang yang masuk akal yang merespons stimulus yang sama melalui sistem logika yang diberikan budaya mereka. Dan Markus, yang mengira telah berkomunikasi dengan jelas, sebenarnya telah mengomunikasikan tiga hal yang berbeda — tergantung siapa yang membaca.",
    "Inilah masalah inti dari umpan balik lintas perbedaan budaya. Kata-katanya tidak netral. Formatnya tidak netral. Saluran, waktu, ada atau tidaknya basa-basi relasional, tingkat kekhususan, penggunaan penyampaian tertulis versus lisan — setiap salah satu dari ini membawa sinyal budaya yang mengubah apa yang didengar oleh penerima. Sepotong umpan balik bukan hanya konten di dalamnya. Ini adalah keseluruhan sistem penyampaian, dan sistem penyampaian yang berbeda menghasilkan hasil yang berbeda pada orang yang berbeda.",
    "Kabar baiknya adalah ini adalah sebuah keterampilan. Kamu bisa belajar membaca register budaya yang kamu sampaikan ke dalamnya. Kamu bisa belajar bagian mana dari gaya penyampaianmu yang sebenarnya bekerja melawanmu. Dan kamu bisa belajar menerjemahkan pesan yang benar ke dalam bentuk yang sampai sepenuhnya kepada orang yang dimaksudkan.",
    "Itulah tujuan modul ini.",
  ],
};

// ─── Section 2 teaching paragraphs ───────────────────────────────────────────
const S2_PARAS: Record<Lang, string[]> = {
  en: [
    "There is a common assumption among leaders working across cultures: if you know whether someone is from a high-context or low-context culture, you know how to give them feedback. More context, more indirectness. Less context, more directness. Simple.",
    "The assumption is wrong — and getting it wrong produces some of the most predictable intercultural friction in global teams.",
    "The distinction between high-context and low-context communication comes from anthropologist Edward T. Hall, who noted in the 1950s and 1970s that cultures differ fundamentally in how much meaning is carried by explicit words versus the surrounding context — the relationship, the setting, shared history, non-verbal signals. In high-context cultures (prevalent across much of Asia, Africa, and the Middle East), meaning is layered and relational. Silence carries weight. What is left unsaid is often more significant than what is spoken. In low-context cultures (Germany, Scandinavia, the Netherlands, the United States), meaning is encoded explicitly in the words. Say what you mean. Mean what you say. Ambiguity is a problem to be solved.",
    "This is genuinely useful as a starting map. But Erin Meyer, who teaches organizational behavior at INSEAD, identified something that Hall’s single-axis model could not show: the way you communicate and the way you give feedback are two separate things, and they move independently of each other.",
    "Meyer calls these the Communicating scale and the Evaluating scale — and the gap between them is where confusion lives.",
    "The Communicating scale measures how much meaning is carried implicitly versus explicitly. The Evaluating scale measures how directly negative feedback is delivered — whether criticism is stated plainly or softened, hedged, and wrapped in layers of relational context.",
    "Here is what makes this important: these two dials do not move together.",
    "The French are textbook high-context communicators — layered, allusive, where subtext and intellectual nuance carry much of the meaning. Yet when a French professional thinks your work is inadequate, they will often tell you so in terms that leave no ambiguity. France sits on the direct end of the Evaluating scale, even as it sits at the indirect end of the Communicating scale.",
    "Americans, by contrast, are strongly low-context communicators. American business culture prizes explicitness — say it plainly, be clear, avoid ambiguity. Yet American professional feedback culture is famously soft. The \u201cfeedback sandwich\u201d — positive, critical, positive — is an American invention. American managers routinely wrap difficult assessments in so much encouragement that the critique itself gets lost. The United States is a low-context communicator that delivers highly indirect negative feedback.",
    "A Dutch engineer working with a French colleague may assume: \u201cwe both communicate plainly, so we share the same feedback culture.\u201d They do not. The Dutch engineer will deliver feedback bluntly and expect it to be received professionally. The French colleague will deliver feedback with rhetorical sophistication that the Dutch engineer mistakes for politeness and the French colleague intends as precision.",
    "An American manager working with a Japanese colleague may assume: \u201cwe are both indirect, so we are on the same page.\u201d They are not — the American is indirect about criticism in order to preserve the relationship; the Japanese professional is indirect as a structural feature of how truth is communicated at all, and the signals the American is missing are not softening devices but primary communication.",
    "This is why the two-dial model matters. The question is not just \u201cis this a high-context culture?\u201d The question is \u201cwhat is the Evaluating scale here — and is that different from my assumption?\u201d",
    "Look at your own culture on both spectra. Then look at the cultures you work with most. The gap between those positions — not just on one scale but on both — is where your feedback is getting lost.",
  ],
  id: [
    "Ada asumsi umum di kalangan pemimpin yang bekerja lintas budaya: jika kamu tahu apakah seseorang berasal dari budaya berkonteks tinggi atau rendah, kamu tahu cara memberi mereka umpan balik. Lebih banyak konteks, lebih banyak ketidaklangsungan. Lebih sedikit konteks, lebih langsung. Sederhana.",
    "Asumsi itu salah — dan salah dalam hal ini menghasilkan beberapa gesekan antarbudaya yang paling dapat diprediksi dalam tim global.",
    "Perbedaan antara komunikasi berkonteks tinggi dan rendah berasal dari antropolog Edward T. Hall, yang mencatat pada 1950-an dan 1970-an bahwa budaya berbeda secara fundamental dalam seberapa banyak makna dibawa oleh kata-kata eksplisit versus konteks sekitarnya — hubungan, setting, sejarah bersama, sinyal non-verbal. Dalam budaya berkonteks tinggi (umum di sebagian besar Asia, Afrika, dan Timur Tengah), makna berlapis dan relasional. Keheningan memiliki bobot. Apa yang tidak dikatakan sering kali lebih signifikan dari apa yang diucapkan. Dalam budaya berkonteks rendah (Jerman, Skandinavia, Belanda, Amerika Serikat), makna dikodekan secara eksplisit dalam kata-kata. Katakan apa yang kamu maksud. Maksudkan apa yang kamu katakan. Ambiguitas adalah masalah yang harus dipecahkan.",
    "Ini sungguh berguna sebagai peta awal. Tetapi Erin Meyer, yang mengajar perilaku organisasi di INSEAD, mengidentifikasi sesuatu yang tidak bisa ditunjukkan oleh model satu sumbu Hall: cara kamu berkomunikasi dan cara kamu memberi umpan balik adalah dua hal yang terpisah, dan keduanya bergerak secara independen satu sama lain.",
    "Meyer menyebut ini skala Komunikasi dan skala Evaluasi — dan kesenjangan di antara keduanya adalah tempat kebingungan berada.",
    "Skala Komunikasi mengukur seberapa banyak makna dibawa secara implisit versus eksplisit. Skala Evaluasi mengukur seberapa langsung umpan balik negatif disampaikan — apakah kritik dinyatakan terang-terangan atau dilembutkan, dilindungi, dan dibungkus dalam lapisan konteks relasional.",
    "Inilah yang membuat ini penting: kedua skala ini tidak bergerak bersama.",
    "Orang Prancis adalah komunikator berkonteks tinggi yang tekstual — berlapis, allusif, di mana subteks dan nuansa intelektual membawa banyak makna. Namun ketika seorang profesional Prancis menganggap pekerjaan kamu tidak memadai, mereka sering akan memberitahukannya dalam istilah yang tidak meninggalkan ambiguitas. Prancis berada di ujung langsung pada skala Evaluasi, meskipun berada di ujung tidak langsung pada skala Komunikasi.",
    "Sebaliknya, orang Amerika adalah komunikator berkonteks rendah yang kuat. Budaya bisnis Amerika menghargai keeksplisitan — katakan dengan jelas, bersikaplah jelas, hindari ambiguitas. Namun budaya umpan balik profesional Amerika terkenal lembut. \u201cFeedback sandwich\u201d — positif, kritis, positif — adalah penemuan Amerika. Manajer Amerika secara rutin membungkus penilaian yang sulit dalam begitu banyak dorongan sehingga kritik itu sendiri hilang. Amerika Serikat adalah komunikator berkonteks rendah yang menyampaikan umpan balik negatif yang sangat tidak langsung.",
    "Seorang insinyur Belanda yang bekerja dengan kolega Prancis mungkin berasumsi: \u201ckita berdua berkomunikasi dengan jelas, jadi kita memiliki budaya umpan balik yang sama.\u201d Mereka tidak. Insinyur Belanda akan menyampaikan umpan balik secara blak-blakan dan mengharapkannya diterima secara profesional. Kolega Prancis akan menyampaikan umpan balik dengan kecanggihan retoris yang disalahartikan oleh insinyur Belanda sebagai kesopanan dan yang dimaksud oleh kolega Prancis sebagai presisi.",
    "Seorang manajer Amerika yang bekerja dengan kolega Jepang mungkin berasumsi: \u201ckita berdua tidak langsung, jadi kita pada halaman yang sama.\u201d Mereka tidak — orang Amerika tidak langsung tentang kritik untuk menjaga hubungan; profesional Jepang tidak langsung sebagai fitur struktural dari bagaimana kebenaran dikomunikasikan sama sekali, dan sinyal yang dilewatkan oleh orang Amerika bukan perangkat pelembut tetapi komunikasi primer.",
    "Inilah mengapa model dua skala penting. Pertanyaannya bukan hanya \u201capakah ini budaya berkonteks tinggi?\u201d Pertanyaannya adalah \u201capa skala Evaluasi di sini — dan apakah itu berbeda dari asumsi saya?\u201d",
    "Lihatlah budayamu sendiri pada kedua spektrum. Kemudian lihatlah budaya yang paling banyak kamu kerjakan. Kesenjangan antara posisi-posisi tersebut — bukan hanya pada satu skala tetapi pada keduanya — adalah tempat umpan balikmu hilang.",
  ],
};

// ─── Section 3 upgrader/downgrader table ─────────────────────────────────────
const UDRG_TABLE = {
  headers: {
    en: ["Culture", "Evaluating Scale Position", "Typical Feedback Language", "Example"],
    id: ["Budaya", "Posisi Skala Evaluasi", "Bahasa Umpan Balik Umum", "Contoh"],
  },
  rows: [
    {
      culture: { en: "Germany", id: "Jerman" },
      pos: { en: "Very direct", id: "Sangat langsung" },
      lang: { en: "Upgraders, plain declaratives", id: "Penguat, deklaratif polos" },
      example: { en: "“This is completely wrong. The data does not support the conclusion.”", id: "“Ini sepenuhnya salah. Data tidak mendukung kesimpulan.”" },
    },
    {
      culture: { en: "Netherlands", id: "Belanda" },
      pos: { en: "Very direct", id: "Sangat langsung" },
      lang: { en: "Upgraders, matter-of-fact", id: "Penguat, lugas" },
      example: { en: "“This is not what we asked for. It needs to be redone entirely.”", id: "“Ini bukan yang kami minta. Ini perlu dibuat ulang sepenuhnya.”" },
    },
    {
      culture: { en: "Israel", id: "Israel" },
      pos: { en: "Very direct", id: "Sangat langsung" },
      lang: { en: "Upgraders, confrontational warmth", id: "Penguat, kehangatan konfrontatif" },
      example: { en: "“I'll be straight with you -- this doesn't work. Let's fix it together.”", id: "“Saya akan berbicara jujur denganmu -- ini tidak berhasil. Mari kita perbaiki bersama.”" },
    },
    {
      culture: { en: "Australia", id: "Australia" },
      pos: { en: "Moderately direct", id: "Cukup langsung" },
      lang: { en: "Mild upgraders, informal", id: "Penguat ringan, informal" },
      example: { en: "“Yeah, this one's not quite there. The main issue is the analysis section.”", id: "“Ya, yang ini belum cukup. Masalah utamanya adalah bagian analisis.”" },
    },
    {
      culture: { en: "United States", id: "Amerika Serikat" },
      pos: { en: "Indirect", id: "Tidak langsung" },
      lang: { en: "Downgraders wrapped in positives", id: "Pelembut dibungkus hal positif" },
      example: { en: "“There are some really interesting ideas here. I do wonder if the analysis section could be developed a little more?”", id: "“Ada beberapa ide yang sangat menarik di sini. Saya bertanya-tanya apakah bagian analisis bisa dikembangkan sedikit lagi?”" },
    },
    {
      culture: { en: "United Kingdom", id: "Inggris" },
      pos: { en: "Indirect (heavily coded)", id: "Tidak langsung (berkode)" },
      lang: { en: "Heavy downgraders, understatement", id: "Pelembut kuat, understatement" },
      example: { en: "“I'm not sure this is quite ready yet. There might be one or two areas worth revisiting.”", id: "“Saya tidak yakin ini sudah cukup siap. Mungkin ada satu atau dua area yang layak ditinjau ulang.”" },
    },
    {
      culture: { en: "Brazil", id: "Brasil" },
      pos: { en: "Moderately indirect", id: "Cukup tidak langsung" },
      lang: { en: "Relationship-first framing", id: "Bingkai relasi terlebih dahulu" },
      example: { en: "“I really appreciate the effort on this -- I think we might want to look at the analysis together before we send it.”", id: "“Saya benar-benar menghargai upaya dalam hal ini -- saya pikir kita mungkin ingin melihat analisisnya bersama sebelum mengirimkannya.”" },
    },
    {
      culture: { en: "Kenya", id: "Kenya" },
      pos: { en: "Indirect with relational warmth", id: "Tidak langsung dengan kehangatan relasional" },
      lang: { en: "Indirect, community-impact framing", id: "Tidak langsung, bingkai dampak komunitas" },
      example: { en: "“The team will need to see a stronger analysis before we can move forward. How can we support you in that?”", id: "“Tim perlu melihat analisis yang lebih kuat sebelum kita bisa melanjutkan. Bagaimana kita bisa mendukungmu dalam hal itu?”" },
    },
    {
      culture: { en: "Japan", id: "Jepang" },
      pos: { en: "Highly indirect", id: "Sangat tidak langsung" },
      lang: { en: "Strong downgraders, extensive hedging, silence", id: "Pelembut kuat, banyak perlindungan, keheningan" },
      example: { en: "“I wonder if perhaps there might be some areas that could potentially benefit from a little more... consideration.” (followed by silence)", id: "“Saya bertanya-tanya apakah mungkin ada beberapa area yang berpotensi mendapat manfaat dari sedikit lebih banyak... pertimbangan.” (diikuti keheningan)" },
    },
    {
      culture: { en: "South Korea", id: "Korea Selatan" },
      pos: { en: "Highly indirect", id: "Sangat tidak langsung" },
      lang: { en: "Downgraders, hierarchy-sensitive", id: "Pelembut, peka hierarki" },
      example: { en: "Correction typically delivered privately through a trusted senior intermediary, or signaled through reduced eye contact and a brief pause.", id: "Koreksi biasanya disampaikan secara pribadi melalui perantara senior terpercaya, atau disinyalkan melalui kontak mata yang berkurang dan jeda singkat." },
    },
    {
      culture: { en: "Indonesia", id: "Indonesia" },
      pos: { en: "Highly indirect", id: "Sangat tidak langsung" },
      lang: { en: "Downgraders, basa basi preamble, private setting", id: "Pelembut, basa-basi, setting pribadi" },
      example: { en: "Extended relational preamble, then: “Perhaps this section could be strengthened a little before we finalize it?” Often spread across multiple conversations.", id: "Basa-basi relasional yang panjang, lalu: “Mungkin bagian ini bisa diperkuat sedikit sebelum kita finalisasi?” Sering tersebar dalam beberapa percakapan." },
    },
  ],
};

// ─── Section 3 Reframe Tool data ─────────────────────────────────────────────
const REFRAME_ROUNDS = [
  {
    num: 1,
    title: { en: "German to Japanese register", id: "Register Jerman ke Jepang" },
    ctx: { en: "Germany → Japan", id: "Jerman → Jepang" },
    scenarioLabel: { en: "The feedback as given:", id: "Umpan balik yang diberikan:" },
    scenario: {
      en: `"This report is completely unacceptable. The analysis is shallow and the conclusions are unsupported by the data. This is entirely not the standard we require."`,
      id: `"Laporan ini sepenuhnya tidak dapat diterima. Analisisnya dangkal dan kesimpulan-kesimpulannya tidak didukung oleh data. Ini sama sekali bukan standar yang kami butuhkan."`,
    },
    instruction: {
      en: "Rewrite this for a Japanese colleague using downgraders and face-preserving framing.",
      id: "Tulis ulang ini untuk kolega Jepang menggunakan pelembut dan bingkai yang menjaga muka.",
    },
    reframe: {
      en: `"Thank you for the time you put into this draft. I wonder if this section might benefit from a little more development in the analysis — perhaps we could look at it together before the final version goes out? I want to make sure it reflects the quality I know you're capable of."`,
      id: `"Terima kasih atas waktu yang kamu curahkan untuk draf ini. Saya bertanya-tanya apakah bagian ini mungkin mendapat manfaat dari sedikit lebih banyak pengembangan dalam analisis — mungkin kita bisa melihatnya bersama sebelum versi final keluar? Saya ingin memastikannya mencerminkan kualitas yang saya tahu kamu mampu capai."`,
    },
    explanationLabel: { en: "What changed and why:", id: "Apa yang berubah dan mengapa:" },
    explanation: {
      en: `The original contained three upgraders: "completely," "entirely," and the declarative "is not the standard." Each of these operates as a finality signal — they close the door on response or recovery. The suggested reframe removes all three. It replaces the declarative verdict with a question ("I wonder if...") — this is a classic downgrader that softens the signal without making it dishonest. The phrase "might benefit" is a further downgrader; compare it to the original's "is shallow."\n\nThe opening move ("Thank you for the time...") is not flattery — it is the relational preamble that creates space for the critique to be received. In Japanese professional culture, the absence of this preamble signals social aggression. The reframe also includes an offer to work on it together ("perhaps we could look at it together") — this keeps the relationship intact and provides a face-preserving path forward. And the close ("the quality I know you're capable of") signals that the manager's assessment is of the work, not of the person.\n\nThe truth is the same. The analysis needs to be redone. But this version can actually travel all the way to the person it was sent to.`,
      id: `Teks asli mengandung tiga penguat: "sepenuhnya," "sama sekali," dan deklaratif "bukan standar." Masing-masing berfungsi sebagai sinyal finalitas — mereka menutup pintu respons atau pemulihan. Saran reframe menghapus ketiganya. Ini menggantikan vonis deklaratif dengan pertanyaan ("Saya bertanya-tanya apakah...") — ini adalah pelembut klasik yang melembutkan sinyal tanpa membuatnya tidak jujur. Frasa "mungkin mendapat manfaat" adalah pelembut lebih lanjut; bandingkan dengan "dangkal" dalam teks asli.\n\nGerakan pembuka ("Terima kasih atas waktu...") bukan sanjungan — ini adalah basa-basi relasional yang menciptakan ruang bagi kritik untuk diterima. Dalam budaya profesional Jepang, ketiadaan basa-basi ini menandakan agresi sosial. Reframe juga mencakup tawaran untuk mengerjakannya bersama ("mungkin kita bisa melihatnya bersama") — ini menjaga hubungan tetap utuh dan memberikan jalan ke depan yang menjaga muka. Dan penutupnya ("kualitas yang saya tahu kamu mampu capai") memberi sinyal bahwa penilaian manajer adalah tentang pekerjaan, bukan tentang orangnya.\n\nKebenarannya sama. Analisis perlu dibuat ulang. Tetapi versi ini benar-benar bisa sampai ke orang yang dituju.`,
    },
  },
  {
    num: 2,
    title: { en: "Indirect to accountable", id: "Tidak langsung ke akuntabel" },
    ctx: { en: "East Africa → Universal", id: "Afrika Timur → Universal" },
    scenarioLabel: { en: "The feedback as given:", id: "Umpan balik yang diberikan:" },
    scenario: {
      en: `"We may want to think about how we approach the reporting process going forward. Some people have noticed that it can be a challenge sometimes, and it might be good to look at how we can improve things as a team."`,
      id: `"Kita mungkin perlu memikirkan bagaimana kita mendekati proses pelaporan ke depannya. Beberapa orang telah memperhatikan bahwa itu terkadang bisa menjadi tantangan, dan mungkin ada baiknya melihat bagaimana kita bisa meningkatkan hal-hal sebagai tim."`,
    },
    instruction: {
      en: "Rewrite this to be specific and accountable without removing the face-preserving tone.",
      id: "Tulis ulang ini agar spesifik dan akuntabel tanpa menghilangkan nada yang menjaga muka.",
    },
    reframe: {
      en: `"I want to talk through something with you, and I want to do that with you first before it becomes a wider conversation — I think it's important we get this right together. The last three reports have framed the outcomes data differently, and that's creating inconsistency that could affect how donors read our progress. Can we set aside time this week to align on a single approach before the next report goes out?"`,
      id: `"Saya ingin mendiskusikan sesuatu denganmu, dan saya ingin melakukannya denganmu terlebih dahulu sebelum menjadi pembicaraan yang lebih luas — saya pikir penting kita menyelesaikan ini bersama. Tiga laporan terakhir telah membingkai data hasil dengan cara yang berbeda, dan itu menciptakan inkonsistensi yang dapat mempengaruhi cara donor membaca kemajuan kita. Dapatkah kita menyisihkan waktu minggu ini untuk menyepakati satu pendekatan sebelum laporan berikutnya keluar?"`,
    },
    explanationLabel: { en: "What changed and why:", id: "Apa yang berubah dan mengapa:" },
    explanation: {
      en: `The original was careful with the relationship and careful with the person's dignity — both of which matter. But it was so indirect that the specific issue (inconsistent data framing, three consecutive reports, donor-facing implications) was entirely absent. The colleague could walk away thinking this was a general team discussion about process, with no personal action required.\n\nThe suggested reframe keeps the relational care in the opening: "I want to talk through something with you... before it becomes a wider conversation" signals that this is private, relational, and intended for the person's benefit. This is face-preserving. Then it names the specific issue in plain language — three reports, inconsistent framing, donor-facing risk — so the recipient cannot misread the seriousness. And it closes with a concrete ask: a meeting this week, a specific deliverable, a shared ownership of the solution.\n\nThe warmth stayed. The specificity arrived.`,
      id: `Teks asli berhati-hati dengan hubungan dan berhati-hati dengan martabat orang tersebut — keduanya penting. Tetapi terlalu tidak langsung sehingga masalah spesifik (pembingkaian data yang tidak konsisten, tiga laporan berturut-turut, implikasi yang dihadapi donor) sepenuhnya tidak ada. Kolega bisa pergi dengan mengira ini adalah diskusi tim umum tentang proses, tanpa tindakan pribadi yang diperlukan.\n\nSaran reframe mempertahankan kepedulian relasional di pembukaan: "Saya ingin mendiskusikan sesuatu denganmu... sebelum menjadi pembicaraan yang lebih luas" memberi sinyal bahwa ini bersifat pribadi, relasional, dan dimaksudkan untuk kepentingan orang tersebut. Ini menjaga muka. Kemudian menyebutkan masalah spesifik dalam bahasa yang jelas — tiga laporan, pembingkaian yang tidak konsisten, risiko yang dihadapi donor — sehingga penerima tidak bisa salah membaca keseriusannya. Dan ditutup dengan permintaan konkret: pertemuan minggu ini, hasil yang spesifik, kepemilikan bersama atas solusi.\n\nKehangatan tetap ada. Kekhususan akhirnya hadir.`,
    },
  },
];

// ─── Section 4 teaching paragraphs ───────────────────────────────────────────
const S4_PARAS: Record<Lang, string[]> = {
  en: [
    "In some cultures, the most important piece of feedback in the room is never spoken at all.",
    "Western leaders trained in direct-feedback cultures spend a great deal of energy thinking about how to say the difficult thing. They develop language for it, choose timing carefully, rehearse the opening line. What they are less trained to notice is the feedback that is already being delivered through absence, silence, and the carefully maintained surface of harmony.",
    "Understanding this requires a brief introduction to how some of the world's majority cultures handle the complexity of correction, dignity, and community.",
    "The Indonesian concept of *malu* is commonly translated as embarrassment or shyness, but this undersells it considerably. *Malu* encompasses the fear of public loss of face, the experience of social shame, and the internal state of knowing that one's standing in the eyes of others has been diminished. It is not merely an emotion — it is a social signal with structural consequences.",
    "In Indonesian workplace contexts, causing *malu* in a colleague — through public criticism, unsolicited correction, or visible displeasure in front of peers — can trigger withdrawal, disengagement, or in significant cases, departure. The classic case documented in expatriate management literature involves a Canadian VP who criticized an Indonesian manager publicly during a team meeting. The manager smiled throughout the conversation, said nothing challenging, and resigned the next morning. The smile was not indifference — it was *malu* managed through composed outward behavior (*lahir*) while the internal experience (*batin*) was something entirely different.",
    "This connects to the Javanese cultural ideal of *rukun* — social harmony maintained as a structural value, not simply a preference. Outward harmony is preserved even when inner disagreement is strong. This is not dishonesty in a low-context sense; it is a social contract that protects relationship and dignity simultaneously. A leader from outside this system who reads maintained harmony as genuine agreement will consistently misread the room.",
    "Korean professional culture operates with two closely related concepts. *Chae-myun* is face — specifically the social face that is maintained through a person's reputation, role, and standing in the community. Losing *chae-myun* publicly is not simply uncomfortable; it can affect relationships, trust, and professional standing in ways that take years to repair.",
    "*Nunchi* is the relational skill of reading the room — sensing what others are feeling without being told, picking up emotional signals from posture, tone, and the unsaid. A leader with good *nunchi* is aware of how their words are landing before the other person responds. A leader without it will often be the last to know that something has gone wrong.",
    "In Korean team contexts, a colleague who goes quiet after a review meeting, responds to emails more briefly than usual, or stops offering ideas in shared discussions may be giving clear feedback — just not in a register that low-context leaders are trained to read. The signal is being sent. The receiver is missing it.",
    `The Ubuntu philosophy — often rendered as "I am because we are" — shapes feedback dynamics in southern African team contexts in a specific way. Correction in Ubuntu-influenced cultures is primarily understood as a community concern, not a dyadic interaction between two individuals. When something goes wrong, the question is not just "what did this person do?" but "what does this mean for the community, and how does the community come back to health?"`,
    "This has a direct practical consequence: feedback that isolates a single person's failure without reference to the community's role in it, or without a clear pathway to community restoration, can feel fundamentally foreign — not just uncomfortable, but structurally incorrect. The relational network is always part of the correction, and correction that ignores it misses the point.",
    "Ubuntu-shaped correction also tends to happen gradually, through trusted relationships rather than formal channels. A respected community member pulling someone aside after an event is often a more powerful corrective than any formal performance process.",
    "In many Latin American professional contexts, the concept of *personalismo* places high value on the quality of personal relationships as the foundation for all professional interaction. Trust is built person-to-person, and professional feedback can only be received clearly when it travels through a relationship that feels warm and safe.",
    "This is why Rafael, in the opening vignette, needed to check the relational temperature before he could read the professional critique. It was not avoidance. It was the correct operating sequence for his cultural logic: relationship first, then content. A piece of feedback arriving through a cold professional channel without established personal warmth will often be received as a signal about the relationship itself, not just about the work.",
  ],
  id: [
    "Di beberapa budaya, umpan balik terpenting di ruangan tidak pernah diucapkan sama sekali.",
    "Pemimpin Barat yang terlatih dalam budaya umpan balik langsung menghabiskan banyak energi untuk memikirkan cara menyampaikan hal yang sulit. Mereka mengembangkan bahasa untuk itu, memilih waktu dengan hati-hati, melatih kalimat pembuka. Yang kurang mereka latih untuk diperhatikan adalah umpan balik yang sudah disampaikan melalui ketidakhadiran, keheningan, dan permukaan harmoni yang dijaga dengan hati-hati.",
    "Memahami ini memerlukan pengenalan singkat tentang bagaimana beberapa budaya mayoritas dunia menangani kompleksitas koreksi, martabat, dan komunitas.",
    "Konsep Indonesia *malu* umumnya diterjemahkan sebagai rasa malu atau sifat pemalu, tetapi ini meremehkannya secara signifikan. *Malu* mencakup ketakutan akan kehilangan muka di depan umum, pengalaman rasa malu sosial, dan keadaan internal mengetahui bahwa kedudukan seseorang di mata orang lain telah berkurang. Ini bukan sekadar emosi — ini adalah sinyal sosial dengan konsekuensi struktural.",
    "Dalam konteks tempat kerja Indonesia, menyebabkan *malu* pada seorang kolega — melalui kritik publik, koreksi yang tidak diminta, atau ketidaksenangan yang terlihat di depan rekan-rekan — dapat memicu penarikan diri, ketidakterlibatan, atau dalam kasus signifikan, kepergian. Kasus klasik yang didokumentasikan dalam literatur manajemen ekspatriat melibatkan seorang VP Kanada yang mengkritik seorang manajer Indonesia secara publik selama rapat tim. Manajer itu tersenyum sepanjang percakapan, tidak mengatakan apa pun yang menantang, dan mengundurkan diri keesokan paginya. Senyum itu bukan ketidakpedulian — itu adalah *malu* yang dikelola melalui perilaku *lahir* yang tenang sementara pengalaman *batin* adalah sesuatu yang sepenuhnya berbeda.",
    "Ini terhubung dengan cita-cita budaya Jawa tentang *rukun* — harmoni sosial yang dipertahankan sebagai nilai struktural, bukan sekadar preferensi. Harmoni luar dipertahankan bahkan ketika ketidaksetujuan dalam diri kuat. Ini bukan ketidakjujuran dalam arti berkonteks rendah; ini adalah kontrak sosial yang melindungi hubungan dan martabat secara bersamaan. Seorang pemimpin dari luar sistem ini yang membaca harmoni yang dipertahankan sebagai persetujuan tulus akan secara konsisten salah membaca situasi.",
    "Budaya profesional Korea beroperasi dengan dua konsep yang sangat terkait. *Chae-myun* adalah muka — khususnya muka sosial yang dipertahankan melalui reputasi, peran, dan kedudukan seseorang dalam komunitas. Kehilangan *chae-myun* di depan umum tidak hanya tidak nyaman; itu dapat mempengaruhi hubungan, kepercayaan, dan kedudukan profesional dengan cara yang membutuhkan waktu bertahun-tahun untuk diperbaiki.",
    "*Nunchi* adalah keterampilan relasional membaca suasana — merasakan apa yang dirasakan orang lain tanpa diberitahu, menangkap sinyal emosional dari postur, nada, dan yang tidak diucapkan. Seorang pemimpin dengan *nunchi* yang baik menyadari bagaimana kata-kata mereka mendarat sebelum orang lain merespons. Seorang pemimpin tanpa itu sering kali akan menjadi yang terakhir mengetahui bahwa sesuatu telah salah.",
    "Dalam konteks tim Korea, seorang kolega yang diam setelah rapat tinjauan, membalas email lebih singkat dari biasanya, atau berhenti menawarkan ide dalam diskusi bersama mungkin memberikan umpan balik yang jelas — hanya saja tidak dalam register yang dilatih untuk dibaca oleh pemimpin berkonteks rendah. Sinyal sedang dikirim. Penerima melewatkannya.",
    `Filosofi Ubuntu — sering diterjemahkan sebagai "Saya ada karena kita ada" — membentuk dinamika umpan balik dalam konteks tim Afrika selatan dengan cara tertentu. Koreksi dalam budaya yang dipengaruhi Ubuntu terutama dipahami sebagai kepedulian komunitas, bukan interaksi diadik antara dua individu. Ketika sesuatu salah, pertanyaannya bukan hanya "apa yang dilakukan orang ini?" tetapi "apa artinya ini bagi komunitas, dan bagaimana komunitas kembali sehat?"`,
    "Ini memiliki konsekuensi praktis langsung: umpan balik yang mengisolasi kegagalan satu orang tanpa referensi pada peran komunitas di dalamnya, atau tanpa jalur yang jelas menuju pemulihan komunitas, bisa terasa fundamental asing — bukan hanya tidak nyaman, tetapi secara struktural tidak benar. Jaringan relasional selalu menjadi bagian dari koreksi, dan koreksi yang mengabaikannya melewatkan intinya.",
    "Koreksi yang dibentuk Ubuntu juga cenderung terjadi secara bertahap, melalui hubungan yang dipercaya alih-alih saluran formal. Seorang anggota komunitas yang dihormati yang mengajak seseorang berbicara secara pribadi setelah sebuah acara sering kali merupakan koreksi yang lebih kuat daripada proses penilaian kinerja formal mana pun.",
    "Dalam banyak konteks profesional Amerika Latin, konsep *personalismo* menempatkan nilai tinggi pada kualitas hubungan pribadi sebagai fondasi semua interaksi profesional. Kepercayaan dibangun dari orang ke orang, dan umpan balik profesional hanya bisa diterima dengan jelas ketika berjalan melalui hubungan yang terasa hangat dan aman.",
    "Inilah mengapa Rafael, dalam cuplikan pembuka, perlu memeriksa suhu relasional sebelum bisa membaca kritik profesional tersebut. Itu bukan penghindaran. Itu adalah urutan operasi yang benar untuk logika budayanya: hubungan terlebih dahulu, kemudian konten. Sepotong umpan balik yang tiba melalui saluran profesional yang dingin tanpa kehangatan pribadi yang terbangun sering kali akan diterima sebagai sinyal tentang hubungan itu sendiri, bukan hanya tentang pekerjaan.",
  ],
};

// ─── Two-Lens data (Section 4) ────────────────────────────────────────────────
const TWO_LENS = {
  setup: {
    en: `A cross-cultural team is reviewing a project report together. The team leader — from a Northern European background — gives live feedback on the data analysis: "I think this section isn't quite where we need it. Let me show you what I mean." He marks several passages, explains the gaps, and closes with, "You'll want to revise this before it goes out." A team member from East Asia listens carefully, nods throughout, says "Yes, I understand," and asks one clarifying question. The meeting continues. The team leader leaves feeling the feedback was received well.`,
    id: `Sebuah tim lintas budaya sedang meninjau laporan proyek bersama. Pemimpin tim — dari latar belakang Eropa Utara — memberikan umpan balik langsung tentang analisis data: "Saya pikir bagian ini belum cukup sesuai yang kita butuhkan. Biarkan saya tunjukkan maksud saya." Ia menandai beberapa bagian, menjelaskan kekurangannya, dan menutup dengan, "Kamu perlu merevisi ini sebelum keluar." Seorang anggota tim dari Asia Timur mendengarkan dengan saksama, mengangguk sepanjang waktu, berkata "Ya, saya mengerti," dan mengajukan satu pertanyaan klarifikasi. Rapat berlanjut. Pemimpin tim pergi dengan perasaan umpan balik telah diterima dengan baik.`,
  },
  lens1: {
    label: { en: "LOW-CONTEXT DIRECT LENS", id: "LENSA LANGSUNG KONTEKS RENDAH" },
    title: { en: "What the team leader saw", id: "Apa yang dilihat pemimpin tim" },
    paras: {
      en: [
        `The colleague attended, engaged, and verbally confirmed understanding. The clarifying question showed genuine interest. The "yes, I understand" confirmed receipt. The absence of defensiveness or pushback signaled professional maturity. Feedback delivered, message received, topic closed.`,
      ],
      id: [
        `Kolega hadir, terlibat, dan secara verbal mengkonfirmasi pemahaman. Pertanyaan klarifikasi menunjukkan minat yang tulus. "Ya, saya mengerti" mengkonfirmasi penerimaan. Ketiadaan defensif atau penolakan menandakan kematangan profesional. Umpan balik disampaikan, pesan diterima, topik ditutup.`,
      ],
    },
  },
  lens2: {
    label: { en: "CULTURAL LOGIC", id: "LOGIKA BUDAYA" },
    title: { en: "What was actually happening", id: "Apa yang sebenarnya terjadi" },
    paras: {
      en: [
        `The colleague experienced the live correction as a semi-public event — other team members were present. "I understand" was a face-saving device, not a confirmation of agreement. The clarifying question was an attempt to find any piece of the conversation that could be engaged with without revealing discomfort. The nod and composed posture were *nunchi* at work — maintaining outward harmony while internally processing a correction that felt more significant than the team leader intended. The colleague left the meeting unsure whether the team leader was satisfied or dissatisfied with the relationship. The report would be revised — but not because the feedback felt helpful. Because to do otherwise would signal something about the relationship that could not be unsaid.`,
      ],
      id: [
        `Kolega mengalami koreksi langsung sebagai acara semi-publik — anggota tim lain hadir. "Saya mengerti" adalah perangkat penyelamat muka, bukan konfirmasi persetujuan. Pertanyaan klarifikasi adalah upaya untuk menemukan bagian percakapan mana pun yang bisa diajak bicara tanpa mengungkapkan ketidaknyamanan. Anggukan dan postur tenang adalah *nunchi* yang bekerja — mempertahankan harmoni luar sambil secara internal memproses koreksi yang terasa lebih signifikan dari yang dimaksudkan pemimpin tim. Kolega meninggalkan rapat tidak yakin apakah pemimpin tim puas atau tidak puas dengan hubungan tersebut. Laporan akan direvisi — tetapi bukan karena umpan balik terasa membantu. Karena melakukan sebaliknya akan menandakan sesuatu tentang hubungan yang tidak bisa tidak diucapkan.`,
      ],
    },
    insight: {
      en: "This is the gap. Not bad faith on either side. Just two different operating systems running on the same interaction.",
      id: "Inilah kesenjangan itu. Tidak ada itikad buruk dari kedua belah pihak. Hanya dua sistem operasi yang berbeda berjalan pada interaksi yang sama.",
    },
  },
  closing: {
    en: `The team leader's feedback was accurate. But it was delivered in a register the colleague processed very differently than intended. And the signals the colleague sent in response — signals that in their cultural logic clearly communicated "I have received something difficult here, and I need to process it" — were read by the team leader as "message received, all good."`,
    id: `Umpan balik pemimpin tim akurat. Tetapi itu disampaikan dalam register yang diproses kolega sangat berbeda dari yang dimaksudkan. Dan sinyal yang dikirim kolega sebagai respons — sinyal yang dalam logika budaya mereka dengan jelas mengomunikasikan "Saya telah menerima sesuatu yang sulit di sini, dan saya perlu memprosesnya" — dibaca oleh pemimpin tim sebagai "pesan diterima, semua baik-baik saja."`,
  },
};

// ─── Section 5 Nathan Principle teaching paragraphs ──────────────────────────
const S5_PARAS: Record<Lang, string[]> = {
  en: [
    "Before we get to practice, there is a question that sits underneath all of this that is worth naming directly.",
    "You may have been reading this module and thinking: this is all very thoughtful, but at what point does cultural sensitivity become an excuse for not saying the hard thing? If I keep softening and hedging and wrapping in relational preamble, at what point have I stopped delivering the feedback at all?",
    "It is a fair question. And the biblical tradition does not let you off the hook with a simple answer.",
    `Proverbs 27:5-6 is blunt: "Better is open rebuke than hidden love. Faithful are the wounds of a friend." The Hebrew wisdom tradition does not treat indirect deflection as kindness. It treats the withholding of correction as a failure of love — and, strikingly, it equates that failure with the deceptive flattery of an enemy. If you care about someone, you tell them the truth. That is not optional.`,

    "And yet, sitting right inside the same tradition, there is a man named Nathan who chose not to begin with the direct statement.",
    `David had committed adultery with Bathsheba and had arranged the death of Uriah her husband. Nathan knew. God sent him to confront the king. And Nathan did not walk into the throne room and say, "You are guilty of adultery and murder."`,
    "He told a story.",
    `A rich man had many flocks, but when a traveler came, he took a poor man's one beloved lamb rather than from his own flock, and killed it for the feast. David, hearing the story, was outraged. "That man deserves to die!" he said.`,
    `"You are the man," Nathan said.`,
    "Five words. But the parable came first.",
    "The parable was not evasion. It was not weakness. It was preparation — the structure that made the direct truth receivable. Nathan needed David to arrive at the verdict himself before it could be applied to David. The indirect path was what made the direct declaration land.",
    "This is not a template to be mechanically applied — it is a model of what it looks like when truth-telling is shaped by the question: how does this person need to receive this in order for the truth to actually reach them?",
    "The Nathan Principle is not a technique for avoiding directness. Nathan was direct — devastatingly direct, when the moment came. The principle is about the preparation that makes direct truth receivable. The indirect path is not the opposite of the direct declaration. It is what makes the direct declaration land.",
  ],
  id: [
    "Sebelum kita masuk ke praktik, ada pertanyaan yang berada di bawah semua ini yang layak disebutkan secara langsung.",
    "Kamu mungkin telah membaca modul ini dan berpikir: ini semua sangat bijaksana, tetapi pada titik mana kepekaan budaya menjadi alasan untuk tidak mengatakan hal yang sulit? Jika saya terus melembutkan dan melindungi dan membungkus dalam basa-basi relasional, pada titik mana saya berhenti menyampaikan umpan balik sama sekali?",
    "Itu adalah pertanyaan yang adil. Dan tradisi biblika tidak membiarkan kamu lolos dengan jawaban sederhana.",
    `Amsal 27:5-6 terus terang: "Teguran yang terang-terangan lebih baik daripada kasih yang tersembunyi. Dapat dipercaya tikaman seorang sahabat." Tradisi hikmat Ibrani tidak memperlakukan pengalihan tidak langsung sebagai kebaikan. Ini memperlakukan penahanan koreksi sebagai kegagalan kasih — dan, luar biasa, ini menyamakan kegagalan itu dengan sanjungan menipu dari seorang musuh. Jika kamu peduli pada seseorang, kamu memberitahu mereka kebenaran. Itu bukan opsional.`,

    "Namun, tepat di dalam tradisi yang sama, ada seorang pria bernama Natan yang memilih untuk tidak memulai dengan pernyataan langsung.",
    `Daud telah berzinah dengan Batsyeba dan telah mengatur kematian Uria suaminya. Natan tahu. Tuhan mengutusnya untuk menghadapi raja. Dan Natan tidak berjalan masuk ke ruang takhta dan berkata, "Kamu bersalah atas perzinahan dan pembunuhan."`,
    "Ia menceritakan sebuah kisah.",
    `Seorang pria kaya memiliki banyak kawanan, tetapi ketika seorang musafir datang, ia mengambil satu-satunya domba betina kesayangan orang miskin alih-alih dari kawanannya sendiri, dan menyembelihnya untuk perjamuan. Daud, mendengar kisah itu, marah besar. "Orang itu layak mati!" katanya.`,
    `"Engkau sendiri orang itu," kata Natan.`,
    "Lima kata. Tetapi perumpamaan datang terlebih dahulu.",
    "Perumpamaan itu bukan penghindaran. Itu bukan kelemahan. Itu adalah persiapan — struktur yang membuat kebenaran langsung dapat diterima. Natan membutuhkan Daud untuk sampai pada vonis itu sendiri sebelum dapat diterapkan pada Daud. Jalan tidak langsung itulah yang membuat deklarasi langsung mendarat.",
    "Ini bukan template yang harus diterapkan secara mekanis — ini adalah model tentang seperti apa jadinya ketika penyampaian kebenaran dibentuk oleh pertanyaan: bagaimana orang ini perlu menerima ini agar kebenaran benar-benar sampai kepada mereka?",
    "Prinsip Natan bukan teknik untuk menghindari ketegasan. Natan tegas — sangat tegas, ketika saatnya tiba. Prinsipnya adalah tentang persiapan yang membuat kebenaran langsung dapat diterima. Jalan tidak langsung bukan lawan dari deklarasi langsung. Itulah yang membuat deklarasi langsung mendarat.",
  ],
};

// ─── Section 5 Nathan method (numbered list) ─────────────────────────────────
const S5_METHOD: Record<Lang, { intro: string; items: { lead: string; body: string }[] }> = {
  en: {
    intro: "Nathan's method has been studied carefully in biblical leadership scholarship. It follows a recognizable pattern:",
    items: [
      { lead: "Indirect approach via story", body: "he created empathy, built understanding, drew David into the moral logic before the application arrived" },
      { lead: "Comprehension before confrontation", body: "he waited until David had already reached the right verdict before naming him as the subject" },
      { lead: "Direct declaration", body: `when understanding was secured, he named the truth plainly: "You are the man"` },
      { lead: "Specific accountability", body: "he named the exact actions and their consequences without softening what David had done" },
      { lead: "Private setting", body: "this was a one-to-one conversation, not a public accusation" },
    ],
  },
  id: {
    intro: "Metode Natan telah dipelajari dengan cermat dalam kajian kepemimpinan biblika. Ini mengikuti pola yang dapat dikenali:",
    items: [
      { lead: "Pendekatan tidak langsung melalui kisah", body: "ia menciptakan empati, membangun pemahaman, menarik Daud ke dalam logika moral sebelum penerapan tiba" },
      { lead: "Pemahaman sebelum konfrontasi", body: "ia menunggu sampai Daud sudah mencapai vonis yang benar sebelum menamainya sebagai subjek" },
      { lead: "Deklarasi langsung", body: `ketika pemahaman diamankan, ia menyebutkan kebenaran secara terang-terangan: "Engkau sendiri orang itu"` },
      { lead: "Akuntabilitas spesifik", body: "ia menyebutkan tindakan yang tepat dan konsekuensinya tanpa melembutkan apa yang telah Daud lakukan" },
      { lead: "Setting pribadi", body: "ini adalah percakapan empat mata, bukan tuduhan publik" },
    ],
  },
};

// ─── Nathan Case Study data ───────────────────────────────────────────────────
type CaseChoice = {
  label: { en: string; id: string };
  action: { en: string[]; id: string[] };
  outcome: { en: string[]; id: string[] };
};

const CASE_WHAT_NEXT = { en: "What happens next:", id: "Apa yang terjadi selanjutnya:" };

const CASE_SETUP: Record<Lang, string[]> = {
  en: [
    "You are a team leader in a multicultural NGO working in East Africa. Your team of seven spans four nationalities and three cultural backgrounds. You have just finished reviewing the donor reports submitted over the last quarter — and you have noticed something troubling.",
    "A colleague named James, who handles field data collection and reporting, has been framing the outcomes data in ways that are not technically false but are consistently more optimistic than the underlying numbers support. Numbers are selectively reported. Trend language overstates progress. No outright fabrication — but a pattern of representation that, if a donor asked the direct question, would not hold up.",
    "James is well-liked by the team. He is from a cultural background in which maintaining positive relationships — including with donors — is seen as part of his professional responsibility. He genuinely believes he is protecting the project. He has never been told this is not acceptable.",
    "You need to address this.",
  ],
  id: [
    "Kamu adalah pemimpin tim dalam LSM multikultural yang bekerja di Afrika Timur. Tim tujuh orang kamu mencakup empat kebangsaan dan tiga latar belakang budaya. Kamu baru saja selesai meninjau laporan donor yang diserahkan selama kuartal terakhir — dan kamu telah memperhatikan sesuatu yang mengkhawatirkan.",
    "Seorang kolega bernama James, yang menangani pengumpulan data lapangan dan pelaporan, telah membingkai data hasil dengan cara yang secara teknis tidak salah tetapi secara konsisten lebih optimis dari yang didukung angka dasarnya. Angka-angka dilaporkan secara selektif. Bahasa tren melebih-lebihkan kemajuan. Tidak ada pemalsuan terang-terangan — tetapi pola representasi yang, jika donor mengajukan pertanyaan langsung, tidak akan bertahan.",
    "James disukai oleh tim. Ia berasal dari latar belakang budaya di mana mempertahankan hubungan positif — termasuk dengan donor — dianggap sebagai bagian dari tanggung jawab profesionalnya. Ia sungguh-sungguh percaya bahwa ia sedang melindungi proyek. Ia tidak pernah diberitahu bahwa ini tidak dapat diterima.",
    "Kamu perlu mengatasi hal ini.",
  ],
};

const CASE_CP1: { heading: { en: string; id: string }; options: [CaseChoice, CaseChoice] } = {
  heading: {
    en: "Choice Point 1: How do you open the conversation?",
    id: "Titik Pilihan 1: Bagaimana kamu membuka percakapan?",
  },
  options: [
    {
      label: { en: "Option A -- Begin with the issue directly", id: "Pilihan A -- Mulai langsung dengan masalah" },
      action: {
        en: [
          `You ask James to meet privately. You open the meeting by naming the pattern you have observed: "James, I've been reviewing the last three reports, and I want to talk to you about how the outcomes data has been framed. Some of what I'm reading doesn't match the underlying numbers."`,
        ],
        id: [
          `Kamu meminta James untuk bertemu secara pribadi. Kamu membuka pertemuan dengan menyebutkan pola yang kamu amati: "James, saya telah meninjau tiga laporan terakhir, dan saya ingin berbicara denganmu tentang bagaimana data hasil dibingkai. Beberapa yang saya baca tidak cocok dengan angka dasarnya."`,
        ],
      },
      outcome: {
        en: [
          "James is quiet. He nods slowly. You can see from his expression that he is not defensive so much as uncertain — he does not fully understand what he has done wrong, because in his mind he was doing his job well. He agrees with everything you say during the meeting. He thanks you for telling him. He walks away feeling unsettled and confused, not entirely clear on the boundary that was crossed or why it matters to you as much as it apparently does.",
          "When you follow up two weeks later, the reports have improved in some areas but the pattern has not fully changed. James did not experience the meeting as a serious correction — he experienced it as a preference clarification.",
        ],
        id: [
          "James diam. Ia mengangguk perlahan. Kamu bisa melihat dari ekspresinya bahwa ia tidak defensif melainkan tidak pasti — ia tidak sepenuhnya memahami apa yang telah ia lakukan salah, karena dalam pikirannya ia melakukan pekerjaannya dengan baik. Ia setuju dengan semua yang kamu katakan selama pertemuan. Ia berterima kasih karena kamu memberitahunya. Ia pergi merasa gelisah dan bingung, tidak sepenuhnya jelas tentang batas yang dilanggar atau mengapa itu penting bagimu sebesar yang tampaknya.",
          "Ketika kamu menindaklanjuti dua minggu kemudian, laporan-laporan telah meningkat di beberapa area tetapi polanya tidak sepenuhnya berubah. James tidak mengalami pertemuan itu sebagai koreksi serius — ia mengalaminya sebagai klarifikasi preferensi.",
        ],
      },
    },
    {
      label: { en: "Option B -- Begin with the relationship", id: "Pilihan B -- Mulai dengan hubungan" },
      action: {
        en: [
          `You ask James to meet privately. You open with something genuine: how much you have valued his work in the field, what you know he is trying to accomplish for the project. Then you say: "There's something I want to work through with you, because I think it's going to be important for the project and I want to get it right with you first."`,
          "You pause, let that land, and then begin to name the pattern.",
        ],
        id: [
          `Kamu meminta James untuk bertemu secara pribadi. Kamu membuka dengan sesuatu yang tulus: betapa kamu menghargai pekerjaannya di lapangan, apa yang kamu tahu ia coba capai untuk proyek tersebut. Kemudian kamu berkata: "Ada sesuatu yang ingin saya selesaikan denganmu, karena saya pikir ini akan penting bagi proyek dan saya ingin menyelesaikannya dengan benar bersamamu terlebih dahulu."`,
          "Kamu berhenti sejenak, biarkan itu mendarat, lalu mulai menyebutkan pola tersebut.",
        ],
      },
      outcome: {
        en: [
          `James relaxes slightly from his initial wariness. The opening has told him two things: you are not angry at him, and this is something you are bringing to him privately before it goes anywhere else. He is still uncertain, but he is present. He asks a clarifying question: "Is it about the reporting format, or something else?"`,
          "You now have his attention and his trust in the room simultaneously. The difficult content can enter through an open door.",
        ],
        id: [
          `James sedikit santai dari kewaspadaan awalnya. Pembukaan itu telah memberitahunya dua hal: kamu tidak marah padanya, dan ini adalah sesuatu yang kamu bawa kepadanya secara pribadi sebelum pergi ke mana saja. Ia masih tidak pasti, tetapi ia hadir. Ia mengajukan pertanyaan klarifikasi: "Apakah ini tentang format pelaporan, atau sesuatu yang lain?"`,
          "Kamu kini memiliki perhatiannya dan kepercayaannya di ruangan itu secara bersamaan. Konten yang sulit dapat masuk melalui pintu yang terbuka.",
        ],
      },
    },
  ],
};
const CASE_CP2: Record<"A" | "B", { heading: { en: string; id: string }; intro: { en: string; id: string }; options: [CaseChoice, CaseChoice] }> = {
  A: {
    heading: {
      en: "Choice Point 2A: Naming the issue after the direct opening",
      id: "Titik Pilihan 2A: Menyebutkan masalah setelah pembukaan langsung",
    },
    intro: {
      en: "James heard the correction but did not receive it at the depth you intended. You need to name more clearly what the stakes are.",
      id: "James mendengar koreksi itu tetapi tidak menerimanya sedalam yang kamu maksudkan. Kamu perlu menyebutkan dengan lebih jelas apa yang dipertaruhkan.",
    },
    options: [
      {
        label: { en: "Option A1 -- Frame it as a professional standard", id: "Pilihan A1 -- Bingkai sebagai standar profesional" },
        action: {
          en: [
            "You explain the organizational policy on data representation. You reference the donor agreements. You make clear this is not your personal preference — it is a professional and contractual requirement. James needs to understand this is not about style.",
          ],
          id: [
            "Kamu menjelaskan kebijakan organisasi tentang representasi data. Kamu merujuk pada perjanjian donor. Kamu memperjelas bahwa ini bukan preferensi pribadimu — ini adalah persyaratan profesional dan kontraktual. James perlu memahami bahwa ini bukan tentang gaya.",
          ],
        },
        outcome: {
          en: [
            "James understands, intellectually. He adjusts his reporting in the next cycle. But the conversation has left something unresolved between you — he feels he was not trusted, and you feel the correction did not fully land as a genuine learning. The reports improve, but the relationship is slightly cooler. He has not fully understood why the pattern existed or what it was costing the project in terms of integrity, because the framing was primarily procedural rather than relational.",
          ],
          id: [
            "James memahami, secara intelektual. Ia menyesuaikan pelaporannya pada siklus berikutnya. Tetapi percakapan tersebut meninggalkan sesuatu yang belum terselesaikan di antara kamu — ia merasa tidak dipercaya, dan kamu merasa koreksi tidak sepenuhnya mendarat sebagai pembelajaran yang tulus. Laporan-laporan membaik, tetapi hubungan sedikit lebih dingin. Ia tidak sepenuhnya memahami mengapa pola itu ada atau apa yang dikorbankan proyek dalam hal integritas, karena bingkainya terutama prosedural daripada relasional.",
          ],
        },
      },
      {
        label: { en: "Option A2 -- Ask him what he was trying to protect", id: "Pilihan A2 -- Tanyakan apa yang ia coba lindungi" },
        action: {
          en: [
            `Before explaining the standards, you ask a different question: "James, help me understand — when you framed the data this way, what were you trying to achieve?"`,
          ],
          id: [
            `Sebelum menjelaskan standar, kamu mengajukan pertanyaan yang berbeda: "James, bantu saya memahami — ketika kamu membingkai data dengan cara ini, apa yang ingin kamu capai?"`,
          ],
        },
        outcome: {
          en: [
            "Something shifts. James, who has been carefully composed, exhales. He explains that he has always believed keeping donors positive about the project is part of his job. That in his experience, if donors see problems, they lose confidence and the funding dries up. He has been managing the relationship, not falsifying data.",
            "You now understand something you did not know five minutes ago: this is not a compliance problem — it is a misunderstanding of what good reporting is actually for. And you can address that directly, together, in a way that changes his mental model rather than just his behavior.",
          ],
          id: [
            "Sesuatu bergeser. James, yang dengan hati-hati telah tenang, menghembuskan napas. Ia menjelaskan bahwa ia selalu percaya menjaga donor tetap positif tentang proyek adalah bagian dari pekerjaannya. Bahwa dalam pengalamannya, jika donor melihat masalah, mereka kehilangan kepercayaan dan pendanaan mengering. Ia telah mengelola hubungan, bukan memalsukan data.",
            "Kamu sekarang memahami sesuatu yang tidak kamu ketahui lima menit lalu: ini bukan masalah kepatuhan — ini adalah kesalahpahaman tentang apa sebenarnya tujuan pelaporan yang baik. Dan kamu bisa mengatasinya secara langsung, bersama-sama, dengan cara yang mengubah model mentalnya daripada hanya perilakunya.",
          ],
        },
      },
    ],
  },
  B: {
    heading: {
      en: "Choice Point 2B: Naming the issue after the relational opening",
      id: "Titik Pilihan 2B: Menyebutkan masalah setelah pembukaan relasional",
    },
    intro: {
      en: "James is present and relatively open. The relational framing worked. Now you name the pattern.",
      id: "James hadir dan relatif terbuka. Bingkai relasional berhasil. Sekarang kamu menyebutkan polanya.",
    },
    options: [
      {
        label: { en: "Option B1 -- Name the pattern; then ask what he was protecting", id: "Pilihan B1 -- Sebutkan polanya; lalu tanyakan apa yang ia lindungi" },
        action: {
          en: [
            `You describe what you observed in the reports — the selective framing, the optimistic trend language — and then you ask: "I want to understand your thinking on this before I say more. What were you trying to achieve?"`,
          ],
          id: [
            `Kamu menggambarkan apa yang kamu amati dalam laporan-laporan — pembingkaian selektif, bahasa tren yang optimis — lalu kamu bertanya: "Saya ingin memahami pemikiranmu tentang ini sebelum saya berbicara lebih jauh. Apa yang ingin kamu capai?"`,
          ],
        },
        outcome: {
          en: [
            "The same as Option A2, but with more relational groundwork beneath it. James's answer is the same: he was protecting the donor relationship. But because the conversation opened in a way that felt safe, he answers more fully than he might have otherwise. He does not just explain the behavior — he explains the value behind it. And that gives you significantly more to work with.",
          ],
          id: [
            "Sama seperti Pilihan A2, tetapi dengan lebih banyak fondasi relasional di bawahnya. Jawaban James sama: ia melindungi hubungan dengan donor. Tetapi karena percakapan dibuka dengan cara yang terasa aman, ia menjawab lebih penuh daripada yang mungkin ia lakukan sebaliknya. Ia tidak hanya menjelaskan perilakunya — ia menjelaskan nilai di baliknya. Dan itu memberimu jauh lebih banyak bahan untuk dikerjakan.",
          ],
        },
      },
      {
        label: { en: "Option B2 -- Name the pattern; then give the Nathan frame", id: "Pilihan B2 -- Sebutkan polanya; lalu berikan bingkai Natan" },
        action: {
          en: [
            `You describe the pattern and then do something unexpected: you say, "Let me tell you what a donor would think if they looked at this reporting alongside the underlying numbers — and then I want to hear your perspective."`,
            "You spend two minutes painting the picture from the donor's viewpoint: what they are trusting, what they have signed up for, what the gap between the report and the numbers would look like to them if they saw it directly. You give James the parable before you name him in it.",
          ],
          id: [
            `Kamu menggambarkan polanya lalu melakukan sesuatu yang tidak terduga: kamu berkata, "Biarkan saya menceritakan apa yang akan dipikirkan seorang donor jika mereka melihat pelaporan ini berdampingan dengan angka dasarnya — lalu saya ingin mendengar perspektifmu."`,
            "Kamu menghabiskan dua menit melukiskan gambaran dari sudut pandang donor: apa yang mereka percayai, apa yang telah mereka sepakati, seperti apa kesenjangan antara laporan dan angka-angka itu bagi mereka jika mereka melihatnya secara langsung. Kamu memberi James perumpamaan sebelum kamu menamainya di dalamnya.",
          ],
        },
        outcome: {
          en: [
            `James sees the problem not as your problem with his work, but as a gap between his intention and its effect. The parable structure — the outsider's view first, then the application — has given him the chance to arrive at the verdict himself before you name it. When you then say, "I think you've been trying to do the right thing and this is how it's landing," he is ready to hear both the accountability and the path forward.`,
          ],
          id: [
            `James melihat masalahnya bukan sebagai masalahmu dengan pekerjaannya, tetapi sebagai kesenjangan antara niatnya dan dampaknya. Struktur perumpamaan — pandangan orang luar terlebih dahulu, lalu penerapannya — telah memberinya kesempatan untuk sampai pada vonis itu sendiri sebelum kamu menyebutkannya. Ketika kamu kemudian berkata, "Saya pikir kamu telah berusaha melakukan hal yang benar dan beginilah dampaknya," ia siap mendengar baik akuntabilitas maupun jalan ke depan.`,
          ],
        },
      },
    ],
  },
};

const CASE_CP3: {
  heading: { en: string; id: string };
  intro: { en: string; id: string };
  promptsLabel: { en: string; id: string };
  prompts: { en: string[]; id: string[] };
} = {
  heading: {
    en: "Choice Point 3: What does restoration look like?",
    id: "Titik Pilihan 3: Seperti apa pemulihan itu?",
  },
  intro: {
    en: "Regardless of which path you took, James now understands that his reporting practice needs to change. The question is what happens next.",
    id: "Apa pun jalur yang kamu ambil, James sekarang memahami bahwa praktik pelaporannya perlu berubah. Pertanyaannya adalah apa yang terjadi selanjutnya.",
  },
  promptsLabel: {
    en: "Reflection prompts (no choice required -- these are for you to consider):",
    id: "Pertanyaan refleksi (tidak perlu memilih -- ini untuk kamu renungkan):",
  },
  prompts: {
    en: [
      `The biblical correction model in Matthew 18 is oriented toward restoration: "you have won them back." What does winning James back look like in this situation? What does he need to walk away with?`,
      "In shame-oriented cultural contexts, correction without a pathway to restored honor can cause more lasting damage than the original problem. How do you close this conversation in a way that restores James's standing — in his own eyes and in the team?",
      `Nathan's correction of David included both clear accountability ("you are the man") and a pathway forward (the consequences named, the confession made, the relationship between Nathan and David intact). Which part of this are you most naturally inclined to skip?`,
      "What is the difference between correcting James's behavior and correcting his understanding? Which of the paths above got closer to understanding? Which one only corrected the behavior?",
    ],
    id: [
      `Model koreksi biblika dalam Matius 18 berorientasi pada pemulihan: "kamu telah mendapatkan mereka kembali." Seperti apa mendapatkan James kembali dalam situasi ini? Apa yang ia butuhkan untuk dibawa pergi?`,
      "Dalam konteks budaya yang berorientasi pada rasa malu, koreksi tanpa jalur menuju kehormatan yang dipulihkan dapat menyebabkan kerusakan yang lebih lama daripada masalah aslinya. Bagaimana kamu menutup percakapan ini dengan cara yang memulihkan kedudukan James — di matanya sendiri dan di dalam tim?",
      `Koreksi Natan terhadap Daud mencakup akuntabilitas yang jelas ("engkau sendiri orang itu") dan jalur ke depan (konsekuensi disebutkan, pengakuan dibuat, hubungan antara Natan dan Daud tetap utuh). Bagian mana dari ini yang paling alami cenderung kamu lewati?`,
      "Apa perbedaan antara mengoreksi perilaku James dan mengoreksi pemahamannya? Jalur mana di atas yang lebih mendekati pemahaman? Yang mana yang hanya mengoreksi perilaku?",
    ],
  },
};

// ─── Section 6 four-step process ─────────────────────────────────────────────
const S6_STEPS: Record<Lang, { num: string; title: string; body: string }[]> = {
  en: [
    {
      num: "01",
      title: "Identify your default register",
      body: "Before you say anything, know where you start from. Are you a direct-feedback communicator by default — precise, specific, declarative? Or do you lean naturally toward indirection — softening, qualifying, wrapping the critique in relational warmth? Neither default is better. Both become problems when applied uncritically to a cultural register that runs on a different system. The goal is not to abandon your default. It is to be conscious enough of it that you can adjust when the person in front of you needs something different.",
    },
    {
      num: "02",
      title: "Name the cultural context you are entering",
      body: "Who are you giving this feedback to? What do you know about the cultural register they operate from — not as a stereotype, but as a starting point for awareness? Where do they sit on the Evaluating scale? What is the role of dignity, face, and community relationship in how they process correction? Do they have a cultural orientation toward malu, chae-myun, Ubuntu community dynamics, or personalismo? This step is not about applying a formula. It is about entering the conversation with genuine curiosity about how this specific person, in this specific cultural context, receives difficult information.",
    },
    {
      num: "03",
      title: "Translate the core truth into the appropriate form",
      body: "The content of your feedback does not change. The analysis needs to be redone. The behavior cannot continue. The impact has been significant. These things remain true in every register. What changes is the form. Are you delivering the core truth with upgraders or downgraders? Are you opening with relational preamble, or getting directly to the point? Are you framing the issue as a shared problem or as a verdict on the person? Are you building in a face-preserving pathway to restoration, or leaving the correction hanging in the air? Translate, not dilute. The goal is for the truth to arrive — not for it to disappear into politeness.",
    },
    {
      num: "04",
      title: "Plan for non-verbal signals and follow-up",
      body: `A cross-cultural feedback conversation rarely ends cleanly. In many indirect-feedback cultures, the immediate response will not tell you whether the message was received. Agreement in the room may not mean agreement about the problem or commitment to change. And silence, in many contexts, is not neutral — it can be the most significant signal in the conversation. Plan to follow up. Not immediately — give the person time to process. But in the days after a difficult conversation, return to it gently: "I wanted to check in after our conversation last week. How are you sitting with it?" This is not pressure — it is the continuation of the relational framework that made the correction possible in the first place. And in some cultures, it is the follow-up, not the initial conversation, that carries the weight.`,
    },
  ],
  id: [
    {
      num: "01",
      title: "Identifikasi register defaultmu",
      body: "Sebelum kamu mengatakan apa pun, ketahui dari mana kamu mulai. Apakah kamu secara default adalah komunikator umpan balik langsung — tepat, spesifik, deklaratif? Atau kamu secara alami condong ke arah ketidaklangsungan — melembutkan, memenuhi syarat, membungkus kritik dalam kehangatan relasional? Tidak ada default yang lebih baik. Keduanya menjadi masalah ketika diterapkan tanpa kritis pada register budaya yang berjalan pada sistem yang berbeda. Tujuannya bukan untuk meninggalkan defaultmu. Ini adalah untuk cukup sadar akan hal itu sehingga kamu bisa menyesuaikan ketika orang di hadapanmu membutuhkan sesuatu yang berbeda.",
    },
    {
      num: "02",
      title: "Sebutkan konteks budaya yang kamu masuki",
      body: "Kepada siapa kamu memberikan umpan balik ini? Apa yang kamu ketahui tentang register budaya yang mereka operasikan — bukan sebagai stereotip, tetapi sebagai titik awal untuk kesadaran? Di mana mereka berada pada skala Evaluasi? Apa peran martabat, muka, dan hubungan komunitas dalam cara mereka memproses koreksi? Apakah mereka memiliki orientasi budaya terhadap malu, chae-myun, dinamika komunitas Ubuntu, atau personalismo? Langkah ini bukan tentang menerapkan formula. Ini tentang memasuki percakapan dengan rasa ingin tahu yang tulus tentang bagaimana orang spesifik ini, dalam konteks budaya spesifik ini, menerima informasi yang sulit.",
    },
    {
      num: "03",
      title: "Terjemahkan kebenaran inti ke dalam bentuk yang tepat",
      body: "Konten umpan balikmu tidak berubah. Analisis perlu dibuat ulang. Perilaku tidak bisa berlanjut. Dampaknya signifikan. Hal-hal ini tetap benar dalam setiap register. Yang berubah adalah bentuknya. Apakah kamu menyampaikan kebenaran inti dengan penguat atau pelembut? Apakah kamu membuka dengan basa-basi relasional, atau langsung ke intinya? Apakah kamu membingkai masalah sebagai masalah bersama atau sebagai vonis terhadap orang tersebut? Apakah kamu membangun jalur yang menjaga muka menuju pemulihan, atau meninggalkan koreksi menggantung di udara? Terjemahkan, jangan encerkan. Tujuannya adalah agar kebenaran tiba — bukan agar kebenaran menghilang ke dalam kesopanan.",
    },
    {
      num: "04",
      title: "Rencanakan sinyal non-verbal dan tindak lanjut",
      body: `Percakapan umpan balik lintas budaya jarang berakhir dengan bersih. Dalam banyak budaya umpan balik tidak langsung, respons segera tidak akan memberi tahu kamu apakah pesan telah diterima. Persetujuan di ruangan mungkin tidak berarti persetujuan tentang masalah atau komitmen untuk berubah. Dan keheningan, dalam banyak konteks, tidak netral — itu bisa menjadi sinyal paling signifikan dalam percakapan. Rencanakan untuk menindaklanjuti. Tidak segera — beri orang tersebut waktu untuk memproses. Tetapi dalam hari-hari setelah percakapan yang sulit, kembali dengan lembut: "Saya ingin memeriksa setelah percakapan kita minggu lalu. Bagaimana kamu menyikapinya?" Ini bukan tekanan — ini adalah kelanjutan dari kerangka relasional yang membuat koreksi menjadi mungkin pertama kali. Dan di beberapa budaya, tindak lanjutlah, bukan percakapan awal, yang membawa bobot.`,
    },
  ],
};

// ─── Checklist data (Section 6) ───────────────────────────────────────────────
const CHECKLIST_COLS: Record<Lang, { col: string; title: string; items: string[] }[]> = {
  en: [
    {
      col: "BEFORE",
      title: "Before the Conversation",
      items: [
        "I have identified my own default feedback register (direct or indirect)",
        "I have considered the cultural context of the person I am speaking to, including their likely position on the Evaluating scale",
        "I know specifically what the core truth is that needs to be delivered -- written out in plain language before I adapt the form",
        "I have decided whether to deliver this in writing or in person, and why (in many indirect cultures, written correction feels more permanent and damaging than spoken)",
        "I have chosen a private setting, not a shared space where others could witness the conversation",
        "I have thought about how to open in a way that establishes relational safety before the critical content arrives",
        "I have considered whether an intermediary would strengthen this correction, and if so, who that person is",
        "I have thought about the pathway to restoration -- what does a good outcome look like for the person, not just for the issue?",
      ],
    },
    {
      col: "DURING",
      title: "In the Conversation",
      items: [
        "I opened with relational groundwork before getting to the specific critique (even if brief)",
        "I used the appropriate register: upgraders if direct feedback is expected and respected, downgraders if the person processes correction indirectly",
        "I named the specific issue in terms that are clear enough that the person could not walk away uncertain about what needs to change",
        "I framed the issue as a problem to solve together, not a verdict on the person",
        `I stayed curious about why the behavior occurred, not just what the behavior was (the "what were you trying to protect?" question)`,
        "I gave the person time to respond, and I read their non-verbal signals, not just their words",
        "I did not mistake composed silence for agreement, or maintained harmony for genuine reception",
        "I ended with a clear next step that belongs to the person being corrected, not a vague reassurance",
      ],
    },
    {
      col: "AFTER",
      title: "After the Conversation",
      items: [
        "I followed up within a few days, privately, to check how the person is sitting with the conversation",
        "I have taken note of any signals -- quietness, reduced engagement, shifts in team dynamics -- that suggest the correction may have landed harder than intended",
        "Where the correction revealed a misunderstanding rather than just a wrong behavior, I have addressed the understanding, not just the behavior",
        "I have done something visible that restores the person's dignity in the team -- affirmed their contribution publicly, included them in a decision, given them an opportunity to demonstrate the corrected standard",
        "I have reflected on whether my delivery was shaped more by my cultural default or by the specific needs of this person and this relationship",
      ],
    },
  ],
  id: [
    {
      col: "SEBELUM",
      title: "Sebelum Percakapan",
      items: [
        "Saya telah mengidentifikasi register umpan balik default saya sendiri (langsung atau tidak langsung)",
        "Saya telah mempertimbangkan konteks budaya orang yang saya ajak bicara, termasuk kemungkinan posisi mereka pada skala Evaluasi",
        "Saya tahu secara spesifik apa kebenaran inti yang perlu disampaikan -- ditulis dalam bahasa yang jelas sebelum saya menyesuaikan bentuknya",
        "Saya telah memutuskan apakah akan menyampaikan ini secara tertulis atau langsung, dan mengapa (dalam banyak budaya tidak langsung, koreksi tertulis terasa lebih permanen dan merusak daripada yang diucapkan)",
        "Saya telah memilih setting pribadi, bukan ruang bersama di mana orang lain bisa menyaksikan percakapan",
        "Saya telah memikirkan cara membuka yang membangun keamanan relasional sebelum konten kritis tiba",
        "Saya telah mempertimbangkan apakah perantara akan memperkuat koreksi ini, dan jika ya, siapa orang itu",
        "Saya telah memikirkan jalur menuju pemulihan -- seperti apa hasil yang baik bagi orang tersebut, bukan hanya bagi masalahnya?",
      ],
    },
    {
      col: "SELAMA",
      title: "Dalam Percakapan",
      items: [
        "Saya membuka dengan landasan relasional sebelum masuk ke kritik spesifik (meskipun singkat)",
        "Saya menggunakan register yang tepat: penguat jika umpan balik langsung diharapkan dan dihormati, pelembut jika orang tersebut memproses koreksi secara tidak langsung",
        "Saya menyebutkan masalah spesifik dalam istilah yang cukup jelas sehingga orang tersebut tidak bisa pergi tanpa yakin tentang apa yang perlu berubah",
        "Saya membingkai masalah sebagai masalah yang harus dipecahkan bersama, bukan vonis terhadap orang tersebut",
        `Saya tetap penasaran tentang mengapa perilaku itu terjadi, bukan hanya apa perilakunya (pertanyaan "apa yang kamu coba lindungi?")`,
        "Saya memberikan orang tersebut waktu untuk merespons, dan saya membaca sinyal non-verbal mereka, bukan hanya kata-kata mereka",
        "Saya tidak mengacaukan keheningan yang tenang dengan persetujuan, atau harmoni yang dipertahankan dengan penerimaan yang tulus",
        "Saya mengakhiri dengan langkah selanjutnya yang jelas milik orang yang dikoreksi, bukan jaminan yang samar",
      ],
    },
    {
      col: "SETELAH",
      title: "Setelah Percakapan",
      items: [
        "Saya menindaklanjuti dalam beberapa hari, secara pribadi, untuk memeriksa bagaimana orang tersebut menyikapi percakapan",
        "Saya telah memperhatikan sinyal apa pun -- keheningan, keterlibatan yang berkurang, pergeseran dalam dinamika tim -- yang menunjukkan koreksi mungkin mendarat lebih keras dari yang dimaksudkan",
        "Di mana koreksi mengungkapkan kesalahpahaman bukan hanya perilaku yang salah, saya telah mengatasi pemahaman, bukan hanya perilaku",
        "Saya telah melakukan sesuatu yang terlihat yang memulihkan martabat orang tersebut di tim -- menegaskan kontribusi mereka secara publik, melibatkan mereka dalam keputusan, memberi mereka kesempatan untuk menunjukkan standar yang dikoreksi",
        "Saya telah merefleksikan apakah penyampaian saya lebih dibentuk oleh default budaya saya atau oleh kebutuhan spesifik orang ini dan hubungan ini",
      ],
    },
  ],
};

// ─── Section 7 Faith Anchor paragraphs ───────────────────────────────────────
const FAITH_PARAS: Record<Lang, string[]> = {
  en: [
    `The Greek word that sits behind "speaking the truth in love" in Ephesians 4:15 is *aletheuon* — a word that carries the force of living or embodying truth, not merely stating accurate propositions. Paul was not writing a communication tip. He was describing the corporate life of a diverse church under pressure, and he was arguing that truth-speaking and love are not in tension — they are the same act, pursued faithfully.`,
    "This matters for cross-cultural feedback because the two distortions that corrupt feedback across cultural difference map precisely onto the two failures Paul is guarding against.",
    "The first distortion is truth without love: delivering accurate correction in a form that damages rather than restores, stripping a person of dignity in order to achieve behavioral compliance. This is what the German manager in Section 1 did without knowing it. The content was right; the carrying was destructive.",
    `The second distortion is love without truth: withholding correction to maintain surface harmony, letting a problem grow because naming it feels dangerous to the relationship. This is what Proverbs 27 is most direct about: "Better is open rebuke than hidden love. Faithful are the wounds of a friend; profuse are the kisses of an enemy." Withholding correction to preserve a relationship is not kindness, in the Hebrew wisdom tradition. It is what an enemy does.`,

    `*Aletheuon en agape* — living the truth in love — refuses both distortions. The question the phrase puts to every cross-cultural leader is not "did I say the true thing?" but "did I carry the true thing in a way that this person could actually receive it?"`,
    "Proverbs 27:5-6 holds an uncomfortable tension for leaders working in honor-shame cultures. Open rebuke — clear, named, direct — is presented as a mark of genuine friendship. And yet the cultural logic of communities shaped by shame-sensitivity and face-preservation makes open rebuke structurally damaging unless it comes through a pathway that also offers restored dignity. The question is not which of these is more biblical. Both are in the text. The question is how to honor both simultaneously — which is precisely what Nathan's method was designed to do.",
    `Jesus' graduated model in Matthew 18:15-17 — private first, then with witnesses, then community — is striking in how structurally compatible it is with high-context feedback principles. Begin with the least confrontational, most relational approach. Escalate only when necessary. And keep the goal clear: "you have won them back." Restoration is the target. Correction is the path to it, not the destination itself.`,

    `Nathan understood this at a level that deserves careful attention. He did not begin with "You are the man." He began with a story that built David's moral comprehension from the inside — drew him into the verdict before applying it to him. The parable was not evasion. It was preparation. The direct declaration, "You are the man," hit harder because of what preceded it. And notably: Nathan was not punishing David. He was restoring him. The correction was devastating, but the goal was not devastation.`,

    "There is a theological thread running through honor-shame scholarship that has direct implications for how correction is understood in global Christian contexts. In shame-oriented cultures — which include large portions of Asia, Africa, the Middle East, and Latin America — the gospel addresses shame through honor restoration. The adopted child receives a new name, a new status, a new standing before the community. Correction in these contexts, when it functions like the gospel, does not merely name a failure and demand changed behavior. It names the failure clearly, then offers a pathway back to dignity — not because the person earned it, but because restoration is what the gospel does.",
    "Correction without restoration in these contexts is not just culturally incomplete. It is theologically incomplete. It strips out the half of the gospel that such cultures are most equipped to understand.",
    "The practical implication: when you correct someone in a high-shame-sensitivity cultural context, the restoration is not optional — it is the point. The pathway back to honor before God and community is not an afterthought to the accountability. It is what makes the correction an act of love rather than an act of judgment.",
  ],
  id: [
    `Kata Yunani yang ada di balik "berkata benar dalam kasih" dalam Efesus 4:15 adalah *aletheuon* — sebuah kata yang membawa kekuatan hidup atau mewujudkan kebenaran, bukan sekadar menyatakan proposisi yang akurat. Paulus tidak sedang menulis tips komunikasi. Ia menggambarkan kehidupan bersama sebuah jemaat yang beragam di bawah tekanan, dan ia berargumen bahwa berbicara kebenaran dan kasih tidak berada dalam ketegangan — keduanya adalah tindakan yang sama, dikejar dengan setia.`,
    "Ini penting untuk umpan balik lintas budaya karena dua distorsi yang merusak umpan balik lintas perbedaan budaya tepat memetakan dua kegagalan yang dijaga Paulus.",
    "Distorsi pertama adalah kebenaran tanpa kasih: menyampaikan koreksi yang akurat dalam bentuk yang merusak daripada memulihkan, menghilangkan martabat seseorang untuk mencapai kepatuhan perilaku. Inilah yang dilakukan manajer Jerman di Bagian 1 tanpa menyadarinya. Kontennya benar; penyampaiannya merusak.",
    `Distorsi kedua adalah kasih tanpa kebenaran: menahan koreksi untuk mempertahankan harmoni permukaan, membiarkan masalah tumbuh karena menyebutkannya terasa berbahaya bagi hubungan. Inilah yang paling langsung disebutkan Amsal 27: "Teguran yang terang-terangan lebih baik daripada kasih yang tersembunyi. Dapat dipercaya tikaman seorang sahabat; tetapi ciuman seorang musuh sangat banyak." Menahan koreksi untuk menjaga hubungan bukan kebaikan, dalam tradisi hikmat Ibrani. Itu adalah apa yang dilakukan musuh.`,

    `*Aletheuon en agape* — hidup dalam kebenaran dengan kasih — menolak kedua distorsi tersebut. Pertanyaan yang diajukan frasa ini kepada setiap pemimpin lintas budaya bukan "apakah saya mengatakan hal yang benar?" tetapi "apakah saya membawa hal yang benar dengan cara yang benar-benar bisa diterima orang ini?"`,
    "Amsal 27:5-6 memegang ketegangan yang tidak nyaman bagi pemimpin yang bekerja dalam budaya kehormatan-malu. Teguran yang terang-terangan — jelas, disebut, langsung — disajikan sebagai tanda persahabatan yang tulus. Namun logika budaya komunitas yang dibentuk oleh kepekaan malu dan pelestarian muka membuat teguran terbuka secara struktural merusak kecuali datang melalui jalur yang juga menawarkan martabat yang dipulihkan. Pertanyaannya bukan mana dari ini yang lebih biblika. Keduanya ada dalam teks. Pertanyaannya adalah bagaimana menghormati keduanya secara bersamaan — yang persis itulah yang dirancang metode Natan.",
    `Model bertahap Yesus dalam Matius 18:15-17 — pribadi terlebih dahulu, kemudian dengan saksi, kemudian komunitas — mencolok dalam seberapa kompatibel secara strukturalnya dengan prinsip-prinsip umpan balik berkonteks tinggi. Mulai dengan pendekatan yang paling tidak konfrontatif, paling relasional. Eskalasi hanya jika diperlukan. Dan jaga tujuan tetap jelas: "kamu telah mendapatkan mereka kembali." Pemulihan adalah targetnya. Koreksi adalah jalannya, bukan tujuan itu sendiri.`,

    `Natan memahami ini pada tingkat yang layak mendapat perhatian cermat. Ia tidak memulai dengan "Engkau sendiri orang itu." Ia memulai dengan sebuah kisah yang membangun pemahaman moral Daud dari dalam — menariknya ke dalam vonis sebelum menerapkannya padanya. Perumpamaan itu bukan penghindaran. Itu adalah persiapan. Deklarasi langsung, "Engkau sendiri orang itu," memukul lebih keras karena apa yang mendahuluinya. Dan perlu dicatat: Natan tidak menghukum Daud. Ia memulihkannya. Koreksi itu menghancurkan, tetapi tujuannya bukan kehancuran.`,

    "Ada benang teologis yang mengalir melalui beasiswa kehormatan-malu yang memiliki implikasi langsung tentang bagaimana koreksi dipahami dalam konteks Kristen global. Dalam budaya berorientasi malu — yang mencakup sebagian besar Asia, Afrika, Timur Tengah, dan Amerika Latin — injil mengatasi rasa malu melalui pemulihan kehormatan. Anak yang diadopsi menerima nama baru, status baru, kedudukan baru di hadapan komunitas. Koreksi dalam konteks ini, ketika berfungsi seperti injil, tidak hanya menyebutkan kegagalan dan menuntut perilaku yang berubah. Ini menyebutkan kegagalan dengan jelas, kemudian menawarkan jalur kembali ke martabat — bukan karena orang itu mendapatkannya, tetapi karena pemulihan adalah apa yang dilakukan injil.",
    "Koreksi tanpa pemulihan dalam konteks ini tidak hanya tidak lengkap secara budaya. Ini tidak lengkap secara teologis. Ini menanggalkan setengah dari injil yang paling siap dipahami oleh budaya-budaya tersebut.",
    "Implikasi praktisnya: ketika kamu mengoreksi seseorang dalam konteks budaya dengan kepekaan malu yang tinggi, pemulihan bukan opsional — itu adalah intinya. Jalur kembali kepada kehormatan di hadapan Allah dan komunitas bukan renungan terhadap akuntabilitas. Itu adalah apa yang membuat koreksi menjadi tindakan kasih daripada tindakan penghakiman.",
  ],
};

// ─── Section 8 Key Takeaways ──────────────────────────────────────────────────
const KEY_TAKEAWAYS: Record<Lang, { title: string; body: string }[]> = {
  en: [
    {
      title: "Feedback is never culturally neutral.",
      body: "The same words, delivered in the same tone, land differently depending on whether the recipient processes correction through a direct or indirect cultural logic. There is no universal feedback delivery that bypasses this.",
    },
    {
      title: "Communication style and feedback directness are two separate dials.",
      body: "Never assume that because someone is a high-context communicator, they give or receive indirect feedback. Never assume that because someone communicates directly, they can receive a blunt critique comfortably. These two variables move independently, and missing the gap between them is one of the most common causes of cross-cultural feedback failure.",
    },
    {
      title: "Upgraders intensify; downgraders soften.",
      body: `The choice of language encodes cultural assumptions before the content lands. A correction that uses "completely," "absolutely," and declarative finality is a different message in Japan than in Germany — even if the words are identical. Learning to read and adjust the intensity of your language is the most immediately actionable skill this module teaches.`,
    },
    {
      title: "In honor-shame cultures, correction without a pathway to restored dignity often causes more damage than no correction at all.",
      body: "The biblical call to open rebuke and the cultural reality of shame-sensitivity are not opposed — they require each other. Correction that names the failure without offering restored honor is incomplete both culturally and theologically.",
    },
    {
      title: `Nathan did not begin with "You are the man." He began with a story.`,
      body: "The indirect path is not evasion — it is the preparation that makes the direct truth receivable. The most powerful correction in Scripture used a parable first, built comprehension second, and named the application third. That sequence is not incidental. It is the method.",
    },
  ],
  id: [
    {
      title: "Umpan balik tidak pernah netral secara budaya.",
      body: "Kata-kata yang sama, disampaikan dengan nada yang sama, mendarat secara berbeda tergantung apakah penerima memproses koreksi melalui logika budaya langsung atau tidak langsung. Tidak ada penyampaian umpan balik universal yang melewati hal ini.",
    },
    {
      title: "Gaya komunikasi dan ketegasan umpan balik adalah dua skala terpisah.",
      body: "Jangan pernah berasumsi bahwa karena seseorang adalah komunikator berkonteks tinggi, mereka memberi atau menerima umpan balik tidak langsung. Jangan pernah berasumsi bahwa karena seseorang berkomunikasi secara langsung, mereka bisa menerima kritik yang blak-blakan dengan nyaman. Dua variabel ini bergerak secara independen, dan melewatkan kesenjangan di antara keduanya adalah salah satu penyebab paling umum kegagalan umpan balik lintas budaya.",
    },
    {
      title: "Penguat mengintensifkan; pelembut memperlunak.",
      body: `Pilihan bahasa mengkodekan asumsi budaya sebelum konten mendarat. Koreksi yang menggunakan "sepenuhnya," "sama sekali," dan finalitas deklaratif adalah pesan yang berbeda di Jepang daripada di Jerman — meskipun kata-katanya identik. Belajar membaca dan menyesuaikan intensitas bahasamu adalah keterampilan yang paling segera dapat ditindaklanjuti yang diajarkan modul ini.`,
    },
    {
      title: "Dalam budaya kehormatan-malu, koreksi tanpa jalur menuju martabat yang dipulihkan sering menyebabkan lebih banyak kerusakan daripada tidak ada koreksi sama sekali.",
      body: "Seruan biblika untuk teguran terbuka dan kenyataan budaya tentang kepekaan malu tidak berlawanan — keduanya saling membutuhkan. Koreksi yang menyebutkan kegagalan tanpa menawarkan kehormatan yang dipulihkan tidak lengkap baik secara budaya maupun teologis.",
    },
    {
      title: `Natan tidak memulai dengan "Engkau sendiri orang itu." Ia memulai dengan sebuah kisah.`,
      body: "Jalan tidak langsung bukan penghindaran — ini adalah persiapan yang membuat kebenaran langsung dapat diterima. Koreksi paling kuat dalam Kitab Suci menggunakan perumpamaan terlebih dahulu, membangun pemahaman kedua, dan menyebutkan penerapan ketiga. Urutan itu bukan kebetulan. Itu adalah metodenya.",
    },
  ],
};

// ─── Section 9 From the Field ─────────────────────────────────────────────────
const FIELD_STORIES: Record<Lang, { title: string; subtitle: string; paras: string[] }[]> = {
  en: [
    {
      title: '"He was fine. He resigned the next morning."',
      subtitle: "Composite -- Southeast Asian organizational context",
      paras: [
        "I had been managing the regional operations team for about eight months when the pattern started showing up in performance reviews. One of my strongest local managers — I will call him Arif — was consistently producing outcomes that were below what I knew he was capable of. The numbers were fine on paper. The downstream work was not.",
        "I decided to address it directly. Arif and I had a good working relationship, I thought. We met weekly. He always had something useful to add in team discussions. I pulled him into a meeting room one afternoon and walked him through what I was observing: specific deliverables that had come in below standard, timelines missed, a pattern that was starting to affect the team's output. I was specific. I was clear. I told him what needed to change and by when.",
        `He was attentive throughout. Took notes. Said, "Yes, I understand. I will work on this." Thanked me for being direct. I left the meeting feeling that it had gone about as well as a difficult conversation could.`,

        "Two weeks later, Arif's line manager came to me with an administrative question about notice periods. Arif had submitted his resignation the same afternoon as our meeting.",
        "I did not understand it. I had done everything right — I had been specific, private, professional. I had not been unkind. But what I had not understood was what the meeting communicated to Arif beyond its explicit content. The fact that I had kept notes, that I had referenced a pattern across multiple weeks, that I named specific deliverables by date — this told him that his performance was being tracked and documented at a level that, in his cultural logic, meant his position was in question. The meeting was not feedback. It was a warning he could not respond to without losing face. He processed it as a door closing, not a path opening.",
        `What I would do differently: I would not have come with notes. I would have opened with a genuine question — "I want to understand what has been challenging about this last quarter" — and let him tell me what was in the way before I named what I was observing. I would have built the corrective frame around a shared problem rather than a documented pattern. And I would have made clear, in words, that the conversation was between us — that I was bringing this to him first because I believed in his ability to solve it.`,
      ],
    },
    {
      title: "The Translator in the Room",
      subtitle: "Composite -- East African NGO context",
      paras: [
        "We had a funding review coming up, and I knew — because multiple people had told me indirectly — that there were concerns about how Daniel, one of our senior program officers, was presenting outcomes data to donors. Nothing false. But consistently shaped to look better than the underlying reality.",
        "I had tried to raise it once before in a team meeting. Nothing came of it. Daniel had smiled and agreed with the process feedback I gave; the reports had not changed.",
        "A colleague suggested I speak to David first. David had been with the organization for twelve years, was respected by everyone on the team, and had a long-standing personal relationship with Daniel. I was hesitant — it felt like I was outsourcing a difficult conversation. But I agreed.",
        "David came back to me two days later. He had spoken with Daniel. The conversation had apparently been straightforward — David had described the situation as a risk to the organization and asked Daniel to make changes. Daniel had listened to David in a way he had not listened to me. The following reporting cycle was substantially better.",
        "I spent some time thinking about what the difference was. It was not that David had said something I could not have said. It was that David's voice carried relational weight that mine did not — weight built over twelve years of being present through difficult things, being trusted, being seen as someone whose concern came from genuine care for the organization and the people in it. My voice was accurate. David's voice was credible in a way mine was not yet.",
        "There is a version of this story where I resist using an intermediary because it feels like it compromises my authority as a manager. That version ends with a funding review conversation that is much harder than it needed to be.",
      ],
    },
    {
      title: "Getting the Reframe Wrong (and Then Right)",
      subtitle: "Composite -- Northern European and East Asian team context",
      paras: [
        "I am Dutch. I have been working in multicultural teams in Southeast Asia for nearly a decade, and I still get this wrong regularly enough that I am not sure the learning ever becomes automatic.",
        `The moment I want to describe happened during a virtual project review. A Korean colleague had submitted a deliverable that was genuinely not ready — the core analysis was missing a dimension that we had explicitly agreed would be included. I knew this. The team lead knew this. In the call, I said something like: "I think there might be a few areas here that could be developed a bit further before we finalize — especially the comparative piece."`,
        `I thought I was being kind. In Dutch terms, I was being almost embarrassingly gentle.`,
        `My Korean colleague heard, I would learn later, "this is not ready and I have said so in front of the team." The "comparative piece" was a specific enough reference that it pointed at a clear gap. The "before we finalize" implied a deadline problem. And the "might" and "a bit further" did not soften it enough to prevent the group-facing element from landing as a public correction.`,
        `After the call, a mutual colleague told me what had happened. I went back to my Korean colleague privately, opened by saying that I was aware the way I had raised the feedback in the group setting had probably not been how it should have gone, and asked if we could work through the deliverable together. I said — and this felt important to say explicitly — that the gap in the analysis was not a reflection on their competence; I had probably not been clear enough in the initial brief about what "comparative" meant.`,
        "This was partially true and mostly strategic, but it was not dishonest. It was a face-restoring move that offered my colleague a way to correct the work without the correction sitting on top of a public loss of standing.",
        "The deliverable came back two days later. It was excellent.",
        `What I had learned: in indirect feedback cultures, "gentle" by my standards is not the same as gentle by theirs. And the group setting changes everything — what felt to me like a low-key comment in a meeting was, from the other side, a correction made in front of peers. The register of the delivery and the setting of the delivery both have to be right, or neither is.`,
      ],
    },
  ],
  id: [
    {
      title: '"Dia baik-baik saja. Ia mengundurkan diri keesokan paginya."',
      subtitle: "Komposit -- Konteks organisasi Asia Tenggara",
      paras: [
        "Saya telah mengelola tim operasi regional selama sekitar delapan bulan ketika pola itu mulai muncul dalam tinjauan kinerja. Salah satu manajer lokal saya yang paling kuat — saya akan menyebutnya Arif — secara konsisten menghasilkan hasil yang di bawah yang saya tahu mampu ia capai. Angkanya baik di atas kertas. Pekerjaan hilir tidak.",
        "Saya memutuskan untuk mengatasinya secara langsung. Arif dan saya memiliki hubungan kerja yang baik, pikir saya. Kami bertemu setiap minggu. Ia selalu punya sesuatu yang berguna untuk ditambahkan dalam diskusi tim. Saya menariknya ke ruang rapat suatu sore dan menjelaskan apa yang saya amati: hasil-hasil spesifik yang masuk di bawah standar, tenggat waktu yang terlewat, pola yang mulai mempengaruhi output tim. Saya spesifik. Saya jelas. Saya memberitahunya apa yang perlu berubah dan kapan.",
        `Ia penuh perhatian sepanjang waktu. Mencatat. Berkata, "Ya, saya mengerti. Saya akan mengerjakan ini." Berterima kasih karena saya bersikap langsung. Saya meninggalkan pertemuan dengan perasaan bahwa itu berjalan sebaik yang bisa dilakukan percakapan yang sulit.`,
        "Dua minggu kemudian, manajer lini Arif datang kepada saya dengan pertanyaan administratif tentang periode pemberitahuan. Arif telah mengajukan pengunduran dirinya pada sore yang sama dengan pertemuan kami.",
        "Saya tidak mengerti. Saya telah melakukan segalanya dengan benar — saya telah spesifik, pribadi, profesional. Saya tidak tidak baik. Tetapi apa yang tidak saya pahami adalah apa yang dikomunikasikan pertemuan itu kepada Arif di luar konten eksplisitnya. Fakta bahwa saya telah membuat catatan, bahwa saya telah merujuk pola selama beberapa minggu, bahwa saya menyebutkan hasil-hasil spesifik berdasarkan tanggal — ini memberitahunya bahwa kinerjanya sedang dilacak dan didokumentasikan pada tingkat yang, dalam logika budayanya, berarti posisinya dipertanyakan. Pertemuan itu bukan umpan balik. Itu adalah peringatan yang tidak bisa ia tanggapi tanpa kehilangan muka. Ia memprosesnya sebagai pintu yang menutup, bukan jalan yang terbuka.",
        `Apa yang akan saya lakukan secara berbeda: Saya tidak akan datang dengan catatan. Saya akan membuka dengan pertanyaan yang tulus — "Saya ingin memahami apa yang telah menantang selama kuartal terakhir ini" — dan membiarkan ia memberitahu saya apa yang ada di jalan sebelum saya menyebutkan apa yang saya amati. Saya akan membangun kerangka korektif di sekitar masalah bersama daripada pola yang terdokumentasi. Dan saya akan memperjelas, dalam kata-kata, bahwa percakapan tersebut antara kami — bahwa saya membawa ini kepadanya terlebih dahulu karena saya percaya pada kemampuannya untuk menyelesaikannya.`,
      ],
    },
    {
      title: "Penerjemah di Ruangan",
      subtitle: "Komposit -- Konteks LSM Afrika Timur",
      paras: [
        "Kami akan menghadapi tinjauan pendanaan, dan saya tahu — karena beberapa orang telah memberitahu saya secara tidak langsung — bahwa ada kekhawatiran tentang bagaimana Daniel, salah satu petugas program senior kami, mempresentasikan data hasil kepada donor. Tidak ada yang salah. Tetapi secara konsisten dibentuk untuk terlihat lebih baik dari kenyataan dasarnya.",
        "Saya telah mencoba mengangkatnya sekali sebelumnya dalam rapat tim. Tidak ada yang terjadi. Daniel telah tersenyum dan setuju dengan umpan balik proses yang saya berikan; laporan-laporan tidak berubah.",
        "Seorang kolega menyarankan saya untuk berbicara dengan David terlebih dahulu. David telah bersama organisasi selama dua belas tahun, dihormati oleh semua orang di tim, dan memiliki hubungan pribadi yang sudah lama dengan Daniel. Saya ragu — rasanya seperti saya mengalihdayakan percakapan yang sulit. Tetapi saya setuju.",
        "David kembali kepada saya dua hari kemudian. Ia telah berbicara dengan Daniel. Percakapan itu tampaknya lugas — David telah menggambarkan situasinya sebagai risiko bagi organisasi dan meminta Daniel untuk melakukan perubahan. Daniel telah mendengarkan David dengan cara yang tidak ia lakukan kepada saya. Siklus pelaporan berikutnya jauh lebih baik.",
        "Saya menghabiskan waktu untuk memikirkan apa perbedaannya. Bukan bahwa David telah mengatakan sesuatu yang tidak bisa saya katakan. Adalah bahwa suara David membawa bobot relasional yang tidak dimiliki suara saya — bobot yang dibangun selama dua belas tahun hadir melalui hal-hal yang sulit, dipercaya, dilihat sebagai seseorang yang kepeduliannya berasal dari kepedulian tulus terhadap organisasi dan orang-orang di dalamnya. Suara saya akurat. Suara David dapat dipercaya dengan cara yang belum dimiliki suara saya.",
        "Ada versi cerita ini di mana saya menolak menggunakan perantara karena rasanya seperti mengkompromikan otoritas saya sebagai manajer. Versi itu berakhir dengan percakapan tinjauan pendanaan yang jauh lebih sulit dari yang seharusnya.",
      ],
    },
    {
      title: "Salah Melakukan Reframe (dan Kemudian Benar)",
      subtitle: "Komposit -- Konteks tim Eropa Utara dan Asia Timur",
      paras: [
        "Saya orang Belanda. Saya telah bekerja dalam tim multikultural di Asia Tenggara selama hampir satu dekade, dan saya masih sering melakukan kesalahan ini sehingga saya tidak yakin pembelajaran itu pernah menjadi otomatis.",
        `Momen yang ingin saya ceritakan terjadi selama tinjauan proyek virtual. Seorang kolega Korea telah menyerahkan hasil yang sungguh-sungguh belum siap — analisis inti kehilangan dimensi yang secara eksplisit kami setujui akan disertakan. Saya tahu ini. Pemimpin tim tahu ini. Dalam panggilan itu, saya mengatakan sesuatu seperti: "Saya pikir mungkin ada beberapa area di sini yang bisa dikembangkan sedikit lebih lanjut sebelum kita finalisasi — terutama bagian komparatif."`,
        "Saya pikir saya bersikap baik. Dalam istilah Belanda, saya hampir memalukan betapa lembutnya saya.",
        `Kolega Korea saya mendengar, seperti yang saya pelajari kemudian, "ini belum siap dan saya telah mengatakan demikian di depan tim." "Bagian komparatif" adalah referensi yang cukup spesifik sehingga menunjuk pada celah yang jelas. "Sebelum kita finalisasi" mengimplikasikan masalah tenggat waktu. Dan "mungkin" dan "sedikit lebih lanjut" tidak cukup melembutkannya untuk mencegah elemen yang menghadap kelompok mendarat sebagai koreksi publik.`,

        `Setelah panggilan, seorang kolega bersama memberitahu saya apa yang terjadi. Saya kembali kepada kolega Korea saya secara pribadi, membuka dengan mengatakan bahwa saya menyadari cara saya mengangkat umpan balik dalam setting kelompok mungkin tidak seperti yang seharusnya, dan bertanya apakah kita bisa mengerjakan hasilnya bersama. Saya berkata — dan ini terasa penting untuk dikatakan secara eksplisit — bahwa celah dalam analisis bukan cerminan kompetensi mereka; saya mungkin tidak cukup jelas dalam arahan awal tentang apa arti "komparatif."`,
        "Ini sebagian benar dan sebagian besar strategis, tetapi tidak tidak jujur. Itu adalah gerakan pemulihan muka yang memberikan kolega saya cara untuk mengoreksi pekerjaan tanpa koreksi berada di atas kehilangan kedudukan publik.",
        "Hasilnya kembali dua hari kemudian. Itu luar biasa.",
        `Apa yang telah saya pelajari: dalam budaya umpan balik tidak langsung, "lembut" menurut standar saya tidak sama dengan lembut menurut standar mereka. Dan setting kelompok mengubah segalanya — apa yang bagi saya terasa seperti komentar yang tidak mencolok dalam rapat, dari sisi lain, adalah koreksi yang dibuat di depan rekan-rekan. Register penyampaian dan setting penyampaian keduanya harus benar, atau tidak satupun yang benar.`,

      ],
    },
  ],
};

// ─── Further Reading data ─────────────────────────────────────────────────────
const FURTHER_READING = [
  { author: "Erin Meyer", title: "The Culture Map", pub: "PublicAffairs, 2014", desc: { en: "Foundational reading on the Communicating and Evaluating scales, with practical tools for navigating cultural differences in feedback delivery.", id: "Bacaan dasar tentang skala Komunikasi dan Evaluasi, dengan alat praktis untuk menavigasi perbedaan budaya dalam penyampaian umpan balik." } },
  { author: "E. Randolph Richards and Brandon J. O'Brien", title: "Misreading Scripture with Western Eyes", pub: "IVP, 2012", desc: { en: "How Western individualist assumptions shape Bible reading, with direct relevance to cross-cultural correction and accountability.", id: "Bagaimana asumsi individualis Barat membentuk pembacaan Alkitab, dengan relevansi langsung untuk koreksi dan akuntabilitas lintas budaya." } },
  { author: "Jayson Georges", title: "The 3D Gospel", pub: "Timē Press, 2014", desc: { en: "Concise framework for guilt-innocence, shame-honor, and fear-power cultural worldviews, with implications for how correction and restoration function across cultures.", id: "Kerangka ringkas untuk pandangan dunia budaya rasa bersalah-tidak bersalah, malu-kehormatan, dan ketakutan-kekuasaan, dengan implikasi tentang bagaimana koreksi dan pemulihan berfungsi lintas budaya." } },
  { author: "Edward T. Hall", title: "Beyond Culture", pub: "Anchor Press/Doubleday, 1976", desc: { en: "Foundational text on high-context and low-context communication; best read alongside Meyer's refinement of the framework.", id: "Teks dasar tentang komunikasi berkonteks tinggi dan rendah; paling baik dibaca bersama penyempurnaan kerangka Meyer." } },
  { author: "Maurice A. Buford", title: "The Nathan Factor: The Art of Speaking Truth to Power", pub: "Journal of Biblical Perspectives in Leadership, Vol. 2, No. 2 (2009)", desc: { en: "Academic analysis of Nathan's five-part correction method as a model for cross-cultural accountability.", id: "Analisis akademis tentang metode koreksi lima bagian Natan sebagai model akuntabilitas lintas budaya." } },
];

// ─── GivingFeedbackSpectrum SVG component ────────────────────────────────────
function GivingFeedbackSpectrum({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const BAND1_Y = 148, BAND1_H = 18, BAND1_MID = 157;
  const BAND2_Y = 312, BAND2_H = 18, BAND2_MID = 321;
  const ROW_A = 110, ROW_B = 78, ROW_C = 255;
  const ROW_D = 360, ROW_E = 330, ROW_F = 430;
  const X0 = 60, X1 = 740;
  const labelStyle = { fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700 as const, letterSpacing: "1.5px", fill: "oklch(30% 0.10 260)" };
  const axisStyle = { fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700 as const, letterSpacing: "1.2px", fill: "oklch(52% 0.06 260)" };
  const cultureStyle = { fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600 as const, fill: NAVY };
  const leaderStroke = { stroke: "oklch(65% 0.06 260)", strokeWidth: 0.8 };

  const b1Cultures = [
    { x: 60, row: "B", en: "Israel", id: "Israel" },
    { x: 117, row: "A", en: "Germany", id: "Jerman" },
    { x: 174, row: "C", en: "Netherlands", id: "Belanda" },
    { x: 231, row: "B", en: "France", id: "Prancis" },
    { x: 288, row: "A", en: "Australia", id: "Australia" },
    { x: 345, row: "C", en: "USA", id: "AS" },
    { x: 402, row: "A", en: "UK", id: "Inggris" },
    { x: 459, row: "B", en: "Brazil", id: "Brasil" },
    { x: 516, row: "A", en: "Nigeria", id: "Nigeria" },
    { x: 573, row: "C", en: "Kenya", id: "Kenya" },
    { x: 630, row: "B", en: "S. Korea", id: "Korea Sel." },
    { x: 687, row: "A", en: "Indonesia", id: "Indonesia" },
    { x: 744, row: "C", en: "Japan", id: "Jepang" },
  ];

  const b2Cultures = [
    { x: 75, row: "E", en: "Germany", id: "Jerman" },
    { x: 132, row: "D", en: "Australia", id: "Australia" },
    { x: 189, row: "F", en: "Netherlands", id: "Belanda" },
    { x: 258, row: "E", en: "USA", id: "AS" },
    { x: 321, row: "D", en: "UK", id: "Inggris" },
    { x: 390, row: "F", en: "Nigeria", id: "Nigeria" },
    { x: 447, row: "E", en: "Kenya", id: "Kenya" },
    { x: 510, row: "D", en: "Brazil", id: "Brasil" },
    { x: 573, row: "F", en: "S. Korea", id: "Korea Sel." },
    { x: 636, row: "E", en: "Indonesia", id: "Indonesia" },
    { x: 693, row: "D", en: "France", id: "Prancis" },
    { x: 744, row: "F", en: "Japan", id: "Jepang" },
  ];

  const getB1LabelY = (row: string) => row === "A" ? ROW_A : row === "B" ? ROW_B : ROW_C;
  const getB2LabelY = (row: string) => row === "D" ? ROW_D : row === "E" ? ROW_E : ROW_F;

  return (
    <figure style={{ margin: "32px 0 0" }}>
      <svg
        aria-hidden="true"
        viewBox="0 0 800 510"
        style={{ width: "100%", maxWidth: 800, display: "block", margin: "0 auto", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="gf-eval-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1B3A6B" />
            <stop offset="40%" stopColor="#4a6a9e" />
            <stop offset="75%" stopColor="#b8c8df" />
            <stop offset="100%" stopColor="#F8F7F4" />
          </linearGradient>
          <linearGradient id="gf-comm-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F8F7F4" />
            <stop offset="30%" stopColor="#b8c8df" />
            <stop offset="65%" stopColor="#4a6a9e" />
            <stop offset="100%" stopColor="#1B3A6B" />
          </linearGradient>
          <marker id="gf-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#1B3A6B" />
          </marker>
        </defs>

        {/* Band 1 zone labels */}
        <text x={X0 + 8} y={34} textAnchor="start" {...labelStyle}>{t("UPGRADER -- DIRECT", "PENGUAT -- LANGSUNG")}</text>
        <text x={X1 - 8} y={34} textAnchor="end" {...labelStyle}>{t("DOWNGRADER -- INDIRECT", "PELEMBUT -- TIDAK LANGSUNG")}</text>
        {/* Band 1 axis label */}
        <text x={400} y={138} textAnchor="middle" {...axisStyle}>{t("EVALUATING SCALE (Meyer)", "SKALA EVALUASI (Meyer)")}</text>
        {/* Band 1 gradient bar */}
        <rect x={X0} y={BAND1_Y} width={X1 - X0} height={BAND1_H} fill="url(#gf-eval-grad)" />

        {/* Band 1 cultures */}
        {b1Cultures.map((c) => {
          const labelY = getB1LabelY(c.row);
          const isUp = c.row !== "C";
          return (
            <g key={`b1-${c.x}`}>
              {/* Square glyph */}
              <rect x={c.x - 5} y={BAND1_MID - 5} width={10} height={10} fill={NAVY} />
              {/* Leader line */}
              {isUp
                ? <line x1={c.x} y1={BAND1_MID - 5} x2={c.x} y2={labelY + 4} {...leaderStroke} />
                : <line x1={c.x} y1={BAND1_MID + 5} x2={c.x} y2={labelY - 14} {...leaderStroke} />
              }
              {/* Label */}
              <text x={c.x} y={labelY} textAnchor="middle" {...cultureStyle}>{lang === "id" ? c.id : c.en}</text>
            </g>
          );
        })}

        {/* France divergence dashed connector */}
        <line x1="231" y1="175" x2="693" y2="305"
          stroke={ORANGE} strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" opacity="0.65" />
        <text x="462" y="238" textAnchor="middle"
          fontFamily={FONT_BODY} fontSize="11" fontWeight="700"
          letterSpacing="0.08em" fill={ORANGE} opacity="0.9">
          {t("FRANCE -- not where you expect", "PRANCIS -- bukan di posisi yang kamu duga")}
        </text>

        {/* Band 2 zone labels */}
        <text x={X0 + 8} y={298} textAnchor="start" {...labelStyle}>{t("LOW-CONTEXT", "KONTEKS RENDAH")}</text>
        <text x={X1 - 8} y={298} textAnchor="end" {...labelStyle}>{t("HIGH-CONTEXT", "KONTEKS TINGGI")}</text>
        {/* Band 2 axis label */}
        <text x={400} y={302} textAnchor="middle" {...axisStyle}>{t("COMMUNICATING SCALE (Meyer)", "SKALA KOMUNIKASI (Meyer)")}</text>
        {/* Band 2 gradient bar */}
        <rect x={X0} y={BAND2_Y} width={X1 - X0} height={BAND2_H} fill="url(#gf-comm-grad)" />

        {/* Band 2 cultures */}
        {b2Cultures.map((c) => {
          const labelY = getB2LabelY(c.row);
          const isUp = c.row !== "F";
          return (
            <g key={`b2-${c.x}`}>
              <circle cx={c.x} cy={BAND2_MID} r="6" fill={NAVY} />
              {isUp
                ? <line x1={c.x} y1={BAND2_MID - 6} x2={c.x} y2={labelY + 4} {...leaderStroke} />
                : <line x1={c.x} y1={BAND2_MID + 6} x2={c.x} y2={labelY - 14} {...leaderStroke} />
              }
              <text x={c.x} y={labelY} textAnchor="middle" {...cultureStyle}>{lang === "id" ? c.id : c.en}</text>
            </g>
          );
        })}

        {/* Legend strip */}
        <rect x="150" y="452" width="500" height="32" rx="8" fill="oklch(92% 0.008 80)" fillOpacity="0.7" />
        <rect x="180" y="462" width="10" height="10" fill={NAVY} />
        <text x="202" y="471" fontFamily={FONT_BODY} fontSize="12" fontWeight="500" fill={NAVY}>
          {t("Square = Evaluating scale (feedback directness)", "Kotak = Skala Evaluasi (keterusterangan umpan balik)")}
        </text>
        <circle cx="448" cy="467" r="5.5" fill={NAVY} />
        <text x="468" y="471" fontFamily={FONT_BODY} fontSize="12" fontWeight="500" fill={NAVY}>
          {t("Circle = Communicating scale (context richness)", "Lingkaran = Skala Komunikasi (kekayaan konteks)")}
        </text>
      </svg>
      <figcaption style={{ fontFamily: FONT_BODY, fontSize: 13, fontStyle: "italic", color: "oklch(48% 0.04 260)", lineHeight: 1.7, maxWidth: 640, margin: "20px auto 0", textAlign: "center" }}>
        {lang === "id"
          ? "Dua skala budaya yang independen. Kotak menandai skala Mengevaluasi (seberapa langsung umpan balik disampaikan); lingkaran menandai skala Komunikasi (seberapa banyak makna yang berjalan di luar kata-kata). Posisi Prancis — sangat kiri pada Evaluasi, sangat kanan pada Komunikasi — menunjukkan mengapa dua skala ini tidak bisa diasumsikan bergerak bersama. Posisi adalah kecenderungan, bukan aturan tetap."
          : "Two independent cultural scales. Squares track the Evaluating scale (how directly feedback is delivered); circles track the Communicating scale (how much meaning travels outside the words). France's position — far-left on Evaluating, far-right on Communicating — shows why the two scales cannot be assumed to move together. Positions are tendencies, not fixed rules."}
      </figcaption>
    </figure>
  );
}

// ─── ReframeTool component ────────────────────────────────────────────────────
function ReframeTool({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [inputs, setInputs] = useState<string[]>(["", "", ""]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const setInput = (i: number, v: string) => {
    const next = [...inputs]; next[i] = v; setInputs(next);
  };
  const reveal = (i: number) => {
    const next = [...revealed]; next[i] = true; setRevealed(next);
  };

  const containerStyle: CSSProperties = {
    background: "oklch(18% 0.09 260)",
    border: "1px solid oklch(30% 0.09 260)",
    borderRadius: 16,
    padding: "clamp(24px, 4vw, 40px)",
    marginBottom: 48,
  };
  const roundCard: CSSProperties = {
    background: "oklch(14% 0.07 260)",
    borderRadius: 12,
    padding: "24px 28px",
    marginBottom: 28,
  };
  const scenarioCard: CSSProperties = {
    background: "oklch(20% 0.09 260)",
    borderRadius: 10,
    padding: "20px 24px",
    marginBottom: 20,
    borderLeft: "3px solid oklch(40% 0.10 260)",
  };
  const revealCard: CSSProperties = {
    background: "oklch(16% 0.08 260)",
    borderRadius: 10,
    padding: "20px 24px",
    borderLeft: `3px solid ${ORANGE}`,
    marginTop: 16,
  };

  return (
    <div style={containerStyle}>
      <p style={{ ...eyebrow, marginBottom: 8 }}>{t("THE REFRAME -- 3 Rounds", "THE REFRAME -- 3 Babak")}</p>
      <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 600, color: OFF_WHITE, lineHeight: 1.2, margin: "0 0 16px" }}>
        {t("Translate the feedback", "Terjemahkan umpan baliknya")}
      </h3>
      <p style={{ ...proseDark, marginBottom: 28 }}>
        {t(
          "Three rounds of reframe practice. Each round asks you to take a piece of feedback apart, understand what it is doing culturally, and rebuild it in a different register without losing the truth inside it.",
          "Tiga babak latihan reframe. Setiap babak memintamu untuk membongkar sepotong umpan balik, memahami apa yang dilakukannya secara budaya, dan membangunnya kembali dalam register yang berbeda tanpa kehilangan kebenaran di dalamnya.",
        )}
      </p>

      {/* Rounds 1 and 2 */}
      {REFRAME_ROUNDS.map((round, idx) => (
        <div key={idx} style={roundCard}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: FONT_HEADLINE, fontSize: 44, fontWeight: 700, color: "oklch(35% 0.10 260)", lineHeight: 1 }}>{round.num}</span>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 800, color: OFF_WHITE, margin: "0 0 4px" }}>{round.title[lang]}</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: 0 }}>{round.ctx[lang]}</p>
            </div>
          </div>
          <div style={scenarioCard}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "oklch(60% 0.04 260)", margin: "0 0 8px" }}>{round.scenarioLabel[lang]}</p>
            <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: 17, color: "oklch(85% 0.04 260)", lineHeight: 1.7, margin: 0 }}>{round.scenario[lang]}</p>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "oklch(68% 0.04 260)", lineHeight: 1.6, marginBottom: 12 }}>{round.instruction[lang]}</p>
          {!revealed[idx] ? (
            <>
              <textarea
                value={inputs[idx]}
                onChange={(e) => setInput(idx, e.target.value)}
                placeholder={t("Write your reframe here...", "Tulis reframemu di sini...")}
                readOnly={revealed[idx]}
                style={{
                  width: "100%",
                  minHeight: 120,
                  background: "oklch(16% 0.08 260)",
                  border: "1.5px solid oklch(32% 0.09 260)",
                  borderRadius: 10,
                  padding: 16,
                  color: "oklch(85% 0.04 260)",
                  fontFamily: FONT_BODY,
                  fontSize: "clamp(16px, 1.8vw, 17px)",
                  lineHeight: 1.7,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  display: "block",
                  marginBottom: 12,
                }}
                aria-label={t(`Round ${round.num}: write your reframe`, `Babak ${round.num}: tulis reframemu`)}
              />
              <button
                onClick={() => reveal(idx)}
                disabled={!inputs[idx].trim()}
                style={{
                  background: "transparent",
                  border: "1px solid oklch(52% 0.10 260)",
                  borderRadius: 10,
                  padding: "12px 24px",
                  minHeight: 44,
                  color: "oklch(78% 0.04 260)",
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: inputs[idx].trim() ? "pointer" : "default",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: inputs[idx].trim() ? 1 : 0.45,
                  width: "100%",
                  justifyContent: "center",
                }}
                aria-live="polite"
              >
                {t("Show suggested reframe", "Tampilkan saran reframe")}
              </button>
            </>
          ) : (
            <>
              <textarea
                value={inputs[idx]}
                readOnly
                style={{
                  width: "100%",
                  minHeight: 120,
                  background: "oklch(16% 0.08 260)",
                  border: "1.5px solid oklch(32% 0.09 260)",
                  borderRadius: 10,
                  padding: 16,
                  color: "oklch(85% 0.04 260)",
                  fontFamily: FONT_BODY,
                  fontSize: "clamp(16px, 1.8vw, 17px)",
                  lineHeight: 1.7,
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  display: "block",
                  marginBottom: 12,
                  opacity: 0.65,
                }}
              />
              <div
                style={revealCard}
                aria-live="polite"
              >
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: ORANGE, margin: "0 0 8px" }}>{t("Suggested reframe", "Saran reframe")}</p>
                <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(16px, 1.9vw, 19px)", color: "oklch(88% 0.03 260)", lineHeight: 1.7, margin: "0 0 16px" }}>{round.reframe[lang]}</p>
                <div style={{ borderBottom: "1px solid oklch(28% 0.08 260)", margin: "0 0 16px" }} />
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "oklch(55% 0.04 260)", margin: "0 0 8px" }}>{round.explanationLabel[lang]}</p>
                {round.explanation[lang].split("\n\n").map((para, i) => (
                  <p key={i} style={{ fontFamily: FONT_BODY, fontSize: 14, color: "oklch(78% 0.04 260)", lineHeight: 1.8, margin: "0 0 12px" }}>{para}</p>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Round 3 -- reflection only */}
      <div style={roundCard}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
          <span style={{ fontFamily: FONT_HEADLINE, fontSize: 44, fontWeight: 700, color: "oklch(35% 0.10 260)", lineHeight: 1 }}>3</span>
          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 800, color: OFF_WHITE, margin: "0 0 4px" }}>{t("Your own context", "Konteksmu sendiri")}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE, margin: 0 }}>{t("Private reflection", "Refleksi pribadi")}</p>
          </div>
        </div>
        <div style={{ background: "oklch(20% 0.09 260)", borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
          <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: 17, color: "oklch(85% 0.04 260)", lineHeight: 1.7, margin: "0 0 12px" }}>
            {t("Think of a piece of feedback you have given -- or need to give.", "Pikirkan satu umpan balik yang pernah kamu berikan -- atau perlu kamu berikan.")}
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0 }}>
            {[
              t("Was it direct or indirect?", "Apakah itu langsung atau tidak langsung?"),
              t("Did you use upgraders or downgraders?", "Apakah kamu menggunakan penguat atau pelembut?"),
              t("Would it land differently for the person you gave it to?", "Apakah itu akan mendarat secara berbeda bagi orang yang kamu berikan?"),
            ].map((item, i) => (
              <li key={i} style={{ fontFamily: FONT_BODY, fontSize: 14, color: "oklch(72% 0.04 260)", lineHeight: 1.7, marginBottom: 4 }}>{item}</li>
            ))}
          </ul>
        </div>
        <textarea
          value={inputs[2]}
          onChange={(e) => setInput(2, e.target.value)}
          placeholder={t("This is private. Write freely.", "Ini bersifat pribadi. Tulislah dengan bebas.")}
          style={{
            width: "100%",
            minHeight: 140,
            background: "oklch(16% 0.08 260)",
            border: "1.5px solid oklch(32% 0.09 260)",
            borderRadius: 10,
            padding: 16,
            color: "oklch(85% 0.04 260)",
            fontFamily: FONT_BODY,
            fontSize: "clamp(16px, 1.8vw, 17px)",
            lineHeight: 1.7,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            display: "block",
            marginBottom: 8,
          }}
          aria-label={t("Round 3 private reflection", "Refleksi pribadi babak 3")}
        />
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontStyle: "italic", color: "oklch(55% 0.04 260)", lineHeight: 1.6 }}>
          {t("No submission. No scoring. This round is yours alone.", "Tidak ada pengiriman. Tidak ada penilaian. Babak ini hanya untukmu.")}
        </p>
      </div>
    </div>
  );
}

// ─── TwoLensComparison ────────────────────────────────────────────────────────
function TwoLensComparison({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const reduceMotion = useRef(false);
  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const tabRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];

  type LensData = { label: { en: string; id: string }; title: { en: string; id: string }; paras: { en: string[]; id: string[] }; insight?: { en: string; id: string } };
  const lensA = TWO_LENS.lens1 as unknown as LensData;
  const lensB = TWO_LENS.lens2 as unknown as LensData;

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      setActiveTab(1);
      tabRefs[1].current?.focus();
    } else if (e.key === "ArrowLeft") {
      setActiveTab(0);
      tabRefs[0].current?.focus();
    }
  }

  const tabBase: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(13px, 1.4vw, 14px)",
    fontWeight: 700,
    letterSpacing: "0.05em",
    border: "none",
    borderRadius: 999,
    padding: "10px 22px",
    minHeight: 44,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
  };

  return (
    <div style={{
      border: "1.5px solid oklch(80% 0.008 80)",
      borderRadius: 14,
      overflow: "hidden",
      maxWidth: 760,
      margin: "0 auto",
    }}>
      {/* Tab toggle bar */}
      <div
        role="tablist"
        aria-label={t("Feedback lens comparison", "Perbandingan lensa umpan balik")}
        style={{
          display: "flex",
          background: LIGHT_GRAY,
          padding: "6px 8px",
          gap: 4,
        }}
        onKeyDown={handleKey}
      >
        {[lensA.label[lang], lensB.label[lang]].map((label, i) => (
          <button
            key={i}
            role="tab"
            id={`gf-tab-${i}`}
            aria-selected={activeTab === i}
            aria-controls={`gf-panel-${i}`}
            ref={tabRefs[i] as React.RefObject<HTMLButtonElement>}
            tabIndex={activeTab === i ? 0 : -1}
            onClick={() => setActiveTab(i as 0 | 1)}
            style={{
              ...tabBase,
              background: activeTab === i ? NAVY : "transparent",
              color: activeTab === i ? OFF_WHITE : BODY_TEXT,
              flex: 1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {([lensA, lensB] as Array<{ label: { en: string; id: string }; title: { en: string; id: string }; paras: { en: string[]; id: string[] }; insight?: { en: string; id: string } }>).map((lens, i) => {
        const isActive = activeTab === i;
        return (
          <div
            key={i}
            role="tabpanel"
            id={`gf-panel-${i}`}
            aria-labelledby={`gf-tab-${i}`}
            hidden={!isActive}
            style={{
              background: OFF_WHITE,
              padding: "28px 32px 32px",
              opacity: isActive ? 1 : 0,
              transform: reduceMotion.current ? undefined : (isActive ? "translateX(0)" : "translateX(6px)"),
              transition: "opacity 0.2s, transform 0.2s",
            }}
          >
            {/* Header */}
            <p style={{ ...eyebrow, color: ORANGE }}>{lens.label[lang]}</p>
            <h3 style={{
              fontFamily: FONT_HEADLINE,
              fontSize: "clamp(20px, 2.4vw, 26px)",
              fontWeight: 700,
              color: NAVY,
              marginBottom: 8,
              marginTop: 0,
            }}>
              {lens.title[lang]}
            </h3>

            {/* Paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {lens.paras[lang].map((para: string, j: number) => (
                <p key={j} style={{ ...prose, marginBottom: 0 }}>{para}</p>
              ))}
            </div>

            {/* Key insight card (Lens B only) */}
            {lens.insight && (
              <div style={{
                marginTop: 24,
                borderLeft: `4px solid ${NAVY}`,
                background: "oklch(91% 0.010 260)",
                borderRadius: "0 10px 10px 0",
                padding: "16px 20px",
              }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 15px)", color: NAVY, lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
                  {lens.insight[lang]}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Closing — shown below the comparison regardless of active lens */}
      <div style={{
        background: OFF_WHITE,
        borderTop: `1px solid ${LIGHT_GRAY}`,
        padding: "20px 32px 28px",
      }}>
        <p style={{ ...prose, marginBottom: 0 }}>{TWO_LENS.closing[lang]}</p>
      </div>
    </div>
  );
}

// ─── NathanCaseStudy ──────────────────────────────────────────────────────────
function NathanCaseStudy({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const [cp1Choice, setCp1Choice] = useState<0 | 1 | null>(null);
  const [cp2Choice, setCp2Choice] = useState<0 | 1 | null>(null);
  const reduceMotion = useRef(false);
  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const branch = cp1Choice === null ? null : cp1Choice === 0 ? ("A" as const) : ("B" as const);

  const headingStyle: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(15px, 1.6vw, 16px)",
    fontWeight: 700,
    color: "oklch(78% 0.04 260)",
    marginBottom: 14,
    marginTop: 0,
  };
  const bodyStyle: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "clamp(14px, 1.5vw, 15px)",
    color: "oklch(78% 0.04 260)",
    lineHeight: 1.8,
    marginTop: 0,
    marginBottom: 14,
  };

  function renderChoice(
    options: [CaseChoice, CaseChoice],
    chosen: 0 | 1 | null,
    onChoose: (i: 0 | 1) => void,
  ) {
    const chosenOption = chosen !== null ? options[chosen] : null;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {options.map((opt, oi) => {
            const isChosen = chosen === oi;
            const isUnchosen = chosen !== null && chosen !== oi;
            return (
              <button
                key={oi}
                aria-pressed={isChosen}
                aria-disabled={isUnchosen || undefined}
                onClick={() => { if (!isUnchosen) onChoose(oi as 0 | 1); }}
                style={{
                  display: "block",
                  width: "100%",
                  minHeight: 44,
                  textAlign: "left",
                  padding: "12px 18px",
                  background: isChosen ? "oklch(28% 0.12 260)" : "oklch(20% 0.09 260)",
                  border: isChosen ? `2px solid ${ORANGE}` : "2px solid oklch(32% 0.09 260)",
                  borderRadius: 10,
                  fontFamily: FONT_BODY,
                  fontSize: "clamp(14px, 1.5vw, 15px)",
                  color: isUnchosen ? "oklch(45% 0.04 260)" : "oklch(80% 0.04 260)",
                  opacity: isUnchosen ? 0.4 : 1,
                  cursor: isUnchosen ? "default" : "pointer",
                  transition: reduceMotion.current ? "none" : "background 0.2s, border-color 0.2s, opacity 0.2s",
                }}
              >
                {opt.label[lang]}
              </button>
            );
          })}
        </div>
        {chosenOption && (
          <div style={{
            background: "oklch(16% 0.08 260)",
            border: "1.5px solid oklch(45% 0.12 160)",
            borderRadius: 12,
            padding: "20px 24px",
            transition: reduceMotion.current ? "none" : "opacity 0.3s",
          }}>
            {chosenOption.action[lang].map((p, i) => (
              <p key={`a${i}`} style={bodyStyle}>{p}</p>
            ))}
            <p style={{ ...bodyStyle, fontWeight: 700, color: "oklch(65% 0.08 160)" }}>
              {CASE_WHAT_NEXT[lang]}
            </p>
            {chosenOption.outcome[lang].map((p, i) => (
              <p key={`o${i}`} style={{ ...bodyStyle, marginBottom: i === chosenOption.outcome[lang].length - 1 ? 0 : 14 }}>{p}</p>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div role="group" aria-label={t("Nathan Case Study", "Studi Kasus Nathan")}>
      {/* Setup */}
      <div style={{
        background: "oklch(18% 0.09 260)",
        borderRadius: 14,
        padding: "24px 28px",
        marginBottom: 32,
      }}>
        <p style={{ ...eyebrow, color: ORANGE }}>{t("The Scenario", "Skenario")}</p>
        {CASE_SETUP[lang].map((p, i) => (
          <p key={i} style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 15px)", color: "oklch(78% 0.04 260)", lineHeight: 1.8, marginTop: 0, marginBottom: i === CASE_SETUP[lang].length - 1 ? 0 : 14 }}>
            {p}
          </p>
        ))}
      </div>

      {/* Choice Point 1 */}
      <div style={{ marginBottom: 36 }}>
        <p style={headingStyle}>{CASE_CP1.heading[lang]}</p>
        {renderChoice(CASE_CP1.options, cp1Choice, (i) => { setCp1Choice(i); setCp2Choice(null); })}
      </div>

      {/* Choice Point 2 — branch depends on Choice Point 1 */}
      {branch && (
        <div style={{ marginBottom: 36 }}>
          <p style={headingStyle}>{CASE_CP2[branch].heading[lang]}</p>
          <p style={bodyStyle}>{CASE_CP2[branch].intro[lang]}</p>
          {renderChoice(CASE_CP2[branch].options, cp2Choice, setCp2Choice)}
        </div>
      )}

      {/* Choice Point 3 — reflection prompts, no choice required */}
      {branch && cp2Choice !== null && (
        <div style={{ marginBottom: 8 }}>
          <p style={headingStyle}>{CASE_CP3.heading[lang]}</p>
          <p style={bodyStyle}>{CASE_CP3.intro[lang]}</p>
          <p style={{ ...bodyStyle, fontWeight: 700 }}>{CASE_CP3.promptsLabel[lang]}</p>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            {CASE_CP3.prompts[lang].map((p, i) => (
              <li key={i} style={{ ...bodyStyle, marginBottom: 0 }}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── FeedbackChecklist ────────────────────────────────────────────────────────
function FeedbackChecklist({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => lang === "id" ? id : en;
  const totalItems = CHECKLIST_COLS[lang].reduce((acc, col) => acc + col.items.length, 0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  const colColors = [
    { bg: "oklch(20% 0.10 180)", border: "oklch(35% 0.10 180)", label: "oklch(65% 0.12 180)" },
    { bg: "oklch(20% 0.10 260)", border: "oklch(35% 0.10 260)", label: "oklch(65% 0.12 260)" },
    { bg: "oklch(20% 0.10 45)",  border: "oklch(35% 0.10 45)",  label: "oklch(65% 0.12 45)"  },
  ];

  return (
    <div>
      {/* Progress indicator */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: "oklch(65% 0.04 260)" }}>
            {checked.size} / {totalItems} {t("completed", "selesai")}
          </span>
          {checked.size > 0 && (
            <button
              onClick={() => setChecked(new Set())}
              style={{ background: "none", border: "none", fontFamily: FONT_BODY, fontSize: 12, color: "oklch(55% 0.04 260)", cursor: "pointer", padding: 0, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center" }}
            >
              {t("Reset", "Setel ulang")}
            </button>
          )}
        </div>
        <div style={{ height: 4, background: "oklch(32% 0.08 260)", borderRadius: 2 }}>
          <div style={{ height: "100%", background: ORANGE, borderRadius: 2, width: `${totalItems > 0 ? (checked.size / totalItems) * 100 : 0}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
        alignItems: "start",
      }}>
        {CHECKLIST_COLS[lang].map((col, ci) => (
          <div key={ci} style={{
            background: colColors[ci].bg,
            border: `1.5px solid ${colColors[ci].border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {/* Column header */}
            <div style={{ padding: "12px 18px", borderBottom: `1px solid ${colColors[ci].border}` }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: colColors[ci].label }}>
                {col.col}
              </span>
              <p style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(16px, 1.8vw, 18px)", fontWeight: 700, color: "oklch(82% 0.04 260)", margin: "4px 0 0" }}>
                {col.title}
              </p>
            </div>

            {/* Items */}
            <ul style={{ listStyle: "none", margin: 0, padding: "12px 0" }}>
              {col.items.map((item, ii) => {
                const itemId = `gf-check-${ci}-${ii}`;
                const isChecked = checked.has(itemId);
                return (
                  <li key={ii}>
                    {/* 44×44 touch wrapper */}
                    <label
                      htmlFor={itemId}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 18px",
                        cursor: "pointer",
                        minHeight: 44,
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
                        <input
                          type="checkbox"
                          id={itemId}
                          checked={isChecked}
                          onChange={() => toggle(itemId)}
                          style={{ position: "absolute", opacity: 0, width: 20, height: 20, cursor: "pointer" }}
                        />
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          border: isChecked ? `2px solid oklch(48% 0.12 160)` : `2px solid ${colColors[ci].border}`,
                          background: isChecked ? "oklch(48% 0.12 160)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background 0.2s, border-color 0.2s",
                        }}>
                          {isChecked && (
                            <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
                              <path d="M1 4l3 3L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Label text */}
                      <span style={{
                        fontFamily: FONT_BODY,
                        fontSize: "clamp(13px, 1.4vw, 14px)",
                        color: isChecked ? "oklch(55% 0.04 260)" : "oklch(75% 0.04 260)",
                        lineHeight: 1.6,
                        textDecoration: isChecked ? "line-through" : "none",
                        transition: "color 0.2s",
                      }}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function GivingFeedbackClient({ isSaved, ...rest }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";
  const t = (en: string, id: string) => lang === "id" ? id : en;

  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveResourceToDashboard("giving-feedback-across-cultures");
      setSaved(true);
    });
  }

  // Section bg rhythm: NAVY / OFF_WHITE / NAVY / OFF_WHITE / NAVY / OFF_WHITE / NAVY / OFF_WHITE / OFF_WHITE
  const BG = [NAVY, OFF_WHITE, NAVY, OFF_WHITE, NAVY, OFF_WHITE, NAVY, OFF_WHITE, OFF_WHITE];
  const isDark = (i: number) => BG[i] === NAVY;

  return (
    <>
      <LangToggle />

      {/* ── Hero ── */}
      <section style={{ position: "relative", background: NAVY, padding: "80px 0 64px", overflow: "hidden" }}>
        <img
          src="/images/resources/giving-feedback-across-cultures/hero-prism.jpg"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity" }}
        />
        <div className="container-wide" style={{ position: "relative" }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Cross-Cultural -- Module", "Lintas Budaya -- Modul")}</p>
          <h1 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(34px, 5vw, 62px)", fontWeight: 700, color: OFF_WHITE, lineHeight: 1.1, marginBottom: 20, marginTop: 0 }}>
            {t("Giving Feedback Across Cultures", "Memberi Umpan Balik Lintas Budaya")}
          </h1>
          <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(17px, 2.2vw, 22px)", color: "oklch(82% 0.03 260)", lineHeight: 1.6, maxWidth: 580, marginBottom: 32 }}>
            {t(
              "The same truth — four different registers. Learning to translate feedback across cultural difference without losing what it needs to say.",
              "Kebenaran yang sama — empat register yang berbeda. Belajar menerjemahkan umpan balik lintas perbedaan budaya tanpa kehilangan apa yang perlu disampaikan.",
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            aria-label={t(saved ? "Saved to dashboard" : "Save to dashboard", saved ? "Tersimpan di dasbor" : "Simpan ke dasbor")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              minHeight: 44, padding: "10px 20px",
              background: "transparent", border: `1.5px solid ${saved ? ORANGE : "oklch(55% 0.04 260)"}`,
              borderRadius: 8, fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
              color: saved ? ORANGE : "oklch(70% 0.04 260)", cursor: saved ? "default" : "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={saved ? ORANGE : "none"} stroke={saved ? ORANGE : "currentColor"} strokeWidth="1.5" aria-hidden="true">
              <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z"/>
            </svg>
            {t(saved ? "Saved" : "Save to Dashboard", saved ? "Tersimpan" : "Simpan ke Dasbor")}
          </button>
        </div>
      </section>

      {/* ── S1: Opening vignette ── */}
      <section style={{ background: BG[0], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Where It Starts", "Di Mana Ia Dimulai")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: OFF_WHITE, marginBottom: 28, marginTop: 0 }}>
            {t("The Same Words, Different Worlds", "Kata yang Sama, Dunia yang Berbeda")}
          </h2>
          {VIGNETTE_PARAS[lang].map((p, i) => <p key={i} style={proseDark}>{p}</p>)}
        </div>
      </section>

      {/* ── S2: Two dials / Spectrum ── */}
      <section style={{ background: BG[1], padding: "72px 0" }}>
        <div className="container-wide">
          <p style={{ ...eyebrow }}>{t("Teaching", "Pengajaran")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: NAVY, marginBottom: 20, marginTop: 0 }}>
            {t("Two Dials, Not One", "Dua Skala, Bukan Satu")}
          </h2>
          {S2_PARAS[lang].map((p, i) => <p key={i} style={prose}>{p}</p>)}
          <GivingFeedbackSpectrum lang={lang} />
        </div>
      </section>

      {/* ── S3: Upgraders/Downgraders + ReframeTool ── */}
      <section style={{ background: BG[2], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 820 }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("The Reframe -- Interactive", "The Reframe -- Interaktif")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: OFF_WHITE, marginBottom: 20, marginTop: 0 }}>
            {t("Upgraders and Downgraders", "Penguat dan Pelembut")}
          </h2>
          {/* Upgrader/Downgrader table */}
          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)" }}>
              <thead>
                <tr>
                  {UDRG_TABLE.headers[lang].map((h, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", background: "oklch(18% 0.09 260)", color: "oklch(78% 0.04 260)", fontWeight: 700, borderBottom: "2px solid oklch(32% 0.09 260)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {UDRG_TABLE.rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "oklch(20% 0.09 260)" : "oklch(22% 0.09 260)" }}>
                    {[row.culture, row.pos, row.lang, row.example].map((cell: { en: string; id: string }, j: number) => (
                      <td key={j} style={{ padding: "10px 14px", color: "oklch(74% 0.04 260)", borderBottom: "1px solid oklch(28% 0.08 260)" }}>{cell[lang]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReframeTool lang={lang} />
        </div>
      </section>

      {/* ── S4: Silence ── */}
      <section style={{ background: BG[3], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <p style={{ ...eyebrow }}>{t("Teaching", "Pengajaran")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: NAVY, marginBottom: 20, marginTop: 0 }}>
            {t("When Silence Is the Feedback", "Ketika Keheningan Adalah Umpan Balik")}
          </h2>
          {S4_PARAS[lang].map((p, i) => <p key={i} style={prose}>{p}</p>)}
          <TwoLensComparison lang={lang} />
        </div>
      </section>

      {/* ── S5: Two Lens + Nathan ── */}
      <section style={{ background: BG[4], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("The Nathan Principle", "Prinsip Natan")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: OFF_WHITE, marginBottom: 20, marginTop: 0 }}>
            {t("The Nathan Principle", "Prinsip Natan")}
          </h2>
          {S5_PARAS[lang].map((p, i) => <p key={i} style={proseDark}>{p}</p>)}
          {/* Case Study */}
          <div style={{ marginTop: 40 }}>
            <p style={{ ...eyebrow, color: ORANGE }}>{t("Case Study", "Studi Kasus")}</p>
            <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.6vw, 32px)", fontWeight: 700, color: OFF_WHITE, marginBottom: 12, marginTop: 0 }}>
              {t("The James Scenario", "Skenario James")}
            </h3>
            <NathanCaseStudy lang={lang} />
          </div>
        </div>
      </section>

      {/* ── S6: Four-step process + Checklist ── */}
      <section style={{ background: BG[5], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <p style={{ ...eyebrow }}>{t("Practical Application", "Penerapan Praktis")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: NAVY, marginBottom: 32, marginTop: 0 }}>
            {t("The Reframe in Practice", "Reframe dalam Praktik")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 52 }}>
            {S6_STEPS[lang].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{
                  flexShrink: 0, width: 52, height: 52, borderRadius: 999,
                  background: NAVY, border: `2px solid ${ORANGE}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT_HEADLINE, fontSize: 20, fontWeight: 700, color: ORANGE,
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: NAVY, marginBottom: 8, marginTop: 0 }}>
                    {step.title}
                  </h3>
                  <p style={{ ...prose, marginBottom: 0 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Checklist */}
          <p style={{ ...eyebrow }}>{t("Pre- and Post-Conversation Checklist", "Daftar Periksa Pra dan Pasca Percakapan")}</p>
          <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.6vw, 32px)", fontWeight: 700, color: NAVY, marginBottom: 24, marginTop: 0 }}>
            {t("Your Feedback Preparation Guide", "Panduan Persiapan Umpan Balik Anda")}
          </h3>
          <FeedbackChecklist lang={lang} />
        </div>
      </section>

      {/* ── S7: Faith Anchor ── */}
      <section style={{ background: BG[6], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 760 }}>
          <p style={{ ...eyebrow, color: ORANGE }}>{t("Faith Anchor", "Jangkar Iman")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: OFF_WHITE, marginBottom: 20, marginTop: 0 }}>
            {t("The Truth That Wants to Be Received", "Kebenaran yang Ingin Diterima")}
          </h2>
          {FAITH_PARAS[lang].map((p, i) => <p key={i} style={proseDark}>{p}</p>)}
          <div style={{ background: "oklch(18% 0.09 260)", borderRadius: 12, padding: "24px 28px", borderLeft: `3px solid ${ORANGE}`, marginTop: 36 }}>
            <p style={{ ...eyebrow, color: ORANGE }}>{t("Reflection", "Refleksi")}</p>
            <p style={{ fontFamily: FONT_HEADLINE, fontStyle: "italic", fontSize: "clamp(17px, 2vw, 21px)", color: "oklch(82% 0.03 260)", lineHeight: 1.6, margin: 0 }}>
              {t(
                "Where has your own feedback style been shaped more by your culture than by the gospel?",
                "Di mana gaya umpan balikmu sendiri lebih dibentuk oleh budayamu daripada oleh Injil?",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── S8: Key Takeaways ── */}
      <section style={{ background: BG[7], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 820 }}>
          <p style={{ ...eyebrow }}>{t("Key Takeaways", "Poin-Poin Utama")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: NAVY, marginBottom: 32, marginTop: 0 }}>
            {t("What This Module Has Covered", "Apa yang Telah Dibahas Modul Ini")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {KEY_TAKEAWAYS[lang].map((item, i) => (
              <div key={i} style={{
                background: OFF_WHITE,
                border: `1.5px solid ${LIGHT_GRAY}`,
                borderLeft: `4px solid ${ORANGE}`,
                borderRadius: "0 10px 10px 0",
                padding: "18px 22px",
              }}>
                <h3 style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 1.5vw, 15px)", fontWeight: 700, color: NAVY, marginBottom: 6, marginTop: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: BODY_TEXT, lineHeight: 1.75, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S9: From the Field + Further Reading ── */}
      <section style={{ background: BG[8], padding: "72px 0" }}>
        <div className="container-wide" style={{ maxWidth: 820 }}>
          {/* From the Field */}
          <p style={{ ...eyebrow }}>{t("From the Field", "Dari Lapangan")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: NAVY, marginBottom: 32, marginTop: 0 }}>
            {t("What This Looks Like in Practice", "Seperti Apa Ini dalam Praktik")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 40, marginBottom: 60 }}>
            {FIELD_STORIES[lang].map((story, i) => (
              <article key={i} style={{
                background: "oklch(93% 0.005 80)",
                border: `1.5px solid ${LIGHT_GRAY}`,
                borderRadius: 14,
                padding: "28px 32px",
              }}>
                <p style={{ ...eyebrow }}>{story.subtitle}</p>
                <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 700, color: NAVY, marginBottom: 16, marginTop: 0 }}>
                  {story.title}
                </h3>
                {story.paras.map((p, j) => (
                  <p key={j} style={{ ...prose, marginBottom: j < story.paras.length - 1 ? 16 : 0 }}>{p}</p>
                ))}
              </article>
            ))}
          </div>

          {/* Further Reading */}
          <p style={{ ...eyebrow }}>{t("Further Reading", "Bacaan Lanjutan")}</p>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: "clamp(22px, 2.6vw, 32px)", fontWeight: 700, color: NAVY, marginBottom: 24, marginTop: 0 }}>
            {t("Sources and Recommended Texts", "Sumber dan Teks yang Direkomendasikan")}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {FURTHER_READING.map((ref, i) => (
              <li key={i} style={{
                background: OFF_WHITE,
                border: `1px solid ${LIGHT_GRAY}`,
                borderRadius: 10,
                padding: "16px 20px",
              }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", fontWeight: 700, color: NAVY, marginBottom: 4, marginTop: 0 }}>
                  {ref.author} — <em>{ref.title}</em>
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: "oklch(55% 0.05 260)", marginBottom: 6, marginTop: 0 }}>
                  {ref.pub}
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 1.4vw, 14px)", color: BODY_TEXT, lineHeight: 1.7, margin: 0 }}>
                  {ref.desc[lang]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}



