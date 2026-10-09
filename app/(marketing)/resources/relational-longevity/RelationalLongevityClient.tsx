"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";

// --- TYPES ------------------------------------------------------------------

type Lang = "en" | "id";
type Props = { userPathway: string | null; isSaved: boolean };

const tFn = (en: string, id: string, lang: Lang): string =>
  lang === "en" ? en : id;

// --- VERSES -----------------------------------------------------------------

const VERSES = {
  "col-3-14": {
    en_ref: "Colossians 3:14",
    id_ref: "Kolose 3:14",
    en: "And over all these virtues put on love, which binds them all together in perfect unity.",
    id: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
    en_version: "NIV",
    id_version: "TB",
  },
  "acts-15-39": {
    en_ref: "Acts 15:39",
    id_ref: "Kisah Para Rasul 15:39",
    en: "They had such a sharp disagreement that they parted company.",
    id: "Hal itu menimbulkan perselisihan yang tajam, sehingga mereka berpisah.",
    en_version: "NIV",
    id_version: "TB",
  },
};

// --- SUPERSCRIPT HELPER -----------------------------------------------------

function withSup(text: string): React.ReactNode {
  const parts = text.split(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^[¹²³⁴⁵⁶⁷⁸⁹⁰]+$/.test(part) ? (
      <span key={i} style={{ color: "oklch(65% 0.15 45)", fontWeight: 700 }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

// --- RICH TEXT (links + superscripts) ----------------------------------------
// Marker syntax: [[phrase -> /resources/slug]] becomes an inline link.

function rich(text: string): React.ReactNode {
  const parts = text.split(/(\[\[[^\]]+?->[^\]]+?\]\])/);
  if (parts.length === 1) return withSup(text);
  return parts.map((part, i) => {
    const m = part.match(/^\[\[(.+?)\s*->\s*(.+?)\]\]$/);
    if (m) {
      return (
        <Link
          key={i}
          href={m[2]}
          style={{
            color: "oklch(65% 0.15 45)",
            fontWeight: 700,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          {m[1]}
        </Link>
      );
    }
    return <span key={i}>{withSup(part)}</span>;
  });
}

// --- SKILL SECTIONS ---------------------------------------------------------

type SkillKey = "listening" | "conflict" | "loss";

const SKILLS: {
  key: SkillKey;
  accentColor: string;
  accentBg: string;
  en_label: string;
  id_label: string;
  en_subtitle: string;
  id_subtitle: string;
  en_intro: string;
  id_intro: string;
  en_scenario_heading: string;
  id_scenario_heading: string;
  en_scenario: string;
  id_scenario: string;
  en_typical_label: string;
  id_typical_label: string;
  en_typical: string;
  id_typical: string;
  en_better_label: string;
  id_better_label: string;
  en_better: string;
  id_better: string;
  en_technique_heading: string;
  id_technique_heading: string;
  en_technique_steps: { label: string; body: string }[];
  id_technique_steps: { label: string; body: string }[];
  en_closing?: string;
  id_closing?: string;
}[] = [
  {
    key: "listening",
    accentColor: "oklch(45% 0.14 200)",
    accentBg: "oklch(45% 0.14 200 / 0.08)",
    en_label: "Loving Listening",
    id_label: "Mendengarkan dengan Kasih",
    en_subtitle: "The shift from advice-giver to question-asker",
    id_subtitle: "Beralih dari pemberi saran menjadi penanya",
    en_intro:
      "Most of us were trained to fix, advise and respond quickly. We offer solutions before the other person has finished speaking. In cross-cultural teams, where so much context stays hidden, the first skill is simple: stay longer in the question. Loving listening is an active choice. You try to understand before you are understood, and you ask before you assume.",
    id_intro:
      "Sebagian besar dari kita dilatih untuk memperbaiki, memberi saran dan menanggapi dengan cepat. Kita menawarkan solusi sebelum orang lain selesai bicara. Dalam tim lintas budaya, banyak hal yang tidak kelihatan. Karena itu, keterampilan pertama itu sederhana: bertahanlah lebih lama dalam pertanyaan. Mendengarkan dengan kasih adalah pilihan yang disengaja. Anda berusaha memahami sebelum dipahami, dan bertanya sebelum berasumsi.",
    en_scenario_heading: "The scenario",
    id_scenario_heading: "Skenario",
    en_scenario:
      "A colleague from a different cultural background approaches you after a team meeting. She says quietly: \"I'm not sure I can keep going like this. Everything feels so heavy.\"",
    id_scenario:
      "Seorang kolega dari latar belakang budaya yang berbeda menghampiri Anda setelah rapat tim. Dia berkata pelan: \"Saya tidak yakin bisa terus seperti ini. Semuanya terasa begitu berat.\"",
    en_typical_label: "Typical response",
    id_typical_label: "Respons umum",
    en_typical:
      "\"I know how you feel. Have you tried taking some time off? You probably just need rest. Things will get better. Remember why you're here. Let me know if I can help with your workload.\"",
    id_typical:
      "\"Saya mengerti perasaan Anda. Sudahkah Anda mencoba mengambil waktu istirahat? Mungkin Anda hanya perlu istirahat. Semuanya akan membaik. Ingat kenapa Anda ada di sini. Kabari saya kalau saya bisa membantu meringankan beban kerja Anda.\"",
    en_better_label: "Loving listening response",
    id_better_label: "Respons mendengarkan dengan kasih",
    en_better:
      "\"That sounds really hard. [Pause.] What's making it feel the heaviest right now?\" Then wait. Fully. Don't rescue, don't redirect. The pause may feel awkward, but it is often where the real issue comes to the surface.",
    id_better:
      "\"Kedengarannya sangat berat. [Jeda.] Apa yang paling membuatnya terasa berat saat ini?\" Lalu tunggu dengan sungguh-sungguh. Jangan buru-buru menolong, jangan mengalihkan pembicaraan. Jeda itu mungkin terasa canggung, tetapi sering kali di situlah masalah yang sebenarnya muncul.",
    en_technique_heading: "The technique: Reflect, Ask, Wait",
    id_technique_heading: "Tekniknya: Cerminkan, Tanyakan, Tunggu",
    en_technique_steps: [
      {
        label: "Reflect",
        body: "Mirror back what you heard. Keep it short: \"That sounds exhausting.\" \"It sounds like something shifted recently.\" This tells the other person you received what they said. Mindful listening is one of the core skills in intercultural conflict work, and it starts here.⁴",
      },
      {
        label: "Ask",
        body: "Ask one open question, not a checklist. \"What feels hardest right now?\" or \"Where is most of the weight coming from?\" One question, then stop. A string of questions can feel like an interrogation, especially in high-context cultures, and people go quiet.",
      },
      {
        label: "Wait",
        body: "Silence is not a problem to fix. In many high-context cultures, a pause before answering shows respect and careful thought. People raised in more direct cultures often rush to fill the gap, yet the real answer often forms in that silence. Give it 5 seconds. Then 10.",
      },
    ],
    id_technique_steps: [
      {
        label: "Cerminkan",
        body: "Ulangi apa yang Anda dengar. Cukup singkat: \"Kedengarannya melelahkan.\" \"Sepertinya ada yang berubah belakangan ini.\" Ini menunjukkan bahwa Anda sungguh menerima apa yang dia katakan. Mendengarkan dengan penuh perhatian adalah salah satu keterampilan inti dalam menangani konflik antarbudaya, dan semuanya dimulai di sini.⁴",
      },
      {
        label: "Tanyakan",
        body: "Ajukan satu pertanyaan terbuka, bukan daftar periksa. \"Apa yang paling berat saat ini?\" atau \"Dari mana sebagian besar beban itu datang?\" Satu pertanyaan, lalu berhenti. Rentetan pertanyaan bisa terasa seperti interogasi, terutama dalam budaya konteks tinggi, dan orang pun jadi diam.",
      },
      {
        label: "Tunggu",
        body: "Keheningan bukan masalah yang harus diperbaiki. Dalam banyak budaya konteks tinggi, jeda sebelum menjawab menunjukkan rasa hormat dan pemikiran yang matang. Orang dari budaya yang lebih langsung sering buru-buru mengisi keheningan, padahal jawaban yang sebenarnya sering terbentuk di sana. Beri waktu 5 detik. Lalu 10.",
      },
    ],
  },
  {
    key: "conflict",
    accentColor: "oklch(50% 0.17 30)",
    accentBg: "oklch(50% 0.17 30 / 0.08)",
    en_label: "Handling Conflict Well",
    id_label: "Menangani Konflik dengan Baik",
    en_subtitle: "Naming conflict early, in a way that fits the culture",
    id_subtitle: "Mengungkapkan konflik sejak dini, dengan cara yang sesuai budaya",
    en_intro: "Conflict is normal on every team. It is not a sign that the team is failing. On cross-cultural teams it often shows up quietly, as silence or distance, before anyone says a word.⁵",
    id_intro: "Konflik itu wajar di setiap tim. Konflik bukan tanda bahwa tim sedang gagal. Dalam tim lintas budaya, konflik sering muncul diam-diam, dalam bentuk keheningan atau jarak, sebelum ada yang mengatakan apa pun.⁵",
    en_scenario_heading: "The scenario",
    id_scenario_heading: "Skenario",
    en_scenario: "A senior team member keeps dismissing ideas from a junior colleague in team meetings. He is not aggressive, just consistent. The junior colleague says nothing in the meetings, but starts pulling back from team activities.",
    id_scenario: "Seorang anggota tim senior terus mengabaikan ide dari kolega junior dalam rapat tim. Dia tidak agresif, tetapi konsisten. Kolega junior tidak berkata apa-apa dalam rapat, tetapi mulai menarik diri dari kegiatan tim.",
    en_typical_label: "A common response",
    id_typical_label: "Respons yang umum",
    en_typical: "The leader notices the junior colleague is quieter but says nothing. It seems small, and raising it might embarrass the senior team member. The hope is that it will pass.",
    id_typical: "Pemimpin melihat kolega junior itu menjadi lebih pendiam, tetapi tidak berkata apa-apa. Kelihatannya masalah kecil, dan membicarakannya bisa mempermalukan anggota tim senior. Harapannya, masalah itu akan berlalu sendiri.",
    en_better_label: "A better response",
    id_better_label: "Respons yang lebih baik",
    en_better: "The leader talks with the junior colleague privately first: \"I've noticed you've been quieter recently. Is there something I should be aware of?\" Then the leader [[names the pattern with the senior colleague -> /resources/giving-feedback-across-cultures]], also in private, or through a trusted go-between if that fits the culture better.⁵",
    id_better: "Pemimpin lebih dulu berbicara secara pribadi dengan kolega junior itu: \"Saya perhatikan Anda lebih pendiam belakangan ini. Apakah ada sesuatu yang perlu saya ketahui?\" Setelah itu, pemimpin [[mengungkapkan pola tersebut kepada kolega senior -> /resources/giving-feedback-across-cultures]], juga secara pribadi, atau melalui orang ketiga yang dipercaya jika cara itu lebih sesuai dengan budayanya.⁵",
    en_technique_heading: "Four things to keep in mind",
    id_technique_heading: "Empat hal yang perlu diingat",
    en_technique_steps: [
      { label: "Unnamed conflict piles up", body: "Conflict that is not named does not disappear. Small hurts are stored up and may come out later, all at once. This is sometimes called [[gunnysacking -> /resources/healthy-conflict]]." },
      { label: "Giving way or avoiding?", body: "Letting something go can be an act of love. It can also be avoidance. Three questions help tell them apart: Was the matter named, at least to yourself and in prayer? Is it finished, with no bad feeling left? Has it stayed away, with no need to bring it back?" },
      { label: "Indirect naming is still naming", body: "Where [[face -> /resources/healthy-conflict#mc-face]] matters, naming a conflict does not have to be direct or public. It can happen in a private conversation, through a story, or with help from a trusted go-between.⁵⁶ What matters is that it is named and not left hidden." },
      { label: "Name it early", body: "A conflict is often easier to talk about in the early stages, while both people still want each other to win. Waiting for a crisis can make the conversation more difficult." },
    ],
    id_technique_steps: [
      { label: "Konflik yang tidak diungkapkan menumpuk", body: "Konflik yang tidak diungkapkan tidak hilang. Luka-luka kecil terus disimpan dan bisa keluar sekaligus di kemudian hari. Hal ini kadang disebut [[gunnysacking -> /resources/healthy-conflict]]." },
      { label: "Mengalah atau menghindar?", body: "Membiarkan sesuatu berlalu bisa menjadi tindakan kasih. Bisa juga menjadi bentuk menghindar. Tiga pertanyaan ini membantu membedakannya: Apakah persoalan itu sudah diungkapkan, setidaknya kepada diri sendiri dan dalam doa? Apakah sudah selesai, tanpa rasa tidak enak yang tersisa? Apakah persoalan itu tidak muncul lagi, tanpa perlu diungkit kembali?" },
      { label: "Mengungkapkan secara tidak langsung juga termasuk mengungkapkan", body: "Ketika [[menjaga muka -> /resources/healthy-conflict#mc-face]] dianggap penting, mengungkapkan konflik tidak harus dilakukan secara langsung atau di depan umum. Bisa lewat percakapan pribadi, lewat cerita, atau dengan bantuan orang ketiga yang dipercaya.⁵⁶ Yang penting, konflik itu diungkapkan dan tidak dibiarkan tersembunyi." },
      { label: "Ungkapkan sejak dini", body: "Konflik sering lebih mudah dibicarakan di tahap awal, ketika kedua pihak masih sama-sama menginginkan yang terbaik bagi satu sama lain. Menunggu sampai terjadi krisis bisa membuat percakapan lebih sulit." },
    ],
    en_closing: "To go deeper, see [[Creating Healthy Conflict -> /resources/healthy-conflict]], or explore the five conflict styles in [[Conflict Resolution -> /resources/conflict-resolution]].",
    id_closing: "Untuk pembahasan lebih dalam, lihat [[Konflik yang Sehat -> /resources/healthy-conflict]], atau pelajari lima gaya konflik dalam [[Resolusi Konflik -> /resources/conflict-resolution]].",
  },
  {
    key: "loss",
    accentColor: "oklch(42% 0.12 290)",
    accentBg: "oklch(42% 0.12 290 / 0.08)",
    en_label: "Processing Loss Together",
    id_label: "Mengolah Kehilangan Bersama",
    en_subtitle: "The unique grief of cross-cultural life",
    id_subtitle: "Duka unik kehidupan lintas budaya",
    en_intro:
      "Cross-cultural workers don't just experience losses. They accumulate them. Every departure, transition and goodbye is a small grief that rarely gets named, let alone processed. Families serving abroad and international team members often live with compacted grief: losses stack up faster than they can be processed, and field culture can make grieving feel out of place. Relational breakdown often starts here, in loss nobody has put into words, long before any open conflict.",
    id_intro:
      "Pekerja lapangan tidak hanya mengalami kehilangan. Kehilangan itu menumpuk. Setiap kepergian, perpindahan dan perpisahan adalah duka kecil yang jarang diungkapkan, apalagi diolah. Keluarga pekerja lapangan dan anggota tim internasional sering hidup dengan duka yang menumpuk: kehilangan datang lebih cepat daripada yang bisa diolah, dan budaya lapangan bisa membuat berduka terasa tidak pantas. Kerusakan relasional sering dimulai di sini, dalam kehilangan yang tidak pernah diungkapkan, jauh sebelum ada konflik terbuka.",
    en_scenario_heading: "What accumulated loss looks like",
    id_scenario_heading: "Seperti apa kehilangan yang menumpuk",
    en_scenario:
      "A team member has been on the field for four years. In that time two close colleagues have left, their child has changed schools twice, their home church has changed leadership, they were evacuated once during a political crisis with 48 hours to leave, and last month their closest local friend moved away. Each loss was brief. None was formally acknowledged. They arrive at team meetings on time, carry their responsibilities and laugh at the right moments. Inside, they are running on empty.",
    id_scenario:
      "Seorang anggota tim sudah empat tahun di lapangan. Selama itu, dua kolega dekat sudah pergi, anaknya pindah sekolah dua kali, gereja asalnya berganti pemimpin, dia pernah dievakuasi saat krisis politik dan hanya punya 48 jam untuk pergi, dan bulan lalu sahabat lokal terdekatnya pindah kota. Setiap kehilangan terjadi sebentar. Tidak satu pun diakui secara resmi. Dia datang ke rapat tepat waktu, menjalankan tanggung jawabnya dan tertawa di saat yang tepat. Di dalam, dia kehabisan tenaga.",
    en_typical_label: "What teams typically miss",
    id_typical_label: "Yang biasanya dilewatkan tim",
    en_typical:
      "Teams that run well on tasks often have no language for grief. [[Debriefs -> /resources/debriefing-reflection]] focus on tasks, logistics and planning, and may not ask: \"What have we lost this time? What do we need to grieve before we move on?\" Many workers never get a debrief at all. One recent survey found only 14% of returning workers had received one.⁷ Unnamed loss has a cost: people disengage, resentment toward leaders grows, and some end up leaving.",
    id_typical:
      "Tim yang berjalan baik dalam tugas sering tidak punya bahasa untuk duka. [[Debriefing -> /resources/debriefing-reflection]] berfokus pada tugas, logistik dan rencana, dan sering tidak bertanya: \"Apa yang telah hilang dari kita di masa ini? Apa yang perlu kita beri waktu untuk berduka sebelum melangkah?\" Banyak pekerja bahkan tidak pernah mendapat debriefing. Sebuah survei terbaru menemukan hanya 14% pekerja yang pulang yang pernah menerimanya.⁷ Kehilangan yang tidak diungkapkan ada harganya: orang menarik diri, kepahitan terhadap pemimpin tumbuh, dan sebagian akhirnya pergi.",
    en_better_label: "How to create space for loss",
    id_better_label: "Cara memberi tempat bagi duka",
    en_better:
      "It starts with the leader naming their own losses first. This is honest modelling, not a show of vulnerability: \"Before we look at the quarter ahead, I want to name something we've lost. Sarah leaving took something from this team. I miss working with her. Does anyone else want to name what they've been carrying?\" Naming, inviting and not rushing past builds the relational safety that helps people stay.",
    id_better:
      "Semuanya dimulai dari pemimpin yang lebih dulu mengungkapkan kehilangannya sendiri. Ini teladan yang jujur, bukan pertunjukan kerentanan: \"Sebelum kita membahas tiga bulan ke depan, saya ingin mengungkapkan sesuatu yang telah hilang dari kita. Kepergian Sarah membuat tim ini kehilangan sesuatu. Saya rindu bekerja bersamanya. Adakah yang ingin berbagi tentang beban yang sedang dipikul?\" Mengungkapkan, mengundang dan tidak buru-buru melewatinya membangun rasa aman yang membantu orang bertahan.",
    en_technique_heading: "Three practices for teams",
    id_technique_heading: "Tiga praktik untuk tim",
    en_technique_steps: [
      {
        label: "The goodbye ritual",
        body: "Every departure deserves a proper farewell. Go beyond a cake and a card: give it a structured moment where the team speaks honestly about what this person gave and what leaves with them. A goodbye ritual is grief hygiene. It keeps unspoken loss from piling up.",
      },
      {
        label: "The quarterly grief check",
        body: "Once a quarter, before forward planning, add one question to the team meeting: \"What has this team lost, in people, momentum or dreams, that we haven't yet acknowledged?\" Keep a written list where everyone can see it. Naming loss keeps a team resilient, and it is different from wallowing.",
      },
      {
        label: "The personal loss inventory",
        body: "As a leader, ask team members one by one, and often: \"How is the weight of transition sitting with you right now?\" 'How are you doing?' gets a social answer. A specific, honest question gets a real one. Cross-cultural workers often carry losses silently because no one asked. Your question changes that.",
      },
    ],
    id_technique_steps: [
      {
        label: "Ritual perpisahan",
        body: "Setiap kepergian layak mendapat perpisahan yang pantas. Lebih dari kue dan kartu, beri waktu khusus di mana tim berbicara jujur tentang apa yang sudah diberikan orang ini dan apa yang ikut pergi bersamanya. Ritual perpisahan adalah cara merawat duka. Ini menjaga agar kehilangan yang tak terucap tidak menumpuk.",
      },
      {
        label: "Waktu untuk berduka setiap triwulan",
        body: "Sekali setiap triwulan, sebelum membahas rencana ke depan, tambahkan satu pertanyaan di rapat tim: \"Apa yang telah hilang dari tim ini, baik orang, semangat atau impian, yang belum kita akui?\" Simpan daftar tertulis yang bisa dilihat semua orang. Mengungkapkan kehilangan membuat tim tetap tangguh, dan itu berbeda dengan larut dalam kesedihan.",
      },
      {
        label: "Menanyakan kehilangan secara pribadi",
        body: "Sebagai pemimpin, tanyakan kepada anggota tim Anda satu per satu, dan sering: \"Bagaimana Anda menanggung beban masa peralihan ini sekarang?\" 'Apa kabar?' hanya mendapat jawaban basa-basi. Pertanyaan yang spesifik dan jujur mendapat jawaban yang sebenarnya. Pekerja lapangan sering memikul kehilangan dalam diam karena tidak ada yang bertanya. Pertanyaan Anda mengubah itu.",
      },
    ],
  },
];

// --- OBJECTIVES, WHY, TEACHING ----------------------------------------------

const OBJECTIVES: { en: string; id: string }[] = [
  { en: "Explain why team relationships affect how long cross-cultural workers stay on the field.", id: "Menjelaskan mengapa hubungan dalam tim memengaruhi berapa lama pekerja lintas budaya bertahan di lapangan." },
  { en: "Apply the three listening steps (Reflect, Ask, Wait) when a teammate shares a struggle.", id: "Menerapkan tiga langkah mendengarkan (Cerminkan, Tanyakan, Tunggu) ketika rekan tim menceritakan pergumulannya." },
  { en: "Recognise early signs of tension that is not being named, such as a teammate going quiet or pulling back.", id: "Mengenali tanda-tanda awal ketegangan yang belum diungkapkan, misalnya rekan tim yang menjadi diam atau menarik diri." },
  { en: "Distinguish between giving way out of care and avoiding a conflict that needs to be named.", id: "Membedakan antara mengalah karena peduli dan menghindari konflik yang perlu diungkapkan." },
  { en: "Describe two or more ways a team can acknowledge loss, such as goodbyes and grief check-ins.", id: "Menguraikan setidaknya dua cara tim dapat mengakui kehilangan, misalnya berpamitan dan saat khusus untuk membicarakan duka." },
];

const WHY: { en: string; id: string }[] = [
  { en: "Many cross-cultural workers leave the field earlier than they or their organisation planned. The ReMAP II study found that 71% of this attrition was preventable, and peer conflict was among the preventable causes.¹ A US study on worker retention ranked problems with peers fifth among all causes and third among preventable ones.³ Another survey, of 221 agencies, placed team conflict among the top five preventable factors.²", id: "Banyak pekerja lintas budaya meninggalkan lapangan lebih awal daripada yang mereka atau organisasi mereka rencanakan. Studi ReMAP II menemukan bahwa 71% dari kepergian ini sebenarnya bisa dicegah, dan konflik dengan rekan kerja termasuk salah satu penyebab yang bisa dicegah.¹ Sebuah studi di Amerika Serikat tentang alasan pekerja bertahan atau pergi menempatkan masalah dengan rekan kerja di urutan kelima dari semua penyebab, dan urutan ketiga dari penyebab yang bisa dicegah.³ Survei lain terhadap 221 lembaga menempatkan konflik tim di antara lima faktor teratas yang bisa dicegah.²" },
  { en: "When a team relationship breaks down, the cost often reaches further than one person. Years of language learning, local friendships and trust may leave with them. The people who stay may carry hurt that does not get talked about. Over time, a team can lose energy and focus without anyone quite knowing why.", id: "Ketika hubungan dalam tim rusak, dampaknya sering lebih luas daripada satu orang saja. Bertahun-tahun belajar bahasa, persahabatan dengan orang setempat, dan kepercayaan bisa ikut hilang ketika orang itu pergi. Mereka yang tetap tinggal mungkin membawa luka yang tidak dibicarakan. Lama-kelamaan, sebuah tim bisa kehilangan semangat dan fokus tanpa ada yang benar-benar tahu penyebabnya." },
  { en: "Many workers feel unprepared for this. In a 2023 survey, [[conflict resolution -> /resources/conflict-resolution]] was one of the top training needs workers said had not been met.⁷ These are skills, and skills can be learned and practised.", id: "Banyak pekerja merasa tidak siap menghadapi hal ini. Dalam survei tahun 2023, [[penyelesaian konflik -> /resources/conflict-resolution]] termasuk kebutuhan pelatihan utama yang menurut para pekerja belum terpenuhi.⁷ Ini adalah keterampilan, dan keterampilan bisa dipelajari dan dilatih." },
];

const TEACHING: { en_title: string; id_title: string; en: string; id: string }[] = [
  { en_title: "What relational longevity means", id_title: "Apa arti kelanggengan relasional", en: "Relational longevity is the ability of a team's relationships to last over years, through changes in roles, conflict and loss. It does not mean everyone becomes close friends. It means people can keep working together with trust, even after hard seasons. On cross-cultural teams this takes more effort. People bring different ideas about respect, directness and how to handle a problem, and many of those ideas stay unspoken.", id: "Kelanggengan relasional adalah kemampuan hubungan dalam tim untuk bertahan selama bertahun-tahun, melewati perubahan peran, konflik, dan kehilangan. Ini tidak berarti semua orang menjadi sahabat dekat. Artinya, orang tetap bisa bekerja sama dengan saling percaya, bahkan setelah melewati masa yang berat. Dalam tim lintas budaya, hal ini membutuhkan usaha lebih. Setiap orang membawa pandangan yang berbeda tentang rasa hormat, keterusterangan, dan cara menangani masalah, dan banyak dari pandangan itu tidak diucapkan." },
  { en_title: "Small habits, repeated over time", id_title: "Kebiasaan kecil yang diulang dari waktu ke waktu", en: "Long-lasting team relationships are usually built in ordinary moments, not in big events. A teammate feels heard when you give them your full attention and check what you understood.⁴ A tension stays small when someone names it early. A loss feels lighter when the team stops to mark it together. Each of these is a small habit. Repeated over months and years, they become the [[trust -> /resources/building-trust-across-cultures]] a team stands on.", id: "Hubungan tim yang langgeng biasanya dibangun dalam momen-momen biasa, bukan dalam peristiwa besar. Rekan tim merasa didengar ketika Anda memberi perhatian penuh dan memastikan apa yang Anda pahami.⁴ Ketegangan tetap kecil ketika seseorang mengungkapkannya sejak dini. Kehilangan terasa lebih ringan ketika tim berhenti sejenak untuk mengakuinya bersama. Masing-masing adalah kebiasaan kecil. Jika diulang selama berbulan-bulan dan bertahun-tahun, kebiasaan itu menjadi dasar [[kepercayaan -> /resources/building-trust-across-cultures]] dalam tim." },
  { en_title: "Culture shapes how tension shows up", id_title: "Budaya membentuk cara ketegangan muncul", en: "In many cultures, protecting each other's [[face -> /resources/healthy-conflict#mc-face]] matters more than saying a problem out loud.⁵ In Indonesia, values like rukun (harmony) and malu (a sense of shame or social restraint) often lead people to [[express disagreement indirectly -> /resources/understanding-high-context]].⁶ A teammate may go quiet, step back from team activities or speak through someone else. These are often signals and should not be read as indifference. Leaders who learn to notice them can respond before the distance grows.", id: "Di banyak budaya, [[menjaga muka -> /resources/healthy-conflict#mc-face]] satu sama lain lebih penting daripada mengatakan masalah secara terang-terangan.⁵ Di Indonesia, nilai seperti rukun dan malu sering membuat orang menyampaikan ketidaksetujuan [[secara tidak langsung -> /resources/understanding-high-context]].⁶ Rekan tim mungkin menjadi diam, mundur dari kegiatan tim, atau berbicara melalui orang lain. Hal-hal ini sering merupakan sinyal, bukan tanda tidak peduli. Pemimpin yang belajar memperhatikannya dapat menanggapi sebelum jaraknya semakin lebar." },
  { en_title: "Loss is part of the work", id_title: "Kehilangan adalah bagian dari pekerjaan", en: "Cross-cultural teams change often. Colleagues leave, local friends move away, and plans end before they are finished. Each change can bring a sense of loss, even when it is not called that. Making room to talk about these losses can help a team stay healthy.", id: "Tim lintas budaya sering berubah. Rekan kerja pergi, teman setempat pindah, dan rencana berakhir sebelum selesai. Setiap perubahan bisa membawa rasa kehilangan, meskipun tidak disebut demikian. Memberi ruang untuk membicarakan kehilangan ini dapat membantu tim tetap sehat." },
];

// --- SELF-ASSESSMENT --------------------------------------------------------

const ASSESS: { en: string; id: string; en_label: string; id_label: string }[] = [
  { en: "When a teammate shares a struggle, I listen to understand before I offer a fix.", id: "Ketika rekan tim menceritakan pergumulannya, saya mendengarkan untuk memahami sebelum menawarkan solusi.", en_label: "Listening first", id_label: "Mendengarkan lebih dulu" },
  { en: "I check what I heard by saying it back in my own words.", id: "Saya memastikan apa yang saya dengar dengan mengulanginya dalam kata-kata saya sendiri.", en_label: "Checking what I heard", id_label: "Memastikan yang saya dengar" },
  { en: "I notice early signs of tension, such as someone going quiet or pulling back.", id: "Saya memperhatikan tanda-tanda awal ketegangan, misalnya seseorang menjadi diam atau menarik diri.", en_label: "Noticing early signs", id_label: "Memperhatikan tanda awal" },
  { en: "When tension builds, I name it early, in a way that fits the person and the culture.", id: "Ketika ketegangan muncul, saya mengungkapkannya sejak dini, dengan cara yang sesuai dengan orangnya dan budayanya.", en_label: "Naming tension early", id_label: "Mengungkapkan ketegangan sejak dini" },
  { en: "On our team, people can raise a disagreement without fear of losing face.", id: "Di tim kami, orang bisa menyampaikan perbedaan pendapat tanpa takut kehilangan muka.", en_label: "Safe to disagree", id_label: "Aman untuk berbeda pendapat" },
  { en: "I can tell the difference between giving way out of care and avoiding a hard conversation.", id: "Saya bisa membedakan antara mengalah karena peduli dan menghindari percakapan yang sulit.", en_label: "Giving way, not avoiding", id_label: "Mengalah, bukan menghindar" },
  { en: "Our team makes room to talk about what we have lost, as well as what we need to do.", id: "Tim kami memberi ruang untuk membicarakan apa yang hilang, selain apa yang perlu dikerjakan.", en_label: "Talking about loss", id_label: "Membicarakan kehilangan" },
  { en: "When someone leaves the team, we take time to say goodbye well.", id: "Ketika seseorang meninggalkan tim, kami meluangkan waktu untuk berpamitan dengan baik.", en_label: "Saying goodbye well", id_label: "Berpamitan dengan baik" },
  { en: "I trust my teammates enough to tell them when I am struggling.", id: "Saya cukup percaya kepada rekan-rekan tim sehingga berani memberi tahu mereka ketika saya sedang bergumul.", en_label: "Trust to be honest", id_label: "Berani terbuka" },
  { en: "My key relationships on the team are strong enough to get through a real disagreement.", id: "Hubungan-hubungan utama saya dalam tim cukup kuat untuk melewati perbedaan pendapat yang serius.", en_label: "Strong enough to disagree", id_label: "Cukup kuat untuk berbeda pendapat" },
];

const ASSESS_SCALE: { en: string; id: string }[] = [
  { en: "Not at all", id: "Sama sekali tidak" },
  { en: "A little", id: "Sedikit" },
  { en: "Somewhat", id: "Sebagian" },
  { en: "Mostly", id: "Sebagian besar" },
  { en: "Fully", id: "Sepenuhnya" },
];

const ASSESS_BANDS: {
  min: number;
  max: number;
  skill: SkillKey;
  anchor: string;
  en_title: string;
  id_title: string;
  en_body: string;
  id_body: string;
  en_tip: string;
  id_tip: string;
}[] = [
  {
    min: 10,
    max: 24,
    skill: "listening",
    anchor: "mc-listening",
    en_title: "Relationships under strain",
    id_title: "Hubungan yang sedang tertekan",
    en_body: "Several of your team relationships may be carrying more weight than they can hold right now. This is common, especially after a hard season, and it can change. Start small. One honest conversation, or one time of really listening, can begin to rebuild trust.",
    id_body: "Beberapa hubungan dalam tim Anda mungkin sedang menanggung beban yang lebih berat daripada yang bisa ditahan saat ini. Hal ini umum terjadi, terutama setelah masa yang berat, dan bisa berubah. Mulailah dari yang kecil. Satu percakapan yang jujur, atau satu kali sungguh-sungguh mendengarkan, bisa mulai membangun kembali kepercayaan.",
    en_tip: "Pick one teammate this week. Ask one open question, then listen without offering a fix. Which relationship would you most like to see restored?",
    id_tip: "Pilih satu rekan tim minggu ini. Ajukan satu pertanyaan terbuka, lalu dengarkan tanpa menawarkan solusi. Hubungan mana yang paling ingin Anda lihat dipulihkan?",
  },
  {
    min: 25,
    max: 37,
    skill: "conflict",
    anchor: "mc-conflict",
    en_title: "Good foundations, with some thin places",
    id_title: "Dasar yang baik, dengan beberapa bagian yang rapuh",
    en_body: "Many things are working in your team relationships. Some areas may need attention before they wear thin. Your lowest areas show where a small change could help the most.",
    id_body: "Banyak hal sudah berjalan baik dalam hubungan tim Anda. Beberapa bagian mungkin perlu perhatian sebelum menjadi rapuh. Area terendah Anda menunjukkan di mana perubahan kecil bisa paling membantu.",
    en_tip: "Look at your two lowest areas. Is there a tension you have been carrying that is still small enough to name? Who could you talk to about it, and how?",
    id_tip: "Lihat dua area terendah Anda. Adakah ketegangan yang selama ini Anda pendam yang masih cukup kecil untuk diungkapkan? Dengan siapa Anda bisa membicarakannya, dan bagaimana caranya?",
  },
  {
    min: 38,
    max: 50,
    skill: "loss",
    anchor: "mc-loss",
    en_title: "Relationships with staying power",
    id_title: "Hubungan yang punya daya tahan",
    en_body: "Your team relationships seem to have real strength. People are heard, tension gets named, and loss is acknowledged. Strong relationships still need care, especially through changes in the team.",
    id_body: "Hubungan dalam tim Anda tampaknya memiliki kekuatan yang nyata. Orang didengar, ketegangan diungkapkan, dan kehilangan diakui. Hubungan yang kuat tetap perlu dirawat, terutama ketika tim mengalami perubahan.",
    en_tip: "Who on your team might be struggling more quietly than you? Consider how you could help others build the same habits.",
    id_tip: "Siapa di tim Anda yang mungkin sedang bergumul lebih diam-diam daripada Anda? Pikirkan bagaimana Anda bisa membantu orang lain membangun kebiasaan yang sama.",
  },
];

// --- COMPONENT --------------------------------------------------------------

export default function RelationalLongevityClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [openSkill, setOpenSkill] = useState<SkillKey | null>(null);
  const [aStep, setAStep] = useState(0);
  const [aAnswers, setAAnswers] = useState<(number | null)[]>(Array(ASSESS.length).fill(null));

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("relational-longevity");
      setSaved(true);
    });
  }

  const aDone = aStep >= ASSESS.length;
  const aTotal = aAnswers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const aBand = ASSESS_BANDS.find((b) => aTotal >= b.min && aTotal <= b.max) ?? ASSESS_BANDS[0];
  const aLowest = aAnswers
    .map((a, i) => ({ i, s: a ?? 0 }))
    .sort((x, y) => x.s - y.s || x.i - y.i)
    .slice(0, 2);
  function answerQ(score: number) {
    setAAnswers((prev) => {
      const next = [...prev];
      next[aStep] = score;
      return next;
    });
    setAStep((st) => Math.min(st + 1, ASSESS.length));
  }
  function backQ() {
    setAStep((st) => Math.max(0, st - 1));
  }
  function restartA() {
    setAAnswers(Array(ASSESS.length).fill(null));
    setAStep(0);
  }

  // --- BRAND TOKENS ----------------------------------------------------------
  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(96% 0.005 80)";
  const lightGray = "oklch(88% 0.008 80)";
  const bodyText = "oklch(38% 0.05 260)";
  const sans = "var(--font-montserrat),Montserrat,sans-serif";
  const serif = "var(--font-cormorant),'Cormorant Garamond',Georgia,serif";
  const h2Style: React.CSSProperties = {
    fontFamily: serif,
    fontWeight: 600,
    fontSize: "clamp(26px,3.5vw,38px)",
    lineHeight: 1.15,
    color: navy,
    margin: "0 0 20px",
  };
  const h3Style: React.CSSProperties = {
    fontFamily: serif,
    fontWeight: 600,
    fontSize: "clamp(22px,2.8vw,28px)",
    lineHeight: 1.2,
    color: navy,
    margin: "36px 0 10px",
  };
  const bodyP: React.CSSProperties = { fontSize: 15, lineHeight: 1.85, color: bodyText, margin: "0 0 18px" };
  const eyebrow: React.CSSProperties = {
    fontFamily: sans,
    color: orange,
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };

  const verseData = activeVerse ? VERSES[activeVerse as keyof typeof VERSES] : null;

  function VerseRef({ id, children }: { id: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setActiveVerse(id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: orange,
          fontWeight: 700,
          fontFamily: sans,
          fontSize: "inherit",
          padding: 0,
          textDecoration: "underline dotted",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </button>
    );
  }

  // --- RENDER ----------------------------------------------------------------
  return (
    <div style={{ fontFamily: sans, background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      {/* -- Language Bar --------------------------------------------------- */}

      {/* -- Hero ----------------------------------------------------------- */}
      <section style={{ background: navy, padding: "clamp(72px,10vw,96px) 0 clamp(64px,9vw,88px)", position: "relative", overflow: "hidden" }}>
        <img
          src="/images/resources/relational-longevity/hero.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            mixBlendMode: "luminosity",
            pointerEvents: "none",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px", position: "relative" }}>
          <p style={{ ...eyebrow, fontSize: 11, margin: "0 0 12px", lineHeight: 1.4 }}>
            {t("Team & Facilitation", "Tim & Fasilitasi")}
          </p>

          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              color: offWhite,
              margin: "0 0 20px",
              lineHeight: 1.08,
            }}
          >
            {t("Relational Longevity", "Kelanggengan Relasional")}
          </h1>

          <p
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "clamp(18px,2.2vw,23px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.6,
              maxWidth: 600,
              margin: "0 0 32px",
            }}
          >
            {t(
              "Three skills that help cross-cultural teams stay together over the years.",
              "Tiga keterampilan yang membantu tim lintas budaya tetap bersama selama bertahun-tahun."
            )}
          </p>

          {/* Opening question */}
          <div
            style={{
              borderLeft: `3px solid ${orange}`,
              paddingLeft: 20,
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(16px, 1.8vw, 20px)",
                color: "oklch(88% 0.02 80)",
                lineHeight: 1.7,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {t(
                "Think of the last person who left your team or organisation earlier than expected. What was the real reason?",
                "Pikirkan orang terakhir yang meninggalkan tim atau organisasi Anda lebih cepat dari yang diharapkan. Apa alasan sebenarnya?"
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saved || isPending}
              aria-pressed={saved}
              aria-label={
                saved
                  ? t("Saved to your dashboard", "Tersimpan di dasbor Anda")
                  : t("Save this module to your dashboard", "Simpan modul ini ke dasbor Anda")
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
                padding: "10px 24px",
                border: "none",
                borderRadius: 4,
                background: saved ? "oklch(35% 0.05 260)" : orange,
                color: offWhite,
                fontFamily: sans,
                fontSize: 13,
                fontWeight: 700,
                cursor: saved ? "default" : "pointer",
              }}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                <path
                  d="M6 3h12v18l-6-4.5L6 21z"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{saved ? t("Saved to Dashboard", "Tersimpan di Dasbor") : t("Save to Dashboard", "Simpan ke Dasbor")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* -- Objectives ------------------------------------------------------ */}
      <div style={{ background: navy, padding: "clamp(40px,6vw,56px) 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>
          <p style={{ ...eyebrow, fontSize: 11, margin: "0 0 12px", lineHeight: 1.4 }}>
            {t("After This Module", "Setelah Modul Ini")}
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
            {OBJECTIVES.map((o, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  color: "oklch(76% 0.03 80)",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.7,
                }}
              >
                <span aria-hidden="true" style={{ flex: "0 0 3px", height: 20, background: orange, marginTop: 3 }} />
                <span>{lang === "en" ? o.en : o.id}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* -- Why this matters ------------------------------------------------ */}
      <section id="mc-why" style={{ background: offWhite, padding: "clamp(56px,8vw,80px) 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>
          <p style={{ ...eyebrow, fontSize: 11, margin: "0 0 12px", lineHeight: 1.4 }}>
            {t("Why this matters", "Mengapa ini penting")}
          </p>
          <h2 style={h2Style}>
            {t("Relationships affect who stays", "Hubungan memengaruhi siapa yang bertahan")}
          </h2>
          {WHY.map((p, i) => (
            <p key={i} style={{ ...bodyP, marginBottom: i === WHY.length - 1 ? 0 : 18 }}>
              {rich(lang === "en" ? p.en : p.id)}
            </p>
          ))}
        </div>
      </section>

      {/* -- Teaching -------------------------------------------------------- */}
      <section id="mc-teaching" style={{ background: "oklch(95% 0.008 80)", padding: "clamp(56px,8vw,80px) 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>
          <p style={{ ...eyebrow, fontSize: 11, margin: "0 0 12px", lineHeight: 1.4 }}>
            {t("The idea", "Gagasannya")}
          </p>
          <h2 style={h2Style}>
            {t("What keeps team relationships going", "Apa yang membuat hubungan tim bertahan")}
          </h2>
          {TEACHING.map((b, i) => (
            <div key={i}>
              <h3 style={{ ...h3Style, marginTop: i === 0 ? 8 : 36 }}>{lang === "en" ? b.en_title : b.id_title}</h3>
              <p style={{ ...bodyP, marginBottom: 0 }}>{rich(lang === "en" ? b.en : b.id)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -- Three Skills Accordion ------------------------------------------ */}
      <div style={{ padding: "clamp(56px,8vw,80px) 24px", maxWidth: 860, margin: "0 auto" }}>
        <p style={{ ...eyebrow, fontSize: 11, margin: "0 0 12px", lineHeight: 1.4 }}>
          {t("Three Relational Skills", "Tiga Keterampilan Relasional")}
        </p>
        <h2 style={h2Style}>
          {t("Build the skills that keep teams together", "Bangun keterampilan yang menjaga tim tetap bersatu")}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: bodyText,
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 0 52px",
          }}
        >
          {t(
            "Each section is scenario-based. Read the situation, then compare the typical response with the skilled one.",
            "Setiap bagian berbasis skenario. Baca situasinya, lalu lihat perbedaan antara respons yang biasa dan respons yang terampil."
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SKILLS.map((skill, skillIdx) => {
            const isOpen = openSkill === skill.key;
            const label = lang === "en" ? skill.en_label : skill.id_label;
            const subtitle = lang === "en" ? skill.en_subtitle : skill.id_subtitle;

            return (
              <div
                key={skill.key}
                id={`mc-${skill.key}`}
                style={{
                  border: `1px solid ${isOpen ? skill.accentColor : "oklch(88% 0.01 80)"}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Accordion header */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSkill(isOpen ? null : skill.key)}
                  style={{
                    width: "100%",
                    background: isOpen ? skill.accentBg : offWhite,
                    border: "none",
                    cursor: "pointer",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                    transition: "background 0.2s",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      borderRadius: "50%",
                      border: `2px solid ${skill.accentColor}`,
                      color: skill.accentColor,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: serif,
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: 1,
                    }}
                  >
                    {skillIdx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: sans,
                        fontSize: "clamp(15px, 1.8vw, 18px)",
                        fontWeight: 800,
                        color: isOpen ? skill.accentColor : navy,
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 13, color: bodyText }}>{subtitle}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: 20,
                      color: skill.accentColor,
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-flex",
                    }}
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div style={{ padding: "0 28px 36px", background: offWhite }}>
                    {/* Intro */}
                    <p
                      style={{
                        fontSize: 15,
                        color: bodyText,
                        lineHeight: 1.8,
                        marginBottom: 32,
                        paddingTop: 20,
                        borderTop: `2px solid ${skill.accentBg}`,
                      }}
                    >
                      {rich(lang === "en" ? skill.en_intro : skill.id_intro)}
                    </p>

                    {/* Scenario */}
                    <div
                      style={{
                        background: lightGray,
                        borderRadius: 8,
                        padding: "20px 24px",
                        marginBottom: 28,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: sans,
                          fontSize: 11,
                          fontWeight: 700,
                          color: skill.accentColor,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        {lang === "en" ? skill.en_scenario_heading : skill.id_scenario_heading}
                      </p>
                      <p
                        style={{
                          fontFamily: serif,
                          fontSize: "clamp(15px, 1.7vw, 18px)",
                          fontStyle: "italic",
                          color: navy,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {lang === "en" ? skill.en_scenario : skill.id_scenario}
                      </p>
                    </div>

                    {/* Contrast: typical vs. better */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 16,
                        marginBottom: 32,
                      }}
                    >
                      {/* Typical */}
                      <div
                        style={{
                          background: "oklch(52% 0.18 25 / 0.06)",
                          border: "1px solid oklch(52% 0.18 25 / 0.2)",
                          borderRadius: 8,
                          padding: "18px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: sans,
                            fontSize: 11,
                            fontWeight: 700,
                            color: "oklch(48% 0.18 25)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          {lang === "en" ? skill.en_typical_label : skill.id_typical_label}
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: bodyText,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {rich(lang === "en" ? skill.en_typical : skill.id_typical)}
                        </p>
                      </div>

                      {/* Better */}
                      <div
                        style={{
                          background: skill.accentBg,
                          border: `1px solid ${skill.accentColor}40`,
                          borderRadius: 8,
                          padding: "18px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: sans,
                            fontSize: 11,
                            fontWeight: 700,
                            color: skill.accentColor,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          {lang === "en" ? skill.en_better_label : skill.id_better_label}
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: bodyText,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {rich(lang === "en" ? skill.en_better : skill.id_better)}
                        </p>
                      </div>
                    </div>

                    {/* Technique steps */}
                    <div>
                      <p
                        style={{
                          fontFamily: sans,
                          fontSize: 13,
                          fontWeight: 800,
                          color: navy,
                          marginBottom: 16,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {lang === "en" ? skill.en_technique_heading : skill.id_technique_heading}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {(lang === "en" ? skill.en_technique_steps : skill.id_technique_steps).map((step, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              gap: 16,
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: skill.accentColor,
                                color: offWhite,
                                fontFamily: sans,
                                fontSize: 12,
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <p
                                style={{
                                  fontFamily: sans,
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: skill.accentColor,
                                  marginBottom: 4,
                                }}
                              >
                                {step.label}
                              </p>
                              <p
                                style={{
                                  fontSize: 14,
                                  color: bodyText,
                                  lineHeight: 1.75,
                                  margin: 0,
                                }}
                              >
                                {rich(step.body)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(lang === "en" ? skill.en_closing : skill.id_closing) && (
                        <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.75, margin: "24px 0 0" }}>
                          {rich((lang === "en" ? skill.en_closing : skill.id_closing) as string)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* -- Relational Health Check ----------------------------------------- */}
      <div id="self-assessment" style={{ background: lightGray, padding: "96px 24px", scrollMarginTop: 24 }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, fontSize: 11, margin: "0 0 12px", lineHeight: 1.4 }}>
            {t("Self-Assessment", "Penilaian Diri")}
          </p>
          <h2 style={h2Style}>{t("Relational Health Check", "Cek Kesehatan Relasional")}</h2>
          <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: bodyText, lineHeight: 1.8, maxWidth: 620, margin: "0 0 32px" }}>
            {t(
              "Ten statements about your team relationships. Rate each one from 1 to 5 as honestly as you can. There are no right answers.",
              "Sepuluh pernyataan tentang hubungan dalam tim Anda. Nilai masing-masing dari 1 sampai 5 sejujur mungkin. Tidak ada jawaban yang benar atau salah."
            )}
          </p>

          <div
            aria-live="polite"
            style={{
              background: "white",
              borderRadius: 10,
              padding: "28px clamp(18px, 4vw, 32px)",
              borderLeft: `4px solid ${orange}`,
            }}
          >
            {!aDone ? (
              <div key={aStep}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: navy }}>
                    {aStep + 1} {t("of", "dari")} {ASSESS.length}
                  </span>
                  {aStep > 0 && (
                    <button
                      type="button"
                      onClick={backQ}
                      style={{
                        background: "none",
                        border: "none",
                        color: orange,
                        textDecoration: "underline",
                        fontFamily: sans,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        minHeight: 44,
                        padding: "0 8px",
                      }}
                    >
                      {t("Back", "Kembali")}
                    </button>
                  )}
                </div>
                <div style={{ height: 4, background: lightGray, borderRadius: 2, marginBottom: 28 }}>
                  <div
                    style={{
                      height: 4,
                      background: orange,
                      borderRadius: 2,
                      width: `${(aStep / ASSESS.length) * 100}%`,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(19px,2.4vw,24px)",
                    fontWeight: 600,
                    color: navy,
                    lineHeight: 1.5,
                    margin: "0 0 28px",
                  }}
                >
                  {lang === "en" ? ASSESS[aStep].en : ASSESS[aStep].id}
                </p>
                <div role="group" aria-label={lang === "en" ? ASSESS[aStep].en : ASSESS[aStep].id} style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((v) => {
                    const word = lang === "en" ? ASSESS_SCALE[v - 1].en : ASSESS_SCALE[v - 1].id;
                    const selected = aAnswers[aStep] === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={selected}
                        aria-label={`${v}, ${word}`}
                        title={word}
                        onClick={() => answerQ(v)}
                        style={{
                          minHeight: 56,
                          borderRadius: 8,
                          fontFamily: sans,
                          fontSize: 18,
                          fontWeight: 700,
                          cursor: "pointer",
                          background: selected ? navy : "white",
                          color: selected ? offWhite : navy,
                          border: selected ? `2px solid ${navy}` : "2px solid oklch(80% 0.02 260)",
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: bodyText }}>
                  <span>1 = {lang === "en" ? ASSESS_SCALE[0].en : ASSESS_SCALE[0].id}</span>
                  <span>5 = {lang === "en" ? ASSESS_SCALE[4].en : ASSESS_SCALE[4].id}</span>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ ...eyebrow, fontSize: 11, margin: "0 0 8px", lineHeight: 1.4 }}>
                  {t("Your result", "Hasil Anda")}
                </p>
                <p style={{ fontFamily: serif, fontSize: "clamp(40px,6vw,56px)", fontWeight: 700, color: navy, margin: "0 0 4px", lineHeight: 1.1 }}>
                  {aTotal}
                  <span style={{ fontSize: "0.45em" }}> / {ASSESS.length * 5}</span>
                </p>
                <h3
                  style={{
                    fontFamily: serif,
                    fontStyle: "italic",
                    fontSize: "clamp(22px,2.8vw,28px)",
                    fontWeight: 700,
                    color: navy,
                    margin: "0 0 12px",
                  }}
                >
                  {lang === "en" ? aBand.en_title : aBand.id_title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.85, color: bodyText, margin: "0 0 16px" }}>
                  {lang === "en" ? aBand.en_body : aBand.id_body}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: bodyText, margin: "0 0 12px" }}>
                  <strong>{t("Your lowest areas: ", "Area terendah Anda: ")}</strong>
                  {aLowest.map((x) => (lang === "en" ? ASSESS[x.i].en_label : ASSESS[x.i].id_label)).join(", ")}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: bodyText, margin: "0 0 20px" }}>
                  {lang === "en" ? aBand.en_tip : aBand.id_tip}{" "}
                  <a
                    href={`#${aBand.anchor}`}
                    onClick={() => setOpenSkill(aBand.skill)}
                    style={{ color: orange, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    {t("Go to this section", "Buka bagian ini")}
                  </a>
                </p>
                <button
                  type="button"
                  onClick={restartA}
                  style={{
                    background: "white",
                    color: navy,
                    border: `2px solid ${navy}`,
                    borderRadius: 8,
                    fontFamily: sans,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: 44,
                    padding: "0 20px",
                  }}
                >
                  {t("Start again", "Mulai lagi")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* -- Biblical Foundation --------------------------------------------- */}
      <section style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 20 }}>
            {t("Biblical Foundation", "Dasar Alkitab")}
          </p>
          <h2
            style={{
              fontFamily: sans,
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 800,
              color: offWhite,
              marginBottom: 48,
            }}
          >
            {t(
              "Even the best relationships can break, and God still works",
              "Hubungan terbaik pun bisa retak, dan Tuhan tetap bekerja"
            )}
          </h2>

          {/* Verse 1: Colossians 3:14 */}
          <div style={{ marginBottom: 52 }}>
            <p
              style={{
                fontFamily: sans,
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 14,
              }}
            >
              <VerseRef id="col-3-14">
                {lang === "en" ? VERSES["col-3-14"].en_ref : VERSES["col-3-14"].id_ref}
              </VerseRef>
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              &ldquo;{lang === "en" ? VERSES["col-3-14"].en : VERSES["col-3-14"].id}&rdquo;
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
              }}
            >
              {t(
                "Paul's letter to the Colossians lists the clothing of a healthy community: compassion, kindness, humility, gentleness, patience, forbearance and forgiveness. Look at the structure. Love is not just one more item on the list. It is what binds all the others together. Without love, the other virtues stay isolated skills, good in theory and brittle in practice. Communication techniques alone do not keep cross-cultural teams together. Love expressed through them does. The three skills in this module (listening, handling conflict and processing loss) are love made concrete.",
                "Surat Paulus kepada jemaat di Kolose menyebut 'pakaian' sebuah komunitas yang sehat: belas kasihan, kemurahan, kerendahan hati, kelemahlembutan, kesabaran, saling sabar dan saling mengampuni. Perhatikan susunannya. Kasih bukan sekadar satu butir lagi dalam daftar. Kasihlah yang mengikat semuanya. Tanpa kasih, kebajikan lain hanya menjadi keterampilan yang terpisah, bagus dalam teori tetapi rapuh dalam praktik. Teknik komunikasi saja tidak cukup untuk menjaga tim lintas budaya tetap bersatu. Kasih yang dinyatakan melalui teknik itulah yang menjaganya. Tiga keterampilan dalam modul ini (mendengarkan, menangani konflik dan mengolah kehilangan) adalah kasih yang diwujudkan."
              )}
            </p>
          </div>

          {/* Verse 2: Acts 15:39 */}
          <div
            style={{
              borderTop: "1px solid oklch(35% 0.06 260)",
              paddingTop: 48,
            }}
          >
            <p
              style={{
                fontFamily: sans,
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.1em",
                marginBottom: 14,
              }}
            >
              <VerseRef id="acts-15-39">
                {lang === "en" ? VERSES["acts-15-39"].en_ref : VERSES["acts-15-39"].id_ref}
              </VerseRef>
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: "clamp(18px, 2vw, 23px)",
                fontStyle: "italic",
                color: offWhite,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              &ldquo;{lang === "en" ? VERSES["acts-15-39"].en : VERSES["acts-15-39"].id}&rdquo;
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              {withSup(
                t(
                  "This verse has no neat happy ending. Paul and Barnabas had been sent out together by the church in Antioch and had planted churches across Galatia. Then they had a disagreement so sharp (the Greek word is paroxysmos) that they parted ways.⁸ The Bible does not play this down. It reports it plainly. Both men kept serving, each with a new partner. And the story did not end there. Paul later names Barnabas as a fellow worker (1 Corinthians 9:6) and asks for Mark, calling him useful for ministry (2 Timothy 4:11), which suggests the relationships were eventually restored.⁸",
                  "Ayat ini tidak punya akhir bahagia yang rapi. Paulus dan Barnabas diutus bersama oleh jemaat di Antiokhia dan telah mendirikan jemaat-jemaat di Galatia. Lalu mereka berselisih begitu tajam (kata Yunaninya paroxysmos) sehingga mereka berpisah.⁸ Alkitab tidak mengecilkan hal ini. Alkitab mencatatnya apa adanya. Keduanya tetap melayani, masing-masing dengan rekan baru. Dan ceritanya tidak berhenti di situ. Paulus kemudian menyebut Barnabas sebagai rekan sepelayanan (1 Korintus 9:6) dan meminta Markus datang karena pelayanannya berguna (2 Timotius 4:11). Ini menunjukkan bahwa hubungan mereka akhirnya dipulihkan.⁸"
                )
              )}
            </p>
            <p
              style={{
                fontSize: 15,
                color: "oklch(76% 0.03 80)",
                lineHeight: 1.8,
              }}
            >
              {t(
                "What this means for you: relational longevity is worth fighting for, and the three skills in this module are how you fight for it. Still, longevity is different from perfection. Some relationships will break despite your best efforts. Your relational health is measured by whether you brought love, honesty and humility to each relationship, and whether you keep doing so, more than by whether every one survived intact.",
                "Artinya bagi Anda: hubungan yang langgeng layak diperjuangkan, dan tiga keterampilan dalam modul ini adalah cara memperjuangkannya. Namun langgeng tidak sama dengan sempurna. Sebagian hubungan akan retak meskipun Anda sudah berusaha sebaik mungkin. Kesehatan hubungan Anda tidak diukur dari apakah semua hubungan bertahan utuh, tetapi dari apakah Anda membawa kasih, kejujuran dan kerendahan hati ke dalamnya, dan terus melakukannya."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* -- Key Takeaways ---------------------------------------------------- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 12 }}>
            {t("Key Takeaways", "Poin Utama")}
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              color: navy,
              fontStyle: "italic",
              lineHeight: 1.2,
              marginBottom: 48,
                          }}
          >
            {t("What to Carry Forward", "Yang Perlu Dibawa")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                en: "Broken team relationships are one of the main preventable reasons people leave the field early. Investing in them is investing in staying power.",
                id: "Hubungan tim yang rusak adalah salah satu alasan utama yang bisa dicegah mengapa orang meninggalkan lapangan lebih awal. Merawatnya berarti membantu orang bertahan.",
              },
              {
                en: "Listen before you fix. Reflect, ask one open question, then wait.",
                id: "Dengarkan sebelum memperbaiki. Cerminkan, ajukan satu pertanyaan terbuka, lalu tunggu.",
              },
              {
                en: "Silence and withdrawal are often signals. Name the pattern privately and gently, before tension hardens or erupts.",
                id: "Diam dan menarik diri sering kali adalah sinyal. Ungkapkan polanya secara pribadi dan lembut, sebelum ketegangan mengeras atau meledak.",
              },
              {
                en: "Name conflict early, while both people still want each other to win. Indirect naming, through a private talk, a story or a trusted go-between, is still naming.",
                id: "Ungkapkan konflik sejak dini, ketika kedua pihak masih sama-sama menginginkan yang terbaik bagi satu sama lain. Mengungkapkan secara tidak langsung, lewat percakapan pribadi, cerita, atau orang ketiga yang dipercaya, juga termasuk mengungkapkan.",
              },
              {
                en: "Name loss out loud. Goodbye rituals and regular grief checks keep unspoken loss from piling up.",
                id: "Ungkapkan kehilangan secara terbuka. Ritual perpisahan dan waktu berduka rutin menjaga agar kehilangan yang tak terucap tidak menumpuk.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 10,
                  padding: "24px 28px",
                  borderLeft: `4px solid ${orange}`,
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(28px, 3vw, 36px)",
                    fontWeight: 700,
                    color: orange,
                    lineHeight: 1,
                    minWidth: 32,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: "clamp(15px, 1.7vw, 17px)",
                    color: bodyText,
                    lineHeight: 1.85,
                    margin: 0,
                  }}
                >
                  {lang === "en" ? item.en : item.id}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Sources ---------------------------------------------------------- */}
      <SourcesDropdown
        lang={lang}
        background={offWhite}
        sources={[
          "Propempo International. \"The Truth About Missionary Attrition.\" Cites the ReMAP II finding that 71% of attrition is preventable, with peer conflict among the preventable causes. https://propempo.com/community/propempo-blog/the-truth-about-missionary-attrition2/",
          "A Life Overseas. \"New data confirms that team conflict is one of the primary factors in missionary attrition.\" Survey of 221 agencies: team conflict ranks among the top five preventable factors. https://www.alifeoverseas.com/new-data-confirms-that-team-conflict-is-one-of-the-primary-factors-in-missionary-attrition/",
          "World Evangelical Alliance Missions Commission. US Report of Findings on Missionary Retention (December 2003). Problems with peers rank fifth overall and third among preventable causes. https://www.worldevangelicals.org/resources/rfiles/res3_95_link_1292358708.pdf",
          "Grothe, T. \"Intercultural Conflict Management\" (8.2), in Exploring Intercultural Communication. LibreTexts. Mindful listening as a core intercultural conflict skill. https://socialsci.libretexts.org/Courses/Butte_College/Exploring_Intercultural_Communication_(Grothe)/08:_Intercultural_Conflict/8.02:_Intercultural_Conflict_Management",
          "Ting-Toomey, S. Face-Negotiation Theory (1985/1988). Face concerns, indirect approaches and third-party mediation in high-context cultures. Summary: https://en.wikipedia.org/wiki/Face_negotiation_theory",
          "\"Exploring Intercultural Communication in Indonesia: Cultural Values, Challenges, and Strategies.\" ResearchGate. On rukun, malu and indirect expression. https://www.researchgate.net/publication/371709788_Exploring_Intercultural_Communication_in_Indonesia_Cultural_Values_Challenges_and_Strategies",
          "A Life Overseas. \"What Missionaries Need Today: 2023 FieldPartner Survey Results.\" Only 14% of returnees had been debriefed; conflict resolution is a top unmet training need. https://www.alifeoverseas.com/what-missionaries-need-today-a-summary-of-the-2023-fieldpartner-survey-results/",
          "ReadingActs. \"Acts 15:36-40: Disagreement with Barnabas.\" On paroxysmos, and how later references to Barnabas and Mark suggest restoration. https://readingacts.com/2019/03/03/acts-1536-40-disagreement-with-barnabas-2/",
        ]}
      />

      {/* -- Verse Popup ----------------------------------------------------- */}
      {activeVerse && verseData && (
        <div
          onClick={() => setActiveVerse(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(10% 0.05 260 / 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: offWhite,
              borderRadius: 12,
              padding: "44px 40px",
              maxWidth: 540,
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: 22,
                lineHeight: 1.7,
                color: navy,
                fontStyle: "italic",
                marginBottom: 20,
              }}
            >
              &ldquo;{lang === "en" ? verseData.en : verseData.id}&rdquo;
            </p>
            <p
              style={{
                fontFamily: sans,
                fontSize: 12,
                fontWeight: 700,
                color: orange,
                letterSpacing: "0.08em",
                marginBottom: 28,
              }}
            >
              {lang === "en" ? verseData.en_ref : verseData.id_ref}{" "}
              ({lang === "en" ? verseData.en_version : verseData.id_version})
            </p>
            <button
              type="button"
              onClick={() => setActiveVerse(null)}
              style={{
                minHeight: 44,
                padding: "10px 24px",
                background: navy,
                color: offWhite,
                border: "none",
                borderRadius: 12,
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("Close", "Tutup")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
