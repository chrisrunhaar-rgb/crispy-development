"use client";

import { useState, useTransition, useEffect } from "react";
import type { ReactNode, CSSProperties, ComponentType } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";
import { Compass, Scale, Users, BookOpen, HeartPulse, Mountain, Ship, ChevronDown } from "lucide-react";

type IconComponent = ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean | "true" | "false" }>;

// Latin cross (long upright, short crossbar). Lucide's "Cross" reads as a plus sign.
const CrossIcon: IconComponent = ({ size = 24, strokeWidth = 1.75, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M12 2.5v19M6.5 8.5h11" />
  </svg>
);

type Lang = "en" | "id";
const t = (en: string, id: string, lang: Lang) =>
  lang === "en" ? en : id;

// -- BRAND TOKENS -------------------------------------------------------------
const navy     = "oklch(22% 0.10 260)";
const orange   = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";

const eyebrow = (color: string = orange): CSSProperties => ({
  fontFamily: "Montserrat, sans-serif",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color,
  marginBottom: 16,
});

// Wrap superscript citation numbers in orange
function cite(text: string): ReactNode {
  const parts = text.split(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^[¹²³⁴⁵⁶⁷⁸⁹⁰]+$/.test(part)
      ? <span key={i} style={{ color: orange, fontWeight: 700 }}>{part}</span>
      : part
  );
}

// -- SOURCES (order matches superscript numbers) -----------------------------
const SOURCES = [
  "Pollock, D.C., Van Reken, R.E. & Pollock, M.V. (2017). Third Culture Kids: The Experience of Growing Up Among Worlds (3rd ed.). Nicholas Brealey.",
  "Rahim, H.F. et al. (2021). Cultural Identity Conflict and Psychological Well-Being in Bicultural Young Adults. Journal of Nervous and Mental Disease, 209(7), 525-532.",
  "Koteskey, R. Burnout. Cross-Cultural Workers series, GO International.",
  "Berry, J.W. (2005). Acculturation: Living Successfully in Two Cultures. International Journal of Intercultural Relations, 29(6), 697-712.",
  "Filipic Sterle, M. et al. (2018). Expatriate Family Adjustment: An Overview of Empirical Evidence on Challenges and Resources. Frontiers in Psychology, 9, 1207.",
  "Nouwen, H.J.M. (1992). Life of the Beloved: Spiritual Living in a Secular World. Crossroad.",
  "Shaum, S. (2023). 5 Themes Amongst Cross-Cultural Workers. Tending Scattered Wool.",
  "Yampolsky, M.A., Amiot, C.E. & de la Sablonnière, R. (2013). Multicultural Identity Integration and Well-Being. Frontiers in Psychology, 4, 126.",
];

// -- VERSE DATA ----------------------------------------------------------------
const VERSES = {
  "matt-4-3-4": {
    ref: "Matthew 4:3-4",
    ref_id: "Matius 4:3-4",
    en: "The tempter came to him and said, 'If you are the Son of God, tell these stones to become bread.' Jesus answered, 'It is written: Man shall not live on bread alone, but on every word that comes from the mouth of God.'",
    id: "Lalu datanglah si pencoba itu dan berkata kepada-Nya: 'Jika Engkau Anak Allah, perintahkanlah supaya batu-batu ini menjadi roti.' Tetapi Yesus menjawab: 'Ada tertulis: Manusia hidup bukan dari roti saja, tetapi dari setiap firman yang keluar dari mulut Allah.'",
  },
  "psalm-46-1-2": {
    ref: "Psalm 46:1-2",
    ref_id: "Mazmur 46:1-2",
    en: "God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way and the mountains fall into the heart of the sea.",
    id: "Allah itu bagi kita tempat perlindungan dan kekuatan, sebagai penolong dalam kesesakan sangat terbukti. Sebab itu kita tidak akan takut, sekalipun bumi berubah, sekalipun gunung-gunung goncang di dalam laut.",
  },
  "col-3-3": {
    ref: "Colossians 3:3",
    ref_id: "Kolose 3:3",
    en: "For you died, and your life is now hidden with Christ in God.",
    id: "Sebab kamu telah mati dan hidupmu tersembunyi bersama dengan Kristus di dalam Allah.",
  },
  "isa-49-16": {
    ref: "Isaiah 49:16",
    ref_id: "Yesaya 49:16",
    en: "See, I have engraved you on the palms of my hands.",
    id: "Lihat, Aku telah melukiskan engkau di telapak tangan-Ku.",
  },
};

// -- ANCHOR DATA ---------------------------------------------------------------
type AnchorKey = "calling" | "values" | "community" | "faith" | "story" | "body";

const ANCHORS: {
  key: AnchorKey;
  icon: IconComponent;
  color: string;
  en_title: string; id_title: string;
  en_tagline: string; id_tagline: string;
  en_strength: string; id_strength: string;
  en_threat: string; id_threat: string;
  en_scenario: string; id_scenario: string;
  en_practice: string; id_practice: string;
  en_question: string; id_question: string;
}[] = [
  {
    key: "calling",
    icon: Compass,
    color: "oklch(52% 0.16 260)",
    en_title: "Calling",
    id_title: "Panggilan",
    en_tagline: "Knowing why you are here",
    id_tagline: "Tahu kenapa Anda ada di sini",
    en_strength: "When your sense of calling is clear, outside pressure loses much of its power to define you. You know what you came to do, and that knowledge shields you from the noise of comparison, criticism and cultural confusion. Calling gives you a 'why' strong enough to carry almost any 'how'.",
    id_strength: "Saat panggilan Anda jelas, tekanan dari luar kehilangan banyak kuasanya untuk menentukan siapa Anda. Anda tahu untuk apa Anda datang, dan itu melindungi Anda dari riuhnya perbandingan, kritik dan kebingungan budaya. Panggilan memberi Anda 'mengapa' yang cukup kuat untuk menanggung hampir semua 'bagaimana'.",
    en_threat: "Pressure attacks calling through long stretches without visible fruit, until you start to wonder if you misheard God. It attacks through comparison with leaders who seem more successful, and through people who question your motives or skill. Burnout research among cross-cultural workers finds that the most committed people, with the highest expectations, are often the most vulnerable.³",
    id_threat: "Tekanan menyerang panggilan lewat masa panjang tanpa buah yang kelihatan, sampai Anda mulai bertanya apakah Anda salah dengar dari Tuhan. Tekanan juga datang lewat perbandingan dengan pemimpin yang tampak lebih sukses, dan lewat orang yang meragukan motif atau kemampuan Anda. Penelitian tentang burnout pada pekerja lintas budaya menemukan bahwa orang yang paling berkomitmen, dengan harapan paling tinggi, sering justru paling rentan.³",
    en_scenario: "You have been in your role for two years. A colleague who started at the same time has planted three new groups and is being celebrated across the network. Two relationships you invested in deeply have just walked away. You sit down to prepare another session for the same small group, unchanged, and wonder if you ever heard God correctly.",
    id_scenario: "Sudah dua tahun Anda di peran ini. Seorang rekan yang mulai bersamaan sudah merintis tiga kelompok baru dan dipuji di seluruh jaringan. Dua hubungan yang Anda bangun dengan sungguh-sungguh baru saja pergi. Anda duduk menyiapkan sesi lagi untuk kelompok kecil yang sama, yang tidak berubah, dan bertanya-tanya apakah Anda dulu benar-benar mendengar Tuhan.",
    en_practice: "Write your 'calling statement' in three sentences or fewer. When did you first sense this was what you were made for? What would be left unfinished if you walked away today? Read it aloud once a week, especially in dry seasons.",
    id_practice: "Tulis 'pernyataan panggilan' Anda, paling banyak tiga kalimat. Kapan pertama kali Anda merasa inilah tujuan Anda diciptakan? Apa yang belum selesai kalau Anda pergi hari ini? Bacakan dengan lantang seminggu sekali, terutama di musim kering.",
    en_question: "If your work produced nothing measurable for twelve months, would you still know you are in the right place? What does your answer tell you?",
    id_question: "Kalau pekerjaan Anda tidak menghasilkan apa pun yang bisa diukur selama dua belas bulan, apakah Anda tetap yakin berada di tempat yang tepat? Apa yang dikatakan jawaban itu tentang diri Anda?",
  },
  {
    key: "values",
    icon: Scale,
    color: "oklch(58% 0.17 35)",
    en_title: "Values",
    id_title: "Nilai",
    en_tagline: "What you will and won't compromise",
    id_tagline: "Apa yang mau dan tidak mau Anda kompromikan",
    en_strength: "Clearly named values work as an inner compass. They tell you which decisions are yours to make, whatever the culture around you expects. Where almost everything is negotiable, knowing what is not gives you a steady centre. Acculturation research finds that people who keep their own values while engaging the new culture tend to have the best mental health.⁴",
    id_strength: "Nilai yang dirumuskan dengan jelas berfungsi seperti kompas di dalam diri. Nilai itu menunjukkan keputusan mana yang memang bagian Anda, apa pun harapan budaya di sekitar Anda. Ketika hampir semua hal bisa ditawar, tahu apa yang tidak bisa ditawar memberi Anda pusat yang stabil. Penelitian akulturasi menemukan bahwa orang yang tetap memegang nilainya sambil terlibat dengan budaya baru cenderung punya kesehatan mental paling baik.⁴",
    en_threat: "Living inside another culture puts steady pressure on you to blend in: to adopt local norms, local ways of speaking, local ideas of success. Much of that is right and good. But slow, unexamined adjustment can shift your values without you noticing. By the time you see it, you have been deciding from a set of values that is no longer quite yours.",
    id_threat: "Hidup di dalam budaya lain terus mendorong Anda untuk membaur: mengikuti norma setempat, cara bicara setempat, ukuran sukses setempat. Banyak dari itu baik dan memang perlu. Tetapi penyesuaian yang pelan dan tidak pernah diperiksa bisa menggeser nilai Anda tanpa Anda sadari. Saat Anda melihatnya, Anda sudah lama mengambil keputusan dari nilai yang bukan lagi sepenuhnya milik Anda.",
    en_scenario: "Over eighteen months your team has quietly drifted toward avoiding hard conversations. You notice you have stopped naming concerns in meetings because the cost of disruption feels too high. One day you realise you now put peace ahead of truth, and you are not sure when that started.",
    id_scenario: "Selama delapan belas bulan, tim Anda pelan-pelan makin menghindari percakapan sulit. Anda sadar Anda sudah berhenti menyampaikan kekhawatiran di rapat karena risikonya terasa terlalu besar. Suatu hari Anda sadar bahwa Anda sekarang lebih mengutamakan damai daripada kebenaran, dan Anda tidak tahu sejak kapan.",
    en_practice: "Name your three core values, one word each. For each one, write one behaviour that would show it is alive in your life. Review them every quarter and ask honestly: did my decisions this season reflect these values?",
    id_practice: "Tuliskan tiga nilai inti Anda, masing-masing satu kata. Untuk setiap nilai, tulis satu perilaku yang menunjukkan nilai itu benar-benar hidup dalam diri Anda. Tinjau setiap tiga bulan dan tanyakan dengan jujur: apakah keputusan saya di musim ini mencerminkan nilai-nilai ini?",
    en_question: "Where in the last six months have you acted against something you believe and told yourself it was unavoidable? Was it?",
    id_question: "Di mana dalam enam bulan terakhir Anda bertindak bertentangan dengan apa yang Anda yakini, lalu bilang ke diri sendiri bahwa itu tidak bisa dihindari? Benarkah begitu?",
  },
  {
    key: "community",
    icon: Users,
    color: "oklch(50% 0.16 170)",
    en_title: "Community",
    id_title: "Komunitas",
    en_tagline: "Who knows and loves you",
    id_tagline: "Siapa yang mengenal dan mengasihi Anda",
    en_strength: "We know ourselves partly through the eyes of people who know us well. Trusted friends act as a mirror that shows who we really are, rather than who pressure is trying to make us. When your sense of self blurs under long pressure, community names you back to yourself: 'This is who you are. We have seen it for years.' Research on expatriate families finds that staying in touch with family, friends and former colleagues protects wellbeing.⁵",
    id_strength: "Kita mengenal diri sendiri sebagian lewat mata orang yang mengenal kita dengan baik. Teman yang dipercaya menjadi cermin yang menunjukkan siapa kita sebenarnya, bukan siapa yang ingin dibentuk oleh tekanan. Saat gambaran diri Anda kabur karena tekanan yang lama, komunitas mengingatkan Anda siapa Anda, karena mereka sudah bertahun-tahun melihatnya. Penelitian tentang keluarga ekspatriat menemukan bahwa tetap terhubung dengan keluarga, teman dan mantan rekan kerja melindungi kesejahteraan.⁵",
    en_threat: "Cross-cultural work can be deeply lonely. Role expectations, cultural distance, frequent moves, language barriers and the weight of being the outsider all work against deep friendship. Over time, isolation does more than hurt. It removes the people who could remind you who you are, and leaves pressure as the only voice in the room.",
    id_threat: "Pekerjaan lintas budaya bisa sangat sepi. Tuntutan peran, jarak budaya, sering pindah, hambatan bahasa dan beban sebagai orang luar semuanya mempersulit persahabatan yang dalam. Lama-lama, isolasi bukan hanya menyakitkan. Isolasi menyingkirkan orang-orang yang bisa mengingatkan Anda siapa Anda, sampai yang tersisa hanya suara tekanan.",
    en_scenario: "You have just come through a public failure: a project that collapsed, a team conflict that went wrong, a decision that cost you credibility. Afterwards, most people in your network treat you differently. But one person calls you by name, sits with you in it and says only: 'I know who you are. This doesn't change that.' That person is doing more for your identity than any strategy.",
    id_scenario: "Anda baru saja melewati kegagalan di depan banyak orang: proyek yang gagal, konflik tim yang memburuk, keputusan yang membuat kredibilitas Anda turun. Setelah itu, kebanyakan orang di jaringan Anda memperlakukan Anda berbeda. Tetapi satu orang memanggil nama Anda, duduk menemani Anda, dan hanya berkata bahwa ia tahu siapa Anda dan kegagalan ini tidak mengubah itu. Orang itu berbuat lebih banyak untuk identitas Anda daripada strategi apa pun.",
    en_practice: "Name two or three people who knew you before this role and still know you now. Book a conversation with no agenda with one of them this month. Share something real, beyond progress updates. Ask them: 'Do I seem like myself to you lately?'",
    id_practice: "Sebutkan dua atau tiga orang yang mengenal Anda sebelum peran ini dan masih mengenal Anda sekarang. Jadwalkan obrolan tanpa agenda dengan salah satu dari mereka bulan ini. Ceritakan sesuatu yang nyata, bukan hanya kabar kemajuan. Tanyakan kepadanya apakah akhir-akhir ini Anda masih terlihat seperti diri sendiri.",
    en_question: "Who in your life has both the access and the freedom to tell you the truth about yourself? If no one comes to mind, what needs to change?",
    id_question: "Siapa dalam hidup Anda yang punya akses sekaligus kebebasan untuk mengatakan kebenaran tentang diri Anda? Kalau tidak ada yang terlintas, apa yang perlu berubah?",
  },
  {
    key: "faith",
    icon: CrossIcon,
    color: "oklch(55% 0.18 305)",
    en_title: "Faith",
    id_title: "Iman",
    en_tagline: "Who God says you are",
    id_tagline: "Siapa Anda menurut Tuhan",
    en_strength: "In the wilderness, Jesus was tempted three times, and each temptation was about identity: 'If you are the Son of God...' The enemy wanted him to act as if he had to prove who he was. Jesus was secure because the Father had already spoken at his baptism: 'This is my beloved Son, in whom I am well pleased.' He had nothing to prove. Faith works the same way. It holds what God has said about you as more true than anything circumstances or culture say. Henri Nouwen called this living as the Beloved.⁶",
    id_strength: "Di padang gurun, Yesus dicobai tiga kali, dan setiap pencobaan menyangkut identitas: 'Jika Engkau Anak Allah...' Iblis ingin Dia bertindak seolah-olah Dia harus membuktikan siapa diri-Nya. Yesus teguh karena Bapa sudah berbicara saat Ia dibaptis: 'Inilah Anak-Ku yang Kukasihi, kepada-Nyalah Aku berkenan.' Ia tidak perlu membuktikan apa pun. Iman bekerja dengan cara yang sama. Iman memegang apa yang Tuhan katakan tentang Anda sebagai lebih benar daripada apa pun yang dikatakan keadaan atau budaya. Henri Nouwen menyebutnya hidup sebagai yang Dikasihi.⁶",
    en_threat: "Spiritual drought is the most dangerous attack on faith. Prayer feels hollow, Scripture feels abstract and God feels distant, often because of the long stress of cross-cultural life. When that happens, a leader stops drawing identity from God's voice and starts drawing it from performance, approval and comparison. People who care for cross-cultural workers name this 'performance lie' as one of the most common themes they see.⁷",
    id_threat: "Kekeringan rohani adalah serangan paling berbahaya terhadap iman. Doa terasa kosong, Firman terasa jauh dan Tuhan terasa tidak dekat, sering justru karena tekanan panjang hidup lintas budaya. Saat itu terjadi, seorang pemimpin berhenti menerima identitas dari suara Tuhan dan mulai mencarinya dari kinerja, pengakuan dan perbandingan. Para pendamping pekerja lintas budaya menyebut 'kebohongan kinerja' ini sebagai salah satu tema yang paling sering mereka temui.⁷",
    en_scenario: "It is month seven of a hard season. You have not felt anything in prayer for weeks. You read your Bible because you should, but it lands flat. A leader you respect tells you that a person of real faith would not be struggling this much. You start to wonder if you were ever rooted in God at all, or only performing faith well enough to fool yourself.",
    id_scenario: "Ini bulan ketujuh dari musim yang berat. Sudah berminggu-minggu Anda tidak merasakan apa-apa saat berdoa. Anda membaca Alkitab karena memang seharusnya, tetapi terasa hambar. Seorang pemimpin yang Anda hormati bilang bahwa orang yang imannya sungguh-sungguh tidak akan bergumul sampai seperti ini. Anda mulai bertanya apakah Anda pernah benar-benar berakar di dalam Tuhan, atau hanya pandai berpura-pura beriman sampai menipu diri sendiri.",
    en_practice: "Spend fifteen minutes with Psalm 46 this week. Sit with it rather than study it. Let the words fortress and refuge sink in below the level of analysis. Your identity in Christ is a truth you return to, even on days you cannot feel it. Come back to it.",
    id_practice: "Luangkan lima belas menit bersama Mazmur 46 minggu ini. Jangan mempelajarinya, cukup diam bersamanya. Biarkan kata benteng dan tempat perlindungan meresap lebih dalam dari sekadar pikiran. Identitas Anda di dalam Kristus adalah kebenaran yang bisa Anda datangi lagi, bahkan di hari-hari ketika Anda tidak merasakannya. Kembalilah ke sana.",
    en_question: "When the feelings are gone, when prayer is dry and Scripture is flat, what do you believe about who you are to God? Is that belief strong enough to hold you?",
    id_question: "Ketika perasaan itu hilang, ketika doa kering dan Firman terasa hambar, apa yang Anda percayai tentang siapa Anda bagi Tuhan? Apakah keyakinan itu cukup kuat untuk menopang Anda?",
  },
  {
    key: "story",
    icon: BookOpen,
    color: "oklch(56% 0.15 50)",
    en_title: "Story",
    id_title: "Kisah",
    en_tagline: "The through-line of your life",
    id_tagline: "Benang merah hidup Anda",
    en_strength: "Your story is the build-up of experiences, moves, failures and graces that have formed you. The present moment cannot overwrite it. When you know your story, you have evidence: you have been here before, God was faithful before, and you are not who you were ten years ago. Story gives you continuity. It places today's pressure inside a longer arc with meaning and direction.",
    id_strength: "Kisah Anda adalah kumpulan pengalaman, perpindahan, kegagalan dan anugerah yang membentuk Anda. Keadaan saat ini tidak bisa menghapusnya. Kalau Anda mengenal kisah Anda, Anda punya bukti: Anda pernah di titik ini, Tuhan dulu setia, dan Anda bukan lagi orang yang sama seperti sepuluh tahun lalu. Kisah memberi kesinambungan. Kisah menempatkan tekanan hari ini di dalam proses yang lebih panjang, yang punya makna dan arah.",
    en_threat: "Long pressure in a foreign culture can cut you off from your own story. When no one around you shares your reference points, the stories that formed you become hard to tell, because nobody here knows the background. Over time you can lose the thread. Who connects the person who left home three years ago with the person sitting here now? Research on people living between cultures links a split, compartmentalised identity with a less coherent life story and lower wellbeing.⁸",
    id_threat: "Tekanan panjang di budaya asing bisa memutuskan Anda dari kisah Anda sendiri. Ketika tidak ada orang di sekitar Anda yang punya titik acuan yang sama, kisah-kisah yang membentuk Anda jadi sulit diceritakan, karena tidak ada yang tahu latar belakangnya. Lama-lama Anda bisa kehilangan benang merahnya. Siapa yang menghubungkan orang yang meninggalkan rumah tiga tahun lalu dengan orang yang duduk di sini sekarang? Penelitian tentang orang yang hidup di antara budaya menghubungkan identitas yang terpecah-pecah dengan kisah hidup yang kurang utuh dan kesejahteraan yang lebih rendah.⁸",
    en_scenario: "Someone from your sending church asks how you are doing. You open your mouth and realise you have no idea how to tell the story of the last eighteen months in a way that makes sense to someone who was not there. The gap is so wide that you close down, say 'it's been hard' and move on. But the untold story keeps piling up.",
    id_scenario: "Seseorang dari gereja yang mengutus Anda bertanya bagaimana kabar Anda. Anda membuka mulut lalu sadar Anda tidak tahu bagaimana menceritakan delapan belas bulan terakhir dengan cara yang masuk akal bagi orang yang tidak ada di sana. Jaraknya terlalu lebar, jadi Anda menutup diri, bilang 'lumayan berat' lalu ganti topik. Tetapi kisah yang tidak diceritakan itu terus menumpuk.",
    en_practice: "Write the last five years of your life as a set of chapters, each with a title and two or three sentences. Look for the pattern. What has stayed the same? What has changed? What has God been doing across the whole arc? Share it with one person who will listen.",
    id_practice: "Tulis lima tahun terakhir hidup Anda sebagai beberapa bab, masing-masing dengan judul dan dua atau tiga kalimat. Cari polanya. Apa yang tetap sama? Apa yang berubah? Apa yang Tuhan kerjakan sepanjang proses itu? Ceritakan kepada satu orang yang mau mendengarkan.",
    en_question: "What is the one thread that runs through every chapter of your story? It might be a theme, a conviction, or a wound that became a gift. Can you name it?",
    id_question: "Apa satu benang merah yang ada di setiap bab kisah Anda? Bisa berupa tema, keyakinan, atau luka yang menjadi anugerah. Bisakah Anda menyebutkannya?",
  },
  {
    key: "body",
    icon: HeartPulse,
    color: "oklch(52% 0.17 155)",
    en_title: "Body",
    id_title: "Tubuh",
    en_tagline: "The physical self as identity carrier",
    id_tagline: "Tubuh sebagai pembawa identitas",
    en_strength: "The body knows what the mind edits out. Sleep, appetite, posture and physical presence are honest signals, even when a leader looks fine on the surface. A body that is cared for becomes a steady base for clear thinking and grounded presence. A rested leader is harder to knock off balance than one running on three hours of sleep and two cups of coffee.",
    id_strength: "Tubuh tahu apa yang disembunyikan pikiran. Pola tidur, nafsu makan, postur dan cara Anda hadir adalah sinyal yang jujur, bahkan saat seorang pemimpin tampak baik-baik saja dari luar. Tubuh yang dirawat menjadi dasar yang kokoh untuk berpikir jernih dan hadir dengan tenang. Pemimpin yang cukup istirahat lebih sulit digoyahkan daripada yang hanya tidur tiga jam dan bertahan dengan dua cangkir kopi.",
    en_threat: "Cross-cultural life loads the body with stress: climate, new food, unfamiliar surroundings, the effort of working in a second language all day, and the strain of constant low-level uncertainty. Over time these add up, and the body becomes a burden instead of a resource. When you are physically depleted, it gets much harder to keep your emotions steady, and every threat to your identity feels bigger than it is.",
    id_threat: "Hidup lintas budaya membebani tubuh dengan stres: iklim, makanan baru, lingkungan yang asing, kerja keras memakai bahasa kedua sepanjang hari, dan ketegangan karena ketidakpastian yang terus ada. Lama-lama semua itu menumpuk, dan tubuh menjadi beban, bukan lagi sumber kekuatan. Saat tubuh Anda terkuras, jauh lebih sulit menjaga emosi tetap stabil, dan setiap ancaman terhadap identitas Anda terasa lebih besar dari kenyataannya.",
    en_scenario: "It is week three of a high-stakes conflict in your team. You have not slept well in a fortnight. In a leadership meeting, a criticism you would normally take calmly sets off an outsized reaction. You feel exposed, ashamed and sure the criticism defines you. Later, after sleep and a meal, the same criticism looks manageable. Your reaction came from a depleted body, and says little about your character.",
    id_scenario: "Ini minggu ketiga konflik serius di tim Anda. Sudah dua minggu Anda tidak tidur nyenyak. Dalam rapat pimpinan, kritik yang biasanya bisa Anda terima dengan tenang memicu reaksi yang berlebihan. Anda merasa rapuh, malu dan yakin bahwa kritik itu menentukan siapa Anda. Kemudian, setelah tidur dan makan, kritik yang sama terlihat bisa dihadapi. Reaksi Anda datang dari tubuh yang terkuras, dan tidak banyak berkata tentang karakter Anda.",
    en_practice: "For the next two weeks, track three things each day: hours of sleep, one form of movement (even a 20-minute walk) and one moment of deliberate stillness. Notice how physical care and emotional steadiness move together. Your body is telling you something about your soul.",
    id_practice: "Selama dua minggu ke depan, catat tiga hal setiap hari: jam tidur, satu bentuk gerak (jalan kaki 20 menit pun cukup) dan satu momen hening yang disengaja. Perhatikan bagaimana perawatan tubuh dan kestabilan emosi saling berkaitan. Tubuh Anda sedang memberi tahu sesuatu tentang jiwa Anda.",
    en_question: "If your body could speak right now, what would it say it needs most? And what is stopping you from giving it that?",
    id_question: "Kalau tubuh Anda bisa bicara sekarang, apa yang paling ia butuhkan? Dan apa yang menghalangi Anda untuk memberikannya?",
  },
];

// -- SELF-ASSESSMENT RECOMMENDATIONS ------------------------------------------
const RECOMMENDATIONS: Record<AnchorKey, { en: string; id: string }> = {
  calling: {
    en: "Your calling anchor needs attention first. Write your calling statement this week, even if it feels impossible right now. Writing it is itself a grounding practice. Don't wait until you feel certain. Write what you knew when you said yes.",
    id: "Jangkar panggilan Anda perlu diperhatikan lebih dulu. Tulis pernyataan panggilan Anda minggu ini, meskipun sekarang terasa mustahil. Menulisnya saja sudah menjadi latihan yang menenangkan. Jangan tunggu sampai Anda merasa yakin. Tulis apa yang Anda tahu saat Anda berkata ya.",
  },
  values: {
    en: "Your values anchor needs strengthening. Before anything else, name three non-negotiables: things you would not compromise even under heavy pressure. Write them somewhere you will see them. Values you have never named are hard to defend.",
    id: "Jangkar nilai Anda perlu diperkuat. Sebelum hal lain, tuliskan tiga hal yang tidak bisa ditawar: hal-hal yang tidak akan Anda kompromikan meski di bawah tekanan berat. Tulis di tempat yang sering Anda lihat. Nilai yang tidak pernah dirumuskan sulit dipertahankan.",
  },
  community: {
    en: "Your community anchor is your most urgent need. Pulling back from people can feel humble, but it leaves you exposed. This week, reach out to one person who knew you before this role. Don't report on your work. Just let yourself be known. That one conversation may steady you more than you expect.",
    id: "Jangkar komunitas Anda adalah kebutuhan yang paling mendesak. Menarik diri dari orang lain bisa terasa rendah hati, tetapi justru membuat Anda rentan. Minggu ini, hubungi satu orang yang mengenal Anda sebelum peran ini. Jangan melapor soal pekerjaan. Biarkan diri Anda dikenal. Satu obrolan itu bisa menguatkan Anda lebih dari yang Anda kira.",
  },
  faith: {
    en: "Your faith anchor is where to start. Begin with honesty, before any new discipline or longer quiet time. Tell God exactly where you are. Bring the drought, the distance, the flatness. Colossians 3:3 describes something already true: your life is hidden with Christ in God. That has not changed.",
    id: "Mulailah dari jangkar iman Anda. Awali dengan kejujuran, sebelum disiplin baru atau saat teduh yang lebih lama. Katakan kepada Tuhan dengan jujur di mana Anda sekarang. Bawa kekeringan, jarak dan rasa hambar itu. Kolose 3:3 menggambarkan sesuatu yang sudah benar: hidup Anda tersembunyi bersama Kristus di dalam Allah. Itu tidak berubah.",
  },
  story: {
    en: "Your story anchor needs fresh attention. Set aside one hour this week with no agenda except writing. Start with: 'The chapter I am in right now is called...' Then go back five years and name each chapter before it. The pattern you find will steady you.",
    id: "Jangkar kisah Anda perlu diperhatikan lagi. Sisihkan satu jam minggu ini tanpa agenda selain menulis. Mulai dengan: 'Bab yang sedang saya jalani sekarang berjudul...' Lalu mundur lima tahun dan beri judul setiap bab sebelumnya. Pola yang Anda temukan akan menguatkan Anda.",
  },
  body: {
    en: "Your body anchor is telling you something you need to hear. Start with sleep, the quickest place to begin. Protect seven to eight hours tonight, and treat it as a leadership decision. It is hard to think clearly, lead well or hold your identity steady from inside a depleted body.",
    id: "Jangkar tubuh Anda sedang memberi tahu sesuatu yang perlu Anda dengar. Mulailah dari tidur, tempat paling cepat untuk memulai. Jaga tujuh sampai delapan jam tidur malam ini, dan anggap itu keputusan kepemimpinan. Sulit berpikir jernih, memimpin dengan baik atau menjaga identitas Anda tetap stabil dari dalam tubuh yang terkuras.",
  },
};

// -- KEY TAKEAWAYS ------------------------------------------------------------
const TAKEAWAYS: { en: string; id: string }[] = [
  {
    en: "Identity under pressure rests on six anchors: calling, values, community, faith, story and body. When one drags, the others carry more weight.",
    id: "Identitas di bawah tekanan bertumpu pada enam jangkar: panggilan, nilai, komunitas, iman, kisah dan tubuh. Saat satu terseret, yang lain menanggung beban lebih berat.",
  },
  {
    en: "Pressure rarely attacks head on. It works slowly, through fruitless seasons, quiet cultural drift, isolation and exhaustion, until you are deciding from a self that is no longer quite yours.",
    id: "Tekanan jarang menyerang terang-terangan. Tekanan bekerja pelan-pelan, lewat musim tanpa buah, pergeseran budaya yang diam-diam, isolasi dan kelelahan, sampai Anda mengambil keputusan dari diri yang bukan lagi sepenuhnya milik Anda.",
  },
  {
    en: "Start with your weakest anchor. One small practice, done this week, steadies you more than a big plan you never begin.",
    id: "Mulailah dari jangkar yang paling lemah. Satu latihan kecil yang Anda lakukan minggu ini lebih menguatkan daripada rencana besar yang tidak pernah dimulai.",
  },
  {
    en: "You need people who knew you before this role. They can name you back to yourself when pressure has blurred the picture.",
    id: "Anda butuh orang yang mengenal Anda sebelum peran ini. Mereka bisa mengingatkan siapa Anda ketika tekanan sudah mengaburkan gambaran itu.",
  },
  {
    en: "Your deepest identity is already settled. Like Jesus in the wilderness, you have nothing to prove: your life is hidden with Christ in God.",
    id: "Identitas Anda yang terdalam sudah pasti. Seperti Yesus di padang gurun, Anda tidak perlu membuktikan apa pun: hidup Anda tersembunyi bersama Kristus di dalam Allah.",
  },
];

// -- PROPS ---------------------------------------------------------------------
type Props = { userPathway: string | null; isSaved: boolean };

export default function IdentityUnderPressureClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [openAnchor, setOpenAnchor] = useState<AnchorKey | null>(null);
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const f = () => setCols(window.innerWidth < 640 ? 1 : window.innerWidth < 860 ? 2 : 3);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const [ratings, setRatings] = useState<Partial<Record<AnchorKey, number>>>({});
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("identity-under-pressure");
      if (!result.error) setSaved(true);
    });
  }

  const allRated = ANCHORS.every(a => ratings[a.key] !== undefined);

  const lowestAnchor = allRated
    ? ANCHORS.reduce((lowest, a) => {
        const ratingA = ratings[a.key] ?? 5;
        const ratingLowest = ratings[lowest.key] ?? 5;
        return ratingA < ratingLowest ? a : lowest;
      }, ANCHORS[0])
    : null;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", color: bodyText, background: offWhite }}>
      <LangToggle />

      {/* HERO */}
      <section style={{ background: navy, padding: "80px 24px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 0%, oklch(32% 0.12 300 / 0.4) 0%, transparent 65%)", pointerEvents: "none" }} />
        <img
          src="/images/resources/identity-under-pressure/hero.jpg"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, mixBlendMode: "luminosity", pointerEvents: "none" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div style={{ position: "absolute", inset: 0, background: navy, opacity: 0.15, mixBlendMode: "multiply", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <p style={{ ...eyebrow(), marginBottom: 20 }}>
            {t("Faith & Calling · Guide", "Iman & Panggilan · Panduan", lang)}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, color: offWhite, lineHeight: 1.08, margin: "0 0 24px" }}>
            {t("Identity Under Pressure", "Identitas di Bawah Tekanan", lang)}
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontStyle: "italic", fontSize: "clamp(18px, 2.2vw, 22px)", color: "oklch(82% 0.03 80)", lineHeight: 1.65, maxWidth: 580, margin: "0 0 32px" }}>
            {t(
              "Maintaining a grounded sense of self when living and leading between worlds.",
              "Tetap teguh menjadi diri Anda saat hidup dan memimpin di antara dua dunia.",
              lang
            )}
          </p>
          <div style={{ background: "oklch(30% 0.10 260 / 0.6)", borderRadius: 12, padding: "24px 28px", maxWidth: 580 }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 17, color: "oklch(88% 0.04 80)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 10 }}>
              "{lang === "id" ? VERSES["col-3-3"].id : VERSES["col-3-3"].en}"
            </p>
            <button type="button" onClick={() => setActiveVerse("col-3-3")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textDecoration: "underline dotted", padding: 0 }}>
              {lang === "id" ? VERSES["col-3-3"].ref_id : VERSES["col-3-3"].ref}
            </button>
          </div>
          <div style={{ marginTop: 28 }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saved || isPending}
              aria-pressed={saved}
              aria-label={saved
                ? t("Saved to your dashboard", "Tersimpan di dasbor Anda", lang)
                : t("Save this module to your dashboard", "Simpan modul ini ke dasbor Anda", lang)}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, minHeight: 44, padding: "10px 24px", border: "none", borderRadius: 4, background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, cursor: saved ? "default" : "pointer" }}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                <path d="M6 3h12v18l-6-4.5L6 21z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span>{saved ? t("Saved to Dashboard", "Tersimpan di Dasbor", lang) : isPending ? t("Saving...", "Menyimpan...", lang) : t("Save to Dashboard", "Simpan ke Dasbor", lang)}</span>
            </button>
          </div>
        </div>
      </section>

      {/* INTRO: WHAT IS IDENTITY UNDER PRESSURE */}
      <section style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow(), marginBottom: 12 }}>
            {t("The Challenge", "Tantangan", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, marginBottom: 32 }}>
            {t("When pressure reshapes who you are", "Ketika tekanan mengubah siapa diri Anda", lang)}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText }}>
                {cite(t(
                  "Cross-cultural leaders face a particular identity challenge: they are too foreign and too familiar at the same time. Too foreign to be fully trusted by the community they serve. Too changed to explain to their home culture what they have lived through away from it. The result is an identity no-man's land, where you belong fully to neither world. Researchers who study people raised between cultures describe the same pattern: real ties to many places, full ownership of none.¹",
                  "Pemimpin lintas budaya menghadapi tantangan identitas yang khas: mereka terlalu asing sekaligus terlalu akrab. Terlalu asing untuk sepenuhnya dipercaya oleh komunitas yang mereka layani. Terlalu berubah untuk bisa menjelaskan kepada budaya asalnya apa yang sudah mereka alami di luar sana. Hasilnya seperti tanah tak bertuan, tempat Anda tidak sepenuhnya menjadi bagian dari dunia mana pun. Para peneliti yang mempelajari orang yang dibesarkan di antara budaya melihat pola yang sama: punya ikatan dengan banyak tempat, tetapi tidak sepenuhnya memiliki satu pun.¹",
                  lang
                ))}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText }}>
                {t(
                  "Pressure attacks identity in four main ways: role demands that leave no room to be yourself, life inside another culture that slowly changes what feels normal, public failure that becomes the loudest voice about who you are, and steady criticism that wears down confidence from the outside in. Without anchors you have chosen on purpose, the self bends, and sometimes breaks.",
                  "Tekanan menyerang identitas lewat empat cara utama: tuntutan peran yang tidak menyisakan ruang untuk menjadi diri Anda sendiri, hidup di dalam budaya lain yang pelan-pelan mengubah apa yang terasa normal, kegagalan di depan umum yang menjadi suara paling keras tentang siapa Anda, dan kritik terus-menerus yang mengikis rasa percaya diri dari luar ke dalam. Tanpa jangkar yang sengaja Anda pilih, diri Anda bisa goyah, bahkan patah.",
                  lang
                )}
              </p>
            </div>
          </div>
          <div style={{ background: "oklch(65% 0.15 45 / 0.08)", borderRadius: 12, padding: "24px 28px", borderLeft: `4px solid ${orange}` }}>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: bodyText, fontStyle: "italic", margin: 0 }}>
              {cite(t(
                "The Six Anchors Identity Map below is a diagnostic tool, not a personality model. It helps you see which of the six foundations that steady your identity is most worn down right now, and what to do about it. This matters: in studies of people living between cultures, more inner identity conflict goes with a less clear sense of self, and with lower wellbeing.²",
                "Peta Identitas Enam Jangkar di bawah ini adalah alat diagnosis, bukan model kepribadian. Peta ini membantu Anda melihat mana dari enam fondasi penopang identitas Anda yang paling terkuras saat ini, dan apa yang perlu dilakukan. Ini penting: dalam penelitian tentang orang yang hidup di antara budaya, makin besar konflik identitas di dalam diri, makin kabur gambaran diri seseorang, dan makin rendah kesejahteraannya.²",
                lang
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* THE SIX ANCHORS */}
      <section style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow(), marginBottom: 12 }}>
            {t("The Six Anchors Identity Map", "Peta Identitas Enam Jangkar", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, marginBottom: 12 }}>
            {t("What keeps you grounded", "Apa yang membuat Anda tetap teguh", lang)}
          </h2>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 580, margin: "0 0 48px" }}>
            {t(
              "Select each anchor to see what it gives you, how pressure attacks it, a realistic scenario and a grounding practice.",
              "Pilih setiap jangkar untuk melihat apa yang diberikannya, bagaimana tekanan menyerangnya, contoh situasi nyata dan latihan untuk meneguhkannya.",
              lang
            )}
          </p>

          {/* Anchor grid: detail opens directly under the tile's row */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 14, marginBottom: 32 }}>
            {(() => {
              const openI = ANCHORS.findIndex(x => x.key === openAnchor);
              const insertAfter = openI < 0 ? -1 : Math.min((Math.floor(openI / cols) + 1) * cols - 1, ANCHORS.length - 1);
              const out: ReactNode[] = [];
              ANCHORS.forEach((anchor, i) => {
                const isOpen = openAnchor === anchor.key;
                const row = cols === 1;
                out.push(
                  <button
                    key={anchor.key}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenAnchor(isOpen ? null : anchor.key)}
                    style={{
                      position: "relative", width: "100%", textAlign: "left", cursor: "pointer",
                      display: "flex", flexDirection: row ? "row" : "column", alignItems: row ? "center" : "flex-start", gap: row ? 16 : 18,
                      minHeight: row ? 96 : 200, padding: row ? "18px 52px 18px 18px" : "26px 24px",
                      borderRadius: 14, border: `2px solid ${isOpen ? orange : "oklch(32% 0.09 260)"}`,
                      background: isOpen ? orange : navy, transition: "background 0.2s, border-color 0.2s",
                    }}
                  >
                    <span style={{
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      width: 60, height: 60, borderRadius: "50%",
                      background: isOpen ? navy : "oklch(30% 0.09 260)", color: isOpen ? offWhite : orange,
                    }}>
                      <anchor.icon size={30} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span style={{ display: "block" }}>
                      <span style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 21, lineHeight: 1.2, color: isOpen ? navy : offWhite, marginBottom: 6 }}>
                        {t(anchor.en_title, anchor.id_title, lang)}
                      </span>
                      <span style={{ display: "block", fontFamily: "Cormorant Garamond, Georgia, serif", fontStyle: "italic", fontSize: 18, lineHeight: 1.35, color: isOpen ? navy : "oklch(86% 0.03 80)" }}>
                        {t(anchor.en_tagline, anchor.id_tagline, lang)}
                      </span>
                    </span>
                    <span aria-hidden="true" style={{
                      position: "absolute", right: 16, top: row ? "50%" : 24, marginTop: row ? -10 : 0, display: "flex",
                      color: isOpen ? navy : orange, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s",
                    }}>
                      <ChevronDown size={20} strokeWidth={2.25} />
                    </span>
                  </button>
                );
                if (i === insertAfter) {
                  const open = ANCHORS[openI];
                  const anchor = open;
                  const Icon = anchor.icon;
                  out.push(
                  <div key={`${anchor.key}-panel`} role="region" aria-label={t(anchor.en_title, anchor.id_title, lang)} style={{ gridColumn: "1 / -1", background: "white", borderRadius: 16, padding: "32px clamp(18px, 4vw, 36px)", border: `2px solid ${orange}`, animation: "fadeIn 0.3s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                      <span style={{ color: orange, display: "flex" }}><Icon size={40} strokeWidth={1.75} aria-hidden="true" /></span>
                      <div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: navy }}>
                          {t(anchor.en_title, anchor.id_title, lang)}
                        </div>
                        <div style={{ fontSize: 14, color: bodyText, fontStyle: "italic" }}>
                          {t(anchor.en_tagline, anchor.id_tagline, lang)}
                        </div>
                      </div>
                    </div>
    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, marginBottom: 28 }}>
                      <div>
                        <p style={{ ...eyebrow(), marginBottom: 10 }}>
                          {t("When strong, it gives you", "Saat kuat, jangkar ini memberi Anda", lang)}
                        </p>
                        <p style={{ fontSize: 14, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                          {cite(t(anchor.en_strength, anchor.id_strength, lang))}
                        </p>
                      </div>
                      <div>
                        <p style={{ ...eyebrow("oklch(55% 0.18 25)"), marginBottom: 10 }}>
                          {t("How pressure attacks it", "Bagaimana tekanan menyerangnya", lang)}
                        </p>
                        <p style={{ fontSize: 14, lineHeight: 1.75, color: bodyText, margin: 0 }}>
                          {cite(t(anchor.en_threat, anchor.id_threat, lang))}
                        </p>
                      </div>
                    </div>
    
                    {/* Pressure test scenario */}
                    <div style={{ background: "oklch(96% 0.008 260)", borderRadius: 10, padding: "20px 24px", marginBottom: 24, borderLeft: `4px solid ${anchor.color}` }}>
                      <p style={{ ...eyebrow(anchor.color), marginBottom: 8 }}>
                        {t("Pressure Test", "Uji Tekanan", lang)}
                      </p>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: bodyText, fontStyle: "italic", margin: 0 }}>
                        {t(anchor.en_scenario, anchor.id_scenario, lang)}
                      </p>
                    </div>
    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                      {/* Grounding practice */}
                      <div style={{ background: `color-mix(in oklch, ${anchor.color} 8%, white)`, borderRadius: 10, padding: "20px 20px" }}>
                        <p style={{ ...eyebrow(anchor.color), marginBottom: 8 }}>
                          {t("Grounding Practice", "Latihan Meneguhkan", lang)}
                        </p>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: bodyText, margin: 0 }}>
                          {t(anchor.en_practice, anchor.id_practice, lang)}
                        </p>
                      </div>
                      {/* Reflection question */}
                      <div style={{ background: offWhite, borderRadius: 10, padding: "20px 20px", border: `1px solid oklch(88% 0.008 260)` }}>
                        <p style={{ ...eyebrow(), marginBottom: 8 }}>
                          {t("Reflection Question", "Pertanyaan Refleksi", lang)}
                        </p>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: navy, fontStyle: "italic", margin: 0 }}>
                          {t(anchor.en_question, anchor.id_question, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
    
                  );
                }
              });
              return out;
            })()}
          </div>
        </div>
      </section>

      {/* SELF-ASSESSMENT */}
      <section style={{ background: offWhite, padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow(), marginBottom: 12 }}>
            {t("Self-Assessment", "Penilaian Diri", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: navy, marginBottom: 16 }}>
            {t("How stable are your anchors?", "Seberapa stabil jangkar Anda?", lang)}
          </h2>
          <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.65, maxWidth: 540, margin: "0 0 40px" }}>
            {t(
              "Rate each anchor from 1 (very shaky) to 5 (very stable). Be honest. Only you will see this.",
              "Beri nilai setiap jangkar dari 1 (sangat goyah) sampai 5 (sangat stabil). Jujurlah. Hanya Anda yang melihat ini.",
              lang
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
            {ANCHORS.map(anchor => {
              const rating = ratings[anchor.key];
              return (
                <div key={anchor.key} style={{ background: "white", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
                    <span style={{ color: anchor.color, display: "flex" }}><anchor.icon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
                    <div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: navy }}>
                        {t(anchor.en_title, anchor.id_title, lang)}
                      </div>
                      <div style={{ fontSize: 11, color: bodyText, fontStyle: "italic" }}>
                        {t(anchor.en_tagline, anchor.id_tagline, lang)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={rating === n}
                        aria-label={`${t(anchor.en_title, anchor.id_title, lang)}: ${n}`}
                        onClick={() => setRatings(prev => ({ ...prev, [anchor.key]: n }))}
                        style={{
                          width: 40, height: 40, borderRadius: "50%", border: `2px solid`,
                          borderColor: rating === n ? anchor.color : "oklch(85% 0.01 260)",
                          background: rating !== undefined && n <= rating
                            ? rating <= 2 ? "oklch(55% 0.18 25)" : rating === 3 ? orange : anchor.color
                            : "transparent",
                          color: rating !== undefined && n <= rating ? "white" : bodyText,
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700, fontSize: 13, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {rating && (
                    <span style={{ fontSize: 12, color: rating <= 2 ? "oklch(55% 0.18 25)" : rating === 3 ? orange : "oklch(45% 0.16 155)", fontWeight: 700, minWidth: 70 }}>
                      {rating <= 2
                        ? t("Shaky", "Goyah", lang)
                        : rating === 3
                          ? t("Holding", "Bertahan", lang)
                          : t("Stable", "Stabil", lang)
                      }
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {allRated && !showRecommendation && (
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setShowRecommendation(true)}
                style={{ padding: "14px 36px", background: orange, color: "white", border: "none", borderRadius: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.06em" }}
              >
                {t("Show my starting point", "Tunjukkan titik awal saya", lang)}
              </button>
            </div>
          )}

          {showRecommendation && lowestAnchor && (
            <div style={{ background: "white", borderRadius: 16, padding: "36px 32px", border: `2px solid color-mix(in oklch, ${lowestAnchor.color} 30%, white)`, animation: "fadeIn 0.3s ease" }}>
              <p style={{ ...eyebrow(), marginBottom: 12 }}>
                {t("Start Here", "Mulai dari Sini", lang)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ color: lowestAnchor.color, display: "flex" }}><lowestAnchor.icon size={36} strokeWidth={1.75} aria-hidden="true" /></span>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 20, color: lowestAnchor.color, margin: 0 }}>
                    {t(lowestAnchor.en_title, lowestAnchor.id_title, lang)} {t("Anchor", "Jangkar", lang)}
                  </h3>
                  <p style={{ fontSize: 13, color: bodyText, fontStyle: "italic", margin: "4px 0 0" }}>
                    {t("Your lowest-rated anchor", "Jangkar yang Anda nilai paling rendah", lang)}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: bodyText }}>
                {lang === "id" ? RECOMMENDATIONS[lowestAnchor.key].id : RECOMMENDATIONS[lowestAnchor.key].en}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* THE UNSHAKEABLE CORE: BIBLICAL REFLECTION */}
      <section style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow(), marginBottom: 16 }}>
            {t("The Unshakeable Core", "Inti yang Tidak Tergoyahkan", lang)}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: offWhite, marginBottom: 40 }}>
            {t("Identity in Christ", "Identitas di dalam Kristus", lang)}
          </h2>

          {/* Matthew 4: Jesus in the desert */}
          <div style={{ display: "flex", gap: 20, marginBottom: 36, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "oklch(32% 0.10 260)", display: "flex", alignItems: "center", justifyContent: "center", color: orange }}>
              <Mountain size={20} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div>
              <p style={{ ...eyebrow(), marginBottom: 8 }}>
                {t("Jesus in the Desert", "Yesus di Padang Gurun", lang)}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(82% 0.03 80)", margin: 0 }}>
                {t(
                  "In Matthew 4, every temptation opened with the same challenge: 'If you are the Son of God...' Bread and kingdoms were the surface. Underneath, the attack was on identity. Satan wanted Jesus to act as though his identity needed proving. But Jesus had already heard his Father's voice at the Jordan: 'This is my Son, whom I love.' He had nothing to prove. His identity was settled before the pressure began.",
                  "Dalam Matius 4, setiap pencobaan dibuka dengan tantangan yang sama: 'Jika Engkau Anak Allah...' Roti dan kerajaan hanya di permukaan. Di baliknya, yang diserang adalah identitas. Iblis ingin Yesus bertindak seolah-olah identitas-Nya perlu dibuktikan. Tetapi Yesus sudah mendengar suara Bapa-Nya di Sungai Yordan: 'Inilah Anak-Ku yang Kukasihi.' Ia tidak perlu membuktikan apa pun. Identitas-Nya sudah pasti sebelum tekanan datang.",
                  lang
                )}
              </p>
              {/* Verse reference */}
              <p style={{ marginTop: 14, fontSize: 13, color: "oklch(60% 0.05 260)" }}>
                <button type="button" onClick={() => setActiveVerse("matt-4-3-4")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, textDecoration: "underline dotted", padding: 0 }}>
                  {lang === "id" ? VERSES["matt-4-3-4"].ref_id : VERSES["matt-4-3-4"].ref}
                </button>
              </p>
            </div>
          </div>

          {/* Paul: cross-cultural identity */}
          <div style={{ display: "flex", gap: 20, marginBottom: 36, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "oklch(32% 0.10 260)", display: "flex", alignItems: "center", justifyContent: "center", color: orange }}>
              <Ship size={20} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div>
              <p style={{ ...eyebrow(), marginBottom: 8 }}>
                {t("Paul, the Cross-Cultural Leader", "Paulus, Pemimpin Lintas Budaya", lang)}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "oklch(82% 0.03 80)", margin: 0 }}>
                {t(
                  "Paul was the model cross-cultural leader: a Jew among Gentiles, a Roman citizen among the powerless, a theologian who worked with his hands, a church planter who was beaten, jailed, shipwrecked and abandoned by colleagues. His identity was under attack at every turn. What held him? Performance could not, since he called himself the worst of sinners. Success could not either, since the churches he planted were often chaotic. What held him was Colossians 3:3: his life was hidden with Christ in God. Hidden there, he was safe.",
                  "Paulus adalah teladan pemimpin lintas budaya: seorang Yahudi di tengah bangsa-bangsa lain, warga Romawi di tengah orang-orang yang tak berdaya, seorang teolog yang bekerja dengan tangannya sendiri, seorang perintis jemaat yang dipukuli, dipenjara, mengalami karam kapal dan ditinggalkan rekan-rekannya. Identitasnya diserang di setiap langkah. Apa yang menopangnya? Bukan kinerja, karena ia menyebut dirinya orang berdosa yang paling besar. Bukan juga keberhasilan, karena jemaat-jemaat yang ia rintis sering kacau. Yang menopangnya adalah Kolose 3:3: hidupnya tersembunyi bersama Kristus di dalam Allah. Tersembunyi di sana, ia aman.",
                  lang
                )}
              </p>
            </div>
          </div>

          {/* Psalm 46 */}
          <div style={{ marginTop: 40, background: "oklch(28% 0.10 260)", borderRadius: 12, padding: "28px 32px" }}>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 20, color: "oklch(88% 0.04 80)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 12, textAlign: "center" }}>
              "{lang === "id" ? VERSES["psalm-46-1-2"].id : VERSES["psalm-46-1-2"].en}"
            </p>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={() => setActiveVerse("psalm-46-1-2")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textDecoration: "underline dotted" }}>
                {lang === "id" ? VERSES["psalm-46-1-2"].ref_id : VERSES["psalm-46-1-2"].ref}
              </button>
            </div>
          </div>

          {/* Meditation paragraph */}
          <div style={{ marginTop: 32, padding: "0 0 8px" }}>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "oklch(78% 0.03 80)", fontStyle: "italic", textAlign: "center" }}>
              {t(
                "Psalm 46 speaks to anyone in crisis: when the earth gives way, when mountains fall into the sea, when nations rage and kingdoms crumble. It does not ask you to deny the pressure. It invites you to stand inside an identity the pressure cannot reach, as someone known and kept by God. 'Therefore we will not fear' looks the circumstances in the face and says who we are in the middle of them.",
                "Mazmur 46 berbicara kepada siapa pun yang sedang dalam krisis: ketika bumi berubah, ketika gunung-gunung goncang di dalam laut, ketika bangsa-bangsa ribut dan kerajaan-kerajaan goyah. Mazmur ini tidak meminta Anda menyangkal tekanan. Mazmur ini mengajak Anda berdiri di dalam identitas yang tidak bisa dijangkau tekanan, sebagai orang yang dikenal dan dijaga Tuhan. 'Sebab itu kita tidak akan takut' menatap keadaan apa adanya dan menyatakan siapa kita di tengah-tengahnya.",
                lang
              )}
            </p>
          </div>

          {/* Closing prayer */}
          <div style={{ marginTop: 36, background: "oklch(26% 0.09 260)", borderRadius: 12, padding: "28px 32px", textAlign: "center" }}>
            <p style={{ ...eyebrow(), marginBottom: 16 }}>
              {t("A Prayer", "Sebuah Doa", lang)}
            </p>
            <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 18, color: "oklch(88% 0.04 80)", lineHeight: 1.85, fontStyle: "italic", margin: 0 }}>
              {t(
                "Lord, when the pressure tells me who I am, remind me who You say I am. When the work is fruitless and the season is long, let my identity rest on what You have spoken, more than on what I produce. You have engraved my name on the palms of Your hands. That is enough. That is everything. Amen.",
                "Tuhan, ketika tekanan memberitahuku siapa aku, ingatkan aku tentang apa yang Engkau katakan tentang diriku. Ketika pekerjaan tidak menghasilkan buah dan musimnya panjang, biarlah identitasku bersandar pada apa yang Engkau firmankan, bukan pada apa yang aku hasilkan. Engkau telah mengukir namaku di telapak tangan-Mu. Itu cukup. Itu segalanya. Amin.",
                lang
              )}
            </p>
            <p style={{ marginTop: 16, fontSize: 12, color: orange, fontWeight: 700, letterSpacing: "0.08em" }}>
              <button type="button" onClick={() => setActiveVerse("isa-49-16")} style={{ background: "none", border: "none", cursor: "pointer", color: orange, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textDecoration: "underline dotted", padding: 0 }}>
                {lang === "id" ? VERSES["isa-49-16"].ref_id : VERSES["isa-49-16"].ref}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* KEY TAKEAWAYS */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow() }}>
            {t("Key Takeaways", "Poin Penting", lang)}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: navy, marginBottom: 48, lineHeight: 1.2, fontStyle: "italic" }}>
            {t("What to Carry Forward", "Yang Perlu Anda Bawa", lang)}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {TAKEAWAYS.map((item, i) => (
              <div key={i} style={{ background: "white", borderRadius: 10, padding: "24px 28px", borderLeft: `4px solid ${orange}`, display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0, marginTop: -2 }}>
                  {i + 1}
                </div>
                <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(15px, 1.7vw, 17px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>
                  {t(item.en, item.id, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SourcesDropdown sources={SOURCES} lang={lang} />

      {/* VERSE POPUP */}
      {activeVerse && VERSES[activeVerse as keyof typeof VERSES] && (() => {
        const v = VERSES[activeVerse as keyof typeof VERSES];
        return (
          <div onClick={() => setActiveVerse(null)} style={{ position: "fixed", inset: 0, background: "oklch(10% 0.05 260 / 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: offWhite, borderRadius: 16, padding: "40px 36px", maxWidth: 520, width: "100%" }}>
              <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 21, lineHeight: 1.65, color: navy, fontStyle: "italic", marginBottom: 16 }}>
                "{lang === "id" ? v.id : v.en}"
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: orange, letterSpacing: "0.08em", marginBottom: 24 }}>
                {lang === "id" ? v.ref_id : v.ref} ({lang === "id" ? "TB" : "NIV"})
              </p>
              <button type="button" onClick={() => setActiveVerse(null)} style={{ minHeight: 44, padding: "10px 24px", background: navy, color: offWhite, border: "none", borderRadius: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 700, cursor: "pointer" }}>
                {t("Close", "Tutup", lang)}
              </button>
            </div>
          </div>
        );
      })()}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
